// ==UserScript==
// @name         Bonk Helper – Tools & Panel by thebestg5
// @namespace    https://github.com/thebestg5
// @version      2.4
// @description  Bonk Helper with Tabs, Notes, Ping Test, System Info, Auto-screenshot interval, Screen dimmer, Export/Import + existing features. Buttons only. Author: thebestg5.
// @author       thebestg5
// @match        https://bonk.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548723/Bonk%20Helper%20%E2%80%93%20Tools%20%20Panel%20by%20thebestg5.user.js
// @updateURL https://update.greasyfork.org/scripts/548723/Bonk%20Helper%20%E2%80%93%20Tools%20%20Panel%20by%20thebestg5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- CONFIG & STORAGE ---------- */
    const ID = 'bonk-helper-buttons';
    const STORAGE_PREFIX = 'bh_btn_';
    const GALLERY_KEY = STORAGE_PREFIX + 'gallery';
    const NOTES_KEY = STORAGE_PREFIX + 'notes';
    const defaults = {
        muted: false,
        panelVisible: true,
        macro1: 'GL HF!',
        macro2: 'Nice game!',
        macro3: 'Be right back.',
        chatFontBig: false,
        autoReconnect: false,
        autoReconnectMaxTries: 5,
        theme: 'dark', // 'dark' or 'light'
        sessionStart: Date.now(),
        activeTab: 'tools' // 'tools' | 'settings' | 'gallery'
    };
    const cfg = {};
    function loadCfg() {
        Object.keys(defaults).forEach(k => {
            const v = localStorage.getItem(STORAGE_PREFIX + k);
            cfg[k] = v === null ? defaults[k] : (v === 'true' ? true : (v === 'false' ? false : (isNaN(v) ? v : Number(v))));
        });
        if (!cfg.sessionStart) cfg.sessionStart = defaults.sessionStart;
        if (!cfg.activeTab) cfg.activeTab = 'tools';
    }
    function saveCfg(key, value) {
        cfg[key] = value;
        localStorage.setItem(STORAGE_PREFIX + key, String(value));
    }
    loadCfg();

    /* ---------- GALLERY & NOTES STORAGE ---------- */
    function loadGallery() {
        try {
            const raw = localStorage.getItem(GALLERY_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            return arr.slice(0,5);
        } catch(e) { return []; }
    }
    function saveGallery(arr) {
        try {
            const small = arr.slice(0,5);
            localStorage.setItem(GALLERY_KEY, JSON.stringify(small));
        } catch(e){}
    }
    let gallery = loadGallery();

    function loadNotes() {
        try {
            const raw = localStorage.getItem(NOTES_KEY);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            return arr;
        } catch(e) { return []; }
    }
    function saveNotes(arr) {
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(arr));
        } catch(e){}
    }
    let notes = loadNotes();

    /* ---------- STYLES ---------- */
    const STYLE_ID = ID + '-style';
    if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `
            /* base panel */
            #${ID} {
                position: fixed;
                right: 12px;
                top: 12px;
                z-index: 999999;
                background: rgba(8,8,12,0.78);
                color: #fff;
                font-family: Arial, Helvetica, sans-serif;
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.6);
                min-width: 320px;
                user-select: none;
            }
            #${ID}.light {
                background: #f7f7f8;
                color: #111;
                box-shadow: 0 8px 20px rgba(0,0,0,0.12);
            }
            #${ID} h3 { margin:0 0 6px 0; font-size:14px; display:flex; align-items:center; gap:8px; }
            #${ID} .tabs { display:flex; gap:6px; margin-top:6px; }
            #${ID} .tabBtn { padding:6px 8px; border-radius:6px; border:none; cursor:pointer; background:rgba(255,255,255,0.04); color:inherit; font-weight:700; }
            #${ID} .tabBtn.active { background:rgba(255,255,255,0.12); }
            #${ID} .row { display:flex; gap:6px; align-items:center; margin-top:6px; flex-wrap:wrap; }
            #${ID} .small { font-size:12px; opacity:0.95; }
            #${ID} button { padding:6px 8px; border-radius:6px; border:none; cursor:pointer; font-weight:700; background: rgba(255,255,255,0.06); color: #fff; }
            #${ID}.light button { background: rgba(0,0,0,0.06); color: #111; }
            #${ID} input[type="text"], #${ID} input[type="number"], #${ID} textarea { width:100%; padding:6px; border-radius:6px; border:none; background: rgba(255,255,255,0.03); color: #fff; }
            #${ID}.light input[type="text"], #${ID}.light textarea { background: rgba(0,0,0,0.03); color: #111; }
            #${ID} canvas.fpsGraph { width:100%; height:36px; display:block; margin-top:6px; background:rgba(255,255,255,0.02); border-radius:6px; }
            #${ID}.light canvas.fpsGraph { background: rgba(0,0,0,0.02); }
            #${ID} .tiny { font-size:11px; opacity:0.9; }
            #${ID} .fpsHealth { font-weight:700; padding:4px 6px; border-radius:6px; margin-left:6px; }
            #${ID} .fps-ok { background: rgba(80,200,120,0.12); color: #9affc9; }
            #${ID} .fps-warn { background: rgba(240,180,60,0.08); color: #ffd28a; }
            #${ID} .fps-bad { background: rgba(255,90,90,0.06); color: #ff9a9a; }

            /* floating toggle button */
            #${ID}-floatingToggle {
                position: fixed;
                right: 12px;
                top: 12px;
                z-index: 1000000;
                padding: 6px 10px;
                border-radius: 8px;
                border: none;
                background: rgba(30,30,30,0.88);
                color: #fff;
                cursor: pointer;
                display: none;
                box-shadow: 0 6px 18px rgba(0,0,0,0.5);
                font-weight:700;
            }
            #${ID}.light #${ID}-floatingToggle { background: rgba(240,240,240,0.9); color:#111; box-shadow:none; }

            /* gallery styles */
            #${ID} .gallery { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
            #${ID} .gallery .thumb {
                width:60px; height:60px; border-radius:6px; overflow:hidden; background:#222; display:inline-block; position:relative; border:1px solid rgba(255,255,255,0.03);
            }
            #${ID}.light .gallery .thumb { background:#fff; border:1px solid rgba(0,0,0,0.06); }
            #${ID} .gallery .thumb img{width:100%;height:100%;object-fit:cover;display:block;}
            #${ID} .gallery .tools { position:absolute; right:2px; top:2px; display:flex; gap:4px; }

            /* notes list */
            #${ID} .notes { display:flex; flex-direction:column; gap:6px; margin-top:6px; max-height:180px; overflow:auto; }
            #${ID} .note { background: rgba(255,255,255,0.03); padding:6px; border-radius:6px; display:flex; gap:6px; align-items:flex-start; }
            #${ID}.light .note { background: rgba(0,0,0,0.03); }

            /* dimmer overlay */
            #${ID}-dimmer {
                position: fixed;
                left: 0; top: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.35);
                z-index: 999998;
                display: none;
                pointer-events: none;
            }

            @media (max-width:420px) {
                #${ID} { right:6px; left:6px; min-width:auto; }
            }
        `;
        document.head.appendChild(s);
    }

    /* ---------- PANEL with TABS ---------- */
    function ensurePanel() {
        if (document.getElementById(ID)) return;
        const panel = document.createElement('div');
        panel.id = ID;
        panel.innerHTML = `
            <h3>Bonk Helper <span class="tiny">v2.4</span></h3>

            <div class="tabs">
                <button class="tabBtn" id="${ID}-tab-tools">Tools</button>
                <button class="tabBtn" id="${ID}-tab-settings">Settings</button>
                <button class="tabBtn" id="${ID}-tab-gallery">Gallery</button>
            </div>

            <div id="${ID}-content" style="margin-top:8px">
                <!-- tools tab -->
                <div id="${ID}-tab-tools-content" class="tabContent">
                    <div class="small">FPS: <strong id="${ID}-fps">...</strong> <span id="${ID}-fpsHealth" class="fpsHealth fps-ok">OK</span> &nbsp; | &nbsp; Ping: <strong id="${ID}-ping">...</strong> ms</div>
                    <canvas class="fpsGraph" id="${ID}-graph" width="240" height="36"></canvas>

                    <div class="row">
                        <button id="${ID}-soundBtn">Sound: ${cfg.muted ? 'OFF' : 'ON'}</button>
                        <button id="${ID}-reconnectBtn">Reconnect</button>
                        <button id="${ID}-togglePanelBtn">${cfg.panelVisible ? 'Hide panel' : 'Show panel'}</button>
                    </div>

                    <div class="row">
                        <button id="${ID}-screenshotBtn">Screenshot</button>
                        <button id="${ID}-focusChatBtn">Focus Chat</button>
                        <button id="${ID}-copyLinkBtn">Copy room link</button>
                    </div>

                    <div style="margin-top:8px">
                        <div class="small">Macros:</div>
                        <div class="row">
                            <input type="text" id="${ID}-macro1" placeholder="Macro 1"/>
                            <button id="${ID}-send1">Send 1</button>
                        </div>
                        <div class="row">
                            <input type="text" id="${ID}-macro2" placeholder="Macro 2"/>
                            <button id="${ID}-send2">Send 2</button>
                        </div>
                        <div class="row">
                            <input type="text" id="${ID}-macro3" placeholder="Macro 3"/>
                            <button id="${ID}-send3">Send 3</button>
                        </div>
                        <div class="row">
                            <button id="${ID}-saveMacros">Save macros</button>
                            <div style="flex:1" class="tiny">Use Send buttons to post macro text</div>
                        </div>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <div class="row">
                            <button id="${ID}-themeBtn">Theme: ${cfg.theme === 'dark' ? 'Dark' : 'Light'}</button>
                            <button id="${ID}-chatBigBtn">Chat font: ${cfg.chatFontBig ? 'Large' : 'Normal'}</button>
                            <button id="${ID}-autoRecBtn">Auto-Reconnect: ${cfg.autoReconnect ? 'ON' : 'OFF'}</button>
                        </div>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <div class="row">
                            <div>Session: <span id="${ID}-sessionTimer" class="timer">00:00:00</span></div>
                            <div style="flex:1"></div>
                            <button id="${ID}-resetSession" class="tiny">Reset</button>
                        </div>
                    </div>

                </div>

                <!-- settings tab -->
                <div id="${ID}-tab-settings-content" class="tabContent" style="display:none">
                    <div class="small">Ping test (custom URL):</div>
                    <div class="row">
                        <input type="text" id="${ID}-pingUrl" placeholder="https://example.com"/>
                        <button id="${ID}-pingTestBtn">Test ping</button>
                    </div>
                    <div class="small" style="margin-top:6px">Result: <strong id="${ID}-pingTestResult">—</strong> ms</div>

                    <div style="margin-top:8px" class="small">
                        <div class="small">System info:</div>
                        <div class="row">
                            <div>CPU cores: <strong id="${ID}-sysCores">—</strong></div>
                            <div style="flex:1"></div>
                            <div>Memory (approx): <strong id="${ID}-sysMem">—</strong></div>
                        </div>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <div class="small">Auto-screenshot interval (seconds):</div>
                        <div class="row">
                            <input type="number" id="${ID}-autoShotInterval" min="1" value="10"/>
                            <button id="${ID}-startAutoShot">Start</button>
                            <button id="${ID}-stopAutoShot">Stop</button>
                            <div style="flex:1"></div>
                        </div>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <button id="${ID}-toggleDimmer">Toggle screen dimmer</button>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <button id="${ID}-exportBtn">Export settings (JSON)</button>
                        <input type="file" id="${ID}-importFile" style="display:none"/>
                        <button id="${ID}-importBtn">Import settings (JSON)</button>
                    </div>

                    <div style="margin-top:8px" class="small">
                        <div class="small">Notes:</div>
                        <textarea id="${ID}-noteText" rows="3" placeholder="Write a note..."></textarea>
                        <div class="row">
                            <button id="${ID}-addNoteBtn">Add note</button>
                            <button id="${ID}-clearNotesBtn">Clear all notes</button>
                            <div style="flex:1"></div>
                        </div>
                        <div class="notes" id="${ID}-notesList"></div>
                    </div>
                </div>

                <!-- gallery tab -->
                <div id="${ID}-tab-gallery-content" class="tabContent" style="display:none">
                    <div class="small">Screenshots gallery (last 5):</div>
                    <div class="gallery" id="${ID}-gallery"></div>
                    <div class="row" style="margin-top:6px">
                        <button id="${ID}-clearGallery">Clear gallery</button>
                    </div>
                </div>

            </div>

            <div style="margin-top:8px" class="tiny">All controls use buttons — no keyboard shortcuts are active.</div>
        `;
        document.body.appendChild(panel);

        // set values
        document.getElementById(ID + '-macro1').value = cfg.macro1;
        document.getElementById(ID + '-macro2').value = cfg.macro2;
        document.getElementById(ID + '-macro3').value = cfg.macro3;
        document.getElementById(ID + '-autoShotInterval').value = 10;

        // theme
        applyTheme(cfg.theme);

        // tab buttons
        document.getElementById(ID + '-tab-tools').addEventListener('click', () => switchTab('tools'));
        document.getElementById(ID + '-tab-settings').addEventListener('click', () => switchTab('settings'));
        document.getElementById(ID + '-tab-gallery').addEventListener('click', () => switchTab('gallery'));
        // initial tab
        switchTab(cfg.activeTab);

        // tools listeners
        document.getElementById(ID + '-soundBtn').addEventListener('click', () => toggleSound());
        document.getElementById(ID + '-reconnectBtn').addEventListener('click', () => doReconnect());
        document.getElementById(ID + '-togglePanelBtn').addEventListener('click', () => togglePanelVisible());
        document.getElementById(ID + '-screenshotBtn').addEventListener('click', () => { takeScreenshot(); flashPanel('Screenshot taken'); });
        document.getElementById(ID + '-focusChatBtn').addEventListener('click', () => focusChatInput());
        document.getElementById(ID + '-copyLinkBtn').addEventListener('click', () => copyRoomLink());

        document.getElementById(ID + '-send1').addEventListener('click', () => sendChatMacro(1));
        document.getElementById(ID + '-send2').addEventListener('click', () => sendChatMacro(2));
        document.getElementById(ID + '-send3').addEventListener('click', () => sendChatMacro(3));
        document.getElementById(ID + '-saveMacros').addEventListener('click', () => {
            saveCfg('macro1', document.getElementById(ID + '-macro1').value || '');
            saveCfg('macro2', document.getElementById(ID + '-macro2').value || '');
            saveCfg('macro3', document.getElementById(ID + '-macro3').value || '');
            flashPanel('Macros saved');
        });

        document.getElementById(ID + '-themeBtn').addEventListener('click', () => toggleTheme());
        document.getElementById(ID + '-chatBigBtn').addEventListener('click', () => toggleChatSize());
        document.getElementById(ID + '-autoRecBtn').addEventListener('click', () => toggleAutoReconnect());
        document.getElementById(ID + '-resetSession').addEventListener('click', () => resetSessionTimer());

        // settings listeners
        document.getElementById(ID + '-pingTestBtn').addEventListener('click', () => pingTest());
        document.getElementById(ID + '-startAutoShot').addEventListener('click', () => startAutoShot());
        document.getElementById(ID + '-stopAutoShot').addEventListener('click', () => stopAutoShot());
        document.getElementById(ID + '-toggleDimmer').addEventListener('click', () => toggleDimmer());
        document.getElementById(ID + '-exportBtn').addEventListener('click', () => exportAll());
        document.getElementById(ID + '-importBtn').addEventListener('click', () => {
            document.getElementById(ID + '-importFile').click();
        });
        document.getElementById(ID + '-importFile').addEventListener('change', (e) => importFromFile(e));
        document.getElementById(ID + '-addNoteBtn').addEventListener('click', () => addNote());
        document.getElementById(ID + '-clearNotesBtn').addEventListener('click', () => { notes = []; saveNotes(notes); renderNotes(); flashPanel('Notes cleared'); });

        // gallery listeners
        document.getElementById(ID + '-clearGallery').addEventListener('click', () => { gallery = []; saveGallery(gallery); renderGallery(); flashPanel('Gallery cleared'); });

        renderNotes();
        renderGallery();
    }
    ensurePanel();

    /* ---------- FLOATING TOGGLE BUTTON ---------- */
    function ensureToggleButton() {
        if (document.getElementById(ID + '-floatingToggle')) return;
        const btn = document.createElement('button');
        btn.id = ID + '-floatingToggle';
        btn.textContent = 'Show panel';
        btn.addEventListener('click', () => {
            togglePanelVisible(true);
        });
        document.body.appendChild(btn);
    }
    ensureToggleButton();

    /* ---------- TABS ---------- */
    function switchTab(tab) {
        const tools = document.getElementById(ID + '-tab-tools-content');
        const settings = document.getElementById(ID + '-tab-settings-content');
        const galleryTab = document.getElementById(ID + '-tab-gallery-content');
        document.getElementById(ID + '-tab-tools').classList.remove('active');
        document.getElementById(ID + '-tab-settings').classList.remove('active');
        document.getElementById(ID + '-tab-gallery').classList.remove('active');
        if (tab === 'tools') { tools.style.display='block'; settings.style.display='none'; galleryTab.style.display='none'; document.getElementById(ID + '-tab-tools').classList.add('active'); }
        else if (tab === 'settings') { tools.style.display='none'; settings.style.display='block'; galleryTab.style.display='none'; document.getElementById(ID + '-tab-settings').classList.add('active'); }
        else { tools.style.display='none'; settings.style.display='none'; galleryTab.style.display='block'; document.getElementById(ID + '-tab-gallery').classList.add('active'); }
        saveCfg('activeTab', tab);
    }

    /* ---------- FPS counter + GRAPH + HEALTH ---------- */
    let last = performance.now();
    let frameCount = 0;
    let fps = 0;
    const fpsHistory = new Array(60).fill(0);
    function fpsLoop(now) {
        frameCount++;
        if (now - last >= 1000) {
            fps = frameCount;
            frameCount = 0;
            last = now;
            const el = document.getElementById(ID + '-fps');
            if (el) el.textContent = fps;
            fpsHistory.push(fps);
            if (fpsHistory.length > 60) fpsHistory.shift();
            drawFpsGraph();
            updateFpsHealth(fps);
        }
        requestAnimationFrame(fpsLoop);
    }
    requestAnimationFrame(fpsLoop);

    function drawFpsGraph() {
        const c = document.getElementById(ID + '-graph');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0,0,c.width,c.height);
        const w = c.width, h = c.height;
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(0,0,w,h);
        ctx.beginPath();
        const len = Math.max(1, fpsHistory.length - 1);
        for (let i=0;i<fpsHistory.length;i++) {
            const x = Math.floor((i/(len)) * w);
            const y = h - Math.floor((Math.min(fpsHistory[i],60)/60) * h);
            if (i===0) ctx.moveTo(x,y);
            else ctx.lineTo(x,y);
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(160,220,255,0.95)';
        ctx.stroke();
    }

    function updateFpsHealth(fpsVal) {
        const el = document.getElementById(ID + '-fpsHealth');
        if (!el) return;
        if (fpsVal >= 48) {
            el.textContent = 'OK';
            el.className = 'fpsHealth fps-ok';
        } else if (fpsVal >= 28) {
            el.textContent = 'WARN';
            el.className = 'fpsHealth fps-warn';
        } else {
            el.textContent = 'BAD';
            el.className = 'fpsHealth fps-bad';
        }
    }

    /* ---------- PING (round-trip fetch to origin) ---------- */
    async function measurePing() {
        const el = document.getElementById(ID + '-ping');
        try {
            const url = window.location.origin + '/favicon.ico';
            const t0 = performance.now();
            await fetch(url, {cache:'no-store', method:'GET'});
            const t1 = performance.now();
            const ms = Math.round(t1 - t0);
            if (el) el.textContent = ms;
        } catch(e) {
            if (el) el.textContent = '—';
        }
    }
    setInterval(measurePing, 2000);
    measurePing();

    /* ---------- PING TEST (custom) ---------- */
    async function pingTest() {
        const inp = document.getElementById(ID + '-pingUrl');
        const res = document.getElementById(ID + '-pingTestResult');
        if (!inp || !res) return;
        const url = (inp.value || '').trim();
        if (!url) { res.textContent = 'Invalid URL'; return; }
        res.textContent = '...';
        try {
            const t0 = performance.now();
            await fetch(url, {method:'HEAD', cache:'no-store', mode:'no-cors'}).catch(()=>{}); // HEAD may be blocked; we still measure time to attempt
            const t1 = performance.now();
            res.textContent = Math.round(t1 - t0);
        } catch(e) {
            try { res.textContent = 'Failed'; } catch(e){}
        }
    }

    /* ---------- SYSTEM INFO ---------- */
    function updateSystemInfo() {
        const coresEl = document.getElementById(ID + '-sysCores');
        const memEl = document.getElementById(ID + '-sysMem');
        if (coresEl) coresEl.textContent = navigator.hardwareConcurrency || '—';
        if (memEl) {
            if (performance && performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                const total = performance.memory.totalJSHeapSize;
                memEl.textContent = `${Math.round(used/1024/1024)}MB / ${Math.round(total/1024/1024)}MB`;
            } else {
                memEl.textContent = 'N/A';
            }
        }
    }
    updateSystemInfo();

    /* ---------- SOUND (toggle) ---------- */
    function toggleSound() {
        const newState = !cfg.muted;
        saveCfg('muted', newState);
        const btn = document.getElementById(ID + '-soundBtn');
        if (btn) btn.textContent = 'Sound: ' + (newState ? 'OFF' : 'ON');
        document.querySelectorAll('audio, video').forEach(el => { try { el.muted = newState; } catch(e){} });
        try {
            const OriginalAudio = window.Audio;
            window.Audio = function(...args){ const a = new OriginalAudio(...args); try { a.muted = newState; } catch(e){} return a; };
            window.Audio.prototype = OriginalAudio.prototype;
        } catch(e){}
    }

    /* ---------- SCREENSHOT of canvas + save to gallery ---------- */
    async function takeScreenshot() {
        try {
            const canvases = Array.from(document.querySelectorAll('canvas')).filter(c => c.width && c.height);
            if (canvases.length === 0) throw new Error('No canvas found');
            const canvas = canvases[0];

            const thumb = document.createElement('canvas');
            const maxSide = 300;
            const scale = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
            thumb.width = Math.floor(canvas.width * scale);
            thumb.height = Math.floor(canvas.height * scale);
            const tctx = thumb.getContext('2d');
            tctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);

            const dataUrl = thumb.toDataURL('image/png');
            gallery.unshift(dataUrl);
            if (gallery.length > 5) gallery = gallery.slice(0,5);
            saveGallery(gallery);
            renderGallery();

            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const ts = new Date().toISOString().replace(/[:.]/g,'-');
                a.download = `bonk-screenshot-${ts}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            });
        } catch(err) {
            flashPanel('Screenshot failed');
        }
    }

    function renderGallery() {
        const container = document.getElementById(ID + '-gallery');
        if (!container) return;
        container.innerHTML = '';
        if (!gallery || gallery.length === 0) { container.innerHTML = '<div class="tiny">No screenshots</div>'; return; }
        gallery.forEach((dataUrl, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            const img = document.createElement('img');
            img.src = dataUrl;
            thumb.appendChild(img);

            const tools = document.createElement('div');
            tools.className = 'tools';
            const dl = document.createElement('button'); dl.className='small'; dl.textContent='DL'; dl.title='Download';
            dl.addEventListener('click', ()=>{ const a=document.createElement('a'); a.href=dataUrl; a.download=`bonk-thumb-${idx+1}.png`; document.body.appendChild(a); a.click(); a.remove();});
            const del = document.createElement('button'); del.className='small'; del.textContent='X'; del.title='Delete';
            del.addEventListener('click', ()=>{ gallery.splice(idx,1); saveGallery(gallery); renderGallery(); });
            tools.appendChild(dl); tools.appendChild(del);
            thumb.appendChild(tools);
            container.appendChild(thumb);
        });
    }

    /* ---------- NOTES ---------- */
    function renderNotes() {
        const list = document.getElementById(ID + '-notesList');
        if (!list) return;
        list.innerHTML = '';
        if (!notes || notes.length === 0) { list.innerHTML = '<div class="tiny">No notes</div>'; return; }
        notes.forEach((n, idx) => {
            const node = document.createElement('div');
            node.className = 'note';
            const text = document.createElement('div'); text.style.flex='1'; text.textContent = n;
            const rbtn = document.createElement('button'); rbtn.textContent='Del'; rbtn.addEventListener('click', ()=>{ notes.splice(idx,1); saveNotes(notes); renderNotes(); });
            node.appendChild(text); node.appendChild(rbtn);
            list.appendChild(node);
        });
    }
    function addNote() {
        const ta = document.getElementById(ID + '-noteText');
        if (!ta) return;
        const v = (ta.value || '').trim();
        if (!v) { flashPanel('Note empty'); return; }
        notes.unshift(v);
        saveNotes(notes);
        ta.value = '';
        renderNotes();
        flashPanel('Note added');
    }

    /* ---------- CHAT: focus and send macros ---------- */
    function findChatInput() {
        const inputs = Array.from(document.querySelectorAll('input, textarea'));
        for (const el of inputs) {
            const ph = el.getAttribute('placeholder') || '';
            if (/chat|say|message|send/i.test(ph) || (el.className && el.className.toLowerCase().includes('chat'))) return el;
            if (el.offsetParent !== null && el.clientHeight > 6) return el;
        }
        return null;
    }
    function focusChatInput() {
        const input = findChatInput();
        if (input) { input.focus(); input.select && input.select(); flashPanel('Chat focused'); }
        else flashPanel('Chat input not found');
    }
    function sendChatMacro(n) {
        const text = cfg['macro' + n] || document.getElementById(ID + '-macro' + n).value || '';
        if (!text) { flashPanel('Macro is empty'); return; }
        const input = findChatInput();
        if (!input) { flashPanel('Chat input not found'); return; }
        input.focus(); input.value = text;
        input.dispatchEvent(new Event('input', {bubbles:true}));
        input.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', bubbles:true}));
        setTimeout(()=> {
            const btn = Array.from(document.querySelectorAll('button')).find(b => /send|chat|enter|submit/i.test(b.textContent));
            if (btn) btn.click();
        }, 60);
        flashPanel('Macro sent');
    }

    /* ---------- COPY ROOM LINK ---------- */
    async function copyRoomLink() {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try { await navigator.clipboard.writeText(url); flashPanel('Room link copied'); return; } catch(e){}
        }
        const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); flashPanel('Room link copied'); } catch(e){ flashPanel('Copy failed'); } ta.remove();
    }

    /* ---------- AUTO-RECONNECT (WS intercept) ---------- */
    let reconnectTries = 0;
    let maxTries = parseInt(cfg.autoReconnectMaxTries) || defaults.autoReconnectMaxTries;
    function toggleAutoReconnect() {
        const newState = !cfg.autoReconnect; saveCfg('autoReconnect', newState);
        const btn = document.getElementById(ID + '-autoRecBtn'); if (btn) btn.textContent = 'Auto-Reconnect: ' + (newState ? 'ON' : 'OFF');
        flashPanel('Auto-Reconnect ' + (newState ? 'enabled' : 'disabled'));
    }
    function doReconnect() { try { const btn = document.getElementById(ID + '-reconnectBtn'); if (btn) { btn.disabled = true; btn.textContent = 'Reconnecting...'; } } catch(e){} setTimeout(()=> location.reload(), 150); }
    (function interceptWS() {
        const OriginalWS = window.WebSocket; if (!OriginalWS) return;
        function MyWS(url, protocols) {
            const ws = protocols ? new OriginalWS(url, protocols) : new OriginalWS(url);
            ws.addEventListener('close', (ev) => {
                if (cfg.autoReconnect) {
                    reconnectTries++;
                    if (reconnectTries <= maxTries) {
                        const delay = Math.min(30000, 500 * Math.pow(2, reconnectTries));
                        flashPanel(`Connection closed, reconnecting in ${Math.round(delay/1000)}s... (try ${reconnectTries}/${maxTries})`);
                        setTimeout(()=> { location.reload(); }, delay);
                    } else { flashPanel('Exceeded reconnect attempts'); }
                } else { flashPanel('Connection closed'); }
            });
            ws.addEventListener('open', () => { reconnectTries = 0; });
            return ws;
        }
        try { MyWS.prototype = OriginalWS.prototype; window.WebSocket = MyWS; } catch(e){}
    })();

    /* ---------- THEME ---------- */
    function applyTheme(theme) {
        const panel = document.getElementById(ID); if (!panel) return;
        if (theme === 'light') panel.classList.add('light'); else panel.classList.remove('light');
        const btn = document.getElementById(ID + '-themeBtn'); if (btn) btn.textContent = 'Theme: ' + (theme === 'dark' ? 'Dark' : 'Light');
        saveCfg('theme', theme);
    }
    function toggleTheme() { const newTheme = cfg.theme === 'dark' ? 'light' : 'dark'; saveCfg('theme', newTheme); applyTheme(newTheme); flashPanel('Theme: ' + (newTheme === 'dark' ? 'Dark' : 'Light')); }
    applyTheme(cfg.theme);

    /* ---------- PANEL SHOW/HIDE & CHAT SIZE ---------- */
    let panelVisible = !!cfg.panelVisible;
    function togglePanelVisible(forceShow = null) {
        panelVisible = (forceShow !== null) ? forceShow : !panelVisible;
        saveCfg('panelVisible', panelVisible);
        const p = document.getElementById(ID); const toggleBtn = document.getElementById(ID + '-floatingToggle');
        if (p) p.style.display = panelVisible ? 'block' : 'none';
        if (toggleBtn) toggleBtn.style.display = panelVisible ? 'none' : 'block';
        const insideBtn = document.getElementById(ID + '-togglePanelBtn'); if (insideBtn) insideBtn.textContent = panelVisible ? 'Hide panel' : 'Show panel';
        flashPanel(panelVisible ? 'Panel visible' : 'Panel hidden');
    }
    (function initPanelVisibility() { const pinit = document.getElementById(ID); if (pinit) pinit.style.display = panelVisible ? 'block' : 'none'; const toggleBtn = document.getElementById(ID + '-floatingToggle'); if (toggleBtn) toggleBtn.style.display = panelVisible ? 'none' : 'block'; })();

    function toggleChatSize() { const big = !cfg.chatFontBig; saveCfg('chatFontBig', big); const btn = document.getElementById(ID + '-chatBigBtn'); if (btn) btn.textContent = 'Chat font: ' + (big ? 'Large' : 'Normal'); applyChatFontSize(); flashPanel('Chat font: ' + (big ? 'Large' : 'Normal')); }
    function applyChatFontSize() { try { const chatEls = Array.from(document.querySelectorAll('.chat, .chatbox, .chat-window, .chat-text, .messages, textarea, input')).filter(el => el.offsetParent !== null); if (cfg.chatFontBig) chatEls.forEach(el => el.style.fontSize = '18px'); else chatEls.forEach(el => el.style.fontSize = ''); } catch(e){} }
    applyChatFontSize();

    /* ---------- SESSION TIMER ---------- */
    let sessionStart = Number(cfg.sessionStart) || Date.now();
    function updateSessionTimer() {
        const el = document.getElementById(ID + '-sessionTimer'); if (!el) return;
        const diff = Date.now() - sessionStart; const seconds = Math.floor(diff / 1000) % 60; const minutes = Math.floor(diff / 60000) % 60; const hours = Math.floor(diff / 3600000);
        el.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }
    setInterval(updateSessionTimer, 1000); updateSessionTimer();
    function resetSessionTimer() { sessionStart = Date.now(); saveCfg('sessionStart', sessionStart); updateSessionTimer(); flashPanel('Session reset'); }

    /* ---------- FLASH MESSAGES ---------- */
    let flashTimeout = null;
    function flashPanel(msg) {
        const old = document.getElementById(ID + '-flash'); if (old) old.remove();
        const d = document.createElement('div'); d.id = ID + '-flash'; d.style.position = 'absolute'; d.style.left = '10px'; d.style.bottom = '10px'; d.style.background = 'rgba(0,0,0,0.6)'; d.style.padding = '6px 8px'; d.style.borderRadius = '6px'; d.style.fontSize = '12px'; d.textContent = msg;
        const p = document.getElementById(ID); if (p) p.appendChild(d);
        if (flashTimeout) clearTimeout(flashTimeout); flashTimeout = setTimeout(()=> { d.remove(); flashTimeout = null; }, 2500);
    }

    /* ---------- DIMMER OVERLAY ---------- */
    function ensureDimmer() {
        if (document.getElementById(ID + '-dimmer')) return;
        const d = document.createElement('div'); d.id = ID + '-dimmer'; document.body.appendChild(d);
    }
    ensureDimmer();
    function toggleDimmer() {
        const d = document.getElementById(ID + '-dimmer'); if (!d) return;
        d.style.display = d.style.display === 'block' ? 'none' : 'block';
        flashPanel(d.style.display === 'block' ? 'Dimmer on' : 'Dimmer off');
    }

    /* ---------- AUTO-SCREENSHOT interval ---------- */
    let autoShotIntervalId = null;
    function startAutoShot() {
        const val = Number(document.getElementById(ID + '-autoShotInterval').value) || 10;
        stopAutoShot();
        autoShotIntervalId = setInterval(()=> { takeScreenshot(); flashPanel('Auto shot'); }, Math.max(1000, val*1000));
        flashPanel('Auto-screenshots started');
    }
    function stopAutoShot() { if (autoShotIntervalId) { clearInterval(autoShotIntervalId); autoShotIntervalId = null; flashPanel('Auto-screenshots stopped'); } else flashPanel('Auto-screenshots not running'); }

    /* ---------- EXPORT / IMPORT ---------- */
    function exportAll() {
        const data = {
            cfg: cfg,
            gallery: gallery,
            notes: notes
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `bonk-helper-export-${new Date().toISOString().replace(/[:.]/g,'-')}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        flashPanel('Exported settings');
    }
    function importFromFile(e) {
        const f = e.target.files && e.target.files[0];
        if (!f) { flashPanel('No file'); return; }
        const r = new FileReader();
        r.onload = function() {
            try {
                const parsed = JSON.parse(r.result);
                if (parsed.cfg) { Object.keys(parsed.cfg).forEach(k => saveCfg(k, parsed.cfg[k])); }
                if (Array.isArray(parsed.gallery)) { gallery = parsed.gallery.slice(0,5); saveGallery(gallery); }
                if (Array.isArray(parsed.notes)) { notes = parsed.notes; saveNotes(notes); }
                // reload UI
                applyTheme(cfg.theme);
                renderGallery();
                renderNotes();
                flashPanel('Import applied (some changes may require reload)');
            } catch(err) { flashPanel('Import failed'); }
        };
        r.readAsText(f);
    }

    /* ---------- START-UP ANIMATION & initial render ---------- */
    setTimeout(()=> { const p = document.getElementById(ID); if (!p) return; p.style.transform = 'translateY(-6px)'; p.style.transition = 'transform 0.35s'; setTimeout(()=> p.style.transform = 'translateY(0px)', 300); }, 600);
    renderGallery(); renderNotes(); flashPanel('Bonk Helper loaded: v2.4');

})();
