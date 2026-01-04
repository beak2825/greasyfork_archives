// ==UserScript==
// @name         GeoGuessr Summary Link Glow
// @name:ja      GeoGuessr Summary Link Glow
// @namespace    https://greasyfork.org/ja/users/1492018-sino87
// @version      1.10
// @description  Add cyan glow effect to game result links on GeoGuessr activities page
// @description:ja GeoGuessrのアクティビティページにあるゲームリザルトリンクの視認性を上げるために、水色のグローを追加するユーザースクリプトです
// @author       sino
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552188/GeoGuessr%20Summary%20Link%20Glow.user.js
// @updateURL https://update.greasyfork.org/scripts/552188/GeoGuessr%20Summary%20Link%20Glow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COLOR_STORAGE_KEY = 'glow_color';
    let glowColor = GM_getValue(COLOR_STORAGE_KEY, '#00ffff');

    function updateGlowColor(color) {
        glowColor = color;
        document.documentElement.style.setProperty('--glow-color', color);
        GM_setValue(COLOR_STORAGE_KEY, color);
    }

    function addGlowStyle() {
        if (document.getElementById('game-link-glow-style')) return;

        // Set initial color
        document.documentElement.style.setProperty('--glow-color', glowColor);

        const style = document.createElement('style');
        style.id = 'game-link-glow-style';
        style.textContent = `
            .game-link-glow {
                text-shadow: 0 0 15px var(--glow-color) !important;
                color: var(--glow-color) !important;
                transition: text-shadow 0.3s ease;
            }
            .game-link-glow:hover {
                text-shadow: 0 0 7.5px var(--glow-color),
                             0 0 15px var(--glow-color),
                             0 0 22.5px var(--glow-color) !important;
            }
            a.next-link_anchor__CQUJ3 {
                overflow: visible !important;
            }
            a.next-link_anchor__CQUJ3[href*="/challenge/"] {
                overflow: visible !important;
            }
            a.next-link_anchor__CQUJ3[href*="/challenge/"]::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                pointer-events: none;
            }
            a.next-link_anchor__CQUJ3[href*="/results/"] {
                overflow: visible !important;
            }
            a.next-link_anchor__CQUJ3[href*="/results/"]::before {
                content: '';
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    function openColorPicker() {
        if (document.getElementById('glow-color-picker-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'glow-color-picker-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            background: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            color: white;
            font-family: 'Neo Sans', sans-serif;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Glow Color Settings';
        title.style.margin = '0 0 15px 0';

        const inputContainer = document.createElement('div');
        inputContainer.style.marginBottom = '15px';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = glowColor;
        colorInput.style.cssText = `
            width: 50px;
            height: 50px;
            cursor: pointer;
            border: none;
            background: none;
        `;

        colorInput.addEventListener('input', (e) => {
            updateGlowColor(e.target.value);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 8px 16px;
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        closeButton.onclick = () => overlay.remove();

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Default';
        resetButton.style.cssText = `
            padding: 8px 16px;
            background: #00ffff;
            color: black;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        resetButton.onclick = () => {
            updateGlowColor('#00ffff');
            colorInput.value = '#00ffff';
        };

        inputContainer.appendChild(colorInput);
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(closeButton);
        container.appendChild(title);
        container.appendChild(inputContainer);
        container.appendChild(buttonContainer);
        overlay.appendChild(container);

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    }

    GM_registerMenuCommand('Change Glow Color 🎨', openColorPicker);

    function applyGlowToGameLinks() {
        if (!window.location.pathname.includes('/activities')) return;

        const links = document.querySelectorAll('a.next-link_anchor__CQUJ3');
        links.forEach(link => {
            const href = link.href;
            let shouldGlow = false;

            // Multiplayer games (Duels, Battle Royale, Team Duels)
            if (href.includes('/summary')) {
                shouldGlow = true;
            }

            // Single player games (Standard, Streaks)
            if (href.includes('/results/')) {
                shouldGlow = true;
            }

            // Challenges
            if (href.includes('/challenge/')) {
                shouldGlow = true;
            }

            if (shouldGlow) {
                link.classList.add('game-link-glow');

                let parent = link.parentElement;
                while (parent && parent !== document.body) {
                    const overflow = window.getComputedStyle(parent).overflow;
                    if (overflow === 'hidden' || overflow === 'clip') {
                        parent.style.overflow = 'visible';
                    }
                    parent = parent.parentElement;
                }
            }
        });
    }

    let currentUrl = window.location.href;

    function checkUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            setTimeout(() => {
                applyGlowToGameLinks();
            }, 500);
        }
    }

    addGlowStyle();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyGlowToGameLinks);
    } else {
        applyGlowToGameLinks();
    }

    const observer = new MutationObserver(() => {
        applyGlowToGameLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(checkUrlChange, 500);
})();
