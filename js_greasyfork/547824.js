// ==UserScript==
// @name         Bloxd.io Mod Panel + Rainbow Watermark + Unban + Draggable Watermark + Killaura + Jesus
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Mod panel with rainbow watermark, unban feature, draggable watermark with saved position, Killaura toggle, and Jesus (walk on water & lava) for bloxd.io
// @author       You
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547824/Bloxdio%20Mod%20Panel%20%2B%20Rainbow%20Watermark%20%2B%20Unban%20%2B%20Draggable%20Watermark%20%2B%20Killaura%20%2B%20Jesus.user.js
// @updateURL https://update.greasyfork.org/scripts/547824/Bloxdio%20Mod%20Panel%20%2B%20Rainbow%20Watermark%20%2B%20Unban%20%2B%20Draggable%20Watermark%20%2B%20Killaura%20%2B%20Jesus.meta.js
// ==/UserScript==
// @license MIT
(function () {
    'use strict';

    // === Style ===
    const style = document.createElement('style');
    style.textContent = `
        .gui-panel {
            position: fixed;
            top: 200px;
            left: 200px;
            width: 250px;
            background: rgba(20, 20, 20, 0.95);
            border: 2px solid #00ff88;
            border-radius: 8px;
            padding: 10px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 9999;
            display: none;
        }
        .gui-header {
            font-weight: bold;
            cursor: move;
            margin-bottom: 10px;
            border-bottom: 1px solid #00ff88;
            padding-bottom: 5px;
        }
        .gui-button {
            background: #111;
            padding: 8px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            border: 1px solid #00ff88;
            transition: background 0.3s;
        }
        .gui-button:hover {
            background: #00ff88;
            color: black;
        }
        .watermark {
            position: fixed;
            top: 5px;
            left: 10px;
            font-size: 20px;
            font-weight: bold;
            font-family: 'Arial', sans-serif;
            color: #00ff88;
            text-shadow: 0 0 5px #00ff88;
            z-index: 9999;
            cursor: move;
        }
    `;
    document.head.appendChild(style);

    // === Watermark ===
    const Watermark = {
        text: "Trollium Client",
        element: null,
        isVisible: true,
        rainbow: false,
        hue: 0,
        intervalId: null,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,

        create() {
            if (this.element) return;
            this.element = document.createElement('div');
            this.element.className = 'watermark';
            this.element.textContent = this.text;

            const savedPos = JSON.parse(localStorage.getItem('watermarkPos'));
            if (savedPos) {
                this.element.style.left = savedPos.x + 'px';
                this.element.style.top = savedPos.y + 'px';
            }

            document.body.appendChild(this.element);
            this.initDrag();
        },

        toggle() {
            if (!this.element) this.create();
            this.isVisible = !this.isVisible;
            this.element.style.display = this.isVisible ? 'block' : 'none';
        },

        setText(newText) {
            this.text = newText;
            if (this.element) this.element.textContent = newText;
        },

        startRainbow() {
            if (this.intervalId) return;
            this.rainbow = true;
            this.intervalId = setInterval(() => {
                this.hue = (this.hue + 1) % 360;
                if (this.element) {
                    this.element.style.color = `hsl(${this.hue}, 100%, 60%)`;
                    this.element.style.textShadow = `0 0 8px hsl(${this.hue}, 100%, 60%)`;
                }
            }, 50);
        },

        stopRainbow() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.rainbow = false;
            if (this.element) {
                this.element.style.color = "#00ff88";
                this.element.style.textShadow = "0 0 5px #00ff88";
            }
        },

        toggleRainbow() {
            if (this.rainbow) {
                this.stopRainbow();
            } else {
                this.startRainbow();
            }
        },

        initDrag() {
            this.element.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.offsetX = e.clientX - this.element.offsetLeft;
                this.offsetY = e.clientY - this.element.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.element.style.left = (e.clientX - this.offsetX) + 'px';
                    this.element.style.top = (e.clientY - this.offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    localStorage.setItem('watermarkPos', JSON.stringify({
                        x: this.element.offsetLeft,
                        y: this.element.offsetTop
                    }));
                }
                this.isDragging = false;
            });
        }
    };

    Watermark.create();

    // === Panel ===
    class Panel {
        constructor(title = "Mod Panel") {
            this.panel = document.createElement('div');
            this.panel.className = 'gui-panel';

            this.header = document.createElement('div');
            this.header.className = 'gui-header';
            this.header.textContent = title;
            this.panel.appendChild(this.header);

            this.initDrag();

            document.body.appendChild(this.panel);
        }

        initDrag() {
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            this.header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - this.panel.offsetLeft;
                offsetY = e.clientY - this.panel.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.panel.style.left = (e.clientX - offsetX) + 'px';
                    this.panel.style.top = (e.clientY - offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        addButton(label, onClick) {
            const btn = document.createElement('div');
            btn.className = 'gui-button';
            btn.textContent = label;
            btn.onclick = onClick;
            this.panel.appendChild(btn);
        }

        toggle() {
            this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    const panel = new Panel("Bloxd Mods");

    // === Watermark Buttons ===
    panel.addButton("Toggle Watermark", () => Watermark.toggle());
    panel.addButton("Set Watermark Text", () => {
        const text = prompt("Enter new watermark text:", Watermark.text);
        if (text) Watermark.setText(text);
    });
    panel.addButton("Toggle Rainbow Watermark", () => Watermark.toggleRainbow());

    // === Unban ===
    function unban() {
        document.cookie.split(";").forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        alert("Cookies cleared! Reloading...");
        location.reload();
    }
    panel.addButton("Unban (Clear Cookies)", () => {
        if (confirm("Clear cookies and reload?")) unban();
    });

    // === Killaura ===
    let killauraEnabled = false;
    let killauraInterval = null;
    let killauraDelay = 100;
    let attackRange = 7;

    function startKillaura() {
        if (killauraInterval) return;
        console.log("[Killaura] Waiting for SDK...");
        killauraInterval = setInterval(() => {
            if (!window.SDK || !SDK.noa) return;

            const playerPos = SDK.noa.getPosition(1);
            if (!playerPos) return;

            const playerList = SDK.noa.playerList || [];
            playerList.forEach(player => {
                if (!player || player === 1) return;
                let targetPos = SDK.noa.getPosition(player);
                if (!targetPos) return;

                const dx = targetPos[0] - playerPos[0];
                const dy = targetPos[1] - playerPos[1];
                const dz = targetPos[2] - playerPos[2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance <= attackRange) {
                    const lookPos = normalizeVector([dx, dy, dz]);
                    try {
                        SDK.noa.doAttack(lookPos, player.toString(), "BodyMesh");
                        SDK.noa.getHeldItem(1)?.trySwingBlock?.();
                        SDK.noa.getMoveState(1)?.setArmsAreSwinging?.();
                    } catch (err) {
                        console.error("[Killaura] Attack error:", err);
                    }
                }
            });
        }, killauraDelay);
    }

    function stopKillaura() {
        if (killauraInterval) {
            clearInterval(killauraInterval);
            killauraInterval = null;
        }
    }

    function normalizeVector(vec) {
        const length = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
        return length === 0 ? [0, 0, 0] : [vec[0] / length, vec[1] / length, vec[2] / length];
    }

    panel.addButton("Toggle Killaura", () => {
        killauraEnabled = !killauraEnabled;
        if (killauraEnabled) {
            startKillaura();
            alert("Killaura Enabled");
        } else {
            stopKillaura();
            alert("Killaura Disabled");
        }
    });

    // === Jesus ===
    let jesusEnabled = false;
    let waterBlockId = null;
    let lavaBlockId = null;
    let solidityKey = null;

    function enableJesus() {
        try {
            if (!window.SDK || !SDK.noa || !SDK.noa.registry) {
                console.warn("[Jesus] SDK or registry not ready");
                return;
            }

            const registry = SDK.noa.registry;
            const keys = Object.keys(registry);
            solidityKey = keys[12]; // Assumption from original
            const blockLookup = registry["blockLookup"] || registry["blockIDs"] || null;

            if (!blockLookup) {
                console.error("[Jesus] Cannot find block lookup object.");
                return;
            }

            waterBlockId = findBlockId("water", blockLookup);
            lavaBlockId = findBlockId("lava", blockLookup);

            if (waterBlockId == null || lavaBlockId == null) {
                console.error("[Jesus] Could not find Water or Lava block IDs");
                return;
            }

            registry[solidityKey][waterBlockId] = true;
            registry[solidityKey][lavaBlockId] = true;
            console.log(`[Jesus] Enabled: Water ID ${waterBlockId}, Lava ID ${lavaBlockId}`);
        } catch (err) {
            console.error("[Jesus] Error enabling:", err);
        }
    }

    function disableJesus() {
        try {
            if (solidityKey && waterBlockId != null && lavaBlockId != null) {
                SDK.noa.registry[solidityKey][waterBlockId] = false;
                SDK.noa.registry[solidityKey][lavaBlockId] = false;
                console.log("[Jesus] Disabled");
            }
        } catch (err) {
            console.error("[Jesus] Error disabling:", err);
        }
    }

    function findBlockId(name, lookup) {
        name = name.toLowerCase();
        for (let key in lookup) {
            if (key.toLowerCase().includes(name)) return lookup[key];
        }
        return null;
    }

    panel.addButton("Toggle Jesus", () => {
        jesusEnabled = !jesusEnabled;
        if (jesusEnabled) {
            enableJesus();
            alert("Jesus Enabled (Walk on Water & Lava)");
        } else {
            disableJesus();
            alert("Jesus Disabled");
        }
    });

    // === Toggle panel with ShiftRight ===
    window.addEventListener('keydown', (e) => {
        if (e.code === 'ShiftRight') {
            panel.toggle();
        }
    });
})();
//join discord https://discord.gg/fUnVusGD