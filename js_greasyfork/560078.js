// ==UserScript==
// @name         Twitter/X Image Viewer Enhanced - Adds zoom, drag, and rotation capabilities to Twitter/X images.
// @name:zh-CN   Twitter/X 微博式看图工具 - 添加缩放、拖拽和旋转功能
// @namespace    https://greasyfork.org/en/users/1551895-piliplan
// @version      1.3.1
// @description  Adds zoom, drag, and rotation capabilities to Twitter/X images. Perfect for reading large text images or vertical screenshots that are hard to see on the desktop.
// @description:zh-CN 为 Twitter/X 图片添加缩放、拖拽和旋转功能。非常适合在桌面端阅读看不清的大段文字图片或长截图。
// @author       PILIPLAN
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560078/TwitterX%20Image%20Viewer%20Enhanced%20-%20Adds%20zoom%2C%20drag%2C%20and%20rotation%20capabilities%20to%20TwitterX%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/560078/TwitterX%20Image%20Viewer%20Enhanced%20-%20Adds%20zoom%2C%20drag%2C%20and%20rotation%20capabilities%20to%20TwitterX%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Core State
    let state = {
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        isDragging: false,
        startX: 0,
        startY: 0
    };

    let lastToolbarX = 0;
    let lastToolbarY = 0;
    let activeElement = null;
    let toolbar = null;

    // --- Helper: Check if mouse is over a scrollable area (Sidebar) ---
    function isInsideScrollable(element) {
        let el = element;
        // Traverse up the DOM tree
        while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            // Check if element has scrollbars
            const isScrollableY = style.overflowY === 'auto' || style.overflowY === 'scroll';
            // Check if it actually has content to scroll
            const canScroll = el.scrollHeight > el.clientHeight;

            if (isScrollableY && canScroll) {
                return true; // Found a scrollable parent (the sidebar)
            }
            el = el.parentElement;
        }
        return false;
    }

    // --- Core 1: Find Image in Layers ---
    function findCenterElement() {
        const layersContainer = document.querySelector('#layers');
        if (!layersContainer) return null;

        const candidates = layersContainer.querySelectorAll('img, div[style*="background-image"]');
        let bestCandidate = null;
        let minDistance = Infinity;

        const anchor = getAnchorPoint();
        const centerX = anchor ? anchor.x : window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        candidates.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width < 50 || rect.height < 50) return;
            if (window.getComputedStyle(el).opacity === '0') return;

            const dist = Math.sqrt(
                Math.pow((rect.left + rect.width / 2) - centerX, 2) +
                Math.pow((rect.top + rect.height / 2) - centerY, 2)
            );

            if (dist < minDistance) {
                minDistance = dist;
                bestCandidate = el;
            }
        });

        return (minDistance < 600) ? bestCandidate : null;
    }

    // --- Core 2: Get Anchor Point ---
    function getAnchorPoint() {
        const likeBtn = document.querySelector('#layers [data-testid="like"], #layers [data-testid="unlike"]');
        if (likeBtn) {
            const group = likeBtn.closest('[role="group"]');
            if (group) {
                const rect = group.getBoundingClientRect();
                return { x: rect.left + rect.width / 2, y: rect.top };
            }
        }
        return null;
    }

    // --- Core 3: Update Toolbar Position ---
    function updateToolbarPosition() {
        if (!toolbar) return;

        const anchor = getAnchorPoint();
        let targetX, targetY;

        if (anchor) {
            targetX = anchor.x;
            targetY = window.innerHeight - anchor.y + 10;
        } else {
            targetX = window.innerWidth / 2;
            targetY = 40;
        }

        // Dirty Check Optimization
        if (Math.abs(targetX - lastToolbarX) < 0.5 && Math.abs(targetY - lastToolbarY) < 0.5) {
            return;
        }

        if (anchor) {
            toolbar.style.left = targetX + 'px';
            toolbar.style.bottom = targetY + 'px';
            if(toolbar.style.transform !== 'translateX(-50%)') toolbar.style.transform = 'translateX(-50%)';
        } else {
            toolbar.style.left = '50%';
            toolbar.style.bottom = '40px';
        }

        lastToolbarX = targetX;
        lastToolbarY = targetY;
    }

    // --- Fix Clipping ---
    function unclipParents(element) {
        if (!element) return;
        let parent = element.parentElement;
        for (let i = 0; i < 8; i++) {
            if (parent && parent.style) {
                const style = window.getComputedStyle(parent);
                if (style.overflow !== 'visible') parent.style.setProperty('overflow', 'visible', 'important');
                if (style.maskType || style.webkitMask) {
                     parent.style.mask = 'none';
                     parent.style.webkitMask = 'none';
                }
            }
            parent = parent ? parent.parentElement : null;
        }
    }

    // --- Transform Logic ---
    function updateTransform() {
        if (!activeElement) activeElement = findCenterElement();
        if (!activeElement) return;

        unclipParents(activeElement);

        activeElement.style.transform = `
            translate(${state.x}px, ${state.y}px)
            rotate(${state.rotate}deg)
            scale(${state.scale})
        `;

        activeElement.style.transition = state.isDragging ? 'none' : 'transform 0.1s linear';
        activeElement.style.cursor = state.isDragging ? 'grabbing' : 'grab';
        activeElement.style.zIndex = '9999';

        if (activeElement.tagName === 'DIV') activeElement.style.backgroundSize = 'contain';
    }

    // --- Actions ---
    function zoom(delta) {
        state.scale += delta;
        if (state.scale < 0.1) state.scale = 0.1;
        initDragEvents();
        updateTransform();
    }

    function rotate(deg) {
        state.rotate += deg;
        updateTransform();
    }

    function reset() {
        state = { scale: 1, rotate: 0, x: 0, y: 0, isDragging: false, startX: 0, startY: 0 };
        if (activeElement) {
            activeElement.style.transform = '';
            activeElement.style.cursor = 'grab';
            activeElement.style.zIndex = '';
        }
    }

    // --- 🟢 Global Wheel Interception (Smart Mode) ---
    window.addEventListener('wheel', (e) => {
        // 1. Only work in photo mode
        if (!location.href.includes('/photo/')) return;

        // 2. 🟢 CRITICAL FIX: Check if mouse is over sidebar
        // If the user is hovering over a scrollable container (comments),
        // DO NOT INTERCEPT. Let native scroll happen.
        if (isInsideScrollable(e.target)) return;

        // 3. Find target image
        const target = findCenterElement();
        if (!target) return;

        activeElement = target;

        // 4. Intercept zoom
        e.preventDefault();
        e.stopImmediatePropagation();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        zoom(delta);

    }, { passive: false });

    // --- Drag Logic ---
    function initDragEvents() {
        if (!activeElement) activeElement = findCenterElement();
        if (!activeElement || activeElement.dataset.dragBound) return;

        activeElement.dataset.dragBound = 'true';
        activeElement.style.cursor = 'grab';

        activeElement.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            state.isDragging = true;
            state.startX = e.clientX - state.x;
            state.startY = e.clientY - state.y;
            activeElement.style.cursor = 'grabbing';
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (!state.isDragging) return;
        e.preventDefault();
        state.x = e.clientX - state.startX;
        state.y = e.clientY - state.startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        state.isDragging = false;
        if (activeElement) activeElement.style.cursor = 'grab';
    });

    // --- UI Toolbar ---
    function createToolbar() {
        if (document.getElementById('x-fusion-toolbar')) return;

        toolbar = document.createElement('div');
        toolbar.id = 'x-fusion-toolbar';

        // High Transparency & Blur
        toolbar.style.cssText = `
            position: fixed;
            transform: translateX(-50%);
            z-index: 2147483647;
            background: rgba(0, 0, 0, 0.4);
            padding: 8px 25px;
            border-radius: 50px;
            display: flex;
            gap: 25px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            opacity: 0; pointer-events: none; transition: opacity 0.2s;
        `;

        toolbar.addEventListener('mousedown', e => e.stopPropagation());

        const btns = [
            { t: '⟲', f: () => rotate(-90), title: 'Rotate Left' },
            { t: '－', f: () => zoom(-0.25), title: 'Zoom Out' },
            { t: 'RESET', f: reset, s: 'font-size:12px; font-weight:700; letter-spacing:1px; opacity:0.9;', title: 'Reset All' },
            { t: '＋', f: () => zoom(0.25), title: 'Zoom In' },
            { t: '⟳', f: () => rotate(90), title: 'Rotate Right' }
        ];

        btns.forEach(b => {
            const s = document.createElement('span');
            s.innerHTML = b.t;
            s.style.cssText = `
                color: rgba(255, 255, 255, 0.9);
                cursor: pointer; font-size: 22px; width: 30px;
                display: flex; justify-content: center; align-items: center;
                user-select: none; transition: transform 0.1s;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                ${b.s||''}
            `;
            s.onmouseover = () => { s.style.color = '#fff'; s.style.transform = 'scale(1.1)'; };
            s.onmouseout = () => { s.style.color = 'rgba(255, 255, 255, 0.9)'; s.style.transform = 'scale(1)'; };
            s.onclick = (e) => { e.stopPropagation(); b.f(); };
            toolbar.appendChild(s);
        });

        document.body.appendChild(toolbar);
    }

    // --- Main Loop ---
    function loop() {
        const isPhotoView = location.href.includes('/photo/');
        if (!toolbar) createToolbar();

        if (isPhotoView) {
            toolbar.style.opacity = '1';
            toolbar.style.pointerEvents = 'auto';
            updateToolbarPosition();

            if (!activeElement) {
                 activeElement = findCenterElement();
                 if (activeElement) initDragEvents();
            }
        } else {
            toolbar.style.opacity = '0';
            toolbar.style.pointerEvents = 'none';
            if (state.scale !== 1 || state.rotate !== 0) reset();
            activeElement = null;
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') reset();
    });

})();