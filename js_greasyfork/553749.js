// ==UserScript==
// @name         网页二维码识别器 - （支持 img/canvas/svg + 精准识别）
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  修复 SecurityError 和 ReferenceError，支持更多元素类型，精准识别 SVG
// @author       hucix
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553749/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20-%20%EF%BC%88%E6%94%AF%E6%8C%81%20imgcanvassvg%20%2B%20%E7%B2%BE%E5%87%86%E8%AF%86%E5%88%AB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553749/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20-%20%EF%BC%88%E6%94%AF%E6%8C%81%20imgcanvassvg%20%2B%20%E7%B2%BE%E5%87%86%E8%AF%86%E5%88%AB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HOTKEY = 'q';
    let isSelecting = false;
    let startX, startY;
    let selectionDiv = null;
    let overlay = null;
    let escCloseHandler = null;


    // ✅ 声明并初始化 currentResultUI
    let currentResultUI = null;

    function createOverlay() {
        if (overlay) {
            overlay.remove();
            selectionDiv?.remove();
        }
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.1)';
        overlay.style.zIndex = '2147483646';
        overlay.style.cursor = 'crosshair';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);

        selectionDiv = document.createElement('div');
        selectionDiv.style.position = 'absolute';
        selectionDiv.style.border = '2px dashed #007bff';
        selectionDiv.style.background = 'rgba(0,123,255,0.1)';
        selectionDiv.style.zIndex = '2147483647';
        selectionDiv.style.pointerEvents = 'none';
        document.body.appendChild(selectionDiv);
    }

    function resetState() {
        isSelecting = false;
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.userSelect = '';
        }
        document.removeEventListener('keydown', escHandler);
        overlay?.removeEventListener('mousedown', startSelect);
        overlay?.removeEventListener('mousemove', updateSelect);
        overlay?.removeEventListener('mouseup', endSelect);
        createOverlay();
    }

    function escHandler(e) {
        if (e.key === 'Escape') resetState();
    }

    function startSelect(e) {
        if (!isSelecting) return;
        startX = e.pageX;
        startY = e.pageY;
        selectionDiv.style.display = 'block';
        selectionDiv.style.left = startX + 'px';
        selectionDiv.style.top = startY + 'px';
        selectionDiv.style.width = '0';
        selectionDiv.style.height = '0';
    }

    function updateSelect(e) {
        if (!isSelecting || selectionDiv.style.display !== 'block') return;
        const x = Math.min(startX, e.pageX);
        const y = Math.min(startY, e.pageY);
        const w = Math.abs(e.pageX - startX);
        const h = Math.abs(e.pageY - startY);
        selectionDiv.style.left = x + 'px';
        selectionDiv.style.top = y + 'px';
        selectionDiv.style.width = w + 'px';
        selectionDiv.style.height = h + 'px';
    }

    // 检查两个矩形是否相交
    function rectsIntersect(r1, r2) {
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    }

    async function recognizeQR(x, y, width, height) {
        const selectionRect = { left: x, top: y, right: x + width, bottom: y + height };
        let found = false;

        // 1. 尝试识别 <img> 元素
        const images = Array.from(document.querySelectorAll('img'));
        for (const img of images) {
            if (!img.complete || img.naturalWidth === 0) continue;
            const imgRect = img.getBoundingClientRect();
            const imgPageRect = {
                left: imgRect.left + window.scrollX,
                top: imgRect.top + window.scrollY,
                right: imgRect.right + window.scrollX,
                bottom: imgRect.bottom + window.scrollY
            };
            if (rectsIntersect(selectionRect, imgPageRect)) {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    if (code) {
                        showResult(code.data);
                        found = true;
                        break;
                    }
                } catch (e) {
                    console.warn('跳过受 CORS 保护的图片:', img.src);
                }
            }
        }

        // 2. 如果没有找到，尝试识别 <canvas> 元素
        if (!found) {
            const canvases = Array.from(document.querySelectorAll('canvas'));
            for (const canvas of canvases) {
                const canvasRect = canvas.getBoundingClientRect();
                const canvasPageRect = {
                    left: canvasRect.left + window.scrollX,
                    top: canvasRect.top + window.scrollY,
                    right: canvasRect.right + window.scrollX,
                    bottom: canvasRect.bottom + window.scrollY
                };
                if (rectsIntersect(selectionRect, canvasPageRect)) {
                    try {
                        const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, canvas.width, canvas.height);
                        if (code) {
                            showResult(code.data);
                            found = true;
                            break;
                        }
                    } catch (e) {
                        console.warn('跳过无法读取的 canvas:', canvas);
                    }
                }
            }
        }

        // 3. 如果还没有找到，尝试识别 <svg> 元素（只识别内部的图形）
        if (!found) {
            const svgs = Array.from(document.querySelectorAll('svg'));
            for (const svg of svgs) {
                const svgRect = svg.getBoundingClientRect();
                const svgPageRect = {
                    left: svgRect.left + window.scrollX,
                    top: svgRect.top + window.scrollY,
                    right: svgRect.right + window.scrollX,
                    bottom: svgRect.bottom + window.scrollY
                };
                if (rectsIntersect(selectionRect, svgPageRect)) {
                    try {
                        // 只提取 SVG 中的图形元素（如 path, rect, circle）
                        const graphics = Array.from(svg.querySelectorAll('path, rect, circle, polygon, polyline'));
                        if (graphics.length === 0) {
                            throw new Error('SVG 中没有图形元素');
                        }

                        // 创建一个临时 SVG，只包含图形元素
                        const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        tempSvg.setAttribute('width', svg.getAttribute('width') || '100%');
                        tempSvg.setAttribute('height', svg.getAttribute('height') || '100%');
                        graphics.forEach(g => {
                            const clone = g.cloneNode(true);
                            tempSvg.appendChild(clone);
                        });

                        // 将临时 SVG 转换为 Data URL
                        const serializer = new XMLSerializer();
                        const source = serializer.serializeToString(tempSvg);
                        const image = new Image();
                        image.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = image.width;
                            canvas.height = image.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(image, 0, 0);
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, canvas.width, canvas.height);
                            if (code) {
                                showResult(code.data);
                                found = true;
                            } else {
                                showResult(null, '未识别到二维码。SVG 转换成功，但内容不包含二维码。建议：\n1. 确保框选的是二维码本身\n2. 截图后使用在线工具识别');
                            }
                        };
                        image.onerror = () => {
                            showResult(null, 'SVG 转换失败，无法识别。');
                        };
                        image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
                    } catch (e) {
                        console.warn('跳过无法转换的 SVG:', svg);
                    }
                }
            }
        }

        // 4. 如果以上都失败，显示友好提示
        if (!found) {
            showResult(null, '未在选区中找到可识别的二维码。\n\n建议：\n1. 确保框选的是图片或画布元素\n2. 截图后使用在线工具识别');
        }
    }

    function showResult(text, errorMsg = null) {
    // 移除旧的 UI（如果存在）
    if (currentResultUI) {
        currentResultUI.remove();
    }

    currentResultUI = document.createElement('div');
    currentResultUI.id = 'qr-result-ui';
    currentResultUI.style.position = 'fixed';
    currentResultUI.style.top = '50%';
    currentResultUI.style.left = '50%';
    currentResultUI.style.transform = 'translate(-50%, -50%)';
    currentResultUI.style.zIndex = '2147483647';
    currentResultUI.style.background = '#fff';
    currentResultUI.style.padding = '20px';
    currentResultUI.style.borderRadius = '8px';
    currentResultUI.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    currentResultUI.style.maxWidth = '90%';
    currentResultUI.style.wordBreak = 'break-all';
    currentResultUI.style.fontFamily = 'Arial, sans-serif';

    let content = '';

    if (errorMsg) {
        content = `<h3 style="color:#dc3545;">识别失败</h3><p>${errorMsg}</p>`;
    } else {
        let isUrl = false;
        try { new URL(text); isUrl = true; } catch {}

        content = `
            <h3>识别到内容：</h3>
            <pre style="background:#f8f9fa; padding:10px; border-radius:4px; overflow:auto; max-height:200px; font-family:monospace; white-space:pre-wrap;">${text}</pre>
        `;
        if (isUrl) {
            content += `<button id="qr-jump-btn" style="margin-top:10px; padding:6px 12px; background:#007bff; color:white; border:none; border-radius:4px;">跳转到链接</button>`;
        }
        content += `<button id="qr-copy-btn" style="margin-left:10px; padding:6px 12px; background:#28a745; color:white; border:none; border-radius:4px;">复制内容</button>`;
    }

    content += `<button id="qr-close-btn" style="margin-top:10px; padding:6px 12px; background:#6c757d; color:white; border:none; border-radius:4px; margin-left:10px;">关闭</button>`;

    currentResultUI.innerHTML = content;
    document.body.appendChild(currentResultUI);

    // 定义 ESC 关闭函数
    escCloseHandler = (e) => {
        if (e.key === 'Escape') {
            closeResultUI();
        }
    };

    // 绑定 ESC 监听
    document.addEventListener('keydown', escCloseHandler);

    // 安全绑定按钮事件
    const jumpBtn = document.getElementById('qr-jump-btn');
    const copyBtn = document.getElementById('qr-copy-btn');
    const closeBtn = document.getElementById('qr-close-btn');

    if (jumpBtn && text) {
        jumpBtn.onclick = () => { window.open(text, '_blank') };
    }
    if (copyBtn && text) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板！');
            }).catch(() => {
                prompt('复制失败，请手动复制：', text);
            });
        };
    }
    if (closeBtn) {
        closeBtn.onclick = closeResultUI;
    }

    resetState(); // 清理框选状态
}

