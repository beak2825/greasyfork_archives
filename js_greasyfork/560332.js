// ==UserScript==
// @name         Bilibili直播间聊天框大小调整
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调整B站直播间聊天框大小,影响美观的滚动条隐藏。(2025-12-26)
// @author       Soma
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560332/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%81%8A%E5%A4%A9%E6%A1%86%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/560332/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E8%81%8A%E5%A4%A9%E6%A1%86%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const chatBoxWidth = '380px';  // 聊天框宽度
    const chatBoxRight = '-70px' // 聊天框右侧位置调整



    // --- 调整聊天框大小 ---
    function adjustChatBoxSize() {
        const chatBox = document.querySelector('.app-content .app-body .player-and-aside-area .aside-area');

        // id="chat-history-list"
        const chatHistoryList = document.getElementById('chat-history-list');

        if(!chatBox) {
            console.log('未找到聊天框元素。');
        }
        else{
            console.log('调整聊天框大小。');
            chatBox.style.width = chatBoxWidth;
            chatBox.style.right = chatBoxRight;
        }

        if(!chatHistoryList) {
            console.log('未找到聊天记录列表。');
        }
        else{
            console.log('隐藏聊天记录列表滚动条。');
            //.scroll-container::-webkit-scrollbar {
            //display: none; /* Chrome / Safari / Edge */
            //}
            chatHistoryList.style.scrollbarWidth = 'none'; // Firefox
            chatHistoryList.style.msOverflowStyle = 'none'; // IE 10+
            // For Webkit browsers
            const style = document.createElement('style');
            style.innerHTML = `
                #chat-history-list::-webkit-scrollbar {
                    display: none; /* Chrome / Safari / Edge */
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 立即调整一次
    adjustChatBoxSize();

})();