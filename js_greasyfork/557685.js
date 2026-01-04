// ==UserScript==
// @name         Torn Status Text Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace Torn profile status dot with text
// @author       Bad-R
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557685/Torn%20Status%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/557685/Torn%20Status%20Text%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function detectStatusFromClassList(clsList) {
        const clsStr = Array.from(clsList).join(" ");

        // Look for user-status-16-{Status} pattern
        const match = clsStr.match(/user-status-16-(\w+)/i);
        if (match) {
            const status = match[1];
            // Return the status capitalized
            if (/offline/i.test(status)) return "Offline";
            if (/online/i.test(status)) return "Online";
            if (/idle/i.test(status)) return "Idle";
            if (/away/i.test(status)) return "Away";
            if (/okay/i.test(status)) return "Okay";
        }

        return null;
    }

    function convertStatusIcon(icon) {
        if (!icon) return;
        if (icon.dataset.processed === "1") return;

        const status = detectStatusFromClassList(icon.classList);
        if (!status) return; // Only process if we found a valid status

        icon.dataset.processed = "1";

        icon.style.backgroundImage = "none";
        icon.style.minWidth = "unset";
        icon.style.width = "auto";
        icon.style.height = "auto";
        icon.style.padding = "2px 6px";
        icon.style.borderRadius = "3px";
        icon.style.display = "inline-block";
        icon.style.verticalAlign = "middle";

        const colorMap = {
            "Online": "#2ecc71",
            "Idle": "#f1c40f",
            "Offline": "#7f8c8d",
            "Away": "#e67e22",
            "Okay": "#3498db"
        };

        const bg = colorMap[status];
        icon.innerHTML = `<span style="color:#111; font-weight:700; font-size:11px; background:${bg}; padding:2px 6px; border-radius:3px; display:inline-block;">${status}</span>`;
    }

    function scan() {
        // Get all status icons on the page
        const allIcons = document.querySelectorAll('li[class*="user-status-16-"]:not([data-processed])');

        allIcons.forEach(icon => {
            // Only process the FIRST occurrence of each icon ID
            // This ensures we only affect the top section, not the sidebar
            const iconId = icon.id;
            const existingProcessed = document.querySelector(`li[id="${iconId}"][data-processed="1"]`);

            if (existingProcessed) {
                // Another icon with same ID was already processed, skip this one
                icon.dataset.processed = "skip";
                return;
            }

            // Check if this icon is in the top section (not in sidebar)
            // The top section should be before any element with class "profile-mini-cont"
            const isInSidebar = icon.closest('.profile-mini-cont, .basic-information-section');

            if (!isInSidebar) {
                convertStatusIcon(icon);
            } else {
                icon.dataset.processed = "skip";
            }
        });
    }

    // Observe for dynamically loaded content
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial scan
    scan();
    setTimeout(scan, 500);
    setTimeout(scan, 1500);
})();