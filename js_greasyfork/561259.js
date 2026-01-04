// ==UserScript==
// @name         Leekwars Tools
// @namespace    http://tampermonkey.net/
// @version      2025-07-15
// @description  Leekwars QOL tools
// @source       https://github.com/Bux42/Leekwars-Tampermonkey
// @author       Bux42
// @match        https://leekwars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leekwars.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561259/Leekwars%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/561259/Leekwars%20Tools.meta.js
// ==/UserScript==

const componentNamesToIds = {
  COMPONENT_CORE: 1,
  COMPONENT_CORE2: 2,
  COMPONENT_CORE3: 3,
  COMPONENT_BATTERY: 4,
  COMPONENT_IRON_PLATE: 5,
  COMPONENT_AMAZONITE_PLATE: 6,
  COMPONENT_OBSIDIAN_PLATE: 7,
  COMPONENT_SPRING: 8,
  COMPONENT_COPPER_SPRING: 9,
  COMPONENT_ELINVAR_SPRING: 10,
  COMPONENT_SSD: 11,
  COMPONENT_NUCLEAR_CORE: 12,
  COMPONENT_FAN: 13,
  COMPONENT_SDCARD: 14,
  COMPONENT_CD: 15,
  COMPONENT_NEURAL_CORE: 16,
  COMPONENT_NEURAL_CORE_PRO: 17,
  COMPONENT_POWER_SUPPLY: 18,
  COMPONENT_CHIYEMBEKEZO: 19,
  COMPONENT_UZOMA: 20,
  COMPONENT_KIRABO: 21,
  COMPONENT_LIMBANI: 22,
  COMPONENT_THOKOZANI: 23,
  COMPONENT_RAM: 24,
  COMPONENT_RAM2: 25,
  COMPONENT_RAM3: 26,
  COMPONENT_MOTHERBOARD: 27,
  COMPONENT_PROPULSOR: 28,
  COMPONENT_PROPULSOR2: 29,
  COMPONENT_MORUS: 30,
  COMPONENT_HYLOCEREUS: 31,
  COMPONENT_APPLE: 32,
  COMPONENT_NEPHELIUM: 33,
  COMPONENT_BLUE_MANGO: 34,
  COMPONENT_WATERCOOLING: 35,
  COMPONENT_STRAWBERRY: 36,
  COMPONENT_CHESTNUT: 37,
  COMPONENT_BLUE_PLUM: 38,
  COMPONENT_KIWI: 39,
  COMPONENT_QUINCE: 40,
  COMPONENT_ONION: 41,
  COMPONENT_ORANGE: 42,
  COMPONENT_SOURSOP: 43,
  COMPONENT_HOKAJIN: 44,
  COMPONENT_PEAR: 45,
  COMPONENT_MOTHERBOARD2: 46,
  COMPONENT_MOTHERBOARD3: 47,
  COMPONENT_SWITCH: 48,
  COMPONENT_SWITCH2: 49,
  COMPONENT_RGB: 50,
  COMPONENT_RECOVERY_CORE: 52,
  COMPONENT_RECOVERY_RAM: 53,
};

