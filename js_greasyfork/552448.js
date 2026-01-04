// ==UserScript==
// @name         强制页面延迟自动刷新
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  强制页面延迟自动刷新，每个页面只刷新一次
// @author       You
// @match        https://www.hjw01.com/*
// @include      /^https?:\/\/capture\.[^/]+\.[^/]+\//
// @grant        none
// @run-at       document-start
// @license      LGPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/552448/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%BB%B6%E8%BF%9F%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552448/%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E5%BB%B6%E8%BF%9F%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 精确的广告特征配置
    const adConfig = {
        // 广告容器类名
        containerSelectors: [
            'div.xqbj-list-rows-placard',
            'div[class*="ad"]',
            'div[class*="Ad"]',
            'div[class*="adv"]'
        ],

        // 广告链接特征
        linkSelectors: [
            'a[href*="/archives/145169/"]',
            'a[href*="/archives/152101/"]',
            'a[rel*="sponsored"]',
            'a[rel*="nofollow"][target="_blank"]'
        ],

        // 广告内容关键词（仅在广告容器内匹配）
        contentKeywords: [
            '同城交友',
            '棋牌',
            '真人娱乐',
            '在线赌场',
            '首单优惠',
            '首存优惠',
            '真人荷官'
        ],

        // 白名单 - 不会删除包含这些关键词的内容
        whitelistKeywords: [
            '新闻', '文章', '博客', '帖子', '评论',
            '用户', '作者', '发布于', '发表于'
        ],

        // 最大内容长度 - 避免删除长篇文章
        maxContentLength: 300
    };

    // 主屏蔽函数
    function removeAds() {
        let removedCount = 0;

        // 方法1: 通过精确的容器选择器屏蔽
        adConfig.containerSelectors.forEach(selector => {
            const containers = document.querySelectorAll(selector);
            containers.forEach(container => {
                if (isDefinitelyAd(container)) {
                    container.remove();
                    removedCount++;
                    console.log(`已移除广告容器: ${selector}`);
                }
            });
        });

        // 方法2: 通过链接特征屏蔽
        adConfig.linkSelectors.forEach(selector => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                // 只移除明显是广告的链接
                if (isDefinitelyAd(link)) {
                    const container = link.closest('.xqbj-list-rows-placard') || link.parentElement;
                    if (container && container.textContent.length < adConfig.maxContentLength) {
                        container.remove();
                        removedCount++;
                        console.log(`已移除广告链接: ${selector}`);
                    }
                }
            });
        });

        if (removedCount > 0) {
            console.log(`本轮屏蔽了 ${removedCount} 个广告元素`);
            showNotification(`已屏蔽 ${removedCount} 个广告`);
        }
    }

    // 精确判断是否为广告
    function isDefinitelyAd(element) {
        const text = element.textContent || '';
        const html = element.innerHTML || '';

        // 检查内容长度
        if (text.length > adConfig.maxContentLength) {
            return false; // 内容太长，可能是正常文章
        }

        // 检查是否包含白名单关键词
        const hasWhitelistContent = adConfig.whitelistKeywords.some(keyword =>
            text.includes(keyword)
        );
        if (hasWhitelistContent) {
            return false; // 包含白名单关键词，可能是正常内容
        }

        // 检查是否包含广告关键词
        const hasAdContent = adConfig.contentKeywords.some(keyword =>
            text.includes(keyword)
        );

        // 检查链接特征
        const hasAdLinks = element.querySelectorAll(adConfig.linkSelectors.join(',')).length > 0;

        // 检查广告属性
        const hasAdAttributes = element.querySelectorAll('[rel*="sponsored"], [rel*="nofollow"][target="_blank"]').length > 0;

        // 只有同时满足多个广告特征才认为是广告
        return (hasAdContent || hasAdLinks) && !hasWhitelistContent;
    }

    // 显示通知
    function showNotification(message) {
        // 移除之前的通知
        const existingNote = document.getElementById('adblock-notification');
        if (existingNote) existingNote.remove();

        const notification = document.createElement('div');
        notification.id = 'adblock-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🛡️</span>
                    <span>${message}</span>
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(notification);

        // 3秒后自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 初始化脚本
    function init() {
        console.log('精确广告屏蔽脚本已启动');

        // 页面加载后立即执行一次
        setTimeout(removeAds, 1000);

        // 监听DOM变化，处理动态加载的广告
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // 检查新增的元素是否可能是广告
                        if (node.matches && (
                            node.matches(adConfig.containerSelectors.join(',')) ||
                            node.matches(adConfig.linkSelectors.join(',')) ||
                            adConfig.contentKeywords.some(keyword =>
                                (node.textContent || '').includes(keyword)
                            )
                        )) {
                            shouldCheck = true;
                        }

                        // 检查子元素
                        if (node.querySelectorAll) {
                            const hasAdContainers = node.querySelectorAll(adConfig.containerSelectors.join(',')).length > 0;
                            const hasAdLinks = node.querySelectorAll(adConfig.linkSelectors.join(',')).length > 0;
                            if (hasAdContainers || hasAdLinks) {
                                shouldCheck = true;
                            }
                        }
                    }
                });
            });

            if (shouldCheck) {
                setTimeout(removeAds, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 设置定时检查（针对可能延迟加载的广告）
        setInterval(removeAds, 5000);
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

(function() {
    'use strict';

    // 获取当前页面URL
    const currentUrl = window.location.href;

    // 检查是否已经刷新过
    const hasRefreshed = sessionStorage.getItem('refreshed_' + btoa(currentUrl));

    if (!hasRefreshed) {
        console.log('页面首次加载，将在3秒后自动刷新');

        // 设置刷新标记
        sessionStorage.setItem('refreshed_' + btoa(currentUrl), 'true');

        // 等待页面加载完成
        window.addEventListener('load', function() {
            // 延迟3秒后刷新
            setTimeout(() => {
                console.log('执行自动刷新');
                window.location.reload();
            }, 500);
        });

        // 如果页面已经加载完成，直接设置定时器
        if (document.readyState === 'complete') {
            setTimeout(() => {
                console.log('执行自动刷新');
                window.location.reload();
            }, 500);
        }
    } else {
        console.log('页面已经刷新过，不再自动刷新');
    }
})();