// ==UserScript==
// @name         Monkrus Freedown Button
// @namespace    UTsNamespace
// @version      1.1
// @description  On the monkrus.ws page, extract the registration-free download links for pb.wtf and uztracker, and generate top buttons.
// @author       UTwelve
// @license      MIT
// @match        https://w*.monkrus.ws/*
// @exclude-match https://w*.monkrus.ws/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkrus.ws
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/558326/Monkrus%20Freedown%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558326/Monkrus%20Freedown%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义我们关心的目标站点关键词和显示名称
    const targets = [
        { keyword: 'pb.wtf', label: 'PB.WTF' },
        { keyword: 'uztracker.net', label: 'UZTRACKER' }
    ];

    // 2. 找到包含下载链接的容器
    // 根据提供的HTML结构，这些链接通常包裹在一个 <font> 标签内，且以 "СКАЧАТЬ С ТОРРЕНТ-ТРЕКЕРА НА ВЫБОР" 开头
    // 我们可以通过查找包含特定文本的 <b> 标签来定位这个区域
    const titleElement = Array.from(document.querySelectorAll('b')).find(el =>
        el.textContent.includes('СКАЧАТЬ С ТОРРЕНТ-ТРЕКЕРА НА ВЫБОР') ||
        el.textContent.includes('DOWNLOAD FROM TORRENT TRACKER TO CHOOSE') // 考虑到可能有英文翻译插件
    );

    if (!titleElement) {
        console.log('未找到下载区域，脚本停止执行。');
        return;
    }

    // 获取包含所有链接的父容器 (通常是 <font> 或者它的父级)
    const container = titleElement.parentElement;

    // 3. 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.style.marginBottom = '10px';
    btnContainer.style.padding = '10px';
    btnContainer.style.backgroundColor = '#f0f0f0';
    btnContainer.style.border = '1px solid #ccc';
    btnContainer.style.borderRadius = '5px';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';
    btnContainer.style.alignItems = 'center';

    // 添加标题
    const labelSpan = document.createElement('span');
    labelSpan.textContent = '快速下载通道: ';
    labelSpan.style.fontWeight = 'bold';
    labelSpan.style.color = '#333';
    btnContainer.appendChild(labelSpan);

    // 4. 遍历目标，查找链接并生成按钮
    targets.forEach(target => {
        // 在容器内查找 href 包含关键词的 a 标签
        const linkElement = container.querySelector(`a[href*="${target.keyword}"]`);

        const btn = document.createElement('a');
        btn.style.padding = '5px 15px';
        btn.style.borderRadius = '4px';
        btn.style.textDecoration = 'none';
        btn.style.fontFamily = 'Arial, sans-serif';
        btn.style.fontSize = '14px';
        btn.style.fontWeight = 'bold';
        btn.style.transition = 'all 0.2s';

        if (linkElement && linkElement.href) {
            // 找到了链接
            btn.href = linkElement.href;
            btn.textContent = target.label;
            btn.target = '_blank';
            btn.style.backgroundColor = '#4CAF50'; // 绿色
            btn.style.color = 'white';
            btn.style.border = '1px solid #45a049';

            // 鼠标悬停效果
            btn.onmouseover = () => { btn.style.backgroundColor = '#45a049'; };
            btn.onmouseout = () => { btn.style.backgroundColor = '#4CAF50'; };

        } else {
            // 没找到链接
            btn.textContent = `${target.label} (无)`;
            btn.href = 'javascript:void(0)';
            btn.style.backgroundColor = '#e0e0e0'; // 灰色
            btn.style.color = '#999';
            btn.style.border = '1px solid #ccc';
            btn.style.cursor = 'not-allowed';
        }

        btnContainer.appendChild(btn);
    });

    // 5. 将按钮容器插入到标题上方
    // insertBefore(要插入的节点, 参考节点)
    container.insertBefore(btnContainer, titleElement);

})();
// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/12/8 22:25:46
// ==/UserScript==
