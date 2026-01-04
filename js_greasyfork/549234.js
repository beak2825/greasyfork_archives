// ==UserScript==
// @name YouTube Adblock & Anti-Adblock (All-in-One, Universal)
// @namespace yt-adblock-and-anti-adblock-universal
// @version 1.0
// @description A comprehensive script that both blocks ads and bypasses anti-adblock, written in universally compatible syntax.
// @description:de A comprehensive script that both blocks ads and bypasses anti-adblock, written in universally compatible syntax.
// @author imakealol
// @match *://*.youtube.com/*
// @grant unsafeWindow
// @run-at document-start
// @license WITH
// @downloadURL https://update.greasyfork.org/scripts/549234/YouTube%20Adblock%20%20Anti-Adblock%20%28All-in-One%2C%20Universal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549234/YouTube%20Adblock%20%20Anti-Adblock%20%28All-in-One%2C%20Universal%29.meta.js
// ==/UserScript==

(function() { 
    'use strict'; 

    const LOG_PREFIX = '%c[YT All-in-One Universal]:'; 
    const LOG_STYLE_BLOCK = 'color: red; font-weight: bold;'; 
    const LOG_STYLE_NEUTRALIZE = 'color: orange; font-weight: bold;'; 
    const LOG_STYLE_CLEANUP = 'color: cyan; font-weight: bold;'; 

    // --- Layer 1: Proactive data neutralization --- 
    const neutralizeInitialData = () => { 
        try { 
            const propertyToNeutralize = { 
                set: function(value) { 
                    // CORRECTION: Old, compatible syntax 
                    if (value && (value.adPlacements || value.playerAds)) { 
                        console.log(LOG_PREFIX, LOG_STYLE_NEUTRALIZE, 'Neutralizing ad data in ytInitialPlayerResponse.'); 
                        value.adPlacements = []; 
                        value.playerAds = []; 
                    } 
                    if (value && value.playerOverlays) { 
                        console.log(LOG_PREFIX, LOG_STYLE_NEUTRALIZE, 'Neutralizing playerOverlays in ytInitialData.'); 
                        value.playerOverlays = undefined; 
                    } 
                    this._value = value; 
                }, 
                get: function() { 
                    // CORRECTION: Old, compatible syntax 
                    return this._value || {}; 
                }, 
                configurable: true 
            }; 
            Object.defineProperty(unsafeWindow, 'ytInitialPlayerResponse', propertyToNeutralize); 
            Object.defineProperty(unsafeWindow, 'ytInitialData', propertyToNeutralize); 
        } catch (e) { 
            console.error('Failed to set up proactive neutralization:', e); 
        } 
    }; 

    // --- Layer 2: Network Request Blocker (Ad Blocker) --- 
    const interceptNetworkRequests = () => { 
        if (unsafeWindow.fetch.isPatchedByYTAAB) return; 

        const originalFetch = unsafeWindow.fetch; 
        const adKeywords = [ 
            '/api/stats/ads', '/pagead/', 'doubleclick.net', 'googlesyndication.com', 
            'googleads.g.doubleclick.net', 'adservice.google.com' 
        ]; 

        unsafeWindow.fetch = function(...args) { 
            const url = args[0] instanceof Request ? args[0].url : (args[0] || ''); 

            if (adKeywords.some(keyword => url.includes(keyword))) { 
                console.log(LOG_PREFIX, LOG_STYLE_BLOCK, `Blocking ad request to: ${url.substring(0, 100)}...`); 
                return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content' })); 
            } 
            return originalFetch.apply(this, args); 
        }; 
        unsafeWindow.fetch.isPatchedByYTAAB = true; 
    }; 

    // --- Layer 3: Reactive Popup Remover --- 
    const cleanupDOM = () => { 
        // CORRECTION: Old, compatible syntax 
        const popup = document.querySelector('ytd-enforcement-message-view-model, tp-yt-paper-dialog[class*="ytd-popup-container"]'); 
        if (popup) { 
            const container = popup.closest('ytd-popup-container'); 
            if (container) { 
                container.remove(); 
            } else { 
                popup.remove(); 
            } 
        } 

        const video = document.querySelector('#movie_player video'); 
        if (video && video.paused) { 
            video.play().catch(() => {}); // Ignore errors when playing 
        } 

        if (document.documentElement.style.overflow === 'hidden') { 
            document.documentElement.style.overflow = ''; 
        } 
    }; 

    // --- Initialization --- 
    console.log(LOG_PREFIX, 'Initializing...'); 
    neutralizeInitialData(); 
    interceptNetworkRequests(); 

    const observer = new MutationObserver(cleanupDOM); 
    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    }); 

    window.addEventListener('yt-navigate-finish', cleanupDOM);

})();