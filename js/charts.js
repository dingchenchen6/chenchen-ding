/**
 * 民声 · 数据可视化
 * Chart.js 图表配置
 */

'use strict';

// Chart.js global defaults for dark theme
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#64748b';
  Chart.defaults.borderColor = 'rgba(148,163,184,0.06)';
  Chart.defaults.font.family = "'Noto Sans SC', sans-serif";
}

const CHART_COLORS = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  red: '#ef4444',
  amber: '#f59e0b',
  green: '#22c55e',
  cyan: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899',
  blueAlpha: (a) => `rgba(59,130,246,${a})`,
  purpleAlpha: (a) => `rgba(139,92,246,${a})`,
  redAlpha: (a) => `rgba(239,68,68,${a})`,
  greenAlpha: (a) => `rgba(34,197,94,${a})`,
  amberAlpha: (a) => `rgba(245,158,11,${a})`,
  cyanAlpha: (a) => `rgba(6,182,212,${a})`,
};

const TOOLTIP_DEFAULTS = {
  backgroundColor: 'rgba(13,17,23,0.97)',
  borderColor: 'rgba(148,163,184,0.15)',
  borderWidth: 1,
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  padding: 12,
  cornerRadius: 10,
  titleFont: { family: "'Noto Sans SC'", size: 13, weight: '600' },
  bodyFont: { family: "'Noto Sans SC'", size: 12 },
};

const SCALE_DEFAULTS = {
  ticks: {
    color: '#475569',
    font: { family: "'Noto Sans SC'", size: 11 },
    maxRotation: 0,
  },
  grid: { color: 'rgba(148,163,184,0.05)', lineWidth: 1 },
  border: { color: 'transparent' },
};

function getBaseOptions(yLabel = '') {
  return {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#64748b',
          font: { family: "'Noto Sans SC'", size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: { ...TOOLTIP_DEFAULTS },
    },
    scales: {
      x: { ...SCALE_DEFAULTS },
      y: {
        ...SCALE_DEFAULTS,
        beginAtZero: false,
        title: yLabel ? {
          display: true,
          text: yLabel,
          color: '#475569',
          font: { size: 11 }
        } : undefined,
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
  };
}

// ===== HOMEPAGE CHARTS =====

function initIncomeChart() {
  const canvas = document.getElementById('incomeChart');
  if (!canvas) return;

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: '全国居民人均（元）',
          data: [21966, 23821, 25974, 27956, 30733, 32189, 35128, 37033, 39218],
          borderColor: CHART_COLORS.blue,
          backgroundColor: CHART_COLORS.blueAlpha(0.1),
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.blue,
          pointHoverRadius: 6,
          borderWidth: 2.5,
        },
        {
          label: '城镇居民人均（元）',
          data: [31195, 33616, 36396, 39251, 42359, 43834, 47412, 49283, 51821],
          borderColor: CHART_COLORS.cyan,
          backgroundColor: CHART_COLORS.cyanAlpha(0.06),
          fill: false,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.cyan,
          borderWidth: 2,
          borderDash: [4, 4],
        },
        {
          label: '农村居民人均（元）',
          data: [11422, 12363, 13432, 14617, 16021, 17131, 18931, 20133, 21691],
          borderColor: CHART_COLORS.green,
          backgroundColor: CHART_COLORS.greenAlpha(0.06),
          fill: false,
          tension: 0.45,
          pointRadius: 4,
          pointBackgroundColor: CHART_COLORS.green,
          borderWidth: 2,
          borderDash: [4, 4],
        }
      ]
    },
    options: {
      ...getBaseOptions('元'),
      plugins: {
        ...getBaseOptions().plugins,
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} 元`,
          }
        }
      }
    }
  });
}

function initUrbanRuralChart() {
  const canvas = document.getElementById('urbanRuralChart');
  if (!canvas) return;

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['2015', '2017', '2019', '2021', '2023'],
      datasets: [
        {
          label: '城镇居民（元）',
          data: [31195, 36396, 42359, 47412, 51821],
          backgroundColor: CHART_COLORS.blueAlpha(0.75),
          borderColor: CHART_COLORS.blue,
          borderWidth: 1.5,
          borderRadius: 6,
        },
        {
          label: '农村居民（元）',
          data: [11422, 13432, 16021, 18931, 21691],
          backgroundColor: CHART_COLORS.greenAlpha(0.7),
          borderColor: CHART_COLORS.green,
          borderWidth: 1.5,
          borderRadius: 6,
        }
      ]
    },
    options: {
      ...getBaseOptions('元'),
      plugins: {
        ...getBaseOptions().plugins,
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} 元`,
            afterBody: (items) => {
              if (items.length === 2) {
                const ratio = (items[0].parsed.y / items[1].parsed.y).toFixed(2);
                return [`城乡收入比: ${ratio}:1`];
              }
            }
          }
        }
      }
    }
  });
}

