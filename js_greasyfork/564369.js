// ==UserScript==
// @name         KILL WATERMARK
// @namespace    http://tampermonkey.net/
// @description  assdfgsd
// @version      0.3
// @match        https://novelfull.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564369/KILL%20WATERMARK.user.js
// @updateURL https://update.greasyfork.org/scripts/564369/KILL%20WATERMARK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Noise Chars
    // These are characters allowed to exist between the letters of the watermark.
    // We include space-like chars here.
    const noiseCharSource = "[\\[\\]{}<>\\- ,./`'\"\\s\\u200B]";

    // 2. Leet Map
    const leetMap = {
        '1': 'l', '0': 'o', '3': 'e', '4': 'a', '5': 's',
        '@': 'a', '$': 's', '(': 'c', '[': 'c', '|': 'i'
    };

    /**
     * Creates a regex that matches: "n" + [noise]* + "o" + [noise]* ...
     */
    function getFlexibleRegex(keyword) {
        // Strip noise from the blocklist keyword itself first
        const cleanKeyword = keyword.replace(new RegExp(noiseCharSource, 'g'), '');

        const pattern = cleanKeyword.split('').map(char => {
            const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return `${escaped}${noiseCharSource}*`;
        }).join('');

        return new RegExp(pattern, 'gi');
    }

    function removeWatermarks(html, blocklist) {
        // Split into unicode code points/clusters
        const clusters = [...html];

        // Build a normalized string that is 1:1 length matched with clusters
        const normalizedStr = clusters.map(c => {
            // Step A: Normalize to NFKD to separate diacritics
            let norm = c.normalize('NFKD');

            // Step B: Check for diacritics/accents
            // If the char is purely a Combining Mark, turn it into a SPACE (Noise).
            // This prevents the string length from shrinking (fixing the A2 bug)
            // while allowing the Regex to "eat" the accent as noise.
            if (/[\p{Mn}]/u.test(norm)) {
                return ' ';
            }

            // Step C: Lowercase
            norm = norm.toLowerCase();

            // Step D: Apply Leet Map or return original
            return leetMap[norm] || norm;
        }).join('');

        const marked = new Array(clusters.length).fill(false);
        let hasCleaned = false;

        blocklist.forEach(watermark => {
            const regex = getFlexibleRegex(watermark);
            let match;

            // Since normalizedStr is 1:1 length with clusters, match.index is safe to use
            while ((match = regex.exec(normalizedStr)) !== null) {
                // console.log(`Found: ${match[0]}`); // Debug
                hasCleaned = true;
                for (let i = match.index; i < match.index + match[0].length; i++) {
                    marked[i] = true;
                }
            }
        });

        if (!hasCleaned) return html; // Return original string if nothing changed (performance)

        // Filter out marked clusters
        return clusters.filter((_, i) => !marked[i]).join('');
    }

    const blocklist = [
        'novelusb.com',
        'freewebnovel.com',
        'novelusb',
        'freewebnovel'
    ];

    const paragraphs = document.querySelectorAll('#chapter-content p');
    paragraphs.forEach((p) => {
        // We check if innerHTML changed to avoid browser repaints if not needed
        const clean = removeWatermarks(p.innerHTML, blocklist);
        if (p.innerHTML !== clean) {
            p.innerHTML = clean;
        }
    });
})();