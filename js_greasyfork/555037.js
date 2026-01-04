// ==UserScript==
// @name            Plášť Dana Dreva
// @version         1
// @description     Celkom rád odpisujem vodomery
// @include         https://*.the-west.*/game.php*
// @grant           none
// @run-at          document-start
// @namespace https://greasyfork.org/users/1270627
// @downloadURL https://update.greasyfork.org/scripts/555037/Pl%C3%A1%C5%A1%C5%A5%20Dana%20Dreva.user.js
// @updateURL https://update.greasyfork.org/scripts/555037/Pl%C3%A1%C5%A1%C5%A5%20Dana%20Dreva.meta.js
// ==/UserScript==

// install early (document-start) if you want it to affect page scripts from the beginning
(function installKeysTruncator() {
  const SENTINEL = "Fingerprint2";
  const POLL_MS = 5;

  // wait for GameMap if you need that as the trigger, otherwise remove the wait
  (async function waitForGameMap() {
    while (typeof window.GameMap === "undefined") {
      await new Promise(res => setTimeout(res, POLL_MS));
    }

    // keep original in closure — do NOT mutate GameMap
    const originalObjectKeys = Object.keys;

    Object.keys = function (scope) {
      // only alter behavior for Object.keys(window)
      if (scope === window) {
        const allKeys = originalObjectKeys(scope);
        const idx = allKeys.indexOf(SENTINEL);
        // if sentinel not found, just return the full original list (safer than returning empty)
        if (idx === -1) return allKeys;
        return allKeys.slice(0, idx + 1);
      }
      return originalObjectKeys(scope);
    };
  })();
})();