// ==UserScript==
// @name         [1.8] Full Camo & Tracer Script Forward Assault
// @namespace    cs.dev
// @version      1.8
// @description  lets you change skins, unlocks guns, sets tracers, sets gloves, sets character camo.
// @author       iamCS
// @match        https://forward-assault.game-files.crazygames.com/*
// @icon         https://www.google.com/s2/favicons?domain=freeicons.io
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555310/%5B18%5D%20Full%20Camo%20%20Tracer%20Script%20Forward%20Assault.user.js
// @updateURL https://update.greasyfork.org/scripts/555310/%5B18%5D%20Full%20Camo%20%20Tracer%20Script%20Forward%20Assault.meta.js
// ==/UserScript==

console.log("[1.5] Full Camo & Tracer Script Forward Assault");
const CONFIG = {
    visualValues: 1
};
function showBanner(text){
    let el = document.getElementById("fa-banner");
    if(!el){
        el = document.createElement("div");
        el.id = "fa-banner";
        el.style.position = "fixed";
        el.style.top = "10px";
        el.style.left = "50%";
        el.style.transform = "translateX(-50%)";
        el.style.background = "rgba(0,0,0,.9)";
        el.style.color = "white";
        el.style.padding = "10px 16px";
        el.style.fontFamily = "monospace";
        el.style.borderRadius = "10px";
        el.style.zIndex = "999999";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.gap = "10px";

        // message text
        const msg = document.createElement("span");
        msg.id = "fa-banner-text";
        el.appendChild(msg);

        // close button
        const close = document.createElement("div");
        close.textContent = "✖";
        close.style.cursor = "pointer";
        close.style.padding = "2px 6px";
        close.style.background = "rgba(255,255,255,0.15)";
        close.style.borderRadius = "6px";
        close.onclick = () => el.remove();

        el.appendChild(close);
        document.body.appendChild(el);
    }

    document.getElementById("fa-banner-text").textContent = text;
}
showBanner("Skin system loaded successfully! (Press ALT-K for UI)");

