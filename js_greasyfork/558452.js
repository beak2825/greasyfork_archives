// ==UserScript==
// @name         FV - Starr Slots Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      8.2
// @description  Slot machine with Starr. Earn fake currency and climb the leaderboard!
// @author       necroam
// @match        https://www.furvilla.com/villager/339348
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558452/FV%20-%20Starr%20Slots%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558452/FV%20-%20Starr%20Slots%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ICONS ---
    const icons = [
        {name: 'Leaf', url: 'https://www.furvilla.com/img/items/7/7630-crystal-leaf.png', value: 10},
        {name: 'Shell', url: 'https://www.furvilla.com/img/items/7/7629-crystal-shell.png', value: 15},
        {name: 'Star', url: 'https://www.furvilla.com/img/items/7/7628-crystal-star.png', value: 15},
        {name: 'Mustache', url: 'https://www.furvilla.com/img/items/7/7631-crystal-mustache.png', value: 20},
        {name: 'BAR', url: 'https://www.furvilla.com/img/items/8/8806-choco-bar-of-doom.png', value: 25},
        {name: '7', url: 'https://www.furvilla.com/img/items/5/5546-royal-coin.png', value: 30},
        {name: 'Bell', url: 'https://www.furvilla.com/img/items/4/4272-cow-bell-peppers.png', value: 20},
        {name: 'Wild', url: 'https://www.furvilla.com/img/items/7/7437-golden-horseshoe.png', value: 'Substitute'},
        {name: 'Scatter', url: 'https://www.furvilla.com/img/items/8/8312-golden-fish-bones.png', value: 'Free Spin'}
    ];

    // --- RANDOM SENTENCES ---
    const sentences = [
        "@name has kicked the slot machine.",
        "@name has lost their life savings.",
        "@name is getting dragged out by security.",
        "@name got caught cheating.",
        "@name doesn't know what they'll tell the missus.",
        "@name almost had it all.... and then there was no third 7.",
        "@name broke even.",
        "@name isn't sleeping with the fishes tonight.",
        "@name just needs one more spin, they swear...",
        "@name has a gambling problem.",
        "@name has a gambling solution.",
        "@name dropped their last quarter.",
        "@name didn't win a new pair of shoes, but the same old pair they already had.",
        "@name joined the 1% of gamblers!",
        "@name is having ice soup tonight.",
        "@name has been promoted to homeless.",
        "@name had to sell their cardboard box",
        "@name has the (fake) jackpot.",
        "@name has earned 1 million FD... in their dreams.",
        "@name thinks these slots are dumb.",
        "@name joins the VIP room.",
        "@name wants that easy money",
        "@name managed to keep their rent money."
    ];

    // --- STATE ---
    let currency = 100;
    let freeSpins = 0;
    const interactionCache = [];
    const leaderboardCache = {};

    // --- TARGET ELEMENT ---
    let target = document.querySelector(".villager-data-info-wide .profanity-filter");
    if (!target || !target.textContent.includes("testGameHere")) return;
    target.innerHTML = "";

    // --- USERNAME ---
    let username = document.querySelector(".widget .user-info h4 a")?.textContent.trim() || "Player";

    // --- AUDIO ---
    const winSound = new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3");
    const loseSound = new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo3.mp3");

    // --- WRAPPER HTML ---
    const wrapper = document.createElement("div");
    wrapper.id = "slotWrapper";
    wrapper.innerHTML = `
<style>
#slotWrapper { font-family: 'Trebuchet MS', sans-serif; margin-top: 20px; color: #3c2f2f; }
#slotContainer { position: relative; width: 480px; padding: 15px; background: #ffffff; border: 4px solid #a36cff; border-radius: 10px; margin: 0 auto; }
#reelContainer { display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
#reelContainer img { width: 80px; height: 80px; border: 1px solid #ccc; border-radius: 6px; transition: transform 0.2s; }
#buttonsContainer { text-align: center; margin-bottom: 10px; }
button { padding: 5px 12px; margin: 5px; cursor: pointer; margin-top: 10px; gap: 6px; color:black !important; }
button:hover { background: #b599ff; }
#payoutTable { width: 100%; border-collapse: collapse; margin-top: 10px; display: none; }
#payoutTable th, #payoutTable td { border: 1px solid #a36cff; padding: 4px; text-align: left; }
#payoutTable th { background: #c9b3ff; }

#interactionLeaderboardWrapper { display: flex; gap: 10px; margin-top: 10px; }
#interactionLog { width: 50%; height: 180px; overflow-y: auto; border: 1px solid #a36cff; border-radius: 6px; padding: 6px; background: #f9f9f9; font-size: 12px; }
#leaderboardWrapper { width: 50%; max-height: 180px; border: 1px solid #a36cff; border-radius: 6px; background: #f9f9f9; overflow-y: hidden; }
#leaderboardTable { width: 100%; border-collapse: collapse; }
#leaderboardTable th, #leaderboardTable td { border: 1px solid #a36cff; padding: 4px; text-align: left; }
#leaderboardTable th { background: #c9b3ff; position: sticky; top: 0; }

#mascot { position: absolute; right: -20px; top: 30px; width: 140px; }
#mascotText { position: absolute; right: -20px; top: -20px; width: 200px; background: #fff; border: 2px solid #a36cff; border-radius: 6px; padding: 6px; opacity: 1; transition: opacity 1s; }

@keyframes bounce { 0%, 60%, 100% {transform: translateY(0);} 30% {transform: translateY(-12px);} }
.bounce { animation: bounce 0.6s ease; }
.win-glow { animation: glow 0.8s ease forwards; }
@keyframes glow { 0% { box-shadow: 0 0 0px #ffd700; } 50% { box-shadow: 0 0 15px #ffd700; } 100% { box-shadow: 0 0 0px #ffd700; } }
#currencyDisplay { margin-bottom: 10px; font-size: 16px; }
</style>

<div id="slotContainer">
    <div id="currencyDisplay"></div>
    <div id="reelContainer"></div>
    <div id="buttonsContainer">
        <button id="spinBtn">Spin!</button>
        <button id="showTableBtn">Show Values</button>
        <button id="howToBtn">How to Play</button>
    </div>
    <table id="payoutTable">
        <tr><th>Icon</th><th>Value</th></tr>
        ${icons.map(icon => `<tr><td><img src="${icon.url}" style="width:32px;height:32px;"> ${icon.name}</td><td>${icon.value}</td></tr>`).join('')}
    </table>

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

    // --- DOM REFERENCES ---
    const currencyDisplay = document.getElementById("currencyDisplay");
    const reelContainer = document.getElementById("reelContainer");
    const spinBtn = document.getElementById("spinBtn");
    const showTableBtn = document.getElementById("showTableBtn");
    const howToBtn = document.getElementById("howToBtn");
    const mascotText = document.getElementById("mascotText");
    const mascot = document.getElementById("mascot");
    const payoutTable = document.getElementById("payoutTable");
    const leaderboardTable = document.getElementById("leaderboardTable");
    const interactionLog = document.getElementById("interactionLog");
    const leaderboardWrapper = document.getElementById("leaderboardWrapper");

    // --- HELPER FUNCTIONS ---
    function updateCurrencyDisplay() {
        currencyDisplay.innerHTML = `<img src="https://www.furvilla.com/img/furcoins.gif" style="width:24px;height:24px;"> Coins: ${currency}${freeSpins>0?` | Free Spins: ${freeSpins}`:""}`;
    }

    function mascotSay(msg) {
        mascotText.innerText = msg;
        mascotText.style.opacity = 1;
        mascot.classList.remove("bounce");
        void mascot.offsetWidth;
        mascot.classList.add("bounce");
        setTimeout(() => { mascotText.style.opacity = 0; }, 4000);
    }

    function logInteraction(msg) {
    interactionCache.push(msg);
    // Keep only the latest 30 messages
    if (interactionCache.length > 30) interactionCache.shift();
    interactionLog.innerHTML = interactionCache.slice().reverse().join("<br>");
    // Auto-scroll to bottom
    interactionLog.scrollTop = interactionLog.scrollHeight;
}

    function updateLeaderboard() {
        leaderboardTable.innerHTML = "<tr><th>Player</th><th>Coins</th></tr>";
        const sorted = Object.entries(leaderboardCache).sort((a,b)=>b[1]-a[1]);
        sorted.forEach(([user,coins])=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${user}</td><td>${coins}</td>`;
            leaderboardTable.appendChild(tr);
        });
        // Scroll if more than 5 players
        if(sorted.length>5){
            const rowHeight = leaderboardTable.querySelector("tr:nth-child(2)")?.offsetHeight || 20;
            leaderboardWrapper.style.maxHeight = (rowHeight*5) + "px";
            leaderboardWrapper.style.overflowY = "auto";
        } else {
            leaderboardWrapper.style.overflowY = "hidden";
        }
    }

    // --- FETCH CSV DATA ---
    // --- FETCH CSV DATA ---
