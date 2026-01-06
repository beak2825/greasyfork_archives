// ==UserScript==
// @name         Nurbo Mod
// @namespace    http://youtube.com
// @version      1.5.7.1
// @description  Macro: Shift=Insta, R=Reverse Insta, Space=Boost+Spike, B/C=4 Traps/Spikes.Bot Farmer: L=spawn alt, ,=delete alts, Z=repel bots, auto-mills and upgrades.
// @icon         https://static.wikia.nocookie.net/moom/images/7/70/Cookie.png/revision/latest?cb=20190223141839
// @author       Nurbo Mod
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @require      https://update.greasyfork.org/scripts/480301/1322984/CowJS.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560817/Nurbo%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/560817/Nurbo%20Mod.meta.js
// ==/UserScript==

//Utility
(function () {
    'use strict';

    let ws;
    const msgpack5 = window.msgpack;

    let boostType, spikeType, turretType = null, windmillType = null, foodType;
    let width, height, mouseX, mouseY;
    let myPlayer = {
        id: null, x: null, y: null, dir: null, object: null,
        weapon: null, clan: null, isLeader: null,
        hat: null, accessory: null, isSkull: null,
        health: 100
    };
    let myPlayeroldx, myPlayeroldy;
    let automillx = 10, automilly = 10;
    let walkmillhaha = false;
    const keysPressed = {};
    const placementIntervals = {};
    let gInterval = null;

    let autoaim = false; // Отключаем автоаим по умолчанию
    let nearestEnemy = null, nearestEnemyAngle = 0, enemiesNear = [];

    let gameTick = 0, lastDamageTick = 0, damageTimes = 0, shame = 0, shameTime = 0, HP = 100;
    let anti = true;
    let hitBack = false;
    let primary = null;

    // Auto Insta variables - КАК В x-RedDragon Client
    let autoInstaEnabled = false;
    let autoInstaDistance = 200;
    let autoInstaCooldown = 2000;
    let lastAutoInstaTime = 0;
    let autoInstaCheckInterval = null;

    // Auto Spike Surround variables
    let autoSpikeSurroundEnabled = false;
    let spikeSurroundDistance = 50;
    let lastSpikeSurroundTime = 0;
    let spikeSurroundCooldown = 3000;

    // Menu variables
    let menuOpen = false;
    let menuElement = null;
    let menuBtn = null;

    // АВТОХИЛ - ВСЕГДА ВКЛЮЧЕН
    let autoHealEnabled = true;

    function addNamePrefix() {
        const input = document.querySelector('#nameInput');
        if (input && !input.value.trim().startsWith('n-')) {
            input.value = 'n-' + input.value.trim();
        }
    }

    window.addEventListener('load', () => {
        addNamePrefix();
        const input = document.querySelector('#nameInput');
        if (input) {
            input.addEventListener('input', () => {
                input.value = 'n-' + input.value.replace(/^n-+/i, '');
            });

            input.addEventListener('blur', () => {
                if (!input.value.startsWith('n-')) {
                    input.value = 'n-' + input.value;
                }
            });
        }
    });

    function storeEquip(id, index) {
        doNewSend(["c", [0, id, index]]);
    }

    const cvs = document.getElementById("gameCanvas");
    if (!cvs) return;

    cvs.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        width = e.target.clientWidth;
        height = e.target.clientHeight;
    });

    function doNewSend(sender) {
        if (ws && msgpack5) ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
    }

    function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
        if (id == null) return;
        doNewSend(["z", [id, null]]);
        doNewSend(["F", [1, angle]]);
        doNewSend(["F", [0, angle]]);
        doNewSend(["z", [myPlayer.weapon, true]]);
    }

    // ФУНКЦИЯ АВТОХИЛА ДЛЯ ГЛАВНОГО ИГРОКА
    function healMainPlayer(currentHealth) {
    if (!autoHealEnabled || currentHealth >= 100) return; // Не хилим если здоровье 100 или больше

    let timeout = 115;
    if (currentHealth <= 60) { // Быстрый хил только при очень низком здоровье (≤60)
        timeout = 1;
    };

    setTimeout(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        // Используем яблоко (item 0)
        doNewSend(["z", [0, null]]);
        doNewSend(["F", [1, null]]);
        doNewSend(["F", [0, null]]);
        doNewSend(["z", [myPlayer.weapon, true]]);

        // Если здоровье очень низкое (≤60), используем печеньку (item 1) сразу
        if (currentHealth <= 60) {
            setTimeout(() => {
                doNewSend(["z", [1, null]]);
                doNewSend(["F", [1, null]]);
                doNewSend(["F", [0, null]]);
                doNewSend(["z", [myPlayer.weapon, true]]);
            }, 50);
        }
    }, timeout);
}

    function isVisible(el) {
        return el && el.offsetParent !== null;
    }

    function updateItems() {
        for (let i = 31; i < 33; i++) if (isVisible(document.getElementById("actionBarItem" + i))) boostType = i - 16;
        for (let i = 22; i < 26; i++) if (isVisible(document.getElementById("actionBarItem" + i))) spikeType = i - 16;
        for (let i = 26; i <= 28; i++) if (isVisible(document.getElementById("actionBarItem" + i))) windmillType = i - 16;
        for (let i = 33; i <= 38; i++) if (i !== 36 && isVisible(document.getElementById("actionBarItem" + i))) turretType = i - 16;
        for (let i = 16; i <= 18; i++) if (isVisible(document.getElementById("actionBarItem" + i))) foodType = i - 16;
    }
    setInterval(updateItems, 250);

    function toRad(degrees) {
        return degrees * 0.01745329251;
    }

    function getSecondaryWeaponIndex() {
        for (let i = 9; i <= 15; i++) {
            if (isVisible(document.getElementById("actionBarItem" + i)) && i !== myPlayer.weapon) {
                return i;
            }
        }
        return myPlayer.weapon;
    }

    function startPlacingStructure(key, itemId) {
        if (!placementIntervals[key]) placementIntervals[key] = setInterval(() => place(itemId), 50);
    }
    function stopPlacingStructure(key) {
        clearInterval(placementIntervals[key]);
        delete placementIntervals[key];
    }

    function performGSequence() {
        if (!nearestEnemy) return;

        // Проверяем расстояние до врага
        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 250) {
            doNewSend(["6", ["Враг слишком далеко для G-последовательности"]]);
            return;
        }

        doNewSend(["9", [nearestEnemyAngle]]);

        place(spikeType, nearestEnemyAngle + Math.PI / 2);
        place(spikeType, nearestEnemyAngle - Math.PI / 2);

        if (distance <= 150) {
            place(spikeType, nearestEnemyAngle - Math.PI / 4);
            place(spikeType, nearestEnemyAngle + Math.PI / 4);
        }

        place(boostType, nearestEnemyAngle);
    }

    function performBPlacement() {
        const base = myPlayer.dir;
        place(boostType, base);
        place(boostType, base + Math.PI / 2);
        place(boostType, base - Math.PI / 2);
        place(boostType, base + Math.PI);
    }

    function placeFourSpikesUp() {
        const firstAngle = -Math.PI / 2;
        place(spikeType, firstAngle);
        place(spikeType, firstAngle + toRad(90));
        place(spikeType, firstAngle + toRad(180));
        place(spikeType, firstAngle + toRad(270));
    }

    function performSpikeSurround() {
        if (!nearestEnemy || !autoSpikeSurroundEnabled) return;

        const currentTime = Date.now();
        if (currentTime - lastSpikeSurroundTime < spikeSurroundCooldown) return;

        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= spikeSurroundDistance) {
            const enemyAngle = nearestEnemyAngle;
            place(spikeType, enemyAngle);
            place(spikeType, enemyAngle + Math.PI / 2);
            place(spikeType, enemyAngle + Math.PI);
            place(spikeType, enemyAngle + 3 * Math.PI / 2);

            lastSpikeSurroundTime = Date.now();
        }
    }

   function performNormalInsta() {
    // Определяем угол атаки
    let attackAngle;
    if (nearestEnemy) {
        // Если есть ближайший враг, используем его угол
        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 250 && autoaim) {
            // Если автоаим включен и враг дальше 250px, используем направление мыши
            attackAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
        } else {
            // Используем угол к врагу
            attackAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        }
    } else {
        // Если нет врага, используем направление мыши
        attackAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
    }

    storeEquip(0, 1);
    setTimeout(() => {
        const wasAutoaim = autoaim;
        autoaim = true; // Включаем автоаим для точности атаки

        // Устанавливаем направление атаки
        doNewSend(["D", [attackAngle]]);

        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["z", [primary, true]]);
        doNewSend(["F", [1, attackAngle]]);
        setTimeout(() => doNewSend(["F", [0, attackAngle]]), 25);

        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
            doNewSend(["z", [secondary, true]]);
            doNewSend(["F", [1, attackAngle]]);
            setTimeout(() => doNewSend(["F", [0, attackAngle]]), 25);

            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["z", [primary, true]]);
                doNewSend(["z", [primary, true]]);
                autoaim = wasAutoaim; // Восстанавливаем предыдущее состояние автоаима

                setTimeout(() => {
                    storeEquip(11, 1);

                    if (secondary === 15) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1900);
                    } else if (secondary === 12) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                    } else if (secondary === 13) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 400);
                    }
                }, 170);
            }, 120);
        }, 120);
    }, 120);
}
    function performReverseInsta() {
        if (!nearestEnemy) return;

        // Проверяем расстояние до врага
        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 300) {
            doNewSend(["6", ["Враг слишком далеко для реверс-инсты (требуется ≤250px)"]]);
            return;
        }

        storeEquip(0, 1);
        setTimeout(() => {
            const wasAutoaim = autoaim;
            autoaim = true;
            const primary = myPlayer.weapon;
            const secondary = getSecondaryWeaponIndex();

            doNewSend(["z", [secondary, true]]);
            doNewSend(["z", [secondary, true]]);

            doNewSend(["c", [0, 53, 0]]);
            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 20);

            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 7, 0]]);
                doNewSend(["F", [1]]);
                setTimeout(() => doNewSend(["F", [0]]), 20);
            }, 80);

            setTimeout(() => {
                doNewSend(["z", [primary, true]]);
                doNewSend(["z", [primary, true]]);
                doNewSend(["c", [0, 6, 0]]);
                storeEquip(11, 1);
                autoaim = wasAutoaim;

                setTimeout(() => {
                    if (secondary === 15) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                    } else if (secondary === 12) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 700);
                    } else if (secondary === 13) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 300);
                    }
                }, 150);
            }, 400);
        }, 100);
    }

    function checkAndPerformAutoInsta() {
        if (!autoInstaEnabled || !nearestEnemy || myPlayer.health < 50) return;

        const currentTime = Date.now();
        if (currentTime - lastAutoInstaTime < autoInstaCooldown) return;

        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= autoInstaDistance) {
            performNormalInsta();
            lastAutoInstaTime = Date.now();
            doNewSend(["6", ["Auto-Insta активирована!"]]);
        }
    }

    function toggleAutoInsta() {
        autoInstaEnabled = !autoInstaEnabled;
        if (autoInstaEnabled) {
            if (!autoInstaCheckInterval) {
                autoInstaCheckInterval = setInterval(checkAndPerformAutoInsta, 1000);
            }
            doNewSend(["6", ["Auto-Insta: ON (расстояние: " + autoInstaDistance + ")"]]);
        } else {
            if (autoInstaCheckInterval) {
                clearInterval(autoInstaCheckInterval);
                autoInstaCheckInterval = null;
            }
            doNewSend(["6", ["Auto-Insta: OFF"]]);
        }
        updateMenu();
    }

    function toggleAutoSpikeSurround() {
        autoSpikeSurroundEnabled = !autoSpikeSurroundEnabled;
        doNewSend(["6", ["AS " + (autoSpikeSurroundEnabled ?'hehe' : 'off')]]);
        updateMenu();
    }

    function toggleAimMode() {
        autoaim = !autoaim;
        doNewSend(["6", ["AutoAim: " + (autoaim ? "ON (250px)" : "OFF")]]);
        updateMenu();
    }




    // Функции для меню
    function createMenu() {
        if (document.getElementById('nurbo-mod-menu')) return;

        menuElement = document.createElement('div');
        menuElement.id = 'nurbo-mod-menu';
        menuElement.style.cssText = `
            position: fixed;
            top: 50px;
            left: 10px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px;

            z-index: 9999;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            min-width: 280px;
            display: none;

        `;

        document.body.appendChild(menuElement);
        updateMenu();
    }

    function updateMenu() {
        if (!menuElement) return;

        menuElement.innerHTML = '';

        const titleBar = document.createElement('div');
        titleBar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

        const title = document.createElement('div');
        title.textContent = '⚡ Nurbo Mod v1.5.6.4';
        title.style.cssText = 'font-size: 14px; font-weight: bold; color: #00ff00;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖';
        closeBtn.style.cssText = `
            background: #ff3333;
            color: white;
            border: none;
            border-radius: 3px;
            width: 22px;
            height: 22px;
            cursor: pointer;
            font-size: 11px;
            padding: 0;
        `;
        closeBtn.onclick = () => toggleMenu();

        titleBar.appendChild(title);
        titleBar.appendChild(closeBtn);
        menuElement.appendChild(titleBar);

        const togglesGrid = document.createElement('div');
        togglesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 15px;';

        const toggleSettings = [
            { name: 'Auto Insta', value: autoInstaEnabled, toggle: toggleAutoInsta, key: 'P' },
            { name: 'Auto Spike', value: autoSpikeSurroundEnabled, toggle: toggleAutoSpikeSurround, key: 'U' },
            { name: 'Auto Aim (300px)', value: autoaim, toggle: toggleAimMode, key: 'O' },

        ];

        toggleSettings.forEach(setting => {
            const toggleItem = document.createElement('div');
            toggleItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';

            const label = document.createElement('span');
            label.textContent = setting.name;
            label.style.cssText = 'color: #cccccc; font-size: 12px;';

            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = setting.value ? 'ON' : 'OFF';
            toggleBtn.style.cssText = `
                background: ${setting.value ? '#00aa00' : '#550000'};
                color: white;
                border: none;
                border-radius: 3px;
                padding: 2px 10px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                min-width: 40px;
            `;
            toggleBtn.onclick = setting.toggle;

            const keyHint = document.createElement('span');
            keyHint.textContent = setting.key;
            keyHint.style.cssText = 'color: #00ff00; font-size: 10px; margin-left: 5px;';

            toggleItem.appendChild(label);
            const rightSide = document.createElement('div');
            rightSide.style.cssText = 'display: flex; align-items: center;';
            rightSide.appendChild(toggleBtn);
            rightSide.appendChild(keyHint);
            toggleItem.appendChild(rightSide);

            togglesGrid.appendChild(toggleItem);
        });

        menuElement.appendChild(togglesGrid);

        const controlsTitle = document.createElement('div');
        controlsTitle.textContent = 'Settings:';
        controlsTitle.style.cssText = 'color: #00ffff; font-weight: bold; font-size: 12px; margin: 10px 0 5px 0; border-top: 1px solid #333; padding-top: 8px;';
        menuElement.appendChild(controlsTitle);

        const createSlider = (labelText, value, min, max, step, onChange, keyText = '') => {
            const container = document.createElement('div');
            container.style.cssText = 'margin: 6px 0;';

            const labelRow = document.createElement('div');
            labelRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 3px;';

            const label = document.createElement('span');
            label.textContent = labelText;
            label.style.cssText = 'color: #aaaaaa; font-size: 11px;';

            const valueDisplay = document.createElement('span');
            valueDisplay.textContent = value + 'px';
            valueDisplay.style.cssText = 'color: #ffff00; font-size: 11px; font-weight: bold;';

            labelRow.appendChild(label);
            labelRow.appendChild(valueDisplay);
            container.appendChild(labelRow);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.step = step;
            slider.value = value;
            slider.style.cssText = 'width: 100%; height: 4px; margin: 2px 0;';

            slider.oninput = () => {
                valueDisplay.textContent = slider.value + 'px';
                onChange(parseInt(slider.value));
            };

            container.appendChild(slider);

            if (keyText) {
                const keyInfo = document.createElement('div');
                keyInfo.textContent = keyText;
                keyInfo.style.cssText = 'color: #00aa00; font-size: 9px; text-align: right; margin-top: 2px;';
                container.appendChild(keyInfo);
            }

            return container;
        };

        menuElement.appendChild(createSlider(
            'Auto Insta Distance',
            autoInstaDistance,
            100,
            500,
            50,
            (val) => {
                autoInstaDistance = val;
                doNewSend(["6", ["Auto-Insta расстояние: " + val + "px"]]);
                updateMenu();
            },
            '[ ] to adjust'
        ));

        const hotkeysTitle = document.createElement('div');
        hotkeysTitle.textContent = 'Hotkeys:';
        hotkeysTitle.style.cssText = 'color: #ffaa00; font-weight: bold; font-size: 12px; margin: 12px 0 5px 0; border-top: 1px solid #333; padding-top: 8px;';
        menuElement.appendChild(hotkeysTitle);

        const hotkeysGrid = document.createElement('div');
        hotkeysGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; font-size: 10px;';

        const hotkeys = [
            'Shift - Insta',
            'R - Reverse Insta',
            'Space - Boost+Spike',
            'B - 4 Traps',
            'C - 4 Spikes',
            ', - AntiTrap',
            'F - Trap/Boost',
            'V - Spike',
            'N - Mill',
            'P - AutoInsta',
            'U - AutoSpike',
            'O - AutoAim (300px)',
            '[ ] - AutoDist',
            'ESC - Menu',
            '[L] - Send Alt',
            '[,] - Delete Alts',
            '[Z] - Repel Alts',
            '[M] - AutoMills'
        ];

        hotkeys.forEach(hotkey => {
            const item = document.createElement('div');
            item.textContent = hotkey;
            item.style.cssText = 'color: #cccccc; font-size: 10px; padding: 2px 4px; background: rgba(255,255,255,0.05); border-radius: 3px;';
            hotkeysGrid.appendChild(item);
        });

        menuElement.appendChild(hotkeysGrid);
    }

    function toggleMenu() {
        menuOpen = !menuOpen;
        if (menuElement) {
            menuElement.style.display = menuOpen ? 'block' : 'none';
        }
        if (menuBtn) {
            menuBtn.textContent = menuOpen ? '✖' : '⚙️';
            menuBtn.style.background = menuOpen ? 'rgba(100, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        }
    }

    document.addEventListener("keydown", e => {
        if (document.activeElement.id.toLowerCase() === 'chatbox') return;
        const k = e.key.toLowerCase();
        if (keysPressed[k]) return;
        keysPressed[k] = true;

        if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== "chatbox") {
            performNormalInsta();
        }

        if (e.keyCode == 82 && document.activeElement.id.toLowerCase() !== "chatbox") {
            performReverseInsta();
        }

        if (e.keyCode == 32 && document.activeElement.id.toLowerCase() !== "chatbox") {
            if (!nearestEnemy) return;

            // Проверяем расстояние до врага
            const dx = myPlayer.x - nearestEnemy[1];
            const dy = myPlayer.y - nearestEnemy[2];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 700) {
                doNewSend(["6", ["Враг слишком далеко для Boost+Spike"]]);
                return;
            }

            doNewSend(["9", [nearestEnemyAngle]]);
            place(boostType, nearestEnemyAngle);
            place(spikeType, nearestEnemyAngle + Math.PI / 4);
            place(spikeType, nearestEnemyAngle - Math.PI / 4);

            if (!gInterval) {
                gInterval = setInterval(() => {
                    if (nearestEnemy) {
                        doNewSend(["9", [nearestEnemyAngle]]);
                        place(boostType, nearestEnemyAngle);
                    }
                }, 80);
            }
        }

        if (k === 'p') {
            toggleAutoInsta();
        }

        if (k === 'u') {
            toggleAutoSpikeSurround();
        }

        if (k === 'o') {
            toggleAimMode();
        }

        // КЛАВИША H ДЛЯ АВТОХИЛА
        if (k === 'h') {
               doNewSend(["6", ["kukareku"]]);
        }
 if (k === 'y') {
               doNewSend(["6", ["y run?"]]);
        }
        if (e.keyCode === 27) {
            toggleMenu();
        }

        if (k === '[' && autoInstaEnabled) {
            autoInstaDistance = Math.max(100, autoInstaDistance - 50);
            doNewSend(["6", ["Auto-Insta расстояние: " + autoInstaDistance]]);
            updateMenu();
        }
        if (k === ']' && autoInstaEnabled) {
            autoInstaDistance = Math.min(500, autoInstaDistance + 50);
            doNewSend(["6", ["Auto-Insta расстояние: " + autoInstaDistance]]);
            updateMenu();
        }

        if (k === '.' && autoSpikeSurroundEnabled) {
            spikeSurroundDistance = Math.max(30, spikeSurroundDistance - 10);
            doNewSend(["6", ["Auto Spike расстояние: " + spikeSurroundDistance]]);
            updateMenu();
        }
        if (k === '/' && autoSpikeSurroundEnabled) {
            spikeSurroundDistance = Math.min(100, spikeSurroundDistance + 10);
            doNewSend(["6", ["Auto Spike расстояние: " + spikeSurroundDistance]]);
            updateMenu();
        }

        if (k === 'm') {
            walkmillhaha = !walkmillhaha;
            doNewSend(["6", ["Auto Mills: " + (walkmillhaha ? "ON" : "OFF")]]);
            updateMenu();
        }
        if (k === 'f') startPlacingStructure(k, boostType);
        if (k === 'v') startPlacingStructure(k, spikeType);
        if (k === 'n') startPlacingStructure(k, windmillType);
        if (k === 'g') startPlacingStructure(k, turretType);

        if (k === 'b') performBPlacement();
        if (k === 'c') placeFourSpikesUp();
    });

    document.addEventListener("keyup", e => {
        const k = e.key.toLowerCase();
        keysPressed[k] = false;
        stopPlacingStructure(k);

        if (e.keyCode == 32 && gInterval) {
            clearInterval(gInterval);
            gInterval = null;

            if (nearestEnemy) {
                doNewSend(["9", [myPlayer.dir]]);
                place(spikeType, nearestEnemyAngle - Math.PI / 4);
                place(spikeType, nearestEnemyAngle + Math.PI / 4);
            }
        }
    });

    if (!WebSocket.prototype.__originalSend) {
        WebSocket.prototype.__originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function (data) {
            if (!ws) {
                ws = this;
                document.ws = this;
                ws.addEventListener("message", handleMessage);
            }
            return this.__originalSend(data);
        };
    }

    function handleMessage(m) {
        let temp = msgpack5.decode(new Uint8Array(m.data));
        let data = (temp.length > 1) ? [temp[0], ...temp[1]] : temp;
        if (!data) return;

        if (data[0] === "C" && myPlayer.id == null) myPlayer.id = data[1];

        if (data[0] === "a") {
            for (let i = 0; i < data[1].length / 13; i++) {
                let obj = data[1].slice(13 * i, 13 * i + 13);
                if (obj[0] === myPlayer.id) {
                    [myPlayer.x, myPlayer.y, myPlayer.dir, myPlayer.object, myPlayer.weapon,
                        , myPlayer.clan, myPlayer.isLeader, myPlayer.hat, myPlayer.accessory,
                        myPlayer.isSkull] = [obj[1], obj[2], obj[3], obj[4],
                        obj[5], obj[7], obj[8], obj[9], obj[10], obj[11]];
                } else enemiesNear.push(obj);
            }

            if (enemiesNear.length > 0) {
                // Сортируем врагов по расстоянию
                enemiesNear.sort((a, b) => {
                    const distA = Math.hypot(a[1] - myPlayer.x, a[2] - myPlayer.y);
                    const distB = Math.hypot(b[1] - myPlayer.x, b[2] - myPlayer.y);
                    return distA - distB;
                });

                // Берем ближайшего врага
                nearestEnemy = enemiesNear[0];

                // Проверяем расстояние до ближайшего врага
                if (nearestEnemy) {
                    const dx = myPlayer.x - nearestEnemy[1];
                    const dy = myPlayer.y - nearestEnemy[2];
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Если враг дальше 250px, сбрасываем целеполагание
                    if (distance > 300) {
                        nearestEnemy = null;
                    } else {
                        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
                    }
                }

                if (autoSpikeSurroundEnabled && nearestEnemy) {
                    performSpikeSurround();
                }
            } else {
                nearestEnemy = null;
            }

            enemiesNear = [];

            if (automillx === false) automillx = myPlayer.x;
            if (automilly === false) automilly = myPlayer.y;

            if (myPlayeroldy !== myPlayer.y || myPlayeroldx !== myPlayer.x) {
                if (walkmillhaha) {
                    if (Math.sqrt(Math.pow(myPlayer.y - automilly, 2) + Math.pow(myPlayer.x - automillx, 2)) > 100) {
                        let angle = Math.atan2(myPlayeroldy - myPlayer.y, myPlayeroldx - myPlayer.x);
                        place(windmillType, angle + toRad(78));
                        place(windmillType, angle - toRad(78));
                        place(windmillType, angle);
                        doNewSend(["D", [Math.atan2(mouseY - height / 2, mouseX - width / 2)]]);
                        automillx = myPlayer.x;
                        automilly = myPlayer.y;
                    }
                }
                myPlayeroldx = myPlayer.x;
                myPlayeroldy = myPlayer.y;
            }
        }

        // АВТОХИЛ ПРИ ПОЛУЧЕНИИ УРОНА
        if (data[0] === "O" && data[1] === myPlayer.id) {
            gameTick = 0;
            lastDamageTick = 0;
            shame = 0;
            HP = 100;
            shameTime = 0;
            myPlayer.health = data[2];

            // ВЫЗОВ ФУНКЦИИ АВТОХИЛА
            if (autoHealEnabled && myPlayer.health < 100) {
                healMainPlayer(myPlayer.health);
            }
        }
    }

    setInterval(() => {
        if (autoaim && nearestEnemy) {
            // Двойная проверка расстояния перед автоаимом
            const dx = myPlayer.x - nearestEnemy[1];
            const dy = myPlayer.y - nearestEnemy[2];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 300) {
                doNewSend(["D", [nearestEnemyAngle]]);
            }
        }
    }, 10);

    // 🧠 Anti-Rotación
    Object.defineProperty(Object.prototype, "turnSpeed", {
        get() { return 0; },
        set(_) {},
        configurable: true
    });

    // === AUTO GG ===
    let prevKillCount = 0;

    function initAutoGG() {
        const killCounter = document.getElementById("killCounter");
        if (!killCounter) {
            setTimeout(initAutoGG, 500);
            return;
        }

        const observer = new MutationObserver(() => {
            const count = parseInt(killCounter.innerText, 10) || 0;
            if (count > prevKillCount) {
                prevKillCount = count;
                doNewSend(["6", ["Nurbo mod gg"]]);
                setTimeout(() => {
                    doNewSend(["6", [``]]);
                }, 1000);
            }
        });

        observer.observe(killCounter, { childList: true, characterData: true, subtree: true });
    }

    initAutoGG();

    // === FASTBREAK ===
    let rightClickAttackInterval = null;
    let rightClickHeld = false;
    let isPlacingStructure = false;
    let attackPausedForPlacement = false;

    function ensureCorrectWeapon() {
        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        let correctWeapon = (secondary === 10) ? secondary : primary;

        if (myPlayer.weapon !== correctWeapon) {
            doNewSend(["z", [correctWeapon, true]]);
        }
    }

    function startAttackLoop() {
        if (rightClickAttackInterval) return;

        rightClickAttackInterval = setInterval(() => {
            ensureCorrectWeapon();
            doNewSend(["c", [0, 40, 0]]);
            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 8);
        }, 50);
    }

    function stopAttackLoop() {
        clearInterval(rightClickAttackInterval);
        rightClickAttackInterval = null;
    }

    document.addEventListener("mousedown", function (e) {
        if (e.button === 2 && !rightClickHeld) {
            rightClickHeld = true;
            doNewSend(["c", [0, 40, 0]]);

            setTimeout(() => {
                if (rightClickHeld && !isPlacingStructure) {
                    startAttackLoop();
                }
            }, 50);
        }
    });

    document.addEventListener("mouseup", function (e) {
        if (e.button === 2 && rightClickHeld) {
            rightClickHeld = false;
            stopAttackLoop();
            doNewSend(["F", [0]]);
            setTimeout(() => doNewSend(["c", [0, 6, 0]]), 80);
        }
    });

    const originalPlace = place;
    place = function (...args) {
        isPlacingStructure = true;

        if (rightClickAttackInterval) {
            attackPausedForPlacement = true;
            stopAttackLoop();
        }

        originalPlace.apply(this, args);

        setTimeout(() => {
            isPlacingStructure = false;
            if (rightClickHeld && attackPausedForPlacement) {
                attackPausedForPlacement = false;
                startAttackLoop();
            }
        }, 80);
    };

    const oldStoreEquip = window.storeEquip;
    window.storeEquip = function (id, slot) {
        oldStoreEquip.apply(this, arguments);

        if (rightClickHeld) {
            ensureCorrectWeapon();
        }
    };

    const oldEquipWeapon = window.equipWeapon;
    window.equipWeapon = function (id) {
        oldEquipWeapon.apply(this, arguments);

        if (rightClickHeld) {
            ensureCorrectWeapon();
        }
    };

    // 🎩 AutoBiomeHatController
    function autoBiomeHatController() {
        let normalHat = 12;
        let currentHat = null;
        let overridePause = false;
        let resumeTimeout = null;
        const movementKeys = new Set();
        const overrideKeys = new Set([16, "r", " "]);

        function setHat(id) {
            if (id !== currentHat && myPlayer && myPlayer.id != null) {
                currentHat = id;
                doNewSend(["c", [0, id, 0]]);

                let accessoryId = null;
                if (id === 6) {
                    accessoryId = 0;
                } else if ([15, 31, 12].includes(id)) {
                    accessoryId = 11;
                }

                if (accessoryId !== null) {
                    [30, 60, 90].forEach(delay => {
                        setTimeout(() => {
                            storeEquip(accessoryId, 1);
                        }, delay);
                    });
                }
            }
        }

        function updateBiomeHat() {
            if (!myPlayer || typeof myPlayer.y !== "number") return;
            if (myPlayer.y < 2400) normalHat = 15;
            else if (myPlayer.y > 6850 && myPlayer.y < 7550) normalHat = 31;
            else normalHat = 12;
        }

        function updateHatLogic() {
            if (overridePause) return;
            updateBiomeHat();
            if (movementKeys.size > 0) {
                setHat(normalHat);
            } else {
                setHat(6);
            }
        }

        function pauseOverride() {
            overridePause = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        }

        function resumeOverride() {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                overridePause = false;
                updateHatLogic();
            }, 300);
        }

        document.addEventListener("keydown", e => {
            const key = e.key.toLowerCase();
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
                if (!movementKeys.has(key)) {
                    movementKeys.add(key);
                    updateHatLogic();
                }
            }
            if (overrideKeys.has(key)) pauseOverride();
        });

        document.addEventListener("keyup", e => {
            const key = e.key.toLowerCase();
            if (movementKeys.delete(key)) updateHatLogic();
            if (overrideKeys.has(key)) resumeOverride();
        });

        document.addEventListener("mousedown", e => {
            if (e.button === 0 || e.button === 2) pauseOverride();
        });

        document.addEventListener("mouseup", e => {
            if (e.button === 0 || e.button === 2) resumeOverride();
        });

        setInterval(() => {
            if (!overridePause) updateHatLogic();
        }, 200);
    }

    autoBiomeHatController();

    // === ANTI TRAP ===
    let antiTrap = false;
    let intrap = false;
    let trapAngle = null;
    let trapId = null;

    document.addEventListener("keydown", e => {
        if (document.activeElement.id.toLowerCase() === 'chatbox') return;
        if (e.key === ",") {
            antiTrap = !antiTrap;
            doNewSend(["6", ["AntiTrap: " + (antiTrap ? "ON" : "OFF")]]);
        }
    });

    function handleTrapData(node) {
        for (let i = 0; i < node[1].length / 8; i++) {
            let obj = node[1].slice(8 * i, 8 * i + 8);
            if (obj[6] === 15 && obj[7] !== myPlayer.id && obj[7] !== myPlayer.clan) {
                let dx = obj[1] - myPlayer.x;
                let dy = obj[2] - myPlayer.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    intrap = true;
                    trapAngle = Math.atan2(dy, dx);
                    trapId = obj[0];
                }
            }
        }
    }

    const oldHandleMessage = handleMessage;
    handleMessage = function (m) {
        let temp = msgpack5.decode(new Uint8Array(m.data));
        let data = (temp.length > 1) ? [temp[0], ...temp[1]] : temp;
        if (!data) return;

        if (data[0] === "H") handleTrapData(data);

        if (data[0] === "Q" && intrap && trapId === data[1]) {
            intrap = false;
            trapId = null;
            setTimeout(() => doNewSend(["c", [0, 6, 0]]), 80);
        }

        oldHandleMessage(m);
    };

    function hookEquipFunctions() {
        if (typeof window.storeEquip === "function" && typeof window.equipWeapon === "function") {
            const oldStoreEquip = window.storeEquip;
            window.storeEquip = function (id, slot) {
                const result = oldStoreEquip.apply(this, arguments);
                if (antiTrap && intrap) ensureCorrectWeapon();
                return result;
            };

            const oldEquipWeapon = window.equipWeapon;
            window.equipWeapon = function (id) {
                const result = oldEquipWeapon.apply(this, arguments);
                if (antiTrap && intrap) ensureCorrectWeapon();
                return result;
            };
        } else {
            setTimeout(hookEquipFunctions, 100);
        }
    }
    hookEquipFunctions();

    setInterval(() => {
        if (!antiTrap || !intrap) return;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        let oppositeAngle = trapAngle + Math.PI;
        place(spikeType, oppositeAngle);
        ensureCorrectWeapon();

        doNewSend(["D", [trapAngle]]);
        doNewSend(["c", [0, 40, 0]]);
        doNewSend(["F", [1, trapAngle]]);
        setTimeout(() => doNewSend(["F", [0, trapAngle]]), 12);
    }, 250);

    // Create menu on load
    setTimeout(() => {
        if (document.getElementById('nurbo-mod-menu-btn')) return;

        createMenu();

        menuBtn = document.createElement('button');
        menuBtn.id = 'nurbo-mod-menu-btn';
        menuBtn.textContent = '⚙️';
        menuBtn.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.4);
            color: #00ff00;
            border: 1px solid #00ff00;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            z-index: 9998;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        `;
        menuBtn.onmouseover = () => {
            menuBtn.style.background = 'rgba(0, 80, 0, 0.9)';
        };
        menuBtn.onmouseout = () => {
            menuBtn.style.background = menuOpen ? 'rgba(100, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        };
        menuBtn.onclick = () => toggleMenu();
        document.body.appendChild(menuBtn);
    }, 1500);
})();

