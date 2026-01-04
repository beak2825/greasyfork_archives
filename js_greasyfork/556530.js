// ==UserScript==
// @name         FV - Tic Tac Toe Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      36.9
// @description  Escape the pirate crew by beating them at tic-tac-toe! Win each level to proceed. Lose and you restart.
// @match        https://www.furvilla.com/villager/35165
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556530/FV%20-%20Tic%20Tac%20Toe%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556530/FV%20-%20Tic%20Tac%20Toe%20Mini-Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const target = document.querySelector('.villager-data-info-info-wide .profanity-filter') || document.querySelector('.villager-data-info-wide .profanity-filter');
        if(!target) return;

        // =============================
        // HTML + CSS
        // =============================
        target.innerHTML = `
        <div id="ticTacToeGame">
            <style>
                /* General Styles */
                #ticTacToeGame { font-family: 'Trebuchet MS', sans-serif; text-align: center; }

                /* Splash Screen */
                #splash {
                    background: url('https://www.furvilla.com/img/villages/world.png') center/cover no-repeat;
                    padding: 20px; border-radius: 6px;
                }
                #splashOverlay {
                    background: rgba(255,255,255,0.85); padding: 15px; border-radius: 6px;
                }
                #splashOverlay h2 { font-weight:bold; color:#222; margin-bottom:10px; }
                #splashOverlay p { font-weight:bold; color:#222; margin-bottom:15px; }

                /* Furvilla */
                a.furvillaBtn {
                    display: inline-block; text-decoration:none; color:white;
                    background:#4a90e2; padding:8px 16px; border-radius:3px;
                    font-weight:bold; font-size:16px; cursor:pointer; border:1px solid #3a78c2;
                    margin-top:10px; transition: background 0.2s, transform 0.1s;
                }
                a.furvillaBtn:hover { background:#357ABD; transform: translateY(-1px); }

                /*  VS Overlay */
                #vsOverlay {
                    display:none; position:relative;
                    background: url('https://www.furvilla.com/img/villages/world.png') center/cover no-repeat;
                    border-radius:6px; padding:20px; min-height:550px;
                }

                /* Header with Player & CPU */
                #vsHeader {
                    display:flex; justify-content:space-between; align-items:center;
                    margin:20px; background: rgba(0,0,0,0.45); padding:10px 20px; border-radius:6px;
                }
                #vsHeader .side { display:flex; align-items:center; }
                #vsHeader img {
                    width:50px; height:50px; border-radius:6px; margin-right:10px;
                    border:2px solid #fff; box-shadow:0 0 4px rgba(0,0,0,0.5);
                    transition: transform 0.2s;
                }
                #vsHeader img:hover { transform:scale(1.05); }
                #vsHeader span { font-weight:bold; font-size:20px; color:#fff; margin-left:4px; }

                /* Game Board */
                #boardContainer {
                    position:relative; margin:20px auto; padding:20px;
                    background: rgba(0,0,0,0.65); border-radius:6px; display:flex; justify-content:center;
                }
                #board {
                    display:grid; grid-template-columns: repeat(3,80px);
                    grid-template-rows: repeat(3,80px); gap:10px; justify-content:center;
                }
                .cell {
                    background: rgba(60,60,60,0.85); display:flex; align-items:center; justify-content:center;
                    cursor:pointer; border-radius:6px; transition: background 0.2s;
                }
                .cell:hover { background: rgba(80,80,80,0.85); }

                /* CPU Thinking */
                #cpuThinking {
                    position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
                    color:white; font-weight:bold; z-index:5; display:none;
                }

                /* Level Overlay */
                #levelOverlay {
                    position:absolute; top:0; left:0; right:0; bottom:0;
                    background: rgba(0,0,0,0.65); display:flex; flex-direction:column;
                    align-items:center; justify-content:center; color:white; z-index:10;
                    border-radius:6px; padding:20px; text-align:center;
                }
                #levelOverlay .overlayBox {
                    background: rgba(255,255,255,0.85); padding:15px; border-radius:6px; max-width:300px;
                }
                #levelOverlay p { margin:10px 0; font-weight:bold; font-size:18px; color:#333; }
                #flavorText { margin-bottom:10px; font-size:16px; color:#444; font-style:italic; }

                /* Center Level Buttons */
                #levelOverlay .overlayBox a.furvillaBtn {
                    display:inline-block; margin:10px auto 0 auto; float:none;
                }
            </style>

            <!-- Splash Screen -->
            <div id="splash">
                <div id="splashOverlay">
                    <h2>Tic-Tac-Toe Escape</h2>
                    <p>Escape the pirate crew by beating them at tic-tac-toe! Win each level to proceed. Lose and you restart.</p>
                    <a id="startBtn" class="furvillaBtn" href="javascript:void(0)">Start Game</a>
                </div>
            </div>

            <!-- VS Overlay -->
            <div id="vsOverlay">
                <div id="vsHeader">
                    <div class="side" id="userSide">
                        <img id="userIcon" src="">
                        <span id="userName"></span> (Coral)
                    </div>
                    <div class="side" id="cpuSide">
                        <img id="cpuIcon" src="">
                        <span id="cpuName"></span> (Abyssal)
                    </div>
                </div>
                <div id="boardContainer">
                    <div id="board"></div>
                    <div id="cpuThinking">CPU is thinking...</div>
                    <div id="levelOverlay">
                        <div class="overlayBox">
                            <p id="flavorText"></p>
                            <p id="levelResultText"></p>
                            <a id="nextBtn" class="furvillaBtn" href="javascript:void(0)">Next</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;


        // Variables

        const splash = document.getElementById('splash');
        const vsOverlay = document.getElementById('vsOverlay');
        const board = document.getElementById('board');
        const cpuThinking = document.getElementById('cpuThinking');
        const levelOverlay = document.getElementById('levelOverlay');
        const flavorText = document.getElementById('flavorText');
        const levelResultText = document.getElementById('levelResultText');
        const cpuIcon = document.getElementById('cpuIcon');
        const cpuName = document.getElementById('cpuName');
        const userIcon = document.getElementById('userIcon');
        const userName = document.getElementById('userName');
        let startBtn = document.getElementById('startBtn');
        let nextBtn = document.getElementById('nextBtn');

        const activeVillagerIcon = document.querySelector('.widget .villager-avatar img')?.src || "";
        const userPanelName = document.querySelector('.widget .user-info h4 a')?.innerText || "Player";
        userName.textContent = userPanelName;
        userIcon.src = activeVillagerIcon;

        const Xstamp = "https://www.furvilla.com/img/items/7/7115-dark-coral-krakling-stamp.png";
        const Ostamp = "https://www.furvilla.com/img/items/7/7114-abyssal-krakling-stamp.png";

        // CPUs

const cpuPools = {
    easy: [
        {
            name: "Canine",
            img: "https://www.furvilla.com/img/villagers/0/159-1-th.png",
            loseFlavor: "Pawsitively unbeatable, aren’t I?",
            winFlavor: "You really raised the woof!"
        },
        {
            name: "Cat",
            img: "https://www.furvilla.com/img/villagers/0/159-4-th.png",
            loseFlavor: "A purr-fect game!",
            winFlavor: "Meowch! Better luck next time."
        },
        {
            name: "Rabbit",
            img: "https://www.furvilla.com/img/villagers/0/159-6-th.png",
            loseFlavor: "A hare-raising challenge for you!",
            winFlavor: "You're hopping off the plank!"
        }
    ],
    normal: [
        {
            name: "Fox",
            img: "https://www.furvilla.com/img/villagers/0/159-2-th.png",
            loseFlavor: "You were vixen to win!",
            winFlavor: "You’re quite foxy to pull that off!"
        },
        {
            name: "Dragon",
            img: "https://www.furvilla.com/img/villagers/0/159-3-th.png",
            loseFlavor: "You're on fire!",
            winFlavor: "The scales were stacked against you!"
        },
        {
            name: "Horse",
            img: "https://www.furvilla.com/img/villagers/0/159-5-th.png",
            loseFlavor: "I’ve got the reins on this match!",
            winFlavor: "You had neigh-ry a chance!"
        }
    ],
    boss: [
        {
            name: "Boss",
            img: "https://www.furvilla.com/img/villagers/0/159-12-th.png",
            loseFlavor: "I must’ve been flying blind on that one.",
            winFlavor: "You played well, but I had the upper wing"
        }
            ]
        };

        let currentLevel = 0;
        const levels = ["easy","normal","normal","boss"];
        let cpu, currentPlayer="user", boardCells=[];

        // Board and gameplay functions

        function initBoard(){
            board.innerHTML="";
            boardCells=[];
            for(let i=0;i<9;i++){
                const cell=document.createElement('div');
                cell.className="cell";
                cell.dataset.index=i;
                cell.addEventListener('click',()=>handleMove(i));
                board.appendChild(cell);
                boardCells.push(cell);
            }
        }

        function handleMove(i){
            const cell = boardCells[i];
            if(cell.dataset.taken || currentPlayer!=="user") return;
            placeStamp(cell,Xstamp);
            cell.dataset.taken="user";
            if(checkWin("user")) return endLevel(true);
            if(isDraw()) return endLevel(null);
            currentPlayer="cpu";
            cpuThinking.style.display="block";
            setTimeout(cpuMove,700);
        }

        function cpuMove(){
            const levelType = levels[currentLevel];
            let moveIndex;
            if(levelType==="boss"){ moveIndex = bossMove(); }
            else if(levelType==="normal"){ moveIndex = normalMove(); }
            else{
                const emptyCells = boardCells.filter(c=>!c.dataset.taken);
                moveIndex = parseInt(emptyCells[Math.floor(Math.random()*emptyCells.length)].dataset.index);
            }
            const cell = boardCells[moveIndex];
            placeStamp(cell,Ostamp);
            cell.dataset.taken="cpu";
            cpuThinking.style.display="none";
            if(checkWin("cpu")) return endLevel(false);
            if(isDraw()) return endLevel(null);
            currentPlayer="user";
        }

        function bossMove(){
            const empty = boardCells.map((c,i)=>!c.dataset.taken? i : null).filter(v=>v!==null);
            const winCombo = findBestMove("cpu");
            if(winCombo>=0) return winCombo;
            const block = findBestMove("user");
            if(block>=0) return block;
            if(!boardCells[4].dataset.taken) return 4;
            return empty[Math.floor(Math.random()*empty.length)];
        }

        function normalMove(){
            const empty = boardCells.map((c,i)=>!c.dataset.taken? i : null).filter(v=>v!==null);
            if(Math.random()<0.5){
                const block = findBestMove("user");
                if(block>=0) return block;
            }
            return empty[Math.floor(Math.random()*empty.length)];
        }

        function findBestMove(player){
            const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for(const combo of combos){
                const marks = combo.map(i=>boardCells[i].dataset.taken===player? player : null);
                const countPlayer = marks.filter(m=>m===player).length;
                const countEmpty = combo.filter(i=>!boardCells[i].dataset.taken).length;
                if(countPlayer===2 && countEmpty===1){
                    for(const i of combo){
                        if(!boardCells[i].dataset.taken) return i;
                    }
                }
            }
            return -1;
        }

        function checkWin(player){
            const combos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            return combos.some(c=>c.every(i=>boardCells[i].dataset.taken===player));
        }

        function isDraw(){ return boardCells.every(c=>c.dataset.taken); }

        function endLevel(userWon){
            levelOverlay.style.display="flex";
            flavorText.textContent="";
            if(userWon===true){
                if(currentLevel===levels.length-1){
                    levelResultText.textContent="You Win! The pirates let you go free and keep the stamps as souvenirs!";
                    nextBtn.textContent="Play Again";
                    currentLevel=0;
                } else {
                    levelResultText.textContent=`Level Complete!`;
                    if(cpu.winFlavor) flavorText.textContent=`You defeated ${cpu.name}! ${cpu.loseFlavor || ""}`;
                    nextBtn.textContent="Next Level";
                    currentLevel++;
                }
            } else if(userWon===false){
                levelResultText.textContent=`Level Lost!`;
                flavorText.textContent=cpu.winFlavor || `${cpu.name} won!`;
                nextBtn.textContent="Retry Level";
            } else{
                levelResultText.textContent=`Draw! Retry level.`;
                flavorText.textContent="";
                nextBtn.textContent="Retry Level";
            }
        }

        function startLevel(){
            levelOverlay.style.display="none";
            currentPlayer="user";
            cpuThinking.style.display="none";
            vsOverlay.style.display="block";
            initBoard();

            // Pick random CPU
            const levelType = levels[currentLevel];
            const pool = cpuPools[levelType];
            cpu = pool[Math.floor(Math.random()*pool.length)];
            cpuName.textContent = cpu.name;
            cpuIcon.src = cpu.img;
        }

        // Event Listeners
        startBtn.addEventListener('click', e=>{
            e.preventDefault();
            splash.style.display="none";
            startLevel();
        });

        nextBtn.addEventListener('click', e=>{
            e.preventDefault();
            startLevel();
        });

        function placeStamp(cell,src){
            const img=document.createElement('img');
            img.src=src; img.style.width='70px'; img.style.height='70px';
            img.style.opacity='0'; img.style.transform='translateY(-10px)'; img.style.transition='all 0.3s ease';
            cell.appendChild(img);
            setTimeout(()=>{img.style.opacity='1'; img.style.transform='translateY(0)';},50);
        }

    });
})();
