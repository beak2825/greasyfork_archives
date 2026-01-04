// ==UserScript==
// @name         FV - Shuffle Mini-Game
// @namespace    // @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      39.4
// @description  Play shuffle (3 in a row) against other users. Go for the highest score while completing quests.
// @match        https://www.furvilla.com/villager/455848
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556694/FV%20-%20Shuffle%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556694/FV%20-%20Shuffle%20Mini-Game.meta.js
// ==/UserScript==


(function () {
"use strict";

/* -------------------------------------------------------
   BASIC DOM ROOT
--------------------------------------------------------*/
const root = document.querySelector(".villager-data-desc");
if (!root) return;

/* -------------------------------------------------------
   AUDIO
--------------------------------------------------------*/
const sound = {
    m3:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo3.mp3"),
    m4:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo4.mp3"),
    m5:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo5.mp3"),
    q:   new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3")
};
Object.values(sound).forEach(a => { a.preload="auto"; a.volume=0.45; });

function play(a){
    const clone = a.cloneNode();  // ensures simultaneous playback
    clone.volume = a.volume;
    clone.play().catch(()=>{});
}

/* -------------------------------------------------------
   GAME VARIABLES
--------------------------------------------------------*/
const items = [
    { name:"leaf",  img:"https://www.furvilla.com/img/items/7/7630-crystal-leaf.png" },
    { name:"star",  img:"https://www.furvilla.com/img/items/7/7628-crystal-star.png" },
    { name:"lotus", img:"https://www.furvilla.com/img/items/7/7627-crystal-lotus.png" },
    { name:"shell", img:"https://www.furvilla.com/img/items/7/7629-crystal-shell.png" },
    { name:"stash", img:"https://www.furvilla.com/img/items/7/7631-crystal-mustache.png" }
];

let board = [];
let score = 0;
let timer = 60;
let timerHandle = null;
let first = null;
let dropping = false;
const W = 8, H = 8;

/* Quests */
let quests = [
    { item: items[0], goal:10, current:0, done:false },
    { item: items[1], goal:10, current:0, done:false }
];

/* -------------------------------------------------------
   HELPER
--------------------------------------------------------*/
const randItem = () => items[Math.floor(Math.random()*items.length)];
const getTile = (x,y) => board[y]?.[x] ?? null;

/* -------------------------------------------------------
   STYLES
--------------------------------------------------------*/
const css = `
.game-board     { display:grid; grid-template-columns:repeat(8,50px); gap:5px; margin:auto; }
.game-tile      { width:50px; height:50px; border-radius:12px; cursor:pointer;
                  background-size:cover; background-color:#fff2; position:relative;
                  border:2px solid #ffffff80; transition:transform .12s ease; }
.game-tile.shake{ animation:shake .25s; }
@keyframes shake{
    0%{ transform:translateX(0); }
    33%{ transform:translateX(-6px); }
    66%{ transform:translateX(6px); }
    100%{ transform:translateX(0); }
}`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

    const scorePopCss = document.createElement("style");
scorePopCss.textContent = `
.score-pop {
    position:absolute;
    color:#ffcc00;
    font-size:22px;
    font-weight:bold;
    text-shadow: 0 0 6px #000;
    pointer-events:none;
    animation: scoreFloat 1s ease-out forwards;
}
@keyframes scoreFloat {
    0% { opacity:1; transform:translateY(0); }
    100% { opacity:0; transform:translateY(-40px); }
}
`;
document.head.appendChild(scorePopCss);

function spawnScorePop(x, y, amount) {
    const pop = document.createElement("div");
    pop.className = "score-pop";
    pop.textContent = "+" + amount;
    pop.style.left = (x * 55 + 20) + "px";
    pop.style.top = (y * 55 + 20) + "px";
    pop.style.position = "absolute";
    document.querySelector(".game-board").appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
}

const questAnimCSS = document.createElement("style");
questAnimCSS.textContent = `
.quest-complete-anim {
    animation: questComplete 1.2s ease-out forwards;
}
@keyframes questComplete {
    0% { transform:scale(1); opacity:1; }
    50% { transform:scale(1.4); opacity:1; }
    100% { transform:scale(0.6); opacity:0; }
}
`;
document.head.appendChild(questAnimCSS);

/* -------------------------------------------------------
   ROOT UI
--------------------------------------------------------*/

const wrap = document.createElement("div");
wrap.style = `
  position:relative; width:fit-content; margin:auto; padding:20px;
  border:10px solid #ffffff80; border-radius:25px;
  box-shadow:0 4px 20px #0002;
  background-image:url('https://www.furvilla.com/img/villages/world.png');
  background-size:cover;
`;
root.appendChild(wrap);

const overlay = document.createElement("div");
overlay.style = `
  position:absolute; inset:0; pointer-events:none; z-index:1;
  background:linear-gradient(to bottom, rgba(188,153,170,.4), rgba(124,129,164,.53));
`;
wrap.appendChild(overlay);

const ui = document.createElement("div");
ui.style.position="relative";
ui.style.zIndex=5;
wrap.appendChild(ui);

/* -------------------------------------------------------
   LEADERBOARD
--------------------------------------------------------*/
const leaderboard = document.createElement("div");
leaderboard.style = `
  margin-top:30px; padding:15px; background:#ffffff10;
  border-radius:15px; border:2px solid #0001;
  max-height:300px; overflow-y:auto;
`;
root.appendChild(leaderboard);

leaderboard.innerHTML = `
<h3 style="text-align:center;">Leaderboard</h3>
<table style="
    width:100%;
    text-align:center;
    border-collapse:collapse;
    font-size:16px;
    background:#ffffffaa;
">
<thead>
<tr>
  <th style="border:1px solid #333; padding:6px; background:#ddd;">User</th>
  <th style="border:1px solid #333; padding:6px; background:#ddd;">Score</th>
</tr>
</thead>
<tbody id="lb"></tbody>
</table>

`;

function refreshLB(){
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vThU3o3KxZLewnbOM2tCcEKpKnFITgOnfsK4RZ_QSUqmiL4RkNC7b1YPxxklyYM263LiR9lByz2R61A/pub?gid=1235220703&single=true&output=csv")
      .then(r=>r.text())
      .then(text=>{
        const rows = text.trim().split("\n").map(r=>r.split(","));
        const head = rows[0].map(h=>h.trim().toLowerCase());
        const u = head.indexOf("username");
        const s = head.indexOf("finalscore");

        const best = {};
        rows.slice(1).forEach(r=>{
            const name=r[u].trim(), sc=+r[s];
            if(!best[name] || sc>best[name].FinalScore)
                best[name]={Username:name, FinalScore:sc};
        });

        const sorted = Object.values(best).sort((a,b)=>b.FinalScore - a.FinalScore);
        const tb = document.getElementById("lb");
        tb.innerHTML = sorted.slice(0,50).map(e=>`
<tr>
  <td style="border:1px solid #333; padding:5px;">${e.Username}</td>
  <td style="border:1px solid #333; padding:5px;">${e.FinalScore}</td>
</tr>
        `).join("");
    });
}
refreshLB();
setInterval(refreshLB,10000);

/* -------------------------------------------------------
   UI HEADER
--------------------------------------------------------*/
const header = document.createElement("div");
header.style = `
  display:flex; justify-content:center; gap:50px; margin-bottom:15px;
  color:#222; font-family:'Arial',sans-serif;
  display:none; /* hide initially */
`;


header.innerHTML = `
  <div id="timer" style="font-weight:bold; font-size:40px;">01:00</div>
  <div id="score" style="font-weight:bold; font-size:32px;">Score: 0</div>
`;
const timerFlashStyle = document.createElement("style");
timerFlashStyle.textContent = `
@keyframes timerFlash {
    0% { color:#ff0000; transform:scale(1); }
    50% { color:#ff7777; transform:scale(1.15); }
    100% { color:#ff0000; transform:scale(1); }
}
.timer-warning {
    animation: timerFlash 0.75s infinite;
}
`;
document.head.appendChild(timerFlashStyle);

ui.appendChild(header);

/* QUEST BOX */
const questBox = document.createElement("div");
questBox.style = "display:flex; gap:20px; justify-content:center; margin-bottom:10px;";
ui.appendChild(questBox);

/* -------------------------------------------------------
   BOARD CREATION
--------------------------------------------------------*/
const boardDiv = document.createElement("div");
boardDiv.className = "game-board";
ui.appendChild(boardDiv);

function newBoard(){
    board = Array.from({length:H}, ()=>Array.from({length:W}, randItem));
    removeInitialMatches();
    renderBoard();
    checkMatches();
}

function updateQuestDOM(q) {
    const questEl = questBox.querySelector(`div[data-quest='${quests.indexOf(q)}'] .quest-count`);
    if (questEl) questEl.textContent = `${q.current}/${q.goal}`;
}

/* -------------------------------------------------------
   RENDERING
--------------------------------------------------------*/
function renderBoard(){
    boardDiv.innerHTML="";
    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            const t = document.createElement("div");
            t.className="game-tile";
            t.dataset.x=x;
            t.dataset.y=y;
            t.style.backgroundImage=`url(${board[y][x].img})`;
            t.onclick = tileClick;
            boardDiv.appendChild(t);
        }
    }
}

