// ==UserScript==
// @name         FV - Starr Slots Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      10.1
// @description  Slot machine with Starr. Earn fake currency and climb the leaderboard!
// @author       necroam
// @match        https://www.furvilla.com/villager/414420
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558452/FV%20-%20Starr%20Slots%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558452/FV%20-%20Starr%20Slots%20Mini-game.meta.js
// ==/UserScript==


(function() {
'use strict';

/* ------------------------------------------------------------
   CONF
------------------------------------------------------------ */

const LEADERBOARD_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-vFZEmeQkY9tEKARH8trFmO3yOjVAiDLX5Rrrbsoj5bgDPxc7tBltZG2RSNDPBrWImeEiOWtEcXvV/pub?gid=1042339950&single=true&output=csv";

const INTERACTIONS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEB__jn-S8jQtcm0oSAZcGwKicdhvwi5ysNwcb8vh8GKqDbi-Y_sQvV76fZwFEdIdFzMkbub8FmlUQ/pub?gid=178327147&single=true&output=csv";

const SOUND_URLS = {
    winCombo1: "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo3.mp3",
    winCombo2: "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo4.mp3",
    winCombo3: "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo5.mp3",
    jackpot: "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3"
};

// Sound preload
const soundCache = {};

// Logs
let latestMessages = new Map();

// Currency
let currency = null;
let freeSpins = 0;

// Current bet amount
let currentBet = 2;

// Leaderboard cache
const leaderboardCache = {};

// Google Sheets sync status
let googleSheetsEnabled = true;

// Interaction helper
function formatInteraction(user, msg) {
    if (msg.startsWith(user)) return `<b>${msg}</b>`;
    return `<b>${user}</b> ${msg}`;
}

/* ------------------------------------------------------------
   SOUND
------------------------------------------------------------ */

async function preloadSounds() {
    for (const [key, url] of Object.entries(SOUND_URLS)) {
        try {
            const audio = new Audio(url);
            audio.preload = "auto";
            soundCache[key] = audio;
        } catch (error) {
            console.error(`Failed to preload sound ${key}:`, error);
        }
    }
}

// sound effects
function playSound(soundKey) {
    if (soundCache[soundKey]) {
        const audio = soundCache[soundKey].cloneNode();
        audio.volume = 0.7;
        audio.play().catch(error => {
            console.log(`Sound play failed (user may have muted): ${error}`);
        });
        return audio;
    }
    return null;
}

function playWinSound(winAmount, betAmount) {
    const winMultiplier = winAmount / betAmount;

    if (winMultiplier >= 30) { // Jackpot
        playSound("jackpot");
        return "jackpot";
    } else if (winMultiplier >= 20) { // Big win
        playSound("winCombo3");
        return "bigWin";
    } else if (winMultiplier >= 15) { // Medium win
        playSound("winCombo2");
        return "mediumWin";
    } else { // Small win
        playSound("winCombo1");
        return "smallWin";
    }
}

/* ------------------------------------------------------------
   TARGET CHECK
------------------------------------------------------------ */

let target = document.querySelector(".villager-data-info-wide .profanity-filter");
if (!target || !target.textContent.includes("testGameHere")) return;
target.innerHTML = "";

/* ------------------------------------------------------------
   USERNAME
------------------------------------------------------------ */

let username = document.querySelector(".widget .user-info h4 a")?.textContent.trim() || "Player";

/* ------------------------------------------------------------
   ICONS
------------------------------------------------------------ */

const icons = [
    {name:'Leaf', url:'https://www.furvilla.com/img/items/7/7630-crystal-leaf.png', value:10},
    {name:'Shell', url:'https://www.furvilla.com/img/items/7/7629-crystal-shell.png', value:15},
    {name:'Star', url:'https://www.furvilla.com/img/items/7/7628-crystal-star.png', value:15},
    {name:'Mustache', url:'https://www.furvilla.com/img/items/7/7631-crystal-mustache.png', value:20},
    {name:'BAR', url:'https://www.furvilla.com/img/items/8/8806-choco-bar-of-doom.png', value:25},
    {name:'7', url:'https://www.furvilla.com/img/items/5/5546-royal-coin.png', value:30},
    {name:'Bell', url:'https://www.furvilla.com/img/items/4/4272-cow-bell-peppers.png', value:20},
    {name:'Wild', url:'https://www.furvilla.com/img/items/7/7437-golden-horseshoe.png', value:'Substitute'},
    {name:'Scatter', url:'https://www.furvilla.com/img/items/8/8312-golden-fish-bones.png', value:'Free Spin'},
    {name:'Distraction', url:'https://www.furvilla.com/img/items/3/3953-the-wand-of-distraction.png', value:'Penalty'},
    {name:'Mousey', url:'https://www.furvilla.com/img/items/4/4670-spooky-scary-mousey-doll.png', value:'Bet Loss'}
];

// Distraction chance (same rarity as jackpot)
const DISTRACTION_CHANCE = 0.001;

// Mousey chance (1% chance)
const MOUSEY_CHANCE = 0.01;

/* ------------------------------------------------------------
   SENTENCES
------------------------------------------------------------ */

const sentences = [
"@name has kicked the slot machine.",
"@name has lost their life savings.",
"@name is getting dragged out by security.",
"@name got caught cheating.",
"@name almost had it all.",
"@name broke even.",
"@name isn't sleeping with the fishes tonight.",
"@name just needs one more spin, they swear...",
"@name has a gambling problem.",
"@name has a gambling solution.",
"@name dropped their last quarter.",
"@name joined the 1% of gamblers!",
"@name is having ice soup tonight.",
"@name has been promoted to homeless.",
"@name had to sell their cardboard box.",
"@name has the fake jackpot.",
"@name earned 1 million FD… in their dreams.",
"@name joins the VIP room.",
"@name wants that easy money.",
"@name managed to keep their rent money."
];

// Distraction specific messages
const distractionSentences = [
"@name got distracted and lost their winnings!",
"@name's winnings vanished into thin air!",
"@name blinked and missed their prize!",
"@name was too distracted to collect their coins!",
"@name's attention wandered and so did their money!",
"@name got bamboozled by the distraction wand!",
"@name looked away for a second and lost everything!",
"@name fell for the oldest trick in the book!",
"@name's victory turned into defeat!",
"@name learned a valuable lesson about gambling!"
];

// Mousey messages
const mouseySentences = [
"@name got spooked by mousey and lost their bet!",
"@name's coins were stolen by the mousey!",
"@name dropped their bet when they saw mousey!",
"@name was too scared to keep their coins!",
"@name's bet disappeared with a spooky giggle!",
"@name got tricked by the scary mousey!",
"@name's bet was sacrificed to the spooky spirits!",
"@name paid the spooky tax to mousey!",
"@name's coins were claimed by the mousey!",
"@name lost their nerves (and their bet) to mousey!"
];

/* ------------------------------------------------------------
   UI + HTML
------------------------------------------------------------ */

const wrapper = document.createElement("div");
wrapper.id = "slotWrapper";
wrapper.innerHTML = `
<style>
#slotWrapper { font-family: 'Trebuchet MS'; margin-top:20px; color:#3c2f2f; }
#slotContainer { width:480px; padding:15px; margin:auto; background:#fff; border:4px solid #a36cff; border-radius:10px; position:relative; }
#reelContainer { display:flex; justify-content:center; gap:10px; margin-bottom:10px; }
#reelContainer img { width:80px; height:80px; border:1px solid #ccc; border-radius:6px; transition:transform .2s; }
#buttonsContainer { text-align:center; margin-bottom:10px; }
button {
    margin:5px;
    padding:5px 12px;
    cursor:pointer;
    color: #000000 !important; /* Force black text */
    font-weight: bold;
}
button:hover {
    background:#b599ff;
    color: #000000 !important; /* Keep black text on hover */
}
#currencyDisplay { margin-bottom:10px; font-size:16px; }

#betAdjuster { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:10px; }
.bet-btn {
    width:30px;
    height:30px;
    border-radius:50%;
    border:none;
    background:#a36cff;
    color:#000000 !important; /* Force black text for bet buttons */
    font-weight:bold;
    cursor:pointer;
}
.bet-btn:hover {
    background:#8c5ce6;
    color:#000000 !important; /* Keep black text on hover */
}
.bet-btn:disabled {
    background:#ccc;
    cursor:not-allowed;
    color:#666666 !important; /* Dark gray for disabled */
}
#currentBet { font-size:18px; font-weight:bold; min-width:40px; text-align:center; }

#interactionLeaderboardWrapper { display:flex; gap:10px; margin-top:10px; }
#interactionLog { width:50%; height:180px; overflow-y:auto; font-size:12px; border:1px solid #a36cff; padding:6px; background:#f9f9f9; border-radius:6px; }
#leaderboardWrapper { width:50%; max-height:180px; overflow-y:hidden; border:1px solid #a36cff; background:#f9f9f9; border-radius:6px; }
#leaderboardTable { width:100%; border-collapse:collapse; }
#leaderboardTable th, #leaderboardTable td { border:1px solid #a36cff; padding:4px; }
#leaderboardTable th { background:#c9b3ff; }

#mascot { position:absolute; right:-20px; top:30px; width:140px; }
#mascotText { position:absolute; right:-20px; top:-20px; width:200px; background:#fff; border:2px solid #a36cff; padding:6px; border-radius:6px; opacity:1; transition:opacity 1s; }

.winning { animation:pulse 0.5s ease-in-out 3; }
.distraction { animation:shake 0.5s ease-in-out 3; }
.mousey { animation:spooky 0.5s ease-in-out 3; }
@keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.1); } }
@keyframes shake {
    0%,100% { transform:translateX(0); }
    25% { transform:translateX(-5px); }
    75% { transform:translateX(5px); }
}
@keyframes spooky {
    0%,100% { transform:scale(1) rotate(0deg); }
    25% { transform:scale(1.05) rotate(-2deg); }
    50% { transform:scale(1.1) rotate(2deg); }
    75% { transform:scale(1.05) rotate(-2deg); }
}
.distraction-text { color: #ff4444; font-weight: bold; }
.mousey-text { color: #8b4513; font-weight: bold; }
.warning-text { color: #ffaa00; font-weight: bold; font-size: 14px; margin-top: 5px; }
.sync-status {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 5px;
}
.sync-online { background: #d4edda; color: #155724; }
.sync-offline { background: #f8d7da; color: #721c24; }
.penalty-explanation {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
    border-left: 3px solid #ff4444;
    padding-left: 8px;
}
</style>

<div id="slotContainer">
    <div id="currencyDisplay"></div>

    <div id="betAdjuster">
        <button id="decreaseBet" class="bet-btn" title="Decrease bet">-</button>
        <div>Bet: <span id="currentBet">2</span> coins</div>
        <button id="increaseBet" class="bet-btn" title="Increase bet">+</button>
    </div>

    <div id="reelContainer"></div>

    <div id="buttonsContainer">
        <button id="spinBtn">Spin!</button>
        <button id="showTableBtn">Show Values</button>
        <button id="howToBtn">How to Play</button>
    </div>

    <table id="payoutTable" style="display:none;width:100%;border-collapse:collapse;">
        <tr><th>Icon</th><th>Value</th></tr>
        ${icons.map(x=>`<tr><td><img src="${x.url}" style="width:32px;height:32px;"> ${x.name}</td><td>${x.value}</td></tr>`).join("")}
    </table>

    <div id="warningText" class="warning-text" style="display:none;">
        ⚠️ Watch out for penalties! Distraction steals winnings, Mousey steals your bet!
    </div>

    <div id="interactionLeaderboardWrapper">
        <div id="interactionLog"></div>
        <div id="leaderboardWrapper">
            <table id="leaderboardTable">
                <tr><th>Player</th><th>Coins</th></tr>
            </table>
        </div>
    </div>

    <img id="mascot" src="https://www.furvilla.com/img/villagers/0/560-10.png">
    <div id="mascotText">Starr: Ready to spin!</div>
</div>
`;

target.appendChild(wrapper);

/* ------------------------------------------------------------
   DOM REFS
------------------------------------------------------------ */

const currencyDisplay = document.getElementById("currencyDisplay");
const rollContainer = document.getElementById("reelContainer");
const spinBtn = document.getElementById("spinBtn");
const showTableBtn = document.getElementById("showTableBtn");
const howToBtn = document.getElementById("howToBtn");
const payoutTable = document.getElementById("payoutTable");
const interactionLog = document.getElementById("interactionLog");
const leaderboardTable = document.getElementById("leaderboardTable");
const mascot = document.getElementById("mascot");
const mascotText = document.getElementById("mascotText");
const decreaseBetBtn = document.getElementById("decreaseBet");
const increaseBetBtn = document.getElementById("increaseBet");
const currentBetDisplay = document.getElementById("currentBet");
const warningText = document.getElementById("warningText");

/* ------------------------------------------------------------
   HELPER
------------------------------------------------------------ */

function updateCurrencyDisplay() {
    let syncStatus = '';
    if (typeof GM_getValue !== 'undefined') {
        syncStatus = googleSheetsEnabled ?
            '<span class="sync-status sync-online">✓ Online</span>' :
            '<span class="sync-status sync-offline">✗ Offline</span>';
    }

    currencyDisplay.innerHTML =
      `<img src="https://www.furvilla.com/img/furcoins.gif" style="width:24px;height:24px;">
       Coins: ${currency}${freeSpins>0?" | Free Spins: "+freeSpins:""}${syncStatus}`;
}

function updateBetButtons() {
    decreaseBetBtn.disabled = currentBet <= 2;
    increaseBetBtn.disabled = currentBet >= 10;
    currentBetDisplay.textContent = currentBet;
}

function mascotSay(msg, isDistraction = false, isMousey = false) {
    let className = "";
    if (isDistraction) className = "distraction-text";
    if (isMousey) className = "mousey-text";

    mascotText.innerHTML = className ? `<span class="${className}">${msg}</span>` : msg;
    mascotText.style.opacity = 1;
    void mascot.offsetWidth;
    mascot.classList.add("bounce");
    setTimeout(()=>{ mascotText.style.opacity = 0; }, 4000);
}

function updateInteractionDisplay() {
    const allMessages = Array.from(latestMessages.entries())
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort by username
        .map(([user, message]) => message);

    interactionLog.innerHTML = allMessages.slice(-20).reverse().join("<br>");
}

/* ------------------------------------------------------------
  FETCH CSV
------------------------------------------------------------ */

async function fetchCSV(url){
    try {
        const res = await fetch(url + "&t=" + Date.now());
        const text = await res.text();

        let cleanedText = text
            .replace(/["']/g, '')
            .replace(/\r\n/g, '\n')
            .replace(/\n+/g, '\n')
            .trim();

        // Parse
        const rows = cleanedText.split("\n").map(line => {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            result.push(current.trim());
            return result;
        });

        return rows;
    } catch (error) {
        console.error("Error fetching CSV:", error);
        throw error;
    }
}

/* ------------------------------------------------------------
   SAVE CURRENCY TO GOOGLE SHEET
------------------------------------------------------------ */

function saveCurrencyToGoogleSheet() {
    if (currency === null || !googleSheetsEnabled) return;

    const formData = {
        "entry.289837257": new Date().toISOString(),
        "entry.1173438510": username,
        "entry.716649220": currency.toString()
    };

    const formBody = Object.keys(formData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]))
        .join('&');

    if (typeof GM_xmlhttpRequest !== 'undefined') {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSd091h3RyjyQZQBehIW8z1AiXaqek2FKwrKOGrbezqLhP-d6Q/formResponse",
            data: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    googleSheetsEnabled = true;
                    if (typeof GM_setValue !== 'undefined') {
                        GM_setValue('googleSheetsEnabled', true);
                    }
                } else {
                    console.log("Google Sheets sync failed with status:", response.status);
                    googleSheetsEnabled = false;
                    if (typeof GM_setValue !== 'undefined') {
                        GM_setValue('googleSheetsEnabled', false);
                    }
                }
            },
            onerror: function(error) {
                console.log("Google Sheets sync error:", error);
                googleSheetsEnabled = false;
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue('googleSheetsEnabled', false);
                }
            }
        });
    } else {
        try {
            fetch("https://docs.google.com/forms/d/e/1FAIpQLSd091h3RyjyQZQBehIW8z1AiXaqek2FKwrKOGrbezqLhP-d6Q/formResponse", {
                method: 'POST',
                body: formBody,
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(error => {
                console.log("Google Sheets sync failed (fetch):", error);
                googleSheetsEnabled = false;
            });
        } catch (error) {
            console.log("Google Sheets sync failed (try-catch):", error);
            googleSheetsEnabled = false;
        }
    }
}

/* ------------------------------------------------------------
   SAVE INTERACTION TO GOOGLE SHEET
------------------------------------------------------------ */

function saveInteractionToGoogleSheet(message) {
    if (!googleSheetsEnabled) return;

    const formData = {
        "entry.1819163830": username,
        "entry.375531238": message
    };

    const formBody = Object.keys(formData)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]))
        .join('&');

    if (typeof GM_xmlhttpRequest !== 'undefined') {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSd8pgQaVrk3Bu6VVVK5rr1MwS5LYopZZTd5cpgYgFhH9uzVlA/formResponse",
            data: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onerror: function(error) {
                console.log("Interaction sync error:", error);
            }
        });
    } else {
        try {
            navigator.sendBeacon(
                "https://docs.google.com/forms/d/e/1FAIpQLSd8pgQaVrk3Bu6VVVK5rr1MwS5LYopZZTd5cpgYgFhH9uzVlA/formResponse",
                formBody
            );
        } catch (error) {
            console.log("Interaction sync failed:", error);
        }
    }
}

