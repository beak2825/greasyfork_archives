// ==UserScript==
// @name         通用网页视频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在页面左上角添加一个浮窗，通过填写的数值来控制网页上所有视频/音频的播放速度，并拦截 JS 时间引擎以加速 Unity/Canvas 游戏。新增F7暂停/恢复、F5重置、F6加速功能，UI已添加按键提示。
// @author       Gemini
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/557217/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557217/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    let currentSpeed = 1.0;
    let isPaused = false; // 新增：暂停状态

    // --- 时间劫持引擎 (针对 Unity/Canvas/JS 游戏) ---
    // 保存原生方法引用
    const nativeDateNow = Date.now;
    const nativePerformanceNow = performance.now.bind(performance);
    const nativeRequestAnimationFrame = window.requestAnimationFrame;

    // 时间累加器
    let lastRealTime = nativePerformanceNow();
    let virtualTime = lastRealTime;

    // 核心更新逻辑：计算虚拟时间
    function updateVirtualTime() {
        // 暂停状态下不更新虚拟时间
        if (isPaused) {
            return;
        }
        
        const realNow = nativePerformanceNow();
        const dt = realNow - lastRealTime;
        // 如果速度不为1，则应用倍率；否则保持同步防止漂移
        if (currentSpeed !== 1.0) {
            virtualTime += dt * currentSpeed;
        } else {
            virtualTime += dt;
        }
        lastRealTime = realNow;
    }

    // 劫持 performance.now
    // Unity 及其它游戏引擎主要依赖此 API 计算 deltaTime
    Object.defineProperty(performance, 'now', {
        value: function() {
            updateVirtualTime();
            return virtualTime;
        },
        configurable: true,
        writable: true
    });

    // 劫持 Date.now
    // 部分老旧逻辑或服务器同步可能用到
    Date.now = function() {
        updateVirtualTime();
        // 基准时间 + 虚拟流逝时间
        return Math.floor(nativeDateNow() + (virtualTime - nativePerformanceNow()));
    };

    // 劫持 requestAnimationFrame
    // 确保回调函数接收到的 timestamp 参数也是加速后的
    window.requestAnimationFrame = function(callback) {
        return nativeRequestAnimationFrame(function(timestamp) {
            updateVirtualTime();
            // 将虚拟时间传递给回调
            callback(virtualTime);
        });
    };

    // --- 新增功能：时间控制 ---
    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            // 暂停时，保持虚拟时间不变
            lastRealTime = nativePerformanceNow();
            statusMsg.innerText = `已暂停 (JS+媒体)`;
            statusMsg.style.color = '#FF9800';
        } else {
            // 恢复时，重置基准时间
            lastRealTime = nativePerformanceNow();
            virtualTime = nativePerformanceNow();
            statusMsg.innerText = `当前: ${currentSpeed}x (JS+媒体)`;
            statusMsg.style.color = '#81C784';
        }
    }

    function resetTime() {
        isPaused = false;
        lastRealTime = nativePerformanceNow();
        virtualTime = nativePerformanceNow();
        currentSpeed = 1.0;
        speedInput.value = 1.0;
        applyMediaSpeed(1.0);
        statusMsg.innerText = '已重置 (1.0x)';
        statusMsg.style.color = '#aaa';
    }

    function increaseTime() {
        if (isPaused) {
            return;
        }
        currentSpeed *= 5;
        if (currentSpeed > 100) currentSpeed = 100; // 防止过大
        speedInput.value = currentSpeed;
        applyMediaSpeed(currentSpeed);
        statusMsg.innerText = `当前: ${currentSpeed}x (JS+媒体)`;
        statusMsg.style.color = '#81C784';
    }

    // --- UI 界面构建 (等待 DOM 就绪) ---
    function initUI() {
        // 创建 UI 界面
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2147483647; /* 确保最高层级 */
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 5px;
            transition: opacity 0.3s;
            opacity: 0.3;
            pointer-events: auto;
        `;

        panel.onmouseenter = () => { panel.style.opacity = '1'; };
        panel.onmouseleave = () => { panel.style.opacity = '0.3'; };

        const title = document.createElement('div');
        title.innerText = '⚡ 全局加速';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.gap = '5px';

        const speedInput = document.createElement('input');
        speedInput.type = 'number';
        speedInput.value = currentSpeed;
        speedInput.step = 0.1;
        speedInput.style.width = '60px';
        speedInput.style.padding = '4px';
        speedInput.style.borderRadius = '4px';
        speedInput.style.border = 'none';
        speedInput.style.color = '#333';

        const setBtn = document.createElement('button');
        setBtn.innerText = '应用';
        setBtn.style.padding = '4px 8px';
        setBtn.style.cursor = 'pointer';
        setBtn.style.backgroundColor = '#4CAF50';
        setBtn.style.color = 'white';
        setBtn.style.border = 'none';
        setBtn.style.borderRadius = '4px';

        const resetBtn = document.createElement('button');
        resetBtn.innerText = '重置';
        resetBtn.style.padding = '4px 8px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.backgroundColor = '#f44336';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.marginTop = '5px';

        const statusMsg = document.createElement('div');
        statusMsg.style.fontSize = '12px';
        statusMsg.style.color = '#aaa';
        statusMsg.style.marginTop = '5px';
        statusMsg.innerText = '当前: 1.0x';

        // 新增按键提示
        const keyHint = document.createElement('div');
        keyHint.style.fontSize = '10px';
        keyHint.style.color = '#aaa';
        keyHint.style.marginTop = '2px';
        keyHint.innerText = 'F7: 暂停/恢复 | F5: 重置 | F6: 5倍加速';

        inputContainer.appendChild(speedInput);
        inputContainer.appendChild(setBtn);
        panel.appendChild(title);
        panel.appendChild(inputContainer);
        panel.appendChild(resetBtn);
        panel.appendChild(statusMsg);
        panel.appendChild(keyHint); // 添加按键提示
        document.body.appendChild(panel);

        // --- 逻辑绑定 ---

        function applyMediaSpeed(speed) {
            // 针对传统 <video> 和 <audio>
            const mediaElements = document.querySelectorAll('video, audio');
            let count = 0;
            mediaElements.forEach(media => {
                media.playbackRate = speed;
                count++;
            });
            return count;
        }

        function updateSpeed() {
            const val = parseFloat(speedInput.value);
            if (!isNaN(val) && val > 0) {
                // 更新全局倍速变量 (影响 JS/Unity)
                // 重置基准时间，防止跳变过大
                updateVirtualTime();
                currentSpeed = val;

                // 应用到媒体标签
                const count = applyMediaSpeed(currentSpeed);

                statusMsg.innerText = `当前: ${currentSpeed}x (JS+媒体)`;
                statusMsg.style.color = '#81C784';
            } else {
                alert("请输入有效的数字！");
            }
        }

        setBtn.onclick = updateSpeed;
        speedInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') updateSpeed();
        });

        resetBtn.onclick = () => {
            updateVirtualTime();
            currentSpeed = 1.0;
            speedInput.value = 1.0;
            applyMediaSpeed(1.0);
            statusMsg.innerText = '当前: 1.0x';
            statusMsg.style.color = '#aaa';
        };

        // --- 新增功能：键盘控制 ---
        document.addEventListener('keydown', function(event) {
            if (event.key === 'F7') {
                event.preventDefault();
                togglePause();
            } else if (event.key === 'F5') {
                event.preventDefault();
                resetTime();
            } else if (event.key === 'F6') {
                event.preventDefault();
                increaseTime();
            }
        });

        // 自动维护循环 (媒体标签)
        setInterval(() => {
            if (currentSpeed !== 1.0) {
                applyMediaSpeed(currentSpeed);
            }
        }, 1000);
    }

    // --- 初始化 ---
    // 尽可能早地劫持时间，但 UI 需要等待 body 加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();