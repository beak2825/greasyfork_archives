// ==UserScript==
// @name         片頭跳轉
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  重點強化文字顏色自定義，支援分:秒顯示與拖動開關
// @match        *://www.ntdm8.com/play/*
// @match        *://www.agedm.io/play/*
// @match        *://www.857fans.com/play/*
// @match        *://*.ntdm8.com/*
// @match        *://*.agefans.*/*
// @match        *://*.agemys.*/*
// @match        *://*.agedm.*/*
// @match        *://*.agefans.tv/*
// @match        *://*.sp-flv.com/*
// @match        *://*.ejtsyc.com/*
// @match        *://*.yhdmjx.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @allFrames    true
// @downloadURL https://update.greasyfork.org/scripts/560718/%E7%89%87%E9%A0%AD%E8%B7%B3%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560718/%E7%89%87%E9%A0%AD%E8%B7%B3%E8%BD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心數據讀取
    const getTargetSeconds = () => Math.round(GM_getValue('skip_seconds', 90));
    const isEnabled = () => GM_getValue('auto_skip_enabled', true);
    const getTextColor = () => GM_getValue('text_color', '#000000'); // 預設文字為黑色

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // 註冊選單命令
    GM_registerMenuCommand("🎨 更改文字顏色", setTextColor);
    GM_registerMenuCommand("⚙️ 設定跳轉時間", setSkipTime);

    function setTextColor() {
        const currentCol = getTextColor();
        const newCol = prompt(`請輸入文字顏色 (名稱或代碼)\n例如: blue, red, #00ff00, orange`, currentCol);
        if (newCol) {
            GM_setValue('text_color', newCol);
            location.reload();
        }
    }

    function setSkipTime() {
        const currentSec = getTargetSeconds();
        const input = prompt(`請輸入要跳過的總秒數：`, currentSec);
        if (input !== null && !isNaN(input)) updateSkipTime(parseInt(input));
    }

    function updateSkipTime(newSeconds) {
        if (newSeconds < 0) newSeconds = 0;
        GM_setValue('skip_seconds', newSeconds);
        const textBtn = document.getElementById('skip-text-btn');
        if (textBtn) textBtn.innerText = `跳轉: ${formatTime(newSeconds)}`;
    }

    // --- UI 繪製 ---
    const createUI = () => {
        if (window.self !== window.top) return;
        if (document.getElementById('skip-config-container')) return;

        const color = getTextColor();
        const container = document.createElement('div');
        container.id = 'skip-config-container';
        const savedPos = GM_getValue('btn_pos', { right: '20px', bottom: '100px' });
        const active = isEnabled();

        container.style = `
            position: fixed;
            right: ${savedPos.right}; bottom: ${savedPos.bottom};
            left: ${savedPos.left}; top: ${savedPos.top};
            z-index: 999999;
            background: rgba(255, 255, 255, 0.9);
            padding: 8px 15px;
            border-radius: 50px;
            cursor: move;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 15px;
            font-family: "Microsoft JhengHei", sans-serif;
            font-weight: 900;
            display: flex;
            align-items: center;
            border: 2px solid ${color};
            gap: 12px;
            user-select: none;
        `;

        // 內部組件全部套用 color 變數
        container.innerHTML = `
            <div id="skip-toggle-btn" style="width: 36px; height: 20px; background: ${active ? '#28a745' : '#888'}; border-radius: 12px; position: relative; cursor: pointer; border: 1px solid ${color};">
                <div style="width: 14px; height: 14px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${active ? '19px' : '2px'}; transition: left 0.3s;"></div>
            </div>
            <div id="skip-minus-btn" style="cursor: pointer; color: ${color}; border: 1px solid ${color}; padding: 1px 6px; border-radius: 5px;">-5s</div>
            <span id="skip-text-btn" style="cursor: pointer; color: ${color}; min-width: 85px; text-align: center;">跳轉: ${formatTime(getTargetSeconds())}</span>
            <div id="skip-plus-btn" style="cursor: pointer; color: ${color}; border: 1px solid ${color}; padding: 1px 6px; border-radius: 5px;">+5s</div>
            <div id="skip-color-btn" style="cursor: pointer; font-size: 18px;">🎨</div>
        `;

        document.body.appendChild(container);

        // 事件綁定
        const bind = (id, fn) => document.getElementById(id).onclick = (e) => { e.stopPropagation(); fn(e); };

        bind('skip-toggle-btn', () => {
            const newState = !isEnabled();
            GM_setValue('auto_skip_enabled', newState);
            document.getElementById('skip-toggle-btn').style.background = newState ? '#28a745' : '#888';
            document.getElementById('skip-toggle-btn').firstElementChild.style.left = newState ? '19px' : '2px';
        });

        bind('skip-minus-btn', () => updateSkipTime(getTargetSeconds() - 5));
        bind('skip-plus-btn', () => updateSkipTime(getTargetSeconds() + 5));
        bind('skip-color-btn', () => setTextColor());
        bind('skip-text-btn', (e) => { if (container.dataset.dragging !== 'true') setSkipTime(); });

        // 拖動邏輯
        let isDragging = false, offsetX, offsetY;
        container.onmousedown = function(e) {
            if (e.target.id === 'skip-config-container' || e.target.id === 'skip-text-btn') {
                isDragging = false; container.dataset.dragging = 'false';
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
                const move = (ev) => {
                    isDragging = true; container.dataset.dragging = 'true';
                    container.style.left = (ev.clientX - offsetX) + 'px';
                    container.style.top = (ev.clientY - offsetY) + 'px';
                    container.style.right = 'auto'; container.style.bottom = 'auto';
                };
                document.addEventListener('mousemove', move);
                document.onmouseup = () => {
                    document.removeEventListener('mousemove', move);
                    if (isDragging) GM_setValue('btn_pos', { left: container.style.left, top: container.style.top, right: 'auto', bottom: 'auto' });
                    document.onmouseup = null;
                };
            }
        };
    };

    // --- 跳轉邏輯 ---
    let jumpSuccess = false;
    function forceSeek() {
        if (!isEnabled()) return;
        const video = document.querySelector('video');
        const SKIP_SEC = getTargetSeconds();
        if (video && !jumpSuccess) {
            if (video.currentTime < SKIP_SEC && video.duration > SKIP_SEC) {
                video.currentTime = SKIP_SEC;
                if (video.paused) video.play().catch(() => {});
            }
            jumpSuccess = true;
        }
    }

    setTimeout(createUI, 1500);
    setInterval(forceSeek, 1000);
    document.addEventListener('click', forceSeek);
})();