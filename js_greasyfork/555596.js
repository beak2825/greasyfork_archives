// ==UserScript==
// @name         MineFun Korean
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Simple cheat for MineFun.io
// @author       korean0126
// @match        https://minefun.io/*
// @match        https://*.minefun.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minefun.io
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/555596/MineFun%20Korean.user.js
// @updateURL https://update.greasyfork.org/scripts/555596/MineFun%20Korean.meta.js
// ==/UserScript==
 
const { log, warn, error, debug } = window.console;
 
const packetsOut = {
    TIME_STEP_INFO: 1,
    TIME_STEP: 2,
    DEATH: 3,
    REQUEST_RESPAWN: 4,
    PLAY_EMOTION: 5,
    PING: 7,
    PLACE_BLOCKS: 8,
    CHAT: 9,
    GET_PLAYERS: 10,
    CONVERT_MINEBUCKS: 11,
    FREE_AD: 12,
    HIT: 13,
    PASTE_CHUNK_BLOCKS: 22,
    FILL_AREA_WITH_BLOCKS: 23,
    PICKUP_DROP_ITEM: 24,
    SKIN_CHANGED: 25,
    USE_FOOD: 26,
    GOT_DAMAGE: 27,
    THROW_DYNAMITE: 28,
    THROW_PROJECTILE: 29,
    UPDATE_SIGN_TEXT: 30,
    SIGN_INPUT_REQUEST: 31,
    MODIFIERS_AMOUNT_TO_REQUEST: 500,
    GET_CHUNKS_MODIFIERS: 501,
    GET_ITEM_WITH_CREATE: 502,
    SHOOT: 515,
    SHOOTER_CHANGE_WEAPON: 516,
    OPEN_LOOTBOX: 517,
    TRY_TO_USE_TNT: 520,
    USE_HAND_ITEM: 521,
    SET_CURRENT_ACTIVE_SLOT: 504,
    REPLACE_ITEMS_IN_BLOCK: 505,
    REPLACE_ITEMS: 506,
    MOVE_ITEMS_IN_BLOCK: 507,
    MOVE_ITEMS: 508,
    THROW_OUT_ITEM: 509,
    GET_BLOCK_VIA_WHEEL: 510,
    CHANGE_BLOCK_OPEN_STATE: 511,
    EXIT_FROM_STORAGE_BLOCK: 518,
    INST_DRAG_ITEM_TO_ARMOR: 519,
    OPEN_ITEM: 220,
    CRAFT: 221,
    START_TICKER: 222,
    ADD_PLAYER_TO_PRIVATE: 512,
    REMOVE_PLAYER_FROM_PRIVATE: 513,
    GET_PLAYER_PRIVATE_MEMBERS: 514,
    CREATE_PREFAB: 1101,
    DELETE_PREFAB: 1102,
    GET_PREFAB: 1103,
    GET_PREFABS: 1104,
    INSERT_PREFAB: 1105,
    ERASE_AREA: 1106,
    PUBLISH_PREFAB: 1107,
    HNS_ATTACK_BLOCK: 1200,
    HNS_PLAYER_LEFT_HIDED_STATE: 1201,
    CHOOSED_BLOCK: 1202,
    HNS_CHANGE_DOOR_STATE: 1203,
    HNS_GET_FREE_KIT: 1204,
    INFECTION_GET_WEAPON: 1300,
    INFECTION_SELECT_ZOMBIE: 1301,
    WAR_GET_WEAPON: 1400,
    SKY_WARS_SET_KIT: 1500,
    SKY_WARS_GET_FREE_KIT: 1501,
    ONE_BLOCK_PORTAL_REQUEST: 1550,
    ONE_BLOCK_GO_HOME: 1551
};
const packetsIn = {
    PLAYER_IN_CHUNK_RANGE: 1,
    PLAYER_OUT_OF_CHUNK_RANGE: 2,
    TIME_STEP: 3,
    UPD_SERVER_TIME: 4,
    PLAYERS_TIME_STEP_INFO: 5,
    PLAYER_DEAD: 6,
    PLAYER_RESPAWNED: 7,
    PLAYER_LEFT: 8,
    PLAY_PLAYER_EMOTION: 9,
    INIT_DATA: 10,
    CHANGE_PLAYER_SKIN: 11,
    PONG: 12,
    UPD_GAME_TIMER: 13,
    GAME_END: 14,
    ALERT: 16,
    CHAT_ALERT: 17,
    CONSOLE_LOG: 18,
    PLAYER_CURRENT_ITEM: 19,
    CHAT: 20,
    GET_PLAYERS: 21,
    UPDATE_SKIN: 22,
    UPDATE_PLAYER_SKIN: 23,
    SET_HEALTH: 24,
    SET_HUNGER: 25,
    PLAYER_FOOTSTEPS_HERABLE: 26,
    TNT_WAS_ACTIVATED: 27,
    TNT_EXPLODED: 28,
    UPD_TICKING_ENTITY_TRANSFORMS: 29,
    DYNAMITE_WAS_THROWN: 30,
    DYNAMITE_EXPLODED: 31,
    DEV_SPAWN_SMALL_CUBE_ON_XYZ: 32,
    PROJECTILE_WAS_THROWN: 33,
    PROJECTILE_COLLIDED: 34,
    SIGN_INPUT_REQUEST: 35,
    SIGN_CHANGE_TEXT: 36,
    CORRECT_POSITION: 37,
    INVENTORY: 501,
    UPDATE_ARMOR: 525,
    UPDATE_PLAYER_ARMOR: 526,
    INSIDE_ITEM_DATA: 527,
    CLOSE_ALL_MODALS: 528,
    UPDATE_DRAG_AND_OPENED_BLOCK: 529,
    BLOCK_STATE: 530,
    INIT_INFO: 502,
    UPDATE_NEAREST_CHUNKS: 503,
    ALL_MODIFIERS_SENT: 504,
    CHUNK_MODIFIERS: 505,
    BLOCKS_TO_SET_BY_COORDS: 506,
    ERASE_BLOCKS: 508,
    SET_BLOCKS_BY_BLOCKS_OFFSETS: 509,
    PRIVATE_MEMBERS_DATA: 510,
    SHOOTER_SHOOT: 511,
    GOT_DAMAGE: 512,
    UPDATE_BALANCE: 513,
    UPD_STARTING_TIME: 522,
    YOU_DEAD: 523,
    PLAYER_GOT_DAMAGE: 524,
    SET_POS: 531,
    SET_ROT: 532,
    LOOTBOX_DATA: 514,
    SHOOTER_CHANGE_PLAYER_WEAPON: 515,
    ADD_DROP_ITEMS: 516,
    UPDATE_DROP_ITEMS: 517,
    DELETE_DROP_ITEMS: 518,
    DELETE_DROP_ITEM_BY_PICKUP: 519,
    FAILED_DROP_ITEM_PICKUP_ATTEMPT: 520,
    CREATIVE_PLOT_MARKER: 1100,
    PREFABS: 1101,
    PREFAB: 1102,
    HNS_PLAYER_HIDED: 1200,
    HNS_HUNTERS_AND_HIDERS: 1204,
    HNS_YOU_ARE_HIDER: 1205,
    HNS_PLAYER_LEFT_HIDED_STATE: 1207,
    HNS_LOCATE_HIDERS: 1208,
    HNS_PLAYER_WAS_ATTACKED: 1209,
    HNS_YOU_ARE_HUNTER: 1210,
    HNS_CHANGE_PLAYER_TO_HUNTER: 1211,
    HNS_UPD_HUNTERS_AND_HIDERS_AMOUNT: 1212,
    HNS_KILL_INFO: 1213,
    HNS_SHOW_BLOCKS_CHOICE_OPTIONS: 1214,
    HNS_CHANGE_PLAYER_BLOCK_ID: 1219,
    HNS_SET_LOCAL_PLAYER_BLOCK_ID: 1220,
    HNS_YOU_WAS_ATTACKED: 1221,
    HNS_HUNTERS_UNLOCKED: 1222,
    HNS_ADD_PHYSICS_IMPULSE: 1223,
    HNS_YOU_CANT_HIDE_HERE: 1225,
    WAR_PLAYER_DEATH: 1300,
    WAR_HURTED_PLAYER: 1301,
    WAR_YOU_KILLED_PLAYER: 1302,
    WAR_YOU_RESPAWNED: 1303,
    INFECTION_ZOMBIES_AND_SHOOTERS: 1350,
    INFECTION_YOU_TURN_TO_ZOMBIE: 1351,
    INFECTION_PLAYER_TURNED_TO_ZOMBIE: 1352,
    INFECTION_UPD_ZOMBIES_AND_SHOOTERS_AMOUNT: 1354,
    INFECTION_YOU_RESPAWNED: 1356,
    INFECTION_HURTED_PLAYER: 1357,
    INFECTION_YOU_KILLED_PLAYER: 1358,
    INFECTION_DEATH_INFO: 1359,
    INFECTION_SHOOTER_WAS_ATTACKED: 1360,
    INFECTION_SET_WEAPON: 1361,
    INFECTION_SET_ZOMBIE_TYPE: 1362,
    INFECTION_UPDATE_HP: 1363,
    SKY_WARS_GAME_STARTED: 1400,
    SKY_WARS_NICKNAMES_DEPTH_TEST_FALSE: 1401,
    SKY_WARS_CHANGE_PLAYER_AVATAR: 1402,
    SKY_WARS_BOARD_PLACE: 1403,
    SKY_WARS_UPD_KILL_DEATH_BAR: 1404,
    ONE_BLOCK_PORTAL_REQUEST_REJECTED: 1450,
    ONE_BLOCK_DEATH: 1451,
    ONE_BLOCK_BLOCKS_DESTROYED: 1452,
    ONE_BLOCK_NEW_PHASE: 1453,
    ONE_BLOCK_LEADERBOARD: 1454
};
 