/* ------------------------------------------------------------
   LOAD INTERACTIONS
------------------------------------------------------------ */

async function loadInteractionsCSV() {
    try {
        const rows = await fetchCSV(INTERACTIONS_CSV_URL);

        latestMessages.clear();

        for (let i = rows.length - 1; i >= 0; i--) {
            if (i === 0) continue;

            const row = rows[i];
            const user = row[1]?.trim();
            const msg = row[2]?.trim();

            if (!user || !msg) continue;

            if (!latestMessages.has(user)) {
                const formattedMsg = formatInteraction(user, msg);
                latestMessages.set(user, formattedMsg);
            }
        }

        updateInteractionDisplay();
    } catch (error) {
        console.error("Error loading interactions:", error);
    }
}

/* ------------------------------------------------------------
   LOAD LEADERBOARD
------------------------------------------------------------ */

async function loadLeaderboardCSV(){
    try {
        const rows = await fetchCSV(LEADERBOARD_CSV_URL);
        const highest = {};

        rows.forEach((row,i)=>{
            if(i===0) return; // Skip header row

            const user = row[2]?.trim();
            const coins = parseInt(row[3], 10);

            if(!user || user === "" || isNaN(coins)) {
                return;
            }

            if(!highest[user] || coins > highest[user])
                highest[user] = coins;
        });

        const serverVal = highest[username];

        // FIX: Always update from server to get other players' scores
        if (currency === null) {
            // First time loading - use server value or 100 if new player
            currency = serverVal || 100;
        } else {

            if (serverVal && serverVal > currency) {
                currency = serverVal;
            }
        }

        Object.keys(leaderboardCache).forEach(key => delete leaderboardCache[key]);

        for(const [user, coins] of Object.entries(highest)){
            leaderboardCache[user] = coins;
        }


        leaderboardCache[username] = currency;

        updateCurrencyDisplay();
        updateLeaderboard();

    } catch (error) {
        console.error("Error loading leaderboard:", error);

        if (currency === null) {
            let savedCurrency;
            if (typeof GM_getValue !== 'undefined') {
                savedCurrency = GM_getValue(`slot_currency_${username}`);
            } else {
                savedCurrency = localStorage.getItem(`slot_currency_${username}`);
            }
            currency = savedCurrency ? parseInt(savedCurrency, 10) : 100;
            updateCurrencyDisplay();
        }
    }
}

