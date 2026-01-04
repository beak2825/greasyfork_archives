// ==UserScript==
// @name         old.reddit.com regex Post Filter (Block subreddits by regex, users, block titles by regex)
// @namespace    jjenkx
// @version      1.0
// @license      MIT
// @description  Filters posts on old.reddit.com by subreddit, user, or title regex. Persistently stores all rules and hides or colors posts with minimal CPU usage.
// @match        https://old.reddit.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556726/oldredditcom%20regex%20Post%20Filter%20%28Block%20subreddits%20by%20regex%2C%20users%2C%20block%20titles%20by%20regex%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556726/oldredditcom%20regex%20Post%20Filter%20%28Block%20subreddits%20by%20regex%2C%20users%2C%20block%20titles%20by%20regex%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // The script uses color codes to highlight why a post matched a rule
    // when filters are disabled. When filters are enabled posts are hidden.
    const COLORS = {
        titleRegex: '#ff9999',
        blockedSubreddits: '#dcdcdc',
        subredditRegexList: '#ffd27f',
        blockedUsers: '#a6c8ff',
        default: ''
    };

    // Keys for persistent storage. All rule lists and state are saved through GM.setValue.
    const KEY_BLOCKED_SUBS = 'blockedSubreddits';
    const KEY_BLOCKED_USERS = 'blockedUsers';
    const KEY_SUB_REGEX_LIST = 'subredditRegexList';
    const KEY_TITLE_REGEX_LIST = 'titleRegexList';
    const KEY_FILTERS_ENABLED = 'filtersEnabled';

    // Working sets and arrays for rules. Regex lists are compiled at load for efficiency.
    let blockedSubreddits = new Set();
    let blockedUsers = new Set();
    let subredditRegexList = [];
    let titleRegexList = [];
    let compiledSubredditRegexList = [];
    let compiledTitleRegexList = [];
    let filtersEnabled = true;
    let hiddenPostCount = 0;

    // These caches store recent subreddit and user checks to avoid repeating work.
    const subCache = new Map();
    const userCache = new Map();

    let observer, postContainer;

    // Load all persistent values. Everything is read once at startup.
    const loadAll = async () => {
        const [subs, users, subRegexes, titleRegexes, enabled] = await Promise.all([
            GM.getValue(KEY_BLOCKED_SUBS, '[]'),
            GM.getValue(KEY_BLOCKED_USERS, '[]'),
            GM.getValue(KEY_SUB_REGEX_LIST, '[]'),
            GM.getValue(KEY_TITLE_REGEX_LIST, '[]'),
            GM.getValue(KEY_FILTERS_ENABLED, true)
        ]);

        blockedSubreddits = new Set(JSON.parse(subs));
        blockedUsers = new Set(JSON.parse(users));

        try { subredditRegexList = JSON.parse(subRegexes); } catch { subredditRegexList = []; }
        try { titleRegexList = JSON.parse(titleRegexes); } catch { titleRegexList = []; }

        compiledSubredditRegexList = subredditRegexList.map(compileRegexSafely).filter(Boolean);
        compiledTitleRegexList = titleRegexList.map(compileRegexSafely).filter(Boolean);
        filtersEnabled = enabled;
    };

    // Save helpers
    const save = (key, value) => GM.setValue(key, JSON.stringify([...value]));
    const saveFiltersEnabled = () => GM.setValue(KEY_FILTERS_ENABLED, filtersEnabled);

    const saveRegexList = async () => {
        await GM.setValue(KEY_SUB_REGEX_LIST, JSON.stringify(subredditRegexList));
        compiledSubredditRegexList = subredditRegexList.map(compileRegexSafely).filter(Boolean);
    };

    const saveTitleRegexList = async () => {
        await GM.setValue(KEY_TITLE_REGEX_LIST, JSON.stringify(titleRegexList));
        compiledTitleRegexList = titleRegexList.map(compileRegexSafely).filter(Boolean);
    };

    // Turns a user provided regex string into a RegExp object without throwing.
    function compileRegexSafely(src) {
        if (typeof src !== 'string' || !src.trim()) return null;
        const s = src.trim();
        try {
            const m = s.match(/^\/(.+)\/([a-z]*)$/i);
            return m ? new RegExp(m[1], m[2]) : new RegExp(s, 'i');
        } catch {
            return null;
        }
    }

    // Matches a subreddit string against the compiled regex list.
    function matchSubredditRegex(sub) {
        for (let i = 0; i < compiledSubredditRegexList.length; i++) {
            const rx = compiledSubredditRegexList[i];
            try { if (rx.test(sub)) return i; } catch {}
        }
        return -1;
    }

    // Matches a title against the compiled title regex list.
    function matchTitleRegex(title) {
        for (let i = 0; i < compiledTitleRegexList.length; i++) {
            const rx = compiledTitleRegexList[i];
            try { if (rx.test(title)) return i; } catch {}
        }
        return -1;
    }

    // Updates the counter displayed on the toggle button.
    const updateButtonCounter = () => {
        const toggle = document.querySelector('.toggle-filters-button');
        if (toggle) {
            toggle.textContent = filtersEnabled
                ? 'Disable Filters (' + hiddenPostCount + ')'
                : 'Enable Filters';
        }
    };

    // Ensures a button exists next to a subreddit or user link. The action toggles block rules.
    const ensureButton = (el, selector, text, onClick) => {
        let btn = el.parentNode.querySelector(selector);
        if (!btn) {
            btn = document.createElement('button');
            btn.className = selector.replace('.', '');
            Object.assign(btn.style, {
                marginLeft: '3px', cursor: 'pointer', fontSize: '5px', padding: '0 1px'
            });
            btn.addEventListener('click', onClick);
            el.insertAdjacentElement('afterend', btn);
        }
        btn.textContent = text;
    };

    // Applies or updates block buttons for subreddit and user for a specific post.
    function manageButtons(post, sub, subEl, user, userEl) {
        if (subEl) {
            const blocked = blockedSubreddits.has(sub);
            ensureButton(subEl, '.block-subreddit-button', blocked ? 'Unblock Sub' : 'Block Sub', async () => {
                if (blocked) {
                    blockedSubreddits.delete(sub);
                } else {
                    blockedSubreddits.add(sub);
                    post.remove();
                }
                await save(KEY_BLOCKED_SUBS, blockedSubreddits);
                queueMicrotask(() => hideAllPosts());
            });
        }

        if (userEl) {
            const blocked = blockedUsers.has(user);
            ensureButton(userEl, '.block-user-button', blocked ? 'Unblock User' : 'Block User', async () => {
                blocked ? blockedUsers.delete(user) : blockedUsers.add(user);
                await save(KEY_BLOCKED_USERS, blockedUsers);
                hideSinglePost(post);
            });
        }
    }

    // Adds a toggle button to enable or disable all filters without removing them.
    function addFilterToggleButton() {
        const menu = document.querySelector('.tabmenu');
        if (menu && !document.querySelector('.toggle-filters-button')) {
            const btn = document.createElement('button');
            btn.className = 'toggle-filters-button';
            Object.assign(btn.style, {
                marginLeft: '5px', cursor: 'pointer', fontSize: '10px', padding: '0 2px'
            });
            btn.addEventListener('click', async () => {
                filtersEnabled = !filtersEnabled;
                await saveFiltersEnabled();
                hideAllPosts();
            });
            menu.appendChild(btn);
            updateButtonCounter();
        }
    }

    // Checks if a subreddit is blocked by name or by regex. Uses cache to avoid repeats.
    function isBlockedSub(sub) {
        if (subCache.has(sub)) return subCache.get(sub);
        const idx = matchSubredditRegex(sub);
        const res = { exact: blockedSubreddits.has(sub), regexIndex: idx };
        subCache.set(sub, res);
        return res;
    }

    // Checks if a user is blocked. Uses cache.
    function isBlockedUser(user) {
        if (userCache.has(user)) return userCache.get(user);
        const res = blockedUsers.has(user);
        userCache.set(user, res);
        return res;
    }

    // This function evaluates a single post, decides if it should be hidden, colored,
    // or left alone, and applies user control buttons.
    function hideSinglePost(post) {
        const titleEl = post.querySelector('a.title');
        const subEl = post.querySelector('a.subreddit');
        const userEl = post.querySelector('a.author');
        if (!titleEl || !subEl || !userEl) return;

        const title = titleEl.textContent;
        const sub = subEl.textContent.replace('/r/', '').trim();
        const user = userEl.textContent.trim();

        const tMatchIndex = matchTitleRegex(title);
        const tMatch = tMatchIndex >= 0;
        const subRes = isBlockedSub(sub);
        const sMatch = subRes.exact;
        const rMatch = subRes.regexIndex >= 0;
        const uMatch = isBlockedUser(user);

        const shouldHide = filtersEnabled && (tMatch || sMatch || rMatch || uMatch);

        if (shouldHide) {
            if (post.style.display !== 'none') post.style.display = 'none';
            hiddenPostCount++;
        } else {
            if (post.style.display === 'none') post.style.display = '';
            let color = COLORS.default;
            if (!filtersEnabled) {
                if (tMatch) color = COLORS.titleRegex;
                else if (sMatch) color = COLORS.blockedSubreddits;
                else if (rMatch) color = COLORS.subredditRegexList;
                else if (uMatch) color = COLORS.blockedUsers;
            }
            if (post.style.backgroundColor !== color) post.style.backgroundColor = color;
            manageButtons(post, sub, subEl, user, userEl);
        }
    }

    // Reprocesses all posts in the listing and reconnects the observer afterward.
    function hideAllPosts() {
        if (observer) observer.disconnect();
        hiddenPostCount = 0;
        for (const post of document.querySelectorAll('.thing')) hideSinglePost(post);
        updateButtonCounter();
        if (observer) observePostContainer();
    }

    // Mutation observer callback. Only reacts to new post nodes, minimizing CPU usage.
    function observePostContainer() {
        postContainer = document.querySelector('#siteTable');
        if (!postContainer) return;

        observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1 && node.matches('.thing')) hideSinglePost(node);
                }
            }
        });

        observer.observe(postContainer, { childList: true, subtree: false });
    }

    // Exposes menus to modify regex lists interactively.
    function registerMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        if (window.__regexMenuBound) return;
        window.__regexMenuBound = true;

        GM_registerMenuCommand('Add Subreddit Regex', async () => {
            const input = prompt('Enter subreddit regex to add:');
            if (input === null) return;
            subredditRegexList.push(input);
            await saveRegexList();
            hideAllPosts();
        });

        GM_registerMenuCommand('List Subreddit Regexes', () => {
            alert(subredditRegexList.length
                ? subredditRegexList.map((s, i) => i + ': ' + s).join('\n')
                : '(none)');
        });

        GM_registerMenuCommand('Remove Subreddit Regex', async () => {
            if (!subredditRegexList.length) return alert('Empty list.');
            const idx = Number(prompt(subredditRegexList.map((s, i) => i + ': ' + s).join('\n')));
            if (Number.isInteger(idx) && idx >= 0 && idx < subredditRegexList.length) {
                subredditRegexList.splice(idx, 1);
                await saveRegexList();
                hideAllPosts();
                alert('Removed.');
            }
        });

        GM_registerMenuCommand('Clear All Subreddit Regexes', async () => {
            if (!subredditRegexList.length) return alert('Already empty.');
            if (!confirm('Clear all subreddit regex entries?')) return;
            subredditRegexList = [];
            await saveRegexList();
            hideAllPosts();
        });

        GM_registerMenuCommand('Add Title Regex', async () => {
            const input = prompt('Enter title regex to add:');
            if (input === null) return;
            titleRegexList.push(input);
            await saveTitleRegexList();
            hideAllPosts();
        });

        GM_registerMenuCommand('List Title Regexes', () => {
            alert(titleRegexList.length
                ? titleRegexList.map((s, i) => i + ': ' + s).join('\n')
                : '(none)');
        });

        GM_registerMenuCommand('Remove Title Regex', async () => {
            if (!titleRegexList.length) return alert('Empty list.');
            const idx = Number(prompt(titleRegexList.map((s, i) => i + ': ' + s).join('\n')));
            if (Number.isInteger(idx) && idx >= 0 && idx < titleRegexList.length) {
                titleRegexList.splice(idx, 1);
                await saveTitleRegexList();
                hideAllPosts();
                alert('Removed.');
            }
        });

        GM_registerMenuCommand('Clear All Title Regexes', async () => {
            if (!titleRegexList.length) return alert('Already empty.');
            if (!confirm('Clear all title regex entries?')) return;
            titleRegexList = [];
            await saveTitleRegexList();
            hideAllPosts();
        });
    }

    // Initialization sequence: loads state, registers menus, and sets up filtering once the page is idle.
    (async () => {
        await loadAll();
        registerMenu();
        window.addEventListener('load', () => {
            requestIdleCallback(() => {
                addFilterToggleButton();
                hideAllPosts();
                observePostContainer();
            });
        });
    })();

})();
