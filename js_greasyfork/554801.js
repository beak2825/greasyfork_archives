// ==UserScript==
// @name         MusicBrainz: Editor Subscription Manager
// @namespace    https://musicbrainz.org/user/chaban
// @version      0.2.2
// @tag          ai-created
// @description  Manages subscriptions, tracks name changes and detects deleted users.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/user/*
// @match        *://*.musicbrainz.eu/user/*
// @connect      self
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554801/MusicBrainz%3A%20Editor%20Subscription%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/554801/MusicBrainz%3A%20Editor%20Subscription%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // #region Configuration & Constants
    const SCRIPT_NAME = GM.info.script.name;
    const SCRIPT_KEY = 'UserJS.MusicBrainz.EditorSubscriptionManager';
    const CACHE_KEY = `${SCRIPT_KEY}.Cache`;
    const SETTINGS_KEY = `${SCRIPT_KEY}.Settings`;

    const CACHE_TTL_DAYS = 7;
    const CONCURRENCY_LIMIT = 5;
    const EDITORS_PER_PAGE = 100;
    const SPAMMER_TEXT = 'This user was blocked and their profile is hidden';

    const COLUMNS = [
        {
            id: 'select',
            header: '<input type="checkbox" id="esm-select-all">',
            className: 'col-cb',
            render: (e) => `<input type="checkbox" class="esm-select-row" data-id="${e.id}">`,
            sortable: false
        },
        {
            id: 'name',
            header: 'Name',
            getValue: (e) => e.name.toLowerCase(),
            render: (e) => {
                let html = `<a href="${e.profileUrl}" target="_blank"><b>${e.name}</b></a>`;
                if (e.previousNames?.length) {
                    html += `<br><span class="esm-aka" title="Known aliases">aka: ${e.previousNames.join(', ')}</span>`;
                }
                return html;
            }
        },
        {
            id: 'userType',
            header: 'Type',
            getValue: (e) => e.userType || '',
            render: (e) => e.userType || ''
        },
        {
            id: 'accepted',
            header: 'Acc.',
            className: 'esm-num',
            getValue: (e) => e.acceptedEdits || 0,
            render: (e) => (e.acceptedEdits || 0).toLocaleString()
        },
        {
            id: 'rejected',
            header: 'Rej.',
            className: 'esm-num',
            getValue: (e) => e.rejectedEdits || 0,
            render: (e) => {
                const val = e.rejectedEdits || 0;
                return val > 0 ? `<span class="esm-warn">${val.toLocaleString()}</span>` : val;
            }
        },
        {
            id: 'rate',
            header: '% Rej.',
            className: 'esm-num',
            getValue: (e) => e.rejectionRate || 0,
            render: (e) => {
                const val = e.rejectionRate || 0;
                const cls = val > 10 ? 'esm-bad-stat' : '';
                return `<span class="${cls}">${val.toFixed(1)}%</span>`;
            }
        },
        {
            id: 'lastEdit',
            header: 'Last Edit',
            getValue: (e) => e.lastEditDate || '',
            render: (e) => e.lastEditDate ? new Date(e.lastEditDate).toLocaleDateString() : 'N/A'
        },
        {
            id: 'since',
            header: 'Registered',
            getValue: (e) => e.memberSince || '',
            render: (e) => e.memberSince ? new Date(e.memberSince).toLocaleDateString() : 'N/A'
        },
        {
            id: 'cache',
            header: 'Cache',
            getValue: (e) => e.lastUpdated || 0,
            render: (e) => {
                if (!e.lastUpdated) return '';
                const age = (Date.now() - e.lastUpdated) / 86400000;
                return `<span class="${age > CACHE_TTL_DAYS ? 'esm-stale' : 'esm-fresh'}">${age < 0.1 ? 'Fresh' : age.toFixed(1) + 'd'}</span>`;
            }
        },
        {
            id: 'status',
            header: 'Status',
            getValue: (e) => {
                if (e.isDeleted) return 1;
                if (e.isLost) return 2;
                if (e.isSpammer) return 3;
                if (e.error) return 4;
                if (!e.isSubscribed) return 5;
                return 6;
            },
            render: (e) => {
                if (e.isDeleted) return '<b style="color:darkred">DELETED</b>';
                if (e.isLost) return '<b style="color:orange">LOST SUB</b>';
                if (!e.isSubscribed) return '<span style="color:#666">Visited Only</span>';
                if (e.isSpammer) return '<b style="color:red">SPAMMER</b>';
                if (e.error) return `ERR: ${e.error}`;
                return '<span style="color:green">Active</span>';
            }
        }
    ];

    let allEditorData = [];
    const sortState = { key: 'status', asc: true };
    // #endregion

    // #region Logging
    function log(msg, ...args) {
        console.log(`[${SCRIPT_NAME}] ${msg}`, ...args);
    }
    function error(msg, ...args) {
        console.error(`[${SCRIPT_NAME}] ${msg}`, ...args);
    }
    // #endregion

    // #region Network & Parsing Utilities
    async function request(method, url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method, url,
                onload: (res) => {
                    if (res.status === 404) resolve({ status: 404, doc: null, finalUrl: res.finalUrl });
                    else if (res.status >= 200 && res.status < 400) {
                        const doc = method === 'GET' && res.responseText ? new DOMParser().parseFromString(res.responseText, 'text/html') : null;
                        resolve({ status: res.status, doc, finalUrl: res.finalUrl });
                    } else reject(new Error(`HTTP ${res.status}`));
                },
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    function requestGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url,
                onload: (res) => (res.status >= 200 && res.status < 400) ? resolve() : reject(new Error(`HTTP ${res.status}`)),
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    function parseStatNumber(text) {
        return text ? parseInt(text.replace(/,/g, '').match(/^(-?\d+)/)?.[1] || 0, 10) : 0;
    }

    function scrapeStats(doc) {
        const stats = { edits: {}, votes: {}, added: {}, secondary: {} };
        doc.querySelectorAll('table.statistics').forEach(table => {
            const header = table.querySelector('thead th')?.textContent || '';
            const type = header.includes('Edits') ? 'edits' : header.includes('Added') ? 'added' : header.includes('Tags') ? 'secondary' : null;

            if (type) {
                table.querySelectorAll('tbody tr').forEach(row => {
                    const k = row.querySelector('th')?.textContent.trim();
                    const v = row.querySelector('td')?.textContent;
                    if(k && v) stats[type][k] = parseStatNumber(v);
                });
            } else if (header.includes('Votes')) {
                table.querySelectorAll('tbody tr').forEach(row => {
                    const cells = row.querySelectorAll('td, th');
                    if(cells.length >= 3) stats.votes[cells[0].textContent.trim()] = parseStatNumber(cells[2].textContent);
                });
            }
        });
        return stats;
    }

    function parseProfile(doc, url, forceId = null) {
        const id = forceId || getEditorId(doc);
        if (!id) return { id: null, error: 'No ID found' };

        const hasUnsubLink = !!doc.querySelector('a[href*="/subscriptions/editor/remove"]');
        const pageText = doc.getElementById('page')?.textContent || '';
        const name = doc.querySelector('h1 a bdi')?.textContent.trim() || 'Unknown';

        const isDeleted = pageText.includes('user has been deleted') || name.startsWith('Deleted Editor #');

        const editor = {
            id, name,
            profileUrl: url,
            isSpammer: pageText.includes(SPAMMER_TEXT),
            isDeleted: isDeleted,
            isSubscribed: hasUnsubLink,
            isLost: hasUnsubLink ? false : undefined,
            stats: scrapeStats(doc),
            acceptedEdits: 0, rejectedEdits: 0, rejectionRate: 0,
            lastUpdated: Date.now()
        };

        if (editor.isSpammer || editor.isDeleted) return editor;

        const getMeta = (label) => [...doc.querySelectorAll('.profileinfo th')].find(th => th.textContent.trim() === label)?.nextElementSibling;

        editor.restrictions = getMeta('Restrictions:')?.textContent.trim();
        const dateStr = getMeta('Member since:')?.textContent.trim();
        if(dateStr) editor.memberSince = new Date(dateStr).toISOString();

        const typeNode = getMeta('User type:');
        if (typeNode) {
            const clone = typeNode.cloneNode(true);
            clone.querySelector('a[href*="nominate"]')?.remove();
            editor.userType = clone.textContent.replace(/\s+/g, ' ').replace(/\(\s*\)/g, '').trim();
            if (editor.userType.includes('Deleted user')) editor.isDeleted = true;
        }

        if (editor.isDeleted) return editor;

        editor.acceptedEdits = editor.stats.edits?.['Accepted'] || 0;
        editor.rejectedEdits = editor.stats.edits?.['Voted down'] || 0;
        const total = editor.acceptedEdits + editor.rejectedEdits;
        if (total > 0) editor.rejectionRate = (editor.rejectedEdits / total) * 100;

        return editor;
    }

    function getEditorId(doc) {
        const subLinks = [
            doc.querySelector('a[href*="/subscriptions/editor/remove"]')?.href, // Subscribed
            doc.querySelector('a[href*="/subscriptions/editor/add"]')?.href     // Not subscribed
        ];

        for (const h of subLinks) {
            const m = h?.match(/[?&]id=(\d+)/);
            if (m) return m[1];
        }
        return null;
    }

    async function fetchEditorFull(basicInfo) {
        try {
            const { status, doc, finalUrl } = await request('GET', basicInfo.profileUrl);

            if (status === 404) {
                const recovered = await tryResolveEditorById(basicInfo.id);
                if (recovered) return fetchEditorFull(recovered);
                return { ...basicInfo, isDeleted: true, error: 'Page 404', lastUpdated: Date.now() };
            }

            const effectiveUrl = finalUrl || basicInfo.profileUrl;
            const data = parseProfile(doc, effectiveUrl, basicInfo.id);

            if (data.error || data.isSpammer || data.isDeleted) return data;

            if ((data.stats.edits?.['Total'] || 0) > 0) {
                const { doc: editsDoc } = await request('GET', `${effectiveUrl}/edits`);
                if (editsDoc) {
                    const dateStr = editsDoc.querySelector('div.edit-header:not(.open) td.edit-expiration')?.lastChild?.textContent.trim();
                    if (dateStr) data.lastEditDate = new Date(dateStr).toISOString();
                    else if (editsDoc.querySelector('div.edit-header.open')) data.lastEditDate = new Date().toISOString();
                }
            }
            return data;
        } catch (e) { return { ...basicInfo, error: e.message }; }
    }

    async function tryResolveEditorById(id) {
        try {
            const url = `/search/edits?conditions.0.field=editor&conditions.0.operator=%3D&conditions.0.args.0=${id}`;
            const { doc } = await request('GET', url);
            if (!doc) return null;
            const userLink = doc.querySelector('.edit-list .subheader a[href^="/user/"]');
            if (userLink) {
                return { id, name: userLink.textContent.trim(), profileUrl: userLink.href };
            }
        } catch (e) { error(`Resolve ID failed:`, e); }
        return null;
    }

    function getTotalPages(doc) {
        const listItems = doc.querySelectorAll('#page > p + ul > li');
        const editorLi = [...listItems].find(li => li.textContent.includes(' editors'));
        const total = editorLi ? parseInt(editorLi.textContent.replace(/,/g,'')) : 0;
        return Math.ceil(total / EDITORS_PER_PAGE) || 1;
    }
    // #endregion

    // #region Cache & Storage
    const storage = {
        getSettings: () => { try { return { showVisited: false, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) }; } catch { return { showVisited: false }; } },
        saveSettings: (s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)),
        getCache: () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; } },
        saveEditor: (e) => {
            const cache = storage.getCache();
            const prev = cache[e.id];
            if (prev?.name && prev.name !== e.name) {
                e.previousNames = [...(prev.previousNames || []), prev.name];
            } else if (prev?.previousNames) {
                e.previousNames = prev.previousNames;
            }
            // Preserve subscribed status if not explicitly set in the new object
            if (e.isSubscribed === undefined && prev) e.isSubscribed = prev.isSubscribed;

            cache[e.id] = { ...prev, ...e, lastUpdated: Date.now() };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        },
        remove: (ids) => {
            const cache = storage.getCache();
            ids.forEach(id => delete cache[id]);
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        }
    };
    // #endregion

    // #region UI Rendering
    function updateReportStats() {
        let years = parseInt(document.getElementById('esm-inactive-years')?.value, 10);
        if (isNaN(years) || years < 1) {
            years = 1;
            const input = document.getElementById('esm-inactive-years');
            if(input) input.value = 1;
        }

        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - years);

        const stats = {
            total: allEditorData.length,
            visited: allEditorData.filter(e => !e.isSubscribed).length,
            spammers: allEditorData.filter(e => e.isSpammer).length,
            highRejection: allEditorData.filter(e => (e.rejectionRate || 0) > 10).length,
            inactive: allEditorData.filter(e => e.isSubscribed && !e.isLost && !e.isSpammer && !e.error && (!e.lastEditDate || new Date(e.lastEditDate) < cutoff)).length,
            lost: allEditorData.filter(e => e.isLost).length,
            deleted: allEditorData.filter(e => e.isDeleted).length
        };

        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
        setTxt('esm-stats-total', ` ${stats.total}`);
        setTxt('esm-stats-visited', ` ${stats.visited}`);
        setTxt('esm-stats-spammers', ` ${stats.spammers}`);
        setTxt('esm-inactive-count', ` ${stats.inactive}`);
        setTxt('esm-stats-high-rejection', ` ${stats.highRejection}`);
        setTxt('esm-stats-lost', ` ${stats.lost} (${stats.deleted} deleted)`);
        setTxt('esm-inactive-years-text', years);

        const spamBtn = document.getElementById('esm-unsub-spammers');
        if (spamBtn) {
            spamBtn.textContent = `Unsubscribe Spammers (${stats.spammers})`;
            spamBtn.disabled = stats.spammers === 0;
        }
    }

    function renderReportTable() {
        const tbody = document.querySelector('#esm-report-table tbody');
        if (!tbody) return;

        const settings = storage.getSettings();
        let displayData = settings.showVisited ? allEditorData : allEditorData.filter(e => e.isSubscribed);

        const { key, asc } = sortState;

        document.querySelectorAll('#esm-report-table th.esm-sortable').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
            if (th.dataset.id === key) {
                th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');
            }
        });

        if (displayData.length === 0) {
            const msg = allEditorData.length > 0 ? 'No subscriptions to display (Visited profiles are hidden).' : 'No data found. Try scanning.';
            tbody.innerHTML = `<tr><td colspan="${COLUMNS.length}" style="text-align:center; padding:20px;">${msg}</td></tr>`;
            return;
        }

        const colDef = COLUMNS.find(c => c.id === key) || COLUMNS.find(c => c.id === 'status');

        displayData.sort((a, b) => {
            let valA = colDef.getValue(a);
            let valB = colDef.getValue(b);

            if (valA == null) valA = asc ? Infinity : -Infinity;
            if (valB == null) valB = asc ? Infinity : -Infinity;

            if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }

            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        });

        tbody.innerHTML = displayData.map(e => {
            const rowClass = e.isDeleted ? 'esm-row-deleted' : e.isLost ? 'esm-row-lost' : e.isSpammer ? 'esm-row-spam' : !e.isSubscribed ? 'esm-row-visited' : '';
            const cells = COLUMNS.map(col => `<td class="${col.className || ''}">${col.render(e)}</td>`).join('');
            return `<tr class="${rowClass}">${cells}</tr>`;
        }).join('');
    }

    function buildReportUI() {
        const existing = document.getElementById('esm-report-ui');
        if (existing) existing.remove();
        const settings = storage.getSettings();
        const years = parseInt(document.getElementById('esm-inactive-years')?.value || '5', 10);

        const div = document.createElement('div');
        div.id = 'esm-report-ui';
        div.innerHTML = `
            <h1>Editor Subscription Manager</h1>
            <div class="esm-controls">
                <div class="esm-stats">
                    <ul>
                        <li><strong>Total Cached:</strong> <span id="esm-stats-total">...</span></li>
                        <li><strong>Visited Only:</strong> <span id="esm-stats-visited">...</span></li>
                        <li><strong>Spammers:</strong> <span id="esm-stats-spammers">...</span></li>
                        <li><strong>Inactive (> <span id="esm-inactive-years-text">${years}</span>y):</strong> <span id="esm-inactive-count">...</span></li>
                        <li><strong>High Rejection (>10%):</strong> <span id="esm-stats-high-rejection">...</span></li>
                        <li><strong>Lost/Deleted Subs:</strong> <span id="esm-stats-lost">...</span></li>
                    </ul>
                </div>
                <div class="esm-actions">
                    <div class="esm-action-row">
                        <button id="esm-refresh-new" title="Updates only new or expired entries">↻ Scan (Smart)</button>
                        <button id="esm-refresh-all" title="Force updates all cache entries">↻ Refresh (Full)</button>
                        <button id="esm-close-report">Close</button>
                    </div>
                    <div class="esm-action-row">
                        <label>Unsubscribe Inactive > </label>
                        <input type="number" id="esm-inactive-years" value="${years}" min="1" style="width:40px"> y
                        <button id="esm-unsub-inactive">Go</button>
                    </div>
                    <div class="esm-action-row">
                        <label style="cursor:pointer; display:flex; align-items:center;">
                            <input type="checkbox" id="esm-show-visited" style="margin-right:5px;"> Show Visited Profiles
                        </label>
                    </div>
                    <div class="esm-action-row">
                        <button id="esm-unsub-spammers" disabled>Unsubscribe Spammers</button>
                        <button id="esm-unsub-selected" disabled>Unsubscribe / Dismiss Selected</button>
                    </div>
                </div>
            </div>
            <table class="tbl" id="esm-report-table">
                <thead>
                    <tr>${COLUMNS.map(c => `<th class="${c.className || ''} ${c.sortable!==false?'esm-sortable':''}" data-id="${c.id}">${c.header}</th>`).join('')}</tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        document.getElementById('page').childNodes.forEach(c => { if(c.id !== 'esm-report-ui' && c.style) c.style.display = 'none'; });
        document.getElementById('page').appendChild(div);

        const getEl = (id) => document.getElementById(id);

        getEl('esm-show-visited').checked = settings.showVisited;

        getEl('esm-close-report').onclick = () => location.reload();
        getEl('esm-refresh-new').onclick = () => runManager('scan');
        getEl('esm-refresh-all').onclick = () => runManager('refresh');
        getEl('esm-show-visited').onchange = (e) => {
            const currentSettings = storage.getSettings();
            storage.saveSettings({ ...currentSettings, showVisited: e.target.checked });
            renderReportTable();
        };
        getEl('esm-inactive-years').oninput = updateReportStats;

        getEl('esm-report-table').querySelector('thead').onclick = (e) => {
            const th = e.target.closest('th.esm-sortable');
            if(th) {
                sortState.asc = sortState.key === th.dataset.id ? !sortState.asc : true;
                sortState.key = th.dataset.id;
                renderReportTable();
            }
        };

        const updateSel = () => {
            const n = document.querySelectorAll('.esm-select-row:checked').length;
            const btn = getEl('esm-unsub-selected');
            btn.textContent = `Unsubscribe / Dismiss Selected (${n})`;
            btn.disabled = n === 0;
        };
        getEl('esm-select-all').onchange = (e) => {
            document.querySelectorAll('.esm-select-row').forEach(c => c.checked = e.target.checked);
            updateSel();
        };
        getEl('esm-report-table').querySelector('tbody').onchange = (e) => { if(e.target.matches('.esm-select-row')) updateSel(); };

        const doUnsub = async (ids) => {
            if(!ids.length) return;
            const toUnsub = ids.filter(id => { const e = allEditorData.find(x=>x.id===id); return e && !e.isLost && e.isSubscribed; });

            if(toUnsub.length) {
                updateProgress(`Unsubscribing ${toUnsub.length}...`);
                await Promise.all(Array(CONCURRENCY_LIMIT).fill(0).map(async () => {
                    while(toUnsub.length) {
                        const id = toUnsub.shift();
                        try {
                            await requestGet(`${location.origin}/account/subscriptions/editor/remove?id=${id}`);
                        } catch(e){error(e);}
                    }
                }));
            }
            storage.remove(ids);
            allEditorData = allEditorData.filter(e => !ids.includes(e.id));
            renderReportTable();
            showProgress(false);
        };

        getEl('esm-unsub-selected').onclick = () => {
            const ids = [...document.querySelectorAll('.esm-select-row:checked')].map(c => c.dataset.id);
            if(confirm(`Process ${ids.length} selected items?`)) doUnsub(ids);
        };
        const spammers = allEditorData.filter(e => e.isSpammer);
        getEl('esm-unsub-spammers').textContent = `Unsubscribe Spam (${spammers.length})`;
        getEl('esm-unsub-spammers').disabled = !spammers.length;
        getEl('esm-unsub-spammers').onclick = () => { if(confirm('Unsubscribe spammers?')) doUnsub(spammers.map(e=>e.id)); };

        getEl('esm-unsub-inactive').onclick = () => {
            const y = parseInt(getEl('esm-inactive-years').value);
            const d = new Date(); d.setFullYear(d.getFullYear() - y);
            const ids = allEditorData.filter(e => e.isSubscribed && !e.isLost && !e.isSpammer && !e.error && (!e.lastEditDate || new Date(e.lastEditDate) < d)).map(e => e.id);
            if(confirm(`Unsubscribe ${ids.length} inactive?`)) doUnsub(ids);
        };

        updateReportStats();
        renderReportTable();
    }
    // #endregion

    // #region Logic Flow
    /**
     * @param {'scan'|'refresh'} mode
     */
    async function runManager(mode) {
        document.querySelectorAll('button').forEach(b => b.disabled = true);
        showProgress(true, 'Reading subscription list...');

        try {
            // 1. Sync Subscription List
            const { doc: page1 } = await request('GET', `${location.pathname}?page=1`);
            let totalPages = 1;
            if (page1) totalPages = getTotalPages(page1);

            const editorStubs = [];
            const scrapeList = (doc) => [...doc.querySelectorAll('form tbody tr')].map(tr => ({
                id: tr.querySelector('input')?.value,
                name: tr.querySelector('a')?.textContent.trim(),
                profileUrl: tr.querySelector('a')?.href,
                isSubscribed: true
            })).filter(x=>x.id);

            if(page1) editorStubs.push(...scrapeList(page1));

            for(let i=2; i<=totalPages; i++) {
                updateProgress(`Reading page ${i}/${totalPages}...`);
                const { doc } = await request('GET', `${location.pathname}?page=${i}`);
                if(doc) editorStubs.push(...scrapeList(doc));
            }

            const uniqueStubs = editorStubs.filter((e,i,a) => a.findIndex(x => x.id === e.id) === i);
            const currentSubIds = new Set(uniqueStubs.map(e => e.id));

            // 2. Prepare Cache & Queue
            let cache = storage.getCache();
            const queue = [];

            // Add subscribed stubs to processing queue or update status
            uniqueStubs.forEach(stub => {
                const cached = cache[stub.id];
                if (!cached) {
                    queue.push({ ...stub, reason: 'new' });
                } else {
                    cached.isSubscribed = true;
                    // Reset 'lost' status if it was previously lost
                    if (cached.isLost) cached.isLost = false;

                    const age = (Date.now() - (cached.lastUpdated || 0)) / 86400000;
                    if (mode === 'refresh' || age > CACHE_TTL_DAYS || cached.error) {
                        queue.push({ ...cached, reason: 'update' });
                    }
                }
            });

            // Mark missing subscriptions as lost in cache
            Object.values(cache).forEach(e => {
                if (e.isSubscribed && !currentSubIds.has(e.id)) {
                    e.isLost = true; // Potentially deleted or unsubscribed elsewhere
                    queue.push({ ...e, reason: 'lost_check' });
                } else if (mode === 'refresh' && !e.isSubscribed) {
                    // Refresh visited profiles too if full refresh
                    queue.push({ ...e, reason: 'refresh_visited' });
                }
            });

            // 3. Process Queue
            if(queue.length > 0) {
                updateProgress(`Updating ${queue.length} profiles...`);
                let processed = 0;

                const worker = async () => {
                    while(queue.length) {
                        const task = queue.shift();
                        let result;

                        // Just a quick check for lost items first to see if they are deleted or just unsubbed
                        if (task.reason === 'lost_check') {
                            result = await fetchEditorFull(task);
                            if (!result.error && !result.isDeleted) {
                                // Profile exists, so we just aren't subscribed anymore
                                result.isSubscribed = false;
                                result.isLost = false;
                            } else {
                                // Deleted or error
                                result.isSubscribed = true; // Keep as subbed so it shows as "LOST" or "DELETED" in list
                                result.isLost = !result.isDeleted;
                            }
                        } else {
                            result = await fetchEditorFull(task);
                            if (task.isSubscribed) result.isSubscribed = true;
                        }

                        storage.saveEditor(result);
                        processed++;
                        updateProgress(`Processed ${processed} profiles... (${result.name})`);
                    }
                };
                await Promise.all(Array(CONCURRENCY_LIMIT).fill(0).map(worker));
            }

            // Reload Cache to get everything
            cache = storage.getCache();
            allEditorData = Object.values(cache);

            showProgress(false);
            buildReportUI();

        } catch (e) { error(e); alert(e.message); showProgress(false); location.reload(); }
    }

    async function runPassiveScraper() {
        const id = getEditorId(document);

        log(`Passive Scraper: ID=${id}, URL=${location.href}`);

        if(!id) return;

        const notif = document.createElement('div');
        notif.id = 'esm-notification';
        notif.textContent = `ESM: Updating...`;
        Object.assign(notif.style, { position:'fixed', top:'10px', right:'10px', background:'#eee', padding:'5px 10px', border:'1px solid #999', zIndex:9999, fontSize:'12px', opacity: 0.9, transition: 'opacity 0.5s' });
        document.body.appendChild(notif);

        // Attach listeners to subscribe/unsubscribe buttons for immediate feedback
        const attachListeners = () => {
            const subBtn = document.querySelector('a[href*="/subscriptions/editor/add"]');
            const unsubBtn = document.querySelector('a[href*="/subscriptions/editor/remove"]');

            const handleManualChange = (isSub) => {
                const cache = storage.getCache();
                if(cache[id]) {
                    cache[id].isSubscribed = isSub;
                    cache[id].isLost = false;
                    storage.saveEditor(cache[id]);
                    const el = document.getElementById('esm-notification');
                    if(el) {
                        el.textContent = isSub ? 'ESM: Subscribed!' : 'ESM: Unsubscribed!';
                        el.style.background = '#e6f7ff';
                        setTimeout(() => el.style.opacity = '0', 2000);
                    }
                }
            };

            if(subBtn) subBtn.addEventListener('click', () => handleManualChange(true));
            if(unsubBtn) unsubBtn.addEventListener('click', () => handleManualChange(false));
        };
        attachListeners();

        try {
            // Use current page as source
            const data = parseProfile(document, location.href, id);

            // Check cache for previous name
            const cache = storage.getCache();
            const prev = cache[id];
            if (prev) {
                if(prev.name !== data.name) data.previousNames = [...(prev.previousNames||[]), prev.name];
                else data.previousNames = prev.previousNames;
                // Preserve existing subscription status if undetermined from UI (though parseProfile tries)
                if (data.isSubscribed === undefined) data.isSubscribed = prev.isSubscribed;
            }

            // Fetch extra edits data for "Last Edit" date
            const { doc } = await request('GET', `${location.origin}/user/${encodeURIComponent(data.name)}/edits`);
            if(doc) {
               const dateStr = doc.querySelector('div.edit-header:not(.open) td.edit-expiration')?.lastChild?.textContent.trim();
               if(dateStr) data.lastEditDate = new Date(dateStr).toISOString();
            }

            storage.saveEditor(data);

            notif.textContent = 'ESM: Profile Cached.';
            notif.style.background = '#ebfccb';
            notif.style.borderColor = 'green';
            setTimeout(()=>notif.remove(), 2000);
        } catch(e) {
            error(e);
            notif.style.background='#fccbcb';
            notif.style.borderColor = 'red';
            notif.textContent='ESM: Error';
            setTimeout(()=>notif.remove(), 3000);
        }
    }
    // #endregion

    // #region Helpers
    function showProgress(show, txt) {
        let el = document.getElementById('esm-progress');
        if(!el) {
            el = document.createElement('div');
            Object.assign(el.style, { position:'fixed', top:0, left:0, width:'100%', background:'#333', color:'#fff', textAlign:'center', padding:'10px', zIndex:10000 });
            el.id = 'esm-progress'; document.body.appendChild(el);
        }
        el.style.display = show ? 'block' : 'none';
        if(txt) el.textContent = txt;
    }
    function updateProgress(txt) { showProgress(true, txt); }

    function addStyles() {
        GM_addStyle(`
            #esm-report-ui { background:#fff; padding:20px; border:1px solid #ccc; margin-top:20px; }
            .esm-controls { display:flex; gap:20px; margin-bottom:20px; flex-wrap:wrap; border-bottom:1px solid #eee; padding-bottom:20px; }
            .esm-stats ul { list-style:none; padding:0; margin:0; }
            .esm-stats li { margin-bottom:5px; }
            .esm-action-row { margin-bottom:10px; display:flex; align-items:center; gap:10px; }
            #esm-report-table { width:100%; border-collapse:collapse; }
            #esm-report-table th, #esm-report-table td { border:1px solid #ddd; padding:6px; text-align:left; font-size:0.9em; }
            #esm-report-table th { background:#f9f9f9; position:relative; padding-right:20px; }
            #esm-report-table th:first-child { padding-right: 6px; }
            #esm-report-table th:first-child, #esm-report-table td:first-child { width: 25px; text-align: center; }
            #esm-report-table th.esm-sortable { cursor:pointer; }
            #esm-report-table th.esm-sortable:not(.sorted-asc):not(.sorted-desc):hover::after { content: '↕'; position: absolute; right: 5px; opacity: 0.6; font-size: 0.8em; }
            #esm-report-table th.esm-sortable.sorted-asc::after { content: '▲'; position: absolute; right: 5px; opacity: 1; font-size: 0.8em; }
            #esm-report-table th.esm-sortable.sorted-desc::after { content: '▼'; position: absolute; right: 5px; opacity: 1; font-size: 0.8em; }
            .esm-num { text-align:right !important; font-family:monospace; }
            .esm-bad-stat { color:red; font-weight:bold; }
            .esm-warn-stat { color:#d35400; }
            .esm-stale { color:#999; font-style:italic; }
            .esm-fresh { color:green; }
            .esm-aka { font-size: 0.85em; color: #666; font-style: italic; display:block; margin-top:2px; }
            .esm-row-deleted { background-color: #ffe6e6; opacity: 0.7; }
            .esm-row-lost { background-color: #fff9e6; }
            .esm-row-visited { background-color: #f7f7f7; color: #666; }
        `);
    }
    // #endregion

    function init() {
        const path = location.pathname;

        // 1. Subscription Management Page
        if (path.match(/\/user\/[^/]+\/subscriptions\/editor/)) {
            const h2 = document.querySelector('#page > h2');
            if (h2 && h2.textContent.includes('Editor subscriptions')) {
                addStyles();
                const container = document.createElement('div');
                container.style.display = 'inline-block';
                container.style.marginLeft = '20px';
                container.innerHTML = `<button id="esm-btn-open" style="font-weight:bold">Manage Subscriptions</button>`;
                h2.appendChild(container);
                document.getElementById('esm-btn-open').onclick = () => runManager();
            }
            return;
        }

        // 2. User Profile Page (Passive Scan)
        // Check if path matches /user/<name> but NOT sub-pages like /edits, /votes etc.
        const userMatch = path.match(/^\/user\/([^/]+)$/);
        if (userMatch) {
            runPassiveScraper();
        }
    }

    init();
})();