// ==UserScript==
// @name         天翼保活脚本
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防止页面长时间不操作被登出，每1分钟自动保活
// @author       You
// @match        https://203.83.239.166:18443/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563553/%E5%A4%A9%E7%BF%BC%E4%BF%9D%E6%B4%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/563553/%E5%A4%A9%E7%BF%BC%E4%BF%9D%E6%B4%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL = 60 * 1000; // 1分钟
    let keepAliveCount = 0;

    // 创建状态显示元素
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'keepalive-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 128, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            cursor: pointer;
            transition: opacity 0.3s;
        `;
        indicator.title = '点击隐藏/显示';
        document.body.appendChild(indicator);

        // 点击切换显示
        let minimized = false;
        indicator.addEventListener('click', () => {
            minimized = !minimized;
            indicator.style.opacity = minimized ? '0.3' : '1';
        });

        return indicator;
    }

    // 更新状态显示
    function updateStatus(message, isError = false) {
        const indicator = document.getElementById('keepalive-indicator');
        if (indicator) {
            const time = new Date().toLocaleTimeString();
            indicator.textContent = `保活: ${message} (${time}) [${keepAliveCount}次]`;
            indicator.style.background = isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 128, 0, 0.8)';
        }
    }

    // 保活请求
    function keepAlive() {
        keepAliveCount++;

        // 方式1: 发送一个轻量级的HEAD请求到当前页面
        fetch(window.location.href, {
            method: 'HEAD',
            credentials: 'include', // 携带cookie
            cache: 'no-store'
        })
        .then(response => {
            if (response.ok || response.status === 304) {
                updateStatus('成功');
                console.log(`[保活] 第${keepAliveCount}次心跳成功 - ${new Date().toLocaleTimeString()}`);
            } else if (response.status === 401 || response.status === 403) {
                updateStatus('会话已过期', true);
                console.warn(`[保活] 会话可能已过期，状态码: ${response.status}`);
            } else {
                updateStatus(`状态${response.status}`);
            }
        })
        .catch(error => {
            updateStatus('请求失败', true);
            console.error('[保活] 心跳请求失败:', error);
        });

        // 方式2: 模拟用户活动（触发鼠标移动事件）
        try {
            const event = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: Math.random() * 100,
                clientY: Math.random() * 100
            });
            document.dispatchEvent(event);
        } catch (e) {
            // 忽略错误
        }
    }

    // 初始化
    function init() {
        console.log('[保活] 天翼保活脚本已启动，间隔: 1分钟');

        // 创建状态指示器
        if (document.body) {
            createStatusIndicator();
            updateStatus('已启动');
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                createStatusIndicator();
                updateStatus('已启动');
            });
        }

        // 启动定时保活
        setInterval(keepAlive, INTERVAL);

        // 页面可见性变化时也触发保活
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('[保活] 页面重新可见，立即触发保活');
                keepAlive();
            }
        });
    }

    init();
})();
