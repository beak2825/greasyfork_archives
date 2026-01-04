// ==UserScript==
// @name         Universal Fly Mod with Low Graphics and Camera Toggle (Any URL)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fly controls, camera toggle, low graphics, pointer lock, and on-screen controls for any website/game!
// @author       Your Name
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549844/Universal%20Fly%20Mod%20with%20Low%20Graphics%20and%20Camera%20Toggle%20%28Any%20URL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549844/Universal%20Fly%20Mod%20with%20Low%20Graphics%20and%20Camera%20Toggle%20%28Any%20URL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const SPEED = 0.25;
    const FLY_UP_SPEED = 0.15;
    const FLY_DOWN_SPEED = 0.15;
    let useLowGraphics = false;
    let isPointerLocked = false;
    let firstPerson = true;

    // === GAME STATE ===
    let position = {x: 0, y: 10, z: 0};
    let velocity = {x: 0, y: 0, z: 0};
    let yaw = 0, pitch = 0;
    let keys = {};

    // === HTML/CANVAS SETUP ===
    const canvas = document.createElement('canvas');
    canvas.tabIndex = 0;
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = 9999;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // === UI BUTTON ===
    const uiBtn = document.createElement('button');
    uiBtn.innerText = "Toggle Low Graphics";
    uiBtn.style.position = 'fixed';
    uiBtn.style.top = '12px';
    uiBtn.style.right = '12px';
    uiBtn.style.zIndex = 10000;
    uiBtn.style.fontSize = '18px';
    uiBtn.onclick = () => { useLowGraphics = !useLowGraphics; };
    document.body.appendChild(uiBtn);

    // === CONTROLS OVERLAY ===
    const controlsOverlay = document.createElement('div');
    controlsOverlay.style.position = 'fixed';
    controlsOverlay.style.left = '20px';
    controlsOverlay.style.bottom = '20px';
    controlsOverlay.style.zIndex = 10001;
    controlsOverlay.style.background = 'rgba(30,30,30,0.7)';
    controlsOverlay.style.color = '#fff';
    controlsOverlay.style.padding = '16px 22px 16px 22px';
    controlsOverlay.style.borderRadius = '14px';
    controlsOverlay.style.fontFamily = 'Arial, sans-serif';
    controlsOverlay.style.fontSize = '17px';
    controlsOverlay.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
    controlsOverlay.style.pointerEvents = 'none';
    controlsOverlay.innerHTML = `
        <b>Controls:</b><br>
        Move: <b>WASD</b> or <b>Arrow keys</b><br>
        Fly Up: <b>Space</b> &nbsp; Fly Down: <b>Shift</b><br>
        Toggle First/Third Person: <b>M</b><br>
        Toggle Low Graphics: <b>G</b> or UI Button<br>
        Pointer Lock: <b>Click canvas</b> for mouse look
    `;
    document.body.appendChild(controlsOverlay);

    // === POINTER LOCK ===
    canvas.addEventListener('click', () => { 
        canvas.requestPointerLock(); 
    });
    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === canvas;
    });

    // === CAMERA TOGGLE ===
    function toggleCamera() {
        firstPerson = !firstPerson;
    }

    // === LOW GRAPHICS TOGGLE ===
    function toggleLowGraphics() {
        useLowGraphics = !useLowGraphics;
    }

    // === RESIZE HANDLER ===
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // === KEY HANDLERS ===
    document.addEventListener('keydown', e => {
        keys[e.code] = true;
        if (e.code === "KeyM") toggleCamera();
        if (e.code === "KeyG") toggleLowGraphics();
    });
    document.addEventListener('keyup', e => {
        keys[e.code] = false;
    });

    // === MOUSE LOOK ===
    document.addEventListener('mousemove', e => {
        if (isPointerLocked) {
            yaw -= e.movementX * 0.0025;
            pitch -= e.movementY * 0.0025;
            pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
        }
    });

    // === GAME LOOP ===
    function update() {
        // WASD/arrow movement (horizontal plane)
        let forward = 0, right = 0;
        if (keys["KeyW"] || keys["ArrowUp"]) forward += 1;
        if (keys["KeyS"] || keys["ArrowDown"]) forward -= 1;
        if (keys["KeyA"] || keys["ArrowLeft"]) right -= 1;
        if (keys["KeyD"] || keys["ArrowRight"]) right += 1;
        let flyUp = keys["Space"] ? 1 : 0;
        let flyDown = keys["ShiftLeft"] || keys["ShiftRight"] ? 1 : 0;

        // Calculate direction based on yaw
        let sinY = Math.sin(yaw), cosY = Math.cos(yaw);

        velocity.x = (forward * cosY + right * sinY) * SPEED;
        velocity.z = (forward * sinY * -1 + right * cosY) * SPEED;
        velocity.y = (flyUp ? FLY_UP_SPEED : 0) - (flyDown ? FLY_DOWN_SPEED : 0);

        position.x += velocity.x;
        position.y += velocity.y;
        position.z += velocity.z;

        // Clamp y to ground level
        if (position.y < 0) position.y = 0;
    }

    // === RENDER LOOP ===
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Skybox
        if (!useLowGraphics) {
            // Rainbow skybox gradient
            let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, "#ff0000"); // Red
            grad.addColorStop(0.17, "#ff9900"); // Orange
            grad.addColorStop(0.34, "#ffff00"); // Yellow
            grad.addColorStop(0.51, "#00ff00"); // Green
            grad.addColorStop(0.68, "#0000ff"); // Blue
            grad.addColorStop(0.85, "#4B0082"); // Indigo
            grad.addColorStop(1, "#9400D3"); // Violet
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = "#888";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground
        if (!useLowGraphics) {
            ctx.fillStyle = "#228B22";
            ctx.fillRect(0, canvas.height*0.7, canvas.width, canvas.height*0.3);
        } else {
            ctx.fillStyle = "#333";
            ctx.fillRect(0, canvas.height*0.7, canvas.width, canvas.height*0.3);
        }

        // Draw player/camera
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);

        if (!firstPerson) {
            // Third person: draw simple player avatar
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(0, 50, 24, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = "#000";
            ctx.fillRect(-7, 74, 14, 28); // Body
        }

        ctx.restore();

        // UI text
        ctx.font = "20px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText(`Mode: ${firstPerson ? "First Person" : "Third Person"}`, 16, 36);
        ctx.fillText(`Low Graphics: ${useLowGraphics ? "ON" : "OFF"}`, 16, 60);
        ctx.fillText("Fly: WASD/arrows, Space=up, Shift=down, M=change view, G=low graphics", 16, 84);
        ctx.fillText("Click canvas for mouse look (pointer lock)", 16, 108);
    }

    function gameLoop() {
        update();
        render();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();

})();