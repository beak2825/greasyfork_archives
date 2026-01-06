// ==UserScript==
// @name         Vinted country & city Filter (Test)
// @namespace    https://greasyfork.org/en/users/1555702-ctrain
// @version      1.1
// @description  Country filter for vinted with nordic id support.
// @author       Unknown
// @license      MIT
// @match        https://www.vinted.at/catalog*
// @match        https://www.vinted.be/catalog*
// @match        https://www.vinted.cz/catalog*
// @match        https://www.vinted.de/catalog*
// @match        https://www.vinted.dk/catalog*
// @match        https://www.vinted.ee/catalog*
// @match        https://www.vinted.es/catalog*
// @match        https://www.vinted.fi/catalog*
// @match        https://www.vinted.fr/catalog*
// @match        https://www.vinted.gr/catalog*
// @match        https://www.vinted.hr/catalog*
// @match        https://www.vinted.hu/catalog*
// @match        https://www.vinted.ie/catalog*
// @match        https://www.vinted.it/catalog*
// @match        https://www.vinted.lt/catalog*
// @match        https://www.vinted.lu/catalog*
// @match        https://www.vinted.lv/catalog*
// @match        https://www.vinted.nl/catalog*
// @match        https://www.vinted.pl/catalog*
// @match        https://www.vinted.pt/catalog*
// @match        https://www.vinted.ro/catalog*
// @match        https://www.vinted.se/catalog*
// @match        https://www.vinted.si/catalog*
// @match        https://www.vinted.sk/catalog*
// @match        https://www.vinted.co.uk/catalog*
// @match        https://www.vinted.com/catalog*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561573/Vinted%20country%20%20city%20Filter%20%28Test%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561573/Vinted%20country%20%20city%20Filter%20%28Test%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. PLATFORM DETECTION
    const isNordic = ['.se', '.dk', '.fi'].some(d => location.hostname.endsWith(d));

    const CONFIG = {
        // Full database with Code, Name and Flag
        flags: {
            "AT": { n: "Austria", f: "🇦🇹" },
            "BE": { n: "Belgium", f: "🇧🇪" },
            "CZ": { n: "Czech Republic", f: "🇨🇿" },
            "DE": { n: "Germany", f: "🇩🇪" },
            "DK": { n: "Denmark", f: "🇩🇰" },
            "EE": { n: "Estonia", f: "🇪🇪" },
            "ES": { n: "Spain", f: "🇪🇸" },
            "FI": { n: "Finland", f: "🇫🇮" },
            "FR": { n: "France", f: "🇫🇷" },
            "GR": { n: "Greece", f: "🇬🇷" },
            "HR": { n: "Croatia", f: "🇭🇷" },
            "HU": { n: "Hungary", f: "🇭🇺" },
            "IE": { n: "Ireland", f: "🇮🇪" },
            "IT": { n: "Italy", f: "🇮🇹" },
            "LT": { n: "Lithuania", f: "🇱🇹" },
            "LU": { n: "Luxembourg", f: "🇱🇺" },
            "LV": { n: "Latvia", f: "🇱🇻" },
            "NL": { n: "Netherlands", f: "🇳🇱" },
            "PL": { n: "Poland", f: "🇵🇱" },
            "PT": { n: "Portugal", f: "🇵🇹" },
            "RO": { n: "Romania", f: "🇷🇴" },
            "SE": { n: "Sweden", f: "🇸🇪" },
            "SI": { n: "Slovenia", f: "🇸🇮" },
            "SK": { n: "Slovakia", f: "🇸🇰" },
            "GB": { n: "United Kingdom", f: "🇬🇧" },
            "UK": { n: "United Kingdom", f: "🇬🇧" },
            "US": { n: "United States", f: "🇺🇸" }
        },
        // Mappings between Vinted country_id and ISO codes
        ids: isNordic ?
            { "12": "SE", "27": "DK", "28": "FI", "15": "PL" } :
            { "16": "AT", "2": "BE", "14": "CZ", "7": "DE", "24": "EE", "3": "ES", "1": "FR", "28": "GR", "25": "HR", "26": "HU", "12": "IE", "9": "IT", "22": "LT", "4": "LU", "23": "LV", "5": "NL", "15": "PL", "19": "PT", "27": "RO", "29": "SI", "13": "SK", "10": "GB", "20": "US" },

        api: `https://${location.hostname}/api/v2/items/`,
        cachePrefix: 'v_nordic_final_v1_'
    };

    let state = {
        excluded: JSON.parse(sessionStorage.getItem('vinted_excluded_countries') || '[]'),
        enabled: sessionStorage.getItem('vinted_filter_enabled') !== 'false',
        paused: false,
        userPaused: false,
        processing: false,
        navigating: false,
        storageFull: false,
        items: new Map(),
        queue: [],
        lastUrl: location.href,
        captcha: { win: null, interval: null }
    };

    // --- Inject Styles ---
    const styles = `
        #vinted-filter-menu { position: fixed; top: 80px; right: 20px; z-index: 9999999; background: #fff; border: 2px solid #007782; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,119,130,0.3); font-family: sans-serif; width: 280px; transition: all 0.3s ease; }
        .vf-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 2px solid #eee; cursor: move; background: #f8f9fa; border-radius: 16px 16px 0 0; }
        .vf-header-left { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
        .vf-content { padding: 15px; }
        .vf-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; }
        .vf-section-title { font-size: 13px; font-weight: bold; color: #333; margin: 0; white-space: nowrap; }
        .vf-search { border: 1px solid #ccc; border-radius: 4px; padding: 2px 6px; font-size: 11px; flex-grow: 1; width: 0; outline: none; }
        .vf-search:focus { border-color: #007782; }
        .vf-switch { position: relative; width: 45px; height: 18px; flex-shrink: 0; }
        .vf-switch input { opacity: 0; width: 0; height: 0; }
        .vf-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px; }
        .vf-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; z-index: 2; }
        .vf-slider:after { content: 'OFF'; position: absolute; right: 6px; top: 50%; transform: translateY(-50%); font-size: 9px; font-weight: 800; color: #666; transition: all 0.3s; }
        input:checked + .vf-slider { background-color: #007782; }
        input:checked + .vf-slider:before { transform: translateX(27px); }
        input:checked + .vf-slider:after { content: 'ON'; left: 7px; right: auto; color: white; }
        .vf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0px 4px; max-height: 150px; overflow-y: auto; margin-bottom: 12px; }
        .vf-check { display: flex; gap: 3px; font-size: 11px; padding: 4px 0; cursor: pointer; border-radius: 4px; align-items: center; line-height: 1.2; white-space: nowrap; overflow: hidden; }
        .vf-check:hover { background: #f0f0f0; }
        .vf-stats-box { background: #f5f5f5; border: 1px solid #eee; border-radius: 8px; padding: 2px 0; margin-bottom: 10px; overflow: hidden; }
        .vf-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; font-size: 11px; color: #555; }
        .vf-stat-row:not(:last-child) { border-bottom: 1px solid #ebebeb; }
        .vf-badge-fixed { color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold; min-width: 20px; text-align: center; font-size: 10px; }
        .vf-btn { width: 100%; padding: 8px; margin-top: 8px; border: none; border-radius: 8px; cursor: pointer; color: white; font-weight: bold; font-size: 11px; transition: opacity 0.2s; }
        .vf-btn:hover { opacity: 0.9; }
        .vf-btn:disabled { cursor: default; opacity: 0.7; }
        .vf-overlay { position: absolute; top: 8px; left: 8px; padding: 4px 8px; font-size: 10px; font-weight: 600; border-radius: 6px; z-index: 10; pointer-events: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .vf-loading { background: rgba(255,255,255,0.9); color: #007782; border: 1.5px solid #007782; }
        .vf-loaded { background: #4caf50; color: white; }
        .vf-error { background: #ef5350; color: white; border: none; }
        .vf-dimmed { opacity: 0.1 !important; filter: grayscale(100%) !important; transition: 0.3s; }
        .vf-progress { height: 5px; background: #eee; margin: 10px 0; border-radius: 3px; overflow: hidden; }
        .vf-bar { height: 100%; background: #007782; width: 0%; transition: width 0.3s; }
        .vf-warning { background: #fff3cd; color: #856404; padding: 10px; border-radius: 8px; font-size: 11px; margin-top: 10px; border: 1px solid #ffeeba; }
        .vf-storage-bar { width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px; margin-top: 5px; overflow: hidden; }
        .vf-storage-fill { height: 100%; background: #4caf50; width: 0%; transition: width 0.5s; }
        .vf-storage-text { font-size: 9px; color: #999; text-align: center; margin-top: 2px; }
    `;
    const styleEl = document.createElement('style'); styleEl.textContent = styles; document.head.appendChild(styleEl);

    // --- Helper Functions ---

    function getStorageUsage() {
        let total = 0;
        for (let x in localStorage) { if (localStorage.hasOwnProperty(x)) total += localStorage[x].length + x.length; }
        return Math.min(100, Math.round((total / 5000000) * 100));
    }

    function updateUI() {
        const onPage = Array.from(state.items.values());
        const processed = onPage.filter(i => i.country);
        const cachedCount = onPage.filter(i => i.isCached).length;
        const totalInStore = Object.keys(localStorage).filter(k => k.startsWith(CONFIG.cachePrefix)).length;
        const visibleCount = processed.filter(i => !state.excluded.includes(i.country)).length;

        const els = {
            match: document.getElementById('vf-match'),
            total: document.getElementById('vf-total'),
            queue: document.getElementById('vf-queue'),
            queueLabel: document.getElementById('vf-queue-label'),
            cached: document.getElementById('vf-cached'),
            bar: document.getElementById('vf-bar'),
            btn: document.getElementById('vf-clear'),
            pauseBtn: document.getElementById('vf-pause'),
            storageFill: document.getElementById('vf-storage-fill'),
            storageText: document.getElementById('vf-storage-text')
        };

        if (els.match) els.match.textContent = `${visibleCount}/${processed.length}`;
        if (els.total) els.total.textContent = state.items.size;
        if (els.queue) els.queue.textContent = state.queue.length;

        if (els.queueLabel) {
            let statusText = '';
            if (state.queue.length > 0) {
                if (state.userPaused) statusText = ' (⏸️)';
                else if (state.paused) statusText = ' (❄️)';
                else if (state.processing) statusText = ' (⚡)';
            }
            els.queueLabel.textContent = `⏳ In queue${statusText}`;
        }

        if (els.cached) els.cached.textContent = cachedCount;
        if (els.btn) els.btn.textContent = `🗑️ Clear Cache (${totalInStore})`;
        if (els.bar) els.bar.style.width = `${(processed.length / (state.items.size || 1)) * 100}%`;

        if (els.pauseBtn) {
            if (state.queue.length === 0 && !state.processing) {
                els.pauseBtn.textContent = '✓ All items scanned'; els.pauseBtn.style.background = '#e0e0e0'; els.pauseBtn.disabled = true;
            } else {
                els.pauseBtn.disabled = false;
                if (state.userPaused) {
                    els.pauseBtn.textContent = '▶️ Resume processing'; els.pauseBtn.style.background = '#4caf50';
                } else {
                    els.pauseBtn.textContent = '⏸️ Pause processing'; els.pauseBtn.style.background = '#ff9800';
                }
            }
        }

        const usage = getStorageUsage();
        if (els.storageFill && els.storageText) {
            els.storageFill.style.width = `${usage}%`; els.storageText.textContent = `Storage used: ${usage}%`;
            els.storageFill.style.background = usage > 90 ? '#f44336' : '#4caf50';
            state.storageFull = (usage > 90);
        }
    }

    function applyFilter() {
        if (!state.enabled) return resetItems();
        state.items.forEach(item => {
            if (item.country) item.el.classList.toggle('vf-dimmed', state.excluded.includes(item.country));
        });
        updateUI();
    }

    function resetItems() {
        state.items.forEach(item => { item.el.classList.remove('vf-dimmed'); if (item.overlay) item.overlay.remove(); });
        state.items.clear(); state.queue = []; updateUI();
    }

    function updateItemDisplay(item, code, title, city) {
        item.country = code;
        const flag = CONFIG.flags[code]?.f || "🏳️";
        // FORMAT: [Emoji] [City], [COUNTRY NAME IN CAPS]
        let displayTitle = title.toUpperCase();
        let text = city ? `${flag} ${city}, ${displayTitle}` : `${flag} ${displayTitle}`;

        item.overlay.textContent = text;
        item.overlay.className = 'vf-overlay vf-loaded';
        applyFilter();
    }

    async function processQueue() {
        if (!state.enabled || state.processing || state.paused || state.userPaused || !state.queue.length || state.navigating) {
            if (!state.processing) updateUI();
            return;
        }
        state.processing = true; updateUI();

        const item = state.queue.shift();
        const cached = localStorage.getItem(CONFIG.cachePrefix + item.id);

        if (cached) {
            const data = JSON.parse(cached); item.isCached = true;
            updateItemDisplay(item, data.c, data.t, data.ci);
            state.processing = false; updateUI(); return;
        }

        try {
            const res = await fetch(`${CONFIG.api}${item.id}/details`);
            if (res.status === 403) {
                state.queue.unshift(item); handleCaptcha();
            } else if (res.status === 429) {
                state.queue.unshift(item); state.paused = true;
                setTimeout(() => { state.paused = false; updateUI(); }, 5000);
            } else if (res.ok) {
                const json = await res.json();
                const u = json.item?.user;

                // Logic: Priority to country_code, then Nordic ID mapping
                let countryCode = u?.country_code?.toUpperCase() || CONFIG.ids[u?.country_id] || "??";
                // Localized name from API (e.g., "Sverige" or "Sweden")
                let countryTitle = u?.country_title_local || u?.country_title || countryCode;
                let city = u?.city || "";

                if (countryCode !== "??") {
                    if (!state.storageFull) {
                        try { localStorage.setItem(CONFIG.cachePrefix + item.id, JSON.stringify({c: countryCode, t: countryTitle, ci: city})); } catch(e) { state.storageFull = true; }
                    }
                    updateItemDisplay(item, countryCode, countryTitle, city);
                }
            }
        } catch (e) { state.queue.unshift(item); }
        state.processing = false; updateUI();
    }

    function handleCaptcha() {
        state.paused = true; updateUI();
        document.getElementById('vf-captcha-box').style.display = 'block';
        if (!state.captcha.win || state.captcha.win.closed) state.captcha.win = window.open(`${CONFIG.api}1/details`, 'VCaptcha', 'width=500,height=600');
        clearInterval(state.captcha.interval);
        state.captcha.interval = setInterval(async () => {
            try {
                const res = await fetch(`${CONFIG.api}1/details`);
                if (res.status !== 403) {
                    clearInterval(state.captcha.interval);
                    state.captcha.win?.close();
                    state.paused = false;
                    document.getElementById('vf-captcha-box').style.display = 'none';
                }
            } catch(e) {}
        }, 2000);
    }

    function scanItems() {
        if (!state.enabled || state.navigating) return;
        let foundNew = false;
        document.querySelectorAll('[data-testid^="product-item"], .feed-grid__item, .ItemBox__container').forEach(el => {
            const link = el.closest('a') || el.querySelector('a[href*="/items/"]');
            const id = link?.href.match(/\/items\/(\d+)/)?.[1];
            if (!id || state.items.has(id)) return;

            el.style.position = 'relative';
            const overlay = document.createElement('div');
            overlay.className = 'vf-overlay vf-loading'; overlay.textContent = '...'; el.appendChild(overlay);

            const itemData = { id, el, overlay, country: null, isCached: false };
            state.items.set(id, itemData);

            const cached = localStorage.getItem(CONFIG.cachePrefix + id);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    itemData.isCached = true;
                    updateItemDisplay(itemData, data.c, data.t, data.ci);
                } catch(e) { state.queue.push(itemData); foundNew = true; }
            } else { state.queue.push(itemData); foundNew = true; }
        });
        if (foundNew) updateUI();
    }

    function checkUrlChange() {
        if (location.href !== state.lastUrl) {
            state.lastUrl = location.href; state.navigating = true;
            resetItems(); setTimeout(() => { state.navigating = false; resetItems(); }, 1000);
        }
    }

    function renderCountryGrid() {
        const grid = document.getElementById('vf-grid');
        const searchInput = document.getElementById('vf-search');
        if (!grid) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const checked = []; const unchecked = [];

        Object.entries(CONFIG.flags).forEach(([code, data]) => {
            if (data.n.toLowerCase().includes(searchTerm) || code.toLowerCase().includes(searchTerm)) {
                if (state.excluded.includes(code)) checked.push({code, ...data});
                else unchecked.push({code, ...data});
            }
        });

        const sortAlpha = (a, b) => a.n.localeCompare(b.n);
        checked.sort(sortAlpha); unchecked.sort(sortAlpha);

        grid.innerHTML = [...checked, ...unchecked].map(data => `
            <label class="vf-check">
                <input type="checkbox" data-c="${data.code}" ${state.excluded.includes(data.code) ? 'checked' : ''}>
                ${data.f} ${data.n}
            </label>
        `).join('');

        grid.querySelectorAll('input[data-c]').forEach(cb => {
            cb.onchange = () => {
                const c = cb.dataset.c;
                if (cb.checked) { if (!state.excluded.includes(c)) state.excluded.push(c); }
                else { state.excluded = state.excluded.filter(x => x !== c); }
                sessionStorage.setItem('vinted_excluded_countries', JSON.stringify(state.excluded));
                applyFilter(); renderCountryGrid();
            };
        });
    }

    function createMenu() {
        if (location.pathname.startsWith('/api') || document.getElementById('vinted-filter-menu')) return;
        const menu = document.createElement('div'); menu.id = 'vinted-filter-menu';

        menu.innerHTML = `
            <div class="vf-header">
                <div class="vf-header-left"><span style="color:#007782;font-weight:bold;font-size:14px">🌍 Vinted Filter</span>
                <label class="vf-switch"><input type="checkbox" id="vf-toggle" ${state.enabled ? 'checked' : ''}><span class="vf-slider"></span></label></div>
                <span id="vf-min" style="cursor:pointer;font-weight:bold;padding:5px">−</span>
            </div>
            <div class="vf-content" id="vf-body">
                <div id="vf-controls" style="${!state.enabled ? 'opacity:0.5;pointer-events:none' : ''}">
                    <div class="vf-section-header">
                        <span class="vf-section-title">Exclusion filter</span>
                        <input type="text" id="vf-search" class="vf-search" placeholder="Search Code">
                    </div>
                    <div class="vf-grid" id="vf-grid"></div>

                    <div class="vf-stats-box">
                        <div class="vf-stat-row"><span>📦 Total on page</span><span id="vf-total" class="vf-badge-fixed" style="background:#2196f3">-</span></div>
                        <div class="vf-stat-row"><span>💾 Already cached</span><span id="vf-cached" class="vf-badge-fixed" style="background:#9c27b0">-</span></div>
                        <div class="vf-stat-row"><span id="vf-queue-label">⏳ In queue</span><span id="vf-queue" class="vf-badge-fixed" style="background:#ff9800">0</span></div>
                        <div class="vf-stat-row" style="background:#e8f5e9; color:#1b5e20"><span>✅ Shown items</span><span id="vf-match" class="vf-badge-fixed" style="background:#4caf50; min-width: 40px">-</span></div>
                    </div>

                    <div class="vf-progress"><div class="vf-bar" id="vf-bar"></div></div>
                    <div id="vf-captcha-box" class="vf-warning" style="background:#ffebee;color:#c62828;display:none">⚠️ API Blocked! Solve Captcha.</div>
                    <button class="vf-btn" id="vf-pause" style="background:#ff9800; margin-top:12px">⏸️ Pause processing</button>
                    <button class="vf-btn" style="background:#757575" id="vf-clear">🗑️ Clear Cache</button>
                    <div class="vf-storage-bar"><div class="vf-storage-fill" id="vf-storage-fill"></div></div>
                    <div class="vf-storage-text" id="vf-storage-text">Storage used: calculating...</div>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
        renderCountryGrid();

        // Event Listeners
        menu.querySelector('#vf-toggle').onchange = (e) => {
            state.enabled = e.target.checked; sessionStorage.setItem('vinted_filter_enabled', state.enabled);
            document.getElementById('vf-controls').style.opacity = state.enabled ? '1' : '0.5';
            document.getElementById('vf-controls').style.pointerEvents = state.enabled ? 'auto' : 'none';
            state.enabled ? scanItems() : resetItems();
        };
        menu.querySelector('#vf-search').oninput = () => renderCountryGrid();
        menu.querySelector('#vf-min').onclick = () => {
            const body = document.getElementById('vf-body'), isMin = body.style.display === 'none';
            body.style.display = isMin ? 'block' : 'none'; menu.style.width = isMin ? '280px' : '210px';
        };
        document.getElementById('vf-pause').onclick = () => { state.userPaused = !state.userPaused; updateUI(); };
        document.getElementById('vf-clear').onclick = () => {
            if(confirm('Clear cache?')) {
                Object.keys(localStorage).forEach(k => k.startsWith(CONFIG.cachePrefix) && localStorage.removeItem(k));
                resetItems(); updateUI();
            }
        };

        // Draggable
        const head = menu.querySelector('.vf-header'); let isDown = false, offX, offY;
        head.onmousedown = e => { if(e.target.closest('.vf-switch') || e.target.id==='vf-min' || e.target.id==='vf-search') return; isDown = true; offX = e.clientX - menu.offsetLeft; offY = e.clientY - menu.offsetTop; };
        document.onmousemove = e => { if(isDown) { menu.style.left = (e.clientX - offX) + 'px'; menu.style.top = (e.clientY - offY) + 'px'; menu.style.right = 'auto'; }};
        document.onmouseup = () => isDown = false;

        updateUI();
    }

    // --- Interval Loops ---
    setInterval(createMenu, 1000);
    setInterval(scanItems, 1000);
    setInterval(processQueue, 400);
    setInterval(checkUrlChange, 1000);
})();