// Остальные части скрипта (WeaponReloadPrediction, HealBarsBuildings, AutoVerifity, AutoReloadWeb) остаются без изменений
//WeaponReloadPrediction
(function () {
	"use strict";

	let ws;
	const msgpack = window.msgpack;

	WebSocket.prototype._send = WebSocket.prototype.send;
	WebSocket.prototype.send = function (m) {
		if (!ws) {
			ws = this;
			window.ws = this;
		}
		this._send(m);
	};

	function modifyCanvasRenderingContext2D() {
		if (CanvasRenderingContext2D.prototype.roundRect) {
			CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) {
				this.beginPath();
				this.rect(x, y, w, h);
				this.closePath();
				return this;
			};
		}
	}

	if (window.jQuery) {
		$(document).ready(modifyCanvasRenderingContext2D);
	} else {
		window.addEventListener("load", modifyCanvasRenderingContext2D);
	}

	window.Cow.setCodec(msgpack);

	window.Cow.addRender("global", () => {
		const ctx = window.Cow.renderer.context;

		const hbWidth = window.config?.healthBarWidth ?? 50;
		const hbPad = window.config?.healthBarPad ?? 5;
		const nameY = window.config?.nameY ?? 0;

		const width = hbWidth / 2 - hbPad / 2;
		const height = 14;

		window.Cow.playersManager.eachVisible(player => {
			if (!player || !player.alive) return;

			const yOffset = player.renderY + player.scale + nameY - 5;

			const primaryReload = player.reloads?.primary
				? Math.min(player.reloads.primary.count / player.reloads.primary.max, 1)
				: 0;

			const secondaryReload = player.reloads?.secondary
				? Math.min(player.reloads.secondary.count / player.reloads.secondary.max, 1)
				: 0;

			const barColor = player.isAlly ? "#8ecc51" : "#cc5151";

			ctx.save();

			ctx.fillStyle = "#3d3f42";
			ctx.fillRect(
				player.renderX - width * 1.19 - width - hbPad,
				yOffset - height / 2,
				2 * width + 2 * hbPad,
				height
			);

			ctx.fillStyle = barColor;
			ctx.fillRect(
				player.renderX - width * 1.19 - width,
				yOffset - height / 2 + hbPad,
				2 * width * primaryReload,
				height - 2 * hbPad
			);

			ctx.fillStyle = "#3d3f42";
			ctx.fillRect(
				player.renderX + width * 1.19 - width - hbPad,
				yOffset - height / 2,
				2 * width + 2 * hbPad,
				height
			);

			ctx.fillStyle = barColor;
			ctx.fillRect(
				player.renderX + width * 1.19 - width,
				yOffset - height / 2 + hbPad,
				2 * width * secondaryReload,
				height - 2 * hbPad
			);

			ctx.restore();
		});
	});
})();

