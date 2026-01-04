// ==UserScript==
// @name         夸克资源助手
// @namespace    http://tampermonkey.net/
// @version      5.1.1
// @description  单面板多标签页设计，集成智能回帖和资源采集功能。支持快速回帖、批量回帖(1-50个)、智能去重、随机回复内容；支持内容提取、图片Base64转换、文章状态检测、多账号切换、服务器上传。可拖拽面板，可最小化为圆形按钮，标签页状态记忆。
// @match        https://kuafuzys.net/*
// @match        https://www.kuafuzy.com/*
// @match        https://www.kuakesou.com/*
// @match        https://www.kuakeq.com/*
// @match        https://kuakezy.cc/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @author       PYY
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554042/%E5%A4%B8%E5%85%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554042/%E5%A4%B8%E5%85%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 配置模块
    // ========================================
    const CONFIG = {
        // 选择器配置
        selectors: {
            replyTextarea: '#message',
            replySubmitBtn: '#submit',
            threadList: 'ul.threadlist li.media.thread .style3_subject a[href^="thread-"]'
        },

        // 随机回复内容池
        replyTemplates: [
            "感谢分享，非常不错的资源！",
            "太棒了，正好需要这个！",
            "优秀的内容，支持楼主！",
            "收藏了，感谢分享！",
            "这个资源很实用，赞一个！",
            "好东西，感谢楼主的分享！",
            "非常感谢，辛苦了！",
            "很有帮助，支持一下！"
        ],

        // 延迟配置（毫秒）
        delays: {
            beforeSubmit: 800,      // 提交前等待
            afterSubmit: 2000,      // 提交后等待
            betweenPosts: 3000,     // 批量回帖间隔
            pageLoad: 1000          // 页面加载等待
        },

        // 限制配置
        limits: {
            maxBatchCount: 50,      // 单次批量最大数量
            maxLogEntries: 100,     // 最大日志条数
            maxPageAttempts: 30     // 最大翻页尝试
        },

        // 存储键名
        storageKeys: {
            repliedThreads: 'replied_threads_v5',
            batchQueue: 'batch_queue_v5',
            batchMode: 'batch_mode_v5',
            batchCount: 'batch_count_v5',
            logs: 'logs_v5',
            statusText: 'status_text_v5',
            failedAttempts: 'failed_attempts_v5',
            bindCookieId: 'quark_tool_bindCookieId',
            currentTab: 'current_tab_v5',
            panelMinimized: 'panel_minimized_v5'
        },

        // 采集配置
        collection: {
            serverUrl: "https://zys.52huahua.cn/api/biz/collection/save",
            checkUrl: "https://zys.52huahua.cn/api/biz/collection/isExist",
            platform: "kkwpzys",
            accounts: [
                { label: "我想我是海", value: "1896186752012374017" },
                { label: "书生", value: "1900922270486798338" },
                { label: "海海游戏社", value: "1900354501367640065" }
            ]
        }
    };

    // ========================================
    // 工具函数模块
    // ========================================
    const Utils = {
        // 延迟函数
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        // 随机延迟
        randomDelay: (min, max) => {
            const ms = min + Math.random() * (max - min);
            return Utils.delay(ms);
        },

        // 获取随机回复内容
        getRandomReply: () => {
            const templates = CONFIG.replyTemplates;
            return templates[Math.floor(Math.random() * templates.length)];
        },

        // 解析帖子ID
        parseThreadId: (url) => {
            const match = url.match(/thread-(\d+)(-\d+-\d+)?\.htm/);
            return match ? match[1] : null;
        },

        // 检查是否为帖子详情页
        isThreadPage: () => {
            return /\/thread-\d+(-\d+-\d+)?\.htm/.test(location.href);
        },

        // 检查是否为用户列表页
        isUserListPage: () => {
            return /\/user-thread-\d+(-\d+)?\.htm/.test(location.href);
        },

        // 格式化日期为 YYYY-MM-DD HH:mm:ss
        formatDateTime: (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },

        // XPath 辅助函数 - 获取单个元素
        getElementByXPath: (xpath) => {
            try {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue;
            } catch (e) {
                console.error("XPath 错误:", e);
                return null;
            }
        },

        // XPath 辅助函数 - 获取所有匹配的元素
        getElementsByXPath: (xpath) => {
            try {
                const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                const elements = [];
                for (let i = 0; i < result.snapshotLength; i++) {
                    elements.push(result.snapshotItem(i));
                }
                return elements;
            } catch (e) {
                console.error("XPath 错误:", e);
                return [];
            }
        }
    };

    // ========================================
    // 存储管理模块
    // ========================================
    const Storage = {
        // 获取已回帖列表
        getRepliedThreads: () => {
            return GM_getValue(CONFIG.storageKeys.repliedThreads, []) || [];
        },

        // 添加已回帖记录
        addRepliedThread: (tid) => {
            const replied = Storage.getRepliedThreads();
            if (!replied.includes(tid)) {
                replied.push(tid);
                GM_setValue(CONFIG.storageKeys.repliedThreads, replied);
            }
        },

        // 检查是否已回帖
        isReplied: (tid) => {
            return Storage.getRepliedThreads().includes(tid);
        },

        // 清空已回帖记录
        clearRepliedThreads: () => {
            GM_setValue(CONFIG.storageKeys.repliedThreads, []);
        },

        // 获取批量队列
        getBatchQueue: () => {
            return GM_getValue(CONFIG.storageKeys.batchQueue, []) || [];
        },

        // 保存批量队列
        saveBatchQueue: (queue) => {
            GM_setValue(CONFIG.storageKeys.batchQueue, queue);
        },

        // 获取批量模式状态
        isBatchMode: () => {
            return GM_getValue(CONFIG.storageKeys.batchMode, false);
        },

        // 设置批量模式
        setBatchMode: (enabled) => {
            GM_setValue(CONFIG.storageKeys.batchMode, enabled);
        },

        // 获取批量剩余数量
        getBatchCount: () => {
            return GM_getValue(CONFIG.storageKeys.batchCount, 0);
        },

        // 设置批量剩余数量
        setBatchCount: (count) => {
            GM_setValue(CONFIG.storageKeys.batchCount, count);
        },

        // 获取日志
        getLogs: () => {
            return GM_getValue(CONFIG.storageKeys.logs, []) || [];
        },

        // 保存日志
        saveLogs: (logs) => {
            GM_setValue(CONFIG.storageKeys.logs, logs);
        },

        // 添加日志
        addLog: (message, type) => {
            const logs = Storage.getLogs();
            const time = new Date().toLocaleTimeString();
            logs.unshift({ time, message, type });
            // 限制日志数量
            if (logs.length > CONFIG.limits.maxLogEntries) {
                logs.pop();
            }
            Storage.saveLogs(logs);
        },

        // 清空日志
        clearLogs: () => {
            GM_setValue(CONFIG.storageKeys.logs, []);
        },

        // 获取状态文本
        getStatusText: () => {
            return GM_getValue(CONFIG.storageKeys.statusText, '待机中');
        },

        // 设置状态文本
        setStatusText: (text) => {
            GM_setValue(CONFIG.storageKeys.statusText, text);
        },

        // 获取失败尝试次数
        getFailedAttempts: () => {
            return GM_getValue(CONFIG.storageKeys.failedAttempts, 0);
        },

        // 设置失败尝试次数
        setFailedAttempts: (count) => {
            GM_setValue(CONFIG.storageKeys.failedAttempts, count);
        },

        // 重置失败尝试次数
        resetFailedAttempts: () => {
            GM_setValue(CONFIG.storageKeys.failedAttempts, 0);
        }
    };

    // ========================================
    // 采集数据模块
    // ========================================
    const CollectionData = {
        data: null,

        // 初始化采集数据
        init: () => {
            CollectionData.data = {
                collectionPlatform: CONFIG.collection.platform,
                resourceLink: null,
                title: null,
                username: null,
                uid: null,
                content: null,
                node: null,
                tags: null,
                quarkLink: null,
                status: "1",
                createTime: Utils.formatDateTime(new Date()),
                createUser: "1543837863788879871",
                deleteFlag: "NOT_DELETE",
                bindCookieId: localStorage.getItem(CONFIG.storageKeys.bindCookieId) || CONFIG.collection.accounts[0].value
            };
        },

        // 获取采集数据
        get: () => CollectionData.data,

        // 重置采集数据
        reset: () => CollectionData.init()
    };

    // ========================================
    // UI模块
    // ========================================
    const UI = {
        panel: null,
        logContainer: null,
        collectionLogArea: null,
        currentTab: 'reply', // 当前激活的标签页

        // 初始化样式
        initStyles: () => {
            GM_addStyle(`
                #unifiedPanel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    width: 380px;
                    background: #ffffff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 14px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                }

                #unifiedPanel.minimized {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    max-height: none;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                #unifiedPanel.minimized .panel-header {
                    border-radius: 50%;
                    padding: 0;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                #unifiedPanel.minimized .panel-header h3 {
                    font-size: 24px;
                    margin: 0;
                }

                #unifiedPanel.minimized .panel-header > div {
                    display: none;
                }

                #unifiedPanel.minimized .tab-nav,
                #unifiedPanel.minimized .tab-content {
                    display: none;
                }
                
                #unifiedPanel .panel-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 15px;
                    border-radius: 8px 8px 0 0;
                    cursor: move;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #unifiedPanel .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                /* 标签页导航 */
                #unifiedPanel .tab-nav {
                    display: flex;
                    background: #f5f5f5;
                    border-bottom: 2px solid #e0e0e0;
                }

                #unifiedPanel .tab-nav button {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #666;
                    transition: all 0.3s;
                    border-bottom: 3px solid transparent;
                }

                #unifiedPanel .tab-nav button:hover {
                    background: #e8e8e8;
                    color: #333;
                }

                #unifiedPanel .tab-nav button.active {
                    color: #667eea;
                    background: #fff;
                    border-bottom-color: #667eea;
                }

                /* 标签页内容 */
                #unifiedPanel .tab-content {
                    display: none;
                    padding: 15px;
                    overflow-y: auto;
                    flex: 1;
                }

                #unifiedPanel .tab-content.active {
                    display: block;
                }

                /* 通用样式 */
                #unifiedPanel .btn-group {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                
                #unifiedPanel button:not(.tab-nav button) {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                #unifiedPanel button.primary {
                    background: #667eea;
                    color: white;
                }
                
                #unifiedPanel button.primary:hover {
                    background: #5568d3;
                }
                
                #unifiedPanel button.secondary {
                    background: #f5f5f5;
                    color: #333;
                }
                
                #unifiedPanel button.secondary:hover {
                    background: #e8e8e8;
                }
                
                #unifiedPanel button.danger {
                    background: #ef5350;
                    color: white;
                }
                
                #unifiedPanel button.danger:hover {
                    background: #e53935;
                }
                
                #unifiedPanel button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                #unifiedPanel .input-group {
                    margin-bottom: 12px;
                }
                
                #unifiedPanel input, #unifiedPanel select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 13px;
                    box-sizing: border-box;
                }
                
                #unifiedPanel input:focus, #unifiedPanel select:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                #unifiedPanel .divider {
                    height: 1px;
                    background: #e0e0e0;
                    margin: 12px 0;
                }
                
                #unifiedPanel .log-container, #unifiedPanel .log-area {
                    max-height: 200px;
                    overflow-y: auto;
                    background: #f9f9f9;
                    border-radius: 5px;
                    padding: 8px;
                    font-size: 12px;
                }
                
                #unifiedPanel .log-entry {
                    margin: 4px 0;
                    padding: 4px 6px;
                    border-radius: 3px;
                    line-height: 1.4;
                }
                
                #unifiedPanel .log-entry.info {
                    color: #333;
                }
                
                #unifiedPanel .log-entry.success {
                    color: #2e7d32;
                    background: #e8f5e9;
                }
                
                #unifiedPanel .log-entry.error {
                    color: #c62828;
                    background: #ffebee;
                }
                
                #unifiedPanel .log-entry .time {
                    color: #999;
                    font-size: 11px;
                    margin-right: 6px;
                }
                
                #unifiedPanel .status-bar, #unifiedPanel .status-container {
                    padding: 8px 12px;
                    background: #f5f5f5;
                    border-radius: 5px;
                    margin-bottom: 12px;
                    font-size: 12px;
                    color: #666;
                }
                
                #unifiedPanel .status-bar .label {
                    font-weight: 600;
                    color: #333;
                }

                #unifiedPanel .status-light {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #ccc;
                    display: inline-block;
                    margin-left: 10px;
                    vertical-align: middle;
                    transition: background 0.3s ease;
                }

                #unifiedPanel .status-text {
                    margin-left: 5px;
                    vertical-align: middle;
                    font-size: 12px;
                    color: #666;
                }
            `);
        },

        // 创建统一面板
        createPanel: () => {
            const panel = document.createElement('div');
            panel.id = 'unifiedPanel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>🚀 夸克资源助手</h3>
                    <div>
                        <span style="cursor: pointer; margin-right: 10px;" id="panelMinimize">−</span>
                        <span style="cursor: pointer;" id="panelClose">✕</span>
                    </div>
                </div>
                
                <!-- 标签页导航 -->
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="reply">💬 回帖</button>
                    <button class="tab-btn" data-tab="collection">📦 采集</button>
                </div>
                
                <!-- 回帖标签页 -->
                <div class="tab-content active" id="tab-reply">
                    <div class="status-bar">
                        <span class="label">状态：</span><span id="statusText">待机中</span>
                    </div>
                    
                    <div class="input-group">
                        <input type="number" id="userIdInput" placeholder="输入用户ID">
                    </div>
                    
                    <div class="btn-group">
                        <button class="secondary" id="btnGoToUser">跳转列表</button>
                        <button class="primary" id="btnQuickReply">快速回帖</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-group">
                        <button class="secondary" id="btnBatchReply">批量回帖</button>
                    </div>
                    
                    <div class="input-group" id="batchInputGroup" style="display:none;">
                        <input type="number" id="batchCount" placeholder="输入批量回帖数量 (1-50)" min="1" max="50">
                    </div>
                    
                    <div class="btn-group" id="batchControlGroup" style="display:none;">
                        <button class="primary" id="btnStartBatch">开始批量</button>
                        <button class="danger" id="btnStopBatch">停止</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-group">
                        <button class="secondary" id="btnClearHistory">清空记录</button>
                        <button class="secondary" id="btnViewStats">查看统计</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="log-container" id="logContainer"></div>
                </div>
                
                <!-- 采集标签页 -->
                <div class="tab-content" id="tab-collection">
                    <div class="status-container">
                        <strong>文章状态：</strong>
                        <div class="status-light" id="status-light"></div>
                        <span class="status-text" id="status-text">未检查</span>
                    </div>
                    
                    <div class="input-group">
                        <label style="display:block;margin-bottom:5px;font-weight:500;">绑定账号</label>
                        <select id="account-selector"></select>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-group">
                        <button class="primary" id="btnQuickReply2">快速回帖</button>
                        <button class="primary" id="btnExtract">提取内容</button>
                    </div>
                    
                    <div class="btn-group">
                        <button class="secondary" id="btnShowData">查看数据</button>
                        <button class="secondary" id="btnUpload">上传服务器</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="log-area" id="collectionLogArea"></div>
                </div>
            `;
            
            document.body.appendChild(panel);
            UI.panel = panel;
            UI.logContainer = panel.querySelector('#logContainer');
            UI.collectionLogArea = panel.querySelector('#collectionLogArea');
            
            // 恢复上次使用的标签页
            const savedTab = GM_getValue(CONFIG.storageKeys.currentTab, 'reply');
            UI.currentTab = savedTab;
            
            // 如果保存的不是默认标签，需要切换
            if (savedTab !== 'reply') {
                const tabBtns = panel.querySelectorAll('.tab-nav button');
                const tabContents = panel.querySelectorAll('.tab-content');
                
                tabBtns.forEach(btn => {
                    if (btn.getAttribute('data-tab') === savedTab) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                tabContents.forEach(content => {
                    if (content.id === `tab-${savedTab}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            }
            
            // 恢复最小化状态
            const isMinimized = GM_getValue(CONFIG.storageKeys.panelMinimized, false);
            if (isMinimized) {
                panel.classList.add('minimized');
                // 最小化状态下按钮会被隐藏，所以不需要改变文本
            }
            
            // 初始化采集账号选择器
            UI.initAccountSelector();
            
            // 绑定事件
            UI.bindEvents();
            UI.bindTabEvents();
            
            // 使面板可拖拽
            UI.makeDraggable(panel, panel.querySelector('.panel-header'));
        },

        // 绑定事件
        bindEvents: () => {
            // 跳转到用户列表页
            document.getElementById('btnGoToUser').onclick = () => {
                const userId = document.getElementById('userIdInput').value.trim();
                if (!userId) {
                    UI.log('请输入用户ID', 'error');
                    return;
                }
                if (!/^\d+$/.test(userId)) {
                    UI.log('用户ID必须是数字', 'error');
                    return;
                }
                UI.log(`跳转到用户 ${userId} 的帖子列表`, 'info');
                // 使用当前域名而不是硬编码
                const currentOrigin = window.location.origin;
                location.href = `${currentOrigin}/user-thread-${userId}.htm`;
            };
            
            // 快速回帖按钮
            document.getElementById('btnQuickReply').onclick = () => {
                ReplyHandler.quickReply();
            };
            
            // 批量回帖按钮
            document.getElementById('btnBatchReply').onclick = () => {
                UI.toggleBatchMode();
            };
            
            // 开始批量
            document.getElementById('btnStartBatch').onclick = () => {
                const count = parseInt(document.getElementById('batchCount').value);
                if (!count || count < 1 || count > CONFIG.limits.maxBatchCount) {
                    UI.log(`请输入有效的数量 (1-${CONFIG.limits.maxBatchCount})`, 'error');
                    return;
                }
                ReplyHandler.startBatch(count);
            };
            
            // 停止批量
            document.getElementById('btnStopBatch').onclick = () => {
                ReplyHandler.stopBatch();
            };
            
            // 清空记录
            document.getElementById('btnClearHistory').onclick = () => {
                if (confirm('确定要清空所有回帖记录、日志和队列吗？')) {
                    Storage.clearRepliedThreads();
                    Storage.clearLogs();
                    Storage.saveBatchQueue([]);
                    Storage.setBatchMode(false);
                    Storage.setBatchCount(0);
                    Storage.resetFailedAttempts();
                    if (UI.logContainer) {
                        UI.logContainer.innerHTML = '';
                    }
                    UI.log('已清空所有记录', 'success');
                    UI.updateStatus('待机中');
                    UI.setButtonsDisabled(false);
                }
            };
            
            // 查看统计
            document.getElementById('btnViewStats').onclick = () => {
                const replied = Storage.getRepliedThreads();
                UI.log(`已回帖数量：${replied.length} 个`, 'info');
            };
            
            // 最小化/最大化面板
            const toggleMinimize = (forceRestore = false) => {
                const isMinimized = UI.panel.classList.contains('minimized');
                const minimizeBtn = document.getElementById('panelMinimize');
                
                if (isMinimized || forceRestore) {
                    // 恢复 - 重置位置到右上角避免溢出
                    UI.panel.classList.remove('minimized');
                    UI.panel.style.top = '100px';
                    UI.panel.style.right = '20px';
                    UI.panel.style.left = 'auto';
                    if (minimizeBtn) minimizeBtn.textContent = '−';
                    GM_setValue(CONFIG.storageKeys.panelMinimized, false);
                } else {
                    // 最小化
                    UI.panel.classList.add('minimized');
                    if (minimizeBtn) minimizeBtn.textContent = '−';
                    GM_setValue(CONFIG.storageKeys.panelMinimized, true);
                }
            };

            // 最小化按钮点击
            document.getElementById('panelMinimize').onclick = (e) => {
                e.stopPropagation();
                toggleMinimize();
            };

            // 最小化状态下点击面板头部恢复（但拖拽时不展开）
            UI.panel.querySelector('.panel-header').addEventListener('click', (e) => {
                if (UI.panel.classList.contains('minimized')) {
                    // 检查是否刚刚拖拽过
                    if (UI.panel._hasMoved && UI.panel._hasMoved()) {
                        return; // 如果是拖拽，不展开
                    }
                    e.stopPropagation();
                    toggleMinimize(true);
                }
            });

            // 关闭面板
            document.getElementById('panelClose').onclick = () => {
                UI.panel.style.display = 'none';
            };

            // 采集功能按钮
            document.getElementById('btnQuickReply2').onclick = () => ReplyHandler.quickReply();
            document.getElementById('btnExtract').onclick = () => Collector.extractAll();
            document.getElementById('btnUpload').onclick = () => Collector.uploadServer();
            document.getElementById('btnShowData').onclick = () => Collector.showData();
        },

        // 绑定标签页切换事件
        bindTabEvents: () => {
            const tabBtns = UI.panel.querySelectorAll('.tab-nav button');
            const tabContents = UI.panel.querySelectorAll('.tab-content');
            
            console.log('绑定标签页事件，找到按钮数量：', tabBtns.length);
            
            tabBtns.forEach((btn, index) => {
                console.log(`按钮${index}:`, btn.getAttribute('data-tab'));
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTab = btn.getAttribute('data-tab');
                    console.log('点击标签：', targetTab);
                    
                    // 移除所有active类
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // 添加active类到当前标签
                    btn.classList.add('active');
                    const targetContent = document.getElementById(`tab-${targetTab}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        console.log('切换到标签：', targetTab);
                    } else {
                        console.error('未找到标签内容：', `tab-${targetTab}`);
                    }
                    
                    // 保存当前标签到本地存储
                    UI.currentTab = targetTab;
                    GM_setValue(CONFIG.storageKeys.currentTab, targetTab);
                });
            });
        },

        // 初始化账号选择器
        initAccountSelector: () => {
            const accountSelect = document.getElementById('account-selector');
            if (!accountSelect) return;
            
            CONFIG.collection.accounts.forEach(({ label, value }) => {
                const option = document.createElement('option');
                option.textContent = label;
                option.value = value;
                accountSelect.appendChild(option);
            });
            
            const savedBindCookieId = localStorage.getItem(CONFIG.storageKeys.bindCookieId);
            const isValid = CONFIG.collection.accounts.some(acc => acc.value === savedBindCookieId);
            accountSelect.value = isValid ? savedBindCookieId : CONFIG.collection.accounts[0].value;
            
            // 确保 CollectionData.data 已初始化
            if (CollectionData.data) {
                CollectionData.data.bindCookieId = accountSelect.value;
            }
            
            accountSelect.addEventListener('change', (e) => {
                if (CollectionData.data) {
                    CollectionData.data.bindCookieId = e.target.value;
                }
                localStorage.setItem(CONFIG.storageKeys.bindCookieId, e.target.value);
                UI.addCollectionLog('已切换到账号: ' + e.target.options[e.target.selectedIndex].text);
            });
        },

        // 切换批量模式UI
        toggleBatchMode: () => {
            const inputGroup = document.getElementById('batchInputGroup');
            const controlGroup = document.getElementById('batchControlGroup');
            const isVisible = inputGroup.style.display !== 'none';
            
            inputGroup.style.display = isVisible ? 'none' : 'block';
            controlGroup.style.display = isVisible ? 'none' : 'flex';
        },

        // 使面板可拖拽
        makeDraggable: () => {
            const header = UI.panel.querySelector('.panel-header');
            let isDragging = false;
            let hasMoved = false;
            let currentX, currentY, initialX, initialY;
            
            header.addEventListener('mousedown', (e) => {
                if (e.target.id === 'panelClose' || e.target.id === 'panelMinimize') return;
                isDragging = true;
                hasMoved = false;
                initialX = e.clientX - UI.panel.offsetLeft;
                initialY = e.clientY - UI.panel.offsetTop;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                hasMoved = true;
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                UI.panel.style.left = currentX + 'px';
                UI.panel.style.top = currentY + 'px';
                UI.panel.style.right = 'auto';
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                // 重置移动标记，延迟一点以便点击事件能检测到
                setTimeout(() => {
                    hasMoved = false;
                }, 100);
            });
            
            // 保存 hasMoved 状态供点击事件使用
            UI.panel._hasMoved = () => hasMoved;
        },

        // 记录日志
        log: (message, type = 'info') => {
            // 保存到存储
            Storage.addLog(message, type);
            
            // 显示到UI
            if (UI.logContainer) {
                const entry = document.createElement('div');
                entry.className = `log-entry ${type}`;
                const time = new Date().toLocaleTimeString();
                entry.innerHTML = `<span class="time">${time}</span>${message}`;
                
                UI.logContainer.insertBefore(entry, UI.logContainer.firstChild);
                
                // 限制日志数量
                const entries = UI.logContainer.querySelectorAll('.log-entry');
                if (entries.length > CONFIG.limits.maxLogEntries) {
                    entries[entries.length - 1].remove();
                }
            }
            
            console.log(`[回帖助手] ${message}`);
        },

        // 更新状态
        updateStatus: (text) => {
            // 保存到存储
            Storage.setStatusText(text);
            
            // 显示到UI
            const statusText = document.getElementById('statusText');
            if (statusText) {
                statusText.textContent = text;
            }
        },

        // 恢复日志
        restoreLogs: () => {
            const logs = Storage.getLogs();
            if (UI.logContainer && logs.length > 0) {
                UI.logContainer.innerHTML = '';
                logs.forEach(log => {
                    const entry = document.createElement('div');
                    entry.className = `log-entry ${log.type}`;
                    entry.innerHTML = `<span class="time">${log.time}</span>${log.message}`;
                    UI.logContainer.appendChild(entry);
                });
            }
        },

        // 恢复状态
        restoreStatus: () => {
            const statusText = Storage.getStatusText();
            UI.updateStatus(statusText);
        },

        // 禁用/启用按钮
        setButtonsDisabled: (disabled) => {
            const buttons = UI.panel.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.id !== 'btnStopBatch') {
                    btn.disabled = disabled;
                }
            });
        },

        // 添加采集日志
        addCollectionLog: (msg) => {
            console.log(`[采集工具] ${msg}`);
            if (UI.collectionLogArea) {
                const p = document.createElement('div');
                p.textContent = msg;
                UI.collectionLogArea.appendChild(p);
                UI.collectionLogArea.scrollTop = UI.collectionLogArea.scrollHeight;
            }
        },

        // 更新状态灯
        updateStatusLight: (color, text) => {
            const light = document.getElementById('status-light');
            const textSpan = document.getElementById('status-text');
            if (light) light.style.background = color;
            if (textSpan) textSpan.textContent = text;
        }
    };

    // ========================================
    // 回帖处理模块
    // ========================================
    const ReplyHandler = {
        // 快速回帖（当前页面）
        quickReply: async () => {
            if (!Utils.isThreadPage()) {
                UI.log('请在帖子详情页使用快速回帖功能', 'error');
                return;
            }
            
            const tid = Utils.parseThreadId(location.href);
            if (!tid) {
                UI.log('无法解析帖子ID', 'error');
                return;
            }
            
            if (Storage.isReplied(tid)) {
                UI.log('该帖子已回复过，跳过', 'error');
                return;
            }
            
            UI.updateStatus('正在回帖...');
            UI.setButtonsDisabled(true);
            
            try {
                await ReplyHandler.submitReply(tid);
                UI.log('回帖成功！', 'success');
                UI.updateStatus('回帖完成');
            } catch (error) {
                UI.log(`回帖失败：${error.message}`, 'error');
                UI.updateStatus('回帖失败');
            } finally {
                UI.setButtonsDisabled(false);
            }
        },

        // 提交回复
        submitReply: async (tid) => {
            const textarea = document.querySelector(CONFIG.selectors.replyTextarea);
            const submitBtn = document.querySelector(CONFIG.selectors.replySubmitBtn);
            
            if (!textarea || !submitBtn) {
                throw new Error('未找到回复框或提交按钮');
            }
            
            // 填充随机内容
            const replyText = Utils.getRandomReply();
            textarea.value = replyText;
            
            // 触发事件
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            
            UI.log(`回复内容：${replyText}`, 'info');
            
            // 等待后提交
            await Utils.delay(CONFIG.delays.beforeSubmit);
            submitBtn.click();
            
            // 标记已回复
            Storage.addRepliedThread(tid);
            
            // 等待提交完成
            await Utils.delay(CONFIG.delays.afterSubmit);
        },

        // 开始批量回帖
        startBatch: async (count) => {
            if (!Utils.isUserListPage()) {
                UI.log('请在用户帖子列表页使用批量回帖功能', 'error');
                return;
            }
            
            // 获取所有未回复的帖子
            const threadLinks = document.querySelectorAll(CONFIG.selectors.threadList);
            const unrepliedLinks = Array.from(threadLinks)
                .map(link => ({
                    url: link.href,
                    tid: Utils.parseThreadId(link.href)
                }))
                .filter(item => item.tid && !Storage.isReplied(item.tid));
            
            if (unrepliedLinks.length === 0) {
                UI.log('当前页面没有未回复的帖子', 'error');
                return;
            }
            
            // 从所有未回复的帖子中随机选择 count 个
            const shuffled = unrepliedLinks.sort(() => Math.random() - 0.5);
            const targetLinks = shuffled.slice(0, Math.min(count, unrepliedLinks.length));
            const queue = targetLinks.map(item => item.url);
            
            // 保存队列
            Storage.saveBatchQueue(queue);
            Storage.setBatchMode(true);
            Storage.setBatchCount(queue.length);
            Storage.resetFailedAttempts();
            
            UI.log(`从 ${unrepliedLinks.length} 个未回复帖子中随机选择了 ${queue.length} 个`, 'success');
            UI.log(`开始批量回帖，队列中有 ${queue.length} 个帖子`, 'success');
            UI.updateStatus(`批量模式：剩余 ${queue.length} 个帖子`);
            UI.setButtonsDisabled(true);
            
            await ReplyHandler.processBatch();
        },

        // 处理批量回帖
        processBatch: async () => {
            if (!Storage.isBatchMode()) {
                return;
            }
            
            // 从队列获取下一个帖子
            let queue = Storage.getBatchQueue();
            
            if (queue.length === 0) {
                UI.log('🎉 批量回帖全部完成！', 'success');
                ReplyHandler.stopBatch();
                return;
            }
            
            // 取第一个（队列已在startBatch时随机打乱）
            const nextUrl = queue[0];
            const tid = Utils.parseThreadId(nextUrl);
            
            UI.log(`→ 准备回复帖子：${tid} (队列剩余 ${queue.length})`, 'info');
            UI.updateStatus(`批量模式：剩余 ${queue.length} 个帖子`);
            
            // 从队列中移除第一个（访问前就删除，避免重复）
            queue.shift();
            Storage.saveBatchQueue(queue);
            Storage.setBatchCount(queue.length);
            
            // 跳转到帖子页面
            location.href = nextUrl;
        },

        // 停止批量回帖
        stopBatch: () => {
            Storage.setBatchMode(false);
            Storage.setBatchCount(0);
            Storage.saveBatchQueue([]);
            Storage.resetFailedAttempts();
            UI.log('已停止批量回帖', 'success');
            UI.updateStatus('待机中');
            UI.setButtonsDisabled(false);
        },

        // 在帖子页面自动回帖（批量模式）
        autoReplyInThread: async () => {
            if (!Storage.isBatchMode()) return;
            
            const tid = Utils.parseThreadId(location.href);
            if (!tid) {
                UI.log('无法解析帖子ID', 'error');
                return;
            }
            
            if (Storage.isReplied(tid)) {
                UI.log(`帖子 ${tid} 已回复过，跳过`, 'info');
                await Utils.delay(1000);
                // 已经从队列中移除了，直接返回继续下一个
                history.back();
                return;
            }
            
            UI.updateStatus('正在自动回帖...');
            
            try {
                await Utils.delay(CONFIG.delays.pageLoad);
                await ReplyHandler.submitReply(tid);
                
                const remaining = Storage.getBatchCount();
                
                UI.log(`✓ 帖子 ${tid} 回复成功，剩余 ${remaining} 个帖子`, 'success');
                UI.updateStatus(`批量模式：剩余 ${remaining} 个帖子`);
                
                // 等待后返回列表
                await Utils.delay(CONFIG.delays.betweenPosts);
                history.back();
            } catch (error) {
                UI.log(`自动回帖失败：${error.message}`, 'error');
                // 出错也返回继续下一个（已从队列移除）
                await Utils.delay(2000);
                history.back();
            }
        }
    };

    // ========================================
    // 采集处理模块
    // ========================================
    const Collector = {
        // 检查文章是否已存在
        checkArticleExists: async () => {
            if (!CollectionData.data.title) {
                UI.updateStatusLight('gray', '未检查');
                return false;
            }
            UI.updateStatusLight('#FFA500', '检查中...');
            try {
                const response = await fetch(CONFIG.collection.checkUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: CollectionData.data.title
                });
                const data = await response.json();
                const exists = data.data === true || data.data === 'true' || data.data === 1 || data.data === '1';
                if (exists) {
                    UI.updateStatusLight('#f44336', '文章已存在');
                    UI.addCollectionLog('⚠️ 该文章已在数据库中');
                    return true;
                } else {
                    UI.updateStatusLight('#4CAF50', '文章不存在');
                    UI.addCollectionLog('✅ 该文章为新内容');
                    return false;
                }
            } catch (err) {
                UI.updateStatusLight('#FF9800', '检查失败');
                UI.addCollectionLog('❌ 检查接口失败: ' + err.message);
                return false;
            }
        },

        // 统一提取所有内容
        extractAll: async () => {
            UI.addCollectionLog('开始提取所有内容...');
            
            // 第一步：检查夸克链接
            UI.addCollectionLog('1. 检查夸克链接...');
            const alertDiv = document.querySelector("div.alert.alert-success[role='alert']");
            if (alertDiv) {
                const allText = alertDiv.textContent || alertDiv.innerText || '';
                const quarkPattern = /https?:\/\/pan\.quark\.(cn|com)\/s\/[a-zA-Z0-9]+/g;
                const matches = allText.match(quarkPattern);
                if (matches && matches.length > 0) {
                    CollectionData.data.quarkLink = matches[0];
                    UI.addCollectionLog('✓ 夸克链接提取成功: ' + CollectionData.data.quarkLink);
                } else {
                    UI.addCollectionLog('❌ 未找到夸克链接。请确认已回帖。');
                    return;
                }
            } else {
                UI.addCollectionLog('❌ 未找到回帖提示框。请先回帖查看链接。');
                return;
            }
            
            // 第二步：提取基本信息
            UI.addCollectionLog('2. 提取标题、作者、节点和资源链接...');
            await Collector.extractMeta();
            
            // 第三步：提取标签
            UI.addCollectionLog('3. 提取标签...');
            Collector.extractTags();
            
            // 第四步：提取正文
            UI.addCollectionLog('4. 提取正文...');
            await Collector.extractContent();
            
            UI.addCollectionLog('✅ 所有内容提取完成！');
            UI.addCollectionLog('可以点击【查看数据】查看完整数据，然后点击【上传服务器】');
        },

        // 提取元数据
        extractMeta: async () => {
            const currentUrl = window.location.href;
            try {
                const urlObj = new URL(currentUrl);
                const pathParts = urlObj.pathname.split('/').filter(part => part);
                if (pathParts.length > 0) {
                    CollectionData.data.resourceLink = pathParts[pathParts.length - 1];
                }
                UI.addCollectionLog('资源链接: ' + CollectionData.data.resourceLink);
            } catch (e) {
                UI.addCollectionLog('URL 解析失败: ' + e.message);
            }
            
            // 提取标题
            const titleEl = document.querySelector("h4.break-all.font-weight-bold");
            if (titleEl) {
                CollectionData.data.title = titleEl.textContent.trim().replace(/\s+/g, " ");
                UI.addCollectionLog('标题: ' + CollectionData.data.title);
            } else {
                UI.addCollectionLog('未找到标题');
            }
            
            // 提取作者
            const userEl = document.querySelector("span.username.font-weight-bold.small a");
            if (userEl) {
                CollectionData.data.username = userEl.textContent.trim();
                UI.addCollectionLog('作者: ' + CollectionData.data.username);
            } else {
                UI.addCollectionLog('未找到作者');
            }
            
            // 提取节点
            const nodeEl = Utils.getElementByXPath("//*[@id='body']/div/div/div[2]/ol/li[2]/a");
            if (nodeEl) {
                CollectionData.data.node = nodeEl.textContent.trim();
                UI.addCollectionLog('节点: ' + CollectionData.data.node);
            } else {
                UI.addCollectionLog('未找到节点');
            }
        },

        // 提取标签
        extractTags: () => {
            const tagsXPath = "/html/body/main/div/div/div[2]/div[1]/div[2]/div[2]//a";
            const tagElements = Utils.getElementsByXPath(tagsXPath);
            if (tagElements && tagElements.length > 0) {
                const tagTexts = tagElements.map(tag => tag.textContent.trim()).filter(text => text);
                CollectionData.data.tags = tagTexts.join(",");
                UI.addCollectionLog('标签: ' + CollectionData.data.tags);
            } else {
                UI.addCollectionLog('未找到标签');
            }
        },

        // 提取正文内容
        extractContent: async () => {
            const contentXPath = "/html/body/main/div/div/div[2]/div[1]/div[2]";
            const contentEl = Utils.getElementByXPath(contentXPath);
            if (!contentEl) {
                UI.addCollectionLog('未找到正文区域');
                return;
            }
            
            const clonedContent = contentEl.cloneNode(true);
            
            // 删除多余元素
            try {
                let deleteCount = 0;
                const removeList = ['.tt-license', '.alert.alert-success', '.mt-3'];
                removeList.forEach(sel => {
                    const el = clonedContent.querySelector(sel);
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                        deleteCount++;
                    }
                });
                UI.addCollectionLog(`已删除 ${deleteCount} 个指定元素`);
            } catch (e) {
                UI.addCollectionLog('删除元素时出错: ' + e.message);
            }
            
            // 处理图片转Base64
            const imgEls = clonedContent.querySelectorAll("img");
            let converted = 0;
            
            const convertToBase64 = async (url) => {
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    return await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (err) {
                    console.error("图片转Base64失败：", err);
                    return url;
                }
            };
            
            const tasks = Array.from(imgEls).map(async (img) => {
                const src = img.getAttribute("src");
                if (!src) return;
                try {
                    const absoluteUrl = new URL(src, window.location.href).href;
                    const base64 = await convertToBase64(absoluteUrl);
                    img.setAttribute("src", base64);
                    converted++;
                } catch (e) {
                    console.warn("处理图片失败：", src, e);
                }
            });
            
            await Promise.all(tasks);
            UI.addCollectionLog(`共处理图片 ${imgEls.length} 张，成功转为Base64：${converted} 张`);
            
            CollectionData.data.content = clonedContent.outerHTML;
            UI.addCollectionLog('✅ 正文提取完成');
        },

        // 上传到服务器
        uploadServer: () => {
            if (!CONFIG.collection.serverUrl.startsWith("http")) {
                UI.addCollectionLog('❌ 请先设置服务器地址！');
                return;
            }
            UI.addCollectionLog('开始上传到服务器...');
            fetch(CONFIG.collection.serverUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(CollectionData.data)
            })
                .then(res => res.json())
                .then(data => UI.addCollectionLog('✅ 上传成功: ' + JSON.stringify(data)))
                .catch(err => UI.addCollectionLog('❌ 上传失败: ' + err));
        },

        // 查看数据
        showData: () => {
            UI.addCollectionLog('当前收集数据：');
            UI.addCollectionLog(JSON.stringify(CollectionData.data, null, 2));
        }
    };

    // ========================================
    // 主程序初始化
    // ========================================
    const App = {
        init: async () => {
            // 初始化采集数据（必须在创建面板之前）
            CollectionData.init();
            
            // 初始化UI
            UI.initStyles();
            UI.createPanel();
            
            // 恢复日志和状态
            UI.restoreLogs();
            UI.restoreStatus();
            
            // 如果是批量模式，显示批量控制按钮
            if (Storage.isBatchMode()) {
                const inputGroup = document.getElementById('batchInputGroup');
                const controlGroup = document.getElementById('batchControlGroup');
                if (inputGroup && controlGroup) {
                    inputGroup.style.display = 'block';
                    controlGroup.style.display = 'flex';
                }
                UI.setButtonsDisabled(true);
            }
            
            UI.log('夸克资源助手已启动 v5.1.1', 'success');
            
            // 检查当前页面类型
            if (Utils.isThreadPage()) {
                UI.log('检测到帖子详情页', 'info');
                UI.addCollectionLog('✅ 采集工具已就绪');
                
                // 自动检查文章状态
                App.autoCheckArticle();
                
                // 如果是批量模式，自动回帖
                if (Storage.isBatchMode()) {
                    await ReplyHandler.autoReplyInThread();
                } else {
                    UI.updateStatus('帖子详情页 - 可使用快速回帖');
                }
            } else if (Utils.isUserListPage()) {
                UI.log('检测到用户列表页', 'info');
                if (!Storage.isBatchMode()) {
                    UI.updateStatus('用户列表页 - 可使用批量回帖');
                } else {
                    // 批量模式下，在列表页继续处理
                    UI.log('批量模式中，准备处理下一个帖子...', 'info');
                    setTimeout(() => {
                        ReplyHandler.processBatch();
                    }, 1500);
                }
            } else {
                UI.log('当前页面类型未知', 'info');
                if (!Storage.isBatchMode()) {
                    UI.updateStatus('待机中');
                }
            }
            
        },
        
        // 自动检查文章
        autoCheckArticle: () => {
            const titleEl = document.querySelector("h4.break-all.font-weight-bold");
            if (titleEl) {
                const title = titleEl.textContent.trim().replace(/\s+/g, " ");
                CollectionData.data.title = title;
                Collector.checkArticleExists();
            } else {
                const checkObserver = new MutationObserver(() => {
                    const titleEl = document.querySelector("h4.break-all.font-weight-bold");
                    if (titleEl) {
                        const title = titleEl.textContent.trim().replace(/\s+/g, " ");
                        CollectionData.data.title = title;
                        Collector.checkArticleExists();
                        checkObserver.disconnect();
                    }
                });
                checkObserver.observe(document.body, { childList: true, subtree: true });
            }
        }
    };

    // 启动应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.init);
    } else {
        App.init();
    }

})();
