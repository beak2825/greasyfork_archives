// ==UserScript==
// @name         YouTube Volume 1% Step with OSD
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Normally, the volume changes in 5% increments when using the up and down arrow keys on the keyboard, but this script changes it to adjust in 1% increments.
// @author       81standard
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562500/YouTube%20Volume%201%25%20Step%20with%20OSD.user.js
// @updateURL https://update.greasyfork.org/scripts/562500/YouTube%20Volume%201%25%20Step%20with%20OSD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定: 表示の見た目 ---
    const OSD_DURATION = 1500; // 表示が消えるまでの時間(ミリ秒)
    
    // 表示用の要素を作成する関数
    function createOSD() {
        const osd = document.createElement('div');
        osd.id = 'yt-custom-vol-osd';
        osd.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 24px;
            font-family: Roboto, Arial, sans-serif;
            z-index: 9999;
            pointer-events: none;
            display: none;
            opacity: 0;
            transition: opacity 0.2s;
            text-align: center;
        `;
        return osd;
    }

    let osdElement = null;
    let fadeTimeout = null;

    window.addEventListener('keydown', function(e) {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

        const video = document.querySelector('video');
        const player = document.getElementById('movie_player') || document.body; // フルスクリーン対応のためプレイヤー内に追加
        
        if (!video) return;

        // 標準動作をブロック
        e.stopImmediatePropagation();
        e.preventDefault();

        // 音量計算
        let step = 0.01;
        let newVolume = e.key === 'ArrowUp' ? video.volume + step : video.volume - step;
        newVolume = Math.min(1, Math.max(0, newVolume));
        video.volume = newVolume;

        // --- ここから表示処理 ---
        
        // 要素がなければ作成してプレイヤーに追加
        if (!osdElement) {
            osdElement = createOSD();
            player.appendChild(osdElement);
        }

        // 表示するアイコンとテキストの準備
        const percent = Math.round(newVolume * 100);
        let icon = '🔊';
        if (newVolume === 0) icon = '🔇';
        else if (newVolume < 0.5) icon = '🔉';

        osdElement.innerHTML = `${icon} ${percent}%`;
        
        // 表示オン
        osdElement.style.display = 'block';
        // 少し遅らせてopacityを変えることでフェードインさせる
        requestAnimationFrame(() => {
            osdElement.style.opacity = '1';
        });

        // 既存のタイマーがあればリセット（連打した時にすぐ消えないように）
        if (fadeTimeout) clearTimeout(fadeTimeout);

        // 数秒後にフェードアウト
        fadeTimeout = setTimeout(() => {
            osdElement.style.opacity = '0';
            // フェードアウト完了後にdisplay:noneにする
            setTimeout(() => {
                 if (osdElement.style.opacity === '0') {
                     osdElement.style.display = 'none';
                 }
            }, 200);
        }, OSD_DURATION);

    }, true);
})();