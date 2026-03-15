/**
 * 民声 · 中国社会经济观察平台
 * 主JavaScript文件
 */

'use strict';

// ===== NAVBAR =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateBackToTop();
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      navToggle.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
      }
    });
  }
})();

// ===== BACK TO TOP =====
const backToTopBtn = document.getElementById('backToTop');
function updateBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== HERO COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimal) || 0;
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    if (decimals > 0) {
      el.textContent = current.toFixed(decimals);
    } else {
      el.textContent = Math.round(current).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (decimals > 0) {
        el.textContent = target.toFixed(decimals);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.hs-num[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const animatable = document.querySelectorAll(
    '.topic-card, .chart-card, .poll-card, .debunk-card, .kpi-card, .trend-item, .comment-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          entry.target.style.opacity = '1';
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatable.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ===== QUICK COMMENT =====
window.submitQuickComment = function() {
  const content = document.getElementById('quickComment');
  const topic = document.getElementById('quickTopic');
  if (!content || !content.value.trim()) {
    alert('请输入您的观点');
    return;
  }
  if (content.value.trim().length < 5) {
    alert('内容太短，请多写几个字');
    return;
  }

  saveComment({
    nickname: '匿名用户',
    content: content.value.trim(),
    topic: topic ? topic.value : '',
    time: Date.now(),
    likes: 0
  });

  content.value = '';
  if (topic) topic.value = '';
  renderRecentComments();
  showToast('✅ 观点已发布！感谢您的参与。');
};

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 28px;
    padding: 14px 24px;
    border-radius: 12px;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background: ${type === 'success' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)'};
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    z-index: 9999;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    max-width: 320px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3500);
}

// ===== COMMENTS STORAGE =====
const COMMENTS_KEY = 'minsheng_comments_v2';

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || getDefaultComments();
  } catch {
    return getDefaultComments();
  }
}

function saveComment(comment) {
  const comments = getComments();
  comment.id = Date.now() + Math.random().toString(36).substr(2, 9);
  comments.unshift(comment);
  if (comments.length > 200) comments.pop();
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

function likeComment(commentId) {
  const comments = getComments();
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.likes = (comment.likes || 0) + 1;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }
}

function getDefaultComments() {
  return [
    {
      id: 'default_1',
      nickname: '北京市民@张先生',
      content: '看病真的太难了！我家附近的社区医院水平有限，大病小病都往三甲医院跑，挂号要排两三个小时，医生看诊只有五分钟，患者体验实在太差。希望能加强基层医疗建设，真正实现分级诊疗。',
      topic: 'healthcare',
      time: Date.now() - 86400000 * 2,
      likes: 127
    },
    {
      id: 'default_2',
      nickname: '应届毕业生@李同学',
      content: '今年找工作太难了，投了两百多份简历，面试机会寥寥无几。很多公司要求"985/211优先"，或者要求"3年以上工作经验"，但我们刚毕业哪来的工作经验？希望能出台相关政策约束学历歧视和就业歧视。',
      topic: 'employment',
      time: Date.now() - 86400000,
      likes: 234
    },
    {
      id: 'default_3',
      nickname: '上海租房客@王小姐',
      content: '上海的房租真的压力太大，我一个人月薪一万二，每个月光房租就要四五千，加上生活费基本没有结余。买房更是遥不可及的事，希望政府能够加大公租房、保障房的供给。',
      topic: 'housing',
      time: Date.now() - 86400000 * 3,
      likes: 189
    },
    {
      id: 'default_4',
      nickname: '农村老人的子女@赵先生',
      content: '我父母都在农村，已经70多岁了，每月养老金只有几百块，根本不够生活。兄弟姐妹都在城里工作，没法常回去照看。农村养老问题真的很严峻，希望政府能提高农村养老金标准。',
      topic: 'elderly',
      time: Date.now() - 86400000 * 4,
      likes: 312
    },
    {
      id: 'default_5',
      nickname: '家长@陈女士',
      content: '双减政策出来后孩子减负了一些，但学校的竞争压力还是很大。现在好的初中、高中录取率越来越低，感觉教育内卷没有根本改变。希望教育资源能均衡分配，让每个孩子都有平等的受教育机会。',
      topic: 'education',
      time: Date.now() - 86400000 * 5,
      likes: 156
    }
  ];
}

