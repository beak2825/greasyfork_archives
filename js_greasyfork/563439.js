// ==UserScript==
// @name         Bilibili 长按倍速 (可拖动 & 菜单设置)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在视频左侧添加一个可拖动的悬浮按钮，长按时加速，松开恢复。倍速速率请在油猴菜单中设置。
// @author       
// @license MIT
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/festival/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563439/Bilibili%20%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%20%20%E8%8F%9C%E5%8D%95%E8%AE%BE%E7%BD%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563439/Bilibili%20%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F%20%28%E5%8F%AF%E6%8B%96%E5%8A%A8%20%20%E8%8F%9C%E5%8D%95%E8%AE%BE%E7%BD%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置常量 ---
    const BUTTON_ID = 'bili-drag-speed-btn';
    const SPEED_KEY = 'bili_hold_speed_target_v3';
    const POS_X_KEY = 'bili_hold_speed_btn_x_v3';
    const POS_Y_KEY = 'bili_hold_speed_btn_y_v3';
    const LOCK_KEY = 'bili_hold_speed_btn_lock_v3';

    let videoElement = null;
    let originalRate = 1.0;
    let isSpeeding = false;

    // --- 菜单设置 ---
    GM_registerMenuCommand('⚙️ 设置长按倍速', () => {
        const currentSpeed = GM_getValue(SPEED_KEY, 3.0);
        const newSpeedStr = prompt('请输入长按时要达到的视频倍速:', currentSpeed);
        if (newSpeedStr) {
            const newSpeed = parseFloat(newSpeedStr);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                GM_setValue(SPEED_KEY, newSpeed);
                alert(`倍速已保存: ${newSpeed}x`);
            } else {
                alert('输入无效，请输入有效的数字。');
            }
        }
    });

    GM_registerMenuCommand('🔒 锁定/解锁 按钮位置', () => {
        const isLocked = GM_getValue(LOCK_KEY, false);
        GM_setValue(LOCK_KEY, !isLocked);
        alert(isLocked ? '按钮位置已解锁，可以拖动了。' : '按钮位置已锁定，无法拖动。');
    });

    // --- 核心功能函数 ---
    const getVideo = () => document.querySelector('video') || document.querySelector('bwp-video');

    const startSpeed = (btn) => {
        videoElement = getVideo();
        if (!videoElement) return;
        if (!isSpeeding) {
            originalRate = videoElement.playbackRate;
            isSpeeding = true;
        }
        const targetSpeed = GM_getValue(SPEED_KEY, 3.0);
        videoElement.playbackRate = targetSpeed;
        btn.textContent = `${targetSpeed}x`;
        btn.style.background = '#fb7299'; // 粉色
        btn.style.transform = 'scale(1.1)';
    };

    const stopSpeed = (btn) => {
        if (isSpeeding && videoElement) {
            videoElement.playbackRate = originalRate;
            isSpeeding = false;
        }
        btn.textContent = '⚡';
        btn.style.background = '#00aeec'; // 蓝色
        btn.style.transform = 'scale(1)';
    };

    // --- UI 创建与交互逻辑 ---
    const initUI = () => {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = '⚡';

        Object.assign(btn.style, {
            position: 'fixed',
            top: GM_getValue(POS_Y_KEY, '250px'),
            left: GM_getValue(POS_X_KEY, '10px'),
            zIndex: '2147483647',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#00aeec',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            userSelect: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'background 0.2s, transform 0.1s'
        });

        // --- 统一的鼠标按下处理 ---
        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 仅左键
            e.preventDefault();

            // 1. 无论是否锁定，按下立即加速
            startSpeed(btn);

            // 2. 获取当前是否锁定
            const isLocked = GM_getValue(LOCK_KEY, false);

            // --- 准备拖拽变量 ---
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = btn.getBoundingClientRect();
            const shiftX = startX - rect.left;
            const shiftY = startY - rect.top;
            let hasMoved = false;

            // --- 定义鼠标移动事件 (仅在未锁定时生效) ---
            const onMouseMove = (moveEvent) => {
                const moveX = moveEvent.clientX;
                const moveY = moveEvent.clientY;
                const dist = Math.sqrt(Math.pow(moveX - startX, 2) + Math.pow(moveY - startY, 2));

                // 防抖: 移动 > 5px 才更新位置
                if (dist > 5 || hasMoved) {
                    hasMoved = true;
                    btn.style.transition = 'background 0.2s'; // 移除 transform 动画以流畅拖拽
                    btn.style.left = (moveX - shiftX) + 'px';
                    btn.style.top = (moveY - shiftY) + 'px';
                }
            };

            // --- 定义鼠标松开事件 (无论锁定与否都要执行) ---
            const onMouseUp = () => {
                // 停止加速
                stopSpeed(btn);

                // 恢复过渡动画
                btn.style.transition = 'background 0.2s, transform 0.1s';

                // 清理事件
                document.removeEventListener('mouseup', onMouseUp);
                if (!isLocked) {
                    document.removeEventListener('mousemove', onMouseMove);
                    // 仅在未锁定且发生移动时保存位置
                    if (hasMoved) {
                        GM_setValue(POS_X_KEY, btn.style.left);
                        GM_setValue(POS_Y_KEY, btn.style.top);
                    }
                }
            };

            // --- 绑定事件 ---
            document.addEventListener('mouseup', onMouseUp); // 必须绑定，否则松开无法停止加速

            if (!isLocked) {
                document.addEventListener('mousemove', onMouseMove); // 只有未锁定时才绑定拖拽
            }
        });

        btn.ondragstart = () => false;
        document.body.appendChild(btn);
    };

    // --- 定时器 ---
    setInterval(initUI, 1000);
})();