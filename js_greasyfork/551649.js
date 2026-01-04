// ==UserScript==
// @name            Manus with Date (Enhanced)
// @name:en         Manus with Date (Enhanced)
// @name:zh-CN      Manus with Date (增强版)
// @namespace       https://github.com/manus-with-date
// @version         1.1.0
// @description     显示 Manus 历史对话时间 与 实时对话时间的 Tampermonkey 插件（增强版）。
// @description:zh-cn   显示 Manus 历史对话时间 与 实时对话时间的 Tampermonkey 插件（增强版）。
// @description:en  Tampermonkey plugin for displaying Manus historical and real-time conversation time (Enhanced).
// @author          Manus User
// @license         MIT
// @match           *://manus.im/*
// @match           *://*.manus.im/*
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_notification
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/551649/Manus%20with%20Date%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551649/Manus%20with%20Date%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置项 ====================
    const CONFIG = {
        // 调试模式
        DEBUG: GM_getValue('DEBUG', false),
        
        // 时间格式配置
        timeFormat: GM_getValue('timeFormat', 'YYYY-MM-DD HH:mm:ss'),
        
        // 时间标签样式
        timeTagStyle: GM_getValue('timeTagStyle', 'default'),
        
        // 时间标签位置 (before: 消息前, after: 消息后)
        timeTagPosition: GM_getValue('timeTagPosition', 'before'),
        
        // 是否显示相对时间 (例如: 3分钟前)
        showRelativeTime: GM_getValue('showRelativeTime', false),
        
        // 自动检测消息的间隔（毫秒）
        checkInterval: 1000,
        
        // 是否启用定期扫描
        enablePeriodicScan: GM_getValue('enablePeriodicScan', true),
        
        // 消息容器选择器（可能需要根据实际情况调整）
        messageContainerSelector: '[role="main"], main, .conversation-container, #conversation, [class*="conversation"], [class*="chat"]',
        
        // 消息项选择器（可能需要根据实际情况调整）
        messageItemSelector: '[data-message-id], .message-item, .message, [class*="message"], [data-testid*="message"]',
        
        // 用户消息选择器
        userMessageSelector: '[data-role="user"], .user-message, [class*="user"]',
        
        // AI 消息选择器
        aiMessageSelector: '[data-role="assistant"], .assistant-message, [class*="assistant"]',
        
        // 最大处理消息数（防止性能问题）
        maxProcessMessages: 100,
    };

    // ==================== 工具函数 ====================
    
    /**
     * 日志输出
     */
    function log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[Manus with Date]', new Date().toISOString(), ...args);
        }
    }

    /**
     * 错误日志
     */
    function logError(...args) {
        console.error('[Manus with Date ERROR]', new Date().toISOString(), ...args);
    }

    /**
     * 格式化时间
     */
    function formatTime(timestamp, format = CONFIG.timeFormat) {
        const date = new Date(timestamp);
        
        // 检查是否是有效日期
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
        // 12小时制
        const hours12 = date.getHours() % 12 || 12;
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        
        // 星期
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekdaysCN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[date.getDay()];
        const weekdayCN = weekdaysCN[date.getDay()];
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('hh', String(hours12).padStart(2, '0'))
            .replace('mm', minutes)
            .replace('ss', seconds)
            .replace('SSS', milliseconds)
            .replace('A', ampm)
            .replace('dddd', weekday)
            .replace('ddd', weekday.substring(0, 3))
            .replace('周', weekdayCN);
    }

    /**
     * 获取相对时间
     */
    function getRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        if (diff < 0) {
            return '刚刚';
        }
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (seconds < 60) {
            return '刚刚';
        } else if (minutes < 60) {
            return `${minutes}分钟前`;
        } else if (hours < 24) {
            return `${hours}小时前`;
        } else if (days < 30) {
            return `${days}天前`;
        } else if (months < 12) {
            return `${months}个月前`;
        } else {
            return `${years}年前`;
        }
    }

    /**
     * 创建时间标签 HTML
     */
    function createTimeTagHTML(timestamp) {
        const formattedTime = formatTime(timestamp);
        const relativeTime = CONFIG.showRelativeTime ? getRelativeTime(timestamp) : '';
        
        const displayText = CONFIG.showRelativeTime 
            ? `${relativeTime} (${formattedTime})`
            : formattedTime;
        
        const styles = {
            default: `
                <div class="manus-time-tag" style="
                    font-size: 12px;
                    color: #666;
                    margin: 4px 0;
                    padding: 2px 8px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    display: inline-block;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    user-select: none;
                    cursor: default;
                " title="${formattedTime}">
                    <span style="margin-right: 4px;">🕐</span>${displayText}
                </div>
            `,
            minimal: `
                <div class="manus-time-tag" style="
                    font-size: 11px;
                    color: #999;
                    margin: 2px 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    user-select: none;
                    cursor: default;
                " title="${formattedTime}">
                    ${displayText}
                </div>
            `,
            badge: `
                <div class="manus-time-tag" style="
                    font-size: 11px;
                    color: #fff;
                    margin: 4px 0;
                    padding: 2px 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    display: inline-block;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    user-select: none;
                    cursor: default;
                " title="${formattedTime}">
                    ${displayText}
                </div>
            `,
            card: `
                <div class="manus-time-tag" style="
                    font-size: 11px;
                    color: #555;
                    margin: 4px 0;
                    padding: 4px 10px;
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    display: inline-block;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    user-select: none;
                    cursor: default;
                " title="${formattedTime}">
                    <span style="color: #4a9eff; margin-right: 4px;">●</span>${displayText}
                </div>
            `,
        };
        
        return styles[CONFIG.timeTagStyle] || styles.default;
    }

    /**
     * 为消息添加时间标签
     */
    function addTimeTagToMessage(messageElement, timestamp) {
        try {
            // 检查是否已经添加过时间标签
            if (messageElement.querySelector('.manus-time-tag')) {
                return;
            }
            
            // 创建时间标签
            const timeTagHTML = createTimeTagHTML(timestamp);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = timeTagHTML;
            const timeTag = tempDiv.firstElementChild;
            
            // 根据配置决定插入位置
            if (CONFIG.timeTagPosition === 'after') {
                messageElement.appendChild(timeTag);
            } else {
                if (messageElement.firstChild) {
                    messageElement.insertBefore(timeTag, messageElement.firstChild);
                } else {
                    messageElement.appendChild(timeTag);
                }
            }
            
            log('添加时间标签:', messageElement, formatTime(timestamp));
        } catch (error) {
            logError('添加时间标签失败:', error);
        }
    }

    // ==================== 消息检测 ====================
    
    /**
     * 存储已处理的消息
     */
    const processedMessages = new Map(); // messageId -> timestamp

    /**
     * 获取消息的唯一标识
     */
    function getMessageId(messageElement) {
        // 尝试多种方式获取消息 ID
        return messageElement.getAttribute('data-message-id') ||
               messageElement.getAttribute('id') ||
               messageElement.getAttribute('data-id') ||
               messageElement.getAttribute('data-testid') ||
               `msg-${messageElement.textContent.substring(0, 50).replace(/\s/g, '')}`;
    }

    /**
     * 获取消息的时间戳
     */
    function getMessageTimestamp(messageElement) {
        // 尝试从 data 属性获取
        const dataTimestamp = messageElement.getAttribute('data-timestamp') ||
                            messageElement.getAttribute('data-time') ||
                            messageElement.getAttribute('data-created-at') ||
                            messageElement.getAttribute('data-created') ||
                            messageElement.getAttribute('timestamp');
        
        if (dataTimestamp) {
            const ts = new Date(dataTimestamp).getTime();
            if (!isNaN(ts)) {
                return ts;
            }
        }
        
        // 尝试从子元素的 time 标签获取
        const timeElement = messageElement.querySelector('time');
        if (timeElement) {
            const datetime = timeElement.getAttribute('datetime');
            if (datetime) {
                const ts = new Date(datetime).getTime();
                if (!isNaN(ts)) {
                    return ts;
                }
            }
        }
        
        // 检查是否已经处理过这个消息（使用缓存的时间戳）
        const messageId = getMessageId(messageElement);
        if (processedMessages.has(messageId)) {
            return processedMessages.get(messageId);
        }
        
        // 如果都没有，使用当前时间
        return Date.now();
    }

    /**
     * 处理单个消息
     */
    function processMessage(messageElement) {
        try {
            const messageId = getMessageId(messageElement);
            
            // 如果已经处理过，跳过
            if (processedMessages.has(messageId) && messageElement.querySelector('.manus-time-tag')) {
                return;
            }
            
            // 获取时间戳
            const timestamp = getMessageTimestamp(messageElement);
            
            // 添加时间标签
            addTimeTagToMessage(messageElement, timestamp);
            
            // 标记为已处理
            processedMessages.set(messageId, timestamp);
            
            log('处理消息:', messageId, formatTime(timestamp));
        } catch (error) {
            logError('处理消息失败:', error);
        }
    }

    /**
     * 扫描并处理所有消息
     */
    function scanMessages() {
        try {
            // 尝试多个可能的容器选择器
            const selectors = CONFIG.messageContainerSelector.split(',').map(s => s.trim());
            let container = null;
            
            for (const selector of selectors) {
                container = document.querySelector(selector);
                if (container) {
                    log('找到消息容器:', selector);
                    break;
                }
            }
            
            if (!container) {
                log('未找到消息容器，尝试使用 body');
                container = document.body;
            }
            
            // 查找所有消息
            const messageSelectors = CONFIG.messageItemSelector.split(',').map(s => s.trim());
            let messages = [];
            
            for (const selector of messageSelectors) {
                const found = container.querySelectorAll(selector);
                if (found.length > 0) {
                    messages = Array.from(found);
                    log('找到消息数量:', messages.length, '使用选择器:', selector);
                    break;
                }
            }
            
            if (messages.length === 0) {
                log('未找到消息');
                return;
            }
            
            // 限制处理数量
            if (messages.length > CONFIG.maxProcessMessages) {
                log(`消息数量过多 (${messages.length})，仅处理最近的 ${CONFIG.maxProcessMessages} 条`);
                messages = messages.slice(-CONFIG.maxProcessMessages);
            }
            
            // 处理每条消息
            messages.forEach(processMessage);
        } catch (error) {
            logError('扫描消息失败:', error);
        }
    }

    // ==================== MutationObserver ====================
    
    let observer = null;
    let observerPaused = false;

    /**
     * 监听 DOM 变化
     */
    function observeMessages() {
        if (observer) {
            observer.disconnect();
        }
        
        observer = new MutationObserver((mutations) => {
            if (observerPaused) {
                return;
            }
            
            let shouldScan = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否添加了消息相关的节点
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            shouldScan = true;
                            break;
                        }
                    }
                }
                
                if (shouldScan) break;
            }
            
            if (shouldScan) {
                log('检测到 DOM 变化，重新扫描消息');
                // 使用 requestIdleCallback 或 setTimeout 避免阻塞
                if (window.requestIdleCallback) {
                    requestIdleCallback(() => scanMessages());
                } else {
                    setTimeout(() => scanMessages(), 100);
                }
            }
        });
        
        // 观察整个 body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        
        log('开始监听 DOM 变化');
    }

    /**
     * 暂停/恢复观察器
     */
    function pauseObserver(pause = true) {
        observerPaused = pause;
        log(pause ? '暂停观察器' : '恢复观察器');
    }

    // ==================== Fetch 拦截 ====================
    
    /**
     * 拦截 fetch 请求以获取消息时间戳
     */
    function interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            
            // 克隆响应以便读取
            const clonedResponse = response.clone();
            
            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0].url;
                
                // 检查是否是消息相关的 API
                if (url && (
                    url.includes('/api/') || 
                    url.includes('/message') || 
                    url.includes('/conversation') ||
                    url.includes('/chat')
                )) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await clonedResponse.json();
                        log('拦截到 API 响应:', url, data);
                        
                        // 这里可以根据实际 API 结构提取时间戳
                        // 需要根据 Manus 的实际 API 格式调整
                        // 例如:
                        // if (data.messages) {
                        //     data.messages.forEach(msg => {
                        //         if (msg.id && msg.timestamp) {
                        //             processedMessages.set(msg.id, msg.timestamp);
                        //         }
                        //     });
                        // }
                    }
                }
            } catch (e) {
                // 忽略非 JSON 响应或其他错误
            }
            
            return response;
        };
        
        log('已拦截 fetch 请求');
    }

    // ==================== 用户交互检测 ====================
    
    let userInteracting = false;
    let interactionTimeout = null;

    /**
     * 检测用户交互
     */
    function setupInteractionDetection() {
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        
        const onInteraction = () => {
            if (!userInteracting) {
                userInteracting = true;
                pauseObserver(true);
                log('检测到用户交互，暂停处理');
            }
            
            // 重置超时
            if (interactionTimeout) {
                clearTimeout(interactionTimeout);
            }
            
            // 1秒后恢复处理
            interactionTimeout = setTimeout(() => {
                userInteracting = false;
                pauseObserver(false);
                log('用户交互结束，恢复处理');
                scanMessages();
            }, 1000);
        };
        
        events.forEach(event => {
            document.addEventListener(event, onInteraction, { passive: true });
        });
        
        log('已设置用户交互检测');
    }

    // ==================== 配置菜单 ====================
    
    /**
     * 保存配置
     */
    function saveConfig(key, value) {
        GM_setValue(key, value);
        CONFIG[key] = value;
    }

    /**
     * 注册菜单命令
     */
    function registerMenuCommands() {
        GM_registerMenuCommand('⏰ 切换时间格式', () => {
            const formats = [
                { name: 'YYYY-MM-DD HH:mm:ss', example: '2025-10-05 13:45:30' },
                { name: 'YYYY-MM-DD HH:mm:ss.SSS', example: '2025-10-05 13:45:30.874' },
                { name: 'MM/DD/YYYY hh:mm:ss A', example: '10/05/2025 01:45:30 PM' },
                { name: 'YYYY年MM月DD日 HH:mm:ss', example: '2025年10月05日 13:45:30' },
                { name: 'dddd, YYYY-MM-DD HH:mm:ss', example: 'Sunday, 2025-10-05 13:45:30' },
                { name: 'HH:mm:ss', example: '13:45:30' },
            ];
            
            const currentIndex = formats.findIndex(f => f.name === CONFIG.timeFormat);
            const nextIndex = (currentIndex + 1) % formats.length;
            const nextFormat = formats[nextIndex];
            
            saveConfig('timeFormat', nextFormat.name);
            
            alert(`时间格式已切换为:\n${nextFormat.name}\n示例: ${nextFormat.example}\n\n请刷新页面以应用更改`);
        });
        
        GM_registerMenuCommand('🎨 切换时间标签样式', () => {
            const styles = [
                { name: 'default', desc: '默认样式（带图标和背景）' },
                { name: 'minimal', desc: '简约样式（纯文字）' },
                { name: 'badge', desc: '徽章样式（渐变背景）' },
                { name: 'card', desc: '卡片样式（边框阴影）' },
            ];
            
            const currentIndex = styles.findIndex(s => s.name === CONFIG.timeTagStyle);
            const nextIndex = (currentIndex + 1) % styles.length;
            const nextStyle = styles[nextIndex];
            
            saveConfig('timeTagStyle', nextStyle.name);
            
            alert(`时间标签样式已切换为:\n${nextStyle.desc}\n\n请刷新页面以应用更改`);
        });
        
        GM_registerMenuCommand('📍 切换时间标签位置', () => {
            const newPosition = CONFIG.timeTagPosition === 'before' ? 'after' : 'before';
            saveConfig('timeTagPosition', newPosition);
            
            alert(`时间标签位置已切换为: ${newPosition === 'before' ? '消息前' : '消息后'}\n\n请刷新页面以应用更改`);
        });
        
        GM_registerMenuCommand('🕐 切换相对时间显示', () => {
            const newValue = !CONFIG.showRelativeTime;
            saveConfig('showRelativeTime', newValue);
            
            alert(`相对时间显示已${newValue ? '开启' : '关闭'}\n示例: ${newValue ? '3分钟前 (2025-10-05 13:45:30)' : '2025-10-05 13:45:30'}\n\n请刷新页面以应用更改`);
        });
        
        GM_registerMenuCommand('🔄 切换定期扫描', () => {
            const newValue = !CONFIG.enablePeriodicScan;
            saveConfig('enablePeriodicScan', newValue);
            
            alert(`定期扫描已${newValue ? '开启' : '关闭'}\n${newValue ? '将每秒扫描一次新消息' : '仅依赖 DOM 变化检测'}`);
            
            if (newValue) {
                startPeriodicScan();
            }
        });
        
        GM_registerMenuCommand('🐛 切换调试模式', () => {
            const newValue = !CONFIG.DEBUG;
            saveConfig('DEBUG', newValue);
            
            alert(`调试模式已${newValue ? '开启' : '关闭'}\n${newValue ? '将在控制台输出详细日志' : ''}`);
        });
        
        GM_registerMenuCommand('🗑️ 清除已处理消息缓存', () => {
            const count = processedMessages.size;
            processedMessages.clear();
            
            // 移除所有时间标签
            document.querySelectorAll('.manus-time-tag').forEach(tag => tag.remove());
            
            alert(`已清除 ${count} 条消息缓存\n将重新处理所有消息`);
            
            scanMessages();
        });
        
        GM_registerMenuCommand('ℹ️ 关于插件', () => {
            alert(`Manus with Date (Enhanced) v1.1.0

功能:
• 显示历史和实时消息时间戳
• 多种时间格式和显示样式
• 相对时间显示（如"3分钟前"）
• 自动检测新消息
• 性能优化（用户交互时暂停）

作者: Manus User
许可: MIT License

参考项目: ChatGPT with Date
https://github.com/jiang-taibai/chatgpt-with-date`);
        });
    }

    // ==================== 定期扫描 ====================
    
    let periodicScanInterval = null;

    /**
     * 启动定期扫描
     */
    function startPeriodicScan() {
        if (periodicScanInterval) {
            clearInterval(periodicScanInterval);
        }
        
        if (CONFIG.enablePeriodicScan) {
            periodicScanInterval = setInterval(() => {
                if (!userInteracting) {
                    scanMessages();
                }
            }, CONFIG.checkInterval);
            
            log('已启动定期扫描');
        }
    }

    // ==================== 初始化 ====================
    
    /**
     * 初始化插件
     */
    function init() {
        log('Manus with Date (Enhanced) 插件初始化...');
        log('配置:', CONFIG);
        
        // 注册菜单命令
        registerMenuCommands();
        
        // 拦截 fetch 请求
        interceptFetch();
        
        // 设置用户交互检测
        setupInteractionDetection();
        
        // 等待页面加载完成后开始扫描
        const startScanning = () => {
            log('开始扫描消息...');
            
            // 延迟执行，确保页面完全加载
            setTimeout(() => {
                scanMessages();
                observeMessages();
                startPeriodicScan();
            }, 1500);
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startScanning);
        } else {
            startScanning();
        }
        
        log('Manus with Date (Enhanced) 插件初始化完成');
    }

    // 启动插件
    init();

})();