const chipNamesToIds = {
  CHIP_BANDAGE: 3,
  CHIP_CURE: 4,
  CHIP_DRIP: 10,
  CHIP_REGENERATION: 35,
  CHIP_VACCINE: 11,
  CHIP_SHOCK: 1,
  CHIP_FLASH: 6,
  CHIP_LIGHTNING: 33,
  CHIP_SPARK: 18,
  CHIP_FLAME: 5,
  CHIP_METEORITE: 36,
  CHIP_PEBBLE: 19,
  CHIP_ROCK: 7,
  CHIP_ROCKFALL: 32,
  CHIP_ICE: 2,
  CHIP_STALACTITE: 30,
  CHIP_ICEBERG: 31,
  CHIP_SHIELD: 20,
  CHIP_HELMET: 21,
  CHIP_ARMOR: 22,
  CHIP_WALL: 23,
  CHIP_RAMPART: 24,
  CHIP_FORTRESS: 29,
  CHIP_PROTEIN: 8,
  CHIP_STEROID: 25,
  CHIP_DOPING: 26,
  CHIP_STRETCHING: 9,
  CHIP_WARM_UP: 28,
  CHIP_REFLEXES: 27,
  CHIP_LEATHER_BOOTS: 14,
  CHIP_WINGED_BOOTS: 13,
  CHIP_SEVEN_LEAGUE_BOOTS: 12,
  CHIP_MOTIVATION: 15,
  CHIP_ADRENALINE: 16,
  CHIP_RAGE: 17,
  CHIP_LIBERATION: 34,
  CHIP_TELEPORTATION: 59,
  CHIP_ARMORING: 67,
  CHIP_INVERSION: 68,
  CHIP_PUNY_BULB: 73,
  CHIP_FIRE_BULB: 74,
  CHIP_HEALER_BULB: 75,
  CHIP_ROCKY_BULB: 76,
  CHIP_ICED_BULB: 77,
  CHIP_LIGHTNING_BULB: 78,
  CHIP_METALLIC_BULB: 79,
  CHIP_REMISSION: 80,
  CHIP_CARAPACE: 81,
  CHIP_RESURRECTION: 84,
  CHIP_DEVIL_STRIKE: 85,
  CHIP_WHIP: 88,
  CHIP_LOAM: 89,
  CHIP_FERTILIZER: 90,
  CHIP_ACCELERATION: 91,
  CHIP_SLOW_DOWN: 92,
  CHIP_BALL_AND_CHAIN: 93,
  CHIP_TRANQUILIZER: 94,
  CHIP_SOPORIFIC: 95,
  CHIP_SOLIDIFICATION: 96,
  CHIP_VENOM: 97,
  CHIP_TOXIN: 98,
  CHIP_PLAGUE: 99,
  CHIP_THORN: 100,
  CHIP_MIRROR: 101,
  CHIP_FEROCITY: 102,
  CHIP_COLLAR: 103,
  CHIP_BARK: 104,
  CHIP_BURNING: 105,
  CHIP_FRACTURE: 106,
  CHIP_ANTIDOTE: 110,
  CHIP_PUNISHMENT: 114,
  CHIP_COVETOUSNESS: 120,
  CHIP_VAMPIRIZATION: 121,
  CHIP_PRECIPITATION: 122,
  CHIP_ALTERATION: 141,
  CHIP_WIZARD_BULB: 142,
  CHIP_PLASMA: 143,
  CHIP_JUMP: 144,
  CHIP_COVID: 152,
  CHIP_ELEVATION: 154,
  CHIP_KNOWLEDGE: 155,
  CHIP_WIZARDRY: 156,
  CHIP_REPOTTING: 157,
  CHIP_THERAPY: 158,
  CHIP_MUTATION: 159,
  CHIP_DESINTEGRATION: 160,
  CHIP_TRANSMUTATION: 161,
  CHIP_GRAPPLE: 162,
  CHIP_BOXING_GLOVE: 163,
  CHIP_CORN: 164,
  CHIP_CHILLI_PEPPER: 165,
  CHIP_TACTICIAN_BULB: 166,
  CHIP_SAVANT_BULB: 167,
  CHIP_SERUM: 168,
  CHIP_CRUSHING: 169,
  CHIP_BRAINWASHING: 170,
  CHIP_ARSENIC: 171,
  CHIP_BRAMBLE: 172,
  CHIP_DOME: 173,
  CHIP_MANUMISSION: 174,
  CHIP_PRISM: 276,
  CHIP_SHURIKEN: 411,
  CHIP_KEMURIDAMA: 412,
  CHIP_FIRE_BALL: 413,
  CHIP_TREBUCHET: 414,
  CHIP_AWEKENING: 415,
  CHIP_THUNDER: 416,
  CHIP_KILL: 417,
  CHIP_APOCALYPSE: 418,
  CHIP_DIVINE_PROTECTION: 419,
};

