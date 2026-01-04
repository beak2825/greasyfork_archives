// ==UserScript==
// @name         RAE → SpanishDict Auto Redirect
// @author       Minjae Kim
// @version      1.04
// @description  Redirects RAE dictionary pages to SpanishDict translation pages
// @match        https://dle.rae.es/*
// @run-at       document-start
// @license MIT
// @namespace clearjade
// @downloadURL https://update.greasyfork.org/scripts/554386/RAE%20%E2%86%92%20SpanishDict%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/554386/RAE%20%E2%86%92%20SpanishDict%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const word = window.location.pathname.replace('/', '');
    if (word) {
        const newUrl = `https://www.spanishdict.com/translate/${word}`;
        window.location.replace(newUrl);
    }
})();
