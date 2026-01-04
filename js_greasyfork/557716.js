// ==UserScript==
// @name         X/Twitter Scraper (3 Months Limit & High-Res Images)
// @namespace    https://cemcoe.com
// @version      2025.10.03
// @description  Scrape tweets from a specific user on X (Twitter) for the last 3 months into a CSV file with original image quality.
// @author       cemcoe
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557716/XTwitter%20Scraper%20%283%20Months%20Limit%20%20High-Res%20Images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557716/XTwitter%20Scraper%20%283%20Months%20Limit%20%20High-Res%20Images%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Configuration constants
     * @constant
     */
    const CONFIG = {
        MAX_TWEETS: 200,
        MONTHS_LIMIT: 3,
        SCROLL_STEP: 700,   // 滚动步长
        SCROLL_DELAY: 2500, // 滚动后等待加载的时间
        ACTION_DELAY: 500,  // 点击展开后的等待时间
        SELECTORS: {
            TWEET: 'article[data-testid="tweet"]',
            TIME: 'time',
            TEXT: 'div[data-testid="tweetText"]',
            // 只选择 button 类型的 show more，过滤掉 a 标签类型的跳转链接
            SHOW_MORE: 'button[data-testid="tweet-text-show-more-link"]',
            PHOTO: '[data-testid="tweetPhoto"] img',
            STATS_GROUP: 'div[role="group"]',
            LINK: 'a[href*="/status/"]'
        }
    };

    // State management
    const state = {
        scrapedIds: new Set(),
        tweets: [],
        isRunning: true,
        xid: ''
    };

    /**
     * Utility: Sleep function for async operations
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Utility: Calculate the date 3 months ago from now
     * @returns {Date}
     */
    const getCutoffDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - CONFIG.MONTHS_LIMIT);
        return date;
    };

    /**
     * UI: Create and update the status dashboard
     * @returns {Object} Methods to update the UI
     */
    const createDashboard = () => {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '60px';
        div.style.left = '20px';
        div.style.zIndex = '9999';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        div.style.color = '#00ba7c';
        div.style.padding = '15px';
        div.style.borderRadius = '8px';
        div.style.fontFamily = 'monospace';
        div.style.fontSize = '14px';
        div.style.pointerEvents = 'none';
        div.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        div.innerHTML = 'Waiting for page load...';
        document.body.appendChild(div);

        return {
            update: (count, lastDate, status = 'Running') => {
                const dateStr = lastDate ? lastDate.toISOString().split('T')[0] : 'N/A';
                div.innerHTML = `
                    <strong>X Scraper Status: ${status}</strong><br/>
                    --------------------------<br/>
                    Collected: ${count} / ${CONFIG.MAX_TWEETS}<br/>
                    Last Date: ${dateStr}<br/>
                    Limit: 3 Months ago<br/>
                `;
            },
            finish: () => {
                div.style.color = '#1d9bf0'; // Twitter Blue
            }
        };
    };

    /**
     * Parsing: Extract metrics from aria-label
     * Example aria-label: "43 replies, 17 reposts, 214 likes, 192 bookmarks, 38080 views"
     * @param {string} label
     * @returns {Object} Stats object
     */
    const parseStats = (label) => {
        if (!label) return { replies: 0, retweets: 0, likes: 0, views: 0 };

        const extract = (key) => {
            const regex = new RegExp(`([\\d,.]+)[KMB]?\\s+${key}`, 'i');
            const match = label.match(regex);
            if (!match) return '0';

            let val = match[1].replace(/,/g, '');
            if (match[0].toUpperCase().includes('K')) val *= 1000;
            if (match[0].toUpperCase().includes('M')) val *= 1000000;

            return Math.floor(val);
        };

        return {
            replies: extract('replies'),
            retweets: extract('reposts'),
            likes: extract('likes'),
            views: extract('views')
        };
    };

    /**
     * Utility: Transform Image URL to Original Quality
     * @param {string} url
     * @returns {string}
     */
    const getOriginalImageUrl = (url) => {
        // Example: ...?format=jpg&name=900x900 -> ...?format=jpg&name=orig
        return url.replace(/name=[a-zA-Z0-9_x]+/, 'name=orig');
    };

    /**
     * Core: Process a single tweet DOM element
     * @param {HTMLElement} article
     * @returns {Promise<Object|null>} Tweet data or null if invalid/too old
     */
    const processTweet = async (article) => {
        // 1. Extract Time
        const timeEl = article.querySelector(CONFIG.SELECTORS.TIME);
        if (!timeEl) return null;
        const postDate = new Date(timeEl.getAttribute('datetime'));

        // Check cutoff date
        if (postDate < getCutoffDate()) {
            return { isTooOld: true };
        }

        // 2. Extract URL (Unique ID logic)
        const linkEl = article.querySelector(CONFIG.SELECTORS.LINK);
        const postUrl = linkEl ? linkEl.href : window.location.href;

        // Avoid duplicates
        if (state.scrapedIds.has(postUrl)) return null;
        state.scrapedIds.add(postUrl);

        // 3. Handle "Show More" for full text
        // Only selects BUTTON elements, ignores <a> links to avoid redirection
        const showMoreBtn = article.querySelector(CONFIG.SELECTORS.SHOW_MORE);

        if (showMoreBtn) {
            try {
                showMoreBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
                await sleep(300);

                showMoreBtn.focus();
                showMoreBtn.click();

                await sleep(CONFIG.ACTION_DELAY);
            } catch (e) {
                console.warn('Show more click failed', e);
            }
        }

        // 4. Extract Content
        const textEl = article.querySelector(CONFIG.SELECTORS.TEXT);
        const content = textEl ? textEl.innerText.replace(/\n/g, ' ') : '';

        // 5. Extract Images (Converted to Orig Quality)
        const imgs = Array.from(article.querySelectorAll(CONFIG.SELECTORS.PHOTO))
            .map(img => getOriginalImageUrl(img.src))
            .join('; ');

        // 6. Extract Stats
        const statsGroup = article.querySelector(CONFIG.SELECTORS.STATS_GROUP);
        const ariaLabel = statsGroup ? statsGroup.getAttribute('aria-label') : '';
        const stats = parseStats(ariaLabel);

        return {
            date: postDate.toISOString(),
            content: `"${content.replace(/"/g, '""')}"`, // Escape quotes for CSV
            images: imgs,
            url: postUrl,
            replies: stats.replies,
            retweets: stats.retweets,
            likes: stats.likes,
            views: stats.views,
            isTooOld: false
        };
    };

    /**
     * IO: Convert data to CSV and trigger download
     * @param {Array} data
     */
    const downloadCSV = (data) => {
        const headers = ['Time', 'Content', 'Images (Orig)', 'URL', 'Replies', 'Retweets', 'Likes', 'Views'];
        const rows = data.map(t =>
            [t.date, t.content, t.images, t.url, t.replies, t.retweets, t.likes, t.views].join(',')
        );
        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${state.xid || 'unknown'}_tweets.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Main Execution Loop
     */
    const main = async () => {
        const dashboard = createDashboard();

        // Get XID from URL (e.g. x.com/elonmusk -> elonmusk)
        const pathParts = window.location.pathname.split('/').filter(p => p);
        state.xid = pathParts[0] || 'user';

        console.log(`[X Scraper] Started for user: ${state.xid}`);

        while (state.isRunning) {
            const articles = document.querySelectorAll(CONFIG.SELECTORS.TWEET);

            for (const article of articles) {
                if (state.tweets.length >= CONFIG.MAX_TWEETS) {
                    console.log('[X Scraper] Max limit reached.');
                    state.isRunning = false;
                    break;
                }

                try {
                    const data = await processTweet(article);

                    if (data) {
                        if (data.isTooOld) {
                            console.log('[X Scraper] Found tweet older than 3 months. Stopping.');
                            state.isRunning = false;
                            break;
                        }

                        state.tweets.push(data);
                        console.log(`[X Scraper] Scraped: ${data.date}`);
                        dashboard.update(state.tweets.length, new Date(data.date));
                    }
                } catch (e) {
                    console.error('[X Scraper] Error processing tweet:', e);
                }
            }

            if (!state.isRunning) break;

            // Scroll down
            window.scrollBy(0, CONFIG.SCROLL_STEP);
            await sleep(CONFIG.SCROLL_DELAY);
        }

        dashboard.update(state.tweets.length, null, 'Finished! Downloading...');
        dashboard.finish();
        console.log(`[X Scraper] Finished. Total: ${state.tweets.length}`);
        downloadCSV(state.tweets);
    };

    // Initialize when page loads
    window.addEventListener('load', () => {
        setTimeout(main, 3000);
    });

})();