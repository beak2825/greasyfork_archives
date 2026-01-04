// ==UserScript==
// @name         HoloChatStats Live Chat Tracker
// @namespace    http://holochatstats.info/
// @version      1.1
// @description  Track YouTube live chat messages for HoloChatStats
// @author       HoloChatStats
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558153/HoloChatStats%20Live%20Chat%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/558153/HoloChatStats%20Live%20Chat%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('HoloChatStats Live Chat Tracker initialized');

    let parentOrigin = null;
    let observing = false;
    let processedMessages = new Set();
    let ccvObserver = null;
    let lastReportedCCV = null;


    // Determine parent origin
    function determineParentOrigin() {
        const urlParams = new URLSearchParams(window.location.search);
        const embedDomain = urlParams.get('embed_domain');

        if (!embedDomain) return null;

        if (embedDomain.includes('localhost')) {
            parentOrigin = embedDomain.includes(':') ? `http://${embedDomain}` : `http://${embedDomain}:5000`;
        } else {
            parentOrigin = embedDomain.match(/^https?:\/\//) ? embedDomain : `https://${embedDomain}`;
        }

        console.log('Parent origin:', parentOrigin);
        return parentOrigin;
    }

    parentOrigin = determineParentOrigin();

    // Notify parent that script is ready
    function notifyParent() {
        if (parentOrigin && window.parent !== window) {
            window.parent.postMessage({ type: 'HOLOCHATSTATS_SCRIPT_READY' }, parentOrigin);
        }
    }

    // Check if element is a valid chat message
    function isValidChatMessage(element) {
        if (!element || !element.tagName) return false;

        const tagName = element.tagName.toUpperCase();
        const validTags = [
            'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
            'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER',
            'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER',
            'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-REDEMPTION-ANNOUNCEMENT-RENDERER',
            'YT-LIVE-CHAT-PAID-STICKER-RENDERER'
        ];

        if (!validTags.includes(tagName)) return false;

        const hasAuthor = element.querySelector('#author-name');
        const hasMessage = element.querySelector('#message');
        const hasPurchaseAmount = element.querySelector('#purchase-amount');

        return hasAuthor || hasMessage || hasPurchaseAmount;
    }

    // Extract and send message data
    function processMessage(element) {
        if (!isValidChatMessage(element)) return;

        const tagName = element.tagName.toUpperCase();
        const authorEl = element.querySelector('#author-name');
        const messageEl = element.querySelector('#message');
        const timestampEl = element.querySelector('#timestamp');

        const author = authorEl?.textContent?.trim() || '';
        const message = messageEl?.textContent?.trim() || '';
        const timestamp = timestampEl?.textContent?.trim() || '';

        // Create content key for duplicate detection
        const contentKey = `${author}_${message}_${timestamp}_${tagName}`;

        if (processedMessages.has(contentKey)) return;
        processedMessages.add(contentKey);

        try {
            const badges = Array.from(element.querySelectorAll('[aria-label*="Member"], [aria-label*="member"], [aria-label*="Sponsor"], [aria-label*="sponsor"]'));

            const data = {
                id: contentKey,
                author: author || 'Unknown',
                message: message,
                isMember: badges.length > 0,
                badges: badges.map(b => b.getAttribute('aria-label')),
                rawTimestamp: Date.now()
            };

            // Check for SuperChat (paid message with text)
            if (tagName === 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER') {
                data.isSuperChat = true;
                data.isSuperSticker = false;
                const amountEl = element.querySelector('#purchase-amount, #purchase-amount-chip');
                data.superChatAmount = amountEl?.textContent?.trim() || '';
            }

            // Check for SuperSticker (paid sticker)
            if (tagName === 'YT-LIVE-CHAT-PAID-STICKER-RENDERER') {
                data.isSuperChat = true;
                data.isSuperSticker = true;
                // SuperStickers may have amount in different locations
                const amountEl = element.querySelector('#purchase-amount, #purchase-amount-chip, .purchase-amount');
                if (amountEl) {
                    data.superChatAmount = amountEl.textContent?.trim() || '';
                } else {
                    // Try to get from aria-label or alt text
                    const stickerEl = element.querySelector('#sticker img, #sticker-icon');
                    const ariaLabel = stickerEl?.getAttribute('aria-label') || stickerEl?.getAttribute('alt') || '';
                    // Extract amount from aria-label if present (format may vary)
                    const amountMatch = ariaLabel.match(/[\$¥€£₩][\d,]+\.?\d*/);
                    data.superChatAmount = amountMatch ? amountMatch[0] : '';
                }
            }

            // Check for membership gift redemptions
            if (tagName === 'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-REDEMPTION-ANNOUNCEMENT-RENDERER') {
                data.isMembershipGiftRedemption = true;
                // These are NOT SuperChats or memberships purchases
                data.isSuperChat = false;
                data.isMembershipPurchase = false;
            }

            // Check for new memberships / membership purchases
            if (tagName === 'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER') {
                data.isNewMember = true;
                // These are NOT SuperChats
                data.isSuperChat = false;
                data.isSuperSticker = false;
                if (element.hasAttribute('show-only-header')) {
                    data.isMembershipPurchase = true;
                }
            }

            if (data.author !== 'Unknown' || data.message || data.isSuperChat || data.isMembershipGiftRedemption || data.isNewMember) {
                if (parentOrigin && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'HOLOCHATSTATS_CHAT_MESSAGE',
                        payload: data
                    }, parentOrigin);
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    }

    // Find and process messages in a container
    function scanForMessages(container) {
        if (!container) return;

        const selectors = [
            'yt-live-chat-text-message-renderer',
            'yt-live-chat-paid-message-renderer',
            'yt-live-chat-membership-item-renderer',
            'ytd-sponsorships-live-chat-gift-redemption-announcement-renderer',
            'yt-live-chat-paid-sticker-renderer'
        ];

        container.querySelectorAll(selectors.join(', ')).forEach(msg => {
            if (isValidChatMessage(msg)) {
                processMessage(msg);
            }
        });
    }

    function startObserving() {
        if (observing) return;

        let chatContainer = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');

        if (!chatContainer) {
            const selectors = [
                '#items.yt-live-chat-item-list-renderer',
                'yt-live-chat-item-list-renderer #items',
                '#item-offset #items'
            ];

            for (const selector of selectors) {
                chatContainer = document.querySelector(selector);
                if (chatContainer) break;
            }
        }

        if (!chatContainer) {
            setTimeout(startObserving, 1000);
            return;
        }

        observing = true;
        console.log('Observing chat messages');

        // Initial scan
        scanForMessages(chatContainer);

        // Set up mutation observer
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (isValidChatMessage(node)) {
                            processMessage(node);
                        } else if (node.querySelector) {
                            scanForMessages(node);
                        }
                    }
                }
            }
        });

        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });

        notifyParent();

        // Start CCV observation
        observeCCV();
    }

    function observeCCV() {
    // Try to find the viewer count element
    const findViewerCount = () => {
        // The viewer count can appear in several places
        const selectors = [
            // Live chat viewer count
            '#view-count',
            '.view-count',
            // In the video info area (if accessible)
            '#count .view-count',
            'span.view-count',
            // Alternative selectors for different YouTube layouts
            '[class*="view-count"]',
            '#info-text span:contains("watching")',
        ];

        for (const selector of selectors) {
            try {
                const el = document.querySelector(selector);
                if (el) {
                    const text = el.textContent || '';
                    const match = text.match(/([\d,]+)/);
                    if (match) {
                        return parseInt(match[1].replace(/,/g, ''));
                    }
                }
            } catch (e) {
                // Selector might be invalid, continue
            }
        }

        return null;
    };

    // Also try to extract from page data
    const extractFromPageData = () => {
        try {
            // Look for ytInitialData or similar
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const text = script.textContent || '';

                // Look for viewer count patterns
                const patterns = [
                    /"viewCount":\s*"(\d+)"/,
                    /"originalViewCount":\s*"(\d+)"/,
                    /(\d+)\s*watching/i,
                ];

                for (const pattern of patterns) {
                    const match = text.match(pattern);
                    if (match) {
                        return parseInt(match[1]);
                    }
                }
            }
        } catch (e) {
            console.error('Error extracting CCV from page data:', e);
        }
        return null;
    };

    const reportCCV = () => {
        let ccv = findViewerCount();

        if (ccv === null) {
            ccv = extractFromPageData();
        }

        if (ccv !== null && ccv !== lastReportedCCV) {
            lastReportedCCV = ccv;

            if (parentOrigin && window.parent !== window) {
                window.parent.postMessage({
                    type: 'HOLOCHATSTATS_CCV_UPDATE',
                    ccv: ccv
                }, parentOrigin);
            }
        }
    };

    // Initial report
    setTimeout(reportCCV, 2000);

    // Set up periodic reporting
    setInterval(reportCCV, 15000);

    // Also observe DOM changes that might indicate viewer count updates
    const targetNode = document.body;
    if (targetNode && !ccvObserver) {
        ccvObserver = new MutationObserver((mutations) => {
            // Debounce the check
            clearTimeout(window.ccvDebounceTimer);
            window.ccvDebounceTimer = setTimeout(reportCCV, 1000);
        });

        ccvObserver.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
}

    // Add message listener for CCV requests
    window.addEventListener('message', function(event) {
        // Verify origin if possible
        if (event.data && event.data.type === 'HOLOCHATSTATS_REQUEST_CCV') {
            // Trigger immediate CCV report
            const findViewerCount = () => {
                const selectors = [
                    '#view-count',
                    '.view-count',
                    '#count .view-count',
                    'span.view-count',
                ];

                for (const selector of selectors) {
                    try {
                        const el = document.querySelector(selector);
                        if (el) {
                            const text = el.textContent || '';
                            const match = text.match(/([\d,]+)/);
                            if (match) {
                                return parseInt(match[1].replace(/,/g, ''));
                            }
                        }
                    } catch (e) {
                        // Continue
                    }
                }
                return null;
            };

            const ccv = findViewerCount();
            if (ccv !== null && parentOrigin && window.parent !== window) {
                window.parent.postMessage({
                    type: 'HOLOCHATSTATS_CCV_UPDATE',
                    ccv: ccv
                }, parentOrigin);
            }
        }
    });


    // Clean up periodically
    setInterval(() => {
        if (processedMessages.size > 5000) {
            processedMessages = new Set(Array.from(processedMessages).slice(-2500));
        }
    }, 60000);

    // Start observation
    setTimeout(startObserving, 1500);
    notifyParent();
})();