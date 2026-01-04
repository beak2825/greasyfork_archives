// ==UserScript==
// @name         Bilibili 视频封面提取器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 Bilibili 视频页面添加一个按钮，用于提取并显示视频封面大图。会在视频画面左侧显示按钮。
// @author       ChatGPT / Gemini
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551531/Bilibili%20%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551531/Bilibili%20%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义一个函数来查找封面 URL
    function findCoverUrl(htmlContent) {
        // 匹配格式：iX.hdslb.com/bfs/archive/....jpg
        // 注意：有些视频的封面可能不是在严格的第5行，但通常都在头部元信息中。
        const regex = /(i\d+\.hdslb\.com\/bfs\/archive\/[a-f0-9]+\.jpg)/;
        const lines = htmlContent.split('\n');
        const searchArea = lines.slice(0, 75).join('\n');

        const match = searchArea.match(regex);

        if (match && match[1]) {
            // 匹配到的 URL 是相对路径，需要加上协议头 'https://'
            return 'https://' + match[1];
        }

        return null; // 如果没有找到
    }

    // 2. 定义添加按钮的函数
    function addButtonAndBindEvent(coverUrl) {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = '获取封面';
        button.style.cssText = `
            position: absolute;
            top: 180px; /* 调整位置，避免遮挡其他元素 */
            left: 75px;
            z-index: 10000;
            padding: 8px 15px;
            background-color: transparent; /* 背景透明 */
            color: #00A1D6;               /* 文字颜色改为 Bilibili 蓝 */
            border: 1px solid #00A1D6;    /* 添加 1px 宽的蓝色实线边框 */
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        // 绑定点击事件
        button.addEventListener('click', () => {
            if (coverUrl) {
                // 根据你的要求，点击按钮会弹出一个窗口，窗口就是封面 URL
                // 最好的用户体验是**在新标签页中打开封面图片**
                if (typeof GM_openInTab === 'function') {
                    // 使用 Tampermonkey 的 API 在新标签页打开
                    GM_openInTab(coverUrl, { active: true, insert: true });
                } else {
                    // 如果不支持 GM_openInTab，则使用原生 JavaScript
                    window.open(coverUrl, '_blank');
                }
            } else {
                alert('抱歉，未能找到封面 URL！');
            }
        });

        // 找到一个合适的父元素（如 body）将按钮添加到网页中
        document.body.appendChild(button);
    }

    // 3. 核心逻辑：获取当前页面的源代码并处理
    // 使用 GM_xmlhttpRequest 获取原始网页内容
    GM_xmlhttpRequest({
        method: "GET",
        url: window.location.href, // 请求当前页面的 URL
        onload: function(response) {
            // response.responseText 包含了完整的网页源代码
            const htmlContent = response.responseText;
            const coverUrl = findCoverUrl(htmlContent);

            // 无论是否找到，都尝试添加按钮。
            // 如果找到，按钮能打开图片；如果没找到，按钮会提示失败。
            addButtonAndBindEvent(coverUrl);
        },
        onerror: function(error) {
            console.error("油猴脚本获取页面内容失败:", error);
            // 即使失败，也添加一个提示失败的按钮
            addButtonAndBindEvent(null);
        }
    });

})();