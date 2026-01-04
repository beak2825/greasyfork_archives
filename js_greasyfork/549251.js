// ==UserScript==
// @name         Middle Click Scroll
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  单击中键激活/关闭滚动。激活后，页面会根据鼠标与初始点的距离和方向持续自动滚动。
// @description:en Click middle mouse button to toggle scroll mode. Once active, the page continuously scrolls based on the mouse's distance and direction from the initial point.
// @author       Xy2002
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549251/Middle%20Click%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/549251/Middle%20Click%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** @type {boolean} - 标记滚动模式是否激活 */
    let isScrollModeActive = false;

    /** @type {number} - 激活模式时鼠标的初始Y坐标 */
    let startY = 0;

    /** @type {number} - 当前需要持续滚动的量 */
    let scrollAmount = 0;

    /** @type {number | null} - 用于存储 requestAnimationFrame 的 ID */
    let animationFrameId = null;

    /** @type {number} - 灵敏度/速度因子，可以调整这个值来改变滚动的快慢 */
    const SENSITIVITY_FACTOR = 0.15;

    // --- 创建并注入视觉指示器的样式 ---
    GM_addStyle(`
        #mmb-scroll-indicator {
            position: fixed;
            width: 32px;
            height: 32px;
            background-color: rgba(0, 0, 0, 0.5);
            border: 2px solid white;
            border-radius: 50%;
            z-index: 99999999;
            pointer-events: none; /* 让鼠标事件可以穿透这个元素 */
            display: none; /* 默认隐藏 */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>');
            background-size: 80%;
            background-repeat: no-repeat;
            background-position: center;
        }
    `);

    // --- 创建视觉指示器元素 ---
    const indicator = document.createElement('div');
    indicator.id = 'mmb-scroll-indicator';
    document.body.appendChild(indicator);

    /**
     * 持续滚动的核心函数
     */
    const performScroll = () => {
        if (!isScrollModeActive) {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            return;
        }
        if (scrollAmount !== 0) {
            window.scrollBy(0, scrollAmount);
        }
        animationFrameId = requestAnimationFrame(performScroll);
    };

    // --- 新增：激活滚动模式的函数 ---
    const activateScrollMode = (e) => {
        isScrollModeActive = true;
        startY = e.clientY;
        document.body.style.cursor = 'all-scroll';

        indicator.style.left = `${e.clientX - 16}px`;
        indicator.style.top = `${e.clientY - 16}px`;
        indicator.style.display = 'block';

        // 启动滚动循环
        performScroll();
    };

    // --- 新增：封装了退出滚动模式的逻辑，方便复用 ---
    const deactivateScrollMode = () => {
        isScrollModeActive = false;
        document.body.style.cursor = 'default';
        indicator.style.display = 'none';
        scrollAmount = 0; // 重置滚动量
        // 循环会在下一次 performScroll 检查时自动停止
    };

    /**
     * 鼠标点击事件处理，用于切换或退出模式
     * @param {MouseEvent} e
     */
    const handleMouseDown = (e) => {
        // e.button === 0 -> 左键
        // e.button === 1 -> 中键
        // e.button === 2 -> 右键

        // 如果是中键点击，则切换滚动模式
        if (e.button === 1) {
            e.preventDefault(); // 阻止中键点击的默认行为 (例如在链接上点击会新建标签页)
            if (isScrollModeActive) {
                deactivateScrollMode();
            } else {
                activateScrollMode(e);
            }
            return; // 处理完毕，直接返回
        }

        // ---【核心修改】---
        // 如果当前是滚动模式，并且点击的是左键或右键，则退出滚动模式
        if (isScrollModeActive && (e.button === 0 || e.button === 2)) {
            e.preventDefault(); // 阻止默认行为，如右键菜单或拖拽选中文本
            deactivateScrollMode();
        }
    };

    /**
     * 鼠标移动事件处理，仅用于更新滚动速度和方向
     * @param {MouseEvent} e
     */
    const handleMouseMove = (e) => {
        if (!isScrollModeActive) return;

        const currentY = e.clientY;
        const deltaY = currentY - startY;

        scrollAmount = deltaY * SENSITIVITY_FACTOR;
    };

    // 绑定事件监听器 (将 handleMiddleClick 重命名为更通用的 handleMouseDown)
    window.addEventListener('mousedown', handleMouseDown, true); // 使用捕获阶段以优先处理
    window.addEventListener('mousemove', handleMouseMove, false);

})();