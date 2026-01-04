// ==UserScript==
// @name         BonkBoards Dark Theme Toggle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a dark theme with toggle button for bonkboards.io
// @author       Black Queen
// @match        https://bonkboards.io/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553094/BonkBoards%20Dark%20Theme%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/553094/BonkBoards%20Dark%20Theme%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject toggle button
    const btn = document.createElement('div');
    btn.textContent = '🌙 Dark Mode';
    btn.id = 'bb-dark-toggle';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        padding: '8px 14px',
        background: '#222',
        color: '#fff',
        border: '1px solid #444',
        borderRadius: '10px',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        zIndex: '99999',
        userSelect: 'none',
        boxShadow: '0 0 6px rgba(0,0,0,0.4)',
    });
    document.body.appendChild(btn);

    // Dark theme CSS
    const darkCSS = `
        html, body {
            background-color: #121212 !important;
            color: #ffffff !important;
        }

        div, section, main, footer, header, nav {
            background-color: #121212 !important;
            color: #ffffff !important;
            border-color: #333 !important;
        }

        header, .header, nav, .navbar, .topbar, .MuiAppBar-root {
            background-color: #181818 !important;
            color: #ffffff !important;
            box-shadow: none !important;
        }

        header *, .header *, nav *, .navbar *, .topbar * {
            color: #ffffff !important;
        }

        table, tbody, tr, td, th {
            background-color: #1e1e1e !important;
            color: #ffffff !important;
            border-color: #333 !important;
        }

        tr:hover {
            background-color: #2c2c2c !important;
        }

        a {
            color: #ffffff !important;
            text-decoration: none !important;
        }
        a:hover {
            color: #66b2ff !important;
        }

        button, input, select, textarea {
            background-color: #2a2a2a !important;
            color: #ffffff !important;
            border: 1px solid #444 !important;
        }

        button:hover, input[type="button"]:hover {
            background-color: #3b3b3b !important;
        }

        .card, .container, .content, .MuiPaper-root, .MuiCard-root {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #444;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: #666;
        }
        ::-webkit-scrollbar-track {
            background-color: #1a1a1a;
        }
    `;

    const styleTag = document.createElement('style');
    styleTag.id = 'bb-dark-style';
    styleTag.textContent = darkCSS;

    // Load saved mode from storage
    const darkEnabled = localStorage.getItem('bb_darkmode') === 'true';
    if (darkEnabled) {
        document.head.appendChild(styleTag);
        btn.textContent = '☀️ Light Mode';
    }

    // Toggle handler
    btn.onclick = () => {
        const active = document.getElementById('bb-dark-style');
        if (active) {
            active.remove();
            localStorage.setItem('bb_darkmode', 'false');
            btn.textContent = '🌙 Dark Mode';
        } else {
            document.head.appendChild(styleTag);
            localStorage.setItem('bb_darkmode', 'true');
            btn.textContent = '☀️ Light Mode';
        }
    };

    // Make toggle button draggable (optional)
    let isDragging = false;
    let offsetX, offsetY;
    btn.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - btn.offsetLeft;
        offsetY = e.clientY - btn.offsetTop;
        btn.style.transition = 'none';
    });
    document.addEventListener('mouseup', () => { isDragging = false; btn.style.transition = '0.1s'; });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        btn.style.left = e.clientX - offsetX + 'px';
        btn.style.top = e.clientY - offsetY + 'px';
        btn.style.bottom = 'auto';
        btn.style.right = 'auto';
    });
})();
