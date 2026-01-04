// ==UserScript==
// @name         Bloxd.io Ultimate Performance Optimizer v7.2
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  Improved Bloxd.io performance: VRAM estimator, texture GC/downscale, draw-call monitor, DPR override, async image decode & more (safe defaults, aggressive opt-in). 
// @author       Gugu8
// @match        *://bloxd.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @downloadURL https://update.greasyfork.org/scripts/550831/Bloxdio%20Ultimate%20Performance%20Optimizer%20v72.user.js
// @updateURL https://update.greasyfork.org/scripts/550831/Bloxdio%20Ultimate%20Performance%20Optimizer%20v72.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- Metadata & Defaults ----------
    const SCRIPT_KEY = 'bloxd_config_v7_2';
    const SCRIPT_VER = '7.2';

    const DEFAULT_CONFIG = {
        // General
        enableFPSLimit: true,
        targetFPS: 144,
        adaptiveFPS: true,
        showStatusNotification: true,
        logLevel: 2, // 1=ERROR,2=INFO,3=DEBUG

        // CPU / Input
        throttleMouseEvents: true,
        enableTimerThrottling: false,

        // Network
        optimizeWebSocket: true,
        networkThrottleDelay: 50,
        throttleNetwork: true,

        // GPU / Textures
        enableGPUOptimization: true,
        gpuPowerPreference: 'default',
        textureQuality: 'high', // 'high'|'medium'|'low'
        textureQualityScope: 'safe', // 'safe'|'aggressive'
        enableAggressiveTextureGC: false, // opt-in
        textureMemoryCapMB: 0, // 0 = auto-calc (navigator.deviceMemory * 128MB min 256MB)

        // DPR / Resolution
        overrideDevicePixelRatio: false,
        devicePixelRatioTarget: 1.0, // used if overrideDevicePixelRatio true

        // Images
        enableImageAsyncDecode: true, // set decoding='async' and loading='lazy'

        // Draw-call monitoring
        monitorDrawCalls: true,
        drawCallThresholdPerFrame: 800, // heuristic — when exceeded we escalate optimizations

        // Auto-adjust
        enableAutoOptimization: true,

        // UI
        dashboardPos: { left: 10, top: 10 }
    };

    // ---------- State ----------
    let config = {};
    const originals = {};
    let dashboard = null;
    const elements = {};
    const LOGLEVEL = { ERROR: 1, INFO: 2, DEBUG: 3 };

    // WebGL texture manager & stats
    const textureMap = new Map(); // Map<WebGLTexture, {sizeBytes, context, createdAt, lastUsed}>
    const contextBindings = new WeakMap(); // Map<glContext, Map<target, texture>>
    let totalTextureBytes = 0;

    // Draw call stats
    let drawsThisSecond = 0;
    let lastDrawsReset = performance.now();

    // FPS
    let fps = 0;
    let performanceMetrics = { avgFPS: 0, memoryUsageMB: 0 };

    // ---------- Utility functions ----------
    function log(level, ...msgs) {
        try {
            const current = (config && typeof config.logLevel === 'number') ? config.logLevel : DEFAULT_CONFIG.logLevel;
            if (level <= current) {
                const label = Object.keys(LOGLEVEL).find(k => LOGLEVEL[k] === level) || 'LOG';
                const style = `color: ${level === LOGLEVEL.ERROR ? 'red' : level === LOGLEVEL.INFO ? '#3498db' : '#9b59b6'}; font-weight:bold`;
                console.log(`%c[BloxdOpt ${label}]`, style, ...msgs);
            }
        } catch (e) { /* ignore logging errors */ }
    }

    function loadConfig() {
        try {
            const saved = GM_getValue(SCRIPT_KEY, {});
            config = Object.assign({}, DEFAULT_CONFIG, saved);
            log(LOGLEVEL.INFO, 'Config loaded', config);
        } catch (e) {
            log(LOGLEVEL.ERROR, 'Failed to load config, using defaults', e);
            config = Object.assign({}, DEFAULT_CONFIG);
        }
    }

    function saveConfig() {
        try {
            GM_setValue(SCRIPT_KEY, config);
            log(LOGLEVEL.DEBUG, 'Config saved');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'Failed to save config', e);
        }
    }

    function showNotification(msg, type = 'info') {
        if (!config.showStatusNotification) return;
        try {
            const icons = { info: '🔧', success: '✅', warning: '⚠️', error: '❌' };
            GM_notification({ text: `${icons[type] || ''} ${msg}`, title: `Bloxd Optimizer v${SCRIPT_VER}`, timeout: 3500 });
        } catch (e) {
            log(LOGLEVEL.INFO, `${type.toUpperCase()}: ${msg}`);
        }
    }

    function formatMB(bytes) {
        return (bytes / 1048576).toFixed(1); // 1024*1024
    }

    function getDeviceMemoryGB() {
        try {
            const v = navigator.deviceMemory || 4;
            return v;
        } catch (e) { return 4; }
    }

    function computeTextureMemoryCapMB() {
        if (config.textureMemoryCapMB && config.textureMemoryCapMB > 0) return config.textureMemoryCapMB;
        const deviceGB = Math.max(1, getDeviceMemoryGB());
        const cap = Math.min(2048, Math.max(256, Math.round(deviceGB * 128))); // 128MB per GB, min 256MB, max 2048MB
        return cap;
    }

    // ---------- Device Pixel Ratio override (opt-in) ----------
    function installDevicePixelRatioOverride() {
        if (!config.overrideDevicePixelRatio) return;
        try {
            const target = Math.max(0.5, Number(config.devicePixelRatioTarget) || 1.0);
            // Try to replace getter; may fail on some environments — handle safely
            const desc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
            if (desc && !desc.configurable) {
                log(LOGLEVEL.DEBUG, 'devicePixelRatio is not configurable in this environment; skipping override.');
                return;
            }
            const original = window.devicePixelRatio;
            Object.defineProperty(window, 'devicePixelRatio', {
                configurable: true,
                enumerable: true,
                get: function () {
                    // Use the native DPR if lower than our target to avoid upscaling
                    try {
                        const native = original || (screen && screen.deviceXDPI ? screen.deviceXDPI : window.devicePixelRatio || 1);
                        // Return min(native, target) to avoid increasing DPR, only reduce or leave
                        return Math.min(native, target);
                    } catch (e) {
                        return Math.min(window.devicePixelRatio || 1, target);
                    }
                }
            });
            log(LOGLEVEL.INFO, `devicePixelRatio overridden to cap at ${target}`);
        } catch (e) {
            log(LOGLEVEL.ERROR, 'Failed to override devicePixelRatio', e);
        }
    }

    // ---------- Image async decode + lazy loading ----------
    function installImageAsyncDecode() {
        if (!config.enableImageAsyncDecode) return;
        try {
            // Patch document.createElement to set decoding & loading for images
            const origCreateElement = Document.prototype.createElement;
            if (!originals.createElement) originals.createElement = origCreateElement;
            Document.prototype.createElement = function (tagName, options) {
                const el = origCreateElement.call(this, tagName, options);
                try {
                    if (tagName && String(tagName).toLowerCase() === 'img') {
                        try { el.decoding = 'async'; } catch (e) { /* ignore */ }
                        try { el.loading = 'lazy'; } catch (e) { /* ignore */ }
                    }
                } catch (e) { /* ignore */ }
                return el;
            };

            // Patch Image constructor
            try {
                const OrigImage = window.Image;
                if (!originals.Image) originals.Image = OrigImage;
                function PatchedImage(width, height) {
                    const img = new OrigImage(width, height);
                    try { img.decoding = 'async'; } catch (e) { /* ignore */ }
                    try { img.loading = 'lazy'; } catch (e) { /* ignore */ }
                    return img;
                }
                // keep static props
                Object.getOwnPropertyNames(OrigImage).forEach(p => {
                    try { PatchedImage[p] = OrigImage[p]; } catch (e) { /* ignore */ }
                });
                // replace
                window.Image = PatchedImage;
            } catch (e) {
                log(LOGLEVEL.DEBUG, 'Image constructor patch failed', e);
            }

            // Also ensure existing images get async/lazy where possible
            try {
                document.querySelectorAll && document.querySelectorAll('img').forEach(img => {
                    try { img.decoding = 'async'; } catch (e) { /* ignore */ }
                    try { img.loading = 'lazy'; } catch (e) { /* ignore */ }
                });
            } catch (e) { /* ignore */ }

            log(LOGLEVEL.INFO, 'Async image decode & lazy-loading enabled');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'installImageAsyncDecode failed', e);
        }
    }

    // ---------- WebSocket throttling (retain from earlier) ----------
    function installWebSocketProxy() {
        if (!config.optimizeWebSocket || typeof WebSocket === 'undefined') {
            log(LOGLEVEL.INFO, 'WebSocket optimization disabled/not supported');
            return;
        }
        if (originals.WebSocket) return; // already patched
        try {
            const OriginalWebSocket = WebSocket;
            originals.WebSocket = OriginalWebSocket;
            class PatchedWebSocket extends OriginalWebSocket {
                constructor(url, protocols) {
                    super(url, protocols);
                    this._lastSend = 0;
                    const origSend = this.send.bind(this);
                    const throttleDelay = Math.max(0, config.networkThrottleDelay || 50);
                    this.send = function (data) {
                        try {
                            const now = performance.now();
                            const diff = now - (this._lastSend || 0);
                            if (config.throttleNetwork && diff < throttleDelay) {
                                setTimeout(() => {
                                    try { origSend(data); } catch (e) { log(LOGLEVEL.DEBUG, 'WS send fallback error', e); }
                                }, throttleDelay - diff);
                            } else {
                                origSend(data);
                            }
                            this._lastSend = performance.now();
                        } catch (e) {
                            try { origSend(data); } catch (err) { log(LOGLEVEL.DEBUG, 'WS send ultimate fallback error', err); }
                        }
                    };
                    this.addEventListener('message', () => {
                        if (this._lastSend) performanceMetrics.ping = Math.round(performance.now() - this._lastSend);
                    });
                }
            }
            // copy static properties
            Object.getOwnPropertyNames(OriginalWebSocket).forEach(p => { try { PatchedWebSocket[p] = OriginalWebSocket[p]; } catch (e) { } });
            window.WebSocket = PatchedWebSocket;
            log(LOGLEVEL.INFO, 'WebSocket proxy installed');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'installWebSocketProxy failed', e);
        }
    }

    // ---------- Texture manager: track, estimate, downscale & GC ----------
    function isSourceType(obj) {
        try {
            if (!obj) return false;
            if (typeof ImageBitmap !== 'undefined' && obj instanceof ImageBitmap) return true;
            if (typeof HTMLCanvasElement !== 'undefined' && obj instanceof HTMLCanvasElement) return true;
            if (typeof OffscreenCanvas !== 'undefined' && obj instanceof OffscreenCanvas) return true;
            if (typeof HTMLImageElement !== 'undefined' && obj instanceof HTMLImageElement) return true;
            if (typeof HTMLVideoElement !== 'undefined' && obj instanceof HTMLVideoElement) return true;
        } catch (e) { return false; }
        return false;
    }

    function createResizedCanvas(source, w, h) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            ctx.imageSmoothingEnabled = true;
            try { ctx.imageSmoothingQuality = 'low'; } catch (e) { /* ignore */ }
            ctx.drawImage(source, 0, 0, w, h);
            return canvas;
        } catch (e) {
            log(LOGLEVEL.DEBUG, 'createResizedCanvas failed', e);
            return null;
        }
    }

    function estimateSizeBytesFromWidthHeight(width, height, bytesPerPixel = 4) {
        if (!Number.isFinite(width) || !Number.isFinite(height)) return 0;
        const total = Math.max(0, Math.floor(width) * Math.floor(height) * bytesPerPixel);
        // clamp insane numbers
        if (total > 1024 * 1024 * 1024) return 0;
        return total;
    }

    function installWebGLTexturePatches() {
        if (!config.enableGPUOptimization) return;
        try {
            const protoList = [];
            if (typeof WebGLRenderingContext !== 'undefined') protoList.push(WebGLRenderingContext.prototype);
            if (typeof WebGL2RenderingContext !== 'undefined') protoList.push(WebGL2RenderingContext.prototype);

            protoList.forEach(proto => {
                if (!proto) return;

                // store originals
                if (!originals.createTexture && proto.createTexture) originals.createTexture = proto.createTexture;
                if (!originals.deleteTexture && proto.deleteTexture) originals.deleteTexture = proto.deleteTexture;
                if (!originals.bindTexture && proto.bindTexture) originals.bindTexture = proto.bindTexture;
                if (!originals.texImage2D && proto.texImage2D) originals.texImage2D = proto.texImage2D;
                if (!originals.texSubImage2D && proto.texSubImage2D) originals.texSubImage2D = proto.texSubImage2D;

                // patch createTexture
                if (proto.createTexture) {
                    proto.createTexture = function patchedCreateTexture() {
                        const tex = originals.createTexture.apply(this, arguments);
                        try {
                            textureMap.set(tex, { sizeBytes: 0, context: this, createdAt: Date.now(), lastUsed: Date.now() });
                        } catch (e) { /* ignore map failures */ }
                        return tex;
                    };
                }

                // patch deleteTexture
                if (proto.deleteTexture) {
                    proto.deleteTexture = function patchedDeleteTexture(texture) {
                        try {
                            const info = textureMap.get(texture);
                            if (info) {
                                totalTextureBytes = Math.max(0, totalTextureBytes - (info.sizeBytes || 0));
                                textureMap.delete(texture);
                            }
                        } catch (e) { /* ignore */ }
                        return originals.deleteTexture.apply(this, arguments);
                    };
                }

                // patch bindTexture to track current binding
                if (proto.bindTexture) {
                    proto.bindTexture = function patchedBindTexture(target, texture) {
                        try {
                            let map = contextBindings.get(this);
                            if (!map) {
                                map = new Map();
                                contextBindings.set(this, map);
                            }
                            map.set(target, texture || null);
                            if (texture) {
                                const info = textureMap.get(texture);
                                if (info) info.lastUsed = Date.now();
                            }
                        } catch (e) { /* ignore */ }
                        return originals.bindTexture.apply(this, arguments);
                    };
                }

                // helper to patch texImage2D & texSubImage2D
                function patchTexFunction(name, origFn) {
                    if (!origFn) return;
                    proto[name] = function patchedTexFunction(...args) {
                        try {
                            // detect typical signature: last argument is source (HTMLImageElement/Canvas/Video/ImageBitmap)
                            let width = 0, height = 0, source = null, boundTexture = null;
                            // If signature (target, level, internalformat, format, type, source)
                            if (args.length >= 6 && isSourceType(args[5])) {
                                source = args[5];
                                width = source.width || source.videoWidth || 0;
                                height = source.height || source.videoHeight || 0;
                            } else if (args.length >= 9 && typeof args[3] === 'number') {
                                // texImage2D(target, level, internalformat, width, height, border, format, type, pixels)
                                width = args[3];
                                height = args[4];
                            } else if (args.length >= 7 && isTypedArray(args[args.length - 1])) {
                                // typed array variant: (target, level, internalformat, width, height, border, format, type, pixels) or similar
                                if (typeof args[3] === 'number') { width = args[3]; height = args[4]; }
                            }

                            // find bound texture for this target if possible
                            try {
                                const target = args[0];
                                const map = contextBindings.get(this);
                                if (map) boundTexture = map.get(target);
                            } catch (e) { /* ignore */ }

                            // Optionally downscale source images/canvases when config.textureQuality < 'high' and source is same-origin or allowed
                            if (source && config.textureQuality && config.textureQuality !== 'high') {
                                const scale = { high: 1, medium: 0.5, low: 0.25 }[config.textureQuality] || 1;
                                if (scale < 1 && width > 4 && height > 4) {
                                    // If textureQualityScope is 'safe' only downscale same-origin images (avoid tainting)
                                    let safe = true;
                                    try {
                                        if (source instanceof HTMLImageElement) {
                                            const src = source.currentSrc || source.src || '';
                                            if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
                                                const url = new URL(src, location.href);
                                                safe = (url.origin === location.origin) || config.textureQualityScope === 'aggressive';
                                            }
                                        } else {
                                            // Canvas/ImageBitmap/OffscreenCanvas are safe
                                            safe = true;
                                        }
                                    } catch (e) { safe = false; }

                                    if (safe) {
                                        const newW = Math.max(1, Math.floor(width * scale));
                                        const newH = Math.max(1, Math.floor(height * scale));
                                        const resized = createResizedCanvas(source, newW, newH);
                                        if (resized) {
                                            // replace source in args (source is at index 5 usually)
                                            const newArgs = args.slice();
                                            // find index of the source arg
                                            for (let i = args.length - 1; i >= 0; i--) {
                                                if (args[i] === source) {
                                                    newArgs[i] = resized;
                                                    break;
                                                }
                                            }
                                            args = newArgs;
                                            width = newW;
                                            height = newH;
                                            source = resized;
                                        }
                                    }
                                }
                            }

                            // call original
                            const result = origFn.apply(this, args);

                            // update size tracking
                            if (width && height && boundTexture) {
                                try {
                                    const newSize = estimateSizeBytesFromWidthHeight(width, height, 4);
                                    const prev = textureMap.get(boundTexture) || { sizeBytes: 0, context: this };
                                    const prevSize = prev.sizeBytes || 0;
                                    prev.sizeBytes = newSize;
                                    prev.lastUsed = Date.now();
                                    prev.context = this;
                                    textureMap.set(boundTexture, prev);
                                    totalTextureBytes += Math.max(0, newSize - prevSize);
                                } catch (e) { /* ignore */ }
                            }

                            return result;
                        } catch (e) {
                            // fallback to original in case of any error
                            try { return origFn.apply(this, args); } catch (err) { log(LOGLEVEL.ERROR, `${name} ultimate fallback failed`, err); }
                        }
                    };
                }

                patchTexFunction('texImage2D', originals.texImage2D);
                patchTexFunction('texSubImage2D', originals.texSubImage2D);
            });

            log(LOGLEVEL.INFO, 'WebGL texture patches installed (tracking & optional downscaling).');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'installWebGLTexturePatches failed', e);
        }
    }

    function tryGCTexturesTo(targetMB) {
        if (!config.enableAggressiveTextureGC) return;
        try {
            const targetBytes = Math.max(0, Math.floor(targetMB * 1048576));
            if (totalTextureBytes <= targetBytes) return;
            // Sort textures by lastUsed (ascending) and delete oldest first
            const entries = Array.from(textureMap.entries());
            entries.sort((a, b) => (a[1].lastUsed || 0) - (b[1].lastUsed || 0));
            for (const [tex, info] of entries) {
                try {
                    if (!info || !info.context) continue;
                    if (typeof info.context.deleteTexture === 'function') {
                        info.context.deleteTexture(tex);
                    } else if (typeof WebGLRenderingContext !== 'undefined' && info.context instanceof WebGLRenderingContext) {
                        info.context.deleteTexture(tex);
                    }
                    // deleteTexture handler will update totalTextureBytes when called (we also remove here to be safe)
                    if (textureMap.has(tex)) {
                        totalTextureBytes = Math.max(0, totalTextureBytes - (info.sizeBytes || 0));
                        textureMap.delete(tex);
                    }
                    if (totalTextureBytes <= targetBytes) break;
                } catch (e) {
                    // ignore deletion errors
                }
            }
            log(LOGLEVEL.INFO, `Aggressive GC attempted. Remaining texture memory: ${formatMB(totalTextureBytes)} MB`);
        } catch (e) {
            log(LOGLEVEL.ERROR, 'tryGCTexturesTo failed', e);
        }
    }

    // ---------- Draw-call monitoring & auto-adjust ----------
    function installDrawCallPatches() {
        try {
            const protoList = [];
            if (typeof WebGLRenderingContext !== 'undefined') protoList.push(WebGLRenderingContext.prototype);
            if (typeof WebGL2RenderingContext !== 'undefined') protoList.push(WebGL2RenderingContext.prototype);

            protoList.forEach(proto => {
                if (!proto) return;
                if (!originals.drawElements && proto.drawElements) originals.drawElements = proto.drawElements;
                if (!originals.drawArrays && proto.drawArrays) originals.drawArrays = proto.drawArrays;

                if (proto.drawElements) {
                    proto.drawElements = function patchedDrawElements(...args) {
                        drawsThisSecond++;
                        return originals.drawElements.apply(this, args);
                    };
                }
                if (proto.drawArrays) {
                    proto.drawArrays = function patchedDrawArrays(...args) {
                        drawsThisSecond++;
                        return originals.drawArrays.apply(this, args);
                    };
                }
            });
            log(LOGLEVEL.INFO, 'Draw call patches installed');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'installDrawCallPatches failed', e);
        }
    }

    function drawCallMonitorStep() {
        try {
            const now = performance.now();
            if (now - lastDrawsReset >= 1000) {
                const ds = drawsThisSecond;
                lastDrawsReset = now;
                drawsThisSecond = 0;
                // compute draws per frame approx using fps
                const drawsPerFrame = fps > 0 ? Math.round(ds / Math.max(1, fps)) : ds;
                // If draws per frame exceed threshold, escalate optimizations (gentle)
                if (config.monitorDrawCalls && drawsPerFrame > (config.drawCallThresholdPerFrame || DEFAULT_CONFIG.drawCallThresholdPerFrame)) {
                    log(LOGLEVEL.INFO, 'High draw-call pressure detected. drawsThisSecond=', ds, 'fps=', fps, 'draws/frame~', drawsPerFrame);
                    // Increase optimization level by decreasing texture quality or lowering DPR temporarily
                    // Conservative action: temporarily lower textureQuality or lower DPR if available
                    if (config.textureQuality === 'high') {
                        config.textureQuality = 'medium';
                        saveConfig();
                        showNotification('High draw-call pressure: auto-set textureQuality -> medium', 'warning');
                    } else if (config.overrideDevicePixelRatio && config.devicePixelRatioTarget > 0.8) {
                        config.devicePixelRatioTarget = Math.max(0.7, config.devicePixelRatioTarget - 0.2);
                        saveConfig();
                        showNotification('High draw-call pressure: reduced devicePixelRatio target', 'warning');
                    } else if (!config.enableAggressiveTextureGC) {
                        // If nothing else, suggest enabling aggressive GC
                        showNotification('High draw-call pressure detected. Consider enabling aggressive texture GC in dashboard.', 'warning');
                    } else {
                        // If aggressive GC enabled, perform a GC pass
                        tryGCTexturesTo(Math.max(64, computeTextureMemoryCapMB() * 0.6));
                    }
                }
            }
        } catch (e) {
            log(LOGLEVEL.DEBUG, 'drawCallMonitorStep error', e);
        } finally {
            try { setTimeout(drawCallMonitorStep, 1000); } catch (e) { /* ignore */ }
        }
    }

    // ---------- rAF & FPS monitor ----------
    function setupPerformanceMonitoring() {
        let last = performance.now();
        const samples = [];
        function tick(ts) {
            const now = ts || performance.now();
            const dt = now - last;
            last = now;
            samples.push(dt);
            if (samples.length > 120) samples.shift();
            const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
            fps = Math.round(1000 / (avg || 16.67));
            performanceMetrics.avgFPS = performanceMetrics.avgFPS ? (performanceMetrics.avgFPS * 0.9 + fps * 0.1) : fps;
            if (performance && performance.memory) {
                try { performanceMetrics.memoryUsageMB = (performance.memory.usedJSHeapSize || 0) / 1048576; } catch (e) { /* ignore */ }
            }
            updateDashboard(dt);
            requestAnimationFrame(tick);
        }
        try { requestAnimationFrame(tick); } catch (e) { log(LOGLEVEL.DEBUG, 'initial RAF failed', e); }
        // start draw-call monitor
        drawCallMonitorStep();
        // periodic expensive checks
        setInterval(() => {
            // if aggressive GC is on and we exceed cap, run GC
            try {
                const capMB = computeTextureMemoryCapMB();
                if (config.enableAggressiveTextureGC && (totalTextureBytes / 1048576) > capMB) {
                    log(LOGLEVEL.INFO, `Texture memory ${formatMB(totalTextureBytes)}MB > cap ${capMB}MB. Triggering GC.`);
                    tryGCTexturesTo(Math.max(64, capMB * 0.6));
                }
            } catch (e) { /* ignore */ }
        }, 5000);
    }

    // ---------- Dashboard UI ----------
    function setupDashboard() {
        try {
            if (dashboard) return;

            const css = `
                #bloxd-dashboard { position: fixed; left:${config.dashboardPos.left}px; top:${config.dashboardPos.top}px; background: rgba(18,18,22,0.92); color: #eee; padding: 12px; border-radius: 10px; z-index: 999999; width: 320px; font-family: "Segoe UI", system-ui, sans-serif; font-size: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.03); }
                #bloxd-dashboard .hdr { display:flex; justify-content:space-between; align-items:center; cursor: move; margin-bottom:8px; }
                #bloxd-dashboard .row { display:flex; justify-content:space-between; align-items:center; margin:6px 0; gap:8px; }
                #bloxd-dashboard label { opacity: .85; }
                #bloxd-dashboard input[type="range"] { width: 160px; }
                #bloxd-dashboard select, #bloxd-dashboard button { width: 100%; padding:6px; border-radius:6px; border:none; background:#3498db; color:white; font-weight:600; cursor:pointer; }
                #bloxd-dashboard button#bloxd-reset { background:#e67e22; }
                #bloxd-dashboard .small { font-size:11px; opacity:.8; }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);

            dashboard = document.createElement('div');
            dashboard.id = 'bloxd-dashboard';
            dashboard.innerHTML = `
                <div class="hdr"><div>Bloxd Optimizer v${SCRIPT_VER}</div><div class="small">Ctrl+Shift+O</div></div>
                <div class="row"><div>FPS</div><div id="bloxd-fps">0</div></div>
                <div class="row"><div>Frame</div><div id="bloxd-frame">0 ms</div></div>
                <div class="row"><div>Memory</div><div id="bloxd-mem">0 MB</div></div>
                <div class="row"><div>VRAM est</div><div id="bloxd-vram">0 MB</div></div>
                <div class="row"><div>Draws/sec</div><div id="bloxd-draws">0</div></div>
                <hr/>
                <div class="row"><label>FPS Limit</label><input type="checkbox" id="bloxd-toggle-fps"></div>
                <div class="row"><label>Target FPS</label><input id="bloxd-targetfps" type="range" min="30" max="240" step="1"><div id="bloxd-targetfps-val">144</div></div>
                <div class="row"><label>Texture Quality</label>
                    <select id="bloxd-texture-quality">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div class="row"><label>Aggressive Texture GC</label><input type="checkbox" id="bloxd-toggle-gc"></div>
                <div class="row"><label>Override DPR (exp.)</label><input type="checkbox" id="bloxd-toggle-dpr"></div>
                <div class="row"><label>DPR Target</label><input id="bloxd-dpr-target" type="range" min="0.5" max="1.5" step="0.1"><div id="bloxd-dpr-val">1.0</div></div>
                <div class="row"><label>Async Images</label><input type="checkbox" id="bloxd-toggle-img"></div>
                <div style="margin-top:8px;">
                    <button id="bloxd-reset">Reset / Reload</button>
                </div>
            `;

            document.body.appendChild(dashboard);

            // cache elements
            elements.fps = document.getElementById('bloxd-fps');
            elements.frame = document.getElementById('bloxd-frame');
            elements.mem = document.getElementById('bloxd-mem');
            elements.vram = document.getElementById('bloxd-vram');
            elements.draws = document.getElementById('bloxd-draws');

            elements.toggleFPS = document.getElementById('bloxd-toggle-fps');
            elements.targetFPS = document.getElementById('bloxd-targetfps');
            elements.targetFPSVal = document.getElementById('bloxd-targetfps-val');
            elements.textureQuality = document.getElementById('bloxd-texture-quality');
            elements.toggleGC = document.getElementById('bloxd-toggle-gc');
            elements.toggleDPR = document.getElementById('bloxd-toggle-dpr');
            elements.dprTarget = document.getElementById('bloxd-dpr-target');
            elements.dprVal = document.getElementById('bloxd-dpr-val');
            elements.toggleImg = document.getElementById('bloxd-toggle-img');
            elements.resetBtn = document.getElementById('bloxd-reset');

            // init states
            elements.toggleFPS.checked = !!config.enableFPSLimit;
            elements.targetFPS.value = config.targetFPS;
            elements.targetFPSVal.textContent = config.targetFPS;
            elements.textureQuality.value = config.textureQuality || 'high';
            elements.toggleGC.checked = !!config.enableAggressiveTextureGC;
            elements.toggleDPR.checked = !!config.overrideDevicePixelRatio;
            elements.dprTarget.value = config.devicePixelRatioTarget || 1.0;
            elements.dprVal.textContent = String(config.devicePixelRatioTarget || 1.0);
            elements.toggleImg.checked = !!config.enableImageAsyncDecode;

            // listeners
            elements.toggleFPS.addEventListener('change', () => { config.enableFPSLimit = !!elements.toggleFPS.checked; saveConfig(); showNotification(`FPS limit ${config.enableFPSLimit ? 'enabled' : 'disabled'}`, 'info'); });
            elements.targetFPS.addEventListener('input', () => { elements.targetFPSVal.textContent = elements.targetFPS.value; });
            elements.targetFPS.addEventListener('change', () => { config.targetFPS = parseInt(elements.targetFPS.value, 10); saveConfig(); showNotification(`Target FPS set to ${config.targetFPS}`, 'success'); });
            elements.textureQuality.addEventListener('change', () => { config.textureQuality = elements.textureQuality.value; saveConfig(); showNotification('Texture quality changed (reload may be required)', 'info'); });
            elements.toggleGC.addEventListener('change', () => { config.enableAggressiveTextureGC = !!elements.toggleGC.checked; saveConfig(); showNotification('Aggressive texture GC toggled', 'info'); });
            elements.toggleDPR.addEventListener('change', () => {
                config.overrideDevicePixelRatio = !!elements.toggleDPR.checked;
                saveConfig();
                if (config.overrideDevicePixelRatio) installDevicePixelRatioOverride();
                showNotification('DPR override toggled (reload recommended for all effects)', 'info');
            });
            elements.dprTarget.addEventListener('input', () => {
                elements.dprVal.textContent = elements.dprTarget.value;
            });
            elements.dprTarget.addEventListener('change', () => {
                config.devicePixelRatioTarget = parseFloat(elements.dprTarget.value);
                saveConfig();
                showNotification('DPR target changed (reload recommended)', 'info');
            });
            elements.toggleImg.addEventListener('change', () => {
                config.enableImageAsyncDecode = !!elements.toggleImg.checked;
                saveConfig();
                showNotification('Async image decode toggled (reload recommended)', 'info');
            });

            elements.resetBtn.addEventListener('click', () => {
                if (confirm('Reset optimizer settings to defaults? This will reload the page.')) {
                    GM_deleteValue(SCRIPT_KEY);
                    showNotification('Settings reset. Reloading...', 'success');
                    setTimeout(() => location.reload(), 700);
                }
            });

            // draggable
            (function makeDraggable() {
                const header = dashboard.querySelector('.hdr');
                let dragging = false, sx = 0, sy = 0, baseLeft = 0, baseTop = 0;
                header.addEventListener('pointerdown', (ev) => {
                    dragging = true;
                    sx = ev.clientX; sy = ev.clientY;
                    baseLeft = dashboard.offsetLeft; baseTop = dashboard.offsetTop;
                    header.setPointerCapture(ev.pointerId);
                });
                header.addEventListener('pointermove', (ev) => {
                    if (!dragging) return;
                    const dx = ev.clientX - sx, dy = ev.clientY - sy;
                    const nl = Math.max(0, baseLeft + dx), nt = Math.max(0, baseTop + dy);
                    dashboard.style.left = nl + 'px';
                    dashboard.style.top = nt + 'px';
                });
                header.addEventListener('pointerup', (ev) => {
                    if (!dragging) return;
                    dragging = false;
                    header.releasePointerCapture(ev.pointerId);
                    config.dashboardPos = { left: dashboard.offsetLeft, top: dashboard.offsetTop };
                    saveConfig();
                });
            })();

            dashboard.classList.remove('active'); // start hidden
            // keyboard shortcut toggle (Ctrl+Shift+O)
            window.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
                    dashboard.classList.toggle('active');
                }
            });

            log(LOGLEVEL.INFO, 'Dashboard initialized');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'setupDashboard failed', e);
        }
    }

    function updateDashboard(frameTime) {
        try {
            if (!dashboard) return;
            if (elements.fps) elements.fps.textContent = String(fps);
            if (elements.frame) elements.frame.textContent = `${(frameTime || 0).toFixed(1)} ms`;
            if (elements.mem) elements.mem.textContent = `${(performanceMetrics.memoryUsageMB || 0).toFixed(1)} MB`;
            if (elements.vram) elements.vram.textContent = `${formatMB(totalTextureBytes)} MB`;
            if (elements.draws) {
                // show draws/sec approximated via last second's record (drawsThisSecond resets each second)
                elements.draws.textContent = String(drawsThisSecond || 0);
            }
        } catch (e) { /* ignore UI update errors */ }
    }

    // ---------- MutationObserver optional proactive DOM cleanup ----------
    let domObserver = null;
    function installDOMObserver() {
        if (!config.enableDOMCleanup) return;
        try {
            const badSelectors = ['iframe[src*="ads"]', 'iframe[src*="doubleclick"]', 'iframe[src*="googlesyndication"]', 'script[src*="analytics"]'];
            domObserver = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        try {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                for (const sel of badSelectors) {
                                    if (node.matches && node.matches(sel)) {
                                        node.remove();
                                        log(LOGLEVEL.DEBUG, 'Removed node via DOM observer', sel);
                                        break;
                                    }
                                }
                            }
                        } catch (e) { /* ignore per-node errors */ }
                    }
                }
            });
            domObserver.observe(document.documentElement || document.body || document, { childList: true, subtree: true });
            originals.domObserver = domObserver;
            log(LOGLEVEL.INFO, 'Proactive DOM observer installed');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'installDOMObserver failed', e);
        }
    }

    // ---------- Register menu commands ----------
    function registerMenuCommands() {
        try {
            GM_registerMenuCommand('🚀 Toggle Dashboard', () => {
                if (!dashboard) showNotification('Dashboard not ready', 'warning');
                else dashboard.classList.toggle('active');
            });
            GM_registerMenuCommand('🧹 Manual Cleanup (canvases+DOM)', () => {
                try { document.querySelectorAll('canvas').forEach(c => { try { const ctx = c.getContext && c.getContext('2d'); if (ctx) ctx.clearRect(0, 0, c.width, c.height); } catch (e) { } }); } catch (e) { }
                showNotification('Manual cleanup performed', 'success');
            });
            GM_registerMenuCommand('📊 Performance Report', () => {
                console.log('Bloxd Optimizer Performance Report', {
                    fps, avgFPS: Math.round(performanceMetrics.avgFPS), memMB: performanceMetrics.memoryUsageMB, vramMB: formatMB(totalTextureBytes), textures: textureMap.size
                });
                showNotification('Performance report logged to console', 'info');
            });
            GM_registerMenuCommand('🔄 Reset settings', () => {
                if (confirm('Reset optimizer settings to defaults? This will reload the page.')) {
                    GM_deleteValue(SCRIPT_KEY);
                    showNotification('Reset done. Reloading...', 'success');
                    setTimeout(() => location.reload(), 600);
                }
            });
        } catch (e) {
            log(LOGLEVEL.DEBUG, 'registerMenuCommands failed', e);
        }
    }

    // ---------- Cleanup & restore ----------
    function cleanupAll() {
        try {
            if (domObserver && typeof domObserver.disconnect === 'function') domObserver.disconnect();
            if (originals.createElement) Document.prototype.createElement = originals.createElement;
            if (originals.Image) window.Image = originals.Image;
            if (originals.WebSocket) window.WebSocket = originals.WebSocket;
            // restore WebGL prototypes if possible
            try {
                if (originals.createTexture && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.createTexture = originals.createTexture;
                if (originals.deleteTexture && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.deleteTexture = originals.deleteTexture;
                if (originals.bindTexture && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.bindTexture = originals.bindTexture;
                if (originals.texImage2D && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.texImage2D = originals.texImage2D;
                if (originals.texSubImage2D && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.texSubImage2D = originals.texSubImage2D;
                if (originals.drawElements && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.drawElements = originals.drawElements;
                if (originals.drawArrays && typeof WebGLRenderingContext !== 'undefined') WebGLRenderingContext.prototype.drawArrays = originals.drawArrays;
                // also for WebGL2 if present
                if (typeof WebGL2RenderingContext !== 'undefined') {
                    if (originals.createTexture && WebGL2RenderingContext.prototype.createTexture) WebGL2RenderingContext.prototype.createTexture = originals.createTexture;
                    if (originals.deleteTexture && WebGL2RenderingContext.prototype.deleteTexture) WebGL2RenderingContext.prototype.deleteTexture = originals.deleteTexture;
                    if (originals.bindTexture && WebGL2RenderingContext.prototype.bindTexture) WebGL2RenderingContext.prototype.bindTexture = originals.bindTexture;
                    if (originals.texImage2D && WebGL2RenderingContext.prototype.texImage2D) WebGL2RenderingContext.prototype.texImage2D = originals.texImage2D;
                    if (originals.texSubImage2D && WebGL2RenderingContext.prototype.texSubImage2D) WebGL2RenderingContext.prototype.texSubImage2D = originals.texSubImage2D;
                    if (originals.drawElements && WebGL2RenderingContext.prototype.drawElements) WebGL2RenderingContext.prototype.drawElements = originals.drawElements;
                    if (originals.drawArrays && WebGL2RenderingContext.prototype.drawArrays) WebGL2RenderingContext.prototype.drawArrays = originals.drawArrays;
                }
            } catch (e) { /* ignore */ }

            // restore devicePixelRatio if we patched it
            try {
                if (originals.devicePixelRatioDescriptor) {
                    Object.defineProperty(window, 'devicePixelRatio', originals.devicePixelRatioDescriptor);
                }
            } catch (e) { /* ignore */ }

            if (dashboard) {
                try { dashboard.remove(); } catch (e) { /* ignore */ }
                dashboard = null;
            }
            log(LOGLEVEL.INFO, 'Cleaned up and restored originals');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'cleanupAll error', e);
        }
    }

    // ---------- Initialization ----------
    function init() {
        loadConfig();
        registerMenuCommands();

        // install features early
        if (config.overrideDevicePixelRatio) {
            try {
                // save original descriptor if possible
                const origDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
                if (origDesc) originals.devicePixelRatioDescriptor = origDesc;
            } catch (e) { /* ignore */ }
            installDevicePixelRatioOverride();
        }

        if (config.enableImageAsyncDecode) installImageAsyncDecode();
        if (config.optimizeWebSocket) installWebSocketProxy();

        // Install WebGL patches early
        if (config.enableGPUOptimization) {
            installWebGLTexturePatches();
            if (config.monitorDrawCalls) installDrawCallPatches();
        }

        // Install DPR override in case user toggles later (reinstallable)
        setupDashboard();
        setupPerformanceMonitoring();

        // install DOM observer if desired (deferred until DOM ready)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                try {
                    if (config.enableDOMCleanup) installDOMObserver();
                } catch (e) { /* ignore */ }
            }, { once: true });
        } else {
            if (config.enableDOMCleanup) installDOMObserver();
        }

        // start WebWorker auto-adjust (if enabled)
        try {
            if (config.enableWebWorkerOffload) {
                setupSmartWorker();
            }
        } catch (e) { log(LOGLEVEL.DEBUG, 'setupSmartWorker error', e); }

        // periodic save (keep config updated)
        setInterval(() => saveConfig(), 60 * 1000);

        // cleanup on unload
        window.addEventListener('beforeunload', cleanupAll);

        showNotification(`Optimizer v${SCRIPT_VER} initialized`, 'success');
    }

    // ---------- Smart Worker (offload auto-adjust logic) ----------
    let smartWorker = null;
    function setupSmartWorker() {
        if (typeof Worker === 'undefined') return;
        try {
            const code = `
                let samples = [];
                let last = 0;
                let optLevel = 0;
                let targetFPS = 144;
                let enabled = true;
                self.onmessage = (e) => {
                    const d = e.data || {};
                    if (d.type === 'config') {
                        targetFPS = d.targetFPS || targetFPS;
                        enabled = !!d.enabled;
                        optLevel = d.optLevel || optLevel;
                    } else if (d.type === 'fps') {
                        const now = performance.now();
                        samples.push({t: now, v: d.value || 0});
                        while (samples.length && (now - samples[0].t) > 15000) samples.shift();
                        if (enabled && now - last > 5000) {
                            last = now;
                            if (samples.length > 10) {
                                const avg = samples.reduce((a,b)=>a+b.v,0)/samples.length;
                                if (avg < targetFPS * 0.85 && optLevel < 5) { optLevel++; self.postMessage({type:'opt', level: optLevel}); }
                                else if (avg > targetFPS * 1.05 && optLevel > 0) { optLevel--; self.postMessage({type:'opt', level: optLevel}); }
                            }
                        }
                    }
                };
            `;
            smartWorker = new Worker(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })));
            smartWorker.onmessage = (e) => {
                const d = e.data || {};
                if (d.type === 'opt' && typeof d.level === 'number') {
                    applyOptimizationLevel(d.level);
                    showNotification(`Auto-adjust: optimization level ${d.level}`, 'info');
                }
            };
            // post initial configuration
            smartWorker.postMessage({ type: 'config', targetFPS: config.targetFPS, enabled: config.enableAutoOptimization, optLevel: 0 });
            // schedule periodic fps reports
            setInterval(() => {
                try { smartWorker.postMessage({ type: 'fps', value: fps }); } catch (e) {}
            }, 3000);
            log(LOGLEVEL.INFO, 'Smart worker started');
        } catch (e) {
            log(LOGLEVEL.ERROR, 'setupSmartWorker failed', e);
        }
    }

    function applyOptimizationLevel(level) {
        try {
            optimizationLevel = Math.max(0, Math.min(5, level));
            const fpsMap = [144, 120, 90, 60, 45, 30];
            config.targetFPS = fpsMap[optimizationLevel] || config.targetFPS;
            if (optimizationLevel >= 3) config.textureQuality = 'low';
            else if (optimizationLevel >= 1) config.textureQuality = 'medium';
            else config.textureQuality = DEFAULT_CONFIG.textureQuality;
            saveConfig();
            // update UI if present
            if (elements.targetFPS) { elements.targetFPS.value = config.targetFPS; elements.targetFPSVal.textContent = config.targetFPS; }
            if (elements.textureQuality) elements.textureQuality.value = config.textureQuality;
            log(LOGLEVEL.INFO, 'Applied optimization level', optimizationLevel, 'targetFPS', config.targetFPS, 'textureQuality', config.textureQuality);
        } catch (e) { log(LOGLEVEL.DEBUG, 'applyOptimizationLevel error', e); }
    }

    // ---------- Start-up ----------
    function setupPerformanceMonitoring() {
        setupPerformanceMonitoring = setupPerformanceMonitoring; // no-op to avoid eslint-like warnings
        // Implementation is above as setupPerformanceMonitoring is defined earlier in this file
        // We'll call our function that sets up RAF and monitoring
        // To avoid code duplication, call the function defined previously (declared earlier)
        try {
            // start RAF-based monitor
            (function startRAFMonitor() {
                let last = performance.now();
                const samples = [];
                function tick(ts) {
                    const now = ts || performance.now();
                    const dt = now - last;
                    last = now;
                    samples.push(dt);
                    if (samples.length > 120) samples.shift();
                    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
                    fps = Math.round(1000 / (avg || 16.67));
                    performanceMetrics.avgFPS = performanceMetrics.avgFPS ? (performanceMetrics.avgFPS * 0.9 + fps * 0.1) : fps;
                    if (performance && performance.memory) {
                        try { performanceMetrics.memoryUsageMB = (performance.memory.usedJSHeapSize || 0) / 1048576; } catch (e) {}
                    }
                    // update the draws display occasionally
                    updateDashboard(dt);
                    try { requestAnimationFrame(tick); } catch (e) { /* ignore */ }
                }
                try { requestAnimationFrame(tick); } catch (e) { log(LOGLEVEL.DEBUG, 'RAF monitor failed', e); }
            })();

            // draw-call monitor step already defined earlier
            drawCallMonitorStep();

            // periodic VRAM check every 5s
            setInterval(() => {
                try {
                    const cap = computeTextureMemoryCapMB();
                    if (totalTextureBytes / 1048576 > cap) {
                        log(LOGLEVEL.INFO, `Estimated texture memory ${formatMB(totalTextureBytes)}MB exceeds cap ${cap}MB`);
                        if (config.enableAggressiveTextureGC) {
                            tryGCTexturesTo(Math.max(64, cap * 0.6));
                        } else {
                            showNotification('VRAM estimate exceeded cap. Consider enabling Aggressive Texture GC in the dashboard.', 'warning');
                        }
                    }
                } catch (e) { /* ignore */ }
            }, 5000);

        } catch (e) {
            log(LOGLEVEL.ERROR, 'setupPerformanceMonitoring failed', e);
        }
    }

    // ---------- Start ----------
    try {
        loadConfig();
        setupDashboard();
        registerMenuCommands();
        // install early features
        if (config.overrideDevicePixelRatio) installDevicePixelRatioOverride();
        if (config.enableImageAsyncDecode) installImageAsyncDecode();
        if (config.optimizeWebSocket) installWebSocketProxy();
        if (config.enableGPUOptimization) installWebGLTexturePatches();
        if (config.monitorDrawCalls) installDrawCallPatches();
        // DOM observer might require DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (config.enableDOMCleanup) installDOMObserver();
            }, { once: true });
        } else {
            if (config.enableDOMCleanup) installDOMObserver();
        }
        // Setup smart worker if allowed
        setupSmartWorker();
        // Start monitors
        setupPerformanceMonitoring();
        // finish
        window.addEventListener('beforeunload', cleanupAll);
        log(LOGLEVEL.INFO, `Bloxd Optimizer v${SCRIPT_VER} initialized`);
        showNotification(`Bloxd Optimizer v${SCRIPT_VER} initialized`, 'success');
    } catch (e) {
        log(LOGLEVEL.ERROR, 'Initialization failed', e);
    }

})();