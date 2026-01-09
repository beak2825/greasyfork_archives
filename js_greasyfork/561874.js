// ==UserScript==
// @name         Anime1 快捷鍵增強 (Anime1 Shortcuts)
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  為 Anime1 添加快捷鍵：空白鍵暫停/播放、箭頭鍵快進/後退、音量調整、F鍵全螢幕、M鍵靜音。
// @author       XiaoYe.MH
// @match        https://anime1.me/*
// @match        https://anime1.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561874/Anime1%20%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%A2%9E%E5%BC%B7%20%28Anime1%20Shortcuts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561874/Anime1%20%E5%BF%AB%E6%8D%B7%E9%8D%B5%E5%A2%9E%E5%BC%B7%20%28Anime1%20Shortcuts%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心工具函數：獲取正確的容器 ---

    // 獲取影片標籤 (用於控制播放)
    function getVideo() {
        return document.querySelector('video');
    }

    // 獲取影片容器 (用於全螢幕和掛載提示框)
    function getPlayerContainer() {
        let container = document.querySelector('.video-js');
        if (!container) {
            const video = document.querySelector('video');
            if (video) container = video.parentElement;
        }
        return container || document.body;
    }

    // --- 提示框設置 ---

    let toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '10%';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '2147483647';
    toast.style.fontSize = '18px';
    toast.style.pointerEvents = 'none';
    toast.style.display = 'none';
    toast.style.transition = 'opacity 0.3s';
    toast.style.fontWeight = 'bold';
    toast.style.textShadow = '1px 1px 2px black';

    document.body.appendChild(toast);

    let toastTimeout;

    // --- 顯示提示 (核心邏輯) ---
    function showToast(message) {
        toast.innerText = message;
        toast.style.display = 'block';

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 全螢幕掛載檢測
        const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

        if (fullscreenElement) {
            if (fullscreenElement.tagName !== 'VIDEO') {
                if (toast.parentElement !== fullscreenElement) {
                    fullscreenElement.appendChild(toast);
                }
            } else {
                if (toast.parentElement !== fullscreenElement.parentElement) {
                    fullscreenElement.parentElement.appendChild(toast);
                }
            }
        } else {
            if (toast.parentElement !== document.body) {
                document.body.appendChild(toast);
            }
        }

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.style.opacity === '0') {
                    toast.style.display = 'none';
                }
            }, 300);
        }, 1500);
    }

    // --- 事件監聽 ---
    window.addEventListener('keydown', function(e) {

        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
            return;
        }

        const video = getVideo();
        if (!video) return;

        const key = e.key.toLowerCase();
        const targetKeys = [' ', 'k', 'arrowright', 'l', 'arrowleft', 'j', 'arrowup', 'arrowdown', 'f', 'm',
                            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (targetKeys.includes(key)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            switch(key) {
                case ' ':
                case 'k':
                    if (video.paused) {
                        video.play();
                        showToast('播放 ▶');
                    } else {
                        video.pause();
                        showToast('暫停 ⏸');
                    }
                    break;

                case 'arrowright':
                case 'l':
                    video.currentTime += 5;
                    showToast(`快進 5秒 (${formatTime(video.currentTime)})`);
                    break;

                case 'arrowleft':
                case 'j':
                    video.currentTime -= 5;
                    showToast(`倒退 5秒 (${formatTime(video.currentTime)})`);
                    break;

                case 'arrowup':
                    if (video.volume < 1) {
                        video.volume = Math.min(1, video.volume + 0.05);
                        showToast(`音量: ${Math.round(video.volume * 100)}%`);
                    } else {
                        showToast('音量: 最大');
                    }
                    break;

                case 'arrowdown':
                    if (video.volume > 0) {
                        video.volume = Math.max(0, video.volume - 0.05);
                        showToast(`音量: ${Math.round(video.volume * 100)}%`);
                    } else {
                        showToast('音量: 靜音');
                    }
                    break;

                case 'f':
                    toggleFullScreen();
                    break;

                case 'm': // 靜音邏輯優化
                    if (video.muted) {
                        // 執行解除靜音
                        video.muted = false;

                        // 優化1: 如果當前音量是 0，自動恢復到 50%
                        // 使用 < 0.01 是為了防止浮點數誤差，雖然通常 === 0 也可以
                        if (video.volume < 0.01) {
                            video.volume = 0.5;
                        }

                        // 優化2: 顯示解除靜音後的當前音量
                        const currentVol = Math.round(video.volume * 100);
                        showToast(`靜音關閉 🔊 (音量: ${currentVol}%)`);
                    } else {
                        // 執行靜音
                        video.muted = true;
                        showToast('靜音開啟 🔇');
                    }
                    break;

                default:
                    if (!isNaN(parseInt(key))) {
                        const percent = parseInt(key) * 10;
                        video.currentTime = (video.duration * percent) / 100;
                        showToast(`跳轉至 ${percent}%`);
                    }
                    break;
            }
        }
    }, true);

    // --- 輔助函數 ---

    function toggleFullScreen() {
        const container = getPlayerContainer();
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

})();