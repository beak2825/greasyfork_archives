// ==UserScript==
// @name         n-Nurbo client
// @namespace    http://youtube.com
// @version      1.6.1.0
// @description  Bot =  P    Shift=Insta, AutoBiomehat Autoheal, F=Trap, V=Spike, C=4Spikes, B=4Traps, N=Mill. Glotus AutoBreak for traps.
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
// @downloadURL https://update.greasyfork.org/scripts/560817/n-Nurbo%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/560817/n-Nurbo%20client.meta.js
// ==/UserScript==

let multiboxAlts = [];
const mousePosition = {x: 0, y: 0};
const FOLLOW_DISTANCE = 100; // расстояние следования бота за игроком в пикселях

const upgradeOptions = {}; // когда основной игрок улучшается в определенном возрасте, ID предмета, на который он улучшается, будет сохранен здесь.

let placingSpikes = false;
let placingTraps = false;
let repellingAlts = false;
let automill = false;

// Храним позицию игрока для быстрого доступа
let mainPlayerPosition = {x: 0, y: 0};
let mainPlayerUpdated = false;

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
        let timeout = 80;
        if (currentHealth <= 60) {
            timeout = 25;
        };
        setTimeout(() => {
            this.useItem(0); // heal with apple
            this.useItem(1); // heal with cookie
        }, timeout);
    };

    moveTowardsDirection(angle) {
        this.sendMsg(['9', [angle]]);
    };

    stopMoving() {
        this.sendMsg(['9', [null]]); // null останавливает движение
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

    placeTrap() {
        return this.useItem(15);
    };

    placeBoost() {
        return this.useItem(16);
    };

    placeSpike(spikeType) {
        switch (spikeType) {
            case 'regular':
                this.useItem(6);
                break;
            case 'greater':
                this.useItem(7);
                break;
            case 'poison':
                this.useItem(8);
                break;
            case 'spinning':
                this.useItem(9);
                break;
        };
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
            case 'C': // C means id. it is a message received from the server that tells you what your entity ID is.
                this.entity.id = data[1][0];
                break;
            case 'O': // O means health change. it follows this format: ['O', [entityId, health]]
                // autoheal causes u to get the clown hat very quickly, but who cares when you have 30 alts as well as op insta?
                if (data[1][0] == this.entity.id) this.entity.health = data[1][1];
                if (data[1][0] == this.entity.id && this.autoheal && data[1][1] < 100) this.input.healPlayer(this.entity.health);
                break;
            case 'a':
                // credits to the creator of x-RedDragon client for most of this
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

                        // Обновляем глобальную позицию главного игрока
                        if (this.ws === document.ws) {
                            mainPlayerPosition.x = playerInfo[1];
                            mainPlayerPosition.y = playerInfo[2];
                            mainPlayerUpdated = true;
                        }
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
    constructor(name, serverUrl) {
        this.powSolver = new PowSolver();
        this.name = name;
        this.age = 1;
        this.lastFollowTime = 0;
        this.followInterval = 20; // обновляем движение каждые 100мс

        this.powSolver.generateAltchaToken().then((token) => {
            this.ws = new WebSocket(document.ws.url.split('?token=')[0] + `?token=${token}`);
            this.ws.binaryType = 'arraybuffer';
            this.ws.player = new Player(this.ws);
            this.ws.addEventListener('message', this.handleMessage.bind(this));

            // Запускаем интервал для плавного следования
            setInterval(() => {
                this.followMainPlayer();
            }, this.followInterval);

            setInterval(() => {
                this.ws.player.input.sendChatMessage('Nurbo mode Age: ' + this.age);
                if (!this.ws.player.fullyUpgraded) {
                    try {
                        this.ws.player.input.sendMsg(['H', [upgradeOptions[this.ws.player.upgradeAge]]]);
                    } catch(e) {
                        ; // do nothing
                    };
                };
            }, 30000);
        });
    };

    followMainPlayer() {
        const now = Date.now();
        if (now - this.lastFollowTime < this.followInterval) return;

        this.lastFollowTime = now;

        // Используем глобальные координаты игрока
        if (!mainPlayerUpdated) return;

        // Вычисляем направление к курсору (для атаки/цели)
        const mouseXWorld = (mainPlayerPosition.x - this.ws.player.entity.position.x) + (mousePosition.x - (window.innerWidth / 2)) * (1+(1/3));
        const mouseYWorld = (mainPlayerPosition.y - this.ws.player.entity.position.y) + (mousePosition.y - (window.innerHeight / 2)) * (1+(1/3));
        const aimDir = Math.atan2(mouseYWorld, mouseXWorld);

        // Всегда поворачиваемся к курсору (целимся)
        this.ws.player.input.sendMsg(['D', [aimDir]]);

        // Вычисляем расстояние до игрока
        const distanceX = mainPlayerPosition.x - this.ws.player.entity.position.x;
        const distanceY = mainPlayerPosition.y - this.ws.player.entity.position.y;
        const distanceToPlayer = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Вычисляем направление к игроку (для следования)
        const followDir = Math.atan2(distanceY, distanceX);

        // Логика следования: двигаемся к игроку если далеко, останавливаемся если близко
        if (distanceToPlayer > FOLLOW_DISTANCE) {
            // Двигаемся к игроку
            if (repellingAlts) {
                this.ws.player.input.moveTowardsDirection(followDir - 2.35619);
            } else {
                this.ws.player.input.moveTowardsDirection(followDir);
            }
        } else {
            // Останавливаемся если достаточно близко
            this.ws.player.input.stopMoving();

            // Если очень близко и включен repel, отталкиваемся немного
            if (repellingAlts && distanceToPlayer < 20) {
                this.ws.player.input.moveTowardsDirection(followDir - Math.PI);
            }
        }
    };

    handleMessage(msg) {
        const data = this.ws.player.input.msgpack.decode(msg.data);
        switch (data[0]) {
            case 'io-init':
                multiboxAlts.push(this.ws);
                this.ws.player.input.sendEnterWorld(this.name);
                setInterval(() => { // attempt to respawn every second and join clan
                    this.ws.player.input.sendEnterWorld(this.name);
                    this.ws.player.input.joinTribe(document.ws.player.entity.clan);
                }, 1000);
                updateAltsCounter();
                console.log(multiboxAlts.length);
                break;
            case 'U':
                this.age = (data[1][0] + data[1][1]) - 1;
        };
    };
};

const init2 = () => {
    document.getElementById('promoImgHolder').remove(); // remove the promo
    for (let i = 0; i < document.getElementsByClassName('adsbygoogle').length; i++) {
        document.getElementsByClassName('adsbygoogle')[0].remove();
    };


    const altCounter = document.createElement('h2');
    altCounter.style = 'text-align: center; font-size: 18x; position: fixed; top: 10px; left: 50%; transform: translateX(-50%);';
    altCounter.innerHTML = 'Alts: <span id="altsCounter">0</span>';
    document.getElementById('gameUI').appendChild(altCounter);

    document.getElementById('touch-controls-fullscreen').addEventListener('mousemove', (e) => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    });

    // store the main player's websocket in the document
    const originalWebSocket = WebSocket;

    const wsInterceptor = {
        construct(target, args) {
            const ws = new originalWebSocket(...args);
            document.ws = ws;
            console.log('captured ws');
            window.WebSocket = originalWebSocket; // this sets the websocket constructor back to normal

            document.ws.player = new Player(document.ws);
            window.addEventListener('keyup', (e) => {
                if (e.target.tagName === 'INPUT') {
                    return;
                };

                if (e.key === 'p') {
            new Bot(`n-${Math.floor(Math.random() * 100) + 1}`);
        }

                if (e.key === ',') {
                    multiboxAlts.forEach((sock) => {
                        sock.close();
                    })
                    multiboxAlts = [];
                    updateAltsCounter();
                };

                if (e.key === 'm') {
                    automill = !automill;
                };

                if (e.key === 'v') {
                    placingSpikes = false;
                };

                if (e.key === 'f') {
                    placingTraps = false;
                };

                if (e.key === 'z') {
                    repellingAlts = false;
                };
            });

            window.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT') {
                    return;
                };

                if (e.key === 'f') {
                    placingTraps = true;
                };

                if (e.key === 'v') {
                    placingSpikes = true;
                };

                if (e.key === 'z') {
                    repellingAlts = true;
                };
            });

            setInterval(() => {
                if (placingSpikes) {
                    if (upgradeOptions[5] == 23) {
                        document.ws.player.input.placeSpike('greater');
                    } else {
                        document.ws.player.input.placeSpike('regular');
                    };

                    if (upgradeOptions[9] == 24) {
                        document.ws.player.input.placeSpike('poison');
                    };
                    if (upgradeOptions[9] == 25) {
                        document.ws.player.input.placeSpike('spinning');
                    };
                };
                if (placingTraps) {
                    if (upgradeOptions[4] == 31) {
                        document.ws.player.input.placeTrap();
                    } else {
                        document.ws.player.input.placeBoost();
                    };
                };
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
                if (msgpack.decode(msg)[0] === 'F' || msgpack.decode(msg)[0] === 'z' || msgpack.decode(msg)[0] === 'c') {
                    multiboxAlts.forEach((sock) => {
                        sock.send(msg);
                    });
                };

                if (msgpack.decode(msg)[0] === 'H') {
                    upgradeOptions[document.ws.player.upgradeAge] = msgpack.decode(msg)[1][0];
                };

                console.log(msgpack.decode(msg));
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
        return init2();
    };
}, 100);
(function() {
    'use strict';

    // Global variables
    let ws;
    const msgpack5 = window.msgpack;

    let boostType, spikeType, turretType = null, windmillType = null, foodType;
    let width, height, mouseX, mouseY;
    let myPlayer = {
        id: null,
        x: null,
        y: null,
        dir: null,
        object: null,
        weapon: null,
        clan: null,
        isLeader: null,
        hat: null,
        accessory: null,
        isSkull: null,
        health: 100,
        secondaryWeapon: null,
        hasSpecialWeapon: false
    };

    const keysPressed = {};
    const enemiesNear = [];

    let nearestEnemy = null, nearestEnemyAngle = 0;
    const mousePosition = {x: 0, y: 0};
    const upgradeOptions = {};
    let placingSpikes = false;
    let placingTraps = false;
    let automill = false;

    // Menu variables
    let menuOpen = false;
    let autoHealEnabled = true;
    let autoBiomeHatEnabled = true;
    let autoClickEnabled = true;

    // ===================== MENU INTERFACE =====================
    function createMenu() {
        // Create menu container
        const menuContainer = document.createElement('div');
        menuContainer.id = 'nurbo-menu';
        menuContainer.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #555;
            border-radius: 8px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
        `;

        // Menu header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #222;
            padding: 12px 15px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid #444;
        `;

        const title = document.createElement('span');
        title.textContent = 'NURBO MOD v1.6.0.4';
        title.style.cssText = 'font-weight: 600; font-size: 14px; color: #4CAF50;';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'cursor: pointer; font-size: 20px; color: #888;';
        closeBtn.onclick = () => {
            menuOpen = false;
            menuContainer.style.display = 'none';
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Menu content
        const content = document.createElement('div');
        content.style.cssText = 'padding: 15px;';

        // Information section
        const infoSection = document.createElement('div');
        infoSection.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #4CAF50; margin: 0 0 12px 0; border-bottom: 1px solid #333; padding-bottom: 6px; font-size: 13px; font-weight: 600;">📊 INFORMATION</h3>


            </div>
        `;

        // Hotkeys section
        const hotkeysSection = document.createElement('div');
        hotkeysSection.innerHTML = `
            <h3 style="color: #4CAF50; margin: 0 0 12px 0; border-bottom: 1px solid #333; padding-bottom: 6px; font-size: 13px; font-weight: 600;">🎮 CONTROLS</h3>
            <div style="margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">Shift:</span>
                    <span style="color: #06D6A0; font-weight: 500;">Insta Attack</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">R:</span>
                    <span style="color: #06D6A0; font-weight: 500;">2nd Weapon Attack</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">F (Hold):</span>
                    <span style="color: #06D6A0; font-weight: 500;">Place Trap</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">V (Hold):</span>
                    <span style="color: #06D6A0; font-weight: 500;">Place Spike</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">C:</span>
                    <span style="color: #06D6A0; font-weight: 500;">4 Spikes around</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">B:</span>
                    <span style="color: #06D6A0; font-weight: 500;">4 Traps around</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">N:</span>
                    <span style="color: #06D6A0; font-weight: 500;">Auto Mill</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">RMB:</span>
                    <span style="color: #06D6A0; font-weight: 500;">Auto Attack</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">Space:</span>
                    <span style="color: #06D6A0; font-weight: 500;">Attack + Spikes</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 12px;">
                    <span style="color: #bbb;">ESC:</span>
                    <span style="color: #FFD166; font-weight: 500;">Menu</span>
                </div>
            </div>
        `;

        // Settings section
        const settingsSection = document.createElement('div');
        settingsSection.innerHTML = `
            <h3 style="color: #4CAF50; margin: 15px 0 12px 0; border-bottom: 1px solid #333; padding-bottom: 6px; font-size: 13px; font-weight: 600;">⚙️ SETTINGS</h3>
            <div style="margin: 8px 0;">
                <label style="display: flex; align-items: center; margin: 10px 0; cursor: pointer; font-size: 13px;">
                    <input type="checkbox" id="autoheal-toggle" checked style="margin-right: 10px; accent-color: #4CAF50;">
                    <span style="color: #ccc;">-</span>
                </label>
                <label style="display: flex; align-items: center; margin: 10px 0; cursor: pointer; font-size: 13px;">
                    <input type="checkbox" id="biomehat-toggle" checked style="margin-right: 10px; accent-color: #4CAF50;">
                    <span style="color: #ccc;">--</span>
                </label>
                <label style="display: flex; align-items: center; margin: 10px 0; cursor: pointer; font-size: 13px;">
                    <input type="checkbox" id="autoclick-toggle" checked style="margin-right: 10px; accent-color: #4CAF50;">
                    <span style="color: #ccc;">---</span>
                </label>
            </div>
        `;

        // Status bar
        const statusBar = document.createElement('div');
        statusBar.id = 'menu-status';
        statusBar.style.cssText = `
            background: #1a1a1a;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
            text-align: center;
            font-size: 12px;
            color: #06D6A0;
            border: 1px solid #333;
            font-weight: 500;
        `;
        statusBar.textContent = '✅ Active';

        content.appendChild(infoSection);
        content.appendChild(hotkeysSection);
        content.appendChild(settingsSection);
        content.appendChild(statusBar);

        menuContainer.appendChild(header);
        menuContainer.appendChild(content);

        document.body.appendChild(menuContainer);

        // Add dragging
        let isDragging = false;
        let dragOffset = {x: 0, y: 0};

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target === closeBtn) return;
            isDragging = true;
            const rect = menuContainer.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            menuContainer.style.cursor = 'grabbing';
        }

        function doDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            menuContainer.style.left = (e.clientX - dragOffset.x) + 'px';
            menuContainer.style.top = (e.clientY - dragOffset.y) + 'px';
            menuContainer.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            menuContainer.style.cursor = '';
        }

        // Switch handlers
        document.getElementById('autoheal-toggle').onchange = function() {
            autoHealEnabled = this.checked;
            updateStatus();
        };

        document.getElementById('biomehat-toggle').onchange = function() {
            autoBiomeHatEnabled = this.checked;
            updateStatus();
        };

        document.getElementById('autoclick-toggle').onchange = function() {
            autoClickEnabled = this.checked;
            updateStatus();
        };

        // Menu toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'menu-toggle';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 36px;
            height: 36px;
            background: #222;
            border: 1px solid #444;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4CAF50;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            user-select: none;
            transition: all 0.2s ease;
        `;
        toggleBtn.textContent = 'N';
        toggleBtn.onmouseenter = () => {
            toggleBtn.style.background = '#2a2a2a';
            toggleBtn.style.borderColor = '#4CAF50';
        };
        toggleBtn.onmouseleave = () => {
            toggleBtn.style.background = '#222';
            toggleBtn.style.borderColor = '#444';
        };
        toggleBtn.onclick = () => {
            menuOpen = !menuOpen;
            menuContainer.style.display = menuOpen ? 'block' : 'none';
        };

        document.body.appendChild(toggleBtn);

        // Status update function
        function updateStatus() {
            const status = statusBar;
            const health = document.getElementById('menu-health');
            const weapon = document.getElementById('menu-weapon');
            const secondary = document.getElementById('menu-secondary');
            const biome = document.getElementById('menu-biome');
            const enemies = document.getElementById('menu-enemies');

            // Update statistics
            if (health) health.textContent = myPlayer.health ? `${myPlayer.health}%` : '100%';
            if (enemies) enemies.textContent = enemiesNear.length;

            // Update weapon info
            if (weapon) {
                const weaponNames = {
                    0: 'Sword', 1: 'Axe', 2: 'Bow', 3: 'Pickaxe', 4: 'Rod',
                    5: 'Platform', 6: 'Wall', 7: 'Spike', 8: 'Spring',
                    9: 'Boomerang', 10: 'Dynamite', 11: 'Balloon', 12: 'Hammer',
                    13: 'Glider', 14: 'Bomb', 15: 'Katana'
                };
                weapon.textContent = weaponNames[myPlayer.weapon] || myPlayer.weapon;
            }

            if (secondary) {
                if (myPlayer.hasSpecialWeapon) {
                    const specialWeapons = {12: 'Hammer', 13: 'Glider', 15: 'Katana'};
                    secondary.textContent = specialWeapons[myPlayer.secondaryWeapon] || myPlayer.secondaryWeapon;
                } else {
                    secondary.textContent = 'None';
                }
            }

            // Determine biome
            if (biome && myPlayer.y !== null) {
                if (myPlayer.y < 2400) {
                    biome.textContent = 'Desert';
                } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                    biome.textContent = 'Winter';
                } else if (myPlayer.y > 6200 && myPlayer.y < 6800) {
                    biome.textContent = 'Water';
                } else {
                    biome.textContent = 'Normal';
                }
            }

            // Update mod status
            let statusText = '✅ Active ';
            statusText += autoHealEnabled ? '💊' : '';
            statusText += autoBiomeHatEnabled ? '🎩' : '';

            status.textContent = statusText;
        }

        // Update info every second
        setInterval(updateStatus, 1000);

        // Hide menu by default
        menuContainer.style.display = 'none';

        return menuContainer;
    }

    // ===================== MAIN FUNCTIONS =====================

    function storeEquip(hatId = null, accessoryId = null) {
        const hat = hatId !== null ? hatId : myPlayer.hat || 0;
        const acc = accessoryId !== null ? accessoryId : myPlayer.accessory || 0;
        doNewSend(["c", [0, hat, acc]]);
    }

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

    function isVisible(el) {
        return el && el.offsetParent !== null;
    }

    function updateItems() {
        for (let i = 31; i < 33; i++) if (isVisible(document.getElementById("actionBarItem" + i))) boostType = i - 16;
        for (let i = 22; i < 26; i++) if (isVisible(document.getElementById("actionBarItem" + i))) spikeType = i - 16;
        for (let i = 26; i <= 28; i++) if (isVisible(document.getElementById("actionBarItem" + i))) windmillType = i - 16;
        for (let i = 33; i <= 38; i++) if (i !== 36 && isVisible(document.getElementById("actionBarItem" + i))) turretType = i - 16;
        for (let i = 16; i <= 18; i++) if (isVisible(document.getElementById("actionBarItem" + i))) foodType = i - 16;

        // Check for special secondary weapons (12, 13, 15)
        checkSpecialWeapons();
    }

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

    // Check if player has special secondary weapons (12, 13, 15)
    function checkSpecialWeapons() {
        const specialWeapons = [12, 13, 15];
        let foundSpecial = false;
        let foundWeapon = null;

        for (let i = 9; i <= 15; i++) {
            if (isVisible(document.getElementById("actionBarItem" + i)) && i !== myPlayer.weapon) {
                if (specialWeapons.includes(i)) {
                    foundSpecial = true;
                    foundWeapon = i;
                    break;
                }
            }
        }

        myPlayer.hasSpecialWeapon = foundSpecial;
        myPlayer.secondaryWeapon = foundWeapon;
    }

    function performAttackWithSpikes() {
        if (!nearestEnemy) return;

        const dx = myPlayer.x - nearestEnemy[1];
        const dy = myPlayer.y - nearestEnemy[2];
        const distance = Math.sqrt(dx * dx + dy * dy);

        doNewSend(["9", [nearestEnemyAngle]]);

        place(spikeType, nearestEnemyAngle + Math.PI / 2);
        place(spikeType, nearestEnemyAngle - Math.PI / 2);

        if (distance <= 150) {
            place(spikeType, nearestEnemyAngle - Math.PI / 4);
            place(spikeType, nearestEnemyAngle + Math.PI / 4);
        }

        place(boostType, nearestEnemyAngle);
    }

    function performFourTraps() {
        const base = myPlayer.dir;
        place(boostType, base);
        place(boostType, base + Math.PI / 2);
        place(boostType, base - Math.PI / 2);
        place(boostType, base + Math.PI);
    }

    function placeFourSpikes() {
        const firstAngle = -Math.PI / 2;
        place(spikeType, firstAngle);
        place(spikeType, firstAngle + toRad(90));
        place(spikeType, firstAngle + toRad(180));
        place(spikeType, firstAngle + toRad(270));
    }

    function placeSingleSpike() {
        place(spikeType);
    }

    function placeSingleTrap() {
        place(boostType);
    }

    // ===================== SPECIAL WEAPON HAT SYSTEM =====================
 // ===================== SPECIAL WEAPON HAT SYSTEM =====================
function initSpecialWeaponHatSystem() {
    let hatCycleInterval = null;
    let isHat20Active = false;
    let isMoving = false;
    let movementKeys = new Set();

    // Special weapons that trigger hat system
    const SPECIAL_WEAPONS = [12, 13, 15]; // Hammer, Glider, Katana

    // Check if player is holding a special weapon (current active weapon)
    function isHoldingSpecialWeapon() {
        return SPECIAL_WEAPONS.includes(myPlayer.weapon);
    }

    // Check if player is standing still (not moving)
    function isStandingStill() {
        return movementKeys.size === 0 && !isMoving;
    }

    // Set hat safely
    function setHatSafely(hatId) {
        if (myPlayer && myPlayer.id != null) {
            doNewSend(["c", [0, hatId, 0]]);
        }
    }

    // Start the hat cycle for special weapons
    function startHatCycle() {
        if (hatCycleInterval) clearInterval(hatCycleInterval);

        // Set hat 20 immediately
        setHatSafely(20);
        isHat20Active = true;

        // Start 3-second cycle for hat 53
        hatCycleInterval = setInterval(() => {
            if (isHoldingSpecialWeapon() && isStandingStill()) {
                // Switch to hat 53 for 150ms
                setHatSafely(53);
                isHat20Active = false;

                // Return to hat 20 after 150ms
                setTimeout(() => {
                    if (isHoldingSpecialWeapon() && isStandingStill()) {
                        setHatSafely(20);
                        isHat20Active = true;
                    }
                }, 150);
            }
        }, 3000); // Every 3 seconds
    }

    // Stop the hat cycle
    function stopHatCycle() {
        if (hatCycleInterval) {
            clearInterval(hatCycleInterval);
            hatCycleInterval = null;
        }
        isHat20Active = false;

        // Return to normal hat (6) if standing still
        if (isStandingStill()) {
            setHatSafely(6);
        }
    }

    // Update hat based on conditions
    function updateSpecialWeaponHat() {
        // Check if player is holding special weapon and is standing still
        if (isHoldingSpecialWeapon() && isStandingStill()) {
            startHatCycle();
        } else {
            stopHatCycle();
            // If no special weapon or moving, use normal hat
            if (isStandingStill()) {
                setHatSafely(6);
            }
        }
    }

    // Track movement
    document.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        const movementKeysList = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];

        if (movementKeysList.includes(key)) {
            if (!movementKeys.has(key)) {
                movementKeys.add(key);
                isMoving = true;
                updateSpecialWeaponHat();
            }
        }
    });

    document.addEventListener("keyup", e => {
        const key = e.key.toLowerCase();
        const movementKeysList = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];

        if (movementKeysList.includes(key)) {
            movementKeys.delete(key);
            isMoving = movementKeys.size > 0;
            // Small delay to ensure movement has stopped
            setTimeout(updateSpecialWeaponHat, 50);
        }
    });

    // Monitor for weapon changes
    let lastWeaponCheck = 0;
    const WEAPON_CHECK_INTERVAL = 500;

    function checkWeaponPeriodically() {
        const now = Date.now();
        if (now - lastWeaponCheck < WEAPON_CHECK_INTERVAL) return;
        lastWeaponCheck = now;

        // Update the hat system based on current weapon
        updateSpecialWeaponHat();
    }

    // Initial check
    updateSpecialWeaponHat();

    // Periodic checks
    setInterval(checkWeaponPeriodically, WEAPON_CHECK_INTERVAL);

    // Also check when WebSocket messages update player weapon
    const originalHandleMessage = handleMessage;
    handleMessage = function(m) {
        originalHandleMessage(m);

        // Check if weapon info was updated in the message
        if (myPlayer.weapon !== null) {
            updateSpecialWeaponHat();
        }
    };

    return {
        updateSpecialWeaponHat,
        stopHatCycle,
        startHatCycle
    };
}

    // ===================== AUTOBIOME HAT =====================
    function autoBiomeHatController() {
        let normalHat = 12;
        let currentHat = null;
        let overridePause = false;
        let resumeTimeout = null;
        const movementKeys = new Set();
        const overrideKeys = new Set(["r", "t", " "]);
        let isHoldingSecondaryWeapon = false;
        let lastWeaponCheckTime = 0;
        const WEAPON_CHECK_INTERVAL = 100;

        if (!autoBiomeHatEnabled) return;

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
                    [40, 80, 120].forEach(delay => {
                        setTimeout(() => {
                            storeEquip(accessoryId, 1);
                        }, delay);
                    });
                }
            }
        }

        function updateBiomeHat() {
            if (!myPlayer || typeof myPlayer.y !== "number") return;

            const isInWater = myPlayer.y > 6200 && myPlayer.y < 6800;

            if (myPlayer.y < 2400) {
                normalHat = 15;
            } else if (myPlayer.y > 6850 && myPlayer.y < 7550) {
                normalHat = 31;
            } else {
                normalHat = 12;
            }

            if (isHoldingSecondaryWeapon && movementKeys.size === 0) {
                normalHat = 20;
            }
        }

        function updateHatLogic() {
            if (overridePause) return;
            updateBiomeHat();

            if (isHoldingSecondaryWeapon && movementKeys.size === 0) {
                setHat(20);
                storeEquip(0, 1);
            } else {
                if (movementKeys.size > 0) {
                    setHat(normalHat);
                } else {
                    setHat(6);
                }
            }
        }

        function checkSecondaryWeapon() {
            const now = Date.now();
            if (now - lastWeaponCheckTime < WEAPON_CHECK_INTERVAL) return;
            lastWeaponCheckTime = now;

            const secondaryIndex = getSecondaryWeaponIndex();
            isHoldingSecondaryWeapon = (secondaryIndex !== null && secondaryIndex !== myPlayer.weapon);

            if (isHoldingSecondaryWeapon) {
                myPlayer.secondaryWeapon = secondaryIndex;
            } else {
                myPlayer.secondaryWeapon = null;
            }

            if (!overridePause) {
                updateHatLogic();
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
            }, 360);
        }

        document.addEventListener("keydown", e => {
            const key = e.key.toLowerCase();
            if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
                if (!movementKeys.has(key)) {
                    movementKeys.add(key);
                    if (!overridePause) updateHatLogic();
                }
            }
            if (overrideKeys.has(key)) pauseOverride();
        });

        document.addEventListener("keyup", e => {
            const key = e.key.toLowerCase();
            if (movementKeys.delete(key) && !overridePause) {
                updateHatLogic();
            }
            if (overrideKeys.has(key)) resumeOverride();
        });

        document.addEventListener("mousedown", e => {
            if (e.button === 0 || e.button === 2) pauseOverride();
        });

        document.addEventListener("mouseup", e => {
            if (e.button === 0 || e.button === 2) resumeOverride();
        });

        setInterval(() => {
            checkSecondaryWeapon();
        }, WEAPON_CHECK_INTERVAL);

        setInterval(() => {
            if (!overridePause) updateHatLogic();
        }, 250);
    }

    // ===================== AUTO CLICK (RMB) =====================
    const WEAPON_SPEEDS = {
        0: 260, 1: 360, 2: 360, 3: 260, 4: 260,
        5: 500, 6: 660, 7: 60, 8: 360,
        9: 560, 10: 360, 12: 660, 13: 170,
        14: 660, 15: 1460
    };

    let rightClickHeld = false;
    let rightLoopRunning = false;
    let lastAttackTime = 0;

    function getWeaponReloadTime(id) {
        return WEAPON_SPEEDS[id] || 400;
    }

    function weaponReady(id) {
        return Date.now() - lastAttackTime >= getWeaponReloadTime(id);
    }

    function equipWeapon(id) {
        doNewSend(["z", [id, true]]);
    }

    function equipHat(id) {
        doNewSend(["c", [0, id, 0]]);
    }

    function swing() {
        lastAttackTime = Date.now();
        doNewSend(["F", [1]]);
        setTimeout(() => doNewSend(["F", [0]]), 12);
    }

    function isInUI(e) {
        const target = e.target;
        return target.closest(
            '#nameInput, .menuButton, .menuCard, #bottomText, #storeHolder,' +
            '#youtuberBtn, #adCard, .setNameContainer, .newsHolder, #gameUI,' +
            '.resourceDisplay, #killCounter, .uiElement, .actionBarItem, #itemInfoHolder'
        );
    }

    function rightAttackStep() {
        if (!rightClickHeld || !autoClickEnabled) return;

        const secondary = getSecondaryWeaponIndex();
        const primary = myPlayer.weapon;
        const weaponToUse = secondary === 10 ? secondary : primary;

        equipWeapon(weaponToUse);
        equipHat(40);

        if (!weaponReady(weaponToUse)) return;

        swing();

        const reload = getWeaponReloadTime(weaponToUse);
        setTimeout(() => {
            if (rightClickHeld) equipHat(6);
        }, reload - 20);
    }

    function rightAttackLoop() {
        if (!rightClickHeld) {
            rightLoopRunning = false;
            return;
        }

        rightAttackStep();

        const secondary = getSecondaryWeaponIndex();
        const currentWeapon = secondary === 10 ? secondary : myPlayer.weapon;
        const delay = getWeaponReloadTime(currentWeapon) * 2;

        setTimeout(rightAttackLoop, delay);
    }

    document.addEventListener("mousedown", e => {
        if (isInUI(e)) return;

        if (e.button === 2 && !rightClickHeld) {
            rightClickHeld = true;
            if (!rightLoopRunning && autoClickEnabled) {
                rightLoopRunning = true;
                rightAttackLoop();
            }
        }
    });

    document.addEventListener("mouseup", e => {
        if (e.button === 2) {
            rightClickHeld = false;
            rightLoopRunning = false;
            setTimeout(() => equipHat(6), 100);
        }
    });

    // ===================== AUTO HEAL =====================
    function healMainPlayer(currentHealth) {
        if (!autoHealEnabled || currentHealth >= 100) return;

        let timeout = 115;
        if (currentHealth <= 60) {
            timeout = 1;
        }

        setTimeout(() => {
            if (!ws || ws.readyState !== WebSocket.OPEN) return;

            doNewSend(["z", [0, null]]);
            doNewSend(["F", [1, null]]);
            doNewSend(["F", [0, null]]);
            doNewSend(["z", [myPlayer.weapon, true]]);

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

    // ===================== INSTA ATTACK =====================
    function performNormalInsta() {
        storeEquip(0, 1);
    setTimeout(() => {


        const primary = myPlayer.weapon;
        const secondary = getSecondaryWeaponIndex();

        doNewSend(["c", [0, 7, 0]]);
        doNewSend(["z", [primary, true]]);
        doNewSend(["F", [1]]);
        setTimeout(() => doNewSend(["F", [0]]), 25);

        setTimeout(() => {
            doNewSend(["c", [0, 53, 0]]);
            doNewSend(["z", [secondary, true]]);
            doNewSend(["F", [1]]);
            setTimeout(() => doNewSend(["F", [0]]), 25);

            setTimeout(() => {
                doNewSend(["c", [0, 6, 0]]);
                doNewSend(["z", [primary, true]]);
                doNewSend(["z", [primary, true]]);
                autoaim = false;

                setTimeout(() => {
                    storeEquip(11, 1);

                    if (secondary === 15) {
                        doNewSend(["z", [secondary, true]]);
                        setTimeout(() => doNewSend(["z", [primary, true]]), 1500);
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

    // ===================== TRACK MOUSE POSITION =====================
    const cvs = document.getElementById("gameCanvas");
    if (cvs) {
        cvs.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            width = e.target.clientWidth;
            height = e.target.clientHeight;
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        });
    }

    document.addEventListener("mousemove", e => {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    });

    // ===================== EVENT HANDLING =====================

    // Key press tracking for hold functionality
    let fKeyHeld = false;
    let vKeyHeld = false;
    let fKeyInterval = null;
    let vKeyInterval = null;

    document.addEventListener("keydown", e => {
        if (document.activeElement && document.activeElement.id.toLowerCase() === 'chatbox') return;

        const key = e.key.toLowerCase();

        // Insta attack on Shift
        if (e.keyCode == 16) {
            performNormalInsta();
        }

        // Handle hotkeys
        if (e.target.tagName === 'INPUT') return;

        // F key - Place trap (hold for continuous)
        if (key === 'f' && !fKeyHeld) {
            fKeyHeld = true;
            placeSingleTrap(); // Place one immediately

            // Start continuous placement
            fKeyInterval = setInterval(() => {
                if (fKeyHeld) {
                    placeSingleTrap();
                }
            }, 100);
        }

        // V key - Place spike (hold for continuous)
        if (key === 'v' && !vKeyHeld) {
            vKeyHeld = true;
            placeSingleSpike(); // Place one immediately

            // Start continuous placement
            vKeyInterval = setInterval(() => {
                if (vKeyHeld) {
                    placeSingleSpike();
                }
            }, 100);
        }

        // C key - 4 spikes around
        if (key === 'c') {
            placeFourSpikes();
        }

        // B key - 4 traps around
        if (key === 'b') {
            performFourTraps();
        }

        if (key === 'r' && document.activeElement.id.toLowerCase() !== "chatbox") {
            storeEquip(0, 1);
            setTimeout(() => {

                const primary = myPlayer.weapon;
                const secondary = getSecondaryWeaponIndex();

                doNewSend(["z", [secondary, true]]);
                doNewSend(["z", [secondary, true]]);

                doNewSend(["c", [0, 53, 0]]);
                doNewSend(["F", [1]]);
                setTimeout(() => doNewSend(["F", [0]]), 25);

                setTimeout(() => {

                    doNewSend(["z", [primary, true]]);
                    doNewSend(["c", [0, 7, 0]]);
                    doNewSend(["F", [1]]);
                    setTimeout(() => doNewSend(["F", [0]]), 25);
                }, 90);

                setTimeout(() => {

                    doNewSend(["z", [primary, true]]);
                    doNewSend(["z", [primary, true]]);
                    doNewSend(["c", [0, 6, 0]]);
                    storeEquip(11, 1);
                    autoaim = false;

                    setTimeout(() => {

                        if (secondary === 15) {
                            doNewSend(["z", [secondary, true]]);
                            setTimeout(() => doNewSend(["z", [primary, true]]), 1500);
                        } else if (secondary === 12) {
                            doNewSend(["z", [secondary, true]]);
                            setTimeout(() => doNewSend(["z", [primary, true]]), 1000);
                        } else if (secondary === 13) {
                            doNewSend(["z", [secondary, true]]);
                            setTimeout(() => doNewSend(["z", [primary, true]]), 400);
                        }
                    }, 200);
                }, 500);
            }, 120);
        }

        // N key - Toggle auto mill
        if (key === 'n') {
            automill = !automill;
        }
 if (key === 'g') {
       place(turretType)
        }
        // Space - Attack with spikes
        if (key === ' ') {
            performAttackWithSpikes();
        }

        // Escape - Toggle menu
        if (key === 'escape') {
            const menu = document.getElementById('nurbo-menu');
            const toggleBtn = document.getElementById('menu-toggle');
            if (menu && toggleBtn) {
                menuOpen = !menuOpen;
                menu.style.display = menuOpen ? 'block' : 'none';
            }
        }
    });

    document.addEventListener("keyup", e => {
        const key = e.key.toLowerCase();

        // Stop F key placement
        if (key === 'f' && fKeyHeld) {
            fKeyHeld = false;
            if (fKeyInterval) {
                clearInterval(fKeyInterval);
                fKeyInterval = null;
            }
        }

        // Stop V key placement
        if (key === 'v' && vKeyHeld) {
            vKeyHeld = false;
            if (vKeyInterval) {
                clearInterval(vKeyInterval);
                vKeyInterval = null;
            }
        }
    });

    // WebSocket interceptor
    WebSocket.prototype.nsend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (message) {
        if (!ws) {
            ws = this;
            ws.addEventListener("message", handleMessage);
            ws.addEventListener("close", (event) => {
                if (event.code == 4001) {
                    window.location.reload();
                }
            });
        }

        return this.nsend(message);
    };

    function handleMessage(m) {
        let temp = msgpack5.decode(new Uint8Array(m.data));
        let data = (temp.length > 1) ? [temp[0], ...temp[1]] : temp;
        if (!data) return;

        if (data[0] === "C" && myPlayer.id == null) myPlayer.id = data[1];

        if (data[0] === "a") {
            enemiesNear.length = 0; // Clear array

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
                enemiesNear.sort((a, b) => {
                    const distA = Math.hypot(a[1] - myPlayer.x, a[2] - myPlayer.y);
                    const distB = Math.hypot(b[1] - myPlayer.x, b[2] - myPlayer.y);
                    return distA - distB;
                });

                nearestEnemy = enemiesNear[0];

                if (nearestEnemy) {
                    const dx = myPlayer.x - nearestEnemy[1];
                    const dy = myPlayer.y - nearestEnemy[2];
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 1000) {
                        nearestEnemy = null;
                    } else {
                        nearestEnemyAngle = Math.atan2(nearestEnemy[2] - myPlayer.y, nearestEnemy[1] - myPlayer.x);
                    }
                }
            } else {
                nearestEnemy = null;
            }
        }

        // Auto heal when damaged
        if (data[0] === "O" && data[1] === myPlayer.id) {
            myPlayer.health = data[2];
            healMainPlayer(myPlayer.health);
        }
    }

    // ===================== INITIALIZATION =====================

    function init() {
        // Remove ads
        const promoImgHolder = document.getElementById('promoImgHolder');
        if (promoImgHolder) promoImgHolder.remove();

        for (let i = 0; i < document.getElementsByClassName('adsbygoogle').length; i++) {
            const ad = document.getElementsByClassName('adsbygoogle')[0];
            if (ad) ad.remove();
        }

        // Change game name
        const gameName = document.getElementById('gameName');
        if (gameName) {
            gameName.innerText = 'Hypbo mode';
            gameName.style = 'color: #4CAF50;';
        }

        // Change menu
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.style = 'background-color: #111;';

        const diedText = document.getElementById('diedText');
        if (diedText) {
            diedText.innerText = 'RESPAWN';
            diedText.style = 'color: #4CAF50; background-color: #111;';
        }

        // Create menu
        createMenu();

        // Start auto item update
        setInterval(updateItems, 250);

        // Start auto hats
        autoBiomeHatController();

        // Start special weapon hat system
        initSpecialWeaponHatSystem();

        // Intervals for automatic actions
        setInterval(() => {
            if (automill) {
                if (upgradeOptions[5] == 27) {
                    if (upgradeOptions[8] == 28) {
                        doNewSend(['z', [12, null]]);
                        doNewSend(['F', [1, null]]);
                        doNewSend(['F', [0, null]]);
                        doNewSend(['z', [myPlayer.weapon, true]]);
                    } else {
                        doNewSend(['z', [11, null]]);
                        doNewSend(['F', [1, null]]);
                        doNewSend(['F', [0, null]]);
                        doNewSend(['z', [myPlayer.weapon, true]]);
                    };
                } else {
                    doNewSend(['z', [10, null]]);
                    doNewSend(['F', [1, null]]);
                    doNewSend(['F', [0, null]]);
                    doNewSend(['z', [myPlayer.weapon, true]]);
                };
            };
        }, 50);
    }

    // Start initialization
    let waitForGameName = setInterval(() => {
        if (document.getElementById('gameName')) {
            clearInterval(waitForGameName);
            init();
        }
    }, 100);

})();


