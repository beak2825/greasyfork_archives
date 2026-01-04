// ==UserScript==
// @name         Universal Scroll Top/Bottom Arrows
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds floating up and down arrows to the bottom right of every webpage for quick scrolling. Works in dark/light mode.
// @author       Snow2122
// @license      MIT
// @match        *://*/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557218/Universal%20Scroll%20TopBottom%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/557218/Universal%20Scroll%20TopBottom%20Arrows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        size: '45px',
        color: '#ffffff',
        bgColor: '#222222',
        opacity: '0.8',
        hoverOpacity: '1.0',
        distanceFromRight: '20px',
        distanceFromBottom: '70px', // Moved up to avoid footer ads/bars
        zIndex: '2147483647'
    };

    // --- Create Container ---
    const container = document.createElement('div');
    container.id = 'tm-scroll-btn-container';

    // Apply container styles with !important
    container.style.cssText = `
        position: fixed !important;
        bottom: ${CONFIG.distanceFromBottom} !important;
        right: ${CONFIG.distanceFromRight} !important;
        z-index: ${CONFIG.zIndex} !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        pointer-events: none !important;
        isolation: isolate !important; /* Fixes stacking context issues */
    `;

    // --- Helper Function to Create Buttons ---
    function createButton(svgIcon, action) {
        const btn = document.createElement('div'); // Changed to div to avoid default button styles
        btn.innerHTML = svgIcon;

        // Robust styling with !important
        btn.style.cssText = `
            width: ${CONFIG.size} !important;
            height: ${CONFIG.size} !important;
            background-color: ${CONFIG.bgColor} !important;
            color: ${CONFIG.color} !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important; /* Visible border for dark mode */
            border-radius: 50% !important; /* Circle shape looks cleaner */
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: ${CONFIG.opacity} !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important;
            pointer-events: auto !important; /* Re-enable clicks for buttons */
            user-select: none !important;
            -webkit-user-select: none !important;
        `;

        // Hover Effects (via JS since we are using inline styles)
        btn.onmouseenter = () => {
            btn.style.opacity = CONFIG.hoverOpacity;
            btn.style.transform = 'scale(1.1)';
            btn.style.backgroundColor = '#000000';
            btn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };

        btn.onmouseleave = () => {
            btn.style.opacity = CONFIG.opacity;
            btn.style.transform = 'scale(1)';
            btn.style.backgroundColor = CONFIG.bgColor;
            btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        };

        // Click Action
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            action();
        };

        return btn;
    }

    // --- Smart Scroll Logic ---
    // Finds the element that is actually scrollable (Window vs Wrapper Div)
    function getScrollableTarget() {
        // 1. Check if the main document is scrollable and not locked
        const bodyStyle = window.getComputedStyle(document.body);
        const htmlStyle = window.getComputedStyle(document.documentElement);

        if (bodyStyle.overflowY !== 'hidden' && htmlStyle.overflowY !== 'hidden' &&
           (document.body.scrollHeight > window.innerHeight || document.documentElement.scrollHeight > window.innerHeight)) {
            return window;
        }

        // 2. If main is locked, find the largest scrollable element on screen
        let largestScrollable = null;
        let maxArea = 0;

        // Efficiently query potential scroll containers (divs, main, article)
        const elements = document.querySelectorAll('div, main, article, section');

        for (let el of elements) {
            const style = window.getComputedStyle(el);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll');

            if (isScrollable && el.scrollHeight > el.clientHeight) {
                const rect = el.getBoundingClientRect();
                const area = rect.width * rect.height;
                // We want the largest visible scroll area
                if (area > maxArea && rect.height > 100) {
                    maxArea = area;
                    largestScrollable = el;
                }
            }
        }

        return largestScrollable || window; // Fallback to window
    }

    const scrollUp = () => {
        const target = getScrollableTarget();
        target.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollDown = () => {
        const target = getScrollableTarget();

        // Calculate height based on target type
        let topVal = 0;
        if (target === window) {
            topVal = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
        } else {
            topVal = target.scrollHeight;
        }

        target.scrollTo({
            top: topVal,
            behavior: 'smooth'
        });
    };

    // --- Assemble UI ---
    const svgStyle = 'width: 24px; height: 24px; stroke-width: 3;';

    const svgUp = `<svg style="${svgStyle}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    const svgDown = `<svg style="${svgStyle}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    const btnUp = createButton(svgUp, scrollUp);
    const btnDown = createButton(svgDown, scrollDown);

    container.appendChild(btnUp);
    container.appendChild(btnDown);

    // --- Inject into DOM ---
    const init = () => {
        // Prefer appending to documentElement (html) to escape body stacking contexts
        const target = document.documentElement || document.body;
        if (target) {
            target.appendChild(container);
        } else {
            setTimeout(init, 500);
        }
    };

    // Run initialization
    init();

})();