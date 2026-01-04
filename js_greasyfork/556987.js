// ==UserScript==
// @name         Mailbait.info auto check all checkboxes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically checks all checkboxes on mailbait.info/run
// @author       Tobe-S
// @match        https://mailbait.info/run
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556987/Mailbaitinfo%20auto%20check%20all%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/556987/Mailbaitinfo%20auto%20check%20all%20checkboxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
})();
