// ==UserScript==
// @author       Boni
// @name         Straw Tools+
// @namespace    https://straw.page/
// @version      1.0
// @description  Enhanced toolbox for straw.page picasso (eyedrop and eraser and more)
// @match        https://*.straw.page/*
// @run-at       document-idle
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/553255/Straw%20Tools%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553255/Straw%20Tools%2B.meta.js
// ==/UserScript==



(function () {
    'use strict';
    // --- CURSOR HELPERS (add/replace this block) ---

    let cursorStyleEl;
    function ensureCursorStyleEl() {
        if (!cursorStyleEl) {
            cursorStyleEl = document.createElement('style');
            cursorStyleEl.id = 'sp-cursor-css';
            document.head.appendChild(cursorStyleEl);
        }
        return cursorStyleEl;
    }


    // Brush: clean double-outline ring (no fill)
    function makeBrushCursorDataUrl(d) {
        const r = (d / 2).toFixed(2);
        const strokeBlack = Math.max(0.7, d * 0.10);
        const strokeWhite = strokeBlack * 1.6;
        const svg =
            `<svg xmlns='http://www.w3.org/2000/svg' width='${d}' height='${d}'>` +
            `<circle cx='${r}' cy='${r}' r='${(d / 2 - strokeWhite / 2).toFixed(2)}' fill='none' stroke='white' stroke-width='${strokeWhite}'/>` +
            `<circle cx='${r}' cy='${r}' r='${(d / 2 - strokeBlack / 2).toFixed(2)}' fill='none' stroke='black' stroke-width='${strokeBlack}'/>` +
            `</svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    // Eraser: same ring but dashed to subtly differentiate
    function makeEraserCursorDataUrl(d) {
        const r = (d / 2).toFixed(2);
        const strokeBlack = Math.max(0.7, d * 0.10);
        const strokeWhite = strokeBlack * 1.6;
        const dash = Math.max(2, Math.round(d * 0.35));       // dash length scales with size
        const gap = Math.max(2, Math.round(d * 0.25));       // gap length scales with size
        const dashAttr = `stroke-dasharray='${dash} ${gap}'`;
        const svg =
            `<svg xmlns='http://www.w3.org/2000/svg' width='${d}' height='${d}'>` +
            `<circle cx='${r}' cy='${r}' r='${(d / 2 - strokeWhite / 2).toFixed(2)}' fill='none' stroke='white' stroke-width='${strokeWhite}' ${dashAttr}/>` +
            `<circle cx='${r}' cy='${r}' r='${(d / 2 - strokeBlack / 2).toFixed(2)}' fill='none' stroke='black' stroke-width='${strokeBlack}' ${dashAttr}/>` +
            `</svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }


    function applyCursors(brushDiam, eraserDiam) {
        ensureCursorStyleEl();
        const bUrl = makeBrushCursorDataUrl(brushDiam);
        const eUrl = makeEraserCursorDataUrl(eraserDiam);
        const bHot = `${(brushDiam / 2 | 0)} ${(brushDiam / 2 | 0)}`;
        const eHot = `${(eraserDiam / 2 | 0)} ${(eraserDiam / 2 | 0)}`;
        cursorStyleEl.textContent =
            `.picasso canvas.brush-cursor{cursor:url("${bUrl}") ${bHot}, crosshair !important;}` +
            `.picasso canvas.eraser-cursor{cursor:url("${eUrl}") ${eHot}, crosshair !important;}`;
    }


    // --- sync helper ---
    const rgbStrToHex = (rgb) => {
        const m = rgb && rgb.match(/\d+/g);
        if (!m) return null;
        const [r, g, b] = m.map(n => parseInt(n, 10));
        const h = n => n.toString(16).padStart(2, '0');
        return `#${h(r)}${h(g)}${h(b)}`;
    };

    const applyColor = (rgbOrHex) => {
        const swatch = document.querySelector('.canvCol');
        const hex = rgbOrHex.startsWith('#') ? rgbOrHex : rgbStrToHex(rgbOrHex);
        if (!hex) return;
        if (swatch) { swatch.style.background = rgbOrHex; swatch.setAttribute('data-color', hex); }
        window.__spForcedColor = hex;
        const colpick = document.querySelector('#colpick');
        if (colpick) {
            colpick.value = hex;
            colpick.dispatchEvent(new Event('input', { bubbles: true }));
            colpick.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // --- watch the floating Straw color picker ---
    (function watchFloatingPicker() {
        const attach = () => {
            const hl = document.querySelector('.colorPicker .colorHighlight');
            if (!hl) return false;
            // initial
            const rgb = getComputedStyle(hl).backgroundColor;
            if (rgb) applyColor(rgb);

            new MutationObserver(() => {
                const rgb2 = getComputedStyle(hl).backgroundColor;
                if (rgb2) applyColor(rgb2);
            }).observe(hl, { attributes: true, attributeFilter: ['style'] });

            const hue = document.querySelector('.colorPicker .hueSlider');
            if (hue) hue.addEventListener('input', () => {
                const rgb3 = getComputedStyle(hl).backgroundColor;
                if (rgb3) applyColor(rgb3);
            });
            return true;
        };

        if (!attach()) {
            const mo = new MutationObserver(() => { if (attach()) mo.disconnect(); });
            mo.observe(document.documentElement, { childList: true, subtree: true });
        }
    })();

    // --- Hook stroke() so we can set color at the last moment ---
    (function installStrokeHookOnce() {
        const P = CanvasRenderingContext2D.prototype;
        if (P.__spStrokeHooked) return;
        P.__spStrokeHooked = true;

        const orig = P.stroke;
        // global forced color (kept in sync with eyedropper AND built-in picker)
        window.__spForcedColor = null;

        P.stroke = function (...args) {
            const prev = this.strokeStyle;
            if (window.__spForcedColor) this.strokeStyle = window.__spForcedColor;
            const r = orig.apply(this, args);
            this.strokeStyle = prev;
            return r;
        };

        // Cover OffscreenCanvas too (harmless if absent)
        if (self.OffscreenCanvas && self.OffscreenCanvasRenderingContext2D) {
            const P2 = OffscreenCanvasRenderingContext2D.prototype;
            if (!P2.__spStrokeHooked) {
                P2.__spStrokeHooked = true;
                const orig2 = P2.stroke;
                P2.stroke = function (...args) {
                    const prev = this.strokeStyle;
                    if (window.__spForcedColor) this.strokeStyle = window.__spForcedColor;
                    const r = orig2.apply(this, args);
                    this.strokeStyle = prev;
                    return r;
                };
            }
        }
    })();

    // --- Enhance the UI once it appears ---
    let mo;
    const addStyles = () => {
        if (document.getElementById('sp-tools-css')) return;
        const s = document.createElement('style');
        s.id = 'sp-tools-css';


        // inside addStyles()
        s.textContent = `
          .toolbox .tool.sp-temp { outline-style: dashed; }
  .toolbox .tool{border:0;background:#f6f6f6;padding:6px 10px;margin-left:6px;border-radius:8px;cursor:pointer;font:inherit;display:inline-flex;align-items:center;justify-content:center;}
  .toolbox .tool i{font-size:16px;line-height:1;vertical-align:middle;}
  .toolbox .tool.active{outline:2px solid #333;}
  .picasso canvas.eyedropper-cursor{cursor:crosshair!important;}
  /* cursors are injected dynamically by applyCursors(); these are just fallbacks */
  .picasso canvas.brush-cursor{cursor:crosshair!important;}
  .picasso canvas.eraser-cursor{cursor:crosshair!important;}
    .toolbox .fa-undo,
  .toolbox .canvCol,
  .toolbox #colpick,
  .toolbox .canvSizing input[type=range]{
    cursor: pointer;


  }
`;



        document.head.appendChild(s);
    };

    function enhanceOnce() {
        const toolbox = document.querySelector('.innerCanvas .toolbox');
        const canvas = document.querySelector('.picasso canvas');
        const colorInput = document.querySelector('#colpick');
        if (!toolbox || !canvas || !colorInput) return false;
        if (canvas.dataset.spEnhanced === '1') return true;

        canvas.dataset.spEnhanced = '1';

        addStyles();

        // Buttons (only once)
        if (!toolbox.querySelector('[data-sp-tool]')) {
            const mk = (name, title, iconClass) => {
                const b = document.createElement('button');
                b.className = 'tool';
                b.dataset.spTool = name;
                b.title = title;
                b.innerHTML = `<i class="${iconClass}"></i>`;
                return b;
            };

            toolbox.append(
                mk('brush', 'Brush (B)', 'fas fa-paint-brush'),
                mk('eraser', 'Eraser (E)', 'fas fa-eraser'),
                mk('eyedropper', 'Eyedropper (I / hold Alt)', 'fas fa-eye-dropper')
            );

            const infoBtn = document.createElement('button');
            infoBtn.className = 'tool';
            infoBtn.dataset.spTool = 'info';
            infoBtn.title = 'straw-tools+, made by boni\nhttps://boni.straw.page/';
            infoBtn.innerHTML = `<i class="fas fa-info-circle"></i>`;
            toolbox.appendChild(infoBtn);

            // Optional: make it clickable to open the link directly
            infoBtn.addEventListener('click', (e) => {
                window.open('https://greasyfork.org/en/scripts/553255-straw-tools', '_blank');
                e.stopPropagation();
                e.preventDefault();
            });

            // Enable clicking our injected tool buttons
            toolbox.addEventListener('click', (ev) => {
                const btn = ev.target.closest('[data-sp-tool]');
                if (!btn) return;
                const name = btn.dataset.spTool; // "brush" | "eraser" | "eyedropper"
                setTool(name);
                ev.stopPropagation();   // don't let site re-toggle something else
                ev.preventDefault();
            });


        }


        const ctx = canvas.getContext('2d', { willReadFrequently: true });



        // find the size slider
        const sizeSlider = document.querySelector('.canvSizing input[type=range]');
        // map slider -> lineWidth directly
        const sliderToLineWidth = v => parseFloat(v) || 4;

        function refreshCursors() {
            const d = Math.max(8, Math.round(sliderToLineWidth(sizeSlider?.value ?? 4)));
            applyCursors(d, d); // brush and eraser use same diameter
        }

        // init + react to changes
        refreshCursors();
        sizeSlider?.addEventListener('input', refreshCursors);
        sizeSlider?.addEventListener('change', refreshCursors);

        const swatch = document.querySelector('.canvCol');
        const setSwatch = v => { if (swatch) { swatch.style.background = v; swatch.setAttribute('data-color', v); } };

        let tool = 'brush', altSampling = false, erasing = false, swallowNextClick = false;

        const setTool = (t) => {
            tool = t;
            if (tool !== 'eraser' && ctx.globalCompositeOperation !== 'source-over') {
                ctx.globalCompositeOperation = 'source-over';
            }
            toolbox.querySelectorAll('[data-sp-tool]').forEach(b => b.classList.remove('active'));
            toolbox.querySelector(`[data-sp-tool="${tool}"]`)?.classList.add('active');

            if (tool === 'eraser') {
                refreshCursors();
                canvas.classList.add('eraser-cursor');
                canvas.classList.remove('brush-cursor');
            } else if (tool === 'brush') {
                refreshCursors();
                canvas.classList.add('brush-cursor');
                canvas.classList.remove('eraser-cursor');
            } else {
                canvas.classList.remove('brush-cursor');
                canvas.classList.remove('eraser-cursor');
            }


            canvas.classList.toggle('eyedropper-cursor', tool === 'eyedropper' || altSampling);
        };


        // Visual highlight only (doesn't change tool or composite op)
        function setActiveVisual(name) {
            const all = toolbox.querySelectorAll('[data-sp-tool]');
            all.forEach(b => b.classList.remove('active', 'sp-temp'));
            const b = toolbox.querySelector(`[data-sp-tool="${name}"]`);
            if (b) b.classList.add('active', 'sp-temp'); // sp-temp = temporary highlight (Alt)
        }
        function restoreActiveVisual() {
            const all = toolbox.querySelectorAll('[data-sp-tool]');
            all.forEach(b => b.classList.remove('active', 'sp-temp'));
            toolbox.querySelector(`[data-sp-tool="${tool}"]`)?.classList.add('active');
        }



        setTool('brush');
        setSwatch(colorInput.value);

        // Keep forced color IN SYNC with built-in picker changes
        const syncFromPicker = (hex) => {
            setSwatch(hex);
            window.__spForcedColor = hex; // now strokes follow the picker as well
        };
        colorInput.addEventListener('input', e => syncFromPicker(e.target.value));
        colorInput.addEventListener('change', e => syncFromPicker(e.target.value));

        // Also watch swatch attribute/style (in case site sets presets without updating #colpick first)
        if (swatch) {
            new MutationObserver(() => {
                const hex = swatch.getAttribute('data-color');
                if (hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
                    window.__spForcedColor = hex;
                }
            }).observe(swatch, { attributes: true, attributeFilter: ['data-color', 'style'] });
        }

        const fireColorEvents = (hex) => {
            colorInput.value = hex;
            setSwatch(hex);
            colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            colorInput.dispatchEvent(new Event('change', { bubbles: true }));
            colorInput.blur?.();
        };

        const toHex = (r, g, b) => `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`;
        const getXY = (evt) => {
            const r = canvas.getBoundingClientRect(), p = evt.touches ? evt.touches[0] : evt;
            return { x: (p.clientX - r.left) * (canvas.width / r.width), y: (p.clientY - r.top) * (canvas.height / r.height) };
        };
        const sampleAt = (x, y) => {
            const d = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
            const hex = toHex(d[0], d[1], d[2]);
            // update UI + force strokes to use it
            fireColorEvents(hex);
            window.__spForcedColor = hex;
        };


        // --- Tap vs Hold E behavior ---
        let eKeyDownAt = 0;
        let ePrevToolForHold = null;
        const E_HOLD_MS = 300; // ≥ this = temporary hold, < this = tap toggle (stay on eraser)

        // small helper to avoid hijacking while typing/sliding
        function allowToolHotkeys(ev) {
            const ae = document.activeElement;
            const tag = (ae && ae.tagName) || '';
            const isRange = tag === 'INPUT' && ae.type === 'range';
            const isTyping = (tag === 'INPUT' && !isRange) || tag === 'TEXTAREA' || ae?.isContentEditable;
            if (isRange) ae.blur();
            return !isTyping;
        }


        window.addEventListener('keydown', (e) => {
            if (!allowToolHotkeys(e)) return;

            // E = start timing; switch to eraser immediately
            if ((e.key === 'e' || e.key === 'E') && !e.repeat) {
                eKeyDownAt = performance.now();
                ePrevToolForHold = tool;     // remember the tool to snap back to on a long hold
                setTool('eraser');
            }

            // explicit tool keys
            if (e.key === 'b' || e.key === 'B') setTool('brush');
            if (e.key === 'i' || e.key === 'I') setTool('eyedropper');

            // size keys: [ / ]
            if (e.key === '[' || e.key === ']') {
                if (!sizeSlider) return;
                const step = parseFloat(sizeSlider.step || '1') || 1;
                const min = parseFloat(sizeSlider.min || '1') || 1;
                const max = parseFloat(sizeSlider.max || '64') || 64;

                let val = parseFloat(sizeSlider.value || String(min)) || min;
                val += (e.key === ']') ? step : -step;
                val = Math.max(min, Math.min(max, val));
                sizeSlider.value = String(val);

                sizeSlider.dispatchEvent(new Event('input', { bubbles: true }));
                sizeSlider.dispatchEvent(new Event('change', { bubbles: true }));
                refreshCursors();
                e.preventDefault();
            }

            // ALT = temporary eyedropper (unchanged)
            if (e.altKey && !altSampling) {
                altSampling = true;
                canvas.classList.add('eyedropper-cursor');
                canvas.classList.remove('brush-cursor', 'eraser-cursor');
                setActiveVisual('eyedropper');
            }

            if (e.key === 'L' && e.shiftKey) {
                window.__spForcedColor = null;
                console.log('[color forcing cleared]');
            }
        }, { capture: true });



        window.addEventListener('keyup', (e) => {
            if (e.key === 'e' || e.key === 'E') {
                const heldFor = performance.now() - (eKeyDownAt || performance.now());
                const wasHold = heldFor >= E_HOLD_MS;

                if (wasHold && ePrevToolForHold && ePrevToolForHold !== 'eraser') {
                    // long hold → snap back to the previous tool
                    setTool(ePrevToolForHold);
                }
                // quick tap (< E_HOLD_MS) → stay on eraser
                eKeyDownAt = 0;
                ePrevToolForHold = null;
            }

            // release ALT -> restore real tool + visuals (unchanged)
            if (!e.altKey && altSampling) {
                altSampling = false;
                canvas.classList.remove('eyedropper-cursor');
                restoreActiveVisual();
                if (tool === 'brush') canvas.classList.add('brush-cursor');
                if (tool === 'eraser') canvas.classList.add('eraser-cursor');
            }
        }, { capture: true });


        // pointer (capture) so we run before site handlers
        function onDown(e) {
            if (tool === 'eyedropper' || altSampling) {
                const { x, y } = getXY(e);
                sampleAt(x, y);                  // sets __spForcedColor
                swallowNextClick = true;         // avoid a dot from the click/tap that picked
                // auto-switch back to brush if user explicitly chose the eyedropper button
                if (tool === 'eyedropper') {
                    // switch on the next frame to avoid racing site handlers
                    requestAnimationFrame(() => {
                        setTool('brush');
                        altSampling = false;
                        canvas.classList.remove('eyedropper-cursor');
                    });
                }
                e.stopImmediatePropagation?.();
                e.preventDefault();
                return;
            }
            if (tool === 'eraser') {
                erasing = true;
                ctx.globalCompositeOperation = 'destination-out';
                return;
            }
        }

        function onUp() {
            if (erasing) {
                swallowNextClick = true;
                requestAnimationFrame(() => { ctx.globalCompositeOperation = 'source-over'; erasing = false; });
            }
        }

        function onClick(e) {
            if (swallowNextClick) {
                swallowNextClick = false;
                e.stopImmediatePropagation?.();
                e.preventDefault();
            }
        }

        canvas.addEventListener('mousedown', onDown, { capture: true, passive: false });
        canvas.addEventListener('touchstart', onDown, { capture: true, passive: false });
        window.addEventListener('mouseup', onUp, { capture: true, passive: false });
        window.addEventListener('touchend', onUp, { capture: true, passive: false });
        canvas.addEventListener('click', onClick, { capture: true, passive: false });
        window.addEventListener('pointercancel', onUp, { capture: true, passive: false });

        return true;
    }

    function start() {
        const ok = enhanceOnce();
        if (ok && mo) { mo.disconnect(); mo = null; return; }
        if (!mo) {
            mo = new MutationObserver(() => { if (enhanceOnce()) { mo.disconnect(); mo = null; } });
            mo.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    window.addEventListener('pageshow', (e) => { if (e.persisted) start(); });
})();
