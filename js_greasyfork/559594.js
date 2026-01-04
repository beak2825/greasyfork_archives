// ==UserScript==
// @name         Linux.do 收藏标签优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动展开 Linux.do 和 idcflare 帖子下方的省略号，并将所有收藏相关的图标（按钮、标题前、列表）改为红色
// @author       DonkeyX
// @license      MIT
// @match        https://linux.do/*
// @match        https://idcflare.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559594/Linuxdo%20%E6%94%B6%E8%97%8F%E6%A0%87%E7%AD%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559594/Linuxdo%20%E6%94%B6%E8%97%8F%E6%A0%87%E7%AD%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入 CSS (CSS Injection)：处理布局、隐藏省略号以及全局收藏图标变红
    const style = document.createElement('style');
    style.innerHTML = `
        /* 隐藏省略号按钮 (Hide "..." button) */
        button.show-more-actions,
        button:has(.d-icon-ellipsis) {
            display: none !important;
        }

        /* 确保展开后的按钮组排列自然 (Ensure natural layout for expanded buttons) */
        .post-controls .extra-buttons {
            display: inline-flex !important;
        }

        /* 移除展开时的多余边距 */
        .post-controls .button-wrapper {
            margin-right: 5px;
        }

        /* --- 颜色自定义部分 (Custom Colors) --- */

        /* A. 帖子下方的“已收藏”按钮变红 (Post controls bookmark button) */
        .post-controls button.bookmark.bookmarked .d-icon {
            color: #ff4d4f !important;
            fill: #ff4d4f !important;
        }

        /* B. 帖子详情页标题前的收藏图标变红 (Thread title bookmark icon) */
        .title-wrapper .d-icon-bookmark {
            color: #ff4d4f !important;
            fill: #ff4d4f !important;
        }

        /* C. 论坛话题列表中的收藏图标变红 (Topic list bookmark icon) */
        /* 针对列表状态图标栏进行精准定位，避免干扰 utag */
        .topic-list .topic-statuses .d-icon-bookmark,
        .latest-topic-list-item .topic-statuses .d-icon-bookmark {
            color: #ff4d4f !important;
            fill: #ff4d4f !important;
        }

        /* 针对点击瞬间的反馈颜色 */
        .post-controls button.bookmark.bookmarked:active .d-icon {
            color: #cf1322 !important;
        }
    `;
    document.head.appendChild(style);

    /**
     * 核心逻辑：寻找并点击“...”按钮 (Core Logic: Find and click the ellipsis button)
     */
    function expandControls() {
        // 查找尚未被脚本处理过的省略号按钮
        const moreButtons = document.querySelectorAll('button.show-more-actions:not(.auto-clicked)');

        moreButtons.forEach(btn => {
            // 标记已点击 (Mark as clicked to avoid infinite loops)
            btn.classList.add('auto-clicked');
            // 模拟用户点击 (Simulate user click)
            btn.click();
        });
    }

    // 2. 使用 MutationObserver 监听动态内容加载 (Observer for dynamic content)
    const observer = new MutationObserver((mutations) => {
        expandControls();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后立即执行一次 (Initial execution)
    expandControls();
})();