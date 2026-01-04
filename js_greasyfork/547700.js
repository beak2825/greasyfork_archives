// ==UserScript==
// @name         Twitter Bookmarks Auto Scroller
// @name:zh-CN   推特(X)收藏夹页面自动划屏
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically scrolls down the Twitter(X) bookmarks page. Recommended for use with the 'Twitter Web Exporter' script.
// @description:zh-CN 推特(X)收藏夹页面自动划屏（建议搭配 https://greasyfork.org/zh-CN/scripts/492218-twitter-web-exporter 食用）
// @author       Mashiro Shiina
// @license      MIT
// @match        *://twitter.com/i/bookmarks*
// @match        *://x.com/i/bookmarks*
// @match        *://mobile.x.com/i/bookmarks*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL https://update.greasyfork.org/scripts/547700/Twitter%20Bookmarks%20Auto%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/547700/Twitter%20Bookmarks%20Auto%20Scroller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    // 滚动时间间隔（毫秒）。网络慢可适当调大，如 5000。不建议设置太小，容易触发API风控。
    const scrollInterval = 3000;

    // --- 脚本内部变量 ---
    let autoScrollInterval = null; // 用于存储定时器ID
    let isScrolling = false;       // 标记当前是否正在滚动

    // --- 创建控制按钮 ---
    const controlButton = document.createElement('button');
    controlButton.textContent = '开始自动滚动';
    document.body.appendChild(controlButton);

    // --- 按钮点击事件 ---
    controlButton.addEventListener('click', toggleScrolling);

    // --- 功能函数 ---
    function startScrolling() {
        if (isScrolling) return; // 如果已经在滚动，则不执行任何操作
        isScrolling = true;
        controlButton.textContent = '停止自动滚动';
        controlButton.style.backgroundColor = '#dc3545'; // 红色，表示正在运行

        console.log('Auto-scrolling started.');

        // 先立即执行一次滚动
        window.scrollTo(0, document.body.scrollHeight);

        // 设置定时器，周期性滚动
        autoScrollInterval = setInterval(() => {
            let lastHeight = document.body.scrollHeight;
            window.scrollTo(0, document.body.scrollHeight);
            console.log('Auto-scrolling down...');

            // 检查是否已到达底部
            // 在滚动后等待一小段时间，检查页面高度是否不再变化
            setTimeout(() => {
                if (document.body.scrollHeight === lastHeight && isScrolling) {
                    console.log('Reached the bottom.');
                    stopScrolling(); // 停止滚动
                    alert('已到达收藏夹底部，自动滚动已停止。');
                }
            }, 1000);

        }, scrollInterval);
    }

    function stopScrolling() {
        if (!isScrolling) return; // 如果已停止，则不执行任何操作
        isScrolling = false;
        controlButton.textContent = '开始自动滚动';
        controlButton.style.backgroundColor = '#28a745'; // 绿色，表示已停止
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        console.log('Auto-scrolling stopped by user.');
    }

    function toggleScrolling() {
        if (isScrolling) {
            stopScrolling();
        } else {
            startScrolling();
        }
    }

    // --- 按钮样式 ---
    // 使用 GM_addStyle 来添加CSS样式，确保按钮美观且位置固定
    GM_addStyle(`
        #${controlButton.id = 'scroll-control-button'} {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 9999;
            padding: 10px 18px;
            font-size: 16px;
            color: white;
            background-color: #28a745; /* 初始为绿色 */
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.1s;
        }
        #scroll-control-button:hover {
            opacity: 0.9;
        }
        #scroll-control-button:active {
            transform: scale(0.95);
        }
    `);

})();