// 关闭识别结果 UI 的统一函数
function closeResultUI() {
    if (currentResultUI) {
        currentResultUI.remove();
        currentResultUI = null;
    }
    // 移除 ESC 监听器
    if (escCloseHandler) {
        document.removeEventListener('keydown', escCloseHandler);
        escCloseHandler = null;
    }
}

    function endSelect() {
        if (!isSelecting) return;
        isSelecting = false;
        overlay.style.display = 'none';
        document.body.style.userSelect = '';
        document.removeEventListener('keydown', escHandler);

        const rect = selectionDiv.getBoundingClientRect();
        const x = rect.left + window.scrollX;
        const y = rect.top + window.scrollY;
        const w = rect.width;
        const h = rect.height;

        selectionDiv.style.display = 'none';

        if (w > 20 && h > 20) {
            recognizeQR(x, y, w, h);
        } else {
            showResult(null, '选区太小，请框选更大的二维码区域（至少 20x20 像素）。');
            resetState();
        }
    }

    function init() {
        createOverlay();
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === HOTKEY && !isSelecting) {
                e.preventDefault();
                isSelecting = true;
                overlay.style.display = 'block';
                document.body.style.userSelect = 'none';
                document.addEventListener('keydown', escHandler);
                overlay.addEventListener('mousedown', startSelect);
                overlay.addEventListener('mousemove', updateSelect);
                overlay.addEventListener('mouseup', endSelect);
            }
        });
    }

    if (typeof jsQR !== 'undefined') {
        init();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = init;
        document.head.appendChild(script);
    }
})();