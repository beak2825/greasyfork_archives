// ==UserScript==
// @name         bilibili cleaner ultimate
// @namespace    http://tampermonkey.net/
// @version      2025-12-24-21-9-13  
// @description  remove dynamic entry, feed, footer, and search placeholder from bilibili pages
// @author       You
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://account.bilibili.com/*
// @match        *://message.bilibili.com/*
// @match        *://search.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553104/bilibili%20cleaner%20ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/553104/bilibili%20cleaner%20ultimate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 创建 style ---
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏动态入口、feed区、搜索框提示文字、底部footer */
        .bili-footer,
        input.nav-search-input::placeholder,
        .v-middle.nav-search-content::placeholder {
            display: none !important;
            color: transparent !important;
        }

        /* 隐藏推荐内容，保留容器高度 */
.recommended-container_floor-aside,
.recommended-container_floor-aside * {
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
}

        .bili-footer {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }
    `;
        function removeDynamicEntry() {
        for (let a of document.getElementsByClassName("v-popover-wrap")) {
            const span = a.querySelector(".right-entry-text");
            if (span && span.textContent.trim() === "动态") {
                a.remove();
                console.log("💥 动态入口已移除");
            }
        }
    }
    document.documentElement.appendChild(style);

    // --- MutationObserver 自动处理动态生成的推荐栏 ---
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if(node.nodeType === 1){ // 元素节点
                    const feeds = node.querySelectorAll('.recommended-container_floor-aside');
                    feeds.forEach(feed => {
                        feed.style.opacity = '0';
                        feed.style.pointerEvents = 'none';
                        feed.querySelectorAll('*').forEach(el => el.style.visibility = 'hidden');
                    });
                }
            });
        });
    removeDynamicEntry();
    });

    observer.observe(document.documentElement, {childList: true, subtree: true});

})();
