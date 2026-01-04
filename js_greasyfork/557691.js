// ==UserScript==
// @name         Torn Status Text Replacer + NVDA Announcer
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Replace Torn profile status dot with text and announce status for screen readers
// @author       Bad-R [2733604]
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557691/Torn%20Status%20Text%20Replacer%20%2B%20NVDA%20Announcer.user.js
// @updateURL https://update.greasyfork.org/scripts/557691/Torn%20Status%20Text%20Replacer%20%2B%20NVDA%20Announcer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasAnnounced = false;
    let attempts = 0;
    const maxAttempts = 200; // 200 × 300ms = 60 seconds max

    function detectStatusFromClassList(clsList) {
        const clsStr = Array.from(clsList).join(" ");

        // Look for user-status-16-{Status} pattern
        const match = clsStr.match(/user-status-16-(\w+)/i);
        if (match) {
            const status = match[1];
            // Return the status capitalized
            if (/offline/i.test(status)) return "Offline";
            if (/online/i.test(status)) return "Online";
            if (/away/i.test(status)) return "Idle"; // Treat Away as Idle for announcements
        }

        return null;
    }

    function announce(text) {
        if (hasAnnounced) return; // Only announce once per page load

        const region = document.createElement("div");
        region.setAttribute("role", "alert");
        region.setAttribute("aria-live", "assertive");

        region.style.position = "absolute";
        region.style.left = "-9999px";
        region.style.top = "-9999px";

        region.textContent = text;
        document.body.appendChild(region);

        hasAnnounced = true;

        // Remove the announcement after NVDA reads it
        setTimeout(() => region.remove(), 4000);
    }

    function convertStatusIcon(icon) {
        if (!icon) return;
        if (icon.dataset.processed === "1") return;

        const status = detectStatusFromClassList(icon.classList);
        if (!status) return; // Only process if we found a valid status

        icon.dataset.processed = "1";

        // Announce status for screen readers (only once)
        if (!hasAnnounced) {
            announce(status);
        }

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
            "Offline": "#7f8c8d",
            "Away": "#e67e22",
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

    function checkForStatus() {
        attempts++;

        const icon = document.querySelector('li[id^="icon"][class*="user-status"]');
        if (icon) {
            const status = detectStatusFromClassList(icon.classList);
            if (status && !hasAnnounced) {
                announce(status);
                return; // stop polling
            }
        }

        if (attempts < maxAttempts && !hasAnnounced) {
            setTimeout(checkForStatus, 300);
        }
    }

    // Observe for dynamically loaded content
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial scan and status check
    setTimeout(() => {
        scan();
        checkForStatus();
    }, 300);
    setTimeout(scan, 500);
    setTimeout(scan, 1500);
})();