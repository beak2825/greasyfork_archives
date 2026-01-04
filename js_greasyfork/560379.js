// ==UserScript==
// @name         FAB Limited-Time Free Auto Claimer - Professional
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-navigates and claims all limited-time free assets with Professional license
// @author       6969RandomGuy6969
// @match        https://www.fab.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560379/FAB%20Limited-Time%20Free%20Auto%20Claimer%20-%20Professional.user.js
// @updateURL https://update.greasyfork.org/scripts/560379/FAB%20Limited-Time%20Free%20Auto%20Claimer%20-%20Professional.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DEBUG: true,
        AUTONAVIGATE: true, // Enable auto-navigation between assets
        AUTOCLEARSTATE: false, // Changed to false to prevent looping
        MONTHLY_LIMIT: 3, // FAB allows 3 free Professional licenses per month
        TIMEOUTS: {
            INITIALWAIT: 2500,
            AFTERACTION: 1000,
            DROPDOWNOPEN: 800,
            CHECKOUTLOAD: 3000,
            RETRYINTERVAL: 1000,
            BEFORENEXTASSET: 2000,
            PAGELOAD: 3000,
            URLCHECK: 500
        },
        RETRIES: {
            MAXATTEMPTS: 10,
            ENABLECHECKS: 5
        }
    };

    // Enhanced State Management (Monthly tracking with names)
    const state = {
        get monthlyClaims() {
            try {
                const data = JSON.parse(GM_getValue('monthlyClaims', '{}'));
                const now = new Date();
                const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                return data[monthKey] || [];
            } catch (e) {
                return [];
            }
        },
        addClaim(assetId, assetName) {
            const claims = this.monthlyClaims;
            if (claims.length < CONFIG.MONTHLY_LIMIT) {
                const existingIndex = claims.findIndex(c => c.id === assetId);
                if (existingIndex === -1) {
                    claims.push({ id: assetId, name: assetName, claimedAt: new Date().toISOString() });
                    const data = JSON.parse(GM_getValue('monthlyClaims', '{}'));
                    const now = new Date();
                    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                    data[monthKey] = claims;
                    GM_setValue('monthlyClaims', JSON.stringify(data));
                    log(`Added claim for "${assetName}" (${assetId.substring(0, 8)}...) - ${claims.length}/${CONFIG.MONTHLY_LIMIT}`);
                }
            }
        },
        isProcessed(assetId) {
            return this.monthlyClaims.some(c => c.id === assetId);
        },
        getClaimCount() {
            return this.monthlyClaims.length;
        },
        hasReachedLimit() {
            return this.getClaimCount() >= CONFIG.MONTHLY_LIMIT;
        },
        clearMonth() {
            GM_deleteValue('monthlyClaims');
            log('Monthly claims cleared! Ready for new month.');
        },
        showClaims() {
            const claims = this.monthlyClaims;
            log(`Current month claims (${claims.length}/${CONFIG.MONTHLY_LIMIT}):`);
            claims.forEach((claim, i) => {
                log(`  ${i + 1}. ${claim.name} (${claim.id.substring(0, 8)}...)`);
            });
        }
    };

    // Session state for current operation
    let lastUrl = window.location.href;
    let isProcessing = false;
    let hasCompletedAssetPage = false;
    let hasCompletedCheckout = false;
    let allAssetsCompleted = false; // Flag to stop auto-navigation when all done

    // URL Monitoring
    function startUrlMonitoring() {
        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                log('URL changed:', currentUrl);
                lastUrl = currentUrl;
                isProcessing = false;
                detectPageAndRun();
            }
        }, CONFIG.TIMEOUTS.URLCHECK);

        window.addEventListener('popstate', () => {
            log('Navigation detected (popstate)');
            isProcessing = false;
            detectPageAndRun();
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            log('Navigation detected (pushState)');
            isProcessing = false;
            detectPageAndRun();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            log('Navigation detected (replaceState)');
            isProcessing = false;
            detectPageAndRun();
        };

        log('URL monitoring active');
    }

    // Utilities
    const log = (...args) => {
        if (CONFIG.DEBUG) {
            const time = new Date().toLocaleTimeString();
            console.log(`%c[${time}] FAB Auto-Claimer`, 'color: #ff6b35; font-weight: bold;', ...args);
        }
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const findElement = {
        bySelector: (selector, root = document) => root.querySelector(selector),
        byText: (text, tagName = 'button', root = document) => {
            const elements = root.querySelectorAll(tagName);
            return Array.from(elements).find(el => el.textContent?.trim().includes(text));
        },
        dropdown: () => {
            const dropdowns = document.querySelectorAll('button.fabkit-InputContainer-root[aria-haspopup="true"]');
            return Array.from(dropdowns).find(btn => {
                const text = btn.querySelector('.fabkit-Eyebrow-root')?.textContent?.trim().toLowerCase();
                return text === 'personal' || text === 'professional';
            });
        },
        withRetry: async (findFn, maxAttempts = CONFIG.RETRIES.MAXATTEMPTS) => {
            for (let i = 0; i < maxAttempts; i++) {
                const element = findFn();
                if (element) return element;
                if (i < maxAttempts - 1) {
                    log(`Attempt ${i + 1}/${maxAttempts} - Element not found, retrying...`);
                    await sleep(CONFIG.TIMEOUTS.RETRYINTERVAL);
                }
            }
            return null;
        }
    };

    const buttonHelper = {
        isEnabled: (btn) => {
            return btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true' && !btn.hasAttribute('disabled');
        },
        waitUntilEnabled: async (btn, maxChecks = CONFIG.RETRIES.ENABLECHECKS) => {
            for (let i = 0; i < maxChecks; i++) {
                if (buttonHelper.isEnabled(btn)) return true;
                log(`Button disabled, waiting... (${i + 1}/${maxChecks})`);
                await sleep(CONFIG.TIMEOUTS.RETRYINTERVAL);
            }
            return false;
        },
        clickSafe: async (btn, description) => {
            if (!buttonHelper.isEnabled(btn)) {
                log(`Cannot click ${description} - button is disabled`);
                return false;
            }
            log(`Clicking ${description}...`);
            btn.click();
            await sleep(CONFIG.TIMEOUTS.AFTERACTION);
            return true;
        }
    };

    // Asset Collection
    function extractAssetId(url) {
        const match = url.match(/listings\/([a-f0-9-]{36})/i);
        return match ? match[1] : null;
    }

    function isAlreadyOwned(assetCard) {
        const text = assetCard.textContent.toLowerCase();
        return text.includes('saved in my library') ||
               text.includes('in your library') ||
               text.includes('you own this') ||
               text.includes('in my library');
    }

    function getAllFreeAssets() {
        const assetCards = document.querySelectorAll('.fabkit-Stack-root.nTa5u2sc');
        const assets = [];
        log(`Found ${assetCards.length} asset cards on page`);

        assetCards.forEach((card, index) => {
            const link = card.querySelector('a[href*="listings"]');
            if (!link) {
                log(`Card ${index + 1}: No listing link found`);
                return;
            }

            const assetId = extractAssetId(link.href);
            if (!assetId) {
                log(`Card ${index + 1}: Could not extract asset ID from ${link.href}`);
                return;
            }

            const isOwned = isAlreadyOwned(card);
            const isProcessed = state.isProcessed(assetId);
            const name = link.textContent.trim();

            log(`Asset ${index + 1}: ${name} (${assetId.substring(0, 8)}...) - Owned: ${isOwned}, Processed: ${isProcessed}`);

            assets.push({
                id: assetId,
                url: link.href,
                name: name,
                owned: isOwned,
                processed: isProcessed,
                shouldClaim: !isOwned && !isProcessed
            });
        });

        return assets;
    }

    // License Selection Flow
    async function selectProfessionalLicense() {
        log('Looking for license dropdown...');
        const licenseButton = findElement.dropdown();

        if (!licenseButton) {
            log('License dropdown not found');
            return false;
        }

        const currentLicense = licenseButton.querySelector('.fabkit-Eyebrow-root')?.textContent?.trim().toLowerCase();
        log(`Found license dropdown (current: ${currentLicense})`);

        if (currentLicense === 'professional') {
            log('Already set to Professional');
            return true;
        }

        log('Opening license dropdown...');
        licenseButton.click();
        await sleep(CONFIG.TIMEOUTS.DROPDOWNOPEN);

        log('Looking for Professional option...');
        const dropdownOptions = document.querySelectorAll('[role="option"], [role="menuitem"], li, button');
        const professionalOption = Array.from(dropdownOptions).find(option => {
            const text = option.textContent.toLowerCase();
            const isVisible = option.getBoundingClientRect().height > 0;
            return text.includes('professional') && isVisible;
        });

        if (!professionalOption) {
            log('Professional option not found in dropdown');
            return false;
        }

        log('Selecting Professional...');
        professionalOption.click();
        await sleep(CONFIG.TIMEOUTS.AFTERACTION);
        log('Professional selected');
        return true;
    }

    async function clickBuyNow() {
        log('Looking for Buy now button...');
        const buyButtons = document.querySelectorAll('button.fabkit-Button-root');
        const buyButton = Array.from(buyButtons).find(btn =>
            btn.querySelector('.fabkit-Button-label')?.textContent?.trim() === 'Buy now'
        );

        if (!buyButton) {
            log('Buy now button not found');
            return false;
        }

        log('Found Buy now button');
        return await buttonHelper.clickSafe(buyButton, 'Buy now');
    }

    async function clickPlaceOrder() {
        log('Looking for Place Order button...');
        const findPlaceOrderButton = () => {
            const orderDiv = findElement.bySelector('.payment-order-confirm');
            if (orderDiv) {
                const btn = orderDiv.querySelector('button.payment-order-confirm__btn');
                if (btn) return btn;
            }
            return findElement.byText('Place Order');
        };

        const placeOrderButton = await findElement.withRetry(findPlaceOrderButton);
        if (!placeOrderButton) {
            log('Place Order button not found after all attempts');
            return false;
        }

        log('Found Place Order button...');
        const isEnabled = await buttonHelper.waitUntilEnabled(placeOrderButton);
        if (!isEnabled) {
            log('Place Order button remained disabled');
            return false;
        }

        log('Button is enabled');
        return await buttonHelper.clickSafe(placeOrderButton, 'Place Order');
    }

    // Page Handlers
    async function handleHomePage() {
        log('On home page');

        // If all assets are completed, don't auto-navigate
        if (allAssetsCompleted) {
            log('');
            log('═'.repeat(60));
            log('🎉 ALL ASSETS ALREADY CLAIMED! 🎉');
            log('Auto-navigation is stopped.');
            log('═'.repeat(60));
            log('');
            if (state.getClaimCount() > 0) {
                log('Your claimed assets:');
                state.showClaims();
            }
            log('');
            log('To reset and start over: window.clearMonthlyClaims()');
            log('');
            return;
        }

        log(`Current claims in memory: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}`);

        // ALWAYS go to catalog FIRST to check the actual page state
        log('Navigating to catalog to check current status...');
        await sleep(1000);
        window.location.href = 'https://www.fab.com/limited-time-free';
    }

    async function handleCatalogPage() {
        log('On limited-time free catalog page');

        // Reset session flags for new claiming session
        hasCompletedAssetPage = false;
        hasCompletedCheckout = false;
        isProcessing = false;

        if (!CONFIG.AUTONAVIGATE) {
            log('Auto-navigation disabled. Click on an asset to claim it.');
            return;
        }

        log('Waiting for page to fully load...');
        await sleep(CONFIG.TIMEOUTS.PAGELOAD);

        const assets = getAllFreeAssets();
        if (assets.length === 0) {
            log('No assets found on page');
            return;
        }

        log(`Total assets found: ${assets.length}`);
        log(`Already owned: ${assets.filter(a => a.owned).length}`);
        log(`Monthly claims used: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}`);

        // CHECK IF ALL ASSETS ARE OWNED (SAVED IN LIBRARY)
        const allOwned = assets.every(a => a.owned);

        if (allOwned && assets.length === CONFIG.MONTHLY_LIMIT) {
            allAssetsCompleted = true; // Set flag to stop auto-navigation
            log('');
            log('═'.repeat(60));
            log('🎉 ALL ASSETS CLAIMED! 🎉');
            log(`All ${assets.length} limited-time free assets are now in your library!`);
            log('═'.repeat(60));
            log('');
            log('Assets claimed:');
            assets.forEach((asset, i) => {
                log(`  ${i + 1}. ${asset.name}`);
            });
            log('');
            log('Auto-navigation stopped. Check back next month for new free assets!');
            log('To reset and start over: window.clearMonthlyClaims()');
            log('');
            return;
        }

        const toClaim = assets.filter(a => a.shouldClaim);
        log(`Assets to claim: ${toClaim.length}`);

        if (toClaim.length === 0) {
            log(`No more assets to claim!`);
            log('Summary:');
            log(`- Already owned: ${assets.filter(a => a.owned).length}`);
            log(`- Already claimed this month: ${assets.filter(a => !a.owned && a.processed).length}`);
            log('Set AUTONAVIGATE: false or clear monthly claims to start over.');
            return;
        }

        // CHECK IF WE'VE REACHED LIMIT
        if (state.hasReachedLimit()) {
            log('');
            log('═'.repeat(60));
            log('🎉 MONTHLY LIMIT REACHED! 🎉');
            log(`You have claimed ${CONFIG.MONTHLY_LIMIT} free Professional licenses this month.`);
            log('═'.repeat(60));
            log('');
            log('Your claimed assets:');
            state.showClaims();
            log('');
            log('Note: Some assets may not show "Saved in Library" yet. Refresh the page.');
            log('To reset: window.clearMonthlyClaims()');
            log('');
            return;
        }

        const firstAsset = toClaim[0];
        log('');
        log('Next asset to claim:');
        log(`- Name: ${firstAsset.name}`);
        log(`- ID: ${firstAsset.id}`);
        log(`- URL: ${firstAsset.url}`);
        log('');
        log('Navigating in 2 seconds...');
        await sleep(2000);
        log('NAVIGATING NOW!');
        window.location.href = firstAsset.url;
    }

    async function handleAssetPage() {
        // Check if we've already completed this
        if (hasCompletedAssetPage) {
            log('Asset page already processed, skipping...');
            return;
        }

        // Check if this is the URL with purchase parameters (after clicking Buy Now)
        const url = window.location.href;
        if (url.includes('quickBuyOfferId=') && url.includes('purchaseToken=')) {
            log('Purchase flow opened - waiting for completion...');
            log('Checkout popup should be open. Waiting for it to close...');

            // Wait and monitor for URL to return to clean state (without parameters)
            const maxWaitTime = 60000; // 60 seconds max
            const checkInterval = 2000; // Check every 2 seconds
            let elapsed = 0;

            while (elapsed < maxWaitTime) {
                await sleep(checkInterval);
                elapsed += checkInterval;

                const currentUrl = window.location.href;
                // If URL is clean (no purchase parameters), purchase is complete
                if (!currentUrl.includes('quickBuyOfferId=') && !currentUrl.includes('purchaseToken=')) {
                    log('Purchase completed! URL returned to clean state.');
                    log('Asset claimed successfully!');

                    // Mark as processed
                    const assetId = extractAssetId(currentUrl);
                    const assetNameElement = document.querySelector('h1.fabkit-Headline-root');
                    const assetName = assetNameElement ? assetNameElement.textContent.trim() : 'Claimed Asset';

                    if (assetId) {
                        state.addClaim(assetId, assetName);
                        log(`Marked "${assetName}" as processed`);
                    }

                    // Navigate to catalog for next asset
                    if (CONFIG.AUTONAVIGATE) {
                        if (state.hasReachedLimit()) {
                            log('Monthly limit reached! Going to catalog to verify...');
                            await sleep(2000);
                            window.location.href = 'https://www.fab.com/limited-time-free';
                        } else {
                            log('Going to catalog to claim next asset...');
                            await goBackToCatalog();
                        }
                    }
                    return;
                }

                log(`Still waiting for purchase to complete... (${elapsed/1000}s)`);
            }

            log('Timeout waiting for purchase. Forcing navigation to catalog...');
            await goBackToCatalog();
            return;
        }

        if (isProcessing) {
            log('Already processing, skipping...');
            return;
        }

        isProcessing = true;
        log('Starting auto-claim process...');

        const assetId = extractAssetId(window.location.href);
        if (!assetId) {
            log('Could not extract asset ID from URL');
            isProcessing = false;
            return;
        }

        // Get asset name from page
        const assetNameElement = document.querySelector('h1.fabkit-Headline-root');
        const assetName = assetNameElement ? assetNameElement.textContent.trim() : 'Unknown Asset';
        log(`Current asset: "${assetName}" (${assetId.substring(0, 8)}...)`);

        const professionalSelected = await selectProfessionalLicense();
        if (!professionalSelected) {
            log('Could not select Professional license');
            state.addClaim(assetId, assetName);
            if (CONFIG.AUTONAVIGATE) await goBackToCatalog();
            isProcessing = false;
            return;
        }

        const buyClicked = await clickBuyNow();
        if (!buyClicked) {
            log('Could not click Buy now');
            state.addClaim(assetId, assetName);
            if (CONFIG.AUTONAVIGATE) await goBackToCatalog();
            isProcessing = false;
            return;
        }

        // Mark as completed
        hasCompletedAssetPage = true;
        log('Buy Now clicked - purchase parameters should appear in URL');
        log('Script will monitor URL for purchase completion...');
    }

    async function handleCheckoutPage() {
        // Check if we've already completed checkout
        if (hasCompletedCheckout) {
            log('Checkout already processed, skipping...');
            return;
        }
        if (isProcessing) {
            log('Already processing, skipping...');
            return;
        }

        // Check if this is the purchase confirmation URL (causes errors if we navigate)
        const url = window.location.href;
        const hasQuickBuy = url.includes('quickBuyOfferId=');
        const hasPurchaseToken = url.includes('purchaseToken=');
        const hasValidToken = hasPurchaseToken && !url.includes('purchaseToken=undefined');

        // Only wait if BOTH parameters are present AND token is valid
        if (hasQuickBuy && hasValidToken) {
            log('On purchase confirmation page - waiting for completion...');
            log('This page will auto-close or redirect. Waiting...');
            await sleep(5000); // Wait longer for purchase to complete

            // Check if we're still on this page after waiting
            if (window.location.href.includes('quickBuyOfferId=') && !window.location.href.includes('purchaseToken=undefined')) {
                log('Purchase confirmation still showing. Forcing navigation to catalog...');
                window.location.href = 'https://www.fab.com/limited-time-free';
            }
            return;
        }

        isProcessing = true;
        log('On checkout page');
        await sleep(CONFIG.TIMEOUTS.CHECKOUTLOAD);

        const orderPlaced = await clickPlaceOrder();
        if (!orderPlaced) {
            log('Could not complete order');
            isProcessing = false;
            if (CONFIG.AUTONAVIGATE) {
                await sleep(2000);
                await goBackToCatalog();
            }
            return;
        }

        // Mark as completed
        hasCompletedCheckout = true;
        log('Successfully claimed FREE asset with Professional license!');
        log('Asset should now be in your library!');

        // Mark as processed with name
        const referrer = document.referrer;
        const assetId = extractAssetId(referrer);
        if (assetId) {
            // Try to get asset name from order confirmation or referrer
            const assetNameElement = document.querySelector('h1, h2, .product-name, [class*="title"]');
            const assetName = assetNameElement ? assetNameElement.textContent.trim() : 'Claimed Asset';

            state.addClaim(assetId, assetName);
            log(`Marked "${assetName}" (${assetId.substring(0, 8)}...) as processed`);
        }

        if (CONFIG.AUTONAVIGATE) {
            log('Waiting for purchase confirmation to complete...');
            await sleep(5000); // Wait longer for the purchase flow to finish

            // CHECK IF WE'VE REACHED LIMIT AFTER THIS CLAIM
            if (state.hasReachedLimit()) {
                log('');
                log('═'.repeat(60));
                log('🎉 MONTHLY LIMIT REACHED! 🎉');
                log(`You have claimed all ${CONFIG.MONTHLY_LIMIT} free Professional licenses this month.`);
                log('═'.repeat(60));
                log('');
                log('Going to catalog to verify all assets are saved...');
                await sleep(2000);
                window.location.href = 'https://www.fab.com/limited-time-free';
            } else {
                log('Navigating to catalog to claim next asset...');
                await goBackToCatalog();
            }
        }
    }

    async function goBackToCatalog() {
        log('Returning to catalog to find next asset...');
        await sleep(1000);
        window.location.href = 'https://www.fab.com/limited-time-free';
    }

    // Router
    function detectPageAndRun() {
        const url = window.location.href;
        log('='.repeat(60));
        log(`Current URL: ${url}...`);

        if (url.includes('/payment/web/purchase')) {
            log('Detected Checkout page');
            setTimeout(handleCheckoutPage, 500);
        } else if (url.includes('listings')) {
            log('Detected Asset listing page');
            setTimeout(async () => {
                const dropdownReady = !!findElement.dropdown();
                const delay = dropdownReady ? 1000 : CONFIG.TIMEOUTS.INITIALWAIT;
                log(dropdownReady ? 'Page ready, starting soon' : 'Waiting for page load...');
                setTimeout(handleAssetPage, delay);
            }, 800);
        } else if (url.includes('limited-time-free')) {
            log('Detected Limited-time-free catalog');
            setTimeout(handleCatalogPage, 1500);
        } else if (url === 'https://www.fab.com/' || url === 'https://www.fab.com') {
            log('Detected Home page');
            if (CONFIG.AUTONAVIGATE) {
                setTimeout(handleHomePage, 2000);
            } else {
                log('Auto-navigation disabled. Manually go to limited-time-free page.');
            }
        }
    }

    // Initialize
    function initialize() {
        log('FAB Auto-Claimer v1.3 initialized');
        log(`Monthly claims: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}`);
        if (state.getClaimCount() > 0) {
            state.showClaims();
        }
        log('Console commands:');
        log('  window.clearMonthlyClaims() - Clear monthly claims and start over');
        log('  window.showMonthlyClaims() - Show current monthly claims');

        startUrlMonitoring();
        detectPageAndRun();

        // Add console commands
        window.clearMonthlyClaims = () => {
            state.clearMonth();
            allAssetsCompleted = false; // Reset the flag too
        };
        window.showMonthlyClaims = () => state.showClaims();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    log('Script loaded and monitoring all navigation');
})();