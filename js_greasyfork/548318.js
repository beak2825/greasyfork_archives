// ==UserScript==
// @name         DeepSeek对话收藏器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  收藏DeepSeek对话并支持搜索查看
// @author       berry22jelly
// @license      MIT
// @match        https://chat.deepseek.com/a/chat
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548318/DeepSeek%E5%AF%B9%E8%AF%9D%E6%94%B6%E8%97%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548318/DeepSeek%E5%AF%B9%E8%AF%9D%E6%94%B6%E8%97%8F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用GM存储函数进行数据持久化
    const storage = {
        set: (key, value) => GM_setValue(key, value),
        get: (key, defaultValue = null) => GM_getValue(key, defaultValue),
        getAll: () => GM_listValues().map(key => ({ key, value: GM_getValue(key) })),
        remove: (key) => GM_deleteValue(key)
    };

    // 添加样式
    GM_addStyle(`
        .dsc-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }

        .dsc-modal-content {
            background-color: #1f2937;
            margin: 5% auto;
            padding: 20px;
            border: 1px solid #374151;
            border-radius: 8px;
            width: 80%;
            max-width: 800px;
            color: #e5e7eb;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .dsc-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .dsc-close:hover {
            color: #fff;
        }

        .dsc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #374151;
        }

        .dsc-search {
            padding: 8px 12px;
            background-color: #111827;
            border: 1px solid #374151;
            border-radius: 4px;
            color: #e5e7eb;
            width: 300px;
        }

        .dsc-collection-list {
            max-height: 400px;
            overflow-y: auto;
        }

        .dsc-collection-item {
            padding: 12px;
            margin-bottom: 10px;
            background-color: #111827;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
        }

        .dsc-collection-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #3b82f6;
        }

        .dsc-collection-preview {
            color: #9ca3af;
            font-size: 0.9em;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .dsc-collection-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.8em;
            color: #6b7280;
        }

        .dsc-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .dsc-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }

        .dsc-btn-primary {
            background-color: #3b82f6;
            color: white;
        }

        .dsc-btn-danger {
            background-color: #ef4444;
            color: white;
        }

        .dsc-btn:hover {
            opacity: 0.9;
        }

        .dsc-empty {
            text-align: center;
            color: #6b7280;
            padding: 20px;
        }

        .dsc-save-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
        }

        .dsc-save-btn:hover {
            background-color: #2563eb;
        }
    `);

    // 创建模态框
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'dsc-modal';
        modal.innerHTML = `
            <div class="dsc-modal-content">
                <span class="dsc-close">&times;</span>
                <div class="dsc-header">
                    <h2>收藏的对话</h2>
                    <input type="text" class="dsc-search" placeholder="搜索收藏...">
                </div>
                <div class="dsc-collection-list"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 关闭模态框
        modal.querySelector('.dsc-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // 搜索功能
        const searchInput = modal.querySelector('.dsc-search');
        searchInput.addEventListener('input', () => {
            renderCollections(searchInput.value);
        });

        return modal;
    }

    // 创建收藏按钮
    function createSaveButton() {
        const button = document.createElement('button');
        button.className = 'dsc-save-btn';
        button.innerHTML = '⭐';
        button.title = '收藏当前对话';

        button.addEventListener('click', () => {
            saveCurrentConversation();
        });

        document.body.appendChild(button);
        return button;
    }

    // 获取当前对话内容
    function getCurrentConversation() {
        // 根据DeepSeek的DOM结构获取对话内容
        // 注意：实际实现可能需要根据网站更新调整选择器
        const messages = Array.from(document.querySelectorAll('[class*="message"]')).map(el => {
            return el.textContent.trim();
        }).filter(text => text.length > 0);

        return messages.join('\n\n');
    }

    // 保存当前对话
    function saveCurrentConversation() {
        if (!isConversationPage()) {
            alert('当前页面不是对话页面，无法收藏。');
            return;
        }

        const title = document.title;
        const content = getCurrentConversation();
        const url = window.location.href;
        const timestamp = new Date().toISOString();

        const key = `dsc_${Date.now()}`;
        const conversation = {
            title,
            content,
            url,
            timestamp
        };

        storage.set(key, conversation);
        alert('对话已收藏！');
    }

    // 检查是否在对话页面
    function isConversationPage() {
        return /https:\/\/chat\.deepseek\.com\/[a-z]\/chat\/s\/[a-f0-9-]+/.test(window.location.href);
    }

    // 渲染收藏列表
    function renderCollections(searchTerm = '') {
        const collectionList = modal.querySelector('.dsc-collection-list');
        const allCollections = storage.getAll();

        if (allCollections.length === 0) {
            collectionList.innerHTML = '<div class="dsc-empty">暂无收藏的对话</div>';
            return;
        }

        let html = '';
        const filtered = allCollections.filter(( {value} ) => {
            return value.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   value.content.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (filtered.length === 0) {
            collectionList.innerHTML = '<div class="dsc-empty">没有找到匹配的收藏</div>';
            return;
        }

        filtered.forEach(({ key, value }) => {
            const date = new Date(value.timestamp).toLocaleString();
            const preview = value.content.length > 100 ?
                value.content.substring(0, 100) + '...' : value.content;

            html += `
                <div class="dsc-collection-item">
                    <div class="dsc-collection-title">${value.title}</div>
                    <div class="dsc-collection-preview">${preview}</div>
                    <div class="dsc-collection-meta">
                        <span>${date}</span>
                        <span>${value.url}</span>
                    </div>
                    <div class="dsc-actions">
                        <button class="dsc-btn dsc-btn-primary" onclick="window.open('${value.url}', '_blank')">查看对话</button>
                        <button class="dsc-btn dsc-btn-danger" data-key="${key}">删除</button>
                    </div>
                </div>
            `;
        });

        collectionList.innerHTML = html;

        // 添加删除事件监听
        collectionList.querySelectorAll('.dsc-btn-danger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = e.target.getAttribute('data-key');
                if (confirm('确定要删除这个收藏吗？')) {
                    storage.remove(key);
                    renderCollections(searchTerm);
                }
            });
        });
    }

    // 初始化
    let modal;
    let saveButton;

    function init() {
        modal = createModal();

        // 只在对话页面显示收藏按钮
        if (isConversationPage()) {
            saveButton = createSaveButton();
        }

        // 注册Tampermonkey菜单命令
        GM_registerMenuCommand("查看收藏对话", () => {
            modal.style.display = 'block';
            renderCollections();
        });
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();