const invertedPacketsIn = Object.fromEntries(Object.entries(packetsIn).map(([key, value]) => [value, key]));
const invertedPacketsOut = Object.fromEntries(Object.entries(packetsOut).map(([key, value]) => [value, key]));
 
const _assign = Object.assign;
const _create = Object.create;
const _defineProperty = Object.defineProperty;
const _parse = JSON.parse;
 
Object.create = function create() {
    if (!arguments[0]) return {};
    return _create.apply(this, arguments);
};
 
Object.defineProperty = function defineProperty() {
    const ret = _defineProperty.apply(this, arguments);
    if (arguments[1] === 'player') {
        window.hooked = ret;
    }
    return ret;
};
 
Object.defineProperty(Object.prototype, 'player', {
    get() {
        return this.__player;
    },
    set(v) {
        this.__player = v;
    }
});
 
let cheatInterval;
function cheatingIsFun() {
    if (cheatInterval) {
        clearInterval(cheatInterval);
        cheatInterval = false;
        return;
    }
 
    cheatInterval = setInterval(() => {
        // ESP
        try {
            window.hooked.gameWorld.server.players.forEach((plr) => {
                plr.playerMaterial.depthTest = false;
                if (plr.isHided) plr.model.visible = true;
            });
        } catch {}
 
        // No Fog
        try {
            if (window?.hooked?.gameWorld?.threeScene?.scene?.fog) {
                _assign(
                    window.hooked.gameWorld.threeScene.scene.fog,
                    {
                        near: 9999,
                        far: 10000
                    }
                );
            }
        } catch {}
 
        // Crouch Speed, anti slip (for ice)
        try {
            _assign(window.hooked.player.velocity, {
                crouchSpeedMultiplier: 1,
            });
            _defineProperty(window.hooked.player.velocity, 'slipperiness', {
                get() {
                    return 1;
                },
                set(v) {}
            });
        } catch {}
 
        try {
            const weaponMod = {
                // OP Weapons config
                isAuto: true,
                firerateMs: 50,
                lastShootFirerateMs: 50,
 
                timeToScopeSec: 0.01,
                reloadTimeMs: 1,
                currAmmo: 30,
                distance: 9999,
 
                recoilDecayRatio: 999,
                recoilMax: 0.000001,
                maxCrouchSpread: 0.000001,
                maxStandSpread: 0.000001,
 
                maxJumpInaccuracy: 0.000001,
                maxMoveInaccuracy: 0.000001,
 
                knifeLongAttackDelayMs: 10,
                knifeLongAttackFirerateMs: 15,
                recoilAttackX: 0.0001,
                recoilAttackY: 0.0001,
                secondAttackDistance: 9999,
                swapTimeMs: 1
            };
 
            window.hooked.gameWorld.systemsManager.activeSystems.forEach(
                (system) => {
                    // Reach
                    if (system?.far) system.far = 9999;
 
                    // Weapon mods
                    if (system?.playerShooter?.currPlayerWeapon) {
                        _assign(
                            system.playerShooter.currPlayerWeapon,
                            weaponMod
                        );
                    }
                    if (system?.playerShooter?.currPlayerWeaponSpec) {
                        _assign(
                            system.playerShooter.currPlayerWeaponSpec,
                            weaponMod
                        );
                    }
                    if (
                        system?.playerShooter?.currPlayerWeaponSpec
                        ?.bulletsQueue
                    ) {
                        _assign(
                            system.playerShooter.currPlayerWeaponSpec
                            .bulletsQueue,
                            {
                                queueStepMs: 10
                            }
                        );
                    }
                    if (system?.playerShooter) {
                        _defineProperty(system, 'cooldownRemainderMs', {
                            get() {
                                return 10;
                            },
                            set(v) {}
                        });
                        _defineProperty(system, 'shootPressedDelayer', {
                            get() {
                                return 1;
                            },
                            set(v) {}
                        });
                    }
                }
            );
        } catch {}
 
        try {
            if (typeof window.hooked.gameWorld.server.msgsToSend?._push !== 'function') {
                window.hooked.gameWorld.server.msgsToSend._push = window.hooked.gameWorld.server.msgsToSend.push;
                window.hooked.gameWorld.server.msgsToSend.push = function () {
                    if (arguments[0] === packetsOut.HIT && Array.isArray(arguments[1])) {
                        for (let i = 0; i < 15; i++) this._push.apply(this, arguments);
                    }
                    if (arguments[0] === packetsOut.HNS_ATTACK_BLOCK && Array.isArray(arguments[1])) {
                        for (let i = 0; i < 5; i++) this._push.apply(this, arguments);
                    }
 
 
                    return this._push.apply(this, arguments);
                }
            }
        } catch {}
 
 
        try {
            let system = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x?.infinityBlocks !== undefined);
            if (system) _defineProperty(system, 'instantBlockBreaking', {
                get() { return true },
                set(v) {}
            });
        } catch {}
 
        try {
            // Adel you're going to have to try a LOT harder than this if you want to stop me LOL
            let posCorrection = Object.entries(window.hooked.gameWorld.server.msgsListeners).find(([k,v]) => v.toString().includes('=this.player.physicsPosComp'));
            if (posCorrection) delete window.hooked.gameWorld.server.msgsListeners[posCorrection[0]];
        } catch {}
    }, 100);
}
 
