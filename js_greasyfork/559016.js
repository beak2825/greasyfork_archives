// ==UserScript==
// @name         BiliTimer
// @namespace    https://github.com/RevenLiu
// @version      1.0.0
// @description  一个用于Bilibili平台的篡改猴脚本，为B站视频添加定时暂停功能。
// @author       RevenLiu
// @license      MIT
// @icon         https://raw.githubusercontent.com/RevenLiu/BiliTimer/main/Icon.png
// @match        https://www.bilibili.com/video/*
// @homepage     https://github.com/RevenLiu/BiliTimer
// @supportURL   https://github.com/RevenLiu/BiliTimer/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559016/BiliTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/559016/BiliTimer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let countdownTimer = null;
    let remainingSeconds = 0;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .timer-button {
            position: relative;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-right: 8px;
            margin-left: 6px;
            padding: 5px 14px 8px 12px;
            border-radius: 8px;
            background: var(--graph_bg_thin, #f1f2f3);
            transition: background-color 0.3s;
            color: var(--text1, #18191c);
            cursor: pointer;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            user-select: none;
            border: none;
            outline: none;
        }

        .timer-button:hover {
            background: rgb(227, 229, 231);
        }

        .timer-button .timer-icon {
            margin-right: 6px;
            font-size: 16px;
            display: inline-block;
        }

        .timer-button.active {
            color: rgb(0, 174, 236);
        }

        .timer-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .timer-modal {
            background: white;
            border-radius: 12px;
            padding: 24px;
            width: 400px;
            max-width: 90vw;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .timer-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #18191c;
            margin-bottom: 20px;
        }

        .timer-input-group {
            margin-bottom: 16px;
        }

        .timer-input-row {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }

        .timer-input-wrapper {
            flex: 1;
        }

        .timer-input-label {
            display: block;
            font-size: 13px;
            color: #61666d;
            margin-bottom: 6px;
        }

        .timer-input {
            width: 100%;
            height: 40px;
            padding: 0 12px;
            border: 1px solid #e3e5e7;
            border-radius: 6px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
        }

        .timer-input:focus {
            outline: none;
            border-color: rgb(0,174,236);
            box-shadow: 0 0 0 3px rgba(0,174,236,0.1);
        }

        .timer-quick-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 20px;
        }

        .timer-quick-btn {
            padding: 6px 12px;
            border: 1px solid #e3e5e7;
            border-radius: 6px;
            background: white;
            color: #61666d;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
        }

        .timer-quick-btn:hover {
            border-color: rgb(0,174,236);
            color: rgb(0,174,236);
            background: rgba(0,174,236,0.05);
        }

        .timer-modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .timer-modal-btn {
            padding: 0 20px;
            height: 36px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .timer-modal-btn.cancel {
            background: #f1f2f3;
            color: #18191c;
        }

        .timer-modal-btn.cancel:hover {
            background: #e3e5e7;
        }

        .timer-modal-btn.confirm {
            background: rgb(0,174,236);
            color: white;
        }

        .timer-modal-btn.confirm:hover {
            background: rgb(0,154,216);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,174,236,0.3);
        }

        .timer-modal-btn.stop {
            background: #ff6b81;
            color: white;
        }

        .timer-modal-btn.stop:hover {
            background: #ff4757;
        }
    `;
    document.head.appendChild(style);

    // 创建按钮
    function createTimerButton() {
        // 防止重复创建
        if (document.querySelector('.timer-button')) {
            return;
        }

        const toolbar = document.querySelector('.video-toolbar-left');
        if (!toolbar) {
            return;
        }

        const button = document.createElement('div');
        button.className = 'timer-button';
        button.innerHTML = '<span class="timer-icon">⏰</span><span>定时关闭</span>';
        button.addEventListener('click', showModal);

        toolbar.appendChild(button);
    }

    // 显示模态框
    function showModal() {
        const overlay = document.createElement('div');
        overlay.className = 'timer-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'timer-modal';

        const isActive = countdownTimer !== null;

        modal.innerHTML = `
            <div class="timer-modal-title">${isActive ? '定时关闭运行中' : '设置定时关闭'}</div>
            ${isActive ? `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 32px; font-weight: 600; color: rgb(0,174,236);">
                        ${formatTime(remainingSeconds)}
                    </div>
                    <div style="color: #61666d; margin-top: 8px; font-size: 14px;">
                        视频将在倒计时结束后暂停
                    </div>
                </div>
                <div class="timer-modal-buttons">
                    <button class="timer-modal-btn cancel">关闭</button>
                    <button class="timer-modal-btn stop">停止定时</button>
                </div>
            ` : `
                <div class="timer-input-group">
                    <div class="timer-input-row">
                        <div class="timer-input-wrapper">
                            <label class="timer-input-label">小时</label>
                            <input type="number" class="timer-input" id="timer-hours" min="0" max="23" value="0" placeholder="0">
                        </div>
                        <div class="timer-input-wrapper">
                            <label class="timer-input-label">分钟</label>
                            <input type="number" class="timer-input" id="timer-minutes" min="0" max="59" value="0" placeholder="0">
                        </div>
                        <div class="timer-input-wrapper">
                            <label class="timer-input-label">秒</label>
                            <input type="number" class="timer-input" id="timer-seconds" min="0" max="59" value="0" placeholder="0">
                        </div>
                    </div>
                </div>
                <div class="timer-quick-buttons">
                    <button class="timer-quick-btn" data-seconds="300">5分钟</button>
                    <button class="timer-quick-btn" data-seconds="600">10分钟</button>
                    <button class="timer-quick-btn" data-seconds="900">15分钟</button>
                    <button class="timer-quick-btn" data-seconds="1800">30分钟</button>
                    <button class="timer-quick-btn" data-seconds="3600">1小时</button>
                    <button class="timer-quick-btn" data-seconds="7200">2小时</button>
                </div>
                <div class="timer-modal-buttons">
                    <button class="timer-modal-btn cancel">取消</button>
                    <button class="timer-modal-btn confirm">确认</button>
                </div>
            `}
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 阻止点击模态框时关闭
        modal.addEventListener('click', (e) => e.stopPropagation());

        // 点击遮罩关闭
        overlay.addEventListener('click', () => {
            overlay.remove();
        });

        if (isActive) {
            // 停止定时
            const stopBtn = modal.querySelector('.stop');
            stopBtn.addEventListener('click', () => {
                stopTimer();
                overlay.remove();
            });

            const cancelBtn = modal.querySelector('.cancel');
            cancelBtn.addEventListener('click', () => {
                overlay.remove();
            });
        } else {
            // 快捷按钮
            modal.querySelectorAll('.timer-quick-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const seconds = parseInt(btn.dataset.seconds);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    const secs = seconds % 60;

                    document.getElementById('timer-hours').value = hours;
                    document.getElementById('timer-minutes').value = minutes;
                    document.getElementById('timer-seconds').value = secs;
                });
            });

            // 确认按钮
            const confirmBtn = modal.querySelector('.confirm');
            confirmBtn.addEventListener('click', () => {
                const hours = parseInt(document.getElementById('timer-hours').value) || 0;
                const minutes = parseInt(document.getElementById('timer-minutes').value) || 0;
                const seconds = parseInt(document.getElementById('timer-seconds').value) || 0;

                const totalSeconds = hours * 3600 + minutes * 60 + seconds;

                if (totalSeconds <= 0) {
                    alert('请设置有效的时间!');
                    return;
                }

                startTimer(totalSeconds);
                overlay.remove();
            });

            // 取消按钮
            const cancelBtn = modal.querySelector('.cancel');
            cancelBtn.addEventListener('click', () => {
                overlay.remove();
            });
        }
    }

    // 格式化时间显示
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}小时`);
        if (m > 0) parts.push(`${m}分钟`);
        if (s > 0 || parts.length === 0) parts.push(`${s}秒`);

        return parts.join(' ');
    }

    // 更新按钮状态
    function updateButtonState() {
        const button = document.querySelector('.timer-button');
        if (!button) return;

        if (countdownTimer !== null) {
            button.classList.add('active');
            button.innerHTML = `<span class="timer-icon">⏰</span><span>${formatTime(remainingSeconds)}</span>`;
        } else {
            button.classList.remove('active');
            button.innerHTML = '<span class="timer-icon">⏰</span><span>定时关闭</span>';
        }
    }

    // 开始定时
    function startTimer(seconds) {
        remainingSeconds = seconds;

        countdownTimer = setInterval(() => {
            remainingSeconds--;
            updateButtonState();

            if (remainingSeconds <= 0) {
                pauseVideo();
                stopTimer();
            }
        }, 1000);

        updateButtonState();
    }

    // 停止定时
    function stopTimer() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
            remainingSeconds = 0;
            updateButtonState();
        }
    }

    // 暂停视频
    function pauseVideo() {
        try {
            const videoWrap = document.querySelector('.bpx-player-video-wrap');
            if (videoWrap && videoWrap.childNodes[0]) {
                videoWrap.childNodes[0].pause();

                // 显示提示
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.85);
                    color: white;
                    padding: 20px 40px;
                    border-radius: 12px;
                    font-size: 16px;
                    z-index: 10001;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
                    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                `;
                notification.textContent = '⏰ 定时时间到，视频已暂停';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }
        } catch (error) {
            console.error('暂停视频失败:', error);
        }
    }

    // 初始化
    function init() {
        const observer = new MutationObserver((mutations, obs) => {
            const biliComments = document.querySelector('bili-comments');
            if (biliComments) {
                createTimerButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 如果已经存在，直接创建
        if (document.querySelector('bili-comments')) {
            createTimerButton();
        }
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();