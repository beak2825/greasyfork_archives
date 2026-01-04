// ==UserScript==
// @name         小黑盒评论区跳转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  双击跳转评论区
// @author       Wick
// @match        *://*.xiaoheihe.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549221/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549221/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('dblclick', function() {
        const commentSectionContainerClass = '.link-comment';
        const fixedHeaderClass = '.hb-cpt-page-header.hb-bbs-link__header';

        // 1. 查找评论区容器
        const commentSection = document.querySelector(commentSectionContainerClass);
        if (!commentSection) {
            console.log(`未找到评论区容器元素 (${commentSectionContainerClass})。`);
            return;
        }

        // 2. 查找并计算顶部固定元素的高度
        const fixedHeader = document.querySelector(fixedHeaderClass);
        let headerHeight = 0;
        if (fixedHeader) {
            headerHeight = fixedHeader.offsetHeight;
        }

        // 3. 计算最终的滚动位置
        // 使用 offsetTop 属性，它更稳定地表示元素相对于文档顶部的距离。
        // 最终位置 = 元素顶部距离 - 固定头部的高度
        const targetScrollPosition = commentSection.offsetTop - headerHeight;

        // 4. 平滑滚动到计算出的位置
        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
        });
    });
})();