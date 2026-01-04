// ==UserScript==
// @name         Telegram Message Blocker with Switch and Import/Export
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block Telegram messages containing specific keywords with switch and import/export functionality
// @author       YourName
// @match        https://web.telegram.org/a/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/557318/Telegram%20Message%20Blocker%20with%20Switch%20and%20ImportExport.user.js
// @updateURL https://update.greasyfork.org/scripts/557318/Telegram%20Message%20Blocker%20with%20Switch%20and%20ImportExport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中获取关键词列表，如果没有则使用默认值
    let blockedKeywords = GM_getValue('blockedKeywords', [
        '极搜',
        '搜索',
        '广告',
        '推广',
        '点击下方',
        '点击按钮'
    ]);

    // 从存储中获取关键词开关状态
    let keywordStatus = GM_getValue('keywordStatus', {});

    // 从存储中获取关键词历史记录
    let keywordHistory = GM_getValue('keywordHistory', []);

    // 添加关键词到历史记录
    function addToHistory(keyword) {
        if (!keywordHistory.includes(keyword)) {
            keywordHistory.unshift(keyword); // 添加到开头
            if (keywordHistory.length > 50) { // 最多保留50个历史记录
                keywordHistory.pop();
            }
            GM_setValue('keywordHistory', keywordHistory);
        }
    }

    // 检查消息文本是否包含屏蔽关键词
    function containsBlockedKeyword(messageElement) {
        const textContent = messageElement.textContent.toLowerCase();

        return blockedKeywords.some(keyword =>
            keywordStatus[keyword] !== false && // 检查关键词是否启用
            textContent.includes(keyword.toLowerCase())
        );
    }

    // 屏蔽单个消息
    function blockMessage(messageElement) {
        messageElement.style.display = 'none';
    }

    // 屏蔽所有匹配的消息
    function blockMessagesWithKeywords() {
        const messages = document.querySelectorAll('[id^="message-"]');

        messages.forEach(message => {
            if (containsBlockedKeyword(message)) {
                blockMessage(message);
            }
        });
    }

    // 创建悬浮框UI
    function createFloatingUI() {
        // 创建容器
        const uiContainer = document.createElement('div');
        uiContainer.id = 'tg-blocker-ui';
        GM_addStyle(`
            #tg-blocker-ui {
                position: fixed;
                right: 20px;
                bottom: 80px;
                width: 350px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                padding: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                transition: transform 0.3s ease;
                display: none;
            }

            #tg-blocker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }

            #tg-blocker-title {
                font-weight: bold;
                font-size: 14px;
            }

            #tg-blocker-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 18px;
                color: #666;
            }

            .tab-container {
                display: flex;
                margin-bottom: 10px;
                border-bottom: 1px solid #eee;
            }

            .tab {
                flex: 1;
                padding: 8px;
                text-align: center;
                cursor: pointer;
                background: none;
                border: none;
                font-size: 13px;
                color: #666;
            }

            .tab.active {
                color: #08c;
                border-bottom: 2px solid #08c;
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            #tg-blocker-keywords, #tg-blocker-history {
                margin-bottom: 10px;
                max-height: 150px;
                overflow-y: auto;
            }

            .keyword-item {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }

            .keyword-text {
                flex-grow: 1;
                padding: 5px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 13px;
            }

            .keyword-action {
                display: flex;
            }

            .keyword-toggle, .keyword-delete, .keyword-use {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                margin-left: 5px;
                font-size: 16px;
            }

            .keyword-toggle {
                color: #4CAF50;
            }

            .keyword-delete {
                color: #ff5252;
            }

            .keyword-use {
                color: #4CAF50;
            }

            #tg-blocker-add {
                display: flex;
                margin-top: 10px;
            }

            #tg-blocker-new-keyword {
                flex-grow: 1;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-right: 5px;
            }

            #tg-blocker-add-button {
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
            }

            #tg-blocker-stats {
                font-size: 12px;
                color: #666;
                text-align: center;
                margin-top: 10px;
                border-top: 1px solid #eee;
                padding-top: 10px;
            }

            #copy-notification {
                position: fixed;
                bottom: 120px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                display: none;
            }

            #tg-blocker-import-text {
                width: 100%;
                height: 100px;
                margin-bottom: 10px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                resize: vertical;
            }

            #tg-blocker-import-button, #tg-blocker-export-button {
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                width: 100%;
                margin-bottom: 5px;
            }

            #tg-blocker-export-button {
                background: #2196F3;
            }
        `);

        // 创建UI结构
        uiContainer.innerHTML = `
            <div id="tg-blocker-header">
                <div id="tg-blocker-title">Telegram 消息屏蔽器</div>
                <button id="tg-blocker-close">×</button>
            </div>
            <div class="tab-container">
                <button class="tab active" data-tab="keywords">当前关键词</button>
                <button class="tab" data-tab="history">历史记录</button>
                <button class="tab" data-tab="import">导入导出</button>
            </div>
            <div id="keywords-tab" class="tab-content active">
                <div id="tg-blocker-keywords"></div>
            </div>
            <div id="history-tab" class="tab-content">
                <div id="tg-blocker-history"></div>
            </div>
            <div id="import-tab" class="tab-content">
                <textarea id="tg-blocker-import-text" placeholder="粘贴关键词，每行一个"></textarea>
                <button id="tg-blocker-import-button">导入关键词</button>
                <button id="tg-blocker-export-button">导出关键词</button>
            </div>
            <div id="tg-blocker-add">
                <input type="text" id="tg-blocker-new-keyword" placeholder="添加新关键词">
                <button id="tg-blocker-add-button">添加</button>
            </div>
            <div id="tg-blocker-stats">已屏蔽关键词: ${blockedKeywords.filter(k => keywordStatus[k] !== false).length} 条</div>
            <div id="copy-notification">已复制到剪贴板！</div>
        `;

        document.body.appendChild(uiContainer);

        // 切换标签页
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动状态
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // 添加活动状态
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');

                // 刷新对应内容
                if (tab.dataset.tab === 'keywords') {
                    updateKeywordsList();
                } else if (tab.dataset.tab === 'history') {
                    updateHistoryList();
                }
            });
        });

        // 添加关键词到UI
        function updateKeywordsList() {
            const keywordsContainer = document.getElementById('tg-blocker-keywords');
            keywordsContainer.innerHTML = '';

            blockedKeywords.forEach((keyword, index) => {
                const keywordItem = document.createElement('div');
                keywordItem.className = 'keyword-item';
                const isEnabled = keywordStatus[keyword] !== false;
                keywordItem.innerHTML = `
                    <div class="keyword-text" style="color: ${isEnabled ? 'black' : '#999'}">${keyword}</div>
                    <div class="keyword-action">
                        <button class="keyword-toggle" data-keyword="${keyword}" title="${isEnabled ? '禁用' : '启用'}">${isEnabled ? '✓' : '✗'}</button>
                        <button class="keyword-delete" data-index="${index}">×</button>
                    </div>
                `;
                keywordsContainer.appendChild(keywordItem);
            });

            // 更新统计信息
            document.getElementById('tg-blocker-stats').textContent =
                `已屏蔽关键词: ${blockedKeywords.filter(k => keywordStatus[k] !== false).length} 条`;
        }

        // 更新历史记录列表
        function updateHistoryList() {
            const historyContainer = document.getElementById('tg-blocker-history');
            historyContainer.innerHTML = '';

            if (keywordHistory.length === 0) {
                historyContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 10px;">暂无历史记录</div>';
                return;
            }

            keywordHistory.forEach((keyword, index) => {
                const keywordItem = document.createElement('div');
                keywordItem.className = 'keyword-item';
                keywordItem.innerHTML = `
                    <div class="keyword-text">${keyword}</div>
                    <div class="keyword-action">
                        <button class="keyword-use" data-index="${index}" title="添加到当前关键词">+</button>
                    </div>
                `;
                historyContainer.appendChild(keywordItem);
            });
        }

        // 初始化关键词列表
        updateKeywordsList();
        updateHistoryList();

        // 绑定事件
        document.getElementById('tg-blocker-close').addEventListener('click', () => {
            uiContainer.style.display = 'none';
            toggleButton.style.display = 'flex';
        });

        // 添加新关键词
        document.getElementById('tg-blocker-add-button').addEventListener('click', () => {
            const newKeywordInput = document.getElementById('tg-blocker-new-keyword');
            const newKeyword = newKeywordInput.value.trim();

            if (newKeyword && !blockedKeywords.includes(newKeyword)) {
                blockedKeywords.push(newKeyword);
                keywordStatus[newKeyword] = true; // 默认启用新关键词
                GM_setValue('blockedKeywords', blockedKeywords);
                GM_setValue('keywordStatus', keywordStatus);
                addToHistory(newKeyword);
                updateKeywordsList();
                newKeywordInput.value = '';
                blockMessagesWithKeywords();
            }
        });

        // 回车键添加关键词
        document.getElementById('tg-blocker-new-keyword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('tg-blocker-add-button').click();
            }
        });

        // 删除关键词
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('keyword-delete')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                const keyword = blockedKeywords[index];
                delete keywordStatus[keyword];
                blockedKeywords.splice(index, 1);
                GM_setValue('blockedKeywords', blockedKeywords);
                GM_setValue('keywordStatus', keywordStatus);
                updateKeywordsList();
                blockMessagesWithKeywords();
            }

            // 切换关键词开关
            if (e.target.classList.contains('keyword-toggle')) {
                const keyword = e.target.getAttribute('data-keyword');
                keywordStatus[keyword] = !keywordStatus[keyword];
                GM_setValue('keywordStatus', keywordStatus);
                updateKeywordsList();
                blockMessagesWithKeywords();
            }

            // 从历史记录添加到当前关键词
            if (e.target.classList.contains('keyword-use')) {
                const keyword = keywordHistory[parseInt(e.target.getAttribute('data-index'))];
                if (keyword && !blockedKeywords.includes(keyword)) {
                    blockedKeywords.push(keyword);
                    keywordStatus[keyword] = true;
                    GM_setValue('blockedKeywords', blockedKeywords);
                    GM_setValue('keywordStatus', keywordStatus);
                    updateKeywordsList();
                    blockMessagesWithKeywords();
                }
            }
        });

        // 导入关键词
        document.getElementById('tg-blocker-import-button').addEventListener('click', () => {
            const importText = document.getElementById('tg-blocker-import-text').value.trim();
            if (importText) {
                const newKeywords = importText.split('\n')
                    .map(k => k.trim())
                    .filter(k => k.length > 0);

                newKeywords.forEach(keyword => {
                    if (!blockedKeywords.includes(keyword)) {
                        blockedKeywords.push(keyword);
                        keywordStatus[keyword] = true;
                        addToHistory(keyword);
                    }
                });

                GM_setValue('blockedKeywords', blockedKeywords);
                GM_setValue('keywordStatus', keywordStatus);
                updateKeywordsList();
                document.getElementById('tg-blocker-import-text').value = '';
                blockMessagesWithKeywords();

                // 切换到关键词标签页
                document.querySelector('.tab[data-tab="keywords"]').click();
            }
        });

        // 导出关键词
        document.getElementById('tg-blocker-export-button').addEventListener('click', () => {
            const enabledKeywords = blockedKeywords.filter(k => keywordStatus[k] !== false);
            const keywordsText = enabledKeywords.join('\n');
            navigator.clipboard.writeText(keywordsText).then(() => {
                const notification = document.getElementById('copy-notification');
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                // 回退方案
                const textarea = document.createElement('textarea');
                textarea.value = keywordsText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                const notification = document.getElementById('copy-notification');
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            });
        });
    }

    // 创建油猴插件按钮
    function createToggleButton() {
        toggleButton = document.createElement('div');
        toggleButton.id = 'tg-blocker-toggle';
        GM_addStyle(`
            #tg-blocker-toggle {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 50px;
                height: 50px;
                background: #08c;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                z-index: 9998;
                transition: transform 0.2s;
            }

            #tg-blocker-toggle:hover {
                transform: scale(1.1);
            }

            #tg-blocker-toggle::before {
                content: "🚫";
            }
        `);

        toggleButton.addEventListener('click', () => {
            const uiContainer = document.getElementById('tg-blocker-ui');
            if (uiContainer) {
                uiContainer.style.display = uiContainer.style.display === 'none' ? 'block' : 'none';
            }
        });

        document.body.appendChild(toggleButton);
    }

    // 初始化
    let toggleButton;
    createToggleButton();
    createFloatingUI();
    blockMessagesWithKeywords();

    // 使用 MutationObserver 监听动态加载的消息
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                blockMessagesWithKeywords();
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察目标节点
    observer.observe(document.body, config);
})();