async function fetchCSV(url) {
    const res = await fetch(url);
    const text = await res.text();
    return text.split("\n").map(line => line.split(","));
}

async function loadLeaderboardCSV() {
    const data = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vT-vFZEmeQkY9tEKARH8trFmO3yOjVAiDLX5Rrrbsoj5bgDPxc7tBltZG2RSNDPBrWImeEiOWtEcX/pub?gid=1042339950&single=true&output=csv");
    data.forEach((row,index)=>{
        if(index===0) return;
        const user = row[1]?.trim();
        const coins = parseInt(row[2],10);
        if(!user || isNaN(coins)) return;
        leaderboardCache[user] = coins;
        if(user===username) currency = coins;
    });
    updateCurrencyDisplay();
    updateLeaderboard();
}

async function loadInteractionsCSV() {
    const data = await fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSEB__jn-S8jQtcm0oSAZcGwKicdhvwi5ysNwcb8vh8GKqDbi-Y_sQvV76fZwFEdIdFzMkbub8FmlUQ/pub?gid=178327147&single=true&output=csv");
    const tempCache = [];
    data.forEach((row,index)=>{
        if(index===0) return;
        const user = row[1]?.trim();
        const message = row[2]?.trim();
        if(!user || !message) return;
        tempCache.push(`<b>${user}</b> ${message}`);
    });
    // Keep only latest 30 messages globally
    interactionCache.length = 0;
    interactionCache.push(...tempCache.slice(-30));
    interactionLog.innerHTML = interactionCache.reverse().join("<br>");
    interactionLog.scrollTop = interactionLog.scrollHeight;
}

    // --- SPIN LOGIC ---
    const reels = [];
    for(let i=0;i<3;i++){
        const r = document.createElement("img");
        r.src = icons[Math.floor(Math.random()*icons.length)].url;
        reelContainer.appendChild(r);
        reels.push(r);
    }

    function isWin(finalIcons){
        const names = finalIcons.map(i=>i.name);
        if(names[0]===names[1] && names[1]===names[2]) return true;
        if(names.includes('Wild')) return true;
        return false;
    }

    function getWinAmount(finalIcons){
        const wildBonus = finalIcons.filter(i=>i.name==='Wild').length*10;
        let winIcon = finalIcons[0];
        if(finalIcons[1].name===finalIcons[2].name) winIcon=finalIcons[1];
        let value = (typeof winIcon.value==='number')? winIcon.value:20;
        return value + wildBonus;
    }

    function spinReel(reel, duration){
        return new Promise(resolve=>{
            const start = Date.now();
            const interval = setInterval(()=>{
                const rand = icons[Math.floor(Math.random()*icons.length)];
                reel.src = rand.url;
                reel.style.transform = `rotate(${Math.random()*30-15}deg)`;
                if(Date.now()-start>=duration){
                    clearInterval(interval);
                    const finalIcon = icons[Math.floor(Math.random()*icons.length)];
                    reel.src = finalIcon.url;
                    reel.style.transform = "rotate(0deg)";
                    resolve(finalIcon);
                }
            },80);
        });
    }

    spinBtn.addEventListener("click", async () => {
        if(currency <=0 && freeSpins<=0){
            mascotSay("Starr: You don't have enough coins to spin!");
            loseSound.play();
            return;
        }
        spinBtn.disabled = true;
        if(freeSpins>0){ freeSpins--; mascotSay("Starr: Using a free spin!"); }
        else currency-=1;

        const finalIcons=[];
        for(let i=0;i<reels.length;i++){
            finalIcons[i] = await spinReel(reels[i], 1000+i*400);
        }

        const won = isWin(finalIcons);
        if(won){
            const amount = getWinAmount(finalIcons);
            currency += amount;
            mascotSay(`Starr: You won ${amount} coins!`);
            finalIcons.forEach((icon,i)=>{
                reels[i].classList.add("win-glow");
                setTimeout(()=> reels[i].classList.remove("win-glow"),800);
            });
            winSound.play();
        } else {
            mascotSay("Starr: No match this time.");
            loseSound.play();
        }

        // Random sentence chance 50%
        if(Math.random()<0.5){
            const sentence = sentences[Math.floor(Math.random()*sentences.length)].replace("@name", username);
            const interaction = `<b>${username}</b> ${sentence}`;
            interactionCache.push(interaction);
            interactionLog.innerHTML = interactionCache.slice(-30).reverse().join("<br>");
            navigator.sendBeacon("https://docs.google.com/forms/d/e/1FAIpQLSd8pgQaVrk3Bu6VVVK5rr1MwS5LYopZZTd5cpgYgFhH9uzVlA/formResponse", new URLSearchParams({
                "entry.1819163830": username,
                "entry.375531238": sentence
            }));
        }

        leaderboardCache[username]=currency;
        updateCurrencyDisplay();
        updateLeaderboard();

        navigator.sendBeacon("https://docs.google.com/forms/d/e/1FAIpQLSd091h3RyjyQZQBehIW8z1AiXaqek2FKwrKOGrbezqLhP-d6Q/formResponse", new URLSearchParams({
            "entry.1173438510": username,
            "entry.716649220": currency
        }));

        spinBtn.disabled = false;
    });

    showTableBtn.addEventListener('click', ()=>{ payoutTable.style.display = payoutTable.style.display==='none'?'table':'none'; mascotSay("Starr: These are the values!"); });
    howToBtn.addEventListener('click', ()=>{ mascotSay("Starr: Click Spin! Match 3 icons to win coins. Wild counts as any icon. Scatters give free spins!"); });

    // --- INITIAL LOAD ---
    loadLeaderboardCSV();
    loadInteractionsCSV();

    setInterval(()=>{ loadLeaderboardCSV(); loadInteractionsCSV(); }, 30000);

    updateCurrencyDisplay();
})();
