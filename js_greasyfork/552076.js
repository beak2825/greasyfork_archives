// ==UserScript==
// @name         E Parkour Full Mod + HUD
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Flight, unlock levels, gravity/speed controls, HUD overlay
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552076/E%20Parkour%20Full%20Mod%20%2B%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/552076/E%20Parkour%20Full%20Mod%20%2B%20HUD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForGame(callback) {
        const interval = setInterval(() => {
            if (window.pc && pc.Application && pc.Application.getApplication) {
                const app = pc.Application.getApplication();
                if (app && app.root && app.root.findByName) {
                    clearInterval(interval);
                    callback(app);
                }
            }
        }, 500);
    }

    waitForGame(function(app) {
        let flyEnabled = false;
        let keys = {};
        let baseSpeed = 10;
        let gravityValue = 10; // start at 10

        // HUD setup
        const hud = document.createElement("div");
        hud.style.position = "fixed";
        hud.style.top = "10px";
        hud.style.left = "10px";
        hud.style.padding = "8px 12px";
        hud.style.background = "rgba(0,0,0,0.6)";
        hud.style.color = "#0f0";
        hud.style.fontFamily = "monospace";
        hud.style.fontSize = "14px";
        hud.style.zIndex = "999999";
        hud.style.whiteSpace = "pre";
        document.body.appendChild(hud);

        function updateHUD() {
            hud.textContent =
                `Flight: ${flyEnabled ? "ON" : "OFF"}\n` +
                `Speed: ${baseSpeed}\n` +
                `Gravity: ${gravityValue}`;
        }

        function getPlayer() {
            return app.root.findByName("Player"); // adjust if entity name differs
        }

        function getCamera() {
            return app.root.findByName("Camera"); // adjust if needed
        }

        document.addEventListener('keydown', e => {
            keys[e.code] = true;

            // Toggle flight
            if (e.code === 'KeyH') {
                flyEnabled = !flyEnabled;
                updateHUD();
            }

            // Unlock all levels
            if (e.code === 'KeyL') {
                for (let i = 1; i <= 50; i++) {
                    localStorage.setItem("progress" + i, true);
                }
                alert("✅ All levels unlocked!");
            }

            // Gravity controls
            if (e.code === 'Digit1') {
                gravityValue += 1;
                app.systems.rigidbody.gravity = new pc.Vec3(0, -gravityValue, 0);
                updateHUD();
            }
            if (e.code === 'Digit2') {
                gravityValue = Math.max(1, gravityValue - 1);
                app.systems.rigidbody.gravity = new pc.Vec3(0, -gravityValue, 0);
                updateHUD();
            }

            // Speed controls
            if (e.code === 'Digit9') {
                baseSpeed += 1;
                updateHUD();
            }
            if (e.code === 'Digit0') {
                baseSpeed = Math.max(1, baseSpeed - 1);
                updateHUD();
            }
        });

        document.addEventListener('keyup', e => {
            keys[e.code] = false;
        });

        app.on("update", dt => {
            if (!flyEnabled) return;

            const player = getPlayer();
            const camera = getCamera();
            if (!player || !player.rigidbody || !camera) return;

            let speed = baseSpeed;
            if (keys["ShiftLeft"]) speed *= 2;    // faster
            if (keys["ShiftRight"]) speed *= 0.5; // slower

            let move = new pc.Vec3(0,0,0);

            // Camera forward/right vectors
            const forward = camera.forward.clone().normalize();
            const right = camera.right.clone().normalize();

            // Flatten to horizontal plane for WASD
            forward.y = 0;
            right.y = 0;
            forward.normalize();
            right.normalize();

            // WASD relative to camera
            if (keys["KeyW"]) move.add(forward);
            if (keys["KeyS"]) move.sub(forward);
            if (keys["KeyA"]) move.sub(right);
            if (keys["KeyD"]) move.add(right);

            // Vertical (gentle)
            if (keys["Space"]) move.y += 0.5;
            if (keys["ControlLeft"]) move.y -= 0.5;

            if (move.lengthSq() > 0) {
                move.normalize().scale(speed);
            }

            // Apply velocity
            player.rigidbody.linearVelocity = move;
        });

        updateHUD();
        alert(
            "Full Mod Loaded!\n" +
            "H: Toggle flight\n" +
            "WASD: Move relative to camera\n" +
            "Space: Up | Left Ctrl: Down\n" +
            "Left Shift: Speed up | Right Shift: Slow down\n" +
            "9: Increase speed | 0: Decrease speed\n" +
            "1: Increase gravity | 2: Decrease gravity\n" +
            "L: Unlock all levels"
        );
    });
})();