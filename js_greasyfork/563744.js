// ==UserScript==
// @name         JPDB Kinetic Layout
// @namespace    jpdb-kinetic-layout
// @version      1.4
// @description  Different sections on JPDB review page are now detachable and resizable!
// @author       Idhtft
// @match        https://jpdb.io/
// @match        https://jpdb.io/review*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563744/JPDB%20Kinetic%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/563744/JPDB%20Kinetic%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function () {
        const addStyle = (css) => {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        };

        (function () {
            (function prehideJPDB() {
                if (!location.pathname.startsWith('/review')) return;

                const css = `
                  html.jpdbf-prehide .main-row:has(#show-answer),
                  html.jpdbf-prehide .main-row:has(#grade-1),
                  html.jpdbf-prehide .main-row:has(#grade-2),
                  html.jpdbf-prehide .main-row:has(#grade-3),
                  html.jpdbf-prehide .main-row:has(#grade-4),
                  html.jpdbf-prehide .main-row:has(#grade-5),
                  html.jpdbf-prehide .jpdbf-prehide-target { visibility: hidden !important; }
                `;
                const st = document.createElement('style');
                st.id = 'jpdbf-prehide';
                st.textContent = css;
                (document.head || document.documentElement).appendChild(st);
                document.documentElement.classList.add('jpdbf-prehide');
                window.__jpdbf_unhideJPDB = (node) => {
                    try { if (node) node.classList.remove('jpdbf-prehide-target'); } catch { }
                    document.documentElement.classList.remove('jpdbf-prehide');
                    try { st.remove(); } catch { }
                    try { delete window.__jpdbf_unhideJPDB; } catch { }
                };
            })();

            const TUNE = {
                friction: 0.92, minSpeed: 12, maxSpeed: 6000,
                kickBase: 10, kickGain: 0.006, kickMin: 8, kickMax: 36, kickDur: 160, kickCooldown: 140,
                velWindowMs: 160, releaseQuietMs: 140, releaseQuietPx: 2,
                anchorSense: 24, lockSense: 2,
                intentX: 16, intentY: 14, intentSpeed: 420,
                moveThresh: 3,
                dockSnapDist: 5
            };
            addStyle(`
                :root{ --jpdbfSideW: 32px; --jpdbfSideInsetX: 8px; --jpdbfSideInsetY: 6px; --jpdbfOpNudgeY: -1.5px; --jpdbfOpPad: 28px; }
                .jpdbf-float { position: fixed !important; z-index: 2147483647 !important; max-width: 80vw; width: 280px; background: rgba(20,20,22,var(--jpdbfAlpha,1)); color: #e7e7e7; border: 1px solid #3a3a3a; border-radius: 14px; padding: 10px; box-sizing: border-box; touch-action: none; overflow: hidden; cursor: grab; }
                .jpdbf-docked { position: relative !important; z-index: 10 !important; cursor: grab; user-select: none; touch-action: none; width: 100%; max-width: 600px; margin: 0 auto; }
                .jpdbf-float:active, .jpdbf-docked:active { cursor: grabbing }
                .jpdbf-drag-zone { cursor: grab !important; }
                .jpdbf-drag-zone:active { cursor: grabbing !important; }
                .jpdbf-float input[type="submit"], .jpdbf-float button, .jpdbf-docked input[type="submit"], .jpdbf-docked button { border-radius: 10px !important; cursor: pointer; opacity: var(--jpdbfBtnOpacity, 1); transition: opacity .12s ease; }
                .jpdbf-float .main-row { position: relative !important; }
                .jpdbf-float #show-checkbox-1-label.side-button { position: absolute !important; top: var(--jpdbfSideInsetY) !important; bottom: var(--jpdbfSideInsetY) !important; left: var(--jpdbfSideInsetX) !important; width: var(--jpdbfSideW) !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important; border-radius: 10px !important; opacity: var(--jpdbfBtnOpacity, 1); transition: opacity .12s ease; }
                .jpdbf-float.jpdbf-has-chevron .main.column { margin-left: calc(var(--jpdbfSideW) + var(--jpdbfSideInsetX) + 8px) !important; }
                .jpdbf-float.jpdbf-op-open { padding-bottom: var(--jpdbfOpPad); }
                .jpdbf-op-row { margin: 8px 0 0; padding: 4px 6px 0; width: 100%; box-sizing: border-box; display: grid; grid-template-columns: 1fr minmax(56px,auto); align-items: center; gap: 10px; }
                .jpdbf-docked .jpdbf-op-row { display: none !important; }
                .jpdbf-op-row input[type=range] { width: 100%; height: 18px; margin: 0; background: transparent; appearance: none; -webkit-appearance: none }
                .jpdbf-op-row input[type=range]::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; background: #2b2b2e }
                .jpdbf-op-row input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -4px; width: 16px; height: 16px; border-radius: 9999px; background: #d7d7d7; border: 1px solid #666 }
                .jpdbf-op-val { display: flex; align-items: center; justify-content: flex-end; white-space: nowrap; font-size: 12px; font-variant-numeric: tabular-nums; opacity: .95; min-width: 5ch; text-align: right; line-height: 1; transform: translateY(var(--jpdbfOpNudgeY)); }
                .jpdbf-placeholder { height: 0px !important; min-height: 0px !important; margin: 0 auto !important; opacity: 0; border: 0; border-radius: 14px; box-sizing: border-box; transition: all 0.2s ease; pointer-events: none; overflow: hidden; }
                .jpdbf-placeholder.ready { opacity: 1; border: 2px dashed #4CAF50; margin-bottom: 1rem !important; }
            `);
            const STATE_KEY = 'jpdbf:pos:v2';
            const OPACITY_KEY = 'jpdbf:alpha:v1';
            const qs = (s, r = document) => r.querySelector(s);
            function findMenu() {
                const findParentCard = (el) => {
                    if (!el) return null;
                    let curr = el;
                    if (curr.tagName === 'INPUT') curr = curr.closest('form') || curr.parentElement;
                    const mainRow = curr.closest('.main-row');
                    if (mainRow) return mainRow;
                    return curr;
                };
                const g = qs('#grade-1, #grade-2, #grade-3, #grade-4, #grade-5');
                if (g) return findParentCard(g);
                const show = qs('#show-answer') || qs('input[type="submit"][value="Show answer"]');
                if (show) return findParentCard(show);
                return null;
            }

            function detectMode(el) {
                if (!el) return null;
                if (el.querySelector('#grade-1, #grade-2, #grade-3, #grade-4, #grade-5')) return 'gr';
                if (el.querySelector('#show-answer, input[type="submit"][value="Show answer"]')) return 'sa';
                return null;
            }

            const clamp = (l, t, w, h) => ({ left: Math.max(0, Math.min(innerWidth - w, l)), top: Math.max(0, Math.min(innerHeight - h, t)) });
            const loadState = () => { try { return JSON.parse(localStorage.getItem(STATE_KEY) || 'null'); } catch { return null; } };
            const saveState = (pos, docked) => {
                try {
                    const st = loadState() || {};
                    if (pos !== undefined) st.pos = pos;
                    if (docked !== undefined) st.docked = docked;
                    localStorage.setItem(STATE_KEY, JSON.stringify(st));
                } catch { }
            };
            const saveFromRect = (r) => saveState(entryFromRect(r), false);

            function computeLocksFromRect(r) {
                const vw = innerWidth, vh = innerHeight, L = TUNE.lockSense;
                return { lockL: r.left <= L, lockR: (vw - (r.left + r.width)) <= L, lockT: r.top <= L, lockB: (vh - (r.top + r.height)) <= L };
            }
            function computeAnchorAxes(r, E) {
                const vw = innerWidth, vh = innerHeight;
                const dL = r.left, dT = r.top, dR = vw - (r.left + r.width), dB = vh - (r.top + r.height);
                const ax = dR <= E ? 'right' : (dL <= E ? 'left' : null);
                const ay = dB <= E ? 'bottom' : (dT <= E ? 'top' : null);
                return { ax, ay };
            }
            function maskNearEdges(r, E) {
                const vw = innerWidth, vh = innerHeight;
                const dL = r.left, dT = r.top, dR = vw - (r.left + r.width), dB = vh - (r.top + r.height);
                return { L: dL <= E, R: dR <= E, T: dT <= E, B: dB <= E };
            }
            function isAnchoredX(e) { return !!(e && (e.lockL || e.lockR || e.ax === 'left' || e.ax === 'right')); }
            function isAnchoredY(e) { return !!(e && (e.lockT || e.lockB || e.ay === 'top' || e.ay === 'bottom')); }
            function applyAnchoredPosition(w, h, e) {
                const vw = innerWidth, vh = innerHeight;
                const ax = e.lockR ? 'right' : (e.lockL ? 'left' : (e.ax || null)); const ay = e.lockB ? 'bottom' : (e.lockT ? 'top' : (e.ay || null));
                let l = e.x, t = e.y;
                if (ax === 'right') l = Math.max(0, Math.min(vw - w, vw - w - (e.offR || 0)));
                else if (ax === 'left') l = 0; if (ay === 'bottom') t = Math.max(0, Math.min(vh - h, vh - h - (e.offB || 0)));
                else if (ay === 'top') t = 0; return clamp(l, t, w, h);
            }
            function entryFromRect(r) {
                const a = computeAnchorAxes(r, TUNE.anchorSense);
                const locks = computeLocksFromRect(r);
                const vw = innerWidth, vh = innerHeight; const offR = (a.ax === 'right') ? (vw - (r.left + r.width)) : 0;
                const offB = (a.ay === 'bottom') ? (vh - (r.top + r.height)) : 0;
                return { x: r.left, y: r.top, ax: a.ax, ay: a.ay, offR, offB, ...locks };
            }
            function makePartialAnchorEntry(r, mask) {
                const vw = innerWidth, vh = innerHeight;
                const e = { x: r.left, y: r.top, ax: null, ay: null, offR: 0, offB: 0, lockL: false, lockR: false, lockT: false, lockB: false };
                if (mask.R) { e.ax = 'right'; e.lockR = true; e.offR = vw - (r.left + r.width); }
                if (mask.L) { e.ax = 'left'; e.lockL = true; e.x = 0; }
                if (mask.B) { e.ay = 'bottom'; e.lockB = true; e.offB = vh - (r.top + r.height); }
                if (mask.T) { e.ay = 'top'; e.lockT = true; e.y = 0; } return e;
            }

            function loadAlpha() {
                const v = Number(localStorage.getItem(OPACITY_KEY));
                if (Number.isFinite(v) && v >= 0.2 && v <= 1) return v; return 1;
            }
            function saveAlpha(v) { localStorage.setItem(OPACITY_KEY, String(v)); }
            function applyOpacityTo(el) {
                const v = loadAlpha();
                el.style.setProperty('--jpdbfAlpha', String(v)); el.style.setProperty('--jpdbfBtnOpacity', String(v));
            }
            function ensureOpacityUI() {
                if (!floatingEl) return;
                const hb = floatingEl.querySelector('.hidden-body'); if (!hb) return;
                if (hb.querySelector('.jpdbf-op-row')) return;
                const row = document.createElement('div'); row.className = 'row jpdbf-op-row';
                const rng = document.createElement('input'); rng.type = 'range'; rng.min = '20'; rng.max = '100'; rng.step = '1';
                rng.value = String(Math.round(loadAlpha() * 100));
                const val = document.createElement('div'); val.className = 'jpdbf-op-val'; val.textContent = rng.value + '%';
                rng.addEventListener('input', () => { const p = Math.max(20, Math.min(100, Number(rng.value))); val.textContent = p + '%'; const v = p / 100; if (floatingEl) { floatingEl.style.setProperty('--jpdbfAlpha', String(v)); floatingEl.style.setProperty('--jpdbfBtnOpacity', String(v)); } saveAlpha(v); });
                row.appendChild(rng); row.appendChild(val); hb.appendChild(row);
                const checkbox = floatingEl.querySelector('#show-checkbox-1'); if (checkbox) {
                    const sync = () => {
                        if (checkbox.checked) floatingEl.classList.add('jpdbf-op-open');
                        else floatingEl.classList.remove('jpdbf-op-open');
                    }; checkbox.addEventListener('change', sync); sync();
                }
            }

            let floatingEl = null, placeholderEl = null;
            let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
            let vx = 0, vy = 0, raf = 0, lastMoveX = 0, lastMoveY = 0, lastMoveT = 0;
            let rx = null, ry = null, lastKickX = 0, lastKickY = 0;
            let lastSAEntry = null, grMovedSinceShown = false, grMovedDistance = 0;
            let pendingCenter = null, suppressRO = 0;
            let forceSaveEntry = null, forceSaveUntil = 0;
            let isDocked = true;
            let justDetached = false;

            function setForcedSave(entry, ms = 1500) {
                forceSaveEntry = entry;
                forceSaveUntil = performance.now() + ms; setTimeout(() => { if (performance.now() > forceSaveUntil) { forceSaveEntry = null; } }, ms + 200);
            }
            const INTERACTIVE = 'input,button,select,textarea,label,a,[role="button"],[contenteditable="true"]';
            const stopAnim = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
            const samples = [];
            const pushSample = (x, y, t) => {
                samples.push({ x, y, t });
                const cut = t - TUNE.velWindowMs;
                while (samples.length && samples[0].t < cut) samples.shift();
            };
            function releaseVelocity() {
                if (samples.length < 2) return { vx: 0, vy: 0 };
                let S1 = 0, St = 0, Sx = 0, Sy = 0, Stt = 0, Stx = 0, Sty = 0;
                for (const s of samples) {
                    S1 += 1;
                    St += s.t; Sx += s.x; Sy += s.y;
                    Stt += s.t * s.t; Stx += s.t * s.x;
                    Sty += s.t * s.y;
                } const den = (S1 * Stt - St * St) || 1;
                let VX = (S1 * Stx - St * Sx) / den * 1000;
                let VY = (S1 * Sty - St * Sy) / den * 1000; const sp = Math.hypot(VX, VY);
                if (sp > 6000) {
                    const k = 6000 / sp;
                    VX *= k; VY *= k;
                } return { vx: VX, vy: VY };
            }

            function writeAndSave(x, y) {
                if (isDocked) return;
                floatingEl.style.left = x + 'px'; floatingEl.style.top = y + 'px'; const r = floatingEl.getBoundingClientRect(); saveFromRect(r);
            }

            function startInertia(initVx, initVy) {
                if (isDocked) return;
                stopAnim(); vx = initVx; vy = initVy; rx = null; ry = null;
                function tick(prev) {
                    raf = requestAnimationFrame(ts => {
                        const dt = Math.min(0.05, Math.max(0.001, (ts - prev) / 1000)), now = performance.now(), f = Math.pow(TUNE.friction, dt * 60);
                        vx *= f; vy *= f; const r = floatingEl.getBoundingClientRect(); let nx = r.left + vx * dt, ny = r.top + vy * dt;
                        const vw = innerWidth, vh = innerHeight; let hitL = false, hitR = false, hitT = false, hitB = false; const preVx = vx, preVy = vy;
                        if (nx < 0) { nx = 0; hitL = true; } if (nx + r.width > vw) { nx = vw - r.width; hitR = true; }
                        if (ny < 0) { ny = 0; hitT = true; } if (ny + r.height > vh) { ny = vh - r.height; hitB = true; }
                        if ((hitL || hitR) && !rx && (now - lastKickX > 140)) {
                            const k = Math.max(8, Math.min(36, 10 + 0.006 * Math.abs(preVx))); const to = hitL ? Math.min(k, vw - r.width) : Math.max(vw - r.width - k, 0);
                            rx = { from: nx, to, t0: now, dur: 160 };
                            vx = 0; lastKickX = now;
                        }
                        if ((hitT || hitB) && !ry && (now - lastKickY > 140)) {
                            const k = Math.max(8, Math.min(36, 10 + 0.006 * Math.abs(preVy)));
                            const to = hitT ? Math.min(k, vh - r.height) : Math.max(vh - r.height - k, 0);
                            ry = { from: ny, to, t0: now, dur: 160 }; vy = 0; lastKickY = now;
                        }
                        if (rx) {
                            const p = Math.min(1, (now - rx.t0) / rx.dur);
                            nx = rx.from + (rx.to - rx.from) * (1 - Math.pow(1 - p, 3));
                            if (p >= 1) rx = null;
                        }
                        if (ry) {
                            const p = Math.min(1, (now - ry.t0) / ry.dur);
                            ny = ry.from + (ry.to - ry.from) * (1 - Math.pow(1 - p, 3));
                            if (p >= 1) ry = null;
                        }
                        writeAndSave(nx, ny);
                        if ((vx * vx + vy * vy) < (12 * 12) && !rx && !ry) {
                            raf = 0;
                            return;
                        }
                        tick(ts);
                    });
                }
                raf = requestAnimationFrame(tick);
            }

            function freezeAndSave() {
                if (!floatingEl || isDocked) return;
                stopAnim(); rx = null; ry = null;
                const r = floatingEl.getBoundingClientRect();
                if (forceSaveEntry && performance.now() < forceSaveUntil) {
                    saveState(forceSaveEntry, false);
                } else { saveFromRect(r); }
            }

            function syncChevronFlag() {
                if (!floatingEl) return;
                const has = !!floatingEl.querySelector('#show-checkbox-1-label.side-button');
                floatingEl.classList.toggle('jpdbf-has-chevron', has);
            }

            function createPlaceholder(rect) {
                if (placeholderEl && !placeholderEl.isConnected) {
                    placeholderEl = null;
                }
                if (placeholderEl) return;
                placeholderEl = document.createElement('div');
                placeholderEl.className = 'jpdbf-placeholder';
                placeholderEl._fullHeight = rect.height;
                placeholderEl.style.width = rect.width + 'px';
                floatingEl.parentNode.insertBefore(placeholderEl, floatingEl);
            }

            function removePlaceholder() {
                if (placeholderEl) {
                    placeholderEl.remove();
                    placeholderEl = null;
                }
            }

            function detachMenu(initialEvent) {
                isDocked = false;
                justDetached = !!initialEvent;
                const rect = floatingEl.getBoundingClientRect();
                createPlaceholder(rect);
                floatingEl.classList.remove('jpdbf-docked');
                floatingEl.classList.add('jpdbf-float');

                if (floatingEl.parentElement) floatingEl.parentElement.classList.remove('jpdbf-drag-zone');
                const newRect = floatingEl.getBoundingClientRect();
                const mouseX = initialEvent ? initialEvent.clientX : rect.left + rect.width / 2;
                const mouseY = initialEvent ? initialEvent.clientY : rect.top + rect.height / 2;
                const centeredLeft = mouseX - (newRect.width / 2);
                const centeredTop = mouseY - 20;
                floatingEl.style.left = centeredLeft + 'px';
                floatingEl.style.top = centeredTop + 'px';
                startX = mouseX; startY = mouseY; startLeft = centeredLeft;
                startTop = centeredTop;
                ensureOpacityUI();
                saveState(null, false);
            }

            function dockMenu() {
                isDocked = true;
                floatingEl.classList.remove('jpdbf-float'); floatingEl.classList.add('jpdbf-docked');
                if (floatingEl.parentElement) floatingEl.parentElement.classList.add('jpdbf-drag-zone');
                floatingEl.style.left = ''; floatingEl.style.top = '';
                removePlaceholder(); saveState(null, true);
            }

            const onGlobalMove = (e) => {
                if (!dragging || !floatingEl) return;
                if (isDocked) {
                    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
                    if (dist > TUNE.moveThresh) detachMenu(e); else return;
                }
                const r = floatingEl.getBoundingClientRect();
                const nx = startLeft + (e.clientX - startX), ny = startTop + (e.clientY - startY);
                const c = clamp(nx, ny, r.width, r.height);
                writeAndSave(c.left, c.top);
                const movedNow = Math.hypot(c.left - startLeft, c.top - startTop);
                if (detectMode(floatingEl) === 'gr') grMovedDistance = Math.max(grMovedDistance, movedNow);
                const now = performance.now(); pushSample(e.clientX, e.clientY, now); lastMoveX = e.clientX;
                lastMoveY = e.clientY; lastMoveT = now;
                if (placeholderEl && !isDocked && !justDetached) {
                    const distToBottom = window.innerHeight - (r.top + r.height);
                    if (distToBottom < TUNE.dockSnapDist) {
                        placeholderEl.classList.add('ready');
                        placeholderEl.style.height = (placeholderEl._fullHeight || 80) + 'px';
                    }
                    else {
                        placeholderEl.classList.remove('ready');
                        placeholderEl.style.height = '0px';
                    }
                }
            };
            const onGlobalUp = (e) => {
                if (!dragging || !floatingEl) return;
                const wasFreshlyDetached = justDetached;
                justDetached = false;

                dragging = false;
                try { floatingEl.releasePointerCapture(e.pointerId); } catch { }

                const r = floatingEl.getBoundingClientRect();
                const distToBottom = window.innerHeight - (r.top + r.height);

                if (!isDocked && distToBottom < TUNE.dockSnapDist && !wasFreshlyDetached) {
                    dockMenu();
                    return;
                }

                const now = performance.now();
                pushSample(e.clientX, e.clientY, now);
                if (detectMode(floatingEl) === 'gr') grMovedSinceShown = grMovedDistance > TUNE.moveThresh;
                if (!isDocked) {
                    if ((now - lastMoveT) >= TUNE.releaseQuietMs && Math.hypot(e.clientX - lastMoveX, e.clientY - lastMoveY) <= TUNE.releaseQuietPx) {
                        freezeAndSave();
                        return;
                    }
                    const v = releaseVelocity();
                    startInertia(v.vx, v.vy);
                }
            };
            const onGlobalResize = () => {
                if (!floatingEl || isDocked) return;
                const st = loadState(); if (!st || !st.pos) return;
                const r0 = floatingEl.getBoundingClientRect(), p = applyAnchoredPosition(r0.width, r0.height, st.pos);
                writeAndSave(Math.min(Math.max(0, p.left), innerWidth - r0.width), Math.min(Math.max(0, p.top), innerHeight - r0.height));
            };

            window.addEventListener('pointermove', onGlobalMove);
            window.addEventListener('pointerup', onGlobalUp);
            window.addEventListener('resize', onGlobalResize);
            function attachDrag(el) {
                if (el._jpdbfBound) return;
                el._jpdbfBound = true;
                const dragSources = [el];
                if (el.parentElement && el.parentElement !== document.body && el.parentElement !== document.documentElement) {
                    dragSources.push(el.parentElement);
                    if (isDocked) el.parentElement.classList.add('jpdbf-drag-zone');
                }

                const onPointerDown = (e) => {
                    if (e.button !== 0 || e.target.closest(INTERACTIVE)) return;
                    if (isDocked) {
                        if (!el.contains(e.target) && e.target !== el.parentElement) return;
                    } else {
                        if (!el.contains(e.target)) return;
                    }

                    stopAnim();
                    rx = null; ry = null; dragging = true;
                    const r = el.getBoundingClientRect();
                    startX = e.clientX; startY = e.clientY;
                    startLeft = r.left; startTop = r.top;
                    grMovedDistance = 0;
                    samples.length = 0; const now = performance.now(); pushSample(e.clientX, e.clientY, now);
                    lastMoveX = e.clientX; lastMoveY = e.clientY; lastMoveT = now;
                    e.preventDefault();
                    try {
                        el.setPointerCapture(e.pointerId);
                    } catch { }
                };
                dragSources.forEach(src => src.addEventListener('pointerdown', onPointerDown));
            }

            let chevronObs = null;
            let sizeObs = null;
            function startSizeObserver(el) {
                if (sizeObs) try {
                    sizeObs.disconnect();
                } catch { }
                sizeObs = new ResizeObserver(() => {
                    if (suppressRO > 0) { suppressRO--; return; }
                    if (!floatingEl || isDocked) return;
                    const r = el.getBoundingClientRect(), st = loadState(), pos = st && st.pos ? st.pos : null;
                    if (!pos) return;
                    const c = clamp(r.left, r.top, r.width, r.height);
                    el.style.left = c.left + 'px'; el.style.top = c.top + 'px';
                    saveFromRect(el.getBoundingClientRect());
                });
                sizeObs.observe(el);
            }

            function applySaved(el) {
                const st = loadState();
                isDocked = (st && typeof st.docked === 'boolean') ? st.docked : true;
                if (isDocked) { dockMenu(); return; }
                detachMenu(null);
                const r0 = el.getBoundingClientRect();
                if (st && st.pos) {
                    const p = applyAnchoredPosition(r0.width, r0.height, st.pos);
                    el.style.left = p.left + 'px'; el.style.top = p.top + 'px';
                } else {
                    const c = clamp(Math.max(0, innerWidth - r0.width - 20), Math.max(0, innerHeight - r0.height - 20), r0.width, r0.height);
                    el.style.left = c.left + 'px'; el.style.top = c.top + 'px';
                }
            }

            function runPendingCenterComp() {
                if (!pendingCenter || !floatingEl || isDocked) return;
                const r = floatingEl.getBoundingClientRect();
                let nl = r.left, nt = r.top;
                if (!pendingCenter.anchX) nl = r.left - (r.width - pendingCenter.prevW) / 2;
                if (!pendingCenter.anchY) nt = r.top - (r.height - pendingCenter.prevH) / 2;
                const c = clamp(nl, nt, r.width, r.height);
                suppressRO = 2; floatingEl.style.left = c.left + 'px'; floatingEl.style.top = c.top + 'px';
                saveFromRect(floatingEl.getBoundingClientRect()); pendingCenter = null;
            }

            function initMenu(el) {
                if (!el || el._jpdbfBound) return;
                if (floatingEl && floatingEl !== el) {
                    placeholderEl = null;
                }

                floatingEl = el;
                try {
                    el.classList.add('jpdbf-prehide-target');
                } catch { }
                const hasChevron = !!el.querySelector('#show-checkbox-1-label.side-button');
                el.classList.toggle('jpdbf-has-chevron', hasChevron);
                applySaved(el); applyOpacityTo(el); attachDrag(el); startSizeObserver(el);

                if (chevronObs) try {
                    chevronObs.disconnect();
                } catch { }
                chevronObs = new MutationObserver(() => syncChevronFlag());
                chevronObs.observe(el, { childList: true, subtree: true, attributes: true });

                if (detectMode(el) === 'gr' && !isDocked) ensureOpacityUI();
                if (window.__jpdbf_unhideJPDB) window.__jpdbf_unhideJPDB(el);
                requestAnimationFrame(runPendingCenterComp);
                setTimeout(runPendingCenterComp, 120);
            }

            const boot = () => {
                const c = findMenu();
                if (c) initMenu(c);
            };

            const observer = new MutationObserver((mutations) => {
                let nodesAdded = false;
                for (const m of mutations) {
                    if (m.addedNodes.length > 0) {
                        nodesAdded = true;
                        break;
                    }
                }
                if (nodesAdded) boot();
            });
            observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

            let lastHref = location.href;
            setInterval(() => { if (location.href !== lastHref) { lastHref = location.href; boot(); } }, 500);
            document.addEventListener('click', (e) => {
                if (!floatingEl || !floatingEl.contains(e.target)) return;
                const t = e.target;
                if (t.matches('#show-answer, input[type="submit"][value="Show answer"]')) {
                    if (isDocked) return;
                    const r = floatingEl.getBoundingClientRect(); lastSAEntry = entryFromRect(r); grMovedSinceShown = false;
                    pendingCenter = { prevW: r.width, prevH: r.height, anchX: isAnchoredX(lastSAEntry), anchY: isAnchoredY(lastSAEntry) };
                    freezeAndSave(); return;
                }
                if (t.matches('#show-checkbox-1-label')) setTimeout(ensureOpacityUI, 0);
            }, true);
            document.addEventListener('submit', (e) => {
                if (!(floatingEl && floatingEl.contains(e.target)) || isDocked) return;
                const mode = detectMode(floatingEl), r = floatingEl.getBoundingClientRect();
                if (mode === 'sa') {
                    lastSAEntry = entryFromRect(r); grMovedSinceShown = false;
                    pendingCenter = { prevW: r.width, prevH: r.height, anchX: isAnchoredX(lastSAEntry), anchY: isAnchoredY(lastSAEntry) };
                    freezeAndSave(); return;
                }
                if (mode === 'gr') {
                    let nextEntry;
                    if (!grMovedSinceShown) nextEntry = lastSAEntry || entryFromRect(r);
                    else { const near = maskNearEdges(r, TUNE.anchorSense); nextEntry = (near.L || near.R || near.T || near.B) ? makePartialAnchorEntry(r, near) : { x: r.left, y: r.top, ax: null, ay: null, offR: 0, offB: 0, lockL: false, lockR: false, lockT: false, lockB: false }; }
                    setForcedSave(nextEntry);
                    pendingCenter = { prevW: r.width, prevH: r.height, anchX: isAnchoredX(nextEntry), anchY: isAnchoredY(nextEntry) };
                    freezeAndSave(); return;
                }
            }, true);
            document.addEventListener('keydown', (e) => { if (floatingEl && floatingEl.contains(e.target) && e.key === 'Enter') freezeAndSave(); }, true);
            window.addEventListener('pagehide', freezeAndSave, { capture: true });
            window.addEventListener('beforeunload', freezeAndSave, { capture: true });
            document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') freezeAndSave(); }, { capture: true });

            boot();
            setTimeout(boot, 400);

        })();
    })();

    (function () {
        const addStyle = (css) => {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        };

        (function () {
            const TARGET_HEADERS = ["Meanings", "Kanji used", "Composed of"];
            const SNAP_DISTANCE = 30;
            const DRAG_THRESHOLD = 3;
            const STORAGE_PREFIX = "jpdb_layout_";
            let globalZIndex = 100;

            addStyle(`
                .jpdb-drag-handle { cursor: grab; user-select: none; display: inline-block; transition: opacity 0.1s; }
                .jpdb-drag-handle:active { cursor: grabbing; }
                .jpdb-drag-handle:hover { opacity: 0.8; }
                .jpdb-detached {
                    position: fixed !important;
                    background-color: rgb(24, 24, 24) !important;
                    border: 1px solid #444; border-radius: 6px;
                    padding: 10px;
                    min-width: 200px;
                    resize: both; overflow: auto;
                    will-change: transform, left, top; z-index: 100; margin: 0 !important;
                    cursor: grab;
                }
                .jpdb-detached.jpdb-dragging { cursor: grabbing !important; }
                .jpdb-detached a, .jpdb-detached button,
                .jpdb-detached input, .jpdb-detached textarea,
                .jpdb-detached select, .jpdb-detached label,
                .jpdb-detached .description { cursor: auto; }
                .jpdb-detached a:hover, .jpdb-detached button:hover { cursor: pointer; }
                .jpdb-placeholder {
                    height: 0px;
                    margin: 0px; opacity: 0; border: 0px dashed transparent;
                    overflow: hidden; border-radius: 4px; box-sizing: border-box;
                    background: rgba(76, 175, 80, 0.1);
                    color: transparent;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.8rem; transition: height 0.2s ease, opacity 0.2s ease, margin 0.2s;
                    pointer-events: none;
                }
                .jpdb-placeholder.ready-to-dock {
                    opacity: 1;
                    border: 2px dashed #4CAF50; color: #4CAF50; margin-bottom: 1rem;
                }
                body.jpdb-dragging-active { user-select: none !important; }
            `);
            function constrainToViewport(el) {
                if (!el) return;
                const winW = window.innerWidth;
                const winH = window.innerHeight;
                const w = el.offsetWidth;
                const h = el.offsetHeight;
                let x = parseFloat(el.style.left) || 0;
                let y = parseFloat(el.style.top) || 0;
                if (x + w > winW) x = winW - w;
                if (x < 0) x = 0;
                if (y + h > winH) y = winH - h;
                if (y < 0) y = 0;
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            }

            const Storage = {
                save(key, element, overrides = {}) {
                    const rect = {
                        left: parseFloat(element.style.left), top: parseFloat(element.style.top),
                        width: element.offsetWidth, height: element.offsetHeight,
                        zIndex: parseInt(element.style.zIndex || 100),
                        docked: false,
                        ...overrides
                    };
                    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(rect));
                },
                load(key) {
                    const data = localStorage.getItem(STORAGE_PREFIX + key);
                    return data ? JSON.parse(data) : null;
                },
                remove(key) { localStorage.removeItem(STORAGE_PREFIX + key); }
            };
            const DragManager = {
                active: false, element: null, placeholder: null,
                startX: 0, startY: 0, initialLeft: 0, initialTop: 0,
                rafId: null, inertiaRafId: null,

                vx: 0, vy: 0, history: [],

                start(e, container) {
                    if (this.inertiaRafId) {
                        cancelAnimationFrame(this.inertiaRafId);
                        this.inertiaRafId = null;
                    }

                    this.active = true;
                    this.element = container;

                    this.element.classList.add('jpdb-dragging');
                    document.body.classList.add('jpdb-dragging-active');

                    this.startX = e.clientX;
                    this.startY = e.clientY;

                    this.history = [];
                    this.vx = 0;
                    this.vy = 0;
                    this.history.push({ x: e.clientX, y: e.clientY, t: Date.now() });

                    if (this.element.classList.contains('jpdb-detached')) {
                        const comp = window.getComputedStyle(this.element);
                        this.initialLeft = parseFloat(comp.left);
                        this.initialTop = parseFloat(comp.top);
                        this.bringToFront();
                        this.placeholder = this.element._placeholderRef || null;
                    } else {
                        this.initialLeft = 0;
                        this.initialTop = 0;
                    }
                    window.addEventListener('mousemove', this.onMove);
                    window.addEventListener('mouseup', this.onUp);
                },

                onMove(e) {
                    if (!DragManager.active) return;
                    if (DragManager.rafId) cancelAnimationFrame(DragManager.rafId);
                    DragManager.rafId = requestAnimationFrame(() => DragManager.processMove(e.clientX, e.clientY));
                },

                processMove(cx, cy) {
                    const now = Date.now();
                    this.history.push({ x: cx, y: cy, t: now });
                    while (this.history.length > 0 && now - this.history[0].t > 60) {
                        this.history.shift();
                    }

                    const dx = cx - this.startX;
                    const dy = cy - this.startY;
                    if (!this.element.classList.contains('jpdb-detached')) {
                        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) this.performDetach();
                        else return;
                    }

                    this.element.style.left = `${this.initialLeft + dx}px`;
                    this.element.style.top = `${this.initialTop + dy}px`;

                    if (this.placeholder) {
                        const pRect = this.placeholder.getBoundingClientRect();
                        const cRect = this.element.getBoundingClientRect();
                        const dist = Math.hypot(pRect.x - cRect.x, pRect.y - cRect.y);
                        if (dist < SNAP_DISTANCE) {
                            if (!this.placeholder.classList.contains('ready-to-dock')) {
                                this.placeholder.classList.add('ready-to-dock');
                                this.placeholder.style.height = (this.placeholder._originalHeight || 50) + 'px';
                            }
                        } else if (this.placeholder.classList.contains('ready-to-dock')) {
                            this.placeholder.classList.remove('ready-to-dock');
                            this.placeholder.style.height = '0px';
                        }
                    }
                },

                performDetach() {
                    const rect = this.element.getBoundingClientRect();
                    this.createPlaceholder(rect);

                    const id = this.getElementId(this.element);
                    const saved = id ? Storage.load(id) : null;

                    this.element.classList.add('jpdb-detached');
                    this.element.classList.add('jpdb-dragging');
                    this.bringToFront();
                    this.element.style.left = rect.left + 'px';
                    this.element.style.top = rect.top + 'px';
                    if (saved && saved.width) {
                        this.element.style.width = saved.width + 'px';
                        if (saved.height) this.element.style.height = saved.height + 'px';
                    } else {
                        this.element.style.width = rect.width + 'px';
                    }

                    const comp = window.getComputedStyle(this.element);
                    this.initialLeft = parseFloat(comp.left);
                    this.initialTop = parseFloat(comp.top);
                },

                createPlaceholder(rect) {
                    this.placeholder = document.createElement('div');
                    this.placeholder.classList.add('jpdb-placeholder');
                    this.placeholder._originalHeight = rect.height;
                    this.placeholder.style.width = rect.width + 'px';
                    this.placeholder.style.height = '0px';
                    this.element.parentNode.insertBefore(this.placeholder, this.element);
                    this.element._placeholderRef = this.placeholder;
                },

                bringToFront() {
                    globalZIndex++;
                    this.element.style.zIndex = globalZIndex;
                    const id = this.getElementId(this.element);
                    if (id) Storage.save(id, this.element);
                },

                onUp() {
                    this.active = false;
                    window.removeEventListener('mousemove', this.onMove);
                    window.removeEventListener('mouseup', this.onUp);
                    if (this.rafId) cancelAnimationFrame(this.rafId);

                    if (this.element) {
                        this.element.classList.remove('jpdb-dragging');
                    }
                    document.body.classList.remove('jpdb-dragging-active');
                    const now = Date.now();
                    const targetTime = now - 40;

                    let prev = this.history[0];
                    if (this.history.length > 1) {
                         for (let i = this.history.length - 1; i >= 0; i--) {
                             const pt = this.history[i];
                             if (pt.t <= targetTime) {
                                 prev = pt;
                                 break;
                             }
                             prev = pt;
                         }
                    }

                    if (prev && this.history.length > 0) {
                        const last = this.history[this.history.length - 1];
                        const dt = last.t - prev.t;

                        if (dt > 0 && (now - last.t) < 80) {
                             this.vx = (last.x - prev.x) / dt * 16;
                             this.vy = (last.y - prev.y) / dt * 16;
                        } else {
                            this.vx = 0;
                            this.vy = 0;
                        }
                    } else {
                        this.vx = 0;
                        this.vy = 0;
                    }

                    if (this.placeholder && this.placeholder.classList.contains('ready-to-dock')) {
                        this.dock();
                    } else if (this.element && this.element.classList.contains('jpdb-detached')) {
                        if (Math.abs(this.vx) > 0.5 || Math.abs(this.vy) > 0.5) {
                            this.startInertia();
                        } else {
                            constrainToViewport(this.element);
                            const id = this.getElementId(this.element);
                            if (id) Storage.save(id, this.element);
                            this.element = null;
                            this.placeholder = null;
                        }
                    } else {
                        this.element = null;
                        this.placeholder = null;
                    }
                },

                startInertia() {
                    const friction = 0.965;
                    const stopThreshold = 0.05;
                    const bounceFactor = 0.6;
                    const throwPower = 1.0;

                    let currentLeft = parseFloat(this.element.style.left);
                    let currentTop = parseFloat(this.element.style.top);
                    const elWidth = this.element.offsetWidth;
                    const elHeight = this.element.offsetHeight;

                    this.vx *= throwPower;
                    this.vy *= throwPower;
                    const inertiaLoop = () => {
                        this.vx *= friction;
                        this.vy *= friction;

                        let nextLeft = currentLeft + this.vx;
                        let nextTop = currentTop + this.vy;

                        const winW = window.innerWidth;
                        const winH = window.innerHeight;

                        if (nextLeft + elWidth > winW) {
                            nextLeft = winW - elWidth;
                            this.vx = -this.vx * bounceFactor;
                        }
                        else if (nextLeft < 0) {
                            nextLeft = 0;
                            this.vx = -this.vx * bounceFactor;
                        }

                        if (nextTop + elHeight > winH) {
                            nextTop = winH - elHeight;
                            this.vy = -this.vy * bounceFactor;
                        }
                        else if (nextTop < 0) {
                            nextTop = 0;
                            this.vy = -this.vy * bounceFactor;
                        }

                        currentLeft = nextLeft;
                        currentTop = nextTop;

                        if (this.element) {
                            this.element.style.left = `${currentLeft}px`;
                            this.element.style.top = `${currentTop}px`;
                        }

                        if (Math.abs(this.vx) > stopThreshold || Math.abs(this.vy) > stopThreshold) {
                            this.inertiaRafId = requestAnimationFrame(inertiaLoop);
                        } else {
                            if (this.element) {
                                constrainToViewport(this.element);
                                const id = this.getElementId(this.element);
                                if (id) Storage.save(id, this.element);
                            }
                            this.element = null;
                            this.placeholder = null;
                            this.inertiaRafId = null;
                        }
                    };
                    this.inertiaRafId = requestAnimationFrame(inertiaLoop);
                },

                dock() {
                    const id = this.getElementId(this.element);
                    if (id) Storage.save(id, this.element, { docked: true });
                    this.element.classList.remove('jpdb-detached');
                    this.element.classList.remove('jpdb-dragging');
                    this.element.style.cssText = "";
                    this.element._placeholderRef = null;
                    this.placeholder.remove();
                    this.element = null;
                    this.placeholder = null;
                },

                getElementId(container) {
                    const header = container.querySelector('h6, .jpdb-drag-handle');
                    if (header) {
                        const text = header.textContent.trim();
                        const match = TARGET_HEADERS.find(t => text.startsWith(t));
                        return match || null;
                    }
                    return null;
                }
            };

            DragManager.onMove = DragManager.onMove.bind(DragManager);
            DragManager.onUp = DragManager.onUp.bind(DragManager);
            function processHeaders() {
                const headers = document.querySelectorAll('h6, div, span');
                headers.forEach(header => {
                    if (header.classList.contains('jpdb-drag-handle') || header.querySelector('.jpdb-drag-handle')) return;
                    const text = header.textContent.trim();
                    const targetId = TARGET_HEADERS.find(t => text.startsWith(t));
                    if (!targetId || header.innerText.length > 50 || header.querySelectorAll('div').length > 0) return;

                    const container = header.parentElement;
                    if (container.classList.contains('jpdb-placeholder')) return;

                    const childNodes = Array.from(header.childNodes);
                    const textNode = childNodes.find(n => n.nodeType === Node.TEXT_NODE && TARGET_HEADERS.some(t => n.textContent.trim().startsWith(t)));
                    if (textNode) {
                        const span = document.createElement('span');
                        span.className = 'jpdb-drag-handle';
                        span.textContent = textNode.textContent;
                        span.title = "Drag to detach";
                        header.replaceChild(span, textNode);
                    } else header.classList.add('jpdb-drag-handle');

                    const savedState = Storage.load(targetId);
                    if (savedState && !savedState.docked) {
                        const rect = container.getBoundingClientRect();
                        const p = document.createElement('div');
                        p.classList.add('jpdb-placeholder');
                        p._originalHeight = rect.height || 50;
                        p.style.width = (rect.width || 200) + 'px';
                        p.style.height = '0px';
                        container.parentNode.insertBefore(p, container);
                        container._placeholderRef = p;
                        container.classList.add('jpdb-detached');
                        container.style.left = savedState.left + 'px';
                        container.style.top = savedState.top + 'px';
                        container.style.width = savedState.width + 'px';
                        container.style.height = savedState.height + 'px';

                        const savedZ = savedState.zIndex || 100;
                        container.style.zIndex = savedZ;
                        if (savedZ >= globalZIndex) globalZIndex = savedZ + 1;

                        constrainToViewport(container);
                    }
                });
            }

            document.addEventListener('mouseup', (e) => {
                const detached = e.target.closest('.jpdb-detached');
                if (detached) {
                    const id = DragManager.getElementId(detached);
                    if (id) Storage.save(id, detached);
                }
            });
            document.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                const target = e.target;
                const detached = target.closest('.jpdb-detached');
                const handle = target.closest('.jpdb-drag-handle');

                if (detached) {
                    e.stopPropagation();
                    globalZIndex++;
                    detached.style.zIndex = globalZIndex;
                    const id = DragManager.getElementId(detached);
                    if (id) Storage.save(id, detached);

                    if (target.closest('a, button, input, textarea, select, label, audio, video')) return;

                    if (!target.classList.contains('jpdb-drag-handle')) {
                        const hasText = Array.from(target.childNodes).some(node =>
                            node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
                        );
                        if (hasText) {
                            return;
                        }
                    }

                    const rect = detached.getBoundingClientRect();
                    const isVScroll = detached.scrollHeight > detached.clientHeight &&
                        e.clientX >= rect.right - (detached.offsetWidth - detached.clientWidth);
                    const isHScroll = detached.scrollWidth > detached.clientWidth &&
                        e.clientY >= rect.bottom - (detached.offsetHeight - detached.clientHeight);
                    if (isVScroll || isHScroll) return;

                    const RESIZE_MARGIN = 20;
                    if (e.clientX > rect.right - RESIZE_MARGIN && e.clientY > rect.bottom - RESIZE_MARGIN) return;
                    e.preventDefault();
                    DragManager.start(e, detached);

                } else if (handle) {
                    e.preventDefault();
                    const container = handle.closest('h6, div').parentElement;
                    DragManager.start(e, container);
                }
            });
            window.addEventListener('resize', () => {
                document.querySelectorAll('.jpdb-detached').forEach(el => {
                    constrainToViewport(el);
                    const id = DragManager.getElementId(el);
                    if (id) Storage.save(id, el);
                });
            });
            const observer = new MutationObserver((mutations) => {
                let relevant = false;
                for (const m of mutations) {
                    if (m.addedNodes.length > 0) {
                        relevant = true;
                        break;
                    }
                }
                if (relevant) processHeaders();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

            processHeaders();
        })();
    })();

})();