// ==UserScript==
// @name         Linux.do 自动滚动
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  Apple Design・丝滑滚动・智能懒加载・屏幕常亮
// @author       Luxury Scroll Team
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558891/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558891/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        baseSpeed: 180,
        speeds: [1, 1.5, 2, 3],
        speedIndex: GM_getValue('speedIndex', 0),
        preloadInterval: 2500,
        waitTimeout: 5000,
        capsuleSize: 44,
        panelW: 52,
        panelH: 180,
        margin: 12,
    };

    const state = {
        isActive: false,
        isScrolling: false,
        direction: GM_getValue('direction', 0),
        hasStartedOnce: false,
        isWaiting: false,
        isDragging: false,
        waitStartTime: 0,
        lastDocHeight: 0,
        rafId: null,
        lastTimestamp: 0,
        subPixel: 0,
        wakeLock: null,
        preloadTimer: null,
        checkTimer: null,
    };

    const css = `
        #as-lux {
            position: fixed;
            z-index: 2147483647;
            width: ${CONFIG.capsuleSize}px;
            height: ${CONFIG.capsuleSize}px;
            border-radius: 22px;
            background: rgba(28,28,30,0.72);
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            box-shadow: 0 2px 16px rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(255,255,255,0.1);
            cursor: pointer;
            user-select: none;
            touch-action: none;
            will-change: transform, width, height;
            transition: width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1), border-radius 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease;
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }
        #as-lux.active {
            width: ${CONFIG.panelW}px;
            height: ${CONFIG.panelH}px;
            border-radius: 26px;
        }
        #as-lux.scrolling {
            box-shadow: 0 4px 24px rgba(255,255,255,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.15);
        }
        #as-lux.waiting {
            box-shadow: 0 4px 24px rgba(120,200,255,0.15), inset 0 0 0 0.5px rgba(120,200,255,0.2);
        }
        .as-icon {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%,-50%);
            width: 20px; height: 20px;
            opacity: 1;
            transition: opacity 0.25s ease, transform 0.25s ease;
            fill: rgba(255,255,255,0.85);
        }
        #as-lux.active .as-icon { opacity: 0; transform: translate(-50%,-50%) scale(0.5); pointer-events: none; }
        .as-panel {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 12px 0;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
            pointer-events: none;
        }
        #as-lux.active .as-panel { opacity: 1; transform: scale(1); pointer-events: auto; }
        .as-btn {
            width: 36px; height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: rgba(255,255,255,0.7);
            transition: background 0.2s ease, transform 0.15s ease, color 0.2s ease;
            cursor: pointer;
        }
        .as-btn:active { transform: scale(0.92); }
        .as-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.95); }
        .as-btn.active-dir { color: rgba(120,200,255,0.95); background: rgba(120,200,255,0.15); }
        .as-btn svg { width: 18px; height: 18px; fill: currentColor; pointer-events: none; }
        .as-speed {
            font: 600 11px/1 -apple-system, BlinkMacSystemFont, sans-serif;
            color: rgba(255,255,255,0.9);
            letter-spacing: 0.3px;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 8px;
            transition: background 0.2s ease;
        }
        .as-speed:hover { background: rgba(255,255,255,0.1); }
        .as-speed:active { transform: scale(0.95); }
        @media (prefers-color-scheme: light) {
            #as-lux {
                background: rgba(255,255,255,0.78);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1), inset 0 0 0 0.5px rgba(0,0,0,0.06);
            }
            #as-lux.scrolling { box-shadow: 0 4px 28px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(0,0,0,0.08); }
            #as-lux.waiting { box-shadow: 0 4px 28px rgba(0,120,255,0.12), inset 0 0 0 0.5px rgba(0,120,255,0.15); }
            .as-icon { fill: rgba(0,0,0,0.75); }
            .as-btn { color: rgba(0,0,0,0.6); }
            .as-btn:hover { background: rgba(0,0,0,0.06); color: rgba(0,0,0,0.9); }
            .as-btn.active-dir { color: rgba(0,120,255,0.95); background: rgba(0,120,255,0.1); }
            .as-speed { color: rgba(0,0,0,0.85); }
            .as-speed:hover { background: rgba(0,0,0,0.06); }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'as-lux';

    const savedX = GM_getValue('posX', null);
    const savedY = GM_getValue('posY', null);
    const initX = savedX !== null ? savedX : window.innerWidth - CONFIG.capsuleSize - CONFIG.margin;
    const initY = savedY !== null ? savedY : Math.round(window.innerHeight / 2 - CONFIG.capsuleSize / 2);
    widget.style.left = initX + 'px';
    widget.style.top = initY + 'px';

    widget.innerHTML = `
        <svg class="as-icon" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        <div class="as-panel">
            <div class="as-btn" data-action="up" title="向上滚动">
                <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
            </div>
            <div class="as-btn" data-action="toggle" title="暂停">
                <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </div>
            <div class="as-btn" data-action="down" title="向下滚动">
                <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
            </div>
            <div class="as-speed" data-action="speed" title="点击切换速度">${CONFIG.speeds[CONFIG.speedIndex]}x</div>
            <div class="as-btn" data-action="close" title="关闭">
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const upBtn = widget.querySelector('[data-action="up"]');
    const toggleBtn = widget.querySelector('[data-action="toggle"]');
    const downBtn = widget.querySelector('[data-action="down"]');
    const speedEl = widget.querySelector('[data-action="speed"]');
    const closeBtn = widget.querySelector('[data-action="close"]');

    // ==================== Wake Lock ====================
    async function requestWakeLock() {
        if (!('wakeLock' in navigator)) return;
        try {
            state.wakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {}
    }

    async function releaseWakeLock() {
        if (state.wakeLock) {
            try { await state.wakeLock.release(); } catch (e) {}
            state.wakeLock = null;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && state.isScrolling) {
            requestWakeLock();
        }
    });

    // ==================== 工具函数 ====================
    function getDocHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
        );
    }

    function getScrollY() {
        return window.scrollY || window.pageYOffset;
    }

    function getMaxScroll() {
        return getDocHeight() - window.innerHeight;
    }

    function updateDirectionUI() {
        upBtn.classList.toggle('active-dir', state.direction === -1 && state.isScrolling);
        downBtn.classList.toggle('active-dir', state.direction === 1 && state.isScrolling);
    }

    // ==================== 预加载（独立定时器） ====================
    function preloadByJump() {
        const currentY = getScrollY();
        const maxScroll = getMaxScroll();
        if (maxScroll - currentY < 100) return;
        
        window.scrollTo({ top: maxScroll, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll', { bubbles: true }));
        window.scrollTo({ top: currentY, behavior: 'instant' });
    }

    function startPreloadTimer() {
        if (state.preloadTimer) clearInterval(state.preloadTimer);
        state.preloadTimer = setInterval(() => {
            if (state.isScrolling && state.direction === 1 && !state.isWaiting) {
                preloadByJump();
            }
        }, CONFIG.preloadInterval);
    }

    function stopPreloadTimer() {
        if (state.preloadTimer) {
            clearInterval(state.preloadTimer);
            state.preloadTimer = null;
        }
    }

    // ==================== 边界检测（独立定时器） ====================
    function checkBoundary() {
        if (!state.isScrolling) return;

        const scrollY = getScrollY();
        const maxScroll = getMaxScroll();
        const docH = getDocHeight();

        // 向上到顶
        if (state.direction === -1 && scrollY <= 5) {
            pauseAndCollapse();
            return;
        }

        // 向下逻辑
        if (state.direction === 1) {
            const remaining = maxScroll - scrollY;

            if (state.isWaiting) {
                const newDocH = getDocHeight();
                if (newDocH > state.lastDocHeight + 20) {
                    state.isWaiting = false;
                    state.lastDocHeight = newDocH;
                    widget.classList.remove('waiting');
                    widget.classList.add('scrolling');
                } else if (Date.now() - state.waitStartTime > CONFIG.waitTimeout) {
                    pauseAndCollapse();
                }
                return;
            }

            if (remaining <= 5) {
                state.isWaiting = true;
                state.waitStartTime = Date.now();
                state.lastDocHeight = docH;
                widget.classList.remove('scrolling');
                widget.classList.add('waiting');
                window.dispatchEvent(new Event('scroll', { bubbles: true }));
            }
        }
    }

    function startCheckTimer() {
        if (state.checkTimer) clearInterval(state.checkTimer);
        state.checkTimer = setInterval(checkBoundary, 200);
    }

    function stopCheckTimer() {
        if (state.checkTimer) {
            clearInterval(state.checkTimer);
            state.checkTimer = null;
        }
    }

    // ==================== 核心滚动循环（极简纯净） ====================
    function scrollTick(timestamp) {
        if (!state.isScrolling || state.isWaiting) {
            state.rafId = requestAnimationFrame(scrollTick);
            return;
        }

        // 首帧初始化
        if (state.lastTimestamp === 0) {
            state.lastTimestamp = timestamp;
            state.rafId = requestAnimationFrame(scrollTick);
            return;
        }

        // 计算时间差（秒）
        const dt = (timestamp - state.lastTimestamp) / 1000;
        state.lastTimestamp = timestamp;

        // 防止异常大的时间差（切换标签页回来等情况）
        if (dt > 0.1) {
            state.rafId = requestAnimationFrame(scrollTick);
            return;
        }

        // 计算精确像素位移（含亚像素累积）
        const speed = CONFIG.baseSpeed * CONFIG.speeds[CONFIG.speedIndex];
        const exactPixels = speed * dt * state.direction;
        
        state.subPixel += exactPixels;
        
        // 只有累积到整数像素才滚动
        const intPixels = Math.trunc(state.subPixel);
        if (intPixels !== 0) {
            state.subPixel -= intPixels;
            window.scrollBy(0, intPixels);
        }

        state.rafId = requestAnimationFrame(scrollTick);
    }

    // ==================== 控制函数 ====================
    function startScroll(dir) {
        state.direction = dir;
        GM_setValue('direction', dir);
        state.hasStartedOnce = true;
        
        state.isScrolling = true;
        state.isWaiting = false;
        state.lastTimestamp = 0;
        state.subPixel = 0;
        state.lastDocHeight = getDocHeight();
        
        widget.classList.add('scrolling');
        widget.classList.remove('waiting');
        updateDirectionUI();

        requestWakeLock();
        startPreloadTimer();
        startCheckTimer();
        
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.rafId = requestAnimationFrame(scrollTick);
    }

    function stopScroll() {
        state.isScrolling = false;
        state.isWaiting = false;
        
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = null;
        }
        
        stopPreloadTimer();
        stopCheckTimer();
        releaseWakeLock();
        
        widget.classList.remove('scrolling', 'waiting');
        upBtn.classList.remove('active-dir');
        downBtn.classList.remove('active-dir');
    }

    function pauseAndCollapse() {
        stopScroll();
        closePanel();
    }

    function snapToEdge() {
        const rect = widget.getBoundingClientRect();
        const w = state.isActive ? CONFIG.panelW : CONFIG.capsuleSize;
        const h = state.isActive ? CONFIG.panelH : CONFIG.capsuleSize;
        const sw = window.innerWidth;
        const sh = window.innerHeight;

        let x = rect.left + w / 2 < sw / 2 ? CONFIG.margin : sw - w - CONFIG.margin;
        let y = Math.max(CONFIG.margin, Math.min(rect.top, sh - h - CONFIG.margin));

        widget.style.left = x + 'px';
        widget.style.top = y + 'px';
        GM_setValue('posX', x);
        GM_setValue('posY', y);
    }

    function openPanel() {
        const sw = window.innerWidth;
        const sh = window.innerHeight;

        let x = parseFloat(widget.style.left);
        let y = parseFloat(widget.style.top);

        if (x + CONFIG.panelW > sw - CONFIG.margin) x = sw - CONFIG.panelW - CONFIG.margin;
        if (y + CONFIG.panelH > sh - CONFIG.margin) y = sh - CONFIG.panelH - CONFIG.margin;
        y = Math.max(CONFIG.margin, y);

        widget.style.left = x + 'px';
        widget.style.top = y + 'px';

        state.isActive = true;
        widget.classList.add('active');
        
        if (state.hasStartedOnce && state.direction !== 0) {
            setTimeout(() => startScroll(state.direction), 200);
        }
    }

    function closePanel() {
        state.isActive = false;
        widget.classList.remove('active');
        stopScroll();
        setTimeout(snapToEdge, 250);
    }

    // ==================== 拖拽 ====================
    let drag = { sx: 0, sy: 0, ox: 0, oy: 0, moved: false };

    function onStart(e) {
        if (e.target.closest('.as-btn') || e.target.closest('.as-speed')) return;
        state.isDragging = true;
        drag.moved = false;
        const pt = e.touches ? e.touches[0] : e;
        drag.sx = pt.clientX;
        drag.sy = pt.clientY;
        drag.ox = parseFloat(widget.style.left);
        drag.oy = parseFloat(widget.style.top);
        widget.style.transition = 'box-shadow 0.3s ease';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    }

    function onMove(e) {
        if (!state.isDragging) return;
        e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        const dx = pt.clientX - drag.sx;
        const dy = pt.clientY - drag.sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
        widget.style.left = (drag.ox + dx) + 'px';
        widget.style.top = (drag.oy + dy) + 'px';
    }

    function onEnd() {
        state.isDragging = false;
        widget.style.transition = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchend', onEnd);
        if (!drag.moved && !state.isActive) {
            openPanel();
        } else if (drag.moved) {
            snapToEdge();
        }
    }

    widget.addEventListener('mousedown', onStart);
    widget.addEventListener('touchstart', onStart, { passive: false });

    // ==================== 按钮事件 ====================
    upBtn.addEventListener('click', e => { e.stopPropagation(); startScroll(-1); });
    toggleBtn.addEventListener('click', e => { e.stopPropagation(); pauseAndCollapse(); });
    downBtn.addEventListener('click', e => { e.stopPropagation(); startScroll(1); });
    
    speedEl.addEventListener('click', e => {
        e.stopPropagation();
        CONFIG.speedIndex = (CONFIG.speedIndex + 1) % CONFIG.speeds.length;
        speedEl.textContent = CONFIG.speeds[CONFIG.speedIndex] + 'x';
        GM_setValue('speedIndex', CONFIG.speedIndex);
    });
    
    closeBtn.addEventListener('click', e => { e.stopPropagation(); closePanel(); });

    window.addEventListener('resize', snapToEdge);
})();