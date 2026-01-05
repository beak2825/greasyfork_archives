// ==UserScript==
// @name         Old Reddit Subreddit Description
// @namespace    https://reddit.com/
// @version      1.0
// @description  Injects new Reddit-style subreddit public_description into old Reddit sidebar as some subreddits don't display it.
// @match        https://old.reddit.com/r/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      reddit.com
// @connect      www.reddit.com
// @license      MIT
// @author       Mr005K
// @downloadURL https://update.greasyfork.org/scripts/561464/Old%20Reddit%20Subreddit%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/561464/Old%20Reddit%20Subreddit%20Description.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== SETTINGS ======
    const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
    const KEY_PREFIX = 'ord_desc_cache_v1:';

    // ====== HELPERS ======
    const now = () => Date.now();

    function getSubredditFromPath() {
        const m = window.location.pathname.match(/^\/r\/([^\/]+)/);
        return m ? m[1] : null;
    }

    function cacheKey(sub) {
        return KEY_PREFIX + sub.toLowerCase();
    }

    function readCache(sub) {
        try {
            const raw = localStorage.getItem(cacheKey(sub));
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed.v !== 'string' || typeof parsed.t !== 'number') return null;
            if ((now() - parsed.t) > TTL_MS) return null;
            return parsed.v;
        } catch {
            return null;
        }
    }

    function writeCache(sub, desc) {
        try {
            localStorage.setItem(cacheKey(sub), JSON.stringify({ v: desc, t: now() }));
        } catch { /* Quota exceeded */ }
    }

    function deleteCache(sub) {
        try { localStorage.removeItem(cacheKey(sub)); } catch {}
    }

    function clearAllCaches() {
        try {
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith(KEY_PREFIX)) localStorage.removeItem(k);
            });
            alert('All subreddit description caches cleared.');
        } catch {}
    }

    function gmGetJSON(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: { 'Accept': 'application/json' },
                onload: (resp) => {
                    try { resolve(JSON.parse(resp.responseText)); }
                    catch (e) { reject(e); }
                },
                onerror: (e) => reject(e),
            });
        });
    }

    // ====== UI CONSTRUCTION ======
    function buildNativeBox(desc) {
        // We use standard Reddit sidebar classes (.spacer .titlebox .md)
        // so the Subreddit's custom CSS theme automatically styles it.
        const spacer = document.createElement('div');
        spacer.id = 'ord-new-reddit-desc';
        spacer.className = 'spacer';

        const titlebox = document.createElement('div');
        titlebox.className = 'titlebox';

        const h1 = document.createElement('h1');
        // "About Community" is generic enough to fit most themes
        h1.textContent = 'About Community';

        const md = document.createElement('div');
        md.className = 'md';

        const p = document.createElement('p');
        p.textContent = desc;

        md.appendChild(p);
        titlebox.appendChild(h1);
        titlebox.appendChild(md);
        spacer.appendChild(titlebox);

        return spacer;
    }

    function insertOrReplaceBox(sidebar, box) {
        const existing = document.getElementById('ord-new-reddit-desc');
        if (existing) existing.remove();
        // Insert at the top of the sidebar for visibility
        sidebar.prepend(box);
    }

    // ====== MAIN LOGIC ======
    async function run() {
        const subreddit = getSubredditFromPath();
        if (!subreddit) return;

        const sidebar = document.querySelector('.side');
        if (!sidebar) return;

        // --- RENDER LOGIC ---
        async function render(forceRefresh = false) {
            let desc = '';

            // 1. Try Cache
            if (!forceRefresh) {
                const cached = readCache(subreddit);
                if (cached) desc = cached;
            }

            // 2. Fetch if needed
            if (!desc) {
                try {
                    const json = await gmGetJSON(`https://www.reddit.com/r/${subreddit}/about.json`);
                    const data = json && json.data;
                    desc = (data && data.public_description) ? data.public_description.trim() : '';
                    if (desc) writeCache(subreddit, desc);
                } catch (e) {
                    console.error('UserScript: Failed to load description', e);
                }
            }

            // 3. Display (only if we have content)
            if (desc) {
                const box = buildNativeBox(desc);
                insertOrReplaceBox(sidebar, box);
            }
        }

        // --- REGISTER MENU COMMANDS ---
        // These appear in the Tampermonkey/Violentmonkey extension menu
        GM_registerMenuCommand(`Refresh Description (r/${subreddit})`, () => {
            render(true);
        });

        GM_registerMenuCommand(`Clear Cache (r/${subreddit})`, () => {
            deleteCache(subreddit);
            const existing = document.getElementById('ord-new-reddit-desc');
            if (existing) existing.remove();
            alert(`Cache cleared for r/${subreddit}`);
        });

        GM_registerMenuCommand('Clear All Subreddit Caches', () => {
            clearAllCaches();
        });

        // --- INITIAL RUN ---
        render(false);
    }

    run();
})();