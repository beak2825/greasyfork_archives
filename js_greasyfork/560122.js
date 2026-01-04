// ==UserScript==
// @name         🌙 Moonlight Client (MOOMOO.IO) 🌙
// @namespace    http://tampermonkey.net/
// @version      v1.4.3
// @description  Moomoo.io Multibox Cheat (30+ bots) as well as Ultra Fast Autoheal (READ DESCRIPTION)
// @author       freepentests
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/560122/%F0%9F%8C%99%20Moonlight%20Client%20%28MOOMOOIO%29%20%F0%9F%8C%99.user.js
// @updateURL https://update.greasyfork.org/scripts/560122/%F0%9F%8C%99%20Moonlight%20Client%20%28MOOMOOIO%29%20%F0%9F%8C%99.meta.js
// ==/UserScript==

let multiboxAlts = [];
const mousePosition = {x: 0, y: 0};
//const ninetyDegreesInRadians = 1.57079633;
//https://discord.gg/VU8t67TBKs

const upgradeOptions = {}; // when the main player upgrades at a specific age, the ID of the item the main player upgrades to will be stored here.

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
            this.useItem(0); // heal with apple
            this.useItem(1); // heal with cookie
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

        this.powSolver.generateAltchaToken().then((token) => {
            this.ws = new WebSocket(document.ws.url.split('?token=')[0] + `?token=${token}`);
            this.ws.binaryType = 'arraybuffer';
            this.ws.player = new Player(this.ws);
            this.ws.addEventListener('message', this.handleMessage.bind(this));

            setInterval(() => {
                this.ws.player.input.sendChatMessage('Moonlight Client! Age: ' + this.age);
                if (!this.ws.player.fullyUpgraded) {
                    try {
                        this.ws.player.input.sendMsg(['H', [upgradeOptions[this.ws.player.upgradeAge]]]);
                    } catch(e) {
                        ; // do nothing
                    };
                };
            }, 1000);
        });
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
            case 'a':
                var mouseXWorld = (document.ws.player.entity.position.x - this.ws.player.entity.position.x) + (mousePosition.x - (window.innerWidth / 2)) * (1+(1/3));
                var mouseYWorld = (document.ws.player.entity.position.y - this.ws.player.entity.position.y) + (mousePosition.y - (window.innerHeight / 2)) * (1+(1/3));
                var dirToMove = Math.atan2(mouseYWorld, mouseXWorld);
                this.ws.player.input.sendMsg(['D', [dirToMove]]); // face in the direction of the mouse
                if (repellingAlts) {
                    this.ws.player.input.moveTowardsDirection(dirToMove - 2.35619);// - 3.14159); // 3.14159 is 180 degrees in radians
                } else {
                    this.ws.player.input.moveTowardsDirection(dirToMove);
                };
                break;
            case 'U':
                this.age = (data[1][0] + data[1][1]) - 1;
        };
    };
};

const init = () => {
    document.getElementById('promoImgHolder').remove(); // remove the promo
    for (let i = 0; i < document.getElementsByClassName('adsbygoogle').length; i++) {
        document.getElementsByClassName('adsbygoogle')[0].remove();
    };
    document.getElementById('gameName').innerText = 'Moonlight'
    document.getElementById('gameName').style = 'color: #f00';
    document.getElementById('mainMenu').style = 'background-color: #000';
    document.getElementById('diedText').innerText = 'GET REVENGE';
    document.getElementById('diedText').style = 'color: #f00; background-color: #000;';

    const altCounter = document.createElement('h2');
    altCounter.style = 'text-align: center; font-size: 25px; position: fixed; top: 10px; left: 50%; transform: translateX(-50%);';
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

                if (e.key === 'l') {
                    new Bot('gg/VU8t67TBKs')
                };

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
        return init();
    };
}, 100);