const weaponNamesToIds = {
  WEAPON_PISTOL: 37,
  WEAPON_MACHINE_GUN: 38,
  WEAPON_DOUBLE_GUN: 39,
  WEAPON_SHOTGUN: 41,
  WEAPON_MAGNUM: 45,
  WEAPON_LASER: 42,
  WEAPON_GRENADE_LAUNCHER: 43,
  WEAPON_FLAME_THROWER: 46,
  WEAPON_DESTROYER: 40,
  WEAPON_GAZOR: 48,
  WEAPON_ELECTRISOR: 44,
  WEAPON_M_LASER: 47,
  WEAPON_B_LASER: 60,
  WEAPON_KATANA: 107,
  WEAPON_BROADSWORD: 108,
  WEAPON_AXE: 109,
  WEAPON_J_LASER: 115,
  WEAPON_ILLICIT_GRENADE_LAUNCHER: 116,
  WEAPON_MYSTERIOUS_ELECTRISOR: 117,
  WEAPON_UNBRIDLED_GAZOR: 118,
  WEAPON_REVOKED_M_LASER: 119,
  WEAPON_RIFLE: 151,
  WEAPON_RHINO: 153,
  WEAPON_EXPLORER_RIFLE: 175,
  WEAPON_LIGHTNINGER: 180,
  WEAPON_PROTON_CANON: 181,
  WEAPON_NEUTRINO: 182,
  WEAPON_TASER: 183,
  WEAPON_BAZOOKA: 184,
  WEAPON_DARK_KATANA: 187,
  WEAPON_ENHANCED_LIGHTNINGER: 225,
  WEAPON_UNSTABLE_DESTROYER: 226,
  WEAPON_SWORD: 277,
  WEAPON_HEAVY_SWORD: 278,
  WEAPON_ODACHI: 408,
  WEAPON_EXCALIBUR: 409,
  WEAPON_SCYTHE: 410,
};

