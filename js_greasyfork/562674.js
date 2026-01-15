// ==UserScript==
// @name         Rarity Selector By tuke :3
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Visual interface to select any rare top-bar message
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562674/Rarity%20Selector%20By%20tuke%20%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/562674/Rarity%20Selector%20By%20tuke%20%3A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const msgs = [
        { t: 'You have a 1 in 2 chance of getting this :3', c: 'standard' },
        { t: 'You have a 1 in 4 chance of getting this uwu', c: 'shaky' },
        { t: 'you have a 1 in 8 chance of getting this rawr!~', c: 'fancy' },
        { t: '1 in 16 — lucky you!', c: 'glitch' },
        { t: '1 in 32 — superstar!', c: 'sparkle' },
        { t: '1 in 64 — ULTRA RARE ✨', c: 'ultra' },
        { t: '1 in 128 — LEGENDARY 🌟', c: 'ultra' },
        { t: '1 in 256 — MYTHIC 👑', c: 'ultra' },
        { t: '1 in 512 — COSMIC 🌌', c: 'ultra' },
        { t: '1 in 1K — GODLIKE ⚡', c: 'ultra' },
        { t: '1 in 2K — DIVINE 💫', c: 'ultra' },
        { t: '1 in 4K — ETHEREAL 👻', c: 'ultra' },
        { t: '1 in 8K — CELESTIAL ✨', c: 'ultra' },
        { t: '1 in 16K — OMNIPOTENT 🌀', c: 'ultra' },
        { t: '1 in 32K — TRANSCENDENT 🎆', c: 'ultra' },
        { t: '1 in 65K — INFINITE ∞', c: 'ultra' },
        { t: '1 in 131K — ABSOLUTE 🔥', c: 'ultra' },
        { t: '1 in 262K — SUPREME 👑💎', c: 'ultra' },
        { t: '1 in 524K — UNIMAGINABLE 🌈', c: 'ultra' },
        { t: '1 in 1M — IMPOSSIBLE 🪐✨', c: 'ultra' }
    ];

    function applyMessage(msg) {
        const e = document.getElementById('top-msg');
        if (!e) return;

        e.textContent = msg.t;
        e.className = 'top-msg ' + msg.c;

        if (msg.c === 'ultra') {
            e.style.backgroundImage =
                'linear-gradient(90deg,#ff0080,#ffb3e6,#ff6b35,#9b272b,#648fb4,#00ffcc,#00ff88)';
        } else {
            e.style.backgroundImage = '';
        }

        if (msg.c === 'glitch') {
            e.setAttribute('data-text', msg.t);
        } else {
            e.removeAttribute('data-text');
        }
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'rarity-panel';
        panel.innerHTML = `<strong>🎲 Rarity Picker</strong>`;

        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 260px;
            max-height: 60vh;
            overflow-y: auto;
            background: rgba(20,20,20,0.95);
            color: white;
            font-family: system-ui, sans-serif;
            font-size: 13px;
            border-radius: 12px;
            padding: 10px;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;

        msgs.forEach((msg) => {
            const btn = document.createElement('button');
            btn.textContent = msg.t;
            btn.style.cssText = `
                width: 100%;
                margin-top: 6px;
                padding: 6px 8px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                background: ${msg.c === 'ultra' ? '#3a1c55' : '#2a2a2a'};
                color: white;
            `;

            btn.onmouseenter = () => btn.style.background = '#444';
            btn.onmouseleave = () =>
                btn.style.background = msg.c === 'ultra' ? '#3a1c55' : '#2a2a2a';

            btn.onclick = () => applyMessage(msg);

            panel.appendChild(btn);
        });

        document.body.appendChild(panel);
    }

    // Wait until the page exists
    const wait = setInterval(() => {
        if (document.getElementById('top-msg')) {
            clearInterval(wait);
            createUI();
        }
    }, 300);
})();
