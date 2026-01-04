// ==UserScript==
// @name         X Bookmarks Remover
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Manually control bookmark removal from X.com with floating control button
// @author       YourName
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558700/X%20Bookmarks%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/558700/X%20Bookmarks%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let removalInterval = null;
    let isRemovalActive = false;

    // Function to remove bookmarks
    function removeBookmarks() {
        const removeButton = document.querySelector('button[data-testid="removeBookmark"]');
        
        if (removeButton) {
            console.log('Found bookmark to remove, clicking...');
            removeButton.click();
        } else {
            console.log('No bookmark found, scrolling down...');
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    // Function to start the bookmark removal process
    function startBookmarkRemoval() {
        // Check if we're on the bookmarks page
        const isBookmarksPage = window.location.href.includes('/i/bookmarks') || 
                                window.location.href.includes('/i/bookmarks?');

        if (!isBookmarksPage) {
            console.log('Not on bookmarks page, navigating...');
            window.location.href = 'https://x.com/i/bookmarks';
            return;
        }

        console.log('On bookmarks page, starting removal process...');
        isRemovalActive = true;
        updateButtonStatus('running');
        
        // Start the removal process with 1 second intervals
        removalInterval = setInterval(removeBookmarks, 1000);
    }

    // Function to stop the bookmark removal process
    function stopBookmarkRemoval() {
        if (removalInterval) {
            clearInterval(removalInterval);
            removalInterval = null;
        }
        isRemovalActive = false;
        updateButtonStatus('stopped');
        console.log('Bookmark removal stopped by user');
    }

    // Create control button
    function createControlButton() {
        // Remove existing button if it exists
        const existingButton = document.getElementById('bookmark-remover-control');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('div');
        button.id = 'bookmark-remover-control';
        button.innerHTML = `
            <button id="bookmark-remover-btn">
                <span id="bookmark-remover-text">Start Removing Bookmarks</span>
            </button>
        `;
        
        // Add styles
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const btn = button.querySelector('#bookmark-remover-btn');
        btn.style.cssText = `
            background: #1d9bf0;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(29, 155, 240, 0.3);
            transition: all 0.2s ease;
            min-width: 180px;
        `;

        // Hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.background = isRemovalActive ? '#dc2626' : '#1a91da';
            btn.style.transform = 'translateY(-1px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = isRemovalActive ? '#dc2626' : '#1d9bf0';
            btn.style.transform = 'translateY(0)';
        });

        // Click handler
        btn.addEventListener('click', () => {
            if (isRemovalActive) {
                stopBookmarkRemoval();
            } else {
                startBookmarkRemoval();
            }
        });

        document.body.appendChild(button);
    }

    // Update button status
    function updateButtonStatus(status) {
        const btn = document.getElementById('bookmark-remover-btn');
        const text = document.getElementById('bookmark-remover-text');
        
        if (status === 'running') {
            btn.style.background = '#dc2626';
            text.textContent = 'Stop Removing';
        } else {
            btn.style.background = '#1d9bf0';
            text.textContent = 'Start Removing Bookmarks';
        }
    }

    // Initialize the control button
    function initializeControl() {
        createControlButton();
    }

    // Wait for the page to load and then create the control button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeControl);
    } else {
        initializeControl();
    }

    // Also listen for page navigation changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Recreate button on navigation to ensure it stays visible
            if (url.includes('x.com') || url.includes('twitter.com')) {
                setTimeout(createControlButton, 1000);
            }
        }
    }).observe(document, { subtree: true, childList: true });

    // Clean up interval when navigating away
    window.addEventListener('beforeunload', () => {
        if (removalInterval) {
            clearInterval(removalInterval);
        }
    });

})();