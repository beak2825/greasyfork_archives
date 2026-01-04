// ==UserScript==
// @name         Auto Decline Cookies
// @namespace    http://tampermonkey.net/
// @version      2025-09-13
// @description  This script automates the decline of cookies
// @author       DeepBlackHole
// @match        *://*/*
// @icon         https://bonboarding.com/_astro/cookies.BW5LtFeH_Z2jvm40.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549432/Auto%20Decline%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/549432/Auto%20Decline%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = [
    'Reject all',
    'Decline',
    'Only essential',
    'Continue without accepting',
    'Refuse',
    'Reject non-essential',
    'Do not accept'
    ];
    const FAC = () => {
        const buttons = document.querySelectorAll('button, input[type="button"], a');

        for (let btn of buttons) {
            const text = (btn.innerText || btn.value || '').trim().toLowerCase();
            if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                console.log('[AutoDeclineCookies] Clicking button:', text);
                btn.click();
                return;
            }
        }
    };
    // for spas or slow loading banners
    const interval = setInterval()(FAC, 1000)
    // stop 15s to save your CPU
    setTimeout(() => clearInterval(interval), 15000)

})();