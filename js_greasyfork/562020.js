// ==UserScript==
// @name         提问目录 Pro
// @namespace    https://greasyfork.org/en/scripts/562020/
// @version      1.1.4
// @description  为 ChatGPT(chatgpt.com) 与 Gemini(gemini.google.com) 提取用户提问并生成左侧目录：固定最左、展开挤压原生导航、拖拽宽度、搜索高亮、快速跳转、快捷键、右键复制。
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @author       arschlochnop
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562020/%E6%8F%90%E9%97%AE%E7%9B%AE%E5%BD%95%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/562020/%E6%8F%90%E9%97%AE%E7%9B%AE%E5%BD%95%20Pro.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /***********************
   * 配置 & 持久化
   ***********************/
  const LS_KEY = 'tm_outline_pro_v112';
  const DEFAULTS = {
    width: 320,
    collapsed: false,
    maxTitleLength: 90,
    rebuildDebounceMs: 350,
    scrollBehavior: 'smooth',
    sidebarMinHeight: 350,
    sidebarMinWidth: 140,
    sidebarMaxWidth: 560,
    scrollOffset: 24, // 跳转后微调，避免 sticky 顶栏遮挡
  };

  const store = {
    get() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
      } catch {
        return { ...DEFAULTS };
      }
    },
    set(patch) {
      const cur = store.get();
      const next = { ...cur, ...patch };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    }
  };

  let CONFIG = store.get();

  /***********************
   * 工具
   ***********************/
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function debounce(fn, wait) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function truncate(str, n) {
    const s = (str || '').replace(/\s+/g, ' ').trim();
    return s.length <= n ? s : (s.slice(0, n - 1) + '…');
  }

  function countLines(text) {
    return (text || '').split(/\r\n|\r|\n/).length;
  }

  function isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.height > 0 && rect.width > 0;
  }

  function getPlatform() {
    const h = location.hostname;
    if (h === 'chatgpt.com') return 'chatgpt';
    if (h === 'gemini.google.com') return 'gemini';
    return 'unknown';
  }

  function findConversationRoot() {
    return document.querySelector('main')
      || document.querySelector('[role="main"]')
      || document.body
      || document.documentElement;
  }

  // Gemini Trusted Types：禁止 innerHTML / insertAdjacentHTML
  // 所有 DOM 必须 createElement 组装
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') {
        // 禁止！留空，避免误用
        node.textContent = String(v);
      } else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, String(v));
    }
    for (const c of children) {
      if (c == null) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  // 纯 DOM 高亮：把 title 分段成 Text + <mark>
  function appendHighlightedText(parent, text, tokens) {
    const src = (text || '');
    const ts = (tokens || []).map(t => (t || '').trim()).filter(Boolean);
    if (!ts.length) {
      parent.appendChild(document.createTextNode(src));
      return;
    }

    // 构建一个全局 regex（OR），保证一次扫描；同时保留原文大小写
    const escaped = ts
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(Boolean);

    if (!escaped.length) {
      parent.appendChild(document.createTextNode(src));
      return;
    }

    const re = new RegExp(`(${escaped.join('|')})`, 'ig');
    let last = 0;
    let m;

    while ((m = re.exec(src)) !== null) {
      const idx = m.index;
      if (idx > last) parent.appendChild(document.createTextNode(src.slice(last, idx)));

      const mark = document.createElement('mark');
      mark.style.background = 'rgba(255,255,255,0.22)';
      mark.style.color = '#fff';
      mark.style.borderRadius = '6px';
      mark.style.padding = '0 3px';
      mark.textContent = m[0];
      parent.appendChild(mark);

      last = idx + m[0].length;

      // 防止零长度匹配导致死循环（理论不会，但加保险）
      if (re.lastIndex === idx) re.lastIndex++;
    }

    if (last < src.length) parent.appendChild(document.createTextNode(src.slice(last)));
  }

  /***********************
   * Adapter（产品化扩展点）
   ***********************/
  const ADAPTERS = {
    chatgpt: {
      root: () => findConversationRoot(),
      extractQuestions() {
        const root = this.root();

        const msgEls = Array.from(root.querySelectorAll('[data-message-author-role="user"]'))
          .filter(isElementVisible);

        const roleResults = msgEls.map(msgEl => {
          const startEl = msgEl.querySelector('.whitespace-pre-wrap') || msgEl;
          const fullText = (startEl.textContent || '').trim();
          return fullText ? { el: msgEl, startEl, fullText } : null;
        }).filter(Boolean);

        if (roleResults.length) return roleResults;

        // fallback（旧结构）
        const textEls = Array.from(root.querySelectorAll('.whitespace-pre-wrap')).filter(isElementVisible);
        return textEls.map(textEl => {
          const fullText = (textEl.textContent || '').trim();
          return fullText ? { el: textEl, startEl: textEl, fullText } : null;
        }).filter(Boolean);
      },
      getStartEl(item) {
        return item.startEl
          || item.el.querySelector('.whitespace-pre-wrap')
          || item.el.querySelector('[data-message-content]')
          || item.el;
      },
    },

    gemini: {
      root: () => findConversationRoot(),
      extractQuestions() {
        const root = this.root();

        // 你提供的：用户输入文本节点
        let textEls = Array.from(root.querySelectorAll('.query-text.gds-body-l')).filter(isElementVisible);

        // 兜底：class 变化时尽量仍可用
        if (!textEls.length) {
          textEls = Array.from(root.querySelectorAll('.query-text, [class*="query-text"]'))
            .filter(isElementVisible);
        }

        return textEls.map(textEl => {
          const fullText = (textEl.textContent || '').trim();
          if (!fullText) return null;

          const container =
            textEl.closest('[role="listitem"]') ||
            textEl.closest('article') ||
            textEl.closest('section') ||
            textEl.closest('div') ||
            textEl;

          return { el: container, startEl: textEl, fullText };
        }).filter(Boolean);
      },
      getStartEl(item) {
        return item.startEl
          || item.el.querySelector('.query-text.gds-body-l')
          || item.el.querySelector('.query-text')
          || item.el;
      },
    },
  };

  function getAdapter() {
    return ADAPTERS[getPlatform()] || null;
  }

  /***********************
   * 挤压模式：只在 init / route change / resize 时标记一次
   ***********************/
  let SHIFT_TARGETS_LOCKED = false;

  function clearShiftTargets() {
    document.querySelectorAll('.tm-outline-shift-target').forEach(el => {
      el.classList.remove('tm-outline-shift-target');
    });
  }

function markShiftTargetsOnce() {
  if (SHIFT_TARGETS_LOCKED) return;

  clearShiftTargets();
  const targets = new Set();
  const platform = getPlatform();

  // ✅ 1) 总是优先：主内容区（两站都需要）
  const main =
    document.querySelector('[role="main"]') ||
    document.querySelector('main') ||
    document.querySelector('#__next') ||
    document.body;

  if (main) targets.add(main);

  // ✅ 2) 平台差异：ChatGPT 才挤压“原生侧栏/导航”
  // Gemini 的历史抽屉/导航不要挤压，否则就会被推右、变形
  if (platform === 'chatgpt') {
    const nextRoot = document.querySelector('#__next');
    if (nextRoot) targets.add(nextRoot);

    const candidates = Array.from(document.querySelectorAll('nav, aside, [role="navigation"]'))
      .filter(isElementVisible)
      .map(el => ({ el, r: el.getBoundingClientRect() }))
      .filter(x =>
        x.r.left <= 2 &&
        x.r.width >= CONFIG.sidebarMinWidth && x.r.width <= CONFIG.sidebarMaxWidth &&
        x.r.height >= CONFIG.sidebarMinHeight
      )
      .sort((a, b) => b.r.height - a.r.height);

    if (candidates[0]?.el) targets.add(candidates[0].el);
  }

  // ✅ 3) 统一打标
  for (const el2 of targets) {
    if (!el2) continue;
    if (el2.id === 'tm-outline-pro') continue;
    if (el2.closest && el2.closest('#tm-outline-pro')) continue;
    el2.classList.add('tm-outline-shift-target');
  }

  SHIFT_TARGETS_LOCKED = true;
}


  function unlockShiftTargets() {
    SHIFT_TARGETS_LOCKED = false;
  }

  /***********************
   * 样式
   ***********************/
  function mountStyle() {
    const styleId = 'tm-outline-pro-style';
    document.getElementById(styleId)?.remove();

    const width = clamp(CONFIG.width, 220, 520);
    const collapsedW = 44;

    GM_addStyle(`
      #${styleId} {}

      #tm-outline-pro{
        position:fixed;left:0;top:0;height:100vh;width:${width}px;
        z-index:2147483647;
        background:rgba(20,20,20,.92);color:#fff;border-right:1px solid rgba(255,255,255,.12);
        font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
        display:flex;flex-direction:column;backdrop-filter:blur(6px)
      }
      #tm-outline-pro.tm-collapsed{width:${collapsedW}px}

      #tm-outline-pro .tm-header{
        display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid rgba(255,255,255,.10);
        user-select:none
      }
      #tm-outline-pro .tm-title{
        font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1
      }
      #tm-outline-pro .tm-btn{
        border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;
        border-radius:10px;padding:6px 8px;cursor:pointer;font-size:12px
      }
      #tm-outline-pro .tm-btn:hover{background:rgba(255,255,255,.12)}

      #tm-outline-pro .tm-body{padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;flex:1}
      #tm-outline-pro.tm-collapsed .tm-body{display:none}

      #tm-outline-pro input.tm-search{
        width:100%;box-sizing:border-box;border-radius:12px;border:1px solid rgba(255,255,255,.15);
        padding:8px 10px;background:rgba(255,255,255,.06);color:#fff;outline:none;font-size:12px
      }
      #tm-outline-pro .tm-list{overflow:auto;flex:1;padding-right:4px}

      #tm-outline-pro .tm-item{
        display:grid;grid-template-columns:26px 1fr;gap:8px;padding:8px;border-radius:12px;cursor:pointer;
        border:1px solid transparent;line-height:1.35;font-size:12px
      }
      #tm-outline-pro .tm-item:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.08)}
      #tm-outline-pro .tm-item.tm-active{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.18)}
      #tm-outline-pro .tm-index{opacity:.85;text-align:right;font-variant-numeric:tabular-nums}
      #tm-outline-pro .tm-main{overflow:hidden}
      #tm-outline-pro .tm-text{word-break:break-word;opacity:.96}
      #tm-outline-pro .tm-meta{margin-top:4px;font-size:11px;opacity:.70;display:flex;gap:10px}

      #tm-outline-pro .tm-footer{
        padding:10px;border-top:1px solid rgba(255,255,255,.10);display:flex;gap:8px;flex-wrap:wrap
      }
      #tm-outline-pro.tm-collapsed .tm-footer{display:none}

      #tm-outline-pro .tm-resizer{position:absolute;right:-4px;top:0;width:8px;height:100%;cursor:ew-resize}
      #tm-outline-pro .tm-resizer::after{
        content:"";position:absolute;right:3px;top:0;width:1px;height:100%;background:rgba(255,255,255,.12)
      }

      /* 挤压：无 transition，避免抖动 */
      body.tm-outline-pro-on:not(.tm-outline-pro-collapsed) .tm-outline-shift-target{
        transform:translate3d(${width}px,0,0)!important;will-change:transform
      }
      body.tm-outline-pro-on.tm-outline-pro-collapsed .tm-outline-shift-target{
        transform:translate3d(${collapsedW}px,0,0)!important;will-change:transform
      }

      .tm-outline-flash{
        outline:2px solid rgba(255,255,255,.65)!important;border-radius:10px;
        animation:tmOutlineFlash 1.2s ease-in-out 1
      }
      @keyframes tmOutlineFlash{0%{outline-color:rgba(255,255,255,.85)}100%{outline-color:rgba(255,255,255,0)}}

      #tm-outline-menu{
        position:fixed;z-index:2147483647;background:rgba(25,25,25,.96);
        border:1px solid rgba(255,255,255,.14);border-radius:12px;min-width:190px;padding:6px;display:none;
        box-shadow:0 8px 30px rgba(0,0,0,.35);color:#fff
      }
      #tm-outline-menu .m-item{
        padding:8px 10px;border-radius:10px;cursor:pointer;font-size:12px;color:#fff
      }
      #tm-outline-menu .m-item:hover{background:rgba(255,255,255,.10)}
    `);

    const ph = document.createElement('div');
    ph.id = styleId;
    ph.style.display = 'none';
    document.documentElement.appendChild(ph);
  }

  /***********************
   * 状态
   ***********************/
  const state = {
    items: [], // { id, title, fullText, el, startEl, chars, lines }
    collapsed: CONFIG.collapsed,
    activeId: null,
    searchTokens: [],
  };

  function applyModeClasses() {
    document.body.classList.toggle('tm-outline-pro-collapsed', state.collapsed);
  }

  /***********************
   * UI 构建（TT-safe）
   ***********************/
  function ensureRootInDom() {
    const root = document.getElementById('tm-outline-pro');
    if (!root) return;
    if (!document.body) return;
    if (!document.body.contains(root)) document.body.appendChild(root);
  }

  function createRoot() {
    let root = document.getElementById('tm-outline-pro');
    if (root) {
      ensureRootInDom();
      return root;
    }

    mountStyle();

    root = el('div', { id: 'tm-outline-pro' });

    const header = el('div', { class: 'tm-header' });
    const btnToggle = el('button', { class: 'tm-btn', 'data-act': 'toggle', title: '折叠/展开 (Alt+O)', text: '☰' });
    const title = el('div', { class: 'tm-title', text: '提问目录 Pro' });
    const btnRefresh = el('button', { class: 'tm-btn', 'data-act': 'refresh', title: '刷新目录', text: '↻' });
    const resizer = el('div', { class: 'tm-resizer', title: '拖拽调整宽度' });
    header.append(btnToggle, title, btnRefresh, resizer);

    const body = el('div', { class: 'tm-body' });
    const search = el('input', { class: 'tm-search', placeholder: '搜索（空格分词）…  Alt+F 聚焦' });
    const list = el('div', { class: 'tm-list' });
    body.append(search, list);

    const footer = el('div', { class: 'tm-footer' });
    const btnPrev = el('button', { class: 'tm-btn', 'data-act': 'prev', title: 'Alt+↑', text: '↑ 上一条' });
    const btnNext = el('button', { class: 'tm-btn', 'data-act': 'next', title: 'Alt+↓', text: '↓ 下一条' });
    const btnTop = el('button', { class: 'tm-btn', 'data-act': 'top', title: '跳到第一条对话', text: '⤒ 顶部' });
    footer.append(btnPrev, btnNext, btnTop);

    root.append(header, body, footer);

    (document.body || document.documentElement).appendChild(root);

    document.body.classList.add('tm-outline-pro-on');
    applyModeClasses();
    root.classList.toggle('tm-collapsed', state.collapsed);

    markShiftTargetsOnce();

    // 头部按钮：委托（只处理 toggle/refresh，避免和底部显式绑定重复）
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const act = btn.getAttribute('data-act');
      if (act === 'toggle') toggleCollapsed();
      if (act === 'refresh') rebuild();
    });

    // 底部按钮：显式绑定（更稳）
    btnPrev.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); jumpRelative(-1); });
    btnNext.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); jumpRelative(1); });
    btnTop.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); jumpToFirstQuestion(); });

    // 搜索（TT-safe：renderList 用 DOM，不用 innerHTML）
    search.addEventListener('input', () => {
      const v = search.value.trim().toLowerCase();
      state.searchTokens = v ? v.split(/\s+/).filter(Boolean) : [];
      renderList();
    });

    setupResizer(root);
    ensureContextMenu();

    // 轻量守护：Gemini 可能重绘 body，确保 root 不被移除
    const guard = new MutationObserver(() => ensureRootInDom());
    guard.observe(document.documentElement, { childList: true, subtree: true });

    return root;
  }

  function toggleCollapsed() {
    state.collapsed = !state.collapsed;
    CONFIG = store.set({ collapsed: state.collapsed });

    const root = createRoot();
    root.classList.toggle('tm-collapsed', state.collapsed);
    applyModeClasses();

    mountStyle();
  }

  function setupResizer(root) {
    const resizer = root.querySelector('.tm-resizer');
    let dragging = false;
    let startX = 0;
    let startW = 0;

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      CONFIG = store.set({ width: clamp(startW + dx, 220, 520) });
      mountStyle();
      root.classList.toggle('tm-collapsed', state.collapsed);
      applyModeClasses();
    };

    const onUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    resizer.addEventListener('mousedown', (e) => {
      dragging = true;
      startX = e.clientX;
      startW = CONFIG.width;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      e.preventDefault();
    });
  }

  /***********************
   * 右键菜单（TT-safe）
   ***********************/
  function ensureContextMenu() {
    let menu = document.getElementById('tm-outline-menu');
    if (menu) return menu;

    menu = document.createElement('div');
    menu.id = 'tm-outline-menu';

    const mi1 = document.createElement('div');
    mi1.className = 'm-item';
    mi1.setAttribute('data-act', 'copy');
    mi1.textContent = '复制提问文本';

    const mi2 = document.createElement('div');
    mi2.className = 'm-item';
    mi2.setAttribute('data-act', 'copylink');
    mi2.textContent = '复制定位链接';

    menu.append(mi1, mi2);
    (document.body || document.documentElement).appendChild(menu);

    document.addEventListener('click', hideMenu);
    window.addEventListener('scroll', hideMenu, { passive: true });

    menu.addEventListener('click', async (e) => {
      const item = e.target.closest('.m-item');
      if (!item) return;
      const act = item.getAttribute('data-act');
      const id = menu.getAttribute('data-id');
      const target = state.items.find(x => x.id === id);
      if (!target) return;

      if (act === 'copy') await navigator.clipboard.writeText(target.fullText || target.title || '');
      if (act === 'copylink') {
        const url = new URL(location.href);
        url.hash = `tmq=${encodeURIComponent(id)}`;
        await navigator.clipboard.writeText(url.toString());
      }
      hideMenu();
    });

    return menu;
  }

  function showMenu(x, y, id) {
    const menu = ensureContextMenu();
    menu.setAttribute('data-id', id);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
  }

  function hideMenu() {
    const menu = document.getElementById('tm-outline-menu');
    if (menu) menu.style.display = 'none';
  }

  /***********************
   * 渲染（TT-safe）
   ***********************/
  function getFilteredItems() {
    const tokens = state.searchTokens;
    if (!tokens.length) return state.items;
    return state.items.filter(x => {
      const hay = (x.fullText || x.title).toLowerCase();
      return tokens.every(t => hay.includes(t));
    });
  }

  function renderList() {
    const root = createRoot();
    const list = root.querySelector('.tm-list');
    const items = getFilteredItems();
    const tokens = state.searchTokens;

    clearNode(list);

    for (let i = 0; i < items.length; i++) {
      const x = items[i];

      const item = document.createElement('div');
      item.className = `tm-item ${x.id === state.activeId ? 'tm-active' : ''}`;
      item.setAttribute('data-id', x.id);
      item.title = x.fullText || '';

      const idx = document.createElement('div');
      idx.className = 'tm-index';
      idx.textContent = String(i + 1);

      const main = document.createElement('div');
      main.className = 'tm-main';

      const text = document.createElement('div');
      text.className = 'tm-text';
      appendHighlightedText(text, x.title, tokens);

      const meta = document.createElement('div');
      meta.className = 'tm-meta';
      const span = document.createElement('span');
      span.textContent = `${x.chars} 字 · ${x.lines} 行`;
      meta.appendChild(span);

      main.append(text, meta);
      item.append(idx, main);

      item.addEventListener('click', () => jumpTo(x.id));
      item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showMenu(e.clientX, e.clientY, x.id);
      });

      list.appendChild(item);
    }
  }

  function setActive(id) {
    state.activeId = id;
    renderList();
  }

  /***********************
   * 跳转
   ***********************/
  function ensureAnchorId(el0, idx) {
    if (!el0) return `tmq-${idx}`;
    let id = el0.getAttribute('data-tm-qid');
    if (!id) {
      id = `tmq-${Date.now()}-${idx}`;
      el0.setAttribute('data-tm-qid', id);
    }
    return id;
  }

  function jumpTo(id) {
    const item = state.items.find(x => x.id === id);
    if (!item?.el) return;

    const url = new URL(location.href);
    url.hash = `tmq=${encodeURIComponent(id)}`;
    history.replaceState(null, '', url.toString());

    const adapter = getAdapter();
    const startEl = adapter ? adapter.getStartEl(item) : (item.startEl || item.el);

    startEl.scrollIntoView({
      behavior: CONFIG.scrollBehavior,
      block: 'start',
      inline: 'nearest',
    });

    if (CONFIG.scrollOffset) {
      setTimeout(() => { try { window.scrollBy(0, -CONFIG.scrollOffset); } catch {} }, 0);
    }

    setActive(id);

    item.el.classList.add('tm-outline-flash');
    setTimeout(() => item.el.classList.remove('tm-outline-flash'), 1300);
  }

  function jumpRelative(delta) {
    const visible = getFilteredItems();
    if (!visible.length) return;
    let idx = visible.findIndex(x => x.id === state.activeId);
    if (idx === -1) idx = 0;
    idx = clamp(idx + delta, 0, visible.length - 1);
    jumpTo(visible[idx].id);
  }

  function jumpToFirstQuestion() {
    const first = state.items[0];
    if (first) jumpTo(first.id);
  }

  /***********************
   * 重建
   ***********************/
  function rebuild() {
    createRoot();

    const adapter = getAdapter();
    if (!adapter) return;

    const extracted = adapter.extractQuestions();
    state.items = extracted.map((x, idx) => {
      const id = ensureAnchorId(x.el, idx);
      const title = truncate(x.fullText, CONFIG.maxTitleLength);
      return {
        id,
        title,
        fullText: x.fullText,
        el: x.el,
        startEl: x.startEl,
        chars: x.fullText.length,
        lines: countLines(x.fullText),
      };
    });

    if (!state.activeId || !state.items.some(x => x.id === state.activeId)) {
      state.activeId = state.items[0]?.id || null;
    }

    renderList();
    autoJumpFromHash();
  }

  const rebuildDebounced = debounce(rebuild, CONFIG.rebuildDebounceMs);

  /***********************
   * hash 跳转（tmq=xxx）
   ***********************/
  let hashJumped = false;
  function autoJumpFromHash() {
    if (hashJumped) return;
    const m = location.hash.match(/tmq=([^&]+)/);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    if (state.items.some(x => x.id === id)) {
      hashJumped = true;
      setTimeout(() => jumpTo(id), 250);
    }
  }

  /***********************
   * 监听：内容变化 / 滚动高亮 / SPA
   ***********************/
  function setupMutationObserver() {
    const root = findConversationRoot();
    const mo = new MutationObserver(() => rebuildDebounced());
    mo.observe(root, { childList: true, subtree: true });
  }

  function setupScrollTracking() {
    window.addEventListener('scroll', debounce(() => {
      if (!state.items.length) return;

      const centerY = window.innerHeight * 0.35;
      let best = null;
      let bestDist = Infinity;

      for (const item of state.items) {
        const rect = item.el.getBoundingClientRect();
        const dist = Math.abs(rect.top - centerY);
        if (rect.bottom > 0 && rect.top < window.innerHeight && dist < bestDist) {
          bestDist = dist;
          best = item;
        }
      }

      if (best && best.id !== state.activeId) setActive(best.id);
    }, 120), { passive: true });
  }

  function setupSpaHook() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    const onRouteChange = () => {
      setTimeout(() => {
        unlockShiftTargets();
        markShiftTargetsOnce();
        rebuild();
      }, 650);
    };

    history.pushState = function () { _push.apply(this, arguments); onRouteChange(); };
    history.replaceState = function () { _replace.apply(this, arguments); onRouteChange(); };
    window.addEventListener('popstate', onRouteChange);
  }

  function setupHotkeys() {
    window.addEventListener('keydown', (e) => {
      if (!e.altKey) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault(); jumpRelative(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); jumpRelative(1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const input = createRoot().querySelector('input.tm-search');
        input?.focus();
      } else if (e.key.toLowerCase() === 'o') {
        e.preventDefault(); toggleCollapsed();
      }
    });
  }

  /***********************
   * 启动
   ***********************/
  async function init() {
    if (!getAdapter()) return;

    for (let i = 0; i < 60; i++) {
      if (findConversationRoot()) break;
      await sleep(200);
    }

    createRoot();
    rebuild();

    setupMutationObserver();
    setupScrollTracking();
    setupSpaHook();
    setupHotkeys();

    window.addEventListener('resize', debounce(() => {
      unlockShiftTargets();
      markShiftTargetsOnce();
      mountStyle();
    }, 200));
  }

  init();
})();
