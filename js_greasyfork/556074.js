// ==UserScript==
// @name         AWBW Essentials - Beta 0.1.3
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  [Client Side] Adds some general Essentials in the game.
// @author       Vesper
// @match        https://awbw.amarriner.com/prevmaps.php*
// @match        https://awbw.amarriner.com/editmap.php*
// @icon         https://awbw.amarriner.com/terrain/target_icon2.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556074/AWBW%20Essentials%20-%20Beta%20013.user.js
// @updateURL https://update.greasyfork.org/scripts/556074/AWBW%20Essentials%20-%20Beta%20013.meta.js
// ==/UserScript==
debugger;

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
function loadImage(e) {
    return new Promise(((t, n) => {
        const i = new Image;
        i.onload = () => {
            t(i)
        }, i.onerror = e => {
            n(e)
        }, i.src = e
    }))
}

const CountryColor = {
    os: "#e25e41",
    bm: "#446eff",
    ge: "#3ec22b",
    yc: "#c5b800",
    bh: "#837c76",
    rf: "#b52643",
    gs: "#717370",
    bd: "#9a5330",
    ab: "#fca339",
    js: "#a6b696",
    ci: "#3f61c7",
    pc: "#fe68cf",
    tg: "#3acfc1",
    pl: "#a744d3",
    ar: "#5f7c0c",
    wn: "#bb534f",
    aa: "#5ed6eb",
    ne: "#574a4a",
    sc: "#89a8bc",
}
window.CountryColor = CountryColor
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function injectStyle(id = '', cssText) {
    if (id && document.getElementById(id)) return; // Prevent duplicates if ID is given

    const style = document.createElement('style');
    if (id) style.id = id;
    style.textContent = cssText;
    document.head.appendChild(style);
}

function calculateDamage(matchupMult = 1, terrainStars = 0, atkBoost = 0, defBoost = 0, atkHP = 100, defHP = 100) {
    return Math.floor((100.0 * (matchupMult / 100.0) * (atkHP / 100.0) * (1 + atkBoost)) * (1.0 - (defBoost) - (terrainStars * 0.1 * (defHP / 100.0))));
}

// Tank vs Infantry
// console.log(calculateDamage(75));
// console.log(calculateDamage(75, 1));
// console.log(calculateDamage(75, 2));
// console.log(calculateDamage(75, 3));

const BaseDamages = {
    "Infantry": {
        "Infantry": 55,
        "Artillery": 15,
        "Recon": 12,
        "Tank": 5,
        "Anti-Air": 5,
    },
    "Artillery": {
        "Infantry": 90,
        "Artillery": 75,
        "Recon": 75,
        "Tank": 70,
        "Anti-Air": 75,
    },
    "Tank": {
        "Infantry": 75,
        "Artillery": 70,
        "Recon": 85,
        "Tank": 55,
        "Anti-Air": 65,
    },
    "Anti-Air": {
        "Infantry": 105,
        "Artillery": 50,
        "Recon": 60,
        "Tank": 25,
        "Anti-Air": 45,
    },
    "B-Copter": {
        "Infantry": 75,
        "Artillery": 65,
        "Recon": 55,
        "Tank": 55,
        "Anti-Air": 25,
    },
}
const ToKO = [
    "Infantry",
    "Artillery",
    "Tank",
]
const Combos = [
    ["Infantry", "Infantry"],
    ["Tank"],
    ["Tank", "Infantry"],
    ["Tank", "Tank"],
    ["Artillery"],
    ["Artillery", "Infantry"],
    ["Anti-Air"],
    ["B-Copter"],
    ["B-Copter", "B-Copter"],
]
const TerrainChart = {
    "Road": {
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4T2PMaOj4z0ABYJyxYAfZBvz4wMDAuGHHAbINADmcchdQ7IVhYoCFhQBGSjhxAhhHUIBLHhyNoDCg2AByEyLcBUPcgAHNC6CwAwA+81HRiyyz+wAAAABJRU5ErkJggg==",
        "stars": 0,
    },
    "Plains": {
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAArUlEQVQ4T6VTMRKAIAyDzdHR0Sf4/8lnODoyOrrplbtwIVdEzy54pS1JGuO6L1f4EXFL85XOMUzDEey0ePONNyMjsEYLb6Dm8UhGgGlAABStPNdVCLixhwKICgI04IJ1ZWqqd0YAPnwy/FbeagoFLdKNKIpKRC5mCr2hFQLlzErjzvNH0cBbmW7FG/ToxBZvzrs+UA+wvZlG1oD/ha82LiKqD3qOdK2sCrfQqD9uMz3wARk5/0YAAAAASUVORK5CYII=",
        "stars": 1,
    },
    "Forest": {
        "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBklEQVQ4T4WTIRrCMAyFMzeJnOQIHGHHQVYiK5GTHIMjTHIEJLJycm7w8vH2vYYBNWuT9OVPljbj47CYrDxkyymr6ee+uZf9Uuadde1kx/NgbV9sHrtVBHb4sXRP1UYJkJ0Cl1OqLkIcZBTh1wmgxuxUBgVE1EcbieBbCZgdxunWWTubCyBYyUiBOPicIGZXEexRlpJpk51As/OyX3xRqEAk8xL6dF00AzMxmD6cubS8DwEGxuxRmGVsloBgdDySRQqIuACHaGV8b76Vxv64gE4i/29sqjZWk6DMahLhVJp/BP4XlIDDwTEFydYcwFY1Mc43SShIIZz1jTgBH1N8dZGGovFlPgFhHuohBVFNIAAAAABJRU5ErkJggg==",
        "stars": 2,
    },
    "City": {
        "image": "terrain/ani/neutralcity.gif",
        "stars": 3,
    },
}

