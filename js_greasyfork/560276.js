// ==UserScript==
// @name         GitHub Advanced Search Builder
// @namespace    https://github.com/quantavil/userscript
// @version      3.0
// @description  Advanced filter modal for GitHub search with OR/AND/NOT logic, release detection, and two-column layout.
// @author       quantavil
// @match        https://github.com/*
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/560276/GitHub%20Advanced%20Search%20Builder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MODAL_ID = 'gh-adv-search-panel';
    const RELEASE_BADGE_CLASS = 'gh-release-badge';

    // Configuration for all search fields
    const CONFIG = [
        {
            section: 'Main', fields: [
                {
                    id: 'type', label: 'Type', type: 'select', options: [
                        { v: 'repositories', l: 'Repositories' }, { v: 'code', l: 'Code' }, { v: 'issues', l: 'Issues' },
                        { v: 'pullrequests', l: 'Pull Requests' }, { v: 'discussions', l: 'Discussions' }, { v: 'users', l: 'Users' }
                    ]
                },
                {
                    id: 'sort', label: 'Sort', type: 'select', options: [
                        { v: '', l: 'Best Match' }, { v: 'stars', l: 'Most Stars' }, { v: 'forks', l: 'Most Forks' }, { v: 'updated', l: 'Recently Updated' }
                    ]
                }
            ]
        },
        {
            section: 'Query', fields: [
                { id: 'and', label: 'Includes (AND)', type: 'text', placeholder: 'rust async' },
                { id: 'or', label: 'One of (OR)', type: 'text', placeholder: 'api, library', map: 'OR' },
                { id: 'not', label: 'Exclude (NOT)', type: 'text', placeholder: 'deprecated', map: 'NOT', labelColor: 'var(--fgColor-danger, #cf222e)' },
            ]
        },
        {
            section: 'Metadata', fields: [
                { id: 'user', label: 'User/Org', type: 'text', placeholder: 'facebook', meta: 'user' },
                { id: 'repo', label: 'Repository', type: 'text', placeholder: 'react', meta: 'repo' },
                { id: 'lang', label: 'Language', type: 'text', placeholder: 'python', meta: 'language' },
                { id: 'ext', label: 'Extension', type: 'text', placeholder: 'md', meta: 'extension' },
                { id: 'path', label: 'Path', type: 'text', placeholder: 'src/', meta: 'path' },
            ]
        },
        {
            section: 'Stats', fields: [
                { id: 'stars', label: 'Stars >=', type: 'number', meta: 'stars' },
                { id: 'forks', label: 'Forks >=', type: 'number', meta: 'forks' },
                { id: 'size', label: 'Size (KB)', type: 'text', placeholder: '>1000', meta: 'size' },
                { id: 'created', label: 'Created', type: 'text', placeholder: '>2023-01', meta: 'created' },
                { id: 'pushed', label: 'Pushed', type: 'text', placeholder: '>2024-01', meta: 'pushed' },
            ]
        }
    ];

    function injectGlobalStyles() {
        const styleId = 'gh-adv-global-styles';
        if (document.getElementById(styleId)) return;

        const css = `
            /* Release badge styles - minimal, no layout changes */
            .${RELEASE_BADGE_CLASS} {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                margin-top: 8px;
                text-decoration: none !important;
                transition: all 0.15s ease;
            }
            
            .${RELEASE_BADGE_CLASS}.has-release {
                background: linear-gradient(135deg, #238636 0%, #2ea043 100%);
                color: #fff !important;
            }
            
            .${RELEASE_BADGE_CLASS}.has-release:hover {
                background: linear-gradient(135deg, #2ea043 0%, #3fb950 100%);
                transform: translateY(-1px);
            }
            
            .${RELEASE_BADGE_CLASS}.no-release {
                background: var(--bgColor-danger-muted, #ffebe9);
                color: var(--fgColor-danger, #cf222e) !important;
                border: 1px solid var(--borderColor-danger-muted, #ffcecb);
            }
            
            .${RELEASE_BADGE_CLASS}.checking {
                background: var(--bgColor-muted, #f6f8fa);
                color: var(--fgColor-muted, #656d76) !important;
                border: 1px solid var(--borderColor-muted, #d8dee4);
            }
            
            .${RELEASE_BADGE_CLASS} svg {
                width: 14px;
                height: 14px;
                flex-shrink: 0;
            }
            
            /* Spinner animation */
            @keyframes gh-release-spin {
                to { transform: rotate(360deg); }
            }
            
            .${RELEASE_BADGE_CLASS}.checking svg {
                animation: gh-release-spin 1s linear infinite;
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createPanel() {
        if (document.getElementById(MODAL_ID)) return;

        const panel = document.createElement('div');
        panel.id = MODAL_ID;

        const css = `
            #${MODAL_ID} {
                position: fixed;
                top: 70px;
                right: 20px;
                width: 320px;
                max-height: calc(100vh - 100px);
                background-color: var(--bgColor-default, #fff);
                border: 1px solid var(--borderColor-default, #d0d7de);
                border-radius: 12px;
                box-shadow: var(--shadow-large, 0 8px 24px rgba(140,149,159,0.2));
                z-index: 9999;
                display: none;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                overflow: hidden;
                backdrop-filter: blur(8px);
                animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            #${MODAL_ID} .panel-header {
                padding: 12px 16px;
                background: var(--bgColor-muted, #f6f8fa);
                border-bottom: 1px solid var(--borderColor-muted, #d8dee4);
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                font-size: 14px;
            }
            #${MODAL_ID} .panel-body {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
                scrollbar-width: thin;
            }
            #${MODAL_ID} .form-section {
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid var(--borderColor-muted, #d8dee4);
            }
            #${MODAL_ID} .form-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            #${MODAL_ID} .section-title {
                font-size: 11px;
                text-transform: uppercase;
                color: var(--fgColor-muted, #656d76);
                margin-bottom: 8px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            #${MODAL_ID} .form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            #${MODAL_ID} .form-grid.single {
                grid-template-columns: 1fr;
            }
            #${MODAL_ID} .input-group {
                margin-bottom: 8px;
            }
            #${MODAL_ID} label {
                display: block;
                font-size: 12px;
                margin-bottom: 4px;
                color: var(--fgColor-default, #24292f);
                font-weight: 500;
            }
            #${MODAL_ID} input, #${MODAL_ID} select {
                width: 100%;
                padding: 6px 10px;
                font-size: 13px;
                border: 1px solid var(--borderColor-default, #d0d7de);
                border-radius: 6px;
                background: var(--bgColor-default, #fff);
                color: var(--fgColor-default, #24292f);
                transition: all 0.2s ease;
                box-sizing: border-box;
            }
            #${MODAL_ID} input:focus, #${MODAL_ID} select:focus {
                border-color: var(--color-accent-fg, #0969da);
                box-shadow: 0 0 0 3px var(--color-accent-subtle, rgba(9,105,218,0.3));
                outline: none;
            }
            #${MODAL_ID} .panel-footer {
                padding: 12px 16px;
                border-top: 1px solid var(--borderColor-muted, #d8dee4);
                background: var(--bgColor-muted, #f6f8fa);
                display: flex;
                gap: 8px;
            }
            #${MODAL_ID} .btn {
                flex: 1;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                border: 1px solid;
                text-align: center;
            }
            #${MODAL_ID} .btn-primary {
                background: var(--color-success-emphasis, #2da44e);
                color: white;
                border-color: var(--color-success-emphasis, #2da44e);
            }
            #${MODAL_ID} .btn-secondary {
                background: var(--bgColor-default, #fff);
                color: var(--fgColor-default, #24292f);
                border-color: var(--borderColor-default, #d0d7de);
            }
            #${MODAL_ID} .close-icon {
                cursor: pointer;
                color: var(--fgColor-muted);
                padding: 4px;
                border-radius: 4px;
            }
            #${MODAL_ID} .close-icon:hover {
                background: var(--bgColor-muted);
            }
            #${MODAL_ID} .checkbox-group {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
            }
            #${MODAL_ID} input[type="checkbox"] {
                width: auto;
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        // Generate Form HTML with two-column grids
        let formInfo = '';
        CONFIG.forEach(section => {
            const isSingleColumn = section.section === 'Query';
            formInfo += `<div class="form-section"><div class="section-title">${section.section}</div><div class="form-grid ${isSingleColumn ? 'single' : ''}">`;
            section.fields.forEach(f => {
                const labelStyle = f.labelColor ? `style="color:${f.labelColor}"` : '';
                formInfo += `
                    <div class="input-group">
                        <label for="gh-adv-${f.id}" ${labelStyle}>${f.label}</label>
                        ${f.type === 'select' ?
                        `<select id="gh-adv-${f.id}">${f.options.map(o => `<option value="${o.v}">${o.l}</option>`).join('')}</select>` :
                        `<input type="${f.type}" id="gh-adv-${f.id}" placeholder="${f.placeholder || ''}" />`
                    }
                    </div>
                `;
            });
            formInfo += `</div></div>`;
        });

        panel.innerHTML = `
            <div class="panel-header">
                <span>Search Builder</span>
                <div class="close-icon" id="${MODAL_ID}-close">✕</div>
            </div>
            <div class="panel-body">
                ${formInfo}
                <div class="form-section">
                     <div class="checkbox-group">
                        <input type="checkbox" id="gh-adv-release">
                        <label for="gh-adv-release" style="margin:0; cursor:pointer">Only show with releases</label>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                <button class="btn btn-secondary" id="${MODAL_ID}-clear">Clear</button>
                <button class="btn btn-primary" id="${MODAL_ID}-search">Search</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Event Listeners
        document.getElementById(`${MODAL_ID}-close`).onclick = togglePanel;
        document.getElementById(`${MODAL_ID}-clear`).onclick = clearFields;
        document.getElementById(`${MODAL_ID}-search`).onclick = executeSearch;

        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeSearch();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.style.display === 'flex') togglePanel();
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') togglePanel();
        });
    }

    function togglePanel() {
        let panel = document.getElementById(MODAL_ID);
        if (!panel) {
            createPanel();
            panel = document.getElementById(MODAL_ID);
        }
        const isOpen = panel.style.display === 'flex';
        panel.style.display = isOpen ? 'none' : 'flex';

        if (!isOpen) {
            populateFields();
            const firstInput = panel.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    function clearFields() {
        CONFIG.forEach(s => s.fields.forEach(f => {
            const el = document.getElementById(`gh-adv-${f.id}`);
            if (el) el.value = '';
        }));
        document.getElementById('gh-adv-release').checked = false;
    }

    function populateFields() {
        const params = new URLSearchParams(window.location.search);
        let q = params.get('q') || '';
        const type = params.get('type');
        const sort = params.get('s');

        clearFields();

        if (type) document.getElementById('gh-adv-type').value = type;
        if (sort) document.getElementById('gh-adv-sort').value = sort;
        if (params.get('userscript_has_release') === '1') {
            document.getElementById('gh-adv-release').checked = true;
        }

        CONFIG.forEach(s => s.fields.forEach(f => {
            if (f.meta) {
                const regex = new RegExp(`${f.meta}:(\\S+)`, 'i');
                const match = q.match(regex);
                if (match) {
                    let val = match[1];
                    if (f.meta === 'stars' || f.meta === 'forks') val = val.replace('>=', '');
                    document.getElementById(`gh-adv-${f.id}`).value = val;
                    q = q.replace(match[0], '');
                }
            }
        }));

        const orMatch = q.match(/\(([^)]+ OR [^)]+)\)/i);
        if (orMatch) {
            document.getElementById('gh-adv-or').value = orMatch[1].replace(/\s+OR\s+/gi, ', ');
            q = q.replace(orMatch[0], '');
        }

        const nots = [];
        q = q.replace(/-(\S+)/g, (_, term) => {
            nots.push(term);
            return '';
        });
        if (nots.length) document.getElementById('gh-adv-not').value = nots.join(', ');

        const andVal = q.trim().replace(/\s+/g, ' ');
        if (andVal) document.getElementById('gh-adv-and').value = andVal;
    }

    function executeSearch() {
        const parts = [];
        const getValue = (id) => document.getElementById(`gh-adv-${id}`).value.trim();

        const valAnd = getValue('and');
        if (valAnd) parts.push(valAnd);

        const valOr = getValue('or');
        if (valOr) {
            const terms = valOr.split(/[\s,]+/).filter(Boolean);
            if (terms.length > 1) parts.push(`(${terms.join(' OR ')})`);
            else if (terms.length === 1) parts.push(terms[0]);
        }

        const valNot = getValue('not');
        if (valNot) {
            valNot.split(/[\s,]+/).filter(Boolean).forEach(t => parts.push(`-${t}`));
        }

        CONFIG.forEach(s => s.fields.forEach(f => {
            if (f.meta) {
                let val = getValue(f.id);
                if (val) {
                    if ((f.meta === 'stars' || f.meta === 'forks') && !val.match(/[<>=]/)) val = `>=${val}`;
                    parts.push(`${f.meta}:${val}`);
                }
            }
        }));

        const type = getValue('type');
        const sort = getValue('sort');
        const hasRelease = document.getElementById('gh-adv-release').checked;

        let url = `https://github.com/search?q=${encodeURIComponent(parts.join(' '))}&type=${type}`;
        if (sort) url += `&s=${sort}&o=desc`;
        if (hasRelease) url += '&userscript_has_release=1';

        window.location.href = url;
    }

    // --- Release Detection & Badge System ---

    const SVG_ICONS = {
        tag: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path></svg>`,
        x: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg>`,
        spinner: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 1 0 7 7A7.008 7.008 0 0 0 8 1Zm0 12.5A5.5 5.5 0 1 1 13.5 8 5.506 5.506 0 0 1 8 13.5Z" opacity="0.3"></path><path d="M8 1v1.5A5.506 5.506 0 0 1 13.5 8H15a7.008 7.008 0 0 0-7-7Z"></path></svg>`
    };

    // --- Caching System ---
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
        } catch (e) {
            // Storage full or other error, ignore
        }
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
        badge.className = `${RELEASE_BADGE_CLASS} ${status}`;

        if (status === 'checking') {
            badge.innerHTML = `${SVG_ICONS.spinner} <span>Checking...</span>`;
            badge.href = '#';
            badge.onclick = (e) => e.preventDefault();
        } else if (status === 'has-release' && data) {
            const dateText = data.date ? ` • ${formatRelativeDate(data.date)}` : '';
            badge.innerHTML = `${SVG_ICONS.tag} <span>${data.tag}${dateText}</span>`;
            badge.href = data.url;
            badge.target = '_blank';
            badge.title = data.date ? `Released: ${new Date(data.date).toLocaleDateString()}` : data.tag;
        } else {
            badge.innerHTML = `${SVG_ICONS.x} <span>No releases</span>`;
            badge.href = '#';
            badge.onclick = (e) => e.preventDefault();
        }

        return badge;
    }

    async function fetchReleaseInfo(owner, repo) {
        // Check cache first
        const cached = getReleaseCache(owner, repo);
        if (cached) return cached;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const res = await fetch(`https://github.com/${owner}/${repo}/releases/latest`, {
                method: 'GET',
                redirect: 'follow',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.status === 404 || !res.ok) {
                setReleaseCache(owner, repo, null); // Cache absence of release
                return null;
            }

            const htmlText = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // 1. Try to find the tag
            // URL might be .../releases/tag/v1.0.0
            let tag = null;
            const finalUrl = res.url;
            const tagMatch = finalUrl.match(/\/releases\/tag\/([^/?#]+)/);

            if (tagMatch) {
                tag = decodeURIComponent(tagMatch[1]);
            } else {
                // Try finding it in the DOM: title or breadcrumb
                // Often the title is "Release v1.0.0 · owner/repo"
                const title = doc.title;
                const titleMatch = title.match(/Release (.+?) ·/);
                if (titleMatch) tag = titleMatch[1];
            }

            if (!tag) {
                // Fallback: look for generic release header
                const header = doc.querySelector('h1.d-inline');
                if (header) tag = header.textContent.trim();
            }

            if (!tag) return null;

            // 2. Find the date
            // Usually in a relative-time element inside the release header or sub-header
            let date = null;

            // Selector strategy:
            // The latest release page usually has a <relative-time> near the top
            const timeEl = doc.querySelector('relative-time');
            if (timeEl) {
                date = timeEl.getAttribute('datetime');
            } else {
                // Fallback to searching for a datetime attribute in a time element
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
            console.error(`Release check failed for ${owner}/${repo}:`, e);
            return null;
        }
    }

    // Concurrency queue helper
    async function processQueue(items, concurrency, task) {
        const queue = [...items];
        const workers = [];

        const worker = async () => {
            while (queue.length > 0) {
                const item = queue.shift();
                try {
                    await task(item);
                } catch (e) {
                    console.error('Queue task failed', e);
                }
            }
        };

        for (let i = 0; i < concurrency; i++) {
            workers.push(worker());
        }

        await Promise.all(workers);
    }

    async function processSearchResults() {
        const params = new URLSearchParams(window.location.search);
        const filterOnly = params.get('userscript_has_release') === '1';

        // Only run on search pages
        if (!window.location.pathname.startsWith('/search')) return;

        const resultContainer = document.querySelector('[data-testid="results-list"]');
        if (!resultContainer) return;

        const allItems = Array.from(resultContainer.children);

        // Filter items that need processing
        const itemsToProcess = allItems.filter(item => {
            if (item.dataset.releaseProcessed) return false;

            const link = item.querySelector('a[href^="/"]');
            if (!link) return false;

            const path = link.getAttribute('href');
            const parts = path.split('/').filter(Boolean);
            return parts.length >= 2;
        });

        // Mark them as processed immediately to avoid double queueing
        itemsToProcess.forEach(item => item.dataset.releaseProcessed = 'true');

        // Process function for each item
        const processItem = async (item) => {
            const link = item.querySelector('a[href^="/"]');
            const path = link.getAttribute('href');
            const parts = path.split('/').filter(Boolean);
            const owner = parts[0];
            const repo = parts[1];

            // Find where to insert the badge
            const metaList = item.querySelector('ul');
            const insertTarget = metaList || item;

            // Create container
            const badgeContainer = document.createElement('div');
            badgeContainer.style.marginTop = '8px';
            const checkingBadge = createReleaseBadge('checking');

            // If cached, we can skip the "checking" state ui if we want, but sticking to pattern:
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
                    // Also hide the container if we hid the item
                    badgeContainer.style.display = 'none';
                } else {
                    const noReleaseBadge = createReleaseBadge('no-release');
                    badgeContainer.appendChild(noReleaseBadge);
                }
            }
        };

        // Run with concurrency of 3 to be polite but faster
        await processQueue(itemsToProcess, 3, processItem);
    }

    // --- Initialization ---
    GM_registerMenuCommand("Search Filter", togglePanel);

    // Inject styles
    injectGlobalStyles();

    // Observer for dynamic content
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            processSearchResults();
        }, 200);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    createPanel();
    processSearchResults();

})();