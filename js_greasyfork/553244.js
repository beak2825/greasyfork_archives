// ==UserScript==
// @name         ShatGPT
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Replaces "ChatGPT" with "ShatGPT" on any webpage
// @author       GhostIsBeHere
// @match        *://*/*
// @grant        none
// @license      CC-BY-SA 4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553244/ShatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/553244/ShatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/ChatGPT/g, 'ShatGPT');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let child of node.childNodes) {
                replaceText(child);
            }
        }
    }

    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let addedNode of mutation.addedNodes) {
                    replaceText(addedNode);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    replaceText(document.body);
    observeChanges();
})();
