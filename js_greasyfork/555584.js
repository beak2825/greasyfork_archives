// ==UserScript==
// @name         呱呱有声制作平台监测脚本
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  监测呱呱有声制作平台混音按钮点击和自动混音，自动通知本地播放器，支持SPA导航，可拖动浮动自动混音开关
// @license aresu
// @author       You
// @match        https://www.gstudios.com.cn/*
// @match        http://www.gstudios.com.cn/*
// @match        https://*.gstudios.com.cn/*
// @match        http://*.gstudios.com.cn/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/555584/%E5%91%B1%E5%91%B1%E6%9C%89%E5%A3%B0%E5%88%B6%E4%BD%9C%E5%B9%B3%E5%8F%B0%E7%9B%91%E6%B5%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555584/%E5%91%B1%E5%91%B1%E6%9C%89%E5%A3%B0%E5%88%B6%E4%BD%9C%E5%B9%B3%E5%8F%B0%E7%9B%91%E6%B5%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originalUnhandledRejectionHandler = window.onunhandledrejection;

    window.addEventListener('unhandledrejection', function (event) {
        
        if (event.reason && event.reason.stack &&
            (event.reason.stack.includes('gstudios.com.cn') ||
                event.reason.stack.includes('_nuxt'))) {

            console.warn('[呱呱监测器] 检测到平台错误，已忽略:', event.reason);

            event.preventDefault();
            return;
        }

        if (originalUnhandledRejectionHandler) {
            originalUnhandledRejectionHandler.call(window, event);
        }
    });

    const BrowserDetector = {
        isEdge: function () {
            return /Edg/.test(navigator.userAgent);
        },

        isChrome: function () {
            return /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
        },

        getVersion: function () {
            if (this.isEdge()) {
                const match = navigator.userAgent.match(/Edg\/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            } else if (this.isChrome()) {
                const match = navigator.userAgent.match(/Chrome\/(\d+)/);
                return match ? parseInt(match[1]) : 0;
            }
            return 0;
        },

        getBrowserName: function () {
            if (this.isEdge()) return 'Edge';
            if (this.isChrome()) return 'Chrome';
            return 'Unknown';
        },

        logBrowserInfo: function () {
            if (!CONFIG.showStartupInfo) return;

            console.log(
                '%c🐸 呱呱监测脚本 %cv1.7.3 %c已启动 %c[' + this.getBrowserName() + ' ' + this.getVersion() + ']',
                'color: #4CAF50; font-size: 13px; font-weight: bold;',
                'color: #2196F3; font-size: 11px;',
                'color: #666; font-size: 11px;',
                'color: #999; font-size: 10px;'
            );

            console.log(
                '%c💡 提示：%c 控制台已优化，默认只显示警告和错误',
                'color: #FF9800; font-weight: bold; font-size: 11px;',
                'color: #666; font-size: 11px;'
            );
            console.log(
                '%c   启用详细日志：%c CONFIG.logLevel = "error"; CONFIG.verboseLog = false;',
                'color: #2196F3; font-size: 10px;',
                'color: #4CAF50; font-family: monospace; font-size: 10px;'
            );

            if (this.isEdge()) {
                console.log(
                    '%c⚡ Edge浏览器兼容模式已启用',
                    'color: #FF9800; font-size: 11px;'
                );
            }
        }
    };

    const CONFIG = {
        playerUrl: 'http://127.0.0.1:5678/api/web_event',
        checkInterval: 2000, 
        fileCheckDelay: 5000, 
        maxWaitTime: 30000, 
        debug: true,
        logLevel: 'warn', 
        verboseLog: false, 
        showStartupInfo: false, 
        
        enableNativeTimeLog: false,
        enableWaveformTimeObserver: false,
        timeLogIntervalMs: 1000, 
        
        edgeCompatMode: BrowserDetector.isEdge(),
        edgeDOMWaitTime: BrowserDetector.isEdge() ? 15000 : 10000 
    };

    const LOG_KEYS = {
        NATIVE_TIME: 'native_time',
        WAVEFORM_TIME: 'waveform_time'
    };
    const lastLogTs = {};

    class EventQueue {
        constructor() {
            this.queue = [];
            this.maxSize = 50;
            this.processing = false;
            this.maxRetries = 3;
        }

        enqueue(event) {
            if (this.queue.length >= this.maxSize) {
                log('队列已满，丢弃最旧的事件', 'warning');
                this.queue.shift();
            }
            this.queue.push({
                event: event,
                timestamp: Date.now(),
                retries: 0
            });
            log(`📥 事件已加入队列 (队列长度: ${this.queue.length})`, 'info');
        }

        async processQueue() {
            if (this.processing || this.queue.length === 0) return;

            this.processing = true;
            log(`🔄 开始处理事件队列 (${this.queue.length} 个事件)`, 'info');

            while (this.queue.length > 0) {
                const item = this.queue[0];
                const success = await this.sendEvent(item.event);

                if (success) {
                    this.queue.shift();
                    log(`✅ 队列事件发送成功 (剩余: ${this.queue.length})`, 'success');
                } else {
                    item.retries++;
                    if (item.retries >= this.maxRetries) {
                        log(`事件发送失败次数过多，丢弃 (重试: ${item.retries}/${this.maxRetries})`, 'error');
                        this.queue.shift();
                    } else {
                        log(`队列事件发送失败，稍后重试 (${item.retries}/${this.maxRetries})`, 'warning');
                        break; 
                    }
                }
            }

            this.processing = false;
        }

        sendEvent(event) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: CONFIG.playerUrl,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(event),
                    timeout: 5000,
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(true);
                        } else {
                            log(`队列事件发送失败: HTTP ${response.status}`, 'error');
                            resolve(false);
                        }
                    },
                    onerror: (error) => {
                        log('队列事件发送错误: ' + (error.message || '网络错误'), 'error');
                        resolve(false);
                    },
                    ontimeout: () => {
                        log('队列事件发送超时', 'error');
                        resolve(false);
                    }
                });
            });
        }

        getQueueLength() {
            return this.queue.length;
        }
    }

    const eventQueue = new EventQueue();

    setInterval(() => {
        if (eventQueue.getQueueLength() > 0) {
            log(`⏰ 定时处理队列 (${eventQueue.getQueueLength()} 个待处理事件)`, 'info');
            eventQueue.processQueue();
        }
    }, 10000);

    function logRateLimited(key, message, type = 'debug') {
        const now = Date.now();
        const last = lastLogTs[key] || 0;
        if ((now - last) >= CONFIG.timeLogIntervalMs) {
            lastLogTs[key] = now;
            log(message, type);
        }
    }

    let isWaitingForFile = false;
    let waitStartTime = 0;
    let lastKnownFiles = new Set();
    let heartbeatInterval = null;
    let isPopupVisible = false; 
    let wasPlayingBeforePopup = false; 
    let webAudioPlayer = null; 
    let timeSync = {
        enabled: false,
        lastSyncTime: 0,
        syncInterval: null,
        isSyncing: false     
    };
    let autoPauseState = {
        isWaitingForWaveform: false,  
        hasAutoPaused: false,          
        waveformObserver: null         
    };
    let autoMixState = {
        enabled: false,                
        triggered: false,              
        maxRetries: 10,                
        retryDelay: 1000              
    };

    function detectPopup() {
        
        const popupSelectors = [
            '.v-modal',
            '.el-dialog__wrapper',
            '.el-message-box__wrapper'
        ];

        let hasPopup = false;

        if (document.body && document.body.classList.contains('el-popup-parent--hidden')) {
            hasPopup = true;
        }

        for (const selector of popupSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const style = window.getComputedStyle(element);
                const rect = element.getBoundingClientRect();

                if (style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    style.opacity !== '0' &&
                    rect.width > 0 &&
                    rect.height > 0) {
                    hasPopup = true;
                    break;
                }
            }
            if (hasPopup) break;
        }

        return hasPopup;
    }

    function handlePopupStateChange(newPopupState) {
        if (isPopupVisible !== newPopupState) {
            const oldState = isPopupVisible;
            isPopupVisible = newPopupState;

            if (newPopupState) {
                
                log('检测到弹窗出现，暂停播放器', 'info');
                sendEventToPlayer('popup_show', {
                    action: 'pause',
                    reason: 'popup_appeared'
                });
                
            } else {
                
                log('检测到弹窗关闭，恢复播放器', 'info');
                sendEventToPlayer('popup_hide', {
                    action: 'resume',
                    reason: 'popup_closed'
                });
                
            }
        }
    }

    function log(message, type = 'info') {
        if (!CONFIG.debug) return;

        const levels = { debug: 0, info: 1, warn: 2, warning: 2, error: 3, success: 1 };
        const currentLevel = levels[CONFIG.logLevel] || 1;
        const messageLevel = levels[type] || 1;

        if (messageLevel < currentLevel) return;

        if (type === 'debug' && !CONFIG.verboseLog) return;

        const timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const styles = {
            'success': { icon: '✅', color: '#4CAF50', bg: '#E8F5E9' },
            'error': { icon: '❌', color: '#f44336', bg: '#FFEBEE' },
            'warning': { icon: '⚠️', color: '#FF9800', bg: '#FFF3E0' },
            'info': { icon: 'ℹ️', color: '#2196F3', bg: '#E3F2FD' },
            'debug': { icon: '🔍', color: '#9E9E9E', bg: '#F5F5F5' }
        };

        const style = styles[type] || styles['info'];

        console.log(
            `%c${style.icon} [呱呱监测] %c${timestamp} %c${message}`,
            `color: ${style.color}; font-weight: bold;`,
            `color: #666; font-size: 0.9em;`,
            `color: ${style.color};`
        );
    }

    function safeStringify(obj, space = null) {
        const seen = new WeakSet();
        return JSON.stringify(obj, (key, val) => {
            if (val != null && typeof val === "object") {
                if (seen.has(val)) {
                    return "[Circular Reference]";
                }
                seen.add(val);
            }
            return val;
        }, space);
    }

    function sendEventToPlayer(eventType, eventData = {}) {
        const payload = {
            type: eventType,
            data: {
                ...eventData,
                timestamp: Date.now(),
                url: window.location.href,
                
                source: 'userscript'
            }
        };

        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.playerUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: safeStringify(payload),
                onload: function (response) {
                    try {
                        if (response.status === 200) {
                            log('事件发送成功', 'debug');
                            try {
                                const result = JSON.parse(response.responseText);
                                if (!result || !result.success) {
                                    const errorMsg = (result && result.message) ? result.message : '未知错误';
                                    showNotification('❌ 处理失败: ' + errorMsg, 'error');
                                }
                            } catch (parseError) {
                                log('解析响应失败: ' + parseError.message, 'error');
                            }
                        } else {
                            log(`事件发送失败: HTTP ${response.status}，加入队列`, 'warning');
                            eventQueue.enqueue(payload);
                        }
                    } catch (loadError) {
                        log('处理响应时发生错误: ' + loadError.message, 'error');
                        eventQueue.enqueue(payload);
                    }
                },
                onerror: function (error) {
                    try {
                        const errorMsg = (error && error.message) ? error.message : '网络连接失败';
                        log('网络错误: ' + errorMsg + '，事件已加入队列', 'warning');
                        eventQueue.enqueue(payload);
                    } catch (errorHandlingError) {
                        log('处理错误时发生异常: ' + errorHandlingError.message, 'error');
                    }
                },
                ontimeout: function () {
                    log('请求超时，事件已加入队列', 'warning');
                    eventQueue.enqueue(payload);
                },
                timeout: 5000 
            });
        } catch (requestError) {
            log('发送请求时发生错误: ' + requestError.message, 'error');
            showNotification('❌ 请求发送失败', 'error');
        }
    }

    const NotificationManager = {
        container: null,
        notifications: [],
        maxNotifications: 5, 

        initContainer() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'guagua-notification-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    z-index: 10001;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    pointer-events: none;
                    max-width: 320px;
                `;
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', duration = 3000) {
            this.initContainer();

            if (this.notifications.length >= this.maxNotifications) {
                const oldest = this.notifications[0];
                this.remove(oldest.element, oldest);
            }

            const notification = document.createElement('div');
            const bgColor = type === 'success' ? 'rgba(76, 175, 80, 0.5)' : 
                           type === 'error' ? 'rgba(244, 67, 54, 0.5)' : 
                           type === 'warning' ? 'rgba(255, 152, 0, 0.5)' : 'rgba(33, 150, 243, 0.5)';
            
            notification.style.cssText = `
                background: ${bgColor};
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                color: white;
                padding: 10px 16px;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif;
                font-size: 13px;
                line-height: 1.4;
                font-weight: 500;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                max-width: 100%;
                word-wrap: break-word;
                pointer-events: auto;
                transform: translateX(100%) scale(0.95);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;
            notification.textContent = message;

            this.container.appendChild(notification);

            const notificationData = {
                element: notification,
                timer: null,
                timestamp: Date.now()
            };
            this.notifications.push(notificationData);

            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0) scale(1)';
            });

            notificationData.timer = setTimeout(() => {
                this.remove(notification, notificationData);
            }, duration);

            return notificationData;
        },

        remove(element, data) {
            if (!element || !element.parentNode) return;

            if (data && data.timer) {
                clearTimeout(data.timer);
            }

            element.style.transform = 'translateX(100%) scale(0.9)';

            const index = this.notifications.findIndex(n => n.element === element);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }

            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }

                if (this.container && this.container.children.length === 0) {
                    if (this.container.parentNode) {
                        this.container.parentNode.removeChild(this.container);
                    }
                    this.container = null;
                }
            }, 300);
        },

        clearAll() {
            const notificationsCopy = [...this.notifications];
            notificationsCopy.forEach(data => {
                this.remove(data.element, data);
            });
        }
    };

    function showNotification(message, type = 'info', duration = 3000) {
        return NotificationManager.show(message, type, duration);
    }

    function getChapterTitle() {
        try {
            const currentUrl = window.location.href;
            const isEditorPage = currentUrl.includes('/editor');
            const isAuditorPage = currentUrl.includes('/auditor');

            if (!isEditorPage && !isAuditorPage) {
                return '';
            }

            log(`[章节提取] 当前页面: ${isEditorPage ? 'editor' : isAuditorPage ? 'auditor' : 'unknown'}`, 'debug');

            if (isAuditorPage) {
                
                const basicNameElement = document.querySelector('.basic-name');
                if (basicNameElement) {
                    const text = basicNameElement.textContent.trim();
                    log(`[auditor页面] 找到.basic-name元素，内容: "${text}"`, 'debug');
                    
                    if (text &&
                        text.length > 2 &&
                        text.length < 100 &&
                        (/第\s*\d+\s*[章节回]/.test(text) || /§\s*\d+\s*集/.test(text) || /^\d+\s*集/.test(text) || /\d+\s*[章节集回]/.test(text))) {
                        log(`[auditor页面] 从.basic-name获取章节名: ${text}`, 'debug');
                        return text;
                    } else {
                        log(`[auditor页面] .basic-name内容不符合章节格式: "${text}"`, 'warn');
                    }
                } else {
                    log(`[auditor页面] 未找到.basic-name元素`, 'warn');
                }

                const auditorSelectors = [
                    '[class*="chapter"]',
                    '[class*="title"]',
                    '.current-chapter',
                    '.chapter-info',
                    '[data-chapter]'
                ];

                for (const selector of auditorSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        const text = element.textContent.trim();
                        
                        if (text &&
                            text.length > 2 &&
                            text.length < 100 &&
                            (/第\s*\d+\s*[章节回]/.test(text) || /§\s*\d+\s*集/.test(text) || /^\d+\s*集/.test(text) || /\d+\s*[章节集回]/.test(text)) &&
                            !text.includes('列表') &&
                            !text.includes('未找到') &&
                            !text.includes('取消') &&
                            !text.includes('保存') &&
                            !text.includes('提示') &&
                            !text.includes('呱呱') &&
                            !text.includes('平台')) {
                            log(`[auditor页面] 从特定选择器获取章节名: ${text}`, 'debug');
                            return text;
                        }
                    }
                }
            }

            if (isEditorPage) {
                log(`[editor页面] 开始查找章节标题`, 'debug');

                const basicConfigName = document.getElementById('basicConfigName');
                if (basicConfigName) {
                    const text = basicConfigName.textContent.trim();
                    log(`[editor页面] 找到#basicConfigName元素，内容: "${text}"`, 'debug');

                    if (text &&
                        text.length > 2 &&
                        text.length < 100 &&
                        (/第\s*\d+\s*[章节回]/.test(text) || /§\s*\d+\s*集/.test(text) || /^\d+\s*集/.test(text) || /\d+\s*[章节集回]/.test(text)) &&
                        !text.includes('列表') &&
                        !text.includes('未找到') &&
                        !text.includes('取消') &&
                        !text.includes('保存') &&
                        !text.includes('提示') &&
                        !text.includes('呱呱') &&
                        !text.includes('平台') &&
                        !text.includes('编辑器')) {
                        log(`[editor页面] ✅ 从#basicConfigName获取章节名: ${text}`, 'info');
                        return text;
                    } else if (text && text.length > 0) {
                        log(`[editor页面] ⚠️ #basicConfigName内容不符合章节格式: "${text}"`, 'warn');
                    }
                } else {
                    log(`[editor页面] 未找到#basicConfigName元素`, 'debug');
                }

                const editorSelectors = [
                    '.chapter-title',
                    '.current-chapter',
                    '.basic-name',
                    '.el-breadcrumb__item:last-child',  
                    '.el-page-header__title'  
                ];

                for (const selector of editorSelectors) {
                    const elements = document.querySelectorAll(selector);
                    log(`[editor页面] 选择器 "${selector}" 找到 ${elements.length} 个元素`, 'debug');

                    for (const element of elements) {
                        const text = element.textContent.trim();
                        log(`[editor页面] 检查元素文本: "${text.substring(0, 50)}..."`, 'debug');

                        if (text &&
                            text.length > 2 &&
                            text.length < 100 &&
                            (/第\s*\d+\s*[章节回]/.test(text) || /§\s*\d+\s*集/.test(text) || /^\d+\s*集/.test(text) || /\d+\s*[章节集回]/.test(text)) &&
                            !text.includes('列表') &&
                            !text.includes('未找到') &&
                            !text.includes('取消') &&
                            !text.includes('保存') &&
                            !text.includes('提示') &&
                            !text.includes('呱呱') &&
                            !text.includes('平台') &&
                            !text.includes('编辑器')) {
                            log(`[editor页面] ✅ 从选择器 "${selector}" 获取章节名: ${text}`, 'info');
                            return text;
                        }
                    }
                }

                log(`[editor页面] 所有选择器都未找到有效章节名`, 'warn');
            }

            const headings = document.querySelectorAll('h1, h2, h3, h4, h5');
            for (const heading of headings) {
                const text = heading.textContent.trim();
                
                if (text &&
                    !text.includes('呱呱') &&
                    !text.includes('平台') &&
                    !text.includes('编辑器') &&
                    !text.includes('审听') &&
                    !text.includes('制作') &&
                    text.length > 2 &&
                    text.length < 100) {
                    log(`从标题标签获取章节名: ${text}`, 'debug');
                    return text;
                }
            }

            const textElements = document.querySelectorAll('div, span, p, li, td');
            for (const element of textElements) {
                
                const text = Array.from(element.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join(' ')
                    .trim();

                if (text && (text.includes('第') || text.includes('章') || text.includes('节')) &&
                    text.length > 2 && text.length < 100) {
                    
                    if (/第\s*\d+\s*[章节]/.test(text) || /[章节]\s*\d+/.test(text)) {
                        
                        if (!text.includes('共') &&
                            !text.includes('总') &&
                            !text.includes('选择') &&
                            !text.includes('点击') &&
                            !text.includes('列表') &&
                            !text.includes('未找到') &&
                            !text.includes('取消') &&
                            !text.includes('保存') &&
                            !text.includes('提示')) {
                            log(`从元素文本获取章节名: ${text}`, 'debug');
                            return text;
                        }
                    }
                }
            }

            const breadcrumbs = document.querySelectorAll('.breadcrumb, [class*="breadcrumb"], [class*="nav"], [class*="crumb"]');
            for (const breadcrumb of breadcrumbs) {
                const items = breadcrumb.querySelectorAll('a, span, li, div');
                if (items.length > 0) {
                    
                    const lastItem = items[items.length - 1];
                    const text = lastItem.textContent.trim();
                    if (text &&
                        text.length > 2 &&
                        text.length < 100 &&
                        !text.includes('呱呱') &&
                        !text.includes('首页') &&
                        !text.includes('返回')) {
                        log(`从面包屑获取章节名: ${text}`, 'debug');
                        return text;
                    }
                }
            }

            const title = document.title;
            if (title &&
                !title.includes('呱呱') &&
                !title.includes('平台') &&
                title.length > 2 &&
                title.length < 100) {
                log(`从页面标题获取章节名: ${title}`, 'debug');
                return title;
            }

            const bodyText = document.body.innerText;
            const chapterMatch = bodyText.match(/第\s*\d+\s*章[^\n]{0,30}/);
            if (chapterMatch) {
                const text = chapterMatch[0].trim();
                log(`从页面文本匹配获取章节名: ${text}`, 'debug');
                return text;
            }

            log('未能获取章节标题', 'warn');
            return '';
        } catch (error) {
            log(`获取章节标题时出错: ${error.message}`, 'error');
            return '';
        }
    }

    function tryAutoMix(retryCount = 0) {
        log(`🎛️ tryAutoMix 被调用 (重试: ${retryCount}/${autoMixState.maxRetries})`, 'debug');
        
        if (autoMixState.triggered) {
            log('自动混音已触发过，跳过', 'debug');
            return;
        }

        if (!autoMixState.enabled) {
            log('⚠️ 自动混音未启用', 'debug');
            return;
        }

        if (!window.location.href.includes('/editor')) {
            log('⚠️ 不在编辑页面，跳过自动混音', 'debug');
            return;
        }

        log('✅ 自动混音已启用且在编辑页面，查找混音按钮...', 'debug');

        const mixButton = findMixButton();

        if (mixButton) {
            log(`✅ 找到混音按钮: "${mixButton.textContent}"，准备自动点击`, 'success');

            setTimeout(() => {
                mixButton.click();
                autoMixState.triggered = true;
                log('✅ 自动混音已触发', 'success');
                showNotification('🎵 自动混音已触发', 'success');
            }, 500);
        } else {
            
            if (retryCount < autoMixState.maxRetries) {
                log(`⚠️ 未找到混音按钮，${autoMixState.retryDelay}ms后重试 (${retryCount + 1}/${autoMixState.maxRetries})`, 'warning');
                setTimeout(() => {
                    tryAutoMix(retryCount + 1);
                }, autoMixState.retryDelay);
            } else {
                log('❌ 未找到混音按钮，已达到最大重试次数', 'error');
                showNotification('❌ 未找到混音按钮', 'error');
            }
        }
    }

    function findMixButton() {
        const mixButtons = document.querySelectorAll('button, .btn, [class*="mix"], [class*="合成"], [class*="生成"]');

        for (const button of mixButtons) {
            const buttonText = button.textContent || button.innerText || '';
            const buttonClass = button.className || '';
            const buttonId = button.id || '';

            if (buttonText.includes('混音') ||
                buttonText.includes('合成') ||
                buttonText.includes('生成') ||
                buttonClass.includes('mix') ||
                buttonId.includes('mix')) {
                log(`找到混音按钮: ${buttonText}`, 'debug');
                return button;
            }
        }

        return null;
    }

    function monitorMixButton() {
        
        const mixButtons = document.querySelectorAll('button, .btn, [class*="mix"], [class*="合成"], [class*="生成"]');

        mixButtons.forEach(button => {
            const buttonText = button.textContent || button.innerText || '';
            const buttonClass = button.className || '';
            const buttonId = button.id || '';

            if (buttonText.includes('混音') ||
                buttonText.includes('合成') ||
                buttonText.includes('生成') ||
                buttonClass.includes('mix') ||
                buttonId.includes('mix')) {

                if (!button.hasAttribute('data-guagua-monitored')) {
                    button.setAttribute('data-guagua-monitored', 'true');

                    button.addEventListener('click', function (event) {
                        
                        if (isPopupVisible) {
                            log(`弹窗状态下忽略混音按钮点击: ${buttonText}`, 'debug');
                            return;
                        }

                        const chapterTitle = getChapterTitle();
                        if (chapterTitle) {
                            log(`📖 混音开始: ${chapterTitle}`, 'info');
                        } else {
                            log(`⚠️ 混音开始（未获取到章节名）`, 'warn');
                        }

                        log(`🚀 准备发送mix_button_clicked事件，章节标题: "${chapterTitle}"`, 'info');
                        sendEventToPlayer('mix_button_clicked', {
                            buttonText: buttonText,
                            buttonClass: buttonClass,
                            buttonId: buttonId,
                            chapterTitle: chapterTitle,
                            timestamp: Date.now()
                        });
                        log(`✅ mix_button_clicked事件已发送`, 'info');

                        log(`ℹ️ 已发送混音事件，后端将自动处理文件映射`, 'info');

                        const message = chapterTitle ?
                            `🎵 混音开始: ${chapterTitle}` :
                            '🎵 混音开始（未获取到章节名）';
                        showNotification(message, 'info');

                        startWaitingForWaveform();
                    });

                    log(`已监控混音按钮: ${buttonText}`, 'debug');
                }
            }
        });
    }

    function recordCurrentFiles() {
        lastKnownFiles.clear();

        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (audio.src && audio.src.includes('f_')) {
                lastKnownFiles.add(audio.src);
            }
        });

        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            
            if (element.src && element.src.includes('f_')) {
                lastKnownFiles.add(element.src);
            }
            
            if (element.href && element.href.includes('f_')) {
                lastKnownFiles.add(element.href);
            }
            
            const text = element.textContent || '';
            const matches = text.match(/f_[a-fA-F0-9]+/g);
            if (matches) {
                matches.forEach(match => lastKnownFiles.add(match));
            }
        });

        log(`记录了 ${lastKnownFiles.size} 个已知文件`, 'debug');
    }

    function startWaitingForFile(buttonData) {
        if (isWaitingForFile) {
            log('已经在等待文件生成中...', 'warning');
            return;
        }

        isWaitingForFile = true;
        waitStartTime = Date.now();

        const checkInterval = setInterval(() => {
            const currentTime = Date.now();
            const waitTime = currentTime - waitStartTime;

            if (waitTime > CONFIG.maxWaitTime) {
                log('等待文件生成超时', 'warning');
                clearInterval(checkInterval);
                isWaitingForFile = false;
                showNotification('⏰ 等待文件生成超时', 'warning');
                return;
            }

            const newFiles = checkForNewFiles();

            if (newFiles.length > 0) {
                log(`✅ 检测到新文件`, 'info');

                const eventData = {
                    ...buttonData,
                    newFiles: newFiles,
                    waitTime: waitTime
                };

                sendEventToPlayer('mix_button_clicked', eventData);

                clearInterval(checkInterval);
                isWaitingForFile = false;
                showNotification(`✅ 检测到新文件: ${buttonData.chapterTitle || ''}`, 'success');
            }
        }, CONFIG.checkInterval);
    }

    function detectWebPlayer() {
        
        const playerSelectors = [
            
            'audio',
            'video',
            '[class*="player"]',
            '[class*="audio"]',
            '[id*="player"]',
            '[id*="audio"]',
            
            '.audio-play-wave',
            '[class*="audio-play"]',
            '[class*="wave"]',
            '[id*="audioPlayer"]',
            'wave'
        ];

        let foundPlayer = null;
        let playerType = 'unknown';

        for (const selector of playerSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.bottom > windowHeight - 200 && rect.bottom <= windowHeight + 50) {
                    
                    if (element.tagName === 'AUDIO' || element.tagName === 'VIDEO') {
                        foundPlayer = element;
                        playerType = 'native';
                        break;
                    } else if (element.querySelector('audio, video')) {
                        foundPlayer = element.querySelector('audio, video');
                        playerType = 'native';
                        break;
                    } else if (element.classList.contains('audio-play-wave') ||
                        element.querySelector('[id*="audioPlayer"]') ||
                        element.querySelector('wave')) {
                        
                        foundPlayer = element;
                        playerType = 'waveform';
                        break;
                    }
                }
            }
            if (foundPlayer) break;
        }

        if (foundPlayer) {
            log(`🎵 检测到网页播放器 (${playerType})`, 'info');

            if (playerType === 'native') {
                
                if (CONFIG.enableNativeTimeLog) {
                    foundPlayer.addEventListener('timeupdate', () => {
                        if (timeSync.enabled) {
                            logRateLimited(LOG_KEYS.NATIVE_TIME, `网页播放器时间: ${foundPlayer.currentTime.toFixed(2)}s`, 'debug');
                        }
                    });
                }

                foundPlayer.addEventListener('play', () => {
                    log('网页播放器开始播放', 'debug');
                });

                foundPlayer.addEventListener('pause', () => {
                    log('网页播放器暂停', 'debug');
                });
            } else if (playerType === 'waveform') {
                
                log('检测到波形播放器，设置观察器监听时间变化', 'debug');

                if (CONFIG.enableWaveformTimeObserver) {
                    
                    const timeElements = foundPlayer.querySelectorAll('.text-color');
                    timeElements.forEach((timeEl, index) => {
                        if (timeEl.textContent.match(/\d{2}:\d{2}\.\d{3}/)) {
                            log(`找到时间显示元素 ${index + 1}: ${timeEl.textContent}`, 'debug');
                            let lastTime = timeEl.textContent;
                            let isPlaying = false;
                            const observer = new MutationObserver((mutations) => {
                                mutations.forEach((mutation) => {
                                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                                        const newTime = timeEl.textContent;
                                        if (newTime.match(/\d{2}:\d{2}\.\d{3}/)) {
                                            logRateLimited(LOG_KEYS.WAVEFORM_TIME, `波形播放器时间更新: ${newTime}`, 'debug');
                                            
                                            lastTime = newTime;
                                        }
                                    }
                                });
                            });
                            observer.observe(timeEl, {
                                childList: true,
                                characterData: true,
                                subtree: true
                            });
                        }
                    });
                }

                foundPlayer.addEventListener('click', (event) => {
                    log('波形播放器被点击', 'debug');

                    if (event.detail === 999) {
                        log('检测到同步操作触发的点击，跳过处理', 'debug');
                        return;
                    }

                    log('网页播放器被点击，但不发送时间同步给播放器（单向同步设计）', 'debug');
                });
            }

            return foundPlayer;
        }

        return null;
    }

    function initTimeSync() {
        webAudioPlayer = detectWebPlayer();

        if (webAudioPlayer) {
            log('🎵 时间同步功能已启用', 'info');
            timeSync.enabled = true;
            
        } else {
            log('未找到网页播放器，时间同步功能不可用', 'debug');
            
            setTimeout(initTimeSync, 5000);
        }

        startTimeSyncPolling();
    }

    function startTimeSyncPolling() {
        if (timeSync.syncInterval) {
            clearInterval(timeSync.syncInterval);
        }

        timeSync.syncInterval = setInterval(() => {
            checkForTimeSyncEvents();
        }, 1000); 

        log('事件轮询已启动（时间同步 + 自动混音）', 'info');
    }

    function checkForTimeSyncEvents() {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'http://127.0.0.1:5678/api/get_pending_events?client=userscript',
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.events && data.events.length > 0) {
                            log(`收到 ${data.events.length} 个事件`, 'debug');
                            
                            if (timeSync.enabled && webAudioPlayer) {
                                processTimeSyncEvents(data.events);
                            }
                        }
                    } catch (e) {
                        log('解析事件响应失败: ' + e.message, 'error');
                    }
                },
                onerror: function (error) {
                    log('获取事件失败: ' + error.message, 'debug');
                }
            });
        } catch (error) {
            log('检查事件时出错: ' + error.message, 'error');
        }
    }

    function createAutoMixToggle() {
        
        if (document.getElementById('guagua-auto-mix-toggle')) {
            log('自动混音开关已存在，跳过创建', 'debug');
            return;
        }

        if (!window.location.href.includes('/editor')) {
            log('不在编辑页面，不创建自动混音开关', 'debug');
            return;
        }

        const container = document.createElement('div');
        container.id = 'guagua-auto-mix-toggle';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(102, 126, 234, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            cursor: move;
            user-select: none;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 1;
            transition: opacity 0.3s ease;
        `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'guagua-auto-mix-checkbox';
        checkbox.checked = autoMixState.enabled;
        checkbox.style.cssText = 'cursor: pointer; width: 16px; height: 16px; margin: 0;';

        const label = document.createElement('label');
        label.htmlFor = 'guagua-auto-mix-checkbox';
        label.textContent = '自动混音';
        label.style.cssText = 'font-size: 14px; white-space: nowrap; cursor: pointer;';

        container.appendChild(checkbox);
        container.appendChild(label);

        checkbox.addEventListener('change', (e) => {
            e.stopPropagation(); 
            autoMixState.enabled = e.target.checked;
            
            try {
                localStorage.setItem('guagua_autoMix_enabled', autoMixState.enabled.toString());
            } catch (error) {
                log('保存自动混音状态失败: ' + error.message, 'error');
            }

            log(`🎛️ 自动混音已${autoMixState.enabled ? '启用' : '禁用'}`, 'debug');
            showNotification(`🎛️ 自动混音已${autoMixState.enabled ? '启用' : '禁用'}`, 'success');

            if (autoMixState.enabled && window.location.href.includes('/editor')) {
                autoMixState.triggered = false;
                setTimeout(() => {
                    tryAutoMix();
                }, 1000);
            }
        });

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let hasMoved = false; 

        container.addEventListener('mousedown', (e) => {
            
            if (e.target === checkbox || e.target === label) return;

            isDragging = true;
            hasMoved = false;
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            hasMoved = true; 
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            container.style.left = currentX + 'px';
            container.style.top = currentY + 'px';
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'move';
            }
        });

        let fadeOutTimer = null;

        const startFadeOutTimer = () => {
            
            if (fadeOutTimer) {
                clearTimeout(fadeOutTimer);
            }
            
            fadeOutTimer = setTimeout(() => {
                container.style.opacity = '0.2';
            }, 3000);
        };

        const showContainer = () => {
            container.style.opacity = '1';
            
            if (fadeOutTimer) {
                clearTimeout(fadeOutTimer);
            }
        };

        container.addEventListener('mouseenter', () => {
            showContainer();
        });

        container.addEventListener('mouseleave', () => {
            startFadeOutTimer();
        });

        startFadeOutTimer();

        document.body.appendChild(container);
        log('✅ 自动混音浮动开关已创建（3秒后自动淡出）', 'debug');
    }

    function initAutoMixState() {
        try {
            
            const saved = localStorage.getItem('guagua_autoMix_enabled');
            autoMixState.enabled = saved === 'true';
            log(`🔍 加载自动混音状态: ${autoMixState.enabled}`, 'debug');

            if (autoMixState.enabled && window.location.href.includes('/editor')) {
                setTimeout(() => {
                    tryAutoMix();
                }, 2000);
            }
        } catch (error) {
            log('加载自动混音状态失败: ' + error.message, 'error');
        }
    }

    function processTimeSyncEvents(events) {
        let timeSyncEvents = events.filter(event => event.type === 'player_time_sync');
        
        timeSyncEvents = timeSyncEvents.filter(event => {
            const src = (event && event.data && event.data.source) || event.source || event.clientSource;
            return src === 'webpage';
        });

        const totalSyncEvents = events.filter(e => e.type === 'player_time_sync').length;
        const dropped = totalSyncEvents - timeSyncEvents.length;
        if (dropped > 0) {
            log(`[调试] 已忽略 ${dropped} 个非网页来源的时间同步事件`, 'debug');
        }

        log(`[调试] 总事件数: ${events.length}, 时间同步事件数: ${timeSyncEvents.length}`, 'debug');

        if (timeSyncEvents.length === 0) return;

        const latestEvent = timeSyncEvents[timeSyncEvents.length - 1];
        const eventData = latestEvent.data;

        log(`[调试] 事件数据: ${JSON.stringify(eventData)}`, 'debug');

        if (!eventData) return;

        const currentTime = eventData.currentTime || 0;
        const duration = eventData.duration || 0;
        const action = eventData.action || 'seek';
        const pauseAfterSeek = eventData.pauseAfterSeek || false;

        log(`⏱️ 时间同步: ${action} to ${currentTime.toFixed(3)}s (${formatTime(currentTime)})`, 'info');

        if (!webAudioPlayer) {
            log('未找到网页播放器，无法执行时间同步', 'warning');
            return;
        }

        try {
            
            timeSync.isSyncing = true;
            timeSync.lastSyncTime = Date.now();

            const isNativePlayer = webAudioPlayer.tagName === 'AUDIO' || webAudioPlayer.tagName === 'VIDEO';

            if (isNativePlayer) {
                
                if (webAudioPlayer.duration && currentTime <= webAudioPlayer.duration) {
                    webAudioPlayer.currentTime = currentTime;
                    log(`网页跳转到 ${currentTime}s`, 'success');
                    showNotification(`⏭️ 跳转 ${formatTime(currentTime)}`, 'info');

                    if (pauseAfterSeek && !webAudioPlayer.paused) {
                        setTimeout(() => {
                            webAudioPlayer.pause();
                            log(`网页播放器跳转后已暂停`, 'info');
                        }, 100); 
                    }
                } else {
                    log(`跳转时间 ${currentTime}s 超出音频长度`, 'warning');
                }
            } else {
                
                log('检测到波形播放器，尝试模拟操作', 'info');

                let wavesurferInstance = null;

                log(`[WaveSurfer调试] 开始查找WaveSurfer实例`, 'debug');
                log(`[WaveSurfer调试] window.wavesurfer存在: ${!!window.wavesurfer}`, 'debug');
                log(`[WaveSurfer调试] window.WaveSurfer存在: ${!!window.WaveSurfer}`, 'debug');

                if (window.wavesurfer) {
                    wavesurferInstance = window.wavesurfer;
                    log(`[WaveSurfer调试] 从window.wavesurfer获取实例`, 'debug');
                } else if (window.WaveSurfer && window.WaveSurfer.instances) {
                    
                    const instances = window.WaveSurfer.instances;
                    if (instances && instances.length > 0) {
                        wavesurferInstance = instances[0];
                        log(`[WaveSurfer调试] 从WaveSurfer.instances获取实例`, 'debug');
                    }
                }

                if (!wavesurferInstance) {
                    const waveContainers = document.querySelectorAll('[id*="wave"], [class*="wave"]');
                    log(`[WaveSurfer调试] 找到${waveContainers.length}个波形容器`, 'debug');
                    for (const container of waveContainers) {
                        if (container._wavesurfer || container.wavesurfer) {
                            wavesurferInstance = container._wavesurfer || container.wavesurfer;
                            log(`[WaveSurfer调试] 从容器获取实例: ${container.tagName}#${container.id}.${container.className}`, 'debug');
                            break;
                        }
                    }
                }

                if (!wavesurferInstance) {
                    const possibleSelectors = [
                        'canvas[data-wavesurfer]',
                        '[data-wavesurfer-instance]',
                        '.wavesurfer-container',
                        '#waveform',
                        '.waveform',
                        'canvas[style*="cursor"]', 
                        'canvas[width][height]' 
                    ];

                    for (const selector of possibleSelectors) {
                        const elements = document.querySelectorAll(selector);
                        log(`[WaveSurfer调试] 选择器 "${selector}" 找到 ${elements.length} 个元素`, 'debug');
                        for (const element of elements) {
                            
                            const possibleInstances = [
                                element.wavesurfer,
                                element._wavesurfer,
                                element.parentElement?.wavesurfer,
                                element.parentElement?._wavesurfer
                            ];

                            for (const instance of possibleInstances) {
                                if (instance && typeof instance.seekTo === 'function') {
                                    wavesurferInstance = instance;
                                    log(`[WaveSurfer调试] 从元素获取实例: ${selector}`, 'debug');
                                    break;
                                }
                            }
                            if (wavesurferInstance) break;
                        }
                        if (wavesurferInstance) break;
                    }
                }

                if (!wavesurferInstance) {
                    log(`[WaveSurfer调试] 尝试从全局变量查找实例`, 'debug');
                    for (const key in window) {
                        try {
                            const obj = window[key];
                            if (obj && typeof obj === 'object' && typeof obj.seekTo === 'function' && typeof obj.getDuration === 'function') {
                                wavesurferInstance = obj;
                                log(`[WaveSurfer调试] 从全局变量 "${key}" 获取实例`, 'debug');
                                break;
                            }
                        } catch (e) {
                            
                        }
                    }
                }

                log(`[WaveSurfer调试] 最终找到实例: ${!!wavesurferInstance}`, 'debug');
                if (wavesurferInstance) {
                    log(`[WaveSurfer调试] 实例方法: seekTo=${typeof wavesurferInstance.seekTo}, getDuration=${typeof wavesurferInstance.getDuration}`, 'debug');
                }

                if (wavesurferInstance && typeof wavesurferInstance.seekTo === 'function') {
                    try {
                        
                        let actualDuration = 0;
                        if (wavesurferInstance.getDuration && typeof wavesurferInstance.getDuration === 'function') {
                            actualDuration = wavesurferInstance.getDuration();
                            log(`[WaveSurfer调试] 从WaveSurfer获取时长: ${actualDuration}`, 'debug');
                        }

                        if (!actualDuration || actualDuration <= 0) {
                            
                            const audioElements = document.querySelectorAll('audio, video');
                            for (const audio of audioElements) {
                                if (audio.duration && audio.duration > 0) {
                                    actualDuration = audio.duration;
                                    log(`[WaveSurfer调试] 从音频元素获取时长: ${actualDuration}`, 'debug');
                                    break;
                                }
                            }
                        }

                        if (!actualDuration || actualDuration <= 0) {
                            actualDuration = duration;
                            log(`[WaveSurfer调试] 使用传入的duration: ${actualDuration}`, 'debug');
                        }

                        if (!actualDuration || actualDuration <= 0) {
                            
                            actualDuration = Math.max(currentTime * 1.2, 60); 
                            log(`[WaveSurfer调试] 估算时长: ${actualDuration} (基于currentTime: ${currentTime})`, 'debug');
                        }

                        log(`[WaveSurfer调试] 原始参数: currentTime=${currentTime}, actualDuration=${actualDuration}, duration=${duration}`, 'debug');
                        log(`[WaveSurfer调试] 参数类型: currentTime=${typeof currentTime}, actualDuration=${typeof actualDuration}`, 'debug');

                        if (actualDuration > 0 && currentTime >= 0 && isFinite(actualDuration) && isFinite(currentTime)) {
                            
                            const seekRatio = currentTime / actualDuration;
                            log(`[WaveSurfer调试] 计算比例: seekRatio=${seekRatio} (${currentTime}/${actualDuration})`, 'debug');

                            const clampedRatio = Math.min(Math.max(seekRatio, 0), 1);
                            log(`[WaveSurfer调试] 限制后比例: clampedRatio=${clampedRatio}`, 'debug');

                            if (isNaN(clampedRatio) || !isFinite(clampedRatio)) {
                                log(`[WaveSurfer错误] 跳转参数无效: clampedRatio=${clampedRatio}, seekRatio=${seekRatio}`, 'error');
                                performClickSeek();
                                return;
                            }

                            if (clampedRatio < 0 || clampedRatio > 1) {
                                log(`[WaveSurfer错误] 参数超出范围: clampedRatio=${clampedRatio}，应在0-1之间`, 'error');
                                performClickSeek();
                                return;
                            }

                            log(`[WaveSurfer调试] 准备调用seekTo: clampedRatio=${clampedRatio.toFixed(6)} (${currentTime}s/${actualDuration}s)`, 'debug');

                            if (typeof clampedRatio !== 'number') {
                                log(`[WaveSurfer错误] 参数类型错误: typeof clampedRatio = ${typeof clampedRatio}`, 'error');
                                performClickSeek();
                                return;
                            }

                            try {
                                log(`[WaveSurfer调试] 即将调用 wavesurferInstance.seekTo(${clampedRatio})`, 'debug');
                                wavesurferInstance.seekTo(clampedRatio);
                                log(`⏭️ 跳转到 ${formatTime(currentTime)}`, 'info');
                                showNotification(`⏭️ 跳转 ${formatTime(currentTime)}`, 'info');

                                if (pauseAfterSeek && wavesurferInstance.pause && typeof wavesurferInstance.pause === 'function') {
                                    setTimeout(() => {
                                        wavesurferInstance.pause();
                                        log(`[WaveSurfer] 跳转后已暂停播放`, 'info');
                                    }, 100); 
                                }
                            } catch (seekError) {
                                log(`[WaveSurfer错误] seekTo调用失败: ${seekError.message}`, 'error');
                                log(`[WaveSurfer错误] 错误详情: clampedRatio=${clampedRatio}, type=${typeof clampedRatio}`, 'error');
                                
                                performClickSeek();
                                return;
                            }
                        } else {
                            log(`WaveSurfer跳转参数无效: actualDuration=${actualDuration}, currentTime=${currentTime}`, 'warning');
                            performClickSeek();
                        }
                    } catch (apiError) {
                        log('WaveSurfer API跳转失败: ' + apiError.message, 'error');
                        
                        performClickSeek();
                    }
                } else {
                    log('未找到WaveSurfer实例或seekTo方法，使用点击方式', 'debug');
                    
                    performClickSeek();
                }

                function performClickSeek() {
                    
                    let waveElement = webAudioPlayer.querySelector('wave');

                    if (!waveElement) {
                        waveElement = webAudioPlayer.querySelector('[class*="wave"], [class*="waveform"], canvas, svg');
                    }

                    let actualDuration = duration;
                    if (actualDuration <= 0) {
                        const timeElements = webAudioPlayer.querySelectorAll('[class*="time"], [class*="duration"], .text-color');
                        for (const timeEl of timeElements) {
                            const timeText = timeEl.textContent.trim();
                            if (timeText.includes(':') && timeText.length > 3) {
                                
                                const parsed = parseTimeToSeconds(timeText);
                                if (parsed > actualDuration) {
                                    actualDuration = parsed;
                                }
                            }
                        }
                    }

                    if (waveElement && actualDuration > 0) {
                        const waveRect = waveElement.getBoundingClientRect();
                        const clickX = (currentTime / actualDuration) * waveRect.width;

                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            clientX: waveRect.left + clickX,
                            clientY: waveRect.top + waveRect.height / 2,
                            
                            detail: 999 
                        });

                        waveElement.dispatchEvent(clickEvent);
                        log(`⏭️ 跳转到 ${formatTime(currentTime)}`, 'info');
                        showNotification(`⏭️ 跳转 ${formatTime(currentTime)}`, 'info');
                    } else {
                        log(`无法在波形播放器中执行跳转操作 - waveElement: ${!!waveElement}, duration: ${actualDuration}`, 'warning');

                        const progressElements = webAudioPlayer.querySelectorAll('[class*="progress"], [class*="seek"], [class*="bar"]');
                        for (const progressEl of progressElements) {
                            if (progressEl.getBoundingClientRect().width > 50) {
                                progressEl.click();
                                log('使用备用方案：点击进度条区域', 'info');
                                break;
                            }
                        }
                    }
                }
            }
        } catch (syncError) {
            log('执行时间同步操作失败: ' + syncError.message, 'error');
        } finally {
            
            setTimeout(() => {
                timeSync.isSyncing = false;
                log('同步状态已重置', 'debug');
            }, 500); 
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function parseTimeToSeconds(timeStr) {
        const match = timeStr.match(/(\d{2}):(\d{2})\.(\d{3})/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3]);
            return minutes * 60 + seconds + milliseconds / 1000;
        }
        return 0;
    }

    function sendPlayerTimeSync(action, currentTime = 0, duration = 0, options = {}) {
        if (!timeSync.enabled) return;

        const eventData = {
            action: action,
            currentTime: currentTime,
            duration: duration,
            timestamp: Date.now(),
            url: window.location.href,
            playerType: webAudioPlayer ? (webAudioPlayer.tagName === 'AUDIO' || webAudioPlayer.tagName === 'VIDEO' ? 'native' : 'waveform') : 'unknown',
            ...options 
        };

        sendEventToPlayer('player_time_sync', eventData);
        log(`发送时间同步: ${action} at ${formatTime(currentTime)}`, 'debug');
    }
    
    function checkForNewFiles() {
        const currentFiles = new Set();

        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (audio.src && audio.src.includes('f_')) {
                currentFiles.add(audio.src);
            }
        });

        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            
            if (element.src && element.src.includes('f_')) {
                currentFiles.add(element.src);
            }
            
            if (element.href && element.href.includes('f_')) {
                currentFiles.add(element.href);
            }
            
            const text = element.textContent || '';
            const matches = text.match(/f_[a-fA-F0-9]+/g);
            if (matches) {
                matches.forEach(match => currentFiles.add(match));
            }
        });

        const newFiles = [];
        currentFiles.forEach(file => {
            if (!lastKnownFiles.has(file)) {
                newFiles.push(file);
            }
        });

        return newFiles;
    }

    function monitorDOMChanges() {
        const observer = new MutationObserver(function (mutations) {
            if (!isWaitingForFile) return;

            let hasNewContent = false;
            mutations.forEach(function (mutation) {
                
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            
                            if ((element.src && element.src.includes('f_')) ||
                                (element.href && element.href.includes('f_')) ||
                                (element.textContent && element.textContent.includes('f_'))) {
                                hasNewContent = true;
                            }
                        }
                    });
                }

                if (mutation.type === 'attributes') {
                    const element = mutation.target;
                    if ((element.src && element.src.includes('f_')) ||
                        (element.href && element.href.includes('f_'))) {
                        hasNewContent = true;
                    }
                }
            });

            if (hasNewContent) {
                log('DOM变化检测到可能的新文件', 'info');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href']
        });

        log('已启动DOM变化监测', 'debug');
    }

    function detectAutoMixing() {
        
        if (window.location.href.includes('/auditor')) {
            log('🎬 检测到 Auditor 页面，准备启动章节监听功能', 'info');
            showNotification('🎵 检测到自动混音页面，开始监控...', 'info');

            let lastChapterTitle = '';

            const checkChapterChange = () => {
                const currentChapterTitle = getChapterTitle();

                if (currentChapterTitle && currentChapterTitle !== lastChapterTitle) {
                    log(`📖 自动混音: ${currentChapterTitle}`, 'info');
                    lastChapterTitle = currentChapterTitle;

                    sendEventToPlayer('mix_button_clicked', {
                        pageType: 'auditor',
                        isAutoMixing: true,
                        chapterTitle: currentChapterTitle,
                        timestamp: Date.now()
                    });

                    log('ℹ️ 已发送混音事件，后端将自动处理文件映射', 'info');
                }
            };

            setTimeout(checkChapterChange, 2000);

            setInterval(checkChapterChange, 2000);

            log('✅ 章节监听已启动，每2秒检查一次', 'info');

            log('⏰ 将在 5 秒后启动波形监测（Auditor 页面）', 'info');
            setTimeout(() => {
                log('🚀 启动波形监测（Auditor 页面）', 'info');
                startWaitingForWaveform();
            }, 5000); 
        }
    }

    let currentUrl = window.location.href;
    let isMonitoringActive = false;
    let navigationObserver = null;

    function detectSPANavigation() {
        const newUrl = window.location.href;
        if (newUrl !== currentUrl) {
            log(`检测到页面导航: ${currentUrl} -> ${newUrl}`, 'info');
            currentUrl = newUrl;

            autoMixState.triggered = false;

            const toggle = document.getElementById('guagua-auto-mix-toggle');
            if (newUrl.includes('/editor')) {
                
                if (!toggle) {
                    createAutoMixToggle();
                } else {
                    toggle.style.display = 'flex';
                }

                if (autoMixState.enabled) {
                    setTimeout(() => {
                        tryAutoMix();
                    }, 2000);
                }
            } else {
                
                if (toggle) {
                    toggle.style.display = 'none';
                }
            }

            if (shouldMonitorCurrentPage()) {
                log('导航到监控页面，重新初始化...', 'info');
                reinitializeMonitoring();
            } else {
                log('导航到非监控页面，停止监控...', 'info');
                stopMonitoring();
            }
        }
    }

    function shouldMonitorCurrentPage() {
        const url = window.location.href;
        return url.includes('/editor') || url.includes('/auditor');
    }

    function stopMonitoring() {
        if (isMonitoringActive) {
            log('停止监控...', 'info');
            isMonitoringActive = false;
            stopHeartbeat();
            
        }
    }

    function reinitializeMonitoring() {
        
        stopMonitoring();

        setTimeout(() => {
            log('重新初始化监控...', 'info');
            initMonitoring();
        }, 500);
    }

    function setupSPANavigationDetection() {
        
        window.addEventListener('popstate', () => {
            log('检测到popstate事件', 'debug');
            setTimeout(detectSPANavigation, 100);
        });

        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (...args) {
            originalPushState.apply(history, args);
            log('检测到pushState事件', 'debug');
            setTimeout(detectSPANavigation, 100);
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(history, args);
            log('检测到replaceState事件', 'debug');
            setTimeout(detectSPANavigation, 100);
        };

        if (typeof MutationObserver !== 'undefined') {
            navigationObserver = new MutationObserver((mutations) => {
                let shouldCheck = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE &&
                                (node.classList?.contains('main-content') ||
                                    node.id?.includes('app') ||
                                    node.tagName === 'MAIN')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                });

                if (shouldCheck) {
                    log('检测到重要DOM变化，检查导航状态', 'debug');
                    setTimeout(detectSPANavigation, 200);
                }
            });

            navigationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        setInterval(detectSPANavigation, 2000);
    }

    function initMonitoring() {
        
        if (!shouldMonitorCurrentPage()) {
            log('当前页面不需要监控，跳过初始化', 'info');
            return;
        }

        log('开始初始化呱呱有声制作平台监测...', 'info');

        BrowserDetector.logBrowserInfo();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startMonitoring);
        } else {
            startMonitoring();
        }
    }

    function startMonitoring() {
        log('🚀 开始监控呱呱平台', 'info');

        if (CONFIG.edgeCompatMode) {
            log('⚠️ Edge兼容模式已启用', 'info');
        }
        isMonitoringActive = true;

        initTimeSync();

        initAutoMixState();
        createAutoMixToggle();

        setInterval(() => {
            monitorMixButton();
        }, CONFIG.checkInterval);

        window.addEventListener('guagua-popup-show', (event) => {
            log('收到弹窗出现事件', 'info');
            isPopupVisible = true;

            showNotification('⏸️ 已暂停', 'info');
        });

        window.addEventListener('guagua-popup-hide', (event) => {
            log('收到弹窗关闭事件，恢复播放器', 'info');
            isPopupVisible = false;
            
            sendEventToPlayer('popup_hide', {
                action: 'resume',
                reason: 'popup_closed',
                detail: event.detail,
                priority: 'high' 
            });
            showNotification('▶️ 已恢复', 'info');
        });

        setInterval(() => {
            const currentPopupState = detectPopup();
            handlePopupStateChange(currentPopupState);
        }, 1000); 

        monitorMixButton();
        monitorDOMChanges();

        const initialPopupState = detectPopup();
        handlePopupStateChange(initialPopupState);

        detectAutoMixing();

        startHeartbeat();

        if (CONFIG.debug) {
            window.GuaGuaMonitor = {
                getState: () => ({
                    isWaitingForFile,
                    waitStartTime,
                    lastKnownFiles: Array.from(lastKnownFiles),
                    isPopupVisible,
                    wasPlayingBeforePopup
                }),
                sendEvent: sendEventToPlayer,
                config: CONFIG
            };

            log('🔧 调试模式已启用，可通过 window.GuaGuaMonitor 访问', 'info');
        }

        window.guaguaMonitor = {
            sendEvent: sendEventToPlayer,
            getState: () => ({
                isWaitingForFile,
                isPopupVisible,
                wasPlayingBeforePopup,
                timeSyncEnabled: timeSync.enabled,
                webPlayerFound: !!webAudioPlayer
            }),
            timeSync: {
                sendPlayerTime: sendPlayerTimeSync,
                enabled: () => timeSync.enabled,
                webPlayer: () => webAudioPlayer
            }
        };

        log('✅ 监测器初始化完成', 'info');
    }

    function startHeartbeat() {
        
        heartbeatInterval = setInterval(() => {
            sendEventToPlayer('heartbeat', {
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        }, 60000);

        sendEventToPlayer('heartbeat', {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });

        log('心跳机制已启动', 'debug');
    }

    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
            log('心跳机制已停止', 'info');
        }
    }

    window.addEventListener('beforeunload', () => {
        stopHeartbeat();
        if (navigationObserver) {
            navigationObserver.disconnect();
        }
    });

    function startWaitingForWaveform() {
        
        if (autoPauseState.isWaitingForWaveform) {
            log('已在等待波形，跳过', 'debug');
            return;
        }

        autoPauseState.hasAutoPaused = false;

        autoPauseState.isWaitingForWaveform = true;

        log('🎬 开始监测波形出现...', 'info');
        log(`当前页面: ${window.location.href}`, 'debug');

        const targetNode = document.body;
        const config = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        };

        const callback = function (mutationsList, observer) {
            
            const waveformPlayer = findWaveformPlayer();

            if (waveformPlayer) {
                
                const canvas = waveformPlayer.querySelector('canvas');
                const waveElement = waveformPlayer.querySelector('wave');

                if (canvas || waveElement) {
                    log('✅ 检测到波形出现', 'info');

                    setTimeout(() => {
                        autoPauseMixedAudio();

                        observer.disconnect();
                        autoPauseState.isWaitingForWaveform = false;
                    }, 100); 
                }
            }
        };

        autoPauseState.waveformObserver = new MutationObserver(callback);
        autoPauseState.waveformObserver.observe(targetNode, config);

        setTimeout(() => {
            if (autoPauseState.waveformObserver) {
                autoPauseState.waveformObserver.disconnect();
                autoPauseState.isWaitingForWaveform = false;
                log('波形监测超时，停止观察', 'debug');
            }
        }, 30000);
    }

    function findWaveformPlayer() {
        
        const playerSelectors = [
            '.audio-play-wave',
            '[class*="audio-play"]',
            '[class*="wave"]',
            '[class*="player"]'
        ];

        for (const selector of playerSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                if (rect.bottom > windowHeight - 200 && rect.bottom <= windowHeight + 50) {
                    return element;
                }
            }
        }

        return null;
    }

    function autoPauseMixedAudio(retryCount = 0) {
        if (autoPauseState.hasAutoPaused) {
            log('已经自动暂停过，跳过', 'debug');
            return;
        }

        const maxRetries = 80; 
        const retryDelay = 100; 

        try {
            
            const audioPlayBtn = document.querySelector('.audio-play-btn');

            if (audioPlayBtn) {
                
                const style = window.getComputedStyle(audioPlayBtn);
                const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                const isDisabled = audioPlayBtn.disabled || audioPlayBtn.classList.contains('is-disabled');

                if (isVisible && !isDisabled) {
                    
                    const pauseIcon = audioPlayBtn.querySelector('.el-icon-video-pause');

                    if (pauseIcon) {
                        log('✅ 检测到音频正在播放（暂停图标出现），准备点击暂停', 'info');

                        const mousedownEvent = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true
                        });
                        audioPlayBtn.dispatchEvent(mousedownEvent);
                        
                        audioPlayBtn.click();
                        
                        const mouseupEvent = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true
                        });
                        audioPlayBtn.dispatchEvent(mouseupEvent);

                        if (audioPlayBtn.__vue__ || audioPlayBtn.__vueParentComponent) {
                            log('检测到 Vue 组件，触发 Vue 事件', 'debug');
                        }
                        
                        setTimeout(() => {
                            audioPlayBtn.click();
                        }, 50);

                        autoPauseState.hasAutoPaused = true;
                        log('⏸️ 已自动暂停混音后的音频', 'info');
                        showNotification('⏸️ 已自动暂停', 'info');

                        return;
                    } else {
                        
                        const playIcon = audioPlayBtn.querySelector('.el-icon-video-play');
                        if (playIcon) {
                            if (retryCount < maxRetries) {
                                log(`音频尚未开始播放（播放图标），${retryDelay}ms 后重试 (${retryCount + 1}/${maxRetries})`, 'debug');
                                setTimeout(() => {
                                    autoPauseMixedAudio(retryCount + 1);
                                }, retryDelay);
                                return;
                            }
                        }
                    }
                }

                if (retryCount < maxRetries) {
                    log(`播放按钮未就绪，${retryDelay}ms 后重试 (${retryCount + 1}/${maxRetries})`, 'debug');
                    setTimeout(() => {
                        autoPauseMixedAudio(retryCount + 1);
                    }, retryDelay);
                    return;
                }
            } else {
                
                if (retryCount < maxRetries) {
                    log(`未找到播放按钮，${retryDelay}ms 后重试 (${retryCount + 1}/${maxRetries})`, 'debug');
                    setTimeout(() => {
                        autoPauseMixedAudio(retryCount + 1);
                    }, retryDelay);
                    return;
                }
            }

            if (retryCount >= maxRetries) {
                log('未能自动暂停（已达到最大重试次数）', 'warning');
            }

        } catch (error) {
            log('自动暂停失败: ' + error.message, 'error');

            if (retryCount < maxRetries) {
                setTimeout(() => {
                    autoPauseMixedAudio(retryCount + 1);
                }, retryDelay);
            }
        }
    }

    setupSPANavigationDetection();

    initMonitoring();

})();