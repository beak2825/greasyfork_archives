// ==UserScript==
// @name         TBD Cyberpunk: RGB Night (v1.32 Stable)
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  RGB Cycle + City BG + Glitch Logo + Tactical Cursors + Zebra Rows. Headers boxed, contrast softened. Fixed Modal/Reply Box interactions. Fixed Hover Positioning. Blurry Shoutbox/Exclusives. Fixed Logo/Login Page. Red Sidebar & Rows.
// @author       VoltaX
// @match        https://www.torrentbd.net/*
// @match        https://torrentbd.net/*
// @match        https://www.torrentbd.com/*
// @match        https://torrentbd.com/*
// @match        https://www.torrentbd.org/*
// @match        https://torrentbd.org/*
// @match        https://www.torrentbd.me/*
// @match        https://torrentbd.me/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557081/TBD%20Cyberpunk%3A%20RGB%20Night%20%28v132%20Stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557081/TBD%20Cyberpunk%3A%20RGB%20Night%20%28v132%20Stable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ['gm-panel', 'gm-fab', 'tbd-theme-panel', 'tbd-theme-btn', 'ref-settings', 'ref-modal', 'cp-toggle', 'rgb-control', 'cp-hud', 'cp-rain', 'cp-progress'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Russo+One&family=Oxanium:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const BG_URL = "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=2664&auto=format&fit=crop";
    const COLORS = ['#39ff14', '#fcee0a', '#00f3ff', '#ff003c', '#bc13fe'];

    let currentColorIndex = 0;
    let intervalId = null;
    let isPaused = GM_getValue('rgb_paused', false);

    const CURSOR_MAIN = `url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L13 24L17 15L26 11L2 2Z" fill="%2339ff14" stroke="black" stroke-width="2" stroke-linejoin="round"/><path d="M17 15L26 24" stroke="%2339ff14" stroke-width="2"/></svg>') 2 2, default`;
    const CURSOR_POINTER = `url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="10" stroke="%2339ff14" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="%23FF003C"/><path d="M16 2V8M16 30V24M2 16H8M30 16H24" stroke="%2339ff14" stroke-width="2"/></svg>') 16 16, pointer`;

    if (window.CSS && CSS.registerProperty) {
        try {
            CSS.registerProperty({
                name: '--cp-neon',
                syntax: '<color>',
                inherits: true,
                initialValue: COLORS[0]
            });
            CSS.registerProperty({
                name: '--cp-neon-dim',
                syntax: '<color>',
                inherits: true,
                initialValue: COLORS[0] + '20'
            });
        } catch (e) {}
    }

    function injectCyberLogo() {
        const logoContainer = document.querySelector('#logo a, .brand-logo');
        if (logoContainer) {
            Array.from(logoContainer.childNodes).forEach(child => {
                if (child.nodeType === 1 && !child.classList.contains('cp-logo-container')) {
                    child.style.display = 'none';
                } else if (child.nodeType === 3) {
                    child.textContent = '';
                }
            });

            const existing = logoContainer.querySelector('.cp-logo-container');
            if (existing) existing.remove();

            const wrapper = document.createElement('div');
            wrapper.className = 'cp-logo-container';
            wrapper.innerHTML = `
                <div class="cp-logo-top">
                    <div class="cp-glitch" data-text="TORRENT">TORRENT</div>
                    <div class="cp-bd">BD</div>
                </div>
                <div class="cp-logo-bottom">
                    <span class="cp-bar">||| || |||</span> Cyberpunk Theme v1.32 © VoltaX
                </div>
            `;
            logoContainer.appendChild(wrapper);
        }
    }

    function injectHUD() {
        const hud = document.createElement('div');
        hud.id = 'cp-hud';
        hud.innerHTML = `
            <div class="hud-corner top-left"><div class="hud-bracket"></div><div class="hud-text hud-typewriter">SYSTEM: ONLINE</div></div>
            <div class="hud-corner top-right"><div class="hud-bracket"></div><div class="hud-text">SECURE://TLS_1.3</div></div>
            <div class="hud-corner bottom-left"><div class="hud-bracket"></div></div>
            <div class="hud-corner bottom-right"><div class="hud-bracket"></div><div class="hud-text v-label">V.1.32</div></div>
            <div id="cp-progress-bar"></div>
        `;
        document.body.appendChild(hud);
    }

    function injectSystemFooter() {
        const footer = document.querySelector('footer .container');
        if (footer) {
            footer.innerHTML = `
                <div style="display:flex; justify-content:space-between; opacity:0.7; width:100%;">
                    <span>NETWATCH: <span style="color:var(--cp-neon); font-weight:bold;">CONNECTED</span></span>
                    <span>PING: <span style="color:#bbb">24ms</span></span>
                    <span>UPTIME: <span style="color:#bbb">99.9%</span></span>
                    <span>ENCRYPTION: <span style="color:var(--cp-neon); font-weight:bold;">2048-BIT</span></span>
                    <span>ZONE: <span style="color:#bbb">NIGHT CITY</span></span>
                </div>
            `;
        }
    }

    function runBootSequence() {
        console.clear();
        const styles = 'background: #161b22; color: #00f3ff; font-family: monospace; font-weight: bold; padding: 4px;';
        console.log('%c SYSTEM BOOT SEQUENCE INITIATED...', styles);
        setTimeout(() => console.log('%c [OK] NEURAL LINK ESTABLISHED', styles), 200);
        setTimeout(() => console.log('%c [OK] OVERLAY INJECTED', styles), 400);
        setTimeout(() => console.log('%c [OK] RGB CYCLE: ACTIVE', styles), 600);
        setTimeout(() => console.log('%c WELCOME TO NIGHT CITY, RUNNER.', 'color: #fcee0a; background: #161b22; font-size: 14px; font-weight: bold; padding: 5px;'), 800);
    }

    const css = `
        :root {
            --cp-neon: ${COLORS[0]};
            --cp-neon-dim: ${COLORS[0]}20;
            --cp-panel: rgba(30, 34, 40, 0.85);
            --cp-text: #c9d1d9;
            --cp-font-main: 'Oxanium', cursive;
            --cp-font-code: 'JetBrains Mono', monospace;
            --cp-font-logo: 'Orbitron', sans-serif;

            --engine-body-bg: transparent !important;
            --engine-card-bg: var(--cp-panel) !important;
            --engine-nav-bg: rgba(22, 27, 34, 0.98) !important;
            --engine-body-color: var(--cp-text) !important;
            --engine-content-title: var(--cp-neon) !important;
            --engine-accent-color-1: var(--cp-neon) !important;
            --engine-border-color: var(--cp-neon-dim) !important;
            --link-color: var(--cp-neon) !important;

            --engine-seeders: var(--cp-neon) !important;
            --engine-leechers: #ff003c !important;
            --engine-completed: #fcee0a !important;

            transition: --cp-neon 3.25s linear, --cp-neon-dim 3.25s linear;
        }

        html {
            background-color: #161b22 !important;
            min-height: 100%;
        }

        @keyframes scanline-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }

        @keyframes glitch-anim {
            0% { clip-path: inset(40% 0 61% 0); } 20% { clip-path: inset(92% 0 1% 0); } 40% { clip-path: inset(43% 0 1% 0); }
            60% { clip-path: inset(25% 0 58% 0); } 80% { clip-path: inset(54% 0 7% 0); } 100% { clip-path: inset(58% 0 43% 0); }
        }
        @keyframes typewriter { from { width: 0; } to { width: 100%; } }
        @keyframes blink { 50% { opacity: 0; } }

        ::selection { background: var(--cp-neon); color: #000; text-shadow: none; }

        body {
            background-image: url('${BG_URL}') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-attachment: fixed !important;
            background-repeat: no-repeat !important;
            min-height: 100vh;
        }

        body::before {
            content: " "; display: block; position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: -1; pointer-events: none;
            background:
                linear-gradient(rgba(13, 17, 23, 0.85), rgba(13, 17, 23, 0.85)),
                linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .02) 25%, rgba(255, 255, 255, .02) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .02) 75%, rgba(255, 255, 255, .02) 76%, transparent 77%, transparent),
                linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.05) 50%);
            background-size: cover, 50px 50px, 50px 50px, 100% 2px;
            transform: translateZ(0); will-change: background-position; animation: scanline-scroll 10s linear infinite;
            height: 100vh; width: 100vw;
        }

        #cp-hud { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 99990; }
        .hud-corner { position: absolute; width: 150px; height: 100px; opacity: 0.4; }
        .top-left { top: 0px; left: 20px; }
        .top-right { top: 20px; right: 20px; text-align: right; }
        .bottom-left { bottom: 20px; left: 20px; } .bottom-right { bottom: 20px; right: 20px; text-align: right; }
        .hud-bracket { width: 100%; height: 100%; border: 2px solid var(--cp-neon-dim); transition: border-color 1s ease; }
        .top-left .hud-bracket { border-right: none; border-bottom: none; } .top-right .hud-bracket { border-left: none; border-bottom: none; }
        .bottom-left .hud-bracket { border-right: none; border-top: none; } .bottom-right .hud-bracket { border-left: none; border-top: none; }
        .hud-text { font-family: var(--cp-font-code); font-size: 10px; color: var(--cp-neon); letter-spacing: 2px; margin-top: 5px; text-shadow: none; white-space: nowrap; overflow: hidden; opacity: 0.7; }
        .hud-typewriter { animation: typewriter 2s steps(20) 1 normal both; }
        .hud-text.v-label::after { content: ' █'; animation: blink 1s step-end infinite; color: var(--cp-neon); }

        #cp-progress-bar {
            position: absolute; top: 0; left: 0; height: 2px; background: var(--cp-neon);
            box-shadow: 0 0 3px var(--cp-neon); width: 0%; transition: width 0.1s linear, background 1s ease;
        }

        footer.page-footer {
            background: rgba(22, 27, 34, 0.98) !important;
            border-top: 1px solid var(--cp-neon-dim) !important;
            font-family: var(--cp-font-code) !important;
            padding: 10px 0 !important;
            position: relative; z-index: 100;
        }
        footer .container { color: var(--cp-text) !important; font-size: 11px; letter-spacing: 1px; }

        .btn:not(.btn-floating), button:not(.btn-floating) {
            clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
            border: none !important; border-radius: 0 !important;
            background: var(--cp-neon-dim) !important; color: #e0e0e0 !important;
            padding: 0 15px !important;
        }
        .btn:hover, button:hover { background: var(--cp-neon) !important; color: #000 !important; }

        .card, .card-panel, .panel, .shoutbox-container, .dropdown-content {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin-bottom: 15px !important;
            position: relative !important;
            overflow: visible !important;
            clip-path: none !important;
        }

        /* === SAFE LAYOUT RESET === */
        /* Removed position: static to fix Login Page layout, keeping transform reset for tooltips */
        #middle-block, #content-block, .table-responsive {
            transform: none !important;
            contain: none !important;
            perspective: none !important;
            filter: none !important;
            will-change: auto !important;
        }

        /* Ensure table structure does not trap coordinates */
        td, th, tr {
            transform: none !important;
            z-index: auto !important;
        }

        .exclusives .card, .carousel, .torrents-table tbody {
            content-visibility: visible !important;
            contain: none !important;
            transform: none !important;
        }

        /* Left Panel Styling */
        #left-block-container .card {
            background: linear-gradient(135deg, rgba(15, 20, 25, 0.95) 0%, rgba(5, 8, 10, 0.95) 100%) !important;
            border: 1px solid var(--cp-neon-dim) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
        }

        /* Red Sidebar Headers */
        #left-block-container .collapsible-header {
            background: linear-gradient(90deg, rgba(255, 0, 60, 0.15) 0%, transparent 100%) !important;
            border-left: 4px solid #ff003c !important;
            color: #ff003c !important;
            text-shadow: 0 0 8px rgba(255, 0, 60, 0.6);
            font-weight: 700 !important;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        #left-block-container .collapsible-header:hover {
            background: linear-gradient(90deg, rgba(255, 0, 60, 0.3) 0%, transparent 100%) !important;
            box-shadow: 0 0 15px rgba(255, 0, 60, 0.2);
            padding-left: 20px !important;
        }

        #left-block-container .collapsible-header i {
            color: #ff003c !important;
            filter: drop-shadow(0 0 5px #ff003c);
        }

        /* Left Sidebar Content Red */
        #left-block-container .collapsible-body {
            background: rgba(35, 5, 10, 0.8) !important;
            border-bottom: 1px solid rgba(255, 0, 60, 0.3) !important;
            color: var(--cp-text) !important;
            box-shadow: inset 4px 0 0 #ff003c !important;
        }

        .lean-overlay, .modal-overlay {
            background-color: rgba(0, 0, 0, 0.8) !important;
            z-index: 9990 !important;
            display: block !important;
        }

        .modal {
            background: var(--cp-panel) !important;
            border: 1px solid var(--cp-neon-dim) !important;
            box-shadow: 0 0 25px rgba(0,0,0,0.8) !important;
            border-radius: 0 !important;
            position: fixed !important;
            z-index: 10000 !important;
            overflow: visible !important;
            transform: none !important;
            contain: none !important;
            max-height: 90% !important;
        }

        .sceditor-container {
             width: 100% !important;
             max-width: 100% !important;
             display: flex !important;
             flex-direction: column !important;
             height: auto !important;
             box-sizing: border-box !important;
             contain: none !important;
        }

        .sceditor-container iframe, textarea {
            width: 100% !important;
            box-sizing: border-box !important;
            color: #c9d1d9 !important;
        }

        .replyBtn i, .quoteBtn i, .reportBtn i, .editBtn i {
             color: var(--cp-neon) !important;
             visibility: visible !important;
             opacity: 1 !important;
        }

        .card::before, .card-panel::before, .panel::before, .shoutbox-container::before, .dropdown-content::before, .modal::before {
            content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--cp-panel) !important;
            border: 1px solid var(--cp-neon-dim) !important;
            border-left: 3px solid var(--cp-neon) !important;
            clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px);
            z-index: -1;
            pointer-events: none;
            transition: border-color 1s linear;
            will-change: border-color;
        }

        /* Left panel uses custom background, remove generic ::before overlay */
        #left-block-container .card::before {
             display: none !important;
        }

        /* Remove generic overlay from Exclusives to allow blur */
        .exclusives .card::before, div[id*="exclusive"] .card::before {
             display: none !important;
        }

        #kuddus-wrapper {
             background: var(--cp-panel) !important;
             position: fixed !important; z-index: 99999 !important; overflow-y: auto !important;
        }

        .card:hover::before, .card-panel:hover::before {
            border-color: var(--cp-neon) !important;
            box-shadow: 0 0 5px var(--cp-neon-dim) !important;
        }

        .cnav {
            border-bottom: 1px solid var(--cp-neon-dim) !important;
            background: rgba(22, 27, 34, 0.98) !important;
            padding-bottom: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .content-title h6, .card-title {
            font-family: var(--cp-font-logo) !important;
            letter-spacing: 1px;
            opacity: 0.9;
        }

        .content-title, #left-block .content-title {
            background: linear-gradient(90deg, var(--cp-neon-dim) 0%, transparent 100%);
            border-left: 4px solid var(--cp-neon);
            border-bottom: 1px solid var(--cp-neon-dim);
            padding: 10px !important;
            margin-bottom: 15px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        /* Blurry Transparent Shoutbox & Exclusives */
        .shoutbox-container, #shoutbox_frame, .exclusives .card, div[id*="exclusive"] .card {
            background: rgba(10, 10, 12, 0.65) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.8) !important;
            border: 1px solid var(--cp-neon-dim) !important;
            /* Important to reset transform/contain on these specific elements too */
            transform: none !important;
            contain: none !important;
            position: relative !important;
            z-index: 1 !important;
        }

        /* Profile & General Content Blur */
        #middle-block .card-panel:not(.mimtb) {
            background: rgba(10, 10, 12, 0.75) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.8) !important;
            border: 1px solid var(--cp-neon-dim) !important;
        }

        /* Torrent Description Readability */
        #description {
            background: rgba(10, 10, 12, 0.85) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            padding: 20px !important;
            border: 1px solid var(--cp-neon-dim) !important;
            border-radius: 6px !important;
            margin-top: 10px !important;
            color: var(--cp-text) !important;
        }
        .torr-card {
             background: rgba(10, 10, 12, 0.7) !important;
             backdrop-filter: blur(10px) !important;
             -webkit-backdrop-filter: blur(10px) !important;
        }

        body, html { cursor: ${CURSOR_MAIN} !important; font-family: var(--cp-font-main) !important; letter-spacing: 0.5px; }
        a, button, .btn, .pointer, .collapsible-header, select, label, i, .cnav-menu-item, .card-title, .tab, input[type="checkbox"] + label, .waves-effect { cursor: ${CURSOR_POINTER} !important; }

        .profile-info-table td, .profile-info-table span, .profile-info-table a { font-family: var(--cp-font-code) !important; font-weight: 500 !important; font-size: 0.85rem !important; color: #c9d1d9 !important; text-shadow: none; }

        .profile-tib-container h5 .tbdrank { font-size: 2.1rem !important; font-weight: 700 !important; color: var(--cp-neon) !important; text-shadow: 0 0 5px var(--cp-neon-dim) !important; letter-spacing: 1px; }
        .profile-tib-container h5 .u-rank-text { font-size: 1.1rem !important; color: var(--cp-text) !important; font-weight: 400; opacity: 0.7; }

        #left-block-container .card .card-content .card-title .tbdrank { font-size: 1.8rem !important; font-weight: 600 !important; color: var(--cp-neon) !important; text-shadow: 0 0 5px var(--cp-neon-dim) !important; letter-spacing: 1px; }

        .tbdrank { font-weight: 600 !important; letter-spacing: 0.3px; font-size: 0.9rem !important; }

        table.torrents-table { border-collapse: collapse !important; width: 100%; }
        table.torrents-table td { font-family: var(--cp-font-code) !important; font-weight: 400 !important; color: #b0c4de !important; padding: 8px 5px !important; }

        table.torrents-table thead th {
            position: sticky !important; top: 63px !important; z-index: 800 !important;
            background: #1c2128 !important;
            border-bottom: 2px solid var(--cp-neon) !important;
            color: var(--cp-neon); font-family: var(--cp-font-logo) !important; letter-spacing: 1px;
            box-shadow: 0 5px 10px rgba(0,0,0,0.4);
            text-shadow: none;
        }

        table.torrents-table td:nth-child(6), table.torrents-table td:nth-child(7),
        table.torrents-table td:nth-child(8), table.torrents-table td:nth-child(9),
        table.torrents-table th:nth-child(6), table.torrents-table th:nth-child(7),
        table.torrents-table th:nth-child(8), table.torrents-table th:nth-child(9) {
            text-align: right !important; padding-right: 20px !important;
        }

        table.torrents-table i.material-icons {
            color: var(--cp-neon) !important; text-shadow: none; transition: transform 0.2s;
        }
        table.torrents-table i.material-icons:hover { transform: scale(1.1); }

        /* Red Cyberpunk Torrent Rows - No Blur to fix Positioning */
        table.torrents-table tbody tr {
            background: linear-gradient(90deg, rgba(255, 0, 60, 0.15) 0%, transparent 100%) !important;
            border-left: 4px solid #ff003c !important;
            border-bottom: 1px solid var(--cp-neon-dim) !important;
            transition: all 0.1s;
            position: static !important;
            z-index: 1;
        }

        table.torrents-table tbody tr:hover {
            background: linear-gradient(90deg, rgba(255, 0, 60, 0.3) 0%, transparent 100%) !important;
            box-shadow: 0 0 15px rgba(255, 0, 60, 0.15) !important;
            z-index: 10;
        }

        /* Glowing White Titles */
        table.torrents-table tbody tr td:nth-child(2) a {
            color: #ffffff !important;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.6) !important;
            font-weight: 500;
        }

        /* Glowing Columns */
        table.torrents-table tbody tr td:nth-child(5),
        table.torrents-table tbody tr td:nth-child(6) {
            color: #fff !important;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.6) !important;
        }
        table.torrents-table tbody tr td:nth-child(7),
        table.torrents-table tbody tr td:nth-child(8),
        table.torrents-table tbody tr td:nth-child(9) {
            font-weight: 600;
            text-shadow: 0 0 8px currentColor !important;
        }

        td.avatar-cell, td.poster-cell, .torrent-row-image {
             overflow: visible !important;
             transform: none !important;
             z-index: auto !important;
             position: static !important;
        }

        img.avatar, img.up-avatar, img.poster-avatar, .preview-trigger, .poster-trigger, .avatar-trigger, .up-avatar, .poster {
            border-radius: 0 !important;
            border: 2px solid var(--cp-neon);
            box-shadow: 1px 1px 0 var(--cp-neon-dim);
            transition: 0.2s ease;
            background: #000;
            position: static !important;
            transform: none !important;
        }

        img.avatar:hover, img.up-avatar:hover, img.poster-avatar:hover {
            box-shadow: 2px 2px 0 #ff003c, -2px -2px 0 #00f3ff;
            z-index: 9999 !important;
            position: relative !important;
        }

        .tippy-box, .tippy-content, [id^="tippy"], #hover-content, .hover-content, div[style*="absolute"] {
             z-index: 2147483647 !important;
        }

        input, textarea, select, #kuddus-trigger {
            background: rgba(22, 27, 34, 0.9) !important; border: 1px solid var(--cp-neon-dim) !important;
            border-left: 2px solid var(--cp-neon) !important;
            color: var(--cp-neon) !important; font-family: var(--cp-font-code) !important; font-weight: 400 !important;
            clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
        }
        input:focus, textarea:focus, select:focus { border-color: var(--cp-neon) !important; box-shadow: 0 0 5px var(--cp-neon-dim) !important; background: #1c2128 !important; }

        .sceditor-container, .sceditor-container iframe, textarea,
        #preview-container, .preview-content, .bbcode-preview,
        form[action*="forums.php"] .card,
        form[action*="forums.php"] .card-panel,
        .preview-box {
            background-color: #161b22 !important;
            background-image: none !important;
            backdrop-filter: none !important;
            opacity: 1 !important;
        }
        .sceditor-container iframe, textarea {
            color: #c9d1d9 !important;
        }

        .dl-sc, .material-tooltip { z-index: 99999 !important; background: rgba(22, 27, 34, 0.98) !important; border: 1px solid var(--cp-neon); box-shadow: 0 0 5px var(--cp-neon-dim); }
        #left-block-container { background: transparent !important; border: none !important; box-shadow: none !important; }

        .cp-logo-container { display: flex; flex-direction: column; align-items: flex-start; transform: skewX(-10deg); margin-top: 5px; }
        .cp-logo-top { display: flex; align-items: baseline; line-height: 1; }
        .cp-glitch { font-family: var(--cp-font-logo) !important; font-weight: 900; font-size: 2.2rem; color: #fcee0a; position: relative; letter-spacing: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }
        .cp-glitch::before, .cp-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); }
        .cp-glitch::before { left: 2px; text-shadow: -1px 0 #ff003c; clip-path: inset(0 0 0 0); animation: glitch-anim 3s infinite linear alternate-reverse; }
        .cp-glitch::after { left: -2px; text-shadow: -1px 0 #00f3ff; clip-path: inset(0 0 0 0); animation: glitch-anim 2s infinite linear alternate-reverse; }
        .cp-bd { font-family: 'Russo One', sans-serif; font-size: 2.8rem; color: #00f3ff; text-shadow: 0 0 5px #00f3ff; margin-left: 5px; transform: translateY(3px); }
        .cp-logo-bottom { font-family: var(--cp-font-code); font-size: 0.65rem; color: #ff003c; letter-spacing: 1px; font-weight: 700; margin-top: -2px; width: 100%; display: flex; justify-content: space-between; white-space: nowrap; text-shadow: 0 1px 1px rgba(0,0,0,0.8); }
        .cp-bar { font-weight: 900; letter-spacing: -1px; margin-right: 8px; }

        #rgb-control {
            position: fixed; bottom: 20px; left: 20px; width: 40px; height: 40px;
            border: 2px solid var(--cp-neon); background: #161b22; color: var(--cp-neon);
            display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9999;
            font-family: var(--cp-font-code); font-weight: 600; box-shadow: 0 0 5px var(--cp-neon-dim);
            font-size: 14px; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        #rgb-control:hover { transform: scale(1.1); box-shadow: 0 0 10px var(--cp-neon); }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track {
            background: #161b22;
            background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, var(--cp-neon-dim) 2px, var(--cp-neon-dim) 4px);
        }
        ::-webkit-scrollbar-thumb { background: var(--cp-neon); border-radius: 0; box-shadow: 0 0 3px var(--cp-neon); }
    `;

    GM_addStyle(css);

    function updateTheme(color) {
        const root = document.documentElement;
        root.style.setProperty('--cp-neon', color);
        root.style.setProperty('--cp-neon-dim', color + '20');
        root.style.setProperty('--engine-content-title', color);
        root.style.setProperty('--engine-accent-color-1', color);
        root.style.setProperty('--link-color', color);
    }

    function startCycle() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            currentColorIndex = (currentColorIndex + 1) % COLORS.length;
            updateTheme(COLORS[currentColorIndex]);
        }, 3250);
    }

    function stopCycle() {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
    }

    function createUI() {
        const btn = document.createElement('div');
        btn.id = 'rgb-control';
        if (isPaused) { btn.innerText = '▶'; updateTheme(COLORS[0]); } else { btn.innerText = '❚❚'; startCycle(); }
        btn.onclick = () => {
            isPaused = !isPaused;
            GM_setValue('rgb_paused', isPaused);
            if (isPaused) { stopCycle(); btn.innerText = '▶'; } else { startCycle(); btn.innerText = '❚❚'; }
        };
        document.body.appendChild(btn);
    }

    function initScrollListener() {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            const bar = document.getElementById('cp-progress-bar');
            if (bar) bar.style.width = scrolled + "%";
        }, { passive: true });
    }

    injectCyberLogo();
    injectHUD();
    injectSystemFooter();
    createUI();
    initScrollListener();
    runBootSequence();

    function runBootSequence() {
        console.clear();
        const styles = 'background: #161b22; color: #00f3ff; font-family: monospace; font-weight: bold; padding: 4px;';
        console.log('%c SYSTEM BOOT SEQUENCE INITIATED...', styles);
        setTimeout(() => console.log('%c [OK] NEURAL LINK ESTABLISHED', styles), 200);
        setTimeout(() => console.log('%c [OK] OVERLAY INJECTED', styles), 400);
        setTimeout(() => console.log('%c [OK] RGB CYCLE: ACTIVE', styles), 600);
        setTimeout(() => console.log('%c WELCOME TO NIGHT CITY, RUNNER.', 'color: #fcee0a; background: #161b22; font-size: 14px; font-weight: bold; padding: 5px;'), 800);
    }

})();