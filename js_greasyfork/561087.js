// ==UserScript==
// @name         Klavia Frenzy Clicker 0.1.5.2 fix
// @namespace    http://tampermonkey.net/
// @version      0.1.5.2
// @description  made by guappanese
// @match        *://playklavia.com/*
// @match        *://www.playklavia.com/*
// @match        *://klavia.io/*
// @match        *://www.klavia.io/*
// @run-at       document-start
// @grant        none
// @require      https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js
// @require      https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js
// @require      https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics-compat.js
// @require https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js
// @require https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js
// @downloadURL https://update.greasyfork.org/scripts/561087/Klavia%20Frenzy%20Clicker%200152%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/561087/Klavia%20Frenzy%20Clicker%200152%20fix.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {


const firebaseScript = document.createElement('script');
firebaseScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
firebaseScript.onload = () => {
    const dbScript = document.createElement('script');
    dbScript.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js";
    document.head.appendChild(dbScript);
};
document.head.appendChild(firebaseScript);

     const firebaseConfig = {
        apiKey: "AIzaSyAnD1y39ZhM0AivM2ZimlNcPc6a5cPjGxc",
        authDomain: "kfclb-34cc2.firebaseapp.com",
        projectId: "kfclb-34cc2",
        storageBucket: "kfclb-34cc2.appspot.com",
        messagingSenderId: "980666264958",
        appId: "1:980666264958:web:8655adc177886b083bd72f",
        measurementId: "G-H0F4FGYTSS"
    };

    // Initialize Firebase
    const sessionStartTime = Date.now();
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    window.database = database;

    const f = (num) => Math.floor(num).toLocaleString();

     function initClicker() {
        console.log("KFC is Ready!");

         let coins = parseInt(localStorage.getItem('klaviaCoins')) || 0;

         function updateFirebaseStats() {
    if (!userId) return;

    const data = {
        coins: parseInt(localStorage.getItem('klaviaCoins')) || 0,
        totalRaces: parseInt(localStorage.getItem('totalRaces')) || 0,
        totalPets: (JSON.parse(localStorage.getItem('ownedPets')) || []).length,
        prestigeCount: parseInt(localStorage.getItem('prestigeCount')) || 0,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref('leaderboard/' + userId).update(data);
}
const updateFirebaseCoins = updateFirebaseStats;
const updateFirebaseRaces = updateFirebaseStats;
const updateFirebasePets = updateFirebaseStats;
const updateFirebasePrestige = updateFirebaseStats;


         window.ownedTags = ['default'];
         function listenForOwnedRoles(userKey) {
  database.ref(`userOwnedRoles/${userKey}`).on('value', snap => {
    const data = snap.val() || {};
    window.ownedTags = ['default', ...Object.keys(data)];
    refreshTagsUI();
  });
}

         function updateFirebaseRole() {
    if (!window.userId) return;
    const currentRole = localStorage.getItem('userRole') || 'Guest';
    database.ref('userRoles/' + window.userId).set(currentRole);
}

        function onUserReady(userId) {
    window.userId = userId;
    localStorage.setItem('kfcUserId', userId);

    listenForOwnedRoles(userId);

    database.ref(`userRoles/${userId}`).once('value').then(snapshot => {
        const role = snapshot.val() || 'default';
        localStorage.setItem('userRole', role);
        if (typeof refreshTagsUI === 'function') refreshTagsUI();
    });

    database.ref('leaderboard/' + userId).on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const dbCoins = parseInt(data.coins) || 0;

            if (dbCoins !== coins) {
                console.log(`[LIVE SYNC] Coins updated via Database: ${dbCoins}`);

                coins = dbCoins;

                localStorage.setItem('klaviaCoins', dbCoins);

                if (window.updateHUD) window.updateHUD();
            }

            if (data.totalRaces) localStorage.setItem('totalRaces', data.totalRaces);
            if (data.prestigeCount) localStorage.setItem('prestigeCount', data.prestigeCount);
        }
    });

    console.log("[USER READY - LIVE SYNC ACTIVE]", userId);
}


         function listenForActiveRole(userKey) {
  database.ref(`userRoles/${userKey}`).on('value', snap => {
    const role = snap.val() || 'default';
    localStorage.setItem('userRole', role);
    refreshTagsUI();
  });
}



         function getUniqueUsername(baseName, callback) {
    let attempt = 0;

    function tryName() {
        const name = attempt === 0 ? baseName : `${baseName}${attempt}`;

        database.ref(`users/${name}`).once('value').then(snapshot => {
            if (!snapshot.exists()) {
                database.ref(`users/${name}`).set(true);

                database.ref(`leaderboard/${name}`).set({
                    coins: 0,
                    totalRaces: 0,
                    totalPets: 0,
                    prestigeCount: 0,
                    timestamp: Date.now()
                });

                callback(name);
            } else {
                attempt++;
                tryName();
            }
        });
    }

    tryName();
}

let globalMutedList = [];

database.ref('globalMutes').on('value', snapshot => {
    const data = snapshot.val() || {};
    globalMutedList = Object.keys(data);
    console.log("Global mute list updated:", globalMutedList);
});

const rarityTierIndex = {
  'Default': 0,
  'Common': 0,
  'Uncommon': 1,
  'Rare': 2,
  'Legendary': 3,
  'Mythical': 4,
  'Godly': 5
};

function getUnlockedChickenTier() {
  return unlockedTier;
}

function canHatchEgg(egg) {
  const rarity = egg.rarity || (egg.name ? egg.name.split(' ')[0] : 'Common');
  const requiredTier = rarityTierIndex[rarity] ?? 0;

  const currentTier = getUnlockedChickenTier();

  return currentTier >= requiredTier;
}

function getEggRequiredChickenName(egg) {
  const rarity =
    egg.rarity ||
    (typeof egg.name === 'string' ? egg.name.split(' ')[0] : '') ||
    'Common';

  const requiredTier = rarityTierIndex[rarity] ?? 0;
  return chickenImages[requiredTier]?.name || 'Default';
}

         window.BARN_SIZE_KEY = "barnSize";

window.getBarnSize = function () {
  const raw = localStorage.getItem(window.BARN_SIZE_KEY);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
};

window.setBarnSize = function (n) {
  const v = Math.max(1, parseInt(n, 10) || 1);
  localStorage.setItem(window.BARN_SIZE_KEY, String(v));
  return v;
};


function getPrestigePetKeepCount() {
  return Math.min(5, parseInt(localStorage.getItem('prestigeKeepPets'), 10) || 1);
}

function setPrestigePetKeepCount(val) {
  localStorage.setItem('prestigeKeepPets', Math.min(5, Math.max(1, val)));
}



    // Detectors
  function setupRaceDetector() {
    setInterval(() => {
        const row = document.querySelector('#race-results tbody tr');

        if (!row) {
            if (lastWpmValue !== null) {
                lastWpmValue = null;
            }
            return;
        }

        const wpmTd = row.children[3];
        if (!wpmTd) return;

        const wpmValue = parseFloat(wpmTd.textContent.trim());

        if (!isNaN(wpmValue) && wpmValue > 0 && lastWpmValue === null) {

            sessionRaces += 1;
            totalRaces += 1;
            localStorage.setItem('totalRaces', totalRaces);
            if (typeof refreshLevelMiniHUD === 'function') refreshLevelMiniHUD();




            coins += calculateCoinsPerRace();
            localStorage.setItem('klaviaCoins', coins);

             if (userId) {
                updateFirebaseRaces();
                updateFirebaseCoins();
                database.ref('recentRaces').push({
                    user: userId,
                    timestamp: Date.now()
                });
            }


            if (skillTreeUpgrades[6]?.purchased) {
                let starBitBonus = 1;
                skillTreeUpgrades.forEach(skill => {
                    if (skill.purchased && skill.type === 'starBits') {
                        starBitBonus += skill.value || 0;
                    }
                });
                starBits += starBitBonus;
                localStorage.setItem('starBits', starBits);
            }
            checkAchievements();

            lastWpmValue = wpmValue;

            if (window.updateHUD) window.updateHUD();
        }

        if ((isNaN(wpmValue) || wpmValue === 0) && lastWpmValue !== null) {
            lastWpmValue = null;
        }
    }, 200);
}

    // Variables
    let sessionRaces = 0;
    let totalRaces = parseInt(localStorage.getItem('totalRaces')) || 0;
    let lastWpmValue = null;
    const baseCoinsPerRace = 1;
    let milestoneRaceInterval = 50;
    let milestoneCpRMultiplier = 1;
    let milestone2RaceInterval = 100;
    let milestone2CpRMultiplier = 5;
    let starBits = parseInt(localStorage.getItem('starBits')) || 0;
    let prestigePoints = parseInt(localStorage.getItem('prestigePoints')) || 0;

    let generator1Purchased = JSON.parse(localStorage.getItem('generator1Purchased')) || false;
    let generator1Box = null;
    let mutedUsers = JSON.parse(localStorage.getItem('kfc_muted_users')) || [];


    let coinsPerSecond = 0;
    if (generator1Purchased) {
    coinsPerSecond += 10;

}

         let prestigeCount = parseInt(localStorage.getItem('prestigeCount')) || 0;
         function getPrestigeCost() {
    const baseCost = 1000000;
    return Math.floor(baseCost * Math.pow(1.5, prestigeCount));
}

    let userId = localStorage.getItem('kfcUserId') || null;
window.userId = userId;


    const originalGiveCoins = window.giveCoins;
    window.giveCoins = function(amount) {
        if (originalGiveCoins) originalGiveCoins(amount);
        if (userId) {
    updateFirebaseCoins();
}
        console.log(`You now have ${coins} coins`);
    };

   const leaderboardRef = database.ref('leaderboard').orderByChild('coins').limitToLast(10);

leaderboardRef.on('value', snapshot => {
    const data = snapshot.val();
    if (!data) return console.log('Leaderboard is empty');

    const sorted = Object.entries(data)
        .map(([id, info]) => ({ id, coins: info.coins }))
        .sort((a, b) => b.coins - a.coins);

    console.log('Top Coins Leaderboard');
    sorted.forEach((player, index) => {
    const nameColor = player.id === 'guappanese' ? '#f00' : '#0f0';
    console.log(`%c${index + 1}. ${player.id}: ${player.coins}`, `color: ${nameColor}`);
});
});
    if (userId) {
    updateFirebaseCoins();
}

// Generators
         let generators = [
    { id: 1, cost: 50, cps: 10, duration: 30, tooltip: "50 Star Bits: Earn +10 Coins per Second (CpS) for 30 seconds" },
    { id: 2, cost: 150, cps: 25, duration: 15, tooltip: "150 Star Bits: Earn +25 CpS for 15 seconds" },
    { id: 3, cost: 400, cps: 30, duration: 30, tooltip: "400 Star Bits: Earn +30 CpS for 30 seconds" },
    { id: 4, cost: 1000, cps: 60, duration: 60, tooltip: "1,000 Star Bits: Earn +60 CpS for 60 seconds" }
];

coinsPerSecond = generators.filter(g => g.purchased).reduce((sum, g) => sum + g.cps, 0);





         let expanded = JSON.parse(localStorage.getItem('hudExpanded')) || false;
         let skillTreeUnlocked = JSON.parse(localStorage.getItem('skillTreeUnlocked')) || false;




    // Upgrades
    let upgrades = [
        { id: 1, purchased: JSON.parse(localStorage.getItem('upgrade1Purchased')) || false, type: 'multiplier', value: 2, cost: 5, description: "Double your base coins per race (CpR)" },
        { id: 2, purchased: JSON.parse(localStorage.getItem('upgrade2Purchased')) || false, type: 'percent', value: 0.05, cost: 5, description: "Earn +5% CpR" },
        { id: 3, purchased: JSON.parse(localStorage.getItem('upgrade3Purchased')) || false, type: 'multiplier', value: 3, cost: 10, description: "Triple your base CpR" },
        { id: 4, purchased: JSON.parse(localStorage.getItem('upgrade4Purchased')) || false, type: 'totalRaceBonus', value: 1, cost: 35, description: "Adds +1 CpR every 25 total races" },
        { id: 5, purchased: JSON.parse(localStorage.getItem('upgrade5Purchased')) || false, type: 'sessionRaceBonus', value: 1, cost: 40, description: "Adds +1 CpR every 10 session races" },
        { id: 6, purchased: JSON.parse(localStorage.getItem('upgrade6Purchased')) || false, type: 'multiplier', value: 2, cost: 67, description: "Double your base CpR" },
        { id: 7, purchased: JSON.parse(localStorage.getItem('upgrade7Purchased')) || false, type: 'percent', value: 0.05, cost: 110, description: "Earn +5% CpR" },
        { id: 8, purchased: JSON.parse(localStorage.getItem('upgrade8Purchased')) || false, type: 'totalRaceBonus', value: 5, cost: 200, description: "Adds +5 CpR every 25 total races" },
        { id: 9, purchased: JSON.parse(localStorage.getItem('upgrade9Purchased')) || false, type: 'sessionRaceBonus', value: 5, cost: 380, description: "Adds +5 CpR every 10 session races" },
        { id: 10, purchased: JSON.parse(localStorage.getItem('upgrade10Purchased')) || false, type: 'milestone', raceInterval: 50, bonusPercent: 1, cost: 650, description: "Earn +100% CpR from every 50th race" },
        { id: 11, purchased: JSON.parse(localStorage.getItem('upgrade11Purchased')) || false, type: 'multiplier', value: 3, cost: 1000, description: "Triple your base CpR" },
        { id: 12, purchased: JSON.parse(localStorage.getItem('upgrade12Purchased')) || false, type: 'sessionPercent', value: 0.01, cost: 1700, description: "Gain +1% CpR/10 session races" },
        { id: 13, purchased: JSON.parse(localStorage.getItem('upgrade13Purchased')) || false, type: 'percent', value: 0.05, cost: 2000, description: "Earn +5% CpR" },
        { id: 14, purchased: JSON.parse(localStorage.getItem('upgrade14Purchased')) || false, type: 'totalPercent', value: 0.001, cost: 2500, description: "Gain +0.1% CpR/10 total races" },
        { id: 15, purchased: JSON.parse(localStorage.getItem('upgrade15Purchased')) || false, type: 'multiplier', value: 2, cost: 2700, description: "Double your base CpR" },
        { id: 16, purchased: JSON.parse(localStorage.getItem('upgrade16Purchased')) || false, type: 'totalRaceBonus', value: 10, cost: 3500, description: "Adds +10 CpR every 25 total races" },
        { id: 17, purchased: JSON.parse(localStorage.getItem('upgrade17Purchased')) || false, type: 'multiplier', value: 2, cost: 6500, description: "Double your base CpR" },
        { id: 18, purchased: JSON.parse(localStorage.getItem('upgrade18Purchased')) || false, type: 'percent', value: 0.05, cost: 7000, description: "Earn +5% CpR" },
        { id: 19, purchased: JSON.parse(localStorage.getItem('upgrade19Purchased')) || false, type: 'sessionRaceBonus', value: 10, cost: 7200, description: "Adds +10 CpR every 10 session races" },
        { id: 20, purchased: JSON.parse(localStorage.getItem('upgrade20Purchased')) || false, type: 'percent', value: 0.01, cost: 6000, description: "Earn +1% CpR" },
        { id: 21, purchased: JSON.parse(localStorage.getItem('upgrade21Purchased')) || false, type: 'milestone2', raceInterval: 150, bonusPercent: 5, cost: 7676, description: "Earn +500% CpR from every 150th total race" },
        { id: 22, purchased: JSON.parse(localStorage.getItem('upgrade22Purchased')) || false, type: 'percent', value: 0.01, cost: 8000, description: "Earn +1% CpR" },
        { id: 23, purchased: JSON.parse(localStorage.getItem('upgrade23Purchased')) || false, type: 'totalRaceBonus', value: 5, cost: 15000, description: "Adds +5 CpR every 25 total races" },
        { id: 24, purchased: JSON.parse(localStorage.getItem('upgrade24Purchased')) || false, type: 'sessionRaceBonus', value: 5, cost: 16767, description: "Adds +5 CpR every 10 session races" },
        { id: 25, purchased: JSON.parse(localStorage.getItem('upgrade25Purchased')) || false, type: 'multiplier', value: 2, cost: 30000, description: "Double your base CpR" },
        { id: 26, purchased: JSON.parse(localStorage.getItem('upgrade26Purchased')) || false, type: 'totalRaceBonus', value: 25, cost: 50000, description: "Adds +25 CpR every 25 total races" },
        { id: 27, purchased: JSON.parse(localStorage.getItem('upgrade27Purchased')) || false, type: 'multiplier', value: 3, cost: 100000, description: "Triple your base CpR" },
        { id: 28, purchased: JSON.parse(localStorage.getItem('upgrade28Purchased')) || false, type: 'percent', value: 0.5, cost: 100000, description: "Earn +50% CpR" },
        { id: 29, purchased: JSON.parse(localStorage.getItem('upgrade29Purchased')) || false, type: 'sessionRaceBonus', value: 25, cost: 125000, description: "Adds +5 CpR every 10 session races" },
        { id: 30, purchased: JSON.parse(localStorage.getItem('upgrade30Purchased')) || false, type: 'multiplier', value: 2, cost: 200000, description: "Double your base CpR" }



    ];

         // Skill Tree Upgrades
let skillTreeUpgrades = [
    { id: 1, purchased: JSON.parse(localStorage.getItem('skill1Purchased')) || false, cost: 15000, type: 'multiplier', value: 2, description: "Double your base CpR" },
    { id: 2, purchased: JSON.parse(localStorage.getItem('skill2Purchased')) || false, cost: 25000, type: 'milestone', raceInterval: 50, bonusPercent: 1, description: "Earn +100% CpR from every 50th total race" },
    { id: 3, purchased: JSON.parse(localStorage.getItem('skill3Purchased')) || false, cost: 40000, type: 'sessionPercent', value: 0.01, description: "Gain +1% CpR/10 session races" },
    { id: 4, purchased: JSON.parse(localStorage.getItem('skill4Purchased')) || false, cost: 75000, type: 'totalPercent', value: 0.001, description: "Gain +0.1% CpR per 10 total races" },
    { id: 5, purchased: JSON.parse(localStorage.getItem('skill5Purchased')) || false, cost: 100000, type: 'milestone2', raceInterval: 100, bonusPercent: 5, description: "Earn +500% CpR from every 50th total race" },
    { id: 6,purchased: JSON.parse(localStorage.getItem('skill6Purchased')) || false,cost: 150000,type: 'starBits',value: 1,description: "+1 Star Bit per race"},
    { id: 7, purchased: JSON.parse(localStorage.getItem('skill7Purchased')) || false, cost: 200000, type: 'starBits', value: 1, description: "+1 Star Bit per race" },
    { id: 8, purchased: JSON.parse(localStorage.getItem('skill8Purchased')) || false, cost: 300000, type: 'unlockGenerators', description: "Unlocks Generators!" },
    { id: 9, purchased: JSON.parse(localStorage.getItem('skill9Purchased')) || false, cost: 500000, type: 'starBits', value: 2, description: "+2 Star Bit per race" },
    { id: 10, purchased: JSON.parse(localStorage.getItem('skill10Purchased')) || false, cost: 500000, type: 'randomBonus', chance: 0.01, bonusMultiplier: 3, description: "1/100 chance every race to earn 3x the CpR from that race!" },
    { id: 11, purchased: JSON.parse(localStorage.getItem('skill11Purchased')) || false, cost: 750000, type: 'prestigeBonus', value: 0.1, description: "Gain +10% CpR per prestige" },
    { id: 12, purchased: JSON.parse(localStorage.getItem('skill12Purchased')) || false, cost: 1000000, type: 'starBits', value: 5, description: "+5 Star Bit per race" },
    { id: 13, purchased: JSON.parse(localStorage.getItem('skill13Purchased')) || false, cost: 1250000, type: 'milestone', raceInterval: 50, bonusPercent: 5, description: "Earn +500% CpR from every 50th total race" },
    { id: 14, purchased: JSON.parse(localStorage.getItem('skill14Purchased')) || false, cost: 1500000, type: 'starBits', value: 5, description: "+5 Star Bit per race" }
];

