// ==UserScript==
// @name         FV - Onyx 8-Ball Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Ask yes or no questions and let the magic 8-ball answer! Game works on /villager/455907
// @author       necroam
// @match        https://www.furvilla.com/villager/455907
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558534/FV%20-%20Onyx%208-Ball%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558534/FV%20-%20Onyx%208-Ball%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ==============================
       RESPONSES
    ============================== */
    const responses = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes",
        "Reply hazy, try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful"
    ];

    const easterEggs = [
        "Your fur-tune is legendary!",
        "A mysterious cat watches over you.",
        "Fortune favors the feline.",
        "Meow-velous things are coming!",
        "Lucky whiskers are on your side!"
    ];

    const catModeResponses = [
        "Mrrrrrow... destiny approaches.",
        "Purr... the answer is yes.",
        "Hissss... absolutely not.",
        "One moment... try again.",
        "Your future is fuzzy... but promising.",
        "Meow! perhaps!",
        "Meow meow MEOW! (That's a yes.)",
        "Hiss.",
        "*slow blink*",
        "The cats say... bring snacks first."
    ];

    /* ==============================
       DROPDOWN
    ============================== */
    const dropdown1 = ["[none]", "Will", "Can", "Should", "Do", "Is", "Am I", "Are we", "Could", "Might", "Shall", "Would"];
    const dropdown2 = ["[none]", "I", "you", "my villager", "my pet", "the town", "my guild", "my friend", "my shop", "my item", "my family", "my enemy", "going to"];
    const dropdown3 = ["[none]", "get my dream item?", "find happiness?", "be rich?", "win the lottery?", "have a good day?", "level up soon?", "catch a rare pet?", "complete my quest?", "get a shiny item?", "succeed in my adventure?", "meet a new friend?", "avoid trouble?", "gain luck?", "be victorious?"];


    const catDropdown1 = ["[none]", "Will", "Can", "Should", "Am I", "Are we", "Might", "Could", "Shall", "Do", "Would"];
    const catDropdown2 = ["[none]", "I", "my human", "the cat", "we", "the kittens", "my owner", "my friends", "the village", "the mice", "my toys", "my snacks"];
    const catDropdown3 = ["[none]", "find the treats?", "nap peacefully?", "chase mice?", "purr a lot?", "catch the laser?", "hide in boxes?", "get pets?", "play all day?", "be cute?", "scratch the post?", "avoid the dog?", "get belly rubs?", "find a cozy spot?", "knock things over?"];


    let catMode = false;

    /* ==============================
       FORMS/SHEETS
    ============================== */
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSff1k5swRsaHUQlrE-upGs97IBUUN7EPEkXcEz-VmB-947zoA/formResponse";
    const ENTRY_USERNAME   = "entry.1869605024";
    const ENTRY_QUESTION   = "entry.1619296173";
    const ENTRY_PREDICTION = "entry.926881654";
    const GOOGLE_SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeJMH920kDAVhT3PxMgwFZN3GbjUpxIF21BLE7vJ-aXsmKPojHsuLq_WCm0yjrURHlnv4hnizcONT2/pub?gid=985683825&single=true&output=csv";

    /* ==============================
       USERNAME
    ============================== */
    function getCurrentUsername() {
        try {
            const widget = document.querySelector(".user-info h4 a");
            return widget ? widget.textContent.trim() : "Unknown";
        } catch {
            return "Unknown";
        }
    }

    /* ==============================
       UI
    ============================== */
    function injectUI() {
        const target = document.querySelector(".profanity-filter[data-profanityfilter='true']");
        if (!target) return false;

        target.innerHTML = `
        <div style="position:relative;">
            <img src="https://www.furvilla.com/img/villages/world.png" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;filter:blur(3px);z-index:-1;">
            <div style="color:white;font-weight:bold;text-align:center;font-size:16px;margin-bottom:5px;">Build your question:</div>
            <div style="text-align:center;margin-bottom:5px;">
                <select id="dd1" style="color:black;margin:2px;"></select>
                <select id="dd2" style="color:black;margin:2px;"></select>
                <select id="dd3" style="color:black;margin:2px;"></select>
                <button id="randomizeBtn" style="color:black;">Randomize All</button>
            </div>
            <div id="previewQ" style="color:inherit;font-weight:bold;text-align:center;margin-bottom:10px;">Your question will appear here</div>
            <div id="magic8ball" style="
                width:250px;height:250px;margin:0 auto;background:radial-gradient(circle at 30% 30%, #555, #000);
                border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:grab;position:relative;
                perspective:800px;box-shadow: inset -5px -5px 15px rgba(255,255,255,0.1),
                inset 5px 5px 15px rgba(0,0,0,0.6), 5px 5px 15px rgba(0,0,0,0.5);
            ">
                <div id="highlight" style="
                    position:absolute;top:30px;left:30px;width:60px;height:60px;background:rgba(255,255,255,0.3);
                    border-radius:50%;transition:top 0.1s,left 0.1s;
                "></div>
                <div id="ballWindow" style="
                    width:120px;height:120px;background:radial-gradient(circle at 20% 20%, #00BFFF, #1E90FF);
                    border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;
                    text-align:center;color:white;font-size:14px;padding:10px;word-wrap:break-word;line-height:1.2em;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
                ">Click or Shake <br><br>Hint: What do cats say?</div>
            </div>
            <div id="recentBoard" style="
                max-height:160px;overflow-y:auto;background:rgba(0,0,0,0.5);padding:8px 10px;border-radius:10px;margin-top:15px;color:white;font-size:13px;
            ">
                <strong>Most Recent Predictions:</strong>
                <div id="recentEntry" style="margin-top:6px;">(None)</div>
            </div>
        </div>
        `;

        populateDropdowns();
        addDropdownListeners();
        addRandomizeBtn();
        addBallInteractions();
        fetchRecentPredictions();
        setInterval(fetchRecentPredictions, 30000); // refresh every 30s
        return true;
    }

    /* ==============================
       DROPDOWNS
    ============================== */
    function populateDropdowns() {
        const dd1 = document.getElementById("dd1");
        const dd2 = document.getElementById("dd2");
        const dd3 = document.getElementById("dd3");
        const lists = catMode ? [catDropdown1, catDropdown2, catDropdown3] : [dropdown1, dropdown2, dropdown3];

        [dd1,dd2,dd3].forEach((dd,i)=> {
            dd.innerHTML = "";
            lists[i].forEach(opt => dd.add(new Option(opt,opt)));
        });
    }

    function addDropdownListeners() {
        const dd1 = document.getElementById("dd1");
        const dd2 = document.getElementById("dd2");
        const dd3 = document.getElementById("dd3");
        const preview = document.getElementById("previewQ");

        function updatePreview() {
            const parts = [dd1.value, dd2.value, dd3.value].filter(v=>v!=="[none]");
            preview.textContent = parts.join(" ");
        }

        [dd1,dd2,dd3].forEach(dd=>dd.addEventListener("change", updatePreview));
    }

    function addRandomizeBtn() {
        document.getElementById("randomizeBtn").addEventListener("click", ()=> {
            const dd1 = document.getElementById("dd1");
            const dd2 = document.getElementById("dd2");
            const dd3 = document.getElementById("dd3");
            const lists = catMode ? [catDropdown1, catDropdown2, catDropdown3] : [dropdown1, dropdown2, dropdown3];
            dd1.selectedIndex = Math.floor(Math.random()*lists[0].length);
            dd2.selectedIndex = Math.floor(Math.random()*lists[1].length);
            dd3.selectedIndex = Math.floor(Math.random()*lists[2].length);
            dd1.dispatchEvent(new Event("change"));
            dd2.dispatchEvent(new Event("change"));
            dd3.dispatchEvent(new Event("change"));
        });
    }

    /* ==============================
       RECENT PREDICTIONS BOARD
    ============================== */
    function fetchRecentPredictions() {
    fetch(GOOGLE_SHEET_CSV)
        .then(res => res.text())
        .then(csv => {
            const lines = csv.trim().split("\n").slice(1); // skip header
            const latestByUser = {};

            lines.forEach(line => {
                const cols = line.split(",");
                if (!cols || cols.length < 3) return;

                // Depending on how your sheet exports, the first column might be timestamp
                const hasTimestamp = /\d{1,2}\/\d{1,2}\/\d{4}/.test(cols[0]);
                const username = hasTimestamp ? cols[1].trim().replace(/^"|"$/g,"") : cols[0].trim().replace(/^"|"$/g,"");
                const question = hasTimestamp ? cols[2].trim().replace(/^"|"$/g,"") : cols[1].trim().replace(/^"|"$/g,"");
                const prediction = hasTimestamp ? cols[3].trim().replace(/^"|"$/g,"") : cols[2].trim().replace(/^"|"$/g,"");

                if (!username || !question || !prediction) return;
                if (question.toLowerCase() === "[no question]") return;
                if (prediction.toLowerCase() === "[no prediction]") return;

                latestByUser[username] = { username, question, prediction };
            });

            const latestEntries = Object.values(latestByUser).reverse(); // newest first
            const board = document.getElementById("recentEntry");
            board.innerHTML = "";

            if (latestEntries.length === 0) {
                board.textContent = "(None)";
                return;
            }

            latestEntries.forEach(entry => {
                const div = document.createElement("div");
                div.style.marginBottom = "6px";
                div.innerHTML = `<strong>${entry.username}</strong> has asked: ${entry.question}<br>Prediction: ${entry.prediction}`;
                board.appendChild(div);
            });
        })
        .catch(err => console.error("Error fetching predictions:", err));
}


    function updateRecentBoard(question, prediction) {
        sendToGoogleSheets(getCurrentUsername(), question, prediction);
    }

    function sendToGoogleSheets(username, question, prediction) {
        const formData = new FormData();
        formData.append(ENTRY_USERNAME, username);
        formData.append(ENTRY_QUESTION, question);
        formData.append(ENTRY_PREDICTION, prediction);
        fetch(GOOGLE_FORM_URL,{method:"POST",mode:"no-cors",body:formData});
    }

    /* ==============================
       8-BALL + SHAKE
    ============================== */
    function addBallInteractions() {
        const ball = document.getElementById("magic8ball");
        const ballWindow = document.getElementById("ballWindow");
        const highlight = document.getElementById("highlight");
        const previewQ = document.getElementById("previewQ");

        let tiltEnabled = true, isDragging=false, lastX=0, velocity=0;

        function applyTilt(xRatio,yRatio){
            if(!tiltEnabled) return;
            const maxTilt=18;
            const tiltX=yRatio*maxTilt;
            const tiltY=xRatio*maxTilt;
            ball.style.transform=`rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
            highlight.style.top=`${30+tiltX*0.8}px`;
            highlight.style.left=`${30-tiltY*0.8}px`;
        }

        ball.addEventListener("mousemove",(e)=>{
            const rect=ball.getBoundingClientRect();
            const x=(e.clientX-rect.left)/rect.width;
            const y=(e.clientY-rect.top)/rect.height;
            applyTilt((x-0.5)*2,(y-0.5)*2);
        });

        ball.addEventListener("mouseleave",()=>{
            ball.style.transform="rotateX(0deg) rotateY(0deg)";
            highlight.style.top="30px";
            highlight.style.left="30px";
        });

        if(window.DeviceOrientationEvent){
            window.addEventListener("deviceorientation",(e)=>{
                const xRatio=e.gamma/45;
                const yRatio=e.beta/45;
                if(Math.abs(xRatio)<1 && Math.abs(yRatio)<1) applyTilt(xRatio,yRatio);
            });
        }

        ball.addEventListener("mousedown",(e)=>{isDragging=true; tiltEnabled=false; lastX=e.clientX; ballWindow.textContent="Shaking...";});
        document.addEventListener("mousemove",(e)=>{
            if(!isDragging) return;
            velocity=e.clientX-lastX; lastX=e.clientX;
            ball.style.transform=`translateX(${velocity}px) rotate(${velocity*1.5}deg)`;
            highlight.style.top=`${30-velocity/3}px`;
            highlight.style.left=`${30-velocity/3}px`;
        });
        document.addEventListener("mouseup",()=>{
            if(!isDragging) return; isDragging=false;
            rollBall(Math.abs(velocity)>2?velocity:8);
        });
        ball.addEventListener("click",()=>{tiltEnabled=false; rollBall(8);});

        function rollBall(intensity){
            const duration=700, fps=60, frames=duration/(1000/fps);
            let frame=0;
            const anim=setInterval(()=>{
                const t=frame/frames;
                const wiggle=Math.sin(t*Math.PI*4)*intensity;
                const rot=wiggle*1.5;
                ball.style.transform=`translateX(${wiggle}px) rotate(${rot}deg)`;
                highlight.style.top=`${30-Math.sin(t*Math.PI*4)*5}px`;
                highlight.style.left=`${30-Math.sin(t*Math.PI*4)*5}px`;
                frame++; if(frame>frames){clearInterval(anim); smoothBounce();}
            },1000/fps);
        }

        function smoothBounce(){
            let frame=0, frames=20, amplitude=8;
            const anim=setInterval(()=>{
                const t=frame/frames;
                const bounce=Math.sin(t*Math.PI)*amplitude;
                ball.style.transform=`translateY(${-bounce}px) rotate(0deg)`;
                if(frame>=frames){clearInterval(anim); ball.style.transform="translateY(0) rotate(0deg)"; highlight.style.top="30px"; highlight.style.left="30px"; showResult(); tiltEnabled=true;}
                frame++;
            },1000/60);
        }

        /* =========================
           cAT
        ========================= */
        let inputBuffer="";
        document.addEventListener("keydown",(e)=>{
            inputBuffer+=e.key.toLowerCase();
            inputBuffer=inputBuffer.slice(-15);
            if(!catMode && inputBuffer.includes("meow")) activateCatMode();
        });

        function activateCatMode(){
            catMode=true;
            ballWindow.innerHTML="🐾 *MRRROOOOWWW!* 🐾<br>Cat Mode Activated!";
            ballWindow.style.textShadow="0 0 10px pink,0 0 20px magenta";
            setTimeout(()=>{
                ballWindow.textContent="Ask your question, human...";
                populateDropdowns();
            },1800);
        }

        function showResult(){
            const question = previewQ.textContent || "[no question]";
            let list = catMode ? catModeResponses : (Math.random()<0.1 ? easterEggs : responses);
            const idx=Math.floor(Math.random()*list.length);
            const prediction=list[idx];
            ballWindow.textContent = prediction;
            updateRecentBoard(question,prediction);
            if(list===easterEggs){ballWindow.style.textShadow="0 0 8px gold,0 0 12px orange"; setTimeout(()=>{ballWindow.style.textShadow="none";},1500);}
        }

    }

    /* ==============================
       INJECTION
    ============================== */
    const interval = setInterval(()=>{if(injectUI()) clearInterval(interval);},500);

})();
