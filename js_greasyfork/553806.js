// ==UserScript==
// @name         显示Telegram Peer ID
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在Telegram Web聊天列表中显示peer ID
// @author       You
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553806/%E6%98%BE%E7%A4%BATelegram%20Peer%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/553806/%E6%98%BE%E7%A4%BATelegram%20Peer%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    const style = document.createElement('style');
    style.textContent = `
        .peer-id-badge {
            display: inline-block;
            margin-left: 6px;
            padding: 2px 6px;
            background: rgba(0, 123, 255, 0.15);
            color: #007bff;
            border-radius: 4px;
            font-size: 11px;
            font-family: monospace;
            font-weight: normal;
            vertical-align: middle;
        }

        /* 选中状态下的样式 */
        .chat-item-clickable.active .peer-id-badge,
        .chat-item-clickable[class*="selected"] .peer-id-badge {
            background: rgba(255, 255, 255, 0.25);
            color: #ffffff;
        }

        /* 悬停状态 */
        .chat-item-clickable:hover .peer-id-badge {
            background: rgba(0, 123, 255, 0.25);
        }

        .chat-item-clickable.active:hover .peer-id-badge,
        .chat-item-clickable[class*="selected"]:hover .peer-id-badge {
            background: rgba(255, 255, 255, 0.35);
        }
    `;
    document.head.appendChild(style);

    // 处理单个聊天项
    function processChatItem(chatItem) {
        // 查找包含 data-peer-id 的元素
        const avatarElement = chatItem.querySelector('[data-peer-id]');
        if (!avatarElement) return;

        const peerId = avatarElement.getAttribute('data-peer-id');
        if (!peerId) return;

        // 查找昵称元素
        const nameElement = chatItem.querySelector('.fullName');
        if (!nameElement) return;

        // 检查是否已经添加过 peer ID
        if (nameElement.querySelector('.peer-id-badge')) return;

        // 创建并添加 peer ID 标签
        const peerIdBadge = document.createElement('span');
        peerIdBadge.className = 'peer-id-badge';
        peerIdBadge.textContent = peerId;
        peerIdBadge.title = `Peer ID: ${peerId}`;

        nameElement.appendChild(peerIdBadge);
    }

    // 处理所有聊天项
    function processAllChats() {
        const chatItems = document.querySelectorAll('.chat-item-clickable');
        chatItems.forEach(processChatItem);
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            processAllChats();
        }
    });

    // 等待页面加载完成
    function init() {
        // 初始处理
        processAllChats();

        // 开始监听
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 定期检查（防止某些情况下遗漏）
    setInterval(processAllChats, 2000);
})();