// ==UserScript==
// @name         LinuxDo 用户关注标签
// @namespace    https://linux.do/
// @version      1.2.0
// @description  在帖子中显示用户关注标签（互关/关注/粉丝），支持实时更新
// @author       ChiGamma
// @license      Fair License
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      linux.do
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558836/LinuxDo%20%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/558836/LinuxDo%20%E7%94%A8%E6%88%B7%E5%85%B3%E6%B3%A8%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        CACHE_DURATION: 6 * 60 * 60 * 1000, // 6 hours
        CACHE_KEY_FOLLOWING: 'linuxdo_following_cache',
        CACHE_KEY_FOLLOWERS: 'linuxdo_followers_cache',
        CACHE_KEY_TIMESTAMP: 'linuxdo_cache_timestamp',
        BADGE_CLASS: 'follower-relation-badge',
        PROCESSED_ATTR: 'data-relation-processed'
    };

    if (!/\/t\/.*?\/\d+/.test(window.location.pathname)) return;

    // ==================== Styles ====================
    // Thanks for the styles from: https://github.com/anghunk/linuxdo-scripts
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .${CONFIG.BADGE_CLASS} { display: inline-flex; align-items: center; justify-content: center; order: 1; position: relative; min-width: 36px; height: 22px; line-height: 20px; padding: 0 8px; margin-left: 8px; vertical-align: middle; color: rgba(255,255,255,.95); font-size: 14px !important; font-weight: 600; letter-spacing: .3px; text-shadow: 0 1px 1px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid rgba(0,0,0,.12); box-sizing: border-box; box-shadow: 0 1px 2px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.15); transition: all .2s cubic-bezier(.25,.46,.45,.94); overflow: hidden; z-index: 1; }
            .${CONFIG.BADGE_CLASS}::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to bottom, rgba(255,255,255,.12) 0, rgba(255,255,255,0) 100%); z-index: -1; }
            .${CONFIG.BADGE_CLASS}::after { content: ""; position: absolute; top: -50%; left: -100%; width: 40%; height: 200%; background: linear-gradient(to right, rgba(255,255,255,0) 0, rgba(255,255,255,.3) 50%, rgba(255,255,255,0) 100%); transform: rotate(25deg); z-index: 2; opacity: 0; transition: all 1.2s ease-in-out; }
            .${CONFIG.BADGE_CLASS}:hover { transform: translateY(-1px) scale(1.03); box-shadow: 0 2px 4px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.25); color: #fff; background-image: linear-gradient(135deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.08) 50%, rgba(0,0,0,.08) 51%, rgba(0,0,0,.15) 100%); }
            .${CONFIG.BADGE_CLASS}:hover::after { left: 200%; opacity: .8; }
            .${CONFIG.BADGE_CLASS}.mutual { background-color: #e67e22; background-image: linear-gradient(135deg, rgba(255,255,255,.1) 0, rgba(255,255,255,.05) 50%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1) 100%); }
            .${CONFIG.BADGE_CLASS}.following { background-color: #27ae60; background-image: linear-gradient(135deg, rgba(255,255,255,.1) 0, rgba(255,255,255,.05) 50%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1) 100%); }
            .${CONFIG.BADGE_CLASS}.follower { background-color: #9b59b6; background-image: linear-gradient(135deg, rgba(255,255,255,.1) 0, rgba(255,255,255,.05) 50%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1) 100%); }
            @media (prefers-color-scheme: dark) { .${CONFIG.BADGE_CLASS} { text-shadow: 0 1px 2px rgba(0,0,0,.25); box-shadow: 0 1px 3px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.1); } }
            @keyframes badgeFadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
            .${CONFIG.BADGE_CLASS} { animation: badgeFadeIn .3s ease-out forwards; }
            @media screen and (max-width: 768px) { .${CONFIG.BADGE_CLASS} { font-size: 10px !important; height: 18px; line-height: 16px; padding: 0 8px; margin-left: 8px; } }
        `;
        document.head.appendChild(style);
    };

    // ==================== User & Cache ====================
    const getCurrentUser = () => {
        try {
            const preloaded = document.getElementById('data-preloaded');
            if (preloaded) {
                const data = JSON.parse(preloaded.dataset.preloaded);
                if (data.currentUser) {
                    return JSON.parse(data.currentUser).username;
                }
            }
        } catch (e) {}
        return null;
    };

    const isCacheValid = () => {
        const timestamp = GM_getValue(CONFIG.CACHE_KEY_TIMESTAMP, 0);
        return (Date.now() - timestamp) < CONFIG.CACHE_DURATION;
    };

    const getCache = () => {
        if (!isCacheValid()) return null;
        return {
            following: new Set(GM_getValue(CONFIG.CACHE_KEY_FOLLOWING, [])),
            followers: new Set(GM_getValue(CONFIG.CACHE_KEY_FOLLOWERS, []))
        };
    };

    const setCache = (following, followers) => {
        GM_setValue(CONFIG.CACHE_KEY_FOLLOWING, Array.from(following));
        GM_setValue(CONFIG.CACHE_KEY_FOLLOWERS, Array.from(followers));
        GM_setValue(CONFIG.CACHE_KEY_TIMESTAMP, Date.now());
    };

    const clearCache = () => {
        GM_setValue(CONFIG.CACHE_KEY_FOLLOWING, []);
        GM_setValue(CONFIG.CACHE_KEY_FOLLOWERS, []);
        GM_setValue(CONFIG.CACHE_KEY_TIMESTAMP, 0);
    };

    GM_registerMenuCommand('🗑️ 清除缓存', clearCache);

    // ==================== API ====================
    const fetchUserList = async (url) => {
        try {
            const meta = document.querySelector('meta[name="csrf-token"]');
            const headers = {
                'X-CSRF-Token': meta ? meta.content : ''
            };

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const contentType = response.headers.get("content-type");
            if (!contentType?.includes("application/json")) {
                throw new Error("Expected JSON response");
            }

            return await response.json();
        } catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    };

    const fetchAllPages = async (baseUrl) => {
        const users = new Set();
        let offset = 0;
        const limit = 50;

        while (offset < 5000) {
            try {
                const data = await fetchUserList(`${baseUrl}?offset=${offset}&limit=${limit}`);
                const userList = Array.isArray(data) ? data :
                    (data.users || data.following_users || data.follower_users ||
                     data.following || data.followers || []);

                if (userList.length === 0) break;

                userList.forEach(item => {
                    const username = item.username || item.user?.username;
                    if (username) users.add(username.toLowerCase());
                });

                if (userList.length < limit) break;
                offset += limit;
            } catch (e) {
                if (offset === 0) throw e;
                break;
            }
        }

        return users;
    };

    const fetchRelationships = async (username) => {
        try {
            const [following, followers] = await Promise.all([
                fetchAllPages(`https://linux.do/u/${username}/follow/following.json`),
                fetchAllPages(`https://linux.do/u/${username}/follow/followers.json`)
            ]);

            setCache(following, followers);
            console.log(`[FollowerBadge] Cached ${following.size} following, ${followers.size} followers`);
            return { following, followers };
        } catch (e) {
            console.error(`[FollowerBadge] Fetch failed. Suspending fetches.`);
            GM_setValue(CONFIG.CACHE_KEY_TIMESTAMP, Date.now());
            return null;
        }
    };

    // ==================== Badge ====================
    const getRelationType = (username, following, followers) => {
        const lower = username.toLowerCase();
        const isFollowing = following.has(lower);
        const isFollower = followers.has(lower);

        if (isFollowing && isFollower) return { type: 'mutual', text: '互关' };
        if (isFollowing) return { type: 'following', text: '关注' };
        if (isFollower) return { type: 'follower', text: '粉丝' };
        return null;
    };

    const createBadge = (relation) => {
        const badge = document.createElement('span');
        badge.className = `${CONFIG.BADGE_CLASS} ${relation.type}`;
        badge.textContent = relation.text;
        badge.title = {
            'mutual': '互相关注',
            'following': '您正在关注 TA',
            'follower': 'TA 正在关注您'
        }[relation.type];
        return badge;
    };

    const extractUsername = (link) => {
        try {
            const parts = new URL(link.href).pathname.split('/');
            if (parts.length >= 3 && parts[1] === 'u') return parts[2];
        } catch (e) {}

        let username = link.textContent.trim();
        return username.startsWith('@') ? username.substring(1) : username;
    };

    const processPost = (following, followers, currentUser) => {
        document.querySelectorAll('.post-stream .topic-post').forEach(post => {
            const namesContainer = post.querySelector('.onscreen-post>.row>.topic-avatar+.topic-body .names') ||
                                   post.querySelector('.names');
            if (!namesContainer || namesContainer.querySelector(`.${CONFIG.BADGE_CLASS}`)) return;

            const link = namesContainer.querySelector('.first a') ||
                         namesContainer.querySelector('span.username a') ||
                         namesContainer.querySelector('.full-name a');
            if (!link) return;

            const username = extractUsername(link);
            if (!username || username.toLowerCase() === currentUser.toLowerCase()) return;

            const relation = getRelationType(username, following, followers);
            if (!relation) return;

            const badge = createBadge(relation);
            const ownerBadge = namesContainer.querySelector('.topic-owner-badge');
            const firstNameSpan = namesContainer.querySelector('.first.full-name');

            if (ownerBadge) {
                ownerBadge.after(badge);
            } else if (firstNameSpan) {
                firstNameSpan.after(badge);
            } else {
                const nameWrapper = link.closest('.first, .full-name, span.username');
                if (nameWrapper) {
                    nameWrapper.after(badge);
                } else {
                    namesContainer.appendChild(badge);
                }
            }
        });
    };

    // ==================== Shared State ====================
    let followingSet = new Set();
    let followersSet = new Set();
    let currentUsername = null;

    // ==================== Network Hook ====================
    const setupNetworkHook = () => {
        const handleRequest = (method, url) => {
            if (!url || typeof url !== 'string') return;

            const upMethod = method ? method.toUpperCase() : 'GET';
            const match = url.match(/\/follow\/([^\/\?]+)\.json/);

            if (match) {
                const targetUser = match[1].toLowerCase();

                if (upMethod === 'PUT' || upMethod === 'POST') {
                    followingSet.add(targetUser);
                    updateCacheFromSets();
                    refreshBadgesForUser(targetUser);
                } else if (upMethod === 'DELETE') {
                    followingSet.delete(targetUser);
                    updateCacheFromSets();
                    refreshBadgesForUser(targetUser);
                }
            }
        };

        // --- Hook window.fetch ---
        const originalFetch = window.fetch;
        window.fetch = async function(input, init) {
            const response = await originalFetch.apply(this, arguments);

            if (response.ok) {
                try {
                    let url = input instanceof Request ? input.url : input;
                    let method = init?.method || (input instanceof Request ? input.method : 'GET');
                    handleRequest(method, url);
                } catch (e) {}
            }
            return response;
        };

        // --- Hook XMLHttpRequest ---
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._hook_method = method;
            this._hook_url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
                if (this.status >= 200 && this.status < 300) {
                    handleRequest(this._hook_method, this._hook_url);
                }
            });
            return originalSend.apply(this, arguments);
        };
    };

    const updateCacheFromSets = () => {
        GM_setValue(CONFIG.CACHE_KEY_FOLLOWING, Array.from(followingSet));
        GM_setValue(CONFIG.CACHE_KEY_TIMESTAMP, Date.now());
    };

    const refreshBadgesForUser = (targetUser) => {
        const lowerTarget = targetUser.toLowerCase();

        document.querySelectorAll('.post-stream .topic-post').forEach(post => {
            const namesContainer = post.querySelector('.onscreen-post>.row>.topic-avatar+.topic-body .names') ||
                                   post.querySelector('.names');
            if (!namesContainer) return;

            const link = namesContainer.querySelector('.first a') ||
                         namesContainer.querySelector('span.username a') ||
                         namesContainer.querySelector('.full-name a');
            if (!link) return;

            const username = extractUsername(link);
            if (!username || username.toLowerCase() !== lowerTarget) return;

            const existingBadge = namesContainer.querySelector(`.${CONFIG.BADGE_CLASS}`);
            if (existingBadge) existingBadge.remove();

            const relation = getRelationType(username, followingSet, followersSet);
            if (!relation) return;

            const badge = createBadge(relation);
            const ownerBadge = namesContainer.querySelector('.topic-owner-badge');
            const firstNameSpan = namesContainer.querySelector('.first.full-name');

            if (ownerBadge) {
                ownerBadge.after(badge);
            } else if (firstNameSpan) {
                firstNameSpan.after(badge);
            } else {
                const nameWrapper = link.closest('.first, .full-name, span.username');
                if (nameWrapper) {
                    nameWrapper.after(badge);
                } else {
                    namesContainer.appendChild(badge);
                }
            }
        });
    };

    // ==================== Observer ====================
    const setupObserver = () => {
        const target = document.querySelector('#main-outlet') ||
                       document.querySelector('.post-stream') ||
                       document.body;

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                requestAnimationFrame(() => {
                    processPost(followingSet, followersSet, currentUsername);
                });
            }
        });

        observer.observe(target, { childList: true, subtree: true });
    };

    // ==================== Main ====================
    const main = async () => {
        currentUsername = getCurrentUser();
        if (!currentUsername) return;

        injectStyles();
        setupNetworkHook();

        let cache = getCache();
        if (!cache) {
            console.log('[FollowerBadge] Fetching relationships...');
            cache = await fetchRelationships(currentUsername);
            if (!cache) {
                console.error('[FollowerBadge] Failed to fetch data');
                return;
            }
        } else {
            console.log('[FollowerBadge] Using cached data.');
        }

        followingSet = cache.following;
        followersSet = cache.followers;

        processPost(followingSet, followersSet, currentUsername);
        setupObserver();
    };

    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

})();
