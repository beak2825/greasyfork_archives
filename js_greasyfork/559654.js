// ==UserScript==
// @name         Gambler9000 – Odds Modifier Cheat Menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Odds override, tabbed UI, custom slider, color themes, TAB hide, and submit button toggle
// @match        https://gambler9000.lovable.app/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559654/Gambler9000%20%E2%80%93%20Odds%20Modifier%20Cheat%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/559654/Gambler9000%20%E2%80%93%20Odds%20Modifier%20Cheat%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let MODE = 'ALWAYS_WIN';
    let WIN_PROBABILITY = 0.8;
    let SCRIPT_ENABLED = true;
    let BLOCK_LEADERBOARD = false;
    let UI_VISIBLE = true;
    let ACTIVE_TAB = 'MODIFIERS';
    let MENU_COLOR = 'Default';
    let RGB_INTERVAL = null;

    const originalRandom = Math.random;

    Math.random = function() {
        if (!SCRIPT_ENABLED) return originalRandom();

        if (MODE === 'ALWAYS_WIN') return 0.01;
        if (MODE === 'ALWAYS_LOSE') return 0.99;

        if (MODE === 'CUSTOM') {
            return (originalRandom() < WIN_PROBABILITY) ? 0.05 : 0.95;
        }

        return originalRandom();
    };

    function toggleSubmitButton() {
        const btn = document.querySelector(
            "button.flex-1.px-4.py-3.rounded-lg.font-display.font-semibold.uppercase.tracking-wider.bg-primary.text-primary-foreground"
        );

        if (!btn) return;

        btn.style.display = BLOCK_LEADERBOARD ? "none" : "";
    }

    const observer = new MutationObserver(toggleSubmitButton);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    function clearRgbInterval() {
        if (RGB_INTERVAL !== null) {
            clearInterval(RGB_INTERVAL);
            RGB_INTERVAL = null;
        }
    }

    function applyMenuColor() {
        const menu = document.getElementById("oddsMenu");
        if (!menu) return;

        clearRgbInterval();

        const colorMap = {
            Red: '#ff4d4f',
            Orange: '#fa8c16',
            Yellow: '#fadb14',
            Lime: '#a0d911',
            Green: '#52c41a',
            'Light Blue': '#40a9ff',
            Blue: '#1890ff',
            Purple: '#722ed1',
            Pink: '#eb2f96'
        };

        if (MENU_COLOR === 'Default') {
            menu.style.borderColor = '#444';
            menu.style.color = 'white';
            return;
        }

        // ✅ Smooth RGB mode
        if (MENU_COLOR === 'RGB') {
            let hue = 0;

            menu.style.transition = "border-color 0.3s linear, color 0.3s linear";

            RGB_INTERVAL = setInterval(() => {
                hue = (hue + 2) % 360;
                const c = `hsl(${hue}, 100%, 60%)`;
                menu.style.borderColor = c;
                menu.style.color = c;
            }, 30);

            return;
        }

        const chosen = colorMap[MENU_COLOR] || 'white';
        menu.style.borderColor = chosen;
        menu.style.color = chosen;
    }

    function setActiveTab(tab) {
        ACTIVE_TAB = tab;

        const tabs = {
            MODIFIERS: document.getElementById('tabModifiers'),
            VISUAL: document.getElementById('tabVisual'),
            MISC: document.getElementById('tabMisc')
        };

        const sections = {
            MODIFIERS: document.getElementById('sectionModifiers'),
            VISUAL: document.getElementById('sectionVisual'),
            MISC: document.getElementById('sectionMisc')
        };

        Object.keys(tabs).forEach(key => {
            tabs[key].style.background = (key === tab)
                ? 'rgba(255,255,255,0.15)'
                : 'transparent';
        });

        Object.keys(sections).forEach(key => {
            sections[key].style.display = (key === tab) ? 'block' : 'none';
        });
    }

    function createMenu() {
        const menu = document.createElement("div");
        menu.id = "oddsMenu";
        menu.style.position = "fixed";
        menu.style.top = "20px";
        menu.style.left = "20px";
        menu.style.padding = "12px";
        menu.style.background = "rgba(0,0,0,0.85)";
        menu.style.color = "white";
        menu.style.border = "1px solid #444";
        menu.style.borderRadius = "6px";
        menu.style.zIndex = "999999";
        menu.style.width = "220px";
        menu.style.cursor = "move";
        menu.style.userSelect = "none";
        menu.style.fontFamily = "Arial, sans-serif";

        menu.innerHTML = `
            <div style="font-weight:bold; margin-bottom:8px; text-align:center; width:100%;">Cheat Menu</div>

            <div style="display:flex; margin-bottom:8px; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.2);">
                <button id="tabModifiers" style="flex:1; border:none; background:transparent; color:inherit; padding:4px 0; font-size:12px; cursor:pointer;">Modifiers</button>
                <button id="tabVisual" style="flex:1; border:none; background:transparent; color:inherit; padding:4px 0; font-size:12px; cursor:pointer;">Visual</button>
                <button id="tabMisc" style="flex:1; border:none; background:transparent; color:inherit; padding:4px 0; font-size:12px; cursor:pointer;">Misc</button>
            </div>

            <div id="sectionModifiers">
                <div style="margin-bottom:10px; font-size:13px;">
                    <label>Script Enabled:</label><br>
                    <input type="checkbox" id="toggleScript" checked>
                    <span id="toggleLabel">ON</span>
                </div>

                <label style="font-size: 13px;">Mode:</label>
                <select id="oddsMode" style="width:100%; margin-top:4px; color:black;">
                    <option value="ALWAYS_WIN">Always Win</option>
                    <option value="ALWAYS_LOSE">Always Lose</option>
                    <option value="BIAS">Bias (80% win)</option>
                    <option value="CUSTOM">Custom (%)</option>
                </select>

                <div id="customSliderContainer" style="margin-top:10px; display:none;">
                    <label style="font-size:13px;">Win Chance: <span id="customValue">80</span>%</label>
                    <input type="range" id="customSlider" min="0" max="100" value="80" style="width:100%;">
                </div>
            </div>

            <div id="sectionVisual" style="display:none;">
                <div style="margin-top:4px; font-size:13px;">
                    <label>Menu Color:</label><br>
                    <select id="menuColor" style="width:100%; margin-top:4px; color:black;">
                        <option value="Default">Default</option>
                        <option value="Red">Red</option>
                        <option value="Orange">Orange</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Lime">Lime</option>
                        <option value="Green">Green</option>
                        <option value="Light Blue">Light Blue</option>
                        <option value="Blue">Blue</option>
                        <option value="Purple">Purple</option>
                        <option value="Pink">Pink</option>
                        <option value="RGB">RGB</option>
                    </select>
                </div>
            </div>

            <div id="sectionMisc" style="display:none;">
                <div style="margin-top:4px; font-size:13px;">
                    <label>Disable Leaderboards:</label><br>
                    <input type="checkbox" id="toggleLeaderboard">
                    <span id="leaderboardLabel">OFF</span>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        // Tab events
        document.getElementById('tabModifiers').addEventListener('click', () => setActiveTab('MODIFIERS'));
        document.getElementById('tabVisual').addEventListener('click', () => setActiveTab('VISUAL'));
        document.getElementById('tabMisc').addEventListener('click', () => setActiveTab('MISC'));
        setActiveTab(ACTIVE_TAB);

        // Modifiers: mode + slider
        const modeSelect = document.getElementById("oddsMode");
        const sliderContainer = document.getElementById("customSliderContainer");
        const slider = document.getElementById("customSlider");
        const sliderValue = document.getElementById("customValue");

        modeSelect.addEventListener("change", (e) => {
            MODE = e.target.value;
            sliderContainer.style.display = (MODE === "CUSTOM") ? "block" : "none";
        });

        slider.addEventListener("input", () => {
            sliderValue.textContent = slider.value;
            WIN_PROBABILITY = slider.value / 100;
        });

        // Script toggle
        const toggle = document.getElementById("toggleScript");
        const label = document.getElementById("toggleLabel");

        toggle.addEventListener("change", () => {
            SCRIPT_ENABLED = toggle.checked;
            label.textContent = SCRIPT_ENABLED ? "ON" : "OFF";
        });

        // Misc: leaderboard toggle
        const lbToggle = document.getElementById("toggleLeaderboard");
        const lbLabel = document.getElementById("leaderboardLabel");

        lbToggle.addEventListener("change", () => {
            BLOCK_LEADERBOARD = lbToggle.checked;
            lbLabel.textContent = BLOCK_LEADERBOARD ? "ON" : "OFF";
            toggleSubmitButton();
        });

        // Visual: menu color
        const colorSelect = document.getElementById("menuColor");
        colorSelect.addEventListener("change", (e) => {
            MENU_COLOR = e.target.value;
            applyMenuColor();
        });

        makeDraggable(menu);
        applyMenuColor();
    }

    function makeDraggable(el) {
        let offsetX = 0, offsetY = 0, isDown = false;

        el.addEventListener("mousedown", function(e) {
            const tag = e.target.tagName.toLowerCase();
            if (["select", "input", "option", "button", "label"].includes(tag)) return;

            isDown = true;
            offsetX = el.offsetLeft - e.clientX;
            offsetY = el.offsetTop - e.clientY;
        });

        document.addEventListener("mouseup", () => isDown = false);

        document.addEventListener("mousemove", function(e) {
            if (isDown) {
                el.style.left = (e.clientX + offsetX) + "px";
                el.style.top = (e.clientY + offsetY) + "px";
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            UI_VISIBLE = !UI_VISIBLE;
            const menu = document.getElementById("oddsMenu");
            if (menu) menu.style.display = UI_VISIBLE ? "block" : "none";
        }
    });

    window.addEventListener("DOMContentLoaded", () => {
        createMenu();
        toggleSubmitButton();
    });

})();
