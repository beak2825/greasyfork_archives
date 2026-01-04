// ==UserScript==
// @name         Vimeo SPL: v4.1 (Modern UI)
// @namespace    https://github.com/5f32797a
// @version      4.1
// @description  VimeoSPL: Replaces embedded player with a modern HLS interface, allowing separate high-quality video/audio downloads.
// @match        https://vimeo.com/*
// @match        https://player.vimeo.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559430/Vimeo%20SPL%3A%20v41%20%28Modern%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559430/Vimeo%20SPL%3A%20v41%20%28Modern%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========================================================================
       1. ICONS & STYLES
       ========================================================================== */
    const ICONS = {
        play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        volumeHigh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volumeMute: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        fullscreen: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
        audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
        spinner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>'
    };

    const css = `
        :root { --spl-primary: #00adef; --spl-bg: #121212; --spl-surface: #1e1e1e; --spl-text: #ffffff; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .spl-wrap * { box-sizing: border-box; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .spl-wrap { position: fixed; inset: 0; background: #000; z-index: 99999; color: var(--spl-text); overflow: hidden; user-select: none; }

        /* Video Element */
        .spl-video { width: 100%; height: 100%; object-fit: contain; outline: none; }

        /* Overlay & Center Controls */
        .spl-layer { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 100%); transition: opacity 0.3s ease; pointer-events: none; }
        .spl-layer.fade-out { opacity: 0; }
        .spl-center-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: auto; cursor: pointer; }
        .spl-big-play { width: 70px; height: 70px; background: rgba(0,0,0,0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); opacity: 0; transform: scale(0.8); transition: 0.2s; pointer-events: none; }
        .spl-big-play svg { width: 36px; height: 36px; margin-left: 4px; } /* center play icon visually */
        .spl-spinner { animation: spl-spin 1s linear infinite; display: none; }
        @keyframes spl-spin { 100% { transform: rotate(360deg); } }

        /* Controls Bar */
        .spl-controls { padding: 0 24px 24px; pointer-events: auto; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 1280px; margin: 0 auto; }

        /* Progress Bar */
        .spl-prog-container { height: 14px; display: flex; align-items: center; cursor: pointer; position: relative; group: true; }
        .spl-prog-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; position: relative; transition: height 0.1s; overflow: hidden; }
        .spl-prog-container:hover .spl-prog-bg { height: 6px; }
        .spl-prog-buf { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(255,255,255,0.3); width: 0; transition: width 0.2s; }
        .spl-prog-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--spl-primary); width: 0; transition: width 0.1s linear; box-shadow: 0 0 10px rgba(0,173,239,0.5); }

        /* Bottom Bar Buttons */
        .spl-bar { display: flex; justify-content: space-between; align-items: center; height: 40px; }
        .spl-grp { display: flex; align-items: center; gap: 10px; }

        .spl-btn { background: none; border: none; color: #eee; cursor: pointer; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: 0.2s; position: relative; }
        .spl-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .spl-btn svg { width: 22px; height: 22px; }

        /* Volume Slider */
        .spl-vol-wrap { display: flex; align-items: center; width: 36px; transition: width 0.3s ease; overflow: hidden; background: rgba(255,255,255,0); border-radius: 20px; margin-right: 8px; }
        .spl-vol-wrap:hover, .spl-vol-wrap.active { width: 140px; background: rgba(255,255,255,0.1); }
        .spl-vol-slider { width: 0; opacity: 0; margin: 0; height: 4px; appearance: none; background: rgba(255,255,255,0.3); border-radius: 2px; outline: none; transition: 0.2s; cursor: pointer; margin-left: 8px; flex-grow: 1; margin-right: 12px; }
        .spl-vol-wrap:hover .spl-vol-slider, .spl-vol-wrap.active .spl-vol-slider { width: 80px; opacity: 1; }
        .spl-vol-slider::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; background: #fff; border-radius: 50%; cursor: pointer; }

        /* Time Display */
        .spl-time { font-size: 13px; font-weight: 500; color: #ddd; margin-left: 4px; font-variant-numeric: tabular-nums; }

        /* Modal (Modern) */
        .spl-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100000; backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .spl-modal-bg.open { opacity: 1; }
        .spl-modal { background: var(--spl-surface); width: 90%; max-width: 400px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.6); display: flex; flex-direction: column; max-height: 80vh; transform: scale(0.95); transition: transform 0.2s; overflow: hidden; }
        .spl-modal-bg.open .spl-modal { transform: scale(1); }

        .spl-modal-header { padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; }
        .spl-modal-title { font-weight: 600; font-size: 16px; }
        .spl-close-btn { background: none; border: none; color: #888; cursor: pointer; font-size: 20px; line-height: 1; padding: 4px; }
        .spl-close-btn:hover { color: #fff; }

        .spl-list { overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
        .spl-section-title { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 700; letter-spacing: 0.5px; margin: 10px 10px 4px; }

        .spl-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: 0.2s; background: rgba(255,255,255,0.03); border: 1px solid transparent; }
        .spl-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); transform: translateX(2px); }
        .spl-item-left { display: flex; align-items: center; gap: 12px; }
        .spl-res-badge { font-weight: 700; font-size: 13px; background: #333; padding: 2px 6px; border-radius: 4px; color: #eee; min-width: 50px; text-align: center; }
        .spl-item-info { display: flex; flex-direction: column; gap: 2px; }
        .spl-meta { font-size: 12px; color: #888; }

        /* Download Progress State */
        .spl-dl-state { padding: 40px 30px; text-align: center; display: none; flex-direction: column; align-items: center; gap: 15px; }
        .spl-dl-bar-bg { width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden; margin-top: 10px; }
        .spl-dl-bar-fill { height: 100%; width: 0%; background: var(--spl-primary); transition: width 0.2s; border-radius: 4px; }
        .spl-status-text { font-size: 13px; color: #aaa; font-family: monospace; }

        /* Toast Notification */
        .spl-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); background: rgba(20,20,20,0.9); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 30px; font-size: 13px; font-weight: 500; opacity: 0; transition: 0.3s; pointer-events: none; z-index: 100001; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .spl-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    `;
    document.head.appendChild(document.createElement('style')).textContent = css;

    /* ==========================================================================
       2. HELPER FUNCTIONS
       ========================================================================== */
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function extractVimeoVideoId(path) {
        const match = path.match(/^\/(?:[a-zA-Z0-9]+\/)?(\d+)/);
        return match ? match[1] : null;
    }

    function extractVimeoConfig(html) {
        const start = html.indexOf('window.playerConfig = ');
        if (start === -1) throw new Error('playerConfig not found.');
        const jsonStart = html.indexOf('{', start);
        let brace = 1, i = jsonStart + 1;
        for (; i < html.length && brace > 0; i++) {
            if (html[i] === '{') brace++;
            else if (html[i] === '}') brace--;
        }
        return JSON.parse(html.substring(jsonStart, i));
    }

    /* ==========================================================================
       3. DOWNLOAD LOGIC (Preserved)
       ========================================================================== */
    const DownloadLogic = {
        fetch(url, type) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET', url, responseType: type,
                    headers: { 'Referer': 'https://www.patreon.com' },
                    onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.response) : reject(new Error(`HTTP ${r.status}`)),
                    onerror: reject
                });
            });
        },

        async downloadStream(streamUrl, onProgress) {
            const manifest = await this.fetch(streamUrl, 'text');
            const baseUrl = streamUrl.substring(0, streamUrl.lastIndexOf('/') + 1);
            const segments = manifest.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => l.startsWith('http') ? l : baseUrl + l);

            if (!segments.length) throw new Error('No segments found in playlist.');

            const chunks = [];
            for (let i = 0; i < segments.length; i++) {
                const chunk = await this.fetch(segments[i], 'arraybuffer');
                chunks.push(chunk);
                onProgress((i + 1) / segments.length * 100, `Segment ${i + 1}/${segments.length}`);
            }

            return new Blob(chunks, { type: 'video/mp2t' });
        },

        saveBlob(blob, filename) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 5000);
            UI.toast(`Saved: ${filename}`);
        }
    };

    /* ==========================================================================
       4. UI COMPONENTS
       ========================================================================== */
    const UI = {
        el(tag, cls, html) {
            const d = document.createElement(tag);
            if (cls) d.className = cls;
            if (html) d.innerHTML = html;
            return d;
        },

        toast(msg) {
            if (!this.toastEl) {
                this.toastEl = this.el('div', 'spl-toast');
                document.body.appendChild(this.toastEl);
            }
            this.toastEl.textContent = msg;
            this.toastEl.classList.add('show');
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => this.toastEl.classList.remove('show'), 3000);
        },

        createModal() {
            const overlay = this.el('div', 'spl-modal-bg');
            const box = this.el('div', 'spl-modal');

            const header = this.el('div', 'spl-modal-header');
            header.innerHTML = `<span class="spl-modal-title">Download Media</span>`;
            const closeBtn = this.el('button', 'spl-close-btn', '×');
            closeBtn.onclick = () => this.closeModal();
            header.appendChild(closeBtn);

            const list = this.el('div', 'spl-list');

            const progView = this.el('div', 'spl-dl-state');
            progView.innerHTML = `
                <div style="font-weight:600;font-size:16px;">Processing Stream...</div>
                <div class="spl-dl-bar-bg"><div class="spl-dl-bar-fill"></div></div>
                <div id="spl-status-txt" class="spl-status-text">Initializing</div>
            `;

            box.append(header, list, progView);
            overlay.appendChild(box);
            document.body.appendChild(overlay);

            overlay.onclick = (e) => { if(e.target === overlay) this.closeModal(); };
            return { overlay, list, progView };
        },

        openDownloadMenu(title, hls) {
            if (!this.modal) this.modal = this.createModal();
            this.resetModal();
            this.modal.overlay.style.display = 'flex';
            // Trigger reflow
            setTimeout(() => this.modal.overlay.classList.add('open'), 10);
            this.modal.list.innerHTML = '';

            const videoStreams = hls.levels || [];
            const audioStreams = hls.audioTracks || [];

            // Sort highest quality first
            videoStreams.sort((a, b) => b.height - a.height);

            const addItem = (badge, mainText, subText, callback) => {
                const item = this.el('div', 'spl-item');
                item.innerHTML = `
                    <div class="spl-item-left">
                        <span class="spl-res-badge">${badge}</span>
                        <div class="spl-item-info">
                            <span style="font-weight:600;font-size:14px;">${mainText}</span>
                            <span class="spl-meta">${subText}</span>
                        </div>
                    </div>
                    <div style="color:var(--spl-primary);">${ICONS.download}</div>
                `;
                item.onclick = callback;
                this.modal.list.appendChild(item);
            };

            if (videoStreams.length > 0) {
                this.modal.list.appendChild(this.el('div', 'spl-section-title', 'Video Streams (No Audio)'));
                videoStreams.forEach(v => {
                    addItem(`${v.height}p`, `Video Stream`, `High Bitrate • .mp4`, () => {
                        this.startDownloadProcess(`${title}_${v.height}p_video.mp4`, (cb) => DownloadLogic.downloadStream(v.url[0], cb));
                    });
                });
            }

            if (audioStreams.length > 0) {
                this.modal.list.appendChild(this.el('div', 'spl-section-title', 'Audio Streams'));
                audioStreams.forEach(a => {
                    addItem('AUDIO', a.name, 'AAC Audio • .mp4', () => {
                        this.startDownloadProcess(`${title}_${a.name}_audio.mp4`, (cb) => DownloadLogic.downloadStream(a.url, cb));
                    });
                });
            }
        },

        startDownloadProcess(filename, downloadFn) {
            this.modal.list.style.display = 'none';
            this.modal.progView.style.display = 'flex';
            const bar = this.modal.progView.querySelector('.spl-dl-bar-fill');
            const txt = document.getElementById('spl-status-txt');

            downloadFn((pct, statusText) => {
                bar.style.width = pct + '%';
                txt.textContent = statusText || `${Math.round(pct)}%`;
            }).then((blob) => {
                DownloadLogic.saveBlob(blob, filename);
                this.closeModal();
            }).catch(e => {
                alert('Error: ' + e.message);
                this.resetModal();
            });
        },

        resetModal() {
            if (!this.modal) return;
            this.modal.list.style.display = 'flex';
            this.modal.progView.style.display = 'none';
        },

        closeModal() {
            if (this.modal) {
                this.modal.overlay.classList.remove('open');
                setTimeout(() => this.modal.overlay.style.display = 'none', 200);
            }
            this.resetModal();
        }
    };

    /* ==========================================================================
       5. PLAYER BUILDER
       ========================================================================== */
    function buildPlayer(hlsUrl, title) {
        document.body.innerHTML = '';
        const wrap = UI.el('div', 'spl-wrap');
        const video = UI.el('video', 'spl-video');

        // --- Structure ---
        const centerOverlay = UI.el('div', 'spl-center-overlay');
        const bigPlay = UI.el('div', 'spl-big-play', ICONS.play);
        const spinner = UI.el('div', 'spl-big-play spl-spinner', ICONS.spinner);
        centerOverlay.append(bigPlay, spinner);

        const uiLayer = UI.el('div', 'spl-layer');
        const controls = UI.el('div', 'spl-controls');

        // Progress
        const progCont = UI.el('div', 'spl-prog-container');
        const progBg = UI.el('div', 'spl-prog-bg');
        const progBuf = UI.el('div', 'spl-prog-buf');
        const progFill = UI.el('div', 'spl-prog-fill');
        progBg.append(progBuf, progFill);
        progCont.appendChild(progBg);

        // Buttons
        const bar = UI.el('div', 'spl-bar');
        const left = UI.el('div', 'spl-grp');
        const right = UI.el('div', 'spl-grp');

        const btnPlay = UI.el('button', 'spl-btn', ICONS.play);

        // Volume Group
        const volWrap = UI.el('div', 'spl-vol-wrap');
        const btnVol = UI.el('button', 'spl-btn', ICONS.volumeHigh);
        const volSlider = UI.el('input', 'spl-vol-slider');
        volSlider.type = 'range'; volSlider.min = 0; volSlider.max = 1; volSlider.step = 0.05; volSlider.value = 1;
        volWrap.append(btnVol, volSlider);

        const timeDisp = UI.el('div', 'spl-time', '0:00 / 0:00');

        const btnDL = UI.el('button', 'spl-btn', ICONS.download);
        btnDL.title = "Download Streams";
        const btnFS = UI.el('button', 'spl-btn', ICONS.fullscreen);

        left.append(btnPlay, volWrap, timeDisp);
        right.append(btnDL, btnFS);
        bar.append(left, right);

        controls.append(progCont, bar);
        uiLayer.append(controls);
        wrap.append(video, centerOverlay, uiLayer);
        document.body.appendChild(wrap);

        // --- HLS Init ---
        let hls;
        if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true });
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                 // Auto play if preferred, otherwise wait
                 video.play().catch(()=>{});
            });
        } else video.src = hlsUrl;

        // --- Logic ---

        const updatePlayState = () => {
            if (video.paused) {
                btnPlay.innerHTML = ICONS.play;
                bigPlay.innerHTML = ICONS.play;
                bigPlay.style.opacity = 1;
                bigPlay.style.transform = 'scale(1)';
            } else {
                btnPlay.innerHTML = ICONS.pause;
                bigPlay.innerHTML = ICONS.pause;
                bigPlay.style.opacity = 0;
                bigPlay.style.transform = 'scale(1.5)';
            }
        };

        const togglePlay = () => {
            if(video.paused) video.play();
            else video.pause();
        };

        btnPlay.onclick = togglePlay;
        centerOverlay.onclick = (e) => {
            if(e.target === centerOverlay || e.target === bigPlay) togglePlay();
        };

        video.onplay = updatePlayState;
        video.onpause = updatePlayState;
        video.onwaiting = () => { spinner.style.display = 'flex'; bigPlay.style.display = 'none'; };
        video.onplaying = () => { spinner.style.display = 'none'; bigPlay.style.display = 'flex'; updatePlayState(); };

        // Volume
        const updateVolume = () => {
            video.volume = volSlider.value;
            if(video.volume === 0) btnVol.innerHTML = ICONS.volumeMute;
            else btnVol.innerHTML = ICONS.volumeHigh;
        };
        volSlider.oninput = updateVolume;
        btnVol.onclick = () => {
            if (video.volume > 0) {
                video.dataset.prevVol = video.volume;
                video.volume = 0;
                volSlider.value = 0;
            } else {
                video.volume = video.dataset.prevVol || 1;
                volSlider.value = video.volume;
            }
            updateVolume();
        };

        // Time & Progress
        video.ontimeupdate = () => {
            const pct = (video.currentTime / video.duration) * 100;
            progFill.style.width = pct + '%';
            timeDisp.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;

            // Buffer
            if (video.buffered.length) {
                const bufEnd = video.buffered.end(video.buffered.length - 1);
                const bufPct = (bufEnd / video.duration) * 100;
                progBuf.style.width = bufPct + '%';
            }
        };

        progCont.onclick = (e) => {
            const rect = progCont.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        };

        // Fullscreen
        btnFS.onclick = () => {
            if(!document.fullscreenElement) wrap.requestFullscreen();
            else document.exitFullscreen();
        };

        // Download
        btnDL.onclick = () => {
            video.pause();
            if (!hls || !hls.levels) return alert("Stream data not ready.");
            UI.openDownloadMenu(title, hls);
        };

        // UI Hiding
        let timer;
        const showUI = () => {
            uiLayer.classList.remove('fade-out');
            wrap.style.cursor = 'default';
            clearTimeout(timer);
            if(!video.paused) timer = setTimeout(() => {
                uiLayer.classList.add('fade-out');
                wrap.style.cursor = 'none';
            }, 2500);
        };
        wrap.onmousemove = showUI;
        wrap.onclick = showUI;

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Prevent page scrolling
            if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }

            switch(e.code) {
                case 'Space': togglePlay(); showUI(); break;
                case 'ArrowRight': video.currentTime += 5; showUI(); break;
                case 'ArrowLeft': video.currentTime -= 5; showUI(); break;
                case 'ArrowUp':
                    video.volume = Math.min(1, video.volume + 0.1);
                    volSlider.value = video.volume;
                    updateVolume();
                    showUI();
                    break;
                case 'ArrowDown':
                    video.volume = Math.max(0, video.volume - 0.1);
                    volSlider.value = video.volume;
                    updateVolume();
                    showUI();
                    break;
                case 'KeyF': btnFS.click(); break;
            }
        });
    }

    /* ==========================================================================
       6. BOOTSTRAP
       ========================================================================== */
    async function init() {
        // Clean URL if it has a hash suffix (e.g. /12345/abcde -> /12345)
        const hashMatch = location.pathname.match(/^\/(\d+)\/([a-zA-Z0-9]+)$/);
        if (hashMatch) {
            const cleanPath = `/${hashMatch[1]}`;
            window.history.replaceState(null, '', cleanPath);
        }

        const videoId = hashMatch ? hashMatch[1] : extractVimeoVideoId(location.pathname);
        if (!videoId) return;

        // Nice Loading Screen
        document.documentElement.style.background = '#121212';
        document.body.innerHTML = `
            <div style="color:#fff;display:flex;flex-direction:column;height:100vh;justify-content:center;align-items:center;font-family:sans-serif;gap:15px;">
                <div style="width:30px;height:30px;border:3px solid rgba(255,255,255,0.1);border-top-color:#00adef;border-radius:50%;animation:spl-spin 1s infinite linear;"></div>
                <div style="opacity:0.7;font-size:14px;">Loading Stream...</div>
            </div>
            <style>@keyframes spl-spin { to { transform: rotate(360deg); } }</style>
        `;

        try {
            const playerPageHtml = await DownloadLogic.fetch(`https://player.vimeo.com/video/${videoId}`, 'text');
            const cfg = extractVimeoConfig(playerPageHtml);
            if (!cfg) throw new Error('Could not parse Vimeo config.');

            const hlsConfig = cfg.request.files.hls;
            const masterUrl = hlsConfig.cdns[hlsConfig.default_cdn].url;
            const title = (cfg.video.title || `vimeo-${videoId}`).replace(/[^a-z0-9]/gi, '_');

            buildPlayer(masterUrl, title);

        } catch (e) {
            document.body.innerHTML = `<div style="color:#ff4444; padding: 40px; text-align: center; font-family:sans-serif;">
                <h3>Unable to Load Video</h3>
                <p style="color:#888;">${e.message}</p>
                <button onclick="location.reload()" style="margin-top:20px;padding:8px 16px;background:#333;color:#fff;border:none;border-radius:4px;cursor:pointer;">Retry</button>
            </div>`;
            console.error(e);
        }
    }

    init();

})();