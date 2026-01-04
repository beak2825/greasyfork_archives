// ==UserScript==
// @name         Gemini 对话导航
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为 Google Gemini 官网添加侧边导航面板；支持点击跳转、收藏对话 (Star)、自动屏蔽底部免责声明。
// @author       schweigen
// @match        https://gemini.google.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556337/Gemini%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/556337/Gemini%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 配置参数 ---
  const CONFIG = {
    maxPreviewLength: 20,     // 导航条文字预览长度
    scrollBehavior: 'auto',   // 'auto'=瞬间(更准), 'smooth'=平滑
    navWidthDefault: 200,     // 默认宽度
    headerHeight: 80,         // 顶部导航栏高度
    readOffset: 120           // 判定阅读线的偏移量（像素）
  };

  // --- 常量与状态 ---
  const STORE_NS = 'gemini-quicknav';
  const WIDTH_KEY = `${STORE_NS}:nav-width`;
  const FAV_KEY_PREFIX = `${STORE_NS}:fav:`; // 收藏(Star)

  let favSet = new Map();  // 收藏数据
  let filterFav = false;   // 是否仅显示收藏
  let cacheIndex = [];     // 当前对话列表缓存
  let currentActiveId = null; // 当前高亮的对话ID
  let isUserScrolling = false;
  let scrollTimer = null;
  let refreshTimer = null;

  // --- CSS 样式 ---
  const css = `
    :root {
      --gn-panel-bg: #ffffff;
      --gn-border: #e5e7eb;
      --gn-text: #374151;
      --gn-text-light: #9ca3af;
      --gn-hover-bg: #f3f4f6;
      --gn-active-bg: #e0e7ff;
      --gn-active-border: #6366f1;
      --gn-user-color: #10b981; /* 绿色 */
      --gn-model-color: #3b82f6; /* 蓝色 */
      --gn-shadow: 0 4px 12px rgba(0,0,0,0.1);
      --gn-radius: 8px;
      --gn-z-index: 9999;
    }
    /* Gemini 暗色模式适配 */
    body.dark-theme, body[data-theme="dark"] {
      --gn-panel-bg: #1e1e1e;
      --gn-border: #333333;
      --gn-text: #e5e7eb;
      --gn-text-light: #6b7280;
      --gn-hover-bg: #2d2d2d;
      --gn-active-bg: #1e1b4b;
      --gn-active-border: #818cf8;
    }

    /* 滚动边距修正，防止标题被顶部遮挡 */
    user-query, model-response {
        scroll-margin-top: 110px !important;
    }

    #gemini-nav-panel {
      position: fixed;
      top: 70px;
      right: 16px;
      width: var(--gn-width, 200px);
      min-width: 120px;
      max-width: 400px;
      height: auto;
      max-height: calc(100vh - 100px);
      background: var(--gn-panel-bg);
      border: 1px solid var(--gn-border);
      border-radius: var(--gn-radius);
      box-shadow: var(--gn-shadow);
      z-index: var(--gn-z-index);
      display: flex;
      flex-direction: column;
      font-family: "Google Sans", Roboto, sans-serif;
      font-size: 13px;
      transition: right 0.2s ease;
    }

    .gn-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--gn-border);
      cursor: move;
      user-select: none;
    }
    .gn-title { font-weight: 600; color: var(--gn-text-light); font-size: 11px; text-transform: uppercase; }
    .gn-actions { display: flex; gap: 4px; }
    .gn-btn {
      background: transparent; border: 1px solid var(--gn-border); border-radius: 4px;
      color: var(--gn-text); cursor: pointer; width: 24px; height: 24px;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
      transition: all 0.1s;
    }
    .gn-btn:hover { background: var(--gn-hover-bg); color: var(--gn-active-border); }
    .gn-btn.active { background: var(--gn-active-bg); color: var(--gn-active-border); border-color: var(--gn-active-border); }

    .gn-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      scrollbar-width: thin;
    }
    .gn-item {
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid transparent;
      transition: all 0.1s;
      color: var(--gn-text);
      position: relative;
    }
    .gn-item:hover { background: var(--gn-hover-bg); }
    .gn-item.active {
      background: var(--gn-active-bg);
      border-color: var(--gn-active-border);
      box-shadow: inset 3px 0 0 var(--gn-active-border);
    }

    .gn-item.role-user .gn-idx { color: var(--gn-user-color); }
    .gn-item.role-model .gn-idx { color: var(--gn-model-color); }

    .gn-content {
      flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      margin-right: 6px;
    }
    .gn-idx { font-weight: bold; margin-right: 6px; min-width: 18px; font-size: 11px; }

    .gn-fav-btn {
      opacity: 0.1; cursor: pointer; font-size: 14px; line-height: 1; border: none; background: none; padding: 0;
    }
    .gn-item:hover .gn-fav-btn { opacity: 0.6; }
    .gn-fav-btn:hover { opacity: 1; transform: scale(1.2); }
    .gn-fav-btn.is-fav { opacity: 1; color: #fbbf24; } /* 金色 */

    .gn-footer {
      padding: 8px;
      border-top: 1px solid var(--gn-border);
      display: flex;
      gap: 4px;
    }
    .gn-nav-btn {
      flex: 1; padding: 6px; border: 1px solid var(--gn-border);
      border-radius: 4px; background: var(--gn-panel-bg); cursor: pointer;
      color: var(--gn-text); font-size: 12px;
    }
    .gn-nav-btn:hover { background: var(--gn-hover-bg); }

    .gn-resize-handle {
      position: absolute; left: 0; top: 0; bottom: 0; width: 6px; cursor: ew-resize; z-index: 10;
    }
    .gn-resize-handle:hover { background: rgba(0,0,0,0.05); }

    #gemini-nav-panel.minimized { width: auto; min-width: unset; height: auto; }
    #gemini-nav-panel.minimized .gn-list,
    #gemini-nav-panel.minimized .gn-footer,
    #gemini-nav-panel.minimized .gn-resize-handle { display: none; }
    #gemini-nav-panel.minimized .gn-title { display: none; }

    /* --- 屏蔽免责声明 CSS (集成) --- */
    hallucination-disclaimer,
    hallucination-disclaimer .capabilities-disclaimer,
    [data-test-id="highly-regulated-disclaimer"],
    .footer-disclaimer-container {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;

  // --- DOM 工具函数 ---
  function createEl(tag, className, text, props = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    for (const [k, v] of Object.entries(props)) {
      if (k === 'dataset') {
        for (const [dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
      } else if (k === 'style') {
        Object.assign(el.style, v);
      } else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.substring(2).toLowerCase(), v);
      } else {
        el[k] = v;
      }
    }
    return el;
  }

  // --- 核心逻辑 ---

  function getStorageKey() {
    const path = window.location.pathname;
    return path.length > 5 ? path : 'global';
  }

  function scanTurns() {
    const nodes = document.querySelectorAll('user-query, model-response');
    const turns = [];
    let uCount = 0, mCount = 0;

    nodes.forEach((node, index) => {
      if (node.offsetHeight === 0) return;

      // 稳定 ID 生成 (去掉了 Date.now 以保证刷新后 ID 不变，利于收藏)
      let id = node.getAttribute('data-nav-id');
      if (!id) {
        id = `gn-turn-${index}`;
        node.setAttribute('data-nav-id', id);
      }

      const isUser = node.tagName.toLowerCase() === 'user-query';
      let text = '';

      if (isUser) {
        uCount++;
        const textEl = node.querySelector('.query-text') || node.querySelector('div[class*="query-content"]');
        text = textEl ? textEl.innerText : 'User Input';
      } else {
        mCount++;
        const textEl = node.querySelector('.markdown') || node.querySelector('.model-response-text');
        text = textEl ? textEl.innerText : 'Gemini Response';
      }

      text = (text || '').replace(/\s+/g, ' ').trim();
      const preview = text.length > CONFIG.maxPreviewLength ? text.substring(0, CONFIG.maxPreviewLength) + '...' : text;

      turns.push({
        id: id,
        index: index,
        role: isUser ? 'role-user' : 'role-model',
        label: isUser ? `U${uCount}` : `G${mCount}`,
        preview: preview,
        el: node
      });
    });

    return turns;
  }

  function getDisplayList() {
    const baseTurns = scanTurns();
    const sKey = getStorageKey();

    if (!favSet.has(sKey)) favSet.set(sKey, new Set(GM_getValue(FAV_KEY_PREFIX + sKey, [])));

    const currentFavs = favSet.get(sKey);

    let displayList = baseTurns.map(item => {
      return {
        ...item,
        isFav: currentFavs.has(item.id)
      };
    });

    if (filterFav) {
      displayList = displayList.filter(item => item.isFav);
    }

    return displayList;
  }

  function renderPanel() {
    let panel = document.getElementById('gemini-nav-panel');
    let listEl;

    if (!panel) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);

      panel = createEl('div', '', '', { id: 'gemini-nav-panel' });
      const savedWidth = GM_getValue(WIDTH_KEY, CONFIG.navWidthDefault);
      panel.style.setProperty('--gn-width', `${savedWidth}px`);

      const resizeHandle = createEl('div', 'gn-resize-handle');
      panel.appendChild(resizeHandle);

      const header = createEl('div', 'gn-header');
      const title = createEl('div', 'gn-title', 'Gemini Nav');

      const actions = createEl('div', 'gn-actions');
      const btnFav = createEl('button', 'gn-btn', '★', { id: 'gn-toggle-fav', title: '显示收藏' });
      const btnRefresh = createEl('button', 'gn-btn', '⟳', { id: 'gn-refresh', title: '刷新' });
      const btnMin = createEl('button', 'gn-btn', '_', { id: 'gn-minimize', title: '收起' });

      actions.appendChild(btnFav);
      actions.appendChild(btnRefresh);
      actions.appendChild(btnMin);

      header.appendChild(title);
      header.appendChild(actions);
      panel.appendChild(header);

      listEl = createEl('div', 'gn-list');
      panel.appendChild(listEl);

      const footer = createEl('div', 'gn-footer');
      const btnPrev = createEl('button', 'gn-nav-btn', '▲', { id: 'gn-go-prev', title: '上一条' });
      const btnNext = createEl('button', 'gn-nav-btn', '▼', { id: 'gn-go-next', title: '下一条' });

      footer.appendChild(btnPrev);
      footer.appendChild(btnNext);
      panel.appendChild(footer);

      document.body.appendChild(panel);

      bindEvents(panel);
    } else {
      listEl = panel.querySelector('.gn-list');
    }

    while (listEl.firstChild) {
      listEl.removeChild(listEl.firstChild);
    }

    const items = getDisplayList();
    cacheIndex = items;

    if (items.length === 0) {
      const empty = createEl('div', '', '暂无内容', { style: { padding: '10px', color: '#999', textAlign: 'center' } });
      listEl.appendChild(empty);
    } else {
      items.forEach(item => {
        let classes = `gn-item ${item.role} ${item.id === currentActiveId ? 'active' : ''}`;

        const row = createEl('div', classes, '', { dataset: { id: item.id } });

        const idx = createEl('div', 'gn-idx', item.label);
        const content = createEl('div', 'gn-content', item.preview, { title: item.preview });
        const favClass = `gn-fav-btn ${item.isFav ? 'is-fav' : ''}`;
        const favBtn = createEl('button', favClass, '★', { title: '收藏' });

        row.addEventListener('click', () => scrollToItem(item.id));
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleFav(item.id);
        });

        row.appendChild(idx);
        row.appendChild(content);
        row.appendChild(favBtn);
        listEl.appendChild(row);
      });
    }

    const favBtnToggle = panel.querySelector('#gn-toggle-fav');
    if(filterFav) favBtnToggle.classList.add('active');
    else favBtnToggle.classList.remove('active');
  }

  function toggleFav(id) {
    const sKey = getStorageKey();
    let currentFavs = favSet.get(sKey);
    if (!currentFavs) { currentFavs = new Set(); favSet.set(sKey, currentFavs); }

    if (currentFavs.has(id)) currentFavs.delete(id);
    else currentFavs.add(id);

    GM_setValue(FAV_KEY_PREFIX + sKey, Array.from(currentFavs));
    renderPanel();
  }

  function bindEvents(panel) {
    panel.querySelector('#gn-minimize').addEventListener('click', () => {
      panel.classList.toggle('minimized');
      const btn = panel.querySelector('#gn-minimize');
      btn.textContent = panel.classList.contains('minimized') ? '+' : '_';
    });

    panel.querySelector('#gn-refresh').addEventListener('click', () => {
        detectActiveItem(); // 刷新时强制更新一次高亮状态
        renderPanel();
    });

    panel.querySelector('#gn-toggle-fav').addEventListener('click', () => {
      filterFav = !filterFav;
      renderPanel();
    });

    panel.querySelector('#gn-go-prev').addEventListener('click', () => navigate(-1));
    panel.querySelector('#gn-go-next').addEventListener('click', () => navigate(1));

    const handle = panel.querySelector('.gn-resize-handle');
    let isResizing = false;
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      e.preventDefault();
      document.body.style.cursor = 'ew-resize';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX - 20;
      if (newWidth > 100 && newWidth < 500) {
        panel.style.setProperty('--gn-width', `${newWidth}px`);
      }
    });
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        const w = parseFloat(getComputedStyle(panel).getPropertyValue('--gn-width'));
        GM_setValue(WIDTH_KEY, w);
      }
    });

    const scroller = getScroller();
    if (scroller) scroller.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
  }

  function getScroller() {
    return document.querySelector('infinite-scroller') ||
           document.querySelector('.chat-history-scroll-container') ||
           document.scrollingElement ||
           document.body;
  }

  function scrollToItem(id) {
    const target = cacheIndex.find(i => i.id === id);
    if (target && target.el) {
      // 锁定滚动监听，防止自动判定覆盖点击操作
      isUserScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);

      target.el.scrollIntoView({ behavior: CONFIG.scrollBehavior, block: 'start' });
      currentActiveId = id;
      highlightActive();

      // 延迟释放锁定
      setTimeout(() => { isUserScrolling = false; detectActiveItem(); }, 500);
    }
  }

  // --- 稳健跳转：基于当前 Active ID ---
  function navigate(dir) {
    if (cacheIndex.length === 0) return;

    let currentIndex = -1;

    // 1. 优先基于当前高亮ID查找索引
    if (currentActiveId) {
        currentIndex = cacheIndex.findIndex(item => item.id === currentActiveId);
    }

    // 2. 如果没高亮，则使用视口位置回退查找
    if (currentIndex === -1) {
        const readLine = CONFIG.headerHeight + CONFIG.readOffset;
        for (let i = 0; i < cacheIndex.length; i++) {
            const item = cacheIndex[i];
            if (item.el) {
                const rect = item.el.getBoundingClientRect();
                if (rect.bottom > readLine) {
                    currentIndex = i;
                    break;
                }
            }
        }
    }

    // 3. 边界情况处理
    if (currentIndex === -1) currentIndex = dir > 0 ? -1 : cacheIndex.length;

    let nextIdx = currentIndex + dir;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= cacheIndex.length) nextIdx = cacheIndex.length - 1;

    const targetItem = cacheIndex[nextIdx];
    if (targetItem) scrollToItem(targetItem.id);
  }

  function highlightActive() {
    const panel = document.getElementById('gemini-nav-panel');
    if (!panel) return;

    const listItems = panel.querySelectorAll('.gn-item');
    listItems.forEach(item => {
      if (item.dataset.id === currentActiveId) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function onScroll() {
    if (isUserScrolling) return;
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      detectActiveItem();
    }, 150);
  }

  // --- 稳健判定：基于阅读线 ---
  function detectActiveItem() {
    const readLine = CONFIG.headerHeight + CONFIG.readOffset;
    let activeId = null;

    for (const item of cacheIndex) {
      if (item.el) {
        const rect = item.el.getBoundingClientRect();
        // 只要元素占据了阅读线下方，且顶部在屏幕内或上方，即视为当前阅读项
        if (rect.bottom > readLine && rect.top < window.innerHeight) {
            activeId = item.id;
            break;
        }
      }
    }

    if (activeId && activeId !== currentActiveId) {
      currentActiveId = activeId;
      highlightActive();
    }
  }

  function initObserver() {
    let lastUrl = location.href;

    const bodyObserver = new MutationObserver(() => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        // 简单优化：只有DOM数量变了才重绘
        const currentCount = document.querySelectorAll('user-query, model-response').length;
        if (currentCount !== cacheIndex.length) {
            renderPanel();
        }
      }, 500);
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        currentActiveId = null;
        setTimeout(renderPanel, 1000);
      }
    }, 1000);
  }

  setTimeout(() => {
    renderPanel();
    initObserver();
    setTimeout(detectActiveItem, 500);
    console.log('Gemini QuickNav Loaded (v1.0.0).');
  }, 1500);

})();