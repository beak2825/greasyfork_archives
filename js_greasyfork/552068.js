// ==UserScript==
// @name         BookWalker Downloader
// @namespace    http://tampermonkey.net/
// @version      2.53
// @description  Download full and preview books from BookWalker
// @author       GolyBidoof
// @match        https://viewer.bookwalker.jp/*
// @match        https://viewer-trial.bookwalker.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bookwalker.jp
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552068/BookWalker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552068/BookWalker%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function () {
        const nativeImage = window.Image;
        const nativeCreateElement = document.createElement.bind(document);

        window.Image = class extends nativeImage {
            constructor() {
                super();
                this.crossOrigin = 'anonymous';
            }
        };

        Object.defineProperty(window.Image.prototype, 'src', {
            set: function (value) {
                if (typeof value === 'string' && value.length > 0 && !value.startsWith('data:') && !value.startsWith('blob:')) {
                    this.crossOrigin = 'anonymous';
                }
                const descriptor = Object.getOwnPropertyDescriptor(nativeImage.prototype, 'src');
                descriptor.set.call(this, value);
            }
        });

        document.createElement = function (tagName) {
            const element = nativeCreateElement(tagName);
            if (tagName && tagName.toLowerCase() === 'img') {
                element.crossOrigin = 'anonymous';
            }
            return element;
        };

        const nativeGetContext = HTMLCanvasElement.prototype.getContext;
        const webglContextMap = new WeakMap();

        HTMLCanvasElement.prototype.getContext = function (type, options) {
            if (type === 'webgl' || type === 'webgl2') {
                options = options || {};
                options.preserveDrawingBuffer = true;
                options.antialias = options.antialias !== false;
                const ctx = nativeGetContext.call(this, type, options);
                if (ctx) {
                    webglContextMap.set(this, { type, context: ctx });
                }
                return ctx;
            }
            return nativeGetContext.call(this, type, options);
        };

        window.__bwGetWebGLContext = (canvas) => webglContextMap.get(canvas);
    })();

    function captureWebGLCanvasToImageData(canvas) {
        const webglInfo = window.__bwGetWebGLContext ? window.__bwGetWebGLContext(canvas) : null;
        const gl = webglInfo?.context || canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
            return null;
        }

        const width = canvas.width;
        const height = canvas.height;
        const pixels = new Uint8Array(width * height * 4);

        try {
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        } catch (e) {
            console.warn('WebGL readPixels failed:', e);
            return null;
        }

        const flippedPixels = new Uint8Array(width * height * 4);
        for (let y = 0; y < height; y++) {
            const srcRow = (height - 1 - y) * width * 4;
            const dstRow = y * width * 4;
            flippedPixels.set(pixels.subarray(srcRow, srcRow + width * 4), dstRow);
        }

        return new ImageData(new Uint8ClampedArray(flippedPixels.buffer), width, height);
    }

    function drawWebGLCanvasTo2D(sourceCanvas, targetCanvas) {
        const imageData = captureWebGLCanvasToImageData(sourceCanvas);
        if (!imageData) return false;

        targetCanvas.width = sourceCanvas.width;
        targetCanvas.height = sourceCanvas.height;
        const ctx = targetCanvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        return true;
    }

    function isWebGLCanvas(canvas) {
        if (!canvas) return false;
        const webglInfo = window.__bwGetWebGLContext ? window.__bwGetWebGLContext(canvas) : null;
        if (webglInfo) return true;

        try {
            const ctx2d = canvas.getContext('2d');
            if (!ctx2d) return true;
        } catch (e) {
            return true;
        }
        return false;
    }

    const bookState = {
        isPreview: false,
        config: null,
        pages: [],
        title: null,
        width: null,
        height: null,
        isResolutionDetected: false,
        resolutionDetectionMethod: 'none'
    };

    let controlPanelStatusElement = null;
    let lastStatusMessage = '';
    let pendingStatusMessage = '';
    const captureSettings = {
        contentCropRect: null
    };

    const downloadSession = {
        capturedBlobs: [],
        isActive: false,
        isStopRequested: false,
        currentPageIndex: 0,
        totalPageCount: 0,
        isRightToLeft: true,
        hasEncounteredContent: false,
        lastCapturedSignature: null,
        outputFormat: 'webp',
        compressionQuality: 0.96,
        isAutoCropEnabled: true,
        recentFingerprints: [],
        uniqueCapturedFingerprints: new Set()
    };

    const BWDebug = {
        inspectCanvas() {
            const canvas = document.querySelector('.currentScreen canvas');
            if (!canvas) {
                console.error('BWDebug: No canvas found in .currentScreen');
                return;
            }

            let isTainted = false;
            let is2DBlack = false;
            let webglWorks = false;

            try {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    const testData = ctx.getImageData(0, 0, 10, 10).data;
                    let allZero = true;
                    for (let i = 0; i < testData.length; i += 4) {
                        if (testData[i] !== 0 || testData[i + 1] !== 0 || testData[i + 2] !== 0 || testData[i + 3] !== 0) {
                            allZero = false;
                            break;
                        }
                    }
                    is2DBlack = allZero;
                }
            } catch (e) {
                if (e.name === 'SecurityError' || e.message.includes('insecure')) {
                    isTainted = true;
                }
            }

            const isWebGL = isWebGLCanvas(canvas);
            if (isWebGL && is2DBlack) {
                const webglImageData = captureWebGLCanvasToImageData(canvas);
                if (webglImageData) {
                    let hasWebGLContent = false;
                    for (let i = 0; i < Math.min(webglImageData.data.length, 1000); i += 4) {
                        if (webglImageData.data[i] !== 0 || webglImageData.data[i + 1] !== 0 ||
                            webglImageData.data[i + 2] !== 0 || webglImageData.data[i + 3] !== 0) {
                            hasWebGLContent = true;
                            break;
                        }
                    }
                    webglWorks = hasWebGLContent;
                }
            }

            const fingerprint = generateCanvasContentFingerprint(canvas);
            const hasContent = doesCanvasContainContent(canvas);
            console.log('--- Canvas Inspection ---');
            console.log('Dimensions:', `${canvas.width}x${canvas.height}`);
            console.log('Is Tainted (CORS/Security):', isTainted);
            console.log('Is WebGL Canvas:', isWebGL);
            console.log('2D Context Returns Black:', is2DBlack);
            console.log('WebGL Direct Read Works:', webglWorks);
            console.log('Fingerprint:', fingerprint);
            console.log('Has Content:', hasContent);
            console.log('Is Empty (Fingerprint):', fingerprint.startsWith('e-'));
            console.log('Is Spinner Visible:', isScreenShowingLoadingSpinner());
            console.log('Canvas Element:', canvas);

            if (isTainted) {
                console.warn('BWDebug: Canvas is tainted. Browser is blocking access to pixel data due to cross-origin security.');
            }
            if (is2DBlack && isWebGL) {
                if (webglWorks) {
                    console.log('BWDebug: WebGL fallback is working! The script should capture correctly.');
                } else {
                    console.error('BWDebug: WebGL canvas returns black via both 2D and WebGL methods. Try reloading the page.');
                }
            }
        },

        dumpCanvas() {
            const canvas = document.querySelector('.currentScreen canvas');
            if (!canvas) {
                console.error('BWDebug: No canvas to dump');
                return;
            }

            let dataUrl = canvas.toDataURL('image/png');

            const testCanvas = document.createElement('canvas');
            testCanvas.width = 10;
            testCanvas.height = 10;
            const testCtx = testCanvas.getContext('2d');
            testCtx.drawImage(canvas, 0, 0, 10, 10);
            const testData = testCtx.getImageData(0, 0, 10, 10).data;
            let allZero = true;
            for (let i = 0; i < testData.length; i += 4) {
                if (testData[i] !== 0 || testData[i + 1] !== 0 || testData[i + 2] !== 0 || testData[i + 3] !== 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero && isWebGLCanvas(canvas)) {
                console.log('BWDebug: Canvas appears black, trying WebGL direct capture...');
                const webglImageData = captureWebGLCanvasToImageData(canvas);
                if (webglImageData) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.putImageData(webglImageData, 0, 0);
                    dataUrl = tempCanvas.toDataURL('image/png');
                    console.log('BWDebug: WebGL direct capture succeeded!');
                } else {
                    console.error('BWDebug: WebGL direct capture also failed');
                }
            }

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `bw_debug_dump_${Date.now()}.png`;
            link.click();
            console.log('BWDebug: Canvas dump triggered');
        },

        inspectState() {
            console.log('--- Current Application State ---');
            console.log('BookState:', JSON.parse(JSON.stringify(bookState)));
            console.log('DownloadSession:', JSON.parse(JSON.stringify(downloadSession)));
            console.log('CaptureSettings:', JSON.parse(JSON.stringify(captureSettings)));
        },

        testContentDetection() {
            const canvas = document.querySelector('.currentScreen canvas');
            if (!canvas) {
                console.error('BWDebug: No canvas found');
                return;
            }
            const rect = findContentBoundingBox(canvas);
            console.log('--- Content Detection Test ---');
            console.log('FindContentBoundingBox result:', rect);
            if (rect) {
                const devicePixelRatio = window.devicePixelRatio || 1;
                console.log('Suggested resolution:', `${Math.round(rect.w / devicePixelRatio)}x${Math.round(rect.h / devicePixelRatio)}`);
            }
        },

        checkSelectors() {
            const criticalSelectors = {
                viewer: '#viewer',
                renderer: '#renderer',
                slider: '#pageSliderBar',
                counter: '#pageSliderCounter',
                canvas: '.currentScreen canvas'
            };
            console.log('--- Selector Check ---');
            Object.entries(criticalSelectors).forEach(([label, selector]) => {
                const element = document.querySelector(selector);
                console.log(`${label} (${selector}):`, element ? 'FOUND' : 'MISSING', element);
            });
        },

        testCaptureLogic() {
            const canvas = document.querySelector('.currentScreen canvas');
            if (!canvas) {
                console.error('BWDebug: No canvas');
                return;
            }
            const fingerprint = generateCanvasContentFingerprint(canvas);
            const isBusy = isScreenShowingLoadingSpinner();
            const isReady = isPageCanvasReadyForCapture(canvas, 1000, downloadSession.currentPageIndex || 1);

            console.log('--- Capture Logic Test ---');
            console.log('Current Page (State):', downloadSession.currentPageIndex);
            console.log('Is Spinner/Busy:', isBusy);
            console.log('Is Ready for Capture (1s wait simulation):', isReady);
            console.log('Fingerprint Duplicate:', isFingerprintDuplicate(fingerprint));
            console.log('Fingerprint Previously Captured:', isFingerprintPreviouslyCaptured(fingerprint));
        },

        forceCapture() {
            console.log('BWDebug: Attempting immediate manual capture...');
            this.inspectCanvas();
            this.dumpCanvas();
        }
    };

    window.bwDebug = BWDebug;

    let activeWakeLock = null;

    async function requestScreenWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                if (!activeWakeLock) {
                    activeWakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake lock active');
                    activeWakeLock.addEventListener('release', () => {
                        console.log('Wake lock released');
                        activeWakeLock = null;
                    });
                }
            } catch (err) {
                console.log(`Wake lock error: ${err.name} - ${err.message}`);
            }
        }
    }

    function releaseScreenWakeLock() {
        if (activeWakeLock) {
            try {
                activeWakeLock.release();
                activeWakeLock = null;
                console.log('Background execution paused');
            } catch (e) { }
        }
    }

    document.addEventListener('visibilitychange', async () => {
        if (downloadSession.isActive && document.visibilityState === 'visible') {
            await requestScreenWakeLock();
        }
    });



    function initializeControlPanel() {
        if (!document.body) return null;
        if (controlPanelStatusElement && document.body.contains(controlPanelStatusElement)) return controlPanelStatusElement;

        let panel = document.getElementById('bw-helper');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'bw-helper';

            const font = document.createElement('link');
            font.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap';
            font.rel = 'stylesheet';
            document.head.appendChild(font);

            const style = document.createElement('style');
            style.textContent = `
                #bw-helper {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    width: 280px;
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 16px;
                    color: #1a1a1a;
                    font-family: 'Outfit', sans-serif;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    user-select: none;
                    transition: transform 0.2s ease;
                    border: 1px solid #eee;
                }
                #bw-helper .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                #bw-helper .header .title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #3b82f6;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                #bw-helper .status {
                    font-size: 13px;
                    color: #4b5563;
                    margin: 16px 0;
                    min-height: 20px;
                    line-height: 1.5;
                }
                #bw-helper .button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    transition: all 0.2s ease;
                }
                #bw-helper .button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
                }
                #bw-helper .button:active {
                    transform: translateY(0);
                }
                #bw-helper .button:disabled {
                    background: #e5e7eb;
                    color: #9ca3af;
                    cursor: wait;
                    box-shadow: none;
                }
                #bw-helper .progress-container {
                    height: 6px;
                    background: #f3f4f6;
                    border-radius: 3px;
                    margin-top: 14px;
                    display: none;
                    overflow: hidden;
                }
                #bw-helper .progress-bar {
                    height: 100%;
                    background: #3b82f6;
                    width: 0%;
                    transition: width 0.3s ease;
                }
                #bw-helper .options {
                    margin: 16px 0;
                    padding-top: 16px;
                    border-top: 1px solid #f3f4f6;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                #bw-helper .slider-group {
                    padding-top: 12px;
                    border-top: 1px solid #f9fafb;
                }
                #bw-helper .option-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                #bw-helper .option-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                #bw-helper .radio-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                #bw-helper .radio-item {
                    position: relative;
                }
                #bw-helper .radio-item input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }
                #bw-helper .radio-box {
                    display: block;
                    padding: 10px 8px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #fafafa;
                }
                #bw-helper .radio-box:hover {
                    border-color: #3b82f6;
                }
                #bw-helper .radio-item input:checked + .radio-box {
                    background: #3b82f6;
                    border-color: #3b82f6;
                    color: white;
                }
                #bw-helper .radio-desc {
                    display: block;
                    font-size: 9px;
                    margin-top: 4px;
                    opacity: 0.8;
                }
                #bw-helper .res-info {
                    font-size: 11px;
                    margin: 12px 0;
                    padding: 10px;
                    border-radius: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                }
                #bw-helper .res-info.warning {
                    background: #fffbeb;
                    border-color: #fef3c7;
                    color: #92400e;
                }
                #bw-helper .slider-info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 600;
                }
                #bw-helper .manual-res {
                    margin: 16px 0;
                    padding: 14px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                }
                #bw-helper .manual-res input:disabled {
                    background: #f1f5f9;
                    color: #94a3b8;
                    cursor: not-allowed;
                    border-color: #e2e8f0;
                }
                #bw-helper .res-inputs {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 6px;
                }
                #bw-helper .res-inputs input {
                    width: 70px;
                    padding: 8px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #1e293b;
                    text-align: center;
                    font-family: 'Outfit', sans-serif;
                    background: #fff;
                    transition: border-color 0.2s;
                }
                #bw-helper .res-inputs input:focus {
                    border-color: #3b82f6;
                    outline: none;
                }
                #bw-helper .res-inputs span {
                    color: #94a3b8;
                    font-weight: 700;
                }
                #bw-helper input[type="range"] {
                    width: 100%;
                    height: 4px;
                    background: #f3f4f6;
                    border-radius: 2px;
                    outline: none;
                    accent-color: #3b82f6;
                    cursor: pointer;
                }
                #bw-helper .version {
                    font-size: 10px;
                    color: #9ca3af;
                    margin-top: 10px;
                    text-align: center;
                }
                #bw-helper .toggle-group {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin: 12px 0;
                    cursor: pointer;
                }
                #bw-helper .toggle-group input {
                    width: 14px;
                    height: 14px;
                    cursor: pointer;
                    margin: 0;
                }
                #bw-helper .toggle-label {
                    font-size: 11px;
                    color: #64748b;
                    font-weight: 600;
                }
                #bw-helper .feature-note {
                    font-size: 11px;
                    background: #fefce8;
                    border: 1px solid #fef08a;
                    color: #854d0e;
                    padding: 8px 12px;
                    border-radius: 8px;
                    margin: 12px 0;
                    line-height: 1.4;
                    display: flex;
                    gap: 8px;
                }
            `;
            document.head.appendChild(style);

            panel.innerHTML = `
                <div class="header">
                    <div class="title"><span>📚</span>BookWalker Scraper</div>
                    <div id="bw-close" style="cursor:pointer; font-size: 18px; color: #9ca3af;">&times;</div>
                </div>
                <div id="bw-status" class="status">Loading...</div>
                <div id="bw-manual-res" class="manual-res" style="display: none;">
                    <div class="option-label" id="bw-res-label">Output Image Resolution</div>
                    <div class="res-inputs">
                        <input type="number" id="bw-manual-w" value="1125" title="Width">
                        <span>&times;</span>
                        <input type="number" id="bw-manual-h" value="1600" title="Height">
                    </div>
                </div>
                <div id="bw-crop-wrap" class="toggle-group" style="display: none;">
                    <input type="checkbox" id="bw-auto-crop" checked>
                    <label for="bw-auto-crop" class="toggle-label">Auto-Crop to Content</label>
                </div>
                <div class="options" id="bw-options">
                    <div class="option-group">
                        <div class="option-label">Output Format</div>
                        <div class="radio-group" style="grid-template-columns: 1fr 1fr;">
                            <label class="radio-item">
                                <input type="radio" name="format" value="webp" checked>
                                <span class="radio-box">
                                    WebP
                                    <span class="radio-desc" id="est-webp">Lossy</span>
                                </span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="jpg">
                                <span class="radio-box">
                                    JPEG
                                    <span class="radio-desc" id="est-jpg">Lossy</span>
                                </span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="jxl">
                                <span class="radio-box">
                                    JPEG XL
                                    <span class="radio-desc" id="est-jxl">Lossless</span>
                                </span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="format" value="png">
                                <span class="radio-box">
                                    PNG
                                    <span class="radio-desc" id="est-png">Lossless</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="slider-group" id="bw-quality-wrap">
                        <div class="slider-info">
                            <span>Quality</span>
                            <span id="bw-quality-val">96%</span>
                        </div>
                        <input type="range" id="bw-quality-slider" min="90" max="100" value="96">
                    </div>
                </div>
                <button id="bw-main-btn" class="button">In progress now...</button>
                <div id="bw-progress-wrap" class="progress-container">
                    <div id="bw-progress-bar" class="progress-bar"></div>
                </div>
                <div class="feature-note">
                    <span>Please ensure <b>Single-page Spread Mode</b> mode is active in viewer settings for correct capture.</span>
                </div>
                <div class="version">v2.53</div>
            `;
            document.body.appendChild(panel);
        }

        controlPanelStatusElement = document.getElementById('bw-status');

        const header = panel.querySelector('.header');
        let dragging = false;
        let pos = { x: 0, y: 0 };

        header.onmousedown = (e) => {
            dragging = true;
            pos.x = e.clientX - panel.offsetLeft;
            pos.y = e.clientY - panel.offsetTop;
            header.style.cursor = 'grabbing';
        };

        document.onmousemove = (e) => {
            if (!dragging) return;
            panel.style.left = (e.clientX - pos.x) + 'px';
            panel.style.top = (e.clientY - pos.y) + 'px';
            panel.style.right = 'auto';
        };

        document.onmouseup = () => {
            dragging = false;
            header.style.cursor = 'default';
        };



        const radios = panel.querySelectorAll('input[name="format"]');
        radios.forEach(radio => {
            radio.onchange = (e) => {
                downloadSession.outputFormat = e.target.value;
                const qWrap = document.getElementById('bw-quality-wrap');
                if (qWrap) qWrap.style.display = (downloadSession.outputFormat === 'jpg' || downloadSession.outputFormat === 'webp') ? 'block' : 'none';
                updateSizeEstimates();
            };
        });

        const slider = document.getElementById('bw-quality-slider');
        if (slider) {
            slider.oninput = (e) => {
                const val = parseInt(e.target.value);
                downloadSession.compressionQuality = val / 100;
                const display = document.getElementById('bw-quality-val');
                if (display) display.textContent = val + '%';
                updateSizeEstimates();
            };
        }

        const manualWInput = document.getElementById('bw-manual-w');
        const manualHInput = document.getElementById('bw-manual-h');
        if (manualWInput) manualWInput.oninput = updateSizeEstimates;
        if (manualHInput) manualHInput.oninput = updateSizeEstimates;

        const autoCropToggle = document.getElementById('bw-auto-crop');
        if (autoCropToggle) {
            autoCropToggle.onchange = (e) => {
                downloadSession.isAutoCropEnabled = e.target.checked;
            };
        }

        updateSizeEstimates();

        if (pendingStatusMessage) {
            controlPanelStatusElement.textContent = pendingStatusMessage;
            pendingStatusMessage = '';
        }

        return controlPanelStatusElement;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function updateSizeEstimates() {
        const manualWidthInput = document.getElementById('bw-manual-w');
        const manualHeightInput = document.getElementById('bw-manual-h');
        const qualitySlider = document.getElementById('bw-quality-slider');

        const width = (manualWidthInput && !manualWidthInput.disabled) ? (parseInt(manualWidthInput.value) || bookState.width || 1125) : (bookState.width || 1125);
        const height = (manualHeightInput && !manualHeightInput.disabled) ? (parseInt(manualHeightInput.value) || bookState.height || 1600) : (bookState.height || 1600);
        const quality = qualitySlider ? (parseInt(qualitySlider.value) / 100) : (downloadSession.compressionQuality || 0.96);
        const megapixels = (width * height) / 1000000;
        const totalPageCount = calculateTotalPages() || 1;

        const formats = [
            { id: 'est-webp', mult: 250, lossy: true, type: 'Lossy' },
            { id: 'est-jpg', mult: 350, lossy: true, type: 'Lossy' },
            { id: 'est-jxl', mult: 700, lossy: false, type: 'Lossless' },
            { id: 'est-png', mult: 1500, lossy: false, type: 'Lossless' }
        ];

        formats.forEach(format => {
            const labelElement = document.getElementById(format.id);
            if (labelElement) {
                let factor = format.lossy ? (0.4 + (quality - 0.9) * 6) : 1.0;
                let singlePageKb = megapixels * format.mult * factor;
                let totalSizeKb = singlePageKb * totalPageCount;

                const formatSizeString = (kb) => kb > 1024 ? (kb / 1024).toFixed(1) + 'MB' : Math.round(kb) + 'KB';
                const totalSizeStr = totalSizeKb > (1024 * 1024) ? (totalSizeKb / (1024 * 1024)).toFixed(1) + 'GB' : formatSizeString(totalSizeKb);

                labelElement.textContent = `${format.type} (~${formatSizeString(singlePageKb)}/p · ~${totalSizeStr})`;
            }
        });
    }

    function reportStatus(message) {
        const statusElement = initializeControlPanel();

        if (!statusElement) {
            pendingStatusMessage = message || '';
            lastStatusMessage = message || '';
            return;
        }

        if (!message) {
            statusElement.style.display = 'none';
            statusElement.textContent = '';
            lastStatusMessage = '';
            return;
        }

        if (message === lastStatusMessage) return;

        lastStatusMessage = message;
        statusElement.textContent = message;
    }


    function detectMangaResolution() {
        if (bookState.resolutionDetectionMethod === 'metadata') return false;

        const viewerCanvas = document.querySelector('.currentScreen canvas');
        if (!viewerCanvas) return false;

        const devicePixelRatio = window.devicePixelRatio || 1;
        const apparentWidth = Math.round(viewerCanvas.width / devicePixelRatio);
        const apparentHeight = Math.round(viewerCanvas.height / devicePixelRatio);

        if (!apparentWidth || !apparentHeight) return false;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const matchesWindowSize = Math.abs(apparentWidth - windowWidth) < 20 && Math.abs(apparentHeight - windowHeight) < 20;

        const aspectRatio = apparentWidth / apparentHeight;
        const isLandscape = aspectRatio > 0.95;
        const isExtremelySkinny = aspectRatio < 0.4;

        if (matchesWindowSize || isLandscape || isExtremelySkinny) {
            if (bookState.resolutionDetectionMethod !== 'canvas_pending') {
                console.log(`Suspicious resolution ${apparentWidth}x${apparentHeight} (aspect ${aspectRatio.toFixed(2)}) - matches window or landscape, waiting for metadata...`);
                bookState.resolutionDetectionMethod = 'canvas_pending';
            }
            bookState.width = apparentWidth;
            bookState.height = apparentHeight;
            bookState.isResolutionDetected = false;
            refreshControlPanelUI();
            return false;
        }

        bookState.width = apparentWidth;
        bookState.height = apparentHeight;
        bookState.isResolutionDetected = true;
        bookState.resolutionDetectionMethod = 'canvas';
        refreshControlPanelUI();
        return true;
    }

    function findContentBoundingBox(canvas) {
        if (!canvas) return null;

        const width = canvas.width;
        const height = canvas.height;
        let pixelData;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
            pixelData = context.getImageData(0, 0, width, height).data;

            let allZero = true;
            for (let i = 0; i < Math.min(pixelData.length, 1000); i += 4) {
                if (pixelData[i] !== 0 || pixelData[i + 1] !== 0 || pixelData[i + 2] !== 0 || pixelData[i + 3] !== 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero && isWebGLCanvas(canvas)) {
                const webglImageData = captureWebGLCanvasToImageData(canvas);
                if (webglImageData) {
                    pixelData = webglImageData.data;
                }
            }
        } else if (isWebGLCanvas(canvas)) {
            const webglImageData = captureWebGLCanvasToImageData(canvas);
            if (!webglImageData) return null;
            pixelData = webglImageData.data;
        } else {
            return null;
        }

        const isPixelBackground = (x, y) => {
            const index = (y * width + x) * 4;
            const r = pixelData[index], g = pixelData[index + 1], b = pixelData[index + 2], a = pixelData[index + 3];
            if (a < 20) return true;
            if (r > 245 && g > 245 && b > 245) return true;
            if (r < 10 && g < 10 && b < 10) return true;
            return false;
        };

        let contentTop = 0, contentBottom = height - 1, contentLeft = 0, contentRight = width - 1;

        while (contentTop < height) {
            let rowIsEmpty = true;
            for (let x = 0; x < width; x += 10) {
                if (!isPixelBackground(x, contentTop)) { rowIsEmpty = false; break; }
            }
            if (!rowIsEmpty) break;
            contentTop++;
        }

        while (contentBottom > contentTop) {
            let rowIsEmpty = true;
            for (let x = 0; x < width; x += 10) {
                if (!isPixelBackground(x, contentBottom)) { rowIsEmpty = false; break; }
            }
            if (!rowIsEmpty) break;
            contentBottom--;
        }

        while (contentLeft < width) {
            let columnIsEmpty = true;
            for (let y = contentTop; y <= contentBottom; y += 10) {
                if (!isPixelBackground(contentLeft, y)) { columnIsEmpty = false; break; }
            }
            if (!columnIsEmpty) break;
            contentLeft++;
        }

        while (contentRight > contentLeft) {
            let columnIsEmpty = true;
            for (let y = contentTop; y <= contentBottom; y += 10) {
                if (!isPixelBackground(contentRight, y)) { columnIsEmpty = false; break; }
            }
            if (!columnIsEmpty) break;
            contentRight--;
        }

        if (contentRight <= contentLeft || contentBottom <= contentTop) return null;

        const padding = 2;
        const paddedLeft = Math.max(0, contentLeft - padding);
        const paddedTop = Math.max(0, contentTop - padding);
        const paddedRight = Math.min(width - 1, contentRight + padding);
        const paddedBottom = Math.min(height - 1, contentBottom + padding);

        return {
            x: paddedLeft,
            y: paddedTop,
            w: paddedRight - paddedLeft + 1,
            h: paddedBottom - paddedTop + 1
        };
    }

    function isScreenShowingLoadingSpinner() {
        const screenElement = document.querySelector('.currentScreen');
        if (!screenElement) return true;

        const loadingSelectors = ['.loading', '.loadingImage', '#pageLoading', '.pageLoading'];
        for (const selector of loadingSelectors) {
            const elements = screenElement.querySelectorAll(selector);
            for (const element of elements) {
                const style = window.getComputedStyle(element);
                const isVisible = style.visibility !== 'hidden' &&
                    style.display !== 'none' &&
                    parseFloat(style.opacity || '1') > 0.1;

                if (isVisible) {
                    const rect = element.getBoundingClientRect();
                    if (rect.width > 20 || rect.height > 20) return true;
                }
            }
        }
        return false;
    }

    function isFingerprintDuplicate(fingerprint) {
        if (!fingerprint) return true;
        return (downloadSession.recentFingerprints || []).includes(fingerprint);
    }

    function isFingerprintPreviouslyCaptured(fingerprint) {
        if (!fingerprint) return true;
        return downloadSession.uniqueCapturedFingerprints.has(fingerprint);
    }

    function isPageCanvasReadyForCapture(canvas, timeWaited, pageIndex) {
        if (!canvas) return false;
        if (canvas.width < 100 || canvas.height < 100) return false;

        const currentFingerprint = generateCanvasContentFingerprint(canvas);
        const isCanvasEmpty = currentFingerprint.startsWith('e-');

        if (pageIndex === 1 && isCanvasEmpty) return false;
        if (pageIndex === 1) return true;

        if (isFingerprintDuplicate(currentFingerprint)) return timeWaited >= 1200;
        if (isCanvasEmpty && timeWaited < 4000) return false;
        if (isFingerprintPreviouslyCaptured(currentFingerprint)) return timeWaited >= 1200;

        return true;
    }

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0];

        if (typeof url === 'string') {
            if (url.includes('configuration_pack.json')) {
                const clonedResponse = response.clone();
                try {
                    const configData = await clonedResponse.json();
                    bookState.isPreview = true;
                    bookState.config = configData;

                    if (configData.configuration && configData.configuration.contents) {
                        bookState.pages = configData.configuration.contents;
                    }

                    const firstPageKey = Object.keys(configData).find(key => key.includes('.xhtml'));
                    if (firstPageKey && configData[firstPageKey]) {
                        const pageInfo = configData[firstPageKey];
                        if (pageInfo.FileLinkInfo && pageInfo.FileLinkInfo.PageLinkInfoList && pageInfo.FileLinkInfo.PageLinkInfoList[0]) {
                            const pageData = pageInfo.FileLinkInfo.PageLinkInfoList[0].Page;
                            bookState.width = pageData.Size.Width;
                            bookState.height = pageData.Size.Height;
                            bookState.isResolutionDetected = true;
                            bookState.resolutionDetectionMethod = 'metadata';
                        }
                        if (pageInfo.Title) {
                            bookState.title = pageInfo.Title;
                        }
                    }
                    refreshControlPanelUI();
                } catch (error) { }
            } else if (url.includes('.xhtml.region') && url.includes('.json')) {
                const clonedResponse = response.clone();
                try {
                    const regionData = await clonedResponse.json();
                    if (regionData.w && regionData.h) {
                        bookState.width = regionData.w;
                        bookState.height = regionData.h;
                        bookState.isResolutionDetected = true;
                        bookState.resolutionDetectionMethod = 'metadata';
                    }
                } catch (error) { }
            }
        }
        return response;
    };

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        let requestURL = '';

        xhr.open = function (method, url, ...rest) {
            requestURL = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };

        xhr.send = function (...args) {
            if (requestURL.includes('configuration_pack.json')) {
                const originalOnLoad = xhr.onload;
                xhr.onload = function () {
                    try {
                        const configData = JSON.parse(xhr.responseText);
                        bookState.isPreview = true;
                        bookState.config = configData;

                        if (configData.configuration && configData.configuration.contents) {
                            bookState.pages = configData.configuration.contents;
                        }

                        const firstPageKey = Object.keys(configData).find(key => key.includes('.xhtml'));
                        if (firstPageKey && configData[firstPageKey]) {
                            const pageInfo = configData[firstPageKey];
                            if (pageInfo.FileLinkInfo && pageInfo.FileLinkInfo.PageLinkInfoList && pageInfo.FileLinkInfo.PageLinkInfoList[0]) {
                                const pageData = pageInfo.FileLinkInfo.PageLinkInfoList[0].Page;
                                bookState.width = pageData.Size.Width;
                                bookState.height = pageData.Size.Height;
                                bookState.isResolutionDetected = true;
                                bookState.resolutionDetectionMethod = 'metadata';
                            }
                            if (pageInfo.Title) {
                                bookState.title = pageInfo.Title;
                            }
                        }
                        refreshControlPanelUI();
                    } catch (e) { }

                    if (originalOnLoad) {
                        originalOnLoad.apply(this, arguments);
                    }
                };
            } else if (requestURL.includes('.xhtml.region') && requestURL.includes('.json')) {
                const originalOnLoad = xhr.onload;
                xhr.onload = function () {
                    try {
                        const regionData = JSON.parse(xhr.responseText);
                        if (regionData.w && regionData.h) {
                            bookState.width = regionData.w;
                            bookState.height = regionData.h;
                            bookState.isResolutionDetected = true;
                            bookState.resolutionDetectionMethod = 'metadata';
                        }
                    } catch (e) { }

                    if (originalOnLoad) {
                        originalOnLoad.apply(this, arguments);
                    }
                };
            }
            return originalSend.apply(this, args);
        };
        return xhr;
    };

    function waitForDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(callback, 500));
        } else {
            setTimeout(callback, 500);
        }
    }

    waitForDOMReady(initializeApplicationEntryPoint);

    function calculateTotalPages() {
        const pageCounter = document.querySelector('#pageSliderCounter');
        if (pageCounter) {
            const pageMatch = pageCounter.textContent.match(/\/(\d+)/);
            if (pageMatch) return parseInt(pageMatch[1]);
        }

        if (bookState.isPreview) {
            return bookState.pages.length;
        }

        return 0;
    }

    function getCurrentPageIndex() {
        const pageCounter = document.querySelector('#pageSliderCounter');
        if (pageCounter) {
            const pageMatch = pageCounter.textContent.match(/(\d+)\//);
            if (pageMatch) return parseInt(pageMatch[1]);
        }
        return 1;
    }

    function isReadingRightToLeft() {
        const pageSlider = document.querySelector('#pageSliderBar');
        const jQuery = window.$;
        if (!pageSlider || !jQuery) return true;

        try {
            const sliderHandle = pageSlider.querySelector('.ui-slider-handle');
            if (sliderHandle) {
                const relativeLeftPosition = parseFloat(sliderHandle.style.left);
                return relativeLeftPosition > 50;
            }
        } catch (e) { }
        return true;
    }

    async function navigateToNextPage() {
        const pageSlider = document.querySelector('#pageSliderBar');
        if (!pageSlider || !window.$) return false;

        const targetPageIndex = getCurrentPageIndex() + 1;
        if (targetPageIndex > calculateTotalPages()) return false;

        try {
            const jQuery = window.$;
            const currentSliderValue = jQuery(pageSlider).slider('value');
            jQuery(pageSlider).slider('value', downloadSession.isRightToLeft ? currentSliderValue - 1 : currentSliderValue + 1);
            return true;
        } catch (e) {
            return false;
        }
    }

    async function prefetchUpcomingPages(currentPageIndex, totalPageCount, lookaheadPageCount = 3) {
        const pageSlider = document.querySelector('#pageSliderBar');
        if (!pageSlider || !window.$) return;

        const jQuery = window.$;
        const originalSliderValue = jQuery(pageSlider).slider('value');

        for (let i = 1; i <= lookaheadPageCount; i++) {
            const targetPageIndex = currentPageIndex + i;
            if (targetPageIndex > totalPageCount) break;

            const peekSliderValue = downloadSession.isRightToLeft ? originalSliderValue - i : originalSliderValue + i;
            jQuery(pageSlider).slider('value', peekSliderValue);
            await delay(50);
        }

        jQuery(pageSlider).slider('value', originalSliderValue);
    }

    async function navigateToFirstPage() {
        const pageSlider = document.querySelector('#pageSliderBar');
        if (!pageSlider || !window.$) return false;

        if (getCurrentPageIndex() === 1) {
            return true;
        }

        const totalPageCount = calculateTotalPages();
        if (totalPageCount === 0) return false;

        try {
            const jQuery = window.$;
            const targetSliderValue = downloadSession.isRightToLeft ? jQuery(pageSlider).slider('option', 'max') : jQuery(pageSlider).slider('option', 'min');
            jQuery(pageSlider).slider('value', targetSliderValue);

            const navigationTimeout = 3000;
            let timeWaited = 0;
            while (timeWaited < navigationTimeout) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (getCurrentPageIndex() === 1) return true;
                timeWaited += 100;
            }

            return getCurrentPageIndex() === 1;
        } catch (e) {
            return false;
        }
    }

    async function navigateToSpecificPage(targetPageIndex) {
        const pageSlider = document.querySelector('#pageSliderBar');
        if (!pageSlider || !window.$) return false;

        const totalPageCount = calculateTotalPages();
        if (targetPageIndex < 1 || targetPageIndex > totalPageCount) return false;

        try {
            const jQuery = window.$;
            const maxSliderValue = jQuery(pageSlider).slider('option', 'max');
            const minSliderValue = jQuery(pageSlider).slider('option', 'min');

            const targetSliderValue = downloadSession.isRightToLeft
                ? maxSliderValue - (targetPageIndex - 1)
                : minSliderValue + (targetPageIndex - 1);

            jQuery(pageSlider).slider('value', targetSliderValue);
            return true;
        } catch (e) {
            return false;
        }
    }


    function isViewerCurrentlyLoading() {
        const loadingIndicatorSelectors = [
            '#frontScreen',
            '.loading',
            '.loadingImage',
            '#pageLoading',
            '.pageLoading',
            '#loaderStatusDialog',
            '.progress'
        ];

        for (const selector of loadingIndicatorSelectors) {
            const loadingElements = document.querySelectorAll(selector);
            for (const element of loadingElements) {
                if (!element) continue;
                const computedStyle = window.getComputedStyle(element);
                if (!computedStyle) continue;
                const displayValue = computedStyle.display || '';
                const visibilityValue = computedStyle.visibility || '';
                const opacityValue = parseFloat(computedStyle.opacity || '1');

                if (selector === '#loaderStatusDialog') {
                    const progressBar = element.querySelector('.progress');
                    if (progressBar) {
                        const progressStyle = window.getComputedStyle(progressBar);
                        const progressWidth = parseFloat(progressStyle.width || '0');
                        if (progressWidth > 0 && displayValue !== 'none') {
                            return true;
                        }
                    }
                }

                if (displayValue !== 'none' && visibilityValue !== 'hidden' && opacityValue > 0.2) {
                    if (selector === '#frontScreen') {
                        const boundingClientRect = element.getBoundingClientRect();
                        if (boundingClientRect.width > 50 && boundingClientRect.height > 50) {
                            return true;
                        }
                    } else if (selector !== '#loaderStatusDialog') {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function isCanvasShowingPlaceholderImage(canvas) {
        if (!canvas) return true;
        try {
            const context = canvas.getContext('2d', { willReadFrequently: true });
            if (!context) return true;

            const width = canvas.width;
            const height = canvas.height;
            if (width < 100 || height < 100) return true;

            const pixelSamples = [];
            const sampleRelativePoints = [[0.3, 0.3], [0.5, 0.5], [0.7, 0.7], [0.3, 0.7], [0.7, 0.3]];

            for (const [relativeX, relativeY] of sampleRelativePoints) {
                const x = Math.floor(width * relativeX);
                const y = Math.floor(height * relativeY);
                const colorData = context.getImageData(x, y, 1, 1).data;
                pixelSamples.push([colorData[0], colorData[1], colorData[2]]);
            }

            let maximumColorDifference = 0;
            for (let i = 0; i < pixelSamples.length; i++) {
                for (let j = i + 1; j < pixelSamples.length; j++) {
                    const colorDifference = Math.abs(pixelSamples[i][0] - pixelSamples[j][0]) +
                        Math.abs(pixelSamples[i][1] - pixelSamples[j][1]) +
                        Math.abs(pixelSamples[i][2] - pixelSamples[j][2]);
                    maximumColorDifference = Math.max(maximumColorDifference, colorDifference);
                }
            }

            return maximumColorDifference < 30;
        } catch (e) {
            return false;
        }
    }

    function doesCanvasContainContent(canvas, { allowLowContrastOrWhiteBackground = false } = {}) {
        if (!canvas) return false;
        detectMangaResolution();
        try {
            const width = canvas.width;
            const height = canvas.height;
            if (!width || !height) return false;

            let fullImageData = null;
            const context = canvas.getContext('2d', { willReadFrequently: true });

            if (context) {
                const testData = context.getImageData(0, 0, Math.min(100, width), Math.min(100, height)).data;
                let allZero = true;
                for (let i = 0; i < Math.min(testData.length, 400); i += 4) {
                    if (testData[i] !== 0 || testData[i + 1] !== 0 || testData[i + 2] !== 0 || testData[i + 3] !== 0) {
                        allZero = false;
                        break;
                    }
                }
                if (allZero && isWebGLCanvas(canvas)) {
                    fullImageData = captureWebGLCanvasToImageData(canvas);
                }
            } else if (isWebGLCanvas(canvas)) {
                fullImageData = captureWebGLCanvasToImageData(canvas);
            }

            const scanAreaSize = Math.max(6, Math.min(40, Math.floor(Math.min(width, height) / 12)));
            const scanCenterPoints = [
                [0.5, 0.5],
                [0.2, 0.5],
                [0.8, 0.5],
                [0.5, 0.2],
                [0.5, 0.8]
            ];

            let definitiveContentHits = 0;
            let lowContrastHits = 0;

            for (const [relativeX, relativeY] of scanCenterPoints) {
                const scanX = Math.min(width - scanAreaSize, Math.max(0, Math.floor(width * relativeX - scanAreaSize / 2)));
                const scanY = Math.min(height - scanAreaSize, Math.max(0, Math.floor(height * relativeY - scanAreaSize / 2)));

                let scanData;
                if (fullImageData) {
                    scanData = new Uint8ClampedArray(scanAreaSize * scanAreaSize * 4);
                    for (let row = 0; row < scanAreaSize; row++) {
                        const srcOffset = ((scanY + row) * width + scanX) * 4;
                        const dstOffset = row * scanAreaSize * 4;
                        scanData.set(fullImageData.data.subarray(srcOffset, srcOffset + scanAreaSize * 4), dstOffset);
                    }
                } else {
                    scanData = context.getImageData(scanX, scanY, scanAreaSize, scanAreaSize).data;
                }

                let highContrastPixelCount = 0;
                let lowContrastPixelCount = 0;
                for (let i = 0; i < scanData.length; i += 4) {
                    const alpha = scanData[i + 3];
                    if (alpha < 6) continue;
                    const r = scanData[i], g = scanData[i + 1], b = scanData[i + 2];
                    const maxChannel = Math.max(r, g, b);
                    const minChannel = Math.min(r, g, b);
                    const maxChannelDifference = maxChannel - minChannel;

                    if (maxChannel < 240 || maxChannelDifference > 12) {
                        highContrastPixelCount++;
                        if (highContrastPixelCount > scanAreaSize) {
                            definitiveContentHits++;
                            break;
                        }
                    } else if (maxChannel < 250 || maxChannelDifference > 4) {
                        lowContrastPixelCount++;
                    }
                }

                if (allowLowContrastOrWhiteBackground && highContrastPixelCount === 0 && lowContrastPixelCount > scanAreaSize / 3) {
                    lowContrastHits++;
                }

                if (definitiveContentHits >= 2) return true;
            }

            if (allowLowContrastOrWhiteBackground && (definitiveContentHits >= 1 || lowContrastHits >= 2)) {
                return true;
            }

            return definitiveContentHits >= 1;
        } catch (e) {
            return true;
        }
    }

    function generateCanvasContentFingerprint(canvas) {
        if (!canvas) return null;
        try {
            const fingerprintStamp = document.createElement('canvas');
            fingerprintStamp.width = 80;
            fingerprintStamp.height = 80;
            const stampContext = fingerprintStamp.getContext('2d', { willReadFrequently: true });
            if (!stampContext) return null;

            let useWebGLFallback = false;

            stampContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 80, 80);
            let stampPixelData = stampContext.getImageData(0, 0, 80, 80).data;

            let allZero = true;
            for (let i = 0; i < Math.min(stampPixelData.length, 1000); i += 4) {
                if (stampPixelData[i] !== 0 || stampPixelData[i + 1] !== 0 || stampPixelData[i + 2] !== 0 || stampPixelData[i + 3] !== 0) {
                    allZero = false;
                    break;
                }
            }

            if (allZero && isWebGLCanvas(canvas)) {
                const webglImageData = captureWebGLCanvasToImageData(canvas);
                if (webglImageData) {
                    useWebGLFallback = true;
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCtx.putImageData(webglImageData, 0, 0);

                    stampContext.clearRect(0, 0, 80, 80);
                    stampContext.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, 80, 80);
                    stampPixelData = stampContext.getImageData(0, 0, 80, 80).data;
                }
            }

            let containsMeaningfulContent = false;
            for (let i = 0; i < stampPixelData.length; i += 4) {
                const r = stampPixelData[i], g = stampPixelData[i + 1], b = stampPixelData[i + 2], a = stampPixelData[i + 3];
                if (a > 20 && (r < 252 || g < 252 || b < 252)) {
                    containsMeaningfulContent = true;
                    break;
                }
            }

            let computedHash = 0;
            for (let i = 0; i < stampPixelData.length; i += 8) {
                computedHash = ((computedHash << 5) - computedHash) + stampPixelData[i];
                computedHash = ((computedHash << 5) - computedHash) + stampPixelData[i + 1];
                computedHash = ((computedHash << 5) - computedHash) + stampPixelData[i + 2];
                computedHash = computedHash >>> 0;
            }

            const prefix = containsMeaningfulContent ? 'c-' : 'e-';
            const webglFlag = useWebGLFallback ? 'w' : '';
            return `${prefix}${webglFlag}${computedHash}-${canvas.width}x${canvas.height}`;
        } catch (e) {
            if (e.name === 'SecurityError' || e.message.includes('insecure')) {
                return `s-${canvas.width}x${canvas.height}`;
            }
            return `t-${canvas.width}x${canvas.height}`;
        }
    }

    function areFingerprintsIdentical(fingerprintA, fingerprintB) {
        if (!fingerprintA || !fingerprintB) return false;
        return fingerprintA === fingerprintB;
    }

    function waitUntilPageRenders(maximumWaitTimeMilliseconds = 900, previousFingerprint = null) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            let latestFingerprint = null;

            const isPageReady = () => {
                if (downloadSession.isStopRequested) return true;
                const canvas = document.querySelector('.currentScreen canvas');
                if (!canvas) return false;
                if (isViewerCurrentlyLoading()) return false;

                const currentFingerprint = generateCanvasContentFingerprint(canvas);
                latestFingerprint = currentFingerprint;

                if (!doesCanvasContainContent(canvas, { allowLowContrastOrWhiteBackground: downloadSession.hasEncounteredContent })) return false;
                if (!previousFingerprint) return true;
                if (!currentFingerprint) return true;
                if (!areFingerprintsIdentical(currentFingerprint, previousFingerprint)) return true;
                if (performance.now() - startTime > 160) return true;
                return false;
            };

            if (isPageReady()) {
                resolve(latestFingerprint);
                return;
            }

            let isResolved = false;
            const observedElementsSet = new WeakSet();
            const elementMutationObserver = new MutationObserver(checkStatus);

            const observeNewElements = () => {
                const loadingSelectors = ['#frontScreen', '.loading', '.loadingImage', '#pageLoading', '.pageLoading'];
                loadingSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        if (element && !observedElementsSet.has(element)) {
                            try {
                                elementMutationObserver.observe(element, { attributes: true, attributeFilter: ['style', 'class'] });
                                observedElementsSet.add(element);
                            } catch (e) { }
                        }
                    });
                });
                const pageCounterElement = document.querySelector('#pageSliderCounter');
                if (pageCounterElement && !observedElementsSet.has(pageCounterElement)) {
                    try {
                        elementMutationObserver.observe(pageCounterElement, { characterData: true, subtree: true, childList: true });
                        observedElementsSet.add(pageCounterElement);
                    } catch (e) { }
                }
                const pageCanvasElement = document.querySelector('.currentScreen canvas');
                if (pageCanvasElement && !observedElementsSet.has(pageCanvasElement)) {
                    try {
                        elementMutationObserver.observe(pageCanvasElement, { attributes: true, attributeFilter: ['width', 'height', 'style', 'class'] });
                        observedElementsSet.add(pageCanvasElement);
                    } catch (e) { }
                }
            };

            let requestAnimationFrameId = null;
            const performCleanup = () => {
                if (isResolved) return;
                isResolved = true;
                elementMutationObserver.disconnect();
                clearInterval(checkIntervalId);
                if (requestAnimationFrameId !== null) {
                    cancelAnimationFrame(requestAnimationFrameId);
                }
                if (!latestFingerprint) {
                    const finalCanvas = document.querySelector('.currentScreen canvas');
                    latestFingerprint = generateCanvasContentFingerprint(finalCanvas);
                }
                resolve(latestFingerprint);
            };

            function checkStatus() {
                if (isResolved) return;
                if (isPageReady() || performance.now() - startTime > maximumWaitTimeMilliseconds) {
                    performCleanup();
                }
            }

            const checkIntervalId = setInterval(() => {
                observeNewElements();
                checkStatus();
            }, 40);

            const animationFrameLoop = () => {
                if (isResolved) return;
                checkStatus();
                requestAnimationFrameId = requestAnimationFrame(animationFrameLoop);
            };

            observeNewElements();
            checkStatus();
            animationFrameLoop();
        });
    }

    async function waitUntilCanvasMatchesExpectedResolution(expectedWidth, expectedHeight, maximumWaitTimeMilliseconds = 2000) {
        let totalTimeWaited = 0;
        const pollingIntervalMilliseconds = 30;

        while (totalTimeWaited < maximumWaitTimeMilliseconds) {
            const canvas = document.querySelector('.currentScreen canvas');
            if (canvas && canvas.width >= expectedWidth && canvas.height >= expectedHeight) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, pollingIntervalMilliseconds));
            totalTimeWaited += pollingIntervalMilliseconds;
        }
        return false;
    }

    async function applyTargetResolutionToViewer(width, height) {
        const rendererElement = document.querySelector('#renderer, .renderer');
        const viewerElement = document.getElementById('viewer');
        const devicePixelRatio = window.devicePixelRatio || 1;

        let targetWidth = width;
        let targetHeight = height;

        if (bookState.resolutionDetectionMethod !== 'metadata') {
            const manualWidthInput = document.getElementById('bw-manual-w');
            const manualHeightInput = document.getElementById('bw-manual-h');
            if (manualWidthInput && manualHeightInput) {
                targetWidth = parseInt(manualWidthInput.value) || targetWidth || 1125;
                targetHeight = parseInt(manualHeightInput.value) || targetHeight || 1600;
            }
        }

        console.log(`Resizing to ${targetWidth}x${targetHeight}`);

        if (viewerElement) {
            viewerElement.style.setProperty('width', targetWidth + 'px', 'important');
            viewerElement.style.setProperty('height', targetHeight + 'px', 'important');
        }

        if (rendererElement) {
            rendererElement.style.setProperty('width', targetWidth + 'px', 'important');
            rendererElement.style.setProperty('height', targetHeight + 'px', 'important');
        }

        const exactPixelWidth = Math.round(targetWidth * devicePixelRatio);
        const exactPixelHeight = Math.round(targetHeight * devicePixelRatio);

        const viewportElements = document.querySelectorAll('[id^="viewport"]');
        viewportElements.forEach(viewport => {
            viewport.style.setProperty('width', targetWidth + 'px', 'important');
            viewport.style.setProperty('height', targetHeight + 'px', 'important');
            viewport.style.setProperty('overflow', 'visible', 'important');

            const canvasElements = viewport.querySelectorAll('canvas');
            canvasElements.forEach(canvas => {
                canvas.style.setProperty('width', targetWidth + 'px', 'important');
                canvas.style.setProperty('height', targetHeight + 'px', 'important');
                canvas.width = exactPixelWidth;
                canvas.height = exactPixelHeight;
            });
        });

        const frontScreenElement = document.getElementById('frontScreen');
        if (frontScreenElement) {
            const frontCanvasElement = frontScreenElement.querySelector('canvas');
            if (frontCanvasElement) {
                frontCanvasElement.style.setProperty('width', targetWidth + 'px', 'important');
                frontCanvasElement.style.setProperty('height', targetHeight + 'px', 'important');
                frontCanvasElement.width = exactPixelWidth;
                frontCanvasElement.height = exactPixelHeight;
            }
        }

        const pageHighlightElement = document.getElementById('pageHighlight');
        if (pageHighlightElement) {
            pageHighlightElement.style.setProperty('width', targetWidth + 'px', 'important');
            pageHighlightElement.style.setProperty('height', targetHeight + 'px', 'important');
        }

        bookState.width = Math.round(targetWidth);
        bookState.height = Math.round(targetHeight);

        window.dispatchEvent(new Event('resize'));
        await delay(300);
        await waitUntilCanvasMatchesExpectedResolution(exactPixelWidth, exactPixelHeight);
    }

    function waitUntilCanvasHasContent(timeoutMilliseconds = 400) {
        return waitUntilPageRenders(timeoutMilliseconds, null).then(() => true);
    }

    function computeCropRect(canvas) {
        try {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const width = canvas.width;
            const height = canvas.height;
            const data = ctx.getImageData(0, 0, width, height).data;
            const brightnessThreshold = 242;

            const strideX = Math.max(1, Math.floor(width / 400));
            const strideY = Math.max(1, Math.floor(height / 400));

            const isContent = (x, y) => {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const a = data[idx + 3];
                if (a < 16) return false;
                const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                return brightness < brightnessThreshold;
            };

            const rowHasContent = (y) => {
                for (let x = 0; x < width; x += strideX) {
                    if (isContent(x, y)) return true;
                }
                return false;
            };

            const columnHasContent = (x, top, bottom) => {
                for (let y = top; y <= bottom; y += strideY) {
                    if (isContent(x, y)) return true;
                }
                return false;
            };

            let top = 0;
            let bottom = height - 1;
            let left = 0;
            let right = width - 1;

            while (top < height && !rowHasContent(top)) {
                top++;
            }

            while (bottom > top && !rowHasContent(bottom)) {
                bottom--;
            }

            while (left < width && !columnHasContent(left, top, bottom)) {
                left++;
            }

            while (right > left && !columnHasContent(right, top, bottom)) {
                right--;
            }

            const rowIsMostlyWhite = (y) => {
                let samples = 0;
                let white = 0;
                for (let x = left; x <= right; x += strideX) {
                    samples++;
                    if (!isContent(x, y)) white++;
                }
                if (samples === 0) return true;
                return white / samples > 0.98;
            };

            const columnIsMostlyWhite = (x) => {
                let samples = 0;
                let white = 0;
                for (let y = top; y <= bottom; y += strideY) {
                    samples++;
                    if (!isContent(x, y)) white++;
                }
                if (samples === 0) return true;
                return white / samples > 0.98;
            };

            while (top < bottom && rowIsMostlyWhite(top)) top++;
            while (bottom > top && rowIsMostlyWhite(bottom)) bottom--;
            while (left < right && columnIsMostlyWhite(left)) left++;
            while (right > left && columnIsMostlyWhite(right)) right--;

            if (right <= left || bottom <= top) {
                return {
                    sx: 0,
                    sy: 0,
                    sw: width,
                    sh: height
                };
            }

            const sx = left;
            const sy = top;
            const sw = Math.min(width - sx, right - left + 1);
            const sh = Math.min(height - sy, bottom - top + 1);

            return { sx, sy, sw, sh };
        } catch (error) {
            return {
                sx: 0,
                sy: 0,
                sw: canvas.width,
                sh: canvas.height
            };
        }
    }

    async function capturePageCanvasToBlob(targetWidth = bookState.width, targetHeight = bookState.height, options = {}) {
        const { skipPrerenderWait = false } = options;
        const viewerCanvas = document.querySelector('.currentScreen canvas');
        if (!viewerCanvas) throw new Error('No canvas');

        if (!skipPrerenderWait) {
            await waitUntilCanvasHasContent();
        }

        const exactPixelWidth = viewerCanvas.width;
        const exactPixelHeight = viewerCanvas.height;
        const devicePixelRatio = window.devicePixelRatio || 1;

        const apparentWidth = Math.round(exactPixelWidth / devicePixelRatio);
        const apparentHeight = Math.round(exactPixelHeight / devicePixelRatio);

        const temporaryCanvas = document.createElement('canvas');
        temporaryCanvas.width = apparentWidth;
        temporaryCanvas.height = apparentHeight;
        const temporaryContext = temporaryCanvas.getContext('2d', { willReadFrequently: true });
        temporaryContext.imageSmoothingEnabled = true;
        temporaryContext.imageSmoothingQuality = 'high';
        temporaryContext.drawImage(viewerCanvas, 0, 0, exactPixelWidth, exactPixelHeight, 0, 0, apparentWidth, apparentHeight);

        return new Promise((resolve, reject) => {
            const mimeTypeMap = {
                'webp': 'image/webp',
                'jpg': 'image/jpeg',
                'jxl': 'image/jxl',
                'png': 'image/png'
            };
            const mimeType = mimeTypeMap[downloadSession.outputFormat] || 'image/webp';
            const isLosslessFormat = downloadSession.outputFormat === 'jxl' || downloadSession.outputFormat === 'png';
            const compressionQuality = isLosslessFormat ? 1.0 : downloadSession.compressionQuality;

            const blobCreationTimeout = setTimeout(() => {
                console.warn('Blob timeout, falling back...');
                try {
                    const dataUrl = temporaryCanvas.toDataURL(mimeType, compressionQuality);
                    resolve(convertDataUrlToBlob(dataUrl));
                } catch (e) {
                    reject(e);
                }
            }, 3000);

            temporaryCanvas.toBlob(createdBlob => {
                clearTimeout(blobCreationTimeout);
                resolve(createdBlob || new Blob());
            }, mimeType, compressionQuality);
        });
    }

    function convertDataUrlToBlob(dataURL) {
        const parts = dataURL.split(',');
        const mimeType = parts[0].match(/:(.*?);/)[1];
        const binaryString = atob(parts[1]);
        let binaryLength = binaryString.length;
        const uint8Array = new Uint8Array(binaryLength);
        while (binaryLength--) {
            uint8Array[binaryLength] = binaryString.charCodeAt(binaryLength);
        }
        return new Blob([uint8Array], { type: mimeType });
    }

    async function coerceToBlob(sourceData) {
        if (!sourceData) return new Blob();
        if (sourceData instanceof Blob) return sourceData;

        if (typeof sourceData === 'string') {
            if (sourceData.startsWith('data:')) {
                return convertDataUrlToBlob(sourceData);
            }
            try {
                const fetchResponse = await fetch(sourceData);
                return await fetchResponse.blob();
            } catch (error) {
                console.warn('Fetch failed, fallback...');
                return new Blob([sourceData], { type: 'application/octet-stream' });
            }
        }

        if (sourceData instanceof ArrayBuffer) {
            return new Blob([sourceData]);
        }

        if (ArrayBuffer.isView(sourceData)) {
            return new Blob([sourceData.buffer]);
        }

        throw new Error('Unsupported image data format');
    }

    function retrieveMangaTitle() {
        try {
            if (bookState.title) return bookState.title;

            const pageTitleNode = document.querySelector('#pagetitle .titleText, #pagetitle');
            if (pageTitleNode) {
                const pageTitle = pageTitleNode.textContent || pageTitleNode.getAttribute('title');
                if (pageTitle && pageTitle.trim()) {
                    return pageTitle.trim();
                }
            }

            const documentTitleNode = document.querySelector('title');
            if (documentTitleNode) {
                return documentTitleNode.textContent.trim();
            }
            return 'manga';
        } catch (error) {
            return 'manga';
        }
    }

    function sanitizeFilename(rawTitle) {
        return rawTitle.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_').substring(0, 100);
    }

    async function generateAndDownloadZipArchive(pageDataList, archiveBasename = 'manga') {
        const jszipInstance = new JSZip();
        for (const page of pageDataList) {
            const imageBlob = await coerceToBlob(page.data);
            jszipInstance.file(page.filename, imageBlob);
        }
        const archiveBlob = await jszipInstance.generateAsync({ type: 'blob' });
        const archiveUrl = URL.createObjectURL(archiveBlob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = archiveUrl;
        downloadAnchor.download = `${sanitizeFilename(archiveBasename)}.zip`;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(archiveUrl);
    }

    function initializeDownloadActionButton() {
        initializeControlPanel();
        const mainActionButton = document.getElementById('bw-main-btn');
        if (!mainActionButton) return null;

        mainActionButton.onclick = async () => {
            if (mainActionButton.disabled) return;

            if (downloadSession.isActive) {
                downloadSession.isStopRequested = true;
                mainActionButton.textContent = 'Stopping...';
            } else if (downloadSession.capturedBlobs.length > 0 && !downloadSession.isActive) {
                mainActionButton.disabled = true;
                await downloadCapturedPagesZip();
                mainActionButton.disabled = false;
            } else {
                await executeFullMangaCaptureSession();
            }
        };

        refreshControlPanelUI();
        return mainActionButton;
    }

    function refreshControlPanelUI() {
        const actionButton = document.getElementById('bw-main-btn');
        const progressWrapper = document.getElementById('bw-progress-wrap');
        const progressBarElement = document.getElementById('bw-progress-bar');
        const optionsWrapper = document.getElementById('bw-options');
        if (!actionButton) return;

        if (typeof JSZip === 'undefined') {
            actionButton.textContent = 'Zip Error';
            actionButton.disabled = true;
            reportStatus('JSZip missing - check connection!');
            return;
        }

        if (downloadSession.isActive) {
            actionButton.textContent = `Stop capture`;
            actionButton.disabled = false;
            if (optionsWrapper) optionsWrapper.style.display = 'none';

            const manualResolutionElement = document.getElementById('bw-manual-res');
            const cropToggleWrapper = document.getElementById('bw-crop-wrap');
            if (manualResolutionElement) manualResolutionElement.style.display = 'none';
            if (cropToggleWrapper) cropToggleWrapper.style.display = 'none';

            const featureNote = document.querySelector('#bw-helper .feature-note');
            if (featureNote) featureNote.style.display = 'none';

            const totalPageCount = downloadSession.totalPageCount || 1;
            const capturedPageCount = downloadSession.capturedBlobs.length;
            const completionPercentage = Math.round((capturedPageCount / totalPageCount) * 100);

            const totalCapturedBytes = downloadSession.capturedBlobs.reduce((total, blob) => total + (blob.data.size || 0), 0);
            const formattedSizeString = totalCapturedBytes > 1024 * 1024
                ? (totalCapturedBytes / (1024 * 1024)).toFixed(1) + 'MB'
                : Math.round(totalCapturedBytes / 1024) + 'KB';

            if (progressWrapper) progressWrapper.style.display = 'block';
            if (progressBarElement) progressBarElement.style.width = `${completionPercentage}%`;

            let cropResolutionMessage = '';
            if (captureSettings.contentCropRect) {
                const devicePixelRatio = window.devicePixelRatio || 1;
                cropResolutionMessage = `[${Math.round(captureSettings.contentCropRect.w / devicePixelRatio)}x${Math.round(captureSettings.contentCropRect.h / devicePixelRatio)}] `;
            }

            reportStatus(`${cropResolutionMessage}Capturing ${capturedPageCount} / ${totalPageCount} (~${formattedSizeString})...`);
        } else {
            const manualResolutionElement = document.getElementById('bw-manual-res');
            const manualWidthInput = document.getElementById('bw-manual-w');
            const manualHeightInput = document.getElementById('bw-manual-h');
            const resolutionStatusLabel = document.getElementById('bw-res-label');
            const cropToggleWrapper = document.getElementById('bw-crop-wrap');

            if (manualResolutionElement && manualWidthInput && manualHeightInput && resolutionStatusLabel && cropToggleWrapper) {
                manualResolutionElement.style.display = 'block';
                if (bookState.resolutionDetectionMethod === 'metadata') {
                    resolutionStatusLabel.textContent = 'Native Resolution (Metadata)';
                    resolutionStatusLabel.style.color = '#3b82f6';
                    manualWidthInput.value = bookState.width;
                    manualHeightInput.value = bookState.height;
                    manualWidthInput.disabled = true;
                    manualHeightInput.disabled = true;
                    cropToggleWrapper.style.display = 'none';
                } else {
                    resolutionStatusLabel.textContent = 'Output Image Resolution';
                    resolutionStatusLabel.style.color = '#9ca3af';
                    manualWidthInput.disabled = false;
                    manualHeightInput.disabled = false;
                    cropToggleWrapper.style.display = 'flex';
                }
            }

            if (progressWrapper) progressWrapper.style.display = 'none';
            if (optionsWrapper) optionsWrapper.style.display = 'block';

            const featureNote = document.querySelector('#bw-helper .feature-note');
            if (featureNote) featureNote.style.display = 'flex';

            const totalPageCount = calculateTotalPages();
            if (totalPageCount > 0) {
                actionButton.textContent = `Download manga (${totalPageCount}p)`;
                actionButton.disabled = false;
                reportStatus('Ready to go!');
            } else {
                actionButton.textContent = 'Loading...';
                actionButton.disabled = true;
                reportStatus('Waiting for viewer...');
            }
            updateSizeEstimates();
        }
    }

    async function downloadCapturedPagesZip() {
        if (downloadSession.capturedBlobs.length === 0) {
            reportStatus('Nothing to save yet!');
            return;
        }
        const mangaTitle = retrieveMangaTitle();
        reportStatus(`Saving ${downloadSession.capturedBlobs.length} pages...`);
        await generateAndDownloadZipArchive(downloadSession.capturedBlobs, mangaTitle);
        reportStatus(`All done! Zipped ${downloadSession.capturedBlobs.length} pages.`);
    }

    async function executeFullMangaCaptureSession(sessionWidth = bookState.width, sessionHeight = bookState.height) {
        if (downloadSession.isActive) return;

        if (bookState.resolutionDetectionMethod !== 'metadata') {
            const manualWidthInput = document.getElementById('bw-manual-w');
            const manualHeightInput = document.getElementById('bw-manual-h');
            if (manualWidthInput && manualHeightInput) {
                bookState.width = parseInt(manualWidthInput.value) || 1125;
                bookState.height = parseInt(manualHeightInput.value) || 1600;
                bookState.isResolutionDetected = true;
            }
        } else if (!bookState.isResolutionDetected) {
            reportStatus('Getting dimensions...');
            await new Promise(resolve => {
                const detectionInterval = setInterval(() => {
                    if (bookState.width && bookState.height && bookState.isResolutionDetected) {
                        clearInterval(detectionInterval);
                        resolve();
                    }
                }, 500);
                setTimeout(() => {
                    clearInterval(detectionInterval);
                    resolve();
                }, 5000);
            });
            detectMangaResolution();
        }

        downloadSession.isActive = true;
        downloadSession.isStopRequested = false;
        downloadSession.capturedBlobs = [];
        captureSettings.contentCropRect = null;
        downloadSession.hasEncounteredContent = false;
        downloadSession.lastCapturedFingerprint = null;

        await requestScreenWakeLock();

        const totalPageCount = calculateTotalPages();
        downloadSession.totalPageCount = totalPageCount;

        if (totalPageCount === 0) {
            downloadSession.isActive = false;
            return;
        }

        sessionWidth = bookState.width;
        sessionHeight = bookState.height;
        downloadSession.isRightToLeft = isReadingRightToLeft();

        reportStatus('Configuring canvas...');
        await navigateToFirstPage();
        await delay(600);

        detectMangaResolution();
        await applyTargetResolutionToViewer(sessionWidth, sessionHeight);

        const initialPageFingerprint = await waitUntilPageRenders(1500);
        const currentCanvas = document.querySelector('.currentScreen canvas');
        downloadSession.lastCapturedFingerprint = initialPageFingerprint || generateCanvasContentFingerprint(currentCanvas);

        detectMangaResolution();

        const mangaTitle = retrieveMangaTitle();
        reportStatus(`Starting: 1/${totalPageCount}`);

        downloadSession.uniqueCapturedFingerprints = new Set();
        downloadSession.recentFingerprints = [];

        for (let i = 1; i <= totalPageCount; i++) {
            if (downloadSession.isStopRequested) break;

            try {
                downloadSession.currentPageIndex = i;
                refreshControlPanelUI();

                if (i > 1) {
                    await navigateToNextPage();
                }

                let timeElapsed = 0;
                const maximumWaitTime = 10000;
                let currentPollInterval = 10;

                while (timeElapsed < maximumWaitTime) {
                    const canvas = document.querySelector('.currentScreen canvas');
                    const isBusy = isScreenShowingLoadingSpinner();
                    const isCorrectPage = getCurrentPageIndex() === i;
                    const isReady = isPageCanvasReadyForCapture(canvas, timeElapsed, i);

                    if (isCorrectPage && !isBusy && isReady) break;

                    await delay(currentPollInterval);
                    timeElapsed += currentPollInterval;
                    currentPollInterval = Math.min(currentPollInterval * 2, 80);
                }

                const canvas = document.querySelector('.currentScreen canvas');
                if (!canvas) continue;

                const currentFingerprint = generateCanvasContentFingerprint(canvas);
                const devicePixelRatio = window.devicePixelRatio || 1;

                if (i === 1 && downloadSession.isAutoCropEnabled && !captureSettings.contentCropRect && bookState.resolutionDetectionMethod !== 'metadata') {
                    const contentRect = findContentBoundingBox(canvas);
                    if (contentRect) {
                        captureSettings.contentCropRect = contentRect;
                        console.log(`Auto-crop detected cover size: ${Math.round(contentRect.w / devicePixelRatio)}x${Math.round(contentRect.h / devicePixelRatio)}`);
                    } else {
                        console.log('Auto-crop failed to find content on cover, using full canvas.');
                    }
                }

                let outputWidth, outputHeight;
                if (captureSettings.contentCropRect) {
                    outputWidth = Math.round(captureSettings.contentCropRect.w / devicePixelRatio);
                    outputHeight = Math.round(captureSettings.contentCropRect.h / devicePixelRatio);
                } else {
                    outputWidth = Math.round(canvas.width / devicePixelRatio);
                    outputHeight = Math.round(canvas.height / devicePixelRatio);
                }

                const offscreenCanvas = document.createElement('canvas');
                offscreenCanvas.width = outputWidth;
                offscreenCanvas.height = outputHeight;
                const offscreenContext = offscreenCanvas.getContext('2d', { willReadFrequently: true });

                let sourceCanvas = canvas;
                let usedWebGLFallback = false;

                if (isWebGLCanvas(canvas)) {
                    const testCtx = document.createElement('canvas').getContext('2d');
                    testCtx.canvas.width = 10;
                    testCtx.canvas.height = 10;
                    testCtx.drawImage(canvas, 0, 0, 10, 10);
                    const testData = testCtx.getImageData(0, 0, 10, 10).data;
                    let allZero = true;
                    for (let idx = 0; idx < testData.length; idx += 4) {
                        if (testData[idx] !== 0 || testData[idx + 1] !== 0 || testData[idx + 2] !== 0 || testData[idx + 3] !== 0) {
                            allZero = false;
                            break;
                        }
                    }
                    if (allZero) {
                        const webglImageData = captureWebGLCanvasToImageData(canvas);
                        if (webglImageData) {
                            const tempCanvas = document.createElement('canvas');
                            tempCanvas.width = canvas.width;
                            tempCanvas.height = canvas.height;
                            const tempCtx = tempCanvas.getContext('2d');
                            tempCtx.putImageData(webglImageData, 0, 0);
                            sourceCanvas = tempCanvas;
                            usedWebGLFallback = true;
                        }
                    }
                }

                if (captureSettings.contentCropRect) {
                    offscreenContext.drawImage(sourceCanvas,
                        captureSettings.contentCropRect.x, captureSettings.contentCropRect.y, captureSettings.contentCropRect.w, captureSettings.contentCropRect.h,
                        0, 0, outputWidth, outputHeight
                    );
                } else {
                    offscreenContext.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, outputWidth, outputHeight);
                }

                if (usedWebGLFallback && i === 1) {
                    console.log('Using WebGL direct pixel capture (preserveDrawingBuffer workaround)');
                }

                const mimeTypeMap = { 'webp': 'image/webp', 'jpg': 'image/jpeg', 'jxl': 'image/jxl', 'png': 'image/png' };
                const mimeType = mimeTypeMap[downloadSession.outputFormat] || 'image/webp';
                const isLossless = downloadSession.outputFormat === 'jxl' || downloadSession.outputFormat === 'png';
                const compressionQuality = isLossless ? 1.0 : downloadSession.compressionQuality;

                const imageBlob = await new Promise((resolve, reject) => {
                    try {
                        offscreenCanvas.toBlob(blob => {
                            if (blob) resolve(blob);
                            else reject(new Error('Canvas toBlob returned null'));
                        }, mimeType, compressionQuality);
                    } catch (e) {
                        reject(e);
                    }
                });

                downloadSession.uniqueCapturedFingerprints.add(currentFingerprint);
                downloadSession.capturedBlobs.push({
                    filename: `page_${String(i).padStart(3, '0')}.${downloadSession.outputFormat}`,
                    data: imageBlob,
                    signature: currentFingerprint,
                    pageNum: i
                });

                downloadSession.recentFingerprints.push(currentFingerprint);
                if (downloadSession.recentFingerprints.length > 5) {
                    downloadSession.recentFingerprints.shift();
                }
            } catch (error) {
                if (error.name === 'SecurityError' || error.message.includes('insecure')) {
                    console.error(`Error at p${i}: Captures are blocked by browser security (Tainted Canvas). Use Chrome or check if CORS is blocked in Firefox.`);
                    reportStatus(`Error at p${i}: Insecure Operation`);
                } else {
                    console.log(`Error at p${i}:`, error);
                }
            }
        }

        downloadSession.isActive = false;
        downloadSession.isStopRequested = false;
        refreshControlPanelUI();
        releaseScreenWakeLock();

        const totalCapturedPages = downloadSession.capturedBlobs.length;
        if (totalCapturedPages > 0) {
            console.log(`Done! captured ${totalCapturedPages}/${totalPageCount} pages`);
            await generateAndDownloadZipArchive(downloadSession.capturedBlobs, mangaTitle);
            reportStatus(`Saved ${totalCapturedPages} pages!`);
        } else if (downloadSession.isStopRequested) {
            reportStatus('Stopped!');
        } else {
            reportStatus('Nothing found...');
        }
    }


    function initializeApplicationEntryPoint() {
        if (!document.body) {
            setTimeout(initializeApplicationEntryPoint, 500);
            return;
        }

        if (window.location.href.includes('viewer-trial') || window.location.href.includes('viewer-epubs-trial')) {
            bookState.isPreview = true;
        }

        initializeControlPanel();
        const closeButtonElement = document.getElementById('bw-close');
        if (closeButtonElement) {
            closeButtonElement.onclick = () => {
                const helperPanel = document.getElementById('bw-helper');
                if (helperPanel) helperPanel.style.display = 'none';
            };
        }

        initializeDownloadActionButton();
        detectMangaResolution();

        const pageDetectionIntervalId = setInterval(() => {
            const totalPageCount = calculateTotalPages();
            if (totalPageCount > 0) {
                refreshControlPanelUI();
                detectMangaResolution();
                if (bookState.width && bookState.height) {
                    clearInterval(pageDetectionIntervalId);
                }
            }
        }, 500);

        setTimeout(() => clearInterval(pageDetectionIntervalId), 30000);
    }

    initializeApplicationEntryPoint();

})();

// Attribution: the duplicate detection, file format and page advance logic
// refactoring, debug methods, Wakelock fixes and Windows/Firefox fixes
// have been assisted by Gemini 3.0 Flash.
// This code is not 100% hand-written.