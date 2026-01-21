// ==UserScript==
// @name         解除网页复制限制 / Remove Copy Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.0.1
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

    const BLOCKED_EVENTS = [
        'copy',
        'cut',
        'paste',
        'contextmenu',
        'selectstart',
        'dragstart'
    ];

    /**
     * Determines if the target element is an input field or editable area.
     * We must allow default browser behavior on these elements.
     */
    function isEditable(target) {
        if (!target) return false;

        const tagName = target.tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;
        if (target.isContentEditable) return true;
        if (target.ownerDocument && target.ownerDocument.designMode === 'on') return true;

        return false;
    }

    /**
     * Injects CSS to force text selection availability.
     */
    function injectStyles() {
        const css = `
            html, body, div, span, p, h1, h2, h3, h4, h5, h6, b, strong, i, em, li, td, th {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            /* Protect input fields from forced styles */
            input, textarea {
                -webkit-user-select: auto !important;
                user-select: auto !important;
            }
        `;
        GM_addStyle(css);
    }

    /**
     * Captures and stops events before they reach the website's listeners.
     */
    function interceptEvents() {
        const handler = function (e) {
            if (isEditable(e.target)) return;

            // Stop the event from propagating to the website's JavaScript
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        BLOCKED_EVENTS.forEach(event => {
            // useCapture = true ensures we catch the event before the page does
            WIN.addEventListener(event, handler, true);
        });
    }

    /**
     * Removes inline event attributes (e.g., <body oncopy="return false">).
     */
    function removeInlineAttributes() {
        const targets = [WIN.document, WIN.document.body];
        const eventAttrs = BLOCKED_EVENTS.map(e => 'on' + e);

        targets.forEach(target => {
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

        // Clean up inline attributes after the DOM is ready
        if (document.readyState === 'complete') {
            removeInlineAttributes();
        } else {
            WIN.addEventListener('load', removeInlineAttributes);
        }
    }

    main();

})();