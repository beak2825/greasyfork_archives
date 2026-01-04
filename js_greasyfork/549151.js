// ==UserScript==
// @name         Civitai Better Model Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a floating search panel to Civitai with saved filters, infinite scroll, and No BS Unintuitive Filters.
// @author       AndroidXL
// @match        https://civitai.com/*
// @connect      search-new.civitai.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/549151/Civitai%20Better%20Model%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/549151/Civitai%20Better%20Model%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE MANAGEMENT ---
    let currentOffset = 0;
    let isLoading = false;
    let hasMore = true;
    let currentQueryPayload = null;

    // --- CONFIGURATION ---
    const API_URL = "https://search-new.civitai.com/multi-search";
    const LIMIT = 50;
    const DEFAULT_PAYLOAD_STRUCTURE = {
        "queries": [{
            "q": "",
            "indexUid": "models_v9",
            "limit": LIMIT,
            "offset": 0,
            "filter": []
            // The 'sort' key is added/removed dynamically
        }]
    };
    const STATIC_FILTER = "(poi != true OR user.id = 567572) AND (availability != Private OR user.id = 567572) AND (NOT (nsfwLevel IN [4, 8, 16, 32] AND version.baseModel IN ['SD 3', 'SD 3.5', 'SD 3.5 Medium', 'SD 3.5 Large', 'SD 3.5 Large Turbo', 'SDXL Turbo', 'SVD', 'SVD XT', 'Stable Cascade'])) AND (nsfwLevel=1 OR nsfwLevel=2 OR nsfwLevel=4)";
    const DEFAULT_HEADERS_TEXT = `Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
Origin: https://civitai.com
Referer: https://civitai.com/`;

    // --- EXTENSIVE FILTER DATA ---
    const FILTERS = {
        "Base Model": {
            filterKey: "version.baseModel",
            options: ["AuraFlow","Chroma","CogVideoX","Flux.1 D","Flux.1 Kontext","Flux.1 Krea","Flux.1 S","HiDream","Hunyuan 1","Hunyuan Video","Illustrious","Imagen4","Kolors","LTXV","Lumina","Mochi","Nano Banana","NoobAI","ODOR","OpenAI","Other","PixArt E","PixArt a","Playground v2","Pony","Qwen","SD 1.4","SD 1.5","SD 1.5 Hyper","SD 1.5 LCM","SD 2.0","SD 2.0 768","SD 2.1","SD 2.1 768","SD 2.1 Unclip","SD 3","SD 3.5","SD 3.5 Large","SD 3.5 Large Turbo","SD 3.5 Medium","SDXL 0.9","SDXL 1.0","SDXL 1.0 LCM","SDXL Distilled","SDXL Hyper","SDXL Lightning","SDXL Turbo","SVD","SVD XT","Stable Cascade","Veo 3","Wan Video","Wan Video 1.3B t2v","Wan Video 14B i2v 480p","Wan Video 14B i2v 720p","Wan Video 14B t2v","Wan Video 2.2 I2V-A14B","Wan Video 2.2 T2V-A14B","Wan Video 2.2 TI2V-5B"]
        },
        "Model Type": {
            filterKey: "type",
            options: ["AestheticGradient","Checkpoint","Controlnet","Detection","DoRA","Hypernetwork","LORA","LoCon","MotionModule","Other","Poses","TextualInversion","Upscaler","VAE","Wildcards","Workflows"]
        },
        "Category": {
            filterKey: "category.name",
            options: ["action","animal","assets","background","base model","buildings","celebrity","character","clothing","concept","objects","poses","style","tool","vehicle"]
        },
        "Checkpoint Type": {
            filterKey: "checkpointType",
            options: ["Merge","Trained"]
        },
        "File Format": {
            filterKey: "fileFormats",
            options: ["Core ML","Diffusers","GGUF","ONNX","Other","PickleTensor","SafeTensor","pt"]
        }
    };
    const SORT_OPTIONS = {
        "Relevancy": null, // Special case: null means remove the sort key
        "Most Downloaded": ["metrics.downloadCount:desc"],
        "Highest Rated": ["metrics.thumbsUpCount:desc"],
        "Most Liked": ["metrics.favoriteCount:desc"],
        "Most Discussed": ["metrics.commentCount:desc"],
        "Most Collected": ["metrics.collectedCount:desc"],
        "Most Buzz": ["metrics.tippedAmountCount:desc"],
        "Newest": ["createdAt:desc"]
    };

    // --- UI INJECTION ---
    function injectUI() {
        const floatingButton = document.createElement('button');
        floatingButton.id = 'civitai-search-btn';
        floatingButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z"></path></svg>`;
        document.body.appendChild(floatingButton);

        const panel = document.createElement('div');
        panel.id = 'civitai-search-panel';
        panel.style.display = 'none';

        let filterHtml = '';
        for (const [title, config] of Object.entries(FILTERS)) {
            const optionsHtml = config.options.map(opt => `
                <div class="filter-chip">
                    <input type="checkbox" id="filter-${config.filterKey}-${opt.replace(/[^a-zA-Z0-9]/g, '-')}" name="${config.filterKey}" value="${opt}">
                    <label for="filter-${config.filterKey}-${opt.replace(/[^a-zA-Z0-9]/g, '-')}" title="${opt}">${opt}</label>
                </div>
            `).join('');
            filterHtml += `<details class="filter-accordion" open><summary>${title}</summary><div class="filter-chip-group">${optionsHtml}</div></details>`;
        }

        const sortOptionsHtml = Object.keys(SORT_OPTIONS).map(key => `<option value="${key}">${key}</option>`).join('');

        panel.innerHTML = `
            <div id="civitai-search-backdrop"></div>
            <div id="civitai-search-modal">
                <button id="civitai-search-close-btn">&times;</button>
                <div class="search-container">
                    <aside class="search-sidebar">
                        <h3>Advanced Search</h3>
                        <div class="sidebar-scroll-content">
                            <details class="filter-accordion" open>
                                <summary>Sort models by</summary>
                                <select id="civitai-sort-select">${sortOptionsHtml}</select>
                            </details>
                            ${filterHtml}
                            <div class="headers-section">
                                <label for="civitai-headers-input">Request Headers</label>
                                <textarea id="civitai-headers-input" placeholder="Paste raw headers here..."></textarea>
                                <p class="hint">Paste headers from dev tools. Will be parsed and saved.</p>
                            </div>
                        </div>
                    </aside>
                    <main class="search-main">
                        <div class="search-bar">
                            <input type="text" id="civitai-search-input" placeholder="Search for models...">
                            <button id="civitai-search-submit-btn">Search</button>
                        </div>
                        <div id="civitai-results-container">
                            <div id="civitai-results-grid"></div>
                            <div id="civitai-status-message">Enter a query and press Search.</div>
                        </div>
                    </main>
                </div>
            </div>`;
        document.body.appendChild(panel);

        addEventListeners();
        loadSavedHeaders();
        loadAndApplyState();
    }

    // --- STATE & EVENT HANDLING ---
    function saveState() {
        const state = {
            query: document.getElementById('civitai-search-input').value,
            sort: document.getElementById('civitai-sort-select').value,
            filters: {}
        };
        document.querySelectorAll('.filter-chip-group input:checked').forEach(checkbox => {
            const key = checkbox.name;
            if (!state.filters[key]) state.filters[key] = [];
            state.filters[key].push(checkbox.value);
        });
        GM_setValue('civitai_search_state', JSON.stringify(state));
    }

    function loadAndApplyState() {
        const state = JSON.parse(GM_getValue('civitai_search_state', '{}'));
        if (state.query) document.getElementById('civitai-search-input').value = state.query;
        if (state.sort) document.getElementById('civitai-sort-select').value = state.sort;
        if (state.filters) {
            Object.entries(state.filters).forEach(([key, values]) => {
                values.forEach(value => {
                    const checkbox = document.querySelector(`input[name="${CSS.escape(key)}"][value="${CSS.escape(value)}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            });
        }
    }

    function addEventListeners() {
        document.getElementById('civitai-search-btn').addEventListener('click', () => { document.getElementById('civitai-search-panel').style.display = 'block'; });
        document.getElementById('civitai-search-close-btn').addEventListener('click', hidePanel);
        document.getElementById('civitai-search-backdrop').addEventListener('click', hidePanel);
        document.getElementById('civitai-search-submit-btn').addEventListener('click', () => performSearch(true));
        document.getElementById('civitai-search-input').addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(true); });

        const resultsContainer = document.getElementById('civitai-results-container');
        resultsContainer.addEventListener('scroll', () => {
            if (isLoading || !hasMore) return;
            const { scrollTop, scrollHeight, clientHeight } = resultsContainer;
            if (scrollHeight - scrollTop - clientHeight < 500) { performSearch(false); }
        });
    }

    function hidePanel() {
        document.getElementById('civitai-search-panel').style.display = 'none';
    }

    // --- API & DATA HANDLING ---
    function parseHeaders(rawHeaders) {
        const headers = {};
        rawHeaders.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                const trimmedKey = key.trim();
                if (!trimmedKey.startsWith(':') && !['Host', 'Content-Length', 'TE'].includes(trimmedKey)) headers[trimmedKey] = value;
            }
        });
        return headers;
    }

    function loadSavedHeaders() {
        const savedHeaders = GM_getValue('civitai_headers', DEFAULT_HEADERS_TEXT);
        document.getElementById('civitai-headers-input').value = savedHeaders;
    }

    function buildPayload() {
        const payload = JSON.parse(JSON.stringify(DEFAULT_PAYLOAD_STRUCTURE));
        payload.queries[0].q = document.getElementById('civitai-search-input').value;

        const sortKey = document.getElementById('civitai-sort-select').value;
        const sortValue = SORT_OPTIONS[sortKey];
        if (sortValue) {
            payload.queries[0].sort = sortValue;
        } // No 'else' needed, as the key is absent by default

        const filterGroups = {};
        document.querySelectorAll('.filter-chip-group input:checked').forEach(checkbox => {
            const filterKey = checkbox.name;
            if (!filterGroups[filterKey]) filterGroups[filterKey] = [];
            filterGroups[filterKey].push(`"${filterKey}"="${checkbox.value}"`);
        });

        const filterArrays = Object.values(filterGroups);
        payload.queries[0].filter = [...filterArrays, STATIC_FILTER];
        return payload;
    }

    function performSearch(isNewSearch) {
        if (isLoading) return;
        isLoading = true;

        const grid = document.getElementById('civitai-results-grid');
        const status = document.getElementById('civitai-status-message');

        if (isNewSearch) {
            grid.innerHTML = '';
            currentOffset = 0;
            hasMore = true;
            currentQueryPayload = buildPayload();
            saveState();
            status.textContent = 'Searching...';
            status.style.display = 'block';
        } else {
            status.textContent = 'Loading more...';
            status.style.display = 'block';
        }

        currentQueryPayload.queries[0].offset = currentOffset;
        const rawHeaders = document.getElementById('civitai-headers-input').value;
        GM_setValue('civitai_headers', rawHeaders);

        GM_xmlhttpRequest({
            method: 'POST', url: API_URL, headers: parseHeaders(rawHeaders), data: JSON.stringify(currentQueryPayload),
            onload: response => {
                isLoading = false;
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const hits = data?.results?.[0]?.hits ?? [];
                        if (hits.length > 0) {
                            renderResults(hits, isNewSearch);
                            currentOffset += hits.length;
                            if (hits.length < LIMIT) { hasMore = false; status.style.display = 'none'; }
                        } else {
                            hasMore = false;
                            if (isNewSearch) status.textContent = 'No results found.';
                            else status.style.display = 'none';
                        }
                    } catch (e) { status.textContent = `Error parsing response: ${e.message}`; hasMore = false; }
                } else { status.textContent = `Error: ${response.status} - ${response.statusText}`; hasMore = false; }
            },
            onerror: response => {
                isLoading = false; hasMore = false;
                status.textContent = 'Request failed. Check console for details.';
                console.error('Tampermonkey request error:', response);
            }
        });
    }

    // --- RENDERING ---
    function renderResults(hits, isNewSearch) {
        const grid = document.getElementById('civitai-results-grid');
        const status = document.getElementById('civitai-status-message');
        if (isNewSearch) grid.innerHTML = '';
        status.style.display = 'none';

        hits.forEach(hit => {
            const card = document.createElement('div');
            card.className = 'card';
            const metrics = hit.metrics || {}, firstImage = (hit.images || [{}])[0], userInfo = hit.user || {}, versionInfo = hit.version || {};
            const imageUrl = firstImage.url ? `https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/${firstImage.url}/width=450` : 'https://via.placeholder.com/450?text=No+Image';
            const creatorAvatarUrl = userInfo.image ? `https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/${userInfo.image}/width=96` : 'https://via.placeholder.com/96?text=?';

            card.innerHTML = `
                <a href="https://civitai.com/models/${hit.id}" class="card-link" target="_blank" rel="noopener noreferrer"></a>
                <img class="card-image" src="${imageUrl}" alt="${hit.name}" loading="lazy">
                <div class="card-header"><div class="chip"><span>${hit.type || 'N/A'}</span><div class="divider"></div><span>${versionInfo.baseModel || 'N/A'}</span></div></div>
                <div class="card-footer">
                    <div class="creator-info"><img src="${creatorAvatarUrl}" class="creator-avatar" alt="${userInfo.username}'s avatar"><span class="creator-name">${userInfo.username || 'N/A'}</span></div>
                    <p class="card-title">${hit.name || 'Untitled'}</p>
                    <div class="chip stats-chip">
                        <div class="stats-group">
                            <div class="stat" title="Likes"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 0 -2 -2h-3.5a1.5 1.5 0 0 0 -1.5 1.5v4.5h3.5"></path></svg>${metrics.thumbsUpCount || 0}</div>
                            <div class="stat" title="Favorites"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z"></path></svg>${metrics.favoriteCount || 0}</div>
                            <div class="stat" title="Downloads"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path><path d="M7 11l5 5l5 -5"></path><path d="M12 4l0 12"></path></svg>${metrics.downloadCount || 0}</div>
                        </div>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    // --- FULLY SCOPED CSS STYLES ---
    GM_addStyle(`
        #civitai-search-panel {
            --main-bg: #1A1B1E; --panel-bg: #2C2E33; --border-color: #373A40; --text-color: #C1C2C5;
            --text-muted: #868e96; --accent-color: #339AF0; --accent-hover: #4DABF7;
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #civitai-search-panel .sidebar-scroll-content::-webkit-scrollbar,
        #civitai-search-panel #civitai-results-container::-webkit-scrollbar { width: 8px; }
        #civitai-search-panel .sidebar-scroll-content::-webkit-scrollbar-track,
        #civitai-search-panel #civitai-results-container::-webkit-scrollbar-track { background: var(--panel-bg); }
        #civitai-search-panel .sidebar-scroll-content::-webkit-scrollbar-thumb,
        #civitai-search-panel #civitai-results-container::-webkit-scrollbar-thumb { background: #5C5F66; border-radius: 4px; }
        #civitai-search-panel .sidebar-scroll-content::-webkit-scrollbar-thumb:hover,
        #civitai-search-panel #civitai-results-container::-webkit-scrollbar-thumb:hover { background: #868E96; }
        #civitai-search-btn { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background-color: var(--accent-color); color: white; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer; z-index: 9998; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        #civitai-search-btn:hover { transform: scale(1.1); background-color: var(--accent-hover); }
        #civitai-search-panel #civitai-search-backdrop { position: absolute; width: 100%; height: 100%; background-color: rgba(10,10,10,0.7); backdrop-filter: blur(4px); }
        #civitai-search-panel #civitai-search-modal { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 90vh; max-width: 1600px; background-color: var(--main-bg); color: var(--text-color); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; border: 1px solid var(--border-color); }
        #civitai-search-panel #civitai-search-close-btn { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 2.5rem; color: var(--text-muted); cursor: pointer; line-height: 1; z-index: 10; }
        #civitai-search-panel .search-container { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; padding: 1.5rem; height: 100%; box-sizing: border-box; }
        #civitai-search-panel .search-sidebar, #civitai-search-panel .search-main { overflow: hidden; display: flex; flex-direction: column; }
        #civitai-search-panel .search-sidebar { background-color: var(--panel-bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); }
        #civitai-search-panel .sidebar-scroll-content { overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; padding-right: 8px; }
        #civitai-search-panel .search-sidebar h3 { margin: 0 0 10px 0; font-size: 1.2rem; color: white; }
        #civitai-search-panel .filter-accordion { border-bottom: 1px solid var(--border-color); }
        #civitai-search-panel .filter-accordion summary { cursor: pointer; padding: 12px 4px; font-weight: 600; list-style: none; color: #E9ECEF; }
        #civitai-search-panel .filter-accordion summary::-webkit-details-marker { display: none; }
        #civitai-search-panel .filter-chip-group { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 0; }
        #civitai-search-panel .filter-chip input { display: none; }
        #civitai-search-panel .filter-chip label { display: inline-block; padding: 6px 12px; background-color: #373A40; border: 1px solid #495057; border-radius: 999px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
        #civitai-search-panel .filter-chip input:checked + label { background-color: #334674; border-color: var(--accent-color); color: #D0EBFF; font-weight: 600; }
        #civitai-search-panel #civitai-sort-select { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 8px; background-color: #373A40; color: var(--text-color); }
        #civitai-search-panel .search-main .search-bar { flex-shrink: 0; display: flex; gap: 10px; margin-bottom: 1rem; }
        #civitai-search-panel #civitai-search-input { flex-grow: 1; padding: 12px 16px; font-size: 1rem; border: 1px solid var(--border-color); border-radius: 8px; background-color: var(--panel-bg); color: var(--text-color); }
        #civitai-search-panel #civitai-search-submit-btn { padding: 0 24px; font-size: 1rem; font-weight: 600; background-color: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer; }
        #civitai-search-panel #civitai-search-submit-btn:hover { background-color: var(--accent-hover); }
        #civitai-search-panel #civitai-results-container { flex-grow: 1; overflow-y: auto; background-color: var(--main-bg); border-radius: 8px; padding-right: 8px; }
        #civitai-search-panel #civitai-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
        #civitai-search-panel #civitai-status-message { text-align: center; color: var(--text-muted); padding: 20px; font-size: 1.1rem; }
        #civitai-search-panel .headers-section { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color); flex-shrink: 0; }
        #civitai-search-panel .headers-section textarea { height: 120px; font-size: 12px; background-color: #25262B; color: var(--text-color); border-color: var(--border-color); }
        #civitai-search-panel .headers-section .hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; }
        #civitai-search-panel .card{position:relative;overflow:hidden;border-radius:8px;background-color:#373A40;border:1px solid #495057;display:flex;flex-direction:column;aspect-ratio:7/9}.card a.card-link{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.card-image{width:100%;height:100%;object-fit:cover}.card-header,.card-footer{position:absolute;left:0;width:100%;padding:12px;box-sizing:border-box;z-index:2;color:white;text-shadow:1px 1px 3px rgba(0,0,0,0.7)}.card-header{top:0;display:flex;justify-content:space-between}.card-footer{bottom:0;display:flex;flex-direction:column;gap:8px;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0) 100%)}.chip{display:inline-flex;align-items:center;gap:6px;background-color:rgba(26,27,30,0.6);backdrop-filter:blur(5px);border-radius:999px;padding:4px 10px;font-size:.75rem;font-weight:700;border:1px solid rgba(255,255,255,0.2)}.chip .divider{border-left:1px solid rgba(255,255,255,0.3);height:12px}.card-title{font-size:1.1rem;font-weight:700;line-height:1.3;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}.creator-info{display:flex;align-items:center;gap:8px;text-decoration:none;color:white}.creator-info:hover{text-decoration:underline}.creator-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.7)}.creator-name{font-weight:500;font-size:.9rem}.stats-chip{background-color:rgba(26,27,30,0.6);backdrop-filter:blur(5px);padding:6px 12px}.stats-group{display:flex;gap:12px;align-items:center}.stat{display:flex;align-items:center;gap:4px;font-size:.8rem;font-weight:700}.stat svg{width:14px;height:14px}
    `);

    // --- INITIALIZATION ---
    injectUI();

})();