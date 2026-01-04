// ==UserScript==
// @name         华尔街见闻行情-放大左侧大盘
// @namespace    https://wallstreetcn.com/
// @version      1.0
// @description  华尔街见闻行情页面放大左侧自选股区域；按钮固定插入到 .config 的最后；图标🔍；找不到则右下角降级
// @author       LoneSpectator
// @license      GPL-3.0
// @match        https://wallstreetcn.com/markets/home*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559940/%E5%8D%8E%E5%B0%94%E8%A1%97%E8%A7%81%E9%97%BB%E8%A1%8C%E6%83%85-%E6%94%BE%E5%A4%A7%E5%B7%A6%E4%BE%A7%E5%A4%A7%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/559940/%E5%8D%8E%E5%B0%94%E8%A1%97%E8%A7%81%E9%97%BB%E8%A1%8C%E6%83%85-%E6%94%BE%E5%A4%A7%E5%B7%A6%E4%BE%A7%E5%A4%A7%E7%9B%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_SELECTOR = '.left-area';
  const CONFIG_SELECTOR = 'div.config, .config';

  const ICON = '🔍';
  const ICON_ACTIVE = '↩️';

  const STYLE = `
  .tm-wscn-zoomed {
    position: fixed !important;
    inset: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    background: #fff !important;
    overflow: auto !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: 0 0 0 9999px rgba(0,0,0,.35) !important;
  }
  body.tm-wscn-lock { overflow: hidden !important; }

  /* 按钮：插在 .config 的最后，尽量不影响布局 */
  #tm-wscn-zoom-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    padding: 2px 6px;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,.18);
    background: rgba(255,255,255,.9);
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    user-select: none;
    vertical-align: middle;
    flex: 0 0 auto; /* 如果父容器是 flex，避免被挤压 */
  }
  #tm-wscn-zoom-btn:hover { background: #fff; }

  /* 降级：右下角悬浮 */
  #tm-wscn-zoom-btn.tm-fallback-float {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2147483647;
    padding: 10px 12px;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,.15);
    font-size: 16px;
  }

  /* 放大后：只把自选区域内容放大 1.5 倍 */
  .tm-wscn-zoomed .my-fav {
    zoom: 1.5;
  }

  /* 兜底：极少数子元素不用 zoom 时 */
  .tm-wscn-zoomed .my-fav * {
    font-size: inherit;
  }
  `;

  function injectStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function findTarget() {
    return document.querySelector(TARGET_SELECTOR);
  }

  function findConfig() {
    // 页面可能有多个 .config，优先找离 .left-area 最近的那个
    const target = findTarget();
    if (target) {
      const within = target.closest('div')?.querySelector(CONFIG_SELECTOR);
      if (within) return within;
    }
    return document.querySelector(CONFIG_SELECTOR);
  }

  function setBtnIcon(zoomed) {
    const btn = document.getElementById('tm-wscn-zoom-btn');
    if (!btn) return;
    btn.textContent = zoomed ? ICON_ACTIVE : ICON;
    btn.title = zoomed ? '还原自选股（ESC）' : '放大自选股（ESC 退出）';
    btn.setAttribute('aria-label', zoomed ? '还原自选股' : '放大自选股');
  }

  // 核心：保证按钮在 .config 的最后
  function ensureMountedAtConfigEnd() {
    const btn = document.getElementById('tm-wscn-zoom-btn');
    if (!btn) return false;

    const cfg = findConfig();
    if (!cfg) return false;

    // 如果按钮不在 cfg 内，或者不是最后一个元素，就移动到末尾
    if (btn.parentElement !== cfg) {
      // 清掉降级浮动样式
      btn.classList.remove('tm-fallback-float');
      cfg.appendChild(btn);
      return true;
    }
    if (cfg.lastElementChild !== btn) {
      cfg.appendChild(btn);
      return true;
    }
    return true;
  }

  let targetEl = null;
  let placeholder = null;
  let zoomed = false;

  function zoomIn() {
    if (!targetEl) return;

    placeholder = document.createElement('div');
    placeholder.style.width = `${targetEl.offsetWidth}px`;
    placeholder.style.height = `${targetEl.offsetHeight}px`;
    targetEl.parentNode.insertBefore(placeholder, targetEl);

    targetEl.classList.add('tm-wscn-zoomed');
    document.body.classList.add('tm-wscn-lock');

    zoomed = true;
    setBtnIcon(true);
  }

  function zoomOut() {
    if (!targetEl) return;

    targetEl.classList.remove('tm-wscn-zoomed');
    document.body.classList.remove('tm-wscn-lock');

    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(targetEl, placeholder);
      placeholder.remove();
    }
    placeholder = null;

    zoomed = false;
    setBtnIcon(false);
  }

  function toggleZoom() {
    if (!targetEl) targetEl = findTarget();
    if (!targetEl) {
      console.warn('[tm-wscn] 未找到 .left-area，可能页面尚未渲染完成');
      return;
    }
    zoomed ? zoomOut() : zoomIn();
  }

  function ensureButton() {
    if (document.getElementById('tm-wscn-zoom-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'tm-wscn-zoom-btn';
    btn.type = 'button';
    btn.textContent = ICON;
    btn.addEventListener('click', toggleZoom);
    setBtnIcon(false);

    // 先尝试放到 config 末尾，失败就降级右下角
    const ok = (function () {
      const cfg = findConfig();
      if (!cfg) return false;
      cfg.appendChild(btn);
      return true;
    })();

    if (!ok) {
      btn.classList.add('tm-fallback-float');
      document.body.appendChild(btn);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomed) zoomOut();
  });

  function boot() {
    injectStyle(STYLE);
    ensureButton();

    // SPA/异步：不断保证按钮在 config 末尾，避免“左右跳”
    const obs = new MutationObserver(() => {
      targetEl = targetEl || findTarget();

      const btn = document.getElementById('tm-wscn-zoom-btn');
      if (!btn) return;

      const mounted = ensureMountedAtConfigEnd();
      if (!mounted && btn.classList.contains('tm-fallback-float')) {
        // 还没找到 config，就保持浮动
      }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  boot();
})();