// Weapon inventory with barrel and tracer settings
const inventoryWeapons = [
    { id: 1, name: 'AK-47', barrelEnabled:0, tracer:0, camo:0 },
    { id: 2, name: 'Vector', barrelEnabled:1, tracer:0, camo:0 },
    { id: 3, name: 'Desert Eagle', barrelEnabled:0, tracer:0, camo:0 },
    { id: 4, name: 'FAMAS', barrelEnabled:1, tracer:0, camo:0 },
    { id: 5, name: 'M4A1', barrelEnabled:1, tracer:0, camo:0 },
    { id: 6, name: 'M40', barrelEnabled:0, tracer:0, camo:0 },
    { id: 8, name: 'Five Seven', barrelEnabled:1, tracer:0, camo:0 },
    { id: 9, name: 'SPAS-12', barrelEnabled:0, tracer:0, camo:0 },
    { id: 10, name: 'MP7', barrelEnabled:1, tracer:0, camo:0 },
    { id: 12, name: 'P250', barrelEnabled:1, tracer:0, camo:0 },
    { id: 13, name: 'M98', barrelEnabled:0, tracer:0, camo:0 },
    { id: 14, name: 'Knife', barrelEnabled:0, tracer:0, camo:0 },
    { id: 15, name: 'CX-70', barrelEnabled:1, tracer:0, camo:0 },
    { id: 16, name: 'A-91', barrelEnabled:1, tracer:0, camo:0 },
    { id: 19, name: 'PP-2000', barrelEnabled:1, tracer:0, camo:0 },
    { id: 20, name: 'MP5K', barrelEnabled:1, tracer:0, camo:0 },
    { id: 21, name: 'Karambit', barrelEnabled:0, tracer:0, camo:0 },
    { id: 22, name: 'Butterfly Knife', barrelEnabled:0, tracer:0, camo:0 },
    { id: 23, name: 'Tec-9', barrelEnabled:1, tracer:0, camo:0 },
    { id: 24, name: 'M1014', barrelEnabled:0, tracer:0, camo:0 },
    { id: 25, name: 'RFB', barrelEnabled:0, tracer:0, camo:0 },
    { id: 26, name: 'Glock', barrelEnabled:1, tracer:0, camo:0 },
    { id: 27, name: 'Uzi', barrelEnabled:1, tracer:0, camo:0 },
    { id: 28, name: 'FAL', barrelEnabled:1, tracer:0, camo:0 },
    { id: 29, name: 'Hatchet', barrelEnabled:0, tracer:0, camo:0 },
    { id: 30, name: 'MP9', barrelEnabled:1, tracer:0, camo:0 },
    { id: 31, name: 'P90', barrelEnabled:0, tracer:0, camo:0 },
    { id: 32, name: 'AWP', barrelEnabled:0, tracer:0, camo:0 },
    { id: 33, name: 'Huntsman', barrelEnabled:0, tracer:0, camo:0 },
    { id: 34, name: 'Beretta', barrelEnabled:1, tracer:0, camo:0 },
    { id: 35, name: 'Brass Knuckles', barrelEnabled:0, tracer:0, camo:0 },
    { id: 36, name: 'USP 45', barrelEnabled:1, tracer:0, camo:0 },
    { id: 37, name: 'Tecmix Knife', barrelEnabled:0, tracer:0, camo:0 },
    { id: 38, name: 'Kukri', barrelEnabled: 0, tracer: 0, camo: 0 }
];
const SKINS = [
    { name: "None", id: 0 },
    { name: "Wild", id: 1 },
    { name: "Arctic Digital",id: 14 },
    { name: "Cherry", id: 2 },
    { name: "Moderno", id: 48 },
    { name: "Pool Water", id: 47 },
    { name: "Gardens", id: 49 },
    { name: "Soap", id: 50 },
    { name: "Hunter", id: 24 },
    { name: "Urban Pheonix", id: 26 },
    { name: "Hot Rod", id: 20 },
    { name: "Rising Soul", id: 19 },
    { name: "Wirey", id: 52 },
    { name: "Radiation", id: 53 },
    { name: "Stone Heads", id: 54 },
    { name: "Red Death", id: 55 },
    { name: "Creeps", id: 56 },
    { name: "Lizard Skin", id: 57 },
    { name: "Burning Sky", id: 58 },
    { name: "Samurai", id: 59 },
    { name: "Shooting Stars", id: 60 },
    { name: "Gummies", id: 61 },
    { name: "Hot Oak", id: 13 },
    { name: "Volcanic", id: 3 },
    { name: "Lizard", id: 15 },
    { name: "Node", id: 4 },
    { name: "Elite", id: 5 },
    { name: "Veteran", id: 6 },
    { name: "Metro", id: 7 },
    { name: "Waves", id: 8 },
    { name: "Bubble Gum", id: 9 },
    { name: "Flow", id: 10 },
    { name: "Plasma", id: 11 },
    { name: "Sport", id: 12 },
    { name: "Gold Digger", id: 16 },
    { name: "Royal", id: 22 },
    { name: "Nuclear", id: 27 },
    { name: "Bamboo", id: 28 },
    { name: "Nexus", id: 29 },
    { name: "Holographic", id: 43 },
    { name: "Red Light", id: 45 },
    { name: "Green Light", id: 51 },
    { name: "Golden", id: 46 },
    { name: "Basilisk", id: 81 },
    { name: "Beach Time", id: 79 },
    { name: "Galactic Putty", id: 80 },
    { name: "Galaxy", id: 72 },
    { name: "Glass", id: 82 },
    { name: "Hardened", id: 17 },
    { name: "Invisible", id: 84 },
    { name: "Purple Light", id: 70 },
    { name: "Seaside", id: 75 },
    { name: "Atlantic", id: 36 },
    { name: "Biohazard", id: 38 },
    { name: "Comic", id: 30 },
    { name: "Interstellar", id: 37 },
    { name: "Generic Leopard", id: 33 },
    { name: "Melancholy Hill", id: 42 },
    { name: "Metalcamo", id: 34 },
    { name: "Monochrome", id: 35 },
    { name: "Mystery Hollow", id: 41 },
    { name: "Relentless Skulls", id: 39 },
    { name: "Skeleton Fallout", id: 40 },
    { name: "Snakeskin", id: 32 },
    { name: "Super Sonic", id: 31 },
    { name: "Speed", id: 1004 },
    { name: "Leopard", id: 1005 },
    { name: "RIP", id: 1011 },
    { name: "Feather", id: 1012 },
    { name: "Patriot", id: 1016 },
    { name: "Hypebeast", id: 1018 },
    { name: "Loyalty", id: 1021 },
    { name: "Overpowered", id: 1030 },
    { name: "Summper Cup", id: 1039 },
    { name: "Haunted", id: 1040 },
    { name: "Witch", id: 1041 },
    { name: "Russia", id: 1058 },
    { name: "Gankstars", id: 1064 },
    { name: "Liquid", id: 1068 },
    { name: "Linear Force", id: 1079 },
    { name: "Rektores", id: 1082 },
    { name: "Gravedigger", id: 1084 },
    { name: "Logistics", id: 1093 },
    { name: "Christmas", id: 1019 },
    { name: "Blood Crow", id: 1080 },
    { name: "D2RWIN", id: 1065 },
    { name: "Isaamov", id: 1090 },
    { name: "Battle Of Glory", id: 1060 },
    { name: "Complex", id: 1069 },
    { name: "Venomous", id: 1106 },
    { name: "Ravage", id: 1092 },
    { name: "Octamos", id: 1102 },
    { name: "Prime Venom", id: 1095 },
    { name: "Antique", id: 1061 },
    { name: "USA", id: 1055 },
    { name: "Fury", id: 1032 },
    { name: "Flaming Death", id: 1094 },
    { name: "Frostbite", id: 1089 },
    { name: "Kea", id: 1088 },
    { name: "Hitman", id: 1085 },
    { name: "BloodMoon", id: 1083 },
    { name: "Atlas", id: 1023 },
    { name: "Reaper", id: 1104 },
    { name: "Hard Edge", id: 1105 },
    { name: "Futuro", id: 1099 },
    { name: "Prime", id: 1087 },
    { name: "Scarecrow", id: 1042 },
    { name: "GA83", id: 1035 },
    { name: "Valentine", id: 1020 },
    { name: "Brave", id: 1017 },
    { name: "Tropicana", id: 1096 },
    { name: "Skeleton", id: 1043 },
    { name: "Lime", id: 1026 },
    { name: "Voodoo", id: 1008 },
    { name: "Fade", id: 1077 },
    { name: "Convolution", id: 1075 },
    { name: "Reaper", id: 1067 },
    { name: "Crime Queen", id: 1070 },
    { name: "Thunder", id: 1002 },
    { name: "Marine", id: 1066 },
    { name: "Joker", id: 1107 },
    { name: "Odyssey", id: 1103 },
    { name: "Jali", id: 1101 },
    { name: "Hazard", id: 1006 },
    { name: "Toxic", id: 1009 },
    { name: "Beast", id: 1015 },
    { name: "Style", id: 1028 },
    { name: "Noble", id: 1031 },
    { name: "Zombie", id: 1045 },
    { name: "Plague", id: 1013 },
    { name: "Mayan", id: 1097 },
    { name: "Blood Rush", id: 1029 },
    { name: "Ghost", id: 1046 },
    { name: "Icy", id: 1086 },
    { name: "Blayze", id: 76 },
    { name: "Surge", id: 1010 },
    { name: "Electric", id: 1003 },
    { name: "Swirl", id: 1014 },
    { name: "Spider", id: 1044 },
    { name: "Icestorm", id: 1074 },
    { name: "Holy War", id: 1022 },
    { name: "Pumpkin", id: 1047 },
    { name: "Pixaqua", id: 1109 },
    { name: "Pixaqua", id: 78 },
    { name: "Mystic", id: 1053 },
    { name: "Print Theme", id: 1081 },
    { name: "Cosmos", id: 1025 },
    { name: "Freedom", id: 1073 },
    { name: "Digitron", id: 1098 },
    { name: "Pride", id: 1033 },
    { name: "Samurai", id: 1100 },
    { name: "Berzerk", id: 1091 },
    { name: "Basilisk", id: 1108 },
    { name: "Sky", id: 1024 },
    { name: "Brazil", id: 1057 },
    { name: "Ramses", id: 1034 },
    { name: "Blaze", id: 1036 },
    { name: "Luxus", id: 1037 },
    { name: "Retro", id: 1038 },
    { name: "The Forest", id: 1071 },
    { name: "Dark Beetle", id: 1048 },
    { name: "Athlete", id: 1049 },
    { name: "Tiger", id: 1050 },
    { name: "Techno", id: 1051 },
    { name: "Techno", id: 1056 },
    { name: "Bear", id: 1052 },
    { name: "Ancient Script", id: 1054 },
    { name: "UK", id: 1059 },
    { name: "Art Of Warfare", id: 1063 },
    { name: "The Princess", id: 1072 },
    { name: "Ice Lion", id: 1076 },
    { name: "Flowing", id: 1078 },
    { name: "Florecent", id: 10001 }
];
const GLOVES_SKINS = [
    { name: "None", id: 0 },
    { name: "Bandage", id: 67 },
    { name: "Bronze", id: 65 },
    { name: "Galaxy", id: 58 },
    { name: "Aqua", id: 54 },
    { name: "Bamboo", id: 36 },
    { name: "Battle Of Glory", id: 45 },
    { name: "Blaze", id: 16 },
    { name: "Boss", id: 17 },
    { name: "Brazil", id: 40 },
    { name: "Cosmos", id: 48 },
    { name: "Crosshairs", id: 9 },
    { name: "Danger", id: 52 },
    { name: "Desert", id: 18 },
    { name: "Disco", id: 5 },
    { name: "Disco2", id: 38 },
    { name: "Endurance", id: 53 },
    { name: "Feather", id: 50 },
    { name: "Forest", id: 1 },
    { name: "Ghost", id: 29 },
    { name: "Gold Snake", id: 49 },
    { name: "Gore", id: 8 },
    { name: "Goth", id: 34 },
    { name: "Haunted", id: 23 },
    { name: "Hazard", id: 7 },
    { name: "Hex", id: 2 },
    { name: "Hitman", id: 46 },
    { name: "Hornet", id: 19 },
    { name: "Infected", id: 12 },
    { name: "Joker", id: 6 },
    { name: "Kazam", id: 10 },
    { name: "Leopard", id: 14 },
    { name: "Loyalty", id: 43 },
    { name: "Luxus", id: 21 },
    { name: "Maze", id: 4 },
    { name: "Mechanism", id: 15 },
    { name: "Nexus", id: 37 },
    { name: "Nine Lives", id: 51 },
    { name: "Node", id: 32 },
    { name: "Nuclear", id: 35 },
    { name: "Overpowered", id: 47 },
    { name: "Prince", id: 20 },
    { name: "Pumpkin", id: 30 },
    { name: "Quadratic", id: 13 },
    { name: "Ramses", id: 11 },
    { name: "Retro", id: 22 },
    { name: "Scarecrow", id: 25 },
    { name: "Season 1", id: 41 },
    { name: "Season 2", id: 42 },
    { name: "Season 3", id: 44 },
    { name: "Skeleton", id: 26 },
    { name: "Snake", id: 3 },
    { name: "Spider", id: 27 },
    { name: "Tiger", id: 31 },
    { name: "Volcanic", id: 33 },
    { name: "Waves", id: 39 },
    { name: "Witch", id: 24 },
    { name: "Zombie", id: 28 },
    { name: "Gold Royale", id: 64 },
    { name: "Graffiti", id: 61 },
    { name: "RGB", id: 55 },
    { name: "Red Blue", id: 56 },
    { name: "Red Reaper", id: 59 },
    { name: "RIP 2.0", id: 63 },
    { name: "Samurai", id: 62 },
    { name: "Sand", id: 57 },
    { name: "Skelly", id: 60 },
    { name: "Webbed", id: 66 }
]
const CHARACTER_CAMO = [
    { name: "None", id: 0 },
    { name: "Artic", id: 3 },
    { name: "Chrome Royale", id: 8 },
    { name: "Gold Royale", id: 7 },
    { name: "Gore", id: 1 },
    { name: "RGB", id: 5 },
    { name: "RGB Royale", id: 9 },
    { name: "Sand", id: 6 },
    { name: "Snake", id: 2 },
    { name: "Splatter", id: 4 }
]