/* ------------------------------------------------------------
   SAVE CURRENCY TO STORAGE backup
------------------------------------------------------------ */

function saveCurrencyToStorage() {
    if (currency !== null) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(`slot_currency_${username}`, currency);
        } else {
            localStorage.setItem(`slot_currency_${username}`, currency.toString());
        }
    }
}

/* ------------------------------------------------------------
   LEADERBOARD
------------------------------------------------------------ */

function updateLeaderboard(){
    leaderboardTable.innerHTML = `<tr><th>Player</th><th>Coins</th></tr>`;

    const allUsers = Object.entries(leaderboardCache);

    // Sort by coins (highest first)
    const sorted = allUsers.sort((a,b)=>b[1]-a[1]);

    // Limit to top 10 for display
    const top10 = sorted.slice(0, 10);

    top10.forEach(([user,val])=>{
        const tr = document.createElement("tr");

        // Highlight current user
        if (user === username) {
            tr.style.backgroundColor = "#e6e6ff";
            tr.style.fontWeight = "bold";
        }

        tr.innerHTML = `<td>${user}</td><td>${val}</td>`;
        leaderboardTable.appendChild(tr);
    });

    // Show total players count
    if (allUsers.length > 10) {
        const infoRow = document.createElement("tr");
        infoRow.innerHTML = `<td colspan="2" style="text-align:center;font-size:11px;color:#666;">
            Showing top 10 of ${allUsers.length} players
        </td>`;
        leaderboardTable.appendChild(infoRow);
    }
}

