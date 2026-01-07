// ==UserScript==
// @name         Zed City - Sensible Kitchen
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Changes "Cooking Water" to "Boiling Water" and "Cooking Sandwich" to "Making Sandwich"
// @author       Your Name
// @match        *://www.zed.city/stronghold*
// @match        *://zed.city/stronghold*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561667/Zed%20City%20-%20Sensible%20Kitchen.user.js
// @updateURL https://update.greasyfork.org/scripts/561667/Zed%20City%20-%20Sensible%20Kitchen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            let text = node.nodeValue;
            let changed = false;

            // Condition 1: Water
            if (text.includes('Cooking Water')) {
                text = text.replace(/Cooking Water/g, 'Boiling Water');
                changed = true;
            }

            // Condition 2: Sandwich
            if (text.includes('Cooking Sandwich')) {
                text = text.replace(/Cooking Sandwich/g, 'Making Sandwich');
                changed = true;
            }

            if (changed) {
                node.nodeValue = text;
            }
        }
    }

    // Run after load
    setTimeout(() => {
        replaceText();

        // Watch for dynamic updates when crafting starts/ends
        const observer = new MutationObserver(replaceText);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }, 1000);
})();