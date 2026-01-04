// ==UserScript==
// @name         Mobile Custom Overlay Cursor (iOS-style)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.0.0
// @description  Upload a custom cursor image and use it as a full overlay cursor (mouse + touch) with Mac/Windows size presets, angle control, hotspot calibration, and a draggable, collapsible iPadOS-style settings panel.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559591/Mobile%20Custom%20Overlay%20Cursor%20%28iOS-style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559591/Mobile%20Custom%20Overlay%20Cursor%20%28iOS-style%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_PREFIX = 'customOverlayCursor_';
    const KEY_IMG = STORAGE_PREFIX + 'image';
    const KEY_SIZE = STORAGE_PREFIX + 'size';
    const KEY_ANGLE = STORAGE_PREFIX + 'angle';
    const KEY_HOTSPOT_X = STORAGE_PREFIX + 'hotspotX';
    const KEY_HOTSPOT_Y = STORAGE_PREFIX + 'hotspotY';
    const KEY_PANEL_X = STORAGE_PREFIX + 'panelX';
    const KEY_PANEL_Y = STORAGE_PREFIX + 'panelY';
    const KEY_PANEL_OPEN = STORAGE_PREFIX + 'panelOpen';

    const DEFAULT_SIZE = 32; // default to Windows style
    const MAC_SIZE = 24;
    const WIN_SIZE = 32;
    const MIN_SIZE = 16;
    const MAX_SIZE = 96;
    const DEFAULT_ANGLE = 0;
    const DEFAULT_HOTSPOT_X = 0.1; // relative (0-1), rough default tip near left
    const DEFAULT_HOTSPOT_Y = 0.05;

    let cursorImg, cursorWrapper, toggleButton, panel;
    let sizeInput, angleInput, macBtn, winBtn, resetAngleBtn;
    let fileInput, hotspotPreview, hotspotOverlay;
    let panelHeader;
    let lastPointerX = window.innerWidth / 2;
    let lastPointerY = window.innerHeight / 2;
    let hotspotX = loadNumber(KEY_HOTSPOT_X, DEFAULT_HOTSPOT_X);
    let hotspotY = loadNumber(KEY_HOTSPOT_Y, DEFAULT_HOTSPOT_Y);
    let cursorSize = loadNumber(KEY_SIZE, DEFAULT_SIZE);
    let cursorAngle = loadNumber(KEY_ANGLE, DEFAULT_ANGLE);
    let isPanelOpen = loadBool(KEY_PANEL_OPEN, false);

    let isDraggingPanel = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function loadNumber(key, fallback) {
        const v = localStorage.getItem(key);
        const n = v !== null ? Number(v) : NaN;
        return Number.isFinite(n) ? n : fallback;
    }

    function loadBool(key, fallback) {
        const v = localStorage.getItem(key);
        if (v === 'true') return true;
        if (v === 'false') return false;
        return fallback;
    }

    // Inject styles once DOM is ready
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
html, body, * {
    cursor: none !important;
}

#coc_cursorWrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    z-index: 999999999;
    pointer-events: none;
}

#coc_cursorImg {
    position: absolute;
    image-rendering: auto;
    will-change: transform;
    transform-origin: center center;
    pointer-events: none;
}

#coc_toggleButton {
    position: fixed;
    bottom: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(40, 40, 40, 0.85);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    z-index: 999999998;
    border: 1px solid rgba(255,255,255,0.12);
    user-select: none;
}

#coc_toggleButtonIcon {
    width: 18px;
    height: 18px;
    position: relative;
}

#coc_toggleButtonIcon::before,
#coc_toggleButtonIcon::after {
    content: "";
    position: absolute;
    border-radius: 7px;
    background: rgba(255,255,255,0.85);
}

#coc_toggleButtonIcon::before {
    width: 100%;
    height: 3px;
    top: 4px;
    left: 0;
}

#coc_toggleButtonIcon::after {
    width: 100%;
    height: 3px;
    bottom: 4px;
    left: 0;
}

#coc_panel {
    position: fixed;
    width: 260px;
    background: rgba(22, 22, 22, 0.98);
    color: #f5f5f5;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 13px;
    border-radius: 16px;
    box-shadow: 0 18px 45px rgba(0,0,0,0.55);
    z-index: 999999997;
    border: 1px solid rgba(255,255,255,0.14);
    display: none;
}

