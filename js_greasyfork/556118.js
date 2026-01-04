// ==UserScript==
// @name         屏蔽B站新版动态页热搜栏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽B站动态页面右侧的热搜栏
// @author       Astrallation
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556118/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%96%B0%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E7%83%AD%E6%90%9C%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/556118/%E5%B1%8F%E8%94%BDB%E7%AB%99%E6%96%B0%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E7%83%AD%E6%90%9C%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用精确选择器
    function removeTrending() {
        const trendingElement = document.querySelector('#app > div.bili-dyn-home--member > aside.right > section.sticky > div');
        if (trendingElement) {
            trendingElement.remove();
            console.log('已屏蔽B站搜索趋势栏');
        }
    }

    // 使用类名选择器作为备选方案
    function removeByClassName() {
        const elements = document.querySelectorAll('.bili-dyn-search-trendings');
        elements.forEach(element => {
            element.remove();
        });
        if (elements.length > 0) {
            console.log(`通过类名屏蔽了 ${elements.length} 个搜索趋势元素`);
        }
    }

    // 隐藏而非删除（如果需要可以恢复显示）
    function hideElement() {
        const element = document.querySelector('.bili-dyn-search-trendings');
        if (element) {
            element.style.display = 'none';
        }
    }

    // 页面加载时立即执行
    removeTrending();
    removeByClassName();

    // 监听DOM变化，防止动态加载
    const observer = new MutationObserver(function(mutations) {
        removeTrending();
        removeByClassName();
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 延时再次检查，确保完全加载后也能屏蔽
    setTimeout(() => {
        removeTrending();
        removeByClassName();
    }, 2000);

})();