// ==UserScript==
// @name         Kemono Longer Expanded Title Cards on Hover
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Non-brittle shim for expanding titles. Restores the full title string and expands it when hovering over the entire post card. You will be able to see titles without any truncation. (Version agnostic)
// @match        https://kemono.cr/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550578/Kemono%20Longer%20Expanded%20Title%20Cards%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/550578/Kemono%20Longer%20Expanded%20Title%20Cards%20on%20Hover.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1) Inject CSS immediately (works even if the shim fails for any reason)
  try {
    const style = document.createElement("style");
    style.textContent = `
    .post-card {
      position: relative !important; /* Set positioning context for the absolute header */
    }
    .post-card__header {
      padding: 5px !important;
      z-index: 1 !important;
      color: #fff !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 100% !important;
      display: block !important;
      position: relative !important;
    }
    .post-card:hover .post-card__header {
      white-space: normal !important;
      overflow: visible !important;
      background: #2e1905 !important;
      color: #fff !important;
      padding: 4px 6px !important;
      z-index: 9999 !important;
      position: absolute !important;
      width: auto !important;
      max-width: 300px !important;
      border-radius: 6px !important;
    }`;
    (document.head || document.documentElement).appendChild(style);
  } catch (e) {
    // ignore
  }

  // 2) Inject a minimal page-context shim that targets only:
  //    "".concat(X.slice(0, 50), "...")
  // It returns the original full X, not the 50-char slice.
  // This avoids brittle function replacement and bundler assumptions.
  const shim = function () {
    try {
      const S = String.prototype;
      const origSlice = S.slice;
      const origConcat = S.concat;

      // Side channel to connect slice -> concat for the exact pattern
      let lastSliceValue = null;
      let lastSliceSource = null;

      Object.defineProperty(S, "slice", {
        configurable: true,
        writable: true,
        value: function (start, end) {
          // Call the real slice first
          const src = String(this);
          const out = origSlice.call(src, start, end);

          // Only record when pattern matches exactly slice(0, 50) and src was
          // actually longer (so truncation was intended).
          if (
            start === 0 &&
            end === 50 &&
            typeof out === "string" &&
            src.length > 50
          ) {
            lastSliceValue = out;
            lastSliceSource = src;
          } else {
            // Any other slice clears the channel
            lastSliceValue = null;
            lastSliceSource = null;
          }

          return out;
        },
      });

      Object.defineProperty(S, "concat", {
        configurable: true,
        writable: true,
        value: function (...args) {
          // Only target: "".concat(<recent-slice-0-50>, "...")
          // i.e. receiver is "", 2 args, last is "...", first equals the last
          // recorded slice result.
          try {
            if (
              (this === "" || String(this) === "") &&
              args.length === 2 &&
              args[1] === "..." &&
              typeof args[0] === "string" &&
              lastSliceValue !== null &&
              args[0] === lastSliceValue
            ) {
              // Return the original full string (undo truncation entirely)
              return lastSliceSource;
            }
          } catch (e) {
            // fall through to original
          }

          return origConcat.apply(this, args);
        },
      });
    } catch (e) {
      // If anything goes wrong, fail silently rather than breaking the page
    }
  };

  // Ensure the shim runs in the page context (not the userscript sandbox)
  try {
    const s = document.createElement("script");
    s.textContent = `(${shim})();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  } catch (e) {
    // ignore
  }
})();