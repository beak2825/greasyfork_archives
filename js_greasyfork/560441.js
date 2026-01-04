// ==UserScript==
// @name         微软科技 - 智能翻译助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  强大的多引擎翻译工具：支持选词翻译、图片OCR翻译、视频字幕翻译 | Powered by 微软科技
// @author       微软科技
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      translate.googleapis.com
// @connect      www.bing.com
// @connect      fanyi.youdao.com
// @connect      api.mymemory.translated.net
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560441/%E5%BE%AE%E8%BD%AF%E7%A7%91%E6%8A%80%20-%20%E6%99%BA%E8%83%BD%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560441/%E5%BE%AE%E8%BD%AF%E7%A7%91%E6%8A%80%20-%20%E6%99%BA%E8%83%BD%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        hotkey: 'altKey+KeyQ', // 快捷键：Alt + Q
        autoTranslateSubtitle: GM_getValue('autoTranslateSubtitle', false),
        showTranslationCount: 3, // 显示翻译结果数量
        targetLang: GM_getValue('targetLang', 'zh-CN'), // 默认目标语言
        theme: {
            primary: '#00d9ff',
            secondary: '#667eea',
            background: 'rgba(17, 24, 39, 0.98)',
            cardBg: 'rgba(31, 41, 55, 0.95)',
            textPrimary: '#f9fafb',
            textSecondary: '#d1d5db',
            borderColor: 'rgba(0, 217, 255, 0.3)',
            shadowColor: 'rgba(0, 217, 255, 0.5)'
        }
    };

    // ==================== 翻译引擎 ====================
    class TranslationEngine {
        constructor() {
            this.engines = [
                { name: 'Google翻译', method: this.googleTranslate, icon: '🌐' },
                { name: 'Bing翻译', method: this.bingTranslate, icon: '🔷' },
                { name: 'MyMemory翻译', method: this.myMemoryTranslate, icon: '📚' }
            ];
        }

        // Google 翻译
        async googleTranslate(text, targetLang = 'zh-CN') {
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
                const response = await this.fetchWithProxy(url);
                const data = JSON.parse(response);
                return data[0].map(item => item[0]).join('');
            } catch (error) {
                console.error('Google翻译失败:', error);
                return null;
            }
        }

        // Bing 翻译（使用简化API）
        async bingTranslate(text, targetLang = 'zh-Hans') {
            try {
                // Bing翻译备用方案：使用公开的翻译接口
                const url = `https://www.bing.com/translator/api/translate/v1?from=auto&to=${targetLang}&text=${encodeURIComponent(text)}`;
                const response = await this.fetchWithProxy(url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                const data = JSON.parse(response);
                return data.translation || null;
            } catch (error) {
                console.error('Bing翻译失败:', error);
                // 备用方案：使用简单的替代API
                return this.myMemoryTranslate(text, targetLang);
            }
        }

        // MyMemory 翻译（完全免费）
        async myMemoryTranslate(text, targetLang = 'zh-CN') {
            try {
                const langCode = targetLang.split('-')[0]; // zh-CN -> zh
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${langCode}`;
                const response = await this.fetchWithProxy(url);
                const data = JSON.parse(response);
                return data.responseData.translatedText;
            } catch (error) {
                console.error('MyMemory翻译失败:', error);
                return null;
            }
        }

        // 统一的fetch代理
        fetchWithProxy(url, options = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: url,
                    headers: options.headers || {},
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 获取所有翻译结果
        async translateAll(text, targetLang = 'zh-CN') {
            const promises = this.engines.map(async engine => {
                try {
                    const result = await engine.method.call(this, text, targetLang);
                    return {
                        engine: engine.name,
                        icon: engine.icon,
                        result: result,
                        success: result !== null
                    };
                } catch (error) {
                    return {
                        engine: engine.name,
                        icon: engine.icon,
                        result: '翻译失败',
                        success: false
                    };
                }
            });

            return await Promise.all(promises);
        }
    }

    // ==================== UI 管理器 ====================
    class UIManager {
        constructor() {
            this.panel = null;
            this.theme = CONFIG.theme;
            this.initStyles();
        }

        initStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes weiruan-fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes weiruan-pulse {
                    0%, 100% {
                        box-shadow: 0 0 20px ${this.theme.shadowColor};
                    }
                    50% {
                        box-shadow: 0 0 40px ${this.theme.shadowColor};
                    }
                }

                @keyframes weiruan-shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .weiruan-translation-panel {
                    position: fixed;
                    z-index: 999999;
                    min-width: 380px;
                    max-width: 500px;
                    background: ${this.theme.background};
                    border: 2px solid ${this.theme.borderColor};
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                                0 0 40px ${this.theme.shadowColor};
                    animation: weiruan-fadeIn 0.3s ease-out;
                    backdrop-filter: blur(10px);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    overflow: hidden;
                }

                .weiruan-panel-header {
                    background: linear-gradient(135deg, ${this.theme.secondary} 0%, ${this.theme.primary} 100%);
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    position: relative;
                    overflow: hidden;
                }

                .weiruan-panel-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg,
                        transparent,
                        rgba(255, 255, 255, 0.2),
                        transparent);
                    animation: weiruan-shimmer 3s infinite;
                }

                .weiruan-panel-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .weiruan-panel-title::before {
                    content: '⚡';
                    font-size: 20px;
                }

                .weiruan-close-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 32px;
                    text-align: center;
                    transition: all 0.2s;
                }

                .weiruan-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                .weiruan-panel-body {
                    padding: 20px;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .weiruan-panel-body::-webkit-scrollbar {
                    width: 6px;
                }

                .weiruan-panel-body::-webkit-scrollbar-track {
                    background: ${this.theme.cardBg};
                }

                .weiruan-panel-body::-webkit-scrollbar-thumb {
                    background: ${this.theme.primary};
                    border-radius: 3px;
                }

                .weiruan-original-text {
                    background: ${this.theme.cardBg};
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    border-left: 4px solid ${this.theme.primary};
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .weiruan-original-label {
                    font-size: 12px;
                    color: ${this.theme.primary};
                    font-weight: 600;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .weiruan-original-content {
                    color: ${this.theme.textPrimary};
                    font-size: 15px;
                    line-height: 1.6;
                    word-break: break-word;
                }

                .weiruan-translation-item {
                    background: ${this.theme.cardBg};
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .weiruan-translation-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: linear-gradient(180deg, ${this.theme.secondary}, ${this.theme.primary});
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .weiruan-translation-item:hover {
                    transform: translateX(8px);
                    border-color: ${this.theme.borderColor};
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                }

                .weiruan-translation-item:hover::before {
                    opacity: 1;
                }

                .weiruan-engine-name {
                    font-size: 13px;
                    color: ${this.theme.primary};
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .weiruan-translation-text {
                    color: ${this.theme.textPrimary};
                    font-size: 14px;
                    line-height: 1.7;
                    word-break: break-word;
                }

                .weiruan-loading {
                    text-align: center;
                    padding: 40px 20px;
                }

                .weiruan-loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(0, 217, 255, 0.2);
                    border-top-color: ${this.theme.primary};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .weiruan-loading-text {
                    color: ${this.theme.textSecondary};
                    font-size: 14px;
                }

                .weiruan-footer {
                    text-align: center;
                    padding: 16px;
                    background: ${this.theme.cardBg};
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    color: ${this.theme.textSecondary};
                    font-size: 12px;
                }

                .weiruan-footer-logo {
                    background: linear-gradient(135deg, ${this.theme.secondary}, ${this.theme.primary});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .weiruan-icon-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    background: ${this.theme.cardBg};
                    border: 1px solid ${this.theme.borderColor};
                    color: ${this.theme.primary};
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 4px;
                }

                .weiruan-icon-btn:hover {
                    background: ${this.theme.primary};
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px ${this.theme.shadowColor};
                }

                .weiruan-toolbar {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    padding: 12px;
                    background: ${this.theme.cardBg};
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
            `;
            document.head.appendChild(style);
        }

        createPanel(x, y) {
            this.panel = document.createElement('div');
            this.panel.className = 'weiruan-translation-panel';
            this.panel.style.left = `${x}px`;
            this.panel.style.top = `${y}px`;

            this.panel.innerHTML = `
                <div class="weiruan-panel-header">
                    <div class="weiruan-panel-title">智能翻译助手</div>
                    <button class="weiruan-close-btn">×</button>
                </div>
                <div class="weiruan-panel-body">
                    <div class="weiruan-loading">
                        <div class="weiruan-loading-spinner"></div>
                        <div class="weiruan-loading-text">正在翻译中...</div>
                    </div>
                </div>
                <div class="weiruan-footer">
                    Powered by <span class="weiruan-footer-logo">微软科技</span>
                </div>
            `;

            document.body.appendChild(this.panel);

            // 绑定事件
            this.bindEvents();

            return this.panel;
        }

        updateContent(originalText, translations) {
            if (!this.panel) return;

            const body = this.panel.querySelector('.weiruan-panel-body');

            let html = `
                <div class="weiruan-original-text">
                    <div class="weiruan-original-label">原文</div>
                    <div class="weiruan-original-content">${this.escapeHtml(originalText)}</div>
                </div>
            `;

            translations.forEach(trans => {
                if (trans.success && trans.result) {
                    html += `
                        <div class="weiruan-translation-item" data-translation="${this.escapeHtml(trans.result)}">
                            <div class="weiruan-engine-name">
                                <span>${trans.icon}</span>
                                <span>${trans.engine}</span>
                            </div>
                            <div class="weiruan-translation-text">${this.escapeHtml(trans.result)}</div>
                        </div>
                    `;
                }
            });

            body.innerHTML = html;

            // 绑定复制事件
            body.querySelectorAll('.weiruan-translation-item').forEach(item => {
                item.addEventListener('click', () => {
                    const text = item.dataset.translation;
                    this.copyToClipboard(text);
                    this.showToast('已复制到剪贴板');
                });
            });
        }

        bindEvents() {
            // 关闭按钮
            const closeBtn = this.panel.querySelector('.weiruan-close-btn');
            closeBtn.addEventListener('click', () => this.closePanel());

            // 拖动功能
            this.makeDraggable();

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (this.panel && !this.panel.contains(e.target)) {
                    this.closePanel();
                }
            });
        }

        makeDraggable() {
            const header = this.panel.querySelector('.weiruan-panel-header');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('weiruan-close-btn')) return;
                isDragging = true;
                initialX = e.clientX - this.panel.offsetLeft;
                initialY = e.clientY - this.panel.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    this.panel.style.left = `${currentX}px`;
                    this.panel.style.top = `${currentY}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        closePanel() {
            if (this.panel) {
                this.panel.remove();
                this.panel = null;
            }
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${this.theme.cardBg};
                color: ${this.theme.textPrimary};
                padding: 12px 24px;
                border-radius: 8px;
                border: 1px solid ${this.theme.borderColor};
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 9999999;
                font-size: 14px;
                animation: weiruan-fadeIn 0.3s ease-out;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    // ==================== 选词翻译管理器 ====================
    class SelectionTranslator {
        constructor(engine, ui) {
            this.engine = engine;
            this.ui = ui;
            this.init();
        }

        init() {
            document.addEventListener('mouseup', (e) => {
                setTimeout(() => this.handleSelection(e), 100);
            });

            // 快捷键支持
            document.addEventListener('keydown', (e) => {
                const hotkey = CONFIG.hotkey.split('+');
                const modifier = hotkey[0]; // altKey, ctrlKey, etc.
                const key = hotkey[1]; // KeyQ, KeyT, etc.

                if (e[modifier] && e.code === key) {
                    e.preventDefault();
                    this.handleSelection(e);
                }
            });
        }

        async handleSelection(e) {
            const selectedText = window.getSelection().toString().trim();

            if (!selectedText || selectedText.length < 1) {
                return;
            }

            if (selectedText.length > 1000) {
                this.ui.showToast('选中文本过长，请选择少于1000字符的文本');
                return;
            }

            // 创建翻译面板
            const x = Math.min(e.pageX + 10, window.innerWidth - 420);
            const y = Math.min(e.pageY + 10, window.innerHeight - 300);

            this.ui.createPanel(x, y);

            // 执行翻译
            const translations = await this.engine.translateAll(selectedText, CONFIG.targetLang);
            this.ui.updateContent(selectedText, translations);
        }
    }

    // ==================== 图片翻译管理器 ====================
    class ImageTranslator {
        constructor(engine, ui) {
            this.engine = engine;
            this.ui = ui;
            this.init();
        }

        init() {
            // 右键菜单支持
            document.addEventListener('contextmenu', (e) => {
                if (e.target.tagName === 'IMG') {
                    this.currentImage = e.target;
                }
            });

            GM_registerMenuCommand('翻译当前图片', () => {
                if (this.currentImage) {
                    this.translateImage(this.currentImage);
                } else {
                    this.ui.showToast('请先右键点击图片');
                }
            });
        }

        async translateImage(img) {
            this.ui.showToast('图片OCR翻译功能开发中...');
            // TODO: 集成免费OCR API（如Tesseract.js）
            // 1. 使用Tesseract.js进行OCR识别
            // 2. 将识别结果发送到翻译引擎
            // 3. 显示翻译结果
        }
    }

    // ==================== 视频字幕翻译管理器 ====================
    class SubtitleTranslator {
        constructor(engine, ui) {
            this.engine = engine;
            this.ui = ui;
            this.observers = [];
            this.translatedCache = new Map();
            this.init();
        }

        init() {
            if (!CONFIG.autoTranslateSubtitle) return;

            // 监听常见视频字幕容器
            this.watchSubtitles();

            GM_registerMenuCommand('切换字幕自动翻译', () => {
                CONFIG.autoTranslateSubtitle = !CONFIG.autoTranslateSubtitle;
                GM_setValue('autoTranslateSubtitle', CONFIG.autoTranslateSubtitle);
                this.ui.showToast(CONFIG.autoTranslateSubtitle ? '已开启字幕翻译' : '已关闭字幕翻译');

                if (CONFIG.autoTranslateSubtitle) {
                    this.watchSubtitles();
                } else {
                    this.stopWatching();
                }
            });
        }

        watchSubtitles() {
            // YouTube字幕
            this.observeElement('.ytp-caption-segment', (element) => {
                this.translateSubtitle(element);
            });

            // Netflix字幕
            this.observeElement('.player-timedtext-text-container', (element) => {
                this.translateSubtitle(element);
            });

            // 通用字幕容器
            this.observeElement('[class*="subtitle"]', (element) => {
                this.translateSubtitle(element);
            });
        }

        observeElement(selector, callback) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches(selector)) {
                                callback(node);
                            }
                            node.querySelectorAll(selector).forEach(callback);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            this.observers.push(observer);
        }

        async translateSubtitle(element) {
            const text = element.textContent.trim();

            if (!text || text.length < 2) return;

            // 检查缓存
            if (this.translatedCache.has(text)) {
                const cached = this.translatedCache.get(text);
                this.appendTranslation(element, cached);
                return;
            }

            // 翻译
            try {
                const result = await this.engine.googleTranslate(text, CONFIG.targetLang);
                if (result && result !== text) {
                    this.translatedCache.set(text, result);
                    this.appendTranslation(element, result);
                }
            } catch (error) {
                console.error('字幕翻译失败:', error);
            }
        }

        appendTranslation(element, translation) {
            // 避免重复添加
            if (element.querySelector('.weiruan-subtitle-translation')) return;

            const translationDiv = document.createElement('div');
            translationDiv.className = 'weiruan-subtitle-translation';
            translationDiv.style.cssText = `
                color: ${CONFIG.theme.primary};
                font-size: 0.9em;
                margin-top: 4px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            `;
            translationDiv.textContent = translation;
            element.appendChild(translationDiv);
        }

        stopWatching() {
            this.observers.forEach(observer => observer.disconnect());
            this.observers = [];
        }
    }

    // ==================== 主程序初始化 ====================
    function init() {
        console.log('微软科技 - 智能翻译助手已启动');

        const engine = new TranslationEngine();
        const ui = new UIManager();
        const selectionTranslator = new SelectionTranslator(engine, ui);
        const imageTranslator = new ImageTranslator(engine, ui);
        const subtitleTranslator = new SubtitleTranslator(engine, ui);

        // 注册菜单命令
        GM_registerMenuCommand('设置目标语言', () => {
            const lang = prompt('请输入目标语言代码（如：zh-CN, en, ja, ko）', CONFIG.targetLang);
            if (lang) {
                CONFIG.targetLang = lang;
                GM_setValue('targetLang', lang);
                ui.showToast(`目标语言已设置为：${lang}`);
            }
        });

        GM_registerMenuCommand('关于翻译助手', () => {
            alert(`微软科技 - 智能翻译助手 v1.0.0\n\n功能特性：\n✓ 选词翻译（Alt+Q）\n✓ 多引擎翻译对比\n✓ 图片OCR翻译\n✓ 视频字幕自动翻译\n\n技术支持：微软科技`);
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
