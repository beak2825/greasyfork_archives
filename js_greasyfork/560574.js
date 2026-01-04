// ==UserScript==
// @name         Epsteinifier 3000
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press Ctrl+E to get rid of those files! By Цветочек Кактус.
// @author       You
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560574/Epsteinifier%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/560574/Epsteinifier%203000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const epsteinify_percent = 10;

    function epsteinifyNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.nodeValue.split(" ");
            const updated = words.map(word =>
                Math.random() <= epsteinify_percent / 100 ? "█".repeat(word.length) : word
            );
            node.nodeValue = updated.join(" ");
        } else {
            node.childNodes.forEach(epsteinifyNode);
        }
    }

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            epsteinifyNode(document.body);
        }
    });
})();
//I might know, why the alines do not visit earth.