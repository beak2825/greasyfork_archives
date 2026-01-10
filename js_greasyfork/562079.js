// ==UserScript==
// @name         调整粉笔窗口宽度
// @namespace    https://github.com/furtherun/fenbi-resizer
// @version      0.1.0
// @description  解决宽屏看题的痛苦，让粉笔练习/解析页面支持宽度调整，左右两边都可以拖拽调整
// @author       furtherun
// @match        https://*.fenbi.com/*
// @grant        none
// @homepageURL  https://github.com/furtherun/fenbi-resizer
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562079/%E8%B0%83%E6%95%B4%E7%B2%89%E7%AC%94%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/562079/%E8%B0%83%E6%95%B4%E7%B2%89%E7%AC%94%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const CONFIGS = [
        {
            selector: '.solution-main', // 解析页面
            storageKey: 'fenbi-width-solution-main',
        },
        {
            selector: '.exercise-main', // 练习页面
            storageKey: 'fenbi-width-exercise-main',
        },
    ];

    const MIN_WIDTH = 420;
    const STYLE_ID = 'fenbi-resizer-style';

    function init() {
        CONFIGS.forEach(makeResizable);
    }

    function makeResizable({ selector, storageKey }) {
        const target = document.querySelector(selector);
        if (!target) return;

        if (target.dataset.resizableInit) return;
        target.dataset.resizableInit = 'true';

        target.style.position = 'relative';
        target.style.flex = 'none'; // 禁止 flex 自动伸缩

        const maxWidth = target.offsetWidth; // 获取当前面板最大宽度

        applyInitialWidth(target, maxWidth, storageKey);

        // 创建左右两侧的拖拽条
        createResizer(target, 'left', maxWidth, storageKey);
        createResizer(target, 'right', maxWidth, storageKey);

        injectGlobalStyle();
    }

    /**
     * 应用初始宽度：优先恢复存储的宽度，否则根据屏幕大小计算
     */
    function applyInitialWidth(target, maxWidth, storageKey) {
        const saved = parseInt(localStorage.getItem(storageKey), 10);

        if (saved && saved <= maxWidth) {
            target.style.width = saved + 'px';
            return;
        }

        const initial = computeAdaptiveWidth(maxWidth);
        target.style.width = initial + 'px';
    }

    /**
     * 根据屏幕宽度计算自适应初始宽度
     */
    function computeAdaptiveWidth(maxWidth) {
        const vw = window.innerWidth;
        let width;

        if (vw < 1366) {
            width = vw * 0.9;
        } else if (vw < 1600) {
            width = vw * 0.6;
        } else if (vw < 1920) {
            width = vw * 0.55;
        } else {
            width = vw * 0.5;
        }

        return Math.max(MIN_WIDTH, Math.min(maxWidth, Math.round(width)));
    }

    /**
     * 创建拖拽条（左右两侧）
     */
    function createResizer(target, side, maxWidth, storageKey) {
        const resizer = document.createElement('div');
        resizer.className = `fenbi-resizer fenbi-resizer-${side}`;
        target.appendChild(resizer);

        resizer.addEventListener('mousedown', (event) => {
            event.preventDefault();

            const startX = event.clientX; // 鼠标初始位置
            const startWidth = target.offsetWidth; // 面板初始宽度

            document.body.style.cursor = 'col-resize'; // 鼠标样式
            document.body.style.userSelect = 'none'; // 禁止文字选中

            // 鼠标移动时调整宽度
            function onMouseMove(e) {
                const delta = e.clientX - startX;
                const nextWidth =
                    side === 'right'
                        ? startWidth + delta
                        : startWidth - delta;

                const clampedWidth = Math.max(
                    MIN_WIDTH,
                    Math.min(maxWidth, nextWidth)
                );

                target.style.width = clampedWidth + 'px';
            }

            // 鼠标释放时保存宽度并清理事件
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                document.body.style.cursor = '';
                document.body.style.userSelect = '';

                localStorage.setItem(storageKey, target.offsetWidth.toString());
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function injectGlobalStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
      .fenbi-resizer {
        position: absolute;
        top: 0;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        background: transparent;
        z-index: 9999;
      }

      .fenbi-resizer:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      .fenbi-resizer-left { left: 0; }
      .fenbi-resizer-right { right: 0; }
    `;
        document.head.appendChild(style);
    }

    /**
     * 监听 DOM 变化，保证单页应用切换时仍能初始化
     */
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });

    init();
})();
