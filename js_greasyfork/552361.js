// ==UserScript==
// @name         Edge单一推文定时发送-🐱
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上添加一个按钮，用于发送一条预设的定时推文。
// @author       ols&los
// @match        https://x.com/*
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/552361/Edge%E5%8D%95%E4%B8%80%E6%8E%A8%E6%96%87%E5%AE%9A%E6%97%B6%E5%8F%91%E9%80%81-%F0%9F%90%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/552361/Edge%E5%8D%95%E4%B8%80%E6%8E%A8%E6%96%87%E5%AE%9A%E6%97%B6%E5%8F%91%E9%80%81-%F0%9F%90%B1.meta.js
// ==/UserScript==
 
// Copyright © 2025 ols & los
//
// This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/
//
// 本作品采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。
// 要查看该许可协议的副本，请访问 http://creativecommons.org/licenses/by-nc-nd/4.0/
// ==/UserScript==


(function() {
    'use strict';

    // 创建一个函数来执行发送推文的操作
    function sendScheduledTweet() {
        try {
            // 1. 从浏览器 Cookie 中获取 CSRF Token
            const csrfToken = document.cookie.match(/ct0=([a-zA-Z0-9]+)/)[1];

            // 2. 定义推文内容和发布时间
            const tweetText = "所以啊，幸福不简单\n\n#LingOrm";
            const timestamp = 1760537700;

            // 3. 发送 API 请求
            console.log("准备发送定时推文...");
            fetch('https://x.com/i/api/graphql/LCVzRQGxOaGnOnYH01NQXg/CreateScheduledTweet', {
                method: 'POST',
                headers: {
                    'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                    'content-type': 'application/json',
                    'x-csrf-token': csrfToken, // 使用上面获取到的 token
                    'x-twitter-active-user': 'yes',
                    'x-twitter-auth-type': 'OAuth2Session',
                },
                body: JSON.stringify({
                    variables: {
                        post_tweet_request: {
                            auto_populate_reply_metadata: false,
                            status: tweetText,
                            exclude_reply_user_ids: [],
                            media_ids: [],
                            thread_tweets: []
                        },
                        execute_at: timestamp
                    },
                    queryId: 'LCVzRQGxOaGnOnYH01NQXg'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    console.error("发送失败:", data.errors);
                    alert(`发送失败: ${JSON.stringify(data.errors)}`);
                } else {
                    console.log("定时推文发送成功:", data);
                    alert("定时推文已成功发送！");
                }
            })
            .catch(error => {
                 console.error('请求出错:', error);
                 alert(`请求出错: ${error}`);
            });

        } catch (error) {
            alert("获取 CSRF Token 失败。请确保您已登录 X.com。");
            console.error("获取 CSRF Token 时出错:", error);
        }
    }

    // 在页面上创建一个按钮
    function setupButton() {
        const button = document.createElement('button');
        button.textContent = '发送预设的定时推文';
        button.style.cssText = 'position: fixed; top: 100px; left: 10px; z-index: 9999; background-color: #1DA1F2; color: white; border: none; padding: 10px 15px; border-radius: 20px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
        // 点击按钮时，执行发送函数
        button.addEventListener('click', sendScheduledTweet);
        document.body.appendChild(button);
    }

    // 等待页面加载完毕后执行
    window.addEventListener('load', () => {
        // 延迟3秒以确保页面元素完全加载
        setTimeout(setupButton, 3000);
    });

})();

