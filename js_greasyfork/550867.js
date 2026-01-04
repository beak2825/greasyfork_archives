// ==UserScript==
// @name ! Glotus Client [Moomoo.io]
// @author Murka
// @description An excellent Moomoo.io hack for a comfortable gaming experience
// @icon https://imagizer.imageshack.com/img924/3497/SedB2D.png
// @version 2.3
// @match *://moomoo.io/
// @match *://moomoo.io/?server*
// @match *://*.moomoo.io/
// @match *://*.moomoo.io/?server*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/550867/%21%20Glotus%20Client%20%5BMoomooio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/550867/%21%20Glotus%20Client%20%5BMoomooio%5D.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007/Glotus-client
    Greasyfork: https://greasyfork.org/users/919633
    Discord: https://discord.gg/cPRFdcZkeD

    Feel free to use and distribute it, but don't forget about special credits.
*/

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
        spike: "KeyC",
        windmill: "KeyR",
        farm: "KeyT",
        trap: "Space",
        turret: "KeyF",
        spawn: "KeyG",
        up: "KeyW",
        left: "KeyA",
        down: "KeyS",
        right: "KeyD",
        autoattack: "KeyE",
        lockrotation: "KeyX",
        toggleChat: "Enter",
        toggleShop: "ShiftLeft",
        toggleClan: "ControlLeft",
        toggleMenu: "Escape",
        biomehats: true,
        autoemp: true,
        antienemy: true,
        antianimal: true,
        antispike: true,
        autoheal: true,
        healingSpeed: 25,
        automill: true,
        autoplacer: true,
        autobreak: true,
        enemyTracers: false,
        enemyTracersColor: "#cc5151",
        teammateTracers: false,
        teammateTracersColor: "#8ecc51",
        animalTracers: false,
        animalTracersColor: "#518ccc",
        notificationTracers: true,
        notificationTracersColor: "#f5d951",
        arrows: true,
        itemMarkers: true,
        itemMarkersColor: "#84bd4b",
        teammateMarkers: true,
        teammateMarkersColor: "#bdb14b",
        enemyMarkers: true,
        enemyMarkersColor: "#ba4949",
        weaponXPBar: true,
        playerTurretReloadBar: true,
        playerTurretReloadBarColor: "#cf7148",
        weaponReloadBar: true,
        weaponReloadBarColor: "#5155cc",
        renderHP: true,
        objectTurretReloadBar: false,
        objectTurretReloadBarColor: "#66d9af",
        itemHealthBar: false,
        itemHealthBarColor: "#6b449e",
        itemCounter: true,
        renderGrid: false,
        windmillRotation: false,
        entityDanger: true,
        displayPlayerAngle: false,
        projectileHitbox: false,
        possibleShootTarget: false,
        weaponHitbox: false,
        collisionHitbox: false,
        placementHitbox: false,
        turretHitbox: false,
        possiblePlacement: true,
        autospawn: false,
        autoaccept: false,
        menuTransparency: false,
        storeItems: [ [ 15, 31, 6, 7, 22, 12, 26, 11, 53, 20, 40, 56 ], [ 11, 17, 16, 13, 19, 18, 21 ] ]
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
    const UI_StoreHandler = StoreHandler;
    const styles = '@import"https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;800&display=swap";header{display:flex;justify-content:space-between;align-items:center;height:45px;background:#121212;padding:10px;border-radius:6px}header h1{font-size:2.3em}header #credits{display:flex;justify-content:space-between;gap:10px;height:45px}header #credits p{margin-top:auto}header #logo{display:block;width:auto;height:100%;scale:1.2}header #close-button{display:block;fill:#adadad;cursor:pointer;width:auto;height:100%}header #close-button:hover{fill:#ebebeb}@keyframes ripple{from{opacity:1;transform:scale(0)}to{opacity:0;transform:scale(2)}}#navbar-container{display:flex;flex-direction:column;background:#121212;padding:10px;border-radius:6px}#navbar-container .open-menu{position:relative;width:8.5em;height:3.5em;background:#0d0d0d;font-weight:800;font-size:1.3em;overflow:hidden;transition:background 100ms}#navbar-container .open-menu:hover{background:#3d3d3d}#navbar-container .open-menu.active{background:#3d3d3d;pointer-events:none}#navbar-container .open-menu.bottom-align{margin-top:auto}#navbar-container .open-menu .ripple{position:absolute;z-index:5;background:rgba(255,255,255,.3);top:0;left:0;border-radius:50%;opacity:0;animation:ripple 1100ms;pointer-events:none}@keyframes toclose{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0)}}@keyframes toopen{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}@keyframes appear{from{opacity:0}to{opacity:1}}#page-container{width:100%;height:100%;overflow-y:scroll}.menu-page{background:#121212;padding:10px;border-radius:6px;display:none}.menu-page.opened{display:block}.menu-page h1{font-size:2.8em}.menu-page>.section{margin-top:20px;background:#0d0d0d;padding:15px;border-radius:6px}.menu-page>.section .section-title{font-weight:800;font-size:1.8em;color:#999;margin-bottom:10px}.menu-page>.section .section-content.split{display:flex;column-gap:30px}.menu-page>.section .section-content .content-split{width:100%;display:flex;flex-direction:column;row-gap:10px}.menu-page>.section .section-content .content-option{display:flex;justify-content:space-between;align-items:center}.menu-page>.section .section-content .content-option.centered{justify-content:center}.menu-page>.section .section-content .content-option .option-title{font-weight:800;font-size:1.4em;color:#585858;transition:color 100ms}.menu-page>.section .section-content .content-option .option-content{display:flex;justify-content:center;align-items:center;column-gap:10px}.menu-page>.section .section-content .content-option .disconnect-button{width:30px;height:30px;cursor:pointer;fill:rgba(122,49,49,.4784313725);transition:fill 100ms}.menu-page>.section .section-content .content-option:hover .option-title{color:#7e7d7d}.menu-page>.section .section-content .content-option:hover .disconnect-button{fill:#7a3131}.menu-page>.section .section-content .content-option:hover .disconnect-button:hover{fill:#893333}.menu-page>.section .section-content .text{display:flex;justify-content:left;gap:10px}.menu-page>.section .section-content .text .text-value{color:#857f7f;font-weight:800;font-size:1.5em}.menu-page>.section .section-content .option-button{width:117px;height:52px;background:#303030;border:5px solid #262626;border-radius:6px;font-weight:800;font-size:1.1em;color:#7e7d7d;transition:background 100ms,border-color 100ms}.menu-page>.section .section-content .option-button:hover{background:#383838;border-color:#2c2c2c}.menu-page>.section .section-content .hotkeyInput{width:90px;height:40px;background:#303030;border:5px solid #262626;border-radius:6px;font-weight:800;font-size:1.1em;color:#7e7d7d;display:flex;justify-content:center;align-items:center;transition:background 100ms,border-color 100ms,color 100ms}.menu-page>.section .section-content .hotkeyInput:hover{background:#383838;border-color:#2c2c2c}.menu-page>.section .section-content .hotkeyInput.active{background:#404040;border-color:#303030}.menu-page>.section .section-content .hotkeyInput.red{background:#7a3131;border-color:#672929;color:#b57272}.menu-page>.section .section-content .hotkeyInput.red:hover{background:#893333;border-color:#712d2d}.menu-page>.section .section-content .hotkeyInput.red.active{background:#923939;border-color:#712d2d}.menu-page>.section .section-content .switch-checkbox{position:relative;width:90px;height:40px}.menu-page>.section .section-content .switch-checkbox input{width:0;height:0;opacity:0}.menu-page>.section .section-content .switch-checkbox input:checked+span{background:#404040;box-shadow:0px -20px 0px 0px #353535 inset}.menu-page>.section .section-content .switch-checkbox input:checked+span:before{transform:translateX(50px) scale(0.7);background:#7e7d7d}.menu-page>.section .section-content .switch-checkbox span{position:absolute;cursor:pointer;top:0;left:0;bottom:0;right:0;width:100%;height:100%;display:flex;align-items:center;background:#303030;border-radius:6px;box-shadow:0px -20px 0px 0px #2a2a2a inset}.menu-page>.section .section-content .switch-checkbox span:before{position:absolute;content:"";transform:scale(0.7);transition:transform 300ms;width:40px;height:40px;border-radius:6px;background:#585858}.menu-page>.section .section-content input[id][type=color]{width:60px;height:33.3333333333px;outline:none;border:none;padding:3px;margin:0;background:#303030;border-radius:6px;cursor:pointer}.menu-page>.section .section-content .reset-color{background:var(--data-color);width:10px;height:10px;border-radius:50%}.menu-page>.section .section-content .slider{position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px}.menu-page>.section .section-content .slider input{appearance:none;outline:none;cursor:pointer;padding:0;margin:0;border:none;width:144px;height:30px;background:#404040;box-shadow:0px -15px 0px 0px #353535 inset;border-radius:6px}.menu-page>.section .section-content .slider input::-webkit-slider-thumb{-webkit-appearance:none;transform:scale(0.7);width:30px;height:30px;background:#7e7d7d;border-radius:6px}.menu-page>.section .section-content .slider .slider-value{color:#585858;font-weight:800;font-size:1.4em;opacity:.4}@keyframes toclose{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(0)}}@keyframes toopen{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}@keyframes appear{from{opacity:0}to{opacity:1}}html,body{margin:0;padding:0;scrollbar-width:thin;scrollbar-track-color:#303030;scrollbar-face-color:#262626}*{font-family:"Noto Sans",sans-serif;color:#f1f1f1}h1{font-weight:800;margin:0}h2{margin:0}p{font-weight:800;font-size:1.1rem;margin:0;color:#b8b8b8}button{border:none;outline:none;cursor:pointer}#menu-container{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:1280px;height:720px;display:flex;justify-content:center;align-items:center}#menu-container.transparent #menu-wrapper{background:rgba(8,8,8,.5882352941)}#menu-container.transparent header,#menu-container.transparent .menu-page,#menu-container.transparent #navbar-container{background:rgba(18,18,18,.5882352941)}#menu-container.transparent .section{background:rgba(13,13,13,.462745098)}#menu-container.transparent .open-menu{background:rgba(13,13,13,.462745098)}#menu-container.transparent .open-menu:hover,#menu-container.transparent .open-menu.active{background:rgba(61,61,61,.6039215686)}#menu-wrapper{position:relative;display:flex;flex-direction:column;row-gap:10px;width:85%;height:85%;padding:10px;border-radius:6px;background:#080808}#menu-wrapper.toclose{animation:150ms ease-in toclose forwards}#menu-wrapper.toopen{animation:150ms ease-in toopen forwards}main{display:flex;column-gap:10px;width:100%;height:calc(100% - 75px)}::-webkit-scrollbar{width:12px}::-webkit-scrollbar-track{background:#303030;border-radius:6px}::-webkit-scrollbar-thumb{background:#262626;border-radius:6px}.icon{width:50px;height:50px}';
    const Game = "#iframe-page-container{position:absolute;z-index:10;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none}#promoImgHolder,#gameName,#rightCardHolder,#mobileDownloadButtonContainer,#touch-controls-left,#touch-controls-right,#touch-controls-fullscreen,#partyButton,#adCard,#joinPartyButton,#guideCard>*:not(#serverBrowser,#altServer,#skinColorHolder,.settingRadio){display:none !important}#setupCard{display:flex;flex-direction:column;row-gap:10px;background:rgba(189,189,189,.2666666667);box-shadow:none}#linksContainer2{background:#505050}#setupCard>*{margin:0 !important}.actionBarItem{position:relative}.itemCounter{position:absolute;top:3px;right:3px;font-size:.95em;color:#fff;text-shadow:#3d3f42 2px 0px 0px,#3d3f42 1.75517px .958851px 0px,#3d3f42 1.0806px 1.68294px 0px,#3d3f42 .141474px 1.99499px 0px,#3d3f42 -0.832294px 1.81859px 0px,#3d3f42 -1.60229px 1.19694px 0px,#3d3f42 -1.97998px .28224px 0px,#3d3f42 -1.87291px -0.701566px 0px,#3d3f42 -1.30729px -1.5136px 0px,#3d3f42 -0.421592px -1.95506px 0px,#3d3f42 .567324px -1.91785px 0px,#3d3f42 1.41734px -1.41108px 0px,#3d3f42 1.92034px -0.558831px 0px}.itemCounter.hidden{display:none}#onetrust-consent-sdk{display:none !important}#topInfoHolder{display:flex;flex-direction:column;justify-content:right;align-items:flex-end;gap:10px}#topInfoHolder>div:not([class]):not([id]){display:none}#killCounter,#totalKillCounter{position:static;margin:0;background-image:url(../img/icons/skull.png)}.closedItem{display:none !important}#storeContainer{display:flex;flex-direction:column;gap:10px;max-width:400px;width:100%;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}#toggleStoreType{display:flex;justify-content:center;align-items:center;padding:10px;background-color:rgba(0,0,0,.15);color:#fff;border-radius:4px;cursor:pointer;font-size:20px;pointer-events:all}#itemHolder{background-color:rgba(0,0,0,.15);max-height:200px;height:100%;padding:10px;overflow-y:scroll;border-radius:4px;pointer-events:all}#itemHolder::-webkit-scrollbar{display:none;width:0;height:0;background:rgba(0,0,0,0)}.storeItemContainer{display:flex;align-items:center;gap:10px;padding:5px;height:50px;box-sizing:border-box;overflow:hidden}.storeHat{display:flex;justify-content:center;align-items:center;width:45px;height:45px;margin-top:-5px;pointer-events:none}.storeItemName{color:#fff;font-size:20px}.equipButton{margin-left:auto;color:#80eefc;cursor:pointer;font-size:35px}#bottomContainer{bottom:10px}#scriptName{position:absolute;top:0;left:0}";
    code = '<header> <div id="credits"> <svg version="1.1" id="logo" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"> <path transform="translate(868.08 108.59)" d="m0 0c0.70463-0.0067323 1.4093-0.013465 2.1352-0.020401 6.4762 0.12104 11.035 2.1066 15.783 6.4267 6.7355 7.1685 7.4975 15.175 7.2769 24.712-0.32818 6.7315-1.9685 13.117-3.7144 19.6-0.39653 1.5245-0.79241 3.0492-1.1877 4.574-15.141 57.747-33.221 114.75-51.15 171.68-0.77339 2.4566-1.5457 4.9135-2.3178 7.3705-4.8024 15.273-9.6359 30.535-14.809 45.687-0.51513 1.5277-0.51513 1.5277-1.0407 3.0862-5.8617 16.918-5.8617 16.918-12.244 22.918-0.67418 0.65227-1.3484 1.3045-2.043 1.9766-1.7695 1.3984-1.7695 1.3984-3.7695 1.3984v2c-2.0273 1.7234-4.0653 3.3381-6.1875 4.9375-4.8734 3.7442-9.6517 7.5565-14.312 11.562-4.471 3.8341-9.032 7.5173-13.688 11.125-4.9944 3.8756-9.7402 7.9242-14.398 12.203-3.3976 3.0568-6.9447 5.9139-10.496 8.7891-3.7343 3.0494-7.405 6.1702-11.077 9.2942-3.4521 2.9308-6.943 5.8055-10.466 8.6511-4.7271 3.842-9.2068 7.9069-13.688 12.031-3.2993 2.954-6.7453 5.6796-10.227 8.4141-3.423 2.771-6.6461 5.7432-9.8984 8.7109-2.6078 2.3215-5.2829 4.5266-8 6.7188-4.7768 3.8631-9.302 7.9416-13.82 12.102-2.6423 2.3713-5.3491 4.6135-8.1172 6.8359-4.2031 3.3889-8.1871 6.9374-12.125 10.625-4.7712 4.4679-9.6791 8.6676-14.785 12.754-3.9854 3.2972-7.737 6.8279-11.5 10.375-2.2148 1.8711-2.2148 1.8711-4.2148 1.8711v2c-1.2227 1.2695-1.2227 1.2695-3.0625 2.8125-0.72574 0.61746-1.4515 1.2349-2.1992 1.8711-0.90363 0.76441-1.8073 1.5288-2.7383 2.3164-2.4635 2.119-4.9193 4.2469-7.375 6.375-0.6546 0.56598-1.3092 1.132-1.9836 1.7151-3.6698 3.1784-7.3014 6.3911-10.891 9.6599-3.2287 2.9318-6.5326 5.7126-9.9375 8.4375-5.3248 4.3005-10.273 8.933-15.238 13.637-4.625 4.3579-9.3867 8.402-14.403 12.308-2.0969 1.8028-3.6149 3.5924-5.1719 5.8672 5.208 2.3208 10.456 4.2336 15.875 6 4.5547 1.5 4.5547 1.5 6.8157 2.2454 1.6015 0.52332 3.2057 1.0382 4.812 1.5464 0.80478 0.25822 1.6096 0.51643 2.4387 0.78247 0.72905 0.23034 1.4581 0.46068 2.2092 0.698 2.6191 1.0307 3.9951 2.6343 5.8494 4.7278 1.2792 0.95451 2.5725 1.8902 3.875 2.8125 7.5329 5.5831 11.921 11.63 13.938 20.938 1.1447 13.632-5.9612 26.77-14.188 37.188-15.306 17.463-37.523 33.314-58.625 43.062h-2l-1 2c-9.832 3.3392-20.457 3.193-30-1-9.0874-4.8402-17.029-11.545-25-18-1.0018-0.81042-1.0018-0.81042-2.0239-1.6372-3.4276-2.7755-6.85-5.5573-10.269-8.3433-4.5453-3.7035-9.0945-7.3997-13.707-11.02-0.64324-0.51434-1.2865-1.0287-1.9492-1.5586-3.6186-2.7709-6.4181-4.8196-11.051-4.4414-3.0465 1.9411-5.465 4.4432-8 7-0.89461 0.87012-1.7892 1.7402-2.7109 2.6367-4.6551 4.5722-9.1144 9.2354-13.348 14.203-2.5425 2.829-5.236 5.4878-7.9414 8.1602-3.2221 3.1829-6.3905 6.3469-9.3125 9.8125-4.0741 4.7984-8.604 9.1542-13.095 13.558-3.1238 3.0815-6.1309 6.1991-8.991 9.5281-4.0078 4.6483-8.3527 8.9253-12.727 13.227-2.9835 2.9345-5.9455 5.8865-8.875 8.875-0.54793 0.5431-1.0959 1.0862-1.6604 1.6458-2.4213 2.5837-3.3138 4.1479-3.7576 7.6941 0.076055 1.1872 0.15211 2.3745 0.23047 3.5977 0.047874 1.3357 0.088031 2.6717 0.12109 4.0078 0.017886 0.67579 0.035771 1.3516 0.054199 2.0479 0.13648 22.438-9.8287 42.623-25.238 58.386-16.639 15.859-38.194 21.12-60.574 20.77-32.474-0.91475-58.907-15.915-81.383-38.352-17.614-18.76-26.234-43.914-27.043-69.359 0.81801-25.407 10.042-46.905 28.438-64.625 12.128-10.629 27.322-17.522 43.197-20.087 8.9085-1.4767 13.784-3.2843 19.51-10.745 0.6948-0.98355 1.3896-1.9671 2.1055-2.9805 1.4259-1.7595 2.8634-3.5096 4.3125-5.25 0.72832-0.90105 1.4566-1.8021 2.207-2.7305 7.2516-8.8275 14.851-17.375 22.516-25.844 3.9882-4.4163 7.8855-8.9089 11.75-13.434 1.0299-1.2058 2.0599-2.4115 3.0898-3.6172 0.51965-0.60852 1.0393-1.217 1.5747-1.844 3.0292-3.5372 6.1018-7.0249 9.2378-10.469 4.6378-5.11 8.9914-10.434 13.312-15.812 1.0886-1.3052 1.0886-1.3052 2.1992-2.6367 2.6966-3.539 3.2616-6.8067 3.1938-11.236-0.74301-4.0206-3.4519-6.5065-6.2056-9.377-0.58878-0.6455-1.1776-1.291-1.7842-1.9561-1.7834-1.9486-3.5909-3.8723-5.4033-5.7939-1.4678-1.5866-2.93-3.178-4.3914-4.7705-1.3503-1.4704-2.706-2.9359-4.0618-4.4014-3.2209-3.5765-6.2239-7.3042-9.2383-11.055-2.4819-2.9817-5.0951-5.8187-7.7461-8.6484-11.792-12.676-21.99-24.809-21.48-43.066 3.407-27.518 27.039-66.699 47.918-84.559 5.9718-4.5112 12.209-7.1966 19.84-6.8477 17.094 2.7511 34.034 17.486 44.098 30.938 4.2859 6.4381 7.3285 13.191 10.062 20.41 7.824-9.5531 15.526-19.17 23-29 2.0817-2.7304 4.1656-5.4591 6.25-8.1875 0.81356-1.0657 0.81356-1.0657 1.6436-2.1528 4.0884-5.348 8.2159-10.664 12.356-15.972 4.6005-5.8986 9.1409-11.833 13.609-17.832 2.3536-3.1396 4.7426-6.2498 7.1406-9.3555 3.8824-5.0298 7.7073-10.099 11.508-15.191 1.8918-2.5232 3.809-5.0258 5.7344-7.5234 7.5051-9.6188 7.5051-9.6188 14.316-19.73 1.3298-1.8955 2.7369-3.5894 4.2539-5.3359 3.1005-3.572 5.9408-7.2908 8.75-11.094 1.0579-1.4211 2.1165-2.8416 3.1758-4.2617 0.53963-0.72365 1.0793-1.4473 1.6353-2.1929 2.6013-3.4712 5.2376-6.9153 7.8765-10.358 0.52964-0.69182 1.0593-1.3836 1.605-2.0964 2.371-3.0966 4.7431-6.1922 7.1172-9.2864 6.9922-9.117 13.973-18.224 20.592-27.617 3.0266-4.2821 6.1935-8.4387 9.4126-12.577 3.6953-4.7679 7.2699-9.6201 10.836-14.485 5.1531-7.0285 10.394-13.981 15.708-20.889 2.9437-3.8331 5.8403-7.6907 8.6675-11.611 2.947-4.0834 5.9477-8.12 9-12.125 0.79793-1.0493 1.5959-2.0986 2.418-3.1797 7.3745-9.0707 16.159-14.641 27.277-18.121 2.2951-0.62073 2.2951-0.62073 3.1172-2.8242 1.8452-0.2245 3.6914-0.44251 5.5404-0.63281 4.8219-0.71986 9.4052-2.3736 14.034-3.8672 1.11-0.35194 2.2199-0.70389 3.3635-1.0665 3.5853-1.1382 7.1675-2.2859 10.75-3.4335 2.4571-0.78153 4.9145-1.5623 7.3721-2.3423 4.8141-1.5283 9.6274-3.0592 14.44-4.5923 7.9059-2.5156 15.825-4.9889 23.75-7.4404 1.0889-0.33773 2.1777-0.67547 3.2996-1.0234 1.9287-0.59704 3.8581-1.192 5.7883-1.7842 1.8337-0.56302 3.6656-1.1317 5.4961-1.7051 0.89525-0.27683 1.7905-0.55365 2.7129-0.83887 0.78729-0.24573 1.5746-0.49146 2.3857-0.74463 2.0674-0.52881 2.0674-0.52881 5.0674-0.52881l1-2c2.0635-0.65381 2.0635-0.65381 4.8906-1.2734 5.3022-1.2515 10.508-2.6858 15.719-4.2656 0.791-0.2396 1.582-0.4792 2.397-0.72606 1.6915-0.51395 3.3826-1.029 5.0735-1.545 2.7544-0.84057 5.51-1.6773 8.2659-2.5133 8.5257-2.5879 17.048-5.1863 25.57-7.7864 13.103-3.9975 26.21-7.9851 39.326-11.94 6.004-1.8112 12.003-3.6372 17.996-5.485 3.178-0.97486 6.3616-1.9305 9.5474-2.8797 1.3959-0.41997 2.7895-0.84771 4.1802-1.2846 7.4197-2.3263 14.365-3.6465 22.117-3.7067z" fill="#353C35"/> <path transform="translate(843,160)" d="m0 0c0.87909 3.1738 0.98903 4.9646 0.066406 8.1484-0.34938 1.2387-0.34938 1.2387-0.70581 2.5024-0.39506 1.3484-0.39506 1.3484-0.7981 2.7241-0.55849 1.9736-1.1157 3.9476-1.6719 5.9219-0.30357 1.0693-0.60715 2.1386-0.91992 3.2402-1.5967 5.6962-3.1174 11.413-4.6372 17.13-0.50784 1.9089-1.0182 3.8171-1.5285 5.7253-1.4648 5.4908-2.907 10.983-4.262 16.502-1.8468 7.4363-3.9359 14.802-6.043 22.168-0.21587 0.75494-0.43174 1.5099-0.65414 2.2877-8.0126 27.951-17.064 55.512-26.559 82.99-2.8479 8.2577-5.5966 16.548-8.3086 24.851-1.7657 5.3597-3.6081 10.69-5.5405 15.992-0.39316 1.0872-0.78633 2.1745-1.1914 3.2947-0.41121 0.83217-0.82242 1.6643-1.2461 2.5217-3.6956 1.2319-4.5849 0.62215-8.1133-0.83594-1.001-0.40477-2.0019-0.80953-3.0332-1.2266-1.0448-0.43312-2.0896-0.86625-3.166-1.3125-2.0563-0.84665-4.1149-1.688-6.1758-2.5234-0.91306-0.37818-1.8261-0.75636-2.7668-1.146-2.9074-1.0121-5.7004-1.5329-8.7449-1.9556 1.3335 1.3335 2.8308 2.2957 4.3867 3.3633 0.69158 0.47502 1.3832 0.95004 2.0957 1.4395 0.72768 0.49822 1.4554 0.99645 2.2051 1.5098 0.70834 0.48662 1.4167 0.97324 2.1465 1.4746 4.0353 2.7685 8.0873 5.5087 12.166 8.2129-1.5022 3.7389-3.6017 5.5409-6.75 8-4.4989 3.5802-8.9008 7.2395-13.25 11-4.9886 4.3006-10.042 8.5049-15.156 12.656-3.9325 3.2411-7.787 6.5698-11.646 9.8979-3.5828 3.0831-7.2074 6.1011-10.885 9.0708-3.7169 3.0149-7.2893 6.1358-10.812 9.375-4.3903 4.0363-8.9118 7.8403-13.551 11.586-3.3629 2.7527-6.6585 5.5758-9.9492 8.4141-4.1022 3.5362-8.228 7.0286-12.438 10.438-5.0518 4.1023-9.9656 8.3495-14.873 12.623-4.0583 3.5322-8.1393 7.0343-12.252 10.502-12.951 10.904-12.951 10.904-25.625 22.125-3.2492 2.9538-6.5712 5.757-10 8.5-6.0657 4.9025-11.694 10.235-17.367 15.582-3.1257 2.9433-6.314 5.7988-9.5664 8.6016-4.0147 3.4805-7.935 7.0686-11.879 10.629-1.6664 1.5003-3.3331 3.0003-5 4.5-0.82887 0.74637-1.6577 1.4927-2.5117 2.2617-1.626 1.4627-3.2536 2.9237-4.8828 4.3828-8.3305 7.4692-16.56 15.047-24.711 22.711-0.69916 0.65726-1.3983 1.3145-2.1187 1.9917-1.3493 1.2698-2.6973 2.5409-4.0439 3.8135-4.4852 4.2235-9.0804 8.3005-13.732 12.339-1.6688 1.4768-3.3359 2.9554-5 4.4375-0.76312 0.67934-1.5262 1.3587-2.3125 2.0586-0.83531 0.74443-0.83531 0.74443-1.6875 1.5039-3.5083-1.5208-5.9527-3.5996-8.75-6.1875-2.9494-2.7054-5.8997-5.3943-8.9375-8-4.6095-4.0135-9.0492-8.2078-13.509-12.386-5.8936-5.5207-11.839-10.983-17.804-16.427 5.0137-5.9623 10.266-11.693 15.544-17.419 2.3231-2.5226 4.639-5.0519 6.9556-7.5806 0.92056-1.0039 1.8411-2.0078 2.7617-3.0117 1.7961-1.9592 3.59-3.9205 5.3828-5.8828 5.1673-5.6515 10.371-11.266 15.605-16.855 4.0531-4.3292 8.0554-8.6815 11.926-13.176 2.4978-2.8401 5.0669-5.6118 7.6367-8.3867 9.9004-10.674 9.9004-10.674 19.562-21.562 3.6073-4.1544 7.3481-8.1822 11.099-12.207 2.6949-2.8999 5.3367-5.8352 7.9321-8.8247 4.1992-4.8221 8.5917-9.4524 12.988-14.094 3.7604-3.9861 7.4233-8.034 10.996-12.189 1.6392-1.844 3.3487-3.5828 5.1094-5.3105 2.2933-2.258 4.4643-4.56 6.5625-7 5.1684-5.9857 10.626-11.708 16.036-17.474 1.8617-1.9841 3.7216-3.9698 5.5811-5.9561 3.1132-3.3247 6.2293-6.6466 9.3467-9.9673 1.3605-1.4497 2.7205-2.9 4.0801-4.3506 2.1301-2.2727 4.2617-4.5439 6.3936-6.8149 0.6463-0.69013 1.2926-1.3803 1.9585-2.0913 3.0535-3.2496 6.1349-6.4582 9.2993-9.6001 2.3124-2.2965 4.5196-4.6239 6.6172-7.1211 2.5913-3.0097 5.2975-5.8359 8.125-8.625 2.7862-2.7486 5.4531-5.5286 8-8.5 3.18-3.7101 6.5876-7.1298 10.094-10.531 1.9594-2.0103 3.7888-4.0495 5.6172-6.1758 4.0901-4.7132 8.4794-9.0936 12.914-13.48 0.78504-0.78053 1.5701-1.5611 2.3789-2.3652 5.9292-5.8942 5.9292-5.8942 8.1169-8.0286 3.2839-3.2186 5.2875-5.6724 5.4463-10.431-0.0079761-0.71132-0.015952-1.4226-0.02417-2.1555-0.01418-1.2646-0.028359-2.5291-0.042969-3.832-0.8826 0.38333-1.7652 0.76667-2.6746 1.1616-3.2891 1.4283-6.5786 2.8556-9.8682 4.2827-1.421 0.61661-2.8419 1.2335-4.2627 1.8506-2.0476 0.88934-4.0957 1.7778-6.1438 2.666-0.63041 0.27404-1.2608 0.54807-1.9103 0.83041-2.654 1.1501-5.3006 2.2683-8.0116 3.2785-2.707 1.1828-2.9946 2.2719-4.1289 4.9302-1.4805 1.6406-1.4805 1.6406-3.1875 3.25-3.2018 3.0294-6.0544 6.2979-8.9412 9.6226-2.9422 3.3449-5.9993 6.5777-9.0588 9.8149-1.3233 1.4059-2.6462 2.8121-3.9688 4.2188-0.64969 0.69094-1.2994 1.3819-1.9688 2.0938-2.7022 2.8823-5.3852 5.782-8.0625 8.6875-0.4859 0.52715-0.97179 1.0543-1.4724 1.5974-1.922 2.0864-3.8427 4.174-5.7625 6.2625-8.118 8.8299-16.324 17.574-24.552 26.302-5.6877 6.0386-11.357 12.095-17.026 18.151-0.60618 0.64743-1.2124 1.2949-1.8369 1.9619-6.8593 7.3286-13.69 14.682-20.464 22.089-7.7804 8.5011-15.62 16.946-23.49 25.365-3.7309 3.9935-7.4455 8.0013-11.147 12.022-5.716 6.2062-11.487 12.36-17.262 18.512-7.9458 8.4654-15.873 16.948-23.738 25.488-7.6097 8.261-15.309 16.438-22.999 24.624-1.9174 2.0416-3.8344 4.0836-5.751 6.126-0.62117 0.66169-1.2423 1.3234-1.8823 2.0051-3.9812 4.2462-7.9315 8.5194-11.868 12.807-4.4004 4.7913-8.9009 9.4618-13.562 14-5.8423-4.1181-11.1-8.7281-16.355-13.566-4.6205-4.252-9.3708-8.3474-14.145-12.426-0.62673-0.53577-1.2535-1.0715-1.8992-1.6235-1.2542-1.0713-2.5096-2.1413-3.7661-3.21-0.58096-0.49581-1.1619-0.99161-1.7605-1.5024-0.5199-0.44247-1.0398-0.88494-1.5754-1.3408-1.5624-1.3875-3.0357-2.8398-4.4988-4.3311 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 1.5308-0.46858 3.0615-0.93715 4.5923-1.4057 0.76137-0.23306 1.5227-0.46611 2.3072-0.70623 0.76342-0.23368 1.5268-0.46736 2.3134-0.70812 0.76499-0.23418 1.53-0.46836 2.3182-0.70964 8.5298-2.6108 17.062-5.2145 25.594-7.8179 8.9283-2.7244 17.856-5.45 26.781-8.1852 32.342-9.9105 64.783-19.48 97.238-29.01z" fill="#747C77"/> <path transform="translate(843,162)" d="m0 0c-0.87914 0.55043-1.7583 1.1009-2.6641 1.668-3.2988 2.2008-5.9543 4.7869-8.7109 7.6445-3.1416 3.223-6.3009 6.3527-9.75 9.25-2.8194 2.4053-5.2724 4.9422-7.707 7.7344-5.6994 6.3871-11.736 12.422-17.798 18.463-1.9365 1.9311-3.8675 3.8675-5.7981 5.8044-5.5335 5.5362-11.049 11.027-17.017 16.099-2.1348 1.8351-4.0956 3.817-6.0549 5.8367-3.4037 3.4505-6.9244 6.6664-10.602 9.8203-2.455 2.1721-4.7288 4.4971-7.0234 6.8359-1.8109 1.7807-3.6764 3.4458-5.6016 5.1016-4.1474 3.6059-8.1554 7.342-12.148 11.117-1.4111 1.322-2.8226 2.6436-4.2344 3.9648-2.2389 2.0989-4.4567 4.211-6.6562 6.3516-12.756 12.144-30.677 19.789-47.234 25.309-0.69964 1.3163-1.363 2.6522-2 4-1.4805 1.6406-1.4805 1.6406-3.1875 3.25-3.2018 3.0294-6.0544 6.2979-8.9412 9.6226-2.9422 3.3449-5.9993 6.5777-9.0588 9.8149-1.3233 1.4059-2.6462 2.8121-3.9688 4.2188-0.64969 0.69094-1.2994 1.3819-1.9688 2.0938-2.7022 2.8823-5.3852 5.782-8.0625 8.6875-0.4859 0.52715-0.97179 1.0543-1.4724 1.5974-1.922 2.0864-3.8427 4.174-5.7625 6.2625-8.118 8.8299-16.324 17.574-24.552 26.302-5.6877 6.0386-11.357 12.095-17.026 18.151-0.60618 0.64743-1.2124 1.2949-1.8369 1.9619-6.8593 7.3286-13.69 14.682-20.464 22.089-7.7804 8.5011-15.62 16.946-23.49 25.365-3.7309 3.9935-7.4455 8.0013-11.147 12.022-5.716 6.2062-11.487 12.36-17.262 18.512-7.9458 8.4654-15.873 16.948-23.738 25.488-7.6097 8.261-15.309 16.438-22.999 24.624-1.9174 2.0416-3.8344 4.0836-5.751 6.126-0.62117 0.66169-1.2423 1.3234-1.8823 2.0051-3.9812 4.2462-7.9315 8.5194-11.868 12.807-4.4004 4.7913-8.9009 9.4618-13.562 14-5.8423-4.1181-11.1-8.7281-16.355-13.566-4.6205-4.252-9.3708-8.3474-14.145-12.426-0.62673-0.53577-1.2535-1.0715-1.8992-1.6235-1.2542-1.0713-2.5096-2.1413-3.7661-3.21-0.58096-0.49581-1.1619-0.99161-1.7605-1.5024-0.5199-0.44247-1.0398-0.88494-1.5754-1.3408-1.5624-1.3875-3.0357-2.8398-4.4988-4.3311 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 3.0712-0.94012 6.1424-1.8802 9.2136-2.8203 1.1475-0.35129 1.1475-0.35129 2.3183-0.70968 9.2804-2.8405 18.563-5.6724 27.846-8.5048 8.2032-2.5031 16.406-5.0088 24.605-7.5237 21.256-6.5191 42.543-12.934 63.862-19.241 2.6425-0.78197 5.2838-1.5678 7.9242-2.357 3.6676-1.0959 7.3393-2.1775 11.012-3.2577 1.6605-0.49876 1.6605-0.49876 3.3544-1.0076 1.0144-0.29583 2.0289-0.59166 3.074-0.89645 0.88496-0.262 1.7699-0.52399 2.6817-0.79393 2.2531-0.43092 2.2531-0.43092 5.2531 0.56908z" fill="#A8AAA1"/> <path transform="translate(868.08 108.59)" d="m0 0c0.70463-0.0067323 1.4093-0.013465 2.1352-0.020401 6.4762 0.12104 11.035 2.1066 15.783 6.4267 6.7355 7.1685 7.4975 15.175 7.2769 24.712-0.32818 6.7315-1.9685 13.117-3.7144 19.6-0.39653 1.5245-0.79241 3.0492-1.1877 4.574-15.141 57.747-33.221 114.75-51.15 171.68-0.77339 2.4566-1.5457 4.9135-2.3178 7.3705-4.8024 15.273-9.6359 30.535-14.809 45.687-0.51513 1.5277-0.51513 1.5277-1.0407 3.0862-5.8617 16.918-5.8617 16.918-12.244 22.918-0.67418 0.65227-1.3484 1.3045-2.043 1.9766-1.7695 1.3984-1.7695 1.3984-3.7695 1.3984v2c-2.0273 1.7234-4.0653 3.3381-6.1875 4.9375-4.8734 3.7442-9.6517 7.5565-14.312 11.562-4.471 3.8341-9.032 7.5173-13.688 11.125-4.9944 3.8756-9.7402 7.9242-14.398 12.203-3.3976 3.0568-6.9447 5.9139-10.496 8.7891-3.7343 3.0494-7.405 6.1702-11.077 9.2942-3.4521 2.9308-6.943 5.8055-10.466 8.6511-4.7271 3.842-9.2068 7.9069-13.688 12.031-3.2993 2.954-6.7453 5.6796-10.227 8.4141-3.423 2.771-6.6461 5.7432-9.8984 8.7109-2.6078 2.3215-5.2829 4.5266-8 6.7188-4.7768 3.8631-9.302 7.9416-13.82 12.102-2.6423 2.3713-5.3491 4.6135-8.1172 6.8359-4.2031 3.3889-8.1871 6.9374-12.125 10.625-4.7712 4.4679-9.6791 8.6676-14.785 12.754-3.9854 3.2972-7.737 6.8279-11.5 10.375-2.2148 1.8711-2.2148 1.8711-4.2148 1.8711v2c-1.2227 1.2695-1.2227 1.2695-3.0625 2.8125-0.72574 0.61746-1.4515 1.2349-2.1992 1.8711-0.90363 0.76441-1.8073 1.5288-2.7383 2.3164-2.4635 2.119-4.9193 4.2469-7.375 6.375-0.6546 0.56598-1.3092 1.132-1.9836 1.7151-3.6698 3.1784-7.3014 6.3911-10.891 9.6599-3.2287 2.9318-6.5326 5.7126-9.9375 8.4375-5.3248 4.3005-10.273 8.933-15.238 13.637-4.625 4.3579-9.3867 8.402-14.403 12.308-2.0969 1.8028-3.6149 3.5924-5.1719 5.8672 5.208 2.3208 10.456 4.2336 15.875 6 4.5547 1.5 4.5547 1.5 6.8157 2.2454 1.6015 0.52332 3.2057 1.0382 4.812 1.5464 0.80478 0.25822 1.6096 0.51643 2.4387 0.78247 0.72905 0.23034 1.4581 0.46068 2.2092 0.698 2.6191 1.0307 3.9951 2.6343 5.8494 4.7278 1.2792 0.95451 2.5725 1.8902 3.875 2.8125 7.5329 5.5831 11.921 11.63 13.938 20.938 1.1447 13.632-5.9612 26.77-14.188 37.188-15.306 17.463-37.523 33.314-58.625 43.062h-2l-1 2c-9.832 3.3392-20.457 3.193-30-1-9.0874-4.8402-17.029-11.545-25-18-1.0018-0.81042-1.0018-0.81042-2.0239-1.6372-3.4276-2.7755-6.85-5.5573-10.269-8.3433-4.5453-3.7035-9.0945-7.3997-13.707-11.02-0.64324-0.51434-1.2865-1.0287-1.9492-1.5586-3.6186-2.7709-6.4181-4.8196-11.051-4.4414-3.0465 1.9411-5.465 4.4432-8 7-0.89461 0.87012-1.7892 1.7402-2.7109 2.6367-4.6551 4.5722-9.1144 9.2354-13.348 14.203-2.5425 2.829-5.236 5.4878-7.9414 8.1602-3.2221 3.1829-6.3905 6.3469-9.3125 9.8125-4.0741 4.7984-8.604 9.1542-13.095 13.558-3.1238 3.0815-6.1309 6.1991-8.991 9.5281-4.0078 4.6483-8.3527 8.9253-12.727 13.227-2.9835 2.9345-5.9455 5.8865-8.875 8.875-0.54793 0.5431-1.0959 1.0862-1.6604 1.6458-2.4213 2.5837-3.3138 4.1479-3.7576 7.6941 0.076055 1.1872 0.15211 2.3745 0.23047 3.5977 0.047874 1.3357 0.088031 2.6717 0.12109 4.0078 0.017886 0.67579 0.035771 1.3516 0.054199 2.0479 0.13648 22.438-9.8287 42.623-25.238 58.386-16.639 15.859-38.194 21.12-60.574 20.77-32.474-0.91475-58.907-15.915-81.383-38.352-17.614-18.76-26.234-43.914-27.043-69.359 0.81801-25.407 10.042-46.905 28.438-64.625 12.128-10.629 27.322-17.522 43.197-20.087 8.9085-1.4767 13.784-3.2843 19.51-10.745 0.6948-0.98355 1.3896-1.9671 2.1055-2.9805 1.4259-1.7595 2.8634-3.5096 4.3125-5.25 0.72832-0.90105 1.4566-1.8021 2.207-2.7305 7.2516-8.8275 14.851-17.375 22.516-25.844 3.9882-4.4163 7.8855-8.9089 11.75-13.434 1.0299-1.2058 2.0599-2.4115 3.0898-3.6172 0.51965-0.60852 1.0393-1.217 1.5747-1.844 3.0292-3.5372 6.1018-7.0249 9.2378-10.469 4.6378-5.11 8.9914-10.434 13.312-15.812 1.0886-1.3052 1.0886-1.3052 2.1992-2.6367 2.6966-3.539 3.2616-6.8067 3.1938-11.236-0.74301-4.0206-3.4519-6.5065-6.2056-9.377-0.58878-0.6455-1.1776-1.291-1.7842-1.9561-1.7834-1.9486-3.5909-3.8723-5.4033-5.7939-1.4678-1.5866-2.93-3.178-4.3914-4.7705-1.3503-1.4704-2.706-2.9359-4.0618-4.4014-3.2209-3.5765-6.2239-7.3042-9.2383-11.055-2.4819-2.9817-5.0951-5.8187-7.7461-8.6484-11.792-12.676-21.99-24.809-21.48-43.066 3.407-27.518 27.039-66.699 47.918-84.559 5.9718-4.5112 12.209-7.1966 19.84-6.8477 17.094 2.7511 34.034 17.486 44.098 30.938 4.2859 6.4381 7.3285 13.191 10.062 20.41 7.824-9.5531 15.526-19.17 23-29 2.0817-2.7304 4.1656-5.4591 6.25-8.1875 0.81356-1.0657 0.81356-1.0657 1.6436-2.1528 4.0884-5.348 8.2159-10.664 12.356-15.972 4.6005-5.8986 9.1409-11.833 13.609-17.832 2.3536-3.1396 4.7426-6.2498 7.1406-9.3555 3.8824-5.0298 7.7073-10.099 11.508-15.191 1.8918-2.5232 3.809-5.0258 5.7344-7.5234 7.5051-9.6188 7.5051-9.6188 14.316-19.73 1.3298-1.8955 2.7369-3.5894 4.2539-5.3359 3.1005-3.572 5.9408-7.2908 8.75-11.094 1.0579-1.4211 2.1165-2.8416 3.1758-4.2617 0.53963-0.72365 1.0793-1.4473 1.6353-2.1929 2.6013-3.4712 5.2376-6.9153 7.8765-10.358 0.52964-0.69182 1.0593-1.3836 1.605-2.0964 2.371-3.0966 4.7431-6.1922 7.1172-9.2864 6.9922-9.117 13.973-18.224 20.592-27.617 3.0266-4.2821 6.1935-8.4387 9.4126-12.577 3.6953-4.7679 7.2699-9.6201 10.836-14.485 5.1531-7.0285 10.394-13.981 15.708-20.889 2.9437-3.8331 5.8403-7.6907 8.6675-11.611 2.947-4.0834 5.9477-8.12 9-12.125 0.79793-1.0493 1.5959-2.0986 2.418-3.1797 7.3745-9.0707 16.159-14.641 27.277-18.121 2.2951-0.62073 2.2951-0.62073 3.1172-2.8242 1.8452-0.2245 3.6914-0.44251 5.5404-0.63281 4.8219-0.71986 9.4052-2.3736 14.034-3.8672 1.11-0.35194 2.2199-0.70389 3.3635-1.0665 3.5853-1.1382 7.1675-2.2859 10.75-3.4335 2.4571-0.78153 4.9145-1.5623 7.3721-2.3423 4.8141-1.5283 9.6274-3.0592 14.44-4.5923 7.9059-2.5156 15.825-4.9889 23.75-7.4404 1.0889-0.33773 2.1777-0.67547 3.2996-1.0234 1.9287-0.59704 3.8581-1.192 5.7883-1.7842 1.8337-0.56302 3.6656-1.1317 5.4961-1.7051 0.89525-0.27683 1.7905-0.55365 2.7129-0.83887 0.78729-0.24573 1.5746-0.49146 2.3857-0.74463 2.0674-0.52881 2.0674-0.52881 5.0674-0.52881l1-2c2.0635-0.65381 2.0635-0.65381 4.8906-1.2734 5.3022-1.2515 10.508-2.6858 15.719-4.2656 0.791-0.2396 1.582-0.4792 2.397-0.72606 1.6915-0.51395 3.3826-1.029 5.0735-1.545 2.7544-0.84057 5.51-1.6773 8.2659-2.5133 8.5257-2.5879 17.048-5.1863 25.57-7.7864 13.103-3.9975 26.21-7.9851 39.326-11.94 6.004-1.8112 12.003-3.6372 17.996-5.485 3.178-0.97486 6.3616-1.9305 9.5474-2.8797 1.3959-0.41997 2.7895-0.84771 4.1802-1.2846 7.4197-2.3263 14.365-3.6465 22.117-3.7067zm-20.992 17.742c-1.5499 0.45619-3.1001 0.91128-4.6507 1.3653-4.0269 1.1832-8.0487 2.3832-12.069 3.5889-2.2846 0.68421-4.5704 1.3645-6.8568 2.043-9.5576 2.8364-19.105 5.7071-28.647 8.5948-2.3569 0.71299-4.7141 1.425-7.0713 2.1368-28.296 8.5445-56.566 17.173-84.795 25.935-1.0035 0.31135-2.0069 0.6227-3.0408 0.94348-11.996 3.723-23.986 7.464-35.967 11.233-6.2251 1.9577-12.455 3.9007-18.687 5.8356-4.2845 1.3329-8.5657 2.676-12.846 4.0215-2.0207 0.63298-4.0427 1.262-6.066 1.8865-23.47 7.0698-23.47 7.0698-41.393 23.08-0.50999 0.67644-1.02 1.3529-1.5454 2.0498-3.6209 4.8229-7.1758 9.692-10.719 14.572-2.5442 3.4854-5.1374 6.9329-7.7358 10.378-4.2914 5.6993-8.5303 11.435-12.75 17.188-5.8112 7.9174-11.743 15.738-17.71 23.538-3.2287 4.2249-6.4375 8.4557-9.54 12.775-3.7697 5.2477-7.6994 10.369-11.625 15.5-5.1908 6.7865-10.327 13.607-15.375 20.5-6.8698 9.373-13.905 18.615-20.968 27.843-3.3505 4.3809-6.6909 8.7694-10.032 13.157-4.0804 5.3567-8.1618 10.713-12.246 16.066-6.2595 8.207-12.508 16.42-18.688 24.688-3.5663 4.7394-7.1935 9.4319-10.818 14.127-2.004 2.5988-4.0003 5.2034-5.9985 7.8066-4.6667 6.073-9.3716 12.116-14.077 18.159-4.201 5.3973-8.3772 10.813-12.54 16.24-2.0141 2.6188-4.0438 5.225-6.0781 7.8281-6.3274 8.0986-12.608 16.201-18.555 24.586-6.9-5.9417-8.8694-12.752-10.5-21.562-3.1413-16.743-15.725-28.293-28.996-38.324-4.9704-3.3265-9.0877-5.0553-15.129-4.6211-9.0228 1.9292-15.349 9.9374-20.217 17.289-1.8379 3.065-3.6047 6.1599-5.3457 9.281-0.63784 1.1267-1.2757 2.2534-1.9329 3.4143-1.9767 3.4985-3.9284 7.0104-5.8796 10.523-0.62262 1.1121-1.2452 2.2243-1.8867 3.3701-1.7787 3.1828-3.543 6.373-5.3008 9.5674-0.52811 0.95076-1.0562 1.9015-1.6003 2.8811-5.3829 9.9109-10.296 19.829-7.7395 31.302 3.2979 10.131 12.086 18.126 18.922 26.019 1.5739 1.8233 3.1383 3.6543 4.6992 5.4888 4.6212 5.4279 9.2691 10.809 14.094 16.059 4.0031 4.367 7.8029 8.8502 11.488 13.488 1.6811 2.0428 3.3639 3.9542 5.1797 5.8672 6.9058 7.4056 6.9058 7.4056 7.5039 11.293-0.47773 2.4506-1.2972 4.4042-2.3594 6.6641-0.34289 0.95906-0.68578 1.9181-1.0391 2.9062-3.9708 10.697-10.773 17.983-18.41 26.258-2.512 2.7928-4.8847 5.659-7.2383 8.5859-2.4836 3.0794-4.9667 6.0024-7.8125 8.75-2.7851 2.6897-5.205 5.5397-7.625 8.5625-3.6156 4.4979-7.4178 8.7384-11.375 12.938-4.6878 4.9792-9.1123 10.082-13.391 15.422-2.8273 3.4556-5.8354 6.7297-8.8438 10.027-3.1691 3.568-6.1497 7.2777-9.125 11.008-0.70641 0.83918-1.4128 1.6784-2.1406 2.543-1.135 1.3632-1.135 1.3632-2.293 2.7539-3.3422 2.7731-6.0931 3.1088-10.27 3.3711-1.4393 0.14086-2.8781 0.28673-4.3164 0.4375-1.056 0.10635-1.056 0.10635-2.1333 0.21484-16.805 1.8824-30.489 10.283-41.988 22.223-0.67547 0.65613-1.3509 1.3123-2.0469 1.9883-12.766 13.19-16.584 32.001-16.428 49.714 0.79634 25.347 11.757 48.491 30.17 65.836 23.549 19.979 49.936 27.238 80.305 25.461 15.018-1.7793 27.461-8.3189 38-19l2.1875-2.1562c11.759-12.293 16.363-28.618 16.137-45.352-0.30927-3.3312-1.0894-5.9615-2.1367-9.1172-0.57812-2.6211-0.57812-2.6211-0.1875-5.375 3.0217-4.5312 7.3532-8.0332 11.426-11.588 1.8251-1.6371 3.3975-3.3898 4.9487-5.2866 3.4775-4.1066 7.3047-7.8415 11.125-11.625 5.675-5.5854 5.675-5.5854 11-11.5 3.9971-4.7466 8.4812-9.0302 12.908-13.371 3.1365-3.094 6.1552-6.2259 9.0293-9.5664 4.4693-5.1832 9.3664-9.9146 14.246-14.707 4.6633-4.6127 9.0401-9.3842 13.316-14.355 5.8809-6.532 11.024-11.289 19.938-12.562 8.3374 0.47177 15.695 7.3299 21.938 12.312 0.78738 0.62052 1.5748 1.241 2.386 1.8804 5.9714 4.719 11.864 9.5308 17.739 14.37 17.718 15.737 17.718 15.737 40 20 20.093-4.875 39.931-21.506 55-35 0.68578-0.59039 1.3716-1.1808 2.0781-1.7891 7.7419-7.0793 13.824-17.234 15.258-27.652 0.11446-6.2152-1.4044-9.4474-5.7383-14.047-9.3288-8.8271-21.917-12.213-34.098-15.105-7.1522-1.9413-12.027-6.5835-17.5-11.406-1.2255-1.0252-2.4539-2.0471-3.6875-3.0625l-2.3125-1.9375c4.1524-4.3666 8.4172-8.4213 13.125-12.188 4.481-3.5935 8.6987-7.3764 12.875-11.312 4.0586-3.8223 8.143-7.5144 12.5-11 5.6914-4.5564 10.964-9.5079 16.277-14.492 3.044-2.8533 6.1523-5.6197 9.3125-8.3438 2.2722-1.9795 4.4948-4.0099 6.7227-6.0391 3.4413-3.1103 6.9507-6.0898 10.562-9 5.1475-4.1646 10.009-8.5781 14.863-13.074 4.5492-4.2018 9.2254-8.2452 13.941-12.258 5.7571-4.9042 11.467-9.8323 17.008-14.98 4.547-4.2233 9.2639-8.1758 14.098-12.066 2.8216-2.3344 5.5208-4.766 8.2148-7.2461 4.3717-4.0197 8.8779-7.7999 13.496-11.531 5.4653-4.4917 10.768-9.1733 16.103-13.818 12.22-10.613 24.536-21.121 37.088-31.338 3.1305-2.574 6.2242-5.1882 9.3125-7.8125 4.8518-4.1229 9.755-8.1747 14.695-12.191 2.5374-2.0886 5.0421-4.2087 7.5398-6.3442 4.884-4.1751 9.8275-8.2129 14.952-12.089 11.32-8.6011 19.234-15.721 23.746-29.301 0.31375-0.92181 0.6275-1.8436 0.95076-2.7934 1.0272-3.028 2.0408-6.0604 3.0531-9.0934 0.72144-2.1435 1.4431-4.2869 2.165-6.4302 6.7188-20.008 13.145-40.1 19.397-60.257 0.55425-1.7845 0.55425-1.7845 1.1197-3.6051 14.365-46.254 28.643-92.522 40.88-139.39 0.33322-1.27 0.66645-2.5401 1.0098-3.8486 0.88961-3.4212 1.7579-6.8469 2.6152-10.276 0.24798-0.95842 0.49597-1.9168 0.75146-2.9043 1.8143-7.4711 3.4038-15.472-0.18896-22.533-2.1576-2.4042-3.8429-4.1941-7.1086-4.7852-8.4095-0.17858-16.031 2.287-23.989 4.6837z" fill="#E8A371"/> <path transform="translate(317,466)" d="m0 0c8.7462 9.718 10.895 21.708 13.625 34.062 0.57344 2.5517 1.1507 5.1024 1.7325 7.6522 0.35842 1.5749 0.71172 3.151 1.0587 4.7284 4.77 21.192 20.161 34.423 35.271 49.182 1.9066 1.9581 3.6864 3.9452 5.457 6.0234 0.53601 0.62826 1.072 1.2565 1.6243 1.9038 0.4063 0.47776 0.81259 0.95552 1.2312 1.4478-0.25693-0.55873-0.51385-1.1175-0.77856-1.6931-1.1828-2.5793-2.3584-5.1618-3.5339-7.7444-0.40412-0.8785-0.80824-1.757-1.2246-2.6621-5.3301-11.744-5.3301-11.744-6.4629-16.9l1-2c0.48469 0.49629 0.96938 0.99258 1.4688 1.5039 4.0598 4.1145 8.2155 8.0141 12.598 11.781 1.8885 1.6749 3.6652 3.4143 5.4336 5.2148 2.9516 2.998 6.0442 5.7622 9.2266 8.5117 9.9866 8.734 19.585 17.927 29.273 26.988 17.624 16.481 17.624 16.481 35.469 32.723 13.315 11.98 13.315 11.98 19.156 17.965 4.4612 4.5348 9.3307 8.4477 14.375 12.312l-2 1c-2.2492-0.91904-4.346-1.8912-6.5-3-0.62423-0.31598-1.2485-0.63196-1.8916-0.95752-4.8527-2.5159-9.3176-5.4105-13.718-8.6597-1.8423-1.4282-1.8423-1.4282-3.8906-2.3828 5.3218 4.9306 10.647 9.7769 16.312 14.312 4.4112 3.5554 8.5653 7.3072 12.688 11.188 5.7926 5.4464 11.784 10.539 18 15.5 2.067 1.6821 4.1269 3.3725 6.1875 5.0625 0.92168 0.7541 1.8434 1.5082 2.793 2.2852 0.66645 0.54527 1.3329 1.0905 2.0195 1.6523-0.5775-0.825-1.155-1.65-1.75-2.5-2.4488-3.6557-4.3579-7.5347-6.25-11.5 4.4585 1.407 8.6694 3.1163 12.93 5.0391 0.6352 0.28572 1.2704 0.57144 1.9248 0.86581 2.0081 0.90399 4.0143 1.812 6.0205 2.7201 1.3697 0.61745 2.7395 1.2346 4.1094 1.8516 3.3399 1.5048 6.6782 3.0131 10.016 4.5234v2c-1.5906 1.3393-3.2528 2.5936-4.9375 3.8125-1.1049 0.80888-2.209 1.6188-3.3125 2.4297-0.60199 0.44054-1.204 0.88107-1.8242 1.335-3.4874 2.5767-6.9229 5.2214-10.363 7.8604-1.0758 0.82371-1.0758 0.82371-2.1733 1.6641-6.471 4.9559-12.932 9.924-19.389 14.898-3.2446-1.4708-5.8055-3.3142-8.5625-5.5625l-2.6719-2.1719c-1.369-1.1215-1.369-1.1215-2.7656-2.2656l-2.6406-2.1406c-6.637-5.395-13.172-10.905-19.689-16.443-1.6742-1.4192-3.3531-2.8325-5.0337-4.2441-4.989-4.195-9.9398-8.4091-14.762-12.797-3.3337-3.0326-6.7407-5.9225-10.25-8.75-5.5761-4.5188-10.849-9.321-16.097-14.21-1.4808-1.371-2.977-2.7254-4.4736-4.0791-7.8939-7.1496-15.424-14.634-22.9-22.219-4.2506-4.295-8.5627-8.4059-13.147-12.341-3.8497-3.4059-7.446-7.0711-11.07-10.714-0.76377-0.7599-1.5275-1.5198-2.3145-2.3027-3.4802-3.4862-6.8778-6.9949-10.088-10.732-4.0973-4.7586-8.5621-9.1249-13.035-13.527-5.2022-5.12-10.27-10.263-15.025-15.803-1.7357-1.9977-3.5712-3.8595-5.4746-5.6973-3.1479-3.1059-6.0776-6.3219-8.957-9.6758-2.0924-2.3805-4.2414-4.6975-6.405-7.0129-4.8961-5.2406-9.541-10.56-13.954-16.221-2.0675-2.5664-4.3213-4.797-6.6836-7.0898-2-3-2-3-1.7776-5.4028 0.79878-2.6679 1.8073-4.7553 3.219-7.1519 0.49742-0.85473 0.99483-1.7095 1.5073-2.5901 0.53254-0.90097 1.0651-1.8019 1.6138-2.7302 1.0993-1.891 2.1969-3.7829 3.293-5.6758 0.53802-0.92764 1.076-1.8553 1.6304-2.811 5.5524-9.6742 10.594-19.631 15.514-29.638z" fill="#646C65"/> <path transform="translate(843,162)" d="m0 0-7 4-1-1c-2.7155 0.58673-5.3787 1.2293-8.0625 1.9375-0.75861 0.19529-1.5172 0.39059-2.2988 0.5918-1.8809 0.48501-3.76 0.9772-5.6387 1.4707-0.13277 0.73323-0.26555 1.4665-0.40234 2.2219-1.0134 4.7103-2.2424 8.2155-5.5977 11.778-5.1132 2.6545-10.488 4.1934-16 5.8125-1.6126 0.50105-3.2242 1.0055-4.8347 1.5132-3.3608 1.055-6.7263 2.0926-10.096 3.1172-4.8816 1.4902-9.7379 3.0509-14.588 4.6392-0.77013 0.25213-1.5403 0.50426-2.3337 0.76402-1.5468 0.5067-3.0935 1.0136-4.6402 1.5207-3.8779 1.268-7.7605 2.5211-11.643 3.7739-0.75418 0.24344-1.5084 0.48687-2.2854 0.73769-4.7613 1.5365-9.5231 3.0713-14.285 4.6061-1.2268 0.39542-2.4536 0.79084-3.7175 1.1982-2.4766 0.79802-4.9533 1.5955-7.4302 2.3926-7.4276 2.3919-14.848 4.8064-22.262 7.2373-18.255 5.9813-36.529 11.889-54.883 17.562-0.84659 0.26311-1.6932 0.52622-2.5654 0.7973-2.3726 0.73632-4.747 1.4667-7.1221 2.1949-0.70101 0.21801-1.402 0.43603-2.1243 0.66064-2.8482 0.86583-5.1914 1.4722-8.1882 1.4722 0.27264 0.97888 0.27264 0.97888 0.55078 1.9775 3.9917 14.611 6.3633 27.872 5.4492 43.022h-2c-5.0611-9.8452-9.6513-19.822-14-30-4.4853 4.1835-7.9783 8.8493-11.562 13.812-1.2534 1.7178-2.5073 3.4353-3.7617 5.1523-0.62181 0.8532-1.2436 1.7064-1.8843 2.5854-2.5306 3.4604-5.0924 6.8966-7.6665 10.325-0.47784 0.6368-0.95568 1.2736-1.448 1.9297-4.834 6.4273-9.726 12.81-14.61 19.2-4.4604 5.8494-8.8488 11.746-13.192 17.683-5.1353 7.0156-10.405 13.91-15.766 20.755-3.7632 4.8093-7.4615 9.6602-11.109 14.558-4.2179 5.6637-8.5201 11.253-12.875 16.812-4.8811 6.2348-9.638 12.546-14.312 18.938-5.3639 7.3332-10.884 14.513-16.533 21.628-2.1193 2.6872-4.1989 5.4047-6.2793 8.1221-3.4681 4.5256-6.9709 9.0218-10.5 13.5-3.874 4.9169-7.7118 9.8595-11.522 14.826-9.1315 11.896-18.375 23.705-27.652 35.488-2.2775 2.8936-4.5519 5.7897-6.8267 8.6855-2.7961 3.5592-5.5926 7.1181-8.3906 10.676-5.0542 6.4277-10.1 12.862-15.109 19.324 0.99 1.65 1.98 3.3 3 5-4.1242-1.6617-7.0655-4.6234-10.25-7.625-0.5543-0.51562-1.1086-1.0312-1.6797-1.5625-1.3606-1.2668-2.716-2.5391-4.0703-3.8125 1.6268-3.6539 3.8669-6.596 6.3125-9.75 0.43441-0.56074 0.86883-1.1215 1.3164-1.6992 4.1028-5.2668 8.3245-10.436 12.55-15.604 3.3615-4.1209 6.6595-8.28 9.8838-12.509 3.5663-4.6743 7.1936-9.2908 10.875-13.875 5.7387-7.148 11.418-14.34 17.062-21.562 0.52288-0.66838 1.0458-1.3368 1.5845-2.0254 8.3281-10.652 16.554-21.378 24.736-32.143 2.9156-3.8344 5.8538-7.6498 8.8047-11.457 4.5205-5.8616 8.8975-11.824 13.273-17.794 4.5458-6.1869 9.1826-12.299 13.852-18.393 4.7428-6.1924 9.4013-12.419 13.884-18.802 3.8186-5.3996 7.843-10.637 11.866-15.885 4.8482-6.3256 9.6231-12.679 14.212-19.195 3.5844-5.0695 7.304-10.033 11.038-14.993 13.008-17.283 25.755-34.749 38.348-52.336 0.59031-0.82234 1.1806-1.6447 1.7888-2.4919 1.1321-1.5772 2.2619-3.1561 3.3892-4.7368 0.50974-0.70955 1.0195-1.4191 1.5447-2.1501 0.44618-0.62383 0.89235-1.2477 1.3521-1.8904 2.4758-3.1838 4.393-4.9888 8.2991-6.1675 0.81133-0.24997 1.6227-0.49994 2.4586-0.75749 0.89321-0.26461 1.7864-0.52921 2.7067-0.80183 0.95336-0.29083 1.9067-0.58166 2.889-0.8813 3.218-0.97942 6.4399-1.9453 9.6618-2.9117 2.2999-0.69745 4.5996-1.3959 6.8989-2.0952 4.3839-1.3323 8.7687-2.6616 13.155-3.9868 9.3777-2.8337 18.747-5.6947 28.114-8.5625 3.0712-0.94012 6.1424-1.8802 9.2136-2.8203 1.1475-0.35129 1.1475-0.35129 2.3183-0.70968 9.2804-2.8405 18.563-5.6724 27.846-8.5048 8.2032-2.5031 16.406-5.0088 24.605-7.5237 21.256-6.5191 42.543-12.934 63.862-19.241 2.6425-0.78197 5.2838-1.5678 7.9242-2.357 3.6676-1.0959 7.3393-2.1775 11.012-3.2577 1.6605-0.49876 1.6605-0.49876 3.3544-1.0076 1.0144-0.29583 2.0289-0.59166 3.074-0.89645 0.88496-0.262 1.7699-0.52399 2.6817-0.79393 2.2531-0.43092 2.2531-0.43092 5.2531 0.56908z" fill="#DEDBCB"/> <path transform="translate(222,752)" d="m0 0c0.097969 1.2207 0.19594 2.4415 0.29688 3.6992 1.3785 15.768 4.5864 28.154 13.703 41.301 0.4602 0.67805 0.92039 1.3561 1.3945 2.0547 8.4689 11.104 24.144 18.685 37.605 20.945 3.6723 0.22116 7.3228 0.19094 11 0.125 0.96551-0.0090234 1.931-0.018047 2.9258-0.027344 2.3583-0.02335 4.7161-0.056096 7.0742-0.097656 0.17549 4.823-0.23757 8.6279-1.8125 13.188-0.33645 1.0042-0.67289 2.0084-1.0195 3.043-1.1557 2.7403-2.1546 4.5916-4.168 6.7695-2.1538 0.50171-2.1538 0.50171-4.6484 0.49609-1.3744 0.004834-1.3744 0.004834-2.7766 0.0097656-0.97348-0.022559-1.947-0.045117-2.95-0.068359-0.99862-0.016113-1.9972-0.032227-3.0261-0.048828-18.19-0.48409-35.191-6.8886-48.599-19.389-1.1312-0.9958-1.1312-0.9958-2.2852-2.0117-15.52-14.402-24.263-35.347-25.277-56.363-0.066406-2.4609-0.066406-2.4609 0.5625-4.625 3.4222-3.4096 7.078-5.0664 11.562-6.75 1.115-0.42797 2.2301-0.85594 3.3789-1.2969 3.0586-0.95312 3.0586-0.95312 7.0586-0.95312z" fill="#D69E43"/> <path transform="translate(300,679)" d="m0 0c3.0317 3.6421 5.5712 7.4095 8.0625 11.438 11.9 18.702 27.212 35.21 44.938 48.562-2.783 4.6383-6.0497 8.1612-9.9219 11.926-1.9804 1.9767-3.8182 4.0146-5.6406 6.1367-2.3436 2.6967-4.6882 5.3869-7.125 8-0.54012 0.5891-1.0802 1.1782-1.6367 1.7852-1.6758 1.1523-1.6758 1.1523-3.6211 1.0234-18.143-7.692-32.71-31.267-39.876-48.891-5.0057-13.128-5.0057-13.128-4.1787-18.98 1.9414-2.7109 1.9414-2.7109 4.5625-5.375 1.3632-1.4173 1.3632-1.4173 2.7539-2.8633 0.88559-0.91137 1.7712-1.8227 2.6836-2.7617 1.3448-1.5107 2.6798-3.0302 4-4.5625 1.6261-1.8802 3.241-3.6785 5-5.4375z" fill="#597A53"/> <path transform="translate(709,299)" d="m0 0h1c0.2107 4.5403-0.37761 7.9852-1.9375 12.25-0.35965 1.0364-0.7193 2.0728-1.0898 3.1406-5.8514 12.187-19.647 22.363-29.098 31.734-3.2139 3.1871-6.4244 6.3777-9.6328 9.5703-0.72309 0.7148-1.4462 1.4296-2.1912 2.166-4.0306 4.0114-7.8743 8.1207-11.575 12.44-1.8906 2.1757-3.9083 4.1927-5.9765 6.1991-2.6627 2.6271-5.2126 5.2673-7.625 8.125-3.5747 4.1788-7.4706 8.0084-11.375 11.875-4.4304 4.3876-8.7431 8.7779-12.766 13.547-2.7523 3.0994-5.7324 5.9715-8.6819 8.8811-3.2936 3.2663-6.3676 6.6513-9.3767 10.177-2.4423 2.7611-5.0813 5.3092-7.707 7.8945-1.9086 1.9389-3.6959 3.937-5.4688 6-2.3968 2.789-4.8796 5.4199-7.5 8-2.4971 2.4591-4.8606 4.9509-7.125 7.625-3.4278 3.9965-7.1353 7.6743-10.875 11.375-4.2969 4.2521-8.4552 8.5277-12.363 13.145-1.9557 2.2171-4.0323 4.2792-6.1367 6.3555-2.6627 2.6271-5.2126 5.2673-7.625 8.125-4.1496 4.8509-8.727 9.2785-13.282 13.745-3.1547 3.112-6.1806 6.2622-9.062 9.6304-4.1733 4.8399-8.8501 9.0602-13.57 13.355-4.096 3.7718-7.8681 7.6736-11.479 11.914-3.4081 3.9797-7.2579 7.4981-11.107 11.043-1.1331 1.0461-1.1331 1.0461-2.2891 2.1133-2.0859 1.5742-2.0859 1.5742-5.0859 1.5742-2.0948 1.6918-2.0948 1.6918-4.125 3.875-1.0557 1.0789-1.0557 1.0789-2.1328 2.1797-1.7962 1.8336-1.7962 1.8336-2.7422 3.9453l-2-1c5.0659-5.961 10.396-11.664 15.745-17.37 3.2686-3.4905 6.5098-6.9986 9.6926-10.568 4.5965-5.1484 9.3291-10.166 14.072-15.179 3.6989-3.9225 7.2942-7.9151 10.829-11.986 2.4388-2.7858 4.9516-5.4996 7.4736-8.21 1.042-1.1247 2.0836-2.2497 3.125-3.375 0.51305-0.5543 1.0261-1.1086 1.5547-1.6797 5.0266-5.4433 10.031-10.908 14.883-16.508 3.6073-4.1544 7.3481-8.1822 11.099-12.207 2.6949-2.8999 5.3367-5.8352 7.9321-8.8247 4.1992-4.8221 8.5917-9.4524 12.988-14.094 3.7604-3.9861 7.4233-8.034 10.996-12.189 1.6392-1.844 3.3487-3.5828 5.1094-5.3105 2.2933-2.258 4.4643-4.56 6.5625-7 5.1684-5.9857 10.626-11.708 16.036-17.474 1.8617-1.9841 3.7216-3.9698 5.5811-5.9561 3.1132-3.3247 6.2293-6.6466 9.3467-9.9673 1.3605-1.4497 2.7205-2.9 4.0801-4.3506 2.1301-2.2727 4.2617-4.5439 6.3936-6.8149 0.6463-0.69013 1.2926-1.3803 1.9585-2.0913 3.0535-3.2496 6.1349-6.4582 9.2993-9.6001 2.3124-2.2965 4.5196-4.6239 6.6172-7.1211 2.5913-3.0097 5.2975-5.8359 8.125-8.625 2.7862-2.7486 5.4531-5.5286 8-8.5 3.18-3.7101 6.5876-7.1298 10.094-10.531 1.9594-2.0103 3.7888-4.0495 5.6172-6.1758 4.0901-4.7132 8.4794-9.0936 12.914-13.48 1.1776-1.1708 1.1776-1.1708 2.3789-2.3652 1.5045-1.4956 3.01-2.9903 4.5166-4.4839 2.3333-2.3144 4.6578-4.6373 6.9795-6.9634l2-2z" fill="#999E95"/> <path transform="translate(330,646)" d="m0 0c3.0643 2.8786 5.7032 5.8393 8.25 9.1875 13.862 18.047 30.869 32.924 48.75 46.812-3.4059 4.8032-6.9622 9.1072-11.195 13.199-2.5843 2.5788-4.947 5.3327-7.3242 8.1016-1.1122 1.2765-2.2833 2.502-3.4805 3.6992-4.3036-0.136-7.245-3.4296-10.312-6.125-0.60812-0.52989-1.2162-1.0598-1.8428-1.6057-16.559-14.619-35.238-32.125-40.845-54.269 0.56848-0.55688 1.137-1.1138 1.7227-1.6875 4.4723-4.42 8.7818-8.9028 12.867-13.684 1.0864-1.255 2.2364-2.4552 3.4102-3.6289z" fill="#557450"/> <path transform="translate(269,715)" d="m0 0c1.8167 2.7251 2.8339 5.1722 3.9016 8.2412 7.6075 21.783 22.031 41.387 40.098 55.759-1.3319 3.9444-2.9465 6.3059-5.9141 9.207-0.76055 0.75088-1.5211 1.5018-2.3047 2.2754-0.79406 0.76893-1.5881 1.5379-2.4062 2.3301-0.8018 0.78826-1.6036 1.5765-2.4297 2.3887-1.9752 1.9399-3.957 3.8724-5.9453 5.7988-2.6824-1.2558-4.9113-2.5933-7.1719-4.5039-0.5779-0.48823-1.1558-0.97646-1.7512-1.4795-14.855-12.84-27.297-28.164-30.764-48.079-0.12955-0.68127-0.2591-1.3625-0.39258-2.0645-0.35398-1.9497-0.63857-3.9116-0.91992-5.873-0.15727-1.0068-0.31453-2.0135-0.47656-3.0508 0.73735-4.5631 3.5816-6.9043 6.7891-10.074 1.1851-1.2095 2.3687-2.4204 3.5508-3.6328 0.82685-0.83966 0.82685-0.83966 1.6704-1.6963 1.6526-1.7423 3.1039-3.5687 4.4663-5.5459z" fill="#567651"/> <path transform="translate(192,769)" d="m0 0h1c0.14695 1.4715 0.14695 1.4715 0.29688 2.9727 2.6679 24.875 11.39 47.293 30.809 63.898 17.824 13.11 36.184 17.082 57.895 18.129-3.6339 3.1796-6.9801 5.0137-11.5 6.6875-1.1034 0.41637-2.2069 0.83273-3.3438 1.2617-15.543 5.1747-31.668 2.2134-46.242-4.3359-17.807-9.1029-29.218-23.283-36.078-41.746-4.3069-14.772-2.4333-29.741 4.9141-43.18 0.73723-1.2369 1.482-2.4695 2.25-3.6875z" fill="#DBA445"/> <path transform="translate(350,620)" d="m0 0c4.1266 1.5864 6.6322 4.5923 9.5 7.8125 1.0729 1.1824 2.1458 2.3646 3.2188 3.5469 0.54527 0.60521 1.0905 1.2104 1.6523 1.834 10.089 11.19 20.27 22.369 31.754 32.154 3.4577 3.0471 6.6484 6.3647 9.875 9.6523l4 4-11 11c-3.0348-1.5174-5.0628-2.7095-7.6094-4.793-1.0017-0.81573-1.0017-0.81573-2.0237-1.6479-1.0479-0.86456-1.0479-0.86456-2.1169-1.7466-0.72373-0.59442-1.4475-1.1888-2.1931-1.8013-2.0228-1.6658-4.0411-3.3368-6.0569-5.0112-0.71422-0.59087-1.4284-1.1817-2.1643-1.7905-14.287-11.926-27.473-26.068-36.836-42.209 3.2076-3.8064 6.4075-7.5456 10-11z" fill="#536F4F"/> <path transform="translate(541,482)" d="m0 0c0.8125 2.1875 0.8125 2.1875 1 5-2.3125 2.5-2.3125 2.5-5 5-0.29624 0.78206-0.59249 1.5641-0.89771 2.3699-1.3216 3.1535-2.9794 4.8341-5.4265 7.2122-0.86432 0.85014-1.7286 1.7003-2.6191 2.5762-0.90557 0.87592-1.8111 1.7518-2.7441 2.6543-7.198 6.9689-7.198 6.9689-13.957 14.355-4.1005 4.7943-8.7352 8.9477-13.395 13.188-4.096 3.7718-7.8681 7.6736-11.479 11.914-3.4081 3.9797-7.2579 7.4981-11.107 11.043-0.75539 0.69738-1.5108 1.3948-2.2891 2.1133-2.0859 1.5742-2.0859 1.5742-5.0859 1.5742-2.0948 1.6918-2.0948 1.6918-4.125 3.875-1.0557 1.0789-1.0557 1.0789-2.1328 2.1797-1.7962 1.8336-1.7962 1.8336-2.7422 3.9453l-2-1c5.0659-5.961 10.396-11.664 15.745-17.37 3.2686-3.4905 6.5098-6.9986 9.6926-10.568 4.5965-5.1484 9.3291-10.166 14.072-15.179 3.6989-3.9225 7.2942-7.9151 10.829-11.986 2.4388-2.7858 4.9512-5.5 7.4736-8.21 2.9913-3.22 5.9796-6.4401 8.9023-9.7227 13.359-14.965 13.359-14.965 17.285-14.965z" fill="#8F958D"/> <path transform="translate(314,472)" d="m0 0 1 2c-0.70393 1.6517-1.4143 3.301-2.1582 4.9351-1.4948 3.6667-2.2224 7.5243-3.0918 11.377-2.2031 9.317-5.3595 18.002-9.0132 26.835-1.0262 2.5802-1.8744 5.214-2.7368 7.8525l-1 2c-2.6475-2.5778-4.9443-4.9165-7-8 0.34214-3.6963 1.5738-6.3842 3.4414-9.5547 0.49766-0.85521 0.99532-1.7104 1.5081-2.5916 0.79845-1.3507 0.79845-1.3507 1.613-2.7288 1.0954-1.8831 2.1892-3.7673 3.2812-5.6523 0.53754-0.92667 1.0751-1.8533 1.6289-2.8081 4.4393-7.7447 8.5598-15.669 12.527-23.665z" fill="#9EA298"/> <path transform="translate(835,164)" d="m0 0 1 3c-14.214 14.476-14.214 14.476-21 19v-3l-2-1c3.1818-11.319 3.1818-11.319 7.8545-14.106 4.5667-1.8864 9.3062-2.9567 14.146-3.8936z" fill="#BBBCAE"/> <path transform="translate(489,537)" d="m0 0 1 3c-0.99 0.33-1.98 0.66-3 1l0.375 2.1875c-0.375 2.8125-0.375 2.8125-3.0625 5.3125-0.55043 0.4125-1.1009 0.825-1.668 1.25-1.8702 1.3631-1.8702 1.3631-4.1445 3.75-2.7216 2.7216-5.4617 5.1369-8.5 7.5h-2c-1.9982 1.7153-1.9982 1.7153-4.0625 3.875-0.71285 0.7193-1.4257 1.4386-2.1602 2.1797-1.8323 1.8276-1.8323 1.8276-2.7773 3.9453l-2-1c4.5796-5.3888 9.3633-10.581 14.188-15.75 0.60602-0.64977 1.212-1.2995 1.8364-1.969 4.0865-4.3668 8.1549-8.6631 12.726-12.531l1.8594-1.5781 1.3906-1.1719z" fill="#8A9188"/> <path transform="translate(507,525)" d="m0 0c0 3 0 3-1.5605 4.8694-0.71221 0.68377-1.4244 1.3675-2.1582 2.072-1.1505 1.1225-1.1505 1.1225-2.3242 2.2676-1.2162 1.165-1.2162 1.165-2.457 2.3535-1.5981 1.5384-3.1921 3.0812-4.7812 4.6289-0.71221 0.68264-1.4244 1.3653-2.1582 2.0686-1.7831 1.5986-1.7831 1.5986-1.5605 3.74h-3l-0.25 1.875c-0.99452 2.8178-2.1266 2.8352-4.75 4.125-1.7442 1.4565-1.7442 1.4565-3.3828 3.1523-0.60973 0.61166-1.2195 1.2233-1.8477 1.8535-0.6252 0.63744-1.2504 1.2749-1.8945 1.9316-0.63293 0.63357-1.2659 1.2671-1.918 1.9199-2.6158 2.6408-4.8858 5.0357-6.957 8.1426-0.99-0.33-1.98-0.66-3-1 0.4241-0.4125 0.8482-0.825 1.2852-1.25 3.8837-3.824 7.5292-7.7774 11.09-11.902 2.1049-2.3933 4.342-4.6247 6.625-6.8477 2.7908-2.781 5.5691-5.574 8.3398-8.375 1.1992-1.2084 2.3984-2.4167 3.5977-3.625 0.5949-0.60328 1.1898-1.2066 1.8027-1.8281 3.5986-3.6183 7.2862-6.9688 11.26-10.172z" fill="#666E68"/> <path transform="translate(317,466)" d="m0 0c8.7329 9.7032 10.899 21.728 13.625 34.062 0.57344 2.5517 1.1507 5.1024 1.7325 7.6522 0.35842 1.5749 0.71172 3.151 1.0587 4.7284 2.1677 10.528 2.1677 10.528 7.5838 19.557l-1 2c-8.3233-7.6297-9.3156-21.34-11-32h-2l-0.25-3.5625c-1.0117-9.1056-3.4093-18.364-7.75-26.438h-4l2-6z" fill="#889088"/> <path transform="translate(222,752)" d="m0 0v15c-2.2091-3.3137-2.2248-4.3446-2.125-8.1875 0.018047-0.90105 0.036094-1.8021 0.054688-2.7305 0.023203-0.68707 0.046406-1.3741 0.070312-2.082-1.8983 0.59643-3.7935 1.2025-5.6875 1.8125-1.0557 0.33645-2.1115 0.67289-3.1992 1.0195-4.3488 1.5799-4.3488 1.5799-8.1133 4.168-0.54462 2.7532-0.78934 4.9314-0.8125 7.6875-0.025137 0.70189-0.050273 1.4038-0.076172 2.127-0.058773 1.7279-0.087938 3.4568-0.11133 5.1855h2l1 12c-5.4892-5.4892-5.3219-17.243-5.5938-24.695 0.88616-3.4397 2.6573-4.4001 5.5938-6.3047 3.1914-1.4844 3.1914-1.4844 6.5625-2.75 1.115-0.42797 2.2301-0.85594 3.3789-1.2969 3.0586-0.95312 3.0586-0.95312 7.0586-0.95312z" fill="#F2CF53"/> <path transform="translate(630,268)" d="m0 0v20h-2c-1.2284-2.241-2.4323-4.4901-3.625-6.75-0.35062-0.63422-0.70125-1.2684-1.0625-1.9219-0.97656-1.875-0.97656-1.875-2.3125-5.3281 0.78906-2.4531 0.78906-2.4531 2-4 0.99 0.33 1.98 0.66 3 1 0.47438-0.495 0.94875-0.99 1.4375-1.5 1.5625-1.5 1.5625-1.5 2.5625-1.5z" fill="#D4D2C0"/> <path transform="translate(221,899)" d="m0 0c6.329 0.82552 6.329 0.82552 8.9004 1.4941 9.0828 2.2894 18.432 1.7221 27.725 1.6309 1.7852-0.010049 3.5703-0.019171 5.3555-0.027344 4.34-0.021864 8.6797-0.056288 13.02-0.097656-14.144 7.6979-38.701 2.826-53.121-1.4141-0.62004-0.19336-1.2401-0.38672-1.8789-0.58594v-1z" fill="#A6724F"/> <path transform="translate(463,641)" d="m0 0c3.0879 1.4354 5.6993 3.1697 8.4375 5.1875 5.8984 4.1968 12.138 7.4995 18.562 10.812-3.0103 0.93424-3.8665 1.0445-7 0 0.99 1.32 1.98 2.64 3 4-3.9512-1.622-6.7581-4.3566-9.8125-7.25-1.0629-0.99313-2.1267-1.9853-3.1914-2.9766-0.51192-0.47728-1.0238-0.95455-1.5513-1.4463-1.8547-1.7037-3.7651-3.3342-5.6948-4.9521l-2.75-2.375v-1z" fill="#262B26"/> <path transform="translate(232,859)" d="m0 0c0.92941 0.1534 1.8588 0.3068 2.8164 0.46484 5.0197 0.71709 10.059 0.88661 15.121 1.0977 0.97002 0.043184 1.94 0.086367 2.9395 0.13086 2.3742 0.10526 4.7486 0.2074 7.123 0.30664l-1 3c-3.0833 0.058225-6.1664 0.093671-9.25 0.125-1.309 0.025137-1.309 0.025137-2.6445 0.050781-0.84434 0.0064453-1.6887 0.012891-2.5586 0.019531-0.77505 0.010474-1.5501 0.020947-2.3486 0.031738-4.1383-0.42744-6.9982-2.7127-10.198-5.2271z" fill="#D69E3F"/> <path transform="translate(594,390)" d="m0 0c0 3 0 3-1.8984 5.0859-1.6456 1.521-3.2915 3.0419-4.9375 4.5625-2.2384 2.4324-3.0164 4.2993-4.1641 7.3516-3.2847 4.1286-6.8038 7.5828-12 9 1.4841-3.4865 3.4621-5.6419 6.1875-8.25 3.6022-3.5155 6.9624-7.1351 10.238-10.953 2.0876-2.3829 4.3006-4.5921 6.5742-6.7969z" fill="#1C211D"/> <path transform="translate(500,523)" d="m0 0c0 3 0 3-2 6v3c-1.4258 1.8242-1.4258 1.8242-3.3125 3.6875-0.92232 0.93393-0.92232 0.93393-1.8633 1.8867-1.8242 1.4258-1.8242 1.4258-4.8242 1.4258-1.655 1.0773-1.655 1.0773-3.1875 2.5l-2.8125 2.5c1.4841-3.4865 3.4621-5.6419 6.1875-8.25 4.1709-4.0697 8.0464-8.3058 11.812-12.75z" fill="#989F95"/> <path transform="translate(314,472)" d="m0 0 1 2c-0.70673 1.6582-1.4197 3.314-2.1675 4.9541-1.7251 4.2393-2.4514 8.79-3.3813 13.257-0.42594 1.9433-0.93217 3.8686-1.4512 5.7891l-2 1v-7l-3 3c1.5565-5.3537 3.9818-10.002 6.625-14.875 0.42023-0.78375 0.84047-1.5675 1.2734-2.375 1.0297-1.9189 2.065-3.8348 3.1016-5.75z" fill="#AFB2A7"/> <path transform="translate(321,656)" d="m0 0c0 3 0 3-1.418 4.5078-0.87592 0.80051-0.87592 0.80051-1.7695 1.6172-2.3576 2.6146-2.3576 2.6146-2.7539 5.9805 2.2333 7.129 6.4275 14.807 11.941 19.895l-1 3c-5.7437-7.2744-11.359-15.002-14-24 0.97563-3.3476 3.1483-5.365 5.625-7.75 0.63164-0.61359 1.2633-1.2272 1.9141-1.8594 0.72316-0.68836 0.72316-0.68836 1.4609-1.3906z" fill="#659060"/> <path transform="translate(843,162)" d="m0 0-7 4-1-1c-1.1954 0.37137-1.1954 0.37137-2.415 0.75024-2.9645 0.91567-5.9317 1.8222-8.9009 2.7227-1.9138 0.58341-3.8243 1.1773-5.7349 1.7712-1.8079 0.54624-1.8079 0.54624-3.6523 1.1035-1.6653 0.51059-1.6653 0.51059-3.3643 1.0315-2.8388 0.60099-4.2578 0.62531-6.9326-0.37915 8.6851-3.0151 17.427-5.7923 26.25-8.375 1.3751-0.4121 1.3751-0.4121 2.7781-0.83252 0.86214-0.24863 1.7243-0.49726 2.6125-0.75342 0.7686-0.22478 1.5372-0.44956 2.3291-0.68115 2.0303-0.35791 2.0303-0.35791 5.0303 0.64209z" fill="#EEEEE7"/> <path transform="translate(363,539)" d="m0 0c2.4928 2.1978 3.4918 3.8839 4.3906 7.0664 1.9026 6.1312 4.7821 11.714 7.6445 17.443 0.39574 0.81018 0.79148 1.6204 1.1992 2.4551 0.36319 0.72824 0.72639 1.4565 1.1006 2.2068 0.21946 0.60336 0.43893 1.2067 0.66504 1.8284l-1 2c-2.31-2.64-4.62-5.28-7-8l2-1c-0.72316-1.4676-0.72316-1.4676-1.4609-2.9648-3.3664-6.9464-6.3244-13.343-7.5391-21.035z" fill="#202520"/> <path transform="translate(434,704)" d="m0 0 2 2-2.125-0.14062-2.875-0.10938c-1.3922-0.069609-1.3922-0.069609-2.8125-0.14062-8.3614 1.0247-13.593 6.2565-19.188 12.141-0.67934 0.69738-1.3587 1.3948-2.0586 2.1133-1.6567 1.7034-3.3033 3.4154-4.9414 5.1367l-2-3c0.71543-0.38285 1.4309-0.7657 2.168-1.1602 3.2202-2.092 5.5201-4.4782 8.1445-7.2773 7.0863-7.2645 13.197-11.239 23.688-9.5625z" fill="#0C0B12"/> <path transform="translate(529,502)" d="m0 0c0 3 0 3-1.4961 4.7188-0.961 0.88172-0.961 0.88172-1.9414 1.7812-2.4839 2.2882-3.4713 3.2264-4.5625 6.5-3.3945 3.6854-7.1233 6.8445-11 10l-2-1c2.3733-2.5433 4.7489-5.0843 7.125-7.625 0.66516-0.71285 1.3303-1.4257 2.0156-2.1602 3.882-4.1484 7.8168-8.2227 11.859-12.215z" fill="#5F6662"/> <path transform="translate(636,389)" d="m0 0 1 2c-2.7844 3.6093-5.7605 6.7977-9 10-0.9655 0.96419-1.9303 1.929-2.8945 2.8945l-8.1055 8.1055-2-1c2.3733-2.5433 4.7489-5.0843 7.125-7.625 0.66516-0.71285 1.3303-1.4257 2.0156-2.1602 3.882-4.1484 7.8168-8.2227 11.859-12.215z" fill="#69706C"/> <path transform="translate(746,366)" d="m0 0c4.8363 0.99044 9.4762 1.957 14 4-3 1-3 1-5 1 0.99902 0.69867 1.998 1.3973 3.0273 2.1172 1.3035 0.91905 2.6069 1.8383 3.9102 2.7578 0.65936 0.4602 1.3187 0.92039 1.998 1.3945 4.9512 3.5039 4.9512 3.5039 6.0645 5.7305-3.9726-1.3958-6.962-3.2766-10.312-5.8125-3.382-2.5251-6.7496-4.9015-10.375-7.0625l-3.3125-2.125v-2z" fill="#1E231E"/> <path transform="translate(287,640)" d="m0 0c0 3.3118-0.54378 4.313-2.25 7.0625-0.62648 1.0383-0.62648 1.0383-1.2656 2.0977-1.6814 2.084-3.1057 2.6754-5.4844 3.8398-1.8591 1.8681-1.8591 1.8681-3.5625 4-2.1111 2.5577-3.6372 4.1331-6.4375 6 1.6832-4.2338 4.7224-7.1317 7.8125-10.375 3.8774-4.1027 7.6144-8.2528 11.188-12.625z" fill="#B17C56"/> <path transform="translate(269,715)" d="m0 0c1.7369 2.6054 2.691 4.5834 3.6875 7.5 0.27199 0.77344 0.54398 1.5469 0.82422 2.3438 0.48828 2.1562 0.48828 2.1562-0.51172 5.1562l-4-9-3.8125 2.875c-2.3634 1.7822-4.7226 3.4818-7.1875 5.125 1.5778-3.7105 3.907-6.2991 6.625-9.25 0.81727-0.89203 1.6345-1.7841 2.4766-2.7031 0.62648-0.67547 1.253-1.3509 1.8984-2.0469z" fill="#659360"/> <path transform="translate(539,583)" d="m0 0 2 1c-2.7654 2.8396-5.5406 5.6692-8.3252 8.49-1.4099 1.4324-2.8119 2.8725-4.2139 4.3127-0.88945 0.89912-1.7789 1.7982-2.6953 2.7246-0.81694 0.83265-1.6339 1.6653-2.4756 2.5232-2.2207 1.8905-3.4429 2.5807-6.29 2.9495 4.1488-5.1314 8.6395-9.4801 13.586-13.844 2.9258-2.6133 5.6771-5.3473 8.4141-8.1562z" fill="#252A24"/> <path transform="translate(624,272)" d="m0 0c1.9375 0.5625 1.9375 0.5625 4 2 0.6875 3.1875 0.6875 3.1875 1 7l1 7h-2c-2.6939-4.7755-4.3135-9.5655-5-15l1-1z" fill="#CAC8B8"/> <path transform="translate(365,599)" d="m0 0h2c1.4102 1.4688 1.4102 1.4688 3.0625 3.5 2.6813 3.175 5.4664 5.9251 8.625 8.625 3.5174 3.0372 6.0011 5.8552 8.3125 9.875-3.4361-1.4823-5.687-3.4295-8.3281-6.0625-0.79922-0.79664-1.5984-1.5933-2.4219-2.4141-0.825-0.83273-1.65-1.6655-2.5-2.5234-0.84047-0.83273-1.6809-1.6655-2.5469-2.5234-0.79406-0.79664-1.5881-1.5933-2.4062-2.4141-1.093-1.0963-1.093-1.0963-2.208-2.2148-1.5889-1.8477-1.5889-1.8477-1.5889-3.8477z" fill="#6A736B"/> <path transform="translate(809,287)" d="m0 0c1.9919 6.925-1.0559 14.487-4.1875 20.75l-1.8125 3.25c-1.1931-3.4444-0.80482-5.3763 0.43359-8.7656 0.31904-0.88945 0.63809-1.7789 0.9668-2.6953 0.34225-0.92039 0.68449-1.8408 1.0371-2.7891 0.33838-0.93586 0.67676-1.8717 1.0254-2.8359 0.83619-2.3083 1.6821-4.6126 2.5371-6.9141z" fill="#272D28"/> <path transform="translate(264,854)" d="m0 0h18c-4.4605 3.5684-6.8589 5.1911-12 7-0.99-0.33-1.98-0.66-3-1 2.31-0.99 4.62-1.98 7-3l-10-2v-1z" fill="#EEBC46"/> <path transform="translate(782,362)" d="m0 0c1.2403 3.7209 0.5719 4.9946-0.75 8.625-0.5182 1.4734-0.5182 1.4734-1.0469 2.9766-1.2031 2.3984-1.2031 2.3984-4.2031 3.3984-2.6992-0.99609-2.6992-0.99609-5.6875-2.4375-0.99387-0.47309-1.9877-0.94617-3.0117-1.4336-0.75926-0.37254-1.5185-0.74508-2.3008-1.1289 3.4787-1.1596 4.3422-0.77457 7.6875 0.4375 0.80824 0.28746 1.6165 0.57492 2.4492 0.87109 0.61488 0.22816 1.2298 0.45633 1.8633 0.69141v-2h2c0.99-3.3 1.98-6.6 3-10z" fill="#868E89"/> <path transform="translate(734,320)" d="m0 0 3 2c0.1875 2.625 0.1875 2.625 0 5h2l-1 3h-4v-3c-0.99-0.33-1.98-0.66-3-1v-5c0.99 0.33 1.98 0.66 3 1v-2z" fill="#7B827E"/> <path transform="translate(350,620)" d="m0 0c2.8606 1.3594 4.8593 2.6452 7 5l-1 2-5-4c-0.48211 0.50531-0.96422 1.0106-1.4609 1.5312-0.63164 0.64969-1.2633 1.2994-1.9141 1.9688-0.62648 0.64969-1.253 1.2994-1.8984 1.9688-1.7266 1.5312-1.7266 1.5312-3.7266 1.5312l-1 2c0-3 0-3 1.9688-5.2617 1.253-1.2008 1.253-1.2008 2.5312-2.4258 0.83531-0.80824 1.6706-1.6165 2.5312-2.4492 0.64969-0.61488 1.2994-1.2298 1.9688-1.8633z" fill="#5F845A"/> <path transform="translate(193,766)" d="m0 0c2 2 2 2 2.25 5.5-0.25 3.5-0.25 3.5-2.25 5.5l-1-7c-1.98 3.63-3.96 7.26-6 11l-1-2c0.89062-2.2773 0.89062-2.2773 2.25-4.9375 0.43828-0.87527 0.87656-1.7505 1.3281-2.6523 1.2949-2.1948 2.5315-3.7255 4.4219-5.4102z" fill="#1D202B"/> <path transform="translate(732,266)" d="m0 0 2 1c-1.9681 1.9681-3.9364 3.936-5.9062 5.9023-1.6034 1.6064-3.1949 3.2245-4.7812 4.8477-2.3234 2.2606-4.7471 4.271-7.3125 6.25l-2-1c0.43868-0.40839 0.87737-0.81678 1.3293-1.2375 1.9949-1.8578 3.989-3.7163 5.9832-5.575 1.0354-0.9639 1.0354-0.9639 2.0918-1.9473 0.66709-0.62197 1.3342-1.2439 2.0215-1.8848 0.91906-0.85622 0.91906-0.85622 1.8567-1.7297 1.6011-1.5155 3.1671-3.0587 4.7175-4.6257z" fill="#69706D"/> <path transform="translate(568,461)" d="m0 0v5c-1.4609 1.1836-1.4609 1.1836-3.375 2.4375-2.7109 1.7794-3.753 2.7544-5.625 5.5625-1.7266 1.3867-1.7266 1.3867-3.625 2.6875-0.94746 0.65549-0.94746 0.65549-1.9141 1.3242-0.72316 0.4892-0.72316 0.4892-1.4609 0.98828 1.3584-3.0433 2.8846-5.1231 5.2578-7.4531 0.6252-0.61875 1.2504-1.2375 1.8945-1.875 0.65098-0.63422 1.302-1.2684 1.9727-1.9219 0.65871-0.64969 1.3174-1.2994 1.9961-1.9688 1.6219-1.5984 3.2482-3.1919 4.8789-4.7812z" fill="#686F6B"/> <path transform="translate(242,692)" d="m0 0 1 3-1.9375 1.25c-2.2156 1.5244-2.2156 1.5244-2.5 3.6875-0.86056 3.1554-2.9377 4.27-5.5625 6.0625h-2c1.5778-3.7105 3.907-6.2991 6.625-9.25 0.81727-0.89203 1.6345-1.7841 2.4766-2.7031 0.62648-0.67547 1.253-1.3509 1.8984-2.0469z" fill="#D69566"/> <path transform="translate(309,616)" d="m0 0c0 3.5166-0.67787 4.3185-2.75 7.0625-0.51047 0.69223-1.0209 1.3845-1.5469 2.0977-1.7987 1.9431-3.3542 2.6892-5.7031 3.8398l-2 3-2-1c1.3891-1.7553 2.7866-3.504 4.1875-5.25 0.7773-0.97453 1.5546-1.9491 2.3555-2.9531 2.3127-2.6326 4.6551-4.7066 7.457-6.7969z" fill="#C58B5F"/> <path transform="translate(296,820)" d="m0 0c0.125 3.375 0.125 3.375 0 7l-2 2v-7h-20v-1c2.9166-0.16803 5.8333-0.33448 8.75-0.5 1.2375-0.071543 1.2375-0.071543 2.5-0.14453 1.1988-0.067676 1.1988-0.067676 2.4219-0.13672 0.73315-0.041895 1.4663-0.083789 2.2217-0.12695 2.0338-0.08863 4.0707-0.091797 6.1064-0.091797z" fill="#EDBA44"/> <path transform="translate(365,540)" d="m0 0c1.1289 0.93274 2.253 1.8714 3.375 2.8125 0.62648 0.52207 1.253 1.0441 1.8984 1.582 1.7266 1.6055 1.7266 1.6055 3.7266 4.6055h-4l-2 2c-0.50368-1.4571-1.0028-2.9157-1.5-4.375-0.27844-0.81211-0.55688-1.6242-0.84375-2.4609-0.65625-2.1641-0.65625-2.1641-0.65625-4.1641z" fill="#7D867F"/> <path transform="translate(710,299)" d="m0 0c0.26925 4.8028-0.56762 8.2823-2.3125 12.75-0.64389 1.6938-0.64389 1.6938-1.3008 3.4219-1.3867 2.8281-1.3867 2.8281-4.3867 4.8281 1.8676-5.7221 3.8529-11.377 6-17l-2-1c2.875-3 2.875-3 4-3z" fill="#A3A89F"/> <path transform="translate(805,242)" d="m0 0h4c-1.4526 3.8295-3.429 5.1205-7 7l-2-2c-0.99-0.33-1.98-0.66-3-1l1-2c1.9929-0.37366 3.9936-0.70741 6-1l1-1z" fill="#7B827F"/> <path transform="translate(544,647)" d="m0 0c5.6683 0.59468 10.603 2.0924 15.938 4.0625 0.77924 0.28166 1.5585 0.56332 2.3613 0.85352 1.9026 0.68866 3.8022 1.3855 5.7012 2.084-3.4782 1.1594-5.459 0.70821-9 0v-2c-0.91523-0.19336-1.8305-0.38672-2.7734-0.58594-1.1885-0.26039-2.377-0.52078-3.6016-0.78906-1.1834-0.25523-2.3667-0.51047-3.5859-0.77344-3.0391-0.85156-3.0391-0.85156-5.0391-2.8516z" fill="#A47250"/> <path transform="translate(477,554)" d="m0 0 2 1c-0.77086 0.83145-1.5417 1.6629-2.3359 2.5195-1.0131 1.0976-2.0261 2.1952-3.0391 3.293-0.50789 0.54721-1.0158 1.0944-1.5391 1.6582-2.2381 2.4295-4.2497 4.775-6.0859 7.5293-0.99-0.33-1.98-0.66-3-1 0.63615-0.61875 0.63615-0.61875 1.2852-1.25 4.4672-4.3985 8.6427-8.9847 12.715-13.75z" fill="#606762"/> <path transform="translate(538,756)" d="m0 0c-2.2887 1.3386-4.5807 2.671-6.875 4-0.65098 0.38156-1.302 0.76312-1.9727 1.1562-4.9258 2.8438-4.9258 2.8438-7.1523 2.8438l-1 2-2-2c1.2891-0.67155 2.5814-1.3371 3.875-2 0.7193-0.37125 1.4386-0.7425 2.1797-1.125 1.9453-0.875 1.9453-0.875 3.9453-0.875l1-3c5.4023-2.2989 5.4023-2.2989 8-1z" fill="#A97551"/> <path transform="translate(311,481)" d="m0 0h3c-0.56821 5.4548-1.9464 9.9106-4 15l-2-2c0.46094-3.0391 0.46094-3.0391 1.375-6.625 0.29648-1.1885 0.59297-2.377 0.89844-3.6016 0.23977-0.91523 0.47953-1.8305 0.72656-2.7734z" fill="#707770"/> <path transform="translate(697,160)" d="m0 0c-2.2881 2.2881-3.8075 2.7545-6.875 3.6875-0.86367 0.27199-1.7273 0.54398-2.6172 0.82422-2.5948 0.50521-4.0386 0.34389-6.5078-0.51172h2v-2c4.9274-1.9709 8.7802-2.18 14-2z" fill="#D39968"/> <path transform="translate(275,656)" d="m0 0 2 1c-0.48211 0.47051-0.96422 0.94102-1.4609 1.4258-0.63164 0.62262-1.2633 1.2452-1.9141 1.8867-0.62648 0.61488-1.253 1.2298-1.8984 1.8633-1.9074 1.9123-1.9074 1.9123-3.7266 4.8242-1.9675 1.0625-3.9659 2.0714-6 3 1.5658-4.0372 4.4417-6.4707 7.625-9.25l1.5625-1.3906c1.266-1.1253 2.5386-2.2431 3.8125-3.3594z" fill="#D29566"/> <path transform="translate(489,537)" d="m0 0 1 3c-0.99 0.33-1.98 0.66-3 1 0.061875 0.78375 0.12375 1.5675 0.1875 2.375l-0.1875 2.625-3 2-2-4 7-7zm-8 8 1 3-2-1 1-2z" fill="#7E847C"/> <path transform="translate(395,449)" d="m0 0 1 3-10 9c0-3.524 0.55115-4.015 2.8125-6.5625 0.78311-0.89912 0.78311-0.89912 1.582-1.8164 1.6055-1.6211 1.6055-1.6211 4.6055-3.6211z" fill="#CA8F63"/> <path transform="translate(659,351)" d="m0 0 1 4-2.5625 1.5625c-3.9798 2.631-7.166 5.9918-10.438 9.4375 0-3 0-3 2.625-5.918 1.1175-1.0975 2.2429-2.1871 3.375-3.2695 0.57234-0.55881 1.1447-1.1176 1.7344-1.6934 1.4153-1.3799 2.8396-2.7504 4.2656-4.1191z" fill="#B3B8AE"/> <path transform="translate(295,434)" d="m0 0 2 1c-2.8252 4.6725-5.6776 7.66-10 11 0-3.9613 1.3488-4.8291 4-7.6875 0.7425-0.80824 1.485-1.6165 2.25-2.4492 0.5775-0.61488 1.155-1.2298 1.75-1.8633z" fill="#AE7B56"/> <path transform="translate(752,369)" d="m0 0c8.282 0.34725 8.282 0.34725 11.062 2.875 0.9375 2.125 0.9375 2.125 0.9375 5.125-4.5567-1.5189-8.3172-3.954-12-7v-1z" fill="#3D443E"/> <path transform="translate(197,888)" d="m0 0c3.7189 0.50712 6.7345 1.1161 10 3v2c1.98 0.66 3.96 1.32 6 2-3 1-3 1-6.1367-0.43359-1.1893-0.65777-2.3727-1.3262-3.5508-2.0039-0.6065-0.33838-1.213-0.67676-1.8379-1.0254-1.4966-0.83669-2.9863-1.6857-4.4746-2.5371v-1z" fill="#B9825A"/> <path transform="translate(551,613)" d="m0 0 2 1-12 11-2-1c1.3021-1.4974 2.6042-2.9948 3.9062-4.4922 1.2895-1.4672 1.2895-1.4672 1.0938-3.5078 0.78375-0.12375 1.5675-0.2475 2.375-0.375 2.7656-0.41618 2.7656-0.41618 4.625-2.625z" fill="#1E1C1E"/> <path transform="translate(456,571)" d="m0 0 2 3-6 4 5 7c-3.7952-1.491-5.6104-3.757-8-7l7-7z" fill="#858E85"/> <path transform="translate(282,551)" d="m0 0c1.98 0.66 3.96 1.32 6 2l0.25 2.25c0.88969 3.2622 2.235 4.5595 4.75 6.75l-1 2c-1.6728-1.7863-3.3382-3.5785-5-5.375-0.71543-0.76184-0.71543-0.76184-1.4453-1.5391-3.5547-3.8594-3.5547-3.8594-3.5547-6.0859z" fill="#191B1D"/> <path transform="translate(317,466)" d="m0 0c3.3865 3.8702 6.3295 8.1013 8 13l-1 3-5-10h-4l2-6z" fill="#929B92"/> <path transform="translate(818,176)" d="m0 0c2 3 2 3 1.875 5-1.114 2.5463-2.5705 3.5132-4.875 5v-3l-2-1 2-4 1 2-1 2h2l1-6z" fill="#B8B9AD"/> <path transform="translate(322,838)" d="m0 0h1c-0.0603 1.9175-0.14917 3.8342-0.25 5.75l-0.14062 3.2344c-0.71527 3.5397-1.8652 4.7544-4.6094 7.0156 1.1506-5.398 2.4242-10.71 4-16z" fill="#F4C182"/> <path transform="translate(843,162)" d="m0 0-7 4-1-1c-1.9214 0.32744-1.9214 0.32744-4.0625 0.9375-0.73348 0.19465-1.467 0.3893-2.2227 0.58984-0.5659 0.15598-1.1318 0.31195-1.7148 0.47266l-1-2c2.2681-0.69809 4.5387-1.3837 6.8125-2.0625 0.6426-0.19916 1.2852-0.39832 1.9473-0.60352 4.9004-1.4473 4.9004-1.4473 8.2402-0.33398z" fill="#DBDDD0"/> <path transform="translate(545,475)" d="m0 0h1l-0.0625 2.8125c-0.095196 3.2104-0.095196 3.2104 1.0625 6.1875l-4 3c0-10 0-10 2-12z" fill="#8E948B"/> <path transform="translate(191,773)" d="m0 0h1l1 8h1v6l-1-3h-2l-0.375-1.9375-0.625-2.0625-2-1 3-6z" fill="#E4B44E"/> <path transform="translate(380,468)" d="m0 0c0 3.5891-0.66437 4.1086-3 6.6875-0.55688 0.62262-1.1138 1.2452-1.6875 1.8867-0.43312 0.47051-0.86625 0.94102-1.3125 1.4258l-1-4 7-6z" fill="#D89A6A"/> <path transform="translate(746,366)" d="m0 0c4.8363 0.99044 9.4762 1.957 14 4-3.1335 1.0445-3.9897 0.93424-7 0l-1 2c-2.0383-1.274-4.0385-2.6106-6-4v-2z" fill="#2A2F2B"/> <path transform="translate(610,261)" d="m0 0 1 2c-0.92735 1.4856-1.8672 2.9633-2.8125 4.4375-0.78311 1.2356-0.78311 1.2356-1.582 2.4961-1.6055 2.0664-1.6055 2.0664-4.6055 3.0664 1.4098-3.0385 3.0887-5.594 5.125-8.25 0.80824-1.0596 0.80824-1.0596 1.6328-2.1406 0.40992-0.53109 0.81984-1.0622 1.2422-1.6094z" fill="#9E9F96"/> <path transform="translate(822,238)" d="m0 0c1.5639 3.9738 0.36145 6.8138-0.9375 10.75-0.38027 1.1705-0.76055 2.3409-1.1523 3.5469-0.30035 0.89203-0.6007 1.7841-0.91016 2.7031h-1c-0.46904-6.0975 1.2914-11.583 4-17z" fill="#909892"/> <path transform="translate(708,200)" d="m0 0c-1 2-1 2-4.3125 3.1875-3.2631 0.71899-4.6803 1.0154-7.6875-0.1875h2v-2c6.2857-2.4286 6.2857-2.4286 10-1z" fill="#272B26"/> <path transform="translate(279,856)" d="m0 0 2 1c-4.75 3-4.75 3-7 3v2c-3.287 0.79953-4.7102 1.0966-8 0 2.1204-1.0303 4.2465-2.049 6.375-3.0625 1.1834-0.56848 2.3667-1.137 3.5859-1.7227 1.0029-0.4009 2.0058-0.8018 3.0391-1.2148z" fill="#161929"/> <path transform="translate(198,719)" d="m0 0-4 1v3l-5 2-2-3c1.2642-0.69965 2.5367-1.3843 3.8125-2.0625 0.7077-0.38285 1.4154-0.7657 2.1445-1.1602 2.043-0.77734 2.043-0.77734 5.043 0.22266z" fill="#BF885E"/> <path transform="translate(477,341)" d="m0 0 1 2c-2.6496 3.6309-5.0182 5.8985-9 8l-1-2c2.8528-2.932 5.6508-5.6432 9-8z" fill="#C48B60"/> <path transform="translate(810,225)" d="m0 0 5 2-3 2h2v2h-2v2h-2c-0.79953-3.287-1.0966-4.7102 0-8z" fill="#7B827F"/> <path transform="translate(469,559)" d="m0 0 2 3-5 5c-0.99-0.33-1.98-0.66-3-1 1.98-2.31 3.96-4.62 6-7z" fill="#777E76"/> <path transform="translate(536,546)" d="m0 0c4.6769 1.4769 4.6769 1.4769 6.3125 4.125 0.22688 0.61875 0.45375 1.2375 0.6875 1.875h-4c-3-4.1786-3-4.1786-3-6z" fill="#6D7570"/> <path transform="translate(707,312)" d="m0 0c1 2 1 2 0.375 4.8125-1.5563 3.6078-3.4684 5.5868-6.375 8.1875l-2-1c0.76312-0.86625 1.5262-1.7325 2.3125-2.625 2.4397-2.911 4.1175-5.9044 5.6875-9.375z" fill="#6B726E"/> <path transform="translate(355,453)" d="m0 0c6.7046 3.9562 6.7046 3.9562 7.9375 8.3125l0.0625 2.6875c-5.8021-5.6452-5.8021-5.6452-8-9v-2z" fill="#DCA06D"/> <path transform="translate(625,277)" d="m0 0c2.7296 2.3574 3.8889 4.5813 5 8v3h-2c-2.1531-3.8576-3.3925-6.5513-3-11z" fill="#C1C0B1"/> <path transform="translate(798,225)" d="m0 0 3 2v2l-4 2-2-5c0.99-0.33 1.98-0.66 3-1zm-5 3 3 2h-3v-2z" fill="#7C8480"/> <path transform="translate(151,760)" d="m0 0h1c0.125 5.75 0.125 5.75-1 8h-2l-1 6c-1.371-3.6904-0.60011-5.7088 0.9375-9.25 0.38027-0.89203 0.76055-1.7841 1.1523-2.7031 0.30035-0.67547 0.6007-1.3509 0.91016-2.0469z" fill="#AD7B56"/> <path transform="translate(520,513)" d="m0 0 1 2-2-1 1-1zm-5 5v3c-2.5 2.1875-2.5 2.1875-5 4l-2-1 7-6z" fill="#676E6A"/> <path transform="translate(544,486)" d="m0 0c0 3.7791-0.99704 4.4611-3.5 7.1875-0.64969 0.71543-1.2994 1.4309-1.9688 2.168-0.50531 0.5427-1.0106 1.0854-1.5312 1.6445l-2-1c1.1241-1.2924 2.2493-2.5839 3.375-3.875 0.62648-0.7193 1.253-1.4386 1.8984-2.1797 1.2008-1.353 2.4474-2.6661 3.7266-3.9453z" fill="#646B67"/> <path transform="translate(773,326)" d="m0 0c2.9719 1.1245 5.3344 2.2229 8 4l-1 3-1.75-1.4375c-2.1758-1.511-3.676-2.1029-6.25-2.5625l1-3z" fill="#7B827E"/> <path transform="translate(511,296)" d="m0 0 1 2c-2.3896 3.243-4.2048 5.509-8 7 1.555-3.8168 4.036-6.192 7-9z" fill="#C68D61"/> <path transform="translate(582,222)" d="m0 0c0 3.0522-0.32293 4.0453-1.75 6.625-0.32484 0.61102-0.64969 1.222-0.98438 1.8516-1.6012 1.9273-2.8354 2.1456-5.2656 2.5234 0.95545-1.4602 1.9145-2.9181 2.875-4.375 0.53367-0.81211 1.0673-1.6242 1.6172-2.4609 1.5078-2.1641 1.5078-2.1641 3.5078-4.1641z" fill="#1B1C1F"/> <path transform="translate(325,864)" d="m0 0 1 2-6 9-1-2 1-3h2l0.375-2.4375 0.625-2.5625 2-1z" fill="#B67E57"/> <path transform="translate(168,863)" d="m0 0 1.8125 1.5c2.1578 1.7828 2.1578 1.7828 5.1875 1.5l1 3-2 2c-1.006-0.95207-2.0046-1.9119-3-2.875-0.55688-0.53367-1.1138-1.0673-1.6875-1.6172-1.3125-1.5078-1.3125-1.5078-1.3125-3.5078z" fill="#BD8259"/> <path transform="translate(328,855)" d="m0 0h1c0.25 2.75 0.25 2.75 0 6-2 2.375-2 2.375-4 4l-1-2c0.77734-1.9453 0.77734-1.9453 1.9375-4.125 0.57041-1.0867 0.57041-1.0867 1.1523-2.1953 0.30035-0.5543 0.6007-1.1086 0.91016-1.6797z" fill="#D79969"/> <path transform="translate(415,421)" d="m0 0 1 4-6 5c0-4.3897 2.1281-5.7691 5-9z" fill="#B5815A"/> <path transform="translate(633,390)" d="m0 0c0 3 0 3-1.5312 4.8242-0.64969 0.61488-1.2994 1.2298-1.9688 1.8633-0.64969 0.62262-1.2994 1.2452-1.9688 1.8867-0.50531 0.47051-1.0106 0.94102-1.5312 1.4258 0-3 0-3 2-6v-2l1.9375-0.4375c2.038-0.37257 2.038-0.37257 3.0625-1.5625z" fill="#9FA49B"/> <path transform="translate(500,309)" d="m0 0 1 4-6 5c0-4.3897 2.1281-5.7691 5-9z" fill="#B9835B"/> <path transform="translate(808,211)" d="m0 0 1 2h2l1-2c0.99 1.65 1.98 3.3 3 5-1.3333 0.66667-2.6667 1.3333-4 2l-4-6 1-1z" fill="#7D8480"/> <path transform="translate(518,686)" d="m0 0c2.5 2.3125 2.5 2.3125 5 5v3l-7-6 2-2z" fill="#252A23"/> <path transform="translate(488,567)" d="m0 0c2.125 0.375 2.125 0.375 4 1v3h-2l-2 2-2-4 2-2z" fill="#6A716C"/> <path transform="translate(507,550)" d="m0 0h2v3h3l1 3-4 1c-2-5.875-2-5.875-2-7z" fill="#6A726C"/> <path transform="translate(453,371)" d="m0 0 1 4-7 5c1.5271-3.436 3.5993-6.1191 6-9z" fill="#B38058"/> <path transform="translate(466,354)" d="m0 0 1 4-5 4c0-3.9084 1.5057-5.1159 4-8z" fill="#B8835B"/> <path transform="translate(696,312)" d="m0 0 2 4-6 4c1.75-5.75 1.75-5.75 4-8z" fill="#A3A79E"/> <path transform="translate(811,219)" d="m0 0 2.875 1.0625c2.9956 1.2878 2.9956 1.2878 5.125-0.0625l-2 4-2-1-1 2-1-4h-2v-2z" fill="#7C8480"/> <path transform="translate(220,854)" d="M0 0 C1.46067199 0.45082469 2.91848032 0.91093537 4.375 1.375 C5.18710938 1.63023437 5.99921875 1.88546875 6.8359375 2.1484375 C9 3 9 3 11 5 C4.61764706 5.49095023 4.61764706 5.49095023 1.5625 3.0625 C0 1 0 1 0 0 Z " fill="#CF9940"/> <path transform="translate(515,679)" d="m0 0 5 1 1 4-3 2c-0.99-2.31-1.98-4.62-3-7z" fill="#5B645B"/> <path transform="translate(463,430)" d="m0 0c0 3.2818-0.47836 5.1089-2 8-2.125 0.8125-2.125 0.8125-4 1 1.5271-3.436 3.5993-6.1191 6-9z" fill="#EFEFE7"/> <path transform="translate(506,303)" d="m0 0c0 3 0 3-2.5 5.6875l-2.5 2.3125c0.3505-3.2421 0.56221-4.6153 3.0625-6.8125 0.63938-0.39188 1.2788-0.78375 1.9375-1.1875z" fill="#D89B69"/> <path transform="translate(475,753)" d="m0 0c2.3125 0.1875 2.3125 0.1875 5 1 1.8125 2.5625 1.8125 2.5625 3 5-3.3659-1.4425-5.5105-3.3326-8-6z" fill="#B9835A"/> <path transform="translate(162,743)" d="m0 0 1 2c-1.25 2.5625-1.25 2.5625-3 5-0.99 0.33-1.98 0.66-3 1 1.1858-3.375 2.2757-5.6472 5-8z" fill="#B47F58"/> <path transform="translate(181,727)" d="m0 0 1 2c-1.75 1.5625-1.75 1.5625-4 3-2.25-0.3125-2.25-0.3125-4-1 2.1742-2.5004 3.7305-3.4363 7-4z" fill="#C99064"/> <path transform="translate(242,692)" d="m0 0 1 3c-2.3125 2.5-2.3125 2.5-5 5h-3c2.31-2.64 4.62-5.28 7-8z" fill="#AE7B55"/> <path transform="translate(370,499)" d="m0 0c0 3 0 3-1.5 4.6875l-1.5 1.3125c-1.5-1.375-1.5-1.375-3-3v-2l1.875 0.625 2.125 0.375 2-2z" fill="#E6BE85"/> <path transform="translate(272,467)" d="m0 0 1 2c-0.93579 2.3598-1.9335 4.6963-3 7h-2c1.0588-3.4031 2.009-6.0135 4-9z" fill="#B5805A"/> <path transform="translate(277,458)" d="m0 0c1 2 1 2 0.25 5.0625l-1.25 2.9375c-0.99 0.33-1.98 0.66-3 1 1.0588-3.4031 2.009-6.0135 4-9z" fill="#AF7C57"/> <path transform="translate(437,392)" d="m0 0 1 4-6 4c1.3715-2.9541 2.9886-5.4401 5-8z" fill="#B18159"/> <path transform="translate(553,310)" d="m0 0 1 4-4 3-2-1 5-6z" fill="#E8E7DD"/> <path transform="translate(526,274)" d="m0 0 1 4-6 4c1.3715-2.9541 2.9886-5.4401 5-8z" fill="#B37F57"/> <path transform="translate(565,222)" d="m0 0c1.125 3.75 1.125 3.75 0 6-1.6436 0.72159-3.3105 1.3935-5 2 1.3715-2.9541 2.9886-5.4401 5-8z" fill="#B98158"/> <path transform="translate(407,717)" d="m0 0c0 3 0 3-1.3125 4.3867-1.5625 1.2044-3.125 2.4089-4.6875 3.6133l-1-3 2.375-1.375c2.662-1.5093 2.662-1.5093 4.625-3.625z" fill="#11161B"/> <path transform="translate(477,362)" d="m0 0 1 2c-0.93306 2.7144-1.6267 3.7804-4.125 5.25l-1.875 0.75c1.1858-3.375 2.2757-5.6472 5-8z" fill="#191C1F"/> <path transform="translate(462,361)" d="m0 0 1 2-5 5c0.3125-2.375 0.3125-2.375 1-5l3-2z" fill="#D59868"/> <path transform="translate(531,290)" d="m0 0 2 1c-1.0487 2.6219-1.6493 3.7937-4.125 5.25l-1.875 0.75c1.074-2.9152 1.7781-4.7781 4-7z" fill="#202223"/> <path transform="translate(793,209)" d="m0 0c0.99 0.33 1.98 0.66 3 1l-6 5-2-1 5-5z" fill="#6A706E"/> <path transform="translate(465,748)" d="m0 0c0.99 0.33 1.98 0.66 3 1v2c-0.99-0.33-1.98-0.66-3-1v-2z" fill="#C78A5F"/> <path transform="translate(249,531)" d="m0 0 2 4-2-1v-3z" fill="#B8835C"/> <path transform="translate(370,472)" d="m0 0 3 2h-3v-2z" fill="#D7956A"/> <path transform="translate(162,859)" d="m0 0 2 1-1 2-1-3z" fill="#BC835A"/> <path transform="translate(146,829)" d="m0 0h2l-1 3-1-3z" fill="#BA815A"/> <path transform="translate(836,340)" d="m0 0 1 4z" fill="#C98C62"/> <path transform="translate(472,341)" d="m0 0 2 1-2 2v-3z" fill="#C2895F"/> <path transform="translate(277,903)" d="m0 0c3 1 3 1 3 1z" fill="#BF845A"/> <path transform="translate(228,903)" d="m0 0c3 1 3 1 3 1z" fill="#BE855B"/> <path transform="translate(555,648)" d="m0 0c3 1 3 1 3 1z" fill="#D29063"/> <path transform="translate(306,602)" d="m0 0 2 2h-2v-2z" fill="#CE8F63"/> <path transform="translate(884,182)" d="m0 0 2 2h-2v-2z" fill="#C48961"/> <path transform="translate(632,176)" d="m0 0c3 1 3 1 3 1z" fill="#CF8F62"/> <path transform="translate(672,163)" d="m0 0c3 1 3 1 3 1z" fill="#C78B60"/> <path transform="translate(834,114)" d="m0 0c3 1 3 1 3 1z" fill="#CA8B5F"/> <path transform="translate(224,902)" d="m0 0 2 1z" fill="#BC835B"/> <path transform="translate(491,766)" d="m0 0 2 1z" fill="#C2855B"/> <path transform="translate(432,725)" d="m0 0 2 1z" fill="#D09164"/> <path transform="translate(193,717)" d="m0 0 2 1z" fill="#C68B60"/> <path transform="translate(595,700)" d="m0 0 2 1z" fill="#BA805A"/> <path transform="translate(268,658)" d="m0 0 2 1z" fill="#C88B60"/> <path transform="translate(564,651)" d="m0 0 2 1z" fill="#D49266"/> <path transform="translate(304,601)" d="m0 0 2 1z" fill="#CC8D62"/> <path transform="translate(600,591)" d="m0 0 2 1z" fill="#CE8E61"/> <path transform="translate(604,588)" d="m0 0 2 1z" fill="#CD8D61"/> <path transform="translate(273,565)" d="m0 0 2 1z" fill="#CA8C63"/> <path transform="translate(779,438)" d="m0 0 2 1z" fill="#C58A60"/> <path transform="translate(496,304)" d="m0 0 2 1z" fill="#BE875E"/> <path transform="translate(867,239)" d="m0 0 2 1z" fill="#C88C64"/> <path transform="translate(626,178)" d="m0 0 2 1z" fill="#C88A5E"/> <path transform="translate(657,168)" d="m0 0 2 1z" fill="#CD8F65"/> <path transform="translate(709,152)" d="m0 0 2 1z" fill="#CB8A5E"/> <path transform="translate(776,131)" d="m0 0 2 1z" fill="#C7895F"/> </svg> <h1>Glotus Client</h1> <p>by Murka</p> </div> <svg id="close-button" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"> <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/> </svg> </header>';
    const Header = code;
    Navbar_code = '<aside id="navbar-container"> <button data-id="0" class="open-menu active">Keybinds</button> <button data-id="1" class="open-menu">Combat</button> <button data-id="2" class="open-menu">Visuals</button> <button data-id="3" class="open-menu">Misc</button> <button data-id="4" class="open-menu">Devtool</button> <button data-id="6" class="open-menu bottom-align">Credits</button> </aside>';
    const Navbar = Navbar_code;
    Keybinds_code = '<div class="menu-page opened" data-id="0"> <h1>Keybinds</h1> <p>Setup keybinds for items, weapons and hats</p> <div class="section"> <h2 class="section-title">Items & Weapons</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Primary</span> <button id="primary" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Secondary</span> <button id="secondary" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Food</span> <button id="food" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Wall</span> <button id="wall" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Spike</span> <button id="spike" class="hotkeyInput"></button> </div> </div> <div class="content-split"> <div class="content-option"> <span class="option-title">Windmill</span> <button id="windmill" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Farm</span> <button id="farm" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Trap</span> <button id="trap" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Turret</span> <button id="turret" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Spawn</span> <button id="spawn" class="hotkeyInput"></button> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Controls & Movement</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Up</span> <button id="up" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Left</span> <button id="left" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Down</span> <button id="down" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Right</span> <button id="right" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Auto attack</span> <button id="autoattack" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Lock rotation</span> <button id="lockrotation" class="hotkeyInput"></button> </div> </div> <div class="content-split"> <div class="content-option"> <span class="option-title">Toggle chat</span> <button id="toggleChat" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Toggle shop</span> <button id="toggleShop" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Toggle clan</span> <button id="toggleClan" class="hotkeyInput"></button> </div> <div class="content-option"> <span class="option-title">Toggle menu</span> <button id="toggleMenu" class="hotkeyInput"></button> </div> </div> </div> </div> </div>';
    const Keybinds = Keybinds_code;
    Combat_code = '<div class="menu-page" data-id="1"> <h1>Combat</h1> <p>Modify combat settings, change pvp behavior</p> <div class="section"> <h2 class="section-title">Autohat</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Biome hats</span> <label class="switch-checkbox"> <input id="biomehats" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Autoemp</span> <label class="switch-checkbox"> <input id="autoemp" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Anti enemy</span> <label class="switch-checkbox"> <input id="antienemy" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Anti animal</span> <label class="switch-checkbox"> <input id="antianimal" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Anti spike</span> <label class="switch-checkbox"> <input id="antispike" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Healing</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Autoheal</span> <label class="switch-checkbox"> <input id="autoheal" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Healing speed</span> <label class="slider"> <span class="slider-value"></span> <input id="healingSpeed" type="range" min="0" max="50"> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Placement</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Autoplacer</span> <label class="switch-checkbox"> <input id="autoplacer" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Automill</span> <label class="switch-checkbox"> <input id="automill" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Defense</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Autobreak</span> <label class="switch-checkbox"> <input id="autobreak" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div>';
    const Combat = Combat_code;
    Visuals_code = '<div class="menu-page" data-id="2"> <h1>Visuals</h1> <p>Customize your visuals, or you can disable it for performance</p> <div class="section"> <h2 class="section-title">Tracers</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Enemies</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="enemyTracersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="enemyTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Teammates</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="teammateTracersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="teammateTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Animal</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="animalTracersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="animalTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Notification</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="notificationTracersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="notificationTracers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Arrows</span> <label class="switch-checkbox"> <input id="arrows" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Markers</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Item Markers</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="itemMarkersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="itemMarkers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Teammates</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="teammateMarkersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="teammateMarkers" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Enemies</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="enemyMarkersColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="enemyMarkers" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Player</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Weapon XP Bar</span> <label class="switch-checkbox"> <input id="weaponXPBar" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Turret Reload Bar</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="playerTurretReloadBarColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="playerTurretReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Weapon Reload Bar</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="weaponReloadBarColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="weaponReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Render HP</span> <label class="switch-checkbox"> <input id="renderHP" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Object</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Turret Reload Bar</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="objectTurretReloadBarColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="objectTurretReloadBar" type="checkbox"> <span></span> </label> </div> </div> <div class="content-option"> <span class="option-title">Item Health Bar</span> <div class="option-content"> <button class="reset-color" title="Reset Color"></button> <input id="itemHealthBarColor" type="color" title="Select Color"> <label class="switch-checkbox"> <input id="itemHealthBar" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Other</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Item counter</span> <label class="switch-checkbox"> <input id="itemCounter" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Render grid</span> <label class="switch-checkbox"> <input id="renderGrid" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Windmill rotation</span> <label class="switch-checkbox"> <input id="windmillRotation" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Entity Danger</span> <label class="switch-checkbox"> <input id="entityDanger" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div>';
    const Visuals = Visuals_code;
    Misc_code = '<div class="menu-page" data-id="3"> <h1>Misc</h1> <p>Customize misc settings, add autochat messages, reset settings</p> <div class="section"> <h2 class="section-title">Other</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Autospawn</span> <label class="switch-checkbox"> <input id="autospawn" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Autoaccept</span> <label class="switch-checkbox"> <input id="autoaccept" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Menu</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Transparency</span> <label class="switch-checkbox"> <input id="menuTransparency" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div>';
    const Misc = Misc_code;
    Devtool_code = '<div class="menu-page" data-id="4"> <h1>Devtool</h1> <p>Settings that are used to test features</p> <div class="section"> <h2 class="section-title">myPlayer</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Display player angle</span> <label class="switch-checkbox"> <input id="displayPlayerAngle" type="checkbox"> <span></span> </label> </div> </div> </div> </div> <div class="section"> <h2 class="section-title">Hitboxes</h2> <div class="section-content split"> <div class="content-split"> <div class="content-option"> <span class="option-title">Projectile hitbox</span> <label class="switch-checkbox"> <input id="projectileHitbox" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Possible shoot target</span> <label class="switch-checkbox"> <input id="possibleShootTarget" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Weapon hitbox</span> <label class="switch-checkbox"> <input id="weaponHitbox" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Collision hitbox</span> <label class="switch-checkbox"> <input id="collisionHitbox" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Placement hitbox</span> <label class="switch-checkbox"> <input id="placementHitbox" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Turret hitbox</span> <label class="switch-checkbox"> <input id="turretHitbox" type="checkbox"> <span></span> </label> </div> <div class="content-option"> <span class="option-title">Possible placement</span> <label class="switch-checkbox"> <input id="possiblePlacement" type="checkbox"> <span></span> </label> </div> </div> </div> </div> </div>';
    const Devtool = Devtool_code;
    Credits_code = '<div class="menu-page" data-id="6"> <h1>Credits</h1> <p>Some details about script and links to my socials</p> <div class="section"> <div class="section-content split"> <div class="content-split"> <div class="content-option text"> <span class="option-title">Author: </span> <span id="author" class="text-value">Murka</span> </div> <div class="content-option text"> <a href="https://discord.gg/cPRFdcZkeD" class="text-value" target="_blank" title="Join my discord server"> <svg class="icon link" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19.303 5.337A17.3 17.3 0 0 0 14.963 4c-.191.329-.403.775-.552 1.125a16.6 16.6 0 0 0-4.808 0C9.454 4.775 9.23 4.329 9.05 4a17 17 0 0 0-4.342 1.337C1.961 9.391 1.218 13.35 1.59 17.255a17.7 17.7 0 0 0 5.318 2.664a13 13 0 0 0 1.136-1.836c-.627-.234-1.22-.52-1.794-.86c.149-.106.297-.223.435-.34c3.46 1.582 7.207 1.582 10.624 0c.149.117.287.234.435.34c-.573.34-1.167.626-1.793.86a13 13 0 0 0 1.135 1.836a17.6 17.6 0 0 0 5.318-2.664c.457-4.52-.722-8.448-3.1-11.918M8.52 14.846c-1.04 0-1.889-.945-1.889-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.888 2.102c0 1.156-.838 2.1-1.889 2.1m6.974 0c-1.04 0-1.89-.945-1.89-2.101s.828-2.102 1.89-2.102c1.05 0 1.91.945 1.889 2.102c0 1.156-.828 2.1-1.89 2.1"/> </svg> </a> <a href="https://github.com/Murka007/Glotus-Client" class="text-value" target="_blank" title="Star a repository"> <svg class="icon link" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg> </a> <a href="https://greasyfork.org/en/users/919633-murka007" class="text-value" target="_blank" title="Write a feedback"> <svg class="icon link" version="1.1" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"> <circle cx="48" cy="48" r="48"/> <clipPath id="a"> <circle cx="48" cy="48" r="47"/> </clipPath> <text clip-path="url(#a)" fill="#fff" font-family="\'DejaVu Sans\', Verdana, Arial, \'Liberation Sans\', sans-serif" font-size="18" letter-spacing="-.75" pointer-events="none" text-anchor="middle" style="-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none"><tspan x="51" y="13" textLength="57">= null;</tspan> <tspan x="56" y="35" textLength="98">function init</tspan> <tspan x="49" y="57" textLength="113">for (var i = 0;</tspan> <tspan x="50" y="79" textLength="105">XmlHttpReq</tspan> <tspan x="48" y="101" textLength="80">appendCh</tspan></text> <path d="m44 29a6.364 6.364 0 0 1 0 9l36 36a3.25 3.25 0 0 1-6.5 6.5l-36-36a6.364 6.364 0 0 1-9 0l-19-19a1.7678 1.7678 0 0 1 0-2.5l13-13a1.7678 1.7678 0 0 1 2.5 0z" stroke="#000" stroke-width="4"/> <path d="m44 29a6.364 6.364 0 0 1 0 9l36 36a3.25 3.25 0 0 1-6.5 6.5l-36-36a6.364 6.364 0 0 1-9 0l-19-19a1.7678 1.7678 0 0 1 2.5-2.5l14 14 4-4-14-14a1.7678 1.7678 0 0 1 2.5-2.5l14 14 4-4-14-14a1.7678 1.7678 0 0 1 2.5-2.5z" fill="#fff"/> </svg> </a> </div> </div> </div> </div> </div>';
    const Credits = Credits_code;
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
                return item.blocker;
            }
            return this.scale;
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
                    rendering_Renderer.line(ctx, pos, pos.direction(myClient.myPlayer.angle, 70), "#e9adf0");
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
                limit: this.isSandbox ? "sandboxLimit" in item ? item.sandboxLimit : 99 : item.limit
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
                    span.textContent = `${count}/${limit}`;
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
                item.textContent = `${count}/${limit}`;
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
        handleEnter(event) {
            if (UI_UI.isMenuOpened) {
                return;
            }
            const {allianceInput, allianceButton} = this.getElements();
            const active = document.activeElement;
            if (myClient.myPlayer.inGame) {
                if (active === allianceInput) {
                    allianceButton.click();
                } else {
                    this.toggleChat(event);
                }
                return;
            }
            this.spawn();
        }
        toggleChat(event) {
            const {chatHolder, chatBox} = this.getElements();
            this.closePopups(chatHolder);
            if (this.isOpened(chatHolder)) {
                event.preventDefault();
                chatBox.focus();
            } else {
                chatBox.blur();
            }
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
            Hook.prepend("LockRotationClient", /return \w+\?\(\!/, `return Glotus.myClient.ModuleHandler.mouse.angle;`);
            Hook.replace("DisableResetMoveDir", /\w+=\{\},\w+\.send\("\w+"\)/, "");
            Hook.append("offset", /\W170\W.+?(\w+)=\w+\-\w+\/2.+?(\w+)=\w+\-\w+\/2;/, `Glotus.myClient.myPlayer.offset.setXY($1,$2);`);
            Hook.prepend("renderEntity", /\w+\.health>NUM{0}.+?(\w+)\.fillStyle=(\w+)==(\w+)/, `;Glotus.hooks.EntityRenderer.render($1,$2,$3);false&&`);
            Hook.append("renderItemPush", /,(\w+)\.blocker,\w+.+?2\)\)/, `,Glotus.Renderer.objects.push($1)`);
            Hook.append("renderItem", /70, 0.35\)",(\w+).+?\w+\)/, `,Glotus.hooks.ObjectRenderer.render($1)`);
            Hook.append("RemoveSendAngle", /clientSendRate\)/, `&&false`);
            Hook.replace("handleEquip", /\w+\.send\("\w+",0,(\w+),(\w+)\)/, `Glotus.myClient.ModuleHandler.equip($2,$1,true)`);
            Hook.replace("handleBuy", /\w+\.send\("\w+",1,(\w+),(\w+)\)/, `Glotus.myClient.ModuleHandler.buy($2,$1,true)`);
            Hook.prepend("RemovePingCall", /\w+&&clearTimeout/, "return;");
            Hook.append("RemovePingState", /let \w+=-1;function \w+\(\)\{/, "return;");
            Hook.prepend("preRender", /(\w+)\.lineWidth=NUM{4},/, `Glotus.hooks.ObjectRenderer.preRender($1);`);
            Hook.replace("RenderGrid", /("#91b2db".+?)(for.+?)(\w+\.stroke)/, "$1if(Glotus.settings.renderGrid){$2}$3");
            Hook.replace("upgradeItem", /(upgradeItem.+?onclick.+?)\w+\.send\("\w+",(\w+)\)\}/, "$1Glotus.myClient.ModuleHandler.upgradeItem($2)}");
            const data = Hook.match("DeathMarker", /99999.+?(\w+)=\{x:(\w+)/);
            Hook.append("playerDied", /NUM{99999};function \w+\(\)\{/, `if(Glotus.myClient.myPlayer.handleDeath()){${data[1]}={x:${data[2]}.x,y:${data[2]}.y};return};`);
            Hook.append("updateNotificationRemove", /\w+=\[\],\w+=\[\];function \w+\(\w+,\w+\)\{/, `return;`);
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
        UI_UI.createMenu();
        UI_GameUI.init();
        UI_StoreHandler.init();
    }));
    window.addEventListener("load", (() => {
        UI_GameUI.load();
    }));
    window.addEventListener("keydown", (event => myClient.ModuleHandler.handleKeydown(event)), false);
    window.addEventListener("keyup", (event => myClient.ModuleHandler.handleKeyup(event)), false);
})();