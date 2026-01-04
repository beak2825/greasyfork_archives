// ==UserScript==
// @name         GenAI descriptions replacer for DDG
// @namespace    https://axley.net/
// @version      2025-08-19
// @description  Generative AI (GenAI) has no concept of "truth". Sadly, the GenAI hype machine is also truth-challenged. This script is a snarky attempt to ridicule GenAI hype by replacing them with translations.
// @author       You
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559864/GenAI%20descriptions%20replacer%20for%20DDG.user.js
// @updateURL https://update.greasyfork.org/scripts/559864/GenAI%20descriptions%20replacer%20for%20DDG.meta.js
// ==/UserScript==

let has_truthified = false;
const observer = new MutationObserver((one, two) => truthify());
(function() {
    'use strict';

    const container = document.querySelector("body");
    observer.observe(container, {
        childList: true,
        subtree: true,
    });
})();

function truthify() {

    if (!has_truthified) {
        let button = document.querySelector('[data-testid=duckassist-action-button]');

        if (button) {
            button.innerText = "Make some shit up";
            observer.disconnect();
            has_truthified = true;
            console.log('Truthification complete');
        }
    }
}