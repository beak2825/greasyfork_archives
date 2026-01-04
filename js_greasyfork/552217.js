// ==UserScript==
// @name         Sora Watermark Remover Helper
// @name:zh-CN   Sora 水印去除助手
// @namespace    https://sora2watermarkremover.net/
// @version      1.0.0
// @description  Easily remove watermarks from Sora-generated videos. sora2watermarkremover.net One-click access to professional AI watermark removal service.
// @description:zh-CN  轻松去除 Sora 生成视频的水印。一键访问专业的 AI 水印去除服务。
// @author       Sora2WatermarkRemover
// @license      MIT
// @match        https://sora2watermarkremover.net/*
// @match        https://chat.openai.com/*
// @match        https://*.openai.com/*
// @icon         https://sora2watermarkremover.net/favicon.ico
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-idle
// @homepage     https://sora2watermarkremover.net
// @supportURL   https://github.com/yourusername/sora-watermark-remover-helper/issues
// @downloadURL https://update.greasyfork.org/scripts/552217/Sora%20Watermark%20Remover%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/552217/Sora%20Watermark%20Remover%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        SERVICE_URL: 'https://sora2watermarkremover.net',
        BUTTON_TEXT: {
            en: '🎬 Remove Watermark',
            zh: '🎬 去除水印'
        },
        TOOLTIP_TEXT: {
            en: 'Remove Sora watermark with AI',
            zh: '使用 AI 去除 Sora 水印'
        },
        NOTIFICATION: {
            en: {
                copied: 'Video link copied! Opening watermark removal service...',
                noVideo: 'No Sora video detected on this page'
            },
            zh: {
                copied: '视频链接已复制！正在打开水印去除服务...',
                noVideo: '当前页面未检测到 Sora 视频'
            }
        }
    };

    // 检测用户语言
    const userLang = navigator.language.startsWith('zh') ? 'zh' : 'en';

    // ==================== 样式注入 ====================
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .sora-watermark-btn {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .sora-watermark-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }

            .sora-watermark-btn:active {
                transform: translateY(0);
            }

            .sora-watermark-btn-icon {
                font-size: 16px;
            }

            .sora-watermark-floating {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                animation: fadeInUp 0.5s ease;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .sora-watermark-tooltip {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 8px;
                padding: 6px 12px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                font-size: 12px;
                border-radius: 4px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .sora-watermark-btn:hover .sora-watermark-tooltip {
                opacity: 1;
            }

            .sora-watermark-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ef4444;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    };

    // ==================== 创建按钮 ====================
    const createButton = (isFloating = false) => {
        const button = document.createElement('button');
        button.className = 'sora-watermark-btn' + (isFloating ? ' sora-watermark-floating' : '');
        button.innerHTML = `
            <span class="sora-watermark-btn-icon">🎬</span>
            <span>${CONFIG.BUTTON_TEXT[userLang]}</span>
            <span class="sora-watermark-tooltip">${CONFIG.TOOLTIP_TEXT[userLang]}</span>
        `;

        button.addEventListener('click', handleButtonClick);
        return button;
    };

    // ==================== 按钮点击处理 ====================
    const handleButtonClick = () => {
        // 尝试获取当前页面的视频链接
        const videoUrl = detectSoraVideo();

        if (videoUrl) {
            // 复制视频链接到剪贴板
            GM_setClipboard(videoUrl, 'text');

            // 显示通知
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: CONFIG.NOTIFICATION[userLang].copied,
                    title: 'Sora Watermark Remover',
                    timeout: 3000
                });
            }

            // 打开服务网站（带参数）
            const serviceUrl = `${CONFIG.SERVICE_URL}?utm_source=userscript&utm_medium=greasyfork&video_url=${encodeURIComponent(videoUrl)}`;
            GM_openInTab(serviceUrl, { active: true, insert: true });
        } else {
            // 没有检测到视频，直接打开网站
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: CONFIG.NOTIFICATION[userLang].noVideo,
                    title: 'Sora Watermark Remover',
                    timeout: 2000
                });
            }
            GM_openInTab(`${CONFIG.SERVICE_URL}?utm_source=userscript&utm_medium=greasyfork`, { active: true });
        }
    };

    // ==================== 检测 Sora 视频 ====================
    const detectSoraVideo = () => {
        // 方法 1: 检测 OpenAI 视频域名
        const videoElements = document.querySelectorAll('video');
        for (const video of videoElements) {
            const src = video.src || video.currentSrc;
            if (src && (src.includes('videos.openai.com') || src.includes('cdn.openai.com'))) {
                console.log('[Sora Watermark Remover] Detected Sora video:', src);
                return src;
            }
        }

        // 方法 2: 检查页面 URL 是否包含 Sora 相关内容
        if (window.location.href.includes('sora') || document.body.textContent.includes('Made with Sora')) {
            return window.location.href;
        }

        return null;
    };

    // ==================== 检测页面是否有 Sora 内容 ====================
    const isSoraPage = () => {
        // 检查 URL
        if (window.location.href.includes('sora')) return true;

        // 检查页面内容
        const bodyText = document.body.textContent.toLowerCase();
        if (bodyText.includes('sora') || bodyText.includes('made with sora')) return true;

        // 检查是否有视频元素
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            const src = video.src || video.currentSrc;
            if (src && (src.includes('videos.openai.com') || src.includes('cdn.openai.com'))) {
                return true;
            }
        }

        return false;
    };

    // ==================== 插入按钮到页面 ====================
    const insertButton = () => {
        // 避免重复插入
        if (document.querySelector('.sora-watermark-btn')) {
            return;
        }

        // 尝试找到合适的位置插入按钮
        // 策略 1: 在视频播放器附近
        const videoContainers = document.querySelectorAll('[class*="video"], [class*="player"], [class*="media"]');
        if (videoContainers.length > 0) {
            const container = videoContainers[0];
            const button = createButton(false);
            container.appendChild(button);
            console.log('[Sora Watermark Remover] Button inserted near video player');
            return;
        }

        // 策略 2: 如果是 Sora 相关页面，添加浮动按钮
        if (isSoraPage()) {
            const button = createButton(true);
            document.body.appendChild(button);
            console.log('[Sora Watermark Remover] Floating button inserted');
        }
    };

    // ==================== 监听页面变化 ====================
    const observePageChanges = () => {
        const observer = new MutationObserver((mutations) => {
            // 检查是否有新的视频元素
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                                insertButton();
                                break;
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // ==================== 初始化 ====================
    const init = () => {
        console.log('[Sora Watermark Remover] Script initialized');

        // 注入样式
        injectStyles();

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                insertButton();
                observePageChanges();
            });
        } else {
            insertButton();
            observePageChanges();
        }

        // 延迟检查（处理动态加载的内容）
        setTimeout(() => {
            if (!document.querySelector('.sora-watermark-btn')) {
                insertButton();
            }
        }, 2000);
    };

    // 启动脚本
    init();

})();

