// ==UserScript==
// @name         FAB Limited-Time Free Auto Claimer - Professional
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-navigates and claims all limited-time free assets with Professional license (Clean console output)
// @author       6969RandomGuy6969
// @match        https://www.fab.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
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
        AUTONAVIGATE: true,
        MONTHLY_LIMIT: 3,
        TIMEOUTS: {
            INITIALWAIT: 2500,
            AFTERACTION: 1000,
            DROPDOWNOPEN: 800,
            CHECKOUTLOAD: 3000,
            RETRYINTERVAL: 1000,
            PAGELOAD: 3000,
            URLCHECK: 500,
            CHECKFORSAVED: 500,
            VERIFYOWNERSHIP: 2000
        },
        RETRIES: {
            MAXATTEMPTS: 10,
            ENABLECHECKS: 5
        }
    };

    // Enhanced State Management
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
                    log(`✓ Claimed: "${assetName}" (${claims.length}/${CONFIG.MONTHLY_LIMIT})`);
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
            log('✓ Monthly claims cleared!');
        },
        showClaims() {
            const claims = this.monthlyClaims;
            console.log(`\n📊 Monthly Claims (${claims.length}/${CONFIG.MONTHLY_LIMIT}):`);
            claims.forEach((claim, i) => {
                console.log(`  ${i + 1}. ${claim.name}`);
            });
            console.log('');
        }
    };

    // Session state
    let lastUrl = window.location.href;
    let isProcessing = false;
    let hasCompletedAssetPage = false;
    let hasCompletedCheckout = false;
    let allAssetsCompleted = false;
    let currentAssetId = null;
    let currentAssetName = null;
    let waitingForSavedIndicator = false;
    let savedCheckInterval = null;

    // Check if we're in a popup
    function isInPopup() {
        return window.opener !== null || window !== window.top;
    }

    // Check if asset shows "Saved in My Library"
    function isAssetSavedInLibrary() {
        const savedIndicators = document.querySelectorAll('.fabkit-Stack-root');

        for (const indicator of savedIndicators) {
            const checkIcon = indicator.querySelector('.edsicon-check-circle, .edsicon-check-circle-filled');
            const heading = indicator.querySelector('h2.fabkit-Heading--md');

            if (checkIcon && heading) {
                const text = heading.textContent.trim();
                if (text === 'Saved in My Library') {
                    return true;
                }
            }
        }

        const bodyText = document.body.textContent;
        return bodyText.includes('Saved in My Library');
    }

    // Start checking for "Saved in My Library" indicator
    function startWaitingForSaved() {
        if (savedCheckInterval) {
            clearInterval(savedCheckInterval);
        }

        waitingForSavedIndicator = true;

        savedCheckInterval = setInterval(() => {
            if (isAssetSavedInLibrary()) {
                log('✓ Purchase confirmed!');
                clearInterval(savedCheckInterval);
                savedCheckInterval = null;
                waitingForSavedIndicator = false;

                if (CONFIG.AUTONAVIGATE) {
                    setTimeout(() => {
                        window.location.href = 'https://www.fab.com/limited-time-free';
                    }, CONFIG.TIMEOUTS.VERIFYOWNERSHIP);
                }
            }
        }, CONFIG.TIMEOUTS.CHECKFORSAVED);
    }

    // Stop checking for saved indicator
    function stopWaitingForSaved() {
        if (savedCheckInterval) {
            clearInterval(savedCheckInterval);
            savedCheckInterval = null;
        }
        waitingForSavedIndicator = false;
    }

    // URL Monitoring
    function startUrlMonitoring() {
        setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                isProcessing = false;
                detectPageAndRun();
            }
        }, CONFIG.TIMEOUTS.URLCHECK);

        window.addEventListener('popstate', () => {
            isProcessing = false;
            detectPageAndRun();
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            isProcessing = false;
            detectPageAndRun();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            isProcessing = false;
            detectPageAndRun();
        };
    }

    // Utilities
    const log = (...args) => {
        if (CONFIG.DEBUG) {
            const prefix = isInPopup() ? '🔸' : '🔹';
            console.log(`${prefix}`, ...args);
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
                await sleep(CONFIG.TIMEOUTS.RETRYINTERVAL);
            }
            return false;
        },
        clickSafe: async (btn, description) => {
            if (!buttonHelper.isEnabled(btn)) {
                return false;
            }
            log(`→ ${description}`);
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
        const successIndicator = assetCard.querySelector('.fabkit-Typography--intent-success');
        if (successIndicator) {
            const checkIcon = successIndicator.querySelector('.edsicon-check-circle-filled');
            const text = successIndicator.textContent.toLowerCase();
            if (checkIcon && text.includes('saved in my library')) {
                return true;
            }
        }

        const text = assetCard.textContent.toLowerCase();
        return text.includes('saved in my library') ||
               text.includes('in your library') ||
               text.includes('you own this') ||
               text.includes('in my library');
    }

    function getAllFreeAssets() {
        const assetCards = document.querySelectorAll('.fabkit-Stack-root.nTa5u2sc');
        const assets = [];

        assetCards.forEach((card) => {
            const link = card.querySelector('a[href*="listings"]');
            if (!link) return;

            const assetId = extractAssetId(link.href);
            if (!assetId) return;

            const isOwned = isAlreadyOwned(card);
            const isProcessed = state.isProcessed(assetId);
            const name = link.textContent.trim();

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
        const licenseButton = findElement.dropdown();
        if (!licenseButton) return false;

        const currentLicense = licenseButton.querySelector('.fabkit-Eyebrow-root')?.textContent?.trim().toLowerCase();

        if (currentLicense === 'professional') {
            return true;
        }

        licenseButton.click();
        await sleep(CONFIG.TIMEOUTS.DROPDOWNOPEN);

        const dropdownOptions = document.querySelectorAll('[role="option"], [role="menuitem"], li, button');
        const professionalOption = Array.from(dropdownOptions).find(option => {
            const text = option.textContent.toLowerCase();
            const isVisible = option.getBoundingClientRect().height > 0;
            return text.includes('professional') && isVisible;
        });

        if (!professionalOption) return false;

        log('→ Selecting Professional license');
        professionalOption.click();
        await sleep(CONFIG.TIMEOUTS.AFTERACTION);
        return true;
    }

    async function clickBuyNow() {
        const buyButtons = document.querySelectorAll('button.fabkit-Button-root');
        const buyButton = Array.from(buyButtons).find(btn =>
            btn.querySelector('.fabkit-Button-label')?.textContent?.trim() === 'Buy now'
        );

        if (!buyButton) return false;
        return await buttonHelper.clickSafe(buyButton, 'Buy Now');
    }

    async function clickPlaceOrder() {
        const findPlaceOrderButton = () => {
            const orderDiv = findElement.bySelector('.payment-order-confirm');
            if (orderDiv) {
                const btn = orderDiv.querySelector('button.payment-order-confirm__btn');
                if (btn) return btn;
            }
            return findElement.byText('Place Order');
        };

        const placeOrderButton = await findElement.withRetry(findPlaceOrderButton);
        if (!placeOrderButton) return false;

        const isEnabled = await buttonHelper.waitUntilEnabled(placeOrderButton);
        if (!isEnabled) return false;

        return await buttonHelper.clickSafe(placeOrderButton, 'Place Order');
    }

    // Page Handlers
    async function handleHomePage() {
        if (allAssetsCompleted) {
            console.log('\n🎉 ALL ASSETS CLAIMED!\n');
            if (state.getClaimCount() > 0) {
                state.showClaims();
            }
            return;
        }

        log(`📋 Claims: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}`);
        await sleep(1000);
        window.location.href = 'https://www.fab.com/limited-time-free';
    }

    async function handleCatalogPage() {
        stopWaitingForSaved();
        hasCompletedAssetPage = false;
        hasCompletedCheckout = false;
        isProcessing = false;

        if (!CONFIG.AUTONAVIGATE) return;

        await sleep(CONFIG.TIMEOUTS.PAGELOAD);

        const assets = getAllFreeAssets();
        if (assets.length === 0) return;

        const allOwnedOrProcessed = assets.every(a => a.owned || a.processed);

        if (allOwnedOrProcessed) {
            allAssetsCompleted = true;
            const ownedAssets = assets.filter(a => a.owned);

            console.log('\n🎉 ALL ASSETS COMPLETED!\n');
            ownedAssets.forEach((asset, i) => {
                console.log(`  ${i + 1}. ${asset.name} - ✓ In Library`);
            });

            const claimedCount = assets.filter(a => a.processed && !a.owned).length;
            if (claimedCount > 0) {
                console.log(`\n  + ${claimedCount} asset${claimedCount > 1 ? 's' : ''} claimed this month (pending library sync)`);
            }
            console.log('');
            return;
        }

        const toClaim = assets.filter(a => a.shouldClaim);

        if (toClaim.length === 0) {
            const ownedCount = assets.filter(a => a.owned).length;
            console.log('\n✓ No more assets to claim');
            console.log(`  ${ownedCount} asset${ownedCount > 1 ? 's' : ''} in Library\n`);
            return;
        }

        if (state.hasReachedLimit()) {
            console.log('\n🎉 MONTHLY LIMIT REACHED!\n');
            state.showClaims();
            return;
        }

        const firstAsset = toClaim[0];
        log(`→ Next: "${firstAsset.name}"`);
        await sleep(2000);
        window.location.href = firstAsset.url;
    }

    async function handleAssetPage() {
        const url = window.location.href;
        const assetId = extractAssetId(url);

        if (waitingForSavedIndicator) return;

        if (assetId && state.isProcessed(assetId)) {
            if (CONFIG.AUTONAVIGATE) {
                await sleep(1000);
                window.location.href = 'https://www.fab.com/limited-time-free';
            }
            return;
        }

        if (hasCompletedAssetPage) return;
        if (url.includes('quickBuyOfferId=') && url.includes('purchaseToken=')) return;
        if (isProcessing) return;

        isProcessing = true;

        if (!assetId) {
            isProcessing = false;
            return;
        }

        const assetNameElement = document.querySelector('h1.fabkit-Headline-root');
        const assetName = assetNameElement ? assetNameElement.textContent.trim() : 'Unknown Asset';
        log(`📦 Claiming: "${assetName}"`);

        currentAssetId = assetId;
        currentAssetName = assetName;

        const professionalSelected = await selectProfessionalLicense();
        if (!professionalSelected) {
            state.addClaim(assetId, assetName);
            currentAssetId = null;
            currentAssetName = null;
            if (CONFIG.AUTONAVIGATE) {
                await sleep(1000);
                window.location.href = 'https://www.fab.com/limited-time-free';
            }
            isProcessing = false;
            return;
        }

        const buyClicked = await clickBuyNow();
        if (!buyClicked) {
            state.addClaim(assetId, assetName);
            currentAssetId = null;
            currentAssetName = null;
            if (CONFIG.AUTONAVIGATE) {
                await sleep(1000);
                window.location.href = 'https://www.fab.com/limited-time-free';
            }
            isProcessing = false;
            return;
        }

        hasCompletedAssetPage = true;
        startWaitingForSaved();
    }

    async function handleCheckoutPage() {
        const url = window.location.href;

        if (url.includes('#/purchase/receipt')) {
            if (hasCompletedCheckout) {
                return;
            }
        }

        if (hasCompletedCheckout) return;
        if (isProcessing) return;

        isProcessing = true;
        await sleep(CONFIG.TIMEOUTS.CHECKOUTLOAD);

        const orderPlaced = await clickPlaceOrder();
        if (!orderPlaced) {
            isProcessing = false;
            return;
        }

        hasCompletedCheckout = true;

        if (currentAssetId && currentAssetName) {
            state.addClaim(currentAssetId, currentAssetName);
        }
    }

    // Router
    function detectPageAndRun() {
        const url = window.location.href;

        if (url.includes('/payment/web/purchase')) {
            setTimeout(handleCheckoutPage, 500);
        } else if (url.includes('listings')) {
            setTimeout(async () => {
                const dropdownReady = !!findElement.dropdown();
                const delay = dropdownReady ? 1000 : CONFIG.TIMEOUTS.INITIALWAIT;
                setTimeout(handleAssetPage, delay);
            }, 800);
        } else if (url.includes('limited-time-free')) {
            setTimeout(handleCatalogPage, 1500);
        } else if (url === 'https://www.fab.com/' || url === 'https://www.fab.com') {
            if (CONFIG.AUTONAVIGATE) {
                setTimeout(handleHomePage, 2000);
            }
        }
    }

    // Initialize
    function initialize() {
        console.log('🚀 FAB Auto-Claimer v2.1 (Clean) - Ready');
        console.log(`📋 Monthly Claims: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}\n`);

        startUrlMonitoring();
        detectPageAndRun();

        window.clearMonthlyClaims = () => {
            state.clearMonth();
            allAssetsCompleted = false;
            stopWaitingForSaved();
        };
        window.showMonthlyClaims = () => state.showClaims();

        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('📊 Show Monthly Claims', () => {
                state.showClaims();
                alert(`Monthly Claims: ${state.getClaimCount()}/${CONFIG.MONTHLY_LIMIT}\n\nCheck console for details.`);
            });

            GM_registerMenuCommand('🗑️ Clear Monthly Claims', () => {
                if (confirm('Clear all monthly claims and start over?')) {
                    state.clearMonth();
                    allAssetsCompleted = false;
                    stopWaitingForSaved();
                    alert('Cleared! Refresh to start claiming again.');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();