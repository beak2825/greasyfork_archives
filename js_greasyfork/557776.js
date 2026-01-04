// ==UserScript==
// @name         通用视频控制 (左右箭头快进/空格暂停)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  键盘左右箭头控制快进快退，空格键控制暂停播放，并在右上角显示提示
// @author       gf
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557776/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%20%28%E5%B7%A6%E5%8F%B3%E7%AE%AD%E5%A4%B4%E5%BF%AB%E8%BF%9B%E7%A9%BA%E6%A0%BC%E6%9A%82%E5%81%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557776/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%20%28%E5%B7%A6%E5%8F%B3%E7%AE%AD%E5%A4%B4%E5%BF%AB%E8%BF%9B%E7%A9%BA%E6%A0%BC%E6%9A%82%E5%81%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const STEP = 10; // 快进/快退的秒数
    // ================

    document.addEventListener('keydown', function(e) {
        // 1. 核心判断：如果焦点在输入框、文本域或可编辑区域，完全忽略脚本（防止打字时触发）
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        // 2. 获取页面上的第一个视频元素
        const video = document.querySelector('video');
        if (!video) return; // 没找到视频就不做任何事

        // 3. 按键逻辑处理
        // 注意：e.code === 'Space' 或者 e.key === ' ' 都可以识别空格
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault(); // 阻止默认的网页滚动行为

            if (video.paused) {
                video.play();
                showTip('▶ 继续播放');
            } else {
                video.pause();
                showTip('⏸ 已暂停');
            }
        }
        else if (e.key === 'ArrowRight') {
            e.preventDefault();
            video.currentTime += STEP;
            showTip(`⏩ 快进 ${STEP}s | ${formatTime(video.currentTime)}`);
        }
        else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            video.currentTime -= STEP;
            showTip(`⏪ 后退 ${STEP}s | ${formatTime(video.currentTime)}`);
        }
    });

    // 辅助函数：将秒数转换为 mm:ss 格式
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' + s : s}`;
    }

    // 辅助函数：显示提示框
    function showTip(text) {
        let tip = document.getElementById('tm-video-control-tip');
        // 如果提示框不存在，创建一个新的
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'tm-video-control-tip';
            tip.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2147483647; /* 保证在最顶层 */
                background: rgba(0, 0, 0, 0.75);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 16px;
                font-family: system-ui, -apple-system, sans-serif;
                pointer-events: none; /* 让鼠标可以穿透提示框点击下面的内容 */
                transition: opacity 0.3s ease;
                backdrop-filter: blur(2px);
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(tip);
        }

        // 更新文字并显示
        tip.textContent = text;
        tip.style.opacity = '1';

        // 清除上一次的定时器（防止连续按键时提示框闪烁消失）
        if (window.tmTipTimer) clearTimeout(window.tmTipTimer);

        // 1.5秒后自动消失
        window.tmTipTimer = setTimeout(() => {
            tip.style.opacity = '0';
        }, 1500);
    }
})();