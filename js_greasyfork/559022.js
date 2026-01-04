// ==UserScript==
// @name         Thundr Clipper
// @namespace    Thundr Clipper
// @description  Allows you to clip matches on Thundr.
// @version      1.5.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thundr.com
// @match        *://*.thundr.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559022/Thundr%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/559022/Thundr%20Clipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. CONFIGURATION
    // ==========================================

    const CONFIG = {
        enabled: JSON.parse(localStorage.getItem('thundrClip_enabled')) ?? true,
        recPartnerVideo: JSON.parse(localStorage.getItem('thundrClip_pVideo')) ?? true,
        recPartnerAudio: JSON.parse(localStorage.getItem('thundrClip_pAudio')) ?? true,
        recMyVideo: JSON.parse(localStorage.getItem('thundrClip_mVideo')) ?? false,
        recMyAudio: JSON.parse(localStorage.getItem('thundrClip_mAudio')) ?? false,
        fps: 30,
        maxMatchLength: 600
    };

    let currentPartnerIP = "Unknown";
    let isRecording = false;

    // CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #thundr-clipper-ui { position: fixed; top: 100px; left: 20px; z-index: 999999; font-family: sans-serif; user-select: none; touch-action: none; }
        .clipper-icon { font-size: 32px; cursor: move; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.8)); transition: transform 0.1s; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0); border-radius: 50%; }
        .clipper-icon:active { transform: scale(0.95); }
        .clipper-menu { display: none; position: absolute; width: 320px; background: rgba(20, 20, 20, 0.5); backdrop-filter: blur(0px); border: 1px solid #444; border-radius: 8px; padding: 12px; color: white; box-shadow: 0 8px 32px rgba(0,0,0,0.6); font-size: 13px; }
        .clipper-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px; }
        .status-container { display: flex; align-items: center; }
        .clipper-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 8px; }
        .clipper-row { display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
        .clipper-row label { cursor: pointer; display: flex; align-items: center; }
        .clipper-row input { margin-right: 6px; cursor: pointer; }
        .clipper-btn { width: 100%; background: #e02e2e; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; margin: 5px 0; }
        .clipper-btn:hover { background: #ff4444; }
        .clip-list { max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-top: 5px; border-top: 1px solid #444; padding-top: 5px; }
        .clip-item { background: rgba(0,0,0,0.6); padding: 6px; border-radius: 4px; display: flex; gap: 8px; align-items: center; }
        .thumb-wrapper { position: relative; width: 60px; height: 45px; flex-shrink: 0; }
        .clip-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; border: 1px solid #555; background: #000; }
        .clip-duration { position: absolute; bottom: 0; left: 0; background: rgba(0,0,0,0.8); color: white; font-size: 9px; padding: 1px 3px; border-top-right-radius: 4px; border-bottom-left-radius: 3px; font-weight: bold; pointer-events: none; }
        .clip-info { flex: 1; min-width: 0; }
        .clip-actions { display: flex; gap: 6px; align-items: center; }
        .clip-actions span, .clip-actions a { text-decoration: none; font-size: 16px; cursor: pointer; transition: transform 0.1s; }
        .clip-actions span:hover, .clip-actions a:hover { transform: scale(1.2); }
        .rec-dot { height: 10px; width: 10px; background-color: #777; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .rec-dot.active { background-color: #f00; box-shadow: 0 0 5px #f00; }
        #rec-status-text { font-weight: bold; color: #aaa; transition: color 0.3s; }
        #rec-status-text.recording { color: #ff4444; }

        /* Modal Styles */
        #clipper-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000000; justify-content: center; align-items: center; flex-direction: column; }
        #clipper-video { max-width: 90%; max-height: 80vh; border: 2px solid #333; box-shadow: 0 0 20px rgba(0,0,0,0.8); background: #000; }
        .modal-close { position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; cursor: pointer; user-select: none; }
        .modal-controls { margin-top: 10px; display: flex; gap: 10px; }
        .modal-btn { background: #444; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .modal-btn:hover { background: #666; }
    `;
    document.head.appendChild(style);

    // Modal HTML
    const modal = document.createElement('div');
    modal.id = 'clipper-modal';
    modal.innerHTML = `
        <div class="modal-close">&times;</div>
        <video id="clipper-video" controls playsinline></video>
        <div class="modal-controls">
            <button id="modal-download" class="modal-btn">Download</button>
        </div>
    `;
    document.body.appendChild(modal);

    const videoEl = modal.querySelector('#clipper-video');
    const closeBtn = modal.querySelector('.modal-close');
    const dlBtn = modal.querySelector('#modal-download');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        videoEl.pause();
        videoEl.src = '';
    };

    class ClipperEngine {
        constructor() {
            this.activeRecorder = null;
            this.activeAnimationId = null;
            this.activeAudioContext = null;
            this.sessions = [];
            this.chunks = [];
            this.startTime = 0;
            this.canvas = null;
            this.ctx = null;
        }

        async startRecording() {
            if (!CONFIG.enabled) return;
            this.stopRecording();

            console.log("[DEBUG] Attempting to start recording...");

            // 1. SELECTORS
            const partnerVid = document.querySelector('.Partners-Video video') || document.querySelector('video[id*="remote"]');
            const myVid = document.querySelector('.css-122y91a video') || document.querySelector('video[id*="local"]');

            // DEBUGGING LOGS
            if (!partnerVid) console.warn("[DEBUG] ❌ Partner Video Element NOT FOUND.");
            else console.log(`[DEBUG] ✅ Partner Video Found. ReadyState: ${partnerVid.readyState} (Has video: ${partnerVid.videoWidth}x${partnerVid.videoHeight})`);

            // WAIT LOGIC: If video exists but has no width, it hasn't loaded yet.
            if (partnerVid && partnerVid.videoWidth === 0) {
                 console.warn("[DEBUG] ⚠️ Partner element exists but has 0 width. Retrying...");
                 setTimeout(() => this.retryStart(), 1000);
                 return;
            }

            // Wait for partner video element existence
            if (!partnerVid && CONFIG.recPartnerVideo) {
                console.warn("[DEBUG] ⚠️ No partner video element. Retrying in 1s...");
                setTimeout(() => this.retryStart(), 1000);
                return;
            }

            try {
                this.chunks = [];

                // --- Audio Setup ---
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.activeAudioContext = new AudioContext();

                // DEBUG AUDIO STATE
                if (this.activeAudioContext.state === 'suspended') {
                    console.error("[DEBUG] 🛑 AudioContext is SUSPENDED. Browser blocked audio.");
                }

                const dest = this.activeAudioContext.createMediaStreamDestination();

                const addTrackToDest = (vidElem, label) => {
                    if (vidElem && vidElem.srcObject) {
                        const tracks = vidElem.srcObject.getAudioTracks();
                        console.log(`[DEBUG] ${label} has ${tracks.length} audio tracks.`);
                        tracks.forEach(track => {
                            if (track.enabled) {
                                const clonedTrack = track.clone();
                                const stream = new MediaStream([clonedTrack]);
                                const source = this.activeAudioContext.createMediaStreamSource(stream);
                                source.connect(dest);
                            }
                        });
                        return tracks.length > 0;
                    }
                    return false;
                };

                let hasAudio = false;
                if (CONFIG.recPartnerVideo && CONFIG.recPartnerAudio) hasAudio |= addTrackToDest(partnerVid, "Partner");
                if (CONFIG.recMyVideo && CONFIG.recMyAudio) hasAudio |= addTrackToDest(myVid, "Self");

                // --- Canvas Setup ---
                this.canvas = document.createElement('canvas');
                let width = 640, height = 480;

                if (partnerVid && partnerVid.videoWidth) {
                    width = partnerVid.videoWidth;
                    height = partnerVid.videoHeight;
                }

                this.canvas.width = width;
                this.canvas.height = height;
                this.ctx = this.canvas.getContext('2d', { alpha: false });

                // --- Animation Loop ---
                const draw = () => {
                    if (!this.ctx || !isRecording) return;
                    this.activeAnimationId = requestAnimationFrame(draw);

                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                    if (CONFIG.recPartnerVideo && partnerVid) {
                        this.ctx.save();
                        this.ctx.translate(width, 0);
                        this.ctx.scale(-1, 1);
                        try { this.ctx.drawImage(partnerVid, 0, 0, width, height); } catch(e) {}
                        this.ctx.restore();
                    }
                    if (CONFIG.recMyVideo && myVid) {
                         try { this.ctx.drawImage(myVid, 0, 0, width / 3, height / 3); } catch(e) {}
                    }
                };

                // --- Recorder Setup ---
                const stream = this.canvas.captureStream(CONFIG.fps);
                if (hasAudio) dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));

                this.activeRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });

                this.activeRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        this.chunks.push(e.data);
                    } else {
                        console.warn("[DEBUG] ⚠️ Recorder produced empty chunk.");
                    }
                };

                this.activeRecorder.onstart = () => console.log("[DEBUG] 🎥 Recorder Started Successfully");
                this.activeRecorder.onerror = (e) => console.error("[DEBUG] ❌ Recorder Error:", e);

                this.activeRecorder.start(1000);
                this.startTime = Date.now();
                this.activeAnimationId = requestAnimationFrame(draw);
                isRecording = true;
                updateRecIndicator();

            } catch (err) {
                console.error("[DEBUG] Clipper Start Error:", err);
            }
        }

        retryStart() { this.startRecording(); }

        stopRecording() {
            if (this.activeRecorder && this.activeRecorder.state !== 'inactive') {
                this.activeRecorder.stop();
            }
            if (this.activeAnimationId) cancelAnimationFrame(this.activeAnimationId);
            if (this.activeAudioContext && this.activeAudioContext.state !== 'closed') {
                this.activeAudioContext.close();
            }

            this.activeRecorder = null;
            this.ctx = null;
            this.canvas = null;
            this.activeAudioContext = null;

            isRecording = false;
            updateRecIndicator();
        }

        restartRecordingKeepMatch() {
            if (this.activeRecorder) this.activeRecorder.stop();
            this.chunks = [];
            if (this.activeRecorder) this.activeRecorder.start(1000);
            this.startTime = Date.now();
        }

        saveClip() {
            if (this.activeRecorder && this.activeRecorder.state === 'recording') {
                this.activeRecorder.requestData();
            }

            setTimeout(() => {
                if (this.chunks.length === 0) {
                    alert("Buffer empty! Start a match first.");
                    return;
                }

                let thumbUrl = "";
                if (this.canvas) {
                    try { thumbUrl = this.canvas.toDataURL('image/jpeg', 0.5); } catch(e) {}
                }

                const durationMs = Date.now() - this.startTime;

                // Foenemegle Method: Trust the raw blob, don't use fix-webm-duration
                const finalBlob = new Blob(this.chunks, { type: this.activeRecorder?.mimeType || 'video/webm' });

                const durationSec = Math.floor(durationMs / 1000);
                const m = Math.floor(durationSec / 60);
                const s = durationSec % 60;
                const durationStr = `${m}:${s.toString().padStart(2, '0')}`;

                const url = URL.createObjectURL(finalBlob);
                const id = Date.now();
                const timestamp = new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
                });

                const filename = `thundr_${currentPartnerIP}_${id}.webm`;

                this.sessions.unshift({
                    id, url, thumbUrl, durationStr,
                    ip: currentPartnerIP || "Unknown",
                    timestamp,
                    size: (finalBlob.size / 1024 / 1024).toFixed(2),
                    filename
                });

                if (this.sessions.length > 10) {
                    const old = this.sessions.pop();
                    URL.revokeObjectURL(old.url);
                }
                renderClipList();

            }, 250);
        }

        deleteClip(id) {
            const index = this.sessions.findIndex(s => s.id === id);
            if (index !== -1) {
                URL.revokeObjectURL(this.sessions[index].url);
                this.sessions.splice(index, 1);
                renderClipList();
            }
        }
    }

    const clipper = new ClipperEngine();

    // ==========================================
    // UI LOGIC (UNCHANGED)
    // ==========================================

    function createUI() {
        const container = document.createElement('div');
        container.id = 'thundr-clipper-ui';

        const icon = document.createElement('div');
        icon.className = 'clipper-icon';
        icon.textContent = '🎥';

        const menu = document.createElement('div');
        menu.className = 'clipper-menu';

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        const DRAG_THRESHOLD = 5;

        function checkMenuPosition() {
            const rect = container.getBoundingClientRect();
            const isLeft = rect.left < (window.innerWidth / 2);
            const isBottom = rect.top > (window.innerHeight - 350);
            if (isLeft) { menu.style.right = 'auto'; menu.style.left = '50px'; }
            else { menu.style.left = 'auto'; menu.style.right = '50px'; }
            if (isBottom) { menu.style.top = 'auto'; menu.style.bottom = '0'; }
            else { menu.style.bottom = 'auto'; menu.style.top = '0'; }
        }

        function handleStart(e) {
            if (e.target !== icon) return;
            isDragging = false;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            container.style.left = rect.left + 'px'; container.style.top = rect.top + 'px';
            container.style.right = 'auto'; container.style.bottom = 'auto';
            icon.style.cursor = 'grabbing';
            document.addEventListener('mousemove', handleMove); document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleMove, { passive: false }); document.addEventListener('touchend', handleEnd);
        }

        function handleMove(e) {
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX; const dy = clientY - startY;
            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                isDragging = true;
                if(e.cancelable) e.preventDefault();
            }
            if (isDragging) {
                let newLeft = initialLeft + dx;
                let newTop = initialTop + dy;
                const maxLeft = window.innerWidth - container.offsetWidth;
                const maxTop = window.innerHeight - container.offsetHeight;
                container.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
                container.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
                checkMenuPosition();
            }
        }

        function handleEnd(e) {
            icon.style.cursor = 'move';
            document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove); document.removeEventListener('touchend', handleEnd);
            if (!isDragging) {
                if (e.cancelable && e.type === 'touchend') e.preventDefault();
                toggleMenu();
            }
            isDragging = false;
        }

        function toggleMenu() {
            if (menu.style.display === 'block') { menu.style.display = 'none'; return; }
            menu.style.display = 'block';
            checkMenuPosition();
        }

        icon.addEventListener('mousedown', handleStart);
        icon.addEventListener('touchstart', handleStart, { passive: false });

        menu.innerHTML = `
            <div class="clipper-header">
                <div class="status-container"><span id="rec-dot" class="rec-dot"></span><span id="rec-status-text">Not Recording</span></div>
            </div>`;

        const enableBox = createToggle('Enable Recording', CONFIG.enabled, (v) => {
            CONFIG.enabled = v; localStorage.setItem('thundrClip_enabled', v);
            if (!v) clipper.stopRecording(); updateRecIndicator();
        });
        menu.querySelector('.clipper-header').appendChild(enableBox.querySelector('label'));

        const grid = document.createElement('div');
        grid.className = 'clipper-grid';
        grid.appendChild(createToggle('Partner Video', CONFIG.recPartnerVideo, v => { CONFIG.recPartnerVideo=v; localStorage.setItem('thundrClip_pVideo',v); }));
        grid.appendChild(createToggle('My Video', CONFIG.recMyVideo, v => { CONFIG.recMyVideo=v; localStorage.setItem('thundrClip_mVideo',v); }));
        grid.appendChild(createToggle('Partner Audio', CONFIG.recPartnerAudio, v => { CONFIG.recPartnerAudio=v; localStorage.setItem('thundrClip_pAudio',v); }));
        grid.appendChild(createToggle('My Audio', CONFIG.recMyAudio, v => { CONFIG.recMyAudio=v; localStorage.setItem('thundrClip_mAudio',v); }));
        menu.appendChild(grid);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'clipper-btn';
        saveBtn.textContent = '💾 Clip Match';
        saveBtn.onclick = () => clipper.saveClip();
        menu.appendChild(saveBtn);

        const listContainer = document.createElement('div');
        listContainer.id = 'clipper-list';
        listContainer.className = 'clip-list';
        listContainer.innerHTML = '<div style="color:#888; text-align:center;">No clips yet</div>';
        menu.appendChild(listContainer);

        container.appendChild(menu);
        container.appendChild(icon);
        document.body.appendChild(container);
    }

    function createToggle(label, checked, cb) {
        const div = document.createElement('div'); div.className = 'clipper-row';
        const lbl = document.createElement('label');
        const inp = document.createElement('input'); inp.type = 'checkbox'; inp.checked = checked;
        inp.onchange = (e) => cb(e.target.checked);
        lbl.appendChild(inp); lbl.appendChild(document.createTextNode(label));
        div.appendChild(lbl); return div;
    }

    function renderClipList() {
        const cont = document.getElementById('clipper-list');
        if (!cont) return;
        cont.innerHTML = '';
        if (clipper.sessions.length === 0) {
            cont.innerHTML = '<div style="color:#888; text-align:center;">No clips yet</div>';
            return;
        }
        clipper.sessions.forEach(sess => {
            const row = document.createElement('div'); row.className = 'clip-item';
            row.innerHTML = `
                <div class="thumb-wrapper">
                    <img src="${sess.thumbUrl}" class="clip-thumb" style="${!sess.thumbUrl?'background:#222':''}">
                    <div class="clip-duration">${sess.durationStr}</div>
                </div>
                <div class="clip-info">
                    <div style="color:#4f9; font-weight:bold; font-size:12px;">${sess.ip}</div>
                    <div style="font-size:10px; color:#aaa;">${sess.timestamp}</div>
                    <div style="font-size:9px; color:#777;">${sess.size}MB</div>
                </div>`;
            const actions = document.createElement('div'); actions.className = 'clip-actions';

            // Watch Button (Triggers Modal)
            const playBtn = document.createElement('span'); playBtn.textContent = '▶️'; playBtn.title = "Watch";
            playBtn.onclick = () => {
                const modal = document.getElementById('clipper-modal');
                const vid = document.getElementById('clipper-video');
                const dl = document.getElementById('modal-download');

                vid.src = sess.url;
                dl.onclick = () => {
                    const a = document.createElement('a'); a.href = sess.url; a.download = sess.filename; a.click();
                };

                modal.style.display = 'flex';
                vid.play().catch(e => console.log("Auto-play blocked", e));
            };

            const dlBtn = document.createElement('a'); dlBtn.textContent = '⬇️'; dlBtn.title = "Download";
            dlBtn.href = sess.url; dlBtn.download = sess.filename;
            const delBtn = document.createElement('span'); delBtn.textContent = '🗑️'; delBtn.title = "Delete";
            delBtn.className = 'delete-btn'; delBtn.style.color = '#ff4444'; delBtn.style.cursor = 'pointer';
            delBtn.onclick = () => clipper.deleteClip(sess.id);
            actions.appendChild(playBtn); actions.appendChild(dlBtn); actions.appendChild(delBtn);
            row.appendChild(actions); cont.appendChild(row);
        });
    }

    function updateRecIndicator() {
        const dot = document.getElementById('rec-dot'); const text = document.getElementById('rec-status-text');
        if (isRecording) {
            if (dot) dot.classList.add('active');
            if (text) { text.textContent = "Recording"; text.classList.add('recording'); }
        } else {
            if (dot) dot.classList.remove('active');
            if (text) { text.textContent = "Not Recording"; text.classList.remove('recording'); }
        }
    }

    const NativeWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        const socket = new NativeWebSocket(...args);
        socket.addEventListener('message', (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (!Array.isArray(msg) || msg.length < 5) return;
                const [,, topic, event, payload] = msg;
                if (event === 'matched') {
                    currentPartnerIP = "Scanning...";
                    clipper.startRecording();
                } else if (event === 'disconnect' || event === 'phx_join') {
                    clipper.stopRecording();
                    currentPartnerIP = "Disconnected";
                } else if (event === 'webrtc_message' && payload?.data?.candidate) {
                    const c = payload.data.candidate;
                    if (typeof c === 'string' && c.includes('typ srflx')) {
                        const match = c.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
                        if (match && match[1] && !match[1].startsWith('10.') && !match[1].startsWith('192.168')) {
                            currentPartnerIP = match[1];
                        }
                    }
                }
            } catch (err) {}
        });
        return socket;
    };
    window.WebSocket.prototype = NativeWebSocket.prototype;

    createUI();
})();