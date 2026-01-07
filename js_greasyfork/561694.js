// ==UserScript==
// @name         [RED] Search Collector
// @version      0.1
// @description  Download multiple torrents by criteria from search results on Redacted.sh
// @author       kitschmensch
// @match        https://redacted.sh/torrents.php*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM.xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      redacted.sh
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @namespace    https://redacted.sh
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/561694/%5BRED%5D%20Search%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/561694/%5BRED%5D%20Search%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run on search pages (torrents.php without a specific torrent id)
    const wH = window.location.href;
    if (wH.indexOf('torrents.php') === -1) return;
    if (wH.indexOf('?id=') !== -1) return;
    if (wH.indexOf('action=notify') !== -1) return;

    const gmRequest = (() => {
        if (typeof GM !== 'undefined') {
            if (typeof GM.xmlHttpRequest === 'function') return GM.xmlHttpRequest;
            if (typeof GM.xmlhttpRequest === 'function') return GM.xmlhttpRequest;
        }
        if (typeof GM_xmlhttpRequest === 'function') return GM_xmlhttpRequest;
        return null;
    })();

    const pageFetch = (() => {
        if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.fetch === 'function') {
            return unsafeWindow.fetch.bind(unsafeWindow);
        }
        if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
            return window.fetch.bind(window);
        }
        return null;
    })();

    let collectorState = getSettings();
    let lastRequestTime = 0;

    // Initialize the collector
    initSearchCollector();

    async function initSearchCollector() {
        // Create the collector UI
        createCollectorUI();
        // If the API key is missing, prompt once and persist it
        await maybePromptForApiKey();
    }

    function createCollectorUI() {
        const submitRow = document.querySelector('.search_form .submit.ft_submit') || document.querySelector('.submit.ft_submit');
        if (!submitRow) return;

        const settings = getSettings();
        const state = {
            apiKey: settings.apiKey || collectorState.apiKey || ''
        };
        collectorState = { ...settings, ...state };

        const box = document.createElement('div');
        box.className = 'box';

        const head = document.createElement('div');
        head.className = 'head';
        const title = document.createElement('strong');
        title.textContent = 'Search Collector';
        const toggle = document.createElement('a');
        toggle.href = '#';
        toggle.className = 'brackets';
        toggle.id = 'collector-toggle';
        toggle.textContent = 'Hide';
        head.appendChild(title);
        head.appendChild(document.createTextNode(' '));
        head.appendChild(toggle);
        box.appendChild(head);

        const pad = document.createElement('div');
        pad.className = 'pad';

        const table = document.createElement('table');
        table.className = 'layout';

        table.appendChild(buildRow('Results depth', buildInput('number', 'collector-depth', settings.depth, 80, 1, 1000)));
        table.appendChild(buildRow('Selection mode', buildSelectionSelect(settings.selectionMode)));

        pad.appendChild(table);

        const actions = document.createElement('div');
        actions.className = 'collector-actions';
        actions.style.display = 'flex';
        actions.style.justifyContent = 'space-between';
        actions.style.alignItems = 'center';

        const leftActions = document.createElement('div');
        leftActions.className = 'collector-actions-left';

        const setKeyBtn = document.createElement('button');
        setKeyBtn.type = 'button';
        setKeyBtn.id = 'collector-set-apikey';
        setKeyBtn.textContent = 'Set API Key';
        leftActions.appendChild(setKeyBtn);

        const rightActions = document.createElement('div');
        rightActions.className = 'collector-actions-right';
        rightActions.style.display = 'flex';
        rightActions.style.alignItems = 'center';
        rightActions.style.gap = '8px';

        const previewBtnEl = document.createElement('button');
        previewBtnEl.type = 'button';
        previewBtnEl.id = 'collector-preview';
        previewBtnEl.textContent = 'Preview';

        const sizeBox = document.createElement('span');
        sizeBox.id = 'collector-total-size';
        sizeBox.textContent = 'Total Size: --';
        sizeBox.style.display = 'inline-block';
        sizeBox.style.width = '150px';

        const collectBtnEl = document.createElement('button');
        collectBtnEl.type = 'button';
        collectBtnEl.id = 'collector-collect';
        collectBtnEl.textContent = 'Collect';
        collectBtnEl.disabled = true;

        rightActions.appendChild(previewBtnEl);
        rightActions.appendChild(sizeBox);
        rightActions.appendChild(collectBtnEl);

        actions.appendChild(leftActions);
        actions.appendChild(rightActions);
        pad.appendChild(actions);

        const messageDiv = document.createElement('div');
        messageDiv.id = 'collector-message';
        pad.appendChild(messageDiv);

        box.appendChild(pad);
        submitRow.insertAdjacentElement('afterend', box);

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const hidden = pad.style.display === 'none';
            pad.style.display = hidden ? '' : 'none';
            toggle.textContent = hidden ? 'Hide' : 'Show';
        });

        const previewBtn = document.getElementById('collector-preview');
        const collectBtn = document.getElementById('collector-collect');

        previewBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            previewBtn.disabled = true;
            collectBtn.disabled = true;
            let ok = false;
            try {
                ok = await previewTorrents();
            } finally {
                collectBtn.disabled = !ok;
                previewBtn.disabled = false;
            }
        });

        collectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            collectTorrents();
        });

        ['collector-depth', 'collector-selection-mode'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => saveCurrentSettings(state));
                el.addEventListener('keyup', () => saveCurrentSettings(state));
            }
        });

        const setKeyLink = document.getElementById('collector-set-apikey');
        if (setKeyLink) {
            setKeyLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await maybePromptForApiKey(true, true);
            });
        }

        function buildRow(label, inputEl) {
            const tr = document.createElement('tr');
            const tdLabel = document.createElement('td');
            tdLabel.textContent = label;
            const tdInput = document.createElement('td');
            tdInput.appendChild(inputEl);
            tr.appendChild(tdLabel);
            tr.appendChild(tdInput);
            return tr;
        }

        function buildInput(type, id, value, width, min, max) {
            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.value = value;
            input.style.width = `${width}px`;
            if (min !== undefined) input.min = min;
            if (max !== undefined) input.max = max;
            return input;
        }

        function buildSelectionSelect(current) {
            const select = document.createElement('select');
            select.id = 'collector-selection-mode';
            select.style.width = '220px';

            const options = [
                { value: 'best_seeded', label: 'Prefer Best Seeded' },
                { value: 'oldest_upload', label: 'Prefer Oldest Upload' },
                { value: 'bonus_tracks', label: 'Prefer Bonus Tracks' }
            ];

            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                select.appendChild(o);
            });

            select.value = current || 'best_seeded';
            return select;
        }
    }

    function getSettings() {
        const defaults = {
            apiKey: '',
            depth: 50,
            selectionMode: 'best_seeded'
        };

        try {
            const saved = localStorage.getItem('redactedSearchCollectorSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...defaults, ...parsed };
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }

        return defaults;
    }

    async function maybePromptForApiKey(force = false, alwaysPrompt = false) {
        if (!force && collectorState.apiKey) return collectorState.apiKey;

        if (!alwaysPrompt) {
            const stored = await getStoredApiKey();
            if (stored) {
                collectorState.apiKey = stored;
                saveCurrentSettings();
                return stored;
            }
        }

        const key = window.prompt('Enter your Redacted API key (needed for downloads). You can generate it in User Settings -> Access Keys.');
        if (key && key.trim()) {
            collectorState.apiKey = key.trim();
            saveCurrentSettings();
            await setStoredApiKey(key.trim());
            return key.trim();
        }

        return '';
    }

    async function getStoredApiKey() {
        try {
            if (typeof GM_getValue === 'function') {
                const val = await GM_getValue('redactedCollectorApiKey');
                if (val) return val;
            }
        } catch (e) {
            console.warn('GM_getValue failed, falling back to localStorage:', e);
        }

        try {
            const saved = localStorage.getItem('redactedCollectorApiKey');
            return saved || '';
        } catch (e) {
            return '';
        }
    }

    async function setStoredApiKey(val) {
        try {
            if (typeof GM_setValue === 'function') {
                await GM_setValue('redactedCollectorApiKey', val);
            }
        } catch (e) {
            console.warn('GM_setValue failed, using localStorage:', e);
        }

        try {
            localStorage.setItem('redactedCollectorApiKey', val);
        } catch (e) {
            console.warn('localStorage set failed:', e);
        }
    }

    function saveCurrentSettings(stateOverride) {
        const inputVal = (id, fallback = '') => {
            const el = document.getElementById(id);
            return el ? el.value : fallback;
        };

        const state = stateOverride || collectorState || getSettings();

        const selectionEl = document.getElementById('collector-selection-mode');

        const settings = {
            apiKey: state.apiKey || '',
            depth: parseInt(inputVal('collector-depth', state.depth || 50), 10) || 50,
            selectionMode: selectionEl ? selectionEl.value : (state.selectionMode || 'best_seeded')
        };

        collectorState = { ...settings };
        localStorage.setItem('redactedSearchCollectorSettings', JSON.stringify(settings));
        return settings;
    }

    function getCurrentSearchParams() {
        const url = new URL(window.location.href);
        const params = {};

        // Get all search parameters from URL
        const relevantParams = [
            'searchstr', 'artistname', 'groupname', 'recordlabel', 'cataloguenumber',
            'year', 'remastertitle', 'remasteryear', 'remasterrecordlabel',
            'remastercataloguenumber', 'filelist', 'encoding', 'format', 'media',
            'releasetype', 'haslog', 'hascue', 'scene', 'vanityhouse', 'freetorrent',
            'taglist', 'tags_type', 'order_by', 'order_way', 'group_results'
        ];

        relevantParams.forEach(param => {
            const value = url.searchParams.get(param);
            if (value) {
                params[param] = value;
            }
        });

        // Handle filter_cat array
        url.searchParams.forEach((value, key) => {
            if (key.startsWith('filter_cat')) {
                params[key] = value;
            }
        });

        return params;
    }

    function showMessage(msg, isError = false) {
        const messageDiv = document.getElementById('collector-message');
        messageDiv.innerHTML = msg;
        messageDiv.className = 'collector-message' + (isError ? ' collector-error' : '');
    }

    function setTotalSizeDisplay(text) {
        const el = document.getElementById('collector-total-size');
        if (el) {
            el.textContent = text;
        }
    }

    async function ensureRateLimit() {
        const now = Date.now();
        const elapsed = now - lastRequestTime;
        if (elapsed < 1000) {
            await sleep(1000 - elapsed);
        }
        lastRequestTime = Date.now();
    }

    async function authRequest(url, responseType = 'json') {
        await ensureRateLimit();

        const settings = saveCurrentSettings();
        let useApiKey = Boolean(settings.apiKey);

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json'
        };
        if (useApiKey) {
            headers.Authorization = settings.apiKey;
        }

        // The download endpoint requires an API key; if missing, prompt once
        if (!useApiKey && url.searchParams && url.searchParams.get('action') === 'download') {
            const maybe = await maybePromptForApiKey(true);
            if (maybe) {
                settings.apiKey = maybe;
                useApiKey = true;
                headers.Authorization = maybe;
            } else {
                throw new Error('Download requires an API key. Use Set API Key to add it.');
            }
        }

        // Prefer GM first (sends cookies by default); fall back to page fetch
        if (gmRequest) {
            const requestDetails = {
                method: 'GET',
                url: url.toString(),
                headers,
                responseType: responseType === 'arraybuffer' ? 'arraybuffer' : undefined,
                withCredentials: true,
                anonymous: false,
                onload: function(response) {
                    // Only used by callback-style GM APIs
                },
                onerror: function() {
                    // Only used by callback-style GM APIs
                }
            };

            try {
                const gmResult = gmRequest(requestDetails);
                // Greasemonkey 4+ returns a Promise; Tampermonkey/VM use callbacks
                if (gmResult && typeof gmResult.then === 'function') {
                    return gmResult.then((response) => {
                        if (response.status !== 200) {
                            throw new Error(`Request failed: ${response.status}`);
                        }
                        const text = typeof response.responseText === 'string' ? response.responseText : (typeof response.response === 'string' ? response.response : '');
                        if (responseType === 'arraybuffer') {
                            return new Uint8Array(response.response);
                        }
                        return JSON.parse(text);
                    }).catch((err) => {
                        throw new Error('Network error (GM promise): ' + (err && err.message ? err.message : 'unknown'));
                    });
                }

                // Callback-style GM_xmlhttpRequest
                return new Promise((resolve, reject) => {
                    gmRequest({
                        ...requestDetails,
                        onload: function(response) {
                            if (response.status !== 200) {
                                reject(new Error(`Request failed: ${response.status}`));
                                return;
                            }

                            try {
                                if (responseType === 'arraybuffer') {
                                    resolve(new Uint8Array(response.response));
                                } else {
                                    const text = typeof response.responseText === 'string' ? response.responseText : (typeof response.response === 'string' ? response.response : '');
                                    resolve(JSON.parse(text));
                                }
                            } catch (e) {
                                reject(new Error('Failed to parse response'));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error('Network error (GM): ' + (error && error.responseText ? error.responseText : 'unknown')));
                        }
                    });
                });
            } catch (err) {
                console.error('GM request failed, falling back to page fetch:', err);
            }
        }

        if (!pageFetch) {
            throw new Error('No fetch available. Ensure GM_xmlhttpRequest/page fetch are allowed and that you are logged in.');
        }

        try {
            const resp = await pageFetch(url.toString(), { headers, credentials: 'include' });
            if (!resp.ok) {
                throw new Error(`Request failed: ${resp.status}`);
            }

            if (responseType === 'arraybuffer') {
                return new Uint8Array(await resp.arrayBuffer());
            }

            return await resp.json();
        } catch (e) {
            const context = useApiKey ? 'API key' : 'session cookie';
            throw new Error(`Network error (${context} fetch). Make sure your API keys is set.`);
        }
    }

    async function fetchSearchResults(params, page = 1) {
        const settings = saveCurrentSettings();

        const url = new URL('https://redacted.sh/ajax.php');
        url.searchParams.set('action', 'browse');
        url.searchParams.set('page', page.toString());

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        const data = await authRequest(url, 'json');
        if (data.status === 'success') {
            return data.response;
        }

        throw new Error(data.error || 'API request failed');
    }

    async function fetchTorrentGroup(groupId) {
        const url = new URL('https://redacted.sh/ajax.php');
        url.searchParams.set('action', 'torrentgroup');
        url.searchParams.set('id', groupId);

        const data = await authRequest(url, 'json');
        if (data.status === 'success') {
            return data.response || {};
        }

        throw new Error(data.error || 'Torrent group request failed');
    }

    async function downloadTorrentFile(torrentId) {
        const url = new URL('https://redacted.sh/ajax.php');
        url.searchParams.set('action', 'download');
        url.searchParams.set('id', torrentId);

        return authRequest(url, 'arraybuffer');
    }

    function getUploadTimestamp(torrent) {
        const raw = torrent.time || torrent.added || torrent.uploadTime || torrent.uploaded;
        if (typeof raw === 'number') return raw;
        const parsed = Date.parse(raw);
        return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
    }

    function selectTorrentForGroup(torrents, mode) {
        if (!torrents || torrents.length === 0) return null;

        const comparator = {
            best_seeded: (a, b) => {
                if (b.seeders !== a.seeders) return b.seeders - a.seeders;
                return getUploadTimestamp(a) - getUploadTimestamp(b); // older first
            },
            oldest_upload: (a, b) => getUploadTimestamp(a) - getUploadTimestamp(b),
            bonus_tracks: (a, b) => {
                const filesA = a.fileCount || 0;
                const filesB = b.fileCount || 0;
                if (filesB !== filesA) return filesB - filesA; // more files first
                if (b.seeders !== a.seeders) return b.seeders - a.seeders; // more seeders next
                return getUploadTimestamp(a) - getUploadTimestamp(b); // older last tie-breaker
            }
        }[mode || 'best_seeded'];

        return [...torrents].sort(comparator)[0];
    }

    async function previewTorrents() {
        const settings = saveCurrentSettings();
        const searchParams = getCurrentSearchParams();

        showMessage('');
        setTotalSizeDisplay('Fetching Page 1...');

        try {
            const depth = settings.depth;
            let allGroups = [];
            let totalPages = 1;

            for (let page = 1; allGroups.length < depth && page <= totalPages; page++) {
                setTotalSizeDisplay(`Fetching Page ${page}...`);

                const response = await fetchSearchResults(searchParams, page);
                totalPages = response.pages;

                const groups = response.results || [];
                allGroups = allGroups.concat(groups);

                // Rate limiting - wait between requests
                if (allGroups.length < depth && page < totalPages) {
                    await sleep(1000);
                }
            }

            // Trim to requested depth (if fewer were returned, this is a no-op)
            allGroups = allGroups.slice(0, depth);

            // Process groups and pick one torrent per group based on selection mode
            const torrentsToDownload = [];
            let totalSize = 0;

            for (const group of allGroups) {
                let torrents = group.torrents || [];

                // If browse response is empty (e.g., filters trimmed the list), try a direct torrentgroup fetch
                if ((!torrents || torrents.length === 0) && group.groupId) {
                    try {
                        const fallback = await fetchTorrentGroup(group.groupId);
                        const fromFallback = fallback.torrents || (fallback.torrentgroup ? fallback.torrentgroup.torrents : []);
                        if (fromFallback && fromFallback.length > 0) {
                            torrents = fromFallback;
                            console.warn('Collector: used torrentgroup fallback for empty browse result', {
                                groupId: group.groupId,
                                fetched: fromFallback.length
                            });
                        }
                    } catch (e) {
                        console.warn('Collector: torrentgroup fallback failed', {
                            groupId: group.groupId,
                            error: e && e.message ? e.message : e
                        });
                    }
                }

                const selected = selectTorrentForGroup(torrents, settings.selectionMode);

                if (!selected) {
                    console.warn('Collector: no eligible torrents in group', {
                        groupId: group.groupId,
                        artist: group.artist,
                        album: group.groupName,
                        torrents: torrents
                    });
                    continue;
                }

                const artist = group.artist || 'Unknown Artist';
                const album = group.groupName || 'Unknown Album';
                const filename = sanitizeFilename(`${artist} - ${album} - ${selected.format}_${selected.encoding}_${selected.media} - ${selected.torrentId}.torrent`);

                torrentsToDownload.push({
                    id: selected.torrentId,
                    name: filename,
                    groupId: group.groupId,
                    artist: artist,
                    album: album,
                    format: selected.format,
                    encoding: selected.encoding,
                    media: selected.media,
                    size: selected.size
                });

                totalSize += selected.size;
            }

            // Store results for collection
            window.collectorTorrents = torrentsToDownload;
            window.collectorSummary = {
                totalGroups: allGroups.length,
                matchedTorrents: torrentsToDownload.length,
                groupsWithNoMatch: 0,
                totalSize: totalSize,
                selectionMode: settings.selectionMode
            };

            const totalSizeText = `Total Size: ${formatSize(totalSize)}`;
            showMessage('');
            setTotalSizeDisplay(totalSizeText);

            return true;

        } catch (error) {
            showMessage(`Error: ${error.message}`, true);
            setTotalSizeDisplay('Total Size: --');
            console.error('Preview error:', error);
            throw error;
        }
    }

    async function collectTorrents() {
        if (!window.collectorTorrents || window.collectorTorrents.length === 0) {
            showMessage('Please run Preview first to select torrents.', true);
            return;
        }

        const torrents = window.collectorTorrents;
        const summary = window.collectorSummary;
        const settings = saveCurrentSettings();

        try {
            const zip = new JSZip();
            let downloaded = 0;
            let errors = 0;

            for (const torrent of torrents) {
                showMessage(`<div class="collector-progress">Downloading ${downloaded + 1} of ${torrents.length}...<br>${torrent.name}</div>`);

                try {
                    const data = await downloadTorrentFile(torrent.id);
                    zip.file(torrent.name, data);
                    downloaded++;
                } catch (e) {
                    console.error(`Error downloading ${torrent.id}:`, e);
                    errors++;
                }

                // Rate limiting
                await sleep(1000);
            }

            // Add summary file
            const summaryText = generateSummaryText(summary, torrents, settings);
            zip.file('_collection_summary.txt', summaryText);

            showMessage('Generating ZIP file...');

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);

            const searchDesc = getSearchDescription();
            const filename = `Redacted Search Collection - ${searchDesc}.zip`;

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.innerHTML = `<span class="collector-success">Download Ready: ${filename}</span>`;

            const messageDiv = document.getElementById('collector-message');
            messageDiv.innerHTML = '';
            messageDiv.appendChild(link);
            messageDiv.innerHTML += `<br>Downloaded: ${downloaded}, Errors: ${errors}`;

        } catch (error) {
            showMessage(`Error: ${error.message}`, true);
            console.error('Collection error:', error);
        }
    }

    function generateSummaryText(summary, torrents, settings) {
        const searchDesc = getSearchDescription();

        let text = `Redacted Search Collection\n`;
        text += `Search: ${searchDesc}\n`;
        text += `Date: ${new Date().toISOString()}\n\n`;

        text += `=== Statistics ===\n`;
        text += `Groups analyzed: ${summary.totalGroups}\n`;
        text += `Torrents downloaded: ${summary.matchedTorrents}\n`;
        text += `Groups with no eligible torrents: ${summary.groupsWithNoMatch}\n`;
        text += `Total size: ${formatSize(summary.totalSize)}\n\n`;

        text += `=== Filters Used ===\n`;
        text += `Depth: ${settings.depth}\n`;
        text += `Selection mode: ${settings.selectionMode}\n\n`;

        text += `=== Torrents Downloaded ===\n`;
        torrents.forEach((t, i) => {
            text += `${i + 1}. ${t.artist} - ${t.album}\n`;
            text += `   Format: ${t.format} / ${t.encoding} / ${t.media}\n`;
            text += `   Size: ${formatSize(t.size)}\n`;
            text += `   ID: ${t.id}\n\n`;
        });

        return text;
    }

    function getSearchDescription() {
        const params = getCurrentSearchParams();
        const parts = [];

        if (params.artistname) parts.push(params.artistname);
        if (params.groupname) parts.push(params.groupname);
        if (params.searchstr) parts.push(params.searchstr);
        if (params.taglist) parts.push(`tags:${params.taglist}`);
        if (params.year) parts.push(`year:${params.year}`);

        return parts.length > 0 ? parts.join(' - ') : 'All Results';
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 200);
    }

    function formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})();