//HealBarsBuildings
(function () {
	"use strict";

	function init() {
		if (!window.Cow) {
			setTimeout(init, 100);
			return;
		}

		const Cow = window.Cow;

		function drawHP(ctx, o) {
			const max = o.maxHealth || o.maxHP || 100;
			const cur = o.health || o.hp || max;
			if (cur >= max) return;

			const hp = cur / max;
			const r = 20;
			const w = 8;
			const a = hp * Math.PI * 2;

			ctx.save();
			ctx.translate(o.renderX || o.x, o.renderY || o.y);

			ctx.strokeStyle = "#2b0000";
			ctx.lineWidth = w;
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.stroke();

			let hpColor;
			if (hp > 0.6) hpColor = "#00aa00";
			else if (hp > 0.3) hpColor = "#ffaa00";
			else hpColor = "#ff0000";

			ctx.strokeStyle = hpColor;
			ctx.lineWidth = w - 2;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, a);
			ctx.stroke();

			if (hp < 0.3) {
				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 10px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(Math.round(hp * 100) + "%", 0, 0);
			}

			ctx.restore();
		}

		function render() {
			if (!Cow.player) return;
			const ctx = Cow.renderer.context;

			Cow.objectsManager.eachVisible((o) => {
				if (
					(o.health == null && o.hp == null) ||
					(o.maxHealth == null && o.maxHP == null)
				) return;

				const isEnemy = o.ownerId && o.ownerId !== Cow.player.id;
				if (isEnemy || (o.health || o.hp) < (o.maxHealth || o.maxHP)) {
					drawHP(ctx, o);
				}
			});
		}

		if (Cow.addRender) {
			Cow.addRender("hp-circle-red", render);
		} else {
			(function loop() {
				render();
				requestAnimationFrame(loop);
			})();
		}
	}

	if (document.readyState === "complete") init();
	else window.addEventListener("load", init);
})();

