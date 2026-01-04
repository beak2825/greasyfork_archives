// ==UserScript==
// @name         UI Fix: top toolbar overlap (wrap)
// @namespace    ui-fix-toolbar-wrap
// @version      1.0
// @description  top toolbar overlap (wrap)
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chat.chatgpt.com/*
// @match        https://*.openai.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560413/UI%20Fix%3A%20top%20toolbar%20overlap%20%28wrap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560413/UI%20Fix%3A%20top%20toolbar%20overlap%20%28wrap%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const WANT = new Set(['Download', 'Copy code', 'Share', 'Add people']);

  function isWanted(el) {
    const t = (el?.textContent || '').trim();
    return WANT.has(t);
  }

  function findToolbar() {
    const candidates = Array.from(document.querySelectorAll('button, a'))
      .filter(isWanted);

    // 找到第一个匹配项后，向上找一个“像工具条”的 flex 容器
    for (const el of candidates) {
      const bar =
        el.closest('header') ||
        el.closest('[role="banner"]') ||
        el.closest('div');

      if (!bar) continue;

      // 容器里至少包含两个目标按钮才算
      const hits = Array.from(bar.querySelectorAll('button, a')).filter(isWanted).length;
      if (hits >= 2) return bar;
    }
    return null;
  }

  function applyFix(bar) {
    if (!bar || bar.dataset.__wrapFixed === '1') return;
    bar.dataset.__wrapFixed = '1';

    // 让它可换行 + 给间距
    bar.style.display = bar.style.display || 'flex';
    bar.style.flexWrap = 'wrap';
    bar.style.gap = '8px';
    bar.style.rowGap = '6px';
    bar.style.alignItems = 'center';

    // 让按钮更紧凑一点（只影响这条 bar 里的按钮）
    const btns = Array.from(bar.querySelectorAll('button, a')).filter(isWanted);
    for (const b of btns) {
      b.style.padding = '6px 10px';
      b.style.fontSize = '12px';
      b.style.lineHeight = '1';
      b.style.whiteSpace = 'nowrap';
    }
  }

  function tick() {
    const bar = findToolbar();
    if (bar) applyFix(bar);
  }

  // 初次跑 + DOM 变化/缩放时再跑
  tick();
  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('resize', tick, { passive: true });
})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-12-27
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();