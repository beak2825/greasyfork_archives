// ==UserScript==
// @name         FA手机查看原图优化--全新
// @namespace    Lecrp.com
// @version      2.0
// @description  FA-手机查看原图时的操作优化，原逻辑不变，长按图片变为自定义查看结构
// @author       jcjyids
// @match        https://www.furaffinity.net/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=furaffinity.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558723/FA%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E4%BC%98%E5%8C%96--%E5%85%A8%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558723/FA%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E4%BC%98%E5%8C%96--%E5%85%A8%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 常量配置区 ---
    const ENABLE_FULLSCREEN = 0;   // 是否开启全屏模式
    const PRELOAD_MS = 400;           // 预加载启动时间 (ms)
    const LONG_PRESS_MS = 500;        // 触发容器显示时间 (ms)
    const LONG_PRESS_MOVE_LIMIT = 20; // 长按允许位移误差 (px)
    const DBL_CLICK_MS = 300;         // 双击判定窗口 (ms)
    const DBL_CLICK_MOVE_LIMIT = 25;  // 双击允许位移误差 (px)
    const WAIT_BEFORE_CLOSE = 50;     // 关闭前的防穿透延迟 (ms)
    const PADDING_RATIO = 0.3;        // 上下占位比例 (0.2 = 20%)
    const BG_COLOR = 'rgba(0, 0, 0, 0.95)';
    const Z_INDEX = 999999900;

    // --- 2. 状态变量 ---
    let overlay, contentImg, topSpacer, bottomSpacer;
    let lastTapTime = 0;
    let lastTapPos = { x: 0, y: 0 };

    function init() {
        const target = document.getElementById('submissionImg');
        if (target) {
            setupTrigger(target);
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const retryTarget = document.getElementById('submissionImg');
                if (retryTarget) {
                    setupTrigger(retryTarget);
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => observer.disconnect(), 3000);
        }
    }

    function setupTrigger(el) {
        let timer = null;
        let preloadTimer = null;
        let startPos = { x: 0, y: 0 };

        el.addEventListener('contextmenu', (e) => e.preventDefault());

        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startPos = { x: touch.clientX, y: touch.clientY };

            // 300ms 预加载
            preloadTimer = setTimeout(() => {
                ensureOverlayCreated();
                const fullSrc = el.getAttribute('data-fullview-src');
                if (contentImg.src !== fullSrc) contentImg.src = fullSrc;
            }, PRELOAD_MS);

            // 500ms 正式打开
            timer = setTimeout(() => {
                showOverlay();
            }, LONG_PRESS_MS);
        }, { passive: true });

        el.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const dist = Math.hypot(touch.clientX - startPos.x, touch.clientY - startPos.y);
            if (dist > LONG_PRESS_MOVE_LIMIT) {
                cancelTrigger();
            }
        }, { passive: true });

        el.addEventListener('touchend', cancelTrigger);
        el.addEventListener('touchcancel', cancelTrigger);

        function cancelTrigger() {
            clearTimeout(timer);
            clearTimeout(preloadTimer);
            // 如果容器还没显示就松手了，清空 src 节省流量
            if (overlay && overlay.style.display !== 'block') {
                contentImg.src = '';
            }
        }
    }

    function ensureOverlayCreated() {
        if (overlay) return;

        overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0', bottom: '0', left: '0', right: '0',
            backgroundColor: BG_COLOR,
            zIndex: Z_INDEX,
            overflowY: 'auto',
            display: 'none',
            webkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === topSpacer || e.target === bottomSpacer) {
                hideOverlay();
            }
        });

        overlay.addEventListener('contextmenu', (e) => {
            if (e.target !== contentImg) e.preventDefault();
        });

        topSpacer = document.createElement('div');
        bottomSpacer = document.createElement('div');
        contentImg = document.createElement('img');
        Object.assign(contentImg.style, { display: 'block', width: '100vw', height: 'auto' });
        contentImg.addEventListener('click', handleImgClick);

        overlay.append(topSpacer, contentImg, bottomSpacer);
        document.body.appendChild(overlay);
    }

    function showOverlay() {
        if (ENABLE_FULLSCREEN && document.documentElement.requestFullscreen) {
            overlay.requestFullscreen().catch(() => {});
        }

        // 核心：基于当前物理视口高度计算固定像素值
        const currentH = window.innerHeight;
        const offsetPx = currentH * PADDING_RATIO;

        // 同步赋值，确保物理对齐
        topSpacer.style.height = `${offsetPx}px`;
        bottomSpacer.style.height = `${offsetPx}px`;

        overlay.style.visibility = 'hidden';
        overlay.style.display = 'block';

        // 设置滚动条位置
        overlay.scrollTop = offsetPx;

        overlay.style.visibility = 'visible';
    }

    function handleImgClick(e) {
        const now = Date.now();
        const currentPos = { x: e.clientX, y: e.clientY };
        const timeDiff = now - lastTapTime;
        const dist = Math.hypot(currentPos.x - lastTapPos.x, currentPos.y - lastTapPos.y);

        if (timeDiff < DBL_CLICK_MS && dist < DBL_CLICK_MOVE_LIMIT) {
            setTimeout(() => {
                hideOverlay();
            }, WAIT_BEFORE_CLOSE);
            lastTapTime = 0;
        } else {
            lastTapTime = now;
            lastTapPos = currentPos;
        }
    }

    function hideOverlay() {
        if (overlay) {
            if (ENABLE_FULLSCREEN && document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
            overlay.style.display = 'none';
            contentImg.src = '';
            lastTapTime = 0;
        }
    }

    init();
})();