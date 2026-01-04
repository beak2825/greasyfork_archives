// ==UserScript==
// @name B 站播放器速度控制 (Shift+< 和 Shift+>)
// @namespace http://tampermonkey.net/
// @version 1.3
// @description 使用 Shift+<减速和 Shift+> 加速 B 站视频播放速度
// @author 豆包编程助手
// @match https://*.bilibili.com/*/*
// @icon https://www.bilibili.com/favicon.ico
// @grant none

// @downloadURL https://update.greasyfork.org/scripts/548034/B%20%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%20%28Shift%2B%3C%20%E5%92%8C%20Shift%2B%3E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548034/B%20%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%20%28Shift%2B%3C%20%E5%92%8C%20Shift%2B%3E%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 播放速度调整步长
    const SPEED_STEP = 0.25;
    // 最小播放速度
    const MIN_SPEED = 0.25;
    // 最大播放速度
    const MAX_SPEED = 4.0;

    // 获取播放器元素
    function getPlayer() {
        // 标准视频播放器
        let player = document.querySelector('video');
        if (player) return player;
        // 可能的其他播放器选择器
        player = document.querySelector('.bpx-player-video-wrap video');
        if (player) return player;
        return null;
    }

    // 获取播放器容器（用于定位提示）
    function getPlayerContainer() {
        const player = getPlayer();
        if (player) {
            // 尝试获取播放器的直接父容器
            let container = player.parentElement;

            // 如果父容器不是播放器容器，尝试查找更上层的播放器容器
            if (!container.classList.contains('bpx-player-video-wrap') &&
                !container.classList.contains('video-container')) {
                container = document.querySelector('.bpx-player-video-wrap') ||
                           document.querySelector('.video-container') ||
                           container;
            }

            return container;
        }

        // 如果找不到播放器，使用body作为备选
        return document.body;
    }

    // 调整播放速度
    function adjustSpeed(change) {
        const player = getPlayer();
        if (!player) return;
        // 计算新速度
        let newSpeed = player.playbackRate + change;
        // 限制在有效范围内
        newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
        newSpeed = Math.round(newSpeed * 100) / 100; // 保留两位小数
        // 设置新速度
        player.playbackRate = newSpeed;
        // 显示速度变化提示
        showSpeedNotification(newSpeed);
    }

    // 显示速度变化通知（在播放器中央）
    function showSpeedNotification(speed) {
        // 检查是否已有通知元素，有则移除
        let notification = document.getElementById('speed-notification');
        if (notification) {
            notification.remove();
        }

        // 获取播放器容器
        const container = getPlayerContainer();
        // 如果容器是body，使用fixed定位，否则使用absolute定位
        const positionType = container === document.body ? 'fixed' : 'absolute';

        // 创建新通知元素
        notification = document.createElement('div');
        notification.id = 'speed-notification';
        notification.textContent = '播放速度: ' + speed + 'x';
        notification.style.cssText = `
            position: ${positionType};
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 22px;
            font-weight: bold;
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none; /* 防止点击干扰 */
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        `;

        // 添加到容器
        container.appendChild(notification);

        // 2秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => notification.remove(), 300);
        }, 1500);
    }

    // 监听键盘事件
    document.addEventListener('keydown', (e) => {
        // 检查是否按下了 Shift 键
        if (!e.shiftKey) return;

        // Shift+<(小于号) 减速
        if (e.key === '<') {
            e.preventDefault();
            adjustSpeed(-SPEED_STEP);
        }
        // Shift+> (大于号) 加速
        else if (e.key === '>') {
            e.preventDefault();
            adjustSpeed(SPEED_STEP);
        }
    });

    console.log('B 站播放速度控制脚本已加载，使用 Shift+< 减速，Shift+> 加速 ');
})();
