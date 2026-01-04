// ==UserScript==
// @name         一些校园论坛用户屏蔽工具（优化版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  高效屏蔽校园论坛中特定用户的发言
// @author       Dicksuck
// @match        *://bit101.cn/gallery/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license NoLicense
// @downloadURL https://update.greasyfork.org/scripts/552771/%E4%B8%80%E4%BA%9B%E6%A0%A1%E5%9B%AD%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552771/%E4%B8%80%E4%BA%9B%E6%A0%A1%E5%9B%AD%E8%AE%BA%E5%9D%9B%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .user-blocked {
            display: none !important;
        }
        .block-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9999;
            width: 300px;
            font-family: Arial, sans-serif;
            display: none;
        }
        .block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .block-title {
            font-size: 18px;
            font-weight: bold;
            color: #027B99;
        }
        .block-close {
            cursor: pointer;
            font-size: 20px;
            color: #999;
        }
        .block-list {
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 15px;
        }
        .block-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background: #f9f9f9;
            border-radius: 4px;
            margin-bottom: 5px;
        }
        .block-item:hover {
            background: #f0f0f0;
        }
        .remove-user {
            color: #e74c3c;
            cursor: pointer;
            font-weight: bold;
        }
        .block-input {
            display: flex;
            margin-bottom: 10px;
        }
        .block-input input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
        }
        .block-input button {
            padding: 8px 15px;
            background: #027B99;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        .block-stats {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            text-align: center;
        }
        .toggle-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #027B99;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9998;
        }
    `);

    // 从存储中获取屏蔽列表
    let blockedUsers = JSON.parse(GM_getValue('blockedUsers', '[]'));
    let blockedCount = 0;
    let observer = null;

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'block-control-panel';
        panel.innerHTML = `
            <div class="block-header">
                <div class="block-title">用户屏蔽管理</div>
                <div class="block-close">×</div>
            </div>
            <div class="block-input">
                <input type="text" id="username-input" placeholder="输入用户名">
                <button id="add-user">屏蔽</button>
            </div>
            <div class="block-list" id="block-list"></div>
            <div class="block-stats">已屏蔽 <span id="block-count">0</span> 条内容</div>
        `;
        document.body.appendChild(panel);

        // 添加关闭功能
        panel.querySelector('.block-close').addEventListener('click', () => {
            panel.style.display = 'none';
            createToggleButton();
        });

        // 添加用户功能
        document.getElementById('add-user').addEventListener('click', addUser);
        document.getElementById('username-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addUser();
        });

        // 渲染屏蔽列表
        renderBlockList();
        updateBlockCount();
    }

    // 创建切换按钮
    function createToggleButton() {
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-panel';
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.addEventListener('click', () => {
            document.querySelector('.block-control-panel').style.display = 'block';
            toggleBtn.remove();
        });
        document.body.appendChild(toggleBtn);
    }

    // 添加用户到屏蔽列表
    function addUser() {
        const input = document.getElementById('username-input');
        const username = input.value.trim();

        if (username && !blockedUsers.includes(username)) {
            blockedUsers.push(username);
            GM_setValue('blockedUsers', JSON.stringify(blockedUsers));
            input.value = '';
            renderBlockList();
            blockUserContent();
        }
    }

    // 从屏蔽列表移除用户
    function removeUser(username) {
        blockedUsers = blockedUsers.filter(user => user !== username);
        GM_setValue('blockedUsers', JSON.stringify(blockedUsers));
        renderBlockList();

        // 重新显示该用户的内容
        document.querySelectorAll('.user-blocked').forEach(el => {
            if (el.dataset.username === username) {
                el.classList.remove('user-blocked');
            }
        });
        updateBlockCount();
    }

    // 渲染屏蔽列表
    function renderBlockList() {
        const list = document.getElementById('block-list');
        list.innerHTML = '';

        if (blockedUsers.length === 0) {
            list.innerHTML = '<div style="padding: 10px; text-align: center; color: #888;">暂无屏蔽用户</div>';
            return;
        }

        blockedUsers.forEach(user => {
            const item = document.createElement('div');
            item.className = 'block-item';
            item.innerHTML = `
                <span>${user}</span>
                <span class="remove-user" data-user="${user}">×</span>
            `;
            list.appendChild(item);
        });

        // 添加移除事件
        document.querySelectorAll('.remove-user').forEach(el => {
            el.addEventListener('click', () => {
                removeUser(el.dataset.user);
            });
        });
    }

    // 更新屏蔽计数
    function updateBlockCount() {
        const countEl = document.getElementById('block-count');
        if (countEl) {
            countEl.textContent = blockedCount;
        }
    }

    // 屏蔽用户内容（优化版）
    function blockUserContent() {
        // 只处理可见且未处理的卡片
        const cards = document.querySelectorAll('.n-card:not(.processed)');

        cards.forEach(card => {
            // 标记为已处理
            card.classList.add('processed');

            // 在卡片中查找用户名
            const userElement = card.querySelector('.n-ellipsis span');
            if (userElement) {
                const username = userElement.textContent.trim();

                // 检查是否在屏蔽列表中
                if (blockedUsers.includes(username)) {
                    card.classList.add('user-blocked');
                    card.dataset.username = username;
                    blockedCount++;
                }
            }
        });

        updateBlockCount();
    }

    // 使用防抖函数减少频繁调用
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    // 初始化
    window.addEventListener('load', () => {
        createControlPanel();
        createToggleButton();

        // 初始屏蔽处理
        blockUserContent();

        // 优化MutationObserver - 只在需要时观察
        observer = new MutationObserver(debounce(() => {
            blockUserContent();
        }, 300));

        // 只观察帖子容器（假设帖子都在#post-container中）
        const postContainer = document.querySelector('#post-container') || document.body;
        observer.observe(postContainer, {
            childList: true,
            subtree: true
        });
    });

    // 页面卸载时断开观察器
    window.addEventListener('beforeunload', () => {
        if (observer) observer.disconnect();
    });
})();