// ===== RENDER COMMENTS =====
const TOPIC_LABELS = {
  education: '🎓 教育',
  healthcare: '🏥 医疗',
  housing: '🏠 住房',
  employment: '💼 就业',
  elderly: '👴 养老',
  food: '🌾 食品',
  technology: '💻 科技',
  livelihood: '🌆 民生',
  all: '💬 综合'
};

const AVATAR_COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899', '#f97316'];

function getAvatarColor(str) {
  let hash = 0;
  for (let c of str) hash = hash * 31 + c.charCodeAt(0);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}天前`;
  const d = new Date(timestamp);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
}

function renderCommentItem(comment) {
  const avatarColor = getAvatarColor(comment.nickname || 'anon');
  const firstChar = (comment.nickname || '匿')[0];
  const topicLabel = TOPIC_LABELS[comment.topic] || '💬 综合';
  const likes = comment.likes || 0;

  return `
    <div class="comment-item" data-id="${comment.id}" data-category="${comment.topic || 'all'}">
      <div class="comment-header">
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="comment-avatar" style="background:${avatarColor}22;color:${avatarColor};">${firstChar}</div>
          <span class="comment-nickname">
            ${escapeHtml(comment.nickname || '匿名用户')}
            <span class="comment-topic-tag">${topicLabel}</span>
          </span>
        </div>
        <span class="comment-time">${formatTimeAgo(comment.time)}</span>
      </div>
      <p class="comment-content">${escapeHtml(comment.content)}</p>
      <div class="comment-actions">
        <button class="comment-action-btn ${likes > 0 ? 'liked' : ''}" onclick="handleLike('${comment.id}', this)">
          👍 <span class="like-count">${likes}</span>
        </button>
        <button class="comment-action-btn" onclick="handleReply('${comment.id}')">
          💬 回复
        </button>
      </div>
    </div>
  `;
}

window.handleLike = function(id, btn) {
  likeComment(id);
  const countEl = btn.querySelector('.like-count');
  if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;
  btn.classList.add('liked');
};

window.handleReply = function(id) {
  const textarea = document.getElementById('commentContent') || document.getElementById('quickComment');
  if (textarea) {
    textarea.focus();
    textarea.placeholder = '回复该评论...';
    setTimeout(() => textarea.placeholder = textarea === document.getElementById('quickComment')
      ? '分享您对社会经济议题的看法、建议或亲身经历...'
      : '分享您在就医、教育、住房、就业等方面的真实经历和看法...', 3000);
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Render recent comments on homepage
window.renderRecentComments = function() {
  const container = document.getElementById('recentComments');
  if (!container) return;
  const comments = getComments().slice(0, 4);
  container.innerHTML = comments.map(renderCommentItem).join('');
};

// Render all comments on discuss page
window.renderAllComments = function(sort = 'recent') {
  const container = document.getElementById('commentsList');
  if (!container) return;
  let comments = getComments();
  if (sort === 'likes') {
    comments = [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  if (comments.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px">暂无评论，快来发表您的观点吧！</div>';
    return;
  }
  container.innerHTML = comments.map(renderCommentItem).join('');
};

// ===== SAVE COMMENT (export for discuss page) =====
window.saveComment = saveComment;
window.getComments = getComments;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initCounters();
  initScrollAnimations();
  renderRecentComments();

  // Trigger initial scroll check
  if (window.scrollY > 20) {
    document.getElementById('navbar')?.classList.add('scrolled');
  }
});