//AutoVerifity
(function () {
    'use strict';

    let ws = null;
    let { msgpack } = window;
    let playerID = null;
    let myPlayer = {
        id: null, x: null, y: null, dir: null, object: null, weapon: null,
        clan: null, isLeader: null, maxXP: 300, XP: 0, age: 1,
        hat: null, accessory: null, isSkull: null, maxHealth: 100,
        health: 100
    };
    let players = [], enemy = [], nearestEnemy = {};
    let gameCanvas = document.getElementById("gameCanvas");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX, mouseY;

    const sendPacket = (packet, ...data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(new Uint8Array(msgpack.encode([packet, data])));
        }
    };

    const updatePlayers = data => {
        players = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            const playerInfo = data[1].slice(i * 13, i * 13 + 13);
            if (playerInfo[0] === myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else {
                players.push({
                    id: playerInfo[0],
                    x: playerInfo[1],
                    y: playerInfo[2],
                    dir: playerInfo[3],
                    object: playerInfo[4],
                    weapon: playerInfo[5],
                    clan: playerInfo[7],
                    isLeader: playerInfo[8],
                    hat: playerInfo[9],
                    accessory: playerInfo[10]
                });
            }
        }
    };

    const updateHealth = (health, playerIDCheck) => {
        if (myPlayer.id === playerIDCheck) {
            myPlayer.health = health;
        }
    };

    const handleMessage = (message) => {
        const decoded = msgpack.decode(new Uint8Array(message.data));
        const data = Array.isArray(decoded) && decoded.length > 1 ? [decoded[0], ...decoded[1]] : decoded;
        if (!data) return;
        const type = data[0];
        if (type === "C" && myPlayer.id == null) {
            myPlayer.id = data[1];
            console.log("[Nurbo Mod] Player ID:", myPlayer.id);
        }
        if (type === "a") updatePlayers(data);
        if (type === "O") updateHealth(data[2], data[1]);
    };

    const socketFound = (sock) => {
        sock.addEventListener("message", handleMessage);
        if (gameCanvas) {
            gameCanvas.addEventListener("mousemove", ({ x, y }) => {
                mouseX = x;
                mouseY = y;
            });
        }
        window.addEventListener("resize", () => {
            width = window.innerWidth;
            height = window.innerHeight;
        });
    };

    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (m) {
        if (!ws) {
            ws = this;
            document.websocket = this;
            socketFound(this);
            console.log("[Nurbo Mod] WebSocket intercepted");
        }
        this.oldSend(m);
    };

    const altchaCheck = setInterval(() => {
        let altcha = document.getElementById('altcha');
        let altchaBox = document.getElementById('altcha_checkbox');

        if (altcha && altchaBox) {
            altcha.style.display = 'none';
            altcha.style.opacity = '0';
            altcha.style.pointerEvents = 'none';
            altchaBox.checked = true;

            altchaBox.dispatchEvent(new Event('change', { bubbles: true }));
            altchaBox.dispatchEvent(new Event('click', { bubbles: true }));

            setTimeout(() => {
                if (!altchaBox.checked) {
                    altchaBox.checked = true;
                    altchaBox.click();
                }
            }, 500);

            clearInterval(altchaCheck);
            console.log("[Nurbo Mod] Altcha solved automatically");
        }

        const captchaElements = document.querySelectorAll('[class*="captcha"], [id*="Captcha"], [class*="verif"]');
        captchaElements.forEach(el => {
            if (el && el.style) {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            }
        });
    }, 300);

    const originalAlert = window.alert;
    window.alert = function(message) {
        console.log("[Nurbo Mod] Alert blocked:", message);
        if (typeof message === 'string' && (
            message.toLowerCase().includes('verify') ||
            message.toLowerCase().includes('captcha') ||
            message.toLowerCase().includes('robot') ||
            message.toLowerCase().includes('human')
        )) {
            return;
        }
        return originalAlert.apply(this, arguments);
    };
})();

