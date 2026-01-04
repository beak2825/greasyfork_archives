// ==UserScript==
// @name         Queslar PvP Zoom
// @namespace    http://tampermonkey.net/zoom
// @version      1.04
// @description  Closes chat on pvp window
// @match        https://v2.queslar.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554128/Queslar%20PvP%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/554128/Queslar%20PvP%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store original styles
    const originalStyles = new Map();
    let isActive = false;

    // The specific path where changes should apply
    const TARGET_PATH = '/game/village/map';

    function isOnTargetPage() {
        return window.location.pathname === TARGET_PATH;
    }

    function applyAutoStyle() {
        if (isActive || !isOnTargetPage()) return;

        // Target the specific div that is a child of .hidden div
        const elements = document.querySelectorAll('.hidden [data-slot="card"].text-card-foreground');
        
        elements.forEach(element => {
            // Store original height value
            const originalHeight = element.style.height;
            originalStyles.set(element, originalHeight);

            // Set to auto
            element.style.height = '0';
        });

        isActive = true;
        console.log('Applied auto height to', elements.length, 'card elements inside .hidden');
    }

    function restoreOriginalStyle() {
        if (!isActive) return;

        originalStyles.forEach((originalHeight, element) => {
            if (element.isConnected) { // Check if element still exists
                element.style.height = originalHeight;
            }
        });

        originalStyles.clear();
        isActive = false;
        console.log('Restored original heights');
    }

    function checkAndApply() {
        if (isOnTargetPage()) {
            applyAutoStyle();
        } else {
            restoreOriginalStyle();
        }
    }

    // Apply styles when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndApply);
    } else {
        checkAndApply();
    }

    // Handle dynamically added elements (only when on target page)
    const observer = new MutationObserver(() => {
        if (isActive && isOnTargetPage()) {
            const newElements = document.querySelectorAll('.hidden [data-slot="card"].text-card-foreground');
            newElements.forEach(element => {
                if (!originalStyles.has(element)) {
                    const originalHeight = element.style.height;
                    originalStyles.set(element, originalHeight);
                    element.style.height = 'auto';
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // Monitor URL changes (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkAndApply();
        }
    }).observe(document, { subtree: true, childList: true });

    // Also use History API listeners for better SPA support
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(this, arguments);
        checkAndApply();
    };

    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        checkAndApply();
    };

    window.addEventListener('popstate', checkAndApply);

})();