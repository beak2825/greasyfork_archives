// ==UserScript==
// @name         Sweet.TV Ultimate Control v2.6 (Compact & Rounded)
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Compact overlay (rounded rect), visible in Fullscreen.
// @author       You
// @match        https://sweet.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sweet.tv
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559541/SweetTV%20Ultimate%20Control%20v26%20%28Compact%20%20Rounded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559541/SweetTV%20Ultimate%20Control%20v26%20%28Compact%20%20Rounded%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        seekTime: 10,       // Секунди перемотки
        volStep: 0.1,       // Крок гучності (10%)
        speedStep: 0.25,    // Крок швидкості
        maxSpeed: 3.0,      // Макс. швидкість
        overlayTime: 600    // Час показу (мс)
    };

    let savedSpeed = 1.0;
    let overlay, overlayTimer;

    const ICONS = {
        rewind: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
        forward: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
        volHigh: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volLow: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>',
        volMute: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        speed: '<svg viewBox="0 0 24 24" fill="white" width="42" height="42" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>'
    };

    function injectStyles() {
        if (document.getElementById('sweet-control-styles')) return;
        const style = document.createElement('style');
        style.id = 'sweet-control-styles';
        style.innerHTML = `
            .sweet-overlay-v2 {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px; 
                height: 100px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 2147483647;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s ease-out;
                backdrop-filter: blur(3px);
            }
            .sweet-overlay-v2.visible {
                opacity: 1;
            }
            .sweet-overlay-text {
                color: #fff;
                font-family: sans-serif;
                font-size: 16px;
                font-weight: 700;
                margin-top: 4px;
                text-shadow: 0 1px 3px rgba(0,0,0,0.8);
            }
        `;
        document.head.appendChild(style);
    }

    function updateOverlayContainer() {
        if (!overlay) {
            injectStyles();
            overlay = document.createElement('div');
            overlay.className = 'sweet-overlay-v2';
            overlay.innerHTML = `<div class="icon"></div><div class="sweet-overlay-text"></div>`;
        }

        const parent = document.fullscreenElement || document.body;
        if (overlay.parentNode !== parent) {
            parent.appendChild(overlay);
        }

        return overlay;
    }

    function showOverlay(iconSvg, text) {
        const el = updateOverlayContainer();

        el.querySelector('.icon').innerHTML = iconSvg;
        el.querySelector('.sweet-overlay-text').innerText = text;
        el.classList.add('visible');

        clearTimeout(overlayTimer);
        overlayTimer = setTimeout(() => {
            el.classList.remove('visible');
        }, CONFIG.overlayTime);
    }

    function controlPlayer(action, val) {
        const video = document.querySelector('video');
        if (!video) return;

        switch(action) {
            case 'seek':
                video.currentTime += val;
                showOverlay(val > 0 ? ICONS.forward : ICONS.rewind, `${val > 0 ? '+' : ''}${val} с`);
                break;
            case 'volume':
                let v = video.volume + val;
                if (v > 1) v = 1; if (v < 0) v = 0;
                video.volume = v;

                let icon = ICONS.volHigh;
                if (v === 0) icon = ICONS.volMute;
                else if (v < 0.5) icon = ICONS.volLow;

                showOverlay(icon, `${Math.round(v * 100)}%`);
                break;
            case 'speed':
                let s = video.playbackRate + val;
                if (s > CONFIG.maxSpeed) s = CONFIG.maxSpeed;
                if (s < 0.25) s = 0.25;
                video.playbackRate = s;
                savedSpeed = s;
                showOverlay(ICONS.speed, `${s.toFixed(2)}x`);
                break;
        }
    }


    window.addEventListener('keydown', (e) => {
        const tag = e.target.tagName;
        if (['INPUT', 'TEXTAREA'].includes(tag) || e.target.isContentEditable) return;

        if (e.code === 'ArrowRight' && !e.shiftKey) {
            e.preventDefault(); e.stopImmediatePropagation();
            controlPlayer('seek', CONFIG.seekTime);
        }
        if (e.code === 'ArrowLeft' && !e.shiftKey) {
            e.preventDefault(); e.stopImmediatePropagation();
            controlPlayer('seek', -CONFIG.seekTime);
        }

        if (e.code === 'ArrowUp') {
            e.preventDefault(); e.stopPropagation();
            controlPlayer('volume', CONFIG.volStep);
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault(); e.stopPropagation();
            controlPlayer('volume', -CONFIG.volStep);
        }

        if (e.shiftKey && e.code === 'Period') {
            e.preventDefault();
            controlPlayer('speed', CONFIG.speedStep);
        }
        if (e.shiftKey && e.code === 'Comma') {
            e.preventDefault();
            controlPlayer('speed', -CONFIG.speedStep);
        }
    }, true);

    setInterval(() => {
        const video = document.querySelector('video');
        if (video && !video.paused && video.playbackRate === 1.0 && savedSpeed !== 1.0) {
            video.playbackRate = savedSpeed;
        }
    }, 2000);

})();