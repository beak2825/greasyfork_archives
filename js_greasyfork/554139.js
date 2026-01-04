// ==UserScript==
// @name         Startpage Auto Retry or Refresh
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically clicks "Click here" or refreshes page if no results found on Startpage
// @author       Rishabh
// @match        https://www.startpage.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554139/Startpage%20Auto%20Retry%20or%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/554139/Startpage%20Auto%20Retry%20or%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        const bodyText = document.body.innerText.toLowerCase();
        if (bodyText.includes("no search results were found for") && bodyText.includes("click here")) {
            const retryElement = document.querySelector('a[href*="do/search?query"]');
            if (retryElement && retryElement.offsetParent !== null) {
                console.log("Auto-clicking 'Click here'...");
                setTimeout(() => {
                    retryElement.click();
                    observer.disconnect();
                }, 1000);
            } else {
                console.warn("Retry element not found or not clickable. Refreshing page...");
                setTimeout(() => {
                    location.reload();
                    observer.disconnect();
                }, 1500);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();