// Prestige Upgrades
         let prestigeUpgrades = [
    { id: 1, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade1')) || false, type: 'sessionPercent', value: 0.01, cost: 1, description: "Gain +1% CpR/10 session races" },
    { id: 2, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade2')) || false, type: 'starBits', value: 3, cost: 1, description: "Triple your Star Bits per race" },
    { id: 3, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade3')) || false, type: 'prestigePoints', value: 2, cost: 2, description: "Earn 2x the PP per Prestige!" },
    { id: 4, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade4')) || false, type: 'coinPercent', value: 0.001, cost: 2, description: "Gain +0.1% CpR per 1,000 current coins" },
    { id: 5, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade5')) || false, type: 'starBits', value: 2, cost: 2, description: "Double your Star Bits per race" },
    { id: 6, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade6')) || false, type: 'prestigeBonus', value: 0.5, cost: 3, description: "Gain +50% CpR per prestige" },
    { id: 7, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade7')) || false, type: 'totalPercent', value: 0.05, cost: 3, description: "Gain +0.5% CpR/10 total races" },
    { id: 8, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade8')) || false, type: 'prestigePoints', value: 2, cost: 4, description: "Earn 2x the PP per Prestige!" },
    { id: 9, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade9')) || false, type: 'starBits', value: 2, cost: 5, description: "Double your Star Bits per race" },
    { id: 10, purchased: JSON.parse(localStorage.getItem('prestigeUpgrade10')) || false, type: 'sessionPercent', value: 0.1, cost: 5, description: "Gain +10% CpR/10 session races" }



];




    // Achievements
    let achievements = [
        { id: 1, description: "Purchase your first upgrade!", check: () => upgrades.some(upg => upg.purchased), unlocked: JSON.parse(localStorage.getItem('achievement1Unlocked')) || false },
        { id: 2, description: "Complete a 10 race session!", check: () => sessionRaces >= 10, unlocked: JSON.parse(localStorage.getItem('achievement2Unlocked')) || false },
        { id: 3, description: "Reach 100 coins!", check: () => coins >= 100, unlocked: JSON.parse(localStorage.getItem('achievement3Unlocked')) || false },
        { id: 4, description: "Purchase upgrade 5!", check: () => upgrades[4].purchased, unlocked: JSON.parse(localStorage.getItem('achievement4Unlocked')) || false },
        { id: 5, description: "Reach 1,000 coins!", check: () => coins >= 1000, unlocked: JSON.parse(localStorage.getItem('achievement5Unlocked')) || false },
        { id: 6, description: "Complete 100 total races!", check: () => totalRaces >= 100, unlocked: JSON.parse(localStorage.getItem('achievement6Unlocked')) || false },
        { id: 7, description: "Purchase upgrade 10!", check: () => upgrades[9].purchased, unlocked: JSON.parse(localStorage.getItem('achievement7Unlocked')) || false },
        { id: 8, description: "Reach a total CpR of 100!", check: () => calculateCoinsPerRace() >= 100, unlocked: JSON.parse(localStorage.getItem('achievement8Unlocked')) || false },
        { id: 9, description: "Purchase upgrade 15!", check: () => upgrades[14].purchased, unlocked: JSON.parse(localStorage.getItem('achievement9Unlocked')) || false },
        { id: 10, description: "Complete a 50 race session!", check: () => sessionRaces >= 50, unlocked: JSON.parse(localStorage.getItem('achievement10Unlocked')) || false },
        { id: 11, description: "Reach a total CpR of 1,000!", check: () => calculateCoinsPerRace() >= 1000, unlocked: JSON.parse(localStorage.getItem('achievement11Unlocked')) || false },
        { id: 12, description: "Purchase upgrade 20!", check: () => upgrades[19].purchased, unlocked: JSON.parse(localStorage.getItem('achievement12Unlocked')) || false },
        { id: 13, description: "Unlock the Skill Tree!", check: () => skillTreeUnlocked === true, unlocked: JSON.parse(localStorage.getItem('achievement13Unlocked')) || false },
        { id: 14, description: "Reach 100,000 coins!", check: () => coins >= 100000, unlocked: JSON.parse(localStorage.getItem('achievement14Unlocked')) || false },
        { id: 15, description: "Complete 200 total races!", check: () => totalRaces >= 200, unlocked: JSON.parse(localStorage.getItem('achievement15Unlocked')) || false },
        { id: 16, description: "Unlock the casino!", check: () => skillTreeUpgrades[5].purchased, unlocked: JSON.parse(localStorage.getItem('achievement16Unlocked')) || false },
        { id: 17, description: "Reach a total CpR of 10,000!", check: () => calculateCoinsPerRace() >= 10000, unlocked: JSON.parse(localStorage.getItem('achievement17Unlocked')) || false },
        { id: 18, description: "Discover Star Bits!", check: () => starBits >= 1, unlocked: JSON.parse(localStorage.getItem('achievement18Unlocked')) || false },
        { id: 19, description: "Earn 25 Coins per Second!", check: () => coinsPerSecond >= 25, unlocked: JSON.parse(localStorage.getItem('achievement19Unlocked')) || false },
        { id: 20, description: "Prestige for the first time!", check: () => prestigePoints >= 1, unlocked: JSON.parse(localStorage.getItem('achievement20Unlocked')) || false },
        { id: 21, description: "Earn 100 Star Bits!", check: () => starBits >= 100, unlocked: JSON.parse(localStorage.getItem('achievement21Unlocked')) || false },
        { id: 22, description: "Reach a total CpR of 50,000!", check: () => calculateCoinsPerRace() >= 50000, unlocked: JSON.parse(localStorage.getItem('achievement22Unlocked')) || false },
        { id: 23, description: "Earn 3 Prestige Points!", check: () => prestigePoints >= 3, unlocked: JSON.parse(localStorage.getItem('achievement23Unlocked')) || false },
        { id: 24, description: "Complete 500 total races!", check: () => totalRaces >= 500, unlocked: JSON.parse(localStorage.getItem('achievement24Unlocked')) || false },
        { id: 25, description: "Reach 2,000,000 coins!", check: () => coins >= 2000000, unlocked: JSON.parse(localStorage.getItem('achievement25Unlocked')) || false },
        { id: 26, description: "Reach a total CpR of 100,000!", check: () => calculateCoinsPerRace() >= 100000, unlocked: JSON.parse(localStorage.getItem('achievement26Unlocked')) || false },
    ];

         // Roles/Tags
         window.rolesConfig = {
    'OWNER': { tag: '[OWNER]', tagColor: '#ff0000', nameColor: '#ff0000' },
    'ALPHA TESTER': { tag: '[ALPHA]', tagColor: '#00ffff', nameColor: '#00ffff' },
    'AUG': { tag: '[AUG]', tagColor: '#800080', nameColor: '#800080' },
    'KFC': { tag: '[KFC]', tagColor: '#FFC0CB', nameColor: '#FFC0CB' },
    'TYPER': { tag: '[TYPER]', tagColor: '#5875F2', nameColor: '#5875F2' },
    'LEGEND': { tag: '[LEGEND]', tagColor: '#FFA500', nameColor: '#FFA500' },
    'CPR GOD': { tag: '[CPR GOD]', tagColor: '#FFFF00', nameColor: '#FFFF00' },
    'STARBIT': { tag: '[STARBIT COLLECTOR]', tagColor: '#cc8899', nameColor: '#cc8899' },
    'RGB': { tag: '[RGB]', tagColor: '#ffffff', nameColor: '#ffffff', isRGB: true },
    'GUAP': { tag: '[GUAP]', tagColor: '#00ff00', nameColor: '#00ff00' },
    'CHILL': { tag: '[CHILL]', tagColor: '#fd3bff', nameColor: '#fd3bff' },
    '67': { tag: '[67]', tagColor: '#49f292', nameColor: '#49f292' },
    '420': { tag: '[420]', tagColor: '#00ff00', nameColor: '#00ff00' },
    'PP MASTER': { tag: '[PP MASTER]', tagColor: '#FFFF00', nameColor: '#FFFF00' },
    'PET TAMER': { tag: '[PET TAMER]', tagColor: '#FFFF00', nameColor: '#FFFF00' },
    'D4RK': { tag: '[D4RK]', tagColor: '#FF69B4', nameColor: '#FF69B4' },
    'DEAN': { tag: '[DEAN]', tagColor: '#00008B', nameColor: '#00008B' }


};

// Pets
window.petsConfig = {
    'Hamster': { rarity: 'Common', multiplier: 10, color: '#b1b1b1' },
    'Cat': { rarity: 'Common', multiplier: 10, color: '#b1b1b1' },
    'Dog': { rarity: 'Common', multiplier: 10, color: '#b1b1b1' },
    'Goldfish': { rarity: 'Common', multiplier: 10, color: '#b1b1b1' },
    'Frog': { rarity: 'Uncommon', multiplier: 25, color: '#5555ff' },
    'Rabbit': { rarity: 'Uncommon', multiplier: 25, color: '#5555ff' },
    'Turtle': { rarity: 'Uncommon', multiplier: 25, color: '#5555ff' },
    'Gecko': { rarity: 'Uncommon', multiplier: 25, color: '#5555ff' },
    'Fairy': { rarity: 'Rare', multiplier: 100, color: '#FF0000' },
    'Slime': { rarity: 'Rare', multiplier: 100, color: '#FF0000' },
    'Fox': { rarity: 'Rare', multiplier: 100, color: '#FF0000' },
    'Kangaroo': { rarity: 'Rare', multiplier: 100, color: '#FF0000' },
    'Dragon': { rarity: 'Legendary', multiplier: 250, color: '#FFA500' },
    'Phoenix': { rarity: 'Legendary', multiplier: 250, color: '#FFA500' },
    'Imp': { rarity: 'Legendary', multiplier: 250, color: '#FFA500' },
    'Pegasus': { rarity: 'Legendary', multiplier: 250, color: '#FFA500' },
    'Unicorn': { rarity: 'Mythical', multiplier: 1000, color: '#800080' },
    'Keyboard': { rarity: 'Mythical', multiplier: 1000, color: '#800080' },
    'Sphynx': { rarity: 'Mythical', multiplier: 1000, color: '#800080' },
    'Pikachu': { rarity: 'Mythical', multiplier: 1000, color: '#800080' },
    'Autotyper': { rarity: 'Godly', multiplier: 5000, color: '#FFC0CB' },
    'Kraken': { rarity: 'Godly', multiplier: 5000, color: '#FFC0CB' },
    'Big Foot': { rarity: 'Godly', multiplier: 5000, color: '#FFC0CB' },
    'Guappanese': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true },
    'Mario': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true },
    'Parz': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true },
    'Soul': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true },
    'Nusakan': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true },
    'Slimretta': { rarity: 'Ethereal', multiplier: 20000, color: '#FFC0CB', isRGB: true }
};

// Eggs
window.eggsConfig = [
    { name: 'Common Egg', price: 1000, borderColor: '#ffffff', chances: { 'Hamster': 0.23, 'Cat': 0.23, 'Dog': 0.23, 'Goldfish': 0.23, 'Gecko': 0.08 } },
    { name: 'Uncommon Egg', price: 5000, borderColor: '#5555ff', chances: { 'Cat': 0.50, 'Frog': 0.11, 'Rabbit': 0.11, 'Turtle': 0.11, 'Gecko': 0.11, 'Slime': 0.06 } },
    { name: 'Rare Egg', price: 25000, borderColor: '#FF0000', chances: { 'Rabbit': 0.50, 'Slime': 0.11, 'Fairy': 0.11, 'Fox': 0.11, 'Kangaroo': 0.11, 'Dragon': 0.06 } },
    { name: 'Legendary Egg', price: 100000, borderColor: '#FFA500', chances: { 'Slime': 0.50, 'Dragon': 0.11, 'Phoenix': 0.11, 'Imp': 0.11, 'Pegasus': 0.11, 'Keyboard': 0.06 } },
    { name: 'Mythical Egg', price: 500000, borderColor: '#800080', chances: { 'Dragon': 0.50, 'Unicorn': 0.11, 'Keyboard': 0.11, 'Sphynx': 0.11, 'Pikachu': 0.11, 'Kraken': 0.06 } },
    { name: 'Godly Egg', price: 2000000, borderColor: '#FFC0CB', chances: { 'Keyboard': 0.50, 'Autotyper': 0.15, 'Big Foot': 0.15, 'Kraken': 0.15, 'Nusakan': 0.0098, 'Guappanese': 0.0098, 'Mario': 0.0098, 'Parz': 0.0098, 'Soul': 0.0098, 'Slimretta': 0.0010 } },
    { name: 'Mystery Egg', price: 250000, borderColor: '#ffffff', chances: { 'Imp': 0.33, 'Phoenix': 0.33, 'Keyboard': 0.24, 'Kraken': 0.0725, 'Guappanese': 0.0225, 'Slimretta': 0.0050 } },
    { name: 'Surprising Egg', price: 1000000, borderColor: '#5555ff', chances: { 'Pikachu': 0.33, 'Keyboard': 0.33, 'Kraken': 0.24, 'Kraken': 0.070, 'Guappanese': 0.020, 'Slimretta': 0.010 } }
];

         function isCasinoUnlockedByLevel() {
  return getLevelInfoFromRaces(totalRaces).level >= 3;
}



// Levels
const LEVEL_MILESTONES = [
  { level: 0, races: 0 },
  { level: 1, races: 5 },
  { level: 2, races: 25 },
  { level: 3, races: 50, reward: "Unlock the Casino" },
  { level: 4, races: 75 },
  { level: 5, races: 100 },
  { level: 6, races: 150 },
  { level: 7, races: 200 },
  { level: 8, races: 250 },
  { level: 9, races: 300 },
  { level: 10, races: 400 },
  { level: 11, races: 500 },
  { level: 12, races: 750 },
  { level: 13, races: 1000 },
  { level: 14, races: 1250},
  { level: 15, races: 1500},
];




function getLevelInfoFromRaces(totalRaces) {
  const races = Math.max(0, parseInt(totalRaces, 10) || 0);
  const list = [...LEVEL_MILESTONES].sort((a, b) => a.races - b.races);

  let idx = 0;
  for (let i = 0; i < list.length; i++) {
    if (races >= list[i].races) idx = i;
    else break;
  }

  const current = list[idx];
  const next = list[idx + 1] || null;

  return {
    level: current.level,
    racesToNext: next ? Math.max(0, next.races - races) : null,
    nextAt: next ? next.races : null,
    nextReward: next?.reward || null
  };
}


function formatLevelMiniText(totalRaces) {
  const info = getLevelInfoFromRaces(totalRaces);

  if (info.racesToNext === null) {
    return `Level ${info.level} (MAX)`;
  }

  let text =
    `Level ${info.level}\n` +
    `Next level: ${info.racesToNext} races`;

  if (info.nextReward) {
    text += `\nReward: ${info.nextReward}`;
  }

  return text;
}



         function getRoleStyles(username, callback) {
    database.ref('userRoles/' + username).on('value', snapshot => {
        const roleName = snapshot.val();
        const role = window.rolesConfig[roleName];
        if (role) {
            callback(role.tag, role.tagColor, role.nameColor);
        } else {
            callback('', '#0f0', '#0f0');
        }
    });
}

         function updateAchievementBoxes() {
  achievements.forEach(ach => {
    const box = document.getElementById(`achievement-${ach.id}`);
    if (box) {
      const newColor = ach.unlocked ? '#0f0' : '#555';
      if (box.style.color !== newColor) {
        box.style.color = newColor;
      }
    }
  });
}


    function checkAchievements() {
    achievements.forEach(ach => {
        if (!ach.unlocked && ach.check()) {
            ach.unlocked = true;
            localStorage.setItem(`achievement${ach.id}Unlocked`, true);
        }
    });
    updateAchievementBoxes();
}


setInterval(() => {
    if (coinsPerSecond > 0) {
        coins += coinsPerSecond;
        localStorage.setItem('klaviaCoins', coins);
        if (window.updateHUD) window.updateHUD();
    }
}, 1000);


    const GameCalculator = (function() {
    function runCalculation(mode) {
        const allUpgrades = [...upgrades, ...skillTreeUpgrades, ...prestigeUpgrades];
        const myPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');

        let baseCpR = baseCoinsPerRace;
        upgrades.forEach(u => u.purchased && u.type === 'multiplier' && (baseCpR *= u.value));
        if (mode === 'base') return Math.round(baseCpR);

        let totalRaceBonus = 0;
        upgrades.forEach(u => {
            if (u.purchased && u.type === 'totalRaceBonus') {
                totalRaceBonus += Math.floor(totalRaces / (u.interval || 25)) * u.value;
            }
        });
        if (mode === 'raceBonus') return totalRaceBonus;

        let totalPercent = 0;
        allUpgrades.forEach(u => {
            if (!u.purchased) return;
            let p = 0;
            if (u.type === 'percent') p = u.value;
            else if (u.type === 'sessionPercent') p = Math.floor(sessionRaces / 10) * u.value;
            else if (u.type === 'totalPercent') p = Math.floor(totalRaces / 10) * u.value;
            else if (u.type === 'prestigeBonus') p = prestigeCount * u.value;
            else if (u.type === 'coinPercent') p = Math.floor(coins / 1000) * u.value;
            else if ((u.type === 'milestone' || u.type === 'milestone2') && totalRaces % u.raceInterval === 0) p = u.bonusPercent;

            totalPercent += p;
        });


const maxEquip = (typeof getBarnSize === "function")
  ? getBarnSize()
  : (parseInt(localStorage.getItem("barnSize") || "3", 10) || 3);

let equippedPets = JSON.parse(localStorage.getItem('equippedPets') || '[]');
equippedPets = equippedPets.map(x => parsePetKey(x).key);

equippedPets = Array.from(new Set(equippedPets)).slice(0, maxEquip);
localStorage.setItem('equippedPets', JSON.stringify(equippedPets));

const ownedPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');

const ownedKeySet = new Set(ownedPets.map(p => petKey(p.name, p.level)));
equippedPets = equippedPets.filter(k => ownedKeySet.has(k));
localStorage.setItem('equippedPets', JSON.stringify(equippedPets));

const petMultiplierSum = equippedPets.reduce((sum, key) => {
  const { name, level } = parsePetKey(key);
  const ownedEntry = ownedPets.find(p => p.name === name && (parseInt(p.level,10)||1) === level);
  return sum + ((ownedEntry?.multiplier || 0) / 100);
}, 0);



        if (mode === 'percent') {
            let finalPct = (totalPercent + petMultiplierSum) * 100;
            skillTreeUpgrades.forEach(s => (s.purchased && s.type === 'randomBonus' && Math.random() < s.chance) && (finalPct *= s.bonusMultiplier));
            return finalPct;
        }

        let cpr = baseCpR + totalRaceBonus;
        allUpgrades.forEach(u => u.purchased && u.type === 'sessionRaceBonus' && (cpr += Math.floor(sessionRaces / 10) * u.value));
        allUpgrades.forEach(u => u.purchased && u.type === 'flat' && (cpr += u.value));

        cpr += (cpr * totalPercent) + (cpr * petMultiplierSum);

        let lucky = upgrades.find(u => u.type === 'randomBonus');
        if (lucky?.purchased && Math.random() < lucky.chance) cpr *= lucky.bonusMultiplier;

        return cpr;
    }

    return {
        calculateTotalRaceBonus: () => runCalculation('raceBonus'),
        calculateBaseCpR: () => runCalculation('base'),
        calculateTotalMultiplierPercent: () => runCalculation('percent'),
        calculateCoinsPerRace: () => runCalculation('cpr')
    };
})();
const calculateTotalRaceBonus = GameCalculator.calculateTotalRaceBonus;
const calculateBaseCpR = GameCalculator.calculateBaseCpR;
const calculateTotalMultiplierPercent = GameCalculator.calculateTotalMultiplierPercent;
const calculateCoinsPerRace = GameCalculator.calculateCoinsPerRace;



      function formatPercent(value) {
    if (value % 1 === 0) return value;
    return value.toFixed(2);
}


function formatCoins(value) {
    if (value % 1 === 0) return value;
    return value.toFixed(2);
}

         function petKey(name, level) {
  const lv = Math.max(1, parseInt(level, 10) || 1);
  return `${name}|L${lv}`;
}

function parsePetKey(keyOrName) {
  if (typeof keyOrName !== "string") return { name: "", level: 1, key: "" };

  const m = keyOrName.match(/^(.*)\|L(\d+)$/);
  if (!m) return { name: keyOrName, level: 1, key: petKey(keyOrName, 1) };

  const name = m[1];
  const level = parseInt(m[2], 10) || 1;
  return { name, level, key: petKey(name, level) };
}

function formatPetLabel(name, level) {
  return level > 1 ? `${name} Lv${level}` : name;
}

function getBaseMultiplierForPet(name, fallbackOwnedMultiplier = 0) {
  const cfg = window.petsConfig?.[name];
  if (cfg && typeof cfg.multiplier === "number") return cfg.multiplier;
  return Number(fallbackOwnedMultiplier || 0);
}

function multiplierForLevel(baseMult, level) {
  const lv = Math.max(1, parseInt(level, 10) || 1);
  return baseMult * Math.pow(1.5, lv - 1);
}









    // KFC HUD
    let hud = null;
    let activeTabName = 'Home';
    let headerElement = null;

    function createHUD() {
        hud = document.createElement('div');
        hud.id = 'klavia-hud';
        hud.style.position = 'fixed';
        hud.style.top = '300px';
        hud.style.left = '1px';
        hud.style.transform = 'none';
        hud.style.backgroundColor = '#111';
        hud.style.color = '#0f0';
        hud.style.fontFamily = 'Courier New, monospace';
        hud.style.zIndex = '9999';
        hud.style.border = '2px solid #0f0';
        hud.style.width = '40px';
        hud.style.cursor = 'pointer';
        hud.style.display = 'flex';
        hud.style.flexDirection = 'column';
        hud.style.alignItems = 'stretch';

        headerElement = document.createElement('div');
        headerElement.textContent = 'KFC';
        headerElement.style.fontWeight = 'bold';
        headerElement.style.textAlign = 'center';
        headerElement.style.fontSize = '16px';
        headerElement.style.padding = '5px';
        headerElement.style.userSelect = 'none';
        headerElement.style.borderBottom = '2px solid #0f0';
        hud.appendChild(headerElement);

        const container = document.createElement('div');
        container.style.display = 'none';
        container.style.flexDirection = 'column';
        hud.appendChild(container);

// Generators Tab
const generatorsTab = document.createElement('div');
generatorsTab.id = 'tab-Generators';
generatorsTab.style.display = 'none';
generatorsTab.style.flexDirection = 'column';
generatorsTab.style.padding = '5px';
generatorsTab.style.color = '#0f0';

// Header
const generatorsTitle = document.createElement('div');
generatorsTitle.textContent = 'Generators';
generatorsTitle.style.fontWeight = 'bold';
generatorsTitle.style.marginBottom = '5px';
generatorsTab.appendChild(generatorsTitle);

// Container
const generatorsContainer = document.createElement('div');
generatorsContainer.style.display = 'flex';
generatorsContainer.style.flexWrap = 'wrap';
generatorsContainer.style.gap = '5px';
generatorsTab.appendChild(generatorsContainer);

generators.forEach((gen, index) => {
    const box = document.createElement('div');
    box.id = `generator-${gen.id}`;
    box.textContent = `${gen.id}`;
    box.style.width = '40px';
    box.style.height = '32px';
    box.style.border = '2px solid #0f0';
    box.style.color = '#0f0';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontWeight = 'bold';
    box.style.fontFamily = 'Courier New, monospace';
    box.style.cursor = 'pointer';
    box.style.userSelect = 'none';
    box.style.marginRight = (index + 1) % 7 === 0 ? '0px' : '5px';
    box.title = gen.tooltip || '';

    generatorsContainer.appendChild(box);

    let timerInterval = null;

    box.addEventListener('click', () => {
        if (starBits < gen.cost) {
            alert(`You need ${gen.cost} Star Bits to activate this generator!`);
            return;
        }

        starBits -= gen.cost;
        localStorage.setItem('starBits', starBits);

        coinsPerSecond += gen.cps;

        let remaining = gen.duration || 30;
        box.textContent = `${remaining}s`;
        box.style.color = '#ff0';
        box.style.cursor = 'default';

        if (window.updateHUD) window.updateHUD();

        timerInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                box.textContent = `${remaining}s`;
                box.title = `${gen.cps} CpS for ${remaining}s`;
            } else {
                coinsPerSecond -= gen.cps;

                box.textContent = `${gen.id}`;
                box.style.color = '#0f0';
                box.style.cursor = 'pointer';
                box.title = gen.tooltip || '';
                clearInterval(timerInterval);
            }
            if (window.updateHUD) window.updateHUD();
        }, 1000);
    });
});



        container.appendChild(generatorsTab);




        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'flex';
        tabsContainer.style.borderBottom = '2px solid #0f0';
        container.appendChild(tabsContainer);

        const tabNames = ['Home', 'Upgrades', 'Achievements'];
        const tabButtons = {};
        const tabContents = {};


        tabNames.forEach(name => {
            const btn = document.createElement('div');
            btn.textContent = name;
            btn.style.flex = '1';
            btn.style.textAlign = 'center';
            btn.style.padding = '5px';
            btn.style.cursor = 'pointer';
            btn.style.userSelect = 'none';
            btn.style.borderRight = '2px solid #0f0';
            tabButtons[name] = btn;
            tabsContainer.appendChild(btn);

            const content = document.createElement('div');
            content.style.padding = '5px';
            content.style.display = (name === 'Home') ? 'block' : 'none';
            content.style.flexWrap = 'wrap';
            content.style.alignItems = 'center';
            content.style.gap = '5px';
            tabContents[name] = content;
            container.appendChild(content);

            btn.addEventListener('click', () => {
    activeTabName = name;

    generatorsTab.style.display = 'none';

    tabNames.forEach(n => {
        tabContents[n].style.display =
            (n === name) ? (n === 'Home' ? 'block' : 'flex') : 'none';
        tabButtons[n].style.backgroundColor = n === name ? '#0f0' : '#111';
        tabButtons[n].style.color = n === name ? '#111' : '#0f0';
    });

    showTabBoxes(name);
});

        });

        headerElement.addEventListener('click', () => {
    expanded = !expanded;
    localStorage.setItem('hudExpanded', JSON.stringify(expanded));
    container.style.display = expanded ? 'flex' : 'none';
    hud.style.width = expanded ? '300px' : '40px';
    headerElement.textContent = expanded ? 'Klavia Frenzy Clicker 0.1.5.2' : 'KFC';
            syncHUDs();
});


        window.updateHUD = function () {
    const home = tabContents['Home'];
    if (!home) return;

    let statsDiv = home.querySelector('.hud-stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'hud-stats';
        home.insertBefore(statsDiv, generatorsButton);
    }

    const generatorsUnlocked = skillTreeUpgrades[7]?.purchased;
generatorsButton.style.display = skillTreeUpgrades[7]?.purchased ? 'flex' : 'none';



const starBitsUnlocked = skillTreeUpgrades[6]?.purchased;
statsDiv.innerHTML = `
    <span style="color: #5ffcff; font-weight: bold;">
        Multi: +${formatPercent(calculateTotalMultiplierPercent())}%


    </span><br>
    Session Races: ${sessionRaces}<br>
    Total Races: ${totalRaces}<br>
    Coins: ${formatCoins(coins)}<br>
<span style="color: yellow;">Base CpR: ${formatCoins(calculateBaseCpR())}</span><br>
<span style="color: yellow;">CpR: ${formatCoins(calculateCoinsPerRace())}</span><br>
    ${starBitsUnlocked ? `<span style="color: magenta;">Star Bits: ${starBits}</span><br>` : ''}
    ${generatorsUnlocked ? `<span style="color: cyan;">CpS: ${coinsPerSecond}</span>` : ''}
    ${prestigePoints > 0 ? `<span style="color: pink;">PP: ${prestigePoints}</span><br>` : ''}
`;


if (isCasinoUnlockedByLevel()) {
  casinoButton.style.display = 'flex';
} else {
  casinoButton.style.display = 'none';
}


generatorsButton.style.display = skillTreeUpgrades[7]?.purchased ? 'flex' : 'none';

};



// Generators Button
const generatorsButton = document.createElement('div');
generatorsButton.id = 'generators-btn';
generatorsButton.textContent = 'Generators';
generatorsButton.style.width = '100%';
generatorsButton.style.height = '32px';
generatorsButton.style.border = '2px solid #0f0';
generatorsButton.style.color = '#0f0';
generatorsButton.style.display = 'none';
generatorsButton.style.alignItems = 'center';
generatorsButton.style.justifyContent = 'center';
generatorsButton.style.fontWeight = 'bold';
generatorsButton.style.cursor = 'pointer';
generatorsButton.style.userSelect = 'none';
generatorsButton.style.marginTop = '5px';
generatorsButton.title = 'Open the Generators tab';
tabContents['Home'].appendChild(generatorsButton);





generatorsButton.addEventListener('click', () => {

    Object.values(tabContents).forEach(c => c.style.display = 'none');
    skillTreeTab.style.display = 'none';
    casinoTab.style.display = 'none';


    generatorsTab.style.display = 'flex';
});


        // Upgrades Tab
const upgradesTab = tabContents['Upgrades'];
upgradesTab.style.display = 'flex';
upgradesTab.style.flexWrap = 'wrap';
upgradesTab.style.gap = '5px';
upgradesTab.style.padding = '5px';

upgrades.forEach((upg, index) => {
    if (document.getElementById(`upgrade-${upg.id}`)) return;

    const box = document.createElement('div');
    box.id = `upgrade-${upg.id}`;
    box.textContent = upg.id;
    box.style.width = '40px';
    box.style.height = '32px';
    box.style.border = '2px solid #0f0';
    box.style.color = upg.purchased ? '#555' : '#0f0';
    box.style.display = 'none';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontWeight = 'bold';
    box.style.cursor = 'pointer';
    box.style.userSelect = 'none';
    box.style.marginRight = (index + 1) % 7 === 0 ? '0px' : '5px';
    box.title = upg.purchased ? `Purchased: ${upg.description}` : `${upg.cost} coins: ${upg.description}`;

    box.addEventListener('click', () => {
    if (upg.purchased) return;
    if (coins >= upg.cost) {
        coins -= upg.cost;
        coins = Math.round(coins);
        localStorage.setItem('klaviaCoins', coins);

        upg.purchased = true;
        localStorage.setItem(`upgrade${upg.id}Purchased`, true);

        box.style.color = '#555';
        box.title = `Purchased: ${upg.description}`;

        if (window.updateHUD) window.updateHUD();
        if (typeof updateFirebaseCoins === 'function') updateFirebaseCoins();

        const upgIndex = upgrades.findIndex(u => u.id === upg.id);

        if ((upgIndex + 1) % 5 === 0) {
            const startOfNextRow = upgIndex + 1;
            const endOfNextRow = startOfNextRow + 5;

            for (let i = startOfNextRow; i < Math.min(endOfNextRow, upgrades.length); i++) {
                const nextBox = document.getElementById(`upgrade-${upgrades[i].id}`);
                if (nextBox) nextBox.style.display = 'flex';
            }
        }

        checkAchievements();
    } else {
        alert(`You need ${upg.cost} coins for this upgrade.`);
    }
});


    upgradesTab.appendChild(box);
});

let farmUnlockedState = localStorage.getItem('farmUnlocked') === 'true';

function farmUnlocked() {
    return farmUnlockedState === true;
}

// Farm Tab
const farmTab = document.createElement('div');
farmTab.id = 'tab-Farm';
farmTab.style.display = 'none';
farmTab.style.flexWrap = 'wrap';
farmTab.style.alignItems = 'center';
farmTab.style.gap = '5px';
farmTab.style.padding = '5px';
farmTab.style.justifyContent = 'flex-start';
container.appendChild(farmTab);

// Chickens
const chickenImages = [
  { name: 'Default', src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/1f414.png',             costToUnlock: 0,     unlockSeconds: 0 },
  { name: 'Uncommon',    src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/blue%20chicken.png',   costToUnlock: 10000,  unlockSeconds: 60 },
  { name: 'Rare',     src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/red%20chicken.png',    costToUnlock: 50000, unlockSeconds: 120 },
  { name: 'Legendary',  src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/orange%20chicken.png', costToUnlock: 200000,  unlockSeconds: 240 },
  { name: 'Mythical',  src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/purple%20chicken.png', costToUnlock: 1000000, unlockSeconds: 600 },
  { name: 'Godly',    src: 'https://cdn.jsdelivr.net/gh/guappanese/kfc-assets@main/pink%20chicken.png',   costToUnlock: 4000000,  unlockSeconds: 1800 }
];

const CHICKEN_SELECTED_KEY = 'selectedChickenIndex';
const CHICKEN_UNLOCKED_KEY = 'unlockedChickenIndex';

const CHICKEN_PENDING_KEY = 'pendingChickenUnlock';

function safeInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

let chickenIndex = safeInt(localStorage.getItem(CHICKEN_SELECTED_KEY), 0);
if (chickenIndex < 0 || chickenIndex >= chickenImages.length) chickenIndex = 0;

let unlockedTier = safeInt(localStorage.getItem(CHICKEN_UNLOCKED_KEY), 0);
if (unlockedTier < 0) unlockedTier = 0;
if (unlockedTier >= chickenImages.length) unlockedTier = chickenImages.length - 1;

let pendingUnlock = null;
try {
  const raw = localStorage.getItem(CHICKEN_PENDING_KEY);
  if (raw) pendingUnlock = JSON.parse(raw);
} catch (e) {
  pendingUnlock = null;
}

const chickenWrap = document.createElement('div');
chickenWrap.style.display = 'flex';
chickenWrap.style.flexDirection = 'column';
chickenWrap.style.alignItems = 'center';
chickenWrap.style.justifyContent = 'center';
chickenWrap.style.width = '100%';
chickenWrap.style.gap = '6px';

// Chicken image
const chickenEl = document.createElement('img');
chickenEl.style.width = '64px';
chickenEl.style.height = '64px';
chickenEl.style.imageRendering = 'pixelated';
chickenEl.style.cursor = 'pointer';

// Countdown
const timerText = document.createElement('div');
timerText.style.fontWeight = 'bold';
timerText.style.color = '#0f0';
timerText.style.fontSize = '12px';
timerText.style.userSelect = 'none';
timerText.textContent = '';

function saveState() {
  localStorage.setItem(CHICKEN_SELECTED_KEY, String(chickenIndex));
  localStorage.setItem(CHICKEN_UNLOCKED_KEY, String(unlockedTier));
  if (pendingUnlock) localStorage.setItem(CHICKEN_PENDING_KEY, JSON.stringify(pendingUnlock));
  else localStorage.removeItem(CHICKEN_PENDING_KEY);
}

function formatTimeLeft(msLeft) {
  const s = Math.max(0, Math.ceil(msLeft / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r}s`;
}

function renderChickenUI() {
  const cfg = chickenImages[chickenIndex];
  chickenEl.src = cfg.src;

  const nextIndex = (chickenIndex + 1) % chickenImages.length;

  if (pendingUnlock && typeof pendingUnlock.finishAt === 'number') {
    const msLeft = pendingUnlock.finishAt - Date.now();

    if (msLeft > 0) {
      timerText.textContent = `Upgrading chicken to ${chickenImages[pendingUnlock.targetIndex]?.name || 'Next'}: ${formatTimeLeft(msLeft)} left`;
      chickenEl.title = `${cfg.name} Chicken (unlock in progress...)`;
    } else {
      const target = pendingUnlock.targetIndex;
      pendingUnlock = null;

      if (Number.isFinite(target) && target > unlockedTier) {
        unlockedTier = target;
      }

      if (Number.isFinite(target) && target >= 0 && target < chickenImages.length) {
        chickenIndex = target;
      }

      timerText.textContent = '';
      saveState();

      if (window.updateHUD) window.updateHUD();
      if (typeof window.refreshPetsUI === 'function') window.refreshPetsUI();
      renderChickenUI();
      return;
    }
  } else {
    timerText.textContent = '';
    if (nextIndex <= unlockedTier) {
      chickenEl.title = `${cfg.name} Chicken (click: next)`;
    } else {
      const cost = chickenImages[nextIndex].costToUnlock || 0;
      const secs = chickenImages[nextIndex].unlockSeconds || 0;
      chickenEl.title = `${cfg.name} Chicken (unlock next: ${cost.toLocaleString()} coins, ${secs}s)`;
    }
  }

  saveState();
}

window.refreshChickenUI = function () {
  chickenIndex = safeInt(localStorage.getItem(CHICKEN_SELECTED_KEY), 0);
  if (chickenIndex < 0 || chickenIndex >= chickenImages.length) chickenIndex = 0;

  unlockedTier = safeInt(localStorage.getItem(CHICKEN_UNLOCKED_KEY), 0);
  if (unlockedTier < 0) unlockedTier = 0;
  if (unlockedTier >= chickenImages.length) unlockedTier = chickenImages.length - 1;

  pendingUnlock = null;
  try {
    const raw = localStorage.getItem(CHICKEN_PENDING_KEY);
    if (raw) pendingUnlock = JSON.parse(raw);
  } catch (e) {
    pendingUnlock = null;
  }

  renderChickenUI();
};

chickenEl.onclick = () => {
  if (pendingUnlock) {
    return;
  }

  const nextIndex = (chickenIndex + 1) % chickenImages.length;

  if (nextIndex <= unlockedTier) {
    chickenIndex = nextIndex;
    renderChickenUI();
    return;
  }

  const nextCfg = chickenImages[nextIndex];
  const cost = nextCfg.costToUnlock || 0;
  const secs = nextCfg.unlockSeconds || 0;

  if (coins < cost) {
    alert(`You need ${cost.toLocaleString()} coins to unlock ${nextCfg.name} Chicken!`);
    return;
  }

  coins -= cost;
  coins = Math.round(coins);
  localStorage.setItem('klaviaCoins', coins);

  if (window.updateHUD) window.updateHUD();
  if (typeof updateFirebaseCoins === 'function') updateFirebaseCoins();

  pendingUnlock = {
    targetIndex: nextIndex,
    finishAt: Date.now() + (Math.max(0, secs) * 1000)
  };

  saveState();
  renderChickenUI();
};

chickenWrap.appendChild(chickenEl);
chickenWrap.appendChild(timerText);
farmTab.appendChild(chickenWrap);

// Divider
const farmDivider = document.createElement('div');
farmDivider.style.cssText = `
  width: 100%;
  height: 1px;
  background: #0f0;
  margin: 6px 0;
`;
farmTab.appendChild(farmDivider);

const farmExtraSection = document.createElement('div');
farmExtraSection.style.cssText = `
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-top: 4px;
`;
farmTab.appendChild(farmExtraSection);

// Barn Upgrade

const barnUpgradeCosts = [
  { currency: "coins", amount: 10000 },
  { currency: "coins", amount: 100000 },
  { currency: "starbits", amount: 25 },
  { currency: "coins", amount: 1000000 },
  { currency: "prestigepoints", amount: 1 },
  { currency: "starbits", amount: 200 },
  { currency: "coins", amount: 10000000 }
];

const BARN_SIZE_KEY = "barnSize";
function getBarnSize() {
  const v = parseInt(localStorage.getItem(BARN_SIZE_KEY) || "3", 10);
  return Math.max(1, v || 3);
}
function setBarnSize(n) {
  localStorage.setItem(BARN_SIZE_KEY, String(Math.max(1, parseInt(n, 10) || 1)));
}

function formatCurrencyName(cur) {
  if (cur === "coins") return "Coins";
  if (cur === "starbits") return "Starbits";
  if (cur === "prestigepoints") return "Prestige Points";
  return cur;
}


function getBalance(cur) {
  if (cur === "coins") return Number(localStorage.getItem("klaviaCoins") || 0);
  if (cur === "starbits") return Number(localStorage.getItem("starbits") || 0);
  if (cur === "prestigepoints") return Number(localStorage.getItem("prestigePoints") || 0);
  return 0;
}
function setBalance(cur, val) {
  const v = Number(val || 0);
  if (cur === "coins") localStorage.setItem("klaviaCoins", String(v));
  else if (cur === "starbits") localStorage.setItem("starbits", String(v));
  else if (cur === "prestigepoints") localStorage.setItem("prestigePoints", String(v));
}

// UI Box
const barnBox = document.createElement("div");
barnBox.style.cssText = `
  width: 100%;
  border: 1px solid #0f0;
  background: #0b0b0b;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
farmExtraSection.appendChild(barnBox);

const barnTitle = document.createElement("div");
barnTitle.style.cssText = `color:#0f0; font-weight:bold; font-size:12px;`;
barnBox.appendChild(barnTitle);

const barnUpgradeBtn = document.createElement("div");
barnUpgradeBtn.textContent = "Upgrade Barn";
barnUpgradeBtn.style.cssText = `
  padding: 8px;
  text-align: center;
  border: 1px solid #0f0;
  background: #111;
  color: #0f0;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
`;
barnBox.appendChild(barnUpgradeBtn);

const barnCostText = document.createElement("div");
barnCostText.style.cssText = `font-size:10px; color:#8f8; opacity:0.95;`;
barnBox.appendChild(barnCostText);

// Render
function refreshBarnUI() {
  const size = getBarnSize();
  barnTitle.textContent = `Current Barn Size: ${size}`;

  const idx = Math.max(0, size - 3);
  const cost = barnUpgradeCosts[idx];

  if (!cost) {
    barnCostText.textContent = `Max barn size reached`;
    barnUpgradeBtn.style.opacity = "0.5";
    barnUpgradeBtn.style.cursor = "default";
    return;
  }

  const prettyAmt =
    cost.currency === "coins"
      ? Number(cost.amount).toLocaleString()
      : String(cost.amount);

  barnCostText.textContent = `+1 size: ${prettyAmt} ${formatCurrencyName(cost.currency)}`;
  barnUpgradeBtn.style.opacity = "1";
  barnUpgradeBtn.style.cursor = "pointer";
}

barnUpgradeBtn.onclick = () => {
  const size = getBarnSize();
  const idx = Math.max(0, size - 3);
  const cost = barnUpgradeCosts[idx];
  if (!cost) return;

  const bal = getBalance(cost.currency);
  if (bal < cost.amount) {
    alert(`Not enough ${formatCurrencyName(cost.currency)}!`);
    return;
  }

  setBalance(cost.currency, bal - cost.amount);

const before = localStorage.getItem("barnSize");
setBarnSize(size + 1);
const after = localStorage.getItem("barnSize");

console.log("[BARN] before:", before, "after:", after, "getBarnSize():", getBarnSize());

if (window.updateHUD) window.updateHUD();
if (typeof refreshPetsUI === "function") refreshPetsUI();


  refreshBarnUI();
};

refreshBarnUI();

const farmDivider2 = document.createElement('div');
farmDivider2.style.cssText = `
  width: 100%;
  height: 1px;
  background: #0f0;
  margin: 10px 0;
`;
farmTab.appendChild(farmDivider2);

const farmBottomSection = document.createElement('div');
farmBottomSection.style.cssText = `
  width: 100%;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 0;
`;
farmTab.appendChild(farmBottomSection);


const upgradeBtnWrap = document.createElement('div');
upgradeBtnWrap.style.cssText = `
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
farmBottomSection.appendChild(upgradeBtnWrap);


// Upgrade Pets Button
const upgradePetsBtn = document.createElement('button');
upgradePetsBtn.textContent = 'Upgrade Pets';
upgradePetsBtn.style.cssText = `
  background: #111;
  color: #0f0;
  border: 1px solid #0f0;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
`;
upgradeBtnWrap.appendChild(upgradePetsBtn);


        const upgradeOverlay = document.createElement('div');
upgradeOverlay.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
document.body.appendChild(upgradeOverlay);

        const upgradePetsTab = document.createElement('div');
upgradePetsTab.style.cssText = `
  width: 500px;
  height: 500px;
  background: #111;
  border: 2px solid #0f0;
  display: flex;
  flex-direction: column;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
`;
upgradeOverlay.appendChild(upgradePetsTab);

        const upgradeHeader = document.createElement('div');
upgradeHeader.textContent = 'Upgrade Pets';
upgradeHeader.style.cssText = `
  color: #0f0;
  font-weight: bold;
  text-align: center;
  margin-bottom: 6px;
`;
upgradePetsTab.appendChild(upgradeHeader);

const closeUpgradeBtn = document.createElement('div');
closeUpgradeBtn.textContent = '✕';
closeUpgradeBtn.style.cssText = `
  position: absolute;
  top: 6px;
  right: 8px;
  cursor: pointer;
  color: #0f0;
  font-weight: bold;
`;
upgradePetsTab.appendChild(closeUpgradeBtn);

        const upgradePetsContent = document.createElement('div');
upgradePetsContent.style.cssText = `
  flex: 1;
  margin-top: 6px;
  padding: 6px;
  overflow: auto;
`;
upgradePetsTab.appendChild(upgradePetsContent);

window.upgradePetsContent = upgradePetsContent;

window.refreshUpgradePetsUI = function(counts, equippedPets) {
  const root = window.upgradePetsContent;
  if (!root) return;

  root.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-content: flex-start;
  `;
  root.appendChild(wrap);

  const entries = Object.entries(counts).filter(([_, info]) => (info?.count || 0) >= 5);

  if (entries.length === 0) {
    const msg = document.createElement('div');
    msg.textContent = 'No pets with 5x+ duplicates yet.';
    msg.style.cssText = `color:#777; font-size:11px; padding:8px;`;
    wrap.appendChild(msg);
    return;
  }

  entries.forEach(([key, info]) => {
    const pData = window.petsConfig?.[info.name];
    const isRGBPet = pData && (pData.rarity === 'Divine' || pData.rarity === 'Ethereal');
    const isEquipped = Array.isArray(equippedPets) && equippedPets.includes(key);

    const multNow = multiplierForLevel(info.baseMultiplier, info.level);

    const box = document.createElement('div');
    box.style.cssText = `
      padding: 4px 6px;
      border: 1px solid ${isEquipped ? '#fff' : '#444'};
      font-size: 9px;
      background: #1a1a1a;
      user-select: none;
      cursor: pointer;
    `;

    const shownName = formatPetLabel(info.name, info.level);

    if (isRGBPet) {
      const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];

      const nameRow = document.createElement('div');
      const strong = document.createElement('strong');

      shownName.split('').forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.color = rainbowColors[i % rainbowColors.length];
        s.style.textShadow = `0 0 3px ${s.style.color}`;
        strong.appendChild(s);
      });

      const countSpan = document.createElement('span');
      countSpan.textContent = ` x${info.count}${isEquipped ? ' (E)' : ''}`;
      countSpan.style.color = '#aaa';
      countSpan.style.marginLeft = '4px';

      nameRow.appendChild(strong);
      nameRow.appendChild(countSpan);
      box.appendChild(nameRow);

      const bonus = document.createElement('div');
      bonus.innerHTML = `<span style="color:#0f0">+${multNow.toFixed(1)}%</span>`;
      box.appendChild(bonus);
    } else {
      box.style.color = pData?.color || '#fff';
      box.innerHTML =
        `<strong>${shownName}</strong> <span style="color:#aaa">x${info.count}${isEquipped ? ' (E)' : ''}</span><br>` +
        `<span style="color:#0f0">+${multNow.toFixed(1)}%</span>`;
    }

    box.title = `Click to upgrade: consume 5x ${shownName} → 1x ${formatPetLabel(info.name, info.level + 1)}`;

    box.onclick = () => {
      const ownedPetsLive = JSON.parse(localStorage.getItem('ownedPets') || '[]');

      const name = info.name;
      const level = info.level;

      const matchIdx = [];
      for (let i = 0; i < ownedPetsLive.length; i++) {
        const p = ownedPetsLive[i];
        const pLevel = Math.max(1, parseInt(p.level, 10) || 1);
        if (p.name === name && pLevel === level) matchIdx.push(i);
      }

      if (matchIdx.length < 5) {
        alert('Not enough duplicates (need 5).');
        return;
      }

      const toRemove = matchIdx.slice(-5).sort((a,b) => b - a);
      toRemove.forEach(idx => ownedPetsLive.splice(idx, 1));

      const nextLevel = level + 1;
      const baseMult = getBaseMultiplierForPet(name, info.baseMultiplier);
      const newMult = multiplierForLevel(baseMult, nextLevel);

      ownedPetsLive.push({
        name,
        level: nextLevel,
        multiplier: newMult,
        rarity: pData?.rarity ?? info.rarity ?? "Unknown"
      });

      localStorage.setItem('ownedPets', JSON.stringify(ownedPetsLive));

      if (window.updateHUD) window.updateHUD();
      if (typeof refreshPetsUI === "function") refreshPetsUI();
    };

    wrap.appendChild(box);
  });
};





        upgradePetsBtn.onclick = () => {
  upgradeOverlay.style.display = 'flex';

  const ownedPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');

  const counts = {};
  ownedPets.forEach(p => {
    const name = p.name;
    const level = Math.max(1, parseInt(p.level, 10) || 1);
    const key = `${name}|L${level}`;

    if (!counts[key]) {
      counts[key] = {
        name,
        level,
        count: 0,
        rarity: p.rarity,
        baseMultiplier: (window.petsConfig?.[name]?.multiplier ?? p.multiplier ?? 0)
      };
    }
    counts[key].count += 1;
  });

  let equippedPets = JSON.parse(localStorage.getItem('equippedPets') || '[]');
  equippedPets = equippedPets.map(x => (typeof x === 'string' ? x : '')).map(k => {
    return k.includes('|L') ? k : `${k}|L1`;
  });
  equippedPets = Array.from(new Set(equippedPets));

  if (typeof window.refreshUpgradePetsUI === 'function') {
    window.refreshUpgradePetsUI(counts, equippedPets);
  }
};


closeUpgradeBtn.onclick = () => {
  upgradeOverlay.style.display = 'none';
};

upgradeOverlay.onclick = (e) => {
  if (e.target === upgradeOverlay) {
    upgradeOverlay.style.display = 'none';
  }
};




if (window.__farmChickenTimerInterval) clearInterval(window.__farmChickenTimerInterval);
window.__farmChickenTimerInterval = setInterval(() => {
  if (!pendingUnlock) return;
  renderChickenUI();
}, 250);

renderChickenUI();







// Farm Button
const farmButton = document.createElement('div');
farmButton.id = 'farm-btn';
farmButton.textContent = 'Farm';
farmButton.style.width = '100%';
farmButton.style.height = '32px';
farmButton.style.border = '2px solid #0f0';
farmButton.style.color = '#0f0';
farmButton.style.display = 'none';
farmButton.style.alignItems = 'center';
farmButton.style.justifyContent = 'center';
farmButton.style.fontWeight = 'bold';
farmButton.style.cursor = 'pointer';
farmButton.style.userSelect = 'none';
farmButton.style.marginTop = '5px';
farmButton.title = 'Open the Farm';
upgradesTab.appendChild(farmButton);

tabNames.push('Farm');
tabContents['Farm'] = farmTab;
tabButtons['Farm'] = farmButton;

farmButton.onclick = () => {
    activeTabName = 'Farm';

    tabNames.forEach(n => {
        tabContents[n].style.display = (n === 'Farm') ? 'flex' : 'none';
        tabButtons[n].style.backgroundColor = n === 'Farm' ? '#0f0' : '#111';
        tabButtons[n].style.color = n === 'Farm' ? '#111' : '#0f0';
    });

    showTabBoxes('Farm');
};

// Skill Tree Tab
const skillTreeTab = document.createElement('div');
skillTreeTab.id = 'tab-SkillTree';
skillTreeTab.style.display = 'none';
skillTreeTab.style.flexWrap = 'wrap';
skillTreeTab.style.alignItems = 'center';
skillTreeTab.style.gap = '5px';
skillTreeTab.style.padding = '5px';
skillTreeTab.style.justifyContent = 'flex-start';
container.appendChild(skillTreeTab);


const skillTreeButton = document.createElement('div');
skillTreeButton.id = 'skill-tree-btn';
skillTreeButton.textContent = 'Skill Tree';
skillTreeButton.style.width = '100%';
skillTreeButton.style.height = '32px';
skillTreeButton.style.border = '2px solid #0f0';
skillTreeButton.style.color = '#0f0';
skillTreeButton.style.display = 'none';
skillTreeButton.style.alignItems = 'center';
skillTreeButton.style.justifyContent = 'center';
skillTreeButton.style.fontWeight = 'bold';
skillTreeButton.style.cursor = 'pointer';
skillTreeButton.style.userSelect = 'none';
skillTreeButton.style.marginTop = '5px';
skillTreeButton.title = 'Open the Skill Tree';
upgradesTab.appendChild(skillTreeButton);


function renderSkillTree() {
    skillTreeTab.innerHTML = '';
    const visibleCount = getVisibleUpgradeCount(skillTreeUpgrades);

    skillTreeUpgrades.forEach((skill, index) => {
        if (index >= visibleCount) return;

        const box = document.createElement('div');
        box.id = `skill-${skill.id}`;
        box.textContent = skill.id;
        box.style.width = '40px';
        box.style.height = '32px';
        box.style.border = '2px solid #0f0';
        box.style.color = skill.purchased ? '#555' : '#0f0';
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.justifyContent = 'center';
        box.style.fontWeight = 'bold';
        box.style.cursor = 'pointer';
        box.style.userSelect = 'none';
        box.style.marginRight = (index + 1) % 7 === 0 ? '0px' : '5px';
        box.style.marginBottom = '5px';
        box.title = skill.purchased ? `Purchased: ${skill.description}` : `${skill.cost} coins: ${skill.description}`;

        box.addEventListener('click', () => {
            if (skill.purchased) return;
            if (coins >= skill.cost) {
                coins -= skill.cost;
                coins = Math.round(coins);
                localStorage.setItem('klaviaCoins', coins);

                skill.purchased = true;
                localStorage.setItem(`skill${skill.id}Purchased`, true);

                if (window.updateHUD) window.updateHUD();
                if (typeof updateFirebaseCoins === 'function') updateFirebaseCoins();



                renderSkillTree();

            } else {
                alert(`You need ${skill.cost} coins to purchase this skill.`);
            }
        });

        skillTreeTab.appendChild(box);
    });
}

// Skill Tree Button Logic
skillTreeButton.addEventListener('click', () => {
   if (!skillTreeUnlocked) {
    if (coins >= 250000) {
        coins -= 250000;
        coins = Math.round(coins);
        localStorage.setItem('klaviaCoins', coins);

        skillTreeUnlocked = true;
        localStorage.setItem('skillTreeUnlocked', true);

        if (window.updateHUD) window.updateHUD();

        alert("Skill Tree unlocked!");

        checkAchievements();
    } else {
        alert("You need 25,000 coins to unlock the Skill Tree!");
        return;
    }
}


    activeTabName = 'Skill Tree';
    tabNames.forEach(n => {
        tabContents[n].style.display = (n === 'Skill Tree') ? 'flex' : 'none';
        tabButtons[n].style.backgroundColor = n === 'Skill Tree' ? '#0f0' : '#111';
        tabButtons[n].style.color = n === 'Skill Tree' ? '#111' : '#0f0';
    });
    showTabBoxes('Skill Tree');
});

        function getVisibleUpgradeCount(upgradeArray) {
    const purchasedCount = upgradeArray.filter(u => u.purchased).length;
    return Math.min(
        upgradeArray.length,
        (Math.floor(purchasedCount / 5) + 1) * 5
    );
}


function showTabBoxes(tabName) {
    skillTreeButton.style.display = 'none';
    farmButton.style.display = 'none';

    skillTreeTab.style.display = 'none';
    farmTab.style.display = 'none';
    casinoTab.style.display = 'none';

    casinoButton.style.display = 'none';

    if (tabName === 'Home') {
        return;
    }

    if (tabName === 'Upgrades') {
        const visibleCount = getVisibleUpgradeCount(upgrades);

        upgrades.forEach((upg, index) => {
            const box = document.getElementById(`upgrade-${upg.id}`);
            if (!box) return;
            box.style.display = index < visibleCount ? 'flex' : 'none';
        });

        skillTreeButton.style.display = 'flex';
        farmButton.style.display = 'flex';
        return;
    }

    if (tabName === 'Achievements') {
        achievements.forEach(ach => {
            const box = document.getElementById(`achievement-${ach.id}`);
            if (box) box.style.display = 'flex';
        });

        casinoButton.style.display = isCasinoUnlockedByLevel() ? 'flex' : 'none';
        return;
    }

    if (tabName === 'Skill Tree') {
        skillTreeTab.style.display = 'flex';
        renderSkillTree();
        return;
    }

    if (tabName === 'Farm') {
        farmTab.style.display = 'flex';
        return;
    }

    if (tabName === 'Casino') {
  if (!isCasinoUnlockedByLevel()) return;
  casinoTab.style.display = 'flex';
  renderCasino();
  return;
}

}








// Achievements tab
const achievementsTab = tabContents['Achievements'];
achievementsTab.style.display = 'flex';
achievementsTab.style.flexWrap = 'wrap';
achievementsTab.style.gap = '5px';

achievements.forEach((ach, index) => {
    if (document.getElementById(`achievement-${ach.id}`)) return;

    const box = document.createElement('div');
    box.id = `achievement-${ach.id}`;
    box.textContent = ach.id;
    box.style.width = '40px';
    box.style.height = '32px';
    box.style.border = '2px solid #0f0';
    box.style.color = ach.unlocked ? '#0f0' : '#555';
    box.style.display = 'none';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontWeight = 'bold';
    box.style.cursor = 'default';
    box.style.userSelect = 'none';
    box.style.marginRight = (index + 1) % 7 === 0 ? '0px' : '5px';
    box.title = ach.description;

    achievementsTab.appendChild(box);
});

        // Casino Tab
const casinoTab = document.createElement('div');
casinoTab.id = 'tab-Casino';
casinoTab.style.display = 'none';
casinoTab.style.flexWrap = 'wrap';
casinoTab.style.alignItems = 'center';
casinoTab.style.gap = '5px';
casinoTab.style.padding = '5px';
casinoTab.style.justifyContent = 'flex-start';
casinoTab.style.maxHeight = '300px';
casinoTab.style.overflowY = 'auto';
casinoTab.style.overflowX = 'hidden';
container.appendChild(casinoTab);
tabContents['Casino'] = casinoTab;

// Casino Button
const casinoButton = document.createElement('div');
casinoButton.id = 'casino-btn';
casinoButton.textContent = 'Casino';
casinoButton.style.width = '100%';
casinoButton.style.height = '32px';
casinoButton.style.border = '2px solid #0f0';
casinoButton.style.color = '#0f0';
casinoButton.style.display = 'none';
casinoButton.style.alignItems = 'center';
casinoButton.style.justifyContent = 'center';
casinoButton.style.fontWeight = 'bold';
casinoButton.style.cursor = 'pointer';
casinoButton.style.userSelect = 'none';
casinoButton.style.marginTop = '5px';
casinoButton.title = 'Open the Casino';
achievementsTab.appendChild(casinoButton);

       casinoButton.addEventListener('click', () => {
    Object.values(tabContents).forEach(c => c.style.display = 'none');

    casinoTab.style.display = 'flex';
    activeTabName = 'Casino';

    renderCasino();
});




tabNames.forEach(name => {
    tabButtons[name].addEventListener('click', () => {
        activeTabName = name;
        tabNames.forEach(n => {
            tabContents[n].style.display = (n === name) ? (n === 'Home' ? 'block' : 'flex') : 'none';
            tabButtons[n].style.backgroundColor = n === name ? '#0f0' : '#111';
            tabButtons[n].style.color = n === name ? '#111' : '#0f0';
        });
        showTabBoxes(name);
    });
});

function renderCasino() {
    casinoTab.innerHTML = '';

    function createButton(text, onClick, styles = {}) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cursor = 'pointer';
        Object.assign(btn.style, styles);
        btn.addEventListener('click', onClick);
        return btn;
    }

    function createDiv(text = '', styles = {}) {
        const div = document.createElement('div');
        div.textContent = text;
        Object.assign(div.style, styles);
        return div;
    }

    function createTabButton(text, onClick) {
        const btn = createDiv(text, {
            width: '100%',
            height: '32px',
            border: '2px solid #0f0',
            color: '#0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            marginBottom: '10px',
            fontWeight: 'bold'
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    function hideAllAreas() {
    coinflipArea.style.display = 'none';
    hlArea.style.display = 'none';
    slotArea.style.display = 'none';
    blackjackArea.style.display = 'none';
    wheelArea.style.display = 'none';
    minefieldArea.style.display = 'none';
}



// Coinflip
    const COIN_HEADS_IMG =
  'https://www.nicepng.com/png/full/395-3951330_thecoinspot-com-us-washington-head-quarter-dollar-coin.png';

const COIN_TAILS_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/5/5a/98_quarter_reverse.png';

const coinflipTabButton = createTabButton('Coinflip', () => {
    hideAllAreas();
    coinflipArea.style.display = 'flex';
});
casinoTab.appendChild(coinflipTabButton);

const coinflipArea = createDiv('', {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
});
casinoTab.appendChild(coinflipArea);

// Info text
coinflipArea.appendChild(createDiv('Win: +100% your bet (guess correctly)'));

// Coin
const coin = document.createElement('div');
coin.style.cssText = `
  width: 90px;
  height: 90px;
  position: relative;
  transform-style: preserve-3d;
`;
coinflipArea.appendChild(coin);

// HEADS
const coinHeads = document.createElement('div');
coinHeads.style.cssText = `
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-image: url("${COIN_HEADS_IMG}");
  background-size: cover;
  background-position: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;
coin.appendChild(coinHeads);

// TAILS
const coinTails = document.createElement('div');
coinTails.style.cssText = `
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-image: url("${COIN_TAILS_IMG}");
  background-size: cover;
  background-position: center;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;
coin.appendChild(coinTails);



// Bet Input
const betInput = document.createElement('input');
betInput.type = 'number';
betInput.min = '1';
betInput.value = '10';
betInput.style.width = '90px';
betInput.style.textAlign = 'center';
coinflipArea.appendChild(betInput);

// Buttons
const buttonRow = document.createElement('div');
buttonRow.style.display = 'flex';
buttonRow.style.gap = '8px';
coinflipArea.appendChild(buttonRow);

const headsButton = createButton('Heads', () => startCoinflip('heads'));
const tailsButton = createButton('Tails', () => startCoinflip('tails'));

buttonRow.appendChild(headsButton);
buttonRow.appendChild(tailsButton);

// Results
const resultMessage = createDiv('', { marginTop: '6px' });
coinflipArea.appendChild(resultMessage);

let isFlipping = false;
let currentRotation = 0;

// Coinflip Logic
function startCoinflip(playerChoice) {
  if (isFlipping) return;

  const bet = parseInt(betInput.value, 10);
  if (isNaN(bet) || bet <= 0) return alert('Enter a valid bet!');
  if (bet > coins) return alert("You don't have enough coins!");

  isFlipping = true;
  headsButton.disabled = true;
  tailsButton.disabled = true;
  resultMessage.textContent = 'Flipping...';

  const landed = Math.random() < 0.5 ? 'heads' : 'tails';

  const spins = 3 + Math.floor(Math.random() * 4); // 3–6 full spins
  const faceOffset = (landed === 'heads') ? 0 : 180;

  const curMod = ((currentRotation % 360) + 360) % 360;

  const align = (faceOffset - curMod + 360) % 360;

  const durationMs = 1100;
  const finalRotation = currentRotation + spins * 360 + align;

  currentRotation = finalRotation;

  // Animate
  coin.style.transition = `transform ${durationMs}ms cubic-bezier(.2,.8,.2,1)`;
  coin.style.transform = `rotateY(${finalRotation}deg)`;

  setTimeout(() => {
    const win = playerChoice === landed;

    if (win) {
      coins += bet;
      resultMessage.textContent = `It landed ${landed.toUpperCase()} — You won! +${bet} Coins`;
    } else {
      coins -= bet;
      resultMessage.textContent = `It landed ${landed.toUpperCase()} — You lost! -${bet} Coins`;
    }

    localStorage.setItem('klaviaCoins', coins);
    if (userId) updateFirebaseCoins();
    if (window.updateHUD) window.updateHUD();

    isFlipping = false;
    headsButton.disabled = false;
    tailsButton.disabled = false;

    const target = faceOffset;
    coin.style.transition = 'none';
    coin.style.transform = `rotateY(${target}deg)`;
    currentRotation = target;

    requestAnimationFrame(() => {
      coin.style.transition = `transform ${durationMs}ms cubic-bezier(.2,.8,.2,1)`;
    });
  }, durationMs + 20);
}

// Minefield
const minefieldTabButton = createTabButton('Minefield', () => {
  hideAllAreas();
  minefieldArea.style.display = 'flex';
});
casinoTab.appendChild(minefieldTabButton);

const minefieldArea = createDiv('', {
  display: 'none',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  width: '100%'
});
casinoTab.appendChild(minefieldArea);

// Info
minefieldArea.appendChild(
  createDiv('Bomb chance: 50% per tile. Each safe tile: +15% multiplier. Cash out at anytime.', {
    color: '#0f0',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '11px'
  })
);

// Bet input
const mineBetInput = document.createElement('input');
mineBetInput.type = 'number';
mineBetInput.min = '1';
mineBetInput.value = '100';
mineBetInput.style.width = '90px';
mineBetInput.style.textAlign = 'center';
minefieldArea.appendChild(mineBetInput);

// Buttons row
const mineBtnRow = createDiv('', { display: 'flex', gap: '10px', marginTop: '2px' });
minefieldArea.appendChild(mineBtnRow);

const mineStartBtn = createButton('Mine', () => startMinefield(), { padding: '5px 10px' });
const mineCashoutBtn = createButton('Cash Out', () => cashOutMinefield(), { padding: '5px 10px' });
mineBtnRow.appendChild(mineStartBtn);
mineBtnRow.appendChild(mineCashoutBtn);

// Status text
const mineStatus = createDiv('Enter a bet, then press Mine.', { marginTop: '2px', fontSize: '11px' });
minefieldArea.appendChild(mineStatus);

// Grid container
const mineGrid = createDiv('', {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 26px)',
  gridAutoRows: '26px',
  gap: '4px',
  marginTop: '6px',
  padding: '6px',
  border: '2px solid #0f0',
  borderRadius: '6px'
});
minefieldArea.appendChild(mineGrid);


let mineInRound = false;
let mineBet = 0;
let mineSafeClicks = 0;
let mineMultiplier = 1.0;
let mineBombMap = [];
let mineClicked = [];

function mineSetButtons(state) {
  if (state === 'idle') {
    mineStartBtn.disabled = false;
    mineCashoutBtn.disabled = true;
    mineStartBtn.style.opacity = '1';
    mineCashoutBtn.style.opacity = '0.5';
  } else if (state === 'playing') {
    mineStartBtn.disabled = true;
    mineCashoutBtn.disabled = false;
    mineStartBtn.style.opacity = '0.5';
    mineCashoutBtn.style.opacity = '1';
  } else { // done
    mineStartBtn.disabled = false;
    mineCashoutBtn.disabled = true;
    mineStartBtn.style.opacity = '1';
    mineCashoutBtn.style.opacity = '0.5';
  }
}

function mineClearGrid() {
  mineGrid.innerHTML = '';
}

function mineRenderGrid() {
  mineClearGrid();

  for (let i = 0; i < 25; i++) {
    const tile = document.createElement('div');
    tile.style.width = '26px';
    tile.style.height = '26px';
    tile.style.border = '1px solid #0f0';
    tile.style.background = '#111';
    tile.style.cursor = mineInRound ? 'pointer' : 'default';
    tile.style.userSelect = 'none';
    tile.style.boxSizing = 'border-box';

    tile.addEventListener('click', () => mineClickTile(i, tile));
    mineGrid.appendChild(tile);
  }
}

function mineUpdateStatus(extra = '') {
  mineStatus.textContent =
    `Multiplier: ${mineMultiplier.toFixed(2)}x` +
    (mineInRound ? ' | Mine tiles or Cash Out.' : '') +
    (extra ? ` ${extra}` : '');
}

function startMinefield() {
  if (mineInRound) return;

  const bet = parseInt(mineBetInput.value, 10);
  if (!Number.isFinite(bet) || bet <= 0) return alert('Enter a valid bet!');
  if (bet > coins) return alert("You don't have enough coins!");

  mineInRound = true;
  mineBet = bet;
  mineSafeClicks = 0;
  mineMultiplier = 1.0;

  coins -= mineBet;
  localStorage.setItem('klaviaCoins', coins);
  if (window.userId) updateFirebaseCoins?.();
  if (window.updateHUD) window.updateHUD();

  mineBombMap = new Array(25).fill(false).map(() => Math.random() < 0.5);
  mineClicked = new Array(25).fill(false);

  mineSetButtons('playing');
  mineRenderGrid();
  mineUpdateStatus('Good luck!');
}

function mineRevealAll() {
  const tiles = mineGrid.children;
  for (let i = 0; i < 25; i++) {
    const t = tiles[i];
    if (mineBombMap[i]) {
      t.style.background = '#f00';
      t.style.borderColor = '#fff';
    } else if (mineClicked[i]) {
      t.style.background = '#0a0';
    } else {
      t.style.background = '#060';
      t.style.opacity = '0.55';
    }
    t.style.cursor = 'default';
  }
}

function mineEndRound(message) {
  mineInRound = false;
  mineSetButtons('done');
  mineRevealAll();
  mineStatus.textContent = message;
}

function mineClickTile(index, tileEl) {
  if (!mineInRound) return;
  if (mineClicked[index]) return;

  mineClicked[index] = true;

  if (mineBombMap[index]) {
    tileEl.style.background = '#f00';
    tileEl.style.borderColor = '#fff';

    localStorage.setItem('klaviaCoins', coins);
    if (window.userId) updateFirebaseCoins?.();
    if (window.updateHUD) window.updateHUD();

    mineEndRound(`You mined a bomb! You lost -${mineBet} coins.`);
    return;
  }

  // Safe tile
  tileEl.style.background = '#0a0';
  mineSafeClicks += 1;
  mineMultiplier += 0.15;

  mineUpdateStatus('');
}

function cashOutMinefield() {
  if (!mineInRound) return;

  const payout = Math.floor(mineBet * mineMultiplier);

  coins += payout;

  localStorage.setItem('klaviaCoins', coins);
  if (window.userId) updateFirebaseCoins?.();
  if (window.updateHUD) window.updateHUD();

  mineEndRound(`Cashed out! +${payout} coins`);
}

// Init state
mineSetButtons('idle');
mineRenderGrid();




    // Higher/Lower
    const hlTabButton = createTabButton('Higher / Lower', () => {
        hideAllAreas();
        hlArea.style.display = 'flex';
    });
    casinoTab.appendChild(hlTabButton);

    const hlArea = createDiv('', {
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px'
    });
    casinoTab.appendChild(hlArea);

    const hlNumberDisplay = createDiv('Number: ?', { fontWeight: 'bold', fontSize: '16px' });
    hlArea.appendChild(hlNumberDisplay);

    const hlButtonsDiv = createDiv('', { display: 'flex', gap: '10px' });
    hlArea.appendChild(hlButtonsDiv);

    const higherBtn = createButton('Higher', () => processHLGuess('higher'), { padding: '5px 10px' });
    const lowerBtn = createButton('Lower', () => processHLGuess('lower'), { padding: '5px 10px' });
    hlButtonsDiv.appendChild(higherBtn);
    hlButtonsDiv.appendChild(lowerBtn);

    const hlBetInput = document.createElement('input');
    hlBetInput.type = 'number';
    hlBetInput.min = '1';
    hlBetInput.value = '10';
    hlBetInput.style.width = '80px';
    hlArea.appendChild(hlBetInput);

    const hlWinHeader = createDiv('Win: +25% Bet', { color: '#0f0', fontWeight: 'bold', marginTop: '5px' });
    hlArea.appendChild(hlWinHeader);

    const hlResultMessage = createDiv('', { marginTop: '5px' });
    hlArea.appendChild(hlResultMessage);

    let hiddenNumber = parseInt(localStorage.getItem('hlHiddenNumber')) || null;
    let visibleNumber = parseInt(localStorage.getItem('hlVisibleNumber')) || null;

    function startHLGame() {
        if (hiddenNumber === null) hiddenNumber = Math.floor(Math.random() * 100) + 1;
        if (visibleNumber === null) {
            visibleNumber = Math.floor(Math.random() * 100) + 1;
            while (visibleNumber === hiddenNumber) visibleNumber = Math.floor(Math.random() * 100) + 1;
        }
        hlNumberDisplay.textContent = `Number: ${visibleNumber}`;
        hlResultMessage.textContent = '';
        localStorage.setItem('hlHiddenNumber', hiddenNumber);
        localStorage.setItem('hlVisibleNumber', visibleNumber);
    }

    function processHLGuess(guess) {
        let bet = parseInt(hlBetInput.value);
        if (isNaN(bet) || bet <= 0) return alert('Enter a valid bet!');
        if (bet > coins) return alert("You don't have enough coins!");

        const playerWins = (guess === 'higher' && hiddenNumber > visibleNumber) ||
                           (guess === 'lower' && hiddenNumber < visibleNumber);

        if (playerWins) {
            const winAmount = Math.floor(bet * 0.25);
            coins += winAmount;
            hlResultMessage.textContent = `You won! +${winAmount} Coins (Hidden: ${hiddenNumber})`;
        } else {
            coins -= bet;
            hlResultMessage.textContent = `You lost! -${bet} Coins (Hidden: ${hiddenNumber})`;
        }

        localStorage.setItem('klaviaCoins', coins);
        if (userId) {
    updateFirebaseCoins();
}
        if (window.updateHUD) window.updateHUD();

        hiddenNumber = Math.floor(Math.random() * 100) + 1;
        visibleNumber = Math.floor(Math.random() * 100) + 1;
        while (visibleNumber === hiddenNumber) visibleNumber = Math.floor(Math.random() * 100) + 1;

        startHLGame();
    }

    startHLGame();

// Color Wheel
const wheelTabButton = createTabButton('Color Wheel', () => {
    hideAllAreas();
    wheelArea.style.display = 'flex';
});
casinoTab.appendChild(wheelTabButton);

const wheelArea = createDiv('', {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
});
casinoTab.appendChild(wheelArea);

wheelArea.appendChild(createDiv('Red/Black = 1.5x, Green = 5x', { color: '#0f0', fontWeight: 'bold' }));

const wheelWrap = createDiv('', {
    position: 'relative',
    width: '160px',
    height: '160px',
    marginTop: '4px'
});
wheelArea.appendChild(wheelWrap);

// Wheel arrow
const arrow = createDiv('▼', {
    position: 'absolute',
    top: '-18px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 0 6px #000'
});
wheelWrap.appendChild(arrow);

// Wheel
const wheel = createDiv('', {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '2px solid #0f0',
    background: 'conic-gradient(#f00 0% 40%, #000 40% 80%, #0f0 80% 100%)',
    transform: 'rotate(0deg)',
    transition: 'transform 2.2s cubic-bezier(0.2, 0.9, 0.2, 1)'
});
wheelWrap.appendChild(wheel);

// Bet input
const wheelBetInput = document.createElement('input');
wheelBetInput.type = 'number';
wheelBetInput.min = '1';
wheelBetInput.value = '100';
wheelBetInput.style.width = '90px';
wheelArea.appendChild(wheelBetInput);

    let wheelRotation = 0;

function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function getLandedColorFromRotation(rotDeg) {
  const sample = normalizeDeg(-rotDeg);

  if (sample < 144) return 'Red';
  if (sample < 288) return 'Black';
  return 'Green';
}



const wheelBtnsRow = createDiv('', { display: 'flex', gap: '10px', marginTop: '4px' });
wheelArea.appendChild(wheelBtnsRow);

const wheelMsg = createDiv('', { marginTop: '4px', fontSize: '11px' });
wheelArea.appendChild(wheelMsg);

let wheelSpinning = false;

function getWheelBet() {
    const bet = parseInt(wheelBetInput.value, 10);
    if (!Number.isFinite(bet) || bet <= 0) return null;
    return bet;
}

function requireBetOrAlert() {
    const bet = getWheelBet();
    if (bet === null) {
        alert('Enter a valid bet first!');
        return null;
    }
    if (bet > coins) {
        alert("You don't have enough coins!");
        return null;
    }
    return bet;
}

function rollWheelColor() {
    const r = Math.random();
    if (r < 0.40) return 'Red';
    if (r < 0.80) return 'Black';
    return 'Green';
}

function spinToColor(color) {
  const spins = 6 + Math.floor(Math.random() * 4); // 6-9 full spins
  const base = spins * 360;

  let segStart = 0, segEnd = 144;
  if (color === 'Black') { segStart = 144; segEnd = 288; }
  if (color === 'Green') { segStart = 288; segEnd = 360; }

  const inside = segStart + Math.random() * (segEnd - segStart);

  return base - inside;
}



function settleCoins() {
    localStorage.setItem('klaviaCoins', coins);
    if (window.userId && typeof updateFirebaseCoins === 'function') updateFirebaseCoins();
    if (window.updateHUD) window.updateHUD();
}

function makeWheelButton(label, pickColor, styles = {}) {
    const btn = createButton(label, () => {
        if (wheelSpinning) return;

        const bet = requireBetOrAlert();
        if (bet === null) return;

        wheelSpinning = true;
        wheelMsg.textContent = 'Spinning...';

        coins -= bet;
        settleCoins();

        const targetColor = rollWheelColor();

        wheel.style.transition = 'none';
        wheel.offsetHeight;
        wheel.style.transition = 'transform 2.2s cubic-bezier(0.2, 0.9, 0.2, 1)';

        const rot = spinToColor(targetColor);
wheelRotation = rot;
wheel.style.transform = `rotate(${rot}deg)`;

        setTimeout(() => {
  const landed = getLandedColorFromRotation(wheelRotation);

  let win = 0;
  if (pickColor === landed) {
    win = (landed === 'Green') ? bet * 5 : bet * 2;
    coins += bet + win;
    wheelMsg.textContent = `Landed: ${landed}. You WON +${win} coins!`;
  } else {
    wheelMsg.textContent = `Landed: ${landed}. You lost -${bet} coins.`;
  }

  settleCoins();
  wheelSpinning = false;
}, 2300);
    }, Object.assign({ padding: '5px 10px' }, styles));

    return btn;
}

wheelBtnsRow.appendChild(makeWheelButton('Red', 'Red', { background: '#f00', color: '#fff', border: '1px solid #fff' }));
wheelBtnsRow.appendChild(makeWheelButton('Black', 'Black', { background: '#000', color: '#fff', border: '1px solid #fff' }));
wheelBtnsRow.appendChild(makeWheelButton('Green', 'Green', { background: '#0f0', color: '#000', border: '1px solid #fff' }));

wheelMsg.textContent = 'Enter a bet, then pick a color.';


// Blackjack
const blackjackTabButton = createTabButton('Blackjack', () => {
    hideAllAreas();
    blackjackArea.style.display = 'flex';
});
casinoTab.appendChild(blackjackTabButton);

const blackjackArea = createDiv('', {
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
});
casinoTab.appendChild(blackjackArea);

blackjackArea.appendChild(createDiv('Win: 2x your bet', { color: '#0f0', fontWeight: 'bold' }));

const bjBetInput = document.createElement('input');
bjBetInput.type = 'number';
bjBetInput.min = '1';
bjBetInput.value = '100';
bjBetInput.style.width = '80px';
blackjackArea.appendChild(bjBetInput);

const bjStatus = createDiv('', { marginTop: '4px', fontSize: '11px' });
const bjDealerDisplay = createDiv('Dealer: ?', { fontWeight: 'bold', fontSize: '16px' });
const bjPlayerDisplay = createDiv('You: ?', { fontWeight: 'bold', fontSize: '16px' });

blackjackArea.appendChild(bjDealerDisplay);
blackjackArea.appendChild(bjPlayerDisplay);
blackjackArea.appendChild(bjStatus);

const bjButtonsRow = createDiv('', { display: 'flex', gap: '10px', marginTop: '6px' });
blackjackArea.appendChild(bjButtonsRow);

const bjDealBtn = createButton('Deal', () => startBlackjack(), { padding: '5px 10px' });
const bjHitBtn = createButton('Hit', () => hitBlackjack(), { padding: '5px 10px' });
const bjStandBtn = createButton('Stand', () => standBlackjack(), { padding: '5px 10px' });

bjButtonsRow.appendChild(bjDealBtn);
bjButtonsRow.appendChild(bjHitBtn);
bjButtonsRow.appendChild(bjStandBtn);

let bjInRound = false;
let bjBet = 0;
let dealerTotal = 0;
let playerTotal = 0;

function randCardValue() {
    const v = Math.floor(Math.random() * 10) + 2;
    return v;
}

function setBJButtons(state) {
    if (state === 'idle') {
        bjDealBtn.disabled = false;
        bjHitBtn.disabled = true;
        bjStandBtn.disabled = true;
        bjDealBtn.style.opacity = '1';
        bjHitBtn.style.opacity = '0.5';
        bjStandBtn.style.opacity = '0.5';
    } else if (state === 'playing') {
        bjDealBtn.disabled = true;
        bjHitBtn.disabled = false;
        bjStandBtn.disabled = false;
        bjDealBtn.style.opacity = '0.5';
        bjHitBtn.style.opacity = '1';
        bjStandBtn.style.opacity = '1';
    } else {
        bjDealBtn.disabled = false;
        bjHitBtn.disabled = true;
        bjStandBtn.disabled = true;
        bjDealBtn.style.opacity = '1';
        bjHitBtn.style.opacity = '0.5';
        bjStandBtn.style.opacity = '0.5';
    }
}

function updateBJDisplays(showDealer = true) {
    bjPlayerDisplay.textContent = `You: ${playerTotal}`;
    bjDealerDisplay.textContent = showDealer ? `Dealer: ${dealerTotal}` : `Dealer: ?`;
}

function startBlackjack() {
    const bet = parseInt(bjBetInput.value);
    if (isNaN(bet) || bet <= 0) return alert('Enter a valid bet!');
    if (bet > coins) return alert("You don't have enough coins!");

    bjBet = bet;
    bjInRound = true;

    coins -= bjBet;
    localStorage.setItem('klaviaCoins', coins);
    if (window.userId) updateFirebaseCoins?.();
    if (window.updateHUD) window.updateHUD();

    playerTotal = randCardValue() + randCardValue();
    dealerTotal = randCardValue() + randCardValue();

    bjStatus.textContent = 'Round started. Hit or Stand.';
    updateBJDisplays(false);
    setBJButtons('playing');

    if (playerTotal > 21) {
        endBlackjack('bust');
    }
}

function hitBlackjack() {
    if (!bjInRound) return;
    playerTotal += randCardValue();
    updateBJDisplays(false);

    if (playerTotal > 21) {
        endBlackjack('bust');
    }
}

function standBlackjack() {
    if (!bjInRound) return;

    while (dealerTotal < 17) {
        dealerTotal += randCardValue();
    }

    if (dealerTotal > 21) {
        endBlackjack('dealerBust');
    } else if (playerTotal > dealerTotal) {
        endBlackjack('win');
    } else if (playerTotal < dealerTotal) {
        endBlackjack('lose');
    } else {
        endBlackjack('push');
    }
}

function endBlackjack(result) {
    bjInRound = false;

    updateBJDisplays(true);

   if (result === 'win' || result === 'dealerBust') {
    coins += bjBet * 2;
    bjStatus.textContent = `You WIN! +${bjBet * 2} coins!`;

} else if (result === 'push') {
    coins += bjBet; // refund only
    bjStatus.textContent = `Push. Bet returned. (Dealer: ${dealerTotal}, You: ${playerTotal})`;

} else if (result === 'bust') {
    bjStatus.textContent = `You BUST! -${bjBet} coins`;

} else {
    bjStatus.textContent = `You lose. -${bjBet} coins`;
}

localStorage.setItem('klaviaCoins', coins);
if (window.userId) updateFirebaseCoins?.();
if (window.updateHUD) window.updateHUD();


    setBJButtons('done');
}
setBJButtons('idle');


    // Slot Machine
const slotButton = createTabButton('Slot Machine', () => {
    hideAllAreas();
    slotArea.style.display = 'flex';
});
casinoTab.appendChild(slotButton);


    const slotArea = createDiv('', { display: 'none', flexDirection: 'column', alignItems: 'center', gap: '5px' });
    casinoTab.appendChild(slotArea);

    const slotNumbers = createDiv('---', { fontWeight: 'bold', fontSize: '18px' });
    slotArea.appendChild(slotNumbers);

    const slotBetInput = document.createElement('input');
    slotBetInput.type = 'number';
    slotBetInput.min = '1';
    slotBetInput.value = '100';
    slotBetInput.style.width = '80px';
    slotArea.appendChild(slotBetInput);

    const spinButton = createButton('Spin', () => {
        let bet = parseInt(slotBetInput.value);
        if (isNaN(bet) || bet <= 0) return alert('Enter a valid bet!');
        if (bet > coins) return alert("You don't have enough coins!");

        coins -= bet;
        localStorage.setItem('klaviaCoins', coins);

        const reels = [1,2,3].map(() => Math.floor(Math.random() * 7) + 1);
        slotNumbers.textContent = reels.join(' | ');

        let winnings = 0;
        const reelStr = reels.join('');
        if (reelStr === '777' || reelStr === '123') {
            winnings = bet * 15;
            slotResultMessage.textContent = `Special Combo! You won ${winnings} coins!`;
        } else if (reels[0] === reels[1] && reels[1] === reels[2]) {
            winnings = bet * 5;
            slotResultMessage.textContent = `Triples! You won ${winnings} coins!`;
        } else {
            slotResultMessage.textContent = `You lost ${bet} coins.`;
        }

        coins += winnings;
        localStorage.setItem('klaviaCoins', coins);
        if (userId) {
    updateFirebaseCoins();
}
        if (window.updateHUD) window.updateHUD();
    }, { padding: '5px 10px' });
    slotArea.appendChild(spinButton);

    const slotResultMessage = createDiv('', { marginTop: '5px' });
    slotArea.appendChild(slotResultMessage);



    casinoTab.prepend(createDiv('Welcome to the Casino!', { marginBottom: '10px', fontWeight: 'bold' }));

    coinflipTabButton.click();
}





        window.updateHUD();
        document.body.appendChild(hud);

        container.style.display = expanded ? 'flex' : 'none';
hud.style.width = expanded ? '300px' : '40px';
headerElement.textContent = expanded ? 'Klavia Frenzy Clicker 0.1.5.2' : 'KFC';

        kfcHUD = hud;
        syncHUDs();


    }

    function ensureHUDExists() {
    if (!document.getElementById('klavia-hud')) {
        createHUD();
        syncHUDs();
    }
}

    setInterval(ensureHUDExists, 200);


         let kfcHUD = null;
         let prestigeHUD = null;
         let leaderboardHUD = null;

         function syncHUDs() {
  const kfcOpen = kfcHUD && kfcHUD.style.width === '300px';
  const pOpen = prestigeHUD && prestigeHUD.style.width === '300px';
  const leaderboardOpen = !!window.__leaderboardExpanded;

  if (leaderboardHUD) {
    leaderboardHUD.style.display = (kfcOpen || pOpen) ? 'none' : 'flex';
  }

  if (prestigeHUD) {
    prestigeHUD.style.display = kfcOpen ? 'none' : 'flex';
  }

  if (kfcHUD) {
    kfcHUD.style.display = pOpen ? 'none' : 'flex';
  }

  const levelMiniHUD = document.getElementById('leaderboard-level-hud');
  if (levelMiniHUD) {
    const blocked = (kfcOpen || pOpen || leaderboardOpen);
    levelMiniHUD.style.display = blocked ? 'none' : 'flex';
  }
}







function checkPrestigeHUD() {
    if (!prestigeHUD || !document.body.contains(prestigeHUD)) {
        prestigeHUD = null;
    }

    if (!expanded && coins >= 0) {
        if (!prestigeHUD) {
            prestigeHUD = document.createElement('div');
            prestigeHUD.id = 'prestige-hud';
            prestigeHUD.style.position = 'fixed';
            prestigeHUD.style.top = '350px';
            prestigeHUD.style.left = '1px';
            prestigeHUD.style.transform = 'none';
            prestigeHUD.style.backgroundColor = '#111';
            prestigeHUD.style.color = '#0f0';
            prestigeHUD.style.fontFamily = 'Courier New, monospace';
            prestigeHUD.style.zIndex = '9999';
            prestigeHUD.style.border = '2px solid #0f0';
            prestigeHUD.style.width = '40px';
            prestigeHUD.style.cursor = 'pointer';
            prestigeHUD.style.display = 'flex';
            prestigeHUD.style.flexDirection = 'column';
            prestigeHUD.style.alignItems = 'stretch';

            const header = document.createElement('div');
            header.textContent = 'P';
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            header.style.fontSize = '16px';
            header.style.padding = '5px';
            header.style.userSelect = 'none';
            header.style.borderBottom = '2px solid #0f0';
            prestigeHUD.appendChild(header);

            const container = document.createElement('div');
            container.style.display = 'none';
            container.style.flexDirection = 'column';
            prestigeHUD.appendChild(container);

            let prestigeExpanded = false;

header.addEventListener('click', () => {
    prestigeExpanded = !prestigeExpanded;
    container.style.display = prestigeExpanded ? 'flex' : 'none';
    prestigeHUD.style.width = prestigeExpanded ? '300px' : '40px';
    header.textContent = prestigeExpanded ? 'Prestige' : 'P';

    syncHUDs();
});


const prestigeInfo = document.createElement('div');
prestigeInfo.style.padding = '6px';
prestigeInfo.style.fontSize = '12px';
prestigeInfo.style.textAlign = 'center';
prestigeInfo.style.color = '#ff0';
prestigeInfo.textContent = 'Click below to check prestige cost.';
container.appendChild(prestigeInfo);

// Prestige button
const prestigeBtn = document.createElement('div');
prestigeBtn.textContent = 'Prestige';
prestigeBtn.style.width = '100%';
prestigeBtn.style.height = '32px';
prestigeBtn.style.border = '2px solid #ff0';
prestigeBtn.style.color = '#ff0';
prestigeBtn.style.display = 'flex';
prestigeBtn.style.alignItems = 'center';
prestigeBtn.style.justifyContent = 'center';
prestigeBtn.style.fontWeight = 'bold';
prestigeBtn.style.cursor = 'pointer';
prestigeBtn.style.userSelect = 'none';
prestigeBtn.style.marginTop = '5px';
container.appendChild(prestigeBtn);

const pHudContainer = document.createElement('div');
pHudContainer.style.display = 'flex';
pHudContainer.style.flexWrap = 'wrap';
pHudContainer.style.marginTop = '5px';
container.appendChild(pHudContainer);

prestigeUpgrades.forEach((upg, index) => {
    upg.purchased = JSON.parse(localStorage.getItem(`prestigeUpgrade${upg.id}Purchased`)) || false;

    const box = document.createElement('div');
    box.id = `prestige-upgrade-${upg.id}`;
    box.textContent = upg.id;
    box.style.width = '40px';
    box.style.height = '32px';
    box.style.border = '2px solid #ff0';
    box.style.color = upg.purchased ? '#555' : '#ff0';

    if (index < 5) {
        box.style.display = 'flex';
    } else {
        const prevRowEndIndex = (Math.floor(index / 5) * 5) - 1;
        const prevRowComplete = prestigeUpgrades[prevRowEndIndex]?.purchased;
        box.style.display = prevRowComplete ? 'flex' : 'none';
    }

    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    box.style.fontWeight = 'bold';
    box.style.cursor = 'pointer';
    box.style.userSelect = 'none';

    box.style.marginRight = (index + 1) % 5 === 0 ? '0px' : '5px';
    box.style.marginBottom = '5px';

    box.title = upg.purchased ? `Purchased: ${upg.description}` : `${upg.cost} PP: ${upg.description}`;

    box.addEventListener('click', () => {
        if (upg.purchased) return;
        if (prestigePoints >= upg.cost) {
            prestigePoints -= upg.cost;
            localStorage.setItem('prestigePoints', prestigePoints);
            upg.purchased = true;
            localStorage.setItem(`prestigeUpgrade${upg.id}Purchased`, true);
            box.style.color = '#555';
            box.title = `Purchased: ${upg.description}`;

            if (window.updateHUD) window.updateHUD();
            if (typeof updateFirebasePrestige === 'function') updateFirebasePrestige();

            if ((index + 1) % 5 === 0) {
                const startOfNextRow = index + 1;
                const endOfNextRow = startOfNextRow + 5;
                for (let i = startOfNextRow; i < Math.min(endOfNextRow, prestigeUpgrades.length); i++) {
                    const nextBox = document.getElementById(`prestige-upgrade-${prestigeUpgrades[i].id}`);
                    if (nextBox) nextBox.style.display = 'flex';
                }
            }
        }
    });

    pHudContainer.appendChild(box);
});

pHudContainer.style.width = '230px';
pHudContainer.style.display = 'flex';
pHudContainer.style.flexWrap = 'wrap';

let prestigeCount = parseInt(localStorage.getItem('prestigeCount')) || 0;

function getPrestigeCost() {
    const baseCost = 1000000;
    return Math.floor(baseCost * Math.pow(1.5, prestigeCount));
}

            function runPrestigeResetKeepOnePet(keptPets) {
  let kept = [];
  if (Array.isArray(keptPets)) kept = keptPets.filter(Boolean);
  else if (keptPets) kept = [keptPets];

  const cost = getPrestigeCost();
  if ((coins || 0) < cost) {
    alert(`Not enough coins to Prestige.\nNeed: ${f(cost)}\nYou have: ${f(coins || 0)}`);
    return false;
  }

  let ppMult = 1;
  try {
    (prestigeUpgrades || []).forEach(u => {
      const purchased = !!u.purchased || JSON.parse(localStorage.getItem(`prestigeUpgrade${u.id}Purchased`) || "false");
      if (purchased && u.type === "prestigePoints") ppMult *= (u.value || 1);
    });
  } catch (e) {}

  const ppGained = Math.max(1, Math.round(1 * ppMult));

  prestigeCount = (parseInt(localStorage.getItem("prestigeCount"), 10) || prestigeCount || 0) + 1;
  prestigePoints = (parseInt(localStorage.getItem("prestigePoints"), 10) || prestigePoints || 0) + ppGained;

  localStorage.setItem("prestigeCount", String(prestigeCount));
  localStorage.setItem("prestigePoints", String(prestigePoints));

  coins = 0;
  sessionRaces = 0;
  starBits = 0;

  localStorage.setItem("klaviaCoins", "0");
  localStorage.setItem("sessionRaces", "0");
  localStorage.setItem("starBits", "0");

  localStorage.setItem("unlockedChickenIndex", "0");
  localStorage.setItem("selectedChickenIndex", "0");
  localStorage.removeItem("pendingChickenUnlock");

  try {
    (upgrades || []).forEach(upg => {
      upg.purchased = false;
      localStorage.removeItem(`upgrade${upg.id}Purchased`);
      const box = document.getElementById(`upgrade-${upg.id}`);
      if (box) {
        box.style.color = "#0f0";
        box.title = `${upg.cost} coins: ${upg.description}`;
      }
    });

    (skillTreeUpgrades || []).forEach(skill => {
      skill.purchased = false;
      localStorage.removeItem(`skill${skill.id}Purchased`);
      const box = document.getElementById(`skill-${skill.id}`);
      if (box) {
        box.style.color = "#0f0";
        box.title = `${skill.cost} coins: ${skill.description}`;
      }
    });

    localStorage.removeItem("skillTreeUnlocked");
    skillTreeUnlocked = false;
  } catch (e) {}

  try {
    localStorage.setItem("ownedPets", JSON.stringify(kept));

    localStorage.setItem("equippedPets", JSON.stringify([]));
  } catch (e) {}

  try { if (typeof updateFirebasePrestige === "function") updateFirebasePrestige(); } catch(e) {}
  try { if (typeof updateFirebaseCoins === "function") updateFirebaseCoins(); } catch(e) {}
  try { if (typeof updateFirebasePets === "function") updateFirebasePets(); } catch(e) {}

  try { if (typeof window.refreshChickenUI === "function") window.refreshChickenUI(); } catch(e) {}
  try { if (typeof window.refreshPetsUI === "function") window.refreshPetsUI(); } catch(e) {}
  try { if (typeof refreshLevelMiniHUD === "function") refreshLevelMiniHUD(); } catch(e) {}
  try { if (window.updateHUD) window.updateHUD(); } catch(e) {}

  alert(`Prestiged! +${ppGained} Prestige Point${ppGained === 1 ? "" : "s"}`);
  return true;
}


let prestigePetOverlay = null;

function getPrestigePetKeepCount() {
  return Math.min(5, parseInt(localStorage.getItem('prestigeKeepPets'), 10) || 1);
}
function setPrestigePetKeepCount(val) {
  localStorage.setItem('prestigeKeepPets', String(Math.min(5, Math.max(1, val))));
}

function ensurePrestigePetOverlay() {
  const old = document.getElementById('prestige-pet-overlay');
  if (old) old.remove();
  prestigePetOverlay = null;

  prestigePetOverlay = document.createElement('div');
  prestigePetOverlay.id = 'prestige-pet-overlay';
  prestigePetOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: none;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.75);
    font-family: Arial, sans-serif;
  `;

  const panel = document.createElement('div');
  panel.style.cssText = `
    width: 520px;
    max-width: calc(100vw - 24px);
    background: #0b0b0b;
    border: 2px solid #0f0;
    border-radius: 10px;
    box-shadow: 0 10px 35px rgba(0,0,0,0.6);
    padding: 10px;
    color: #0f0;
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin-bottom: 8px;
  `;

  const title = document.createElement('div');
  title.id = 'prestige-pet-title';
  title.style.cssText = `font-weight:700; font-size:14px; color:#ff0;`;

  const close = document.createElement('button');
  close.textContent = 'X';
  close.style.cssText = `
    background:#111; color:#0f0; border:1px solid #0f0;
    width: 28px; height: 28px; border-radius: 6px; cursor:pointer;
  `;
  close.onclick = () => (prestigePetOverlay.style.display = 'none');

  header.appendChild(title);
  header.appendChild(close);

  const sub = document.createElement('div');
  sub.id = 'prestige-pet-sub';
  sub.style.cssText = `font-size: 12px; color:#ccc; margin-bottom: 10px;`;

  const list = document.createElement('div');
  list.id = 'prestige-pet-list';
  list.style.cssText = `
    max-height: 340px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
  `;

  const confirmBtn = document.createElement('button');
  confirmBtn.id = 'prestige-pet-confirm';
  confirmBtn.textContent = 'Prestige with Selected Pets';
  confirmBtn.style.cssText = `
    margin-top: 10px;
    padding: 8px;
    width: 100%;
    background: #0f0;
    color: #000;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    opacity: 0.5;
  `;
  confirmBtn.disabled = true;

  const upgradeWrap = document.createElement('div');
  upgradeWrap.style.cssText = `
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #333;
    text-align: center;
  `;

  const upgradeBtn = document.createElement('button');
  upgradeBtn.id = 'prestige-pet-upgrade';
  upgradeBtn.style.cssText = `
    width: 100%;
    padding: 6px;
    background: #0f0;
    color: #000;
    font-weight: 700;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  `;

  const upgradeCostText = document.createElement('div');
  upgradeCostText.style.cssText = `font-size: 11px; color: #aaa; margin-top: 4px;`;

  function refreshPrestigeUpgradeUI() {
    const count = getPrestigePetKeepCount(); // 1..5
    const costs = [1, 2, 3, 4];
    upgradeBtn.textContent = `Bring More Pets (${count}/5)`;

    if (count >= 5) {
      upgradeCostText.textContent = 'MAXED';
      upgradeBtn.disabled = true;
      upgradeBtn.style.opacity = 0.5;
    } else {
      upgradeCostText.textContent = `Cost: ${costs[count - 1]} Prestige Points`;
      upgradeBtn.disabled = false;
      upgradeBtn.style.opacity = 1;
    }
  }

  upgradeBtn.onclick = () => {
    let points = parseFloat(localStorage.getItem('prestigePoints')) || 0;
    const count = getPrestigePetKeepCount();
    const costs = [1, 2, 3, 4];

    if (count >= 5) return;

    const cost = costs[count - 1];
    if (points < cost) return alert('Not enough Prestige Points');

    points -= cost;
    localStorage.setItem('prestigePoints', points);
    setPrestigePetKeepCount(count + 1);

    refreshPrestigeUpgradeUI();
    if (window.updateHUD) window.updateHUD();
  };

  refreshPrestigeUpgradeUI();
  upgradeWrap.appendChild(upgradeBtn);
  upgradeWrap.appendChild(upgradeCostText);

  panel.appendChild(header);
  panel.appendChild(sub);
  panel.appendChild(list);
  panel.appendChild(confirmBtn);
  panel.appendChild(upgradeWrap);

  prestigePetOverlay.appendChild(panel);
  document.body.appendChild(prestigePetOverlay);

  return prestigePetOverlay;
}

function groupOwnedPetsForPrestige(ownedPets) {
  const map = new Map();
  for (const p of ownedPets) {
    if (!p || !p.name) continue;
    const lvl = Math.max(1, parseInt(p.level, 10) || 1);
    const key = `${p.name}|L${lvl}`;
    if (!map.has(key)) map.set(key, { key, name: p.name, level: lvl, sample: p, count: 0 });
    map.get(key).count += 1;
  }
  return Array.from(map.values());
}

function openPrestigePetPickerThenPrestige() {
  const ownedPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');

  // no pets: prestige normally (keep none)
  if (!ownedPets.length) {
    return runPrestigeResetKeepOnePet(null);
  }

  const overlay = ensurePrestigePetOverlay();
  const list = overlay.querySelector('#prestige-pet-list');
  const title = overlay.querySelector('#prestige-pet-title');
  const sub = overlay.querySelector('#prestige-pet-sub');
  const confirmBtn = overlay.querySelector('#prestige-pet-confirm');

  list.innerHTML = '';

  const maxKeep = getPrestigePetKeepCount(); // 1..5
  const selected = new Set(); // keys: "Name|L#"

  function refreshHeaderAndConfirm() {
    title.textContent = `Choose up to ${maxKeep} pet${maxKeep === 1 ? '' : 's'} to bring into Prestige`;
    sub.textContent = `Select ${selected.size}/${maxKeep}. Then click "Prestige with Selected Pets".`;
    confirmBtn.disabled = selected.size === 0;
    confirmBtn.style.opacity = selected.size === 0 ? 0.5 : 1;
  }

  confirmBtn.onclick = () => {
  if (!selected.size) return;

  const owned = JSON.parse(localStorage.getItem('ownedPets') || '[]');
  const kept = [];

  for (const key of selected) {
    const [name, lvlStr] = key.split('|L');
    const lvl = parseInt(lvlStr, 10);
    const found = owned.find(p => p?.name === name && (Math.max(1, parseInt(p.level, 10) || 1) === lvl));
    if (found) kept.push(found);
  }

  const ok = runPrestigeResetKeepOnePet(kept);
  if (ok) overlay.style.display = 'none';
};


  const grouped = groupOwnedPetsForPrestige(ownedPets);

  grouped.forEach(entry => {
    const p = entry.sample || {};
    const rarity = (p.rarity || "Unknown");
    const mult = (p.multiplier ?? 0);
    const lvl = entry.level;
    const key = entry.key;

    const row = document.createElement('div');
    row.style.cssText = `
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      padding: 8px 10px;
      background:#111;
      border: 1px solid #333;
      border-radius: 8px;
      cursor:pointer;
      user-select:none;
    `;

    const left = document.createElement('div');
    left.style.cssText = `display:flex; flex-direction:column; gap:2px;`;

    const nameLine = document.createElement('div');
    nameLine.style.cssText = `font-weight:700; color:#ff0; font-size: 13px;`;
    nameLine.textContent = `${entry.name} (Lv ${lvl})`;

    const meta = document.createElement('div');
    meta.style.cssText = `font-size: 11px; color:#bbb;`;
    meta.textContent = `${rarity} • +${Number(mult).toFixed(1)}% • owned x${entry.count}`;

    left.appendChild(nameLine);
    left.appendChild(meta);

    const right = document.createElement('div');
    right.style.cssText = `font-size: 11px; color:#0f0; white-space:nowrap;`;
    right.textContent = 'Click to select';

    row.appendChild(left);
    row.appendChild(right);

    function paintSelected(isSel) {
      row.style.border = isSel ? '1px solid #0f0' : '1px solid #333';
      row.style.boxShadow = isSel ? '0 0 0 1px rgba(0,255,0,0.35) inset' : 'none';
      right.textContent = isSel ? 'Selected' : 'Click to select';
    }

    row.onclick = () => {
      if (selected.has(key)) {
        selected.delete(key);
        paintSelected(false);
      } else {
        if (selected.size >= maxKeep) {
          alert(`You can only bring ${maxKeep} pet${maxKeep === 1 ? '' : 's'} right now.`);
          return;
        }
        selected.add(key);
        paintSelected(true);
      }
      refreshHeaderAndConfirm();
    };

    list.appendChild(row);
  });

  refreshHeaderAndConfirm();
  overlay.style.display = 'flex';
}

prestigeBtn.addEventListener('click', () => {
  openPrestigePetPickerThenPrestige();
});








            let expanded = false;
            header.addEventListener('click', () => {
                expanded = !expanded;
                container.style.display = expanded ? 'flex' : 'none';
                prestigeHUD.style.width = expanded ? '300px' : '40px';
                header.textContent = expanded ? 'Prestige' : 'P';
            });

            document.body.appendChild(prestigeHUD);
        }
        prestigeHUD.style.display = 'flex';
    } else if (prestigeHUD) {
        prestigeHUD.style.display = 'none';
    }
}

         setInterval(() => {
    checkPrestigeHUD();
}, 500);

         function checkLeaderboardHUD() {
    if (!leaderboardHUD || !document.body.contains(leaderboardHUD)) {
        leaderboardHUD = null;
    }

    if (!leaderboardHUD) {
        leaderboardHUD = document.createElement('div');
        leaderboardHUD.id = 'leaderboard-hud';
        window.__leaderboardExpanded = false;
        leaderboardHUD.style.position = 'fixed';
        leaderboardHUD.style.top = '400px';
        leaderboardHUD.style.left = '1px';
        leaderboardHUD.style.backgroundColor = '#111';
        leaderboardHUD.style.color = '#0f0';
        leaderboardHUD.style.fontFamily = 'Courier New, monospace';
        leaderboardHUD.style.zIndex = '500';
        leaderboardHUD.style.border = '2px solid #0f0';
        leaderboardHUD.style.width = '40px';
        leaderboardHUD.style.cursor = 'pointer';
        leaderboardHUD.style.display = 'flex';
        leaderboardHUD.style.flexDirection = 'column';
        leaderboardHUD.style.alignItems = 'stretch';

        const header = document.createElement('div');
        header.textContent = 'L';
        header.style.fontWeight = 'bold';
        header.style.textAlign = 'center';
        header.style.fontSize = '16px';
        header.style.padding = '5px';
        header.style.userSelect = 'none';
        header.style.borderBottom = '2px solid #0f0';
        leaderboardHUD.appendChild(header);


let levelMiniHUD = document.getElementById('leaderboard-level-hud');


if (levelMiniHUD && !document.body.contains(levelMiniHUD)) {
  levelMiniHUD = null;
}

if (!levelMiniHUD) {
  levelMiniHUD = document.createElement('div');
  levelMiniHUD.id = 'leaderboard-level-hud';
  levelMiniHUD.style.cssText = `
  position: fixed;
  left: 1px;
  top: 0px;
  background: #111;
  color: #0f0;
  border: 2px solid #0f0;
  font-family: Courier New, monospace;
  z-index: 500;
  padding: 4px 6px;
  font-size: 10px;
  user-select: none;
  line-height: 1.15;
  opacity: 0.95;

  width: max-content;
  max-width: none;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;


  const line1 = document.createElement('div');
  line1.id = 'leaderboard-level-line1';
  const line2 = document.createElement('div');
  line2.id = 'leaderboard-level-line2';

  levelMiniHUD.appendChild(line1);
  levelMiniHUD.appendChild(line2);

  document.body.appendChild(levelMiniHUD);

    levelMiniHUD.style.display = 'none';
}







window.refreshLevelMiniHUD = function () {
  const racesNow = parseInt(localStorage.getItem('totalRaces'), 10) || 0;

  const info = getLevelInfoFromRaces(racesNow);
  const line1 = document.getElementById('leaderboard-level-line1');
  const line2 = document.getElementById('leaderboard-level-line2');

  if (!line1 || !line2) return;

  if (info.racesToNext === null) {
    line1.textContent = `Level ${info.level}`;
    line2.textContent = `(MAX)`;
  } else {
    line1.textContent = `Level ${info.level}`;
    line2.textContent = `Next level: ${info.racesToNext} races`;
  }

  const hud = document.getElementById('leaderboard-level-hud');
  if (!hud) return;

  const existing = hud.querySelectorAll('.leaderboard-level-reward-line');

  const rewards = [];
  if (info.nextReward) {
    String(info.nextReward)
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(r => rewards.push(`Reward: ${r}`));
  }

  existing.forEach((el, i) => {
    if (i >= rewards.length) el.remove();
  });

  rewards.forEach((text, i) => {
    let el = existing[i];
    if (!el) {
      el = document.createElement('div');
      el.className = 'leaderboard-level-reward-line';
      el.style.marginTop = '2px';
      hud.appendChild(el);
    }
    el.textContent = text;
  });
};




refreshLevelMiniHUD();








        const container = document.createElement('div');
        container.style.display = 'none';
        container.style.flexDirection = 'column';
        leaderboardHUD.appendChild(container);

        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'flex';
        tabsContainer.style.borderBottom = '2px solid #0f0';
        container.appendChild(tabsContainer);

        const tabsConfig = [
            { name: 'Coins', key: 'coins' },
            { name: 'Races', key: 'totalRaces' },
            { name: 'Pets', key: 'totalPets' },
            { name: 'Prestige', key: 'prestigeCount' }
        ];

        const tabButtons = {};
        const tabContents = {};
        const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];

        tabsConfig.forEach((tab, index) => {
            const btn = document.createElement('div');
            btn.textContent = tab.name;
            btn.style.flex = '1';
            btn.style.textAlign = 'center';
            btn.style.padding = '5px';
            btn.style.cursor = 'pointer';
            btn.style.userSelect = 'none';
            btn.style.borderRight = (index === tabsConfig.length - 1) ? 'none' : '1px solid #0f0';
            btn.style.backgroundColor = '#111';
            btn.style.color = '#0f0';
            btn.style.fontSize = '12px';
            tabButtons[tab.name] = btn;
            tabsContainer.appendChild(btn);

            const content = document.createElement('div');
            content.style.display = 'none';
            content.style.flexDirection = 'column';
            content.style.padding = '5px';
            content.style.gap = '4px';
            tabContents[tab.name] = content;
            container.appendChild(content);

            btn.addEventListener('click', () => {
                tabsConfig.forEach(t => {
                    tabContents[t.name].style.display = (t.name === tab.name) ? 'flex' : 'none';
                    tabButtons[t.name].style.backgroundColor = (t.name === tab.name) ? '#0f0' : '#111';
                    tabButtons[t.name].style.color = (t.name === tab.name) ? '#111' : '#0f0';
                });
            });
        });

        function createLeaderboardEntry(player, index, value, listElement) {
            const entry = document.createElement('div');
            entry.style.display = 'flex';
            entry.style.fontSize = '12px';

            database.ref('userRoles/' + player.id).on('value', (roleSnap) => {
                const roleName = roleSnap.val();
                const role = window.rolesConfig[roleName] || { tag: '', tagColor: '', nameColor: '#0f0' };
                const isRGB = Object.values(window.rolesConfig).find(r => r.tag === role.tag)?.isRGB;

                let finalNameColor = (player.id === 'guappanese' && !roleName) ? '#f00' : role.nameColor;

                if (isRGB) {
                    const fullText = `${index + 1}. ${role.tag ? role.tag + ' ' : ''}${player.id}: ${value}`;
                    entry.innerHTML = fullText.split('').map((char, i) => {
                        const color = rainbowColors[i % rainbowColors.length];
                        return `<span style="color:${color}; font-weight:bold; text-shadow:0 0 5px ${color};">${char}</span>`;
                    }).join('');
                } else {
                    const tagGlow = role.tag ? `text-shadow:0 0 5px ${role.tagColor};` : '';
                    entry.innerHTML = `
                        <span style="color:${finalNameColor}; font-weight:bold;">${index + 1}. </span>
                        ${role.tag ? `<span style="color:${role.tagColor}; font-weight:bold; ${tagGlow}">${role.tag} </span>` : ''}
                        <span style="color:${finalNameColor}; font-weight:bold; text-shadow:0 0 5px ${finalNameColor};">${player.id}:</span>
                        <span>&nbsp;</span>
                        <span style="color:#0f0;">${value}</span>`;
                }
            });
            listElement.appendChild(entry);
        }

tabsConfig.forEach(tab => {
    const listDiv = document.createElement('div');
    tabContents[tab.name].appendChild(listDiv);

    database.ref('leaderboard')
        .orderByChild(tab.key)
        .limitToLast(10)
        .on('value', snapshot => {
            if (tabContents[tab.name].style.display === 'none') return;

            listDiv.innerHTML = '';
            const data = snapshot.val();
            if (!data) return;

            const sorted = Object.entries(data)
                .map(([id, info]) => ({ id, val: info[tab.key] || 0 }))
                .sort((a, b) => b.val - a.val);

            sorted.forEach((p, i) => createLeaderboardEntry(p, i, p.val, listDiv));
        });

    tabButtons[tab.name].addEventListener('click', () => {
        database.ref('leaderboard').orderByChild(tab.key).limitToLast(10).once('value', snapshot => {
             listDiv.innerHTML = '';
             const data = snapshot.val();
             if (!data) return;
             const sorted = Object.entries(data)
                .map(([id, info]) => ({ id, val: info[tab.key] || 0 }))
                .sort((a, b) => b.val - a.val);
             sorted.forEach((p, i) => createLeaderboardEntry(p, i, p.val, listDiv));
        });
    });
});

        let expanded = false;
header.addEventListener('click', () => {
    expanded = !expanded;
    window.__leaderboardExpanded = expanded;
    container.style.display = expanded ? 'flex' : 'none';
    leaderboardHUD.style.width = expanded ? '320px' : '40px';
    header.textContent = expanded ? 'Leaderboard' : 'L';

    syncHUDs();

    if (expanded) {
        let storedId = localStorage.getItem('kfcUserId');

        if (!storedId || storedId === 'null') {
            const userId = prompt("Enter a username");

            if (userId && userId.trim() !== "") {
                const baseId = userId.trim();

                getUniqueUsername(baseId, (uniqueId) => {
                    localStorage.setItem('kfcUserId', uniqueId);
                    onUserReady(uniqueId);

                    if (uniqueId !== baseId) {
                        console.log(`Username taken, assigned: ${uniqueId}`);
                    }
                });

            } else {
                expanded = false;
                container.style.display = 'none';
                leaderboardHUD.style.width = '40px';
                header.textContent = 'L';
                alert("A UserID is required to view the leaderboard.");
            }
        } else {
            onUserReady(storedId);
        }
    }
});



        tabButtons['Coins'].click();
        document.body.appendChild(leaderboardHUD);
    }
}

setInterval(() => {
    checkLeaderboardHUD();
}, 500);


// Level HUD
(function () {
  function ensureLevelHUD() {
    let mini = document.getElementById('leaderboard-level-hud');

    if (!mini) {
      mini = document.createElement('div');
      mini.id = 'leaderboard-level-hud';
      mini.style.cssText = `
        position: fixed;
        left: 1px;
        top: 460px; /* adjust if needed */
        background: #111;
        color: #0f0;
        border: 2px solid #0f0;
        font-family: Courier New, monospace;
        z-index: 500;
        padding: 4px 6px;
        font-size: 10px;
        user-select: none;
        line-height: 1.15;
        opacity: 0.95;
        width: max-content;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      `;

      const line1 = document.createElement('div');
      line1.id = 'leaderboard-level-line1';

      const line2 = document.createElement('div');
      line2.id = 'leaderboard-level-line2';

      const line3 = document.createElement('div');
      line3.id = 'leaderboard-level-line3';

      mini.appendChild(line1);
      mini.appendChild(line2);
      mini.appendChild(line3);

      document.body.appendChild(mini);
    }

    const line1 = document.getElementById('leaderboard-level-line1');
    const line2 = document.getElementById('leaderboard-level-line2');
    const line3 = document.getElementById('leaderboard-level-line3');
    if (!line1 || !line2 || !line3) return;

    if (typeof syncHUDs === 'function') syncHUDs();

    if (mini.style.display !== 'none') {
      const races = parseInt(localStorage.getItem('totalRaces'), 10) || 0;
      const info = getLevelInfoFromRaces(races);

      line1.textContent = `Level ${info.level}`;
      line2.textContent = (info.racesToNext === null)
        ? '(MAX)'
        : `Next level: ${info.racesToNext} races`;
    }
  }

  ensureLevelHUD();

  if (!window.__kfcLevelHudPersist) {
    window.__kfcLevelHudPersist = true;

    const _pushState = history.pushState;
    history.pushState = function () {
      const r = _pushState.apply(this, arguments);
      setTimeout(ensureLevelHUD, 0);
      return r;
    };

    const _replaceState = history.replaceState;
    history.replaceState = function () {
      const r = _replaceState.apply(this, arguments);
      setTimeout(ensureLevelHUD, 0);
      return r;
    };

    window.addEventListener('popstate', () => setTimeout(ensureLevelHUD, 0));
    window.addEventListener('hashchange', () => setTimeout(ensureLevelHUD, 0));

    setInterval(ensureLevelHUD, 300);
  }
})();



let racesHUD = null;
let racesContent = null;

function checkRacesHUD() {
    if (!racesHUD || !document.body.contains(racesHUD)) {
        racesHUD = null;
    }

    if (!racesHUD) {
        let isCollapsed = localStorage.getItem('racesHUD_isCollapsed') === 'true';

        racesHUD = document.createElement('div');
        racesHUD.id = 'recent-races-hud';
        racesHUD.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            width: 250px;
            background-color: rgba(0, 0, 0, 0.8);
            border: 1px solid #0f0;
            padding: 10px;
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 10000;
        `;

        const header = document.createElement('div');
        header.id = 'races-header';
        header.style.cssText = `
            text-align: center;
            border-bottom: 1px solid #0f0;
            margin-bottom: 5px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            padding-bottom: 2px;
        `;

        header.innerHTML = `RECENT RACES <span id="races-toggle-icon">${isCollapsed ? '[+]' : '[-]'}</span>`;

        const content = document.createElement('div');
        content.id = 'races-content';

        content.style.display = isCollapsed ? 'none' : 'block';
        header.style.marginBottom = isCollapsed ? '0px' : '5px';
        header.style.borderBottom = isCollapsed ? 'none' : '1px solid #0f0';

        racesHUD.appendChild(header);
        racesHUD.appendChild(content);
        document.body.appendChild(racesHUD);

        racesContent = content;

        header.addEventListener('click', () => {
            isCollapsed = !isCollapsed;

            localStorage.setItem('racesHUD_isCollapsed', isCollapsed);

            content.style.display = isCollapsed ? 'none' : 'block';

            const icon = document.getElementById('races-toggle-icon');
            icon.textContent = isCollapsed ? '[+]' : '[-]';

            header.style.marginBottom = isCollapsed ? '0px' : '5px';
            header.style.borderBottom = isCollapsed ? 'none' : '1px solid #0f0';
        });

        setupRacesListener();
    }
}

function setupRacesListener() {
    if (!window.database || !racesContent) return;

    database.ref('recentRaces').off('value');

    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];

    database.ref('recentRaces')
        .orderByChild('timestamp')
        .limitToLast(1000)
        .on('value', (snapshot) => {
            if (!racesContent) return;

            const data = snapshot.val();
            racesContent.innerHTML = '';

            if (!data) {
                racesContent.innerHTML = '<div style="color:#555;text-align:center;">No races yet</div>';
                return;
            }

            const sortedRaces = Object.values(data)
                .filter(r => r && r.user && r.timestamp)
                .sort((a, b) => b.timestamp - a.timestamp);

            const latestPerUser = [];
            const seenUsers = new Set();

            for (const race of sortedRaces) {
                if (!seenUsers.has(race.user)) {
                    seenUsers.add(race.user);
                    latestPerUser.push(race);
                }
                if (latestPerUser.length >= 10) break;
            }

            latestPerUser.forEach(race => {
                const raceDiv = document.createElement('div');
                raceDiv.style.cssText = `
                    margin-bottom: 4px;
                    border-bottom: 1px solid #222;
                    padding-bottom: 2px;
                `;

                const nameSpan = document.createElement('span');

                getRoleStyles(race.user, (tag, tagColor, nameColor) => {
                    const roleEntry = Object.values(window.rolesConfig || {}).find(r => r.tag === tag);

                    if ((roleEntry && roleEntry.isRGB) || tag === '[RGB]') {
                        nameSpan.innerHTML = '';
                        race.user.split('').forEach((char, i) => {
                            const charSpan = document.createElement('span');
                            const color = rainbowColors[i % rainbowColors.length];
                            charSpan.textContent = char;
                            charSpan.style.cssText = `
                                color: ${color};
                                font-weight: bold;
                                text-shadow: 0 0 5px ${color};
                            `;
                            nameSpan.appendChild(charSpan);
                        });
                    } else {
                        nameSpan.textContent = race.user;
                        nameSpan.style.fontWeight = 'bold';
                        nameSpan.style.color = race.user === 'guappanese' ? '#f00' : (nameColor || '#0f0');
                    }
                });

                const timeSpan = document.createElement('span');
                const timeText = timeAgo(race.timestamp);
                timeSpan.textContent = ` : ${timeText}`;
                timeSpan.style.color = '#888';
                timeSpan.style.marginLeft = '4px';

                raceDiv.appendChild(nameSpan);
                raceDiv.appendChild(timeSpan);
                racesContent.appendChild(raceDiv);
            });
        });
}



function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
    return 'long ago';
}


setInterval(checkRacesHUD, 1000);

        let storeHUD = null;


function checkStoreHUD() {
    if (storeHUD && !document.body.contains(storeHUD)) {
        storeHUD = null;
    }

    if (!storeHUD) {
        storeHUD = document.createElement('div');
        storeHUD.id = 'store-hud';
        storeHUD.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            background-color: #111;
            color: #0f0;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            border: 2px solid #0f0;
            width: 40px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: stretch;
        `;

        const header = document.createElement('div');
        header.textContent = 'S';
        header.style.cssText = `
            font-weight: bold;
            text-align: center;
            font-size: 16px;
            padding: 5px;
            user-select: none;
            border-bottom: 2px solid #0f0;
        `;
        storeHUD.appendChild(header);

        const container = document.createElement('div');
        container.style.cssText = `display: none; flex-direction: column; width: 100%;`;
        storeHUD.appendChild(container);

        const tabsNav = document.createElement('div');
        tabsNav.style.cssText = `display: flex; border-bottom: 2px solid #0f0;`;
        container.appendChild(tabsNav);

        const tabNames = ['Pets', 'Tags'];
        const tabButtons = {};
        const tabContents = {};

        tabNames.forEach(name => {
            const btn = document.createElement('div');
            btn.textContent = name;
            btn.style.cssText = `flex: 1; text-align: center; padding: 5px; cursor: pointer; user-select: none; border-right: 1px solid #0f0; font-size: 12px;`;
            tabButtons[name] = btn;
            tabsNav.appendChild(btn);

            const content = document.createElement('div');
            content.style.cssText = `display: none; flex-direction: column; padding: 5px; gap: 10px;`;
            tabContents[name] = content;
            container.appendChild(content);

            // TAGS TAB
            if (name === 'Tags') {
                const scrollPurchaseList = document.createElement('div');
                scrollPurchaseList.style.cssText = `height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 5px; border: 1px solid #222;`;

                const ownedList = document.createElement('div');
                ownedList.style.cssText = `display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px;`;

                window.refreshTagsUI = () => {
                    scrollPurchaseList.innerHTML = '';
                    ownedList.innerHTML = '';
                    const tagPrices = [
  ['LEGEND', 100],
  ['TYPER', 10000],
  ['67', 67000],
  ['CPR GOD', 100000],
  ['PET TAMER', 200000],
  ['STARBIT', 250000],
  ['420', 420000],
  ['RGB', 500000],
  ['GUAP', 1000000],
  ['PP MASTER', 5000000]
];

                    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
                    let ownedTags = JSON.parse(localStorage.getItem('ownedTags') || '[]');
                    const currentActive = localStorage.getItem('userRole');

                    tagPrices.forEach(([roleKey, price]) => {
    if (ownedTags.includes(roleKey)) return;

    const roleData = window.rolesConfig[roleKey];
    if (!roleData) return;

    const tagBtn = document.createElement('div');
    tagBtn.style.cssText = `
        padding: 8px;
        border: 1px solid #0f0;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        font-size: 11px;
    `;

    if (roleKey === 'RGB') {
        `${roleData.tag} - ${price}`.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.color = rainbowColors[i % rainbowColors.length];
            tagBtn.appendChild(span);
        });
    } else {
        tagBtn.textContent = `${roleData.tag} - ${price}`;
        tagBtn.style.color = roleData.nameColor;
    }

    tagBtn.onclick = () => {
        if (coins < price) {
            alert('Not enough coins!');
            return;
        }

        coins -= price;
        localStorage.setItem('klaviaCoins', coins);

        ownedTags.push(roleKey);
        localStorage.setItem('ownedTags', JSON.stringify(ownedTags));
        localStorage.setItem('userRole', roleKey);

        if (window.updateHUD) window.updateHUD();
        refreshTagsUI();
    };

    scrollPurchaseList.appendChild(tagBtn);
});


                    ownedTags.forEach(roleKey => {
    const roleData = window.rolesConfig[roleKey];
    if (!roleData) return;

    const miniTag = document.createElement('span');
    miniTag.style.cssText = `font-size: 9px; padding: 2px 4px; cursor: pointer; border-radius: 3px; border: 1px solid ${roleKey === currentActive ? '#fff' : '#333'};`;
    miniTag.textContent = roleData.tag;
    miniTag.style.color = roleData.nameColor;
    miniTag.onclick = () => {
        localStorage.setItem('userRole', roleKey);
        window.refreshTagsUI();
        updateFirebaseRole();
    };
    ownedList.appendChild(miniTag);
});

                };
                content.appendChild(scrollPurchaseList);
                content.appendChild(ownedList);
                btn.onclick = () => {
                    tabNames.forEach(n => { tabContents[n].style.display = (n === 'Tags' ? 'flex' : 'none'); tabButtons[n].style.background = (n === 'Tags' ? '#0f0' : '#111'); tabButtons[n].style.color = (n === 'Tags' ? '#000' : '#0f0'); });
                    refreshTagsUI();
                };
            }

            // PETS TAB
            if (name === 'Pets') {
                const eggList = document.createElement('div');
                eggList.style.cssText = `height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding: 5px; border: 1px solid #222;`;
                const inventory = document.createElement('div');
                inventory.style.cssText = `display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; max-height: 100px; overflow-y: auto;`;

                const equippedRow = document.createElement('div');
equippedRow.style.cssText = `
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
  padding: 6px;
  border: 1px solid #222;
  background: #0b0b0b;
  font-size: 10px;
`;


const refreshPetsUI = () => {
  try {
    eggList.innerHTML = '';
    inventory.innerHTML = '';

    const ownedPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');
    const unlockedTier = parseInt(localStorage.getItem('unlockedChickenIndex') || '0', 10) || 0;

    const eggsArr = Array.isArray(window.eggsConfig) ? window.eggsConfig : [];

    console.log("[PETS] eggsConfig length:", eggsArr.length, "unlockedTier:", unlockedTier);

// Render Eggs
    if (!eggsArr.length) {
      eggList.innerHTML = `
        <div style="padding:8px;border:1px solid #333;background:#111;font-size:11px;">
          No eggs found (window.eggsConfig missing/empty).<br>
          Check console: window.eggsConfig
        </div>
      `;
    } else {
      eggsArr.forEach((egg, idx) => {
        if (!egg || !egg.chances || typeof egg.chances !== "object") return;

        const petPool = Object.keys(egg.chances).filter(p => Number(egg.chances[p] || 0) > 0);

        if (!petPool.length) {
          const eggBtn = document.createElement("div");
          eggBtn.style.cssText = `
            padding: 10px;
            border: 2px solid #444;
            border-radius: 4px;
            text-align: center;
            cursor: default;
            opacity: 0.5;
            font-size: 11px;
            width: 100%;
            box-sizing: border-box;
          `;
          eggBtn.innerHTML = `<strong>${egg.name || "Unknown Egg"}</strong><br>(no pets configured)`;
          eggBtn.title = "This egg has no pets configured.";
          eggList.appendChild(eggBtn);
          return;
        }

        const eggRarity =
          egg.rarity ||
          (typeof egg.name === "string" ? egg.name.split(" ")[0] : "Common");

        const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythical", "Godly"];
        const eggTierIndex = Math.max(0, rarityOrder.indexOf(eggRarity));
        const isLocked = eggTierIndex > unlockedTier;

        let totalWeight = 0;
        petPool.forEach(p => { totalWeight += Number(egg.chances[p] || 0); });

        let chanceText = "-- CHANCES --\r\n";
        petPool.forEach(pName => {
          const w = Number(egg.chances[pName] || 0);
          const percent = totalWeight > 0 ? ((w / totalWeight) * 100).toFixed(1) : "0.0";
          chanceText += `${pName}: ${percent}%\r\n`;
        });

        const eggBtn = document.createElement("div");
        eggBtn.style.cssText = `
          padding: 10px;
          border: 2px solid ${egg.borderColor || "#888"};
          border-radius: 4px;
          text-align: center;
          cursor: ${isLocked ? "not-allowed" : "pointer"};
          opacity: ${isLocked ? 0.65 : 1};
          font-size: 11px;
          width: 100%;
          box-sizing: border-box;
        `;

        eggBtn.innerHTML = `
          <strong>${egg.name || "Unknown Egg"}</strong><br>
          ${(Number(egg.price || 0)).toLocaleString()} coins
          ${isLocked ? `<br><span style="font-size:10px;">LOCKED</span>` : ``}
        `;

        eggBtn.title = isLocked
          ? `Upgrade chicken to ${eggRarity} to hatch this egg.\r\n\r\n${chanceText}`
          : chanceText;

        eggBtn.onclick = () => {
          if (isLocked) {
            alert(`You need to upgrade your chicken to ${eggRarity} to hatch this egg!`);
            return;
          }

          const price = Number(egg.price || 0);
          if (coins < price) {
            alert("Not enough coins!");
            return;
          }

          coins -= price;
          localStorage.setItem("klaviaCoins", coins);

          const roll = Math.random() * totalWeight;
          let cum = 0, chosen = null;

          for (const p of petPool) {
            cum += Number(egg.chances[p] || 0);
            if (roll < cum) { chosen = p; break; }
          }
          if (!chosen) chosen = petPool[petPool.length - 1];

          const pData = window.petsConfig?.[chosen] || {};
          const currentOwned = JSON.parse(localStorage.getItem("ownedPets") || "[]");

          currentOwned.push({
            name: chosen,
            level: 1,
            multiplier: pData.multiplier ?? 0,
            rarity: pData.rarity ?? "Unknown"
          });

          localStorage.setItem("ownedPets", JSON.stringify(currentOwned));

          if (window.updateHUD) window.updateHUD();
          if (window.userId) {
            if (typeof updateFirebaseCoins === "function") updateFirebaseCoins();
            if (typeof updateFirebasePets === "function") updateFirebasePets();
          }

          refreshPetsUI();
          setTimeout(() => alert(`You hatched a ${chosen}!`), 50);
        };

        eggList.appendChild(eggBtn);
      });
    }

const counts = {};
ownedPets.forEach(p => {
  const name = p.name;
  const level = Math.max(1, parseInt(p.level, 10) || 1);
  const key = petKey(name, level);

  if (!counts[key]) {
    counts[key] = {
      name,
      level,
      count: 0,
      rarity: p.rarity,
      baseMultiplier: getBaseMultiplierForPet(name, p.multiplier)
    };
  }
  counts[key].count += 1;
});


let equippedPets = JSON.parse(localStorage.getItem('equippedPets') || '[]');

equippedPets = equippedPets.map(x => parsePetKey(x).key);

const maxEquip = window.getBarnSize();
equippedPets = Array.from(new Set(equippedPets)).slice(0, maxEquip);

const ownedKeys = new Set(Object.keys(counts));
equippedPets = equippedPets.filter(k => ownedKeys.has(k));

localStorage.setItem('equippedPets', JSON.stringify(equippedPets));


const ownedSet = new Set(Object.keys(counts));
equippedPets = equippedPets.filter(n => ownedSet.has(n));
localStorage.setItem('equippedPets', JSON.stringify(equippedPets));
// Render equipped row
equippedRow.innerHTML = '';
const label = document.createElement('div');
label.textContent = `Equipped (max ${maxEquip}): ${equippedPets.length}/${maxEquip}`;
label.style.cssText = `width:100%; color:#0f0; font-weight:bold; margin-bottom:2px;`;
equippedRow.appendChild(label);

if (equippedPets.length === 0) {
  const none = document.createElement('div');
  none.textContent = 'None equipped';
  none.style.color = '#777';
  equippedRow.appendChild(none);
} else {
  equippedPets.forEach(petName => {
    const chip = document.createElement('span');
    chip.textContent = petName;
    chip.style.cssText = `
      padding: 2px 6px;
      border: 1px solid #fff;
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      font-size: 9px;
      user-select: none;
    `;
    chip.title = 'Click to unequip';
    chip.onclick = () => {
      equippedPets = equippedPets.filter(n => n !== petName);
      localStorage.setItem('equippedPets', JSON.stringify(equippedPets));
      if (window.updateHUD) window.updateHUD();
      refreshPetsUI();
    };
    equippedRow.appendChild(chip);
  });
}

// Render inventory
Object.entries(counts).forEach(([key, info]) => {
  const pData = window.petsConfig?.[info.name];
  const isRGBPet = pData && (pData.rarity === 'Divine' || pData.rarity === 'Ethereal');
  const isEquipped = equippedPets.includes(key);

  const pBox = document.createElement('div');
  pBox.style.cssText = `
    padding: 4px 6px;
    border: 1px solid ${isEquipped ? '#fff' : '#444'};
    font-size: 9px;
    background: #1a1a1a;
    cursor: pointer;
    user-select: none;
  `;

  const multNow = multiplierForLevel(info.baseMultiplier, info.level);
  const shownName = formatPetLabel(info.name, info.level);

  if (isRGBPet) {
    const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
    const nameRow = document.createElement('div');
    const strong = document.createElement('strong');

    shownName.split('').forEach((ch, i) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.color = rainbowColors[i % rainbowColors.length];
      s.style.textShadow = `0 0 3px ${s.style.color}`;
      strong.appendChild(s);
    });

    const countSpan = document.createElement('span');
    countSpan.textContent = ` x${info.count}${isEquipped ? ' (E)' : ''}`;
    countSpan.style.color = '#aaa';
    countSpan.style.marginLeft = '4px';

    nameRow.appendChild(strong);
    nameRow.appendChild(countSpan);
    pBox.appendChild(nameRow);

    const bonus = document.createElement('div');
    bonus.innerHTML = `<span style="color:#0f0">+${multNow.toFixed(1)}%</span>`;
    pBox.appendChild(bonus);
  } else {
    pBox.style.color = pData?.color || '#fff';
    pBox.innerHTML = `<strong>${shownName}</strong> <span style="color:#aaa">x${info.count}${isEquipped ? ' (E)' : ''}</span><br><span style="color:#0f0">+${multNow.toFixed(1)}%</span>`;
  }

  const currentMax = (typeof getBarnSize === "function")
    ? getBarnSize()
    : (parseInt(localStorage.getItem("barnSize") || "3", 10) || 3);

  pBox.title = isEquipped
    ? 'Click to unequip'
    : (equippedPets.length >= currentMax ? `You can only equip ${currentMax} pets` : 'Click to equip');

  pBox.onclick = () => {
    let equippedNow = JSON.parse(localStorage.getItem('equippedPets') || '[]').map(x => parsePetKey(x).key);
    equippedNow = Array.from(new Set(equippedNow));

    const currentMax = (typeof getBarnSize === "function")
      ? getBarnSize()
      : (parseInt(localStorage.getItem("barnSize") || "3", 10) || 3);

    if (equippedNow.includes(key)) {
      equippedNow = equippedNow.filter(k => k !== key);
    } else {
      if (equippedNow.length >= currentMax) {
        alert(`You can only equip up to ${currentMax} pets!`);
        return;
      }
      equippedNow.push(key);
    }

    localStorage.setItem('equippedPets', JSON.stringify(equippedNow));
    if (window.updateHUD) window.updateHUD();
    refreshPetsUI();
  };

  inventory.appendChild(pBox);
});


      if (typeof window.refreshUpgradePetsUI === "function") {
  window.refreshUpgradePetsUI(counts, equippedPets);
}



  } catch (err) {
    console.error("[PETS] refreshPetsUI crashed:", err);
    eggList.innerHTML = `
      <div style="padding:8px;border:1px solid #833;background:#200;font-size:11px;">
        Pets UI crashed. Open console for: [PETS] refreshPetsUI crashed
      </div>
    `;
  }
};

window.refreshPetsUI = refreshPetsUI;

setTimeout(() => {
  if (typeof window.refreshPetsUI === "function") window.refreshPetsUI();
}, 0);




                content.appendChild(eggList);
                content.appendChild(equippedRow);
                content.appendChild(inventory);
                btn.onclick = () => {
    tabNames.forEach(n => {
        tabContents[n].style.display = (n === 'Pets' ? 'flex' : 'none');
        tabButtons[n].style.background = (n === 'Pets' ? '#0f0' : '#111');
        tabButtons[n].style.color = (n === 'Pets' ? '#000' : '#0f0');
    });

    window.refreshPetsUI && window.refreshPetsUI();
};

            }
        });

        let expanded = false;
        header.onclick = () => {
            expanded = !expanded;
            container.style.display = expanded ? 'flex' : 'none';
            storeHUD.style.width = expanded ? '300px' : '40px';
            header.textContent = expanded ? 'KFC STORE' : 'S';
        };

        tabButtons['Pets'].click();
        document.body.appendChild(storeHUD);
    }
}

