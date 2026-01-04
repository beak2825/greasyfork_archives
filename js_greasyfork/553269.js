// ==UserScript==
// @name         YouTube Targeted Sponsor Block
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Remove specific YouTube sponsor elements (if you can fill in those gaps feel free to edit this code~!)
// @author       dil83
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553269/YouTube%20Targeted%20Sponsor%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/553269/YouTube%20Targeted%20Sponsor%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let removedCount = 0;
    const processedAds = new WeakSet();
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            ytd-rich-item-renderer:has(ytd-ad-slot-renderer) {
                display: none !important;
            }
            ytd-ad-slot-renderer {
                display: none !important;
            }
            ytd-in-feed-ad-layout-renderer {
                display: none !important;
            }
            .ytwTopLandscapeImageLayoutViewModelHost,
            .ytwFeedAdMetadataViewModelHost,
            .ytwAdButtonViewModelHost,
            .ytwTopBannerImageTextIconButtonedLayoutViewModelHostMetadata,
            .ytwAdImageViewModelHostImageContainer {
                display: none !important;
            }
            ytd-rich-item-renderer[rendered-from-rich-grid]:has(.yt-badge-shape--ad) {
                display: none !important;
            }
            ytd-rich-item-renderer[rendered-from-rich-grid]:has([href*="googleadservices.com"]) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('YouTube Ad Blocker: CSS injected');
    }
    function removeTargetedAds() {
        let localRemoved = 0;
        const richItemsWithAdSlots = document.querySelectorAll('ytd-rich-item-renderer');
        richItemsWithAdSlots.forEach(item => {
            if (processedAds.has(item)) return;
            const adSlot = item.querySelector('ytd-ad-slot-renderer');
            if (adSlot) {
                processedAds.add(item);
                item.style.display = 'none';
                item.setAttribute('data-ad-blocked', 'true');
                requestIdleCallback(() => {
                    if (item.parentNode) {
                        item.remove();
                    }
                });
                localRemoved++;
            }
        });
        const adSlots = document.querySelectorAll('ytd-ad-slot-renderer:not([data-ad-blocked])');
        adSlots.forEach(slot => {
            if (processedAds.has(slot)) return;
            processedAds.add(slot);
            slot.setAttribute('data-ad-blocked', 'true');
            slot.style.display = 'none';
            requestIdleCallback(() => {
                if (slot.parentNode) {
                    slot.remove();
                }
            });
            localRemoved++;
        });
        const inFeedAds = document.querySelectorAll('ytd-in-feed-ad-layout-renderer:not([data-ad-blocked])');
        inFeedAds.forEach(ad => {
            if (processedAds.has(ad)) return;
            processedAds.add(ad);
            ad.setAttribute('data-ad-blocked', 'true');
            const parent = ad.closest('ytd-rich-item-renderer');
            if (parent) {
                parent.style.display = 'none';
                requestIdleCallback(() => {
                    if (parent.parentNode) {
                        parent.remove();
                    }
                });
            } else {
                ad.style.display = 'none';
                requestIdleCallback(() => {
                    if (ad.parentNode) {
                        ad.remove();
                    }
                });
            }
            localRemoved++;
        });
        const adContainers = [
            '.ytwTopLandscapeImageLayoutViewModelHost',
            '.ytwFeedAdMetadataViewModelHost',
            '.ytwAdButtonViewModelHost',
            '.ytwTopBannerImageTextIconButtonedLayoutViewModelHostMetadata',
            '.ytwAdImageViewModelHostImageContainer'
        ];
        adContainers.forEach(selector => {
            const elements = document.querySelectorAll(`${selector}:not([data-ad-blocked])`);
            elements.forEach(el => {
                if (processedAds.has(el)) return;
                processedAds.add(el);
                el.setAttribute('data-ad-blocked', 'true');
                const parent = el.closest('ytd-rich-item-renderer');
                if (parent) {
                    parent.style.display = 'none';
                    requestIdleCallback(() => {
                        if (parent.parentNode) {
                            parent.remove();
                        }
                    });
                    localRemoved++;
                }
            });
        });
        const sponsoredBadges = document.querySelectorAll('.yt-badge-shape--ad:not([data-ad-blocked]), [class*="ad-badge"]:not([data-ad-blocked])');
        sponsoredBadges.forEach(badge => {
            if (processedAds.has(badge)) return;
            processedAds.add(badge);
            badge.setAttribute('data-ad-blocked', 'true');
            const adElement = badge.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, .yt-lockup-view-model');
            if (adElement) {
                adElement.style.display = 'none';
                requestIdleCallback(() => {
                    if (adElement.parentNode) {
                        adElement.remove();
                    }
                });
                localRemoved++;
            }
        });
        const googleAdLinks = document.querySelectorAll('a[href*="googleadservices.com"]:not([data-ad-blocked]), a[href*="doubleclick.net"]:not([data-ad-blocked])');
        googleAdLinks.forEach(link => {
            if (processedAds.has(link)) return;
            processedAds.add(link);
            link.setAttribute('data-ad-blocked', 'true');
            const adElement = link.closest('ytd-rich-item-renderer, ytd-compact-video-renderer, .yt-lockup-view-model');
            if (adElement && !adElement.querySelector('ytd-channel-name, ytd-video-meta-block')) {
                adElement.style.display = 'none';
                requestIdleCallback(() => {
                    if (adElement.parentNode) {
                        adElement.remove();
                    }
                });
                localRemoved++;
            }
        });
        if (localRemoved > 0) {
            removedCount += localRemoved;
            console.log(`YouTube Ad Blocker: Removed ${localRemoved} ads (Total: ${removedCount})`);
        }
    }

    function handleVideoAdsSafely() {
        const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
        if (skipButton && skipButton.offsetParent !== null) {
            skipButton.click();
        }
    }

    let observer;
    let removalTimeout;

    function initializeObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(function(mutations) {
            let hasAdMutation = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { 
                            if (node.matches && (
                                node.matches('ytd-ad-slot-renderer, ytd-rich-item-renderer, ytd-in-feed-ad-layout-renderer, .ytwTopBannerImageTextIconButtonedLayoutViewModelHostMetadata, .ytwAdImageViewModelHostImageContainer') ||
                                node.querySelector('ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, .ytwTopBannerImageTextIconButtonedLayoutViewModelHostMetadata, .ytwAdImageViewModelHostImageContainer')
                            )) {
                                hasAdMutation = true;
                                break;
                            }
                        }
                    }
                }
                if (hasAdMutation) break;
            }
            if (hasAdMutation) {
                clearTimeout(removalTimeout);
                removalTimeout = setTimeout(() => {
                    removeTargetedAds();
                    handleVideoAdsSafely();
                }, 100);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 500);
            });
            return;
        }
        console.log('YouTube Targeted Ad Blocker v1.6 initialized');
        injectCSS();
        setTimeout(removeTargetedAds, 1000);
        setTimeout(handleVideoAdsSafely, 1500);
        setTimeout(initializeObserver, 2000);
        setInterval(removeTargetedAds, 15000);
        setInterval(handleVideoAdsSafely, 10000);
    }

    init();
})();