const WEAPON_SKIN_SETS = {
    1: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,16,22,27,28,29,43,45,51,46,81,79,80,72,82,84,70,75,36,38,30,37,33,42,34,35,41,39,40,32,31,1004,1005,1101,1012,1016,1018,1021,1030,1039,1040,1041,1058,1064,1068,1079,1082,1084,1093,1101],
    2: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,16,22,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1032,1055,1061,1095,1102],
    3: [0,1,5,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1002,1011,1017,1021,1023,1083,1085,1088,1089,1094],
    4: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1011,1012,1020,1031,1085,1104],
    5: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1007,1016,1017,1020,1035,1042,1087],
    6: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,16,22,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1004,1008,1012,1026,1045,1089],
    8: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1006,1009,1015,1020,1028],
    9: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1013,1097],
    10: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1006,1009,1012,1019,1029,1030,1046,1086],
    12: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,76,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1008,1010,1012,1020,1027,1039,1064,1068,1082,1084],
    13: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1003,1004,1011,1014,1019,1044,1074],
    14: [0,50,52,53,54,55,56,57,58,59,60,61,19,17,24,46,79,80,72,30,1004,1012,1017,1020,1022],
    15: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1011,1012,1099,1105],
    16: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1010,1017,1020,1043,1096],
    19: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1015,1020],
    20: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1004,1011,1012,1047,1109],
    21: [0,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,5,8,9,26,46,79,80,72,78,30,1004,1008,1009,1012,1015,1016,1019,1021,1039,1046,1047,1053,1060,1068,1081,1083,1086,1103],
    22: [0,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,5,8,9,26,46,79,80,72,78,30,1010,1011,1012,1020,1025,1066,1073,1087,1089,1090],
    23: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1004,1016,1019,1087],
    24: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1098],
    25: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,21,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1016,1033,1100],
    26: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1012,1016,1017,1019,1030,1091,1108],
    27: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1004,1012,1024],
    28: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,15,4,5,6,7,8,9,10,11,12,16,22,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,10000,1012,1019,1021,1041,1053,1057,1060,1065,1069,1080,1090,1092,1106],
    29: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,1034,1036,1037,1038,1040,1041,1042,1043,1044,1045,1084,1085,1088,1107],
    30: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1071],
    31: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1048,1049,1050,1051,1056,1088],
    32: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1052,1053,1054,1059,1063,1072,1083,1103],
    33: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,10001,1004,1032,1062,1064,1070,1082],
    34: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,1067,1075],
    35: [0,79,80,72],
    36: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,1076,1078],
    37: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31,83,1077],
    38: [0,1,14,2,48,47,49,50,52,53,54,55,56,57,58,59,60,61,13,3,11,12,20,27,28,29,43,45,51,46,79,80,72,82,84,70,36,38,30,37,33,42,34,35,41,39,40,32,31],
};