setInterval(checkStoreHUD, 1000);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', checkStoreHUD);
} else {
    checkStoreHUD();
}



         function formatTime(ts) {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const sessionStartTime = Date.now();
let chatHUD = null;
let unreadMessages = localStorage.getItem('chatUnread') === "true";

function checkChatHUD() {
    if (chatHUD && !document.body.contains(chatHUD)) {
        chatHUD = null;
    }

    if (!chatHUD) {
        chatHUD = document.createElement('div');
        chatHUD.id = 'chat-hud';
        chatHUD.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #111;
            color: #0f0;
            font-family: 'Courier New', monospace;
            z-index: 10000;
            border: 2px solid #0f0;
            width: 40px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.id = 'chat-header';
        header.textContent = 'C';
        header.style.cssText = `
            position: relative;
            font-weight: bold;
            text-align: center;
            font-size: 16px;
            padding: 5px;
            user-select: none;
            border-bottom: 2px solid #0f0;
        `;
        chatHUD.appendChild(header);

        const dot = document.createElement('div');
        dot.id = 'chat-notification-dot';
        dot.style.cssText = `
            position: absolute;
            top: 4px;
            right: 4px;
            width: 8px;
            height: 8px;
            background-color: #0f0;
            border-radius: 50%;
            display: ${unreadMessages ? 'block' : 'none'};
        `;
        header.appendChild(dot);

        const container = document.createElement('div');
        container.id = 'chat-container';
        container.style.cssText = `
            display: none;
            flex-direction: column;
            height: 300px;
        `;
        chatHUD.appendChild(container);

        const msgList = document.createElement('div');
        msgList.id = 'chat-msg-list';
        msgList.style.cssText = `
            flex-grow: 1;
            overflow-y: auto;
            padding: 5px;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            scroll-behavior: smooth; /* Makes scrolling feel nicer */
        `;
        container.appendChild(msgList);

        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            display: flex;
            border-top: 2px solid #0f0;
        `;
        container.appendChild(inputArea);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type...';
        input.maxLength = 120;
        input.style.cssText = `
            flex-grow: 1;
            background: #000;
            color: #0f0;
            border: none;
            padding: 5px;
            outline: none;
            font-family: inherit;
        `;
        inputArea.appendChild(input);

        const sendBtn = document.createElement('button');
        sendBtn.textContent = '>';
        sendBtn.style.cssText = `
            background: #0f0;
            color: #000;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        `;
        inputArea.appendChild(sendBtn);

        let expanded = false;
        let lastMessageTime = 0;
        let lastSpamWarningTime = 0;
        let lastSeenMessageTime = parseInt(localStorage.getItem('chatLastSeen') || '0', 10);

        const scrollToBottom = () => {
            setTimeout(() => {
                msgList.scrollTop = msgList.scrollHeight;
            }, 10);
        };

        function setChatExpanded(state) {
            expanded = state;
            container.style.display = expanded ? 'flex' : 'none';
            chatHUD.style.width = expanded ? '300px' : '40px';
            header.textContent = expanded ? 'Global Chat' : 'C';

            if (expanded) {
                unreadMessages = false;
                localStorage.setItem('chatUnread', 'false');
                const dot = document.getElementById('chat-notification-dot');
                if (dot) dot.style.display = 'none';

                lastSeenMessageTime = Date.now();
                localStorage.setItem('chatLastSeen', lastSeenMessageTime.toString());

                scrollToBottom();
            } else {
                const dot = document.getElementById('chat-notification-dot');
                if (dot && unreadMessages) {
                    dot.style.display = 'block';
                }
            }
        }

        header.onclick = () => setChatExpanded(!expanded);

        const sendMessage = () => {
    const text = input.value.trim();
    const currentUserId = localStorage.getItem('kfcUserId') || "Guest";
    const now = Date.now();

    if (!text || text.length > 120) return;

    const mutedList = JSON.parse(localStorage.getItem('kfc_muted_users')) || [];
    if (mutedList.includes(currentUserId)) {
        const msgDiv = document.createElement('div');
        msgDiv.style.borderBottom = '1px solid #222';
        msgDiv.style.padding = '2px 0';
        msgDiv.innerHTML = `<span style="color: #ff0000; font-weight: bold;">System: You are currently muted and cannot send messages.</span>`;
        msgList.appendChild(msgDiv);

        if (typeof scrollToBottom === 'function') scrollToBottom();

        input.value = '';
        return;
    }

    if (now - lastMessageTime < 1500) {
        if (now - lastSpamWarningTime > 3000) {
            database.ref('chat/messages').push({
                system: true,
                text: 'Please wait a bit before sending another message!',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            lastSpamWarningTime = now;
        }
        return;
    }

    lastMessageTime = now;
    database.ref('chat/messages').push({
        user: currentUserId,
        text: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    input.value = '';
};

        sendBtn.onclick = (e) => { e.stopPropagation(); sendMessage(); };
        input.onkeydown = (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') sendMessage();
        };
        input.onclick = (e) => e.stopPropagation();

        function setupChatListener() {
    if (!msgList) return;

    database.ref('chat/messages').off();
    database.ref('chat/messages')
        .limitToLast(50)
        .on('child_added', (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            const isAtBottom = msgList.scrollHeight - msgList.scrollTop <= msgList.clientHeight + 50;
            const msgDiv = document.createElement('div');
            msgDiv.style.borderBottom = '1px solid #222';
            msgDiv.style.padding = '2px 0';

            if (data.timestamp) {
                const timeSpan = document.createElement('span');
                const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSpan.textContent = `[${time}] `;
                timeSpan.style.color = '#888';
                msgDiv.appendChild(timeSpan);
            }

            if (window.globalMutedList && window.globalMutedList.includes(data.user)) {
                const muteSpan = document.createElement('span');
                muteSpan.textContent = `${data.user} is currently muted.`;
                muteSpan.style.color = '#ff0000';
                muteSpan.style.fontWeight = 'bold';
                // Red bloom effect
                muteSpan.style.textShadow = '0 0 8px #ff0000, 0 0 15px #ff0000';
                msgDiv.appendChild(muteSpan);
            }

            else if (data.user === "_system" || data.system) {
                const sysSpan = document.createElement('span');
                const cleanText = data.text.startsWith("System Message:") ? data.text : `System Message: ${data.text}`;
                sysSpan.textContent = cleanText;
                sysSpan.style.color = '#ffffff';
                sysSpan.style.fontWeight = 'bold';
                sysSpan.style.textShadow = '0 0 8px #ffffff, 0 0 15px #ffffff';
                msgDiv.appendChild(sysSpan);
            }
            else {
                getRoleStyles(data.user, (tag, tagColor, nameColor) => {
                    if (tag) {
                        const tagSpan = document.createElement('span');
                        tagSpan.textContent = tag + ' ';
                        tagSpan.style.color = tagColor;
                        tagSpan.style.fontWeight = 'bold';
                        tagSpan.style.textShadow = `0 0 5px ${tagColor}, 0 0 10px ${tagColor}`;
                        msgDiv.appendChild(tagSpan);
                    }

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = data.user + ': ';
                    const finalNameColor = data.user === 'guappanese' ? '#f00' : nameColor;
                    nameSpan.style.color = finalNameColor;
                    nameSpan.style.fontWeight = 'bold';
                    nameSpan.style.textShadow = `0 0 5px ${finalNameColor}, 0 0 10px ${finalNameColor}`;
                    msgDiv.appendChild(nameSpan);

                    const textSpan = document.createElement('span');
                    textSpan.textContent = ` ${data.text}`;
                    textSpan.style.color = '#0f0';
                    msgDiv.appendChild(textSpan);
                });
            }

            msgList.appendChild(msgDiv);
            if (isAtBottom || data.user === localStorage.getItem('kfcUserId')) {
                scrollToBottom();
            }
        });
}

        setupChatListener();
        document.body.appendChild(chatHUD);
    }
}

setInterval(checkChatHUD, 1000);

setInterval(() => {
    checkLeaderboardHUD();
    checkChatHUD();
}, 500);







    // Dev Commands

         window.removePets = function() {
             if (window.userId !== 'guappanese') {
        console.error("Access Denied: You do not have permission to use this command.");
        return;
    }
    localStorage.removeItem('ownedPets');

    if (typeof userId !== 'undefined' && userId) {
        if (typeof updateFirebasePets === 'function') {
            updateFirebasePets();
        }
    }

    if (window.updateHUD) {
        window.updateHUD();
    }

    if (typeof refreshPetsUI === 'function') {
        refreshPetsUI();
    }

    console.log("%c [KFC] All pets have been removed successfully!", "color: #ff0000; font-weight: bold;");
};

         window.muteUser = function(username) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied: You do not have permission to use this command.");
        return;
    }

    if (!username) {
        console.log("Please provide a username: muteUser('name')");
        return;
    }

    const muteRef = database.ref(`globalMutes/${username}`);

    muteRef.once('value').then(snapshot => {
        if (snapshot.exists()) {
            muteRef.remove(); // Unmute
            console.log(`${username} has been globally unmuted.`);
        } else {
            muteRef.set(true); // Mute
            console.log(`${username} has been globally muted.`);
        }
    });
};

window.deletePlayer = function(targetName) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied: You do not have permission to use this command.");
        return;
    }

    if (!targetName) {
        console.warn("Please specify a player name: deletePlayer('Name')");
        return;
    }

    database.ref('leaderboard/' + targetName).remove()
        .then(() => console.log(`Successfully removed ${targetName} from the leaderboard.`))
        .catch(err => console.error("Error removing from leaderboard:", err));

    database.ref('chat').once('value', (snapshot) => {
        const messages = snapshot.val();
        if (!messages) return;

        Object.keys(messages).forEach((msgId) => {
            if (messages[msgId].user === targetName) {
                database.ref('chat/' + msgId).remove();
            }
        });
        console.log(`Searching and deleting all chat messages from ${targetName}...`);
    });
};


     window.systemMessage = function(message) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }

    if (!message) return;
    const fakeUserId = "_system";

    const fullMessage = `System Message: ${message}`;

    database.ref('chat/messages').push({
        user: fakeUserId,
        text: fullMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
};

         window.giveRole = function(username, roleName) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }

    if (!window.rolesConfig?.[roleName]) {
        console.error(`Role "${roleName}" does not exist`);
        return;
    }

    if (window.database) {
        window.database.ref(`userOwnedRoles/${username}/${roleName}`).set(true);

        window.database.ref(`userRoles/${username}`).set(roleName);

        console.log(
            `%c[ADMIN] ${username} unlocked + equipped "${roleName}"`,
            "color:#00ff00;font-weight:bold;"
        );
    } else {
        console.warn("Database not available; local HUD will still update");
    }

    if (username === window.userId) {
    window.ownedTags = window.ownedTags || ['default'];

    if (!window.ownedTags.includes(roleName)) {
        window.ownedTags.push(roleName);
    }

    localStorage.setItem('ownedTags', JSON.stringify(window.ownedTags));

    localStorage.setItem('userRole', roleName);

    if (typeof window.refreshTagsUI === 'function') window.refreshTagsUI();
}

};





