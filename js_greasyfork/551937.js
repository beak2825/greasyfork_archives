// ==UserScript==
// @name         Page Progess counter for Weebcentral
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows "current page/total pages" on the bottom-left of the window for reading websites.
// @author       Nirmal Bhasarkar
// @license      MIT
// @match        https://weebcentral.com/chapters/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551937/Page%20Progess%20counter%20for%20Weebcentral.user.js
// @updateURL https://update.greasyfork.org/scripts/551937/Page%20Progess%20counter%20for%20Weebcentral.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // --- POSITIONING ---
        counterPosition: {
            bottom: '5px', // Modify this two values to move the box location
            left: '5px'
        },
    };
    // --- End of Configuration ---

    let pageCounterElement;
    let cachedTotalPages = null;
    let observer;

    function debounce(func, delay) {
        let debounceTimer;
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function createCounterElement() {
        if (document.getElementById('page-counter-userscript')) return;

        pageCounterElement = document.createElement('div');
        pageCounterElement.id = 'page-counter-userscript';

        // Custom styling for the counter box
        Object.assign(pageCounterElement.style, {
            position: 'fixed',
            bottom: config.counterPosition.bottom,
            left: config.counterPosition.left,
            padding: '5px 7px',
            borderRadius: '0px',
            color: 'rgba(255, 255, 255, 0.5)',          //Adjust 0.X to increase or decrease text brightness
            border: '0.3px solid rgba(1, 1, 12, 1.0)',  //Set 1.0 to 0.0 to hide the border
            backgroundColor: 'rgba(73, 83, 89, 1.0)',   //Set 1.0 to 0.0 to hide the background
            zIndex: '99999',
            fontSize: '17px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '525',
            pointerEvents: 'none',
        });
        document.body.appendChild(pageCounterElement);
    }

    /**
     * Adjusts the counter's scale to counteract browser zoom, keeping its size constant.
     */
    function adjustForZoom() {
        if (!pageCounterElement) return;
        const zoomLevel = window.devicePixelRatio || 1;
        const scale = 1 / zoomLevel;
        pageCounterElement.style.transform = `scale(${scale})`;
        pageCounterElement.style.transformOrigin = 'bottom left';
    }


    /**
     * Finds the total number of pages ONCE by reading the hidden input field.
     */
    function findAndCacheTotalPages() {
        if (cachedTotalPages !== null) return;
        try {
            const maxPageInput = document.getElementById('max_page');
            if (maxPageInput && maxPageInput.value) {
                cachedTotalPages = parseInt(maxPageInput.value, 10);
            }
        } catch (e) {
            console.error("[Page Counter] Error reading total pages.", e);
        }
    }

    /**
     * Finds the current page number by reading the visible page button.
     */
    function getCurrentPage() {
        try {
            const pageButton = document.querySelector("button[x-text=\"'Page ' + page\"]");
            if (pageButton && pageButton.textContent) {
                const match = pageButton.textContent.match(/(\d+)/);
                if (match && match[1]) {
                    return parseInt(match[1], 10);
                }
            }
        } catch(e) {
            console.error("[Page Counter] Error reading current page.", e);
        }
        return null;
    }

    /**
     * Updates the counter display.
     */
    function updatePageCount() {
        if (!pageCounterElement) return;

        const current = getCurrentPage();
        const total = cachedTotalPages;

        if (current !== null || total !== null) {
            const currentStr = current !== null ? current : '?';
            const totalStr = total !== null ? total : '?';
            pageCounterElement.textContent = `${currentStr}/${totalStr}`;
            pageCounterElement.style.opacity = '1';
        } else {
             pageCounterElement.style.opacity = '0';
        }
    }

    const debouncedUpdate = debounce(updatePageCount, 50);

    function init() {
        createCounterElement();
        adjustForZoom(); // Set the initial scale
        findAndCacheTotalPages();

        const observerTarget = document.querySelector("button[x-text=\"'Page ' + page\"]");
        if (!observerTarget) {
            console.error("[Page Counter] Could not find target page button for observation.");
            updatePageCount(); // Try to update once
            return;
        }

        observer = new MutationObserver(() => {
            debouncedUpdate();
        });

        observer.observe(observerTarget, {
            childList: true,
            subtree: true
        });

        // Listen for resize/zoom events to keep the counter size consistent
        window.addEventListener('resize', debounce(adjustForZoom, 100));

        updatePageCount();
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

