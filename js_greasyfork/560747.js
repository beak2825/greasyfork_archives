// ==UserScript==
// @name         Linux DO 帖子过滤器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  仅在 Linux DO 主列表页过滤包含特定关键词的帖子；进入帖子详情页自动停用并卸载 UI。
// @author       liaanj
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560747/Linux%20DO%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560747/Linux%20DO%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_KEYWORDS = ['抽', '送', '福利', '车位', 'LDC'];
  const STORAGE_KEY = 'ld_filter_cfg_v3';

  let config = {
    enabled: true,
    keywords: DEFAULT_KEYWORDS,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) config = JSON.parse(stored);
  } catch (e) {
    console.error('配置读取失败', e);
  }

  let blockedCount = 0;
  let isScheduled = false;
  let isMounted = false;

  /** @type {MutationObserver | null} */
  let listObserver = null;
  /** @type {MutationObserver | null} */
  let routeObserver = null;

  /** @type {HTMLDivElement | null} */
  let hostEl = null;

  const ui = {
    fab: /** @type {HTMLButtonElement | null} */ (null),
    badge: /** @type {HTMLDivElement | null} */ (null),
    panel: /** @type {HTMLDivElement | null} */ (null),
    enable: /** @type {HTMLInputElement | null} */ (null),
    textarea: /** @type {HTMLTextAreaElement | null} */ (null),
    status: /** @type {HTMLDivElement | null} */ (null),
  };

  const noop = () => {};
  let removeDocumentClick = noop;
  let removeEscKey = noop;
  let removeSchemeListener = noop;
  let removeHistoryHooks = noop;
  let removeRouteEvent = noop;

  function isTopicListPage() {
    // Discourse 列表页通常存在 topic list rows；帖子详情页不存在。
    // 用 DOM 判定，避免依赖 URL 结构（也能覆盖分类/标签等列表页）。
    return Boolean(
      document.querySelector('tr.topic-list-item') || document.querySelector('.topic-list'),
    );
  }

  function safeAddGlobalStyle(cssText) {
    try {
      if (typeof GM_addStyle === 'function') {
        GM_addStyle(cssText);
        return;
      }
    } catch (_) {}
    const style = document.createElement('style');
    style.textContent = cssText;
    (document.head || document.documentElement).appendChild(style);
  }

  // 只注入必要的全局 CSS：隐藏列表行（UI 样式全部在 Shadow DOM 内，避免污染站点/帖子页）。
  safeAddGlobalStyle('tr.topic-list-item.ld-filtered { display: none !important; }');

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // --- 过滤逻辑（只在列表页触发） ---
  function processBatch() {
    if (!isTopicListPage()) return;
    if (!config.enabled) {
      updateBadge();
      return;
    }

    const rows = document.querySelectorAll('tr.topic-list-item:not(.ld-checked)');
    if (rows.length === 0) return;

    let newBlocked = 0;
    for (const row of rows) {
      row.classList.add('ld-checked');
      const titleEl = row.querySelector('a.title');
      if (!titleEl) continue;
      const title = titleEl.textContent || '';
      const hit = (Array.isArray(config.keywords) ? config.keywords : DEFAULT_KEYWORDS).some((k) =>
        title.includes(k),
      );
      if (hit) {
        row.classList.add('ld-filtered');
        newBlocked++;
      }
    }

    if (newBlocked > 0) {
      blockedCount += newBlocked;
      updateBadge();
    }
  }

  function scheduleProcess() {
    if (!isTopicListPage()) return;
    if (isScheduled) return;
    isScheduled = true;
    requestAnimationFrame(() => {
      processBatch();
      isScheduled = false;
    });
  }

  function resetAndReprocess() {
    if (!isTopicListPage()) return;
    document.querySelectorAll('tr.topic-list-item').forEach((row) => {
      row.classList.remove('ld-checked');
      row.classList.remove('ld-filtered');
    });
    blockedCount = 0;
    updateBadge();
    scheduleProcess();
  }

  // --- UI（Shadow DOM） ---
  function isDarkMode() {
    return Boolean(
      document.body.classList.contains('theme-dark') ||
        document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }

  function buildShadowCSS() {
    const dark = isDarkMode();
    return `
      :host{
        all: initial;
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 2147483647;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: ${dark ? '#f5f5f7' : '#1c1c1e'};
      }

      .fab{
        width: 52px; height: 52px;
        border-radius: 999px;
        border: 1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
        background: ${dark ? 'rgba(24,24,27,0.75)' : 'rgba(255,255,255,0.75)'};
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: ${dark ? '0 16px 50px rgba(0,0,0,0.55)' : '0 16px 50px rgba(0,0,0,0.18)'};
        display: grid;
        place-items: center;
        cursor: pointer;
        user-select: none;
        transition: transform 180ms ease, opacity 180ms ease, filter 180ms ease;
        position: relative;
      }
      .fab:hover{ transform: translateY(-1px) scale(1.03); }
      .fab:active{ transform: translateY(0) scale(0.98); }
      .fab.disabled{ opacity: 0.65; filter: grayscale(1); }

      .badge{
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        padding: 0 6px;
        border-radius: 999px;
        background: #ff3b30;
        color: white;
        font-weight: 700;
        font-size: 11px;
        line-height: 18px;
        text-align: center;
        display: none;
        box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      }

      .panel{
        position: absolute;
        right: 0;
        bottom: 68px;
        width: 330px;
        border-radius: 18px;
        border: 1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
        background: ${dark ? 'rgba(24,24,27,0.88)' : 'rgba(255,255,255,0.92)'};
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        box-shadow: ${dark ? '0 18px 60px rgba(0,0,0,0.62)' : '0 18px 60px rgba(0,0,0,0.20)'};
        padding: 16px 16px 14px;
        display: none;
        transform-origin: bottom right;
        animation: pop 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      @keyframes pop{
        from{ opacity: 0; transform: translateY(10px) scale(0.98); }
        to{ opacity: 1; transform: translateY(0) scale(1); }
      }

      .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }
      .title{
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .title h3{
        margin: 0;
        font-size: 15px;
        font-weight: 760;
        letter-spacing: -0.2px;
      }
      .title p{
        margin: 0;
        font-size: 12px;
        color: ${dark ? 'rgba(245,245,247,0.72)' : 'rgba(28,28,30,0.62)'};
      }
      .close{
        width: 32px; height: 32px;
        border-radius: 10px;
        border: 1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'};
        background: ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
        cursor: pointer;
        display: grid;
        place-items: center;
        color: inherit;
        transition: transform 160ms ease, background 160ms ease;
      }
      .close:hover{ transform: translateY(-1px); background: ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'}; }

      .row{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0 12px;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
        background: ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'};
      }
      .row .label{
        font-size: 13px;
        font-weight: 650;
      }

      .switch{
        position: relative;
        width: 44px;
        height: 26px;
        flex: 0 0 auto;
      }
      .switch input{
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider{
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'};
        transition: background 180ms ease;
      }
      .slider::before{
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: #ffffff;
        box-shadow: 0 10px 24px rgba(0,0,0,0.25);
        transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .switch input:checked + .slider{ background: #34c759; }
      .switch input:checked + .slider::before{ transform: translateX(18px); }

      .field-label{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 2px 0 8px;
      }
      .field-label span{
        font-size: 12px;
        color: ${dark ? 'rgba(245,245,247,0.72)' : 'rgba(28,28,30,0.62)'};
        font-weight: 600;
      }
      .hint{
        font-size: 11px;
        color: ${dark ? 'rgba(245,245,247,0.55)' : 'rgba(28,28,30,0.50)'};
      }

      textarea{
        width: 100%;
        height: 96px;
        padding: 12px 12px;
        box-sizing: border-box;
        border-radius: 14px;
        border: 1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'};
        background: ${dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.65)'};
        color: inherit;
        font-size: 13px;
        line-height: 1.4;
        resize: none;
        outline: none;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        transition: box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
      }
      textarea:focus{
        border-color: ${dark ? 'rgba(0,122,255,0.80)' : 'rgba(0,122,255,0.70)'};
        box-shadow: 0 0 0 4px ${dark ? 'rgba(0,122,255,0.25)' : 'rgba(0,122,255,0.18)'};
        background: ${dark ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.78)'};
      }

      .footer{
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-height: 18px;
      }
      .status{
        font-size: 11px;
        color: ${dark ? 'rgba(245,245,247,0.72)' : 'rgba(28,28,30,0.62)'};
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0;
        transition: opacity 200ms ease;
      }
      .status.visible{ opacity: 1; }
      .dot{
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #34c759;
        box-shadow: 0 0 0 3px rgba(52,199,89,0.18);
      }
      .dot.saving{
        background: #ff9f0a;
        box-shadow: 0 0 0 3px rgba(255,159,10,0.20);
      }
      .mini{
        font-size: 11px;
        color: ${dark ? 'rgba(245,245,247,0.55)' : 'rgba(28,28,30,0.50)'};
      }

      button{ all: unset; }
    `;
  }

  function buildUI(shadowRoot) {
    shadowRoot.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = buildShadowCSS();

    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.setAttribute('type', 'button');
    fab.setAttribute('aria-label', '打开过滤器面板');
    fab.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l7 4v6c0 5-3.2 9.4-7 10-3.8-.6-7-5-7-10V6l7-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9.2 12.1l1.8 1.8 3.9-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = '0';
    fab.appendChild(badge);

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="header">
        <div class="title">
          <h3>帖子过滤</h3>
          <p>仅在帖子列表页生效</p>
        </div>
        <button class="close" type="button" aria-label="关闭">✕</button>
      </div>

      <div class="row">
        <div class="label">启用过滤</div>
        <label class="switch" aria-label="启用过滤开关">
          <input type="checkbox">
          <span class="slider"></span>
        </label>
      </div>

      <div class="field-label">
        <span>关键词（逗号/换行分隔，自动保存）</span>
        <span class="hint">实时生效</span>
      </div>
      <textarea placeholder="例如：抽奖, 福利, 送"></textarea>

      <div class="footer">
        <div class="status" aria-live="polite">
          <span class="dot"></span>
          <span class="status-text">已保存</span>
        </div>
        <div class="mini">Esc 关闭</div>
      </div>
    `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(panel);
    shadowRoot.appendChild(fab);

    ui.fab = fab;
    ui.badge = badge;
    ui.panel = panel;
    ui.enable = panel.querySelector('.switch input');
    ui.textarea = panel.querySelector('textarea');
    ui.status = panel.querySelector('.status');

    panel.querySelector('.close').addEventListener('click', () => hidePanel());
    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    ui.enable.checked = Boolean(config.enabled);
    ui.textarea.value = (Array.isArray(config.keywords) ? config.keywords : DEFAULT_KEYWORDS).join(', ');
    if (!config.enabled) fab.classList.add('disabled');
  }

  function showPanel() {
    if (!ui.panel || !ui.textarea) return;
    ui.panel.style.display = 'block';
    ui.textarea.value = (Array.isArray(config.keywords) ? config.keywords : DEFAULT_KEYWORDS).join(', ');
    ui.panel.style.animation = 'none';
    ui.panel.offsetHeight;
    ui.panel.style.animation = '';
    ui.textarea.focus();
  }

  function hidePanel() {
    if (!ui.panel) return;
    ui.panel.style.display = 'none';
  }

  function togglePanel() {
    if (!ui.panel) return;
    const isClosed = ui.panel.style.display === 'none' || ui.panel.style.display === '';
    if (isClosed) showPanel();
    else hidePanel();
  }

  function updateBadge() {
    const badge = ui.badge;
    if (!badge) return;
    if (blockedCount > 0 && config.enabled) {
      badge.textContent = blockedCount > 99 ? '99+' : String(blockedCount);
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }

  function setStatusSaving() {
    if (!ui.status) return;
    ui.status.classList.add('visible');
    const dot = ui.status.querySelector('.dot');
    const text = ui.status.querySelector('.status-text');
    if (dot) dot.classList.add('saving');
    if (text) text.textContent = '正在保存...';
  }

  function setStatusSaved() {
    if (!ui.status) return;
    ui.status.classList.add('visible');
    const dot = ui.status.querySelector('.dot');
    const text = ui.status.querySelector('.status-text');
    if (dot) dot.classList.remove('saving');
    if (text) text.textContent = '已更新';
    setTimeout(() => {
      if (ui.status) ui.status.classList.remove('visible');
    }, 1600);
  }

  function saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('配置保存失败', e);
    }
  }

  function bindUIEvents() {
    if (!ui.enable || !ui.textarea || !ui.fab) return;

    ui.enable.addEventListener('change', (e) => {
      config.enabled = Boolean(e.target.checked);
      config.enabled ? ui.fab.classList.remove('disabled') : ui.fab.classList.add('disabled');
      saveConfig();
      resetAndReprocess();
    });

    ui.textarea.addEventListener('input', () => setStatusSaving());
    ui.textarea.addEventListener(
      'input',
      debounce(() => {
        const val = ui.textarea.value;
        config.keywords = val.split(/[,，\n]/).map((s) => s.trim()).filter(Boolean);
        saveConfig();
        resetAndReprocess();
        setStatusSaved();
      }, 500),
    );

    // 点击外部关闭（捕获阶段，尽量不受站点 stopPropagation 影响）
    const onDocClick = (e) => {
      if (!hostEl) return;
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const clickedInside = path.includes(hostEl);
      if (!clickedInside) hidePanel();
    };
    document.addEventListener('click', onDocClick, true);
    removeDocumentClick = () => document.removeEventListener('click', onDocClick, true);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') hidePanel();
    };
    document.addEventListener('keydown', onKeyDown, true);
    removeEscKey = () => document.removeEventListener('keydown', onKeyDown, true);

    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (media && typeof media.addEventListener === 'function') {
      const onScheme = () => {
        if (!hostEl || !hostEl.shadowRoot) return;
        const style = hostEl.shadowRoot.querySelector('style');
        if (style) style.textContent = buildShadowCSS();
      };
      media.addEventListener('change', onScheme);
      removeSchemeListener = () => media.removeEventListener('change', onScheme);
    }
  }

  function mount() {
    if (isMounted) return;
    if (!isTopicListPage()) return;

    hostEl = document.createElement('div');
    hostEl.id = 'ld-filter-host';
    const shadow = hostEl.attachShadow({ mode: 'open' });
    buildUI(shadow);
    document.body.appendChild(hostEl);
    bindUIEvents();

    listObserver = new MutationObserver(scheduleProcess);
    const container = document.querySelector('#main-outlet') || document.body;
    listObserver.observe(container, { childList: true, subtree: true });

    isMounted = true;
    resetAndReprocess();
  }

  function unmount() {
    if (!isMounted) return;

    try {
      if (listObserver) listObserver.disconnect();
    } catch (_) {}
    listObserver = null;

    removeDocumentClick();
    removeEscKey();
    removeSchemeListener();
    removeDocumentClick = noop;
    removeEscKey = noop;
    removeSchemeListener = noop;

    if (hostEl && hostEl.parentNode) hostEl.parentNode.removeChild(hostEl);
    hostEl = null;
    ui.fab = ui.badge = ui.panel = ui.enable = ui.textarea = ui.status = null;

    blockedCount = 0;
    isMounted = false;
  }

  function onRouteChange() {
    if (isTopicListPage()) mount();
    else unmount();
  }

  function hookHistory() {
    try {
      const fire = () => window.dispatchEvent(new Event('ld:route'));
      const push = history.pushState;
      const replace = history.replaceState;

      history.pushState = function (...args) {
        const r = push.apply(this, args);
        fire();
        return r;
      };
      history.replaceState = function (...args) {
        const r = replace.apply(this, args);
        fire();
        return r;
      };
      window.addEventListener('popstate', fire);

      removeHistoryHooks = () => {
        history.pushState = push;
        history.replaceState = replace;
        window.removeEventListener('popstate', fire);
      };
    } catch (_) {
      removeHistoryHooks = noop;
    }
  }

  function start() {
    hookHistory();

    const onRoute = debounce(onRouteChange, 80);
    window.addEventListener('ld:route', onRoute);
    removeRouteEvent = () => window.removeEventListener('ld:route', onRoute);

    // 兜底：列表内容异步渲染/替换时触发判定（Discourse SPA）
    routeObserver = new MutationObserver(onRoute);
    routeObserver.observe(document.body, { childList: true, subtree: true });

    onRouteChange();
  }

  function stop() {
    try {
      if (routeObserver) routeObserver.disconnect();
    } catch (_) {}
    routeObserver = null;

    removeRouteEvent();
    removeHistoryHooks();
    removeRouteEvent = noop;
    removeHistoryHooks = noop;

    unmount();
  }

  // 页面卸载时尽量清理（避免极端情况下残留）
  window.addEventListener('beforeunload', stop, { capture: true, once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
