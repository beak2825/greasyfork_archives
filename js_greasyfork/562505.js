// ==UserScript==
// @name         微博移除非关注条目
// @namespace    http://tampermonkey.net/
// @version      0.2.260116
// @description  屏蔽带有"推荐"、"荐读"、"公益"、"关注了"、"赞过"、"的人也关注"的微博条目
// @author       You
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562505/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E9%99%A4%E9%9D%9E%E5%85%B3%E6%B3%A8%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562505/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E9%99%A4%E9%9D%9E%E5%85%B3%E6%B3%A8%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防抖函数 - 控制URL变化处理频率
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 节流函数 - 控制DOM变化处理频率
    function throttle(func, limit) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    }

    // 要屏蔽的关键词列表，包含具体的HTML结构
    const keywords = [
        '<div>推荐</div>',
        '<div>荐读</div>',
        '<div>公益</div>',
        '关注了</span>',
        '赞过</span>',
        '的人也关注</span>'
    ];

    // 获取微博主容器
    function getWeiboContainer() {
        // 尝试多种可能的微博容器选择器，按优先级排序
        return document.querySelector('#scroller') ||
               document.querySelector('.WB_feed') ||
               document.querySelector('.WB_frame') ||
               document.querySelector('.woo-main') ||
               document.querySelector('[id^="Pl_Official_MyProfileFeed"]') ||
               document.querySelector('[id^="Pl_Official_ForwardWeibo"]') ||
               document.querySelector('[id^="Pl_Official_WeiboDetail"]') ||
               document.querySelector('.card-wrap');
    }

    // 屏蔽函数
    function filterWeibo() {
        // 获取所有微博条目，适配新旧两种结构
        const weiboItems = document.querySelectorAll(
            '[action-type="feed_list_item"]' +
            ', article.woo-panel-main' +
            ', div._wrap_m3n8j_2'
        );

        if (weiboItems.length === 0) {
            console.log('未检测到微博条目');
            return;
        }

        console.log(`找到 ${weiboItems.length} 条微博，开始过滤`);

        let hiddenCount = 0;

        weiboItems.forEach(item => {
            // 跳过已经处理过的条目
            if (item.classList.contains('weibo-filter-hidden')) {
                return;
            }

            // 获取完整的HTML内容，用于匹配包含HTML标签的关键词
            const itemHtml = item.innerHTML;

            // 检查是否包含任何关键词，处理可能的空白字符变化
            const shouldHide = keywords.some(keyword => {
                // 对于包含div标签的关键词，处理可能的空白字符变化
                if (keyword.includes('<div>') && keyword.includes('</div>')) {
                    // 提取div标签内的内容
                    const contentMatch = keyword.match(/<div>(.*?)<\/div>/);
                    if (contentMatch) {
                        const content = contentMatch[1];
                        // 创建正则表达式，允许div标签带有属性，内容匹配关键词
                        const regex = new RegExp(`<div[^>]*>${content}<\/div>`, 'i');
                        return regex.test(itemHtml);
                    }
                    return false;
                } else {
                    // 对于其他关键词，直接匹配
                    return itemHtml.includes(keyword);
                }
            });

            if (shouldHide) {
                // 标记并隐藏该条目
                item.classList.add('weibo-filter-hidden');
                item.style.display = 'none';
                hiddenCount++;
                console.log('已屏蔽一条微博，包含关键词');
            }
        });

        if (hiddenCount > 0) {
            console.log(`本次过滤共屏蔽 ${hiddenCount} 条微博`);
        }
    }

    // 处理元素变化的节流版本
    const handleElementChanges = throttle(function() {
        filterWeibo();
    }, 300); // 300ms内最多执行一次

    let domObserver;

    // 启动DOM变化监控
    function startDomObserver() {
        if (domObserver) {
            console.log('停止已有的DOM监视');
            domObserver.disconnect();
        }

        // 直接监视body，覆盖所有内容变化
        console.log('开始DOM监视');
        domObserver = new MutationObserver(handleElementChanges);

        const config = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        };

        domObserver.observe(document.body, config);
        handleElementChanges(); // 初始检查
    }

    // 停止DOM变化监控
    function stopDomObserver() {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
        }
    }

    // 处理URL变化的防抖版本
    const handleUrlChange = debounce(function() {
        console.log('URL变化，重新过滤微博');
        // URL变化后重新执行过滤，并重启DOM监视
        startDomObserver();
    }, 400); // 400ms防抖

    // 初始化URL变化监控
    function initUrlMonitor() {
        console.log('微博关键词屏蔽脚本已加载');
        startDomObserver(); // 初始启动

        // 监听浏览器历史变化
        window.addEventListener('popstate', handleUrlChange);

        // 重写history方法以监控URL变化
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleUrlChange();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleUrlChange();
        };

        // 监控hash变化
        window.addEventListener('hashchange', handleUrlChange);
    }

    // 启动脚本
    initUrlMonitor();

    // 页面加载完成后再执行一次，确保所有内容都被处理
    window.addEventListener('load', function() {
        setTimeout(filterWeibo, 500);
    });
})();