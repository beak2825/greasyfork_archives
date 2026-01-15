// ==UserScript==
// @name         游民星空首页布局优化
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  游名星空网站首页布局优化，去掉网站上半部分无用信息，让阅读文章主体更方便，适配老版和新版首页，带一键显隐开关
// @author       Your Name
// @match        *://*.gamersky.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562510/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/562510/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区
    const hideSelectors = [
        '.header',
        '.topnav1',
        '.Mid0New-Gamelist.GameBoxBlock'
    ];
    let isHidden = true;

    // 注入初始隐藏CSS
    const style = document.createElement('style');
    style.id = 'hide-target-elements';
    style.textContent = hideSelectors.join(',') + '{display: none !important;}';
    document.head.appendChild(style);

    // 切换元素显隐
    function toggleElements(hide) {
        hideSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = hide ? 'none' : '';
            });
        });
        style.textContent = hide 
            ? hideSelectors.join(',') + '{display: none !important;}'
            : hideSelectors.join(',') + '{display: revert !important;}';
        isHidden = hide;
    }

    // 创建并插入按钮
    function createToggleButton() {
        const timer = setInterval(() => {
            const topbar = document.querySelector('.topbar');
            if (topbar) {
                clearInterval(timer);
                insertButton(topbar);
            }
        }, 50);
        setTimeout(() => clearInterval(timer), 10000);
    }

    // 插入按钮（适配样式+垂直居中）
    function insertButton(topbar) {
        const button = document.createElement('button');
        button.innerText = isHidden ? '显示元素' : '隐藏元素';
        // 适配页面的深色/灰色系样式，垂直居中
        button.style.cssText = `
            margin-left: 12px;
            padding: 0 10px;
            border: 1px solid #444;
            border-radius: 2px;
            background: #333;
            color: #ccc;
            cursor: pointer;
            font-size: 12px;
            height: 28px;
            line-height: 28px;
            vertical-align: middle;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;
        //  hover效果更自然
        button.onmouseover = () => {
            button.style.background = '#444';
            button.style.color = '#eee';
        };
        button.onmouseout = () => {
            button.style.background = '#333';
            button.style.color = '#ccc';
        };

        // 点击事件
        button.addEventListener('click', () => {
            isHidden = !isHidden;
            button.innerText = isHidden ? '显示元素' : '隐藏元素';
            toggleElements(isHidden);
        });

        // 插入到QZ-nav右侧（和导航元素垂直对齐）
        const qzNav = topbar.querySelector('.QZ-nav');
        if (qzNav) {
            qzNav.parentNode.insertBefore(button, qzNav.nextSibling);
        } else {
            topbar.insertBefore(button, topbar.firstChild);
        }
    }

    // 立即执行
    createToggleButton();

})();