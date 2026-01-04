// ==UserScript==
// @name         TestPortal Bypass Tester (Adapted Extension)
// @namespace    http://your-test-domain.com
// @version      1.3
// @description  Adapted from anti-testportal extension: Spoofs focus, timer, search for anti-bypass testing on TestPortal staging
// @author       You (TestPortal Dev)
// @match        https://*.testportal.net/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551152/TestPortal%20Bypass%20Tester%20%28Adapted%20Extension%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551152/TestPortal%20Bypass%20Tester%20%28Adapted%20Extension%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const runModules = () => {
        // Get settings from localStorage (adapt from browser.storage)
        const focus = localStorage.getItem('focus') === 'true';
        const time = localStorage.getItem('time') === 'true';
        const search = localStorage.getItem('search') === 'true';
        const searchEngine = localStorage.getItem('searchEngine') || 'google';

        localStorage.setItem('searchEngine', searchEngine);

        if (focus) {
            // Inline focus.js module
            try {
                const original = RegExp.prototype.test;
                RegExp.prototype.test = function (s) {
                    const string = this.toString();

                    if (string.includes('native code') && string.includes('function')) {
                        return true;
                    }

                    const r = original.call(this, s);
                    return r;
                };

                document.hasFocus = () => {
                    return true;
                };
                console.log('TestPortal Bypass: Focus spoofing enabled.');
            } catch (e) {
                console.error('Focus module error:', e);
                // alert(e); // Commented to avoid popups during tests
            }
        } else if (
            document.location.href.includes('/exam/LoadTestStart.html') ||
            document.location.href.endsWith('.testportal.pl/')
        ) {
            // UI for disabled state
            const startBox = document.querySelector('.button_box');
            const button = document.querySelector('.mdc-button');

            if (!startBox || !button) return;

            const statusInformation = document.createElement('span');
            statusInformation.textContent = 'Wyłączony antitestportal';

            statusInformation.style.cssText = `
                margin-left: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: gray;
            `;

            startBox.appendChild(statusInformation);
            button.style.backgroundColor = 'rgba(198,0,0,0.81)';
            console.log('TestPortal Bypass: Disabled UI shown.');
        }

        if (time) {
            // Placeholder for timer.js - replace with actual code
            console.log('TestPortal Bypass: Timer module would load here.');
            // Example: const timerScript = document.createElement('script');
            // timerScript.textContent = '/* Paste timer.js code here */';
            // document.head.appendChild(timerScript);
        }

        if (search) {
            // Placeholder for search.js - replace with actual code
            console.log('TestPortal Bypass: Search module would load here.');
            // Example: const searchScript = document.createElement('script');
            // searchScript.textContent = '/* Paste search.js code here */';
            // document.head.appendChild(searchScript);
        }
    };

    try {
        // Delay slightly for DOM readiness if needed, but run early
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runModules);
        } else {
            runModules();
        }
    } catch (e) {
        console.error('RunModules error:', e);
        // alert(e); // Commented to avoid popups
    }
})();