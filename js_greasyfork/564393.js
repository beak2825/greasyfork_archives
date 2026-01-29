// ==UserScript==
// @name         Torn - Block "train" buttons only in Jail Gym
// @namespace    https://torn.com/
// @version      1.2
// @description  Disables & blocks TRAIN buttons only when the Jail Gym welcome notification is present.
// @match        https://www.torn.com/gym.php*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564393/Torn%20-%20Block%20%22train%22%20buttons%20only%20in%20Jail%20Gym.user.js
// @updateURL https://update.greasyfork.org/scripts/564393/Torn%20-%20Block%20%22train%22%20buttons%20only%20in%20Jail%20Gym.meta.js
// ==/UserScript==

(() => {
  "use strict";

  function jailGymWelcomePresent() {
    const root = document.getElementById("gymroot");
    if (!root) return false;

    // Very specific to the Jail Gym welcome block in your HTML:
    // <img ... alt="The Jail Gym" ...>
    const logo = root.querySelector('img[alt="The Jail Gym"]');
    if (!logo) return false;

    // Extra guard: ensure the nearby text contains the exact welcome sentence fragment
    const text = (root.innerText || "");
    return text.includes("Welcome to") && text.includes("The Jail Gym!");
  }

  function getTrainButtons(root = document) {
    // Matches: <button aria-label="Train strength">TRAIN</button>
    const btns = Array.from(root.querySelectorAll('button[aria-label^="Train "]'));
    return btns.filter(b => (b.textContent || "").trim().toUpperCase() === "TRAIN");
  }

  function applyBlockIfNeeded() {
    const root = document.getElementById("gymroot");
    if (!root) return;

    const shouldBlock = jailGymWelcomePresent();

    for (const btn of getTrainButtons(root)) {
      const already = btn.dataset.ttJailGymBlocked === "1";

      if (shouldBlock && !already) {
        btn.dataset.ttJailGymBlocked = "1";
        btn.disabled = true;
        btn.style.opacity = "0.45";
        btn.title = "Blocked: Jail Gym";
      }

      if (!shouldBlock && already) {
        // If you navigate away without a full reload, undo our changes cleanly
        btn.disabled = false;
        btn.style.opacity = "";
        btn.title = "";
        delete btn.dataset.ttJailGymBlocked;
      }
    }
  }

  // Block clicks only when the welcome block is present, and only for TRAIN buttons
  document.addEventListener("click", (e) => {
    if (!jailGymWelcomePresent()) return;

    const el = e.target instanceof Element ? e.target : null;
    const btn = el?.closest?.('button[aria-label^="Train "]');
    if (!btn) return;

    if ((btn.textContent || "").trim().toUpperCase() !== "TRAIN") return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);

  // Observe only the gym app root (lightweight). No intervals.
  const root = document.getElementById("gymroot");
  if (root) {
    applyBlockIfNeeded();
    new MutationObserver(() => applyBlockIfNeeded())
      .observe(root, { childList: true, subtree: true });
  } else {
    // Single cheap retry loop for late loads; stops quickly.
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      const r = document.getElementById("gymroot");
      if (r) {
        clearInterval(iv);
        applyBlockIfNeeded();
        new MutationObserver(() => applyBlockIfNeeded())
          .observe(r, { childList: true, subtree: true });
      } else if (tries >= 20) {
        clearInterval(iv);
      }
    }, 250);
  }
})();
