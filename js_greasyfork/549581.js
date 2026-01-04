// ==UserScript==
// @name         kimi对话目录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取当前kimi页面的所有提问，以大纲显示，点击可跳转
// @author       wawayv
// @match        https://www.kimi.com/*
// @icon         none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549581/kimi%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/549581/kimi%E5%AF%B9%E8%AF%9D%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 全局变量，用于保存设置
    let settings = {
        displayCount: GM_getValue('displayCount', 50), // 默认值为 50
        displayType: GM_getValue('displayType', '前x个字符') // 默认值为 '前x个字符'
    };

    // 保存设置到 GM_setValue
    function saveSettings() {
        GM_setValue('displayCount', settings.displayCount);
        GM_setValue('displayType', settings.displayType);
    }





    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = 'outline';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.fontSize = '16px';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    // 创建一个容器来显示这些内容
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '60px'; // 避免与按钮重叠
    container.style.right = '10px';
    container.style.width = '300px';
    container.style.height = 'auto';
    container.style.overflowY = 'auto';
    container.style.background = 'white';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.zIndex = '10000';


    // 创建一个收起按钮
    const collapseButton = document.createElement('button');
    collapseButton.textContent = '收起';
    collapseButton.style.marginTop = '10px';
    collapseButton.style.padding = '10px';
    collapseButton.style.fontSize = '16px';
    collapseButton.style.background = '#f44336';
    collapseButton.style.color = 'white';
    collapseButton.style.border = 'none';
    collapseButton.style.cursor = 'pointer';

    // 定义查询和渲染的函数
    const queryAndRender = () => {
        const { displayCount, displayType } = settings; // 从全局变量中获取设置
        const x = displayCount;
        const position = displayType;

        // 获取所有 class="user-content" 的 div
        const userContentDivs = document.querySelectorAll('.user-content');
        console.log(`搜索到的元素数量: ${userContentDivs.length}`);

        // 清空之前的列表
        container.innerHTML = '';

        // 遍历并显示每个 div 的内容
        userContentDivs.forEach((div, index) => {
            let displayText;
            if (position === '前x个字符') {
                displayText = div.textContent.substring(0, x);
            } else {
                displayText = div.textContent.substring(div.textContent.length - x);
            }

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = `内容 ${index + 1}: ${displayText}`;
            link.style.display = 'block';
            link.style.marginBottom = '10px';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                div.scrollIntoView({ behavior: 'smooth' });
            });
            container.appendChild(link);
        });

                // 显示容器
        container.style.display = 'block';

        // 添加收起按钮
        container.appendChild(collapseButton);
    };

        // 定义收起内容的函数
    const collapseContent = () => {
        container.style.display = 'none';
    };

    // 为按钮添加点击事件
    button.addEventListener('click', queryAndRender);
    collapseButton.addEventListener('click', collapseContent);

    // 将按钮和容器添加到页面上
    document.body.appendChild(button);
    document.body.appendChild(container);
     // 添加菜单命令以设置显示字符数
    GM_registerMenuCommand('设置显示字符数', () => {
        const count = prompt('请输入显示字符数 (x):', settings.displayCount);
        if (count !== null && !isNaN(count)) {
            settings.displayCount = parseInt(count, 10);
            saveSettings();
        }
    });

    // 添加菜单命令以设置显示位置
    GM_registerMenuCommand('设置显示位置', () => {
        const type = prompt('请输入显示位置 (前x个字符/最后x个字符):', settings.displayType);
        if (type !== null && ['前x个字符', '最后x个字符'].includes(type)) {
            settings.displayType = type;
            saveSettings();
        }
    });
})();