#coc_panel.coc-open {
    display: block;
}

#coc_panelHeader {
    padding: 8px 12px;
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}

#coc_panelTitle {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
}

#coc_panelBtns {
    display: flex;
    gap: 4px;
}

.coc_headerDot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
}

.coc_dotClose {
    background: #ff5f57;
}
.coc_dotMin {
    background: #febc2e;
}
.coc_dotMax {
    background: #28c840;
}

#coc_panelBody {
    padding: 8px 12px 10px 12px;
}

/* Controls */
.coc_section {
    margin-bottom: 8px;
}

.coc_labelRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.coc_label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.75;
}

.coc_value {
    font-size: 11px;
    opacity: 0.7;
}

.coc_range {
    width: 100%;
}

.coc_buttonRow {
    display: flex;
    gap: 6px;
    margin-top: 4px;
}

.coc_btn {
    flex: 1;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.06);
    color: #f5f5f5;
    font-size: 11px;
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    user-select: none;
}

.coc_btn:hover {
    background: rgba(255,255,255,0.11);
}

#coc_fileInput {
    width: 100%;
    font-size: 11px;
}

#coc_hotspotPreviewWrapper {
    margin-top: 4px;
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
    padding: 8px;
}

#coc_hotspotPreview {
    width: 64px;
    height: 64px;
    margin: 0 auto;
    position: relative;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    overflow: hidden;
}

#coc_hotspotPreviewImg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}

#coc_hotspotOverlay {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #ffcc00;
    border: 1px solid #000;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

#coc_hotspotHint {
    margin-top: 4px;
    font-size: 10px;
    opacity: 0.65;
    text-align: center;
}

/* Range styling (simple, cross-browser acceptable) */
input[type="range"].coc_range {
    -webkit-appearance: none;
    background: transparent;
}

input[type="range"].coc_range::-webkit-slider-runnable-track {
    height: 3px;
    background: rgba(255,255,255,0.28);
    border-radius: 999px;
}
input[type="range"].coc_range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: #ffffff;
    margin-top: -5.5px;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.6);
}

input[type="range"].coc_range::-moz-range-track {
    height: 3px;
    background: rgba(255,255,255,0.28);
    border-radius: 999px;
}
input[type="range"].coc_range::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.6);
}

