// ==UserScript==
// @name         YouTube: Disable Pitch Preservation
// @namespace    https://example.invalid/
// @version      1.0.0
// @description  Forces YouTube videos to NOT preserve pitch when changing playback speed (desktop + mobile).
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @run-at       document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561810/YouTube%3A%20Disable%20Pitch%20Preservation.user.js
// @updateURL https://update.greasyfork.org/scripts/561810/YouTube%3A%20Disable%20Pitch%20Preservation.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Standard + common vendor-prefixed variants.
  const PITCH_PROPS = ["preservesPitch", "mozPreservesPitch", "webkitPreservesPitch"];

  function forcePitchOff(media) {
    if (!media) return;
    for (const prop of PITCH_PROPS) {
      try {
        if (prop in media) {
          media[prop] = false;
        }
      } catch (_) {
        // Ignore failures (property missing or read-only in this environment).
      }
    }
  }

  // Try to prevent scripts from re-enabling pitch preservation later by intercepting prototype setters.
  // If redefining fails (non-configurable), the script still works via repeated enforcement.
  function hardenPrototype() {
    const proto = (typeof HTMLMediaElement !== "undefined") ? HTMLMediaElement.prototype : null;
    if (!proto) return;

    for (const prop of PITCH_PROPS) {
      try {
        if (!(prop in proto)) continue;

        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (!desc || !desc.configurable) continue;

        const originalGet = desc.get;
        const originalSet = desc.set;

        Object.defineProperty(proto, prop, {
          configurable: true,
          enumerable: desc.enumerable,
          get: function () {
            // Always report "false" to page scripts.
            // Also attempt to keep the underlying engine state off.
            try {
              if (typeof originalSet === "function") originalSet.call(this, false);
            } catch (_) {}
            try {
              if (typeof originalGet === "function") originalGet.call(this);
            } catch (_) {}
            return false;
          },
          set: function (_v) {
            // Ignore attempts to enable; force "false" into the original setter.
            try {
              if (typeof originalSet === "function") originalSet.call(this, false);
            } catch (_) {}
          },
        });
      } catch (_) {
        // If the browser does not allow redefining, fall back to event/observer enforcement.
      }
    }
  }

  function isMediaNode(node) {
    return !!node && (node.nodeName === "VIDEO" || node.nodeName === "AUDIO");
  }

  function scanAndForce() {
    const list = document.querySelectorAll("video, audio");
    for (const el of list) forcePitchOff(el);
  }

  function startObservers() {
    // MutationObserver to catch YouTube SPA navigation and player element replacements.
    const root = document.documentElement;
    if (!root) {
      setTimeout(startObservers, 50);
      return;
    }

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!node || node.nodeType !== 1) continue;

          if (isMediaNode(node)) {
            forcePitchOff(node);
            continue;
          }

          // If a subtree was added, look for media elements inside it.
          const media = node.querySelectorAll ? node.querySelectorAll("video, audio") : [];
          for (const el of media) forcePitchOff(el);
        }
      }
    });

    mo.observe(root, { childList: true, subtree: true });

    // Capture important media lifecycle events; these do not always bubble, but they are capturable.
    const events = ["loadedmetadata", "ratechange", "play", "playing", "canplay", "emptied"];
    for (const evt of events) {
      document.addEventListener(
        evt,
        (e) => {
          const t = e && e.target;
          if (isMediaNode(t)) forcePitchOff(t);
        },
        true
      );
    }

    // Periodic enforcement as a safety net (lightweight).
    setInterval(scanAndForce, 1500);

    // Initial pass (in case a media element already exists).
    scanAndForce();
  }

  hardenPrototype();
  startObservers();
})();