// ==UserScript==
// @name         Custom Cursors!!!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press ` to open cursor menu. Upload custom cursor or disable it. R/F pulse crosshair.
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561079/Custom%20Cursors%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/561079/Custom%20Cursors%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // CROSSHAIR PULSE (R/F)
    // ============================================================
    const BASE_SIZE = 20;
    const PULSE_SIZE = 45;
    const PULSE_SPEED = 90;
    const SHRINK_SPEED = 90;

    const crosshair = document.createElement('div');
    Object.assign(crosshair.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: BASE_SIZE + 'px',
        height: BASE_SIZE + 'px',
        pointerEvents: 'none',
        zIndex: '999999',
        borderLeft: '2px solid white',
        borderTop: '2px solid white',
        borderRight: '2px solid white',
        borderBottom: '2px solid white',
        filter: 'drop-shadow(0 0 2px black)',
        transition: `width ${PULSE_SPEED}ms ease, height ${PULSE_SPEED}ms ease`
    });
    document.body.appendChild(crosshair);

    let pulsing = false;

    function pulse() {
        if (pulsing) return;
        pulsing = true;

        crosshair.style.width = PULSE_SIZE + 'px';
        crosshair.style.height = PULSE_SIZE + 'px';

        setTimeout(() => {
            crosshair.style.width = BASE_SIZE + 'px';
            crosshair.style.height = BASE_SIZE + 'px';

            setTimeout(() => {
                pulsing = false;
            }, SHRINK_SPEED);

        }, PULSE_SPEED);
    }

    window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'r' || k === 'f') pulse();
    });

    // ============================================================
    // CUSTOM CURSOR OVERLAY
    // ============================================================
    let cursorEnabled = false;
    let cursorURL = null;

    const cursorOverlay = document.createElement('img');
    Object.assign(cursorOverlay.style, {
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '32px',
        height: '32px',
        pointerEvents: 'none',
        zIndex: '999998',
        display: 'none'
    });
    document.body.appendChild(cursorOverlay);

    window.addEventListener('mousemove', (e) => {
        if (!cursorEnabled) return;
        cursorOverlay.style.left = e.clientX + 'px';
        cursorOverlay.style.top = e.clientY + 'px';
    });

    function enableCursor() {
        if (!cursorURL) return;
        cursorOverlay.src = cursorURL;
        cursorOverlay.style.display = 'block';
        document.body.style.cursor = 'none';
        cursorEnabled = true;
    }

    function disableCursor() {
        cursorOverlay.style.display = 'none';
        document.body.style.cursor = 'default';
        cursorEnabled = false;
    }

    // ============================================================
    // MENU UI (press ` to toggle)
    // ============================================================
    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        left: '20px',
        top: '20px',
        width: '220px',
        padding: '12px',
        background: 'rgba(20,20,20,0.85)',
        backdropFilter: 'blur(6px)',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Arial',
        fontSize: '14px',
        zIndex: '999999',
        display: 'none',
        border: '1px solid rgba(255,255,255,0.15)'
    });

    menu.innerHTML = `
        <b>Custom Cursor</b><br><br>
        <input type="file" id="cursorUpload" accept="image/*"><br><br>
        <button id="enableBtn" style="width:100%;margin-bottom:6px;">Enable Cursor</button>
        <button id="disableBtn" style="width:100%;">Disable Cursor</button>
    `;

    document.body.appendChild(menu);

    // Upload handler
    menu.querySelector("#cursorUpload").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            cursorURL = reader.result;
            alert("Cursor uploaded!");
        };
        reader.readAsDataURL(file);
    });

    // Buttons
    menu.querySelector("#enableBtn").onclick = enableCursor;
    menu.querySelector("#disableBtn").onclick = disableCursor;

    // Toggle menu with `
    window.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });
})();
