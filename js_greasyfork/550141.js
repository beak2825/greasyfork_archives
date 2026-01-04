// ==UserScript==
// @license      MIT
// @name         B站云顶之弈内容过滤
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  优化版：B站视频播放页检测到云顶之弈内容直接关闭，其他页面屏蔽相关内容
// @author       You
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550141/B%E7%AB%99%E4%BA%91%E9%A1%B6%E4%B9%8B%E5%BC%88%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550141/B%E7%AB%99%E4%BA%91%E9%A1%B6%E4%B9%8B%E5%BC%88%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        // 检查间隔（毫秒），避免过于频繁的检查
        checkInterval: 1000,
        // 防抖延迟（毫秒）
        debounceDelay: 300,
        // 最大同时处理元素数量
        maxProcessElements: 20
    };

    // 云顶之弈相关关键词列表 - 优化为正则表达式提高效率
    const keywords = [
        "云顶之奕", "云顶", "云顶弈", "云顶之弈",
        "TFT", "Teamfight Tactics", "金铲铲", "金铲铲之战",
        "九五", "九五至尊", "九四", "八四", "七三",
        "D牌", "升本", "刷牌", "搜牌", "抽牌",
        "羁绊", "特质", "职业", "种族", "星系",
        "选秀", "装备", "海克斯", "拼多多", "赌狗",
        "恰分", "烂分", "天胡", "锁血", "三星"
    ];

    // 编译为正则表达式，提高匹配效率
    const keywordRegex = new RegExp(keywords.join('|'), 'i');

    // 检查文本是否包含任何关键词（优化版）
    function hasRelatedContent(text) {
        if (!text || typeof text !== 'string') return false;
        return keywordRegex.test(text);
    }

    // 防抖函数 - 减少重复执行
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 尝试关闭页面（优化版）
    function closePage() {
        try {
            // 只在非顶级窗口中尝试关闭，减少浏览器安全限制影响
            if (window.top === window.self) {
                // 对于顶级窗口，使用更温和的方式
                window.location.replace("about:blank");
            } else {
                window.close();
                setTimeout(() => {
                    if (!window.closed) {
                        window.location.replace("about:blank");
                    }
                }, 100);
            }
        } catch (e) {
            console.log("关闭页面失败:", e);
        }
    }

    // 屏蔽元素（优化版）
    function blockElement(element) {
        // 避免重复屏蔽
        if (element.dataset.yundingBlocked) return;
        element.dataset.yundingBlocked = "true";

        // 简化屏蔽层样式，减少渲染负担
        const blockDiv = document.createElement('div');
        blockDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ddd;
            z-index: 9999;
            font-size: 14px;
        `;
        blockDiv.textContent = '已屏蔽云顶之弈相关内容';

        // 只在需要时修改定位
        if (!['absolute', 'fixed', 'relative'].includes(element.style.position)) {
            element.style.position = 'relative';
        }

        // 使用insertBefore而不是appendChild，避免被内部元素覆盖
        if (element.firstChild) {
            element.insertBefore(blockDiv, element.firstChild);
        } else {
            element.appendChild(blockDiv);
        }

        // 禁用交互
        element.style.pointerEvents = 'none';
    }

    // 处理视频播放页面（优化版）
    function handleVideoPage() {
        try {
            // 只检查一次标题，如果有则关闭，避免重复检查
            const titleElement = document.querySelector('h1.video-title');
            if (titleElement && hasRelatedContent(titleElement.innerText)) {
                closePage();
                return true;
            }

            // 简介内容检查（防抖处理）
            const checkDesc = debounce(() => {
                const descElement = document.querySelector('.video-desc');
                if (descElement && hasRelatedContent(descElement.innerText)) {
                    closePage();
                }
            }, config.debounceDelay);

            // 监控简介区域变化
            const descObserver = new MutationObserver(checkDesc);
            const descContainer = document.querySelector('.video-desc-container') || document.body;
            descObserver.observe(descContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // 初始检查简介
            checkDesc();

            // 5秒后停止监控，避免长期运行
            setTimeout(() => descObserver.disconnect(), 5000);

        } catch (e) {
            console.log("视频页面处理错误:", e);
        }
    }

    // 处理非视频页面内容（优化版）
    function processNonVideoContent() {
        try {
            // 更精确的选择器，减少匹配范围
            const contentSelectors = [
                '.bili-video-card:not([data-yunding-blocked])',
                '.article-item:not([data-yunding-blocked])',
                '.live-card:not([data-yunding-blocked])',
                '.video-item:not([data-yunding-blocked])'
            ];

            const elements = [];
            contentSelectors.forEach(selector => {
                // 限制每次查询的数量，避免一次性处理过多元素
                const nodes = Array.from(document.querySelectorAll(selector));
                elements.push(...nodes.slice(0, config.maxProcessElements));
            });

            // 批量处理元素
            elements.forEach(item => {
                if (hasRelatedContent(item.innerText)) {
                    blockElement(item);
                }
            });
        } catch (e) {
            console.log("内容处理错误:", e);
        }
    }

    // 主处理函数
    function main() {
        const url = window.location.href;

        // 判断是否为视频播放页面
        if (url.includes('/video/') || url.includes('/bangumi/') || url.includes('/movie/')) {
            if (handleVideoPage()) return;
        } else {
            // 初始处理
            processNonVideoContent();

            // 优化监控范围：只监控内容列表容器，而非整个页面
            const contentContainers = [
                '#i_cecream', // 首页内容区
                '.container', // 通用容器
                '.list-box',  // 列表容器
                '.video-list' // 视频列表
            ];

            const observeTargets = [];
            contentContainers.forEach(selector => {
                const el = document.querySelector(selector);
                if (el) observeTargets.push(el);
            });

            // 如果没有找到特定容器，才监控body
            const target = observeTargets.length > 0 ? observeTargets[0] : document.body;

            // 优化监控配置，减少触发次数
            const observer = new MutationObserver(debounce(() => {
                processNonVideoContent();
            }, config.debounceDelay));

            observer.observe(target, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            // 定时检查作为补充，但降低频率
            const checkInterval = setInterval(() => {
                processNonVideoContent();
            }, config.checkInterval);

            // 页面离开时清理资源
            window.addEventListener('beforeunload', () => {
                observer.disconnect();
                clearInterval(checkInterval);
            });
        }
    }

    // 确保页面加载到一定阶段再执行，避免过早运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // 再延迟一点执行，让页面主要内容加载完成
            setTimeout(main, 1000);
        });
    } else {
        setTimeout(main, 500);
    }
})();
