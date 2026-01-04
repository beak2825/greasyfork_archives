// ==UserScript==
// @name         Twitter/X 屏蔽互fo/互粉/互关推文
// @namespace    https://github.com/Asakushen/Twitter_Mutual_Follow_Blocker
// @version      1.0
// @description  自动折叠包含"互fo"、"互粉"、"互关"、"互赞"等关键词的用户推文
// @author       Asakushen
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon           https://s2.loli.net/2025/11/27/NsGnT9k3HFJeUhv.png
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @homepageURL  https://github.com/Asakushen/Twitter_Mutual_Follow_Blocker
// @supportURL   https://github.com/Asakushen/Twitter_Mutual_Follow_Blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/557093/TwitterX%20%E5%B1%8F%E8%94%BD%E4%BA%92fo%E4%BA%92%E7%B2%89%E4%BA%92%E5%85%B3%E6%8E%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/557093/TwitterX%20%E5%B1%8F%E8%94%BD%E4%BA%92fo%E4%BA%92%E7%B2%89%E4%BA%92%E5%85%B3%E6%8E%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Configs: 你可以在这里添加更多你想屏蔽的关键词
    const BLOCK_KEYWORDS = [/互(fo|粉|关|赞|推|回)/i, /fo回/i, /诚信互/i];

    // CSS样式：定义折叠后的外观
    GM_addStyle(`
        .my-blocked-tweet {
            display: none !important;
        }
        .my-blocked-placeholder {
            padding: 12px 16px;
            background-color: rgba(29, 155, 240, 0.1); /* 推特蓝底色 */
            border-bottom: 1px solid rgb(56, 68, 77);
            color: #71767b;
            font-size: 13px;
            cursor: pointer;
            text-align: center;
            border-radius: 4px;
            margin: 5px 0;
            transition: all 0.2s;
        }
        .my-blocked-placeholder:hover {
            background-color: rgba(29, 155, 240, 0.2);
            color: #1d9bf0;
        }
        /* 适配亮色模式 */
        @media (prefers-color-scheme: light) {
             .my-blocked-placeholder {
                background-color: #f7f9f9;
                border-bottom: 1px solid #eff3f4;
             }
        }
    `);

    // 核心检测函数
    function checkAndBlockTweets() {
        // 选取所有的推文容器 (根据你提供的HTML，article元素带有 data-testid="tweet")
        const tweets = document.querySelectorAll('article[data-testid="tweet"]:not([data-mutual-checked])');

        tweets.forEach(tweet => {
            // 标记已检查，避免重复处理
            tweet.setAttribute('data-mutual-checked', 'true');

            // 1. 查找用户名区域
            const userNameNode = tweet.querySelector('[data-testid="User-Name"]');
            if (!userNameNode) return;

            // 2. 获取所有文本内容（包括昵称、@ID等）
            const textContent = userNameNode.innerText;

            // 3. 正则匹配
            const isMatch = BLOCK_KEYWORDS.some(regex => regex.test(textContent));

            if (isMatch) {
                // 找到匹配的关键词，执行折叠操作
                console.log(`[屏蔽互粉] 折叠了用户: ${textContent.replace(/\n/g, ' ')}`);
                foldTweet(tweet, textContent);
            }
        });
    }

    // 折叠推文的具体逻辑
    function foldTweet(tweetElement, userInfo) {
        // 获取第一行文本作为提示（通常是昵称）
        const displayName = userInfo.split('\n')[0] || "互关用户";

        // 1. 隐藏推文内容的直接子元素（不使用display:none隐藏article本身，因为可能会影响推特的虚拟滚动计算）
        const children = Array.from(tweetElement.children);
        children.forEach(child => child.classList.add('my-blocked-tweet'));

        // 2. 插入占位提示条
        const placeholder = document.createElement('div');
        placeholder.className = 'my-blocked-placeholder';
        placeholder.textContent = `已折叠一条来自 "${displayName}" 的推文 (包含互粉关键词) - 点击查看`;

        // 3. 点击事件：恢复显示
        placeholder.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发推特原本的点击事件
            placeholder.remove();
            children.forEach(child => child.classList.remove('my-blocked-tweet'));
        });

        tweetElement.appendChild(placeholder);
    }

    // 使用 MutationObserver 监听页面变化（因为推特是无限滚动页面）
    const observer = new MutationObserver((mutations) => {
        // 简单的防抖优化，不需要每次微小变动都执行，但推特流很快，直接执行通常也无妨
        checkAndBlockTweets();
    });

    // 开始监听 body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始运行一次
    checkAndBlockTweets();

})();