function renderStable(){
    const tiles = boardDiv.querySelectorAll(".game-tile");
    tiles.forEach(tile=>{
        const x=+tile.dataset.x, y=+tile.dataset.y;
        const d = getTile(x,y);
        tile.style.transform="none";
        tile.style.backgroundImage = d ? `url(${d.img})` : "none";
    });
}

/* -------------------------------------------------------
   REMOVE STARTING MATCHES
--------------------------------------------------------*/
function removeInitialMatches(){
    let changed=true;
    while(changed){
        changed=false;
        for(let y=0;y<H;y++){
            for(let x=0;x<W;x++){
                const t=getTile(x,y);
                if(!t) continue;

                // horizontal
                if(x<=W-3 &&
                   getTile(x+1,y)?.name===t.name &&
                   getTile(x+2,y)?.name===t.name){
                    board[y][x+2]=randItem();
                    changed=true;
                }

                // vertical
                if(y<=H-3 &&
                   getTile(x,y+1)?.name===t.name &&
                   getTile(x,y+2)?.name===t.name){
                    board[y+2][x]=randItem();
                    changed=true;
                }
            }
        }
    }
}

/* -------------------------------------------------------
   SWAP + VALIDATE
--------------------------------------------------------*/
function isAdj(a,b){
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1;
}

