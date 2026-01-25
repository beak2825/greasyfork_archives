// ==UserScript==
// @name         人人都是"富可敌国"🐶
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在所有头像上增加金色光韵效果，并添加"富可敌国"标识
// @author       You
// @license MIT
// @match        *://linux.do/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564018/%E4%BA%BA%E4%BA%BA%E9%83%BD%E6%98%AF%22%E5%AF%8C%E5%8F%AF%E6%95%8C%E5%9B%BD%22%F0%9F%90%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/564018/%E4%BA%BA%E4%BA%BA%E9%83%BD%E6%98%AF%22%E5%AF%8C%E5%8F%AF%E6%95%8C%E5%9B%BD%22%F0%9F%90%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const styles = `
        /* 头像金色光韵效果 */
        .avatar-post-glow {
            position: relative !important;
            filter: drop-shadow(0 0 8px #F5bF03) drop-shadow(0 0 15px rgba(245, 191, 3, 0.6)) !important;
            border-radius: 50% !important;
        }

        .avatar-post-glow::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: radial-gradient(circle, rgba(245, 191, 3, 0.4) 0%, rgba(245, 191, 3, 0.2) 50%, transparent 70%);
            border-radius: 50%;
            z-index: -1;
        }

        /* 用户标题"富可敌国"特殊样式 */
        .user-title--富可敌国 {
            background: linear-gradient(90deg, #F5bF03, #FFD700, #F5bF03);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
            animation: title-shimmer 3s ease-in-out infinite;
        }

        @keyframes title-shimmer {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.8;
            }
        }
    `;

    GM_addStyle(styles);

    // 处理头像的函数
    function decorateAvatars() {
        // 只选择帖子内容中的头像（.post-avatar 容器内的头像）
        const avatars = document.querySelectorAll('.post-avatar img.avatar');

        avatars.forEach(avatar => {
            // 检查是否已经处理过
            if (avatar.classList.contains('avatar-post-glow')) {
                return;
            }

            // 排除右上角账号头像（#toggle-current-user）
            if (avatar.closest('#toggle-current-user')) {
                return;
            }

            // 排除帖子总结区域的头像（.topic-map__users-list）
            if (avatar.closest('.topic-map__users-list')) {
                return;
            }

            // 添加金色光韵效果
            avatar.classList.add('avatar-post-glow');
        });
    }

    // 添加富可敌国标签到所有用户
    function addWealthyBadges() {
        // 选择所有 topic-meta-data 中的 names 容器
        const namesContainers = document.querySelectorAll('.topic-meta-data .names');

        namesContainers.forEach(container => {
            // 检查是否已经添加过
            if (container.querySelector('.wealthy-badge')) {
                return;
            }

            // 检查是否已经存在包含"富可敌国"的 user-title
            const existingUserTitle = container.querySelector('.user-title');
            if (existingUserTitle && existingUserTitle.textContent.includes('富可敌国')) {
                return;
            }

            // 在 user-status-message-wrap 之前添加富可敌国标签
            const statusWrap = container.querySelector('.user-status-message-wrap');

            const badge = document.createElement('span');
            badge.className = 'wealthy-badge user-title user-title--富可敌国';
            badge.innerHTML = '富可敌国';

            if (statusWrap) {
                statusWrap.parentElement.insertBefore(badge, statusWrap);
            } else {
                container.appendChild(badge);
            }
        });
    }

    // 初始装饰
    decorateAvatars();
    addWealthyBadges();

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        let shouldDecorate = false;

        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && (node.querySelector('img.avatar') || node.classList.contains('avatar'))) {
                            shouldDecorate = true;
                        }
                    }
                });
            }
        });

        if (shouldDecorate) {
            // 延迟执行，确保DOM完全渲染
            setTimeout(() => {
                decorateAvatars();
                addWealthyBadges();
            }, 100);
        }
    });

    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 页面滚动时也检查新加载的内容
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            decorateAvatars();
            addWealthyBadges();
        }, 300);
    });

    console.log('✨ 头像金色光韵装饰脚本已激活！');
})();