var BaseInfo = {};
BaseInfo.units = {
    1: {
        name: "Infantry",
        cost: 1e3,
        move_points: 3,
        move_type: "F",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    2: {
        name: "Mech",
        cost: 3e3,
        move_points: 2,
        move_type: "B",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    3: {
        name: "Md.Tank",
        cost: 16e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 8,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    4: {
        name: "Tank",
        cost: 7e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    5: {
        name: "Recon",
        cost: 4e3,
        move_points: 8,
        move_type: "W",
        fuel: 80,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    6: {
        name: "APC",
        cost: 5e3,
        move_points: 6,
        move_type: "T",
        fuel: 70,
        fuel_per_turn: 0,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    7: {
        name: "Artillery",
        cost: 6e3,
        move_points: 5,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 3,
        second_weapon: "N"
    },
    8: {
        name: "Rocket",
        cost: 15e3,
        move_points: 5,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    9: {
        name: "Anti-Air",
        cost: 8e3,
        move_points: 6,
        move_type: "T",
        fuel: 60,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    10: {
        name: "Missile",
        cost: 12e3,
        move_points: 4,
        move_type: "W",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 6,
        short_range: 3,
        long_range: 5,
        second_weapon: "N"
    },
    11: {
        name: "Fighter",
        cost: 2e4,
        move_points: 9,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    12: {
        name: "Bomber",
        cost: 22e3,
        move_points: 7,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 5,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    13: {
        name: "B-Copter",
        cost: 9e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    14: {
        name: "T-Copter",
        cost: 5e3,
        move_points: 6,
        move_type: "A",
        fuel: 99,
        fuel_per_turn: 2,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    15: {
        name: "Battleship",
        cost: 28e3,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 2,
        long_range: 6,
        second_weapon: "N"
    },
    16: {
        name: "Cruiser",
        cost: 18e3,
        move_points: 6,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    17: {
        name: "Lander",
        cost: 12e3,
        move_points: 6,
        move_type: "L",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    18: {
        name: "Sub",
        cost: 2e4,
        move_points: 5,
        move_type: "S",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    46: {
        name: "Neotank",
        cost: 22e3,
        move_points: 6,
        move_type: "T",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    960900: {
        name: "Piperunner",
        cost: 2e4,
        move_points: 9,
        move_type: "P",
        fuel: 99,
        fuel_per_turn: 0,
        ammo: 9,
        short_range: 2,
        long_range: 5,
        second_weapon: "Y"
    },
    968731: {
        name: "Black Bomb",
        cost: 25e3,
        move_points: 9,
        move_type: "A",
        fuel: 45,
        fuel_per_turn: 5,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    1141438: {
        name: "Mega Tank",
        cost: 28e3,
        move_points: 4,
        move_type: "T",
        fuel: 50,
        fuel_per_turn: 0,
        ammo: 3,
        short_range: 0,
        long_range: 0,
        second_weapon: "Y"
    },
    28: {
        name: "Black Boat",
        cost: 7500,
        move_points: 7,
        move_type: "L",
        fuel: 60,
        fuel_per_turn: 1,
        ammo: 0,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    30: {
        name: "Stealth",
        cost: 24e3,
        move_points: 6,
        move_type: "A",
        fuel: 60,
        fuel_per_turn: 5,
        ammo: 6,
        short_range: 0,
        long_range: 0,
        second_weapon: "N"
    },
    29: {
        name: "Carrier",
        cost: 3e4,
        move_points: 5,
        move_type: "S",
        fuel: 99,
        fuel_per_turn: 1,
        ammo: 9,
        short_range: 3,
        long_range: 8,
        second_weapon: "N"
    }
}
BaseInfo.countries = {
    os: {
        id: 1,
        name: "Orange Star",
        color: "181, 39, 68"
    },
    bm: {
        id: 2,
        name: "Blue Moon",
        color: "70,110,254"
    },
    ge: {
        id: 3,
        name: "Green Earth",
        color: "61, 194, 45"
    },
    yc: {
        id: 4,
        name: "Yellow Comet",
        color: "201, 189, 2"
    },
    bh: {
        id: 5,
        name: "Black Hole",
        color: "116, 89, 138"
    },
    rf: {
        id: 6,
        name: "Red Fire",
        color: "146, 50, 67"
    },
    gs: {
        id: 7,
        name: "Grey Sky",
        color: "114, 114, 114"
    },
    bd: {
        id: 8,
        name: "Brown Desert",
        color: "152, 83, 51"
    },
    ab: {
        id: 9,
        name: "Amber Blaze",
        color: "252, 163, 57"
    },
    js: {
        id: 10,
        name: "Jade Sun",
        color: "166, 182, 153"
    },
    ci: {
        id: 16,
        name: "Cobalt Ice",
        color: "11, 32, 112"
    },
    pc: {
        id: 17,
        name: "Pink Cosmos",
        color: "255, 102, 204"
    },
    tg: {
        id: 19,
        name: "Teal Galaxy",
        color: "60, 205, 193"
    },
    pl: {
        id: 20,
        name: "Purple Lightning",
        color: "111, 26, 155"
    },
    ar: {
        id: 21,
        name: "Acid Rain",
        color: "97, 124, 14"
    },
    wn: {
        id: 22,
        name: "White Nova",
        color: "205, 155, 154"
    },
    aa: {
        id: 23,
        name: "Azure Asteroid",
        color: "130, 220, 232"
    },
    ne: {
        id: 24,
        name: "Noir Eclipse",
        color: "3, 3, 3"
    },
    sc: {
        id: 25,
        name: "Silver Claw",
        color: "137, 168, 188"
    },
    uw: {
        id: 26,
        name: "Umber Wilds",
        color: "222, 139, 56"
    }
}
BaseInfo.terrain = {
    1: {
        name: "Plain",
        defense: 1,
        country: "",
        build_type: null
    },
    2: {
        name: "Mountain",
        defense: 4,
        country: "",
        build_type: ""
    },
    3: {
        name: "Wood",
        defense: 2,
        country: "",
        build_type: null
    },
    4: {
        name: "HRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    5: {
        name: "VRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    6: {
        name: "CRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    7: {
        name: "ESRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    8: {
        name: "SWRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    9: {
        name: "WNRiver",
        defense: 0,
        country: "",
        build_type: ""
    },
    10: {
        name: "NERiver",
        defense: 0,
        country: "",
        build_type: null
    },
    11: {
        name: "ESWRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    12: {
        name: "SWNRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    13: {
        name: "WNERiver",
        defense: 0,
        country: "",
        build_type: null
    },
    14: {
        name: "NESRiver",
        defense: 0,
        country: "",
        build_type: null
    },
    15: {
        name: "HRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    16: {
        name: "VRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    17: {
        name: "CRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    18: {
        name: "ESRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    19: {
        name: "SWRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    20: {
        name: "WNRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    21: {
        name: "NERoad",
        defense: 0,
        country: "",
        build_type: null
    },
    22: {
        name: "ESWRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    23: {
        name: "SWNRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    24: {
        name: "WNERoad",
        defense: 0,
        country: "",
        build_type: null
    },
    25: {
        name: "NESRoad",
        defense: 0,
        country: "",
        build_type: null
    },
    26: {
        name: "HBridge",
        defense: 0,
        country: "",
        build_type: null
    },
    27: {
        name: "VBridge",
        defense: 0,
        country: "",
        build_type: null
    },
    28: {
        name: "Sea",
        defense: 0,
        country: "",
        build_type: null
    },
    29: {
        name: "HShoal",
        defense: 0,
        country: "",
        build_type: null
    },
    30: {
        name: "HShoalN",
        defense: 0,
        country: "",
        build_type: null
    },
    31: {
        name: "VShoal",
        defense: 0,
        country: "",
        build_type: null
    },
    32: {
        name: "VShoalE",
        defense: 0,
        country: "",
        build_type: null
    },
    33: {
        name: "Reef",
        defense: 1,
        country: "",
        build_type: null
    },
    34: {
        name: "Neutral City",
        defense: 3,
        country: "",
        build_type: null
    },
    35: {
        name: "Neutral Base",
        defense: 3,
        country: "",
        build_type: ""
    },
    36: {
        name: "Neutral Airport",
        defense: 3,
        country: "",
        build_type: null
    },
    37: {
        name: "Neutral Port",
        defense: 3,
        country: "",
        build_type: null
    },
    38: {
        name: "Orange Star City",
        defense: 3,
        country: "os",
        build_type: null
    },
    39: {
        name: "Orange Star Base",
        defense: 3,
        country: "os",
        build_type: "L"
    },
    40: {
        name: "Orange Star Airport",
        defense: 3,
        country: "os",
        build_type: "A"
    },
    41: {
        name: "Orange Star Port",
        defense: 3,
        country: "os",
        build_type: "S"
    },
    42: {
        name: "Orange Star HQ",
        defense: 4,
        country: "os",
        build_type: null
    },
    43: {
        name: "Blue Moon City",
        defense: 3,
        country: "bm",
        build_type: null
    },
    44: {
        name: "Blue Moon Base",
        defense: 3,
        country: "bm",
        build_type: "L"
    },
    45: {
        name: "Blue Moon Airport",
        defense: 3,
        country: "bm",
        build_type: "A"
    },
    46: {
        name: "Blue Moon Port",
        defense: 3,
        country: "bm",
        build_type: "S"
    },
    47: {
        name: "Blue Moon HQ",
        defense: 4,
        country: "bm",
        build_type: null
    },
    48: {
        name: "Green Earth City",
        defense: 3,
        country: "ge",
        build_type: null
    },
    49: {
        name: "Green Earth Base",
        defense: 3,
        country: "ge",
        build_type: "L"
    },
    50: {
        name: "Green Earth Airport",
        defense: 3,
        country: "ge",
        build_type: "A"
    },
    51: {
        name: "Green Earth Port",
        defense: 3,
        country: "ge",
        build_type: "S"
    },
    52: {
        name: "Green Earth HQ",
        defense: 4,
        country: "ge",
        build_type: null
    },
    53: {
        name: "Yellow Comet City",
        defense: 3,
        country: "yc",
        build_type: null
    },
    54: {
        name: "Yellow Comet Base",
        defense: 3,
        country: "yc",
        build_type: "L"
    },
    55: {
        name: "Yellow Comet Airport",
        defense: 3,
        country: "yc",
        build_type: "A"
    },
    56: {
        name: "Yellow Comet Port",
        defense: 3,
        country: "yc",
        build_type: "S"
    },
    57: {
        name: "Yellow Comet HQ",
        defense: 4,
        country: "yc",
        build_type: null
    },
    81: {
        name: "Red Fire City",
        defense: 3,
        country: "rf",
        build_type: null
    },
    82: {
        name: "Red Fire Base",
        defense: 3,
        country: "rf",
        build_type: "L"
    },
    83: {
        name: "Red Fire Airport",
        defense: 3,
        country: "rf",
        build_type: "A"
    },
    84: {
        name: "Red Fire Port",
        defense: 3,
        country: "rf",
        build_type: "S"
    },
    85: {
        name: "Red Fire HQ",
        defense: 4,
        country: "rf",
        build_type: null
    },
    86: {
        name: "Grey Sky City",
        defense: 3,
        country: "gs",
        build_type: null
    },
    87: {
        name: "Grey Sky Base",
        defense: 3,
        country: "gs",
        build_type: "L"
    },
    88: {
        name: "Grey Sky Airport",
        defense: 3,
        country: "gs",
        build_type: "A"
    },
    89: {
        name: "Grey Sky Port",
        defense: 3,
        country: "gs",
        build_type: "S"
    },
    90: {
        name: "Grey Sky HQ",
        defense: 4,
        country: "gs",
        build_type: null
    },
    91: {
        name: "Black Hole City",
        defense: 3,
        country: "bh",
        build_type: null
    },
    92: {
        name: "Black Hole Base",
        defense: 3,
        country: "bh",
        build_type: "L"
    },
    93: {
        name: "Black Hole Airport",
        defense: 3,
        country: "bh",
        build_type: "A"
    },
    94: {
        name: "Black Hole Port",
        defense: 3,
        country: "bh",
        build_type: "S"
    },
    95: {
        name: "Black Hole HQ",
        defense: 4,
        country: "bh",
        build_type: ""
    },
    96: {
        name: "Brown Desert City",
        defense: 3,
        country: "bd",
        build_type: null
    },
    97: {
        name: "Brown Desert Base",
        defense: 3,
        country: "bd",
        build_type: "L"
    },
    98: {
        name: "Brown Desert Airport",
        defense: 3,
        country: "bd",
        build_type: "A"
    },
    99: {
        name: "Brown Desert Port",
        defense: 3,
        country: "bd",
        build_type: "S"
    },
    100: {
        name: "Brown Desert HQ",
        defense: 4,
        country: "bd",
        build_type: null
    },
    101: {
        name: "VPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    102: {
        name: "HPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    103: {
        name: "NEPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    104: {
        name: "ESPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    105: {
        name: "SWPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    106: {
        name: "WNPipe",
        defense: 0,
        country: "",
        build_type: ""
    },
    107: {
        name: "NPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    108: {
        name: "EPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    109: {
        name: "SPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    110: {
        name: "WPipe End",
        defense: 0,
        country: "",
        build_type: ""
    },
    111: {
        name: "Missile Silo",
        defense: 3,
        country: "",
        build_type: ""
    },
    112: {
        name: "Missile Silo Empty",
        defense: 3,
        country: "",
        build_type: ""
    },
    113: {
        name: "HPipe Seam",
        defense: 0,
        country: "",
        build_type: ""
    },
    114: {
        name: "VPipe Seam",
        defense: 0,
        country: "",
        build_type: ""
    },
    115: {
        name: "HPipe Rubble",
        defense: 1,
        country: "",
        build_type: ""
    },
    116: {
        name: "VPipe Rubble",
        defense: 1,
        country: "",
        build_type: ""
    },
    117: {
        name: "Amber Blaze Airport",
        defense: 3,
        country: "ab",
        build_type: "A"
    },
    118: {
        name: "Amber Blaze Base",
        defense: 3,
        country: "ab",
        build_type: "L"
    },
    119: {
        name: "Amber Blaze City",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    120: {
        name: "Amber Blaze HQ",
        defense: 4,
        country: "ab",
        build_type: ""
    },
    121: {
        name: "Amber Blaze Port",
        defense: 3,
        country: "ab",
        build_type: "S"
    },
    122: {
        name: "Jade Sun Airport",
        defense: 3,
        country: "js",
        build_type: "A"
    },
    123: {
        name: "Jade Sun Base",
        defense: 3,
        country: "js",
        build_type: "L"
    },
    124: {
        name: "Jade Sun City",
        defense: 3,
        country: "js",
        build_type: ""
    },
    125: {
        name: "Jade Sun HQ",
        defense: 4,
        country: "js",
        build_type: ""
    },
    126: {
        name: "Jade Sun Port",
        defense: 3,
        country: "js",
        build_type: "S"
    },
    127: {
        name: "Amber Blaze Com Tower",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    128: {
        name: "Black Hole Com Tower",
        defense: 3,
        country: "bh",
        build_type: ""
    },
    129: {
        name: "Blue Moon Com Tower",
        defense: 3,
        country: "bm",
        build_type: ""
    },
    130: {
        name: "Brown Desert Com Tower",
        defense: 3,
        country: "bd",
        build_type: ""
    },
    131: {
        name: "Green Earth Com Tower",
        defense: 3,
        country: "ge",
        build_type: ""
    },
    132: {
        name: "Jade Sun Com Tower",
        defense: 3,
        country: "js",
        build_type: ""
    },
    133: {
        name: "Neutral Com Tower",
        defense: 3,
        country: "",
        build_type: ""
    },
    134: {
        name: "Orange Star Com Tower",
        defense: 3,
        country: "os",
        build_type: ""
    },
    135: {
        name: "Red Fire Com Tower",
        defense: 3,
        country: "rf",
        build_type: ""
    },
    136: {
        name: "Yellow Comet Com Tower",
        defense: 3,
        country: "yc",
        build_type: ""
    },
    137: {
        name: "Grey Sky Com Tower",
        defense: 3,
        country: "gs",
        build_type: ""
    },
    138: {
        name: "Amber Blaze Lab",
        defense: 3,
        country: "ab",
        build_type: ""
    },
    139: {
        name: "Black Hole Lab",
        defense: 3,
        country: "bh",
        build_type: ""
    },
    140: {
        name: "Blue Moon Lab",
        defense: 3,
        country: "bm",
        build_type: ""
    },
    141: {
        name: "Brown Desert Lab",
        defense: 3,
        country: "bd",
        build_type: ""
    },
    142: {
        name: "Green Earth Lab",
        defense: 3,
        country: "ge",
        build_type: ""
    },
    143: {
        name: "Grey Sky Lab",
        defense: 3,
        country: "gs",
        build_type: ""
    },
    144: {
        name: "Jade Sun Lab",
        defense: 3,
        country: "js",
        build_type: ""
    },
    145: {
        name: "Neutral Lab",
        defense: 3,
        country: "",
        build_type: ""
    },
    146: {
        name: "Orange Star Lab",
        defense: 3,
        country: "os",
        build_type: ""
    },
    147: {
        name: "Red Fire Lab",
        defense: 3,
        country: "rf",
        build_type: ""
    },
    148: {
        name: "Yellow Comet Lab",
        defense: 3,
        country: "yc",
        build_type: ""
    },
    149: {
        name: "Cobalt Ice Airport",
        defense: 3,
        country: "ci",
        build_type: "A"
    },
    150: {
        name: "Cobalt Ice Base",
        defense: 3,
        country: "ci",
        build_type: "L"
    },
    151: {
        name: "Cobalt Ice City",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    152: {
        name: "Cobalt Ice Com Tower",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    153: {
        name: "Cobalt Ice HQ",
        defense: 4,
        country: "ci",
        build_type: ""
    },
    154: {
        name: "Cobalt Ice Lab",
        defense: 3,
        country: "ci",
        build_type: ""
    },
    155: {
        name: "Cobalt Ice Port",
        defense: 3,
        country: "ci",
        build_type: "S"
    },
    156: {
        name: "Pink Cosmos Airport",
        defense: 3,
        country: "pc",
        build_type: "A"
    },
    157: {
        name: "Pink Cosmos Base",
        defense: 3,
        country: "pc",
        build_type: "L"
    },
    158: {
        name: "Pink Cosmos City",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    159: {
        name: "Pink Cosmos Com Tower",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    160: {
        name: "Pink Cosmos HQ",
        defense: 4,
        country: "pc",
        build_type: ""
    },
    161: {
        name: "Pink Cosmos Lab",
        defense: 3,
        country: "pc",
        build_type: ""
    },
    162: {
        name: "Pink Cosmos Port",
        defense: 3,
        country: "pc",
        build_type: "S"
    },
    163: {
        name: "Teal Galaxy Airport",
        defense: 3,
        country: "tg",
        build_type: "A"
    },
    164: {
        name: "Teal Galaxy Base",
        defense: 3,
        country: "tg",
        build_type: "L"
    },
    165: {
        name: "Teal Galaxy City",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    166: {
        name: "Teal Galaxy Com Tower",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    167: {
        name: "Teal Galaxy HQ",
        defense: 4,
        country: "tg",
        build_type: ""
    },
    168: {
        name: "Teal Galaxy Lab",
        defense: 3,
        country: "tg",
        build_type: ""
    },
    169: {
        name: "Teal Galaxy Port",
        defense: 3,
        country: "tg",
        build_type: "S"
    },
    170: {
        name: "Purple Lightning Airport",
        defense: 3,
        country: "pl",
        build_type: "A"
    },
    171: {
        name: "Purple Lightning Base",
        defense: 3,
        country: "pl",
        build_type: "L"
    },
    172: {
        name: "Purple Lightning City",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    173: {
        name: "Purple Lightning Com Tower",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    174: {
        name: "Purple Lightning HQ",
        defense: 4,
        country: "pl",
        build_type: ""
    },
    175: {
        name: "Purple Lightning Lab",
        defense: 3,
        country: "pl",
        build_type: ""
    },
    176: {
        name: "Purple Lightning Port",
        defense: 3,
        country: "pl",
        build_type: "S"
    },
    181: {
        name: "Acid Rain Airport",
        defense: 3,
        country: "ar",
        build_type: "A"
    },
    182: {
        name: "Acid Rain Base",
        defense: 3,
        country: "ar",
        build_type: "L"
    },
    183: {
        name: "Acid Rain City",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    184: {
        name: "Acid Rain Com Tower",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    185: {
        name: "Acid Rain HQ",
        defense: 4,
        country: "ar",
        build_type: ""
    },
    186: {
        name: "Acid Rain Lab",
        defense: 3,
        country: "ar",
        build_type: ""
    },
    187: {
        name: "Acid Rain Port",
        defense: 3,
        country: "ar",
        build_type: "S"
    },
    188: {
        name: "White Nova Airport",
        defense: 3,
        country: "wn",
        build_type: "A"
    },
    189: {
        name: "White Nova Base",
        defense: 3,
        country: "wn",
        build_type: "L"
    },
    190: {
        name: "White Nova City",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    191: {
        name: "White Nova Com Tower",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    192: {
        name: "White Nova HQ",
        defense: 4,
        country: "wn",
        build_type: ""
    },
    193: {
        name: "White Nova Lab",
        defense: 3,
        country: "wn",
        build_type: ""
    },
    194: {
        name: "White Nova Port",
        defense: 3,
        country: "wn",
        build_type: "S"
    },
    195: {
        name: "Teleporter",
        defense: 0,
        country: "",
        build_type: ""
    },
    196: {
        name: "Azure Asteroid Airport",
        defense: 3,
        country: "aa",
        build_type: "A"
    },
    197: {
        name: "Azure Asteroid Base",
        defense: 3,
        country: "aa",
        build_type: "L"
    },
    198: {
        name: "Azure Asteroid City",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    199: {
        name: "Azure Asteroid Com Tower",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    200: {
        name: "Azure Asteroid HQ",
        defense: 4,
        country: "aa",
        build_type: ""
    },
    201: {
        name: "Azure Asteroid Lab",
        defense: 3,
        country: "aa",
        build_type: ""
    },
    202: {
        name: "Azure Asteroid Port",
        defense: 3,
        country: "aa",
        build_type: "S"
    },
    203: {
        name: "Noir Eclipse Airport",
        defense: 3,
        country: "ne",
        build_type: "A"
    },
    204: {
        name: "Noir Eclipse Base",
        defense: 3,
        country: "ne",
        build_type: "L"
    },
    205: {
        name: "Noir Eclipse City",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    206: {
        name: "Noir Eclipse Com Tower",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    207: {
        name: "Noir Eclipse HQ",
        defense: 4,
        country: "ne",
        build_type: ""
    },
    208: {
        name: "Noir Eclipse Lab",
        defense: 3,
        country: "ne",
        build_type: ""
    },
    209: {
        name: "Noir Eclipse Port",
        defense: 3,
        country: "ne",
        build_type: "S"
    },
    210: {
        name: "Silver Claw Airport",
        defense: 3,
        country: "sc",
        build_type: "A"
    },
    211: {
        name: "Silver Claw Base",
        defense: 3,
        country: "sc",
        build_type: "L"
    },
    212: {
        name: "Silver Claw City",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    213: {
        name: "Silver Claw Com Tower",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    214: {
        name: "Silver Claw HQ",
        defense: 4,
        country: "sc",
        build_type: ""
    },
    215: {
        name: "Silver Claw Lab",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    216: {
        name: "Silver Claw Port",
        defense: 3,
        country: "sc",
        build_type: "S"
    },
    210: {
        name: "Silver Claw Airport",
        defense: 3,
        country: "sc",
        build_type: "A"
    },
    211: {
        name: "Silver Claw Base",
        defense: 3,
        country: "sc",
        build_type: "L"
    },
    212: {
        name: "Silver Claw City",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    213: {
        name: "Silver Claw Com Tower",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    214: {
        name: "Silver Claw HQ",
        defense: 4,
        country: "sc",
        build_type: ""
    },
    215: {
        name: "Silver Claw Lab",
        defense: 3,
        country: "sc",
        build_type: ""
    },
    216: {
        name: "Silver Claw Port",
        defense: 3,
        country: "sc",
        build_type: "S"
    },
    217: {
        name: "Umber Wilds Airport",
        defense: 3,
        country: "uw",
        build_type: "A"
    },
    218: {
        name: "Umber Wilds Base",
        defense: 3,
        country: "uw",
        build_type: "L"
    },
    219: {
        name: "Umber Wilds City",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    220: {
        name: "Umber Wilds Com Tower",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    221: {
        name: "Umber Wilds HQ",
        defense: 4,
        country: "uw",
        build_type: ""
    },
    222: {
        name: "Umber Wilds Lab",
        defense: 3,
        country: "uw",
        build_type: ""
    },
    223: {
        name: "Umber Wilds Port",
        defense: 3,
        country: "uw",
        build_type: "S"
    }
}
BaseInfo.moveCosts = {
    C: {
        F: {
            1: 1,
            2: 2,
            3: 1,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 1,
            2: 0,
            3: 2,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 2,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 1,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    },
    S: {
        F: {
            1: 2,
            2: 4,
            3: 2,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 2,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 2,
            2: 0,
            3: 2,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 3,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 3,
            116: 3,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 2,
            2: 2,
            3: 2,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 2,
            16: 2,
            17: 2,
            18: 2,
            19: 2,
            20: 2,
            21: 2,
            22: 2,
            23: 2,
            24: 2,
            25: 2,
            26: 2,
            27: 2,
            28: 2,
            29: 2,
            30: 2,
            31: 2,
            32: 2,
            33: 2,
            34: 2,
            35: 2,
            36: 2,
            37: 2,
            38: 2,
            39: 2,
            40: 2,
            41: 2,
            42: 2,
            43: 2,
            44: 2,
            45: 2,
            46: 2,
            47: 2,
            48: 2,
            49: 2,
            50: 2,
            51: 2,
            52: 2,
            53: 2,
            54: 2,
            55: 2,
            56: 2,
            57: 2,
            81: 2,
            86: 2,
            82: 2,
            87: 2,
            83: 2,
            88: 2,
            84: 2,
            89: 2,
            85: 2,
            90: 2,
            91: 2,
            92: 2,
            93: 2,
            94: 2,
            95: 2,
            96: 2,
            97: 2,
            98: 2,
            99: 2,
            100: 2,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 2,
            112: 2,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 2,
            118: 2,
            119: 2,
            120: 2,
            121: 2,
            122: 2,
            123: 2,
            124: 2,
            125: 2,
            126: 2,
            127: 2,
            128: 2,
            129: 2,
            130: 2,
            131: 2,
            132: 2,
            133: 2,
            134: 2,
            135: 2,
            136: 2,
            137: 2,
            138: 2,
            139: 2,
            140: 2,
            141: 2,
            142: 2,
            143: 2,
            144: 2,
            145: 2,
            146: 2,
            147: 2,
            148: 2,
            149: 2,
            150: 2,
            151: 2,
            152: 2,
            153: 2,
            154: 2,
            155: 2,
            156: 2,
            157: 2,
            158: 2,
            159: 2,
            160: 2,
            161: 2,
            162: 2,
            163: 2,
            164: 2,
            165: 2,
            166: 2,
            167: 2,
            168: 2,
            169: 2,
            170: 2,
            171: 2,
            172: 2,
            173: 2,
            174: 2,
            175: 2,
            176: 2,
            "": 2,
            181: 2,
            182: 2,
            183: 2,
            184: 2,
            185: 2,
            186: 2,
            187: 2,
            188: 2,
            189: 2,
            190: 2,
            191: 2,
            192: 2,
            193: 2,
            194: 2,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 2,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 2,
            38: 0,
            39: 0,
            40: 0,
            41: 2,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 2,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 2,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 2,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 2,
            89: 2,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 2,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 2,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 2,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 2,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 2,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 2,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 2,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 2,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 2,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 2,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 2,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 2,
            38: 0,
            39: 0,
            40: 0,
            41: 2,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 2,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 2,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 2,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 2,
            89: 2,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 2,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 2,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 2,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 2,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 2,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 2,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 2,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 2,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 2,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 2,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    },
    R: {
        F: {
            1: 1,
            2: 2,
            3: 1,
            4: 2,
            5: 2,
            6: 2,
            7: 2,
            8: 2,
            9: 2,
            10: 2,
            11: 2,
            12: 2,
            13: 2,
            14: 2,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        B: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        T: {
            1: 2,
            2: 0,
            3: 3,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 2,
            116: 2,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        W: {
            1: 3,
            2: 0,
            3: 4,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 0,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 0,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 3,
            116: 3,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        A: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1,
            8: 1,
            9: 1,
            10: 1,
            11: 1,
            12: 1,
            13: 1,
            14: 1,
            15: 1,
            16: 1,
            17: 1,
            18: 1,
            19: 1,
            20: 1,
            21: 1,
            22: 1,
            23: 1,
            24: 1,
            25: 1,
            26: 1,
            27: 1,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 1,
            34: 1,
            35: 1,
            36: 1,
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            41: 1,
            42: 1,
            43: 1,
            44: 1,
            45: 1,
            46: 1,
            47: 1,
            48: 1,
            49: 1,
            50: 1,
            51: 1,
            52: 1,
            53: 1,
            54: 1,
            55: 1,
            56: 1,
            57: 1,
            81: 1,
            86: 1,
            82: 1,
            87: 1,
            83: 1,
            88: 1,
            84: 1,
            89: 1,
            85: 1,
            90: 1,
            91: 1,
            92: 1,
            93: 1,
            94: 1,
            95: 1,
            96: 1,
            97: 1,
            98: 1,
            99: 1,
            100: 1,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 1,
            112: 1,
            113: 0,
            114: 0,
            115: 1,
            116: 1,
            117: 1,
            118: 1,
            119: 1,
            120: 1,
            121: 1,
            122: 1,
            123: 1,
            124: 1,
            125: 1,
            126: 1,
            127: 1,
            128: 1,
            129: 1,
            130: 1,
            131: 1,
            132: 1,
            133: 1,
            134: 1,
            135: 1,
            136: 1,
            137: 1,
            138: 1,
            139: 1,
            140: 1,
            141: 1,
            142: 1,
            143: 1,
            144: 1,
            145: 1,
            146: 1,
            147: 1,
            148: 1,
            149: 1,
            150: 1,
            151: 1,
            152: 1,
            153: 1,
            154: 1,
            155: 1,
            156: 1,
            157: 1,
            158: 1,
            159: 1,
            160: 1,
            161: 1,
            162: 1,
            163: 1,
            164: 1,
            165: 1,
            166: 1,
            167: 1,
            168: 1,
            169: 1,
            170: 1,
            171: 1,
            172: 1,
            173: 1,
            174: 1,
            175: 1,
            176: 1,
            "": 1,
            181: 1,
            182: 1,
            183: 1,
            184: 1,
            185: 1,
            186: 1,
            187: 1,
            188: 1,
            189: 1,
            190: 1,
            191: 1,
            192: 1,
            193: 1,
            194: 1,
            195: 0
        },
        S: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        L: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 1,
            29: 1,
            30: 1,
            31: 1,
            32: 1,
            33: 2,
            34: 0,
            35: 0,
            36: 0,
            37: 1,
            38: 0,
            39: 0,
            40: 0,
            41: 1,
            42: 0,
            43: 0,
            44: 0,
            45: 0,
            46: 1,
            47: 0,
            48: 0,
            49: 0,
            50: 0,
            51: 1,
            52: 0,
            53: 0,
            54: 0,
            55: 0,
            56: 1,
            57: 0,
            81: 0,
            86: 0,
            82: 0,
            87: 0,
            83: 0,
            88: 0,
            84: 1,
            89: 1,
            85: 0,
            90: 0,
            91: 0,
            92: 0,
            93: 0,
            94: 1,
            95: 0,
            96: 0,
            97: 0,
            98: 0,
            99: 1,
            100: 0,
            101: 0,
            102: 0,
            103: 0,
            104: 0,
            105: 0,
            106: 0,
            107: 0,
            108: 0,
            109: 0,
            110: 0,
            111: 0,
            112: 0,
            113: 0,
            114: 0,
            115: 0,
            116: 0,
            117: 0,
            118: 0,
            119: 0,
            120: 0,
            121: 1,
            122: 0,
            123: 0,
            124: 0,
            125: 0,
            126: 1,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 0,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 1,
            156: 0,
            157: 0,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 1,
            163: 0,
            164: 0,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 1,
            170: 0,
            171: 0,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 1,
            "": 0,
            181: 0,
            182: 0,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 1,
            188: 0,
            189: 0,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 1,
            195: 0
        },
        P: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
            23: 0,
            24: 0,
            25: 0,
            26: 0,
            27: 0,
            28: 0,
            29: 0,
            30: 0,
            31: 0,
            32: 0,
            33: 0,
            34: 0,
            35: 1,
            36: 0,
            37: 0,
            38: 0,
            39: 1,
            40: 0,
            41: 0,
            42: 0,
            43: 0,
            44: 1,
            45: 0,
            46: 0,
            47: 0,
            48: 0,
            49: 1,
            50: 0,
            51: 0,
            52: 0,
            53: 0,
            54: 1,
            55: 0,
            56: 0,
            57: 0,
            85: 0,
            90: 0,
            84: 0,
            89: 0,
            83: 0,
            88: 0,
            82: 1,
            87: 1,
            81: 0,
            86: 0,
            91: 0,
            92: 1,
            93: 0,
            94: 0,
            95: 0,
            96: 0,
            97: 1,
            98: 0,
            99: 0,
            100: 0,
            101: 1,
            102: 1,
            103: 1,
            104: 1,
            105: 1,
            106: 1,
            107: 1,
            108: 1,
            109: 1,
            110: 1,
            111: 0,
            112: 0,
            113: 1,
            114: 1,
            115: 0,
            116: 0,
            117: 0,
            118: 1,
            119: 0,
            120: 0,
            121: 0,
            122: 0,
            123: 1,
            124: 0,
            125: 0,
            126: 0,
            127: 0,
            128: 0,
            129: 0,
            130: 0,
            131: 0,
            132: 0,
            133: 0,
            134: 0,
            135: 0,
            136: 0,
            137: 0,
            138: 0,
            139: 0,
            140: 0,
            141: 0,
            142: 0,
            143: 0,
            144: 0,
            145: 0,
            146: 0,
            147: 0,
            148: 0,
            149: 0,
            150: 1,
            151: 0,
            152: 0,
            153: 0,
            154: 0,
            155: 0,
            156: 0,
            157: 1,
            158: 0,
            159: 0,
            160: 0,
            161: 0,
            162: 0,
            163: 0,
            164: 1,
            165: 0,
            166: 0,
            167: 0,
            168: 0,
            169: 0,
            170: 0,
            171: 1,
            172: 0,
            173: 0,
            174: 0,
            175: 0,
            176: 0,
            "": 0,
            181: 0,
            182: 1,
            183: 0,
            184: 0,
            185: 0,
            186: 0,
            187: 0,
            188: 0,
            189: 1,
            190: 0,
            191: 0,
            192: 0,
            193: 0,
            194: 0,
            195: 0
        }
    }
}
window.BaseInfo = BaseInfo;
Object.freeze(BaseInfo);

function getUnitByName(name) {
    for (let unitKey of Object.keys(BaseInfo.units)) {
        let data = BaseInfo.units[unitKey];
        if (data.name == name) return data;
    }
    return null;
}
function getUnitImage(countryCode, unit) {
    return `terrain/aw1/${countryCode}{unit}.gif`;
}
function getCityImage(countryCode, type) {
    return `terrain/aw1/${getFlatName(countryCode)}{type}.gif`;
}
function getFlatName(countryCode) {
    if (BaseInfo.countries[countryCode] == undefined) return undefined
    return BaseInfo.countries[countryCode].name.toLowerCase().replace(" ", "")
}
window.getFlatName = getFlatName;

class Vector2i {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    flatten() {
        return `${this.x},${this.y}`;
    }

    equals(other) {
        return other instanceof Vector2i &&
            this.x === other.x &&
            this.y === other.y;
    }

    static expand(string) {
        let split = string.split(",");
        if (split.len < 1) {
            return Vector2i.NULL();
        }

        let x = parseInt(split[0]);
        let y = parseInt(split[1]);

        return new Vector2i(x, y);
    }

    static NULL() {
        return new Vector2i(-1, -1);
    }

    static isNull(v) {
        return v == null || v.equals(this.NULL());
    }
}
class Unit {
    created = 0;
    x = -1;
    y = -1;
    id = 1;
    country = "os";
    // Array[MoveOrder]
    moveOrders = [];

    constructor(id, x, y, country) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.country = country;
    }

    where() {
        return new Vector2i(this.x, this.y);
    }

    at(day) {
        let index = day - this.created - 1;
        if (this.moveOrders[index] == undefined) {
            return this.moveOrders.at(-1);
        }
        return this.moveOrders[index]
    }
}
class Property {
    where = Vector2i.NULL();
    originalOwner = "";
    owner = "";
    type = "";
    generateIncome = true;
}

class BuildOrderManager {
    map = new GameMap();
    renderer = new BuildOrderRenderer();
    countries = [];
    // Country: BuildPlan
    plans = new Map();
    // Country: Array[BuildPlan]
    allPlans = new Map();
    // Country: Array[IncomeDay]
    days = new Map();

    async init() {
        this.renderer.manager = this;

        let db = window.BuildOrderDatabase;
        await db.load(window.mapID);

        this.allPlans = new Map(db.loadedPlans);

        if (!this.allPlans || this.allPlans.size == 0) {
            this.allPlans = new Map();

            for (let country of this.countries) {
                this.allPlans.set(country, []);
            }

            for (let country of this.countries) {
                let plan = new BuildPlan();
                plan.country = country;
                this.allPlans.set(country, []);
                this.allPlans.get(country).push(plan);
            }
        }

        for (let country of this.countries) {
            let plans = this.allPlans.get(country);
            let plan = plans[0];
            this.plans.set(country, plan);
        }

        this.renderer.init();

        this.recalculateDays();
        this.updateMoves(0);
    }

    show(flag) {
        this.renderer.show(flag);
    }

    updateMoves(day) {
        if (day == undefined && window.AWBWEssentials) day = window.AWBWEssentials.$refs.essentials.currentDay;
        this.renderer.updateMoves(day);
    }

    recentDays = null;
    recalculateDays() {
        this.days.clear();
        for (let country of this.countries) {
            let day = new IncomeDay();
            day.country = country;

            this.days.set(country, [day]);
        }

        // Day 0
        for (let property of this.map.properties.values()) {
            for (let country of this.countries) {
                let days = this.days.get(country);
                let day = days[0];

                if (property.owner == country) {
                    day.propertyMap.set(property.where.flatten(), property);
                }
            }
        }

        let max = window.AWBWEssentials?.$refs?.essentials?.maxDay ?? 15;
        for (let country of this.countries) {
            let days = this.days.get(country);
            for (let d = 1; d < max; d++) {
                let day = new IncomeDay();
                days.push(day);
            }
        }

        for (let d = 0; d < max; d++) {
            for (let country of this.countries) {
                let days = this.days.get(country);

                let day = days[d]
                if (d == 0) {
                    let plan = this.plans.get(country);
                    for (let step of plan.steps) {
                        if (step.day != 0) continue;

                        let id = step.id;
                        if (!day.unitMap[id]) day.unitMap[id] = 0;

                        day.unitMap[id] += 1;

                        let first = step.orders[0]
                        if (!first) continue;

                        if (first.created) day.fundsEnd -= BaseInfo.units[parseInt(id)].cost;
                    }

                    day.finalProperties = Array.from(day.propertyMap.values());
                    for (let property of day.finalProperties) {
                        let type = property.type;

                        if (day.propertyTally[type] == undefined) day.propertyTally[type] = 0;
                        day.propertyTally[type] += 1;
                    }

                    let table = day.getIncomeTable();
                    day.fundsStart = table.start;
                    day.fundsEnd += day.fundsStart;

                    day.incomeStarting = table.start;
                    day.incomeEnding = table.end;
                    continue;
                }

                let previousDay = days[d - 1];

                let copy = {};
                Object.assign(copy, previousDay.unitMap);
                day.unitMap = copy;
                day.fundsStart = previousDay.fundsEnd;
                for (let property of previousDay.propertyMap.values()) {
                    day.propertyMap.set(property.where.flatten(), property);
                }

                for (let property of previousDay.captured.values()) {
                    day.propertyMap.set(property.where.flatten(), property);
                }

                let tallyCopy = {};
                Object.assign(tallyCopy, previousDay.propertyTally);
                day.propertyTally = tallyCopy;

                for (let property of day.lost.values()) {
                    day.propertyMap.delete(property.where.flatten());

                    if (day.propertyTally[property.type] == undefined) day.propertyTally[property.type] = 0;
                    day.propertyTally[property.type] -= 1;
                }

                day.finalProperties = Array.from(day.propertyMap.values());

                let plan = this.plans.get(country);
                let steps = plan.steps;
                let captures = plan.captures;

                for (let capture of captures) {
                    if (capture.when - 1 == d) {
                        day.captured.set(capture.what.where.flatten(), capture.what);
                        day.finalProperties.push(capture.what);

                        if (d + 1 < max && capture.originalOwner != "" && capture.originalOwner != country) {
                            let myIndex = this.countries.indexOf(country);
                            let theirIndex = this.countries.indexOf(capture.originalOwner);
                            let targetDay = null;

                            // If the player comes before you, affect their next day.
                            if (myIndex > theirIndex) {
                                targetDay = this.days.get(capture.originalOwner)[d + 1];
                            } else {
                                targetDay = this.days.get(capture.originalOwner)[d];
                            }

                            targetDay.lost.set(capture.what.where.flatten(), capture.what);
                        }
                        if (day.propertyTally[capture.what.type] == undefined) day.propertyTally[capture.what.type] = 0;
                        day.propertyTally[capture.what.type] += 1;
                    }
                }

                for (let step of steps) {
                    if (step.day != d) continue;

                    let id = step.id;
                    if (!day.unitMap[id]) day.unitMap[id] = 0;

                    day.unitMap[id] += 1;

                    let first = step.orders[0]
                    if (!first) continue;

                    if (first.created) day.fundsEnd -= BaseInfo.units[parseInt(id)].cost;
                }

//                 for (let property of day.finalProperties) {
//                     let type = property.type;

//                     if (day.propertyTally[type] == undefined) day.propertyTally[type] = 0;
//                     day.propertyTally[type] += 1;
//                 }

                let table = day.getIncomeTable();
                day.fundsStart += table.start;
                day.fundsEnd += day.fundsStart;

                day.incomeStarting = table.start;
                day.incomeEnding = table.end;
            }
        }

        this.recentDays = this.days;
        return this.days;
    }

    createPlan(name, country) {
        let plan = new BuildPlan();
        plan.name = name;
        plan.country = country;

        this.allPlans.get(country).push(plan);

        this.recalculateDays();
    }

    swapPlan(country, plan) {
        if (!plan) return;

        this.plans.set(country, plan);

        this.recalculateDays();
    }

    deletePlan(country, plan) {
        let plans = this.allPlans.get(country)
        if (plans.indexOf(plan) != -1) plans.splice(plans.indexOf(plan), 1);

        if (this.plans.get(country) == plan) this.plans.set(country, this.allPlans.get(country)[0]);
        if (this.plans.get(country) == undefined) this.createPlan("Default", country);

        this.recalculateDays();
    }
}
class BuildOrderRenderer {
    manager = null;
    mainCanvas = null;
    buildCanvas = null;
    moveCanvas = null;
    unitCanvas = null;

    init() {
        this.mainCanvas = document.createElement("canvas");
        this.mainCanvas.id = "mainCanvas";
        this.mainCanvas.style = "\n        pointer-events: none;\n        z-index: 200;\n        position: absolute;\n        top: 0;\n        left: 0;";
        let gameMap = document.getElementById("gamemap");
        if (gameMap) {
            gameMap.append(this.mainCanvas);
        }

        this.mainCanvas.height = 16 * this.manager.map.height;
        this.mainCanvas.width = 16 * this.manager.map.width;

        this.buildCanvas = document.createElement("canvas");
        this.buildCanvas.id = "buildCanvas";
        this.buildCanvas.style = "\n        pointer-events: none;\n        z-index: 201;\n        position: absolute;\n        top: 0;\n        left: 0;";
        if (gameMap) {
            gameMap.append(this.buildCanvas);
        }

        this.buildCanvas.height = 16 * this.manager.map.height;
        this.buildCanvas.width = 16 * this.manager.map.width;

        this.moveCanvas = document.createElement("canvas");
        this.moveCanvas.id = "moveCanvas";
        this.moveCanvas.style = "\n        pointer-events: none;\n        z-index: 202;\n        position: absolute;\n        top: 0;\n        left: 0;";
        if (gameMap) {
            gameMap.append(this.moveCanvas);
        }

        this.moveCanvas.height = 16 * this.manager.map.height;
        this.moveCanvas.width = 16 * this.manager.map.width;

        this.unitCanvas = document.createElement("canvas");
        this.unitCanvas.id = "unitCanvas";
        this.unitCanvas.style = "\n        pointer-events: none;\n        z-index: 203;\n        position: absolute;\n        top: 0;\n        left: 0;";
        if (gameMap) {
            gameMap.append(this.unitCanvas);
        }

        this.unitCanvas.height = 16 * this.manager.map.height;
        this.unitCanvas.width = 16 * this.manager.map.width;
    }

    show(flag) {
        this.mainCanvas.style.opacity = flag ? '1' : '0'
        this.buildCanvas.style.opacity = flag ? '1' : '0'
        this.moveCanvas.style.opacity = flag ? '1' : '0'
        this.unitCanvas.style.opacity = flag ? '1' : '0'
    }

    clear() {
        this.mainCanvas.getContext('2d').clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        this.buildCanvas.getContext('2d').clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        this.moveCanvas.getContext('2d').clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        this.unitCanvas.getContext('2d').clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
    }

    async updateMoves(day) {
        let ctx = this.moveCanvas.getContext('2d')
        ctx.font = "12px monospace"
        ctx.textAlign = "center"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.fillStyle = "white"

        let selectedStep = window.AWBWEssentials ? window.AWBWEssentials.$refs.essentials.currentStep : undefined;

        ctx.clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        for (let country of this.manager.countries) {
            let color = BaseInfo.countries[country].color
            let plan = this.manager.plans.get(country);
            let steps = plan.steps;

            for (let step of steps) {
                let show = false;

                if (selectedStep && step == selectedStep) show = true;
                else if (!selectedStep && day == step.day) show = true;

                let fillAlpha = show ? 0.5 : 0.05;
                let strokeAlpha = show ? 0.9 : 0.2;

                for (let order of step.orders) {
                    let from = order.from;
                    let x = order.to.x;
                    let y = order.to.y;

                    ctx.setLineDash([]);
                    ctx.fillStyle = `rgba(${color}, ${fillAlpha})`
                    ctx.strokeStyle = `rgba(${color}, ${strokeAlpha})`;
                    // Draw filled rectangle
                    ctx.fillRect(16 * x, 16 * y, 16, 16);

                    // Set line width and draw rectangle border
                    ctx.lineWidth = 1;
                    ctx.strokeRect(16 * x, 16 * y, 16, 16);

                    // If condition `n` is true, set font and draw text `s`
                    //this.setFont();
                    //this.drawText(request.getDayCost() + request.when, 16 * a + 8, 16 * t + 12);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = `rgba(0, 0, 0, ${day == step.day ? 1.0 : 0.65}`
                    ctx.fillStyle = `rgba(255, 255, 255, ${day == step.day ? 1.0 : 0.65}`
                    ctx.strokeText(order.total, 16 * x + 8, 16 * y + 12);
                    ctx.fillText(order.total, 16 * x + 8, 16 * y + 12);

                    // Begin a Path
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(16 * from.x + 8, 16 * from.y + 8);
                    ctx.lineTo(16 * x + 8, 16 * y + 8);
                    ctx.strokeStyle = `rgba(${color}, 1.0)`
                    ctx.setLineDash([4, 4]);

                    // Draw the Path
                    ctx.stroke();
                }
            }
        }

        ctx = this.unitCanvas.getContext('2d')
        ctx.font = "12px monospace"
        ctx.textAlign = "center"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.fillStyle = "white"

        ctx.clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        for (let country of this.manager.countries) {
            let color = BaseInfo.countries[country].color
            let plan = this.manager.plans.get(country);
            let steps = plan.steps;

            for (let step of steps) {
                let id = step.id;
                let currentOrder = step.orders[0];

                if (step.day > day) continue;
                for (let order of step.orders) {
                    const moveEnd = order.start + order.total - 1;
                    const captureEnd = order.capture
                    ? moveEnd + order.captureDays
                    : moveEnd;

                    const isDuringMoveOrCapture = day >= order.start && day <= captureEnd;

                    if (isDuringMoveOrCapture) {
                        currentOrder = order;
                    }
                }
                if (!currentOrder) continue;

                let image = await loadImage(`terrain/aw1/${country}${BaseInfo.units[id].name.toLowerCase().replace("_", "").replace(" ", "")}.gif`);
                let pos = currentOrder.to;

                let isCreatedAndVisible = currentOrder.created && day == currentOrder.start;
                if (isCreatedAndVisible) pos = currentOrder.from;

                ctx.drawImage(image, 16 * pos.x, 16 * pos.y);
            }
        }

        ctx = this.buildCanvas.getContext('2d')
        ctx.font = "12px monospace"
        ctx.textAlign = "center"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.fillStyle = "white"

        ctx.clearRect(0, 0, this.manager.map.width * 16, this.manager.map.height * 16);
        for (let country of this.manager.countries) {
            let color = BaseInfo.countries[country].color;
            let plan = this.manager.plans.get(country);
            let captures = plan.captures;

            for (let capture of captures) {
                if (capture.when - (capture.created ? 0 : 1) > day) continue;

                let property = capture.what;
                let pos = property.where;
                let type = property.type;
                if (type == "tower") {
                    type = "comtower";
                }

                let image = await loadImage(`terrain/ani/${getFlatName(country)}${type}.gif`);

                ctx.drawImage(image, 16 * pos.x, 16 * pos.y - (image.height - 16));
            }
        }
    }
}
class BuildPlan {
    name = "Default"
    icon = "Infantry";
    country = "";
    // Array[BuildStep]
    steps = [];
    // Array[BuildCapture]
    captures = [];
}
class BuildCapture {
    what = null;
    when = 0;
    owner = ""
    originalOwner = "";
    created = false;
}
class BuildStep {
    country = "";
    day = 0;
    id = -1;
    origin = Vector2i.NULL();
    // Array[MoveOrder]
    orders = [];
    selected = false;
}
class MoveOrder {
    from = Vector2i.NULL();
    to = Vector2i.NULL();
    capture = false;
    captureDays = 1;
    created = false;
    start = 0;
    total = 1;
}

class GameMap {
    width = 0;
    height = 0;
    terrainMap = new Map();
    properties = new Map();
}
class IncomeDay {
    country = "";
    fundsPerCity = 1000;
    propertyMap = new Map();
    captured = new Map();
    lost = new Map();

    finalProperties = [];
    propertyTally = {};

    unitMap = {};
    fundsStart = 0;
    fundsEnd = 0;
    incomeStarting = 0;
    incomeEnding = 0;

    getIncomeTable() {
        let properties = Array.from(this.propertyMap.values());
        let capturedToday = Array.from(this.captured.values());
        let lostToday = Array.from(this.lost.values());

        let incomeStart = 0;
        let incomeEnd = 0;
        for (let property of properties) {
            if (property.generateIncome) incomeEnd += this.fundsPerCity;
        }

        for (let property of capturedToday) {
            if (property.generateIncome) incomeEnd += this.fundsPerCity;
        }

        for (let property of lostToday) {
            if (property.generateIncome) {
                incomeStart -= this.fundsPerCity;
                incomeEnd -= this.fundsPerCity;
            }
        }

        for (let property of properties) {
            if (property.generateIncome) incomeStart += this.fundsPerCity;
        }

        return { start: incomeStart, end: incomeEnd }
    }
}

class BuildOrderDatabase {
    openPlanDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open("AWBW_Plans_DB", 1);

            req.onupgradeneeded = (e) => {
                const db = e.target.result;

                // mapID + country is unique
                const store = db.createObjectStore("plans", {
                    keyPath: ["mapID", "country"]
                });

                // index by mapID only
                store.createIndex("by_map", "mapID");
            };

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async savePlans(mapID, country, plans) {
        const db = await this.openPlanDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("plans", "readwrite");
            const store = tx.objectStore("plans");

            // Convert class instances → plain JSON
            const jsonPlans = JSON.parse(JSON.stringify(plans));

            store.put({ mapID, country, plans: jsonPlans });

            tx.oncomplete = resolve;
            tx.onerror = reject;
        });
    }

    async saveAll(mapID) {
        if (mapID == -1) return;

        let manager = window.BuildOrderManager;
        for (let country of manager.countries) {
            let plans = manager.allPlans.get(country);
            await this.savePlans(mapID, country, plans);
        }
    }

    async loadPlans(mapID, country) {
        const db = await this.openPlanDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("plans", "readonly");
            const store = tx.objectStore("plans");

            const req = store.get([mapID, country]);
            req.onsuccess = () => resolve(req.result?.plans || []);
            req.onerror = reject;
        });
    }

    async loadAllMapPlans(mapID) {
        const db = await this.openPlanDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("plans", "readonly");
            const store = tx.objectStore("plans");
            const index = store.index("by_map");

            const req = index.getAll(IDBKeyRange.only(mapID));

            req.onsuccess = () => {
                // result is: [ {mapID, country, plans}, ... ]
                const map = new Map();
                for (let row of req.result) {
                    map.set(row.country, row);
                }
                resolve(map);
            };
            req.onerror = reject;
        });
    }

    revivePlan(plan) {
        let revived = Object.assign(new BuildPlan(), plan);

        revived.steps = revived.steps.map(step => {
            let s = Object.assign(new BuildStep(), step);

            s.origin = Object.assign(new Vector2i(), s.origin);
            s.orders = s.orders.map(order => {
                let vFrom = new Vector2i(order.from.x, order.from.y);
                let vTo = new Vector2i(order.to.x, order.to.y);

                let o = new MoveOrder();
                Object.assign(o, order)

                o.from = vFrom;
                o.to = vTo;
                return o;
            });

            return s;
        });

        revived.captures = revived.captures.map(c => {
            let v = new Vector2i(c.what.where.x, c.what.where.y);
            let capture = new BuildCapture();

            Object.assign(capture, c);
            capture.what.where = v;

            return Object.assign(new BuildCapture(), c)
        });

        return revived;
    }

    loadedPlans = null;
    async load(mapID) {
        let raw = await this.loadAllMapPlans(mapID);

        const revived = new Map();
        for (let [country, data] of raw.entries()) {
            revived.set(
                country,
                data.plans.map(p => this.revivePlan(p))
            );
        }

        this.loadedPlans = revived;
    }
}
window.BuildOrderDatabase = new BuildOrderDatabase();

class Dijkstra {
    constructor(e, t, n, i) {
        // Sets up width and height for the instance
        this.width = n;
        this.height = i;

        // Stores the graph in the instance
        this.graph = e;

        // Initializes an empty array to hold start positions
        this.start = [];

        // Creates a distance array with undefined values, length is width * height
        this.distance = new Array(n * i).fill(void 0);

        // Iterates over each element in t (units)
        t.forEach((e) => {
            // Adds each starting position as an object with x, y, and a distance of 0
            this.start.push({
                x: e.x,
                y: e.y,
                dist: 0
            });
        });
    }
    makeQueue() {
        return new TinyQueue([], ((e, t) => e.dist - t.dist))
    }
    iterate(e) {
        let t = this.makeQueue(),
            n = new Array(this.width * this.height).fill(!1);
        this.start.forEach((e => {
            t.push(e), n[e.x + e.y * this.width] = !0
        }));
        let i = 0,
            o = 1;
        for (; t.length > 0;) {
            let r = e * o,
                a = t;
            for (t = this.makeQueue(); a.length > 0;) {
                if (i++ > 2e6) return alert("@steve on discord, dijkstra got stuck.");
                let {
                    x: e,
                    y: o,
                    dist: s
                } = a.pop(), l = e + o * this.width;
                this.distance[l] = s;
                let d = this.graph.getNeighbors(e, o);
                for (let i of d) {
                    let s = i.x + i.y * this.width;
                    const d = this.graph.getWeight(s);
                    if (d >= 0) {
                        let u = this.distance[l] + d;
                        !n[s] && u > r ? t.push({
                            x: e,
                            y: o,
                            dist: r
                        }) : (void 0 === this.distance[s] || u < this.distance[s]) && (a.push({
                            x: i.x,
                            y: i.y,
                            dist: u
                        }), this.distance[s] = u, n[s] = !0)
                    } else this.distance[s] = -1, n[s] = !0
                }
            }
            o++
        }
        return this.distance
    }
}
class WeightedDirectedGraph {
    constructor(e, t, n) {
        this.data = e, this.width = t, this.height = n
    }
    get length() {
        return this.data.length
    }
    getWeight(e) {
        return this.data[e]
    }
    getXY(e, t) {
        return this.data[e + t * this.width]
    }
    getNeighbors(e, t) {
        if (!(e >= 0 && e < this.width && t >= 0 && t < this.height)) throw new Error(`Graph node {x: ${e}, y: ${t}} not in bounds ${this.width},${this.height}`);
        let n = [];
        return e - 1 >= 0 && n.push({
            x: e - 1,
            y: t
        }), t - 1 >= 0 && n.push({
            x: e,
            y: t - 1
        }), e + 1 < this.width && n.push({
            x: e + 1,
            y: t
        }), t + 1 < this.height && n.push({
            x: e,
            y: t + 1
        }), n
    }
}

function generateStylings() {
    injectStyle("ko-boxes", `
      .ko-box-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: max-content;
        gap: 8px;
      }

      .ko-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*width: fit-content;*/
        width: 52px;
        transform: scale(1.5);
      }

      .ko-box.confirmed {
        background: rgba(216, 52, 52, 0.67);
      }

      .ko-box-display:not(:nth-child(4)), .ko-box-display:not(:last-child) {
        border-right: 3px solid gray;
        padding-right: 3px;
      }

      .ko-box > div {
        height: fit-content;
        width: fit-content;
      }

      .ko-box-flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 2px;
      }

      .ko-box-flex > div {
        z-index: 1;
      }

      .ko-box-image {
        position: absolute;
        height: 16px;
        width: 16px;
        z-index: -1;
      }
    `);

    injectStyle("build-order-manager", `
      .build-order-preview-holder {
        right: -16px;
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
      }

      .build-order-preview-box {
        height: 100%;
        width: 344px;
        background: white;
        border: 1px solid black;
        display: flex;
        flex-direction: column;
      }

      .build-order-step.step-selected {
        border: 4px solid gray;
      }

      .income-day-holder {
        border-bottom: 1px solid black;
        height: 64px;
        position: relative;
        padding: 2px 4px 4px 4px;
        background: #e25e4166;
      }

      .income-day-tag {
        position: absolute;
        top: 0px;
        height: 16px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 4px;
      }

      .income-day-row-info {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        fnt-family: "Nova Square", cursive !important;
        font-size: 12px;
        gap: 2px;
      }
    `);
}
generateStylings();

function initAWBWEssentials() {
    Vue.component("AWBWEssentials", {
        template:
            `<div id='replay-misc-controls'>
				<div ref='openBtn' class='flex v-center' style='padding: 0px 12px;cursor: pointer; user-select: none;' @click='open = !open'>
					<img src='terrain/target_icon2.gif' style='height: 16px; width: 16px;'/><b>Essentials</b>
				</div>
                <div ref='contextMenu' :style="{
                  display: openContextMenu ? 'block' : 'none',
                  position: 'absolute',
                  width: '160px',
                  height: 'max-content',
                  border: '1px solid black',
                  background: 'white',
                  left: 'calc(' + lastClick.x + ' * 1.3 * 16px + 16px)',
                  top: 'calc(' + lastClick.y + '  * 1.3 * 16px + 16px)',}">
                    <div @click="onClick({
                      x: lastClick.x,
                      y: lastClick.y,
                      ctrl: true,
                    })" style="position: relative; height: 16px; width: 100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <img style="width: 12px;" src="terrain/ani/neutralbase.gif">
                        <span style="font-weight: bold; font-size: 12px;">Build/Spawn Unit</span>
                    </div>
                    <div @click="onClick({
                      x: lastClick.x,
                      y: lastClick.y,
                      shift: true,
                    })" v-if='currentStep && currentStep.id != -1' style="position: relative; height: 16px; width: 100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <img style="height: 12px;" :src="'terrain/ani/' + currentStep.country + BaseInfo.units[currentStep.id].name.toLowerCase().replace('_', '').replace(' ', '') + '.gif'">
                        <span style="font-weight: bold; font-size: 12px;">{{ currentStep.id == 1 ? 'Move Unit/Capture' : 'Move Unit' }}</span>
                    </div>
                    <div @click="onClick({
                      x: lastClick.x,
                      y: lastClick.y,
                      alt: true,
                    })" v-if='currentStep && currentStep.id != -1' style="position: relative; height: 16px; width: 100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <img style="height: 12px;width: 12px;" src="terrain/close.png">
                        <span style="font-weight: bold; font-size: 12px;">{{ currentStep.id == 1 ? 'Erase Move/Capture' : 'Erase Move' }}</span>
                    </div>
                    <div v-if='currentStep' @click='onDeleteStep(currentStep)' style="position: relative; height: 16px; width: 100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <img style="height: 12px;width: 12px;" src="terrain/close.png">
                        <span style="font-weight: bold; font-size: 12px;">Delete Step</span>
                    </div>
                    <div v-if='currentStep' @click='currentStep = null; openContextMenu = false;' style="position: relative; height: 16px; width: 100%; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <span style="font-weight: bold; font-size: 12px; width: 100%; text-align: center;">Exit</span>
                    </div>
                </div>
                <div ref='countrySelect' :style="{
                  display: awaitStepCreation && currentStep == null && currentStepUnit == -1 ? 'block' : 'none',
                  position: 'absolute',
                  width: '128px',
                  height: 'max-content',
                  border: '1px solid black',
                  background: 'white',
                  left: 'calc(' + lastClick.x + ' * 1.3 * 16px + 16px)',
                  top: 'calc(' + lastClick.y + '  * 1.3 * 16px + 16px)',}">
                    <div v-for='cc in countries' @click='onCreateStep(cc)' style="position: relative;height: 16px;width: 100%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;gap: 4px;padding: 2px;">
                        <img :src="'terrain/aw1/' + cc + 'logo.gif'" style="height:12px;">
                        <span style="font-weight: bold;font-size: 12px;">{{ BaseInfo.countries[cc].name }}</span>
                    </div>
                </div>
                <div ref='unitSelect' :style="{
                  display: awaitStepCreation && currentStep && currentStepUnit == -1 ? 'flex' : 'none',
                  flexWrap: 'warp',
                  flexDirection: 'column',
                  position: 'absolute',
                  width: 'max-content',
                  height: 'max-content',
                  border: '1px solid black',
                  background: 'white',
                  left: 'calc(' + lastClick.x + ' * 1.3 * 16px + 16px)',
                  top: 'calc(' + lastClick.y + '  * 1.3 * 16px + 16px)',}">
                    <div @click='onSelectStepUnit(unit.id)' v-for="unit in validUnits" style="position: relative; height: 16px; width: 164px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; gap: 4px; padding: 2px;">
                        <img :src="'terrain/ani/' + currentStep?.country + unit.name.toLowerCase().replace('_', '').replace(' ', '') + '.gif'" style="height: 16px;width: 16px;">
                        <span style="font-weight: bold; font-size: 12px;width: 50%;text-align: left;">{{ unit.name }}</span>
                        <span style="font-weight: bold; font-size: 12px;width: max-content;">{{ unit.cost }}</span>
                        <img style="height: 16px;width: 16px;" src="terrain/coin.gif">
                    </div>
                </div>
                <div ref='stepList' style="left: calc(-16px - 256px);position: absolute;top: 0%;width: 1px;height: 100%;">
                    <div style="height: 100%;width: 256px;background: white;border: 1px solid black;display: flex;flex-direction: column; overflow: auto;">
                        <div class='build-order-step' @click='onClickStep(step)' tabindex="0" v-for="step in steps" :class="{ 'step-selected': currentStep == step }" :style="{
                          position: 'relative',
                          height: '24px',
                          background: CountryColor[step.country] + '66',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px'}">
                            <div v-if='currentStep == step' @click='rewindStep(step)' style="font-weight: bold;font-size: 24px;position: absolute;left: 4px;top: -2px;">⏮</div>
                            <div v-if='step.id != -1' style="display: flex; flex-direction: row; align-items: center; font-size: 16px; font-weight: bold;gap: 2px;">
                                <div style="font-size: 10px">[{{ step.origin.x }}, {{ step.origin.y }}]</div>
                                <img :src="'terrain/ani/' + step.country + BaseInfo.units[step.id].name.toLowerCase().replace('_', '').replace(' ', '') + '.gif'" style="height: 24px;">
                                <div>{{ BaseInfo.units[step.id].name }} | Day #{{step.day + 1}}</div>
                            </div>
                            <div v-if='currentStep == step' @click='forwardStep(step)' style="font-weight: bold;font-size: 24px;position: absolute;left: 224px;top: -2px;">⏭</div>
                        </div>
                    </div>
                </div>
                <div ref='buildOrderMenu' class='build-order-preview-holder'>
                    <div class='build-order-preview-box'>
                        <div style="color: white;font-weight: bold;padding: 8px 0px 0px 0px;width: 100%;background: #0066cc;font-size: 16px;">Build Order Previewer - Beta 0.1.3</div>
                        <div style="font-size: 12px;height: 48px;background: #0066cc;border-bottom: 1px solid black;display: flex;flex-wrap: wrap;padding: 4px 8px 4px 8px;align-items: center;gap: 8px;justify-content: center;">
                            <div @click='showBuildOrders = !showBuildOrders' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: showBuildOrders ? '#7ebeff' : '#004d99',}">{{ showBuildOrders ? 'Hide' : 'Show' }}</div>
                            <div @click='buildMode = "Info"' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: buildMode == 'Info' ? '#7ebeff' : '#004d99',}">Info</div>
                            <div @click='buildMode = "Controls"' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: buildMode == 'Controls' ? '#7ebeff' : '#004d99',}">Controls</div>
                            <div @click='buildMode = "ViewEdit"' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: buildMode == 'ViewEdit' ? '#7ebeff' : '#004d99',}">View/Edit</div>
                            <div @click='buildMode = "Plans"' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: buildMode == 'Plans' ? '#7ebeff' : '#004d99',}">Plans</div>
                            <div @click='onSave()' :style="{color: 'white', fontWeight: 'bold', padding: '4px', background: '#004d99',}">Save</div>
                        </div>
                        <div v-if="buildMode == 'Info'" style="background: #7ebeff;height: 100%;margin: 4px;padding: 4px;text-align: left;">
                            <b style="text-align: center;width: 100%;position: relative;display: block;margin-bottom: 8px;">Welcome to the Build Order Previewer!</b>
                            <span>This extension was designed to make quickly previewing timings and build orders easier without having to tinker with the Planner.</span>
                            <br>
                            <br>
                            <span>View the <b>Results</b> of Your Build Orders and Income on any Given Day in the <b>View/Edit</b> Section.</span>
                            <br>
                            <br>
                            <span>Navigate to the <b>Plans</b> to swap between Build Orders for each country. Plans are saved between mapIDs so returning to the same map should have your previous builds active!</span>
                        </div>
                        <div v-if="buildMode == 'Controls'" style="background: #7ebeff;height: 100%;margin: 4px;padding: 4px;text-align: left;">
                            <b style="text-align: center;width: 100%;position: relative;display: block;margin-bottom: 8px;">General Controls</b>
                            <span style="font-size: 12px">Left-Click any position on the map to access the Context Menu. The Menu is only accessible from the View/Edit Section.</span>
                            <br>
                            <span style="font-size: 12px">From there you can Build/Move/Delete Orders. If you need to edit a specific step, click the steps on the left menu box.</span>
                            <br>
                            <span style="font-size: 12px">Mobile users should be able to use the Context Menu for all their needs.</span>
                            <br>
                            <br>
                            <b style="text-align: center;width: 100%;position: relative;display: block;margin-bottom: 8px;">Controls/Hotkey Shortcuts!</b>
                            <span><b>Left Click: </b>Context Menu</span>
                            <br>
                            <span><b>Ctrl + Left Click: </b>Build/Spawn Unit</span>
                            <br>
                            <span><b>Shift + Left Click: </b>Chain Movement</span>
                            <br>
                            <span><b>Alt + Left Click: </b>Delete Move Order</span>
                            <br>
                            <span>Deletes Step if hovering over the step's origin.</span>
                        </div>
                        <div v-if="buildMode == 'ViewEdit'" style="width: 100%;height: 24px;background: lightgray;border-bottom: 2px solid black; display: flex; flex-direction: row; justify-content: center; align-items: center;">
                            <label>Day #:
                              <input
                                  :value="currentDay + 1"
                                  @input="currentDay = $event.target.value - 1"
                                  type="number"
                                  min="1"
                                  max="15"
                                  style="width: 80px"
                                />
                            </label>
                        </div>
                        <div v-if="buildMode == 'ViewEdit'" style="height: 100%;width: 100%;display: flex;flex-direction: column; overflow: auto;">
                            <div v-if='incomeDays' v-for='cc in countries' :style="{
                            borderBottom: '1px solid black',
                            height: '64px',
                            position: 'relative',
                            padding: '2px 4px 4px 4px',
                            background: CountryColor[cc] + '66', }">
                                <div style="position: absolute;top: 0px;height: 16px;width: 100%;display: flex;flex-direction: row;justify-content: flex-end;align-items: center;gap: 4px;right: 4px;">
                                    <img :src="'terrain/aw1/' + cc + 'logo.gif'" style="height:12px;">
                                    <span style="font-weight: bold;font-size: 12px;">{{ BaseInfo.countries[cc].name }}</span>
                                </div>
                                <div style="width: 100%;height: 100%;display: flex;flex-direction: row;align-items: flex-end;font-family: &quot;Nova Square&quot;, cursive !important;font-size: 12px;gap: 2px;">
                                    <div style="height: 80%;width: 60%;">
                                        <div style="display: flex;flex-direction: column;width: 100%;height: 100%;justify-content: flex-end;">
                                            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;">
                                                <div style="width: 64px; font-size: 10px; text-align: left;">Funds [S]:</div>
                                                <div style="display: flex;flex-direction: row;justify-content: center;align-content: center;gap: 4px;"><b style="font-size: 13px;">{{ getDay(cc).fundsStart }}</b> <img src="terrain/coin.gif" style="height: 12px;"></div>
                                            </div>
                                            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;">
                                                <div style="width: 64px; font-size: 10px; text-align: left;">Funds [E]:</div>
                                                <div style="display: flex;flex-direction: row;justify-content: center;align-content: center;gap: 4px;"><b style="font-size: 13px;">{{ getDay(cc).fundsEnd }}</b> <img src="terrain/coin.gif" style="height: 12px;"></div>
                                            </div>
                                            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;">
                                                <div style="width: 64px; font-size: 10px; text-align: left;">Income [S]:</div>
                                                <div style="display: flex;flex-direction: row;justify-content: center;align-content: center;gap: 4px;"><b style="font-size: 13px;">{{ getDay(cc).incomeStarting }}</b> <img src="terrain/coin.gif" style="height: 12px;"></div>
                                            </div>
                                            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;">
                                                <div style="width: 64px; font-size: 10px; text-align: left;">Income [E]:</div>
                                                <div style="display: flex;flex-direction: row;justify-content: center;align-content: center;gap: 4px;"><b style="font-size: 13px;">{{ getDay(cc).incomeEnding }}</b> <img src="terrain/coin.gif" style="height: 12px;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height: 100%;width: 100%;display: flex;flex-direction: column;">
                                        <div style="display: flex;flex-direction: row;width: 100%;align-items: center;gap: 4px;align-items: flex-end;margin-bottom: 4px;">
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'hq.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.hq || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'base.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.base || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'city.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.city || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'airport.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.airport || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'port.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.port || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'comtower.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.tower || 0 }}</b>
                                            </div>
                                            <div style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;">
                                                <img style="width: 14px;" :src="'terrain/ani/' + getFlatName(cc) + 'lab.gif'">
                                                <b style="width: 8px;">{{ getDay(cc).propertyTally?.lab || 0 }}</b>
                                            </div>
                                        </div>
                                        <div style="width: 100%;height: 100%;display: flex;flex-wrap: wrap;">
                                            <div v-for='unitID in Object.keys(getDay(cc).unitMap)' style="display: flex; flex-direction: row; gap: 1px;align-items: flex-end;height: fit-content;width: fit-content;">
                                                <img :src="'terrain/ani/' + cc + BaseInfo.units[unitID].name.toLowerCase().replace('_', '').replace(' ', '') + '.gif'" style="width: 16px;">
                                                <b style="width: 8px; font-size: 12px">{{ getDay(cc).unitMap[unitID] }}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="buildMode == 'Plans'" style="height: 48px;width: 100%;background: #d3d3d3;border-bottom: 1px solid black;display: flex;flex-wrap: wrap;gap: 8px;justify-content: center;align-items: center;">
                            <div v-for='cc in countries' @click='onCreatePlan(cc, "New Plan")' :style="{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              background: CountryColor[cc] + '66',
                              padding: '4px',
                              border: '1px solid black',}">
                                <img :src="'terrain/ani/' + cc + 'logo.gif'" style="height: 16px;">
                                <div style="font-weight: bold;">New Plan</div>
                            </div>
                        </div>
                        <div v-if="buildMode == 'Plans'" style="width: 100%;height: 100%;display: flex;flex-direction: column;">
                            <div v-for="plan in plans" :style="{height: '48px', background: CountryColor[plan.country] + '66', padding: '4px',}">
                                <div style="display: flex;flex-direction: row;align-items: center;width: 100%;height: 100%;gap: 8px;">
                                    <img :src="'terrain/ani/' + plan.country + plan.icon.toLowerCase().replace('_', '').replace(' ', '') + '.gif'" style="height: 24px;margin-left: 8px;position: relative;">
                                    <div style="font-weight: bold; font-size: 16px;width: 128px;">{{ plan.name }}</div>
                                    <div style="display: flex;flex-wrap: wrap;gap: 2px;width: 180x;">
                                        <div @click="onSelectPlan(plan)" :style="{padding: '4px', background: isSelected(plan) ? '#7ebeff' : 'white', fontWeight: 'bold', position: 'relative', width: '25%',}">{{ isSelected(plan) ? 'Active' : 'Select' }}</div>
                                        <div @click="iconPlan = plan" v-on:click.right='iconPlan = null' style="padding: 4px;background: white;font-weight: bold;position: relative;width: 25%;">
                                            <span>Icon</span>
                                            <div v-if='iconPlan && iconPlan == plan' :style="{
                                              position: 'absolute',
                                              display: 'flex',
                                              width: '108px',
                                              height: 'max-content',
                                              top: '24px',
                                              left: '0px',
                                              background: 'white',
                                              border: '1px solid black',
                                              flexWrap: 'wrap',
                                              padding: '4px',
                                              gap: '4px',
                                              zIndex: '99999',}">
                                                <img @click.stop="pickIcon(plan, unit.name)"
                                                v-for='unit in Object.values(BaseInfo.units)'
                                                :src="'terrain/ani/' + plan.country + unit.name.toLowerCase().replace('_', '').replace(' ', '') + '.gif'"
                                                style="height: 24px;position: relative;" />
                                            </div>
                                        </div>
                                        <!-- VIEW MODE -->
                                        <div
                                            v-if="namingPlan !== plan"
                                            @click="startNaming(plan)"
                                            style="padding: 4px; background: white; font-weight: bold; width: 33%;">
                                            Rename
                                        </div>
                                        <!-- EDIT MODE -->
                                        <div v-else style="width: 33%; background: white; padding: 4px;">
                                            <input
                                                v-model="editableName"
                                                @keyup.enter="confirmName(plan)"
                                                @click.right="cancelNaming()"
                                                style="width: 100%; font-weight: bold;"
                                            />
                                        </div>
                                        <div @click='onDuplicatePlan(plan)' style="padding: 4px;background: white;font-weight: bold;width: 33%;">Duplicate</div>
                                        <div v-if='!deletingPlan || deletingPlan != plan' @click='deletingPlan = plan' style="padding: 4px;background: white;font-weight: bold;width: 25%;">Delete</div>
                                        <div v-if='deletingPlan == plan' @click.left='onDeletePlan(plan)' v-on:click.right='deletingPlan = null' style="padding: 4px;background: white;font-weight: bold;width: 25%;">Sure?</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div v-show='open' class='flex col' :style="{ top: position.y + 'px',
															  right: -position.x + 'px',
															  zIndex: '1000',
															  position: 'absolute',
															  cursor: 'pointer',}">
					<div class='bordertitle flex' style='color: #fff; background: #06c; border: 1px black solid; padding: 4px; justify-content: space-between;' draggable="true"
					@dragstart="onDragStart"
					@dragend="onDragEnd">
						<div style="font-weight: bold; display: block; float:left;">AWBW Essentials - Beta 0.1.3</div>
					<div style="cursor: pointer" @click="open = false">
					<img width='16' src="terrain/close.png"/>
					</div>
				</div>
				<div style='background: #fff; border: 1px black solid; padding: 4px; width: 448px;'>
					<div style="height: 32px; width: 95%; display: flex; gap: 16px; align-items: center; justify-content: center; padding: 8px; background: #0066cc; margin-bottom: 8px;">
						<div @click="viewMode = 'Info'" :style="{
							cursor: 'pointer',
							background: viewMode == 'Info' ? '#7ebeff' : '#004d99',
							color: 'white',
							padding: '4px',
							borderLeft: '2px solid rgb(0, 68, 170)',
							borderRight: '2px solid rgb(0, 68, 170)',
							width: '100%',
						}">Info</div>
						<div @click="viewMode = 'KO'" :style="{
							cursor: 'pointer',
							background: viewMode == 'KO' ? '#7ebeff' : '#004d99',
							color: 'white',
							padding: '4px',
							borderLeft: '2px solid rgb(0, 68, 170)',
							borderRight: '2px solid rgb(0, 68, 170)',
							width: '100%',
						}">KO Chart</div>
					</div>
                    <div v-show="viewMode == 'KO'" style="display: flex; flex-direction: column; width: 100%; align-items: center;">
                        <div style="font-weight: bold; font-size: 24px; text-align: center; width: 100%;">2-Hit KO Chart</div>
                        <div style="font-weight: bold; font-size: 18px; text-align: center; width: fit-content;">
                            <span>Luck Variance: 0%-</span>
                            <input v-model.number="threshold" type="number" max="9" min="0" style="width: 36px" />
                            <span>%</span>
                        </div>
				  	    <div style="display: flex; flex-wrap: wrap; width: 100%; align-items: flex-start; justify-content: center; padding: 16px 0px 16px 0px; gap: 6px;">
                            <div class="ko-box-display" v-for="atk in [0, 10, 20, 30, 40, 50, 60, 70]" :key="atk">
                                <div style="font-weight: bold; font-size: 18px; text-align: center; width: fit-content;">{{ 100 + atk }}% ATK</div>
                                <div class="ko-box" :title="result.title" :class="{ confirmed: result.confirmed }" v-for="result in gatherTerrainMatrix(atk / 100.0)" :key="result">
                                    <div class="ko-box-flex">
                                        <div v-for="unit in result.us" :key="unit">
                                          <img :src="'terrain/ani/os' + unit.toLowerCase() + '.gif'"></img>
                                        </div>
                                        <div>
                                            <img class="ko-box-image" :src='getTerrain(result.stars)'></img>
                                            <img :src="'terrain/ani/bm' + result.them.toLowerCase() + '.gif'"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div><span><b>Red Combos</b> will always defeat the unit 100% of the time!</span></div>
                        <div>
                            <span><img src="terrain/ani/osb-copter.gif"></img><b>Battle Copters</b></span>
                            <span>deal the same damage as <img src="terrain/ani/ostank.gif"></img><b>Tanks</b></span>
                            <span>when attacking <img src="terrain/ani/bminfantry.gif"><b>Infantry</b> or <img src="terrain/ani/bmtank.gif"><b>Tanks</b>.</span>
                        </div>
                    </div>
				</div>
			</div>`,
        props: {
            isKO: Array,
            toKO: Array,
            gathered: Array,
            predeployed: Array,
            countries: Array,
            steps: Array,
            validUnits: Array,
            incomeDays: Object,
            plans: Object,
        },
        data: function() {
            return {
                // Global
                viewMode: "Info",
                // KO Chart
                open: !1,
                atkHP: 10,
                defHP: 10,
                attack: 100,
                defense: 100,
                threshold: 5,
                maxDay: 15,
                position: { x: 50, y: 100 },
                offset: { x: 0, y: 0 },
                // Build Order Manager
                buildMode: "Info",
                showBuildOrders: !0,
                currentDay: 0,
                lastClick: { x: 0, y: 0 },
                lastData: {},
                openContextMenu: !1,
                awaitStepCreation: !1,
                currentStep: null,
                currentStepUnitFilter: "",
                currentStepUnit: -1,
                namingPlan: null,
                editableName: "",
                deletingPlan: null,
                iconPlan: null,
            }
        },
        created() {
            this.gathered = [];

            window.gameMap.addEventListener("click", (e) => {
                // Check if the event listener should proceed
                if (this.buildMode != "ViewEdit") return; // Exit if the map is not in an 'open' state.

                // Extract properties by calling a helper function
                let data = (function(e) {
                    // Get the map's bounding rectangle
                    let t = window.gameMap.getBoundingClientRect();

                    // Calculate the x and y coordinates on the map based on click position
                    let n = Math.floor((e.clientX - t.left) / (16 * scale)); // X-coordinate
                    let i = Math.floor((e.clientY - t.top) / (16 * scale)); // Y-coordinate

                    // Check for modifier keys
                    let shift = e.shiftKey; // Shift key pressed for chainMode
                    let ctrl = e.ctrlKey; // Alt key pressed for cycleOwnership
                    let alt = e.altKey;

                    // Clamp the x and y values to the map's boundaries
                    n = Math.max(0, Math.min(window.mapWidth - 1, n));
                    i = Math.max(0, Math.min(window.mapHeight - 1, i));

                    // Return the calculated data
                    return {
                        x: n,
                        y: i,
                        shift: shift,
                        ctrl: ctrl,
                        alt: alt,
                    };
                }) (e);

                this.onClick(data);
            });

            (async () => {
                let manager = window.BuildOrderManager;
                await manager.init();

                this.steps = this.getStepList();
                this.incomeDays = manager.recentDays;
                this.refreshPlans();
            })();
        },
        mounted() {
            // Wait for gamemap to exist in DOM
            const gamemap = document.querySelector("#gamemap-container");
            if (gamemap && this.$refs.stepList) {
                // Move the element into the gamemap
                gamemap.appendChild(this.$refs.stepList);

                // Optional: manually position it relative to gamemap
                const rect = gamemap.getBoundingClientRect();
                Object.assign(this.$refs.stepList.style, {
                    position: "absolute",
                    //top: rect.top + 20 + "px",  // offset example
                    //left: rect.left + "px",
                    zIndex: 202
                });
            }

            if (gamemap && this.$refs.contextMenu) {
                // Move the element into the gamemap
                gamemap.appendChild(this.$refs.contextMenu);

                // Optional: manually position it relative to gamemap
                const rect = gamemap.getBoundingClientRect();
                Object.assign(this.$refs.contextMenu.style, {
                    position: "absolute",
                    display: "none",
                    //top: rect.top + 20 + "px",  // offset example
                    //left: rect.left + "px",
                    zIndex: 202
                });
            }

            if (gamemap && this.$refs.countrySelect) {
                // Move the element into the gamemap
                gamemap.appendChild(this.$refs.countrySelect);

                // Optional: manually position it relative to gamemap
                const rect = gamemap.getBoundingClientRect();
                Object.assign(this.$refs.countrySelect.style, {
                    position: "absolute",
                    display: "none",
                    //top: rect.top + 20 + "px",  // offset example
                    //left: rect.left + "px",
                    zIndex: 202
                });
            }

            if (gamemap && this.$refs.unitSelect) {
                // Move the element into the gamemap
                gamemap.appendChild(this.$refs.unitSelect);

                // Optional: manually position it relative to gamemap
                const rect = gamemap.getBoundingClientRect();
                Object.assign(this.$refs.unitSelect.style, {
                    position: "absolute",
                    display: "none",
                    //top: rect.top + 20 + "px",  // offset example
                    //left: rect.left + "px",
                    zIndex: 202
                });
            }

            if (gamemap && this.$refs.buildOrderMenu) {
                // Move the element into the gamemap
                gamemap.appendChild(this.$refs.buildOrderMenu);

                // Optional: manually position it relative to gamemap
                const rect = gamemap.getBoundingClientRect();
                Object.assign(this.$refs.buildOrderMenu.style, {
                    position: "absolute",
                    //top: rect.top + 20 + "px",  // offset example
                    //left: rect.left + "px",
                    zIndex: 202
                });
            }
        },
        watch: {
            viewMode(newVal, oldVal) {
                if (newVal == "KO") {
                    this.clearMatricies();
                }
            },
            threshold(newVal, oldVal) {
                this.refreshKOList();
            },
            currentDay(newVal, oldVal) {
                this.updateMoveOrders();
            },
            showBuildOrders(newVal, oldVal) {
                window.BuildOrderManager.show(newVal);
            },

        },
        methods: {
            clearMatricies() {
                this.gathered = [];
            },
            refreshKOList() {
                this.clearMatricies();
                this.viewMode = "Info";
                this.viewMode = "KO";
            },
            gatherTerrainMatrix(atkBoost = 0.0, defBoost = 0.0) {
                let KOers = Object.keys(BaseDamages);
                let KOing = ToKO.slice(0);

                let results = [];
                for (let combo of Combos) {
                    let closest = undefined;
                    let KOresults = {};
                    for (let KOee of KOing) {
                        let theirData = getUnitByName(KOee);
                        if (!theirData) continue;

                        KOresults[KOee] = []
                        for (let star of [0, 1, 2, 3]) {
                            let data = {
                                us: combo,
                                them: KOee,
                                damages: [],
                                total: 0,
                                stars: star,
                                key: `${star}${KOee}`,
                                title: "",
                                confirmed: false,
                            }

                            for (let unit of combo) {
                                if (BaseDamages[unit] == undefined) continue;
                                if (!Object.keys(BaseDamages[unit]).includes(KOee)) continue;

                                let base = BaseDamages[unit][KOee];
                                let damage = calculateDamage(base, star, atkBoost, defBoost, 100, 100 - data.total);
                                data.damages.push(damage);
                                data.total += damage;
                                data.key += unit;
                                data.title += `[${damage}] `

                                if (damage >= 100) data.confirmed = true;
                            }
                            if (data.total >= 100) data.confirmed = true;

                            data.title += ` | ${data.total} Damage`;
                            KOresults[KOee].push(data);
                        }
                    }

                    for (let KOee of Object.keys(KOresults)) {
                        for (let KOresult of KOresults[KOee]) {
                            if (100 - KOresult.total > this.threshold) {
                                continue;
                            }

                            if (!closest) {
                                closest = KOresult;
                                continue;
                            }

                            let myDiff = 100 - KOresult.total;
                            let theirDiff = 100 - closest.total;
                            if (KOresult.stars > closest.stars) {
                                closest = KOresult;
                            } else if ((KOresult.confirmed && !closest.confirmed)) {
                                closest = KOresult;
                            } else if (myDiff > theirDiff) {
                                closest = KOresult;
                            }
                        }
                    }
                    if (closest) results.push(closest);
                }

                let nonDupeKeys = [];
                let nonDupes = [];
                for (let result of results) {
                    if (nonDupeKeys.includes(result.key) || this.gathered.includes(result.key)) continue;
                    this.gathered.push(result.key);
                    nonDupeKeys.push(result.key);
                    nonDupes.push(result);
                }

                return nonDupes;
            },
            getTerrain(stars) {
                for (let terrainKey of Object.keys(TerrainChart)) {
                    let data = TerrainChart[terrainKey];
                    if (data.stars == stars) {
                        return data.image;
                    }
                }
                return "";
            },
            onDragStart(event) {
                // Record the initial mouse position relative to the element
                this.offset.x = event.clientX - this.position.x;
                this.offset.y = event.clientY - this.position.y;
            },
            onDragEnd(event) {
                // Update the position of the element based on the drag
                this.position.x = event.clientX - this.offset.x;
                this.position.y = event.clientY - this.offset.y;
                this.position.x = Math.max(-600, this.position.x);
                this.position.y = Math.max(0, this.position.y);

                if (this.viewMode == "KO") {
                    this.refreshKOList();
                }
            },
            getMoveCostGraph(e, j, t = "C") {
                let n = new Array(this.width * this.height);
                const i = BaseInfo.moveCosts[t][e];
                for (let t = 0; t < this.height; t++) {
                    for (let o = 0; o < this.width; o++) {
                        // Vesper: Added code for the ignore Pipe Seam Function.
                        // Should return move cost value like it was broken if ignorePipes (j) is on.
                        // Remove this for the Income Grapher
                        let r = this.terrain[o + t * this.width],
                            a = i[r],
                            bp = i[115];
                        let b = "S" === e || "L" === e;
                        let s = 113 === r || 114 === r;
                        void 0 === a && (a = b ? -1 : 1)
                        if (0 === a && 195 !== r) {
                            a = -1;
                        }
                        if (j && s && !b) {
                            a = bp;
                        }
                        n[o + t * this.width] = a;
                    }
                }
                return new WeightedDirectedGraph(n, this.width, this.height)
            },
            onClick(data) {
                let manager = window.BuildOrderManager;
                let lastClick = this.lastClick;
                let click = { x: data.x, y: data.y };

                this.lastData = data;
                this.lastClick = click;

                if (!data.ctrl && !data.alt && !data.shift) {
                    if (this.awaitStepCreation) {
                        this.awaitStepCreation = false;
                        this.currentStep = null;
                        this.currentStepUnit = -1;
                        return
                    }

                    if (!this.currentStep) {
                        this.openContextMenu = !this.openContextMenu;
                        return;
                    }
                }

                // Left Click a point to edit it?
                // Maybe you click a step on the left view to get info on it.
                // Ctrl + Left Click to start a point.
                // Shift + Left Click to move/capture. It shows movement for all units. Will only capture if INF.
                // Alt + Left Click to delete it.
                if (!this.awaitStepCreation && data.ctrl) {
                    this.openContextMenu = false;
                    this.awaitStepCreation = true;
                    this.currentStep = null;
                    this.currentStepUnit = -1;
                    return
                }

                this.awaitStepCreation = false;
                let step = this.currentStep;
                if (!step) return;

                if (data.shift) {
                    let order = new MoveOrder();
                    let from = new Vector2i(lastClick.x , lastClick.y);
                    let to = new Vector2i(click.x , click.y);

                    if (step.orders.length == 0) {
                        from.x = step.origin.x;
                        from.y = step.origin.y;
                    } else if (step.orders.length > 0) {
                        let prev = step.orders.at(-1);
                        from.x = prev.to.x;
                        from.y = prev.to.y;
                    }

                    order.from = from;
                    order.to = to;

                    let start = this.currentDay;
                    let total = this.currentDay + 1;
                    let prev = step.orders.at(-1);
                    if (prev) {
                        total = prev.total + 1;
                        start = prev.total;
                    }

                    let producedFrom = manager.map.properties.get(order.from.flatten());
                    let isProduction = producedFrom && (producedFrom.type == "base" || producedFrom.type == "airport" || producedFrom.type == "port");
                    order.created = (step.orders.length == 0 || step.orders[0] == order) && (start != 0 || isProduction);

                    let property = manager.map.properties.get(order.to.flatten());
                    if (step.id == 1) {
                        if (property) {
                            if (property.owner != step.country) {
                                order.capture = true;

                                let capture = new BuildCapture();
                                capture.what = property;
                                capture.when = total + order.captureDays;
                                capture.owner = step.country;
                                capture.originalOwner = property.originalOwner;
                                capture.created = order.created;

                                let plan = manager.plans.get(step.country);
                                if (plan) {
                                    let exists = -1;
                                    if (plan.captures.length > 0) {
                                        exists = plan.captures.findIndex(other => other.what.where.x == property.where.x && other.what.where.y == property.where.y);
                                    }
                                    if (exists != -1) {
                                        order.capture = false;
                                    } else {
                                        plan.captures.push(capture);
                                    }
                                }
                            }
                        }
                    }

                    order.start = start;
                    order.total = total + (order.capture ? order.captureDays : 0) + (order.created ? 1 : 0);
                    step.orders.push(order);
                    this.updateMoveOrders();
                    this.recalculateDays();
                } else if (data.alt) {
                    let plan = manager.plans.get(step.country);
                    let orders = step.orders;
                    let index = -1;
                    let prevOrder = null;
                    let deleteOrder = false;

                    for (let order of orders) {
                        let pos = new Vector2i(click.x, click.y);
                        if (orders.at(0) == order && order.from.x == pos.x && order.from.y == pos.y) {
                            index = orders.indexOf(order);
                            deleteOrder = true;
                            break;
                        }
                        if (order.to.x == pos.x && order.to.y == pos.y) {
                            index = orders.indexOf(order);
                            prevOrder = orders[index - 1]
                            break;
                        }
                    }

                    if (index == -1) return;

                    let capture = undefined;
                    for (let c of plan.captures) {
                        if (c.what.where.flatten() == step.orders[index].to.flatten()) {
                            capture = c;
                        }
                    }

                    if (capture) {
                        let i = plan.captures.indexOf(capture);
                        if (i != -1) plan.captures.splice(i, 1);
                    }
                    step.orders.splice(index);

                    if (prevOrder) {
                        lastClick.x = prevOrder.to.x;
                        lastClick.y = prevOrder.to.y;
                    }

                    if (deleteOrder) {
                        this.onDeleteStep(step);
                    }
                    this.updateMoveOrders();
                    this.recalculateDays();
                } else {
                    this.openContextMenu = true;
                }

            },
            onCreateStep(countryCode) {
                let manager = window.BuildOrderManager
                let plan = manager.plans.get(countryCode);
                let step = new BuildStep();

                let map = manager.map;
                let lastClick = this.lastClick;
                let v = new Vector2i(lastClick.x, lastClick.y);

                let property = map.properties.get(v.flatten());
                if (property) {
                    this.currentStepUnitFilter = property.type;
                } else {
                    this.currentStepUnitFilter = "";
                }

                this.updateUnitBuildMenu();

                step.origin = new Vector2i(lastClick.x, lastClick.y)

                step.country = countryCode;
                step.day = this.currentDay;

                this.currentStep = step;
                plan.steps.push(step);
            },
            onSelectStepUnit(id) {
                let manager = window.BuildOrderManager;
                let step = this.currentStep;

                step.id = parseInt(id);
                this.awaitStepCreation = false;
                this.currentStepUnit = id;
            },
            onClickStep(step) {
                if (step == this.currentStep) {
                    this.currentStep = null;
                    this.currentStepUnit = -1;

                    this.updateMoveOrders();
                    return
                }

                this.currentStep = step;
                this.currentStepUnit = step.id;

                if (step.orders.at(-1) != undefined) {
                    this.lastClick.x = step.orders.at(-1).x;
                    this.lastClick.y = step.orders.at(-1).y;
                }

                this.updateMoveOrders();
            },
            onDeleteStep(step) {
                if (!step) return;

                let manager = window.BuildOrderManager;
                let plan = manager.plans.get(step.country);
                if (!plan) return;

                if (plan.steps.indexOf(step) != -1) {
                    plan.steps.splice(plan.steps.indexOf(step), 1);
                }

                for (let order of step.orders) {
                    if (!order.capture) continue;

                    let foundCapture = undefined;
                    for (let capture of plan.captures) {
                        if (capture.when == order.total && capture.what.where.x == order.to.x && capture.what.where.y == order.to.y) {
                            foundCapture = capture;
                            break;
                        }
                    }

                    if (foundCapture) {
                        plan.captures.splice(plan.captures.indexOf(foundCapture), 1);
                    }
                }
                this.currentStep = null;
                this.recalculateDays();
                this.updateMoveOrders();

                this.openContextMenu = false;
            },
            rewindStep(step) {
                if (step.day == 0) return;

                step.day -= 1;
                for (let order of step.orders) {
                    order.start -= 1;
                    order.total -= 1;
                }

                this.recalculateDays();
                this.updateMoveOrders();
            },
            forwardStep(step) {
                step.day += 1;
                for (let order of step.orders) {
                    order.start += 1;
                    order.total += 1;
                }

                this.recalculateDays();
                this.updateMoveOrders();
            },
            updateMoveOrders() {
                let manager = window.BuildOrderManager;
                manager.updateMoves(this.currentDay);

                this.steps = this.getStepList();
            },
            getStepList() {
                let manager = window.BuildOrderManager;
                let steps = [];

                for (let plan of manager.plans.values()) {
                    for (let step of plan.steps) {
                        steps.push(step);
                    }
                }

                steps.sort((a, b) => {
                    if (a.country == b.country) return a.day - b.day;
                    return BaseInfo.countries[a.country].id - BaseInfo.countries[b.country].id;
                });

                return steps;
            },
            updateUnitBuildMenu() {
                let ids = Object.keys(BaseInfo.units);

                ids.sort((a, b) => {
                    let aCost = BaseInfo.units[a].cost;
                    let bCost = BaseInfo.units[b].cost;

                    if (aCost < bCost) return -1;
                    if (bCost < aCost) return 1;
                    return 0;
                })

                let type = this.currentStepUnitFilter;
                let final = [];
                for (let id of ids) {
                    let unit = BaseInfo.units[id];
                    let copy = {};

                    Object.assign(copy, unit);
                    copy.id = id;

                    if (type == "base") {
                        if (unit.move_type == "A" || unit.move_type == "S" || unit.move_type == "L") continue;
                    } else if (type == "airport") {
                        if (unit.move_type != "A") continue;
                    } else if (type == "port") {
                        if (unit.move_type != "S" && unit.move_type != "L") continue;
                    }
                    final.push(copy);
                }

                this.validUnits = final;
            },
            getDay(country) {
                return this.incomeDays.get(country)[this.currentDay];
            },
            recalculateDays() {
                let manager = window.BuildOrderManager;
                this.incomeDays = manager.recalculateDays();
            },
            onSave() {
                let db = window.BuildOrderDatabase;
                db.saveAll(window.mapID);
            },
            refreshPlans() {
                let manager = window.BuildOrderManager;
                let plans = [];
                for (let country of manager.countries) {
                    let allPlans = manager.allPlans.get(country);
                    for (let plan of allPlans) plans.push(plan);
                }

                this.plans = plans;
            },
            onCreatePlan(country, name) {
                let plan = new BuildPlan();
                plan.country = country;
                plan.name = name;

                manager.allPlans.get(country).push(plan);
                this.refreshPlans();
            },
            onSelectPlan(plan) {
                let manager = window.BuildOrderManager;
                manager.plans.set(plan.country, plan);

                this.steps = this.getStepList();
                this.recalculateDays();
                manager.updateMoves(this.currentDay);
            },
            onDeletePlan(plan) {
                let manager = window.BuildOrderManager;
                let plans = manager.allPlans.get(plan.country);
                if (plans.length == 1) {
                    // Reset the only plan, you must always have one.
                    plan.name = "Default"
                    plan.icon = "Infantry";
                    plan.country = plan.country;
                    plan.steps = [];
                    plan.captures = [];
                    this.deletingPlan = null;

                    this.recalculateDays();
                    return
                }
                let index = plans.indexOf(plan);

                if (index == -1) return;
                plans.splice(index, 1);

                let first = plans.at(0);
                manager.plans.set(plan.country, first);

                this.recalculateDays();
                this.refreshPlans();
            },
            onDuplicatePlan(plan) {
                let manager = window.BuildOrderManager;
                let plans = manager.allPlans.get(plan.country);
                let copy = new BuildPlan();
                Object.assign(copy, plan);

                plans.push(copy);
                this.refreshPlans();
            },
            isSelected(plan) {
                let manager = window.BuildOrderManager;
                return manager.plans.get(plan.country) == plan;
            },
            startNaming(plan) {
                this.namingPlan = plan;
                this.editableName = plan.name; // preload
            },
            confirmName(plan) {
                plan.name = this.editableName;
                this.namingPlan = null;

                this.onSave();
            },
            pickIcon(plan, name) {
                plan.icon = name;
                this.iconPlan = undefined;

                this.onSave();
            },
            cancelNaming() {
                this.namingPlan = null;
            },
        },
    });

    let gameContainer = document.querySelector("#gamecontainer");
    if (gameContainer == undefined) return;

    let extensionPanel = document.querySelector("#vesper-extensions");
    if (extensionPanel == undefined) {
        extensionPanel = document.createElement("div");
        extensionPanel.id = "vesper-extensions";

        extensionPanel.style.background = '#98a0b8';
        extensionPanel.style.border = '2px solid #768a96';
        extensionPanel.style.display = 'flex';
        extensionPanel.style.flexDirection = 'row';
        extensionPanel.style.padding = '4px';
        extensionPanel.style.margin = '0px';
        extensionPanel.style.marginLeft = '-4px';
        extensionPanel.style.marginBottom = '8px';

        gameContainer.children[1].after(extensionPanel);
    }

    let e = document.createElement("div");
    e.id = "awbw-essentials";
    extensionPanel.append(e);

    let fP = document.querySelector("#game-header-table");
    let f = fP.querySelector(".bold.underline.game-header-header");
    let bt = f.querySelector(".bordertitle");
    let mapName = bt.innerHTML;
    let mapID = -1;

    let match = bt.outerHTML.match(/maps_id=(\d+)/);

    if (match) {
        mapID = parseInt(match[1]);
        window.mapID = mapID;
    }

    let t = [],
        n = window.mapWidth,
        i = window.mapHeight;
    for (let e = 0; e < n; e++)
        for (let n = 0; n < i; n++) terrainInfo[e] && terrainInfo[e][n] ? t.push(terrainInfo[e][n]) : t.push(buildingsInfo[e][n]);
    let o = Object.keys(BaseInfo.countries).map((e => e)).sort(((e, t) => BaseInfo.countries[e].id - BaseInfo.countries[t].id));
    let unitNames = Object.values(BaseInfo.units).map((e => e.name.toLowerCase().replace(" ", "")))
    let transportFound = false;
    let otherUnitsRead = [];
    let unitsRead = Array.from(window.gameMap.querySelectorAll("span > img"));
    unitsRead = unitsRead.reverse();

    let gridSize = 16;
    let units = unitsRead.map((img, index) => {
        // Access the parent span for position
        let span = img.parentElement;

        // Initialize health variable
        let health = 10; // Default value if no matching image is found
        let healthImage = Array.from(span.querySelectorAll('img')).find(i => {
            return i.src.match(/terrain\/ani\/\d+\.gif$/)
        });

        // Extract x value if the image exists
        if (healthImage) {
            let match = healthImage.src.match(/terrain\/ani\/(\d+)\.gif$/); // Capture x
            if (match) {
                health = parseInt(match[1], 10); // Convert x to an integer
            }
        }

        // Extract left and top values from the span's style attribute
        let left = parseInt(span.style.left, 10);
        let top = parseInt(span.style.top, 10);

        // Calculate grid coordinates
        const x = Math.floor(left / gridSize);
        const y = Math.floor(top / gridSize);

        // Extract the country code from the image src
        let srcParts = img.src.split('/');
        let filename = srcParts[srcParts.length - 1]; // Get last part after the last /
        let country = filename.substring(0, 2); // First two letters before "infantry.gif"
        let unitName = filename.replace(country, "").replace(".gif", "");
        let unitID = -1;
        for (let id of Object.keys(BaseInfo.units)) {
            if (BaseInfo.units[id].name.toLowerCase().replace(" ", "") == unitName) {
                unitID = parseInt(id);
                break;
            }
        }

        if (unitID == -1) return null;

        let u = new Unit(unitID, x, y, country);
        u.health = health;

        // Return the Unit Object.
        return u;
    }).filter(u => u != null);

    let countries = [];
    window.countriesFound = countries;

    window.BuildOrderManager = new BuildOrderManager();
    let manager = window.BuildOrderManager;
    manager.countries = countries;

    let map = manager.map;
    map.height = window.mapHeight;
    map.width = window.mapWidth;

    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            let v = new Vector2i(x, y);
            if (terrainInfo[x] && terrainInfo[x][y]) {
                map.terrainMap.set(v.flatten(), terrainInfo[x][y]);
            } else if (buildingsInfo[x] && buildingsInfo[x][y]) {
                let property = new Property();
                let propertyData = BaseInfo.terrain[buildingsInfo[x][y].terrain_id]

                property.where = v;
                property.originalOwner = propertyData.country;
                property.owner = propertyData.country;
                property.type = propertyData.name.split(" ").at(-1).toLowerCase();
                property.generateIncome = !propertyData.name.includes(" Lab") || !propertyData.name.includes(" Com Tower");

                if (property.type == "silo" || property.type == "empty" || property.type == "seam" || property.type == "rubble") continue;
                if (property.type == "hq" || (property.type == "lab" && property.owner != "")) {
                    if (!countries.includes(propertyData.country)) countries.push(propertyData.country);
                }
                map.properties.set(v.flatten(), property);
            }
        }
    }

    countries.sort((a, b) => {
        return BaseInfo.countries[a].id - BaseInfo.countries[b].id;
    });

    window.AWBWEssentials = new Vue({
        el: "#awbw-essentials",
        template: '<AWBWEssentials ref="essentials" :isKO="isKO" :toKO="toKO" :predeployed="predeployed" :countries="countries" />',
        data: function() {
            return {
                isKO: Object.keys(BaseDamages),
                toKO: ToKO,
                predeployed: units,
                countries: countries,
            }
        }
    });
}

async function loadThisShit() {
    try {
        if (typeof Vue === "undefined") {
            await loadScript("js/vue.js");
        }

        initAWBWEssentials();
    } catch (error) {
        console.error("Failed to load scripts or initialize:", error);
    }
}
window.gameMap = document.getElementById("gamemap")
loadThisShit();