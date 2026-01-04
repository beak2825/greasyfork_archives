// ==UserScript==
// @name         📚 The GOD MODE Ultimate Research Superpanel for Scholars, Hackers & Knowledge Addicts
// @namespace    http://instagram.com/WaterDustLab
// @version      4.0
// @description  GOD MODE Instantly unlock academic papers, PDFs, and DOIs from everywhere — LibGen, Sci-Hub, Unpaywall, Semantic Scholar, Crossref, and more — directly inside any webpage.
// @author       WaterDustLab
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554592/%F0%9F%93%9A%20The%20GOD%20MODE%20Ultimate%20Research%20Superpanel%20for%20Scholars%2C%20Hackers%20%20Knowledge%20Addicts.user.js
// @updateURL https://update.greasyfork.org/scripts/554592/%F0%9F%93%9A%20The%20GOD%20MODE%20Ultimate%20Research%20Superpanel%20for%20Scholars%2C%20Hackers%20%20Knowledge%20Addicts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- Config / Keys ----------
    const PANEL_ID = 'v13-panel';
    const REOPEN_ID = 'v13-reopen';
    const PAGE_KEY = 'v13_panel_closed_' + btoa(location.href.split('?')[0]).substring(0, 50);
    const TOGGLES_KEY = 'v13_toggles_v2';
    const SETTINGS_KEY = 'v13_settings_v2';
    const OPENED_KEY_PREFIX = 'v13_opened_for_';
    const CACHE_KEY = 'v13_cache_v2';
    const DIM_KEY = 'v13_dims_v1';
    const THEME_KEY = 'v13_theme_v1'; // 'auto' | 'dark' | 'light'
    const CACHE_TTL = 60 * 60 * 1000;

    // mirror lists
    const proxies = {
        sciHub: ['https://sci-hub.st', 'https://sci-hub.ru', 'https://sci-hub.se', 'https://sci-hub.do'],
        libGen: ['https://libgen.is', 'https://libgen.gs', 'https://libgen.li', 'https://libgen.me', 'http://gen.lib.rus.ec'],
        annas: ['https://annas-archive.org', 'https://annas-archive.se', 'https://annas-archive.li'],
        zLib: ['https://z-lib.id', 'https://z-library.sk', 'https://z-lib.fm', 'https://z-lib.gs', 'https://1lib.sk']
    };

    // sources
    const sources = [
        { id: 'Unpaywall', name: 'Unpaywall', color: '#52b788', helper: 'unpaywall' },
        { id: 'LibGen', name: 'LibGen', color: '#ff6b6b', proxy: 'libGen', prefill: true },
        { id: 'Annas', name: 'Annas', color: '#4ecdc4', proxy: 'annas', prefill: true },
        { id: 'CORE', name: 'CORE', color: '#45b7d1', url: (doi) => `https://core.ac.uk/search?q=${encodeURIComponent(doi)}` },
        { id: 'OAButton', name: 'OA Button', color: '#96ceb4', url: (doi) => `https://openaccessbutton.org/api/instant?doi=${encodeURIComponent(doi)}` },
        { id: 'ResearchGate', name: 'ResearchGate', color: '#00bfff', url: (doi) => `https://www.researchgate.net/search/publication?q=${encodeURIComponent(doi)}`, prefill: true },
        { id: 'ZLib', name: 'Z-Library', color: '#dda0dd', proxy: 'zLib', prefill: true },
        { id: 'OAMG', name: 'OA.mg', color: '#98d8c8', url: (doi) => `https://oa.mg/search?q=${encodeURIComponent(doi)}`, prefill: true }
    ];

    // ---------- Safe storage wrappers ----------
    function safeGet(key, def) {
        try { return GM_getValue(key, def); } catch (e) {
            try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
        }
    }
    function safeSet(key, val) {
        try { GM_setValue(key, val); } catch (e) {
            try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
        }
    }

    const getToggles = () => safeGet(TOGGLES_KEY, {});
    const setToggles = (o) => safeSet(TOGGLES_KEY, o);
    const getSettings = () => safeGet(SETTINGS_KEY, { minimal: false, showAll: true, selected: [] });
    const setSettings = (o) => safeSet(SETTINGS_KEY, o);
    const cacheGet = () => safeGet(CACHE_KEY, {});
    const cacheSet = (o) => safeSet(CACHE_KEY, o);
    const getDims = () => safeGet(DIM_KEY, { width: 360, fontSize: 14 });
    const setDims = (o) => safeSet(DIM_KEY, o);
    const getThemePref = () => safeGet(THEME_KEY, 'auto');
    const setThemePref = (v) => safeSet(THEME_KEY, v);

    const log = (...args) => console.log('[AA-v13]', ...args);

    // ---------- DOI helpers ----------
    function getDOI() {
        const m = location.href.match(/10\.\d{4,9}\/[^\s?#&"']+/i);
        if (m) return m[0];
        const meta = document.querySelector('meta[name="citation_doi"], meta[property="doi"]');
        if (meta) return meta.content && meta.content.trim();
        const bodyMatch = document.body && document.body.innerText.match(/10\.\d{4,9}\/[^\s.,;(){}[\]]{5,}/i);
        return bodyMatch ? bodyMatch[0] : null;
    }
    function isMainDOI() {
        return !/references|\/citation\//i.test(location.href);
    }

    // ---------- Theme helpers ----------
    function systemPrefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    function resolveTheme() {
        const pref = getThemePref(); // 'auto'|'dark'|'light'
        if (pref === 'dark') return 'dark';
        if (pref === 'light') return 'light';
        return systemPrefersDark() ? 'dark' : 'light';
    }
    function applyTheme(panel) {
        const theme = resolveTheme();
        if (!panel) panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        if (theme === 'dark') {
            panel.style.background = 'rgba(20,20,30,0.95)';
            panel.style.color = '#fff';
        } else {
            panel.style.background = '#fff';
            panel.style.color = '#111';
        }
        // update other UI bits (settings modal will read getThemePref for preview)
    }

    // ---------- Reopen / toggle button (📚) ----------
    function createReopenButton() {
        if (document.getElementById(REOPEN_ID)) return;
        const btn = document.createElement('div');
        btn.id = REOPEN_ID;
        btn.title = 'Toggle Paper Panel';
        btn.innerText = '📚';
        Object.assign(btn.style, {
            position: 'fixed',
            right: '18px',
            bottom: '18px',
            zIndex: 999999,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#079992',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
        });
        btn.onclick = () => {
            const panel = document.getElementById(PANEL_ID);
            if (panel) { panel.remove(); return; }
            buildPanel();
        };
        document.body.appendChild(btn);
    }

    // ---------- Panel builder ----------
    async function buildPanel() {
        const doi = getDOI();
        if (!doi || !isMainDOI()) { createReopenButton(); return; }

        const existing = document.getElementById(PANEL_ID);
        if (existing) existing.remove();

        const dims = getDims();
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.setAttribute('role', 'dialog');
        panel.style.position = 'fixed';
        panel.style.top = '12px';
        panel.style.right = '12px';
        panel.style.zIndex = 9999999;
        panel.style.padding = '12px';
        panel.style.borderRadius = '12px';
        panel.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
        panel.style.boxShadow = '0 8px 28px rgba(0,0,0,0.6)';
        panel.style.maxWidth = '90%';
        panel.style.width = `${Math.max(260, Math.min(600, dims.width))}px`;
        panel.style.fontSize = `${Math.max(12, Math.min(20, dims.fontSize))}px`;
        panel.style.touchAction = 'none'; // help with touch drag
        applyTheme(panel);

        // header + status
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';
        const title = document.createElement('div'); title.textContent = 'v13: Source Panel'; title.style.fontWeight = '700';
        const status = document.createElement('div'); status.style.marginLeft = '8px'; status.style.fontSize = '12px'; status.textContent = 'Checking...';
        header.appendChild(title); header.appendChild(status);

        const close = document.createElement('div');
        close.innerText = '×'; close.title = 'Close panel (reopen via 📚)';
        Object.assign(close.style, { marginLeft: 'auto', cursor: 'pointer', fontSize: '18px' });
        close.onclick = () => { safeSet(PAGE_KEY, true); panel.remove(); createReopenButton(); };
        header.appendChild(close);
        panel.appendChild(header);

        // settings button separate row (below header)
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '⚙'; settingsBtn.title = 'Settings';
        Object.assign(settingsBtn.style, { cursor: 'pointer' });
        settingsBtn.onclick = () => showSettings(panel);
        const settingsRow = document.createElement('div');
        settingsRow.style.textAlign = 'right';
        settingsRow.style.marginTop = '6px';
        settingsRow.appendChild(settingsBtn);
        panel.appendChild(settingsRow);

        // main container grid
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = '1fr 40px';
        container.style.gap = '8px';

        // decide which sources to show
        const settings = getSettings();
        let toShow = sources.slice();
        if (settings.minimal && settings.selected?.length) toShow = sources.filter(s => settings.selected.includes(s.id));
        else if (!settings.showAll) toShow = sources.filter(s => ['Unpaywall', 'LibGen', 'Annas'].includes(s.id));

        // Sci-Hub mirrors + checkboxes (grid: label + checkbox)
        const sciHubBox = document.createElement('div');
        sciHubBox.style.gridColumn = '1 / span 2';
        sciHubBox.style.display = 'grid';
        sciHubBox.style.gridTemplateColumns = '1fr 40px';
        sciHubBox.style.gap = '6px';
        proxies.sciHub.forEach(m => {
            const label = m.replace(/^https?:\/\//, '');
            const id = `SciHub-${label}`;
            const btn = createSourceBtn(label, '#e74c3c', id, doi, { mirror: m, isSciHub: true });
            const chkWrap = document.createElement('div');
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.dataset.srcidchk = id;
            const t = getToggles();
            chk.checked = !!t[id];
            chk.onclick = () => { const tg = getToggles(); tg[id] = chk.checked; setToggles(tg); };
            chk.style.width = '18px'; chk.style.height = '18px';
            chkWrap.appendChild(chk);
            sciHubBox.appendChild(btn.wrapper);
            sciHubBox.appendChild(chkWrap);
        });
        container.appendChild(sciHubBox);

        // other sources
        toShow.forEach(src => {
            const btn = createSourceBtn(src.name, src.color, src.id, doi, src);
            container.appendChild(btn.wrapper);
            container.appendChild(btn.checkboxWrapper);
        });

        panel.appendChild(container);

        // resizer: right-edge vertical handle (touch-friendly)
        const resizer = document.createElement('div');
        resizer.id = 'v13-resizer';
        // small visible handle on the right edge
        Object.assign(resizer.style, {
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            right: '-10px', // slightly outside panel
            width: '20px',
            borderRadius: '10px',
            zIndex: 10000001,
            cursor: 'ew-resize',
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // make subtle semi-transparent handle so user can find it
            background: 'transparent'
        });
        // inner visible bar
        const bar = document.createElement('div');
        Object.assign(bar.style, {
            width: '4px',
            height: '40px',
            borderRadius: '4px',
            background: 'rgba(0,0,0,0.15)'
        });
        resizer.appendChild(bar);
        panel.appendChild(resizer);

        // apply theme & restore dims
        applyTheme(panel);

        // add to document
        document.body.appendChild(panel);
        createReopenButton();

        // run checks
        status.textContent = 'Running checks...';
        const buttons = Array.from(panel.querySelectorAll('[data-srcid]'));
        const cache = cacheGet();
        let checked = 0;
        for (const el of buttons) {
            const id = el.dataset.srcid;
            const meta = JSON.parse(el.dataset.meta || '{}');
            const result = await checkSourceByMeta(id, doi, meta, cache);
            updateButtonState(el, result);
            checked++;
            status.textContent = `Checked ${checked}/${buttons.length}`;
        }
        cacheSet(cache);

        // auto-open checked (avoid duplicates)
        const toggles = getToggles();
        const openedKey = OPENED_KEY_PREFIX + doi;
        const alreadyOpened = safeGet(openedKey, false);
        if (!alreadyOpened) {
            for (const el of buttons) {
                const id = el.dataset.srcid;
                const meta = JSON.parse(el.dataset.meta || '{}');
                const chk = panel.querySelector(`input[data-srcidchk="${id}"]`);
                if (chk && chk.checked) {
                    const url = buildUrlForMeta(id, doi, meta);
                    if (!url) continue;
                    const openedTabs = toggles._openedTabs || {};
                    if (!openedTabs[url]) {
                        GM_openInTab(url, { active: false });
                        log('Opened background tab for', id, url);
                        openedTabs[url] = true;
                        toggles._openedTabs = openedTabs;
                        setToggles(toggles);
                    }
                }
            }
            safeSet(openedKey, true);
        }

        // ---------- Resizer behavior (touch + mouse)
        (function attachResizer() {
            const minW = 260, maxW = 600;
            const minFont = 12, maxFont = 20;
            let dragging = false;
            let startX = 0;
            let startW = 0;

            function onStart(clientX) {
                dragging = true;
                startX = clientX;
                startW = panel.getBoundingClientRect().width;
                document.body.style.userSelect = 'none';
                document.body.style.touchAction = 'none';
            }
            function onMove(clientX) {
                if (!dragging) return;
                const dx = startX - clientX; // moving left increases width? We'll invert
                // we want dragging to the LEFT to increase width (since handle on right outside),
                // but users on mobile will drag left/right; use delta accordingly:
                const newW = Math.round(Math.max(minW, Math.min(maxW, startW + (startX - clientX))));
                panel.style.width = newW + 'px';
                // proportional font mapping
                const ratio = (newW - minW) / (maxW - minW);
                const newFont = Math.round(minFont + ratio * (maxFont - minFont));
                panel.style.fontSize = newFont + 'px';
            }
            function onEnd() {
                if (!dragging) return;
                dragging = false;
                document.body.style.userSelect = '';
                document.body.style.touchAction = '';
                // persist dims
                const finalW = parseInt(panel.style.width, 10) || getDims().width;
                const finalFont = parseInt(panel.style.fontSize, 10) || getDims().fontSize;
                setDims({ width: finalW, fontSize: finalFont });
            }

            // touch events
            resizer.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) onStart(e.touches[0].clientX);
            }, { passive: true });
            window.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) { onMove(e.touches[0].clientX); }
            }, { passive: true });
            window.addEventListener('touchend', onEnd);

            // mouse events (desktop)
            resizer.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
            window.addEventListener('mousemove', (e) => onMove(e.clientX));
            window.addEventListener('mouseup', onEnd);
        })();

        // expose panel to settings so theme preview can be applied
        panel.dataset.v13 = '1';
    }

    // ---------- Create per-source button and checkbox ----------
    function createSourceBtn(label, color, id, doi, meta = {}) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '6px';

        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.textContent = label;
        a.dataset.srcid = id;
        a.dataset.meta = JSON.stringify(meta);
        Object.assign(a.style, { background: color, color: '#000', padding: '8px 10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', display: 'inline-block', minWidth: '120px', textAlign: 'center' });

        const icon = document.createElement('span');
        icon.className = 'v13-icon';
        icon.textContent = '⌛';
        icon.style.marginRight = '6px';
        a.prepend(icon);

        a.onclick = async (e) => {
            e.preventDefault();
            const doiNow = getDOI();
            const url = buildUrlForMeta(id, doiNow, meta);
            if (id === 'Unpaywall') {
                GM_openInTab(url || 'https://unpaywall.org/', { active: true });
                GM_openInTab(`https://web.archive.org/web/*/${encodeURIComponent(doiNow)}`, { active: false });
                GM_openInTab(`https://scholar.google.com/scholar?q=${encodeURIComponent(doiNow)}`, { active: false });
                return;
            }
            if (url) GM_openInTab(url, { active: true });
        };

        const checkboxWrapper = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.srcidchk = id;
        const t = getToggles();
        checkbox.checked = !!t[id];
        checkbox.onclick = () => { const tg = getToggles(); tg[id] = checkbox.checked; setToggles(tg); };
        checkbox.style.width = '18px'; checkbox.style.height = '18px';
        checkboxWrapper.appendChild(checkbox);

        wrapper.appendChild(a);
        return { wrapper, checkboxWrapper, linkElem: a, checkbox };
    }

    // ---------- URL builder ----------
    function buildUrlForMeta(id, doi, meta) {
        if (!doi) return null;
        if (id.startsWith('SciHub-')) return `${meta.mirror}/search?request=${encodeURIComponent(doi)}`;
        if (id === 'Unpaywall') return `https://unpaywall.org/${encodeURIComponent(doi)}`;
        if (id === 'LibGen') {
            const live = getLiveMirrorSync('libGen') || proxies.libGen[0];
            return `${live}/search.php?req=${encodeURIComponent(doi)}`;
        }
        if (id === 'Annas') {
            const live = getLiveMirrorSync('annas') || proxies.annas[0];
            return `${live}/search?q=${encodeURIComponent(doi)}`;
        }
        if (id === 'ZLib') {
            const live = getLiveMirrorSync('zLib') || proxies.zLib[0];
            return `${live}/search.php?req=${encodeURIComponent(doi)}`;
        }
        if (meta && meta.url) return meta.url(doi);
        return `https://www.google.com/search?q=${encodeURIComponent(doi)}`;
    }

    // ---------- Mirror helpers ----------
    function getLiveMirrorSync(type) {
        const cache = cacheGet();
        const key = `live_${type}`;
        if (cache[key] && (Date.now() - cache[key].ts) < CACHE_TTL) return cache[key].mirror;
        return (proxies[type] && proxies[type][0]) || null;
    }

    async function checkSourceByMeta(id, doi, meta, cache) {
        const key = `${doi}_${id}`;
        const now = Date.now();
        if (cache[key] && (now - cache[key].ts) < CACHE_TTL) return cache[key].status;
        let url = buildUrlForMeta(id, doi, meta);
        if (!url) { cache[key] = { status: 'fail', ts: Date.now(), url: null }; cacheSet(cache); return 'fail'; }
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                timeout: 5000,
                onload: (r) => {
                    const txt = (r.responseText || '').toLowerCase();
                    let status = 'fail';
                    if ((r.finalUrl && r.finalUrl.endsWith('.pdf')) || (r.responseHeaders && /application\/pdf/i.test(r.responseHeaders))) status = 'success';
                    else if (r.status === 200 && /pdf|download|doi/.test(txt)) status = 'partial';
                    cache[key] = { status, ts: Date.now(), url };
                    cacheSet(cache);
                    resolve(status);
                },
                onerror: () => { cache[key] = { status: 'fail', ts: Date.now(), url }; cacheSet(cache); resolve('fail'); },
                ontimeout: () => { cache[key] = { status: 'fail', ts: Date.now(), url }; cacheSet(cache); resolve('fail'); }
            });
        });
    }

    // ---------- Update button visuals ----------
    function updateButtonState(aElement, status) {
        const icon = aElement.querySelector('.v13-icon') || aElement;
        if (!icon) return;
        if (status === 'success') { icon.textContent = '✓'; icon.style.color = '#2ecc71'; }
        else if (status === 'partial') { icon.textContent = '⚠'; icon.style.color = '#f39c12'; }
        else { icon.textContent = '✗'; icon.style.color = '#e74c3c'; }
    }

    // ---------- Settings UI ----------
    function showSettings(panelRef) {
        // if exists remove
        const existing = document.getElementById('v13-settings');
        if (existing) return existing.remove();

        const s = getSettings();
        const dims = getDims();
        const themePref = getThemePref();

        const box = document.createElement('div');
        box.id = 'v13-settings';
        Object.assign(box.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 10000002,
            background: resolveTheme() === 'dark' ? '#111' : '#fff',
            color: resolveTheme() === 'dark' ? '#fff' : '#111',
            padding: '14px',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            maxHeight: '80vh',
            overflowY: 'auto',
            minWidth: '260px'
        });

        const h = document.createElement('div');
        h.style.fontWeight = '700';
        h.style.marginBottom = '8px';
        h.textContent = 'Panel Settings';
        box.appendChild(h);

        // Show all toggle
        const showAllLabel = document.createElement('label');
        showAllLabel.innerHTML = `<input type="checkbox" id="v13-showall"> Show All Sources`;
        box.appendChild(showAllLabel);
        box.appendChild(document.createElement('br'));

        // Minimal mode master checkbox
        const minimalLabel = document.createElement('label');
        minimalLabel.style.display = 'block';
        minimalLabel.style.marginTop = '8px';
        minimalLabel.innerHTML = `<input type="checkbox" id="v13-minimal"> Use Minimal Mode (show only selected below)`;
        box.appendChild(minimalLabel);

        // Manual minimal selection list
        const srcTitle = document.createElement('div');
        srcTitle.style.margin = '8px 0 6px 0';
        srcTitle.textContent = 'Select sources for Minimal Mode:';
        box.appendChild(srcTitle);

        sources.forEach(src => {
            const id = `v13-src-${src.id}`;
            const line = document.createElement('label');
            line.style.display = 'block';
            line.innerHTML = `<input type="checkbox" id="${id}"> ${src.name}`;
            box.appendChild(line);
        });

        // Sci-Hub mirror checkboxes (also exposed here)
        const mirrorsTitle = document.createElement('div');
        mirrorsTitle.style.margin = '8px 0 6px 0';
        mirrorsTitle.textContent = 'Sci-Hub Mirrors (also used for background opens):';
        box.appendChild(mirrorsTitle);
        proxies.sciHub.forEach(m => {
            const label = m.replace(/^https?:\/\//, '');
            const id = `v13-mirror-${label}`;
            const line = document.createElement('label');
            line.style.display = 'block';
            line.innerHTML = `<input type="checkbox" id="${id}"> ${label}`;
            box.appendChild(line);
        });

        // Theme controls (auto/dark/light)
        const themeTitle = document.createElement('div');
        themeTitle.style.margin = '8px 0 6px 0';
        themeTitle.textContent = 'Theme:';
        box.appendChild(themeTitle);

        const themeRow = document.createElement('div');
        ['auto','dark','light'].forEach(opt => {
            const r = document.createElement('label');
            r.style.marginRight = '8px';
            r.innerHTML = `<input type="radio" name="v13-theme" value="${opt}"> ${opt}`;
            themeRow.appendChild(r);
        });
        box.appendChild(themeRow);

        // Explicit dims controls (sliders for accessibility)
        const dimsTitle = document.createElement('div');
        dimsTitle.style.margin = '8px 0 6px 0';
        dimsTitle.textContent = 'Width & Font size (also adjustable with right-edge handle):';
        box.appendChild(dimsTitle);

        const widthLabel = document.createElement('div');
        widthLabel.textContent = `Width: ${dims.width}px`;
        box.appendChild(widthLabel);
        const widthRange = document.createElement('input');
        widthRange.type = 'range';
        widthRange.min = 260; widthRange.max = 600; widthRange.value = dims.width;
        widthRange.style.width = '100%';
        box.appendChild(widthRange);

        const fontLabel = document.createElement('div');
        fontLabel.textContent = `Font: ${dims.fontSize}px`;
        box.appendChild(fontLabel);
        const fontRange = document.createElement('input');
        fontRange.type = 'range';
        fontRange.min = 12; fontRange.max = 20; fontRange.value = dims.fontSize;
        fontRange.style.width = '100%';
        box.appendChild(fontRange);

        const hr = document.createElement('hr');
        hr.style.margin = '10px 0';
        box.appendChild(hr);

        // buttons
        const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
        const closeBtn = document.createElement('button'); closeBtn.textContent = 'Close';
        closeBtn.style.marginLeft = '8px';
        box.appendChild(saveBtn); box.appendChild(closeBtn);

        // inject into doc
        document.body.appendChild(box);

        // initialize UI states
        document.getElementById('v13-showall').checked = s.showAll;
        document.getElementById('v13-minimal').checked = s.minimal;
        if (s.selected?.length) s.selected.forEach(id => {
            const el = document.getElementById(`v13-src-${id}`);
            if (el) el.checked = true;
        });
        // mirrors toggles
        const toggles = getToggles();
        proxies.sciHub.forEach(m => {
            const label = m.replace(/^https?:\/\//, '');
            const el = document.getElementById(`v13-mirror-${label}`);
            if (el) el.checked = !!toggles[`SciHub-${label}`];
        });
        // theme
        const themeInputs = box.querySelectorAll('input[name="v13-theme"]');
        themeInputs.forEach(r => { if (r.value === themePref) r.checked = true; });
        // dims
        widthRange.oninput = () => { widthLabel.textContent = `Width: ${widthRange.value}px`; };
        fontRange.oninput = () => { fontLabel.textContent = `Font: ${fontRange.value}px`; };

        // handlers
        saveBtn.onclick = () => {
            // collect selections
            const newSettings = { showAll: document.getElementById('v13-showall').checked, minimal: document.getElementById('v13-minimal').checked, selected: [] };
            sources.forEach(src => { const el = document.getElementById(`v13-src-${src.id}`); if (el && el.checked) newSettings.selected.push(src.id); });
            setSettings(newSettings);
            // mirrors propagate to toggles
            const newToggles = getToggles();
            proxies.sciHub.forEach(m => {
                const label = m.replace(/^https?:\/\//, '');
                const el = document.getElementById(`v13-mirror-${label}`);
                if (el) newToggles[`SciHub-${label}`] = !!el.checked;
            });
            setToggles(newToggles);
            // theme
            const chosen = box.querySelector('input[name="v13-theme"]:checked')?.value || 'auto';
            setThemePref(chosen);
            // dims
            const chosenW = parseInt(widthRange.value, 10);
            const chosenF = parseInt(fontRange.value, 10);
            setDims({ width: chosenW, fontSize: chosenF });
            // if panel open, apply dims & theme
            const panel = document.getElementById(PANEL_ID);
            if (panel) {
                panel.style.width = `${chosenW}px`;
                panel.style.fontSize = `${chosenF}px`;
                applyTheme(panel);
            }
            box.remove();
        };
        closeBtn.onclick = () => box.remove();
    }

    // ---------- Init on load ----------
    window.addEventListener('load', () => {
        createReopenButton();
        // build automatically unless closed via PAGE_KEY
        try {
            const closed = safeGet(PAGE_KEY, false);
            if (!closed) buildPanel();
        } catch {
            buildPanel();
        }

        // watch for system theme changes (if user set auto)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', e => {
                if (getThemePref() === 'auto') {
                    const panel = document.getElementById(PANEL_ID);
                    if (panel) applyTheme(panel);
                }
            });
        }
    });

})();
