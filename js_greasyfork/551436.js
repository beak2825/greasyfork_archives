// ==UserScript==
// @name         Highlight Text at GEVI
// @namespace    https://gayeroticvideoindex.com
// @version      1.0
// @description  Highlights "Cock size:" and "Foreskin:" lines of text at gayeroticvideoindex.com/performer/* pages for quick overview if listed
// @author       99X
// @license      MIT
// @match        https://gayeroticvideoindex.com/performer/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551436/Highlight%20Text%20at%20GEVI.user.js
// @updateURL https://update.greasyfork.org/scripts/551436/Highlight%20Text%20at%20GEVI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const text1 = "Dick Size:";
    const text2 = "Foreskin:";
    const color1 = "green";
    const color2 = "green";

    // Function to highlight text
    function highlightText(searchText, highlightColor) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToReplace = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && node.nodeValue.includes(searchText)) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const text = node.nodeValue;
            const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

            if (regex.test(text)) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, `<mark style="background-color: ${highlightColor};">${searchText}</mark>`);
                node.parentNode.replaceChild(span, node);
            }
        });
    }
    
    // Execute highlighting
    highlightText(text1, color1);
    highlightText(text2, color2);
})();