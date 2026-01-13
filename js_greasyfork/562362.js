// ==UserScript==
// @name         ChatGPT Performance Helper (Safari)
// @namespace    https://greasyfork.org/users/sethi
// @version      1.1
// @description  Safari-optimized ChatGPT helper with Fast modes, hover settings, circular mode selector, auto-scroll control, and live memory indicator. Client-side only.
// @author       Sethi
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @license      Open (free to use, modify, share)
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562362/ChatGPT%20Performance%20Helper%20%28Safari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562362/ChatGPT%20Performance%20Helper%20%28Safari%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------------- CONFIG ---------------- */
    const config = {
        enabled: true,
        mode: 'fast',        // normal | fast | fast+
        autoScroll: true,
        showMemory: true,
        webkitOnly: true
    };

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (config.webkitOnly && !isSafari) return;

    /* ---------------- TOGGLE BUTTON ---------------- */
    const toggle = document.createElement('div');
    toggle.textContent = '⚡';

    Object.assign(toggle.style, {
        position: 'fixed',
        bottom: '90px',
        right: '18px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#1db954',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '999999',
        fontSize: '18px',
        userSelect: 'none'
    });

    /* ---------------- HOVER SETTINGS PANEL ---------------- */
    const panel = document.createElement('div');
    panel.innerHTML = `
        <div style="font-weight:600;margin-bottom:8px">Mode</div>
        <div id="modes" style="display:flex;gap:8px;margin-bottom:10px">
            <div data-mode="normal" class="modeDot">N</div>
            <div data-mode="fast" class="modeDot">F</div>
            <div data-mode="fast+" class="modeDot">F+</div>
        </div>
        <label class="opt"><input type="checkbox" id="autoScroll"> Auto-scroll</label>
        <label class="opt"><input type="checkbox" id="memory"> Memory indicator</label>
        <label class="opt"><input type="checkbox" id="enabled"> Enabled</label>
    `;

    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '145px',
        right: '18px',
        background: '#1e1e1e',
        color: '#fff',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '12px',
        display: 'none',
        zIndex: '999999',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)'
    });

    /* ---------------- STYLES ---------------- */
    const style = document.createElement('style');
    style.textContent = `
        .modeDot {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #333;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            font-size:11px;
            user-select:none;
        }
        .modeDot.active {
            background:#1db954;
        }
        .opt {
            display:block;
            margin-bottom:6px;
            cursor:pointer;
        }
    `;
    document.head.appendChild(style);

    /* ---------------- DOM READY ---------------- */
    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(toggle);
        document.body.appendChild(panel);

        panel.querySelector('#autoScroll').checked = config.autoScroll;
        panel.querySelector('#memory').checked = config.showMemory;
        panel.querySelector('#enabled').checked = config.enabled;

        updateModeUI();
    });

    /* ---------------- TOGGLE EVENTS ---------------- */
    toggle.addEventListener('mouseenter', () => panel.style.display = 'block');
    panel.addEventListener('mouseleave', () => panel.style.display = 'none');

    toggle.addEventListener('click', () => {
        config.enabled = !config.enabled;
        panel.querySelector('#enabled').checked = config.enabled;
        toggle.style.background = config.enabled ? '#1db954' : '#555';
    });

    /* ---------------- PANEL CONTROLS ---------------- */
    panel.addEventListener('change', () => {
        config.autoScroll = panel.querySelector('#autoScroll').checked;
        config.showMemory = panel.querySelector('#memory').checked;
        config.enabled = panel.querySelector('#enabled').checked;

        toggle.style.background = config.enabled ? '#1db954' : '#555';

        if (window.__memoryIndicator) {
            window.__memoryIndicator.style.display =
                config.showMemory ? 'block' : 'none';
        }
    });

    panel.querySelectorAll('.modeDot').forEach(dot => {
        dot.addEventListener('click', () => {
            config.mode = dot.dataset.mode;
            updateModeUI();
        });
    });

    function updateModeUI() {
        panel.querySelectorAll('.modeDot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.mode === config.mode);
        });
    }

    /* ---------------- AUTO SCROLL ---------------- */
    function scrollBottom() {
        if (!config.enabled || !config.autoScroll) return;
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    /* ---------------- FAST / FAST+ OBSERVER ---------------- */
    const observer = new MutationObserver(() => {
        if (!config.enabled) return;
        if (config.mode !== 'normal') scrollBottom();
    });

    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });

    /* ---------------- MEMORY INDICATOR ---------------- */
    (function initMemory() {
        const mem = document.createElement('div');
        mem.textContent = '🧠 Memory: Low';

        Object.assign(mem.style, {
            position: 'fixed',
            bottom: '90px',
            right: '70px',
            background: 'rgba(20,20,20,0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '12px',
            cursor: 'move',
            userSelect: 'none',
            zIndex: '999999'
        });

        window.__memoryIndicator = mem;

        document.addEventListener('DOMContentLoaded', () => {
            if (!config.showMemory) mem.style.display = 'none';
            document.body.appendChild(mem);
        });

        let drag = false, ox = 0, oy = 0;
        mem.onmousedown = e => { drag = true; ox = e.clientX - mem.offsetLeft; oy = e.clientY - mem.offsetTop; };
        document.onmousemove = e => { if (drag) { mem.style.left = (e.clientX - ox) + 'px'; mem.style.top = (e.clientY - oy) + 'px'; mem.style.right = 'auto'; mem.style.bottom = 'auto'; }};
        document.onmouseup = () => drag = false;

        setInterval(() => {
            if (!config.showMemory) return;
            const n = document.getElementsByTagName('*').length;
            let lvl = 'Low', bg = '#1e1e1e';
            if (n > 3500) { lvl = 'Medium'; bg = '#b58900'; }
            if (n > 5500) { lvl = 'High'; bg = '#dc322f'; }
            mem.textContent = '🧠 Memory: ' + lvl;
            mem.style.background = bg;
        }, 2000);
    })();

    console.log('ChatGPT Performance Helper v1.1 loaded');
})();