const components = {
  1: { id: 1, name: "core", stats: [["cores", 4]], template: 290 },
  10: {
    id: 10,
    name: "elinvar_spring",
    stats: [
      ["life", 180],
      ["agility", 80],
      ["strength", 30],
      ["resistance", 20],
      ["mp", 1],
    ],
    template: 299,
  },
  11: {
    id: 11,
    name: "ssd",
    stats: [
      ["life", 80],
      ["wisdom", 80],
      ["science", 30],
      ["ram", 2],
      ["tp", 1],
    ],
    template: 300,
  },
  12: {
    id: 12,
    name: "nuclear_core",
    stats: [
      ["life", -200],
      ["science", 40],
      ["frequency", 40],
      ["tp", 3],
    ],
    template: 301,
  },
  13: {
    id: 13,
    name: "fan",
    stats: [["frequency", 40]],
    template: 302,
  },
  14: {
    id: 14,
    name: "sdcard",
    stats: [
      ["life", 40],
      ["wisdom", 60],
      ["ram", 1],
    ],
    template: 303,
  },
  15: { id: 15, name: "cd", stats: [["wisdom", 40]], template: 304 },
  16: {
    id: 16,
    name: "neural_core",
    stats: [
      ["science", 60],
      ["frequency", 20],
      ["cores", 2],
    ],
    template: 305,
  },
  17: {
    id: 17,
    name: "neural_core_pro",
    stats: [
      ["science", 80],
      ["frequency", 30],
      ["cores", 4],
      ["tp", 1],
    ],
    template: 306,
  },
  18: {
    id: 18,
    name: "power_supply",
    stats: [
      ["frequency", 20],
      ["science", 10],
      ["tp", 2],
    ],
    template: 307,
  },
  19: {
    id: 19,
    name: "chiyembekezo",
    stats: [
      ["life", 260],
      ["agility", 30],
      ["magic", 80],
      ["tp", 1],
    ],
    template: 308,
  },
  2: {
    id: 2,
    name: "core2",
    stats: [
      ["frequency", 20],
      ["cores", 6],
    ],
    template: 291,
  },
  20: {
    id: 20,
    name: "uzoma",
    stats: [
      ["life", 100],
      ["agility", 40],
      ["magic", 60],
    ],
    template: 309,
  },
  21: {
    id: 21,
    name: "kirabo",
    stats: [
      ["life", 60],
      ["strength", 10],
      ["resistance", 30],
    ],
    template: 310,
  },
  22: {
    id: 22,
    name: "limbani",
    stats: [
      ["life", 30],
      ["strength", 40],
      ["wisdom", 10],
    ],
    template: 311,
  },
  23: {
    id: 23,
    name: "thokozani",
    stats: [
      ["strength", 50],
      ["wisdom", 50],
      ["agility", 50],
      ["resistance", 50],
      ["science", 50],
      ["magic", 50],
    ],
    template: 312,
  },
  24: { id: 24, name: "ram", stats: [["ram", 4]], template: 313 },
  25: {
    id: 25,
    name: "ram2",
    stats: [
      ["life", 40],
      ["ram", 6],
      ["science", 20],
    ],
    template: 314,
  },
  26: {
    id: 26,
    name: "ram3",
    stats: [
      ["life", 80],
      ["ram", 8],
      ["tp", 1],
    ],
    template: 315,
  },
  27: {
    id: 27,
    name: "motherboard",
    stats: [
      ["life", 50],
      ["science", 40],
      ["frequency", 10],
      ["cores", 2],
      ["ram", 2],
    ],
    template: 316,
  },
  28: {
    id: 28,
    name: "propulsor",
    stats: [
      ["mp", 1],
      ["agility", 20],
      ["resistance", -30],
    ],
    template: 317,
  },
  29: {
    id: 29,
    name: "propulsor2",
    stats: [
      ["mp", 2],
      ["agility", 40],
      ["resistance", -40],
    ],
    template: 318,
  },
  3: {
    id: 3,
    name: "core3",
    stats: [
      ["frequency", 30],
      ["cores", 10],
      ["tp", 1],
    ],
    template: 292,
  },
  30: {
    id: 30,
    name: "morus",
    stats: [
      ["life", 60],
      ["magic", 40],
      ["wisdom", 20],
    ],
    template: 319,
  },
  31: {
    id: 31,
    name: "hylocereus",
    stats: [
      ["life", 600],
      ["wisdom", 40],
      ["magic", 40],
    ],
    template: 320,
  },
  32: {
    id: 32,
    name: "apple",
    stats: [["life", 100]],
    template: 321,
  },
  33: {
    id: 33,
    name: "nephelium",
    stats: [
      ["life", 70],
      ["strength", 60],
      ["agility", 30],
      ["science", 20],
    ],
    template: 322,
  },
  34: {
    id: 34,
    name: "blue_mango",
    stats: [
      ["wisdom", 70],
      ["agility", 50],
      ["science", 30],
    ],
    template: 323,
  },
  35: {
    id: 35,
    name: "watercooling",
    stats: [["frequency", 60]],
    template: 324,
  },
  36: {
    id: 36,
    name: "strawberry",
    stats: [
      ["life", 300],
      ["wisdom", 50],
    ],
    template: 365,
  },
  37: {
    id: 37,
    name: "chestnut",
    stats: [
      ["life", 240],
      ["strength", 80],
      ["resistance", 40],
      ["tp", 1],
    ],
    template: 366,
  },
  38: {
    id: 38,
    name: "blue_plum",
    stats: [
      ["life", 130],
      ["wisdom", 50],
      ["agility", 50],
      ["science", 50],
      ["mp", 1],
    ],
    template: 369,
  },
  39: {
    id: 39,
    name: "kiwi",
    stats: [
      ["wisdom", 20],
      ["tp", -1],
      ["mp", 1],
    ],
    template: 370,
  },
  4: {
    id: 4,
    name: "battery",
    stats: [
      ["resistance", 10],
      ["frequency", 10],
      ["tp", 1],
    ],
    template: 293,
  },
  40: {
    id: 40,
    name: "quince",
    stats: [
      ["life", 180],
      ["wisdom", 40],
      ["resistance", 40],
      ["mp", 1],
      ["tp", 1],
    ],
    template: 371,
  },
  41: {
    id: 41,
    name: "onion",
    stats: [
      ["life", 60],
      ["strength", 60],
      ["science", -60],
      ["magic", 60],
    ],
    template: 372,
  },
  42: {
    id: 42,
    name: "orange",
    stats: [
      ["resistance", 25],
      ["wisdom", 25],
    ],
    template: 373,
  },
  43: {
    id: 43,
    name: "soursop",
    stats: [
      ["life", 120],
      ["strength", 50],
      ["wisdom", 50],
      ["frequency", 20],
      ["mp", 1],
    ],
    template: 374,
  },
  44: {
    id: 44,
    name: "hokajin",
    stats: [
      ["life", 70],
      ["agility", 70],
      ["resistance", 70],
      ["magic", 70],
    ],
    template: 375,
  },
  45: {
    id: 45,
    name: "pear",
    stats: [
      ["life", -400],
      ["tp", 2],
    ],
    template: 376,
  },
  46: {
    id: 46,
    name: "motherboard2",
    stats: [
      ["life", 100],
      ["science", 20],
      ["frequency", 20],
      ["cores", 3],
      ["ram", 3],
      ["tp", 1],
    ],
    template: 381,
  },
  47: {
    id: 47,
    name: "motherboard3",
    stats: [
      ["life", 150],
      ["wisdom", 40],
      ["science", 40],
      ["frequency", 30],
      ["cores", 4],
      ["ram", 4],
      ["tp", 1],
    ],
    template: 382,
  },
  48: {
    id: 48,
    name: "switch",
    stats: [
      ["life", -100],
      ["wisdom", 50],
      ["science", 50],
    ],
    template: 383,
  },
  49: {
    id: 49,
    name: "switch2",
    stats: [
      ["life", -300],
      ["wisdom", 70],
      ["science", 70],
      ["tp", 1],
    ],
    template: 384,
  },
  5: {
    id: 5,
    name: "iron_plate",
    stats: [
      ["life", 50],
      ["resistance", 40],
    ],
    template: 294,
  },
  50: { id: 50, name: "rgb", stats: [["life", 1]], template: 385 },
  52: {
    id: 52,
    name: "recovery_core",
    stats: [["cores", 19]],
    template: 406,
  },
  53: {
    id: 53,
    name: "recovery_ram",
    stats: [["ram", 14]],
    template: 407,
  },
  6: {
    id: 6,
    name: "amazonite_plate",
    stats: [
      ["life", 150],
      ["resistance", 60],
    ],
    template: 295,
  },
  7: {
    id: 7,
    name: "obsidian_plate",
    stats: [
      ["life", 300],
      ["strength", 20],
      ["resistance", 80],
    ],
    template: 296,
  },
  8: {
    id: 8,
    name: "spring",
    stats: [
      ["strength", 20],
      ["agility", 40],
    ],
    template: 297,
  },
  9: {
    id: 9,
    name: "copper_spring",
    stats: [
      ["life", 50],
      ["strength", 40],
      ["agility", 60],
    ],
    template: 298,
  },
};

