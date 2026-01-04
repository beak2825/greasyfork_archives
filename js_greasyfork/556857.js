// ==UserScript==
// @name         WarSoul Market Oracle
// @namespace    https://chikit-l.github.io/
// @version      1.0
// @description  在商会中为每个商户提供历史走势和近30日趋势图 + 投资报告
// @author       Lunaris
// @match       https://aring.cc/awakening-of-war-soul-ol/
// @icon        https://aring.cc/awakening-of-war-soul-ol/favicon.ico
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      chikit-l.github.io
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js
// @downloadURL https://update.greasyfork.org/scripts/556857/WarSoul%20Market%20Oracle.user.js
// @updateURL https://update.greasyfork.org/scripts/556857/WarSoul%20Market%20Oracle.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===================== 配置 =====================
  const DATA_JSON_URL   = 'https://chikit-l.github.io/WarSoul_Monitor/data.json';
  const REPORT_PAGE_URL = 'https://chikit-l.github.io/WarSoul_Monitor/';

  const LS_KEY_UPDATED   = 'wsm_last_updated_at';
  const LS_KEY_DATA_JSON = 'wsm_cache_data_json';
  const LS_KEY_REPORT    = 'wsm_cache_report_text';

  // 以"游戏里显示的名字"为主
  // gameName -> { data: dataName }
  const NAME_MAP = {
    '地精金库':       { data: '地精金库' },
    '史莱姆保护协会': { data: '史莱姆保护协会' },
    '传说武库':       { data: '传说武库' },
    // 游戏里叫「名钻商会」，数据/报告里可能是旧的「明钻商户」
    '名钻商会':       { data: '明钻商户' },
    '魔龙教会':       { data: '魔龙教会' }
  };

  // 报告中可能出现的所有名称（用于截段）
  const ALL_REPORT_NAMES = [
    '地精金库',
    '史莱姆保护协会',
    '传说武库',
    '明钻商户',
    '名钻商会',
    '魔龙教会'
  ];

  // ===================== 全局状态 =====================
  let cachedDataJson = null;    // 解析后的 data.json
  let cachedReportText = '';    // 报告全文（textContent）
  let dataReadyPromise = null;  // 确保只初始化一次

  let currentPopup = null;
  let currentOverlay = null;
  let currentChartHistory = null;
  let currentChart30 = null;
  let currentChartMode = 'history'; // 'history' | '30'

  // ===================== 通用 HTTP 工具 =====================
  function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          'Cache-Control': 'no-cache'
        },
        onload: resp => {
          if (resp.status >= 200 && resp.status < 300) {
            resolve(resp.responseText);
          } else {
            reject(new Error(`HTTP ${resp.status} for ${url}`));
          }
        },
        onerror: err => reject(err)
      });
    });
  }

  // ===================== 本地缓存读写 =====================
  function loadFromLocalStorage() {
    try {
      const updated = localStorage.getItem(LS_KEY_UPDATED);
      const dataStr = localStorage.getItem(LS_KEY_DATA_JSON);
      const reportStr = localStorage.getItem(LS_KEY_REPORT);
      if (updated && dataStr && reportStr) {
        const parsed = JSON.parse(dataStr);
        cachedDataJson = parsed;
        cachedReportText = reportStr;
        return { updatedAt: updated, ok: true };
      }
    } catch (e) {
      console.warn('[WSM] 本地缓存读取失败:', e);
    }
    return { updatedAt: null, ok: false };
  }

  function saveToLocalStorage(updatedAt, dataJsonObj, reportText) {
    try {
      localStorage.setItem(LS_KEY_UPDATED, updatedAt || '');
      localStorage.setItem(LS_KEY_DATA_JSON, JSON.stringify(dataJsonObj || {}));
      localStorage.setItem(LS_KEY_REPORT, reportText || '');
    } catch (e) {
      console.warn('[WSM] 无法写入 localStorage:', e);
    }
  }

  // ===================== 数据加载逻辑 =====================
  async function ensureDataReady() {
    if (dataReadyPromise) return dataReadyPromise;

    dataReadyPromise = (async () => {
      console.log('[WSM] 初始化数据加载…');

      // 先读取本地缓存
      const local = loadFromLocalStorage();
      let localUpdatedAt = local.updatedAt;

      // 拉取 data.json
      let remoteDataRaw;
      try {
        remoteDataRaw = await gmGet(DATA_JSON_URL);
      } catch (e) {
        console.error('[WSM] 获取 data.json 失败:', e);
        if (local.ok) {
          console.log('[WSM] 使用本地缓存数据（data.json 拉取失败）');
          return;
        } else {
          alert('战魂觉醒OL商会助手：无法获取 data.json 且本地无缓存。');
          throw e;
        }
      }

      let remoteData;
      try {
        remoteData = JSON.parse(remoteDataRaw);
      } catch (e) {
        console.error('[WSM] data.json 解析失败:', e);
        if (local.ok) {
          console.log('[WSM] 使用本地缓存数据（data.json 解析失败）');
          return;
        } else {
          alert('战魂觉醒OL商会助手：data.json 格式异常且本地无缓存。');
          throw e;
        }
      }

      const remoteUpdatedAt = remoteData && remoteData.updated_at
        ? remoteData.updated_at
        : remoteData.updatedAt || '';

      // 如果 updated_at 一致且本地有缓存 -> 直接使用本地缓存
      if (local.ok && remoteUpdatedAt && remoteUpdatedAt === localUpdatedAt) {
        console.log('[WSM] 数据未变化，使用本地缓存。');
        cachedDataJson = JSON.parse(localStorage.getItem(LS_KEY_DATA_JSON));
        cachedReportText = localStorage.getItem(LS_KEY_REPORT) || '';
        return;
      }

      // 否则：更新 data.json，并重新抓取报告页面
      console.log('[WSM] 检测到数据更新或无缓存，重新获取 report…');
      cachedDataJson = remoteData;

      let reportPageHtml;
      try {
        reportPageHtml = await gmGet(REPORT_PAGE_URL);
      } catch (e) {
        console.error('[WSM] 获取报告页面失败:', e);
        if (local.ok) {
          console.log('[WSM] 使用旧的报告缓存。');
          cachedReportText = localStorage.getItem(LS_KEY_REPORT) || '';
          saveToLocalStorage(remoteUpdatedAt, cachedDataJson, cachedReportText);
          return;
        } else {
          alert('战魂觉醒OL商会助手：无法获取报告页面且本地无缓存。');
          throw e;
        }
      }

      // 解析 HTML，提取 <pre id="report"> 的文本
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(reportPageHtml, 'text/html');
        const pre = doc.querySelector('pre#report');
        cachedReportText = pre ? pre.textContent || '' : '';
      } catch (e) {
        console.error('[WSM] 解析报告 HTML 失败:', e);
        cachedReportText = '';
      }

      saveToLocalStorage(remoteUpdatedAt, cachedDataJson, cachedReportText);
      console.log('[WSM] 数据与报告已更新缓存。');
    })();

    return dataReadyPromise;
  }

  // ===================== 报告片段提取（兼容名钻/明钻） =====================
  function extractReportForMerchant(reportText, gameName) {
    if (!reportText || !gameName) return '暂无报告数据。';

    const mapping = NAME_MAP[gameName] || {};
    const dataName = mapping.data || gameName;

    // 既可能是 dataName（明钻商户），也可能直接写 gameName（名钻商会）
    const candidates = [...new Set([dataName, gameName])];
    const full = reportText;

    let startIdx = -1;
    let usedName = '';

    for (const n of candidates) {
      const idx = full.indexOf(n);
      if (idx !== -1 && (startIdx === -1 || idx < startIdx)) {
        startIdx = idx;
        usedName = n;
      }
    }

    if (startIdx === -1) {
      return `未在报告中找到「${gameName}」相关分析。`;
    }

    let endIdx = full.length;
    for (const name of ALL_REPORT_NAMES) {
      if (name === usedName) continue;
      const idx = full.indexOf(name, startIdx + usedName.length);
      if (idx !== -1 && idx < endIdx) {
        endIdx = idx;
      }
    }

    const slice = full.slice(startIdx, endIdx).trim();
    return slice || '暂无报告数据。';
  }

  // ===================== 价格序列处理（按"日期"截 30 日） =====================
  function buildSeriesForMerchant(dataJson, dataName) {
    if (!dataJson || !dataJson.x || !dataJson.series) return null;
    const xRaw = dataJson.x;
    const seriesList = dataJson.series;

    const target = seriesList.find(s => s.name === dataName);
    if (!target) return null;

    const valuesRaw = target.values || [];

    // 只保留日期部分
    const dates = xRaw.map(str => {
      const parts = String(str).split(' ');
      return parts[0] || str;
    });

    // 全历史
    const historyDates = dates.slice();
    const historyValues = valuesRaw.slice();

    // 近 30 日（按"不同日期"往回数 30 天）
    let seenDates = new Set();
    let minIndex = 0;
    for (let i = dates.length - 1; i >= 0; i--) {
      const d = dates[i];
      if (!seenDates.has(d)) {
        seenDates.add(d);
        if (seenDates.size === 30) {
          minIndex = i;
          break;
        }
      }
    }
    const recentDates = dates.slice(minIndex);
    const recentValues = valuesRaw.slice(minIndex);

    return {
      history: {
        labels: historyDates,
        values: historyValues
      },
      recent30: {
        labels: recentDates,
        values: recentValues
      }
    };
  }

  // ===================== 弹窗 UI & 样式（黑色护眼风） =====================
  function injectStyles() {
    GM_addStyle(`
      .wsm-icon-btn {
        cursor: pointer;
        margin-left: 6px;
        font-size: 14px;
        vertical-align: middle;
        opacity: 0.7;
        transition: opacity 0.2s, transform 0.1s;
      }
      .wsm-icon-btn:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      .wsm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.45);
        z-index: 9999;
      }

      .wsm-popup {
        position: fixed;
        right: 18px;
        bottom: 70px;
        width: 380px;
        max-height: 80vh;
        background: #020617;
        color: #e5e7eb;
        border-radius: 16px;
        box-shadow: 0 18px 40px rgba(0,0,0,0.7);
        padding: 12px 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        z-index: 10000;
      }

      .wsm-popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
      }
      .wsm-popup-header-title {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .wsm-popup-header-title span.emoji {
        font-size: 18px;
      }
      .wsm-popup-close {
        cursor: pointer;
        font-size: 16px;
        color: #9ca3af;
        padding: 2px 4px;
        border-radius: 6px;
      }
      .wsm-popup-close:hover {
        color: #f9fafb;
        background: rgba(148,163,184,0.15);
      }

      .wsm-tabs {
        display: inline-flex;
        border-radius: 999px;
        background: rgba(15,23,42,0.9);
        padding: 2px;
        align-self: flex-start;
        margin-top: 2px;
      }
      .wsm-tab-btn {
        border: none;
        outline: none;
        background: transparent;
        color: #9ca3af;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 999px;
        cursor: pointer;
        white-space: nowrap;
      }
      .wsm-tab-btn.active {
        background: linear-gradient(135deg, #22c55e, #0ea5e9);
        color: #0b1120;
        font-weight: 600;
      }

      .wsm-chart-wrap {
        margin-top: 4px;
        border-radius: 12px;
        background: radial-gradient(circle at top, rgba(148,163,184,0.18), transparent 60%);
        padding: 8px 8px 6px;
      }
      .wsm-chart-wrap canvas {
        width: 100%;
        height: 220px;
      }

      .wsm-report {
        margin-top: 4px;
        padding: 6px 8px;
        border-radius: 10px;
        background: rgba(15,23,42,0.9);
        font-size: 12px;
        line-height: 1.5;
        white-space: pre-wrap;
        overflow-y: auto;
      }

      .wsm-report::-webkit-scrollbar {
        width: 6px;
      }
      .wsm-report::-webkit-scrollbar-thumb {
        background: rgba(148,163,184,0.5);
        border-radius: 999px;
      }
    `);
  }

  function closePopup() {
    if (currentChartHistory) {
      currentChartHistory.destroy();
      currentChartHistory = null;
    }
    if (currentChart30) {
      currentChart30.destroy();
      currentChart30 = null;
    }
    if (currentPopup && currentPopup.parentNode) {
      currentPopup.remove();
    }
    if (currentOverlay && currentOverlay.parentNode) {
      currentOverlay.remove();
    }
    currentPopup = null;
    currentOverlay = null;
  }

  function switchChartMode(mode) {
    if (!currentPopup) return;
    currentChartMode = mode;

    const btnHistory = currentPopup.querySelector('.wsm-tab-btn[data-mode="history"]');
    const btn30 = currentPopup.querySelector('.wsm-tab-btn[data-mode="30"]');
    const canvasHistory = currentPopup.querySelector('canvas[data-chart="history"]');
    const canvas30 = currentPopup.querySelector('canvas[data-chart="30"]');

    if (!btnHistory || !btn30 || !canvasHistory || !canvas30) return;

    if (mode === 'history') {
      btnHistory.classList.add('active');
      btn30.classList.remove('active');
      canvasHistory.style.display = 'block';
      canvas30.style.display = 'none';
    } else {
      btnHistory.classList.remove('active');
      btn30.classList.add('active');
      canvasHistory.style.display = 'none';
      canvas30.style.display = 'block';
    }
  }

  function createPopupDOM(gameName, reportText) {
    // 遮罩
    const overlay = document.createElement('div');
    overlay.className = 'wsm-overlay';
    overlay.addEventListener('click', () => {
      closePopup();
    });

    // 弹窗
    const popup = document.createElement('div');
    popup.className = 'wsm-popup';
    popup.addEventListener('click', ev => {
      ev.stopPropagation(); // 防止点击内部关闭
    });

    popup.innerHTML = `
      <div class="wsm-popup-header">
        <div class="wsm-popup-header-title">
          <span class="emoji">💸</span>
          <span>投资建议 — ${gameName}</span>
        </div>
        <div class="wsm-popup-close" title="关闭">✕</div>
      </div>

      <div class="wsm-tabs">
        <button class="wsm-tab-btn active" data-mode="history">历史走势</button>
        <button class="wsm-tab-btn" data-mode="30">近30日趋势</button>
      </div>

      <div class="wsm-chart-wrap">
        <canvas data-chart="history"></canvas>
        <canvas data-chart="30" style="display:none;"></canvas>
      </div>

      <div class="wsm-report"></div>
    `;

    const closeBtn = popup.querySelector('.wsm-popup-close');
    closeBtn.addEventListener('click', () => closePopup());

    const btnHistory = popup.querySelector('.wsm-tab-btn[data-mode="history"]');
    const btn30 = popup.querySelector('.wsm-tab-btn[data-mode="30"]');
    btnHistory.addEventListener('click', () => switchChartMode('history'));
    btn30.addEventListener('click', () => switchChartMode('30'));

    const reportDiv = popup.querySelector('.wsm-report');
    reportDiv.textContent = reportText || '暂无报告数据。';

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    currentPopup = popup;
    currentOverlay = overlay;
  }

  function renderChartsForMerchant(gameName, dataName) {
    if (!cachedDataJson) {
      console.warn('[WSM] 数据尚未就绪，无法渲染图表。');
      return;
    }

    const series = buildSeriesForMerchant(cachedDataJson, dataName);
    if (!series) {
      const reportDiv = currentPopup && currentPopup.querySelector('.wsm-report');
      if (reportDiv) {
        reportDiv.textContent = `未找到「${dataName}」的历史数据。`;
      }
      return;
    }

    if (currentChartHistory) {
      currentChartHistory.destroy();
      currentChartHistory = null;
    }
    if (currentChart30) {
      currentChart30.destroy();
      currentChart30 = null;
    }

    const canvasHistory = currentPopup.querySelector('canvas[data-chart="history"]');
    const canvas30 = currentPopup.querySelector('canvas[data-chart="30"]');
    const ctxHistory = canvasHistory.getContext('2d');
    const ctx30 = canvas30.getContext('2d');

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `价格：${ctx.raw}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10,
            color: '#9ca3af',
            font: { size: 9 },
            callback: function(value, index, ticks) {
              const label = this.getLabelForValue(value);
              // 只显示日期部分,去掉时间
              return label.split(' ')[0];
            }
          },
          grid: {
            color: 'rgba(30,64,175,0.15)'
          }
        },
        y: {
          ticks: {
            color: '#e5e7eb',
            font: { size: 10 }
          },
          grid: {
            color: 'rgba(30,64,175,0.18)'
          }
        }
      }
    };

    currentChartHistory = new Chart(ctxHistory, {
      type: 'line',
      data: {
        labels: series.history.labels,
        datasets: [{
          label: `${gameName} - 历史走势`,
          data: series.history.values,
          spanGaps: true,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.15)',
          tension: 0.2,
          pointRadius: 0
        }]
      },
      options: commonOptions
    });

    currentChart30 = new Chart(ctx30, {
      type: 'line',
      data: {
        labels: series.recent30.labels,
        datasets: [{
          label: `${gameName} - 近30日趋势`,
          data: series.recent30.values,
          spanGaps: true,
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14,165,233,0.15)',
          tension: 0.2,
          pointRadius: 0
        }]
      },
      options: commonOptions
    });

    switchChartMode('history');
  }

  function openPopupForMerchant(gameName) {
    const mapping = NAME_MAP[gameName] || {};
    const dataName = mapping.data || gameName;

    closePopup();

    const reportSlice = extractReportForMerchant(cachedReportText, gameName);
    createPopupDOM(gameName, reportSlice);
    renderChartsForMerchant(gameName, dataName);
  }

  // ===================== 为商户名称添加 💸 图标 =====================
  function attachIcons() {
    // 尝试多种选择器,适配不同的DOM结构
    const selectors = [
      '.commerce-page .commerce-list .item h4',
      '.item.border-wrap h4',
      '.item h4.gold',
      'div[data-v-1d533139].item h4',
      'h4.gold',  // 最简单的选择器
      '.border-wrap h4'
    ];
    
    let items = [];
    for (const selector of selectors) {
      items = document.querySelectorAll(selector);
      if (items.length > 0) {
        // 检查是否真的是商会商户
        const firstText = items[0].textContent.trim();
        const isCommerce = NAME_MAP[firstText] !== undefined;
        
        if (isCommerce) {
          console.log('[WSM] ✓ 使用选择器:', selector, '找到', items.length, '个商户');
          break;
        } else {
          console.log('[WSM] ✗ 选择器匹配但不是商会页面:', selector, '匹配到:', firstText);
          items = [];  // 清空，继续尝试
        }
      }
    }
    
    if (!items || items.length === 0) {
      console.log('[WSM] 未找到商会商户元素（可能不在商会投资页面）');
      return false;  // 返回false表示未成功
    }

    let addedCount = 0;
    items.forEach((h4, index) => {
      if (h4.dataset.wsmBound === '1') return;
      const name = h4.textContent.trim();
      
      if (!NAME_MAP[name]) {
        console.log('[WSM] ⚠️ 跳过非商会商户:', name);
        return;
      }

      h4.dataset.wsmBound = '1';

      const icon = document.createElement('span');
      icon.textContent = '💸';
      icon.className = 'wsm-icon-btn';
      icon.title = '查看投资建议与价格走势';

      icon.addEventListener('click', ev => {
        ev.stopPropagation();
        ensureDataReady()
          .then(() => {
            openPopupForMerchant(name);
          })
          .catch(err => {
            console.error('[WSM] 打开弹窗失败:', err);
            alert('战魂觉醒OL商会助手：加载数据失败，详见控制台。');
          });
      });

      h4.appendChild(icon);
      addedCount++;
      console.log('[WSM] ✓ 成功为', name, '添加图标');
    });
    
    if (addedCount > 0) {
      console.log('[WSM] ✅ 成功为', addedCount, '个商户添加助手图标');
      return true;  // 返回true表示成功
    } else {
      return false;
    }
  }

  // ===================== 初始化入口 =====================
  function main() {
    injectStyles();
    console.log('[WSM] 商会助手已启动，等待进入商会投资页面...');

    // 监听商会列表的变化
    const observeCommerceList = () => {
      const commerceList = document.querySelector('.commerce-list.affix');
      
      if (commerceList) {
        console.log('[WSM] 找到商会列表容器，开始监听...');
        
        const observer = new MutationObserver((mutations) => {
          // 检查是否有子元素被添加
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              console.log('[WSM] 检测到商会数据加载');
              const success = attachIcons();
              if (success) {
                console.log('[WSM] 商会助手初始化完成');
                // 断开observer，节省性能
                observer.disconnect();
                return;
              }
            }
          }
        });
        
        // 只监听子元素变化
        observer.observe(commerceList, {
          childList: true,
          subtree: false
        });
        
        // 立即尝试一次（可能已经加载完成）
        const success = attachIcons();
        if (success) {
          console.log('[WSM] 商会助手初始化完成（数据已加载）');
          observer.disconnect();
        }
      } else {
        // 如果还没找到容器，1秒后重试
        setTimeout(observeCommerceList, 1000);
      }
    };
    
    observeCommerceList();

    // 提前开始加载数据(不影响 UI)
    ensureDataReady().catch(e => {
      console.warn('[WSM] 初始数据加载失败(可以稍后重试点击💸):', e);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    main();
  } else {
    window.addEventListener('DOMContentLoaded', main);
  }
})();