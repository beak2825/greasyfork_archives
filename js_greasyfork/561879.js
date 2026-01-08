// ==UserScript==
// @name         Kick.com - Force 1080p, No Throttle & Auto-Confirm Mature
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Forces 1080p, prevents background throttling, and auto-clicks the "I am 18+" mature content warning.
// @author       Tuur (gemini)
// @match        https://kick.com/*
// @match        https://player.kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561879/Kickcom%20-%20Force%201080p%2C%20No%20Throttle%20%20Auto-Confirm%20Mature.user.js
// @updateURL https://update.greasyfork.org/scripts/561879/Kickcom%20-%20Force%201080p%2C%20No%20Throttle%20%20Auto-Confirm%20Mature.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. VISIBILITY SPOOFING (Prevents background drops) ---
    // Overwrite the document properties to always show as visible
    Object.defineProperty(document, 'hidden', { value: false, writable: false });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
    Object.defineProperty(document, 'webkitVisibilityState', { value: 'visible', writable: false });

    // Block visibilitychange events so the site never knows you switched tabs
    const blockEvent = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
    window.addEventListener('visibilitychange', blockEvent, true);
    window.addEventListener('webkitvisibilitychange', blockEvent, true);
    window.addEventListener('mozvisibilitychange', blockEvent, true);
    window.addEventListener('blur', blockEvent, true);

    // --- 2. SESSION STORAGE HACK ---
    try {
        const originalSetItem = window.sessionStorage.setItem;
        window.sessionStorage.setItem('kick_quality', '1080'); 
        window.sessionStorage.setItem('stream_quality', '1080');
    } catch (e) {
        console.log('Kick Quality: Session storage access failed', e);
    }

    // --- 3. IVS PLAYER HOOK (Quality Locking) ---
    function lockQuality(player) {
        if (!player) return;

        const enforceMax = () => {
            const qualities = player.getQualities();
            if (!qualities || qualities.length === 0) return;

            // Find 1080p or the highest available
            const maxQuality = qualities.find(q => q.name.includes('1080')) || qualities[0];
            
            const currentQ = player.getQuality();
            const isAuto = player.isAutoQualityMode();

            if (maxQuality && (isAuto || (currentQ && currentQ.name !== maxQuality.name))) {
                console.log(`Kick Quality: Locking to ${maxQuality.name}`);
                player.setAutoQualityMode(false); // Disable Auto
                player.setQuality(maxQuality);    // Force Max
            }
        };

        const events = ['Playing', 'QualityChanged'];
        enforceMax();
        
        // Check periodically to fight "Auto" logic
        setInterval(enforceMax, 5000);
        
        if (player.addEventListener) {
            player.addEventListener('PlayerState.PLAYING', enforceMax);
        }
    }

    // Intercept IVS Player creation
    let ivsHooked = false;
    const hookIVS = () => {
        if (window.IVSPlayer && !ivsHooked) {
            ivsHooked = true;
            const originalCreate = window.IVSPlayer.create;
            
            window.IVSPlayer.create = function() {
                console.log("Kick Quality: Intercepted IVS Player creation");
                const player = originalCreate.apply(this, arguments);
                player.addEventListener('PlayerState.READY', () => {
                   lockQuality(player);
                });
                setTimeout(() => lockQuality(player), 2000);
                return player;
            };
        }
    };

    if (window.IVSPlayer) {
        hookIVS();
    } else {
        Object.defineProperty(window, 'IVSPlayer', {
            configurable: true,
            enumerable: true,
            get: function() { return this._IVSPlayer; },
            set: function(val) {
                this._IVSPlayer = val;
                hookIVS();
            }
        });
    }

    // --- 4. AUTO CLICKER & FALLBACK SCANNER ---
    setInterval(() => {
        // A. Auto-click "I am 18+" / Mature Content button
        // Based on your HTML: data-testid="mature"
        const matureBtn = document.querySelector('button[data-testid="mature"]');
        if (matureBtn) {
            console.log("Kick Script: Clicking 'I am 18+' button");
            matureBtn.click();
        } 
        // Fallback for "Start watching" if they change the ID
        else {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.innerText && (btn.innerText.includes("Start watching") || btn.innerText.includes("I am 18+"))) {
                    // Only click if it looks like the overlay button (usually has specific classes or parents)
                    console.log("Kick Script: Clicking content warning button (Text Match)");
                    btn.click();
                    break;
                }
            }
        }

        // B. Re-apply visibility spoof just in case
        if (document.hidden) {
             Object.defineProperty(document, 'hidden', { value: false, writable: false });
             Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        }
    }, 1000); // Check every second

    console.log("Kick Quality: Script Loaded");

})();