// ==UserScript==
// @name         💙💛Ukrainian flag and flowers (Ctrl+Shift+U)
// @namespace    tampermonkey.net
// @version      15.2
// @description  增加两根蜡烛，去除调试代码。保持性能优化与防拖拽卡死机制。
// @author       邢智轩
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9BUkrainian%20flag%20and%20flowers%20%28Ctrl%2BShift%2BU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560536/%F0%9F%92%99%F0%9F%92%9BUkrainian%20flag%20and%20flowers%20%28Ctrl%2BShift%2BU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = '15.2-performance-optimization';

    // 防止重复初始化
    if (window.__UA_FLAG_SCRIPT_VER__ === SCRIPT_VERSION && window.__UA_FLAG_INSTANCED__) return;
    window.__UA_FLAG_INSTANCED__ = true;
    window.__UA_FLAG_SCRIPT_VER__ = SCRIPT_VERSION;

    // 清理旧版本残留
    const oldHost = document.getElementById('ua-waving-badge-root');
    if (oldHost) oldHost.remove();

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
        lastSavedPos: null,
        eventListenersAttached: false
    };

    const CONFIG = {
        width: 320,
        height: 200,
        colors: {
            blue: '#0057B7',
            yellow: '#FFD700',
            poleLight: '#FDC830',
            poleDark: '#8B6508'
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
        kalynaBranches: [
            { l: 2, b: 0, s: 0.5, d: -1.0, rot: 10, z: 148 },
            { l: 280, b: 2, s: 0.6, d: -2.5, rot: -15, z: 148 },
            { l: 55, b: 5, s: 0.7, d: -3.5, rot: 5, z: 149 },
            { l: 260, b: 10, s: 0.55, d: -0.8, rot: -10, z: 149 }
        ],
        wheatStalks: [
            { l: 5, b: 0, s: 0.7, h: 55, rot: -5, d: -2.0, z: 145 },
            { l: 25, b: 0, s: 0.5, h: 40, rot: 5, d: -3.5, z: 145 },
            { l: 295, b: 0, s: 0.6, h: 50, rot: 8, d: -1.5, z: 145 },
            { l: 300, b: 0, s: 0.4, h: 35, rot: -3, d: -4.0, z: 145 }
        ],
        candles: [
            { l: 115, b: 2, s: 0.7, z: 171 }, // 左侧蜡烛
            { l: 135, b: 2, s: 0.8, z: 170 }, // 中间蜡烛
            { l: 155, b: 2, s: 0.75, z: 169 }  // 右侧蜡烛
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

    // --- 优化：复用对象以减少 GC ---
    const _coordCache = { x: 0, y: 0 };
    const getClientCoords = (e) => {
        if (e.touches && e.touches.length > 0) {
            _coordCache.x = e.touches[0].clientX;
            _coordCache.y = e.touches[0].clientY;
        } else {
            _coordCache.x = e.clientX;
            _coordCache.y = e.clientY;
        }
        return _coordCache;
    };

    // --- 事件处理函数 ---

    const startDrag = (e) => {
        attachGlobalListeners();

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
    };

    const onMove = (e) => {
        if (!state.isDragging || !state.hostElement) return;

        if (e.type === 'touchmove') e.preventDefault();

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
        detachGlobalListeners();

        if (state.hostElement) {
            state.hostElement.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

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

    // 绑定全局事件监听器
    function attachGlobalListeners() {
        if (state.eventListenersAttached) return;

        document.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('touchmove', onMove, { passive: false });

        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        window.addEventListener('touchcancel', endDrag);

        state.eventListenersAttached = true;
    }

    // 解绑全局事件监听器
    function detachGlobalListeners() {
        if (!state.eventListenersAttached) return;

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);

        window.removeEventListener('mouseup', endDrag);
        window.removeEventListener('touchend', endDrag);
        window.removeEventListener('touchcancel', endDrag);

        state.eventListenersAttached = false;
    }

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

    // --- HTML 缓存 ---
    let cachedBadgeInnerHtml = null;

    function generateBadgeHTML() {
        if (cachedBadgeInnerHtml) return cachedBadgeInnerHtml;

        const sunflowersHtml = CONFIG.sunflowers.map(f => {
            const leafHtml = f.leaf ? `<div class="sf-leaf leaf-${f.leaf}"></div>` : '';
            return `
            <div class="sunflower" style="left: ${f.l}px; bottom: ${f.b}px; transform: scale(${f.s}); animation-delay: ${f.d}s; z-index: ${f.z};">
                <div class="flower-head"><div class="petals"></div><div class="core"></div></div>
                <div class="stem" style="height: ${f.h}px;">${leafHtml}</div>
            </div>`;
        }).join('');

        const kalynaHtml = CONFIG.kalynaBranches.map((k, idx) => {
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

        const wheatHtml = CONFIG.wheatStalks.map((w, idx) => `
            <div class="wheat-stalk" style="left: ${w.l}px; bottom: ${w.b}px; transform: scale(${w.s}) rotate(${w.rot}deg); animation-delay: ${w.d}s; z-index: ${w.z};">
                <div class="w-head">
                    <div class="w-grain r1"></div><div class="w-grain r2"></div><div class="w-grain r3"></div>
                    <div class="w-grain r4"></div><div class="w-grain r5"></div>
                </div>
                <div class="w-stem" style="height: ${w.h}px;"></div>
                <div class="w-leaf"></div>
            </div>
        `).join('');

        const candleHtml = CONFIG.candles.map(c => `
            <div class="candle-setup" style="left: ${c.l}px; bottom: ${c.b}px; transform: scale(${c.s}); z-index: ${c.z};">
                <div class="c-flame"><div class="f-inner"></div></div>
                <div class="c-wick"></div>
                <div class="c-wax"></div>
                <div class="c-glow"></div>
            </div>
        `).join('');

        cachedBadgeInnerHtml = `
        <style>
            :host { display: block; --ua-blue: ${CONFIG.colors.blue}; --ua-yellow: ${CONFIG.colors.yellow}; --pole-l: ${CONFIG.colors.poleLight}; --pole-d: ${CONFIG.colors.poleDark}; }
            .container { position: relative; width: 100%; height: 100%; display: flex; align-items: flex-end; user-select: none; overflow: hidden; pointer-events: none; -webkit-user-select: none; }
            .drag-handle { position: absolute; left: 25px; top: 20px; width: 45px; height: 160px; z-index: 999; pointer-events: auto; cursor: move; touch-action: none; }

            /* Pole & Flag */
            .pole-system { position: absolute; left: 40px; bottom: 20px; height: 160px; display: flex; flex-direction: column; align-items: center; z-index: 100; pointer-events: none; }
            .pole-top { width: 14px; height: 14px; background: radial-gradient(circle at 35% 35%, #FFFACD 0%, var(--ua-yellow) 45%, #C5A059 100%); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.4); margin-bottom: -2px; }
            .pole-body { width: 8px; height: 100%; background: linear-gradient(to right, var(--pole-d) 0%, #B8860B 15%, var(--pole-l) 40%, #FFF8E1 55%, var(--pole-l) 70%, #B8860B 85%, var(--pole-d) 100%); border-radius: 0 0 4px 4px; }

            .flag-wrapper { position: absolute; left: 44px; top: 32px; width: 150px; height: 90px; perspective: 1200px; z-index: 50; pointer-events: none; }

            .flag { width: 100%; height: 100%; transform-style: preserve-3d; transform-origin: left center; animation: cinematic-wave 6s infinite ease-in-out; will-change: transform; }
            .fabric { position: absolute; inset: 0; background: linear-gradient(to bottom, var(--ua-blue) 50%, var(--ua-yellow) 50%); border-radius: 0 4px 4px 0; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: inset 12px 0 15px rgba(0,0,0,0.5); backface-visibility: hidden; }

            .shading {
                position: absolute; inset: 0;
                background: linear-gradient(90deg,
                    rgba(0,0,0,0.05) 0%,
                    rgba(255,255,255,0.15) 25%,
                    rgba(0,0,0,0.1) 50%,
                    rgba(255,255,255,0.15) 75%,
                    rgba(0,0,0,0.05) 100%
                );
                background-size: 200% 100%;
                animation: move-shade 4s infinite linear;
                pointer-events: none;
            }

            .trident { width: 30px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); transform: translateZ(10px); }
            .garden { position: absolute; left: 0; bottom: 0; width: 100%; height: 85px; pointer-events: none; }

            /* Sunflowers */
            .sunflower { position: absolute; display: flex; flex-direction: column; align-items: center; transform-origin: bottom center; animation: flower-sway 5s infinite ease-in-out; will-change: transform; }
            .flower-head { width: 24px; height: 24px; position: relative; }
            .petals { position: absolute; inset: 0; background: radial-gradient(ellipse at center, #FFD700 35%, transparent 75%), repeating-conic-gradient(from 0deg, #FFC107 0deg 20deg, #F57F17 20deg 40deg); border-radius: 50%; }
            .petals::before { content: ''; position: absolute; inset: -3px; background: repeating-conic-gradient(from 10deg, transparent 0deg 15deg, #FFD700 15deg 35deg, transparent 35deg 40deg); border-radius: 50%; mask: radial-gradient(circle, black 40%, transparent 85%); -webkit-mask: radial-gradient(circle, black 40%, transparent 85%); }
            .core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #3E2723; border-radius: 50%; box-shadow: inset 0 0 3px #000; z-index: 2; }
            .stem { width: 2.5px; background: linear-gradient(to right, #1B5E20, #388E3C, #1B5E20); border-radius: 2px; position: relative; }
            .sf-leaf { position: absolute; width: 9px; height: 6px; background: radial-gradient(at 20% 20%, #66BB6A, #1B5E20); border-radius: 1px 80% 1px 80%; }
            .leaf-L { left: -8px; top: 12px; transform: rotate(-20deg); }
            .leaf-R { right: -8px; top: 18px; transform: scaleX(-1) rotate(-20deg); }

            /* Kalyna */
            .kalyna-branch { position: absolute; bottom: 0; display: flex; flex-direction: column; align-items: center; transform-origin: bottom center; animation: flower-sway 6s infinite ease-in-out; will-change: transform; }
            .k-cluster { position: relative; top: -4px; left: -2px; }
            .k-berry { width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 0; left: 0; box-shadow:1px 1px 2px rgba(0,0,0,0.2); }
            .k-leaf { position: absolute; width: 12px; height: 6px; border-radius: 50% 0 50% 0; clip-path: polygon(0% 100%, 50% 0%, 100% 100%); }
            .k-l1 { bottom: 4px; left: -8px; transform: rotate(-20deg); }
            .k-l2 { bottom: 6px; left: 6px; transform: scaleX(-1) rotate(-25deg); }
            .k-stem { width: 2px; height: 35px; background: linear-gradient(to right, #2E7D32, #66BB6A); transform-origin: top center; }

            /* Wheat */
            .wheat-stalk { position: absolute; bottom: 0; display: flex; flex-direction: column; align-items: center; transform-origin: bottom center; animation: flower-sway 7s infinite ease-in-out; will-change: transform; }
            .w-head { position: relative; width: 10px; height: 25px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; margin-bottom: -2px; }
            .w-grain { width: 6px; height: 8px; background: radial-gradient(circle at 30% 30%, #FFECB3, #FFB300); border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; position: absolute; box-shadow:1px 1px 2px rgba(0,0,0,0.2); }
            .r1 { transform: rotate(-15deg) translateX(-4px); top: 0; }
            .r2 { transform: rotate(15deg) translateX(4px); top: 2px; }
            .r3 { top: 5px; z-index: 2; width: 7px; height: 9px; }
            .r4 { transform: rotate(-10deg) translateX(-3px); top: 9px; }
            .r5 { transform: rotate(10deg) translateX(3px); top: 11px; }
            .w-stem { width: 2px; background: linear-gradient(to right, #E6EE9C, #CDDC39); position: relative; }
            .w-leaf { position: absolute; width: 12px; height: 3px; background: #CDDC39; bottom: 10px; left: -10px; transform: rotate(-20deg); border-radius: 50% 0 50% 0; }

            /* Candle */
            .candle-setup { position: absolute; display: flex; flex-direction: column; align-items: center; }
            .c-wax { width: 14px; height: 20px; background: linear-gradient(to right, #fafafa, #e0e0e0, #bdbdbd); border-radius: 2px; box-shadow: inset -2px 0 5px rgba(0,0,0,0.1); }
            .c-wick { width: 2px; height: 6px; background: #333; margin-bottom: -2px; }
            .c-flame { width: 10px; height: 18px; background: radial-gradient(ellipse at 50% 85%, #FFFFFF 10%, #ffeb3b 40%, #ff9800 90%, #bf360c 100%); border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; transform-origin: center bottom; animation: flicker 0.15s infinite alternate; position: relative; top: -2px; }
            .f-inner { position: absolute; bottom: 2px; left: 3px; width: 4px; height: 6px; background: rgba(255,255,255,0.9); border-radius: 50%; filter: blur(1px); }
            .c-glow { position: absolute; top: -50px; left: -30px; width: 70px; height: 70px; background: radial-gradient(circle, rgba(255, 235, 59, 0.35) 0%, transparent 60%); animation: glow-pulse 3s infinite ease-in-out; pointer-events: none; mix-blend-mode: screen; }

            .ua-paused * { animation-play-state: paused !important; }

            @keyframes cinematic-wave { 0%, 100% { transform: rotateY(12deg) rotateX(2deg); } 50% { transform: rotateY(26deg) rotateX(-2deg); } }
            @keyframes flower-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
            @keyframes move-shade { from { background-position: 0% 0; } to { background-position: 200% 0; } }
            @keyframes flicker { 0% { transform: scale(1) rotate(-2deg); } 100% { transform: scale(1.02) rotate(2deg); } }
            @keyframes glow-pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
        </style>
        <div class="container">
            <div class="drag-handle" title="拖动移动，双击复位"></div>
            <div class="pole-system"><div class="pole-top"></div><div class="pole-body"></div></div>
            <div class="flag-wrapper"><div class="flag"><div class="fabric"><div class="shading"></div><img src="${TRIDENT_SVG}" class="trident" /></div></div></div>
            <div class="garden">
                ${wheatHtml}
                ${kalynaHtml}
                ${sunflowersHtml}
                ${candleHtml}
            </div>
        </div>`;

        return cachedBadgeInnerHtml;
    }

    function injectBadge() {
        if (!canRun()) return;

        // 优先检查内存中的引用，并使用 isConnected 检查 DOM 状态
        if (state.hostElement && state.hostElement.isConnected) {
            if (!state.dragHandleElement) {
                 state.dragHandleElement = state.hostElement.shadowRoot.querySelector('.drag-handle');
            }
            if (!state.containerElement) {
                 state.containerElement = state.hostElement.shadowRoot.querySelector('.container');
            }
            setupIntersectionObserver(state.hostElement);
            return;
        }

        // 引用不存在或已从 DOM 移除，清理引用
        if (state.hostElement && !state.hostElement.isConnected) {
            state.hostElement = null;
        }

        // 如果引用为空，才进行 ID 查询
        const existingHost = document.getElementById('ua-waving-badge-root');
        if (existingHost) {
             state.hostElement = existingHost;
             state.dragHandleElement = state.hostElement.shadowRoot.querySelector('.drag-handle');
             state.containerElement = state.hostElement.shadowRoot.querySelector('.container');
             setupIntersectionObserver(state.hostElement);
             return;
        }

        // --- 创建新元素 ---
        const host = document.createElement('div');
        host.id = 'ua-waving-badge-root';
        host.setAttribute('aria-hidden', 'true');
        host.lang = "uk";
        host.title = "乌克兰 - Ukraine";

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
        shadow.innerHTML = generateBadgeHTML();

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

    function destroyBadge() {
        if (state.rafId) cancelAnimationFrame(state.rafId);

        if (state.intersectionObserver) {
            state.intersectionObserver.disconnect();
            state.intersectionObserver = null;
        }
        if (state.domObserver) {
            state.domObserver.disconnect();
            state.domObserver = null;
        }
        if (state.hostElement) {
            state.hostElement.remove();
            state.hostElement = null;
        }

        detachGlobalListeners();

        state.isTerminated = true;
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

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyU') {
            if (state.hostElement) {
                destroyBadge();
            } else {
                if (!canRun()) return;
                state.isTerminated = false;
                injectBadge();
            }
        }
    }, true);

    window.addEventListener('resize', debounce(() => {
        if (!canRun()) {
            if (state.hostElement) {
                destroyBadge();
            }
        } else {
            if (state.isTerminated) {
                state.isTerminated = false;
                injectBadge();
            } else if (state.hostElement) {
                ensureInBounds(state.hostElement);
            }
        }
    }, 200));

    function setupObserver() {
        if (state.domObserver) state.domObserver.disconnect();
        if (state.isTerminated) return;

        state.domObserver = new MutationObserver((mutations) => {
            if (state.isTerminated) { state.domObserver.disconnect(); return; }

            // 性能优化：只检测我们的元素是否被移除
            const wasRemoved = mutations.some(mutation =>
                Array.from(mutation.removedNodes).includes(state.hostElement)
            );

            if (wasRemoved) {
                state.hostElement = null;
                if (canRun()) {
                    injectBadge();
                }
                return;
            }
        });

        state.domObserver.observe(document.documentElement, { childList: true, subtree: false });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', injectBadge, { once: true });
    } else {
        injectBadge();
    }

})();