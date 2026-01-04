// ==UserScript==
// @name         Walks All Over the Sky (Torn Travel War Board)
// @namespace    https://greasyfork.org/users/loneblackbear
// @version      1.4.1-beta
// @description  One-button Torn travel war board: import targets, auto-check status, group by location, and click to attack/profile from a single unified window. Ignores your own XID on import, includes forum/faction/donate/referral links.
// @author       loneblackbear
// @match        https://www.torn.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556238/Walks%20All%20Over%20the%20Sky%20%28Torn%20Travel%20War%20Board%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556238/Walks%20All%20Over%20the%20Sky%20%28Torn%20Travel%20War%20Board%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY_API = 'walks_api_key_v1';
    const STORAGE_KEY_TARGETS = 'walks_targets_v1';

    // Snapshot of last-known travel/location info for each target
    const targetTravelSnapshot = {};

    let cachedSelfId = null; // your own XID once known

    // Simple helper to strip any HTML tags from Torn's status/details text
    function stripHtmlTags(str) {
        if (!str) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = str;
        return tmp.textContent || tmp.innerText || '';
    }

    let modalBackdrop = null;
    let stylesInjected = false;

    // ---------- Utility: inject Tron styles ----------

    function injectWalksStyles() {
        if (stylesInjected) return;
        stylesInjected = true;

        const style = document.createElement('style');
        style.textContent = `
        .walks-panel {
            background: #05070a;
            border-radius: 10px;
            padding: 16px 18px 14px;
            color: #f1f1f1;
            font-family: Consolas, monospace;
            box-shadow: 0 0 20px rgba(0,255,255,0.6);
            border: 1px solid #00faff;
        }
        .walks-panel-title {
            font-size: 15px;
            font-weight: 700;
            color: #00faff;
            text-shadow: 0 0 6px rgba(0,255,255,0.8);
        }
        .walks-panel-small {
            font-size: 11px;
            color: #d2dae2;
        }
        .walks-button-main {
            font-family: Consolas, monospace;
        }
        .walks-war-body {
            flex: 1 1 auto;
            margin-top: 6px;
            border-radius: 6px;
            border: 1px solid #00faff22;
            background: rgba(0, 0, 0, 0.4);
            padding: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .walks-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .walks-row-grow {
            flex: 1 1 auto;
        }
        .walks-small-input {
            width: 260px;
            box-sizing: border-box;
            padding: 4px 6px;
            border-radius: 6px;
            border: 1px solid #00faff;
            outline: none;
            background: #000;
            color: #f1f1f1;
            font-size: 11px;
            box-shadow: 0 0 6px rgba(0,255,255,0.4);
        }
        .walks-small-btn {
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #00faff55;
            cursor: pointer;
            background: #001018;
            color: #00faff;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            box-shadow: 0 0 4px rgba(0,255,255,0.4);
        }
        .walks-small-btn-main {
            border: 2px solid #00faff;
            box-shadow: 0 0 8px rgba(0,255,255,0.8);
        }
        .walks-targets-textarea {
            width: 100%;
            height: 120px;
            box-sizing: border-box;
            padding: 4px 6px;
            border-radius: 6px;
            border: 1px solid #00faff;
            outline: none;
            background: #000;
            color: #f1f1f1;
            font-size: 11px;
            font-family: Consolas, monospace;
            resize: vertical;
            box-shadow: 0 0 6px rgba(0,255,255,0.4);
        }
        .walks-results {
            flex: 1 1 auto;
            overflow-y: auto;
            padding-right: 4px;
            border-radius: 6px;
            border: 1px solid #00faff22;
            background: rgba(0,0,0,0.3);
        }
        .walks-city-header {
            padding: 4px 8px;
            margin: 4px 4px 0 4px;
            background: rgba(0,255,255,0.08);
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .walks-city-header:hover {
            background: rgba(0,255,255,0.18);
        }
        .walks-city-name {
            font-size: 11px;
            color: #00faff;
        }
        .walks-city-count {
            font-size: 10px;
            color: #b2bec3;
        }
        .walks-target-list {
            padding: 2px 12px 4px 12px;
        }
        .walks-target-row {
            font-size: 11px;
            padding: 2px 4px;
            border-left: 3px solid #bdc3c7;
            margin: 1px 0;
        }
        .walks-target-row a {
            color: #ecf0f1;
            text-decoration: none;
        }
        .walks-target-row a:hover {
            text-decoration: underline;
        }
        `;
        document.head.appendChild(style);
    }

    // ---------- Utility: storage ----------

    function getApiKey() {
        return localStorage.getItem(STORAGE_KEY_API) || '';
    }

    function setApiKey(key) {
        if (!key) {
            localStorage.removeItem(STORAGE_KEY_API);
        } else {
            localStorage.setItem(STORAGE_KEY_API, key);
        }
    }

    function getTargetsText() {
        return localStorage.getItem(STORAGE_KEY_TARGETS) || '';
    }

    function setTargetsText(text) {
        if (!text) {
            localStorage.removeItem(STORAGE_KEY_TARGETS);
        } else {
            localStorage.setItem(STORAGE_KEY_TARGETS, text);
        }
    }

    function getTargetsArray() {
        const raw = getTargetsText();
        const lines = raw.split(/\r?\n/);
        const ids = new Set();

        for (const line of lines) {
            const beforeComment = line.split('#')[0].trim();
            if (!beforeComment) continue;
            const match = beforeComment.match(/\d+/);
            if (match) {
                ids.add(match[0]);
            }
        }
        return Array.from(ids);
    }

    // ---------- Modal backdrop ----------

    function ensureModalBackdrop() {
        if (modalBackdrop) return;

        modalBackdrop = document.createElement('div');
        Object.assign(modalBackdrop.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000000'
        });

        modalBackdrop.addEventListener('click', function (e) {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });

        document.body.appendChild(modalBackdrop);
    }

    function setModalContent(el) {
        ensureModalBackdrop();
        modalBackdrop.innerHTML = '';
        modalBackdrop.appendChild(el);
        modalBackdrop.style.display = 'flex';
    }

    function closeModal() {
        if (modalBackdrop) {
            modalBackdrop.style.display = 'none';
        }
    }

    // ---------- Travel snapshot + self info ----------

    function updateTravelSnapshotFromApi(xid, data) {
        const statusObj = data.status || {};
        const travelObj = data.travel || {};

        const name = data.name || '(unknown)';

        const state = statusObj.state || 'Unknown';
        const descRaw = statusObj.description || '';
        const detailsRaw = statusObj.details || '';

        const desc = stripHtmlTags(descRaw);
        const details = stripHtmlTags(detailsRaw);

        let destination = null;
        let timeLeft = null;
        let traveling = false;

        if (travelObj && typeof travelObj === 'object') {
            if (travelObj.destination) destination = travelObj.destination;
            if (typeof travelObj.time_left === 'number') timeLeft = travelObj.time_left;
        }

        if (/travel/i.test(state) || /travel/i.test(desc)) {
            traveling = true;
        }

        let where = 'Torn';
        if (destination) {
            if (traveling) {
                where = 'Flying to ' + destination;
            } else {
                where = destination;
            }
        } else if (/abroad/i.test(state)) {
            where = 'Abroad';
        } else if (/okay/i.test(state)) {
            where = 'Torn';
        } else if (/hospital/i.test(state)) {
            where = 'Hospital';
        } else if (/jail/i.test(state)) {
            where = 'Jail';
        }

        targetTravelSnapshot[xid] = {
            xid,
            name,
            state,
            where,
            destination,
            traveling,
            timeLeft,
            description: desc,
            details
        };
    }

    async function getSelfIdAndCity() {
        const apiKey = getApiKey();
        if (!apiKey) return { selfId: null, city: 'Unknown' };

        try {
            const url =
                'https://api.torn.com/user/0?selections=basic&key=' +
                encodeURIComponent(apiKey);
            const resp = await fetch(url);
            const data = await resp.json();
            if (data && data.error) {
                console.warn('[Walks] getSelfIdAndCity error:', data.error);
                return { selfId: null, city: 'Unknown' };
            }

            let selfId = null;
            if (typeof data.player_id !== 'undefined') {
                selfId = String(data.player_id);
            } else if (typeof data.user_id !== 'undefined') {
                selfId = String(data.user_id);
            }
            if (selfId) cachedSelfId = selfId;

            const status = data.status || {};
            const travel = data.travel || {};
            const state = (status.state || '').toLowerCase();

            let city = 'Torn';
            if (travel.destination && /abroad|travel/i.test(state)) {
                city = travel.destination;
            } else if (/hospital/.test(state)) {
                city = 'Hospital (Torn)';
            } else if (/jail/.test(state)) {
                city = 'Jail (Torn)';
            } else if (/abroad/.test(state)) {
                city = 'Abroad (unknown city)';
            }

            return { selfId, city };
        } catch (e) {
            console.warn('[Walks] getSelfIdAndCity fetch error:', e);
            return { selfId: null, city: 'Unknown' };
        }
    }

    async function getSelfId() {
        if (cachedSelfId) return cachedSelfId;
        const result = await getSelfIdAndCity();
        return result.selfId;
    }

    function getCityKeyForSnap(snap) {
        if (snap.destination) return snap.destination;

        if (/hospital/i.test(snap.where) || /hospital/i.test(snap.state)) {
            return 'Hospital (Torn)';
        }
        if (/jail/i.test(snap.where) || /jail/i.test(snap.state)) {
            return 'Jail (Torn)';
        }

        if (/torn/i.test(snap.where)) return 'Torn';

        if (/abroad/i.test(snap.where) || /abroad/i.test(snap.state)) {
            return 'Abroad (unknown city)';
        }

        return 'Unknown';
    }

    // ---------- Unified War Board Modal ----------

    function openWarBoard() {
        injectWalksStyles();

        const modal = document.createElement('div');
        modal.className = 'walks-panel';
        Object.assign(modal.style, {
            minWidth: '560px',
            maxWidth: '880px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
        });

        const headerRow = document.createElement('div');
        Object.assign(headerRow.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
        });

        const title = document.createElement('div');
        title.textContent = 'Walks – War Board';
        title.className = 'walks-panel-title';

        const headerInfo = document.createElement('div');
        Object.assign(headerInfo.style, {
            fontSize: '10px',
            color: '#b2bec3',
            textAlign: 'right'
        });
        headerInfo.textContent = 'Import → Status → Click to attack/profile. All-in-one.';

        headerRow.appendChild(title);
        headerRow.appendChild(headerInfo);

        const statusLine = document.createElement('div');
        Object.assign(statusLine.style, {
            fontSize: '11px',
            minHeight: '16px',
            marginTop: '4px',
            marginBottom: '4px'
        });

        const body = document.createElement('div');
        body.className = 'walks-war-body';

        // ----- API row -----
        const apiRow = document.createElement('div');
        apiRow.className = 'walks-row';

        const apiLabel = document.createElement('div');
        apiLabel.className = 'walks-panel-small';
        apiLabel.textContent = 'API:';

        const apiStatus = document.createElement('div');
        apiStatus.className = 'walks-panel-small walks-row-grow';

        const apiBtn = document.createElement('button');
        apiBtn.textContent = 'Set / Test Key';
        apiBtn.className = 'walks-small-btn';

        apiRow.appendChild(apiLabel);
        apiRow.appendChild(apiStatus);
        apiRow.appendChild(apiBtn);

        // ----- Targets editor row -----
        const targetsInfo = document.createElement('div');
        targetsInfo.className = 'walks-panel-small';
        targetsInfo.innerHTML =
            'One XID per line. Comments after <span style="color:#0ff;">#</span> are ignored. ' +
            'Import Page pulls XIDs from the current Torn page (ignores your own).';

        const targetsTextarea = document.createElement('textarea');
        targetsTextarea.className = 'walks-targets-textarea';
        targetsTextarea.value = getTargetsText();

        // ----- Targets controls row -----
        const controlsRow = document.createElement('div');
        controlsRow.className = 'walks-row';

        const buttonsLeft = document.createElement('div');
        buttonsLeft.className = 'walks-row';
        buttonsLeft.style.gap = '6px';
        buttonsLeft.style.flex = '1 1 auto';

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import Page';
        importBtn.className = 'walks-small-btn';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy XIDs';
        copyBtn.className = 'walks-small-btn';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save List';
        saveBtn.className = 'walks-small-btn';

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.className = 'walks-small-btn';

        buttonsLeft.appendChild(importBtn);
        buttonsLeft.appendChild(copyBtn);
        buttonsLeft.appendChild(saveBtn);
        buttonsLeft.appendChild(clearBtn);

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh Status & Group';
        refreshBtn.className = 'walks-small-btn walks-small-btn-main';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'walks-small-btn';

        controlsRow.appendChild(buttonsLeft);
        controlsRow.appendChild(refreshBtn);
        controlsRow.appendChild(closeBtn);

        // ----- Community / Support row -----
        const communityRow = document.createElement('div');
        communityRow.className = 'walks-row';
        communityRow.style.flexWrap = 'wrap';

        const communityLabel = document.createElement('div');
        communityLabel.className = 'walks-panel-small';
        communityLabel.textContent = 'Links:';

        const forumBtn = document.createElement('button');
        forumBtn.textContent = 'Forum Thread';
        forumBtn.className = 'walks-small-btn';

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply to Faction';
        applyBtn.className = 'walks-small-btn';

        const donateBtn = document.createElement('button');
        donateBtn.textContent = 'Donate Xanax';
        donateBtn.className = 'walks-small-btn';

        const refBtn = document.createElement('button');
        refBtn.textContent = 'Referral Profile';
        refBtn.className = 'walks-small-btn';

        communityRow.appendChild(communityLabel);
        communityRow.appendChild(forumBtn);
        communityRow.appendChild(applyBtn);
        communityRow.appendChild(donateBtn);
        communityRow.appendChild(refBtn);

        // ----- Results area -----
        const results = document.createElement('div');
        results.className = 'walks-results';

        body.appendChild(apiRow);
        body.appendChild(targetsInfo);
        body.appendChild(targetsTextarea);
        body.appendChild(controlsRow);
        body.appendChild(communityRow);
        body.appendChild(results);

        modal.appendChild(headerRow);
        modal.appendChild(statusLine);
        modal.appendChild(body);

        setModalContent(modal);

        // ----- Wire up behavior -----

        function updateApiStatusText() {
            const key = getApiKey();
            if (!key) {
                apiStatus.textContent = 'No key set.';
                apiStatus.style.color = '#e74c3c';
            } else {
                apiStatus.textContent = 'Key present (stored locally).';
                apiStatus.style.color = '#2ecc71';
            }
        }
        updateApiStatusText();

        apiBtn.addEventListener('click', () => {
            openApiSubModal(() => {
                updateApiStatusText();
            });
        });

        closeBtn.addEventListener('click', closeModal);

        clearBtn.addEventListener('click', () => {
            targetsTextarea.value = '';
            setTargetsText('');
            statusLine.textContent = 'Targets list cleared.';
            statusLine.style.color = '#f39c12';
        });

        saveBtn.addEventListener('click', () => {
            setTargetsText(targetsTextarea.value);
            const ids = getTargetsArray();
            statusLine.textContent =
                'Saved. Parsed ' + ids.length + ' unique target ID(s).';
            statusLine.style.color = '#2ecc71';
        });

        importBtn.addEventListener('click', async () => {
            const links = Array.from(
                document.querySelectorAll("a[href*='profiles.php?XID=']")
            );
            const found = new Set();

            links.forEach((a) => {
                const m = a.href.match(/XID=(\d+)/);
                if (m) found.add(m[1]);
            });

            if (!found.size) {
                statusLine.textContent =
                    'No profile IDs found on this page. Try your Torn Target List page.';
                statusLine.style.color = '#e74c3c';
                return;
            }

            const selfId = await getSelfId();
            const existingLines = targetsTextarea.value
                ? targetsTextarea.value.trim().split(/\r?\n/)
                : [];
            const existingIds = new Set();
            existingLines.forEach((line) => {
                const m = line.match(/\d+/);
                if (m) existingIds.add(m[0]);
            });

            const combinedLines = existingLines.slice();
            let newCount = 0;
            let skippedSelf = 0;

            found.forEach((id) => {
                if (selfId && id === selfId) {
                    skippedSelf++;
                    return; // ignore your own XID
                }
                if (!existingIds.has(id)) {
                    combinedLines.push(id);
                    newCount++;
                }
            });

            targetsTextarea.value = combinedLines.join('\n');
            setTargetsText(targetsTextarea.value);
            const ids = getTargetsArray();

            statusLine.textContent =
                'Imported ' +
                found.size +
                ' ID(s) from page. ' +
                newCount +
                ' new. Total ' +
                ids.length +
                ' unique target(s).' +
                (skippedSelf ? ' (Skipped your own XID.)' : '');
            statusLine.style.color = '#2ecc71';
        });

        copyBtn.addEventListener('click', () => {
            setTargetsText(targetsTextarea.value);
            const ids = getTargetsArray();
            if (!ids.length) {
                statusLine.textContent =
                    'No valid XIDs to copy. Check your list.';
                statusLine.style.color = '#e74c3c';
                return;
            }
            const payload = ids.join('\n');
            navigator.clipboard.writeText(payload)
                .then(() => {
                    statusLine.textContent =
                        'Copied ' + ids.length + ' XID(s) to clipboard.';
                    statusLine.style.color = '#2ecc71';
                })
                .catch(() => {
                    statusLine.textContent =
                        'Failed to copy XIDs (clipboard error).';
                    statusLine.style.color = '#e74c3c';
                });
        });

        refreshBtn.addEventListener('click', () => {
            setTargetsText(targetsTextarea.value);
            refreshStatusesAndRender(statusLine, results);
        });

        // --- Community buttons ---

        forumBtn.addEventListener('click', () => {
            window.open(
                'https://www.torn.com/forums.php#/p=threads&f=67&t=16518244&b=0&a=0&start=0&to=26658692',
                '_blank'
            );
        });

        applyBtn.addEventListener('click', () => {
            window.open(
                'https://www.torn.com/factions.php?step=profile&ID=51067',
                '_blank'
            );
        });

        donateBtn.addEventListener('click', () => {
            const xid = '3163918';
            navigator.clipboard.writeText(xid)
                .then(() => {
                    statusLine.textContent =
                        'Copied my XID (' +
                        xid +
                        ') to clipboard. Paste as recipient on the item page.';
                    statusLine.style.color = '#2ecc71';
                    window.open('https://www.torn.com/item.php', '_blank');
                })
                .catch(() => {
                    statusLine.textContent =
                        'Clipboard blocked. My XID is ' +
                        xid +
                        '. Opening item page…';
                    statusLine.style.color = '#f39c12';
                    window.open('https://www.torn.com/item.php', '_blank');
                });
        });

        refBtn.addEventListener('click', () => {
            window.open('https://www.torn.com/3163918', '_blank');
        });

        // If key already set and there are targets, auto-refresh once on open
        if (getApiKey() && getTargetsArray().length) {
            refreshStatusesAndRender(statusLine, results);
        }
    }

    // ---------- Mini API sub-modal (inside main board) ----------

    function openApiSubModal(onDone) {
        const existingKey = getApiKey();

        const sub = document.createElement('div');
        sub.className = 'walks-panel';
        Object.assign(sub.style, {
            minWidth: '320px',
            maxWidth: '420px'
        });

        const title = document.createElement('div');
        title.textContent = 'Walks – API Key';
        title.className = 'walks-panel-title';
        Object.assign(title.style, {
            marginBottom: '8px'
        });

        const info = document.createElement('div');
        info.textContent =
            'Enter your Torn API key. Stored locally and used only for Torn API calls (user/basic).';
        info.className = 'walks-panel-small';
        Object.assign(info.style, { marginBottom: '8px' });

        const label = document.createElement('label');
        label.textContent = 'API key:';
        Object.assign(label.style, {
            fontSize: '11px',
            display: 'block',
            marginBottom: '4px'
        });

        const input = document.createElement('input');
        input.type = 'password';
        input.value = existingKey;
        input.placeholder = 'Paste your API key here';
        Object.assign(input.style, {
            width: '100%',
            boxSizing: 'border-box',
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid #00faff',
            outline: 'none',
            marginBottom: '8px',
            background: '#000',
            color: '#f1f1f1',
            fontSize: '12px',
            boxShadow: '0 0 6px rgba(0,255,255,0.4)'
        });

        const statusLine = document.createElement('div');
        Object.assign(statusLine.style, {
            fontSize: '11px',
            minHeight: '16px',
            marginBottom: '8px'
        });

        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
        });

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.className = 'walks-small-btn';

        const testBtn = document.createElement('button');
        testBtn.textContent = 'Test';
        testBtn.className = 'walks-small-btn';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'walks-small-btn';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'walks-small-btn';

        btnRow.appendChild(clearBtn);
        btnRow.appendChild(testBtn);
        btnRow.appendChild(saveBtn);
        btnRow.appendChild(closeBtn);

        clearBtn.addEventListener('click', () => {
            input.value = '';
            setApiKey('');
            cachedSelfId = null;
            statusLine.textContent = 'API key cleared.';
            statusLine.style.color = '#f39c12';
        });

        saveBtn.addEventListener('click', () => {
            const key = input.value.trim();
            if (!key) {
                statusLine.textContent = 'Please paste a valid API key.';
                statusLine.style.color = '#e74c3c';
                return;
            }
            setApiKey(key);
            cachedSelfId = null;
            statusLine.textContent = 'API key saved.';
            statusLine.style.color = '#2ecc71';
            if (onDone) onDone();
        });

        testBtn.addEventListener('click', async () => {
            const key = input.value.trim();
            if (!key) {
                statusLine.textContent = 'Enter an API key first.';
                statusLine.style.color = '#e74c3c';
                return;
            }

            statusLine.textContent = 'Testing API key…';
            statusLine.style.color = '#f1c40f';

            try {
                const url =
                    'https://api.torn.com/user/0?selections=basic&key=' +
                    encodeURIComponent(key);
                const resp = await fetch(url);
                const data = await resp.json();

                if (data && data.error) {
                    statusLine.textContent = 'Error: ' + data.error.error;
                    statusLine.style.color = '#e74c3c';
                } else {
                    console.log('[Walks] API test success:', data);
                    statusLine.textContent = 'API key works.';
                    statusLine.style.color = '#2ecc71';
                }
            } catch (e) {
                statusLine.textContent =
                    'Network/Fetch error when testing key.';
                statusLine.style.color = '#e74c3c';
            }
        });

        closeBtn.addEventListener('click', () => {
            closeModal();
            // reopen main board after closing sub-modal
            openWarBoard();
        });

        sub.appendChild(title);
        sub.appendChild(info);
        sub.appendChild(label);
        sub.appendChild(input);
        sub.appendChild(statusLine);
        sub.appendChild(btnRow);

        setModalContent(sub);
    }

    // ---------- Refresh statuses + grouped render in one go ----------

    async function refreshStatusesAndRender(statusLine, resultsContainer) {
        const apiKey = getApiKey();
        if (!apiKey) {
            statusLine.textContent =
                'No API key set. Click "Set / Test Key" first.';
            statusLine.style.color = '#e74c3c';
            resultsContainer.innerHTML = '';
            return;
        }

        const ids = getTargetsArray();
        if (!ids.length) {
            statusLine.textContent =
                'No targets configured. Import from page or add XIDs manually.';
            statusLine.style.color = '#e74c3c';
            resultsContainer.innerHTML = '';
            return;
        }

        statusLine.textContent =
            'Fetching status for ' + ids.length + ' target(s)…';
        statusLine.style.color = '#f1c40f';
        resultsContainer.innerHTML = '';

        // clear old snapshot
        for (const k in targetTravelSnapshot) {
            if (Object.prototype.hasOwnProperty.call(targetTravelSnapshot, k)) {
                delete targetTravelSnapshot[k];
            }
        }

        const { city: myCity } = await getSelfIdAndCity();

        let index = 0;
        for (const xid of ids) {
            index++;
            try {
                const url =
                    'https://api.torn.com/user/' +
                    encodeURIComponent(xid) +
                    '?selections=basic&key=' +
                    encodeURIComponent(apiKey);
                const resp = await fetch(url);
                const data = await resp.json();

                if (data && data.error) {
                    console.warn('[Walks] API error for', xid, data.error);
                    // mark as error in snapshot so it shows up
                    targetTravelSnapshot[xid] = {
                        xid,
                        name: '(error)',
                        state: 'Error',
                        where: 'Unknown',
                        destination: null,
                        traveling: false,
                        timeLeft: null,
                        description: data.error.error || 'API error',
                        details: ''
                    };
                } else {
                    updateTravelSnapshotFromApi(xid, data);
                }
            } catch (e) {
                console.warn('[Walks] fetch error for', xid, e);
                targetTravelSnapshot[xid] = {
                    xid,
                    name: '(error)',
                    state: 'Error',
                    where: 'Unknown',
                    destination: null,
                    traveling: false,
                    timeLeft: null,
                    description: 'Network/fetch error',
                    details: ''
                };
            }

            statusLine.textContent =
                'Fetched ' + index + ' / ' + ids.length + ' target(s)…';
        }

        // Build grouped view
        renderGroupedResults(ids, myCity, resultsContainer);

        statusLine.textContent =
            'Done. Fetched ' + ids.length + ' target(s). You are in: ' + myCity + '.';
        statusLine.style.color = '#2ecc71';

        console.log('[Walks] snapshot after refresh:', targetTravelSnapshot);
    }

    function renderGroupedResults(ids, myCity, container) {
        container.innerHTML = '';

        // construct entries in input list order, ignoring any stray snapshot keys
        const entries = [];
        ids.forEach((id) => {
            const snap = targetTravelSnapshot[id];
            if (snap) entries.push(snap);
        });
        if (!entries.length) {
            const msg = document.createElement('div');
            msg.className = 'walks-panel-small';
            msg.textContent = 'No entries to display.';
            msg.style.padding = '6px';
            container.appendChild(msg);
            return;
        }

        const grouped = {};
        entries.forEach((snap) => {
            const cityKey = getCityKeyForSnap(snap);
            if (!grouped[cityKey]) grouped[cityKey] = [];
            grouped[cityKey].push(snap);
        });

        const cityKeys = Object.keys(grouped).sort((a, b) => {
            if (a === myCity) return -1;
            if (b === myCity) return 1;
            return a.localeCompare(b);
        });

        cityKeys.forEach((cityKey) => {
            const snaps = grouped[cityKey];

            const header = document.createElement('div');
            header.className = 'walks-city-header';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'walks-city-name';
            nameSpan.textContent =
                cityKey + (cityKey === myCity ? '  (YOU)' : '');

            const countSpan = document.createElement('span');
            countSpan.className = 'walks-city-count';
            countSpan.textContent = snaps.length + ' target(s)';

            header.appendChild(nameSpan);
            header.appendChild(countSpan);

            const targetList = document.createElement('div');
            targetList.className = 'walks-target-list';

            snaps.forEach((snap) => {
                const row = document.createElement('div');
                row.className = 'walks-target-row';

                const state = snap.state || 'Unknown';
                const where = snap.where || '';
                const desc = snap.description || '';
                const details = snap.details || '';
                const sameCity =
                    cityKey === myCity ||
                    (where && myCity && where.indexOf(myCity) !== -1);

                // Color rule:
                // - red if hospital/jail anywhere
                // - green if local + "Okay"
                // - yellow if traveling/abroad
                // - grey otherwise
                let color = '#bdc3c7';
                if (/hospital|jail/i.test(state) || /hospital|jail/i.test(where)) {
                    color = '#e74c3c';
                } else if (sameCity && /okay/i.test(state)) {
                    color = '#2ecc71';
                } else if (/travel|abroad/i.test(state) || /travel|abroad/i.test(where)) {
                    color = '#f1c40f';
                }
                row.style.borderLeftColor = color;

                const link = document.createElement('a');
                if (sameCity && /okay/i.test(state)) {
                    // local & okay → attack
                    link.href =
                        'https://www.torn.com/loader.php?sid=attack&user2ID=' +
                        snap.xid;
                } else {
                    // otherwise profile
                    link.href =
                        'https://www.torn.com/profiles.php?XID=' + snap.xid;
                }
                link.target = '_blank';
                link.textContent =
                    (snap.name || '(unknown)') +
                    ' [' +
                    snap.xid +
                    '] – ' +
                    state;

                const extra = document.createElement('span');
                extra.textContent =
                    '  |  ' +
                    where +
                    (desc || details ? '  |  ' + (desc || '') + (details ? ' | ' + details : '') : '');

                row.appendChild(link);
                row.appendChild(extra);

                targetList.appendChild(row);
            });

            header.addEventListener('click', () => {
                const visible = targetList.style.display !== 'none';
                targetList.style.display = visible ? 'none' : 'block';
            });

            // Default: open YOUR city and Hospital
            if (cityKey === myCity || /Hospital/.test(cityKey)) {
                targetList.style.display = 'block';
            } else {
                targetList.style.display = 'none';
            }

            container.appendChild(header);
            container.appendChild(targetList);
        });
    }

    // ---------- WALKS button ----------

    function createWalksButton() {
        injectWalksStyles();

        const container = document.createElement('div');
        container.id = 'walks-button-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-end'
        });

        const walksBtn = document.createElement('button');
        walksBtn.id = 'walks-button-main';
        walksBtn.textContent = 'WALKS';
        walksBtn.className = 'walks-button-main';
        Object.assign(walksBtn.style, {
            padding: '10px 18px',
            borderRadius: '8px',
            border: '2px solid #00faff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '1px',
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#00faff',
            fontFamily: 'Consolas, monospace',
            boxShadow:
                '0 0 8px #00faff, 0 0 16px rgba(0,255,255,0.4), inset 0 0 6px rgba(0,255,255,0.3)',
            transition: '0.2s ease-in-out'
        });
        walksBtn.addEventListener('mouseenter', function () {
            walksBtn.style.transform = 'scale(1.08)';
            walksBtn.style.boxShadow =
                '0 0 12px #00faff, 0 0 24px rgba(0,255,255,0.7), inset 0 0 10px rgba(0,255,255,0.6)';
            walksBtn.style.borderColor = '#0ff';
        });
        walksBtn.addEventListener('mouseleave', function () {
            walksBtn.style.transform = 'scale(1.0)';
            walksBtn.style.boxShadow =
                '0 0 8px #00faff, 0 0 16px rgba(0,255,255,0.4), inset 0 0 6px rgba(0,255,255,0.3)';
            walksBtn.style.borderColor = '#00faff';
        });
        walksBtn.addEventListener('click', function () {
            const apiKey = getApiKey();
            if (!apiKey) {
                // First time: go straight to API sub-modal so user isn't confused
                openApiSubModal(() => {
                    openWarBoard();
                });
            } else {
                openWarBoard();
            }
        });

        container.appendChild(walksBtn);
        document.body.appendChild(container);
    }

    // ---------- Init ----------

    function init() {
        if (
            document.readyState === 'complete' ||
            document.readyState === 'interactive'
        ) {
            createWalksButton();
        } else {
            document.addEventListener('DOMContentLoaded', createWalksButton);
        }
    }

    init();

})();