// ==UserScript==
// @name         Bloxd.io Crosshair Menu (Upload + Enable/Disable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press ` to open crosshair menu. Upload custom crosshair or disable it.
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561082/Bloxdio%20Crosshair%20Menu%20%28Upload%20%2B%20EnableDisable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561082/Bloxdio%20Crosshair%20Menu%20%28Upload%20%2B%20EnableDisable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // CROSSHAIR OVERLAY (centered)
    // ============================================================
    let crosshairEnabled = false;
    let crosshairURL = null;

    const crosshairImg = document.createElement('img');
    Object.assign(crosshairImg.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40px',
        height: '40px',
        pointerEvents: 'none',
        zIndex: '999999',
        display: 'none'
    });
    document.body.appendChild(crosshairImg);

    function enableCrosshair() {
        if (!crosshairURL) {
            alert("Upload a crosshair first!");
            return;
        }
        crosshairImg.src = crosshairURL;
        crosshairImg.style.display = 'block';
        crosshairEnabled = true;
    }

    function disableCrosshair() {
        crosshairImg.style.display = 'none';
        crosshairEnabled = false;
    }

    // ============================================================
    // MENU UI (press `)
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
        <b>Custom Crosshair</b><br><br>
        <input type="file" id="crosshairUpload" accept="image/*"><br><br>
        <button id="enableBtn" style="width:100%;margin-bottom:6px;">Enable Crosshair</button>
        <button id="disableBtn" style="width:100%;">Disable Crosshair</button>
    `;

    document.body.appendChild(menu);

    // Upload handler
    menu.querySelector("#crosshairUpload").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            crosshairURL = reader.result;
            alert("Crosshair uploaded!");
        };
        reader.readAsDataURL(file);
    });

    // Buttons
    menu.querySelector("#enableBtn").onclick = enableCrosshair;
    menu.querySelector("#disableBtn").onclick = disableCrosshair;

    // Toggle menu with `
    window.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    });
})();
