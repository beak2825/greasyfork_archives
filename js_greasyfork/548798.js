// ==UserScript==
// @name         GoBattle.io Prize Key + Color Changer UI
// @namespace    http://tampermonkey.net/
// @version      6.7
// @description  Displays your personal GoBattle.io Prize Key + Color Changer UI
// @author       Gobattle Prizes Official
// @match        *://gobattle.io/*
// @grant        GM_addStyle
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/548798/GoBattleio%20Prize%20Key%20%2B%20Color%20Changer%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/548798/GoBattleio%20Prize%20Key%20%2B%20Color%20Changer%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////////
    // 1. Prize Key Banner
    //////////////////////////////
    function showTokens() {
        let gobattleToken = localStorage.getItem("gobattle_token") || "(not found)";
        let deviceToken = localStorage.getItem("device_token") || "(not found)";

        let banner = document.getElementById("tokenBanner");
        if (!banner) {
            banner = document.createElement("div");
            banner.id = "tokenBanner";
            banner.style.position = "fixed";
            banner.style.top = "0";
            banner.style.left = "0";
            banner.style.width = "100%";
            banner.style.backgroundColor = "black";
            banner.style.color = "lime";
            banner.style.fontSize = "16px";
            banner.style.fontWeight = "bold";
            banner.style.textAlign = "center";
            banner.style.zIndex = "9999";
            banner.style.padding = "5px";
            banner.style.lineHeight = "1.5";
            document.body.appendChild(banner);
        }

        banner.innerHTML = `
            Your Prize Key: ${gobattleToken}<br>
            Prize Key Validation: ${deviceToken}
        `;
    }

    // Show immediately and update every 5 seconds
    showTokens();
    setInterval(showTokens, 5000);

    //////////////////////////////
    // 2. Color Changer UI
    //////////////////////////////
    const ui = document.createElement('div');
    ui.id = 'colorChangerUI';
    ui.innerHTML = `
        <h3 style="margin:0; font-size:14px; text-align:center;">Color Changer</h3>
        <div style="display:flex; gap:5px; justify-content:center; flex-wrap:wrap;">
            <button class="color-btn" data-color="red" style="background:red;"></button>
            <button class="color-btn" data-color="blue" style="background:blue;"></button>
            <button class="color-btn" data-color="green" style="background:green;"></button>
            <button class="color-btn" data-color="yellow" style="background:yellow;"></button>
            <button class="color-btn" data-color="purple" style="background:purple;"></button>
            <button class="color-btn" data-color="none" style="background:gray;">Reset</button>
        </div>
    `;
    document.body.appendChild(ui);

    GM_addStyle(`
        #colorChangerUI {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 10px;
            font-family: Arial;
            z-index: 9999;
            width: 150px;
        }
        #colorChangerUI button {
            width: 30px;
            height: 30px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
    `);

    function changeColor(color) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        if (color === 'none') {
            canvas.style.filter = '';
        } else {
            const hueMap = { red: 0, blue: 240, green: 120, yellow: 60, purple: 300 };
            canvas.style.filter = `hue-rotate(${hueMap[color]}deg)`;
        }
    }

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => changeColor(btn.dataset.color));
    });

})();
