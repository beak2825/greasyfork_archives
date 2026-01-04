// ==UserScript==
// @name         😈 Media Stream Hunter (Silent & Master File Focus)
// @namespace    http://masterfile.example.com/
// @version      1.0
// @description  Aggressively targets Master Manifests (.m3u8/.mpd) and Full Media Files. Silently ignores fragmented media segments. Polished UX.
// @author       Balta zar
// @match        *://*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553347/%F0%9F%98%88%20Media%20Stream%20Hunter%20%28Silent%20%20Master%20File%20Focus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553347/%F0%9F%98%88%20Media%20Stream%20Hunter%20%28Silent%20%20Master%20File%20Focus%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**************************************************************************
     * CONFIG & HEURISTICS
     **************************************************************************/
    const UI_ZINDEX = 9999999;
    const NOTIFY_MS = 2500;
    // Patterns of fragmented stream segments (to be IGNORED)
    const STREAM_SEGMENT_PATTERNS = /(\.ts$|\.m4s$|\.vtt$|segment|chunk|frag|range=)/i;
    const MIN_SEGMENT_SIZE_BYTES = 1024 * 100; // 100 KB (Fallback size filter, though aggressive filtering is primary)
    const MANIFEST_EXT = /\.(m3u8|mpd)(\?|$)/i;
    const MEDIA_EXT = /\.(mp4|mp3|webm|ogg|wav|m4a|flac|jpg|png|jpeg|gif|webp|mov|avi|mkv)(\?|$)/i;
    const PRIMARY_COLOR = '#007bff';
    const ACCENT_COLOR = '#28a745';

    /**************************************************************************
     * STATE & STORAGE
     **************************************************************************/
    const storage = {
        get: (k, def) => { try { const v = GM_getValue(k); return v === undefined ? def : v; } catch (e) { return def; } },
        set: (k, v) => { try { GM_setValue(k, v); } catch (e) {} }
    };

    const state = {
        captures: new Map(),
        order: [],
        uiOpen: storage.get('uiOpen', false),
        activeCategory: 'All'
    };

    const CATEGORIES = ['All', 'Stream', 'Video', 'Audio', 'Image', 'Other'];
    const CATEGORY_ICONS = {
        'All': '📦', 'Stream': '📺', 'Video': '🎥', 'Audio': '🎧', 'Image': '🖼️', 'Other': '❓'
    };

    /**************************************************************************
     * UTILS
     **************************************************************************/
    function humanSize(bytes) {
        if (!bytes || isNaN(bytes)) return '—';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
        return bytes.toFixed(1) + ' ' + units[i];
    }
    function nowISO() { return new Date().toISOString().substring(11, 19); }
    function short(url, n = 80) { if (!url) return ''; return url.length <= n ? url : url.slice(0, 55) + '...' + url.slice(-20); }
    function safeId(url) { try { return 'mh-' + btoa(unescape(encodeURIComponent(url))).replace(/=+$/g, ''); } catch (e) { return 'mh-' + Math.random().toString(36).slice(2, 9); } }
    function copyTextToClipboard(text) { try { navigator.clipboard.writeText(text); } catch (e) { /* fallback */ } }

    function categorize(url) {
        if (!url) return 'Other';
        if (MANIFEST_EXT.test(url)) return 'Stream';
        if (/\.(mp3|m4a|aac|wav|flac|ogg)(\?|$)/i.test(url)) return 'Audio';
        if (/\.(mp4|mkv|webm|avi|mov)(\?|$)/i.test(url)) return 'Video';
        if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?|$)/i.test(url)) return 'Image';
        if (STREAM_SEGMENT_PATTERNS.test(url)) return 'Stream';
        return 'Other';
    }

    /**************************************************************************
     * UI BUILD (Polished UX) - Modified
     **************************************************************************/
    let overlay, listEl, toggleBtn, toastEl, tabsEl, statsEl;

    function createStyledButton(text, onClick, isPrimary = false, styleOverride = {}) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: isPrimary ? 'none' : '1px solid #444',
            background: isPrimary ? PRIMARY_COLOR : '#333',
            color: '#fff',
            fontSize: '13px',
            transition: 'background 0.2s',
            ...styleOverride
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    function buildUIOnce() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildUIOnce);
            return;
        }
        if (document.getElementById('mh-overlay')) return;

        // ... (UI setup elements - mostly unchanged Polished UX structure) ...
        overlay = document.createElement('div');
        overlay.id = 'mh-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(4px)',
            zIndex: UI_ZINDEX, color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '20px',
            display: state.uiOpen ? 'block' : 'none', overflowY: 'auto',
            boxSizing: 'border-box'
        });

        const header = document.createElement('div');
        Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' });
        header.innerHTML = `<h3 style="margin:0; font-size: 20px;">Stream Hunter <span style="font-size:12px;opacity:0.6;">(Master Focus)</span></h3>`;
        const closeBtn = createStyledButton('Close (X)', () => toggleOverlay(false), false, { background: '#dc3545' });
        header.appendChild(closeBtn);
        overlay.appendChild(header);

        const actionsBar = document.createElement('div');
        Object.assign(actionsBar.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '15px' });
        statsEl = document.createElement('span');
        Object.assign(statsEl.style, { fontSize: '14px', opacity: 0.8 });
        actionsBar.appendChild(statsEl);

        const utilityBtns = document.createElement('div');
        Object.assign(utilityBtns.style, { display: 'flex', gap: '8px' });
        const clearBtn = createStyledButton('Clear All', clearAll, false);
        const copyAllBtn = createStyledButton('Copy All URLs', copyAll, false);
        utilityBtns.appendChild(clearBtn);
        utilityBtns.appendChild(copyAllBtn);
        actionsBar.appendChild(utilityBtns);
        overlay.appendChild(actionsBar);

        tabsEl = document.createElement('div');
        tabsEl.id = 'mh-tabs';
        Object.assign(tabsEl.style, { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' });
        CATEGORIES.forEach(cat => {
            const b = createStyledButton(`${CATEGORY_ICONS[cat]} ${cat}`, () => {
                state.activeCategory = cat;
                updateActiveTab();
                renderList();
            }, false, { 
                padding: '8px 10px',
                background: '#444',
                border: '1px solid #555'
            });
            b.dataset.cat = cat;
            tabsEl.appendChild(b);
        });
        overlay.appendChild(tabsEl);

        listEl = document.createElement('ul');
        listEl.id = 'mh-list';
        Object.assign(listEl.style, { listStyle: 'none', padding: '0', margin: '0' });
        overlay.appendChild(listEl);

        toastEl = document.createElement('div');
        toastEl.id = 'mh-toast-area';
        Object.assign(toastEl.style, { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', width: 'auto', maxWidth: '90%' });
        document.body.appendChild(toastEl);

        document.body.appendChild(overlay);

        toggleBtn = createStyledButton('📂 Media', () => toggleOverlay(!state.uiOpen), true, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: UI_ZINDEX + 1,
            padding: '12px 18px', borderRadius: '50px', background: PRIMARY_COLOR, color: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        });
        document.body.appendChild(toggleBtn);

        updateActiveTab();
        refreshStats();
        renderList();
    }

    // --- UI HELPERS ---

    // The core notify function is kept for download/copy feedback, but not for capture events.
    function notify(msg, ms = NOTIFY_MS) {
        if (!toastEl) return;
        const d = document.createElement('div');
        Object.assign(d.style, {
            background: 'rgba(40, 44, 52, 0.95)', padding: '10px 15px', borderRadius: '6px', margin: '6px 0', 
            color: '#fff', fontSize: '14px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)', transition: 'opacity 0.5s'
        });
        d.textContent = msg;
        toastEl.appendChild(d);
        setTimeout(() => d.style.opacity = '0', ms);
        setTimeout(() => d.remove(), ms + 500);
    }

    function updateActiveTab() {
        if (!tabsEl) return;
        tabsEl.querySelectorAll('button').forEach(btn => {
            if (btn.dataset.cat === state.activeCategory) {
                Object.assign(btn.style, { background: PRIMARY_COLOR, border: `1px solid ${PRIMARY_COLOR}` });
            } else {
                Object.assign(btn.style, { background: '#444', border: '1px solid #555' });
            }
        });
    }

    function refreshStats() {
        if (!statsEl) return;
        statsEl.textContent = `Total Captured: ${state.captures.size}`;
    }

    function clearAll() { 
        state.captures.clear(); state.order = []; 
        if (listEl) listEl.innerHTML = ''; 
        refreshStats(); notify('Cleared all captures'); 
    }

    function copyAll() {
        const text = Array.from(state.captures.values()).map(c => `${c.url}  (Source: ${c.tag} | Size: ${c.size ? humanSize(c.size) : '—'})`).join('\n');
        copyTextToClipboard(text);
        notify('All captured URLs copied to clipboard!');
    }

    function toggleOverlay(open) {
        state.uiOpen = !!open;
        storage.set('uiOpen', state.uiOpen);
        if (overlay) overlay.style.display = state.uiOpen ? 'block' : 'none';
        if (state.uiOpen) renderList();
    }


    function renderList() {
        if (!listEl) { buildUIOnce(); return; }
        listEl.innerHTML = '';
        const items = Array.from(state.captures.values()).sort((a, b) => new Date(b.time) - new Date(a.time));

        if(items.length === 0){
            listEl.innerHTML = `<li style="padding: 15px; color: #aaa; text-align: center;">No primary media or manifest URLs detected yet. Click the icon later.</li>`;
            return;
        }

        for (const cap of items) {
            const cat = categorize(cap.url);
            if (state.activeCategory !== 'All' && state.activeCategory !== cat) continue;
            
            const li = document.createElement('li');
            li.id = safeId(cap.url);
            Object.assign(li.style, {
                padding: '12px', margin: '8px 0', borderRadius: '6px', 
                backgroundColor: '#343a40',
                borderLeft: `4px solid ${cat === 'Stream' ? '#ffc107' : PRIMARY_COLOR}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px'
            });

            const details = document.createElement('div');
            details.style.minWidth = '0';
            details.innerHTML = `
                <div style="font-size:14px; color: #fff; word-break:break-all; font-family: monospace;" title="${cap.url}">
                    ${short(cap.url, 120)}
                </div>
                <div style="font-size:12px; opacity:0.7; margin-top:5px; display:flex; gap: 15px;">
                    <span title="Detected via">${cap.tag}</span>
                    <span title="Category">${CATEGORY_ICONS[cat]} ${cat}</span>
                    <span title="Time detected">${cap.time}</span>
                    <span class="mh-size" title="File size">${cap.size === null ? '—' : humanSize(cap.size)}</span>
                </div>`;

            const actions = document.createElement('div');
            Object.assign(actions.style, { display: 'flex', gap: '8px', flexShrink: 0 });

            const copyBtn = createStyledButton('Copy', (e) => { 
                e.stopPropagation(); 
                copyTextToClipboard(cap.url); 
                notify('Copied URL'); 
            }, false, { background: '#555' });
            
            const dlBtn = createStyledButton('Download', async (e) => { 
                e.stopPropagation(); 
                try { 
                    await GM_download({ url: cap.url, name: filenameFromUrl(cap.url) }); 
                    notify('Download started', 4000); 
                } catch (err) { 
                    notify('Download failed: ' + (err && err.message ? err.message : 'error'), 4000); 
                }
            }, true, { background: ACCENT_COLOR });

            actions.appendChild(copyBtn);
            actions.appendChild(dlBtn);
            
            li.appendChild(details);
            li.appendChild(actions);
            listEl.appendChild(li);
        }
    }


    /**************************************************************************
     * CORE CAPTURE PIPELINE (Aggressive Filtering)
     **************************************************************************/
    function registerCapture(url, tag, size = null) {
        if (!url) return;
        try { url = String(url).trim(); } catch (e) { return; }

        const category = categorize(url);
        
        // **NEW AGGRESSIVE FILTERING LOGIC:**
        // Check if the URL is NOT a main media file and NOT a manifest file, but IS a stream segment pattern.
        const isMainMediaOrManifest = MANIFEST_EXT.test(url) || MEDIA_EXT.test(url);
        const isSegmentPattern = STREAM_SEGMENT_PATTERNS.test(url);

        if (isSegmentPattern && !isMainMediaOrManifest) {
            // IGNORE segments that don't look like main files (i.e., .m3u8 or .mp4)
            return;
        }

        // Handle existing capture (Update size/tag if needed)
        if (state.captures.has(url)) {
            const existing = state.captures.get(url);
            existing.time = nowISO();
            if (size !== null && (existing.size === null || size > existing.size)) {
                existing.size = size;
                updateSizeInUI(url, size);
            }
            if (!existing.tag.includes(tag)) existing.tag += ', ' + tag;
            const idx = state.order.indexOf(url);
            if (idx !== -1) state.order.splice(idx, 1);
            state.order.unshift(url);
            return;
        }

        // New capture
        const capture = { url, tag, size, time: nowISO() };
        state.captures.set(url, capture);
        state.order.unshift(url);

        buildUIOnce();
        refreshStats();
        renderList();

        // Try to get file size via HEAD request (only if size is unknown)
        if (size === null && !(/^blob:/i.test(url) || MANIFEST_EXT.test(url))) {
            try {
                GM_xmlhttpRequest({
                    method: 'HEAD',
                    url: url,
                    headers: { 'Accept': '*/*' },
                    onload: function (res) {
                        const headers = (res.responseHeaders || '');
                        const m = headers.match(/content-length:\s*(\d+)/i);
                        if (m) {
                            const newSize = parseInt(m[1], 10);
                            // Post-HEAD check to confirm large size for primary files
                            if (newSize < MIN_SEGMENT_SIZE_BYTES && !isMainMediaOrManifest) {
                                state.captures.delete(url);
                                state.order = state.order.filter(u => u !== url);
                                renderList();
                                return;
                            }
                            capture.size = newSize;
                            updateSizeInUI(url, newSize);
                        }
                    },
                    onerror: function () { /* ignore */ }
                });
            } catch (e) { /* ignore */ }
        }
        // Note: NO notify() call here.
    }

    function updateSizeInUI(url, size) {
        const cap = state.captures.get(url);
        if (cap) cap.size = size;
        const id = safeId(url);
        const li = document.getElementById(id);
        if (li) {
            const span = li.querySelector('.mh-size');
            if (span) span.textContent = humanSize(size);
        }
    }

    /**************************************************************************
     * PAGE-CONTEXT INJECTION (API Hooking) - Unchanged
     **************************************************************************/
    function injectPageHook() {
        // (Injection code remains the same to hook fetch, XHR, and MSE for data capture)
        try {
            const injectedCode = `(() => {
                try {
                    const post = (type, data) => {
                        window.postMessage({mh_injected: true, type, data}, '*');
                    };
                    (function(){
                        const orig = window.fetch;
                        if(!orig) return;
                        window.fetch = function(...args){
                            const url = args && args[0]; 
                            post('fetch-request', {url: url && url.url ? url.url : url, time: Date.now()}); 
                            return orig.apply(this, args).then(async resp => { 
                                try{ 
                                    const contentType = resp.headers.get('Content-Type');
                                    const contentLength = resp.headers.get('Content-Length');
                                    const size = contentLength ? parseInt(contentLength, 10) : null;
                                    post('fetch-response', {url: resp.url, type: resp.type, contentType, size}); 
                                }catch(e){}; 
                                return resp; 
                            });
                        };
                    })();
                    (function(){
                        const origOpen = XMLHttpRequest.prototype.open;
                        const origSend = XMLHttpRequest.prototype.send;
                        XMLHttpRequest.prototype.open = function(method, url){
                            this.__mh_url = url;
                            return origOpen.apply(this, arguments);
                        };
                        XMLHttpRequest.prototype.send = function(...args){
                            try{
                                this.addEventListener('load', function(){
                                    try{ 
                                        const size = this.getResponseHeader('Content-Length') ? parseInt(this.getResponseHeader('Content-Length'), 10) : null;
                                        post('xhr-load', {url: this.responseURL || this.__mh_url, status: this.status, size, contentType: this.getResponseHeader('Content-Type')}); 
                                    }catch(e){}
                                });
                            }catch(e){}
                            return origSend.apply(this, args);
                        };
                    })();
                    (function(){
                        if(!URL || !URL.createObjectURL) return;
                        const origCreate = URL.createObjectURL.bind(URL);
                        URL.createObjectURL = function(obj){
                            const url = origCreate(obj);
                            try{ 
                                if(obj && obj.type && /(video|audio|image)/.test(obj.type)){
                                   post('create-object-url', {url, type: obj.type, size: obj.size}); 
                                }
                            }catch(e){}
                            return url;
                        };
                    })();
                    (function(){
                        if(!window.MediaSource) return;
                        const origAdd = MediaSource.prototype.addSourceBuffer;
                        MediaSource.prototype.addSourceBuffer = function(mime){
                            const sb = origAdd.apply(this, arguments);
                            if(sb && sb.appendBuffer){
                                const origAppend = sb.appendBuffer.bind(sb);
                                sb.appendBuffer = function(buf){
                                    try{ post('mse-append', {len: buf && buf.byteLength, mime}); }catch(e){}
                                    return origAppend(buf);
                                };
                            }
                            return sb;
                        };
                    })();
                } catch (e) {}
            })();`;
            const s = document.createElement('script');
            s.textContent = injectedCode;
            (document.head || document.documentElement || document.body || document).appendChild(s);
            s.remove();
        } catch (e) {}
    }

    /**************************************************************************
     * MESSAGE BRIDGE & INITIAL SCAN - Modified
     **************************************************************************/
    window.addEventListener('message', function (evt) {
        try {
            const m = evt.data;
            if (!m || !m.mh_injected) return;
            const t = m.type;
            const d = m.data || {};
            const size = d.size !== null && !isNaN(d.size) ? parseInt(d.size, 10) : null;

            if (t === 'fetch-request') { registerCapture(d.url, 'F-REQ'); }
            else if (t === 'fetch-response') {
                const tag = d.contentType && (d.contentType.includes('video/') || d.contentType.includes('audio/') || MANIFEST_EXT.test(d.url)) ? 'F-RESP-MEDIA' : 'F-RESP';
                registerCapture(d.url, tag, size);
            }
            else if (t === 'xhr-load') {
                const tag = d.contentType && (d.contentType.includes('video/') || d.contentType.includes('audio/') || MANIFEST_EXT.test(d.url)) ? 'XHR-LOAD-MEDIA' : 'XHR-LOAD';
                registerCapture(d.url, tag, size);
            }
            else if (t === 'create-object-url') { registerCapture(d.url, 'BLOB-URL', size); }
            else if (t === 'mse-append') { 
                // Only use MSE detection to give a hint, but not a full notification
            }
        } catch (e) { /* ignore */ }
    });

    function filenameFromUrl(u) { try { const p = u.split('?')[0].split('/').pop(); return p || 'media'; } catch (e) { return 'media'; } }

    function initialScan() {
        try {
            document.querySelectorAll && document.querySelectorAll('video,audio,source,img,a[href]').forEach(node => {
                let url = null;
                let tag = null;
                if (node.tagName === 'A' && node.href && (MEDIA_EXT.test(node.href) || MANIFEST_EXT.test(node.href))) { url = node.href; tag = 'ANCHOR'; }
                else if (node.tagName === 'SOURCE' && node.src) { url = node.src; tag = 'SOURCE-TAG'; }
                else if ((node.tagName === 'AUDIO' || node.tagName === 'VIDEO') && (node.currentSrc || node.src)) { url = node.currentSrc || node.src; tag = 'INITIAL-MEDIA'; }
                else if (node.tagName === 'IMG' && node.src) { url = node.src; tag = 'IMG-TAG'; }

                if (url) registerCapture(url, tag);
            });
        } catch (e) { /* ignore */ }
    }

    /**************************************************************************
     * BOOTSTRAP
     **************************************************************************/
    try { buildUIOnce(); } catch (e) { }
    try { injectPageHook(); } catch (e) { }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialScan);
    else initialScan();

})();
