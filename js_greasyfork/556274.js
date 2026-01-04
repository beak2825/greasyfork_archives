// ==UserScript==
// @name         显示更清晰的B站直播表情包
// @namespace    https://space.bilibili.com/12309490
// @version      0.2.0
// @description  去除WebP后缀，使表情包更清晰
// @author       WinTP
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556274/%E6%98%BE%E7%A4%BA%E6%9B%B4%E6%B8%85%E6%99%B0%E7%9A%84B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/556274/%E6%98%BE%E7%A4%BA%E6%9B%B4%E6%B8%85%E6%99%B0%E7%9A%84B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const removeWebPCallback = mutationList => {
        mutationList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(el => {
                    if (el.nodeName === 'DIV')
                        el.querySelectorAll('img').forEach(img => img.src = img.src.replace(/@.*\.webp/, ''));
                });
            }
        });
    };
    const intervalId = setInterval(() => {
        const chatAreaContainer = document.querySelector('#aside-area-vm');
        if (chatAreaContainer !== null) {
            const observer = new MutationObserver(removeWebPCallback);
            observer.observe(chatAreaContainer, { childList: true, attributes: false, subtree: true });
            console.info('[Hi-res emote] Observer is connected!');
            clearInterval(intervalId);
        }
    }, 100);
})();
