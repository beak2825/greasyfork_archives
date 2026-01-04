// ==UserScript==
// @name         CSDN简化页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在CSDN博客页面上添加简化/还原按钮，点击简化只保留article_content元素并隐藏AI运行代码按钮
// @author       薛定谔的按钮
// @match        https://blog.csdn.net/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551328/CSDN%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/551328/CSDN%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只在CSDN博客页面生效
    if (!window.location.hostname.includes('blog.csdn.net')) {
        return;
    }

    // 检查页面是否已经简化过
    if (document.body.hasAttribute('data-simplified')) {
        return;
    }

    // 创建按钮
    const button = document.createElement('button');
    button.id = 'simplify-toggle-btn';
    button.textContent = '简化/还原页面';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        padding: 10px 15px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;

    // 存储状态
    let isSimplified = false;

    // 查找并隐藏所有包含"AI运行代码"的按钮
    function hideAIRunButtons() {
        // CSDN特定的选择器
        const aiButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"], .btn, .button');
        aiButtons.forEach(btn => {
            if (btn.textContent.includes('AI运行代码') ||
                (btn.value && btn.value.includes('AI运行代码')) ||
                btn.innerText.includes('AI运行代码')) {
                btn.style.display = 'none';
            }
        });
    }

    // 简化页面
    function simplifyPage() {
        // CSDN的文章内容通常在这些元素中
        const articleContent = document.getElementById('article_content') ||
                             document.querySelector('#content_views') ||
                             document.querySelector('.article_content') ||
                             document.querySelector('.htmledit_views') ||
                             document.querySelector('article');

        if (!articleContent) {
            alert('未找到文章内容元素！');
            return;
        }

        // 创建新的body内容
        const newBody = document.createElement('body');
        newBody.style.cssText = 'margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;';

        // 克隆article内容
        const clonedContent = articleContent.cloneNode(true);
        clonedContent.style.cssText += 'max-width: 800px; margin: 0 auto; padding: 20px; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); border-radius: 8px;';

        // 替换整个页面内容
        document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${document.title} - 简化版</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
                        background: #f5f5f5;
                    }
                    /* 保留基本的代码样式 */
                    pre, code {
                        font-family: "Consolas", "Courier New", monospace;
                        background: #f8f8f8;
                        padding: 2px 4px;
                        border-radius: 3px;
                    }
                    pre {
                        padding: 10px;
                        border-radius: 5px;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body data-simplified="true">
                ${clonedContent.outerHTML}
            </body>
            </html>
        `;

        // 重新添加按钮到简化后的页面
        setTimeout(() => {
            addSimplifyButton();
            isSimplified = true;
        }, 100);
    }

    // 还原页面（刷新）
    function restorePage() {
        location.reload();
    }

    // 添加按钮到页面
    function addSimplifyButton() {
        // 移除可能存在的旧按钮
        const existingBtn = document.getElementById('simplify-toggle-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // 创建新按钮
        //按钮文字的显示有点问题
        const btn = document.createElement('button');
        btn.id = 'simplify-toggle-btn';
        btn.textContent = isSimplified ? '还原/简化页面' : '还原/简化页面';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            padding: 10px 15px;
            background-color: ${isSimplified ? '#f44336' : '#4CAF50'};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;

        btn.addEventListener('click', () => {
            if (isSimplified) {
                restorePage();
            } else {
                simplifyPage();
            }
        });

        document.body.appendChild(btn);
    }

    // 初始化
    function init() {
        // 如果页面已经简化过，不执行
        if (document.body.hasAttribute('data-simplified')) {
            return;
        }

        // 隐藏AI运行代码按钮
        hideAIRunButtons();

        // 添加按钮
        addSimplifyButton();

        // 监听DOM变化，确保AI按钮被持续隐藏（CSDN页面可能动态加载内容）
        const observer = new MutationObserver(hideAIRunButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();