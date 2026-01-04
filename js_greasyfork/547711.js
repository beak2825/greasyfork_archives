// ==UserScript==
// @name         GitHub Actions Retry Floating Button
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a floating button to GitHub Actions run pages to retry all jobs with one click
// @match        https://github.com/*/actions/runs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547711/GitHub%20Actions%20Retry%20Floating%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/547711/GitHub%20Actions%20Retry%20Floating%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create the button
    const btn = document.createElement('button');
    btn.textContent = 'Retry Failed Jobs';
    btn.style.position = 'fixed';
    btn.style.bottom = '30px';
    btn.style.right = '30px';
    btn.style.padding = '14px 24px';
    btn.style.zIndex = '10000';
    btn.style.background = '#28a745';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '99px';
    btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    btn.style.transition = 'background 0.2s';
    btn.addEventListener('mouseenter', () => btn.style.background = '#218838');
    btn.addEventListener('mouseleave', () => btn.style.background = '#28a745');

    // Retry function
    btn.onclick = async () => {
        // Look for all "Re-run jobs" buttons and click them
        const menuButton = Array.from(document.querySelectorAll('button'))
            .filter(btn => /Re-run jobs/i.test(btn.textContent) && btn.offsetParent !== null)[0];

        if (!menuButton) {
            alert('No "Re-run jobs" button found on this page.');
            return;
        }

        menuButton.click();

        const retryButton = Array.from(document.querySelectorAll('button'))
            .filter(btn => /Re-run failed jobs/i.test(btn.textContent))[0];

        if (!retryButton) {
            alert('No "Re-run failed jobs" button found on this page.');
            return;
        }

        retryButton.click();

        const dialogRetryButton = Array.from(document.querySelector('#rerun-dialog-failed').querySelectorAll('button')).filter(btn => /Re-run jobs/i.test(btn.textContent))[0];

        if (!dialogRetryButton) {
            alert('No "Re-run jobs" dialog button found on this page.');
            return;
        }

        dialogRetryButton.click();
    };

    document.body.appendChild(btn);
})();