function getBaseStats(level) {
  return {
    life: 100 + (level - 1) * 3,
    strength: 0,
    wisdom: 0,
    agility: 0,
    resistance: 0,
    science: 0,
    magic: 0,
    frequency: 100,
    cores: 1,
    ram: 6,
    tp: 10,
    mp: 3,
  };
}

function getInvestedStats(bonusStats, totalStats, level) {
  const baseStats = getBaseStats(level);
  const investedStats = {};

  // substract base stats and bonus stats from total stats to get invested stats
  for (const statName in totalStats) {
    investedStats[statName] =
      totalStats[statName] - baseStats[statName] - bonusStats[statName];
  }
  return investedStats;
}

function getComponentStats(componentId) {
  const component = components[componentId];
  const stats = {};
  if (component) {
    component.stats.forEach(([statName, statValue]) => {
      stats[statName] = (stats[statName] || 0) + statValue;
    });
  }
  return stats;
}

function getBonusStats(componentIds) {
  const bonusStats = {
    life: 0,
    strength: 0,
    wisdom: 0,
    agility: 0,
    resistance: 0,
    science: 0,
    magic: 0,
    frequency: 0,
    cores: 0,
    ram: 0,
    tp: 0,
    mp: 0,
  };

  componentIds.forEach((componentId) => {
    const componentStats = getComponentStats(componentId);
    for (const [statName, statValue] of Object.entries(componentStats)) {
      bonusStats[statName] = (bonusStats[statName] || 0) + statValue;
    }
  });

  return bonusStats;
}

