// ==UserScript==
// @name         禁止摸鱼 (No Fishing)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  当访问知乎、微博等网站时，提示禁止摸鱼并关闭标签页或覆盖内容
// @author       NoWaste
// @match        *://*.zhihu.com/*
// @match        *://*.weibo.com/*
// @match        *://*.weibo.cn/*
// @match        *://*.bilibili.com/*
// @match        *://*.douban.com/*
// @match        *://tieba.baidu.com/*
// @match        *://*.reddit.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561904/%E7%A6%81%E6%AD%A2%E6%91%B8%E9%B1%BC%20%28No%20Fishing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561904/%E7%A6%81%E6%AD%A2%E6%91%B8%E9%B1%BC%20%28No%20Fishing%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        message: "禁止摸鱼！赶紧去工作！",
        redirectUrl: "about:blank" // 如果无法关闭，可以重定向到这里，或者保留为 null 使用全屏覆盖
    };

    function enforceWorkMode() {
        // 1. 弹出提示
        // 使用 setTimeout 确保 alert 不会完全阻塞脚本后续执行（虽然 alert 本身是阻塞的，但在某些浏览器机制下可能表现不同）
        // 这里直接 alert 比较简单粗暴
        alert(config.message);

        // 2. 尝试关闭标签页
        // 注意：Firefox 和 Chrome 通常不允许脚本关闭非脚本打开的窗口
        try {
            window.opener = null;
            window.open('', '_self');
            window.close();
        } catch (e) {
            console.log("尝试关闭窗口失败，转为覆盖模式");
        }

        // 3. 如果窗口还在，覆盖页面内容
        try {
            // 停止页面继续加载资源
            if (window.stop) {
                window.stop();
            }

            // 覆盖整个文档内容
            document.documentElement.innerHTML = `
                <head>
                    <title>禁止摸鱼</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            height: 100vh;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: #ff4d4f;
                            color: white;
                            font-family: system-ui, -apple-system, sans-serif;
                            overflow: hidden;
                        }
                        .container {
                            text-align: center;
                            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                        }
                        h1 { font-size: 5rem; margin: 0 0 2rem 0; }
                        p { font-size: 2rem; opacity: 0.9; }
                        @keyframes shake {
                            10%, 90% { transform: translate3d(-1px, 0, 0); }
                            20%, 80% { transform: translate3d(2px, 0, 0); }
                            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                            40%, 60% { transform: translate3d(4px, 0, 0); }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚫 禁止摸鱼</h1>
                        <p>${config.message}</p>
                    </div>
                </body>
            `;
        } catch (e) {
            console.error("覆盖页面失败", e);
            // 最后的手段：重定向
            if (config.redirectUrl) {
                window.location.href = config.redirectUrl;
            }
        }
    }

    // 立即执行
    enforceWorkMode();

    // 监听加载事件再次执行，防止 SPA 框架重新渲染
    window.addEventListener('load', enforceWorkMode);
    
    // 简单的防抖动检查，防止页面被恢复
    setInterval(() => {
        if (document.title !== "禁止摸鱼" && document.body && !document.body.innerText.includes("禁止摸鱼")) {
            enforceWorkMode();
        }
    }, 2000);

})();
