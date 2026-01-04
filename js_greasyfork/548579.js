// ==UserScript==
// @name         GeoGuessr — Auto "Play Again" (Classic)
// @namespace    by ADRIANXU
// @version      1.32
// @description  Helps you stay focused while playing GeoGuessr Classic games. Automatically clicks the final ‘Play Again’ button at the end of a game.
// @match        https://www.geoguessr.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548579/GeoGuessr%20%E2%80%94%20Auto%20%22Play%20Again%22%20%28Classic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548579/GeoGuessr%20%E2%80%94%20Auto%20%22Play%20Again%22%20%28Classic%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_ENABLED = "gg_auto_play_again_enabled";
  const CLICK_DELAY_MS = 80;   // tiny delay to let UI settle
  const COOLDOWN_MS    = 5000; // prevent re-fire on re-renders

  let enabled = GM_getValue(STORAGE_ENABLED, true);
  let lastClickAt = 0;
  let lastUrl = location.href;
  let inFlight = false;
  const clickedButtons = new WeakSet(); // avoid double-clicking same DOM node

  // ---------- UI toggle ----------
  GM_registerMenuCommand(`Auto Play Again: ${enabled ? "ON" : "OFF"}`, () => {
    enabled = !enabled; GM_setValue(STORAGE_ENABLED, enabled); updateBadge();
  });

  GM_addStyle(`
    .gg-autoplay-badge {
      position: fixed; right: 10px; bottom: 10px; z-index: 999999;
      background: rgba(0,0,0,.65); color: #fff; padding: 6px 10px;
      border-radius: 999px; font: 12px/1 system-ui, sans-serif; cursor: pointer;
    }
    .gg-autoplay-badge.off { background: rgba(128,0,0,.65); }
  `);

  function addBadge() {
    const b = document.createElement("div");
    b.className = "gg-autoplay-badge";
    b.onclick = () => { enabled = !enabled; GM_setValue(STORAGE_ENABLED, enabled); updateBadge(); };
    document.body.appendChild(b); updateBadge();
  }
  function updateBadge() {
    const b = document.querySelector(".gg-autoplay-badge");
    if (b) { b.textContent = `Auto "Play Again": ${enabled ? "ON" : "OFF"}`; b.classList.toggle("off", !enabled); }
  }
  addBadge();

  // ---------- helpers ----------
  function isVisible(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
  }

  function findPlayAgainBtn() {
    const el = document.querySelector('button[data-qa="play-again-button"]');
    return isVisible(el) ? el : null;
  }

  function tryClickPlayAgain() {
    if (!enabled || inFlight) return;
    const now = Date.now();
    if (now - lastClickAt < COOLDOWN_MS) return;

    const btn = findPlayAgainBtn();
    if (!btn || clickedButtons.has(btn)) return;

    inFlight = true;
    setTimeout(() => {
      // single, plain click to avoid duplicate handlers
      btn.click();
      clickedButtons.add(btn);
      lastClickAt = Date.now();
      inFlight = false;
    }, CLICK_DELAY_MS);
  }

  function onUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      // allow new click cycle on real navigation
      lastClickAt = 0;
      inFlight = false;
      // clickedButtons will naturally clear when DOM nodes are replaced
    }
  }

  // ---------- single observer (no polling) ----------
  const mo = new MutationObserver(() => {
    onUrlChange();
    tryClickPlayAgain();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
