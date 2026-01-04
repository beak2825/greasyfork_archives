// ==UserScript==
// @name         Секси форум
// @namespace    https://forum.blackrussia.online
// @version      1893248239.00001
// @description  секси форум 
// @author       Dont Sorry
// @match        *://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558254/%D0%A1%D0%B5%D0%BA%D1%81%D0%B8%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/558254/%D0%A1%D0%B5%D0%BA%D1%81%D0%B8%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const css = `
        :root {
            --glass-dark: rgba(11, 17, 26, 0.95);
            --glass-light: rgba(20, 30, 45, 0.6);
            --border-color: rgba(60, 160, 240, 0.3);
            --accent-blue: #3498db;
            --accent-glow: #00d2ff;
            --text-main: #dbe4eb;
            --hover-bg: rgba(52, 152, 219, 0.08);
        }

        html, body {
            background-color: #05080c !important;
            color: var(--text-main) !important;
        }
        body::before {
            content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at top, #15202b 0%, #05080c 100%);
            z-index: -5;
        }

        /* --- СТАНДАРТНЫЕ СТИЛИ ФОРУМА (КАК БЫЛО) --- */
        .p-body, .p-body-inner, .p-body-content, .p-body-main, .p-body-sidebar, .p-body-sideNavContent { background: transparent !important; }
        .block, .block-outer { background: transparent !important; border: none !important; }
        .block-container {
            background: var(--glass-dark) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 12px !important;
            box-shadow: 0 5px 25px rgba(0,0,0,0.4) !important;
            overflow: hidden !important;
        }
        .block-header, .block-minorHeader {
            background: transparent !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
            color: #fff !important;
            padding: 15px !important;
            text-shadow: 0 0 10px rgba(52, 152, 219, 0.4);
        }
        .block-header a, .block-minorHeader a { color: #fff !important; }
        .block-filterBar { background: rgba(0,0,0,0.2) !important; border-bottom: none !important; }
        .block-body { background: transparent !important; }
        .block-footer { background: rgba(0,0,0,0.15) !important; border-top: 1px solid rgba(255,255,255,0.05) !important; }
        .node, .node-body, .node-extra, .node-stats, .node-meta { background: transparent !important; }
        .node-body:hover, .node:hover > .node-body { background: var(--hover-bg) !important; }
        .structItem, .structItem-cell { background: transparent !important; }
        .structItem { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .structItem:hover { background: var(--hover-bg) !important; }
        .dataList, .dataList-row, .dataList-cell { background: transparent !important; }
        .dataList-row { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .dataList-row:hover { background: var(--hover-bg) !important; }
        .p-header, .p-header-inner, .p-header-content { background: transparent !important; }
        .p-nav { background: rgba(10, 14, 20, 0.95) !important; border-bottom: 1px solid var(--border-color) !important; }
        .p-nav-inner { background: transparent !important; }
        .p-sectionLinks { background: rgba(15, 20, 30, 0.8) !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .p-breadcrumbs, .p-breadcrumbs-inner { background: transparent !important; }
        .p-title, .p-title-value, .p-description { background: transparent !important; color: #fff !important; }
        .message {
            background: rgba(20, 25, 35, 0.5) !important;
            border: 1px solid rgba(255,255,255,0.05) !important;
            border-radius: 8px !important;
            margin-bottom: 10px !important;
        }
        .message-inner, .message-cell, .message-content, .message-userContent, .message-user, .message-userDetails, .message-attribution { background: transparent !important; }
        .message-userArrow { display: none !important; }
        .formButtonGroup, .formSubmitRow { background: transparent !important; }
        .formRow { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        input[type="text"], input[type="password"], input[type="email"], input[type="search"], input[type="number"], input[type="url"], textarea, select, .input {
            background: rgba(15, 20, 30, 0.8) !important;
            border: 1px solid var(--border-color) !important;
            color: var(--text-main) !important;
            border-radius: 6px !important;
        }
        input:focus, textarea:focus, select:focus { border-color: var(--accent-blue) !important; box-shadow: 0 0 8px rgba(52, 152, 219, 0.3) !important; }
        .button, button, input[type="submit"], input[type="button"] {
            background: rgba(52, 152, 219, 0.3) !important;
            border: 1px solid var(--border-color) !important;
            color: #fff !important;
            border-radius: 6px !important;
        }
        .button:hover, button:hover { background: rgba(52, 152, 219, 0.5) !important; }
        .button--primary, .button.button--primary { background: rgba(52, 152, 219, 0.6) !important; }
        .menu, .menu-content {
            background: var(--glass-dark) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 8px !important;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5) !important;
        }
        .menu-row, .menu-linkRow { background: transparent !important; }
        .menu-row:hover, .menu-linkRow:hover { background: var(--hover-bg) !important; }
        .menu-header, .menu-footer { background: rgba(0,0,0,0.2) !important; border-color: rgba(255,255,255,0.05) !important; }
        .overlay, .overlay-container {
            background: var(--glass-dark) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6) !important;
        }
        .overlay-title { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .overlay-content { background: transparent !important; }
        .tooltip, .tooltip-content {
            background: var(--glass-dark) !important;
            border: 1px solid var(--border-color) !important;
            color: var(--text-main) !important;
            border-radius: 6px !important;
        }
        .pageNav, .pageNav-main { background: transparent !important; }
        .pageNav-page, .pageNav-jump {
            background: rgba(20, 30, 45, 0.5) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 4px !important;
        }
        .pageNav-page:hover, .pageNav-jump:hover { background: rgba(52, 152, 219, 0.3) !important; }
        .pageNav-page.pageNav-page--current { background: rgba(52, 152, 219, 0.5) !important; border-color: var(--accent-blue) !important; }
        .bbCodeBlock {
            background: rgba(10, 15, 25, 0.6) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 8px !important;
        }
        .bbCodeBlock-title { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .bbCodeBlock-content { background: transparent !important; }
        .bbCodeBlock-expandLink { background: linear-gradient(to bottom, transparent, rgba(10, 15, 25, 0.9)) !important; }
        .bbCodeCode, code, pre {
            background: rgba(10, 15, 25, 0.8) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #9cdcfe !important;
        }
        .alert, .notice {
            background: var(--glass-light) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 8px !important;
        }
        .alertItem, .alert-row { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .fr-box, .fr-wrapper, .fr-toolbar, .fr-second-toolbar { background: rgba(15, 20, 30, 0.9) !important; border-color: var(--border-color) !important; }
        .fr-view, .fr-element { background: rgba(15, 20, 30, 0.8) !important; color: var(--text-main) !important; }
        .p-footer { background: transparent !important; border: none !important; }
        .p-footer-inner { background: rgba(8, 12, 18, 0.95) !important; border-top: 1px solid var(--border-color) !important; }
        .p-footer a { color: #7ab2d6 !important; }
        .tabs, .tabs-tab { background: transparent !important; }
        .tabs-tab.is-active { background: rgba(52, 152, 219, 0.2) !important; border-bottom-color: var(--accent-blue) !important; }
        .bbCodeSpoiler-button { background: rgba(52, 152, 219, 0.3) !important; border: 1px solid var(--border-color) !important; }
        .bbCodeSpoiler-content { background: rgba(10, 15, 25, 0.5) !important; }
        .reactionsBar, .reactionSummary { background: transparent !important; }
        .p-body-sidebar .block-container { background: var(--glass-dark) !important; }
        .p-nav-search, .p-nav-search input { background: rgba(15, 20, 30, 0.8) !important; }

        /* --- СНЕГ И ТАЙМЕР --- */
        #brTimer {
            position: fixed; bottom: 20px; left: 20px;
            background: rgba(5, 10, 15, 0.9);
            border: 1px solid #3498db;
            color: #fff;
            padding: 8px 15px;
            border-radius: 50px;
            font-family: monospace;
            font-size: 13px;
            z-index: 9999;
            box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
            pointer-events: none;
        }
        #snowCanvas {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 9000;
        }

        /* --- ИСПРАВЛЕНИЯ ПРОФИЛЯ --- */
        .memberCard {
            background: var(--glass-dark) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
        }
        .memberProfileBanner { background-color: transparent !important; border: none !important; }
        .memberHeader-content, .memberHeader-content--info { background: transparent !important; opacity: 1 !important; }
        .memberHeader-content--info::before, .memberHeader-mainContent::before, .memberHeader-content::before { display: none !important; background: none !important; }
        .memberProfileBanner img { opacity: 1 !important; visibility: visible !important; }
        .memberHeader-mainContent { background: transparent !important; }
        .memberHeader-avatar .avatar {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 2px solid rgba(255, 255, 255, 0.5) !important;
            border-radius: 20px !important;
            padding: 4px !important;
            box-shadow: 0 0 20px var(--accent-blue) !important;
            backdrop-filter: blur(5px);
            animation: breathe 3s infinite ease-in-out;
            transition: all 0.3s ease !important;
        }
        .memberHeader-avatar .avatar img { border-radius: 16px !important; }
        .memberHeader-avatar .avatar:hover {
            transform: scale(1.05) rotate(1deg);
            border-color: var(--accent-glow) !important;
            box-shadow: 0 0 40px var(--accent-glow) !important;
        }
        .memberHeader-name .username {
            font-weight: 900 !important;
            font-size: 26px !important;
            color: #fff !important;
            text-shadow: 0 0 10px rgba(52, 152, 219, 0.8), 0 0 20px rgba(52, 152, 219, 0.4) !important;
            transition: all 0.3s ease;
        }
        .memberHeader-name .username:hover { text-shadow: 0 0 15px var(--accent-glow), 0 0 30px var(--accent-glow) !important; letter-spacing: 0.5px; }
        .memberHeader-stats { margin-top: 15px !important; }
        .memberHeader-stats .pairs {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            padding: 8px 15px !important;
            margin-right: 5px !important;
            transition: all 0.2s ease;
        }
        .memberHeader-stats .pairs:hover {
            background: rgba(52, 152, 219, 0.2) !important;
            border-color: var(--accent-blue) !important;
            transform: translateY(-2px);
        }
        .memberHeader-stats dt { color: #8aaabb !important; }
        .memberHeader-stats dd { color: #fff !important; font-weight: bold !important; font-size: 16px !important; }

        @keyframes breathe {
            0% { box-shadow: 0 0 15px rgba(52, 152, 219, 0.4); border-color: rgba(255, 255, 255, 0.3); }
            50% { box-shadow: 0 0 25px rgba(52, 152, 219, 0.7); border-color: rgba(255, 255, 255, 0.6); }
            100% { box-shadow: 0 0 15px rgba(52, 152, 219, 0.4); border-color: rgba(255, 255, 255, 0.3); }
        }

        /* ================================================== */
        /*               ULTRA REALISTIC 3D TREE              */
        /* ================================================== */

        .scene-container {
            position: relative;
            width: 100%;
            height: 400px;
            margin-top: 50px;
            margin-bottom: -50px; /* Уходит немного под экран */
            background: linear-gradient(to top, rgba(5,8,12,1) 10%, rgba(5,8,12,0) 100%);
            display: flex;
            justify-content: center;
            align-items: flex-end;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        }

        .tree-wrapper {
            position: relative;
            width: 300px;
            height: 380px;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));
            transform-style: preserve-3d;
            z-index: 10;
        }

        /* Ствол */
        .trunk {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 60px;
            background: linear-gradient(90deg, #2d1a0e 0%, #5e3b23 40%, #2d1a0e 100%);
            border-radius: 4px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
            z-index: 1;
        }

        /* Хвоя (Слои) */
        .layer {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            background: conic-gradient(from 180deg at 50% 20%, #0d3a1a 0deg, #1f5c2e 40deg, #2ecc71 180deg, #1f5c2e 320deg, #0d3a1a 360deg);
            border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5), inset 0 -5px 10px rgba(0,0,0,0.3);
            z-index: 2;
        }

        .layer-1 { bottom: 50px; width: 220px; height: 120px; z-index: 2; }
        .layer-2 { bottom: 120px; width: 180px; height: 100px; z-index: 3; }
        .layer-3 { bottom: 180px; width: 140px; height: 90px; z-index: 4; }
        .layer-4 { bottom: 240px; width: 100px; height: 70px; z-index: 5; }

        /* Тень на ветках */
        .layer::before {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            border-radius: inherit;
            background: radial-gradient(circle at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%);
        }

        /* 3D Звезда */
        .star-3d {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            z-index: 10;
            filter: drop-shadow(0 0 15px #ffd700);
            animation: starFloat 3s ease-in-out infinite;
        }
        .star-shape {
            display: block;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ffd700 0%, #fdb931 100%);
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            animation: starSpin 6s linear infinite;
        }
        .star-core {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 10px; height: 10px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 20px #fff, 0 0 40px #ffd700;
            animation: corePulse 1.5s infinite alternate;
        }

        /* Игрушки (Шары) */
        .ornament {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            box-shadow: inset -2px -2px 6px rgba(0,0,0,0.4), 1px 1px 5px rgba(255,255,255,0.4);
            z-index: 6;
            animation: ornamentGlow 2s infinite alternate;
        }
        .red { background: radial-gradient(circle at 30% 30%, #ff7675, #d63031); box-shadow: 0 0 10px rgba(214, 48, 49, 0.6); }
        .blue { background: radial-gradient(circle at 30% 30%, #74b9ff, #0984e3); box-shadow: 0 0 10px rgba(9, 132, 227, 0.6); }
        .gold { background: radial-gradient(circle at 30% 30%, #ffeaa7, #fdcb6e); box-shadow: 0 0 10px rgba(253, 203, 110, 0.6); }

        /* Позиции игрушек */
        .o1 { bottom: 80px; left: 40%; animation-delay: 0s; }
        .o2 { bottom: 90px; left: 70%; animation-delay: 0.5s; }
        .o3 { bottom: 140px; left: 35%; animation-delay: 1s; }
        .o4 { bottom: 150px; left: 60%; animation-delay: 1.5s; }
        .o5 { bottom: 200px; left: 45%; animation-delay: 0.2s; }
        .o6 { bottom: 210px; left: 55%; animation-delay: 0.7s; }
        .o7 { bottom: 250px; left: 50%; width: 10px; height: 10px; animation-delay: 1.2s; }

        /* Снег под елкой */
        .snow-base {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%) scaleY(0.4);
            width: 300px;
            height: 100px;
            background: radial-gradient(circle, rgba(230,240,255,0.9) 0%, rgba(230,240,255,0) 70%);
            filter: blur(10px);
            z-index: 0;
            opacity: 0.7;
        }

        /* Неоновое свечение сзади */
        .aurora-glow {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            height: 400px;
            background: radial-gradient(circle at 50% 100%, rgba(52, 152, 219, 0.15), transparent 60%);
            z-index: -1;
            pointer-events: none;
        }

        /* Анимации */
        @keyframes starSpin { 100% { transform: rotateY(360deg); } }
        @keyframes starFloat { 0%, 100% { top: 30px; } 50% { top: 25px; } }
        @keyframes corePulse { 0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.8); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); } }
        @keyframes ornamentGlow { 0% { filter: brightness(1); } 100% { filter: brightness(1.3); } }

        @media (max-width: 768px) {
            #brTimer { bottom: 10px; left: 10px; font-size: 11px; padding: 5px 10px; }
            .p-footer-inner { padding-bottom: 60px; }
            .scene-container { height: 300px; }
            .tree-wrapper { transform: scale(0.7); transform-origin: bottom center; }
        }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth < 768;
    const SNOW_COUNT = isMobile ? 35 : 85;

    class SnowSystem {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'snowCanvas';
            this.ctx = this.canvas.getContext('2d');
            this.flakes = [];
        }
        init() {
            document.body.appendChild(this.canvas);
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.createFlakes();
            this.animate();
        }
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        createFlakes() {
            this.flakes = [];
            for (let i = 0; i < SNOW_COUNT; i++) {
                this.flakes.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    s: Math.random() * 2 + 1,
                    sp: Math.random() * 1 + 0.5,
                    op: Math.random() * 0.5 + 0.3
                });
            }
        }
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFF';
            this.flakes.forEach(f => {
                f.y += f.sp;
                if (f.y > this.canvas.height) {
                    f.y = -5;
                    f.x = Math.random() * this.canvas.width;
                }
                this.ctx.globalAlpha = f.op;
                this.ctx.beginPath();
                this.ctx.arc(f.x, f.y, f.s, 0, Math.PI * 2);
                this.ctx.fill();
            });
            requestAnimationFrame(() => this.animate());
        }
    }

    function startTimer() {
        const t = document.createElement('div');
        t.id = 'brTimer';
        document.body.appendChild(t);

        function update() {
            const now = new Date();
            const nextYear = new Date(now.getFullYear() + 1, 0, 1);
            const diff = nextYear - now;

            if (diff < 0) {
                t.innerHTML = '🎄 ' + (now.getFullYear() + 1) + '!';
                return;
            }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff / 3600000) % 24);
            const m = Math.floor((diff / 60000) % 60);
            t.innerHTML = '❄️ ' + d + 'д ' + h + 'ч ' + m + 'м';
        }

        update();
        setInterval(update, 1000);
    }

    function addChristmasTree() {
        const scene = document.createElement('div');
        scene.className = 'scene-container';
        scene.innerHTML = `
            <div class="aurora-glow"></div>
            <div class="tree-wrapper">
                <div class="star-3d">
                    <div class="star-shape"></div>
                    <div class="star-core"></div>
                </div>
                <div class="layer layer-4"></div>
                <div class="layer layer-3"></div>
                <div class="layer layer-2"></div>
                <div class="layer layer-1"></div>
                <div class="trunk"></div>
                <div class="snow-base"></div>

                <!-- ORNAMENTS -->
                <div class="ornament red o1"></div>
                <div class="ornament gold o2"></div>
                <div class="ornament blue o3"></div>
                <div class="ornament red o4"></div>
                <div class="ornament gold o5"></div>
                <div class="ornament blue o6"></div>
                <div class="ornament red o7"></div>
            </div>
        `;
        document.body.appendChild(scene);
    }

    function init() {
        new SnowSystem().init();
        startTimer();
        addChristmasTree();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();