// ==UserScript==
// @name         隐藏 X 推荐广告
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.1
// @description  隐藏 X 上所有带"推荐"字样的广告推文
// @license      MIT
// @icon         https://x.com/favicon.ico
// @author       SI Xiaolong
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553824/%E9%9A%90%E8%97%8F%20X%20%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/553824/%E9%9A%90%E8%97%8F%20X%20%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测关键词列表（可以根据需要添加更多）
    const keywords = ['推荐', 'Promoted', 'Ad', '广告', 'Sponsored'];

    // 隐藏包含关键词的推文
    function hidePromotedTweets() {
        // 查找所有文章元素（推文容器）
        const articles = document.querySelectorAll('article[data-testid="tweet"]');

        articles.forEach(article => {
            // 检查是否已经处理过
            if (article.dataset.adChecked) return;
            article.dataset.adChecked = 'true';

            // 获取推文的所有文本内容
            const textContent = article.innerText;

            // 检查是否包含关键词
            const hasKeyword = keywords.some(keyword =>
                textContent.includes(keyword)
            );

            if (hasKeyword) {
                // 隐藏整个推文容器
                article.style.display = 'none';
                console.log('隐藏了一条推荐/广告推文');
            }
        });
    }

    // 初始执行
    hidePromotedTweets();

    // 监听页面变化（因为推特是动态加载内容）
    const observer = new MutationObserver(() => {
        hidePromotedTweets();
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定期检查（备用方案）
    setInterval(hidePromotedTweets, 1000);

    console.log('Twitter/X 推荐广告隐藏脚本已启动');
})();