//AutoReloadWeb
(function() {
    "use strict";

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function refreshPage() {
        console.log("[Nurbo Mod] Auto-reloading page...");
        await delay(1200);
        window.onbeforeunload = null;
        location.reload();
    }

    function interceptProperty(target, propName, onSetCallback) {
        const hiddenKey = Symbol(propName);
        Object.defineProperty(target, propName, {
            get() {
                return this[hiddenKey];
            },
            set(value) {
                onSetCallback(this, hiddenKey, value);
            },
            configurable: true
        });
    }

    function wrapFunction(originalFunc, wrapper) {
        return new Proxy(originalFunc, {
            apply(target, thisArg, args) {
                return wrapper.call(thisArg, target, args);
            }
        });
    }

    interceptProperty(Object.prototype, "errorCallback", (obj, key, val) => {
        obj[key] = val;
        if (typeof val !== "function") return;
        obj[key] = wrapFunction(val, (target, args) => {
            console.log("[Nurbo Mod] errorCallback triggered, auto-reloading");
            window.alert = () => {};
            refreshPage();
            return target.apply(this, args);
        });
    });

    ["onclose", "onerror"].forEach(eventName => {
        const descriptor = Object.getOwnPropertyDescriptor(WebSocket.prototype, eventName);
        if (!descriptor || !descriptor.set) return;

        Object.defineProperty(WebSocket.prototype, eventName, {
            set(handler) {
                const wrappedHandler = wrapFunction(handler, (target, args) => {
                    console.log(`[Nurbo Mod] WebSocket ${eventName} triggered, auto-reloading`);
                    refreshPage();
                    return target.apply(this, args);
                });
                descriptor.set.call(this, wrappedHandler);
            },
            configurable: true
        });
    });

    window.addEventListener('error', function(e) {
        if (e.message && (
            e.message.includes('WebSocket') ||
            e.message.includes('connection') ||
            e.message.includes('network')
        )) {
            console.log("[Nurbo Mod] Page error detected, auto-reloading");
            setTimeout(refreshPage, 1000);
        }
    });

    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason && typeof e.reason === 'string' && (
            e.reason.includes('WebSocket') ||
            e.reason.includes('network')
        )) {
            console.log("[Nurbo Mod] Unhandled promise rejection, auto-reloading");
            setTimeout(refreshPage, 1000);
        }
    });

    setInterval(() => {
        if (document.websocket && document.websocket.readyState !== WebSocket.OPEN) {
            console.log("[Nurbo Mod] WebSocket not open, checking...");
            setTimeout(() => {
                if (document.websocket && document.websocket.readyState !== WebSocket.OPEN) {
                    console.log("[Nurbo Mod] WebSocket still closed, reloading");
                    refreshPage();
                }
            }, 2000);
        }
    }, 10000);

})();
let multiboxAlts = [];
const mousePosition = {x: 0, y: 0};

