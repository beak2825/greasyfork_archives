// ==UserScript==
// @name         Instagram Distraction Free
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove Sponsored and Suggested posts from Instagram
// @author       Antigravity
// @match        *://*.instagram.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562400/Instagram%20Distraction%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/562400/Instagram%20Distraction%20Free.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[IG-Clean] v1.2 Script initialized. Hooking JSON.parse and Response.json...');

    const originalParse = JSON.parse;
    const originalResponseJson = Response.prototype.json;

    // === CONFIGURATION ===
    const DEFAULT_CONFIG = {
        removeSponsored: true,
        blurSponsored: true,      // Visual fallback if data filtering misses
        removeSuggested: true,
        blurSuggested: true,      // Visual fallback if data filtering misses
        redirectToFollowing: true,
        disableExplore: true,
        disableReels: true
    };

    let config = JSON.parse(localStorage.getItem('ig_clean_config')) || DEFAULT_CONFIG;

    function saveConfig() {
        localStorage.setItem('ig_clean_config', JSON.stringify(config));
    }

    let cleanedCount = { ads: 0, suggested: 0 };

    // === REDIRECTS ===
    const path = window.location.pathname;

    // Redirect to Following Feed
    if (config.redirectToFollowing) {
        if (path === '/' && !window.location.search) {
            console.log('[IG-Clean] Redirecting to Following feed...');
            window.location.replace('/?variant=following');
        }
    }

    // Disable Explore Page
    if (config.disableExplore) {
        if (path.startsWith('/explore/')) {
            console.log('[IG-Clean] Explore page disabled. Redirecting to home...');
            window.location.replace('/');
        }
    }

    // Disable Reels Page
    if (config.disableReels) {
        if (path.startsWith('/reels/')) {
            console.log('[IG-Clean] Reels page disabled. Redirecting to home...');
            window.location.replace('/');
        }
    }

    // === SETTINGS UI ===
    function createSettingsUI() {
        const btn = document.createElement('button');
        btn.innerText = 'IG Clean';
        btn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; background: #333; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; opacity: 0.5; font-size: 12px;';
        btn.onmouseover = () => btn.style.opacity = '1';
        btn.onmouseout = () => btn.style.opacity = '0.5';

        btn.onclick = () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center;';

            const modal = document.createElement('div');
            modal.style.cssText = 'background: white; padding: 20px; border-radius: 8px; width: 340px; color: #000000 !important; font-family: sans-serif; maxHeight: 90vh; overflowY: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';

            const title = document.createElement('h3');
            title.innerText = 'IG Distraction Free Settings';
            title.style.marginTop = '0';
            title.style.color = 'black';
            modal.appendChild(title);

            const createToggle = (key, label) => {
                const wrapper = document.createElement('div');
                wrapper.style.margin = '10px 0';
                wrapper.style.color = 'black';

                const labelEl = document.createElement('label');
                labelEl.style.cssText = 'display: flex; align-items: center; cursor: pointer; color: #000000 !important; font-size: 14px;';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = config[key];
                input.style.marginRight = '8px';
                input.onchange = (e) => {
                    config[key] = e.target.checked;
                    saveConfig();
                };

                labelEl.appendChild(input);
                labelEl.appendChild(document.createTextNode(label));
                wrapper.appendChild(labelEl);
                return wrapper;
            };

            modal.appendChild(createToggle('removeSponsored', 'Remove Sponsored (Data Filter)'));
            modal.appendChild(createToggle('blurSponsored', 'Blur Sponsored (Fallback)'));

            const sep = document.createElement('hr');
            sep.style.margin = '10px 0';
            modal.appendChild(sep);

            modal.appendChild(createToggle('removeSuggested', 'Remove Suggested (Data Filter)'));
            modal.appendChild(createToggle('blurSuggested', 'Blur Suggested (Fallback)'));

            const sep2 = document.createElement('hr');
            sep2.style.margin = '10px 0';
            modal.appendChild(sep2);

            modal.appendChild(createToggle('redirectToFollowing', 'Default to "Following" Feed'));
            modal.appendChild(createToggle('disableExplore', 'Disable Explore Page & Sidebar'));
            modal.appendChild(createToggle('disableReels', 'Disable Reels Page & Sidebar'));

            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'Close & Reload';
            closeBtn.style.cssText = 'margin-top: 15px; padding: 8px 16px; background: #0095f6; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;';
            closeBtn.onclick = () => {
                document.body.removeChild(overlay);
                window.location.reload();
            };
            modal.appendChild(closeBtn);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
        };

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSettingsUI);
    } else {
        createSettingsUI();
    }

    // === SIDEBAR HIDING ===
    function hideSidebarItems() {
        if (!config.disableExplore && !config.disableReels) return;

        const selectors = [];
        if (config.disableExplore) selectors.push('a[href="/explore/"]');
        if (config.disableReels) selectors.push('a[href="/reels/"]');

        if (selectors.length === 0) return;

        const links = document.querySelectorAll(selectors.join(', '));
        for (const link of links) {
            let container = link.closest('span[class*="html-span"]') || link.parentElement?.parentElement?.parentElement?.parentElement;
            if (!container) container = link.closest('div.x1n2onr6');

            if (container && !container.dataset.igCleanHidden) {
                container.style.display = 'none';
                container.dataset.igCleanHidden = 'true';
                console.log(`[IG-Clean] Hidden sidebar item: ${link.getAttribute('href')}`);
            }
        }
    }

    const runInitialSidebarScan = () => {
        setTimeout(hideSidebarItems, 500);
        setTimeout(hideSidebarItems, 2000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialSidebarScan);
    } else {
        runInitialSidebarScan();
    }

    const sidebarObserver = new MutationObserver((mutations) => {
        if (!sidebarObserver.scanScheduled) {
            sidebarObserver.scanScheduled = true;
            setTimeout(() => {
                hideSidebarItems();
                sidebarObserver.scanScheduled = false;
            }, 500);
        }
    });

    const startSidebarObserver = () => {
        const sidebar = document.querySelector('nav[role="navigation"]') || document.querySelector('div[role="navigation"]')?.closest('div');
        if (sidebar) {
            sidebarObserver.observe(sidebar, { childList: true, subtree: true });
            console.log('[IG-Clean] Sidebar observer started');
        } else {
            // setTimeout(startSidebarObserver, 1000); // Retry logic can be aggressive, let's keep it simple
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSidebarObserver);
    } else {
        setTimeout(startSidebarObserver, 100);
    }

    // === DATA FILTERING LOGIC (Restored from v0.6) ===

    /**
     * Filter edges array - remove edges that contain ads or suggested users
     */
    function filterEdges(edges, contextName) {
        if (!Array.isArray(edges)) return edges;

        const originalLength = edges.length;
        const filtered = edges.filter(edge => {
            if (!edge || !edge.node) return true;
            const node = edge.node;

            // Check 1: Sponsored post
            if (config.removeSponsored) {
                if (node.ad) {
                    console.log(`[IG-Clean] Removing SPONSORED post (ad_id: ${node.ad.ad_id || 'unknown'})`);
                    cleanedCount.ads++;
                    return false;
                }
                // Backup check
                if (node.media && (node.media.ad_id || node.media.is_sponsored === true || node.media.product_type === 'ad')) {
                    console.log(`[IG-Clean] Removing SPONSORED media (backup check)`);
                    cleanedCount.ads++;
                    return false;
                }
            }

            // Check 2: Suggested content
            if (config.removeSuggested) {
                if (node.suggested_users) {
                    console.log(`[IG-Clean] Removing SUGGESTED USERS card`);
                    cleanedCount.suggested++;
                    return false;
                }
                if (node.explore_story) {
                    console.log(`[IG-Clean] Removing SUGGESTED POST (explore_story)`);
                    cleanedCount.suggested++;
                    return false;
                }
            }

            return true;
        });

        if (filtered.length < originalLength) {
            console.log(`[IG-Clean] Filtered ${contextName}: ${originalLength} -> ${filtered.length} edges`);
        }

        return filtered;
    }

    /**
     * Recursively clean feed items in nested structures
     */
    function filterFeedItems(feedItems, contextName) {
        if (!Array.isArray(feedItems)) return feedItems;

        const originalLength = feedItems.length;
        const filtered = feedItems.filter(item => {
            if (!item) return true;

            if (config.removeSponsored && item.ad) {
                console.log(`[IG-Clean] Removing SPONSORED from ${contextName}`);
                cleanedCount.ads++;
                return false;
            }

            if (config.removeSuggested) {
                if (item.suggested_users) {
                    console.log(`[IG-Clean] Removing SUGGESTED from ${contextName}`);
                    cleanedCount.suggested++;
                    return false;
                }
                if (item.explore_story) {
                    console.log(`[IG-Clean] Removing SUGGESTED POST from ${contextName}`);
                    cleanedCount.suggested++;
                    return false;
                }
            }

            return true;
        });

        if (filtered.length < originalLength) {
            console.log(`[IG-Clean] Filtered ${contextName}: ${originalLength} -> ${filtered.length} items`);
        }
        return filtered;
    }

    /**
     * Recursively search and clean xdt_api__v1__feed__timeline__connection.edges
     */
    function deepCleanFeedData(obj, depth = 0, path = 'root') {
        if (!obj || typeof obj !== 'object' || depth > 10) return;

        if (obj.xdt_api__v1__feed__timeline__connection?.edges) {
            obj.xdt_api__v1__feed__timeline__connection.edges =
                filterEdges(obj.xdt_api__v1__feed__timeline__connection.edges, `Deep(${path})`);
        }

        // Check for story ads
        if (config.removeSponsored && obj.xdt_injected_story_units?.ad_media_items?.length > 0) {
            const count = obj.xdt_injected_story_units.ad_media_items.length;
            console.log(`[IG-Clean] Found ${count} story ads at path: ${path}`);
            cleanedCount.ads += count;
            obj.xdt_injected_story_units.ad_media_items = [];
        }

        if (obj.data) deepCleanFeedData(obj.data, depth + 1, path + '.data');
        if (obj.result) deepCleanFeedData(obj.result, depth + 1, path + '.result');

        if (Array.isArray(obj.require)) {
            for (let i = 0; i < obj.require.length; i++) {
                const req = obj.require[i];
                if (Array.isArray(req)) {
                    for (let j = 0; j < req.length; j++) {
                        deepCleanFeedData(req[j], depth + 1, path + `.require[${i}][${j}]`);
                    }
                }
            }
        }

        if (obj.__bbox) deepCleanFeedData(obj.__bbox, depth + 1, path + '.__bbox');
    }

    /**
     * Main cleaning function
     */
    function cleanFeedData(obj) {
        if (!obj || typeof obj !== 'object') return obj;

        deepCleanFeedData(obj);

        // Targeted paths for performance
        if (obj.data?.xdt_api__v1__feed__timeline__connection?.edges) {
            obj.data.xdt_api__v1__feed__timeline__connection.edges =
                filterEdges(obj.data.xdt_api__v1__feed__timeline__connection.edges, 'Main Feed');
        }
        if (obj.xdt_api__v1__feed__timeline__connection?.edges) {
            obj.xdt_api__v1__feed__timeline__connection.edges =
                filterEdges(obj.xdt_api__v1__feed__timeline__connection.edges, 'Feed (Pagination)');
        }

        // End of Feed Demarcator
        if (obj.data?.xdt_api__v1__feed__timeline__connection?.edges) {
            for (const edge of obj.data.xdt_api__v1__feed__timeline__connection.edges) {
                const groups = edge?.node?.end_of_feed_demarcator?.group_set?.groups;
                if (Array.isArray(groups)) {
                    for (const group of groups) {
                        if (group.feed_items) {
                            group.feed_items = filterFeedItems(group.feed_items, 'End of Feed');
                        }
                    }
                }
            }
        }

        // Story Ads
        if (config.removeSponsored && obj.data?.xdt_injected_story_units?.ad_media_items) {
            const count = obj.data.xdt_injected_story_units.ad_media_items.length;
            if (count > 0) {
                obj.data.xdt_injected_story_units.ad_media_items = [];
                cleanedCount.ads += count;
            }
        }

        // Preloaded feed in Relay cache
        if (obj.result?.data?.xdt_api__v1__feed__timeline__connection?.edges) {
            obj.result.data.xdt_api__v1__feed__timeline__connection.edges =
                filterEdges(obj.result.data.xdt_api__v1__feed__timeline__connection.edges, 'Preloaded Feed');
        }

        return obj;
    }

    // Hook JSON.parse
    JSON.parse = function (text, reviver) {
        const data = originalParse.call(JSON, text, reviver);
        try {
            if (data && typeof data === 'object') {
                cleanFeedData(data);
            }
        } catch (e) {
            console.error('[IG-Clean] Error in JSON.parse hook:', e);
        }
        return data;
    };

    // Hook Response.prototype.json
    Response.prototype.json = async function () {
        const data = await originalResponseJson.call(this);
        try {
            if (data && typeof data === 'object') {
                cleanFeedData(data);
            }
        } catch (e) {
            console.error('[IG-Clean] Error in Response.json hook:', e);
        }
        return data;
    };

    // Log stats
    setInterval(() => {
        if (cleanedCount.ads > 0 || cleanedCount.suggested > 0) {
            console.log(`[IG-Clean] Stats - Removed ${cleanedCount.ads} ads, ${cleanedCount.suggested} suggested cards`);
        }
    }, 30000);

    // === VISUAL FALLBACK ===

    // Patterns
    const sponsoredPatterns = ['Sponsored', 'Sponzorováno'];
    const suggestedPatterns = ['Suggested for you', 'Navrhované pro vás', 'Návrhy pro vás', 'Follow', 'Sledovat'];
    const buttonPatterns = ['Follow', 'Sledovat']; // must be in button

    // Inject blur CSS
    const style = document.createElement('style');
    style.textContent = `
        .ig-clean-blurred {
            filter: blur(8px) !important;
            opacity: 0.3 !important;
            pointer-events: none !important;
            transition: filter 0.3s, opacity 0.3s;
        }
        .ig-clean-blurred::before {
            content: "Filtered";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    function blurPostByElement(element, reason) {
        const article = element.closest('article');
        if (article && !article.classList.contains('ig-clean-blurred')) {
            article.classList.add('ig-clean-blurred');
            article.style.position = 'relative';
            console.log(`[IG-Clean] Blurred: ${reason}`);
            return true;
        }
        return false;
    }

    function scanForAdsInDOM() {
        if (!config.blurSponsored && !config.blurSuggested) return 0;

        const allElements = document.querySelectorAll('span, a, div[role="button"], button');
        let count = 0;

        for (const el of allElements) {
            const text = el.textContent?.trim();
            if (!text) continue;

            const isSponsored = sponsoredPatterns.includes(text);
            const isSuggested = suggestedPatterns.includes(text);

            if (isSponsored || isSuggested) {
                // Determine if we should blur based on config
                let shouldBlur = false;
                let type = '';

                if (isSponsored) {
                    shouldBlur = config.blurSponsored;
                    type = 'Sponsored';
                }

                if (isSuggested) {
                    // Refine "Follow" check
                    if (buttonPatterns.includes(text)) {
                        const isButton = el.getAttribute('role') === 'button' || el.tagName === 'BUTTON' || el.closest('[role="button"]');
                        if (!isButton) continue;
                    }
                    shouldBlur = config.blurSuggested;
                    type = 'Suggested';
                }

                if (shouldBlur) {
                    if (blurPostByElement(el, `${type} ("${text}")`)) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    const runInitialScan = () => {
        setTimeout(scanForAdsInDOM, 1500);
        setTimeout(scanForAdsInDOM, 3500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialScan);
    } else {
        runInitialScan();
    }

    const observer = new MutationObserver((mutations) => {
        if (!observer.scanScheduled) {
            observer.scanScheduled = true;
            setTimeout(() => {
                scanForAdsInDOM();
                observer.scanScheduled = false;
            }, 500);
        }
    });

    const startObserver = () => {
        const mainContainer = document.querySelector('main') || document.body;
        observer.observe(mainContainer, { childList: true, subtree: true });
        console.log('[IG-Clean] Blur fallback observer started');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        setTimeout(startObserver, 100);
    }

})();
