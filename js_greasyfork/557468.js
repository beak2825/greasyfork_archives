// ==UserScript==
// @name         FarmRPG Plus Trial/Pro
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  FarmRPG automation
// @author       scriptingscriptkid
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557468/FarmRPG%20Plus%20TrialPro.user.js
// @updateURL https://update.greasyfork.org/scripts/557468/FarmRPG%20Plus%20TrialPro.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const TRIAL_DURATION = 60*60*1000;

    let autoFish=false, autoExplore=false, autoSell=false, autoWorm=false, autoIron=false;
    let fishTimer, exploreTimer, sellLoop, wormLoop, ironLoop;

    let trialStart = parseInt(localStorage.getItem("farmrpg_trialStart")||"0");
    let trialActive=false;

    let lastStopDate = null;


    // ---------------- Password system (Base64) ----------------
    function hashPassword(str) {
        let h = 0;
        for (let i=0;i<str.length;i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
        return h;
    }

    function decodeBase64(str){ return atob(str); }

const encodedPasswords = [
"LTY1MTExMzkxNg==",
"LTE2Nzg0MjQ0Mjk=",
"LTEyMjk4OTMxMzA=",
"MTQyODQ0MjcwNQ==",
"LTE3MDM3NzQ5NzY=",
"LTUwNDgxMTE5OQ==",
"LTE3NTQyNjUyNDk=",
"LTIwMjY0MzIxNDY=",
"LTE0MDE2NDA4NDI=",
"NjI1Mzk2MTkw",
"LTM5ODMzNzAzNQ==",
"LTIwMzYwNzAxMDU=",
"LTExNjM0MDYzMzE=",
"LTE2MzE1NzAzMzc=",
"OTUyNDg4NjEz",
"LTE5NDAyNzA2MTM=",
"LTIxMzgwMzQ2ODc=",
"NDQ1OTU0MzE1",
"MTgzMjgxNzcwMg==",
"LTExMjgyMDk4MDE=",
"NTkxMTE2OTgy",
"LTEzNTUzMTcwNzI=",
"LTc0NDM0ODIxNA==",
"LTc0MjI5NjkyMg==",
"LTE1NDk0ODY4Njg=",
"NTUxNzc0NTI3",
"NTg0Mjc4NjE4",
"LTgxMDUwODg5Mw==",
"LTE5MDY1NjYzNg==",
"ODQzNzY0Njcz",
"MTk0NzU5NDA2MA==",
"LTE0MDc3NDI3ODY=",
"MTgzNzkwNTk1",
"MTE2OTA3NjMxNQ==",
"MTc2MzE4NjYz",
"LTEyOTUxNzA4ODQ=",
"LTEzMzcwMzUxNDg=",
"MTA0Njk2OTIzNg==",
"MTM1MTE2ODMzMg==",
"MTc4MzA4ODA2Ng==",
"NjEyNTUzNTg0",
"MjA4MjI5OTE1Nw==",
"LTE4NDc3Njc4MTc=",
"LTMwMjg3OTMzNA==",
"LTk1NzE5NjczNA==",
"LTE0NTUyMjA4NTQ=",
"MTE4NDQ4MTA0Mw==",
"MjA3NzkxODI1Mw==",
"LTE4NDg4NTM5MDk=",
"LTEzODQ4MTYwMzY=",
"NDA2Mzc4MDAy",
"MTA3ODcyMDE1NA==",
"NjUyODY4MjQ5",
"MTk2MjYxMjcyNQ==",
"LTE1NTA2OTg5Mzk=",
"LTUxMDg2MjU1Mg==",
"LTE5OTE0NzkyMzk=",
"LTEzMDk5MjAwODg=",
"LTIwMzMxMzk1NQ==",
"NjgyOTE1MDEy",
"LTEwNjkyNTExMzY=",
"LTE4NzUwMTcyMDQ=",
"LTE1MzgyMDQ1NDE=",
"MTgyNzM4OTI3Mg==",
"NTQyOTgwNTE=",
"MjA3NTA5MTk0Mw==",
"MjQ4ODMwNTI3",
"LTE4MzA1NzMwNjk=",
"LTE5Mzc3ODE0Mjk=",
"LTE5ODIxNjQ3OTc=",
"NzI4ODMwNTQ=",
"MTk1MTA1MTY1OA==",
"LTczMTkyNTgwOA==",
"LTk5NDc3NTc3",
"LTEzMTM1MjUzNzA=",
"MjM3MTgxODk0",
"MTYwNDk0NTg1Mw==",
"LTE5OTMxNDQ5NA==",
"LTE1ODc0MzU5Mzg=",
"MjAwNDMxMjEzMA==",
"NDAyNTM5Mjkx",
"LTExNDE0Mzg0NzQ=",
"MTE5ODM0NDgwMw==",
"LTE4OTE3NTMxNDQ=",
"MTcxNTAxODIwOQ==",
"LTE2MDU2MDYyNzc=",
"MTkyODEwMjcxMA==",
"NDAzNjUwMjM4",
"LTIwNzUzNTg2MTU=",
"NTYyNzAyMzE5",
"LTgyMDAwNDU0NA==",
"MTIxMzk5NDg3"
];

    const passwordList = encodedPasswords.map(p => {
        const plain = decodeBase64(p);
        return { p: plain, h: hashPassword(plain) };
    });

    let savedHash = localStorage.getItem("farmrpg_passwordHash");
    let passwordEntered = false;

    function checkSavedPassword() {
        if(savedHash && passwordList.some(e => String(e.h)===savedHash)) {
            passwordEntered = true;
        }
    }
    checkSavedPassword();

    // ---------------- Utility ----------------
    function delay(ms){ return new Promise(res=>setTimeout(res, ms)); }
    function randomInterval(base, range=100){ return base + Math.floor(Math.random()*(range*2+1)) - range; }
    function simulateClick(el){ if(el) el.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
    function startTrial(){ if(passwordEntered || trialActive) return; trialActive=true; trialStart=Date.now(); localStorage.setItem("farmrpg_trialStart", trialStart.toString()); enableAllButtons(); }

    window.addEventListener("load", ()=>{

        // ----------------- UI Container -----------------
        const ui = document.createElement("div");
        Object.assign(ui.style,{
            position:"fixed", bottom:"20px", left:"20px", width:"380px",
            background:"rgba(255,255,255,0.95)", borderRadius:"12px", padding:"6px",
            boxShadow:"0 4px 12px rgba(0,0,0,0.2)", fontFamily:"Arial,sans-serif",
            zIndex:9999999
        });
        document.body.appendChild(ui);

        // ----------------- Draggable -----------------
        let isDragging=false, offsetX=0, offsetY=0;
        ui.addEventListener("mousedown", e=>{
            if(e.target.tagName==="BUTTON"||e.target.tagName==="INPUT") return;
            isDragging=true;
            offsetX = e.clientX - ui.offsetLeft;
            offsetY = e.clientY - ui.offsetTop;
        });
        window.addEventListener("mousemove", e=>{
            if(isDragging){
                ui.style.left = (e.clientX - offsetX) + "px";
                ui.style.top = (e.clientY - offsetY) + "px";
                ui.style.bottom = "auto";
            }
        });
        window.addEventListener("mouseup", ()=>{isDragging=false;});

        // ----------------- Header -----------------
        const header = document.createElement("div");
        Object.assign(header.style,{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px"});

        const leftHeader = document.createElement("div");
        leftHeader.style.display="flex"; leftHeader.style.alignItems="center"; leftHeader.style.gap="4px";
        const notifyLabel = document.createElement("span");
        notifyLabel.style.fontWeight="bold"; notifyLabel.style.minWidth="80px"; notifyLabel.textContent="";
        leftHeader.appendChild(notifyLabel);

        const rightHeader = document.createElement("div");
        rightHeader.style.display="flex"; rightHeader.style.alignItems="center"; rightHeader.style.gap="4px";
        const discordBtn = document.createElement("img");
        discordBtn.src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/discord.svg";
        Object.assign(discordBtn.style,{width:"20px", height:"20px", cursor:"pointer"});
        discordBtn.addEventListener("click", ()=>window.open("https://discord.gg/bE5KFXjqxa","_blank"));
        rightHeader.appendChild(discordBtn);

        const minimizeBtn = document.createElement("button");
        minimizeBtn.innerText="▁";
        Object.assign(minimizeBtn.style,{width:"24px", height:"24px", padding:"0", fontSize:"16px", cursor:"pointer", border:"none", borderRadius:"4px"});
        rightHeader.appendChild(minimizeBtn);

        const shutDownBtn = document.createElement("button");
        shutDownBtn.innerText="⏻";
        Object.assign(shutDownBtn.style,{width:"24px", height:"24px", padding:"0", fontSize:"16px", cursor:"pointer", border:"none", borderRadius:"4px"});
        rightHeader.appendChild(shutDownBtn);

        header.appendChild(leftHeader);
        header.appendChild(rightHeader);
        ui.appendChild(header);

        let minimized=false;
        minimizeBtn.addEventListener("click", ()=>{ minimized = !minimized; Array.from(ui.children).forEach(c=>{if(c!==header) c.style.display = minimized?"none":"flex";}); });
        shutDownBtn.addEventListener("click", ()=>{ autoFish=autoExplore=autoSell=autoWorm=autoIron=false; clearTimeout(fishTimer); clearTimeout(exploreTimer); clearInterval(sellLoop); clearInterval(wormLoop); clearInterval(ironLoop); ui.remove(); });

        // ----------------- Unlock Section -----------------
        const unlockRow = document.createElement("div");
        Object.assign(unlockRow.style,{display:"flex", marginBottom:"6px", gap:"4px"});
        const unlockInput = document.createElement("input");
        unlockInput.type="password"; unlockInput.placeholder="Enter password";
        Object.assign(unlockInput.style,{flex:"1", padding:"2px", fontSize:"0.9em"});
        const unlockBtn = document.createElement("button"); unlockBtn.innerText="Unlock";
        Object.assign(unlockBtn.style,{padding:"2px 6px", fontSize:"0.85em", background:"#007BFF", color:"#fff", border:"none", borderRadius:"4px", cursor:"pointer"});
        unlockRow.appendChild(unlockInput); unlockRow.appendChild(unlockBtn);
        ui.appendChild(unlockRow);

        unlockBtn.addEventListener("click", ()=>{
            const h = hashPassword(unlockInput.value);
            if(passwordList.some(e => e.h===h)){
                passwordEntered = true;
                localStorage.setItem("farmrpg_passwordHash",h);
                unlockRow.style.display="none";
                notifyLabel.textContent="Pro";
                enableAllButtons();
            } else alert("Incorrect password");
        });

        if(passwordEntered) unlockRow.style.display="none";

        // ----------------- Buttons -----------------
        const buttons=[];
        function createButtonWithInput(label, inputId=null, inputPlaceholder="", withStatus=false){
            const row = document.createElement("div");
            row.style.display="flex"; row.style.alignItems="center"; row.style.gap="4px"; row.style.marginBottom="4px";
            const btn = document.createElement("button");
            btn.innerText=label;
            Object.assign(btn.style,{flex:"0 0 auto", width:"120px", borderRadius:"6px", padding:"2px 4px", cursor:"pointer", background:"#007BFF", color:"#fff"});
            row.appendChild(btn);

            let status=null;
            if(withStatus){
                status=document.createElement("span");
                status.innerText="Stopped";
                Object.assign(status.style,{background:"red", color:"#fff", borderRadius:"4px", padding:"2px 4px", minWidth:"60px", textAlign:"center"});
                row.appendChild(status);
            }

            let input=null;
            if(inputId){
                input = document.createElement("input");
                input.type="number"; input.value="10"; input.min="0"; input.placeholder=inputPlaceholder; input.id=inputId;
                Object.assign(input.style,{width:"60px", padding:"2px", fontSize:"0.9em"});
                row.appendChild(input);
            }

            ui.appendChild(row);
            buttons.push(btn);
            return {btn,status,input};
        }

        function enableAllButtons(){ buttons.forEach(b=>{b.disabled=false; b.style.cursor="pointer";}); }
        function disableAllButtons(){ buttons.forEach(b=>{b.disabled=true; b.style.cursor="not-allowed";}); }

        const fishObj = createButtonWithInput("Auto Fish", null,"", true);
        const exploreObj = createButtonWithInput("Auto Explore", null,"", true);
        const wormObj = createButtonWithInput("Auto Worm", null,"", true);
        const sellObj = createButtonWithInput("Auto Sell All", null,"", true);
        const ironObj = createButtonWithInput("Auto Iron", null,"", true);
        const petCowsObj = createButtonWithInput("Pet Cows","badcows","Cow Count");
        const petChickensObj = createButtonWithInput("Pet Chicken","badchickens","Chicken Count");

        function updateStatus(obj,isRunning){
            if(!obj || !obj.status) return;
            if(!isRunning){ obj.status.textContent="Stopped"; obj.status.style.background="red"; obj.btn.style.background="#007BFF"; }
            else { obj.status.textContent="Running"; obj.status.style.background="green"; obj.btn.style.background="#007BFF"; }
        }
        function setPaused(obj){ if(!obj || !obj.status) return; obj.status.textContent="Paused"; obj.status.style.background="orange"; }
// ----------------- Pet Cows -----------------
petCowsObj.btn.onclick = async () => {
    startTrial();
    let count = parseInt(petCowsObj.input.value);
    if(isNaN(count) || count <= 0) return alert("Enter a valid cow count");

    petCowsObj.btn.disabled = true;
    for(let i = 1; i <= count; i++) {
        await delay(250);
        fetch(`https://farmrpg.com/worker.php?go=petcow&num=${i}`)
            .catch(err => console.error("Error petting cow:", err));
    }
    petCowsObj.btn.disabled = false;

    notifyLabel.textContent = "Cows petted!";
    notifyLabel.style.fontWeight = "bold";
    setTimeout(() => {
        if(!passwordEntered) notifyLabel.textContent = "";
    }, 30000);
};

// ----------------- Pet Chickens -----------------
petChickensObj.btn.onclick = async () => {
    startTrial();
    let count = parseInt(petChickensObj.input.value);
    if(isNaN(count) || count <= 0) return alert("Enter a valid chicken count");

    petChickensObj.btn.disabled = true;
    for(let i = 1; i <= count; i++) {
        await delay(250);
        fetch(`https://farmrpg.com/worker.php?go=petchicken&num=${i}`)
            .catch(err => console.error("Error petting chicken:", err));
    }
    petChickensObj.btn.disabled = false;

    notifyLabel.textContent = "Chickens petted!";
    notifyLabel.style.fontWeight = "bold";
    setTimeout(() => {
        if(!passwordEntered) notifyLabel.textContent = "";
    }, 30000);
};
        // ----------------- Trial Timer -----------------
        setInterval(()=>{
            const now = Date.now();
            if(passwordEntered) notifyLabel.textContent="Pro";
            else if(trialActive){
                let remaining = Math.max(0, TRIAL_DURATION-(now-trialStart));
                notifyLabel.textContent=`Free Trial: ${Math.floor(remaining/60000)}m ${Math.floor((remaining%60000)/1000)}s`;
                if(remaining<=0){ disableAllButtons(); trialActive=false; localStorage.setItem("farmrpg_trialStart","0"); notifyLabel.textContent=""; }
            } else notifyLabel.textContent="";
        },1000);

        // ----------------- Functions -----------------
// ----------------- Functions -----------------
fishObj.btn.onclick = ()=>{
    startTrial();
    if(!location.href.includes("fishing.php")) return alert("You must be in a fishing area");
    autoFish = !autoFish; updateStatus(fishObj,autoFish);
    if(autoFish){
        (function loop(){
            if(!autoFish){ updateStatus(fishObj,false); return; }
            const fbtn=document.querySelector(".row .fishcell .catch"); if(fbtn) simulateClick(fbtn);
            setTimeout(()=>{ const p=document.querySelector("body > div.picker-modal.picker-catch.modal-in div.picker-modal-inner div > div > div"); if(p) simulateClick(p); }, randomInterval(400,100));
            fishTimer=setTimeout(loop, randomInterval(500,100));
        })();
    } else clearTimeout(fishTimer);
};

exploreObj.btn.onclick = ()=>{
    startTrial();
    if(!location.href.includes("area.php")) return alert("You must be in exploring area");
    autoExplore=!autoExplore; updateStatus(exploreObj,autoExplore);
    if(autoExplore){
        (function loop(){
            if(!autoExplore){ updateStatus(exploreObj,false); return; }
            const ebtn=document.querySelector("#exploreoptions > li:nth-child(1) > div"); if(ebtn) simulateClick(ebtn);
            exploreTimer=setTimeout(loop, randomInterval(700,100));
        })();
    } else clearTimeout(exploreTimer);
};

// Utility to get current worm count
function getWormCount() {
    const items = document.querySelectorAll("#inventory .item");
    for(const item of items){
        const nameEl = item.querySelector(".item-name");
        const qtyEl = item.querySelector(".item-qty");
        if(nameEl && nameEl.textContent.trim() === "Worm"){
            return parseInt(qtyEl?.textContent) || 0;
        }
    }
    return 0;
}

wormObj.btn.onclick = ()=>{
    startTrial();
    autoWorm = !autoWorm; updateStatus(wormObj,autoWorm);

    if(autoWorm){
        // Buy worms to fill 200 at start
        const count = getWormCount();
        if(count < 200){
            const qty = 200 - count;
            fetch(`https://farmrpg.com/worker.php?go=buyitem&id=18&qty=${qty}`);
        }

        wormLoop = setInterval(()=>{
            const currentCount = getWormCount();
            if(currentCount <= 100) fetch("https://farmrpg.com/worker.php?go=buyitem&id=18&qty=25");
        },60000);
    } else {
        clearInterval(wormLoop);
        updateStatus(wormObj,false);
    }
};

sellObj.btn.onclick = ()=>{
    startTrial();
    autoSell = !autoSell;
    updateStatus(sellObj, autoSell);

    if(autoSell){
        function sellLoopFunc(){
            if(!autoSell){
                updateStatus(sellObj, false);
                return;
            }
            fetch("https://farmrpg.com/worker.php?go=sellalluseritems");
            const nextInterval = Math.floor(Math.random() * (120000 - 60000 + 1)) + 60000; // 60s to 120s
            sellLoop = setTimeout(sellLoopFunc, nextInterval);
        }
        sellLoopFunc();
    } else {
        clearTimeout(sellLoop);
        updateStatus(sellObj, false);
    }
};

ironObj.btn.onclick = ()=>{
    startTrial();
    autoIron=!autoIron; updateStatus(ironObj,autoIron);
    if(autoIron) ironLoop=setInterval(()=>fetch("https://farmrpg.com/worker.php?go=buyitem&id=18&qty=25"),60000);
    else {
        clearInterval(ironLoop);
        updateStatus(ironObj,false);
    }
};
        // ----------------- Random Pauses -----------------
function setupRandomPause(obj, minPause=3*60*1000, maxPause=5*60*1000){
    const minInterval = 45*60*1000;
    const maxInterval = 60*60*1000;

    function scheduleNext(){
        const interval = minInterval + Math.random() * (maxInterval - minInterval); // 45–60 min

        setTimeout(() => {
            let isActive = false;

            if(obj === fishObj && autoFish){
                autoFish = false;
                isActive = true;
                updateStatus(fishObj, false);
            }
            if(obj === exploreObj && autoExplore){
                autoExplore = false;
                isActive = true;
                updateStatus(exploreObj, false);
            }

            if(isActive){
                setPaused(obj);

                const pauseDuration = minPause + Math.random() * (maxPause - minPause); // 3–5 min

                setTimeout(() => {
                    if(obj === fishObj){
                        autoFish = true;
                        fishObj.btn.onclick();
                    }
                    if(obj === exploreObj){
                        autoExplore = true;
                        exploreObj.btn.onclick();
                    }
                    updateStatus(obj, true);
                }, pauseDuration);
            }

            scheduleNext();
        }, interval);
    }
    scheduleNext();
}

// ----------------- Belgium Time Helper -----------------
function getBHourMinute() {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Brussels",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const parts = fmt.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === "hour").value, 10);
    const minutes = parseInt(parts.find(p => p.type === "minute").value, 10);
    return { bHour: hour, minutes };
}

// ----------------- Save Automation States -----------------
function saveStates() {
    const toSave = {
        fish: autoFish,
        explore: autoExplore,
        sell: autoSell,
        worm: autoWorm,
        iron: autoIron
    };
    localStorage.setItem("farmrpg_prevStates", JSON.stringify(toSave));
}

// ----------------- Scheduled 6AM Stop (Belgium Time) -----------------
lastStopDate = localStorage.getItem("farmrpg_lastStopDate") || null;

setInterval(() => {
    const { bHour, minutes } = getBHourMinute();

    // Today's date in Belgium (YYYY-MM-DD)
    const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Europe/Brussels"
    });

    // Run only once per day at 06:00
    if (bHour === 6 && minutes === 0 && lastStopDate !== today) {

        console.log("Running 6AM daily shutdown...");

        lastStopDate = today;
        localStorage.setItem("farmrpg_lastStopDate", today);

        // Stop everything
        clearTimeout(fishTimer);
        clearTimeout(exploreTimer);
        clearTimeout(sellLoop);
        clearInterval(wormLoop);
        clearInterval(ironLoop);

        autoFish = false;
        autoExplore = false;
        autoSell = false;
        autoWorm = false;
        autoIron = false;

        saveStates();
    }

}, 15000);

// ----------------- 8AM Restore After Reload (Belgium Time) -----------------
(function () {
    const saved = localStorage.getItem("farmrpg_prevStates");
    if (!saved) return;

    const { bHour } = getBHourMinute();

    // Restore only after 08:00
    if (bHour >= 8) {
        const restored = JSON.parse(saved);
        localStorage.removeItem("farmrpg_prevStates");

        if (restored.fish) fishObj.btn.onclick();
        if (restored.explore) exploreObj.btn.onclick();
        if (restored.sell) sellObj.btn.onclick();
        if (restored.worm) wormObj.btn.onclick();
        if (restored.iron) ironObj.btn.onclick();
    }
})();

    });
})();
