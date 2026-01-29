// ==UserScript==
// @name         Outlook Pinned Email Highlighter
// @namespace    https://greasyfork.org/zh-TW/scripts/564302-outlook-pinned-email-highlighter
// @version      2026-01-28
// @description  Highlights pinned emails in Outlook with automatic light/dark mode support.
// @author       avan
// @match        https://outlook.office.com/mail/*
// @match        https://outlook.live.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564302/Outlook%20Pinned%20Email%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/564302/Outlook%20Pinned%20Email%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 1. Inject Styles
     * We use the CSS :has() selector to target rows [data-focusable-row="true"]
     * that contain an icon with the name "PinFilled".
     * Colors are controlled via the custom attribute [data-custom-theme].
     */
    const css = `
        /* Default: Light Mode Colors */
        html[data-custom-theme="light"] {
            --pinned-bg-color: #fff9c4 !important;       /* Light Yellow */
            --pinned-hover-color: #fff176 !important;     /* Slightly darker yellow */
            --pinned-border-color: #ffd54f !important;
        }

        /* Dark Mode Colors */
        html[data-custom-theme="dark"] {
            --pinned-bg-color: #3d3d3d !important;       /* Dark Grey */
            --pinned-hover-color: #4d4d4d !important;     /* Brighter dark grey */
            --pinned-border-color: #666666 !important;
        }

        /* Apply background to the email list rows */
        div[data-focusable-row="true"]:has(i[data-icon-name="PinFilled"]) {
            background-color: var(--pinned-bg-color) !important;
            border-bottom: 1px solid var(--pinned-border-color) !important;
            transition: background-color 0.2s ease;      /* Smooth color transition */
        }

        /* Ensure hover effect is not overridden by default Outlook styles */
        div[data-focusable-row="true"]:has(i[data-icon-name="PinFilled"]):hover {
            background-color: var(--pinned-hover-color) !important;
        }

        /* Slightly darken the background when the pinned row is selected */
        div[aria-selected="true"][data-focusable-row="true"]:has(i[data-icon-name="PinFilled"]) {
            filter: brightness(0.9);
        }
    `;

    // Inject CSS into the document
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    /**
     * 2. Theme Detection Logic
     * Outlook flips CSS variables based on the theme.
     * In Dark Mode:  --black is actually #FFFFFF (White)
     * In Light Mode: --black is actually #000000 (Black)
     */
    function updateThemeAttribute() {
        const rootStyle = getComputedStyle(document.documentElement);
        const blackValue = rootStyle.getPropertyValue("--black").trim().toUpperCase();

        // Check for 'F' (Hex) or '255' (RGB) to determine if it's currently White (Dark Theme)
        const isDark = blackValue.includes('F') || blackValue.includes('255');
        const theme = isDark ? "dark" : "light";

        // Update the DOM attribute only if the theme has changed to minimize reflows
        if (document.documentElement.getAttribute('data-custom-theme') !== theme) {
            document.documentElement.setAttribute('data-custom-theme', theme);
            console.log("Outlook Theme detected:", theme);
        }
    }

    /**
     * 3. Execution and Monitoring
     */

    // Initial execution
    updateThemeAttribute();

    // Observe DOM changes. Outlook updates the 'html' or 'body' style/class when the theme is toggled.
    const observer = new MutationObserver(() => {
        updateThemeAttribute();
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Optional Fallback: Check every 2 seconds in case MutationObserver misses an update.
    // setInterval(updateThemeAttribute, 2000);

})();