function getTotalStatsDom() {
  return {
    life: parseInt(document.getElementsByClassName("color-life")[0].innerText),
    magic: parseInt(
      document.getElementsByClassName("color-magic")[0].innerText
    ),
    strength: parseInt(
      document.getElementsByClassName("color-strength")[0].innerText
    ),
    frequency: parseInt(
      document.getElementsByClassName("color-frequency")[0].innerText
    ),
    wisdom: parseInt(
      document.getElementsByClassName("color-wisdom")[0].innerText
    ),
    cores: parseInt(
      document.getElementsByClassName("color-cores")[0].innerText
    ),
    agility: parseInt(
      document.getElementsByClassName("color-agility")[0].innerText
    ),
    ram: parseInt(document.getElementsByClassName("color-ram")[0].innerText),
    resistance: parseInt(
      document.getElementsByClassName("color-resistance")[0].innerText
    ),
    mp: parseInt(document.getElementsByClassName("color-mp")[0].innerText),
    science: parseInt(
      document.getElementsByClassName("color-science")[0].innerText
    ),
    tp: parseInt(document.getElementsByClassName("color-tp")[0].innerText),
  };
}

function getTotalCapital(level) {
  return (
    50 +
    5 * (level - 1) +
    Math.floor(level / 100) * 45 +
    Math.floor((level - 1) / 300) * 95
  );
}

