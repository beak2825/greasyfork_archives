// ==UserScript==
// @name         NodeSeek 搜索栏点击即显
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  点击输入框显示搜索选项 + 强制排序(搜帖-谷歌-搜人)
// @author       YourName
// @match        https://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/images/icon.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559445/NodeSeek%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E7%82%B9%E5%87%BB%E5%8D%B3%E6%98%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/559445/NodeSeek%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E7%82%B9%E5%87%BB%E5%8D%B3%E6%98%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const searchInput = document.querySelector('#search-site2');
        const searchHint = document.querySelector('.search-hint');
        const searchForm = document.querySelector('.search-box');

        if (!searchInput || !searchHint || !searchForm) return;

        // --- 功能 1: 强制排序 ---
        // 顺序: 搜索帖子 -> 谷歌搜索 -> 搜索用户
        function reorderItems() {
            const linkPost = searchHint.querySelector('.search4post');
            const linkGoogle = searchHint.querySelector('.googleSearch');
            const linkPeople = searchHint.querySelector('.search4people');

            // 利用 appendChild 移动节点的特性，按顺序重新加入
            if (linkPost) searchHint.appendChild(linkPost);
            if (linkGoogle) searchHint.appendChild(linkGoogle);
            if (linkPeople) searchHint.appendChild(linkPeople);
        }

        // --- 功能 2: 更新链接内容 ---
        function updateLinks() {
            const val = searchInput.value.trim();
            const linkPost = searchHint.querySelector('.search4post');
            const linkPeople = searchHint.querySelector('.search4people');
            const linkGoogle = searchHint.querySelector('.googleSearch');

            if (val) {
                if(linkPost) {
                    linkPost.href = `/search?q=${encodeURIComponent(val)}`;
                    linkPost.innerText = `搜索帖子: ${val}`;
                }
                if(linkGoogle) {
                    linkGoogle.href = `https://www.google.com/search?q=site:www.nodeseek.com ${encodeURIComponent(val)}`;
                    linkGoogle.innerText = `谷歌搜索: ${val}`;
                }
                if(linkPeople) {
                    linkPeople.href = `/member?q=${encodeURIComponent(val)}`;
                    linkPeople.innerText = `搜索用户: ${val}`;
                }
            } else {
                if(linkPost) {
                    linkPost.href = "javascript:void(0)";
                    linkPost.innerText = "搜索帖子";
                }
                if(linkGoogle) {
                    linkGoogle.href = "javascript:void(0)";
                    linkGoogle.innerText = "谷歌搜索";
                }
                if(linkPeople) {
                    linkPeople.href = "javascript:void(0)";
                    linkPeople.innerText = "搜索用户";
                }
            }
        }

        // 初始化时先排一次序
        reorderItems();

        // 事件监听
        searchInput.addEventListener('focus', function() {
            searchHint.style.display = 'block'; // 点击即显
            reorderItems(); // 防止网页动态重置顺序，每次显示时再排一次
            updateLinks();
        });

        searchInput.addEventListener('input', updateLinks);

        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                searchHint.style.display = 'none';
            }
        });

        // --- 样式: 仅保留必要的定位，不改颜色 ---
        GM_addStyle(`
            .search-box {
                position: relative;
                overflow: visible !important;
            }
            .search-hint {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: #fff;
                z-index: 999;
                border: 1px solid #ddd;
                padding: 5px 0;
            }
            /* 适配夜间模式的背景 (仅背景，不动文字) */
            html.dark .search-hint, [data-theme="dark"] .search-hint {
                background: #2d2d2d;
                border-color: #444;
            }
        `);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();