// ==UserScript==
// @name         Enable Copy-Paste
// @version      3.0
// @description  Force-enables copy, paste, context menu, and keyboard shortcuts by monkey-patching and piercing Shadow DOM.
// @description:en Force-enables copy, paste, context menu, and keyboard shortcuts by monkey-patching and piercing Shadow DOM.
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @license      LGPL-2.1
// @downloadURL https://update.greasyfork.org/scripts/555631/Enable%20Copy-Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/555631/Enable%20Copy-Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Define CSS rules
    const cssRule = `
        *, *::before, *::after {
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
            user-select: auto !important;
            -webkit-touch-callout: auto !important;
        }
    `;

    // 2. Inject CSS (Light DOM)
    GM_addStyle(cssRule);

    // 3. Pierce Shadow DOM
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(options) {
        const shadowRoot = originalAttachShadow.call(this, options);
        const style = document.createElement('style');
        style.textContent = cssRule;
        shadowRoot.appendChild(style);
        return shadowRoot;
    };

    // 4. Block Event Listeners

    // Events to simply block
    const simpleForbiddenEvents = [
        'copy', 'paste', 'cut',
        'selectstart',
        'contextmenu',
        'dragstart'
    ];

    // Keyboard events for smart handling
    const keyboardEvents = ['keydown', 'keyup', 'keypress'];

    // Shortcut detection
    const isShortcut = (e) => {
        return (e.ctrlKey || e.metaKey) &&
               ['c', 'v', 'x', 'a', 'insert'].includes(e.key.toLowerCase());
    };

    // Override addEventListener
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, options) {

        if (simpleForbiddenEvents.includes(type)) {
            console.log(`[Anti-Restrict] Blocked ${type} event listener.`);
            return;
        }

        if (keyboardEvents.includes(type)) {
            const wrappedListener = function(event) {
                if (isShortcut(event)) {
                    console.log(`[Anti-Restrict] Bypassed shortcut in ${type} event.`);
                    event.stopImmediatePropagation();
                } else {
                    Reflect.apply(listener, this, arguments);
                }
            };

            originalAddEventListener.call(this, type, wrappedListener, options);
            return;
        }

        originalAddEventListener.call(this, type, listener, options);
    };

    // 5. Clean up on* event handlers
    const clearOnEventHandlers = () => {
        const targets = [window, document, document.body];
        const eventHandlers = [
            'oncontextmenu', 'oncopy', 'oncut', 'onpaste',
            'onselectstart', 'ondragstart',
            'onkeydown', 'onkeyup', 'onkeypress'
        ];

        for (const target of targets) {
            if (!target) continue;
            for (const handler of eventHandlers) {
                try {
                    if (target[handler]) {
                        target[handler] = null;
                    }
                    Object.defineProperty(target, handler, {
                        value: null,
                        writable: true,
                        configurable: true
                    });
                } catch (e) {
                    // Ignore errors
                }
            }
        }
    };

    clearOnEventHandlers();
    window.addEventListener('load', clearOnEventHandlers);
    setTimeout(clearOnEventHandlers, 1500);

})();