// ==UserScript==
// @name         Geoguessr Duels summary - Open on Round 1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically open the first round instead of the last one in Geoguessr duel and team duel summaries.
// @match        https://www.geoguessr.com/duels/*/summary
// @match        https://www.geoguessr.com/team-duels/*/summary
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554133/Geoguessr%20Duels%20summary%20-%20Open%20on%20Round%201.user.js
// @updateURL https://update.greasyfork.org/scripts/554133/Geoguessr%20Duels%20summary%20-%20Open%20on%20Round%201.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });
  }

  async function openFirstRound() {
    try {
      await waitForElement('div[class^="game-summary_text"]');

      // Get all clickable round elements
      const roundButtons = Array.from(
        document.querySelectorAll('div[class^="game-summary_text"]')
      ).filter((el) => el.textContent.trim().match(/^Round\s*\d+/i));

      // Find "Round 1"
      const round1 = roundButtons.find((el) =>
        /^Round\s*1$/i.test(el.textContent.trim())
      );

      if (round1) {
        console.log('[Geoguessr Round Opener] Clicking "Round 1"...');
        round1.click();
      } else {
        console.warn("[Geoguessr Round Opener] Could not find Round 1 button");
      }
    } catch (err) {
      console.error("[Geoguessr Round Opener]", err);
    }
  }

  openFirstRound();
})();