window.clearLeaderboards = () => {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }
    database.ref('leaderboard').remove(); }

window.clearUsername = () => {
    if (window.userId) database.ref('leaderboard/' + window.userId).remove();
    localStorage.removeItem('kfcUserId');
    window.userId = null;
};


window.givePP = (a) => { a = parseInt(a); if (isNaN(a) || a <= 0) return console.log("Invalid"); prestigePoints += Math.round(a); localStorage.setItem('prestigePoints', prestigePoints); if (typeof updateFirebasePrestige === 'function') updateFirebasePrestige(); if (window.updateHUD) window.updateHUD(); console.log(`Added ${a} PP`); };


    window.giveCoins = function(amount) {
        if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }
        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0) return console.log("Cannot be 0");
        coins += Math.round(amount);
        localStorage.setItem('klaviaCoins', coins);
        updateFirebaseCoins();
        checkAchievements();
        if (window.updateHUD) window.updateHUD();
    };

         window.giveCoinsToUser = function(targetUsername, amount) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied: You do not have permission to use this command.");
        return;
    }

    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) {
        return console.log("Invalid amount: Must be a positive number.");
    }

    const userRef = database.ref('leaderboard/' + targetUsername);

    userRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            console.error(`User "${targetUsername}" not found in the database.`);
            return;
        }

        const currentData = snapshot.val();
        const currentCoins = parseInt(currentData.coins) || 0;
        const newTotal = currentCoins + val;

        userRef.update({
            coins: newTotal,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log(`Successfully gave ${val} coins to ${targetUsername}. New total: ${newTotal}`);
        }).catch(err => {
            console.error("Database update failed:", err);
        });
    });
};

         window.removeCoinsFromUser = function(targetUsername, amount) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied: You do not have permission to use this command.");
        return;
    }

    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) {
        return console.log("Invalid amount: Must be a positive number.");
    }

    const userRef = database.ref('leaderboard/' + targetUsername);

    userRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            console.error(`User "${targetUsername}" not found.`);
            return;
        }

        const currentData = snapshot.val();
        const currentCoins = parseInt(currentData.coins) || 0;

        const newTotal = Math.max(0, currentCoins - val);

        userRef.update({
            coins: newTotal,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log(`Successfully removed ${val} coins from ${targetUsername}. New total: ${newTotal}`);
        }).catch(err => {
            console.error("Database update failed:", err);
        });
    });
};

         window.giveSessionRaces = function (x) {
             if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }
    if (typeof x !== 'number' || isNaN(x)) {
        console.warn('giveSessionRaces(x) expects a number');
        return;
    }

    sessionRaces = (sessionRaces || 0) + x;

    if (sessionRaces < 0) sessionRaces = 0;

    localStorage.setItem('sessionRaces', sessionRaces);

    if (typeof updateSessionRacesUI === 'function') {
        updateSessionRacesUI();
    }

    console.log(`Session Races set to: ${sessionRaces}`);
};


