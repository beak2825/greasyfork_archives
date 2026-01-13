// ==UserScript==
// @name         TalkAI - Total Wipeout (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Nukes sidebar, terms (no accept), premium popups, and ALL in-chat ad squares.
// @author       Ggjay
// @match        *://*.talkai.info/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562465/TalkAI%20-%20Total%20Wipeout%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562465/TalkAI%20-%20Total%20Wipeout%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. BLOCK LEGAL/POPUP FUNCTIONS
    window.initializeBanner = () => {};
    window.showBanner = () => {};
    window.openPremiumModal = () => {};

    // 2. CSS IRON CLAD (Instant removal)
    const style = document.createElement('style');
    style.innerHTML = `
        /* DELETE SIDEBAR & MENUS */
        .chat-menu, .chat-sidetrigger, .menu-chat-trigger, .chat__mobile, .menu-logo {
            display: none !important;
            width: 0 !important;
        }

        /* DELETE ALL AD SQUARES (In-chat and Banners) */
        .chat__banner, ins.adsbygoogle, div[class*="banner"], div[id*="google_ads"], 
        iframe[id*="aswift"], .ad-box, [data-ad-client] {
            display: none !important;
            height: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* DELETE TERMS & COOKIES (Without Agreement) */
        #consent-banner, .accept, .blur, .modal-backdrop {
            display: none !important;
            position: absolute !important;
            top: -9999px !important;
        }

        /* FULL WIDTH CHAT */
        .chat.row { display: block !important; }
        .chat__body {
            margin: 0 !important;
            padding: 10px !important;
            width: 100% !important;
            max-width: 100% !important;
        }

        /* FIX TRANSCRIPT BUBBLES (No hiding on scroll) */
        .chat__wrapper {
            max-width: 90% !important;
            margin: 0 auto !important;
            overflow: visible !important;
        }
        
        .message, .chat-item, .chat-content {
            opacity: 1 !important;
            visibility: visible !important;
            display: flex !important;
            transform: none !important;
            transition: none !important;
        }

        /* REMOVE PREMIUM BUTTONS/NUDGES */
        .chat-btnset, a[href*="premium"], .upgrade-button {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 3. CONTINUOUS CLEANER (Nukes items as they try to spawn)
    const nukeAds = () => {
        // Find every ad-related element and destroy it
        const trash = document.querySelectorAll('.adsbygoogle, .chat__banner, #consent-banner, iframe[src*="google"]');
        trash.forEach(el => el.remove());
        
        // Sometimes ads leave empty placeholder divs - this cleans them
        document.querySelectorAll('div').forEach(div => {
            if (div.innerHTML.includes('adsbygoogle') || div.hasAttribute('data-ad-client')) {
                div.remove();
            }
        });
    };

    const observer = new MutationObserver(nukeAds);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Final check for body-lock
    setInterval(() => {
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = 'auto';
        }
    }, 500);

})();