/* Disable text selection for UI */
#coc_panel, #coc_panel * {
    -webkit-user-select: none;
    user-select: none;
}
        `;
        document.documentElement.appendChild(style);
    }

    function createCursor() {
        cursorWrapper = document.createElement('div');
        cursorWrapper.id = 'coc_cursorWrapper';

        cursorImg = document.createElement('img');
        cursorImg.id = 'coc_cursorImg';
        cursorImg.draggable = false;

        const storedImg = localStorage.getItem(KEY_IMG);
        if (storedImg) {
            cursorImg.src = storedImg;
        }

        cursorWrapper.appendChild(cursorImg);
        document.documentElement.appendChild(cursorWrapper);

        updateCursorVisual();
        moveCursor(lastPointerX, lastPointerY);
    }

    function createToggleButton() {
        toggleButton = document.createElement('div');
        toggleButton.id = 'coc_toggleButton';

        const icon = document.createElement('div');
        icon.id = 'coc_toggleButtonIcon';
        toggleButton.appendChild(icon);

        toggleButton.addEventListener('click', () => {
            isPanelOpen = !isPanelOpen;
            localStorage.setItem(KEY_PANEL_OPEN, String(isPanelOpen));
            syncPanelVisibility();
        });

        document.documentElement.appendChild(toggleButton);
    }

    function syncPanelVisibility() {
        if (!panel) return;
        if (isPanelOpen) {
            panel.classList.add('coc-open');
        } else {
            panel.classList.remove('coc-open');
        }
    }

    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'coc_panel';

        const header = document.createElement('div');
        header.id = 'coc_panelHeader';
        panelHeader = header;

        const title = document.createElement('div');
        title.id = 'coc_panelTitle';
        title.textContent = 'Cursor Overlay';

        const headerBtns = document.createElement('div');
        headerBtns.id = 'coc_panelBtns';

        const dotClose = document.createElement('div');
        dotClose.className = 'coc_headerDot coc_dotClose';
        dotClose.title = 'Close panel';
        dotClose.addEventListener('click', (e) => {
            e.stopPropagation();
            isPanelOpen = false;
            localStorage.setItem(KEY_PANEL_OPEN, String(isPanelOpen));
            syncPanelVisibility();
        });

        const dotMin = document.createElement('div');
        dotMin.className = 'coc_headerDot coc_dotMin';
        dotMin.title = 'Snap to bottom-left';
        dotMin.addEventListener('click', (e) => {
            e.stopPropagation();
            setPanelPosition(16, window.innerHeight - 16 - panel.offsetHeight);
        });

        const dotMax = document.createElement('div');
        dotMax.className = 'coc_headerDot coc_dotMax';
        dotMax.title = 'Center panel';
        dotMax.addEventListener('click', (e) => {
            e.stopPropagation();
            const x = (window.innerWidth - panel.offsetWidth) / 2;
            const y = (window.innerHeight - panel.offsetHeight) / 2;
            setPanelPosition(x, y);
        });

        headerBtns.appendChild(dotClose);
        headerBtns.appendChild(dotMin);
        headerBtns.appendChild(dotMax);

        header.appendChild(title);
        header.appendChild(headerBtns);

        const body = document.createElement('div');
        body.id = 'coc_panelBody';

        // UPLOAD SECTION
        const uploadSection = document.createElement('div');
        uploadSection.className = 'coc_section';
        const uploadLabelRow = document.createElement('div');
        uploadLabelRow.className = 'coc_labelRow';
        const uploadLabel = document.createElement('div');
        uploadLabel.className = 'coc_label';
        uploadLabel.textContent = 'Cursor image';
        uploadLabelRow.appendChild(uploadLabel);
        uploadSection.appendChild(uploadLabelRow);

        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'coc_fileInput';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', onFileSelected);
        uploadSection.appendChild(fileInput);

        // SIZE SECTION
        const sizeSection = document.createElement('div');
        sizeSection.className = 'coc_section';
        const sizeLabelRow = document.createElement('div');
        sizeLabelRow.className = 'coc_labelRow';
        const sizeLabel = document.createElement('div');
        sizeLabel.className = 'coc_label';
        sizeLabel.textContent = 'Size';
        const sizeValue = document.createElement('div');
        sizeValue.className = 'coc_value';
        sizeValue.id = 'coc_sizeValue';
        sizeValue.textContent = Math.round(cursorSize) + ' px';
        sizeLabelRow.appendChild(sizeLabel);
        sizeLabelRow.appendChild(sizeValue);

        sizeSection.appendChild(sizeLabelRow);

        sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.className = 'coc_range';
        sizeInput.min = String(MIN_SIZE);
        sizeInput.max = String(MAX_SIZE);
        sizeInput.step = '1';
        sizeInput.value = String(cursorSize);
        sizeInput.addEventListener('input', () => {
            cursorSize = Number(sizeInput.value);
            localStorage.setItem(KEY_SIZE, String(cursorSize));
            document.getElementById('coc_sizeValue').textContent = Math.round(cursorSize) + ' px';
            updateCursorVisual();
            updateHotspotPreviewOverlay();
        });
        sizeSection.appendChild(sizeInput);

        const sizeBtnRow = document.createElement('div');
        sizeBtnRow.className = 'coc_buttonRow';

        macBtn = document.createElement('div');
        macBtn.className = 'coc_btn';
        macBtn.textContent = 'Mac';
        macBtn.addEventListener('click', () => {
            cursorSize = MAC_SIZE;
            sizeInput.value = String(cursorSize);
            localStorage.setItem(KEY_SIZE, String(cursorSize));
            document.getElementById('coc_sizeValue').textContent = Math.round(cursorSize) + ' px';
            updateCursorVisual();
            updateHotspotPreviewOverlay();
        });

        winBtn = document.createElement('div');
        winBtn.className = 'coc_btn';
        winBtn.textContent = 'Windows';
        winBtn.addEventListener('click', () => {
            cursorSize = WIN_SIZE;
            sizeInput.value = String(cursorSize);
            localStorage.setItem(KEY_SIZE, String(cursorSize));
            document.getElementById('coc_sizeValue').textContent = Math.round(cursorSize) + ' px';
            updateCursorVisual();
            updateHotspotPreviewOverlay();
        });

        sizeBtnRow.appendChild(macBtn);
        sizeBtnRow.appendChild(winBtn);
        sizeSection.appendChild(sizeBtnRow);

        // ANGLE SECTION
        const angleSection = document.createElement('div');
        angleSection.className = 'coc_section';
        const angleLabelRow = document.createElement('div');
        angleLabelRow.className = 'coc_labelRow';
        const angleLabel = document.createElement('div');
        angleLabel.className = 'coc_label';
        angleLabel.textContent = 'Angle';
        const angleValue = document.createElement('div');
        angleValue.className = 'coc_value';
        angleValue.id = 'coc_angleValue';
        angleValue.textContent = Math.round(cursorAngle) + '°';
        angleLabelRow.appendChild(angleLabel);
        angleLabelRow.appendChild(angleValue);
        angleSection.appendChild(angleLabelRow);

        angleInput = document.createElement('input');
        angleInput.type = 'range';
        angleInput.className = 'coc_range';
        angleInput.min = '0';
        angleInput.max = '360';
        angleInput.step = '1';
        angleInput.value = String(cursorAngle);
        angleInput.addEventListener('input', () => {
            cursorAngle = Number(angleInput.value);
            localStorage.setItem(KEY_ANGLE, String(cursorAngle));
            document.getElementById('coc_angleValue').textContent = Math.round(cursorAngle) + '°';
            updateCursorVisual();
        });
        angleSection.appendChild(angleInput);

        const angleBtnRow = document.createElement('div');
        angleBtnRow.className = 'coc_buttonRow';

        resetAngleBtn = document.createElement('div');
        resetAngleBtn.className = 'coc_btn';
        resetAngleBtn.textContent = 'Reset 0°';
        resetAngleBtn.addEventListener('click', () => {
            cursorAngle = DEFAULT_ANGLE;
            angleInput.value = String(cursorAngle);
            localStorage.setItem(KEY_ANGLE, String(cursorAngle));
            document.getElementById('coc_angleValue').textContent = Math.round(cursorAngle) + '°';
            updateCursorVisual();
        });

        angleBtnRow.appendChild(resetAngleBtn);
        angleSection.appendChild(angleBtnRow);

        // HOTSPOT SECTION
        const hotspotSection = document.createElement('div');
        hotspotSection.className = 'coc_section';

        const hotspotLabelRow = document.createElement('div');
        hotspotLabelRow.className = 'coc_labelRow';
        const hotspotLabel = document.createElement('div');
        hotspotLabel.className = 'coc_label';
        hotspotLabel.textContent = 'Hotspot';
        const hotspotValue = document.createElement('div');
        hotspotValue.className = 'coc_value';
        hotspotValue.id = 'coc_hotspotValue';
        hotspotValue.textContent = 'Tap to set tip';
        hotspotLabelRow.appendChild(hotspotLabel);
        hotspotLabelRow.appendChild(hotspotValue);

        hotspotSection.appendChild(hotspotLabelRow);

        const hotspotPreviewWrapper = document.createElement('div');
        hotspotPreviewWrapper.id = 'coc_hotspotPreviewWrapper';

        hotspotPreview = document.createElement('div');
        hotspotPreview.id = 'coc_hotspotPreview';

        const hotspotPreviewImg = document.createElement('img');
        hotspotPreviewImg.id = 'coc_hotspotPreviewImg';
        hotspotPreviewImg.draggable = false;
        const storedImg = localStorage.getItem(KEY_IMG);
        if (storedImg) {
            hotspotPreviewImg.src = storedImg;
        }

        hotspotOverlay = document.createElement('div');
        hotspotOverlay.id = 'coc_hotspotOverlay';

        hotspotPreview.appendChild(hotspotPreviewImg);
        hotspotPreview.appendChild(hotspotOverlay);
        hotspotPreviewWrapper.appendChild(hotspotPreview);

        const hotspotHint = document.createElement('div');
        hotspotHint.id = 'coc_hotspotHint';
        hotspotHint.textContent = 'Tap where the cursor should click.';
        hotspotPreviewWrapper.appendChild(hotspotHint);

        hotspotSection.appendChild(hotspotPreviewWrapper);

        hotspotPreview.addEventListener('click', (e) => {
            const rect = hotspotPreview.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const relX = x / rect.width;
            const relY = y / rect.height;
            hotspotX = relX;
            hotspotY = relY;
            localStorage.setItem(KEY_HOTSPOT_X, String(hotspotX));
            localStorage.setItem(KEY_HOTSPOT_Y, String(hotspotY));
            updateHotspotPreviewOverlay();
        });

        // assemble body
        body.appendChild(uploadSection);
        body.appendChild(sizeSection);
        body.appendChild(angleSection);
        body.appendChild(hotspotSection);

        panel.appendChild(header);
        panel.appendChild(body);
        document.documentElement.appendChild(panel);

        // Initial positioning
        const storedX = localStorage.getItem(KEY_PANEL_X);
        const storedY = localStorage.getItem(KEY_PANEL_Y);
        if (storedX !== null && storedY !== null) {
            setPanelPosition(Number(storedX), Number(storedY));
        } else {
            // Default: near bottom-left, above toggle
            setPanelPosition(70, window.innerHeight - 220);
        }

        setupPanelDragging();
        syncPanelVisibility();
        updateHotspotPreviewOverlay();
    }

    function setPanelPosition(x, y) {
        if (!panel) return;
        const maxX = window.innerWidth - panel.offsetWidth - 8;
        const maxY = window.innerHeight - panel.offsetHeight - 8;
        const clampedX = Math.max(8, Math.min(x, maxX));
        const clampedY = Math.max(8, Math.min(y, maxY));
        panel.style.left = clampedX + 'px';
        panel.style.top = clampedY + 'px';
        localStorage.setItem(KEY_PANEL_X, String(clampedX));
        localStorage.setItem(KEY_PANEL_Y, String(clampedY));
    }

    function setupPanelDragging() {
        let startX = 0;
        let startY = 0;
        let panelStartX = 0;
        let panelStartY = 0;

        function onPointerDown(e) {
            if (e.button !== undefined && e.button !== 0) return;
            isDraggingPanel = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            panelStartX = rect.left;
            panelStartY = rect.top;
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!isDraggingPanel) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            setPanelPosition(panelStartX + dx, panelStartY + dy);
        }

        function onPointerUp() {
            isDraggingPanel = false;
        }

        panelHeader.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }

    function updateCursorVisual() {
        if (!cursorImg) return;
        cursorImg.style.width = cursorSize + 'px';
        cursorImg.style.height = cursorSize + 'px';
        cursorImg.style.transform = `rotate(${cursorAngle}deg)`;
        moveCursor(lastPointerX, lastPointerY);
    }

    function updateHotspotPreviewOverlay() {
        if (!hotspotOverlay || !hotspotPreview) return;
        const rect = hotspotPreview.getBoundingClientRect();
        const x = hotspotX * rect.width;
        const y = hotspotY * rect.height;
        hotspotOverlay.style.left = x + 'px';
        hotspotOverlay.style.top = y + 'px';
    }

    function moveCursor(x, y) {
        lastPointerX = x;
        lastPointerY = y;
        if (!cursorImg) return;
        // Position so that hotspot aligns to pointer
        const offsetX = hotspotX * cursorSize;
        const offsetY = hotspotY * cursorSize;
        const left = x - offsetX;
        const top = y - offsetY;
        cursorImg.style.left = left + 'px';
        cursorImg.style.top = top + 'px';
    }

    function onFileSelected() {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            if (typeof dataUrl === 'string') {
                cursorImg.src = dataUrl;
                const previewImg = document.getElementById('coc_hotspotPreviewImg');
                if (previewImg) previewImg.src = dataUrl;
                localStorage.setItem(KEY_IMG, dataUrl);
            }
        };
        reader.readAsDataURL(file);
    }

    function setupPointerTracking() {
        // Use pointer events for both mouse and touch
        function handlePointerMove(ev) {
            moveCursor(ev.clientX, ev.clientY);
        }

        function handlePointerDown(ev) {
            moveCursor(ev.clientX, ev.clientY);
            if (cursorWrapper) cursorWrapper.style.display = 'block';
        }

        function handlePointerUp() {
            // For now, keep cursor visible (full replacement mode).
            // If you want touch-only hiding, you can detect pointerType === 'touch' and hide here.
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerdown', handlePointerDown, { passive: true });
        window.addEventListener('pointerup', handlePointerUp, { passive: true });

        // Initial position
        if (cursorWrapper) cursorWrapper.style.display = 'block';
    }

    function init() {
        injectStyles();
        createCursor();
        createToggleButton();
        createPanel();
        setupPointerTracking();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
