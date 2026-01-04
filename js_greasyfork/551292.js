// ==UserScript==
// @name         White Logo
// @namespace    https://github.com/nate-kean/
// @version      2025-09-24
// @description  Change the James River logo from black to white. This is the color it usually is when we put it on blue.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/551292/White%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/551292/White%20Logo.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-css-that-changes-the-logo-white">
            a.header-logo-a-style > img {
                filter: invert(1);
            }
        </style>
    `);
})();
