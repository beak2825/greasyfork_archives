// ==UserScript==
// @name        Google AI Studio - Bulk Log Opener
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/*
// @grant       GM_openInTab
// @version     1.2
// @author      -
// @description This creates an `Open` button in the "Logs and Datasets" dashboard allowing it to open multiple logs at once
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.2.1
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/url@0.1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557496/Google%20AI%20Studio%20-%20Bulk%20Log%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/557496/Google%20AI%20Studio%20-%20Bulk%20Log%20Opener.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = "vm-custom-open-btn";
  const LOG_REGEX = /deselect row (.+)/;
  const DATASET_BTN = '[aria-label^="Create new dataset"]';

  // Variable to store the disconnect function of the active observer
  let observerDisconnect = null;

  function cleanup() {
    if (observerDisconnect) {
      observerDisconnect();
      observerDisconnect = null;
    }
  }

  function handleNavigate() {
    // 1. Cleanup any existing observer from previous page navigations
    cleanup();

    // 2. Only run logic on the specific path
    if (window.location.pathname !== "/app/logs") {
      return;
    }

    // 3. Start a new observer
    observerDisconnect = VM.observe(document.body, () => {
      const targetNode = document.querySelector(DATASET_BTN);

      // Ensure target exists and button doesn't already exist
      if (targetNode && !document.getElementById(BUTTON_ID)) {

        const btn = document.createElement("button");
        btn.id = BUTTON_ID;
        btn.type = "button";
        btn.textContent = " Open ";
        btn.title = "Open all logs in new tabs";

        // --- DYNAMIC STYLE COPYING ---
        // Copies Angular attributes and classes to match native look
        for (const attr of targetNode.attributes) {
          if (attr.name.startsWith("_ngcontent") || attr.name === "class" || attr.name === "ms-button") {
            btn.setAttribute(attr.name, attr.value);
          }
        }

        // Manual Overrides
        btn.setAttribute("aria-label", "Open Logs");
        btn.setAttribute("aria-disabled", "false");

        // --- CLICK HANDLER ---
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const elements = document.querySelectorAll('[aria-label^="deselect row"]');

          const sessionIds = Array.from(elements)
            .map((el) => {
              const match = el.getAttribute("aria-label").match(LOG_REGEX);
              return match ? match[1] : null;
            })
            .filter(Boolean); // Remove nulls

          if (sessionIds.length === 0) {
            console.log("No logs found to open.");
            return;
          }

          console.log(`Opening ${sessionIds.length} tabs...`);

          sessionIds.forEach((id) => {
            const url = `https://aistudio.google.com/app/logs/${id}`;
            // active: false opens in background so you don't lose focus
            GM_openInTab(url, { active: false, insert: true });
          });
        });

        // --- INJECTION STRATEGY ---
        // Try to insert before the previous sibling (per your request),
        // but fallback to inserting before the target if sibling is missing.
        const sibling = targetNode.previousElementSibling;
        if (sibling) {
            sibling.before(btn);
        } else {
            targetNode.before(btn);
        }

        // 4. Disconnect observer (return true tells VM.observe to stop)
        // We also clear our reference variable since it's done.
        observerDisconnect = null;
        return true;
      }
    });
  }

  // Trigger logic on URL change
  VM.onNavigate(handleNavigate);
})();
