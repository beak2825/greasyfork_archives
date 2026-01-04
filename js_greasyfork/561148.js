// ==UserScript==
// @name         MaruMori Onyomi Katakana
// @namespace    https://marumori.io/
// @version      1.1
// @description  Display Onyomi readings in Katakana on Reviews, Lessons, and Dictionary pages
// @match        https://marumori.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/561148/MaruMori%20Onyomi%20Katakana.user.js
// @updateURL https://update.greasyfork.org/scripts/561148/MaruMori%20Onyomi%20Katakana.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /*****************************************************************
     * Utilities
     *****************************************************************/

    // Convert Hiragana to Katakana
    function hiraToKata(str) {
        return str.replace(/[\u3041-\u3096]/g, ch =>
            String.fromCharCode(ch.charCodeAt(0) + 0x60)
        );
    }

    // Check whether current URL is a target page
  function isTargetPage() {
      return (
          location.pathname.includes('/study-lists/review') ||
          location.pathname.includes('/study-lists/lesson') ||
          location.pathname.startsWith('/dictionary/')
      );
  }

    /*****************************************************************
     * Conversion logic per page type
     *****************************************************************/

    function convertReviewsAndLessons(root = document) {
        // Onyomi blocks share the same structure in reviews & lessons
        const wrappers = root.querySelectorAll(
            'div.item_wrapper h4'
        );

        wrappers.forEach(h4 => {
            if (h4.textContent.trim() !== 'Onyomi') return;

            const wrapper = h4.closest('.item_wrapper');
            if (!wrapper) return;

            wrapper.querySelectorAll('span.reading').forEach(span => {
                span.textContent = hiraToKata(span.textContent);
            });
        });
    }

    function convertDictionary(root = document) {
        const infoBlocks = root.querySelectorAll('.info');

        infoBlocks.forEach(info => {
            const label = info.querySelector('b');
            if (!label || label.textContent.trim() !== 'Onyomi') return;

            const p = info.querySelector('p');
            if (!p) return;

            p.textContent = hiraToKata(p.textContent);
        });
    }

    function runConversion(root = document) {
        if (location.pathname.startsWith('/dictionary/')) {
            convertDictionary(root);
        } else {
            convertReviewsAndLessons(root);
        }
    }

    /*****************************************************************
     * SPA Observer handling
     *****************************************************************/

    let observer = null;
    let lastUrl = location.href;

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) {
                        runConversion(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial run
        runConversion();
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    // Watch for SPA navigation
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;

            if (isTargetPage()) {
                startObserver();
            } else {
                stopObserver();
            }
        }
    }, 300);

    // Initial check
    if (isTargetPage()) {
        startObserver();
    }
})();