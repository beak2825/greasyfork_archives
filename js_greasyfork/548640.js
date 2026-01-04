// ==UserScript==
// @name         Universal Anti-Restriction (Copy/Paste/Context/LongPress/Zoom)
// @namespace    universal-antirestrict
// @version      1.0
// @description  Bypass website restrictions and restore copy, paste, right-click, text selection, zoom, and long press
// @author       Rishabh
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548640/Universal%20Anti-Restriction%20%28CopyPasteContextLongPressZoom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548640/Universal%20Anti-Restriction%20%28CopyPasteContextLongPressZoom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedEvents = [
        "contextmenu", "selectstart", "copy", "cut", "paste",
        "dragstart", "mousedown", "mouseup",
        "touchstart", "touchend", "touchmove"
    ];

    // 1. Stop sites from adding blocking event listeners
    const originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            // console.debug("Blocked site listener:", type);
            return;
        }
        return originalAdd.call(this, type, listener, options);
    };

    const originalRemove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            return;
        }
        return originalRemove.call(this, type, listener, options);
    };

    // 2. MutationObserver to clean inline handlers + CSS tricks
    const cleanNode = (el) => {
        if (!(el instanceof HTMLElement)) return;

        // Remove inline handlers
        blockedEvents.forEach(ev => {
            if (el[`on${ev}`]) el[`on${ev}`] = null;
        });

        // Fix CSS that blocks selection/long press
        const style = window.getComputedStyle(el);
        if (style.userSelect === "none" || style.webkitUserSelect === "none") {
            el.style.setProperty("user-select", "text", "important");
            el.style.setProperty("-webkit-user-select", "text", "important");
        }
        if (style.touchAction === "none") {
            el.style.setProperty("touch-action", "auto", "important");
        }
    };

    new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) cleanNode(node);
                if (node.querySelectorAll) node.querySelectorAll("*").forEach(cleanNode);
            });
            if (m.type === "attributes") cleanNode(m.target);
        });
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true });

    // 3. Initial sweep
    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("*").forEach(cleanNode);
        if (document.body) {
            blockedEvents.forEach(ev => document.body[`on${ev}`] = null);
            document.oncontextmenu = null;
            document.onselectstart = null;
        }
    });

    // 4. Force body defaults (last line of defense)
    document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-touch-callout: default !important;
                touch-action: auto !important;
            }
        `;
        document.head.appendChild(style);
    });
})();