function tileClick(e){
    if(timer<=0 || dropping) return;

    const x=+e.currentTarget.dataset.x;
    const y=+e.currentTarget.dataset.y;

    if(!first){
        first={x,y,el:e.currentTarget};
        e.currentTarget.style.outline="3px solid yellow";
        return;
    }

    first.el.style.outline="none";

    if(!isAdj(first,{x,y})){
        first=null;
        return;
    }

    instantSwap(first.x,first.y,x,y);
    first=null;
}

/* instant swap + shake on fail */
function instantSwap(x1,y1,x2,y2){
    const t1 = getTile(x1,y1);
    const t2 = getTile(x2,y2);

    // swap in data
    [board[y1][x1], board[y2][x2]] = [t2,t1];

    if(!createsMatch(x1,y1) && !createsMatch(x2,y2)){
        // invalid → shake both tiles, swap back
        const a = boardDiv.querySelector(`[data-x='${x1}'][data-y='${y1}']`);
        const b = boardDiv.querySelector(`[data-x='${x2}'][data-y='${y2}']`);
        a.classList.add("shake");
        b.classList.add("shake");
        setTimeout(()=>{ a.classList.remove("shake"); b.classList.remove("shake"); },250);

        // revert
        [board[y1][x1], board[y2][x2]] = [t1,t2];
        return;
    }

    renderStable();
    checkMatches();
}

function createsMatch(x,y){
    const t=getTile(x,y);
    if(!t) return false;

    let h=1, v=1;

    for(let i=x-1; i>=0 && getTile(i,y)?.name===t.name; i--) h++;
    for(let i=x+1; i<W  && getTile(i,y)?.name===t.name; i++) h++;
    for(let j=y-1; j>=0 && getTile(x,j)?.name===t.name; j--) v++;
    for(let j=y+1; j< H && getTile(x,j)?.name===t.name; j++) v++;

    return h>=3 || v>=3;
}

