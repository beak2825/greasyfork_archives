// ==UserScript==
// @name         💙💛Ukrainian flag and flowers (Ctrl+Shift+U)
// @namespace    tampermonkey.net
// @version      15.1
// @description  新增乌克兰 Kalyna(坚韧之花) + 象征不朽与坚韧的战争精神 + 性能优化。
// @author       邢智轩（From China）
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9BUkrainian%20flag%20and%20flowers%20%28Ctrl%2BShift%2BU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9BUkrainian%20flag%20and%20flowers%20%28Ctrl%2BShift%2BU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__UA_FLAG_INSTANCED__) return;
    window.__UA_FLAG_INSTANCED__ = true;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const TRIDENT_SVG = `data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDAgTDg1IDQ1IEw0MCA0NSBRMjAgNDUgMjAgODAgTDIwIDE4MCBRMjAgMjIwIDUwIDIyMCBMNjUgMjIwIEw2NSAxOTAgTDUwIDE5MCBRNDAgMTkwIDQwIDE3NSBMNDAgOTAgTDc1IDkwIEw4MCAxODAgUTgyIDI1MCAxMDAgMjUwIFExMTggMjUwIDEyMCAxODAgTDEyNSA5MCBMMTYwIDkwIEwxNjAgMTc1IFExNjAgMTkwIDE1MCAxOTAgTDEzNSAxOTAgTDEzNSAyMjAgTDE1MCAyMjAgUTE4MCAyMjAgMTgwIDE4MCBMMTgwIDgwIFExODAgNDUgMTYwIDQ1IEwxMTUgNDUgWiBNMTAwIDI2MCBMOTAgMzAwIEwxMTAgMzAwIFoiIGZpbGw9IiNGRkQ3MDAiLz48L3N2Zz4=`;

    const state = {
        isTerminated: false,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        rafId: null,
        domObserver: null,
        intersectionObserver: null,
        hostElement: null,
        dragHandleElement: null,
        containerElement: null,
        lastSavedPos: null
    };

    const CONFIG = {
        width: 320,
        height: 200,
        colors: {
            blue: '#0057B7',
            yellow: '#FFD700',
            poleLight: '#ffd700',
            poleDark: '#4d3d00'
        },
        sunflowers: [
            { l: 18, b: 0, s: 0.6, h: 35, leaf: 'L', d: -0.2, z: 150 },
            { l: 35, b: 0, s: 0.85, h: 58, leaf: 'R', d: -1.5, z: 152 },
            { l: 48, b: 0, s: 0.55, h: 28, leaf: null, d: -2.8, z: 150 },
            { l: 85, b: 0, s: 0.7, h: 45, leaf: 'L', d: -3.3, z: 150 },
            { l: 110, b: 0, s: 0.75, h: 52, leaf: null, d: -0.9, z: 150 },
            { l: 155, b: 0, s: 0.6, h: 40, leaf: null, d: -4.1, z: 150 },
            { l: 180, b: 0, s: 0.8, h: 62, leaf: 'R', d: -2.5, z: 150 },
            { l: 215, b: 0, s: 0.65, h: 38, leaf: null, d: -1.2, z: 150 },
            { l: 25, b: 8, s: 0.45, h: 18, leaf: null, d: -1.1, z: 160 },
            { l: 70, b: 5, s: 0.4, h: 15, leaf: null, d: -3.7, z: 160 },
            { l: 135, b: 10, s: 0.5, h: 22, leaf: null, d: -0.5, z: 160 },
            { l: 195, b: 4, s: 0.4, h: 16, leaf: null, d: -2.9, z: 160 }
        ],
        // --- 新增：Kalyna (Guelder Rose) ---
        // 象征坚韧、不朽与乌克兰精神
        kalynaBranches: [
            { l: 0, b: 0, s: 0.5, d: -1.0, rot: 10, z: 148 },  // 左侧后景
            { l: 280, b: 2, s: 0.6, d: -2.5, rot: -15, z: 148 }, // 右侧后景
            { l: 55, b: 5, s: 0.7, d: -3.5, rot: 5, z: 149 },  // 中间穿插
            { l: 260, b: 10, s: 0.55, d: -0.8, rot: -10, z: 149 } // 右侧穿插
        ]
    };

    function canRun() {
        return window.innerWidth >= 800 && window.self === window.top;
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    const storage = {
        get: (key, def) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : def;
            } catch (e) { return def; }
        },
        set: (key, value) => {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
        },
        remove: (key) => {
            try { localStorage.removeItem(key); } catch (e) {}
        }
    };

    const getClientCoords = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const startDrag = (e) => {
        if (!state.hostElement) return;
        if (e.type === 'touchstart') e.preventDefault();

        state.isDragging = true;
        const rect = state.hostElement.getBoundingClientRect();
        const coords = getClientCoords(e);

        state.offsetX = coords.x - rect.left;
        state.offsetY = coords.y - rect.top;

        state.hostElement.style.transition = 'none';

        state.hostElement.style.top = `${rect.top}px`;
        state.hostElement.style.left = `${rect.left}px`;
        state.hostElement.style.bottom = 'auto';

        if (state.containerElement) {
            state.containerElement.classList.add('ua-lifting');
        }
    };

    const onMove = (e) => {
        if (!state.isDragging || !state.hostElement) return;
        if (state.rafId) cancelAnimationFrame(state.rafId);

        state.rafId = requestAnimationFrame(() => {
            const coords = getClientCoords(e);
            let x = coords.x - state.offsetX;
            let y = coords.y - state.offsetY;

            x = Math.max(0, x);
            y = Math.max(0, y);
            const maxX = window.innerWidth - CONFIG.width;
            const maxY = window.innerHeight - CONFIG.height;
            if (maxX > 0) x = Math.min(x, maxX);
            if (maxY > 0) y = Math.min(y, maxY);

            state.hostElement.style.left = `${x}px`;
            state.hostElement.style.top = `${y}px`;
            state.rafId = null;
        });
    };

    const endDrag = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        if (state.hostElement) {
            state.hostElement.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            if (state.containerElement) {
                state.containerElement.classList.remove('ua-lifting');
            }

            const rect = state.hostElement.getBoundingClientRect();
            const currentPos = { left: rect.left, top: rect.top };

            if (!state.lastSavedPos ||
                state.lastSavedPos.left !== currentPos.left ||
                state.lastSavedPos.top !== currentPos.top) {
                storage.set('ua-flag-pos', currentPos);
                state.lastSavedPos = currentPos;
            }
        }
    };

    const ensureInBounds = (host) => {
        if (!host) return;

        if (host.style.top !== 'auto' && state.lastSavedPos) {
            const maxX = window.innerWidth - CONFIG.width;
            const maxY = window.innerHeight - CONFIG.height;

            let { left, top } = state.lastSavedPos;
            let updated = false;

            if (left > maxX) { left = maxX; updated = true; }
            if (top > maxY) { top = maxY; updated = true; }

            if (updated) {
                host.style.left = `${left}px`;
                host.style.top = `${top}px`;
                storage.set('ua-flag-pos', { left, top });
                state.lastSavedPos = { left, top };
            }
        }
    };

    const resetBadgePosition = () => {
        storage.remove('ua-flag-pos');
        state.lastSavedPos = null;
        if(state.hostElement) {
            state.hostElement.style.bottom = '60px';
            state.hostElement.style.left = '60px';
            state.hostElement.style.top = 'auto';
            state.hostElement.style.transform = 'scale(0.95)';
            setTimeout(() => { if(state.hostElement) state.hostElement.style.transform = 'scale(1)'; }, 150);
        }
    };

    function injectBadge() {
        if (!canRun()) return;

        if (state.hostElement && document.getElementById('ua-waving-badge-root')) {
            state.dragHandleElement = state.hostElement.shadowRoot.querySelector('.drag-handle');
            state.containerElement = state.hostElement.shadowRoot.querySelector('.container');
            setupIntersectionObserver(state.hostElement);
            return;
        }

        if (document.getElementById('ua-waving-badge-root')) {
             state.hostElement = document.getElementById('ua-waving-badge-root');
             state.dragHandleElement = state.hostElement.shadowRoot.querySelector('.drag-handle');
             state.containerElement = state.hostElement.shadowRoot.querySelector('.container');
             setupIntersectionObserver(state.hostElement);
             return;
        }

        const host = document.createElement('div');
        host.id = 'ua-waving-badge-root';
        host.setAttribute('aria-hidden', 'true');

        state.lastSavedPos = storage.get('ua-flag-pos', null);

        let initialStyle = `bottom: 60px; left: 60px;`;

        if (state.lastSavedPos) {
            const { left, top } = state.lastSavedPos;
            if (left >= 0 && left < window.innerWidth && top >= 0 && top < window.innerHeight) {
                initialStyle = `top: ${top}px; left: ${left}px; bottom: auto;`;
            }
        }

        host.style.cssText = `
            position: fixed !important;
            ${initialStyle}
            z-index: 2147483647 !important;
            pointer-events: none !important;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
            opacity: 0;
            transform: translateX(-20px) scale(0.9);
            will-change: opacity, transform;
            width: ${CONFIG.width}px;
            height: ${CONFIG.height}px;
            contain: content !important;
        `;
        document.documentElement.appendChild(host);

        state.hostElement = host;

        const shadow = host.attachShadow({ mode: 'closed' });

        // 向日葵 HTML
        const sunflowersHtml = CONFIG.sunflowers.map(f => {
            const leafHtml = f.leaf ? `<div class="sf-leaf leaf-${f.leaf}"></div>` : '';
            return `
            <div class="sunflower" style="left: ${f.l}px; bottom: ${f.b}px; transform: scale(${f.s}); animation-delay: ${f.d}s; z-index: ${f.z};">
                <div class="flower-head"><div class="petals"></div><div class="core"></div></div>
                <div class="stem" style="height: ${f.h}px;">${leafHtml}</div>
            </div>`;
        }).join('');

        // --- 新增：Kalyna (红莓) HTML ---
        // 绘制锯齿状叶子和鲜红的浆果簇
        const kalynaHtml = CONFIG.kalynaBranches.map((k, idx) => {
            // 叶子颜色从深绿到嫩绿
            const greenVar = idx % 2 === 0 ? '#2E7D32' : '#43A047';
            return `
            <div class="kalyna-branch" style="left: ${k.l}px; bottom: ${k.b}px; transform: scale(${k.s}) rotate(${k.rot}deg); animation-delay: ${k.d}s; z-index: ${k.z};">
                <div class="k-cluster">
                    <div class="k-berry" style="background: radial-gradient(circle at 30% 30%, #ff5252, #b71c1c);"></div>
                    <div class="k-berry" style="background: radial-gradient(circle at 30% 30%, #ef5350, #c62828); width: 8px; height: 8px; left: 12px; top: 5px;"></div>
                    <div class="k-berry" style="background: radial-gradient(circle at 30% 30%, #e53935, #c62828); width: 7px; height: 7px; left: 6px; top: -4px;"></div>
                </div>
                <div class="k-leaf k-l1" style="background-color: ${greenVar};"></div>
                <div class="k-leaf k-l2" style="background-color: ${greenVar};"></div>
                <div class="k-stem"></div>
            </div>`;
        }).join('');

        shadow.innerHTML = `
        <style>
            :host { display: block; --ua-blue: ${CONFIG.colors.blue}; --ua-yellow: ${CONFIG.colors.yellow}; --pole-l: ${CONFIG.colors.poleLight}; --pole-d: ${CONFIG.colors.poleDark}; }
            .container { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; user-select: none; overflow: hidden; pointer-events: none; -webkit-user-select: none; }
            .container.ua-lifting { transform: scale(1.05); filter: drop-shadow(0 15px 20px rgba(0,0,0,0.3)); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s; z-index: 9999; }
            .drag-handle { position: absolute; left: 25px; top: 20px; width: 45px; height: 160px; z-index: 999; pointer-events: auto; cursor: move; touch-action: none; }
            .pole-system { position: absolute; left: 40px; bottom: 20px; height: 160px; display: flex; flex-direction: column; align-items: center; z-index: 100; pointer-events: none; }
            .pole-top { width: 14px; height: 14px; background: radial-gradient(circle at 35% 35%, #fff9e6 0%, var(--ua-yellow) 45%, #8b6914 100%); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.5); margin-bottom: -2px; }
            .pole-body { width: 8px; height: 100%; background: linear-gradient(to right, var(--pole-d) 0%, #8b6914 15%, var(--pole-l) 40%, #fff9e6 55%, var(--pole-l) 70%, #8b6914 85%, var(--pole-d) 100%); border-radius: 0 0 4px 4px; }
            .flag-wrapper { position: absolute; left: 44px; top: 35px; width: 150px; height: 90px; perspective: 1200px; z-index: 50; pointer-events: none; }
            .flag { width: 100%; height: 100%; transform-style: preserve-3d; transform-origin: left center; animation: cinematic-wave 6s infinite ease-in-out; will-change: transform; }
            .fabric { position: absolute; inset: 0; background: linear-gradient(to bottom, var(--ua-blue) 50%, var(--ua-yellow) 50%); border-radius: 0 4px 4px 0; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: inset 12px 0 15px rgba(0,0,0,0.5); backface-visibility: hidden; }
            .shading { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.2) 25%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.2) 75%, rgba(0,0,0,0.15) 100%); background-size: 200% 100%; animation: move-shade 4s infinite linear; mix-blend-mode: overlay; will-change: background-position; }
            .trident { width: 30px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); transform: translateZ(10px); }
            .garden { position: absolute; left: 0; bottom: 0; width: 100%; height: 85px; pointer-events: none; }

            /* --- 向日葵样式 --- */
            .sunflower { position: absolute; display: flex; flex-direction: column; align-items: center; transform-origin: bottom center; animation: flower-sway 5s infinite ease-in-out; will-change: transform; }
            .flower-head { width: 24px; height: 24px; position: relative; }
            .petals { position: absolute; inset: 0; background: radial-gradient(ellipse at center, #FFD700 35%, transparent 75%), repeating-conic-gradient(from 0deg, #FFC107 0deg 20deg, #F57F17 20deg 40deg); border-radius: 50%; }
            .petals::before { content: ''; position: absolute; inset: -3px; background: repeating-conic-gradient(from 10deg, transparent 0deg 15deg, #FFD700 15deg 35deg, transparent 35deg 40deg); border-radius: 50%; mask: radial-gradient(circle, black 40%, transparent 85%); -webkit-mask: radial-gradient(circle, black 40%, transparent 85%); }
            .core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #3E2723; border-radius: 50%; box-shadow: inset 0 0 3px #000; z-index: 2; }
            .stem { width: 2.5px; background: linear-gradient(to right, #1B5E20, #388E3C, #1B5E20); border-radius: 2px; position: relative; }
            .sf-leaf { position: absolute; width: 9px; height: 6px; background: radial-gradient(at 20% 20%, #66BB6A, #1B5E20); border-radius: 1px 80% 1px 80%; }
            .leaf-L { left: -8px; top: 12px; transform: rotate(-20deg); }
            .leaf-R { right: -8px; top: 18px; transform: scaleX(-1) rotate(-20deg); }

            /* --- Kalyna (坚韧之花) 样式 --- */
            .kalyna-branch { position: absolute; bottom: 0; display: flex; flex-direction: column; align-items: center; transform-origin: bottom center; animation: flower-sway 6s infinite ease-in-out; will-change: transform; }
            .k-cluster { position: relative; top: -4px; left: -2px; }
            .k-berry { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 0; left: 0; box-shadow: 1px 1px 2px rgba(0,0,0,0.2); }
            .k-leaf { position: absolute; width: 12px; height: 6px; border-radius: 50% 0 50% 0; /* 心形/锯齿模拟 */ clip-path: polygon(0% 100%, 50% 0%, 100% 100%); }
            .k-l1 { bottom: 4px; left: -8px; transform: rotate(-20deg); }
            .k-l2 { bottom: 6px; left: 6px; transform: scaleX(-1) rotate(-25deg); }
            .k-stem { width: 2px; height: 35px; background: linear-gradient(to right, #2E7D32, #66BB6A); transform-origin: top center; }

            .ua-paused * { animation-play-state: paused !important; }

            @keyframes cinematic-wave { 0%, 100% { transform: rotateY(12deg) rotateX(2deg); } 50% { transform: rotateY(26deg) rotateX(-2deg); } }
            @keyframes flower-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
            @keyframes move-shade { from { background-position: 0% 0; } to { background-position: 200% 0; } }
        </style>
        <div class="container">
            <div class="drag-handle" title="拖动移动，双击复位"></div>
            <div class="pole-system"><div class="pole-top"></div><div class="pole-body"></div></div>
            <div class="flag-wrapper"><div class="flag"><div class="fabric"><div class="shading"></div><img src="${TRIDENT_SVG}" class="trident" /></div></div></div>
            <div class="garden">
                ${kalynaHtml} <!-- 红梅先渲染作为背景 -->
                ${sunflowersHtml} <!-- 向日葵在前 -->
            </div>
        </div>`;

        const dragHandle = shadow.querySelector('.drag-handle');
        state.dragHandleElement = dragHandle;
        state.containerElement = shadow.querySelector('.container');

        if (dragHandle) {
            dragHandle.addEventListener('mousedown', startDrag);
            dragHandle.addEventListener('touchstart', startDrag, { passive: false });
            dragHandle.addEventListener('dblclick', resetBadgePosition);
        }

        requestAnimationFrame(() => {
            if(state.hostElement) {
                state.hostElement.style.opacity = '1';
                state.hostElement.style.transform = 'translateX(0) scale(1)';
            }
        });

        setupIntersectionObserver(host);
        setupObserver();
    }

    function setupIntersectionObserver(host) {
        if (state.intersectionObserver) state.intersectionObserver.disconnect();
        state.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) host.classList.remove('ua-paused');
                else host.classList.add('ua-paused');
            });
        }, { threshold: 0.0 });
        state.intersectionObserver.observe(host);
    }

    document.addEventListener('mousemove', onMove, { signal });
    document.addEventListener('touchmove', onMove, { passive: false, signal });
    document.addEventListener('mouseup', endDrag, { signal });
    document.addEventListener('touchend', endDrag, { signal });
    document.addEventListener('touchcancel', endDrag, { signal });

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyU') {
            if (state.hostElement) {
                if (state.intersectionObserver) {
                    state.intersectionObserver.disconnect();
                    state.intersectionObserver = null;
                }
                state.hostElement.style.opacity = '0';
                state.hostElement.style.transform = 'translateX(-20px) scale(0.9)';
                setTimeout(() => {
                    state.hostElement.remove();
                    state.hostElement = null;
                    state.isTerminated = true;
                    if (state.domObserver) state.domObserver.disconnect();
                }, 800);
            } else {
                if (!canRun()) return;
                state.isTerminated = false;
                injectBadge();
            }
        }
    }, true, { signal });

    window.addEventListener('resize', debounce(() => {
        if (!canRun()) {
            if (state.hostElement) {
                if (state.intersectionObserver) state.intersectionObserver.disconnect();
                state.hostElement.remove();
                state.hostElement = null;
            }
            state.isTerminated = true;
            if (state.domObserver) state.domObserver.disconnect();
        } else {
            if (state.isTerminated) {
                state.isTerminated = false;
                injectBadge();
            } else if (state.hostElement) {
                ensureInBounds(state.hostElement);
            }
        }
    },200), { signal });

    function setupObserver() {
        if (state.domObserver) state.domObserver.disconnect();
        if (state.isTerminated) return;
        state.domObserver = new MutationObserver(() => {
            if (state.isTerminated) { state.domObserver.disconnect(); return; }
            if (state.hostElement && document.getElementById('ua-waving-badge-root')) return;
            if (!document.getElementById('ua-waving-badge-root') && canRun()) injectBadge();
        });
        state.domObserver.observe(document.documentElement, { childList: true });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', injectBadge, { once: true, signal });
    } else {
        injectBadge();
    }

})();