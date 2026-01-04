// ==UserScript==
// @name         LinuxDo Connect Auto-Click
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically clicks the "允许" (Allow) button on LinuxDo OAuth authorization pages
// @author       neo
// @match        https://connect.linux.do/oauth2/authorize*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560101/LinuxDo%20Connect%20Auto-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/560101/LinuxDo%20Connect%20Auto-Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[LinuxDo Auto-Click] Script loaded');

    // Function to find and click the approve button
    function clickApproveButton() {
        // Try multiple selectors to ensure we find the button
        const selectors = [
            'a.bg-red-500.hover\\:bg-red-600.text-white.font-bold.py-3.px-5.rounded',
            'body > div:nth-child(3) > a.bg-red-500',
            'a[href*="/oauth2/approve/"]'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);

            if (button && button.textContent.includes('允许')) {
                console.log('[LinuxDo Auto-Click] Found approve button:', button);

                // Add a small delay to ensure page is fully rendered
                setTimeout(() => {
                    button.click();
                    console.log('[LinuxDo Auto-Click] Clicked approve button');
                }, 100);

                return true;
            }
        }

        console.log('[LinuxDo Auto-Click] Approve button not found');
        return false;
    }

    // Try to click immediately
    if (!clickApproveButton()) {
        // If not found, wait for DOM changes
        const observer = new MutationObserver((mutations, obs) => {
            if (clickApproveButton()) {
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Stop observing after 5 seconds
        setTimeout(() => {
            observer.disconnect();
            console.log('[LinuxDo Auto-Click] Stopped observing after timeout');
        }, 5000);
    }
})();