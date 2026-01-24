// ==UserScript==
// @name         解除网页复制限制 / Remove Copy Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  利用事件捕获与 CSS 强制特性，高效解除网页的禁止复制、禁止选中文本、禁止右键菜单限制。/ Efficiently removes copy restrictions such as preventing text selection, copying and right-click menus on webpages using event capture and CSS override techniques.
// @author       zskfree
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563315/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%20Remove%20Copy%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/563315/%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20%20Remove%20Copy%20Restrictions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Ensure access to the real window object
    const WIN = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;

    // Events that are often blocked by sites to prevent copying
    // Removed 'mousedown', 'mouseup', 'keydown' from global block to prevent breaking UI interactions
    const RESTRICT_EVENTS = [
        'copy',
        'cut',
        'paste',
        'contextmenu',
        'selectstart',
        'dragstart'
    ];

    /**
     * Determines if the target element is an input field or editable area.
     * We generally want to leave these alone to prevent breaking rich text editors.
     */
    function isEditable(target) {
        if (!target) return false;

        const tagName = target.tagName;
        // Standard inputs
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;

        // ContentEditable elements
        if (target.isContentEditable) return true;

        // DesignMode documents (iframe editors)
        if (target.ownerDocument && target.ownerDocument.designMode === 'on') return true;

        return false;
    }

    /**
     * Injects CSS to force text selection availability.
     * Optimized to avoid breaking layout (removed pointer-events override).
     */
    function injectStyles() {
        const css = `
            /* Allow user selection on most elements */
            *:not(input):not(textarea):not(button):not(i):not(canvas):not(video) {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }

            /* Ensure context menu is visible (fix for some sites hiding it via css) */
            html, body {
                -webkit-touch-callout: default !important;
            }
        `;
        GM_addStyle(css);
    }

    /**
     * Captures and stops events before they reach the website's listeners.
     */
    function interceptEvents() {
        const handler = function (e) {
            const target = e.target;

            // 1. Handling Editable Elements (Inputs, Textareas, Editors)
            if (isEditable(target)) {
                // If the event is 'contextmenu', we force allow it (stop propagation so site can't hide it)
                if (e.type === 'contextmenu') {
                     e.stopPropagation();
                     return true;
                }
                // For copy/cut/paste/select inside inputs, let the browser/site handle it normally.
                // Blocking these globally breaks complex editors (like Google Docs, Monaco Editor).
                return;
            }

            // 2. Handling Keydown (Ctrl+C, Ctrl+A, etc.)
            // We only intercept if it's strictly a copy/select shortcut on a non-input element
            if (e.type === 'keydown') {
                const isCtrl = e.ctrlKey || e.metaKey;
                // Only block sites from preventing Ctrl+C, Ctrl+A, Ctrl+X
                if (isCtrl && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
                     e.stopPropagation();
                     // We do NOT preventDefault, letting the browser perform the action
                     return;
                }
                // Let other keys pass (scrolling, typing shortcuts)
                return;
            }

            // 3. General Blocking for Content Viewing Mode
            // Stop the event from propagating to the website's JavaScript code
            e.stopPropagation();

            // For 'copy', 'cut', 'paste', we want the Browser's Native Action to happen.
            // So we DO NOT call preventDefault(). We only stop the site from knowing about it.

            // For 'contextmenu', stopping propagation is usually enough to show the system menu.
            if (e.type === 'contextmenu') {
                e.stopPropagation();
                // e.preventDefault(); // Optional: Uncomment if custom menus still appear, but usually stopPropagation is better
                return;
            }

            // For older IE/Compat events
            if (typeof e.stopImmediatePropagation === 'function') {
                e.stopImmediatePropagation();
            }
        };

        // Add listeners for the main restriction events
        RESTRICT_EVENTS.forEach(event => {
            WIN.addEventListener(event, handler, true); // true = capture phase
        });

        // Add keydown listener separately specifically for shortcut protection
        WIN.addEventListener('keydown', handler, true);
    }

    /**
     * Removes inline event attributes (e.g., <body oncopy="return false">).
     */
    function removeInlineAttributes() {
        const events = [...RESTRICT_EVENTS, 'mousedown', 'mouseup', 'keydown'];
        const eventAttrs = events.map(e => 'on' + e);

        // Targeted cleaning to avoid performance issues on huge DOMs
        // We clean Body, Document, and common wrappers
        const targets = [WIN.document, WIN.document.body];

        // Also find explicit Copy protected blocks often used in tech blogs
        const codeBlocks = document.querySelectorAll('pre, code, div.markdown_views, div.hljs');

        [...targets, ...codeBlocks].forEach(target => {
            if (!target) return;
            eventAttrs.forEach(attr => {
                if (target.hasAttribute(attr)) target.removeAttribute(attr);
                if (target[attr]) target[attr] = null;
            });
        });
    }

    /**
     * Main entry point.
     */
    function main() {
        injectStyles();
        interceptEvents();

        const observer = new MutationObserver(() => {
             // Debounce or limited check could be added here if performance drops,
             // but usually removeInlineAttributes is fast enough on limited targets.
             if(document.body) removeInlineAttributes();
        });

        // Start observing once body is ready
        if (document.body) {
            removeInlineAttributes();
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            WIN.addEventListener('DOMContentLoaded', () => {
                removeInlineAttributes();
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    main();

})();