// ==UserScript==
// @name         Bypass HBO Max Account Share Block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the modal and enables scrollbar.
// @author       jadenkw
// @license MIT
// @match        https://play.hbomax.com/*
// @match        https://play.max.com/*
// @match        https://www.max.com/*
// @icon         https://images.cdn.prd.api.discomax.com/cd29/5df7884b6626.png
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563423/Bypass%20HBO%20Max%20Account%20Share%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/563423/Bypass%20HBO%20Max%20Account%20Share%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PART 1: CSS HIDING ---
    // Instantly hide the modal overlay using CSS.
    // This is faster than JS and prevents the "flicker" of the modal appearing.
    GM_addStyle(`
        #layer-root-modal {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
    `);

    // --- PART 2: ATTRIBUTE ENFORCEMENT ---
    // This function finds the specific element and forces the attribute to "false".
    const enforceAppState = () => {
        const appContent = document.getElementById('layer-root-app-content');

        if (appContent && appContent.getAttribute('data-is-modal-open') === 'true') {
            console.log('[HBO Max Bypass] Detected modal lock. Releasing...');
            appContent.setAttribute('data-is-modal-open', 'false');
        }
    };

    // --- PART 3: THE WATCHER (MUTATION OBSERVER) ---
    // Because this is a React app, the site will constantly try to re-render
    // or change that attribute back. We watch the DOM for changes and
    // re-run our enforcement function immediately if they try to lock it.
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;

        for (const mutation of mutations) {
            // Check if the specific attribute we care about changed
            if (mutation.type === 'attributes' &&
                mutation.attributeName === 'data-is-modal-open') {
                shouldCheck = true;
                break;
            }
            // Check if nodes were added (page navigation/load)
            if (mutation.type === 'childList') {
                shouldCheck = true;
                break;
            }
        }

        if (shouldCheck) {
            enforceAppState();
        }
    });

    // Start watching the body for changes
    // We observe 'attributes' to catch the specific data-change you mentioned.
    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['data-is-modal-open'] // Performance optimization
    });

    // Run once initially in case the element is already there
    enforceAppState();

})();