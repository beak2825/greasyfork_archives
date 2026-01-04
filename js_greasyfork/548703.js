// ==UserScript==
// @name         FeedTube
// @description  Userscript that renders YouTube channel RSS as a fast, full‑page feed — subscriptions, caching, source fallbacks, Shorts filter, playlists, and quick playback.
// @version      0.1
// @author       TesterTV
// @homepageURL  https://github.com/testertv/FeedTube
// @license      GPL v.3 or any later version.
// @match        file:///*FeedTube.html
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @connect      *
// @namespace    https://greasyfork.org/ru/scripts/548703-feedtube
// @downloadURL https://update.greasyfork.org/scripts/548703/FeedTube.user.js
// @updateURL https://update.greasyfork.org/scripts/548703/FeedTube.meta.js
// ==/UserScript==

(() => {
  'use strict';

    // ===============================================
    // ============ Code for FeedTube Page ===========
    // ===============================================

if (location.protocol === 'file:' && /FeedTube\.html$/i.test(location.pathname)) {

    // ============ PAGE META ============
    document.title = "FeedTube";
    const link = document.querySelector('link[rel~="icon"]') || document.head.appendChild(document.createElement('link'));
    link.rel = 'icon';
    link.href = 'https://www.youtube.com/favicon.ico';

    // ============ CONFIG ============
    const CLEAR_LOGS_KEY = 'clearLogs_v1';
    const DEFAULT_CLEAR_LOGS = true;
    const getClearLogs = () => getPref(CLEAR_LOGS_KEY, DEFAULT_CLEAR_LOGS) !== false;

    const DEFAULT_LIMIT = 0;
    const LIMIT_KEY = 'limit_v1';
    const YT_NS = 'http://www.youtube.com/xml/schemas/2015';
    const MEDIA_NS = 'http://search.yahoo.com/mrss/';

    const SHOW_SHORTS_KEY = 'showShorts_v1';
    const DEFAULT_SHOW_SHORTS = true;

    const DEFAULT_SUBS = [
        { id: 'UCHnyfMqiRRG1u-2MsSQLbXA', name: 'Default Channel', enabled: true }
    ];
    const SUBS_KEY = 'subs_v1';
    const SRC_PREF_KEY = 'srcPref';

    // Playlists
    const PLAYLISTS_KEY = 'playlists_v1';
    const TAB_PREF_KEY = 'tab_active_v1';

    // ============ SHADOW UI ============
    const host = document.createElement('div');
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const css = document.createElement('style');
    css.textContent = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; }
    .app {
      position: fixed; inset: 0; display: flex; flex-direction: column;
      background: #0b0d10; color: #e6e9ef; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    header {
      position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; background: #0f1217; border-bottom: 1px solid #1f232b; flex-wrap: wrap;
    }
    .title { font-weight: 700; font-size: 16px; }
    .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    select, button, input {
      background: #2b313b; color: #e6e9ef; border: 1px solid #404652; border-radius: 6px; padding: 6px 10px;
    }
    button { cursor: pointer; }
    button.primary { background: #1f6feb; color: #fff; border: none; }
    .status { margin-left: auto; color: #9aa3b2; font-size: 12px; white-space: nowrap; }
    .tabs {
      display: flex; gap: 8px; padding: 10px 16px; background: #0f1217; border-bottom: 1px solid #1f232b;
    }
    .tab {
      padding: 6px 12px; border-radius: 999px; border: 1px solid #2f3541; color: #cbd5e1; background: #1a1f28;
    }
    .tab.active { background: #1f6feb; border-color: #1f6feb; color: white; }
    main { overflow: auto; padding: 16px; }
    #videosView { flex: 1; }
    #playlistsView { flex: 1; overflow: auto; padding: 16px; display: none; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .plGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
    .card { background: #11161c; border: 1px solid #1f232b; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
    .thumb { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #0b0d10; }
    .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .meta { padding: 10px 12px; display: grid; gap: 6px; }
    .meta a.title { color: #7aa2ff; text-decoration: none; font-weight: 700; }
    .meta a.title:hover { text-decoration: underline; }
    .muted { color: #9aa3b2; font-size: 12px; }
    .error {
      background: #2b1113; color: #ffd7d9; border: 1px solid #5a1a1f; padding: 12px; border-radius: 8px; white-space: pre-wrap;
    }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 999px; font-size: 11px; margin-left: 6px; background: #2b313b; color: #cbd5e1; }
    details.debug { padding: 0 16px 12px; }
    details.debug > summary { cursor: pointer; color: #cbd5e1; }
    pre {
      background: #0f1217; color: #cbd5e1; padding: 10px; border-radius: 8px; border: 1px solid #1f232b; overflow: auto; max-height: 40vh;
    }
    footer { padding: 10px 16px; border-top: 1px solid #1f232b; color: #9aa3b2; background: #0f1217; }

    /* Floating action buttons */
    .fab {
      position: fixed; right: 16px; bottom: 16px; z-index: 20; width: 52px; height: 52px;
      border-radius: 50%; display: grid; place-items: center; background: #1f6feb; color: #fff;
      border: none; box-shadow: 0 6px 20px rgba(0,0,0,.5); font-size: 20px;
    }
    .fab:hover { filter: brightness(1.05); }
    .fab.left { right: 80px; }

    /* Panels (subscriptions/settings/playlist picker) */
    .subsPanel {
      position: fixed; right: 16px; bottom: 80px; width: 480px; max-width: calc(100vw - 32px);
      max-height: 70vh; display: none; flex-direction: column; overflow: hidden;
      background: #11161c; border: 1px solid #1f232b; border-radius: 12px; z-index: 30;
      box-shadow: 0 10px 30px rgba(0,0,0,.55);
    }
    .subsPanel.open { display: flex; }
    .sp-head {
      display: flex; align-items: center; justify-content: space-between; padding: 10px 12px;
      background: #0f1217; border-bottom: 1px solid #1f232b;
    }
    .sp-title { font-weight: 700; }
    .sp-body { display: grid; gap: 8px; padding: 10px 12px; overflow: auto; }
    .subRow {
      display: grid; grid-template-columns: 22px 1fr auto; align-items: center; gap: 8px;
      padding: 6px 8px; border: 1px solid #1f232b; border-radius: 8px; background: #0b0d10;
    }
    .subName { font-weight: 600; color: #e6e9ef; }
    .subSmall { color: #9aa3b2; font-size: 12px; }
    .subActions { display: flex; align-items: center; gap: 6px; }
    .sp-add { display: grid; grid-template-columns: 1fr auto; gap: 8px; padding: 10px 12px; border-top: 1px solid #1f232b; background: #0f1217; }
    .link { color: #7aa2ff; text-decoration: none; }
    .link:hover { text-decoration: underline; }

    /* Actions under thumbnails */
    .actions {
      display: flex; justify-content: center; gap: 8px; padding: 8px 12px 12px; flex-wrap: wrap;
    }
    .iconBtn {
      background: #202531; border: 1px solid #2e3442; color: #e6e9ef; border-radius: 8px;
      width: 36px; height: 36px; display: grid; place-items: center; cursor: pointer; transition: .15s ease;
    }
    .iconBtn:hover { background: #2b313b; border-color: #3a4352; transform: translateY(-1px); }
    .iconBtn.disabled { opacity: .45; cursor: not-allowed; }
    .iconBtn.success { background: #244c1a; border-color: #2b5f20; }

    /* Playlists view */
    .plTop {
      display: grid; gap: 10px; margin-bottom: 10px;
    }
    .plList .subRow { grid-template-columns: 22px 1fr auto; }
    .plList .subRow .subActions button { padding: 4px 8px; }

    /* Floating overlay video panel */
    .floatingPanel {
      position: fixed; z-index: 61; width: 720px; height: 400px; min-width: 360px; min-height: 220px;
      background: #0f1217; border: 1px solid #1f232b; border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,.7); display: none; resize: both; overflow: hidden;
    }
    .floatingPanel.open { display: block; }
    .fpHead {
      height: 40px; display:flex; align-items:center; justify-content: space-between; padding: 0 10px;
      background: #11161c; border-bottom: 1px solid #1f232b; user-select: none; cursor: move;
    }
    .fpTitle { font-weight: 600; font-size: 14px; }
    .fpClose { background:#e53935; color:#fff; border:0; border-radius: 6px; padding: 6px 10px; cursor:pointer; }
    .fpBody { position: absolute; inset: 40px 0 0 0; }
    .fpBody iframe { width: 100%; height: 100%; border: 0; }
  `;
    shadow.appendChild(css);

    const app = document.createElement('div');
    app.className = 'app';
    app.innerHTML = `
    <header>
      <div class="title">Feed<span style="color:red;">Tube </span></div>
      <div class="row">
        <label>Source:</label>
        <select id="sourceSel">
          <option value="auto">Auto (direct → mirror → proxies)</option>
          <option value="direct">Direct (GM_xhr → youtube.com)</option>
          <option value="mirror">Mirror (r.jina.ai)</option>
          <option value="proxy1">Proxy 1 (isomorphic-git)</option>
          <option value="proxy2">Proxy 2 (allorigins)</option>
        </select>
        <button id="reloadBtn" class="primary">Reload</button>
      </div>
      <div class="status"></div>
    </header>

    <div class="tabs">
      <button id="tabVideos" class="tab active">Videos</button>
      <button id="tabPlaylists" class="tab">Playlists</button>
    </div>

    <main id="videosView"><div class="grid"></div></main>
    <div id="playlistsView"></div>

    <details class="debug"><summary>Debug info</summary><pre class="log"></pre></details>
    <footer>If fetching is flaky on file://, disable blockers or serve via http://localhost to improve reliability.</footer>

    <!-- Swapped positions: Settings is rightmost, Subscriptions is left -->
    <button class="fab" id="settingsBtn" title="Settings">⚙️</button>
    <button class="fab left" id="subsBtn" title="Manage subscriptions">🔔</button>

    <div class="subsPanel" id="settingsPanel" aria-label="Settings">
      <div class="sp-head">
        <div class="sp-title">Settings</div>
        <div>
          <button id="st_close" title="Close" style="background:#e53935;color:#fff;border:0;padding:6px 10px;border-radius:4px;cursor:pointer">✕</button>
        </div>
      </div>
      <div class="sp-body">
        <div>
          <input id="limitInput" type="number" min="0" step="1" placeholder="0 = all" />
          <label for="limitInput">Max videos on main screen (0 = all)</label>
        </div>
        <div>
          <label style="display:flex; align-items:center; gap:8px; cursor: pointer;">
            <input id="showShortsChk" type="checkbox" />
            Show Shorts
          </label>
        </div>
        <div>
          <label style="display:flex; align-items:center; gap:8px; cursor: pointer;">
            <input id="clearLogsChk" type="checkbox" />
            Clear Debug Log on Reload
          </label>
        </div>
      </div>
      <div class="sp-add">
        <div class="subSmall">Press Enter to apply, or click Save.</div>
        <button id="limitSaveBtn" class="primary">Save</button>
      </div>
    </div>

    <div class="subsPanel" id="subsPanel" aria-label="Subscriptions">
      <div class="sp-head">
        <div class="sp-title">Subscriptions</div>
        <div>
          <div class="row">
            <button id="enableAllBtn" title="Enable all subscriptions">☑</button>
            <button id="disableAllBtn" title="Disable all subscriptions">☐</button>
            <button id="invertSelBtn" title="Invert current selection">◪</button>
            <button id="impExpBtn" title="Import or export subscriptions">Import / Export</button>
          </div>
        </div>
        <div>
          <button id="sp_close" title="Close" style="background:#e53935;color:#fff;border:0;padding:6px 10px;border-radius:4px;cursor:pointer">✕</button>
        </div>
      </div>
      <div class="sp-body">
        <div id="subsList"></div>
      </div>
      <div class="sp-add">
        <input id="addInput" placeholder="Paste Channel-ID URL and click 'Add', or type to search…" />
        <button id="addBtn" class="primary">Add</button>
      </div>
    </div>

    <div class="subsPanel" id="iexPanel" aria-label="Import/Export">
      <div class="sp-head">
        <div class="sp-title">Import / Export (NewPipe Format)</div>
        <div>
          <button id="iex_close" title="Close" style="background:#e53935;color:#fff;border:0;padding:6px 10px;border-radius:4px;cursor:pointer">✕</button>
        </div>
      </div>
      <div class="sp-body">
        <input id="iex_file_merge" type="file" accept="application/json,.json" style="display:none" />
        <input id="iex_file_replace" type="file" accept="application/json,.json" style="display:none" />

        <div class="subRow">
          <div style="width:22px;"></div>
          <div>
            <div class="subName">Import (add to existing)</div>
            <div class="subSmall">Merge: keeps your current list and adds any new channels from the file.</div>
          </div>
          <div class="subActions">
            <button id="iexImportMergeBtn">Choose file…</button>
          </div>
        </div>

        <div class="subRow">
          <div style="width:22px;"></div>
          <div>
            <div class="subName">Import (replace existing)</div>
            <div class="subSmall">Replace: overwrites your current subscriptions with the file.</div>
          </div>
          <div class="subActions">
            <button id="iexImportReplaceBtn">Choose file…</button>
          </div>
        </div>

        <div class="subRow">
          <div style="width:22px;"></div>
          <div>
            <div class="subName">Export</div>
            <div class="subSmall">Download a NewPipe-compatible JSON of your subscriptions.</div>
          </div>
          <div class="subActions">
            <button id="iexExportBtn">Export</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Playlist picker -->
    <div class="subsPanel" id="plPicker" aria-label="Add to playlist">
      <div class="sp-head">
        <div class="sp-title">Add to playlist</div>
        <div>
          <button id="plp_close" title="Close" style="background:#e53935;color:#fff;border:0;padding:6px 10px;border-radius:4px;cursor:pointer">✕</button>
        </div>
      </div>
      <div class="sp-body" id="plp_list"></div>
      <div class="sp-add">
        <input id="plp_new_name" placeholder="Create new playlist…" />
        <button id="plp_create_add" class="primary">Create & Add</button>
      </div>
    </div>

    <!-- Floating overlay video player -->
    <div class="floatingPanel" id="floatPanel" role="dialog" aria-label="Video">
      <div class="fpHead" id="fpHead">
        <div class="fpTitle" id="fpTitle">Video</div>
        <button class="fpClose" id="fpClose">✕</button>
      </div>
      <div class="fpBody">
        <iframe id="fpFrame" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  `;
    shadow.appendChild(app);

    // ============ SHORTCUTS ============
    const $ = s => shadow.querySelector(s);
    const sourceSel = $('#sourceSel');
    const reloadBtn = $('#reloadBtn');
    const status = $('.status');
    const videosView = $('#videosView');
    const playlistsView = $('#playlistsView');
    const grid = $('.grid');
    const pre = $('.log');

    const tabVideos = $('#tabVideos');
    const tabPlaylists = $('#tabPlaylists');

    const settingsBtn = $('#settingsBtn');
    const settingsPanel = $('#settingsPanel');
    const limitInput = $('#limitInput');
    const showShortsChk = $('#showShortsChk');
    const clearLogsChk = $('#clearLogsChk');
    const limitSaveBtn = $('#limitSaveBtn');
    const stClose = $('#st_close');

    const enableAllBtn = $('#enableAllBtn');
    const disableAllBtn = $('#disableAllBtn');
    const invertSelBtn = $('#invertSelBtn');

    const subsBtn = $('#subsBtn');
    const subsPanel = $('#subsPanel');
    const subsListEl = $('#subsList');
    const addInput = $('#addInput');
    const addBtn = $('#addBtn');
    const spClose = $('#sp_close');

    const floatPanel = $('#floatPanel');
    const fpHead = $('#fpHead');
    const fpTitle = $('#fpTitle');
    const fpClose = $('#fpClose');
    let fpFrame = $('#fpFrame');

    // Playlist picker
    const plPicker = $('#plPicker');
    const plpList = $('#plp_list');
    const plpClose = $('#plp_close');
    const plpNewName = $('#plp_new_name');
    const plpCreateAdd = $('#plp_create_add');

    const embedUrl = id => `https://www.youtube.com/embed/${id}`;

    // Import/Export
    const impExpBtn = $('#impExpBtn');
    const iexPanel = $('#iexPanel');
    const iexClose = $('#iex_close');
    const iexImportMergeBtn = $('#iexImportMergeBtn');
    const iexImportReplaceBtn = $('#iexImportReplaceBtn');
    const iexExportBtn = $('#iexExportBtn');
    const iexFileMerge = $('#iex_file_merge');
    const iexFileReplace = $('#iex_file_replace');

    // ============ VIDEO OPENERS ============
    function openEmbedNewTab(id) {
        if (!id) return;
        window.open(embedUrl(id) + '?autoplay=1', '_blank', 'noopener');
    }

    function openKioskPopup(id) {
        if (!id) return;
        const w = 720, h = 400;
        const dualLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualTop  = window.screenTop  !== undefined ? window.screenTop  : window.screenY;
        const vw = window.innerWidth || document.documentElement.clientWidth || screen.width;
        const vh = window.innerHeight || document.documentElement.clientHeight || screen.height;
        const left = Math.round(dualLeft + Math.max((vw - w) / 2, 0));
        const top  = Math.round(dualTop + Math.max((vh - h) / 2, 0));
        const features = `popup=yes,noopener,noreferrer,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=${w},height=${h},left=${left},top=${top}`;
        const win = window.open(embedUrl(id) + '?autoplay=1', '_blank', features);
        try { win && win.focus(); } catch {}
    }

    function centerPanel(w = 720, h = 400) {
        const vw = window.innerWidth, vh = window.innerHeight;
        const left = Math.max((vw - w) / 2, 10);
        const top = Math.max((vh - h) / 2, 10);
        floatPanel.style.left = left + 'px';
        floatPanel.style.top = top + 'px';
        floatPanel.style.width = w + 'px';
        floatPanel.style.height = h + 'px';
    }

    function loadVideoInPanel(id) {
        const newFrame = document.createElement('iframe');
        newFrame.id = 'fpFrame';
        newFrame.allow = 'autoplay; encrypted-media; picture-in-picture';
        newFrame.allowFullscreen = true;
        newFrame.src = embedUrl(id) + '?autoplay=1';
        fpFrame.replaceWith(newFrame);
        fpFrame = newFrame;
    }

    function openOverlay(id, title) {
        if (!id) return;
        fpTitle.textContent = title || 'Video';
        const wasOpen = floatPanel.classList.contains('open');
        loadVideoInPanel(id);
        floatPanel.classList.add('open');
        if (!wasOpen) {
            centerPanel(floatPanel.offsetWidth || 720, floatPanel.offsetHeight || 400);
        }
    }

    function closeOverlay() {
        floatPanel.classList.remove('open');
        if (fpFrame) fpFrame.src = 'about:blank';
    }
    fpClose?.addEventListener('click', closeOverlay);
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && floatPanel.classList.contains('open')) closeOverlay();
    });

    // Dragging the floating panel by its header
    (function enablePanelDrag() {
        let dragging = false, dx = 0, dy = 0;
        fpHead?.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            const rect = floatPanel.getBoundingClientRect();
            dragging = true;
            dx = e.clientX - rect.left;
            dy = e.clientY - rect.top;
            e.preventDefault();
        });
        window.addEventListener('mousemove', e => {
            if (!dragging) return;
            let left = e.clientX - dx;
            let top = e.clientY - dy;
            left = Math.max(0, Math.min(left, window.innerWidth - 80));
            top = Math.max(0, Math.min(top, window.innerHeight - 60));
            floatPanel.style.left = left + 'px';
            floatPanel.style.top = top + 'px';
        });
        window.addEventListener('mouseup', () => (dragging = false));
        window.addEventListener('resize', () => {
            if (!floatPanel.classList.contains('open')) return;
            const r = floatPanel.getBoundingClientRect();
            const left = Math.min(Math.max(0, r.left), Math.max(0, window.innerWidth - r.width));
            const top  = Math.min(Math.max(0, r.top),  Math.max(0, window.innerHeight - r.height));
            floatPanel.style.left = left + 'px';
            floatPanel.style.top = top + 'px';
        });
    })();

    // ============ HELPERS ============
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                (document.body || document.documentElement).appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                ta.remove();
                return ok;
            } catch {
                return false;
            }
        }
    }

    function makeIconBtn(label, title, onClick, disabled) {
        const b = document.createElement('button');
        b.className = 'iconBtn' + (disabled ? ' disabled' : '');
        b.textContent = label;
        b.title = title;
        if (!disabled) {
            b.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                onClick && onClick(b);
            });
        }
        return b;
    }

    // ============ PERSISTENCE ============
    const getPref = (k, d) => { try { return GM_getValue(k, d); } catch { return d; } };
    const setPref = (k, v) => { try { GM_setValue(k, v); } catch {} };

    const getLimit = () => {
        const v = Number(getPref(LIMIT_KEY, DEFAULT_LIMIT));
        if (!Number.isFinite(v)) return DEFAULT_LIMIT;
        return Math.max(Math.floor(v), 0);
    };
    const getShowShorts = () => getPref(SHOW_SHORTS_KEY, DEFAULT_SHOW_SHORTS) !== false;

    let subs = sanitizeSubs(getPref(SUBS_KEY, DEFAULT_SUBS));
    if (!Array.isArray(subs) || subs.length === 0) {
        subs = DEFAULT_SUBS.slice();
        setPref(SUBS_KEY, subs);
    }

    function sanitizeSubs(a) {
        if (!Array.isArray(a)) return DEFAULT_SUBS.slice();
        return a.map(x => ({
            id: String(x.id || '').trim(),
            name: String(x.name || '').trim() || 'Channel',
            enabled: x.enabled !== false
        })).filter(x => x.id);
    }
    function saveSubs() { setPref(SUBS_KEY, subs); }

    // Playlists persistence
    let playlists = sanitizePlaylists(getPref(PLAYLISTS_KEY, []));
    function sanitizePlaylists(a) {
        if (!Array.isArray(a)) return [];
        return a.map(p => ({
            id: String(p.id || ''),
            name: String(p.name || '').trim() || 'Playlist',
            created: Number(p.created || Date.now()),
            videos: Array.isArray(p.videos) ? p.videos.filter(v => v && v.id) : []
        })).filter(p => p.id);
    }
    function savePlaylists() { setPref(PLAYLISTS_KEY, playlists); }
    function createPlaylist(name) {
        const id = 'pl_' + Math.random().toString(36).slice(2, 10);
        const p = { id, name: (name || 'Playlist').trim() || 'Playlist', created: Date.now(), videos: [] };
        playlists.push(p);
        savePlaylists();
        return p;
    }
    function findPlaylist(id) { return playlists.find(p => p.id === id); }
    function addVideoToPlaylist(pid, video) {
        const p = findPlaylist(pid);
        if (!p) return false;
        if (p.videos.some(v => v.id === video.id)) return 'exists';
        p.videos.unshift({
            id: video.id,
            href: video.href,
            title: video.title,
            thumb: video.thumb,
            when: video.when || '',
            author: video.author || '',
            isShort: !!video.isShort,
            addedAt: Date.now()
        });
        savePlaylists();
        return true;
    }
    function removeVideoFromPlaylist(pid, vid) {
        const p = findPlaylist(pid);
        if (!p) return;
        p.videos = p.videos.filter(v => v.id !== vid);
        savePlaylists();
    }
    function renamePlaylist(pid, name) {
        const p = findPlaylist(pid);
        if (!p) return;
        p.name = (name || 'Playlist').trim() || 'Playlist';
        savePlaylists();
    }
    function deletePlaylist(pid) {
        playlists = playlists.filter(p => p.id !== pid);
        savePlaylists();
    }

    sourceSel.value = getPref(SRC_PREF_KEY, 'auto');
    sourceSel.addEventListener('change', () => setPref(SRC_PREF_KEY, sourceSel.value));

    // ============ LOGGING ============
    const logs = [];
    const log = (label, obj) => {
        try { logs.push(label + ': ' + (typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2))); }
        catch { logs.push(label + ': ' + String(obj)); }
        pre.textContent = logs.join('\n\n');
    };

    // ============ UTILS ============
    const bust = u => u + (u.includes('?') ? '&' : '?') + '_tm=' + Date.now();
    const fmtDate = s => { const d = new Date(s); return isNaN(d) ? s : d.toLocaleString(); };
    const nowIso = () => new Date().toLocaleString();
    const feedUrl = id => `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
    const chUrl = id => `https://www.youtube.com/channel/${id}`;

    function plural(n, unit) { return `${n} ${unit}${n === 1 ? '' : 's'} ago`; }
    function timeAgo(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return iso;
        const now = new Date();
        const diffMs = now - d;
        if (diffMs < 0) return 'just now';
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return plural(mins, 'minute');
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return plural(hrs, 'hour');
        const days = Math.floor(hrs / 24);
        if (days < 30) return plural(days, 'day');
        let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
        if (now.getDate() < d.getDate()) months--;
        if (months < 12) return plural(Math.max(months, 1), 'month');
        const years = Math.floor(months / 12);
        return plural(years, 'year');
    }

    // ============ PER-CHANNEL CACHE ============
    const txtKey = id => `yt_cache_text_${id}`;
    const tsKey  = id => `yt_cache_ts_${id}`;
    function putCache(id, text) { try { GM_setValue(txtKey(id), text); GM_setValue(tsKey(id), Date.now()); } catch {} }
    function getCache(id) {
        try { return { text: GM_getValue(txtKey(id), ''), ts: GM_getValue(tsKey(id), 0) }; }
        catch { return { text: '', ts: 0 }; }
    }

    // ============ NETWORK ============
    function gmGet(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                anonymous: true,
                headers: { Accept: 'application/atom+xml, application/rss+xml, application/xml;q=0.9, text/xml;q=0.8' },
                timeout: 20000,
                onload: r => (r.status >= 200 && r.status < 300)
                ? resolve(r.responseText)
                : reject({ status: r.status, statusText: r.statusText, responseHeaders: r.responseHeaders }),
                onerror: r => reject(r || { status: 0 }),
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }

    async function fetchVia(url, label) {
        log(`${label} -> start`, url);
        const r = await fetch(url, { credentials: 'omit', cache: 'no-store' });
        log(`${label} -> status`, `${r.status} ${r.statusText}`);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const txt = await r.text();
        log(`${label} -> ok (length)`, txt.length);
        return txt;
    }

    async function fetchDirect(url) {
        const u = bust(url);
        log('Direct GM_xhr -> start', u);
        const txt = await gmGet(u);
        log('Direct GM_xhr -> ok (length)', txt.length);
        return txt;
    }
    async function fetchMirror(url) {
        const u = 'https://r.jina.ai/http/' + url.replace(/^https?:\/\//, '') + '&_tm=' + Date.now();
        return fetchVia(u, 'Mirror (r.jina.ai)');
    }
    async function fetchProxy1(url) {
        const u = 'https://cors.isomorphic-git.org/' + url + '&_tm=' + Date.now();
        return fetchVia(u, 'Proxy1 (isomorphic)');
    }
    async function fetchProxy2(url) {
        const u = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url) + '&_tm=' + Date.now();
        return fetchVia(u, 'Proxy2 (allorigins)');
    }

    async function getFeedText(url, sourceMode) {
        const order = {
            auto:   [(u)=>fetchDirect(u), (u)=>fetchMirror(u), (u)=>fetchProxy1(u), (u)=>fetchProxy2(u)],
            direct: [(u)=>fetchDirect(u)],
            mirror: [(u)=>fetchMirror(u)],
            proxy1: [(u)=>fetchProxy1(u)],
            proxy2: [(u)=>fetchProxy2(u)],
        }[sourceMode] || [(u)=>fetchDirect(u), (u)=>fetchMirror(u), (u)=>fetchProxy1(u), (u)=>fetchProxy2(u)];

        for (let i = 0; i < order.length; i++) {
            const fn = order[i];
            for (let attempt = 1; attempt <= (i === 0 ? 2 : 1); attempt++) {
                try { return await fn(url); }
                catch (e) {
                    log(`Provider fail (#${i + 1}, attempt ${attempt})`, String(e && (e.message || e.status || e)));
                    if (attempt === 1 && i === 0) await new Promise(r => setTimeout(r, 800));
                }
            }
        }
        throw new Error('All providers failed.');
    }

    // ============ PARSER ============
    function parseYouTube(xmlText) {
        const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
        if (xml.querySelector('parsererror')) throw new Error('XML parse error');

        const channelName = xml.getElementsByTagName('name')[0]?.textContent?.trim() || '';

        const items = Array.from(xml.getElementsByTagName('entry')).map(entry => {
            const title = (entry.getElementsByTagName('title')[0]?.textContent || '').trim();

            let href = '';
            for (const l of Array.from(entry.getElementsByTagName('link'))) {
                const rel = l.getAttribute('rel'); const h = l.getAttribute('href');
                if ((!rel || rel === 'alternate') && h) { href = h; break; }
            }

            const id = entry.getElementsByTagNameNS(YT_NS, 'videoId')[0]?.textContent?.trim() || '';
            if (!href && id) href = `https://www.youtube.com/watch?v=${id}`;

            const when = entry.getElementsByTagName('published')[0]?.textContent
            || entry.getElementsByTagName('updated')[0]?.textContent || '';

            let thumb = entry.getElementsByTagNameNS(MEDIA_NS, 'thumbnail')[0]?.getAttribute('url') || '';
            if (id) thumb = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

            const author = entry.getElementsByTagName('name')[0]?.textContent?.trim();
            return { title, href, id, when, thumb, author };
        }).filter(i => i.title && i.href);

        return { items, channelName };
    }

    // ============ RENDER ============
    function render(parsed, errorMsg, stats) {
        const { items } = parsed || { items: [] };

        const parts = [];
        if (errorMsg) parts.push(`Error: ${errorMsg}`);
        if (stats) {
            const { enabled, ok, cached, failed, totalItems } = stats;
            parts.push(`Channels: ${ok}${cached ? `+${cached} cached` : ''}${failed ? `, ${failed} failed` : ''} of ${enabled}`);
            parts.push(`Items: ${totalItems}`);
        }
        parts.push(`Updated: ${nowIso()}`);
        status.textContent = parts.join('   ');
        if ((stats?.cached)) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = 'cached';
            status.appendChild(badge);
        }

        grid.textContent = '';
        if (errorMsg && !items.length) {
            const err = document.createElement('div');
            err.className = 'error';
            err.textContent = errorMsg;
            grid.appendChild(err);
            return;
        }

        for (const i of items) {
            const card = document.createElement('div'); card.className = 'card';

            const hasId = !!i.id;
            const embedHref = hasId ? `https://www.youtube.com/embed/${i.id}` : i.href;
            const youtubeUrl = i.href;

            // Thumbnail
            const a = document.createElement('a');
            a.className = 'thumb';
            a.href = embedHref;
            const img = document.createElement('img'); img.src = i.thumb; img.alt = '';
            a.appendChild(img);

            // Actions under thumbnail
            const actions = document.createElement('div');
            actions.className = 'actions';

            const b1 = makeIconBtn('↗', 'Open embedded player in new tab', () => openEmbedNewTab(i.id), !hasId);
            const b2 = makeIconBtn('🪟', 'Open embedded player in popup (720×400)', () => openKioskPopup(i.id), !hasId);
            const b3 = makeIconBtn('📺', 'Open embedded player in floating panel', () => openOverlay(i.id, i.title), !hasId);
            const b4 = makeIconBtn('▶️', 'Open on YouTube', () => window.open(youtubeUrl, '_blank', 'noopener'), false);
            const b5 = makeIconBtn('📋', 'Copy YouTube link', async (btn) => {
                const ok = await copyToClipboard(youtubeUrl);
                const old = btn.textContent;
                btn.textContent = ok ? '✔' : '✖';
                btn.classList.toggle('success', ok);
                setTimeout(() => { btn.textContent = old; btn.classList.remove('success'); }, 1200);
            }, false);

            // New: Add to playlist button
            const b6 = makeIconBtn('➕', 'Add to playlist', () => {
                openPlaylistPicker({
                    id: i.id,
                    href: youtubeUrl,
                    title: i.title,
                    thumb: i.thumb,
                    when: i.when,
                    author: i.author,
                    isShort: !!i.isShort
                });
            }, !hasId);

            actions.append(b1, b2, b3, b4, b5, b6);

            // Meta
            const meta = document.createElement('div'); meta.className = 'meta';
            const t = document.createElement('a');
            t.className = 'title';
            t.href = embedHref;
            t.textContent = i.title;

            const rel = i.when ? timeAgo(i.when) : '';
            const m = document.createElement('div');
            m.className = 'muted';
            m.textContent = `${i.author ? i.author + ' • ' : ''}${rel}`;
            if (i.when) m.title = fmtDate(i.when);

            if (i.isShort) {
                const shortBadge = document.createElement('span');
                shortBadge.className = 'badge';
                shortBadge.textContent = 'Shorts';
                m.appendChild(shortBadge);
            }

            meta.append(t, m);

            // Order: thumb -> actions -> meta
            card.append(a, actions, meta);
            grid.appendChild(card);
        }
    }

    // ============ AGGREGATION ============
    function detectShortUsingOAR(videoId, timeoutMs = 8000) {
        return new Promise(resolve => {
            if (!videoId) return resolve(false);
            const url = bust(`https://img.youtube.com/vi/${videoId}/oardefault.jpg`);
            const img = new Image();
            let done = false;
            const finalize = (isShort) => { if (!done) { done = true; resolve(isShort); } };
            const timer = setTimeout(() => finalize(false), timeoutMs);
            img.onload = () => {
                clearTimeout(timer);
                const w = img.naturalWidth || img.width || 0;
                const h = img.naturalHeight || img.height || 0;
                const isShort = !(w === 120 && h === 90);
                finalize(isShort);
            };
            img.onerror = () => { clearTimeout(timer); finalize(false); };
            img.src = url;
        });
    }

    async function markShorts(items) {
        try {
            const flags = await Promise.all(items.map(i => detectShortUsingOAR(i.id)));
            return items.map((i, idx) => ({ ...i, isShort: !!flags[idx] }));
        } catch (e) {
            log('markShorts error', e && (e.message || String(e)));
            return items.map(i => ({ ...i, isShort: false }));
        }
    }

    async function fetchChannelFeed(ch, sourceMode) {
        const url = feedUrl(ch.id);
        try {
            const text = await getFeedText(url, sourceMode);
            const parsed = parseYouTube(text);
            putCache(ch.id, text);
            if (parsed.channelName && ch.name !== parsed.channelName) {
                ch.name = parsed.channelName;
                saveSubs();
                renderSubsList();
            }
            const items = parsed.items.map(i => ({ ...i, author: parsed.channelName || i.author }));
            return { ok: true, cached: false, items, channel: ch };
        } catch (e) {
            const c = getCache(ch.id);
            if (c.text) {
                try {
                    const parsed = parseYouTube(c.text);
                    const items = parsed.items.map(i => ({ ...i, author: parsed.channelName || i.author }));
                    return { ok: true, cached: true, items, channel: ch };
                } catch {}
            }
            log(`Final fail for ${ch.id}`, e && (e.message || String(e)));
            return { ok: false, cached: false, items: [], channel: ch, error: e && (e.message || String(e)) };
        }
    }

    function sortDescByWhen(a, b) {
        const ta = +new Date(a.when || 0);
        const tb = +new Date(b.when || 0);
        return tb - ta;
    }

    async function load() {
        reloadBtn.disabled = true;
        reloadBtn.textContent = 'Reloading...';
        if (getClearLogs()) {
            logs.length = 0;
            pre.textContent = '';
        } else {
            log('Reload at', nowIso());
        }

        const enabledSubs = subs.filter(s => s.enabled !== false);
        if (enabledSubs.length === 0) {
            render({ items: [] }, 'No enabled subscriptions. Click the bell to add some.', { enabled: 0, ok: 0, cached: 0, failed: 0, totalItems: 0 });
            reloadBtn.disabled = false;
            reloadBtn.textContent = 'Reload';
            subsPanel.classList.add('open');
            addInput.focus();
            return;
        }

        try {
            const sourceMode = sourceSel.value;
            const results = await Promise.allSettled(enabledSubs.map(ch => fetchChannelFeed(ch, sourceMode)));

            let allItems = [];
            let ok = 0, cached = 0, failed = 0;

            for (const r of results) {
                if (r.status === 'fulfilled' && r.value.ok) {
                    ok++;
                    if (r.value.cached) cached++;
                    allItems.push(...r.value.items);
                } else {
                    failed++;
                }
            }

            let itemsMarked = await markShorts(allItems);
            const showShorts = getShowShorts();
            if (!showShorts) itemsMarked = itemsMarked.filter(i => !i.isShort);

            itemsMarked.sort(sortDescByWhen);

            const limit = getLimit();
            const cut = limit > 0 ? itemsMarked.slice(0, limit) : itemsMarked;

            render({ items: cut }, null, {
                enabled: enabledSubs.length, ok, cached, failed, totalItems: cut.length
            });
        } catch (e) {
            const msg = e && (e.message || String(e));
            log('Aggregate fail', msg);
            render({ items: [] }, msg, null);
        } finally {
            reloadBtn.disabled = false;
            reloadBtn.textContent = 'Reload';
        }
    }

    reloadBtn.addEventListener('click', load);

    // ============ SUBSCRIPTIONS PANEL ============
    let subsFilter = '';

    function renderSubsList() {
        subsListEl.textContent = '';

        const filterTxt = (subsFilter || '').trim().toLowerCase();
        const list = filterTxt
        ? subs.filter(ch =>
                      (ch.name || '').toLowerCase().includes(filterTxt) ||
                      (ch.id || '').toLowerCase().includes(filterTxt)
                     )
        : subs;

        if (!list.length) {
            const empty = document.createElement('div');
            empty.className = 'subSmall';
            empty.textContent = filterTxt
                ? 'No matches.'
            : 'No subscriptions yet. Paste a channel URL, @handle, feed URL, or UC… ID below.';
            subsListEl.appendChild(empty);
            return;
        }

        for (const ch of list) {
            const row = document.createElement('div');
            row.className = 'subRow';
            row.dataset.id = ch.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = ch.enabled !== false;
            checkbox.title = 'Show on main screen';
            checkbox.addEventListener('change', () => {
                ch.enabled = checkbox.checked;
                saveSubs();
                load();
            });

            const nameBox = document.createElement('div');
            const n1 = document.createElement('div'); n1.className = 'subName'; n1.textContent = ch.name || 'Channel';
            const n2 = document.createElement('div'); n2.className = 'subSmall'; n2.textContent = ch.id;
            nameBox.append(n1, n2);

            const actions = document.createElement('div');
            actions.className = 'subActions';
            const openLink = document.createElement('a');
            openLink.href = chUrl(ch.id);
            openLink.target = '_blank'; openLink.rel = 'noopener';
            openLink.className = 'link'; openLink.title = 'Open channel';
            openLink.textContent = '↗';

            const rm = document.createElement('button');
            rm.title = 'Remove';
            rm.textContent = '🗑️';
            rm.addEventListener('click', () => {
                subs = subs.filter(s => s.id !== ch.id);
                saveSubs();
                renderSubsList();
                load();
            });

            actions.append(openLink, rm);
            row.append(checkbox, nameBox, actions);
            subsListEl.appendChild(row);
        }
    }

    // Subscriptions panel toggles
    impExpBtn?.addEventListener('click', () => {
        if (iexPanel.classList.contains('open')) closeIex();
        else openIex();
    });
    iexClose?.addEventListener('click', closeIex);

    iexImportMergeBtn?.addEventListener('click', () => iexFileMerge?.click());
    iexImportReplaceBtn?.addEventListener('click', () => iexFileReplace?.click());

    iexFileMerge?.addEventListener('change', () => {
        const f = iexFileMerge.files && iexFileMerge.files[0];
        if (f) importFromNewPipeFile(f, 'merge');
    });
    iexFileReplace?.addEventListener('change', () => {
        const f = iexFileReplace.files && iexFileReplace.files[0];
        if (f) importFromNewPipeFile(f, 'replace');
    });

    iexExportBtn?.addEventListener('click', exportAsNewPipeJSON);

    subsBtn.addEventListener('click', () => {
        const willOpen = !subsPanel.classList.contains('open');
        if (willOpen) {
            subsPanel.classList.add('open');
            settingsPanel.classList.remove('open');
            iexPanel.classList.remove('open');
            plPicker.classList.remove('open');
            updateAddSearchUI();
            addInput.focus();
        } else {
            closeSubsPanel(true);
        }
    });
    spClose.addEventListener('click', () => closeSubsPanel(true));

    addInput.addEventListener('input', () => {
        const raw = (addInput.value || '').trim();
        if (!isAddPattern(raw)) {
            subsFilter = raw;
            renderSubsList();
        }
        updateAddSearchUI();
    });

    addInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && isAddPattern(addInput.value)) {
            addBtn.click();
        }
    });

    addBtn.addEventListener('click', async () => {
        const raw = (addInput.value || '').trim();
        if (!raw) return;

        if (!isAddPattern(raw)) {
            resetSearch();
            return;
        }

        addBtn.disabled = true; addBtn.textContent = 'Adding...';
        try {
            const id = await toChannelId(raw);
            if (!id) throw new Error('Could not resolve to a channel ID');
            if (subs.some(s => s.id === id)) {
                subs = subs.map(s => s.id === id ? { ...s, enabled: true } : s);
                saveSubs();
                renderSubsList();
                await load();
                addInput.value = '';
                updateAddSearchUI();
                return;
            }
            const text = await getFeedText(feedUrl(id), sourceSel.value);
            const parsed = parseYouTube(text);
            const name = parsed.channelName || 'Channel';
            subs.push({ id, name, enabled: true });
            saveSubs();
            putCache(id, text);
            renderSubsList();
            await load();
            addInput.value = '';
            updateAddSearchUI();
        } catch (e) {
            alert((e && e.message) ? e.message : 'Failed to add channel');
        } finally {
            addBtn.disabled = false; addBtn.textContent = 'Add';
        }
    });

    enableAllBtn?.addEventListener('click', () => {
        if (!subs.length) return;
        subs = subs.map(s => ({ ...s, enabled: true }));
        saveSubs();
        renderSubsList();
        load();
    });

    disableAllBtn?.addEventListener('click', () => {
        if (!subs.length) return;
        subs = subs.map(s => ({ ...s, enabled: false }));
        saveSubs();
        renderSubsList();
        load();
    });

    invertSelBtn?.addEventListener('click', () => {
        if (!subs.length) return;
        subs = subs.map(s => ({ ...s, enabled: (s.enabled === false) })); // invert
        saveSubs();
        renderSubsList();
        load();
    });

    // ============ SETTINGS ============
    function openSettings() {
        clearLogsChk.checked = getClearLogs();

        const v = getPref(LIMIT_KEY, DEFAULT_LIMIT);
        limitInput.value = String(Number.isFinite(+v) ? +v : DEFAULT_LIMIT);
        showShortsChk.checked = getShowShorts();

        settingsPanel.classList.add('open');
        subsPanel.classList.remove('open');
        iexPanel.classList.remove('open');
        plPicker.classList.remove('open');
        limitInput.focus();
        limitInput.select();
    }
    function closeSettings() {
        settingsPanel.classList.remove('open');
    }
    function applySettings() {
        setPref(CLEAR_LOGS_KEY, !!clearLogsChk.checked);

        let v = parseInt(limitInput.value, 10);
        if (!Number.isFinite(v) || v < 0) v = 0;
        setPref(LIMIT_KEY, v);
        setPref(SHOW_SHORTS_KEY, !!showShortsChk.checked);
        load();
    }

    settingsBtn.addEventListener('click', () => {
        if (settingsPanel.classList.contains('open')) closeSettings();
        else openSettings();
    });
    stClose.addEventListener('click', closeSettings);
    limitSaveBtn.addEventListener('click', applySettings);
    limitInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') applySettings();
    });
    showShortsChk.addEventListener('keydown', e => {
        if (e.key === 'Enter') applySettings();
    });

    // ============ INPUT → CHANNEL ID RESOLUTION ============
    const UC_RE = /^UC[0-9A-Za-z_-]{22}$/;
    const FEED_CH_PARAM_RE = /[?&]channel_id=(UC[0-9A-Za-z_-]{22})/i;

    async function toChannelId(input) {
        const s = input.trim();

        if (UC_RE.test(s)) return s;

        const feedMatch = s.match(FEED_CH_PARAM_RE);
        if (feedMatch) return feedMatch[1];

        try {
            let url = s;
            if (!/^https?:\/\//i.test(url)) {
                if (url.startsWith('@')) url = 'https://www.youtube.com/' + url;
                else url = 'https://' + url;
            }
            const u = new URL(url);

            const parts = u.pathname.split('/').filter(Boolean);
            const chIdx = parts.indexOf('channel');
            if (chIdx !== -1 && parts[chIdx + 1] && UC_RE.test(parts[chIdx + 1])) {
                return parts[chIdx + 1];
            }

            const resolved = await resolveByMirror(u.href);
            if (resolved) return resolved;
        } catch {}
        return null;
    }

    async function resolveByMirror(ytUrl) {
        try {
            const url = 'https://r.jina.ai/http/' + ytUrl.replace(/^https?:\/\//, '');
            const html = await fetchVia(url, 'Resolve (r.jina.ai)');
            const m = html.match(/"channelId":"(UC[0-9A-Za-z_-]{22})"/)
            || html.match(/"externalId":"(UC[0-9A-Za-z_-]{22})"/)
            || html.match(/data-channel-external-id="(UC[0-9A-Za-z_-]{22})"/);
            return m ? m[1] : null;
        } catch (e) {
            log('resolveByMirror fail', e && (e.message || String(e)));
            return null;
        }
    }

    // ============ IMPORT/EXPORT ============
    function openIex() {
        iexPanel.classList.add('open');
        subsPanel.classList.remove('open');
        settingsPanel.classList.remove('open');
        plPicker.classList.remove('open');
    }
    function closeIex() {
        iexPanel.classList.remove('open');
    }

    function readFileText(file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result || ''));
            fr.onerror = () => reject(fr.error || new Error('File read error'));
            fr.readAsText(file);
        });
    }

    function extractUcFromUrl(url) {
        if (!url) return null;
        const m1 = String(url).match(/[?&]channel_id=(UC[0-9A-Za-z_-]{22})/i);
        if (m1) return m1[1];
        const m2 = String(url).match(/\/channel\/(UC[0-9A-Za-z_-]{22})(?:[/?#]|$)/i);
        if (m2) return m2[1];
        return null;
    }

    function parseNewPipeJSON(text) {
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error('Invalid JSON');
        }
        const arr = data && Array.isArray(data.subscriptions) ? data.subscriptions : null;
        if (!arr) throw new Error('Invalid file: missing "subscriptions" array');

        const out = [];
        const seen = new Set();
        const warnings = [];
        for (const s of arr) {
            if (!s || s.service_id !== 0) continue;
            const id = extractUcFromUrl(s.url);
            if (!id) {
                warnings.push(`Skipped (no UC id): ${s.url || '(no url)'}`);
                continue;
            }
            if (seen.has(id)) continue;
            seen.add(id);
            out.push({ id, name: String(s.name || '').trim() || 'Channel' });
        }
        return { list: out, warnings };
    }

    function exportAsNewPipeJSON() {
        const data = {
            app_version: '0.28.0',
            app_version_int: 1005,
            subscriptions: subs.map(s => ({
                service_id: 0,
                url: chUrl(s.id),
                name: s.name || 'Channel'
            }))
        };
        const text = JSON.stringify(data, null, 2);
        const blob = new Blob([text], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `FeedTube_Subscriptions_${dateStr}.json`;
        (document.body || document.documentElement).appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }

    async function importFromNewPipeFile(file, mode /* 'merge' | 'replace' */) {
        try {
            const text = await readFileText(file);
            const { list, warnings } = parseNewPipeJSON(text);
            if (!list.length) {
                alert('No YouTube channels found in file.');
                return;
            }

            let added = 0, updated = 0;
            if (mode === 'replace') {
                subs = list.map(({ id, name }) => ({ id, name, enabled: true }));
                added = list.length;
            } else {
                const byId = new Map(subs.map(s => [s.id, s]));
                for (const { id, name } of list) {
                    const ex = byId.get(id);
                    if (ex) {
                        if (name && ex.name !== name) { ex.name = name; updated++; }
                    } else {
                        subs.push({ id, name, enabled: true });
                        added++;
                    }
                }
            }

            saveSubs();
            renderSubsList();
            await load();

            const msg = `${mode === 'replace' ? 'Replaced' : 'Imported'}: ${added} added${updated ? `, ${updated} name(s) updated` : ''}` +
                  (warnings && warnings.length ? ` (skipped ${warnings.length})` : '');
            log('Import result', msg);
            if (warnings && warnings.length) log('Import warnings', warnings.join('\n'));
            alert(msg);
            closeIex();
        } catch (e) {
            const msg = e && (e.message || String(e));
            log('Import failed', msg);
            alert('Import failed: ' + msg);
        } finally {
            if (iexFileMerge) iexFileMerge.value = '';
            if (iexFileReplace) iexFileReplace.value = '';
        }
    }

    // ============ SEARCH (ADD/FILTER) ============
    const isLikelyUrl = s => /^https?:\/\//i.test((s || '').trim());
    const isAddPattern = s => {
        s = (s || '').trim();
        return !!s && (isLikelyUrl(s) || UC_RE.test(s) || FEED_CH_PARAM_RE.test(s) || s.startsWith('@'));
    };

    function updateAddSearchUI() {
        const raw = (addInput.value || '').trim();
        const addMode = isAddPattern(raw);
        if (addMode || !raw) {
            addBtn.textContent = 'Add';
            addBtn.title = 'Add channel';
        } else {
            addBtn.textContent = 'Clear';
            addBtn.title = 'Clear search filter';
        }
    }

    function resetSearch() {
        subsFilter = '';
        addInput.value = '';
        renderSubsList();
        updateAddSearchUI();
    }

    function closeSubsPanel(reset = false) {
        subsPanel.classList.remove('open');
        if (reset) resetSearch();
    }

    // ============ TABS + PLAYLISTS UI ============
    function showTab(which) {
        if (which === 'playlists') {
            videosView.style.display = 'none';
            playlistsView.style.display = 'block';
            tabPlaylists.classList.add('active');
            tabVideos.classList.remove('active');
            renderPlaylistsHome();
        } else {
            videosView.style.display = 'block';
            playlistsView.style.display = 'none';
            tabVideos.classList.add('active');
            tabPlaylists.classList.remove('active');
        }
        setPref(TAB_PREF_KEY, which);
    }
    tabVideos?.addEventListener('click', () => showTab('videos'));
    tabPlaylists?.addEventListener('click', () => showTab('playlists'));

    function renderPlaylistsHome() {
        playlistsView.textContent = '';

        const top = document.createElement('div');
        top.className = 'plTop';
        const title = document.createElement('div');
        title.className = 'subName';
        title.textContent = 'Playlists';
        const createRow = document.createElement('div');
        createRow.className = 'row';
        const inp = document.createElement('input');
        inp.placeholder = 'New playlist name…';
        const createBtn = document.createElement('button');
        createBtn.className = 'primary';
        createBtn.textContent = 'Create';
        createBtn.addEventListener('click', () => {
            const name = (inp.value || '').trim() || 'Playlist';
            const p = createPlaylist(name);
            inp.value = '';
            renderPlaylistsHome();
            // Optional: open it right away
            // openPlaylistDetail(p.id);
        });
        createRow.append(inp, createBtn);
        top.append(title, createRow);
        playlistsView.appendChild(top);

        const listWrap = document.createElement('div');
        listWrap.className = 'plList';

        if (!playlists.length) {
            const empty = document.createElement('div');
            empty.className = 'subSmall';
            empty.textContent = 'No playlists yet. Add from the Videos tab, or create one above.';
            listWrap.appendChild(empty);
        } else {
            for (const p of playlists) {
                const row = document.createElement('div');
                row.className = 'subRow';

                const dot = document.createElement('div'); dot.style.width = '22px';

                const nameBox = document.createElement('div');
                const n1 = document.createElement('div'); n1.className = 'subName'; n1.textContent = p.name;
                const n2 = document.createElement('div'); n2.className = 'subSmall'; n2.textContent = `${p.videos.length} video${p.videos.length === 1 ? '' : 's'}`;
                nameBox.append(n1, n2);

                const actions = document.createElement('div');
                actions.className = 'subActions';

                const openBtn = document.createElement('button');
                openBtn.textContent = 'Open';
                openBtn.addEventListener('click', () => openPlaylistDetail(p.id));

                const renBtn = document.createElement('button');
                renBtn.textContent = '✏️';
                renBtn.title = 'Rename';
                renBtn.addEventListener('click', () => {
                    const newName = prompt('Rename playlist:', p.name);
                    if (newName != null) {
                        renamePlaylist(p.id, newName);
                        renderPlaylistsHome();
                    }
                });

                const delBtn = document.createElement('button');
                delBtn.textContent = '🗑️';
                delBtn.title = 'Delete';
                delBtn.addEventListener('click', () => {
                    if (confirm(`Delete playlist "${p.name}"?`)) {
                        deletePlaylist(p.id);
                        renderPlaylistsHome();
                    }
                });

                actions.append(openBtn, renBtn, delBtn);
                row.append(dot, nameBox, actions);
                listWrap.appendChild(row);
            }
        }

        playlistsView.appendChild(listWrap);
    }

    function openPlaylistDetail(pid) {
        const p = findPlaylist(pid);
        if (!p) { renderPlaylistsHome(); return; }
        playlistsView.textContent = '';

        const head = document.createElement('div');
        head.className = 'row';
        const back = document.createElement('button');
        back.textContent = '← Back';
        back.addEventListener('click', renderPlaylistsHome);
        const title = document.createElement('div');
        title.className = 'subName';
        title.textContent = p.name;
        title.style.marginLeft = '8px';

        const actions = document.createElement('div');
        actions.className = 'row';
        actions.style.marginLeft = 'auto';
        const renBtn = document.createElement('button');
        renBtn.textContent = '✏️ Rename';
        renBtn.addEventListener('click', () => {
            const newName = prompt('Rename playlist:', p.name);
            if (newName != null) { renamePlaylist(p.id, newName); openPlaylistDetail(p.id); }
        });
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️ Delete';
        delBtn.addEventListener('click', () => {
            if (confirm(`Delete playlist "${p.name}"?`)) {
                deletePlaylist(p.id);
                renderPlaylistsHome();
            }
        });

        actions.append(renBtn, delBtn);
        head.append(back, title, actions);
        playlistsView.appendChild(head);

        const grid = document.createElement('div');
        grid.className = 'plGrid';

        if (!p.videos.length) {
            const empty = document.createElement('div');
            empty.className = 'subSmall';
            empty.textContent = 'No videos here yet.';
            playlistsView.appendChild(empty);
        } else {
            for (const v of p.videos) {
                const card = document.createElement('div'); card.className = 'card';

                const hasId = !!v.id;
                const embedHref = hasId ? `https://www.youtube.com/embed/${v.id}` : v.href;
                const youtubeUrl = v.href;

                // Thumb
                const a = document.createElement('a');
                a.className = 'thumb';
                a.href = embedHref;
                const img = document.createElement('img'); img.src = v.thumb; img.alt = '';
                a.appendChild(img);

                // Actions
                const actions = document.createElement('div');
                actions.className = 'actions';

                const b1 = makeIconBtn('↗', 'Open embedded player in new tab', () => openEmbedNewTab(v.id), !hasId);
                const b2 = makeIconBtn('🪟', 'Open embedded player in popup (720×400)', () => openKioskPopup(v.id), !hasId);
                const b3 = makeIconBtn('📺', 'Open embedded player in floating panel', () => openOverlay(v.id, v.title), !hasId);
                const b4 = makeIconBtn('▶️', 'Open on YouTube', () => window.open(youtubeUrl, '_blank', 'noopener'), false);
                const b5 = makeIconBtn('📋', 'Copy YouTube link', async (btn) => {
                    const ok = await copyToClipboard(youtubeUrl);
                    const old = btn.textContent;
                    btn.textContent = ok ? '✔' : '✖';
                    btn.classList.toggle('success', ok);
                    setTimeout(() => { btn.textContent = old; btn.classList.remove('success'); }, 1200);
                }, false);
                const b6 = makeIconBtn('➕', 'Add to another playlist', () => {
                    openPlaylistPicker({
                        id: v.id,
                        href: youtubeUrl,
                        title: v.title,
                        thumb: v.thumb,
                        when: v.when,
                        author: v.author,
                        isShort: !!v.isShort
                    });
                }, !hasId);
                const b7 = makeIconBtn('🗑️', 'Remove from this playlist', () => {
                    removeVideoFromPlaylist(p.id, v.id);
                    openPlaylistDetail(p.id);
                }, false);

                actions.append(b1, b2, b3, b4, b5, b6, b7);

                // Meta
                const meta = document.createElement('div'); meta.className = 'meta';
                const t = document.createElement('a');
                t.className = 'title';
                t.href = embedHref;
                t.textContent = v.title || '(no title)';

                const rel = v.when ? timeAgo(v.when) : '';
                const m = document.createElement('div');
                m.className = 'muted';
                m.textContent = `${v.author ? v.author + ' • ' : ''}${rel}`;
                if (v.when) m.title = fmtDate(v.when);
                if (v.isShort) {
                    const shortBadge = document.createElement('span');
                    shortBadge.className = 'badge';
                    shortBadge.textContent = 'Shorts';
                    m.appendChild(shortBadge);
                }

                meta.append(t, m);

                card.append(a, actions, meta);
                grid.appendChild(card);
            }
        }

        playlistsView.appendChild(grid);
    }

    // ============ PLAYLIST PICKER ============
    let pickerVideo = null;

    function openPlaylistPicker(video) {
        pickerVideo = video;
        renderPlaylistPicker();
        plPicker.classList.add('open');
        settingsPanel.classList.remove('open');
        subsPanel.classList.remove('open');
        iexPanel.classList.remove('open');
        plpNewName.value = '';
        plpNewName.placeholder = 'Create new playlist…';
    }
    function closePlaylistPicker() {
        pickerVideo = null;
        plPicker.classList.remove('open');
    }
    function renderPlaylistPicker() {
        plpList.textContent = '';
        if (!playlists.length) {
            const empty = document.createElement('div');
            empty.className = 'subSmall';
            empty.textContent = 'No playlists yet. Create one below.';
            plpList.appendChild(empty);
            return;
        }
        for (const p of playlists) {
            const row = document.createElement('div');
            row.className = 'subRow';

            const dot = document.createElement('div'); dot.style.width = '22px';

            const box = document.createElement('div');
            const n1 = document.createElement('div'); n1.className = 'subName'; n1.textContent = p.name;
            const n2 = document.createElement('div'); n2.className = 'subSmall'; n2.textContent = `${p.videos.length} video${p.videos.length === 1 ? '' : 's'}`;
            box.append(n1, n2);

            const actions = document.createElement('div');
            actions.className = 'subActions';
            const addBtn = document.createElement('button');
            addBtn.textContent = 'Add';
            addBtn.addEventListener('click', () => {
                if (!pickerVideo) return;
                const res = addVideoToPlaylist(p.id, pickerVideo);
                if (res === 'exists') {
                    addBtn.textContent = 'Already added';
                    setTimeout(() => { addBtn.textContent = 'Add'; }, 1000);
                } else {
                    addBtn.textContent = '✔ Added';
                    setTimeout(() => {
                        addBtn.textContent = 'Add';
                        closePlaylistPicker();
                        if (tabPlaylists.classList.contains('active')) renderPlaylistsHome();
                    }, 700);
                }
            });
            actions.append(addBtn);

            row.append(dot, box, actions);
            plpList.appendChild(row);
        }
    }
    plpClose?.addEventListener('click', closePlaylistPicker);
    plpCreateAdd?.addEventListener('click', () => {
        if (!pickerVideo) return;
        const name = (plpNewName.value || '').trim() || 'Playlist';
        const p = createPlaylist(name);
        addVideoToPlaylist(p.id, pickerVideo);
        plpNewName.value = '';
        closePlaylistPicker();
        if (tabPlaylists.classList.contains('active')) renderPlaylistsHome();
    });
    plpNewName?.addEventListener('keydown', e => {
        if (e.key === 'Enter') plpCreateAdd?.click();
    });

    // ============ LIVE SYNC SUBSCRIPTIONS ============
    (function setupLiveSync() {
        let lastJSON = '';
        try { lastJSON = JSON.stringify(subs); } catch { lastJSON = '[]'; }

        // If the script manager supports events, we catch instant changes.
        try {
            if (typeof GM_addValueChangeListener === 'function') {
                GM_addValueChangeListener(SUBS_KEY, (name, oldVal, newVal, remote) => {
                    if (!remote) return; // ignore our own records
                    const prevIds = new Set((subs || []).map(s => s.id));
                    subs = sanitizeSubs(newVal);
                    lastJSON = JSON.stringify(subs);
                    renderSubsList();
                    load();

                    // Small highlight for new lines in the open panel (optional)
                    if (subsPanel?.classList?.contains('open')) {
                        for (const s of subs) {
                            if (!prevIds.has(s.id)) {
                                const row = subsListEl.querySelector(`.subRow[data-id="${s.id}"]`);
                                if (row) {
                                    row.style.outline = '2px solid #1f6feb';
                                    setTimeout(() => (row.style.outline = ''), 1200);
                                }
                            }
                        }
                    }
                });
            }
        } catch {}

        // Alternative option: check every 2 seconds
        setInterval(() => {
            const latest = sanitizeSubs(getPref(SUBS_KEY, []));
            const j = JSON.stringify(latest);
            if (j !== lastJSON) {
                subs = latest;
                lastJSON = j;
                renderSubsList();
                load();
            }
        }, 2000);
    })();

    // ============ INIT ============
    renderSubsList();
    showTab(getPref(TAB_PREF_KEY, 'videos'));
    load();
}

// ===============================================
// ============ Code for Youtube Page ============
// ===============================================
if (/(^|\.)youtube\.com$/i.test(location.hostname)) {

  // Access the "real" window object to get YouTube's page data
  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : (window.wrappedJSObject || window);

  const BTN_ID = 'feedtube-add-channel-button';
  const BTN_STYLE = `
    padding: 0 16px;
    height: 36px;
    background-color: #065fd4; /* YouTube blue */
    color: white;
    border: none;
    border-radius: 18px;
    cursor: pointer;
    font-family: Roboto, Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    vertical-align: top;
    margin-left: 8px; /* Add some space */
    flex-shrink: 0; /* Prevent button from shrinking in flex containers */
  `;

  // Constants to match your FeedTube.html script
  const SUBS_KEY = 'subs_v1';
  const UC_RE = /^UC[0-9A-Za-z_-]{22}$/;

  // Helper functions for getting/setting script data
  const getPref = (k, d) => { try { return GM_getValue(k, d); } catch { return d; } };
  const setPref = (k, v) => { try { GM_setValue(k, v); } catch {} };

  function saveChannelToSubs(id, name) {
    if (!UC_RE.test(id)) {
        console.error('FeedTube: Invalid channel ID format:', id);
        return 'error';
    }
    let subs = getPref(SUBS_KEY, []);
    if (!Array.isArray(subs)) subs = [];

    const existingSub = subs.find(s => s && s.id === id);

    if (existingSub) {
      existingSub.enabled = true;
      if (name && (!existingSub.name || existingSub.name === 'Default Channel' || existingSub.name === 'Channel')) {
        existingSub.name = name;
      }
      setPref(SUBS_KEY, subs);
      return 'enabled';
    } else {
      subs.push({ id, name: name || 'Channel', enabled: true });
      setPref(SUBS_KEY, subs);
      return 'added';
    }
  }

  // ---- DATA EXTRACTION LOGIC ----
  function extractChannelData() {
    let channelId = null;
    let channelName = null;
    const path = location.pathname;

    channelId = UW?.ytInitialData?.metadata?.channelMetadataRenderer?.externalId ||
                document.querySelector('meta[itemprop="channelId"]')?.content ||
                null;

    if (!channelId && path.startsWith('/channel/')) {
        channelId = path.split('/')[2];
    }

    if (path.startsWith('/watch')) {
        const ownerRenderer = UW?.ytInitialData?.contents?.twoColumnWatchNextResults?.results?.results?.contents
            ?.find(c => c?.videoSecondaryInfoRenderer?.owner)?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer;
        if (ownerRenderer) {
            channelId = ownerRenderer.navigationEndpoint?.browseEndpoint?.browseId || channelId;
            channelName = ownerRenderer.title?.simpleText || null;
        }
    }

    if (!channelName) {
        channelName = UW?.ytInitialData?.metadata?.channelMetadataRenderer?.title ||
                      document.querySelector('meta[property="og:title"]')?.content?.replace(/ - YouTube$/, '') ||
                      'Channel';
    }

    return {
        id: UC_RE.test(channelId || '') ? channelId : null,
        name: channelName.trim()
    };
  }

  // ---- BUTTON ACTIONS ----
  function addCurrentChannel(btn) {
    const { id, name } = extractChannelData();
    if (!id) {
      alert('FeedTube: Could not identify the YouTube channel ID on this page.');
      return;
    }
    const result = saveChannelToSubs(id, name);
    flashBtn(btn, result);
  }

  function flashBtn(btn, result) {
    if (!btn || result === 'error') return;
    const oldText = btn.textContent;
    const oldBg = btn.style.backgroundColor;
    btn.textContent = result === 'added' ? '✓ Added' : '✓ Enabled';
    btn.style.backgroundColor = '#2e7d32'; // Green
    setTimeout(() => {
      btn.textContent = oldText;
      btn.style.backgroundColor = oldBg;
    }, 1500);
  }

  function createButton() {
    const button = document.createElement('button');
    button.id = BTN_ID;
    button.textContent = 'Add to FeedTube';
    button.style.cssText = BTN_STYLE;
    button.addEventListener('click', () => addCurrentChannel(button));
    button.addEventListener('mouseenter', () => (button.style.filter = 'brightness(1.1)'));
    button.addEventListener('mouseleave', () => (button.style.filter = ''));
    return button;
  }

  // ---- MODIFIED BUTTON INSERTION LOGIC ----
  let insertionInterval = null;

  function attemptToAddButton() {
    // If button already exists, we're done
    if (document.getElementById(BTN_ID)) {
      return true;
    }

    // THIS IS THE KEY CHANGE.
    // Instead of finding a container to append to, we find a specific
    // element to insert our button AFTER. This ensures it stays on the same line.
    const referencePoints = [
      // 1. Video Page (/watch?v=...)
      () => document.querySelector('#subscribe-button.style-scope.ytd-watch-metadata'),
      // 2. Modern Channel Page (/@handle) - Find the subscribe button's renderer
      () => document.querySelector('ytd-c4-tabbed-header-renderer ytd-subscribe-button-renderer'),
      // 3. Legacy Channel Page (fallback from your first script)
      () => document.querySelector('.ytSpecButtonViewModelHost')?.parentElement
    ];

    for (const findReference of referencePoints) {
      const ref = findReference();
      if (ref) {
        // Use the modern `.after()` method to insert the button
        // immediately after the reference element.
        ref.after(createButton());
        return true; // Success!
      }
    }

    return false; // Failed to find any location
  }

  function ensureButtonIsAdded() {
    if (insertionInterval) clearInterval(insertionInterval);
    let attempts = 0;
    const maxAttempts = 30;
    insertionInterval = setInterval(() => {
      attempts++;
      const success = attemptToAddButton();
      if (success || attempts >= maxAttempts) {
        clearInterval(insertionInterval);
        insertionInterval = null;
      }
    }, 250);
  }

  // --- SCRIPT EXECUTION ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureButtonIsAdded);
  } else {
    ensureButtonIsAdded();
  }
  window.addEventListener('yt-navigate-finish', ensureButtonIsAdded);

  // Observer is less critical now but good as a backup
  const observer = new MutationObserver(() => {
    // A simple check to avoid running the interval function constantly
    if (!document.getElementById(BTN_ID)) {
        ensureButtonIsAdded();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

})();