const upgradeOptions = {};

let placingSpikes = false;
let placingTraps = false;
let repellingAlts = false;
let automill = false;

const updateAltsCounter = () => {
    document.getElementById('altsCounter').innerText = String(multiboxAlts.length);
};

class PowSolver {
    constructor() {
        console.log('PowSolver initialized');
    };

    createToken(json, solution) {
        return 'alt:' + btoa(JSON.stringify({
            algorithm: "SHA-256",
            challenge: json.challenge,
            number: solution,
            salt: json.salt,
            signature: json.signature || null,
            took: 15439
        }));
    };

    async getCaptcha() {
        const resp = await fetch('https://api.moomoo.io/verify');
        const json = await resp.json();
        return json;
    };

    async hash(string) {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(string));
        return new Uint8Array(hash).toHex();
    };

    async solveCaptcha(json) {
        for (let i = 0; i < json.maxnumber; i++) {
            if (await this.hash(json.salt + i) == json.challenge) {
                return i;
            };
        };
    };

    async generateAltchaToken() {
        const json = await this.getCaptcha();
        const solution = await this.solveCaptcha(json);
        return this.createToken(json, solution);
    };
};

class Input {
    constructor(ws) {
        this.msgpack = msgpack;
        this.ws = ws;
    };

    sendMsg(data) {
        this.ws.send(this.msgpack.encode(data));
    };

