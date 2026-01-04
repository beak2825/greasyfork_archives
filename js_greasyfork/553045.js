// ==UserScript==
// @name         WTR Lab Smart Quotes
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Replaces straight quotes with curly/smart quotes for a better reading experience on wtr-lab.com, without breaking site functionality.
// @author       MasuRii
// @match        https://wtr-lab.com/en/novel/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553045/WTR%20Lab%20Smart%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/553045/WTR%20Lab%20Smart%20Quotes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CHAPTER_BODY_SELECTOR = '.chapter-body';
    const PROCESSED_MARKER = 'data-smart-quotes-processed';
    const LOGGING_STORAGE_KEY = 'wtrLabSmartQuotes_loggingEnabled';
    const ENABLED_STORAGE_KEY = 'wtrLabSmartQuotes_enabled';

    // --- STATE MANAGEMENT ---
    let loggingEnabled = GM_getValue(LOGGING_STORAGE_KEY, false);
    let smartQuotesEnabled = GM_getValue(ENABLED_STORAGE_KEY, true);
    let observer = null; // Observer instance for reliable toggling

    /**
     * Debounce utility to limit the rate at which a function gets called.
     * @param {Function} func The function to debounce.
     * @param {number} delay The delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- MENU COMMANDS ---
    function toggleLogging() {
        loggingEnabled = !loggingEnabled;
        GM_setValue(LOGGING_STORAGE_KEY, loggingEnabled);
        alert(`WTR Lab Smart Quotes logging is now ${loggingEnabled ? 'ENABLED' : 'DISABLED'}.`);
    }

    function toggleSmartQuotes() {
        smartQuotesEnabled = !smartQuotesEnabled;
        GM_setValue(ENABLED_STORAGE_KEY, smartQuotesEnabled);

        const chapterBodies = document.querySelectorAll(CHAPTER_BODY_SELECTOR);

        if (smartQuotesEnabled) {
            // If enabling, re-process all chapters and start observing
            chapterBodies.forEach(el => {
                el.removeAttribute(PROCESSED_MARKER); // Allow re-processing
                applySmartQuotes(el);
            });
            initializeObserver();
        } else {
            // If disabling, stop observing first, then revert all chapters
            if (observer) {
                observer.disconnect();
            }
            chapterBodies.forEach(revertSmartQuotes);
        }

        alert(`WTR Lab Smart Quotes is now ${smartQuotesEnabled ? 'ENABLED' : 'DISABLED'}.`);
    }

    GM_registerMenuCommand('Toggle Smart Quotes', toggleSmartQuotes);
    GM_registerMenuCommand('Toggle Logging', toggleLogging);

    /**
     * Reverts curly quotes back to straight quotes.
     * @param {HTMLElement} targetElement The container element to process.
     */
    function revertSmartQuotes(targetElement) {
        if (!targetElement) return;

        const paragraphs = targetElement.querySelectorAll('p');

        const revertNode = (node) => {
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
            let textNode;
            while ((textNode = walker.nextNode())) {
                let text = textNode.nodeValue;
                if (/[“”‘’—]/.test(text)) {
                    text = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/—/g, '--');
                    textNode.nodeValue = text;
                }
            }
        };

        if (paragraphs.length === 0) {
            revertNode(targetElement);
        } else {
            paragraphs.forEach(revertNode);
        }

        targetElement.removeAttribute(PROCESSED_MARKER); // Remove marker
        if (loggingEnabled) {
            console.log('WTR Lab Smart Quotes reverted on chapter.', targetElement);
        }
    }


    /**
     * Replaces straight quotes with curly quotes using safe DOM traversal.
     * Processes each paragraph independently.
     * @param {HTMLElement} targetElement The container element to process (e.g., .chapter-body).
     */
    function applySmartQuotes(targetElement) {
        if (!smartQuotesEnabled || !targetElement || targetElement.hasAttribute(PROCESSED_MARKER)) {
            return;
        }

        const paragraphs = targetElement.querySelectorAll('p');

        if (paragraphs.length === 0) {
            if (loggingEnabled) console.warn('WTR Lab Smart Quotes: No <p> tags found in chapter body. Processing as a single block.');
            processNode(targetElement);
        } else {
            paragraphs.forEach(processNode);
        }

        targetElement.setAttribute(PROCESSED_MARKER, 'true');

        if (loggingEnabled) {
            console.log('WTR Lab Smart Quotes script applied to chapter.', targetElement);
        }
    }

    /**
     * Converts straight quotes to curly quotes and double hyphens to em-dashes.
     * Based on the principles of SmartyPants.
     * @param {string} text The input string.
     * @returns {string} The processed string with smart typography.
     */
    function smarten(text) {
        if (!text) return '';

        // The order of these replacements is important.
        return text
            // Special case for apostrophes in years like '70s
            .replace(/'(\d+s)/g, '\u2019$1')
            // Opening single quotes: at the start of a line, or after a space, dash, or opening bracket/quote.
            .replace(/(^|[-\u2014\s(\[【"“])'/g, '$1\u2018')
            // All remaining single quotes are closing quotes or apostrophes.
            .replace(/'/g, '\u2019')
            // Opening double quotes: at the start of a line, or after a space, dash, or opening bracket/quote.
            .replace(/(^|[-\u2014\s(\[【'‘])"/g, '$1\u201c')
            // All remaining double quotes are closing quotes.
            .replace(/"/g, '\u201d')
            // Em-dashes
            .replace(/--/g, '\u2014');
    }

    /**
     * The core logic that processes a single DOM node (like a paragraph)
     * and replaces its quotes, while preserving inner HTML tags.
     * @param {HTMLElement} p The paragraph element to process.
     */
    function processNode(p) {
        const textNodes = [];
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }

        if (textNodes.length === 0) {
            return;
        }

        const fullText = textNodes.map(n => n.nodeValue).join('');
        const smartenedText = smarten(fullText);

        // Only proceed if text has changed to avoid unnecessary DOM manipulation
        if (fullText === smartenedText) {
            return;
        }

        let currentIndex = 0;
        for (const textNode of textNodes) {
            const originalLength = textNode.nodeValue.length;
            if (originalLength > 0) {
                textNode.nodeValue = smartenedText.substring(currentIndex, currentIndex + originalLength);
                currentIndex += originalLength;
            }
        }
    }

    /**
     * Finds and processes all chapter bodies currently in the DOM.
     */
    function processAllVisibleChapters() {
        if (!smartQuotesEnabled) return;
        const chapterBodies = document.querySelectorAll(CHAPTER_BODY_SELECTOR);
        chapterBodies.forEach(applySmartQuotes);
    }

    /**
     * Initializes and starts the MutationObserver to watch for new chapters and text changes.
     */
    function initializeObserver() {
        if (observer) observer.disconnect(); // Ensure no multiple observers are running

        const observerOptions = {
            childList: true,
            subtree: true,
            characterData: true
        };

        const debouncedProcessAll = debounce(() => {
            if (loggingEnabled) console.log('WTR Smart Quotes: Reprocessing visible chapters due to DOM changes.');

            // Disconnect the observer to prevent the script from reacting to its own changes.
            observer.disconnect();

            // Apply the smart quotes.
            processAllVisibleChapters();

            // Reconnect the observer to watch for future external changes.
            observer.observe(document.body, observerOptions);
        }, 300);

        observer = new MutationObserver((mutationsList) => {
            if (!smartQuotesEnabled) return;

            let needsReprocessing = false;
            for (const mutation of mutationsList) {
                // Ignore mutations caused by script UIs to prevent loops
                if (mutation.target.closest && (mutation.target.closest('.wtr-replacer-ui') || mutation.target.closest('.wtr-add-term-float-btn'))) {
                    continue;
                }

                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.matches(CHAPTER_BODY_SELECTOR) || node.querySelector(CHAPTER_BODY_SELECTOR))) {
                            needsReprocessing = true;
                            break;
                        }
                    }
                } else if (mutation.type === 'characterData') {
                    const chapterBody = mutation.target.parentElement?.closest(CHAPTER_BODY_SELECTOR);
                    if (chapterBody && chapterBody.hasAttribute(PROCESSED_MARKER)) {
                        if (loggingEnabled) console.log('WTR Smart Quotes: Detected external text change. Un-marking chapter for reprocessing.', chapterBody);
                        chapterBody.removeAttribute(PROCESSED_MARKER);
                        needsReprocessing = true;
                    }
                }
                if (needsReprocessing) break;
            }

            if (needsReprocessing) {
                debouncedProcessAll();
            }
        });

        observer.observe(document.body, observerOptions);
    }

    // --- EXECUTION LOGIC ---
    if (smartQuotesEnabled) {
        initializeObserver();
        setTimeout(processAllVisibleChapters, 500);
    }

})();