(function () {
  "use strict";

  function createMenu() {
    const leekPageHeader = document.getElementsByClassName(
      "page-header page-bar"
    )[0];

    if (leekPageHeader && window.location.href.includes("/leek/")) {
      const leekNameDiv = leekPageHeader.children[0];
      if (leekNameDiv) {
        // add export button next to leek name
        const exportButton = document.createElement("button");
        exportButton.id = "leek-profile-to-json";
        exportButton.innerText = "Export Leek JSON";
        exportButton.style.marginLeft = "10px";
        leekPageHeader.parentElement.prepend(exportButton);
      }
    }

    // Export leek profile json (for leek-wars-generator shenanigans)
    document
      .getElementById("leek-profile-to-json")
      .addEventListener("click", () => {
        const weaponDivs = document.getElementsByClassName("weapon");

        const equippedWeaponIds = [];

        for (var i = 0; i < weaponDivs.length; i++) {
          if (weaponDivs[i].children[0].src) {
            // console.log(weaponDivs[i].children[0].src);
            const weaponImgSrc = weaponDivs[i].children[0].src;
            const weaponName = weaponImgSrc
              .split("weapon/")[1]
              .split(".png")[0];
            const weaponVariableName = "WEAPON_" + weaponName.toUpperCase();
            const weaponId = weaponNamesToIds[weaponVariableName];
            // console.log(weaponId);
            equippedWeaponIds.push(weaponId);
          }
        }

        const chipDivs = document.getElementsByClassName("chip");
        const equippedChipIds = [];

        for (var j = 0; j < chipDivs.length; j++) {
          if (chipDivs[j].children[0].src) {
            // console.log(chipDivs[j].children[0].src);
            const chipImgSrc = chipDivs[j].children[0].src;
            const chipName = chipImgSrc.split("chip/")[1].split(".png")[0];
            const chipVariableName = "CHIP_" + chipName.toUpperCase();
            const chipId = chipNamesToIds[chipVariableName];
            // console.log(chipId);
            equippedChipIds.push(chipId);
          }
        }

        const componentsDivs =
          document.getElementsByClassName("components-grid")[0].children;
        const equippedComponentsIds = [];

        console.log("componentsDivs", componentsDivs);

        for (var j = 0; j < componentsDivs.length; j++) {
          const componentImg = componentsDivs[j].children[0].children[0];

          if (componentImg.src) {
            console.log(componentImg);
            const componentImgSrc = componentImg.src;
            const componentName = componentImgSrc
              .split("component/")[1]
              .split(".png")[0];

            // console.log("componentName", componentName);

            const componentVariableName =
              "COMPONENT_" + componentName.toUpperCase();

            // console.log("componentVariableName", componentVariableName);
            const componentId = componentNamesToIds[componentVariableName];
            // console.log(componentId);
            equippedComponentsIds.push(componentId);
          } else {
            // console.log("empty slot", componentsDivs[j]);
          }
        }

        const level = parseInt(
          document.getElementsByClassName("level")[0].innerText.split(" ")[1]
        );

        const bonusStats = getBonusStats(equippedComponentsIds);
        const totalStatsDom = getTotalStatsDom();
        const investedStats = getInvestedStats(
          bonusStats,
          totalStatsDom,
          level
        );

        // console.log("totalStatsDom", totalStatsDom);
        // console.log("bonusStats", bonusStats);
        // console.log("investedStats", investedStats);

        const totalCapital = getTotalCapital(level);
        // console.log("totalCapital", totalCapital);

        const characteristicsDiv =
          document.getElementsByClassName("characteristics")[0];
        // console.log("characteristicsDiv", characteristicsDiv);

        // try to get button with text "X capital"
        let availableCapital = 0;
        const buttons = characteristicsDiv.getElementsByTagName("button");

        // if there are two buttons, the first one is invested capital
        if (buttons.length >= 2) {
          const availableCapitalButton = buttons[0];
          availableCapital = parseInt(
            availableCapitalButton.innerText.split(" ")[0]
          );
        }

        // console.log("buttons", buttons);
        // console.log("availableCapital", availableCapital);

        const leekData = {
          level: level,
          investedStats: investedStats,
          investedCapital: totalCapital - availableCapital,
          totalCapital: totalCapital,
          bonusStats: bonusStats,
          equippedComponentIds: equippedComponentsIds,
          selectedWeaponIds: equippedWeaponIds,
          selectedChipIds: equippedChipIds,
        };

        const leekPageHeader = document.getElementsByClassName(
          "page-header page-bar"
        )[0];
        const leekName = leekPageHeader.children[0].innerText.trim();

        console.log("leekData", leekData);

        // save leekData as json file with name leek-<leekName>.json
        const leekDataStr = JSON.stringify(leekData, null, 2);
        const blob = new Blob([leekDataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Official ${leekName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

    // Show button when hidden
    const showButton = document.createElement("button");
    showButton.textContent = "Show Menu";
    Object.assign(showButton.style, {
      position: "fixed",
      top: "10px",
      left: "10px",
      zIndex: 9999,
      display: "none",
      padding: "6px 10px",
      fontSize: "14px",
    });

    showButton.addEventListener("click", () => {
      menu.style.display = "block";
      showButton.style.display = "none";
    });

    document.body.appendChild(showButton);
  }

  window.addEventListener("load", createMenu);
})();