setTimeout(() => {
    cheatingIsFun();
    keybindsLoop();
}, 8000);
 
/* Teleportation Stuff */
function tp(x = 0, y = 0, z = 0, relative = true) {
    try {
        let position = window.hooked.gameWorld.player.position;
        if (relative) {
            position.x += x;
            position.y += y;
            position.z += z;
        } else {
            _assign(position, { x, y, z });
        }
        window.hooked.gameWorld.player.physicsPosComp.copyPos(position)
    } catch {}
}
 
function tpToSelectedBlock() {
    try {
        let outlineSystem = window.hooked.gameWorld.systemsManager.activeSystems.find(x => x.currBlockPos);
        if (!outlineSystem) return;
        outlineSystem.intersectAndShow(true, 500);
        if (!outlineSystem.currBlockPos) return;
        let { x, y, z } = outlineSystem.currBlockPos;
        tp(x, y + 1, z, false);
    } catch {}
}
 
/* LOL */
function hitAll() {
    try {
        window.hooked.gameWorld.server.players.forEach(plr => {
            const { x, y, z } = plr.model.position;
 
            if (plr.hasOwnProperty('isBlock')) { // HNS
                if (plr.isHunter) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HNS_ATTACK_BLOCK, [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, window.hooked.gameWorld.time.localServerTimeMs, plr.sessionId]);
            } if (plr.hasOwnProperty('isZombie')) { // Infection
                if (plr.isZombie) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            } else { // Other
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            }
        });
    } catch {}
}
 
