// ==UserScript==
// @name         MyComic 沉浸式深蓝阅读器 (V5.0 终极修复：可拖动/可点击)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  解决按钮冲突：可拖动、可点击、记忆位置、图片完美对齐。
// @author       粥
// @license MIT
// @match        https://mycomic.com/*/chapters/*
// @match        https://mycomic.com/chapters/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558616/MyComic%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E6%B7%B1%E8%93%9D%E9%98%85%E8%AF%BB%E5%99%A8%20%28V50%20%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%EF%BC%9A%E5%8F%AF%E6%8B%96%E5%8A%A8%E5%8F%AF%E7%82%B9%E5%87%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558616/MyComic%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E6%B7%B1%E8%93%9D%E9%98%85%E8%AF%BB%E5%99%A8%20%28V50%20%E7%BB%88%E6%9E%81%E4%BF%AE%E5%A4%8D%EF%BC%9A%E5%8F%AF%E6%8B%96%E5%8A%A8%E5%8F%AF%E7%82%B9%E5%87%BB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const bgColor = "#0b1021";
    const textColor = "#a0aab5";
    const btnId = 'immersive-toggle-btn';
    const storageKey = 'MYCOMIC_TOGGLE_BTN_POS';
    const CLICK_THRESHOLD = 5;

    // ❗改动 ①：默认关闭沉浸
    let isImmersive = false;

    let isDragging = false;
    let hasMoved = false;
    let startX, startY;
    let offsetX, offsetY;

    const immersiveCSS = `
        body, html, [data-flux-main], .bg-slate-50, .dark\\:bg-zinc-800 {
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
        }

        header[data-flux-header],
        [data-flux-sidebar],
        [data-flux-breadcrumbs],
        .fixed.bottom-0,
        .flex.justify-center.py-4,
        [data-flux-badge],
        footer,
        .z-10.fixed.inset-0,
        #immersive-translate-popup {
            display: none !important;
        }

        [data-flux-main] {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            display: block !important;
        }

        [data-flux-main] > div { padding-bottom: 0 !important; }
        [data-flux-main] .\\-mx-6 { margin: 0 !important; }

        img.page {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
        }
    `;

    const normalCSS = `#immersive-reader-style { display: none; }`;

    const styleId = 'immersive-reader-style';
    let style = document.getElementById(styleId);
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }

    function forceLoadImages() {
        const images = document.querySelectorAll('img.page');
        images.forEach(img => {
            if (img.getAttribute('data-src') && img.src.includes('data:,')) {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-loaded');
            }
        });
    }

    let toggleBtn = document.getElementById(btnId);
    if (!toggleBtn) {
        toggleBtn = document.createElement('div');
        toggleBtn.id = btnId;
        toggleBtn.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            width: 48px;
            height: 48px;
            font-size: 24px;
            line-height: 48px;
            text-align: center;
            cursor: grab;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            transition: background 0.3s, color 0.3s;
            font-family: sans-serif;
            font-weight: bold;
        `;
        document.body.appendChild(toggleBtn);
    }

    function toggleImmersiveMode(state) {
        if (state) {
            style.innerHTML = immersiveCSS;
            toggleBtn.innerText = '🌊';
            toggleBtn.title = '当前：沉浸模式 (点击切换)';
            toggleBtn.style.background = 'rgba(11, 16, 33, 0.5)';
            toggleBtn.style.color = 'white';
            toggleBtn.style.border = '1px solid rgba(255,255,255,0.2)';
            forceLoadImages();
        } else {
            style.innerHTML = normalCSS;
            toggleBtn.innerText = '📚';
            toggleBtn.title = '当前：普通模式 (点击进入沉浸)';
            toggleBtn.style.background = '#1e3a8a';
            toggleBtn.style.color = 'white';
            toggleBtn.style.border = '2px solid white';
            toggleBtn.style.opacity = '1';
        }
        isImmersive = state;
    }

    function savePosition() {
        localStorage.setItem(storageKey, JSON.stringify({
            left: toggleBtn.style.left,
            top: toggleBtn.style.top
        }));
    }

    const dragStart = (e) => {
        if (e.target !== toggleBtn) return;
        const event = e.type.startsWith('touch') ? e.touches[0] : e;
        if (e.type.startsWith('touch')) e.preventDefault();

        isDragging = true;
        hasMoved = false;
        toggleBtn.style.cursor = 'grabbing';

        startX = event.clientX;
        startY = event.clientY;

        if (toggleBtn.style.right && toggleBtn.style.right !== 'auto') {
            const rect = toggleBtn.getBoundingClientRect();
            toggleBtn.style.left = rect.left + 'px';
            toggleBtn.style.right = 'auto';
        }

        offsetX = event.clientX - toggleBtn.getBoundingClientRect().left;
        offsetY = event.clientY - toggleBtn.getBoundingClientRect().top;
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        const event = e.type.startsWith('touch') ? e.touches[0] : e;
        if (e.type.startsWith('touch')) e.preventDefault();

        let newLeft = event.clientX - offsetX;
        let newTop = event.clientY - offsetY;

        const dist = Math.hypot(event.clientX - startX, event.clientY - startY);
        if (dist > CLICK_THRESHOLD) hasMoved = true;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - toggleBtn.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - toggleBtn.offsetHeight));

        toggleBtn.style.left = newLeft + 'px';
        toggleBtn.style.top = newTop + 'px';
    };

    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        toggleBtn.style.cursor = 'pointer';

        if (!hasMoved) {
            toggleImmersiveMode(!isImmersive);
        } else {
            savePosition();
        }
        hasMoved = false;
    };

    toggleBtn.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    toggleBtn.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);

    const savedPos = localStorage.getItem(storageKey);
    if (savedPos) {
        try {
            const pos = JSON.parse(savedPos);
            toggleBtn.style.left = pos.left;
            toggleBtn.style.top = pos.top;
            toggleBtn.style.right = 'auto';
        } catch {}
    } else {
        toggleBtn.style.top = '15px';
        toggleBtn.style.right = '15px';
    }

    // ❗改动 ②：初始化为普通模式
    toggleImmersiveMode(false);

    window.addEventListener('scroll', forceLoadImages, { passive: true });
    const targetNode = document.querySelector('[data-flux-main]');
    if (targetNode) {
        new MutationObserver(forceLoadImages).observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
})();