// ==UserScript==
// @name         YouTube PIP Button (Safari Desktop Mode + Auto PIP)
// @version      1.1
// @description  Generate PIP button on YouTube Player Desktop Mode + auto PIP when Safari tab goes background
// @match        https://www.youtube.com/*
// @grant        none
// @namespace    colodes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555847/YouTube%20PIP%20Button%20%28Safari%20Desktop%20Mode%20%2B%20Auto%20PIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555847/YouTube%20PIP%20Button%20%28Safari%20Desktop%20Mode%20%2B%20Auto%20PIP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const controlSelector = '.ytp-left-controls';
    const AUTO_PIP_ON_HIDE = true; // 页面被隐藏（回桌面/切换标签）时自动尝试进入 PIP

    let lastVideo = null;

    function canUsePip(video) {
        if (!video) return false;
        // 老 API：webkitSupportsPresentationMode / webkitSetPresentationMode
        if (typeof video.webkitSetPresentationMode === 'function') {
            if (typeof video.webkitSupportsPresentationMode === 'function') {
                try {
                    if (!video.webkitSupportsPresentationMode('picture-in-picture')) {
                        return false;
                    }
                } catch (_) {}
            }
            return true;
        }
        return false;
    }

    function enterPip(video) {
        if (!canUsePip(video)) return;
        try {
            if (video.webkitPresentationMode !== 'picture-in-picture') {
                video.webkitSetPresentationMode('picture-in-picture');
            }
        } catch (_) {}
    }

    function exitPip(video) {
        if (!canUsePip(video)) return;
        try {
            if (video.webkitPresentationMode === 'picture-in-picture') {
                video.webkitSetPresentationMode('inline');
            }
        } catch (_) {}
    }

    function togglePip(video) {
        if (!canUsePip(video)) return;
        try {
            if (video.webkitPresentationMode === 'picture-in-picture') {
                video.webkitSetPresentationMode('inline');
            } else {
                video.webkitSetPresentationMode('picture-in-picture');
            }
        } catch (_) {}
    }

    function createPipButton(video) {
        const btn = document.createElement('button');
        const icon = document.createElement('span');
        icon.textContent = '◲';

        Object.assign(btn.style, {
            background: 'rgba(0, 0, 0, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '10px',
            userSelect: 'none',
            textShadow: '0 0px 3px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer'
        });
        Object.assign(icon.style, {
            transform: 'translateY(-2px)',
            display: 'inline-block',
        });

        btn.appendChild(icon);
        btn.classList.add('my-pip-btn');
        btn.onclick = e => {
            e.stopPropagation();
            if (!video) return;
            togglePip(video);
        };
        return btn;
    }

    function injectButtons() {
        const video = document.querySelector('video');
        if (!video) return;
        lastVideo = video;

        const roots = [document];
        const host = document.querySelector('ytp-player');
        if (host?.shadowRoot) roots.push(host.shadowRoot);

        roots.forEach(root => {
            root.querySelectorAll(controlSelector).forEach(container => {
                if (!container.querySelector('.my-pip-btn')) {
                    container.appendChild(createPipButton(video));
                }
            });
        });
    }

    // 当页面进入后台 / 被隐藏时，自动尝试进入 PIP
    function handleAutoPip() {
        if (!AUTO_PIP_ON_HIDE) return;

        // 优先用 lastVideo，退而求其次重新 query
        const video = lastVideo || document.querySelector('video');
        if (!video) return;

        // 只对正在播放的视频自动 PIP，避免误触
        if (video.paused || video.ended) return;

        enterPip(video);
    }

    // 1. Safari 切换标签页 / 回桌面时，一般会触发 visibilitychange 为 hidden
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            handleAutoPip();
        }
    }, true);

    // 2. 作为补充，一些情况下会触发 pagehide
    window.addEventListener('pagehide', () => {
        handleAutoPip();
    }, true);

    // 观察页面变化，注入按钮
    new MutationObserver(injectButtons).observe(document.body, { childList: true, subtree: true });
    injectButtons();
})();