    sendChatMessage(message) {
        this.sendMsg(['6', [message]]);
    };

    useItem(id) {
        this.sendMsg(['z', [id, null]]);
        this.sendMsg(['F', [1, null]]);
        this.sendMsg(['F', [0, null]]);
        this.sendMsg(['z', [document.ws.player.entity.weapon, true]]);
    };

    healPlayer(currentHealth) {
        let timeout = 115;
        if (currentHealth <= 60) {
            timeout = 1;
        };
        setTimeout(() => {
            this.useItem(0);
            this.useItem(1);
        }, timeout);
    };

    moveTowardsDirection(angle) {
        this.sendMsg(['9', [angle]]);
    };

    sendEnterWorld(name) {
        this.sendMsg(['M', [{
            name: name,
            moofoll: true,
            skin: 0
        }]]);
    };

    joinTribe(name) {
        this.sendMsg(['b', [name]]);
    };
};

class Player {
    constructor(ws) {
        this.ws = ws;
        this.input = new Input(this.ws);
        this.autoheal = true;
        this.entity = {
            id: null,
            health: 100,
            knownPlayers: [],
            position: {
                x: 0,
                y: 0
            },
            aimingYaw: 0,
            object: -1,
            weapon: 0,
            clan: null,
            isLeader: 0,
            hat: 0,
            accessory: 0
        };
        this.fullyUpgraded = true;

        this.ws.addEventListener('message', this.handleMessage.bind(this));
    };

    handleMessage(msg) {
        const data = msgpack.decode(msg.data);

        switch (data[0]) {
            case 'C':
                this.entity.id = data[1][0];
                break;
            case 'O':
                if (data[1][0] == this.entity.id) this.entity.health = data[1][1];
                if (data[1][0] == this.entity.id && this.autoheal && data[1][1] < 100) this.input.healPlayer(this.entity.health);
                break;
            case 'a':
                this.entity.knownPlayers = [];
                var playerInfos = data[1][0];
                for (let j = 0; j < playerInfos.length; j += 13) {
                    const playerInfo = playerInfos.slice(j, j + 13);
                    if (playerInfo[0] == this.entity.id) {
                        this.entity.position.x = playerInfo[1];
                        this.entity.position.y = playerInfo[2];
                        this.entity.aimingYaw = playerInfo[3];
                        this.entity.object = playerInfo[4];
                        this.entity.weapon = playerInfo[5];
                        this.entity.clan = playerInfo[7];
                        this.entity.isLeader = playerInfo[8];
                        this.entity.hat = playerInfo[9];
                        this.entity.accessory = playerInfo[10];
                    } else {
                        this.entity.knownPlayers.push({
                            id: playerInfo[0],
                            position: {
                                x: playerInfo[1],
                                y: playerInfo[2],
                            },
                            aimingYaw: playerInfo[3],
                            object: playerInfo[4],
                            weapon: playerInfo[5],
                            clan: playerInfo[7],
                            isLeader: playerInfo[8],
                            hat: playerInfo[9],
                            accessory: playerInfo[10]
                        });
                    };
                };
                break;
            case 'U':
                this.upgradeAge = ((data[1][0] + data[1][1]) - data[1][0]);
                if (data[1][0] == 0) {
                    this.fullyUpgraded = true;
                } else {
                    this.fullyUpgraded = false;
                };
                break;
        };
    };
};
class Bot {
    constructor(serverUrl) {
        this.powSolver = new PowSolver();
        this.name = 'n agent' + Math.floor(Math.random() * 9000 + 1000);
        this.age = 1;
        this.ws = null;
        this.lastUpgradedAge = 1;
        this.hasAttemptedUpgrade = false;
        this.isUpgrading = false;

        var self = this;

        this.powSolver.generateAltchaToken().then(function(token) {
            self.ws = new WebSocket(document.ws.url.split('?token=')[0] + '?token=' + token);
            self.ws.binaryType = 'arraybuffer';
            self.ws.player = new Player(self.ws);
            self.ws.botInstance = self;

            // Добавляем обработчик сообщений для самого бота
            self.ws.addEventListener('message', function(m) {
                self.handleMessage(m);
            });

            self.ws.addEventListener('close', function() {
                console.log('Bot ' + self.name + ' WebSocket closed');
                // Удаляем из массива
                const index = multiboxAlts.indexOf(self.ws);
                if (index > -1) {
                    multiboxAlts.splice(index, 1);
                    updateAltsCounter();
                }
            });

            self.ws.addEventListener('error', function(error) {
                console.log('Bot ' + self.name + ' WebSocket error:', error);
            });

            // Сообщение в чат каждые 30 секунд
            setInterval(function() {
                if (self.ws && self.ws.readyState === WebSocket.OPEN && self.ws.player) {
                    self.ws.player.input.sendChatMessage('age: ' + self.age);
                }
            }, 30000);

        }).catch(function(error) {
            console.error('Error generating altcha token:', error);
        });
    }

