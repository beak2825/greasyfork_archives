// ==UserScript==
// @name         Custom Cursor Overlay (Upload, Angle, Tip, Size)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.1.0
// @description  Upload your own cursor image, set the tip, adjust angle & size, with live preview. Safari Userscripts compatible.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559552/Custom%20Cursor%20Overlay%20%28Upload%2C%20Angle%2C%20Tip%2C%20Size%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559552/Custom%20Cursor%20Overlay%20%28Upload%2C%20Angle%2C%20Tip%2C%20Size%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************************************************************
     * Storage abstraction (GM_* if available, fallback to localStorage)
     ********************************************************************/
    const STORAGE_PREFIX = 'customCursorOverlay_';

    function canUseGM() {
        return typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
    }

    function setStored(key, value) {
        const fullKey = STORAGE_PREFIX + key;
        if (canUseGM()) {
            try { GM_setValue(fullKey, value); return; } catch (e) {}
        }
        try { localStorage.setItem(fullKey, JSON.stringify(value)); } catch (e) {}
    }

    function getStored(key, defaultValue) {
        const fullKey = STORAGE_PREFIX + key;
        if (canUseGM()) {
            try {
                const v = GM_getValue(fullKey);
                return (typeof v === 'undefined') ? defaultValue : v;
            } catch (e) {}
        }
        try {
            const raw = localStorage.getItem(fullKey);
            if (raw === null) return defaultValue;
            return JSON.parse(raw);
        } catch (e) {
            return defaultValue;
        }
    }

    /********************************************************************
     * State
     ********************************************************************/
    const state = {
        dataUrl: getStored('dataUrl', null),
        tipX:    getStored('tipX', 0),
        tipY:    getStored('tipY', 0),
        angle:   getStored('angle', 0),
        scale:   getStored('scale', 1.0),
        imgNaturalWidth:  getStored('imgNaturalWidth', 32),
        imgNaturalHeight: getStored('imgNaturalHeight', 32)
    };

    /********************************************************************
     * DOM helpers
     ********************************************************************/
    function createEl(tag, props, children) {
        const el = document.createElement(tag);
        if (props) {
            Object.entries(props).forEach(([k, v]) => {
                if (k === 'style') Object.assign(el.style, v);
                else if (k === 'class') el.className = v;
                else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
                else el[k] = v;
            });
        }
        if (children) children.forEach(c => c && el.appendChild(c));
        return el;
    }

    /********************************************************************
     * Inject styles
     ********************************************************************/
    function injectStyles() {
        const css = `
            html, body, * { cursor: none !important; }

            .ccov-settings-toggle {
                position: fixed; bottom: 12px; right: 12px;
                width: 32px; height: 32px; border-radius: 50%;
                background: rgba(20,20,20,0.9); color: #fff;
                display: flex; align-items: center; justify-content: center;
                font-size: 18px; z-index: 2147483646;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                user-select: none;
            }

            .ccov-panel {
                position: fixed; bottom: 56px; right: 12px;
                width: 320px; background: rgba(12,12,12,0.96);
                color: #eee; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                padding: 12px; z-index: 2147483646;
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.06);
            }

            .ccov-preview-container {
                position: relative; width: 100%; height: 140px;
                background: radial-gradient(circle at 20% 20%, #222 0, #111 45%, #050505 100%);
                border-radius: 10px; margin-top: 6px; overflow: hidden;
                border: 1px solid rgba(255,255,255,0.04);
            }

            .ccov-cursor-overlay {
                position: fixed; left: 0; top: 0;
                z-index: 2147483647; pointer-events: none;
                image-rendering: pixelated;
                transform-origin: 0 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    /********************************************************************
     * Cursor overlay
     ********************************************************************/
    let cursorEl = null;
    let lastX = null, lastY = null;

    function ensureCursorElement() {
        if (!cursorEl) {
            cursorEl = createEl('img', { className: 'ccov-cursor-overlay', draggable: false });
            document.documentElement.appendChild(cursorEl);
        }
        return cursorEl;
    }

    function updateCursorFromState() {
        if (!state.dataUrl) return;
        const el = ensureCursorElement();
        el.src = state.dataUrl;
        el.style.transformOrigin = `${state.tipX}px ${state.tipY}px`;
        el.style.transform = `rotate(${state.angle}deg) scale(${state.scale})`;
    }

    function updateCursorPosition(x, y) {
        lastX = x; lastY = y;
        if (!cursorEl || !state.dataUrl) return;
        cursorEl.style.left = (x - state.tipX * state.scale) + 'px';
        cursorEl.style.top  = (y - state.tipY * state.scale) + 'px';
    }

    function installPointerListeners() {
        window.addEventListener('pointermove', e => updateCursorPosition(e.clientX, e.clientY), { passive: true });
        window.addEventListener('mousemove', e => updateCursorPosition(e.clientX, e.clientY), { passive: true });
    }

    /********************************************************************
     * Settings UI + Preview
     ********************************************************************/
    let panelEl, previewCanvas, previewCtx, sliderEl, sliderValueEl, sizeSlider, sizeValue;

    const previewImg = new Image();
    previewImg.onload = function() {
        state.imgNaturalWidth = previewImg.naturalWidth;
        state.imgNaturalHeight = previewImg.naturalHeight;
        setStored('imgNaturalWidth', state.imgNaturalWidth);
        setStored('imgNaturalHeight', state.imgNaturalHeight);
        redrawPreview();
        updateCursorFromState();
    };

    function openPanel() {
        if (panelEl) return panelEl.style.display = 'block';

        const toggle = createEl('div', { className: 'ccov-settings-toggle' }, [document.createTextNode('⚙︎')]);
        toggle.onclick = () => panelEl.style.display = panelEl.style.display === 'none' ? 'block' : 'none';
        document.documentElement.appendChild(toggle);

        panelEl = createEl('div', { className: 'ccov-panel' });

        /******** Header ********/
        const header = createEl('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
            createEl('div', { style: { fontSize: '13px', opacity: 0.8 } }, [document.createTextNode('Custom Cursor Overlay')]),
            createEl('div', { style: { cursor: 'pointer' } }, [document.createTextNode('✕')])
        ]);
        header.lastChild.onclick = () => panelEl.style.display = 'none';
        panelEl.appendChild(header);

        /******** File Upload ********/
        panelEl.appendChild(createEl('div', { style: { fontSize: '12px', opacity: 0.7, marginTop: '6px' } }, [
            document.createTextNode('Cursor image')
        ]));

        const fileInput = createEl('input', { type: 'file', accept: 'image/*', style: { width: '100%' } });
        fileInput.onchange = e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                state.dataUrl = ev.target.result;
                setStored('dataUrl', state.dataUrl);
                previewImg.src = state.dataUrl;
                state.tipX = 0; state.tipY = 0;
                setStored('tipX', 0); setStored('tipY', 0);
            };
            reader.readAsDataURL(file);
        };
        panelEl.appendChild(fileInput);

        /******** Preview ********/
        const previewContainer = createEl('div', { className: 'ccov-preview-container' });
        previewCanvas = createEl('canvas');
        previewContainer.appendChild(previewCanvas);
        panelEl.appendChild(previewContainer);

        previewCtx = previewCanvas.getContext('2d');
        resizePreviewCanvas();
        window.addEventListener('resize', resizePreviewCanvas);

        previewCanvas.onclick = e => {
            if (!state.dataUrl) return;
            const rect = previewCanvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const info = computePreviewScale();
            const imgX = (cx - info.offsetX) / (info.scale * state.scale);
            const imgY = (cy - info.offsetY) / (info.scale * state.scale);
            state.tipX = Math.max(0, Math.min(state.imgNaturalWidth, imgX));
            state.tipY = Math.max(0, Math.min(state.imgNaturalHeight, imgY));
            setStored('tipX', state.tipX);
            setStored('tipY', state.tipY);
            redrawPreview();
            updateCursorFromState();
        };

        /******** Angle Presets ********/
        panelEl.appendChild(createEl('div', { style: { fontSize: '12px', opacity: 0.7, marginTop: '6px' } }, [
            document.createTextNode('Angle presets')
        ]));

        const angRow = createEl('div', { style: { display: 'flex', gap: '4px', marginTop: '4px' } });
        [0,45,90,135,180].forEach(a => {
            const btn = createEl('button', { style: { flex: 1, padding: '4px', fontSize: '11px' } }, [
                document.createTextNode(a + '°')
            ]);
            btn.onclick = () => {
                state.angle = a;
                setStored('angle', a);
                sliderEl.value = a;
                sliderValueEl.textContent = a + '°';
                redrawPreview();
                updateCursorFromState();
            };
            angRow.appendChild(btn);
        });
        panelEl.appendChild(angRow);

        /******** Angle Slider ********/
        panelEl.appendChild(createEl('div', { style: { fontSize: '12px', opacity: 0.7, marginTop: '6px' } }, [
            document.createTextNode('Custom angle')
        ]));

        sliderEl = createEl('input', { type: 'range', min: '0', max: '360', step: '1', value: state.angle });
        sliderValueEl = createEl('div', { style: { fontSize: '11px', width: '40px', textAlign: 'right' } }, [
            document.createTextNode(state.angle + '°')
        ]);

        const sliderRow = createEl('div', { style: { display: 'flex', gap: '8px', marginTop: '4px' } }, [
            sliderEl, sliderValueEl
        ]);

        sliderEl.oninput = () => {
            state.angle = parseInt(sliderEl.value);
            setStored('angle', state.angle);
            sliderValueEl.textContent = state.angle + '°';
            redrawPreview();
            updateCursorFromState();
        };

        panelEl.appendChild(sliderRow);

        /******** Size Slider ********/
        panelEl.appendChild(createEl('div', { style: { fontSize: '12px', opacity: 0.7, marginTop: '6px' } }, [
            document.createTextNode('Cursor size')
        ]));

        sizeSlider = createEl('input', { type: 'range', min: '0.1', max: '3.0', step: '0.01', value: state.scale });
        sizeValue = createEl('div', { style: { fontSize: '11px', width: '40px', textAlign: 'right' } }, [
            document.createTextNode(Math.round(state.scale * 100) + '%')
        ]);

        const sizeRow = createEl('div', { style: { display: 'flex', gap: '8px', marginTop: '4px' } }, [
            sizeSlider, sizeValue
        ]);

        sizeSlider.oninput = () => {
            state.scale = parseFloat(sizeSlider.value);
            setStored('scale', state.scale);
            sizeValue.textContent = Math.round(state.scale * 100) + '%';
            redrawPreview();
            updateCursorFromState();
        };

        panelEl.appendChild(sizeRow);

        /******** Save Button ********/
        const saveBtn = createEl('button', { style: { marginTop: '10px', padding: '6px 12px', fontSize: '11px' } }, [
            document.createTextNode('Save & Apply')
        ]);
        saveBtn.onclick = () => {
            updateCursorFromState();
            if (lastX !== null) updateCursorPosition(lastX, lastY);
        };
        panelEl.appendChild(saveBtn);

        document.documentElement.appendChild(panelEl);

        if (state.dataUrl) previewImg.src = state.dataUrl;
        redrawPreview();
    }

    /********************************************************************
     * Preview Rendering
     ********************************************************************/
    function resizePreviewCanvas() {
        if (!previewCanvas) return;
        const rect = previewCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        previewCanvas.width = rect.width * dpr;
        previewCanvas.height = rect.height * dpr;
        previewCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redrawPreview();
    }

    function computePreviewScale() {
        const width = previewCanvas.clientWidth;
        const height = previewCanvas.clientHeight;
        const imgW = state.imgNaturalWidth;
        const imgH = state.imgNaturalHeight;

        const scale = Math.min(width * 0.8 / imgW, height * 0.8 / imgH);
        const drawW = imgW * scale * state.scale;
        const drawH = imgH * scale * state.scale;
        const offsetX = (width - drawW) / 2;
        const offsetY = (height - drawH) / 2;

        return { scale, offsetX, offsetY, drawW, drawH };
    }

    function redrawPreview() {
        if (!previewCtx) return;
        const width = previewCanvas.clientWidth;
        const height = previewCanvas.clientHeight;

        previewCtx.clearRect(0, 0, width, height);

        if (!state.dataUrl || !previewImg.complete) return;

        const info = computePreviewScale();
        const tipXScaled = info.offsetX + state.tipX * info.scale * state.scale;
        const tipYScaled = info.offsetY + state.tipY * info.scale * state.scale;

        previewCtx.save();
        previewCtx.translate(tipXScaled, tipYScaled);
        previewCtx.rotate(state.angle * Math.PI / 180);
        previewCtx.drawImage(
            previewImg,
            -state.tipX * info.scale * state.scale,
            -state.tipY * info.scale * state.scale,
            state.imgNaturalWidth * info.scale * state.scale,
            state.imgNaturalHeight * info.scale * state.scale
        );
        previewCtx.restore();

        previewCtx.save();
        previewCtx.fillStyle = '#f97316';
        previewCtx.strokeStyle = '#000';
        previewCtx.lineWidth = 1.5;
        previewCtx.beginPath();
        previewCtx.arc(tipXScaled, tipYScaled, 4, 0, Math.PI * 2);
        previewCtx.fill();
        previewCtx.stroke();
        previewCtx.restore();
    }

    /********************************************************************
     * Init
     ********************************************************************/
    function init() {
        injectStyles();
        installPointerListeners();

        if (state.dataUrl) {
            ensureCursorElement();
            previewImg.src = state.dataUrl;
            updateCursorFromState();
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            openPanel();
        } else {
            window.addEventListener('DOMContentLoaded', openPanel, { once: true });
        }
    }

    init();
})();
