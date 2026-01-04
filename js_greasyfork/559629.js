// ==UserScript==
// @name         Disable Google AI Overview
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  Hides Google AI overviews. Loosely based on https://greasyfork.org/en/scripts/522574-hide-google-ai-overview.
// @author       jaredallard
// @match        *://www.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559629/Disable%20Google%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/559629/Disable%20Google%20AI%20Overview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let hidden = false;

    const hideDiv = () => {
        if (hidden) return;

        // As of 2025-12-20 only AI elements seem to have this data-al element, so we can key on it.
        document.querySelectorAll('div [data-al]').forEach(div => {
            div.style.display = 'none';
            hidden = true;
        });

        if (hidden) observer.disconnect();
    };

    // Optomistically try to hide it immediately.
    hideDiv();

    observer = new MutationObserver(hideDiv).observe(document.body, { childList: true, subtree: true });
})();