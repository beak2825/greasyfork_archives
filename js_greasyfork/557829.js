// ==UserScript==
// @name         Diep.io Flipfire 2025 December
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  F = flipfire Toggle; RMB to start flipfiring; Fighter doesn't work, so it's excluded.
// @author       Mi300 + EmirtheBoss(extern.onTouchMove from Asty_s)
// @match        https://diep.io/*
// @grant        unsafeWindow
// @license      Copyright Emirtheboss
// @downloadURL https://update.greasyfork.org/scripts/557829/Diepio%20Flipfire%202025%20December.user.js
// @updateURL https://update.greasyfork.org/scripts/557829/Diepio%20Flipfire%202025%20December.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- unsafeWindow fallback so script also works when pasted in console ---
    try {
        if (typeof unsafeWindow === 'undefined') {
            window.unsafeWindow = window;
        }
    } catch (e) {
        // ignore, real userscript env will already provide unsafeWindow
    }

    // ---------- CONFIG / MODES ----------
    const toRadians = (deg) => deg * Math.PI / 180;

    const scriptInfo = [
        { name: 'Triangle-Rear',   angles: [0, 210], timings: [110, 220, 320, 350] },
        // Fighter-Side removed from mode rotation because Fighter flipfire was removed from the game:
        // { name: 'Fighter-Side',    angles: [0, 90],  timings: [100, 200, 300, 330] },
        { name: 'Gunner-Trapper',  angles: [180, 0], timings: [150, 250, 1000, 1100] },
        { name: 'Octo',            angles: [0, 45],  timings: [100, 200, 300, 330] }
    ];

    let currentIndex = 0;
    let currentMode  = scriptInfo[currentIndex];

    function isGunnerTrapper() {
        return currentMode.name === 'Gunner-Trapper';
    }

    // ---------- STATE ----------
    let flipfireEnabled = false;  // F toggle
    let stacking        = false;  // Right click hold
    let flipInterval    = null;

    // live real mouse (for locking)
    let lastRealMouseX = window.innerWidth / 2;
    let lastRealMouseY = window.innerHeight / 2;

    // locked base used for aiming each cycle
    let lockedMouseX = null;
    let lockedMouseY = null;

    // angle offset per mode step; reused by getOffsetCoords
    let angleOffset = 0;

    // ---------- HUD ----------
    const hud = document.createElement('div');
    hud.style.position = 'fixed';
    hud.style.top = '10px';
    hud.style.left = '10px';
    hud.style.padding = '6px 10px';
    hud.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    hud.style.color = 'white';
    hud.style.border = '1px solid white';
    hud.style.borderRadius = '5px';
    hud.style.fontFamily = 'Arial, sans-serif';
    hud.style.fontSize = '14px';
    hud.style.zIndex = '9999';
    hud.style.pointerEvents = 'none';
    document.body.appendChild(hud);

    function updateHUD() {
        hud.innerHTML =
            `[F] Flipfire: ${flipfireEnabled ? 'ON' : 'OFF'}<br>` +
            `[R] Mode: ${currentMode.name}<br>` +
            `[RMB] Stack: ${stacking ? 'ON' : 'OFF'}`;
        hud.style.color = flipfireEnabled ? 'lightgreen' : 'white';
    }

    // ---------- GT OVERLAY (blocks real mouse from game) ----------
    const gtOverlay = document.createElement('div');
    gtOverlay.style.position = 'fixed';
    gtOverlay.style.top = '0';
    gtOverlay.style.left = '0';
    gtOverlay.style.width = '100vw';
    gtOverlay.style.height = '100vh';
    gtOverlay.style.zIndex = '9998';          // just under HUD
    gtOverlay.style.background = 'transparent';
    gtOverlay.style.pointerEvents = 'none';   // default: invisible/no block
    gtOverlay.style.userSelect = 'none';
    document.body.appendChild(gtOverlay);

    function updateGTOverlay() {
        // Block mouse ONLY when GT + flipfire + stacking
        if (isGunnerTrapper() && flipfireEnabled && stacking) {
            gtOverlay.style.pointerEvents = 'auto';   // capture mouse, stop canvas from seeing it
        } else {
            gtOverlay.style.pointerEvents = 'none';   // let mouse hit game normally
        }
    }

    // ---------- REAL MOUSE TRACKING ----------
    // Also track for extern-driving variant
    document.addEventListener('mousemove', (e) => {
        if (!e.isTrusted) return;

        if (document.pointerLockElement === document.body) {
            lastRealMouseX += e.movementX;
            lastRealMouseY += e.movementY;
        } else {
            lastRealMouseX = e.clientX;
            lastRealMouseY = e.clientY;
        }
    });

    // ---------- EXTERN MOUSE HELPERS ----------
    // save mouse for extern-based aiming
    let savedMouseX = window.innerWidth / 2;
    let savedMouseY = window.innerHeight / 2;

    window.addEventListener("mousemove", e => {
        if (!e.isTrusted) return;
        savedMouseX = e.clientX;
        savedMouseY = e.clientY;
    });

    function getOffsetCoords(x, y) {
        const cosine = Math.cos(angleOffset);
        const sine = Math.sin(angleOffset);
        const tank_x = window.innerWidth / 2;
        const tank_y = window.innerHeight / 2;
        const ox = x - tank_x;
        const oy = y - tank_y;
        const _rx = cosine * ox - sine * oy;
        const _ry = sine * ox + cosine * oy;
        return [_rx + tank_x, _ry + tank_y];
    }

    function hasExtern() {
        return typeof unsafeWindow !== 'undefined'
            && unsafeWindow
            && unsafeWindow.extern
            && typeof unsafeWindow.extern.onTouchMove === "function";
    }

    function setMousePos(x, y) {
        if (hasExtern()) {
            try {
                unsafeWindow.extern.onTouchMove(-1, x, y);
            } catch (e) {
                // ignore and fall back
                sendMouseMoveDOM(x, y);
            }
        } else {
            sendMouseMoveDOM(x, y);
        }
    }

    // Fallback: still useful if extern is missing
    function sendMouseMoveDOM(x, y) {
        const evt = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true
        });
        document.dispatchEvent(evt);
    }

    // ---------- INPUT HELPERS ----------
    function pressSpaceOnce(downDelay, upDelay) {
        const down = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true
        });
        const up = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            which: 32,
            bubbles: true
        });

        setTimeout(() => document.dispatchEvent(down), downDelay);
        setTimeout(() => document.dispatchEvent(up),   upDelay);
    }

    // ---------- FLIP LOGIC ----------
    function startFlipLoop() {
        if (flipInterval) return;

        flipInterval = setInterval(() => {
            if (!flipfireEnabled || !stacking) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const cx = width / 2;
            const cy = height / 2;

            // PER-CYCLE LOCK FOR ALL MODES, INCLUDING GT
            lockedMouseX = lastRealMouseX;
            lockedMouseY = lastRealMouseY;

            const baseX = lockedMouseX;
            const baseY = lockedMouseY;

            const mx = baseX - cx;
            const my = baseY - cy;

            // first rotation
            angleOffset = toRadians(currentMode.angles[0]);
            let cosA = Math.cos(angleOffset);
            let sinA = Math.sin(angleOffset);

            const rot1x = cosA * mx - sinA * my;
            const rot1y = sinA * mx + cosA * my;

            let flipX1 = cx + rot1x;
            let flipY1 = cy + rot1y;

            flipX1 = Math.max(0, Math.min(width - 1, flipX1));
            flipY1 = Math.max(0, Math.min(height - 1, flipY1));

            // send first angle via extern if possible
            setTimeout(() => {
                setMousePos(flipX1, flipY1);
            }, 0);

            const t0 = currentMode.timings[0];
            const t1 = currentMode.timings[1];
            const t2 = currentMode.timings[2];

            // space down/up
            pressSpaceOnce(t0, t2);

            // second rotation at t1
            setTimeout(() => {
                const angle2 = toRadians(currentMode.angles[1]);
                angleOffset = angle2;
                const cosB = Math.cos(angle2);
                const sinB = Math.sin(angle2);

                const rot2x = cosB * mx - sinB * my;
                const rot2y = sinB * mx + cosB * my;

                let flipX2 = cx + rot2x;
                let flipY2 = cy + rot2y;

                flipX2 = Math.max(0, Math.min(width - 1, flipX2));
                flipY2 = Math.max(0, Math.min(height - 1, flipY2));

                setMousePos(flipX2, flipY2);
            }, t1);

            // snap aim back to base position near end of cycle
            setTimeout(() => {
                setMousePos(baseX, baseY);
            }, currentMode.timings[3] - 5);

        }, currentMode.timings[3]);
    }

    function stopFlipLoop() {
        clearInterval(flipInterval);
        flipInterval = null;
    }

    function restartFlipLoop() {
        stopFlipLoop();
        if (flipfireEnabled) startFlipLoop();
    }

    // ---------- EVENTS ----------
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (key === 'f' && !e.repeat) {
            flipfireEnabled = !flipfireEnabled;

            if (!flipfireEnabled) {
                lockedMouseX = null;
                lockedMouseY = null;
            }

            if (flipfireEnabled) {
                startFlipLoop();
            } else {
                stopFlipLoop();
            }

            updateHUD();
            updateGTOverlay();
        }

        if (key === 'r' && !e.repeat) {
            currentIndex = (currentIndex + 1) % scriptInfo.length;
            currentMode = scriptInfo[currentIndex];

            lockedMouseX = null;
            lockedMouseY = null;

            restartFlipLoop();
            updateHUD();
            updateGTOverlay();
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            stacking = true;

            if (flipfireEnabled && !flipInterval) {
                startFlipLoop();
            }

            updateHUD();
            updateGTOverlay();
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
            stacking = false;

            lockedMouseX = null;
            lockedMouseY = null;

            updateHUD();
            updateGTOverlay();
        }
    });

    window.addEventListener('blur', () => {
        flipfireEnabled = false;
        stacking = false;
        lockedMouseX = null;
        lockedMouseY = null;
        stopFlipLoop();
        updateHUD();
        updateGTOverlay();
    });

    // ---------- INIT ----------
    updateHUD();
    updateGTOverlay();
    console.log('Diep.io Flipfire 2025 v1.5');
})();
