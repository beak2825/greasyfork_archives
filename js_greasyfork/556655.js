// ==UserScript==
// @name		YouTube Shorts & Feed Filter for Subscriptions
// @description		Blocks YouTube Shorts except from subscribed channels and filters feed to show only subscribed content
// @version		1.0.1
// @match		https://*.youtube.com/*
// @icon		https://www.youtube.com/s/desktop/2731d6a3/img/favicon_32x32.png
// @grant		GM.xmlhttpRequest
// @grant		GM.getValue
// @grant		GM.setValue
// @connect		www.youtube.com
// @namespace https://greasyfork.org/users/1536954
// @downloadURL https://update.greasyfork.org/scripts/556655/YouTube%20Shorts%20%20Feed%20Filter%20for%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/556655/YouTube%20Shorts%20%20Feed%20Filter%20for%20Subscriptions.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('YouTube Shorts & Feed Filter: Extension started');

    // Cache for subscribed channels
    let subscribedChannels = new Set();
    let isLoadingSubscriptions = false;
    let lastSubscriptionUpdate = 0;
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

    // Debounce function to prevent excessive calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get subscribed channels from YouTube's internal API
    async function fetchSubscribedChannels() {
        if (isLoadingSubscriptions) {
            console.log('Already loading subscriptions, skipping...');
            return;
        }

        // Check cache first
        const now = Date.now();
        if (now - lastSubscriptionUpdate < CACHE_DURATION && subscribedChannels.size > 0) {
            console.log('Using cached subscriptions:', subscribedChannels.size, 'channels');
            return;
        }

        isLoadingSubscriptions = true;
        console.log('Fetching subscribed channels...');

        try {
            // Try to load from storage first
            const cachedData = await GM.getValue('subscribedChannels', null);
            const cachedTime = await GM.getValue('lastSubscriptionUpdate', 0);
            
            if (cachedData && (now - cachedTime < CACHE_DURATION)) {
                subscribedChannels = new Set(JSON.parse(cachedData));
                lastSubscriptionUpdate = cachedTime;
                console.log('Loaded', subscribedChannels.size, 'channels from storage');
                isLoadingSubscriptions = false;
                return;
            }

            // Fetch from YouTube API
            const response = await GM.xmlhttpRequest({
                method: 'GET',
                url: 'https://www.youtube.com/feed/subscriptions',
                headers: {
                    'Accept': 'text/html'
                }
            });

            if (response.status === 200) {
                // Parse the page to extract channel IDs
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                
                // Extract ytInitialData from the page
                const scripts = doc.querySelectorAll('script');
                let ytInitialData = null;
                
                for (const script of scripts) {
                    const content = script.textContent;
                    if (content.includes('var ytInitialData = ')) {
                        const match = content.match(/var ytInitialData = ({.+?});/);
                        if (match) {
                            ytInitialData = JSON.parse(match[1]);
                            break;
                        }
                    }
                }

                if (ytInitialData) {
                    extractChannelIds(ytInitialData);
                }

                // Also try to get channels from current page
                extractChannelIdsFromCurrentPage();

                // Save to storage
                await GM.setValue('subscribedChannels', JSON.stringify([...subscribedChannels]));
                await GM.setValue('lastSubscriptionUpdate', now);
                lastSubscriptionUpdate = now;

                console.log('Successfully fetched', subscribedChannels.size, 'subscribed channels');
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            // Try to extract from current page as fallback
            extractChannelIdsFromCurrentPage();
        } finally {
            isLoadingSubscriptions = false;
        }
    }

    // Extract channel IDs from ytInitialData
    function extractChannelIds(data) {
        const channelIds = new Set();
        
        function traverse(obj) {
            if (!obj || typeof obj !== 'object') return;
            
            if (obj.channelId) {
                channelIds.add(obj.channelId);
            }
            
            if (obj.browseId && obj.browseId.startsWith('UC')) {
                channelIds.add(obj.browseId);
            }

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    traverse(obj[key]);
                }
            }
        }
        
        traverse(data);
        
        channelIds.forEach(id => subscribedChannels.add(id));
        console.log('Extracted', channelIds.size, 'channel IDs from data');
    }

    // Extract channel IDs from current page DOM
    function extractChannelIdsFromCurrentPage() {
        // Look for channel links in the page
        const channelLinks = document.querySelectorAll('a[href*="/channel/"], a[href*="/@"]');
        let count = 0;
        
        channelLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                // Extract channel ID from /channel/UC... format
                const channelMatch = href.match(/\/channel\/(UC[\w-]+)/);
                if (channelMatch) {
                    subscribedChannels.add(channelMatch[1]);
                    count++;
                }
                
                // Extract from handle format /@username
                const handleMatch = href.match(/\/@([\w-]+)/);
                if (handleMatch) {
                    // Store handle as well (we'll check both)
                    subscribedChannels.add('@' + handleMatch[1]);
                    count++;
                }
            }
        });
        
        console.log('Extracted', count, 'channel IDs from current page');
    }

    // Check if a video element is from a subscribed channel
    function isFromSubscribedChannel(element) {
        // Look for channel link in the element
        const channelLink = element.querySelector('a[href*="/channel/"], a[href*="/@"]');
        
        if (channelLink) {
            const href = channelLink.getAttribute('href');
            
            // Check channel ID
            const channelMatch = href.match(/\/channel\/(UC[\w-]+)/);
            if (channelMatch && subscribedChannels.has(channelMatch[1])) {
                return true;
            }
            
            // Check handle
            const handleMatch = href.match(/\/@([\w-]+)/);
            if (handleMatch && subscribedChannels.has('@' + handleMatch[1])) {
                return true;
            }
        }
        
        return false;
    }

    // Block Shorts that are not from subscribed channels
    function blockNonSubscribedShorts() {
        // Find all Shorts elements
        const shortsSelectors = [
            'ytd-reel-item-renderer',
            'ytd-rich-item-renderer:has(a[href*="/shorts/"])',
            'ytd-grid-video-renderer:has(a[href*="/shorts/"])',
            'ytd-video-renderer:has(a[href*="/shorts/"])'
        ];

        shortsSelectors.forEach(selector => {
            const shortsElements = document.querySelectorAll(selector);
            
            shortsElements.forEach(element => {
                // Skip if already processed
                if (element.hasAttribute('data-shorts-processed')) {
                    return;
                }
                
                element.setAttribute('data-shorts-processed', 'true');
                
                // Check if from subscribed channel
                if (!isFromSubscribedChannel(element)) {
                    console.log('Blocking non-subscribed Short');
                    element.style.display = 'none';
                    element.remove();
                }
            });
        });
    }

    // Filter feed to show only subscribed content
    function filterFeedContent() {
        // Only filter on home page and feed pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && !currentPath.startsWith('/feed/')) {
            return;
        }

        // Find all video elements in the feed
        const videoSelectors = [
            'ytd-rich-item-renderer',
            'ytd-grid-video-renderer',
            'ytd-video-renderer',
            'ytd-compact-video-renderer'
        ];

        videoSelectors.forEach(selector => {
            const videoElements = document.querySelectorAll(selector);
            
            videoElements.forEach(element => {
                // Skip if already processed
                if (element.hasAttribute('data-feed-processed')) {
                    return;
                }
                
                element.setAttribute('data-feed-processed', 'true');
                
                // Check if from subscribed channel
                if (!isFromSubscribedChannel(element)) {
                    console.log('Filtering non-subscribed content from feed');
                    element.style.display = 'none';
                    element.remove();
                }
            });
        });
    }

    // Main processing function
    const processPage = debounce(() => {
        blockNonSubscribedShorts();
        filterFeedContent();
    }, 500);

    // Initialize the extension
    async function init() {
        console.log('Initializing YouTube Shorts & Feed Filter...');
        
        // Fetch subscribed channels
        await fetchSubscribedChannels();
        
        // Initial processing
        processPage();
        
        // Watch for DOM changes
        const observer = new MutationObserver(debounce((mutations) => {
            processPage();
        }, 500));
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('YouTube Shorts & Feed Filter: Initialized successfully');
        
        // Refresh subscriptions periodically
        setInterval(() => {
            fetchSubscribedChannels();
        }, CACHE_DURATION);
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();