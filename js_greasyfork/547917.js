// ==UserScript==
// @name         Text Copy Unlock
// @name:zh-CN   文本复制破解 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass copy protection and enable text selection on websites
// @description:zh-CN 破解网站对复制文本的限制
// @author       h2df
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547917/Text%20Copy%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/547917/Text%20Copy%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove copy protection attributes from all elements
    function removeProtectionAttributes() {
        const elements = document.querySelectorAll('*');
        const protectionAttributes = [
            'oncontextmenu', 'onselectstart', 'onmousedown', 'onmouseup',
            'oncopy', 'oncut', 'onpaste', 'onkeydown', 'onkeyup', 'onkeypress'
        ];

        elements.forEach(element => {
            protectionAttributes.forEach(attr => {
                if (element.hasAttribute(attr)) {
                    element.removeAttribute(attr);
                }
            });
        });
    }

    // Function to remove copy protection
    function removeCopyProtection() {
        // Remove common copy protection CSS
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                -webkit-touch-callout: auto !important;
                -webkit-tap-highlight-color: rgba(0,0,0,0.1) !important;
            }

            ::selection {
                background: #007acc !important;
                color: white !important;
            }

            ::-moz-selection {
                background: #007acc !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);

        // Override common copy protection JavaScript functions
        const overrides = {
            // Prevent oncontextmenu blocking
            oncontextmenu: null,

            // Prevent onselectstart blocking
            onselectstart: null,

            // Prevent onmousedown blocking
            onmousedown: null,

            // Prevent onmouseup blocking
            onmouseup: null,

            // Prevent oncopy blocking
            oncopy: null,

            // Prevent oncut blocking
            oncut: null,

            // Prevent onpaste blocking
            onpaste: null,

            // Prevent onkeydown blocking
            onkeydown: null,

            // Prevent onkeyup blocking
            onkeyup: null,

            // Prevent onkeypress blocking
            onkeypress: null
        };

        // Apply overrides to document and body
        Object.keys(overrides).forEach(prop => {
            if (document[prop] !== undefined) {
                document[prop] = overrides[prop];
            }
            if (document.body && document.body[prop] !== undefined) {
                document.body[prop] = overrides[prop];
            }
        });

        // Override addEventListener to prevent copy protection
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // Block copy protection event listeners
            const blockedEvents = [
                'contextmenu', 'selectstart', 'mousedown', 'mouseup',
                'copy', 'cut', 'paste', 'keydown', 'keyup', 'keypress'
            ];

            if (blockedEvents.includes(type)) {
                // Check if the listener contains copy protection code
                const listenerStr = listener.toString().toLowerCase();
                const protectionKeywords = [
                    'preventdefault', 'return false', 'select', 'copy',
                    'contextmenu', 'selection', 'clipboard'
                ];

                // Only block if it's likely copy protection
                if (protectionKeywords.some(keyword => listenerStr.includes(keyword))) {
                    console.log(`Blocked copy protection event listener for ${type}`);
                    return;
                }
            }

            return originalAddEventListener.call(this, type, listener, options);
        };

        // Override preventDefault on copy events
        const originalPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
            const blockedEvents = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu'];
            if (blockedEvents.includes(this.type)) {
                console.log(`Prevented ${this.type} event from being blocked`);
                return;
            }
            return originalPreventDefault.call(this);
        };

        // Remove protection attributes when DOM changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    removeProtectionAttributes();
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial cleanup
        removeProtectionAttributes();
    }

    // Function to enable right-click context menu
    function enableContextMenu() {
        document.addEventListener('contextmenu', function(e) {
            // Allow right-click context menu
            e.stopPropagation();
            return true;
        }, true);
    }

    // Function to enable keyboard shortcuts
    function enableKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Allow Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A
            if (e.ctrlKey && ['c', 'x', 'v', 'a'].includes(e.key.toLowerCase())) {
                e.stopPropagation();
                return true;
            }
        }, true);
    }

    // Function to remove iframe copy protection
    function removeIframeProtection() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    // Apply copy protection removal to iframe content
                    const iframeStyle = iframeDoc.createElement('style');
                    iframeStyle.textContent = `
                        * {
                            -webkit-user-select: auto !important;
                            -moz-user-select: auto !important;
                            -ms-user-select: auto !important;
                            user-select: auto !important;
                        }
                    `;
                    iframeDoc.head.appendChild(iframeStyle);
                }
            } catch (e) {
                // Cross-origin iframe, can't modify
            }
        });
    }

    // Main execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeCopyProtection();
            enableContextMenu();
            enableKeyboardShortcuts();
            removeIframeProtection();
        });
    } else {
        removeCopyProtection();
        enableContextMenu();
        enableKeyboardShortcuts();
        removeIframeProtection();
    }

    // Continuous monitoring for dynamic content
    setInterval(function() {
        removeProtectionAttributes();
        removeIframeProtection();
    }, 2000);

    console.log('Copy Protection Bypass script loaded successfully!');
})();