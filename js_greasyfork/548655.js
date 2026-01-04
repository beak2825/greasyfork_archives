// ==UserScript==
// @name         ZyBooks 'Check' shortcut
// @namespace    zybooks.checkhotkey
// @version      2025-09-06.3
// @description  Creates a keyboard shortcut (Ctrl + Enter) for submitting and continuing to the next step of challenge activities
// @author       Anonymous
// @match        https://learn.zybooks.com/zybook/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zybooks.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548655/ZyBooks%20%27Check%27%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/548655/ZyBooks%20%27Check%27%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'Enter') {
            // Collect all possible "check" or "next" buttons
            let buttons = document.querySelectorAll(
                ".zb-button.primary.raised, " +
                ".zyante-progression-check-button.button, " +
                ".zyante-progression-next-button.button"
            );

            if (buttons.length < 1) return;

            let closestButton = buttons[0];

            // Find the last button that's still visible on screen
            for (let i = buttons.length - 1; i >= 0; i--) {
                const rect = buttons[i].getBoundingClientRect();
                if (rect.top < 0) break;
                closestButton = buttons[i];
            }

            // Handle check/next button grouping
            let container = closestButton.closest(".check-next-container");
            if (container) {
                let checkNextButtons = container.querySelectorAll(
                    ".zb-button.primary.raised, " +
                    ".zyante-progression-check-button.button, " +
                    ".zyante-progression-next-button.button"
                );

                for (let i = checkNextButtons.length - 1; i >= 0; i--) {
                    let button = checkNextButtons[i];

                    // Prefer "next" buttons that are not disabled
                    if (
                        (button.classList.contains("zyante-progression-next-button") ||
                         (!button.classList.contains("check") && !button.classList.contains("disabled")))
                    ) {
                        closestButton = button;
                        break;
                    }
                }
            }

            closestButton.click();
        }
    });
})();
