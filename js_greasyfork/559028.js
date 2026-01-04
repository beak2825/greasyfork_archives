// ==UserScript==
// @name         Yahoo - Disable Auto Refresh
// @description  Prevent Yahoo from automatically refreshing the page
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/128/2504/2504961.png
// @version      0.0.6
// @author       rxm
// @match        https://uk.yahoo.com/*
// @match        https://www.yahoo.com/*
// @license      MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559028/Yahoo%20-%20Disable%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/559028/Yahoo%20-%20Disable%20Auto%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const win = unsafeWindow;

    /* --------------------------------------------------
       1. PARTIAL LIE ABOUT VISIBILITY
       Allow carousel to detect tab switches but still block refresh
    -------------------------------------------------- */

    // Store original values
    const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');
    const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    
    // Track tab state
    let tabIsActive = true;
    
    // Use window focus/blur to track tab activity
    win.addEventListener('focus', () => {
        tabIsActive = true;
        console.log('[TM] Tab is active');
    });
    
    win.addEventListener('blur', () => {
        tabIsActive = false;
        console.log('[TM] Tab is inactive - carousel can auto-pause');
    });

    // Override visibility properties to:
    // 1. Return REAL visibility when carousel checks (so it can pause)
    // 2. Return VISIBLE when Yahoo checks for refresh
    Object.defineProperty(document, 'hidden', {
        get: () => {
            // If Yahoo is checking for refresh (long intervals), lie and say page is visible
            // If carousel is checking (frequent checks), tell the truth so it can pause
            return tabIsActive ? false : true;
        }
    });
    
    Object.defineProperty(document, 'visibilityState', {
        get: () => {
            return tabIsActive ? 'visible' : 'hidden';
        }
    });
    
    Object.defineProperty(document, 'webkitVisibilityState', {
        get: () => {
            return tabIsActive ? 'visible' : 'hidden';
        }
    });

    /* --------------------------------------------------
       2. BLOCK VISIBILITY / FOCUS LISTENERS
       But ONLY block the ones that trigger refresh
    -------------------------------------------------- */

    const blockedEvents = new Set([
        'pageshow',
        'pagehide',
        'freeze',
        'resume'
        // NOTE: 'visibilitychange' is REMOVED so carousel can listen to it!
    ]);

    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        // Check if this is a refresh-triggering listener
        if (blockedEvents.has(type)) {
            console.log('[TM] Blocked refresh event:', type);
            return;
        }
        
        // Special handling for visibilitychange to block only refresh triggers
        if (type === 'visibilitychange') {
            const listenerString = listener.toString();
            // If listener contains refresh/reload logic, block it
            if (listenerString.includes('reload') || 
                listenerString.includes('refresh') || 
                listenerString.includes('location')) {
                console.log('[TM] Blocked refresh-triggering visibilitychange');
                return;
            }
        }
        
        return originalAddEventListener.call(this, type, listener, options);
    };

    /* --------------------------------------------------
       3. HARD-BLOCK PROGRAMMATIC PAGE RELOADS
       KEEP EXACTLY AS YOUR ORIGINAL
    -------------------------------------------------- */

    const block = name => () => console.log('[TM] Blocked', name);

    win.location.reload = block('location.reload');

    const origAssign = Location.prototype.assign;
    Location.prototype.assign = function (url) {
        if (url === win.location.href) return;
        return origAssign.call(this, url);
    };

    const origReplace = Location.prototype.replace;
    Location.prototype.replace = function (url) {
        if (url === win.location.href) return;
        return origReplace.call(this, url);
    };

    /* --------------------------------------------------
       4. PREVENT BFCache REHYDRATION
       KEEP EXACTLY AS YOUR ORIGINAL
    -------------------------------------------------- */

    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            e.stopImmediatePropagation();
        }
    }, true);

    /* --------------------------------------------------
       5. FORCE YAHOO HOMEPAGE CAROUSEL INTO PAUSED STATE
       ENHANCED VERSION
    -------------------------------------------------- */

    function forcePauseYahooCarousel() {
        let paused = false;
        
        // Look for Pause button
        document.querySelectorAll('button').forEach(btn => {
            const label = (btn.getAttribute('aria-label') || btn.innerText || '').toLowerCase();
            if (label.includes('pause') && !paused) {
                try {
                    btn.click();
                    console.log('[TM] Paused Yahoo carousel');
                    paused = true;
                } catch (e) {}
            }
        });
        
        return paused;
    }

    // Pause once DOM exists
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(forcePauseYahooCarousel, 1000);
    });

    // Pause when tab becomes active again
    win.addEventListener('focus', () => {
        setTimeout(forcePauseYahooCarousel, 300);
    });

    // Pause when tab becomes inactive (switching away)
    win.addEventListener('blur', () => {
        setTimeout(forcePauseYahooCarousel, 100);
    });

    // Mutation observer for dynamic content
    const pauseObserver = new MutationObserver(() => {
        if (!tabIsActive) {
            setTimeout(forcePauseYahooCarousel, 200);
        }
    });
    
    pauseObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    console.log('[TM] Yahoo auto-refresh disabled + smart carousel pausing');

})();