// ==UserScript==
// @name         FV - Simon Says Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      7.1
// @description  Follow the colors with Simon!
// @match        https://www.furvilla.com/villager/455933
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557155/FV%20-%20Simon%20Says%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/557155/FV%20-%20Simon%20Says%20Mini-Game.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const target = document.querySelector(".villager-data-info-wide.villager-data-desc.villager-description .profanity-filter");
    if (!target) return;
    target.innerHTML = "";

    /* --------------------------
       Styles
    -------------------------- */
    const style = document.createElement("style");
    style.textContent = `
        #simonGame, #simonGame * { color: #222 !important; font-weight: bold; }
        #simonGame {
            width: 100%;
            max-width: 450px;
            min-height: 500px;
            padding: 20px;
            background: url('https://www.furvilla.com/img/villages/world.png') no-repeat center center;
            background-size: cover;
            border: 2px solid #cbbccf;
            border-radius: 15px;
            box-sizing: border-box;
            position: relative;
            font-family: 'Arial', sans-serif;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #scoreTimerBox { width: 100%; text-align: center; margin-bottom: 10px; }
        #score { font-size: 20px; margin-bottom: 5px; }
        #playerTimerDisplay { font-size: 18px; margin-bottom: 5px; }
        #banner {
            background: #7f5ba3;
            color: #222 !important;
            padding: 6px 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 18px;
            position: absolute;
            top: 10px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        #simonBox {
            background: linear-gradient(to bottom, rgba(255,182,193,0.6), rgba(255,255,255,0.8));
            border-radius: 15px;
            padding: 15px;
            margin-bottom: 15px;
            width: 100%;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        #simonComment {
            margin-top: 8px;
            font-size: 16px;
            color: #222;
            font-weight: bold;
            min-height: 24px;
            transition: opacity 0.3s;
            opacity: 0;
        }
        #simonComment.show { opacity: 1; }
        #simonButtons {
            display: grid;
            grid-template-columns: repeat(2, 100px);
            grid-gap: 15px;
            justify-content: center;
            margin-bottom: 15px;
            padding: 15px;
            background: rgba(255,255,255,0.6);
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .simon-btn {
            width: 100px;
            height: 100px;
            border-radius: 12px;
            border: 1px solid #888;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .simon-btn:hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(0,0,0,0.2); }
        .simon-btn.red { background: #ff4d4d; }
        .simon-btn.green { background: #46d86d; }
        .simon-btn.blue { background: #4d7dff; }
        .simon-btn.yellow { background: #ffe14d; }
        .simon-btn.flash { filter: brightness(1.8); box-shadow: 0 0 25px rgba(0,0,0,0.4); }

        #startGame, #muteBtn, #restartBtn {
            padding: 8px 16px;
            margin: 5px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            background: #7f5ba3;
            color: #fff;
            border: none;
            transition: background 0.2s, transform 0.2s;
        }
        #startGame:hover, #muteBtn:hover, #restartBtn:hover { background: #9b76c8; transform: scale(1.05); }

        #gameOverOverlay {
            display: none;
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(255, 192, 203, 0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
        }
        #gameOverOverlay .overlayContent {
            background: #fff;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 20px;
            width: 300px;
            text-align: center;
        }
        #gameOverOverlay h2 { margin-top:0; font-size:20px; color:#222; }

        @keyframes bounce {0%,100%{transform:translateY(0);}50%{transform:translateY(-15px);}}
        @keyframes tiltLeft {0%,100%{transform:rotate(0deg);}50%{transform:rotate(-15deg);}}
        @keyframes tiltRight {0%,100%{transform:rotate(0deg);}50%{transform:rotate(15deg);}}
        @keyframes spin {0%{transform:rotate(0deg);}50%{transform:rotate(180deg);}100%{transform:rotate(360deg);}}
        @keyframes wiggle {0%,100%{transform:rotate(0deg);}25%{transform:rotate(10deg);}50%{transform:rotate(-10deg);}75%{transform:rotate(5deg);}}
        @keyframes jump {0%,100%{transform:translateY(0);}50%{transform:translateY(-20px);}}
        @keyframes spinTilt {0%{transform:rotate(0deg);}50%{transform:rotate(180deg) translateY(-5px);}100%{transform:rotate(360deg);}}
        .simonAnimate { animation-duration:0.5s; animation-fill-mode:forwards; }
    `;
    document.head.appendChild(style);

    /* --------------------------
       Build UI
    -------------------------- */
    const game = document.createElement("div");
    game.id = "simonGame";
    game.innerHTML = `
        <div id="scoreTimerBox">
            <div id="score">Round: 0</div>
            <div id="playerTimerDisplay">Time: 0s</div>
        </div>

        <div id="banner"></div>

        <div id="simonBox">
            <p id="introText">Hi! I'm Simon! Can you follow my moves?</p>
            <img src="https://www.furvilla.com/img/villagers/0/754-4.png" alt="Simon Full Body" style="width:120px; display:block; margin:0 auto;">
            <div id="simonComment"></div>
        </div>

        <div id="simonButtons">
            <button id="btn0" class="simon-btn red"></button>
            <button id="btn1" class="simon-btn green"></button>
            <button id="btn2" class="simon-btn blue"></button>
            <button id="btn3" class="simon-btn yellow"></button>
        </div>

        <button id="startGame">Start Game</button>
        <button id="muteBtn">Sound ON</button>

        <div id="gameOverOverlay">
            <div class="overlayContent">
                <img src="https://www.furvilla.com/img/villagers/0/754-4-th.png" alt="Simon Icon" style="width:100px; height:100px; margin-bottom:10px;">
                <h2>Game Over!</h2>
                <div id="finalScore">You reached round 0</div>
                <button id="restartBtn">Restart</button>
            </div>
        </div>
    `;
    target.appendChild(game);

    /* --------------------------
       Audio & Game Logic
    -------------------------- */
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let buffers = [];
    let soundEnabled = true;
    const soundFiles = [
        "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo3.mp3",
        "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo4.mp3",
        "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo5.mp3",
        "https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3"
    ];
    window.addEventListener("pointerdown",()=>{if(audioCtx.state==="suspended")audioCtx.resume();},{once:true});
    async function loadSounds(){
        for(let i=0;i<soundFiles.length;i++){
            const arrayBuffer=await fetch(soundFiles[i]).then(r=>r.arrayBuffer());
            const audioBuffer=await audioCtx.decodeAudioData(arrayBuffer);
            buffers.push(audioBuffer);
        }
    }
    function playSound(i){if(!soundEnabled||!buffers[i])return; const source=audioCtx.createBufferSource(); source.buffer=buffers[i]; source.connect(audioCtx.destination); source.start(0); }

    const banner=document.getElementById("banner");
    const playerTimerDisplay=document.getElementById("playerTimerDisplay");
    const startBtn=document.getElementById("startGame");
    const muteBtn=document.getElementById("muteBtn");
    const btns=[
        document.getElementById("btn0"),
        document.getElementById("btn1"),
        document.getElementById("btn2"),
        document.getElementById("btn3")
    ];
    const overlay=document.getElementById("gameOverOverlay");
    const finalScore=document.getElementById("finalScore");
    const restartBtn=document.getElementById("restartBtn");
    const simonImg=document.querySelector("#simonBox img");
    const simonCommentDiv=document.getElementById("simonComment");

    const simonComments=["Great job! Keep going!","You're doing amazing!","Wow, impressive memory!","Keep it up, you can do this!","Round complete! Fantastic!"];
    const simonOopsComments=["Oops! Almost got it!","Don't worry, try again!","Keep practicing, you got this!","Almost! Next round will be yours!","A little mistake, keep going!"];
    const simonMilestoneComments=["Wow! 5 rounds! You're amazing!","10 rounds! Impressive!","15 rounds! Incredible memory!","20 rounds! You're unstoppable!","25 rounds! Legendary!"];

    let sequence=[],playerSequence=[],round=0,waiting=false,flashSpeed=600,timerInterval=null;
    const playerTimeLimit=10; let timeLeft=playerTimeLimit;

    function startPlayerTimer(){clearInterval(timerInterval); timeLeft=playerTimeLimit; playerTimerDisplay.textContent=`Time: ${timeLeft}s`; timerInterval=setInterval(()=>{timeLeft--; playerTimerDisplay.textContent=`Time: ${timeLeft}s`; if(timeLeft<=0)gameOver();},1000);}
    function stopPlayerTimer(){clearInterval(timerInterval); playerTimerDisplay.textContent="";}
    function showBanner(text,duration=1200){banner.textContent=text; banner.style.opacity="1"; setTimeout(()=>{banner.style.opacity="0";},duration);}

    function flashButton(i){
        return new Promise(resolve=>{
            const btn=btns[i];
            btn.classList.add("flash");
            playSound(i);
            setTimeout(()=>{btn.classList.remove("flash"); setTimeout(resolve, flashSpeed*0.4);}, flashSpeed*0.6);
        });
    }

    function animateSimon(colorIndex,special=false){
        const animations=["bounce","tiltLeft","tiltRight","spin","wiggle","jump","spinTilt"];
        let anim=special?"spinTilt":animations[Math.floor(Math.random()*animations.length)];
        simonImg.classList.remove("simonAnimate");
        void simonImg.offsetWidth;
        simonImg.style.animationName=anim;
        simonImg.style.animationDuration=special?"1s":"0.5s";
        simonImg.classList.add("simonAnimate");
    }

    function showSimonComment(msgList){
        const msg=msgList[Math.floor(Math.random()*msgList.length)];
        simonCommentDiv.textContent=msg;
        simonCommentDiv.classList.add("show");
        setTimeout(()=>{simonCommentDiv.classList.remove("show");},2500);
    }

    async function playSequence(){
        waiting=false;
        showBanner("Attention!");
        await new Promise(r=>setTimeout(r,400));
        for(let i of sequence){ await flashButton(i); animateSimon(i); }
        showBanner("Your Turn!");
        waiting=true;
        startPlayerTimer();
    }

    function nextRound(){
        round++;
        document.getElementById("score").textContent="Round: "+round;
        if(round%3===0 && flashSpeed>200) flashSpeed-=50;
        sequence.push(Math.floor(Math.random()*4));
        playerSequence=[];
        playSequence();
    }

    function gameOver(){
    waiting = false;
    stopPlayerTimer();
    const lastRound = round;
    overlay.style.display = "flex";
    finalScore.textContent = `You reached round ${lastRound}`;
    sequence = [];
    playerSequence = [];
    round = 0;
    flashSpeed = 600;
    document.getElementById("score").textContent = "Round: 0";
}


    btns.forEach((btn,i)=>{
        btn.addEventListener("click",()=>{
            if(!waiting) return;
            playerSequence.push(i);
            flashButton(i);
            animateSimon(i);
            startPlayerTimer();
            const step=playerSequence.length-1;
            if(playerSequence[step]!==sequence[step]){
                showSimonComment(simonOopsComments);
                setTimeout(gameOver,2000);
                return;
            }
            if(playerSequence.length===sequence.length){
                setTimeout(()=>{
                    showSimonComment(simonComments);
                    if(round%5===0){
                        const milestoneMsg=simonMilestoneComments[Math.min(Math.floor(round/5)-1, simonMilestoneComments.length-1)];
                        simonCommentDiv.textContent=milestoneMsg;
                        simonCommentDiv.classList.add("show");
                        animateSimon(i,true);
                        setTimeout(()=>{simonCommentDiv.classList.remove("show");},3000);
                    }
                    nextRound();
                },500);
            }
        });
    });

    muteBtn.onclick=()=>{soundEnabled=!soundEnabled; muteBtn.textContent=soundEnabled?"Sound ON":"Sound OFF";};
    startBtn.onclick=()=>{sequence=[]; playerSequence=[]; round=0; flashSpeed=600; waiting=false; document.getElementById("score").textContent="Round: 0"; setTimeout(nextRound,300);};
    restartBtn.onclick=()=>{overlay.style.display="none"; startBtn.click();};

    (async()=>{await loadSounds();})();
})();
