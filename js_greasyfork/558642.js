// ==UserScript==
// @name         FV - Kitty Picross Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      2.4
// @description  Play picross (nonogram) with Wyll! Game works on /villager/456131
// @match        https://www.furvilla.com/villager/456131
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558642/FV%20-%20Kitty%20Picross%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/558642/FV%20-%20Kitty%20Picross%20Mini-Game.meta.js
// ==/UserScript==

(function() {
    const target = document.querySelector('.villager-description .profanity-filter');
    if (!target) return;

    const container = document.createElement("div");
    container.id = "wyll-nonogram-container";
    target.innerHTML = "";
    target.appendChild(container);

    const style = document.createElement("style");
    style.textContent = `
    #wyll-nonogram-container {
        position: relative;
        width: 100%;
        font-family: Trebuchet MS, sans-serif;
        margin-top: 20px;
        display: flex;
        justify-content: center; 
    }

    #wyll-game-wrap {
        position: relative;
        width: max-content;
        padding: 120px 80px 50px 60px;
        background: #fff;
        border-radius: 12px;
        display: inline-block;
        text-align: center;
    }

    #wyll-board-area {
        position: relative;
        width: 350px;
        height: 350px;
        display: grid;
        grid-template-columns: repeat(10, 35px);
        grid-template-rows: repeat(10, 35px);
        background: #fff;
        border: 4px solid black;
        margin: 0 auto;
        z-index: 1;
    }

    .wyll-cell {
        position: relative;
        border: 1px solid #aaa;
        background: #fff;
        cursor: pointer;
        text-align: center;
        user-select: none;
    }

    .wyll-cell.hovered::before,
    .wyll-cell.hovered::after {
        content: '';
        position: absolute;
        background: rgba(109, 86, 184, 0.3);
        z-index: 2;
    }
    .wyll-cell.hovered::before {
        width: 100%; height: 2px; top: 50%; left: 0; transform: translateY(-50%);
    }
    .wyll-cell.hovered::after {
        width: 2px; height: 100%; top: 0; left: 50%; transform: translateX(-50%);
    }

    .filled { background: #6d56b8 !important; }
    .wrong { background: rgba(255,0,0,0.55) !important; }
    .flagged { font-weight:bold; font-size:20px; color:#261b55 !important; }

    .thick-right { border-right: 3px solid black !important; }
    .thick-bottom { border-bottom: 3px solid black !important; }

    #wyll-clues-top {
        position: absolute;
        top: 40px;
        left: 60px;
        display: grid;
        grid-template-columns: repeat(10, 35px);
        justify-items: center;
        align-items: end;
        width: 350px;
        font-size: 13px;
        color: #2d256b;
        font-weight: bold;
        z-index: 2;
    }
    .clue-col {
        display:flex;
        flex-direction:column;
        justify-content:flex-end;
        text-align:center;
        white-space:pre-line;
    }

    #wyll-clues-left {
        position: absolute;
        top: 120px;
        left: 0px;
        display: grid;
        grid-template-rows: repeat(10, 35px);
        justify-items: end;
        align-items: center;
        font-size: 13px;
        color: #2d256b;
        white-space: nowrap;
        padding-right:5px;
        z-index: 2;
        font-weight: bold;
    }

    #wyll-buttons {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    #wyll-buttons button {
        padding: 7px 16px;
        color: black;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition:0.2s;
    }
    #wyll-buttons button:hover { background: #ede8ff; }

    #wyll-bottombar {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        gap: 30px;
        font-size: 20px;
        font-weight: bold;
        color: #2c2059;
    }
    .wyll-heart { color:#c22; font-size:24px; }
    .wyll-heart.dead { color:#777; }

    #wyll-companion {
        position: absolute;
        right: -40px;
        bottom: 50px;
        width: 150px;
        pointer-events: none;
        z-index: 3;
    }
    #wyll-img { width: 150px; display:block; }

    #wyll-chat {
        position:absolute;
        right: -40px;
        bottom: 190px;
        background:white;
        border:2px solid #e6a277;
        border-radius:10px;
        padding:10px 14px;
        width:150px;
        font-size:14px;
        color:#1e1750;
        box-shadow:0 0 8px rgba(80,60,130,0.25);
        display:none;
        pointer-events: none;
        z-index: 4;
        opacity: 1;
        transition: opacity 0.5s ease;
    }

    @keyframes wyllBounce {
        0%{transform:translateY(0);}
        30%{transform:translateY(-14px);}
        60%{transform:translateY(0);}
    }
    .bounce { animation: wyllBounce 0.6s ease; }
    `;
    document.head.appendChild(style);

    container.innerHTML = `
    <div id="wyll-game-wrap">
        <div id="wyll-clues-top"></div>
        <div id="wyll-clues-left"></div>
        <div id="wyll-board-area"></div>
        <div id="wyll-buttons">
            <button id="mode-btn">Mode: Fill</button>
            <button id="reload-btn">Restart</button>
            <button id="howto-btn">How to Play</button>

        </div>
        <div id="wyll-bottombar">
            <div id="wyll-timer">0:00</div>
            <div id="wyll-hearts"></div>
        </div>
        <div id="wyll-companion">
            <img id="wyll-img" src="https://www.furvilla.com/img/villagers/0/918-4.png">
            <div id="wyll-chat"></div>
        </div>
    </div>
    `;

    const SIZE = 10;
    let solution = [], filled = [], flagged = [];
    let mode = "fill", timer=0, timerInt=null, hearts=3, started=false;
    let gameOver = false;

    function startTimer(){
        if(started) return;
        started=true; timer=0;
        timerInt = setInterval(()=>{
            timer++;
            const m=Math.floor(timer/60), s=timer%60;
            document.getElementById("wyll-timer").textContent = m+":"+(s<10?"0":"")+s;
        },1000);
    }

    function drawHearts(){
        const hb = document.getElementById("wyll-hearts"); hb.innerHTML="";
        for(let i=0;i<3;i++){
            const span = document.createElement("span");
            span.className = "wyll-heart"+(i<hearts?"":" dead");
            span.textContent="❤";
            hb.appendChild(span);
        }
    }

    function generateBoard(){
        let b=[]; for(let r=0;r<SIZE;r++){ let row=[]; for(let c=0;c<SIZE;c++) row.push(Math.random()<0.5?1:0); b.push(row); } return b;
    }

    function getRowClues(row){ let clues=[],count=0; for(let v of row){ if(v===1) count++; else if(count>0){ clues.push(count); count=0;} } if(count>0) clues.push(count); return clues.length?clues:[0]; }
    function getColClues(col){ return getRowClues(col); }

    function buildBoard(){
        solution = generateBoard();
        filled = Array.from({length:SIZE},()=>Array(SIZE).fill(0));
        flagged = Array.from({length:SIZE},()=>Array(SIZE).fill(0));
        const area = document.getElementById("wyll-board-area");
        area.innerHTML="";
        for(let r=0;r<SIZE;r++){
            for(let c=0;c<SIZE;c++){
                const td = document.createElement("div");
                td.className="wyll-cell";
                td.dataset.row=r;
                td.dataset.col=c;
                if(c===4) td.classList.add("thick-right");
                if(r===4) td.classList.add("thick-bottom");
                td.addEventListener("click",()=>clickCell(r,c,td));
                td.addEventListener("mouseover",()=>td.classList.add("hovered"));
                td.addEventListener("mouseout",()=>td.classList.remove("hovered"));
                area.appendChild(td);
            }
        }
        const topDiv = document.getElementById("wyll-clues-top"); topDiv.innerHTML="";
        for(let c=0;c<SIZE;c++){
            const div=document.createElement("div"); div.className="clue-col";
            div.textContent = getColClues(solution.map(r=>r[c])).join("\n");
            topDiv.appendChild(div);
        }
        const leftDiv = document.getElementById("wyll-clues-left"); leftDiv.innerHTML="";
        for(let r=0;r<SIZE;r++){
            const div=document.createElement("div"); div.className="clue-row";
            div.textContent = getRowClues(solution[r]).join(" ");
            leftDiv.appendChild(div);
        }
    }

    function clickCell(r,c,el){
    if(gameOver) return;
    startTimer();

    if(mode==="fill"){
        if(solution[r][c]===1){
            filled[r][c]=1; el.classList.add("filled");
        } else {
            hearts--; drawHearts();
            el.classList.add("wrong");
            setTimeout(()=>el.classList.remove("wrong"),1000);
        }
    } else {
        flagged[r][c]=!flagged[r][c];
        el.textContent = flagged[r][c]?"X":"";
        if(flagged[r][c]) el.classList.add("flagged");
    }

    checkLineCompletion(); // <-- new feature
    checkWinLose();
}

// Check all rows and columns for full completion
function checkLineCompletion(){
    let chatTriggered = false;

    // Check rows
    for(let r=0;r<SIZE;r++){
        let rowFilled = true;
        for(let c=0;c<SIZE;c++){
            if(solution[r][c]===1 && filled[r][c]!==1){
                rowFilled = false;
                break;
            }
        }
        if(rowFilled){
            for(let c=0;c<SIZE;c++){
                if(solution[r][c]===0 && !flagged[r][c]){
                    flagged[r][c]=true;
                    const cell = document.querySelector(`.wyll-cell[data-row='${r}'][data-col='${c}']`);
                    if(cell){
                        cell.textContent = "X";
                        cell.classList.add("flagged");
                    }
                }
            }
            if(!chatTriggered){
                showWyllChat("You got it!");
                chatTriggered = true;
            }
        }
    }

    // Check columns
    for(let c=0;c<SIZE;c++){
        let colFilled = true;
        for(let r=0;r<SIZE;r++){
            if(solution[r][c]===1 && filled[r][c]!==1){
                colFilled = false;
                break;
            }
        }
        if(colFilled){
            for(let r=0;r<SIZE;r++){
                if(solution[r][c]===0 && !flagged[r][c]){
                    flagged[r][c]=true;
                    const cell = document.querySelector(`.wyll-cell[data-row='${r}'][data-col='${c}']`);
                    if(cell){
                        cell.textContent = "X";
                        cell.classList.add("flagged");
                    }
                }
            }
            if(!chatTriggered){
                showWyllChat("You got it!");
                chatTriggered = true;
            }
        }
    }
}


    function checkWinLose(){
        let won = true;
        for(let r=0;r<SIZE;r++){ for(let c=0;c<SIZE;c++){ if(filled[r][c]!==solution[r][c]) won=false; } }
        if(won){ endGame("You Win!"); return; }
        if(hearts<=0){ endGame("Game Over"); return; }
    }

    function endGame(msg){
        gameOver = true;
        clearInterval(timerInt);
        showWyllChat(msg);
    }

    function showWyllChat(msg){
        const chat = document.getElementById("wyll-chat");
        chat.textContent=msg; chat.style.display="block"; chat.style.opacity=1;
        const img = document.getElementById("wyll-img");
        img.classList.add("bounce");
        setTimeout(()=>img.classList.remove("bounce"),600);
        setTimeout(()=>{
            chat.style.opacity=0;
            setTimeout(()=>chat.style.display="none",500);
        },3000);
    }

    document.getElementById("mode-btn").onclick=()=>{
        if(gameOver) return;
        mode = mode==="fill"?"flag":"fill";
        document.getElementById("mode-btn").textContent="Mode: "+(mode==="fill"?"Fill":"Flag");
        showWyllChat("Switched mode to "+(mode==="fill"?"Fill":"Flag"));
    };
    document.getElementById("reload-btn").onclick=()=>location.reload();
    document.getElementById("howto-btn").onclick=()=>showWyllChat("Fill in a grid using number clues on each row and column. The numbers tell you how many consecutive squares to fill.");

    drawHearts();
    buildBoard();
})();