/* ------------------------------------------------------------
   MACHINE
------------------------------------------------------------ */

const reels = [];
for(let i=0;i<3;i++){
    const img = document.createElement("img");
    img.src = icons[Math.floor(Math.random()*icons.length)].url;
    rollContainer.appendChild(img);
    reels.push(img);
}

function isWin(arr){
    const names = arr.map(x=>x.name);
    if(names[0]===names[1] && names[1]===names[2]) return true;
    if(names.includes("Wild")) return true;
    return false;
}

function getWinAmount(arr, bet){
    const wilds = arr.filter(x=>x.name==="Wild").length;
    const base = arr[1].value || arr[0].value || 10;
    return (typeof base === "number" ? base : 20) * bet + wilds * 10;
}

// Check triggers
function checkDistraction() {
    return Math.random() < DISTRACTION_CHANCE;
}

function checkMousey() {
    return Math.random() < MOUSEY_CHANCE;
}

// Get random distraction
function getDistractionIcon() {
    return icons.find(icon => icon.name === "Distraction");
}

// Get random mousey
function getMouseyIcon() {
    return icons.find(icon => icon.name === "Mousey");
}

function spinReel(reel, dur, isDistractionSpin = false, isMouseySpin = false){
    return new Promise(resolve=>{
        const start = Date.now();
        const timer = setInterval(()=>{
            // During distraction spin, show distraction icon more frequently
            if (isDistractionSpin && Math.random() < 0.3) {
                reel.src = "https://www.furvilla.com/img/items/3/3953-the-wand-of-distraction.png";
            }
            // During mousey spin, show mousey icon more frequently
            else if (isMouseySpin && Math.random() < 0.3) {
                reel.src = "https://www.furvilla.com/img/items/4/4670-spooky-scary-mousey-doll.png";
            }
            else {
                reel.src = icons[Math.floor(Math.random()*icons.length)].url;
            }
            if(Date.now()-start >= dur){
                clearInterval(timer);
                let final;
                if (isDistractionSpin) {
                    final = getDistractionIcon();
                } else if (isMouseySpin) {
                    final = getMouseyIcon();
                } else {
                    final = icons[Math.floor(Math.random()*icons.length)];
                }
                reel.src = final.url;
                resolve(final);
            }
        },80);
    });
}

