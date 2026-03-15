/**
 * 民声 · 民意调查系统
 * 使用 localStorage 持久化投票数据
 */

'use strict';

const VOTES_KEY = 'minsheng_votes_v2';
const POLL_DATA_KEY = 'minsheng_polls_v1';

// ===== POLLS DATA =====
function getPollsData() {
  return [
    {
      id: 'edu_reform_2024',
      category: 'education',
      categoryLabel: '🎓 教育',
      question: '您认为当前中国教育最需要解决的核心问题是什么？',
      options: [
        { id: 'a', text: '教育资源不均衡（城乡/地区差距）', defaultVotes: 3245 },
        { id: 'b', text: '学生课业负担过重/内卷压力', defaultVotes: 2876 },
        { id: 'c', text: '高等教育质量与就业脱节', defaultVotes: 1923 },
        { id: 'd', text: '教育成本过高/家庭经济压力', defaultVotes: 1456 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'healthcare_access',
      category: 'healthcare',
      categoryLabel: '🏥 医疗',
      question: '您在就医过程中遇到的最大困难是什么？',
      options: [
        { id: 'a', text: '挂号难、等待时间太长', defaultVotes: 4123 },
        { id: 'b', text: '看病费用太高/医保报销比例低', defaultVotes: 3567 },
        { id: 'c', text: '基层医院水平太低，不得不去大医院', defaultVotes: 2890 },
        { id: 'd', text: '医患沟通不畅/服务态度差', defaultVotes: 987 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'housing_situation',
      category: 'housing',
      categoryLabel: '🏠 住房',
      question: '您目前的住房状况如何？',
      options: [
        { id: 'a', text: '自有住房，房贷已还清', defaultVotes: 1876 },
        { id: 'b', text: '自有住房，仍在还房贷', defaultVotes: 3234 },
        { id: 'c', text: '租房居住', defaultVotes: 2987 },
        { id: 'd', text: '与父母或亲戚同住', defaultVotes: 1456 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'youth_employment',
      category: 'employment',
      categoryLabel: '💼 就业',
      question: '您认为青年就业难的最主要原因是什么？',
      options: [
        { id: 'a', text: '岗位供需结构失衡（市场需要的专业年轻人不学）', defaultVotes: 2567 },
        { id: 'b', text: '企业要求过高（学历、经验门槛高）', defaultVotes: 3456 },
        { id: 'c', text: '经济下行导致整体就业岗位减少', defaultVotes: 2234 },
        { id: 'd', text: '年轻人期望薪资与现实差距过大', defaultVotes: 1123 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'retirement_age',
      category: 'elderly',
      categoryLabel: '👴 养老',
      question: '您对延迟退休政策的总体看法是？',
      options: [
        { id: 'a', text: '坚决反对，劳动者应有权选择按时退休', defaultVotes: 4567 },
        { id: 'b', text: '理解但不支持，应有更多配套保障', defaultVotes: 2345 },
        { id: 'c', text: '有条件支持，体力劳动者不应延迟', defaultVotes: 1234 },
        { id: 'd', text: '支持，有利于养老金可持续和社会发展', defaultVotes: 678 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'food_safety_trust',
      category: 'food',
      categoryLabel: '🌾 食品',
      question: '您对中国食品安全现状的总体信任程度如何？',
      options: [
        { id: 'a', text: '比较信任，整体状况已有很大改善', defaultVotes: 876 },
        { id: 'b', text: '一般，某些方面有所改善但仍有担忧', defaultVotes: 2987 },
        { id: 'c', text: '不太信任，食品安全问题仍时有发生', defaultVotes: 3456 },
        { id: 'd', text: '很不信任，经常买进口食品或自己种植', defaultVotes: 1234 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'ai_employment_impact',
      category: 'technology',
      categoryLabel: '💻 科技',
      question: '您担心人工智能（AI）的发展会影响您的工作吗？',
      options: [
        { id: 'a', text: '非常担心，我的工作可能很快被AI替代', defaultVotes: 1456 },
        { id: 'b', text: '有些担心，需要持续学习新技能', defaultVotes: 3234 },
        { id: 'c', text: '不太担心，AI更多是工具而非替代者', defaultVotes: 2123 },
        { id: 'd', text: '完全不担心，AI会创造更多新工作机会', defaultVotes: 654 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'income_inequality',
      category: 'livelihood',
      categoryLabel: '🌆 民生',
      question: '您认为当前中国贫富差距问题严重吗？',
      options: [
        { id: 'a', text: '非常严重，财富高度集中在少数人手中', defaultVotes: 4892 },
        { id: 'b', text: '比较严重，但正在逐步改善', defaultVotes: 2345 },
        { id: 'c', text: '一般，与其他发展中国家相比差距不算大', defaultVotes: 678 },
        { id: 'd', text: '不太严重，脱贫攻坚成果显著', defaultVotes: 234 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'living_pressure',
      category: 'livelihood',
      categoryLabel: '🌆 民生',
      question: '您认为自己所在城市的生活成本压力如何？',
      options: [
        { id: 'a', text: '压力极大，难以维持体面的生活', defaultVotes: 2876 },
        { id: 'b', text: '压力较大，只能勉强维持基本生活', defaultVotes: 3456 },
        { id: 'c', text: '压力一般，能维持生活但储蓄很少', defaultVotes: 2123 },
        { id: 'd', text: '压力不大，生活比较宽裕', defaultVotes: 543 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'healthcare_insurance',
      category: 'healthcare',
      categoryLabel: '🏥 医疗',
      question: '您对医保报销政策的满意程度如何？',
      options: [
        { id: 'a', text: '很满意，报销比例和覆盖范围都不错', defaultVotes: 567 },
        { id: 'b', text: '一般，基本可以接受', defaultVotes: 2345 },
        { id: 'c', text: '不太满意，报销比例太低', defaultVotes: 3567 },
        { id: 'd', text: '很不满意，自费部分负担仍然很重', defaultVotes: 2234 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'edu_cost_burden',
      category: 'education',
      categoryLabel: '🎓 教育',
      question: '您家庭每年在子女教育方面的支出约占家庭总收入的比例？',
      options: [
        { id: 'a', text: '10%以下（负担较轻）', defaultVotes: 1234 },
        { id: 'b', text: '10%-30%（尚可接受）', defaultVotes: 2876 },
        { id: 'c', text: '30%-50%（负担较重）', defaultVotes: 2456 },
        { id: 'd', text: '50%以上（负担极重）', defaultVotes: 1567 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    },
    {
      id: 'rural_urban_gap',
      category: 'livelihood',
      categoryLabel: '🌆 民生',
      question: '您认为改善城乡差距最有效的途径是什么？',
      options: [
        { id: 'a', text: '加大农村基础设施和公共服务投入', defaultVotes: 3456 },
        { id: 'b', text: '推进农村土地制度改革，增加农民收入', defaultVotes: 2345 },
        { id: 'c', text: '发展县域经济，减少人口向大城市集中', defaultVotes: 2123 },
        { id: 'd', text: '推进城乡融合，让农民真正享受城市公共服务', defaultVotes: 1987 }
      ],
      totalLabel: '参与人数',
      date: '2025-03'
    }
  ];
}

// ===== VOTE STORAGE =====
function getVotes() {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY)) || {};
  } catch {
    return {};
  }
}

function getVoteCount(pollId, optionId) {
  const votes = getVotes();
  return (votes[pollId] && votes[pollId][optionId]) || 0;
}

function hasVoted(pollId) {
  const votes = getVotes();
  return votes[pollId] && votes[pollId]._voted;
}

function getVotedOption(pollId) {
  const votes = getVotes();
  return votes[pollId] && votes[pollId]._choice;
}

function castVote(pollId, optionId) {
  const votes = getVotes();
  if (!votes[pollId]) votes[pollId] = {};
  votes[pollId][optionId] = (votes[pollId][optionId] || 0) + 1;
  votes[pollId]._voted = true;
  votes[pollId]._choice = optionId;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

// ===== COMPUTE POLL RESULTS =====
function getPollResults(poll) {
  return poll.options.map(opt => ({
    ...opt,
    count: (opt.defaultVotes || 0) + getVoteCount(poll.id, opt.id)
  }));
}

function getTotalVotes(poll) {
  return getPollResults(poll).reduce((sum, opt) => sum + opt.count, 0);
}

// ===== RENDER POLL CARD =====
function renderPollCard(poll, compact = false) {
  const voted = hasVoted(poll.id);
  const votedOption = getVotedOption(poll.id);
  const results = getPollResults(poll);
  const total = getTotalVotes(poll);
  const maxVotes = Math.max(...results.map(r => r.count));

  const optionsHtml = results.map(opt => {
    const pct = total > 0 ? Math.round((opt.count / total) * 100) : 0;
    const isVoted = opt.id === votedOption;
    const isWinner = opt.count === maxVotes;

    if (voted) {
      return `
        <div class="poll-result">
          <div class="poll-result-bar ${isWinner ? 'winner-bar' : ''}" style="width:${pct}%"></div>
          <div class="poll-result-content">
            <span class="poll-result-label">${isVoted ? '✓ ' : ''}${escapeHtml(opt.text)}</span>
            <span class="poll-result-pct">${pct}%</span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="poll-option">
          <button class="poll-option-btn" onclick="vote('${poll.id}','${opt.id}',this)">
            ${escapeHtml(opt.text)}
          </button>
        </div>
      `;
    }
  }).join('');

  return `
    <div class="${compact ? 'poll-card' : 'poll-card-full'}" data-poll-id="${poll.id}" data-category="${poll.category}">
      <div class="poll-category">${poll.categoryLabel}</div>
      <div class="poll-question">${escapeHtml(poll.question)}</div>
      <div class="poll-options">${optionsHtml}</div>
      <div class="poll-meta">
        <span>📊 ${total.toLocaleString()}人参与</span>
        ${voted ? '<span style="color:var(--green-light)">✅ 已投票</span>' : '<span>匿名投票</span>'}
        <span>${poll.date}</span>
      </div>
    </div>
  `;
}

// ===== VOTE ACTION =====
window.vote = function(pollId, optionId, btn) {
  if (hasVoted(pollId)) return;

  castVote(pollId, optionId);

  // Animate
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';

    // Re-render the specific card
    const card = document.querySelector(`[data-poll-id="${pollId}"]`);
    if (!card) return;

    const poll = getPollsData().find(p => p.id === pollId);
    if (!poll) return;

    const isCompact = card.classList.contains('poll-card');
    const newCard = document.createElement('div');
    newCard.innerHTML = renderPollCard(poll, isCompact);
    const newCardEl = newCard.firstElementChild;
    newCardEl.style.animation = 'fadeInUp 0.4s ease';
    card.parentNode.replaceChild(newCardEl, card);

    showToast('✅ 投票成功！感谢您的参与。');
    updatePollsMeta && updatePollsMeta();
  }, 150);
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  if (window.showToast) { window.showToast(msg); return; }
  alert(msg);
}

// ===== RENDER PREVIEW (homepage) =====
window.renderPollsPreview = function() {
  const container = document.getElementById('pollsPreview');
  if (!container) return;

  const polls = getPollsData().slice(0, 3);
  container.innerHTML = polls.map(p => renderPollCard(p, true)).join('');
};

// ===== RENDER ALL POLLS (polls.html) =====
window.renderAllPolls = function() {
  const container = document.getElementById('pollsFullGrid');
  if (!container) return;

  const polls = getPollsData();
  container.innerHTML = polls.map(p => renderPollCard(p, false)).join('');
};

window.getPollsData = getPollsData;
window.getVoteCount = getVoteCount;

// ===== DEBUNK DATA =====
function getDebunkData() {
  return [
    {
      id: 'db_001',
      type: 'debunked',
      category: 'healthcare',
      title: '「中国医疗水平落后，大病只能去国外治疗」',
      claim: '网传：中国医疗水平极度落后，患了大病只能去美国、日本等发达国家才能治好。',
      fact: '【辟谣】这是严重夸大的说法。中国已拥有多个世界顶级医疗中心，在心脏外科、器官移植、肿瘤治疗等领域处于国际先进水平。北京协和、中山大学附属第一医院等三甲医院在多项专科排名中已进入全球前列。2023年我国医疗技术水平在"全球医疗可及性和质量指数"中排名已上升至48位。当然，优质医疗资源分配不均、基层医疗水平参差不齐是现实问题，需要持续改善。',
      source: '世界卫生组织报告、《中国卫生统计年鉴2023》',
      date: '2025-03-12',
      views: 23456
    },
    {
      id: 'db_002',
      type: 'debunked',
      category: 'food',
      title: '「中国粮食大量依赖进口，随时面临断粮危机」',
      claim: '有说法称中国粮食严重依赖进口，一旦国际形势紧张中国将面临严重粮食危机。',
      fact: '【辟谣】这一说法夸大了粮食安全风险。中国谷物（稻谷、小麦、玉米）自给率长期超过95%，2023年粮食总产量高达6.95亿吨，连续9年超6.5亿吨，是全球最大粮食生产国之一。确实，大豆进口依存度较高（超80%），但这主要用于饲料和榨油，对口粮安全影响有限。国家保有18.65亿亩耕地红线和充足粮食储备，粮食安全有坚实保障。',
      source: '国家统计局《2023年国民经济和社会发展统计公报》',
      date: '2025-03-10',
      views: 18923
    },
    {
      id: 'db_003',
      type: 'exposed',
      category: 'employment',
      title: '【曝光】某招聘平台大量发布"学历要求"明显歧视性条款',
      claim: '多名求职者反映，某主流招聘平台上大量招聘信息在工作要求中注明"仅限985/211院校"或"不接受应届生"，涉嫌违反《就业促进法》相关规定。',
      fact: '【调查结论】经核实，确存在大量招聘信息含有不合理学历限制。根据《就业促进法》第三条规定，用人单位招用人员不得对劳动者歧视。人力资源和社会保障部已多次发文要求用人单位规范招聘行为。建议求职者如遭受就业歧视，可向当地劳动部门投诉举报。',
      source: '人力资源和社会保障部就业促进司、《就业促进法》',
      date: '2025-03-08',
      views: 34567
    },
    {
      id: 'db_004',
      type: 'debunked',
      category: 'housing',
      title: '「中国房地产崩盘，房价将跌去80%」',
      claim: '网上大量文章预测中国房地产市场将经历类似日本1990年代的大崩盘，房价将跌去60%-80%。',
      fact: '【辟谣】这种极端预测缺乏数据支撑。中国房地产市场确处于调整期，多城市房价有所下降，但整体调整幅度温和可控。一线城市由于土地稀缺性和人口吸引力，房价支撑因素依然较强。国家已出台多项"保交楼"、降低首付比例、降低房贷利率等托底政策。中国房地产与日本1990年代情况存在根本性不同，不能简单类比。',
      source: '国家统计局房价指数、中国人民银行金融稳定报告',
      date: '2025-03-05',
      views: 45123
    },
    {
      id: 'db_005',
      type: 'investigating',
      category: 'food',
      title: '【调查中】某品牌预制菜被指添加过量防腐剂',
      claim: '社交媒体上流传多位消费者举报某知名品牌预制菜产品存在防腐剂添加量超标问题，已有多人声称食用后出现不适。',
      fact: '【调查进行中】本平台已向相关监管部门反映此举报线索。国家市场监督管理局正组织对该批次产品进行抽检，结果将于近期公布。在官方检测结果出来前，消费者可暂时谨慎选购该品牌相关产品，如有不适请及时就医并保留购买凭证。',
      source: '举报线索经核实中，来源：消费者投诉平台',
      date: '2025-03-14',
      views: 12345
    },
    {
      id: 'db_006',
      type: 'debunked',
      category: 'education',
      title: '「双减政策失败，孩子课外补习比以前更严重」',
      claim: '网传"双减政策"实施后，由于学校减少了作业和考试，家长反而让孩子参加更多、更贵的补课，内卷比以前更严重。',
      fact: '【部分属实，需要区分】调查数据显示，双减政策实施后正规校外培训机构数量大幅减少（减少约80%），学生在校内作业量确实下降。但部分家长的确将"减下来的时间"用于私教或非正规补课，且此类灰色市场难以监管。总体来看，双减政策减少了正规培训机构的市场规模，但未能完全解决家长的教育焦虑根源。问题根源在于优质教育资源不足和评价体系单一，政策效果需综合评估。',
      source: '21世纪教育研究院《双减政策实施效果评估报告》，2024',
      date: '2025-03-01',
      views: 28934
    }
  ];
}

// ===== RENDER DEBUNK PREVIEW =====
window.renderDebunkPreview = function() {
  const container = document.getElementById('debunkPreview');
  if (!container) return;

  const items = getDebunkData().slice(0, 3);
  container.innerHTML = items.map(item => `
    <div class="debunk-card">
      <div class="debunk-status ${item.type}">
        ${item.type === 'debunked' ? '✅ 已辟谣' : item.type === 'exposed' ? '🚨 已曝光' : '🔍 调查中'}
      </div>
      <div class="debunk-claim">${escapeHtml(item.title)}</div>
      <div class="debunk-fact">${escapeHtml(item.fact.substring(0, 120))}...</div>
      <div class="debunk-source">📎 ${escapeHtml(item.source)}</div>
    </div>
  `).join('');
};

// ===== RENDER DEBUNK FULL LIST =====
window.renderDebunkList = function() {
  const container = document.getElementById('debunkFullList');
  if (!container) return;

  const items = getDebunkData();

  // Update counts
  const counts = { debunked: 0, exposed: 0, investigating: 0 };
  items.forEach(i => counts[i.type]++);
  if (document.getElementById('debunkedCount')) document.getElementById('debunkedCount').textContent = counts.debunked;
  if (document.getElementById('exposedCount')) document.getElementById('exposedCount').textContent = counts.exposed;
  if (document.getElementById('investigatingCount')) document.getElementById('investigatingCount').textContent = counts.investigating;

  container.innerHTML = items.map(item => `
    <div class="debunk-item-full" data-type="${item.type}" data-category="${item.category}">
      <div class="debunk-item-header">
        <h3 class="debunk-item-title">${escapeHtml(item.title)}</h3>
        <div class="debunk-status ${item.type}">
          ${item.type === 'debunked' ? '✅ 已辟谣' : item.type === 'exposed' ? '🚨 已曝光' : '🔍 调查中'}
        </div>
      </div>
      <div class="debunk-item-body">
        <div class="debunk-claim-box">
          <div class="dbox-label">⚠️ 谣言/说法</div>
          <div class="dbox-content">${escapeHtml(item.claim)}</div>
        </div>
        <div class="debunk-fact-box">
          <div class="dbox-label">✅ 事实核查</div>
          <div class="dbox-content">${escapeHtml(item.fact)}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:var(--text-muted);">
        <span>📎 ${escapeHtml(item.source)}</span>
        <span style="display:flex;gap:16px;">
          <span>👁 ${item.views.toLocaleString()}次阅读</span>
          <span>📅 ${item.date}</span>
        </span>
      </div>
    </div>
  `).join('');
};

// ===== TRENDS DATA =====
function getTrendsData() {
  return [
    {
      id: 'tr_001',
      rank: 1,
      category: 'employment',
      categoryLabel: '💼 就业',
      title: '延迟退休新政实施，中年职场竞争加剧引发热议',
      desc: '渐进式延迟退休方案正式推进，引发大量讨论。网友聚焦：延退后年轻人就业空间是否会被压缩？50岁以上职场人面临"干不动也退不了"的双重困境如何解决？',
      tags: ['延迟退休', '就业竞争', '养老政策'],
      heatPct: 96,
      heatNum: '892万',
      date: '2025-03-14'
    },
    {
      id: 'tr_002',
      rank: 2,
      category: 'employment',
      categoryLabel: '💼 就业',
      title: '2025届高校毕业生超1300万，就业季竞争创历史新高',
      desc: '2025届高校毕业生规模预计超1300万人，再创历史新高。与此同时，互联网、金融、地产等传统就业大户持续裁员，"毕业即失业"焦虑情绪在大学生群体中蔓延。',
      tags: ['高校毕业', '青年失业', '就业难'],
      heatPct: 91,
      heatNum: '756万',
      date: '2025-03-13'
    },
    {
      id: 'tr_003',
      rank: 3,
      category: 'healthcare',
      categoryLabel: '🏥 医疗',
      title: '多地医保个人账户改革，部分地区个账余额减少引争议',
      desc: '多省市推进医保门诊统筹改革，个人账户划入金额调整，部分参保人反映个账余额明显减少。改革方向是否合理？统筹资金监管是否透明？成为热议焦点。',
      tags: ['医保改革', '个人账户', '门诊统筹'],
      heatPct: 85,
      heatNum: '634万',
      date: '2025-03-12'
    },
    {
      id: 'tr_004',
      rank: 4,
      category: 'housing',
      categoryLabel: '🏠 住房',
      title: '保障性住房建设提速，城中村改造能否真正解决住房困难',
      desc: '2025年保障性住房建设目标再度提升，100个城市启动城中村改造项目。但有分析指出，保障房分配机制不透明、申请门槛较高仍是待解难题。',
      tags: ['保障房', '城中村改造', '住房保障'],
      heatPct: 78,
      heatNum: '523万',
      date: '2025-03-11'
    },
    {
      id: 'tr_005',
      rank: 5,
      category: 'technology',
      categoryLabel: '💻 科技',
      title: '国产大模型加速进化，AI替代就业恐慌与机遇并存',
      desc: '多家中国AI大模型发布重大更新，各行业开始评估AI对岗位的冲击程度。教育、法律、医疗等行业的AI应用加速落地，引发关于AI监管与就业保障的广泛讨论。',
      tags: ['人工智能', '就业替代', '国产大模型'],
      heatPct: 82,
      heatNum: '698万',
      date: '2025-03-10'
    },
    {
      id: 'tr_006',
      rank: 6,
      category: 'food',
      categoryLabel: '🌾 食品',
      title: '预制菜强制标注争议：消费者知情权与餐饮行业成本之争',
      desc: '关于餐厅强制标注"预制菜"的讨论持续升温，消费者呼吁知情权，餐饮商家担忧成本与经营压力。监管部门表态将出台相关规范，政策走向备受关注。',
      tags: ['预制菜', '食品标注', '消费者权益'],
      heatPct: 69,
      heatNum: '412万',
      date: '2025-03-09'
    },
    {
      id: 'tr_007',
      rank: 7,
      category: 'education',
      categoryLabel: '🎓 教育',
      title: '新高考改革深化，"赋分制"公平性再被质疑',
      desc: '随着高考季临近，多省新高考赋分制再度被质疑：选考人数较少的科目赋分是否会造成不公平？不同省份之间如何平衡考试难度与评分标准？',
      tags: ['高考改革', '赋分制', '教育公平'],
      heatPct: 64,
      heatNum: '356万',
      date: '2025-03-08'
    },
    {
      id: 'tr_008',
      rank: 8,
      category: 'elderly',
      categoryLabel: '👴 养老',
      title: '居家养老"喘息服务"试点扩大，失能老人照护困境引关注',
      desc: '多城市试点推出居家养老"喘息服务"，为照料失能老人的家庭成员提供临时替代照护。但专业护理人员严重短缺、收费标准不一等问题仍制约政策效果。',
      tags: ['居家养老', '失能老人', '喘息服务'],
      heatPct: 58,
      heatNum: '289万',
      date: '2025-03-07'
    }
  ];
}

// ===== RENDER TRENDS PREVIEW (homepage) =====
window.renderTrendsPreview = function() {
  const listContainer = document.getElementById('trendsList');
  const tagsContainer = document.getElementById('hotTags');
  const rankContainer = document.getElementById('attentionRank');

  const trends = getTrendsData();

  if (listContainer) {
    listContainer.innerHTML = trends.slice(0, 6).map((t, i) => `
      <div class="trend-item">
        <div class="trend-rank ${i < 3 ? 'hot' : i < 5 ? 'warm' : ''}">${i+1}</div>
        <div class="trend-content">
          <div class="trend-title">${escapeHtml(t.title)}</div>
          <div class="trend-desc">${escapeHtml(t.desc.substring(0, 80))}...</div>
          <div class="trend-meta">
            <span class="trend-tag">${t.categoryLabel}</span>
            <span class="trend-heat">
              🔥 ${t.heatNum}
              <div class="heat-bar"><div class="heat-fill" style="width:${t.heatPct}%"></div></div>
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (tagsContainer) {
    const allTags = trends.flatMap(t => t.tags).slice(0, 12);
    tagsContainer.innerHTML = allTags.map(tag => `
      <span class="hot-tag">#${escapeHtml(tag)}</span>
    `).join('');
  }

  if (rankContainer) {
    rankContainer.innerHTML = trends.slice(0, 5).map((t, i) => `
      <div class="attention-item">
        <span class="att-rank ${i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : ''}">${i+1}</span>
        <span class="att-label">${escapeHtml(t.categoryLabel.replace(/[^ ]+ /, ''))}</span>
        <div class="att-bar"><div class="att-fill" style="width:${t.heatPct}%"></div></div>
      </div>
    `).join('');
  }
};

// ===== RENDER TRENDS PAGE =====
window.renderTrendsPage = function() {
  const topContainer = document.getElementById('trendingTop');
  const listContainer = document.getElementById('trendsFullList');
  const trends = getTrendsData();

  if (topContainer) {
    topContainer.innerHTML = trends.slice(0, 3).map((t, i) => `
      <div class="trend-card-top" data-category="${t.category}">
        <div class="tct-rank">${t.rank}</div>
        <div class="tct-category">${t.categoryLabel}</div>
        <div class="tct-title">${escapeHtml(t.title)}</div>
        <div class="tct-desc">${escapeHtml(t.desc.substring(0, 120))}...</div>
        <div class="tct-stats">
          <div class="tct-stat">🔥 热度 <strong>${t.heatNum}</strong></div>
          <div class="tct-stat">📅 <strong>${t.date}</strong></div>
        </div>
      </div>
    `).join('');
  }

  if (listContainer) {
    listContainer.innerHTML = trends.map(t => `
      <div class="trend-item-full" data-category="${t.category}">
        <div class="tif-rank ${t.rank <= 3 ? 'top3' : ''}">
          ${t.rank <= 3 ? '🔥' : t.rank}
        </div>
        <div class="tif-content">
          <div class="tif-title">${escapeHtml(t.title)}</div>
          <div class="tif-desc">${escapeHtml(t.desc)}</div>
          <div class="tif-tags">
            <span class="tif-tag">${t.categoryLabel}</span>
            ${t.tags.map(tag => `<span class="tif-tag">#${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
        <div class="tif-heat-block">
          <div class="tif-heat-label">🔥 热度</div>
          <div class="tif-heat-bar"><div class="tif-heat-fill" style="width:${t.heatPct}%"></div></div>
          <div class="tif-heat-num">${t.heatNum}</div>
        </div>
      </div>
    `).join('');
  }
};

// ===== AUTO-INIT =====
document.addEventListener('DOMContentLoaded', function() {
  renderPollsPreview();
  renderDebunkPreview();
  renderTrendsPreview();
  renderAllPolls && renderAllPolls();
  renderDebunkList && renderDebunkList();
  renderTrendsPage && renderTrendsPage();
});
