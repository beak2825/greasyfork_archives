// ==UserScript==
// @name         Universal Image Downloader (Optimized)
// @namespace    https://greasyfork.org/en/users/1553223-ozler365
// @version      9.1.5
// @description  Professional UI, Smart Source Scan, Strict Reader Isolation, High Performance. Fixes preview for scrambled images & prevents duplicates.
// @author       ozler365
// @license      MIT
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/js2dzcgf26keoaqoaqssapdpzr4z
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-start
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const C = {
        zh: (navigator.language || 'en').toLowerCase().includes("zh"),
        mob: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    };

    const i18n = {
        subFolder: C.zh ? "文件夹名称" : "Folder Name",
        selectAll: C.zh ? "全选" : "Select All",
        download: C.zh ? "批量下载" : "Download All",
        zip: C.zh ? "打包下载" : "ZIP Pack",
        selected: C.zh ? "已选择" : "Selected",
        rename: C.zh ? "重命名" : "Rename",
        original: C.zh ? "原名" : "Original",
        menuOpen: C.zh ? "启动下载器" : "Open Downloader",
        sort: C.zh ? "排序" : "Sort ⇅",
        clear: C.zh ? "清空" : "Clear",
        width: "Width",
        height: "Height",
        modeDef: "Default",
        modeNet: "Network",
    };

    let isNetworkMode = GM_getValue('uid_mode', 'default') === 'network';
    let sortState = 0;
    let imgData = [];
    let displayedIndices = [];
    let selIdx = new Set();
    let seen = new Set();
    let networkSeen = new Set();
    let isUiOpen = false;
    let renderScheduled = false;

    // Optimization: WeakSet for scanning and Dirty flag for event-driven scanning
    let scannedElements = new WeakSet();
    let isDirty = true;

    const canvasMap = new Map();
    const interceptedQueue = [];
    const MIN_SIZE = 50;
    const MAX_RANGE = 3000;

    // Optimization: Event listeners to trigger scans only when needed
    const triggerScan = (mutations) => {
        isDirty = true;
        // If specific elements changed, unmark them so they get re-scanned
        if (Array.isArray(mutations)) mutations.forEach(m => scannedElements.delete(m.target));
    };

    window.addEventListener('scroll', () => { isDirty = true; }, { passive: true });
    window.addEventListener('load', () => { isDirty = true; }, true);
    new MutationObserver(triggerScan).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style', 'class', 'data-src', 'data-original'] });

    function getAbsUrl(url) {
        if (!url || typeof url !== 'string' || url.startsWith('blob:') || url.startsWith('data:')) return url;
        try { return new URL(url, document.baseURI).href; } catch { return url; }
    }

    function getCanonicalUrl(url) {
        if (!url || typeof url !== 'string' || url.startsWith('data:') || url.startsWith('blob:')) return url;
        try {
            const u = new URL(url, document.baseURI);
            if (/\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff)($|\?)/i.test(u.pathname)) {
                return u.origin + u.pathname;
            }
            return u.href;
        } catch { return url; }
    }

    function getFilename(url) {
        try {
            const u = new URL(url, document.baseURI);
            let name = u.pathname.split('/').pop() || u.hostname.replace(/\./g, '_');
            return decodeURIComponent(name.split('?')[0]).replace(/[\\/:*?"<>|]/g, '_');
        } catch { return 'image_' + Date.now(); }
    }

    function detectTheme() {
        const body = document.body;
        if (!body) return 'light';
        if (['dark', 'dark-mode', 'night-mode', 'theme-dark'].some(c => document.documentElement.classList.contains(c) || body.classList.contains(c))) return 'dark';
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    }

    // Optimized Canvas Interceptor
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
        if (this._isInternal || isNetworkMode) {
            return originalDrawImage.apply(this, [image, ...args]);
        }
        originalDrawImage.apply(this, [image, ...args]);

        try {
            const w = this.canvas.width, h = this.canvas.height;
            if (w < MIN_SIZE || h < MIN_SIZE) return;
            const src = image.src;
            if (!src || src.startsWith("data:") || src.length < 20 || /thumbnail|avatar|logo|icon/.test(src)) return;

            const cSrc = getCanonicalUrl(src);
            if (!canvasMap.has(cSrc)) {
                canvasMap.set(cSrc, { url: src, width: w, height: h, instructions: [], isScrambled: false });
                interceptedQueue.push(src);
            }
            const entry = canvasMap.get(cSrc);
            let p;
            if (args.length === 8) {
                p = { sx: args[0], sy: args[1], sw: args[2], sh: args[3], dx: args[4], dy: args[5], dw: args[6], dh: args[7] };
                entry.isScrambled = true;
            } else {
                p = { sx: 0, sy: 0, sw: image.width, sh: image.height, dx: args[0] || 0, dy: args[1] || 0, dw: args[2] || image.width, dh: args[3] || image.height };
            }
            entry.instructions.push(p);
            entry.width = Math.max(entry.width, p.dx + p.dw);
            entry.height = Math.max(entry.height, p.dy + p.dh);
        } catch (e) {}
    };

    const capturedNetworkQueue = [];
    const origFetch = window.fetch;
    const origXHR = window.XMLHttpRequest.prototype.open;
    const isImageUrl = (url) => url && typeof url === 'string' && /\.(jpg|jpeg|png|webp|gif|svg|bmp|tiff)($|\?)/i.test(url) && !url.startsWith('data:');

    function addToNetworkQueue(url) {
        if (!isNetworkMode) return;
        const abs = getAbsUrl(url);
        if (abs && !networkSeen.has(abs)) {
            networkSeen.add(abs);
            capturedNetworkQueue.push(abs);
        }
    }

    window.fetch = async function (...args) {
        if (isNetworkMode) {
            try {
                const url = args[0] instanceof Request ? args[0].url : args[0];
                if (isImageUrl(url)) addToNetworkQueue(url);
            } catch (e) {}
        }
        return origFetch.apply(this, args);
    };

    window.XMLHttpRequest.prototype.open = function (method, url) {
        if (isNetworkMode && isImageUrl(url)) addToNetworkQueue(url);
        return origXHR.apply(this, arguments);
    };

    if (window.PerformanceObserver) {
        new PerformanceObserver((l) => {
            if (!isNetworkMode) return;
            l.getEntries().forEach(e => {
                if (e.initiatorType === 'img' || e.initiatorType === 'css' || isImageUrl(e.name)) addToNetworkQueue(e.name);
            });
        }).observe({ entryTypes: ["resource"] });
    }

    const getImageBlob = (url) => new Promise((resolve, reject) => {
        if (url.startsWith('data:') || url.startsWith('blob:')) return fetch(url).then(r => r.blob()).then(resolve).catch(reject);
        fetch(url, { cache: "force-cache" })
            .then(res => res.ok ? res.blob() : Promise.reject())
            .then(b => b.size > 512 ? resolve(b) : Promise.reject())
            .catch(() => GM_xmlhttpRequest({
                method: "GET", url, responseType: "blob",
                headers: { "Referer": window.location.href, "Accept": "image/*" },
                onload: (r) => (r.status === 200 && r.response.size > 512) ? resolve(r.response) : reject(),
                onerror: reject
            }));
    });

    const convertToJpeg = (blob) => new Promise((resolve) => {
        if (blob.type === 'image/jpeg') return resolve(blob);
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            const ctx = c.getContext('2d');
            ctx._isInternal = true;
            ctx.fillStyle = '#FFF'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
            c.toBlob(b => { URL.revokeObjectURL(url); resolve(b || blob); }, 'image/jpeg', 0.9);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
        img.src = url;
    });

    const unscrambleImage = (blob, ops, w, h) => new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const ctx = c.getContext('2d');
            ctx._isInternal = true;
            ops.forEach(o => ctx.drawImage(img, o.sx, o.sy, o.sw, o.sh, o.dx, o.dy, o.dw, o.dh));
            c.toBlob(b => { URL.revokeObjectURL(url); resolve(b); }, 'image/png');
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(); };
        img.src = url;
    });

    const getImageDimensions = (url) => new Promise((resolve) => {
        const img = new Image();
        const t = setTimeout(() => resolve({ ok: false }), 5000);
        img.onload = () => { clearTimeout(t); resolve({ w: img.width, h: img.height, ok: true }); };
        img.onerror = () => { clearTimeout(t); resolve({ ok: false }); };
        img.src = url;
    });

    const getPos = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.pageYOffset, left: r.left + window.pageXOffset };
    };

    async function updatePreview(imgObj, imgEl) {
        if (isNetworkMode) return;
        const d = canvasMap.get(getCanonicalUrl(imgObj.url));
        if (d?.isScrambled) {
            try {
                const b = await getImageBlob(imgObj.url);
                const ub = await unscrambleImage(b, d.instructions, d.width, d.height);
                const u = URL.createObjectURL(ub);
                imgObj.previewUrl = u;
                imgEl.src = u;
            } catch (e) {}
        }
    }

    function clearCache() {
        imgData.forEach(i => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
        imgData = []; selIdx.clear(); seen.clear(); networkSeen.clear();
        canvasMap.clear(); interceptedQueue.length = 0; capturedNetworkQueue.length = 0;
        scannedElements = new WeakSet();
        if (isUiOpen) scheduleRender();
    }

    // Optimization: Chunked scanning with main thread yielding
    async function scanPageOrdered() {
        const els = document.querySelectorAll('img, div, span, a, section, header, main, article, li, figure, canvas');
        const res = [], sm = [], loc = new Set();
        const base = window.location.href;

        let batchTime = performance.now();

        for (let i = 0; i < els.length; i++) {
            // Yield to main thread every 200 items or 12ms to prevent lag
            if (i % 200 === 0 && (performance.now() - batchTime > 12)) {
                await new Promise(r => requestAnimationFrame(r));
                batchTime = performance.now();
            }

            const el = els[i];
            if (scannedElements.has(el) || el.closest?.('.tyc-modal') || el.closest?.('.tyc-overlay')) continue;

            let cands = [];
            if (el.tagName === 'IMG') {
                [el.getAttribute('data-original'), el.getAttribute('data-src'), el.dataset.src, el.currentSrc, el.src]
                    .forEach(s => s && cands.push({ url: s, w: el.naturalWidth, h: el.naturalHeight }));
            } else if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg?.includes('url(')) {
                    bg.match(/url\(['"]?([^'"]+)['"]?\)/g)?.forEach(m => cands.push({ url: m.replace(/url\(['"]?|['"]?\)/g, ''), w: 0, h: 0 }));
                }
            }

            let best = null;
            for (let c of cands) {
                let s = c.url;
                if (!s || s === base || s.startsWith('data:')) continue;
                if (!s.startsWith('http') && !s.startsWith('blob:')) {
                    try { s = new URL(s, base).href; } catch { continue; }
                }
                const sc = s.startsWith('http') ? 3 : 2;
                if (!best || sc > best.sc) best = { src: s, w: c.w, h: c.h, sc };
            }

            if (best) {
                const cUrl = getCanonicalUrl(best.src);
                if (!seen.has(cUrl) && !loc.has(cUrl)) {
                    if (best.w > 0 && best.h > 0 && best.w < MIN_SIZE && best.h < MIN_SIZE) {
                        // Mark small image as processed so we don't re-check it
                         scannedElements.add(el);
                         loc.add(cUrl);
                         sm.push({ url: best.src, pos: getPos(el), w: best.w, h: best.h });
                    } else {
                        scannedElements.add(el);
                        loc.add(cUrl);
                        res.push({ url: best.src, pos: getPos(el), w: best.w, h: best.h });
                    }
                }
            }
        }
        const sFn = (a, b) => Math.abs(a.pos.top - b.pos.top) > 10 ? a.pos.top - b.pos.top : a.pos.left - b.pos.left;
        return [...res.sort(sFn), ...sm.sort(sFn)];
    }

    async function backgroundLoop() {
        let newData = false;

        if (!isNetworkMode) {
             while(interceptedQueue.length) {
                const u = interceptedQueue.shift();
                if (u.startsWith('blob:')) continue;
                const c = getCanonicalUrl(u), d = canvasMap.get(c);
                if(d && !seen.has(c)) {
                    seen.add(c);
                    imgData.push({ url: u, w: d.width, h: d.height, pos: { top: 999999, left: 0 } });
                    newData = true;
                }
             }
        }

        if (isNetworkMode && capturedNetworkQueue.length) {
            const batch = capturedNetworkQueue.splice(0, 20);
            const res = await Promise.all(batch.map(async u => {
                const d = await getImageDimensions(u);
                return d.ok ? { url: u, w: d.w, h: d.h } : null;
            }));
            res.forEach(i => {
                if(i) {
                    const c = getCanonicalUrl(i.url);
                    if(!seen.has(c)) { seen.add(c); imgData.push(i); newData = true; }
                }
            });
        } else if (!isNetworkMode && isUiOpen && isDirty) {
            const imgs = await scanPageOrdered();
            isDirty = false;

            imgs.forEach(i => {
                const c = getCanonicalUrl(i.url);
                if (!seen.has(c)) {
                    seen.add(c); imgData.push(i); newData = true;
                } else {
                    const ex = imgData.find(x => getCanonicalUrl(x.url) === c);
                    if(ex && (!ex.pos || ex.pos.top === 99999)) ex.pos = i.pos;
                }
            });
        }

        if (isUiOpen && newData) scheduleRender();
        setTimeout(backgroundLoop, 1000);
    }

    function scheduleRender() {
        if (renderScheduled) return;
        renderScheduled = true;
        requestAnimationFrame(() => { renderScheduled = false; render(); });
    }

    function render() {
        const grid = document.getElementById("tyc-grid"), cnt = document.getElementById("tyc-cnt");
        if (!grid || !cnt) return;

        const gV = (id) => parseInt(document.getElementById(id).value);
        const gC = (id) => document.getElementById(id).checked;
        const minW = gC("tyc-chk-min-w") ? (gV("tyc-min-w")||MIN_SIZE) : MIN_SIZE;
        const maxW = gC("tyc-chk-max-w") ? (gV("tyc-max-w")||99999) : 99999;
        const minH = gC("tyc-chk-min-h") ? (gV("tyc-min-h")||MIN_SIZE) : MIN_SIZE;
        const maxH = gC("tyc-chk-max-h") ? (gV("tyc-max-h")||99999) : 99999;

        let f = imgData.filter(i => i.w >= minW && i.w <= maxW && i.h >= minH && i.h <= maxH);
        if (sortState === 1) f.sort((a, b) => getFilename(a.url).localeCompare(getFilename(b.url), undefined, { numeric: true, sensitivity: 'base' }));
        else if (sortState === 2) f.sort((a, b) => (b.w * b.h) - (a.w * a.h));
        else if (sortState === 3) f.sort((a, b) => (a.w * a.h) - (b.w * b.h));
        else if (!isNetworkMode && f[0]?.pos) f.sort((a, b) => Math.abs(a.pos.top - b.pos.top) > 10 ? a.pos.top - b.pos.top : a.pos.left - b.pos.left);

        displayedIndices = f;
        selIdx.clear();
        const all = document.getElementById("tyc-all")?.checked;
        const frag = document.createDocumentFragment();

        f.forEach((img, idx) => {
            if (all) selIdx.add(idx);
            const scr = canvasMap.get(getCanonicalUrl(img.url))?.isScrambled;
            const d = document.createElement("div");
            d.className = "tyc-card" + (all ? " selected" : "");
            const i = document.createElement("img");
            i.loading = "lazy";

            if (img.previewUrl) i.src = img.previewUrl;
            else {
                i.src = img.url;
                if (scr) updatePreview(img, i);
            }
            d.innerHTML = `<div style="position:absolute;bottom:0;right:0;background:rgba(0,0,0,0.6);color:#fff;font-size:10px;padding:2px 4px;border-top-left-radius:4px">${img.w}x${img.h}</div>`;
            d.prepend(i);
            d.onclick = () => {
                selIdx.has(idx) ? selIdx.delete(idx) : selIdx.add(idx);
                d.classList.toggle("selected");
                cnt.innerText = `${i18n.selected}: ${selIdx.size}`;
            };
            frag.appendChild(d);
        });

        grid.innerHTML = "";
        grid.appendChild(frag);
        cnt.innerText = `${i18n.selected}: ${selIdx.size}`;
    }

    function createUI() {
        const dark = detectTheme() === 'dark';
        const c = dark ? { m: '#1f2937', h: '#111827', b: '#374151', g: '#0f1419', c: '#1f2937', i: '#374151', t: '#f3f4f6' } : { m: '#fcfcfc', h: '#fff', b: '#e0e0e0', g: '#f9fafb', c: '#fff', i: '#fff', t: '#1f2937' };
        const css = `
            .tyc-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483640;display:flex;justify-content:center;align-items:center;font-family:sans-serif;pointer-events:none}
            .tyc-modal{width:90vw;height:85vh;background:${c.m};color:${c.t};border-radius:12px;display:flex;flex-direction:column;overflow:hidden;resize:both;min-width:650px;box-shadow:0 10px 40px rgba(0,0,0,.4);border:1px solid #444;pointer-events:auto}
            .tyc-header{padding:12px 20px;background:${c.h};border-bottom:1px solid ${c.b};display:flex;flex-direction:column;gap:10px;cursor:move;user-select:none}
            .tyc-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;width:100%}
            .tyc-input{padding:6px 10px;border:1px solid #ccc;border-radius:4px;width:120px;font-size:13px;background:${c.i};color:${c.t}}
            .tyc-input-sm{width:50px;padding:4px;text-align:right}
            .tyc-btn{padding:6px 12px;border-radius:6px;border:none;cursor:pointer;font-weight:600;font-size:12px;color:#fff;min-width:70px;transition:.2s}
            .tyc-btn-blue{background:#2563eb}.tyc-btn-green{background:#10b981}.tyc-btn-red{background:#ef4444}.tyc-btn-purple{background:#8b5cf6}
            .tyc-btn-gray{background:${dark?'#374151':'#f3f4f6'};color:${c.t};border:1px solid ${c.b}}
            .tyc-grid{flex:1;overflow-y:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));grid-auto-rows:220px;gap:12px;background:${c.g}}
            .tyc-card{background:${c.c};border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;border:2px solid transparent}
            .tyc-card:hover{transform:translateY(-2px);box-shadow:0 4px 6px rgba(0,0,0,0.1)}
            .tyc-card.selected{border-color:#2563eb}
            .tyc-card.selected::before{content:"✓";position:absolute;top:5px;right:5px;background:#2563eb;color:#fff;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;z-index:2}
            .tyc-card img{width:100%;height:100%;object-fit:cover}
            .range-wrapper{position:relative;height:16px;width:100%;margin:6px 0;display:flex;align-items:center}
            .range-track-active{position:absolute;height:4px;background:#2563eb;pointer-events:none;opacity:0.3}
            .range-track-active.enabled{opacity:1}
            .range-wrapper input[type=range]{-webkit-appearance:none;position:absolute;width:100%;background:none;pointer-events:none;margin:0;outline:none}
            .range-wrapper input[type=range]::-webkit-slider-thumb{pointer-events:auto;-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#9ca3af;cursor:pointer;border:2px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.2)}
            .range-wrapper input[type=range]:not(:disabled)::-webkit-slider-thumb{background:#2563eb}
        `;
        document.body.insertAdjacentHTML("beforeend", `<div class="tyc-overlay"><style>${css}</style><div class="tyc-modal" id="tyc-modal"><div class="tyc-header" id="tyc-drag"><div class="tyc-row"><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:600"><input type="checkbox" id="tyc-all" checked><span>${i18n.selectAll}</span></label><div style="height:20px;border-left:1px solid ${c.b};margin:0 5px"></div><input type="text" id="tyc-fold" class="tyc-input" placeholder="${i18n.subFolder}"><button class="tyc-btn tyc-btn-gray" id="tyc-ren">${i18n.rename}</button><div style="flex:1"></div><button class="tyc-btn ${isNetworkMode?'tyc-btn-purple':'tyc-btn-gray'}" id="tyc-mode">${isNetworkMode?i18n.modeNet:i18n.modeDef}</button><button class="tyc-btn tyc-btn-gray" id="tyc-sort">${i18n.sort}</button><button class="tyc-btn tyc-btn-red" id="tyc-clear">${i18n.clear}</button><button class="tyc-btn tyc-btn-gray" id="tyc-cls">✕</button></div><div style="display:flex;gap:20px;width:100%;border-top:1px solid ${c.b};padding-top:10px;margin-top:5px">${['w','h'].map(t=>`<div style="flex:1"><div class="tyc-row" style="justify-content:space-between;margin-bottom:5px"><span style="font-size:11px;font-weight:700;color:#9ca3af">${t==='w'?i18n.width:i18n.height}</span><div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#9ca3af"><input type="checkbox" id="tyc-chk-min-${t}" class="tyc-chk"><input type="number" id="tyc-min-${t}" class="tyc-input tyc-input-sm" value="${MIN_SIZE}" disabled><span>-</span><input type="number" id="tyc-max-${t}" class="tyc-input tyc-input-sm" value="${MAX_RANGE}" disabled><input type="checkbox" id="tyc-chk-max-${t}" class="tyc-chk"> px</div></div><div class="range-wrapper"><div style="position:absolute;width:100%;height:4px;background:${dark?'#374151':'#e5e7eb'};border-radius:2px"></div><div id="tyc-track-${t}" class="range-track-active"></div><input type="range" id="tyc-slide-min-${t}" min="${MIN_SIZE}" max="${MAX_RANGE}" value="${MIN_SIZE}" disabled><input type="range" id="tyc-slide-max-${t}" min="${MIN_SIZE}" max="${MAX_RANGE}" value="${MAX_RANGE}" disabled></div></div>`).join('')}</div><div class="tyc-row" style="margin-top:10px"><span class="tyc-badge" id="tyc-cnt" style="background:#1f2937;color:#fff;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700">0</span><div style="flex:1"></div><button class="tyc-btn tyc-btn-blue" id="tyc-dl" style="width:120px">${i18n.download}</button><button class="tyc-btn tyc-btn-green" id="tyc-zip" style="width:120px">${i18n.zip}</button></div></div><div class="tyc-grid" id="tyc-grid"></div></div></div>`);

        const modal = document.getElementById("tyc-modal"), drag = document.getElementById("tyc-drag");
        let isDrag = false, oX = 0, oY = 0;
        drag.onmousedown = (e) => { if(!/INPUT|BUTTON|LABEL/.test(e.target.tagName)){ isDrag=true; const r=modal.getBoundingClientRect(); oX=e.clientX-r.left; oY=e.clientY-r.top; drag.style.cursor='grabbing'; e.preventDefault(); }};
        document.onmousemove = (e) => { if(isDrag){ modal.style.position='fixed'; modal.style.left=(e.clientX-oX)+'px'; modal.style.top=(e.clientY-oY)+'px'; modal.style.margin='0'; }};
        document.onmouseup = () => { isDrag=false; drag.style.cursor='move'; };

        const upT = (t, min, max) => { const mn=parseInt(min.min), mx=parseInt(min.max), v1=parseInt(min.value), v2=parseInt(max.value); t.style.left=((v1-mn)/(mx-mn))*100+'%'; t.style.width=(((v2-mn)/(mx-mn))*100)-parseFloat(t.style.left)+'%'; };
        const upS = () => { ['w','h'].forEach(t => { const c1=document.getElementById(`tyc-chk-min-${t}`), c2=document.getElementById(`tyc-chk-max-${t}`), i1=document.getElementById(`tyc-min-${t}`), i2=document.getElementById(`tyc-max-${t}`), s1=document.getElementById(`tyc-slide-min-${t}`), s2=document.getElementById(`tyc-slide-max-${t}`), tr=document.getElementById(`tyc-track-${t}`); i1.disabled=s1.disabled=!c1.checked; i2.disabled=s2.disabled=!c2.checked; tr.classList.toggle("enabled", c1.checked||c2.checked); scheduleRender(); }); };

        ['w','h'].forEach(t => {
            const s1=document.getElementById(`tyc-slide-min-${t}`), s2=document.getElementById(`tyc-slide-max-${t}`), i1=document.getElementById(`tyc-min-${t}`), i2=document.getElementById(`tyc-max-${t}`), tr=document.getElementById(`tyc-track-${t}`);
            const sync = (e) => { let v1=parseInt(s1.value), v2=parseInt(s2.value); if(v1>v2){ if(e.target===s1){ s1.value=v2; v1=v2; }else{ s2.value=v1; v2=v1; } } i1.value=v1; i2.value=v2; upT(tr, s1, s2); scheduleRender(); };
            const syncI = () => { let v1=Math.max(MIN_SIZE, parseInt(i1.value)||MIN_SIZE), v2=Math.max(MIN_SIZE, parseInt(i2.value)||MAX_RANGE); if(v1<=MAX_RANGE) s1.value=v1; if(v2<=MAX_RANGE) s2.value=v2; upT(tr, s1, s2); scheduleRender(); };
            document.getElementById(`tyc-chk-min-${t}`).onchange = document.getElementById(`tyc-chk-max-${t}`).onchange = upS;
            s1.oninput = s2.oninput = sync; i1.oninput = i2.oninput = syncI; upT(tr, s1, s2);
        });

        document.getElementById("tyc-sort").onclick = function() { sortState=(sortState+1)%4; this.innerText=["Sort ⇅","Name 🔢","Size ⬇️","Size ⬆️"][sortState]; scheduleRender(); };
        const mb = document.getElementById("tyc-mode");
        mb.onclick = () => { isNetworkMode=!isNetworkMode; GM_setValue('uid_mode', isNetworkMode?'network':'default'); mb.innerText=isNetworkMode?i18n.modeNet:i18n.modeDef; mb.className=isNetworkMode?"tyc-btn tyc-btn-purple":"tyc-btn tyc-btn-gray"; clearCache(); };
        document.getElementById("tyc-clear").onclick = () => { if(confirm("Clear cache?")) clearCache(); };
        document.getElementById("tyc-ren").onclick = function() { this.innerText=(this.innerText===i18n.rename)?i18n.original:i18n.rename; };
        document.getElementById("tyc-all").onchange = (e) => { selIdx.clear(); if(e.target.checked) displayedIndices.forEach((_, i) => selIdx.add(i)); scheduleRender(); };
        document.getElementById("tyc-cls").onclick = () => { isUiOpen=false; document.querySelector(".tyc-overlay").remove(); };

        const dl = async (zip) => {
            const idx = Array.from(selIdx).sort((a,b)=>a-b);
            if(!idx.length) return;
            const btn = document.getElementById(zip?"tyc-zip":"tyc-dl"), ren = document.getElementById("tyc-ren").innerText===i18n.rename;
            const pre = (document.getElementById("tyc-fold").value.trim()||"")+(zip?"":"/");
            const z = zip ? new JSZip() : null, used = new Set();
            btn.disabled=true;

            for(let i=0; i<idx.length; i++){
                btn.innerText = `${Math.round(((i+1)/idx.length)*100)}%`;
                try {
                    const obj = displayedIndices[idx[i]], cd = canvasMap.get(getCanonicalUrl(obj.url));
                    let b, ext='.jpg';
                    if(cd?.isScrambled && cd.instructions.length) {
                        try { b = await unscrambleImage(await getImageBlob(obj.url), cd.instructions, cd.width, cd.height); ext='.png'; } catch {}
                    }
                    if(!b) b = await convertToJpeg(await getImageBlob(obj.url));

                    let n = ren ? `image${idx[i]+1}${ext}` : getFilename(obj.url);
                    if(!/\.(jpg|jpeg|png|webp|gif)$/i.test(n)) n+=ext;
                    if(ext==='.png' && n.endsWith('.jpg')) n=n.replace('.jpg','.png');
                    let base=n, c=1; while(used.has(n)) { const d=base.lastIndexOf('.'); n=(d>-1?base.slice(0,d):base)+`_${c++}`+(d>-1?base.slice(d):''); } used.add(n);

                    if(zip) z.file(n, b);
                    else if(!C.mob && GM_download) { const u=URL.createObjectURL(b); GM_download({url:u, name:pre+n, onload:()=>URL.revokeObjectURL(u)}); await new Promise(r=>setTimeout(r,200)); }
                    else saveAs(b, n);
                } catch(e){}
            }
            if(zip) { btn.innerText="Generating..."; z.generateAsync({type:"blob"}, m => btn.innerText=`${Math.round(m.percent)}%`).then(c => { btn.innerText="100%"; saveAs(c, document.title.replace(/[\\/:*?"<>|]/g,"_")+".zip"); setTimeout(()=>{btn.innerText=i18n.zip;btn.disabled=false},500); }); }
            else { btn.innerText=i18n.download; btn.disabled=false; }
        };
        document.getElementById("tyc-dl").onclick=()=>dl(false); document.getElementById("tyc-zip").onclick=()=>dl(true);
        render();
    }

    function openUI() { if(document.querySelector(".tyc-overlay")) return; createUI(); isUiOpen=true; triggerScan(); }

    backgroundLoop();
    window.addEventListener('keydown', (e) => { if(e.altKey && e.code==='KeyW'){ e.preventDefault(); if(document.querySelector(".tyc-overlay")){ isUiOpen=false; document.querySelector(".tyc-overlay").remove(); } else openUI(); } }, true);
    if(typeof GM_registerMenuCommand==="function") GM_registerMenuCommand(i18n.menuOpen, openUI);
})();