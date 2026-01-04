// ==UserScript==
// @name         Custom Cursor Overlay (Upload, Angle, Tip, Size, iPadOS Cover)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.2.0
// @description  Upload your own cursor image, set tip, angle, size, auto-scale to iPadOS size, and force-hide system cursor. Safari Userscripts compatible.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559553/Custom%20Cursor%20Overlay%20%28Upload%2C%20Angle%2C%20Tip%2C%20Size%2C%20iPadOS%20Cover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559553/Custom%20Cursor%20Overlay%20%28Upload%2C%20Angle%2C%20Tip%2C%20Size%2C%20iPadOS%20Cover%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************************************************************
     * Storage abstraction
     ********************************************************************/
    const PREFIX = "ccov_";

    const useGM = typeof GM_getValue === "function" && typeof GM_setValue === "function";

    function setStore(k, v) {
        const key = PREFIX + k;
        if (useGM) {
            try { GM_setValue(key, v); return; } catch(e){}
        }
        localStorage.setItem(key, JSON.stringify(v));
    }

    function getStore(k, def) {
        const key = PREFIX + k;
        if (useGM) {
            try {
                const v = GM_getValue(key);
                return v === undefined ? def : v;
            } catch(e){}
        }
        const raw = localStorage.getItem(key);
        if (!raw) return def;
        try { return JSON.parse(raw); } catch(e){ return def; }
    }

    /********************************************************************
     * State
     ********************************************************************/
    const state = {
        dataUrl: getStore("dataUrl", null),
        tipX: getStore("tipX", 0),
        tipY: getStore("tipY", 0),
        angle: getStore("angle", 0),
        scale: getStore("scale", 1.0),
        imgW: getStore("imgW", 32),
        imgH: getStore("imgH", 32)
    };

    /********************************************************************
     * Inject CSS (Option B: force-hide system cursor)
     ********************************************************************/
    function injectCSS() {
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
            }

            .ccov-panel {
                position: fixed;
                bottom: 56px;
                right: 12px;
                width: 320px;
                background: rgba(12,12,12,0.96);
                color: #eee;
                border-radius: 12px;
                padding: 12px;
                z-index: 2147483646;
                backdrop-filter: blur(18px);
                border: 1px solid rgba(255,255,255,0.06);
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
        `;
        const s = document.createElement("style");
        s.textContent = css;
        document.documentElement.appendChild(s);
    }

    /********************************************************************
     * Cursor overlay
     ********************************************************************/
    let cursorEl = null;
    let lastX = null, lastY = null;

    function ensureCursor() {
        if (!cursorEl) {
            cursorEl = document.createElement("img");
            cursorEl.className = "ccov-cursor";
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
        lastX = x; lastY = y;
        if (!cursorEl || !state.dataUrl) return;
        cursorEl.style.left = (x - state.tipX * state.scale) + "px";
        cursorEl.style.top  = (y - state.tipY * state.scale) + "px";
    }

    function installPointer() {
        window.addEventListener("pointermove", e => moveCursor(e.clientX, e.clientY), { passive: true });
        window.addEventListener("mousemove", e => moveCursor(e.clientX, e.clientY), { passive: true });
    }

    /********************************************************************
     * UI + Preview
     ********************************************************************/
    let panel, previewCanvas, previewCtx, angleSlider, angleVal, sizeSlider, sizeVal;

    const previewImg = new Image();
    previewImg.onload = () => {
        state.imgW = previewImg.naturalWidth;
        state.imgH = previewImg.naturalHeight;
        setStore("imgW", state.imgW);
        setStore("imgH", state.imgH);
        redrawPreview();
        applyCursor();
    };

    function openPanel() {
        if (panel) return panel.style.display = "block";

        const toggle = document.createElement("div");
        toggle.className = "ccov-toggle";
        toggle.textContent = "⚙︎";
        toggle.onclick = () => panel.style.display = panel.style.display === "none" ? "block" : "none";
        document.documentElement.appendChild(toggle);

        panel = document.createElement("div");
        panel.className = "ccov-panel";

        /******** Header ********/
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.innerHTML = `<div style="font-size:13px;opacity:.8">Custom Cursor Overlay</div>
                            <div style="cursor:pointer">✕</div>`;
        header.lastChild.onclick = () => panel.style.display = "none";
        panel.appendChild(header);

        /******** Upload ********/
        const file = document.createElement("input");
        file.type = "file";
        file.accept = "image/*";
        file.style.width = "100%";
        file.onchange = e => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = ev => {
                state.dataUrl = ev.target.result;
                setStore("dataUrl", state.dataUrl);
                previewImg.src = state.dataUrl;

                // Auto-scale to iPadOS size (24px)
                const target = 24;
                state.scale = target / state.imgW;
                setStore("scale", state.scale);

                sizeSlider.value = state.scale;
                sizeVal.textContent = Math.round(state.scale * 100) + "%";

                redrawPreview();
                applyCursor();
            };
            r.readAsDataURL(f);
        };
        panel.appendChild(file);

        /******** Preview ********/
        const preview = document.createElement("div");
        preview.className = "ccov-preview";
        previewCanvas = document.createElement("canvas");
        preview.appendChild(previewCanvas);
        panel.appendChild(preview);

        previewCtx = previewCanvas.getContext("2d");
        resizePreview();
        window.addEventListener("resize", resizePreview);

        previewCanvas.onclick = e => {
            if (!state.dataUrl) return;
            const rect = previewCanvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const info = scaleInfo();

            const imgX = (cx - info.offsetX) / (info.scale * state.scale);
            const imgY = (cy - info.offsetY) / (info.scale * state.scale);

            state.tipX = Math.max(0, Math.min(state.imgW, imgX));
            state.tipY = Math.max(0, Math.min(state.imgH, imgY));
            setStore("tipX", state.tipX);
            setStore("tipY", state.tipY);

            redrawPreview();
            applyCursor();
        };

        /******** Angle ********/
        angleSlider = document.createElement("input");
        angleSlider.type = "range";
        angleSlider.min = "0";
        angleSlider.max = "360";
        angleSlider.step = "1";
        angleSlider.value = state.angle;

        angleVal = document.createElement("div");
        angleVal.style.fontSize = "11px";
        angleVal.textContent = state.angle + "°";

        angleSlider.oninput = () => {
            state.angle = parseInt(angleSlider.value);
            setStore("angle", state.angle);
            angleVal.textContent = state.angle + "°";
            redrawPreview();
            applyCursor();
        };

        const angleRow = document.createElement("div");
        angleRow.style.display = "flex";
        angleRow.style.gap = "8px";
        angleRow.style.marginTop = "8px";
        angleRow.append(angleSlider, angleVal);
        panel.appendChild(angleRow);

        /******** Size ********/
        sizeSlider = document.createElement("input");
        sizeSlider.type = "range";
        sizeSlider.min = "0.1";
        sizeSlider.max = "3.0";
        sizeSlider.step = "0.01";
        sizeSlider.value = state.scale;

        sizeVal = document.createElement("div");
        sizeVal.style.fontSize = "11px";
        sizeVal.textContent = Math.round(state.scale * 100) + "%";

        sizeSlider.oninput = () => {
            state.scale = parseFloat(sizeSlider.value);
            setStore("scale", state.scale);
            sizeVal.textContent = Math.round(state.scale * 100) + "%";
            redrawPreview();
            applyCursor();
        };

        const sizeRow = document.createElement("div");
        sizeRow.style.display = "flex";
        sizeRow.style.gap = "8px";
        sizeRow.style.marginTop = "8px";
        sizeRow.append(sizeSlider, sizeVal);
        panel.appendChild(sizeRow);

        /******** Match iPadOS Size Button ********/
        const matchBtn = document.createElement("button");
        matchBtn.textContent = "Match iPadOS Cursor Size";
        matchBtn.style.marginTop = "10px";
        matchBtn.style.padding = "6px 10px";
        matchBtn.style.fontSize = "11px";
        matchBtn.onclick = () => {
            const target = 24;
            state.scale = target / state.imgW;
            setStore("scale", state.scale);

            sizeSlider.value = state.scale;
            sizeVal.textContent = Math.round(state.scale * 100) + "%";

            redrawPreview();
            applyCursor();
        };
        panel.appendChild(matchBtn);

        document.documentElement.appendChild(panel);

        if (state.dataUrl) previewImg.src = state.dataUrl;
        redrawPreview();
    }

    /********************************************************************
     * Preview rendering
     ********************************************************************/
    function resizePreview() {
        const rect = previewCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        previewCanvas.width = rect.width * dpr;
        previewCanvas.height = rect.height * dpr;
        previewCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        redrawPreview();
    }

    function scaleInfo() {
        const w = previewCanvas.clientWidth;
        const h = previewCanvas.clientHeight;
        const scale = Math.min(w * 0.8 / state.imgW, h * 0.8 / state.imgH);
        const drawW = state.imgW * scale * state.scale;
        const drawH = state.imgH * scale * state.scale;
        const offsetX = (w - drawW) / 2;
        const offsetY = (h - drawH) / 2;
        return { scale, offsetX, offsetY };
    }

    function redrawPreview() {
        const w = previewCanvas.clientWidth;
        const h = previewCanvas.clientHeight;
        previewCtx.clearRect(0, 0, w, h);

        if (!state.dataUrl || !previewImg.complete) return;

        const info = scaleInfo();
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
        previewCtx.fillStyle = "#f97316";
        previewCtx.beginPath();
        previewCtx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        previewCtx.fill();
        previewCtx.restore();
    }

    /********************************************************************
     * Init
     ********************************************************************/
    function init() {
        injectCSS();
        installPointer();

        if (state.dataUrl) {
            ensureCursor();
            previewImg.src = state.dataUrl;
            applyCursor();
        }

        if (document.readyState === "complete" || document.readyState === "interactive") {
            openPanel();
        } else {
            window.addEventListener("DOMContentLoaded", openPanel, { once: true });
        }
    }

    init();
})();
