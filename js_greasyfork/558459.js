// ==UserScript==
// @name         CCFOLIA Board Exporter
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  ココフォリアの盤面をUI非表示で高解像度保存するツール。GIF/APNG/WebP対応。
// @author       むらひと
// @match        https://ccfolia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccfolia.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/upng-js/2.1.0/UPNG.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558459/CCFOLIA%20Board%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/558459/CCFOLIA%20Board%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定 & 定数
    // ==========================================
    const CONFIG = {
        BUTTON_ID: 'ccfolia-board-export-btn',
        CONCURRENCY_LIMIT: 4,
        MIN_SCALE: 0.01,
        MAX_SCALE: 50.0,
        PADDING_RATIO: 0.05
    };

    const BASE_RESOLUTIONS = [
        { key: 'FHD', width: 1920, height: 1080, label: 'FHD (1080p)' },
        { key: '2K',  width: 2560, height: 1440, label: '2K (1440p)' },
        { key: '3K',  width: 3200, height: 1800, label: '3K (1800p)' },
        { key: '4K',  width: 3840, height: 2160, label: '4K (2160p)' },
        { key: '5K',  width: 5120, height: 2880, label: '5K (2880p)' },
        { key: '6K',  width: 5760, height: 3240, label: '6K (3240p)' },
        { key: '7K',  width: 6720, height: 3780, label: '7K (3780p)' },
        { key: '8K',  width: 7680, height: 4320, label: '8K (4320p)' }
    ];

    const PREVIEW_SETTINGS = { width: 640, height: 480 };
    const BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

    // ==========================================
    // Core: Timer Worker & Visibility Spoofing
    // ==========================================
    const workerBlob = new Blob([`
        self.onmessage = function(e) {
            setTimeout(function() { self.postMessage('tick'); }, e.data);
        };
    `], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(workerBlob);
    const timerWorker = new Worker(workerUrl);

    const wait = (ms) => new Promise(resolve => {
        const handler = () => {
            timerWorker.removeEventListener('message', handler);
            resolve();
        };
        timerWorker.addEventListener('message', handler);
        timerWorker.postMessage(ms);
    });

    function spoofVisibility() {
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            const blockEvent = (e) => e.stopImmediatePropagation();
            document.addEventListener('visibilitychange', blockEvent, true);
            document.addEventListener('webkitvisibilitychange', blockEvent, true);
            window.addEventListener('blur', blockEvent, true);
        } catch (e) {
            console.warn("Visibility spoofing warning:", e);
        }
    }

    // ==========================================
    // Core: GIF Parsing Worker
    // ==========================================
    const gifWorkerSource = `
    class FastGifParser {
        constructor(buffer) {
            this.buffer = new Uint8Array(buffer);
            this.view = new DataView(buffer);
            this.pos = 0;
        }

        readByte() {
            if (this.pos >= this.buffer.length) throw new Error('Unexpected EOF');
            return this.buffer[this.pos++];
        }

        readBytes(len) {
            if (this.pos + len > this.buffer.length) throw new Error('Unexpected EOF');
            const s = this.buffer.subarray(this.pos, this.pos + len);
            this.pos += len;
            return s;
        }

        readInt16() {
            const v = this.view.getUint16(this.pos, true);
            this.pos += 2;
            return v;
        }

        skip(len) {
            this.pos += len;
        }

        parse() {
            const sig = String.fromCharCode(...this.readBytes(3));
            if (sig !== 'GIF') throw new Error('Not GIF');
            this.skip(3);

            const width = this.readInt16();
            const height = this.readInt16();
            const packed = this.readByte();
            const gctFlag = (packed & 0x80) !== 0;
            const gctSize = 1 << ((packed & 0x07) + 1);
            this.skip(2);

            let gct = null;
            if (gctFlag) {
                gct = this.readBytes(3 * gctSize);
            }

            const frames = [];
            let loopCount = 0;
            let gce = null;

            while (this.pos < this.buffer.length) {
                const blockId = this.readByte();

                if (blockId === 0x2C) {
                    const frame = this.parseImage(width, height, gct, gce);
                    frames.push(frame);
                    gce = null;
                } else if (blockId === 0x21) {
                    const extCode = this.readByte();
                    if (extCode === 0xF9) {
                        this.skip(1);
                        const packed = this.readByte();
                        const disposal = (packed >> 2) & 0x07;
                        const transparentFlag = (packed & 0x01) !== 0;
                        const delay = this.readInt16() * 10;
                        const transparentIndex = this.readByte();
                        this.skip(1);
                        gce = { disposal, delay, transparentFlag, transparentIndex };
                    } else if (extCode === 0xFF) {
                        this.skip(1);
                        const app = String.fromCharCode(...this.readBytes(11));
                        if (app === 'NETSCAPE2.0') {
                            this.skip(2);
                            loopCount = this.readInt16();
                            this.skip(1);
                        } else {
                            this.skipBlock();
                        }
                    } else {
                        this.skipBlock();
                    }
                } else if (blockId === 0x3B) {
                    break;
                } else {
                    throw new Error('Unknown block');
                }
            }
            return { width, height, loopCount, frames };
        }

        skipBlock() {
            while (true) {
                const len = this.readByte();
                if (len === 0) break;
                this.pos += len;
            }
        }

        parseImage(globalW, globalH, globalLct, gce) {
            const left = this.readInt16();
            const top = this.readInt16();
            const width = this.readInt16();
            const height = this.readInt16();
            const packed = this.readByte();
            const lctFlag = (packed & 0x80) !== 0;
            const interlaced = (packed & 0x40) !== 0;
            const lctSize = 1 << ((packed & 0x07) + 1);

            let lct = null;
            if (lctFlag) lct = this.readBytes(3 * lctSize);

            const activePalette = lct || globalLct;
            if (!activePalette) throw new Error('No palette');

            const minCodeSize = this.readByte();

            const chunks = [];
            let totalLen = 0;
            while(true) {
                const len = this.readByte();
                if (len === 0) break;
                chunks.push(this.buffer.subarray(this.pos, this.pos + len));
                this.pos += len;
                totalLen += len;
            }

            const combined = new Uint8Array(totalLen);
            let offset = 0;
            for(const c of chunks) { combined.set(c, offset); offset += c.length; }

            const indices = this.lzwDecode(minCodeSize, combined, width * height);
            const rgba = new Uint8ClampedArray(width * height * 4);
            const transparentIndex = (gce && gce.transparentFlag) ? gce.transparentIndex : -1;

            if (interlaced) {
                const passOffsets = [0, 4, 2, 1];
                const passSteps = [8, 8, 4, 2];
                let idx = 0;
                for (let pass = 0; pass < 4; pass++) {
                    for (let y = passOffsets[pass]; y < height; y += passSteps[pass]) {
                        for (let x = 0; x < width; x++) {
                            const colorIndex = indices[idx++];
                            this.writeColor(rgba, (y * width + x) * 4, colorIndex, activePalette, transparentIndex);
                        }
                    }
                }
            } else {
                for (let i = 0; i < width * height; i++) {
                    this.writeColor(rgba, i * 4, indices[i], activePalette, transparentIndex);
                }
            }

            return {
                pixels: rgba,
                left, top, width, height,
                delay: gce ? gce.delay : 100,
                disposal: gce ? gce.disposal : 0
            };
        }

        writeColor(out, pos, index, palette, transIndex) {
            if (index === transIndex) {
                out[pos] = 0; out[pos+1] = 0; out[pos+2] = 0; out[pos+3] = 0;
            } else {
                const pIdx = index * 3;
                out[pos] = palette[pIdx];
                out[pos+1] = palette[pIdx+1];
                out[pos+2] = palette[pIdx+2];
                out[pos+3] = 255;
            }
        }

        lzwDecode(minCodeSize, data, pixelCount) {
            const clearCode = 1 << minCodeSize;
            const endCode = clearCode + 1;
            const MAX_DICT = 4096;
            const prefix = new Int32Array(MAX_DICT);
            const suffix = new Uint8Array(MAX_DICT);
            const pixelStack = new Uint8Array(MAX_DICT + 1);

            let codeSize = minCodeSize + 1;
            let codeMask = (1 << codeSize) - 1;
            let availableCode = endCode + 1;
            let oldCode = -1;
            let top = 0;
            const output = new Uint8Array(pixelCount);
            let outPos = 0;
            let bitPos = 0;
            let bytePos = 0;
            let datum = 0;
            let bits = 0;

            for (let i = 0; i < clearCode; i++) { prefix[i] = -1; suffix[i] = i; }

            while (outPos < pixelCount) {
                if (top === 0) {
                    if (bits < codeSize) {
                        if (bytePos >= data.length) break;
                        datum += data[bytePos++] << bits;
                        bits += 8;
                        continue;
                    }
                    let code = datum & codeMask;
                    datum >>= codeSize;
                    bits -= codeSize;
                    if (code > availableCode || code === endCode) break;

                    if (code === clearCode) {
                        codeSize = minCodeSize + 1;
                        codeMask = (1 << codeSize) - 1;
                        availableCode = endCode + 1;
                        oldCode = -1;
                        continue;
                    }
                    if (oldCode === -1) {
                        pixelStack[top++] = suffix[code];
                        oldCode = code;
                        continue;
                    }
                    const inCode = code;
                    if (code === availableCode) {
                        pixelStack[top++] = suffix[oldCode];
                        code = oldCode;
                    }
                    while (code > clearCode) {
                        pixelStack[top++] = suffix[code];
                        code = prefix[code];
                    }
                    const firstChar = suffix[code];
                    pixelStack[top++] = suffix[code];

                    if (availableCode < MAX_DICT) {
                        prefix[availableCode] = oldCode;
                        suffix[availableCode] = firstChar;
                        availableCode++;
                        if ((availableCode & codeMask) === 0 && availableCode < MAX_DICT) {
                            codeSize++;
                            codeMask += availableCode;
                        }
                    }
                    oldCode = inCode;
                }
                top--;
                output[outPos++] = pixelStack[top];
            }
            return output;
        }
    }
    self.onmessage = function(e) {
        try {
            const parser = new FastGifParser(e.data.buffer);
            const result = parser.parse();
            const transfers = result.frames.map(f => f.pixels.buffer);
            self.postMessage({ success: true, result }, transfers);
        } catch(err) {
            self.postMessage({ success: false, error: err.message });
        }
    };
    `;

    class WorkerManager {
        constructor() {
            const blob = new Blob([gifWorkerSource], { type: 'application/javascript' });
            this.url = URL.createObjectURL(blob);
        }
        async decodeGif(buffer) {
            return new Promise((resolve, reject) => {
                const worker = new Worker(this.url);
                worker.onmessage = (e) => {
                    worker.terminate();
                    if (e.data.success) resolve(e.data.result);
                    else reject(new Error(e.data.error));
                };
                worker.onerror = (e) => { worker.terminate(); reject(e); };
                worker.postMessage({ buffer }, [buffer]);
            });
        }
    }
    const gifWorkerManager = new WorkerManager();


    // ==========================================
    // UI Styles
    // ==========================================
    const CAMERA_ICON_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: inherit;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
    const REFRESH_ICON_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`;

    function createStyles() {
        if (document.getElementById('ccfolia-board-exporter-style')) return;
        const style = document.createElement('style');
        style.id = 'ccfolia-board-exporter-style';
        style.innerHTML = `
            #${CONFIG.BUTTON_ID} { background: transparent; border: none; cursor: pointer; padding: 8px; color: rgba(255, 255, 255, 0.6); transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
            #${CONFIG.BUTTON_ID}:hover { color: #fff; transform: scale(1.1); }
            #ccfolia-export-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(18, 18, 18, 0.92); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ececec; font-family: "Helvetica Neue", Arial, sans-serif; backdrop-filter: blur(4px); }
            .ccfolia-modal-content { background: #252525; padding: 32px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.6); border: 1px solid #333; display: flex; flex-direction: column; }
            .ccfolia-modal-header { font-size: 1.3em; font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #3a3a3a; padding-bottom: 16px; text-align: center; letter-spacing: 0.05em; color: #fff; }
            .ccfolia-preview-box { width: 100%; height: 200px; background: #111; border: 1px solid #444; border-radius: 6px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
            #ccfolia-preview-img { max-width: 100%; max-height: 100%; object-fit: contain; display: none; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            .ccfolia-loader { border: 4px solid #333; border-top: 4px solid #1a73e8; border-radius: 50%; width: 30px; height: 30px; animation: ccfolia-spin 1s linear infinite; }
            @keyframes ccfolia-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .ccfolia-preview-label { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px; font-size: 0.7em; color: #aaa; pointer-events: none; }
            .ccfolia-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; width: 100%; }
            .ccfolia-btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; font-size: 0.9em; transition: all 0.2s; }
            .ccfolia-btn-secondary { background: transparent; color: #aaa; border: 1px solid #444; }
            .ccfolia-btn-secondary:hover { background: #333; color: #fff; border-color: #666; }
            .ccfolia-btn-primary { background: #1a73e8; color: white; border: 1px solid #1a73e8; box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3); }
            .ccfolia-btn-primary:hover { background: #1557b0; box-shadow: 0 4px 12px rgba(26, 115, 232, 0.5); }
            .ccfolia-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(100%); }
            .ccfolia-status-box { margin-top: 12px; padding: 10px; background: #1a1a1a; border-radius: 6px; color: #a8d1ff; font-size: 0.85em; text-align: center; min-height: 20px; border-left: 3px solid #1a73e8; display: flex; align-items: center; justify-content: center; line-height: 1.4; white-space: pre-wrap; }
            .ccfolia-option-row { margin-bottom: 12px; display: flex; flex-direction: row; gap: 16px; align-items: flex-end; }
            .ccfolia-select-group { display: flex; flex-direction: column; gap: 6px; flex: 1; }
            .ccfolia-select-group label { font-size: 0.85em; color: #bbb; font-weight: 500; }
            .ccfolia-select, .ccfolia-input { background: #333; color: #ececec; border: 1px solid #555; padding: 10px 12px; border-radius: 6px; font-size: 0.95em; cursor: pointer; outline: none; width: 100%; transition: border-color 0.2s; box-sizing: border-box; }
            .ccfolia-select:hover, .ccfolia-input:hover { border-color: #777; }
            .ccfolia-select:focus, .ccfolia-input:focus { border-color: #1a73e8; }
            .ccfolia-input-wrapper { display: flex; gap: 8px; align-items: stretch; }
            #ccfolia-refresh-btn { background: #333; border: 1px solid #555; color: #ececec; border-radius: 6px; padding: 0 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; min-width: 44px; }
            #ccfolia-refresh-btn:hover { background: #444; border-color: #777; color: #fff; }
            #ccfolia-refresh-btn:disabled { opacity: 0.5; cursor: wait; }
            .ccfolia-note { font-size: 0.8em; color: #888; line-height: 1.5; margin-top: 4px; }
            .ccfolia-note strong { color: #aaa; font-weight: normal; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // WebP Parser
    // ==========================================
    class WebPParser {
        static isWebP(buffer) {
            if (!buffer || buffer.byteLength < 12) return false;
            const u8 = new Uint8Array(buffer, 0, 12);
            return (u8[0] === 0x52 && u8[1] === 0x49 && u8[2] === 0x46 && u8[3] === 0x46 && u8[8] === 0x57 && u8[9] === 0x45 && u8[10] === 0x42 && u8[11] === 0x50);
        }

        static parse(buffer) {
            const view = new DataView(buffer);
            let offset = 12;
            const chunks = [];
            let vp8x = null;
            let loopCount = 0;

            while (offset < buffer.byteLength) {
                if (offset + 8 > buffer.byteLength) break;
                const chunkId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset+1), view.getUint8(offset+2), view.getUint8(offset+3));
                const chunkSize = view.getUint32(offset + 4, true);
                const chunkDataStart = offset + 8;
                let chunkDataEnd = chunkDataStart + chunkSize;
                if (chunkDataEnd % 2 !== 0) chunkDataEnd++;

                if (chunkId === 'VP8X') {
                    const flags = view.getUint8(chunkDataStart);
                    const canvasW = (view.getUint24 ? view.getUint24(chunkDataStart + 4, true) : (view.getUint32(chunkDataStart + 4, true) & 0xFFFFFF)) + 1;
                    const canvasH = (view.getUint24 ? view.getUint24(chunkDataStart + 7, true) : (view.getUint32(chunkDataStart + 7, true) & 0xFFFFFF)) + 1;
                    vp8x = { hasAnimation: !!(flags & 0x02), hasAlpha: !!(flags & 0x10), width: canvasW, height: canvasH };
                } else if (chunkId === 'ANIM') {
                    loopCount = view.getUint16(chunkDataStart + 4, true);
                } else if (chunkId === 'ANMF') {
                    const fx = view.getUint8(chunkDataStart) | (view.getUint8(chunkDataStart+1) << 8) | (view.getUint8(chunkDataStart+2) << 16);
                    const fy = view.getUint8(chunkDataStart+3) | (view.getUint8(chunkDataStart+4) << 8) | (view.getUint8(chunkDataStart+5) << 16);
                    const fw = (view.getUint8(chunkDataStart+6) | (view.getUint8(chunkDataStart+7) << 8) | (view.getUint8(chunkDataStart+8) << 16)) + 1;
                    const fh = (view.getUint8(chunkDataStart+9) | (view.getUint8(chunkDataStart+10) << 8) | (view.getUint8(chunkDataStart+11) << 16)) + 1;
                    const duration = view.getUint8(chunkDataStart+12) | (view.getUint8(chunkDataStart+13) << 8) | (view.getUint8(chunkDataStart+14) << 16);
                    const flags = view.getUint8(chunkDataStart+15);
                    const blending = (flags & 0x02) >> 1;
                    const disposal = (flags & 0x01);

                    const payloadStart = chunkDataStart + 16;
                    const payloadLength = chunkSize - 16;
                    const frameData = buffer.slice(payloadStart, payloadStart + payloadLength);

                    chunks.push({ type: 'ANMF', x: fx, y: fy, width: fw, height: fh, duration, blending, disposal, data: frameData });
                }
                offset = chunkDataEnd;
            }

            const frames = chunks.filter(c => c.type === 'ANMF');
            let totalTime = 0;
            const frameDelays = frames.map(f => {
                let d = f.duration;
                if (d <= 0) d = 100;
                totalTime += d;
                return d;
            });

            return { isAnimated: (vp8x && vp8x.hasAnimation && frames.length > 0), width: vp8x ? vp8x.width : 0, height: vp8x ? vp8x.height : 0, vp8x, frames, frameDelays, totalTime, loopCount };
        }

        static createFrameBlob(frame, vp8x) {
            const vp8xData = new Uint8Array(10);
            let flags = 0;
            if (vp8x && vp8x.hasAlpha) flags |= 0x10;
            vp8xData[0] = flags;

            const w = frame.width - 1;
            const h = frame.height - 1;
            vp8xData[4] = w & 0xFF; vp8xData[5] = (w >> 8) & 0xFF; vp8xData[6] = (w >> 16) & 0xFF;
            vp8xData[7] = h & 0xFF; vp8xData[8] = (h >> 8) & 0xFF; vp8xData[9] = (h >> 16) & 0xFF;

            const riffHeader = new Uint8Array([0x52, 0x49, 0x46, 0x46]);
            const webpHeader = new Uint8Array([0x57, 0x45, 0x42, 0x50]);
            const vp8xHeader = new Uint8Array([0x56, 0x50, 0x38, 0x58, 0x0A, 0x00, 0x00, 0x00]);

            const frameBytes = new Uint8Array(frame.data);
            const fileSize = 4 + 8 + 10 + frameBytes.byteLength;

            const sizeBuffer = new Uint8Array(4);
            new DataView(sizeBuffer.buffer).setUint32(0, fileSize, true);

            return new Blob([riffHeader, sizeBuffer, webpHeader, vp8xHeader, vp8xData, frameBytes], { type: 'image/webp' });
        }
    }

    // ==========================================
    // Animation Decoder
    // ==========================================
    class AnimationDecoder {
        static async parseGIFData(buffer) {
            try {
                const result = await gifWorkerManager.decodeGif(buffer);
                let totalTime = 0;
                const frameDelays = result.frames.map(f => {
                    let d = f.delay;
                    if (d < 10) d = 100;
                    totalTime += d;
                    return d;
                });
                if (totalTime === 0) totalTime = 100;
                return { type: 'gif', width: result.width, height: result.height, frames: result.frames, frameDelays, totalTime, loopCount: result.loopCount };
            } catch(e) { console.warn("GIF Parse Error", e); return null; }
        }

        static parseAPNGData(buffer) {
            try {
                const img = window.UPNG.decode(buffer);
                const frames = img.frames;
                if (!frames || frames.length === 0) return null;
                const loopCount = (img.loop !== undefined) ? img.loop : 1;
                let totalTime = 0;
                const frameDelays = frames.map(f => { let d = f.delay; if (d < 20) d = 100; totalTime += d; return d; });
                return { type: 'png', upngObj: img, width: img.width, height: img.height, frameDelays, totalTime, loopCount };
            } catch(e) { console.warn("APNG Parse Error", e); return null; }
        }

        static parseWebPData(buffer) {
             try {
                 if (!WebPParser.isWebP(buffer)) return null;
                 const parsed = WebPParser.parse(buffer);
                 if (!parsed.isAnimated) return null;
                 return { type: 'webp', width: parsed.width, height: parsed.height, frames: parsed.frames, frameDelays: parsed.frameDelays, totalTime: parsed.totalTime, loopCount: parsed.loopCount, vp8x: parsed.vp8x };
             } catch(e) { console.warn("WebP Parse Error", e); return null; }
        }

        static calculateSeek(parsedData, targetTimeMs) {
            const { totalTime, loopCount } = parsedData;
            if (totalTime === 0) return 0;
            if (loopCount === 0) return targetTimeMs % totalTime;
            const maxDuration = totalTime * loopCount;
            if (targetTimeMs >= maxDuration) return totalTime - 1;
            return targetTimeMs % totalTime;
        }

        static async loadBlobImage(blob) {
            try {
                // Try createImageBitmap first for performance
                return await createImageBitmap(blob);
            } catch (e) {
                // Fallback to Image element for robust compatibility (especially for weird WebP blobs)
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = URL.createObjectURL(blob);
                });
            }
        }

        static renderGIFFrame(parsedData, targetTimeMs) {
            if (!parsedData || !parsedData.frames) return null;
            const { frames, frameDelays, width, height } = parsedData;
            const seekTime = this.calculateSeek(parsedData, targetTimeMs);

            let currentTime = 0;
            let targetFrameIndex = 0;
            for (let i = 0; i < frames.length; i++) {
                currentTime += frameDelays[i];
                if (currentTime > seekTime) { targetFrameIndex = i; break; }
            }

            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const helperCanvas = new OffscreenCanvas(width, height);
            const helperCtx = helperCanvas.getContext('2d');
            let prevImageData = null;

            for (let i = 0; i <= targetFrameIndex; i++) {
                const frame = frames[i];
                const prev = (i > 0) ? frames[i-1] : null;

                if (prev) {
                    if (prev.disposal === 2) ctx.clearRect(prev.left, prev.top, prev.width, prev.height);
                    else if (prev.disposal === 3 && prevImageData) ctx.putImageData(prevImageData, 0, 0);
                }
                if (frame.disposal === 3) prevImageData = ctx.getImageData(0, 0, width, height);

                if (frame.pixels) {
                     const id = new ImageData(new Uint8ClampedArray(frame.pixels), frame.width, frame.height);
                     helperCanvas.width = frame.width; helperCanvas.height = frame.height;
                     helperCtx.putImageData(id, 0, 0);
                     ctx.drawImage(helperCanvas, frame.left, frame.top);
                }
            }
            return canvas.transferToImageBitmap();
        }

        static renderAPNGFrame(parsedData, targetTimeMs) {
            if (!parsedData || !parsedData.upngObj) return null;
            const { upngObj, frameDelays, width, height } = parsedData;
            const seekTime = this.calculateSeek(parsedData, targetTimeMs);

            let currentTime = 0;
            let targetFrameIndex = 0;
            for (let i = 0; i < frameDelays.length; i++) {
                currentTime += frameDelays[i];
                if (currentTime > seekTime) { targetFrameIndex = i; break; }
            }

            const rgba8 = window.UPNG.toRGBA8(upngObj);
            const frameData = new Uint8ClampedArray(rgba8[targetFrameIndex]);
            const imageData = new ImageData(frameData, width, height);
            return createImageBitmap(imageData);
        }

        static async renderWebPFrame(parsedData, targetTimeMs) {
            if (!parsedData || !parsedData.frames) return null;
            const { frames, frameDelays, width, height, vp8x } = parsedData;
            const seekTime = this.calculateSeek(parsedData, targetTimeMs);

            let currentTime = 0;
            let targetFrameIndex = 0;
            for (let i = 0; i < frames.length; i++) {
                currentTime += frameDelays[i];
                if (currentTime > seekTime) { targetFrameIndex = i; break; }
            }

            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext('2d');

            for (let i = 0; i <= targetFrameIndex; i++) {
                const f = frames[i];
                const prevF = (i > 0) ? frames[i-1] : null;
                if (prevF && prevF.disposal === 1) ctx.clearRect(prevF.x, prevF.y, prevF.width, prevF.height);

                const blob = WebPParser.createFrameBlob(f, vp8x);
                // Use robust loader
                const img = await this.loadBlobImage(blob);

                if (img) {
                    if (f.blending === 1) ctx.clearRect(f.x, f.y, f.width, f.height);
                    ctx.drawImage(img, f.x, f.y);
                    if (img.close) img.close(); // If Bitmap
                    // If HTMLImageElement, URL.revoke is handled by cleanups later or GC, but blob URL was one-off
                }
            }
            return canvas.transferToImageBitmap();
        }
    }

    // ==========================================
    // Image Registry
    // ==========================================
    class ImageRegistry {
        constructor() {
            this.urlToInfo = new Map();
            this.counter = 0;
        }

        registerUrl(url) {
            if (!url || url.startsWith('data:image/svg')) return null;
            if (url.startsWith('url(')) url = url.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
            if (this.urlToInfo.has(url)) return this.urlToInfo.get(url).id;
            const id = 'asset_' + (this.counter++).toString(36);
            this.urlToInfo.set(url, {
                id, url, status: 'pending', imgObj: null, buffer: null, parsedData: null,
                frameCache: new Map(), isAnimated: false, type: null, _promise: null
            });
            return id;
        }

        async getImageForCanvas(url, targetTimeSec, isPreview) {
            let cleanUrl = url.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
            if (!this.urlToInfo.has(cleanUrl)) this.registerUrl(cleanUrl);
            const info = this.urlToInfo.get(cleanUrl);

            if (info.status === 'pending') await this.fetchOne(cleanUrl);
            if (info.status === 'error') return null;
            if (isPreview && targetTimeSec === 0) return info.imgObj;

            if (info.isAnimated && info.parsedData) {
                const cacheKey = Math.floor(targetTimeSec * 10) / 10;
                if (info.frameCache.has(cacheKey)) return info.frameCache.get(cacheKey);

                try {
                    const ms = targetTimeSec * 1000;
                    let bmp = null;
                    if (info.type === 'gif') bmp = await AnimationDecoder.renderGIFFrame(info.parsedData, ms);
                    else if (info.type === 'png') bmp = await AnimationDecoder.renderAPNGFrame(info.parsedData, ms);
                    else if (info.type === 'webp') bmp = await AnimationDecoder.renderWebPFrame(info.parsedData, ms);

                    if (bmp) {
                        info.frameCache.set(cacheKey, bmp);
                        return bmp;
                    }
                } catch(e) { console.warn(e); }
            }
            return info.imgObj;
        }

        async fetchOne(url) {
            const info = this.urlToInfo.get(url);
            if (!info || info.status === 'loaded' || info.status === 'error') return;
            if (info._promise) { try { await info._promise; } catch(e) {} return; }

            info._promise = (async () => {
                try {
                    const fetchP = fetch(url, { cache: 'force-cache' }).then(r => r.ok ? r.blob() : Promise.reject(r.statusText));
                    const blob = await fetchP;

                    const bufferP = blob.arrayBuffer();
                    const bitmapP = AnimationDecoder.loadBlobImage(blob);

                    const [buffer, bmp] = await Promise.all([bufferP, bitmapP]);

                    info.buffer = buffer;
                    info.imgObj = bmp;

                    const arr = new Uint8Array(buffer.slice(0, 12));
                    const header = Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
                    if (header.startsWith('474946')) info.type = 'gif';
                    else if (header.startsWith('89504e47')) info.type = 'png';
                    else if (header.startsWith('52494646') && header.endsWith('57454250')) info.type = 'webp';
                    else info.type = 'other';

                    info.status = 'loaded';
                } catch (e) {
                    info.status = 'error';
                    console.error("Asset load failed:", url, e);
                } finally {
                    info._promise = null;
                }
            })();
            await info._promise;
        }

        async fetchAll(statusCallback) {
            const pendingUrls = Array.from(this.urlToInfo.values()).filter(i => i.status === 'pending').map(i => i.url);
            const total = pendingUrls.length;
            if (total === 0) return;
            let finished = 0;
            for (let i = 0; i < total; i += CONFIG.CONCURRENCY_LIMIT) {
                const chunk = pendingUrls.slice(i, i + CONFIG.CONCURRENCY_LIMIT);
                await Promise.all(chunk.map(async (url) => {
                    await this.fetchOne(url);
                    finished++;
                    if (statusCallback) statusCallback(finished, total, 'loading');
                }));
            }
        }

        async decodeAllAnimations(targetTimeSec, statusCallback) {
            const targetTimeMs = targetTimeSec * 1000;
            const cacheKey = Math.floor(targetTimeSec * 10) / 10;
            const items = Array.from(this.urlToInfo.values()).filter(i => i.status === 'loaded' && i.buffer);
            const targets = items.filter(i => (i.type === 'gif' || i.type === 'png' || i.type === 'webp'));
            const total = targets.length;
            if (total === 0) return;

            let processed = 0;
            for (let i = 0; i < total; i += CONFIG.CONCURRENCY_LIMIT) {
                const chunk = targets.slice(i, i + CONFIG.CONCURRENCY_LIMIT);
                await Promise.all(chunk.map(async (info) => {
                    try {
                        if (!info.parsedData && info.buffer) {
                            if (info.type === 'gif') info.parsedData = await AnimationDecoder.parseGIFData(info.buffer);
                            else if (info.type === 'png') info.parsedData = AnimationDecoder.parseAPNGData(info.buffer);
                            else if (info.type === 'webp') info.parsedData = AnimationDecoder.parseWebPData(info.buffer);
                            if (info.parsedData) info.isAnimated = true;
                        }
                        if (info.isAnimated && info.parsedData && !info.frameCache.has(cacheKey)) {
                            let bmp = null;
                            if (info.type === 'gif') bmp = await AnimationDecoder.renderGIFFrame(info.parsedData, targetTimeMs);
                            else if (info.type === 'png') bmp = await AnimationDecoder.renderAPNGFrame(info.parsedData, targetTimeMs);
                            else if (info.type === 'webp') bmp = await AnimationDecoder.renderWebPFrame(info.parsedData, targetTimeMs);
                            if (bmp) info.frameCache.set(cacheKey, bmp);
                        }
                    } catch (e) { console.warn('Decode error', e); }
                    processed++;
                    if (statusCallback) statusCallback(processed, total, 'decoding');
                }));
            }
        }

        clearMemory() {
            for (const info of this.urlToInfo.values()) {
                if (info.imgObj && info.imgObj.close) info.imgObj.close();
                info.frameCache.forEach(bmp => { if(bmp && bmp.close) bmp.close(); });
                info.frameCache.clear();
                info.parsedData = null;
                info.buffer = null;
                info.status = 'pending';
                info.imgObj = null;
            }
            this.urlToInfo.clear();
        }
    }
    const globalImageRegistry = new ImageRegistry();

    // ==========================================
    // Board Analysis
    // ==========================================
    function getRotation(el) {
        if (!el) return 0;
        let curr = el;
        for (let i = 0; i < 5; i++) {
            if (!curr) break;
            try {
                const style = window.getComputedStyle(curr);
                const transform = style.transform;
                if (transform && transform !== 'none') {
                    const m = transform.match(/matrix\((.+)\)/);
                    if (m && m[1]) {
                        const values = m[1].split(',').map(parseFloat);
                        const angle = Math.atan2(values[1], values[0]);
                        if (Math.abs(angle) > 0.01) return angle;
                    }
                }
            } catch(e) {}
            curr = curr.parentElement;
        }
        return 0;
    }

    function getBoardMeta() {
        let target = document.querySelector('[aria-roledescription="draggable"]');
        if (!target) {
            const images = document.querySelectorAll('img');
            const vw = window.innerWidth, vh = window.innerHeight;
            for (const img of images) {
                const r = img.getBoundingClientRect();
                if (r.width > vw * 0.3 && r.height > vh * 0.3 && !img.closest('.MuiDrawer-root') && !img.closest('.MuiList-root')) {
                    target = img; break;
                }
            }
        }
        if (!target) {
            return { contentObjects: [], backgroundObjects: [], minX: 0, minY: 0, cropW: 1920, cropH: 1080, naturalW: 1920, naturalH: 1080, globalScale: 1.0, pageBackgroundColor: '#202020', pageBackgroundImage: null };
        }
        let boardNode = target.parentElement, globalScale = 1.0, globalTx = 0, globalTy = 0;
        let curr = boardNode;
        for (let i = 0; i < 30; i++) {
            if (!curr || curr === document.body) break;
            const style = window.getComputedStyle(curr);
            if (style.transform && style.transform !== 'none') {
                const m = style.transform.match(/matrix\((.+)\)/);
                if (m && m[1]) {
                    const v = m[1].split(',').map(parseFloat);
                    const s = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
                    if (Math.abs(s - 1.0) > 0.005 || s !== 1.0) { boardNode = curr; globalScale = s; globalTx = v[4]; globalTy = v[5]; break; }
                }
            }
            curr = curr.parentElement;
        }

        let detectedBgColor = '#202020', detectedBgImage = null;
        const bgCandidates = document.body.querySelectorAll('div');
        for (const el of bgCandidates) {
            if (boardNode.contains(el)) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width >= window.innerWidth * 0.8 && rect.height >= window.innerHeight * 0.8) {
                const s = window.getComputedStyle(el);
                if (parseInt(s.zIndex) > 100) continue;
                if (s.backgroundImage && s.backgroundImage !== 'none') { detectedBgImage = s.backgroundImage; if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') detectedBgColor = s.backgroundColor; break; }
                if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') detectedBgColor = s.backgroundColor;
            }
        }
        if (detectedBgColor === '#202020' && !detectedBgImage) {
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') detectedBgColor = bodyBg;
        }

        const normalizeRect = (rect) => ({ left: (rect.left - globalTx) / globalScale, top: (rect.top - globalTy) / globalScale, width: rect.width / globalScale, height: rect.height / globalScale, right: (rect.right - globalTx) / globalScale, bottom: (rect.bottom - globalTy) / globalScale });
        const contentObjects = [], backgroundObjects = [];
        const candidates = boardNode.querySelectorAll('div, img, span, p');
        for (const el of candidates) {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.01) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width < 1 || rect.height < 1) continue;
            const bgImage = style.backgroundImage;
            const src = (el.tagName === 'IMG') ? el.src : null;
            const hasImage = (src || (bgImage && bgImage !== 'none' && !bgImage.includes('gradient')));
            const hasText = (el.innerText && el.innerText.trim().length > 0 && el.childElementCount === 0);
            const hasColor = (!hasImage && ((style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') || (style.borderWidth && parseFloat(style.borderWidth) > 0)));
            if (!hasImage && !hasText && !hasColor) continue;
            let isBoardBackground = (!el.closest('[aria-roledescription="draggable"]') && hasImage && !hasText);
            let itemZoom = 1.0;
            if (el.offsetWidth > 0) itemZoom = (rect.width / el.offsetWidth) / globalScale;
            const finalItem = {
                el, rect: normalizeRect(rect), originalRect: rect,
                layoutWidth: el.offsetWidth, layoutHeight: el.offsetHeight,
                zIndex: (style.zIndex !== 'auto') ? parseInt(style.zIndex) : 0,
                url: hasImage ? (src || bgImage) : null,
                borderRadius: style.borderRadius, opacity: parseFloat(style.opacity),
                bgColor: style.backgroundColor, borderColor: style.borderColor, borderWidth: style.borderWidth,
                color: style.color, hasImage, hasText, isBoardBackground,
                isCaption: el.className && typeof el.className === 'string' && el.className.includes('MuiTypography-caption'),
                bgSize: style.backgroundSize, bgPos: style.backgroundPosition,
                text: hasText ? el.innerText : '', fontFamily: style.fontFamily,
                fontSize: parseFloat(style.fontSize) || 16, fontWeight: style.fontWeight, textAlign: style.textAlign,
                zoomScale: itemZoom || 1.0, rotation: getRotation(el)
            };
            (isBoardBackground ? backgroundObjects : contentObjects).push(finalItem);
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const allItems = [...contentObjects, ...backgroundObjects];
        if (allItems.length > 0) {
            allItems.forEach(o => { if (o.rect.left < minX) minX = o.rect.left; if (o.rect.top < minY) minY = o.rect.top; if (o.rect.right > maxX) maxX = o.rect.right; if (o.rect.bottom > maxY) maxY = o.rect.bottom; });
            const w = maxX - minX, h = maxY - minY;
            const padX = Math.max(50, w * CONFIG.PADDING_RATIO);
            const padY = Math.max(50, h * CONFIG.PADDING_RATIO);
            minX -= padX; minY -= padY; maxX += padX; maxY += padY;
        } else { minX = 0; minY = 0; maxX = window.innerWidth/globalScale; maxY = window.innerHeight/globalScale; }
        return { contentObjects, backgroundObjects, minX, minY, cropW: maxX - minX, cropH: maxY - minY, naturalW: maxX - minX, naturalH: maxY - minY, globalScale, pageBackgroundColor: detectedBgColor, pageBackgroundImage: detectedBgImage };
    }

    async function captureBoard(registry, resolutionSetting, mimeType, timeSeconds, statusCallback) {
        const isPreview = (resolutionSetting.width === PREVIEW_SETTINGS.width);
        let meta; try { meta = getBoardMeta(); } catch(e) { return null; }
        const { contentObjects, backgroundObjects, minX, minY, cropW, cropH, globalScale, pageBackgroundColor, pageBackgroundImage } = meta;
        const targetW = resolutionSetting.width;
        const targetH = resolutionSetting.height;
        let scale = Math.min(targetW / cropW, targetH / cropH);
        scale = Math.max(CONFIG.MIN_SCALE, Math.min(scale, CONFIG.MAX_SCALE));
        const canvasW = Math.ceil(cropW * scale);
        const canvasH = Math.ceil(cropH * scale);
        const canvas = new OffscreenCanvas(canvasW, canvasH);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = pageBackgroundColor; ctx.fillRect(0, 0, canvasW, canvasH);

        const allItems = [...backgroundObjects, ...contentObjects];
        const urlsToLoad = allItems.filter(i => i.hasImage).map(i => i.url);
        if (pageBackgroundImage) urlsToLoad.push(pageBackgroundImage);
        new Set(urlsToLoad).forEach(u => registry.registerUrl(u));
        await registry.fetchAll((c, t) => statusCallback && statusCallback(c, t, 'loading'));
        if (!isPreview || timeSeconds !== 0) await registry.decodeAllAnimations(timeSeconds, (c, t) => statusCallback && statusCallback(c, t, 'decoding'));

        if (pageBackgroundImage) {
            const bgImg = await registry.getImageForCanvas(pageBackgroundImage, 0, true);
            if (bgImg) {
                const iW = bgImg.width || bgImg.naturalWidth, iH = bgImg.height || bgImg.naturalHeight;
                const r = Math.max(canvasW/iW, canvasH/iH);
                const dw = iW*r, dh = iH*r;
                ctx.drawImage(bgImg, (canvasW-dw)/2, (canvasH-dh)/2, dw, dh);
            }
        }
        ctx.scale(scale, scale); ctx.translate(-minX, -minY);
        allItems.sort((a,b) => (a.zIndex !== b.zIndex) ? a.zIndex - b.zIndex : ((a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1));

        for (const item of allItems) {
            ctx.save(); ctx.globalAlpha = item.opacity;
            const cx = item.rect.left + item.rect.width/2;
            const cy = item.rect.top + item.rect.height/2;
            let w = (item.layoutWidth > 0) ? item.layoutWidth : item.rect.width;
            let h = (item.layoutHeight > 0) ? item.layoutHeight : item.rect.height;
            ctx.translate(cx, cy); if (item.rotation) ctx.rotate(item.rotation); ctx.translate(-w/2, -h/2);

            ctx.beginPath();
            if (item.borderRadius && parseFloat(item.borderRadius) > 0 && !item.isBoardBackground) {
                let r = parseFloat(item.borderRadius);
                ctx.roundRect(0, 0, w, h, Math.min(r, w/2, h/2));
            } else ctx.rect(0, 0, w, h);
            ctx.clip();

            if (item.bgColor && item.bgColor !== 'transparent' && !item.isCaption) { ctx.fillStyle = item.bgColor; ctx.fillRect(0, 0, w, h); }

            if (item.hasImage) {
                const img = await registry.getImageForCanvas(item.url, timeSeconds, isPreview);
                if (img) {
                    const iW = img.width || img.naturalWidth, iH = img.height || img.naturalHeight;
                    const isCover = item.bgSize === 'cover' || item.el.style.objectFit === 'cover';
                    const isContain = item.bgSize === 'contain' || item.el.style.objectFit === 'contain';
                    if (isCover) { const r = Math.max(w/iW, h/iH); const dw = iW*r, dh = iH*r; ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh); }
                    else if (isContain) { const r = Math.min(w/iW, h/iH); const dw = iW*r, dh = iH*r; ctx.drawImage(img, (w-dw)/2, (h-dh)/2, dw, dh); }
                    else ctx.drawImage(img, 0, 0, w, h);
                }
            }
            if (item.borderWidth && parseFloat(item.borderWidth) > 0 && item.borderColor) {
                ctx.beginPath();
                if (item.borderRadius && parseFloat(item.borderRadius) > 0) ctx.roundRect(0, 0, w, h, Math.min(parseFloat(item.borderRadius), w/2, h/2));
                else ctx.rect(0, 0, w, h);
                ctx.strokeStyle = item.borderColor; ctx.lineWidth = parseFloat(item.borderWidth); ctx.stroke();
            }
            ctx.restore();

            if (item.hasText && item.color) {
                ctx.save(); ctx.globalAlpha = item.opacity; ctx.translate(cx, cy); if (item.rotation) ctx.rotate(item.rotation); ctx.translate(-w/2, -h/2);
                const fSize = item.fontSize * item.zoomScale;
                ctx.font = `${item.fontWeight} ${fSize}px ${item.fontFamily}`;
                ctx.textBaseline = 'middle';
                let tx = 0;
                if (item.textAlign === 'center') { tx = w/2; ctx.textAlign = 'center'; } else if (item.textAlign === 'right') { tx = w; ctx.textAlign = 'right'; } else ctx.textAlign = 'left';
                if (item.isCaption) { ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1.0, fSize * 0.2); ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(item.text, tx, h/2); ctx.fillStyle = '#000000'; ctx.fillText(item.text, tx, h/2); }
                else { ctx.fillStyle = item.color; ctx.fillText(item.text, tx, h/2); }
                ctx.restore();
            }
        }
        return canvas.convertToBlob({ type: mimeType, quality: 0.9 });
    }

    function getRoomName() {
        const headerTitle = document.querySelector('header h6');
        return headerTitle ? headerTitle.innerText.trim().replace(/\n/g, ' ') : 'CCFOLIA Board';
    }

    function showModal() {
        if (document.getElementById('ccfolia-export-modal')) return;
        globalImageRegistry.clearMemory();
        let meta; try { meta = getBoardMeta(); } catch(e) { console.error(e); }
        const nw = meta ? Math.round(meta.naturalW) : 1920;
        const nh = meta ? Math.round(meta.naturalH) : 1080;
        const optRes = { key: 'OPT', width: nw, height: nh, label: `最適 (${nw}x${nh})` };
        const resolutions = [optRes, ...BASE_RESOLUTIONS].sort((a,b)=> (a.width*a.height)-(b.width*b.height));
        const roomName = getRoomName();
        const modal = document.createElement('div');
        modal.id = 'ccfolia-export-modal';
        modal.innerHTML = `
            <div class="ccfolia-modal-content">
                <div class="ccfolia-modal-header">${roomName}｜盤面保存</div>
                <div class="ccfolia-preview-box">
                    <div class="ccfolia-preview-label">Preview</div>
                    <div id="ccfolia-loader" class="ccfolia-loader"></div>
                    <img id="ccfolia-preview-img" alt="Preview" />
                </div>
                <div class="ccfolia-option-row">
                    <div class="ccfolia-select-group" style="flex:2;"><label>解像度</label><select id="sel-resolution" class="ccfolia-select">${resolutions.map(r=>`<option value="${r.key}"${r.key==='OPT'?' selected':''}>${r.label}</option>`).join('')}</select></div>
                    <div class="ccfolia-select-group" style="flex:1;"><label>形式</label><select id="sel-format" class="ccfolia-select"><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></div>
                </div>
                <div class="ccfolia-option-row">
                    <div class="ccfolia-select-group"><label>時点 (秒)</label><div class="ccfolia-input-wrapper"><input type="number" id="inp-time" class="ccfolia-input" value="0.0" step="0.1" min="0"><button id="ccfolia-refresh-btn">${REFRESH_ICON_SVG}</button></div></div>
                </div>
                <div class="ccfolia-note">GIF/APNG/WebPは指定秒数のフレームを描画します。<br>(エンターキーまたはボタンでプレビュー更新)</div>
                <div class="ccfolia-status-box" id="ccfolia-export-status">準備中...</div>
                <div class="ccfolia-footer"><button class="ccfolia-btn ccfolia-btn-secondary" id="ccfolia-cancel-btn">閉じる</button><button class="ccfolia-btn ccfolia-btn-primary" id="ccfolia-exec-btn">保存</button></div>
            </div>`;
        document.body.appendChild(modal);

        const els = { preview: document.getElementById('ccfolia-preview-img'), loader: document.getElementById('ccfolia-loader'), status: document.getElementById('ccfolia-export-status'), res: document.getElementById('sel-resolution'), fmt: document.getElementById('sel-format'), time: document.getElementById('inp-time'), refresh: document.getElementById('ccfolia-refresh-btn'), exec: document.getElementById('ccfolia-exec-btn'), cancel: document.getElementById('ccfolia-cancel-btn') };
        const resMap = {}; resolutions.forEach(r => resMap[r.key] = r);
        const updateStatus = (c, t, p) => els.status.textContent = `${p==='loading'?'取得':'解析'}中... ${c}/${t}`;

        let updating = false;
        const refresh = async () => {
            if (updating) return;
            updating = true;
            els.loader.style.display = 'block'; els.preview.style.opacity = '0.5'; els.time.disabled = true; els.refresh.disabled = true; els.exec.disabled = true; els.status.textContent = "プレビュー生成中...";
            try {
                const t = parseFloat(els.time.value)||0;
                const blob = await captureBoard(globalImageRegistry, PREVIEW_SETTINGS, 'image/webp', t, updateStatus);
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    if (els.preview.src) URL.revokeObjectURL(els.preview.src);
                    els.preview.src = url; els.preview.style.display = 'block'; els.status.textContent = `プレビュー完了 (T=${t}s)`;
                }
            } catch(e) { console.warn(e); els.status.textContent = "エラーが発生しました"; }
            finally { els.loader.style.display = 'none'; els.preview.style.opacity = '1'; els.time.disabled = false; els.refresh.disabled = false; els.exec.disabled = false; els.time.focus(); updating = false; }
        };

        els.refresh.onclick = refresh;
        els.time.onkeydown = (e) => { if(e.key === 'Enter') refresh(); };
        els.cancel.onclick = () => { if (els.preview.src) URL.revokeObjectURL(els.preview.src); globalImageRegistry.clearMemory(); modal.remove(); };
        els.exec.onclick = async () => {
            const conf = resMap[els.res.value], mime = els.fmt.value, t = parseFloat(els.time.value)||0, ext = mime.split('/')[1];
            spoofVisibility();
            els.exec.disabled = true; els.cancel.style.display = 'none'; els.time.disabled = true; els.refresh.disabled = true; modal.style.opacity = '0.8'; await wait(100);
            try {
                els.status.textContent = "高解像度レンダリング中...";
                const blob = await captureBoard(globalImageRegistry, conf, mime, t, updateStatus);
                if (!blob) throw new Error("描画対象なし");
                els.status.textContent = "保存中...";
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `${roomName}_${conf.key}_T${t}s_${Date.now()}.${ext}`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                els.status.textContent = "保存完了"; await wait(1500); els.cancel.onclick();
            } catch(e) { console.error(e); els.status.textContent = "保存エラー: " + e.message; els.exec.disabled = false; els.cancel.style.display = 'block'; els.time.disabled = false; els.refresh.disabled = false; modal.style.opacity = '1'; }
        };
        spoofVisibility(); refresh();
    }

    function init() {
        createStyles();
        const obs = new MutationObserver(() => {
            if(document.getElementById(CONFIG.BUTTON_ID)) return;
            const menu = document.querySelector('button[aria-label="チャットメニュー"]') || document.querySelector('button[aria-label*="メニュー"]');
            if(menu && menu.parentNode) {
                const b = document.createElement('button'); b.id = CONFIG.BUTTON_ID; b.innerHTML = CAMERA_ICON_SVG; b.title = "盤面保存 (UI非表示/高画質)"; b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showModal(); }; menu.parentNode.insertBefore(b, menu);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
    init();
})();