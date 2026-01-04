// ==UserScript==
// @name         Cookie Clicker Ultimate
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Fully optimized Cookie Clicker bot: auto everything, give cookies & heavenly chips, logging, ultra low lag
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556556/Cookie%20Clicker%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/556556/Cookie%20Clicker%20Ultimate.meta.js
// ==/UserScript==

/*
 * Cookie Clicker Ultimate
 * Copyright (c) 2025 Seal. All Rights Reserved.
 * 
 * You may **use this script as-is** for personal use.
 * Modification, redistribution, or commercial use is prohibited.
 */


(function() {
    'use strict';

    if (!window.Game) {
        console.log("Waiting for Cookie Clicker to load...");
        const interval = setInterval(() => {
            if (window.Game && Game.ready) {
                clearInterval(interval);
                initCheat();
            }
        }, 1000);
    } else {
        initCheat();
    }

    function initCheat() {
        console.log("Cookie Clicker Ultimate God Mode loaded!");

        /********** UI SETUP **********/
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            top: 50px;
            right: 50px;
            width: 380px;
            max-height: 90%;
            overflow-y: auto;
            padding: 16px;
            background: rgba(20,20,25,0.92);
            backdrop-filter: blur(10px);
            border-radius: 18px;
            color: white;
            font-family: 'Segoe UI', sans-serif;
            z-index: 9999999;
            box-shadow: 0 0 35px rgba(0,0,0,0.7);
        `;

        panel.innerHTML = `
            <h2 style="margin-top:0; text-align:center; color:#f2c94c;">Cookie Ultimate God Mode</h2>
            <details open style="margin-bottom:8px;"><summary style="cursor:pointer;">Automation</summary>
                <label><input type="checkbox" id="autoClick"> Auto Click Cookie</label><br>
                <label><input type="checkbox" id="autoBuyBuildings"> Auto Buy Buildings</label><br>
                <label><input type="checkbox" id="autoBuyUpgrades"> Auto Buy Upgrades</label><br>
                <label><input type="checkbox" id="autoGolden"> Auto Click Golden Cookie</label><br>
                <label><input type="checkbox" id="autoAscend"> Auto Ascend</label><br>
                <label><input type="checkbox" id="autoFrenzy"> Auto Boost in Frenzy</label><br>
                <label><input type="checkbox" id="autoSeason"> Auto Seasonal Cookies</label><br>
                <label><input type="checkbox" id="autoHeavenly"> Auto Spend Heavenly Chips</label><br>
                <label><input type="checkbox" id="autoAchievements"> Auto Unlock Achievements</label><br>
            </details>
            <details style="margin-bottom:8px;"><summary style="cursor:pointer;">God Mode / Cheats</summary>
                <input type="number" id="giveAmount" placeholder="Amount of cookies" style="width:140px; padding:4px; margin-bottom:4px;">
                <button id="giveCookies" style="padding:6px; margin-left:4px; border:none; border-radius:8px; background:#9f7bff; color:white; cursor:pointer;">Add Cookies</button><br>
                <input type="number" id="giveHeavenly" placeholder="Heavenly Chips" style="width:140px; padding:4px; margin-top:4px;">
                <button id="addHeavenly" style="padding:6px; margin-left:4px; border:none; border-radius:8px; background:#7bbfff; color:white; cursor:pointer;">Add Heavenly Chips</button><br>
                <button id="unlockAllUpgrades" style="padding:6px; margin-top:4px; width:100%; border:none; border-radius:8px; background:#ff7b7b; color:white; cursor:pointer;">Unlock All Upgrades</button>
                <button id="unlockAllBuildings" style="padding:6px; margin-top:4px; width:100%; border:none; border-radius:8px; background:#7bff7b; color:black; cursor:pointer;">Max All Buildings</button>
                <button id="setClickMultiplier" style="padding:6px; margin-top:4px; width:100%; border:none; border-radius:8px; background:#ffcc00; color:black; cursor:pointer;">Set Click Multiplier</button>
                <button id="resetGame" style="padding:6px; margin-top:4px; width:100%; border:none; border-radius:8px; background:#ff9900; color:black; cursor:pointer;">Reset Game Safely</button>
            </details>
            <details style="margin-bottom:8px;"><summary style="cursor:pointer;">Logs</summary>
                <div id="logPanel" style="height:120px; overflow-y:auto; font-size:12px; background:rgba(0,0,0,0.4); padding:4px; border-radius:6px;"></div>
            </details>
            <div style="margin-top:12px; font-size:13px;" id="statsPanel">
                <b>Stats:</b><br>
                CPS: <span id="statCPS">0</span><br>
                Cookies: <span id="statCookies">0</span><br>
                Frenzy: <span id="statFrenzy">1x</span><br>
                Golden Cookies: <span id="statGolden">0</span><br>
                Heavenly Chips: <span id="statHeavenly">0</span>
            </div>
        `;
        document.body.appendChild(panel);

        /********** ELEMENTS **********/
        const autoClick = document.getElementById('autoClick');
        const autoBuyBuildings = document.getElementById('autoBuyBuildings');
        const autoBuyUpgrades = document.getElementById('autoBuyUpgrades');
        const autoGolden = document.getElementById('autoGolden');
        const autoAscend = document.getElementById('autoAscend');
        const autoFrenzy = document.getElementById('autoFrenzy');
        const autoSeason = document.getElementById('autoSeason');
        const autoHeavenly = document.getElementById('autoHeavenly');
        const autoAchievements = document.getElementById('autoAchievements');
        const giveAmount = document.getElementById('giveAmount');
        const giveCookiesBtn = document.getElementById('giveCookies');
        const giveHeavenly = document.getElementById('giveHeavenly');
        const addHeavenlyBtn = document.getElementById('addHeavenly');
        const unlockAllUpgradesBtn = document.getElementById('unlockAllUpgrades');
        const unlockAllBuildingsBtn = document.getElementById('unlockAllBuildings');
        const setClickMultiplierBtn = document.getElementById('setClickMultiplier');
        const resetGameBtn = document.getElementById('resetGame');
        const statCPS = document.getElementById('statCPS');
        const statCookies = document.getElementById('statCookies');
        const statFrenzy = document.getElementById('statFrenzy');
        const statGolden = document.getElementById('statGolden');
        const statHeavenly = document.getElementById('statHeavenly');
        const logPanel = document.getElementById('logPanel');

        let clickMultiplier = 1;
        let totalGoldenClicked = 0;

        /********** LOG FUNCTION **********/
        function log(msg){
            const time = new Date().toLocaleTimeString();
            const line = `[${time}] ${msg}`;
            const div = document.createElement('div');
            div.innerText = line;
            logPanel.appendChild(div);
            logPanel.scrollTop = logPanel.scrollHeight;
        }

        /********** MAIN LOOP **********/
        function mainLoop() {
            if (!Game || !Game.ready) return;

            // --- Auto Click ---
            if (autoClick.checked) {
                for (let i = 0; i < clickMultiplier; i++) Game.ClickCookie();
            }

            // --- Auto Buy Buildings ---
            if (autoBuyBuildings.checked) {
                const sorted = Game.ObjectsById.slice().sort((a,b)=> (b.storedCps/b.getPrice())-(a.storedCps/a.getPrice()));
                for(const obj of sorted){
                    if(obj.getPrice()<=Game.cookies){obj.buy(1); log(`Bought building: ${obj.name}`);}
                }
            }

            // --- Auto Buy Upgrades ---
            if (autoBuyUpgrades.checked) {
                for(const upg of Game.UpgradesInStore){
                    if(upg.getPrice()<=Game.cookies){upg.buy(); log(`Bought upgrade: ${upg.name}`);}
                }
            }

            // --- Auto Golden Cookie ---
            if (autoGolden.checked && Game.shimmers.length>0){
                for(const s of Game.shimmers){s.pop(); totalGoldenClicked++; log(`Clicked golden cookie!`);}
            }

            // --- Auto Seasonal Cookies ---
            if (autoSeason.checked && Game.shimmers.length>0){
                for(const s of Game.shimmers){
                    if(s.type=="season"){s.pop(); log(`Clicked seasonal cookie: ${s.type}`);}
                }
            }

            // --- Auto Ascend ---
            if (autoAscend.checked && Game.cookies>=Game.cookiesReset+1e12){Game.Ascend(); log("Ascended!");}

            // --- Auto Boost in Frenzy ---
            if (autoFrenzy.checked && Game.frenzy>1){
                for(let i=0;i<10;i++){Game.ClickCookie();}
                log(`Frenzy active, boosted clicks!`);
            }

            // --- Auto Spend Heavenly Chips ---
            if(autoHeavenly.checked && Game.heavenlyChips>0){
                // Unlock all heavenly upgrades automatically
                for(const upg of Game.UpgradesById){
                    if(!upg.unlocked) {upg.unlock(); log(`Unlocked heavenly upgrade: ${upg.name}`);}
                }
            }

            // --- Auto Achievements ---
            if(autoAchievements.checked){
                Game.AchievementsById.forEach(ach=>{
                    if(!ach.won){ach.unlock(); log(`Unlocked achievement: ${ach.name}`);}
                });
            }

            // --- Update Stats ---
            statCPS.innerText=Math.floor(Game.cookiesPs);
            statCookies.innerText=Math.floor(Game.cookies);
            statFrenzy.innerText=Game.frenzy.toFixed(2)+'x';
            statGolden.innerText=totalGoldenClicked;
            statHeavenly.innerText=Game.heavenlyChips;
        }

        function loop(){requestAnimationFrame(loop); mainLoop();}
        loop();

        /********** BUTTONS **********/
        giveCookiesBtn.addEventListener('click',()=>{Game.Earn(parseFloat(giveAmount.value)||0); log(`Gave ${giveAmount.value} cookies`);});
        addHeavenlyBtn.addEventListener('click',()=>{
            const amount = parseInt(giveHeavenly.value)||0;
            Game.heavenlyChips+=amount;
            log(`Gave ${amount} heavenly chips`);
        });
        unlockAllUpgradesBtn.addEventListener('click',()=>{Game.UpgradesById.forEach(u=>u.unlock()); log("Unlocked all upgrades");});
        unlockAllBuildingsBtn.addEventListener('click',()=>{Game.ObjectsById.forEach(b=>b.amount=999999); log("Maxed all buildings");});
        setClickMultiplierBtn.addEventListener('click',()=>{const val=parseInt(prompt("Enter click multiplier per tick:",clickMultiplier)); if(val&&val>0){clickMultiplier=val; log(`Click multiplier set to ${clickMultiplier}`);}});
        resetGameBtn.addEventListener('click',()=>{if(confirm("Reset the game?")){Game.Reset(); log("Game reset");}});
    }
})();
