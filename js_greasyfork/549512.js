// ==UserScript==
// @name         Eink-style Page Turn Buttons (Instant, 80%, Side-Centered)
// @name:zh-CN   类Eink整页翻按钮（瞬时、80%、侧边居中）
// @namespace    https://example.com/userscripts/pageturn
// @version      0.5.1
// @description        Two side-centered ▲/▼ buttons for instant 80%-viewport page jumps without animation.
// @description:zh-CN  两侧中部 ▲/▼ 按钮，点击瞬时跳转 80% 视口高度，无滚动动画，适合类 Eink 翻页阅读。
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549512/Eink-style%20Page%20Turn%20Buttons%20%28Instant%2C%2080%25%2C%20Side-Centered%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549512/Eink-style%20Page%20Turn%20Buttons%20%28Instant%2C%2080%25%2C%20Side-Centered%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.top !== window.self) return;

  const cfg = {
    btnSize: 48,
    btnOffset: 16,
    btnGap: 12,
    pageRatio: 0.8,
    theme: 'dark',     // 'dark' | 'light'
    bgAlpha: 0.18,
    btnOpacity: 0.38,
    leftId: 'ptb-side-left',
    rightId: 'ptb-side-right'
  };

  // force no smooth scrolling
  const style = document.createElement('style');
  style.textContent = 'html{scroll-behavior:auto!important}';
  document.documentElement.appendChild(style);

  const scroller = document.scrollingElement || document.documentElement;

  const jumpByRatio = (dir) => {
    const delta = Math.round(window.innerHeight * cfg.pageRatio);
    scroller.scrollTop = scroller.scrollTop + dir * delta;
  };

  const mkButton = (label, dir) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      width: cfg.btnSize + 'px',
      height: cfg.btnSize + 'px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      lineHeight: cfg.btnSize + 'px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      opacity: String(cfg.btnOpacity)
    });
    if (cfg.theme === 'dark') {
      btn.style.background = `rgb(0 0 0 / ${cfg.bgAlpha})`;
      btn.style.color = '#fff';
    } else {
      const alpha = Math.min(0.9, Math.max(0.15, 0.6 + cfg.bgAlpha));
      btn.style.background = `rgb(255 255 255 / ${alpha})`;
      btn.style.color = '#000';
      btn.style.border = '1px solid rgba(0,0,0,0.15)';
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      jumpByRatio(dir);
    });
    return btn;
  };

  const mkSideGroup = (side, id) => {
    const wrap = document.createElement('div');
    wrap.id = id;
    Object.assign(wrap.style, {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: '2147483647',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: cfg.btnGap + 'px',
      pointerEvents: 'auto'
    });
    wrap.style[side] = cfg.btnOffset + 'px';

    wrap.appendChild(mkButton('▲', -1));
    wrap.appendChild(mkButton('▼', +1));
    (document.body || document.documentElement).appendChild(wrap);
  };

  const ensureUI = () => {
    if (!document.getElementById(cfg.leftId)) mkSideGroup('left', cfg.leftId);
    if (!document.getElementById(cfg.rightId)) mkSideGroup('right', cfg.rightId);
  };

  ensureUI();

  const observer = new MutationObserver(() => ensureUI());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
