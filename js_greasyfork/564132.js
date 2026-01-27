// ==UserScript==
// @name         MLflow Trace Fullscreen Toggle
// @namespace    https://mlflow1.swoep.nl/
// @version      1.3
// @description  Adds a fullscreen toggle button to the trace breakdown panel in MLflow
// @author       You
// @match        *://mlflow*.swoep.nl/*
// @match        https://mlflow*.swoep.nl/*
// @match        http://mlflow*.swoep.nl/*
// @include      *mlflow*.swoep.nl*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mlflow.org
// @grant        GM_addStyle
// @grant        none
// @license      mit
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564132/MLflow%20Trace%20Fullscreen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/564132/MLflow%20Trace%20Fullscreen%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Immediately log to verify script is running
    console.log('[MLflow Fullscreen] Script starting at document-start');

    const STYLES = `
        .mlflow-fullscreen-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10000;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .mlflow-fullscreen-btn:hover {
            background: #40a9ff;
        }

        .mlflow-fullscreen-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        .mlflow-fullscreen-container {
            position: relative;
        }

        .mlflow-fullscreen-active {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 99999 !important;
            background: white !important;
            overflow: auto !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }

        body.mlflow-no-scroll {
            overflow: hidden !important;
        }
    `;

    const FULLSCREEN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
    const EXIT_FULLSCREEN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

    let isFullscreen = false;
    let targetElement = null;
    let button = null;
    let stylesInjected = false;

    function injectStyles() {
        if (stylesInjected) return;

        try {
            if (typeof GM_addStyle !== 'undefined') {
                GM_addStyle(STYLES);
                console.log('[MLflow Fullscreen] Styles injected via GM_addStyle');
            } else {
                const style = document.createElement('style');
                style.textContent = STYLES;
                (document.head || document.documentElement).appendChild(style);
                console.log('[MLflow Fullscreen] Styles injected via style element');
            }
            stylesInjected = true;
        } catch (e) {
            console.error('[MLflow Fullscreen] Failed to inject styles:', e);
        }
    }

    function createFullscreenButton() {
        const btn = document.createElement('button');
        btn.className = 'mlflow-fullscreen-btn';
        btn.innerHTML = `${FULLSCREEN_ICON}<span>Fullscreen</span>`;
        btn.title = 'Toggle fullscreen view';

        btn.addEventListener('click', toggleFullscreen);

        return btn;
    }

    function toggleFullscreen() {
        if (!targetElement) return;

        isFullscreen = !isFullscreen;

        if (isFullscreen) {
            targetElement.classList.add('mlflow-fullscreen-active');
            document.body.classList.add('mlflow-no-scroll');
            button.innerHTML = `${EXIT_FULLSCREEN_ICON}<span>Exit Fullscreen</span>`;
        } else {
            targetElement.classList.remove('mlflow-fullscreen-active');
            document.body.classList.remove('mlflow-no-scroll');
            button.innerHTML = `${FULLSCREEN_ICON}<span>Fullscreen</span>`;
        }
    }

    function handleEscapeKey(e) {
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    }

    function findTargetElement() {
        // Strategy 1: Look for the exact class combination
        let element = document.querySelector('.react-resizable');
        if (element) {
            console.log('[MLflow Fullscreen] Found via .react-resizable');
            return element;
        }

        // Strategy 2: Look for "Trace breakdown" text and find parent resizable
        const traceBreakdownText = Array.from(document.querySelectorAll('span'))
            .find(el => el.textContent.trim() === 'Trace breakdown');
        if (traceBreakdownText) {
            console.log('[MLflow Fullscreen] Found "Trace breakdown" text');
            let parent = traceBreakdownText.closest('.react-resizable');
            if (parent) {
                console.log('[MLflow Fullscreen] Found parent .react-resizable');
                return parent;
            }
        }

        // Strategy 3: Look for the timeline tree filter button's container
        const filterButton = document.querySelector('[data-component-id="shared.model-trace-explorer.timeline-tree-filter-button"]');
        if (filterButton) {
            console.log('[MLflow Fullscreen] Found filter button');
            let parent = filterButton.parentElement;
            while (parent) {
                if (parent.classList.contains('react-resizable')) {
                    return parent;
                }
                parent = parent.parentElement;
            }
        }

        // Strategy 4: Look for the time marker area
        const timeMarkerArea = document.querySelector('[data-testid="time-marker-area"]');
        if (timeMarkerArea) {
            console.log('[MLflow Fullscreen] Found time marker area');
            let parent = timeMarkerArea.parentElement;
            while (parent) {
                if (parent.classList.contains('react-resizable')) {
                    return parent;
                }
                parent = parent.parentElement;
            }
        }

        // Strategy 5: Log all elements with 'resizable' in their class
        const allResizable = document.querySelectorAll('[class*="resizable"]');
        if (allResizable.length > 0) {
            console.log('[MLflow Fullscreen] Found resizable elements:', allResizable.length);
            allResizable.forEach((el, i) => {
                console.log(`[MLflow Fullscreen] Resizable ${i}:`, el.className);
            });
        }

        return null;
    }

    function findAndInjectButton() {
        console.log('[MLflow Fullscreen] Attempting to find target element...');

        const resizableDiv = findTargetElement();

        if (resizableDiv && !resizableDiv.querySelector('.mlflow-fullscreen-btn')) {
            console.log('[MLflow Fullscreen] Target found, injecting button...');

            injectStyles();

            // Make the parent a positioning context
            resizableDiv.classList.add('mlflow-fullscreen-container');

            // Create and inject the button
            button = createFullscreenButton();
            targetElement = resizableDiv;

            // Insert button at the beginning of the resizable div
            resizableDiv.insertBefore(button, resizableDiv.firstChild);

            console.log('[MLflow Fullscreen] Button injected successfully!');
            return true;
        }

        if (!resizableDiv) {
            console.log('[MLflow Fullscreen] Target element not found yet');
        }

        return false;
    }

    function startObserver() {
        console.log('[MLflow Fullscreen] Starting MutationObserver...');

        const observer = new MutationObserver((mutations, obs) => {
            findAndInjectButton();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Also try periodically
        let attempts = 0;
        const maxAttempts = 120;
        const interval = setInterval(() => {
            attempts++;
            if (attempts % 10 === 0) {
                console.log(`[MLflow Fullscreen] Attempt ${attempts}/${maxAttempts}`);
            }
            if (findAndInjectButton()) {
                console.log('[MLflow Fullscreen] Success! Stopping periodic checks.');
                clearInterval(interval);
            } else if (attempts >= maxAttempts) {
                console.log('[MLflow Fullscreen] Max attempts reached, stopping periodic check');
                clearInterval(interval);
            }
        }, 500);
    }

    function init() {
        console.log('[MLflow Fullscreen] Initializing after DOM ready...');
        console.log('[MLflow Fullscreen] Current URL:', window.location.href);

        // Add escape key listener
        document.addEventListener('keydown', handleEscapeKey);

        // Initial attempt
        if (findAndInjectButton()) return;

        // Start observer
        startObserver();
    }

    // Multiple initialization strategies
    console.log('[MLflow Fullscreen] Document readyState:', document.readyState);

    if (document.readyState === 'loading') {
        console.log('[MLflow Fullscreen] Waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[MLflow Fullscreen] DOMContentLoaded fired');
            init();
        });
    } else {
        console.log('[MLflow Fullscreen] Document already loaded, initializing now');
        init();
    }

    // Also wait for window load as backup
    window.addEventListener('load', function() {
        console.log('[MLflow Fullscreen] Window load fired');
        if (!button) {
            setTimeout(() => {
                init();
            }, 2000);
        }
    });

})();