function getSkinsForWeapon(weaponId){
    const allowedIds = WEAPON_SKIN_SETS[weaponId];

    // if no entry → fallback to full list
    if(!allowedIds) return SKINS;

    return SKINS.filter(s => allowedIds.includes(s.id));
}
function setCookie(name, value, days = 365) {
    try {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
    } catch(e){
        console.warn("Cookie write failed", e);
    }
}

function getCookie(name) {
    try {
        const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return m ? JSON.parse(decodeURIComponent(m[2])) : {};
    } catch(e){
        console.warn("Cookie read failed", e);
        return {};
    }
}
async function saveSaved(data) {
    setCookie("FA_SKIN_CONFIG", data);
}

async function loadSaved() {
    return getCookie("FA_SKIN_CONFIG");
}
//UI
async function applySavedToInventory() {
    const saved = await loadSaved();

    inventoryWeapons.forEach(w => {
        if (!saved[w.id]) return;
        Object.assign(w, saved[w.id]);
    });

    await saveSaved(saved);
}
    let panel;

    async function createUI() {
        if (panel) return;

        const saved = await loadSaved();

        panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "80px";
        panel.style.right = "20px";
        panel.style.padding = "12px";
        panel.style.background = "rgba(0,0,0,.9)";
        panel.style.color = "white";
        panel.style.zIndex = "999999";
        panel.style.borderRadius = "10px";
        panel.style.fontFamily = "monospace";
        panel.style.width = "260px";
        panel.style.maxHeight = "80vh";
        panel.style.overflowY = "auto";

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "8px";


        //Dragging
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let panelX = 0;
        let panelY = 0;

        header.style.cursor = "move";

        header.addEventListener("mousedown", e => {
            isDragging = true;

            // switch to left positioning if currently using right
            if (panel.style.right) {
                const rect = panel.getBoundingClientRect();
                panel.style.left = rect.left + "px";
                panel.style.top = rect.top + "px";
                panel.style.right = "";
            }

            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            panelX = rect.left;
            panelY = rect.top;

            document.body.style.userSelect = "none";
        });

        window.addEventListener("mousemove", e => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            panel.style.left = (panelX + dx) + "px";
            panel.style.top  = (panelY + dy) + "px";
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
            document.body.style.userSelect = "";
        });


        const title = document.createElement("b");
        title.textContent = "Weapon Skin Editor (Select & Refresh)";

        // Close Button
        const closeBtn = document.createElement("div");
        closeBtn.textContent = "✖";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.padding = "2px 6px";
        closeBtn.onclick = () => {
            panel.remove();
            panel = null;
        };

        const rightControls = document.createElement("div");
        rightControls.style.display = "flex";
        rightControls.style.gap = "6px";
        rightControls.appendChild(closeBtn);

        header.appendChild(title);
        header.appendChild(rightControls);
        panel.appendChild(header);


        //Gloves Select
        const glovesRow = document.createElement("div");
        glovesRow.style.marginBottom = "10px";
        glovesRow.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
        glovesRow.style.paddingBottom = "6px";

        const glovesTitle = document.createElement("div");
        glovesTitle.textContent = "Gloves";
        glovesTitle.style.fontWeight = "bold";
        glovesTitle.style.marginBottom = "4px";

        const glovesSelect = document.createElement("select");
        glovesSelect.style.width = "100%";

        GLOVES_SKINS.forEach(g=>{
            const o=document.createElement("option");
            o.value=g.id;
            o.textContent=`${g.name} (${g.id})`;

            if((saved.gloves ?? 0) == g.id) o.selected=true;

            glovesSelect.appendChild(o);
        });

        glovesSelect.addEventListener("change", async ()=>{
            const data = await loadSaved();
            const raw = Number(glovesSelect.value);

            data.gloves = raw;
            data.glovesSkinID = raw === 0 ? 0 : 90000 + raw;

            await saveSaved(data);
        });

        glovesRow.appendChild(glovesTitle);
        glovesRow.appendChild(glovesSelect);
        panel.appendChild(glovesRow);

        //Character Select
        const charRow = document.createElement("div");
        charRow.style.marginBottom = "10px";
        charRow.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
        charRow.style.paddingBottom = "6px";

        const charTitle = document.createElement("div");
        charTitle.textContent = "Character Skin";
        charTitle.style.fontWeight = "bold";
        charTitle.style.marginBottom = "4px";

        const charSelect = document.createElement("select");
        charSelect.style.width="100%";

        CHARACTER_CAMO.forEach(c=>{
            const o=document.createElement("option");
            o.value=c.id;
            o.textContent=`${c.name} (${c.id})`;

            if((saved.character ?? 0) == c.id) o.selected=true;

            charSelect.appendChild(o);
        });

        charSelect.addEventListener("change", async ()=>{
            const data = await loadSaved();
            const raw = Number(charSelect.value);

            data.character = raw;
            data.characterSkinID = raw === 0 ? 0 : 90000 + raw;

            await saveSaved(data);
        });

        charRow.appendChild(charTitle);
        charRow.appendChild(charSelect);
        panel.appendChild(charRow);

        inventoryWeapons.forEach(w => {
            const row = document.createElement("div");
            row.style.marginBottom = "10px";
            row.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
            row.style.paddingBottom = "6px";

            const weaponTitle = document.createElement("div");
            weaponTitle.textContent = `${w.name} (ID: ${w.id})`;
            weaponTitle.style.fontWeight = "bold";
            weaponTitle.style.marginBottom = "4px";

            // Skin dropdown
            const skinSelect = document.createElement("select");
            skinSelect.style.width = "100%";
            const skinList = getSkinsForWeapon(w.id);

            skinList.forEach(s => {
                const o = document.createElement("option");
                o.value = s.id;
                o.textContent = `${s.name} (${s.id})`;

                const current = saved[w.id]?.camo ?? w.camo;
                if (current == s.id) o.selected = true;

                skinSelect.appendChild(o);
            });

            // Barrel checkbox
            const barrelCheckbox = document.createElement("input");
            barrelCheckbox.type = "checkbox";
            barrelCheckbox.checked = saved[w.id]?.barrelEnabled ?? w.barrelEnabled;

            // Tracer select
            const tracerSelect = document.createElement("select");
            [0,1,2,3,4].forEach(v=>{
                const o=document.createElement("option");
                o.value=v;
                o.textContent="Tracer "+v;
                if((saved[w.id]?.tracer ?? w.tracer) == v) o.selected=true;
                tracerSelect.appendChild(o);
            });

            async function update() {
                const data = await loadSaved();
                const raw = Number(skinSelect.value);

                // If "None" → delete the weapon entry entirely
                if (raw === 0) {
                    delete data[w.id];
                } else {
                    data[w.id] = {
                        camo: raw,
                        barrelEnabled: barrelCheckbox.checked ? 1 : 0,
                        tracer: Number(tracerSelect.value),
                        skinID: 90000 + raw
                    };
                }

                await saveSaved(data);

                // apply to runtime weapon object
                Object.assign(w, data[w.id] || {
                    camo: 0,
                    barrelEnabled: 0,
                    tracer: 0,
                    skinID: 0
                });

            }
            skinSelect.addEventListener("change", update);
            barrelCheckbox.addEventListener("change", update);
            tracerSelect.addEventListener("change", update);

            row.appendChild(weaponTitle);
            row.appendChild(skinSelect);

            const smallRow = document.createElement("div");
            smallRow.style.display="flex";
            smallRow.style.gap="6px";
            smallRow.style.marginTop="4px";

            const barrelLabel = document.createElement("label");
            barrelLabel.textContent="Barrel ";
            barrelLabel.appendChild(barrelCheckbox);

            smallRow.appendChild(barrelLabel);
            smallRow.appendChild(tracerSelect);

            row.appendChild(smallRow);
            panel.appendChild(row);
        });

        document.body.appendChild(panel);
    }

    // Show on load
