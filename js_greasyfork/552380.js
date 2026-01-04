// ==UserScript==
// @name         Toggle YouTube Shorts Shelf and Recommendations
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license MIT
// @description  Add a sleek, modern button to toggle YouTube Shorts shelf on homepage and Shorts in recommended sections, with option to hide button
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552380/Toggle%20YouTube%20Shorts%20Shelf%20and%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/552380/Toggle%20YouTube%20Shorts%20Shelf%20and%20Recommendations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isShortsHidden = true;
    let isButtonVisible = true;

    // Create toggle button with enhanced styling
    function createToggleButton() {
        const button = document.createElement('button');
        button.textContent = 'Show Shorts';
        Object.assign(button.style, {
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: '9999',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff4d4d, #e60000)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontFamily: '"Roboto", "Arial", sans-serif',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            outline: 'none',
            display: isButtonVisible ? 'block' : 'none' // Initial visibility
        });

        // Hover and focus effects
        button.addEventListener('mouseover', () => {
            if (isButtonVisible) {
                button.style.background = 'linear-gradient(135deg, #e60000, #cc0000)';
                button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
                button.style.transform = 'translateY(-2px)';
            }
        });

        button.addEventListener('mouseout', () => {
            if (isButtonVisible) {
                button.style.background = 'linear-gradient(135deg, #ff4d4d, #e60000)';
                button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                button.style.transform = 'translateY(0)';
            }
        });

        button.addEventListener('focus', () => {
            if (isButtonVisible) {
                button.style.outline = '2px solid #ffffff';
                button.style.outlineOffset = '2px';
            }
        });

        button.addEventListener('blur', () => {
            if (isButtonVisible) {
                button.style.outline = 'none';
            }
        });

        // Click event to toggle Shorts
        button.addEventListener('click', () => {
            isShortsHidden = !isShortsHidden;
            toggleShorts();
            button.textContent = isShortsHidden ? 'Show Shorts' : 'Hide Shorts';
        });

        // Right-click to toggle button visibility
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            isButtonVisible = !isButtonVisible;
            button.style.display = isButtonVisible ? 'block' : 'none';
        });

        document.body.appendChild(button);
        return button;
    }

    // Toggle Shorts shelf and recommendations visibility
    function toggleShorts() {
        // Target homepage Shorts shelf
        const shortsShelves = document.querySelectorAll('ytd-reel-shelf-renderer');
        shortsShelves.forEach(shelf => {
            shelf.style.display = isShortsHidden ? 'none' : 'block';
            shelf.style.transition = 'opacity 0.3s ease';
            shelf.style.opacity = isShortsHidden ? '0' : '1';
        });

        // Target individual Shorts in recommended sections
        const shortsItems = document.querySelectorAll('ytm-shorts-lockup-view-model-v2, ytd-rich-item-renderer a[href^="/shorts/"]');
        shortsItems.forEach(item => {
            const parent = item.closest('ytd-rich-item-renderer') || item;
            parent.style.display = isShortsHidden ? 'none' : 'block';
            parent.style.transition = 'opacity 0.3s ease';
            parent.style.opacity = isShortsHidden ? '0' : '1';
        });
    }

    // Initialize script
    function init() {
        const button = createToggleButton();
        toggleShorts();

        // Add a way to show button again (e.g., double-click on top-right corner)
        document.addEventListener('dblclick', (e) => {
            if (!isButtonVisible && e.clientY < 100 && e.clientX > window.innerWidth - 100) {
                isButtonVisible = true;
                button.style.display = 'block';
            }
        });
    }

    // Run after DOM is fully loaded
    window.addEventListener('load', init);

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver(() => {
        toggleShorts();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();