// ==UserScript==
// @name         Letterboxd → Plex opener
// @namespace    lbxd-plex-opener
// @version      2.1.0
// @description  Adds a Plex button on Letterboxd film pages that opens the movie in Plex Web. Authenticates via Plex OAuth PIN.
// @author       vigrid
// @license      MIT
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/imdb/*
// @match        https://letterboxd.com/tmdb/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547974/Letterboxd%20%E2%86%92%20Plex%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/547974/Letterboxd%20%E2%86%92%20Plex%20opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
   * Basic configuration
   **********************/
    const APP = {
        product: 'Letterboxd Plex Opener',
        clientId: getOrMakeClientId(),
        cacheTTLms: 7 * 24 * 60 * 60 * 1000,
        warmRecentlyAdded: true,
        warmCount: 250,
    };

    /**********************
   * Menu commands
   **********************/
    GM_registerMenuCommand('Plex: Configure', openSettings);
    GM_registerMenuCommand('Plex: Clear cache', clearCache);
    GM_registerMenuCommand('Plex: Sign out', signOut);

    /**********************
   * Utilities
   **********************/
    function getOrMakeClientId() {
        let id = GM_getValue('clientId');
        if (!id) {
            id = 'lbxd-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
            GM_setValue('clientId', id);
        }
        return id;
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function xml(text) {
        return new window.DOMParser().parseFromString(text, 'application/xml');
    }

    function $$(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    

    function normalizeTitleYear(t, y) {
        return (t || '').trim().toLowerCase().replace(/\s+/g, ' ') + ' (' + (y || '') + ')';
    }

    // Extract normalized external IDs (IMDb/TMDb) from a list of Plex <Guid> values
    // Returns { imdbId: 'tt1234567' | null, tmdbId: '12345' | null }
    function extractIdsFromGuidStrings(guidStrings) {
        let imdbId = null;
        let tmdbId = null;
        for (let raw of guidStrings || []) {
            const g = String(raw || '').toLowerCase();
            if (!imdbId) {
                const m = g.match(/imdb:\/\/(tt\d+)/) || g.match(/com\.plexapp\.agents\.imdb:\/\/(tt\d+)/);
                if (m) imdbId = m[1];
            }
            if (!tmdbId) {
                const m = g.match(/(?:tmdb|themoviedb):\/\/(\d+)/) || g.match(/com\.plexapp\.agents\.(?:tmdb|themoviedb):\/\/(\d+)/);
                if (m) tmdbId = m[1];
            }
            if (imdbId && tmdbId) break;
        }
        return { imdbId, tmdbId };
    }

    function tmFetch(opts) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: opts.method || 'GET',
                url: opts.url,
                headers: opts.headers || {},
                data: opts.data,
                responseType: opts.responseType || 'text',
                timeout: opts.timeout || 15000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 400) return resolve(resp);
                    const err = new Error(`HTTP ${resp.status} while requesting ${opts.url}`);
                    err.response = resp;
                    reject(err);
                },
                onerror: (resp) => {
                    const err = new Error(`Network error while requesting ${opts.url}`);
                    err.response = resp;
                    reject(err);
                },
                ontimeout: (resp) => {
                    const err = new Error(`Timeout while requesting ${opts.url}`);
                    err.response = resp;
                    reject(err);
                },
            });
        });
    }

    /**********************
   * Settings UI & storage
   **********************/
    function getSettings() {
        const s = GM_getValue('settings') || {
            token: null,                // Plex token (from OAuth PIN or manual)
            // legacy single-server fields (migrated to servers[])
            serverId: null,
            serverName: null,
            connectionUri: null,
            includeLibraries: null,
            // multi-server
            servers: [],                // [{ id, name, uri, enabled, includeLibraries, token }]
            lastAuthCheck: 0,
            lastUpdatedAtBySection: {},
            lastCacheBuild: 0,
            useColoredRows: true,
        };
        // Migration: move legacy single-server into servers[] if present
        if ((!s.servers || !Array.isArray(s.servers)) && (s.serverId || s.connectionUri)) {
            s.servers = [];
        }
        if (Array.isArray(s.servers) && s.servers.length === 0 && (s.serverId || s.connectionUri)) {
            const legacy = {
                id: s.serverId || 'unknown',
                name: s.serverName || 'Plex',
                uri: s.connectionUri || null,
                enabled: true,
                includeLibraries: s.includeLibraries || null,
                token: null,
            };
            s.servers.push(legacy);
            // clear legacy fields to avoid confusion
            s.serverId = null;
            s.serverName = null;
            s.connectionUri = null;
            s.includeLibraries = null;
            GM_setValue('settings', s);
        }
        if (!Array.isArray(s.servers)) s.servers = [];
        if (typeof s.useColoredRows !== 'boolean') s.useColoredRows = true;
        return s;
    }

    function setSettings(next) {
        // Capture previous state to detect auth/server transitions
        let prev = null;
        try { prev = GM_getValue('settings') || {}; } catch (_) { prev = {}; }

        GM_setValue('settings', next);

        // If we just linked Plex or enabled a server, try to resolve current page immediately
        try {
            const prevToken = prev && prev.token ? String(prev.token) : '';
            const nextToken = next && next.token ? String(next.token) : '';
            const prevEnabled = Array.isArray(prev?.servers) ? prev.servers.filter(x => x && x.enabled !== false && x.uri).length : 0;
            const nextEnabled = Array.isArray(next?.servers) ? next.servers.filter(x => x && x.enabled !== false && x.uri).length : 0;
            const tokenBecameValid = (!prevToken && !!nextToken) || (prevToken && nextToken && prevToken !== nextToken);
            const serversBecameUsable = prevEnabled === 0 && nextEnabled > 0;
            const onFilm = /\/letterboxd\.com\/(film|imdb|tmdb)\//.test(location.href);
            if (onFilm && (tokenBecameValid || serversBecameUsable)) {
                try { removeOnboardingCta(); } catch (_) { /* noop */ }
                // Let UI settle, then kick off a fresh resolve without requiring a refresh
                setTimeout(() => { try { main(); } catch (_) { /* noop */ } }, 0);
            }
        } catch (_) { /* noop */ }
    }

    async function openSettings() {
        showSettingsModal();
    }

    function showSettingsModal() {
        ensureSettingsModal();
        const modal = document.getElementById('lbxd-plex-settings');
        if (!modal) return;
        refreshSettingsModal();
        document.documentElement.classList.add('lbxd-plex-settings-open');
    }

    function hideSettingsModal() {
        const modal = document.getElementById('lbxd-plex-settings');
        if (!modal) return;
        document.documentElement.classList.remove('lbxd-plex-settings-open');
    }

    function injectStyles() {
        GM_addStyle(`
    p.service.-plex {
      position: relative;
      margin-left: 0 !important;
      padding-left: 40px !important;
    }
    /* Apply brand color only when enabled globally */
    html.lbxd-plex-colored p.service.-plex { background-color:#CF8E00 !important; }
    p.service.-plex .title .name { color:#fff !important; font-weight: 700; }
    p.service.-plex .brand { margin-left: 10px !important; }
    /* Hover settings gear — white and link-like */
    .lbxd-plex-gear { position:absolute; right:8px; top:50%; transform:translateY(-50%);
      display:inline-flex; align-items:center; justify-content:center;
      width:24px; height:24px; color:#fff; text-decoration:none; font-size:18px; line-height:1;
      font-variant-emoji: text; /* prefer monochrome glyphs when supported */
      font-family: "Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", system-ui, sans-serif;
      opacity:0; transition:opacity .15s ease; pointer-events:none; z-index:1; }
    p.service.-plex:hover .lbxd-plex-gear,
    p.service.-plex:focus-within .lbxd-plex-gear { opacity:1; pointer-events:auto; }
    /* Settings modal */
    #lbxd-plex-settings { display:none; position:fixed; inset:0; z-index:99999; }
    html.lbxd-plex-settings-open #lbxd-plex-settings { display:block; }
    #lbxd-plex-settings .lbxd-plex-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,.5); }
    #lbxd-plex-settings .lbxd-plex-modal { position:relative; max-width:680px; width:92%; margin:8vh auto; background:#121212; color:#eee; border:1px solid #333; border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,.6); }
    #lbxd-plex-settings .lbxd-plex-modal-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid #2a2a2a; font-size:16px; }
    #lbxd-plex-settings .lbxd-plex-close { background:none; color:#ccc; border:0; font-size:18px; cursor:pointer; }
    #lbxd-plex-settings .lbxd-plex-close:hover { color:#fff; }
    #lbxd-plex-settings .lbxd-plex-modal-body { padding:12px 14px 16px; }
    #lbxd-plex-settings .lbxd-plex-row { display:flex; gap:8px; padding:6px 0; }
    #lbxd-plex-settings .lbxd-plex-row .k { width:110px; opacity:.8; }
    #lbxd-plex-settings .lbxd-plex-field { margin:10px 0; }
    #lbxd-plex-settings .lbxd-plex-field label { display:block; margin-bottom:6px; opacity:.85; }
    #lbxd-plex-settings .lbxd-hint { opacity:.8; margin-top:6px; }
    #lbxd-plex-settings .field-line { display:flex; gap:8px; align-items:center; margin: 8px 0; }
    #lbxd-plex-settings input[type="text"] { flex:1; min-width:120px; background:#1b1b1b; color:#eee; border:1px solid #333; border-radius:4px; padding:6px 8px; }
    #lbxd-plex-settings button { background:#2e6bdc; color:#fff; border:0; border-radius:4px; padding:6px 10px; cursor:pointer; }
    #lbxd-plex-settings button:hover { filter:brightness(1.05); }
    #lbxd-plex-settings button:disabled { opacity:.7; cursor:not-allowed; filter:none; }
    #lbxd-plex-settings .lbxd-primary { background:#ff9800; color:#111; font-weight:700; padding:10px 14px; font-size:15px; border-radius:6px; }
    #lbxd-plex-settings .lbxd-primary:hover { filter:brightness(1.08); }
    #lbxd-plex-settings .lbxd-primary:disabled { background:#555; color:#bbb; filter:none; }
    #lbxd-plex-settings .lbxd-plex-actions { display:flex; gap:8px; margin-top:8px; }
    /* Auth row: center Link button and place note underneath */
    #lbxd-plex-settings .lbxd-auth-center { display:flex; flex-direction:column; align-items:center; gap:8px; margin:10px 0; }
    #lbxd-plex-settings .lbxd-auth-center .lbxd-inline-note { text-align:center; opacity:.85; }
    #lbxd-plex-settings .lbxd-auth-status-row { display:flex; align-items:center; gap:8px; }
    #lbxd-plex-settings .lbxd-primary-lg { font-size:17px; padding:12px 18px; border-radius:8px; }

    /* Server block + layout */
    .lbxd-card { border:1px solid #333; border-radius:6px; padding:8px; margin:8px 0; }
    #lbxd-plex-settings .lbxd-server-block:hover { border-color:#484848; }
    #lbxd-plex-settings .lbxd-server-header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
    #lbxd-plex-settings .lbxd-server-header-left { display:flex; align-items:center; gap:8px; }
    #lbxd-plex-settings .lbxd-server-header-right { display:flex; align-items:center; gap:8px; }
    .lbxd-gap-6 { gap:6px; }
    .lbxd-server-cache { margin-top:6px; font-size:.95em; opacity:.85; }
    /* Consistent checkbox color for lists */
    #lbxd-plex-settings input[type="checkbox"] { accent-color:#ff9800; width:16px; height:16px; }
    /* Server enabled checkbox alignment */
    #lbxd-plex-settings .lbxd-enabled-checkbox { transform: translateY(1px); margin-right:2px; }
    /* Libraries: standard checkbox + label, consistent spacing */
    #lbxd-plex-settings .lbxd-libs-list { display:flex; flex-wrap:wrap; gap:8px 14px; padding:6px 0; }
    #lbxd-plex-settings .lbxd-lib-item { display:inline-flex; align-items:center; gap:8px; margin:0; cursor:pointer; user-select:none; }
    #lbxd-plex-settings .lbxd-lib-item input { position:static; opacity:1; width:auto; height:auto; }
    #lbxd-plex-settings .lbxd-lib-item span { color:#eee; }
    .lbxd-mt-6 { margin-top:6px; } .lbxd-mt-8 { margin-top:8px; } .lbxd-mb-8 { margin-bottom:8px; }
    .lbxd-muted { opacity:.8; }
    .lbxd-subtle { opacity:.75; }
    .lbxd-error { color:#f66; }

    /* (no per-server color controls) */

    /* Cache viewer modal shares styling */
    #lbxd-cache-viewer { display:none; position:fixed; inset:0; z-index:99999; }
    html.lbxd-cache-viewer-open #lbxd-cache-viewer { display:block; }
    #lbxd-cache-viewer .lbxd-plex-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,.5); }
    #lbxd-cache-viewer .lbxd-plex-modal { position:relative; max-width:780px; width:94%; margin:8vh auto; background:#121212; color:#eee; border:1px solid #333; border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,.6); }
    #lbxd-cache-viewer .lbxd-plex-modal-header { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid #2a2a2a; font-size:16px; }
    #lbxd-cache-viewer .lbxd-plex-close { background:none; color:#ccc; border:0; font-size:18px; cursor:pointer; }
    #lbxd-cache-viewer .lbxd-plex-close:hover { color:#fff; }
    #lbxd-cache-viewer .lbxd-plex-modal-body { padding:12px 14px 16px; }
    #lbxd-cache-viewer .lbxd-plex-actions { display:flex; gap:8px; margin-top:8px; }
    .lbxd-cache-content { max-height:65vh; overflow:auto; white-space:normal; }
    .lbxd-flex-between { display:flex; justify-content:space-between; align-items:center; }

    /* Mask token input without using type=password to avoid save prompts */
    #lbxd-plex-settings input#lbxd-input-token[data-mask="1"] {
      -webkit-text-security: disc; /* Chrome, Safari */
      text-security: disc; /* non-standard, fallback */
      filter: none;
    }
    #lbxd-plex-settings input#lbxd-input-token[data-mask="0"] {
      -webkit-text-security: none;
      text-security: none;
    }
    
    /* Onboarding CTA (shown when not logged in) */
    #lbxd-plex-setup-cta { display:flex; justify-content:center; margin:12px 0 6px; }
    #lbxd-plex-setup-cta .lbxd-plex-setup-btn {
      background:#CF8E00; color:#111; border:0; border-radius:6px; font-weight:700; padding:10px 14px; cursor:pointer;
      box-shadow:0 2px 0 rgba(0,0,0,.2);
    }
    #lbxd-plex-setup-cta .lbxd-plex-setup-btn:hover { filter:brightness(1.08); }
  `);
    }

    function ensureSettingsModal() {
        if (document.getElementById('lbxd-plex-settings')) return;
        const wrap = document.createElement('div');
        wrap.id = 'lbxd-plex-settings';
        wrap.innerHTML = `
  <div class="lbxd-plex-modal-backdrop" data-close="1"></div>
  <div class="lbxd-plex-modal">
    <div class="lbxd-plex-modal-header">
      <strong>Letterboxd → Plex Settings</strong>
      <button class="lbxd-plex-close" title="Close" aria-label="Close">✕</button>
    </div>
    <div class="lbxd-plex-modal-body">
      <div class="lbxd-plex-field">
        <div class="lbxd-auth-center">
          <button id="lbxd-btn-link" class="lbxd-primary lbxd-primary-lg">Link Plex (OAuth)</button>
          <div class="lbxd-auth-status-row">
            <div class="lbxd-inline-note" id="lbxd-auth-note"></div>
            <button id="lbxd-btn-signout-inline" class="lbxd-inline-action" style="display:none">Sign out</button>
          </div>
        </div>
      </div>

      <div class="lbxd-plex-field">
        <div class="field-line">
          <button id="lbxd-btn-refresh-servers">Refresh servers</button>
          <button id="lbxd-btn-test-all">Test all</button>
          <button id="lbxd-btn-preload-all">Preload all</button>
        </div>
        <div id="lbxd-servers" class="lbxd-servers">Loading…</div>
        <div class="field-line">
          <button id="lbxd-btn-view-cache">View cache</button>
          <button id="lbxd-btn-clear-cache">Clear cache</button>
        </div>
        <div class="field-line">
          <label><input type="checkbox" id="lbxd-chk-colored-rows"> Highlight Plex rows in Watch box</label>
        </div>
      </div>
    </div>
  </div>`;
        document.body.appendChild(wrap);

        // Wiring
        wrap.querySelector('.lbxd-plex-close')?.addEventListener('click', hideSettingsModal);
        wrap.querySelector('.lbxd-plex-modal-backdrop')?.addEventListener('click', (e) => {
            if (e.target && e.target.getAttribute('data-close')) hideSettingsModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') hideSettingsModal();
        });

        wrap.querySelector('#lbxd-btn-save-token')?.addEventListener('click', () => {
            const v = String(document.getElementById('lbxd-input-token').value || '').trim();
            if (!v) return;
            const ns = getSettings();
            ns.token = v;
            setSettings(ns);
            alert('Token saved.');
            refreshSettingsModal();
        });

        wrap.querySelector('#lbxd-btn-link')?.addEventListener('click', async () => {
            await oauthLink();
            refreshSettingsModal();
        });

        wrap.querySelector('#lbxd-btn-signout-inline')?.addEventListener('click', () => {
            signOut();
            refreshSettingsModal();
        });

        wrap.querySelector('#lbxd-btn-toggle-token')?.addEventListener('click', () => {
            const inp = document.getElementById('lbxd-input-token');
            const btn = document.getElementById('lbxd-btn-toggle-token');
            if (!inp || !btn) return;
            const showing = btn.getAttribute('data-show') === '1';
            if (showing) {
                inp.setAttribute('data-mask', '1');
                btn.textContent = 'Show';
                btn.setAttribute('data-show', '0');
            } else {
                inp.setAttribute('data-mask', '0');
                btn.textContent = 'Hide';
                btn.setAttribute('data-show', '1');
            }
        });

        wrap.querySelector('#lbxd-btn-test-all')?.addEventListener('click', async () => {
            await testAllConnections();
        });

        wrap.querySelector('#lbxd-btn-refresh-servers')?.addEventListener('click', async () => {
            await renderServersInModal(true);
        });

        wrap.querySelector('#lbxd-btn-preload-all')?.addEventListener('click', async () => {
            await preloadAll();
        });

        // Global colored rows toggle
        wrap.querySelector('#lbxd-chk-colored-rows')?.addEventListener('change', () => {
            const ns = getSettings();
            const el = document.getElementById('lbxd-chk-colored-rows');
            ns.useColoredRows = !!(el && el.checked);
            setSettings(ns);
            try { applyGlobalColorSetting(); } catch (_) {}
        });

        wrap.querySelector('#lbxd-btn-view-cache')?.addEventListener('click', () => {
            openCacheViewer();
        });

        wrap.querySelector('#lbxd-btn-clear-cache')?.addEventListener('click', () => {
            clearCache();
            refreshSettingsModal();
        });

        wrap.querySelector('#lbxd-btn-signout')?.addEventListener('click', () => {
            signOut();
            refreshSettingsModal();
        });
    }

    function refreshSettingsModal() {
        const s = getSettings();
        const el = (id) => document.getElementById(id);
        const inTok = el('lbxd-input-token'); if (inTok) inTok.value = s.token || '';
        const note = el('lbxd-auth-note');
        if (note) note.textContent = s.token ? 'Account linked' : 'Not linked';
        const linkBtn = el('lbxd-btn-link');
        if (linkBtn) linkBtn.disabled = !!s.token;
        const signoutInline = el('lbxd-btn-signout-inline');
        if (signoutInline) signoutInline.style.display = s.token ? '' : 'none';
        const chk = el('lbxd-chk-colored-rows');
        if (chk) chk.checked = !!s.useColoredRows;
        try { applyGlobalColorSetting(); } catch (_) {}

        renderServersInModal();
    }

    async function renderServersInModal(forceRefresh = false) {
        const container = document.getElementById('lbxd-servers');
        if (!container) return;
        const s = getSettings();
        if (!s.token) {
            container.innerHTML = '<span class="lbxd-muted">Link your Plex account first.</span>';
            return;
        }

        container.textContent = 'Loading…';
        const frag = document.createDocumentFragment();

        // Unified list: all account servers, showing enabled ones first in configured order
        let accountDevices = [];
        try { accountDevices = await fetchAccountServers(forceRefresh); } catch (_) { accountDevices = []; }
        const configured = Array.isArray(s.servers) ? s.servers.slice() : [];
        const byId = new Map(accountDevices.map(d => [d.id, d]));

        // Build combined list: configured in order, then remaining account devices
        const seen = new Set();
        const items = [];
        for (const srv of configured) {
            seen.add(srv.id);
            items.push({
                source: 'configured',
                id: srv.id,
                name: srv.name || (byId.get(srv.id)?.name) || srv.id,
                uri: srv.uri,
                enabled: srv.enabled !== false,
                token: srv.token || null,
                _cfg: srv,
            });
        }
        for (const dev of accountDevices) {
            if (seen.has(dev.id)) continue;
            items.push({
                source: 'account',
                id: dev.id,
                name: dev.name || dev.id,
                uri: null,
                enabled: false,
                token: null,
                _dev: dev,
            });
        }

        if (!items.length) {
            const none = document.createElement('div');
            none.className = 'lbxd-muted';
            none.textContent = 'No servers found on this Plex account.';
            frag.appendChild(none);
        }

        items.forEach((it, idx) => {
            const block = document.createElement('div');
            block.className = 'lbxd-server-block lbxd-card';

            const header = document.createElement('div');
            header.className = 'lbxd-server-header';

            const left = document.createElement('div');
            left.className = 'lbxd-server-header-left';
            // Enabled checkbox (keep as checkmark)
            const en = document.createElement('input');
            en.type = 'checkbox';
            en.checked = !!it.enabled;
            en.title = 'Enabled';
            en.className = 'lbxd-enabled-checkbox';
            en.addEventListener('change', async () => {
                if (it.source === 'configured') {
                    const ns = getSettings();
                    const me = (ns.servers || []).find(x => x.id === it.id);
                    if (me) { me.enabled = !!en.checked; setSettings(ns); }
                    renderServersInModal();
                } else {
                    if (en.checked) {
                        // enabling new device
                        const btn = block.querySelector('button[data-role="enable"]');
                        if (btn) { btn.disabled = true; btn.textContent = 'Enabling…'; }
                        try { await enableDeviceServer(it._dev); }
                        finally { await renderServersInModal(); }
                    }
                }
            });
            const name = document.createElement('strong'); name.textContent = it.name;
            // Show ID and URL as tooltip over the name
            const tooltipParts = [`ID: ${it.id}`];
            tooltipParts.push(`URL: ${it.uri ? it.uri : (it.source === 'configured' ? 'no connection' : 'not configured')}`);
            name.title = tooltipParts.join('\n');
            left.append(en, name);

            const right = document.createElement('div');
            right.className = 'lbxd-server-header-right lbxd-gap-6';

            // Reorder only for enabled configured servers
            if (it.source === 'configured' && it.enabled) {
                const btnUp = document.createElement('button'); btnUp.textContent = '↑'; btnUp.title = 'Move up'; btnUp.disabled = idx === 0;
                btnUp.addEventListener('click', () => { moveServerUp(it.id); renderServersInModal(); });
                const btnDown = document.createElement('button'); btnDown.textContent = '↓'; btnDown.title = 'Move down'; btnDown.disabled = idx === configured.length - 1; // reorder space among configured
                btnDown.addEventListener('click', () => { moveServerDown(it.id); renderServersInModal(); });
                right.append(btnUp, btnDown);
            }

            if (it.source === 'configured') {
                const btnTest = document.createElement('button'); btnTest.textContent = 'Test';
                btnTest.addEventListener('click', async () => {
                    const ns = getSettings();
                    const me = (ns.servers || []).find(x => x.id === it.id);
                    if (me) await testConnectionForServer(me);
                });
                const btnPreload = document.createElement('button'); btnPreload.textContent = 'Preload';
                btnPreload.addEventListener('click', async () => {
                    btnPreload.disabled = true; btnPreload.textContent = 'Preloading…';
                    try { await preloadAllForServer(it._cfg || it, (prog) => { libsWrap.textContent = `Indexing ${prog.phase || 'library'}… ${prog.done}/${prog.total || '?'}`; }); }
                    finally { btnPreload.disabled = false; btnPreload.textContent = 'Preload'; renderServersInModal(); }
                });
                const btnRemove = document.createElement('button'); btnRemove.textContent = 'Remove';
                btnRemove.addEventListener('click', () => {
                    const ns = getSettings();
                    ns.servers = (ns.servers || []).filter(x => x.id !== it.id);
                    setSettings(ns);
                    renderServersInModal();
                });
                right.append(btnTest, btnPreload, btnRemove);
            } else {
                // account-only row: show explicit Enable button as well
                const btn = document.createElement('button'); btn.textContent = 'Enable'; btn.setAttribute('data-role', 'enable');
                btn.addEventListener('click', async () => {
                    btn.disabled = true; btn.textContent = 'Enabling…';
                    try { await enableDeviceServer(it._dev); }
                    finally { await renderServersInModal(); }
                });
                right.append(btn);
            }

            header.append(left, right);

            // Cache stats line
            const cacheLine = document.createElement('div');
            cacheLine.className = 'lbxd-server-cache';
            if (it.source === 'configured') {
                const sIx = getServerIndex(it.id);
                const preloaded = uniqueRatingKeyCount(sIx.byImdb, sIx.byTmdb);
                const matched = uniqueRatingKeyCount(sIx.bySlug);
                cacheLine.textContent = `Cache — Preloaded: ${preloaded} • Matched: ${matched}`;
            } else {
                cacheLine.textContent = '';
            }

            const libsWrap = document.createElement('div');
            libsWrap.className = 'libs lbxd-libs-list lbxd-mt-8';
            if (it.source === 'configured') {
                libsWrap.textContent = 'Loading libraries…';
            } else {
                libsWrap.classList.add('lbxd-muted');
                libsWrap.textContent = 'Enable to configure libraries.';
            }

            block.append(header, cacheLine, libsWrap);
            frag.appendChild(block);

            // Preload libraries for configured servers
            if (it.source === 'configured') {
                loadLibrariesForServer(it._cfg || it, libsWrap).then(() => {
                    libsWrap.setAttribute('data-loaded', '1');
                }).catch(() => {
                    /* handled in loader */
                });
            }
        });

        container.innerHTML = '';
        container.appendChild(frag);
    }

    // Cache for fetched account servers
    let __lbxd_cachedAccountServers = null;
    let __lbxd_cachedAt = 0;
    async function fetchAccountServers(force = false) {
        const s = getSettings();
        if (!s.token) return [];
        if (!force && __lbxd_cachedAccountServers && Date.now() - __lbxd_cachedAt < 60 * 1000) {
            return __lbxd_cachedAccountServers;
        }
        const res = await tmFetch({
            url: `https://plex.tv/api/resources?includeHttps=1&includeRelay=1&X-Plex-Token=${encodeURIComponent(s.token)}`,
            headers: { 'Accept': 'application/xml', 'X-Plex-Product': APP.product, 'X-Plex-Client-Identifier': APP.clientId }
        });
        const doc = xml(res.responseText);
        const devices = Array.from(doc.querySelectorAll('Device[provides*="server"]')).map(d => ({
            id: d.getAttribute('clientIdentifier'),
            name: d.getAttribute('name'),
            accessToken: d.getAttribute('accessToken') || null,
            connections: Array.from(d.querySelectorAll('Connection')),
        }));
        __lbxd_cachedAccountServers = devices;
        __lbxd_cachedAt = Date.now();
        return devices;
    }

    async function enableDeviceServer(dev) {
        const s = getSettings();
        const tokenForConn = dev.accessToken || s.token;
        const uri = await chooseBestConnection(dev.connections, tokenForConn);
        if (!uri) {
            alert('Could not reach any connection for this server. Ensure Remote Access or Relay is enabled.');
            return false;
        }
        const ns = getSettings();
        if (!Array.isArray(ns.servers)) ns.servers = [];
        if (ns.servers.some(x => x.id === dev.id)) return true;
        ns.servers.push({ id: dev.id, name: dev.name, uri, enabled: true, includeLibraries: null, token: dev.accessToken || null });
        ns.lastAuthCheck = Date.now();
        setSettings(ns);
        return true;
    }

    function moveServerUp(id) {
        const ns = getSettings();
        const arr = Array.isArray(ns.servers) ? ns.servers : [];
        const i = arr.findIndex(x => x.id === id);
        if (i > 0) {
            const [it] = arr.splice(i, 1);
            arr.splice(i - 1, 0, it);
            ns.servers = arr;
            setSettings(ns);
        }
    }
    function moveServerDown(id) {
        const ns = getSettings();
        const arr = Array.isArray(ns.servers) ? ns.servers : [];
        const i = arr.findIndex(x => x.id === id);
        if (i !== -1 && i < arr.length - 1) {
            const [it] = arr.splice(i, 1);
            arr.splice(i + 1, 0, it);
            ns.servers = arr;
            setSettings(ns);
        }
    }
    

    async function loadLibrariesForServer(srv, container) {
        if (!container) return;
        try { container.classList.add('lbxd-libs-list'); } catch (_) { /* noop */ }
        const s = getSettings();
        const token = srv?.token || s.token;
        if (!token || !srv.uri) {
            container.innerHTML = '<span class="lbxd-muted">Set token and connection for this server.</span>';
            return;
        }
        container.textContent = 'Loading…';
        try {
            const r = await tmFetch({
                url: `${srv.uri}/library/sections?X-Plex-Token=${encodeURIComponent(token)}`,
                headers: plexHeaders(),
                timeout: 10000,
            });
            const doc = xml(r.responseText);
            const dirs = Array.from(doc.querySelectorAll('MediaContainer > Directory'))
                .filter(d => {
                    const t = (d.getAttribute('type') || '').toLowerCase();
                    return t === 'movie' || t === 'show' || t === '1' || t === '2';
                });
            const sel = new Set(String(srv.includeLibraries || '').split(',').map(x => x.trim()).filter(Boolean));
            if (!dirs.length) {
                container.innerHTML = '<span class="lbxd-muted">No movie/TV libraries found for this server.</span>';
                return;
            }
            const allSelected = sel.size === 0 || sel.size === dirs.length;
            const frag = document.createDocumentFragment();
            dirs.forEach(d => {
                const id = d.getAttribute('key');
                const name = d.getAttribute('title') || `Section ${id}`;
                const line = document.createElement('label');
                line.className = 'lbxd-lib-item';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.setAttribute('data-lib', id);
                cb.checked = allSelected || sel.has(id);
                // Save immediately on toggle
                cb.addEventListener('change', () => {
                    const cbs = Array.from(container.querySelectorAll('input[type="checkbox"][data-lib]'));
                    const selected = cbs.filter(x => x.checked).map(x => x.getAttribute('data-lib'));
                    const ns = getSettings();
                    const me = (ns.servers || []).find(x => x.id === srv.id);
                    if (me) {
                        me.includeLibraries = (selected.length && selected.length !== cbs.length) ? selected.join(',') : null;
                        setSettings(ns);
                    }
                });
                const span = document.createElement('span');
                span.textContent = name;
                span.title = `Section ID: ${id}`;
                line.append(cb, span);
                frag.appendChild(line);
            });
            container.innerHTML = '';
            container.appendChild(frag);
        } catch (e) {
            console.error('[Plex opener] loadLibrariesForServer failed:', e);
            container.innerHTML = '<span class="lbxd-error">Failed to load libraries. Check connection.</span>';
        }
    }

    async function signOut() {
        const ns = getSettings();
        ns.token = null;
        setSettings(ns);
        alert('Signed out from Plex in this userscript.');
        try { ensureOnboardingCta(); } catch (_) { /* noop */ }
    }

    function clearCache() {
        GM_setValue('indexCache', null);
        const s = getSettings();
        s.lastCacheBuild = 0;
        s.lastUpdatedAtBySection = {};
        setSettings(s);
        alert('Plex index cache cleared.');
    }

    /**********************
   * Plex OAuth PIN flow (auth token)
   * Docs & examples:
   *  - Request PIN + complete via app.plex.tv/auth (PIN flow)
   **********************/
    async function oauthLink() {
        const clientId = APP.clientId;
        // 1) Create a PIN
        const resp = await tmFetch({
            method: 'POST',
            url: 'https://plex.tv/api/v2/pins?strong=true',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Plex-Product': APP.product,
                'X-Plex-Client-Identifier': clientId,
            },
            data: JSON.stringify({ strong: true })
        });
        const pin = JSON.parse(resp.responseText);
        const pinId = pin.id;
        const code = pin.code;

        // 2) Send user to Plex to approve
        const authUrl = `https://app.plex.tv/auth#?clientID=${encodeURIComponent(clientId)}&code=${encodeURIComponent(code)}&context%5Bdevice%5D%5Bproduct%5D=${encodeURIComponent(APP.product)}`;
        GM_openInTab(authUrl, { active: true, insert: true });

        // 3) Poll for token (up to ~2 minutes)
        let token = null;
        for (let i = 0; i < 120; i++) {
            await sleep(1000);
            const status = await tmFetch({
                method: 'GET',
                url: `https://plex.tv/api/v2/pins/${pinId}`,
                headers: {
                    'Accept': 'application/json',
                    'X-Plex-Client-Identifier': clientId,
                }
            });
            const obj = JSON.parse(status.responseText);
            if (obj.authToken) {
                token = obj.authToken;
                break;
            }
            if (obj.expiresAt && Date.now() / 1000 > obj.expiresAt) break;
        }

        if (!token) {
            alert('Plex authorization timed out. Try again.');
            return;
        }

        const ns = getSettings();
        ns.token = token;
        setSettings(ns);
        alert('Plex account linked! Now pick a server.');
        try { removeOnboardingCta(); } catch (_) { /* noop */ }
    }

    function isRfc1918Host(hostname) {
        // Host may look like "108-39-42-168.hash.plex.direct" or "192-168-1-10.hash.plex.direct"
        const m = String(hostname).match(/^(\d{1,3}(?:-\d{1,3}){3})\./);
        const ip = m ? m[1].replace(/-/g, '.') : hostname;
        if (/^10\.\d+\.\d+\.\d+$/.test(ip)) return true;
        if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(ip)) return true;
        if (/^192\.168\.\d+\.\d+$/.test(ip)) return true;
        if (/^127\.\d+\.\d+\.\d+$/.test(ip)) return true;
        return false;
    }

    async function testConn(uri, token) {
        try {
            const r = await tmFetch({
                url: `${uri}/identity?X-Plex-Token=${encodeURIComponent(token)}`,
                headers: plexHeaders(),
                timeout: 7000,
            });
            return r.status >= 200 && r.status < 400 && /<MediaContainer/.test(r.responseText);
        } catch {
            return false;
        }
    }

    /**
 * Build a priority-sorted list and **only** return a URI that passes /identity.
 * If nothing passes, return null (don’t hand back a known-bad URI).
 * Priority:
 *  1) https + relay
 *  2) https + plex.direct + remote-friendly
 *  3) https + other remote-friendly
 *  4) http + remote-friendly
 *  5) local-only (RFC1918) — last resort and only if it actually passes test
 */
    async function chooseBestConnection(conns, token) {
        const scored = conns.map(c => {
            const uri = c.getAttribute('uri');
            const u = new URL(uri);
            const protocol = c.getAttribute('protocol');         // "http"|"https"
            const relay = c.getAttribute('relay') === '1';
            const isPlexDirect = /\.plex\.direct$/i.test(u.hostname);
            const remoteFriendly = !isRfc1918Host(u.hostname);

            let score = 0;
            if (protocol === 'https' && relay) score = 100;
            else if (protocol === 'https' && isPlexDirect && remoteFriendly) score = 90;
            else if (protocol === 'https' && remoteFriendly) score = 80;
            else if (protocol === 'http' && remoteFriendly) score = 60;
            else score = 10; // local-only/LAN

            return { uri, score, relay, remoteFriendly };
        }).sort((a, b) => b.score - a.score);

        for (const c of scored) {
            if (await testConn(c.uri, token)) return c.uri;
        }
        return null;
    }

    /**********************
   * Choose server + connection (plex.tv/resources)
   *    – verifies you actually have access to the server
   *    – chooses a good https *.plex.direct URI
   * Docs:
   *  - /api/resources listing servers
   **********************/
    

    /**********************
   * Build Plex links for a ratingKey
   *  - Plex Web: https://app.plex.tv/desktop/#!/server/{serverId}/details?key=/library/metadata/{ratingKey}
   **********************/
    function plexLinks(ratingKey, serverId) {
        const key = `/library/metadata/${ratingKey}`;
        const web = `https://app.plex.tv/desktop#!/server/${encodeURIComponent(serverId)}/details?key=${encodeURIComponent(key)}`;
        return { web };
    }

    async function fetchLibraryInfo(ctx, ratingKey) {
        try {
            const s = getSettings();
            const token = ctx?.token || s.token;
            if (!token || !ctx?.uri) return { sectionId: null, sectionTitle: null };
            const url = `${ctx.uri}/library/metadata/${encodeURIComponent(ratingKey)}?X-Plex-Token=${encodeURIComponent(token)}`;
            const r = await tmFetch({ url, headers: plexHeaders(), timeout: 8000 });
            const doc = xml(r.responseText);
            const mc = doc.querySelector('MediaContainer');
            const sectionId = mc?.getAttribute('librarySectionID') || doc.querySelector('[librarySectionID]')?.getAttribute('librarySectionID') || null;
            const sectionTitle = mc?.getAttribute('librarySectionTitle') || doc.querySelector('[librarySectionTitle]')?.getAttribute('librarySectionTitle') || null;
            return { sectionId, sectionTitle };
        } catch {
            return { sectionId: null, sectionTitle: null };
        }
    }

    /**********************
   * Fast item lookup + caching
   *  - Prefer GUID matches (IMDb/TMDb) when available
   *  - Fallback to title+year
   *  - Cache each resolution and (optionally) warm with Recently Added
   * Relevant endpoints:
   *  - /library/sections (to check updatedAt)
   *  - /search?query=... (cross-library search)
   **********************/
    function getIndex() {
        return GM_getValue('indexCache') || { servers: {} };
    }
    function saveIndex(ix) { GM_setValue('indexCache', ix); }
    function getServerIndex(serverId) {
        const ix = getIndex();
        if (!ix.servers) ix.servers = {};
        if (!ix.servers[serverId]) ix.servers[serverId] = { byImdb: {}, byTmdb: {}, byTitleYear: {}, bySlug: {}, builtAt: 0 };
        return ix.servers[serverId];
    }
    function setServerIndex(serverId, serverIx) {
        const ix = getIndex();
        if (!ix.servers) ix.servers = {};
        ix.servers[serverId] = serverIx;
        saveIndex(ix);
    }
    function shouldRebuildIndex(serverId) {
        const sIx = getServerIndex(serverId);
        return (Date.now() - (sIx.builtAt || 0)) > APP.cacheTTLms;
    }

    async function ensureWarmIndex() {
        try {
            const s = getSettings();
            if (!s.token) return;
            const servers = (s.servers || []).filter(x => x.enabled !== false && x.uri);
            if (!servers.length) return;
            if (!APP.warmRecentlyAdded) return;

            for (const srv of servers) {
                if (!shouldRebuildIndex(srv.id)) continue;
                try {
                    const token = srv?.token || s.token;
                    const url = `${srv.uri}/hubs/home/recentlyAdded?count=${APP.warmCount}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
                    const r = await tmFetch({ url, headers: plexHeaders() });
                    const doc = xml(r.responseText);
                    const sIx = getServerIndex(srv.id);
                    doc.querySelectorAll('Metadata[type="movie"], Metadata[type="show"]').forEach(item => {
                        const rk = item.getAttribute('ratingKey');
                        const guids = Array.from(item.querySelectorAll('Guid')).map(g => g.getAttribute('id') || '');
                        // include fallback to `guid` attribute on item
                        const guidAttr = item.getAttribute('guid');
                        if (guidAttr) guids.push(guidAttr);
                        for (const g of guids) {
                            const lower = g.toLowerCase();
                            const imdb = lower.match(/imdb:\/\/(tt\d+)/) || lower.match(/com\.plexapp\.agents\.imdb:\/\/(tt\d+)/);
                            if (imdb) sIx.byImdb[imdb[1]] = rk;
                            const tmdb = lower.match(/tmdb:\/\/(\d+)/) || lower.match(/com\.plexapp\.agents\.tmdb:\/\/(\d+)/) || lower.match(/com\.plexapp\.agents\.themoviedb:\/\/(\d+)/);
                            if (tmdb) sIx.byTmdb[tmdb[1]] = rk;
                        }
                    });
                    sIx.builtAt = Date.now();
                    setServerIndex(srv.id, sIx);
                } catch (_) { /* ignore per-server failure */ }
            }
        } catch (_) {
            /* non-fatal */
        }
    }

    function plexHeaders() {
        const s = getSettings();
        return {
            'Accept': 'application/xml',
            'X-Plex-Product': APP.product,
            'X-Plex-Version': '1.0',
            'X-Plex-Client-Identifier': APP.clientId,
            // token also in query param; many PMS endpoints accept either
        };
    }

    

    // Count unique ratingKeys across one or more key→ratingKey maps
    function uniqueRatingKeyCount(...maps) {
        const set = new Set();
        for (const m of maps) {
            if (!m) continue;
            for (const v of Object.values(m)) {
                if (v != null && v !== '') set.add(String(v));
            }
        }
        return set.size;
    }

    async function preloadMoviesForServer(srv, onProgress) {
        const s = getSettings();
        const token = srv?.token || s.token;
        if (!token || !srv?.uri) { alert(`Set token and connection for server ${srv?.name || srv?.id || ''}.`); return false; }

        // Discover movie sections, respecting includeLibraries if set
        let sections = [];
        try {
            const r = await tmFetch({ url: `${srv.uri}/library/sections?X-Plex-Token=${encodeURIComponent(token)}`, headers: plexHeaders(), timeout: 15000 });
            const doc = xml(r.responseText);
            const dirs = Array.from(doc.querySelectorAll('MediaContainer > Directory'))
                .filter(d => {
                    const t = (d.getAttribute('type') || '').toLowerCase();
                    return t === 'movie' || t === '1';
                })
                .map(d => ({ id: d.getAttribute('key'), title: d.getAttribute('title') || d.getAttribute('key') }));
            const whitelist = String(srv.includeLibraries || '').split(',').map(x => x.trim()).filter(Boolean);
            sections = whitelist.length ? dirs.filter(d => whitelist.includes(d.id)) : dirs;
        } catch (e) {
            alert(`Failed to list libraries for ${srv.name || srv.id}.`);
            return false;
        }

        if (!sections.length) { alert(`No movie libraries to preload on ${srv.name || srv.id}.`); return false; }

        const sIx = getServerIndex(srv.id);
        const pageSize = 200;
        let totalAcross = 0, doneAcross = 0;

        for (const sec of sections) {
            let start = 0; let total = null; let keepGoing = true;
            while (keepGoing) {
                try {
                    const url = `${srv.uri}/library/sections/${encodeURIComponent(sec.id)}/all?type=1&includeGuids=1&X-Plex-Container-Start=${start}&X-Plex-Container-Size=${pageSize}&X-Plex-Token=${encodeURIComponent(token)}`;
                    const r = await tmFetch({ url, headers: plexHeaders(), timeout: 20000 });
                    const doc = xml(r.responseText);
                    const mc = doc.querySelector('MediaContainer');
                    const items = Array.from(doc.querySelectorAll('Video[type="movie"], Video')); // some servers omit type attr; search all Video
                    if (total == null) {
                        const ts = parseInt(mc?.getAttribute('totalSize') || mc?.getAttribute('size') || items.length, 10);
                        total = isNaN(ts) ? null : ts;
                        if (total != null) totalAcross += total;
                    }

                    for (const item of items) {
                        const rk = item.getAttribute('ratingKey');
                        const guids = Array.from(item.querySelectorAll('Guid')).map(g => (g.getAttribute('id') || '')).filter(Boolean);
                        const guidAttr = item.getAttribute('guid');
                        if (guidAttr) guids.push(guidAttr);
                        const ids = extractIdsFromGuidStrings(guids);
                        if (ids.imdbId) sIx.byImdb[ids.imdbId] = rk;
                        if (ids.tmdbId) sIx.byTmdb[ids.tmdbId] = rk;
                    }
                    doneAcross += items.length;
                    if (typeof onProgress === 'function') onProgress({ section: sec.id, done: doneAcross, total: totalAcross || undefined });
                    // Persist progress incrementally
                    setServerIndex(srv.id, sIx);

                    if (!items.length) { keepGoing = false; break; }
                    start += items.length;
                    if (total != null && start >= total) { keepGoing = false; }
                } catch (e) {
                    // Stop this section on errors but keep others
                    break;
                }
            }
        }

        sIx.builtAt = Date.now();
        setServerIndex(srv.id, sIx);
        return true;
    }

    async function preloadShowsForServer(srv, onProgress) {
        const s = getSettings();
        const token = srv?.token || s.token;
        if (!token || !srv?.uri) { alert(`Set token and connection for server ${srv?.name || srv?.id || ''}.`); return false; }

        // Discover show sections, respecting includeLibraries if set
        let sections = [];
        try {
            const r = await tmFetch({ url: `${srv.uri}/library/sections?X-Plex-Token=${encodeURIComponent(token)}`, headers: plexHeaders(), timeout: 15000 });
            const doc = xml(r.responseText);
            const dirs = Array.from(doc.querySelectorAll('MediaContainer > Directory'))
                .filter(d => {
                    const t = (d.getAttribute('type') || '').toLowerCase();
                    return t === 'show' || t === '2';
                })
                .map(d => ({ id: d.getAttribute('key'), title: d.getAttribute('title') || d.getAttribute('key') }));
            const whitelist = String(srv.includeLibraries || '').split(',').map(x => x.trim()).filter(Boolean);
            sections = whitelist.length ? dirs.filter(d => whitelist.includes(d.id)) : dirs;
        } catch (e) {
            alert(`Failed to list libraries for ${srv.name || srv.id}.`);
            return false;
        }

        if (!sections.length) { alert(`No TV libraries to preload on ${srv.name || srv.id}.`); return false; }

        const sIx = getServerIndex(srv.id);
        const pageSize = 200;
        let totalAcross = 0, doneAcross = 0;

        for (const sec of sections) {
            let start = 0; let total = null; let keepGoing = true;
            while (keepGoing) {
                try {
                    const url = `${srv.uri}/library/sections/${encodeURIComponent(sec.id)}/all?type=2&includeGuids=1&X-Plex-Container-Start=${start}&X-Plex-Container-Size=${pageSize}&X-Plex-Token=${encodeURIComponent(token)}`;
                    const r = await tmFetch({ url, headers: plexHeaders(), timeout: 20000 });
                    const doc = xml(r.responseText);
                    const mc = doc.querySelector('MediaContainer');
                    // For shows, PMS usually returns Directory nodes; some servers omit type attr
                    const items = Array.from(doc.querySelectorAll('Directory[type="show"], Directory'));
                    if (total == null) {
                        const ts = parseInt(mc?.getAttribute('totalSize') || mc?.getAttribute('size') || items.length, 10);
                        total = isNaN(ts) ? null : ts;
                        if (total != null) totalAcross += total;
                    }

                    for (const item of items) {
                        const rk = item.getAttribute('ratingKey');
                        const guids = Array.from(item.querySelectorAll('Guid')).map(g => (g.getAttribute('id') || '')).filter(Boolean);
                        const guidAttr = item.getAttribute('guid');
                        if (guidAttr) guids.push(guidAttr);
                        const ids = extractIdsFromGuidStrings(guids);
                        if (ids.imdbId) sIx.byImdb[ids.imdbId] = rk;
                        if (ids.tmdbId) sIx.byTmdb[ids.tmdbId] = rk;
                    }
                    doneAcross += items.length;
                    if (typeof onProgress === 'function') onProgress({ section: sec.id, done: doneAcross, total: totalAcross || undefined });
                    // Persist progress incrementally
                    setServerIndex(srv.id, sIx);

                    if (!items.length) { keepGoing = false; break; }
                    start += items.length;
                    if (total != null && start >= total) { keepGoing = false; }
                } catch (e) {
                    // Stop this section on errors but keep others
                    break;
                }
            }
        }

        sIx.builtAt = Date.now();
        setServerIndex(srv.id, sIx);
        return true;
    }

    async function preloadAllForServer(srv, onProgress) {
        // Movies first, then shows. Pass phase to onProgress for clear UI.
        await preloadMoviesForServer(srv, (p) => {
            if (typeof onProgress === 'function') onProgress(Object.assign({}, p, { phase: 'movies' }));
        });
        await preloadShowsForServer(srv, (p) => {
            if (typeof onProgress === 'function') onProgress(Object.assign({}, p, { phase: 'shows' }));
        });
    }

    async function preloadAll() {
        const s = getSettings();
        if (!s.token) { alert('Link Plex first.'); return; }
        const servers = (s.servers || []).filter(x => x.enabled !== false && x.uri);
        if (!servers.length) { alert('No servers configured.'); return; }
        for (const srv of servers) {
            try {
                await preloadAllForServer(srv);
            } catch (_) { /* continue next */ }
        }
        alert('Preload complete. Open View cache to inspect.');
    }

    async function preloadAllShows() {
        const s = getSettings();
        if (!s.token) { alert('Link Plex first.'); return; }
        const servers = (s.servers || []).filter(x => x.enabled !== false && x.uri);
        if (!servers.length) { alert('No servers configured.'); return; }
        for (const srv of servers) {
            try {
                await preloadShowsForServer(srv);
            } catch (_) { /* continue next */ }
        }
        alert('Preload complete. Open View cache to inspect.');
    }

    async function preloadAllMovies() {
        const s = getSettings();
        if (!s.token) { alert('Link Plex first.'); return; }
        const servers = (s.servers || []).filter(x => x.enabled !== false && x.uri);
        if (!servers.length) { alert('No servers configured.'); return; }
        for (const srv of servers) {
            try {
                await preloadMoviesForServer(srv);
            } catch (_) { /* continue next */ }
        }
        alert('Preload complete. Open View cache to inspect.');
    }

    function openCacheViewer() { ensureCacheViewer(); renderCacheViewer(); const m = document.getElementById('lbxd-cache-viewer'); if (m) { document.documentElement.classList.add('lbxd-cache-viewer-open'); } }
    function hideCacheViewer() { const m = document.getElementById('lbxd-cache-viewer'); if (m) { document.documentElement.classList.remove('lbxd-cache-viewer-open'); } }

    function ensureCacheViewer() {
        if (document.getElementById('lbxd-cache-viewer')) return;
        const wrap = document.createElement('div');
        wrap.id = 'lbxd-cache-viewer';
        wrap.innerHTML = `
  <div class="lbxd-plex-modal-backdrop" data-close="1"></div>
  <div class="lbxd-plex-modal">
    <div class="lbxd-plex-modal-header">
      <strong>Plex Cache</strong>
      <button class="lbxd-plex-close" title="Close" aria-label="Close">✕</button>
    </div>
    <div class="lbxd-plex-modal-body">
      <div id="lbxd-cache-content" class="lbxd-cache-content">
        Loading…
      </div>
      <div class="lbxd-plex-actions">
        <button id="lbxd-btn-export-cache">Export all (JSON)</button>
      </div>
    </div>
  </div>`;
        document.body.appendChild(wrap);
        wrap.querySelector('.lbxd-plex-close')?.addEventListener('click', hideCacheViewer);
        wrap.querySelector('.lbxd-plex-modal-backdrop')?.addEventListener('click', (e) => { if (e.target && e.target.getAttribute('data-close')) hideCacheViewer(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideCacheViewer(); });
        wrap.querySelector('#lbxd-btn-export-cache')?.addEventListener('click', () => {
            try {
                const ix = getIndex();
                exportIndexAsJson(ix, 'plex_letterboxd_cache.json');
            } catch (_) { /* noop */ }
        });
    }

    function renderCacheViewer() {
        const el = document.getElementById('lbxd-cache-content'); if (!el) return;
        const ix = getIndex();
        const s = getSettings();
        const frag = document.createDocumentFragment();
        const title = document.createElement('div'); title.className = 'lbxd-mb-8';
        const totalServers = ix && ix.servers ? Object.keys(ix.servers).length : 0;
        title.textContent = `Servers cached: ${totalServers}`;
        frag.appendChild(title);

        const list = document.createElement('div');
        for (const [sid, sIx] of Object.entries(ix.servers || {})) {
            const row = document.createElement('div'); row.className = 'lbxd-card';
            const name = (s.servers || []).find(x => x.id === sid)?.name || sid;
            const h = document.createElement('div'); h.className = 'lbxd-flex-between';
            const left = document.createElement('div'); left.innerHTML = `<strong>${name}</strong> <span class="lbxd-subtle">(${sid})</span>`;
            const right = document.createElement('div');
            const btn = document.createElement('button'); btn.textContent = 'Export'; btn.addEventListener('click', () => {
                const small = { [sid]: sIx };
                exportIndexAsJson(small, `plex_cache_${sid}.json`);
            });
            right.appendChild(btn);
            h.append(left, right);
            const stats = document.createElement('div'); stats.className = 'lbxd-server-cache';
            const preloaded = uniqueRatingKeyCount(sIx.byImdb, sIx.byTmdb);
            const matched = uniqueRatingKeyCount(sIx.bySlug);
            stats.textContent = `Preloaded: ${preloaded} • Matched: ${matched}`;
            row.append(h, stats);
            list.appendChild(row);
        }
        frag.appendChild(list);
        el.innerHTML = '';
        el.appendChild(frag);
    }

    function exportIndexAsJson(obj, filename) {
        try {
            const json = JSON.stringify(obj, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'plex_cache.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
        } catch (e) {
            try { alert('Failed to export cache.'); } catch (_) {}
        }
    }

    async function plexSearchMovieByQuery(ctx, query) {
        const s = getSettings();
        const token = ctx?.token || s.token;
        const url = `${ctx.uri}/search?query=${encodeURIComponent(query)}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
        const r = await tmFetch({ url, headers: plexHeaders() });
        return xml(r.responseText);
    }

    // Prefer exact GUID lookups (IMDb/TMDb) before doing broad text search
    async function plexFindByGuid(ctx, { imdbId, tmdbId, kind = 'movie' }) {
        const s = getSettings();
        const token = ctx?.token || s.token;
        if (!token || !ctx?.uri) return null;
        const searchType = kind === 'movie' ? 1 : 2;

        const guidVariants = [];
        if (imdbId) {
            guidVariants.push(`imdb://${imdbId}`);
            guidVariants.push(`com.plexapp.agents.imdb://${imdbId}`);
        }
        if (tmdbId) {
            guidVariants.push(`tmdb://${tmdbId}`);
            guidVariants.push(`com.plexapp.agents.tmdb://${tmdbId}`);
            guidVariants.push(`com.plexapp.agents.themoviedb://${tmdbId}`);
        }
        if (!guidVariants.length) return null;

        const libs = String(ctx.includeLibraries || '').split(',').map(x => x.trim()).filter(Boolean);
        const tryDoc = (doc) => {
            const first = doc.querySelector('MediaContainer > Video');
            return first ? first.getAttribute('ratingKey') || null : null;
        };

        for (const guid of guidVariants) {
            // Library-scoped exact GUID filters
            if (libs.length) {
                for (const sec of libs) {
                    try {
                        const url = `${ctx.uri}/library/sections/${encodeURIComponent(sec)}/search?type=${searchType}&guid=${encodeURIComponent(guid)}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
                        const r = await tmFetch({ url, headers: plexHeaders(), timeout: 12000 });
                        const doc = xml(r.responseText);
                        const rk = tryDoc(doc);
                        if (rk) return rk;
                    } catch (_) { /* continue */ }
                }
            }
            // Cross-library search endpoints that support guid filter on many servers
            try {
                const url = `${ctx.uri}/library/search?guid=${encodeURIComponent(guid)}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
                const r = await tmFetch({ url, headers: plexHeaders(), timeout: 12000 });
                const doc = xml(r.responseText);
                const rk = tryDoc(doc);
                if (rk) return rk;
            } catch (_) { /* keep trying next variant */ }
            // Fallback: some servers expose non-library search path
            try {
                const url = `${ctx.uri}/search?guid=${encodeURIComponent(guid)}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
                const r = await tmFetch({ url, headers: plexHeaders(), timeout: 12000 });
                const doc = xml(r.responseText);
                const rk = tryDoc(doc);
                if (rk) return rk;
            } catch (_) { /* keep trying next variant */ }
        }
        return null;
    }

    async function resolveRatingKeyOnServer(ctx, { imdbId, tmdbId, title, year, kind = 'movie', slug = null }) {
        // Normalize ID cases for consistent cache keys
        imdbId = imdbId ? String(imdbId).toLowerCase() : null;
        tmdbId = tmdbId ? String(tmdbId) : null;
        const sIx = getServerIndex(ctx.id);
        // 1) Slug cache (Matched)
        if (slug && sIx.bySlug && sIx.bySlug[slug]) return sIx.bySlug[slug];
        // 2) Preloaded cache (IMDb/TMDb)
        if (imdbId && sIx.byImdb[imdbId]) {
            const rk = sIx.byImdb[imdbId];
            if (slug) {
                if (!sIx.bySlug) sIx.bySlug = {};
                sIx.bySlug[slug] = rk;
                sIx.builtAt = Date.now();
                setServerIndex(ctx.id, sIx);
            }
            return rk;
        }
        if (tmdbId && sIx.byTmdb[tmdbId]) {
            const rk = sIx.byTmdb[tmdbId];
            if (slug) {
                if (!sIx.bySlug) sIx.bySlug = {};
                sIx.bySlug[slug] = rk;
                sIx.builtAt = Date.now();
                setServerIndex(ctx.id, sIx);
            }
            return rk;
        }
        // Try exact GUID matches via Plex API (preferred over text search)
        if (imdbId || tmdbId) {
            try {
                const rk = await plexFindByGuid(ctx, { imdbId, tmdbId, kind });
                if (rk) {
                    if (imdbId) sIx.byImdb[imdbId] = rk;
                    if (tmdbId) sIx.byTmdb[tmdbId] = rk;
                    if (slug) { if (!sIx.bySlug) sIx.bySlug = {}; sIx.bySlug[slug] = rk; }
                    sIx.builtAt = Date.now();
                    setServerIndex(ctx.id, sIx);
                    return rk;
                }
            } catch (_) { /* continue to text search */ }
        }
        // Note: do not rely on Title+Year cache; only use it as a heuristic when selecting a search result

        const s = getSettings();
        let best = null;
        // Prefer title for text-based search; IDs are handled via guid path above
        const query = (title || '').toString();
        const tryDoc = (doc) => {
            const typeStr = kind === 'movie' ? 'movie' : 'show';
            const candidates = Array.from(doc.querySelectorAll(
                `SearchResult > Hub[type="${typeStr}"] > Directory, ` +
                `MediaContainer > Video[type="${typeStr}"], ` +
                `MediaContainer > Directory[type="${typeStr}"], ` +
                `Hub > Video[type="${typeStr}"]`
            ));
            for (const item of candidates) {
                const rk = item.getAttribute('ratingKey');
                if (!rk) continue;
                const guids = Array.from(item.querySelectorAll('Guid')).map(g => (g.getAttribute('id') || ''));
                const guidAttr = item.getAttribute('guid');
                if (guidAttr) guids.push(guidAttr);
                const ids = extractIdsFromGuidStrings(guids);
                const hasImdb = imdbId && ids.imdbId === String(imdbId).toLowerCase();
                const hasTmdb = tmdbId && ids.tmdbId === String(tmdbId);
                if (hasImdb || hasTmdb) return rk;
                // If neither ID is available yet, fall back to exact title+year match
                if (!imdbId && !tmdbId && title) {
                    const candTitle = (item.getAttribute('title') || item.getAttribute('name') || '').trim();
                    const candYear = (item.getAttribute('year') || '').trim();
                    if (candTitle && candYear && year && normalizeTitleYear(candTitle, candYear) === normalizeTitleYear(title, year)) {
                        return rk;
                    }
                }
            }
            return null;
        };

        const libs = String(ctx.includeLibraries || '').split(',').map(x => x.trim()).filter(Boolean);
        if (libs.length) {
            for (const sec of libs) {
                try {
                    const searchType = kind === 'movie' ? 1 : 2;
                    const token = ctx?.token || s.token;
                    const url = `${ctx.uri}/library/sections/${encodeURIComponent(sec)}/search?type=${searchType}&query=${encodeURIComponent(query)}${year ? `&year=${encodeURIComponent(year)}` : ''}&includeGuids=1&X-Plex-Token=${encodeURIComponent(token)}`;
                    const r = await tmFetch({ url, headers: plexHeaders() });
                    const doc = xml(r.responseText);
                    best = tryDoc(doc);
                    if (best) break;
                } catch (_) { /* keep trying next */ }
            }
            if (!best) {
                const doc = await plexSearchMovieByQuery(ctx, query);
                best = tryDoc(doc);
            }
        } else {
            const doc = await plexSearchMovieByQuery(ctx, query);
            best = tryDoc(doc);
        }
        if (!best) return null;

        if (imdbId) sIx.byImdb[imdbId] = best;
        if (tmdbId) sIx.byTmdb[tmdbId] = best;
        if (slug) {
            if (!sIx.bySlug) sIx.bySlug = {};
            sIx.bySlug[slug] = best;
        }
        sIx.builtAt = Date.now();
        setServerIndex(ctx.id, sIx);
        return best;
    }

    /**********************
   * Authorization guard
   **********************/
    async function ensureAuthorized() {
        const s = getSettings();
        if (!s.token) return { ok: false, reason: 'No token. Open settings.' };
        const enabled = (s.servers || []).filter(x => x.enabled !== false && x.uri);
        if (!enabled.length) return { ok: false, reason: 'No servers set. Open settings.' };

        if (Date.now() - (s.lastAuthCheck || 0) < 6 * 60 * 60 * 1000) return { ok: true };

        const res = await tmFetch({
            url: `https://plex.tv/api/resources?includeHttps=1&X-Plex-Token=${encodeURIComponent(s.token)}`,
            headers: { 'Accept': 'application/xml', 'X-Plex-Product': APP.product, 'X-Plex-Client-Identifier': APP.clientId }
        });
        const doc = xml(res.responseText);
        // all enabled servers must be visible; if any is missing, still allow but warn next time
        const ok = enabled.some(srv => !!doc.querySelector(`Device[clientIdentifier="${CSS.escape(srv.id)}"][provides*="server"]`));
        const ns = getSettings(); ns.lastAuthCheck = Date.now(); setSettings(ns);
        return ok ? { ok: true } : { ok: false, reason: 'Your Plex account cannot see the configured servers.' };
    }

    /**********************
   * Letterboxd parsers
   **********************/
    function getLetterboxdSlug() {
        try {
            // Prefer canonical URL when available so it also works on /imdb/* or /tmdb/* subpages
            const canon = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
            if (canon) {
                try {
                    const u = new URL(canon, location.origin);
                    const mc = u.pathname.match(/\/film\/([^\/]+)\//) || u.pathname.match(/\/film\/([^\/]+)$/);
                    if (mc && mc[1]) return mc[1];
                } catch (_) { /* ignore parse errors */ }
            }
            // Fallback to current location
            const m = location.pathname.match(/\/film\/([^\/]+)\//);
            if (m && m[1]) return m[1];
            const m2 = location.pathname.match(/\/film\/([^\/]+)$/);
            if (m2 && m2[1]) return m2[1];
        } catch (_) { /* noop */ }
        return null;
    }

    // Wait for IMDb/TMDb IDs to be available in the DOM (JSON-LD or external buttons)
    async function waitForFilmIds(timeoutMs = 6000, pollMs = 250) {
        const start = Date.now();
        let last = parseFilmInfo();
        while (Date.now() - start < timeoutMs) {
            const info = parseFilmInfo();
            last = info || last;
            if ((info && (info.imdbId || info.tmdbId))) return info;
            await sleep(pollMs);
        }
        return last; // best-effort fallback
    }
    function parseFilmInfo() {
        // try JSON-LD first
        for (const s of $$('script[type="application/ld+json"]')) {
            try {
                const obj = JSON.parse(s.textContent);
                const arr = Array.isArray(obj) ? obj : [obj];
                for (const o of arr) {
                    const typ = o['@type'];
                    if ((typ === 'Movie' || typ === 'TVSeries' || typ === 'TVEpisode') && o.name) {
                        let imdbId = null, tmdbId = null;
                        const sameAs = [].concat(o.sameAs || []);
                        for (const url of sameAs) {
                            const m1 = String(url).match(/imdb\.com\/title\/(tt\d+)/i);
                            if (m1) imdbId = m1[1];
                            const m2 = String(url).match(/themoviedb\.org\/(movie|tv)\/(\d+)/i);
                            if (m2) tmdbId = m2[2];
                        }
                        const title = o.name;
                        const year = (o.datePublished || o.dateCreated || '').slice(0, 4) || null;
                        const kind = (typ === 'TVSeries' || typ === 'TVEpisode') ? 'show' : 'movie';
                        return { title, year, imdbId, tmdbId, kind };
                    }
                }
            } catch (_) { /* ignore */ }
        }
        // fallback: find IMDb/TMDb links in the Details box
        const imdbA = $$('a[href*="imdb.com/title/tt"]').find(Boolean);
        const imdbId = imdbA ? (imdbA.href.match(/(tt\d+)/i) || [])[1] : null;
        const tmdbLink = $$('a[href*="themoviedb.org/movie/"]').find(Boolean) || $$('a[href*="themoviedb.org/tv/"]').find(Boolean);
        const tmdbMovie = tmdbLink ? (tmdbLink.href.match(/movie\/(\d+)/i) || [])[1] : null;
        const tmdbTv = tmdbLink ? (tmdbLink.href.match(/tv\/(\d+)/i) || [])[1] : null;
        const tmdbId = tmdbMovie || tmdbTv || null;

        // title + year from header
        const h1 = document.querySelector('h1.headline-1') || document.querySelector('h1');
        const yearLink = $$('a[href^="/films/year/"]').find(Boolean) || $$('small, .releaseyear').find(el => /\d{4}/.test(el.textContent));
        const title = h1 ? h1.textContent.trim() : null;
        const year = yearLink ? (yearLink.textContent.match(/\d{4}/) || [])[0] : null;

        const kind = tmdbTv ? 'show' : 'movie';
        return { title, year, imdbId, tmdbId, kind };
    }

    /**********************
   * UI
   **********************/

    // Apply or remove the global colored-row class
    function applyGlobalColorSetting() {
        try {
            const s = getSettings();
            const root = document.documentElement;
            if (s.useColoredRows) root.classList.add('lbxd-plex-colored');
            else root.classList.remove('lbxd-plex-colored');
        } catch (_) { /* noop */ }
    }

    // Create/remove onboarding CTA after section.watch-panel when not logged in
    function removeOnboardingCta() {
        try { document.getElementById('lbxd-plex-setup-cta')?.remove(); } catch (_) { /* noop */ }
    }
    function ensureOnboardingCta() {
        const s = getSettings();
        const hasToken = !!s.token;
        const existing = document.getElementById('lbxd-plex-setup-cta');
        if (hasToken) { if (existing) existing.remove(); return; }
        // Only show CTA when not logged in
        let panel = document.querySelector('section.watch-panel');
        if (!panel) return;
        if (existing) return;
        const wrap = document.createElement('div');
        wrap.id = 'lbxd-plex-setup-cta';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lbxd-plex-setup-btn';
        btn.textContent = 'Letterboxd → Plex setup';
        btn.addEventListener('click', (e) => { e.preventDefault(); openSettings(); });
        wrap.appendChild(btn);
        panel.insertAdjacentElement('afterend', wrap);
    }


    function getOrCreateServicesSection() {
        // Prefer existing services section under #watch
        let services = document.querySelector('#watch section.services');
        const watch = document.getElementById('watch');
        if (services && watch && watch.contains(services)) return services;

        if (watch) {
            // Create a services section and insert before the last direct child div of #watch
            services = document.createElement('section');
            services.className = 'services';
            const children = Array.from(watch.children);
            const lastDiv = [...children].reverse().find(el => el.tagName === 'DIV');
            if (lastDiv) watch.insertBefore(services, lastDiv);
            else watch.appendChild(services);
            return services;
        }

        // Fallbacks: if #watch missing, use existing section.services anywhere or body
        services = document.querySelector('section.services');
        if (services) return services;
        const s = document.createElement('section');
        s.className = 'services';
        (document.body || document.documentElement).appendChild(s);
        return s;
    }

    // Keep the Plex buttons alive if Letterboxd re-renders sections
    let __lbxd_lastState = null;
    let __lbxd_keepAliveTimer = null;
    let __lbxd_domObserver = null;

    function ensureKeepAlive() {
        if (__lbxd_domObserver) return;
        __lbxd_domObserver = new MutationObserver(() => {
            if (__lbxd_keepAliveTimer) return;
            __lbxd_keepAliveTimer = setTimeout(() => {
                __lbxd_keepAliveTimer = null;
                const rows = Array.from(document.querySelectorAll('[id^="source-plex-"]'));
                const onFilm = /\/letterboxd\.com\/(film|imdb|tmdb)\//.test(location.href);
                const want = Array.isArray(__lbxd_lastState) ? __lbxd_lastState.length : (__lbxd_lastState ? 1 : 0);
                const have = rows.length;
                if (onFilm && want > 0 && have < want) {
                    try { renderAllButtons(__lbxd_lastState); } catch (_) { /* noop */ }
                }
                // Ensure onboarding CTA remains visible if not logged in
                try { ensureOnboardingCta(); } catch (_) { /* noop */ }
            }, 60);
        });
        __lbxd_domObserver.observe(document, { subtree: true, childList: true });
        window.addEventListener('pageshow', () => {
            const rows = Array.from(document.querySelectorAll('[id^="source-plex-"]'));
            const want = Array.isArray(__lbxd_lastState) ? __lbxd_lastState.length : (__lbxd_lastState ? 1 : 0);
            if (want > 0 && rows.length < want) {
                try { renderAllButtons(__lbxd_lastState); } catch (_) { /* noop */ }
            }
            try { ensureOnboardingCta(); } catch (_) { /* noop */ }
        });
    }

    function makePlexBrand() {
        const brand = document.createElement('span');
        brand.className = 'brand';
        const maskId = 'maskID' + Date.now().toString(36) + Math.floor(Math.random()*1e6);
        brand.innerHTML = `
          <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
            <defs>
              <clipPath id="${maskId}"><path d="M12,24 C2.372583,24 0,21.627417 0,12 C0,2.372583 2.372583,0 12,0 C21.627417,0 24,2.372583 24,12 C24,21.627417 21.627417,24 12,24 Z"></path></clipPath>
            </defs>
            <title></title>
            <desc>Plex</desc>
            <image clip-path="url(#${maskId})" width="24" height="24" xlink:href="https://images.justwatch.com/icon/301832745/s100"></image>
            <path d="M12,23.5 C21.2262746,23.5 23.5,21.2262746 23.5,12 C23.5,2.77372538 21.2262746,0.5 12,0.5 C2.77372538,0.5 0.5,2.77372538 0.5,12 C0.5,21.2262746 2.77372538,23.5 12,23.5 Z" class="overlay" stroke-opacity="0.35" stroke="#FFFFFF" fill="rgba(0,0,0,0)"></path>
          </svg>`;
        return brand;
    }

    function renderServiceButton(state) {
        const p = document.createElement('p');
        p.id = `source-plex-${state.serverId || 'auth'}`;
        p.className = 'service -plex';
        if (state.status === 'ready') {
            const a = document.createElement('a');
            a.href = state.web;
            a.target = '_blank';
            a.rel = 'nofollow noopener noreferrer';
            a.className = 'label track-event js-watch-plex-label tooltip';
            a.title = 'Open in Plex (Web)';
            const brand = makePlexBrand();
            const title = document.createElement('span');
            title.className = 'title';
            title.innerHTML = `<span class="name">${state.serverName ? String(state.serverName) : 'Plex'}</span>`;
            a.append(brand, title);
            p.appendChild(a);

            const opts = document.createElement('span');
            opts.className = 'options js-film-availability-options';
            const linkLib = document.createElement('a');
            linkLib.className = 'link';
            linkLib.textContent = state.libraryName || 'Plex Web';
            linkLib.href = state.web;
            linkLib.target = '_blank';
            linkLib.rel = 'nofollow noopener noreferrer';
            opts.append(linkLib);
            p.appendChild(opts);
        } else if (state.status === 'auth') {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'label';
            a.title = 'Configure Plex';
            a.addEventListener('click', (e) => { e.preventDefault(); openSettings(); });
            const brand = makePlexBrand();
            const title = document.createElement('span');
            title.className = 'title';
            title.innerHTML = `<span class="name">Configure Plex</span>`;
            a.append(brand, title);
            p.appendChild(a);
            if (state.note) {
                const note = document.createElement('span');
                note.className = 'options js-film-availability-options';
                note.textContent = state.note;
                p.appendChild(note);
            }
        }
        // Settings gear (always present, shown on hover)
        try {
            const gear = document.createElement('a');
            gear.className = 'lbxd-plex-gear';
            gear.title = 'Open settings';
            gear.setAttribute('aria-label', 'Open settings');
            gear.href = '#';
            gear.textContent = '\u2699\uFE0E';
            gear.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openSettings(); });
            p.appendChild(gear);
        } catch (_) { /* noop */ }
        // Return the element so the caller can place it appropriately.
        return p;
    }

    function renderAllButtons(states) {
        // remove existing Plex services
        document.querySelectorAll('[id^="source-plex-"]').forEach(n => n.remove());
        // Remove onboarding CTA if present
        try { removeOnboardingCta(); } catch (_) { /* noop */ }
        if (!states || !states.length) return;
        const services = getOrCreateServicesSection();
        // If we found at least one playable Plex link, remove Letterboxd's not-available notice
        if (states.some(s => s && s.status === 'ready')) {
            try {
                const root = document.getElementById('watch') || services || document;
                root.querySelectorAll('.js-not-streaming').forEach(el => el.remove());
            } catch (_) { /* ignore */ }
        }
        const frag = document.createDocumentFragment();
        for (const st of states) {
            const el = renderServiceButton(st);
            if (el) frag.appendChild(el);
        }
        // Insert all Plex service rows at the top of the services section
        if (services.firstChild) services.insertBefore(frag, services.firstChild);
        else services.appendChild(frag);
        __lbxd_lastState = states.slice();
        ensureKeepAlive();
    }


    function explainPlexError(e) {
        // Default, then refine by common cases
        let msg = 'Could not query your Plex server.';
        const r = e && e.response;

        // 0/undefined often means blocked by @connect or DNS/Adblock
        if (!r || r.status === 0) {
            msg = 'Network blocked. Ensure @connect includes *.plex.direct (or use @connect *), then reload.';
        }
        // Unauthorized token
        else if (r.status === 401) {
            msg = 'Plex token expired/invalid. Re-run “Plex: Configure” → Link Plex.';
        }
        // Forbidden or remote access disabled
        else if (r.status === 403) {
            msg = 'Access forbidden to this connection. Try “Pick server” again (choose an https plex.direct URI).';
        }
        // Not found (rare for /search)
        else if (r.status === 404) {
            msg = 'Endpoint not found on this server. Verify the connection URI (https plex.direct).';
        }
        // TLS/cert or mixed-content oddities still show as 0 in many cases
        return msg;
    }


    async function testConnectionForServer(srv) {
        const s = getSettings();
        const token = srv?.token || s.token;
        if (!token || !srv?.uri) { alert(`Set token and connection for server ${srv?.name || srv?.id || ''}.`); return false; }
        try {
            const r = await tmFetch({ url: `${srv.uri}/identity?X-Plex-Token=${encodeURIComponent(token)}`, headers: plexHeaders() });
            const ok = /<MediaContainer/.test(r.responseText);
            alert(`${srv.name || srv.id}: ${ok ? 'OK ✅' : 'Unexpected response'}`);
            return ok;
        } catch (e) {
            alert(`${srv.name || srv.id}: ${explainPlexError(e)}`);
            console.error('[Plex opener] testConnection failed:', e);
            return false;
        }
    }

    async function testAllConnections() {
        const s = getSettings();
        if (!s.token) return alert('Set token first.');
        const servers = (s.servers || []).filter(x => x.enabled !== false);
        if (!servers.length) return alert('No servers configured.');
        let okCount = 0, total = 0;
        for (const srv of servers) {
            total++;
            try {
                const token = srv?.token || s.token;
                const r = await tmFetch({ url: `${srv.uri}/identity?X-Plex-Token=${encodeURIComponent(token)}`, headers: plexHeaders() });
                const ok = /<MediaContainer/.test(r.responseText);
                if (ok) okCount++;
            } catch (_) { /* ignore per-server error here; individual alerts are noisy */ }
        }
        alert(`Servers OK: ${okCount}/${total}`);
    }

    async function tryRecoverConnectionForServer(srv) {
        const s = getSettings();
        if (!s.token || !srv?.id) return false;
        try {
            const res = await tmFetch({
                url: `https://plex.tv/api/resources?includeHttps=1&includeRelay=1&X-Plex-Token=${encodeURIComponent(s.token)}`,
                headers: { 'Accept': 'application/xml', 'X-Plex-Product': APP.product, 'X-Plex-Client-Identifier': APP.clientId },
                timeout: 10000,
            });
            const doc = xml(res.responseText);
            const dev = Array.from(doc.querySelectorAll('Device[provides*="server"]'))
                .find(d => d.getAttribute('clientIdentifier') === srv.id);
            if (!dev) return false;
            const conns = Array.from(dev.querySelectorAll('Connection'));
            const newToken = dev.getAttribute('accessToken') || srv.token || s.token;
            const newUri = await chooseBestConnection(conns, newToken);
            if (!newUri || newUri === srv.uri) return false;
            const ns = getSettings();
            const me = (ns.servers || []).find(x => x.id === srv.id);
            if (!me) return false;
            me.uri = newUri;
            if (newToken) me.token = newToken;
            setSettings(ns);
            console.info('[Plex opener] switched server uri →', newUri);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**********************
   * Main
   **********************/
    async function main() {
        injectStyles();
        // Ensure the keep-alive observer is always active so the
        // settings CTA/entry persists even when logged out
        try { ensureKeepAlive(); } catch (_) { /* noop */ }
        try { applyGlobalColorSetting(); } catch (_) {}
        // Ensure onboarding CTA reflects current login state early
        try { ensureOnboardingCta(); } catch (_) { /* noop */ }
        const slug = getLetterboxdSlug();

        // Instant render from cache by slug if available
        try {
            const s0 = getSettings();
            const servers0 = (s0.servers || []).filter(x => x.enabled !== false && x.uri);
            const instantStates = [];
            if (slug) {
                for (const srv of servers0) {
                    const sIx = getServerIndex(srv.id);
                    const rk = sIx.bySlug && sIx.bySlug[slug];
                    if (!rk) continue;
                    const { web } = plexLinks(rk, srv.id);
                    instantStates.push({
                        status: 'ready',
                        web,
                        serverId: srv.id,
                        serverName: srv.name || 'Plex',
                        libraryName: null,
                    });
                }
            }
            if (instantStates.length) {
                renderAllButtons(instantStates);
            }
        } catch (_) { /* non-fatal */ }

        // Continue with normal flow to find or verify entries and backfill cache
        // Prefer using IMDb/TMDb IDs; wait briefly for LBXD to render them
        const info = await waitForFilmIds(7000, 250);
        const auth = await ensureAuthorized();
        if (!auth.ok) {
            const sAuth = getSettings();
            const notLoggedIn = !sAuth.token;
            if (notLoggedIn) {
                // Show onboarding CTA near watch panel instead of services entry
                try { ensureOnboardingCta(); } catch (_) { /* noop */ }
                return;
            }
            // Otherwise, keep prior behavior (render a service row with guidance)
            const hadAny = Array.from(document.querySelectorAll('[id^="source-plex-"]')).length > 0;
            if (!hadAny) renderAllButtons([{ status: 'auth', note: auth.reason }]);
            return;
        }

        await ensureWarmIndex();
        const s = getSettings();
        // Remove CTA if we are logged in and can proceed
        try { removeOnboardingCta(); } catch (_) { /* noop */ }
        const servers = (s.servers || []).filter(x => x.enabled !== false && x.uri);
        const states = [];
        for (const srv of servers) {
            let ratingKey = null;
            try {
                ratingKey = await resolveRatingKeyOnServer(srv, Object.assign({}, info, { slug }));
            } catch (e) {
                console.error('[Plex opener] lookup failed:', e);
                const isNet0 = !e.response || e.response.status === 0 || /Network error/i.test(e.message);
                if (isNet0) {
                    const recovered = await tryRecoverConnectionForServer(srv);
                    if (recovered) {
                        try { ratingKey = await resolveRatingKeyOnServer(srv, Object.assign({}, info, { slug })); }
                        catch (e2) { console.error('[Plex opener] retry failed:', e2); }
                    }
                }
            }
            if (!ratingKey) continue;
            const { web } = plexLinks(ratingKey, srv.id);
            let libName = null;
            try { const libInfo = await fetchLibraryInfo(srv, ratingKey); libName = libInfo.sectionTitle || null; } catch (_) { /* ignore */ }
            states.push({
                status: 'ready',
                web,
                serverId: srv.id,
                serverName: srv.name || 'Plex',
                libraryName: libName,
            });
        }
        if (states.length) renderAllButtons(states);
    }

    /**********************
   * Handle navigation changes (LBXD loads full pages, but be safe)
   **********************/
    let lastUrl = location.href;
    const observe = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            document.querySelectorAll('[id^="source-plex-"]').forEach(n => n.remove());
            try { __lbxd_lastState = null; } catch (_) { /* noop */ }
            main();
        }
    });
    observe.observe(document, { subtree: true, childList: true });
    main();
})();
