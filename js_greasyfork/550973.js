// ==UserScript==
// @name         Twitter Video Popup Blocker (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Eliminates popup ads from Twitter video players - Generic version
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550973/Twitter%20Video%20Popup%20Blocker%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550973/Twitter%20Video%20Popup%20Blocker%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎯 Enhanced multi-layered defense

    // Strategy 1: Broad popup interception
    function blockPopups() {
        const originalOpen = window.open;
        window.open = function(url, name, specs) {
            // Block any suspicious external URL (generic - anything not twitter/x)
            if (url && !url.startsWith('https://twitter.com') &&
                !url.startsWith('https://x.com') &&
                !url.startsWith('https://t.co') &&  // Twitter's shortener
                url !== '_self' && url !== '_blank' && url !== '_parent') {
                console.log('🚫 Blocked generic popup:', url);
                return null;
            }
            return originalOpen.call(this, url, name, specs);
        };

        // Also block location assignments that could cause navigation
        const originalAssign = location.assign;
        location.assign = function(url) {
            if (url && !url.startsWith('https://twitter.com') &&
                !url.startsWith('https://x.com') &&
                !url.startsWith('https://t.co')) {
                console.log('🚫 Blocked navigation:', url);
                return;
            }
            return originalAssign.call(this, url);
        };
    }

    // Strategy 2: Generic promotional link removal
    function removePromotionalElements() {
        // Generic selectors for "From [site]" links
        const genericSelectors = [
            // Text-based: Any link with "From " text inside video cards
            '[data-testid="card.wrapper"] a',
            '[data-testid="card.layoutLarge.media"] ~ a',
            '[data-testid="placementTracking"] ~ a'
        ];

        genericSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                const a = element.tagName === 'A' ? element : element.closest('a');
                if (a) {
                    const text = a.textContent.trim().toLowerCase();
                    const href = a.getAttribute('href') || '';

                    // Generic detection: "From " text + external target (super broad for any advertiser)
                    if ((text.startsWith('from ') || text.includes('from ')) &&
                        (a.hasAttribute('target') || a.rel.includes('noopener') || a.rel.includes('nofollow')) &&
                        !href.startsWith('https://twitter.com') &&
                        !href.startsWith('https://x.com') &&
                        !href.startsWith('https://t.co')) {

                        // Fallback: Strip href and remove rel/target to neuter the link
                        a.removeAttribute('href');
                        a.removeAttribute('target');
                        a.setAttribute('rel', '');
                        a.style.display = 'none';  // Hide it

                        console.log('🗑️ Neutered/Removed generic promo link:', text, href);

                        // If that fails, remove entirely
                        setTimeout(() => a.remove(), 0);
                    }
                }
            });
        });

        // Also target by class patterns (your dynamic example)
        const dynamicSelectors = [
            'a.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr',
            'a.r-n6v787.r-1cwl3u0.r-16dba41.r-1loqt21'
        ];

        dynamicSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(a => {
                const text = a.textContent.trim().toLowerCase();
                if (text.startsWith('from ') && a.closest('[data-testid="card.wrapper"]')) {
                    a.removeAttribute('href');
                    a.style.display = 'none';
                    setTimeout(() => a.remove(), 0);
                    console.log('🗑️ Removed dynamic class promo link:', text);
                }
            });
        });
    }

    // Strategy 3: Enhanced click prevention in video areas
    function interceptVideoClicks() {
        document.addEventListener('click', function(event) {
            const target = event.target;

            // Broader detection of video/promoted content areas
            const videoContainer = target.closest('[data-testid="videoPlayer"]') ||
                                 target.closest('[data-testid="videoComponent"]') ||
                                 target.closest('[data-testid="card.wrapper"]') ||
                                 target.closest('[data-testid="placementTracking"]') ||
                                 target.closest('[data-testid="card.layoutLarge.media"]');

            if (videoContainer) {
                // Always allow native video controls
                const isVideoControl = target.closest('button') ||
                                     target.closest('[role="slider"]') ||
                                     target.closest('video') ||
                                     target.tagName === 'VIDEO' ||
                                     target.closest('[data-testid="scrubber"]');

                if (!isVideoControl) {
                    // Check for any promotional links in the container (even hidden)
                    const promoLinks = videoContainer.querySelectorAll('a[target="_blank"], a[rel*="noopener"], a[href*="?spot_id="], a[href*="subid="]');

                    // Also check ancestor for "From " text links
                    const ancestorPromo = videoContainer.closest('[data-testid="card.wrapper"]')?.querySelector('a')?.textContent?.trim().toLowerCase().startsWith('from ');

                    if (promoLinks.length > 0 || ancestorPromo) {
                        console.log('🛡️ Blocked click on promo video area - links detected:', promoLinks.length);
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false;
                    }

                    // Generic block: If the container has any external href that would trigger popup
                    const containerLink = videoContainer.closest('a');
                    if (containerLink) {
                        const href = containerLink.getAttribute('href') || '';
                        if (href && !href.startsWith('https://twitter.com') &&
                            !href.startsWith('https://x.com') &&
                            !href.startsWith('https://t.co') &&
                            (href.includes('=') || href.includes('?') || href.match(/https?:\/\/[^\/]+/))) {
                            console.log('🛡️ Blocked external video container click:', href);
                            event.preventDefault();
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            containerLink.removeAttribute('href');  // Disable the link
                            return false;
                        }
                    }
                }
            }
        }, true);  // Capture phase for early intervention
    }

    // Strategy 4: Supercharged dynamic handling
    function setupObservers() {
        // Immediate setup
        blockPopups();
        removePromotionalElements();
        interceptVideoClicks();

        // DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(removePromotionalElements, 50);  // Quick check after DOM loads
            });
        }

        // Window loaded (catches lazy-loaded content)
        window.addEventListener('load', () => {
            setTimeout(removePromotionalElements, 100);
        });

        // Enhanced MutationObserver - more sensitive to video/promoted additions
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {  // Element only
                            const el = node.nodeType === 1 ? node : node.querySelector?.('[data-testid="card.wrapper"], [data-testid="videoPlayer"]');
                            if (el || node.matches('[data-testid="card.wrapper"], [data-testid="videoPlayer"], [data-testid="placementTracking"]')) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                // Immediate and delayed checks for async rendering
                removePromotionalElements();
                setTimeout(removePromotionalElements, 100);
                setTimeout(removePromotionalElements, 500);  // For slower loads
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });

        // More frequent periodic cleanup (every 1s for aggressive ad hunting)
        setInterval(() => {
            removePromotionalElements();
        }, 1000);

        // Also observe for attribute changes (e.g., href added dynamically)
        const attrObserver = new MutationObserver(() => {
            removePromotionalElements();
        });
        attrObserver.observe(document.body || document.documentElement, {
            attributes: true,
            attributeFilter: ['href', 'target', 'rel'],
            subtree: true
        });
    }

    // 🚀 Fire it up
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObservers);
    } else {
        setupObservers();
    }

    console.log('✅ Enhanced Twitter Video Popup Blocker v2.0 activated! Ready for any ad site.');
})();