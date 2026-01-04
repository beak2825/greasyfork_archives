// ==UserScript==
// @name         Reddit Wide View Desktop
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Make reddit main layout wide for desktop browsing to use all the empty space on sides.
// @author       MattD
// @license      MIT
// @match        https://*.reddit.com/*
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558627/Reddit%20Wide%20View%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/558627/Reddit%20Wide%20View%20Desktop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const makeWide = () => {
        const redditMainViewElement = document.querySelector('#subgrid-container .main-container');
        redditMainViewElement.style.gridTemplateColumns = "unset !important";
    }
    const init = () => {
        console.log(`Reddit Wide View Desktop Init`);
        makeWide()
        new MutationObserver(() => {
            makeWide();
        }).observe(document.querySelector("title"), { childList: true });
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();