// ==UserScript==
// @name         Remove web limitation 
// @namespace    https://example.local/
// @version      1.0
// @description  Aggressive removal of all UI restrictions
// @author       Balta zar
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557485/Remove%20web%20limitation.user.js
// @updateURL https://update.greasyfork.org/scripts/557485/Remove%20web%20limitation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Completely override addEventListener for blocking events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const blockingEvents = [
            'contextmenu', 'copy', 'cut', 'selectstart', 'dragstart',
            'keydown', 'keypress', 'keyup'
        ];
        
        if (blockingEvents.includes(type)) {
            // Don't register blocking event listeners at all
            return;
        }
        
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Remove all existing event listeners
    function removeAllEventListeners() {
        const events = ['contextmenu', 'copy', 'cut', 'selectstart', 'dragstart'];
        events.forEach(eventType => {
            document.removeEventListener(eventType, () => {});
            window.removeEventListener(eventType, () => {});
        });
    }
    
    // Clear all inline handlers
    function clearAllHandlers() {
        // Clear global handlers
        document.oncontextmenu = null;
        document.onselectstart = null;
        document.oncopy = null;
        document.oncut = null;
        window.oncontextmenu = null;
        window.onselectstart = null;
        
        // Clear inline attributes
        setTimeout(() => {
            const allElements = document.getElementsByTagName('*');
            for (let el of allElements) {
                el.oncontextmenu = null;
                el.onselectstart = null;
                el.oncopy = null;
                el.oncut = null;
                
                const attrs = el.attributes;
                for (let i = attrs.length - 1; i >= 0; i--) {
                    const attr = attrs[i].name;
                    if (attr.startsWith('on')) {
                        el.removeAttribute(attr);
                    }
                }
            }
        }, 100);
    }
    
    // Force enable selection CSS
    const forceStyle = document.createElement('style');
    forceStyle.textContent = `
        *, *::before, *::after {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        }
        input, textarea, [contenteditable] {
            user-select: text !important;
            -webkit-user-select: text !important;
        }
    `;
    document.documentElement.appendChild(forceStyle);
    
    // Execute cleanup
    removeAllEventListeners();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clearAllHandlers);
    } else {
        clearAllHandlers();
    }
    
    // Continuous monitoring
    setInterval(clearAllHandlers, 2000);
    
    console.log('Ultra UI Restrictions Remover: ACTIVATED');
})();