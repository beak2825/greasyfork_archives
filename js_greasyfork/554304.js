// ==UserScript==
// @name         X/Twitter Comments Blurrifier
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Automagically blur comments on X (Twitter) and adds a button to toggle between visible/blurred.
// @author       nereids
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://icons.duckduckgo.com/ip3/x.com.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554304/XTwitter%20Comments%20Blurrifier.user.js
// @updateURL https://update.greasyfork.org/scripts/554304/XTwitter%20Comments%20Blurrifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CROSS-BROWSER CSS INJECTION FIX ---
    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
    // --- END FIX ---
    
    const CONVERSATION_SELECTOR = 'div[aria-label="Timeline: Conversation"]';
    const ACTION_BAR_SELECTOR = 'article div[role="group"]';
    const ICON_ID = 'toggleBlurIcon';
    const ACTIVE_CLASS = 'blur-disabled';

    // --- Custom Colors ---
    const X_BLUE = '#1d9bf0'; // For Active/Unblurred state
    const X_PINK = '#f91880';  // For Inactive/Blurred state (your custom color)
    
    // Initial state: Comments are blurred
    let isBlurred = true;

    // --- SVG Definitions (Using your provided sizes and colors) ---
    const blurredSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="22.5px" viewBox="0 -960 960 960" width="22.5px" style="fill:${X_BLUE}">
        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-134 0-244.5-72T61-462q-5-9-7.5-18.5T51-500q0-10 2.5-19.5T61-538q64-118 174.5-190T480-800q134 0 244.5 72T899-538q5 9 7.5 18.5T909-500q0 10-2.5 19.5T899-462q-64 118-174.5 190T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
      </svg>`;

    const unblurredSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="22.5px" viewBox="0 -960 960 960" width="22.5px" style="fill:${X_PINK}">
        <path d="M607-627q29 29 42.5 66t9.5 76q0 15-11 25.5T622-449q-15 0-25.5-10.5T586-485q5-26-3-50t-25-41q-17-17-41-26t-51-4q-15 0-25.5-11T430-643q0-15 10.5-25.5T466-679q38-4 75 9.5t66 42.5Zm-127-93q-19 0-37 1.5t-36 5.5q-17 3-30.5-5T358-742q-5-16 3.5-31t24.5-18q23-5 46.5-7t47.5-2q137 0 250.5 72T904-534q4 8 6 16.5t2 17.5q0 9-1.5 17.5T905-466q-18 40-44.5 75T802-327q-12 11-28 9t-26-16q-10-14-8.5-30.5T753-392q24-23 44-50t35-58q-50-101-144.5-160.5T480-720Zm0 520q-134 0-245-72.5T60-463q-5-8-7.5-17.5T50-500q0-10 2-19t7-18q20-40 46.5-76.5T166-680l-83-84q-11-12-10.5-28.5T84-820q11-11 28-11t28 11l680 680q11 11 11.5 27.5T820-84q-11 11-28 11t-28-11L624-222q-35 11-71 16.5t-73 5.5ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
      </svg>`;

    // 2. Inject Base CSS for Blurring and Hover State
    addStyle(`
        /* Blur and Alignment Styles */
        ${CONVERSATION_SELECTOR} div[data-testid="cellInnerDiv"]:not(:first-child) {
            filter: blur(4px) !important;
            transition: filter 0.2s ease-in-out;
            pointer-events: none !important;
            user-select: none !important;
        }

        body.${ACTIVE_CLASS} ${CONVERSATION_SELECTOR} div[data-testid="cellInnerDiv"]:not(:first-child) {
            filter: none !important;
            pointer-events: auto !important;
            user-select: auto !important;
        }

        /* ICON WRAPPER STYLING */
        #${ICON_ID} {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 46px;
            margin: 0 0 0 15px !important;
            padding: 0 !important;
            transition: background-color 0.2s ease-in-out;
        }

        /* Pseudo-element for circular background */
        div[id="${ICON_ID}"]::before {
             content: '';
             position: absolute;
             width: 38.5px;
             height: 38.5px;
             border-radius: 50%;
             transition: background-color 0.2s ease-in-out;
             z-index: 1;
        }

        /* The SVG is a direct child of the icon container */
        #${ICON_ID} svg {
            z-index: 2;
        }

        /* --- HOVER STATE LOGIC --- */

        /* 1. Default (Blurred/Inactive, Icon Blue) State Hover: Apply BLUE hover */
        body:not(.${ACTIVE_CLASS}) div[id="${ICON_ID}"]:hover {
             color: ${X_BLUE}; /* Changes the icon color to blue */
        }

        body:not(.${ACTIVE_CLASS}) div[id="${ICON_ID}"]:hover::before {
             background-color: rgba(29, 161, 242, 0.1); /* Low-opacity X blue background */
        }

        /* 2. Active (Unblurred, Icon Pink) State Hover: Apply PINK hover */
        body.${ACTIVE_CLASS} div[id="${ICON_ID}"]:hover {
             color: ${X_PINK}; /* Changes the icon color to pink */
        }

        body.${ACTIVE_CLASS} div[id="${ICON_ID}"]:hover::before {
             background-color: rgba(249, 24, 128, 0.1); /* Low-opacity X pink background */
        }


        /* The cloned button wrapper needs fixed dimensions for consistent alignment */
        #${ICON_ID}:not(:first-child) {
             width: 38.5px;
             height: 38.5px;
        }
    `);

    // 3. Logic to inject the icon and attach the event handler (SPA logic)
    function injectToggleIcon() {
        const actionBar = document.querySelector(ACTION_BAR_SELECTOR);
        if (actionBar && !document.getElementById(ICON_ID)) {

            const iconContainer = document.createElement('div');
            iconContainer.id = ICON_ID;

            isBlurred = !document.body.classList.contains(ACTIVE_CLASS);
            iconContainer.innerHTML = isBlurred ? blurredSvg : unblurredSvg;

            const existingButton = actionBar.children[0];
            if (!existingButton) return;

            const targetButton = existingButton.querySelector('svg') ? existingButton : actionBar.children[1];

            const buttonWrapper = targetButton.cloneNode(false);
            buttonWrapper.innerHTML = '';
            buttonWrapper.appendChild(iconContainer);

            actionBar.appendChild(buttonWrapper);

            // Click Handler: Toggle state and update icon
            iconContainer.addEventListener('click', function(e) {
                e.stopPropagation();

                isBlurred = !isBlurred;
                document.body.classList.toggle(ACTIVE_CLASS);

                // Update SVG
                iconContainer.innerHTML = isBlurred ? blurredSvg : unblurredSvg;
            });
        }
    }

    // --- MutationObserver Setup (SPA logic) ---
    const observerCallback = (mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.matches(CONVERSATION_SELECTOR) || node.querySelector(CONVERSATION_SELECTOR))) {
                        setTimeout(injectToggleIcon, 50);
                        return;
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(observerCallback);
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);

    // Initial call
    injectToggleIcon();

})();