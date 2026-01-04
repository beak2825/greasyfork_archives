// ==UserScript==
// @name         知乎标题隐藏
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  在知乎页面左侧创建一个固定的灯泡按钮，用于全局显示或隐藏信息流标题和问题详情页的主标题。默认显示标题。
// @author       Your Name
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547702/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547702/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        // --- 1. 定义所有需要处理的标题的选择器 ---
        const ALL_TITLE_SELECTORS = '.ContentItem-title a, h2.ContentItem-title, .QuestionHeader-title';

        // --- 2. CSS 样式 (保持不变) ---
        GM_addStyle(`
            .zh-title-hidden-by-script { display: none !important; }
            #title-toggle-fab {
                position: fixed !important;
                top: 200px !important;
                left: 25px !important;
                z-index: 99999 !important;
                width: 50px !important;
                height: 50px !important;
                background: #f7f7f7;
                color: #333;
                font-size: 28px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                user-select: none !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
                transition: all 0.2s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            #title-toggle-fab:hover {
                box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
                transform: scale(1.05) !important;
            }
            #title-toggle-fab.is-off { background: #e0e0e0; opacity: 0.6; }
            #title-toggle-fab.is-on {
                background: #0084ff;
                opacity: 1;
                text-shadow: 0 0 12px rgba(255, 255, 128, 0.8), 0 0 5px rgba(255, 255, 0, 0.7);
            }
        `);

        // --- 3. 【已更新】定义全局状态和创建按钮 ---
        // 将默认状态设置为 true，表示标题默认可见
        let titlesAreVisible = true;
        
        const fab = document.createElement('div');
        fab.id = 'title-toggle-fab';
        fab.innerHTML = '💡';
        // 初始状态为点亮
        fab.classList.add('is-on');
        document.body.appendChild(fab);

        // --- 4. 按钮点击事件 ---
        fab.addEventListener('click', () => {
            titlesAreVisible = !titlesAreVisible;
            fab.classList.toggle('is-on', titlesAreVisible);
            fab.classList.toggle('is-off', !titlesAreVisible);

            const allTitles = document.querySelectorAll(ALL_TITLE_SELECTORS);
            allTitles.forEach(updateTitleVisibility);
        });

        // --- 5. 核心处理逻辑 ---
        function updateTitleVisibility(titleElement) {
            if (titlesAreVisible) {
                titleElement.classList.remove('zh-title-hidden-by-script');
            } else {
                titleElement.classList.add('zh-title-hidden-by-script');
            }
        }
        
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    const newTitles = [];
                    if (node.matches && node.matches(ALL_TITLE_SELECTORS)) {
                        newTitles.push(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll(ALL_TITLE_SELECTORS).forEach(title => newTitles.push(title));
                    }
                    newTitles.forEach(title => {
                        if (!title.dataset.titleProcessed) {
                            title.dataset.titleProcessed = 'true';
                            updateTitleVisibility(title);
                        }
                    });
                }
            }
        });

        // --- 6. 脚本启动逻辑 ---
        function run() {
            document.querySelectorAll(ALL_TITLE_SELECTORS).forEach(title => {
                if (!title.dataset.titleProcessed) {
                    title.dataset.titleProcessed = 'true';
                    updateTitleVisibility(title);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        if (document.body) run();
        else window.addEventListener('DOMContentLoaded', run);

    } catch (error) {
        console.error('知乎标题隐藏脚本出错:', error);
    }
})();