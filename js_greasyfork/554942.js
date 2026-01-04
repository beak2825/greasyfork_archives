// ==UserScript==
// @name         Flight Sites 24h → 12h Time Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Convert flight times from 24-hour to 12-hour format on major flight booking websites
// @icon         https://cdn-icons-png.flaticon.com/512/10614/10614500.png
// @author       6969RandomGuy6969
// @match        https://travel.airindia.com/*
// @match        https://www.spicejet.com/*
// @match        https://www.goindigo.in/*
// @match        https://www.airindia.com/*
// @match        https://www.akasaair.com/*
// @match        https://www.makemytrip.com/*
// @match        https://www.cleartrip.com/*
// @match        https://flight.yatra.com/*
// @match        https://www.ixigo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554942/Flight%20Sites%2024h%20%E2%86%92%2012h%20Time%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/554942/Flight%20Sites%2024h%20%E2%86%92%2012h%20Time%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert 24-hour time to 12-hour format
    function convertTo12Hour(time24) {
        const timeRegex = /(\d{1,2}):(\d{2})/;
        const match = time24.match(timeRegex);

        if (!match) return time24;

        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    // Function to process text nodes and convert times
    function convertTimesInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!/\b(AM|PM|am|pm)\b/.test(node.textContent)) {
                const timeRegex = /\b([0-1]?[0-9]|2[0-3]):([0-5][0-9])\b/g;
                const newText = node.textContent.replace(timeRegex, (match) => convertTo12Hour(match));

                if (newText !== node.textContent) {
                    node.textContent = newText;
                }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                for (let child of node.childNodes) {
                    convertTimesInNode(child);
                }
            }
        }
    }

    // Convert all times on page
    function convertAllTimes() {
        convertTimesInNode(document.body);
    }

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertAllTimes);
    } else {
        convertAllTimes();
    }

    // Watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    convertTimesInNode(node);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
