const watchCopy = {
  zh: {
    intro: "根据我的研究方向、代表性论文主题与当前关注领域，每日自动抓取和更新最新相关论文，并按相关度与时间综合排序。",
    badge: "按相关度与时间排序",
    updatedPrefix: "最近更新：",
    loading: "正在准备今日推荐文献...",
    empty: "暂时还没有抓取到符合条件的最新文章，稍后会自动更新。",
    failed: "今日文献推荐暂时加载失败，请稍后刷新重试。",
    read: "阅读全文",
    doi: "DOI",
    source: "数据来源：OpenAlex，每日自动更新",
    untitled: "未命名文章",
    unknownJournal: "期刊信息待补充",
    unknownAuthors: "作者信息待补充",
    noAbstract: "暂无摘要，可点击原文链接查看详细内容。",
    scoreLabel: "综合推荐"
  },
  en: {
    intro: "Based on my research interests, publication themes, and ongoing focus areas, the site automatically retrieves newly published papers every day and ranks them by combined relevance and recency.",
    badge: "Ranked by relevance and recency",
    updatedPrefix: "Last updated: ",
    loading: "Preparing today's recommended readings...",
    empty: "No matching recent papers are available right now. The feed will update automatically.",
    failed: "The daily literature feed is temporarily unavailable. Please refresh later.",
    read: "Read article",
    doi: "DOI",
    source: "Source: OpenAlex, updated daily",
    untitled: "Untitled article",
    unknownJournal: "Journal information unavailable",
    unknownAuthors: "Author information unavailable",
    noAbstract: "No abstract available yet. Use the article link to view the full record.",
    scoreLabel: "Composite rank"
  }
};

const watchTopicLabels = {
  global_change_biodiversity: {
    zh: "全球变化与生物多样性",
    en: "Global change and biodiversity"
  },
  land_use_climate_interactions: {
    zh: "土地利用与气候交互",
    en: "Land-use and climate interactions"
  },
  species_distribution_monitoring: {
    zh: "物种分布与监测",
    en: "Species distribution and monitoring"
  },
  extinction_risk_conservation: {
    zh: "灭绝风险与保护优先",
    en: "Extinction risk and conservation priority"
  },
  dryland_birds_heatwaves: {
    zh: "干旱区鸟类与热浪",
    en: "Dryland birds and heatwaves"
  },
  ecological_modelling_biogeography: {
    zh: "生态建模与生物地理",
    en: "Ecological modelling and biogeography"
  }
};

const watchState = {
  data: null,
  lang: localStorage.getItem("chenchen-ding-language") || "zh"
};

const watchSelectors = {
  intro: () => document.querySelector(".watch-intro"),
  badge: () => document.querySelector(".watch-badge"),
  updated: () => document.querySelector("[data-watch-updated]"),
  grid: () => document.getElementById("watchGrid")
};

const formatDate = (value, lang) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
};

const renderWatchState = (state, messageKey = "loading") => {
  const lang = watchState.lang in watchCopy ? watchState.lang : "zh";
  const copy = watchCopy[lang];
  const intro = watchSelectors.intro();
  const badge = watchSelectors.badge();
  const updated = watchSelectors.updated();
  const grid = watchSelectors.grid();

  if (intro) intro.textContent = copy.intro;
  if (badge) badge.textContent = copy.badge;
  if (updated) {
    updated.textContent = watchState.data?.generated_at
      ? `${copy.updatedPrefix}${formatDate(watchState.data.generated_at, lang)}`
      : copy.loading;
  }

  if (!grid) return;

  if (state === "message") {
    grid.innerHTML = `
      <article class="watch-card watch-card-placeholder">
        <p>${copy[messageKey]}</p>
      </article>
    `;
    return;
  }

  const items = (watchState.data?.items || []).slice(0, 12);
  if (!items.length) {
    renderWatchState("message", "empty");
    return;
  }

  grid.innerHTML = items.map((item, index) => {
    const tags = (item.matched_topic_keys || []).map((key) => {
      const label = watchTopicLabels[key]?.[lang] || key;
      return `<span class="watch-tag">${label}</span>`;
    }).join("");

    const abstract = item.abstract || copy.noAbstract;
    const title = item.title || copy.untitled;
    const journal = item.journal || copy.unknownJournal;
    const authors = item.authors_text || copy.unknownAuthors;
    const primaryUrl = item.primary_url || item.openalex_url || "#";
    const doiUrl = item.doi_url || item.openalex_url || primaryUrl;

    return `
      <article class="watch-card">
        <div class="watch-card-head">
          <span class="watch-rank">${index + 1}</span>
          <span class="watch-date">${formatDate(item.publication_date, lang)}</span>
        </div>
        <h3><a href="${primaryUrl}" target="_blank" rel="noopener">${title}</a></h3>
        <p class="watch-journal">${journal}</p>
        <p class="watch-authors">${authors}</p>
        <p class="watch-abstract">${abstract}</p>
        <div class="watch-tags">${tags}<span class="watch-tag">${copy.scoreLabel}: ${Number(item.score || 0).toFixed(2)}</span></div>
        <div class="watch-card-actions">
          <a class="watch-action watch-action-primary" href="${primaryUrl}" target="_blank" rel="noopener">${copy.read}</a>
          <a class="watch-action watch-action-secondary" href="${doiUrl}" target="_blank" rel="noopener">${copy.doi}</a>
        </div>
      </article>
    `;
  }).join("");
};

const loadResearchWatch = async () => {
  try {
    const response = await fetch("assets/data/research-watch.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    watchState.data = await response.json();
    renderWatchState("ready");
  } catch (error) {
    console.error("Failed to load research watch data", error);
    renderWatchState("message", "failed");
  }
};

window.addEventListener("chenchen-language-change", (event) => {
  watchState.lang = event.detail?.lang || watchState.lang;
  renderWatchState(watchState.data ? "ready" : "message", watchState.data ? undefined : "loading");
});

watchState.lang = localStorage.getItem("chenchen-ding-language") || "zh";
renderWatchState("message", "loading");
loadResearchWatch();
