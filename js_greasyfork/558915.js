// ==UserScript==
// @name         悬停滚动页面
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  极简、自动隐藏的悬浮滚动条。平时半透明隐身，鼠标靠近时展开。减少对滚轮的使用，可以调节上下滚动的速度。对刷信息流和看长文有很大的帮助。
// @author       
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558915/%E6%82%AC%E5%81%9C%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558915/%E6%82%AC%E5%81%9C%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置参数 ---
    let scrollSpeed = 5; // 初始滚动速度
    let animationFrameId = null;
    let hideTimer = null; // 用于控制自动隐藏的计时器

    // --- 样式设计 (CSS) ---
    const css = `
        #flow-scroll-ghost {
            position: fixed;
            right: 0; /* 贴紧屏幕右侧 */
            top: 50%;
            transform: translateY(-50%) translateX(60%); /* 默认隐藏大部分在屏幕外，只露一点边 */
            width: 40px; /* 变窄 */
            height: 200px;
            background: rgba(255, 255, 255, 0.15); /* 极低透明度 */
            backdrop-filter: blur(2px); /* 轻微模糊 */
            -webkit-backdrop-filter: blur(2px);
            border-radius: 20px 0 0 20px; /* 左圆角，右直角 */
            box-shadow: none;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            z-index: 99999;
            opacity: 0.2; /* 默认非常暗 */
            /* 关键动画：离开时延迟1秒执行，缓慢褪色 */
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) 1s;
            overflow: hidden;
            font-family: sans-serif;
            user-select: none;
            cursor: pointer;
        }

        /* 鼠标悬停 / 激活状态 */
        #flow-scroll-ghost:hover,
        #flow-scroll-ghost.fs-active {
            transform: translateY(-50%) translateX(0); /* 归位 */
            width: 50px; /* 恢复宽度 */
            opacity: 1; /* 完全不透明 */
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            /* 进入时无延迟，瞬间响应 */
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s;
        }

        /* 暗色模式适配 */
        @media (prefers-color-scheme: dark) {
            #flow-scroll-ghost {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            #flow-scroll-ghost:hover,
            #flow-scroll-ghost.fs-active {
                background: rgba(30, 30, 30, 0.85);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0.4);
            }
            .fs-arrow { color: rgba(255,255,255,0.7) !important; }
        }

        /* 滚动区域 */
        .fs-scroll-zone {
            width: 100%;
            height: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* 箭头 - 默认隐藏，悬停时出现 */
        .fs-arrow {
            font-size: 18px;
            color: #333;
            opacity: 0; /* 平时看不见箭头，保持极简 */
            transition: opacity 0.3s;
        }
        #flow-scroll-ghost:hover .fs-arrow {
            opacity: 0.8;
        }

        /* 中间速度条 */
        .fs-controls {
            height: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        #flow-scroll-ghost:hover .fs-controls {
            opacity: 1;
        }

        /* 极简滑块 */
        input[type=range].fs-slider {
            -webkit-appearance: none;
            width: 40px;
            height: 4px;
            background: transparent;
            transform: rotate(-90deg);
            cursor: grab;
        }
        input[type=range].fs-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #888;
            margin-top: -3px;
        }
        input[type=range].fs-slider:hover::-webkit-slider-thumb {
            background: #007aff;
        }
    `;

    GM_addStyle(css);

    // --- DOM 结构 ---
    const container = document.createElement('div');
    container.id = 'flow-scroll-ghost';
    container.innerHTML = `
        <div class="fs-scroll-zone" id="fs-up">
            <div class="fs-arrow">▲</div>
        </div>
        <div class="fs-controls">
            <input type="range" min="1" max="30" value="${scrollSpeed}" class="fs-slider" id="fs-speed-slider" title="调速">
        </div>
        <div class="fs-scroll-zone" id="fs-down">
            <div class="fs-arrow">▼</div>
        </div>
    `;

    document.body.appendChild(container);

    // --- 逻辑功能 ---

    const upZone = document.getElementById('fs-up');
    const downZone = document.getElementById('fs-down');
    const speedSlider = document.getElementById('fs-speed-slider');

    // 滚动功能
    function startScroll(direction) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        // 只要开始滚动，就保持激活状态（防止滚动时意外触发mouseleave导致消失）
        container.classList.add('fs-active');

        function animate() {
            window.scrollBy(0, direction * scrollSpeed);
            animationFrameId = requestAnimationFrame(animate);
        }
        animate();
    }

    function stopScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // 停止滚动后，移除强制激活类，让CSS的延时过渡接管
        container.classList.remove('fs-active');
    }

    // 事件监听
    upZone.addEventListener('mouseenter', () => startScroll(-1));
    upZone.addEventListener('mouseleave', stopScroll);

    downZone.addEventListener('mouseenter', () => startScroll(1));
    downZone.addEventListener('mouseleave', stopScroll);

    // 速度调整
    speedSlider.addEventListener('input', (e) => {
        scrollSpeed = parseInt(e.target.value, 10);
    });
    // 防止滑块交互时触发其他事件
    speedSlider.addEventListener('mousedown', () => container.classList.add('fs-active'));
    speedSlider.addEventListener('mouseup', () => container.classList.remove('fs-active'));

})();