// ==UserScript==
// @name         Krunker.io Aimbot + ESP + FOV + Speed/Fly (Educational)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Aimbot, ESP, FOV, Speed, Fly, Team Check, Auto Shoot for Krunker.io. Press "/" to toggle GUI. Press "F" to toggle Fly mode. (EDUCATIONAL)
// @author       16saiphh
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549744/Krunkerio%20Aimbot%20%2B%20ESP%20%2B%20FOV%20%2B%20SpeedFly%20%28Educational%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549744/Krunkerio%20Aimbot%20%2B%20ESP%20%2B%20FOV%20%2B%20SpeedFly%20%28Educational%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIG =====
    let aimbotEnabled = false;
    let espEnabled = false;
    let speedEnabled = false;
    let flyEnabled = false;
    let teamCheck = true;
    let autoShoot = false;
    let fovSize = 140;
    let speedValue = 2.5; // 1 = normal, higher = faster
    let flyValue = 1.5;   // How much you rise per second

    // ===== GUI =====
    let gui, aimBtn, espBtn, speedBtn, flyBtn, fovSlider, fovLabel, teamBtn, autoShootBtn;
    let guiVisible = true;
    function createGUI() {
        gui = document.createElement('div');
        gui.id = "__krunker_cheat_gui";
        gui.style.position = 'fixed';
        gui.style.top = '80px';
        gui.style.right = '20px';
        gui.style.background = 'rgba(30,30,30,0.9)';
        gui.style.color = '#fff';
        gui.style.padding = '12px 14px 10px 14px';
        gui.style.borderRadius = '10px';
        gui.style.fontFamily = 'consolas, monospace';
        gui.style.zIndex = 99999;
        gui.style.userSelect = 'none';
        gui.style.fontSize = '16px';
        gui.style.minWidth = '200px';
        gui.innerHTML = `<b>Krunker Aimbot/ESP (16saiphh)</b><br><br>`;

        aimBtn = document.createElement('button');
        aimBtn.innerText = "Aimbot: OFF";
        aimBtn.style.marginRight = "5px";
        aimBtn.style.marginBottom = "6px";
        gui.appendChild(aimBtn);

        espBtn = document.createElement('button');
        espBtn.innerText = "ESP: OFF";
        espBtn.style.marginRight = "5px";
        espBtn.style.marginBottom = "6px";
        gui.appendChild(espBtn);

        speedBtn = document.createElement('button');
        speedBtn.innerText = "Speed: OFF";
        speedBtn.style.marginRight = "5px";
        speedBtn.style.marginBottom = "6px";
        gui.appendChild(speedBtn);

        flyBtn = document.createElement('button');
        flyBtn.innerText = "Fly: OFF";
        flyBtn.style.marginBottom = "6px";
        gui.appendChild(flyBtn);

        teamBtn = document.createElement('button');
        teamBtn.innerText = "TeamCheck: ON";
        teamBtn.style.marginBottom = "6px";
        teamBtn.style.marginLeft = "5px";
        gui.appendChild(teamBtn);

        autoShootBtn = document.createElement('button');
        autoShootBtn.innerText = "AutoShoot: OFF";
        autoShootBtn.style.marginBottom = "6px";
        autoShootBtn.style.marginLeft = "5px";
        gui.appendChild(autoShootBtn);

        gui.appendChild(document.createElement('br'));
        fovLabel = document.createElement('span');
        fovLabel.innerText = "FOV: " + fovSize;
        fovLabel.style.marginRight = "5px";
        gui.appendChild(fovLabel);

        fovSlider = document.createElement('input');
        fovSlider.type = "range";
        fovSlider.min = "30";
        fovSlider.max = "400";
        fovSlider.value = fovSize;
        fovSlider.step = "2";
        fovSlider.style.width = "90px";
        fovSlider.style.verticalAlign = "middle";
        gui.appendChild(fovSlider);

        document.body.appendChild(gui);

        aimBtn.onclick = ()=>{aimbotEnabled=!aimbotEnabled; aimBtn.innerText="Aimbot: "+(aimbotEnabled?"ON":"OFF");};
        espBtn.onclick =  ()=>{espEnabled=!espEnabled; espBtn.innerText="ESP: "+(espEnabled?"ON":"OFF");};
        speedBtn.onclick = ()=>{speedEnabled=!speedEnabled; speedBtn.innerText="Speed: "+(speedEnabled?"ON":"OFF");};
        flyBtn.onclick = ()=>{flyEnabled=!flyEnabled; flyBtn.innerText="Fly: "+(flyEnabled?"ON":"OFF");};
        teamBtn.onclick = ()=>{teamCheck=!teamCheck; teamBtn.innerText="TeamCheck: "+(teamCheck?"ON":"OFF");};
        autoShootBtn.onclick = ()=>{autoShoot=!autoShoot; autoShootBtn.innerText="AutoShoot: "+(autoShoot?"ON":"OFF");};
        fovSlider.oninput = ()=>{fovSize=+fovSlider.value; fovLabel.innerText="FOV: "+fovSize;};
    }
    createGUI();

    // ===== GUI TOGGLE ("/" key) =====
    document.addEventListener('keydown', function(e){
        if (e.key === "/" && !e.repeat) {
            guiVisible = !guiVisible;
            gui.style.display = guiVisible ? "" : "none";
        }
        // Fly keybind
        if(e.code==="KeyF" && !e.repeat) {
            flyEnabled = !flyEnabled;
            flyBtn.innerText = "Fly: "+(flyEnabled?"ON":"OFF");
        }
        // Other fast toggles (optional)
        if(e.code==="KeyY" && !e.repeat) {aimbotEnabled=!aimbotEnabled; aimBtn.innerText="Aimbot: "+(aimbotEnabled?"ON":"OFF");}
        if(e.code==="KeyU" && !e.repeat) {espEnabled=!espEnabled; espBtn.innerText="ESP: "+(espEnabled?"ON":"OFF");}
        if(e.code==="KeyI" && !e.repeat) {speedEnabled=!speedEnabled; speedBtn.innerText="Speed: "+(speedEnabled?"ON":"OFF");}
        // (fly is now F key)
    });

    // ===== CANVAS for ESP and FOV =====
    let overlay = document.createElement('canvas');
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = 9999;
    document.body.appendChild(overlay);

    window.addEventListener('resize', ()=>{
        overlay.width = window.innerWidth;
        overlay.height = window.innerHeight;
    });

    // ===== GAME DATA HOOKING =====
    let inputs = null, me = null, players = [], world = null, gameActive = false;

    // Try to hook into game variables
    function gameHook() {
        // Krunker always attaches "window.inputs", "window.me", "window.players", "window.world"
        if (!window.inputs || !window.me || !window.players || !window.world) return false;
        inputs = window.inputs;
        me = window.me;
        players = window.players.list;
        world = window.world;
        return true;
    }

    // ===== FOV CIRCLE =====
    function drawFov(ctx, fov, color="rgba(0,220,0,0.45)") {
        let x = overlay.width/2, y = overlay.height/2;
        ctx.beginPath();
        ctx.arc(x, y, fov, 0, Math.PI*2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    // ===== ESP BOX DRAWING =====
    function worldToScreen(x,y,z) {
        // Use game's camera matrix
        if (!window.me || !window.me.camera || !window.me.camera.getWorldPosition) return [0,0,0];
        let pos = new window.THREE.Vector3(x,y,z);
        pos.project(window.me.camera);
        let sx = (pos.x+1)/2*overlay.width, sy = (-pos.y+1)/2*overlay.height;
        return [sx, sy, pos.z];
    }
    function drawBox(ctx, target, color) {
        // Use head and feet pos for box
        let head = worldToScreen(target.x, target.y+target.height-0.2, target.z);
        let feet = worldToScreen(target.x, target.y-0.2, target.z);
        let h = Math.abs(head[1] - feet[1]);
        let w = h/2.2;
        let cx = head[0];
        ctx.beginPath();
        ctx.rect(cx-w/2, head[1], w, h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // ===== AIMBOT LOGIC =====
    function getClosestPlayerInFov() {
        let best = null, bestDist = 99999;
        players.forEach(p=>{
            if(!p.active || p.health<=0 || p.team==me.team && teamCheck || p==me) return;
            // Center of screen
            let [sx,sy,sz] = worldToScreen(p.x, p.y+p.height/2, p.z);
            if(sz > 1) return; // behind camera
            let dx = sx - overlay.width/2, dy = sy - overlay.height/2;
            let dist = Math.sqrt(dx*dx+dy*dy);
            if(dist < fovSize && dist < bestDist) {
                bestDist = dist;
                best = p;
            }
        });
        return best;
    }

    // ===== FLY/SPEED HOOK =====
    setInterval(()=>{
        if(gameHook()) {
            if(speedEnabled) me.velocity = me.velocity.map(v=>v*speedValue);
            if(flyEnabled) me.velocity[1] += flyValue;
        }
    }, 50);

    // ===== MAIN LOOP (DRAW & LOGIC) =====
    function mainLoop() {
        if(!gameHook()) return requestAnimationFrame(mainLoop);

        // Draw overlay
        let ctx = overlay.getContext('2d');
        ctx.clearRect(0,0,overlay.width,overlay.height);

        // FOV
        drawFov(ctx, fovSize);

        // ESP
        if(espEnabled) {
            players.forEach(p=>{
                if(!p.active || p.health<=0 || p==me) return;
                let col = (teamCheck && p.team==me.team) ? "#00f" : "#0f0";
                drawBox(ctx,p,col);
            });
        }

        // Aimbot
        let aimTarget = null;
        if(aimbotEnabled) {
            aimTarget = getClosestPlayerInFov();
            if(aimTarget) {
                // Aim at head
                let dx = aimTarget.x-me.x, dy = (aimTarget.y+aimTarget.height/2)-me.y, dz = aimTarget.z-me.z;
                let yaw = Math.atan2(-dx, -dz);
                let pitch = Math.atan2(dy, Math.sqrt(dx*dx+dz*dz));
                me.pitch = pitch;
                me.yaw = yaw;

                // Auto shoot
                if(autoShoot && me.weapon && me.weapon.canShoot && Date.now()-me.lastShot>me.weapon.rate)
                    me.shoot();
            }
        }

        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);

    // ===== DRAGGABLE GUI =====
    // Credit: stackoverflow
    let drag = false, offsetX, offsetY;
    gui.addEventListener('mousedown', function(e){
        drag = true; offsetX = e.clientX - gui.offsetLeft; offsetY = e.clientY - gui.offsetTop;
    });
    document.addEventListener('mousemove', function(e){
        if(!drag) return;
        gui.style.left = (e.clientX-offsetX)+"px";
        gui.style.top = (e.clientY-offsetY)+"px";
    });
    document.addEventListener('mouseup', function(){drag=false;});

})();