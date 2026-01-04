// ==UserScript==
// @name         专利系统Token复制工具
// @namespace    http://tampermonkey.net/
// @version      1.7
// @icon         data:image/png;base64,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
// @description  复制专利系统网Token，6秒无操作自动隐藏按钮，复制成功后隐藏按钮。
// @author       Developer
// @match        https://interactive.cponline.cnipa.gov.cn/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549576/%E4%B8%93%E5%88%A9%E7%B3%BB%E7%BB%9FToken%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549576/%E4%B8%93%E5%88%A9%E7%B3%BB%E7%BB%9FToken%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .token-copy-btn {
            position: fixed;
            top: 55px;
            right: 10px;
            z-index: 10000;
            padding: 10px 15px;
            background: #4a6cf7;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: opacity 0.5s ease; /* 添加淡出过渡 */
            min-width: 120px;
            opacity: 1; /* 初始可见 */
        }
        .token-copy-btn:hover {
            background: #3451b2;
            transform: translateY(-2px);
        }
        .token-copy-btn.copied {
            background: #22c55e;
        }
        .token-copy-btn.error {
            background: #ef4444;
        }
        /* 隐藏按钮的类 */
        .token-copy-btn.hidden {
            opacity: 0;
            pointer-events: none; /* 隐藏时禁用点击 */
        }
    `;
    document.head.appendChild(style);

    // 创建复制Token按钮
    const copyTokenBtn = document.createElement('button');
    copyTokenBtn.className = 'token-copy-btn';
    copyTokenBtn.textContent = '复制 Token';
    document.body.appendChild(copyTokenBtn);

    let inactivityTimer; // 用于10秒无操作隐藏的定时器
    let hideAfterCopyTimer; // 用于复制后2秒隐藏的定时器

    // 重置无操作计时器的函数
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        // 86秒后隐藏按钮
        inactivityTimer = setTimeout(() => {
            copyTokenBtn.classList.add('hidden');
        }, 6000); // 6秒
    }

    // 初始化无操作计时器
    resetInactivityTimer();

    // 为按钮添加鼠标移动和点击事件来重置无操作计时器
    copyTokenBtn.addEventListener('mousemove', resetInactivityTimer);
    copyTokenBtn.addEventListener('click', function() {
        // 点击时也重置计时器
        resetInactivityTimer();
        clearTimeout(hideAfterCopyTimer); // 清除之前的复制后隐藏定时器（如果有的话）

        let rawToken = null;

        // 尝试从 localStorage 获取 token
        rawToken = localStorage.getItem('token');

        // 如果 localStorage 中没有，尝试从 Cookie 中查找 token
        if (!rawToken) {
            const cookies = document.cookie.split('; ');
            const tokenCookie = cookies.find(row => row.trim().startsWith('token='));
            if (tokenCookie) {
                rawToken = tokenCookie.split('=')[1];
            }
        }

        // 如果还是没有找到，尝试从 public-token Cookie 中查找
        if (!rawToken) {
            const cookies = document.cookie.split('; ');
            const publicTokenCookie = cookies.find(row => row.trim().startsWith('public-token='));
            if (publicTokenCookie) {
                rawToken = decodeURIComponent(publicTokenCookie.split('=')[1]);
            }
        }

        // 如果还是没有找到，尝试从全局 window 对象查找（如果网页逻辑暴露了）
        // 注意：这依赖于网页的具体实现，可能需要调整
        if (!rawToken && typeof window.userToken !== 'undefined') {
            rawToken = window.userToken;
        }

        if (!rawToken || rawToken === 'null' || rawToken === 'undefined') {
            showFeedback(copyTokenBtn, '未找到Token', false);
            return;
        }

        // 处理 token 格式
        let processedToken = rawToken.trim();

        // 移除可能的引号 (例如: "bearer uuid" 或 "uuid")
        if (processedToken.startsWith('"') && processedToken.endsWith('"')) {
            processedToken = processedToken.substring(1, processedToken.length - 1);
        }

        // 确保最终格式是 'bearer uuid'
        let finalToken;
        if (processedToken.startsWith('bearer ')) {
            finalToken = processedToken;
        } else {
            // 否则假设它是 UUID，添加 bearer 前缀
            finalToken = `bearer ${processedToken}`;
        }

        GM_setClipboard(finalToken);
        showFeedback(copyTokenBtn, '已复制Token!', true); // 传递true表示成功

        // 复制成功后，2秒后隐藏按钮
        hideAfterCopyTimer = setTimeout(() => {
            copyTokenBtn.classList.add('hidden');
        }, 1000);

    });

    // 显示反馈信息的辅助函数
    function showFeedback(button, message, isSuccess = true) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        button.textContent = message;
        button.classList.remove('copied', 'error');
        button.classList.add(isSuccess ? 'copied' : 'error');

    }

})();