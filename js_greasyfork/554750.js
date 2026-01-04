// ==UserScript==
// @name         YouTube Comments on side bar
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Swap positions and sizes of secondary div and comments section
// @author       Benjamin
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554750/YouTube%20Comments%20on%20side%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/554750/YouTube%20Comments%20on%20side%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function swapElements() {
        // Try multiple selector strategies
        const secondary = document.querySelector('#secondary.ytd-watch-flexy') ||
                         document.querySelector('#secondary');
        const comments = document.querySelector('ytd-comments#comments') ||
                        document.querySelector('ytd-comments');

        console.log('Secondary found:', !!secondary);
        console.log('Comments found:', !!comments);

        if (!secondary || !comments) {
            console.log('Elements not found yet, waiting...');
            return false;
        }

        // Check if already swapped
        if (secondary.dataset.swapped === 'true') {
            console.log('Already swapped');
            return true;
        }

        console.log('Attempting to swap elements...');

        // Capture original computed styles before any manipulation
        const secondaryRect = secondary.getBoundingClientRect();
        const commentsRect = comments.getBoundingClientRect();

        const secondaryWidth = window.getComputedStyle(secondary).width;
        const secondaryMaxWidth = window.getComputedStyle(secondary).maxWidth;
        const secondaryMinWidth = window.getComputedStyle(secondary).minWidth;
        const secondaryFlex = window.getComputedStyle(secondary).flex;

        const commentsWidth = window.getComputedStyle(comments).width;
        const commentsMaxWidth = window.getComputedStyle(comments).maxWidth;
        const commentsMinWidth = window.getComputedStyle(comments).minWidth;
        const commentsFlex = window.getComputedStyle(comments).flex;

        // Get the parent and reference nodes
        const secondaryParent = secondary.parentNode;
        const commentsParent = comments.parentNode;

        // Store reference to next siblings
        const secondaryNext = secondary.nextElementSibling;
        const commentsNext = comments.nextElementSibling;

        // Remove from DOM temporarily
        const secondaryClone = secondaryParent.removeChild(secondary);
        const commentsClone = commentsParent.removeChild(comments);

        // Insert in swapped positions
        if (secondaryNext) {
            secondaryParent.insertBefore(commentsClone, secondaryNext);
        } else {
            secondaryParent.appendChild(commentsClone);
        }

        if (commentsNext) {
            commentsParent.insertBefore(secondaryClone, commentsNext);
        } else {
            commentsParent.appendChild(secondaryClone);
        }

        // Apply swapped dimensions - secondary gets comments' original size, comments get secondary's original size
        secondary.style.width = commentsWidth;
        secondary.style.maxWidth = commentsMaxWidth;
        secondary.style.minWidth = commentsMinWidth;
        if (commentsFlex && commentsFlex !== 'none') {
            secondary.style.flex = commentsFlex;
        }

        comments.style.width = secondaryWidth;
        comments.style.maxWidth = secondaryMaxWidth;
        comments.style.minWidth = secondaryMinWidth;
        if (secondaryFlex && secondaryFlex !== 'none') {
            comments.style.flex = secondaryFlex;
        }

        // Force text wrapping in comments (now in narrow column)
        comments.style.wordWrap = 'break-word';
        comments.style.overflowWrap = 'break-word';
        comments.style.boxSizing = 'border-box';

        // Make comments scrollable in its own container
        comments.style.overflowY = 'auto';
        comments.style.overflowX = 'hidden';
        comments.style.height = '100vh';
        comments.style.position = 'sticky';
        comments.style.top = '0';
        comments.style.maxHeight = '100vh';

        // Mark as swapped
        secondary.dataset.swapped = 'true';
        comments.dataset.swapped = 'true';

        console.log('✅ Swap completed successfully!');
        console.log('Secondary now has width:', secondary.style.width);
        console.log('Comments now has width:', comments.style.width);
        return true;
    }

    function attemptSwap() {
        console.log('=== Attempting swap ===');

        // Try immediate swap
        if (swapElements()) {
            return;
        }

        // Set up observer if immediate swap fails
        let attempts = 0;
        const maxAttempts = 50;

        const observer = new MutationObserver(() => {
            attempts++;
            if (swapElements() || attempts >= maxAttempts) {
                observer.disconnect();
                console.log('Observer disconnected');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initial attempt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptSwap);
    } else {
        attemptSwap();
    }

    // Handle YouTube SPA navigation
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('URL changed, attempting swap...');
            setTimeout(attemptSwap, 1500);
        }
    });

    urlObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();