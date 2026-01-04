// ==UserScript==
// @name         Trainer Web Deck Builder Enhancer
// @namespace    peioris_ns
// @version      2025-04-12
// @description  Improves Trainer Web Deck Builder UX
// @license MIT
// @author       Peioris (http://github.com/coarse)
// @match        *://asia.pokemon-card.com/ph/deck-build*
// @icon         https://asia.pokemon-card.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548423/Trainer%20Web%20Deck%20Builder%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/548423/Trainer%20Web%20Deck%20Builder%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("freeword").addEventListener("keydown", function (e) {
        if (e.which == 13) {
            document.getElementById("searchCardButton").click();
            return false;
        }
    });
})();