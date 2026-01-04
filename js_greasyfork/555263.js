// ==UserScript==
// @name Sploop.io Socket API Modified by x-RedDragon
// @author Murka and x-RedDragon
// @description Provides a basic understanding of how sploop handles websockets, lets connect a bot via console. R=Insta, V=spike, F=trap/boostpad, N=windmill, and ESP, nad paste this in the console | SocketAPI.createClient(); | for spawn bots.
// @icon https://sploop.io/img/ui/favicon.png
// @version 1.0
// @match *://sploop.io/*
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1436069
// @downloadURL https://update.greasyfork.org/scripts/555263/Sploopio%20Socket%20API%20Modified%20by%20x-RedDragon.user.js
// @updateURL https://update.greasyfork.org/scripts/555263/Sploopio%20Socket%20API%20Modified%20by%20x-RedDragon.meta.js
// ==/UserScript==

/*
This script belongs to Murka.
I only added a few things to make it available here.
*/

(function() {
    "use strict";

    const log = console.log;

    localStorage.removeItem("_adIds");
    const getAngle = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
    const hashing = {
        9303: function(t, n) {
            t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
            n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
            const i = [0, 0, 0, 0];
            i[3] += t[3] + n[3];
            i[2] += i[3] >>> 16;
            i[3] &= 65535;

            i[2] += t[2] + n[2];
            i[1] += i[2] >>> 16;
            i[2] &= 65535;

            i[1] += t[1] + n[1];
            i[0] += i[1] >>> 16;
            i[1] &= 65535;

            i[0] += t[0] + n[0];
            i[0] &= 65535;
            return [i[0] << 16 | i[1], i[2] << 16 | i[3]];
        },

        3235: function(t, n) {
            t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
            n = [n[0] >>> 16, 65535 & n[0], n[1] >>> 16, 65535 & n[1]];
            const i = [0, 0, 0, 0];
            i[3] += t[3] * n[3];
            i[2] += i[3] >>> 16;
            i[3] &= 65535;

            i[2] += t[2] * n[3];
            i[1] += i[2] >>> 16;
            i[2] &= 65535;

            i[2] += t[3] * n[2];
            i[1] += i[2] >>> 16;
            i[2] &= 65535;

            i[1] += t[1] * n[3];
            i[0] += i[1] >>> 16;
            i[1] &= 65535;

            i[1] += t[2] * n[2];
            i[0] += i[1] >>> 16;
            i[1] &= 65535;

            i[1] += t[3] * n[1];
            i[0] += i[1] >>> 16;
            i[1] &= 65535;

            i[0] += t[0] * n[3] + t[1] * n[2] + t[2] * n[1] + t[3] * n[0];
            i[0] &= 65535
            return [i[0] << 16 | i[1], i[2] << 16 | i[3]];
        },

        9869: function(t, n) {
            n %= 64;
            if (32 == n) return [t[1], t[0]];
            if (n < 32) return [t[0] << n | t[1] >>> 32 - n, t[1] << n | t[0] >>> 32 - n];

            n -= 32;
            return [t[1] << n | t[0] >>> 32 - n, t[0] << n | t[1] >>> 32 - n];
        },

        1318: function(t, n) {
            n %= 64;
            if (0 == n) return t;
            if (n < 32) return [t[0] << n | t[1] >>> 32 - n, t[1] << n];
            return [t[1] << n - 32, 0];
        },

        6217: function(t, n) {
            return [t[0] ^ n[0], t[1] ^ n[1]];
        },

        1552: function(t) {
            const o = hashing[3235];
            const e = hashing[6217];
            t = e(t, [0, t[0] >>> 1]);
            t = o(t, [4283543511, 3981806797]);
            t = e(t, [0, t[0] >>> 1]);
            t = o(t, [3301882366, 444984403]);
            return e(t, [0, t[0] >>> 1]);
        },

        6112: function(t, i) {
            const e = hashing[9303];
            const r = hashing[3235];
            const c = hashing[9869];
            const a = hashing[1318];
            const s = hashing[6217];
            const h = hashing[1552];

            i = i || 0;
            const u = (t = t || "").length % 16;
            const f = t.length - u;
            let l = [0, i];
            let d = [0, i];
            let g = [0, 0];
            let w = [0, 0];

            const b = [2277735313, 289559509];
            const M = [1291169091, 658871167];
            let v;
            for (v = 0; v < f; v += 16) {
                g = [255 & t.charCodeAt(v + 4) | (255 & t.charCodeAt(v + 5)) << 8 | (255 & t.charCodeAt(v + 6)) << 16 | (255 & t.charCodeAt(v + 7)) << 24, 255 & t.charCodeAt(v) | (255 & t.charCodeAt(v + 1)) << 8 | (255 & t.charCodeAt(v + 2)) << 16 | (255 & t.charCodeAt(v + 3)) << 24];
                w = [255 & t.charCodeAt(v + 12) | (255 & t.charCodeAt(v + 13)) << 8 | (255 & t.charCodeAt(v + 14)) << 16 | (255 & t.charCodeAt(v + 15)) << 24, 255 & t.charCodeAt(v + 8) | (255 & t.charCodeAt(v + 9)) << 8 | (255 & t.charCodeAt(v + 10)) << 16 | (255 & t.charCodeAt(v + 11)) << 24];
                g = r(g, b); g = c(g, 31); g = r(g, M);
                l = s(l, g); l = c(l, 27); l = e(l, d);
                l = e(r(l, [0, 5]), [0, 1390208809]); w = r(w, M); w = c(w, 33); w = r(w, b);
                d = s(d, w); d = c(d, 31); d = e(d, l); d = e(r(d, [0, 5]), [0, 944331445]);
            }

            g = [0, 0];
            w = [0, 0];
            switch (u) {
                case 15:
                    w = s(w, a([0, t.charCodeAt(v + 14)], 48));

                case 14:
                    w = s(w, a([0, t.charCodeAt(v + 13)], 40));

                case 13:
                    w = s(w, a([0, t.charCodeAt(v + 12)], 32));

                case 12:
                    w = s(w, a([0, t.charCodeAt(v + 11)], 24));

                case 11:
                    w = s(w, a([0, t.charCodeAt(v + 10)], 16));

                case 10:
                    w = s(w, a([0, t.charCodeAt(v + 9)], 8));

                case 9:
                    w = s(w, [0, t.charCodeAt(v + 8)]), w = r(w, M), w = c(w, 33), w = r(w, b), d = s(d, w);

                case 8:
                    g = s(g, a([0, t.charCodeAt(v + 7)], 56));

                case 7:
                    g = s(g, a([0, t.charCodeAt(v + 6)], 48));

                case 6:
                    g = s(g, a([0, t.charCodeAt(v + 5)], 40));

                case 5:
                    g = s(g, a([0, t.charCodeAt(v + 4)], 32));

                case 4:
                    g = s(g, a([0, t.charCodeAt(v + 3)], 24));

                case 3:
                    g = s(g, a([0, t.charCodeAt(v + 2)], 16));

                case 2:
                    g = s(g, a([0, t.charCodeAt(v + 1)], 8));

                case 1:
                    g = s(g, [0, t.charCodeAt(v)]), g = r(g, b), g = c(g, 31), g = r(g, M), l = s(l, g);
            }

            l = s(l, [0, t.length]);
            d = s(d, [0, t.length]);
            l = e(l, d); d = e(d, l);
            l = h(l); d = h(d);
            l = e(l, d); d = e(d, l);
            return ("00000000" + (l[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (l[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (d[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (d[1] >>> 0).toString(16)).slice(-8);
        },

        3028: function(t, n, i, o) {
            return function() {
                let e = (t >>>= 0) + (n >>>= 0) | 0;
                t = n ^ n >>> 9;
                n = (i >>>= 0) + (i << 3) | 0;
                i = (i = i << 21 | i >>> 11) + (e = e + (o = 1 + (o >>>= 0) | 0) | 0) | 0;
                return (e >>> 0) / 4294967296;
            }
        },

        9623: function(t) {
            for (var o = 0, e = 1779033703 ^ t.length; o < t.length; o++) {
                e = (e = Math.imul(e ^ t.charCodeAt(o), 3432918353)) << 13 | e >>> 19;
            }
            return function() {
                e = Math.imul(e ^ e >>> 16, 2246822507);
                e = Math.imul(e ^ e >>> 13, 3266489909);
                return (e ^= e >>> 16) >>> 0;
            }
        },

        1122: function(t) {
            const o = hashing[3028];
            const e = hashing[9623];
            t = e(t || "");
            return o(t(), t(), t(), t());
        },

        9629: function(t, n) {
            const o = hashing[6112];
            const e = hashing[1122];
            const i = o("" + t, "" + n);
            const r = e(i);
            return [~~(246 * r()), ~~(255 * r()), ~~(255 * r()), ~~(255 * r())];
        }
    }

    class Vector {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        static fromAngle(angle, length = 1) {
            return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
        }

        add(vec) {
            if (vec instanceof Vector) {
                this.x += vec.x;
                this.y += vec.y;
            } else {
                this.x += vec;
                this.y += vec;
            }
            return this;
        }

        sub(vec) {
            if (vec instanceof Vector) {
                this.x -= vec.x;
                this.y -= vec.y;
            } else {
                this.x -= vec;
                this.y -= vec;
            }
            return this;
        }

        mult(vec) {
            if (vec instanceof Vector) {
                this.x *= vec.x;
                this.y *= vec.y;
            } else {
                this.x *= vec;
                this.y *= vec;
            }
            return this;
        }

        div(vec) {
            if (vec instanceof Vector) {
                this.x /= vec.x;
                this.y /= vec.y;
            } else {
                this.x /= vec;
                this.y /= vec;
            }
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
            return new Vector(this.x, this.y);
        }

        distance(vec) {
            return this.copy().sub(vec).length;
        }

        angle(vec) {
            const copy = vec.copy().sub(this);
            return Math.atan2(copy.y, copy.x);
        }

        direction(angle, length) {
            return this.copy().add(Vector.fromAngle(angle, length));
        }

        isEqual(vec) {
            return this.x === vec.x && this.y === vec.y;
        }

        stringify() {
            return this.x + ":" + this.y;
        }

        min(vec) {
            this.x = Math.min(this.x, vec.x);
            this.y = Math.min(this.y, vec.y);
            return this;
        }

        max(vec) {
            this.x = Math.max(this.x, vec.x);
            this.y = Math.max(this.y, vec.y);
            return this;
        }

        trunc() {
            this.x = Math.trunc(this.x);
            this.y = Math.trunc(this.y);
            return this;
        }
    }

    const formatButton = (button) => {
        if (0 === button) return "LBTN";
        if (1 === button) return "MBTN";
        if (2 === button) return "RBTN";
        if (3 === button) return "BBTN";
        if (4 === button) return "FBTN";
        throw new Error(`formatButton Error: "${button}" is not valid button`);
    }

    const InputHandler = new class InputHandler {
        mouse = new Vector;
        innerSize = new Vector;
        angle = 0;
        canvas = {};
        startMouse = false;

        attach() {
            const canvas = document.querySelector("#game-canvas");
            this.canvas.mousedown = canvas.onmousedown;
            this.canvas.mouseup = canvas.onmouseup;
            canvas.onmousedown = null
            canvas.onmouseup = null;

            window.addEventListener("mousemove", event => {
                this.mouse.setXY(event.clientX, event.clientY);
                this.angle = getAngle(innerWidth / 2, innerHeight / 2, this.mouse.x, this.mouse.y);
            });
            canvas.addEventListener("mousedown", event => this.mousedown(event));
            window.addEventListener("mouseup", event => this.mouseup(event));

            const resize = () => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                this.mouse.x *= w / this.innerSize.x;
                this.mouse.y *= h / this.innerSize.y;
                this.innerSize.setXY(w, h);
            }
            window.addEventListener("resize", resize);
            resize();
        }

        cursorPosition(target) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const scale = Math.max(w / 1824, h / 1026);
            const cursorX = (this.mouse.x - w / 2) / scale;
            const cursorY = (this.mouse.y - h / 2) / scale;
            return new Vector(target.x + cursorX, target.y + cursorY);
        }

        mousedown(event) {
            const { ModuleHandler, myPlayer, clients } = playerClient;
            const button = formatButton(event.button);
            if (button === "LBTN" && !this.startMouse) {
                this.startMouse = true;
                this.canvas.mousedown(event);

                /*ModuleHandler.attacking = 1;
                const pos = this.cursorPosition(myPlayer.position);
                for (const client of clients) {
                    const angle = client.myPlayer.position.angle(pos);
                    client.PacketHandler.attack(angle);
                }*/
            }
        }

        mouseup(event) {
            const { ModuleHandler, clients } = playerClient;
            const button = formatButton(event.button);
            if (button === "LBTN" && this.startMouse) {
                this.startMouse = false;
                this.canvas.mouseup(event);

                /*if (ModuleHandler.attacking !== 0) {
                    for (const client of clients) {
                        client.PacketHandler.stopAttack();
                    }
                }*/
            }
        }
    }

    window.addEventListener("load", () => {
        InputHandler.attach();
    });

    const HookedArrays = {
        joins: null,
    }

    class TempData {
        constructor(client) {
            this.client = client;
        }

        setAttacking(attacking) {
            /*const { ModuleHandler } = this.client;
            if (ModuleHandler.attacking === attacking) {
                return;
            }
            ModuleHandler.attacking = attacking;
            if (0 !== attacking) {
                ModuleHandler.attackingState = attacking;
            }*/
        }
    }

    class ClanJoiner {
        constructor(client) {
            this.client = client;
            this.joinCount = 0;
        }

        postTick() {
            const { myPlayer, owner, PacketHandler } = this.client;
            const ownerClan = owner.myPlayer.clan;
            if (ownerClan === myPlayer.clan) return;

            if (this.joinCount === 0) {
                if (myPlayer.clan === 0) {
                    owner.pendingJoins.add(myPlayer.globalID);
                    PacketHandler.joinClan(ownerClan);
                } else {
                    PacketHandler.leaveClan();
                }
            }
            this.joinCount = (this.joinCount + 1) % 10;
        }
    }

    class Movement {
        constructor(client) {
            this.client = client;
        }

        postTick() {
            const { myPlayer, owner, ModuleHandler } = this.client;
            const pos1 = this.client.myPlayer.position;
            const pos2 = InputHandler.cursorPosition(this.client.owner.myPlayer.position);
            const distance = pos1.distance(pos2);
            const angle = pos1.angle(pos2);
            const currentAngle = distance > 0 ? angle: null;
            ModuleHandler.targetAngle = angle;
            ModuleHandler.moveByAngle(currentAngle);
        }
    }

    class AutoAccept {
        constructor(client) {
            this.client = client;
        }

        postTick() {
            const { myPlayer, PlayerManager, owner, pendingJoins, PacketHandler } = this.client;
            if (!PlayerManager.isClanOwner(myPlayer) || myPlayer.joinRequests.length === 0) return;

            const id = myPlayer.joinRequests[0];
            if (pendingJoins.size !== 0) {
                PacketHandler.acceptDecline(pendingJoins.has(id));
                this.client.removeJoin(id);
            }
        }
    }

    class AutoHeal {
        constructor(client) {
            this.client = client;
        }

        postTick() {
            if (this.client.myPlayer.health === 100) return;

            setTimeout(() => {
                this.client.ModuleHandler.heal();
            }, 120);
        }
    }

    class UpdateAngle {
        constructor(client) {
            this.client = client;
        }

        /*getAngle() {
            if (this.client.isOwner) return InputHandler._angle;
            return null;
        }*/

        postTick() {
            const { ModuleHandler } = this.client;

            const angle = ModuleHandler.targetAngle;
            if (angle !== null) {
                ModuleHandler.updateAngle(angle);
            }
        }
    }

    class ModuleHandler {
        constructor(client) {
            this.client = client;
            this.reset();

            this.statisModules = {
                tempData: new TempData(client),
            };

            this.botModules = [
                new ClanJoiner(client),
                new Movement(client),
            ];

            this.modules = [
                new AutoAccept(client),
                new AutoHeal(client),
                new UpdateAngle(client),
            ];

            this.rotation = true;
            this.mouse = {
                x: 0,
                y: 0,
                lockX: 0,
                lockY: 0,
                angle: 0,
                _angle: 0,
            }
        }

        reset() {
            this.weapon = 0;
            this.moveAngle = null;
            this.targetAngle = null;
            this.currentAngle = 0;
            this.attacking = 0;
            this.attackingState = 0;
        }

        attachMouse() {
            window.addEventListener("mousemove", event => {
                this.mouse.x = event.clientX;
                this.mouse.y = event.clientY;
                const angle = getAngle(innerWidth / 2, innerHeight / 2, this.mouse.x, this.mouse.y);
                this.mouse._angle = angle;
                if (this.rotation) {
                    this.mouse.lockX = event.clientX;
                    this.mouse.lockY = event.clientY;
                    this.mouse.angle = angle;
                }
            });
        }

        moveByAngle(angle) {
            if (angle === this.moveAngle) return;
            this.moveAngle = angle;

            const { PacketHandler } = this.client;
            if (angle === null) {
                PacketHandler.stopMovement();
            } else {
                PacketHandler.moveByAngle(angle);
            }
        }

        updateAngle(angle) {
            if (angle === this.currentAngle) return;
            this.currentAngle = angle;

            const { PacketHandler } = this.client;
            PacketHandler.updateAngle(angle);
        }

        whichWeapon(type = this.weapon) {
            if (this.weapon === type) return;
            this.weapon = type;

            this.client.PacketHandler.selectItemByType(type);
        }

        placeItemByType(type) {
            this.client.PacketHandler.selectItemByType(type);
            this.client.PacketHandler.attack(this.mouse.angle);
            this.client.PacketHandler.stopAttack();
            this.whichWeapon();
        }

        heal() {
            this.placeItemByType(2);
        }

        postTick() {
            if (!this.client.isOwner) {
                for (const botModule of this.botModules) {
                    botModule.postTick();
                }
            }

            for (const module of this.modules) {
                module.postTick();
            }
            this.attackingState = this.attacking;
        }
    }

    class Player {
        type = 0;
        globalID = 0;
        id = 0;
        position = new Vector;
        angle = 0;
        health = 100;
        clan = 0;

        constructor(client) {
            this.client = client;
        }

        update(type, globalID, id, x, y, angle, health, clanID) {
            this.type = type;
            this.globalID = globalID;
            this.id = id;
            this.position.setXY(x, y);
            this.angle = angle;
            this.health = health;
            this.clan = clanID;
        }
    }

    class ClientPlayer extends Player {
        constructor(client) {
            super(client);

            this.joinRequests = [];
            this.upgradeList = [];
            this.reset();
        }

        reset() {
            this.inGame = false;
            this.upgradeList.length = 0;
            this.upgradeIndex = 0;
            this.upgradeAge = 0;
            this.prevAge = 0;
            this.age = 0;
            this.food = 0;
            this.wood = 0;
            this.stone = 0;
            this.gold = 0;
        }

        handleUpgrade(items) {
            if (this.client.isOwner) return;
            const { upgradeList } = this.client.owner.myPlayer;
            const currentItem = upgradeList[this.upgradeIndex];
            if (upgradeList.includes(currentItem)) {
                this.upgradeItem(currentItem);
            }
        }

        upgradeItem(id) {
            this.upgradeAge += 1;

            if (this.client.isOwner) {
                this.upgradeList.push(id);

                for (const client of this.client.clients) {
                    const { age, upgradeAge, upgradeIndex } = client.myPlayer;
                    if (age > upgradeAge) {
                        const item = this.upgradeList[upgradeIndex];
                        client.myPlayer.upgradeItem(item);
                    }
                }
                return;
            }

            this.client.PacketHandler.upgradeItem(id);
            this.upgradeIndex += 1;
        }

        updateAge() {
            //log(this.age, this.upgradeAge);
        }

        handleStats(age, food, wood, stone, gold) {
            this.food = food;
            this.wood = wood;
            this.stone = stone;
            this.gold = gold;

            if (age === 0) return;
            this.prevAge = this.age;
            this.age = age;

            if (this.age > this.prevAge) {
                this.updateAge();
            }
        }

        postTick() {
            if (this.inGame) {
                this.client.ModuleHandler.postTick();
            }
        }
    }

    class PlayerManager {
        playerData = new Map();
        clanData = new Map();

        constructor(client) {
            this.client = client;
        }

        isClanOwner(player) {
            const clan = this.clanData.get(player.clan);
            return clan && clan.owner === player.globalID;
        }

        getPlayer(id) {
            if (this.playerData.has(id)) {
                return this.playerData.get(id);
            }

            const player = new Player();
            this.playerData.set(id, player);
            return player;
        }

        createClan(id, owner, name) {
            const clanData = this.clanData;
            if (!clanData.has(id)) {
                clanData.set(id, {});
            }

            const clan = clanData.get(id);
            clan.id = id;
            clan.owner = owner;
            clan.name = name;
        }
    }

    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const PI = Math.PI;
    const PI2 = PI * 2;
    const formatAge = (age) => Math.floor(Math.log(1 + Math.max(0, age)) ** 2.4 / 13);
    const formatAngle = (byte) => byte / 255 * PI2 - PI;
    const encodeAngle = (angle) => {
        angle = 65535 * (angle + PI) / PI2;
        return [255 & angle, angle >> 8 & 255];
    }

    const getRandomString = (len, numbers) => {
        let output = "";
        const nums = "0123456789";
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const text = numbers ? nums : alphabet;
        for (let i=0;i<len;i++) {
            const index = Math.floor(Math.random() * (text.length - 1));
            const char = text[index];
            output += char;
        }
        return output;
    }

    const StoreState = {
        BUY: 0,
        EQUIP: 1,
        UNEQUIP: 2,
    }

    const EntityState = {
        UPDATE: 0,
        Nr: 1,
        DELETE: 2,
        IN_WATER: 4,
        UNDER_ROOF: 8,
        Vr: 16,
        TRAPPED: 32,
        ON_PLATFORM: 64,
        Yr: 128
    }

    const SocketServer = {
        UPDATE_MOVEMENT: 20,
        MY_PLAYER_INIT: 35,
        CONNECT: 25,
        Xn: 26, // not used in the code
        $n: 9, // most likely old player init, with toggle mechanism or death marker, [byte, byte, byte, byte]
        UPDATE_INVENTORY: 2,
        PLAYER_SPAWNED: 32,
        ATTACK_ANIMATION: 29,
        LEADERBOARD: 3,
        DEFAULT_DATA: 33,
        ri: 31, // most likely unvalid shit, used in rendering, some boss or icon shit
        DAMAGE: 6,
        KILL_UPDATE: 22,
        DIED: 19,
        PLAYER_RESOURCES: 8,
        KILL_MESSAGE: 28,
        ch: 13, // somehow related to clans
        UPDATE_STORE: 5,
        TEXT_MESSAGE: 30,
        UPGRADE: 14,
        CLEAR_UPGRADE: 34, // some init, reset upgrade bar
        wi: 11, // not used in the code
        PING_REQUEST: 0,
        PING_RESPONSE: 15,
        CLAN_JOIN: 24,
        CLAN_LEAVE: 27,
        CLAN_CREATED: 4,
        CLAN_DELETED: 1,
        JOIN_REQUEST: 17,
        CLAN_UPDATED: 16,
        ITEM_COUNTER: 36,
        MINIMAP_DATA: 10,
        BOSS_SPAWNED: 37,
        BOSS_KILLED: 21,
        cy: 23, // some shit with text rendering
        HANDSHAKE: 12, // some hash shit
        Ui: 7, // some server event or boss shit
        CLAN_MESSAGE: 18
    };

    const SocketClient = {
        VERIFICATION: 11,
        MOVE_BITMASK: 6,
        UPDATE_ANGLE: 13,
        SELECT_BY_ID: 2,
        START_ATTACK: 19,
        STOP_ATTACK: 18,
        LOGIN: 10,
        UPGRADE_SCYTHE: 20,
        SELECT_BY_TYPE: 0,
        SWITCH_HAT: 5,
        CHAT: 7,
        UPGRADE_ITEM: 14,
        Ri: 12, // not used in the code
        PING_CALLBACK: 3,
        TOGGLE_AUTOATTACK: 23,
        MOVE_ANGLE: 1,
        STOP_MOVEMENT: 15,
        touchAttackStart: 9,
        Wi: 4, // not used in the code
        touchAttackStop: 8, // some shit with angle
        LEAVE_CLAN: 24,
        JOIN_CLAN: 21,
        ACCEPT_DECLINE: 17,
        KICK: 25,
        CREATE_CLAN: 22,
        io: 16, // not used in the code
    }

    class PacketHandler {
        constructor(client) {
            this.client = client;
        }

        encoder = new TextEncoder();
        sendData(data) {
            const socket = this.client.SocketManager.socket;
            if (socket !== null && socket.readyState === 1) {
                socket.send(data, true);
            }
        }

        sendString(data) {
            this.sendData(JSON.stringify(data));
        }

        send(...bytes) {
            this.sendData(new Uint8Array(bytes));
        }

        moveByBitmask(bitmask) {
            this.send(SocketClient.MOVE_BITMASK, bitmask);
        }

        updateAngle(angle) {
            this.send(SocketClient.UPDATE_ANGLE, ...encodeAngle(angle));
        }

        selectByID(itemID) {
            this.send(SocketClient.SELECT_BY_ID, itemID);
        }

        attack(angle) {
            this.send(SocketClient.START_ATTACK, ...encodeAngle(angle));
        }

        stopAttack() {
            this.send(SocketClient.STOP_ATTACK);
        }

        login(nickname = "", skin = "0", accessory = "0", back = "0", email = "", token = "") {
            this.sendString([SocketClient.LOGIN, nickname, skin + "", "FFFFFEEEEGGBBBAAA", accessory + "", email, token, back + ""]);
        }

        upgradeScythe(goldenCowID) {
            this.send(SocketClient.UPGRADE_SCYTHE, 255 & goldenCowID, goldenCowID >> 8);
        }

        selectItemByType(type) {
            this.send(SocketClient.SELECT_BY_TYPE, type);
        }

        switchHat(hat) {
            this.send(SocketClient.SWITCH_HAT, hat);
        }

        chat(message) {
            const bytes = this.encoder.encode(message);
            this.send(SocketClient.CHAT, ...bytes);
        }

        upgradeItem(id) {
            this.send(SocketClient.UPGRADE_ITEM, id);
        }

        pingCallback(value) {
            this.send(SocketClient.PING_CALLBACK, value);
        }

        autoAttack(state) {
            this.send(SocketClient.TOGGLE_AUTOATTACK, Number(state));
        }

        moveByAngle(angle) {
            this.send(SocketClient.MOVE_ANGLE, ...encodeAngle(angle));
        }

        stopMovement() {
            this.send(SocketClient.STOP_MOVEMENT);
        }

        touchAttackStart(angle) {
            this.send(SocketClient.touchAttackStart, ...encodeAngle(angle));
        }

        touchAttackStop(angle) {
            this.send(SocketClient.touchAttackStop, ...encodeAngle(angle));
        }

        leaveClan() {
            this.send(SocketClient.LEAVE_CLAN);
        }

        joinClan(id) {
            this.send(SocketClient.JOIN_CLAN, id);
        }

        acceptDecline(state) {
            this.send(SocketClient.ACCEPT_DECLINE, Number(state));
        }

        kick(id) {
            this.send(SocketClient.KICK, id);
        }

        createClan(name) {
            const bytes = this.encoder.encode(name);
            this.send(SocketClient.CREATE_CLAN, ...bytes);
        }
    }

    class SocketManager {
        constructor(client) {
            this.client = client;
            this.socket = null;
            this.decoder = new TextDecoder();
        }

        init(socket) {
            this.socket = socket;

            socket.addEventListener("message", event => {
                const data = event.data;
                if (typeof data === "string") {
                    this.handleStringMessage(JSON.parse(data));
                } else {
                    this.handleByteMessage(new Uint8Array(data));
                }
            });

            const that = this;
            const _send = socket.send;
            socket.send = function(data, ignore) {
                if (!ignore && typeof data !== "string" && that.client.isOwner) {
                    const { myPlayer, clients } = that.client;
                    switch (data[0]) {
                        case SocketClient.START_ATTACK: {
                            const pos = InputHandler.cursorPosition(myPlayer.position);
                            for (const client of clients) {
                                const angle = client.myPlayer.position.angle(pos);
                                client.PacketHandler.attack(angle);
                            }
                            break;
                        }

                        case SocketClient.STOP_ATTACK: {
                            for (const client of clients) {
                                client.PacketHandler.stopAttack();
                            }
                            break;
                        }

                        case SocketClient.UPGRADE_ITEM: {
                            const item = data[1];
                            that.client.myPlayer.upgradeItem(item);
                            break;
                        }
                    }
                }
                return _send.call(this, data);
            }
        }

        selfMessage(data) {
            this.socket.onmessage({ data });
        }

        handleStringMessage(data) {
            const { myPlayer, PlayerManager, PacketHandler } = this.client;
            switch (data[0]) {
                case SocketServer.MY_PLAYER_INIT: {
                    const id = data[1];
                    const nickname = data[2];
                    // const ageXP = data[3];
                    const inventory = data[4];
                    const resources = data[5];
                    // const hatData = data[6];
                    // const someEvent = data[7];
                    //myPlayer.id = id;
                    //myPlayer.nickname = nickname;
                    //myPlayer.inGame = true;

                    const { myPlayer } = this.client;
                    myPlayer.id = id;
                    myPlayer.inGame = true;
                    //log("MY_PLAYER_INIT", id, nickname);
                    break;
                }

                case SocketServer.PLAYER_SPAWNED: {
                    const globalID = data[1];
                    const nickname = data[2];
                    //log("PLAYER_SPAWNED", globalID, nickname);
                    break;
                }

                case SocketServer.LEADERBOARD: {
                    for (const [id, score] of data[1]) {

                    }
                    break;
                }

                case SocketServer.DEFAULT_DATA: {
                    const globalID = data[1];
                    // const serverSize = data[2];
                    const players = data[3]; // [globalID, nickname, id]
                    const clanData = data[4]; // [clanID, ownerID, clanName]
                    for (const [id, owner, name] of clanData) {
                        PlayerManager.createClan(id, owner, name);
                    }
                    // const someState = data[5];

                    myPlayer.globalID = globalID;
                    PlayerManager.playerData.set(globalID, myPlayer);

                    log("DEFAULT_DATA", globalID, data);
                    if (!this.client.isOwner) {
                        this.client.connection();
                    }
                    break;
                }

                case SocketServer.DAMAGE: {
                    const damage = data[1];
                    const id = data[2];
                    const isHeal = data[3];
                    //log("DAMAGE", damage, id, isHeal);
                    break;
                }

                case SocketServer.KILL_UPDATE: {
                    const [ kills, nuggets ] = data[1];
                    //log("KILL_UPDATE", kills, nuggets);
                    break;
                }

                case SocketServer.DIED: {
                    myPlayer.reset();
                    if (!this.client.isOwner) {
                        PacketHandler.login("Murka");
                    }
                    //log("DIED");
                    break;
                }

                case SocketServer.KILL_MESSAGE: {
                    const text = data[1]; // Killed (nickname)
                    //log(text);
                    break;
                }

                case SocketServer.UPGRADE: {
                    const items = data[1];
                    /*for (const item of items) {

                    }*/
                    myPlayer.handleUpgrade(items);
                    break;
                }

                case SocketServer.HANDSHAKE: {
                    const someHash = data[1];
                    if (!this.client.isOwner) {
                        PacketHandler.sendData("");//window.solve(0));
                    }
                    break;
                }

                default: {
                    log("default data", data);
                    break;
                }
            }
        }

        handleByteMessage(buffer) {
            const { myPlayer, PlayerManager, PacketHandler } = this.client;
            switch (buffer[0]) {
                case SocketServer.UPDATE_MOVEMENT: {
                    for (let i=1;i<buffer.length;i+=19) {
                        const type = buffer[i];
                        const globalID = buffer[i + 1];
                        const id = buffer[i + 2] | buffer[i + 3] << 8;
                        const x = buffer[i + 4] | buffer[i + 5] << 8;
                        const y = buffer[i + 6] | buffer[i + 7] << 8;
                        const state = buffer[i + 8];
                        const angle = formatAngle(buffer[i + 9]);
                        const item = buffer[i + 10];
                        const hat = buffer[i + 11];
                        const clanID = buffer[i + 12];
                        const health = buffer[i + 13];
                        const skin = buffer[i + 14];
                        const accessory = buffer[i + 15];
                        const rank = buffer[i + 16];
                        const back = buffer[i + 17];
                        const a9 = buffer[i + 18];
                        if (type === 0) {
                            const player = PlayerManager.getPlayer(globalID);
                            player.update(type, globalID, id, x, y, angle, health / 255 * 100, clanID);
                        }
                    }
                    myPlayer.postTick();
                    break;
                }

                case SocketServer.UPDATE_INVENTORY: {
                    for (let i=1;i<buffer.length;i++) {
                        const id = buffer[i];
                    }
                    break;
                }

                case SocketServer.CONNECT: { // executed only once
                    const num = buffer[1];

                    // Necessary handshakre, otherwise the game wont let to connect
                    if (!this.client.isOwner) {
                        const bytes = hashing[9629](num, getRandomString(16));
                        const tokenBytes = new Array(24).fill(0);
                        PacketHandler.send(SocketClient.VERIFICATION, num, ...bytes, ...tokenBytes);
                    }
                    break;
                }

                case SocketServer.ATTACK_ANIMATION: {
                    for (let i=1;i<buffer.length;i+=5) {
                        const type = buffer[i];
                        const id = buffer[i + 1] | buffer[i + 2] << 8;
                        const isObject = buffer[3];
                        const weapon = buffer[4];
                        //log(type, id, isObject, weapon);
                    }
                    break;
                }

                case SocketServer.PLAYER_RESOURCES: {
                    const b = buffer;
                    const age = formatAge(b[1] | b[2] << 8 | b[3] << 16 | b[4] << 24);
                    const food = b[5] | b[6] << 8 | b[7] << 16 | b[8] << 24;
                    const wood = b[9] | b[10] << 8 | b[11] << 16 | b[12] << 24;
                    const stone = b[13] | b[14] << 8 | b[15] << 16 | b[16] << 24;
                    const gold = b[17] | b[18] << 8 | b[19] << 16 | b[20] << 24;
                    myPlayer.handleStats(age, food, wood, stone, gold);
                    break;
                }

                case SocketServer.UPDATE_STORE: {
                    for (let i=1;i<buffer.length;i+=2) {
                        const hatID = buffer[i];
                        const state = buffer[i + 1];
                        //log(hatID, state);
                    }
                    break;
                }

                case SocketServer.TEXT_MESSAGE: {
                    const id = buffer[1] | buffer[2] << 8;
                    const text = this.decoder.decode(buffer.subarray(3));
                    //log(id, text);
                    break;
                }

                case SocketServer.CLEAR_UPGRADE: {
                    //log("clear upgrade bar");
                    break;
                }

                case SocketServer.PING_REQUEST: {
                    const value = buffer[1];
                    //log("PING_REQUEST", value);
                    break;
                }

                case SocketServer.PING_RESPONSE: {
                    const ping = buffer[1] | buffer[2] << 8;
                    //myPlayer.ping = ping;
                    //log("PING_RESPONSE", ping);
                    break;
                }

                case SocketServer.CLAN_JOIN: {
                    const clanID = buffer[1];
                    const isOwner = buffer[2];
                    /*myPlayer.clan.id = clanID;
                    myPlayer.clan.isOwner = isOwner;
                    myPlayer.clan.name = clanData.get(clanID).name;
                    for (let i=3;i<buffer.length;i++) {
                        const id = buffer[i];
                        if (id !== myPlayer.id) {
                            myPlayer.clan.members.push(id);
                        }
                    }*/
                    //log("CLAN_JOIN", clanID, isOwner, buffer.slice(3));
                    break;
                }

                case SocketServer.CLAN_LEAVE: {
                    /*myPlayer.clan.id = 0;
                    myPlayer.clan.isOwner = 0;
                    myPlayer.clan.members.length = 0;
                    myPlayer.clan.name = "";*/
                    break;
                }

                case SocketServer.CLAN_CREATED: {
                    const clanID = buffer[1];
                    const ownerID = buffer[2];
                    const clanName = this.decoder.decode(buffer.subarray(3));

                    PlayerManager.createClan(clanID, ownerID, clanName);
                    //log("CLAN_CREATED", { clanID, ownerID, clanName });
                    break;
                }

                case SocketServer.CLAN_DELETED: {
                    const clanID = buffer[1];
                    PlayerManager.clanData.delete(clanID);
                    //log("CLAN_DELETED", { clanID });
                    break;
                }

                case SocketServer.JOIN_REQUEST: {
                    const globalID = buffer[1];
                    myPlayer.joinRequests.push(globalID);
                    break;
                }

                case SocketServer.CLAN_UPDATED: {
                    /*const myPlayer = this.client.myPlayer;
                    myPlayer.clan.members.length = 0;
                    const clanID = buffer[1];
                    for (let i=2;i<buffer.length;i++) {
                        const id = buffer[i];
                        if (id !== myPlayer.id) {
                            myPlayer.clan.members.push(id);
                        }
                    }
                    log("clan updated", myPlayer.clan);*/
                    break;
                }

                case SocketServer.ITEM_COUNTER: {
                    break;
                }

                case SocketServer.MINIMAP_DATA: {
                    for (let i=1;i<buffer.length;i+=3) {
                        const id = buffer[i + 0];
                        const x = buffer[i + 1] / 255;
                        const y = buffer[i + 2] / 255;
                        //log("MINIMAP_DATA", id, x, y);
                    }
                    break;
                }

                case SocketServer.BOSS_SPAWNED: {
                    const type = buffer[1];
                    const x = buffer[2] / 255;
                    const y = buffer[3] / 255;
                    //log("BOSS_SPAWNED", type, x, y);
                    break;
                }

                case SocketServer.BOSS_KILLED: {
                    //log("BOSS_KILLED", buffer);
                    break;
                }

                case SocketServer.CLAN_MESSAGE: {
                    const id = buffer[1] | buffer[2] << 8;
                    const text = this.decoder.decode(buffer.subarray(3));
                    break;
                }

                default: {
                    log("default byte", buffer);
                    break;
                }
            }
        }
    }

    class PlayerClient {
        constructor(owner = null) {
            this.owner = owner;
            this.clients = new Set();
            this.pendingJoins = new Set();
            this.PacketHandler = new PacketHandler(this);
            this.SocketManager = new SocketManager(this);
            this.ModuleHandler = new ModuleHandler(this);
            this.myPlayer = new ClientPlayer(this);
            this.PlayerManager = new PlayerManager(this);
        }

        get isOwner() {
            return this.owner === null;
        }

        addClient(client) {
            this.clients.add(client);
        }

        removeClient(client) {
            this.clients.delete(client);
        }

        init(socket) {
            this.SocketManager.init(socket);
        }

        disconnect() {
            const socket = this.SocketManager.socket;
            if (socket !== null) {
                socket.close();
            }
        }

        connection() {
            this.SocketManager.socket.dispatchEvent(new Event("connected"));
        }

        removeJoin(globalID) {
            this.pendingJoins.delete(globalID);
            this.myPlayer.joinRequests.shift();
            if (this.isOwner) HookedArrays.joins.shift();
        }
    }

    const _WebSocket = WebSocket;
    const playerClient = new PlayerClient();
    const createClient = () => {
        const socket = new _WebSocket(playerClient.SocketManager.socket.url);
        socket.binaryType = "arraybuffer";
        socket.onopen = () => {
            //log("Opened");
            const client = new PlayerClient(playerClient);
            client.init(socket);

            const onconnect = () => {
                //log("Connected");
                playerClient.addClient(client);
                client.PacketHandler.login("Murka");
            }
            socket.addEventListener("connected", onconnect, { once: true });
            socket.onclose = () => {
                log("Closed");
                playerClient.removeClient(client);
            }
        }
    }

    window.SocketAPI = {
        myClient: playerClient,
        createClient,
        HookedArrays,
    }

    let hooked = false;
    const defaultHooks = () => {
        if (hooked) return;
        hooked = true;

        Array.prototype.push = new Proxy(Array.prototype.push, {
            apply(target, _this, args) {
                if (args[0] === 255) {
                    HookedArrays.joins = _this;
                    Array.prototype.push = target;
                    return;
                }
                return target.apply(_this, args);
            }
        });

        playerClient.SocketManager.selfMessage([SocketServer.JOIN_REQUEST, 255]);
    }

    window.WebSocket = new Proxy(WebSocket, {
        construct(target, args) {
            const socket = new target(...args);
            playerClient.init(socket);

            Object.defineProperty(socket, "onmessage", {
                set(callback) {
                    delete socket.onmessage;
                    socket.onmessage = callback;
                    defaultHooks();
                },
                configurable: true
            });
            return socket;
        }
    });

const BuildSystem = {
    angle: 0,
    get socket() {
        try {
            return SocketAPI.myClient.SocketManager.socket;
        } catch(e) { return null; }
    },
    send(bytes) {
        if (this.socket && this.socket.readyState === 1)
            this.socket.send(new Uint8Array(bytes));
    },
    hold(ID) {
        this.send([0, ID]);
    },
    hit() {
        let a = Math.round(65535 * ((this.angle + Math.PI) / (2 * Math.PI)));
        this.send([19, a & 255, (a >> 8) & 255]);
        this.send([18, 0]);
    },
    place(ID) {
        this.hold(ID);
        this.hit();
        this.hold(0);
    }
};

document.addEventListener("mousemove", e => {
    const c = document.getElementById("game-canvas");
    if (!c) return;
    const x = c.clientWidth / 2;
    const y = c.clientHeight / 2;
    BuildSystem.angle = Math.atan2(e.clientY - y, e.clientX - x);
});

const StructureKeybinds = {
    KeyQ: 2,
    Digit4: 3,
    KeyV: 4,
    KeyM: 5,
    KeyF: 7,
    Digit8: 8,
    Digit9: 9
};

const HatHotkeys = {
    KeyB: 2,
    KeyG: 3,
    KeyY: 4,
    KeyH: 5,
    KeyN: 7,
    KeyZ: 9,
    KeyC: 11
};

document.addEventListener("keydown", e => {
    if (StructureKeybinds[e.code]) {
        const item = StructureKeybinds[e.code];
        BuildSystem.place(item);
        for (const bot of SocketAPI.myClient.clients) {
            bot.PacketHandler.selectItemByType(item);
            bot.PacketHandler.attack(bot.ModuleHandler.mouse.angle);
            bot.PacketHandler.stopAttack();
        }
    }

    if (HatHotkeys[e.code]) {
        const hat = HatHotkeys[e.code];
        SocketAPI.myClient.PacketHandler.switchHat(hat);
        for (const bot of SocketAPI.myClient.clients) {
            bot.PacketHandler.switchHat(hat);
        }
    }

    if (e.code === "KeyR") {
        const angle = BuildSystem.angle;

        setTimeout(() => {
            const hat = 2;
            SocketAPI.myClient.PacketHandler.switchHat(hat);
            for (const bot of SocketAPI.myClient.clients) {
                bot.PacketHandler.switchHat(hat);
            }

            const weapon = 0;
            SocketAPI.myClient.PacketHandler.selectItemByType(weapon);
            for (const bot of SocketAPI.myClient.clients) {
                bot.PacketHandler.selectItemByType(weapon);
            }

            BuildSystem.send([19, Math.round(65535 * ((angle + Math.PI) / (2 * Math.PI))) & 255,
                                   (Math.round(65535 * ((angle + Math.PI) / (2 * Math.PI))) >> 8) & 255]);
            BuildSystem.send([18, 0]);
            for (const bot of SocketAPI.myClient.clients) {
                const a = bot.ModuleHandler.mouse.angle;
                bot.PacketHandler.attack(a);
                bot.PacketHandler.stopAttack();
            }

            SocketAPI.myClient.PacketHandler.selectItemByType(weapon);
            for (const bot of SocketAPI.myClient.clients) {
                bot.PacketHandler.selectItemByType(weapon);
            }

            setTimeout(() => {
                const spike = 4;
                BuildSystem.place(spike);
                for (const bot of SocketAPI.myClient.clients) {
                    bot.PacketHandler.selectItemByType(spike);
                    bot.PacketHandler.attack(bot.ModuleHandler.mouse.angle);
                    bot.PacketHandler.stopAttack();
                }
            }, 40);

            setTimeout(() => {
                const hat7 = 7;
                SocketAPI.myClient.PacketHandler.switchHat(hat7);
                for (const bot of SocketAPI.myClient.clients) {
                    bot.PacketHandler.switchHat(hat7);
                }
            }, 2000);

        }, 120);
    }

    if (e.code === "Digit1") {
        const weapon = 0;
        SocketAPI.myClient.PacketHandler.selectItemByType(weapon);
        for (const bot of SocketAPI.myClient.clients) {
            bot.PacketHandler.selectItemByType(weapon);
        }
    }
});
})();

class Visuals {
    constructor() {
        this.tracers = {
            active: true,
            disttag: true,
            dashline: false,
            color: {
                entity: "#000000",
                ally: "#000000",
                rainbow: false
            },
            size: 3, // Grosor por defecto
            visible: 1
        }
        this.text = { color: { all: "#fff", rainbow: false }, visible: 1 }
        this.rainbow = { old: Date.now(), hue: 0, power: 3, time: 10 }
        this.offset = [0, Date.now()]
    }

    rainbowColor() {
        if (!this.rainbow.old || Date.now() - this.rainbow.old >= this.rainbow.time) {
            this.rainbow.hue += this.rainbow.power * Math.random()
            this.rainbow.old = Date.now()
        }
        visuals.rb = `hsl(${this.rainbow.hue}, 100%, 50%)`
    }

    drawText(text, x, y) {
        Context.save()
        Context.font = '18px "Baloo Paaji"'
        Context.lineWidth = 8
        Context.strokeStyle = "#3d3f42"
        Context.globalAlpha = this.text.visible
        Context.textAlign = 'center'
        Context.fillStyle = this.text.color.rainbow ? visuals.rb : this.text.color.all
        Context.strokeText(text, x, y)
        Context.fillText(text, x, y)
        Context.restore()
    }

    updateOffset() {
        if (!this.offset[1] || Date.now() - this.offset[1] >= 10) {
            this.offset[0]++
            this.offset[1] = Date.now()
        }
    }

    dashLine() {
        Context.setLineDash([18, 6, 6, 6])
        Context.lineDashOffset = -visuals.offset[0]
    }
}

let visuals = new Visuals()

class Tracers {
    constructor() {
        this.allAlly = []
        this.allEntity = []
        this.localPlayer = { active: false, x: 0, y: 0 }
    }

    drawDistTag(x, y, dist) {
        if (!visuals.tracers.disttag) return
        Context.save()
        Context.font = '18px "Baloo Paaji"'
        Context.lineWidth = 8
        Context.strokeStyle = "#3d3f42"
        Context.globalAlpha = visuals.text.visible
        Context.fillStyle = visuals.text.color.rainbow ? visuals.rb : visuals.text.color.all
        Context.strokeText(dist, x, y)
        Context.fillText(dist, x, y)
        Context.restore()
    }

    draw(x, y, x2, y2) {
        if (!visuals.tracers.active) return
        Context.save()
        Context.lineCap = "round"
        Context.lineWidth = visuals.tracers.size
        Context.globalAlpha = visuals.tracers.visible
        Context.beginPath()
        if (visuals.tracers.dashline) visuals.dashLine()
        Context.strokeStyle = "#000000" // Todas las líneas negras
        Context.moveTo(x, y)
        Context.lineTo(x2, y2)
        Context.stroke()
        Context.restore()
    }
}

let tracers = new Tracers()
let Context

let { clearRect, fillRect } = CanvasRenderingContext2D.prototype

CanvasRenderingContext2D.prototype.clearRect = function(x, y, width, height) {
    if (this.canvas.id === "game-canvas") {
        Context = this.canvas.getContext("2d")
        visuals.rainbowColor()
        tracers.allEntity = []
        tracers.allAlly = []
    }
    return clearRect.apply(this, arguments);
}

CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
    if (document.getElementById("homepage").style.display == "none") {
        visuals.updateOffset()

        if (this.fillStyle == "#a4cc4f") { // Ally
            tracers.allAlly.push({ x: x + 45, y: y - 70 })
            tracers.localPlayer.active = true
            tracers.localPlayer.x = tracers.allAlly[0].x
            tracers.localPlayer.y = tracers.allAlly[0].y
            visuals.drawText(`HP: ${~~(width / 95 * 100)}%`, x + 45, y + 40)

            if (tracers.allAlly[1]) {
                tracers.allAlly.forEach(ally => {
                    if (ally.x != tracers.localPlayer.x) {
                        tracers.draw(tracers.localPlayer.x, tracers.localPlayer.y, ally.x, ally.y)
                        tracers.drawDistTag((tracers.localPlayer.x + ally.x) / 2, (tracers.localPlayer.y + ally.y) / 2, ~~(Math.hypot(tracers.localPlayer.y - ally.y, tracers.localPlayer.x - ally.x)))
                    }
                })
            }
        }

        if (this.fillStyle == "#cc5151" && tracers.localPlayer.active) { // Enemy
            tracers.allEntity.push({ x: x + 45, y: y - 70 })
            tracers.allEntity.forEach(enemy => {
                tracers.draw(tracers.localPlayer.x, tracers.localPlayer.y, enemy.x, enemy.y)
                tracers.drawDistTag((tracers.localPlayer.x + enemy.x) / 2, (tracers.localPlayer.y + enemy.y) / 2, ~~(Math.hypot(tracers.localPlayer.y - enemy.y, tracers.localPlayer.x - enemy.x)))
            })
        }

    } else {
        tracers.localPlayer.active = false
    }
    return fillRect.apply(this, arguments)
}