/* ------------------------------------------------------------
   BET ADJUSTMENT
------------------------------------------------------------ */

decreaseBetBtn.addEventListener("click", () => {
    if (currentBet > 2) {
        currentBet -= 2;
        updateBetButtons();
        mascotSay(`Starr: Bet decreased to ${currentBet} coins!`);
    }
});

increaseBetBtn.addEventListener("click", () => {
    if (currentBet < 10) {
        currentBet += 2;
        updateBetButtons();
        mascotSay(`Starr: Bet increased to ${currentBet} coins!`);
    }
});

/* ------------------------------------------------------------
   SPIN
------------------------------------------------------------ */

spinBtn.addEventListener("click", async () => {
    if (currency <= 0 && freeSpins <= 0) {
        mascotSay("Starr: Not enough coins!");
        return;
    }

    if (currentBet > currency && freeSpins <= 0) {
        mascotSay(`Starr: You need ${currentBet} coins to spin!`);
        return;
    }

    spinBtn.disabled = true;

    if (freeSpins > 0) {
        freeSpins--;
        mascotSay(`Starr: Using a free spin! (${freeSpins} remaining)`);
    } else {
        currency -= currentBet;
        mascotSay(`Starr: Betting ${currentBet} coins!`);
    }

    updateCurrencyDisplay();
    saveCurrencyToStorage();

    saveCurrencyToGoogleSheet();

    // Check for penalties BEFORE the spin
    const distractionTriggered = checkDistraction();
    const mouseyTriggered = checkMousey();
    let isDistractionSpin = false;
    let isMouseySpin = false;

    if (distractionTriggered) {
        isDistractionSpin = true;
        warningText.style.display = "block";
        setTimeout(() => {
            warningText.style.display = "none";
        }, 5000);
    } else if (mouseyTriggered) {
        isMouseySpin = true;
        warningText.style.display = "block";
        setTimeout(() => {
            warningText.style.display = "none";
        }, 5000);
    }

    const finals = [];
    for (let i = 0; i < 3; i++) {
        finals[i] = await spinReel(reels[i], 1000 + i * 350, isDistractionSpin, isMouseySpin);
    }

    // Check for scatter (free spin)
    const scatterCount = finals.filter(x => x.name === "Scatter").length;
    let freeSpinSoundPlayed = false;

    if (scatterCount > 0) {
        freeSpins += scatterCount * 2;
        mascotSay(`Starr: ${scatterCount} scatter(s)! +${scatterCount * 2} free spins!`);

        // Play free spin sound
        if (!freeSpinSoundPlayed) {
            playSound("winCombo1");
            freeSpinSoundPlayed = true;
        }
    }

    if (isDistractionSpin) {
        reels.forEach(reel => reel.classList.add("distraction"));

        const wouldHaveWon = isWin(finals) ? getWinAmount(finals, currentBet) : 0;

        if (wouldHaveWon > 0) {
            const lossAmount = wouldHaveWon;
            currency -= lossAmount; // Subtract the win amount
            mascotSay(`Starr: DISTRACTION! You would have won ${lossAmount} coins, but the wand stole them!`, true, false);

            const distractionMsg = distractionSentences[Math.floor(Math.random() * distractionSentences.length)].replace("@name", username);
            const entry = formatInteraction(username, distractionMsg);
            latestMessages.set(username, entry);
            updateInteractionDisplay();

            saveInteractionToGoogleSheet(distractionMsg);
        } else {
            mascotSay(`Starr: DISTRACTION! The wand tried to steal your coins, but you didn't win anything!`, true, false);
        }

        setTimeout(() => {
            reels.forEach(reel => reel.classList.remove("distraction"));
        }, 1500);

    }
    else if (isMouseySpin) {
        reels.forEach(reel => reel.classList.add("mousey"));

        mascotSay(`Starr: MOUSEY! The spooky doll stole your ${currentBet} coin bet!`, false, true);

        const mouseyMsg = mouseySentences[Math.floor(Math.random() * mouseySentences.length)].replace("@name", username);
        const entry = formatInteraction(username, mouseyMsg);
        latestMessages.set(username, entry);
        updateInteractionDisplay();

        saveInteractionToGoogleSheet(mouseyMsg);

        setTimeout(() => {
            reels.forEach(reel => reel.classList.remove("mousey"));
        }, 1500);

    }
    // Normal win check
    else if (isWin(finals)) {
        const win = getWinAmount(finals, currentBet);
        currency += win;

        const soundType = playWinSound(win, currentBet);

        if (soundType === "jackpot") {
            reels.forEach(reel => reel.classList.add("winning"));
            setTimeout(() => {
                reels.forEach(reel => reel.classList.remove("winning"));
            }, 1500);
        }

        mascotSay(`Starr: You won ${win} coins!`);
    } else if (scatterCount === 0) {
        mascotSay("Starr: No win this time.");
    }

    leaderboardCache[username] = currency;
    updateCurrencyDisplay();
    updateLeaderboard();

    saveCurrencyToStorage();

    saveCurrencyToGoogleSheet();

    if (Math.random() < 0.05 && !isDistractionSpin && !isMouseySpin) {
        const msg = sentences[Math.floor(Math.random() * sentences.length)].replace("@name", username);
        const entry = formatInteraction(username, msg);

        latestMessages.set(username, entry);

        updateInteractionDisplay();

        saveInteractionToGoogleSheet(msg);
    }

    spinBtn.disabled = false;
});

