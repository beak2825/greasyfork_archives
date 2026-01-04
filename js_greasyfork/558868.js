// ==UserScript==
// @name         Twitter Auto Navigation
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动打开推文详情并返回的示例脚本
// @author       You
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558868/Twitter%20Auto%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/558868/Twitter%20Auto%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 直接启动脚本，增加对twitter.com的支持
    console.log('Twitter Auto Navigation 脚本已启动');
    console.log('当前页面URL:', window.location.href);

    // 增加对twitter.com域名的支持
    if (!window.location.href.includes('x.com') && !window.location.href.includes('twitter.com')) {
        console.log('当前不在Twitter网站，脚本不执行');
        return;
    }

    function initializeScript() {
        console.log('初始化脚本...');

        // 尝试多种方法检测推文

        // 方法1: 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    checkAndStart();
                }
            });
        });

        // 开始观察DOM变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 方法2: 定时检查（兼容方案）
        const interval = setInterval(checkAndStart, 3000);

        // 方法3: 页面加载完成后立即检查
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndStart);
        } else {
            // DOM已经加载完成
            setTimeout(checkAndStart, 2000);
        }

        function checkAndStart() {
            // 多种选择器尝试查找推文
            const selectors = [
                'article[data-testid="tweet"]',
                'div[data-testid="tweet"]',
                '[data-testid="tweet"]'
            ];

            let tweets = [];
            for (const selector of selectors) {
                tweets = document.querySelectorAll(selector);
                if (tweets.length > 0) {
                    console.log(`使用选择器 "${selector}" 找到 ${tweets.length} 条推文`);
                    break;
                }
            }

            if (tweets.length > 0) {
                console.log('检测到推文，开始自动浏览...');
                observer.disconnect(); // 停止观察
                clearInterval(interval); // 清除定时器
                startAutoNavigation(Array.from(tweets));
            }
        }
    }

    function startAutoNavigation(tweetElements) {
        let currentIndex = 0;
        const maxTweets = Math.min(10, tweetElements.length);

        console.log(`计划浏览${maxTweets}条推文`);

        function navigateToNextTweet() {
            if (currentIndex >= maxTweets) {
                // 所有推文浏览完毕，刷新页面
                console.log('推文浏览完毕，5秒后刷新页面...');
                setTimeout(() => {
                    location.reload();
                }, 5000);
                return;
            }

            const tweet = tweetElements[currentIndex];
            console.log(`正在处理第 ${currentIndex + 1} 条推文...`);

            // 滚动到推文位置以确保可见
            tweet.scrollIntoView({behavior: "smooth", block: "center"});

            // 等待滚动完成
            setTimeout(() => {
                // 查找可点击的链接元素
                let clickableElement = null;

                // 尝试多种方式查找可点击元素
                const links = tweet.querySelectorAll('a');
                for (const link of links) {
                    if (link.getAttribute('href') && link.getAttribute('href').includes('/status/')) {
                        clickableElement = link;
                        break;
                    }
                }

                // 如果没找到特定链接，就点击整个推文
                if (!clickableElement) {
                    clickableElement = tweet;
                }

                console.log('点击元素:', clickableElement);

                // 点击推文以查看详细信息
                clickableElement.click();

                // 等待一段时间后返回
                setTimeout(() => {
                    console.log('返回上一页...');
                    history.back();

                    // 增加索引，准备点击下一条推文
                    currentIndex++;

                    // 等待页面加载完成后继续
                    setTimeout(navigateToNextTweet, 5000);
                }, 5000);
            }, 2000);
        }

        // 开始浏览过程
        navigateToNextTweet();
    }

    // 执行
    initializeScript();
})();