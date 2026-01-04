// ==UserScript==
// @name         Klavia Frenzy Clicker 0.1.4.6
// @namespace    http://tampermonkey.net/
// @version      0.1.4.7
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
// @downloadURL https://update.greasyfork.org/scripts/561087/Klavia%20Frenzy%20Clicker%200146.user.js
// @updateURL https://update.greasyfork.org/scripts/561087/Klavia%20Frenzy%20Clicker%200146.meta.js
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
         function updateFirebaseRole() {
    if (!window.userId) return;
    const currentRole = localStorage.getItem('userRole') || 'Guest';
    database.ref('userRoles/' + window.userId).set(currentRole);
}

         function onUserReady(userId) {
    window.userId = userId;

    listenForOwnedRoles(userId);

    database.ref(`userRoles/${userId}`).once('value').then(snapshot => {
        const role = snapshot.val() || 'default';
        localStorage.setItem('userRole', role);
        refreshTagsUI();
    });

    console.log("[USER READY]", userId);
}

         function listenForOwnedRoles(username) {
    database.ref(`userOwnedRoles/${username}`).on('value', snapshot => {
        const data = snapshot.val() || {};

        if (username === window.userId) {
            window.ownedTags = ['default', ...Object.keys(data)];
            refreshTagsUI();
        }
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
        { id: 14, purchased: JSON.parse(localStorage.getItem('upgrade14Purchased')) || false, type: 'totalPercent', value: 0.001, cost: 500, description: "Gain +0.1% CpR/10 total races" },
        { id: 15, purchased: JSON.parse(localStorage.getItem('upgrade15Purchased')) || false, type: 'multiplier', value: 2, cost: 2700, description: "Double your base CpR" },
        { id: 16, purchased: JSON.parse(localStorage.getItem('upgrade16Purchased')) || false, type: 'totalRaceBonus', value: 10, cost: 3500, description: "Adds +10 CpR every 25 total races" },
        { id: 17, purchased: JSON.parse(localStorage.getItem('upgrade17Purchased')) || false, type: 'multiplier', value: 2, cost: 6500, description: "Double your base CpR" },
        { id: 18, purchased: JSON.parse(localStorage.getItem('upgrade18Purchased')) || false, type: 'percent', value: 0.05, cost: 2000, description: "Earn +5% CpR" },
        { id: 19, purchased: JSON.parse(localStorage.getItem('upgrade19Purchased')) || false, type: 'sessionRaceBonus', value: 10, cost: 6200, description: "Adds +10 CpR every 10 session races" },
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
    { id: 6, purchased: JSON.parse(localStorage.getItem('skill6Purchased')) || false, cost: 150000, type: 'unlockCasino', description: "Unlocks the Casino!" },
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
    'Nusakan': { rarity: 'Divine', multiplier: 10000, color: '#FFC0CB', isRGB: true }
};

// Eggs
window.eggsConfig = [
    { name: 'Common Egg', price: 1000, borderColor: '#ffffff', chances: { 'Hamster': 0.23, 'Cat': 0.23, 'Dog': 0.23, 'Goldfish': 0.23, 'Gecko': 0.07, 'Fairy': 0.01 } },
    { name: 'Uncommon Egg', price: 5000, borderColor: '#5555ff', chances: { 'Frog': 0.23, 'Rabbit': 0.23, 'Turtle': 0.23, 'Gecko': 0.23, 'Slime': 0.07, 'Phoenix': 0.01 } },
    { name: 'Rare Egg', price: 25000, borderColor: '#FF0000', chances: { 'Slime': 0.23, 'Fairy': 0.23, 'Fox': 0.23, 'Kangaroo': 0.23, 'Dragon': 0.07, 'Unicorn': 0.01 } },
    { name: 'Legendary Egg', price: 100000, borderColor: '#FFA500', chances: { 'Dragon': 0.23, 'Phoenix': 0.23, 'Imp': 0.23, 'Pegasus': 0.23, 'Keyboard': 0.08 } },
    { name: 'Mythical Egg', price: 500000, borderColor: '#800080', chances: { 'Unicorn': 0.23, 'Keyboard': 0.23, 'Sphynx': 0.23, 'Pikachu': 0.23, 'Kraken': 0.08 } },
    { name: 'Godly Egg', price: 2000000, borderColor: '#FFC0CB', chances: { 'Autotyper': 0.32, 'Big Foot': 0.32, 'Kraken': 0.32, 'Nusakan': 0.01, 'Guappanese': 0.01, 'Mario': 0.01, 'Parz': 0.01 } }
];
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

        const petMultiplierSum = myPets.reduce((sum, pet) => sum + (pet.multiplier / 100), 0);

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
    headerElement.textContent = expanded ? 'Klavia Frenzy Clicker 0.1.4.6' : 'KFC';
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
        box.style.marginBottom = '5px'; // Added for spacing
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

                if (skill.id === 6) {
                    casinoButton.style.display = 'flex';
                    alert("Casino unlocked! Check the Achievements tab.");
                }

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
    if (coins >= 10000) {
        coins -= 10000;
        coins = Math.round(coins);
        localStorage.setItem('klaviaCoins', coins);

        skillTreeUnlocked = true;
        localStorage.setItem('skillTreeUnlocked', true);

        if (window.updateHUD) window.updateHUD();

        alert("Skill Tree unlocked!");

        checkAchievements();
    } else {
        alert("You need 10,000 coins to unlock the Skill Tree!");
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
    if (tabName === 'Home') {
        skillTreeButton.style.display = 'none';
        skillTreeTab.style.display = 'none';
        casinoTab.style.display = 'none';
        casinoButton.style.display = 'none';

    } else if (tabName === 'Upgrades') {
        const visibleCount = getVisibleUpgradeCount(upgrades);

        upgrades.forEach((upg, index) => {
            const box = document.getElementById(`upgrade-${upg.id}`);
            if (!box) return;
            box.style.display = index < visibleCount ? 'flex' : 'none';
        });

        skillTreeButton.style.display = 'flex';
        skillTreeTab.style.display = 'none';
        casinoTab.style.display = 'none';
        casinoButton.style.display = 'none';

    } else if (tabName === 'Achievements') {
        achievements.forEach(ach => {
            const box = document.getElementById(`achievement-${ach.id}`);
            if (box) box.style.display = 'flex';
        });

        skillTreeButton.style.display = 'none';
        skillTreeTab.style.display = 'none';
        casinoTab.style.display = 'none';
        casinoButton.style.display = skillTreeUpgrades[5]?.purchased ? 'flex' : 'none';

    } else if (tabName === 'Skill Tree') {
        skillTreeButton.style.display = 'none';
        skillTreeTab.style.display = 'flex';
        casinoTab.style.display = 'none';
        renderSkillTree();

    } else if (tabName === 'Casino') {
        skillTreeButton.style.display = 'none';
        skillTreeTab.style.display = 'none';
        casinoTab.style.display = 'flex';
        renderCasino();
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
    }

    // Coinflip
    const coinflipTabButton = createTabButton('Coinflip', () => {
        hideAllAreas();
        coinflipArea.style.display = 'flex';
    });
    casinoTab.appendChild(coinflipTabButton);

    const coinflipArea = createDiv('', {
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px'
    });
    casinoTab.appendChild(coinflipArea);

    coinflipArea.appendChild(createDiv('Win: +100% your bet'));
    const betInput = document.createElement('input');
    betInput.type = 'number';
    betInput.min = '1';
    betInput.value = '10';
    betInput.style.width = '80px';
    coinflipArea.appendChild(betInput);

    const flipButton = createButton('Flip Coin', () => {
        let bet = parseInt(betInput.value);
        if (isNaN(bet) || bet <= 0) return alert('Enter a valid bet!');
        if (bet > coins) return alert("You don't have enough coins!");

        const win = Math.random() < 0.5;
        if (win) {
            coins += bet;
            resultMessage.textContent = `You won! +${bet} Coins`;
        } else {
            coins -= bet;
            resultMessage.textContent = `You lost! -${bet} Coins`;
        }

        localStorage.setItem('klaviaCoins', coins);
        if (userId) {
    updateFirebaseCoins();
}
        if (window.updateHUD) window.updateHUD();
    });
    coinflipArea.appendChild(flipButton);

    const resultMessage = createDiv('', { marginTop: '5px' });
    coinflipArea.appendChild(resultMessage);

    /*** Higher/Lower Section ***/
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

    const hlWinHeader = createDiv('Win: +10% Bet', { color: '#0f0', fontWeight: 'bold', marginTop: '5px' });
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
            const winAmount = Math.floor(bet * 0.1);
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

    // Slot Machine
    const slotButton = createTabButton('Slot Machine', () => {
        if (!slotUnlocked) {
            if (coins >= 100000) {
                coins -= 100000;
                localStorage.setItem('klaviaCoins', coins);
                slotUnlocked = true;
                localStorage.setItem('slotUnlocked', true);
                if (window.updateHUD) window.updateHUD();
                alert('Slot Machine unlocked!');
            } else {
                return alert('You need 100,000 coins to unlock the Slot Machine!');
            }
        }
        hideAllAreas();
        slotArea.style.display = 'flex';
    });
    slotButton.title = 'Unlock Slot Machine for 100,000 coins';
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

    let slotUnlocked = JSON.parse(localStorage.getItem('slotUnlocked')) || false;

    casinoTab.prepend(createDiv('Welcome to the Casino!', { marginBottom: '10px', fontWeight: 'bold' }));

    coinflipTabButton.click();
}





        window.updateHUD();
        document.body.appendChild(hud);

        container.style.display = expanded ? 'flex' : 'none';
hud.style.width = expanded ? '300px' : '40px';
headerElement.textContent = expanded ? 'Klavia Frenzy Clicker 0.1.4.6' : 'KFC';

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

    if (leaderboardHUD) {
        leaderboardHUD.style.display = (kfcOpen || pOpen) ? 'none' : 'flex';
    }

    if (prestigeHUD) {
        prestigeHUD.style.display = kfcOpen ? 'none' : 'flex';
    }

    if (kfcHUD) {
        kfcHUD.style.display = pOpen ? 'none' : 'flex';
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

prestigeBtn.addEventListener('click', () => {
    const cost = getPrestigeCost();

    if (coins < cost) {
        alert(`You need ${cost.toLocaleString()} coins to Prestige!`);
        return;
    }

    if (!confirm('Prestige will reset your progress, but you will gain skill points. Continue?')) return;

    coins -= cost;

    coins = 0;
    starBits = 0;
    coinsPerSecond = 0;

    upgrades.forEach(upg => {
        upg.purchased = false;
        localStorage.removeItem(`upgrade${upg.id}Purchased`);
    });

    skillTreeUpgrades.forEach(skill => {
        skill.purchased = false;
        localStorage.removeItem(`skill${skill.id}Purchased`);
    });

    localStorage.setItem('klaviaCoins', 0);
    localStorage.setItem('starBits', 0);
    localStorage.setItem('skillTreeUnlocked', false);

    prestigeCount++;
    localStorage.setItem('prestigeCount', prestigeCount);
    if (userId) {
    updateFirebasePrestige();
}


    function calculatePrestigePoints(basePoints = 1) {
    let multiplier = 1;

    prestigeUpgrades.forEach(upg => {
        if (upg.purchased && upg.type === 'prestigePoints') {
            multiplier *= upg.value;
        }
    });

    return basePoints * multiplier;
}
const earnedPrestigePoints = calculatePrestigePoints(1);
prestigePoints += earnedPrestigePoints;
localStorage.setItem('prestigePoints', prestigePoints);

    if (typeof recalculateCoinsPerSecond === 'function') recalculateCoinsPerSecond();
    if (typeof updateHUD === 'function') updateHUD();
    if (typeof renderUpgrades === 'function') renderUpgrades();
    if (typeof renderSkillTree === 'function') renderSkillTree();
    if (typeof updateGeneratorsUI === 'function') updateGeneratorsUI();

    const nextCost = getPrestigeCost();
    alert(`Prestiged! Next prestige costs ${nextCost.toLocaleString()} coins.`);
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

        // Replace your existing listDiv listener block with this:
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

    // ADD THIS: Ensure clicking the button forces a fresh render
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
    container.style.display = expanded ? 'flex' : 'none';
    leaderboardHUD.style.width = expanded ? '320px' : '40px';
    header.textContent = expanded ? 'Leaderboard' : 'L';

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
    // If the HUD element exists but is not in the body (detached), clear the reference
    if (storeHUD && !document.body.contains(storeHUD)) {
        storeHUD = null;
    }

    // Only create if it doesn't exist
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
    if (!roleData) return; // skip if role not defined

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

                const refreshPetsUI = () => {
                    eggList.innerHTML = '';
                    inventory.innerHTML = '';

                    let ownedPets = JSON.parse(localStorage.getItem('ownedPets') || '[]');
                    if (userId) updateFirebasePets();
                    const ownedNames = ownedPets.map(p => p.name);

                    window.eggsConfig.forEach(egg => {
                        const available = Object.keys(egg.chances).filter(p => !ownedNames.includes(p));
                        const isDone = available.length === 0;

                        const eggBtn = document.createElement('div');
                        eggBtn.style.cssText = `padding: 10px; border: 2px solid ${isDone ? '#444' : egg.borderColor}; border-radius: 4px; text-align: center; cursor: ${isDone ? 'default' : 'pointer'}; opacity: ${isDone ? 0.5 : 1}; font-size: 11px;`;
                        eggBtn.innerHTML = `<strong>${egg.name}</strong><br>${isDone ? 'SOLD OUT' : egg.price.toLocaleString()}`;

                        if (!isDone) {
                            let totalWeight = 0;
                            available.forEach(p => totalWeight += egg.chances[p]);
                            let chanceText = "-- CHANCES --\r\n";
                            available.forEach(pName => {
                                const percent = ((egg.chances[pName] / totalWeight) * 100).toFixed(1);
                                chanceText += `${pName}: ${percent}%\r\n`;
                            });
                            eggBtn.title = chanceText;

                            eggBtn.onclick = () => {
    if (coins >= egg.price) {

        coins -= egg.price;

        localStorage.setItem('klaviaCoins', coins);


        const roll = Math.random() * totalWeight;
        let cum = 0, chosen = null;
        for (const p of available) {
            cum += egg.chances[p];
            if (roll < cum) { chosen = p; break; }
        }

        const pData = window.petsConfig[chosen];
        const currentOwned = JSON.parse(localStorage.getItem('ownedPets') || '[]');
        currentOwned.push({
            name: chosen,
            multiplier: pData.multiplier,
            rarity: pData.rarity
        });
        localStorage.setItem('ownedPets', JSON.stringify(currentOwned));

        if (window.updateHUD) {
            window.updateHUD();
        }

        if (userId) {
            updateFirebaseCoins();
            updateFirebasePets();
        }


        refreshPetsUI();

        setTimeout(() => {
            alert(`You hatched a ${chosen}!`);
        }, 50);

    } else {
        alert('Not enough coins!');
    }
};
                        } else {
                            eggBtn.title = "You have collected all pets from this egg!";
                        }
                        eggList.appendChild(eggBtn);
                    });

                    ownedPets.forEach(p => {
                        const pBox = document.createElement('div');
                        pBox.style.cssText = `padding: 2px 5px; border: 1px solid #444; font-size: 9px; background: #1a1a1a;`;
                        const pData = window.petsConfig[p.name];
                        const isRGBPet = pData && pData.rarity === 'Divine';

                        if (isRGBPet) {
                            const rainbowColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
                            const nameContainer = document.createElement('strong');
                            p.name.split('').forEach((char, i) => {
                                const charSpan = document.createElement('span');
                                charSpan.textContent = char;
                                charSpan.style.color = rainbowColors[i % rainbowColors.length];
                                charSpan.style.textShadow = `0 0 3px ${charSpan.style.color}`;
                                nameContainer.appendChild(charSpan);
                            });
                            pBox.appendChild(nameContainer);
                            pBox.innerHTML += `<br><span style="color:#0f0">+${p.multiplier}%</span>`;
                        } else {
                            pBox.style.color = pData?.color || '#fff';
                            pBox.innerHTML = `<strong>${p.name}</strong><br><span style="color:#0f0">+${p.multiplier}%</span>`;
                        }
                        inventory.appendChild(pBox);
                    });
                };

                content.appendChild(eggList);
                content.appendChild(inventory);
                btn.onclick = () => {
                    tabNames.forEach(n => { tabContents[n].style.display = (n === 'Pets' ? 'flex' : 'none'); tabButtons[n].style.background = (n === 'Pets' ? '#0f0' : '#111'); tabButtons[n].style.color = (n === 'Pets' ? '#000' : '#0f0'); });
                    refreshPetsUI();
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

    const mutedList = JSON.parse(localStorage.getItem('kfc_muted_users')) || [];

    if (mutedList.includes(data.user)) {
        // Only show this placeholder if the user is actually on your mute list
        const muteSpan = document.createElement('span');
        muteSpan.textContent = `${data.user} is currently muted.`;
        muteSpan.style.color = '#ff0000';
        muteSpan.style.fontWeight = 'bold';
        msgDiv.appendChild(muteSpan);
    }
    else if (data.system) {
        const sysSpan = document.createElement('span');
        sysSpan.textContent = `System: ${data.text}`;
        sysSpan.style.color = '#fff';
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

    if (!mutedUsers.includes(username)) {
        mutedUsers.push(username);
        localStorage.setItem('kfc_muted_users', JSON.stringify(mutedUsers));
        console.log(`${username} has been muted.`);
    } else {
        // Toggle: If already muted, unmute them
        mutedUsers = mutedUsers.filter(u => u !== username);
        localStorage.setItem('kfc_muted_users', JSON.stringify(mutedUsers));
        console.log(`${username} has been unmuted.`);
    }
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

    const fullMessage = `${message}`;

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

    // Reset localStorage
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

    // Reset window variables
    window.ownedTags = ['default']; // reset tags
    if (typeof refreshTagsUI === 'function') refreshTagsUI(); // refresh HUD

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