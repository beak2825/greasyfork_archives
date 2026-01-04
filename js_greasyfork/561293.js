// ==UserScript==
// @name         Google Maps AM/PM to 24-Hour Converter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Converts AM/PM times to 24-hour format on Google Maps.
// @author       NotScott
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maps.google.com
// @match        https://www.google.com/maps*
// @match        https://www.google.*/maps*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561293/Google%20Maps%20AMPM%20to%2024-Hour%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/561293/Google%20Maps%20AMPM%20to%2024-Hour%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertAmPmTo24h(text) {
        const ampmRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi;

        return text.replace(ampmRegex, (match, hour, minute, meridiem) => {
            hour = parseInt(hour, 10);
            minute = minute ? minute.padStart(2, '0') : '00';

            if (meridiem.toLowerCase() === 'pm' && hour !== 12) {
                hour += 12;
            } else if (meridiem.toLowerCase() === 'am' && hour === 12) {
                hour = 0;
            }

            const hh = hour.toString().padStart(2, '0');
            return `${hh}:${minute}`;
        });
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent.match(/(am|pm)/i)) {
                const newText = convertAmPmTo24h(node.textContent);
                if (newText !== node.textContent) {
                    node.textContent = newText;
                }
            }
        } else {
            node.childNodes.forEach(processNode);
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processNode(node);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    processNode(document.body);
})();