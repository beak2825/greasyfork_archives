// ==UserScript==
// @name         夸克资源助手
// @namespace    http://tampermonkey.net/
// @version      6.1.1
// @description  💬智能回帖 | 📦资源采集 | 📊推广查询 - 简洁实用的多功能助手
// @match        https://kuafuzys.net/*
// @match        https://www.kuafuzy.com/*
// @match        https://www.kuakesou.com/*
// @match        https://www.kuakeq.com/*
// @match        https://kuakezy.cc/*
// @match        https://dt.bd.cn/main/quark_list**
// @match        https://csj.sgj.cn/main/sfsjcx**
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @author       PYY
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bd.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563025/%E5%A4%B8%E5%85%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563025/%E5%A4%B8%E5%85%8B%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 配置模块
    // ========================================
    const CONFIG = {
        version: '6.1.1',
        
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
            beforeSubmit: 800,
            afterSubmit: 2000,
            betweenPosts: 3000,
            pageLoad: 1000
        },

        // 限制配置
        limits: {
            maxBatchCount: 50,
            maxLogEntries: 100
        },

        // 存储键名
        storageKeys: {
            repliedThreads: 'replied_threads_v6',
            batchQueue: 'batch_queue_v6',
            batchMode: 'batch_mode_v6',
            batchCount: 'batch_count_v6',
            logs: 'logs_v6',
            statusText: 'status_text_v6',
            bindCookieId: 'quark_tool_bindCookieId_v6',
            currentFeature: 'current_feature_v6',
            panelMinimized: 'panel_minimized_v6'
        },

        // 采集配置
        collection: {
            serverUrl: "https://zys.52huahua.cn/api/biz/collection/save",
            checkUrl: "https://zys.52huahua.cn/api/biz/collection/isExist",
            platform: "kkwpzys",
            accounts: [
                { label: "我想我是海", value: "1896186752012374017" },
                { label: "书生", value: "1900922270486798338" },
                { label: "海海游戏号", value: "1900354501367640065" }
            ]
        },

        // 推广查询配置
        promotion: {
            uidList: [
                { name: '我想我是海', uid: '100188018441' },
                { name: '夸父资源网', uid: '100742154062' }
            ]
        }
    };


    // ========================================
    // 工具函数模块
    // ========================================
    const Utils = {
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        randomDelay: (min, max) => {
            const ms = min + Math.random() * (max - min);
            return Utils.delay(ms);
        },
        
        getRandomReply: () => {
            const templates = CONFIG.replyTemplates;
            return templates[Math.floor(Math.random() * templates.length)];
        },
        
        parseThreadId: (url) => {
            const match = url.match(/thread-(\d+)(-\d+-\d+)?\.htm/);
            return match ? match[1] : null;
        },
        
        isThreadPage: () => /\/thread-\d+(-\d+-\d+)?\.htm/.test(location.href),
        
        isUserListPage: () => /\/user-thread-\d+(-\d+)?\.htm/.test(location.href),
        
        isPromotionPage: () => /dt\.bd\.cn\/main\/quark_list/.test(location.href) || 
                               /csj\.sgj\.cn\/main\/sfsjcx/.test(location.href),
        
        formatDateTime: (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },
        
        getElementByXPath: (xpath) => {
            try {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return result.singleNodeValue;
            } catch (e) {
                console.error("XPath 错误:", e);
                return null;
            }
        },
        
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
        getRepliedThreads: () => GM_getValue(CONFIG.storageKeys.repliedThreads, []) || [],
        
        addRepliedThread: (tid) => {
            const replied = Storage.getRepliedThreads();
            if (!replied.includes(tid)) {
                replied.push(tid);
                GM_setValue(CONFIG.storageKeys.repliedThreads, replied);
            }
        },
        
        isReplied: (tid) => Storage.getRepliedThreads().includes(tid),
        
        clearRepliedThreads: () => GM_setValue(CONFIG.storageKeys.repliedThreads, []),
        
        getBatchQueue: () => GM_getValue(CONFIG.storageKeys.batchQueue, []) || [],
        
        saveBatchQueue: (queue) => GM_setValue(CONFIG.storageKeys.batchQueue, queue),
        
        isBatchMode: () => GM_getValue(CONFIG.storageKeys.batchMode, false),
        
        setBatchMode: (enabled) => GM_setValue(CONFIG.storageKeys.batchMode, enabled),
        
        getBatchCount: () => GM_getValue(CONFIG.storageKeys.batchCount, 0),
        
        setBatchCount: (count) => GM_setValue(CONFIG.storageKeys.batchCount, count),
        
        getLogs: () => GM_getValue(CONFIG.storageKeys.logs, []) || [],
        
        saveLogs: (logs) => GM_setValue(CONFIG.storageKeys.logs, logs),
        
        addLog: (message, type) => {
            const logs = Storage.getLogs();
            const time = new Date().toLocaleTimeString();
            logs.unshift({ time, message, type });
            if (logs.length > CONFIG.limits.maxLogEntries) {
                logs.pop();
            }
            Storage.saveLogs(logs);
        },
        
        clearLogs: () => GM_setValue(CONFIG.storageKeys.logs, []),
        
        getStatusText: () => GM_getValue(CONFIG.storageKeys.statusText, '待机中'),
        
        setStatusText: (text) => GM_setValue(CONFIG.storageKeys.statusText, text)
    };


    // ========================================
    // 采集数据模块
    // ========================================
    const CollectionData = {
        data: null,
        
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
        
        get: () => CollectionData.data,
        
        reset: () => CollectionData.init()
    };


    // ========================================
    // UI样式模块
    // ========================================
    const Styles = `
        #quarkPanel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 280px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        
        #quarkPanel.minimized {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            overflow: hidden;
        }
        
        #quarkPanel.minimized .panel-header {
            border-radius: 50%;
            width: 45px;
            height: 45px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #quarkPanel.minimized .panel-header h3 {
            font-size: 18px;
        }
        
        #quarkPanel.minimized .panel-body {
            display: none;
        }
        
        #quarkPanel .panel-header {
            background: #5b9bd5;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px 4px 0 0;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #quarkPanel .panel-header h3 {
            margin: 0;
            font-size: 13px;
            font-weight: 600;
        }
        
        #quarkPanel .panel-controls {
            display: flex;
            gap: 8px;
        }
        
        #quarkPanel .panel-controls span {
            cursor: pointer;
            font-size: 14px;
            opacity: 0.9;
        }
        
        #quarkPanel .panel-controls span:hover {
            opacity: 1;
        }
        
        #quarkPanel .panel-body {
            padding: 10px;
            max-height: 70vh;
            overflow-y: auto;
        }
        
        #quarkPanel .start-page {
            padding: 0;
        }
        
        #quarkPanel .feature-card {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            background: #fff;
            text-align: center;
        }
        
        #quarkPanel .feature-card:hover {
            background: #f8f9fa;
            border-color: #5b9bd5;
        }
        
        #quarkPanel .feature-icon {
            font-size: 24px;
            margin-bottom: 5px;
        }
        
        #quarkPanel .feature-title {
            font-size: 13px;
            font-weight: 600;
            color: #333;
        }
        
        #quarkPanel .btn-group {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
        }
        
        #quarkPanel .btn {
            flex: 1;
            padding: 6px 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            background: #fff;
        }
        
        #quarkPanel .btn:hover {
            background: #f5f5f5;
        }
        
        #quarkPanel .btn.primary {
            background: #5b9bd5;
            color: #fff;
            border-color: #5b9bd5;
        }
        
        #quarkPanel .btn.primary:hover {
            background: #4a8bc2;
        }
        
        #quarkPanel .btn.danger {
            background: #e74c3c;
            color: #fff;
            border-color: #e74c3c;
        }
        
        #quarkPanel .btn.danger:hover {
            background: #c0392b;
        }
        
        #quarkPanel .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        #quarkPanel .input-group {
            margin-bottom: 8px;
        }
        
        #quarkPanel .input-group input,
        #quarkPanel .input-group select {
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 12px;
            box-sizing: border-box;
        }
        
        #quarkPanel .input-group input:focus,
        #quarkPanel .input-group select:focus {
            outline: none;
            border-color: #5b9bd5;
        }
        
        #quarkPanel .divider {
            height: 1px;
            background: #e0e0e0;
            margin: 8px 0;
        }
        
        #quarkPanel .status-bar {
            padding: 6px 8px;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            margin-bottom: 8px;
            font-size: 11px;
            color: #666;
        }
        
        #quarkPanel .status-light {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ccc;
            display: inline-block;
            margin-left: 6px;
            vertical-align: middle;
        }
        
        #quarkPanel .log-container {
            max-height: 180px;
            overflow-y: auto;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            padding: 6px;
            font-size: 11px;
        }
        
        #quarkPanel .log-entry {
            margin: 3px 0;
            padding: 3px 5px;
            line-height: 1.4;
        }
        
        #quarkPanel .log-entry.success {
            color: #27ae60;
        }
        
        #quarkPanel .log-entry.error {
            color: #e74c3c;
        }
        
        #quarkPanel .log-entry.info {
            color: #3498db;
        }
        
        #quarkPanel .log-entry .time {
            color: #999;
            font-size: 10px;
            margin-right: 4px;
        }
        
        #quarkPanel .uid-btn-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 8px;
        }
        
        #quarkPanel .uid-btn {
            background: #5b9bd5;
            color: #fff;
            border: none;
            border-radius: 3px;
            padding: 8px 10px;
            font-size: 12px;
            cursor: pointer;
        }
        
        #quarkPanel .uid-btn:hover {
            background: #4a8bc2;
        }
        
        #quarkPanel .uid-btn.active {
            background: #27ae60;
        }
    `;


    // ========================================
    // UI模块
    // ========================================
    const UI = {
        panel: null,
        logContainer: null,
        currentFeature: null,
        
        init: () => {
            GM_addStyle(Styles);
            UI.createPanel();
            UI.showStartPage();
        },
        
        createPanel: () => {
            const panel = document.createElement('div');
            panel.id = 'quarkPanel';
            document.body.appendChild(panel);
            UI.panel = panel;
            
            // 恢复最小化状态
            const isMinimized = GM_getValue(CONFIG.storageKeys.panelMinimized, false);
            if (isMinimized) {
                panel.classList.add('minimized');
            }
        },
        
        showStartPage: () => {
            UI.currentFeature = null;
            UI.panel.innerHTML = `
                <div class="panel-header">
                    <h3>夸克助手</h3>
                    <div class="panel-controls">
                        <span id="btnMinimize">−</span>
                        <span id="btnClose">×</span>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="start-page">
                        <div class="feature-card" data-feature="reply">
                            <div class="feature-icon">💬</div>
                            <div class="feature-title">回帖</div>
                        </div>
                        
                        <div class="feature-card" data-feature="collection">
                            <div class="feature-icon">📦</div>
                            <div class="feature-title">采集</div>
                        </div>
                        
                        <div class="feature-card" data-feature="promotion">
                            <div class="feature-icon">📊</div>
                            <div class="feature-title">查询</div>
                        </div>
                    </div>
                </div>
            `;
            
            UI.makeDraggable();
            UI.bindCommonEvents();
            UI.bindStartPageEvents();
        },
        
        bindStartPageEvents: () => {
            const cards = UI.panel.querySelectorAll('.feature-card');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const feature = card.getAttribute('data-feature');
                    UI.loadFeature(feature);
                });
            });
        },
        
        loadFeature: (feature) => {
            UI.currentFeature = feature;
            GM_setValue(CONFIG.storageKeys.currentFeature, feature);
            
            switch(feature) {
                case 'reply':
                    UI.showReplyFeature();
                    break;
                case 'collection':
                    UI.showCollectionFeature();
                    break;
                case 'promotion':
                    UI.showPromotionFeature();
                    break;
            }
        },
        
        showReplyFeature: () => {
            UI.panel.innerHTML = `
                <div class="panel-header">
                    <h3>💬 回帖</h3>
                    <div class="panel-controls">
                        <span id="btnBack">←</span>
                        <span id="btnMinimize">−</span>
                        <span id="btnClose">×</span>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="status-bar">
                        <span id="statusText">待机中</span>
                    </div>
                    
                    <div class="input-group">
                        <input type="number" id="userIdInput" placeholder="用户ID">
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn" id="btnGoToUser">跳转</button>
                        <button class="btn primary" id="btnQuickReply">回帖</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="input-group">
                        <input type="number" id="batchCount" placeholder="批量数量 (1-50)" min="1" max="50">
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn primary" id="btnStartBatch">开始</button>
                        <button class="btn danger" id="btnStopBatch">停止</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-group">
                        <button class="btn" id="btnClearHistory">清空</button>
                        <button class="btn" id="btnViewStats">统计</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="log-container" id="logContainer"></div>
                </div>
            `;
            
            UI.logContainer = UI.panel.querySelector('#logContainer');
            UI.makeDraggable();
            UI.bindCommonEvents();
            UI.bindReplyEvents();
            UI.restoreLogs();
            UI.restoreStatus();
        },
        
        showCollectionFeature: () => {
            UI.panel.innerHTML = `
                <div class="panel-header">
                    <h3>📦 采集</h3>
                    <div class="panel-controls">
                        <span id="btnBack">←</span>
                        <span id="btnMinimize">−</span>
                        <span id="btnClose">×</span>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="status-bar">
                        <span id="statusText2">未检测</span>
                        <div class="status-light" id="statusLight"></div>
                    </div>
                    
                    <div class="input-group">
                        <select id="accountSelector"></select>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="btn-group">
                        <button class="btn primary" id="btnQuickReply2">回帖</button>
                        <button class="btn primary" id="btnExtract">提取</button>
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn" id="btnShowData">查看</button>
                        <button class="btn" id="btnUpload">上传</button>
                    </div>
                    
                    <div class="btn-group">
                        <button class="btn" id="btnGetCookie">获取Cookie</button>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="log-container" id="logContainer"></div>
                </div>
            `;
            
            UI.logContainer = UI.panel.querySelector('#logContainer');
            UI.makeDraggable();
            UI.bindCommonEvents();
            UI.bindCollectionEvents();
            UI.initAccountSelector();
            
            // 自动检查文章状态
            if (Utils.isThreadPage()) {
                Collector.autoCheckArticle();
            }
        },
        
        showPromotionFeature: () => {
            UI.panel.innerHTML = `
                <div class="panel-header">
                    <h3>📊 查询</h3>
                    <div class="panel-controls">
                        <span id="btnBack">←</span>
                        <span id="btnMinimize">−</span>
                        <span id="btnClose">×</span>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="uid-btn-list">
                        ${CONFIG.promotion.uidList.map(u => 
                            `<button class="uid-btn" data-uid="${u.uid}">${u.name}</button>`
                        ).join('')}
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="log-container" id="logContainer"></div>
                </div>
            `;
            
            UI.logContainer = UI.panel.querySelector('#logContainer');
            UI.makeDraggable();
            UI.bindCommonEvents();
            UI.bindPromotionEvents();
            
            // 启动懒加载观察
            if (Utils.isPromotionPage()) {
                Promotion.observeLazyLoading();
            }
        },
        
        bindCommonEvents: () => {
            // 最小化按钮
            const btnMinimize = UI.panel.querySelector('#btnMinimize');
            if (btnMinimize) {
                btnMinimize.onclick = (e) => {
                    e.stopPropagation();
                    const isMinimized = UI.panel.classList.contains('minimized');
                    if (isMinimized) {
                        UI.panel.classList.remove('minimized');
                        GM_setValue(CONFIG.storageKeys.panelMinimized, false);
                    } else {
                        UI.panel.classList.add('minimized');
                        GM_setValue(CONFIG.storageKeys.panelMinimized, true);
                    }
                };
            }
            
            // 点击头部恢复
            const header = UI.panel.querySelector('.panel-header');
            if (header) {
                header.addEventListener('click', (e) => {
                    if (UI.panel.classList.contains('minimized') && !UI.panel._isDragging) {
                        e.stopPropagation();
                        UI.panel.classList.remove('minimized');
                        GM_setValue(CONFIG.storageKeys.panelMinimized, false);
                    }
                });
            }
            
            // 关闭按钮
            const btnClose = UI.panel.querySelector('#btnClose');
            if (btnClose) {
                btnClose.onclick = () => {
                    UI.panel.style.display = 'none';
                };
            }
            
            // 返回按钮
            const btnBack = UI.panel.querySelector('#btnBack');
            if (btnBack) {
                btnBack.onclick = () => {
                    UI.showStartPage();
                };
            }
        },
        
        bindReplyEvents: () => {
            const btnGoToUser = UI.panel.querySelector('#btnGoToUser');
            if (btnGoToUser) {
                btnGoToUser.onclick = () => {
                    const userId = UI.panel.querySelector('#userIdInput').value.trim();
                    if (!userId) {
                        UI.log('请输入用户ID', 'error');
                        return;
                    }
                    if (!/^\d+$/.test(userId)) {
                        UI.log('用户ID必须是数字', 'error');
                        return;
                    }
                    UI.log(`跳转到用户 ${userId} 的帖子列表`, 'info');
                    location.href = `${window.location.origin}/user-thread-${userId}.htm`;
                };
            }
            
            const btnQuickReply = UI.panel.querySelector('#btnQuickReply');
            if (btnQuickReply) {
                btnQuickReply.onclick = () => ReplyHandler.quickReply();
            }
            
            const btnStartBatch = UI.panel.querySelector('#btnStartBatch');
            if (btnStartBatch) {
                btnStartBatch.onclick = () => {
                    const count = parseInt(UI.panel.querySelector('#batchCount').value);
                    if (!count || count < 1 || count > CONFIG.limits.maxBatchCount) {
                        UI.log(`请输入有效的数量 (1-${CONFIG.limits.maxBatchCount})`, 'error');
                        return;
                    }
                    ReplyHandler.startBatch(count);
                };
            }
            
            const btnStopBatch = UI.panel.querySelector('#btnStopBatch');
            if (btnStopBatch) {
                btnStopBatch.onclick = () => ReplyHandler.stopBatch();
            }
            
            const btnClearHistory = UI.panel.querySelector('#btnClearHistory');
            if (btnClearHistory) {
                btnClearHistory.onclick = () => {
                    if (confirm('确定要清空所有回帖记录和日志吗？')) {
                        Storage.clearRepliedThreads();
                        Storage.clearLogs();
                        Storage.saveBatchQueue([]);
                        Storage.setBatchMode(false);
                        Storage.setBatchCount(0);
                        if (UI.logContainer) {
                            UI.logContainer.innerHTML = '';
                        }
                        UI.log('已清空所有记录', 'success');
                        UI.updateStatus('待机中');
                    }
                };
            }
            
            const btnViewStats = UI.panel.querySelector('#btnViewStats');
            if (btnViewStats) {
                btnViewStats.onclick = () => {
                    const replied = Storage.getRepliedThreads();
                    UI.log(`已回帖数量：${replied.length} 个`, 'info');
                };
            }
        },
        
        bindCollectionEvents: () => {
            const btnQuickReply2 = UI.panel.querySelector('#btnQuickReply2');
            if (btnQuickReply2) {
                btnQuickReply2.onclick = () => ReplyHandler.quickReply();
            }
            
            const btnExtract = UI.panel.querySelector('#btnExtract');
            if (btnExtract) {
                btnExtract.onclick = () => Collector.extractAll();
            }
            
            const btnUpload = UI.panel.querySelector('#btnUpload');
            if (btnUpload) {
                btnUpload.onclick = () => Collector.uploadServer();
            }
            
            const btnShowData = UI.panel.querySelector('#btnShowData');
            if (btnShowData) {
                btnShowData.onclick = () => Collector.showData();
            }
            
            const btnGetCookie = UI.panel.querySelector('#btnGetCookie');
            if (btnGetCookie) {
                btnGetCookie.onclick = () => Collector.getCookie();
            }
        },
        
        bindPromotionEvents: () => {
            const uidBtns = UI.panel.querySelectorAll('.uid-btn');
            uidBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    uidBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    Promotion.triggerQuery(btn.dataset.uid);
                });
            });
        },
        
        initAccountSelector: () => {
            const selector = UI.panel.querySelector('#accountSelector');
            if (!selector) return;
            
            CONFIG.collection.accounts.forEach(({ label, value }) => {
                const option = document.createElement('option');
                option.textContent = label;
                option.value = value;
                selector.appendChild(option);
            });
            
            const savedId = localStorage.getItem(CONFIG.storageKeys.bindCookieId);
            const isValid = CONFIG.collection.accounts.some(acc => acc.value === savedId);
            selector.value = isValid ? savedId : CONFIG.collection.accounts[0].value;
            
            if (CollectionData.data) {
                CollectionData.data.bindCookieId = selector.value;
            }
            
            selector.addEventListener('change', (e) => {
                if (CollectionData.data) {
                    CollectionData.data.bindCookieId = e.target.value;
                }
                localStorage.setItem(CONFIG.storageKeys.bindCookieId, e.target.value);
                UI.log('已切换到账号: ' + e.target.options[e.target.selectedIndex].text);
            });
        },
        
        makeDraggable: () => {
            const header = UI.panel.querySelector('.panel-header');
            let isDragging = false;
            let currentX, currentY, initialX, initialY;
            
            header.addEventListener('mousedown', (e) => {
                if (e.target.id === 'btnClose' || e.target.id === 'btnMinimize' || e.target.id === 'btnBack') return;
                isDragging = true;
                UI.panel._isDragging = true;
                initialX = e.clientX - UI.panel.offsetLeft;
                initialY = e.clientY - UI.panel.offsetTop;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                UI.panel.style.left = currentX + 'px';
                UI.panel.style.top = currentY + 'px';
                UI.panel.style.right = 'auto';
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                setTimeout(() => {
                    UI.panel._isDragging = false;
                }, 100);
            });
        },
        
        log: (message, type = 'info') => {
            Storage.addLog(message, type);
            
            if (UI.logContainer) {
                const entry = document.createElement('div');
                entry.className = `log-entry ${type}`;
                const time = new Date().toLocaleTimeString();
                entry.innerHTML = `<span class="time">${time}</span>${message}`;
                
                UI.logContainer.insertBefore(entry, UI.logContainer.firstChild);
                
                const entries = UI.logContainer.querySelectorAll('.log-entry');
                if (entries.length > CONFIG.limits.maxLogEntries) {
                    entries[entries.length - 1].remove();
                }
            }
            
            console.log(`[夸克助手] ${message}`);
        },
        
        updateStatus: (text) => {
            Storage.setStatusText(text);
            const statusText = UI.panel.querySelector('#statusText');
            if (statusText) {
                statusText.textContent = text;
            }
        },
        
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
        
        restoreStatus: () => {
            const statusText = Storage.getStatusText();
            UI.updateStatus(statusText);
        },
        
        updateStatusLight: (color, text) => {
            const light = UI.panel.querySelector('#statusLight');
            const textSpan = UI.panel.querySelector('#statusText2');
            if (light) light.style.background = color;
            if (textSpan) textSpan.textContent = text;
        }
    };


    // ========================================
    // 回帖处理模块
    // ========================================
    const ReplyHandler = {
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
            
            try {
                await ReplyHandler.submitReply(tid);
                UI.log('回帖成功！', 'success');
                UI.updateStatus('回帖完成');
            } catch (error) {
                UI.log(`回帖失败：${error.message}`, 'error');
                UI.updateStatus('回帖失败');
            }
        },
        
        submitReply: async (tid) => {
            const textarea = document.querySelector(CONFIG.selectors.replyTextarea);
            const submitBtn = document.querySelector(CONFIG.selectors.replySubmitBtn);
            
            if (!textarea || !submitBtn) {
                throw new Error('未找到回复框或提交按钮');
            }
            
            const replyText = Utils.getRandomReply();
            textarea.value = replyText;
            
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            
            UI.log(`回复内容：${replyText}`, 'info');
            
            await Utils.delay(CONFIG.delays.beforeSubmit);
            submitBtn.click();
            
            Storage.addRepliedThread(tid);
            
            await Utils.delay(CONFIG.delays.afterSubmit);
        },
        
        startBatch: async (count) => {
            if (!Utils.isUserListPage()) {
                UI.log('请在用户帖子列表页使用批量回帖功能', 'error');
                return;
            }
            
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
            
            const shuffled = unrepliedLinks.sort(() => Math.random() - 0.5);
            const targetLinks = shuffled.slice(0, Math.min(count, unrepliedLinks.length));
            const queue = targetLinks.map(item => item.url);
            
            Storage.saveBatchQueue(queue);
            Storage.setBatchMode(true);
            Storage.setBatchCount(queue.length);
            
            UI.log(`从 ${unrepliedLinks.length} 个未回复帖子中随机选择了 ${queue.length} 个`, 'success');
            UI.log(`开始批量回帖，队列中有 ${queue.length} 个帖子`, 'success');
            UI.updateStatus(`批量模式：剩余 ${queue.length} 个帖子`);
            
            await ReplyHandler.processBatch();
        },
        
        processBatch: async () => {
            if (!Storage.isBatchMode()) {
                return;
            }
            
            let queue = Storage.getBatchQueue();
            
            if (queue.length === 0) {
                UI.log('🎉 批量回帖全部完成！', 'success');
                ReplyHandler.stopBatch();
                return;
            }
            
            const nextUrl = queue[0];
            const tid = Utils.parseThreadId(nextUrl);
            
            UI.log(`⏩ 准备回复帖子：${tid} (队列剩余 ${queue.length})`, 'info');
            UI.updateStatus(`批量模式：剩余 ${queue.length} 个帖子`);
            
            queue.shift();
            Storage.saveBatchQueue(queue);
            Storage.setBatchCount(queue.length);
            
            location.href = nextUrl;
        },
        
        stopBatch: () => {
            Storage.setBatchMode(false);
            Storage.setBatchCount(0);
            Storage.saveBatchQueue([]);
            UI.log('已停止批量回帖', 'success');
            UI.updateStatus('待机中');
        },
        
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
                history.back();
                return;
            }
            
            UI.updateStatus('正在自动回帖...');
            
            try {
                await Utils.delay(CONFIG.delays.pageLoad);
                await ReplyHandler.submitReply(tid);
                
                const remaining = Storage.getBatchCount();
                
                UI.log(`✅ 帖子 ${tid} 回复成功，剩余 ${remaining} 个帖子`, 'success');
                UI.updateStatus(`批量模式：剩余 ${remaining} 个帖子`);
                
                await Utils.delay(CONFIG.delays.betweenPosts);
                history.back();
            } catch (error) {
                UI.log(`自动回帖失败：${error.message}`, 'error');
                await Utils.delay(2000);
                history.back();
            }
        }
    };


    // ========================================
    // 采集处理模块
    // ========================================
    const Collector = {
        checkArticleExists: async () => {
            if (!CollectionData.data.title) {
                UI.updateStatusLight('gray', '未检测');
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
                    UI.log('⚠️ 该文章已在数据库中');
                    return true;
                } else {
                    UI.updateStatusLight('#4CAF50', '文章不存在');
                    UI.log('✅ 该文章为新内容');
                    return false;
                }
            } catch (err) {
                UI.updateStatusLight('#FF9800', '检查失败');
                UI.log('❌ 检查接口失败: ' + err.message);
                return false;
            }
        },
        
        extractAll: async () => {
            UI.log('开始提取所有内容...');
            
            UI.log('1. 检查夸克链接...');
            const alertDiv = document.querySelector("div.alert.alert-success[role='alert']");
            if (alertDiv) {
                const allText = alertDiv.textContent || alertDiv.innerText || '';
                const quarkPattern = /https?:\/\/pan\.quark\.(cn|com)\/s\/[a-zA-Z0-9]+/g;
                const matches = allText.match(quarkPattern);
                if (matches && matches.length > 0) {
                    CollectionData.data.quarkLink = matches[0];
                    UI.log('✅ 夸克链接提取成功: ' + CollectionData.data.quarkLink);
                } else {
                    UI.log('❌ 未找到夸克链接。请确认已回帖！');
                    return;
                }
            } else {
                UI.log('❌ 未找到回帖提示框。请先回帖查看链接！');
                return;
            }
            
            UI.log('2. 提取标题、作者、节点和资源链接...');
            await Collector.extractMeta();
            
            UI.log('3. 提取标签...');
            Collector.extractTags();
            
            UI.log('4. 提取正文...');
            await Collector.extractContent();
            
            UI.log('✅ 所有内容提取完成！');
            UI.log('可以点击【查看数据】查看完整数据，然后点击【上传服务器】');
        },
        
        extractMeta: async () => {
            const currentUrl = window.location.href;
            try {
                const urlObj = new URL(currentUrl);
                const pathParts = urlObj.pathname.split('/').filter(part => part);
                if (pathParts.length > 0) {
                    CollectionData.data.resourceLink = pathParts[pathParts.length - 1];
                }
                UI.log('资源链接: ' + CollectionData.data.resourceLink);
            } catch (e) {
                UI.log('URL 解析失败: ' + e.message);
            }
            
            const titleEl = document.querySelector("h4.break-all.font-weight-bold");
            if (titleEl) {
                CollectionData.data.title = titleEl.textContent.trim().replace(/\s+/g, " ");
                UI.log('标题: ' + CollectionData.data.title);
            } else {
                UI.log('未找到标题');
            }
            
            const userEl = document.querySelector("span.username.font-weight-bold.small a");
            if (userEl) {
                CollectionData.data.username = userEl.textContent.trim();
                UI.log('作者: ' + CollectionData.data.username);
            } else {
                UI.log('未找到作者');
            }
            
            const nodeEl = Utils.getElementByXPath("//*[@id='body']/div/div/div[2]/ol/li[2]/a");
            if (nodeEl) {
                CollectionData.data.node = nodeEl.textContent.trim();
                UI.log('节点: ' + CollectionData.data.node);
            } else {
                UI.log('未找到节点');
            }
        },
        
        extractTags: () => {
            const tagsXPath = "/html/body/main/div/div/div[2]/div[1]/div[2]/div[2]//a";
            const tagElements = Utils.getElementsByXPath(tagsXPath);
            if (tagElements && tagElements.length > 0) {
                const tagTexts = tagElements.map(tag => tag.textContent.trim()).filter(text => text);
                CollectionData.data.tags = tagTexts.join(",");
                UI.log('标签: ' + CollectionData.data.tags);
            } else {
                UI.log('未找到标签');
            }
        },
        
        extractContent: async () => {
            const contentXPath = "/html/body/main/div/div/div[2]/div[1]/div[2]";
            const contentEl = Utils.getElementByXPath(contentXPath);
            if (!contentEl) {
                UI.log('未找到正文区域');
                return;
            }
            
            const clonedContent = contentEl.cloneNode(true);
            
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
                UI.log(`已删除 ${deleteCount} 个指定元素`);
            } catch (e) {
                UI.log('删除元素时出错: ' + e.message);
            }
            
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
            UI.log(`共处理图片 ${imgEls.length} 张，成功转为Base64：${converted} 张`);
            
            CollectionData.data.content = clonedContent.innerHTML;
            UI.log('✅ 正文提取完成');
        },
        
        uploadServer: () => {
            if (!CONFIG.collection.serverUrl.startsWith("http")) {
                UI.log('❌ 请先设置服务器地址！');
                return;
            }
            UI.log('开始上传到服务器...');
            fetch(CONFIG.collection.serverUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(CollectionData.data)
            })
                .then(res => res.json())
                .then(data => UI.log('✅ 上传成功: ' + JSON.stringify(data)))
                .catch(err => UI.log('❌ 上传失败: ' + err));
        },
        
        showData: () => {
            UI.log('当前收集数据：');
            UI.log(JSON.stringify(CollectionData.data, null, 2));
        },
        
        getCookie: async () => {
            try {
                // 获取所有 cookie
                const cookies = document.cookie.split(';');
                
                // 查找 _ok2_ 参数
                let ok2Value = null;
                for (let cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === '_ok2_') {
                        ok2Value = value;
                        break;
                    }
                }
                
                if (ok2Value) {
                    const cookieString = `_ok2_=${ok2Value}`;
                    UI.log('✅ 成功获取 Cookie', 'success');
                    UI.log(cookieString, 'info');
                    
                    // 尝试获取 Cookie 过期时间（通过 Cookie Store API）
                    if (window.cookieStore) {
                        try {
                            const cookieInfo = await cookieStore.get('_ok2_');
                            if (cookieInfo && cookieInfo.expires) {
                                const expiresDate = new Date(cookieInfo.expires);
                                const now = new Date();
                                const daysLeft = Math.floor((expiresDate - now) / (1000 * 60 * 60 * 24));
                                const hoursLeft = Math.floor(((expiresDate - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                
                                UI.log(`📅 过期时间: ${Utils.formatDateTime(expiresDate)}`, 'info');
                                UI.log(`⏰ 剩余时间: ${daysLeft}天 ${hoursLeft}小时`, 'info');
                            } else {
                                UI.log('ℹ️ Cookie 无过期时间（会话Cookie）', 'info');
                            }
                        } catch (err) {
                            UI.log('ℹ️ 无法获取过期时间（Cookie Store API 不可用）', 'info');
                        }
                    } else {
                        UI.log('ℹ️ 浏览器不支持 Cookie Store API，无法获取过期时间', 'info');
                    }
                    
                    // 复制到剪贴板
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(cookieString).then(() => {
                            UI.log('✅ 已复制到剪贴板', 'success');
                        }).catch(err => {
                            UI.log('❌ 复制失败：' + err.message, 'error');
                        });
                    } else {
                        // 降级方案：使用传统方法
                        const textarea = document.createElement('textarea');
                        textarea.value = cookieString;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            document.execCommand('copy');
                            UI.log('✅ 已复制到剪贴板', 'success');
                        } catch (err) {
                            UI.log('❌ 复制失败：' + err.message, 'error');
                        }
                        document.body.removeChild(textarea);
                    }
                } else {
                    UI.log('❌ 未找到 _ok2_ Cookie', 'error');
                    UI.log('当前所有 Cookie：', 'info');
                    cookies.forEach(cookie => {
                        const [name] = cookie.trim().split('=');
                        UI.log(`  - ${name}`, 'info');
                    });
                }
            } catch (error) {
                UI.log('❌ 获取 Cookie 失败：' + error.message, 'error');
            }
        },
        
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


    // ========================================
    // 推广查询模块
    // ========================================
    const Promotion = {
        triggerQuery: (uid) => {
            UI.log(`正在查询 UID: ${uid}`);
            
            const inputElement = document.querySelector('input[placeholder="请输入夸克UID查询"]');
            if (inputElement) {
                inputElement.value = uid;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                UI.log('✅ 已填入UID');
            } else {
                UI.log('❌ 未找到输入框');
                return;
            }

            const submitDiv = document.querySelector('.submit');
            if (submitDiv) {
                submitDiv.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                UI.log('✅ 已触发查询');
                
                setTimeout(() => {
                    Promotion.addTotalColumn();
                }, 1500);
            } else {
                UI.log('❌ 未找到提交按钮');
            }
        },
        
        addHeaderColumn: () => {
            const header = document.querySelector('.row.table_header');
            if (header && !header.querySelector('.custom-total-header')) {
                const headerCell = document.createElement('div');
                headerCell.textContent = '合计';
                headerCell.className = 'custom-total-header';
                headerCell.style.fontWeight = 'bold';
                headerCell.style.backgroundColor = '#f2f2f2';
                header.appendChild(headerCell);
            }
        },
        
        calculateTotal: (cells) => {
            const col1 = parseFloat(cells[2]?.textContent.trim()) || 0;
            const col2 = parseFloat(cells[3]?.textContent.trim()) || 0;
            const col3 = parseFloat(cells[4]?.textContent.trim()) || 0;
            const col4 = parseFloat(cells[5]?.textContent.trim()) || 0;
            return col1 * 7 + col2 * 3 + col3 * 0.3 + col4;
        },
        
        addTotalColumnToRow: (row) => {
            if (row.querySelector('.custom-total-cell')) return;

            const cells = row.querySelectorAll('div');
            const total = Promotion.calculateTotal(cells);

            const sumDiv = document.createElement('div');
            sumDiv.textContent = total.toFixed(2);
            sumDiv.className = 'custom-total-cell';
            sumDiv.style.fontWeight = 'bold';
            sumDiv.style.color = '#007bff';
            row.appendChild(sumDiv);
        },
        
        addTotalToAllRows: () => {
            const rows = document.querySelectorAll('.row.table_body_item');
            rows.forEach(Promotion.addTotalColumnToRow);
        },
        
        addTotalColumn: () => {
            Promotion.addHeaderColumn();
            Promotion.addTotalToAllRows();
            UI.log('✅ 已添加合计列');
        },
        
        observeLazyLoading: () => {
            const tableBody = document.querySelector('.table_body');
            if (!tableBody) return;

            const observer = new MutationObserver(() => {
                Promotion.addHeaderColumn();
                Promotion.addTotalToAllRows();
            });

            observer.observe(tableBody, { childList: true, subtree: true });
            UI.log('✅ 已启动懒加载观察');
        }
    };


    // ========================================
    // 主程序初始化
    // ========================================
    const App = {
        init: async () => {
            console.log(`[夸克助手] v${CONFIG.version} 启动中...`);
            
            // 初始化采集数据
            CollectionData.init();
            
            // 初始化UI
            UI.init();
            
            // 检查当前页面类型
            const isPromotion = Utils.isPromotionPage();
            const isThreadPage = Utils.isThreadPage();
            const isUserListPage = Utils.isUserListPage();
            
            if (isPromotion) {
                // 推广查询页面
                console.log('[夸克助手] 检测到推广查询页面');
                UI.loadFeature('promotion');
            } else if (isThreadPage || isUserListPage) {
                // 论坛页面
                console.log('[夸克助手] 检测到论坛页面');
                
                // 如果是批量模式，自动加载回帖功能
                if (Storage.isBatchMode()) {
                    UI.loadFeature('reply');
                }
                
                if (isThreadPage) {
                    console.log('[夸克助手] 帖子详情页');
                    
                    // 如果是批量模式，自动回帖
                    if (Storage.isBatchMode()) {
                        await ReplyHandler.autoReplyInThread();
                    }
                } else if (isUserListPage) {
                    console.log('[夸克助手] 用户列表页');
                    
                    // 如果是批量模式，继续处理队列
                    if (Storage.isBatchMode()) {
                        setTimeout(() => {
                            ReplyHandler.processBatch();
                        }, 1500);
                    }
                }
            } else {
                console.log('[夸克助手] 当前页面类型未知');
            }
            
            console.log(`[夸克助手] v${CONFIG.version} 启动完成`);
        }
    };

    // 启动应用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.init);
    } else {
        App.init();
    }

})();
