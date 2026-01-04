// ==UserScript==
// @name            Starblast Game Recorder
// @name:ru         Starblast Game Recorder
// @namespace       https://greasyfork.org/ru/users/1252274-julia1233
// @version         1.8.8
// @description     Recording + replay via WebSocket simulation with user data protection
// @description:ru  Запись и воспроизведение сессий Starblast.io с защитой данных пользователя
// @author          Julia1233
// @license         GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepage        https://greasyfork.org/ru/scripts/554572-starblast-game-recorder/
// @supportURL      https://greasyfork.org/ru/scripts/554572-starblast-game-recorder/feedback
// @match           https://starblast.io/*
// @grant           none
// @icon            https://starblast.io/static/img/icon64.png
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/554572/Starblast%20Game%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/554572/Starblast%20Game%20Recorder.meta.js
// ==/UserScript==

/*
 * Starblast Game Recorder v1.8.8
 * Copyright (c) 2025 Julia1233
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
    'use strict';

    window.__allWebSockets = [];
    window.__recorderInstance = null;
    window.__playingRecording = null;
    window.__wsListeners = [];
    window.__fakeServerMode = false;
    window.__hideOverlay = false;
    window.__loadedRecording = null;

    const OriginalWebSocket = window.WebSocket;
    const OriginalSend = OriginalWebSocket.prototype.send;
    const OriginalAddEventListener = OriginalWebSocket.prototype.addEventListener;

    OriginalWebSocket.prototype.send = function (data) {
        const recorder = window.__recorderInstance;
        if (recorder && !window.__isPlayingMessage) {
            recorder.recordOutgoingMessage(data);
        }
        return OriginalSend.call(this, data);
    };

    OriginalWebSocket.prototype.addEventListener = function (type, listener, options) {
        if (type === 'message') {
            window.__wsListeners.push({ ws: this, listener: listener });

            const wrappedListener = function (event) {
                const recorder = window.__recorderInstance;
                if (recorder && event.data && !window.__isPlayingMessage) {
                    recorder.recordIncomingMessage(event.data);
                }
                listener.call(this, event);
            };
            return OriginalAddEventListener.call(this, type, wrappedListener, options);
        }
        return OriginalAddEventListener.call(this, type, listener, options);
    };

    let onmessageHandler = null;
    Object.defineProperty(OriginalWebSocket.prototype, 'onmessage', {
        get: function () {
            return onmessageHandler;
        },
        set: function (handler) {
            onmessageHandler = handler;

            if (handler) {
                const wrappedHandler = function (event) {
                    const recorder = window.__recorderInstance;
                    if (recorder && event.data && !window.__isPlayingMessage) {
                        recorder.recordIncomingMessage(event.data);
                    }
                    handler.call(this, event);
                };
                OriginalAddEventListener.call(this, 'message', wrappedHandler);
            }
        },
        enumerable: true,
        configurable: true
    });

    window.WebSocket = function (...args) {
        if (window.__fakeServerMode) {
            console.log('[Recorder] Creating FAKE WebSocket for replay');
            return createFakeWebSocket(args[0]);
        }

        const ws = new OriginalWebSocket(...args);
        window.__allWebSockets.push(ws);
        return ws;
    };

    window.WebSocket.prototype = OriginalWebSocket.prototype;
    Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);

    function createFakeWebSocket(url) {
        const fake = {
            url: url,
            readyState: 0,
            bufferedAmount: 0,
            extensions: '',
            protocol: '',
            binaryType: 'arraybuffer',

            listeners: {
                open: [],
                message: [],
                error: [],
                close: []
            },

            addEventListener: function (type, listener, options) {
                if (this.listeners[type]) {
                    this.listeners[type].push(listener);
                }
            },

            removeEventListener: function (type, listener, options) {
                if (this.listeners[type]) {
                    const idx = this.listeners[type].indexOf(listener);
                    if (idx !== -1) this.listeners[type].splice(idx, 1);
                }
            },

            send: function (data) {
                // Игнорируем отправку
            },

            close: function (code, reason) {
                this.readyState = 3;
                const closeEvent = new CloseEvent('close', {
                    code: code || 1000,
                    reason: reason || '',
                    wasClean: true
                });
                this.listeners.close.forEach(fn => fn.call(this, closeEvent));
                if (this.onclose) this.onclose(closeEvent);
            },

            dispatchEvent: function (event) {
                const type = event.type;
                if (this.listeners[type]) {
                    this.listeners[type].forEach(fn => fn.call(this, event));
                }
                return true;
            }
        };

        setTimeout(() => {
            fake.readyState = 1;
            const openEvent = new Event('open');
            fake.listeners.open.forEach(fn => fn.call(fake, openEvent));
            if (fake.onopen) fake.onopen(openEvent);

            console.log('[FakeWS] Connection opened, starting playback...');

            const recorder = window.__recorderInstance;
            if (recorder && window.__playingRecording) {
                recorder.startAutoPlayback(fake);
            }
        }, 100);

        window.__allWebSockets.push(fake);
        return fake;
    }

    function keepOverlayHidden() {
        if (window.__hideOverlay) {
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.style.display = 'none !important';
            }
        }
        requestAnimationFrame(keepOverlayHidden);
    }
    keepOverlayHidden();

    function sanitizeSensitiveData(str) {
        try {
            const obj = JSON.parse(str);

            if (obj.data) {
                if (obj.data.ecp_key !== undefined) {
                    obj.data.ecp_key = '';
                }
                if (obj.data.key !== undefined) {
                    obj.data.key = '';
                }
                if (obj.data.steamid !== undefined) {
                    obj.data.steamid = null;
                }
            }

            return JSON.stringify(obj);
        } catch (e) {
            return str;
        }
    }

    class GameRecorder {
        constructor() {
            this.isRecording = false;
            this.isPlayback = false;
            this.isPaused = false;
            this.recordedMessages = [];
            this.playbackIndex = 0;
            this.playbackSpeed = 1.0;
            this.autoRecordEnabled = true;
            this.autoStarted = false;
            this.fakeWs = null;
            this.uiVisible = false;
            this.recordingStartTime = null;
            this.isOver100Seconds = false;
            this.mouseInputBlocked = false;

            window.__recorderInstance = this;
            this.loadAutoRecordState();
            this.setupUI();
            this.setupKeyboardShortcuts();
            this.recordMouseMove();
        }

        loadAutoRecordState() {
            const saved = localStorage.getItem('recorder_auto_record');
            if (saved === null) {
                this.autoRecordEnabled = false;
            } else {
                this.autoRecordEnabled = JSON.parse(saved);
            }
        }

        saveAutoRecordState() {
            localStorage.setItem('recorder_auto_record', JSON.stringify(this.autoRecordEnabled));
        }

        recordIncomingMessage(data) {
            const dataInfo = this.identifyData(data);

            if (!this.autoStarted && this.autoRecordEnabled) {
                if (this.shouldAutoStart(data)) {
                    this.autoStarted = true;
                    this.startRecording();
                    const now = new Date();
                    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                    document.getElementById('recording-name').value = `session_${timeStr}`;
                    document.getElementById('record-status').textContent = '🔴 AUTO (↓)';
                }
            }

            if (this.isRecording) {
                this.recordedMessages.push({
                    type: 'in',
                    rawData: data,
                    timestamp: Date.now()
                });
                this.updateRecordStatus();
                this.checkAutoSave();
            }
        }

        recordOutgoingMessage(data) {
            const dataInfo = this.identifyData(data);

            if (!this.autoStarted && this.autoRecordEnabled) {
                if (this.shouldAutoStart(data)) {
                    this.autoStarted = true;
                    this.startRecording();
                    const now = new Date();
                    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                    document.getElementById('recording-name').value = `session_${timeStr}`;
                    document.getElementById('record-status').textContent = '🔴 AUTO (↑)';
                }
            }

            if (this.isRecording) {
                this.recordedMessages.push({
                    type: 'out',
                    rawData: data,
                    timestamp: Date.now()
                });
                this.updateRecordStatus();
                this.checkAutoSave();
            }
        }

        checkAutoSave() {
            if (!this.isRecording || !this.recordingStartTime) return;
            if (this.recordedMessages.length === 0) return;

            const currentTime = this.recordedMessages[this.recordedMessages.length - 1].timestamp;
            const baseTime = this.recordedMessages[0].timestamp;
            const duration = (currentTime - baseTime) / 1000;

            if (duration >= 100 && !this.isOver100Seconds) {
                this.isOver100Seconds = true;
                document.getElementById('record-status').textContent = '⚠️ 100s! File only';
                document.getElementById('btn-save').style.background = '#ff6600';
            }
        }

        identifyData(data) {
            if (data instanceof Blob) {
                return { type: 'Blob', size: data.size };
            } else if (data instanceof ArrayBuffer) {
                return { type: 'ArrayBuffer', size: data.byteLength };
            } else if (ArrayBuffer.isView(data)) {
                return { type: 'TypedArray', size: data.byteLength };
            } else if (typeof data === 'string') {
                return { type: 'string', size: data.length };
            }
            return { type: 'unknown', size: 0 };
        }

        async serializeDataAsync(data) {
            if (data instanceof Blob) {
                const arrayBuffer = await data.arrayBuffer();
                return {
                    type: 'buffer',
                    value: Array.from(new Uint8Array(arrayBuffer))
                };
            } else if (data instanceof ArrayBuffer) {
                return {
                    type: 'buffer',
                    value: Array.from(new Uint8Array(data))
                };
            } else if (ArrayBuffer.isView(data)) {
                return {
                    type: 'buffer',
                    value: Array.from(data)
                };
            } else if (typeof data === 'string') {
                const sanitized = sanitizeSensitiveData(data);
                return {
                    type: 'string',
                    value: sanitized
                };
            }
            return {
                type: 'string',
                value: String(data)
            };
        }

        deserializeData(serialized) {
            if (serialized.type === 'buffer') {
                const arrayBuffer = new Uint8Array(serialized.value).buffer;
                return new Blob([arrayBuffer]);
            }
            return serialized.value;
        }

        shouldAutoStart(data) {
            if (data instanceof Blob || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                return true;
            }
            if (typeof data === 'string') {
                const lower = data.toLowerCase();
                if (lower === 'ping' || lower === 'pong' || data === '2' || data === '3') return false;
                return data.length >= 5;
            }
            return false;
        }

        setupUI() {
            const container = document.createElement('div');
            container.id = 'recorder-ui';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.95);
                padding: 15px;
                border-radius: 8px;
                border: 2px solid #00ff00;
                font-family: 'Play';
                color: #0f0;
                min-width: 320px;
                max-width: 400px;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                display: none;
            `;

            container.innerHTML = `
                <div style="font-weight: bold; color: #0f0; font-size: 14px; margin-bottom: 10px;">🎮 RECORDER v1.8.8 (Shift+R)</div>
                
                <div style="border-bottom: 1px solid #0f0; margin: 10px 0; padding: 10px 0;">
                    <div style="font-size: 12px; margin-bottom: 8px;">📝 RECORDING:</div>
                    <div style="display: flex; gap: 5px;">
                        <button id="btn-record" style="flex: 1; padding: 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">⚫ START</button>
                        <button id="btn-stop" disabled style="flex: 1; padding: 8px; background: #333; color: #0f0; border: 1px solid #0f0; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">⏹ STOP</button>
                    </div>
                    <div style="display: flex; gap: 5px; align-items: center; margin: 8px 0;">
                        <input type="checkbox" id="auto-record" style="width: 18px; height: 18px;">
                        <label for="auto-record" style="font-size: 11px; cursor: pointer;">🔄 Auto</label>
                    </div>
                    <input type="text" id="recording-name" placeholder="session_name" style="width: 95.5%; padding: 6px; margin: 5px 0; border: 1px solid #0f0; border-radius: 4px; background: #111; color: #0f0; font-family: monospace; font-size: 11px;">
                    <button id="btn-save" disabled style="width: 100%; padding: 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">💾 SAVE</button>
                    <div id="record-status" style="margin-top: 8px; font-size: 10px; color: #0f0; text-align: center;">Ready</div>
                </div>

                <div style="border-bottom: 1px solid #0f0; margin: 10px 0; padding: 10px 0;">
                    <div style="font-size: 12px; margin-bottom: 8px;">▶ PLAYBACK:</div>
                    
                    <div style="display: flex; gap: 5px; margin: 8px 0;">
                        <button id="btn-import" style="flex: 1; padding: 8px; background: #00ff00; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">📥 IMPORT</button>
                        <button id="btn-replay" disabled style="flex: 1; padding: 8px; background: #ff8800; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">🎬 REPLAY</button>
                    </div>

                    <div style="display: flex; gap: 5px; margin: 8px 0;">
                        <button id="btn-pause" disabled style="flex: 1; padding: 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">⏸ PAUSE</button>
                        <button id="btn-stop-play" disabled style="flex: 1; padding: 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">⏹ STOP</button>
                    </div>

                    <div style="display: flex; gap: 5px; align-items: center; font-size: 10px;">
                        <label style="flex: 1;">Speed:</label>
                        <input type="range" id="speed-control" min="0.25" max="4" step="0.25" value="1" style="flex: 2;">
                        <span id="speed-display" style="width: 35px;">1x</span>
                    </div>

                    <div style="margin-top: 8px;">
                        <input type="range" id="timeline-scrubber" min="0" max="100" value="0" style="width: 100%; height: 4px;">
                        <div id="playback-time" style="font-size: 9px; color: #0f0; text-align: center; margin-top: 4px;">0s / 0s</div>
                    </div>

                    <div id="playback-info" style="margin-top: 8px; font-size: 9px; color: #888; padding: 8px; background: #111; border-radius: 4px; max-height: 60px; overflow-y: auto;">No recording loaded</div>
                </div>
            `;
            document.body.appendChild(container);
            document.getElementById('auto-record').checked = this.autoRecordEnabled;
            this.setupEventListeners();
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.shiftKey && (e.code === 'KeyR' || (e.key && e.key.toLowerCase() === 'r'))) {
                    e.preventDefault();
                    this.toggleUI();
                }
            });
        }

        toggleUI() {
            this.uiVisible = !this.uiVisible;
            const container = document.getElementById('recorder-ui');

            if (this.uiVisible) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        }

        setupEventListeners() {
            document.getElementById('btn-record').addEventListener('click', () => this.startRecording());
            document.getElementById('btn-stop').addEventListener('click', () => this.stopRecording());
            document.getElementById('btn-save').addEventListener('click', () => this.saveRecording());
            document.getElementById('btn-import').addEventListener('click', () => this.importRecording());
            document.getElementById('btn-replay').addEventListener('click', () => this.startReplayMode());
            document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
            document.getElementById('btn-stop-play').addEventListener('click', () => this.stopPlayback());

            document.getElementById('auto-record').addEventListener('change', (e) => {
                this.autoRecordEnabled = e.target.checked;
                this.saveAutoRecordState();
                this.autoStarted = false;
                document.getElementById('record-status').textContent = e.target.checked ? 'Auto Ready' : 'Auto OFF';
            });

            document.getElementById('speed-control').addEventListener('input', (e) => {
                this.playbackSpeed = parseFloat(e.target.value);
                document.getElementById('speed-display').textContent = this.playbackSpeed.toFixed(2) + 'x';
            });

            document.getElementById('timeline-scrubber').addEventListener('input', (e) => {
                if (!this.isPlayback) return;
                const percent = parseFloat(e.target.value) / 100;
                this.seekTo(percent);
            });
        }

        startRecording() {
            if (this.isRecording) return;
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            this.recordedMessages = [];
            this.isOver100Seconds = false;
            document.getElementById('btn-record').disabled = true;
            document.getElementById('btn-stop').disabled = false;
            document.getElementById('btn-save').disabled = true;
            document.getElementById('btn-save').style.background = '#0f0';
        }

        recordMouseMove() {
            document.addEventListener('mousemove', (e) => {
                if (this.isRecording && !window.__isPlayingMessage) {
                    this.recordedMessages.push({
                        type: 'mousemove',
                        clientX: e.clientX,
                        clientY: e.clientY,
                        w: window.innerWidth,
                        h: window.innerHeight,
                        timestamp: Date.now()
                    });
                    this.updateRecordStatus();
                }
            });
        }

        stopRecording() {
            if (!this.isRecording) return;
            this.isRecording = false;
            document.getElementById('btn-record').disabled = false;
            document.getElementById('btn-stop').disabled = true;
            document.getElementById('btn-save').disabled = false;

            if (this.recordedMessages.length === 0) {
                document.getElementById('record-status').textContent = '⚠️ No data';
                return;
            }

            const inCount = this.recordedMessages.filter(m => m.type === 'in').length;
            const outCount = this.recordedMessages.filter(m => m.type === 'out').length;
            const baseTime = this.recordedMessages[0].timestamp;
            const lastTime = this.recordedMessages[this.recordedMessages.length - 1].timestamp;
            const duration = (lastTime - baseTime) / 1000;

            document.getElementById('record-status').textContent = `✅ ↓${inCount} ↑${outCount} | ${duration.toFixed(1)}s`;
        }

        async saveRecording() {
            const name = document.getElementById('recording-name').value.trim() || 'unnamed';
            if (this.recordedMessages.length === 0) {
                alert('Nothing to save!');
                return;
            }

            try {
                const serializedMessages = [];
                for (const msg of this.recordedMessages) {
                    let serialized;

                    if (msg.type === 'mousemove') {
                        serialized = {
                            t: 'm',
                            x: msg.clientX,
                            y: msg.clientY,
                            w: msg.w,
                            h: msg.h
                        };
                    } else {
                        serialized = await this.serializeDataAsync(msg.rawData);
                        serialized.t = msg.type;
                    }

                    serializedMessages.push({
                        ...serialized,
                        r: msg.timestamp - this.recordedMessages[0].timestamp
                    });
                }

                const recordingData = {
                    n: name,
                    m: serializedMessages,
                    d: serializedMessages[serializedMessages.length - 1].r,
                    c: serializedMessages.length,
                    v: 1
                };

                const json = JSON.stringify(recordingData);
                console.log(`[Recorder] File size: ${(json.length / 1024).toFixed(2)} KB`);

                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${name}_${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);

                document.getElementById('record-status').textContent = '✅ Saved!';
                document.getElementById('recording-name').value = '';
                document.getElementById('btn-save').style.background = '#0f0';
                this.recordedMessages = [];
                this.isOver100Seconds = false;
                this.autoStarted = false;

                setTimeout(() => {
                    document.getElementById('record-status').textContent = 'Ready';
                }, 1500);

            } catch (err) {
                console.error('[Recorder] Error:', err);
                document.getElementById('record-status').textContent = '❌ Error!';
            }
        }

        startReplayMode() {
            if (!window.__loadedRecording) {
                alert('Import a recording first!');
                return;
            }

            window.__playingRecording = window.__loadedRecording;
            window.__fakeServerMode = true;
            window.__hideOverlay = true;

            alert('Replay mode activated!\n\nNow join the game - it will replay the recording.\n\nRefresh the page after playback ends.');

            document.getElementById('playback-info').textContent = '🎬 REPLAY MODE ACTIVE';
        }

        startAutoPlayback(fakeWs) {
            this.fakeWs = fakeWs;
            this.isPlayback = true;
            this.isPaused = false;
            this.playbackIndex = 0;
            this.playbackStartTime = Date.now();
            this.mouseInputBlocked = false;

            this.blockUserMouseInput();

            document.getElementById('btn-pause').disabled = false;
            document.getElementById('btn-stop-play').disabled = false;

            this.playNextMessage();
        }

        playNextMessage() {
            if (!this.isPlayback || !window.__playingRecording) return;

            const messages = window.__playingRecording.messages;

            if (this.playbackIndex >= messages.length) {
                this.stopPlayback();
                return;
            }

            if (this.isPaused) {
                setTimeout(() => this.playNextMessage(), 50);
                return;
            }

            const currentMsg = messages[this.playbackIndex];
            const nextMsg = messages[this.playbackIndex + 1];

            const elapsedTime = (Date.now() - this.playbackStartTime) / this.playbackSpeed;
            const msgTime = currentMsg.relativeTime;

            if (elapsedTime >= msgTime) {
                if (currentMsg.type === 'm') {
                    this.replayMouseMove(
                        currentMsg.clientX,
                        currentMsg.clientY,
                        currentMsg.w || 1920,
                        currentMsg.h || 1080
                    );
                }
                if (currentMsg.type === 'in') {
                    this.deliverMessage(currentMsg);
                }

                this.playbackIndex++;
                this.updatePlaybackUI(window.__playingRecording);

                setTimeout(() => this.playNextMessage(), 0);
            } else {
                const delay = nextMsg
                    ? Math.max(1, (nextMsg.relativeTime - msgTime) / this.playbackSpeed)
                    : 16;
                setTimeout(() => this.playNextMessage(), Math.min(delay, 100));
            }
        }

        deliverMessage(msgData) {
            window.__isPlayingMessage = true;

            const data = this.deserializeData(msgData.data);

            if (this.fakeWs) {
                const event = new MessageEvent('message', {
                    data: data,
                    bubbles: false,
                    cancelable: false
                });

                this.fakeWs.listeners.message.forEach(fn => fn.call(this.fakeWs, event));
                if (this.fakeWs.onmessage) this.fakeWs.onmessage(event);
            } else {
                window.__wsListeners.forEach(item => {
                    try {
                        const event = new MessageEvent('message', {
                            data: data,
                            bubbles: false,
                            cancelable: false
                        });
                        item.listener.call(item.ws, event);
                    } catch (e) {
                        console.error('[Recorder] Error in listener:', e);
                    }
                });

                window.__allWebSockets.forEach(ws => {
                    try {
                        if (ws.onmessage) {
                            const event = new MessageEvent('message', {
                                data: data,
                                bubbles: false,
                                cancelable: false
                            });
                            ws.onmessage(event);
                        }
                    } catch (e) { }
                });
            }

            window.__isPlayingMessage = false;
        }

        replayMouseMove(clientX, clientY, recordedWidth, recordedHeight) {
            try {
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;

                const scaleX = recordedWidth > 0 ? currentWidth / recordedWidth : 1;
                const scaleY = recordedHeight > 0 ? currentHeight / recordedHeight : 1;

                const scaledX = clientX * scaleX;
                const scaledY = clientY * scaleY;

                const moveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: scaledX,
                    clientY: scaledY,
                    screenX: scaledX,
                    screenY: scaledY
                });

                document.dispatchEvent(moveEvent);

                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.dispatchEvent(moveEvent);
                }
            } catch (e) {
                console.error('[Recorder] Error replaying mouse move:', e);
            }
        }

        blockUserMouseInput() {
            if (this.mouseInputBlocked) return;
            this.mouseInputBlocked = true;

            const blockHandler = (e) => {
                if (e.isTrusted) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            };

            document.addEventListener('mousemove', blockHandler, true);
            document.addEventListener('mousedown', blockHandler, true);
            document.addEventListener('mouseup', blockHandler, true);

            this.mouseBlockHandlers = {
                handler: blockHandler,
                events: ['mousemove', 'mousedown', 'mouseup']
            };
        }

        unblockUserMouseInput() {
            if (!this.mouseInputBlocked) return;
            this.mouseInputBlocked = false;

            if (this.mouseBlockHandlers) {
                this.mouseBlockHandlers.events.forEach(event => {
                    document.removeEventListener(event, this.mouseBlockHandlers.handler, true);
                });
                this.mouseBlockHandlers = null;
            }
        }

        updatePlaybackUI(recordingData) {
            const msgs = recordingData.messages;
            if (this.playbackIndex === 0) return;

            const currentMsg = msgs[this.playbackIndex - 1];
            const progress = (currentMsg.relativeTime / recordingData.totalDuration) * 100;

            document.getElementById('timeline-scrubber').value = progress;

            const currentSec = (currentMsg.relativeTime / 1000).toFixed(1);
            const totalSec = (recordingData.totalDuration / 1000).toFixed(1);
            document.getElementById('playback-time').textContent = `${currentSec}s / ${totalSec}s`;
        }

        togglePause() {
            this.isPaused = !this.isPaused;
            const btn = document.getElementById('btn-pause');
            btn.textContent = this.isPaused ? '▶ RES' : '⏸ PAU';
            btn.style.background = this.isPaused ? '#ff8800' : '#0f0';
        }

        stopPlayback() {
            this.isPlayback = false;
            this.isPaused = false;
            window.__playingRecording = null;
            window.__fakeServerMode = false;
            window.__hideOverlay = false;

            this.unblockUserMouseInput();

            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.style.display = 'block';
            }

            document.getElementById('btn-pause').disabled = true;
            document.getElementById('btn-stop-play').disabled = true;
            document.getElementById('btn-pause').textContent = '⏸ PAUSE';
            document.getElementById('btn-pause').style.background = '#0f0';
            document.getElementById('timeline-scrubber').value = 0;
            document.getElementById('playback-time').textContent = '0s / 0s';

            if (this.fakeWs) {
                this.fakeWs.close();
                this.fakeWs = null;
            }
        }

        seekTo(percent) {
            if (!window.__loadedRecording) return;
            const data = window.__loadedRecording;
            const targetTime = data.totalDuration * percent;

            this.playbackIndex = data.messages.findIndex(m => m.relativeTime >= targetTime);
            if (this.playbackIndex < 0) this.playbackIndex = 0;

            this.playbackStartTime = Date.now() - (targetTime / this.playbackSpeed);
        }

        importRecording() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const recordingData = JSON.parse(event.target.result);

                        const data = {
                            name: recordingData.n || recordingData.name || 'imported',
                            messages: recordingData.m || recordingData.messages || [],
                            totalDuration: recordingData.d || recordingData.totalDuration || 0,
                            messageCount: recordingData.c || recordingData.messageCount || 0,
                            version: recordingData.v || 1
                        };

                        if (!data.messages || data.messages.length === 0) {
                            alert('Invalid recording file!');
                            return;
                        }

                        data.messages = data.messages.map(msg => {
                            const normalized = {
                                type: msg.t || msg.type,
                                relativeTime: msg.r || msg.relativeTime || 0
                            };

                            if (msg.t === 'm' || msg.type === 'mousemove') {
                                normalized.clientX = msg.x;
                                normalized.clientY = msg.y;
                                normalized.w = msg.w || 1920;
                                normalized.h = msg.h || 1080;
                            } else {
                                normalized.data = msg.data || msg;
                            }

                            return normalized;
                        });

                        window.__loadedRecording = data;
                        document.getElementById('btn-replay').disabled = false;
                        document.getElementById('playback-info').textContent = `📹 ${data.name}\n⏱ ${(data.totalDuration / 1000).toFixed(1)}s | ${data.messageCount} msg`;

                        alert(`✅ Imported: ${data.name}`);
                    } catch (err) {
                        console.error('[Recorder] Import error:', err);
                        alert('Error importing file: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };

            input.click();
        }

        updateRecordStatus() {
            if (!this.isRecording) return;
            const inCount = this.recordedMessages.filter(m => m.type === 'in').length;
            const outCount = this.recordedMessages.filter(m => m.type === 'out').length;
            const mouseCount = this.recordedMessages.filter(m => m.type === 'mousemove').length;
            const baseTime = this.recordedMessages[0].timestamp;
            const lastTime = this.recordedMessages[this.recordedMessages.length - 1].timestamp;
            const dur = (lastTime - baseTime) / 1000;
            document.getElementById('record-status').textContent = `🔴 ↓${inCount} ↑${outCount} 🖱${mouseCount} | ${dur.toFixed(1)}s`;
        }
    }

    window.__gameRecorder = new GameRecorder();
    console.log('[Recorder] v1.8.8 - Mouse recording & replay system');
})();
