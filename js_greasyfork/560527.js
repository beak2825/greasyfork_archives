// ==UserScript==
// @name         Frontend Masters – Timestamp Duration Enhancer
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Appends (duration) to timestamp ranges like "00:53:09 - 01:06:06".
// @match        https://frontendmasters.com/*
// @match        https://*.frontendmasters.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560527/Frontend%20Masters%20%E2%80%93%20Timestamp%20Duration%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560527/Frontend%20Masters%20%E2%80%93%20Timestamp%20Duration%20Enhancer.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Matches:
  // 00:53:09 - 01:06:06
  // 53:09 - 1:06:06
  // 5:09 - 6:06
  const RANGE_RE = /^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*$/;

  function timeToSeconds(t) {
    const parts = t.split(":").map(Number);
    if (parts.some(n => Number.isNaN(n))) return null;

    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
    return null;
  }

  function secondsToHMS(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");

    if (h > 0) return `${h}:${mm}:${ss}`;
    return `${m}:${ss}`; // keep it compact if < 1 hour
  }

  function updateOne(el) {
    if (!(el instanceof HTMLElement)) return;

    const raw = (el.textContent || "").trim();

    // Avoid double-appending if script runs multiple times.
    // If it already ends with "(...)", skip.
    if (/\)\s*$/.test(raw) && /\([^)]+\)\s*$/.test(raw)) return;

    const m = raw.match(RANGE_RE);
    if (!m) return;

    const start = m[1];
    const end = m[2];

    const startSec = timeToSeconds(start);
    const endSec = timeToSeconds(end);
    if (startSec == null || endSec == null) return;

    const dur = endSec - startSec;
    if (dur < 0) return; // don't guess across day boundaries

    const durStr = secondsToHMS(dur);
    el.textContent = `${start} - ${end} (${durStr})`;
  }

  function scan(root = document) {
    root
      .querySelectorAll('div[data-timestamp]')
      .forEach(updateOne);
  }

  // Initial scan
  scan();

  // For pages that load/replace content dynamically
  const obs = new MutationObserver((mutations) => {
    for (const mu of mutations) {
      if (mu.type === "childList") {
        mu.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          // Update the node itself if it matches, plus any descendants.
          updateOne(n);
          scan(n);
        });
      } else if (mu.type === "characterData") {
        const parent = mu.target && mu.target.parentElement;
        if (parent) updateOne(parent);
      }
    }
  });

  obs.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true
  });
})();
