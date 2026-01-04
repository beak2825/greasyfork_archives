// ==UserScript==
// @name         Gulper.io Profanity Filter Override
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Overrides window.filter_profanity on gulper.io to return input unchanged, using Object.defineProperty to prevent redefinition, with iframe support.
// @author       Crazy Ape
// @match        https://gulper.io/*
// @include      https://gulper.io/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/548424/Gulperio%20Profanity%20Filter%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/548424/Gulperio%20Profanity%20Filter%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the bypass function
    const bypassFilter = function(t) {
        console.log('[Bypass] filter_profanity called with:', t);
        return t; // Return input unchanged
    };

    // Set filter_profanity early and lock it
    try {
        Object.defineProperty(window, 'filter_profanity', {
            value: bypassFilter,
            writable: false,
            configurable: false
        });
        console.log('[Bypass] filter_profanity set and locked on main window');
    } catch (e) {
        console.warn('[Bypass] Error setting/locking filter_profanity on main window:', e);
        window.filter_profanity = bypassFilter; // Fallback to simple assignment
        console.log('[Bypass] Fallback: filter_profanity set on main window');
    }

    // Intercept <script> tags to remove async for all.js
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('all.js')) {
                    console.log('[Bypass] Found all.js script tag via MutationObserver:', node.src);
                    if (node.hasAttribute('async')) {
                        node.removeAttribute('async');
                        console.log('[Bypass] Removed async attribute via MutationObserver');
                    }
                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    // Fallback: Intercept script execution
    document.addEventListener('beforescriptexecute', (e) => {
        if (e.target.src && e.target.src.includes('all.js')) {
            console.log('[Bypass] Found all.js script tag via beforescriptexecute:', e.target.src);
            if (e.target.hasAttribute('async')) {
                e.target.removeAttribute('async');
                console.log('[Bypass] Removed async attribute via beforescriptexecute');
            }
        }
    }, true);

    // Fallback: Poll for script tags
    const scriptPoll = setInterval(() => {
        document.querySelectorAll('script[src*="all.js"]').forEach(script => {
            console.log('[Bypass] Found all.js script tag via polling:', script.src);
            if (script.hasAttribute('async')) {
                script.removeAttribute('async');
                console.log('[Bypass] Removed async attribute via polling');
            }
        });
    }, 100);
    setTimeout(() => clearInterval(scriptPoll), 5000); // Stop polling after 5 seconds

    // Apply override to iframes
    function applyToIframes() {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.filter_profanity = bypassFilter;
                    console.log('[Bypass] filter_profanity set on iframe:', iframe.src || 'no-src');
                }
            } catch (e) {
                console.warn('[Bypass] Error setting iframe filter_profanity:', e);
            }
        });
    }

    // Initial iframe check
    applyToIframes();

    // Poll for iframes
    const iframePoll = setInterval(applyToIframes, 500);
    setTimeout(() => clearInterval(iframePoll), 10000); // Stop polling after 10 seconds

    // Monitor nickname input for debugging
    function monitorInput() {
        const selectors = [
            'input[placeholder*="Nickname"]',
            'input[type="text"]',
            'input[name*="nick"]',
            'input[id*="nick"]',
            'input[class*="nick"]'
        ];
        const input = document.querySelector(selectors.join(', '));
        if (input) {
            console.log('[Bypass] Found nickname input:', input);
            ['input', 'change', 'keyup', 'blur'].forEach(event => {
                input.addEventListener(event, (e) => {
                    console.log(`[Bypass] Nickname ${event} value:`, e.target.value);
                });
            });
            return true;
        }
        console.warn('[Bypass] Nickname input not found with selectors:', selectors);
        return false;
    }

    // Initial input check
    monitorInput();

    // Poll for input
    const inputPoll = setInterval(() => {
        if (monitorInput()) {
            clearInterval(inputPoll); // Stop polling once found
        }
    }, 500);
    setTimeout(() => clearInterval(inputPoll), 10000); // Stop polling after 10 seconds

    // Monitor DOM for filtered text
    const domObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.type === 'characterData') {
                document.querySelectorAll('div, span, p, [class*="leaderboard"], [class*="nick"], [class*="name"]').forEach(elem => {
                    if (elem.textContent.includes('*') || elem.textContent.includes('.')) {
                        console.log('[Bypass] Detected filtered text in DOM:', elem.textContent, 'in element:', elem);
                    }
                });
            }
        });
    });
    domObserver.observe(document, { childList: true, subtree: true, characterData: true });

    // Debug: Log initialization
    console.log('[Bypass] Script initialized at:', new Date().toISOString());
})();