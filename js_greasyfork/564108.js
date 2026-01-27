// ==UserScript==
// @name Index: ChatGPT
// @match https://chatgpt.com/*
// @icon https://chatgpt.com/favicon.ico
// @version 1.0
// @description 為 ChatGPT 增加側邊提問索引列
// @author Kamiya Minoru
// @grant GM_addStyle
// @license MIT
// @namespace https://chatgpt.com/
// @downloadURL https://update.greasyfork.org/scripts/564108/Index%3A%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/564108/Index%3A%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #custom-nav-radar {
            position: fixed;
            right: 20px; top: 10%; height: 80%; width: 40px; z-index: 9999;
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            pointer-events: none;}

        .user-message-bubble-color {scroll-margin-top: 80px;}

        .nav-dot-item {
            flex: 0 0 auto;
            width: 14px; height: 8px;
            background-color: rgba(128, 128, 128, 0.4);
            border-radius: 4px; margin: 4px 0; cursor: pointer; pointer-events: auto;
            transition: width 0.2s, background-color 0.2s, transform 0.2s;
            position: relative;}

        .nav-dot-item::after {
            content: '';
            position: absolute;
            top: -5px; bottom: -5px; left: -10px; right: -10px;}

        .nav-dot-item:hover {
            background-color: #10a37f;
            width: 22px;
            transform: translateX(-2px);}

        .nav-tooltip {
            position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
            background: #202123; color: #fff;
            padding: 15px; border-radius: 10px;
            width: 450px; max-height: 250px; overflow: hidden;
            font-size: 14px; line-height: 1.5;
            display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.6);
            border: 1px solid #4e4e4e; pointer-events: none;
            white-space: pre-wrap; word-wrap: break-word; z-index: 10001;}

        .nav-dot-item:hover .nav-tooltip {display: block;}`);

    const radarContainer = document.createElement('div');
    radarContainer.id = 'custom-nav-radar';
    document.body.appendChild(radarContainer);

    let lastMessageCount = 0;

    function refreshNav() {
        const userMessages = document.querySelectorAll('.user-message-bubble-color');

        if (userMessages.length === lastMessageCount) return;

        lastMessageCount = userMessages.length;
        radarContainer.innerHTML = '';

        const dynamicMargin = userMessages.length > 25 ? '2px' : '5px';

        userMessages.forEach((msg, idx) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot-item';
            dot.style.margin = `${dynamicMargin} 0`;

            const tooltip = document.createElement('div');
            tooltip.className = 'nav-tooltip';
            tooltip.innerText = `提問 #${idx + 1}\n\n${msg.innerText.trim()}`;
            dot.appendChild(tooltip);

            dot.onclick = (e) => {
                e.preventDefault();
                msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };

            radarContainer.appendChild(dot);
        });
    }

    let timer;
    const observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(refreshNav, 800); // 緩衝
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始載入
    setTimeout(refreshNav, 2000);

    // 定期巡檢（應對 SPA 路由切換）
    setInterval(refreshNav, 3000);
})();