    tryUpgrade(newAge) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.log('Bot ' + this.name + ' WebSocket not ready for upgrade');
            return false;
        }

        // Если уже пытались апгрейдить этот возраст
        if (this.hasAttemptedUpgrade && this.lastUpgradedAge === newAge) {
            console.log('Bot ' + this.name + ' уже пытался апгрейднуть age ' + newAge);
            return false;
        }

        var ageToItemMap = {
            2: 8,   // 2-8
            3: 17,  // 3-17
            4: 31,  // 4-31
            5: 27,  // 5-27
            6: 10,  // 6-10
            7: 33,  // 7-33
            8: 28,  // 8-28
            9: 36   // 9-36
        };

        if (ageToItemMap[newAge]) {
            console.log('Bot ' + this.name + ' пытается апгрейднуть на age ' + newAge + ' -> item ' + ageToItemMap[newAge]);

            this.hasAttemptedUpgrade = true;
            this.lastUpgradedAge = newAge;

            var self = this;

            // Ждем 3 секунды перед апгрейдом
            setTimeout(function() {
                if (self.ws && self.ws.readyState === WebSocket.OPEN) {
                    try {
                        console.log('Отправляю апгрейд для бота ' + self.name + ': age ' + newAge + ' -> item ' + ageToItemMap[newAge]);
                        // Отправляем апгрейд
                        self.ws.player.input.sendMsg(['H', [ageToItemMap[newAge]]]);

                        // После апгрейда ждем и выбираем правильное оружие
                        setTimeout(() => {
                            if (self.ws && self.ws.readyState === WebSocket.OPEN) {
                                // Выбираем основное оружие (item 0 - меч)
                                self.ws.player.input.sendMsg(['z', [0, true]]);
                            }
                        }, 1000);
                    } catch (error) {
                        console.log('Ошибка при апгрейде бота ' + self.name + ':', error);
                    }
                }
            }, 3000);

            return true;
        }

        console.log('Bot ' + this.name + ' нет предмета для age ' + newAge);
        return false;
    }

    handleMessage(msg) {
        var data = msgpack.decode(new Uint8Array(msg.data));
        var self = this;

        switch (data[0]) {
            case 'io-init':
                multiboxAlts.push(this.ws);
                this.ws.player.input.sendEnterWorld(this.name);

                setInterval(function() {
                    if (self.ws && self.ws.readyState === WebSocket.OPEN) {
                        self.ws.player.input.sendEnterWorld(self.name);
                        self.ws.player.input.joinTribe(document.ws.player.entity.clan);
                    }
                }, 1000);

                updateAltsCounter();
                console.log('Bot created: ' + this.name + ', total: ' + multiboxAlts.length);
                break;

            case 'a':
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) break;

                var mouseXWorld = (document.ws.player.entity.position.x - this.ws.player.entity.position.x) + (mousePosition.x - (window.innerWidth / 2)) * (1+(1/3));
                var mouseYWorld = (document.ws.player.entity.position.y - this.ws.player.entity.position.y) + (mousePosition.y - (window.innerHeight / 2)) * (1+(1/3));
                var dirToMove = Math.atan2(mouseYWorld, mouseXWorld);
                this.ws.player.input.sendMsg(['D', [dirToMove]]);
                if (repellingAlts) {
                    this.ws.player.input.moveTowardsDirection(dirToMove - 2.35619);
                } else {
                    this.ws.player.input.moveTowardsDirection(dirToMove);
                }
                break;

            case 'U':
                var newAge = (data[1][0] + data[1][1]) - 1;
                console.log('Bot ' + this.name + ' возраст: ' + this.age + ' -> ' + newAge);

                if (newAge > this.age) {
                    this.age = newAge;

                    // Апгрейдим ТОЛЬКО если это новый уровень И если этот уровень нужно апгрейдить (2-9)
                    if (this.age >= 2 && this.age <= 9) {
                        this.tryUpgrade(this.age);
                    }
                }
                break;
        }
    }
}
const init = () => {
    document.getElementById('promoImgHolder').remove();
    for (let i = 0; i < document.getElementsByClassName('adsbygoogle').length; i++) {
        document.getElementsByClassName('adsbygoogle')[0].remove();
    };
    document.getElementById('gameName').innerText = 'Hypbo mod'
    document.getElementById('gameName').style = 'color: white; font-family:monospace';

    document.getElementById('diedText').innerText = 'You Died';
    document.getElementById('diedText').style = 'color: #f00; background-color: #444;';

    const altCounter = document.createElement('h2');
    altCounter.style = 'text-align: center;color:#444; font-size: 10px; position: fixed; top: 5px; left: 50%; transform: translateX(-50%);';
    altCounter.innerHTML = 'alts: <span id="altsCounter">0</span>';
    document.getElementById('gameUI').appendChild(altCounter);

    document.getElementById('touch-controls-fullscreen').addEventListener('mousemove', (e) => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    });

    const originalWebSocket = WebSocket;

    const wsInterceptor = {
        construct(target, args) {
            const ws = new originalWebSocket(...args);
            document.ws = ws;
            console.log('captured ws');
            window.WebSocket = originalWebSocket;

            document.ws.player = new Player(document.ws);
           window.addEventListener('keyup', (e) => {
    if (e.target.tagName === 'INPUT') {
        return;
    };

    if (e.key === 'l') {
        new Bot('n agent-' + Math.floor(Math.random() * 9000 + 1000));
    };

    if (e.key === ',') {
        multiboxAlts.forEach((sock) => {
            if (sock) sock.close();
        });
        multiboxAlts = [];
        updateAltsCounter();
    };

    if (e.key === 'm') {
        automill = !automill;
        multiboxAlts.forEach((sock) => {
            if (sock && sock.player) {
                sock.player.autoMillEnabled = automill;
                sock.player.copyPlayerAction('autoMill');
            }
        });
        console.log('Все боты: авто-мельницы ' + (automill ? 'ON' : 'OFF'));
    };

    if (e.key === 't') {
        multiboxAlts.forEach((sock) => {
            if (sock && sock.readyState === WebSocket.OPEN && sock.player) {
                sock.player.copyPlayerAction('attack');
            }
        });
        console.log('Все боты атакуют!');
    }
});
            setInterval(() => {
                if (automill) {
                    if (upgradeOptions[5] == 27) {
                        if (upgradeOptions[8] == 28) {
                            document.ws.player.input.useItem(12);
                        } else {
                            document.ws.player.input.useItem(11);
                        };
                    } else {
                        document.ws.player.input.useItem(10);
                    };
                };
            }, 50);

       let originalSend = document.ws.send.bind(document.ws);
document.ws.send = (msg) => {
    var decoded = msgpack.decode(msg);

    // Сохраняем информацию о выбранных предметах для главного игрока
    if (decoded[0] === 'H') {
        upgradeOptions[document.ws.player.upgradeAge] = decoded[1][0];
    }

    // Пересылаем ботам только определенные сообщения, которые безопасны:
    const allowedForBots = [
        '9',  // Движение
        'F',  // Атака
        'D',  // Направление
        '0',  // Общие действия
        'e'   // Другие действия
    ];

    // Обрабатываем команду 'z' - только использование предметов, НЕ выбор оружия
    let shouldSendToBots = allowedForBots.includes(decoded[0]);

    if (decoded[0] === 'z') {
        // 'z' команда имеет формат: ['z', [id, equip]]
        // equip === true - выбор оружия/предмета (НЕ пересылать ботам)
        // equip === null - использование предмета (можно пересылать)
        // equip === false - снятие предмета (НЕ пересылать)

        if (decoded[1] && decoded[1][1] === null) {
            // Это использование предмета (яблоко, печенька и т.д.)
            shouldSendToBots = true;
        } else {
            // Это выбор оружия или снятие предмета - НЕ пересылать
            shouldSendToBots = false;
        }
    }

    if (shouldSendToBots) {
        multiboxAlts.forEach((sock, index) => {
            if (sock && sock.readyState === WebSocket.OPEN) {
                try {
                    // Добавляем небольшую задержку для стабильности
                    setTimeout(() => {
                        if (sock && sock.readyState === WebSocket.OPEN) {
                            sock.send(msg);
                        }
                    }, index * 5);
                } catch (e) {
                    console.log('Ошибка при отправке сообщения боту:', e);
                }
            }
        });
    }

    // НИКОГДА не пересылаем эти команды ботам:
    const blockedForBots = [
        'M',  // Вход в мир (у ботов свои имена)
        'b',  // Присоединение к клану
        'c',  // Выбор предметов/шляп/аксессуаров
        'H'   // Апгрейды
    ];

    if (blockedForBots.includes(decoded[0])) {
        // Не пересылаем эти команды ботам
        console.log('Blocked for bots:', decoded[0]);
    }

    console.log('Main player:', decoded[0], decoded[1]);
    originalSend(msg);
};
            return ws;
        }
    };

    window.WebSocket = new Proxy(originalWebSocket, wsInterceptor);
};

let waitForGameName = setInterval(() => {
    if (document.getElementById('gameName')) {
        clearInterval(waitForGameName);
        return init();
    };
}, 100);