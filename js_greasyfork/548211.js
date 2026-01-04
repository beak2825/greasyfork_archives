// ==UserScript==
// @name         TikTok Playback Speed Controller
// @name:zh-CN   抖音/TikTok 播放速度控制器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a persistent playback speed controller to the TikTok website. The selected speed is saved and applied to all videos automatically.
// @description:zh-CN 在 TikTok 网站上添加一个持久的播放速度控制器。所选速度将被保存并自动应用于所有视频。
// @author       Gemini
// @match        https://www.tiktok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548211/TikTok%20Playback%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/548211/TikTok%20Playback%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const SPEED_OPTIONS = [1.0, 1.25, 1.5, 2.0, 2.5, 3.0]; // 可用的速度选项
    const DEFAULT_SPEED = 1.0; // 默认速度

    // --- 脚本核心逻辑 ---

    // 1. 获取已保存的速度或使用默认值
    let currentSpeed = GM_getValue('tiktok-playback-speed', DEFAULT_SPEED);

    /**
     * 将指定速度应用到页面上所有 <video> 元素
     * @param {number} speed - 播放速度
     */
    function applySpeedToVideos(speed) {
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (video.playbackRate !== speed) {
                video.playbackRate = speed;
            }
        });
    }

    /**
     * 创建并注入UI控件
     */
    function createControllerUI() {
        // --- 创建面板容器 ---
        const panel = document.createElement('div');
        panel.id = 'tiktok-speed-controller-panel';
        panel.innerHTML = `<div id="tsc-header">播放速度</div>`;

        // --- 创建速度按钮 ---
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'tsc-buttons';
        panel.appendChild(buttonsContainer);

        SPEED_OPTIONS.forEach(speed => {
            const button = document.createElement('button');
            button.innerText = `${speed}x`;
            button.dataset.speed = speed;
            if (speed === currentSpeed) {
                button.classList.add('active');
            }
            button.addEventListener('click', handleSpeedChange);
            buttonsContainer.appendChild(button);
        });

        document.body.appendChild(panel);
        injectStyles();
        makeDraggable(panel);
    }

    /**
     * 处理速度变更事件
     * @param {Event} event - 点击事件对象
     */
    function handleSpeedChange(event) {
        const newSpeed = parseFloat(event.target.dataset.speed);
        if (currentSpeed !== newSpeed) {
            currentSpeed = newSpeed;
            GM_setValue('tiktok-playback-speed', newSpeed); // 保存新速度
            applySpeedToVideos(newSpeed);
            updateActiveButton(newSpeed);
        }
    }

    /**
     * 更新UI，高亮当前激活的速度按钮
     * @param {number} activeSpeed - 当前激活的速度
     */
    function updateActiveButton(activeSpeed) {
        const buttons = document.querySelectorAll('#tsc-buttons button');
        buttons.forEach(btn => {
            if (parseFloat(btn.dataset.speed) === activeSpeed) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * 注入CSS样式
     */
    function injectStyles() {
        const styles = `
            #tiktok-speed-controller-panel {
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: rgba(22, 24, 35, 0.85);
                color: white;
                border-radius: 8px;
                padding: 10px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            #tsc-header {
                font-weight: 600;
                text-align: center;
                margin-bottom: 8px;
                cursor: move; /* 添加拖动光标 */
                user-select: none;
            }
            #tsc-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 6px;
            }
            #tsc-buttons button {
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                padding: 5px 8px;
                cursor: pointer;
                transition: background-color 0.2s, transform 0.1s;
                font-size: 12px;
            }
            #tsc-buttons button:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            #tsc-buttons button:active {
                transform: scale(0.95);
            }
            #tsc-buttons button.active {
                background-color: #fe2c55; /* TikTok 主题色 */
                border-color: #fe2c55;
                font-weight: bold;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * 使元素可拖动 (已优化)
     * @param {HTMLElement} element - 需要拖动的面板元素
     */
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('tsc-header');

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();

            // --- 优化开始 ---
            // 在开始拖动前，获取当前元素的精确位置，并将定位方式从 'right' 切换到 'left'
            // 这样可以避免在拖动过程中 'left' 和 'right' 属性发生冲突
            const rect = element.getBoundingClientRect();
            element.style.top = rect.top + 'px';
            element.style.left = rect.left + 'px';
            element.style.right = 'auto';
            // --- 优化结束 ---

            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 因为现在 top 和 left 属性已被明确设置，所以可以安全地进行计算
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- 启动与监听 ---

    // 使用 MutationObserver 监听新视频的加载
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 // 当有新节点添加时，延迟一小段时间后应用速度，确保video元素已准备好
                setTimeout(() => applySpeedToVideos(currentSpeed), 200);
                return;
            }
        }
    });

    // 等待页面加载完成后开始执行
    window.addEventListener('load', () => {
        createControllerUI();
        applySpeedToVideos(currentSpeed); // 对初始视频应用速度

        // 监视整个文档的变化，以捕获动态加载的视频
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, false);

})();