function removeFloor() {
    try {
        window.hooked.gameWorld.server.players.forEach(plr => {
            if (!plr.isAlive) return;
 
            let { x, y, z } = plr.model.position;
            x = Math.round(x);
            y = Math.round(y - 1);
            z = Math.round(z);
 
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z-1}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z-1}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z-1}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x-1},${y},${z+1}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x},${y},${z+1}`, 0]);
            window.hooked.gameWorld.server.sendData(packetsOut.PLACE_BLOCKS, [+x.toFixed(3), +y.toFixed(3), +z.toFixed(3), 1, `${x+1},${y},${z+1}`, 0]);
        });
    } catch {}
}
 
/* Keystokes Stuff */
function allowBinds() {
    if (!document) return false;
    return (
        document?.pointerLockElement &&
        document?.activeElement?.tagName !== 'INPUT'
    );
}
 
const pressedKeys = {
    allowBackquote: true,
    allowPeriod: true,
    allowComma: true
};
 
function unlockKey(code) {
    pressedKeys[`allow${code}`] = true;
}
 
window.addEventListener('keydown', (event) => {
    pressedKeys[event.code] = true;
});
 
// Event listener for when a key is released
window.addEventListener('keyup', (event) => {
    pressedKeys[event.code] = false;
});
 
function keybindsLoop() {
    if (allowBinds()) {
        if (pressedKeys['Space']) {
            if (window?.hooked?.gameWorld?.player?.velocity?.velVec3) {
                try {
                    let { x, y, z } = window.hooked.gameWorld.player.velocity.velVec3;
                    window.hooked.gameWorld.player.velocity.velVec3.set(x, 8, z);
                } catch {}
            }
        }
        if (pressedKeys['Backquote'] && pressedKeys.allowBackquote) {
            if (window?.hooked?.gameWorld?.player?.velocity?.velVec3) {
                pressedKeys.allowBackquote = false;
                setTimeout(unlockKey.bind(this, ['Backquote']), 400);
                tpToSelectedBlock();
            }
        }
        if (pressedKeys['Period'] && pressedKeys.allowPeriod) {
            if (window?.hooked?.gameWorld) {
                pressedKeys.allowPeriod = false;
                setTimeout(unlockKey.bind(this, ['Period']), 250);
                hitAll();
            }
        }
        if (pressedKeys['Comma'] && pressedKeys.allowComma) {
            if (window?.hooked?.gameWorld?.server?.sendData) {
                pressedKeys.allowComma = false;
                setTimeout(unlockKey.bind(this, ['Comma']), 200);
                removeFloor();
            }
        }
    }
    requestAnimationFrame(keybindsLoop);
}
 
/* POKI SDK Stuff */
function skipRewardedBreak() {
    return new Promise((resolve) => {
        resolve(true);
    });
}
 
Object.defineProperties(Object.prototype, {
    rewardedBreak: {
        get() {
            return skipRewardedBreak.bind(this);
        },
        set() {},
        enumerable: false
    },
    gameanalytics: {
        get() {
            return {
                GameAnalytics: {
                    addAdEvent: () => {}
                },
                EGAErrorSeverity: {
                    0: 'Undefined',
                    1: 'Debug',
                    2: 'Info',
                    3: 'Warning',
                    4: 'Error',
                    5: 'Critical',
                    Undefined: 0,
                    Debug: 1,
                    Info: 2,
                    Warning: 3,
                    Error: 4,
                    Critical: 5
                },
                EGAProgressionStatus: {
                    0: 'Undefined',
                    1: 'Start',
                    2: 'Complete',
                    3: 'Fail',
                    Undefined: 0,
                    Start: 1,
                    Complete: 2,
                    Fail: 3
                },
                EGAResourceFlowType: {
                    0: 'Undefined',
                    1: 'Source',
                    2: 'Sink',
                    Undefined: 0,
                    Source: 1,
                    Sink: 2
                },
                EGAAdAction: {
                    0: 'Undefined',
                    1: 'Clicked',
                    2: 'Show',
                    3: 'FailedShow',
                    4: 'RewardReceived',
                    Undefined: 0,
                    Clicked: 1,
                    Show: 2,
                    FailedShow: 3,
                    RewardReceived: 4
                },
                EGAAdError: {
                    0: 'Undefined',
                    1: 'Unknown',
                    2: 'Offline',
                    3: 'NoFill',
                    4: 'InternalError',
                    5: 'InvalidRequest',
                    6: 'UnableToPrecache',
                    Undefined: 0,
                    Unknown: 1,
                    Offline: 2,
                    NoFill: 3,
                    InternalError: 4,
                    InvalidRequest: 5,
                    UnableToPrecache: 6
                },
                EGAAdType: {
                    0: 'Undefined',
                    1: 'Video',
                    2: 'RewardedVideo',
                    3: 'Playable',
                    4: 'Interstitial',
                    5: 'OfferWall',
                    6: 'Banner',
                    Undefined: 0,
                    Video: 1,
                    RewardedVideo: 2,
                    Playable: 3,
                    Interstitial: 4,
                    OfferWall: 5,
                    Banner: 6
                },
                http: {
                    EGAHTTPApiResponse: {
                        0: 'NoResponse',
                        1: 'BadResponse',
                        2: 'RequestTimeout',
                        3: 'JsonEncodeFailed',
                        4: 'JsonDecodeFailed',
                        5: 'InternalServerError',
                        6: 'BadRequest',
                        7: 'Unauthorized',
                        8: 'UnknownResponseCode',
                        9: 'Ok',
                        10: 'Created',
                        NoResponse: 0,
                        BadResponse: 1,
                        RequestTimeout: 2,
                        JsonEncodeFailed: 3,
                        JsonDecodeFailed: 4,
                        InternalServerError: 5,
                        BadRequest: 6,
                        Unauthorized: 7,
                        UnknownResponseCode: 8,
                        Ok: 9,
                        Created: 10
                    }
                },
                events: {
                    EGASdkErrorCategory: {
                        0: 'Undefined',
                        1: 'EventValidation',
                        2: 'Database',
                        3: 'Init',
                        4: 'Http',
                        5: 'Json',
                        Undefined: 0,
                        EventValidation: 1,
                        Database: 2,
                        Init: 3,
                        Http: 4,
                        Json: 5
                    },
                    EGASdkErrorArea: {
                        0: 'Undefined',
                        1: 'BusinessEvent',
                        2: 'ResourceEvent',
                        3: 'ProgressionEvent',
                        4: 'DesignEvent',
                        5: 'ErrorEvent',
                        9: 'InitHttp',
                        10: 'EventsHttp',
                        11: 'ProcessEvents',
                        12: 'AddEventsToStore',
                        20: 'AdEvent',
                        Undefined: 0,
                        BusinessEvent: 1,
                        ResourceEvent: 2,
                        ProgressionEvent: 3,
                        DesignEvent: 4,
                        ErrorEvent: 5,
                        InitHttp: 9,
                        EventsHttp: 10,
                        ProcessEvents: 11,
                        AddEventsToStore: 12,
                        AdEvent: 20
                    },
                    EGASdkErrorAction: {
                        0: 'Undefined',
                        1: 'InvalidCurrency',
                        2: 'InvalidShortString',
                        3: 'InvalidEventPartLength',
                        4: 'InvalidEventPartCharacters',
                        5: 'InvalidStore',
                        6: 'InvalidFlowType',
                        7: 'StringEmptyOrNull',
                        8: 'NotFoundInAvailableCurrencies',
                        9: 'InvalidAmount',
                        10: 'NotFoundInAvailableItemTypes',
                        11: 'WrongProgressionOrder',
                        12: 'InvalidEventIdLength',
                        13: 'InvalidEventIdCharacters',
                        15: 'InvalidProgressionStatus',
                        16: 'InvalidSeverity',
                        17: 'InvalidLongString',
                        18: 'DatabaseTooLarge',
                        19: 'DatabaseOpenOrCreate',
                        25: 'JsonError',
                        29: 'FailHttpJsonDecode',
                        30: 'FailHttpJsonEncode',
                        31: 'InvalidAdAction',
                        32: 'InvalidAdType',
                        33: 'InvalidString',
                        Undefined: 0,
                        InvalidCurrency: 1,
                        InvalidShortString: 2,
                        InvalidEventPartLength: 3,
                        InvalidEventPartCharacters: 4,
                        InvalidStore: 5,
                        InvalidFlowType: 6,
                        StringEmptyOrNull: 7,
                        NotFoundInAvailableCurrencies: 8,
                        InvalidAmount: 9,
                        NotFoundInAvailableItemTypes: 10,
                        WrongProgressionOrder: 11,
                        InvalidEventIdLength: 12,
                        InvalidEventIdCharacters: 13,
                        InvalidProgressionStatus: 15,
                        InvalidSeverity: 16,
                        InvalidLongString: 17,
                        DatabaseTooLarge: 18,
                        DatabaseOpenOrCreate: 19,
                        JsonError: 25,
                        FailHttpJsonDecode: 29,
                        FailHttpJsonEncode: 30,
                        InvalidAdAction: 31,
                        InvalidAdType: 32,
                        InvalidString: 33
                    },
                    EGASdkErrorParameter: {
                        0: 'Undefined',
                        1: 'Currency',
                        2: 'CartType',
                        3: 'ItemType',
                        4: 'ItemId',
                        5: 'Store',
                        6: 'FlowType',
                        7: 'Amount',
                        8: 'Progression01',
                        9: 'Progression02',
                        10: 'Progression03',
                        11: 'EventId',
                        12: 'ProgressionStatus',
                        13: 'Severity',
                        14: 'Message',
                        15: 'AdAction',
                        16: 'AdType',
                        17: 'AdSdkName',
                        18: 'AdPlacement',
                        Undefined: 0,
                        Currency: 1,
                        CartType: 2,
                        ItemType: 3,
                        ItemId: 4,
                        Store: 5,
                        FlowType: 6,
                        Amount: 7,
                        Progression01: 8,
                        Progression02: 9,
                        Progression03: 10,
                        EventId: 11,
                        ProgressionStatus: 12,
                        Severity: 13,
                        Message: 14,
                        AdAction: 15,
                        AdType: 16,
                        AdSdkName: 17,
                        AdPlacement: 18
                    }
                },
                logging: {},
                utilities: {},
                validators: {},
                device: {},
                threading: {},
                store: {
                    EGAStoreArgsOperator: {
                        0: 'Equal',
                        1: 'LessOrEqual',
                        2: 'NotEqual',
                        Equal: 0,
                        LessOrEqual: 1,
                        NotEqual: 2
                    },
                    EGAStore: {
                        0: 'Events',
                        1: 'Sessions',
                        2: 'Progression',
                        Events: 0,
                        Sessions: 1,
                        Progression: 2
                    }
                },
                state: {},
                tasks: {}
            };
        },
        set(v) {},
        enumerable: false
    }
});
 
console.warn = function (...m) {
    if (m[0] && String(m[0]).includes('GameAnalytics')) {
        return;
    }
    return warn.apply(this, arguments);
};