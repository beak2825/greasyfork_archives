// ==UserScript==
// @name         微博聊天-群主消息气泡高亮（橙底白字）
// @namespace    http://tampermonkey.net/
// @version      1
// @description  将微博聊天界面中“群主”发的消息气泡改为橙底白字，同时修改箭头的 border-top-color 和 border-right-color 为橙色。
// @author       tu
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556946/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BE%A4%E4%B8%BB%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E9%AB%98%E4%BA%AE%EF%BC%88%E6%A9%99%E5%BA%95%E7%99%BD%E5%AD%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556946/%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9-%E7%BE%A4%E4%B8%BB%E6%B6%88%E6%81%AF%E6%B0%94%E6%B3%A1%E9%AB%98%E4%BA%AE%EF%BC%88%E6%A9%99%E5%BA%95%E7%99%BD%E5%AD%97%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入全局 CSS，修改箭头颜色
    const CSS_ID = 'tm-weibo-owner-bubble-style';
    if (!document.getElementById(CSS_ID)) {
        const style = document.createElement('style');
        style.id = CSS_ID;
        style.textContent = `
            /* 群主箭头橙色处理，只改top和right */
            .custom-owner-arrow {
                border-top-color: #f2a54b !important;
                border-right-color: #f2a54b !important;
            }
        `;
        document.head.appendChild(style);
    }

    function highlightOwnerMessages() {
        document.querySelectorAll('.message-item').forEach(item => {
            const ownerTag = item.querySelector('.icon-area i.qz');
            if (ownerTag && ownerTag.textContent.includes('群主')) {
                const bubble = item.querySelector('.bubble_cont');
                const arrow = item.querySelector('.bubble_arrow.absolute.left');

                // 修改气泡颜色（仅颜色，不调整尺寸）
                if (bubble && !bubble.classList.contains('custom-owner-style')) {
                    bubble.style.backgroundColor = '#f2a54b';
                    bubble.style.color = '#FFFFFF';
                    bubble.classList.add('custom-owner-style');

                    // 确保文字白色
                    bubble.querySelectorAll('*').forEach(e => {
                        e.style.color = '#FFFFFF';
                    });
                }

                // 修改箭头颜色（添加类名触发CSS）
                if (arrow && !arrow.classList.contains('custom-owner-arrow')) {
                    arrow.classList.add('custom-owner-arrow');
                }
            }
        });
    }

    // 初次执行
    highlightOwnerMessages();

    // 监听DOM变化（动态加载消息时自动处理）
    const observer = new MutationObserver(() => {
        highlightOwnerMessages();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
