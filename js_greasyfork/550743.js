// ==UserScript==
// @name         Old Reddit Layout: Restore Subreddit Subscriber Count
// @namespace    https://greasyfork.org/en/users/181401-shajirr
// @version      2025.10.04
// @description  Fetches and displays the subreddit subscriber count on old Reddit layout (old.reddit.com and www.reddit.com with old layout) below the subreddit title.
// @author       Shajirr
// @match        https://old.reddit.com/r/*
// @match        https://www.reddit.com/r/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @grant        none
// @noframes
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550743/Old%20Reddit%20Layout%3A%20Restore%20Subreddit%20Subscriber%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/550743/Old%20Reddit%20Layout%3A%20Restore%20Subreddit%20Subscriber%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get cached subscriber count
    function getCachedCount(subreddit) {
        try {
            const cached = localStorage.getItem(`reddit_subs_${subreddit}`);
            if (!cached) return null;

            const { count, timestamp } = JSON.parse(cached);
            const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

            if (Date.now() - timestamp < oneDay) {
                //console.debug('Used cached value for: ', subreddit);
                return count;
            }
            // Cache expired, remove it
            localStorage.removeItem(`reddit_subs_${subreddit}`);
            //console.debug('Deleted expired cache value for: ', subreddit);
            return null;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    // Function to cache subscriber count
    function cacheCount(subreddit, count) {
        try {
            const cacheData = {
                count: count,
                timestamp: Date.now()
            };
            localStorage.setItem(`reddit_subs_${subreddit}`, JSON.stringify(cacheData));
            //console.debug('Writing cache for', subreddit, ", count: ", count);
        } catch (error) {
            console.error('Error writing cache:', error);
        }
    }

    // Function to fetch and display subscriber count
    function loadSubscriberCount() {
        // Get the current subreddit name from the URL
        const subredditMatch = window.location.pathname.match(/^\/r\/([a-z0-9_-]+)\//i);
        if (!subredditMatch) return;

        const subreddit = subredditMatch[1];

        // Check cache first
        const cachedCount = getCachedCount(subreddit);
        if (cachedCount !== null) {
            //console.debug('cachedCount value present for:', subreddit);
            updateSidebar(cachedCount.toLocaleString());
            return; // Use cached value, skip API call
        } else {
			 //console.debug('cachedCount is null for:', subreddit);
		}

        // No valid cache, fetch from API
        const apiUrl = `https://www.reddit.com/r/${subreddit}/about.json`;
        //console.debug('Using API call for: ', subreddit);

        // Fetch the data
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.data && typeof data.data.subscribers === 'number') {
                    const count_num = data.data.subscribers; // Fetch the numeric value
                    cacheCount(subreddit, count_num); // Cache the numeric value
                    const count_str = count_num.toLocaleString(); // Format with commas (e.g., 1,234,567)
                    updateSidebar(count_str);
                } else {
                    console.error('Failed to fetch subscribers:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching subreddit data:', error);
            });
    }

    // Function to update the sidebar with the count
    function updateSidebar(count) {
        //console.debug('Updating the sidebar')
        // Target the titlebox in the sidebar
        const titlebox = document.querySelector('.side .spacer .titlebox');
        if (!titlebox) return;

        // Check for existing subscribers element to avoid duplicates
        let subscriberElement = document.querySelector('.side .subscribers');

        if (!subscriberElement) {
            // Create a new <p> element for the subscriber count
            subscriberElement = document.createElement('p');
            subscriberElement.className = 'subscribers';
            subscriberElement.style.margin = '5px 0'; // Mimic original spacing
            subscriberElement.style.fontWeight = 'bold'; // Mimic original bold style

            // Find the subreddit title (<h1 class="hover redditname">) to insert after
            const title = document.querySelector('.side .spacer .titlebox h1.redditname');
            const buttons = document.querySelector('.side .spacer .titlebox .subButtons');
            if (title && buttons) {
                // Insert after the title but before the buttons
                titlebox.insertBefore(subscriberElement, buttons);
            } else if (title) {
                // Fallback: insert after the title if buttons are missing
                title.parentNode.insertBefore(subscriberElement, title.nextSibling);
            } else {
                // Fallback: insert at the top of titlebox if title is missing
                titlebox.insertBefore(subscriberElement, titlebox.firstChild);
            }
        }

        // Update the text
        subscriberElement.innerHTML = `${count} subscribers`;
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSubscriberCount);
    } else {
        loadSubscriberCount();
    }

    // Re-run on subreddit changes (e.g., infinite scroll or navigation)
    let lastSubreddit = window.location.pathname.match(/^\/r\/([a-z0-9_-]+)\//i)?.[1]; // Initialize with current subreddit
    const observer = new MutationObserver(() => {
        const currentSubreddit = window.location.pathname.match(/^\/r\/([a-z0-9_-]+)\//i)?.[1];
        if (currentSubreddit && currentSubreddit !== lastSubreddit) {
            lastSubreddit = currentSubreddit;
            // Small delay to let DOM settle
            setTimeout(loadSubscriberCount, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();