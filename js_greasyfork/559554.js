// ==UserScript==
// @name         Custom Cursor Overlay (Ultra Early, iPadOS Size)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.3.0
// @description  Ultra-early custom cursor overlay: upload image, set tip, angle, size, auto iPadOS-scale, force-hide system cursor, live preview.
// @author       You
// @match        http://*/*
// @match        https://*/*
// @match        file://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559554/Custom%20Cursor%20Overlay%20%28Ultra%20Early%2C%20iPadOS%20Size%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559554/Custom%20Cursor%20Overlay%20%28Ultra%20Early%2C%20iPadOS%20Size%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************************************************************
     * Storage abstraction
     ********************************************************************/
    const PREFIX = 'ccov_';
    const useGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

    function setStore(key, value) {
        const full = PREFIX + key;
        if (useGM) {
            try { GM_setValue(full, value); return; } catch (e) {}
        }
        try { localStorage.setItem(full, JSON.stringify(value)); } catch (e) {}
    }

    function getStore(key, def) {
        const full = PREFIX + key;
        if (useGM) {
            try {
                const v = GM_getValue(full);
                return typeof v === 'undefined' ? def : v;
            } catch (e) {}
        }
        try {
            const raw = localStorage.getItem(full);
            if (raw == null) return def;
            return JSON.parse(raw);
        } catch (e) {
            return def;
        }
    }

    /********************************************************************
     * State
     ********************************************************************/
    const state = {
        dataUrl: getStore('dataUrl', null),
        tipX:    getStore('tipX', 0),
        tipY:    getStore('tipY', 0),
        angle:   getStore('angle', 0),
        scale:   getStore('scale', 1.0),
        imgW:    getStore('imgW', 32),
        imgH:    getStore('imgH', 32)
    };

    /********************************************************************
     * Ultra-early CSS (hide system cursor everywhere)
     ********************************************************************/
    (function injectEarlyCSS() {
        const css = `
            html, body, * {
                cursor: none !important;
            }

            .ccov-toggle {
                position: fixed;
                bottom: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(20,20,20,0.9);
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                z-index: 2147483646;
                user-select: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            }

            .ccov-panel {
                position: fixed;
                bottom: 56px;
                right: 12px;
                width: 320px;
                max-width: calc(100vw - 24px);
                background: rgba(12,12,12,0.96);
                color: #eee;
                border-radius: 12px;
                padding: 12px;
                z-index: 2147483646;
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.06);
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            }

            .ccov-preview {
                width: 100%;
                height: 140px;
                background: radial-gradient(circle at 20% 20%, #222 0, #111 45%, #050505 100%);
                border-radius: 10px;
                margin-top: 6px;
                border: 1px solid rgba(255,255,255,0.04);
                overflow: hidden;
            }

            .ccov-cursor {
                position: fixed;
                left: 0;
                top: 0;
                z-index: 2147483647;
                pointer-events: none;
                image-rendering: pixelated;
                transform-origin: 0 0;
            }

            .ccov-row {
                display: flex;
                gap: 8px;
                margin-top: 6px;
                align-items: center;
            }

            .ccov-label {
                font-size: 12px;
                opacity: 0.7;
                margin-top: 6px;
            }

            .ccov-range-value {
                font-size: 11px;
                min-width: 40px;
                text-align: right;
            }

            .ccov-button {
                padding: 6px 10px;
                font-size: 11px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15);
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                color: #f9fafb;
                cursor: pointer;
                user-select: none;
            }

            .ccov-button:active {
                transform: translateY(1px);
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        // This works even before DOMContentLoaded
        (document.head || document.documentElement).appendChild(style);
    })();

    /********************************************************************
     * Ultra-early cursor overlay & pointer tracking
     ********************************************************************/
    let cursorEl = null;
    let lastX = null, lastY = null;

    function ensureCursor() {
        if (!cursorEl) {
            cursorEl = document.createElement('img');
            cursorEl.className = 'ccov-cursor';
            cursorEl.draggable = false;
            document.documentElement.appendChild(cursorEl);
        }
        return cursorEl;
    }

    function applyCursor() {
        if (!state.dataUrl) return;
        const el = ensureCursor();
        el.src = state.dataUrl;
        el.style.transformOrigin = `${state.tipX}px ${state.tipY}px`;
        el.style.transform = `rotate(${state.angle}deg) scale(${state.scale})`;
    }

    function moveCursor(x, y) {
        lastX = x;
        lastY = y;
        if (!cursorEl || !state.dataUrl) return;
        cursorEl.style.left = (x - state.tipX * state.scale) + 'px';
        cursorEl.style.top  = (y - state.tipY * state.scale) + 'px';
    }

    (function installUltraEarlyPointer() {
        window.addEventListener('pointermove', e => moveCursor(e.clientX, e.clientY), { passive: true });
        window.addEventListener('mousemove', e => moveCursor(e.clientX, e.clientY), { passive: true });
        // Create cursor overlay immediately if we already have an image
        if (state.dataUrl) {
            ensureCursor();
            applyCursor();
        }
    })();

    /********************************************************************
     * Settings UI & Preview (created when DOM is ready)
     ********************************************************************/
    let panel, previewCanvas, previewCtx, angleSlider, angleVal, sizeSlider, sizeVal;

    const previewImg = new Image();
    previewImg.onload = function() {
        state.imgW = previewImg.naturalWidth || state.imgW;
        state.imgH = previewImg.naturalHeight || state.imgH;
        setStore('imgW', state.imgW);
        setStore('imgH', state.imgH);
        redrawPreview();
        applyCursor();
    };

    function openPanel() {
        if (panel) {
            panel.style.display = 'block';
            return;
        }

        // Toggle
        const toggle = document.createElement('div');
        toggle.className = 'ccov-toggle';
        toggle.textContent = '⚙︎';
        toggle.onclick = () => {
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        };
        document.documentElement.appendChild(toggle);

        panel = document.createElement('div');
        panel.className = 'ccov-panel';

        // Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        const title = document.createElement('div');
        title.textContent = 'Custom Cursor Overlay';
        title.style.fontSize = '13px';
        title.style.opacity = '0.8';
        const close = document.createElement('div');
        close.textContent = '✕';
        close.style.cursor = 'pointer';
        close.onclick = () => { panel.style.display = 'none'; };
        header.appendChild(title);
        header.appendChild(close);
        panel.appendChild(header);

        // Upload
        const upLabel = document.createElement('div');
        upLabel.className = 'ccov-label';
        upLabel.textContent = 'Cursor image (PNG recommended)';
        panel.appendChild(upLabel);

        const file = document.createElement('input');
        file.type = 'file';
        file.accept = 'image/*';
        file.style.width = '100%';
        file.onchange = e => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = ev => {
                state.dataUrl = ev.target.result;
                setStore('dataUrl', state.dataUrl);
                previewImg.src = state.dataUrl;

                // reset tip
                state.tipX = 0;
                state.tipY = 0;
                setStore('tipX', state.tipX);
                setStore('tipY', state.tipY);

                // auto-scale to iPadOS size (24px width)
                const target = 24;
                if (state.imgW > 0) {
                    state.scale = target / state.imgW;
                    setStore('scale', state.scale);
                }

                if (sizeSlider && sizeVal) {
                    sizeSlider.value = state.scale;
                    sizeVal.textContent = Math.round(state.scale * 100) + '%';
                }

                redrawPreview();
                applyCursor();
            };
            r.readAsDataURL(f);
        };
        panel.appendChild(file);

        // Preview
        const preview = document.createElement('div');
        preview.className = 'ccov-preview';
        previewCanvas = document.createElement('canvas');
        preview.appendChild(previewCanvas);
        panel.appendChild(preview);

        previewCtx = previewCanvas.getContext('2d');
        resizePreview();
        window.addEventListener('resize', resizePreview);

        previewCanvas.onclick = e => {
            if (!state.dataUrl) return;
            const rect = previewCanvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const info = computeScaleInfo();

            const imgX = (cx - info.offsetX) / (info.scale * state.scale);
            const imgY = (cy - info.offsetY) / (info.scale * state.scale);

            state.tipX = Math.max(0, Math.min(state.imgW, imgX));
            state.tipY = Math.max(0, Math.min(state.imgH, imgY));
            setStore('tipX', state.tipX);
            setStore('tipY', state.tipY);

            redrawPreview();
            applyCursor();
        };

        // Angle label
        const angLabel = document.createElement('div');
        angLabel.className = 'ccov-label';
        angLabel.textContent = 'Angle';
        panel.appendChild(angLabel);

        // Angle slider
        angleSlider = document.createElement('input');
        angleSlider.type = 'range';
        angleSlider.min = '0';
        angleSlider.max = '360';
        angleSlider.step = '1';
        angleSlider.value = state.angle;

        angleVal = document.createElement('div');
        angleVal.className = 'ccov-range-value';
        angleVal.textContent = state.angle + '°';

        angleSlider.oninput = () => {
            state.angle = parseInt(angleSlider.value, 10) || 0;
            setStore('angle', state.angle);
            angleVal.textContent = state.angle + '°';
            redrawPreview();
            applyCursor();
        };

        const angRow = document.createElement('div');
        angRow.className = 'ccov-row';
        angRow.appendChild(angleSlider);
        angRow.appendChild(angleVal);
        panel.appendChild(angRow);

        // Size label
        const szLabel = document.createElement('div');
        szLabel.className = 'ccov-label';
        szLabel.textContent = 'Cursor size';
        panel.appendChild(szLabel);

        // Size slider
        sizeSlider = document.createElement('input');
        sizeSlider.type = 'range';
        sizeSlider.min = '0.1';
        sizeSlider.max = '3.0';
        sizeSlider.step = '0.01';
        sizeSlider.value = state.scale;

        sizeVal = document.createElement('div');
        sizeVal.className = 'ccov-range-value';
        sizeVal.textContent = Math.round(state.scale * 100) + '%';

        sizeSlider.oninput = () => {
            state.scale = parseFloat(sizeSlider.value) || 1.0;
            setStore('scale', state.scale);
            sizeVal.textContent = Math.round(state.scale * 100) + '%';
            redrawPreview();
            applyCursor();
        };

        const szRow = document.createElement('div');
        szRow.className = 'ccov-row';
        szRow.appendChild(sizeSlider);
        szRow.appendChild(sizeVal);
        panel.appendChild(szRow);

        // Match iPadOS size button (24px)
        const matchBtn = document.createElement('button');
        matchBtn.className = 'ccov-button';
        matchBtn.style.marginTop = '8px';
        matchBtn.textContent = 'Match iPadOS Cursor Size (24px)';
        matchBtn.onclick = () => {
            const target = 24;
            if (state.imgW > 0) {
                state.scale = target / state.imgW;
                setStore('scale', state.scale);
                sizeSlider.value = state.scale;
                sizeVal.textContent = Math.round(state.scale * 100) + '%';
                redrawPreview();
                applyCursor();
            }
        };
        panel.appendChild(matchBtn);

        // Save & apply button (mostly just refreshes cursor with current state)
        const saveBtn = document.createElement('button');
        saveBtn.className = 'ccov-button';
        saveBtn.style.marginTop = '6px';
        saveBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        saveBtn.textContent = 'Save & Apply';
        saveBtn.onclick = () => {
            applyCursor();
            if (lastX != null && lastY != null) moveCursor(lastX, lastY);
        };
        panel.appendChild(saveBtn);

        document.documentElement.appendChild(panel);

        // Load existing image into preview if we have one
        if (state.dataUrl) {
            previewImg.src = state.dataUrl;
        } else {
            redrawPreview();
        }
    }

    /********************************************************************
     * Preview rendering
     ********************************************************************/
    function resizePreview() {
        if (!previewCanvas || !previewCtx) return;
        const rect = previewCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        previewCanvas.width = rect.width * dpr;
        previewCanvas.height = rect.height * dpr;
        previewCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redrawPreview();
    }

    function computeScaleInfo() {
        const w = previewCanvas.clientWidth || 1;
        const h = previewCanvas.clientHeight || 1;
        const imgW = state.imgW || 1;
        const imgH = state.imgH || 1;

        const baseScale = Math.min(w * 0.8 / imgW, h * 0.8 / imgH);
        const offsetX = (w - imgW * baseScale * state.scale) / 2;
        const offsetY = (h - imgH * baseScale * state.scale) / 2;
        return { scale: baseScale, offsetX, offsetY };
    }

    function redrawPreview() {
        if (!previewCanvas || !previewCtx) return;
        const w = previewCanvas.clientWidth || 1;
        const h = previewCanvas.clientHeight || 1;
        previewCtx.clearRect(0, 0, w, h);

        if (!state.dataUrl || !previewImg.complete) return;

        const info = computeScaleInfo();
        const tipX = info.offsetX + state.tipX * info.scale * state.scale;
        const tipY = info.offsetY + state.tipY * info.scale * state.scale;

        previewCtx.save();
        previewCtx.translate(tipX, tipY);
        previewCtx.rotate(state.angle * Math.PI / 180);
        previewCtx.drawImage(
            previewImg,
            -state.tipX * info.scale * state.scale,
            -state.tipY * info.scale * state.scale,
            state.imgW * info.scale * state.scale,
            state.imgH * info.scale * state.scale
        );
        previewCtx.restore();

        previewCtx.save();
        previewCtx.fillStyle = '#f97316';
        previewCtx.strokeStyle = '#000';
        previewCtx.lineWidth = 1.5;
        previewCtx.beginPath();
        previewCtx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        previewCtx.fill();
        previewCtx.stroke();
        previewCtx.restore();
    }

    /********************************************************************
     * Init: ultra-early cursor + later UI
     ********************************************************************/
    (function init() {
        // If we already have an image, make sure cursor is ready ASAP
        if (state.dataUrl) {
            ensureCursor();
            previewImg.src = state.dataUrl;
            applyCursor();
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            openPanel();
        } else {
            window.addEventListener('DOMContentLoaded', openPanel, { once: true });
        }
    })();
})();
