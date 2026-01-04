// ==UserScript==
// @name         Smart Quote Colorizer
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @grant        none
// @license      MIT
// @version      2.0
// @author       ChatGPT + Claude + Gemini
// @description  Changes colors of quotes, handles nesting, ignores contractions, and protects HTML attributes.
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558924/Smart%20Quote%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/558924/Smart%20Quote%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const COLORS = {
        single: 'rgba(255, 255, 0, 1)',      // 'text' -> Yellow
        double: 'rgba(144, 238, 144, 1)',    // "text" -> Light Green
        block:  'rgba(173, 216, 230, 1)'     // «text» -> Light Blue
    };

    // Elements to scan (limit to text containers to avoid breaking layout)
    const TARGET_SELECTORS = 'p, li, dd, blockquote, .comment, .post';
    // ---------------------

    /**
     * MASTER REGEX EXPLANATION:
     * 1. (<[^>]+>)                     -> Capture HTML tags (Group 1) so we can IGNORE them.
     * 2. "((?:[^"<]|<[^>]+>)+)"        -> Capture Double Quotes allowing nested tags (Group 2).
     * 3. «((?:[^»<]|<[^>]+>)+)»        -> Capture Block Quotes allowing nested tags (Group 3).
     * 4. (?<=^|\W)'((?:[^'<]|<[^>]+>)+)'(?=\W|$) -> Capture Single Quotes (Group 4).
     * - (?<=^|\W) : Lookbehind. ensures ' is preceded by space/punctuation/start-of-line.
     * - (?=\W|$)  : Lookahead. ensures ' is followed by space/punctuation/end-of-line.
     * - This logic automatically ignores contractions like "don't" or "users'".
     */
    const MASTER_REGEX = /(<[^>]+>)|"((?:[^"<]|<[^>]+>)+)"|«((?:[^»<]|<[^>]+>)+)»|(?<=^|[\s(\[{])'((?:[^'<]|<[^>]+>)+)'(?=$|[\s.,;:!?)\]}])/g;

    function colorize(text) {
        return text.replace(MASTER_REGEX, (match, tag, doubleQ, blockQ, singleQ) => {
            // Case 1: It's an HTML tag (like <a href="...">). Return it unchanged.
            if (tag) return tag;

            // Case 2: Double Quotes
            if (doubleQ) return `<span style="color: ${COLORS.double};">"${doubleQ}"</span>`;

            // Case 3: Block Quotes
            if (blockQ) return `<span style="color: ${COLORS.block};">«${blockQ}»</span>`;

            // Case 4: Single Quotes
            if (singleQ) return `<span style="color: ${COLORS.single};">'${singleQ}'</span>`;

            return match;
        });
    }

    function processElement(el) {
        // Optimization: Skip if element is processed, editable (input), or has no quotes.
        if (el.dataset.quoteColorized || el.isContentEditable) return;

        const html = el.innerHTML;

        // Fast fail: If no quote characters exist, don't run the expensive Regex.
        if (!html.includes('"') && !html.includes('«') && !html.includes("'")) return;

        const newHtml = colorize(html);

        // Only touch the DOM if something actually changed
        if (newHtml !== html) {
            el.innerHTML = newHtml;
            el.dataset.quoteColorized = 'true';
        }
    }

    function scanDocument() {
        const elements = document.querySelectorAll(TARGET_SELECTORS);
        // Use a simple loop, it's faster than forEach for large node lists
        for (let i = 0, len = elements.length; i < len; i++) {
            processElement(elements[i]);
        }
    }

    // --- EXECUTION ---

    // 1. Initial Scan
    scanDocument();

    // 2. Observer for dynamic content (Infinite scroll, comments loading)
    let timeout;
    const observer = new MutationObserver((mutations) => {
        // Debounce: Wait 100ms after changes stop before scanning
        clearTimeout(timeout);
        timeout = setTimeout(scanDocument, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();