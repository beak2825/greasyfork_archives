// ==UserScript==
// @name         二维码自动解析
// @description  鼠标悬停时自动在本地解析二维码
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @require      https://unpkg.com/@zxing/library@latest/umd/index.min.js
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @version      3.0
// @author       Gemini
// @license      GPLv3
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAABZElEQVR4nO3cQUrEMBiAURXv5QFceVJXHsCT6VYGpA5J+6X2vbVI4OPvZNJpHx4AAICredz6g5e3j68jFvKbz/fXzTX+dLb1Pu21EP5GgJgAMQFiAsQEiAkQex79B/fue28dvW9fbb0mICZATIDY8GfAra1r5Og1eLZ6vSYgJkBMgJgAMQFiAsQEiE3/HrDaPn9LvV4TEBMgJkBs+DOg/h3OvVZbrwmICRATICZATICYADEBYrufg4zecx3dt89+vmD22ZEJiAkQEyAmQEyAmAAxAWLDe9p6nz/b6Ho9J3wyAsQEiG3eEx69Rq92jV+NCYgJEBMgdvr3BdXPeI0yATEBYgLELveuiL3PrpwFncz0J2Rmq3dhezMBscu/K6JmAmICxASILb8Lmm21syUTEFt+As72q4p7mYDY5d8VUTMBMQFiAsSWvye85ehnwNwP+GcEiAkQEyAmQEyAmAAAAAAAcJBvjUVu7tMNP9IAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/556814/%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/556814/%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const DELAY_MS = 500;
    const TOLERANCE = 2;
    const CROP_TARGET_SIZE = 500; // 框选解析的最大尺寸 (超过此尺寸才缩小)
    const AUTO_SCAN_MAX_SIZE = 2000; // 超过此尺寸不自动解析

    // === ZXing 初始化 ===
    let zxingReaderStrict = null; // 仅用于悬停 (只识二维码)
    let zxingReaderAll = null;    // 用于强制解析 (识别所有)

    function getZXingReader(isForce) {
        if (!window.ZXing) return null;

        if (isForce) {
            // --- 模式 B: 强制解析 (全格式) ---
            if (!zxingReaderAll) {
                const hints = new Map();
                // 不设置 POSSIBLE_FORMATS 默认识别所有格式 (EAN, Code128, QR等)
                hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
                zxingReaderAll = new ZXing.BrowserMultiFormatReader(hints);
            }
            return zxingReaderAll;
        } else {
            // --- 模式 A: 悬停自动解析 (仅二维码) ---
            if (!zxingReaderStrict) {
                const hints = new Map();
                // 显式限制只识别 QR Code 和 Data Matrix
                const formats = [ZXing.BarcodeFormat.QR_CODE, ZXing.BarcodeFormat.DATA_MATRIX];
                hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
                // 悬停时也可以开启深度扫描 或者为了性能设为 false (这里建议开启以保证识别率)
                hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
                zxingReaderStrict = new ZXing.BrowserMultiFormatReader(hints);
            }
            return zxingReaderStrict;
        }
    }

    // === 全局变量 ===
    let hoverTimer = null;
    let tooltip = null;
    let currentTarget = null;

    // 坐标相关
    let lastMouseScreenX = 0;
    let lastMouseScreenY = 0;
    let lastMouseClientX = 0;
    let lastMouseClientY = 0;
    let topWinOffset = null;

    // 组合键状态控制
    let isRightClickHolding = false;
    let leftClickCount = 0;
    let interactionTarget = null;
    let suppressContextMenu = false;
    let suppressClick = false;
    let longPressTimer = null;

    // 框选相关
    let isCropping = false;
    let isNoScaleCrop = false;
    let cropOverlay = null;
    let cropBox = null;
    let cropStart = { x: 0, y: 0 };
    let cropTarget = null;

    // 会话缓存
    const qrCache = new Map();
    const canvasCache = new WeakMap();

    const isTop = window.self === window.top;

    // === 样式注入 ===
    GM_addStyle(`
        #qr-custom-tooltip {
            position: fixed;
            z-index: 2147483647;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 8px 12px;
            font-size: 12px;
            max-width: 320px;
            word-break: break-all;
            pointer-events: none;
            display: none;
            border: 1px solid #555;
            border-radius: 0px !important;
            box-shadow: none !important;
            line-height: 1.5;
            text-align: left;
        }
        .qr-detected-style {
            cursor: pointer !important;
            outline: none !important;
        }
        /* 框选遮罩 */
        #qr-crop-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.3);
            z-index: 2147483646;
            cursor: crosshair;
            display: none;
        }
        #qr-crop-box {
            position: absolute;
            border: 2px solid #4CAF50;
            background: rgba(76, 175, 80, 0.2);
            pointer-events: none;
            display: none;
        }
    `);

    // ==========================================
    //      通信模块 (跨域支持)
    // ==========================================

    function sendToTop(type, payload = {}) {
        if (isTop) {
            handleMessage({ data: { type, payload } });
        } else {
            window.top.postMessage({ type: 'QR_SCRIPT_MSG', action: type, payload }, '*');
        }
    }

    if (isTop) {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'QR_SCRIPT_MSG') {
                handleMessage({ data: { type: event.data.action, payload: event.data.payload } });
            }
        });
    }

    function handleMessage(e) {
        const { type, payload } = e.data;
        switch (type) {
            case 'SHOW_TOOLTIP':
                renderTooltip(payload.text, payload.coords, payload.isLink, payload.method);
                break;
            case 'HIDE_TOOLTIP':
                hideTooltipDOM();
                break;
            case 'SHOW_FEEDBACK':
                showFeedbackDOM();
                break;
        }
    }

    // ==========================================
    //      UI 渲染模块 (仅顶层窗口)
    // ==========================================

    function getTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'qr-custom-tooltip';
            document.body.appendChild(tooltip);
        }
        return tooltip;
    }

    function renderTooltip(text, coords, isLink, method) {
        const tip = getTooltip();
        const contentColor = isLink ? '#4dabf7' : '#ffffff';
        const actionColor = '#4CAF50';
        const bracketColor = '#F6B64E';
        const parenColor = '#B28BF7';

        const isLoading = text.startsWith('⌛');
        const isError = text.startsWith('❌');

        // --- 修改开始：标题构建逻辑 ---
        let titleHtml = '';

        // 检查是否以 "远程解析" 开头
        if (method && method.startsWith('远程解析')) {
            // 提取括号内的源 (如果有)
            let source = "";
            const match = method.match(/\((.+?)\)/);
            if (match) source = match[1];

            titleHtml = `<div style="margin-bottom:4px;">
                <span style="color:${bracketColor}; font-weight:bold;">[远程解析]</span>
                ${source ? `<span style="color:${parenColor}; font-weight:bold;"> (${escapeHtml(source)})</span>` : ''}
            </div>`;
        } else {
            // 本地解析
            titleHtml = `<div style="margin-bottom:4px;">
                <span style="color:${bracketColor}; font-weight:bold;">[本地解析]</span>
                <span style="color:${parenColor}; font-weight:bold;"> (${escapeHtml(method || '未知')})</span>
            </div>`;
        }

        let htmlContent = '';
        if (isLoading) {
            htmlContent = `<div style="color:#FFD700; font-weight:bold;">${escapeHtml(text)}</div>`;
        } else if (isError) {
            htmlContent = `<div style="color:#FF5252; font-weight:bold;">${escapeHtml(text)}</div>`;
        } else {
            htmlContent = `
                ${titleHtml}
                <div style="color:${contentColor}; margin-bottom:6px;">${escapeHtml(text)}</div>
                <div style="color:${actionColor}; font-weight:bold; border-top:1px solid #444; padding-top:4px;">
                    ${isLink ? '🔗 点击打开 | 📋 按住复制' : '📋 点击复制文本'}
                </div>
            `;
        }

        tip.innerHTML = htmlContent;
        tip.style.display = 'block';

        // --- 坐标计算 ---
        let offsetY, offsetX;
        if (topWinOffset) {
            offsetX = topWinOffset.x;
            offsetY = topWinOffset.y;
        } else {
            const winScreenX = window.screenX !== undefined ? window.screenX : window.screenLeft;
            const winScreenY = window.screenY !== undefined ? window.screenY : window.screenTop;
            offsetX = winScreenX + (window.outerWidth - window.innerWidth);
            offsetY = winScreenY + (window.outerHeight - window.innerHeight);
        }

        let left = coords.absLeft - offsetX;
        let top = coords.absBottom - offsetY + 10;

        const tipRect = tip.getBoundingClientRect();
        const winHeight = window.innerHeight;
        const winWidth = window.innerWidth;

        if (top + tipRect.height > winHeight) {
            top = (coords.absTop - offsetY) - tipRect.height - 10;
        }
        if (left + tipRect.width > winWidth) left = winWidth - tipRect.width - 10;
        if (left < 0) left = 10;

        tip.style.top = top + 'px';
        tip.style.left = left + 'px';
    }

    function hideTooltipDOM() {
        if (tooltip) tooltip.style.display = 'none';
    }

    function showFeedbackDOM() {
        const tip = getTooltip();
        if (tip.style.display === 'none') return;
        const originalHTML = tip.innerHTML;
        tip.innerHTML = `<div style="font-size:14px; text-align:center; color:#4dabf7; font-weight:bold;">✅ 已复制到剪贴板</div>`;
        setTimeout(() => {
            if (tip.style.display !== 'none') tip.innerHTML = originalHTML;
        }, 1000);
    }

    // ==========================================
    //      逻辑处理模块 (所有 Frame)
    // ==========================================

    function requestShowTooltip(text, element, method = "JSQR") {
        if (currentTarget !== element) currentTarget = element;

        const isLink = isUrl(text);
        const rect = element.getBoundingClientRect();

        const frameOffsetX = (lastMouseScreenX && lastMouseClientX) ? (lastMouseScreenX - lastMouseClientX) : 0;
        const frameOffsetY = (lastMouseScreenY && lastMouseClientY) ? (lastMouseScreenY - lastMouseClientY) : 0;

        const coords = {
            absLeft: rect.left + frameOffsetX,
            absTop: rect.top + frameOffsetY,
            absBottom: rect.bottom + frameOffsetY
        };

        sendToTop('SHOW_TOOLTIP', { text, coords, isLink, method });
    }

    function requestHideTooltip() {
        currentTarget = null;
        sendToTop('HIDE_TOOLTIP');
    }

    function requestFeedback() {
        sendToTop('SHOW_FEEDBACK');
    }

    // ==========================================
    //      框选逻辑
    // ==========================================

    function startCropMode(target, noScale = false) {
        if (isCropping) return;
        isCropping = true;
        isNoScaleCrop = noScale;
        cropTarget = target;

        if (!cropOverlay) {
            cropOverlay = document.createElement('div');
            cropOverlay.id = 'qr-crop-overlay';
            cropBox = document.createElement('div');
            cropBox.id = 'qr-crop-box';
            cropOverlay.appendChild(cropBox);
            document.body.appendChild(cropOverlay);

            // 辅助函数
            const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

            // 右键取消
            cropOverlay.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                endCropMode();
                // 使用全局 cropTarget
                if (cropTarget) requestShowTooltip("❌ 已取消框选", cropTarget);
                return false;
            });

            // 鼠标按下开始框选
            cropOverlay.addEventListener('mousedown', (e) => {
                if (e.button === 2 || !cropTarget) return;

                // 关键修复 2: 在点击瞬间动态获取当前目标的 Rect
                // 确保获取的是当前 cropTarget 的位置 而不是第一次初始化时的位置
                const imgRect = cropTarget.getBoundingClientRect();

                // 限制起点坐标
                const startX = clamp(e.clientX, imgRect.left, imgRect.right);
                const startY = clamp(e.clientY, imgRect.top, imgRect.bottom);

                cropStart = { x: startX, y: startY };

                cropBox.style.left = startX + 'px';
                cropBox.style.top = startY + 'px';
                cropBox.style.width = '0px';
                cropBox.style.height = '0px';
                cropBox.style.display = 'block';

                const onMove = (ev) => {
                    // 限制终点坐标
                    const curX = clamp(ev.clientX, imgRect.left, imgRect.right);
                    const curY = clamp(ev.clientY, imgRect.top, imgRect.bottom);

                    const width = Math.abs(curX - cropStart.x);
                    const height = Math.abs(curY - cropStart.y);
                    const left = Math.min(curX, cropStart.x);
                    const top = Math.min(curY, cropStart.y);

                    cropBox.style.width = width + 'px';
                    cropBox.style.height = height + 'px';
                    cropBox.style.left = left + 'px';
                    cropBox.style.top = top + 'px';
                };

                const onUp = (ev) => {
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onUp);

                    if (ev.button !== 0 || !isCropping) return;

                    const rect = cropBox.getBoundingClientRect();
                    endCropMode();

                    if (rect.width < 5 || rect.height < 5) return;

                    // 关键修复 3: 将当前的 cropTarget 传递给处理函数
                    processCropScan(cropTarget, rect);
                };

                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
            });
        }

        cropOverlay.style.display = 'block';
        const tipText = noScale ? "⌛ 原图框选" : "⌛ 缩放框选";
        requestShowTooltip(tipText, target);
    }

    function endCropMode() {
        isCropping = false;
        if (cropOverlay) cropOverlay.style.display = 'none';
        if (cropBox) cropBox.style.display = 'none';
    }

    function processCropScan(target, selectionRect) {
        const targetRect = target.getBoundingClientRect();
        const selX = selectionRect.left;
        const selY = selectionRect.top;
        const selW = selectionRect.width;
        const selH = selectionRect.height;
        const imgX = targetRect.left;
        const imgY = targetRect.top;
        const relX = selX - imgX;
        const relY = selY - imgY;

        const cropRect = {
            x: relX,
            y: relY,
            w: selW,
            h: selH,
            noScale: isNoScaleCrop
        };

        scanElement(target, true, cropRect);
    }

    // === 统一入口 ===
    function scanElement(target, force = false, cropRect = null) {
        // 获取当前缓存状态 (用于强制解析时的判断)
        let prevCache = null;
        if (target.tagName === 'IMG' && target.src) prevCache = qrCache.get(target.src);
        else if (target.tagName === 'CANVAS') prevCache = canvasCache.get(target);

        if (target.tagName === 'IMG') {
            scanImage(target, force, cropRect, prevCache);
        } else if (target.tagName === 'CANVAS') {
            scanCanvas(target, force, cropRect, prevCache);
        }
    }

    // === 远程解析 ===

    // === 远程解析辅助函数 ===
    // 1. 请求 zxing.org
    function fetchZxing(src) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://zxing.org/w/decode?u=" + encodeURIComponent(src),
                timeout: 10000, // 10秒超时
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const tds = doc.querySelectorAll('td');
                        let resultText = null;
                        for (let i = 0; i < tds.length; i++) {
                            if (tds[i].textContent.trim() === "Parsed Result") {
                                const nextTd = tds[i].nextElementSibling;
                                if (nextTd) {
                                    const pre = nextTd.querySelector('pre');
                                    if (pre) { resultText = pre.textContent; break; }
                                }
                            }
                        }
                        if (resultText) resolve({ text: resultText, source: "zxing.org" });
                        else reject("zxing parse error");
                    } else {
                        reject("zxing status " + response.status);
                    }
                },
                onerror: (e) => reject("zxing network error"),
                ontimeout: () => reject("zxing timeout")
            });
        });
    }

    // 2. 请求 api.2dcode.biz
    function fetch2dCode(src) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.2dcode.biz/v1/read-qr-code?file_url=" + encodeURIComponent(src),
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            // 检查 code: 0 和 data.contents 数组
                            if (json.code === 0 && json.data && json.data.contents && json.data.contents.length > 0) {
                                resolve({ text: json.data.contents[0], source: "api.2dcode.biz" });
                            } else {
                                reject("2dcode api error: " + (json.message || "no data"));
                            }
                        } catch (e) {
                            reject("2dcode json parse error");
                        }
                    } else {
                        reject("2dcode status " + response.status);
                    }
                },
                onerror: (e) => reject("2dcode network error"),
                ontimeout: () => reject("2dcode timeout")
            });
        });
    }

    // 3. Promise.any Polyfill (确保兼容性)
    // 返回最先成功的那个 如果全部失败则报错
    function promiseAny(promises) {
        if (Promise.any) return Promise.any(promises);
        return new Promise((resolve, reject) => {
            let errors = [];
            let rejectedCount = 0;
            promises.forEach((p, index) => {
                Promise.resolve(p).then(resolve).catch(error => {
                    errors[index] = error;
                    rejectedCount++;
                    if (rejectedCount === promises.length) {
                        reject(new Error("All promises rejected"));
                    }
                });
            });
        });
    }

    // === 远程解析主入口 ===
    function scanExternal(target) {
        if (target.tagName !== 'IMG' || !target.src || !/^http/.test(target.src)) {
            requestShowTooltip("❌ 远程解析仅支持 http/https 图片链接", target);
            return;
        }
        const src = target.src;
        requestShowTooltip("⌛ 正在连接远程服务器解析...", target);

        // 并行发起请求
        const p1 = fetchZxing(src);
        const p2 = fetch2dCode(src);

        // 竞速：谁先成功用谁
        promiseAny([p1, p2])
            .then(result => {
                const methodStr = `远程解析 (${result.source})`;

                // 写入缓存 (status: success)
                qrCache.set(src, { status: 'success', text: result.text, method: methodStr });

                // 显示结果
                applyQrSuccess(target, result.text, methodStr);
            })
            .catch(err => {
                // 全部失败
                requestShowTooltip("❌ 远程解析失败", target);

                // 写入失败缓存
                qrCache.set(src, { status: 'failed', reason: 'remote_all_failed' });
            });
    }

    // ==========================================
    //      图像获取与预处理
    // ==========================================

    function scanImage(img, force, cropRect, prevCache) {
        const src = img.src;
        if (!src) return;
        // 如果非强制且已有缓存(且非skipped) 则跳过
        // 注意：如果是 skipped (too_large) force 模式下应该允许继续
        if (!force && !cropRect && qrCache.has(src)) return;

        let displayWidth = img.width || img.clientWidth || 0;
        let displayHeight = img.height || img.clientHeight || 0;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const tempImg = new Image();
        tempImg.crossOrigin = "Anonymous";
        tempImg.src = src;

        tempImg.onload = () => processImage(tempImg, canvas, context, img, src, force, 'IMG', displayWidth, displayHeight, cropRect, prevCache);
        tempImg.onerror = () => scanImage_Fallback(img, src, force, displayWidth, displayHeight, cropRect);
    }

    function scanImage_Fallback(originalImg, src, force, w, h, cropRect) {
        GM_xmlhttpRequest({
            method: "GET",
            url: src,
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        processImage(tempImg, canvas, context, originalImg, src, force, 'IMG', w, h, cropRect);
                        URL.revokeObjectURL(blobUrl);
                    };
                    tempImg.onerror = () => {
                        if (!cropRect) qrCache.set(src, null);
                        URL.revokeObjectURL(blobUrl);
                    };
                    tempImg.src = blobUrl;
                } else {
                    if (!cropRect) qrCache.set(src, null);
                }
            },
            onerror: () => { if (!cropRect) qrCache.set(src, null); }
        });
    }

    function scanCanvas(canvasEl, force, cropRect, prevCache) {
        if (!force && !cropRect && canvasCache.has(canvasEl)) return;

        try {
            let context = canvasEl.getContext('2d');
            if (context) {
                try {
                    const imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height);

                    // 1. 确定源尺寸
                    const sourceW = canvasEl.width;
                    const sourceH = canvasEl.height;

                    // 2. 计算裁剪
                    let drawX = 0, drawY = 0, drawW = sourceW, drawH = sourceH;
                    if (cropRect) {
                        const clientW = canvasEl.clientWidth || sourceW;
                        const clientH = canvasEl.clientHeight || sourceH;
                        const scaleX = sourceW / clientW;
                        const scaleY = sourceH / clientH;

                        drawX = cropRect.x * scaleX;
                        drawY = cropRect.y * scaleY;
                        drawW = cropRect.w * scaleX;
                        drawH = cropRect.h * scaleY;
                    }

                    // 3. 计算缩放 (仅缩小 不放大)
                    let targetW = drawW;
                    let targetH = drawH;
                    if (cropRect) {
                        const maxDim = Math.max(drawW, drawH);
                        // 只有当尺寸超过目标尺寸时才缩放
                        if (maxDim > CROP_TARGET_SIZE) {
                            const scale = CROP_TARGET_SIZE / maxDim;
                            targetW = drawW * scale;
                            targetH = drawH * scale;
                        }
                    }

                    // 4. 绘制到新 Canvas (加白边)
                    const padding = 50;
                    const finalCanvas = document.createElement('canvas');
                    finalCanvas.width = targetW + (padding * 2);
                    finalCanvas.height = targetH + (padding * 2);
                    const finalCtx = finalCanvas.getContext('2d');
                    finalCtx.fillStyle = '#FFFFFF';
                    finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

                    // 绘制并缩放
                    finalCtx.drawImage(canvasEl, drawX, drawY, drawW, drawH, padding, padding, targetW, targetH);

                    runScanPipeline(finalCanvas, finalCtx, canvasEl, force, 'CANVAS', canvasEl, !!cropRect, prevCache);
                } catch (e) {
                    canvasCache.set(canvasEl, null);
                }
            } else {
                const dataUrl = canvasEl.toDataURL();
                const tempImg = new Image();
                tempImg.onload = () => {
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    processImage(tempImg, tempCanvas, tempCtx, canvasEl, null, force, 'CANVAS', canvasEl.width, canvasEl.height, cropRect);
                };
                tempImg.src = dataUrl;
            }
        } catch (e) {
            canvasCache.set(canvasEl, null);
        }
    }

    // === 高质量缩放辅助函数 (模拟 Lanczos 效果) ===
    function smartDownscale(imageObj, ctx, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetW, targetH) {
        // 1. 开启浏览器最高质量插值
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 2. 如果缩放比例小于 2 倍 直接绘制 (分步缩放收益不大)
        if (sourceW <= targetW * 2 && sourceH <= targetH * 2) {
            ctx.drawImage(imageObj, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetW, targetH);
            return;
        }

        // 3. 分步缩放逻辑
        // 创建临时 Canvas 进行中间态处理
        let tempCanvas = document.createElement('canvas');
        let tempCtx = tempCanvas.getContext('2d');
        let curW = sourceW;
        let curH = sourceH;

        tempCanvas.width = curW;
        tempCanvas.height = curH;

        // 第一步：裁剪原图到临时 Canvas
        tempCtx.drawImage(imageObj, sourceX, sourceY, sourceW, sourceH, 0, 0, curW, curH);

        // 循环减半缩放 直到接近目标尺寸
        while (curW > targetW * 2) {
            const newW = Math.floor(curW * 0.5);
            const newH = Math.floor(curH * 0.5);

            // 创建更小的临时 Canvas
            let nextCanvas = document.createElement('canvas');
            nextCanvas.width = newW;
            nextCanvas.height = newH;
            let nextCtx = nextCanvas.getContext('2d');

            // 绘制缩小版
            nextCtx.drawImage(tempCanvas, 0, 0, curW, curH, 0, 0, newW, newH);

            // 更新引用
            curW = newW;
            curH = newH;
            tempCanvas = nextCanvas; // 丢弃旧的大 Canvas
        }

        // 4. 最后一步：绘制到目标 Canvas
        ctx.drawImage(tempCanvas, 0, 0, curW, curH, targetX, targetY, targetW, targetH);
    }

    function processImage(imageObj, canvas, context, targetEl, cacheKey, force, type, displayWidth, displayHeight, cropRect) {
        // 1. 获取原始尺寸
        let naturalW = imageObj.naturalWidth;
        let naturalH = imageObj.naturalHeight;

        // SVG 检测
        const isSVG = /\.svg($|\?|#)/i.test(imageObj.src) || /^data:image\/svg/i.test(imageObj.src);
        const isUnknownSize = !naturalW || naturalW === 0;

        // 标记：是否必须使用 5 参数模式 (SVG 或 无尺寸图片)
        const forceSimpleMode = isSVG || isUnknownSize;

        if (isUnknownSize) {
            naturalW = displayWidth || 300;
            naturalH = displayHeight || 300;
        }

        // 2. 计算目标尺寸 (初始为原图尺寸)
        let targetW = naturalW;
        let targetH = naturalH;

        // 如果是框选模式 先计算裁剪后的理论尺寸
        if (cropRect && !forceSimpleMode) {
            const scaleX = naturalW / displayWidth;
            const scaleY = naturalH / displayHeight;
            targetW = cropRect.w * scaleX;
            targetH = cropRect.h * scaleY;
        }

        // === 关键修改：缩放限制逻辑 ===
        let shouldDownscale = false;

        if (cropRect) {
            // 场景 A: 框选模式
            // 默认缩小 除非开启了 noScale (原图框选)
            if (!cropRect.noScale) shouldDownscale = true;
        } else {
            // 场景 B: 全图模式
            if (!force) {
                // 1. 悬停自动解析 -> 强制缩小 (提升性能)
                shouldDownscale = true;
            } else {
                // 2. 右键强制解析 -> 不缩小 (保留原图细节)
                shouldDownscale = false;
            }
        }

        // 执行缩小计算
        if (shouldDownscale) {
            const maxDim = Math.max(targetW, targetH);
            if (maxDim > CROP_TARGET_SIZE) {
                const scale = CROP_TARGET_SIZE / maxDim;
                targetW *= scale;
                targetH *= scale;
            }
        }

        const padding = 50;
        canvas.width = targetW + (padding * 2);
        canvas.height = targetH + (padding * 2);

        // 3. 绘制背景
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 4. 绘制图像
        if (cropRect && !forceSimpleMode) {
            // 【模式 A：位图裁剪】
            const scaleX = naturalW / displayWidth;
            const scaleY = naturalH / displayHeight;

            let sourceX = cropRect.x * scaleX;
            let sourceY = cropRect.y * scaleY;
            let sourceW = cropRect.w * scaleX;
            let sourceH = cropRect.h * scaleY;

            // 边界保护
            if (sourceX < 0) sourceX = 0;
            if (sourceY < 0) sourceY = 0;
            if (sourceX + sourceW > naturalW) sourceW = naturalW - sourceX;
            if (sourceY + sourceH > naturalH) sourceH = naturalH - sourceY;

            smartDownscale(imageObj, context, sourceX, sourceY, sourceW, sourceH, padding, padding, targetW, targetH);

        } else {
            // 【模式 B：全图模式】
            if (forceSimpleMode) {
                // SVG: 浏览器原生绘制
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                context.drawImage(imageObj, padding, padding, targetW, targetH);
            } else {
                // 位图全图: 使用 smartDownscale
                // 如果 shouldDownscale 为 true 这里会自动执行高质量缩小
                // 如果 shouldDownscale 为 false 这里就是原图绘制
                smartDownscale(imageObj, context, 0, 0, naturalW, naturalH, padding, padding, targetW, targetH);
            }
        }

        runScanPipeline(canvas, context, targetEl, force, type, cacheKey, !!cropRect);
    }

    // ==========================================
    //      核心扫描管道 (JSQR + ZXing)
    // ==========================================

    // 让浏览器有机会渲染一帧 (避免 UI 假死)
    function yieldToMain() {
        return new Promise(resolve => setTimeout(resolve, 0));
    }

    async function runScanPipeline(canvas, context, targetEl, force, type, cacheKey, isCrop, prevCache) {
        if (force) requestShowTooltip("⌛ 正在进行强制解析...", targetEl);

        await yieldToMain();

        let result = null;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const suffix = isCrop ? " 框选" : "";

        // === 智能跳过逻辑 ===
        // 如果是强制解析 且之前的失败原因是 "standard_failed" (标准解析已尝试过且失败)
        // 则直接跳过 Phase 1 进入 Phase 2
        let skipStandard = false;
        if (force && prevCache && prevCache.status === 'failed' && prevCache.reason === 'standard_failed') {
            skipStandard = true;
            requestShowTooltip("⌛ 深度解析...", targetEl);
            await yieldToMain();
        }

        // --- 阶段 1: 标准解析 ---
        if (!skipStandard) {
            // 1.1 JSQR 标准
            result = jsQR(imageData.data, imageData.width, imageData.height);
            if (result) {
                handleSuccess(result.data, "JSQR" + suffix, type, cacheKey, targetEl);
                return;
            }

            await yieldToMain();

            // 1.2 ZXing 标准
            result = await tryZXing(canvas, force);
            if (result) {
                handleSuccess(result, "ZXing" + suffix, type, cacheKey, targetEl);
                return;
            }
        }

        // 如果不是强制模式 且标准解析失败 则记录失败原因并退出
        if (!force) {
            handleFail(type, cacheKey, targetEl, false, "standard_failed"); // <--- 记录原因
            return;
        }

        // --- 阶段 2: 增强解析 (仅强制模式) ---

        requestShowTooltip("⌛ 正在尝试反色解析...", targetEl);
        await yieldToMain();

        // 反色数据准备
        const invertedData = new Uint8ClampedArray(imageData.data);
        for (let i = 0; i < invertedData.length; i += 4) {
            invertedData[i] = 255 - invertedData[i];
            invertedData[i + 1] = 255 - invertedData[i + 1];
            invertedData[i + 2] = 255 - invertedData[i + 2];
            invertedData[i + 3] = 255;
        }

        // 2.1 JSQR 反色
        result = jsQR(invertedData, imageData.width, imageData.height);
        if (result) {
            handleSuccess(result.data, "JSQR 反色" + suffix, type, cacheKey, targetEl);
            return;
        }

        await yieldToMain();

        // 2.2 ZXing 反色
        const invertedImageData = new ImageData(invertedData, canvas.width, canvas.height);
        context.putImageData(invertedImageData, 0, 0);
        result = await tryZXing(canvas, force);
        if (result) {
            handleSuccess(result, "ZXing 反色" + suffix, type, cacheKey, targetEl);
            return;
        }

        requestShowTooltip("⌛ 正在尝试二值化解析...", targetEl);
        await yieldToMain();

        // 二值化数据准备
        const binarizedData = new Uint8ClampedArray(imageData.data);
        const len = binarizedData.length;
        let totalLum = 0;
        for (let i = 0; i < len; i += 4) {
            totalLum += 0.299 * binarizedData[i] + 0.587 * binarizedData[i+1] + 0.114 * binarizedData[i+2];
        }
        const avgLum = totalLum / (len / 4);
        for (let i = 0; i < len; i += 4) {
            const lum = 0.299 * binarizedData[i] + 0.587 * binarizedData[i+1] + 0.114 * binarizedData[i+2];
            const val = lum > avgLum ? 255 : 0;
            binarizedData[i] = val;
            binarizedData[i+1] = val;
            binarizedData[i+2] = val;
            binarizedData[i+3] = 255;
        }

        // 2.3 JSQR 二值化
        result = jsQR(binarizedData, imageData.width, imageData.height);
        if (result) {
            handleSuccess(result.data, "JSQR 二值化" + suffix, type, cacheKey, targetEl);
            return;
        }

        await yieldToMain();

        // 2.4 ZXing 二值化
        const binarizedImageData = new ImageData(binarizedData, canvas.width, canvas.height);
        context.putImageData(binarizedImageData, 0, 0);
        result = await tryZXing(canvas, force);
        if (result) {
            handleSuccess(result, "ZXing 二值化" + suffix, type, cacheKey, targetEl);
            return;
        }

        handleFail(type, cacheKey, targetEl, true, "force_failed");
    }

    function tryZXing(canvas, isForce) {
        return new Promise((resolve) => {
            if (typeof ZXing === 'undefined') { resolve(null); return; }

            const dataUrl = canvas.toDataURL('image/png');
            const img = new Image();
            img.onload = () => {
                // 关键修改：将 isForce 传入获取对应的 Reader
                const reader = getZXingReader(isForce);
                if (!reader) { resolve(null); return; }

                reader.decodeFromImageElement(img)
                    .then(res => resolve(res.text))
                    .catch(() => resolve(null));
            };
            img.onerror = () => resolve(null);
            img.src = dataUrl;
        });
    }

    function handleSuccess(text, method, type, cacheKey, targetEl) {
        const cacheObj = { status: 'success', text: text, method: method };

        if (type === 'IMG') qrCache.set(cacheKey, cacheObj);
        else canvasCache.set(targetEl, cacheObj);

        applyQrSuccess(targetEl, text, method);
    }

    function handleFail(type, cacheKey, targetEl, isForce, reason = "unknown") {
        if (!isForce) {
            const failObj = { status: 'failed', reason: reason };

            if (type === 'IMG') qrCache.set(cacheKey, failObj);
            else canvasCache.set(targetEl, failObj);
        }

        if (isForce) {
            requestShowTooltip("❌ 强制解析失败", targetEl);
        }
    }

    // ==========================================
    //      公共辅助函数
    // ==========================================

    function applyQrSuccess(el, text, method) {
        el.dataset.hasQr = "true";
        el.classList.add('qr-detected-style');

        requestShowTooltip(text, el, method);
    }

    function isUrl(text) {
        if (!text) return false;
        // ^ : 开始
        // \s*: 允许开头有空格
        // https?:\/\/: 协议
        // [^\s]+: 链接主体不能包含空格
        // \s*: 允许结尾有空格
        // $ : 结束
        return /^\s*https?:\/\/[^\s]+\s*$/i.test(text);
    }
    function escapeHtml(text) {
        if (!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // ==========================================
    //      事件监听
    // ==========================================

    document.addEventListener('mousemove', (e) => {
        lastMouseScreenX = e.screenX;
        lastMouseScreenY = e.screenY;
        lastMouseClientX = e.clientX;
        lastMouseClientY = e.clientY;

        if (isTop) {
            topWinOffset = {
                x: e.screenX - e.clientX,
                y: e.screenY - e.clientY
            };
        }
    }, true);

    document.addEventListener('mouseover', (e) => {
        if (isCropping) return;
        const target = e.target;
        const isImg = target.tagName === 'IMG';
        const isCanvas = target.tagName === 'CANVAS';

        if (!isImg && !isCanvas) return;
        if (isImg && (!target.complete || target.naturalWidth === 0)) return;

        // --- 1. 获取尺寸 ---
        let w, h;
        if (isImg) {
            w = target.naturalWidth;
            h = target.naturalHeight;
        } else {
            w = target.width || target.clientWidth;
            h = target.height || target.clientHeight;
        }

        // --- 2. 检查缓存 ---
        let cacheData = null;
        if (isImg && target.src) cacheData = qrCache.get(target.src);
        else if (isCanvas) cacheData = canvasCache.get(target);

        if (cacheData) {
            // 如果是成功状态 显示结果
            if (cacheData.status === 'success') {
                if (!target.dataset.hasQr) applyQrSuccess(target, cacheData.text, cacheData.method);
                else requestShowTooltip(cacheData.text, target, cacheData.method);
            }
            // 如果是失败或跳过状态 直接返回 不再重复尝试
            return;
        }

        // --- 3. 尺寸检查 (新增逻辑) ---
        // 如果尺寸超过 2000 且没有缓存 则标记为因过大而跳过
        if (w > AUTO_SCAN_MAX_SIZE || h > AUTO_SCAN_MAX_SIZE) {
            const skipObj = { status: 'skipped', reason: 'too_large' };
            if (isImg && target.src) qrCache.set(target.src, skipObj);
            else if (isCanvas) canvasCache.set(target, skipObj);
            return; // 停止自动解析
        }

        if (Math.abs(w - h) > TOLERANCE || w < 30) {
            const failObj = { status: 'failed', reason: 'invalid_size' };
            if (isImg && target.src) qrCache.set(target.src, failObj);
            else if (isCanvas) canvasCache.set(target, failObj);
            return;
        }

        hoverTimer = setTimeout(() => {
            if (isCropping) return;
            // 再次检查缓存防止并发
            if (isImg && qrCache.has(target.src)) return;
            if (isCanvas && canvasCache.has(target)) return;
            scanElement(target, false);
        }, DELAY_MS);
    });

    document.addEventListener('mouseout', (e) => {
        // 清除长按定时器
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        const t = e.target;
        if (t.tagName === 'IMG' || t.tagName === 'CANVAS') {
            clearTimeout(hoverTimer);
            if (currentTarget === t && !isCropping) {
                requestHideTooltip();
            }
        }
    });

    // === 交互逻辑 ===

    document.addEventListener('mousedown', (e) => {
        if (isCropping) return;

        // 右键逻辑
        if (e.button === 2) {
            isRightClickHolding = true;
            leftClickCount = 0;
            interactionTarget = e.target;
            suppressContextMenu = false;
        }
        // 左键逻辑
        else if (e.button === 0) {
            // 1. 组合键逻辑 (右键按住 + 左键点击)
            if (isRightClickHolding) {
                if (interactionTarget && (interactionTarget.tagName === 'IMG' || interactionTarget.tagName === 'CANVAS')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    leftClickCount++;
                    suppressContextMenu = true;
                    suppressClick = true;
                }
                return; // 组合键模式下不触发长按
            }

            // 2. 长按复制逻辑
            const target = e.target;
            if ((target.tagName === 'IMG' || target.tagName === 'CANVAS') && target.dataset.hasQr === "true") {
                // 获取数据
                let data = null;
                let cacheData = null;
                if (target.tagName === 'IMG') cacheData = qrCache.get(target.src);
                else cacheData = canvasCache.get(target);

                if (cacheData && cacheData.status === 'success') {
                    data = cacheData.text;
                }

                // 只有当结果是链接时 才启用长按复制
                if (data && isUrl(data)) {
                    longPressTimer = setTimeout(() => {
                        GM_setClipboard(data);
                        requestFeedback(); // 显示 "已复制"
                        suppressClick = true; // 关键：阻止后续的 click 事件打开链接
                        longPressTimer = null; // 重置定时器
                    }, 500);
                }
            }
        }
    }, true);

    document.addEventListener('mouseup', (e) => {
        // 清除长按定时器
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }

        if (isCropping) return;

        if (e.button === 2) {
            isRightClickHolding = false;

            if (leftClickCount > 0 && interactionTarget) {
                // 1次点击 -> 强制本地解析 (全策略)
                if (leftClickCount === 1) {
                    scanElement(interactionTarget, true);
                }
                // 2次点击 -> 远程解析
                else if (leftClickCount === 2) {
                    scanExternal(interactionTarget);
                }
                // 3次点击 -> 普通框选 (会缩小到 500px)
                else if (leftClickCount === 3) {
                    startCropMode(interactionTarget, false);
                }
                // 4次点击 -> 原图框选 (不缩小)
                else if (leftClickCount === 4) {
                    startCropMode(interactionTarget, true);
                }
            }

            interactionTarget = null;
            leftClickCount = 0;
        }
    }, true);

    document.addEventListener('contextmenu', (e) => {
        if (suppressContextMenu) {
            e.preventDefault();
            e.stopPropagation();
            suppressContextMenu = false;
        }
    }, true);

    document.addEventListener('click', (e) => {
        if (suppressClick) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            suppressClick = false;
            return;
        }

        const target = e.target;
        if ((target.tagName === 'IMG' || target.tagName === 'CANVAS') && target.dataset.hasQr === "true") {
            let data = null;
            let cacheData = null;

            if (target.tagName === 'IMG') cacheData = qrCache.get(target.src);
            else cacheData = canvasCache.get(target);

            // 检查 status === 'success'
            if (cacheData && cacheData.status === 'success') {
                data = cacheData.text;
            }

            if (data) {
                e.preventDefault();
                e.stopPropagation();

                if (isUrl(data)) {
                    GM_openInTab(data, { active: true, insert: true });
                } else {
                    GM_setClipboard(data);
                    requestFeedback();
                }
            }
        }
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isCropping) {
            endCropMode();
            requestShowTooltip("❌ 已取消框选", currentTarget || document.body);
        }
    });

})();