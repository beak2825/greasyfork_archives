// ==UserScript==
// @name         SpicyWriter – Persistent Exact Reset Time
// @namespace    spicywriter.reset.exact.v2
// @description  Shows the exact time your daily limit resets.
// @match        https://spicywriter.com/write/*
// @grant        none
// @license      MIT
// @version 0.0.1.20260111144622
// @downloadURL https://update.greasyfork.org/scripts/562274/SpicyWriter%20%E2%80%93%20Persistent%20Exact%20Reset%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/562274/SpicyWriter%20%E2%80%93%20Persistent%20Exact%20Reset%20Time.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STORAGE_KEY = "spicywriter_reset_at";
  const TIMER_SELECTOR = ".reset-time";
  const DISPLAY_ID = "exact-reset-time";

  function parseCountdown(text) {
    let ms = 0;
    const h = text.match(/(\d+)\s*h/i);
    const m = text.match(/(\d+)\s*m/i);
    const s = text.match(/(\d+)\s*s/i);

    if (h) ms += Number(h[1]) * 3600000;
    if (m) ms += Number(m[1]) * 60000;
    if (s) ms += Number(s[1]) * 1000;

    return ms || null;
  }

  function formatReset(ts) {
    return new Date(ts).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function ensureDisplay(timerEl) {
    // Avoid duplicates inside remounted containers
    if (timerEl.parentElement.querySelector(`#${DISPLAY_ID}`)) return;

    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (!stored) return;

    const div = document.createElement("div");
    div.id = DISPLAY_ID;
    div.style.cssText = `
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
      font-family: system-ui, sans-serif;
    `;
    div.textContent = `Resets at ${formatReset(stored)}`;

    timerEl.parentElement.appendChild(div);
  }

  function computeIfNeeded(timerEl) {
    const text = timerEl.textContent.trim();
    const remainingMs = parseCountdown(text);
    if (!remainingMs) return;

    const now = Date.now();
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    const calculated = now + remainingMs;

    // Only recompute if:
    // - nothing stored
    // - stored already expired
    // - countdown jumped significantly (new day)
    if (
      !stored ||
      stored < now ||
      Math.abs(stored - calculated) > 60000
    ) {
      localStorage.setItem(STORAGE_KEY, calculated);
    }
  }

  function handleTimer(timerEl) {
    computeIfNeeded(timerEl);
    ensureDisplay(timerEl);
  }

  function scan() {
    const timers = document.querySelectorAll(TIMER_SELECTOR);
    if (!timers.length) return;
    handleTimer(timers[0]); // duplicates are normal
  }

  // Initial scan
  scan();

  // Watch for the timer being mounted/unmounted
  const observer = new MutationObserver(() => {
    scan();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

