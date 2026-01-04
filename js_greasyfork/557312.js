// ==UserScript==
// @name         Slither.io — Defensive Bot (basic)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Basic defensive/autopilot helper for slither.io
// @author       You
// @match        https://slither.io/*
// @license      MIT
// @grant        none
// @match        http://slither.io/*
// @match        https://slither.io/*
// @match        http://www.slither.io/*
// @match        https://www.slither.io/*

// @downloadURL https://update.greasyfork.org/scripts/557312/Slitherio%20%E2%80%94%20Defensive%20Bot%20%28basic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557312/Slitherio%20%E2%80%94%20Defensive%20Bot%20%28basic%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    /*************************************************************************
     * DISCLAIMER
     * - This is a **basic template** for a defensive bot. Slither's client
     *   internals and variable names vary by version. The script attempts
     *   several fallbacks to access player & world data, but you will likely
     *   need to tweak the `getGameObjects()` helper to match the running
     *   slither client on your machine.
     * - Use only for learning / private testing. Publishing a userscript on
     *   public platforms may violate slither.io terms of service — you are
     *   responsible for compliance.
     *************************************************************************/

    // Configuration
    const LOOP_MS = 80;            // main loop interval
    const SAFE_DISTANCE = 180;     // preferred minimum distance (world units)
    const TURN_SENSITIVITY = 0.9;  // how strongly we steer away (0..1)
    const DEBUG = false;           // draw overlay & log

    // Internal state
    let canvas = null;
    let overlay = null;

    // Utilities
    function findCanvas() {
        // known id in many versions
        return document.getElementById('game') || document.querySelector('canvas');
    }

    // Try to extract player & other snakes from known in-client objects.
    // You will probably need to adapt this to the actual client variables.
    function getGameObjects() {
        const result = {
            player: null,   // {x, y, r}
            others: []      // [{x, y, r}, ...]
        };

        // --- Attempt 1: common slither client globals ---
        try {
            // In many slither builds `window.snake` contains the player's snake
            // and `window.snakes` (or `window.SNAKES`) contains others. Property
            // names for coordinates often are `xx`, `yy` or `xx`, `yy` (double).
            if (window.snake && window.snake.xx !== undefined) {
                const s = window.snake;
                result.player = {x: s.xx, y: s.yy, r: (s.sc || 10)};
            }
            const altSnakes = window.snakes || window.SNAKES || window._snakes || null;
            if (altSnakes && altSnakes.length) {
                for (let i = 0; i < altSnakes.length; i++) {
                    const o = altSnakes[i];
                    if (!o) continue;
                    // skip the player object if it's included in the list
                    if (o === window.snake) continue;
                    const ox = o.xx !== undefined ? o.xx : (o.x || 0);
                    const oy = o.yy !== undefined ? o.yy : (o.y || 0);
                    const or = o.sc || (o.s && o.s.length) || 10;
                    result.others.push({x: ox, y: oy, r: or});
                }
            }
        } catch (e) {
            // ignore
        }

        // --- Attempt 2: inspect renderer objects (fallback) ---
        // If the first attempt failed, try to read visible sprites/points from
        // the game's render arrays. These names change frequently; adapt as needed.
        try {
            if (!result.player) {
                // some clients store player as `window.player` or `window.mySnake`
                const cand = window.player || window.mySnake || window.Me;
                if (cand && cand.xx !== undefined) {
                    result.player = {x: cand.xx, y: cand.yy, r: cand.sc || 10};
                }
            }
        } catch (e) {}

        // --- As a last resort: if we can't find player/others, return nulls ---
        return result;
    }

    // Convert world coordinates to canvas coordinates using available camera state
    // This needs adaptation to your slither client. We'll attempt some known names.
    function worldToCanvas(wx, wy) {
        if (!canvas) return {cx: 0, cy: 0};

        // Many slither clients expose camera translation/scale like `window.view_x` / `window.view_y` / `window.scale` or `window.camera`.
        let camX = window.view_x || window.viewX || window.camx || 0;
        let camY = window.view_y || window.viewY || window.camy || 0;
        let scale = window.scale || window.zoom || window.camScale || 1;

        // Fall back to simple mapping: center canvas = player's screen center
        const w = canvas.width;
        const h = canvas.height;

        const cx = (wx - camX) * scale + w / 2;
        const cy = (wy - camY) * scale + h / 2;
        return {cx, cy};
    }

    // Send a synthetic mousemove to the canvas to steer the snake
    function sendMouseMove(screenX, screenY) {
        if (!canvas) return;
        const ev = new MouseEvent('mousemove', {
            clientX: screenX,
            clientY: screenY,
            bubbles: true,
            cancelable: true,
            view: window
        });
        canvas.dispatchEvent(ev);
    }

    // Compute simple escape vector: find nearest other and move away from it.
    function computeEscapeTarget(player, others) {
        if (!player) return null;
        // if no others, do nothing (center)
        if (!others || others.length === 0) return null;

        // find nearest other
        let nearest = null;
        let nearestDist = Infinity;
        for (let i = 0; i < others.length; i++) {
            const o = others[i];
            const dx = o.x - player.x;
            const dy = o.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy) - (o.r || 0) - (player.r || 0);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = o;
            }
        }

        // if nearest is far enough, do nothing
        if (nearestDist > SAFE_DISTANCE) return null;

        // compute vector away from nearest, scaled by TURN_SENSITIVITY and some margin
        const dx = player.x - nearest.x;
        const dy = player.y - nearest.y;
        const mag = Math.sqrt(dx*dx + dy*dy) || 1;
        const nx = dx / mag;
        const ny = dy / mag;

        // target point a bit away from player in world coords
        const targetDistance = SAFE_DISTANCE * 0.75;
        const tx = player.x + nx * targetDistance;
        const ty = player.y + ny * targetDistance;
        return {x: tx, y: ty, reason: 'away-from-nearest', nearestDist};
    }

    // Debug overlay
    function ensureOverlay() {
        if (overlay) return overlay;
        overlay = document.createElement('canvas');
        overlay.style.position = 'absolute';
        overlay.style.left = '0'; overlay.style.top = '0';
        overlay.style.pointerEvents = 'none';
        overlay.width = window.innerWidth;
        overlay.height = window.innerHeight;
        overlay.style.zIndex = 999999;
        document.body.appendChild(overlay);
        return overlay;
    }

    function drawDebug(player, others, target) {
        if (!DEBUG) return;
        const ov = ensureOverlay();
        const ctx = ov.getContext('2d');
        ctx.clearRect(0,0,ov.width,ov.height);
        if (player) {
            const p = worldToCanvas(player.x, player.y);
            ctx.beginPath(); ctx.arc(p.cx, p.cy, 8, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,200,0,0.7)'; ctx.fill();
        }
        others.forEach(o => {
            const q = worldToCanvas(o.x, o.y);
            ctx.beginPath(); ctx.arc(q.cx, q.cy, 6, 0, Math.PI*2); ctx.fillStyle = 'rgba(200,0,0,0.6)'; ctx.fill();
        });
        if (target) {
            const t = worldToCanvas(target.x, target.y);
            ctx.beginPath(); ctx.arc(t.cx, t.cy, 10, 0, Math.PI*2); ctx.strokeStyle = 'rgba(0,0,200,0.9)'; ctx.stroke();
        }
    }

    // Main loop
    function mainLoop() {
        const g = getGameObjects();
        if (!g.player) {
            if (DEBUG) console.log('Bot: player not found');
            return; // can't drive without player position
        }
        const target = computeEscapeTarget(g.player, g.others);
        if (DEBUG) drawDebug(g.player, g.others, target);

        if (!target) return; // no immediate danger

        // map world target to canvas screen coords and send mousemove
        const sc = worldToCanvas(target.x, target.y);
        sendMouseMove(sc.cx, sc.cy);
    }

    // Setup
    function startBot() {
        canvas = findCanvas();
        if (!canvas) {
            console.error('Slither bot: game canvas not found. Script cannot run.');
            return;
        }
        console.log('Slither bot: starting loop every', LOOP_MS, 'ms. DEBUG=', DEBUG);
        setInterval(mainLoop, LOOP_MS);
    }

    // Wait for the page to load the game canvas
    const tryStart = setInterval(() => {
        const c = findCanvas();
        if (c) {
            clearInterval(tryStart);
            startBot();
        }
    }, 500);

    // Expose simple toggle on window for convenience
    window.__slither_defensive_bot = {
        start: startBot,
        config: {LOOP_MS, SAFE_DISTANCE, TURN_SENSITIVITY, DEBUG}
    };

})();