function initEmploymentChart() {
  const canvas = document.getElementById('employmentChart');
  if (!canvas) return;

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: '城镇调查失业率 (%)',
          data: [4.9, 5.2, 5.6, 5.1, 5.5, 5.2, 5.1],
          borderColor: CHART_COLORS.amber,
          backgroundColor: CHART_COLORS.amberAlpha(0.1),
          fill: true,
          tension: 0.45,
          pointRadius: 5,
          pointBackgroundColor: CHART_COLORS.amber,
          borderWidth: 2.5,
        },
        {
          label: '青年失业率(16-24岁) (%)',
          data: [10.9, 12.2, 14.6, 14.3, 17.6, 18.5, 14.6],
          borderColor: CHART_COLORS.red,
          backgroundColor: CHART_COLORS.redAlpha(0.08),
          fill: false,
          tension: 0.45,
          pointRadius: 5,
          pointBackgroundColor: CHART_COLORS.red,
          borderWidth: 2.5,
        }
      ]
    },
    options: {
      ...getBaseOptions('%'),
      plugins: {
        ...getBaseOptions().plugins,
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
          }
        }
      },
      scales: {
        ...getBaseOptions().scales,
        y: {
          ...SCALE_DEFAULTS,
          min: 0,
          max: 25,
          ticks: {
            ...SCALE_DEFAULTS.ticks,
            callback: (v) => v + '%'
          }
        }
      }
    }
  });
}

function initHealthChart() {
  const canvas = document.getElementById('healthChart');
  if (!canvas) return;

  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: '人均卫生费用（元）',
          data: [2981, 3352, 3783, 4237, 4702, 5146, 5765, 6294, 6523],
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return CHART_COLORS.red;
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, CHART_COLORS.redAlpha(0.85));
            gradient.addColorStop(1, CHART_COLORS.redAlpha(0.3));
            return gradient;
          },
          borderColor: CHART_COLORS.red,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    },
    options: {
      ...getBaseOptions('元'),
      plugins: {
        ...getBaseOptions().plugins,
        legend: { display: false },
        tooltip: {
          ...TOOLTIP_DEFAULTS,
          callbacks: {
            label: (ctx) => ` 人均卫生费用: ${ctx.parsed.y.toLocaleString()} 元`,
          }
        }
      }
    }
  });
}

// ===== OBSERVE AND INIT CHARTS =====
function initCharts() {
  const chartIds = ['incomeChart', 'urbanRuralChart', 'employmentChart', 'healthChart'];
  const inited = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !inited.has(entry.target.id)) {
        inited.add(entry.target.id);
        const id = entry.target.id;
        if (id === 'incomeChart') initIncomeChart();
        else if (id === 'urbanRuralChart') initUrbanRuralChart();
        else if (id === 'employmentChart') initEmploymentChart();
        else if (id === 'healthChart') initHealthChart();
      }
    });
  }, { threshold: 0.2 });

  chartIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initCharts);