window.giveStarbits = function(amount = 1) {
    if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }
    starBits += amount;
    localStorage.setItem('starBits', starBits);
    console.log(`Added ${amount} Star Bits! Total: ${starBits}`);
    if (window.updateHUD) window.updateHUD();
};

    window.giveRaces = function(amount) {
        if (window.userId !== 'guappanese') {
        console.error("Access Denied");
        return;
    }
        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0) return console.log("Cannot be 0");
        sessionRaces += amount;
        totalRaces += amount;
        localStorage.setItem('totalRaces', totalRaces);
        updateFirebaseRaces();
        if (typeof refreshLevelMiniHUD === 'function') refreshLevelMiniHUD();




        checkAchievements();
        if (window.updateHUD) window.updateHUD();
    };

         function giveSessionRaces(amount) {

    sessionRaces = (sessionRaces || 0) + amount;
    totalRaces = (totalRaces || 0) + amount;
    localStorage.setItem('sessionRaces', sessionRaces);
    localStorage.setItem('totalRaces', totalRaces);
    window.updateHUD && window.updateHUD();
    console.log(`Added ${amount} session races. Session: ${sessionRaces}, Total: ${totalRaces}`);
}


    window.resetClicker = function () {
    sessionRaces = 0;
    totalRaces = 0;
    coins = 0;
    coinsPerSecond = 0;
    prestigeCount = 0;
    prestigePoints = 0;
    starBits = 0;
    skillTreeUnlocked = false;
    generator1Purchased = false;
    activeTabName = 'Home';


localStorage.setItem('unlockedChickenIndex', '0');
localStorage.setItem('selectedChickenIndex', '0');
localStorage.removeItem('pendingChickenUnlock');

    localStorage.setItem('klaviaCoins', 0);
    localStorage.setItem('totalRaces', 0);
    localStorage.setItem('prestigeCount', 0);
    localStorage.setItem('prestigePoints', 0);
    localStorage.setItem('starBits', 0);
    localStorage.setItem('userRole', 'Guest');

    localStorage.removeItem('ownedPets');
    localStorage.removeItem('ownedTags');
    localStorage.removeItem('skillTreeUnlocked');
    localStorage.removeItem('generator1Purchased');

if (typeof window.refreshChickenUI === 'function') window.refreshChickenUI();

if (typeof window.refreshPetsUI === 'function') window.refreshPetsUI();


    window.ownedTags = ['default'];
    if (typeof refreshTagsUI === 'function') refreshTagsUI();

    if (window.userId && window.database) {
        // Reset leaderboard info
        window.database.ref('leaderboard/' + window.userId).update({
            coins: 0,
            totalRaces: 0,
            totalPets: 0,
            prestigeCount: 0,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Remove pets & tags from database
        window.database.ref('ownedPets/' + window.userId).remove();
        window.database.ref('userOwnedRoles/' + window.userId).remove(); // remove all roles
        window.database.ref('userRoles/' + window.userId).set('Guest');
    }

    // Reset upgrades
    upgrades.forEach(upg => {
        upg.purchased = false;
        localStorage.removeItem(`upgrade${upg.id}Purchased`);
        const box = document.getElementById(`upgrade-${upg.id}`);
        if (box) {
            box.style.color = '#0f0';
            box.title = `${upg.cost} coins: ${upg.description}`;
        }
    });

    skillTreeUpgrades.forEach(skill => {
        skill.purchased = false;
        localStorage.removeItem(`skill${skill.id}Purchased`);
        const box = document.getElementById(`skill-${skill.id}`);
        if (box) {
            box.style.color = '#0f0';
            box.title = `${skill.cost} coins: ${skill.description}`;
        }
    });

    prestigeUpgrades.forEach(upg => {
        upg.purchased = false;
        localStorage.removeItem(`prestigeUpgrade${upg.id}Purchased`);
        const box = document.getElementById(`prestige-upgrade-${upg.id}`);
        if (box) {
            box.style.color = '#ff0';
            box.title = `${upg.cost} PP: ${upg.description}`;
        }
    });

    achievements.forEach(ach => {
        ach.unlocked = false;
        localStorage.removeItem(`achievement${ach.id}Unlocked`);
        const box = document.getElementById(`achievement-${ach.id}`);
        if (box) box.style.color = '#555';
    });

    if (typeof generator1Box !== 'undefined' && generator1Box) {
        generator1Box.style.color = '#0f0';
        generator1Box.title = 'Cost: 1 coin';
    }

    const skillTreeTab = document.getElementById('tab-SkillTree');
    const skillTreeButton = document.getElementById('skill-tree-btn');
    if (skillTreeTab) skillTreeTab.style.display = 'none';
    if (skillTreeButton) skillTreeButton.style.display = 'none';

    if (window.updateHUD) window.updateHUD();
    if (typeof openTab === 'function') openTab('Home');

    console.log('Local data, Leaderboard, Pets, and Roles have been wiped.');
};




    setupRaceDetector();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClicker);
    } else {
        initClicker();
    }
}, 500);
})();