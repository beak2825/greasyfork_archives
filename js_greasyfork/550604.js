// ==UserScript==
// @name        Forced Visibility
// @description Prevent websites from detecting tab focus without breaking functionality
// @version     2026.01.29
// @author      Claude Sonnet 4.5
// @grant       none
// @inject-into auto
// @run-at      document-start
// @match       *://*/*
// @namespace https://greasyfork.org/users/1519047
// @downloadURL https://update.greasyfork.org/scripts/550604/Forced%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/550604/Forced%20Visibility.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Check if we should allow natural visibility behavior
    const shouldAllowVisibilityChange = () => {
        // Allow if media is actively playing
        const media = document.querySelectorAll('video, audio');
        for (let el of media) {
            if (!el.paused && !el.ended && el.currentTime > 0) {
                return true;
            }
        }
        
        // Allow if user is actively typing in an input
        const activeEl = document.activeElement;
        if (activeEl && (
            activeEl.tagName === 'INPUT' || 
            activeEl.tagName === 'TEXTAREA' || 
            activeEl.isContentEditable
        )) {
            return true;
        }
        
        // Allow if there's an active file upload
        const fileInputs = document.querySelectorAll('input[type="file"]');
        for (let input of fileInputs) {
            if (input.files && input.files.length > 0) {
                return true;
            }
        }
        
        return false;
    };
    
    // Store original functions
    const originalGetters = {};
    const originalMethods = {};
    
    // Override document visibility properties
    const overrideProperty = (obj, prop, fakeValue) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        if (descriptor && descriptor.get) {
            originalGetters[prop] = descriptor.get;
        }
        
        try {
            Object.defineProperty(obj, prop, {
                configurable: true,
                get: function() {
                    if (shouldAllowVisibilityChange()) {
                        return originalGetters[prop] ? originalGetters[prop].call(this) : fakeValue;
                    }
                    return fakeValue;
                }
            });
        } catch(e) {}
    };
    
    overrideProperty(document, 'hidden', false);
    overrideProperty(document, 'visibilityState', 'visible');
    
    // Override focus methods
    originalMethods.documentHasFocus = document.hasFocus;
    originalMethods.windowHasFocus = window.hasFocus;
    
    document.hasFocus = function() {
        if (shouldAllowVisibilityChange()) {
            return originalMethods.documentHasFocus.call(this);
        }
        return true;
    };
    
    window.hasFocus = function() {
        if (shouldAllowVisibilityChange()) {
            return originalMethods.windowHasFocus.call(this);
        }
        return true;
    };
    
    // Intercept visibility/focus events
    const interceptEvent = (e) => {
        if (!shouldAllowVisibilityChange()) {
            e.stopImmediatePropagation();
        }
    };
    
    const eventsToIntercept = [
        'visibilitychange',
        'webkitvisibilitychange',
        'blur',
        'focusout'
    ];
    
    eventsToIntercept.forEach(eventType => {
        window.addEventListener(eventType, interceptEvent, true);
        document.addEventListener(eventType, interceptEvent, true);
    });
})();