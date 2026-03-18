from __future__ import annotations

import json
import math
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "data" / "research-watch.json"
API_URL = "https://api.openalex.org/works"
LOOKBACK_DAYS = 365
PER_TOPIC = 18
MAILTO = "chenchen.ding@pku.edu.cn"
ALLOWED_TYPES = {"article", "preprint", "review", "peer-review"}
JOURNAL_BONUS = {
    "Global Change Biology": 0.45,
    "Global Ecology and Biogeography": 0.45,
    "Ecography": 0.35,
    "Conservation Biology": 0.35,
    "Biological Conservation": 0.35,
    "Journal of Applied Ecology": 0.3,
    "Ecology Letters": 0.3,
    "Diversity and Distributions": 0.3,
}
KEYWORD_WEIGHTS = {
    "biodiversity": 1.8,
    "species": 1.0,
    "species richness": 1.5,
    "abundance": 1.1,
    "community": 1.0,
    "community structure": 1.4,
    "distribution": 1.4,
    "biogeography": 1.4,
    "monitoring": 1.2,
    "camera trap": 1.2,
    "conservation": 1.6,
    "protected area": 1.4,
    "extinction": 1.8,
    "extirpation": 1.7,
    "risk": 1.1,
    "priority": 1.0,
    "land use": 1.8,
    "climate change": 1.8,
    "global change": 1.5,
    "heatwave": 1.6,
    "dryland": 1.3,
    "bird": 1.2,
    "birds": 1.2,
    "mammal": 1.2,
    "mammals": 1.2,
    "vertebrate": 1.2,
    "vertebrates": 1.2,
    "trait": 1.0,
    "traits": 1.0,
    "ecological model": 1.2,
    "species distribution model": 1.4,
}

TOPIC_PROFILES = [
    {
        "key": "global_change_biodiversity",
        "query": "biodiversity global change climate change ecosystem functioning community structure",
    },
    {
        "key": "land_use_climate_interactions",
        "query": "land use climate change interaction biodiversity predicts community abundance species richness",
    },
    {
        "key": "species_distribution_monitoring",
        "query": "species distribution biodiversity monitoring camera trap new records biogeography",
    },
    {
        "key": "extinction_risk_conservation",
        "query": "extinction risk conservation priority protected areas range shifts vertebrates",
    },
    {
        "key": "dryland_birds_heatwaves",
        "query": "dryland birds heatwaves vulnerability traits high temperature climate change",
    },
    {
        "key": "ecological_modelling_biogeography",
        "query": "ecological modelling biogeography species distributions macroecology conservation planning",
    },
    {
        "key": "biodiversity_change_assessment_conservation",
        "query": "biodiversity change assessment conservation trends monitoring risk protected areas community diversity",
    },
]


def rebuild_abstract(inverted_index: dict[str, list[int]] | None) -> str:
    if not inverted_index:
        return ""
    positions: list[tuple[int, str]] = []
    for word, slots in inverted_index.items():
        for slot in slots:
            positions.append((slot, word))
    positions.sort(key=lambda item: item[0])
    text = " ".join(word for _, word in positions)
    return text.replace(" ,", ",").replace(" .", ".").replace(" ;", ";").strip()


def author_text(authorships: list[dict[str, Any]] | None) -> str:
    if not authorships:
        return ""
    names = [entry.get("author", {}).get("display_name") for entry in authorships]
    names = [name for name in names if name]
    if not names:
        return ""
    if len(names) > 5:
        return ", ".join(names[:5]) + " et al."
    return ", ".join(names)


def get_primary_url(work: dict[str, Any]) -> str:
    for location_key in ("best_oa_location", "primary_location"):
        location = work.get(location_key) or {}
        for url_key in ("landing_page_url", "pdf_url"):
            if location.get(url_key):
                return location[url_key]
    return work.get("doi") or work.get("id") or ""


def get_journal(work: dict[str, Any]) -> str:
    for location_key in ("primary_location", "best_oa_location"):
        location = work.get(location_key) or {}
        source = location.get("source") or {}
        if source.get("display_name"):
            return source["display_name"]
    host_venue = work.get("host_venue") or {}
    return host_venue.get("display_name") or ""


