// ==UserScript==
// @name         Swift Client Style for bloxd.io (with Menu)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Swift-style UI + centered frosted-glass menu (Right Shift) for bloxd.io
// @author       Swift, Blueify, NotNightmare
// @match        https://bloxd.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561030/Swift%20Client%20Style%20for%20bloxdio%20%28with%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561030/Swift%20Client%20Style%20for%20bloxdio%20%28with%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // Small helper: wait for selector
    // -------------------------------
    function waitFor(selector, cb) {
        const el = document.querySelector(selector);
        if (el) return cb(el);
        const obs = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                cb(el);
            }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // -------------------------------
    // GLOBAL STYLES (MENU + TOGGLES)
    // -------------------------------
    (function injectGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Overlay background */
            #swift-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.35);
                backdrop-filter: blur(3px);
                -webkit-backdrop-filter: blur(3px);
                z-index: 99998;
                display: none;
            }

            /* Main menu panel */
            #swift-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 600px;
                height: 420px;
                background: rgba(10, 10, 20, 0.72);
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                color: #fff;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                display: none;
                z-index: 99999;
                overflow: hidden;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.08);
                opacity: 0;
                transition:
                    opacity 0.18s ease-out,
                    transform 0.18s ease-out;
            }

            #swift-menu.swift-open {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }

            /* Layout */
            #swift-menu-inner {
                display: flex;
                width: 100%;
                height: 100%;
            }

            /* Tabs column */
            #swift-tabs {
                width: 160px;
                border-right: 1px solid rgba(255,255,255,0.08);
                padding: 14px 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .swift-tab {
                padding: 8px 10px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                color: #d4d4d4;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: background 0.1s, color 0.1s, transform 0.08s;
            }

            .swift-tab span {
                pointer-events: none;
            }

            .swift-tab:hover {
                background: rgba(255,255,255,0.05);
                color: #ffffff;
                transform: translateY(-1px);
            }

            .swift-tab.swift-active {
                background: linear-gradient(135deg, #ff4b4b, #ffb347);
                color: #111;
                font-weight: 600;
            }

            /* Content area */
            #swift-content {
                flex: 1;
                padding: 16px 18px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .swift-content-page {
                display: none;
                flex: 1;
                overflow: auto;
            }
            .swift-content-page.swift-active {
                display: block;
            }

            .swift-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .swift-subtitle {
                font-size: 13px;
                opacity: 0.75;
                margin-bottom: 10px;
            }

            .swift-section {
                margin-top: 8px;
                padding: 8px 10px;
                border-radius: 10px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.06);
            }

            .swift-section-title {
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 6px;
                opacity: 0.85;
            }

            /* Toggle */
            .swift-toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 4px 0;
                font-size: 13px;
            }

            .swift-toggle-label {
                margin-right: 10px;
                opacity: 0.9;
            }

            .swift-switch {
                position: relative;
                width: 42px;
                height: 22px;
            }

            .swift-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .swift-slider {
                position: absolute;
                cursor: pointer;
                inset: 0;
                background-color: rgba(255,255,255,0.13);
                transition: .2s;
                border-radius: 999px;
            }

            .swift-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 3px;
                top: 3px;
                background-color: white;
                transition: .2s;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.4);
            }

            .swift-switch input:checked + .swift-slider {
                background: linear-gradient(135deg, #ff4b4b, #ffb347);
            }

            .swift-switch input:checked + .swift-slider:before {
                transform: translateX(18px);
            }

            /* Slider control */
            .swift-slider-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 4px 0;
                font-size: 13px;
            }

            .swift-slider-row input[type="range"] {
                width: 150px;
                accent-color: #ff6a4b;
            }

            .swift-slider-value {
                min-width: 28px;
                text-align: right;
                opacity: 0.8;
            }

            /* Close hint */
            #swift-footer {
                font-size: 11px;
                opacity: 0.6;
                text-align: right;
                margin-top: 6px;
            }
        `;
        document.head.appendChild(style);
    })();

    // -------------------------------
    // SWIFT MENU UI
    // -------------------------------
    function createSwiftMenu() {
        if (document.getElementById('swift-menu')) return;

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'swift-overlay';

        // Menu
        const menu = document.createElement('div');
        menu.id = 'swift-menu';

        menu.innerHTML = `
            <div id="swift-menu-inner">
                <div id="swift-tabs">
                    <div class="swift-tab swift-active" data-tab="home"><span>Home</span></div>
                    <div class="swift-tab" data-tab="crosshair"><span>Crosshair</span></div>
                    <div class="swift-tab" data-tab="cosmetics"><span>Cosmetics</span></div>
                    <div class="swift-tab" data-tab="hotbar"><span>Hotbar</span></div>
                    <div class="swift-tab" data-tab="settings"><span>Settings</span></div>
                </div>
                <div id="swift-content">
                    <div id="swift-page-home" class="swift-content-page swift-active">
                        <div class="swift-title">Swift Client</div>
                        <div class="swift-subtitle">Styled UI for bloxd.io • Right Shift to toggle menu</div>

                        <div class="swift-section">
                            <div class="swift-section-title">Info</div>
                            <div style="font-size:13px; opacity:0.9;">
                                Version: <span style="color:#ffb347;">1.0</span><br>
                                Build: <span style="opacity:0.8;">Swift / NotNightmare edit</span><br>
                                Menu: <span style="opacity:0.8;">Centered • Frosted Glass • Tabs</span>
                            </div>
                        </div>

                        <div class="swift-section" style="margin-top:10px;">
                            <div class="swift-section-title">Quick Toggles (visual only placeholders)</div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Custom title & background</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Game icons retexture</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">In‑game hotbar styling</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div id="swift-page-crosshair" class="swift-content-page">
                        <div class="swift-title">Crosshair</div>
                        <div class="swift-subtitle">These controls are visual placeholders for now.</div>

                        <div class="swift-section">
                            <div class="swift-section-title">Size</div>
                            <div class="swift-slider-row">
                                <span>Crosshair size</span>
                                <input id="swift-crosshair-size-slider" type="range" min="10" max="60" value="30">
                                <span id="swift-crosshair-size-value" class="swift-slider-value">30</span>
                            </div>
                        </div>

                        <div class="swift-section" style="margin-top:10px;">
                            <div class="swift-section-title">Effects</div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Pulse on hit</span>
                                <label class="swift-switch">
                                    <input type="checkbox" disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Breathing animation</span>
                                <label class="swift-switch">
                                    <input type="checkbox" disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div id="swift-page-cosmetics" class="swift-content-page">
                        <div class="swift-title">Cosmetics</div>
                        <div class="swift-subtitle">Swift background and game card visuals are applied automatically.</div>

                        <div class="swift-section">
                            <div class="swift-section-title">Main menu cosmetics</div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Swift background image</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Custom game icons</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div id="swift-page-hotbar" class="swift-content-page">
                        <div class="swift-title">Hotbar</div>
                        <div class="swift-subtitle">Swift-styled hotbar applies in game automatically.</div>

                        <div class="swift-section">
                            <div class="swift-section-title">Theme</div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Swift red hotbar</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Gold selected slot</span>
                                <label class="swift-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div id="swift-page-settings" class="swift-content-page">
                        <div class="swift-title">Settings</div>
                        <div class="swift-subtitle">Basic menu behavior settings.</div>

                        <div class="swift-section">
                            <div class="swift-section-title">Menu</div>
                            <div class="swift-toggle-row">
                                <span class="swift-toggle-label">Close when clicking overlay</span>
                                <label class="swift-switch">
                                    <input id="swift-close-on-overlay" type="checkbox" checked>
                                    <span class="swift-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div id="swift-footer">
                        Press <b>Right Shift</b> to toggle this menu
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(menu);

        // Tab logic
        const tabs = menu.querySelectorAll('.swift-tab');
        const pages = {
            home: menu.querySelector('#swift-page-home'),
            crosshair: menu.querySelector('#swift-page-crosshair'),
            cosmetics: menu.querySelector('#swift-page-cosmetics'),
            hotbar: menu.querySelector('#swift-page-hotbar'),
            settings: menu.querySelector('#swift-page-settings')
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('swift-active'));
                Object.values(pages).forEach(p => p.classList.remove('swift-active'));
                tab.classList.add('swift-active');
                if (pages[target]) pages[target].classList.add('swift-active');
            });
        });

        // Crosshair size display (placeholder)
        const sizeSlider = menu.querySelector('#swift-crosshair-size-slider');
        const sizeValue = menu.querySelector('#swift-crosshair-size-value');
        if (sizeSlider && sizeValue) {
            sizeSlider.addEventListener('input', () => {
                sizeValue.textContent = sizeSlider.value;
                // Hook into actual crosshair logic later if you want
            });
        }

        // Overlay close behavior
        const closeOnOverlayCheckbox = menu.querySelector('#swift-close-on-overlay');
        overlay.addEventListener('click', () => {
            if (!closeOnOverlayCheckbox || closeOnOverlayCheckbox.checked) {
                toggleMenu(false);
            }
        });

        let isOpen = false;

        function toggleMenu(force) {
            const open = typeof force === 'boolean' ? force : !isOpen;
            isOpen = open;
            if (open) {
                overlay.style.display = 'block';
                menu.style.display = 'block';
                // allow transition
                requestAnimationFrame(() => {
                    menu.classList.add('swift-open');
                });
            } else {
                menu.classList.remove('swift-open');
                setTimeout(() => {
                    if (!isOpen) {
                        overlay.style.display = 'none';
                        menu.style.display = 'none';
                    }
                }, 180);
            }
        }

        // Keybind: Right Shift
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ShiftRight') {
                toggleMenu();
            }
        });
    }

    waitFor('body', createSwiftMenu);

    // -------------------------------
    // SWIFT TITLE + BACKGROUND
    // -------------------------------
    waitFor('.Title.FullyFancyText', (maintext) => {
        document.title = "Swift Client";

        maintext.textContent = "Swift Client";
        maintext.style.fontFamily = "Reglisse-Fill, serif";
        maintext.style.textShadow = "none";
        maintext.style.webkitTextStroke = "none";

        const bg = document.querySelector(".Background");
        if (bg) bg.src = "https://i.imgur.com/Vg1T5ap.png";
    });

    // -------------------------------
    // GAME LIST ICONS + NAMES
    // -------------------------------
    waitFor('.AvailableGame', () => {
        const names = document.getElementsByClassName("AvailableGameText");
        const imgs = document.getElementsByClassName("AvailableGameImg");
        const items = document.getElementsByClassName("AvailableGame");

        const edits = [
            ["Survival", "https://i.imgur.com/G9bUnQO.png"],
            ["Peaceful", "https://i.imgur.com/xC9jltf.png"],
            ["Creative", "https://i.imgur.com/BQEsCog.png"],
            ["Bedwars Squads", "https://i.imgur.com/TaF7UmB.png"],
            ["Bedwars Duos", "https://i.imgur.com/QqM1WwQ.png"],
            ["Skywars", "https://i.imgur.com/1EvgKmL.png"],
            ["Oneblock", "https://i.imgur.com/aXstUVN.png"],
            ["Greenville", "https://i.imgur.com/YQsbnFc.png"],
            ["Lego Fortnite", "https://i.imgur.com/heFKXJ6.png"],
            ["Eviltower", "https://i.imgur.com/Gpm1cvW.png"],
            ["Doodlecube", "https://i.imgur.com/hjUAKVI.png"],
            ["BloxdHop", "https://i.imgur.com/MPRY80l.png"],
            ["Hide & Seek", "https://i.imgur.com/UXVWqA5.png"],
            ["", ""],
            ["Plots (superflat)", "https://i.imgur.com/mMwt42i.png"],
            ["", ""],
            ["Worlds", "https://i.imgur.com/TWCWlyP.png"]
        ];

        for (let i = 0; i < edits.length; i++) {
            if (!names[i] || !imgs[i]) continue;
            if (edits[i][0]) names[i].textContent = edits[i][0];
            names[i].style.textShadow = "none";
            if (edits[i][1]) imgs[i].src = edits[i][1];
        }

        for (let i = 0; i < items.length; i++) {
            items[i].style.border = "none";
            items[i].style.boxShadow = "0px 10px 20px rgba(0,0,0,0.3)";
        }
    });

    // -------------------------------
    // CROSSHAIR (basic Swift style)
    // -------------------------------
    function applyCrosshair() {
        const ch = document.querySelector(".CrossHair");
        if (!ch) return;
        ch.textContent = "⨀";
        ch.style.width = "30px";
        ch.style.height = "30px";
        ch.style.display = "flex";
        ch.style.alignItems = "center";
        ch.style.justifyContent = "center";
        ch.style.fontSize = "24px";
    }
    setInterval(applyCrosshair, 500);

    // -------------------------------
    // REMOVE SIMPLE ADS / FOOTERS
    // -------------------------------
    function removeAds() {
        const selectors = [
            '.partnersAndCredits',
            '.SmallTextLight',
            '.AdContainer'
        ];
        selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.remove();
        });
    }
    setInterval(removeAds, 1000);

    // -------------------------------
    // FLOATING "Swift Network" BADGE
    // -------------------------------
    waitFor('body', () => {
        if (document.getElementById('swift-badge')) return;
        const badge = document.createElement('div');
        badge.id = 'swift-badge';
        badge.textContent = "Swift Network";
        badge.style.position = "fixed";
        badge.style.top = "85%";
        badge.style.left = "50%";
        badge.style.transform = "translateX(-50%)";
        badge.style.color = "#fff";
        badge.style.fontSize = "18px";
        badge.style.fontWeight = "bold";
        badge.style.padding = "10px 20px";
        badge.style.borderRadius = "25px";
        badge.style.background = "rgba(0,0,0,0.4)";
        badge.style.zIndex = "9999";
        badge.style.cursor = "default";
        badge.style.boxShadow =
            "rgba(0, 0, 0, 0.25) 0px 54px 55px," +
            "rgba(0, 0, 0, 0.12) 0px -12px 30px," +
            "rgba(0, 0, 0, 0.12) 0px 4px 6px," +
            "rgba(0, 0, 0, 0.17) 0px 12px 13px," +
            "rgba(0, 0, 0, 0.09) 0px -3px 5px";
        document.body.appendChild(badge);
    });

    // -------------------------------
    // HOTBAR STYLING (IN‑GAME)
    // -------------------------------
    setInterval(() => {
        const hotbars = document.querySelectorAll(".item");
        const selected = document.querySelectorAll(".SelectedItem");

        hotbars.forEach(h => {
            h.style.borderRadius = "8px";
            h.style.borderColor = "#303a5900";
            h.style.backgroundColor = "#D13D2E";
            h.style.boxShadow =
                "inset -2px -2px 10px rgb(133,0,0), inset 0.3px 0.3px 5px white";
        });

        selected.forEach(s => {
            s.style.backgroundColor = "#c9991c";
            s.style.boxShadow =
                "inset -2px -2px 10px rgb(210,183,45), inset 0.3px 0.3px 5px white";
            s.style.borderColor = "#b88c1a";
        });
    }, 80);

})();
