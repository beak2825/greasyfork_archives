// ==UserScript==
// @name         Custom Cursor Overlay (Upload & Angle Control)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.0.0
// @description  Upload your own cursor image, set the tip, adjust angle (presets + slider), and use it as an overlay cursor.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559550/Custom%20Cursor%20Overlay%20%28Upload%20%20Angle%20Control%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559550/Custom%20Cursor%20Overlay%20%28Upload%20%20Angle%20Control%29.meta.js
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
            try {
                GM_setValue(fullKey, value);
                return;
            } catch (e) {}
        }
        try {
            localStorage.setItem(fullKey, JSON.stringify(value));
        } catch (e) {}
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
                if (k === 'style') {
                    Object.assign(el.style, v);
                } else if (k === 'class') {
                    el.className = v;
                } else if (k === 'dataset') {
                    Object.entries(v).forEach(([dk, dv]) => {
                        el.dataset[dk] = dv;
                    });
                } else {
                    el[k] = v;
                }
            });
        }
        if (children && children.length) {
            children.forEach(c => {
                if (c) el.appendChild(c);
            });
        }
        return el;
    }

    /********************************************************************
     * Inject base styles (hide cursor, overlay, settings UI)
     ********************************************************************/
    function injectStyles() {
        const css = `
            html, body, * {
                cursor: none !important;
            }

            .ccov-settings-toggle {
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
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                cursor: pointer;
                user-select: none;
            }

            .ccov-settings-toggle:hover {
                background: rgba(35,35,35,1);
            }

            .ccov-panel {
                position: fixed;
                bottom: 56px;
                right: 12px;
                width: 320px;
                max-width: calc(100vw - 24px);
                background: rgba(12,12,12,0.96);
                color: #eee;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                padding: 12px 12px 10px;
                z-index: 2147483646;
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.06);
                box-sizing: border-box;
            }

            .ccov-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .ccov-panel-title {
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                opacity: 0.85;
            }

            .ccov-panel-close {
                cursor: pointer;
                font-size: 16px;
                opacity: 0.8;
                padding: 2px 6px;
                border-radius: 6px;
            }

            .ccov-panel-close:hover {
                background: rgba(255,255,255,0.06);
                opacity: 1;
            }

            .ccov-section-label {
                font-size: 12px;
                margin-top: 6px;
                margin-bottom: 4px;
                opacity: 0.7;
            }

            .ccov-file-input {
                width: 100%;
                font-size: 11px;
                color: #ccc;
            }

            .ccov-preview-container {
                position: relative;
                width: 100%;
                height: 140px;
                background: radial-gradient(circle at 20% 20%, #222 0, #111 45%, #050505 100%);
                border-radius: 10px;
                margin-top: 6px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.04);
            }

            .ccov-preview-canvas {
                width: 100%;
                height: 100%;
                display: block;
            }

            .ccov-ang-row {
                display: flex;
                justify-content: space-between;
                margin-top: 6px;
                gap: 4px;
                flex-wrap: wrap;
            }

            .ccov-ang-btn {
                flex: 1 1 18%;
                min-width: 48px;
                padding: 3px 0;
                font-size: 11px;
                text-align: center;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(30,30,30,0.85);
                color: #eee;
                cursor: pointer;
                user-select: none;
            }

            .ccov-ang-btn.ccov-active {
                background: linear-gradient(135deg, #3b82f6, #6366f1);
                border-color: rgba(255,255,255,0.3);
            }

            .ccov-ang-btn:hover {
                background: rgba(45,45,45,0.95);
            }

            .ccov-slider-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 6px;
            }

            .ccov-slider-row input[type="range"] {
                flex: 1;
            }

            .ccov-slider-value {
                font-size: 11px;
                min-width: 42px;
                text-align: right;
                opacity: 0.8;
            }

            .ccov-save-row {
                display: flex;
                justify-content: flex-end;
                margin-top: 8px;
            }

            .ccov-save-btn {
                padding: 4px 10px;
                font-size: 11px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15);
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: #f9fafb;
                cursor: pointer;
                user-select: none;
            }

            .ccov-save-btn:active {
                transform: translateY(1px);
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
            }

            .ccov-note {
                font-size: 10px;
                opacity: 0.6;
                margin-top: 4px;
                line-height: 1.3;
            }

            .ccov-cursor-overlay {
                position: fixed;
                left: 0;
                top: 0;
                width: auto;
                height: auto;
                z-index: 2147483647;
                pointer-events: none;
                image-rendering: pixelated;
                transform-origin: 0 0;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    /********************************************************************
     * Cursor overlay element & pointer handling
     ********************************************************************/
    let cursorEl = null;
    let lastX = null;
    let lastY = null;

    function ensureCursorElement() {
        if (cursorEl) return cursorEl;
        cursorEl = createEl('img', {
            className: 'ccov-cursor-overlay',
            draggable: false
        });
        document.documentElement.appendChild(cursorEl);
        return cursorEl;
    }

    function updateCursorFromState() {
        if (!state.dataUrl) return;
        const el = ensureCursorElement();
        el.src = state.dataUrl;
        el.style.transformOrigin = `${state.tipX}px ${state.tipY}px`;
        el.style.transform = `rotate(${state.angle}deg)`;
    }

    function updateCursorPosition(x, y) {
        lastX = x;
        lastY = y;
        if (!cursorEl || !state.dataUrl) return;
        cursorEl.style.left = (x - state.tipX) + 'px';
        cursorEl.style.top  = (y - state.tipY) + 'px';
    }

    function handlePointerMove(e) {
        const x = e.clientX;
        const y = e.clientY;
        updateCursorPosition(x, y);
    }

    function installPointerListeners() {
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        // Fallback for browsers not dispatching pointer events:
        window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    /********************************************************************
     * Settings UI
     ********************************************************************/
    let panelEl = null;
    let toggleEl = null;
    let previewCanvas = null;
    let previewCtx = null;
    let sliderEl = null;
    let sliderValueEl = null;
    let anglePresetButtons = [];

    // Image object for preview drawing
    const previewImg = new Image();
    previewImg.onload = function() {
        state.imgNaturalWidth = previewImg.naturalWidth || state.imgNaturalWidth;
        state.imgNaturalHeight = previewImg.naturalHeight || state.imgNaturalHeight;
        setStored('imgNaturalWidth', state.imgNaturalWidth);
        setStored('imgNaturalHeight', state.imgNaturalHeight);
        redrawPreview();
        updateCursorFromState();
    };

    function openPanel() {
        if (panelEl) {
            panelEl.style.display = 'block';
            return;
        }

        // Toggle button
        toggleEl = createEl('div', {
            className: 'ccov-settings-toggle',
            title: 'Cursor settings'
        }, [
            document.createTextNode('⚙︎')
        ]);
        toggleEl.addEventListener('click', function() {
            if (!panelEl) return;
            const visible = panelEl.style.display !== 'none';
            panelEl.style.display = visible ? 'none' : 'block';
        });
        document.documentElement.appendChild(toggleEl);

        // Panel structure
        const header = createEl('div', { className: 'ccov-panel-header' }, [
            createEl('div', { className: 'ccov-panel-title' }, [
                document.createTextNode('Custom Cursor Overlay')
            ]),
            createEl('div', { className: 'ccov-panel-close' }, [
                document.createTextNode('✕')
            ])
        ]);

        const closeBtn = header.querySelector('.ccov-panel-close');
        closeBtn.addEventListener('click', () => {
            panelEl.style.display = 'none';
        });

        // File input
        const fileLabel = createEl('div', { className: 'ccov-section-label' }, [
            document.createTextNode('Cursor image (PNG recommended)')
        ]);
        const fileInput = createEl('input', {
            type: 'file',
            accept: 'image/*',
            className: 'ccov-file-input'
        });

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(ev) {
                const dataUrl = ev.target.result;
                state.dataUrl = dataUrl;
                setStored('dataUrl', state.dataUrl);
                previewImg.src = dataUrl;
                // Reset tip to upper-left as initial guess
                state.tipX = 0;
                state.tipY = 0;
                setStored('tipX', state.tipX);
                setStored('tipY', state.tipY);
            };
            reader.readAsDataURL(file);
        });

        // Preview
        const previewContainer = createEl('div', { className: 'ccov-preview-container' });
        previewCanvas = createEl('canvas', { className: 'ccov-preview-canvas' });
        previewContainer.appendChild(previewCanvas);

        previewCanvas.addEventListener('click', function(e) {
            if (!state.dataUrl || !previewCtx) return;
            const rect = previewCanvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;

            // Map canvas coords back to image coords
            const scale = computePreviewScale();
            const imgX = (cx - scale.offsetX) / scale.scale;
            const imgY = (cy - scale.offsetY) / scale.scale;

            // Clamp to image bounds
            state.tipX = Math.max(0, Math.min(state.imgNaturalWidth, imgX));
            state.tipY = Math.max(0, Math.min(state.imgNaturalHeight, imgY));

            setStored('tipX', state.tipX);
            setStored('tipY', state.tipY);

            redrawPreview();
            updateCursorFromState();
        });

        // Angle presets
        const angleLabel = createEl('div', { className: 'ccov-section-label' }, [
            document.createTextNode('Angle presets')
        ]);

        const angles = [0, 45, 90, 135, 180];
        const angRow = createEl('div', { className: 'ccov-ang-row' });
        angles.forEach(value => {
            const btn = createEl('button', {
                type: 'button',
                className: 'ccov-ang-btn'
            }, [
                document.createTextNode(value + '°')
            ]);
            btn.dataset.angle = String(value);
            btn.addEventListener('click', function() {
                state.angle = value;
                setStored('angle', state.angle);
                syncAngleControls();
                redrawPreview();
                updateCursorFromState();
            });
            anglePresetButtons.push(btn);
            angRow.appendChild(btn);
        });

        // Custom slider
        const sliderLabel = createEl('div', { className: 'ccov-section-label' }, [
            document.createTextNode('Custom angle')
        ]);
        sliderEl = createEl('input', {
            type: 'range',
            min: '0',
            max: '360',
            step: '1'
        });
        sliderValueEl = createEl('div', { className: 'ccov-slider-value' }, [
            document.createTextNode(state.angle + '°')
        ]);
        const sliderRow = createEl('div', { className: 'ccov-slider-row' }, [
            sliderEl,
            sliderValueEl
        ]);

        sliderEl.value = String(state.angle);
        sliderEl.addEventListener('input', function() {
            const value = parseInt(sliderEl.value, 10) || 0;
            state.angle = value;
            setStored('angle', state.angle);
            syncAngleControls();
            redrawPreview();
            updateCursorFromState();
        });

        // Save button (really just reinforces that settings are stored)
        const saveRow = createEl('div', { className: 'ccov-save-row' });
        const saveBtn = createEl('button', {
            type: 'button',
            className: 'ccov-save-btn'
        }, [
            document.createTextNode('Save & Apply')
        ]);
        saveBtn.addEventListener('click', function() {
            // Values are already persisted on change,
            // so this mostly ensures cursor overlay is refreshed.
            updateCursorFromState();
            if (lastX !== null && lastY !== null) {
                updateCursorPosition(lastX, lastY);
            }
        });
        saveRow.appendChild(saveBtn);

        const note = createEl('div', { className: 'ccov-note' }, [
            document.createTextNode(
                'Tip selection: click inside the preview to choose where the pointer should "touch". ' +
                'Angle affects how the cursor rotates around that tip.'
            )
        ]);

        panelEl = createEl('div', { className: 'ccov-panel' }, [
            header,
            fileLabel,
            fileInput,
            previewContainer,
            angleLabel,
            angRow,
            sliderLabel,
            sliderRow,
            saveRow,
            note
        ]);

        document.documentElement.appendChild(panelEl);

        // Setup preview canvas context
        previewCtx = previewCanvas.getContext('2d');
        resizePreviewCanvas();
        window.addEventListener('resize', resizePreviewCanvas);

        // If we already have an image from previous sessions, load it
        if (state.dataUrl) {
            previewImg.src = state.dataUrl;
        } else {
            redrawPreview(); // blank preview
        }

        syncAngleControls();
    }

    function syncAngleControls() {
        if (!sliderEl || !sliderValueEl) return;
        sliderEl.value = String(state.angle);
        sliderValueEl.textContent = state.angle + '°';

        // Mark active preset if exact match
        anglePresetButtons.forEach(btn => {
            const val = parseInt(btn.dataset.angle, 10);
            if (val === state.angle) {
                btn.classList.add('ccov-active');
            } else {
                btn.classList.remove('ccov-active');
            }
        });
    }

    function resizePreviewCanvas() {
        if (!previewCanvas) return;
        const rect = previewCanvas.getBoundingClientRect();
        // Use devicePixelRatio for sharpness
        const dpr = window.devicePixelRatio || 1;
        previewCanvas.width = rect.width * dpr;
        previewCanvas.height = rect.height * dpr;
        if (previewCtx) {
            previewCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // Normalize to CSS pixels
        }
        redrawPreview();
    }

    function computePreviewScale() {
        if (!previewCanvas) {
            return { scale: 1, offsetX: 0, offsetY: 0 };
        }
        const width = previewCanvas.clientWidth || 1;
        const height = previewCanvas.clientHeight || 1;
        const imgW = state.imgNaturalWidth || 1;
        const imgH = state.imgNaturalHeight || 1;

        const scale = Math.min(width * 0.8 / imgW, height * 0.8 / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;
        const offsetX = (width - drawW) / 2;
        const offsetY = (height - drawH) / 2;

        return { scale, offsetX, offsetY, drawW, drawH };
    }

    function redrawPreview() {
        if (!previewCtx || !previewCanvas) return;
        const width = previewCanvas.clientWidth || 1;
        const height = previewCanvas.clientHeight || 1;

        // Clear
        previewCtx.clearRect(0, 0, width, height);

        if (!state.dataUrl || !previewImg.complete) {
            // Optional placeholder
            previewCtx.save();
            previewCtx.fillStyle = 'rgba(255,255,255,0.06)';
            previewCtx.fillRect(width * 0.25, height * 0.4, width * 0.5, 1);
            previewCtx.fillRect(width * 0.5, height * 0.3, 1, height * 0.4);
            previewCtx.restore();
            return;
        }

        const info = computePreviewScale();
        const centerX = info.offsetX + info.drawW / 2;
        const centerY = info.offsetY + info.drawH / 2;

        // Draw rotated image around tip, preserving tip position visually.
        const tipXScaled = info.offsetX + state.tipX * info.scale;
        const tipYScaled = info.offsetY + state.tipY * info.scale;

        previewCtx.save();
        // Move context so that tip is at its scaled position
        previewCtx.translate(tipXScaled, tipYScaled);
        previewCtx.rotate(state.angle * Math.PI / 180);
        // Then draw the image with its tip at the origin.
        previewCtx.drawImage(
            previewImg,
            -state.tipX * info.scale,
            -state.tipY * info.scale,
            state.imgNaturalWidth * info.scale,
            state.imgNaturalHeight * info.scale
        );
        previewCtx.restore();

        // Draw tip marker
        previewCtx.save();
        previewCtx.fillStyle = '#f97316';
        previewCtx.strokeStyle = '#000';
        previewCtx.lineWidth = 1.5;
        const markerX = tipXScaled;
        const markerY = tipYScaled;
        previewCtx.beginPath();
        previewCtx.arc(markerX, markerY, 4, 0, Math.PI * 2);
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

        // Create cursor overlay if we already have data
        if (state.dataUrl) {
            ensureCursorElement();
            previewImg.src = state.dataUrl;
            updateCursorFromState();
        }

        // Lazy-create settings UI after load
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            openPanel();
        } else {
            window.addEventListener('DOMContentLoaded', openPanel, { once: true });
        }
    }

    init();
})();
