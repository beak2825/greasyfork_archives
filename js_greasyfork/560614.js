// ==UserScript==
// @name         Smart Context Scroll-to-Top (Advanced)
// @namespace    http://tampermonkey.net/
// @version      2025.12.29.1.2
// @license      MIT License
// @description  Adds a smart back-to-top button not only for the page, but for every scrollable container (modals, divs).
// @description:en  Adds a smart back-to-top button not only for the page, but for every scrollable container (modals, divs).
// @author       rurzowiutki
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/rurzowiutki/scroll-up-icon/refs/heads/main/arrow-up1.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560614/Smart%20Context%20Scroll-to-Top%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560614/Smart%20Context%20Scroll-to-Top%20%28Advanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION =================
    const SCROLL_THRESHOLD = 300;     // After how many pixels should the button appear
    const BUTTON_SIZE = 40;           // Button size in px
    const BUTTON_OFFSET = 20;         // Margin from the edge
    const Z_INDEX = 2137483647;       // Maximum possible Z-Index
    const IGNORE_TEXT_FIELDS = true;  // If true, the button will not appear inside textareas or inputs
    // =================================================

    // WeakMap to store button references without causing memory leaks
    const buttonMap = new WeakMap();

    // Arrow icon (SVG)
    const arrowIcon = `
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
    `;

    // Inject CSS styles
    const styleId = 'smart-scroll-btn-style';
    function injectStyles() {
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .smart-scroll-top-btn {
                    position: fixed;
                    width: ${BUTTON_SIZE}px;
                    height: ${BUTTON_SIZE}px;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: opacity 0.3s, transform 0.3s, background 0.3s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    pointer-events: none;
                    z-index: ${Z_INDEX};
                }
                .smart-scroll-top-btn.visible {
                    opacity: 1;
                    transform: scale(1);
                    pointer-events: auto;
                }
                .smart-scroll-top-btn:hover {
                    background: rgba(0, 0, 0, 0.85);
                    transform: scale(1.1);
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // Helper to create the button
    function getOrCreateButton(scrollTarget) {
        if (buttonMap.has(scrollTarget)) {
            return buttonMap.get(scrollTarget);
        }

        // Ensure styles are injected (safe check)
        injectStyles();

        const btn = document.createElement('div');
        btn.className = 'smart-scroll-top-btn';
        btn.innerHTML = arrowIcon;
        btn.title = "Scroll to Top";

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            scrollTarget.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Append to body (fallback to documentElement if body not ready yet)
        (document.body || document.documentElement).appendChild(btn);

        buttonMap.set(scrollTarget, btn);
        return btn;
    }

    // Helper to position the button
    function updateButtonPosition(btn, target) {
        const isMainPage = target === document || target === document.documentElement || target === document.body;

        if (isMainPage) {
            btn.style.bottom = `${BUTTON_OFFSET}px`;
            btn.style.right = `${BUTTON_OFFSET}px`;
            btn.style.left = 'auto';
            btn.style.top = 'auto';
        } else {
            const rect = target.getBoundingClientRect();

            // If element is hidden, hide button
            if (rect.width === 0 || rect.height === 0) {
                btn.classList.remove('visible');
                return;
            }

            const scrollbarWidth = target.offsetWidth - target.clientWidth;
            const rightPos = (window.innerWidth - rect.right) + BUTTON_OFFSET + scrollbarWidth;
            const bottomPos = (window.innerHeight - rect.bottom) + BUTTON_OFFSET;

            btn.style.right = `${Math.max(BUTTON_OFFSET, rightPos)}px`;
            btn.style.bottom = `${Math.max(BUTTON_OFFSET, bottomPos)}px`;
        }
    }

    // Main Scroll Handler
    window.addEventListener('scroll', (event) => {
        const target = event.target;

        // Basic validation
        if (!target) return;

        // 1. Text Field Check (Fixed: safe check for tagName)
        if (IGNORE_TEXT_FIELDS) {
            // Document object doesn't have tagName, so we default to empty string
            const tagName = (target.tagName || '').toUpperCase();
            const isContentEditable = target.isContentEditable || (target.getAttribute && target.getAttribute('contenteditable') === 'true');

            if (tagName === 'TEXTAREA' || tagName === 'INPUT' || isContentEditable) {
                return;
            }
        }

        // 2. Identify what is being scrolled
        if (target.nodeType !== 1 && target !== document) return;

        let scrollElement = target;
        let scrollTop = target.scrollTop;

        if (target === document) {
            scrollElement = document.documentElement;
            scrollTop = window.scrollY || document.documentElement.scrollTop;
        }

        // 3. Get Button
        const storageKey = (target === document) ? document.documentElement : target;
        const btn = getOrCreateButton(storageKey);

        // 4. Update Visibility
        if (scrollTop > SCROLL_THRESHOLD) {
            updateButtonPosition(btn, scrollElement);
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }

    }, { capture: true, passive: true });

})();