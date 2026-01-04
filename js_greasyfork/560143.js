// ==UserScript==
// @name                 BilibiliNarrowLayout
// @name:zh-CN           B站窄屏布局重组 (动态精简版)
// @name:zh-TW           B站窄屏佈局重組 (動態精簡版)
// @name:pt-BR           BilibiliNarrowLayout
// @name:ru              BilibiliNarrowLayout
// @match                *://www.bilibili.com/video/*
// @author               EugeneXXXie
// @description          自动化操作，提高效率，适配窄屏下的B站布局
// @description:zh-CN    自动化操作，提高效率，适配窄屏下的B站布局
// @description:zh-TW    自動化操作，提高效率，適配窄屏下的B站佈局
// @description:pt-BR    Operação automática, melhora a eficiência
// @description:ru       Автоматическая операция, повышение эффективности
// @license              MIT
// @version              1.0.1
// @icon                 https://www.bilibili.com/favicon.ico
// @namespace            http://azusakis.cn:10721
// @homepage             http://azusakis.cn:10721
// @run-at               document-body
// @grant                GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/560143/BilibiliNarrowLayout.user.js
// @updateURL https://update.greasyfork.org/scripts/560143/BilibiliNarrowLayout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 样式定义：将所有精简与重排逻辑写入 CSS
    GM_addStyle(`
        /* 基础结构解锁 */
        #app, .bili-header, .video-container-v1, .video-layout, .main-container {
            min-width: unset !important;
            max-width: 100vw !important;
        }

        /* 播放器溢出控制，防止横向滚动条 */
        #playerWrap, .player-wrap, #bilibili-player {
            width: 100% !important;
            min-width: unset !important;
            overflow: hidden !important;
        }

        /* --- 响应式逻辑：仅在 narrow-layout 激活时生效 --- */

        /* 顶栏左侧：只留第一个入口 (通常是主站/直播) */
        .narrow-layout .bili-header__bar .left-entry .v-popover-wrap:not(:first-child) {
            display: none !important;
        }

        /* 顶栏右侧：只留头像，删除其它 li 和 div (消息、动态、投稿等) */
        .narrow-layout .bili-header__bar .right-entry > * {
            display: none !important;
        }
        .narrow-layout .bili-header__bar .right-entry > li.header-avatar-wrap {
            display: block !important;
        }

        /* 侧边栏/评论区布局重组 */
        .narrow-layout .right-container {
            display: none !important;
            width: 0 !important;
            flex: none !important;
            margin: 0 !important;
        }
        .narrow-layout .left-container {
            width: 100% !important;
            flex: 1 !important;
            padding-right: 0 !important;
        }
        .narrow-layout #commentapp > *:not(.right-container-inner) {
            display: none !important;
        }
        .narrow-layout #commentapp .right-container-inner {
            display: block !important;
            width: 100% !important;
            position: static !important;
        }
    `);

    const threshold = 1000;
    let originalParent = null;
    let isProcessing = false;

    // 2. 核心逻辑：类名切换与 DOM 移动
    function adaptLayout() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            const commentApp = document.getElementById('commentapp');
            const targetElement = document.querySelector('.right-container-inner');

            if (window.innerWidth < threshold) {
                // 进入窄屏模式
                if (!document.body.classList.contains('narrow-layout')) {
                    document.body.classList.add('narrow-layout');
                }

                // 确保在页面资源加载完成后移动元素，防止图片丢失
                if (commentApp && targetElement) {
                    if (!originalParent) originalParent = targetElement.parentNode;
                    if (targetElement.parentNode !== commentApp) {
                        commentApp.appendChild(targetElement);
                    }
                }
            } else {
                // 回归正常模式
                if (document.body.classList.contains('narrow-layout')) {
                    document.body.classList.remove('narrow-layout');
                }

                // 还原元素位置
                if (commentApp && targetElement && originalParent) {
                    if (targetElement.parentNode !== originalParent) {
                        originalParent.appendChild(targetElement);
                    }
                }
            }
        } finally {
            isProcessing = false;
        }
    }

    // 3. 运行控制：严格在资源就绪后执行，并维持持续观察
    const startScript = () => {
        // 延迟执行以避开 B 站初始化的 LazyLoad 冲突
        setTimeout(() => {
            adaptLayout();

            // 监听窗口缩放
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(adaptLayout, 150);
            });

            // 持续观察 DOM 变化，应对 B 站异步刷新
            const observer = new MutationObserver(adaptLayout);
            observer.observe(document.body, { childList: true, subtree: true });
        }, 800);
    };

    // 配合 @run-at document-body，确保在合适时机启动
    if (document.readyState === 'complete') {
        startScript();
    } else {
        window.addEventListener('load', startScript);
    }

})();