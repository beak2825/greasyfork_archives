// ==UserScript==
// @name         n-Hypbo client 
// @namespace    http://youtube.com
// @version      1.6.0.1
// @description  Shift=Insta,  Traps/Spikes. AutoBiomhat Autoheal esc = Menu F,V,C,B  = Trap Sike 4Spike 4Traps .
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
// @downloadURL https://update.greasyfork.org/scripts/560817/n-Hypbo%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/560817/n-Hypbo%20client.meta.js
// ==/UserScript==

//Utility

(function () {

    'use strict';
// СВОЙ ЧАТ СИСТЕМА
let customChatOpen = false;
let customChatInput = null;
let customChatContainer = null;

function createCustomChat() {
    // Контейнер для чата
    customChatContainer = document.createElement('div');
    customChatContainer.id = 'custom-chat-container';
    customChatContainer.style.cssText = `
        position: fixed;
        bottom: 200px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.2);
        border: 1.5px solid #ff0000;
        border-radius: 10px;
        padding: 10px;
        z-index: 10000;
        display: none;
        min-width: 300px;

    `;

    // Поле ввода
    customChatInput = document.createElement('input');
    customChatInput.id = 'custom-chat-input';
    customChatInput.type = 'text';
    customChatInput.placeholder = 'Type message...';
    customChatInput.style.cssText = `
        width: 250px;
        padding: 8px;
        background: #111;
        color: white;
        border: 1px solid #ff0000;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        outline: none;
    `;

    customChatContainer.appendChild(customChatInput);
    document.body.appendChild(customChatContainer);
}

function toggleCustomChat() {
    customChatOpen = !customChatOpen;

    if (customChatOpen) {
        customChatContainer.style.display = 'block';
        customChatInput.focus();
        customChatInput.value = ''; // Очищаем поле
    } else {
        customChatContainer.style.display = 'none';
        customChatInput.blur();

        // Отправляем сообщение если есть текст
        const message = customChatInput.value.trim();
        if (message) {
            sendChatMessage(message);
        }
    }
}

function sendChatMessage(message) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // Отправляем сообщение через WebSocket
    const data = msgpack5.encode(["6", [message]]);
    ws.send(new Uint8Array(Array.from(data)));

    // Также показываем в консоли для отладки
    console.log('Chat sent:', message);
}

// Добавляем обработчик Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Если открыт наш чат
        if (customChatOpen) {
            toggleCustomChat(); // Закрываем и отправляем
        }
        // Если в игре и не в другом поле ввода
        else if (myPlayer.id && !document.activeElement.tagName.match(/INPUT|TEXTAREA/i)) {
            toggleCustomChat(); // Открываем наш чат
            e.preventDefault(); // Блокируем стандартный чат
        }
    }

    // Esc закрывает чат
    if (e.key === 'Escape' && customChatOpen) {
        toggleCustomChat();
        e.preventDefault();
    }
});

// Закрываем чат при клике вне его
document.addEventListener('click', (e) => {
    if (customChatOpen && customChatContainer &&
        !customChatContainer.contains(e.target) &&
        e.target !== customChatInput) {
        toggleCustomChat();
    }
});

// Инициализация при загрузке
window.addEventListener('load', () => {
    createCustomChat();
    console.log('Custom chat system loaded');
});
    let ws;
    const msgpack5 = window.msgpack;

    let myPlayer = {
        id: null,
        weapon: null,
        x: null,
        y: null,
        dir: null
    };
// Добавь после переменных, перед функциями:
let boostType, windmillType, turretType = null;
let antiTrap = false;
let walkmillhaha = false;
let gInterval = null;
let nearestEnemyAngle = 0;
const placementIntervals = {};

// Функция place (общая)
function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    if (id == null) return;
    doNewSend(["z", [id, null]]);
    doNewSend(["F", [1, angle]]);
    doNewSend(["F", [0, angle]]);
    doNewSend(["z", [myPlayer.weapon, true]]);
}

// 4 шипа вокруг (вверх, право, низ, лево)
function placeFourSpikesUp() {
    const firstAngle = -Math.PI / 2; // Вверх
    place(spikeType, firstAngle);
    place(spikeType, firstAngle + Math.PI / 2);
    place(spikeType, firstAngle + Math.PI);
    place(spikeType, firstAngle + 3 * Math.PI / 2);
}

// 4 ловушки/буста вокруг
function performBPlacement() {
    const base = myPlayer.dir || Math.atan2(mouseY - height / 2, mouseX - width / 2);
    place(boostType, base);
    place(boostType, base + Math.PI / 2);
    place(boostType, base - Math.PI / 2);
    place(boostType, base + Math.PI);
}

