// ==UserScript==
// @name         屏蔽雪球 web 端推广
// @namespace    wjfz
// @version      1.0
// @description  检测timeline中标记为"推广"的广告item，并将其移除
// @author       wjfz
// @match        https://xueqiu.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563728/%E5%B1%8F%E8%94%BD%E9%9B%AA%E7%90%83%20web%20%E7%AB%AF%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/563728/%E5%B1%8F%E8%94%BD%E9%9B%AA%E7%90%83%20web%20%E7%AB%AF%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心函数：检测并标记广告item
    function markAdItems() {
        // 1. 获取所有的timeline item（article元素）
        const timelineItems = document.querySelectorAll('#app > div.home__main > div > div:nth-child(2) > div.user__col--middle > div > div.home-timeline > div.status-list > article');

        // 2. 遍历每个item，检测是否为广告
        timelineItems.forEach(item => {
            try {
                // 查找当前item内的广告标记元素（推广文字的span）
                const adMarker = item.querySelector('div.timeline__item__main > div.timeline__item__info > div > span');

                // 如果找到标记且文本是"推广"，则设置背景色为红色
                if (adMarker && adMarker.textContent.trim() === '推广') {
                    console.log('移除推广', item.querySelector('div.timeline__item__main > div.timeline__item__info > div > a.user-name').textContent.trim())
                    item.remove();
                }
            } catch (e) {
                // 容错：单个item检测失败不影响其他item
                console.log('检测单个item出错:', e);
            }
        });
    }

    // 处理动态加载的内容：监听DOM变化
    function observeDomChanges() {
        // 找到timeline的容器（监听它的子元素变化）
        const timelineContainer = document.querySelector('#app > div.home__main > div > div:nth-child(2) > div.user__col--middle > div > div.home-timeline > div.status-list');

        if (!timelineContainer) {
            console.log('未找到timeline容器，无法监听DOM变化');
            return;
        }

        // 创建DOM观察者
        const observer = new MutationObserver((mutations) => {
            // 当DOM发生变化时，重新检测广告
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    markAdItems();
                }
            });
        });

        // 配置观察者：监听子元素的添加/移除
        const observerConfig = {
            childList: true,
            subtree: true
        };

        // 启动观察者
        observer.observe(timelineContainer, observerConfig);
    }

    // 初始化执行
    // 1. 页面加载完成后先执行一次检测
    markAdItems();
    // 2. 启动DOM监听，处理动态加载的内容
    observeDomChanges();

    // 可选：监听页面滚动（有些网站滚动加载内容）
    window.addEventListener('scroll', () => {
        // 防抖：避免滚动时频繁执行
        clearTimeout(window.adCheckTimer);
        window.adCheckTimer = setTimeout(markAdItems, 300);
    });

})();