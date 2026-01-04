// ==UserScript==
// @name         Ísland.is Kennitala Fix (Auto-refresh on yfirlit)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-refreshes as soon as you land on yfirlit, then replaces Kennitala values safely
// @author       You
// @match        https://island.is/minarsidur/min-gogn/yfirlit
// @match        https://island.is/minarsidur/min-gogn/yfirlit/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550268/%C3%8Dslandis%20Kennitala%20Fix%20%28Auto-refresh%20on%20yfirlit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550268/%C3%8Dslandis%20Kennitala%20Fix%20%28Auto-refresh%20on%20yfirlit%29.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // === Kennitala config ===
  const oldKT = '090605-3720'; // with dash
  const newKT = '090603-3720'; // with dash
  const oldKTplain = oldKT.replace('-', '');
  const newKTplain = newKT.replace('-', '');

  // --- Refresh immediately on yfirlit URL (only once) ---
  if (location.href === "https://island.is/minarsidur/min-gogn/yfirlit" &&
      !sessionStorage.getItem("yfirlitRefreshed")) {
    sessionStorage.setItem("yfirlitRefreshed", "1");
    setTimeout(() => location.reload(), 10); // wait 10 ms, then reload
  }

  // --- Replace Kennitala values ---
  function replaceKennitala() {
    document.querySelectorAll('p, span, div, td, th, li, a, strong, em').forEach(el => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        const txt = el.textContent;
        if (!txt) return;
        if (txt.includes(oldKT)) {
          el.textContent = txt.replaceAll(oldKT, newKT);
        } else if (txt.includes(oldKTplain)) {
          el.textContent = txt.replaceAll(oldKTplain, newKTplain);
        }
      }
    });
  }

  setInterval(replaceKennitala, 50);
})();