window.addEventListener("load", async () => {
    await createUI();
    await applySavedToInventory();
});

document.addEventListener("keydown", e => {
  if (e.altKey && e.key.toLowerCase() === "k") {
    createUI();
  }
});

const originalFetch = window.fetch;

window.fetch = async function(...args) {
    const url = args[0];
    const options = args[1] || {};

    // Intercept get_player_skins.php
    if (url.includes('get_player_skins.php')) {

        const saved = getCookie("FA_SKIN_CONFIG") || {};

        const fakeSkins = [];
        let i = 0;

        function fakeSkinIDForWeapon(weaponId){
            return 90000 + Number(weaponId);
        }

        for (const weaponId in saved) {

            const entry = saved[weaponId];
            if (!entry || typeof entry.camo === "undefined") continue;

            fakeSkins.push({
                skinID: fakeSkinIDForWeapon(entry.camo),
                type: "weapon",
                camoID: Number(entry.camo),     // still send camo to server
                weaponType: Number(weaponId),
                condition: 0,
                offset: 0.99,
                dateCreated: "2025-01-01 00:00:01",
                source: "cookie"
            });

            // also persist `skinID` into cookie so XML can use it
        }
        // GLOVES
        if(saved.gloves && saved.gloves != 0){
            fakeSkins.push({
                skinID: 90000 + Number(saved.gloves),
                type: "gloves",
                camoID: Number(saved.gloves),
                weaponType: null,
                condition: 0,
                offset: 0.99,
                dateCreated: "2025-01-01 00:00:01",
                source: "cookie"
            });
        }

        // CHARACTER
        if(saved.character && saved.character != 0){
            fakeSkins.push({
                skinID: 90000 + Number(saved.character),
                type: "character",
                camoID: Number(saved.character),
                weaponType: null,
                condition: 0,
                offset: 0.99,
                dateCreated: "2025-01-01 00:00:01",
                source: "cookie"
            });
        }

        return new Response(
            JSON.stringify({
                status: 1,
                ownedSkins: fakeSkins,
                count: fakeSkins.length,
                totalCount: fakeSkins.length,
                page: 1,
                totalPages: 1,
                hasMore: false,
                targetFound: false
            }),
            { status: 200, headers: { "Content-Type": "application/json" }}
        );
    }

    // Disabling Error Reporting to senderrorreport.php
    if (url.includes('senderrorreport.php')) {
        options.body = null;
        return new Response("", {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
        return originalFetch(...args);
    }

    // Handle getaccountinfoWebglV5.php
    if (!url.includes('getaccountinfoWebglV5.php')) {
        return originalFetch(...args);
    }

    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    const originalText = await clonedResponse.text();

    try {
        // Find the XML section
        const xmlStart = originalText.indexOf('<?xml');
        const xmlEnd = originalText.indexOf('</AS_CustomInfo>') + '</AS_CustomInfo>'.length;

        if (xmlStart === -1 || xmlEnd === -1) {
            console.log("Could not find XML section");
            return response;
        }

        // Extract the three parts
        const beforeXml = originalText.substring(0, xmlStart);
        const xmlContent = originalText.substring(xmlStart, xmlEnd);
        const afterXml = originalText.substring(xmlEnd);

        let modifiedBeforeXml = beforeXml;

        // Parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

        // Modify totalGoldBought tag
        const totalGoldBoughtTag = xmlDoc.getElementsByTagName('totalGoldBought')[0];
        if (totalGoldBoughtTag) {
            totalGoldBoughtTag.textContent = 100000;
        } else {
            console.log("Could not find totalGoldBought tag");
        }

        // Modify credits and gold just so its a visual change
        const creditsTag = xmlDoc.getElementsByTagName('credits')[0];
        if (creditsTag) {
            creditsTag.textContent = CONFIG.visualValues;
        } else {
            console.log("Could not find creditsTag tag");
        }
        const goldTag = xmlDoc.getElementsByTagName('gold')[0];
        if (goldTag) {
            goldTag.textContent = CONFIG.visualValues;
        } else {
            console.log("Could not find goldTag tag");
        }

        const weaponInfoParent = xmlDoc.getElementsByTagName('weaponInfo')[0];

        if (weaponInfoParent) {

            let cookie = {};
            try {
                cookie = getCookie("FA_SKIN_CONFIG") || {};
            } catch(e){
                cookie = {};
            }

            // index current WeaponInfo nodes by weapon ID
            const existingNodes = {};
            const infoList = weaponInfoParent.getElementsByTagName("WeaponInfo");

            for (let i = 0; i < infoList.length; i++) {
                const type = infoList[i].getElementsByTagName("type")[0];
                if (!type) continue;
                existingNodes[ Number(type.textContent) ] = infoList[i];
            }

            inventoryWeapons.forEach(w => {

                // Get / Create node
                let node = existingNodes[w.id];
                if (!node) {
                    node = xmlDoc.createElement("WeaponInfo");
                    weaponInfoParent.appendChild(node);
                }

                // wipe children to avoid duplicate subnodes
                while (node.firstChild)
                    node.removeChild(node.firstChild);

                // load saved cookie config for this weapon
                const saved =
                      cookie[w.id] ||
                      cookie[String(w.id)] ||
                      {};
                const barrel = ("barrelEnabled" in saved) ? saved.barrelEnabled : (w.barrelEnabled ?? 0);
                const tracer = ("tracer"        in saved) ? saved.tracer        : (w.tracer ?? 0);
                const skinID = ("skinID"            in saved) ? saved.skinID : 0; //default is 0

                const typeEl = xmlDoc.createElement("type");
                typeEl.textContent = String(w.id);
                node.appendChild(typeEl);

                const customizationsEl = xmlDoc.createElement("customizations");
                customizationsEl.textContent =
                    `Barrel*U-*E-${barrel}_Camo*U-*E-${skinID}_Tracer*U-*E-${tracer}_`;
                node.appendChild(customizationsEl);

                const unlockedEl = xmlDoc.createElement("unlocked");
                unlockedEl.textContent = "1";
                node.appendChild(unlockedEl);
            });

        }

        // Serialize back to string
        const serializer = new XMLSerializer();
        const modifiedXml = serializer.serializeToString(xmlDoc);

        // Reconstruct the full response
        const modifiedText = modifiedBeforeXml + modifiedXml + afterXml;

        return new Response(modifiedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

    } catch (error) {
        return response;
    }
};