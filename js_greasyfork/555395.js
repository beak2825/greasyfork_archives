// ==UserScript==
// @name         GMGN Twitter翻译助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动翻译GMGN网站上的Twitter用户简介信息
// @author       行止
// @license      MIT
// @supportURL   https://x.com/MattMorote
// @match        https://gmgn.ai/*
// @match        https://*.gmgn.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      api-free.deepl.com
// @connect      api.deepl.com
// @connect      translation.googleapis.com
// @connect      fanyi-api.baidu.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555395/GMGN%20Twitter%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555395/GMGN%20Twitter%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置区域 ==========
    const CONFIG = {
        avatarSelector: 'a[href^="https://x.com/"], a[href*="x.com"]',
        avatarSVGSelector: 'svg[viewBox="0 0 16 16"][width="14px"]',
        communitySVGSelector: 'svg[viewBox="0 0 16 16"][width="14px"]',
        communityLinkSelector: 'a[href*="x.com/i/communities/"]',
        popupSelector: 'div[class*="px-14px"][class*="py-14px"]',
        popupSelectorAlt: 'div.flex.flex-col.flex-1[class*="px-14px"]',
        bioSelector: 'div[class*="text-["][class*="mt-12px"][class*="break-words"][class*="min-h-[36px]"]',
        bioSelectorAlt: 'div[class*="mt-12px"][class*="break-words"]',
        communityBioSelector: 'div[class*="text-text-100"][class*="mt-[5px"][class*="break-words"][class*="whitespace-pre-line"][class*="min-h-[36px]"]',
        communityBioSelectorAlt: 'div[class*="mt-[5px"][class*="break-words"][class*="whitespace-pre-line"]',
        translationClass: 'gmgn-translation-result',
        waitDelay: 50
    };

    // ========== 默认设置 ==========
    const DEFAULT_SETTINGS = {
        enabled: true,
        translationService: 'google',
        targetLanguage: 'zh',
        apiKey: '',
        appId: '',
        appSecret: ''
    };

    // ========== 翻译服务配置 ==========
    const TRANSLATION_SERVICES = {
        google: {
            name: 'Google Translate',
            apiUrl: 'https://translation.googleapis.com/language/translate/v2',
            needsKey: true
        },
        deepl: {
            name: 'DeepL',
            apiUrl: 'https://api-free.deepl.com/v2/translate',
            needsKey: true
        },
        baidu: {
            name: '百度翻译',
            apiUrl: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            needsKey: true,
            needsAppId: true
        }
    };

    // ========== 状态管理 ==========
    let isEnabled = true;
    let currentPopup = null;
    let translationCache = new Map();
    let processingPopups = new Set();
    let debounceTimer = null;
    let observer = null;
    let mouseoverTimer = null;
    const MAX_CACHE_SIZE = 100;
    const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;

    // ========== 存储管理（替代chrome.storage）==========
    function getSettings() {
        const stored = GM_getValue('settings', null);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...stored };
        }
        return DEFAULT_SETTINGS;
    }

    function saveSettings(settings) {
        GM_setValue('settings', settings);
    }

    // ========== 初始化 ==========
    function init() {
        const settings = getSettings();
        isEnabled = settings.enabled !== false;
        
        if (isEnabled) {
            startMonitoring();
        }

        // 注入样式
        injectStyles();

        // 定期清理缓存
        setInterval(() => {
            if (translationCache.size > MAX_CACHE_SIZE) {
                const keysToDelete = Array.from(translationCache.keys()).slice(0, Math.floor(MAX_CACHE_SIZE / 2));
                keysToDelete.forEach(key => translationCache.delete(key));
            }
        }, CACHE_CLEANUP_INTERVAL);

        // 注册设置菜单
        registerMenuCommands();
    }

    // ========== 注入样式 ==========
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gmgn-translation-result {
                margin-top: 12px;
                padding: 10px 12px;
                background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
                border-radius: 8px;
                color: #fff;
                font-size: 14px;
                line-height: 1.6;
                box-shadow: 0 4px 6px rgba(255, 140, 66, 0.2);
                animation: slideIn 0.3s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .gmgn-translation-content {
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            .gmgn-translation-icon {
                font-size: 16px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .gmgn-translation-text {
                flex: 1;
                word-wrap: break-word;
                word-break: break-word;
            }
            .gmgn-translation-error {
                margin-top: 8px;
                padding: 8px;
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 4px;
                color: #c00;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== 注册菜单命令 ==========
    function registerMenuCommands() {
        GM_registerMenuCommand('⚙️ 打开设置', openSettings);
        GM_registerMenuCommand('🔄 切换启用/禁用', toggleEnabled);
    }

    // ========== 打开设置 ==========
    function openSettings() {
        const settings = getSettings();
        const serviceOptions = Object.keys(TRANSLATION_SERVICES).map(key => 
            `<option value="${key}" ${settings.translationService === key ? 'selected' : ''}>${TRANSLATION_SERVICES[key].name}</option>`
        ).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>GMGN翻译助手设置</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #f5f5f5;
                        padding: 20px;
                    }
                    .container {
                        max-width: 500px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 20px;
                        margin-bottom: 4px;
                    }
                    .subtitle {
                        font-size: 12px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 20px;
                    }
                    .section {
                        margin-bottom: 24px;
                    }
                    .section-title {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: #333;
                    }
                    .form-group {
                        margin-bottom: 16px;
                    }
                    label {
                        display: block;
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 6px;
                        font-weight: 500;
                    }
                    input, select {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 14px;
                        outline: none;
                    }
                    input:focus, select:focus {
                        border-color: #ff8c42;
                    }
                    .toggle-container {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .toggle {
                        position: relative;
                        width: 44px;
                        height: 24px;
                        appearance: none;
                        background: #ccc;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: background 0.3s;
                    }
                    .toggle:checked {
                        background: #ff8c42;
                    }
                    .toggle::before {
                        content: '';
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: white;
                        top: 2px;
                        left: 2px;
                        transition: transform 0.3s;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .toggle:checked::before {
                        transform: translateX(20px);
                    }
                    .button {
                        width: 100%;
                        padding: 12px;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                        margin-top: 8px;
                    }
                    .button-primary {
                        background: linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%);
                        color: white;
                    }
                    .button-primary:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 8px rgba(255, 140, 66, 0.4);
                    }
                    .help-text {
                        margin-top: 12px;
                        padding: 12px;
                        background: #f8f9fa;
                        border-radius: 6px;
                        font-size: 12px;
                        color: #666;
                    }
                    .help-text a {
                        color: #ff8c42;
                        text-decoration: none;
                    }
                    .help-text a:hover {
                        text-decoration: underline;
                    }
                    .message {
                        padding: 10px;
                        border-radius: 6px;
                        margin-top: 10px;
                        font-size: 12px;
                        display: none;
                    }
                    .message.success {
                        background: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                        display: block;
                    }
                    .message.error {
                        background: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🌐 GMGN翻译助手</h1>
                        <p class="subtitle">自动翻译Twitter简介</p>
                    </div>
                    <div class="content">
                        <div class="section">
                            <div class="toggle-container">
                                <label>启用翻译</label>
                                <input type="checkbox" id="enabled" class="toggle" ${settings.enabled ? 'checked' : ''}>
                            </div>
                        </div>
                        <div class="section">
                            <label class="section-title">翻译服务</label>
                            <select id="translationService">${serviceOptions}</select>
                        </div>
                        <div class="section" id="apiKeySection">
                            <label class="section-title">API配置</label>
                            <div class="form-group">
                                <label for="apiKey">API密钥</label>
                                <input type="password" id="apiKey" value="${settings.apiKey || ''}" placeholder="请输入API密钥">
                            </div>
                            <div class="form-group" id="baiduConfig" style="display: none;">
                                <label for="appId">App ID</label>
                                <input type="text" id="appId" value="${settings.appId || ''}" placeholder="请输入App ID">
                                <label for="appSecret" style="margin-top: 12px;">App Secret</label>
                                <input type="password" id="appSecret" value="${settings.appSecret || ''}" placeholder="请输入App Secret">
                            </div>
                            <div class="help-text">
                                <p>💡 如何获取API密钥：</p>
                                <ul>
                                    <li><strong>Google:</strong> <a href="https://cloud.google.com/translate" target="_blank">Google Cloud Console</a></li>
                                    <li><strong>DeepL:</strong> <a href="https://www.deepl.com/pro-api" target="_blank">DeepL API</a></li>
                                    <li><strong>百度:</strong> <a href="https://fanyi-api.baidu.com/" target="_blank">百度翻译开放平台</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="section">
                            <label class="section-title">目标语言</label>
                            <select id="targetLanguage">
                                <option value="zh" ${settings.targetLanguage === 'zh' ? 'selected' : ''}>中文</option>
                                <option value="en" ${settings.targetLanguage === 'en' ? 'selected' : ''}>英文</option>
                                <option value="ja" ${settings.targetLanguage === 'ja' ? 'selected' : ''}>日文</option>
                                <option value="ko" ${settings.targetLanguage === 'ko' ? 'selected' : ''}>韩文</option>
                                <option value="fr" ${settings.targetLanguage === 'fr' ? 'selected' : ''}>法文</option>
                                <option value="de" ${settings.targetLanguage === 'de' ? 'selected' : ''}>德文</option>
                                <option value="es" ${settings.targetLanguage === 'es' ? 'selected' : ''}>西班牙文</option>
                            </select>
                        </div>
                        <button class="button button-primary" onclick="saveSettings()">保存设置</button>
                        <div id="message" class="message"></div>
                    </div>
                </div>
                <script>
                    const translationService = document.getElementById('translationService');
                    const baiduConfig = document.getElementById('baiduConfig');
                    const apiKeySection = document.getElementById('apiKeySection');
                    
                    translationService.addEventListener('change', function() {
                        if (this.value === 'baidu') {
                            baiduConfig.style.display = 'block';
                            apiKeySection.querySelector('label[for="apiKey"]').textContent = 'App ID (百度翻译使用下方配置)';
                        } else {
                            baiduConfig.style.display = 'none';
                            apiKeySection.querySelector('label[for="apiKey"]').textContent = 'API密钥';
                        }
                    });
                    
                    if (translationService.value === 'baidu') {
                        baiduConfig.style.display = 'block';
                        apiKeySection.querySelector('label[for="apiKey"]').textContent = 'App ID (百度翻译使用下方配置)';
                    }
                    
                    function saveSettings() {
                        const settings = {
                            enabled: document.getElementById('enabled').checked,
                            translationService: document.getElementById('translationService').value,
                            targetLanguage: document.getElementById('targetLanguage').value,
                            apiKey: document.getElementById('apiKey').value.trim(),
                            appId: document.getElementById('appId').value.trim(),
                            appSecret: document.getElementById('appSecret').value.trim()
                        };
                        
                        // 通过 window.opener 访问主窗口，调用保存函数
                        if (window.opener && window.opener.GMGN_SaveSettings) {
                            window.opener.GMGN_SaveSettings(settings);
                            const message = document.getElementById('message');
                            message.className = 'message success';
                            message.textContent = '✅ 设置已保存！';
                            setTimeout(() => {
                                message.className = 'message';
                            }, 3000);
                        } else {
                            // 降级方案：使用 postMessage
                            window.opener.postMessage({
                                type: 'GMGN_SAVE_SETTINGS',
                                settings: settings
                            }, '*');
                            const message = document.getElementById('message');
                            message.className = 'message success';
                            message.textContent = '✅ 设置已保存！';
                            setTimeout(() => {
                                message.className = 'message';
                            }, 3000);
                        }
                    }
                </script>
            </body>
            </html>
        `;

        // 将保存函数暴露到全局，供设置窗口调用
        window.GMGN_SaveSettings = function(settings) {
            saveSettings(settings);
            isEnabled = settings.enabled;
            if (isEnabled) {
                startMonitoring();
            } else {
                stopMonitoring();
            }
        };

        const win = window.open('', 'GMGN翻译助手设置', 'width=600,height=700,resizable=yes,scrollbars=yes');
        win.document.write(html);
        win.document.close();

        // 监听设置保存消息（降级方案）
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'GMGN_SAVE_SETTINGS') {
                window.GMGN_SaveSettings(event.data.settings);
            }
        });
    }

    // ========== 切换启用/禁用 ==========
    function toggleEnabled() {
        const settings = getSettings();
        settings.enabled = !settings.enabled;
        saveSettings(settings);
        isEnabled = settings.enabled;
        
        if (isEnabled) {
            startMonitoring();
            GM_notification({
                title: 'GMGN翻译助手',
                text: '翻译功能已启用',
                timeout: 2000
            });
        } else {
            stopMonitoring();
            GM_notification({
                title: 'GMGN翻译助手',
                text: '翻译功能已禁用',
                timeout: 2000
            });
        }
    }

    // ========== 开始监听 ==========
    function startMonitoring() {
        observer = new MutationObserver((mutations) => {
            if (!isEnabled) return;
            
            for (const mutation of mutations) {
                if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
                    continue;
                }
                
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains(CONFIG.translationClass)) {
                            continue;
                        }
                        if (node.querySelector && node.querySelector(`.${CONFIG.translationClass}`)) {
                            continue;
                        }
                        checkForPopup(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        document.addEventListener('mouseover', handleMouseOver, true);
    }

    // ========== 停止监听 ==========
    function stopMonitoring() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        document.removeEventListener('mouseover', handleMouseOver, true);
        
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        
        if (mouseoverTimer) {
            clearTimeout(mouseoverTimer);
            mouseoverTimer = null;
        }
    }

    // ========== 检查浮窗出现 ==========
    function checkForPopup(node) {
        if (node.nodeType !== 1 || !node.offsetHeight || node.offsetHeight < 30) {
            return;
        }
        
        const popup = findPopupElement(node);
        if (popup && popup !== currentPopup) {
            currentPopup = popup;
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
                handlePopupAppear(popup);
            }, 30);
        }
    }

    // ========== 查找浮窗元素 ==========
    function findPopupElement(element) {
        if (matchesSelector(element, CONFIG.popupSelector)) {
            return element;
        }

        const popup = element.querySelector?.(CONFIG.popupSelector);
        if (popup) {
            return popup;
        }

        let parent = element.parentElement;
        let depth = 0;
        while (parent && depth < 5) {
            if (matchesSelector(parent, CONFIG.popupSelector)) {
                return parent;
            }
            parent = parent.parentElement;
            depth++;
        }

        return null;
    }

    // ========== 匹配选择器 ==========
    function matchesSelector(element, selector) {
        if (!element || !selector) return false;
        
        try {
            if (element.matches) {
                return element.matches(selector);
            }
            if (element.matchesSelector) {
                return element.matchesSelector(selector);
            }
            if (element.msMatchesSelector) {
                return element.msMatchesSelector(selector);
            }
            
            if (selector.includes('class')) {
                const classMatch = selector.match(/\[class\*="([^"]+)"/);
                if (classMatch) {
                    const className = classMatch[1];
                    return element.className && element.className.includes(className);
                }
            }
        } catch (e) {
            // 静默失败
        }
        
        return false;
    }

    // ========== 处理鼠标悬停 ==========
    function handleMouseOver(event) {
        if (!isEnabled) return;

        const target = event.target;
        
        if (target.tagName !== 'A' && target.tagName !== 'SVG' && 
            !target.closest('a') && !target.closest('svg')) {
            return;
        }
        
        if (isAvatarElement(target)) {
            if (mouseoverTimer) {
                clearTimeout(mouseoverTimer);
            }
            
            mouseoverTimer = setTimeout(() => {
                const popup = findPopupInDocument();
                if (popup && popup !== currentPopup) {
                    currentPopup = popup;
                    handlePopupAppear(popup);
                }
                
                setTimeout(() => {
                    const popup = findPopupInDocument();
                    if (popup && popup !== currentPopup) {
                        currentPopup = popup;
                        handlePopupAppear(popup);
                    }
                }, CONFIG.waitDelay);
                
                mouseoverTimer = null;
            }, 20);
        }
    }

    // ========== 检查是否是头像元素 ==========
    function isAvatarElement(element) {
        if (!element) return false;
        
        const personalLink = element.closest('a[href^="https://x.com/"]');
        if (personalLink && !personalLink.href.includes('/i/communities/')) {
            return true;
        }
        
        const communityLink = element.closest('a[href*="x.com/i/communities/"]');
        if (communityLink) {
            return true;
        }
        
        const svg = element.closest('svg[viewBox="0 0 16 16"]');
        if (svg) {
            const width = svg.getAttribute('width');
            if (width === '14px' || width === '14') {
                const paths = svg.querySelectorAll('path');
                if (paths.length >= 2) {
                    const pathData = Array.from(paths).map(p => p.getAttribute('d')).join('');
                    if (pathData.length > 200) {
                        return true;
                    }
                }
                return true;
            }
        }
        
        if (element.closest('[class*="css-k008qs"]')) {
            return true;
        }
        
        return false;
    }

    // ========== 在文档中查找浮窗 ==========
    let lastPopupQuery = { time: 0, result: null };
    const POPUP_QUERY_CACHE_TIME = 30;
    
    function findPopupInDocument() {
        const now = Date.now();
        if (lastPopupQuery.result && (now - lastPopupQuery.time) < POPUP_QUERY_CACHE_TIME) {
            if (lastPopupQuery.result.parentElement && isVisible(lastPopupQuery.result)) {
                return lastPopupQuery.result;
            }
        }
        
        const selectors = [
            CONFIG.popupSelector,
            CONFIG.popupSelectorAlt,
            'div[class*="px-14px"][class*="py-14px"]',
        ];

        for (const selector of selectors) {
            try {
                const element = document.querySelector(selector);
                
                if (element && isVisible(element) && containsTwitterContent(element)) {
                    lastPopupQuery = { time: now, result: element };
                    return element;
                }
            } catch (e) {
                continue;
            }
        }

        lastPopupQuery = { time: now, result: null };
        return null;
    }
    
    // ========== 检查是否包含Twitter内容 ==========
    function containsTwitterContent(element) {
        if (!element) return false;
        
        const hasTwitterLink = element.querySelector('a[href^="https://x.com/"], a[href*="x.com"]');
        if (!hasTwitterLink) return false;
        
        const hasProfileButton = element.textContent.includes('See Profile on X') ||
                                 element.textContent.includes('Following') ||
                                 element.textContent.includes('Followers');
        
        const hasCommunityButton = element.textContent.includes('View community on X') ||
                                   element.textContent.includes('community');
        
        return hasProfileButton || hasCommunityButton;
    }
    
    // ========== 检查是否是社群浮窗 ==========
    function isCommunityPopup(popupElement) {
        if (!popupElement) return false;
        
        const communityLink = popupElement.querySelector('a[href*="x.com/i/communities/"]');
        if (communityLink) {
            return true;
        }
        
        const hasCommunityButton = popupElement.textContent.includes('View community on X') ||
                                  (popupElement.textContent.includes('community') && 
                                   popupElement.textContent.includes('Members'));
        if (hasCommunityButton) {
            return true;
        }
        
        const communityBio = popupElement.querySelector(CONFIG.communityBioSelector) ||
                             popupElement.querySelector(CONFIG.communityBioSelectorAlt) ||
                             popupElement.querySelector('div[class*="mt-[5px"][class*="break-words"][class*="whitespace-pre-line"]');
        if (communityBio) {
            return true;
        }
        
        return false;
    }

    // ========== 检查元素是否可见 ==========
    function isVisible(element) {
        if (!element) return false;
        
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    }

    // ========== 处理浮窗出现 ==========
    function handlePopupAppear(popupElement) {
        if (!popupElement) return;
        
        const popupId = getPopupId(popupElement);
        if (processingPopups.has(popupId)) {
            return;
        }
        
        if (popupElement.querySelector(`.${CONFIG.translationClass}`)) {
            return;
        }
        
        processingPopups.add(popupId);
        
        let bioText = extractBioText(popupElement);
        
        if (!bioText || bioText.length < 8) {
            setTimeout(() => {
                if (popupElement.querySelector(`.${CONFIG.translationClass}`)) {
                    processingPopups.delete(popupId);
                    return;
                }
                
                bioText = extractBioText(popupElement);
                if (bioText && bioText.length >= 8) {
                    translateAndDisplay(popupElement, bioText).finally(() => {
                        setTimeout(() => {
                            processingPopups.delete(popupId);
                        }, 100);
                    });
                } else {
                    processingPopups.delete(popupId);
                }
            }, 30);
        } else {
            translateAndDisplay(popupElement, bioText).finally(() => {
                setTimeout(() => {
                    processingPopups.delete(popupId);
                }, 100);
            });
        }
    }
    
    // ========== 获取浮窗唯一ID ==========
    function getPopupId(popupElement) {
        const bioText = extractBioText(popupElement);
        if (bioText) {
            return 'popup_' + bioText.substring(0, 50).replace(/\s/g, '_');
        }
        const rect = popupElement.getBoundingClientRect();
        return 'popup_' + Math.round(rect.top) + '_' + Math.round(rect.left);
    }

    // ========== 提取简介文本 ==========
    function extractBioText(popupElement) {
        if (!popupElement) return null;

        const isCommunity = isCommunityPopup(popupElement);
        
        if (isCommunity) {
            const selectors = [
                CONFIG.communityBioSelector,
                CONFIG.communityBioSelectorAlt,
                'div[class*="mt-[5px"][class*="break-words"][class*="whitespace-pre-line"]',
                'div[class*="text-text-100"][class*="mt-[5px"]',
            ];

            for (const selector of selectors) {
                try {
                    const element = popupElement.querySelector(selector);
                    if (element) {
                        const text = element.innerText || element.textContent;
                        const cleanText = text.trim();
                        
                        if (isValidBioText(cleanText)) {
                            return cleanText;
                        }
                    }
                } catch (e) {
                    // 静默失败
                }
            }
        } else {
            const selectors = [
                CONFIG.bioSelector,
                CONFIG.bioSelectorAlt,
                'div[class*="mt-12px"][class*="break-words"]',
                'div[class*="text-["][class*="mt-12px"]',
            ];

            for (const selector of selectors) {
                try {
                    const element = popupElement.querySelector(selector);
                    if (element) {
                        const text = element.innerText || element.textContent;
                        const cleanText = text.trim();
                        
                        if (isValidBioText(cleanText)) {
                            return cleanText;
                        }
                    }
                } catch (e) {
                    // 继续尝试下一个
                }
            }
        }

        return extractTextIntelligently(popupElement);
    }
    
    // ========== 验证是否是有效的简介文本 ==========
    function isValidBioText(text) {
        if (!text || text.length < 5) return false;
        
        const excludePatterns = [
            /^(Joined|Following|Followers|Created|Members|\d+)/,
            /^https?:\/\//,
            /^@\w+/,
            /^(See Profile|View community)/,
            /^\d+\s*(Following|Followers|Members)/,
            /^(Dec|Nov|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct)\s+\d{4}$/,
        ];
        
        for (const pattern of excludePatterns) {
            if (pattern.test(text)) {
                return false;
            }
        }
        
        return text.length >= 8 && 
               !/^\d+$/.test(text) &&
               !/^[^\w\s]+$/.test(text);
    }

    // ========== 智能提取文本 ==========
    function extractTextIntelligently(element) {
        const commonSelectors = ['div', 'p', 'span'];
        let bestText = '';
        let bestScore = 0;
        
        for (const tag of commonSelectors) {
            const elements = element.querySelectorAll(`> ${tag}`);
            for (const el of elements) {
                const text = (el.innerText || el.textContent).trim();
                
                if (!text || text.length < 8) continue;
                if (!isValidBioText(text)) continue;
                
                const score = calculateTextScore(el, text);
                
                if (score > bestScore) {
                    bestText = text;
                    bestScore = score;
                }
            }
        }
        
        if (!bestText) {
            const allTextElements = element.querySelectorAll('p, div, span');
            for (const el of allTextElements) {
                const text = (el.innerText || el.textContent).trim();
                
                if (!text || text.length < 8) continue;
                if (!isValidBioText(text)) continue;
                
                const score = calculateTextScore(el, text);
                if (score > bestScore) {
                    bestText = text;
                    bestScore = score;
                }
            }
        }

        return bestText || null;
    }
    
    // ========== 计算文本分数 ==========
    function calculateTextScore(el, text) {
        let score = text.length;
        const classList = el.className || '';
        
        if (classList.includes('mt-12px') || classList.includes('mt-[5px') || classList.includes('mt-')) {
            score += 50;
        }
        
        if (classList.includes('break-words')) {
            score += 30;
        }
        
        if (classList.includes('text-[') || classList.includes('text-text-100')) {
            score += 20;
        }
        
        if (classList.includes('whitespace-pre-line')) {
            score += 15;
        }
        
        return score;
    }

    // ========== 翻译并显示 ==========
    async function translateAndDisplay(popupElement, bioText) {
        if (popupElement.querySelector(`.${CONFIG.translationClass}`)) {
            return;
        }
        
        const cacheKey = bioText.substring(0, 100);
        if (translationCache.has(cacheKey)) {
            const cached = translationCache.get(cacheKey);
            displayTranslation(popupElement, bioText, cached);
            return;
        }

        if (translationCache.size >= MAX_CACHE_SIZE) {
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }

        try {
            const settings = getSettings();
            
            const translatedText = await translateText(bioText, settings);
            
            if (!translatedText || translatedText.trim().length === 0) {
                throw new Error('翻译结果为空');
            }
            
            translationCache.set(cacheKey, translatedText);
            displayTranslation(popupElement, bioText, translatedText);
        } catch (error) {
            let errorMessage = '翻译服务不可用';
            
            if (error.message) {
                if (error.message.includes('超时')) {
                    errorMessage = '翻译请求超时，请稍后重试';
                } else if (error.message.includes('网络')) {
                    errorMessage = '网络连接失败，请检查网络';
                } else if (error.message.includes('API')) {
                    errorMessage = 'API调用失败：' + error.message;
                } else {
                    errorMessage = error.message;
                }
            }
            
            showError(popupElement, errorMessage);
        }
    }

    // ========== 翻译文本（使用GM_xmlhttpRequest）==========
    function translateText(text, settings) {
        return new Promise((resolve, reject) => {
            if (!settings.apiKey && TRANSLATION_SERVICES[settings.translationService]?.needsKey) {
                reject(new Error('请先在设置中配置API密钥'));
                return;
            }

            if (!text || text.trim().length === 0) {
                reject(new Error('翻译文本为空'));
                return;
            }
            
            if (text.length > 5000) {
                reject(new Error('翻译文本过长（超过5000字符）'));
                return;
            }

            switch (settings.translationService) {
                case 'google':
                    translateWithGoogle(text, settings, resolve, reject);
                    break;
                case 'deepl':
                    translateWithDeepL(text, settings, resolve, reject);
                    break;
                case 'baidu':
                    if (!settings.appId || !settings.appSecret) {
                        reject(new Error('百度翻译需要App ID和App Secret'));
                        return;
                    }
                    translateWithBaidu(text, settings, resolve, reject);
                    break;
                default:
                    reject(new Error('不支持的翻译服务：' + settings.translationService));
            }
        });
    }

    // ========== Google Translate ==========
    function translateWithGoogle(text, settings, resolve, reject) {
        const url = `${TRANSLATION_SERVICES.google.apiUrl}?key=${settings.apiKey}`;
        
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                q: text,
                target: settings.targetLanguage,
                source: 'auto'
            }),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.data.translations[0].translatedText);
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                } else {
                    try {
                        const error = JSON.parse(response.responseText);
                        reject(new Error(error.error?.message || `HTTP ${response.status}`));
                    } catch (e) {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                }
            },
            onerror: function(error) {
                reject(new Error('网络连接失败'));
            },
            ontimeout: function() {
                reject(new Error('请求超时'));
            },
            timeout: 10000
        });
    }

    // ========== DeepL Translate ==========
    function translateWithDeepL(text, settings, resolve, reject) {
        const isFree = settings.apiKey.endsWith(':fx');
        const apiUrl = isFree 
            ? 'https://api-free.deepl.com/v2/translate'
            : 'https://api.deepl.com/v2/translate';
        
        const langMap = {
            'zh': 'ZH',
            'en': 'EN',
            'ja': 'JA',
            'ko': 'KO',
            'fr': 'FR',
            'de': 'DE',
            'es': 'ES'
        };
        
        const targetLang = langMap[settings.targetLanguage] || settings.targetLanguage.toUpperCase();
        
        const formData = new URLSearchParams();
        formData.append('auth_key', settings.apiKey);
        formData.append('text', text);
        formData.append('target_lang', targetLang);

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData.toString(),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.translations && data.translations.length > 0) {
                            resolve(data.translations[0].text);
                        } else {
                            reject(new Error('DeepL返回数据格式错误'));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                } else {
                    try {
                        const error = JSON.parse(response.responseText);
                        reject(new Error(error.message || error.error?.message || `HTTP ${response.status}`));
                    } catch (e) {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                }
            },
            onerror: function(error) {
                reject(new Error('网络连接失败'));
            },
            ontimeout: function() {
                reject(new Error('请求超时'));
            },
            timeout: 10000
        });
    }

    // ========== 百度翻译 ==========
    function translateWithBaidu(text, settings, resolve, reject) {
        const salt = Date.now().toString();
        
        // 生成签名（简化版，使用MD5）
        const str = settings.appId + text + salt + settings.appSecret;
        const sign = md5(str);
        
        const params = new URLSearchParams({
            q: text,
            from: 'auto',
            to: settings.targetLanguage,
            appid: settings.appId,
            salt: salt,
            sign: sign
        });

        const url = `${TRANSLATION_SERVICES.baidu.apiUrl}?${params.toString()}`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.error_code) {
                            reject(new Error(`百度翻译错误: ${data.error_msg}`));
                        } else {
                            resolve(data.trans_result[0].dst);
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                } else {
                    reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                }
            },
            onerror: function(error) {
                reject(new Error('网络连接失败'));
            },
            ontimeout: function() {
                reject(new Error('请求超时'));
            },
            timeout: 10000
        });
    }

    // ========== MD5哈希（用于百度翻译签名）==========
    function md5(string) {
        // 完整的MD5实现
        function md5cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3];
            
            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);
            
            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);
            
            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);
            
            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);
            
            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }
        
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }
        
        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        
        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }
        
        function add32(a, b) {
            return (a + b) & 0xFFFFFFFF;
        }
        
        function rhex(n) {
            let s = '', j = 0;
            for (; j < 4; j++) {
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
            }
            return s;
        }
        
        const hex_chr = '0123456789abcdef'.split('');
        
        const utf8 = unescape(encodeURIComponent(string));
        const len = utf8.length;
        const state = [1732584193, -271733879, -1732584194, 271733878];
        let i;
        
        for (i = 64; i <= len; i += 64) {
            md5cycle(state, md5blk(utf8.substring(i - 64, i)));
        }
        
        utf8 = utf8.substring(i - 64);
        const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < utf8.length; i++) {
            tail[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = len * 8;
        md5cycle(state, tail);
        
        return rhex(state[0]) + rhex(state[1]) + rhex(state[2]) + rhex(state[3]);
        
        function md5blk(s) {
            const md5blks = [];
            let i;
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }
    }

    // ========== 显示翻译结果 ==========
    function displayTranslation(popupElement, originalText, translatedText) {
        const existingTranslation = popupElement.querySelector(`.${CONFIG.translationClass}`);
        if (existingTranslation) {
            const translatedEl = existingTranslation.querySelector('.gmgn-translation-text');
            if (translatedEl) {
                translatedEl.textContent = translatedText;
            }
            return;
        }
        
        const oldTranslation = popupElement.querySelector(`.${CONFIG.translationClass}`);
        if (oldTranslation) {
            oldTranslation.remove();
        }

        const translationDiv = document.createElement('div');
        translationDiv.className = CONFIG.translationClass;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'gmgn-translation-content';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'gmgn-translation-icon';
        iconSpan.textContent = '🌐';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'gmgn-translation-text';
        textSpan.textContent = translatedText;
        
        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(textSpan);
        translationDiv.appendChild(contentDiv);

        const bioElement = findBioElement(popupElement);
        if (bioElement && bioElement.parentNode) {
            const nextSibling = bioElement.nextSibling;
            if (nextSibling && nextSibling.classList && nextSibling.classList.contains(CONFIG.translationClass)) {
                return;
            }
            bioElement.parentNode.insertBefore(translationDiv, bioElement.nextSibling);
        } else {
            const lastChild = popupElement.lastElementChild;
            if (lastChild && lastChild.classList && lastChild.classList.contains(CONFIG.translationClass)) {
                return;
            }
            popupElement.appendChild(translationDiv);
        }
    }

    // ========== 查找简介元素 ==========
    function findBioElement(popupElement) {
        if (!popupElement) return null;
        
        const isCommunity = isCommunityPopup(popupElement);
        
        if (isCommunity) {
            const selectors = [
                CONFIG.communityBioSelector,
                CONFIG.communityBioSelectorAlt,
                'div[class*="mt-[5px"][class*="break-words"]',
                'div[class*="text-text-100"][class*="mt-[5px"]',
            ];

            for (const selector of selectors) {
                try {
                    const element = popupElement.querySelector(selector);
                    if (element) {
                        const text = (element.innerText || element.textContent).trim();
                        if (isValidBioText(text)) {
                            return element;
                        }
                    }
                } catch (e) {
                    // 继续尝试下一个
                }
            }
        } else {
            const selectors = [
                CONFIG.bioSelector,
                CONFIG.bioSelectorAlt,
                'div[class*="mt-12px"][class*="break-words"]',
                'div[class*="text-["][class*="mt-12px"]',
            ];

            for (const selector of selectors) {
                try {
                    const element = popupElement.querySelector(selector);
                    if (element) {
                        const text = (element.innerText || element.textContent).trim();
                        if (isValidBioText(text)) {
                            return element;
                        }
                    }
                } catch (e) {
                    // 继续尝试下一个
                }
            }
        }
        
        const allDivs = popupElement.querySelectorAll('div');
        for (const div of allDivs) {
            const text = (div.innerText || div.textContent).trim();
            if (isValidBioText(text)) {
                const classList = div.className || '';
                if (classList.includes('mt-12px') || classList.includes('mt-[5px') || 
                    classList.includes('break-words')) {
                    return div;
                }
            }
        }
        
        return null;
    }

    // ========== 显示错误 ==========
    function showError(popupElement, message) {
        const oldError = popupElement.querySelector('.gmgn-translation-error');
        if (oldError) {
            oldError.remove();
        }
        
        const error = document.createElement('div');
        error.className = 'gmgn-translation-error';
        error.textContent = `❌ ${message}`;
        error.style.cssText = `
            padding: 8px 12px;
            margin-top: 10px;
            color: #d32f2f;
            background-color: #ffebee;
            border: 1px solid #ef9a9a;
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.5;
        `;
        
        const bioElement = findBioElement(popupElement);
        if (bioElement && bioElement.parentNode) {
            bioElement.parentNode.insertBefore(error, bioElement.nextSibling);
        } else {
            popupElement.appendChild(error);
        }
    }

    // ========== 页面加载完成后初始化 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