def fetch_topic_results(topic: dict[str, str]) -> list[dict[str, Any]]:
    from_date = (date.today() - timedelta(days=LOOKBACK_DAYS)).isoformat()
    params = {
        "search": topic["query"],
        "filter": f"from_publication_date:{from_date},is_retracted:false",
        "per-page": str(PER_TOPIC),
        "mailto": MAILTO,
    }
    request = Request(
        f"{API_URL}?{urlencode(params)}",
        headers={"User-Agent": f"chenchen-ding-site/1.0 ({MAILTO})"},
    )
    with urlopen(request, timeout=60) as response:
        payload = json.load(response)
    return payload.get("results", [])


def score_item(item: dict[str, Any]) -> float:
    relevance = math.log1p(float(item.get("relevance_score") or 0))
    publication_date = item.get("publication_date")
    recency = 0.0
    if publication_date:
        try:
            days_old = max((date.today() - date.fromisoformat(publication_date)).days, 0)
            recency = max(0.0, 1 - (days_old / LOOKBACK_DAYS))
        except ValueError:
            recency = 0.0
    topic_bonus = min(len(item.get("matched_topic_keys", [])), 3) * 0.08
    keyword_bonus = float(item.get("keyword_score") or 0) * 0.42
    journal_bonus = JOURNAL_BONUS.get(item.get("journal") or "", 0.0)
    return round(relevance * 0.28 + recency * 0.28 + keyword_bonus + journal_bonus + topic_bonus, 4)


def thematic_score(title: str, abstract: str) -> float:
    text = f"{title} {abstract}".lower()
    score = 0.0
    for keyword, weight in KEYWORD_WEIGHTS.items():
        if keyword in text:
            score += weight
    return round(score, 3)


def normalize_work(work: dict[str, Any], topic_key: str) -> dict[str, Any] | None:
    work_type = work.get("type")
    if work_type and work_type not in ALLOWED_TYPES:
        return None

    work_id = work.get("id") or work.get("doi")
    if not work_id:
        return None

    abstract = rebuild_abstract(work.get("abstract_inverted_index"))
    if len(abstract) > 360:
        abstract = abstract[:357].rstrip() + "..."
    title = work.get("display_name") or ""
    keyword_score = thematic_score(title, abstract)
    if keyword_score < 2.2:
        return None

    return {
        "id": work_id,
        "title": title,
        "publication_date": work.get("publication_date"),
        "journal": get_journal(work),
        "authors_text": author_text(work.get("authorships")),
        "abstract": abstract,
        "primary_url": get_primary_url(work),
        "doi_url": work.get("doi") or get_primary_url(work),
        "openalex_url": work.get("id") or "",
        "type": work_type or "",
        "matched_topic_keys": [topic_key],
        "relevance_score": float(work.get("relevance_score") or 0),
        "keyword_score": keyword_score,
    }


def main() -> int:
    items_by_id: dict[str, dict[str, Any]] = {}

    for topic in TOPIC_PROFILES:
        for work in fetch_topic_results(topic):
            normalized = normalize_work(work, topic["key"])
            if not normalized:
                continue
            existing = items_by_id.get(normalized["id"])
            if existing:
                if topic["key"] not in existing["matched_topic_keys"]:
                    existing["matched_topic_keys"].append(topic["key"])
                existing["relevance_score"] = max(existing["relevance_score"], normalized["relevance_score"])
                if len(normalized.get("abstract", "")) > len(existing.get("abstract", "")):
                    existing["abstract"] = normalized["abstract"]
                if not existing.get("journal") and normalized.get("journal"):
                    existing["journal"] = normalized["journal"]
                if not existing.get("authors_text") and normalized.get("authors_text"):
                    existing["authors_text"] = normalized["authors_text"]
                if not existing.get("primary_url") and normalized.get("primary_url"):
                    existing["primary_url"] = normalized["primary_url"]
                if not existing.get("doi_url") and normalized.get("doi_url"):
                    existing["doi_url"] = normalized["doi_url"]
                existing["keyword_score"] = max(existing.get("keyword_score", 0), normalized.get("keyword_score", 0))
                continue
            items_by_id[normalized["id"]] = normalized

    items = list(items_by_id.values())
    for item in items:
        item["matched_topic_keys"] = sorted(item["matched_topic_keys"])
        item["score"] = score_item(item)

    items.sort(
        key=lambda item: (
            item.get("score", 0),
            item.get("publication_date") or "",
            item.get("relevance_score", 0),
        ),
        reverse=True,
    )

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": "OpenAlex",
        "items": items[:12],
    }

    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {OUTPUT} with {len(payload['items'])} items")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
