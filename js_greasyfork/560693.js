// ==UserScript==
// @name         Gamersberg Blox Fruits Giveaway Auto Claimer v1.5
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Auto claims free tickets sequentially for selected Blox Fruits giveaways on gamersberg.com. Includes +1 Fruits Storage, 2x Mastery, East Dragon Fruit, Permanent Leopard.
// @author       Grok
// @match        https://www.gamersberg.com/giveaways
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560693/Gamersberg%20Blox%20Fruits%20Giveaway%20Auto%20Claimer%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/560693/Gamersberg%20Blox%20Fruits%20Giveaway%20Auto%20Claimer%20v15.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Targets in desired order (case-insensitive partial match)
    const targetNames = [
        '+1 Fruits Storage',
        '2x Mastery',
        'East Dragon Fruit',      // Added as requested
        'Permanent Leopard'       // Added as requested
        // Add more here if new ones appear
    ];

    const adWaitTime = 45000;      // 45 seconds for ad
    const fiveMinuteWait = 300000; // Exactly 5 minutes between claims

    let currentIndex = 0;

    function processNext() {
        if (currentIndex >= targetNames.length) {
            console.log('🎉 All selected giveaways processed! Script finished.');
            return;
        }

        const target = targetNames[currentIndex].toLowerCase();
        console.log(`\n🔍 Processing ${currentIndex + 1}/${targetNames.length}: ${targetNames[currentIndex]}`);

        // Find title element matching the target
        const titleElements = document.querySelectorAll('.giveaway-title, h1, h2, h3, h4, h5, p, span');
        const matchingTitle = Array.from(titleElements).find(el => 
            el.textContent.trim().toLowerCase().includes(target)
        );

        if (!matchingTitle) {
            console.log(`❌ ${targetNames[currentIndex]} not found on page. Skipping...`);
            currentIndex++;
            setTimeout(processNext, 5000);
            return;
        }

        // Find the parent card and Enter Giveaway button
        const card = matchingTitle.closest('.giveaway-card, section, article, div');
        const enterBtn = card?.querySelector('button, a') || 
                         Array.from(card?.querySelectorAll('button, a') || []).find(btn => 
                             btn.textContent.trim().toLowerCase().includes('enter giveaway')
                         ) || card;

        if (!enterBtn) {
            console.log('❌ Enter Giveaway button not found.');
            currentIndex++;
            setTimeout(processNext, 5000);
            return;
        }

        console.log('✅ Found! Clicking Enter Giveaway...');
        enterBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
        enterBtn.click();

        // Wait for popup/modal
        setTimeout(() => {
            console.log('🔍 Looking for Claim Free Ticket button...');
            const claimBtn = Array.from(document.querySelectorAll('button, a, div[role="button"]'))
                .find(btn => btn.textContent.trim().toLowerCase().includes('claim free ticket'));

            if (!claimBtn) {
                console.log('❌ Claim Free Ticket button not found. Skipping...');
                currentIndex++;
                setTimeout(processNext, 10000);
                return;
            }

            claimBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
            claimBtn.click();
            console.log('🎟️ Claim Free Ticket clicked! Waiting for ad...');

            setTimeout(() => {
                console.log('⏳ Ad wait complete. Closing popup...');

                // Multiple close attempts
                let closed = false;
                const closeSelectors = [
                    'button[aria-label*="close" i]',
                    '.close, [class*="close"]',
                    'button svg',
                    '[data-dismiss="modal"]'
                ];
                for (const sel of closeSelectors) {
                    const btn = document.querySelector(sel);
                    if (btn) {
                        btn.click();
                        closed = true;
                        console.log('✅ Popup closed via selector.');
                        break;
                    }
                }

                if (!closed) {
                    // Fallback: press Escape key
                    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
                    console.log('⚠️ Tried closing with Escape key – check if popup closed.');
                }

                currentIndex++;
                console.log(`⏰ Waiting 5 minutes before next... (${currentIndex}/${targetNames.length} completed)`);
                setTimeout(processNext, fiveMinuteWait);

            }, adWaitTime);

        }, 5000); // Popup load time

    }

    // Wait for giveaway cards to load
    const observer = new MutationObserver(() => {
        if (document.querySelector('.giveaway-title, .giveaway-card')) {
            console.log('🚀 Giveaway content loaded. Starting auto claim in 10 seconds...');
            observer.disconnect();
            setTimeout(processNext, 10000);
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});

    console.log('Gamersberg Auto Claimer v1.5 loaded – Targets: +1 Fruits Storage, 2x Mastery, East Dragon Fruit, Permanent Leopard');
})();
