// ==UserScript==
// @name         Instagram Time Gate
// @namespace    https://example.com/instagram-time-gate
// @version      1.0
// @description  Hide Instagram except between 17:00 and 20:00
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562566/Instagram%20Time%20Gate.user.js
// @updateURL https://update.greasyfork.org/scripts/562566/Instagram%20Time%20Gate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const START_HOUR = 17; // 17:00
    const END_HOUR = 20;   // 20:00
    const CHECK_INTERVAL = 60 * 1000; // 1 minute

    let blockerOverlay;

    function isAllowedTime() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= START_HOUR && hour < END_HOUR;
    }

    function getInstagramMounts() {
        return Array.from(document.querySelectorAll('div[id^="mount_"]'));
    }

    function hideInstagram() {
        getInstagramMounts().forEach(el => {
            el.style.display = 'none';
        });

        if (!blockerOverlay) {
            blockerOverlay = document.createElement('div');
            blockerOverlay.style.position = 'fixed';
            blockerOverlay.style.top = '0';
            blockerOverlay.style.left = '0';
            blockerOverlay.style.width = '100vw';
            blockerOverlay.style.height = '100vh';
            blockerOverlay.style.background = '#fff';
            blockerOverlay.style.zIndex = '999999';
            blockerOverlay.style.display = 'flex';
            blockerOverlay.style.alignItems = 'center';
            blockerOverlay.style.justifyContent = 'center';
            blockerOverlay.style.fontFamily = 'sans-serif';
            blockerOverlay.style.fontSize = '24px';
            blockerOverlay.style.color = '#333';
            blockerOverlay.innerText = 'Instagram is blocked until 17:00 🕔';

            document.body.appendChild(blockerOverlay);
        }
    }

    function showInstagram() {
        getInstagramMounts().forEach(el => {
            el.style.display = '';
        });

        if (blockerOverlay) {
            blockerOverlay.remove();
            blockerOverlay = null;
        }
    }

    function enforceRule() {
        if (isAllowedTime()) {
            showInstagram();
        } else {
            hideInstagram();
        }
    }

    // Initial run (wait for DOM)
    const observer = new MutationObserver(() => {
        enforceRule();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    enforceRule();
    setInterval(enforceRule, CHECK_INTERVAL);
})();