showTableBtn.addEventListener("click", ()=>{
    payoutTable.style.display = payoutTable.style.display==="none" ? "table" : "none";
    mascotSay("Starr: These are the values! Watch out for the Distraction wand and Mousey doll!");
});
howToBtn.addEventListener("click", ()=>{
    mascotSay("Starr: Match 3 icons to win! Wild counts as anything. Use +/- to adjust bet! Beware the Distraction wand and Mousey doll!");
});


/* ------------------------------------------------------------
   INITIAL
------------------------------------------------------------ */

let savedCurrency;
if (typeof GM_getValue !== 'undefined') {
    savedCurrency = GM_getValue(`slot_currency_${username}`);
    googleSheetsEnabled = GM_getValue('googleSheetsEnabled', true);
} else {
    savedCurrency = localStorage.getItem(`slot_currency_${username}`);
}
if (savedCurrency) {
    currency = parseInt(savedCurrency, 10);
}

preloadSounds();

updateCurrencyDisplay();
updateBetButtons();
updateLeaderboard();

loadLeaderboardCSV().then(() => {
    setTimeout(() => {
        saveCurrencyToGoogleSheet();
    }, 2000);
});

loadInteractionsCSV();

setTimeout(() => {
    warningText.style.display = "block";
    setTimeout(() => {
        warningText.style.display = "none";
    }, 10000);
}, 5000);

setInterval(saveCurrencyToStorage, 30000);

setInterval(()=>{
    loadLeaderboardCSV();
    loadInteractionsCSV();
}, 15000); // 15 seconds

})();