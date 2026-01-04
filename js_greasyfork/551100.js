// ==UserScript==
// @name         屏蔽百度搜索百家号文章
// @namespace    https://github.com/tengxunlaozu/baijiahao
// @version      1.0
// @description  屏蔽百度搜索结果中的百家号文章
// @author       tengxunlaozu
// @match        *://*.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式隐藏百家号元素
    const style = document.createElement('style');
    style.textContent = `
        div[data-tuiguang*='baijiahao'],
        div[id*='baijiahao'],
        div[class*='baijiahao'],
        a[href*='baijiahao.baidu.com'] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // MutationObserver 监控页面动态加载内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                // 查找并隐藏百家号相关元素
                document.querySelectorAll('div[data-tuiguang*="baijiahao"], div[id*="baijiahao"], div[class*="baijiahao"], a[href*="baijiahao.baidu.com"]').forEach(element => {
                    element.style.display = 'none';
                });
            }
        });
    });

    // 观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始隐藏页面中的百家号内容
    document.querySelectorAll('div[data-tuiguang*="baijiahao"], div[id*="baijiahao"], div[class*="baijiahao"], a[href*="baijiahao.baidu.com"]').forEach(element => {
        element.style.display = 'none';
    });
})();