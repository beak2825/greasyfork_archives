// ==UserScript==
// @name         LinkedIn Exact Post Date
// @namespace    https://github.com/chr1sx
// @version      1.0.1
// @description  Show exact post dates on hover for LinkedIn posts
// @author       chr1sx
// @match        https://www.linkedin.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555671/LinkedIn%20Exact%20Post%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/555671/LinkedIn%20Exact%20Post%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract timestamp from LinkedIn post URL
    function extractTimestampFromUrl(postUrl) {
        const match = postUrl.match(/activity[:-](\d+)/);
        if (match) {
            const postId = match[1];
            
            // Convert to binary string
            const binaryStr = BigInt(postId).toString(2);
            
            // Extract first 41 bits
            const first41Bits = binaryStr.substring(0, 41);
            
            // Convert back to decimal to get milliseconds since Unix epoch
            const timestamp = parseInt(first41Bits, 2);
            
            return timestamp;
        }
        return null;
    }

    // Function to format date
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleString('en-US', options);
    }

    // Function to process time elements
    function processTimeElements() {
        // Look for all types of time/date elements
        const selectors = [
            'time',
            'span.update-components-actor__sub-description',
            'span.comment__duration-since',
            'span.comments-comment-meta__data'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Skip if already processed
                if (element.dataset.linkedinDateProcessed) return;
                
                const text = element.textContent.trim();
                
                // Extract just the time portion (before the • symbol if present)
                const timeMatch = text.match(/^\s*(\d+[smhdwyo]+)/i);
                if (!timeMatch) return;
                
                const timeText = timeMatch[1];
                
                // Try to find the post URL - prioritize closest parent first
                let postUrl = null;
                
                // Check if we're in a comment - try both logged-in and public HTML structures
                const commentArticle = element.closest('article.comments-comment-entity');
                const commentSection = element.closest('section.comment');
                
                if (commentArticle) {
                    const commentId = commentArticle.getAttribute('data-id');
                    if (commentId) {
                        // Extract comment ID from format: urn:li:comment:(ugcPost:7387159705648852992,7387168140029370368)
                        const match = commentId.match(/,(\d{19})\)/);
                        if (match) {
                            postUrl = `activity:${match[1]}`;
                        }
                    }
                } else if (commentSection) {
                    // For public view, look for semaphore link with comment URN
                    const semaphoreLink = commentSection.querySelector('a[data-semaphore-content-urn*="comment"]');
                    if (semaphoreLink) {
                        const urn = semaphoreLink.getAttribute('data-semaphore-content-urn');
                        const match = urn?.match(/,(\d{19})\)/);
                        if (match) {
                            postUrl = `activity:${match[1]}`;
                        }
                    }
                }
                
                // If not in a comment, check if we're inside any type of reshared/nested post
                if (!postUrl) {
                    const reshareContainer = element.closest('.feed-reshare-content, .update-components-mini-update-v2__reshared-content, .uNprduUKOhHAYMWYDczNkVBuaMsUpsSo');
                    if (reshareContainer) {
                        // Look for the data-attributed-urn on the reshare container
                        const attributedUrn = reshareContainer.getAttribute('data-attributed-urn');
                        if (attributedUrn) {
                            // Extract the post ID from the URN (format: urn:li:ugcPost:7384893926446440448)
                            const match = attributedUrn.match(/(\d{19})/);
                            if (match) {
                                postUrl = `activity:${match[1]}`;
                            }
                        }
                        
                        // If no data-attributed-urn, look for activity link within the reshare container
                        if (!postUrl) {
                            // Try multiple link patterns
                            const link = reshareContainer.querySelector('a[href*="/feed/update/urn:li:activity:"]') ||
                                        reshareContainer.querySelector('a.update-components-mini-update-v2__link-to-details-page');
                            if (link) {
                                const href = link.getAttribute('href');
                                const match = href.match(/activity:(\d{19})/);
                                if (match) {
                                    postUrl = `activity:${match[1]}`;
                                }
                            }
                        }
                    }
                }
                
                // If not in a reshare or no URN found, look for main post URL
                if (!postUrl) {
                    // Check for data-urn on parent elements
                    let parent = element.closest('div[data-urn]');
                    if (parent) {
                        const urn = parent.getAttribute('data-urn');
                        const match = urn?.match(/\d{19}/);
                        if (match) {
                            postUrl = `activity:${match[0]}`;
                        }
                    }
                }
                
                // Check for activity link in parent (but not inside reshare containers)
                if (!postUrl) {
                    const parent = element.closest('article, .feed-shared-update-v2, [data-id]');
                    if (parent && !parent.closest('.feed-reshare-content, .update-components-mini-update-v2__reshared-content, .uNprduUKOhHAYMWYDczNkVBuaMsUpsSo')) {
                        const link = parent.querySelector('a[href*="activity"]');
                        if (link) postUrl = link.href;
                    }
                }
                
                // Use current page URL as fallback
                if (!postUrl) {
                    postUrl = window.location.href;
                }
                
                if (postUrl) {
                    const timestamp = extractTimestampFromUrl(postUrl);
                    if (timestamp) {
                        const exactDate = formatDate(timestamp);
                        
                        // Keep original text, just add tooltip with exact date
                        element.title = exactDate;
                        element.dataset.linkedinDateProcessed = 'true';
                        element.style.cursor = 'help';
                    }
                }
            });
        });
    }

    // Run initially
    setTimeout(processTimeElements, 1000);

    // Watch for DOM changes (LinkedIn loads content dynamically)
    const observer = new MutationObserver(() => {
        processTimeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run periodically as a fallback
    setInterval(processTimeElements, 2000);
})();