// ==UserScript==
// @name         YouVersion Bible Reading Optimizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化YouVersion Bible阅读体验，调整文本宽度并优化翻页按钮位置
// @author       ELDERJiangneverdies
// @license      GNU GPLv3
// @match        https://www.bible.com/bible/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bible.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559451/YouVersion%20Bible%20Reading%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/559451/YouVersion%20Bible%20Reading%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
        /* --- 布局修复核心 --- */
        
        /* 暴力解除父容器的宽度限制 (针对 max-w-[512px] 和 lg:w-1/2) */
        /* 使用属性选择器模糊匹配，防止 Tailwind 类名变化 */
        div[class*="max-w-["],
        div[class*="lg:w-1/2"],
        div[class*="md:w-5/6"] {
            max-width: 100% !important;
            width: 100% !important;
            flex-basis: auto !important;
        }

        /* 文本主容器：强制使用视口宽度的 90% 并居中 */
        .ChapterContent_yv-bible-text__tqVMm {
            width: 90vw !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
        }

        /* 修复文本遮挡/显示不全的问题 */
        .ChapterContent_bible-reader__LmLUa,
        .ChapterContent_reader__Dt27r {
            width: 100% !important;
            overflow: visible !important; /* 关键：防止遮罩 */
        }
        
        /* 确保段落排版正常 */
        .ChapterContent_p__dVKHb {
            width: 100% !important;
            margin: 20px auto !important;
            line-height: 1.8 !important;
            font-size: 19px !important;
            text-align: justify !important;
        }

        /* --- 导航按钮处理 --- */

        /* 彻底隐藏原页面所有形式的翻页按钮 (通过 SVG Title 特征隐藏父级) */
        /* 这里使用 :has 选择器，现代浏览器均支持 */
        button:has(svg title[id="Previous Chapter"]),
        button:has(svg title[id="Next Chapter"]),
        div:has(> svg > title[id="Previous Chapter"]),
        div:has(> svg > title[id="Next Chapter"]),
        a[href*="bible"]:has(svg),
        .absolute.left-0,
        .absolute.right-0 {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* 新增的边缘透明按钮样式 */
        .edge-nav-btn {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 5vw; /* 响应区域宽度，两边各占15% */
            z-index: 99999; /* 确保在最顶层 */
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            /* background: rgba(255,0,0,0.1);  调试用：取消注释可看到点击区域 */
            transition: opacity 0.3s;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        /* 鼠标悬停时显示微弱的箭头提示 */
        .edge-nav-btn::after {
            content: '';
            font-size: 60px;
            color: #ddd;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .edge-nav-btn:hover::after {
            opacity: 1;
        }

        .edge-btn-left {
            left: 0;
        }
        .edge-btn-left::after { content: '‹'; margin-right: 20px; }

        .edge-btn-right {
            right: 0;
        }
        .edge-btn-right::after { content: '›'; margin-left: 20px; }
        
        /* 隐藏底部干扰元素 */
        div[class*="fixed bottom-0"] {
            display: none !important;
        }
        
        /* 防止页面整体横向滚动 */
        body {
            overflow-x: hidden !important;
        }
    `;
    document.head.appendChild(style);

    // 2. 创建并插入边缘点击区域
    const leftBtn = document.createElement('div');
    leftBtn.className = 'edge-nav-btn edge-btn-left';
    leftBtn.title = '上一章';
    
    const rightBtn = document.createElement('div');
    rightBtn.className = 'edge-nav-btn edge-btn-right';
    rightBtn.title = '下一章';

    document.body.appendChild(leftBtn);
    document.body.appendChild(rightBtn);

    // 3. 核心功能：查找并触发原按钮点击
    // 辅助函数：根据 SVG Title 查找最近的可点击父元素
    function clickOriginalButton(titleId) {
        // 1. 查找包含特定 title ID 的 SVG 元素
        const titleEl = document.getElementById(titleId);
        if (!titleEl) {
            console.log(`未找到 ID 为 ${titleId} 的元素，尝试备用选择器`);
            return false;
        }
        
        // 2. 向上查找最近的 button, a 标签或具有点击行为的 div
        const svgEl = titleEl.closest('svg');
        const clickable = svgEl.closest('button, a, div[class*="cursor-pointer"], div[class*="active:bg-"]');
        
        if (clickable) {
            clickable.click();
            return true;
        }
        return false;
    }

    // 绑定事件
    leftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const success = clickOriginalButton('Previous Chapter');
        // 备用方案：如果没有 ID，尝试 aria-label
        if (!success) {
            const altBtn = document.querySelector('[aria-label="Previous Chapter"]');
            if (altBtn) altBtn.click();
        }
    });

    rightBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const success = clickOriginalButton('Next Chapter');
        // 备用方案
        if (!success) {
            const altBtn = document.querySelector('[aria-label="Next Chapter"]');
            if (altBtn) altBtn.click();
        }
    });

})();