// ==UserScript==
// @name         Google Gemini banana 图片去除右下角水印
// @description  去除 Gemini/AI Studio 生成图片的水印。注意：处理时页面会卡UI，请耐心等待。
// @version      1.0
// @author       会飞的蛋蛋面
// @license      All Rights Reserved
// @namespace http://tampermonkey.net/
// @match        https://aistudio.google.com/*
// @match        https://ai.google.dev/*
// @match        https://gemini.google.com/*
// @require      https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.min.js
// @connect      hf-mirror.com
// @connect      cas-bridge.xethub.hf.co
// @connect      cdn.jsdelivr.net
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559640/Google%20Gemini%20banana%20%E5%9B%BE%E7%89%87%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559640/Google%20Gemini%20banana%20%E5%9B%BE%E7%89%87%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
        "use strict";
        const isTop = window.top === window.self;
        if (!isTop) return;
        const rootWin = unsafeWindow.top || unsafeWindow;
        if (rootWin.__wmWatermarkAssistantLoaded) return;
        rootWin.__wmWatermarkAssistantLoaded = true;
        const host = location.hostname;
        if (host.includes("aistudio") || host.includes("ai.google.dev")) runAiStudioInterceptor(); else if (host.includes("gemini")) runGeminiWatermarkRemover();
        function runAiStudioInterceptor() {
            const KEY = "watermark";
            const isBad = u => typeof u === "string" && u.includes(KEY);
            const origFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = (...args) => isBad(args[0]?.url || args[0]) ? Promise.reject() : origFetch.apply(this, args);
            const XHR = unsafeWindow.XMLHttpRequest.prototype;
            const origOpen = XHR.open;
            const origSend = XHR.send;
            XHR.open = function(m, u, ...a) {
                if (isBad(u)) this._block = true; else origOpen.apply(this, [ m, u, ...a ]);
            };
            XHR.send = function(...a) {
                if (!this._block) origSend.apply(this, a);
            };
        }
        function runGeminiWatermarkRemover() {
            const DB_NAME = "GeminiWatermarkDB";
            const STORE_NAME = "models";
            const MODEL_KEY = "lama_fp32_carve_20240515";
            const MODEL_URL = "https://hf-mirror.com/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx";
            const ORT_CDN_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/";
            const MODEL_SIZE = 512;
            const WM_BASE = 1024;
            const WM_BOX_W_AT_BASE = 96;
            const WM_BOX_H_AT_BASE = 96;
            const WM_BOX_RIGHT_MARGIN_AT_BASE = 16;
            const WM_BOX_BOTTOM_MARGIN_AT_BASE = 16;
            const WM_BOX_PAD_AT_BASE = 8;
            const WM_CROP_SIZE_AT_BASE = 320;
            let capturedImageBlob;
            let capturedImageBlobAt = 0;
            let ignoreCreateObjectUrlCapture = false;
            let ortSession;
            let ortSessionPromise;
            let progressBar;
            let progressRafId = 0;
            let progressValue = 0;
            let progressStartAt = 0;
            let geminiInitAt = 0;
            let wasmBufferCache = {};
            function getWasmBuffer(filename) {
                if (!wasmBufferCache[filename]) {
                    const wasmUrl = ORT_CDN_BASE + filename;
                    wasmBufferCache[filename] = gmGetArrayBuffer(wasmUrl).then(({buffer: buffer}) => {
                        buffer.byteLength;
                        return buffer;
                    });
                }
                return wasmBufferCache[filename];
            }
            const originalFetch = window.fetch;
            window.fetch = async function(input, init) {
                try {
                    let url = "";
                    if (typeof input === "string") url = input; else if (input && typeof input === "object") url = input.url || "";
                    if (url && typeof url === "string" && url.includes("ort-wasm")) {
                        const match = url.match(/ort-wasm[^/]*\.wasm$/);
                        if (match) {
                            const filename = match[0];
                            const buffer = await getWasmBuffer(filename);
                            return new Response(buffer, {
                                status: 200,
                                headers: {
                                    "Content-Type": "application/wasm"
                                }
                            });
                        }
                    }
                } catch (e) {}
                return originalFetch.apply(this, arguments);
            };
            getWasmBuffer("ort-wasm-simd.wasm");
            getOrtSession().catch(() => {});
            hookImageBlobCapture();
            scheduleAfterLoad(initGeminiUi);
            function initGeminiUi() {
                if (rootWin.__wmGeminiUiInitialized) return;
                rootWin.__wmGeminiUiInitialized = true;
                observeImages(getOrtSession);
            }
            function ensureProgressBar() {
                if (progressBar) return progressBar;
                const bar = document.createElement("div");
                bar.className = "wm-progress";
                Object.assign(bar.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    background: "#1a73e8",
                    transformOrigin: "0 0",
                    transform: "scaleX(0)",
                    opacity: "0",
                    transition: "opacity 120ms ease",
                    zIndex: 2147483647,
                    pointerEvents: "none"
                });
                document.body.appendChild(bar);
                progressBar = bar;
                return bar;
            }
            function startInferenceProgress() {
                const bar = ensureProgressBar();
                if (progressRafId) cancelAnimationFrame(progressRafId);
                progressValue = 0;
                progressStartAt = performance.now();
                bar.style.opacity = "1";
                bar.style.transform = "scaleX(0.02)";
                const step = now => {
                    const elapsed = now - progressStartAt;
                    const target = .9;
                    const duration = 3500;
                    const next = Math.min(target, elapsed / duration * target);
                    if (next > progressValue) progressValue = next;
                    bar.style.transform = `scaleX(${progressValue})`;
                    if (progressValue < target) progressRafId = requestAnimationFrame(step); else progressRafId = 0;
                };
                progressRafId = requestAnimationFrame(step);
            }
            function finishInferenceProgress() {
                if (progressRafId) cancelAnimationFrame(progressRafId);
                progressRafId = 0;
                progressValue = 1;
                progressBar.style.transform = "scaleX(1)";
                setTimeout(() => {
                    progressBar.style.opacity = "0";
                    progressBar.style.transform = "scaleX(0)";
                }, 200);
            }
            function showInferenceOverlay() {
                const overlay = document.createElement("div");
                overlay.className = "wm-inference-overlay";
                Object.assign(overlay.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2147483646,
                    pointerEvents: "none"
                });
                const box = document.createElement("div");
                Object.assign(box.style, {
                    background: "#fff",
                    padding: "24px 32px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    fontFamily: "system-ui, sans-serif"
                });
                const title = document.createElement("div");
                Object.assign(title.style, {
                    fontSize: "18px",
                    fontWeight: "500",
                    marginBottom: "8px"
                });
                title.textContent = "正在去除水印...";
                const subtitle = document.createElement("div");
                Object.assign(subtitle.style, {
                    fontSize: "14px",
                    color: "#666"
                });
                subtitle.textContent = "请稍候，约需 30 秒";
                box.appendChild(title);
                box.appendChild(subtitle);
                overlay.appendChild(box);
                document.body.appendChild(overlay);
                return overlay;
            }
            function hideInferenceOverlay(overlay) {
                if (overlay && overlay.parentNode) overlay.remove();
            }
            function scheduleAfterLoad(fn) {
                if (document.readyState === "complete") {
                    fn();
                    return;
                }
                window.addEventListener("load", fn, {
                    once: true
                });
            }
            function openDb() {
                return new Promise((resolve, reject) => {
                    const req = indexedDB.open(DB_NAME, 1);
                    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME);
                    req.onsuccess = e => resolve(e.target.result);
                    req.onerror = reject;
                });
            }
            async function deleteCachedKeys(keys) {
                const db = await openDb();
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);
                for (const key of keys) store.delete(key);
                await new Promise((resolve, reject) => {
                    tx.oncomplete = resolve;
                    tx.onerror = reject;
                    tx.onabort = reject;
                });
            }
            function resetOrtSession() {
                ortSession = null;
                ortSessionPromise = null;
            }
            async function getOrtSession() {
                if (ortSession) return ortSession;
                if (ortSessionPromise) return await ortSessionPromise;
                ortSessionPromise = (async () => {
                    await sleep(0);
                    const modelBuffer = await getModel();
                    if (!modelBuffer) throw new Error("模型加载失败");
                    await sleep(0);
                    ort.env.wasm.numThreads = 1;
                    ort.env.wasm.simd = true;
                    await sleep(0);
                    const loadStartAt = performance.now();
                    const session = await ort.InferenceSession.create(modelBuffer, {
                        executionProviders: [ "wasm" ]
                    });
                    const loadCost = Math.round(performance.now() - loadStartAt);
                    ortSession = session;
                    if (geminiInitAt) Math.round(performance.now() - geminiInitAt);
                    return session;
                })();
                return await ortSessionPromise;
            }
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            async function getModel() {
                const db = await openDb();
                const tx = db.transaction(STORE_NAME, "readonly");
                const cached = await new Promise(r => {
                    const req = tx.objectStore(STORE_NAME).get(MODEL_KEY);
                    req.onsuccess = () => r(req.result);
                });
                if (cached) return cached;
                if (typeof GM_xmlhttpRequest !== "function") throw new Error("GM_xmlhttpRequest 未授权");
                const downloadStartAt = performance.now();
                const {buffer: buffer} = await gmGetArrayBuffer(MODEL_URL);
                Math.round(performance.now() - downloadStartAt);
                const data = buffer;
                const wTx = db.transaction(STORE_NAME, "readwrite");
                wTx.objectStore(STORE_NAME).put(data, MODEL_KEY);
                return data;
            }
            function observeImages(getSession) {
                document.addEventListener("mouseover", e => {
                    const target = e.target;
                    if (target.tagName === "IMG" && target.width > 200 && !target.dataset.wmHandled) showButton(target, getSession);
                });
            }
            function showButton(img, getSession) {
                const controls = findControlsContainer(img);
                if (!controls) return;
                if (controls.querySelector(".wm-btn")) return;
                const btn = document.createElement("button");
                btn.className = "wm-btn";
                btn.innerText = "去水印下载";
                Object.assign(btn.style, {
                    background: "#4285f4",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    alignSelf: "flex-start",
                    marginBottom: "6px",
                    display: "none"
                });
                controls.insertBefore(btn, controls.firstChild);
                img.dataset.wmHandled = "1";
                bindHoverVisibility(img, btn);
                btn.onclick = async e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.altKey) {
                        btn.innerText = "清理缓存...";
                        await deleteCachedKeys([ MODEL_KEY ]);
                        resetOrtSession();
                    }
                    btn.innerText = "复制图片中...";
                    await triggerCopyAndWait(controls);
                    btn.innerText = ortSession ? "处理中..." : "加载模型...";
                    const session = await getSession();
                    btn.innerText = "处理中...";
                    await removeWatermark(img, session, !!e.shiftKey);
                    btn.innerText = "已保存";
                    setTimeout(() => btn.innerText = "去水印下载", 1200);
                };
            }
            function findControlsContainer(imgElement) {
                let node = imgElement;
                for (let i = 0; i < 10 && node; i++) {
                    const controls = node.querySelector?.(".generated-image-controls");
                    if (controls) return controls;
                    node = node.parentElement;
                }
                return null;
            }
            function bindHoverVisibility(imgElement, btn) {
                const container = imgElement.closest(".image-container");
                if (!container) return;
                container.addEventListener("mouseenter", () => {
                    btn.style.display = "inline-flex";
                });
                container.addEventListener("mouseleave", () => {
                    btn.style.display = "none";
                });
            }
            function findCopyButton(controls) {
                const copyBtn = controls.querySelector("copy-button");
                if (!copyBtn) return null;
                return copyBtn.querySelector("button") || copyBtn;
            }
            function triggerCopyAndWait(controls) {
                const copyBtn = findCopyButton(controls);
                if (!copyBtn) throw new Error("未找到复制按钮");
                const startAt = capturedImageBlobAt;
                const evt = new unsafeWindow.MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: unsafeWindow
                });
                copyBtn.dispatchEvent(evt);
                return waitForCapturedImageBlob(startAt, 300 * 1e3);
            }
            function waitForCapturedImageBlob(startAt, timeoutMs) {
                const deadline = Date.now() + timeoutMs;
                return new Promise((resolve, reject) => {
                    const tick = () => {
                        if (capturedImageBlobAt > startAt && getRecentCapturedImageBlob()) return resolve();
                        if (Date.now() >= deadline) return reject(new Error("复制图片超时"));
                        setTimeout(tick, 50);
                    };
                    tick();
                });
            }
            async function removeWatermark(imgElement, session, debugMode) {
                const t0 = performance.now();
                const source = imgElement.currentSrc || imgElement.src;
                const bitmap = await loadOriginCleanBitmap(source);
                const tLoad = performance.now();
                const w = bitmap.width || imgElement.naturalWidth || imgElement.width;
                const h = bitmap.height || imgElement.naturalHeight || imgElement.height;
                const region = getWatermarkRegion(w, h);
                if (debugMode) {
                    const debugCanvas = document.createElement("canvas");
                    debugCanvas.width = w;
                    debugCanvas.height = h;
                    const debugCtx = debugCanvas.getContext("2d");
                    debugCtx.drawImage(bitmap, 0, 0, w, h);
                    drawDebugRect(debugCtx, region.cropX, region.cropY, region.cropSize, region.cropSize, "rgba(66,133,244,.95)");
                    drawDebugRect(debugCtx, region.outX, region.outY, region.outW, region.outH, "rgba(244,67,54,.95)");
                    await downloadCanvasImage(debugCanvas, `gemini_wm_debug_${Date.now()}.png`);
                    bitmap.close();
                    return;
                }
                const dims = [ 1, 3, MODEL_SIZE, MODEL_SIZE ];
                const size = MODEL_SIZE * MODEL_SIZE;
                const patchCanvas = document.createElement("canvas");
                patchCanvas.width = MODEL_SIZE;
                patchCanvas.height = MODEL_SIZE;
                const patchCtx = patchCanvas.getContext("2d");
                patchCtx.imageSmoothingEnabled = true;
                patchCtx.imageSmoothingQuality = "high";
                patchCtx.drawImage(bitmap, region.cropX, region.cropY, region.cropSize, region.cropSize, 0, 0, MODEL_SIZE, MODEL_SIZE);
                const imageData = patchCtx.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE);
                const {data: data} = imageData;
                const floatData = new Float32Array(3 * size);
                for (let i = 0; i < size; i++) {
                    floatData[i] = data[i * 4] / 255;
                    floatData[size + i] = data[i * 4 + 1] / 255;
                    floatData[size * 2 + i] = data[i * 4 + 2] / 255;
                }
                const inputTensor = new ort.Tensor("float32", floatData, dims);
                const maskData = new Float32Array(size);
                for (let y = region.maskY0; y < region.maskY1; y++) {
                    const row = y * MODEL_SIZE;
                    for (let x = region.maskX0; x < region.maskX1; x++) maskData[row + x] = 1;
                }
                const maskTensor = new ort.Tensor("float32", maskData, [ 1, 1, MODEL_SIZE, MODEL_SIZE ]);
                const inferenceOverlay = showInferenceOverlay();
                startInferenceProgress();
                await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
                const tRun0 = performance.now();
                const results = await session.run({
                    image: inputTensor,
                    mask: maskTensor
                });
                const tRun1 = performance.now();
                finishInferenceProgress();
                hideInferenceOverlay(inferenceOverlay);
                Math.round(tRun1 - tRun0);
                const output = pickOutputTensor(results);
                const outData = output?.data;
                if (!outData) throw new Error("模型输出为空");
                const {scale: scale, offset: offset} = getOutputScale(outData);
                const outImgData = patchCtx.createImageData(MODEL_SIZE, MODEL_SIZE);
                const layout = inferOutputLayout(output);
                if (layout === "NHWC") for (let i = 0; i < size; i++) {
                    const base = i * 3;
                    outImgData.data[i * 4] = outData[base] * scale + offset;
                    outImgData.data[i * 4 + 1] = outData[base + 1] * scale + offset;
                    outImgData.data[i * 4 + 2] = outData[base + 2] * scale + offset;
                    outImgData.data[i * 4 + 3] = 255;
                } else for (let i = 0; i < size; i++) {
                    outImgData.data[i * 4] = outData[i] * scale + offset;
                    outImgData.data[i * 4 + 1] = outData[size + i] * scale + offset;
                    outImgData.data[i * 4 + 2] = outData[size * 2 + i] * scale + offset;
                    outImgData.data[i * 4 + 3] = 255;
                }
                patchCtx.putImageData(outImgData, 0, 0);
                const finalCanvas = document.createElement("canvas");
                finalCanvas.width = w;
                finalCanvas.height = h;
                const finalCtx = finalCanvas.getContext("2d");
                finalCtx.imageSmoothingEnabled = true;
                finalCtx.imageSmoothingQuality = "high";
                finalCtx.drawImage(bitmap, 0, 0, w, h);
                finalCtx.save();
                finalCtx.beginPath();
                finalCtx.rect(region.outX, region.outY, region.outW, region.outH);
                finalCtx.clip();
                finalCtx.drawImage(patchCanvas, 0, 0, MODEL_SIZE, MODEL_SIZE, region.cropX, region.cropY, region.cropSize, region.cropSize);
                finalCtx.restore();
                await downloadCanvasImage(finalCanvas, `gemini_inpaint_${Date.now()}.png`);
                const t1 = performance.now();
                Math.round(tLoad - t0), Math.round(tRun1 - tRun0), Math.round(t1 - t0);
                bitmap.close();
            }
            function getWatermarkRegion(w, h) {
                const base = Math.min(w, h);
                const k = base / WM_BASE;
                const boxW = Math.max(32, Math.round(WM_BOX_W_AT_BASE * k));
                const boxH = Math.max(32, Math.round(WM_BOX_H_AT_BASE * k));
                const rightMargin = Math.max(0, Math.round(WM_BOX_RIGHT_MARGIN_AT_BASE * k));
                const bottomMargin = Math.max(0, Math.round(WM_BOX_BOTTOM_MARGIN_AT_BASE * k));
                const pad = Math.max(0, Math.round(WM_BOX_PAD_AT_BASE * k));
                const boxX = w - rightMargin - boxW;
                const boxY = h - bottomMargin - boxH;
                let outX = boxX - pad;
                let outY = boxY - pad;
                let outW = boxW + pad * 2;
                let outH = boxH + pad * 2;
                if (outX < 0) {
                    outW += outX;
                    outX = 0;
                }
                if (outY < 0) {
                    outH += outY;
                    outY = 0;
                }
                outW = Math.min(outW, w - outX);
                outH = Math.min(outH, h - outY);
                const cropMin = Math.max(boxW, boxH) + pad * 2;
                let cropSize = Math.round(WM_CROP_SIZE_AT_BASE * k);
                cropSize = Math.max(cropSize, cropMin);
                cropSize = Math.min(cropSize, w, h);
                let cropX = w - cropSize;
                let cropY = h - cropSize;
                cropX = Math.min(cropX, outX);
                cropY = Math.min(cropY, outY);
                cropX = Math.max(0, Math.min(cropX, w - cropSize));
                cropY = Math.max(0, Math.min(cropY, h - cropSize));
                const sx = MODEL_SIZE / cropSize;
                const relX0 = outX - cropX;
                const relY0 = outY - cropY;
                const relX1 = relX0 + outW;
                const relY1 = relY0 + outH;
                const maskX0 = clampInt(Math.floor(relX0 * sx), 0, MODEL_SIZE);
                const maskY0 = clampInt(Math.floor(relY0 * sx), 0, MODEL_SIZE);
                const maskX1 = clampInt(Math.ceil(relX1 * sx), 0, MODEL_SIZE);
                const maskY1 = clampInt(Math.ceil(relY1 * sx), 0, MODEL_SIZE);
                return {
                    cropX: cropX,
                    cropY: cropY,
                    cropSize: cropSize,
                    outX: outX,
                    outY: outY,
                    outW: outW,
                    outH: outH,
                    maskX0: maskX0,
                    maskY0: maskY0,
                    maskX1: maskX1,
                    maskY1: maskY1
                };
            }
            function drawDebugRect(ctx, x, y, w, h, color) {
                ctx.save();
                ctx.lineWidth = Math.max(2, Math.round(Math.min(ctx.canvas.width, ctx.canvas.height) / 400));
                ctx.strokeStyle = color;
                ctx.setLineDash([ ctx.lineWidth * 2, ctx.lineWidth ]);
                ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
                ctx.restore();
            }
            function clampInt(v, min, max) {
                if (v < min) return min;
                if (v > max) return max;
                return v | 0;
            }
            function pickOutputTensor(results) {
                if (results?.output && isImageTensor(results.output)) return results.output;
                const tensors = Object.values(results || {}).filter(Boolean);
                const imageTensor = tensors.find(isImageTensor);
                return imageTensor || tensors[0];
            }
            function isImageTensor(t) {
                const d = t?.dims;
                if (!Array.isArray(d) || d.length !== 4) return false;
                const isNchw = d[1] === 3 && d[2] === 512 && d[3] === 512;
                const isNhwc = d[3] === 3 && d[1] === 512 && d[2] === 512;
                return isNchw || isNhwc;
            }
            function inferOutputLayout(t) {
                const d = t?.dims;
                if (Array.isArray(d) && d.length === 4 && d[3] === 3) return "NHWC";
                return "NCHW";
            }
            function getOutputScale(outData) {
                let min = 1 / 0;
                let max = -1 / 0;
                const step = Math.max(1, Math.floor(outData.length / 2e4));
                for (let i = 0; i < outData.length; i += step) {
                    const v = outData[i];
                    if (v < min) min = v;
                    if (v > max) max = v;
                }
                if (!Number.isFinite(min)) min = 0;
                if (!Number.isFinite(max)) max = 0;
                if (min >= -1.2 && max <= 1.2) {
                    if (min < 0) return {
                        scale: 127.5,
                        offset: 127.5
                    };
                    return {
                        scale: 255,
                        offset: 0
                    };
                }
                return {
                    scale: 1,
                    offset: 0
                };
            }
            function downloadCanvasImage(canvas, filename) {
                return new Promise((resolve, reject) => {
                    canvas.toBlob(blob => {
                        if (!blob) return reject(new Error("导出失败"));
                        downloadBlob(blob, filename);
                        resolve();
                    }, "image/png");
                });
            }
            function downloadBlob(blob, filename) {
                ignoreCreateObjectUrlCapture = true;
                const url = URL.createObjectURL(blob);
                ignoreCreateObjectUrlCapture = false;
                downloadUrl(url, filename);
                setTimeout(() => URL.revokeObjectURL(url), 6e4);
            }
            function downloadUrl(url, filename) {
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            async function loadOriginCleanBitmap(url) {
                if (!url) throw new Error("Image src empty");
                const resolved = new URL(url, location.href);
                if (resolved.origin === location.origin || resolved.protocol === "data:" || resolved.protocol === "blob:") return await createImageBitmap(await loadImageElement(url));
                const blob = getRecentCapturedImageBlob();
                if (!blob) throw new Error("无法读取图片像素，请先复制图片后再点“去水印下载”。");
                return await createImageBitmap(blob);
            }
            function loadImageElement(url) {
                return new Promise((resolve, reject) => {
                    const img = new Image;
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error("Image load failed"));
                    img.src = url;
                });
            }
            function gmGetArrayBuffer(url) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "arraybuffer",
                        onload: res => {
                            if (res.status === 200) {
                                const contentType = /content-type:\s*([^\n;]+)/i.exec(res.responseHeaders || "")?.[1]?.trim() || "";
                                resolve({
                                    buffer: res.response,
                                    contentType: contentType
                                });
                            } else reject(new Error("Request failed: " + res.status));
                        },
                        onerror: () => reject(new Error("Request failed"))
                    });
                });
            }
            function getRecentCapturedImageBlob() {
                if (!capturedImageBlob) return null;
                if (Date.now() - capturedImageBlobAt > 6e4) return null;
                return capturedImageBlob;
            }
            function hookImageBlobCapture() {
                if (unsafeWindow.__wmBlobCaptureHooked) return;
                unsafeWindow.__wmBlobCaptureHooked = true;
                const urlApi = unsafeWindow.URL;
                const rawCreate = urlApi.createObjectURL.bind(urlApi);
                urlApi.createObjectURL = obj => {
                    const url = rawCreate(obj);
                    if (ignoreCreateObjectUrlCapture) return url;
                    const isBlob = obj instanceof unsafeWindow.Blob;
                    const type = isBlob ? obj.type : "";
                    if (isBlob && type.startsWith("image/")) {
                        capturedImageBlob = obj;
                        capturedImageBlobAt = Date.now();
                        obj.size;
                    }
                    return url;
                };
                const clip = unsafeWindow.navigator.clipboard;
                if (!clip.__wmWriteHooked) {
                    clip.__wmWriteHooked = true;
                    const rawWrite = clip.write.bind(clip);
                    clip.write = async items => {
                        for (const item of items) {
                            const types = item.types;
                            for (const type of types) {
                                if (!type.startsWith("image/")) continue;
                                const blob = await item.getType(type);
                                capturedImageBlob = blob;
                                capturedImageBlobAt = Date.now();
                                blob.type, blob.size;
                                break;
                            }
                        }
                        return rawWrite(items);
                    };
                }
            }
        }
})();
