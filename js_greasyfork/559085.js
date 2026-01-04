// ==UserScript==
// @name         Hide Voreplay Welcome Text
// @namespace    VoreWolf
// @license      MIT
// @version      1.0.1
// @description  Hide welcome text on voreplay using CSS
// @match        https://www.voreplay.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559085/Hide%20Voreplay%20Welcome%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/559085/Hide%20Voreplay%20Welcome%20Text.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hideBlock = () => {
        const block = document.getElementById('block7');
        if (block) {
            block.style.display = 'none';
        }
    };

    hideBlock();

    const observer = new MutationObserver(hideBlock);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})()