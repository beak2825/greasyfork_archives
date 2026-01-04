// ==UserScript==
// @name         网页二维码识别器 - （全屏自动识别 + 多码去重 + 自动关闭结果）
// @namespace    https://greasyfork.org/zh-CN/users/583039
// @version      1.2
// @description  全屏自动识别二维码，支持 img/canvas/svg，多码去重编号，6.66秒自动关闭结果面板，并确保显示识别中提示
// @author       YaHee,
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js
// @run-at       document-idle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/555777/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20-%20%EF%BC%88%E5%85%A8%E5%B1%8F%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%20%2B%20%E5%A4%9A%E7%A0%81%E5%8E%BB%E9%87%8D%20%2B%20%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BB%93%E6%9E%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555777/%E7%BD%91%E9%A1%B5%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E5%99%A8%20-%20%EF%BC%88%E5%85%A8%E5%B1%8F%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%20%2B%20%E5%A4%9A%E7%A0%81%E5%8E%BB%E9%87%8D%20%2B%20%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%BB%93%E6%9E%9C%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HOTKEY = ']';
    const AUTO_CLOSE_DELAY = 6660; // 6.66秒（毫秒）
    let currentResultUI = null;
    let loadingUI = null;
    let escCloseHandler = null;
    let autoCloseTimer = null;
    let countdownInterval = null; // 新增：用于倒计时的定时器

    console.log('二维码识别脚本已启动，等待 Ctrl+Q 触发...');

    // --- 核心：确保加载提示一定会显示 ---
    function showLoading() {
        console.log('开始显示 "正在识别二维码" 提示...');
        // 如果已有加载提示，先移除
        if (loadingUI) {
            loadingUI.remove();
        }

        // 创建一个具有高优先级的加载提示框
        loadingUI = document.createElement('div');
        loadingUI.id = 'qr-loading-ui';
        // 使用 !important 确保样式不被页面CSS覆盖
        loadingUI.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 99999999 !important; /* 使用极高的z-index */
            background: rgba(255, 255, 255, 0.98) !important;
            padding: 35px 45px !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            font-size: 18px !important;
            color: #2d3748 !important;
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            border: 1px solid #e8f4f8 !important;
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 28px !important;
            height: 28px !important;
            border: 3px solid #007bff !important;
            border-top-color: transparent !important;
            border-radius: 50% !important;
            animation: qr-spin 1.2s linear infinite !important;
        `;

        const textSpan = document.createElement('span');
        textSpan.textContent = '正在识别二维码...';

        loadingUI.appendChild(spinner);
        loadingUI.appendChild(textSpan);

        // 添加关键帧动画
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes qr-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(loadingUI);
        console.log('"正在识别二维码" 提示已显示。');
    }

    function hideLoading() {
        console.log('开始隐藏 "正在识别二维码" 提示...');
        if (loadingUI) {
            loadingUI.remove();
            loadingUI = null;
            console.log('提示已隐藏。');
        }
    }

    function clearAutoCloseTimer() {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    }

    // 新增：清除倒计时定时器
    function clearCountdownInterval() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    function closeResultUI() {
        clearAutoCloseTimer();
        clearCountdownInterval(); // 关闭时同时清除倒计时
        if (currentResultUI) {
            currentResultUI.remove();
            currentResultUI = null;
        }
        if (escCloseHandler) {
            document.removeEventListener('keydown', escCloseHandler);
            escCloseHandler = null;
        }
    }

    // 识别逻辑保持不变，但确保它是一个async函数
    async function recognizeAllQR() {
        console.log('进入识别函数 recognizeAllQR()');
        let foundList = [];
        let totalChecked = 0;

        // 1. 识别 img 元素
        const images = Array.from(document.querySelectorAll('img'));
        for (const img of images) {
            if (!img.complete || img.naturalWidth < 20 || img.naturalHeight < 20) continue;
            totalChecked++;
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);
                const code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
                if (code && !foundList.includes(code.data)) {
                    foundList.push(code.data);
                }
            } catch (e) {
                // console.warn('跳过跨域图片:', img.src);
            }
        }

        // 2. 识别 canvas 元素
        const canvases = Array.from(document.querySelectorAll('canvas'));
        for (const canvas of canvases) {
            if (canvas.width < 20 || canvas.height < 20) continue;
            totalChecked++;
            try {
                const ctx = canvas.getContext('2d');
                const code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
                if (code && !foundList.includes(code.data)) {
                    foundList.push(code.data);
                }
            } catch (e) {
                // console.warn('跳过不可读 canvas');
            }
        }

        // 3. 识别 svg 元素
        const svgs = Array.from(document.querySelectorAll('svg'));
        for (const svg of svgs) {
            totalChecked++;
            try {
                const graphics = Array.from(svg.querySelectorAll('path, rect, circle, polygon, polyline'));
                if (graphics.length === 0) continue;

                const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                tempSvg.setAttribute('width', svg.getAttribute('width') || svg.viewBox?.split(' ')[2] || '200');
                tempSvg.setAttribute('height', svg.getAttribute('height') || svg.viewBox?.split(' ')[3] || '200');
                graphics.forEach(g => tempSvg.appendChild(g.cloneNode(true)));

                const source = new XMLSerializer().serializeToString(tempSvg);
                const image = new Image();
                image.crossOrigin = 'anonymous';
                // 使用 Promise 确保图片加载完成
                await new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = reject;
                    image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
                });

                if (image.width < 20 || image.height < 20) continue;
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0);
                const code = jsQR(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
                if (code && !foundList.includes(code.data)) {
                    foundList.push(code.data);
                }
            } catch (e) {
                // console.warn('跳过不可转换 SVG');
            }
        }

        console.log(`识别完成。共检查了 ${totalChecked} 个元素，发现了 ${foundList.length} 个独特的二维码。`);
        hideLoading(); // 识别完成后隐藏加载提示
        if (foundList.length > 0) {
            showResult(foundList);
        } else {
            showResult(null, `未识别到二维码\n\n本次检查了 ${totalChecked} 个潜在元素\n建议：\n1. 确认网页存在清晰的二维码\n2. 刷新页面后重试`);
        }
    }

    function showResult(resultList, errorMsg = null) {
        closeResultUI();

        currentResultUI = document.createElement('div');
        currentResultUI.id = 'qr-result-ui';
        currentResultUI.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 99999998; background: #fff; padding: 25px; border-radius: 12px;
            box-shadow: 0 6px 30px rgba(0,0,0,0.25); max-width: 90%; max-height: 80vh;
            overflow-y: auto; word-break: break-all; font-family: system-ui, -apple-system, sans-serif;
        `;

        let content = '';
        const autoCloseText = `<p style="margin:10px 0 0 0; font-size:13px; color:#6c757d;">结果将在 <span id="countdown">6.66</span> 秒后自动关闭（YaHee, Studio.）</p>`;

        if (errorMsg) {
            content = `
                <h3 style="color:#dc3545; margin:0 0 15px 0; font-size:20px;">识别失败</h3>
                <p style="margin:0; line-height:1.6; color:#4a5568;">${errorMsg.replace(/\n/g, '<br>')}</p>
                ${autoCloseText}
            `;
        } else {
            content = `<h3 style="margin:0 0 20px 0; font-size:20px; color:#2d3748;">共识别到 ${resultList.length} 个二维码</h3>`;
            resultList.forEach((text, index) => {
                const isUrl = isValidUrl(text);
                content += `
                    <div style="margin-bottom:18px; padding:15px; border:1px solid #e8f4f8; border-radius:8px; background:#f7fafc;">
                        <p style="margin:0 0 10px 0; font-weight:600; color:#2d3748;">二维码 ${index + 1}</p>
                        <pre style="background:#f8f9fa; padding:12px; border-radius:6px; overflow:auto; max-height:180px; font-family:monospace; white-space:pre-wrap; margin:0 0 12px 0; line-height:1.5;">${text}</pre>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                `;
                if (isUrl) {
                    content += `<button class="qr-jump-btn" data-url="${encodeURIComponent(text)}" style="padding:8px 16px; background:#007bff; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px;">跳转链接</button>`;
                }
                content += `
                            <button class="qr-copy-btn" data-text="${encodeURIComponent(text)}" style="padding:8px 16px; background:#28a745; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px;">复制内容</button>
                        </div>
                    </div>
                `;
            });
            content += autoCloseText;
        }

        content += `<button id="qr-close-btn" style="padding:8px 20px; background:#6c757d; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; margin-top:15px;">关闭</button>`;
        currentResultUI.innerHTML = content;
        document.body.appendChild(currentResultUI);

        // 自动关闭计时器
        autoCloseTimer = setTimeout(closeResultUI, AUTO_CLOSE_DELAY);

        // 倒计时
        let remainingTime = AUTO_CLOSE_DELAY / 1000;
        const countdownEl = document.getElementById('countdown');
        countdownInterval = setInterval(() => {
            remainingTime -= 0.01;
            countdownEl.textContent = remainingTime.toFixed(2);
            if (remainingTime <= 0) {
                clearCountdownInterval();
            }
        }, 10);

        // ESC 关闭
        escCloseHandler = (e) => {
            if (e.key === 'Escape') {
                closeResultUI();
            }
        };
        document.addEventListener('keydown', escCloseHandler);

        // 按钮事件
        document.querySelectorAll('.qr-jump-btn').forEach(btn => btn.onclick = () => window.open(decodeURIComponent(btn.dataset.url), '_blank'));
        document.querySelectorAll('.qr-copy-btn').forEach(btn => btn.onclick = () => {
            const text = decodeURIComponent(btn.dataset.text);
            navigator.clipboard.writeText(text).then(() => alert('复制成功！')).catch(() => prompt('复制失败，请手动复制：', text));
        });
        document.getElementById('qr-close-btn').onclick = closeResultUI;
    }

    function isValidUrl(text) {
        try {
            new URL(text);
            return true;
        } catch {
            return false;
        }
    }

    // 初始化函数
    function init() {
        console.log('脚本初始化完成，快捷键 Ctrl+Q 已绑定。');
        // 快捷键事件监听
        document.addEventListener('keydown', (e) => {
            // 按下 Ctrl + Q
            if (e.ctrlKey && e.key.toLowerCase() === HOTKEY) {
                e.preventDefault(); // 阻止浏览器默认行为
                console.log('检测到 Ctrl+Q，准备开始识别...');

                // 立即显示加载提示
                showLoading();

                // 使用 setTimeout 将识别逻辑放入下一个事件循环，确保提示先显示出来
                setTimeout(() => {
                    recognizeAllQR();
                }, 100);
            }
        });
    }

    // 确保 jsQR 加载后再初始化
    if (typeof jsQR !== 'undefined') {
        console.log('jsQR 库已加载。');
        init();
    } else {
        console.log('jsQR 库未找到，尝试动态加载...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = function() {
            console.log('jsQR 库动态加载成功。');
            init();
        };
        script.onerror = function() {
            console.error('jsQR 库加载失败！脚本无法正常工作。');
            alert('二维码识别脚本：依赖的 jsQR 库加载失败，请检查网络连接或刷新页面重试。');
        };
        document.head.appendChild(script);
    }

})();