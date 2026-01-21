// ==UserScript==
// @name         知乎回答导出到 Obsidian
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  抓取知乎回答内容并导出到 Obsidian
// @author       ilvsx
// @license      MIT
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/563370/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%AF%BC%E5%87%BA%E5%88%B0%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/563370/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%AF%BC%E5%87%BA%E5%88%B0%20Obsidian.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        obsidianHost: 'http://localhost:27123',
        obsidianApiKey: '',
        storagePath: '知乎收藏',
        imageFolder: 'attachments'
    };

    function getConfig() {
        return {
            obsidianHost: GM_getValue('obsidianHost', DEFAULT_CONFIG.obsidianHost),
            obsidianApiKey: GM_getValue('obsidianApiKey', DEFAULT_CONFIG.obsidianApiKey),
            storagePath: GM_getValue('storagePath', DEFAULT_CONFIG.storagePath),
            imageFolder: GM_getValue('imageFolder', DEFAULT_CONFIG.imageFolder)
        };
    }

    function saveConfig(config) {
        GM_setValue('obsidianHost', config.obsidianHost);
        GM_setValue('obsidianApiKey', config.obsidianApiKey);
        GM_setValue('storagePath', config.storagePath);
        GM_setValue('imageFolder', config.imageFolder);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function createFloatingWindow() {
        const container = document.createElement('div');
        container.id = 'zhihu-obsidian-sync';
        container.innerHTML = `
            <style>
                #zhihu-obsidian-sync {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                
                .sync-toggle-btn {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    color: white;
                    font-size: 24px;
                }
                
                .sync-toggle-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                }
                
                .sync-panel {
                    display: none;
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 360px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    overflow: hidden;
                }
                
                .sync-panel.show {
                    display: block;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .sync-header {
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .sync-content {
                    padding: 20px;
                }
                
                .sync-main {
                    margin-bottom: 16px;
                }
                
                .sync-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .sync-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .sync-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .sync-settings-toggle {
                    padding: 12px;
                    background: #f7f7f7;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    font-size: 14px;
                    color: #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: background 0.2s ease;
                }
                
                .sync-settings-toggle:hover {
                    background: #efefef;
                }
                
                .sync-settings-toggle::after {
                    content: '▼';
                    font-size: 12px;
                    transition: transform 0.3s ease;
                }
                
                .sync-settings-toggle.active::after {
                    transform: rotate(180deg);
                }
                
                .sync-settings {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                
                .sync-settings.show {
                    max-height: 600px;
                    margin-top: 16px;
                }
                
                .sync-form-group {
                    margin-bottom: 16px;
                }
                
                .sync-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 13px;
                    color: #666;
                    font-weight: 500;
                }
                
                .sync-form-group input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }
                
                .sync-form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .sync-hint {
                    font-size: 12px;
                    color: #999;
                    margin-top: 4px;
                    line-height: 1.4;
                }
                
                .sync-hint a {
                    color: #667eea;
                    text-decoration: none;
                }
                
                .sync-hint a:hover {
                    text-decoration: underline;
                }
                
                .sync-test-btn {
                    width: 100%;
                    padding: 10px;
                    background: white;
                    color: #667eea;
                    border: 1px solid #667eea;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .sync-test-btn:hover {
                    background: #667eea;
                    color: white;
                }
                
                .sync-test-btn.success {
                    background: #28a745;
                    color: white;
                    border-color: #28a745;
                }
                
                .sync-test-btn.success:hover {
                    background: #218838;
                    border-color: #218838;
                }
                
                .sync-save-btn {
                    width: 100%;
                    padding: 10px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                
                .sync-save-btn:hover {
                    background: #5568d3;
                }
                
                .sync-status {
                    margin-top: 12px;
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 13px;
                    text-align: center;
                }
                
                .sync-status.success {
                    background: #d4edda;
                    color: #155724;
                }
                
                .sync-status.error {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .sync-status.info {
                    background: #d1ecf1;
                    color: #0c5460;
                }
                
                .sync-modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10001;
                    justify-content: center;
                    align-items: center;
                }
                
                .sync-modal-overlay.show {
                    display: flex;
                }
                
                .sync-modal {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 700px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: modalSlideIn 0.3s ease;
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .sync-modal-header {
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .sync-modal-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                    opacity: 0.8;
                }
                
                .sync-modal-close:hover {
                    opacity: 1;
                }
                
                .sync-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                }
                
                .sync-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }
                
                .sync-table th,
                .sync-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                
                .sync-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #333;
                    position: sticky;
                    top: 0;
                }
                
                .sync-table tr:hover {
                    background: #f8f9fa;
                }
                
                .sync-table td:first-child,
                .sync-table th:first-child {
                    width: 40px;
                    text-align: center;
                }
                
                .sync-table td:nth-child(2),
                .sync-table th:nth-child(2) {
                    width: 70px;
                    text-align: center;
                }
                
                .sync-table td:nth-child(3),
                .sync-table th:nth-child(3) {
                    width: 100px;
                }
                
                .sync-table .answer-summary {
                    color: #666;
                    font-size: 13px;
                    line-height: 1.4;
                    max-width: 350px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .sync-table input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                
                .sync-modal-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                
                .sync-select-all {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                    cursor: pointer;
                }
                
                .sync-confirm-btn {
                    padding: 10px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .sync-confirm-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                .sync-confirm-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .sync-loading {
                    text-align: center;
                    padding: 40px;
                    color: #666;
                }
                
                .sync-empty {
                    text-align: center;
                    padding: 40px;
                    color: #999;
                }
            </style>
            
            <button class="sync-toggle-btn" id="syncToggleBtn">📝</button>
            
            <div class="sync-panel" id="syncPanel">
                <div class="sync-header">知乎 → Obsidian</div>
                <div class="sync-content">
                    <div class="sync-main">
                        <button class="sync-btn" id="syncNowBtn">抓取</button>
                    </div>
                    
                    <button class="sync-settings-toggle" id="settingsToggle">
                        ⚙️ 设置
                    </button>
                    
                    <div class="sync-settings" id="syncSettings">
                        <div class="sync-form-group">
                            <label>Obsidian 连接地址</label>
                            <input type="text" id="obsidianHost" placeholder="http://localhost:27123">
                            <div class="sync-hint">需要安装 <a href="https://github.com/coddingtonbear/obsidian-local-rest-api" target="_blank">Local REST API</a> 插件</div>
                        </div>
                        
                        <div class="sync-form-group">
                            <label>API Key</label>
                            <input type="password" id="obsidianApiKey" placeholder="在 Obsidian 插件设置中获取">
                        </div>
                        
                        <div class="sync-form-group">
                            <button class="sync-test-btn" id="testConnectionBtn">测试连接</button>
                        </div>
                        
                        <div class="sync-form-group">
                            <label>存储路径</label>
                            <input type="text" id="storagePath" placeholder="知乎收藏">
                        </div>
                        
                        <div class="sync-form-group">
                            <label>图片文件夹</label>
                            <input type="text" id="imageFolder" placeholder="attachments">
                        </div>
                    </div>
                    
                    <div class="sync-status" id="syncStatus" style="display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <div class="sync-modal-overlay" id="syncModalOverlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10001; justify-content: center; align-items: center;">
                <div class="sync-modal" style="background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div class="sync-modal-header" style="padding: 16px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; font-size: 16px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                        <span>选择要抓取的回答</span>
                        <button class="sync-modal-close" id="syncModalClose" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
                    </div>
                    <div class="sync-modal-body" id="syncModalBody" style="padding: 20px; overflow-y: auto; flex: 1;">
                        <div class="sync-loading">正在加载回答列表...</div>
                    </div>
                    <div class="sync-modal-footer" style="padding: 16px 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                        <label class="sync-select-all" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; cursor: pointer;">
                            <input type="checkbox" id="syncSelectAll">
                            <span>全选</span>
                        </label>
                        <div>
                            <span id="syncSelectedCount" style="margin-right: 12px; color: #666;">已选择 0 个</span>
                            <button class="sync-confirm-btn" id="syncConfirmBtn" style="padding: 10px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">确认抓取</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);
        
        // 绑定事件
        bindEvents();
        
        // 加载配置
        loadConfigToUI();
    }

    // 绑定事件
    function bindEvents() {
        const toggleBtn = document.getElementById('syncToggleBtn');
        const panel = document.getElementById('syncPanel');
        const settingsToggle = document.getElementById('settingsToggle');
        const settings = document.getElementById('syncSettings');
        const syncNowBtn = document.getElementById('syncNowBtn');
        const testConnectionBtn = document.getElementById('testConnectionBtn');
        const modalOverlay = document.getElementById('syncModalOverlay');
        const modalClose = document.getElementById('syncModalClose');
        const selectAll = document.getElementById('syncSelectAll');
        const confirmBtn = document.getElementById('syncConfirmBtn');
        
        const obsidianHost = document.getElementById('obsidianHost');
        const obsidianApiKey = document.getElementById('obsidianApiKey');
        const storagePath = document.getElementById('storagePath');
        const imageFolder = document.getElementById('imageFolder');
        
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('show');
        });
        
        settingsToggle.addEventListener('click', () => {
            settingsToggle.classList.toggle('active');
            settings.classList.toggle('show');
        });
        
        syncNowBtn.addEventListener('click', openAnswerModal);
        
        testConnectionBtn.addEventListener('click', testConnection);
        
        obsidianHost.addEventListener('input', autoSaveSettings);
        obsidianApiKey.addEventListener('input', autoSaveSettings);
        storagePath.addEventListener('input', autoSaveSettings);
        imageFolder.addEventListener('input', autoSaveSettings);
        
        modalClose.addEventListener('click', closeAnswerModal);
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeAnswerModal();
            }
        });
        
        selectAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.sync-answer-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
            updateSelectedCount();
        });
        
        confirmBtn.addEventListener('click', startBatchSync);
    }

    function autoSaveSettings() {
        const config = {
            obsidianHost: document.getElementById('obsidianHost').value.trim(),
            obsidianApiKey: document.getElementById('obsidianApiKey').value.trim(),
            storagePath: document.getElementById('storagePath').value.trim(),
            imageFolder: document.getElementById('imageFolder').value.trim()
        };
        
        saveConfig(config);
    }

    function openAnswerModal() {
        const overlay = document.getElementById('syncModalOverlay');
        const body = document.getElementById('syncModalBody');
        
        overlay.style.display = 'flex';
        body.innerHTML = '<div class="sync-loading" style="text-align: center; padding: 40px; color: #666;">正在加载回答列表...</div>';
        
        setTimeout(() => {
            const answers = extractAllAnswers();
            renderAnswerTable(answers);
        }, 100);
    }

    function closeAnswerModal() {
        const overlay = document.getElementById('syncModalOverlay');
        overlay.style.display = 'none';
        document.getElementById('syncSelectAll').checked = false;
        updateSelectedCount();
    }

    function extractAllAnswers() {
        const answers = [];
        const seenAnswerIds = new Set();
        const url = window.location.href;
        
        const questionMatch = url.match(/question\/(\d+)/);
        const questionId = questionMatch ? questionMatch[1] : '';
        const questionTitle = document.querySelector('.QuestionHeader-title')?.textContent.trim() || '未知问题';
        
        const answerItems = document.querySelectorAll('.AnswerItem');
        
        answerItems.forEach((item, index) => {
            const authorEl = item.querySelector('.AuthorInfo-name');
            const author = authorEl?.textContent.trim() || '匿名用户';
            
            let upvotes = '0';
            
            const voteBtn = item.querySelector('button[aria-label^="赞同"]');
            if (voteBtn) {
                const ariaLabel = voteBtn.getAttribute('aria-label');
                if (ariaLabel) {
                    const match = ariaLabel.match(/赞同\s*([\d.,]+\s*[万kKwW]?)/);
                    if (match) {
                        upvotes = match[1].replace(/\s/g, '');
                    }
                }
            }
            
            if (upvotes === '0') {
                const voteBtn = item.querySelector('.VoteButton--up');
                if (voteBtn) {
                    const voteText = voteBtn.textContent.trim();
                    const match = voteText.match(/([\d.,]+\s*[万kKwW]?)/);
                    if (match) {
                        upvotes = match[1].replace(/\s/g, '');
                    }
                }
            }
            
            if (upvotes === '0') {
                const dataZop = item.getAttribute('data-zop');
                if (dataZop) {
                    try {
                        const zopData = JSON.parse(dataZop);
                        if (zopData.upvoteNum !== undefined) {
                            upvotes = String(zopData.upvoteNum);
                        }
                    } catch (e) {}
                }
            }
            
            if (upvotes === '0') {
                const contentItem = item.querySelector('.ContentItem');
                if (contentItem) {
                    const dataZa = contentItem.getAttribute('data-za-extra-module');
                    if (dataZa) {
                        try {
                            const zaData = JSON.parse(dataZa);
                            if (zaData.card?.content?.upvote_num !== undefined) {
                                upvotes = String(zaData.card.content.upvote_num);
                            }
                        } catch (e) {}
                    }
                }
            }
            
            const contentEl = item.querySelector('.RichContent-inner');
            const content = contentEl?.innerHTML || '';
            const textContent = contentEl?.textContent.trim() || '';
            const rawSummary = textContent.length > 80 ? textContent.substring(0, 80) + '...' : textContent;
            const summary = escapeHtml(rawSummary);
            
            const answerLink = item.querySelector('a[href*="/answer/"]');
            let answerId = '';
            if (answerLink) {
                const match = answerLink.href.match(/answer\/(\d+)/);
                answerId = match ? match[1] : '';
            }
            
            if (!answerId) {
                const dataZop = item.getAttribute('data-zop');
                if (dataZop) {
                    try {
                        const zop = JSON.parse(dataZop);
                        answerId = zop.itemId || '';
                    } catch (e) {}
                }
            }
            
            const timeEl = item.querySelector('.ContentItem-time');
            const publishTime = timeEl?.textContent.trim() || '';
            
            const finalAnswerId = answerId || `temp-${index}`;
            
            if (content && !seenAnswerIds.has(finalAnswerId)) {
                seenAnswerIds.add(finalAnswerId);
                answers.push({
                    index,
                    author,
                    upvotes,
                    summary,
                    content,
                    answerId: finalAnswerId,
                    questionId,
                    questionTitle,
                    publishTime,
                    url: answerId ? `https://www.zhihu.com/question/${questionId}/answer/${answerId}` : url
                });
            }
        });
        
        return answers;
    }

    function renderAnswerTable(answers) {
        const body = document.getElementById('syncModalBody');
        
        if (answers.length === 0) {
            body.innerHTML = '<div class="sync-empty">未找到回答，请确保在知乎问题页面</div>';
            return;
        }
        
        let html = `
            <table class="sync-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                    <tr>
                        <th style="padding: 12px; text-align: center; background: #f8f9fa; font-weight: 600; color: #333; border-bottom: 1px solid #eee; width: 40px;"></th>
                        <th style="padding: 12px; text-align: left; background: #f8f9fa; font-weight: 600; color: #333; border-bottom: 1px solid #eee; width: 120px;">答案 ID</th>
                        <th style="padding: 12px; text-align: center; background: #f8f9fa; font-weight: 600; color: #333; border-bottom: 1px solid #eee; width: 80px;">赞同数</th>
                        <th style="padding: 12px; text-align: left; background: #f8f9fa; font-weight: 600; color: #333; border-bottom: 1px solid #eee; width: 100px;">答主</th>
                        <th style="padding: 12px; text-align: left; background: #f8f9fa; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">回答摘要</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        answers.forEach((answer, idx) => {
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px; text-align: center;"><input type="checkbox" class="sync-answer-checkbox" data-index="${idx}" style="width: 18px; height: 18px; cursor: pointer;"></td>
                    <td style="padding: 12px; font-family: monospace; font-size: 12px; color: #666;">${answer.answerId}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 500; color: #667eea;">${answer.upvotes}</td>
                    <td style="padding: 12px; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${answer.author}</td>
                    <td style="padding: 12px; color: #666; font-size: 13px; line-height: 1.4; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${answer.summary}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        body.innerHTML = html;
        
        window._zhihuAnswers = answers;
        
        const checkboxes = document.querySelectorAll('.sync-answer-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateSelectedCount);
        });
    }

    function updateSelectedCount() {
        const checkboxes = document.querySelectorAll('.sync-answer-checkbox:checked');
        const countEl = document.getElementById('syncSelectedCount');
        countEl.textContent = `已选择 ${checkboxes.length} 个`;
    }

    async function startBatchSync() {
        const checkboxes = document.querySelectorAll('.sync-answer-checkbox:checked');
        if (checkboxes.length === 0) {
            showStatus('请至少选择一个回答', 'error');
            return;
        }
        
        const confirmBtn = document.getElementById('syncConfirmBtn');
        confirmBtn.disabled = true;
        confirmBtn.textContent = '抓取中...';
        
        const config = getConfig();
        const answers = window._zhihuAnswers;
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
        const selectedAnswers = selectedIndices.map(idx => answers[idx]);
        
        try {
            await syncMultipleAnswers(selectedAnswers, config, confirmBtn);
            
            confirmBtn.disabled = false;
            confirmBtn.textContent = '确认抓取';
            closeAnswerModal();
            showStatus(`✓ 成功抓取 ${selectedAnswers.length} 个回答到同一文件`, 'success');
        } catch (error) {
            console.error('抓取失败:', error);
            confirmBtn.disabled = false;
            confirmBtn.textContent = '确认抓取';
            showStatus('✗ 抓取失败: ' + error.message, 'error');
        }
    }

    async function syncMultipleAnswers(selectedAnswers, config, confirmBtn) {
        if (selectedAnswers.length === 0) return;
        
        const firstAnswer = selectedAnswers[0];
        const questionTitle = firstAnswer.questionTitle;
        const questionId = firstAnswer.questionId;
        const date = new Date().toISOString().split('T')[0];
        
        let allAnswersContent = '';
        let processedCount = 0;
        
        for (const answer of selectedAnswers) {
            const { markdown, imageMap } = htmlToMarkdown(answer.content);
            
            let finalMarkdown = markdown;
            
            for (const img of imageMap) {
                try {
                    const ext = img.src.split('.').pop().split('?')[0] || 'jpg';
                    const imageName = `${Date.now()}-${img.index}.${ext}`;
                    const imagePath = await downloadAndUploadImage(img.src, imageName, config, questionId);
                    finalMarkdown = finalMarkdown.replace(
                        `[[IMAGE_PLACEHOLDER_${img.index}]]`,
                        `![[${imagePath}]]`
                    );
                } catch (error) {
                    finalMarkdown = finalMarkdown.replace(
                        `[[IMAGE_PLACEHOLDER_${img.index}]]`,
                        `![${img.alt}](${img.src})`
                    );
                }
            }
            
            const formattedContent = finalMarkdown.split('\n').map(line => {
                if (line.trim().startsWith('>')) {
                    return '> ' + line.trim().substring(1).trim();
                }
                return '> ' + line;
            }).join('\n');
            
            const answerSection = `
---

## 📝 ${answer.author}的回答

> [!quote]- 回答信息
> - **作者：** ${answer.author}
> - **赞同：** ${answer.upvotes}
> - **发布时间：** ${answer.publishTime}
> - **答案ID：** ${answer.answerId}
> - **原文链接：** [查看原文](${answer.url})

> [!note]+ 回答内容
${formattedContent}
`;
            
            allAnswersContent += answerSection;
            processedCount++;
            confirmBtn.textContent = `抓取中... (${processedCount}/${selectedAnswers.length})`;
        }
        
        const fileName = `${questionTitle.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
        const filePath = `${config.storagePath}/${fileName}`;
        
        const existingContent = await checkFileExists(config, filePath);
        
        if (existingContent) {
            const updatedContent = existingContent + allAnswersContent;
            await saveToObsidian(config, filePath, updatedContent);
        } else {
            const fullDocument = `---
title: ${questionTitle}
source: https://www.zhihu.com/question/${questionId}
date: ${date}
answers: ${selectedAnswers.length}
tags: [知乎]
---

# ${questionTitle}

> [!info] 问题信息
> - **问题ID：** ${questionId}
> - **收藏时间：** ${date}
> - **回答数量：** ${selectedAnswers.length}
> - **原文链接：** [查看原文](https://www.zhihu.com/question/${questionId})

${allAnswersContent}
`;
            await saveToObsidian(config, filePath, fullDocument);
        }
    }

    function loadConfigToUI() {
        const config = getConfig();
        document.getElementById('obsidianHost').value = config.obsidianHost;
        document.getElementById('obsidianApiKey').value = config.obsidianApiKey;
        document.getElementById('storagePath').value = config.storagePath;
        document.getElementById('imageFolder').value = config.imageFolder;
    }

    function testConnection() {
        const host = document.getElementById('obsidianHost').value.trim();
        const apiKey = document.getElementById('obsidianApiKey').value.trim();
        const testBtn = document.getElementById('testConnectionBtn');
        
        if (!apiKey) {
            showStatus('✗ 请先配置 API Key', 'error');
            return;
        }
        
        testBtn.textContent = '测试中...';
        testBtn.disabled = true;
        testBtn.classList.remove('success');
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: host,
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 5000,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'OK' && data.authenticated === true) {
                            showStatus('✓ 连接成功，API Key 已验证', 'success');
                            testBtn.classList.add('success');
                            testBtn.textContent = '✓ 连接成功';
                        } else if (data.status === 'OK' && data.authenticated === false) {
                            showStatus('✗ API Key 无效或未认证', 'error');
                            testBtn.classList.remove('success');
                            testBtn.textContent = '测试连接';
                        } else {
                            showStatus('✗ 响应格式异常', 'error');
                            testBtn.classList.remove('success');
                            testBtn.textContent = '测试连接';
                        }
                    } catch (e) {
                        showStatus('✗ 解析响应失败', 'error');
                        testBtn.classList.remove('success');
                        testBtn.textContent = '测试连接';
                    }
                } else if (response.status === 401 || response.status === 403) {
                    showStatus('✗ API Key 错误或无权限', 'error');
                    testBtn.classList.remove('success');
                    testBtn.textContent = '测试连接';
                } else {
                    showStatus('✗ 连接失败: ' + response.status, 'error');
                    testBtn.classList.remove('success');
                    testBtn.textContent = '测试连接';
                }
                testBtn.disabled = false;
            },
            onerror: function() {
                showStatus('✗ 连接失败，请检查 Obsidian Local REST API 插件是否已启动', 'error');
                testBtn.classList.remove('success');
                testBtn.textContent = '测试连接';
                testBtn.disabled = false;
            },
            ontimeout: function() {
                showStatus('✗ 连接超时', 'error');
                testBtn.classList.remove('success');
                testBtn.textContent = '测试连接';
                testBtn.disabled = false;
            }
        });
    }

    function showStatus(message, type) {
        const status = document.getElementById('syncStatus');
        status.textContent = message;
        status.className = 'sync-status ' + type;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    // 提取知乎回答内容
    function extractZhihuContent() {
        const url = window.location.href;
        let title, author, content, questionTitle, upvotes, publishTime, answerId, questionId;
        
        if (url.includes('/question/')) {
            questionTitle = document.querySelector('.QuestionHeader-title')?.textContent.trim() || '未知问题';
            author = document.querySelector('.AuthorInfo-name')?.textContent.trim() || '匿名用户';
            content = document.querySelector('.RichContent-inner')?.innerHTML || '';
            
            upvotes = document.querySelector('.VoteButton--up')?.textContent.trim() || '0';
            
            const timeElement = document.querySelector('.ContentItem-time');
            publishTime = timeElement?.textContent.trim() || '';
            
            const questionMatch = url.match(/question\/(\d+)/);
            questionId = questionMatch ? questionMatch[1] : Date.now().toString();
            
            const answerMatch = url.match(/answer\/(\d+)/);
            answerId = answerMatch ? answerMatch[1] : Date.now().toString();
            
            title = `${questionTitle} - ${author}的回答`;
        } else if (url.includes('/p/')) {
            title = document.querySelector('.Post-Title')?.textContent.trim() || '未知标题';
            author = document.querySelector('.AuthorInfo-name')?.textContent.trim() || '匿名用户';
            content = document.querySelector('.Post-RichTextContainer')?.innerHTML || '';
            questionTitle = title;
            
            upvotes = document.querySelector('.VoteButton--up')?.textContent.trim() || '0';
            
            const timeElement = document.querySelector('.ContentItem-time');
            publishTime = timeElement?.textContent.trim() || '';
            
            const articleMatch = url.match(/p\/(\d+)/);
            questionId = articleMatch ? articleMatch[1] : Date.now().toString();
            answerId = questionId;
        }
        
        if (!content) {
            throw new Error('无法提取内容，请确保在知乎回答或文章页面');
        }
        
        return {
            title,
            author,
            questionTitle,
            questionId,
            content,
            url,
            upvotes,
            publishTime,
            answerId,
            date: new Date().toISOString().split('T')[0]
        };
    }

    // 将 HTML 转换为 Markdown
    function htmlToMarkdown(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // 处理图片
        const images = temp.querySelectorAll('img');
        const imageMap = [];
        images.forEach((img, index) => {
            const src = img.getAttribute('data-original') || img.src;
            const alt = img.alt || `image-${index}`;
            imageMap.push({ src, alt, index });
            img.replaceWith(`[[IMAGE_PLACEHOLDER_${index}]]`);
        });
        
        // 处理链接
        temp.querySelectorAll('a').forEach(a => {
            const text = a.textContent;
            const href = a.href;
            a.replaceWith(`[${text}](${href})`);
        });
        
        // 处理标题
        for (let i = 1; i <= 6; i++) {
            temp.querySelectorAll(`h${i}`).forEach(h => {
                h.replaceWith(`${'#'.repeat(i)} ${h.textContent}\n\n`);
            });
        }
        
        // 处理粗体
        temp.querySelectorAll('b, strong').forEach(b => {
            b.replaceWith(`**${b.textContent}**`);
        });
        
        // 处理斜体
        temp.querySelectorAll('i, em').forEach(i => {
            i.replaceWith(`*${i.textContent}*`);
        });
        
        // 处理代码块
        temp.querySelectorAll('pre code').forEach(code => {
            code.parentElement.replaceWith(`\n\`\`\`\n${code.textContent}\n\`\`\`\n`);
        });
        
        // 处理行内代码
        temp.querySelectorAll('code').forEach(code => {
            code.replaceWith(`\`${code.textContent}\``);
        });
        
        // 处理列表
        temp.querySelectorAll('ul li').forEach(li => {
            li.replaceWith(`- ${li.textContent}\n`);
        });
        
        temp.querySelectorAll('ol li').forEach((li, index) => {
            li.replaceWith(`${index + 1}. ${li.textContent}\n`);
        });
        
        // 处理段落
        temp.querySelectorAll('p').forEach(p => {
            p.replaceWith(`${p.textContent}\n\n`);
        });
        
        // 处理换行
        temp.querySelectorAll('br').forEach(br => {
            br.replaceWith('\n');
        });
        
        let markdown = temp.textContent;
        
        // 清理多余空行
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        
        return { markdown, imageMap };
    }

    // 下载图片并上传到 Obsidian
    async function downloadAndUploadImage(imageSrc, imageName, config, questionId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageSrc,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            const base64 = reader.result.split(',')[1];
                            
                            const attachmentPath = `${config.storagePath}/${config.imageFolder}/${questionId}/${imageName}`;
                            
                            const headers = {
                                'Content-Type': 'application/octet-stream'
                            };
                            if (config.obsidianApiKey) {
                                headers['Authorization'] = `Bearer ${config.obsidianApiKey}`;
                            }
                            
                            GM_xmlhttpRequest({
                                method: 'PUT',
                                url: `${config.obsidianHost}/vault/${encodeURIComponent(attachmentPath)}`,
                                headers: headers,
                                data: atob(base64),
                                binary: true,
                                onload: function(uploadResponse) {
                                    if (uploadResponse.status === 200 || uploadResponse.status === 204) {
                                        resolve(`${config.imageFolder}/${questionId}/${imageName}`);
                                    } else {
                                        reject(new Error('上传图片失败: ' + uploadResponse.status));
                                    }
                                },
                                onerror: function() {
                                    reject(new Error('上传图片失败'));
                                }
                            });
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        reject(new Error('下载图片失败: ' + response.status));
                    }
                },
                onerror: function() {
                    reject(new Error('下载图片失败'));
                }
            });
        });
    }

    function generateSummary(markdown, maxLength = 100) {
        const text = markdown.replace(/[#*`>\[\]!-]/g, '').trim();
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    async function checkFileExists(config, filePath) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${config.obsidianHost}/vault/${encodeURIComponent(filePath)}`,
                headers: {
                    'Authorization': `Bearer ${config.obsidianApiKey}`
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    async function saveToObsidian(config, filePath, content) {
        return new Promise((resolve, reject) => {
            const headers = {
                'Content-Type': 'text/markdown'
            };
            if (config.obsidianApiKey) {
                headers['Authorization'] = `Bearer ${config.obsidianApiKey}`;
            }
            
            GM_xmlhttpRequest({
                method: 'PUT',
                url: `${config.obsidianHost}/vault/${encodeURIComponent(filePath)}`,
                headers: headers,
                data: content,
                onload: function(response) {
                    if (response.status === 200 || response.status === 204) {
                        resolve();
                    } else {
                        reject(new Error('保存失败: ' + response.status));
                    }
                },
                onerror: function() {
                    reject(new Error('保存失败，请检查连接'));
                }
            });
        });
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingWindow);
    } else {
        createFloatingWindow();
    }
})();
