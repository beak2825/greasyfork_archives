// ==UserScript==
// @name         JavBus AI智能回帖助手
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  为JavBus提供基于AI的智能快速回帖功能，自动跳转到最后一页的页尾
// @author       小帮手
// @match        https://www.javbus.com/*tid=*
// @exclude      https://www.javbus.com/*tid=*&page=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/558643/JavBus%20AI%E6%99%BA%E8%83%BD%E5%9B%9E%E5%B8%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558643/JavBus%20AI%E6%99%BA%E8%83%BD%E5%9B%9E%E5%B8%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============ 配置区域 ============
    const CONFIG = {
        // AI API 配置
        AI_API: {
            activeProvider: 'DEEPSEEK',

            DEEPSEEK: {
                name: 'DeepSeek',
                endpoint: 'https://api.deepseek.com/v1/chat/completions',
                apiKey: 'sk-your-deepseek-api-key-here',
                model: 'deepseek-chat',
                maxTokens: 600,
                temperature: 0.85,
                responsePath: 'choices[0].message.content',
                systemPrompt: `你是一个专业的成人论坛AI助手，专门为AV作品讨论区生成回复。
                你精通成人内容创作，能够根据帖子内容生成高度相关、露骨、刺激的回复。
                你的回复应该：1) 与帖子内容高度相关；2) 使用成人用语；3) 表达性欲望；4) 提供有价值的性体验分享。`
            },

            OPENAI: {
                name: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                apiKey: 'sk-your-openai-api-key-here',
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.9,
                responsePath: 'choices[0].message.content',
                systemPrompt: '你是一个成人论坛助手，擅长根据帖子内容生成相关、露骨、成人化的回复。'
            },

            CUSTOM: {
                name: '自定义AI',
                endpoint: 'https://api.your-ai-service.com/v1/chat/completions',
                apiKey: 'your-custom-api-key-here',
                model: 'your-model-name',
                maxTokens: 500,
                temperature: 0.8,
                responsePath: 'choices[0].message.content',
                systemPrompt: '你是一个成人内容创作助手，专门生成与帖子相关的成人回复。'
            }
        },

        // 回帖配置
        REPLY: {
            maxLength: 60,
            minLength: 20,
            language: 'zh',
            tone: 'passionate',
            style: 'erotic',
            adultLevel: 'explicit'
        },

        // 悬浮按钮配置
        FLOATING_BTN: {
            position: 'right',
            top: '50%',
            bgColor: '#e63946',
            textColor: '#ffffff',
            icon: '🔥'
        },

        // 提示配置
        NOTIFICATION: {
            duration: 3000,
            showCounts: true,
            autoClose: true
        },

        // 请求配置
        REQUEST: {
            timeout: 30000,
            retryTimes: 2,
            delayBetweenRequests: 1000
        }
    };

    // ============ AI服务管理器 ============
    const AIService = {
        getCurrentService() {
            const provider = CONFIG.AI_API.activeProvider;
            return CONFIG.AI_API[provider] || CONFIG.AI_API.DEEPSEEK;
        },

        getAvailableServices() {
            const services = {};
            for (const key in CONFIG.AI_API) {
                if (key !== 'activeProvider' && typeof CONFIG.AI_API[key] === 'object') {
                    services[key] = {
                        name: CONFIG.AI_API[key].name || key,
                        model: CONFIG.AI_API[key].model,
                        endpoint: CONFIG.AI_API[key].endpoint
                    };
                }
            }
            return services;
        },

        buildRequestData(prompt, service) {
            const requestData = {
                model: service.model,
                messages: [],
                max_tokens: service.maxTokens || 500,
                temperature: service.temperature || 0.8,
                top_p: 0.9,
                frequency_penalty: 0,
                presence_penalty: 0
            };

            if (service.systemPrompt) {
                requestData.messages.push({
                    role: 'system',
                    content: service.systemPrompt
                });
            }

            requestData.messages.push({
                role: 'user',
                content: prompt
            });

            return requestData;
        },

        parseResponse(response, service) {
            try {
                let content = '';

                if (typeof response === 'string') {
                    response = JSON.parse(response);
                }

                const possiblePaths = [
                    'choices[0].message.content',
                    'result',
                    'response',
                    'content',
                    'text'
                ];

                for (const path of possiblePaths) {
                    try {
                        const value = this.getNestedValue(response, path);
                        if (value && typeof value === 'string' && value.trim().length > 10) {
                            content = value.trim();
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!content) {
                    content = this.findContentInResponse(response);
                }

                if (!content) {
                    throw new Error('无法从响应中提取内容');
                }

                return content;
            } catch (error) {
                console.error('解析响应失败:', error, '原始响应:', response);
                throw new Error(`解析AI响应失败: ${error.message}`);
            }
        },

        getNestedValue(obj, path) {
            const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.');
            let current = obj;

            for (const part of parts) {
                if (current == null) return undefined;
                current = current[part];
            }

            return current;
        },

        findContentInResponse(obj) {
            if (typeof obj === 'string') {
                return obj.length > 10 ? obj : null;
            }

            if (Array.isArray(obj)) {
                for (const item of obj) {
                    const result = this.findContentInResponse(item);
                    if (result) return result;
                }
            } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    const result = this.findContentInResponse(obj[key]);
                    if (result) return result;
                }
            }

            return null;
        },

        buildHeaders(service) {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            if (service.apiKey) {
                headers['Authorization'] = `Bearer ${service.apiKey}`;
            }

            return headers;
        }
    };

    // ============ 存储管理 ============
    const Storage = {
        getCommentedPosts() {
            try {
                const posts = GM_getValue('commented_posts', '[]');
                return JSON.parse(posts);
            } catch (e) {
                console.error('读取已评论帖子失败:', e);
                return [];
            }
        },

        addCommentedPost(postId) {
            try {
                const posts = this.getCommentedPosts();
                if (!posts.includes(postId)) {
                    posts.push(postId);
                    GM_setValue('commented_posts', JSON.stringify(posts));
                    this.updateCounter();
                }
            } catch (e) {
                console.error('添加已评论帖子失败:', e);
            }
        },

        hasCommented(postId) {
            if (!postId || postId === 'undefined' || postId === 'null') return false;
            const posts = this.getCommentedPosts();
            return posts.includes(postId);
        },

        getNotifiedPosts() {
            try {
                const posts = GM_getValue('notified_posts', '[]');
                return JSON.parse(posts);
            } catch (e) {
                console.error('读取已通知帖子失败:', e);
                return [];
            }
        },

        addNotifiedPost(postId) {
            try {
                const posts = this.getNotifiedPosts();
                if (!posts.includes(postId)) {
                    posts.push(postId);
                    GM_setValue('notified_posts', JSON.stringify(posts));
                }
            } catch (e) {
                console.error('添加已通知帖子失败:', e);
            }
        },

        updateCounter() {
            try {
                const counter = document.getElementById('ai-reply-count');
                if (counter) {
                    counter.textContent = this.getCommentedPosts().length;
                }
            } catch (e) {
                console.error('更新计数器失败:', e);
            }
        },

        getApiStats() {
            try {
                return JSON.parse(GM_getValue('api_stats', '{"totalCalls":0,"successCalls":0,"failedCalls":0}'));
            } catch (e) {
                console.error('读取API统计失败:', e);
                return { totalCalls: 0, successCalls: 0, failedCalls: 0 };
            }
        },

        updateApiStats(success = true) {
            try {
                const stats = this.getApiStats();
                stats.totalCalls++;
                if (success) {
                    stats.successCalls++;
                } else {
                    stats.failedCalls++;
                }
                GM_setValue('api_stats', JSON.stringify(stats));
            } catch (e) {
                console.error('更新API统计失败:', e);
            }
        },

        saveUserConfig(key, value) {
            try {
                const config = JSON.parse(GM_getValue('user_config', '{}'));
                config[key] = value;
                GM_setValue('user_config', JSON.stringify(config));
            } catch (e) {
                console.error('保存用户配置失败:', e);
            }
        },

        getUserConfig(key, defaultValue = null) {
            try {
                const config = JSON.parse(GM_getValue('user_config', '{}'));
                return key in config ? config[key] : defaultValue;
            } catch (e) {
                console.error('读取用户配置失败:', e);
                return defaultValue;
            }
        },

        // 清除所有记录
        clearAll() {
            try {
                GM_setValue('commented_posts', '[]');
                GM_setValue('notified_posts', '[]');
                GM_setValue('api_stats', JSON.stringify({ totalCalls: 0, successCalls: 0, failedCalls: 0 }));
                GM_setValue('user_config', '{}');
                GM_setValue('ai_auto_scroll', false);
                GM_setValue('ai_scroll_post_id', '');

                CONFIG.AI_API.activeProvider = 'DEEPSEEK';

                this.updateCounter();
                updateApiStatsDisplay();

                console.log('所有记录已清除');
            } catch (e) {
                console.error('清除记录失败:', e);
            }
        },

        // 设置自动滚动标记
        setAutoScroll(postId) {
            try {
                GM_setValue('ai_auto_scroll', true);
                GM_setValue('ai_scroll_post_id', postId);
                console.log('设置自动滚动标记，帖子ID:', postId);
            } catch (e) {
                console.error('设置滚动标记失败:', e);
            }
        },

        // 检查是否需要自动滚动
        shouldAutoScroll(postId) {
            try {
                const shouldScroll = GM_getValue('ai_auto_scroll', false);
                const scrollPostId = GM_getValue('ai_scroll_post_id', '');
                return shouldScroll && scrollPostId === postId;
            } catch (e) {
                console.error('检查滚动标记失败:', e);
                return false;
            }
        },

        // 清除滚动标记
        clearAutoScroll() {
            try {
                GM_setValue('ai_auto_scroll', false);
                GM_setValue('ai_scroll_post_id', '');
                console.log('清除滚动标记');
            } catch (e) {
                console.error('清除滚动标记失败:', e);
            }
        }
    };

    // ============ 悬浮按钮 ============
    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.id = 'ai-reply-btn';
        const currentService = AIService.getCurrentService();

        btn.innerHTML = `
            <div class="ai-reply-btn-main">
                <span class="ai-reply-icon">${CONFIG.FLOATING_BTN.icon}</span>
                <span class="ai-reply-text">AI回帖</span>
                <span class="ai-service-badge">${currentService.name || CONFIG.AI_API.activeProvider}</span>
            </div>
            <div class="ai-reply-stats">
                <div>已评论: <span id="ai-reply-count">${Storage.getCommentedPosts().length}</span></div>
                <div class="ai-stats-small" id="ai-api-stats"></div>
            </div>
            <div class="ai-control-panel" id="ai-control-panel">
                <div class="ai-control-title">AI回帖助手</div>
                <div class="ai-control-section">
                    <div class="ai-control-label">AI服务:</div>
                    <select id="ai-service-select" class="ai-control-select">
                        ${Object.entries(AIService.getAvailableServices()).map(([key, service]) =>
                            `<option value="${key}" ${key === CONFIG.AI_API.activeProvider ? 'selected' : ''}>
                                ${service.name}
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="ai-control-section">
                    <button id="ai-config-btn" class="ai-control-button">配置API</button>
                    <button id="ai-clear-btn" class="ai-control-button">清除记录</button>
                </div>
                <div class="ai-control-section">
                    <button id="ai-help-btn" class="ai-control-button help">使用说明</button>
                </div>
            </div>
        `;

        // 添加样式
        GM_addStyle(`
            #ai-reply-btn {
                position: fixed;
                ${CONFIG.FLOATING_BTN.position}: 20px;
                top: ${CONFIG.FLOATING_BTN.top};
                transform: translateY(-50%);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                user-select: none;
            }

            .ai-reply-btn-main {
                background: linear-gradient(135deg, ${CONFIG.FLOATING_BTN.bgColor}, #b91d1d);
                color: ${CONFIG.FLOATING_BTN.textColor};
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(230, 57, 70, 0.4);
                transition: all 0.3s ease;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 120px;
                gap: 8px;
                border: none;
                outline: none;
                position: relative;
            }

            .ai-service-badge {
                background: rgba(255,255,255,0.2);
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 500;
            }

            .ai-reply-btn-main:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 8px 25px rgba(230, 57, 70, 0.5);
            }

            .ai-reply-btn-main:active {
                transform: translateY(0) scale(0.98);
            }

            .ai-reply-btn-main.disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .ai-control-panel {
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 10px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                padding: 16px;
                min-width: 280px;
                z-index: 10000;
                border: 1px solid #e5e7eb;
                animation: slideDown 0.2s ease;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .ai-control-title {
                font-weight: 600;
                color: #111827;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e5e7eb;
            }

            .ai-control-section {
                margin-bottom: 12px;
            }

            .ai-control-label {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 4px;
            }

            .ai-control-select {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                background: white;
                color: #374151;
                outline: none;
                transition: border-color 0.2s;
            }

            .ai-control-select:hover {
                border-color: #9ca3af;
            }

            .ai-control-select:focus {
                border-color: #e63946;
                box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
            }

            .ai-control-button {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: #f9fafb;
                color: #374151;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 8px;
            }

            .ai-control-button:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }

            .ai-control-button.help {
                background: #eff6ff;
                color: #1d4ed8;
                border-color: #93c5fd;
            }

            .ai-control-button.help:hover {
                background: #dbeafe;
            }

            .ai-reply-stats {
                margin-top: 8px;
                background: rgba(255,255,255,0.95);
                padding: 8px 12px;
                border-radius: 12px;
                font-size: 12px;
                color: #4b5563;
                text-align: center;
                backdrop-filter: blur(10px);
                border: 1px solid #e5e7eb;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .ai-stats-small {
                font-size: 10px;
                color: #6b7280;
                margin-top: 2px;
            }

            /* 通知样式 */
            .ai-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 350px;
                border-left: 5px solid #e63946;
                animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .ai-notification.error {
                border-color: #ef4444;
            }

            .ai-notification.success {
                border-color: #10b981;
            }

            .ai-notification.warning {
                border-color: #f59e0b;
            }

            .ai-notification.info {
                border-color: #3b82f6;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%) translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0) translateY(0);
                    opacity: 1;
                }
            }

            /* 模态框样式 */
            .ai-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.2s ease;
            }

            .ai-modal-content {
                background: white;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .ai-modal-title {
                margin: 0 0 16px 0;
                color: #111827;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ai-modal-body {
                color: #4b5563;
                line-height: 1.6;
                margin-bottom: 24px;
            }

            .ai-preview-box {
                background: #f9fafb;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
                border: 1px solid #e5e7eb;
                max-height: 200px;
                overflow-y: auto;
                white-space: pre-wrap;
                word-break: break-word;
                font-size: 14px;
                line-height: 1.5;
            }

            .ai-preview-stats {
                font-size: 12px;
                color: #6b7280;
                margin-top: 8px;
                text-align: right;
            }

            .ai-modal-footer {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }

            .ai-button {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                min-width: 80px;
            }

            .ai-button-primary {
                background: #e63946;
                color: white;
            }

            .ai-button-primary:hover {
                background: #d90429;
                transform: translateY(-1px);
            }

            .ai-button-secondary {
                background: #f3f4f6;
                color: #374151;
            }

            .ai-button-secondary:hover {
                background: #e5e7eb;
            }

            /* 配置表单样式 */
            .ai-config-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .ai-config-field {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .ai-config-label {
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .ai-config-input {
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .ai-config-input:focus {
                outline: none;
                border-color: #e63946;
                box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
            }

            .ai-config-help {
                font-size: 12px;
                color: #6b7280;
                margin-top: 2px;
            }

            /* 加载动画 */
            .ai-loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes modalSlideIn {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `);

        document.body.appendChild(btn);

        updateApiStatsDisplay();

        btn.querySelector('.ai-reply-btn-main').addEventListener('click', handleQuickReply);

        btn.querySelector('.ai-reply-btn-main').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const panel = document.getElementById('ai-control-panel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#ai-control-panel') && !e.target.closest('.ai-reply-btn-main')) {
                const panel = document.getElementById('ai-control-panel');
                if (panel) panel.style.display = 'none';
            }
        });

        const serviceSelect = document.getElementById('ai-service-select');
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => {
                const newProvider = e.target.value;
                CONFIG.AI_API.activeProvider = newProvider;
                Storage.saveUserConfig('activeProvider', newProvider);

                const currentService = AIService.getCurrentService();
                const badge = btn.querySelector('.ai-service-badge');
                if (badge) {
                    badge.textContent = currentService.name || newProvider;
                }

                showNotification('AI服务切换', `已切换到: ${currentService.name || newProvider}`, 'info');
            });
        }

        document.getElementById('ai-config-btn').addEventListener('click', showConfigModal);

        document.getElementById('ai-clear-btn').addEventListener('click', () => {
            showModal({
                title: '清除记录',
                content: '确定要清除所有评论记录和统计吗？此操作不可撤销。',
                type: 'warning',
                cancelText: '取消',
                confirmText: '确定清除',
                onConfirm: () => {
                    Storage.clearAll();
                    updateApiStatsDisplay();

                    const currentService = AIService.getCurrentService();
                    const badge = btn.querySelector('.ai-service-badge');
                    if (badge) {
                        badge.textContent = currentService.name || CONFIG.AI_API.activeProvider;
                    }

                    showNotification('记录已清除', '所有评论记录和统计已重置', 'success');
                }
            });
        });

        document.getElementById('ai-help-btn').addEventListener('click', showHelpModal);

        return btn;
    }

    // ============ 通知系统 ============
    function showNotification(title, message, type = 'info') {
        const icons = {
            error: '❌',
            success: '✅',
            warning: '⚠️',
            info: '💡'
        };

        const notification = document.createElement('div');
        notification.className = `ai-notification ${type}`;
        notification.innerHTML = `
            <div class="ai-notification-icon">${icons[type]}</div>
            <div class="ai-notification-content">
                <div class="ai-notification-title">${title}</div>
                <div class="ai-notification-message">${message}</div>
            </div>
        `;

        document.body.appendChild(notification);

        if (CONFIG.NOTIFICATION.autoClose) {
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%) translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, CONFIG.NOTIFICATION.duration);
        }

        return notification;
    }

    // ============ 弹窗系统 ============
    function showModal(options) {
        const {
            title = '提示',
            content = '',
            type = 'info',
            showPreview = false,
            previewText = '',
            onConfirm = null,
            onCancel = null,
            confirmText = '确定',
            cancelText = '取消'
        } = options;

        const modal = document.createElement('div');
        modal.className = 'ai-modal';

        let previewHtml = '';
        if (showPreview && previewText) {
            previewHtml = `
                <div class="ai-preview-box">${previewText.replace(/\n/g, '<br>')}</div>
                <div class="ai-preview-stats">
                    字数: ${previewText.length} | 字符数: ${previewText.replace(/[\s\n]/g, '').length}
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="ai-modal-content">
                <h3 class="ai-modal-title">
                    <span class="ai-modal-icon">${type === 'warning' ? '⚠️' : '💬'}</span>
                    ${title}
                </h3>
                <div class="ai-modal-body">
                    ${content}
                    ${previewHtml}
                </div>
                <div class="ai-modal-footer">
                    ${onCancel ? `<button class="ai-button ai-button-secondary" id="ai-modal-cancel">${cancelText}</button>` : ''}
                    ${onConfirm ? `<button class="ai-button ai-button-primary" id="ai-modal-confirm">${confirmText}</button>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        if (onCancel) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    onCancel();
                    closeModal(modal);
                }
            });
        }

        if (onCancel) {
            modal.querySelector('#ai-modal-cancel').addEventListener('click', () => {
                onCancel();
                closeModal(modal);
            });
        }

        if (onConfirm) {
            modal.querySelector('#ai-modal-confirm').addEventListener('click', () => {
                onConfirm();
                closeModal(modal);
            });
        }

        return modal;
    }

    function closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }

    // ============ 配置弹窗 ============
    function showConfigModal() {
        const currentService = AIService.getCurrentService();
        const provider = CONFIG.AI_API.activeProvider;

        const modal = document.createElement('div');
        modal.className = 'ai-modal';

        modal.innerHTML = `
            <div class="ai-modal-content">
                <h3 class="ai-modal-title">AI服务配置 - ${currentService.name || provider}</h3>
                <div class="ai-config-form">
                    <div class="ai-config-field">
                        <label class="ai-config-label">API端点 (Endpoint)</label>
                        <input type="text" id="config-endpoint" class="ai-config-input"
                               value="${currentService.endpoint || ''}"
                               placeholder="https://api.example.com/v1/chat/completions">
                        <div class="ai-config-help">AI服务的API地址，必须包含完整URL</div>
                    </div>

                    <div class="ai-config-field">
                        <label class="ai-config-label">API密钥</label>
                        <input type="password" id="config-apikey" class="ai-config-input"
                               value="${currentService.apiKey || ''}"
                               placeholder="输入你的API密钥">
                        <div class="ai-config-help">请妥善保管你的API密钥</div>
                    </div>

                    <div class="ai-config-field">
                        <label class="ai-config-label">模型名称</label>
                        <input type="text" id="config-model" class="ai-config-input"
                               value="${currentService.model || ''}"
                               placeholder="如: gpt-3.5-turbo, deepseek-chat">
                        <div class="ai-config-help">要使用的AI模型名称</div>
                    </div>

                    <div class="ai-config-field">
                        <label class="ai-config-label">最大令牌数</label>
                        <input type="number" id="config-maxtokens" class="ai-config-input"
                               value="${currentService.maxTokens || 500}"
                               min="50" max="2000">
                        <div class="ai-config-help">控制生成文本的最大长度，建议300-600</div>
                    </div>

                    <div class="ai-config-field">
                        <label class="ai-config-label">温度 (Temperature)</label>
                        <input type="number" id="config-temperature" class="ai-config-input"
                               value="${currentService.temperature || 0.8}"
                               min="0" max="2" step="0.1">
                        <div class="ai-config-help">值越高越随机(0.8-1.2)，值越低越确定(0.1-0.5)</div>
                    </div>

                    <div class="ai-modal-footer">
                        <button class="ai-button ai-button-secondary" id="config-cancel">取消</button>
                        <button class="ai-button ai-button-primary" id="config-save">保存配置</button>
                        <button class="ai-button" id="config-test" style="background:#f59e0b;color:white;">测试连接</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#config-cancel').addEventListener('click', () => {
            closeModal(modal);
        });

        modal.querySelector('#config-save').addEventListener('click', () => {
            const endpoint = document.getElementById('config-endpoint').value.trim();
            const apiKey = document.getElementById('config-apikey').value.trim();
            const model = document.getElementById('config-model').value.trim();
            const maxTokens = parseInt(document.getElementById('config-maxtokens').value);
            const temperature = parseFloat(document.getElementById('config-temperature').value);

            if (!endpoint || !apiKey || !model) {
                showNotification('配置错误', '请填写所有必填字段', 'error');
                return;
            }

            CONFIG.AI_API[provider] = {
                ...CONFIG.AI_API[provider],
                endpoint,
                apiKey,
                model,
                maxTokens: maxTokens || 500,
                temperature: temperature || 0.8
            };

            Storage.saveUserConfig(`ai_config_${provider}`, CONFIG.AI_API[provider]);

            const badge = document.querySelector('.ai-service-badge');
            if (badge) {
                badge.textContent = CONFIG.AI_API[provider].name || provider;
            }

            showNotification('配置保存', 'AI服务配置已保存', 'success');
            closeModal(modal);
        });

        modal.querySelector('#config-test').addEventListener('click', async () => {
            const endpoint = document.getElementById('config-endpoint').value.trim();
            const apiKey = document.getElementById('config-apikey').value.trim();
            const model = document.getElementById('config-model').value.trim();

            if (!endpoint || !apiKey) {
                showNotification('测试失败', '请先填写API端点和密钥', 'error');
                return;
            }

            const testBtn = modal.querySelector('#config-test');
            const originalText = testBtn.textContent;
            testBtn.textContent = '测试中...';
            testBtn.disabled = true;

            try {
                const testResponse = await testAIConnection(endpoint, apiKey, model);
                showNotification('测试成功', 'AI服务连接正常！', 'success');
            } catch (error) {
                showNotification('测试失败', error.message, 'error');
            } finally {
                testBtn.textContent = originalText;
                testBtn.disabled = false;
            }
        });
    }

    // ============ 帮助弹窗 ============
    function showHelpModal() {
        const services = AIService.getAvailableServices();

        const modal = document.createElement('div');
        modal.className = 'ai-modal';

        modal.innerHTML = `
            <div class="ai-modal-content">
                <h3 class="ai-modal-title">使用说明</h3>
                <div class="ai-modal-body" style="line-height: 1.6;">
                    <h4>📌 功能说明</h4>
                    <p>本脚本可以自动生成与帖子内容相关的成人AI评论并回复JavBus论坛的帖子，自动跳转到最后一页的页尾。</p>

                    <h4>🔄 使用方法</h4>
                    <ol>
                        <li>进入任意帖子页面</li>
                        <li><strong>左键点击</strong>悬浮按钮：生成成人AI评论</li>
                        <li><strong>右键点击</strong>悬浮按钮：打开控制面板</li>
                        <li>使用 <strong>Alt+R</strong> 快捷键快速调用</li>
                        <li>发表评论后会自动跳转到最后一页的页尾</li>
                    </ol>

                    <h4>⚙️ 支持的AI服务</h4>
                    <ul>
                        ${Object.entries(services).map(([key, service]) => `
                            <li><strong>${service.name}</strong>: ${service.model}</li>
                        `).join('')}
                    </ul>

                    <h4>🔧 配置说明</h4>
                    <p><strong>DeepSeek配置示例：</strong></p>
                    <ul>
                        <li>端点: https://api.deepseek.com/v1/chat/completions</li>
                        <li>模型: deepseek-chat</li>
                        <li>密钥: 从DeepSeek官网获取</li>
                    </ul>

                    <p><strong>注意：本脚本专门用于生成与帖子内容相关的成人内容回复。</strong></p>
                </div>
                <div class="ai-modal-footer">
                    <button class="ai-button ai-button-primary" id="help-close">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#help-close').addEventListener('click', () => {
            closeModal(modal);
        });
    }

    // ============ API统计显示 ============
    function updateApiStatsDisplay() {
        const stats = Storage.getApiStats();
        const statsElement = document.getElementById('ai-api-stats');
        if (statsElement) {
            const successRate = stats.totalCalls > 0 ?
                Math.round((stats.successCalls / stats.totalCalls) * 100) : 100;
            statsElement.textContent = `成功率: ${successRate}% (${stats.totalCalls}次)`;
        }
    }

    // ============ AI连接测试 ============
    async function testAIConnection(endpoint, apiKey, model) {
        return new Promise((resolve, reject) => {
            const testData = {
                model: model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: '请回复"Hello World"来测试连接。'
                    }
                ],
                max_tokens: 10,
                temperature: 0.1
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                },
                data: JSON.stringify(testData),
                timeout: 10000,
                onload: function(response) {
                    console.log('测试连接响应:', response);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.choices && data.choices[0]) {
                                resolve('连接成功，API响应正常');
                            } else {
                                resolve('连接成功，但响应格式可能不正确');
                            }
                        } catch (e) {
                            resolve('连接成功，但响应解析失败');
                        }
                    } else if (response.status === 401) {
                        reject(new Error('API密钥无效或已过期'));
                    } else if (response.status === 404) {
                        reject(new Error('API端点不存在或模型不可用'));
                    } else if (response.status === 429) {
                        reject(new Error('请求过于频繁，请稍后重试'));
                    } else if (response.status === 400) {
                        reject(new Error('请求参数错误，请检查模型名称和参数'));
                    } else {
                        reject(new Error(`连接失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`网络错误: ${error.message}`));
                },
                ontimeout: function() {
                    reject(new Error('连接超时，请检查网络或API端点'));
                }
            });
        });
    }

    // ============ AI调用函数 ============
    async function generateAIComment(postContent) {
        const service = AIService.getCurrentService();

        if (!service || !service.apiKey || service.apiKey.includes('your-') || service.apiKey.includes('YOUR_')) {
            throw new Error('请先配置AI API密钥');
        }

        const prompt = buildPrompt(postContent);
        let lastError = null;

        for (let attempt = 0; attempt <= CONFIG.REQUEST.retryTimes; attempt++) {
            try {
                if (attempt > 0) {
                    showNotification('重试中', `第 ${attempt} 次重试...`, 'warning');
                    await delay(CONFIG.REQUEST.delayBetweenRequests);
                }

                const response = await callAIService(service, prompt);
                const comment = AIService.parseResponse(response, service);

                const validatedComment = validateAndCleanComment(comment);

                Storage.updateApiStats(true);
                updateApiStatsDisplay();
                return validatedComment;

            } catch (error) {
                lastError = error;
                console.error(`AI调用失败 (尝试 ${attempt + 1}/${CONFIG.REQUEST.retryTimes + 1}):`, error);

                if (attempt === CONFIG.REQUEST.retryTimes) {
                    Storage.updateApiStats(false);
                    updateApiStatsDisplay();
                    throw error;
                }
            }
        }

        throw lastError;
    }

    function buildPrompt(postContent) {
        const { maxLength, minLength, language } = CONFIG.REPLY;

        const languageMap = {
            zh: '简体中文',
            en: 'English',
            ja: '日本語'
        };

        // 提取关键信息
        const keywords = extractKeywords(postContent);

        // 分析帖子类型
        const postType = analyzePostType(postContent);

        // 清理帖子内容
        const cleanContent = postContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

        const content = cleanContent.substring(0, 2000);

        return `你是一个专业的成人论坛AI助手，专门为AV作品讨论区生成回复。

【帖子原文内容】
${content}

【帖子类型分析】
${postType}

【帖子关键词】
${keywords.join('、')}

【回复生成要求】
1. 语言：使用${languageMap[language] || '简体中文'}
2. 字数：${minLength}-${maxLength}字之间
3. 回复必须与帖子内容高度相关，基于帖子中的具体信息
4. 使用成人用语，表达对作品或女优的性欲望
5. 结合自己的性体验或性幻想进行回复
6. 回复要具体、有针对性，不能是通用的套话
7. 可以提问或分享相关经验
8. 语气热情、直接、露骨

【具体回复方向】
- 如果帖子讨论特定女优：评论该女优的特点、作品、你的性幻想
- 如果帖子讨论特定作品：评论该作品的剧情、场景、你的观看体验
- 如果帖子是求助或提问：提供具体的成人建议或分享相关经验
- 如果帖子是分享资源：表达感谢并分享你的使用感受或性幻想
- 如果帖子是讨论技术或技巧：分享你的成人经验或技巧

【禁止事项】
- 不要使用"请"、"谢谢"等过度礼貌用语
- 不要有开头的问候语
- 不要使用表情符号
- 不要引用原帖的完整内容
- 不要生成与帖子无关的内容
- 结尾不要使用标点符号

请生成一个与帖子内容高度相关、具体、成人化的论坛回复。`;
    }

    function extractKeywords(content) {
        // 提取关键词的简单实现
        const commonWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];

        const words = content
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1 && !commonWords.includes(word));

        // 去重并取前10个
        return [...new Set(words)].slice(0, 10);
    }

    function analyzePostType(content) {
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('求') || lowerContent.includes('找') || lowerContent.includes('求助') || lowerContent.includes('寻找')) {
            return '求助帖：用户在寻找特定资源或信息';
        } else if (lowerContent.includes('分享') || lowerContent.includes('资源') || lowerContent.includes('下载') || lowerContent.includes('链接')) {
            return '资源分享帖：用户在分享或请求资源';
        } else if (lowerContent.includes('女优') || lowerContent.includes('演员') || lowerContent.includes('明星')) {
            return '女优讨论帖：用户在讨论特定AV女优';
        } else if (lowerContent.includes('作品') || lowerContent.includes('番号') || lowerContent.includes('车牌')) {
            return '作品讨论帖：用户在讨论特定AV作品';
        } else if (lowerContent.includes('经验') || lowerContent.includes('技巧') || lowerContent.includes('方法') || lowerContent.includes('怎么')) {
            return '经验技巧帖：用户在分享或请求成人经验技巧';
        } else if (lowerContent.includes('推荐') || lowerContent.includes('有什么') || lowerContent.includes('哪些')) {
            return '推荐请求帖：用户在请求推荐';
        } else {
            return '一般讨论帖：用户在讨论成人相关话题';
        }
    }

    async function callAIService(service, prompt) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('AI服务请求超时'));
            }, CONFIG.REQUEST.timeout);

            const requestData = AIService.buildRequestData(prompt, service);

            console.log('发送AI请求:', {
                endpoint: service.endpoint,
                model: service.model,
                maxTokens: service.maxTokens
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: service.endpoint,
                headers: AIService.buildHeaders(service),
                data: JSON.stringify(requestData),
                onload: function(response) {
                    clearTimeout(timeout);

                    console.log('AI响应状态:', response.status);

                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200) {
                            console.log('AI响应成功:', data);
                            resolve(data);
                        } else if (response.status === 401) {
                            reject(new Error('API密钥无效，请检查配置'));
                        } else if (response.status === 429) {
                            reject(new Error('请求过于频繁，请稍后重试'));
                        } else if (response.status === 400) {
                            const errorMsg = data.error?.message || '请求参数错误';
                            reject(new Error(`请求错误: ${errorMsg}。请检查模型名称和参数配置`));
                        } else if (response.status >= 500) {
                            reject(new Error('AI服务器错误，请稍后重试'));
                        } else {
                            reject(new Error(`AI服务错误: ${response.status} ${data.error?.message || response.statusText}`));
                        }
                    } catch (parseError) {
                        console.error('响应解析失败:', response.responseText);
                        reject(new Error(`响应解析失败: ${parseError.message}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    reject(new Error(`网络错误: ${error.message}`));
                },
                ontimeout: function() {
                    reject(new Error('请求超时，请检查网络连接'));
                }
            });
        });
    }

    function validateAndCleanComment(comment) {
        let cleaned = comment
            .trim()
            .replace(/^["']|["']$/g, '')
            .replace(/^回复[:：]\s*/i, '')
            .replace(/^(好的|明白了|了解了|谢谢|感谢)[，,。.!！?？]\s*/i, '')
            .replace(/^```[\s\S]*?\n|```$/g, '')
            .replace(/【.*?】/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (cleaned.length < 10) {
            cleaned = comment.trim();
        }

        if (cleaned.length < CONFIG.REPLY.minLength) {
            throw new Error(`评论太短 (${cleaned.length}字)，请调整参数重试`);
        }

        if (cleaned.length > CONFIG.REPLY.maxLength) {
            const maxLen = CONFIG.REPLY.maxLength;
            let truncated = cleaned.substring(0, maxLen);

            const lastPunctuation = Math.max(
                truncated.lastIndexOf('。'),
                truncated.lastIndexOf('！'),
                truncated.lastIndexOf('？'),
                truncated.lastIndexOf('.'),
                truncated.lastIndexOf('!'),
                truncated.lastIndexOf('?'),
                truncated.lastIndexOf('，'),
                truncated.lastIndexOf(','),
                truncated.lastIndexOf(' '),
                truncated.lastIndexOf('\n')
            );

            if (lastPunctuation > maxLen * 0.7) {
                truncated = truncated.substring(0, lastPunctuation + 1);
            }

            cleaned = truncated;
        }

        return cleaned;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ============ 帖子处理函数 ============
    function getPostId() {
        try {
            const url = window.location.href;

            // 从URL参数获取tid
            const urlParams = new URLSearchParams(window.location.search);
            let tid = urlParams.get('tid');

            if (tid && tid !== 'undefined' && tid !== 'null') {
                console.log('从URL参数获取到tid:', tid);
                return tid;
            }

            // 从URL路径获取
            const pathMatch = url.match(/forum\/(\d+)/);
            if (pathMatch && pathMatch[1]) {
                console.log('从URL路径获取到tid:', pathMatch[1]);
                return pathMatch[1];
            }

            // 从页面元素获取
            const postElements = document.querySelectorAll('[id*="post"], [class*="post"], [name*="post"]');
            for (const element of postElements) {
                const idMatch = element.id?.match(/\d+/) ||
                               element.className?.match(/\d+/) ||
                               element.name?.match(/\d+/);
                if (idMatch && idMatch[0]) {
                    console.log('从页面元素获取到tid:', idMatch[0]);
                    return idMatch[0];
                }
            }

            // 生成基于时间的ID作为备用
            const fallbackId = 'tid_' + Date.now();
            console.log('使用备用tid:', fallbackId);
            return fallbackId;

        } catch (error) {
            console.error('获取帖子ID失败:', error);
            return 'tid_error_' + Date.now();
        }
    }

    function getPostContent() {
        const selectors = [
            'div.postmessage',
            'td.t_msgfont',
            'div#postmessage',
            'div.message',
            'div.content',
            'div.post_content',
            'div.reply_content',
            'div.thread_content',
            '[id^="post_"] div',
            '.viewthread .message',
            '.mainbox.viewthread .message',
            '.t_f'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.trim();
                if (text.length > 50 &&
                    !text.includes('返回列表') &&
                    !text.includes('上一主题') &&
                    !text.includes('下一主题') &&
                    !text.includes('发表于') &&
                    !text.includes('只看该作者')) {
                    console.log('找到帖子内容:', text.substring(0, 100) + '...');
                    return text;
                }
            }
        }

        const mainContent = document.querySelector('main') ||
                           document.querySelector('#content') ||
                           document.querySelector('.main') ||
                           document.body;

        const text = mainContent.textContent.trim();
        console.log('使用页面主要内容:', text.substring(0, 100) + '...');

        const lines = text.split('\n').filter(line => {
            return line.trim().length > 20 &&
                   !line.includes('导航') &&
                   !line.includes('菜单') &&
                   !line.includes('搜索') &&
                   !line.includes('登录') &&
                   !line.includes('注册') &&
                   !line.includes('发表于') &&
                   !line.includes('只看该作者');
        });

        return lines.join('\n').substring(0, 3000);
    }

    function canReply() {
        const replySelectors = [
            'textarea[name="message"]',
            'textarea#message',
            '#fastpostmessage',
            '.pt',
            '#postform textarea',
            'textarea.editor',
            'textarea.reply'
        ];

        for (const selector of replySelectors) {
            if (document.querySelector(selector)) {
                console.log('找到回复框:', selector);
                return true;
            }
        }

        const lockIndicators = [
            '锁定',
            '已关闭',
            '关闭回复',
            '本主题已关闭',
            'LOCKED',
            'Closed',
            '此主题已锁定'
        ];

        const pageText = document.body.textContent;
        for (const indicator of lockIndicators) {
            if (pageText.includes(indicator)) {
                console.log('帖子已锁定:', indicator);
                return false;
            }
        }

        console.log('未找到回复框，可能无法回复');
        return false;
    }

    function fillReply(content) {
        const replySelectors = [
            'textarea[name="message"]',
            'textarea#message',
            '#fastpostmessage',
            '.pt',
            '#postform textarea'
        ];

        for (const selector of replySelectors) {
            const textarea = document.querySelector(selector);
            if (textarea) {
                console.log('填充回复框:', selector, '内容长度:', content.length);
                textarea.value = content;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                return textarea;
            }
        }

        console.log('未找到回复框');
        return null;
    }

    function submitReply() {
        const submitSelectors = [
            'button[name="replysubmit"]',
            '#fastpostsubmit',
            '.pnpost button',
            'input[type="submit"][value="发表回复"]',
            'input[value="发表回复"]',
            'button:contains("发表回复")',
            'input[name="replysubmit"]',
            '.replybtn',
            '#postsubmit'
        ];

        for (const selector of submitSelectors) {
            try {
                const button = document.querySelector(selector);
                if (button) {
                    console.log('找到提交按钮:', selector);
                    button.click();
                    return true;
                }
            } catch (e) {
                console.error('提交按钮点击失败:', e);
            }
        }

        console.log('未找到提交按钮');
        return false;
    }

    // ============ 跳转到最后一页的页尾 ============
    function jumpToLastPageAndBottom() {
        console.log('开始跳转到最后一页的页尾');

        // 检查是否有多页
        const lastPage = getLastPageNumber();
        const currentPage = getCurrentPageNumber();

        console.log(`当前页码: ${currentPage}, 最后一页: ${lastPage}`);

        if (lastPage > 1 && currentPage < lastPage) {
            // 有多页且当前不是最后一页，跳转到最后一页
            console.log(`跳转到最后一页（第${lastPage}页）`);
            const lastPageUrl = getLastPageUrl();
            if (lastPageUrl) {
                // 在URL中添加标记，用于跳转后滚动到页尾
                const urlWithHash = lastPageUrl + '#ai-scroll-bottom';
                window.location.href = urlWithHash;
                return true;
            }
        } else if (lastPage === 1) {
            // 只有一页，刷新页面并滚动到页尾
            console.log('只有一页，刷新页面并滚动到页尾');
            window.location.reload();
            return true;
        } else {
            // 已经在最后一页，直接滚动到页尾
            console.log('已经在最后一页，直接滚动到页尾');
            scrollToBottom();
            return true;
        }

        return false;
    }

    function getLastPageNumber() {
        // 查找分页链接
        const paginationSelectors = [
            '.pg a',
            '.pages a',
            '.pagination a',
            '.page a',
            'a[href*="page="]',
            'a[href*="&page="]'
        ];

        let maxPage = 1;

        for (const selector of paginationSelectors) {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                const href = link.href;
                const pageMatch = href.match(/[?&]page=(\d+)/);
                if (pageMatch) {
                    const pageNum = parseInt(pageMatch[1], 10);
                    if (pageNum > maxPage) {
                        maxPage = pageNum;
                    }
                }

                // 检查"最后一页"文本
                const linkText = link.textContent.trim();
                if (linkText === '最后一页' || linkText === '末页' || linkText === 'Last') {
                    const pageMatch = href.match(/[?&]page=(\d+)/);
                    if (pageMatch) {
                        maxPage = parseInt(pageMatch[1], 10);
                    }
                }
            });
        }

        // 如果没有找到分页，检查分页文本显示
        const pageTextSelectors = ['.pg strong', '.pages strong', '.pagination strong', '.page strong'];
        for (const selector of pageTextSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                const match = text.match(/\d+\s*\/\s*(\d+)/);
                if (match) {
                    maxPage = parseInt(match[1], 10);
                }
            }
        }

        console.log('获取到最后一页页码:', maxPage);
        return maxPage;
    }

    function getCurrentPageNumber() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        return pageParam ? parseInt(pageParam, 10) : 1;
    }

    function getLastPageUrl() {
        // 查找最后一页链接
        const paginationSelectors = [
            '.pg a',
            '.pages a',
            '.pagination a',
            '.page a',
            'a[href*="page="]',
            'a[href*="&page="]'
        ];

        let lastPageUrl = null;
        let maxPage = 0;

        for (const selector of paginationSelectors) {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                const href = link.href;
                const pageMatch = href.match(/[?&]page=(\d+)/);
                if (pageMatch) {
                    const pageNum = parseInt(pageMatch[1], 10);
                    if (pageNum > maxPage) {
                        maxPage = pageNum;
                        lastPageUrl = href;
                    }
                }

                // 检查"最后一页"文本
                const linkText = link.textContent.trim();
                if (linkText === '最后一页' || linkText === '末页' || linkText === 'Last') {
                    lastPageUrl = href;
                }
            });
        }

        console.log('获取到最后一页URL:', lastPageUrl);
        return lastPageUrl;
    }

    function scrollToBottom() {
        console.log('跳转到页尾');
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });

        // 确保滚动到底部
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);

        // 再次确认滚动到底部
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 1000);
    }

    // ============ 检查是否需要自动滚动 ============
    function checkAutoScroll() {
        const postId = getPostId();
        const shouldScroll = Storage.shouldAutoScroll(postId);

        if (shouldScroll) {
            console.log('检测到需要自动滚动，帖子ID:', postId);

            // 检查URL中的hash标记
            const hash = window.location.hash;
            if (hash === '#ai-scroll-bottom') {
                console.log('URL中有滚动标记，执行滚动');
                // 清除URL中的hash
                history.replaceState(null, null, window.location.pathname + window.location.search);

                // 延迟执行滚动，确保页面完全加载
                setTimeout(() => {
                    scrollToBottom();
                    // 清除存储的标记
                    Storage.clearAutoScroll();
                }, 1000);
            } else {
                // 只有存储标记但没有URL标记，直接滚动
                setTimeout(() => {
                    scrollToBottom();
                    // 清除存储的标记
                    Storage.clearAutoScroll();
                }, 1500);
            }

            return true;
        }

        return false;
    }

    // ============ 主处理函数 ============
    async function handleQuickReply() {
        const postId = getPostId();
        console.log('当前帖子ID:', postId);
        const btn = document.querySelector('#ai-reply-btn .ai-reply-btn-main');

        if (btn.classList.contains('disabled')) return;
        btn.classList.add('disabled');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="ai-loading"></span>思考中...';

        try {
            console.log('开始处理回帖，帖子ID:', postId);

            // 检查是否已评论
            if (Storage.hasCommented(postId)) {
                const notified = Storage.getNotifiedPosts().includes(postId);
                if (!notified) {
                    showModal({
                        title: '提示',
                        content: '您已经评论过这个帖子了，避免重复灌水。',
                        type: 'warning',
                        onCancel: () => {
                            btn.classList.remove('disabled');
                            btn.innerHTML = originalHTML;
                        }
                    });
                    Storage.addNotifiedPost(postId);
                } else {
                    showNotification('操作提示', '您已经评论过这个帖子了。', 'info');
                    btn.classList.remove('disabled');
                    btn.innerHTML = originalHTML;
                }
                return;
            }

            // 检查是否可以回复
            if (!canReply()) {
                showNotification('无法回复', '当前帖子可能已被锁定或无法回复。', 'warning');
                btn.classList.remove('disabled');
                btn.innerHTML = originalHTML;
                return;
            }

            // 获取帖子内容
            btn.innerHTML = '<span class="ai-loading"></span>分析帖子...';
            const postContent = getPostContent();

            if (!postContent || postContent.length < 20) {
                throw new Error('无法获取足够的帖子内容，请确保在帖子页面使用');
            }

            console.log('帖子内容长度:', postContent.length);

            // 生成AI评论
            btn.innerHTML = '<span class="ai-loading"></span>生成评论...';
            const aiComment = await generateAIComment(postContent);

            console.log('生成的评论:', aiComment);

            // 显示预览
            btn.classList.remove('disabled');
            btn.innerHTML = originalHTML;

            showModal({
                title: 'AI生成的成人评论',
                content: '以下是AI根据帖子内容生成的成人评论：',
                type: 'info',
                showPreview: true,
                previewText: aiComment,
                cancelText: '取消',
                confirmText: '发表评论',
                onCancel: () => {
                    showNotification('操作取消', '评论未发表', 'info');
                },
                onConfirm: async () => {
                    // 填充回复
                    const textarea = fillReply(aiComment);
                    if (textarea) {
                        // 尝试自动提交
                        if (submitReply()) {
                            // 记录已评论
                            Storage.addCommentedPost(postId);

                            // 设置自动滚动标记
                            Storage.setAutoScroll(postId);

                            // 显示成功消息
                            showNotification('评论发表成功', '正在跳转到最后一页的页尾...', 'success');

                            // 等待片刻后执行跳转
                            setTimeout(() => {
                                jumpToLastPageAndBottom();
                            }, 500);
                        } else {
                            // 如果自动提交失败，提示用户手动提交
                            showModal({
                                title: '请手动提交',
                                content: '评论已填充到回复框，请手动点击发表按钮。提交后会自动跳转到最后一页的页尾。',
                                type: 'info',
                                confirmText: '好的',
                                onConfirm: () => {
                                    // 设置自动滚动标记
                                    Storage.setAutoScroll(postId);
                                    // 记录已评论（假设用户会手动提交）
                                    Storage.addCommentedPost(postId);
                                }
                            });
                        }
                    } else {
                        // 复制到剪贴板让用户手动粘贴
                        navigator.clipboard.writeText(aiComment).then(() => {
                            showModal({
                                title: '评论已复制',
                                content: `评论已复制到剪贴板：<br><br><div class="ai-preview-box">${aiComment.replace(/\n/g, '<br>')}</div><br>请手动粘贴到回复框中并提交。`,
                                type: 'info',
                                confirmText: '好的'
                            });
                        }).catch(() => {
                            showModal({
                                title: '评论已生成',
                                content: `生成的评论：<br><br><div class="ai-preview-box">${aiComment.replace(/\n/g, '<br>')}</div><br>请手动复制并粘贴到回复框中。`,
                                type: 'info',
                                confirmText: '好的'
                            });
                        });
                    }
                }
            });

        } catch (error) {
            btn.classList.remove('disabled');
            btn.innerHTML = originalHTML;

            console.error('回帖处理失败:', error);

            let errorMessage = error.message;

            if (errorMessage.includes('API密钥') || errorMessage.includes('配置')) {
                showModal({
                    title: '配置错误',
                    content: `
                        <strong>请先配置AI API密钥：</strong>
                        <ol>
                            <li>右键点击悬浮按钮打开控制面板</li>
                            <li>点击"配置API"按钮</li>
                            <li>填写你的AI服务配置信息</li>
                            <li>点击"测试连接"验证配置</li>
                        </ol>
                        <p><strong>DeepSeek配置示例：</strong></p>
                        <ul>
                            <li>端点: https://api.deepseek.com/v1/chat/completions</li>
                            <li>模型: deepseek-chat</li>
                            <li>密钥: 从DeepSeek官网获取</li>
                        </ul>
                    `,
                    type: 'error',
                    confirmText: '立即配置',
                    onConfirm: showConfigModal
                });
            } else if (errorMessage.includes('网络') || errorMessage.includes('超时')) {
                showNotification('网络错误', '请检查网络连接后重试', 'error');
            } else if (errorMessage.includes('频繁')) {
                showNotification('请求频繁', '请等待一会儿再试', 'warning');
            } else if (errorMessage.includes('请求参数错误')) {
                showModal({
                    title: '配置错误',
                    content: `AI服务配置可能有误：<br><br>${errorMessage}<br><br>请检查：<br>1. 模型名称是否正确<br>2. API端点是否完整<br>3. 参数配置是否合理`,
                    type: 'error',
                    confirmText: '重新配置',
                    onConfirm: showConfigModal
                });
            } else {
                showNotification('生成失败', errorMessage.substring(0, 100), 'error');
            }
        }
    }

    // ============ 初始化 ============
    function init() {
        // 加载用户保存的配置
        const savedProvider = Storage.getUserConfig('activeProvider');
        if (savedProvider && CONFIG.AI_API[savedProvider]) {
            CONFIG.AI_API.activeProvider = savedProvider;
        }

        // 加载各AI服务的用户配置
        for (const provider in CONFIG.AI_API) {
            if (provider !== 'activeProvider' && typeof CONFIG.AI_API[provider] === 'object') {
                const savedConfig = Storage.getUserConfig(`ai_config_${provider}`);
                if (savedConfig) {
                    CONFIG.AI_API[provider] = { ...CONFIG.AI_API[provider], ...savedConfig };
                }
            }
        }

        // 只在帖子页面显示按钮
        if (window.location.href.includes('/forum/')) {
            console.log('初始化AI回帖助手，当前页面:', window.location.href);

            createFloatingButton();

            // 添加快捷键 (Alt+R)
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 'r') {
                    e.preventDefault();
                    const btn = document.querySelector('#ai-reply-btn .ai-reply-btn-main');
                    if (btn && !btn.classList.contains('disabled')) {
                        btn.click();
                    }
                }
            });

            // 检查是否需要自动滚动
            setTimeout(() => {
                checkAutoScroll();
            }, 2000);

            // 显示欢迎提示
            setTimeout(() => {
                const currentService = AIService.getCurrentService();
                const apiKey = currentService.apiKey;
                if (!apiKey || apiKey.includes('your-') || apiKey.includes('YOUR_')) {
                    showModal({
                        title: '需要配置API',
                        content: `
                            <strong>请先配置AI服务才能使用：</strong>
                            <ol>
                                <li>右键点击悬浮按钮</li>
                                <li>选择"配置API"</li>
                                <li>填写你的AI服务信息</li>
                                <li>点击"测试连接"验证</li>
                            </ol>
                            <p><strong>DeepSeek推荐配置：</strong></p>
                            <ul>
                                <li>端点: https://api.deepseek.com/v1/chat/completions</li>
                                <li>模型: deepseek-chat</li>
                                <li>密钥: 访问 platform.deepseek.com 获取</li>
                            </ul>
                        `,
                        type: 'warning',
                        confirmText: '立即配置',
                        onConfirm: showConfigModal
                    });
                } else {
                    showNotification('AI回帖助手已就绪', 'Alt+R 快捷键激活，右键按钮打开设置', 'info');
                }
            }, 3000);
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
