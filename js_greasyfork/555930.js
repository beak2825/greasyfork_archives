// ==UserScript==
// @name         百度搜索跳转必应
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在百度点击搜索时自动跳转到必应搜索结果
// @author       baclt
// @license MIT
// @match        https://www.baidu.com/*
// @match        https://baidu.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555930/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%BF%85%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/555930/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%BF%85%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取百度搜索框
    const searchInput = document.getElementById('chat-textarea');
    // 获取百度搜索按钮
    const searchButton = document.getElementById('chat-submit-button');

    if (!searchInput || !searchButton) {
        console.log('[百度转必应] 未找到搜索元素');
        return;
    }

    // 拦截搜索按钮点击
    searchButton.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止百度的默认搜索
        e.stopPropagation(); // 阻止事件冒泡

        const keyword = searchInput.value.trim();
        if (keyword) {
            // 跳转到必应搜索
            window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}`;
        }
    }, true); // 使用捕获阶段，确保优先执行

    // 拦截回车搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();

            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}`;
            }
        }
    }, true);

    // 拦截表单提交
    const searchForm = document.getElementById('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(keyword)}`;
            }
        }, true);
    }



    console.log('[百度转必应] 脚本已加载，搜索将跳转到必应');
})();