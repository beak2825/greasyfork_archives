// ==UserScript==
// @name         Deadshot.io AimAssist + Stats + Controls + Keylogger UI Plug n' Play
// @namespace    http://tampermonkey.net/
// @version      1.0(Beta)
// @description  Toggle aim assist with M key and UI buttons; overlay with crosshair and stats for deadshot.io
// @match        https://deadshot.io/*
// @grant        none
// @author       If4z_
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/552180/Deadshotio%20AimAssist%20%2B%20Stats%20%2B%20Controls%20%2B%20Keylogger%20UI%20Plug%20n%27%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/552180/Deadshotio%20AimAssist%20%2B%20Stats%20%2B%20Controls%20%2B%20Keylogger%20UI%20Plug%20n%27%20Play.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** === Overlay & Crosshair === ***/
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        background: 'transparent',
        zIndex: 999999
    });
    document.body.appendChild(overlay);

    const crosshair = document.createElement('div');
    Object.assign(crosshair.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '8px',
        height: '8px',
        background: 'limegreen',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.9
    });
    overlay.appendChild(crosshair);

    /*** === AIMBOT TOGGLE BUTTON === ***/
    const aimBtn = document.createElement('button');
    aimBtn.innerText = 'Aimbot: OFF';
    Object.assign(aimBtn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000001,
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '6px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        border: '2px solid white',
        cursor: 'pointer'
    });
    document.body.appendChild(aimBtn);

    /*** === INTERFACE TOGGLE BUTTON === ***/
    const ifaceBtn = document.createElement('button');
    ifaceBtn.innerText = 'Interface: ON';
    Object.assign(ifaceBtn.style, {
        position: 'fixed',
        top: '50px',
        right: '10px',
        zIndex: 1000001,
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '6px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        border: '2px solid white',
        cursor: 'pointer'
    });
    document.body.appendChild(ifaceBtn);

    let aimbotEnabled = false;
    let interfaceOn = true;

    aimBtn.addEventListener('click', () => {
        aimbotEnabled = !aimbotEnabled;
        aimBtn.innerText = 'Aimbot: ' + (aimbotEnabled ? 'ON' : 'OFF');
        aimBtn.style.borderColor = aimbotEnabled ? 'limegreen' : 'white';
        aimBtn.style.color = aimbotEnabled ? 'limegreen' : 'white';
    });

    ifaceBtn.addEventListener('click', () => {
        interfaceOn = !interfaceOn;
        overlay.style.display = interfaceOn ? 'block' : 'none';
        aimBtn.style.display = interfaceOn ? 'block' : 'none';
        ifaceBtn.innerText = 'Interface: ' + (interfaceOn ? 'ON' : 'OFF');
        ifaceBtn.style.borderColor = interfaceOn ? 'white' : 'gray';
    });

    /*** === STATS UI (Ping + FPS) === **/
    const statsDiv = document.createElement('div');
    Object.assign(statsDiv.style, {
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        background: 'rgba(0,0,0,0.5)',
        padding: '8px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: 'Red',
        zIndex: 1000001,
        maxWidth: '200px'
    });
    overlay.appendChild(statsDiv);

    // Variables for FPS and ping
    let ping = 0;
    let fps = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    function updateFPS() {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = now;
        }
    }

    function updatePing() {
        // Dummy ping, replace with actual game ping if accessible
        ping = Math.floor(Math.random() * 50 + 50);
    }

    function updateStats() {
        statsDiv.innerHTML = `
            <strong>Ping:</strong> ${ping} ms<br>
            <strong>FPS:</strong> ${fps}
        `;
    }

    // Placeholder for game data - replace as needed
    let players = [];
    function getPlayers() { return players; }
    function getMyPlayer() { return window.myPlayer || null; } // adjust as needed

    /*** Main aiming logic ***/
    let currentTarget = null;
    function aimAtClosestEnemy() {
        if (!aimbotEnabled) {
            updateStats();
            return;
        }
        const myPlayer = getMyPlayer();
        if (!myPlayer || !myPlayer.position) {
            updateStats();
            return;
        }

        const enemies = getPlayers().filter(p => p !== myPlayer && p.position);
        if (enemies.length === 0) {
            updateStats();
            return;
        }

        let closestEnemy = null;
        let minDist = Infinity;
        let targetAngle = 0;

        for (const enemy of enemies) {
            const dx = enemy.position.x - myPlayer.position.x;
            const dy = enemy.position.y - myPlayer.position.y;
            const dist = Math.hypot(dx, dy);
            if (dist < minDist) {
                minDist = dist;
                closestEnemy = enemy;
                targetAngle = Math.atan2(dy, dx);
            }
        }

        if (closestEnemy) {
            currentTarget = closestEnemy;
            // Aim directly at the enemy
            if (window.setAimTarget) {
                window.setAimTarget(closestEnemy.position);
            } else if (window.player && typeof window.player.aim === 'number') {
                window.player.aim = targetAngle;
            }
        }
        updateStats();
    }

    // === Keyboard listener for 'M' key to toggle aimbot ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'm' || e.key === 'M') {
            aimbotEnabled = !aimbotEnabled;
            aimBtn.innerText = 'Aimbot: ' + (aimbotEnabled ? 'ON' : 'OFF');
            aimBtn.style.borderColor = aimbotEnabled ? 'limegreen' : 'white';
        }
    });

    // === Main loop ===
    function update() {
        updateFPS();
        updatePing();
        aimAtClosestEnemy();
        updateStats();
        requestAnimationFrame(update);
    }
     /*** === TRANSPARENT OVERLAY === ***/
    const overla = document.createElement('div');
    Object.assign(overla.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        background: 'transparent',
        zIndex: 999999
    });
    document.body.appendChild(overla);


    /*** === KEYLOGGER UI === ***/
    const keyDisplay = document.createElement('div');
    Object.assign(keyDisplay.style, {
        position: 'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        background: 'transparent',
        color: 'limegreen',
        opacity: 0.8,
        zIndex: 1000000
    });
    overla.appendChild(keyDisplay);

    const keys = ['W', 'A', 'S', 'D', 'Space', 'TAB', 'R', 'F', 'Shift'];
    const keyElements = {};
    keys.forEach(key => {
        const el = document.createElement('div');
        el.textContent = key;
        Object.assign(el.style, {
            padding: '2px 4px',
            border: '1px solid limegreen',
            borderRadius: '4px',
            opacity: '0.4'
        });
        keyElements[key] = el;
        keyDisplay.appendChild(el);
    });

    window.addEventListener('keydown', e => {
        const k = formatKey(e.key);
        if (keyElements[k]) keyElements[k].style.opacity = '1';
    });
    window.addEventListener('keyup', e => {
        const k = formatKey(e.key);
        if (keyElements[k]) keyElements[k].style.opacity = '0.4';
    });

    function formatKey(key) {
        const map = {
            ' ': 'Space',
            'Tab': 'TAB',
            'Shift': 'Shift',
            'w': 'W',
            'a': 'A',
            's': 'S',
            'd': 'D',
            'r': 'R',
            'f': 'F'
        };
        return map[key] || key;
    }


    update();

})();