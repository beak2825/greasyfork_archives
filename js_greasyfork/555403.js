// ==UserScript==
// @name         Anti-ban Autohit 🎯 + Real Self Hitbox
// @version      1.3
// @description  Autohit + real tracked hitbox for YOUR player only (toggle H)
// @author       anshu bihari
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1536224
// @downloadURL https://update.greasyfork.org/scripts/555403/Anti-ban%20Autohit%20%F0%9F%8E%AF%20%2B%20Real%20Self%20Hitbox.user.js
// @updateURL https://update.greasyfork.org/scripts/555403/Anti-ban%20Autohit%20%F0%9F%8E%AF%20%2B%20Real%20Self%20Hitbox.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ---------- config ----------
    const Height = {'grimReaper':150, 'pumpkinGhost':150, 'ghostlyReaper':150}; // fallback heights
    const ReaperList = new Set(['grimReaper', 'pumpkinGhost', 'ghostlyReaper']);

    // Display and control
    let SHOW_SELF_HITBOX = true; // default visible
    const SHOW_SELF_LABEL = 'HITBOX'; // label for button

    // ---------- overlay ----------
    let overlayCanvas = null;
    let overlayCtx = null;
    function createOverlay() {
        if (overlayCanvas) return;
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'evoworld-hitbox-overlay';
        overlayCanvas.style.position = 'fixed';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.width = '100%';
        overlayCanvas.style.height = '100%';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.zIndex = 9998;
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
        document.body.appendChild(overlayCanvas);
        overlayCtx = overlayCanvas.getContext('2d');

        window.addEventListener('resize', () => {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        });
    }

    // ---------- small toggle button for hitbox ----------

    const hbButton = document.createElement('div');
    hbButton.id = 'hitbox-toggle';
    hbButton.style.position = 'fixed';
    hbButton.style.top = '410px';
    hbButton.style.right = '20px';
    hbButton.style.backgroundColor = '#2196F3';
    hbButton.style.color = 'white';
    hbButton.style.padding = '8px 12px';
    hbButton.style.zIndex = 10000;
    hbButton.style.cursor = 'pointer';
    hbButton.style.borderRadius = '10px';
    hbButton.style.fontFamily = 'Arial, sans-serif';
    hbButton.style.fontSize = '12px';
    hbButton.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
    hbButton.innerText = `${SHOW_SELF_LABEL}: ${SHOW_SELF_HITBOX ? 'ON' : 'OFF'}`;
    document.body.appendChild(hbButton);
    hbButton.addEventListener('click', () => {
        SHOW_SELF_HITBOX = !SHOW_SELF_HITBOX;
        hbButton.innerText = `${SHOW_SELF_LABEL}: ${SHOW_SELF_HITBOX ? 'ON' : 'OFF'}`;
        if (SHOW_SELF_HITBOX) startOverlayLoop(); else stopOverlayLoop();
    });

    // also toggle with 'H' key
    document.addEventListener('keydown', (e) => {
        if (e.key && e.key.toLowerCase() === 'h') {
            SHOW_SELF_HITBOX = !SHOW_SELF_HITBOX;
            hbButton.innerText = `${SHOW_SELF_LABEL}: ${SHOW_SELF_HITBOX ? 'ON' : 'OFF'}`;
            if (SHOW_SELF_HITBOX) startOverlayLoop(); else stopOverlayLoop();
            console.log('Self hitbox toggled:', SHOW_SELF_HITBOX);
        }
    });

    // ---------- world -> screen helper (supports camera if available) ----------
    function worldToScreen(pos) {
        try {
            if (!overlayCanvas) createOverlay();

            // Prefer any game-provided camera transform
            if (typeof game !== 'undefined') {
                if (game.camera && typeof game.camera.toScreen === 'function') {
                    const p = game.camera.toScreen(pos);
                    return { x: Math.round(p.x), y: Math.round(p.y) };
                }
                if (game.camera && typeof game.camera.x === 'number' && typeof game.camera.y === 'number') {
                    const zoom = (typeof game.camera.zoom === 'number') ? game.camera.zoom : ((typeof game.camera.scale === 'number') ? game.camera.scale : 1);
                    const screenX = (pos.x - game.camera.x) * zoom + overlayCanvas.width / 2;
                    const screenY = (pos.y - game.camera.y) * zoom + overlayCanvas.height / 2;
                    return { x: Math.round(screenX), y: Math.round(screenY) };
                }
            }

            // fallback: center on player if available
            if (game && game.me && game.me.position) {
                const cx = overlayCanvas.width / 2;
                const cy = overlayCanvas.height / 2;
                const dx = pos.x - game.me.position.x;
                const dy = pos.y - game.me.position.y;
                const zoom = (game && game.renderer && typeof game.renderer.scale === 'number') ? game.renderer.scale : 1;
                return { x: Math.round(cx + dx * zoom), y: Math.round(cy + dy * zoom) };
            }

            // last fallback: raw coords
            return { x: Math.round(pos.x), y: Math.round(pos.y) };
        } catch (e) {
            return { x: pos.x, y: pos.y };
        }
    }

    // ---------- get real box size for an entity (world-space) ----------
    function getEntityBoxSize(ent) {
        if (!ent) return { w: 40, h: 80 };
        if (typeof ent.hitboxWidth === 'number' && typeof ent.hitboxHeight === 'number') {
            return { w: ent.hitboxWidth, h: ent.hitboxHeight };
        }
        if (typeof ent.width === 'number' && typeof ent.height === 'number') {
            return { w: ent.width, h: ent.height };
        }
        if (ent.size && typeof ent.size.x === 'number' && typeof ent.size.y === 'number') {
            return { w: ent.size.x, h: ent.size.y };
        }
        if (ent.name && Height[ent.name]) {
            const h = Height[ent.name];
            return { w: Math.max(30, h * 0.6), h: h };
        }
        return { w: 40, h: 80 };
    }

    // ---------- draw only YOUR hitbox ----------
    function drawMyHitbox() {
        if (!overlayCtx || !game || !game.me || !game.me.position) return;
        if (!SHOW_SELF_HITBOX) return;

        const me = game.me;
        const screen = worldToScreen(me.position);
        const size = getEntityBoxSize(me);

        // try to get scale from camera/renderer to draw correct pixel size
        let scale = 1;
        try {
            if (game && game.camera && typeof game.camera.zoom === 'number') scale = game.camera.zoom;
            else if (game && game.renderer && typeof game.renderer.scale === 'number') scale = game.renderer.scale;
        } catch (e) { scale = 1; }

        const w = size.w * scale;
        const h = size.h * scale;
        const x = screen.x - w / 2;
        const y = screen.y - h / 2;

        overlayCtx.beginPath();
        overlayCtx.rect(x, y, w, h);
        overlayCtx.fillStyle = 'rgba(255,0,0,0.14)';
        overlayCtx.fill();
        overlayCtx.lineWidth = Math.max(1, 2 * scale);
        overlayCtx.strokeStyle = 'rgba(255,0,0,0.95)';
        overlayCtx.stroke();

        // label
        overlayCtx.font = `${12 * Math.max(1, scale)}px Arial`;
        overlayCtx.fillStyle = 'rgba(255,0,0,0.95)';
        overlayCtx.textAlign = 'center';
        overlayCtx.fillText('YOU', screen.x, y - 6 * scale);
    }

    // ---------- draw loop only for self hitbox ----------
    function drawAllHitboxes() {
        if (!overlayCtx) return;
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        drawMyHitbox();
    }

    let overlayRAF = null;
    function startOverlayLoop() {
        if (!overlayCanvas) createOverlay();
        if (overlayRAF) return;
        function loop() {
            try { drawAllHitboxes(); } catch (e) {}
            overlayRAF = requestAnimationFrame(loop);
        }
        loop();
    }
    function stopOverlayLoop() {
        if (overlayRAF) cancelAnimationFrame(overlayRAF);
        overlayRAF = null;
        if (overlayCtx && overlayCanvas) {
            overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
    }

    // ---------- HIT DETECTION: use entity box extents for real overlap ----------
    function getHalfExtents(ent) {
        const s = getEntityBoxSize(ent);
        return { halfW: s.w / 2, halfH: s.h / 2 };
    }

    // Updated X-range check: we compare box edges rather than center-to-center only.
    function isWithinXRange(attacker, target, rangeTable, distAdjustment = 0) {
        if (!attacker || !target) return false;
        const aX = attacker.position.x;
        const bX = target.position.x;

        const aHalf = getHalfExtents(attacker).halfW;
        const bHalf = getHalfExtents(target).halfW;

        var relativeSpeed = Math.abs((attacker.moveSpeed && attacker.moveSpeed.x) ? attacker.moveSpeed.x : 0 - ((target.moveSpeed && target.moveSpeed.x) ? target.moveSpeed.x : 0));
        const frameTime = (typeof lastFps === 'number' && lastFps > 0) ? (1000 / lastFps) : 16;
        const serverDelay = (typeof latency === 'number') ? latency : 0;
        const totalDelay = frameTime + serverDelay;

        // distance between box edges along X (0 or negative means overlap)
        var centerDist = Math.abs(bX - aX);
        var edgeGap = centerDist - (aHalf + bHalf);
        var effectiveDist = edgeGap - totalDelay * relativeSpeed / 1000 + distAdjustment;

        // fallback to name-based range if table exists
        let allowedRange = 0;
        try {
            if (rangeTable && attacker.name && target.name && rangeTable[attacker.name] && typeof rangeTable[attacker.name][target.name] !== 'undefined') {
                allowedRange = rangeTable[attacker.name][target.name];
            }
        } catch (e) { allowedRange = 0; }

        return effectiveDist <= allowedRange;
    }

    // Updated Y-range check: use box extents vertically
    function isWithinYRange(attacker, target, heights, distAdjustment = 0) {
        if (!attacker || !target) return false;
        const aY = attacker.position.y;
        const bY = target.position.y;

        const aHalf = getHalfExtents(attacker).halfH;
        const bHalf = getHalfExtents(target).halfH;

        var relativeSpeed = Math.abs((attacker.moveSpeed && attacker.moveSpeed.y) ? attacker.moveSpeed.y : 0 - ((target.moveSpeed && target.moveSpeed.y) ? target.moveSpeed.y : 0));
        const frameTime = (typeof lastFps === 'number' && lastFps > 0) ? (1000 / lastFps) : 16;
        const serverDelay = (typeof latency === 'number') ? latency : 0;
        const totalDelay = frameTime + serverDelay;

        var centerDist = Math.abs(bY - aY);
        var edgeGap = centerDist - (aHalf + bHalf);
        var effectiveDist = edgeGap - totalDelay * relativeSpeed / 1000 + distAdjustment;

        // heights table fallback
        let allowedRangeY = 0;
        try {
            if (heights && attacker.name && target.name) {
                allowedRangeY = heights[target.name] || heights[attacker.name] || 0;
            }
        } catch (e) { allowedRangeY = 0; }

        return effectiveDist <= allowedRangeY;
    }

    // ---------- preserved autohit logic (calls new isWithinXRange/YRange) ----------
    // NOTE: uses HitRangeX, HitBackRangeX, Height from your previous code. Keep them defined above to match old behavior.
    const HitRangeX = {'grimReaper':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140},
                      'pumpkinGhost':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140},
                      'ghostlyReaper':{'grimReaper':140, 'pumpkinGhost':140, 'ghostlyReaper':140}
    };
    const HitBackRangeX = {'grimReaper':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141},
                          'pumpkinGhost':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141},
                          'ghostlyReaper':{'grimReaper':141, 'pumpkinGhost':141, 'ghostlyReaper':141}
    };

    function simulateQuickRightArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            which: 39,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 35);
    }

    function simulateQuickLeftArrowKeyWithDelay() {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
            keyCode: 37,
            which: 37,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyDownEvent);

        setTimeout(() => {
            const keyUpEvent = new KeyboardEvent('keyup', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyUpEvent);
        }, 35);
    }

    function getMagnitude(objPos) {
        var myPos = game.me.position;
        var xDifference = Math.abs(myPos.x - objPos.x);
        var yDifference = Math.abs(myPos.y - objPos.y);
        return xDifference + yDifference;
    }

    function getClosestReaper() {
        if (gameServer == 'undefined' || game.me == 'undefined' || imDead || !joinedGame) {
            return;
        }

        let list = game.sortToDraw(game.hashMap.retrieveVisibleByClient(game));
        let reaperInVision = [];
        for(let i=0; i < list.length; i++) {
            var curEntity = list[i];
            if (curEntity.hp != null && curEntity.deleted == false) {
                if (curEntity.level != null) {
                    if (!ReaperList.has(curEntity.name)) continue;
                    if (curEntity == game.me) { continue;
                    }

                    reaperInVision.push(curEntity);
                }
            }
        }

        var closestReaper = 'undefined';
        var closestMagn = 'undefined';
        for(var i = 0; i < reaperInVision.length; i++) {
            var curEntry = reaperInVision[i];
            if (closestReaper === 'undefined') {
                closestReaper = curEntry;
                closestMagn = getMagnitude(curEntry.position);
            } else {
                var checkingMagn = getMagnitude(curEntry.position);
                if (checkingMagn < closestMagn) {
                    closestReaper = curEntry;
                    closestMagn = checkingMagn;
                }
            }
        }
        return closestReaper;
    };

    function autoHit(){
        let enemy=getClosestReaper();
        if (typeof enemy != 'object' || typeof game.me != 'object' || !ReaperList.has(game.me.name)){
            return;
        }

        let onLeftSide = (game.me.position.x<=enemy.position.x);
        let enemyFlicking = (onLeftSide && enemy.direction===1) || (!onLeftSide && enemy.direction===-1);
        let facingEnemy = (onLeftSide && game.me.direction===1) || (!onLeftSide && game.me.direction===-1);

        if (!flicking){
            facingEnemy=true;
        }

        if (facingEnemy){
            if (enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitBackRangeX) && isWithinYRange(game.me, enemy, Height)){
                    skillUse();
                    setTimeout(skillStop,100);
                }
            } else if (!enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitRangeX) && isWithinYRange(game.me, enemy, Height)){
                    skillUse();
                    setTimeout(skillStop,100);
                }
            }
        } else if (!facingEnemy){
            if (enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitBackRangeX, -25) && isWithinYRange(game.me, enemy, Height)){
                    if (onLeftSide){
                        simulateQuickRightArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    } else if (!onLeftSide){
                        simulateQuickLeftArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    }
                }
            } else if (!enemyFlicking){
                if (isWithinXRange(game.me, enemy, HitRangeX ,-5) && isWithinYRange(game.me, enemy, Height)){
                    if (onLeftSide){
                        simulateQuickRightArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    } else if (!onLeftSide){
                        simulateQuickLeftArrowKeyWithDelay();
                        skillUse();
                        setTimeout(skillStop,100);
                    }
                }
            }
        }
    }

    // ---------- UI toggle for autohit (existing) ----------
    let autoHitting = false;
    let flicking = false;
    const button = document.createElement("div");
    button.id = "autohit-toggle";
    button.style.position = "fixed";
    button.style.top = "450px";
    button.style.right = "20px";
    button.style.backgroundColor = "#f44336";
    button.style.color = "white";
    button.style.padding = "15px 25px";
    button.style.zIndex = 9999;
    button.style.cursor = "pointer";
    button.style.borderRadius = "15px";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontWeight = "bold";
    button.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    button.innerHTML = `<div style="text-align:center;">AUTOHIT: OFF<br><span style="font-weight:normal;">Made by ANSHU BIHARI</span></div>`;
    document.body.appendChild(button);
    button.addEventListener("click", () => {
        autoHitting = !autoHitting;
        flicking = autoHitting;
        button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
        button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
        console.log('Autohitting:', autoHitting, 'Flicking:', flicking);
        if (autoHitting) startOverlayLoop();
        else if (!SHOW_SELF_HITBOX) stopOverlayLoop();
    });

    document.addEventListener("keyup", (event) => {
        if (event.keyCode === 73) {
            let closest = getClosestReaper();
            if (closest) {
                console.log(game.me.position.x-getClosestReaper().position.x);
                console.log(game.me.position.y-getClosestReaper().position.y);
            }
        } else if (event.keyCode === 32) {
            console.log('time to start/stop');
            skillStop();
        } else if (event.keyCode === 40) {
            autoHitting = !autoHitting;
            flicking = autoHitting;
            button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
            button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
            console.log('Toggled Autohitting by Arrow Down:', autoHitting);
            if (button.style.display === "none") button.style.display = "block";
            if (autoHitting) startOverlayLoop();
            else if (!SHOW_SELF_HITBOX) stopOverlayLoop();
        } else if (event.keyCode === 82) {
            autoHitting = !autoHitting;
            flicking = autoHitting;
            button.style.backgroundColor = autoHitting ? "#4CAF50" : "#f44336";
            button.innerHTML = `<div style="text-align:center;">AUTOHIT: ${autoHitting ? "ON" : "OFF"}<br><span style="font-weight:normal;">Made by Business</span></div>`;
            console.log('Toggled Autohitting by R:', autoHitting);
            if (button.style.display === "none") button.style.display = "block";
            if (autoHitting) startOverlayLoop();
            else if (!SHOW_SELF_HITBOX) stopOverlayLoop();
        }
    });

    // ---------- init and server hooks ----------
    try {
        console.log("Trying to make whole script work!!");
    } catch (bananamelon) {
        console.error("Trying to make whole script work!!");
    }

    function initialize() {
        createOverlay();
        if (SHOW_SELF_HITBOX || autoHitting) startOverlayLoop();

        gameServer['on']('disconnect', function() {
            gameServer = undefined;
            WaitForGameServer();
        });

        if (typeof gameServer.on === 'function') {
            gameServer['on'](socketMsgType.SYNC, function(data) {
                if (autoHitting) autoHit();
                try { if (SHOW_SELF_HITBOX) drawAllHitboxes(); } catch (e) {}
            });
        } else {
            console.error('gameServerOn is not a function');
        }
    };

    function WaitForGameServer() {
        if (typeof gameServer === 'undefined' || typeof gameServer['on'] === 'undefined') {
            setTimeout(WaitForGameServer, 1000);
        } else {
            initialize();
        }
    }

    WaitForGameServer();
})();
