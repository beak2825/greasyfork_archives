// ==UserScript==
// @license MIT
// @name         WTF Healer Discord Open (new tab)
// @namespace    ogoo
// @version      1.0
// @description  在指定的 Discord 頻道(revive ping) 偵測 Torn profiles 連結，若有 於【新分頁】開啟
// @match        https://discord.com/channels/941021482144903178/941086504778891374
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549731/WTF%20Healer%20Discord%20Open%20%28new%20tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549731/WTF%20Healer%20Discord%20Open%20%28new%20tab%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ===== 可調參數 ===== */
  const OPEN_IN_NEW_TAB = true;                 // ← 變成 false 就會回到同分頁
  const LINK_RE   = /https:\/\/(?:www\.)?torn\.com\/profiles\.php\?XID=\d+/i;
  const COOLDOWN  = 4000;                       // 毫秒，避免連續多開
  /* =================== */

  let last = 0;

  function handleNode(node) {
    node.querySelectorAll?.('a[href]').forEach(a => {
      const url = a.href;
      if (LINK_RE.test(url)) {
        const now = Date.now();
        if (now - last > COOLDOWN) {
          if (OPEN_IN_NEW_TAB) {
            // ───────── 在新分頁開 ─────────
            window.open(url, '_blank', 'noopener');
          } else {
            // ───────── 同分頁跳轉 ─────────
            location.href = url;
          }
          last = now;
        }
      }
    });
  }

  function attachObserver() {
    const scroller = document.querySelector('[class*=scrollerInner]');
    if (!scroller) return setTimeout(attachObserver, 1200);

    new MutationObserver(muts =>
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1) handleNode(n);
      }))
    ).observe(scroller, { childList: true, subtree: true });
  }

  attachObserver();
})();
