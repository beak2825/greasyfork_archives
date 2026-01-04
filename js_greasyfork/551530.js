// ==UserScript==
// @name        Krunker Cheat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aimbot, ESP, Recoil Comp, ESP Lines, and Hardcore Mode. Original script by wi1lliott8411; also marked under "downloadURL"
// @description:de Aimbot, ESP, Recoil Comp, ESP Lines und Hardcore Mode. Originales Skript von wi1lliott8411; auch noch markiert bei "downloadURL"
// @match        krunker.io/*
// @match        browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/three@0.150.0/build/three.min.js
// @downloadURL https://update.greasyfork.org/scripts/551530/Krunker%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/551530/Krunker%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /************* CSS Styles (Modernized) *************/
    const style = document.createElement('style');
    style.innerHTML = `
    /* Modern System Font Stack */
    :root {
        --neon-color: #00ffff; /* Leuchtendes Cyan */
        --on-color: #00ffff;
        --off-color: #ff4757; /* Kräftiges Rot */
        --bg-dark: rgba(18, 18, 18, 0.9);
        --bg-item: rgba(0, 0, 0, 0.4);
    }

    .msg {
        position: absolute;
        left: 10px;
        bottom: 10px;
        color: #fff;
        background: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
        animation: msg-in 0.3s forwards cubic-bezier(0.25, 0.8, 0.25, 1), msg-out 0.3s forwards 3s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 999999;
        pointer-events: none;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
    @keyframes msg-in {
        from {transform: translateX(-120%); opacity: 0;}
        to {transform: translateX(0); opacity: 1;}
    }
    @keyframes msg-out {
        from {transform: translateX(0); opacity: 1;}
        to {transform: translateX(-120%); opacity: 0;}
    }

    .zui {
        position: fixed;
        right: 10px;
        top: 10px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        font-size: 14px;
        color: #fff;
        width: 280px; /* Slightly wider */
        user-select: none;
        border-radius: 12px; /* Smoother corners */
        overflow: hidden;
        /* Glassmorphism/Acrylic Effect */
        background: var(--bg-dark);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.18); /* Subtle light border */
    }
    .zui-header {
        background: rgba(30, 30, 30, 0.95);
        padding: 12px;
        font-weight: 700;
        font-size: 17px;
        text-align: center;
        position: relative;
        cursor: pointer;
        color: var(--neon-color);
        border-bottom: 2px solid var(--neon-color);
        text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); /* Neon glow */
    }
    .zui-item {
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--bg-item);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        transition: background 0.2s, color 0.2s;
        cursor: pointer;
        color: #fff;
    }
    .zui-item:last-child {
        border-bottom: none;
    }
    .zui-item:hover {
        background: rgba(0, 255, 255, 0.15); /* Subtle neon highlight on hover */
        color: var(--neon-color);
    }
    .zui-item.text {
        justify-content: center;
        cursor: unset;
        text-align: center;
        background: none;
        border-bottom: none;
        padding: 8px 15px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
    }
    .zui-item-value {
        font-weight: bold;
        transition: color 0.2s;
    }
    .zui-content {
        color: #fff;
        display: block;
    }
    `;
    document.head.appendChild(style);

    /************* Common Variables and Functions *************/

    const COOKIE_NAME = "krunker_access_auth";
    const COOKIE_VALID_DAYS = 7;

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        const cookieName = name + "=";
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    }

    function checkAccess() {
        const storedValue = getCookie(COOKIE_NAME);
        if (storedValue) {
            const storedTime = parseInt(storedValue, 10);
            const elapsedTime = Date.now() - storedTime;
            if (elapsedTime < COOKIE_VALID_DAYS * 24 * 60 * 60 * 1000) {
                return true;
            }
        }
        setCookie(COOKIE_NAME, Date.now().toString(), COOKIE_VALID_DAYS);
        return false;
    }

    if (!checkAccess()) {
        console.log("Access denied. Please redownload the script.");
        return;
    }

    console.log("KCS v0.8.0 is loaded.");

    const THREE = window.THREE;
    delete window.THREE;

    // Nur die gewünschten Features behalten
    const settings = {
        aimbotEnabled: false,
        espEnabled: true,
        espLines: false,
        recoilCompEnabled: true,
    };

    const addOnSettings = {
        'Krunker Hardcore Mode': false
    };

    const keyToSetting = {
        KeyB: 'aimbotEnabled',
        KeyM: 'espEnabled',
        KeyN: 'espLines',
        KeyC: 'recoilCompEnabled', // Key C für Recoil Compensation (Bisher kein Key)
        KeyH: 'Krunker Hardcore Mode', // Key H für Hardcore Mode (Bisher kein Key)
    };

    // Key mappings für AddOn settings (für toggleSetting und applyImmediateAddOnEffects)
    const addOnKeyMap = {
        'Krunker Hardcore Mode': 'KeyH'
    };

    let scene;
    let myPlayer;

    const x = {
        window: window,
        document: document,
        querySelector: document.querySelector.bind(document),
        consoleLog: console.log,
        ReflectApply: Reflect.apply,
        ArrayPrototype: Array.prototype,
        ArrayPush: Array.prototype.push,
        ObjectPrototype: Object.prototype,
        clearInterval: window.clearInterval,
        setTimeout: window.setTimeout,
        indexOf: String.prototype.indexOf,
        requestAnimationFrame: window.requestAnimationFrame
    };

    x.consoleLog('Waiting to inject...');

    const proxied = function (object) {
        try {
            if (typeof object === 'object' &&
                typeof object.parent === 'object' &&
                object.parent.type === 'Scene' &&
                object.parent.name === 'Main') {
                x.consoleLog('Found Scene!');
                scene = object.parent;
                x.ArrayPrototype.push = x.ArrayPush;
            }
        } catch (error) {}
        return x.ArrayPush.apply(this, arguments);
    };

    const tempVector = new THREE.Vector3();
    const tempObject = new THREE.Object3D();
    tempObject.rotation.order = 'YXZ';

    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(5, 15, 5).translate(0, 7.5, 0));
    const material = new THREE.RawShaderMaterial({
        vertexShader: `
        attribute vec3 position;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position.z = 1.0;
        }
        `,
        fragmentShader: `
        void main() {
            gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); /* Neon Cyan */
        }
        `
    });

    const line = new THREE.LineSegments(new THREE.BufferGeometry(), material);
    line.frustumCulled = false;
    const linePositions = new THREE.BufferAttribute(new Float32Array(100 * 2 * 3), 3);
    line.geometry.setAttribute('position', linePositions);

    let injectTimer = null;

    function showMsg(message, bool) {
        let msgDiv = document.querySelector('.msg');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.className = 'msg';
            document.body.appendChild(msgDiv);
        }
        msgDiv.innerText = message;
        msgDiv.style.background = bool ? 'rgba(0, 150, 0, 0.85)' : 'rgba(180, 0, 0, 0.85)';
        msgDiv.style.display = 'block';
        setTimeout(() => {
            // Die Animation im CSS kümmert sich um das Ausblenden
        }, 3000);
    }

    function aimAtTarget(myPlayer, targetPlayer, factor) {
        tempVector.setScalar(0);
        if (targetPlayer && targetPlayer.children && targetPlayer.children[0] && targetPlayer.children[0].children && targetPlayer.children[0].children[0]) {
            targetPlayer.children[0].children[0].localToWorld(tempVector);
        } else {
            tempVector.copy(targetPlayer.position);
        }

        tempObject.position.copy(myPlayer.position);
        tempObject.lookAt(tempVector);

        myPlayer.children[0].rotation.x += factor * (-tempObject.rotation.x - myPlayer.children[0].rotation.x);
        myPlayer.rotation.y += factor * ((tempObject.rotation.y + Math.PI) - myPlayer.rotation.y);
    }

    // Recoil Compensation (Bleibt wie bisher)
    let shooting = false;
    let stableRotationX = 0;
    let noRecoilInterval = null;
    function startNoRecoilLoop() {
        if (noRecoilInterval) return;
        noRecoilInterval = setInterval(() => {
            if (!myPlayer || !shooting || !settings.recoilCompEnabled) return;
            myPlayer.children[0].rotation.x = stableRotationX;
        }, 10);
    }

    function stopNoRecoilLoop() {
        if (noRecoilInterval) {
            clearInterval(noRecoilInterval);
            noRecoilInterval = null;
        }
    }

    window.addEventListener('pointerdown', function(event) {
        if (!myPlayer) return;
        if (event.button === 0) {
            shooting = true;
            stableRotationX = myPlayer.children[0].rotation.x;
            if (settings.recoilCompEnabled) {
                startNoRecoilLoop();
            }
        }
    });

    window.addEventListener('pointerup', function(event) {
        if (event.button === 0) {
            shooting = false;
            stopNoRecoilLoop();
        }
    });

    // Krunker Hardcore Mode
    function enablekrunkerhardcore(){
        console.log("Krunker Hardcore Mode enabled");
        if (scene) {
            scene.fog = new THREE.Fog(0x000000, 10, 50);
        }
    }

    function disablekrunkerhardcore(){
        console.log("Krunker Hardcore Mode disabled");
        if (scene) {
            scene.fog = null;
        }
    }

    function animate() {
        x.requestAnimationFrame.call(x.window, animate);

        if (!scene && !injectTimer) {
            const el = x.querySelector('#loadingBg');
            if (el && el.style.display === 'none') {
                x.consoleLog('Inject timer started!');
                injectTimer = x.setTimeout.call(x.window, () => {
                    x.consoleLog('Injected!');
                    x.ArrayPrototype.push = proxied;
                    if (scene && !scene.getObjectByName('espLine')) {
                        line.name = 'espLine';
                        scene.add(line);
                    }
                }, 2000);
            }
        }

        if (!scene) return;

        const players = [];
        myPlayer = null;

        for (let i = 0; i < scene.children.length; i++) {
            const child = scene.children[i];

            if (child.type === 'Object3D') {
                try {
                    if (child.children[0].children[0].type === 'PerspectiveCamera') {
                        myPlayer = child;
                    } else {
                        players.push(child);
                    }
                } catch (err) {}
            }
        }

        if (!myPlayer) {
            x.consoleLog('No player found.');
            x.ArrayPrototype.push = proxied;
            return;
        }

        let counter = 0;
        let targetPlayer;
        let minDistance = Infinity;
        const maxAimbotDistance = 255;

        tempObject.matrix.copy(myPlayer.matrix).invert();

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            if (!player.box) {
                const box = new THREE.LineSegments(geometry, material);
                box.frustumCulled = false;
                player.add(box);
                player.box = box;
            }

            if (player.position.x === myPlayer.position.x && player.position.z === myPlayer.position.z) {
                player.box.visible = false;
                if (line.parent !== player) {
                    player.add(line);
                }
                continue;
            }

            if (settings.espLines) {
                linePositions.setXYZ(counter++, 0, 10, -5);

                tempVector.copy(player.position);
                tempVector.y += 9;
                tempVector.applyMatrix4(tempObject.matrix);

                linePositions.setXYZ(
                    counter++,
                    tempVector.x,
                    tempVector.y,
                    tempVector.z
                );
            }

            player.box.visible = settings.espEnabled;

            const distance = player.position.distanceTo(myPlayer.position);
            // Ursprüngliche Aimbot-Logik: Nächster Gegner (3D-Distanz)
            if (distance < minDistance && distance <= maxAimbotDistance) {
                targetPlayer = player;
                minDistance = distance;
            }
        }

        if (settings.espLines) {
            linePositions.needsUpdate = true;
            line.geometry.setDrawRange(0, counter);
            line.visible = true;
        } else {
            line.visible = false;
        }

        if (!targetPlayer) return;

        if (settings.aimbotEnabled) {
            aimAtTarget(myPlayer, targetPlayer, 1.0);
        }
    }

    function fromHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    }

    function createGUI() {
        // HIER wurde das Menü komplett neu aufgebaut, um nur die 5 Features zu zeigen.
        const guiEl = fromHtml(`
        <div class="zui">
            <div class="zui-header">
                Krunker Cheat
                <span class="zui-item-value" style="color:var(--neon-color)">*</span>
            </div>
            <div class="zui-content">
                <div class="zui-section main-settings-section">
                    <div class="zui-item" data-setting="aimbotEnabled">
                        <span>Aimbot (B)</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="espEnabled">
                        <span>ESP (M)</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="espLines">
                        <span>ESP Lines (N)</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-setting="recoilCompEnabled">
                        <span>Recoil Compensation (C)</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                    <div class="zui-item" data-addon-setting="Krunker Hardcore Mode">
                        <span>Krunker Hardcore Mode (H)</span>
                        <span class="zui-item-value">OFF</span>
                    </div>
                </div>
                <div class="zui-item text">
                    <span>Dev: xenona</span>
                </div>
            </div>
        </div>
        `);

        // Da es nur noch eine Sektion gibt, brauchen wir keine Toggle-Buttons mehr.

        const mainToggleItems = guiEl.querySelectorAll('.main-settings-section .zui-item[data-setting]');
        mainToggleItems.forEach(item => {
            const settingKey = item.getAttribute('data-setting');
            const valueEl = item.querySelector('.zui-item-value');
            updateSettingDisplay(settingKey, settings[settingKey], valueEl);

            item.addEventListener('click', function() {
                settings[settingKey] = !settings[settingKey];
                updateSettingDisplay(settingKey, settings[settingKey], valueEl);
                showMsg(`${fromCamel(settingKey)} ${settings[settingKey] ? 'enabled' : 'disabled'}`, settings[settingKey]);
                applyImmediateEffects(settingKey, settings[settingKey]);
            });
        });

        // Hardcore Mode wird separat behandelt, da es im addOnSettings-Objekt ist (muss bleiben, da es eine spezielle Funktion auslöst)
        const addOnToggleItem = guiEl.querySelector('.main-settings-section .zui-item[data-addon-setting="Krunker Hardcore Mode"]');
        if (addOnToggleItem) {
            const settingName = 'Krunker Hardcore Mode';
            const valueEl = addOnToggleItem.querySelector('.zui-item-value');
            updateAddOnSettingDisplay(settingName, addOnSettings[settingName], valueEl);

            addOnToggleItem.addEventListener('click', function() {
                addOnSettings[settingName] = !addOnSettings[settingName];
                updateAddOnSettingDisplay(settingName, addOnSettings[settingName], valueEl);
                showMsg(`${settingName} ${addOnSettings[settingName] ? 'enabled' : 'disabled'}`, addOnSettings[settingName]);
                applyImmediateAddOnEffects(settingName, addOnSettings[settingName]);
            });
        }

        return guiEl;
    }

    function updateSettingDisplay(settingKey, isActive, valueEl) {
        valueEl.innerText = isActive ? 'ON' : 'OFF';
        // NEON COLORS: Cyan for ON, Vibrant Red for OFF
        valueEl.style.color = isActive ? '#00ffff' : '#ff4757';
    }

    function updateAddOnSettingDisplay(settingName, isActive, valueEl) {
        valueEl.innerText = isActive ? 'ON' : 'OFF';
        // NEON COLORS: Cyan for ON, Vibrant Red for OFF
        valueEl.style.color = isActive ? '#00ffff' : '#ff4757';
    }

    function applyImmediateEffects(settingKey, value) {
        console.log(`Setting ${settingKey} turned ${value ? 'ON' : 'OFF'}`);

        switch(settingKey) {
            case 'aimbotEnabled':
                // AimAssist wurde entfernt, also nur Aimbot übrig
                break;
            case 'espEnabled':
            case 'espLines':
                break;
            case 'recoilCompEnabled':
                // Recoil Comp ist ein Toggle (an/aus) und die Logik wird in pointerdown/up und animate gehandhabt.
                break;
            default:
                console.log(`No action for setting: ${settingKey}`);
        }
    }

    function applyImmediateAddOnEffects(settingName, value) {
        console.log(`Add-On setting ${settingName} turned ${value ? 'ON' : 'OFF'}`);

        switch(settingName) {
            case 'Krunker Hardcore Mode':
                if(value) { enablekrunkerhardcore(); } else { disablekrunkerhardcore(); }
                break;
            default:
                console.log(`No action for Add-On setting: ${settingName}`);
        }
    }

    function fromCamel(text) {
        const result = text.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Dummy functions für entfernte Features entfernt
    function enableAimbot(){console.log("Aimbot enabled");}
    function disableAimbot(){console.log("Aimbot disabled");}
    function enableESP(){console.log("ESP enabled");}
    function disableESP(){console.log("ESP disabled");}
    function enableESPLines(){console.log("ESP Lines enabled");}
    function disableESPLines(){console.log("ESP Lines disabled");}
    function enableRecoilCompensation(){console.log("Recoil Compensation enabled");}
    function disableRecoilCompensation(){console.log("Recoil Compensation disabled");}

    window.addEventListener('keyup', function (event) {
        if (document.activeElement && document.activeElement.value !== undefined) return;

        // Haupt-Settings-Toggle
        if (keyToSetting[event.code]) {
            const settingKey = keyToSetting[event.code];

            // Überprüfen ob es ein Standard-Setting ist
            if (settings.hasOwnProperty(settingKey)) {
                toggleSetting(settingKey);
            }
            // Überprüfen ob es ein AddOn-Setting ist (Hardcore Mode)
            else if (addOnSettings.hasOwnProperty(settingKey)) {
                addOnSettings[settingKey] = !addOnSettings[settingKey];

                const item = document.querySelector(`.main-settings-section .zui-item[data-addon-setting="${settingKey}"]`);
                if(item) {
                    const valueEl = item.querySelector('.zui-item-value');
                    updateAddOnSettingDisplay(settingKey, addOnSettings[settingKey], valueEl);
                }
                showMsg(`${settingKey} ${addOnSettings[settingKey] ? 'enabled' : 'disabled'}`, addOnSettings[settingKey]);
                applyImmediateAddOnEffects(settingKey, addOnSettings[settingKey]);
            }
        }
    });

    function toggleSetting(key) {
        settings[key] = !settings[key];
        showMsg(`${fromCamel(key)} ${settings[key] ? 'enabled' : 'disabled'}`, settings[key]);
        const item = document.querySelector(`.main-settings-section .zui-item[data-setting="${key}"]`);
        if(item) {
            const valueEl = item.querySelector('.zui-item-value');
            updateSettingDisplay(key, settings[key], valueEl);
        }
        applyImmediateEffects(key, settings[key]);
    }

    function appendGUI() {
        const gui = createGUI();
        document.body.appendChild(gui);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', appendGUI);
    } else {
        appendGUI();
    }

    animate();

})();