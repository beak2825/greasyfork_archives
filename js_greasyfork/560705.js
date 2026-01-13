// ==UserScript==
// @name         KremCheats - KRUNKER
// @version      1.4
// @icon         https://i.imgur.com/zv8kMZS.png
// @description   Krunker  beta - ESP, Aimbot, Rage, Triggerbot and more
// @author       KremCheats
// @license      All Rights Reserved
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/1546742
// @downloadURL https://update.greasyfork.org/scripts/560705/KremCheats%20-%20KRUNKER.user.js
// @updateURL https://update.greasyfork.org/scripts/560705/KremCheats%20-%20KRUNKER.meta.js
// ==/UserScript==
 
/*
 * KremCheats v1.0 - Premium Edition
 * Copyright (c) 2024 KremityssYT
 * All Rights Reserved - Private Code
 * Discord: https://discord.gg/MHCcGgsX56
 */
 
(function(_0x4f8a2b) {
    'use strict';
 
    var _0xa = window.alert, _0xb = window.confirm, _0xc = window.prompt;
    window.alert = function(_0xm) { if (_0xm && typeof _0xm === 'string') { var _0xl = _0xm.toLowerCase(); if (_0xl.includes('extension') || _0xl.includes('disable') || _0xl.includes('plugin') || _0xl.includes('blocker') || _0xl.includes('detected')) return; } return _0xa.apply(this, arguments); };
    window.confirm = function(_0xm) { if (_0xm && typeof _0xm === 'string') { var _0xl = _0xm.toLowerCase(); if (_0xl.includes('extension') || _0xl.includes('disable') || _0xl.includes('plugin') || _0xl.includes('blocker') || _0xl.includes('detected')) return false; } return _0xb.apply(this, arguments); };
    window.prompt = function(_0xm) { if (_0xm && typeof _0xm === 'string') { var _0xl = _0xm.toLowerCase(); if (_0xl.includes('extension') || _0xl.includes('disable') || _0xl.includes('plugin')) return null; } return _0xc.apply(this, arguments); };
 
    try { Object.defineProperty(navigator, 'plugins', { get: function() { return []; }, configurable: true }); } catch(_0xe) {}
    try { Object.defineProperty(navigator, 'webdriver', { get: function() { return false; }, configurable: true }); } catch(_0xe) {}
 
    var _0xgt = Date.prototype.getTime;
    Date.prototype.getTime = function() { return _0xgt.call(this) + Math.random() * 2 - 1; };
 
    window.chrome = window.chrome || {};
    window.chrome.runtime = undefined;
 
    var _0xof = window.fetch;
    window.fetch = function() { var _0xu = arguments[0]; if (typeof _0xu === 'string' && _0xu.includes('chrome-extension://')) return Promise.reject(new Error('blocked')); return _0xof.apply(this, arguments); };
 
    var DISCORD_URL = 'https://discord.gg/MHCcGgsX56';
    var LOGO_URL = 'https://i.imgur.com/zv8kMZS.png';
 
    var colorList = [
        { name: "Red", value: "1.0, 0.0, 0.0", hex: "#ff0000" },
        { name: "Orange", value: "1.0, 0.5, 0.0", hex: "#ff8000" },
        { name: "Yellow", value: "1.0, 1.0, 0.0", hex: "#ffff00" },
        { name: "Green", value: "0.0, 1.0, 0.0", hex: "#00ff00" },
        { name: "Cyan", value: "0.0, 1.0, 1.0", hex: "#00ffff" },
        { name: "Blue", value: "0.0, 0.0, 1.0", hex: "#0000ff" },
        { name: "Purple", value: "0.5, 0.0, 1.0", hex: "#8000ff" },
        { name: "Pink", value: "1.0, 0.0, 0.5", hex: "#ff0080" },
        { name: "White", value: "1.0, 1.0, 1.0", hex: "#ffffff" }
    ];
 
    var defaultCfg = {
        aimbotOn: true,
        aimbone: 'head',
        aimStr: 10000,
        aimKey: 'MouseRight',
        vertAdj: 9.5,
        vertOn: true,
        predInt: 1.0,
        aimSmooth: 0.1,
        visCheck: false,
 
        rageOn: false,
        rageSmooth: 0.6,
        rageOff: 0.6,
        rageDist: 100000,
        rageVis: false,
        rageBone: 'head',
        rageKey: 'None',
        rageAlways: true,
 
        triggerOn: false,
        triggerFov: 30,
        triggerDelay: 50,
 
        fovOn: true,
        fovShow: true,
        fovSize: 200,
        fovCol: '#ff0000',
        fovRgb: false,
 
        espOn: true,
        espIdx: 0,
        espCol: "1.0, 0.0, 0.0",
        espThick: 2,
        espDist: true,
        espMax: 500,
        espHp: true,
        espLine: false,
        espLinePos: 'bottom',
        espRgb: false,
 
        wireOn: false,
        wireRgb: false,
        worldWire: false,
        chamsOn: true,
        chamsCol: '#ff0000',
 
        tpOn: false,
        camX: 0,
        camY: 2,
        camZ: -5,
 
        noRecoil: 0,
        silentOn: false,
        speedOn: false,
        speedVal: 1.5,
        jumpOn: false,
        bhopOn: false,
 
        uiHidden: false,
 
        keys: {
            togAim: 'KeyT',
            togEsp: 'KeyE',
            cycCol: 'KeyC',
            togRgb: 'KeyR'
        }
    };
 
    var cfg = Object.assign({}, defaultCfg, GM_getValue('kremCfg', {}));
 
    var sceneRef = null, initTimer = null;
    var rightDown = false, keyDown = false, rageKeyDown = false;
    var lockOn = false, locked = null, posHist = {};
    var rgbLoop = null, hue = 0, localRef = null;
    var lastTrigger = 0;
 
    var stablePitch = null, stableYaw = null, stableRotY = null, stableChildX = null;
    var firing = false, lastFire = 0;
 
    var gameState = null, playerObj = null, inputObj = null;
 
    function waitGame() {
        if (typeof window.gameState !== "undefined" && typeof window.player !== "undefined" && typeof window.input !== "undefined") {
            gameState = window.gameState;
            playerObj = window.player;
            inputObj = window.input;
        } else {
            setTimeout(waitGame, 500);
        }
    }
    waitGame();
 
    setInterval(function() {
        if (!playerObj || !gameState) {
            if (typeof window.player !== "undefined") playerObj = window.player;
            if (typeof window.gameState !== "undefined") gameState = window.gameState;
            if (typeof window.input !== "undefined") inputObj = window.input;
        }
    }, 2000);
 
    var Engine = window.THREE;
    delete window.THREE;
 
    var utils = { win: window, doc: document, arrPush: Array.prototype.push, raf: window.requestAnimationFrame };
 
    var detectScene = function(obj) {
        try {
            if (typeof obj === 'object' && typeof obj.parent === 'object' && obj.parent.type === 'Scene' && obj.parent.name === 'Main') {
                sceneRef = obj.parent;
                Array.prototype.push = utils.arrPush;
            }
        } catch (e) {}
        return utils.arrPush.apply(this, arguments);
    };
 
    var tempVec = new Engine.Vector3();
    var tempObj = new Engine.Object3D();
    tempObj.rotation.order = 'YXZ';
 
    var boxGeo = new Engine.EdgesGeometry(new Engine.BoxGeometry(4.8, 14.8, 4.8).translate(0, 7.4, 0));
 
    var espMat = new Engine.RawShaderMaterial({
        vertexShader: 'attribute vec3 position;uniform mat4 projectionMatrix;uniform mat4 modelViewMatrix;void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);p.z=0.1;gl_Position=p;}',
        fragmentShader: 'precision mediump float;uniform vec3 espColor;void main(){gl_FragColor=vec4(espColor,1.0);}',
        uniforms: { espColor: { value: new Engine.Vector3(1.0, 0.0, 0.0) } },
        depthTest: false, depthWrite: false, transparent: true
    });
 
    var tgtMat = new Engine.RawShaderMaterial({
        vertexShader: 'attribute vec3 position;uniform mat4 projectionMatrix;uniform mat4 modelViewMatrix;void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);p.z=0.1;gl_Position=p;}',
        fragmentShader: 'void main(){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}',
        depthTest: false, depthWrite: false, transparent: true
    });
 
    var lineGeo = new Engine.BufferGeometry();
    var linePos = new Engine.BufferAttribute(new Float32Array(300), 3);
    lineGeo.setAttribute('position', linePos);
 
    var lineMat = new Engine.LineBasicMaterial({ color: 0xff0000, linewidth: 2, depthTest: false, depthWrite: false, transparent: true });
    var lineVis = new Engine.LineSegments(lineGeo, lineMat);
    lineVis.frustumCulled = false;
    lineVis.renderOrder = 9998;
 
    var hpCanvas = document.createElement('canvas');
    hpCanvas.width = window.innerWidth;
    hpCanvas.height = window.innerHeight;
    hpCanvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;';
 
    var raycaster = new Engine.Raycaster();
 
    function updateEspColor() {
        var parts = cfg.espCol.split(',').map(function(v) { return parseFloat(v.trim()); });
        espMat.uniforms.espColor.value.set(parts[0], parts[1], parts[2]);
        lineMat.color.setRGB(parts[0], parts[1], parts[2]);
    }
 
    function saveCfg() { GM_setValue('kremCfg', cfg); }
 
    function startRgb() {
        if (rgbLoop) return;
        rgbLoop = setInterval(function() {
            hue = (hue + 2) % 360;
            var rgb = hslRgb(hue / 360, 1, 0.5);
            if (cfg.espRgb) {
                cfg.espCol = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
                updateEspColor();
            }
            if (cfg.fovRgb) {
                var fov = document.getElementById('krem-fov');
                if (fov) fov.style.borderColor = 'hsl(' + hue + ', 100%, 50%)';
            }
            if (cfg.wireRgb) {
                cfg.chamsCol = 'hsl(' + hue + ', 100%, 50%)';
            }
        }, 30);
    }
 
    function stopRgb() {
        if (rgbLoop) { clearInterval(rgbLoop); rgbLoop = null; }
    }
 
    function hslRgb(h, s, l) {
        var r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            var hue2rgb = function(p, q, t) {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: r.toFixed(2), g: g.toFixed(2), b: b.toFixed(2) };
    }
 
    function blockMouse(e) { e.stopImmediatePropagation(); e.preventDefault(); }
 
    function onDown(e) {
        if (cfg.aimKey === 'MouseRight' && e.button === 2) { keyDown = true; rightDown = true; }
        else if (cfg.aimKey === 'MouseLeft' && e.button === 0) { keyDown = true; }
        else if (cfg.aimKey === 'MouseMiddle' && e.button === 1) { keyDown = true; }
        if (cfg.rageKey === 'MouseRight' && e.button === 2) rageKeyDown = true;
        else if (cfg.rageKey === 'MouseLeft' && e.button === 0) rageKeyDown = true;
        else if (cfg.rageKey === 'MouseMiddle' && e.button === 1) rageKeyDown = true;
    }
 
    function onUp(e) {
        if (e.button === 2 || e.button === 0 || e.button === 1) {
            rightDown = false; keyDown = false; rageKeyDown = false; lockOn = false; locked = null;
            document.removeEventListener('mousemove', blockMouse, true);
        }
    }
 
    function getHp(ent) {
        try {
            if (!gameState || !gameState.players) return 100;
            var players = Object.values(gameState.players);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (p && p.pos) {
                    var dx = Math.abs(p.pos.x - ent.position.x);
                    var dz = Math.abs(p.pos.z - ent.position.z);
                    if (dx < 1 && dz < 1) return p.health || 100;
                }
            }
            return ent.health !== undefined ? ent.health : 100;
        } catch (e) { return 100; }
    }
 
    function applySpeed() {
        try {
            if (!playerObj) return;
            if (playerObj.velocity) {
                playerObj.velocity.x *= cfg.speedVal;
                playerObj.velocity.z *= cfg.speedVal;
            }
        } catch (e) {}
    }
 
    function applyBhop() {
        try {
            if (!playerObj || !cfg.bhopOn) return;
            if (playerObj.onGround || playerObj.grounded || (playerObj.velocity && playerObj.velocity.y === 0)) {
                if (playerObj.velocity) playerObj.velocity.y = 0.11;
                if (playerObj.canJump !== undefined) playerObj.canJump = true;
            }
        } catch (e) {}
    }
 
    function applyJump() {
        try {
            if (!playerObj) return;
            if (playerObj.jumpHeight !== undefined) {
                if (!playerObj._ojh) playerObj._ojh = playerObj.jumpHeight;
                playerObj.jumpHeight = playerObj._ojh * 1.8;
            }
            if (playerObj.jumpVel !== undefined) {
                if (!playerObj._ojv) playerObj._ojv = playerObj.jumpVel;
                playerObj.jumpVel = playerObj._ojv * 1.5;
            }
        } catch (e) {}
    }
 
    function applyNoRecoil() {
        try {
            if (cfg.noRecoil === 0 || !playerObj) return;
            var red = cfg.noRecoil / 100;
            if (playerObj.weapon) {
                if (playerObj.weapon.recoil !== undefined) playerObj.weapon.recoil *= (1 - red);
                if (playerObj.weapon.recoilMult !== undefined) playerObj.weapon.recoilMult = (1 - red);
            }
            if (playerObj.recoil !== undefined) playerObj.recoil *= (1 - red);
            if (playerObj.recoilAnimY !== undefined) playerObj.recoilAnimY *= (1 - red);
            if (playerObj.recoilAnimX !== undefined) playerObj.recoilAnimX *= (1 - red);
 
            if (cfg.noRecoil === 100) {
                var now = Date.now();
                var isFiring = playerObj.didShoot || (playerObj.weapon && playerObj.weapon.shooting) || (inputObj && inputObj.mouseDown) || (now - lastFire < 100);
                if (playerObj.didShoot) lastFire = now;
 
                if (isFiring && !firing) {
                    if (playerObj.camera) { stablePitch = playerObj.camera.pitch; stableYaw = playerObj.camera.yaw; }
                    stableRotY = playerObj.rotation ? playerObj.rotation.y : null;
                    if (playerObj.children && playerObj.children[0]) stableChildX = playerObj.children[0].rotation.x;
                    firing = true;
                }
 
                if (firing) {
                    if (playerObj.camera && stablePitch !== null) {
                        playerObj.camera.pitch = stablePitch;
                        playerObj.camera.yaw = stableYaw;
                    }
                    if (stableRotY !== null && playerObj.rotation) playerObj.rotation.y = stableRotY;
                    if (playerObj.children && playerObj.children[0] && stableChildX !== null) playerObj.children[0].rotation.x = stableChildX;
                    if (playerObj.recoilAnimY !== undefined) playerObj.recoilAnimY = 0;
                    if (playerObj.recoilAnimX !== undefined) playerObj.recoilAnimX = 0;
                    if (playerObj.weapon) {
                        if (playerObj.weapon.recoil !== undefined) playerObj.weapon.recoil = 0;
                        if (playerObj.weapon.spread !== undefined) playerObj.weapon.spread = 0;
                    }
                }
 
                if (!isFiring && firing) {
                    firing = false;
                    stablePitch = null; stableYaw = null; stableRotY = null; stableChildX = null;
                }
            }
        } catch (e) {}
    }
 
    function applyWireframe(ent) {
        try {
            if (!ent.children || !ent.children[0] || !ent.children[0].children) return;
            var mesh = ent.children[0].children[0];
            if (mesh && mesh.material) {
                mesh.material.wireframe = cfg.wireOn;
                mesh.material.transparent = true;
                mesh.material.fog = false;
                mesh.material.depthWrite = false;
                if (cfg.chamsOn) {
                    mesh.material.depthTest = false;
                    var col = new Engine.Color(cfg.chamsCol);
                    if (mesh.material.color) mesh.material.color.copy(col);
                    if (mesh.material.emissive) mesh.material.emissive.copy(col);
                } else {
                    mesh.material.depthTest = true;
                }
            }
        } catch (e) {}
    }
 
    function isVisible(from, to, scene) {
        if (!cfg.rageVis) return true;
        try {
            var dir = new Engine.Vector3().subVectors(to, from).normalize();
            raycaster.set(from, dir);
            raycaster.far = from.distanceTo(to);
            var walls = scene.children.filter(function(c) { return c.type === 'Mesh' && c.geometry; });
            var hits = raycaster.intersectObjects(walls, true);
            return hits.length === 0;
        } catch (e) { return true; }
    }
 
    function isTeammate(ent, local) {
        try {
            if (!gameState || !gameState.players) return false;
            var localTeam = null, entTeam = null;
            var players = Object.values(gameState.players);
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (p && p.pos) {
                    if (Math.abs(p.pos.x - local.position.x) < 1 && Math.abs(p.pos.z - local.position.z) < 1) localTeam = p.team;
                    if (Math.abs(p.pos.x - ent.position.x) < 1 && Math.abs(p.pos.z - ent.position.z) < 1) entTeam = p.team;
                }
            }
            return localTeam !== null && entTeam !== null && localTeam === entTeam;
        } catch (e) { return false; }
    }
 
    function hasHead(ent) {
        try {
            return ent.children && ent.children[0] && ent.children[0].children && ent.children[0].children.length > 4 &&
                   ent.children[0].children[4] && ent.children[0].children[4].children &&
                   ent.children[0].children[4].children[0] && ent.children[0].children[4].children[0].name === 'head';
        } catch (e) { return false; }
    }
 
    function getHeadPos(ent) {
        var pos = new Engine.Vector3();
        try {
            if (hasHead(ent)) {
                ent.children[0].children[4].children[0].getWorldPosition(pos);
            } else {
                pos.copy(ent.position);
                pos.y += 11;
            }
        } catch (e) {
            pos.copy(ent.position);
            pos.y += 11;
        }
        return pos;
    }
 
    function getTargetPos(ent, bone) {
        var pos = getHeadPos(ent);
        if (bone === 'chest') pos.y -= 4;
        else if (bone === 'body') pos.y -= 7;
        return pos;
    }
 
    function getKeyName(code) {
        if (!code || code === 'None') return 'None';
        if (code.startsWith('Key')) return code.replace('Key', '');
        if (code.startsWith('Mouse')) return code.replace('Mouse', 'M');
        return code.replace('Left', '').replace('Right', '');
    }
 
    function initUI() {
        if (document.getElementById('krem-root')) return;
 
        var root = document.createElement('div');
        root.id = 'krem-root';
        root.innerHTML = [
            '<style>',
            '#krem-root{font-family:"Segoe UI",Arial,sans-serif;user-select:none}',
            '.km{position:fixed;top:60px;left:60px;width:520px;background:linear-gradient(180deg,#0d0d0d 0%,#080808 100%);border:1px solid #1a1a1a;border-radius:6px;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.95)}',
            '.km.min .km-body{display:none}',
            '.km-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(90deg,#0f0f0f 0%,#151515 100%);border-bottom:2px solid #ff0000;border-radius:6px 6px 0 0;cursor:move}',
            '.km-hdr-l{display:flex;align-items:center;gap:12px}',
            '.km-logo{width:36px;height:36px;border-radius:6px;border:1px solid #ff0000}',
            '.km-title{font-size:16px;font-weight:800;color:#ff0000;letter-spacing:2px;text-shadow:0 0 10px rgba(255,0,0,0.5)}',
            '.km-ver{font-size:10px;color:#555;margin-top:2px}',
            '.km-hdr-r{display:flex;gap:8px}',
            '.km-btn{width:28px;height:28px;border:1px solid #333;background:rgba(255,0,0,0.1);color:#ff0000;border-radius:4px;cursor:pointer;font-size:14px;font-weight:bold;transition:all 0.2s}',
            '.km-btn:hover{background:rgba(255,0,0,0.3);border-color:#ff0000}',
            '.km-dc{padding:6px 12px;background:linear-gradient(135deg,#5865F2 0%,#4752C4 100%);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;transition:all 0.2s}',
            '.km-dc:hover{transform:scale(1.05);box-shadow:0 0 12px rgba(88,101,242,0.5)}',
            '.km-body{display:flex;height:420px}',
            '.km-nav{width:110px;background:#080808;border-right:1px solid #151515;padding:8px 0}',
            '.km-tab{padding:12px 14px;font-size:11px;font-weight:700;color:#444;cursor:pointer;border-left:3px solid transparent;transition:all 0.2s;letter-spacing:0.5px}',
            '.km-tab:hover{color:#888;background:rgba(255,255,255,0.02)}',
            '.km-tab.on{color:#ff0000;background:linear-gradient(90deg,rgba(255,0,0,0.1) 0%,transparent 100%);border-left-color:#ff0000}',
            '.km-main{flex:1;overflow-y:auto;padding:14px}',
            '.km-main::-webkit-scrollbar{width:6px}',
            '.km-main::-webkit-scrollbar-track{background:#080808}',
            '.km-main::-webkit-scrollbar-thumb{background:#ff0000;border-radius:3px}',
            '.km-pnl{display:none}',
            '.km-pnl.on{display:block}',
            '.km-sec{background:linear-gradient(180deg,#0f0f0f 0%,#0a0a0a 100%);border:1px solid #1a1a1a;border-radius:6px;padding:14px;margin-bottom:12px}',
            '.km-sec-t{font-size:11px;font-weight:800;color:#ff0000;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;border-bottom:1px solid #1a1a1a}',
            '.km-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #111}',
            '.km-row:last-child{border-bottom:none}',
            '.km-lbl{font-size:12px;color:#888}',
            '.km-tog{width:40px;height:20px;background:#1a1a1a;border-radius:10px;position:relative;cursor:pointer;transition:all 0.2s;border:1px solid #222}',
            '.km-tog::after{content:"";position:absolute;width:16px;height:16px;background:#444;border-radius:50%;top:1px;left:2px;transition:all 0.2s}',
            '.km-tog.on{background:#ff0000;border-color:#ff0000}',
            '.km-tog.on::after{left:21px;background:#fff}',
            '.km-sld-w{padding:8px 0}',
            '.km-sld-h{display:flex;justify-content:space-between;font-size:12px;color:#888;margin-bottom:6px}',
            '.km-sld-v{color:#ff0000;font-weight:700}',
            '.km-sld{width:100%;height:4px;-webkit-appearance:none;background:#1a1a1a;border-radius:2px;outline:none}',
            '.km-sld::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;background:#ff0000;border-radius:50%;cursor:pointer;box-shadow:0 0 8px rgba(255,0,0,0.5)}',
            '.km-sel{width:100%;padding:8px 10px;background:#111;border:1px solid #222;border-radius:4px;color:#aaa;font-size:12px;outline:none}',
            '.km-sel:focus{border-color:#ff0000}',
            '.km-sel option{background:#0a0a0a}',
            '.km-key{padding:6px 12px;background:#111;border:1px solid #222;border-radius:4px;color:#ff0000;font-size:10px;font-weight:700;cursor:pointer;min-width:60px;text-align:center;transition:all 0.2s}',
            '.km-key:hover{border-color:#ff0000;box-shadow:0 0 8px rgba(255,0,0,0.3)}',
            '.km-key.rec{background:#ff0000;color:#000}',
            '.km-col{width:60px;height:28px;border:1px solid #222;border-radius:4px;cursor:pointer;background:transparent}',
            '#krem-fov{position:fixed;border:2px solid;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}',
            '</style>',
            '<div class="km" id="km">',
            '<div class="km-hdr" id="km-hdr">',
            '<div class="km-hdr-l">',
            '<img class="km-logo" src="' + LOGO_URL + '">',
            '<div><div class="km-title">KremCheats - KrunkBrutal</div><div class="km-ver">Version 1.0</div></div>',
            '</div>',
            '<div class="km-hdr-r">',
            '<button class="km-dc" onclick="window.open(\'' + DISCORD_URL + '\',\'_blank\')">DISCORD</button>',
            '<button class="km-btn" id="km-min">−</button>',
            '</div>',
            '</div>',
            '<div class="km-body">',
            '<div class="km-nav">',
            '<div class="km-tab on" data-t="aim">AIMBOT</div>',
            '<div class="km-tab" data-t="rage">RAGE</div>',
            '<div class="km-tab" data-t="esp">ESP</div>',
            '<div class="km-tab" data-t="vis">VISUALS</div>',
            '<div class="km-tab" data-t="misc">MISC</div>',
            '<div class="km-tab" data-t="cfg">CONFIG</div>',
            '</div>',
            '<div class="km-main">',
 
            '<div class="km-pnl on" data-p="aim">',
            '<div class="km-sec">',
            '<div class="km-sec-t">Aimbot Settings</div>',
            '<div class="km-row"><span class="km-lbl">Enable Aimbot</span><div class="km-tog' + (cfg.aimbotOn ? ' on' : '') + '" data-k="aimbotOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Prediction</span><div class="km-tog' + (cfg.vertOn ? ' on' : '') + '" data-k="vertOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Visibility Check</span><div class="km-tog' + (cfg.visCheck ? ' on' : '') + '" data-k="visCheck"></div></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Target Bone</div>',
            '<select class="km-sel" id="aimbone">',
            '<option value="head"' + (cfg.aimbone === 'head' ? ' selected' : '') + '>Head</option>',
            '<option value="chest"' + (cfg.aimbone === 'chest' ? ' selected' : '') + '>Chest</option>',
            '<option value="body"' + (cfg.aimbone === 'body' ? ' selected' : '') + '>Body</option>',
            '</select>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Aim Settings</div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Aim Strength</span><span class="km-sld-v" id="aimStr-v">' + cfg.aimStr + '</span></div><input type="range" class="km-sld" id="aimStr" min="100" max="20000" value="' + cfg.aimStr + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Prediction</span><span class="km-sld-v" id="predInt-v">' + cfg.predInt.toFixed(1) + '</span></div><input type="range" class="km-sld" id="predInt" min="0" max="3" step="0.1" value="' + cfg.predInt + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Vertical Offset</span><span class="km-sld-v" id="vertAdj-v">' + cfg.vertAdj.toFixed(1) + '</span></div><input type="range" class="km-sld" id="vertAdj" min="0" max="20" step="0.5" value="' + cfg.vertAdj + '"></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">FOV Circle</div>',
            '<div class="km-row"><span class="km-lbl">Enable FOV</span><div class="km-tog' + (cfg.fovOn ? ' on' : '') + '" data-k="fovOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Show Circle</span><div class="km-tog' + (cfg.fovShow ? ' on' : '') + '" data-k="fovShow"></div></div>',
            '<div class="km-row"><span class="km-lbl">RGB FOV</span><div class="km-tog' + (cfg.fovRgb ? ' on' : '') + '" data-k="fovRgb"></div></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>FOV Size</span><span class="km-sld-v" id="fovSize-v">' + cfg.fovSize + '</span></div><input type="range" class="km-sld" id="fovSize" min="50" max="600" value="' + cfg.fovSize + '"></div>',
            '</div>',
            '</div>',
 
            '<div class="km-pnl" data-p="rage">',
            '<div class="km-sec">',
            '<div class="km-sec-t">Rage Aimbot</div>',
            '<div class="km-row"><span class="km-lbl">Enable Rage</span><div class="km-tog' + (cfg.rageOn ? ' on' : '') + '" data-k="rageOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Always Active</span><div class="km-tog' + (cfg.rageAlways ? ' on' : '') + '" data-k="rageAlways"></div></div>',
            '<div class="km-row"><span class="km-lbl">Visible Only</span><div class="km-tog' + (cfg.rageVis ? ' on' : '') + '" data-k="rageVis"></div></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Rage Target</div>',
            '<select class="km-sel" id="rageBone">',
            '<option value="head"' + (cfg.rageBone === 'head' ? ' selected' : '') + '>Head</option>',
            '<option value="chest"' + (cfg.rageBone === 'chest' ? ' selected' : '') + '>Chest</option>',
            '<option value="body"' + (cfg.rageBone === 'body' ? ' selected' : '') + '>Body</option>',
            '</select>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Rage Key</div>',
            '<select class="km-sel" id="rageKey">',
            '<option value="None"' + (cfg.rageKey === 'None' ? ' selected' : '') + '>None (Always)</option>',
            '<option value="MouseRight"' + (cfg.rageKey === 'MouseRight' ? ' selected' : '') + '>Right Mouse</option>',
            '<option value="MouseLeft"' + (cfg.rageKey === 'MouseLeft' ? ' selected' : '') + '>Left Mouse</option>',
            '<option value="KeyV"' + (cfg.rageKey === 'KeyV' ? ' selected' : '') + '>V Key</option>',
            '</select>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Rage Settings</div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Smoothing</span><span class="km-sld-v" id="rageSmooth-v">' + cfg.rageSmooth.toFixed(2) + '</span></div><input type="range" class="km-sld" id="rageSmooth" min="0.1" max="1" step="0.05" value="' + cfg.rageSmooth + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Offset</span><span class="km-sld-v" id="rageOff-v">' + cfg.rageOff.toFixed(2) + '</span></div><input type="range" class="km-sld" id="rageOff" min="0" max="2" step="0.1" value="' + cfg.rageOff + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Max Distance</span><span class="km-sld-v" id="rageDist-v">' + cfg.rageDist + '</span></div><input type="range" class="km-sld" id="rageDist" min="100" max="100000" step="100" value="' + cfg.rageDist + '"></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Triggerbot</div>',
            '<div class="km-row"><span class="km-lbl">Enable Triggerbot</span><div class="km-tog' + (cfg.triggerOn ? ' on' : '') + '" data-k="triggerOn"></div></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Trigger FOV</span><span class="km-sld-v" id="triggerFov-v">' + cfg.triggerFov + 'px</span></div><input type="range" class="km-sld" id="triggerFov" min="5" max="100" value="' + cfg.triggerFov + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Trigger Delay</span><span class="km-sld-v" id="triggerDelay-v">' + cfg.triggerDelay + 'ms</span></div><input type="range" class="km-sld" id="triggerDelay" min="0" max="200" value="' + cfg.triggerDelay + '"></div>',
            '</div>',
            '</div>',
 
            '<div class="km-pnl" data-p="esp">',
            '<div class="km-sec">',
            '<div class="km-sec-t">ESP Settings</div>',
            '<div class="km-row"><span class="km-lbl">Enable ESP</span><div class="km-tog' + (cfg.espOn ? ' on' : '') + '" data-k="espOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Show Distance</span><div class="km-tog' + (cfg.espDist ? ' on' : '') + '" data-k="espDist"></div></div>',
            '<div class="km-row"><span class="km-lbl">Show Health</span><div class="km-tog' + (cfg.espHp ? ' on' : '') + '" data-k="espHp"></div></div>',
            '<div class="km-row"><span class="km-lbl">Tracer Lines</span><div class="km-tog' + (cfg.espLine ? ' on' : '') + '" data-k="espLine"></div></div>',
            '<div class="km-row"><span class="km-lbl">RGB ESP</span><div class="km-tog' + (cfg.espRgb ? ' on' : '') + '" data-k="espRgb"></div></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">ESP Appearance</div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Max Distance</span><span class="km-sld-v" id="espMax-v">' + cfg.espMax + 'm</span></div><input type="range" class="km-sld" id="espMax" min="50" max="1000" value="' + cfg.espMax + '"></div>',
            '<div class="km-row"><span class="km-lbl">ESP Color</span><select class="km-sel" id="espColSel" style="width:100px">' + colorList.map(function(c, i) { return '<option value="' + i + '"' + (cfg.espIdx === i ? ' selected' : '') + '>' + c.name + '</option>'; }).join('') + '</select></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Wireframe & Chams</div>',
            '<div class="km-row"><span class="km-lbl">Player Wireframe</span><div class="km-tog' + (cfg.wireOn ? ' on' : '') + '" data-k="wireOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">RGB Wireframe</span><div class="km-tog' + (cfg.wireRgb ? ' on' : '') + '" data-k="wireRgb"></div></div>',
            '<div class="km-row"><span class="km-lbl">World Wireframe</span><div class="km-tog' + (cfg.worldWire ? ' on' : '') + '" data-k="worldWire"></div></div>',
            '<div class="km-row"><span class="km-lbl">Enable Chams</span><div class="km-tog' + (cfg.chamsOn ? ' on' : '') + '" data-k="chamsOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Chams Color</span><input type="color" class="km-col" id="chamsCol" value="' + cfg.chamsCol + '"></div>',
            '</div>',
            '</div>',
 
            '<div class="km-pnl" data-p="vis">',
            '<div class="km-sec">',
            '<div class="km-sec-t">3rd Person Camera</div>',
            '<div class="km-row"><span class="km-lbl">Enable 3rd Person</span><div class="km-tog' + (cfg.tpOn ? ' on' : '') + '" data-k="tpOn"></div></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Camera X</span><span class="km-sld-v" id="camX-v">' + cfg.camX + '</span></div><input type="range" class="km-sld" id="camX" min="-10" max="10" step="0.5" value="' + cfg.camX + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Camera Y</span><span class="km-sld-v" id="camY-v">' + cfg.camY + '</span></div><input type="range" class="km-sld" id="camY" min="-10" max="10" step="0.5" value="' + cfg.camY + '"></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Camera Z</span><span class="km-sld-v" id="camZ-v">' + cfg.camZ + '</span></div><input type="range" class="km-sld" id="camZ" min="-20" max="5" step="0.5" value="' + cfg.camZ + '"></div>',
            '</div>',
            '</div>',
 
            '<div class="km-pnl" data-p="misc">',
            '<div class="km-sec">',
            '<div class="km-sec-t">Weapon Mods</div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>No Recoil</span><span class="km-sld-v" id="noRecoil-v">' + cfg.noRecoil + '%</span></div><input type="range" class="km-sld" id="noRecoil" min="0" max="100" value="' + cfg.noRecoil + '"></div>',
            '<div class="km-row"><span class="km-lbl">Silent Aim</span><div class="km-tog' + (cfg.silentOn ? ' on' : '') + '" data-k="silentOn"></div></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Movement Hacks</div>',
            '<div class="km-row"><span class="km-lbl">Speed Hack</span><div class="km-tog' + (cfg.speedOn ? ' on' : '') + '" data-k="speedOn"></div></div>',
            '<div class="km-sld-w"><div class="km-sld-h"><span>Speed Multiplier</span><span class="km-sld-v" id="speedVal-v">' + cfg.speedVal.toFixed(1) + 'x</span></div><input type="range" class="km-sld" id="speedVal" min="1" max="3" step="0.1" value="' + cfg.speedVal + '"></div>',
            '<div class="km-row"><span class="km-lbl">Auto Bhop</span><div class="km-tog' + (cfg.bhopOn ? ' on' : '') + '" data-k="bhopOn"></div></div>',
            '<div class="km-row"><span class="km-lbl">Jump Hack</span><div class="km-tog' + (cfg.jumpOn ? ' on' : '') + '" data-k="jumpOn"></div></div>',
            '</div>',
            '</div>',
 
            '<div class="km-pnl" data-p="cfg">',
            '<div class="km-sec">',
            '<div class="km-sec-t">Aim Key</div>',
            '<select class="km-sel" id="aimKey">',
            '<option value="MouseRight"' + (cfg.aimKey === 'MouseRight' ? ' selected' : '') + '>Right Mouse</option>',
            '<option value="MouseLeft"' + (cfg.aimKey === 'MouseLeft' ? ' selected' : '') + '>Left Mouse</option>',
            '<option value="MouseMiddle"' + (cfg.aimKey === 'MouseMiddle' ? ' selected' : '') + '>Middle Mouse</option>',
            '<option value="KeyV"' + (cfg.aimKey === 'KeyV' ? ' selected' : '') + '>V Key</option>',
            '<option value="ShiftLeft"' + (cfg.aimKey === 'ShiftLeft' ? ' selected' : '') + '>Shift</option>',
            '</select>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Keybinds</div>',
            '<div class="km-row"><span class="km-lbl">Toggle Aimbot</span><button class="km-key" data-b="togAim">' + getKeyName(cfg.keys.togAim) + '</button></div>',
            '<div class="km-row"><span class="km-lbl">Toggle ESP</span><button class="km-key" data-b="togEsp">' + getKeyName(cfg.keys.togEsp) + '</button></div>',
            '<div class="km-row"><span class="km-lbl">Cycle Color</span><button class="km-key" data-b="cycCol">' + getKeyName(cfg.keys.cycCol) + '</button></div>',
            '<div class="km-row"><span class="km-lbl">Toggle RGB</span><button class="km-key" data-b="togRgb">' + getKeyName(cfg.keys.togRgb) + '</button></div>',
            '</div>',
            '<div class="km-sec">',
            '<div class="km-sec-t">Info</div>',
            '<div class="km-row"><span class="km-lbl">UI Toggle</span><span style="color:#ff0000;font-size:11px">Ctrl + Alt + L</span></div>',
            '<div class="km-row"><span class="km-lbl">Discord</span><span style="color:#5865F2;font-size:11px">discord.gg/MHCcGgsX56</span></div>',
            '</div>',
            '</div>',
 
            '</div>',
            '</div>',
            '</div>',
            '<div id="krem-fov" style="display:' + (cfg.fovShow ? 'block' : 'none') + ';border-color:' + cfg.fovCol + '"></div>'
        ].join('');
 
        if (!document.body) { setTimeout(initUI, 100); return; }
        document.body.appendChild(root);
 
        if (cfg.uiHidden) {
            var menu = document.getElementById('km');
            if (menu) menu.style.display = 'none';
        }
 
        bindUI();
        makeDrag();
        updateFov();
        setInterval(updateFov, 16);
    }
 
    function bindUI() {
        document.querySelectorAll('.km-tab').forEach(function(tab) {
            tab.onclick = function() {
                document.querySelectorAll('.km-tab').forEach(function(t) { t.classList.remove('on'); });
                document.querySelectorAll('.km-pnl').forEach(function(p) { p.classList.remove('on'); });
                tab.classList.add('on');
                document.querySelector('[data-p="' + tab.dataset.t + '"]').classList.add('on');
            };
        });
 
        document.getElementById('km-min').onclick = function() {
            document.getElementById('km').classList.toggle('min');
        };
 
        document.querySelectorAll('.km-tog').forEach(function(tog) {
            tog.onclick = function() {
                var k = tog.dataset.k;
                cfg[k] = !cfg[k];
                tog.classList.toggle('on');
                if (k === 'espRgb' || k === 'fovRgb' || k === 'wireRgb') {
                    if (cfg.espRgb || cfg.fovRgb || cfg.wireRgb) startRgb(); else stopRgb();
                }
                if (k === 'fovShow') document.getElementById('krem-fov').style.display = cfg.fovShow ? 'block' : 'none';
                saveCfg();
            };
        });
 
        var sliders = [
            { id: 'aimStr', k: 'aimStr', s: '', d: 0 },
            { id: 'predInt', k: 'predInt', s: '', d: 1 },
            { id: 'vertAdj', k: 'vertAdj', s: '', d: 1 },
            { id: 'fovSize', k: 'fovSize', s: '', d: 0 },
            { id: 'espMax', k: 'espMax', s: 'm', d: 0 },
            { id: 'noRecoil', k: 'noRecoil', s: '%', d: 0 },
            { id: 'speedVal', k: 'speedVal', s: 'x', d: 1 },
            { id: 'rageSmooth', k: 'rageSmooth', s: '', d: 2 },
            { id: 'rageOff', k: 'rageOff', s: '', d: 2 },
            { id: 'rageDist', k: 'rageDist', s: '', d: 0 },
            { id: 'camX', k: 'camX', s: '', d: 1 },
            { id: 'camY', k: 'camY', s: '', d: 1 },
            { id: 'camZ', k: 'camZ', s: '', d: 1 },
            { id: 'triggerFov', k: 'triggerFov', s: 'px', d: 0 },
            { id: 'triggerDelay', k: 'triggerDelay', s: 'ms', d: 0 }
        ];
 
        sliders.forEach(function(sl) {
            var el = document.getElementById(sl.id);
            var vEl = document.getElementById(sl.id + '-v');
            if (el && vEl) {
                el.oninput = function(e) {
                    var v = parseFloat(e.target.value);
                    cfg[sl.k] = v;
                    vEl.textContent = (sl.d > 0 ? v.toFixed(sl.d) : v) + sl.s;
                    saveCfg();
                };
            }
        });
 
        var aimbone = document.getElementById('aimbone');
        if (aimbone) aimbone.onchange = function(e) { cfg.aimbone = e.target.value; saveCfg(); };
 
        var rageBone = document.getElementById('rageBone');
        if (rageBone) rageBone.onchange = function(e) { cfg.rageBone = e.target.value; saveCfg(); };
 
        var rageKey = document.getElementById('rageKey');
        if (rageKey) rageKey.onchange = function(e) { cfg.rageKey = e.target.value; saveCfg(); };
 
        var aimKey = document.getElementById('aimKey');
        if (aimKey) aimKey.onchange = function(e) { cfg.aimKey = e.target.value; saveCfg(); };
 
        var espColSel = document.getElementById('espColSel');
        if (espColSel) espColSel.onchange = function(e) {
            var i = parseInt(e.target.value);
            cfg.espIdx = i;
            cfg.espCol = colorList[i].value;
            updateEspColor();
            saveCfg();
        };
 
        var chamsCol = document.getElementById('chamsCol');
        if (chamsCol) chamsCol.oninput = function(e) { cfg.chamsCol = e.target.value; saveCfg(); };
 
        document.querySelectorAll('.km-key').forEach(function(btn) {
            btn.onclick = function() {
                var bk = btn.dataset.b;
                btn.classList.add('rec');
                btn.textContent = '...';
                var handler = function(e) {
                    e.preventDefault(); e.stopPropagation();
                    cfg.keys[bk] = e.code;
                    btn.textContent = getKeyName(e.code);
                    btn.classList.remove('rec');
                    document.removeEventListener('keydown', handler, true);
                    saveCfg();
                };
                document.addEventListener('keydown', handler, true);
            };
        });
    }
 
    function makeDrag() {
        var menu = document.getElementById('km');
        var hdr = document.getElementById('km-hdr');
        var drag = false, ox = 0, oy = 0;
 
        hdr.onmousedown = function(e) {
            if (e.target.tagName === 'BUTTON') return;
            drag = true;
            ox = e.clientX - menu.offsetLeft;
            oy = e.clientY - menu.offsetTop;
            menu.style.transition = 'none';
        };
 
        document.onmousemove = function(e) {
            if (!drag) return;
            menu.style.left = (e.clientX - ox) + 'px';
            menu.style.top = (e.clientY - oy) + 'px';
        };
 
        document.onmouseup = function() { drag = false; menu.style.transition = ''; };
    }
 
    function updateFov() {
        var fov = document.getElementById('krem-fov');
        if (!fov) return;
        fov.style.width = cfg.fovSize + 'px';
        fov.style.height = cfg.fovSize + 'px';
        fov.style.left = (window.innerWidth / 2) + 'px';
        fov.style.top = (window.innerHeight / 2) + 'px';
        if (!cfg.fovRgb) fov.style.borderColor = cfg.fovCol;
        fov.style.display = cfg.fovShow && cfg.fovOn ? 'block' : 'none';
    }
 
    function toggleUI() {
        cfg.uiHidden = !cfg.uiHidden;
        var menu = document.getElementById('km');
        if (menu) menu.style.display = cfg.uiHidden ? 'none' : 'block';
        saveCfg();
    }
 
    function applyTriggerbot(entities, local, camera) {
        if (!cfg.triggerOn || !camera) return;
 
        var now = Date.now();
        if (now - lastTrigger < cfg.triggerDelay) return;
 
        var centerX = window.innerWidth / 2;
        var centerY = window.innerHeight / 2;
 
        for (var i = 0; i < entities.length; i++) {
            var ent = entities[i];
            if (ent === local || ent === localRef) continue;
            if (isTeammate(ent, local)) continue;
 
            var headPos = getHeadPos(ent);
            var screenPos = headPos.clone().project(camera);
 
            if (screenPos.z > 1) continue;
 
            var screenX = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
            var screenY = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
 
            var dist = Math.sqrt(Math.pow(screenX - centerX, 2) + Math.pow(screenY - centerY, 2));
 
            if (dist < cfg.triggerFov) {
                lastTrigger = now;
                try {
                    if (inputObj) {
                        inputObj.mouseDown = true;
                        setTimeout(function() { if (inputObj) inputObj.mouseDown = false; }, 50);
                    }
                    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
                    setTimeout(function() {
                        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 }));
                    }, 50);
                } catch (e) {}
                break;
            }
        }
    }
 
    function mainLoop() {
        utils.raf.call(utils.win, mainLoop);
 
        if (!sceneRef && !initTimer) {
            var loadEl = document.querySelector('#loadingBg');
            if (loadEl && loadEl.style.display === 'none') {
                initTimer = setTimeout(function() {
                    Array.prototype.push = detectScene;
                    initTimer = null;
                }, 2000);
            }
            return;
        }
 
        if (!sceneRef) return;
 
        if (cfg.speedOn) applySpeed();
        if (cfg.bhopOn) applyBhop();
        if (cfg.jumpOn) applyJump();
        applyNoRecoil();
 
        if (cfg.worldWire) {
            sceneRef.children.forEach(function(c) {
                if (c.material && c.material.wireframe !== undefined) c.material.wireframe = true;
            });
        }
 
        var entities = [];
        var local = null;
 
        sceneRef.children.forEach(function(child) {
            if (child.type === 'Object3D') {
                try {
                    var cam = child.children[0] && child.children[0].children[0];
                    if (cam && cam.type === 'PerspectiveCamera') {
                        local = child;
                        localRef = child;
                    } else {
                        var bbox = new Engine.Box3().setFromObject(child);
                        var height = bbox.getSize(new Engine.Vector3()).y;
                        if (height > 10 && height < 20) {
                            entities.push(child);
                        }
                    }
                } catch (e) {}
            }
        });
 
        if (!local) return;
 
        if (cfg.tpOn && local.children[0]) {
            local.children[0].position.set(cfg.camX, cfg.camY, cfg.camZ);
        } else if (local.children[0]) {
            local.children[0].position.set(0, 0, 0);
        }
 
        if (!lineVis.parent) sceneRef.add(lineVis);
        if (!hpCanvas.parentNode) document.body.appendChild(hpCanvas);
 
        var posCount = 0;
        var curTgt = null;
        var minDist = Infinity;
        var rageTgt = null;
        var rageDist = Infinity;
 
        tempObj.matrix.copy(local.matrix).invert();
 
        var curPos = {};
        for (var i = 0; i < entities.length; i++) {
            curPos[entities[i].id] = entities[i].position.clone();
        }
 
        var hCtx = hpCanvas.getContext('2d');
        hCtx.clearRect(0, 0, hpCanvas.width, hpCanvas.height);
 
        var camera = local.children && local.children[0] && local.children[0].children && local.children[0].children[0];
 
        for (var i = 0; i < entities.length; i++) {
            var ent = entities[i];
 
            if (ent === local || ent === localRef) continue;
            if (isTeammate(ent, local)) {
                if (ent.espBox) ent.espBox.visible = false;
                continue;
            }
 
            var dist = ent.position.distanceTo(local.position);
            if (dist < 1) continue;
            if (dist > cfg.espMax) {
                if (ent.espBox) ent.espBox.visible = false;
                continue;
            }
 
            if (cfg.wireOn || cfg.chamsOn) applyWireframe(ent);
 
            if (!ent.espBox) {
                var box = new Engine.LineSegments(boxGeo, espMat.clone());
                box.frustumCulled = false;
                box.renderOrder = 9999;
                ent.add(box);
                ent.espBox = box;
            }
 
            if (cfg.espLine) {
                var pPos = local.position;
                var startY = pPos.y;
                if (cfg.espLinePos === 'top') startY += 10;
                else if (cfg.espLinePos === 'middle') startY += 5;
                linePos.setXYZ(posCount++, pPos.x, startY, pPos.z);
                linePos.setXYZ(posCount++, ent.position.x, ent.position.y + 7, ent.position.z);
            }
 
            var predPos = ent.position.clone();
            if (posHist[ent.id]) {
                var vel = new Engine.Vector3().subVectors(curPos[ent.id], posHist[ent.id]);
                predPos.add(vel.multiplyScalar(cfg.predInt));
            }
 
            ent.visible = true;
 
            var inFov = false;
 
            if (camera && camera.type === 'PerspectiveCamera') {
                var screenPos = predPos.clone().project(camera);
                var screenX = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
                var screenY = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
                var centerX = window.innerWidth / 2;
                var centerY = window.innerHeight / 2;
                var distFromCenter = Math.sqrt(Math.pow(screenX - centerX, 2) + Math.pow(screenY - centerY, 2));
                var fovRad = cfg.fovSize / 2;
                inFov = (screenPos.z < 1) && (distFromCenter <= fovRad);
 
                if (cfg.espHp && cfg.espOn && screenPos.z > 0 && screenPos.z < 1) {
                    var hp = getHp(ent);
                    var hpPct = Math.max(0, Math.min(1, hp / 100));
                    var barW = 50, barH = 5;
                    var barX = screenX - barW / 2;
                    var barY = screenY - 80;
 
                    if (barX > -barW && barX < window.innerWidth && barY > -20 && barY < window.innerHeight) {
                        hCtx.fillStyle = 'rgba(0,0,0,0.6)';
                        hCtx.fillRect(barX, barY, barW, barH);
                        hCtx.fillStyle = hpPct > 0.6 ? '#0f0' : hpPct > 0.3 ? '#ff0' : '#f00';
                        hCtx.fillRect(barX, barY, barW * hpPct, barH);
                        hCtx.strokeStyle = '#fff';
                        hCtx.lineWidth = 1;
                        hCtx.strokeRect(barX, barY, barW, barH);
                        hCtx.fillStyle = '#fff';
                        hCtx.font = 'bold 9px Arial';
                        hCtx.textAlign = 'center';
                        hCtx.fillText(Math.round(hp) + 'HP', screenX, barY - 2);
                    }
                }
            }
 
            var fovOk = cfg.fovOn ? inFov : true;
            if (!lockOn && fovOk && dist < minDist) {
                curTgt = ent;
                minDist = dist;
            }
 
            if (cfg.rageOn && dist < cfg.rageDist && dist > 1) {
                var canTarget = true;
                if (cfg.rageVis) {
                    canTarget = isVisible(local.position, ent.position, sceneRef);
                }
                if (canTarget && dist < rageDist) {
                    rageTgt = ent;
                    rageDist = dist;
                }
            }
        }
 
        if (cfg.espOn) {
            for (var i = 0; i < entities.length; i++) {
                var ent = entities[i];
                if (ent === local || ent === localRef) continue;
                if (isTeammate(ent, local)) continue;
                var dist = ent.position.distanceTo(local.position);
                if (dist < 1) continue;
                if (dist > cfg.espMax) continue;
 
                if (ent.espBox) {
                    var parts = cfg.espCol.split(',').map(function(v) { return parseFloat(v.trim()); });
                    ent.espBox.material.uniforms.espColor.value.set(parts[0], parts[1], parts[2]);
                    if (ent === curTgt) ent.espBox.material.uniforms.espColor.value.set(0, 1, 0);
                    ent.espBox.visible = true;
                }
            }
        } else {
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].espBox) entities[i].espBox.visible = false;
            }
        }
 
        posHist = curPos;
        linePos.needsUpdate = true;
        lineGeo.setDrawRange(0, posCount);
        lineVis.visible = cfg.espLine && cfg.espOn;
 
        if (cfg.triggerOn && camera) {
            applyTriggerbot(entities, local, camera);
        }
 
        var rageActive = cfg.rageAlways || (cfg.rageKey !== 'None' && rageKeyDown);
        if (cfg.rageOn && rageTgt && local && rageActive) {
            doRageAim(rageTgt, local);
        }
 
        var aimActive = (cfg.aimKey === 'MouseRight' && rightDown) ||
            (cfg.aimKey === 'MouseLeft' && keyDown) ||
            (cfg.aimKey === 'MouseMiddle' && keyDown) || keyDown;
 
        if (!cfg.aimbotOn || !aimActive) {
            if (lockOn) {
                lockOn = false; locked = null;
                document.removeEventListener('mousemove', blockMouse, true);
            }
            return;
        }
 
        if (!lockOn && curTgt) {
            locked = curTgt;
            lockOn = true;
            document.addEventListener('mousemove', blockMouse, true);
        }
 
        if (!curTgt) {
            lockOn = false; locked = null;
            document.removeEventListener('mousemove', blockMouse, true);
            return;
        }
 
        if (locked && !sceneRef.children.includes(locked)) {
            lockOn = false; locked = null;
            document.removeEventListener('mousemove', blockMouse, true);
            return;
        }
 
        if (!locked) return;
 
        var targetPos = getTargetPos(locked, cfg.aimbone);
 
        if (posHist[locked.id] && curPos[locked.id]) {
            var vel = new Engine.Vector3().subVectors(curPos[locked.id], posHist[locked.id]);
            targetPos.add(vel.multiplyScalar(cfg.predInt));
        }
 
        if (cfg.vertOn) targetPos.y += cfg.vertAdj;
 
        tempVec.copy(targetPos);
        tempObj.position.copy(local.position);
        tempObj.lookAt(tempVec);
 
        var aimFactor = Math.min(1.0, cfg.aimStr / 100);
 
        if (local.children && local.children.length > 0) {
            var curX = local.children[0].rotation.x;
            var tgtX = -tempObj.rotation.x;
            local.children[0].rotation.x = curX + (tgtX - curX) * aimFactor;
        }
 
        var curY = local.rotation.y;
        var tgtY = tempObj.rotation.y + Math.PI;
        local.rotation.y = curY + (tgtY - curY) * aimFactor;
    }
 
    function doRageAim(target, local) {
        if (!target || !local) return;
        if (target === local || target === localRef) return;
 
        try {
            var targetPos = getTargetPos(target, cfg.rageBone);
            var dist = target.position.distanceTo(local.position);
 
            tempObj.position.copy(local.position);
            tempObj.lookAt(targetPos.x, targetPos.y, targetPos.z);
 
            var tgtRotX = -tempObj.rotation.x + (cfg.rageOff / dist) * 5;
            var tgtRotY = tempObj.rotation.y + Math.PI;
 
            local.children[0].rotation.x += (tgtRotX - local.children[0].rotation.x) * cfg.rageSmooth;
            local.rotation.y += (tgtRotY - local.rotation.y) * cfg.rageSmooth;
        } catch (e) {}
    }
 
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
 
    document.addEventListener('keydown', function(e) {
        if (e.code === cfg.aimKey) keyDown = true;
        if (e.code === cfg.rageKey) rageKeyDown = true;
 
        if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
            e.preventDefault();
            toggleUI();
        }
 
        if (e.code === cfg.keys.togAim) {
            cfg.aimbotOn = !cfg.aimbotOn;
            var tog = document.querySelector('[data-k="aimbotOn"]');
            if (tog) tog.classList.toggle('on', cfg.aimbotOn);
            saveCfg();
        }
        if (e.code === cfg.keys.togEsp) {
            cfg.espOn = !cfg.espOn;
            var tog = document.querySelector('[data-k="espOn"]');
            if (tog) tog.classList.toggle('on', cfg.espOn);
            saveCfg();
        }
        if (e.code === cfg.keys.cycCol) {
            cfg.espIdx = (cfg.espIdx + 1) % colorList.length;
            cfg.espCol = colorList[cfg.espIdx].value;
            updateEspColor();
            var sel = document.getElementById('espColSel');
            if (sel) sel.value = cfg.espIdx;
            saveCfg();
        }
        if (e.code === cfg.keys.togRgb) {
            cfg.espRgb = !cfg.espRgb;
            var tog = document.querySelector('[data-k="espRgb"]');
            if (tog) tog.classList.toggle('on', cfg.espRgb);
            if (cfg.espRgb) startRgb(); else stopRgb();
            saveCfg();
        }
    });
 
    document.addEventListener('keyup', function(e) {
        if (e.code === cfg.aimKey) keyDown = false;
        if (e.code === cfg.rageKey) rageKeyDown = false;
    });
 
    window.addEventListener('resize', function() {
        hpCanvas.width = window.innerWidth;
        hpCanvas.height = window.innerHeight;
    });
 
    setTimeout(initUI, 1000);
    mainLoop();
 
})();