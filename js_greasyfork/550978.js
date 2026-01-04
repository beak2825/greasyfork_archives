// ==UserScript==
// @name         Sploop.io FPS Booster GUI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set FPS Targets of 60FPS, 120FPS, 144FPS, 240FPS, and 360FPS
// @author       pcku
// @match        https://sploop.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550978/Sploopio%20FPS%20Booster%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/550978/Sploopio%20FPS%20Booster%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // FPS Limiter + Counter
    // ==============================
    (function() {
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        let targetFPS = 240; // default
        let frameInterval = 1000 / targetFPS;

        let lastFrameTime = 0;
        let fps = 0;
        let frameCount = 0;
        let lastFpsUpdate = 0;

        // Override RAF to enforce FPS cap
        window.requestAnimationFrame = function(callback) {
            const now = performance.now();

            // FPS counting
            frameCount++;
            if (now - lastFpsUpdate >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastFpsUpdate = now;
            }

            // Enforce FPS cap
            if (now - lastFrameTime >= frameInterval) {
                lastFrameTime = now;
                return originalRequestAnimationFrame(callback);
            } else {
                return setTimeout(() => {
                    lastFrameTime = performance.now();
                    originalRequestAnimationFrame(callback);
                }, frameInterval - (now - lastFrameTime));
            }
        };

        // ==============================
        // GUI
        // ==============================
        let guiBox, statusLine, toggleBtn, openBtn, fpsSelect;

        const createGUI = () => {
            guiBox = document.createElement('div');
            guiBox.id = "fpsGui";
            guiBox.style.position = 'absolute';
            guiBox.style.top = '20px';
            guiBox.style.left = '20px';
            guiBox.style.padding = '10px 20px';
            guiBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            guiBox.style.color = 'white';
            guiBox.style.fontSize = '18px';
            guiBox.style.fontFamily = 'Arial, sans-serif';
            guiBox.style.fontWeight = 'bold';
            guiBox.style.borderRadius = '8px';
            guiBox.style.zIndex = '9999';
            guiBox.style.display = 'flex';
            guiBox.style.flexDirection = 'column';
            guiBox.style.gap = '8px';

            // Status line
            statusLine = document.createElement('div');
            statusLine.id = "fpsStatus";
            statusLine.style.fontSize = "16px";
            statusLine.style.fontWeight = "normal";
            statusLine.textContent = `Target: ${targetFPS} | Current: 0`;
            guiBox.appendChild(statusLine);

            // FPS selector
            const fpsLabel = document.createElement('label');
            fpsLabel.textContent = "Target FPS:";
            fpsLabel.style.fontSize = "14px";
            fpsLabel.style.fontWeight = "normal";

            fpsSelect = document.createElement('select');
            [60, 120, 144, 240, 360].forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                if (value === targetFPS) option.selected = true;
                fpsSelect.appendChild(option);
            });

            fpsSelect.onchange = () => {
                targetFPS = parseInt(fpsSelect.value);
                frameInterval = 1000 / targetFPS;
            };

            const fpsSelectContainer = document.createElement('div');
            fpsSelectContainer.style.display = "flex";
            fpsSelectContainer.style.gap = "8px";
            fpsSelectContainer.style.alignItems = "center";
            fpsSelectContainer.appendChild(fpsLabel);
            fpsSelectContainer.appendChild(fpsSelect);

            guiBox.appendChild(fpsSelectContainer);

            // Close button
            toggleBtn = document.createElement('button');
            toggleBtn.textContent = "Close";
            toggleBtn.style.cursor = "pointer";
            toggleBtn.style.padding = "5px 10px";
            toggleBtn.style.backgroundColor = "#333";
            toggleBtn.style.color = "white";
            toggleBtn.style.border = "1px solid #555";
            toggleBtn.style.borderRadius = "5px";
            toggleBtn.onclick = () => {
                guiBox.style.display = "none";
                openBtn.style.display = "block";
            };
            guiBox.appendChild(toggleBtn);

            document.body.appendChild(guiBox);

            // Open button (small box)
            openBtn = document.createElement('div');
            openBtn.textContent = "Open";
            openBtn.style.position = 'absolute';
            openBtn.style.top = '20px';
            openBtn.style.left = '20px';
            openBtn.style.padding = '5px 10px';
            openBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            openBtn.style.color = 'white';
            openBtn.style.fontSize = '14px';
            openBtn.style.fontFamily = 'Arial, sans-serif';
            openBtn.style.borderRadius = '5px';
            openBtn.style.cursor = 'pointer';
            openBtn.style.zIndex = '9999';
            openBtn.style.display = 'none';
            openBtn.onclick = () => {
                guiBox.style.display = "flex";
                openBtn.style.display = "none";
            };

            document.body.appendChild(openBtn);
        };

        const updateStatusLine = () => {
            if (!statusLine) return;

            statusLine.textContent = `Target: ${targetFPS} | Current: ${fps}`;

            // Color coding
            if (fps >= targetFPS * 0.9) {
                statusLine.style.color = "lime"; // good
            } else if (fps >= targetFPS * 0.6) {
                statusLine.style.color = "yellow"; // warning
            } else {
                statusLine.style.color = "red"; // bad
            }

            requestAnimationFrame(updateStatusLine);
        };

        createGUI();
        updateStatusLine();
    })();

    // ==============================
    // Aggressive FPS Optimizer
    // ==============================
    (function() {
        const removeElements = () => {
            // Hide by ID
            const elementsToRemove = [
                'background',   // Background animations
                'effects',      // Explosions / particles
                'particles',    // Particle systems
                'tooltip',      // Tooltips
                'minimap',      // Minimap
                'chat',         // Chat box
                'leaderboard',  // Leaderboard
                'ad',           // Ads
            ];

            elementsToRemove.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });

            // Hide by class
            const classesToRemove = [
                'ui-tooltip',
                'shop-container',
                'ui-overlay',
                'ui-ad-banner',
            ];

            classesToRemove.forEach(cls => {
                document.querySelectorAll(`.${cls}`).forEach(el => {
                    el.style.display = 'none';
                });
            });

            // Disable canvas filters
            const canvases = document.querySelectorAll("canvas");
            canvases.forEach(cv => {
                const ctx = cv.getContext("2d");
                if (ctx) {
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "transparent";
                    ctx.filter = "none";
                }
            });
        };

        // Run periodically to clean up re-added elements
        setInterval(removeElements, 1000);
    })();

})();
