// ==UserScript==
// @name         Roblox AltBot - Never Get Banned
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  AltBot Helper
// @author       YourName
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561932/Roblox%20AltBot%20-%20Never%20Get%20Banned.user.js
// @updateURL https://update.greasyfork.org/scripts/561932/Roblox%20AltBot%20-%20Never%20Get%20Banned.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes altBotSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .altbot-loader {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #ffffff;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            animation: altBotSpin 0.8s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        #altbot-btn:disabled {
            cursor: not-allowed;
            opacity: 0.8;
            background: #222 !important;
        }
    `;
    document.head.appendChild(style);

    function injectAltButton() {
        const robloxPlayButton = document.querySelector('[data-testid="play-button"]');

        if (robloxPlayButton && !document.getElementById('altbot-btn')) {
            const gameId = window.location.pathname.split('/')[2];

            const altBtn = document.createElement('button');
            altBtn.id = 'altbot-btn';
            altBtn.type = 'button';
            altBtn.innerHTML = 'LAUNCH WITH ALTBOT';

            altBtn.style.cssText = `
                display: flex !important;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 54px;
                margin-top: 12px;
                background: #000000;
                color: #ffffff;
                border: 1px solid #333;
                border-radius: 10px;
                font-family: "Gotham SSm", sans-serif;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 1.2px;
                cursor: pointer;
                z-index: 999999;
                position: relative;
                transition: all 0.2s ease;
                text-transform: uppercase;
            `;

            altBtn.onmouseenter = () => { altBtn.style.background = '#1a1a1a'; altBtn.style.borderColor = '#555'; };
            altBtn.onmouseleave = () => { altBtn.style.background = '#000'; altBtn.style.borderColor = '#333'; };

            altBtn.onclick = (e) => {
                e.preventDefault();

                altBtn.disabled = true;
                altBtn.innerHTML = '<div class="altbot-loader"></div> LAUNCHING...';

                window.location.href = `altbot://${gameId}`;

                setTimeout(() => {
                    altBtn.disabled = false;
                    altBtn.innerHTML = 'LAUNCH WITH ALTBOT';
                }, 3000);
            };

            const container = robloxPlayButton.parentElement;
            if (container) {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.overflow = 'visible';
                robloxPlayButton.style.width = '100%';
                robloxPlayButton.after(altBtn);
            }
        }
    }

    setInterval(injectAltButton, 1000);
})();