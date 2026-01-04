// ==UserScript==
// @name         X Sidebar Shortcut Hints
// @name:ja      Xショートカットキーヒント
// @namespace    https://greasyfork.org/ja/users/570127
// @description  X: Sidebar Shortcut Hints
// @description:ja  X:ショートカットキーヒント
// @author       universato
// @version      0.2.5
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560206/X%20Sidebar%20Shortcut%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/560206/X%20Sidebar%20Shortcut%20Hints.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // [data-testid, 表示するショートカット]
  const SHORTCUTS = [
    ['AppTabBar_Home_Link', 'g+h'],
    ['AppTabBar_Explore_Link', 'g+e'],
    ['AppTabBar_Notifications_Link', 'g+n'],
    ['AppTabBar_DirectMessage_Link', 'g+m'],
    ['AppTabBar_Profile_Link', 'g+p'],
  ];

  function apply() {
    SHORTCUTS.forEach(([testid, key]) => {
      const link = document.querySelector(`[data-testid="${testid}"]`);
      if (!link) return;

      // 文字ラベルを含む行のみ対象
      const labelRow = Array.from(link.querySelectorAll('div[dir="ltr"]')).find(div => !div.hasAttribute('aria-label') && div.querySelector('span'));

      if (!labelRow || labelRow.querySelector('.shortcut-hint')) return;

      const hint = document.createElement('span');
      hint.className = 'shortcut-hint';
      hint.textContent = key;

      hint.style.cssText = `
        margin-left: 8px;
        font-size: 16px;
        font-family: monospace;
        opacity: 0.45;
        padding: 2px 6px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.2);
        line-height: 1;
      `;

      labelRow.appendChild(hint);
    });
  }

  apply();
  new MutationObserver(apply)
    .observe(document.body, { childList: true, subtree: true });
})();
