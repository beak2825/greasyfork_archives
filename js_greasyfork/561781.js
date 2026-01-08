// ==UserScript==
// @name         X.com Default to Following Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force X.com home to open on Following tab instead of For You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561781/Xcom%20Default%20to%20Following%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/561781/Xcom%20Default%20to%20Following%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.pathname !== '/home' && location.pathname !== '/') return;

    const observer = new MutationObserver(() => {
        const tabs = document.querySelectorAll('[role="tab"]');
        for (const tab of tabs) {
            const text = tab.textContent?.trim();
            if (text === 'Following') {
                tab.click();
                observer.disconnect();
                return;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback in case of late loading
    setTimeout(() => {
        const followingTab = Array.from(document.querySelectorAll('[role="tab"]'))
            .find(tab => tab.textContent?.trim() === 'Following');
        if (followingTab) followingTab.click();
    }, 3000);
})();