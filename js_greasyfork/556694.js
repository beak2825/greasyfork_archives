// ==UserScript==
// @name         FV - Shuffle Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      40.1
// @description  Play shuffle (3 in a row) against other users. Go for the highest score while completing quests. Game works on /villager/456132
// @match        https://www.furvilla.com/villager/456132
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556694/FV%20-%20Shuffle%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556694/FV%20-%20Shuffle%20Mini-Game.meta.js
// ==/UserScript==

(function () {
"use strict";


const root = document.querySelector(".villager-data-desc");
if (!root) return;

const profanityFilter = root.querySelector(".profanity-filter");
if (profanityFilter && profanityFilter.textContent.includes("testGameHere")) {
    profanityFilter.textContent = "";
    console.log("Cleared testGameHere text from profanity filter");
}

/* -------------------------------------------------------
   AUDIO
--------------------------------------------------------*/
const sound = {
    m3:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo3.mp3"),
    m4:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo4.mp3"),
    m5:  new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo5.mp3"),
    q:   new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3"),
    bomb: new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleCombo4.mp3")
};
Object.values(sound).forEach(a => { a.preload="auto"; a.volume=0.45; });

function play(a){
    const clone = a.cloneNode();
    clone.volume = a.volume;
    clone.play().catch(()=>{});
}

/* -------------------------------------------------------
   GAME VAR
--------------------------------------------------------*/
const items = [
    { name:"leaf",  img:"https://www.furvilla.com/img/items/7/7630-crystal-leaf.png", value:10 },
    { name:"star",  img:"https://www.furvilla.com/img/items/7/7628-crystal-star.png", value:10 },
    { name:"lotus", img:"https://www.furvilla.com/img/items/7/7627-crystal-lotus.png", value:10 },
    { name:"shell", img:"https://www.furvilla.com/img/items/7/7629-crystal-shell.png", value:10 },
    { name:"stash", img:"https://www.furvilla.com/img/items/7/7631-crystal-mustache.png", value:10 }
];

// Bomb item
const bombItem = {
    name:"bomb",
    img:"https://www.furvilla.com/img/items/6/6685-utility-crystal-orinova.png",
    isBomb: true,
    value: 100
};

let board = [];
let score = 0;
let timer = 60;
let timerHandle = null;
let first = null;
let dropping = false;
const W = 8, H = 8;
let bombChance = 0.02;

/* Quests */
let quests = [
    { item: items[0], goal:10, current:0, done:false },
    { item: items[1], goal:10, current:0, done:false }
];

let activeInfoPanel = null;


const randItem = () => {
    if (Math.random() < bombChance) {
        return bombItem;
    }
    return items[Math.floor(Math.random()*items.length)];
};

const getTile = (x,y) => board[y]?.[x] ?? null;


const css = `
/* Main container - Simple Sudoku Flow style */
.game-container {
    position: relative;
    width: fit-content;
    margin: 20px auto;
    padding: 15px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #cccccc;
    max-width: 800px;
    font-family: Arial, sans-serif;
}

/* Game content */
.game-content {
    width: 100%;
}

/* Info panel */
.info-panel {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 320px;
    background: white;
    border-radius: 6px;
    border: 1px solid #4CAF50;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 15px;
    z-index: 100;
    display: none;
}

.info-panel.active {
    display: block;
}

.info-panel h4 {
    color: #333;
    margin: 0 0 10px 0;
    font-size: 14px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.info-content {
    font-size: 12px;
    color: #555;
    line-height: 1.4;
}

.info-content ul {
    margin: 8px 0;
    padding-left: 18px;
}

.info-content li {
    margin-bottom: 4px;
}

.close-info {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #f0f0f0;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 3px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-info:hover {
    background: #e0e0e0;
}

/* Info buttons - Simple */
.info-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 15px;
}

.info-button {
    padding: 6px 12px;
    font-size: 12px;
    background: #f0f0f0;
    color: #333;
    border-radius: 4px;
    border: 1px solid #ccc;
    cursor: pointer;
    min-width: 100px;
    text-align: center;
}

.info-button:hover {
    background: #e0e0e0;
}

.info-button.active {
    background: #4CAF50;
    color: white;
    border-color: #45a049;
}

/* Header area */
.game-header {
    display: flex;
    justify-content: center;
    gap: 30px;
    background: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
}

/* Stats boxes - Simple */
.stat-box {
    background: white;
    padding: 8px 15px;
    border-radius: 4px;
    text-align: center;
    min-width: 100px;
    border: 1px solid #ddd;
}

.stat-label {
    font-size: 11px;
    color: #666;
    font-weight: bold;
    margin-bottom: 3px;
    text-transform: uppercase;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

/* Timer box */
#timer {
    border-color: #ff6b6b;
}

/* Score box */
#score-box {
    border-color: #4CAF50;
}

/* Game board */
.game-board {
    display: grid;
    grid-template-columns: repeat(8, 50px);
    gap: 4px;
    margin: auto;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #ddd;
}

/* Game tiles */
.game-tile {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    border: 1px solid #ccc;
    background-color: white;
}

.game-tile:hover {
    border-color: #888;
}

.game-tile.selected {
    border-color: #4CAF50;
    background-color: #f0fff0;
}

/* Bomb tile */
.game-tile.bomb {
    border-color: #ff4444;
    background-color: #fff0f0;
}

/* Shake animation */
.game-tile.shake {
    animation: shake 0.25s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    33% { transform: translateX(-4px); }
    66% { transform: translateX(4px); }
}

/* Quest area */
.quest-area {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 15px 0;
    flex-wrap: wrap;
}

.quest-item {
    background: white;
    padding: 8px 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #ddd;
    min-width: 110px;
}

.quest-count {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    min-width: 60px;
    text-align: center;
}

/* Score pop animation */
.score-pop {
    position: absolute;
    color: #ff6b6b;
    font-size: 16px;
    font-weight: bold;
    pointer-events: none;
    animation: scoreFloat 1s ease-out forwards;
    z-index: 1000;
}

@keyframes scoreFloat {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-30px); }
}

/* Bomb explosion animation */
.bomb-pop {
    position: absolute;
    color: #ff4444;
    font-size: 18px;
    font-weight: bold;
    pointer-events: none;
    animation: bombFloat 1.2s ease-out forwards;
    z-index: 1000;
}

@keyframes bombFloat {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
}

/* Quest complete animation */
.quest-complete-anim {
    animation: questComplete 1.2s ease-out forwards;
}

@keyframes questComplete {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
}

/* Start button */
.start-button {
    padding: 10px 25px;
    font-size: 16px;
    background: #4CAF50;
    color: white;
    border-radius: 4px;
    border: 1px solid #45a049;
    cursor: pointer;
    display: block;
    margin: 0 auto 15px auto;
}

.start-button:hover {
    background: #45a049;
}

/* Timer warning */
.timer-warning {
    background: #fff0f0 !important;
    border-color: #ff6b6b !important;
}

/* Game over screen */
.game-over {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 18px;
    z-index: 2000;
}

.game-over h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #ffd700;
}

.restart-button {
    padding: 8px 20px;
    margin-top: 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: #4CAF50;
    color: white;
    font-size: 14px;
}

.restart-button:hover {
    background: #45a049;
}

/* Leaderboard */
.leaderboard-container {
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #ddd;
    max-height: 300px;
    overflow-y: auto;
}

.leaderboard-container h3 {
    text-align: center;
    color: #333;
    margin-bottom: 10px;
    font-size: 16px;
}
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

/* -------------------------------------------------------
  UI
--------------------------------------------------------*/
const container = document.createElement("div");
container.className = "game-container";
root.appendChild(container);

/* Game content */
const gameContent = document.createElement("div");
gameContent.className = "game-content";
container.appendChild(gameContent);

/* Info buttons */
const infoButtons = document.createElement("div");
infoButtons.className = "info-buttons";
infoButtons.innerHTML = `
    <button class="info-button" data-info="howToPlay">How to Play</button>
    <button class="info-button" data-info="pointValues">Point Values</button>
    <button class="info-button" data-info="quests">Quests</button>
    <button class="info-button" data-info="buffs">Buffs & Bonuses</button>
`;
gameContent.appendChild(infoButtons);

const header = document.createElement("div");
header.className = "game-header";
header.innerHTML = `
    <div class="stat-box" id="score-box">
        <div class="stat-label">Score</div>
        <div id="score" class="stat-value">0</div>
    </div>
    <div class="stat-box" id="timer">
        <div class="stat-label">Time</div>
        <div class="stat-value">01:00</div>
    </div>
`;
gameContent.appendChild(header);

/* Quest */
const questArea = document.createElement("div");
questArea.className = "quest-area";
gameContent.appendChild(questArea);

/* Game board */
const boardDiv = document.createElement("div");
boardDiv.className = "game-board";
gameContent.appendChild(boardDiv);

/* -------------------------------------------------------
   START
--------------------------------------------------------*/
const startButton = document.createElement("button");
startButton.className = "start-button";
startButton.textContent = "Start Game";
gameContent.insertBefore(startButton, header);

/* -------------------------------------------------------
   INFO CONTENT
--------------------------------------------------------*/
const infoContent = {
    howToPlay: {
        title: "How to Play",
        content: `
            <ul>
                <li><strong>Objective:</strong> Match 3+ crystals in a row to score points.</li>
                <li><strong>Controls:</strong> Click two adjacent crystals to swap them.</li>
                <li><strong>Scoring:</strong> More matches = more points (see Point Values)</li>
                <li><strong>Time:</strong> Complete quests to earn extra time.</li>
                <li><strong>Game Over:</strong> When the timer reaches 0</li>
            </ul>
        `
    },
    pointValues: {
        title: "Point Values",
        content: `
            <ul>
                <li><strong>3 in a row:</strong> 10 points per crystal</li>
                <li><strong>4 in a row:</strong> 25 points per crystal</li>
                <li><strong>5 in a row:</strong> 50 points per crystal</li>
                <li><strong>6+ in a row:</strong> +10 points for each extra crystal</li>
                <li><strong>Bomb Crystal:</strong> 100 points + clears 3x3 area</li>
                <li><strong>Quest Completion:</strong> +10 seconds</li>
            </ul>
            <p><strong>Note:</strong> Bomb chance increases each time you match one!</p>
        `
    },
    quests: {
        title: "Quest System",
        content: `
            <ul>
                <li><strong>Goal:</strong> Collect specific crystals to complete quests.</li>
                <li><strong>Reward:</strong> +10 seconds per completed quest.</li>
                <li><strong>Progression:</strong> Each new quest has higher goals.</li>
                <li><strong>Bombs:</strong> Bomb explosions count toward quests too!</li>
            </ul>
            <p>Quests spawn indefinitely so keep completing them for more time!</p>
        `
    },
    buffs: {
        title: "Buffs & Bonuses",
        content: `
            <ul>
                <li><strong>Bomb Crystals:</strong>
                    <ul>
                        <li>Start with 2% spawn chance.</li>
                        <li>Chance increases by 0.5% each match.</li>
                        <li>Max 10% spawn chance.</li>
                        <li>Clears 3x3 area when matched.</li>
                        <li>Gives 100 points.</li>
                    </ul>
                </li>
                <li><strong>Combo Bonuses:</strong>
                    <ul>
                        <li>Longer combos = bigger score pop-ups</li>
                        <li>Chain reactions possible with gravity</li>
                    </ul>
                </li>

            </ul>
        `
    }
};

/* -------------------------------------------------------
   INFO PANEL FUNCT
--------------------------------------------------------*/
function showInfoPanel(infoType) {
    let infoPanel = document.getElementById('infoPanel');
    if (!infoPanel) {
        infoPanel = document.createElement("div");
        infoPanel.id = "infoPanel";
        infoPanel.className = "info-panel";
        infoPanel.innerHTML = `
            <button class="close-info">×</button>
            <h4 id="infoTitle"></h4>
            <div class="info-content" id="infoContent"></div>
        `;
        gameContent.appendChild(infoPanel);
    }

    if (activeInfoPanel) {
        infoPanel.classList.remove('active');
        const activeBtn = infoButtons.querySelector(`.info-button.active`);
        if (activeBtn) activeBtn.classList.remove('active');
    }

    // Show new panel
    if (infoContent[infoType]) {
        document.getElementById('infoTitle').textContent = infoContent[infoType].title;
        document.getElementById('infoContent').innerHTML = infoContent[infoType].content;
        infoPanel.classList.add('active');

        // button state
        const btn = infoButtons.querySelector(`[data-info="${infoType}"]`);
        if (btn) btn.classList.add('active');

        activeInfoPanel = infoType;
    }
}

function hideInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.classList.remove('active');
        const activeBtn = infoButtons.querySelector(`.info-button.active`);
        if (activeBtn) activeBtn.classList.remove('active');
        activeInfoPanel = null;
    }
}

// Set button events
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('info-button')) {
        const infoType = e.target.dataset.info;
        if (activeInfoPanel === infoType) {
            hideInfoPanel();
        } else {
            showInfoPanel(infoType);
        }
    }

    if (e.target.classList.contains('close-info')) {
        hideInfoPanel();
    }
});

// Close panel instructions
document.addEventListener('click', function(e) {
    const infoPanel = document.getElementById('infoPanel');

    if (activeInfoPanel &&
        infoPanel &&
        !infoPanel.contains(e.target) &&
        !e.target.classList.contains('info-button')) {
        hideInfoPanel();
    }
});


const leaderboard = document.createElement("div");
leaderboard.className = "leaderboard-container";
leaderboard.innerHTML = `
    <h3>Leaderboard</h3>
    <table style="
        width:100%;
        text-align:center;
        border-collapse:collapse;
        font-size:12px;
        background:white;
    ">
    <thead>
    <tr>
        <th style="border:1px solid #ddd; padding:6px; background:#f5f5f5; color:#333;">Rank</th>
        <th style="border:1px solid #ddd; padding:6px; background:#f5f5f5; color:#333;">User</th>
        <th style="border:1px solid #ddd; padding:6px; background:#f5f5f5; color:#333;">Score</th>
    </tr>
    </thead>
    <tbody id="lb"></tbody>
    </table>
`;
root.appendChild(leaderboard);

/* -------------------------------------------------------
   GAME FUNC
--------------------------------------------------------*/
function newBoard(){
    board = Array.from({length:H}, ()=>Array.from({length:W}, randItem));
    removeInitialMatches();
    renderBoard();
    checkMatches();
}

function renderBoard(){
    boardDiv.innerHTML="";

    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            const t = document.createElement("div");
            t.className="game-tile";
            t.dataset.x=x;
            t.dataset.y=y;

            const tileData = board[y][x];
            t.style.backgroundImage=`url(${tileData.img})`;

            // Add bomb class if bomb
            if (tileData.isBomb) {
                t.classList.add("bomb");
            }

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
        tile.classList.remove("selected");

        // Update bomb class
        if (d && d.isBomb) {
            tile.classList.add("bomb");
        } else {
            tile.classList.remove("bomb");
        }
    });
}

function removeInitialMatches(){
    let changed=true;
    while(changed){
        changed=false;
        for(let y=0;y<H;y++){
            for(let x=0;x<W;x++){
                const t=getTile(x,y);
                if(!t) continue;

                if(x<=W-3 &&
                   getTile(x+1,y)?.name===t.name &&
                   getTile(x+2,y)?.name===t.name){
                    board[y][x+2]=randItem();
                    changed=true;
                }

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

function isAdj(a,b){
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1;
}

function tileClick(e){
    if(timer<=0 || dropping) return;

    const x=+e.currentTarget.dataset.x;
    const y=+e.currentTarget.dataset.y;

    if(!first){
        first={x,y,el:e.currentTarget};
        e.currentTarget.classList.add("selected");
        return;
    }

    first.el.classList.remove("selected");

    if(!isAdj(first,{x,y})){
        first=null;
        return;
    }

    instantSwap(first.x,first.y,x,y);
    first=null;
}

function instantSwap(x1,y1,x2,y2){
    const t1 = getTile(x1,y1);
    const t2 = getTile(x2,y2);

    [board[y1][x1], board[y2][x2]] = [t2,t1];

    if(!createsMatch(x1,y1) && !createsMatch(x2,y2)){
        const a = boardDiv.querySelector(`[data-x='${x1}'][data-y='${y1}']`);
        const b = boardDiv.querySelector(`[data-x='${x2}'][data-y='${y2}']`);
        a.classList.add("shake");
        b.classList.add("shake");
        setTimeout(()=>{
            a.classList.remove("shake");
            b.classList.remove("shake");
        },250);

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
    for(let i=x+1; i<W && getTile(i,y)?.name===t.name; i++) h++;
    for(let j=y-1; j>=0 && getTile(x,j)?.name===t.name; j--) v++;
    for(let j=y+1; j< H && getTile(x,j)?.name===t.name; j++) v++;

    return h>=3 || v>=3;
}

function checkMatches(){
    const matched = [];

    for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
            const t=getTile(x,y);
            if(!t) continue;

            let len=1;
            for(let i=x+1;i<W && getTile(i,y)?.name===t.name;i++) len++;
            if(len>=3) for(let k=0;k<len;k++) matched.push([x+k,y,len]);

            len=1;
            for(let j=y+1;j<H && getTile(x,j)?.name===t.name;j++) len++;
            if(len>=3) for(let k=0;k<len;k++) matched.push([x,y+k,len]);
        }
    }

    if(matched.length===0){
        if(!hasMove()){ shuffle(); }
        return;
    }

    const uniq = {};
    matched.forEach(([x,y,l])=> uniq[`${x},${y}`]={x,y,l});
    const list = Object.values(uniq);

    // Process matches
    list.forEach(p=>{
        const t = getTile(p.x, p.y);
        if(!t) return;

        // Check if bomb
        if (t.isBomb) {
            triggerBomb(p.x, p.y);
            return;
        }

        // item processing
        quests.forEach(q=>{
            if(!q.done && q.item.name === t.name){
                q.current += 1;
                updateQuestDOM(q);
                if(q.current >= q.goal) finishQuest(q);
            }
        });

        let gained = 0;
        if(p.l===3) gained = 10;
        else if(p.l===4) gained = 25;
        else gained = 50+(p.l-5)*10;
        score += gained;

        spawnScorePop(p.x, p.y, gained);

        if(p.l===3) play(sound.m3);
        else if(p.l===4) play(sound.m4);
        else play(sound.m5);

        board[p.y][p.x] = null;
    });

    updateScore();
    renderStable();
    gravity();
}

function triggerBomb(x, y) {
    play(sound.bomb);

    spawnBombPop(x, y);

    score += 100;
    spawnScorePop(x, y, 100);

    bombChance = Math.min(bombChance + 0.005, 0.1);

    // Clear 3x3 area around bomb
    const clearedPositions = [];
    for(let dy = -1; dy <= 1; dy++) {
        for(let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if(nx >= 0 && nx < W && ny >= 0 && ny < H) {
                const tile = getTile(nx, ny);
                if(tile && !tile.isBomb) {
                    quests.forEach(q=>{
                        if(!q.done && q.item.name === tile.name){
                            q.current += 1;
                            updateQuestDOM(q);
                            if(q.current >= q.goal) finishQuest(q);
                        }
                    });
                }

                // Clear tile
                board[ny][nx] = null;
                clearedPositions.push({x: nx, y: ny});
            }
        }
    }

    // Update score
    updateScore();

    clearedPositions.forEach(pos => {
        const tile = boardDiv.querySelector(`[data-x='${pos.x}'][data-y='${pos.y}']`);
        if(tile) {
            tile.style.opacity = "0.3";
            setTimeout(() => {
                tile.style.opacity = "1";
            }, 300);
        }
    });
}

function spawnBombPop(x, y) {
    const pop = document.createElement("div");
    pop.className = "bomb-pop";
    pop.textContent = "💥 BOOM!";
    pop.style.left = (x * 54 + 15) + "px";
    pop.style.top = (y * 54 + 15) + "px";
    boardDiv.appendChild(pop);
    setTimeout(() => pop.remove(), 1200);
}

function spawnScorePop(x, y, amount) {
    const pop = document.createElement("div");
    pop.className = "score-pop";
    pop.textContent = "+" + amount;
    pop.style.left = (x * 54 + 20) + "px";
    pop.style.top = (y * 54 + 20) + "px";
    boardDiv.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
}

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

    const tiles = boardDiv.querySelectorAll(".game-tile");
    tiles.forEach(tile=>{
        tile.style.transform="translateY(10px)";
        setTimeout(()=> tile.style.transform="none",80);
    });

    setTimeout(()=>{
        renderStable();
        dropping=false;
        checkMatches();
    },150);
}

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

function updateQuestDOM(q) {
    const questEl = questArea.querySelector(`div[data-quest='${quests.indexOf(q)}'] .quest-count`);
    if (questEl) questEl.textContent = `${q.current}/${q.goal}`;
}

function renderQuests(){
    questArea.innerHTML = "";
    quests.forEach((q,i)=>{
        const el = document.createElement("div");
        el.dataset.quest = i;
        el.className = "quest-item";
        el.innerHTML = `
            <img src="${q.item.img}" width="30" height="30" style="border-radius:4px;">
            <div class="quest-count">${q.current}/${q.goal}</div>
        `;
        questArea.appendChild(el);
    });
}

function finishQuest(q){
    if(q.done) return;
    q.done = true;
    timer += 10;
    play(sound.q);

    const box = questArea.querySelector(`div[data-quest='${quests.indexOf(q)}']`);
    if (box) {
        box.classList.add("quest-complete-anim");
        setTimeout(() => box.remove(), 1200);
    }

    // add new quests
    newQuest();
}

function newQuest(){
    const usedInActiveQuests = quests.filter(q => !q.done).map(q => q.item.name);

    const available = items.filter(i => !usedInActiveQuests.includes(i.name));

    if(available.length === 0) {
        const item = items[Math.floor(Math.random() * items.length)];
        const prevGoal = quests.length ? quests[quests.length-1].goal : 10;

        const newQ = {
            item: item,
            goal: prevGoal + 7 + Math.floor(Math.random() * 4),
            current: 0,
            done: false
        };

        quests.push(newQ);
    } else {
        // new quesr from available items
        const item = available[Math.floor(Math.random() * available.length)];
        const prevGoal = quests.length ? quests[quests.length-1].goal : 10;

        const newQ = {
            item: item,
            goal: prevGoal + 7 + Math.floor(Math.random() * 4),
            current: 0,
            done: false
        };

        quests.push(newQ);
    }

    // render quest
    const newQ = quests[quests.length-1];
    const i = quests.indexOf(newQ);
    const el = document.createElement("div");
    el.dataset.quest = i;
    el.className = "quest-item";
    el.innerHTML = `
        <img src="${newQ.item.img}" width="30" height="30" style="border-radius:4px;">
        <div class="quest-count">${newQ.current}/${newQ.goal}</div>
    `;
    questArea.appendChild(el);
}

function updateScore(){
    document.getElementById("score").textContent = score;
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
        const timerEl = document.getElementById("timer").querySelector(".stat-value");
        timerEl.textContent = `${m}:${s}`;

        const timerBox = document.getElementById("timer");
        if(timer <= 10) timerBox.classList.add("timer-warning");
        else timerBox.classList.remove("timer-warning");

    },1000);
}

function endGame(){
    dropping=true;

    const over=document.createElement("div");
    over.className="game-over";
    over.innerHTML=`
        <h2>Game Over!</h2>
        <div style="font-size:20px; margin:10px 0;">
            Final Score: <span style="color:#ffd700; font-size:24px;">${score}</span>
        </div>
        <button class="restart-button">Play Again</button>
    `;

    const restartBtn = over.querySelector(".restart-button");
    restartBtn.onclick=()=>{
        over.remove();
        reset();
    };

    gameContent.appendChild(over);
    submitScore();
}

function reset(){
    score=0;
    timer=60;
    first=null;
    bombChance = 0.02;
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
        tb.innerHTML = sorted.slice(0,50).map((e, idx)=>`
<tr style="${idx < 3 ? 'background:#f9f9f9;' : ''}">
  <td style="border:1px solid #ddd; padding:6px; font-weight:${idx < 3 ? '600' : 'normal'}; color:#333">${idx + 1}</td>
  <td style="border:1px solid #ddd; padding:6px; font-weight:${idx < 3 ? '600' : 'normal'}; color:#333">${e.Username}</td>
  <td style="border:1px solid #ddd; padding:6px; font-weight:${idx < 3 ? '600' : 'normal'}; color:#333">${e.FinalScore}</td>
</tr>
        `).join("");
    });
}
refreshLB();
setInterval(refreshLB,10000);


startButton.onclick=()=>{
    startButton.style.display="none";
    renderQuests();
    newBoard();
    startTimer();
};

})();