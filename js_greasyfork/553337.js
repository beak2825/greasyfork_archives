// ==UserScript==
// @name         Miniblox.io GUI
// @namespace    http://tampermonkey.net/
// @version      2.0.4-clean
// @description  GUI for miniblox.io with FPS display, cursor changer, FPS unlocker, auto sprint, autoclicker, constant auto bunny hop, and ESP overlays. Right Shift toggles the GUI.
// @match        https://miniblox.io/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553337/Minibloxio%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/553337/Minibloxio%20GUI.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function createButton(text) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.background = "linear-gradient(45deg, #6a11cb, #2575fc)";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.padding = "8px 12px";
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.style.margin = "5px 0";
        btn.style.transition = "background 0.2s ease";
        btn.addEventListener('mouseover', () => {
            btn.style.background = "linear-gradient(45deg, #2575fc, #6a11cb)";
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = "linear-gradient(45deg, #6a11cb, #2575fc)";
        });
        return btn;
    }

    if (!document.body) return;
    const guiContainer = document.createElement('div');
    guiContainer.id = "customGuiContainer";
    guiContainer.style.position = "fixed";
    guiContainer.style.top = "10px";
    guiContainer.style.right = "10px";
    guiContainer.style.width = "280px";
    guiContainer.style.height = "380px";
    guiContainer.style.minWidth = "150px";
    guiContainer.style.minHeight = "150px";
    guiContainer.style.background = "rgba(20,20,20,0.8)";
    guiContainer.style.backdropFilter = "blur(8px)";
    guiContainer.style.border = "1px solid rgba(255,255,255,0.2)";
    guiContainer.style.borderRadius = "10px";
    guiContainer.style.boxShadow = "0 6px 12px rgba(0,0,0,0.5)";
    guiContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    guiContainer.style.color = "#fff";
    guiContainer.style.padding = "15px";
    guiContainer.style.overflow = "auto";
    guiContainer.style.transition = "all 0.3s ease";
    guiContainer.style.zIndex = "100000";
    document.body.appendChild(guiContainer);

    const header = document.createElement('div');
    header.textContent = "Miniblox.io GUI";
    header.style.cursor = "move";
    header.style.background = "rgba(255,255,255,0.1)";
    header.style.padding = "10px";
    header.style.borderRadius = "6px";
    header.style.fontWeight = "bold";
    header.style.fontSize = "16px";
    header.style.textAlign = "center";
    header.style.marginBottom = "15px";
    guiContainer.appendChild(header);

    header.addEventListener('mousedown', startDrag);
    function startDrag(e) {
        e.preventDefault();
        let startX = e.clientX, startY = e.clientY;
        const rect = guiContainer.getBoundingClientRect();
        const offsetX = startX - rect.left, offsetY = startY - rect.top;
        function onMouseMove(e) {
            guiContainer.style.left = (e.clientX - offsetX) + "px";
            guiContainer.style.top = (e.clientY - offsetY) + "px";
            guiContainer.style.right = "auto";
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    const resizeHandle = document.createElement('div');
    resizeHandle.style.width = "15px";
    resizeHandle.style.height = "15px";
    resizeHandle.style.background = "rgba(255,255,255,0.4)";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "5px";
    resizeHandle.style.bottom = "5px";
    resizeHandle.style.cursor = "se-resize";
    resizeHandle.style.borderRadius = "3px";
    guiContainer.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', startResize);
    function startResize(e) {
        e.preventDefault();
        e.stopPropagation();
        let startX = e.clientX, startY = e.clientY;
        const startWidth = guiContainer.offsetWidth, startHeight = guiContainer.offsetHeight;
        function onMouseMove(e) {
            let newWidth = startWidth + (e.clientX - startX);
            let newHeight = startHeight + (e.clientY - startY);
            if(newWidth < 150) newWidth = 150;
            if(newHeight < 150) newHeight = 150;
            guiContainer.style.width = newWidth + "px";
            guiContainer.style.height = newHeight + "px";
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    const content = document.createElement('div');
    content.style.fontSize = "14px";
    guiContainer.appendChild(content);

    const fpsDisplay = document.createElement('div');
    fpsDisplay.textContent = "FPS: Calculating...";
    fpsDisplay.style.marginBottom = "10px";
    content.appendChild(fpsDisplay);

    let lastFrameTime = performance.now(), frameCount = 0;
    function updateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastFrameTime >= 1000) {
            fpsDisplay.textContent = "FPS: " + frameCount;
            frameCount = 0;
            lastFrameTime = now;
        }
        requestAnimationFrame(updateFPS);
    }
    requestAnimationFrame(updateFPS);

    const cursorLabel = document.createElement('label');
    cursorLabel.textContent = "Cursor URL:";
    content.appendChild(cursorLabel);

    const cursorInput = document.createElement('input');
    cursorInput.type = "text";
    cursorInput.placeholder = "Paste image URL here";
    cursorInput.style.width = "100%";
    cursorInput.style.margin = "5px 0 10px 0";
    cursorInput.style.padding = "6px";
    cursorInput.style.borderRadius = "4px";
    cursorInput.style.border = "1px solid #ccc";
    content.appendChild(cursorInput);

    const setCursorButton = createButton("Set Cursor");
    setCursorButton.addEventListener('click', function() {
        const url = cursorInput.value.trim();
        if(url) {
            document.body.style.cursor = `url(${url}), auto`;
        } else {
            alert("Please enter a valid URL");
        }
    });
    content.appendChild(setCursorButton);

    const resetCursorButton = createButton("Reset Cursor");
    resetCursorButton.style.marginLeft = "5px";
    resetCursorButton.addEventListener('click', function() {
        document.body.style.cursor = "auto";
        cursorInput.value = "";
    });
    content.appendChild(resetCursorButton);

    const fpsUnlockerLabel = document.createElement('div');
    fpsUnlockerLabel.textContent = "FPS Unlocker:";
    fpsUnlockerLabel.style.marginTop = "15px";
    content.appendChild(fpsUnlockerLabel);

    const fpsUnlockerToggle = createButton("Enable FPS Unlocker");
    content.appendChild(fpsUnlockerToggle);

    let fpsUnlockerEnabled = false;
    const originalRAF = window.requestAnimationFrame;
    fpsUnlockerToggle.addEventListener('click', function() {
        fpsUnlockerEnabled = !fpsUnlockerEnabled;
        if(fpsUnlockerEnabled) {
            fpsUnlockerToggle.textContent = "Disable FPS Unlocker";
            window.requestAnimationFrame = function(callback) {
                return setTimeout(function() {
                    callback(performance.now());
                }, 0);
            };
        } else {
            fpsUnlockerToggle.textContent = "Enable FPS Unlocker";
            window.requestAnimationFrame = originalRAF;
        }
    });

    const autoSprintLabel = document.createElement('div');
    autoSprintLabel.textContent = "Auto Sprint:";
    autoSprintLabel.style.marginTop = "15px";
    content.appendChild(autoSprintLabel);

    const autoSprintToggle = createButton("Enable Auto Sprint");
    content.appendChild(autoSprintToggle);

    let autoSprintEnabled = false, autoSprintInterval = null;
    autoSprintToggle.addEventListener('click', function() {
        autoSprintEnabled = !autoSprintEnabled;
        if(autoSprintEnabled) {
            autoSprintToggle.textContent = "Disable Auto Sprint";
            autoSprintInterval = setInterval(function() {
                const event = new KeyboardEvent('keydown', {
                    key: 'Shift',
                    code: 'ShiftLeft',
                    keyCode: 16,
                    bubbles: true
                });
                document.dispatchEvent(event);
            }, 100);
        } else {
            autoSprintToggle.textContent = "Enable Auto Sprint";
            clearInterval(autoSprintInterval);
            const event = new KeyboardEvent('keyup', {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: 16,
                bubbles: true
            });
            document.dispatchEvent(event);
        }
    });

    const autoclickerLabel = document.createElement('div');
    autoclickerLabel.textContent = "Autoclicker:";
    autoclickerLabel.style.marginTop = "15px";
    content.appendChild(autoclickerLabel);

    const autoclickerToggle = createButton("Enable Autoclicker");
    content.appendChild(autoclickerToggle);

    let autoclickerEnabled = false;
    autoclickerToggle.addEventListener('click', function() {
        autoclickerEnabled = !autoclickerEnabled;
        if (autoclickerEnabled) {
            autoclickerToggle.textContent = "Disable Autoclicker";
            autoClicker();
        } else {
            autoclickerToggle.textContent = "Enable Autoclicker";
        }
    });

    function autoClicker() {
        if (!autoclickerEnabled) return;
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            canvas.dispatchEvent(mousedownEvent);
            setTimeout(() => {
                const mouseupEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
                canvas.dispatchEvent(mouseupEvent);
            }, 200000);
        }
        const randomDelay = Math.random() * (150 - 80) + 80;
        setTimeout(autoClicker, randomDelay);
    }

    const bunnyHopLabel = document.createElement('div');
    bunnyHopLabel.textContent = "Auto Bunny Hop:";
    bunnyHopLabel.style.marginTop = "15px";
    content.appendChild(bunnyHopLabel);

    const bunnyHopToggle = createButton("Enable Auto Bunny Hop");
    content.appendChild(bunnyHopToggle);

    let autoBunnyHopEnabled = false;
    let bunnyHopInterval = null;
    bunnyHopToggle.addEventListener('click', function() {
        autoBunnyHopEnabled = !autoBunnyHopEnabled;
        if (autoBunnyHopEnabled) {
            bunnyHopToggle.textContent = "Disable Auto Bunny Hop";
            bunnyHopInterval = setInterval(() => {
                const jumpKeyDown = new KeyboardEvent('keydown', {
                    key: ' ',
                    code: 'Space',
                    keyCode: 32,
                    bubbles: true
                });
                document.dispatchEvent(jumpKeyDown);
                setTimeout(() => {
                    const jumpKeyUp = new KeyboardEvent('keyup', {
                        key: ' ',
                        code: 'Space',
                        keyCode: 32,
                        bubbles: true
                    });
                    document.dispatchEvent(jumpKeyUp);
                }, 20);
            }, 50);
        } else {
            bunnyHopToggle.textContent = "Enable Auto Bunny Hop";
            clearInterval(bunnyHopInterval);
        }
    });

    const espLabel = document.createElement('div');
    espLabel.textContent = "ESP:";
    espLabel.style.marginTop = "15px";
    content.appendChild(espLabel);

    const espToggle = createButton("Enable ESP");
    content.appendChild(espToggle);

    let espEnabled = false;
    espToggle.addEventListener('click', function() {
        espEnabled = !espEnabled;
        if (espEnabled) {
            espToggle.textContent = "Disable ESP";
            updateESP();
        } else {
            espToggle.textContent = "Enable ESP";
            document.querySelectorAll('.esp-overlay').forEach(el => el.remove());
        }
    });

    function updateESP() {
        if (!espEnabled) return;
        document.querySelectorAll('.esp-overlay').forEach(el => el.remove());
        const enemies = document.querySelectorAll('.player');
        enemies.forEach(enemy => {
            const rect = enemy.getBoundingClientRect();
            if (rect.width && rect.height) {
                const overlay = document.createElement('div');
                overlay.className = "esp-overlay";
                overlay.style.position = "fixed";
                overlay.style.left = rect.left + "px";
                overlay.style.top = rect.top + "px";
                overlay.style.width = rect.width + "px";
                overlay.style.height = rect.height + "px";
                overlay.style.border = "2px solid lime";
                overlay.style.zIndex = "1000000";
                overlay.style.pointerEvents = "none";
                document.body.appendChild(overlay);
            }
        });
        requestAnimationFrame(updateESP);
    }

    document.addEventListener('keydown', function(e) {
        if (e.code === 'ShiftRight') {
            guiContainer.style.display = (guiContainer.style.display === 'none') ? 'block' : 'none';
        }
    });
})();