// ==UserScript==
// @name         YouTube 4 Videos Per Row Fix|Size fix.
// @namespace    https://youtube.com/
// @version      1.1
// @description  Choose 3/4/5 videos per row via menu.
// @author       Ampedeath
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556571/YouTube%204%20Videos%20Per%20Row%20Fix%7CSize%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/556571/YouTube%204%20Videos%20Per%20Row%20Fix%7CSize%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyFix = () => {
        const grid = document.getElementById("contents");
        if (!grid) return;

        const value = GM_getValue("itemsPerRow", 4); // default 4
        grid.style.setProperty("--ytd-rich-grid-items-per-row", value.toString());
    };

    GM_registerMenuCommand("3 videos per row", () => { GM_setValue("itemsPerRow", 3); applyFix(); });
    GM_registerMenuCommand("4 videos per row", () => { GM_setValue("itemsPerRow", 4); applyFix(); });
    GM_registerMenuCommand("5 videos per row", () => { GM_setValue("itemsPerRow", 5); applyFix(); });

    applyFix();

    const observer = new MutationObserver(applyFix);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