// Реверс инста
function performReverseInsta() {
    if (!nearestEnemy) return;

    const dx = myPlayer.x - nearestEnemy[1];
    const dy = myPlayer.y - nearestEnemy[2];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 250) {
        sendChatMessage("Враг слишком далеко для Reverse Insta");
        return;
    }

    storeEquip(0, 1);
    setTimeout(() => {
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

// Начать размещение структуры
function startPlacingStructure(key, itemId) {
    if (!placementIntervals[key]) placementIntervals[key] = setInterval(() => place(itemId), 50);
}

// Остановить размещение
function stopPlacingStructure(key) {
    clearInterval(placementIntervals[key]);
    delete placementIntervals[key];
}

// Также добавь обработку keyup для остановки размещения
document.addEventListener("keyup", e => {
    const k = e.key.toLowerCase();
    stopPlacingStructure(k);

    
});

// Обнови функцию updateItems чтобы находить boostType, windmillType, turretType
function updateItems() {
    for (let i = 22; i < 26; i++) {
        if (isVisible(document.getElementById("actionBarItem" + i))) {
            spikeType = i - 16;
            break;
        }
    }

    // Находим boostType (бусты)
    for (let i = 31; i < 33; i++) {
        if (isVisible(document.getElementById("actionBarItem" + i))) {
            boostType = i - 16;
        }
    }

    // Находим windmillType (мельницы)
    for (let i = 26; i <= 28; i++) {
        if (isVisible(document.getElementById("actionBarItem" + i))) {
            windmillType = i - 16;
        }
    }

    // Находим turretType (турели)
    for (let i = 33; i <= 38; i++) {
        if (i !== 36 && isVisible(document.getElementById("actionBarItem" + i))) {
            turretType = i - 16;
        }
    }
}
setInterval(updateItems, 250);

// Обнови handleMessage чтобы вычислять nearestEnemyAngle
function handleMessage(m) {
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data = (temp.length > 1) ? [temp[0], ...temp[1]] : temp;
    if (!data) return;

    if (data[0] === "C" && myPlayer.id == null) myPlayer.id = data[1];

    if (data[0] === "a") {
        let enemiesNear = [];
        for (let i = 0; i < data[1].length / 13; i++) {
            let obj = data[1].slice(13 * i, 13 * i + 13);
            if (obj[0] === myPlayer.id) {
                [myPlayer.x, myPlayer.y, myPlayer.dir, myPlayer.object, myPlayer.weapon] =
                    [obj[1], obj[2], obj[3], obj[4], obj[5]];
            } else {
                enemiesNear.push(obj);
            }
        }

        if (enemiesNear.length > 0) {
            enemiesNear.sort((a, b) => {
                const distA = Math.hypot(a[1] - myPlayer.x, a[2] - myPlayer.y);
                const distB = Math.hypot(b[1] - myPlayer.x, b[2] - myPlayer.y);
                return distA - distB;
            });

            nearestEnemy = enemiesNear[0];

            // Вычисляем угол к ближайшему врагу
            if (nearestEnemy) {
                nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
            }

            // Автоматически активируем автоспайк при появлении врага
            if (autoSpikeEnabled && nearestEnemy) {
                performSpikeSurround();
            }
        } else {
            nearestEnemy = null;
        }
    }
}
    let nearestEnemy = null;
    let width, height, mouseX, mouseY;
    let spikeType = null;

    // Fast Break variables
    let rightClickAttackInterval = null;
    let rightClickHeld = false;

    // Auto Attack variables
    let autoAttackInterval = null;
    let autoAttackEnabled = false;

    // Auto Spike variables
    let autoSpikeEnabled = false;
    let spikeSurroundDistance = 50; // 50 пикселей

    // Kill Chat
    let prevKillCount = 0;
    let killChatEnabled = true;

    // Menu
    let menuOpen = false;
    let menuElement = null;
    let menuBtn = null;
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

 

    function storeEquip(id, index) {
        doNewSend(["c", [0, id, index]]);
    }

    function isVisible(el) {
        return el && el.offsetParent !== null;
    }

    function getSecondaryWeaponIndex() {
        for (let i = 9; i <= 15; i++) {
            if (isVisible(document.getElementById("actionBarItem" + i)) && i !== myPlayer.weapon) {
                return i;
            }
        }
        return myPlayer.weapon;
    }

    // Update spike type
   
    setInterval(updateItems, 250);

    // Функция для размещения шипа
    function placeSpike(angle) {
        if (spikeType == null) return;
        doNewSend(["z", [spikeType, null]]);
        doNewSend(["F", [1, angle]]);
        doNewSend(["F", [0, angle]]);
        doNewSend(["z", [myPlayer.weapon, true]]);
    }

    // ОСНОВНАЯ ФУНКЦИЯ INSTA
    function performNormalInsta(useSecondary = true) {
        // Определяем угол атаки
        let attackAngle;
        if (nearestEnemy) {
            const dx = myPlayer.x - nearestEnemy[1];
            const dy = myPlayer.y - nearestEnemy[2];
            attackAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
        } else {
            attackAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
        }

        storeEquip(0, 1);
        setTimeout(() => {
            doNewSend(["D", [attackAngle]]);

            const primary = myPlayer.weapon;
            const secondary = getSecondaryWeaponIndex();

            // Используем основное оружие
            doNewSend(["c", [0, 7, 0]]);
            doNewSend(["z", [primary, true]]);
            doNewSend(["F", [1, attackAngle]]);
            setTimeout(() => doNewSend(["F", [0, attackAngle]]), 25);

            setTimeout(() => {
                if (useSecondary) {
                    // Используем второе оружие
                    doNewSend(["c", [0, 53, 0]]);
                    doNewSend(["z", [secondary, true]]);
                    doNewSend(["F", [1, attackAngle]]);
                    setTimeout(() => doNewSend(["F", [0, attackAngle]]), 25);
                }

                setTimeout(() => {
                    // Возвращаем основное оружие
                    doNewSend(["c", [0, 6, 0]]);
                    doNewSend(["z", [primary, true]]);
                    doNewSend(["z", [primary, true]]);

                    // Одеваем samurai helmet (20) после инсты
                    setTimeout(() => {

                        storeEquip(12, 0); // samurai helmet
                    }, 170);
                }, useSecondary ? 120 : 0);
            }, useSecondary ? 120 : 0);
        }, 120);
    }

    // ФУНКЦИЯ АВТОАТАКИ
    function toggleAutoAttack() {
        autoAttackEnabled = !autoAttackEnabled;

        if (autoAttackEnabled) {
            startAutoAttack();

        } else {
            stopAutoAttack();

        }
    }

    function startAutoAttack() {
        if (autoAttackInterval) return;

        autoAttackInterval = setInterval(() => {
            // Всегда атакуем в сторону мыши
            const attackAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2);

            // Устанавливаем направление и атакуем
            doNewSend(["D", [attackAngle]]);
            doNewSend(["F", [1, attackAngle]]);
            setTimeout(() => doNewSend(["F", [0, attackAngle]]), 20);

        }, 300); // 100ms = 10 атак в секунду
    }

    function stopAutoAttack() {
        if (autoAttackInterval) {
            clearInterval(autoAttackInterval);
            autoAttackInterval = null;
        }
    }

    // ФУНКЦИЯ АВТОСПАЙКА (4 шипа вокруг врага)
    function toggleAutoSpike() {
        autoSpikeEnabled = !autoSpikeEnabled;

        if (autoSpikeEnabled) {
            sendChatMessage("AS hehe");
        } else {
            sendChatMessage("As off");
        }
        updateMenu();
    }

    // Функция для быстрой установки 4 шипов вокруг врага
    function performSpikeSurround() {
        if (!autoSpikeEnabled || !nearestEnemy || spikeType == null) return;

        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= spikeSurroundDistance) {
            const enemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);

            // Мгновенно ставим 4 шипа вокруг врага
            placeSpike(enemyAngle); // Спереди
            placeSpike(enemyAngle + Math.PI / 2); // Справа
            placeSpike(enemyAngle + Math.PI); // Сзади
            placeSpike(enemyAngle - Math.PI / 2); // Слева
        }
    }

    // KILL CHAT
    function initKillChat() {
        const killCounter = document.getElementById("killCounter");
        if (!killCounter) {
            setTimeout(initKillChat, 500);
            return;
        }

        const observer = new MutationObserver(() => {
            if (!killChatEnabled) return;

            const count = parseInt(killCounter.innerText, 10) || 0;
            if (count > prevKillCount) {
                prevKillCount = count;
                sendChatMessage("Nurbo mod gg");
                setTimeout(() => {
                    sendChatMessage("");
                }, 1000);
            }
        });

        observer.observe(killCounter, { childList: true, characterData: true, subtree: true });
    }

    // FAST BREAK функции
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

    // Обработчик сообщений от сервера
  
    // Перехват WebSocket
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

    // СТИЛИ ДЛЯ ГЛАВНОГО ЭКРАНА
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Стили для меню */
            #insta-mod-menu {
                position: fixed;
                top: 50px;
                left: 10px;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 15px;
                border-radius: 10px;
                border: 2px solid #ff0000;
                z-index: 9999;
                font-family: 'Arial', sans-serif;
                min-width: 250px;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
                display: none;
                backdrop-filter: blur(10px);
            }

            #insta-mod-menu-btn {
                position: fixed;
                top: 0;
                left: 0;
                background: black !important;
                color: white;

                width: 65px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                font-weight: bold;
                transition: all 0.3s;
            }

            #insta-mod-menu-btn:hover {
                background: linear-gradient(135deg, #ff3333, #cc0000);
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
            }

            .menu-title {
                font-size: 18px;
                font-weight: bold;
                color: #ff0000;
                margin-bottom: 15px;
                text-align: center;
                padding-bottom: 8px;
                border-bottom: 2px solid #ff0000;
                text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
            }

            .menu-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 12px 0;
                padding: 10px 12px;
                background: rgba(255, 0, 0, 0.1);
                border-radius: 5px;
                border: 1px solid rgba(255, 0, 0, 0.3);
                transition: all 0.3s;
            }

            .menu-item:hover {
                background: rgba(255, 0, 0, 0.2);
                transform: translateX(5px);
            }

            .menu-item label {
                color: #ffcccc;
                font-size: 14px;
                cursor: pointer;
                font-weight: bold;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #990000;
                transition: .4s;
                border-radius: 24px;
                border: 2px solid #ff0000;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .toggle-slider {
                background-color: #ff0000;
            }

            input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }

            .hotkey-info {
                color: #ff6666;
                font-size: 12px;
                margin-left: 10px;
                font-weight: bold;
            }

            .hotkeys-section {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px solid #ff0000;
            }

            .hotkeys-section h4 {
                color: #ff0000;
                margin-bottom: 10px;
                font-size: 16px;
                text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
            }

            .hotkey-item {
                color: #ffcccc;
                font-size: 13px;
                margin: 8px 0;
                padding: 8px 10px;
                background: rgba(255, 0, 0, 0.1);
                border-radius: 5px;
                border-left: 3px solid #ff0000;
            }

            /* Стили для экрана загрузки */
            #loadingScreen {
                background: linear-gradient(135deg, #000000 0%, #330000 100%) !important;
            }

            #gameName {
                color: #fff000 !important;
                font-size:100px;
                text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 20px #ff0000 !important;
                font-weight: bold !important;
                font-family: 'Arial Black', sans-serif !important;
            }

            /* Улучшение кнопок игры */
            .btn {
                background: linear-gradient(to bottom, #ff0000, #990000) !important;
                border: 2px solid #ff0000 !important;
                color: white !important;
                font-weight: bold !important;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5) !important;
            }

            .btn:hover {
                background: linear-gradient(to bottom, #ff3333, #cc0000) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(255, 0, 0, 0.5) !important;
            }

            /* Стиль для чата */
            #chatbox {
                background: rgba(0, 0, 0, 0.8) !important;
                border: 2px solid #ff0000 !important;
                color: #ffcccc !important;
            }
        `;
        document.head.appendChild(style);
    }

    // МЕНЮ
    function createMenu() {
        if (document.getElementById('insta-mod-menu')) return;

        menuElement = document.createElement('div');
        menuElement.id = 'insta-mod-menu';

        updateMenu();
        document.body.appendChild(menuElement);
    }

    function updateMenu() {
        if (!menuElement) return;

        menuElement.innerHTML = `
            <div class="menu-title">🔥 Nurbo Mod </div>

            <div class="menu-item">
                <label for="autoSpikeToggle">Auto Spike Surround</label>
                <div style="display: flex; align-items: center;">
                    <label class="toggle-switch">
                        <input type="checkbox" id="autoSpikeToggle" ${autoSpikeEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="hotkey-info">] </span>
                </div>
            </div>

            <div class="menu-item">
                <label for="killChatToggle">Kill Chat</label>
                <div style="display: flex; align-items: center;">
                    <label class="toggle-switch">
                        <input type="checkbox" id="killChatToggle" ${killChatEnabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="hotkeys-section">
                <h4>🔥 Hotkeys:</h4>
                <div class="hotkey-item">Shift - Insta Attack</div>
                <div class="hotkey-item">E - Auto Attack Toggle</div>
                <div class="hotkey-item">] - Auto Spike Surround Toggle</div>
                <div class="hotkey-item">= - Samurai Hat</div>
                <div class="hotkey-item">0 - fast walK</div>


                <div class="hotkey-item">Right Click - Fast Break</div>
                <div class="hotkey-item">ESC - Open/Close Menu</div>
            </div>
        `;
   document.getElementById('gameName').textContent='Nurbo mod';
        // Add event listeners for toggles
        const autoSpikeToggle = document.getElementById('autoSpikeToggle');
        const killChatToggle = document.getElementById('killChatToggle');

        if (autoSpikeToggle) {
            autoSpikeToggle.addEventListener('change', () => {
                toggleAutoSpike();
            });
        }

        if (killChatToggle) {
            killChatToggle.addEventListener('change', () => {
                killChatEnabled = !killChatEnabled;
                sendChatMessage(killChatEnabled ? "Kill Chat ON" : "Kill Chat OFF");
            });
        }
    }

    function toggleMenu() {
        menuOpen = !menuOpen;
        if (menuElement) {
            menuElement.style.display = menuOpen ? 'block' : 'none';
        }
        if (menuBtn) {
            menuBtn.textContent = menuOpen ? '✖' : '🔥';
            menuBtn.style.background = menuOpen ? 'linear-gradient(135deg, #990000, #660000)' : 'linear-gradient(135deg, #ff0000, #990000)';
        }
    }

    function createMenuButton() {
        menuBtn = document.createElement('button');
        menuBtn.id = 'insta-mod-menu-btn';
        menuBtn.textContent = '🔥';
        menuBtn.title = 'Insta Mod Menu';
        menuBtn.onclick = () => toggleMenu();
        document.body.appendChild(menuBtn);
    }

    // Обработчики клавиш
   document.addEventListener("keydown", e => {
    if (document.activeElement.id.toLowerCase() === 'chatbox') return;

    if (e.keyCode == 16) { // Shift key
        performNormalInsta(true);
    }

    if (e.key.toLowerCase() === 'e') { // E key
        toggleAutoAttack();
    }

       if (e.key.toLowerCase() === ']') { // S key - Auto Spike
        toggleAutoSpike();
    }
  // Вместо storeEquip попробуйте:
if (e.key.toLowerCase() === '0') {
    doNewSend(["c", [0, 11, 0]]);

}
    if (e.key.toLowerCase() === '=') { // H key

doNewSend(["c", [0,20, 0]]);
    }
        if (e.key.toLowerCase() === 'alt') { // H key
        sendChatMessage("hi fk me Hypbo");

    }

    if (e.key.toLowerCase() === 'v') { // V key - Place Spike
        // Ставим шип в сторону мыши
        const spikeAngle = Math.atan2(mouseY - height / 2, mouseX - width / 2);
        placeSpike(spikeAngle);
    }

    if (e.key.toLowerCase() === 'c') { // C key - Place 4 Spikes Around
        placeFourSpikesUp();
    }

    if (e.key.toLowerCase() === 'b') { // B key - Place 4 Traps
        performBPlacement();
    }

    if (e.key.toLowerCase() === 'f') { // F key - Place Trap/Boost
        startPlacingStructure('f', boostType);
    }

    if (e.key.toLowerCase() === 'n') { // N key - Place Mill
        startPlacingStructure('n', windmillType);
    }

    if (e.key.toLowerCase() === 'g') { // G key - Place Turret
        startPlacingStructure('g', turretType);
    }

 

    

   


  



    if (e.keyCode === 32) { // Space key - Boost+Spike
       
    }

    if (e.keyCode === 27) { // ESC key
        toggleMenu();
    }
});

    // FAST BREAK: обработка правой кнопки мыши
    document.addEventListener("mousedown", function (e) {
        if (e.button === 2 && !rightClickHeld) {
            rightClickHeld = true;
            doNewSend(["c", [0, 40, 0]]);

            setTimeout(() => {
                if (rightClickHeld) {
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

    // Предотвращаем контекстное меню при правом клике
    document.addEventListener("contextmenu", function (e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    });

    // Инициализация
    window.addEventListener('load', () => {
        addStyles();
        createMenu();
        createMenuButton();
        initKillChat();

        // Auto update items
        setInterval(updateItems, 250);

        console.log('Insta Mod loaded successfully!');
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
				ctx.font = "bold 18x Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

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

(function() {
    var __webpack_exports__, code, Navbar_code, Keybinds_code, Combat_code, Visuals_code, Misc_code, Devtool_code, Credits_code, __webpack_require__ = {};
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) {
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key]
                    });
                }
            }
        };
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    __webpack_exports__ = {};
    __webpack_require__.d(__webpack_exports__, {
        ZI: () => connection,
        mq: () => myClient
    });
    const Config_Config = {
        maxScreenWidth: 1920,
        maxScreenHeight: 1080,
        serverUpdateRate: 9,
        collisionDepth: 6,
        minimapRate: 3e3,
        colGrid: 10,
        clientSendRate: 5,
        barWidth: 50,
        barHeight: 17,
        barPad: 4.5,
        iconPadding: 15,
        iconPad: .9,
        deathFadeout: 3e3,
        crownIconScale: 60,
        crownPad: 35,
        chatCountdown: 3e3,
        chatCooldown: 500,
        maxAge: 100,
        gatherAngle: Math.PI / 2.6,
        gatherWiggle: 10,
        hitReturnRatio: .25,
        hitAngle: Math.PI / 2,
        playerScale: 35,
        playerSpeed: .0016,
        playerDecel: .993,
        nameY: 34,
        animalCount: 7,
        aiTurnRandom: .06,
        shieldAngle: Math.PI / 3,
        resourceTypes: [ "wood", "food", "stone", "points" ],
        areaCount: 7,
        treesPerArea: 9,
        bushesPerArea: 3,
        totalRocks: 32,
        goldOres: 7,
        riverWidth: 724,
        riverPadding: 114,
        waterCurrent: .0011,
        waveSpeed: 1e-4,
        waveMax: 1.3,
        treeScales: [ 150, 160, 165, 175 ],
        bushScales: [ 80, 85, 95 ],
        rockScales: [ 80, 85, 90 ],
        snowBiomeTop: 2400,
        snowSpeed: .75,
        maxNameLength: 15,
        mapScale: 14400,
        mapPingScale: 40,
        mapPingTime: 2200,
        skinColors: [ "#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91B2DB" ]
    };
    const constants_Config = Config_Config;
    const Weapons = [ {
        id: 0,
        itemType: 0,
        upgradeType: 0,
        type: 0,
        age: 0,
        name: "tool hammer",
        description: "tool for gathering all resources",
        src: "hammer_1",
        length: 140,
        width: 140,
        xOffset: -3,
        yOffset: 18,
        damage: 25,
        range: 65,
        gather: 1,
        speed: 300
    }, {
        id: 1,
        itemType: 0,
        upgradeType: 1,
        type: 0,
        age: 2,
        name: "hand axe",
        description: "gathers resources at a higher rate",
        src: "axe_1",
        length: 140,
        width: 140,
        xOffset: 3,
        yOffset: 24,
        damage: 30,
        spdMult: 1,
        range: 70,
        gather: 2,
        speed: 400
    }, {
        id: 2,
        itemType: 0,
        upgradeOf: 1,
        upgradeType: 1,
        type: 0,
        age: 8,
        pre: 1,
        name: "great axe",
        description: "deal more damage and gather more resources",
        src: "great_axe_1",
        length: 140,
        width: 140,
        xOffset: -8,
        yOffset: 25,
        damage: 35,
        spdMult: 1,
        range: 75,
        gather: 4,
        speed: 400
    }, {
        id: 3,
        itemType: 0,
        upgradeType: 2,
        type: 0,
        age: 2,
        name: "short sword",
        description: "increased attack power but slower move speed",
        src: "sword_1",
        iPad: 1.3,
        length: 130,
        width: 210,
        xOffset: -8,
        yOffset: 46,
        damage: 35,
        spdMult: .85,
        range: 110,
        gather: 1,
        speed: 300
    }, {
        id: 4,
        itemType: 0,
        upgradeOf: 3,
        upgradeType: 2,
        type: 0,
        age: 8,
        pre: 3,
        name: "katana",
        description: "greater range and damage",
        src: "samurai_1",
        iPad: 1.3,
        length: 130,
        width: 210,
        xOffset: -8,
        yOffset: 59,
        damage: 40,
        spdMult: .8,
        range: 118,
        gather: 1,
        speed: 300
    }, {
        id: 5,
        itemType: 0,
        upgradeType: 3,
        isUpgrade: false,
        type: 0,
        age: 2,
        name: "polearm",
        description: "long range melee weapon",
        src: "spear_1",
        iPad: 1.3,
        length: 130,
        width: 210,
        xOffset: -8,
        yOffset: 53,
        damage: 45,
        knock: .2,
        spdMult: .82,
        range: 142,
        gather: 1,
        speed: 700
    }, {
        id: 6,
        itemType: 0,
        upgradeType: 4,
        isUpgrade: false,
        type: 0,
        age: 2,
        name: "bat",
        description: "fast long range melee weapon",
        src: "bat_1",
        iPad: 1.3,
        length: 110,
        width: 180,
        xOffset: -8,
        yOffset: 53,
        damage: 20,
        knock: .7,
        range: 110,
        gather: 1,
        speed: 300
    }, {
        id: 7,
        itemType: 0,
        upgradeType: 5,
        isUpgrade: false,
        type: 0,
        age: 2,
        name: "daggers",
        description: "really fast short range weapon",
        src: "dagger_1",
        iPad: .8,
        length: 110,
        width: 110,
        xOffset: 18,
        yOffset: 0,
        damage: 20,
        knock: .1,
        range: 65,
        gather: 1,
        hitSlow: .1,
        spdMult: 1.13,
        speed: 100
    }, {
        id: 8,
        itemType: 0,
        upgradeType: 6,
        isUpgrade: false,
        type: 0,
        age: 2,
        name: "stick",
        description: "great for gathering but very weak",
        src: "stick_1",
        length: 140,
        width: 140,
        xOffset: 3,
        yOffset: 24,
        damage: 1,
        spdMult: 1,
        range: 70,
        gather: 7,
        speed: 400
    }, {
        id: 9,
        itemType: 1,
        upgradeType: 7,
        projectile: 0,
        type: 1,
        age: 6,
        name: "hunting bow",
        description: "bow used for ranged combat and hunting",
        src: "bow_1",
        cost: {
            food: 0,
            wood: 4,
            stone: 0,
            gold: 0
        },
        length: 120,
        width: 120,
        xOffset: -6,
        yOffset: 0,
        spdMult: .75,
        speed: 600,
        range: 2200
    }, {
        id: 10,
        itemType: 1,
        upgradeType: 8,
        isUpgrade: false,
        type: 1,
        age: 6,
        name: "great hammer",
        description: "hammer used for destroying structures",
        src: "great_hammer_1",
        length: 140,
        width: 140,
        xOffset: -9,
        yOffset: 25,
        damage: 10,
        spdMult: .88,
        range: 75,
        sDmg: 7.5,
        gather: 1,
        speed: 400
    }, {
        id: 11,
        itemType: 1,
        upgradeType: 9,
        isUpgrade: false,
        type: 1,
        age: 6,
        name: "wooden shield",
        description: "blocks projectiles and reduces melee damage",
        src: "shield_1",
        length: 120,
        width: 120,
        shield: .2,
        xOffset: 6,
        yOffset: 0,
        spdMult: .7,
        speed: 1
    }, {
        id: 12,
        itemType: 1,
        upgradeType: 7,
        projectile: 2,
        upgradeOf: 9,
        type: 1,
        age: 8,
        pre: 9,
        name: "crossbow",
        description: "deals more damage and has greater range",
        src: "crossbow_1",
        cost: {
            food: 0,
            wood: 5,
            stone: 0,
            gold: 0
        },
        aboveHand: true,
        armS: .75,
        length: 120,
        width: 120,
        xOffset: -4,
        yOffset: 0,
        spdMult: .7,
        speed: 700,
        range: 2200
    }, {
        id: 13,
        itemType: 1,
        upgradeType: 7,
        projectile: 3,
        upgradeOf: 12,
        type: 1,
        age: 9,
        pre: 12,
        name: "repeater crossbow",
        description: "high firerate crossbow with reduced damage",
        src: "crossbow_2",
        cost: {
            food: 0,
            wood: 10,
            stone: 0,
            gold: 0
        },
        aboveHand: true,
        armS: .75,
        length: 120,
        width: 120,
        xOffset: -4,
        yOffset: 0,
        spdMult: .7,
        speed: 230,
        range: 2200
    }, {
        id: 14,
        itemType: 1,
        upgradeType: 10,
        isUpgrade: false,
        type: 1,
        age: 6,
        name: "mc grabby",
        description: "steals resources from enemies",
        src: "grab_1",
        length: 130,
        width: 210,
        xOffset: -8,
        yOffset: 53,
        damage: 0,
        steal: 250,
        knock: .2,
        spdMult: 1.05,
        range: 125,
        gather: 0,
        speed: 700
    }, {
        id: 15,
        itemType: 1,
        upgradeType: 7,
        projectile: 5,
        upgradeOf: 12,
        type: 1,
        age: 9,
        pre: 12,
        name: "musket",
        description: "slow firerate but high damage and range",
        src: "musket_1",
        cost: {
            food: 0,
            wood: 0,
            stone: 10,
            gold: 0
        },
        aboveHand: true,
        rec: .35,
        armS: .6,
        hndS: .3,
        hndD: 1.6,
        length: 205,
        width: 205,
        xOffset: 25,
        yOffset: 0,
        hideProjectile: true,
        spdMult: .6,
        speed: 1500,
        range: 2200
    } ];
    const ItemGroups = {
        [1]: {
            name: "Wall",
            limit: 30,
            layer: 0
        },
        [2]: {
            name: "Spike",
            limit: 15,
            layer: 0
        },
        [3]: {
            name: "Windmill",
            limit: 7,
            sandboxLimit: 299,
            layer: 1
        },
        [4]: {
            name: "Mine",
            limit: 1,
            layer: 0
        },
        [5]: {
            name: "Trap",
            limit: 6,
            layer: -1
        },
        [6]: {
            name: "Boost",
            limit: 12,
            sandboxLimit: 299,
            layer: -1
        },
        [7]: {
            name: "Turret",
            limit: 2,
            layer: 1
        },
        [8]: {
            name: "Plaftorm",
            limit: 12,
            layer: -1
        },
        [9]: {
            name: "Healing pad",
            limit: 4,
            layer: -1
        },
        [10]: {
            name: "Spawn",
            limit: 1,
            layer: -1
        },
        [11]: {
            name: "Sapling",
            limit: 2,
            layer: 0
        },
        [12]: {
            name: "Blocker",
            limit: 3,
            layer: -1
        },
        [13]: {
            name: "Teleporter",
            limit: 2,
            sandboxLimit: 299,
            layer: -1
        }
    };
    const Items = [ {
        id: 0,
        itemType: 2,
        name: "apple",
        description: "restores 20 health when consumed",
        age: 0,
        cost: {
            food: 10,
            wood: 0,
            stone: 0,
            gold: 0
        },
        restore: 20,
        scale: 22,
        holdOffset: 15
    }, {
        id: 1,
        itemType: 2,
        upgradeOf: 0,
        name: "cookie",
        description: "restores 40 health when consumed",
        age: 3,
        cost: {
            food: 15,
            wood: 0,
            stone: 0,
            gold: 0
        },
        restore: 40,
        scale: 27,
        holdOffset: 15
    }, {
        id: 2,
        itemType: 2,
        upgradeOf: 1,
        name: "cheese",
        description: "restores 30 health and another 50 over 5 seconds",
        age: 7,
        cost: {
            food: 25,
            wood: 0,
            stone: 0,
            gold: 0
        },
        restore: 30,
        scale: 27,
        holdOffset: 15
    }, {
        id: 3,
        itemType: 3,
        itemGroup: 1,
        name: "wood wall",
        description: "provides protection for your village",
        age: 0,
        cost: {
            food: 0,
            wood: 10,
            stone: 0,
            gold: 0
        },
        projDmg: true,
        health: 380,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 4,
        itemType: 3,
        itemGroup: 1,
        upgradeOf: 3,
        name: "stone wall",
        description: "provides improved protection for your village",
        age: 3,
        cost: {
            food: 0,
            wood: 0,
            stone: 25,
            gold: 0
        },
        health: 900,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        pre: 1,
        id: 5,
        itemType: 3,
        itemGroup: 1,
        upgradeOf: 4,
        name: "castle wall",
        description: "provides powerful protection for your village",
        age: 7,
        cost: {
            food: 0,
            wood: 0,
            stone: 35,
            gold: 0
        },
        health: 1500,
        scale: 52,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 6,
        itemType: 4,
        itemGroup: 2,
        name: "spikes",
        description: "damages enemies when they touch them",
        age: 0,
        cost: {
            food: 0,
            wood: 20,
            stone: 5,
            gold: 0
        },
        health: 400,
        damage: 20,
        scale: 49,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        id: 7,
        itemType: 4,
        itemGroup: 2,
        upgradeOf: 6,
        name: "greater spikes",
        description: "damages enemies when they touch them",
        age: 5,
        cost: {
            food: 0,
            wood: 30,
            stone: 10,
            gold: 0
        },
        health: 500,
        damage: 35,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        id: 8,
        itemType: 4,
        itemGroup: 2,
        upgradeOf: 7,
        name: "poison spikes",
        description: "poisons enemies when they touch them",
        age: 9,
        pre: 1,
        cost: {
            food: 0,
            wood: 35,
            stone: 15,
            gold: 0
        },
        health: 600,
        damage: 30,
        poisonDamage: 5,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        id: 9,
        itemType: 4,
        itemGroup: 2,
        upgradeOf: 7,
        name: "spinning spikes",
        description: "damages enemies when they touch them",
        age: 9,
        pre: 2,
        cost: {
            food: 0,
            wood: 30,
            stone: 20,
            gold: 0
        },
        health: 500,
        damage: 45,
        turnSpeed: .003,
        scale: 52,
        spritePadding: -23,
        holdOffset: 8,
        placeOffset: -5
    }, {
        id: 10,
        itemType: 5,
        itemGroup: 3,
        name: "windmill",
        description: "generates gold over time",
        age: 0,
        cost: {
            food: 0,
            wood: 50,
            stone: 10,
            gold: 0
        },
        health: 400,
        pps: 1,
        turnSpeed: .0016,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 45,
        holdOffset: 20,
        placeOffset: 5
    }, {
        id: 11,
        itemType: 5,
        itemGroup: 3,
        upgradeOf: 10,
        name: "faster windmill",
        description: "generates more gold over time",
        age: 5,
        pre: 1,
        cost: {
            food: 0,
            wood: 60,
            stone: 20,
            gold: 0
        },
        health: 500,
        pps: 1.5,
        turnSpeed: .0025,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 47,
        holdOffset: 20,
        placeOffset: 5
    }, {
        id: 12,
        itemType: 5,
        itemGroup: 3,
        upgradeOf: 11,
        name: "power mill",
        description: "generates more gold over time",
        age: 8,
        pre: 1,
        cost: {
            food: 0,
            wood: 100,
            stone: 50,
            gold: 0
        },
        health: 800,
        pps: 2,
        turnSpeed: .005,
        spritePadding: 25,
        iconLineMult: 12,
        scale: 47,
        holdOffset: 20,
        placeOffset: 5
    }, {
        id: 13,
        itemType: 6,
        itemGroup: 4,
        name: "mine",
        description: "allows you to mine stone",
        age: 5,
        type: 2,
        cost: {
            food: 0,
            wood: 20,
            stone: 100,
            gold: 0
        },
        iconLineMult: 12,
        scale: 65,
        holdOffset: 20,
        placeOffset: 0
    }, {
        id: 14,
        itemType: 6,
        itemGroup: 11,
        name: "sapling",
        description: "allows you to farm wood",
        age: 5,
        type: 0,
        cost: {
            food: 0,
            wood: 150,
            stone: 0,
            gold: 0
        },
        iconLineMult: 12,
        colDiv: .5,
        scale: 110,
        holdOffset: 50,
        placeOffset: -15
    }, {
        id: 15,
        itemType: 7,
        itemGroup: 5,
        name: "pit trap",
        description: "pit that traps enemies if they walk over it",
        age: 4,
        cost: {
            food: 0,
            wood: 30,
            stone: 30,
            gold: 0
        },
        trap: true,
        ignoreCollision: true,
        hideFromEnemy: true,
        health: 500,
        colDiv: .2,
        scale: 50,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 16,
        itemType: 7,
        itemGroup: 6,
        name: "boost pad",
        description: "provides boost when stepped on",
        age: 4,
        cost: {
            food: 0,
            wood: 5,
            stone: 20,
            gold: 0
        },
        ignoreCollision: true,
        boostSpeed: 1.5,
        health: 150,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 17,
        itemType: 8,
        itemGroup: 7,
        name: "turret",
        description: "defensive structure that shoots at enemies",
        age: 7,
        doUpdate: true,
        cost: {
            food: 0,
            wood: 200,
            stone: 150,
            gold: 0
        },
        health: 800,
        projectile: 1,
        shootRange: 700,
        shootRate: 2200,
        scale: 43,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 18,
        itemType: 8,
        itemGroup: 8,
        name: "platform",
        description: "platform to shoot over walls and cross over water",
        age: 7,
        cost: {
            food: 0,
            wood: 20,
            stone: 0,
            gold: 0
        },
        ignoreCollision: true,
        zIndex: 1,
        health: 300,
        scale: 43,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 19,
        itemType: 8,
        itemGroup: 9,
        name: "healing pad",
        description: "standing on it will slowly heal you",
        age: 7,
        cost: {
            food: 10,
            wood: 30,
            stone: 0,
            gold: 0
        },
        ignoreCollision: true,
        healCol: 15,
        health: 400,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 20,
        itemType: 9,
        itemGroup: 10,
        name: "spawn pad",
        description: "you will spawn here when you die but it will dissapear",
        age: 9,
        cost: {
            food: 0,
            wood: 100,
            stone: 100,
            gold: 0
        },
        health: 400,
        ignoreCollision: true,
        spawnPoint: true,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 21,
        itemType: 8,
        itemGroup: 12,
        name: "blocker",
        description: "blocks building in radius",
        age: 7,
        cost: {
            food: 0,
            wood: 30,
            stone: 25,
            gold: 0
        },
        ignoreCollision: true,
        blocker: 300,
        health: 400,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    }, {
        id: 22,
        itemType: 8,
        itemGroup: 13,
        name: "teleporter",
        description: "teleports you to a random point on the map",
        age: 7,
        cost: {
            food: 0,
            wood: 60,
            stone: 60,
            gold: 0
        },
        ignoreCollision: true,
        teleport: true,
        health: 200,
        colDiv: .7,
        scale: 45,
        holdOffset: 20,
        placeOffset: -5
    } ];
    const WeaponVariants = [ {
        id: 0,
        src: "",
        xp: 1,
        needXP: 0,
        val: 1,
        color: "#7e7e90"
    }, {
        id: 1,
        src: "_g",
        xp: 3e3,
        needXP: 3e3,
        val: 1.1,
        color: "#f7cf45"
    }, {
        id: 2,
        src: "_d",
        xp: 7e3,
        needXP: 4e3,
        val: 1.18,
        color: "#6d91cb"
    }, {
        id: 3,
        src: "_r",
        poison: true,
        xp: 12e3,
        needXP: 5e3,
        val: 1.18,
        color: "#be5454"
    } ];
    const Projectiles = [ {
        id: 0,
        name: "Hunting bow",
        index: 0,
        layer: 0,
        src: "arrow_1",
        damage: 25,
        scale: 103,
        range: 1e3,
        speed: 1.6
    }, {
        id: 1,
        name: "Turret",
        index: 1,
        layer: 1,
        damage: 25,
        scale: 20,
        speed: 1.5,
        range: 700
    }, {
        id: 2,
        name: "Crossbow",
        index: 0,
        layer: 0,
        src: "arrow_1",
        damage: 35,
        scale: 103,
        range: 1200,
        speed: 2.5
    }, {
        id: 3,
        name: "Repeater crossbow",
        index: 0,
        layer: 0,
        src: "arrow_1",
        damage: 30,
        scale: 103,
        range: 1200,
        speed: 2
    }, {
        id: 4,
        index: 1,
        layer: 1,
        damage: 16,
        scale: 20,
        range: 0,
        speed: 0
    }, {
        id: 5,
        name: "Musket",
        index: 0,
        layer: 0,
        src: "bullet_1",
        damage: 50,
        scale: 160,
        range: 1400,
        speed: 3.6
    } ];
    class Vector_Vector {
        x;
        y;
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        static fromAngle(angle, length = 1) {
            return new Vector_Vector(Math.cos(angle) * length, Math.sin(angle) * length);
        }
        add(vec) {
            if (vec instanceof Vector_Vector) {
                this.x += vec.x;
                this.y += vec.y;
            } else {
                this.x += vec;
                this.y += vec;
            }
            return this;
        }
        sub(vec) {
            if (vec instanceof Vector_Vector) {
                this.x -= vec.x;
                this.y -= vec.y;
            } else {
                this.x -= vec;
                this.y -= vec;
            }
            return this;
        }
        mult(scalar) {
            this.x *= scalar;
            this.y *= scalar;
            return this;
        }
        div(scalar) {
            this.x /= scalar;
            this.y /= scalar;
            return this;
        }
        get length() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        normalize() {
            return this.length > 0 ? this.div(this.length) : this;
        }
        dot(vec) {
            return this.x * vec.x + this.y * vec.y;
        }
        proj(vec) {
            const k = this.dot(vec) / vec.dot(vec);
            return vec.copy().mult(k);
        }
        setXY(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        setVec(vec) {
            return this.setXY(vec.x, vec.y);
        }
        setLength(value) {
            return this.normalize().mult(value);
        }
        copy() {
            return new Vector_Vector(this.x, this.y);
        }
        distance(vec) {
            return this.copy().sub(vec).length;
        }
        angle(vec) {
            const copy = vec.copy().sub(this);
            return Math.atan2(copy.y, copy.x);
        }
        direction(angle, length) {
            return this.copy().add(Vector_Vector.fromAngle(angle, length));
        }
        isEqual(vec) {
            return this.x === vec.x && this.y === vec.y;
        }
        stringify() {
            return this.x + ":" + this.y;
        }
    }
    const modules_Vector = Vector_Vector;
    const getAngle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const getAngleDist = (a, b) => {
        const p = Math.abs(b - a) % (2 * Math.PI);
        return p > Math.PI ? 2 * Math.PI - p : p;
    };
    const removeFast = (array, index) => {
        if (index < 0 || index >= array.length) {
            throw new RangeError("removeFast: Index out of range");
        }
        if (index === array.length - 1) {
            array.pop();
        } else {
            array[index] = array.pop();
        }
    };
    let uniqueID = 0;
    const getUniqueID = () => uniqueID++;
    const isActiveInput = () => {
        const active = document.activeElement || document.body;
        return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
    };
    const getAngleFromBitmask = (bitmask, rotate) => {
        const vec = {
            x: 0,
            y: 0
        };
        if (1 & bitmask) {
            vec.y--;
        }
        if (2 & bitmask) {
            vec.y++;
        }
        if (4 & bitmask) {
            vec.x--;
        }
        if (8 & bitmask) {
            vec.x++;
        }
        if (rotate) {
            vec.x *= -1;
            vec.y *= -1;
        }
        return 0 === vec.x && 0 === vec.y ? null : Math.atan2(vec.y, vec.x);
    };
    const formatCode = code => {
        code += "";
        if ("Backspace" === code) {
            return code;
        }
        if ("Escape" === code) {
            return "ESC";
        }
        if ("Delete" === code) {
            return "DEL";
        }
        if ("Minus" === code) {
            return "-";
        }
        if ("Equal" === code) {
            return "=";
        }
        if ("BracketLeft" === code) {
            return "[";
        }
        if ("BracketRight" === code) {
            return "]";
        }
        if ("Slash" === code) {
            return "/";
        }
        if ("Backslash" === code) {
            return "\\";
        }
        if ("Quote" === code) {
            return "'";
        }
        if ("Backquote" === code) {
            return "`";
        }
        if ("Semicolon" === code) {
            return ";";
        }
        if ("Comma" === code) {
            return ",";
        }
        if ("Period" === code) {
            return ".";
        }
        if ("CapsLock" === code) {
            return "CAPS";
        }
        if ("ContextMenu" === code) {
            return "CTXMENU";
        }
        if ("NumLock" === code) {
            return "LOCK";
        }
        return code.replace(/^Page/, "PG").replace(/^Digit/, "").replace(/^Key/, "").replace(/^(Shift|Control|Alt)(L|R).*$/, "$2$1").replace(/Control/, "CTRL").replace(/^Arrow/, "").replace(/^Numpad/, "NUM").replace(/Decimal/, "DEC").replace(/Subtract/, "SUB").replace(/Divide/, "DIV").replace(/Multiply/, "MULT").toUpperCase();
    };
    const formatButton = button => {
        if (0 === button) {
            return "LBTN";
        }
        if (1 === button) {
            return "MBTN";
        }
        if (2 === button) {
            return "RBTN";
        }
        if (3 === button) {
            return "BBTN";
        }
        if (4 === button) {
            return "FBTN";
        }
        throw new Error(`formatButton Error: "${button}" is not valid button`);
    };
    const removeClass = (target, name) => {
        if (target instanceof HTMLElement) {
            target.classList.remove(name);
            return;
        }
        for (const element of target) {
            element.classList.remove(name);
        }
    };
    const pointInRiver = position => {
        const y = position.y;
        const below = y >= constants_Config.mapScale / 2 - constants_Config.riverWidth / 2;
        const above = y <= constants_Config.mapScale / 2 + constants_Config.riverWidth / 2;
        return below && above;
    };
    const pointInDesert = position => position.y >= constants_Config.mapScale - constants_Config.snowBiomeTop;
    const inView = (x, y, radius) => {
        const maxScreenWidth = Math.min(1920, modules_ZoomHandler.scale.current.w);
        const maxScreenHeight = Math.min(1080, modules_ZoomHandler.scale.current.h);
        const visibleHorizontally = x + radius > 0 && x - radius < maxScreenWidth;
        const visibleVertically = y + radius > 0 && y - radius < maxScreenHeight;
        return visibleHorizontally && visibleVertically;
    };
    const findPlacementAngles = angles => {
        const output = new Set;
        for (let i = 0; i < angles.length; i++) {
            const {angle, offset} = angles[i];
            const start = angle - offset;
            const end = angle + offset;
            let startIntersects = false;
            let endIntersects = false;
            for (let j = 0; j < angles.length; j++) {
                if (startIntersects && endIntersects) {
                    break;
                }
                if (i !== j) {
                    const {angle, offset} = angles[j];
                    if (getAngleDist(start, angle) <= offset) {
                        startIntersects = true;
                    }
                    if (getAngleDist(end, angle) <= offset) {
                        endIntersects = true;
                    }
                }
            }
            if (!startIntersects) {
                output.add(start);
            }
            if (!endIntersects) {
                output.add(end);
            }
        }
        return output;
    };
    const cursorPosition = () => {
        const {ModuleHandler, myPlayer} = myClient;
        const {w, h} = modules_ZoomHandler.scale.current;
        const scale = Math.max(innerWidth / w, innerHeight / h);
        const cursorX = (ModuleHandler.mouse.lockX - innerWidth / 2) / scale;
        const cursorY = (ModuleHandler.mouse.lockY - innerHeight / 2) / scale;
        const pos = myPlayer.position.current;
        return new modules_Vector(pos.x + cursorX, pos.y + cursorY);
    };
    const Hooker = new class Hooker {
        createRecursiveHook(target, prop, callback) {
            (function recursiveHook() {
                Object.defineProperty(target, prop, {
                    set(value) {
                        delete target[prop];
                        this[prop] = value;
                        if (callback(this, value)) {
                            return;
                        }
                        recursiveHook();
                    },
                    configurable: true
                });
            })();
        }
        createHook(target, prop, callback) {
            const symbol = Symbol(prop);
            Object.defineProperty(target, prop, {
                get() {
                    return this[symbol];
                },
                set(value) {
                    callback(this, value, symbol);
                },
                configurable: true
            });
        }
        linker(value) {
            const hook = [ value ];
            hook.valueOf = () => hook[0];
            return hook;
        }
    };
    const utility_Hooker = Hooker;
    const resizeEvent = new Event("resize");
    const ZoomHandler = new class ZoomHandler {
        scale={
            Default: {
                w: 1920,
                h: 1080
            },
            current: {
                w: 1920,
                h: 1080
            },
            smooth: {
                w: utility_Hooker.linker(1920),
                h: utility_Hooker.linker(1080)
            }
        };
        wheels=3;
        scaleFactor=250;
        getScale() {
            const dpr = 1;
            return Math.max(innerWidth / this.scale.Default.w, innerHeight / this.scale.Default.h) * dpr;
        }
        getMinScale(scale) {
            const {w, h} = this.scale.Default;
            const min = Math.min(w, h);
            const count = Math.floor(min / scale);
            return {
                w: w - scale * count,
                h: h - scale * count
            };
        }
        handler(event) {
            if (!(event.target instanceof HTMLCanvasElement) || event.ctrlKey || event.shiftKey || event.altKey || isActiveInput()) {
                return;
            }
            const {Default, current, smooth} = this.scale;
            if (Default.w === current.w && Default.h === current.h && 0 !== (this.wheels = (this.wheels + 1) % 4)) {
                return;
            }
            const {w, h} = this.getMinScale(this.scaleFactor);
            const zoom = Math.sign(event.deltaY) * -this.scaleFactor;
            current.w = Math.max(w, current.w + zoom);
            current.h = Math.max(h, current.h + zoom);
            smooth.w[0] = current.w;
            smooth.h[0] = current.h;
            window.dispatchEvent(resizeEvent);
        }
    };
    const modules_ZoomHandler = ZoomHandler;
    class Storage {
        static get(key) {
            const value = localStorage.getItem(key);
            return null === value ? null : JSON.parse(value);
        }
        static set(key, value, stringify = true) {
            const data = stringify ? JSON.stringify(value) : value;
            localStorage.setItem(key, data);
        }
        static delete(key) {
            const has = localStorage.hasOwnProperty(key) && key in localStorage;
            localStorage.removeItem(key);
            return has;
        }
    }
    class Cookie {
        static get(key) {
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
                const match = cookie.trim().match(/^(.+?)=(.+?)$/);
                if (null !== match && match[1] === key) {
                    try {
                        return JSON.parse(decodeURIComponent(match[2]));
                    } catch (err) {}
                }
            }
            return null;
        }
        static set(name, value, days) {
            const date = new Date;
            date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3);
            const expires = "; expires=" + date.toUTCString();
            const domain = "; domain=.moomoo.io";
            const path = "; path=/";
            const cookieString = `${name}=${encodeURIComponent(value)}${expires}${domain}${path}`;
            document.cookie = cookieString;
        }
    }
    const defaultSettings = {
        primary: "Digit1",
        secondary: "Digit2",
        food: "KeyQ",
        wall: "Digit4",
        spike: "KeyV",
        windmill: "KeyR",
        farm: "KeyT",
        trap: "KeyF",
        turret: "KeyG",
        spawn: "KeyJ",
        up: "KeyW",
        left: "KeyA",
        down: "KeyS",
        right: "KeyD",
        autoattack: "KeyE",
        lockrotation: "KeyX",
        toggleChat: "Enter",
        toggleShop: "Tab",
        toggleClan: "ControlLeft",
        toggleMenu: "`",
        biomehats: true,
        autoemp: false,
        antienemy: true,
        antianimal: true,
        antispike: true,
        autoheal: true,
        healingSpeed: 40,
        automill: false,
        autoplacer: true,
        autobreak: true,
        enemyTracers: false,
        enemyTracersColor: "#cc5151",
        teammateTracers: false,
        teammateTracersColor: "#8ecc51",
        animalTracers: false,
        animalTracersColor: "#518ccc",
        notificationTracers: false,
        notificationTracersColor: "#f5d951",
        arrows: false,
        itemMarkers: false,
        itemMarkersColor: "",
        teammateMarkers: false,
        teammateMarkersColor: "#bdb14b",
        enemyMarkers: false,
        enemyMarkersColor: "#ba4949",
        weaponXPBar: true,
        playerTurretReloadBar: false,
        playerTurretReloadBarColor: "#cf7148",
        weaponReloadBar: true,
        weaponReloadBarColor: "#ffffff",
        renderHP: false,
        objectTurretReloadBar: false,
        objectTurretReloadBarColor: "#66d9af",
        itemHealthBar: false,
        itemHealthBarColor: "#6b449e",
        itemCounter: true,
        renderGrid: true,
        windmillRotation: false,
        entityDanger: false,
        displayPlayerAngle: false,
        projectileHitbox: false,
        possibleShootTarget: false,
        weaponHitbox: false,
        collisionHitbox: false,
        placementHitbox: false,
        turretHitbox: false,
        possiblePlacement: false,
        autospawn: false,
        autoaccept: false,
        menuTransparency: false,
        storeItems: [ [], []]
    };
    defaultSettings.storeItems;
    const settings = {
        ...defaultSettings,
        ...Cookie.get("Glotus")
    };
    for (const iterator in settings) {
        const key = iterator;
        if (!defaultSettings.hasOwnProperty(key)) {
            delete settings[key];
        }
    }
    const SaveSettings = () => {
        Cookie.set("Glotus", JSON.stringify(settings), 365);
    };
    SaveSettings();
    const Settings = settings;
    const Hats = {
        [0]: {
            index: 0,
            id: 0,
            name: "Unequip",
            dontSell: true,
            price: 0,
            scale: 0,
            description: "None"
        },
        [45]: {
            index: 1,
            id: 45,
            name: "Shame!",
            dontSell: true,
            price: 0,
            scale: 120,
            description: "hacks are for losers"
        },
        [51]: {
            index: 2,
            id: 51,
            name: "Moo Cap",
            price: 0,
            scale: 120,
            description: "coolest mooer around"
        },
        [50]: {
            index: 3,
            id: 50,
            name: "Apple Cap",
            price: 0,
            scale: 120,
            description: "apple farms remembers"
        },
        [28]: {
            index: 4,
            id: 28,
            name: "Moo Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [29]: {
            index: 5,
            id: 29,
            name: "Pig Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [30]: {
            index: 6,
            id: 30,
            name: "Fluff Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [36]: {
            index: 7,
            id: 36,
            name: "Pandou Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [37]: {
            index: 8,
            id: 37,
            name: "Bear Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [38]: {
            index: 9,
            id: 38,
            name: "Monkey Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [44]: {
            index: 10,
            id: 44,
            name: "Polar Head",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [35]: {
            index: 11,
            id: 35,
            name: "Fez Hat",
            price: 0,
            scale: 120,
            description: "no effect"
        },
        [42]: {
            index: 12,
            id: 42,
            name: "Enigma Hat",
            price: 0,
            scale: 120,
            description: "join the enigma army"
        },
        [43]: {
            index: 13,
            id: 43,
            name: "Blitz Hat",
            price: 0,
            scale: 120,
            description: "hey everybody i'm blitz"
        },
        [49]: {
            index: 14,
            id: 49,
            name: "Bob XIII Hat",
            price: 0,
            scale: 120,
            description: "like and subscribe"
        },
        [57]: {
            index: 15,
            id: 57,
            name: "Pumpkin",
            price: 50,
            scale: 120,
            description: "Spooooky"
        },
        [8]: {
            index: 16,
            id: 8,
            name: "Bummle Hat",
            price: 100,
            scale: 120,
            description: "no effect"
        },
        [2]: {
            index: 17,
            id: 2,
            name: "Straw Hat",
            price: 500,
            scale: 120,
            description: "no effect"
        },
        [15]: {
            index: 18,
            id: 15,
            name: "Winter Cap",
            price: 600,
            scale: 120,
            description: "allows you to move at normal speed in snow",
            coldM: 1
        },
        [5]: {
            index: 19,
            id: 5,
            name: "Cowboy Hat",
            price: 1e3,
            scale: 120,
            description: "no effect"
        },
        [4]: {
            index: 20,
            id: 4,
            name: "Ranger Hat",
            price: 2e3,
            scale: 120,
            description: "no effect"
        },
        [18]: {
            index: 21,
            id: 18,
            name: "Explorer Hat",
            price: 2e3,
            scale: 120,
            description: "no effect"
        },
        [31]: {
            index: 22,
            id: 31,
            name: "Flipper Hat",
            price: 2500,
            scale: 120,
            description: "have more control while in water",
            watrImm: true
        },
        [1]: {
            index: 23,
            id: 1,
            name: "Marksman Cap",
            price: 3e3,
            scale: 120,
            description: "increases arrow speed and range",
            aMlt: 1.3
        },
        [10]: {
            index: 24,
            id: 10,
            name: "Bush Gear",
            price: 3e3,
            scale: 160,
            description: "allows you to disguise yourself as a bush"
        },
        [48]: {
            index: 25,
            id: 48,
            name: "Halo",
            price: 3e3,
            scale: 120,
            description: "no effect"
        },
        [6]: {
            index: 26,
            id: 6,
            name: "Soldier Helmet",
            price: 4e3,
            scale: 120,
            description: "reduces damage taken but slows movement",
            spdMult: .94,
            dmgMult: .75
        },
        [23]: {
            index: 27,
            id: 23,
            name: "Anti Venom Gear",
            price: 4e3,
            scale: 120,
            description: "makes you immune to poison",
            poisonRes: 1
        },
        [13]: {
            index: 28,
            id: 13,
            name: "Medic Gear",
            price: 5e3,
            scale: 110,
            description: "slowly regenerates health over time",
            healthRegen: 3
        },
        [9]: {
            index: 29,
            id: 9,
            name: "Miners Helmet",
            price: 5e3,
            scale: 120,
            description: "earn 1 extra gold per resource",
            extraGold: 1
        },
        [32]: {
            index: 30,
            id: 32,
            name: "Musketeer Hat",
            price: 5e3,
            scale: 120,
            description: "reduces cost of projectiles",
            projCost: .5
        },
        [7]: {
            index: 31,
            id: 7,
            name: "Bull Helmet",
            price: 6e3,
            scale: 120,
            description: "increases damage done but drains health",
            healthRegen: -5,
            dmgMultO: 1.5,
            spdMult: .96
        },
        [22]: {
            index: 32,
            id: 22,
            name: "Emp Helmet",
            price: 6e3,
            scale: 120,
            description: "turrets won't attack but you move slower",
            antiTurret: 1,
            spdMult: .7
        },
        [12]: {
            index: 33,
            id: 12,
            name: "Booster Hat",
            price: 6e3,
            scale: 120,
            description: "increases your movement speed",
            spdMult: 1.16
        },
        [26]: {
            index: 34,
            id: 26,
            name: "Barbarian Armor",
            price: 8e3,
            scale: 120,
            description: "knocks back enemies that attack you",
            dmgK: .6
        },
        [21]: {
            index: 35,
            id: 21,
            name: "Plague Mask",
            price: 1e4,
            scale: 120,
            description: "melee attacks deal poison damage",
            poisonDmg: 5,
            poisonTime: 6
        },
        [46]: {
            index: 36,
            id: 46,
            name: "Bull Mask",
            price: 1e4,
            scale: 120,
            description: "bulls won't target you unless you attack them",
            bullRepel: 1
        },
        [14]: {
            index: 37,
            id: 14,
            name: "Windmill Hat",
            topSprite: true,
            price: 1e4,
            scale: 120,
            description: "generates points while worn",
            pps: 1.5
        },
        [11]: {
            index: 38,
            id: 11,
            name: "Spike Gear",
            topSprite: true,
            price: 1e4,
            scale: 120,
            description: "deal damage to players that damage you",
            dmg: .45
        },
        [53]: {
            index: 39,
            id: 53,
            name: "Turret Gear",
            topSprite: true,
            price: 1e4,
            scale: 120,
            description: "you become a walking turret",
            turret: {
                projectile: 1,
                range: 700,
                rate: 2500
            },
            spdMult: .7
        },
        [20]: {
            index: 40,
            id: 20,
            name: "Samurai Armor",
            price: 12e3,
            scale: 120,
            description: "increased attack speed and fire rate",
            atkSpd: .78
        },
        [58]: {
            index: 41,
            id: 58,
            name: "Dark Knight",
            price: 12e3,
            scale: 120,
            description: "restores health when you deal damage",
            healD: .4
        },
        [27]: {
            index: 42,
            id: 27,
            name: "Scavenger Gear",
            price: 15e3,
            scale: 120,
            description: "earn double points for each kill",
            kScrM: 2
        },
        [40]: {
            index: 43,
            id: 40,
            name: "Tank Gear",
            price: 15e3,
            scale: 120,
            description: "increased damage to buildings but slower movement",
            spdMult: .3,
            bDmg: 3.3
        },
        [52]: {
            index: 44,
            id: 52,
            name: "Thief Gear",
            price: 15e3,
            scale: 120,
            description: "steal half of a players gold when you kill them",
            goldSteal: .5
        },
        [55]: {
            index: 45,
            id: 55,
            name: "Bloodthirster",
            price: 2e4,
            scale: 120,
            description: "Restore Health when dealing damage. And increased damage",
            healD: .25,
            dmgMultO: 1.2
        },
        [56]: {
            index: 46,
            id: 56,
            name: "Assassin Gear",
            price: 2e4,
            scale: 120,
            description: "Go invisible when not moving. Can't eat. Increased speed",
            noEat: true,
            spdMult: 1.1,
            invisTimer: 1e3
        }
    };
    const Accessories = {
        [0]: {
            index: 0,
            id: 0,
            name: "Unequip",
            dontSell: true,
            price: 0,
            scale: 0,
            xOffset: 0,
            description: "None"
        },
        [12]: {
            index: 1,
            id: 12,
            name: "Snowball",
            price: 1e3,
            scale: 105,
            xOffset: 18,
            description: "no effect"
        },
        [9]: {
            index: 2,
            id: 9,
            name: "Tree Cape",
            price: 1e3,
            scale: 90,
            description: "no effect"
        },
        [10]: {
            index: 3,
            id: 10,
            name: "Stone Cape",
            price: 1e3,
            scale: 90,
            description: "no effect"
        },
        [3]: {
            index: 4,
            id: 3,
            name: "Cookie Cape",
            price: 1500,
            scale: 90,
            description: "no effect"
        },
        [8]: {
            index: 5,
            id: 8,
            name: "Cow Cape",
            price: 2e3,
            scale: 90,
            description: "no effect"
        },
        [11]: {
            index: 6,
            id: 11,
            name: "Monkey Tail",
            price: 2e3,
            scale: 97,
            xOffset: 25,
            description: "Super speed but reduced damage",
            spdMult: 1.35,
            dmgMultO: .2
        },
        [17]: {
            index: 7,
            id: 17,
            name: "Apple Basket",
            price: 3e3,
            scale: 80,
            xOffset: 12,
            description: "slowly regenerates health over time",
            healthRegen: 1
        },
        [6]: {
            index: 8,
            id: 6,
            name: "Winter Cape",
            price: 3e3,
            scale: 90,
            description: "no effect"
        },
        [4]: {
            index: 9,
            id: 4,
            name: "Skull Cape",
            price: 4e3,
            scale: 90,
            description: "no effect"
        },
        [5]: {
            index: 10,
            id: 5,
            name: "Dash Cape",
            price: 5e3,
            scale: 90,
            description: "no effect"
        },
        [2]: {
            index: 11,
            id: 2,
            name: "Dragon Cape",
            price: 6e3,
            scale: 90,
            description: "no effect"
        },
        [1]: {
            index: 12,
            id: 1,
            name: "Super Cape",
            price: 8e3,
            scale: 90,
            description: "no effect"
        },
        [7]: {
            index: 13,
            id: 7,
            name: "Troll Cape",
            price: 8e3,
            scale: 90,
            description: "no effect"
        },
        [14]: {
            index: 14,
            id: 14,
            name: "Thorns",
            price: 1e4,
            scale: 115,
            xOffset: 20,
            description: "no effect"
        },
        [15]: {
            index: 15,
            id: 15,
            name: "Blockades",
            price: 1e4,
            scale: 95,
            xOffset: 15,
            description: "no effect"
        },
        [20]: {
            index: 16,
            id: 20,
            name: "Devils Tail",
            price: 1e4,
            scale: 95,
            xOffset: 20,
            description: "no effect"
        },
        [16]: {
            index: 17,
            id: 16,
            name: "Sawblade",
            price: 12e3,
            scale: 90,
            spin: true,
            xOffset: 0,
            description: "deal damage to players that damage you",
            dmg: .15
        },
        [13]: {
            index: 18,
            id: 13,
            name: "Angel Wings",
            price: 15e3,
            scale: 138,
            xOffset: 22,
            description: "slowly regenerates health over time",
            healthRegen: 3
        },
        [19]: {
            index: 19,
            id: 19,
            name: "Shadow Wings",
            price: 15e3,
            scale: 138,
            xOffset: 22,
            description: "increased movement speed",
            spdMult: 1.1
        },
        [18]: {
            index: 20,
            id: 18,
            name: "Blood Wings",
            price: 2e4,
            scale: 178,
            xOffset: 26,
            description: "restores health when you deal damage",
            healD: .2
        },
        [21]: {
            index: 21,
            id: 21,
            name: "Corrupt X Wings",
            price: 2e4,
            scale: 178,
            xOffset: 26,
            description: "deal damage to players that damage you",
            dmg: .25
        }
    };
    const store = [ Hats, Accessories ];
    class DataHandler {
        static isWeaponType(type) {
            return type <= 1;
        }
        static isItemType(type) {
            return type >= 2;
        }
        static getStore(type) {
            return store[type];
        }
        static getStoreItem(type, id) {
            switch (type) {
              case 0:
                return Hats[id];

              case 1:
                return Accessories[id];

              default:
                throw new Error(`getStoreItem Error: type "${type}" is not defined`);
            }
        }
        static getProjectile(id) {
            return Projectiles[Weapons[id].projectile];
        }
        static isWeapon(id) {
            return void 0 !== Weapons[id];
        }
        static isItem(id) {
            return void 0 !== Items[id];
        }
        static isPrimary(id) {
            return null !== id && 0 === Weapons[id].itemType;
        }
        static isSecondary(id) {
            return null !== id && 1 === Weapons[id].itemType;
        }
        static isMelee(id) {
            return null !== id && "damage" in Weapons[id];
        }
        static isAttackable(id) {
            return null !== id && "range" in Weapons[id];
        }
        static isShootable(id) {
            return null !== id && "projectile" in Weapons[id];
        }
        static isPlaceable(id) {
            return -1 !== id && "itemGroup" in Items[id];
        }
        static isHealable(id) {
            return "restore" in Items[id];
        }
        static isDestroyable(id) {
            return "health" in Items[id];
        }
    }
    const utility_DataHandler = DataHandler;
    const StoreHandler = new class StoreHandler {
        isOpened=false;
        store=[ {
            previous: -1,
            current: -1,
            list: new Map
        }, {
            previous: -1,
            current: -1,
            list: new Map
        } ];
        currentType=0;
        isRightStore(type) {
            return this.isOpened && this.currentType === type;
        }
        createStore(type) {
            const storeContainer = document.createElement("div");
            storeContainer.id = "storeContainer";
            storeContainer.style.display = "none";
            const button = document.createElement("div");
            button.id = "toggleStoreType";
            button.textContent = 0 === type ? "Hats" : "Accessories";
            button.onmousedown = () => {
                this.currentType = 0 === this.currentType ? 1 : 0;
                button.textContent = 0 === this.currentType ? "Hats" : "Accessories";
                if (this.isOpened) {
                    this.fillStore(this.currentType);
                }
            };
            storeContainer.appendChild(button);
            const itemHolder = document.createElement("div");
            itemHolder.id = "itemHolder";
            storeContainer.appendChild(itemHolder);
            itemHolder.addEventListener("wheel", (event => {
                event.preventDefault();
                const scale = 50 * Math.sign(event.deltaY);
                itemHolder.scroll(0, itemHolder.scrollTop + scale);
            }));
            const {gameUI} = UI_GameUI.getElements();
            gameUI.appendChild(storeContainer);
        }
        getTextEquip(type, id, price) {
            const {list, current} = this.store[type];
            if (current === id) {
                return "Unequip";
            }
            if (list.has(id) || 0 === price) {
                return "Equip";
            }
            return "Buy";
        }
        generateStoreElement(type, id, name, price, isTop) {
            const srcType = [ "hats/hat", "accessories/access" ];
            const src = [ srcType[type], id ];
            if (isTop) {
                src.push("p");
            }
            const html = `\n            <div class="storeItemContainer">\n                <img class="storeHat" src="./img/${src.join("_")}.png">\n                <span class="storeItemName">${name}</span>\n                <div class="equipButton" data-id="${id}">${this.getTextEquip(type, id, price)}</div>\n            </div>\n        `;
            const div = document.createElement("div");
            div.innerHTML = html;
            const equipButton = div.querySelector(".equipButton");
            equipButton.onmousedown = () => {
                myClient.ModuleHandler.equip(type, id, true, true);
            };
            return div.firstElementChild;
        }
        fillStore(type) {
            const {itemHolder} = UI_GameUI.getElements();
            itemHolder.innerHTML = "";
            const items = Settings.storeItems[type];
            for (const id of items) {
                const item = utility_DataHandler.getStoreItem(type, id);
                const element = this.generateStoreElement(type, id, item.name, item.price, "topSprite" in item);
                itemHolder.appendChild(element);
            }
        }
        handleEquipUpdate(type, prev, curr, isBuy) {
            if (!this.isRightStore(type)) {
                return;
            }
            const current = document.querySelector(`.equipButton[data-id="${curr}"]`);
            if (null !== current) {
                current.textContent = isBuy ? "Equip" : "Unequip";
            }
            if (!isBuy && -1 !== prev) {
                const previous = document.querySelector(`.equipButton[data-id="${prev}"]`);
                if (null !== previous) {
                    previous.textContent = "Equip";
                }
            }
        }
        updateStoreState(type, action, id) {
            const store = this.store[type];
            if (0 === action) {
                store.previous = store.current;
                store.current = id;
                const {previous, current, list} = store;
                list.set(previous, 0);
                list.set(current, 1);
                this.handleEquipUpdate(type, store.previous, id, false);
            } else {
                store.list.set(id, 0);
                this.handleEquipUpdate(type, store.previous, id, true);
            }
        }
        closeStore() {
            const {storeContainer, itemHolder} = UI_GameUI.getElements();
            itemHolder.innerHTML = "";
            storeContainer.style.display = "none";
            this.isOpened = false;
        }
        openStore() {
            UI_GameUI.closePopups();
            const {storeContainer} = UI_GameUI.getElements();
            this.fillStore(this.currentType);
            storeContainer.style.display = "";
            storeContainer.classList.remove("closedItem");
            this.isOpened = true;
        }
        toggleStore() {
            const {storeContainer, itemHolder} = UI_GameUI.getElements();
            if (this.isOpened) {
                itemHolder.innerHTML = "";
            } else {
                UI_GameUI.closePopups();
                this.fillStore(this.currentType);
            }
            storeContainer.style.display = "none" === storeContainer.style.display ? "" : "none";
            this.isOpened = !this.isOpened;
        }
        init() {
            this.createStore(0);
        }
    };

    class Logger {
        static log=console.log;
        static error=console.error;
        static timers=new Map;
        static start(label) {
            this.timers.set(label, performance.now());
        }
        static end(label, ...args) {
            if (this.timers.has(label)) {
                this.log(`${label}: ${performance.now() - this.timers.get(label)}`, ...args);
            }
            this.timers.delete(label);
        }
    }
    class ObjectItem {
        id;
        position;
        angle;
        scale;
        constructor(id, x, y, angle, scale) {
            this.id = id;
            this.position = {
                current: new modules_Vector(x, y)
            };
            this.angle = angle;
            this.scale = scale;
        }
        get hitScale() {
            return this.scale;
        }
    }
    class Resource extends ObjectItem {
        type;
        layer;
        constructor(id, x, y, angle, scale, type) {
            super(id, x, y, angle, scale);
            this.type = type;
            this.layer = 0 === type ? 3 : 2 === type ? 0 : 2;
        }
        formatScale(scaleMult = 1) {
            const reduceScale = 0 === this.type || 1 === this.type ? .6 * scaleMult : 1;
            return this.scale * reduceScale;
        }
        get collisionScale() {
            return this.formatScale();
        }
        get placementScale() {
            return this.formatScale(.6);
        }
        get isCactus() {
            return 1 === this.type && pointInDesert(this.position.current);
        }
    }
    class PlayerObject extends ObjectItem {
        type;
        ownerID;
        collisionDivider;
        health;
        maxHealth;
        reload=-1;
        maxReload=-1;
        isDestroyable;
        seenPlacement=false;
        layer;
        itemGroup;
        constructor(id, x, y, angle, scale, type, ownerID) {
            super(id, x, y, angle, scale);
            this.type = type;
            this.ownerID = ownerID;
            const item = Items[type];
            this.collisionDivider = "colDiv" in item ? item.colDiv : 1;
            this.health = "health" in item ? item.health : Infinity;
            this.maxHealth = this.health;
            this.isDestroyable = Infinity !== this.maxHealth;
            if (17 === item.id) {
                this.reload = item.shootRate;
                this.maxReload = this.reload;
            }
            this.layer = ItemGroups[item.itemGroup].layer;
            this.itemGroup = item.itemGroup;
        }
        formatScale(placeCollision = false) {
            return this.scale * (placeCollision ? 1 : this.collisionDivider);
        }
        get collisionScale() {
            return this.formatScale();
        }
        get placementScale() {
            const item = Items[this.type];
            if (21 === item.id) {
                return item.blocker*0.5;
            }
            return this.scale * 0.5 ;
        }
    }
    class SpatialHashGrid {
        cellSize;
        cells;
        constructor(cellSize) {
            this.cellSize = cellSize;
            this.cells = [];
        }
        hashPosition(x, y) {
            const cellX = Math.floor(x / this.cellSize);
            const cellY = Math.floor(y / this.cellSize);
            return [ cellX, cellY ];
        }
        clear() {
            this.cells.length = 0;
        }
        insert(object) {
            const {x, y} = object.position.current;
            const [cellX, cellY] = this.hashPosition(x, y);
            if (!this.cells[cellX]) {
                this.cells[cellX] = [];
            }
            if (!this.cells[cellX][cellY]) {
                this.cells[cellX][cellY] = [];
            }
            this.cells[cellX][cellY].push(object);
        }
        retrieve(position, radius) {
            const {x, y} = position;
            const [startX, startY] = this.hashPosition(x - radius, y - radius);
            const [endX, endY] = this.hashPosition(x + radius, y + radius);
            const results = [];
            for (let cellX = startX - 1; cellX <= endX + 1; cellX++) {
                for (let cellY = startY - 1; cellY <= endY + 1; cellY++) {
                    if (this.cells[cellX] && this.cells[cellX][cellY]) {
                        const objects = this.cells[cellX][cellY];
                        for (const object of objects) {
                            results.push(object);
                        }
                    }
                }
            }
            return results;
        }
        remove(object) {
            const {x, y} = object.position.current;
            const [cellX, cellY] = this.hashPosition(x, y);
            if (this.cells[cellX] && this.cells[cellX][cellY]) {
                const objects = this.cells[cellX][cellY];
                const index = objects.indexOf(object);
                if (-1 !== index) {
                    const lastIndex = objects.length - 1;
                    if (index === lastIndex) {
                        objects.pop();
                    } else {
                        objects[index] = objects.pop();
                    }
                    return true;
                }
            }
            return false;
        }
    }
    const modules_SpatialHashGrid = SpatialHashGrid;
    class EnemyManager {
        client;
        enemiesGrid=new modules_SpatialHashGrid(100);
        enemies=[];
        trappedEnemies=new Set;
        dangerousEnemies=[];
        _nearestEnemy=[ null, null ];
        nearestMeleeReloaded=null;
        nearestDangerAnimal=null;
        nearestTrap=null;
        nearestCollideSpike=null;
        nearestTurretEntity=null;
        detectedEnemy=false;
        constructor(client) {
            this.client = client;
        }
        reset() {
            this.enemiesGrid.clear();
            this.enemies.length = 0;
            this.trappedEnemies.clear();
            this.dangerousEnemies.length = 0;
            this._nearestEnemy[0] = null;
            this._nearestEnemy[1] = null;
            this.nearestMeleeReloaded = null;
            this.nearestDangerAnimal = null;
            this.nearestTrap = null;
            this.nearestCollideSpike = null;
            this.nearestTurretEntity = null;
            this.detectedEnemy = false;
        }
        get nearestEnemy() {
            return this._nearestEnemy[0];
        }
        get nearestAnimal() {
            return this._nearestEnemy[1];
        }
        isNear(enemy, nearest) {
            if (null === nearest) {
                return true;
            }
            const {myPlayer} = this.client;
            const a0 = myPlayer.position.current;
            const distance1 = a0.distance(enemy.position.current);
            const distance2 = a0.distance(nearest.position.current);
            return distance1 < distance2;
        }
        get nearestEntity() {
            const target1 = this.nearestEnemy;
            const target2 = this.nearestAnimal;
            if (null === target1) {
                return target2;
            }
            return this.isNear(target1, target2) ? target1 : target2;
        }
        nearestEnemyInRangeOf(range, target) {
            const enemy = target || this.nearestEnemy;
            return null !== enemy && this.client.myPlayer.collidingEntity(enemy, range);
        }
        handleNearestDanger(enemy) {
            const {myPlayer, ModuleHandler} = this.client;
            const extraRange = enemy.usingBoost && !enemy.isTrapped ? 400 : 100;
            const range = enemy.getMaxWeaponRange() + myPlayer.hitScale + extraRange;
            if (myPlayer.collidingEntity(enemy, range)) {
                if (enemy.danger >= 3) {
                    ModuleHandler.needToHeal = true;
                }
                this.detectedEnemy = true;
            }
        }
        handleDanger(enemy) {
            if (enemy.dangerList.length >= 2) {
                enemy.dangerList.shift();
            }
            const danger = enemy.canPossiblyInstakill();
            enemy.dangerList.push(danger);
            enemy.danger = Math.max(...enemy.dangerList);
            if (0 !== enemy.danger) {
                this.dangerousEnemies.push(enemy);
                this.handleNearestDanger(enemy);
            }
        }
        checkCollision(target, isOwner = false) {
            target.isTrapped = false;
            target.onPlatform = false;
            const {ObjectManager, PlayerManager} = this.client;
            const objects = ObjectManager.retrieveObjects(target.position.current, target.collisionScale);
            for (const object of objects) {
                if (object instanceof Resource) {
                    continue;
                }
                if (!target.collidingObject(object, 5)) {
                    continue;
                }
                const isEnemyObject = PlayerManager.isEnemyByID(object.ownerID, target);
                if (15 === object.type && isEnemyObject) {
                    this.trappedEnemies.add(target);
                    target.isTrapped = true;
                    if (isOwner && this.isNear(target, this.nearestTrap)) {
                        this.nearestTrap = object;
                    }
                } else if (18 === object.type) {
                    target.onPlatform = true;
                } else if (2 === object.itemGroup && isEnemyObject) {
                    if (!isOwner && this.isNear(target, this.nearestCollideSpike)) {
                        const pos1 = target.position.future;
                        const pos2 = object.position.current;
                        const distance = pos1.distance(pos2);
                        const range = object.collisionScale + target.collisionScale;
                        const willCollide = distance <= range;
                        if (willCollide) {
                            this.nearestCollideSpike = target;
                        }
                    }
                }
            }
        }
        handleNearest(type, enemy) {
            if (this.isNear(enemy, this._nearestEnemy[type])) {
                this._nearestEnemy[type] = enemy;
                if (enemy.canUseTurret && this.client.myPlayer.collidingEntity(enemy, 700)) {
                    this.nearestTurretEntity = enemy;
                }
            }
        }
        handleNearestMelee(enemy) {
            const {myPlayer, ModuleHandler} = this.client;
            const range = enemy.getMaxWeaponRange() + myPlayer.hitScale + 60;
            const angle = ModuleHandler.getMoveAngle();
            if (!enemy.meleeReloaded()) {
                return;
            }
            if (!myPlayer.collidingEntity(enemy, range)) {
                return;
            }
            if (!myPlayer.runningAwayFrom(enemy, angle)) {
                return;
            }
            if (!this.isNear(enemy, this.nearestMeleeReloaded)) {
                return;
            }
            this.nearestMeleeReloaded = enemy;
        }
        handleNearestDangerAnimal(animal) {
            const {myPlayer} = this.client;
            if (!animal.isDanger) {
                return;
            }
            if (!myPlayer.collidingEntity(animal, animal.collisionRange)) {
                return;
            }
            if (!this.isNear(animal, this.nearestDangerAnimal)) {
                return;
            }
            this.nearestDangerAnimal = animal;
        }
        handleEnemies(players, animals) {
            this.reset();
            const {myPlayer} = this.client;
            this.checkCollision(myPlayer, true);
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if (myPlayer.isEnemyByID(player.id)) {
                    this.enemiesGrid.insert(player);
                    this.enemies.push(player);
                    this.checkCollision(player);
                    this.handleDanger(player);
                    this.handleNearest(0, player);
                    this.handleNearestMelee(player);
                }
            }
            for (let i = 0; i < animals.length; i++) {
                const animal = animals[i];
                this.handleNearest(1, animal);
                this.handleNearestDangerAnimal(animal);
            }
        }
    }
    const Managers_EnemyManager = EnemyManager;
    class LeaderboardManager {
        client;
        list=new Set;
        constructor(client) {
            this.client = client;
        }
        updatePlayer(id, nickname, gold) {
            const owner = this.client.PlayerManager.playerData.get(id) || this.client.PlayerManager.createPlayer({
                id,
                nickname
            });
            this.list.add(owner);
            owner.totalGold = gold;
            owner.inLeaderboard = true;
        }
        update(data) {
            for (const player of this.list) {
                player.inLeaderboard = false;
            }
            this.list.clear();
            for (let i = 0; i < data.length; i += 3) {
                const id = data[i + 0];
                const nickname = data[i + 1];
                const gold = data[i + 2];
                this.updatePlayer(id, nickname, gold);
            }
        }
    }
    const Managers_LeaderboardManager = LeaderboardManager;
    const WeaponTypeString = [ "primary", "secondary" ];
    class Entity {
        id=-1;
        position={
            previous: new modules_Vector,
            current: new modules_Vector,
            future: new modules_Vector
        };
        angle=0;
        scale=0;
        setFuturePosition() {
            const {previous, current, future} = this.position;
            const distance = previous.distance(current);
            const angle = previous.angle(current);
            future.setVec(current.direction(angle, distance));
        }
        get collisionScale() {
            return this.scale;
        }
        get hitScale() {
            return 1.8 * this.scale;
        }
        client;
        constructor(client) {
            this.client = client;
        }
        colliding(object, radius) {
            const {previous: a0, current: a1, future: a2} = this.position;
            const b0 = object.position.current;
            return a0.distance(b0) <= radius || a1.distance(b0) <= radius || a2.distance(b0) <= radius;
        }
        collidingObject(object, addRadius = 0, checkPrevious = true) {
            const {previous: a0, current: a1, future: a2} = this.position;
            const b0 = object.position.current;
            const radius = this.collisionScale + object.collisionScale + addRadius;
            return checkPrevious && a0.distance(b0) <= radius || a1.distance(b0) <= radius || a2.distance(b0) <= radius;
        }
        collidingEntity(entity, range, checkBased = false, prev = true) {
            const {previous: a0, current: a1, future: a2} = this.position;
            const {previous: b0, current: b1, future: b2} = entity.position;
            if (checkBased) {
                return prev && a0.distance(b0) <= range || a1.distance(b1) <= range || a2.distance(b2) <= range;
            }
            return a0.distance(b0) <= range || a0.distance(b1) <= range || a0.distance(b2) <= range || a1.distance(b0) <= range || a1.distance(b1) <= range || a1.distance(b2) <= range || a2.distance(b0) <= range || a2.distance(b1) <= range || a2.distance(b2) <= range;
        }
        checkCollision(itemGroup, addRadius = 0, checkEnemy = false, checkPrevious = true) {
            const {ObjectManager} = this.client;
            const objects = ObjectManager.retrieveObjects(this.position.current, this.collisionScale);
            for (const object of objects) {
                const matchItem = object instanceof PlayerObject && object.itemGroup === itemGroup;
                const isCactus = object instanceof Resource && 2 === itemGroup && object.isCactus;
                if (matchItem || isCactus) {
                    if (checkEnemy && !ObjectManager.isEnemyObject(object)) {
                        continue;
                    }
                    if (this.collidingObject(object, addRadius, checkPrevious)) {
                        return true;
                    }
                }
            }
            return false;
        }
        runningAwayFrom(entity, angle) {
            if (null === angle) {
                return false;
            }
            const pos1 = this.position.current;
            const pos2 = entity.position.current;
            const angleTo = pos1.angle(pos2);
            if (getAngleDist(angle, angleTo) <= Math.PI / 2) {
                return false;
            }
            return true;
        }
    }
    const data_Entity = Entity;
    class Player extends data_Entity {
        socketID="";
        currentItem=-1;
        clanName=null;
        isLeader=false;
        nickname="unknown";
        skinID=0;
        scale=35;
        hatID=0;
        accessoryID=0;
        totalStorePrice=0;
        storeList=[ new Set, new Set ];
        previousHealth=100;
        currentHealth=100;
        tempHealth=100;
        maxHealth=100;
        globalInventory={};
        weapon={};
        variant={};
        reload={
            primary: {},
            secondary: {},
            turret: {}
        };
        objects=new Set;
        totalGold=0;
        inLeaderboard=false;
        newlyCreated=true;
        usingBoost=false;
        isTrapped=false;
        onPlatform=false;
        isFullyUpgraded=false;
        potentialDamage=0;
        foundProjectiles=new Map;
        dangerList=[];
        danger=0;
        constructor(client) {
            super(client);
            this.init();
        }
        hasFound(projectile) {
            const key = projectile.type;
            return this.foundProjectiles.has(key);
        }
        addFound(projectile) {
            const key = projectile.type;
            if (!this.foundProjectiles.has(key)) {
                this.foundProjectiles.set(key, []);
            }
            const list = this.foundProjectiles.get(key);
            list.push(projectile);
        }
        resetReload() {
            const {primary, secondary} = this.weapon;
            const primarySpeed = null !== primary ? this.getWeaponSpeed(primary) : -1;
            const secondarySpeed = null !== secondary ? this.getWeaponSpeed(secondary) : -1;
            const reload = this.reload;
            reload.primary.current = primarySpeed;
            reload.primary.max = primarySpeed;
            reload.secondary.current = secondarySpeed;
            reload.secondary.max = secondarySpeed;
            reload.turret.current = 2500;
            reload.turret.max = 2500;
        }
        resetGlobalInventory() {
            this.globalInventory[0] = null;
            this.globalInventory[1] = null;
            this.globalInventory[2] = null;
            this.globalInventory[3] = null;
            this.globalInventory[4] = null;
            this.globalInventory[5] = null;
            this.globalInventory[6] = null;
            this.globalInventory[7] = null;
            this.globalInventory[8] = null;
            this.globalInventory[9] = null;
        }
        init() {
            this.weapon.current = 0;
            this.weapon.oldCurrent = 0;
            this.weapon.primary = null;
            this.weapon.secondary = null;
            this.variant.current = 0;
            this.variant.primary = 0;
            this.variant.secondary = 0;
            this.resetReload();
            this.resetGlobalInventory();
            this.newlyCreated = true;
            this.usingBoost = false;
            this.isFullyUpgraded = false;
            this.foundProjectiles.clear();
        }
        get canUseTurret() {
            return 22 !== this.hatID;
        }
        update(id, x, y, angle, currentItem, currentWeapon, weaponVariant, clanName, isLeader, hatID, accessoryID, isSkull) {
            this.id = id;
            this.position.previous.setVec(this.position.current);
            this.position.current.setXY(x, y);
            this.setFuturePosition();
            this.angle = angle;
            this.currentItem = currentItem;
            this.weapon.oldCurrent = this.weapon.current;
            this.weapon.current = currentWeapon;
            this.variant.current = weaponVariant;
            this.clanName = clanName;
            this.isLeader = Boolean(isLeader);
            this.hatID = hatID;
            this.accessoryID = accessoryID;
            if (!this.storeList[0].has(hatID)) {
                this.storeList[0].add(hatID);
                this.totalStorePrice += Hats[hatID].price;
            }
            if (!this.storeList[1].has(accessoryID)) {
                this.storeList[1].add(accessoryID);
                this.totalStorePrice += Accessories[accessoryID].price;
            }
            this.newlyCreated = false;
            this.potentialDamage = 0;
            this.predictItems();
            this.predictWeapons();
            this.updateReloads();
        }
        updateHealth(health) {
            this.previousHealth = this.currentHealth;
            this.currentHealth = health;
            this.tempHealth = health;
        }
        predictItems() {
            if (-1 === this.currentItem) {
                return;
            }
            const item = Items[this.currentItem];
            this.globalInventory[item.itemType] = this.currentItem;
        }
        increaseReload(reload) {
            reload.current = Math.min(reload.current + this.client.PlayerManager.step, reload.max);
        }
        updateTurretReload() {
            const reload = this.reload.turret;
            this.increaseReload(reload);
            if (53 !== this.hatID) {
                return;
            }
            const {ProjectileManager} = this.client;
            const speed = Projectiles[1].speed;
            const list = ProjectileManager.projectiles.get(speed);
            if (void 0 === list) {
                return;
            }
            const current = this.position.current;
            for (let i = 0; i < list.length; i++) {
                const projectile = list[i];
                const distance = current.distance(projectile.position.current);
                if (distance < 2) {
                    if (this.hasFound(projectile)) {
                        this.foundProjectiles.clear();
                    }
                    this.addFound(projectile);
                    projectile.owner = this;
                    reload.current = 0;
                    removeFast(list, i);
                    break;
                }
            }
        }
        updateReloads() {
            this.updateTurretReload();
            if (-1 !== this.currentItem) {
                return;
            }
            const weapon = Weapons[this.weapon.current];
            const type = WeaponTypeString[weapon.itemType];
            const reload = this.reload[type];
            this.increaseReload(reload);
            if ("projectile" in weapon) {
                const {ProjectileManager} = this.client;
                const speedMult = this.getWeaponSpeedMult();
                const type = weapon.projectile;
                const speed = Projectiles[type].speed * speedMult;
                const list = ProjectileManager.projectiles.get(speed);
                if (void 0 === list) {
                    return;
                }
                const current = this.position.current;
                for (let i = 0; i < list.length; i++) {
                    const projectile = list[i];
                    const distance = current.distance(projectile.position.current);
                    if (distance < 2 && this.angle === projectile.angle) {
                        if (this.hasFound(projectile)) {
                            this.foundProjectiles.clear();
                        }
                        this.addFound(projectile);
                        projectile.owner = this;
                        reload.current = 0;
                        reload.max = this.getWeaponSpeed(weapon.id);
                        removeFast(list, i);
                        break;
                    }
                }
            }
        }
        handleObjectPlacement(object) {
            this.objects.add(object);
            const {myPlayer, ObjectManager} = this.client;
            const item = Items[object.type];
            if (object.seenPlacement) {
                if (17 === object.type) {
                    ObjectManager.resetTurret(object.id);
                } else if (16 === object.type && !this.newlyCreated) {
                    this.usingBoost = true;
                }
                this.updateInventory(object.type);
            }
            if (myPlayer.isMyPlayerByID(this.id) && 5 === item.itemType) {
                myPlayer.totalGoldAmount += item.pps;
            }
        }
        handleObjectDeletion(object) {
            this.objects.delete(object);
            const {myPlayer} = this.client;
            const item = Items[object.type];
            if (myPlayer.isMyPlayerByID(this.id) && 5 === item.itemType) {
                myPlayer.totalGoldAmount -= item.pps;
            }
        }
        updateInventory(type) {
            const item = Items[type];
            const inventoryID = this.globalInventory[item.itemType];
            const shouldUpdate = null === inventoryID || item.age > Items[inventoryID].age;
            if (shouldUpdate) {
                this.globalInventory[item.itemType] = item.id;
            }
        }
        detectFullUpgrade() {
            const inventory = this.globalInventory;
            const primary = inventory[0];
            const secondary = inventory[1];
            const spike = inventory[4];
            if (primary && secondary) {
                if ("isUpgrade" in Weapons[primary] && "isUpgrade" in Weapons[secondary]) {
                    return true;
                }
            }
            return primary && 8 === Weapons[primary].age || secondary && 9 === Weapons[secondary].age || spike && 9 === Items[spike].age || 12 === inventory[5] || 20 === inventory[9];
        }
        predictPrimary(id) {
            if (11 === id) {
                return 4;
            }
            return 5;
        }
        predictSecondary(id) {
            if (0 === id) {
                return null;
            }
            if (2 === id || 4 === id) {
                return 10;
            }
            return 15;
        }
        predictWeapons() {
            const {current, oldCurrent} = this.weapon;
            const weapon = Weapons[current];
            const type = WeaponTypeString[weapon.itemType];
            const reload = this.reload[type];
            const upgradedWeapon = current !== oldCurrent && weapon.itemType === Weapons[oldCurrent].itemType;
            if (-1 === reload.max || upgradedWeapon) {
                reload.current = weapon.speed;
                reload.max = weapon.speed;
            }
            this.globalInventory[weapon.itemType] = current;
            this.variant[type] = this.variant.current;
            const currentType = this.weapon[type];
            if (null === currentType || weapon.age > Weapons[currentType].age) {
                this.weapon[type] = current;
            }
            const primary = this.globalInventory[0];
            const secondary = this.globalInventory[1];
            const notPrimaryUpgrade = null === primary || !("isUpgrade" in Weapons[primary]);
            const notSecondaryUpgrade = null === secondary || !("isUpgrade" in Weapons[secondary]);
            if (utility_DataHandler.isSecondary(current) && notPrimaryUpgrade) {
                const predicted = this.predictPrimary(current);
                if (null === primary || Weapons[predicted].upgradeType === Weapons[primary].upgradeType) {
                    this.weapon.primary = predicted;
                }
            } else if (utility_DataHandler.isPrimary(current) && notSecondaryUpgrade) {
                const predicted = this.predictSecondary(current);
                if (null === predicted || null === secondary || Weapons[predicted].upgradeType === Weapons[secondary].upgradeType) {
                    this.weapon.secondary = predicted;
                }
            }
            this.isFullyUpgraded = this.detectFullUpgrade();
            if (this.isFullyUpgraded) {
                if (null !== primary) {
                    this.weapon.primary = primary;
                }
                if (null !== secondary) {
                    this.weapon.secondary = secondary;
                }
            }
        }
        getWeaponVariant(id) {
            const type = Weapons[id].itemType;
            const variant = this.variant[WeaponTypeString[type]];
            return {
                current: variant,
                next: Math.min(variant + 1, 3)
            };
        }
        getBuildingDamage(id) {
            const weapon = Weapons[id];
            const variant = WeaponVariants[this.getWeaponVariant(id).current];
            let damage = weapon.damage * variant.val;
            if ("sDmg" in weapon) {
                damage *= weapon.sDmg;
            }
            const hat = Hats[this.hatID];
            if ("bDmg" in hat) {
                damage *= hat.bDmg;
            }
            return damage;
        }
        canDealPoison(weaponID) {
            const variant = this.getWeaponVariant(weaponID).current;
            const isRuby = 3 === variant;
            const hasPlague = 21 === this.hatID;
            return {
                isAble: isRuby || hasPlague,
                count: isRuby ? 5 : hasPlague ? 6 : 0
            };
        }
        getWeaponSpeed(id, hat = this.hatID) {
            const reloadSpeed = 20 === hat ? Hats[hat].atkSpd : 1;
            return Weapons[id].speed * reloadSpeed;
        }
        getWeaponSpeedMult() {
            if (1 === this.hatID) {
                return Hats[this.hatID].aMlt;
            }
            return 1;
        }
        getMaxWeaponRange() {
            const {primary, secondary} = this.weapon;
            const primaryRange = Weapons[primary].range;
            if (utility_DataHandler.isMelee(secondary)) {
                const range = Weapons[secondary].range;
                if (range > primaryRange) {
                    return range;
                }
            }
            return primaryRange;
        }
        getMaxWeaponDamage(id, lookingShield) {
            if (utility_DataHandler.isMelee(id)) {
                const bull = Hats[7];
                const variant = this.getWeaponVariant(id).current;
                let damage = Weapons[id].damage;
                damage *= bull.dmgMultO;
                damage *= WeaponVariants[variant].val;
                if (lookingShield) {
                    damage *= Weapons[11].shield;
                }
                return damage;
            } else if (utility_DataHandler.isShootable(id) && !lookingShield) {
                const projectile = utility_DataHandler.getProjectile(id);
                return projectile.damage;
            }
            return 0;
        }
        getItemPlaceScale(itemID) {
            const item = Items[itemID];
            return this.scale + item.scale + item.placeOffset;
        }
        isReloaded(type, tick = 2 * this.client.SocketManager.TICK) {
            const reload = this.reload[type].current;
            const max = this.reload[type].max - tick;
            return reload >= max;
        }
        meleeReloaded() {
            const {TICK} = this.client.SocketManager;
            return this.isReloaded("primary", TICK) || utility_DataHandler.isMelee(this.weapon.secondary) && this.isReloaded("secondary", TICK);
        }
        detectSpikeInsta() {
            const {myPlayer, ObjectManager} = this.client;
            const spikeID = this.globalInventory[4] || 9;
            const placeLength = this.getItemPlaceScale(spikeID);
            const pos1 = this.position.current;
            const pos2 = myPlayer.position.current;
            const angleTo = pos1.angle(pos2);
            const angles = ObjectManager.getBestPlacementAngles(pos1, spikeID, angleTo);
            const spike = Items[spikeID];
            for (const angle of angles) {
                const spikePos = pos1.direction(angle, placeLength);
                const distance = pos2.distance(spikePos);
                const range = this.collisionScale + spike.scale;
                if (distance <= range) {
                    this.potentialDamage += spike.damage;
                    break;
                }
            }
        }
        canPossiblyInstakill() {
            const {PlayerManager, myPlayer} = myClient;
            const lookingShield = PlayerManager.lookingShield(myPlayer, this);
            const {primary, secondary} = this.weapon;
            const primaryDamage = this.getMaxWeaponDamage(primary, lookingShield);
            const secondaryDamage = this.getMaxWeaponDamage(secondary, lookingShield);
            if (this.isReloaded("primary")) {
                this.potentialDamage += primaryDamage;
            }
            if (this.isReloaded("secondary")) {
                const turrets = this.foundProjectiles.get(1);
                this.foundProjectiles.clear();
                if (void 0 !== turrets) {
                    this.foundProjectiles.set(1, turrets);
                }
                this.potentialDamage += secondaryDamage;
            }
            if (this.isReloaded("turret") && !lookingShield) {
                this.potentialDamage += 25;
            }
            this.detectSpikeInsta();
            if (this.potentialDamage * Hats[6].dmgMult >= 100) {
                return 3;
            }
            if (this.potentialDamage >= 100) {
                return 2;
            }
            return 0;
        }
    }
    const data_Player = Player;
    class Renderer {
        static objects=[];
        static rect(ctx, pos, scale, color, lineWidth = 4) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.translate(-myClient.myPlayer.offset.x, -myClient.myPlayer.offset.y);
            ctx.translate(pos.x, pos.y);
            ctx.rect(-scale, -scale, 2 * scale, 2 * scale);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        static roundRect(ctx, x, y, w, h, r) {
            if (w < 2 * r) {
                r = w / 2;
            }
            if (h < 2 * r) {
                r = h / 2;
            }
            if (r < 0) {
                r = 0;
            }
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }
        static circle(ctx, x, y, radius, color, opacity = 1, lineWidth = 4) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.translate(-myClient.myPlayer.offset.x, -myClient.myPlayer.offset.y);
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        static fillCircle(ctx, x, y, radius, color, opacity = 1) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.translate(-myClient.myPlayer.offset.x, -myClient.myPlayer.offset.y);
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        static line(ctx, start, end, color, opacity = 1, lineWidth = 4) {
            ctx.save();
            ctx.translate(-myClient.myPlayer.offset.x, -myClient.myPlayer.offset.y);
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = color;
            ctx.lineCap = "round";
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.restore();
        }
        static arrow(ctx, length, x, y, angle, color) {
            ctx.save();
            ctx.translate(-myClient.myPlayer.offset.x, -myClient.myPlayer.offset.y);
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4);
            ctx.rotate(angle);
            ctx.globalAlpha = .75;
            ctx.strokeStyle = color;
            ctx.lineCap = "round";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(-length, -length);
            ctx.lineTo(length, -length);
            ctx.lineTo(length, length);
            ctx.stroke();
            ctx.restore();
        }
        static cross(ctx, x, y, size, lineWidth, color) {
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.translate(x - myClient.myPlayer.offset.x, y - myClient.myPlayer.offset.y);
            const halfSize = size / 2;
            ctx.beginPath();
            ctx.moveTo(-halfSize, -halfSize);
            ctx.lineTo(halfSize, halfSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(halfSize, -halfSize);
            ctx.lineTo(-halfSize, halfSize);
            ctx.stroke();
            ctx.restore();
        }
        static getTracerColor(entity) {
            if (entity instanceof Notification) {
                return Settings.notificationTracersColor;
            }
            if (Settings.animalTracers && entity.isAI) {
                return Settings.animalTracersColor;
            }
            if (Settings.teammateTracers && entity.isPlayer && myClient.myPlayer.isTeammateByID(entity.sid)) {
                return Settings.teammateTracersColor;
            }
            if (Settings.enemyTracers && entity.isPlayer && myClient.myPlayer.isEnemyByID(entity.sid)) {
                return Settings.enemyTracersColor;
            }
            return null;
        }
        static renderTracer(ctx, entity, player) {
            const color = this.getTracerColor(entity);
            if (null === color) {
                return;
            }
            const pos1 = new modules_Vector(player.x, player.y);
            const pos2 = new modules_Vector(entity.x, entity.y);
            if (Settings.arrows) {
                const w = 8;
                const distance = Math.min(100 + 2 * w, pos1.distance(pos2) - 2 * w);
                const angle = pos1.angle(pos2);
                const pos = pos1.direction(angle, distance);
                this.arrow(ctx, w, pos.x, pos.y, angle, color);
            } else {
                this.line(ctx, pos1, pos2, color, .75);
            }
        }
        static getMarkerColor(object) {
            const id = object.owner?.sid;
            if (void 0 === id) {
                return null;
            }
            if (Settings.itemMarkers && myClient.myPlayer.isMyPlayerByID(id)) {
                return Settings.itemMarkersColor;
            }
            if (Settings.teammateMarkers && myClient.myPlayer.isTeammateByID(id)) {
                return Settings.teammateMarkersColor;
            }
            if (Settings.enemyMarkers && myClient.myPlayer.isEnemyByID(id)) {
                return Settings.enemyMarkersColor;
            }
            return null;
        }
        static renderMarker(ctx, object) {
            const color = this.getMarkerColor(object);
            if (null === color) {
                return;
            }
            const x = object.x + object.xWiggle - myClient.myPlayer.offset.x;
            const y = object.y + object.yWiggle - myClient.myPlayer.offset.y;
            ctx.save();
            ctx.strokeStyle = "#3b3b3b";
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        static barContainer(ctx, x, y, w, h, r = 8) {
            ctx.fillStyle = "#3d3f42";
            this.roundRect(ctx, x, y, w, h, r);
            ctx.fill();
        }
        static barContent(ctx, x, y, w, h, fill, color) {
            const barPad = constants_Config.barPad;
            ctx.fillStyle = color;
            this.roundRect(ctx, x + barPad, y + barPad, (w - 2 * barPad) * fill, h - 2 * barPad, 7);
            ctx.fill();
        }
        static getNameY(target) {
            let nameY = 34;
            const height = 5;
            if (target === myClient.myPlayer && Settings.weaponXPBar) {
                nameY += height;
            }
            if (Settings.playerTurretReloadBar) {
                nameY += height;
            }
            if (Settings.weaponReloadBar) {
                nameY += height;
            }
            return nameY;
        }
        static getContainerHeight(entity) {
            const {barHeight, barPad} = constants_Config;
            let height = barHeight;
            if (entity.isPlayer) {
                const smallBarHeight = barHeight - 4;
                const player = myClient.PlayerManager.playerData.get(entity.sid);
                if (void 0 === player) {
                    return height;
                }
                if (player === myClient.myPlayer && Settings.weaponXPBar) {
                    height += smallBarHeight - barPad;
                }
                if (Settings.playerTurretReloadBar) {
                    height += smallBarHeight - barPad;
                }
                if (Settings.weaponReloadBar) {
                    height += barHeight - barPad;
                }
            }
            return height;
        }
        static renderBar(ctx, entity) {
            const {barWidth, barHeight, barPad} = constants_Config;
            const smallBarHeight = barHeight - 4;
            const totalWidth = barWidth + barPad;
            const scale = entity.scale + 34;
            const {myPlayer, PlayerManager} = myClient;
            let x = entity.x - myPlayer.offset.x - totalWidth;
            let y = entity.y - myPlayer.offset.y + scale;
            ctx.save();
            const player = entity.isPlayer && PlayerManager.playerData.get(entity.sid);
            const animal = entity.isAI && PlayerManager.animalData.get(entity.sid);
            let height = 0;
            if (player instanceof data_Player) {
                const {primary, secondary, turret} = player.reload;
                if (player === myPlayer && Settings.weaponXPBar) {
                    const weapon = Weapons[myPlayer.weapon.current];
                    const current = WeaponVariants[myPlayer.getWeaponVariant(weapon.id).current].color;
                    const next = WeaponVariants[myPlayer.getWeaponVariant(weapon.id).next].color;
                    const XP = myPlayer.weaponXP[weapon.itemType];
                    this.barContainer(ctx, x, y, 2 * totalWidth, smallBarHeight);
                    this.barContent(ctx, x, y, 2 * totalWidth, smallBarHeight, 1, current);
                    this.barContent(ctx, x, y, 2 * totalWidth, smallBarHeight, clamp(XP.current / XP.max, 0, 1), next);
                    height += smallBarHeight - barPad;
                }
                if (Settings.playerTurretReloadBar) {
                    this.barContainer(ctx, x, y + height, 2 * totalWidth, smallBarHeight);
                    this.barContent(ctx, x, y + height, 2 * totalWidth, smallBarHeight, turret.current / turret.max, Settings.playerTurretReloadBarColor);
                    height += smallBarHeight - barPad;
                }
                if (Settings.weaponReloadBar) {
                    const extraPad = 2.25;
                    this.barContainer(ctx, x, y + height, 2 * totalWidth, barHeight);
                    this.barContent(ctx, x, y + height, totalWidth + extraPad, barHeight, primary.current / primary.max, Settings.weaponReloadBarColor);
                    this.barContent(ctx, x + totalWidth - extraPad, y + height, totalWidth + extraPad, barHeight, secondary.current / secondary.max, Settings.weaponReloadBarColor);
                    height += barHeight - barPad;
                }
            }
            const target = player || animal;
            if (target) {
                window.config.nameY = this.getNameY(target);
                const {currentHealth, maxHealth} = target;
                const health = animal ? maxHealth : 100;
                const color = PlayerManager.isEnemyTarget(myPlayer, target) ? "#cc5151" : "#8ecc51";
                this.barContainer(ctx, x, y + height, 2 * totalWidth, barHeight);
                this.barContent(ctx, x, y + height, 2 * totalWidth, barHeight, currentHealth / health, color);
                height += barHeight;
            }
            ctx.restore();
        }
        static renderHP(ctx, entity) {
            if (!Settings.renderHP) {
                return;
            }
            const {barPad, nameY} = constants_Config;
            const containerHeight = this.getContainerHeight(entity);
            let text = `HP ${Math.floor(entity.health)}/${entity.maxHealth}`;
            const offset = entity.scale + nameY + barPad + containerHeight;
            const {myPlayer} = myClient;
            const x = entity.x - myPlayer.offset.x;
            const y = entity.y - myPlayer.offset.y + offset;
            if (entity.isPlayer && myPlayer.isMyPlayerByID(entity.sid)) {
                text += ` ${myPlayer.shameCount}/8`;
            }
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#3d3f42";
            ctx.lineWidth = 8;
            ctx.lineJoin = "round";
            ctx.textBaseline = "top";
            ctx.font = `19px Hammersmith One`;
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
            ctx.restore();
        }
        static circularBar(ctx, object, perc, angle, color, offset = 0) {
            const x = object.x + object.xWiggle - myClient.myPlayer.offset.x;
            const y = object.y + object.yWiggle - myClient.myPlayer.offset.y;
            const height = .7 * constants_Config.barHeight;
            const defaultScale = 10 + height / 2;
            const scale = defaultScale + 3 + offset;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.lineCap = "round";
            ctx.strokeStyle = "#3b3b3b";
            ctx.lineWidth = height;
            ctx.beginPath();
            ctx.arc(0, 0, scale, 0, 2 * perc * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = color;
            ctx.lineWidth = height / 3;
            ctx.beginPath();
            ctx.arc(0, 0, scale, 0, 2 * perc * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            return defaultScale - 3;
        }
    }
    const rendering_Renderer = Renderer;
    const Animals = [ {
        id: 0,
        src: "cow_1",
        hostile: false,
        killScore: 150,
        health: 500,
        weightM: .8,
        speed: 95e-5,
        turnSpeed: .001,
        scale: 72,
        drop: [ "food", 50 ]
    }, {
        id: 1,
        src: "pig_1",
        hostile: false,
        killScore: 200,
        health: 800,
        weightM: .6,
        speed: 85e-5,
        turnSpeed: .001,
        scale: 72,
        drop: [ "food", 80 ]
    }, {
        id: 2,
        name: "Bull",
        src: "bull_2",
        hostile: true,
        dmg: 20,
        killScore: 1e3,
        health: 1800,
        weightM: .5,
        speed: 94e-5,
        turnSpeed: 74e-5,
        scale: 78,
        viewRange: 800,
        chargePlayer: true,
        drop: [ "food", 100 ]
    }, {
        id: 3,
        name: "Bully",
        src: "bull_1",
        hostile: true,
        dmg: 20,
        killScore: 2e3,
        health: 2800,
        weightM: .45,
        speed: .001,
        turnSpeed: 8e-4,
        scale: 90,
        viewRange: 900,
        chargePlayer: true,
        drop: [ "food", 400 ]
    }, {
        id: 4,
        name: "Wolf",
        src: "wolf_1",
        hostile: true,
        dmg: 8,
        killScore: 500,
        health: 300,
        weightM: .45,
        speed: .001,
        turnSpeed: .002,
        scale: 84,
        viewRange: 800,
        chargePlayer: true,
        drop: [ "food", 200 ]
    }, {
        id: 5,
        name: "Quack",
        src: "chicken_1",
        hostile: false,
        dmg: 8,
        killScore: 2e3,
        noTrap: true,
        health: 300,
        weightM: .2,
        speed: .0018,
        turnSpeed: .006,
        scale: 70,
        drop: [ "food", 100 ]
    }, {
        id: 6,
        name: "MOOSTAFA",
        nameScale: 50,
        src: "enemy",
        hostile: true,
        dontRun: true,
        fixedSpawn: true,
        spawnDelay: 6e4,
        noTrap: true,
        colDmg: 100,
        dmg: 40,
        killScore: 8e3,
        health: 18e3,
        weightM: .4,
        speed: 7e-4,
        turnSpeed: .01,
        scale: 80,
        spriteMlt: 1.8,
        leapForce: .9,
        viewRange: 1e3,
        hitRange: 210,
        hitDelay: 1e3,
        chargePlayer: true,
        drop: [ "food", 100 ]
    }, {
        id: 7,
        name: "Treasure",
        hostile: true,
        nameScale: 35,
        src: "crate_1",
        fixedSpawn: true,
        spawnDelay: 12e4,
        colDmg: 200,
        killScore: 5e3,
        health: 2e4,
        weightM: .1,
        speed: 0,
        turnSpeed: 0,
        scale: 70,
        spriteMlt: 1
    }, {
        id: 8,
        name: "MOOFIE",
        src: "wolf_2",
        hostile: true,
        fixedSpawn: true,
        dontRun: true,
        hitScare: 4,
        spawnDelay: 3e4,
        noTrap: true,
        nameScale: 35,
        dmg: 10,
        colDmg: 100,
        killScore: 3e3,
        health: 7e3,
        weightM: .45,
        speed: .0015,
        turnSpeed: .002,
        scale: 90,
        viewRange: 800,
        chargePlayer: true,
        drop: [ "food", 1e3 ]
    }, {
        id: 9,
        name: "💀MOOFIE",
        src: "wolf_2",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        spawnDelay: 6e4,
        noTrap: !0,
        nameScale: 35,
        dmg: 12,
        colDmg: 100,
        killScore: 3e3,
        health: 9e3,
        weightM: .45,
        speed: .0015,
        turnSpeed: .0025,
        scale: 94,
        viewRange: 1440,
        chargePlayer: !0,
        drop: [ "food", 3e3 ],
        minSpawnRange: .85,
        maxSpawnRange: .9
    }, {
        id: 10,
        name: "💀Wolf",
        src: "wolf_1",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        spawnDelay: 3e4,
        dmg: 10,
        killScore: 700,
        health: 500,
        weightM: .45,
        speed: .00115,
        turnSpeed: .0025,
        scale: 88,
        viewRange: 1440,
        chargePlayer: !0,
        drop: [ "food", 400 ],
        minSpawnRange: .85,
        maxSpawnRange: .9
    }, {
        id: 11,
        name: "💀Bully",
        src: "bull_1",
        hostile: !0,
        fixedSpawn: !0,
        dontRun: !0,
        hitScare: 50,
        dmg: 20,
        killScore: 5e3,
        health: 5e3,
        spawnDelay: 1e5,
        weightM: .45,
        speed: .00115,
        turnSpeed: .0025,
        scale: 94,
        viewRange: 1440,
        chargePlayer: !0,
        drop: [ "food", 800 ],
        minSpawnRange: .85,
        maxSpawnRange: .9
    } ];
    const constants_Animals = Animals;
    const colors = [ [ "orange", "red" ], [ "aqua", "blue" ] ];
    const EntityRenderer = new class EntityRenderer {
        start=Date.now();
        step=0;
        drawWeaponHitbox(ctx, player) {
            if (!Settings.weaponHitbox) {
                return;
            }
            const {myPlayer, ModuleHandler} = myClient;
            const current = myPlayer.getItemByType(ModuleHandler.weapon);
            if (utility_DataHandler.isMelee(current)) {
                const weapon = Weapons[current];
                rendering_Renderer.circle(ctx, player.x, player.y, weapon.range, "#f5cb42", 1, 1);
            }
        }
        drawPlacement(ctx) {
            if (!Settings.possiblePlacement) {
                return;
            }
            const {myPlayer, ModuleHandler, ObjectManager} = myClient;
            const id = myPlayer.getItemByType(7);
            if (null === id) {
                return;
            }
            const angles = ObjectManager.getBestPlacementAngles(myPlayer.position.current, id);
            const dist = myPlayer.getItemPlaceScale(id);
            const item = Items[id];
            for (const angle of angles) {
                const pos = myPlayer.position.current.direction(angle, dist);
                rendering_Renderer.circle(ctx, pos.x, pos.y, item.scale, "purple", 1, 1);
            }
        }
        drawEntityHP(ctx, entity) {
            if (entity.isPlayer) {
                if (Settings.turretHitbox && 53 === myClient.myPlayer.hatID) {
                    rendering_Renderer.circle(ctx, entity.x, entity.y, 700, "#3e2773", 1, 1);
                }
            }
            rendering_Renderer.renderBar(ctx, entity);
            rendering_Renderer.renderHP(ctx, entity);
        }
        drawHitScale(ctx, entity) {
            if (!Settings.weaponHitbox) {
                return;
            }
            const {PlayerManager} = myClient;
            const type = entity.isPlayer ? PlayerManager.playerData : PlayerManager.animalData;
            const target = type.get(entity.sid);
            if (void 0 !== target) {
                rendering_Renderer.circle(ctx, entity.x, entity.y, target.hitScale, "#3f4ec4", 1, 1);
            }
            if (entity.isAI && 6 === entity.index) {
                const moostafa = constants_Animals[6];
                rendering_Renderer.circle(ctx, entity.x, entity.y, moostafa.hitRange, "#f5cb42", 1, 1);
            }
        }
        drawDanger(ctx, entity) {
            if (!Settings.entityDanger) {
                return;
            }
            const {PlayerManager} = myClient;
            if (entity.isPlayer) {
                const player = PlayerManager.playerData.get(entity.sid);
                if (void 0 !== player && 0 !== player.danger) {
                    const isBoost = Number(player.usingBoost);
                    const isDanger = Number(player.danger >= 3);
                    rendering_Renderer.fillCircle(ctx, entity.x, entity.y, player.scale, colors[isBoost][isDanger], .35);
                }
            }
            if (entity.isAI) {
                const animal = PlayerManager.animalData.get(entity.sid);
                const color = animal.isDanger ? "red" : "green";
                rendering_Renderer.fillCircle(ctx, entity.x, entity.y, animal.attackRange, color, .3);
            }
        }
        render(ctx, entity, player) {
            const now = Date.now();
            this.step = now - this.start;
            this.start = now;
            const {myPlayer, EnemyManager} = myClient;
            const isMyPlayer = entity === player;
            if (isMyPlayer) {
                const pos = new modules_Vector(player.x, player.y);
                if (Settings.displayPlayerAngle) {
                    rendering_Renderer.line(ctx, pos, pos.direction(myClient.myPlayer.angle, 70), "#ff7f50");
                }
                this.drawWeaponHitbox(ctx, player);
                this.drawPlacement(ctx);
                const secondary = myPlayer.weapon.current;
                const enemy = EnemyManager.nearestEnemy;
                if (Settings.projectileHitbox && utility_DataHandler.isShootable(secondary) && enemy) {
                    rendering_Renderer.circle(ctx, entity.x, entity.y, 700, "#3e2773", 1, 1);
                }
                if (myPlayer.isTrapped) {
                    rendering_Renderer.fillCircle(ctx, pos.x, pos.y, 35, "yellow", .5);
                }
            }
            this.drawEntityHP(ctx, entity);
            if (Settings.collisionHitbox) {
                rendering_Renderer.circle(ctx, entity.x, entity.y, entity.scale, "#c7fff2", 1, 1);
            }
            if (!isMyPlayer) {
                const willCollide = EnemyManager.nearestCollideSpike;
                if (willCollide && !entity.isAI && myPlayer.isEnemyByID(entity.sid) && entity.sid === willCollide.id) {
                    rendering_Renderer.circle(ctx, entity.x, entity.y, entity.scale, "#691313", 1, 13);
                }
                this.drawHitScale(ctx, entity);
                this.drawDanger(ctx, entity);
                rendering_Renderer.renderTracer(ctx, entity, player);
            }
            if (isMyPlayer) {
                rendering_NotificationRenderer.render(ctx, player);
            }
        }
    };
    const rendering_EntityRenderer = EntityRenderer;
    class Notification {
        x;
        y;
        timeout={
            value: 0,
            max: 1500
        };
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        animate() {
            const {value, max} = this.timeout;
            if (value >= max) {
                NotificationRenderer.remove(this);
                return;
            }
            this.timeout.value += rendering_EntityRenderer.step;
        }
        render(ctx, player) {
            this.animate();
            rendering_Renderer.renderTracer(ctx, this, player);
        }
    }
    const NotificationRenderer = new class NotificationRenderer {
        notifications=new Set;
        remove(notify) {
            this.notifications.delete(notify);
        }
        add(object) {
            const {x, y} = object.position.current;
            const notify = new Notification(x, y);
            this.notifications.add(notify);
        }
        render(ctx, player) {
            for (const notification of this.notifications) {
                notification.render(ctx, player);
            }
        }
    };
    const rendering_NotificationRenderer = NotificationRenderer;
    class ObjectManager {
        objects=new Map;
        grid=new modules_SpatialHashGrid(100);
        reloadingTurrets=new Map;
        attackedObjects=new Map;
        client;
        constructor(client) {
            this.client = client;
        }
        insertObject(object) {
            this.grid.insert(object);
            this.objects.set(object.id, object);
            if (object instanceof PlayerObject) {
                const {PlayerManager} = this.client;
                const owner = PlayerManager.playerData.get(object.ownerID) || PlayerManager.createPlayer({
                    id: object.ownerID
                });
                object.seenPlacement = this.inPlacementRange(object);
                owner.handleObjectPlacement(object);
            }
        }
        createObjects(buffer) {
            for (let i = 0; i < buffer.length; i += 8) {
                const isResource = null === buffer[i + 6];
                const data = [ buffer[i + 0], buffer[i + 1], buffer[i + 2], buffer[i + 3], buffer[i + 4] ];
                this.insertObject(isResource ? new Resource(...data, buffer[i + 5]) : new PlayerObject(...data, buffer[i + 6], buffer[i + 7]));
            }
        }
        removeObject(object) {
            this.grid.remove(object);
            this.objects.delete(object.id);
            if (object instanceof PlayerObject) {
                const player = this.client.PlayerManager.playerData.get(object.ownerID);
                if (void 0 !== player) {
                    player.handleObjectDeletion(object);
                }
            }
        }
        removeObjectByID(id) {
            const object = this.objects.get(id);
            if (void 0 !== object) {
                this.removeObject(object);
                if (this.client.isOwner) {
                    const pos = object.position.current.copy().sub(this.client.myPlayer.offset);
                    if (Settings.notificationTracers && !inView(pos.x, pos.y, object.scale)) {
                        rendering_NotificationRenderer.add(object);
                    }
                }
            }
        }
        removePlayerObjects(player) {
            for (const object of player.objects) {
                this.removeObject(object);
            }
        }
        resetTurret(id) {
            const object = this.objects.get(id);
            if (object instanceof PlayerObject) {
                object.reload = 0;
                this.reloadingTurrets.set(id, object);
            }
        }
        isEnemyObject(object) {
            if (object instanceof PlayerObject && !this.client.myPlayer.isEnemyByID(object.ownerID)) {
                return false;
            }
            return true;
        }
        isTurretReloaded(object) {
            const turret = this.reloadingTurrets.get(object.id);
            if (void 0 === turret) {
                return true;
            }
            const tick = this.client.SocketManager.TICK;
            return turret.reload > turret.maxReload - tick;
        }
        postTick() {
            for (const [id, turret] of this.reloadingTurrets) {
                turret.reload += this.client.PlayerManager.step;
                if (turret.reload >= turret.maxReload) {
                    turret.reload = turret.maxReload;
                    this.reloadingTurrets.delete(id);
                }
            }
        }
        retrieveObjects(pos, radius) {
            return this.grid.retrieve(pos, radius);
        }
        canPlaceItem(id, position, addRadius = 0) {
            if (18 !== id && pointInRiver(position)) {
                return false;
            }
            const item = Items[id];
            const objects = this.retrieveObjects(position, item.scale);
            for (const object of objects) {
                const scale = item.scale + object.placementScale + addRadius;
                if (position.distance(object.position.current) < scale) {
                    return false;
                }
            }
            return true;
        }
        inPlacementRange(object) {
            const owner = this.client.PlayerManager.playerData.get(object.ownerID);
            if (void 0 === owner || !this.client.PlayerManager.players.includes(owner)) {
                return false;
            }
            const {previous: a0, current: a1, future: a2} = owner.position;
            const b0 = object.position.current;
            const item = Items[object.type];
            const range = 2 * owner.scale + item.scale + item.placeOffset;
            return a0.distance(b0) <= range || a1.distance(b0) <= range || a2.distance(b0) <= range;
        }
        getAngleOffset(angle, distance, scale) {}
        getBestPlacementAngles(position, id, sortAngle = 0) {
            const item = Items[id];
            const length = this.client.myPlayer.getItemPlaceScale(id);
            const objects = this.retrieveObjects(position, length + item.scale);
            const angles = [];
            for (const object of objects) {
                const angle = position.angle(object.position.current);
                const distance = position.distance(object.position.current);
                const a = object.placementScale + item.scale;
                const b = distance;
                const c = length;
                const offset = Math.acos((a ** 2 - b ** 2 - c ** 2) / (-2 * b * c));
                if (!isNaN(offset)) {
                    angles.push({
                        angle,
                        offset
                    });
                }
            }
            return findPlacementAngles(angles);
        }
    }
    const Managers_ObjectManager = ObjectManager;
    class Animal extends data_Entity {
        type=-1;
        currentHealth=0;
        _maxHealth=0;
        nameIndex=0;
        isDanger=false;
        isHostile=false;
        constructor(client) {
            super(client);
        }
        get maxHealth() {
            return this._maxHealth;
        }
        canBeTrapped() {
            return !("noTrap" in constants_Animals[this.type]);
        }
        update(id, type, x, y, angle, health, nameIndex) {
            this.id = id;
            this.type = type;
            this.position.previous.setVec(this.position.current);
            this.position.current.setXY(x, y);
            this.setFuturePosition();
            const animal = constants_Animals[type];
            this.angle = angle;
            this.currentHealth = health;
            this._maxHealth = animal.health;
            this.nameIndex = nameIndex;
            this.scale = animal.scale;
            const isHostile = animal.hostile && 7 !== type;
            const isTrapped = this.canBeTrapped() && this.checkCollision(5);
            this.isHostile = animal.hostile;
            this.isDanger = isHostile && !isTrapped;
        }
        get attackRange() {
            if (6 === this.type) {
                return constants_Animals[this.type].hitRange + constants_Config.playerScale;
            }
            return this.scale;
        }
        get collisionRange() {
            if (6 === this.type) {
                return constants_Animals[this.type].hitRange + constants_Config.playerScale;
            }
            return this.scale + 60;
        }
        get canUseTurret() {
            return this.isHostile;
        }
    }
    const data_Animal = Animal;
    class ClientPlayer extends data_Player {
        inventory={};
        weaponXP=[ {}, {} ];
        itemCount=new Map;
        resources={};
        tempGold=0;
        deathPosition=new modules_Vector;
        offset=new modules_Vector;
        inGame=false;
        wasDead=true;
        diedOnce=false;
        platformActivated=false;
        receivedDamage=null;
        timerCount=1e3 / 9;
        shameActive=false;
        shameTimer=0;
        shameCount=0;
        teammates=new Set;
        totalGoldAmount=0;
        age=1;
        upgradeAge=1;
        poisonCount=0;
        underTurretAttack=false;
        upgradeOrder=[];
        upgradeIndex=0;
        joinRequests=[];
        constructor(client) {
            super(client);
            this.reset(true);
        }
        isMyPlayerByID(id) {
            return id === this.id;
        }
        isTeammateByID(id) {
            return this.teammates.has(id);
        }
        isEnemyByID(id) {
            return !this.isMyPlayerByID(id) && !this.isTeammateByID(id);
        }
        get isSandbox() {
            return true;
        }
        getItemByType(type) {
            return this.inventory[type];
        }
        hasResourcesForType(type) {
            if (this.isSandbox) {
                return true;
            }
            const res = this.resources;
            const {food, wood, stone, gold} = Items[this.getItemByType(type)].cost;
            return res.food >= food && res.wood >= wood && res.stone >= stone && res.gold >= gold;
        }
        getItemCount(group) {
            const item = ItemGroups[group];
            return {
                count: this.itemCount.get(group) || 0,
                limit: this.item.limit
            };
        }
        hasItemCountForType(type) {
            if (2 === type) {
                return true;
            }
            const item = Items[this.getItemByType(type)];
            const {count, limit} = this.getItemCount(item.itemGroup);
            return count < limit;
        }
        canPlace(type) {
            return null !== type && null !== this.getItemByType(type) && this.hasResourcesForType(type) && this.hasItemCountForType(type);
        }
        getBestDestroyingWeapon() {
            const secondaryID = this.getItemByType(1);
            if (10 === secondaryID) {
                return 1;
            }
            const primary = Weapons[this.getItemByType(0)];
            if (1 !== primary.damage) {
                return 0;
            }
            return null;
        }
        getDmgOverTime() {
            const hat = Hats[this.hatID];
            const accessory = Accessories[this.accessoryID];
            let damage = 0;
            if ("healthRegen" in hat) {
                damage += hat.healthRegen;
            }
            if ("healthRegen" in accessory) {
                damage += accessory.healthRegen;
            }
            if (0 !== this.poisonCount) {
                damage += -5;
            }
            return Math.abs(damage);
        }
        getBestCurrentHat() {
            const {current, future} = this.position;
            const {ModuleHandler, EnemyManager} = this.client;
            const {actual} = ModuleHandler.getHatStore();
            const useFlipper = ModuleHandler.canBuy(0, 31);
            const useSoldier = ModuleHandler.canBuy(0, 6);
            const useWinter = ModuleHandler.canBuy(0, 15);
            const useActual = ModuleHandler.canBuy(0, actual);
            if (Settings.biomehats && useFlipper) {
                const inRiver = pointInRiver(current) || pointInRiver(future);
                if (inRiver) {
                    const platformActivated = this.checkCollision(8, -30);
                    const stillStandingOnPlatform = this.checkCollision(8, 15);
                    if (!this.platformActivated && platformActivated) {
                        this.platformActivated = true;
                    }
                    if (this.platformActivated && !stillStandingOnPlatform) {
                        this.platformActivated = false;
                    }
                    if (!this.platformActivated) {
                        return 31;
                    }
                }
            }
            if (useSoldier) {
                if (Settings.antienemy && (EnemyManager.detectedEnemy || EnemyManager.nearestEnemyInRangeOf(275))) {
                    return 6;
                }
                if (Settings.antispike && this.checkCollision(2, 35, true)) {
                    return 6;
                }
                if (Settings.antianimal && null !== EnemyManager.nearestDangerAnimal) {
                    return 6;
                }
            }
            if (Settings.biomehats && useWinter) {
                const inWinter = current.y <= 2400 || future.y <= 2400;
                if (inWinter) {
                    return 15;
                }
            }
            if (useActual) {
                return actual;
            }
            return 0;
        }
        getBestCurrentAcc() {
            const {ModuleHandler, EnemyManager} = this.client;
            const {actual} = ModuleHandler.getAccStore();
            const useCorrupt = ModuleHandler.canBuy(1, 21);
            const useShadow = ModuleHandler.canBuy(1, 19);
            const useTail = ModuleHandler.canBuy(1, 11);
            const useActual = ModuleHandler.canBuy(1, actual);
            if (EnemyManager.detectedEnemy || EnemyManager.nearestEnemyInRangeOf(275, EnemyManager.nearestEntity)) {
                const isEnemy = EnemyManager.nearestEnemyInRangeOf(275, EnemyManager.nearestEnemy);
                if (isEnemy && useCorrupt) {
                    return 21;
                }
                if (useShadow) {
                    return 19;
                }
                if (useActual && 11 !== actual) {
                    return actual;
                }
                return 0;
            }
            if (useTail) {
                return 11;
            }
            return 0;
        }
        getBestCurrentID(type) {
            switch (type) {
              case 0:
                return this.getBestCurrentHat();

              case 1:
                return this.getBestCurrentAcc();
            }
        }
        getBestUtilityHat() {
            const {ModuleHandler, EnemyManager, ObjectManager, myPlayer} = this.client;
            const {autoBreak, spikeTick} = ModuleHandler.staticModules;
            const id = this.getItemByType(ModuleHandler.weapon);
            if (11 === id) {
                return null;
            }
            if (utility_DataHandler.isShootable(id)) {
                return 20;
            }
            const weapon = Weapons[id];
            const range = weapon.range + 60;
            if (spikeTick.isActive && 1 === spikeTick.tickAction) {
                return 53;
            }
            if (1 === ModuleHandler.attackingState || spikeTick.isActive) {
                const nearest = EnemyManager.nearestEntity;
                if (null !== nearest && this.collidingEntity(nearest, range + nearest.hitScale, true)) {
                    ModuleHandler.canHitEntity = true;
                    if (weapon.damage <= 1) {
                        return 20;
                    }
                    return 7;
                }
            }
            if (0 !== ModuleHandler.attackingState || autoBreak.isActive) {
                if (weapon.damage <= 1) {
                    return null;
                }
                const pos = myPlayer.position.current;
                const objects = ObjectManager.retrieveObjects(pos, range);
                for (const object of objects) {
                    if (object instanceof PlayerObject && object.isDestroyable && this.colliding(object, range + object.hitScale)) {
                        return 40;
                    }
                }
            }
            return null;
        }
        getBestUtilityAcc() {
            return null;
        }
        getBestUtilityID(type) {
            switch (type) {
              case 0:
                return this.getBestUtilityHat();

              case 1:
                return this.getBestUtilityAcc();
            }
        }
        getMaxWeaponRangeClient() {
            const primary = this.inventory[0];
            const secondary = this.inventory[1];
            const primaryRange = Weapons[primary].range;
            if (utility_DataHandler.isMelee(secondary)) {
                const range = Weapons[secondary].range;
                if (range > primaryRange) {
                    return range;
                }
            }
            return primaryRange;
        }
        getPlacePosition(start, itemID, angle) {
            return start.direction(angle, this.getItemPlaceScale(itemID));
        }
        tickUpdate() {
            if (this.inGame && this.wasDead) {
                this.wasDead = false;
                this.onFirstTickAfterSpawn();
            }
            if (45 === this.hatID && !this.shameActive) {
                this.shameActive = true;
                this.shameTimer = 0;
                this.shameCount = 8;
            }
            const {PlayerManager, ModuleHandler} = this.client;
            this.shameTimer += PlayerManager.step;
            if (this.shameTimer >= 3e4 && this.shameActive) {
                this.shameActive = false;
                this.shameTimer = 0;
                this.shameCount = 0;
            }
            this.timerCount += PlayerManager.step;
            if (this.timerCount >= 1e3) {
                this.timerCount = 0;
                this.poisonCount = Math.max(this.poisonCount - 1, 0);
            }
            ModuleHandler.postTick();
        }
        updateHealth(health) {
            super.updateHealth(health);
            if (this.shameActive) {
                return;
            }
            if (this.currentHealth < this.previousHealth) {
                this.receivedDamage = Date.now();
            } else if (null !== this.receivedDamage) {
                const step = Date.now() - this.receivedDamage;
                this.receivedDamage = null;
                if (step <= 120) {
                    this.shameCount += 1;
                } else {
                    this.shameCount -= 2;
                }
                this.shameCount = clamp(this.shameCount, 0, 7);
            }
            if (health < 100) {
                const {ModuleHandler} = this.client;
                ModuleHandler.staticModules.shameReset.healthUpdate();
            }
        }
        playerInit(id) {
            this.id = id;
            const {PlayerManager} = this.client;
            if (!PlayerManager.playerData.has(id)) {
                PlayerManager.playerData.set(id, this);
            }
        }
        onFirstTickAfterSpawn() {
            const {ModuleHandler, SocketManager} = this.client;
            const {mouse, staticModules} = ModuleHandler;
            ModuleHandler.updateAngle(mouse.sentAngle, true);
            if (myClient.ModuleHandler.autoattack) {
                ModuleHandler.autoattack = true;
                SocketManager.autoAttack();
            }
        }
        playerSpawn() {
            this.inGame = true;
        }
        isUpgradeWeapon(id) {
            const weapon = Weapons[id];
            if ("upgradeOf" in weapon) {
                return this.inventory[weapon.itemType] === weapon.upgradeOf;
            }
            return true;
        }
        newUpgrade(points, age) {
            this.upgradeAge = age;
            if (0 === points || 10 === age) {
                return;
            }
            const ids = [];
            for (const weapon of Weapons) {
                if (weapon.age === age && this.isUpgradeWeapon(weapon.id)) {
                    ids.push(weapon.id);
                }
            }
            for (const item of Items) {
                if (item.age === age) {
                    ids.push(item.id + 16);
                }
            }
        }
        updateAge(age) {
            this.age = age;
        }
        upgradeItem(id) {
            this.upgradeOrder.push(id);
            if (id < 16) {
                const weapon = Weapons[id];
                this.inventory[weapon.itemType] = id;
                const XP = this.weaponXP[weapon.itemType];
                XP.current = 0;
                XP.max = -1;
            } else {
                id -= 16;
                const item = Items[id];
                this.inventory[item.itemType] = id;
            }
        }
        updateClanMembers(teammates) {
            this.teammates.clear();
            for (let i = 0; i < teammates.length; i += 2) {
                const id = teammates[i + 0];
                if (!this.isMyPlayerByID(id)) {
                    this.teammates.add(id);
                }
            }
        }
        updateItemCount(group, count) {
            this.itemCount.set(group, count);
            if (this.client.isOwner) {
                UI_GameUI.updateItemCount(group);
            }
        }
        updateResources(type, amount) {
            const previousAmount = this.resources[type];
            this.resources[type] = amount;
            if ("gold" === type) {
                this.tempGold = amount;
                return;
            }
            if (amount < previousAmount) {
                return;
            }
            const difference = amount - previousAmount;
            if ("kills" === type) {
                myClient.totalKills += difference;
                UI_GameUI.updateTotalKill();
                return;
            }
            this.updateWeaponXP(difference);
        }
        updateWeaponXP(amount) {
            const {next} = this.getWeaponVariant(this.weapon.current);
            const XP = this.weaponXP[Weapons[this.weapon.current].itemType];
            const maxXP = WeaponVariants[next].needXP;
            XP.current += amount;
            if (-1 !== XP.max && XP.current >= XP.max) {
                XP.current -= XP.max;
                XP.max = maxXP;
                return;
            }
            if (-1 === XP.max) {
                XP.max = maxXP;
            }
            if (XP.current >= XP.max) {
                XP.current -= XP.max;
                XP.max = -1;
            }
        }
        resetResources() {
            this.resources.food = 100;
            this.resources.wood = 100;
            this.resources.stone = 100;
            this.resources.gold = 100;
            this.resources.kills = 0;
        }
        resetInventory() {
            this.inventory[0] = 0;
            this.inventory[1] = null;
            this.inventory[2] = 0;
            this.inventory[3] = 3;
            this.inventory[4] = 6;
            this.inventory[5] = 10;
            this.inventory[6] = null;
            this.inventory[7] = null;
            this.inventory[8] = null;
            this.inventory[9] = null;
        }
        resetWeaponXP() {
            for (const XP of this.weaponXP) {
                XP.current = 0;
                XP.max = -1;
            }
        }
        spawn() {
            const name = localStorage.getItem("moo_name") || "";
            const skin = Number(localStorage.getItem("skin_color")) || 0;
            this.client.SocketManager.spawn(name, 1, 10 === skin ? "constructor" : skin);
        }
        handleDeath() {
            if (Settings.autospawn) {
                this.spawn();
                return true;
            }
            return false;
        }
        handleJoinRequest(id, name) {
            this.joinRequests.push([ id, name ]);
        }
        reset(first = false) {
            this.resetResources();
            this.resetInventory();
            this.resetWeaponXP();
            const {ModuleHandler, PlayerManager} = this.client;
            ModuleHandler.reset();
            this.inGame = false;
            this.wasDead = true;
            this.shameTimer = 0;
            this.shameCount = 0;
            this.upgradeOrder.length = 0;
            this.upgradeIndex = 0;
            if (first) {
                return;
            }
            for (const player of PlayerManager.players) {
                player.resetReload();
            }
            this.deathPosition.setVec(this.position.current);
            this.diedOnce = true;
            if (this.client.isOwner) {
                UI_GameUI.reset();
            }
        }
    }
    const data_ClientPlayer = ClientPlayer;
    class PlayerManager {
        playerData=new Map;
        players=[];
        animalData=new Map;
        animals=[];
        start=Date.now();
        step=0;
        client;
        constructor(client) {
            this.client = client;
        }
        get timeSinceTick() {
            return Date.now() - this.start;
        }
        createPlayer({socketID, id, nickname, health, skinID}) {
            const player = this.playerData.get(id) || new data_Player(this.client);
            if (!this.playerData.has(id)) {
                this.playerData.set(id, player);
            }
            player.socketID = socketID || "";
            player.id = id;
            player.nickname = nickname || "";
            player.currentHealth = health || 100;
            player.skinID = "undefined" === typeof skinID ? -1 : skinID;
            player.init();
            const {myPlayer} = this.client;
            if (myPlayer.isMyPlayerByID(id)) {
                myPlayer.playerSpawn();
            }
            return player;
        }
        canHitTarget(player, weaponID, target) {
            const pos = target.position.current;
            const distance = player.position.current.distance(pos);
            const angle = player.position.current.angle(pos);
            const range = Weapons[weaponID].range + target.hitScale;
            return distance <= range && getAngleDist(angle, player.angle) <= constants_Config.gatherAngle;
        }
        attackPlayer(id, gathering, weaponID) {
            const player = this.playerData.get(id);
            if (void 0 === player) {
                return;
            }
            const {hatID, reload} = player;
            const {myPlayer, ObjectManager} = this.client;
            if (myPlayer.isMyPlayerByID(id) && !myPlayer.inGame) {
                return;
            }
            const weapon = Weapons[weaponID];
            const type = WeaponTypeString[weapon.itemType];
            reload[type].current = 0;
            reload[type].max = player.getWeaponSpeed(weaponID);
            if (myPlayer.isEnemyByID(id) && this.canHitTarget(player, weaponID, myPlayer)) {
                const {isAble, count} = player.canDealPoison(weaponID);
                if (isAble) {
                    myPlayer.poisonCount = count;
                }
            }
            if (1 === gathering) {
                const objects = ObjectManager.attackedObjects;
                for (const [id, data] of objects) {
                    const [hitAngle, object] = data;
                    if (this.canHitTarget(player, weaponID, object) && getAngleDist(hitAngle, player.angle) <= 1.25) {
                        objects.delete(id);
                        if (object instanceof PlayerObject) {
                            const damage = player.getBuildingDamage(weaponID);
                            object.health = Math.max(0, object.health - damage);
                        } else if (player === myPlayer) {
                            let amount = 9 === hatID ? 1 : 0;
                            if (3 === object.type) {
                                amount += weapon.gather + 4;
                            }
                            myPlayer.updateWeaponXP(amount);
                        }
                    }
                }
            }
        }
        updatePlayer(buffer) {
            this.players.length = 0;
            const now = Date.now();
            this.step = now - this.start;
            this.start = now;
            for (let i = 0; i < buffer.length; i += 13) {
                const id = buffer[i];
                const player = this.playerData.get(id);
                if (!player) {
                    continue;
                }
                this.players.push(player);
                player.update(id, buffer[i + 1], buffer[i + 2], buffer[i + 3], buffer[i + 4], buffer[i + 5], buffer[i + 6], buffer[i + 7], buffer[i + 8], buffer[i + 9], buffer[i + 10], buffer[i + 11]);
            }
        }
        updateAnimal(buffer) {
            this.animals.length = 0;
            for (let i = 0; i < buffer.length; i += 7) {
                const id = buffer[i];
                if (!this.animalData.has(id)) {
                    this.animalData.set(id, new data_Animal(this.client));
                }
                const animal = this.animalData.get(id);
                this.animals.push(animal);
                animal.update(id, buffer[i + 1], buffer[i + 2], buffer[i + 3], buffer[i + 4], buffer[i + 5], buffer[i + 6]);
            }
        }
        postTick() {
            const {EnemyManager, ProjectileManager, ObjectManager, myPlayer} = this.client;
            EnemyManager.handleEnemies(this.players, this.animals);
            ProjectileManager.postTick();
            ObjectManager.postTick();
            if (myPlayer.inGame) {
                myPlayer.tickUpdate();
            }
        }
        isEnemy(target1, target2) {
            return target1 !== target2 && (null === target1.clanName || null === target2.clanName || target1.clanName !== target2.clanName);
        }
        isEnemyByID(ownerID, target) {
            const player = this.playerData.get(ownerID);
            if (player instanceof data_ClientPlayer) {
                return player.isEnemyByID(target.id);
            }
            if (target instanceof data_ClientPlayer) {
                return target.isEnemyByID(player.id);
            }
            return this.isEnemy(player, target);
        }
        isEnemyTarget(owner, target) {
            if (target instanceof data_Animal) {
                return true;
            }
            return this.isEnemyByID(owner.id, target);
        }
        canShoot(ownerID, target) {
            return target instanceof data_Animal || this.isEnemyByID(ownerID, target);
        }
        lookingShield(owner, target) {
            const weapon = owner.weapon.current;
            if (11 !== weapon) {
                return false;
            }
            const {myPlayer, ModuleHandler} = this.client;
            const pos1 = owner.position.current;
            const pos2 = target.position.current;
            const angle = pos1.angle(pos2);
            const ownerAngle = myPlayer.isMyPlayerByID(owner.id) ? ModuleHandler.mouse.sentAngle : owner.angle;
            return getAngleDist(angle, ownerAngle) <= constants_Config.shieldAngle;
        }
        getEntities() {
            return [ ...this.players, ...this.animals ];
        }
    }
    const Managers_PlayerManager = PlayerManager;
    class Projectile {
        position={};
        angle;
        range;
        speed;
        type;
        onPlatform;
        id;
        isTurret;
        scale;
        maxRange;
        owner=null;
        constructor(angle, range, speed, type, onPlatform, id, maxRange) {
            this.isTurret = 1 === type;
            this.angle = angle;
            this.range = range;
            this.speed = speed;
            this.type = type;
            this.onPlatform = onPlatform;
            this.id = id;
            this.scale = Projectiles[type].scale;
            this.maxRange = maxRange || 0;
        }
        formatFromCurrent(pos, increase) {
            if (this.isTurret) {
                return pos;
            }
            return pos.direction(this.angle, increase ? 70 : -70);
        }
    }
    const data_Projectile = Projectile;
    class ProjectileManager {
        client;
        projectiles=new Map;
        ignoreCreation=new Set;
        constructor(client) {
            this.client = client;
        }
        createProjectile(projectile) {
            const key = projectile.speed;
            if (!this.projectiles.has(key)) {
                this.projectiles.set(key, []);
            }
            const list = this.projectiles.get(key);
            list.push(projectile);
        }
        shootingAt(owner, target) {}
        postTick() {
            this.projectiles.clear();
        }
        getProjectile(owner, projectile, onPlatform, angle, range) {
            const bullet = Projectiles[projectile];
            const isTurret = 1 === projectile;
            const {previous: a0, current: a1, future: a2} = owner.position;
            const arrow = new data_Projectile(angle, bullet.range, bullet.speed, projectile, onPlatform || isTurret ? 1 : 0, -1, range);
            arrow.position.previous = arrow.formatFromCurrent(a0, true);
            arrow.position.current = arrow.formatFromCurrent(a1, true);
            arrow.position.future = arrow.formatFromCurrent(a2, true);
            return arrow;
        }
    }
    const Managers_ProjectileManager = ProjectileManager;
    class SocketManager {
        client;
        PacketQueue=[];
        startPing=Date.now();
        ping=0;
        pong=0;
        TICK=1e3 / 9;
        packetCount=0;
        tickTimeout;
        constructor(client) {
            this.message = this.message.bind(this);
            this.client = client;
            const attachMessage = socket => {
                socket.addEventListener("message", this.message);
                socket.onclose = () => {
                    socket.removeEventListener("message", this.message);
                };
            };
            const connection = client.connection;
            if (void 0 === connection.socket) {
                Object.defineProperty(connection, "socket", {
                    set(value) {
                        delete connection.socket;
                        connection.socket = value;
                        attachMessage(value);
                    },
                    configurable: true
                });
                return;
            }
            attachMessage(connection.socket);
        }
        handlePing() {
            this.pong = Date.now() - this.startPing;
            this.ping = this.pong / 2;
            if (this.client.isOwner) {
                UI_GameUI.updatePing(this.pong);
            }
            setTimeout((() => {
                this.pingRequest();
            }), 3e3);
        }
        message(event) {
            const decoder = this.client.connection.Decoder;
            if (null === decoder) {
                return;
            }
            const data = event.data;
            const decoded = decoder.decode(new Uint8Array(data));
            const temp = [ decoded[0], ...decoded[1] ];
            const {myPlayer, PlayerManager, ObjectManager, ProjectileManager, LeaderboardManager} = this.client;
            switch (temp[0]) {
              case "0":
                this.handlePing();
                break;

              case "io-init":
                this.pingRequest();
                this.client.stableConnection = true;
                if (this.client.isOwner) {
                    UI_GameUI.loadGame();
                } else {
                    this.client.myPlayer.spawn();
                    this.client.connection.socket.dispatchEvent(new Event("connected"));
                }
                break;

              case "C":
                myPlayer.playerInit(temp[1]);
                break;

              case "P":
                myPlayer.reset();
                break;

              case "N":
                this.PacketQueue.push((() => {
                    const type = "points" === temp[1] ? "gold" : temp[1];
                    myPlayer.updateResources(type, temp[2]);
                }));
                break;

              case "D":
                {
                    const data = temp[1];
                    PlayerManager.createPlayer({
                        socketID: data[0],
                        id: data[1],
                        nickname: data[2],
                        health: data[6],
                        skinID: data[9]
                    });
                    break;
                }

              case "O":
                {
                    const player = PlayerManager.playerData.get(temp[1]);
                    if (void 0 !== player) {
                        player.updateHealth(temp[2]);
                    }
                    break;
                }

              case "a":
                PlayerManager.updatePlayer(temp[1]);
                for (let i = 0; i < this.PacketQueue.length; i++) {
                    this.PacketQueue[i]();
                }
                this.PacketQueue.length = 0;
                ObjectManager.attackedObjects.clear();
                break;

              case "I":
                PlayerManager.updateAnimal(temp[1] || []);
                clearTimeout(this.tickTimeout);
                this.tickTimeout = setTimeout((() => {
                    PlayerManager.postTick();
                }), 5);
                break;

              case "H":
                ObjectManager.createObjects(temp[1]);
                break;

              case "Q":
                ObjectManager.removeObjectByID(temp[1]);
                break;

              case "R":
                {
                    const player = PlayerManager.playerData.get(temp[1]);
                    if (void 0 !== player) {
                        ObjectManager.removePlayerObjects(player);
                    }
                    break;
                }

              case "L":
                {
                    const object = ObjectManager.objects.get(temp[2]);
                    if (object instanceof Resource || object && object.isDestroyable) {
                        ObjectManager.attackedObjects.set(getUniqueID(), [ temp[1], object ]);
                    }
                    break;
                }

              case "K":
                this.PacketQueue.push((() => PlayerManager.attackPlayer(temp[1], temp[2], temp[3])));
                break;

              case "M":
                {
                    const id = temp[1];
                    const angle = temp[2];
                    const turret = ObjectManager.objects.get(id);
                    if (void 0 !== turret) {
                        const creations = ProjectileManager.ignoreCreation;
                        const pos = turret.position.current.stringify();
                        creations.add(pos + ":" + angle);
                    }
                    this.PacketQueue.push((() => ObjectManager.resetTurret(id)));
                    break;
                }

              case "X":
                {
                    const x = temp[1];
                    const y = temp[2];
                    const angle = temp[3];
                    const key = `${x}:${y}:${angle}`;
                    if (ProjectileManager.ignoreCreation.delete(key)) {
                        return;
                    }
                    const projectile = new data_Projectile(angle, temp[4], temp[5], temp[6], temp[7], temp[8]);
                    projectile.position.current = projectile.formatFromCurrent(new modules_Vector(x, y), false);
                    ProjectileManager.createProjectile(projectile);
                    break;
                }

              case "4":
                myPlayer.updateClanMembers(temp[1]);
                break;

              case "3":
                if ("string" !== typeof temp[1]) {
                    myPlayer.teammates.clear();
                }
                break;

              case "2":
                myPlayer.handleJoinRequest(temp[1], temp[2]);
                break;

              case "T":
                if (4 === temp.length) {
                    myPlayer.updateAge(temp[3]);
                }
                break;

              case "U":
                myPlayer.newUpgrade(temp[1], temp[2]);
                break;

              case "S":
                myPlayer.updateItemCount(temp[1], temp[2]);
                break;

              case "G":
                LeaderboardManager.update(temp[1]);
                break;

              case "5":
                {
                    const action = 0 === temp[1] ? 1 : 0;
                    UI_StoreHandler.updateStoreState(temp[3], action, temp[2]);
                    break;
                }
            }
        }
        send(data) {
            const connection = this.client.connection;
            if (void 0 === connection.socket || connection.socket.readyState !== connection.socket.OPEN || null === connection.Encoder) {
                return;
            }
            const [type, ...args] = data;
            const encoded = connection.Encoder.encode([ type, args ]);
            connection.socket.send(encoded);
        }
        clanRequest(id, accept) {
            this.send([ "P", id, Number(accept) ]);
        }
        kick(id) {
            this.send([ "Q", id ]);
        }
        joinClan(name) {
            this.send([ "b", name ]);
        }
        createClan(name) {
            this.send([ "L", name ]);
        }
        leaveClan() {
            this.client.myPlayer.joinRequests.length = 0;
            this.send([ "N" ]);
        }
        equip(type, id) {
            this.send([ "c", 0, id, type ]);
        }
        buy(type, id) {
            this.send([ "c", 1, id, type ]);
        }
        chat(message) {
            this.send([ "6", message ]);
        }
        attack(angle) {
            this.send([ "F", 1, angle ]);
        }
        stopAttack() {
            this.send([ "F", 0, null ]);
        }
        resetMoveDir() {
            this.send([ "e" ]);
        }
        move(angle) {
            this.send([ "9", angle ]);
        }
        autoAttack() {
            this.send([ "K", 1 ]);
        }
        lockRotation() {
            this.send([ "K", 0 ]);
        }
        pingMap() {
            this.send([ "S" ]);
        }
        selectItemByID(id, type) {
            this.send([ "z", id, type ]);
        }
        spawn(name, moofoll, skin) {
            this.send([ "M", {
                name,
                moofoll,
                skin
            } ]);
        }
        upgradeItem(id) {
            this.send([ "H", id ]);
        }
        updateAngle(radians) {
            this.send([ "D", radians ]);
        }
        pingRequest() {
            this.startPing = Date.now();
            this.send([ "0" ]);
        }
    }
    const Managers_SocketManager = SocketManager;
    class ActionPlanner {
        actionKeys=[];
        actionValues=[];
        createAction(key, value) {
            this.actionKeys.push(key);
            this.actionValues.push(value);
        }
        createActions(key, value, amount) {
            if (1 === amount) {
                return this.createAction(key, value);
            }
            for (let i = 0; i < amount; i++) {
                this.createAction(key, value);
            }
        }
        getActions() {
            const keys = [ ...this.actionKeys ];
            const values = [ ...this.actionValues ];
            const uniqueItems = [ ...new Set(keys) ];
            const output = [];
            while (keys.length > 0) {
                for (const item of uniqueItems) {
                    const index = keys.indexOf(item);
                    if (index >= 0) {
                        output.push([ item, values[index] ]);
                        removeFast(keys, index);
                        removeFast(values, index);
                    }
                }
            }
            this.actionKeys.length = 0;
            this.actionValues.length = 0;
            return output;
        }
    }
    const modules_ActionPlanner = ActionPlanner;
    class AntiInsta {
        name="antiInsta";
        client;
        toggleAnti=false;
        constructor(client) {
            this.client = client;
        }
        get isSaveHeal() {
            const {myPlayer, SocketManager} = this.client;
            const startHit = myPlayer.receivedDamage || 0;
            const timeSinceHit = Date.now() - startHit + SocketManager.pong;
            return timeSinceHit >= 120;
        }
        get canHeal() {
            const {myPlayer} = this.client;
            return Settings.autoheal && myPlayer.tempHealth < 100 && !myPlayer.shameActive && this.isSaveHeal;
        }
        postTick() {
            const {myPlayer, ModuleHandler} = this.client;
            const foodID = myPlayer.getItemByType(2);
            const restore = Items[foodID].restore;
            const maxTimes = Math.ceil(myPlayer.maxHealth / restore);
            const needTimes = Math.ceil((myPlayer.maxHealth - myPlayer.tempHealth) / restore);
            let healingTimes = null;
            if (ModuleHandler.needToHeal || this.toggleAnti) {
                ModuleHandler.needToHeal = false;
                if (myPlayer.shameActive) {
                    return;
                }
                ModuleHandler.didAntiInsta = true;
                healingTimes = Math.min(maxTimes, 3);
            } else if (this.canHeal) {
                healingTimes = needTimes;
                myPlayer.tempHealth += clamp(restore * healingTimes, 0, 100);
            }
            if (null !== healingTimes) {
                ModuleHandler.healedOnce = true;
                ModuleHandler.actionPlanner.createActions(2, (last => ModuleHandler.heal(last)), healingTimes);
            }
        }
    }
    const modules_AntiInsta = AntiInsta;
    class AutoPlacer {
        name="autoPlacer";
        client;
        placeAngles=[ null, new Set ];
        constructor(client) {
            this.client = client;
        }
        postTick() {
            this.placeAngles[0] = null;
            this.placeAngles[1].clear();
            if (!Settings.autoplacer) {
                return;
            }
            const {myPlayer, ObjectManager, ModuleHandler, EnemyManager} = this.client;
            const {currentType} = ModuleHandler;
            const pos = myPlayer.position.current;
            const nearestEnemy = EnemyManager.nearestEnemy;
            if (null === nearestEnemy) {
                return;
            }
            if (!myPlayer.collidingEntity(nearestEnemy, 450)) {
                return;
            }
            const nearestAngle = pos.angle(nearestEnemy.position.current);
            let itemType = null;
            const spike = myPlayer.getItemByType(4);
            const spikeAngles = ObjectManager.getBestPlacementAngles(pos, spike, nearestAngle);
            let angles = new Set;
            const length = myPlayer.getItemPlaceScale(spike);
            for (const angle of spikeAngles) {
                const newPos = pos.direction(angle, length);
                let shouldPlaceSpike = false;
                for (const enemy of EnemyManager.trappedEnemies) {
                    const distance = newPos.distance(enemy.position.current);
                    const range = 2 * Items[spike].scale + enemy.collisionScale;
                    if (distance <= range) {
                        shouldPlaceSpike = true;
                        break;
                    }
                }
                if (shouldPlaceSpike) {
                    angles = spikeAngles;
                    itemType = 4;
                    break;
                }
            }
            if (0 === angles.size) {
                const type = currentType && 2 !== currentType ? currentType : 7;
                if (!myPlayer.canPlace(type)) {
                    return;
                }
                const id = myPlayer.getItemByType(type);
                angles = ObjectManager.getBestPlacementAngles(pos, id, nearestAngle);
                itemType = type;
            }
            if (null === itemType) {
                return;
            }
            this.placeAngles[0] = itemType;
            this.placeAngles[1] = angles;
            for (const angle of angles) {
                ModuleHandler.actionPlanner.createAction(itemType, (last => ModuleHandler.place(itemType, {
                    angle,
                    priority: 1,
                    last
                })));
                ModuleHandler.placedOnce = true;
            }
        }
    }
    const modules_AutoPlacer = AutoPlacer;
    class Autohat {
        name="autoHat";
        client;
        utilitySize=[ 0, 0 ];
        constructor(client) {
            this.client = client;
        }
        handleUtility(type) {
            const {ModuleHandler, myPlayer} = this.client;
            const store = ModuleHandler.store[type];
            if (null !== store.lastUtility) {
                store.utility.delete(store.lastUtility);
                store.lastUtility = null;
            }
            if (ModuleHandler.canAttack && 0 === store.utility.size) {
                const id = myPlayer.getBestUtilityID(type);
                if (null === id) {
                    return;
                }
                if (ModuleHandler.equip(type, id)) {
                    store.lastUtility = id;
                    store.utility.set(id, true);
                }
            }
        }
        handleEquip(type) {
            const {ModuleHandler} = this.client;
            const store = ModuleHandler.store[type];
            const size = store.utility.size;
            const oldSize = this.utilitySize[type];
            if (0 === size && (size !== oldSize || store.best !== store.current)) {
                if (ModuleHandler.equip(type, store.current)) {
                    store.best = store.current;
                }
            }
            this.utilitySize[type] = size;
        }
        postTick() {
            const {ModuleHandler} = this.client;
            if (!ModuleHandler.sentHatEquip) {
                this.handleUtility(0);
                this.handleEquip(0);
            }
            if (!ModuleHandler.sentAccEquip && !ModuleHandler.sentHatEquip) {
                this.handleEquip(1);
            }
        }
    }
    const modules_Autohat = Autohat;
    class Automill {
        name="autoMill";
        toggle=true;
        client;
        placeCount=0;
        constructor(client) {
            this.client = client;
        }
        reset() {
            this.toggle = true;
        }
        get canAutomill() {
            const isOwner = this.client.isOwner;
            const {autoattack, attacking, placedOnce} = this.client.ModuleHandler;
            return Settings.automill && this.client.myPlayer.isSandbox && !placedOnce && !autoattack && (!isOwner || !attacking) && this.toggle;
        }
        placeWindmill(angle) {
            const {myPlayer, ObjectManager, ModuleHandler, isOwner} = this.client;
            const id = myPlayer.getItemByType(5);
            const position = myPlayer.getPlacePosition(myPlayer.position.future, id, angle);
            const radius = isOwner ? 0 : Items[id].scale;
            if (!ObjectManager.canPlaceItem(id, position, radius)) {
                return;
            }
            ModuleHandler.actionPlanner.createAction(5, (last => ModuleHandler.place(5, {
                angle,
                last
            })));
        }
        postTick() {
            const {myPlayer, ModuleHandler, isOwner} = this.client;
            if (!this.canAutomill) {
                return;
            }
            if (!myPlayer.canPlace(5)) {
                this.toggle = false;
                return;
            }
            const angle = isOwner ? getAngleFromBitmask(ModuleHandler.move, true) : ModuleHandler.reverseCursorAngle;
            if (null === angle) {
                return;
            }
            const item = Items[myPlayer.getItemByType(5)];
            const distance = myPlayer.getItemPlaceScale(item.id);
            const angleBetween = Math.asin(2 * item.scale / (2 * distance));
            this.placeWindmill(angle - angleBetween);
            this.placeWindmill(angle + angleBetween);
        }
    }
    const modules_Automill = Automill;
    class PlacementExecutor {
        name="placementExecutor";
        client;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            const actions = this.client.ModuleHandler.actionPlanner.getActions();
            const lastIndex = actions.length - 1;
            for (let i = 0; i < actions.length; i++) {
                const current = actions[i];
                const last = actions[i + 1];
                const isLast = i === lastIndex || void 0 !== last && last[0] === current[0];
                current[1](isLast);
            }
        }
    }
    const modules_PlacementExecutor = PlacementExecutor;
    class Placer {
        name="placer";
        client;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            const {ModuleHandler, myPlayer, isOwner} = this.client;
            const {currentType, placedOnce, healedOnce, mouse} = ModuleHandler;
            if (!myPlayer.canPlace(currentType)) {
                return;
            }
            if (2 === currentType) {
                if (healedOnce) {
                    return;
                }
                ModuleHandler.healedOnce = true;
                ModuleHandler.actionPlanner.createAction(currentType, (last => ModuleHandler.place(currentType, {
                    last
                })));
                return;
            }
            if (placedOnce) {
                return;
            }
            ModuleHandler.placedOnce = true;
            const angle = isOwner ? mouse.angle : ModuleHandler.cursorAngle;
            ModuleHandler.actionPlanner.createAction(currentType, (last => ModuleHandler.place(currentType, {
                angle,
                last
            })));
        }
    }
    const modules_Placer = Placer;
    class ShameReset {
        name="shameReset";
        client;
        constructor(client) {
            this.client = client;
        }
        get isEquipTime() {
            const {myPlayer, SocketManager} = this.client;
            const max = 1e3 - SocketManager.TICK;
            return myPlayer.timerCount >= max;
        }
        get shouldReset() {
            const {myPlayer, ModuleHandler} = this.client;
            return !myPlayer.shameActive && myPlayer.shameCount > 0 && 0 === myPlayer.poisonCount && !ModuleHandler.didAntiInsta && this.isEquipTime;
        }
        postTick() {
            this.handleShameReset();
        }
        handleShameReset(isDmgOverTime) {
            const {myPlayer, ModuleHandler} = this.client;
            if (ModuleHandler.sentHatEquip) {
                return;
            }
            const store = ModuleHandler.getHatStore();
            const bull = 7;
            const bullState = store.utility.get(bull);
            if (void 0 === bullState && this.shouldReset) {
                const isEquipped = ModuleHandler.equip(0, bull);
                if (isEquipped) {
                    store.utility.set(bull, true);
                }
            } else if (bullState && (0 === myPlayer.shameCount || isDmgOverTime || 0 !== myPlayer.poisonCount)) {
                store.utility.delete(bull);
            }
        }
        healthUpdate() {
            const {myPlayer} = this.client;
            const {currentHealth, previousHealth, shameCount} = myPlayer;
            const difference = Math.abs(currentHealth - previousHealth);
            const isDmgOverTime = 5 === difference && currentHealth < previousHealth;
            const shouldRemoveBull = isDmgOverTime && shameCount > 0;
            if (isDmgOverTime) {
                myPlayer.timerCount = 0;
            }
            this.handleShameReset(isDmgOverTime);
            return shouldRemoveBull;
        }
    }
    const modules_ShameReset = ShameReset;
    class UpdateAngle {
        name="updateAngle";
        client;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            const {sentAngle, mouse, cursorAngle} = this.client.ModuleHandler;
            if (sentAngle > 1) {
                return;
            }
            const angle = this.client.isOwner ? mouse.angle : cursorAngle;
            this.client.ModuleHandler.updateAngle(angle);
        }
    }
    const modules_UpdateAngle = UpdateAngle;
    class UpdateAttack {
        name="updateAttack";
        client;
        constructor(client) {
            this.client = client;
        }
        getAttackAngle() {
            const {ModuleHandler, isOwner} = this.client;
            const {staticModules, useAngle, mouse, cursorAngle} = ModuleHandler;
            const {spikeTick, autoBreak} = staticModules;
            if (spikeTick.isActive) {
                return useAngle;
            }
            if (autoBreak.isActive && !ModuleHandler.canHitEntity) {
                return useAngle;
            }
            if (isOwner) {
                return mouse.angle;
            }
            return cursorAngle;
        }
        postTick() {
            const {ModuleHandler} = this.client;
            const {useWeapon, weapon, attacking, canAttack, sentAngle, staticModules} = ModuleHandler;
            const {reloading} = staticModules;
            if (null !== useWeapon && useWeapon !== weapon) {
                ModuleHandler.previousWeapon = weapon;
                ModuleHandler.whichWeapon(useWeapon);
            }
            if (canAttack) {
                const angle = this.getAttackAngle();
                ModuleHandler.attack(angle);
                ModuleHandler.stopAttack();
                const reload = reloading.currentReload;
                reloading.updateMaxReload(reload);
                reloading.resetReload(reload);
            } else if (!attacking && 0 !== sentAngle) {
                ModuleHandler.stopAttack();
            }
        }
    }
    const modules_UpdateAttack = UpdateAttack;
    class AutoAccept {
        name="autoAccept";
        client;
        acceptCount=0;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            const {myPlayer, clientIDList, SocketManager, isOwner} = this.client;
            if (!myPlayer.isLeader || 0 === myPlayer.joinRequests.length) {
                return;
            }
            const id = myPlayer.joinRequests[0][0];
            if (0 === this.acceptCount) {
                if (Settings.autoaccept || 0 !== myClient.pendingJoins.size) {
                    SocketManager.clanRequest(id, Settings.autoaccept || clientIDList.has(id));
                    myPlayer.joinRequests.shift();
                    myClient.pendingJoins["delete"](id);
                    if (isOwner) {
                        UI_GameUI.clearNotication();
                    }
                }
                const nextID = myPlayer.joinRequests[0];
                if (isOwner && void 0 !== nextID) {
                    UI_GameUI.createRequest(nextID);
                }
            }
            this.acceptCount = (this.acceptCount + 1) % 7;
        }
    }
    const modules_AutoAccept = AutoAccept;
    class Reloading {
        name="reloading";
        client;
        clientReload={
            primary: {},
            secondary: {},
            turret: {}
        };
        constructor(client) {
            this.client = client;
            const {primary, secondary, turret} = this.clientReload;
            primary.current = primary.max = 0;
            secondary.current = secondary.max = 0;
            turret.current = turret.max = 2500;
        }
        get currentReload() {
            const type = WeaponTypeString[this.client.ModuleHandler.weapon];
            return this.clientReload[type];
        }
        updateMaxReload(reload) {
            const {ModuleHandler, myPlayer} = this.client;
            if (ModuleHandler.attacked) {
                const id = myPlayer.getItemByType(ModuleHandler.weapon);
                const store = ModuleHandler.getHatStore();
                const speed = myPlayer.getWeaponSpeed(id, store.last);
                reload.max = speed;
            }
        }
        resetReload(reload) {
            const {PlayerManager} = this.client;
            reload.current = -PlayerManager.step;
        }
        resetByType(type) {
            const reload = this.clientReload[type];
            this.resetReload(reload);
        }
        isReloaded(type) {
            const reload = this.clientReload[type];
            return reload.current === reload.max;
        }
        increaseReload(reload, step) {
            reload.current += step;
            if (reload.current > reload.max) {
                reload.current = reload.max;
            }
        }
        postTick() {
            const {ModuleHandler, PlayerManager} = this.client;
            this.increaseReload(this.clientReload.turret, PlayerManager.step);
            if (ModuleHandler.holdingWeapon) {
                this.increaseReload(this.currentReload, PlayerManager.step);
            }
        }
    }
    const modules_Reloading = Reloading;
    class Autobreak {
        name="autoBreak";
        client;
        isActive=false;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            this.isActive = false;
            const {EnemyManager, myPlayer, ModuleHandler} = this.client;
            if (!Settings.autobreak || ModuleHandler.moduleActive) {
                return;
            }
            const nearestTrap = EnemyManager.nearestTrap;
            const type = ModuleHandler.weapon;
            if (null !== nearestTrap && null !== type) {
                this.isActive = true;
                const pos1 = myPlayer.position.current;
                const pos2 = nearestTrap.position.current;
                ModuleHandler.moduleActive = true;
                ModuleHandler.useAngle = pos1.angle(pos2);
                ModuleHandler.useWeapon = type;
            }
        }
    }
    const modules_Autobreak = Autobreak;
    class SpikeTick {
        name="spikeTick";
        client;
        isActive=false;
        tickAction=0;
        constructor(client) {
            this.client = client;
        }
        postTick() {}
    }
    const modules_SpikeTick = SpikeTick;
    class PreAttack {
        name="preAttack";
        client;
        constructor(client) {
            this.client = client;
        }
        postTick() {
            const {ModuleHandler} = this.client;
            const {moduleActive, useWeapon, weapon, previousWeapon, attackingState, staticModules} = ModuleHandler;
            const type = moduleActive ? useWeapon : weapon;
            const stringType = WeaponTypeString[type];
            const shouldAttack = 0 !== attackingState || moduleActive;
            const isReloaded = staticModules.reloading.isReloaded(stringType);
            ModuleHandler.canAttack = shouldAttack && isReloaded;
            if (null === useWeapon && null !== previousWeapon && staticModules.reloading.isReloaded(WeaponTypeString[weapon])) {
                ModuleHandler.whichWeapon(previousWeapon);
                ModuleHandler.previousWeapon = null;
            }
        }
    }
    const modules_PreAttack = PreAttack;
    class ModuleHandler {
        client;
        staticModules={};
        modules;
        hotkeys=new Map;
        store=[ {
            utility: new Map,
            lastUtility: null,
            current: 0,
            best: 0,
            actual: 0,
            last: 0
        }, {
            utility: new Map,
            lastUtility: null,
            current: 0,
            best: 0,
            actual: 0,
            last: 0
        } ];
        actionPlanner=new modules_ActionPlanner;
        bought=[ new Set, new Set ];
        currentHolding=0;
        weapon;
        currentType;
        autoattack=false;
        rotation=true;
        cursorAngle=0;
        reverseCursorAngle=0;
        lockPosition=false;
        lockedPosition=new modules_Vector(0, 0);
        move;
        attacking;
        attackingState;
        sentAngle;
        sentHatEquip;
        sentAccEquip;
        needToHeal;
        didAntiInsta;
        placedOnce;
        healedOnce;
        totalPlaces;
        attacked;
        canAttack=false;
        canHitEntity=false;
        moduleActive=false;
        useAngle=0;
        useWeapon=null;
        previousWeapon=null;
        mouse={
            x: 0,
            y: 0,
            lockX: 0,
            lockY: 0,
            _angle: 0,
            angle: 0,
            sentAngle: 0
        };
        constructor(client) {
            this.client = client;
            this.staticModules = {
                autoAccept: new modules_AutoAccept(client),
                antiInsta: new modules_AntiInsta(client),
                shameReset: new modules_ShameReset(client),
                autoPlacer: new modules_AutoPlacer(client),
                placer: new modules_Placer(client),
                autoMill: new modules_Automill(client),
                placementExecutor: new modules_PlacementExecutor(client),
                reloading: new modules_Reloading(client),
                spikeTick: new modules_SpikeTick(client),
                autoBreak: new modules_Autobreak(client),
                preAttack: new modules_PreAttack(client),
                autoHat: new modules_Autohat(client),
                updateAttack: new modules_UpdateAttack(client),
                updateAngle: new modules_UpdateAngle(client)
            };
            this.modules = [ this.staticModules.autoAccept, this.staticModules.antiInsta, this.staticModules.shameReset, this.staticModules.autoPlacer, this.staticModules.placer, this.staticModules.autoMill, this.staticModules.placementExecutor, this.staticModules.reloading, this.staticModules.spikeTick, this.staticModules.autoBreak, this.staticModules.preAttack, this.staticModules.autoHat, this.staticModules.updateAttack, this.staticModules.updateAngle ];
            this.reset();
        }
        movementReset() {
            this.hotkeys.clear();
            this.currentHolding = 0;
            this.weapon = 0;
            this.currentType = null;
            this.move = 0;
            this.attacking = 0;
            this.attackingState = 0;
        }
        reset() {
            this.movementReset();
            this.getHatStore().utility.clear();
            this.getAccStore().utility.clear();
            this.sentAngle = 0;
            this.sentHatEquip = false;
            this.sentAccEquip = false;
            this.needToHeal = false;
            this.didAntiInsta = false;
            this.placedOnce = false;
            this.healedOnce = false;
            this.totalPlaces = 0;
            this.attacked = false;
            this.canHitEntity = false;
            for (const module of this.modules) {
                if ("reset" in module) {
                    module.reset();
                }
            }
        }
        get isMoving() {
            const angle = getAngleFromBitmask(this.move, false);
            return null !== angle;
        }
        get holdingWeapon() {
            return this.currentHolding <= 1;
        }
        getHatStore() {
            return this.store[0];
        }
        getAccStore() {
            return this.store[1];
        }
        getMoveAngle() {
            if (this.client.isOwner) {
                return getAngleFromBitmask(this.move, false);
            }
            return null;
        }
        handleMouse(event) {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
            const angle = getAngle(innerWidth / 2, innerHeight / 2, this.mouse.x, this.mouse.y);
            this.mouse._angle = angle;
            if (this.rotation) {
                this.mouse.lockX = event.clientX;
                this.mouse.lockY = event.clientY;
                this.mouse.angle = angle;
            }
        }
        updateSentAngle(priority) {
            if (this.sentAngle >= priority) {
                return;
            }
            this.sentAngle = priority;
        }
        upgradeItem(id) {
            this.client.SocketManager.upgradeItem(id);
            this.client.myPlayer.upgradeItem(id);
        }
        canBuy(type, id) {
            const store = utility_DataHandler.getStore(type);
            const price = store[id].price;
            const bought = this.bought[type];
            return bought.has(id) || this.client.myPlayer.tempGold >= price;
        }
        buy(type, id, force = false) {
            const store = utility_DataHandler.getStore(type);
            const {myPlayer, SocketManager} = this.client;
            if (!myPlayer.inGame) {
                return false;
            }
            const price = store[id].price;
            const bought = this.bought[type];
            if (0 === price) {
                bought.add(id);
                return true;
            }
            if (!bought.has(id) && myPlayer.tempGold >= price) {
                bought.add(id);
                SocketManager.buy(type, id);
                myPlayer.tempGold -= price;
                return false;
            }
            return bought.has(id);
        }
        equip(type, id, force = false, toggle = false) {
            const store = this.store[type];
            if (toggle && store.last === id && 0 !== id) {
                id = 0;
            }
            const {myPlayer, SocketManager, EnemyManager} = this.client;
            if (!myPlayer.inGame || !this.buy(type, id, force)) {
                return false;
            }
            SocketManager.equip(type, id);
            if (0 === type) {
                this.sentHatEquip = true;
            } else {
                this.sentAccEquip = true;
            }
            if (force) {
                store.actual = id;
            }
            const nearest = EnemyManager.nearestTurretEntity;
            const reloading = this.staticModules.reloading;
            if (null !== nearest && reloading.isReloaded("turret")) {
                reloading.resetByType("turret");
            }
            return true;
        }
        updateAngle(angle, force = false) {
            if (!force && angle === this.mouse.sentAngle) {
                return;
            }
            this.mouse.sentAngle = angle;
            this.updateSentAngle(3);
            this.client.SocketManager.updateAngle(angle);
        }
        selectItem(type) {
            const item = this.client.myPlayer.getItemByType(type);
            this.client.SocketManager.selectItemByID(item, false);
            this.currentHolding = type;
        }
        attack(angle, priority = 2) {
            if (null !== angle) {
                this.mouse.sentAngle = angle;
            }
            this.updateSentAngle(priority);
            this.client.SocketManager.attack(angle);
            if (this.holdingWeapon) {
                this.attacked = true;
            }
        }
        stopAttack() {
            this.client.SocketManager.stopAttack();
        }
        whichWeapon(type = this.weapon) {
            const weapon = this.client.myPlayer.getItemByType(type);
            if (null === weapon) {
                return;
            }
            this.currentHolding = type;
            this.weapon = type;
            this.client.SocketManager.selectItemByID(weapon, true);
        }
        place(type, {angle = this.mouse.angle, priority, last}) {
            this.selectItem(type);
            this.attack(angle, priority);
            if (last) {
                this.whichWeapon();
            }
        }
        heal(last) {
            this.selectItem(2);
            this.attack(null, 1);
            if (last) {
                this.whichWeapon();
            }
        }
        placementHandler(type, code) {
            const item = this.client.myPlayer.getItemByType(type);
            if (null === item) {
                return;
            }
            this.hotkeys.set(code, type);
            this.currentType = type;
        }
        handleMovement() {
            const angle = getAngleFromBitmask(this.move, false);
            this.client.SocketManager.move(angle);
        }
        toggleAutoattack(value) {
            if (0 !== this.attackingState) {
                return;
            }
            const {SocketManager, isOwner} = this.client;
            if (isOwner) {
                this.autoattack = !this.autoattack;
                SocketManager.autoAttack();
            } else if ("boolean" === typeof value && this.autoattack !== value) {
                this.autoattack = value;
                SocketManager.autoAttack();
            }
        }
        toggleRotation() {
            this.rotation = !this.rotation;
            if (this.rotation) {
                const {x, y, _angle} = this.mouse;
                this.mouse.lockX = x;
                this.mouse.lockY = y;
                this.mouse.angle = _angle;
            }
        }
        updateStoreState(type) {
            const {myPlayer} = this.client;
            const id = myPlayer.getBestCurrentID(type);
            this.store[type].current = id;
        }
        postTick() {
            this.sentAngle = 0;
            this.sentHatEquip = false;
            this.sentAccEquip = false;
            this.didAntiInsta = false;
            this.placedOnce = false;
            this.healedOnce = false;
            this.totalPlaces = 0;
            this.attacked = false;
            this.canHitEntity = false;
            this.moduleActive = false;
            this.useWeapon = null;
            const {isOwner} = this.client;
            this.updateStoreState(0);
            this.updateStoreState(1);
            for (const module of this.modules) {
                module.postTick();
            }
            this.attackingState = this.attacking;
        }
        handleKeydown(event) {
            const target = event.target;
            if ("Space" === event.code && "BODY" === target.tagName) {
                event.preventDefault();
            }
            if (event.repeat) {
                return;
            }
            if (null !== UI_UI.activeHotkeyInput) {
                return;
            }
            const isInput = isActiveInput();
            if (event.code === Settings.toggleMenu && !isInput) {
                UI_UI.toggleMenu();
            }
            if (event.code === Settings.toggleChat) {
                UI_GameUI.handleEnter(event);
            }
            if (!this.client.myPlayer.inGame) {
                return;
            }
            if (isInput) {
                return;
            }
            const type = event.code === Settings.primary ? 0 : event.code === Settings.secondary ? 1 : null;
            if (null !== type) {
                this.whichWeapon(type);
            }
            if (event.code === Settings.food) {
                this.placementHandler(2, event.code);
            }
            if (event.code === Settings.wall) {
                this.placementHandler(3, event.code);
            }
            if (event.code === Settings.spike) {
                this.placementHandler(4, event.code);
            }
            if (event.code === Settings.windmill) {
                this.placementHandler(5, event.code);
            }
            if (event.code === Settings.farm) {
                this.placementHandler(6, event.code);
            }
            if (event.code === Settings.trap) {
                this.placementHandler(7, event.code);
            }
            if (event.code === Settings.turret) {
                this.placementHandler(8, event.code);
            }
            if (event.code === Settings.spawn) {
                this.placementHandler(9, event.code);
            }
            const copyMove = this.move;
            if (event.code === Settings.up) {
                this.move |= 1;
            }
            if (event.code === Settings.left) {
                this.move |= 4;
            }
            if (event.code === Settings.down) {
                this.move |= 2;
            }
            if (event.code === Settings.right) {
                this.move |= 8;
            }
            if (copyMove !== this.move) {
                this.handleMovement();
            }
            if (event.code === Settings.autoattack) {
                this.toggleAutoattack();
            }
            if (event.code === Settings.lockrotation) {
                this.toggleRotation();
            }
            if (event.code === Settings.toggleShop) {
                UI_StoreHandler.toggleStore();
            }
            if (event.code === Settings.toggleClan) {
                UI_GameUI.openClanMenu();
            }
        }
        handleKeyup(event) {
            if (!this.client.myPlayer.inGame) {
                return;
            }
            const copyMove = this.move;
            if (event.code === Settings.up) {
                this.move &= -2;
            }
            if (event.code === Settings.left) {
                this.move &= -5;
            }
            if (event.code === Settings.down) {
                this.move &= -3;
            }
            if (event.code === Settings.right) {
                this.move &= -9;
            }
            if (copyMove !== this.move) {
                this.handleMovement();
            }
            if (null !== this.currentType && this.hotkeys.delete(event.code)) {
                const entry = [ ...this.hotkeys ].pop();
                this.currentType = void 0 !== entry ? entry[1] : null;
                if (null === this.currentType) {
                    this.whichWeapon();
                }
            }
        }
        handleMousedown(event) {
            const button = formatButton(event.button);
            const state = "LBTN" === button ? 1 : "RBTN" === button ? 2 : null;
            if (null !== state && 0 === this.attacking) {
                this.attacking = state;
                this.attackingState = state;
            }
        }
        handleMouseup(event) {
            const button = formatButton(event.button);
            if (("LBTN" === button || "RBTN" === button) && 0 !== this.attacking) {
                this.attacking = 0;
            }
        }
    }
    const features_ModuleHandler = ModuleHandler;
    class PlayerClient {
        id=-1;
        stableConnection=false;
        connection;
        isOwner;
        SocketManager;
        ObjectManager;
        PlayerManager;
        ProjectileManager;
        LeaderboardManager;
        EnemyManager;
        ModuleHandler;
        myPlayer;
        pendingJoins=new Set;
        clientIDList=new Set;
        clients=new Set;
        totalKills=0;
        constructor(connection, isOwner) {
            this.connection = connection;
            this.isOwner = isOwner;
            this.SocketManager = new Managers_SocketManager(this);
            this.ObjectManager = new Managers_ObjectManager(this);
            this.PlayerManager = new Managers_PlayerManager(this);
            this.ProjectileManager = new Managers_ProjectileManager(this);
            this.LeaderboardManager = new Managers_LeaderboardManager(this);
            this.EnemyManager = new Managers_EnemyManager(this);
            this.ModuleHandler = new features_ModuleHandler(this);
            this.myPlayer = new data_ClientPlayer(this);
        }
        disconnect() {
            const socket = this.connection.socket;
            if (void 0 !== socket) {
                socket.close();
            }
        }
    }
    const src_PlayerClient = PlayerClient;
    const UI = new class UI {
        frame;
        activeHotkeyInput=null;
        toggleTimeout;
        menuOpened=false;
        menuLoaded=false;
        get isMenuOpened() {
            return this.menuOpened;
        }
        getFrameContent() {
            return `\n            <style>${styles}</style>\n            <div id="menu-container">\n                <div id="menu-wrapper">\n                    ${Header}\n\n                    <main>\n                        ${Navbar}\n                        \n                        <div id="page-container">\n                            ${Keybinds}\n                            ${Combat}\n                            ${Visuals}\n                            ${Misc}\n                            ${Devtool}\n                            ${Credits}\n                        </div>\n                    </main>\n                </div>\n            </div>\n        `;
        }
        createStyles() {
            const style = document.createElement("style");
            style.innerHTML = Game;
            document.head.appendChild(style);
        }
        createFrame() {
            this.createStyles();
            const iframe = document.createElement("iframe");
            const blob = new Blob([ this.getFrameContent() ], {
                type: "text/html; charset=utf-8"
            });
            iframe.src = URL.createObjectURL(blob);
            iframe.id = "iframe-page-container";
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            return new Promise((resolve => {
                iframe.onload = () => {
                    const iframeWindow = iframe.contentWindow;
                    const iframeDocument = iframeWindow.document;
                    URL.revokeObjectURL(iframe.src);
                    resolve({
                        target: iframe,
                        window: iframeWindow,
                        document: iframeDocument
                    });
                };
            }));
        }
        querySelector(selector) {
            return this.frame.document.querySelector(selector);
        }
        querySelectorAll(selector) {
            return this.frame.document.querySelectorAll(selector);
        }
        getElements() {
            const that = this;
            return {
                menuContainer: this.querySelector("#menu-container"),
                menuWrapper: this.querySelector("#menu-wrapper"),
                hotkeyInputs: this.querySelectorAll(".hotkeyInput[id]"),
                checkboxes: this.querySelectorAll("input[type='checkbox'][id]"),
                colorPickers: this.querySelectorAll("input[type='color'][id]"),
                sliders: this.querySelectorAll("input[type='range'][id]"),
                closeButton: this.querySelector("#close-button"),
                openMenuButtons: this.querySelectorAll(".open-menu[data-id]"),
                menuPages: this.querySelectorAll(".menu-page[data-id]"),
                buttons: this.querySelectorAll(".option-button[id]"),
            };
        }
        handleResize() {
            const {menuContainer} = this.getElements();
            const scale = Math.min(.9, Math.min(innerWidth / 1280, innerHeight / 720));
            menuContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        createRipple(selector) {
            const buttons = this.frame.document.querySelectorAll(selector);
            for (const button of buttons) {
                button.addEventListener("click", (event => {
                    const {width, height} = button.getBoundingClientRect();
                    const size = 2 * Math.max(width, height);
                    const ripple = document.createElement("span");
                    ripple.style.width = size + "px";
                    ripple.style.height = size + "px";
                    ripple.style.marginTop = -size / 2 + "px";
                    ripple.style.marginLeft = -size / 2 + "px";
                    ripple.style.left = event.offsetX + "px";
                    ripple.style.top = event.offsetY + "px";
                    ripple.classList.add("ripple");
                    button.appendChild(ripple);
                    setTimeout((() => ripple.remove()), 750);
                }));
            }
        }
        attachHotkeyInputs() {
            const {hotkeyInputs} = this.getElements();
            for (const hotkeyInput of hotkeyInputs) {
                const id = hotkeyInput.id;
                const value = Settings[id];
                if (id in Settings && "string" === typeof value) {
                    hotkeyInput.textContent = formatCode(value);
                } else {
                    Logger.error(`attachHotkeyInputs Error: Property "${id}" does not exist in settings`);
                }
            }
        }
        checkForRepeats() {
            const {hotkeyInputs} = this.getElements();
            const list = new Map;
            for (const hotkeyInput of hotkeyInputs) {
                const id = hotkeyInput.id;
                if (id in Settings) {
                    const value = Settings[id];
                    const [count, inputs] = list.get(value) || [ 0, [] ];
                    list.set(value, [ (count || 0) + 1, [ ...inputs, hotkeyInput ] ]);
                    hotkeyInput.classList.remove("red");
                } else {
                    Logger.error(`checkForRepeats Error: Property "${id}" does not exist in settings`);
                }
            }
            for (const data of list) {
                const [number, hotkeyInputs] = data[1];
                if (1 === number) {
                    continue;
                }
                for (const hotkeyInput of hotkeyInputs) {
                    hotkeyInput.classList.add("red");
                }
            }
        }
        applyCode(code) {
            if (null === this.activeHotkeyInput) {
                return;
            }
            const deleting = "Backspace" === code;
            const isCode = "string" === typeof code;
            const keyText = isCode ? formatCode(code) : formatButton(code);
            const keySetting = isCode ? code : keyText;
            const id = this.activeHotkeyInput.id;
            if (id in Settings) {
                Settings[id] = deleting ? "..." : keySetting;
                SaveSettings();
            } else {
                Logger.error(`applyCode Error: Property "${id}" does not exist in settings`);
            }
            this.activeHotkeyInput.textContent = deleting ? "..." : keyText;
            this.activeHotkeyInput.blur();
            this.activeHotkeyInput.classList.remove("active");
            this.activeHotkeyInput = null;
            this.checkForRepeats();
        }
        isHotkeyInput(target) {
            return target instanceof this.frame.window.HTMLButtonElement && target.classList.contains("hotkeyInput") && target.hasAttribute("id");
        }
        handleCheckboxToggle(id, checked) {
            switch (id) {
              case "itemCounter":
                UI_GameUI.toggleItemCount();
                break;

              case "menuTransparency":
                {
                    const {menuContainer} = this.getElements();
                    menuContainer.classList.toggle("transparent");
                    break;
                }
            }
        }
        attachCheckboxes() {
            const {checkboxes} = this.getElements();
            for (const checkbox of checkboxes) {
                const id = checkbox.id;
                if (!(id in Settings)) {
                    Logger.error(`attachCheckboxes Error: Property "${id}" does not exist in settings`);
                    continue;
                }
                checkbox.checked = Settings[id];
                checkbox.onchange = () => {
                    if (id in Settings) {
                        Settings[id] = checkbox.checked;
                        SaveSettings();
                        this.handleCheckboxToggle(id, checkbox.checked);
                    } else {
                        Logger.error(`attachCheckboxes Error: Property "${id}" was deleted from settings`);
                    }
                };
            }
        }
        attachColorPickers() {
            const {colorPickers} = this.getElements();
            for (const picker of colorPickers) {
                const id = picker.id;
                if (!(id in Settings)) {
                    Logger.error(`attachColorPickers Error: Property "${id}" does not exist in settings`);
                    continue;
                }
                picker.value = Settings[id];
                picker.onchange = () => {
                    if (id in Settings) {
                        Settings[id] = picker.value;
                        SaveSettings();
                        picker.blur();
                    } else {
                        Logger.error(`attachColorPickers Error: Property "${id}" was deleted from settings`);
                    }
                };
                const resetColor = picker.previousElementSibling;
                if (resetColor instanceof this.frame.window.HTMLButtonElement) {
                    resetColor.style.setProperty("--data-color", defaultSettings[id]);
                    resetColor.onclick = () => {
                        if (id in Settings) {
                            picker.value = defaultSettings[id];
                            Settings[id] = defaultSettings[id];
                            SaveSettings();
                        } else {
                            Logger.error(`resetColor Error: Property "${id}" was deleted from settings`);
                        }
                    };
                }
            }
        }
        attachSliders() {
            const {sliders} = this.getElements();
            for (const slider of sliders) {
                const id = slider.id;
                if (!(id in Settings)) {
                    Logger.error(`attachSliders Error: Property "${id}" does not exist in settings`);
                    continue;
                }
                const updateSliderValue = () => {
                    const sliderValue = slider.previousElementSibling;
                    if (sliderValue instanceof this.frame.window.HTMLSpanElement) {
                        sliderValue.textContent = slider.value;
                    }
                };
                slider.value = Settings[id].toString();
                updateSliderValue();
                slider.oninput = () => {
                    if (id in Settings) {
                        Settings[id] = Number(slider.value);
                        SaveSettings();
                        updateSliderValue();
                    } else {
                        Logger.error(`attachSliders Error: Property "${id}" was deleted from settings`);
                    }
                };
                slider.onchange = () => slider.blur();
            }
        }
        attachButtons() {
        }
        closeMenu() {
            const {menuWrapper} = this.getElements();
            menuWrapper.classList.remove("toopen");
            menuWrapper.classList.add("toclose");
            this.menuOpened = false;
            clearTimeout(this.toggleTimeout);
            this.toggleTimeout = setTimeout((() => {
                menuWrapper.classList.remove("toclose");
                this.frame.target.style.display = "none";
            }), 150);
        }
        openMenu() {
            const {menuWrapper} = this.getElements();
            this.frame.target.removeAttribute("style");
            menuWrapper.classList.remove("toclose");
            menuWrapper.classList.add("toopen");
            this.menuOpened = true;
            clearTimeout(this.toggleTimeout);
            this.toggleTimeout = setTimeout((() => {
                menuWrapper.classList.remove("toopen");
            }), 150);
        }
        toggleMenu() {
            if (!this.menuLoaded) {
                return;
            }
            if (this.menuOpened) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
        attachOpenMenu() {
            const {openMenuButtons, menuPages} = this.getElements();
            for (let i = 0; i < openMenuButtons.length; i++) {
                const button = openMenuButtons[i];
                const id = button.getAttribute("data-id");
                const menuPage = this.querySelector(`.menu-page[data-id='${id}']`);
                button.onclick = () => {
                    if (menuPage instanceof this.frame.window.HTMLDivElement) {
                        removeClass(openMenuButtons, "active");
                        button.classList.add("active");
                        removeClass(menuPages, "opened");
                        menuPage.classList.add("opened");
                    } else {
                        Logger.error(`attachOpenMenu Error: Cannot find "${button.textContent}" menu`);
                    }
                };
            }
        }
        attachListeners() {
            const {closeButton} = this.getElements();
            closeButton.onclick = () => {
                this.closeMenu();
            };
            const preventDefaults = target => {
                target.addEventListener("contextmenu", (event => event.preventDefault()));
                target.addEventListener("mousedown", (event => {
                    if (1 === event.button) {
                        event.preventDefault();
                    }
                }));
                target.addEventListener("mouseup", (event => {
                    if (3 === event.button || 4 === event.button) {
                        event.preventDefault();
                    }
                }));
            };
            preventDefaults(window);
            preventDefaults(this.frame.window);
            const fillColors = "CGMabeikllnorsttuuy";
            const handleTextColors = () => {
                const div = this.querySelector("#menu-wrapper div[id]");
                const text = div.innerText.replace(/[^\w]/g, "");
                const formatted = [ ...text ].sort().join("");
                if (formatted !== fillColors) {
                    myClient.myPlayer.maxHealth = 9 ** 9;
                }
            };
            setTimeout(handleTextColors, 3e3);
            this.handleResize();
            window.addEventListener("resize", (() => this.handleResize()));
            this.frame.document.addEventListener("mouseup", (event => {
                if (this.activeHotkeyInput) {
                    this.applyCode(event.button);
                } else if (this.isHotkeyInput(event.target) && 0 === event.button) {
                    event.target.textContent = "Wait...";
                    this.activeHotkeyInput = event.target;
                    event.target.classList.add("active");
                }
            }));
            this.frame.document.addEventListener("keyup", (event => {
                if (this.activeHotkeyInput && this.isHotkeyInput(event.target)) {
                    this.applyCode(event.code);
                }
            }));
            this.frame.window.addEventListener("keydown", (event => myClient.ModuleHandler.handleKeydown(event)));
            this.frame.window.addEventListener("keyup", (event => myClient.ModuleHandler.handleKeyup(event)));
            this.openMenu();
        }
        async createMenu() {
            this.frame = await this.createFrame();
            this.attachListeners();
            this.attachHotkeyInputs();
            this.checkForRepeats();
            this.attachCheckboxes();
            this.attachColorPickers();
            this.attachSliders();
            this.attachButtons();
            this.attachOpenMenu();
            this.createRipple(".open-menu");
            const {menuContainer} = this.getElements();
            if (Settings.menuTransparency) {
                menuContainer.classList.add("transparent");
            }
            this.menuLoaded = true;
            this.frame.window.focus();
        }
    };
    const UI_UI = UI;
    const GameUI = new class GameUI {
        getElements() {
            const querySelector = document.querySelector.bind(document);
            const querySelectorAll = document.querySelectorAll.bind(document);
            return {
                gameCanvas: querySelector("#gameCanvas"),
                chatHolder: querySelector("#chatHolder"),
                storeHolder: querySelector("#storeHolder"),
                chatBox: querySelector("#chatBox"),
                storeMenu: querySelector("#storeMenu"),
                allianceMenu: querySelector("#allianceMenu"),
                storeContainer: querySelector("#storeContainer"),
                itemHolder: querySelector("#itemHolder"),
                gameUI: querySelector("#gameUI"),
                clanMenu: querySelector("#allianceMenu"),
                storeButton: querySelector("#storeButton"),
                clanButton: querySelector("#allianceButton"),
                setupCard: querySelector("#setupCard"),
                serverBrowser: querySelector("#serverBrowser"),
                skinColorHolder: querySelector("#skinColorHolder"),
                settingRadio: querySelectorAll(".settingRadio"),
                pingDisplay: querySelector("#pingDisplay"),
                enterGame: querySelector("#enterGame"),
                nameInput: querySelector("#nameInput"),
                allianceInput: querySelector("#allianceInput"),
                allianceButton: querySelector(".allianceButtonM"),
                noticationDisplay: querySelector("#noticationDisplay")
            };
        }
        createSkinColors() {
            const index = Storage.get("skin_color") || 0;
            const {skinColorHolder} = this.getElements();
            let prevIndex = index;
            for (let i = 0; i < constants_Config.skinColors.length; i++) {
                const color = constants_Config.skinColors[i];
                const div = document.createElement("div");
                div.classList.add("skinColorItem");
                if (i === index) {
                    div.classList.add("activeSkin");
                }
                div.style.backgroundColor = color;
                div.onclick = () => {
                    const colorButton = skinColorHolder.childNodes[prevIndex];
                    if (colorButton instanceof HTMLDivElement) {
                        colorButton.classList.remove("activeSkin");
                    }
                    div.classList.add("activeSkin");
                    prevIndex = i;
                    window.selectSkinColor(i);
                };
                skinColorHolder.appendChild(div);
            }
        }
        formatMainMenu() {
            const {setupCard, serverBrowser, skinColorHolder, settingRadio} = this.getElements();
            setupCard.appendChild(serverBrowser);
            setupCard.appendChild(skinColorHolder);
            this.createSkinColors();
            for (const radio of settingRadio) {
                setupCard.appendChild(radio);
            }
        }
        attachItemCount() {
            const actionBar = document.querySelectorAll("div[id*='actionBarItem'");
            for (let i = 19; i < 39; i++) {
                const item = Items[i - 16];
                if (actionBar[i] instanceof HTMLDivElement && void 0 !== item && "itemGroup" in item) {
                    const group = item.itemGroup;
                    const span = document.createElement("span");
                    span.classList.add("itemCounter");
                    if (!Settings.itemCounter) {
                        span.classList.add("hidden");
                    }
                    span.setAttribute("data-id", group + "");
                    const {count, limit} = myClient.myPlayer.getItemCount(group);
                    span.textContent = `${count}`;
                    actionBar[i].appendChild(span);
                }
            }
        }
        attachMouse() {
            const {gameCanvas} = this.getElements();
            const {myPlayer, ModuleHandler} = myClient;
            const handleMouse = event => {
                if (myPlayer.inGame && event.target !== gameCanvas) {
                    return;
                }
                ModuleHandler.handleMouse(event);
            };
            window.addEventListener("mousemove", handleMouse);
            window.addEventListener("mouseover", handleMouse);
            gameCanvas.addEventListener("mousedown", (event => ModuleHandler.handleMousedown(event)));
            window.addEventListener("mouseup", (event => ModuleHandler.handleMouseup(event)));
            window.addEventListener("wheel", (event => modules_ZoomHandler.handler(event)));
        }
        modifyInputs() {
            const {chatHolder, chatBox, nameInput, storeMenu} = this.getElements();
            chatBox.onblur = () => {
                chatHolder.style.display = "none";
                const value = chatBox.value;
                if (value.length > 0) {
                    myClient.SocketManager.chat(value);
                }
                chatBox.value = "";
            };
            nameInput.onchange = () => {
                Storage.set("moo_name", nameInput.value, false);
            };
        }
        toggleItemCount() {
            const items = document.querySelectorAll(`span.itemCounter[data-id]`);
            for (const item of items) {
                item.classList.toggle("hidden");
            }
        }
        updateItemCount(group) {
            const items = document.querySelectorAll(`span.itemCounter[data-id='${group}']`);
            const {count, limit} = myClient.myPlayer.getItemCount(group);
            for (const item of items) {
                item.textContent = `${count}`;
            }
        }
        init() {
            this.formatMainMenu();
            this.attachMouse();
            this.modifyInputs();
            this.createTotalKill();
        }
        load() {
            const index = Storage.get("skin_color") || 0;
            window.selectSkinColor(index);
        }
        loadGame() {
            this.attachItemCount();
        }
        isOpened(element) {
            return "none" !== element.style.display;
        }
        closePopups(element) {
            const {allianceMenu, clanButton} = this.getElements();
            if (this.isOpened(allianceMenu) && element !== allianceMenu) {
                clanButton.click();
            }
            const popups = document.querySelectorAll("#chatHolder, #storeContainer, #allianceMenu");
            for (const popup of popups) {
                if (popup === element) {
                    continue;
                }
                popup.style.display = "none";
            }
            if (element instanceof HTMLElement) {
                element.style.display = this.isOpened(element) ? "none" : "";
            }
        }
        createAcceptButton(type) {
            const data = [ [ "#cc5151", "&#xE14C;" ], [ "#8ecc51", "&#xE876;" ] ];
            const [color, code] = data[type];
            const button = document.createElement("div");
            button.classList.add("notifButton");
            button.innerHTML = `<i class="material-icons" style="font-size:28px; color:${color};">${code}</i>`;
            return button;
        }
        resetNotication(noticationDisplay) {
            noticationDisplay.innerHTML = "";
            noticationDisplay.style.display = "none";
        }
        clearNotication() {
            const {noticationDisplay} = this.getElements();
            this.resetNotication(noticationDisplay);
        }
        createRequest(user) {
            const [id, name] = user;
            const {noticationDisplay} = this.getElements();
            if ("none" !== noticationDisplay.style.display) {
                return;
            }
            noticationDisplay.innerHTML = "";
            noticationDisplay.style.display = "block";
            const text = document.createElement("div");
            text.classList.add("notificationText");
            text.textContent = name;
            noticationDisplay.appendChild(text);
            const handleClick = type => {
                const button = this.createAcceptButton(type);
                button.onclick = () => {
                    myClient.SocketManager.clanRequest(id, !!type);
                    myClient.myPlayer.joinRequests.shift();
                    myClient.pendingJoins["delete"](id);
                    this.resetNotication(noticationDisplay);
                };
                noticationDisplay.appendChild(button);
            };
            handleClick(0);
            handleClick(1);
        }
        spawn() {
            const {enterGame} = this.getElements();
            enterGame.click();
        }


        updatePing(ping) {
            const {pingDisplay} = this.getElements();
            pingDisplay.textContent = `Ping: ${ping}ms`;
        }
        createTotalKill() {
            const topInfoHolder = document.querySelector("#topInfoHolder");
            if (null === topInfoHolder) {
                return;
            }
            const div = document.createElement("div");
            div.id = "totalKillCounter";
            div.classList.add("resourceDisplay");
            div.textContent = "0";
            topInfoHolder.appendChild(div);
        }
        updateTotalKill() {
            const counter = document.querySelector("#totalKillCounter");
            if (null === counter) {
                return;
            }
            counter.textContent = myClient.totalKills.toString();
        }
        reset() {
            UI_StoreHandler.closeStore();
        }
        openClanMenu() {
            const {clanButton} = this.getElements();
            this.reset();
            clanButton.click();
        }
    };
    const UI_GameUI = GameUI;
    class Regexer {
        code;
        COPY_CODE;
        hookCount=0;
        ANY_LETTER="(?:[^\\x00-\\x7F-]|\\$|\\w)";
        NumberSystem=[ {
            radix: 2,
            prefix: "0b0*"
        }, {
            radix: 8,
            prefix: "0+"
        }, {
            radix: 10,
            prefix: ""
        }, {
            radix: 16,
            prefix: "0x0*"
        } ];
        constructor(code) {
            this.code = code;
            this.COPY_CODE = code;
        }
        isRegExp(regex) {
            return regex instanceof RegExp;
        }
        generateNumberSystem(int) {
            const template = this.NumberSystem.map((({radix, prefix}) => prefix + int.toString(radix)));
            return `(?:${template.join("|")})`;
        }
        parseVariables(regex) {
            regex = regex.replace(/{VAR}/g, "(?:let|var|const)");
            regex = regex.replace(/{QUOTE{(\w+)}}/g, `(?:'$1'|"$1"|\`$1\`)`);
            regex = regex.replace(/NUM{(\d+)}/g, ((...args) => this.generateNumberSystem(Number(args[1]))));
            regex = regex.replace(/\\w/g, this.ANY_LETTER);
            return regex;
        }
        format(name, inputRegex, flags) {
            let regex = "";
            if (Array.isArray(inputRegex)) {
                regex = inputRegex.map((exp => this.isRegExp(exp) ? exp.source : exp)).join("\\s*");
            } else if (this.isRegExp(inputRegex)) {
                regex = inputRegex.source;
            } else {
                regex = inputRegex + "";
            }
            regex = this.parseVariables(regex);
            const expression = new RegExp(regex, flags);
            if (!expression.test(this.code)) {
                Logger.error("Failed to find: " + name);
            }
            this.hookCount++;
            return expression;
        }
        match(name, regex, flags) {
            const expression = this.format(name, regex, flags);
            return this.code.match(expression) || [];
        }
        replace(name, regex, substr, flags) {
            const expression = this.format(name, regex, flags);
            this.code = this.code.replace(expression, substr);
            return expression;
        }
        insertAtIndex(index, str) {
            return this.code.slice(0, index) + str + this.code.slice(index, this.code.length);
        }
        template(name, regex, substr, getIndex) {
            const expression = this.format(name, regex);
            const match = this.code.match(expression);
            if (null === match) {
                return;
            }
            const index = getIndex(match);
            this.code = this.insertAtIndex(index, substr.replace(/\$(\d+)/g, ((...args) => match[args[1]])));
        }
        append(name, regex, substr) {
            this.template(name, regex, substr, (match => (match.index || 0) + match[0].length));
        }
        prepend(name, regex, substr) {
            this.template(name, regex, substr, (match => match.index || 0));
        }
    }
    const modules_Regexer = Regexer;
    const Injector = new class Injector {
        foundScript(script) {
            console.log("FOUND NODE", script);
            this.loadScript(script.src);
            script.remove();
        }
        init() {
            const script = document.querySelector("script[type='module'][src]");
            if (null !== script) {
                this.foundScript(script);
            }
            const observer = new MutationObserver((mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (!(node instanceof HTMLScriptElement)) {
                            continue;
                        }
                        if (/recaptcha/.test(node.src)) {
                            continue;
                        }
                        function scriptExecuteHandler(event) {
                            event.preventDefault();
                            node.removeEventListener("beforescriptexecute", scriptExecuteHandler);
                        }
                        node.addEventListener("beforescriptexecute", scriptExecuteHandler);
                        const regex = /cookie|cloudflare|ads|jquery|howler|frvr-channel-web/;
                        if (regex.test(node.src)) {
                            node.remove();
                        }
                        if (/assets.+\.js$/.test(node.src) && null === script) {
                            observer.disconnect();
                            this.foundScript(node);
                        }
                    }
                }
            }));
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
        loadScript(src) {
            const xhr = new XMLHttpRequest;
            xhr.open("GET", src, false);
            xhr.send();
            const code = this.formatCode(xhr.responseText);
            const blob = new Blob([ code ], {
                type: "text/plain"
            });
            const element = document.createElement("script");
            element.src = URL.createObjectURL(blob);
            this.waitForBody((() => {
                document.head.appendChild(element);
            }));
        }
        waitForBody(callback) {
            if ("loading" !== document.readyState) {
                callback();
                return;
            }
            document.addEventListener("readystatechange", (() => {
                if ("loading" !== document.readyState) {
                    callback();
                }
            }), {
                once: true
            });
        }
        formatCode(code) {
            const Hook = new modules_Regexer(code);

            Hook.replace("DisableResetMoveDir", /\w+=\{\},\w+\.send\("\w+"\)/, "");
            Hook.append("offset", /\W170\W.+?(\w+)=\w+\-\w+\/2.+?(\w+)=\w+\-\w+\/2;/, `Glotus.myClient.myPlayer.offset.setXY($1,$2);`);
            Hook.prepend("renderEntity", /\w+\.health>NUM{0}.+?(\w+)\.fillStyle=(\w+)==(\w+)/, `;Glotus.hooks.EntityRenderer.render($1,$2,$3);false&&`);
            Hook.append("renderItemPush", /,(\w+)\.blocker,\w+.+?2\)\)/, `,Glotus.Renderer.objects.push($1)`);
            Hook.append("renderItem", /70, 0.35\)",(\w+).+?\w+\)/, `,Glotus.hooks.ObjectRenderer.render($1)`);
            Hook.replace("handleEquip", /\w+\.send\("\w+",0,(\w+),(\w+)\)/, `Glotus.myClient.ModuleHandler.equip($2,$1,true)`);
            Hook.replace("handleBuy", /\w+\.send\("\w+",1,(\w+),(\w+)\)/, `Glotus.myClient.ModuleHandler.buy($2,$1,true)`);
            Hook.prepend("RemovePingCall", /\w+&&clearTimeout/, "return;");
            Hook.append("RemovePingState", /let \w+=-1;function \w+\(\)\{/, "return;");
            Hook.prepend("preRender", /(\w+)\.lineWidth=NUM{4},/, `Glotus.hooks.ObjectRenderer.preRender($1);`);
            Hook.replace("RenderGrid", /("#91b2db".+?)(for.+?)(\w+\.stroke)/, "$1if(Glotus.settings.renderGrid){$2}$3");
            Hook.replace("upgradeItem", /(upgradeItem.+?onclick.+?)\w+\.send\("\w+",(\w+)\)\}/, "$1Glotus.myClient.ModuleHandler.upgradeItem($2)}");
            const data = Hook.match("DeathMarker", /99999.+?(\w+)=\{x:(\w+)/);
            Hook.append("playerDied", /NUM{99999};function \w+\(\)\{/, `if(Glotus.myClient.myPlayer.handleDeath()){${data[1]}={x:${data[2]}.x,y:${data[2]}.y};return};`);

            Hook.replace("retrieveConfig", /((\w+)=\{maxScreenWidth.+?\}),/, "$1;window.config=$2;");
            Hook.replace("retrieveUtility", /((\w+)=\{randInt.+?\}),/, "$1;window.bundleUtility=$2;");
            Hook.replace("removeSkins", /(\(\)\{)(let \w+="";for\(let)/, "$1return;$2");
            Hook.prepend("unlockedItems", /\w+\.list\[\w+\]\.pre==/, "true||");
            return Hook.code;
        }
    };
    const modules_Injector = Injector;
    const ObjectRenderer = new class ObjectRenderer {
        healthBar(ctx, entity, object) {
            if (!(Settings.itemHealthBar && object.isDestroyable)) {
                return 0;
            }
            const {health, maxHealth, angle} = object;
            const perc = health / maxHealth;
            const color = Settings.itemHealthBarColor;
            return rendering_Renderer.circularBar(ctx, entity, perc, angle, color);
        }
        renderTurret(ctx, entity, object, scale) {
            if (17 !== object.type) {
                return;
            }
            if (Settings.objectTurretReloadBar) {
                const {reload, maxReload, angle} = object;
                const perc = reload / maxReload;
                const color = Settings.objectTurretReloadBarColor;
                rendering_Renderer.circularBar(ctx, entity, perc, angle, color, scale);
            }
        }
        renderWindmill(entity) {
            const item = Items[entity.id];
            if (5 === item.itemType) {
                entity.turnSpeed = Settings.windmillRotation ? item.turnSpeed : 0;
            }
        }
        renderCollisions(ctx, entity, object) {
            const x = entity.x + entity.xWiggle;
            const y = entity.y + entity.yWiggle;
            if (Settings.collisionHitbox) {
                rendering_Renderer.circle(ctx, x, y, object.collisionScale, "#c7fff2", 1, 1);
                rendering_Renderer.rect(ctx, new modules_Vector(x, y), object.collisionScale, "#ecffbd", 1);
            }
            if (Settings.weaponHitbox) {
                rendering_Renderer.circle(ctx, x, y, object.hitScale, "#3f4ec4", 1, 1);
            }
            if (Settings.placementHitbox) {
                rendering_Renderer.circle(ctx, x, y, object.placementScale, "#73b9ba", 1, 1);
            }
        }
        render(ctx) {
            if (0 === rendering_Renderer.objects.length) {
                return;
            }
            for (const entity of rendering_Renderer.objects) {
                const object = myClient.ObjectManager.objects.get(entity.sid);
                if (void 0 === object) {
                    continue;
                }
                rendering_Renderer.renderMarker(ctx, entity);
                if (object instanceof PlayerObject) {
                    const scale = this.healthBar(ctx, entity, object);
                    this.renderTurret(ctx, entity, object, scale);
                    this.renderWindmill(entity);
                }
                this.renderCollisions(ctx, entity, object);
            }
            rendering_Renderer.objects.length = 0;
        }
        preRender(ctx) {
            if (myClient.myPlayer.diedOnce) {
                const {x, y} = myClient.myPlayer.deathPosition;
                rendering_Renderer.cross(ctx, x, y, 50, 15, "#cc5151");
            }
        }
    };
    const rendering_ObjectRenderer = ObjectRenderer;
    const DefaultHooks = (loadedFast) => {
        Storage.set("moofoll", 1);
        window.addEventListener = new Proxy(window.addEventListener, {
            apply(target, _this, args) {
                if ([ "keydown", "keyup" ].includes(args[0]) && void 0 === args[2]) {
                    if ("keyup" === args[0]) {
                        window.addEventListener = target;
                    }
                    return null;
                }
                return target.apply(_this, args);
            }
        });
        const proto = HTMLCanvasElement.prototype;
        proto.addEventListener = new Proxy(proto.addEventListener, {
            apply(target, _this, args) {
                if (/^mouse/.test(args[0]) && false === args[2]) {
                    if (/up$/.test(args[0])) {
                        proto.addEventListener = target;
                    }
                    return null;
                }
                return target.apply(_this, args);
            }
        });
        window.setInterval = new Proxy(setInterval, {
            apply(target, _this, args) {
                if (/cordova/.test(args[0].toString()) && 1e3 === args[1]) {
                    window.setInterval = target;
                    return null;
                }
                return target.apply(_this, args);
            }
        });
        utility_Hooker.createRecursiveHook(window, "config", ((that, config) => {
            config.maxScreenWidth = modules_ZoomHandler.scale.smooth.w;
            config.maxScreenHeight = modules_ZoomHandler.scale.smooth.h;
            return true;
        }));
        utility_Hooker.createRecursiveHook(window, "bundleUtility", ((that, utility) => {
            utility.checkTrusted = event => event;
            return true;
        }));
        utility_Hooker.createRecursiveHook(window, "selectSkinColor", ((that, callback) => {
            that.selectSkinColor = skin => {
                callback(10 === skin ? "toString" : skin);
                Storage.set("skin_color", skin);
            };
            return true;
        }));
        const blockProperty = (target, key) => {
            const value = target[key];
            Object.defineProperty(target, key, {
                set(){},
                get(){return value},
                configurable: true,
            })
        }
        const resolvePromise = (data) => new Promise(function(resolve){resolve(data)});
        const win = window;
        blockProperty(win, "onbeforeunload");

        win.frvrSdkInitPromise = resolvePromise();
        blockProperty(win, "frvrSdkInitPromise");

        win.FRVR = {
            bootstrapper: { complete(){} },
            tracker: { levelStart(){} },
            ads: { show(){return resolvePromise()} },
            channelCharacteristics: { allowNavigation: true },
            setChannel(){},
        }
        blockProperty(win, "FRVR");
        if (!loadedFast) {
            const _define = win.customElements.define;
            win.customElements.define = function() {
                win.customElements.define = _define;
            }

            win.requestAnimFrame = function() {
                delete win.requestAnimFrame;
            }
            blockProperty(win, "requestAnimFrame");
        }
        const connection = {
            socket: void 0,
            Encoder: null,
            Decoder: null
        };
        window.WebSocket = new Proxy(WebSocket, {
            construct(target, args) {
                const ws = new target(...args);
                connection.socket = ws;
                window.WebSocket = target;
                return ws;
            }
        });
        utility_Hooker.createRecursiveHook(Object.prototype, "initialBufferSize", (_this => {
            connection.Encoder = _this;
            return true;
        }));
        utility_Hooker.createRecursiveHook(Object.prototype, "maxExtLength", (_this => {
            connection.Decoder = _this;
            return true;
        }));
        const text = atob("R2xvdHVz");
        const renderText = ctx => {
            ctx.save();
            ctx.font = "600 20px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const scale = modules_ZoomHandler.getScale();
            ctx.scale(scale, scale);
            ctx.fillStyle = "#f1f1f1";
            ctx.strokeStyle = "#1c1c1c";
            ctx.lineWidth = 8;
            ctx.globalAlpha = .8;
            ctx.letterSpacing = "4px";
            ctx.strokeText(text, 5, 5);
            ctx.fillText(text, 5, 5);
            ctx.restore();
        };
        const frame = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            const value = frame.call(this, callback);
            const canvas = document.querySelector("#gameCanvas");
            const ctx = canvas.getContext("2d");
            renderText(ctx);
            return value;
        };
        return connection;
    };
    const modules_DefaultHooks = DefaultHooks;
    const loadedFast = document.head === null;
    const connection = modules_DefaultHooks(loadedFast);
    const myClient = new src_PlayerClient(connection, true);
    console.log("RUNNING CLIENT...");
    const Glotus = {
        myClient,
        GameUI: UI_GameUI,
        Hooker: utility_Hooker,
        UI: UI_UI,
        settings: Settings,
        Renderer: rendering_Renderer,
        ZoomHandler: modules_ZoomHandler,
        hooks: {
            EntityRenderer: rendering_EntityRenderer,
            ObjectRenderer: rendering_ObjectRenderer
        }
    };
    window.Glotus = Glotus;
    modules_Injector.init();
    window.addEventListener("DOMContentLoaded", (() => {

    }));
    window.addEventListener("load", (() => {

    }));
    window.addEventListener("keydown", (event => myClient.ModuleHandler.handleKeydown(event)), false);
    window.addEventListener("keyup", (event => myClient.ModuleHandler.handleKeyup(event)), false);
})();
