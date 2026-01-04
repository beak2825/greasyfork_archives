// ==UserScript==
// @name         BiliTouch
// @namespace    https://github.com/RevenLiu
// @version      1.0.0
// @description  一个为移动端打造的Web端B站网页播放器交互重构的篡改猴脚本。支持两侧滑动调节亮度与音量、横向滑动调节时间进度、单击显隐工具栏、双击播放/暂停。让网页版拥有原生 App 般的使用体验。
// @author       RevenLiu
// @license      MIT
// @icon         https://raw.githubusercontent.com/RevenLiu/BiliTouch/main/Icon.png
// @homepage     https://github.com/RevenLiu/BiliTouch
// @supportURL   https://github.com/RevenLiu/BiliTouch/issues
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559978/BiliTouch.user.js
// @updateURL https://update.greasyfork.org/scripts/559978/BiliTouch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式与 UI 注入
    const style = document.createElement('style');
    style.innerHTML = `
        .my-force-show .bpx-player-control-entity, .my-force-show .bpx-player-pbp {
            opacity: 1 !important; visibility: visible !important; display: block !important;
        }
        .bpx-player-pbp:not(.show) { pointer-events: none !important; }
        .bpx-player-video-perch { touch-action: none !important; -webkit-tap-highlight-color: transparent !important; }
        #gesture-hud {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.75); color: #fff; padding: 12px 24px; border-radius: 10px;
            z-index: 999999; display: none; pointer-events: none; font-size: 20px; font-weight: bold; text-align: center;
        }
        #brightness-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: black; opacity: 0; pointer-events: none; z-index: 1;
        }
    `;
    document.head.appendChild(style);

    // 状态变量
    const TARGET = '.bpx-player-video-perch';
    let clickTimer = null, touchStartX = 0, touchStartY = 0;
    let baseTime = 0, targetTime = 0, baseVolume = 0, startOpacity = 0, currentOpacity = 0;
    let gestureMode = null, isGestureMoving = false;

    // 工具函数
    const getEl = (id, parent, creator) => {
        let el = document.getElementById(id);
        if (!el) { el = creator(); (document.querySelector(parent) || document.body).appendChild(el); }
        return el;
    };

    const showHUD = (text) => {
        const hud = getEl('gesture-hud', '.bpx-player-video-area', () => {
            const d = document.createElement('div'); d.id = 'gesture-hud'; return d;
        });
        hud.innerText = text; hud.style.display = 'block';
    };

    const formatTime = (s) => isNaN(s) ? "00:00" : `${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;

    const toggleControls = () => {
        const container = document.querySelector('.bpx-player-container');
        const entity = document.querySelector('.bpx-player-control-entity');
        const pbp = document.querySelector('.bpx-player-pbp');
        if (!container || !entity) return;

        const isLocked = container.classList.toggle('my-force-show');
        container.setAttribute('data-ctrl-hidden', !isLocked);
        entity.setAttribute('data-shadow-show', !isLocked);
        if (pbp) {
            pbp.classList.toggle('show', isLocked);
            window.dispatchEvent(new Event('resize'));
        }
    };

    // 手势逻辑
    document.addEventListener('touchstart', (e) => {
        const perch = e.target.closest(TARGET);
        const v = document.querySelector('video');
        if (!perch || !v) return;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        baseTime = v.currentTime;
        baseVolume = v.volume;
        const overlay = document.getElementById('brightness-overlay');
        startOpacity = overlay ? parseFloat(overlay.style.opacity) || 0 : 0;
        
        gestureMode = null;
        isGestureMoving = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const perch = e.target.closest(TARGET);
        const v = document.querySelector('video');
        if (!perch || !v) return;

        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = touchStartY - e.touches[0].clientY;

        if (!gestureMode) {
            if (Math.abs(deltaX) > 20) gestureMode = 'progress';
            else if (Math.abs(deltaY) > 20) gestureMode = touchStartX < (perch.offsetWidth / 2) ? 'brightness' : 'volume';
        }

        if (gestureMode) {
            isGestureMoving = true;
            if (e.cancelable) e.preventDefault();

            if (gestureMode === 'progress') {
                const speed = 120 / (perch.offsetWidth || 500);
                targetTime = Math.max(0, Math.min(v.duration, baseTime + deltaX * speed));
                showHUD(`${deltaX > 0 ? '▶▶' : '◀◀'} ${formatTime(targetTime)} / ${formatTime(v.duration)}`);
            } 
            else if (gestureMode === 'volume') {
                const volDelta = deltaY / (perch.offsetHeight || 300);
                v.volume = Math.max(0, Math.min(1, baseVolume + volDelta));
                showHUD(`🔊 音量: ${Math.round(v.volume * 100)}%`);
            } 
            else if (gestureMode === 'brightness') {
                const sensitivity = 0.5; // 亮度调节灵敏度
                const brightDelta = (deltaY / (perch.offsetHeight || 300)) * sensitivity;
                currentOpacity = Math.max(0, Math.min(0.8, startOpacity - brightDelta));
                const overlay = getEl('brightness-overlay', '.bpx-player-video-area', () => {
                    const d = document.createElement('div'); d.id = 'brightness-overlay'; return d;
                });
                overlay.style.opacity = currentOpacity;
                showHUD(`🔆 亮度: ${Math.round((1 - currentOpacity) * 100)}%`);
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (isGestureMoving && gestureMode === 'progress') {
            const v = document.querySelector('video');
            if (v) v.currentTime = targetTime;
        }
        const hud = document.getElementById('gesture-hud');
        if (hud) hud.style.display = 'none';
    }, { passive: true });

    // 点击与冲突拦截
    document.addEventListener('click', (e) => {
        const perch = e.target.closest(TARGET);
        if (!perch) return;

        if (isGestureMoving) { isGestureMoving = false; e.stopImmediatePropagation(); e.preventDefault(); return; }

        e.stopImmediatePropagation(); e.preventDefault();
        if (clickTimer) {
            clearTimeout(clickTimer); clickTimer = null;
            const v = document.querySelector('video'); if (v) v.paused ? v.play() : v.pause();
        } else {
            clickTimer = setTimeout(() => { clickTimer = null; toggleControls(); }, 250);
        }
    }, true);

    document.addEventListener('dblclick', (e) => {
        if (e.target.closest(TARGET)) { e.stopImmediatePropagation(); e.preventDefault(); }
    }, true);

    // 自动化宽屏
    const observer = new MutationObserver((_, obs) => {
        const btn = document.querySelector('.bpx-player-ctrl-wide-enter');
        if (btn) { btn.click(); obs.disconnect(); }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();