// ==UserScript==
// @name         网页音量增强器 (Volume Master) - 快捷键版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按住 Alt + 上下箭头调节当前网页音量（支持 0-800%），按 Alt + R 重置。不遮挡页面，仅在调节时显示提示。
// @author       shenada
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561347/%E7%BD%91%E9%A1%B5%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8%20%28Volume%20Master%29%20-%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561347/%E7%BD%91%E9%A1%B5%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8%20%28Volume%20Master%29%20-%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止在 iframe 中重复运行
    if (window.top !== window.self) return;

    // --- 1. 音频控制核心 ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 1.0; // 默认 100%

    // 记录当前音量百分比 (100 = 1.0)
    let currentVolume = 100;
    const connectedElements = new WeakSet();

    function connectMediaElements() {
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach(element => {
            if (connectedElements.has(element)) return;
            try {
                element.crossOrigin = "anonymous";
                const source = ctx.createMediaElementSource(element);
                source.connect(gainNode);
                connectedElements.add(element);
            } catch (err) {}
        });
    }

    // 监听新元素
    const observer = new MutationObserver(connectMediaElements);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(connectMediaElements, 2000);

    // --- 2. 暂时性提示框 (OSD) ---
    let toastTimer = null;
    const toast = document.createElement('div');

    // 设置样式：居中、半透明黑底、大文字
    toast.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-size: 24px;
        z-index: 9999999;
        pointer-events: none; /* 让鼠标可以穿透它点击后面的视频 */
        opacity: 0;
        transition: opacity 0.3s;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(toast);

    function showToast(text) {
        toast.innerHTML = text;
        toast.style.opacity = '1';

        // 清除旧定时器，重新倒计时
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 1500); // 1.5秒后消失
    }

    // --- 3. 调整音量逻辑 ---
    function setVolume(change) {
        // 如果 AudioContext 被挂起（浏览器策略），则恢复它
        if (ctx.state === 'suspended') ctx.resume();

        currentVolume += change;

        // 限制范围：0% - 800%
        if (currentVolume < 0) currentVolume = 0;
        if (currentVolume > 800) currentVolume = 800;

        gainNode.gain.value = currentVolume / 100;

        // 显示提示，例如： 🔊 音量: 150%
        const icon = currentVolume === 0 ? '🔇' : (currentVolume > 100 ? '🔊' : '🔉');
        showToast(`${icon} 音量: ${currentVolume}%`);
    }

    function resetVolume() {
        currentVolume = 100;
        gainNode.gain.value = 1.0;
        showToast(`🔄 音量已重置: 100%`);
    }

    // --- 4. 键盘监听 ---
    document.addEventListener('keydown', function(e) {
        // 必须按住 Alt 键 (防止与网页默认滚动冲突)
        if (!e.altKey) return;

        switch(e.code) {
            case 'ArrowUp': // Alt + 上箭头
                e.preventDefault(); // 防止网页滚动
                setVolume(10); // 每次增加 10%
                break;
            case 'ArrowDown': // Alt + 下箭头
                e.preventDefault();
                setVolume(-10); // 每次减少 10%
                break;
            case 'KeyR': // Alt + R
                e.preventDefault();
                resetVolume();
                break;
        }
    });

    // 初始化连接
    setTimeout(connectMediaElements, 500);
})();