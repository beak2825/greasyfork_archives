// ==UserScript==
// @name         Gmail 发件人/收件人复制和搜索增强器
// @namespace    https://greasyfork.org/users/1560659-davidwin
// @version      1.4
// @description  Click sender/recipient in Gmail to copy email and auto search with from:/to:
// @license      MIT
// @match        https://mail.google.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562766/Gmail%20%E5%8F%91%E4%BB%B6%E4%BA%BA%E6%94%B6%E4%BB%B6%E4%BA%BA%E5%A4%8D%E5%88%B6%E5%92%8C%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562766/Gmail%20%E5%8F%91%E4%BB%B6%E4%BA%BA%E6%94%B6%E4%BB%B6%E4%BA%BA%E5%A4%8D%E5%88%B6%E5%92%8C%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    waitForGmail();

    function waitForGmail() {
        const t = setInterval(() => {
            if (document.querySelector('div[role="main"]')) {
                clearInterval(t);
                init();
            }
        }, 800);
    }

    function init() {
        document.body.addEventListener('click', handleClick, true);
        injectToastStyle();
    }

    function handleClick(e) {
        // ✅ 限制只在邮件正文中触发
        const isInMessageView = !!document.querySelector('.adn');
        if (!isInMessageView) return;

        const emailNode = e.target.closest('[email]');
        if (!emailNode) return;

        const email = emailNode.getAttribute('email');
        if (!email) return;

        e.preventDefault();
        e.stopPropagation();

        const isFrom = !!emailNode.closest('.gD');
        const isTo = !!emailNode.closest('.g2');

        const searchPrefix = isFrom ? 'from:' : isTo ? 'to:' : '';
        const searchQuery = `${searchPrefix}${email}`;

        GM_setClipboard(email);
        showToast(`已复制 ${isFrom ? '发件人' : '收件人'}：${email}`);

        setTimeout(() => {
            const input = document.querySelector('input[name="q"]');
            if (!input) return;

            input.focus();
            input.value = searchQuery;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            input.dispatchEvent(new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter'
            }));
        }, 200);
    }

    // ===== Toast =====
    function injectToastStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .gmail-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: #323232;
                color: #fff;
                padding: 10px 14px;
                border-radius: 6px;
                font-size: 13px;
                opacity: 0;
                transform: translateY(10px);
                transition: all .25s ease;
                z-index: 99999;
            }
            .gmail-toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(text) {
        const toast = document.createElement('div');
        toast.className = 'gmail-toast';
        toast.textContent = text;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1600);
    }
})();
