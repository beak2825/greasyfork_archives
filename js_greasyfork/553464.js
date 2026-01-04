// ==UserScript==
// @name         Video Volume Booster (通用音量放大器)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  放大任意网站视频音量（支持多倍增益）
// @author       Kazzz
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553464/Video%20Volume%20Booster%20%28%E9%80%9A%E7%94%A8%E9%9F%B3%E9%87%8F%E6%94%BE%E5%A4%A7%E5%99%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553464/Video%20Volume%20Booster%20%28%E9%80%9A%E7%94%A8%E9%9F%B3%E9%87%8F%E6%94%BE%E5%A4%A7%E5%99%A8%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 可调参数 ===
    const GAIN_VALUE = 4.0; // 默认放大倍数（1.0 = 原音量，2.0 = 200%，可根据需求调整）
    const CHECK_INTERVAL = 2000; // 检测视频间隔（毫秒）

    const boostedVideos = new WeakSet();

    function boostVolume(video) {
        if (boostedVideos.has(video)) return;
        try {
            const ctx = new AudioContext();
            const source = ctx.createMediaElementSource(video);
            const gainNode = ctx.createGain();
            gainNode.gain.value = GAIN_VALUE;
            source.connect(gainNode).connect(ctx.destination);
            boostedVideos.add(video);
            console.log(`[VolumeBooster] 已为视频启用音量放大：x${GAIN_VALUE}`);
        } catch (err) {
            console.warn('[VolumeBooster] 无法增强音量:', err);
        }
    }

    function scanVideos() {
        document.querySelectorAll('video').forEach(boostVolume);
    }

    setInterval(scanVideos, CHECK_INTERVAL);
    scanVideos();

    // 可选：按下键盘快捷键 “Shift + ↑/↓” 调整音量倍数
    window.addEventListener('keydown', e => {
        if (!e.shiftKey) return;
        if (e.key === 'ArrowUp') {
            window.GAIN_VALUE = Math.min((window.GAIN_VALUE || GAIN_VALUE) + 0.2, 5);
            console.log(`🔊 当前音量放大倍数: x${window.GAIN_VALUE.toFixed(1)}`);
        } else if (e.key === 'ArrowDown') {
            window.GAIN_VALUE = Math.max((window.GAIN_VALUE || GAIN_VALUE) - 0.2, 1);
            console.log(`🔉 当前音量放大倍数: x${window.GAIN_VALUE.toFixed(1)}`);
        }
    });
})();
