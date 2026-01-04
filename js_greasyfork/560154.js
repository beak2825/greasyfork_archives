// ==UserScript==
// @name         Gemini图片转切图神器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键将 Gemini 生成的图片发送到切图神器
// @author       Antigravity
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=gemini.google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560154/Gemini%E5%9B%BE%E7%89%87%E8%BD%AC%E5%88%87%E5%9B%BE%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560154/Gemini%E5%9B%BE%E7%89%87%E8%BD%AC%E5%88%87%E5%9B%BE%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改你的“切图神器”网站
    const TARGET_URL = 'https://cut.kkkm.cn/';

    // 将 Blob URL 转换为 Base64
    // 将已加载的 <img> 标签转换为 Base64
    async function imageToBase64(img) {
        return new Promise((resolve, reject) => {
            try {
                // 创建一个等大的画布
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                // 将页面上的图片绘制到画布
                ctx.drawImage(img, 0, 0);

                // 转换为 Base64 (PNG 格式)
                const base64data = canvas.toDataURL('image/png');
                resolve(base64data);
            } catch (e) {
                console.error('Canvas 转换失败:', e);
                // 如果 Canvas 方案也失败，尝试使用另一种“下载并读取”的奇招
                reject(e);
            }
        });
    }

    function init() {
        const style = document.createElement('style');
        style.textContent = `
            .splitter-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 9999;
                background: #4f46e5;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, background 0.2s;
            }
            .splitter-btn:hover {
                background: #4338ca;
                transform: scale(1.05);
            }
            .splitter-btn:active {
                transform: scale(0.95);
            }
            .gemini-img-wrapper {
                position: relative !important;
            }
        `;
        document.head.appendChild(style);

        // 持续监控页面上的 blob 图片
        setInterval(() => {
            // 查找所有以 blob: 开头的图片，且还没被注入过按钮的
            const images = document.querySelectorAll('img[src^="blob:"]:not([data-splitter-injected])');

            images.forEach(img => {
                img.setAttribute('data-splitter-injected', 'true');

                // 给图片父级加上相对定位，以便定位按钮
                const container = img.closest('div') || img.parentElement;
                if (container) {
                    container.classList.add('gemini-img-wrapper');

                    const btn = document.createElement('button');
                    btn.className = 'splitter-btn';
                    btn.innerText = '✂️ 发送到切图神器';

                    btn.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const originalText = btn.innerText;
                        btn.innerText = '⏳ 处理中...';

                        // 改用 imageToBase64，直接传入 img 元素
                        const base64Data = await imageToBase64(img);

                        if (!base64Data) {
                            btn.innerText = '❌ 转换失败';
                            return;
                        }

                        // 打开（或聚焦）项目页面
                        const win = window.open(TARGET_URL, 'gridsplitter_tab');

                        // 通信握手逻辑
                        const timer = setInterval(() => {
                            win.postMessage({ type: 'PING' }, '*');
                        }, 500);

                        const handleMessage = (event) => {
                            if (event.data.type === 'RECEIVER_READY') {
                                clearInterval(timer);
                                win.postMessage({ type: 'IMPORT_IMAGE', imageData: base64Data }, '*');
                                window.removeEventListener('message', handleMessage);
                                btn.innerText = '✅ 已发送';
                                setTimeout(() => btn.innerText = originalText, 2000);
                            }
                        };
                        window.addEventListener('message', handleMessage);

                        // 10秒超时处理
                        setTimeout(() => {
                            clearInterval(timer);
                            window.removeEventListener('message', handleMessage);
                            if (btn.innerText === '⏳ 处理中...') btn.innerText = originalText;
                        }, 10000);
                    };

                    container.appendChild(btn);
                }
            });
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();