// ==UserScript==
// @name         ShellShockers Aim Assist V1
// @namespace    https://aimassistv1.local
// @version      1.0
// @description  Soft aim assist mod with rainbow menu for Shell Shockers
// @author       CoffeeGamer2025/Anonymous
// @match        https://shellshock.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559734/ShellShockers%20Aim%20Assist%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/559734/ShellShockers%20Aim%20Assist%20V1.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let menuOpen = false;
    let aimEnabled = false;

    /* ================= MENU ================= */

    const menu = document.createElement('div');
    menu.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 260px;
        padding: 15px;
        font-family: Arial, sans-serif;
        color: white;
        border-radius: 12px;
        display: none;
        z-index: 99999;
        background: linear-gradient(
            45deg,
            red, orange, yellow, green, cyan, blue, purple, red
        );
        background-size: 400% 400%;
        animation: rainbowBG 6s linear infinite;
        box-shadow: 0 0 25px rgba(0,0,0,0.6);
    `;

    menu.innerHTML = `
        <h2 style="text-align:center;margin:0 0 10px 0;">Aim Assist V1</h2>
        <label style="display:flex;align-items:center;gap:8px;font-size:16px;">
            <span>Aim Assist</span>
            <input type="checkbox" id="aimToggle" />
        </label>
    `;

    document.body.appendChild(menu);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbowBG {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
    `;
    document.head.appendChild(style);

    document.getElementById('aimToggle').addEventListener('change', e => {
        aimEnabled = e.target.checked;
    });

    /* ================= KEYBIND ================= */

    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'h') {
            menuOpen = !menuOpen;
            menu.style.display = menuOpen ? 'block' : 'none';
        }
    });

    /* ================= SOFT AIM ================= */

    const AIM_STRENGTH = 0.08; // VERY gentle (increase slightly if needed)

    function getClosestEnemyNameTag() {
        const tags = document.querySelectorAll('.player-name');
        let closest = null;
        let minDist = Infinity;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        tags.forEach(tag => {
            const rect = tag.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const dist = Math.hypot(x - cx, y - cy);
            if (dist < minDist) {
                minDist = dist;
                closest = { x, y };
            }
        });

        return closest;
    }

    function softAimLoop() {
        if (!aimEnabled) return requestAnimationFrame(softAimLoop);

        const target = getClosestEnemyNameTag();
        if (!target) return requestAnimationFrame(softAimLoop);

        const dx = (target.x - window.innerWidth / 2) * AIM_STRENGTH;
        const dy = (target.y - window.innerHeight / 2) * AIM_STRENGTH;

        document.dispatchEvent(new MouseEvent('mousemove', {
            movementX: dx,
            movementY: dy
        }));

        requestAnimationFrame(softAimLoop);
    }

    softAimLoop();
})();