/* -------------------------------------------------------
   MATCH DETECTION + CLEAR
--------------------------------------------------------*/
function checkMatches(){
    const matched = [];

    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            const t=getTile(x,y);
            if(!t) continue;

            // horizontal
            let len=1;
            for(let i=x+1;i<W && getTile(i,y)?.name===t.name;i++) len++;
            if(len>=3) for(let k=0;k<len;k++) matched.push([x+k,y,len]);

            // vertical
            len=1;
            for(let j=y+1;j<H && getTile(x,j)?.name===t.name;j++) len++;
            if(len>=3) for(let k=0;k<len;k++) matched.push([x,y+k,len]);
        }
    }

    if(matched.length===0){
        if(!hasMove()){ shuffle(); }
        return;
    }

    // unique positions
    const uniq = {};
    matched.forEach(([x,y,l])=> uniq[`${x},${y}`]={x,y,l});
    const list = Object.values(uniq);

    // scoring + quests + SFX
list.forEach(p=>{
    const t = getTile(p.x, p.y);
    if(!t) return;

    // QUEST INCREMENT
quests.forEach(q=>{
    if(!q.done && q.item.name === t.name){
        q.current += 1;
        updateQuestDOM(q); // <-- immediate update
        if(q.current >= q.goal) finishQuest(q);
    }
});



    // SCORE
    let gained = 0;
    if(p.l===3) gained = 10;
    else if(p.l===4) gained = 25;
    else gained = 50+(p.l-5)*10;
    score += gained;

    spawnScorePop(p.x, p.y, gained);

    // PLAY SOUND
    if(p.l===3) play(sound.m3);
    else if(p.l===4) play(sound.m4);
    else play(sound.m5);

    // CLEAR TILE
    board[p.y][p.x] = null;
});


    updateScore();
    renderStable();
    gravity();
}

/* -------------------------------------------------------
   GRAVITY (physics-like fall)
--------------------------------------------------------*/
function gravity(){
    dropping=true;

    for(let x=0;x<W;x++){
        let write=H-1;
        for(let y=H-1;y>=0;y--){
            if(board[y][x]){
                board[write][x]=board[y][x];
                write--;
            }
        }
        for(let y=write;y>=0;y--) board[y][x]=randItem();
    }

    // small fall animation
    const tiles = boardDiv.querySelectorAll(".game-tile");
    tiles.forEach(tile=>{
        tile.style.transform="translateY(12px)";
        setTimeout(()=> tile.style.transform="none",60);
    });

    setTimeout(()=>{
        renderStable();
        dropping=false;
        checkMatches();
    },120);
}

/* -------------------------------------------------------
   SHUFFLE
--------------------------------------------------------*/
function hasMove(){
    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            if(x<W-1){
                [board[y][x],board[y][x+1]]=[board[y][x+1],board[y][x]];
                const ok = createsMatch(x,y) || createsMatch(x+1,y);
                [board[y][x],board[y][x+1]]=[board[y][x+1],board[y][x]];
                if(ok) return true;
            }
            if(y<H-1){
                [board[y][x],board[y+1][x]]=[board[y+1][x],board[y][x]];
                const ok = createsMatch(x,y) || createsMatch(x,y+1);
                [board[y][x],board[y+1][x]]=[board[y+1][x],board[y][x]];
                if(ok) return true;
            }
        }
    }
    return false;
}

function shuffle(){
    const flat = board.flat();
    for(let i=flat.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [flat[i],flat[j]]=[flat[j],flat[i]];
    }
    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            board[y][x] = flat[y*W+x];
        }
    }
    removeInitialMatches();
    renderStable();
    if(!hasMove()) shuffle();
}

/* -------------------------------------------------------
   QUESTS
--------------------------------------------------------*/
function renderQuests(){
    questBox.innerHTML = "";
    quests.forEach((q,i)=>{
        const el = document.createElement("div");
        el.dataset.quest = i; // link DOM to quest object
        el.className = "quest"; // needed for animations
        el.style = `...`;
        el.innerHTML = `
  <img src="${q.item.img}" width="32" height="32">
  <span class="quest-count" style="color:#222; font-weight:bold;">${q.current}/${q.goal}</span>
`;


        questBox.appendChild(el);
    });
}


function finishQuest(q){
    if(q.done) return;
    q.done = true;
    timer += 10;
    play(sound.q);

    const idx = quests.indexOf(q);
    const box = questBox.querySelector(`div[data-quest='${idx}']`);
    if (box) {
        box.classList.add("quest-complete-anim");
        setTimeout(() => box.remove(), 1200);
    }

    newQuest(idx); // replace the completed quest in the same position
}

