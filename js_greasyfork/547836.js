// ==UserScript==
// @name         Marumori Auto-Click Hints on Correct Answer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks the Hints button when the answer is correct in grammar reviews on MaruMori
// @author       Matskye
// @icon https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547836/Marumori%20Auto-Click%20Hints%20on%20Correct%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/547836/Marumori%20Auto-Click%20Hints%20on%20Correct%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ── URL Scope: Only apply on grammar review / lesson pages ──
    function shouldApply() {
        return location.href.startsWith("https://marumori.io/study-lists") &&
               location.href.includes("grammar=true");
    }

    // ── Mutation Observer Callback ──
    function mutationCallback(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let target = mutation.target;
                if (target && target.matches('.input-wrapper')) {
                    // Check if the answer is marked as correct
                    if (target.classList.contains('correct')) {
                        // Answer is correct, trigger the hint button click
                        let hintsButton = document.querySelector('button.hint_bubble_wrapper');
                        if (hintsButton) {
                            hintsButton.click();
                            console.log('[Auto-Click Hints] Hints button clicked.');
                        } else {
                            console.log('[Auto-Click Hints] Hints button not found.');
                        }
                    }
                }
            }
        });
    }

    // ── Global Variables ──
    let observer = null;

    // ── Initialization and Cleanup ──
    function initAutoClick() {
        if (observer) return; // Only initialize once
        observer = new MutationObserver(mutationCallback);
        observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
        console.log('[Auto-Click Hints] Auto-click enabled on', location.href);
    }

    function cleanupAutoClick() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
        console.log('[Auto-Click Hints] Auto-click disabled on', location.href);
    }

    function checkURL() {
        if (shouldApply()) {
            initAutoClick();
        } else {
            cleanupAutoClick();
        }
    }

    // ── URL Change Handling for SPA ──
    const _pushState = history.pushState;
    history.pushState = function() {
        _pushState.apply(history, arguments);
        setTimeout(checkURL, 100);
    };
    const _replaceState = history.replaceState;
    history.replaceState = function() {
        _replaceState.apply(history, arguments);
        setTimeout(checkURL, 100);
    };
    window.addEventListener('popstate', function() {
        setTimeout(checkURL, 100);
    });
    checkURL();
    setInterval(checkURL, 2000);

})();
