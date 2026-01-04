// ==UserScript==
// @name        Show account names (all locales)
// @namespace   io.inp
// @match       https://*.esologs.com/reports/*
// @grant       none
// @version     1.3
// @author      Xandaros (tweaked)
// @license     BSD2
// @run-at      document-end
// @description Replaces all character names with account names on any esologs locale (e.g., ru.esologs.com)
// @downloadURL https://update.greasyfork.org/scripts/552707/Show%20account%20names%20%28all%20locales%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552707/Show%20account%20names%20%28all%20locales%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // Replace character names with account display names inside a jQuery-like wrapper or Node
  function replaceNames(nodeOr$) {
    const $root = window.jQuery ? window.jQuery(nodeOr$) : null;
    const nodeList = $root ? $root.contents().toArray() : (nodeOr$?.childNodes ? Array.from(nodeOr$.childNodes) : []);

    for (const inner of nodeList) {
      if (!inner) continue;

      // Only process text nodes; skip anything inside script/style/textarea/input
      if (inner.nodeType === Node.TEXT_NODE && inner.parentElement) {
        const tag = inner.parentElement.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "INPUT") {
          continue;
        }

        const txt = inner.textContent;
        if (!txt || !Array.isArray(window.players)) continue;

        let out = txt;
        for (const player of window.players) {
          if (!player) continue;
          if (player.type === "NPC" || player.anonymous) continue;
          if (!player.name || !player.displayName) continue;

          // Avoid re-replacing if we've already swapped in the display name
          if (out.includes(player.displayName)) continue;

          // Plain string replaceAll. Names on logs are not localized, so this works across locales.
          out = out.replaceAll(player.name, player.displayName);
        }

        if (out !== txt) inner.textContent = out;
      }

      // Recurse
      if (inner.childNodes && inner.childNodes.length) replaceNames(inner);
    }
  }

  // Run once players are available, then observe DOM changes
  function initWhenReady() {
    if (Array.isArray(window.players) && window.players.length > 0) {
      // Initial sweep
      replaceNames(document.documentElement);

      // Observe changes so dynamic UI updates also get rewritten
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "childList") {
            m.addedNodes.forEach((n) => replaceNames(n));
          } else if (m.type === "characterData" && m.target?.parentElement) {
            replaceNames(m.target.parentElement);
          }
        }
      });

      obs.observe(document.documentElement, {
        childList: true,
        characterData: true,
        subtree: true
      });
      return true;
    }
    return false;
  }

  // Try immediately, then retry a few times in case players loads late
  if (!initWhenReady()) {
    const maxTries = 30;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (initWhenReady() || tries >= maxTries) clearInterval(timer);
    }, 500);
  }
})();