function newQuest(replaceIndex){
    // exclude all quest items currently in the DOM (active quests)
    const activeQuestNames = quests.filter(q => !q.done).map(q => q.item.name);

    const available = items.filter(i => !activeQuestNames.includes(i.name));
    if(available.length === 0) return; // no new quest possible

    const item = available[Math.floor(Math.random() * available.length)];
    const prevGoal = quests.length ? quests[quests.length-1].goal : 10;

    const newQ = {
        item: item,
        goal: prevGoal + 7 + Math.floor(Math.random() * 4),
        current: 0,
        done: false
    };

    if(replaceIndex !== undefined){
        quests[replaceIndex] = newQ;
    } else {
        quests.push(newQ);
        replaceIndex = quests.length - 1;
    }

    // Render the new quest in the correct spot
    const el = document.createElement("div");
    el.dataset.quest = replaceIndex;
    el.className = "quest";
    el.innerHTML = `
        <img src="${newQ.item.img}" width="32" height="32">
        <span class="quest-count" style="color:#222; font-weight:bold;">${newQ.current}/${newQ.goal}</span>
    `;
    // insert at the correct position in the DOM
    if(replaceIndex < questBox.children.length){
        questBox.insertBefore(el, questBox.children[replaceIndex]);
    } else {
        questBox.appendChild(el);
    }
}


/* -------------------------------------------------------
   SCORE + TIMER
--------------------------------------------------------*/
function updateScore(){
    document.getElementById("score").textContent=`Score: ${score}`;
}

function startTimer(){
    timerHandle=setInterval(()=>{
        timer--;
        if(timer<=0){
            clearInterval(timerHandle);
            timerHandle=null;
            endGame();
        }
        const m=String(Math.floor(timer/60)).padStart(2,"0");
        const s=String(timer%60).padStart(2,"0");
        const timerEl = document.getElementById("timer");
        timerEl.textContent = `${m}:${s}`;
        if(timer <= 10) timerEl.classList.add("timer-warning");
        else timerEl.classList.remove("timer-warning");

    },1000);
}

/* -------------------------------------------------------
   END GAME
--------------------------------------------------------*/
function endGame(){
    dropping=true;

    const over=document.createElement("div");
    over.style=`
      position:absolute; inset:0; background:#0008; color:#fff;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      border-radius:25px; font-size:24px; z-index:1000;
    `;
    over.innerHTML=`
      <h2 style="font-size:36px;margin-bottom:10px;">Game Over</h2>
      <p>Your score: <span style="color:#ff0">${score}</span></p>
    `;

    const b=document.createElement("button");
    b.textContent="Restart";
    b.style=`padding:10px 20px; margin-top:15px; border:none; border-radius:12px; cursor:pointer;`;
    b.onclick=()=>{ over.remove(); reset(); };

    over.appendChild(b);
    wrap.appendChild(over);

    submitScore();
}

function reset(){
    score=0;
    timer=60;
    first=null;
    quests = [
        { item: items[0], goal:10, current:0, done:false },
        { item: items[1], goal:10, current:0, done:false }
    ];
    updateScore();
    renderQuests();
    newBoard();
    startTimer();
    dropping=false;
}

/* -------------------------------------------------------
   SUBMIT SCORE
--------------------------------------------------------*/
function submitScore(){
    const user = document.querySelector(".widget .user-info h4")
                 ?.innerText.replace(/^hi[, ]*/i,"").split(" ")[0] || "Unknown";
    const fd = new FormData();
    fd.append("entry.2028297946",user);
    fd.append("entry.216995303",score);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSdIUPQmgapM11SMgFycG8pcNxr9L1Rk0bRHTzCblRsSLDXmjQ/formResponse",{
        method:"POST", mode:"no-cors", body:fd
    });
}

/* -------------------------------------------------------
   START BUTTON
--------------------------------------------------------*/
const start = document.createElement("button");
start.textContent="Start Game";
start.style = `
  padding:14px 28px;
  font-size:22px;
  font-weight:bold;
  background:#ffffffcc;
  color:#222;
  border-radius:12px;
  border:2px solid #0003;
  margin: 0 auto 20px auto;
  display:block;
  cursor:pointer;
`;
ui.insertBefore(start,header);

start.onclick=()=>{
    start.style.display="none";
    header.style.display="flex"; // <-- show score & timer
    renderQuests();
    newBoard();
    startTimer();
};


})();
