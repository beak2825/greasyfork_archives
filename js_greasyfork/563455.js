// ==UserScript==
// @name         Google Docs/Drive - Close storage reminder banner (one-shot wait)
// @namespace    https://tampermonkey.net/
// @version      1.2.0
// @description  Wait briefly for Google storage reminder banner/dialog close button, click once, then stop.
// @author       You
// @match        https://docs.google.com/*
// @match        https://drive.google.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563455/Google%20DocsDrive%20-%20Close%20storage%20reminder%20banner%20%28one-shot%20wait%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563455/Google%20DocsDrive%20-%20Close%20storage%20reminder%20banner%20%28one-shot%20wait%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CLOSE_BTN_SELECTOR =
    // Docs banner close
    "button[aria-label='Close banner'], " +
    "button[jsname='HSqmu'][aria-label='Close banner'], " +
    ".javascriptMaterialdesignGm3WizBannerBannerCloseActionWrapper button, " +
    // Drive banner close (your outerHTML)
    "button[aria-label='Dismiss banner'], " +
    "div.iLpyV button[jsname='C3hBYb'][aria-label='Dismiss banner']";

  const MAX_WAIT_MS = 8000;   // chờ tối đa 8 giây rồi thôi
  const CHECK_EVERY_MS = 100; // polling nhẹ, tự dừng sau khi click/timeout

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function clickLikeUser(btn) {
    btn.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    btn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    btn.click();
    btn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    btn.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  }

  function oneShotWaitAndClose() {
    const start = Date.now();

    const timer = setInterval(() => {
      const btn = document.querySelector(CLOSE_BTN_SELECTOR);

      if (btn && isVisible(btn)) {
        clearInterval(timer);
        clickLikeUser(btn);
        return;
      }

      if (Date.now() - start > MAX_WAIT_MS) {
        clearInterval(timer);
      }
    }, CHECK_EVERY_MS);
  }

  oneShotWaitAndClose();
})();
