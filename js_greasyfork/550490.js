// ==UserScript==
// @name         Remove Upgrade To Pro Lock (ColorDesigner)
// @namespace    MeowEvilMelMeow
// @version      1.0
// @license MIT
// @description  Nukes the Upgrade To Pro lock screen from when in 3+ Color Mode :3
// @match        https://colordesigner.io/gradient-generator*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550490/Remove%20Upgrade%20To%20Pro%20Lock%20%28ColorDesigner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550490/Remove%20Upgrade%20To%20Pro%20Lock%20%28ColorDesigner%29.meta.js
// ==/UserScript==

(() => {
  const delUpgPro = () => document.querySelectorAll('.lock-screen.lock-screen--center').forEach(e => e.remove());
  new MutationObserver(delUpgPro).observe(document, { childList: true, subtree: true });
  delUpgPro();
})();