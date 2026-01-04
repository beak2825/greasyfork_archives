// ==UserScript==
// @name         Linux.do 摸鱼伪装器
// @namespace    waino.moyu.material
// @version      1.0.0
// @description  伪装标题（默认“abc”）；Logo隐藏；按钮/菜单切换；标题栏透明度
// @match        https://linux.do/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552485/Linuxdo%20%E6%91%B8%E9%B1%BC%E4%BC%AA%E8%A3%85%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552485/Linuxdo%20%E6%91%B8%E9%B1%BC%E4%BC%AA%E8%A3%85%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 可动态配置标题 ---
  const TITLE_KEY = 'moyu_title';
  const STORE_KEY = 'moyu_enabled';
  const OPACITY_KEY = 'moyu_header_opacity';
  const defaultTitle = 'abc';
  const defaultEnabled = location.pathname.startsWith('/latest');
  const defaultOpacity = 1; // 0~1

  const getTitle = () => (GM_getValue(TITLE_KEY, defaultTitle) || defaultTitle);
  const setTitle = (t) => GM_setValue(TITLE_KEY, (t || '').trim() || defaultTitle);

  const getEnabled = () => {
    const v = GM_getValue(STORE_KEY, null);
    return v === null ? defaultEnabled : !!v;
  };
  const setEnabled = (v) => GM_setValue(STORE_KEY, !!v);

  const getOpacity = () => {
    let v = GM_getValue(OPACITY_KEY, defaultOpacity);
    v = Number.isFinite(+v) ? Math.max(0, Math.min(1, +v)) : defaultOpacity;
    return v;
  };
  const setOpacity = (v) => {
    const num = Number.isFinite(+v) ? Math.max(0, Math.min(1, +v)) : defaultOpacity;
    GM_setValue(OPACITY_KEY, num);
    applyOpacity(num);
  };

  // 1x1 透明 ICO
  const BLANK_ICON_DATA_URL =
    'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoAwAAJgAAACAgAAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

  const CLASS_ACTIVE = 'moyu-active';

  let original = { title: null, icons: [] };
  let headObserver = null;
  let titleObserver = null, titleTimer = null;

  // ---------- icon / logo ----------
  function addBlankFaviconSentinel() {
    const head = document.head || document.documentElement;
    let link = head.querySelector('#moyu-favicon-sentinel');
    if (!link) {
      link = document.createElement('link');
      link.id = 'moyu-favicon-sentinel';
      link.rel = 'icon';
      link.href = BLANK_ICON_DATA_URL;
      head.insertBefore(link, head.firstChild);
    } else {
      link.href = BLANK_ICON_DATA_URL;
    }
  }

  function snapshotFavicons() {
    original.icons = [];
    document
      .querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]')
      .forEach(l => {
        if (l.id === 'moyu-favicon-sentinel') return;
        original.icons.push({
          rel: l.getAttribute('rel'),
          href: l.getAttribute('href'),
          sizes: l.getAttribute('sizes'),
          type: l.getAttribute('type')
        });
      });
  }

  function removeFaviconsAndManifest() {
    document
      .querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="manifest"]')
      .forEach(l => { if (l.id !== 'moyu-favicon-sentinel') l.remove(); });
    addBlankFaviconSentinel();
  }

  function startHeadObserver() {
    if (headObserver) return;
    headObserver = new MutationObserver(muts => {
      for (const m of muts) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1 || node.tagName !== 'LINK') return;
          const rel = (node.getAttribute('rel') || '').toLowerCase();
          if (rel.includes('icon') || rel === 'apple-touch-icon' || rel === 'mask-icon' || rel === 'manifest') {
            node.remove();
            addBlankFaviconSentinel();
          }
        });
      }
    });
    headObserver.observe(document.head || document.documentElement, { childList: true, subtree: true });
  }
  function stopHeadObserver() { if (headObserver) headObserver.disconnect(); headObserver = null; }

  // ---------- 标题伪装 ----------
  function enforceTitle() {
    const want = getTitle();
    if (document.title !== want) document.title = want;
  }
  function startTitleGuards() {
    if (!document.querySelector('title')) {
      const t = document.createElement('title');
      (document.head || document.documentElement).appendChild(t);
    }
    if (!titleObserver) {
      titleObserver = new MutationObserver(enforceTitle);
      titleObserver.observe(document.querySelector('title'), { childList: true, characterData: true, subtree: true });
    }
    if (!titleTimer) titleTimer = setInterval(enforceTitle, 500);
    enforceTitle();
  }
  function stopTitleGuards() { if (titleObserver) titleObserver.disconnect(); titleObserver = null; if (titleTimer) clearInterval(titleTimer); titleTimer = null; }

  // ---------- 透明度 ----------
  function ensureOpacityStyle() {
    let style = document.getElementById('moyu-opacity-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'moyu-opacity-style';
      (document.head || document.documentElement).appendChild(style);
    }
    return style;
  }
  function applyOpacity(v = getOpacity()) {
    const style = ensureOpacityStyle();
    style.textContent = `
      .two-rows.extra-info-wrapper { opacity: ${v}; }
    `;
  }

  // ---------- 模式切换 ----------
  function enterMoyu() {
    if (original.title === null) original.title = document.title;

    snapshotFavicons();
    removeFaviconsAndManifest();
    startHeadObserver();

    document.documentElement.classList.add(CLASS_ACTIVE);

    startTitleGuards();

    updateButton(true);
    setEnabled(true);
  }

  function exitMoyu() {
    stopHeadObserver();
    stopTitleGuards();

    if (original.title !== null) document.title = original.title;

    const sentinel = document.querySelector('#moyu-favicon-sentinel');
    if (sentinel) sentinel.remove();
    const head = document.head || document.documentElement;
    original.icons.forEach(i => {
      if (!i || !i.rel || !i.href) return;
      const link = document.createElement('link');
      link.setAttribute('rel', i.rel);
      link.setAttribute('href', i.href);
      if (i.sizes) link.setAttribute('sizes', i.sizes);
      if (i.type) link.setAttribute('type', i.type);
      head.appendChild(link);
    });

    document.documentElement.classList.remove(CLASS_ACTIVE);

    updateButton(false);
    setEnabled(false);
  }

  // ---------- UI ----------
  let btn;
  function ensureButton() {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = 'moyu-toggle-btn';
    btn.textContent = '…';
    btn.title = '切换摸鱼/正常';
    btn.addEventListener('click', () => (getEnabled() ? exitMoyu() : enterMoyu()));
    document.documentElement.appendChild(btn);
    return btn;
  }
  function updateButton(enabled) {
    ensureButton();
    btn.textContent = enabled ? '摸鱼中' : '正常';
    btn.className = enabled ? 'moyu-on' : 'moyu-off';
  }

  // —— 基础样式 ——
  const css = `
    #moyu-toggle-btn {
      position: fixed; left: 14px; bottom: 14px; z-index: 999999;
      padding: 8px 12px; border-radius: 12px; border: none; cursor: pointer;
      font-size: 14px; line-height: 1; box-shadow: 0 2px 10px rgba(0,0,0,.15);
      backdrop-filter: blur(6px);
    }
    #moyu-toggle-btn.moyu-on  { background: #e5e7eb; color: #111827; }
    #moyu-toggle-btn.moyu-off { background: #111827; color: #e5e7eb; }
    #moyu-toggle-btn:hover { opacity: .9; }

    /* 仅在摸鱼状态隐藏首页 Logo 相关元素 */
    html.${CLASS_ACTIVE} .home-logo-wrapper-outlet,
    html.${CLASS_ACTIVE} .title picture,
    html.${CLASS_ACTIVE} .title #site-logo,
    html.${CLASS_ACTIVE} .title .logo-big {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  // —— 菜单 ——
  function registerMenus() {
    GM_registerMenuCommand(`摸鱼模式：${getEnabled() ? '关闭' : '开启'}`, () => {
      getEnabled() ? exitMoyu() : enterMoyu();
    });

    GM_registerMenuCommand(`设置伪装标题`, () => {
      const val = prompt('输入新的伪装标题：', getTitle());
      if (val == null) return;
      setTitle(val);
      if (getEnabled()) enforceTitle();
    });

    GM_registerMenuCommand(`设置标题栏透明度`, () => {
      const cur = getOpacity();
      const input = prompt(`输入透明度（0~1，小数允许）：`, String(cur));
      if (input == null) return;
      let v = parseFloat(String(input).trim().replace('%',''));
      // 支持百分比写法（例如“60%”理解为 0.6）
      if (String(input).includes('%')) v = v / 100;
      if (!Number.isFinite(v)) return alert('无效数值');
      v = Math.max(0, Math.min(1, v));
      setOpacity(v);
    });
  }

  function domReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  addBlankFaviconSentinel();
  injectCSS();
  registerMenus();
  applyOpacity(getOpacity());

  domReady(() => {
    ensureButton();
    getEnabled() ? enterMoyu() : exitMoyu();
    applyOpacity(getOpacity());
  });
})();
