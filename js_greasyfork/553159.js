// ==UserScript==
// @name         微博将要访问页面添加直接访问按钮
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.1
// @description  在微博“将要访问”转链接页面右上角添加直接访问目标网站的按钮
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.cn/sinaurl?u=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553159/%E5%BE%AE%E5%8D%9A%E5%B0%86%E8%A6%81%E8%AE%BF%E9%97%AE%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/553159/%E5%BE%AE%E5%8D%9A%E5%B0%86%E8%A6%81%E8%AE%BF%E9%97%AE%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面上的跳转链接
    function findTargetUrl() {
        // 方法1: 从URL参数中提取
        const urlParams = new URLSearchParams(window.location.search);
        const encodedUrl = urlParams.get('u');
        if (encodedUrl) {
            try {
                return decodeURIComponent(encodedUrl);
            } catch (e) {
                console.log('URL解码失败:', e);
            }
        }

        // 方法2: 查找页面中的跳转链接
        const links = document.querySelectorAll('a');
        for (let link of links) {
            const href = link.getAttribute('href') || '';
            if (href.includes('weibo.cn/sinaurl') && href.includes('u=')) {
                const match = href.match(/u=([^&]+)/);
                if (match) {
                    try {
                        return decodeURIComponent(match[1]);
                    } catch (e) {
                        console.log('URL解码失败:', e);
                    }
                }
            }
        }

        return null;
    }

    // 创建直接访问按钮
    function createDirectAccessButton(targetUrl) {
        const button = document.createElement('button');
        button.innerHTML = '直接访问目标网站';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 20px;
            background: #ff8140;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseover', function() {
            button.style.background = '#e67230';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseout', function() {
            button.style.background = '#ff8140';
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', function() {
            window.location.href = targetUrl;
        });

        return button;
    }

    // 主执行函数
    function main() {
        const targetUrl = findTargetUrl();

        if (targetUrl) {
            console.log('找到目标URL:', targetUrl);
            const button = createDirectAccessButton(targetUrl);
            document.body.appendChild(button);

            // 可选：添加提示信息
            const notice = document.createElement('div');
            notice.innerHTML = `检测到目标网站: <span style="color: #ff8140; font-weight: bold;">${targetUrl}</span>`;
            notice.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 9999;
                padding: 10px 15px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 400px;
                word-break: break-all;
            `;
            document.body.appendChild(notice);
        } else {
            console.log('未找到目标URL');
        }
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();