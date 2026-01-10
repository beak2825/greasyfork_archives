// ==UserScript==
// @name         Bilibili 稍后再看独立页跳转按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在稍后再看列表页添加一个按钮，提取当前BVID并跳转到独立的视频详情页
// @author       User
// @match        https://www.bilibili.com/list/watchlater*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562073/Bilibili%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E7%8B%AC%E7%AB%8B%E9%A1%B5%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562073/Bilibili%20%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E7%8B%AC%E7%AB%8B%E9%A1%B5%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 插入 CSS 样式
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-open-video-btn {
            border: 1px solid var(--brand_blue) !important;
            margin-right: 18px !important;
            padding: 0 12px;
            height: 30px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
            color: var(--brand_blue);
            background: transparent;
            user-select: none;
        }
        #custom-open-video-btn:hover {
            background-color: var(--graph_bg_thick, rgba(0, 174, 236, 0.1));
            opacity: 0.8;
        }
        #custom-open-video-btn .btn-text {
            font-size: 13px;
            font-weight: 500;
        }
        #custom-open-video-btn svg {
            fill: var(--brand_blue);
        }
    `;
    document.head.appendChild(style);

    // 2. 获取当前 BVID 的函数
    function getBvid() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('bvid');
    }

    // 3. 创建并插入按钮
    function injectButton() {
        const toolbar = document.querySelector('.video-toolbar-right');

        // 如果工具栏还没加载出来，或者按钮已经存在，则返回
        if (!toolbar || document.getElementById('custom-open-video-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'custom-open-video-btn';
        // 赋予和 B 站原生项类似的 class 名，以便继承基础样式
        btn.className = 'video-toolbar-right-item';

        // 按钮内容：使用一个简单的“外部链接”图标
        btn.innerHTML = `
            <span class="btn-text">独立打开喵</span>
        `;

        // 点击逻辑
        btn.onclick = function() {
            const bvid = getBvid();
            if (bvid) {
                window.open(`https://www.bilibili.com/video/${bvid}`, '_blank');
            }
        };

        // 插入到工具栏的最左侧（第一个位置）
        toolbar.prepend(btn);
    }

    // 4. 监听 DOM 变化（处理异步加载和播放列表切换）
    const observer = new MutationObserver(() => {
        injectButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();