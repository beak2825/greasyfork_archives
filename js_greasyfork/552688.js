// ==UserScript==
// @name         Use Red Hat Text font
// @namespace    https://github.com/nate-kean/
// @version      20251106
// @description  Loads font "Red Hat Text" that many pages ask for but are missing.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552688/Use%20Red%20Hat%20Text%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/552688/Use%20Red%20Hat%20Text%20font.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <link href="https://fonts.googleapis.com/css?family=Red+Hat+Text:400,600,700" rel="stylesheet">
    `);
})();
