// ==UserScript==
// @name         z-library - "Mark as Downloaded" visible
// @namespace    vm.zlibrary.sk.markdownloaded
// @version      1.0.2
// @description  Forces the "Mark as downloaded" control to be always visible and larger on https://z-library.sk/book/* by injecting CSS into z-cover Shadow DOM ASAP.
// @match        https://z-library.sk/book/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1lib.sk
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563509/z-library%20-%20%22Mark%20as%20Downloaded%22%20visible.user.js
// @updateURL https://update.greasyfork.org/scripts/563509/z-library%20-%20%22Mark%20as%20Downloaded%22%20visible.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'vm-mark-as-downloaded-style';

  const css = `
.mark-as-downloaded{
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  min-height: 56px !important;
  padding: 12px 14px !important;

  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1 !important;

  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;

  background: rgba(0,0,0,.72) !important;
  color: #fff !important;

  border-radius: 12px 0 0 0 !important;
  z-index: 999 !important;
}

.image:hover + .mark-as-downloaded{
  opacity: 1 !important;
}

.preview{
  pointer-events: none !important;
}
`;

  function injectIntoZCover(zCover) {
    const sr = zCover.shadowRoot;
    if (!sr) return false;

    if (sr.getElementById(STYLE_ID)) return true;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    sr.appendChild(style);
    return true;
  }

  function scanAndInject() {
    document.querySelectorAll('z-cover[markbutton], z-cover').forEach(injectIntoZCover);
  }

  // Fast retry loop early (covers components that attach shadowRoot after a tick)
  let tries = 0;
  const maxTries = 200; // stops after ~10s at 50ms
  const timer = setInterval(() => {
    scanAndInject();
    tries += 1;
    if (tries >= maxTries) clearInterval(timer);
  }, 50);

  // Keep up with dynamic content
  const mo = new MutationObserver(scanAndInject);
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
