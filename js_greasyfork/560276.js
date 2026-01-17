// ==UserScript==
// @name         GitHub Advanced Search 
// @namespace    https://github.com/quantavil/userscript
// @version      4.2
// @description  Advanced filter modal for GitHub search 
// @match        https://github.com/*
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================================================================
       CONSTANTS & CONFIG
       ========================================================================= */
    const CONFIG = {
        ids: {
            modal: 'gh-adv-search-modal',
            style: 'gh-adv-search-style',
            toggleBtn: 'gh-adv-toggle-btn'
        },
        selectors: {
            results: '[data-testid="results-list"]',
            resultItem: '[data-testid="results-list"] > div, .repo-list-item, .Box-row',
            resultLink: '.search-title a, a[href^="/"]'
        }
    };

    const FIELDS = [
        {
            section: 'CORE',
            items: [
                {
                    id: 'type', label: 'TYPE', type: 'select', options: [
                        { v: 'repositories', l: 'Repositories' },
                        { v: 'code', l: 'Code' },
                        { v: 'issues', l: 'Issues' },
                        { v: 'pullrequests', l: 'Pull Requests' },
                        { v: 'discussions', l: 'Discussions' },
                        { v: 'users', l: 'Users' }
                    ]
                },
                {
                    id: 'sort', label: 'SORT', type: 'select', options: [
                        { v: '', l: 'Best Match' },
                        { v: 'stars', l: 'Most Stars' },
                        { v: 'forks', l: 'Most Forks' },
                        { v: 'updated', l: 'Recently Updated' }
                    ]
                }
            ]
        },
        {
            section: 'LOGIC',
            items: [
                { id: 'and', label: 'AND', placeholder: 'rust async', type: 'text' },
                { id: 'or', label: 'OR', placeholder: 'react, vue', type: 'text' },
            ]
        },
        {
            section: 'META',
            items: [
                { id: 'user', label: 'Owner', placeholder: 'facebook', meta: 'user' },
                { id: 'repo', label: 'Repository', placeholder: 'react', meta: 'repo' },
                { id: 'lang', label: 'Language', placeholder: 'python', meta: 'language' },
                { id: 'ext', label: 'Extension', placeholder: 'md', meta: 'extension' },
                { id: 'path', label: 'Path', placeholder: 'src/', meta: 'path' },
                { id: 'stars', label: 'Stars', placeholder: '>500', meta: 'stars' },
                { id: 'forks', label: 'Forks', placeholder: '>100', meta: 'forks' },
                { id: 'size', label: 'Size (KB)', placeholder: '>1000', meta: 'size' },
                { id: 'created', label: 'Created', placeholder: '>2023-01', meta: 'created' },
                { id: 'pushed', label: 'Pushed', placeholder: '>2024-01-01', meta: 'pushed' }
            ]
        }
    ];

    /* =========================================================================
       THEME & STYLES — MIMIMAL BRUTAL
       ========================================================================= */
    function injectStyles() {
        if (document.getElementById(CONFIG.ids.style)) return;

        const css = `
            /* Light theme by default */
            :root {
                --brutal-bg: #ffffff;
                --brutal-fg: #1a1a1a;
                --brutal-accent: #e11d48;
                --brutal-border: #1a1a1a;
                --brutal-muted: #6b7280;
                --brutal-shadow: 4px 4px 0 #1a1a1a;
                --brutal-font: system-ui, -apple-system, sans-serif;
            }

            /* --- Floating Toggle Button --- */
            #${CONFIG.ids.toggleBtn} {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                width: 28px;
                height: 44px;
                background: var(--brutal-fg);
                border: none;
                border-radius: 6px 0 0 6px;
                cursor: pointer;
                z-index: 9997;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.25;
                transition: opacity 0.15s, width 0.15s;
            }
            #${CONFIG.ids.toggleBtn}:hover,
            #${CONFIG.ids.toggleBtn}:focus {
                opacity: 1;
                width: 36px;
            }
            #${CONFIG.ids.toggleBtn} svg {
                width: 16px;
                height: 16px;
                fill: var(--brutal-bg);
            }
            @media (hover: none) {
                #${CONFIG.ids.toggleBtn} {
                    opacity: 0.5;
                }
            }

            /* --- Modal Panel (Right Side) --- */
            #${CONFIG.ids.modal} {
                position: fixed;
                top: 60px;
                right: 16px;
                bottom: auto;
                left: auto;
                transform: none;
                width: 420px;
                max-width: calc(100vw - 32px);
                max-height: calc(100vh - 80px);
                background: var(--brutal-bg);
                border: 2px solid var(--brutal-border);
                box-shadow: var(--brutal-shadow);
                z-index: 9999;
                display: none;
                flex-direction: column;
                font-family: var(--brutal-font);
                font-size: 13px;
            }

            #${CONFIG.ids.modal}[data-visible="true"] {
                display: flex;
                animation: brutal-slide 0.12s ease-out;
            }

            @keyframes brutal-slide {
                from { opacity: 0; transform: translateX(8px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .brutal-header {
                background: var(--brutal-border);
                color: var(--brutal-bg);
                padding: 8px 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
            }

            .brutal-close {
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                opacity: 0.7;
                font-weight: 400;
            }
            .brutal-close:hover { opacity: 1; }

            .brutal-body {
                padding: 12px;
                overflow-y: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .brutal-body::-webkit-scrollbar { display: none; }

            .brutal-section {
                margin-bottom: 12px;
            }
            .brutal-section:last-child { margin-bottom: 0; }

            .brutal-section-title {
                font-weight: 700;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: var(--brutal-muted);
                margin-bottom: 8px;
                padding-bottom: 4px;
                border-bottom: 1px solid var(--brutal-border);
            }

            .brutal-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            .brutal-grid.full { grid-template-columns: 1fr; }

            .brutal-field label {
                display: block;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 3px;
                color: var(--brutal-fg);
            }

            .brutal-input {
                width: 100%;
                background: var(--brutal-bg);
                border: 2px solid var(--brutal-border);
                padding: 6px 8px;
                color: var(--brutal-fg);
                font-family: inherit;
                font-size: 12px;
                box-sizing: border-box;
            }
            .brutal-input:focus {
                outline: none;
                border-color: var(--brutal-accent);
            }
            .brutal-input::placeholder {
                color: var(--brutal-muted);
            }

            .brutal-footer {
                padding: 10px 12px;
                border-top: 2px solid var(--brutal-border);
                display: flex;
                gap: 8px;
            }

            .brutal-btn {
                flex: 1;
                padding: 8px;
                border: 2px solid var(--brutal-border);
                background: var(--brutal-bg);
                font-family: inherit;
                font-weight: 700;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                cursor: pointer;
                color: var(--brutal-fg);
                transition: transform 0.05s, box-shadow 0.05s;
            }
            .brutal-btn:hover {
                transform: translate(-2px, -2px);
                box-shadow: 4px 4px 0 var(--brutal-border);
            }
            .brutal-btn:active {
                transform: translate(0, 0);
                box-shadow: none;
            }
            .brutal-btn.primary {
                background: var(--brutal-border);
                color: var(--brutal-bg);
            }

            /* --- Release Badge (Brutal Enhanced) --- */
            .gh-release-tag {
                display: inline-flex;
                align-items: center;
                padding: 4px 8px;
                margin-top: 6px;
                font-size: 11px;
                font-family: var(--brutal-font);
                font-weight: 700;
                border: 2px solid var(--brutal-border);
                background: var(--brutal-bg);
                color: var(--brutal-fg) !important;
                text-decoration: none !important;
                box-shadow: 2px 2px 0 var(--brutal-border);
                transition: transform 0.1s;
            }
            .gh-release-tag:hover {
                transform: translate(-1px, -1px);
                box-shadow: 3px 3px 0 var(--brutal-border);
                text-decoration: none !important;
            }
            .gh-release-tag.loading { opacity: 0.5; cursor: wait; border-style: dashed; }
            
            /* Success (Has Release) - GREEN */
            .gh-release-tag.has-release {
                color: #15803d !important;
                border-color: #15803d;
                box-shadow: 2px 2px 0 #15803d;
            }
            .gh-release-tag.has-release:hover {
                background: #f0fdf4;
                box-shadow: 3px 3px 0 #15803d;
            }

            /* Failure (No Release) - RED */
            .gh-release-tag.no-release {
                color: #b91c1c !important;
                border-color: #b91c1c;
                box-shadow: 2px 2px 0 #b91c1c;
            }
            .gh-release-tag.no-release:hover {
                background: #fef2f2;
                box-shadow: 3px 3px 0 #b91c1c;
            }

            /* --- Checkbox --- */
            .brutal-check-row {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .brutal-check {
                width: 16px;
                height: 16px;
                accent-color: var(--brutal-accent);
                cursor: pointer;
                border: 2px solid var(--brutal-border);
            }
            .brutal-check-label {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
            }

            /* --- Overlay --- */
            .brutal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(2px);
                z-index: 9998;
                display: none;
            }
            .brutal-overlay[data-visible="true"] { display: block; }

            /* Mobile responsive */
            @media (max-width: 480px) {
                #${CONFIG.ids.modal} {
                    right: 0;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    max-width: none;
                    top: auto;
                    max-height: 85vh;
                    border-left: none;
                    border-right: none;
                    border-bottom: none;
                }
            }
        `;

        const style = document.createElement('style');
        style.id = CONFIG.ids.style;
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* =========================================================================
       LOGIC: QUERY BUILDER 
       ========================================================================= */
    class QueryBuilder {
        static clean(str) {
            if (!str) return [];
            // Parse tokens respecting quotes: matches quoted strings OR non-space/comma sequences
            const matches = str.match(/("[^"]*"|[^, ]+)/g);
            return matches ? matches : [];
        }

        static buildUrl(data) {
            const parts = [];

            const andTerms = this.clean(data.and);
            if (andTerms.length) parts.push(...andTerms);

            const orTerms = this.clean(data.or);
            if (orTerms.length) {
                parts.push(orTerms.length === 1 ? orTerms[0] : `(${orTerms.join(' OR ')})`);
            }

            data.meta.forEach(m => {
                let val = m.value.trim();
                if (!val) return;
                // Auto-add >= for specific numeric fields if missing operator
                if (['stars', 'forks', 'size'].includes(m.key)) {
                    if (!val.match(/^[<>=]/) && !val.includes('..')) val = `>=${val}`;
                }
                parts.push(`${m.key}:${val}`);
            });

            const query = encodeURIComponent(parts.join(' '));
            let url = `https://github.com/search?q=${query}&type=${data.type}`;
            if (data.sort) url += `&s=${data.sort}&o=desc`;
            if (data.releasesOnly) url += '&userscript_has_release=1';

            return url;
        }

        static parseCurrent() {
            const params = new URLSearchParams(window.location.search);
            const rawQ = params.get('q') || '';
            const type = params.get('type') || '';
            const sort = params.get('s') || '';
            const releasesOnly = params.get('userscript_has_release') === '1';

            const state = { type, sort, releasesOnly, and: '', or: '', meta: {} };
            let q = rawQ;

            // 1. Extract Meta fields (key:value) - supports quoted values
            FIELDS.find(s => s.section === 'META').items.forEach(item => {
                const regex = new RegExp(`\\b${item.meta}:("[^"]*"|\\S+)`, 'gi');
                q = q.replace(regex, (match, val) => {
                    // Strip auto >= for display
                    if (['stars', 'forks', 'size'].includes(item.meta) && val.startsWith('>=')) {
                        val = val.substring(2);
                    }
                    state.meta[item.id] = val;
                    return ''; // Remove from q
                });
            });

            // 2. Extract OR groups: (a OR b)
            const orMatch = q.match(/\(([^)]+)\)/);
            if (orMatch && orMatch[1].includes(' OR ')) {
                state.or = orMatch[1].split(' OR ').join(', ');
                q = q.replace(orMatch[0], '');
            }

            // 3. Remaining is AND
            state.and = q.replace(/\s+/g, ' ').trim();

            return state;
        }
    }

    /* =========================================================================
       LOGIC: RELEASE DETECTION
       ========================================================================= */
    const CACHE_PREFIX = 'gh-release-cache-';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    function getReleaseCache(owner, repo) {
        try {
            const key = `${CACHE_PREFIX}${owner}-${repo}`;
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp > CACHE_TTL) {
                localStorage.removeItem(key);
                return null;
            }
            return data.info;
        } catch (e) {
            return null;
        }
    }

    function setReleaseCache(owner, repo, info) {
        try {
            const key = `${CACHE_PREFIX}${owner}-${repo}`;
            const data = {
                timestamp: Date.now(),
                info: info
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) { }
    }

    function formatRelativeDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    }

    function createReleaseBadge(status, data = null) {
        const badge = document.createElement('a');
        badge.className = `gh-release-tag`;

        if (status === 'checking') {
            badge.textContent = 'Checking...';
            badge.classList.add('loading');
            badge.href = '#';
            badge.onclick = (e) => e.preventDefault();
        } else if (status === 'has-release' && data) {
            const dateText = data.date ? ` (${formatRelativeDate(data.date)})` : '';
            badge.textContent = `${data.tag}${dateText}`;
            badge.href = data.url;
            badge.target = '_blank';
            badge.title = data.date ? `Released: ${new Date(data.date).toLocaleDateString()}` : data.tag;
            badge.classList.add('has-release');
        } else {
            badge.textContent = 'NO RELEASE';
            badge.classList.add('no-release');
            badge.href = '#';
            badge.onclick = (e) => e.preventDefault();
        }

        return badge;
    }

    async function fetchReleaseInfo(owner, repo) {
        const cached = getReleaseCache(owner, repo);
        if (cached) return cached;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const res = await fetch(`https://github.com/${owner}/${repo}/releases/latest`, {
                method: 'GET',
                redirect: 'follow',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.status === 404 || !res.ok) {
                setReleaseCache(owner, repo, null);
                return null;
            }

            const htmlText = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            let tag = null;
            const finalUrl = res.url;
            const tagMatch = finalUrl.match(/\/releases\/tag\/([^/?#]+)/);

            if (tagMatch) {
                tag = decodeURIComponent(tagMatch[1]);
            } else {
                const title = doc.title;
                const titleMatch = title.match(/Release (.+?) ·/);
                if (titleMatch) tag = titleMatch[1];
            }

            if (!tag) {
                const header = doc.querySelector('h1.d-inline');
                if (header) tag = header.textContent.trim();
            }

            if (!tag) return null;

            let date = null;
            const timeEl = doc.querySelector('relative-time');
            if (timeEl) {
                date = timeEl.getAttribute('datetime');
            } else {
                const anyTime = doc.querySelector('time[datetime]');
                if (anyTime) date = anyTime.getAttribute('datetime');
            }

            const info = {
                tag,
                date,
                url: `https://github.com/${owner}/${repo}/releases/tag/${encodeURIComponent(tag)}`
            };

            setReleaseCache(owner, repo, info);
            return info;

        } catch (e) {
            return null;
        }
    }

    async function processQueue(items, concurrency, task) {
        const queue = [...items];
        const workers = [];

        const worker = async () => {
            while (queue.length > 0) {
                const item = queue.shift();
                try {
                    await task(item);
                } catch (e) { }
            }
        };

        for (let i = 0; i < concurrency; i++) {
            workers.push(worker());
        }

        await Promise.all(workers);
    }

    async function processItem(item, filterOnly) {
        const link = item.querySelector(CONFIG.selectors.resultLink);
        if (!link) return;

        const path = link.getAttribute('href');
        const parts = path.split('/').filter(Boolean);
        if (parts.length < 2) return;
        const [owner, repo] = parts;

        const metaList = item.querySelector('ul');
        const insertTarget = metaList || item;

        // Container is still used to keep structure clean, but no specific asset classes needed
        const badgeContainer = document.createElement('div');
        badgeContainer.style.marginTop = '6px';

        const checkingBadge = createReleaseBadge('checking');
        badgeContainer.appendChild(checkingBadge);

        insertTarget.parentNode.insertBefore(badgeContainer, insertTarget.nextSibling);

        const releaseInfo = await fetchReleaseInfo(owner, repo);

        badgeContainer.innerHTML = '';
        if (releaseInfo) {
            const releaseBadge = createReleaseBadge('has-release', releaseInfo);
            badgeContainer.appendChild(releaseBadge);
        } else {
            if (filterOnly) {
                item.style.display = 'none';
                badgeContainer.style.display = 'none';
            } else {
                const noReleaseBadge = createReleaseBadge('no-release');
                badgeContainer.appendChild(noReleaseBadge);
            }
        }
    }

    async function processSearchResults() {
        if (!window.location.pathname.startsWith('/search')) return;

        const params = new URLSearchParams(window.location.search);
        const filterOnly = params.get('userscript_has_release') === '1';

        const allItems = Array.from(document.querySelectorAll(CONFIG.selectors.resultItem));
        const itemsToProcess = allItems.filter(item => !item.dataset.releaseProcessed);

        itemsToProcess.forEach(item => item.dataset.releaseProcessed = 'true');

        await processQueue(itemsToProcess, 3, item => processItem(item, filterOnly));
    }

    /* =========================================================================
       UI: MODAL 
       ========================================================================= */
    let modalEl = null;
    let overlayEl = null;

    function toggleModal(show) {
        if (!modalEl) createUI();
        // If show is undefined, toggle. If defined, set.
        const visible = (show === undefined) ? (modalEl.dataset.visible !== 'true') : show;

        modalEl.dataset.visible = visible;
        overlayEl.dataset.visible = visible;

        if (visible) {
            loadStateToUI();
            const firstInput = modalEl.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }
    }

    function createUI() {
        if (document.getElementById(CONFIG.ids.modal)) return;

        // Overlay
        overlayEl = document.createElement('div');
        overlayEl.className = 'brutal-overlay';
        overlayEl.onclick = () => toggleModal(false);
        document.body.appendChild(overlayEl);

        // Modal
        modalEl = document.createElement('div');
        modalEl.id = CONFIG.ids.modal;

        let html = `
            <div class="brutal-header">
                <span>FILTER</span>
                <span class="brutal-close" data-close>×</span>
            </div>
            <div class="brutal-body">
        `;

        FIELDS.forEach(section => {
            html += `<div class="brutal-section">
                <div class="brutal-section-title">${section.section}</div>
                <div class="brutal-grid ${section.items.length === 1 ? 'full' : ''}">`;

            section.items.forEach(field => {
                const dangerStyle = field.danger ? 'style="color:var(--brutal-accent)"' : '';
                html += `<div class="brutal-field">
                    <label ${dangerStyle}>${field.label}</label>
                    ${field.type === 'select'
                        ? `<select id="gh-field-${field.id}" class="brutal-input">${field.options.map(o => `<option value="${o.v}">${o.l}</option>`).join('')}</select>`
                        : `<input id="gh-field-${field.id}" type="text" class="brutal-input" placeholder="${field.placeholder || ''}">`}
                </div>`;
            });
            html += `</div></div>`;
        });

        html += `
            <div class="brutal-section">
                <div class="brutal-check-row">
                    <input type="checkbox" id="gh-field-releases" class="brutal-check">
                    <label for="gh-field-releases" class="brutal-check-label">Only with releases</label>
                </div>
            </div>
        </div>
        <div class="brutal-footer">
            <button data-clear class="brutal-btn">Clear</button>
            <button data-search class="brutal-btn primary">Search</button>
        </div>`;

        modalEl.innerHTML = html;
        document.body.appendChild(modalEl);

        // Floating toggle button
        if (!document.getElementById(CONFIG.ids.toggleBtn)) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = CONFIG.ids.toggleBtn;
            toggleBtn.type = 'button';
            toggleBtn.title = 'Search Filter';
            toggleBtn.innerHTML = `<svg viewBox="0 0 16 16"><path d="M10.68 11.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04ZM11 6.5a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z"/></svg>`;
            toggleBtn.onclick = () => toggleModal();
            document.body.appendChild(toggleBtn);
        }

        // Events
        modalEl.querySelector('[data-close]').onclick = () => toggleModal(false);
        modalEl.querySelector('[data-clear]').onclick = () => {
            modalEl.querySelectorAll('input, select').forEach(el => {
                el.type === 'checkbox' ? el.checked = false : el.value = '';
            });
        };
        modalEl.querySelector('[data-search]').onclick = executeSearch;

        // Keydown
        modalEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modalEl.dataset.visible === 'true') toggleModal(false);
        });
    }

    function loadStateToUI() {
        const state = QueryBuilder.parseCurrent();
        const setVal = (id, val) => {
            const el = document.getElementById(`gh-field-${id}`);
            if (el) el.value = val || '';
        };

        setVal('type', state.type);
        setVal('sort', state.sort);
        setVal('and', state.and);
        setVal('or', state.or);
        Object.entries(state.meta).forEach(([id, val]) => setVal(id, val));

        const relCheck = document.getElementById('gh-field-releases');
        if (relCheck) relCheck.checked = state.releasesOnly;
    }

    function executeSearch() {
        const getVal = id => document.getElementById(`gh-field-${id}`).value;
        const data = {
            type: getVal('type'),
            sort: getVal('sort'),
            and: getVal('and'),
            or: getVal('or'),
            meta: [],
            releasesOnly: document.getElementById('gh-field-releases').checked
        };

        FIELDS.find(s => s.section === 'META').items.forEach(item => {
            const val = getVal(item.id);
            if (val) data.meta.push({ key: item.meta, value: val });
        });

        window.location.href = QueryBuilder.buildUrl(data);
    }

    /* =========================================================================
       INIT
       ========================================================================= */
    function init() {
        injectStyles();
        createUI();

        // Register Menu
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand("Search Filter", () => toggleModal());
        }

        // Process existing results
        processSearchResults();

        // Observers
        let debounceTimer;
        // Watch for page changes (GitHub uses Turbo/PJAX)
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                processSearchResults();
            }, 200);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Turbo event listener for cleaner navigation handling
        document.addEventListener('turbo:render', () => {
            processSearchResults();
        });
    }

    init();

})();