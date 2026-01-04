// ==UserScript==
// @name         Filmot QOL
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @license      MIT
// @homepage     https://gist.github.com/cjmaxik/dd9268ec65a727c800b49dc98c7fc23c
// @description  Quality-of-life features for Filmot
// @author       CJMAXiK
// @match        https://filmot.com/search/*
// @icon         https://icons.duckduckgo.com/ip2/filmot.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548562/Filmot%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/548562/Filmot%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict'; // Enforce strict mode to catch common coding mistakes

    // Select all elements with the class 'scroll-box'
    const scrollBoxes = Array.from(document.querySelectorAll('.scroll-box'))
    for (let box of scrollBoxes) {
        // Reset max height for each scroll box
        box.style.maxHeight = '';
        box.style.marginTop = '10px';
        box.style.marginBottom = '50px';

        // Get all <hr> elements within the scroll box
        const sections = Array.from(box.getElementsByTagName('hr'));
        if (sections.length > 0) {
            // Remove the last <hr> element if it exists
            sections.pop().remove();
        }

        // Style remaining <hr> elements
        for (let hr of sections) {
            hr.style.borderTop = '5px solid #375a7f';
        }

        // Get all <a> (anchor) elements within the scroll box
        const links = Array.from(box.getElementsByTagName('a'));
        for (let link of links) {
            // Skip links that do not contain 'javascript:' in the href attribute
            if (!link.href.includes('javascript:')) continue;

            // Extract video ID and timestamp from JavaScript function call in href
            const match = link.href.match(/jtt\('([^']+)',\d+,(\d+)/);
            if (!match || match.length < 3) continue;
            const [, videoId, timestamp] = match;

            // Create a new external YouTube link with extracted video ID and timestamp
            const linkTemplate = ` <a href="https://youtu.be/${videoId}?t=${timestamp}" target="_blank"><i class="fa fa-external-link-square"></i></a> `;

            // Insert the new YouTube link after the original link
            link.insertAdjacentHTML('afterend', linkTemplate);
        }
    }
})();

