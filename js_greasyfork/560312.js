// ==UserScript==
// @name         LINUX DO Credit 积分
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  LINUX DO Credit 实时收入
// @author       @Chenyme
// @license      MIT
// @match        https://linux.do/*
// @match        https://credit.linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      credit.linux.do
// @connect      linux.do
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560312/LINUX%20DO%20Credit%20%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/560312/LINUX%20DO%20Credit%20%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
        #ldc-mini {
            position: fixed;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgb(0 0 0 / 0.04);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 10px 14px;
            font-variant-numeric: tabular-nums;
            font-size: 13px;
            font-weight: 600;
            
            display: flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            min-width: 36px;
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            
            cursor: move;
            user-select: none;
        }
        
        .dark #ldc-mini {
            background: #1f2937;
            border-color: rgba(255, 255, 255, 0.1);
        }
        
        #ldc-mini:hover {
            box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
            transform: translateY(-1px);
        }
        
        #ldc-mini:active {
            transform: scale(0.98);
        }
        
        #ldc-mini.loading {
            min-width: 36px;
            max-width: 36px;
            padding: 10px 0;
            color: #6b7280;
            cursor: wait;
            border-color: transparent;
            background: rgba(255, 255, 255, 0.8);
        }
        
        .dark #ldc-mini.loading {
            background: rgba(31, 41, 55, 0.8);
        }
        
        #ldc-tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            line-height: 1.5;
            z-index: 10001;
            pointer-events: auto;
            white-space: pre;
            opacity: 0;
            transition: opacity 0.15s ease;
            backdrop-filter: blur(4px);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-variant-numeric: tabular-nums;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .dark #ldc-tooltip {
            background: rgba(255, 255, 255, 0.9);
            color: black;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        #ldc-theme-buttons {
            display: flex;
            gap: 4px;
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark #ldc-theme-buttons {
            border-top-color: rgba(0, 0, 0, 0.15);
        }
        
        .ldc-theme-btn {
            flex: 1;
            padding: 3px 6px;
            background: transparent;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.15s ease;
            user-select: none;
            opacity: 0.5;
            color: inherit;
            text-align: center;
        }
        
        .ldc-theme-btn:hover {
            opacity: 0.8;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .dark .ldc-theme-btn:hover {
            background: rgba(0, 0, 0, 0.1);
        }
        
        .ldc-theme-btn.active {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
            font-weight: 500;
        }
        
        .dark .ldc-theme-btn.active {
            background: rgba(0, 0, 0, 0.2);
        }
        
        #ldc-mini.positive { color: #10b981; }
        #ldc-mini.negative { color: #ef4444; }
        #ldc-mini.neutral { color: #6b7280; }
        .dark #ldc-mini.positive { color: #34d399; }
        .dark #ldc-mini.negative { color: #f87171; }
        .dark #ldc-mini.neutral { color: #9ca3af; }
    `);

  let communityBalance = null;
  let gamificationScore = null;
  let username = null;
  let isDragging = false;
  let tooltipContent = '加载中...';
  let tooltipHovered = false;
  let currentTheme = GM_getValue('ldc_theme', 'auto');
  let historicalData = GM_getValue('ldc_history', {});

  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'ldc-mini';
    widget.className = 'loading';
    widget.textContent = '···';

    const tooltip = document.createElement('div');
    tooltip.id = 'ldc-tooltip';
    document.body.appendChild(tooltip);

    const savedPos = GM_getValue('ldc_pos', { bottom: '20px', right: '20px' });
    Object.assign(widget.style, savedPos);

    document.body.appendChild(widget);

    applyTheme();

    widget.addEventListener('mouseenter', () => {
      if (isDragging) return;
      tooltipHovered = false;
      const rect = widget.getBoundingClientRect();

      updateTooltipContent();

      const tooltipHeight = 120;
      if (rect.top > tooltipHeight + 10) {
        tooltip.style.top = 'auto';
        tooltip.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
      } else {
        tooltip.style.bottom = 'auto';
        tooltip.style.top = (rect.bottom + 8) + 'px';
      }

      const toolRect = tooltip.getBoundingClientRect();
      tooltip.style.left = 'auto';
      tooltip.style.right = (window.innerWidth - rect.right) + 'px';

      tooltip.style.opacity = '1';
    });

    widget.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!tooltipHovered) {
          tooltip.style.opacity = '0';
        }
      }, 100);
    });

    tooltip.addEventListener('mouseenter', () => {
      tooltipHovered = true;
    });

    tooltip.addEventListener('mouseleave', () => {
      tooltipHovered = false;
      tooltip.style.opacity = '0';
    });

    let startX, startY;
    let startRight, startBottom;

    widget.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = widget.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startBottom = window.innerHeight - rect.bottom;

      e.preventDefault();
      tooltip.style.opacity = '0';

      const onMouseMove = (moveEvent) => {
        isDragging = true;
        const deltaX = startX - moveEvent.clientX;
        const deltaY = startY - moveEvent.clientY;

        widget.style.right = `${Math.max(0, Math.min(window.innerWidth - rect.width, startRight + deltaX))}px`;
        widget.style.bottom = `${Math.max(0, Math.min(window.innerHeight - rect.height, startBottom + deltaY))}px`;
        widget.style.top = 'auto';
        widget.style.left = 'auto';
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (isDragging) {
          GM_setValue('ldc_pos', {
            right: widget.style.right,
            bottom: widget.style.bottom
          });
          setTimeout(() => isDragging = false, 50);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    widget.addEventListener('click', (e) => {
      if (!isDragging) {

        widget.className = 'loading';
        widget.textContent = '···';
        tooltipContent = '刷新中...';
        const tooltip = document.getElementById('ldc-tooltip');
        if (tooltip.style.opacity === '1') {
          tooltip.textContent = tooltipContent;
        }
        fetchData();
      }
    });
  }

  function applyTheme() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (currentTheme === 'dark') {
      htmlElement.classList.add('dark');
      bodyElement.classList.add('dark');
    } else if (currentTheme === 'light') {
      htmlElement.classList.remove('dark');
      bodyElement.classList.remove('dark');
    } else if (currentTheme === 'auto') {
      detectAndApplySystemTheme();
    }
  }

  function detectAndApplySystemTheme() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const colorScheme = getComputedStyle(document.documentElement).colorScheme;
    const schemeType = getComputedStyle(document.documentElement).getPropertyValue('--scheme-type').trim();

    const isDark = colorScheme === 'dark' || schemeType === 'dark';
    const currentIsDark = htmlElement.classList.contains('dark');

    if (isDark && !currentIsDark) {
      htmlElement.classList.add('dark');
      bodyElement.classList.add('dark');
    } else if (!isDark && currentIsDark) {
      htmlElement.classList.remove('dark');
      bodyElement.classList.remove('dark');
    }
  }

  function startThemeObserver() {
    let debounceTimer = null;
    let lastDetectedTheme = null;

    const debouncedDetect = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (currentTheme === 'auto') {
          const colorScheme = getComputedStyle(document.documentElement).colorScheme;
          const schemeType = getComputedStyle(document.documentElement).getPropertyValue('--scheme-type').trim();
          const isDark = colorScheme === 'dark' || schemeType === 'dark';

          if (lastDetectedTheme !== isDark) {
            lastDetectedTheme = isDark;
            detectAndApplySystemTheme();
          }
        }
      }, 1000);
    };

    const observer = new MutationObserver(debouncedDetect);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    const styleObserver = setInterval(() => {
      if (currentTheme === 'auto') {
        debouncedDetect();
      }
    }, 10000);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      clearInterval(styleObserver);
    };
  }

  function setTheme(theme) {
    currentTheme = theme;
    GM_setValue('ldc_theme', currentTheme);
    applyTheme();
    updateTooltipContent();
  }

  function updateTooltipContent() {
    const tooltip = document.getElementById('ldc-tooltip');
    if (!tooltip) return;

    tooltip.innerHTML = '';

    const textNode = document.createElement('div');
    textNode.textContent = tooltipContent;
    tooltip.appendChild(textNode);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'ldc-theme-buttons';

    const themes = [
      { id: 'auto', label: '自动' },
      { id: 'light', label: '浅色' },
      { id: 'dark', label: '深色' }
    ];

    themes.forEach(theme => {
      const btn = document.createElement('button');
      btn.className = 'ldc-theme-btn';
      if (currentTheme === theme.id) {
        btn.classList.add('active');
      }
      btn.textContent = theme.label;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setTheme(theme.id);
      });
      buttonsContainer.appendChild(btn);
    });

    tooltip.appendChild(buttonsContainer);
  }

  function updateDisplay() {
    const widget = document.getElementById('ldc-mini');
    const tooltip = document.getElementById('ldc-tooltip');
    if (!widget) return;

    if (gamificationScore !== null && communityBalance !== null) {
      const diff = gamificationScore - communityBalance;

      // 保存今天的数据
      const today = new Date().toISOString().split('T')[0];
      historicalData[today] = {
        gamificationScore,
        communityBalance,
        diff,
        timestamp: Date.now()
      };

      // 保留最近30天的数据
      const allDates = Object.keys(historicalData).sort();
      if (allDates.length > 30) {
        const toDelete = allDates.slice(0, allDates.length - 30);
        toDelete.forEach(date => delete historicalData[date]);
      }

      GM_setValue('ldc_history', historicalData);

      let displayText;
      if (diff > 0) {
        displayText = `+${diff.toFixed(2)}`;
      } else if (diff < 0) {
        displayText = `- ${Math.abs(diff).toFixed(2)}`;
      } else {
        displayText = '0.00';
      }

      widget.textContent = displayText;

      // 计算与昨天的对比
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const yesterdayData = historicalData[yesterday];

      let comparisonText = '';
      if (yesterdayData) {
        const yesterdayDiff = yesterdayData.diff;
        const change = diff - yesterdayDiff;
        const changePercent = yesterdayDiff !== 0 ? (change / Math.abs(yesterdayDiff) * 100) : 0;

        const changeSign = change > 0 ? '+' : '';
        const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';

        comparisonText = `\n━━━━━━━━━━━━━━━\n昨日数据对比：\n昨日差值: ${yesterdayDiff.toFixed(2)}\n今日变化: ${changeSign}${change.toFixed(2)} (${arrow} ${changePercent.toFixed(1)}%)\n通胀速率: ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
      }

      tooltipContent = `仅供参考，可能有误差！\n当前分: ${gamificationScore.toFixed(2)}\n基准值: ${communityBalance.toFixed(2)}${comparisonText}`;
      if (tooltip && tooltip.style.opacity === '1') {
        updateTooltipContent();
      }


      widget.className = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';

      if (widget.style.cursor === 'wait') {
        widget.style.removeProperty('cursor');
      }
    } else if (communityBalance !== null) {
      widget.textContent = '···';
      widget.className = 'loading';
      tooltipContent = '仅供参考，可能有误差！\n正在获取实时积分...';
    }
  }

  async function request(url) {
    const isSameOrigin = url.startsWith(window.location.origin);

    if (isSameOrigin) {
      try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        // console.error('LDC: Native fetch failed, falling back to GM', e);
        // Fallback to GM if native fails (unlikely for same-origin unless CSP issues)
      }
    }

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Referer': 'https://credit.linux.do/home'
        },
        timeout: 10000,
        onload: (res) => {
          if (res.status === 200) {
            try {
              resolve(JSON.parse(res.responseText));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`HTTP ${res.status}`));
          }
        },
        ontimeout: () => reject(new Error('Timeout')),
        onerror: (err) => reject(err)
      });
    });
  }

  async function fetchData() {
    try {
      // 1. 获取 Credit 余额
      const creditData = await request('https://credit.linux.do/api/v1/oauth/user-info');

      if (creditData?.data) {
        communityBalance = parseFloat(creditData.data['community-balance'] || creditData.data.community_balance || 0);
        username = creditData.data.username || creditData.data.nickname;

        updateDisplay();

        // 2. 获取 Gamification 分数
        if (username) {
          await fetchGamificationByUsername();
        }
      }
    } catch (e) {
      console.error('LDC: Fetch balance error', e);
      handleError('Credit API 异常');
    }
  }

  function handleError(msg) {
    const widget = document.getElementById('ldc-mini');
    if (widget) {
      widget.textContent = '!';
      tooltipContent = `出错啦！\n${msg}\n(请检查是否已登录相关站点)`;
      widget.classList.add('negative');
      if (widget.classList.contains('loading')) widget.classList.remove('loading');
    }
  }

  async function fetchGamificationByUsername() {
    if (!username) return;

    try {
      const data = await request(`https://linux.do/u/${username}.json`);
      if (data?.user?.gamification_score !== undefined) {
        gamificationScore = parseFloat(data.user.gamification_score);
        updateDisplay();
      }
    } catch (e) {
      console.error('LDC: Fetch gamification error', e);
    }
  }

  function init() {
    createWidget();
    startThemeObserver();
    setTimeout(fetchData, 500);
    setInterval(fetchData, 300000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
