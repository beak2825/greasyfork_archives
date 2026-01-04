// ==UserScript==
// @name         网页二维码识别器 (QR Code Scanner)
// @namespace    https://github.com/ShiYioo
// @version      1.1.0
// @description  自动识别网页上的二维码，支持图片右键扫描和手动框选扫描
// @author       ShiYi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556774/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20%28QR%20Code%20Scanner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556774/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20%28QR%20Code%20Scanner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只在顶层窗口运行，不在iframe中运行
    if (window.self !== window.top) {
        console.log('🔍 QR扫描器: 跳过iframe页面');
        return;
    }

    // 配置项
    const CONFIG = {
        autoScan: false,             // 是否自动扫描页面图片
        showFloatButton: true,       // 是否显示悬浮按钮
        scanDelay: 500,              // 自动扫描延迟（毫秒）
        maxImageSize: 2000,          // 最大图片尺寸
        minImageSize: 50,            // 最小图片尺寸（像素）
    };

    // 样式注入
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS 风格悬浮按钮 */
            .qr-scanner-float-btn {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 60px;
                height: 60px;
                background: rgba(0, 122, 255, 0.95);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-radius: 18px;
                box-shadow: 0 8px 24px rgba(0, 122, 255, 0.25),
                            0 2px 8px rgba(0, 0, 0, 0.08);
                cursor: pointer;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                border: 0.5px solid rgba(255, 255, 255, 0.2);
                outline: none;
            }
            
            .qr-scanner-float-btn:hover {
                transform: scale(1.08) translateY(-2px);
                box-shadow: 0 12px 32px rgba(0, 122, 255, 0.35),
                            0 4px 12px rgba(0, 0, 0, 0.12);
                background: rgba(0, 122, 255, 1);
            }
            
            .qr-scanner-float-btn:active {
                transform: scale(0.96);
                transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .qr-scanner-float-btn svg {
                width: 30px;
                height: 30px;
                fill: white;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
            }

            /* 截图扫描遮罩层 */
            .qr-screenshot-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 2147483646;
                cursor: crosshair;
            }
            
            /* 截图选择框 */
            .qr-selection-box {
                position: fixed;
                border: 2px solid #007aff;
                background: rgba(0, 122, 255, 0.1);
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
                z-index: 2147483647;
                pointer-events: none;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.3),
                            0 0 20px rgba(0, 122, 255, 0.5),
                            inset 0 0 0 1px rgba(255, 255, 255, 0.3);
            }
            
            /* 截图提示文字 */
            .qr-screenshot-hint {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(28, 28, 30, 0.92);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                color: white;
                padding: 20px 32px;
                border-radius: 16px;
                font-size: 18px;
                font-weight: 500;
                z-index: 2147483647;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
                letter-spacing: -0.01em;
                pointer-events: none;
                animation: hintFadeIn 0.3s ease;
            }
            
            @keyframes hintFadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .qr-screenshot-hint-sub {
                font-size: 14px;
                opacity: 0.8;
                margin-top: 8px;
                font-weight: 400;
            }

            /* iOS 风格结果弹窗 */
            .qr-result-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.92);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                border-radius: 20px;
                box-shadow: 0 24px 72px rgba(0, 0, 0, 0.15),
                            0 0 0 0.5px rgba(0, 0, 0, 0.06);
                padding: 28px;
                max-width: 520px;
                min-width: 340px;
                z-index: 1000001;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
                animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 0.5px solid rgba(255, 255, 255, 0.3);
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -48%) scale(0.94);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .qr-result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .qr-result-title {
                font-size: 22px;
                font-weight: 600;
                color: #1d1d1f;
                letter-spacing: -0.02em;
            }
            
            .qr-result-close {
                width: 32px;
                height: 32px;
                background: rgba(120, 120, 128, 0.12);
                border: none;
                border-radius: 50%;
                font-size: 20px;
                color: #8e8e93;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .qr-result-close:hover {
                background: rgba(120, 120, 128, 0.2);
                color: #1d1d1f;
                transform: scale(1.08);
            }
            
            .qr-result-close:active {
                transform: scale(0.92);
            }
            
            .qr-result-content {
                background: rgba(242, 242, 247, 0.8);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 18px;
                word-break: break-all;
                max-height: 320px;
                overflow-y: auto;
                margin-bottom: 20px;
                font-size: 15px;
                line-height: 1.5;
                color: #1d1d1f;
                letter-spacing: -0.01em;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
            }
            
            .qr-result-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .qr-result-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .qr-result-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.15);
                border-radius: 3px;
            }
            
            .qr-result-content::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.25);
            }
            
            .qr-result-actions {
                display: flex;
                gap: 12px;
            }
            
            .qr-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: -0.01em;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            .qr-btn-primary {
                background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
                color: white;
                box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3),
                            0 1px 3px rgba(0, 0, 0, 0.08);
            }
            
            .qr-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 122, 255, 0.4),
                            0 2px 8px rgba(0, 0, 0, 0.12);
            }
            
            .qr-btn-primary:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
            }
            
            .qr-btn-secondary {
                background: rgba(120, 120, 128, 0.12);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: #007aff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
            
            .qr-btn-secondary:hover {
                background: rgba(120, 120, 128, 0.18);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            
            .qr-btn-secondary:active {
                transform: translateY(0);
                background: rgba(120, 120, 128, 0.24);
            }
            
            /* iOS 风格遮罩层 */
            .qr-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 1000000;
                animation: overlayFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes overlayFadeIn {
                from { 
                    opacity: 0;
                }
                to { 
                    opacity: 1;
                }
            }
            
            /* iOS 风格加载动画 */
            .qr-loading {
                display: inline-block;
                width: 22px;
                height: 22px;
                border: 2.5px solid rgba(255, 255, 255, 0.3);
                border-top: 2.5px solid white;
                border-radius: 50%;
                animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* iOS 风格 Toast 提示 */
            .qr-toast {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(28, 28, 30, 0.92);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                color: white;
                padding: 14px 24px;
                border-radius: 16px;
                font-size: 15px;
                font-weight: 500;
                z-index: 1000002;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3),
                            0 0 0 0.5px rgba(255, 255, 255, 0.1);
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
                letter-spacing: -0.01em;
                animation: toastSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            @keyframes toastSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            /* iOS 风格图片高亮 */
            .qr-code-detected {
                outline: 3px solid #34c759 !important;
                outline-offset: 3px;
                cursor: pointer;
                position: relative;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(52, 199, 89, 0.25);
                animation: qrPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes qrPulse {
                0%, 100% {
                    box-shadow: 0 4px 16px rgba(52, 199, 89, 0.25);
                }
                50% {
                    box-shadow: 0 4px 20px rgba(52, 199, 89, 0.4);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // QR码扫描器类
    class QRScanner {
        constructor() {
            this.scannedImages = new WeakSet();
            this.detectedQRs = new Map();
        }

        /**
         * 扫描图片或Canvas元素中的二维码（增强版，支持多种策略）
         * @param {HTMLImageElement|HTMLCanvasElement} element - 图片或Canvas元素
         * @returns {Promise<string|null>} 二维码内容
         */
        async scanImage(element) {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 处理 Canvas 元素
                if (element.tagName === 'CANVAS') {
                    const sourceCanvas = element;
                    const scale = Math.min(
                        CONFIG.maxImageSize / sourceCanvas.width,
                        CONFIG.maxImageSize / sourceCanvas.height,
                        1
                    );

                    canvas.width = sourceCanvas.width * scale;
                    canvas.height = sourceCanvas.height * scale;

                    // 从源Canvas复制内容
                    ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
                }
                // 处理 Image 元素
                else if (element.tagName === 'IMG') {
                    const img = element;
                    // 确保图片已加载
                    if (!img.complete || img.naturalWidth === 0) {
                        await this.waitForImageLoad(img);
                    }

                    // 计算合适的canvas尺寸
                    const scale = Math.min(
                        CONFIG.maxImageSize / img.naturalWidth,
                        CONFIG.maxImageSize / img.naturalHeight,
                        1
                    );

                    canvas.width = img.naturalWidth * scale;
                    canvas.height = img.naturalHeight * scale;

                    // 绘制图片到canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } else {
                    return null;
                }

                // 策略1: 原图扫描（支持反色）
                let result = await this.tryDecode(canvas, ctx, true);
                if (result) return result;

                // 策略2: 提高对比度
                result = await this.tryDecodeWithContrast(canvas, ctx);
                if (result) return result;

                // 策略3: 转灰度并二值化
                result = await this.tryDecodeWithBinarization(canvas, ctx);
                if (result) return result;

                // 策略4: 锐化处理
                result = await this.tryDecodeWithSharpening(canvas, ctx);
                if (result) return result;

                return null;
            } catch (error) {
                console.error('QR扫描错误:', error);
                return null;
            }
        }

        /**
         * 尝试解码图像数据
         * @param {HTMLCanvasElement} canvas
         * @param {CanvasRenderingContext2D} ctx
         * @param {boolean} tryInversion - 是否尝试反色
         * @returns {Promise<string|null>}
         */
        async tryDecode(canvas, ctx, tryInversion = false) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: tryInversion ? "attemptBoth" : "dontInvert",
            });

            return code ? code.data : null;
        }

        /**
         * 提高对比度后扫描
         */
        async tryDecodeWithContrast(canvas, ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 提高对比度
            const factor = 1.5;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, (data[i] - 128) * factor + 128);
                data[i + 1] = Math.min(255, (data[i + 1] - 128) * factor + 128);
                data[i + 2] = Math.min(255, (data[i + 2] - 128) * factor + 128);
            }

            const code = jsQR(data, canvas.width, canvas.height, {
                inversionAttempts: "attemptBoth",
            });

            return code ? code.data : null;
        }

        /**
         * 二值化处理后扫描
         */
        async tryDecodeWithBinarization(canvas, ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 转灰度
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = data[i + 1] = data[i + 2] = gray;
            }

            // 简单二值化（阈值128）
            for (let i = 0; i < data.length; i += 4) {
                const value = data[i] > 128 ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = value;
            }

            const code = jsQR(data, canvas.width, canvas.height, {
                inversionAttempts: "dontInvert",
            });

            return code ? code.data : null;
        }

        /**
         * 锐化处理后扫描
         */
        async tryDecodeWithSharpening(canvas, ctx) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;

            // 锐化卷积核
            const kernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];

            const tempData = new Uint8ClampedArray(data);

            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    for (let c = 0; c < 3; c++) {
                        let sum = 0;
                        for (let ky = -1; ky <= 1; ky++) {
                            for (let kx = -1; kx <= 1; kx++) {
                                const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                                const kernelIdx = (ky + 1) * 3 + (kx + 1);
                                sum += tempData[idx] * kernel[kernelIdx];
                            }
                        }
                        const idx = (y * width + x) * 4 + c;
                        data[idx] = Math.min(255, Math.max(0, sum));
                    }
                }
            }

            const code = jsQR(data, canvas.width, canvas.height, {
                inversionAttempts: "attemptBoth",
            });

            return code ? code.data : null;
        }

        /**
         * 等待图片加载
         * @param {HTMLImageElement} img
         * @returns {Promise<void>}
         */
        waitForImageLoad(img) {
            return new Promise((resolve, reject) => {
                if (img.complete && img.naturalWidth > 0) {
                    resolve();
                    return;
                }

                const timeout = setTimeout(() => {
                    reject(new Error('图片加载超时'));
                }, 10000);

                img.onload = () => {
                    clearTimeout(timeout);
                    resolve();
                };

                img.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('图片加载失败'));
                };
            });
        }

        /**
         * 自动扫描页面上的所有图片和Canvas
         */
        async autoScanPage() {
            // 扫描所有 img 元素
            const images = document.querySelectorAll('img');
            for (const img of images) {
                // 跳过已扫描的图片
                if (this.scannedImages.has(img)) continue;

                // 跳过太小的图片（可能不是二维码）
                if (img.width < CONFIG.minImageSize || img.height < CONFIG.minImageSize) continue;

                this.scannedImages.add(img);

                const result = await this.scanImage(img);
                if (result) {
                    this.detectedQRs.set(img, result);
                    this.highlightQRImage(img, result);
                }
            }

            // 扫描所有 canvas 元素
            const canvases = document.querySelectorAll('canvas');
            for (const canvas of canvases) {
                // 跳过已扫描的Canvas
                if (this.scannedImages.has(canvas)) continue;

                // 跳过太小的Canvas（可能不是二维码）
                if (canvas.width < CONFIG.minImageSize || canvas.height < CONFIG.minImageSize) continue;

                this.scannedImages.add(canvas);

                const result = await this.scanImage(canvas);
                if (result) {
                    this.detectedQRs.set(canvas, result);
                    this.highlightQRImage(canvas, result);
                }
            }
        }

        /**
         * 高亮包含二维码的图片或Canvas
         * @param {HTMLImageElement|HTMLCanvasElement} element
         * @param {string} data
         */
        highlightQRImage(element, data) {
            element.classList.add('qr-code-detected');
            element.title = `二维码内容: ${data}`;

            // 点击直接显示结果
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                UI.showResult(data);
            }, { once: false });
        }
    }

    // UI管理器
    class UIManager {
        constructor() {
            this.currentModal = null;
        }

        /**
         * 创建悬浮按钮
         */
        createFloatButton() {
            const button = document.createElement('button');
            button.className = 'qr-scanner-float-btn';
            button.innerHTML = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm0 5h3v3h-3v-3z"/>
                </svg>
            `;
            button.title = '点击开始截图扫描二维码\n长按可拖动位置';

            document.body.appendChild(button);

            // 拖动相关变量
            let isDragging = false;
            let dragStarted = false;
            let hasMoved = false;
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let longPressTimer = null;

            // 初始化位置（从当前的right/bottom计算出left/top）
            const initPosition = () => {
                const rect = button.getBoundingClientRect();
                currentX = rect.left;
                currentY = rect.top;
            };

            // 在DOM插入后初始化位置
            setTimeout(initPosition, 0);

            // 鼠标按下
            const handleMouseDown = (e) => {
                if (e.button !== 0) return; // 只响应左键

                e.preventDefault();
                e.stopPropagation();

                hasMoved = false;
                dragStarted = false;

                // 更新当前位置
                const rect = button.getBoundingClientRect();
                currentX = rect.left;
                currentY = rect.top;

                startX = e.clientX - currentX;
                startY = e.clientY - currentY;

                // 长按检测（200ms）
                longPressTimer = setTimeout(() => {
                    isDragging = true;
                    button.style.cursor = 'grabbing';
                    button.style.transition = 'none';
                }, 200);

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            };

            // 鼠标移动
            const handleMouseMove = (e) => {
                if (!isDragging) {
                    // 检测是否移动了足够距离，如果是则取消长按计时器
                    const moveDistance = Math.abs(e.clientX - (startX + currentX)) + Math.abs(e.clientY - (startY + currentY));
                    if (moveDistance > 5) {
                        clearTimeout(longPressTimer);
                    }
                    return;
                }

                hasMoved = true;
                dragStarted = true;
                e.preventDefault();
                e.stopPropagation();

                currentX = e.clientX - startX;
                currentY = e.clientY - startY;

                // 限制在视窗范围内
                const maxX = window.innerWidth - button.offsetWidth;
                const maxY = window.innerHeight - button.offsetHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                button.style.right = 'auto';
                button.style.bottom = 'auto';
                button.style.left = `${currentX}px`;
                button.style.top = `${currentY}px`;
            };

            // 鼠标松开
            const handleMouseUp = (e) => {
                clearTimeout(longPressTimer);

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);

                if (hasMoved || dragStarted) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                isDragging = false;
                button.style.cursor = 'pointer';
                button.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

                // 延迟重置标志，确保点击事件能正确判断
                setTimeout(() => {
                    dragStarted = false;
                    hasMoved = false;
                }, 50);
            };

            // 点击事件（仅在非拖动时触发）
            const handleClick = (e) => {
                if (dragStarted || hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                this.startScreenshotMode();
            };

            // 触摸事件支持
            const handleTouchStart = (e) => {
                e.stopPropagation();

                hasMoved = false;
                dragStarted = false;

                const rect = button.getBoundingClientRect();
                currentX = rect.left;
                currentY = rect.top;

                const touch = e.touches[0];
                startX = touch.clientX - currentX;
                startY = touch.clientY - currentY;

                longPressTimer = setTimeout(() => {
                    isDragging = true;
                    button.style.cursor = 'grabbing';
                    button.style.transition = 'none';
                }, 200);
            };

            const handleTouchMove = (e) => {
                if (!isDragging) {
                    const touch = e.touches[0];
                    const moveDistance = Math.abs(touch.clientX - (startX + currentX)) + Math.abs(touch.clientY - (startY + currentY));
                    if (moveDistance > 5) {
                        clearTimeout(longPressTimer);
                    }
                    return;
                }

                hasMoved = true;
                dragStarted = true;
                e.preventDefault();
                e.stopPropagation();

                const touch = e.touches[0];
                currentX = touch.clientX - startX;
                currentY = touch.clientY - startY;

                const maxX = window.innerWidth - button.offsetWidth;
                const maxY = window.innerHeight - button.offsetHeight;

                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                button.style.right = 'auto';
                button.style.bottom = 'auto';
                button.style.left = `${currentX}px`;
                button.style.top = `${currentY}px`;
            };

            const handleTouchEnd = (e) => {
                clearTimeout(longPressTimer);

                if (hasMoved || dragStarted) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                isDragging = false;
                button.style.cursor = 'pointer';
                button.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

                setTimeout(() => {
                    dragStarted = false;
                    hasMoved = false;
                }, 50);
            };

            // 绑定事件
            button.addEventListener('mousedown', handleMouseDown);
            button.addEventListener('click', handleClick);
            button.addEventListener('touchstart', handleTouchStart, { passive: false });
            button.addEventListener('touchmove', handleTouchMove, { passive: false });
            button.addEventListener('touchend', handleTouchEnd);
        }

        /**
         * 启动截图扫描模式
         */
        startScreenshotMode() {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'qr-screenshot-overlay';

            // 创建提示文字
            const hint = document.createElement('div');
            hint.className = 'qr-screenshot-hint';
            hint.innerHTML = `
                <div>🔍 拖动鼠标框选二维码区域</div>
                <div class="qr-screenshot-hint-sub">按 ESC 键取消</div>
            `;

            // 创建选择框
            const selectionBox = document.createElement('div');
            selectionBox.className = 'qr-selection-box';
            selectionBox.style.display = 'none';

            document.body.appendChild(overlay);
            document.body.appendChild(hint);
            document.body.appendChild(selectionBox);

            let startX = 0;
            let startY = 0;
            let isDrawing = false;

            // 鼠标按下开始绘制
            const handleMouseDown = (e) => {
                isDrawing = true;
                startX = e.clientX;
                startY = e.clientY;

                hint.style.display = 'none';
                selectionBox.style.display = 'block';
                selectionBox.style.left = `${startX}px`;
                selectionBox.style.top = `${startY}px`;
                selectionBox.style.width = '0px';
                selectionBox.style.height = '0px';
            };

            // 鼠标移动更新选择框
            const handleMouseMove = (e) => {
                if (!isDrawing) return;

                const currentX = e.clientX;
                const currentY = e.clientY;

                const left = Math.min(startX, currentX);
                const top = Math.min(startY, currentY);
                const width = Math.abs(currentX - startX);
                const height = Math.abs(currentY - startY);

                selectionBox.style.left = `${left}px`;
                selectionBox.style.top = `${top}px`;
                selectionBox.style.width = `${width}px`;
                selectionBox.style.height = `${height}px`;
            };

            // 鼠标松开完成选择
            const handleMouseUp = async (e) => {
                if (!isDrawing) return;
                isDrawing = false;

                const currentX = e.clientX;
                const currentY = e.clientY;

                const left = Math.min(startX, currentX);
                const top = Math.min(startY, currentY);
                const width = Math.abs(currentX - startX);
                const height = Math.abs(currentY - startY);

                // 如果选择区域太小，取消
                if (width < 20 || height < 20) {
                    cleanup();
                    this.showToast('❌ 选择区域太小');
                    return;
                }

                // 显示加载提示
                hint.style.display = 'block';
                hint.innerHTML = `
                    <div class="qr-loading"></div>
                    <div style="margin-top: 12px;">扫描中...</div>
                `;

                // 截取选择区域并扫描
                try {
                    const result = await this.captureAndScan(left, top, width, height);

                    cleanup();

                    if (result) {
                        this.showResult(result);
                    } else {
                        this.showToast('❌ 未检测到二维码');
                    }
                } catch (error) {
                    cleanup();
                    this.showToast('❌ 扫描失败');
                    console.error('扫描错误:', error);
                }
            };

            // 按ESC键取消
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    this.showToast('已取消');
                }
            };

            // 清理函数
            const cleanup = () => {
                overlay.remove();
                hint.remove();
                selectionBox.remove();
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('keydown', handleKeyDown);
            };

            // 绑定事件
            overlay.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('keydown', handleKeyDown);
        }

        /**
         * 截取屏幕区域并扫描二维码
         * @param {number} x - 左上角X坐标
         * @param {number} y - 左上角Y坐标
         * @param {number} width - 宽度
         * @param {number} height - 高度
         * @returns {Promise<string|null>}
         */
        async captureAndScan(x, y, width, height) {
            try {
                // 查找选择区域内的所有图片和Canvas
                const allElements = [
                    ...Array.from(document.querySelectorAll('img')),
                    ...Array.from(document.querySelectorAll('canvas'))
                ];

                for (const element of allElements) {
                    const rect = element.getBoundingClientRect();

                    // 检查元素是否在选择区域内（重叠检测）
                    if (rect.left < x + width &&
                        rect.right > x &&
                        rect.top < y + height &&
                        rect.bottom > y) {

                        const result = await scanner.scanImage(element);
                        if (result) return result;
                    }
                }

                return null;
            } catch (error) {
                console.error('截图扫描错误:', error);
                return null;
            }
        }

        /**
         * 显示结果弹窗
         * @param {string} content - 内容
         * @param {string} type - 类型 (success, warning, error)
         */
        showResult(content, type = 'success') {
            // 移除旧弹窗
            this.removeModal();

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'qr-modal-overlay';

            // 创建弹窗
            const modal = document.createElement('div');
            modal.className = 'qr-result-modal';

            const iconMap = {
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };

            modal.innerHTML = `
                <div class="qr-result-header">
                    <div class="qr-result-title">${iconMap[type] || '📋'} 扫描结果</div>
                    <button class="qr-result-close" aria-label="关闭">×</button>
                </div>
                <div class="qr-result-content">${this.escapeHtml(content)}</div>
                <div class="qr-result-actions">
                    <button class="qr-btn qr-btn-primary" data-action="copy">复制内容</button>
                    ${this.isUrl(content) ? '<button class="qr-btn qr-btn-secondary" data-action="open">打开链接</button>' : ''}
                </div>
            `;

            // 事件处理
            modal.querySelector('.qr-result-close').addEventListener('click', () => this.removeModal());
            overlay.addEventListener('click', () => this.removeModal());

            const copyBtn = modal.querySelector('[data-action="copy"]');
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard(content);
                copyBtn.textContent = '✓ 已复制';
                setTimeout(() => {
                    copyBtn.textContent = '复制内容';
                }, 2000);
            });

            const openBtn = modal.querySelector('[data-action="open"]');
            if (openBtn) {
                openBtn.addEventListener('click', () => {
                    window.open(content, '_blank');
                });
            }

            document.body.appendChild(overlay);
            document.body.appendChild(modal);
            this.currentModal = { overlay, modal };
        }

        /**
         * 移除弹窗
         */
        removeModal() {
            if (this.currentModal) {
                this.currentModal.overlay.remove();
                this.currentModal.modal.remove();
                this.currentModal = null;
            }
        }

        /**
         * 复制到剪贴板
         * @param {string} text
         */
        copyToClipboard(text) {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
            } else {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
        }

        /**
         * 转义HTML
         * @param {string} str
         * @returns {string}
         */
        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        /**
         * 判断是否为URL
         * @param {string} str
         * @returns {boolean}
         */
        isUrl(str) {
            try {
                new URL(str);
                return true;
            } catch {
                return str.startsWith('http://') || str.startsWith('https://');
            }
        }

        /**
         * 显示Toast提示
         * @param {string} message - 提示信息
         * @param {number} duration - 显示时长（毫秒）
         */
        showToast(message, duration = 2000) {
            const toast = document.createElement('div');
            toast.className = 'qr-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'toastSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    // 初始化
    const scanner = new QRScanner();
    const UI = new UIManager();

    // 注入样式
    injectStyles();

    // 创建悬浮按钮
    if (CONFIG.showFloatButton) {
        UI.createFloatButton();
    }

    // DOM 观察器（用于自动扫描）
    let domObserver = null;

    /**
     * 启动自动扫描
     */
    const startAutoScan = () => {
        // 立即扫描当前页面
        scanner.autoScanPage().then(() => {
            if (scanner.detectedQRs.size > 0) {
                UI.showToast(`✓ 找到 ${scanner.detectedQRs.size} 个二维码`);
            }
        });

        // 如果观察器已存在，先停止
        if (domObserver) {
            domObserver.disconnect();
        }

        // 创建新的观察器，监听DOM变化
        domObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'IMG' || node.tagName === 'CANVAS') {
                        setTimeout(() => scanner.scanImage(node).then(result => {
                            if (result) {
                                scanner.detectedQRs.set(node, result);
                                scanner.highlightQRImage(node, result);
                            }
                        }), 100);
                    } else if (node.querySelectorAll) {
                        // 扫描新增节点内的所有img和canvas
                        node.querySelectorAll('img, canvas').forEach(element => {
                            setTimeout(() => scanner.scanImage(element).then(result => {
                                if (result) {
                                    scanner.detectedQRs.set(element, result);
                                    scanner.highlightQRImage(element, result);
                                }
                            }), 100);
                        });
                    }
                }
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    /**
     * 停止自动扫描
     */
    const stopAutoScan = () => {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
        }
    };

    // 根据配置决定是否启动自动扫描
    if (CONFIG.autoScan) {
        setTimeout(() => {
            startAutoScan();
        }, CONFIG.scanDelay);
    }

    // 注册油猴菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('🔍 扫描页面二维码', () => {
            scanner.autoScanPage().then(() => {
                if (scanner.detectedQRs.size === 0) {
                    UI.showToast('❌ 未检测到二维码');
                } else {
                    UI.showToast(`✓ 找到 ${scanner.detectedQRs.size} 个二维码`);
                }
            });
        });

        GM_registerMenuCommand('⚙️ 切换自动扫描', () => {
            CONFIG.autoScan = !CONFIG.autoScan;

            if (CONFIG.autoScan) {
                // 开启自动扫描
                startAutoScan();
                UI.showToast('✓ 自动扫描已开启');
            } else {
                // 关闭自动扫描
                stopAutoScan();
                UI.showToast('✗ 自动扫描已关闭');
            }
        });
    }

    console.log('✅ QR码扫描器已加载');
})();

