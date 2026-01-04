// ==UserScript==
// @name         Emo Roblox - Elegant Edition
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Stylish emo theme with refined aesthetics
// @author       clownz
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561035/Emo%20Roblox%20-%20Elegant%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/561035/Emo%20Roblox%20-%20Elegant%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --emo-pink: #ff66cc;
                --emo-purple: #cc66ff;
                --emo-blue: #66ccff;
                --emo-dark: #0f0c29;
                --emo-card: #1a1a2e;
                --emo-accent: #00ffcc;
                --snoopy-brown: #8B4513;
                --snoopy-red: #FF4444;
                --text-primary: #f0f0f0;
                --text-secondary: #b0b0b0;
            }
            * {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            body {
                background: linear-gradient(135deg, #0f0c29, #1a1a2e, #16213e) !important;
                background-attachment: fixed !important;
                color: var(--text-primary) !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            .rbx-navbar, header, nav {
                background: rgba(15, 12, 41, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                border-bottom: 1px solid rgba(255, 102, 204, 0.2) !important;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3) !important;
            }
            .game-card, .game-tile {
                background: rgba(26, 26, 46, 0.85) !important;
                backdrop-filter: blur(15px) !important;
                border-radius: 16px !important;
                border: 1px solid rgba(255, 102, 204, 0.15) !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
                overflow: hidden !important;
            }

            .game-card:hover, .game-tile:hover {
                transform: translateY(-4px) scale(1.01) !important;
                border-color: rgba(255, 102, 204, 0.4) !important;
                box-shadow: 0 8px 32px rgba(255, 102, 204, 0.15) !important;
            }
            .btn, .btn-primary, .btn-secondary, button:not([class*="icon"]) {
                background: linear-gradient(145deg, rgba(255, 102, 204, 0.9), rgba(204, 102, 255, 0.9)) !important;
                color: white !important;
                border-radius: 12px !important;
                border: none !important;
                padding: 8px 16px !important;
                font-weight: 500 !important;
                letter-spacing: 0.3px !important;
                font-size: 14px !important;
                height: auto !important;
                min-height: 36px !important;
                box-shadow: 0 2px 8px rgba(255, 102, 204, 0.2) !important;
                transition: all 0.2s ease !important;
            }
            .btn-sm, button[class*="small"] {
                padding: 6px 12px !important;
                font-size: 13px !important;
                border-radius: 10px !important;
                min-height: 32px !important;
            }
            .btn-lg, button[class*="large"] {
                padding: 10px 20px !important;
                font-size: 15px !important;
                border-radius: 14px !important;
                min-height: 40px !important;
            }

            .btn:hover, .btn-primary:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 16px rgba(255, 102, 204, 0.3) !important;
            }

            .btn:active, .btn-primary:active {
                transform: translateY(0) !important;
                box-shadow: 0 2px 8px rgba(255, 102, 204, 0.2) !important;
            }
            .btn-secondary {
                background: linear-gradient(145deg, rgba(102, 204, 255, 0.9), rgba(102, 153, 255, 0.9)) !important;
                box-shadow: 0 2px 8px rgba(102, 204, 255, 0.2) !important;
            }

            .btn-secondary:hover {
                box-shadow: 0 4px 16px rgba(102, 204, 255, 0.3) !important;
            }
            .avatar-card, .player-card {
                background: rgba(26, 26, 46, 0.9) !important;
                border-radius: 12px !important;
                border: 1px solid rgba(102, 204, 255, 0.2) !important;
                padding: 12px !important;
                backdrop-filter: blur(10px) !important;
            }

            .avatar-card:hover, .player-card:hover {
                border-color: rgba(102, 204, 255, 0.4) !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 6px 20px rgba(102, 204, 255, 0.15) !important;
            }
            .left-col, .sidebar, [class*="side"] {
                background: rgba(15, 12, 41, 0.9) !important;
                backdrop-filter: blur(15px) !important;
                border-right: 1px solid rgba(255, 102, 204, 0.1) !important;
            }
            input, textarea, select {
                background: rgba(26, 26, 46, 0.9) !important;
                border: 1px solid rgba(255, 102, 204, 0.2) !important;
                border-radius: 10px !important;
                color: white !important;
                padding: 10px 14px !important;
                font-size: 14px !important;
            }

            input:focus, textarea:focus {
                border-color: rgba(255, 102, 204, 0.5) !important;
                box-shadow: 0 0 0 2px rgba(255, 102, 204, 0.1) !important;
                outline: none !important;
            }
            ::-webkit-scrollbar {
                width: 10px !important;
                background: transparent !important;
            }

            ::-webkit-scrollbar-track {
                background: rgba(26, 26, 46, 0.5) !important;
                border-radius: 8px !important;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, rgba(255, 102, 204, 0.6), rgba(204, 102, 255, 0.6)) !important;
                border-radius: 8px !important;
                border: 2px solid transparent !important;
                background-clip: padding-box !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, rgba(255, 102, 204, 0.8), rgba(204, 102, 255, 0.8)) !important;
            }
            * {
                cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ff66cc;stop-opacity:0.8"/><stop offset="100%" style="stop-color:%23cc66ff;stop-opacity:0.8"/></linearGradient></defs><circle cx="12" cy="12" r="10" fill="url(%23pinkGrad)" opacity="0.9"/><circle cx="12" cy="12" r="6" fill="none" stroke="white" stroke-width="1" opacity="0.7"/></svg>') 12 12, auto !important;
            }

            a:hover, button:hover, [role="button"]:hover {
                cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="%23ff66cc" opacity="0.9"/><circle cx="14" cy="14" r="8" fill="none" stroke="white" stroke-width="1.5"/></svg>') 14 14, pointer !important;
            }
            .snoopy-corner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9999;
                pointer-events: none;
                font-size: 20px;
                opacity: 0.7;
                animation: snoopyFloat 4s ease-in-out infinite;
            }

            @keyframes snoopyFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(5deg); }
            }
            .glow-text {
                text-shadow: 0 0 8px rgba(255, 102, 204, 0.3) !important;
            }
            .modal, .dialog, .popup {
                background: rgba(15, 12, 41, 0.98) !important;
                backdrop-filter: blur(25px) !important;
                border-radius: 20px !important;
                border: 1px solid rgba(255, 102, 204, 0.2) !important;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4) !important;
            }
            [class*="icon"], [class*="badge"] {
                transition: transform 0.2s ease !important;
            }

            [class*="icon"]:hover, [class*="badge"]:hover {
                transform: scale(1.1) !important;
            }
            footer {
                background: rgba(15, 12, 41, 0.95) !important;
                border-top: 1px solid rgba(255, 102, 204, 0.15) !important;
                backdrop-filter: blur(15px) !important;
            }
            h1, h2, h3, h4, h5, h6 {
                color: var(--text-primary) !important;
                font-weight: 600 !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
            }

            p, span, div:not([class]) {
                color: var(--text-secondary) !important;
                line-height: 1.6 !important;
            }
            .game-card-title, .item-name, .text-title {
                color: var(--text-primary) !important;
                font-weight: 600 !important;
                font-size: 16px !important;
            }
            li, .list-item {
                background: rgba(26, 26, 46, 0.5) !important;
                border-radius: 8px !important;
                margin: 4px 0 !important;
                padding: 8px 12px !important;
                border: 1px solid transparent !important;
            }

            li:hover, .list-item:hover {
                background: rgba(26, 26, 46, 0.8) !important;
                border-color: rgba(255, 102, 204, 0.2) !important;
            }
            progress, [class*="progress"] {
                background: rgba(26, 26, 46, 0.8) !important;
                border-radius: 10px !important;
                height: 8px !important;
                border: none !important;
            }

            progress::-webkit-progress-bar {
                background: rgba(26, 26, 46, 0.8) !important;
                border-radius: 10px !important;
            }

            progress::-webkit-progress-value {
                background: linear-gradient(90deg, var(--emo-pink), var(--emo-purple)) !important;
                border-radius: 10px !important;
            }
            #emo-watermark {
                background: rgba(15, 12, 41, 0.9);
                backdrop-filter: blur(10px);
                color: rgba(255, 102, 204, 0.8);
                border: 1px solid rgba(255, 102, 204, 0.15);
                font-size: 13px;
            }
            @media (max-width: 768px) {
                .game-card, .game-tile {
                    margin-bottom: 12px !important;
                }

                .btn, .btn-primary {
                    padding: 6px 14px !important;
                    font-size: 13px !important;
                    min-height: 34px !important;
                }

                .snoopy-corner {
                    font-size: 16px;
                    bottom: 15px;
                    left: 15px;
                }
            }
            .dark-card, [class*="dark"], [class*="night"] {
                background: rgba(10, 8, 29, 0.95) !important;
            }
            [class*="loading"], [class*="spinner"] {
                border: 3px solid rgba(26, 26, 46, 0.3) !important;
                border-top: 3px solid var(--emo-pink) !important;
                border-radius: 50% !important;
                animation: spin 1s linear infinite !important;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            [title], [data-tooltip] {
                position: relative !important;
            }

            [title]:hover::after, [data-tooltip]:hover::after {
                content: attr(title);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 12, 41, 0.95);
                color: white;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                border: 1px solid rgba(255, 102, 204, 0.2);
                backdrop-filter: blur(10px);
            }
            :focus-visible {
                outline: 2px solid rgba(255, 102, 204, 0.5) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
        function addSnoopyDecorations() {
            const snoopyCorner = document.createElement('div');
            snoopyCorner.className = 'snoopy-corner';
            snoopyCorner.innerHTML = '🐶';
            snoopyCorner.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                font-size: 24px;
                opacity: 0.6;
                z-index: 9999;
                pointer-events: none;
                filter: drop-shadow(0 0 8px rgba(255, 102, 204, 0.3));
                transition: opacity 0.3s;
            `;

            snoopyCorner.addEventListener('mouseenter', () => {
                snoopyCorner.style.opacity = '0.9';
            });

            snoopyCorner.addEventListener('mouseleave', () => {
                snoopyCorner.style.opacity = '0.6';
            });

            document.body.appendChild(snoopyCorner);
        }
        function addWatermark() {
            if (document.getElementById('emo-watermark')) return;

            const watermark = document.createElement('div');
            watermark.id = 'emo-watermark';
            watermark.innerHTML = `
                <span style="margin-right: 6px; opacity: 0.8;">✨</span>
                <span style="font-family: -apple-system, sans-serif; font-weight: 500;">Emo Snoopy Theme By Clownz For my GF Kayley</span>
                <span style="margin-left: 6px; opacity: 0.6; font-size: 11px;">v3.1</span>
            `;

            watermark.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(15, 12, 41, 0.9);
                backdrop-filter: blur(10px);
                color: rgba(255, 102, 204, 0.8);
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid rgba(255, 102, 204, 0.15);
                font-size: 13px;
                font-weight: 500;
                z-index: 9998;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s ease;
                user-select: none;
            `;

            watermark.addEventListener('mouseenter', () => {
                watermark.style.transform = 'translateX(-4px)';
                watermark.style.background = 'rgba(26, 26, 46, 0.95)';
                watermark.style.borderColor = 'rgba(255, 102, 204, 0.3)';
                watermark.style.boxShadow = '0 4px 20px rgba(255, 102, 204, 0.1)';
            });

            watermark.addEventListener('mouseleave', () => {
                watermark.style.transform = 'translateX(0)';
                watermark.style.background = 'rgba(15, 12, 41, 0.9)';
                watermark.style.borderColor = 'rgba(255, 102, 204, 0.15)';
                watermark.style.boxShadow = 'none';
            });

            document.body.appendChild(watermark);
        }
        function addHoverEffects() {
            const hoverStyle = document.createElement('style');
            hoverStyle.textContent = `
                .hover-lift {
                    transition: transform 0.2s ease !important;
                }

                .hover-lift:hover {
                    transform: translateY(-2px) !important;
                }

                .hover-glow {
                    transition: box-shadow 0.2s ease !important;
                }

                .hover-glow:hover {
                    box-shadow: 0 4px 16px rgba(255, 102, 204, 0.15) !important;
                }
            `;
            document.head.appendChild(hoverStyle);
            const interactiveElements = [
                '.game-card', '.avatar-card', '.btn',
                '.list-item', '.player-card'
            ];

            interactiveElements.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.classList.add('hover-lift', 'hover-glow');
                });
            });
        }
        addSnoopyDecorations();
        addWatermark();
        addHoverEffects();
        const observer = new MutationObserver(() => {
            addHoverEffects();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }, 1000);

})();