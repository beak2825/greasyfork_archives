// ==UserScript==
// @name         Hide Instagram DMs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides Instagram DMs on web with the 'h' key
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/547988/Hide%20Instagram%20DMs.user.js
// @updateURL https://update.greasyfork.org/scripts/547988/Hide%20Instagram%20DMs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dmsVisible = true;

    function toggleDMs() {
        const threadList = document.querySelector('[aria-label="Thread list"]');
        if (threadList) {
            if (dmsVisible) {
                threadList.style.display = 'none';
            } else {
                threadList.style.display = 'block';
            }
            dmsVisible = !dmsVisible;
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'h') {
            toggleDMs();
        }
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const threadList = document.querySelector('[aria-label="Thread list"]');
                if (threadList && !dmsVisible) {
                    threadList.style.display = 'none';
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();