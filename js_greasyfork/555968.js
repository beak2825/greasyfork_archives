// ==UserScript==
// @name         Blacket JS Loader Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  JS Loader overlay with toggleable scripts, theme color, transparency slider, Get All Badges, Spoof PFP saved in localStorage, and Reset PFP
// @author       c00lestkiddever
// @match        https://blacket.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555968/Blacket%20JS%20Loader%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/555968/Blacket%20JS%20Loader%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Script registry ---
    const scripts = {
        "Get All Badges": {
            running: false,
            run: function() {
                const badgeContainer = document.querySelector(".styles__headerBadges___ffKa4-camelCase");
                if (!badgeContainer) return;
                if (!this._originalHTML) this._originalHTML = badgeContainer.innerHTML;

                const badgeEntries = Object.entries(blacket.badges).map(([name, data]) => ({
                    id: name.replaceAll(" ", "-"),
                    name,
                    imageUrl: data.image,
                    description: data.description
                }));
                localStorage.setItem("badges", JSON.stringify(badgeEntries));

                badgeContainer.innerHTML = "";
                const bg = document.createElement("div");
                bg.className = "styles__headerBadgeBg___12ogR-camelCase";
                badgeContainer.appendChild(bg);

                badgeEntries.forEach(badge => {
                    const badgeElement = document.createElement("div");
                    badgeElement.id = badge.id;
                    badgeElement.style.cssText = "display:inline-block;cursor:pointer;margin-right:0.104vw;";
                    const badgeImg = document.createElement("img");
                    badgeImg.loading = "lazy";
                    badgeImg.src = badge.imageUrl;
                    badgeImg.style.cssText = "width:1.563vw;display:inline-block;margin-left:0.130vw;z-index:1;position:relative;";
                    badgeElement.appendChild(badgeImg);
                    badgeContainer.appendChild(badgeElement);

                    badgeElement.addEventListener("click", () => {
                        if (document.querySelector(".arts__modal___VpEAD-camelCase")) return;
                        document.body.insertAdjacentHTML("beforeend", `
                            <div class="arts__modal___VpEAD-camelCase">
                                <form class="styles__container___1BPm9-camelCase">
                                    <div class="styles__text___KSL4--camelCase">
                                        <div>${badge.name} Badge<br><br>${badge.description}</div>
                                    </div>
                                    <div class="styles__holder___3CEfN-camelCase">
                                        <div class="styles__buttonContainer___2EaVD-camelCase">
                                            <div id="closeButton" class="styles__button___1_E-G-camelCase styles__button___3zpwV-camelCase" role="button" tabindex="0">
                                                <div class="styles__shadow___3GMdH-camelCase"></div>
                                                <div class="styles__edge___3eWfq-camelCase" style="background-color: var(--accent);"></div>
                                                <div class="styles__front___vcvuy-camelCase styles__buttonInside___39vdp-camelCase" style="background-color: var(--accent);">Okay</div>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="submit" style="opacity:0;display:none;"/>
                                </form>
                            </div>
                        `);
                        document.getElementById("closeButton").addEventListener("click", () => {
                            document.querySelector(".arts__modal___VpEAD-camelCase").remove();
                        });
                    });
                });

                this.running = true;
            },
            stop: function() {
                const badgeContainer = document.querySelector(".styles__headerBadges___ffKa4-camelCase");
                if (badgeContainer && this._originalHTML) badgeContainer.innerHTML = this._originalHTML;
                this.running = false;
            }
        },
        "Spoof PFP": {
            running: false,
            run: function() {
                const headerBlook = document.querySelector('.styles__headerBlookContainer___36zY5-camelCase img');
                if (!headerBlook) return;

                // Check if a saved PFP exists in localStorage
                let savedUrl = localStorage.getItem("blacketCustomPFP");
                if (!savedUrl) {
                    savedUrl = prompt("Enter the URL for your new PFP:");
                    if (!savedUrl) return;
                    localStorage.setItem("blacketCustomPFP", savedUrl);
                }

                headerBlook.src = savedUrl;
                this.running = true;
            },
            stop: function() {
                // Toggle off only; PFP remains
                this.running = false;
            }
        },
        "Reset PFP": {
            running: false,
            run: function() {
                const headerBlook = document.querySelector('.styles__headerBlookContainer___36zY5-camelCase img');
                if (!headerBlook) return;
                localStorage.removeItem("blacketCustomPFP");
                headerBlook.src = blacket.user.pfp; // revert to original PFP
                this.running = true;
            },
            stop: function() {
                this.running = false;
            }
        }
    };

    const themeColors = {
        "original": "#2d2d2d",
        "amoled": "#000000",
        "red": "#ff4d4d",
        "orange": "#ff9900",
        "yellow": "#ffff66",
        "green": "#33cc33",
        "blue": "#3399ff",
        "purple": "#9933ff",
        "pink": "#ff66cc",
        "white": "#e6e6e6",
        "default": "#2d2d2d"
    };

    const interval = setInterval(() => {
        const sidebar = document.querySelector('.styles__sidebar___1XqWi-camelCase');
        const leftRow = document.querySelector('.styles__leftRow___4jCaB-camelCase');
        const profileBody = document.querySelector('.arts__profileBody___eNPbH-camelCase');
        if (!sidebar || !leftRow || !profileBody) return;
        clearInterval(interval);

        // --- JS Loader Button ---
        const jsButton = document.createElement('a');
        jsButton.className = 'styles__pageButton___1wFuu-camelCase';
        jsButton.style.cursor = 'pointer';
        jsButton.innerHTML = '<i class="styles__pageIcon___3OSy9-camelCase fas fa-code"></i> <div class="styles__pageText___1eo7q-camelCase">Javascript</div>';
        leftRow.appendChild(jsButton);

        const themeName = localStorage.getItem('blacketTheme') || 'default';
        const baseColor = themeColors[themeName] || themeColors["default"];
        let transparency = parseFloat(localStorage.getItem('blacketOverlayTransparency')) || 0.85;

        // --- Overlay ---
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '-10px';
        overlay.style.left = '-10px';
        overlay.style.width = 'calc(100% + 20px)';
        overlay.style.height = 'calc(100% + 20px)';
        overlay.style.display = 'none';
        overlay.style.flexDirection = 'column';
        overlay.style.overflowY = 'auto';
        overlay.style.pointerEvents = 'auto';
        overlay.style.backgroundColor = hexToRgba(baseColor, transparency);
        overlay.style.zIndex = '10000';
        overlay.style.padding = '20px';
        overlay.style.boxSizing = 'border-box';

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        });

        // --- Transparency Slider ---
        const sliderContainer = document.createElement('div');
        sliderContainer.style.marginBottom = '10px';
        sliderContainer.innerHTML = `
            <label style="color:white;font-size:0.8rem;">Transparency: <span id="transparencyValue">${Math.round(transparency*100)}</span>%</label>
            <input type="range" min="0" max="100" value="${Math.round(transparency*100)}" style="width:100%;" id="transparencySlider">
        `;
        const slider = sliderContainer.querySelector('#transparencySlider');
        const valueSpan = sliderContainer.querySelector('#transparencyValue');
        slider.addEventListener('input', () => {
            const val = slider.value;
            valueSpan.textContent = val;
            overlay.style.backgroundColor = hexToRgba(baseColor, val/100);
            localStorage.setItem('blacketOverlayTransparency', val/100);
        });
        overlay.appendChild(sliderContainer);

        // --- Script buttons ---
        Object.keys(scripts).forEach(name => {
            const btn = document.createElement('a');
            btn.className = 'styles__pageButton___1wFuu-camelCase';
            btn.style.cursor = 'pointer';
            btn.style.marginBottom = '6px';
            btn.innerHTML = `<div class="styles__pageText___1eo7q-camelCase">${name}</div>`;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const script = scripts[name];
                if (!script.running) script.run();
                else script.stop();
            });
            overlay.appendChild(btn);
        });

        profileBody.style.position = 'relative';
        profileBody.appendChild(overlay);

        // --- Toggle overlay ---
        jsButton.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
        });

        // --- Auto-run scripts ---
        Object.values(scripts).forEach(s => s.run && s.run());

        // --- Helper ---
        function hexToRgba(hex, alpha) {
            hex = hex.replace('#','');
            const r = parseInt(hex.substring(0,2),16);
            const g = parseInt(hex.substring(2,4),16);
            const b = parseInt(hex.substring(4,6),16);
            return `rgba(${r},${g},${b},${alpha})`;
        }

    }, 100);
})();
