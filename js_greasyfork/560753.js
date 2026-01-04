// ==UserScript==
// @name         爱壹帆全屏工具
// @name:zh-CN   爱壹帆全屏工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为爱壹帆播放器添加网页全屏功能
// @author       immwind
// @include      *://*.aiyifan.tv/*
// @include      *://*.iyf.tv/*
// @match        *://*.yfsp.tv/*
// @include      *://*.yifan.tv/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=iyf.tv
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560753/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%85%A8%E5%B1%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560753/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%85%A8%E5%B1%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全屏图标
    const expandIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4z"/>
    </svg>`;

    // 退出全屏图标
    const compressIcon = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M9 9H3V7h4V3h2v6zm6-6h2v4h4v2h-6V3zm-6 12v6H7v-4H3v-2h6zm6 0h6v2h-4v4h-2v-6z"/>
    </svg>`;

    GM_addStyle(`
        .web-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            background: #000 !important;
        }
        .web-fullscreen video {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
        }
        .web-fs-btn {
            cursor: pointer;
            padding: 0 8px;
            color: #fff;
            display: flex;
            align-items: center;
        }
        .web-fs-btn:hover { color: #00a1d6; }
    `);

    function init() {
        const player = document.querySelector('vg-player');
        const fullscreenBtn = document.querySelector('vg-fullscreen');

        if (!player || !fullscreenBtn || document.querySelector('.web-fs-btn')) return;

        const btn = document.createElement('div');
        btn.className = 'control-item web-fs-btn';
        btn.innerHTML = expandIcon;

        btn.onclick = () => {
            player.classList.toggle('web-fullscreen');
            btn.innerHTML = player.classList.contains('web-fullscreen') ? compressIcon : expandIcon;
        };

        fullscreenBtn.parentNode.insertBefore(btn, fullscreenBtn);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && player.classList.contains('web-fullscreen')) {
                player.classList.remove('web-fullscreen');
                btn.innerHTML = expandIcon;
            }
        });
    }

    // 等待播放器加载
    const observer = new MutationObserver(() => {
        if (document.querySelector('vg-player')) {
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(init, 2000);
})();