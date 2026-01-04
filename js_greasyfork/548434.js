// ==UserScript==
// @name         Old Reddit Responsive
// @namespace    http://tampermonkey.net/
// @version      2025-09-05.2
// @description  A bit of style to make old.reddit.com a bit more usable on mobile.
// @author       You
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548434/Old%20Reddit%20Responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/548434/Old%20Reddit%20Responsive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = new CSSStyleSheet();
    // language=CSS
    styles.replaceSync(`

       .buttons .comments {
         font-size: 26px;
       }

       .dropdown, .drop-choices {
         font-size: 26px;
       }

    `)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];

})();