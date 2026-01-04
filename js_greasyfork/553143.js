// ==UserScript==
// @name         X岛优化岛 - 侧边栏优化版
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  优化侧边栏交互体验，增加触发区域。
// @author       You & Gemini
// @match        https://www.nmbxd1.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nmbxd1.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/553143/X%E5%B2%9B%E4%BC%98%E5%8C%96%E5%B2%9B%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553143/X%E5%B2%9B%E4%BC%98%E5%8C%96%E5%B2%9B%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 原有样式优化 ---

    // 设置背景色
    document.body.style.backgroundColor = '#F7F7F7';
    document.documentElement.style.backgroundColor = '#F7F7F7';

    // 使用“h-threads-item-reply-main”类更改div的背景颜色
    // 注意：此代码只在页面加载时运行一次，动态加载的内容可能不会被应用样式
    let replyDivs = document.getElementsByClassName('h-threads-item-reply-main');
    for (let j = 0; j < replyDivs.length; j++) {
        replyDivs[j].style.backgroundColor = '#DBDCDD';
    }


    // --- 侧边栏自动收起功能 (已优化) ---

    const hMenuDiv = document.getElementById('h-menu');
    if (hMenuDiv) {
        // 1. 创建一个新的触发区域元素
        const triggerZone = document.createElement('div');

        // 2. 设置触发区域的样式
        // 它将是一个位于屏幕左侧的、透明的、固定宽度的垂直条
        triggerZone.style.position = 'fixed';
        triggerZone.style.left = '0';
        triggerZone.style.top = '0';
        triggerZone.style.width = '20px'; // 将触发区域宽度设为20像素，可以根据需要调整
        triggerZone.style.height = '100vh'; // 高度占满整个屏幕
        triggerZone.style.zIndex = '998'; // 确保它在大多数元素之上，但在菜单之下
        // triggerZone.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // 取消此行注释以可视化触发区域

        // 3. 将触发区域添加到页面中
        document.body.appendChild(triggerZone);

        // 4. 设置侧边栏的初始样式为折叠
        hMenuDiv.style.transition = 'width 0.3s ease'; // 添加平滑过渡效果
        hMenuDiv.style.width = '0';
        hMenuDiv.style.overflow = 'hidden';
        hMenuDiv.style.zIndex = '999'; // 确保菜单在触发区域之上

        // 5. 为新的触发区域添加鼠标悬停事件，用于展开侧边栏
        triggerZone.addEventListener('mouseover', function() {
            hMenuDiv.style.width = '200px'; // 展开侧边栏
            hMenuDiv.style.overflow = 'visible';
        });

        // 6. 为侧边栏本身添加鼠标移出事件，用于收起侧边栏
        hMenuDiv.addEventListener('mouseleave', function() {
            hMenuDiv.style.width = '0'; // 收起侧边栏
            hMenuDiv.style.overflow = 'hidden';
        });
    }

})();
