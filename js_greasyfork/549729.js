// ==UserScript==
// @license MIT
// @name         Revive Assistant
// @namespace    https://torn.com/
// @author       ogoo
// @version      0.2
// @description  個人頁面中開啟Revive輔助 ；若 機率 >50%(預設，可調整) 就把 Yes 按鈕高亮。
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549729/Revive%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/549729/Revive%20Assistant.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- 點 Revive ---------- */
  const openRevive = () => {
    const btn = document.querySelector('a.profile-button-revive');
    if (btn) btn.click(); else return setTimeout(openRevive, 200);
    waitAndHighlight();                           // 點完就進入偵測
  };

  /* ---------- 偵測彈窗並高亮 ---------- */
  const waitAndHighlight = () => {
    const t0 = performance.now();
    const loop = setInterval(() => {
      const textDiv = document.querySelector('div.text b');       // 機率節點
      const yesBtn  = document.querySelector('button.confirm-action-yes');

      if (textDiv && yesBtn) {
        const chance = parseFloat(textDiv.textContent);           // 96.41
        if (chance > 50) {
          yesBtn.style.cssText = `
            font-size:22px;
            font-weight:900;
            padding:120px 80px;
            background:#8ecaff;
            color:#003b5c !important;
            border:none !important;
            border-radius:6px;
            box-shadow:0 0 8px #8ecaff;
            transform:scale(1.10);
          `;
        }
        clearInterval(loop);                                      // 找到了就停
      }
      if (performance.now() - t0 > 10_000) clearInterval(loop);   // 最多跑 10 秒
    }, 200);
  };

  document.readyState === 'loading'
    ? addEventListener('DOMContentLoaded', openRevive)
    : openRevive();
})();
