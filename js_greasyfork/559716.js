// ==UserScript==
// @name         FV - Cloud's Gumdrop Snake Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Play a test round of snake with Cloud! Leaderboard available! Game works on /villager/56068
// @match        https://www.furvilla.com/villager/56068
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559716/FV%20-%20Cloud%27s%20Gumdrop%20Snake%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/559716/FV%20-%20Cloud%27s%20Gumdrop%20Snake%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Target
    let target = null;
    document.querySelectorAll(".profanity-filter").forEach(div => {
        if (div.textContent.includes("testGameHere")) target = div;
    });
    if (!target) return;
    target.innerHTML = "";

    // HTML 
    const wrapper = document.createElement("div");
    wrapper.id = "snakeWrapper";
    wrapper.innerHTML = `
<style>
/* ================== Container ================== */
#snakeWrapper {
    font-family: 'Trebuchet MS', sans-serif;
    margin-top: 20px;
    text-align: center;
}

#snakeContainer {
    position: relative;
    width: 480px;
    height: 480px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fdfaf6;
    padding: 15px;
    border-radius: 8px;
    border: 4px solid #1a75ff;
}

#snakeCanvas {
    background: url('https://i.pinimg.com/564x/31/1b/16/311b16816cd2802bcba0ba23eaad6a5f.jpg') no-repeat center center;
    background-size: cover;
    border: 4px solid #000;
    width: 450px;
    height: 450px;
    display: none;
}

/* ================== Cloud ================== */
.flow-helper {
    position: absolute;
    right: -150px;
    bottom: -20px;
    width: 150px;
    pointer-events: none;
}

.flow-text {
    position: absolute;
    right: -150px;
    bottom: 200px;
    background: #ffffff;
    padding: 8px 12px;
    border: 2px solid #4aa1ff;
    border-radius: 6px;
    max-width: 160px;
    font-size: 14px;
    color: #111 !important;
}

@keyframes flowBounce {
    0% { transform: translateY(0); }
    30% { transform: translateY(-12px); }
    60% { transform: translateY(0); }
}

.flow-bounce {
    animation: flowBounce 0.6s ease;
}

/* ================== Color Picker ================== */
#colorBar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 15px;
    justify-items: center;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
}

.colorButton {
    display: flex;
    flex-direction: column;
    color: #111 !important;
    align-items: center;
    padding: 5px 5px;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid #aaa;
    background: #eaeaea;
}

.colorButton:hover {
    background: #dcdcdc;
    color: #111 !important;
}

.colorPreview {
    display: flex;
    gap: 6px;
    margin-bottom: 5px;
}

.colorPreview img {
    width: 50px;
    height: 50px;
}

/* ================== Buttons ================== */
#snakeButtons {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
}

#snakeButtons button {
    padding: 7px 12px;
    color: #111 !important;
    border-radius: 5px;
    cursor: pointer;
    background: #eaeaea;
    border: 1px solid #aaa;
}

#snakeButtons button:hover {
    background: #dcdcdc;
    color: #111 !important;
}

#scoreDisplay {
    color: inherit !important;
    font-weight: bold;
    margin-right: 10px;
}

/* ================== Leaderboard ================== */
#leaderboardWrapper {
    margin-top: 15px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    border: 2px solid #1a75ff;
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Trebuchet MS', sans-serif;
}

#leaderboardWrapper h3 {
    background: #1a75ff;
    color: #fff;
    margin: 0;
    padding: 6px;
    font-size: 16px;
}

#leaderboardWrapper table {
    width: 100%;
    border-collapse: collapse;
    color: inherit;
}

#leaderboardWrapper th,
#leaderboardWrapper td {
    padding: 6px 8px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

#leaderboardWrapper tbody {
    max-height: 200px;
    overflow-y: auto;
    display: block;
}

#leaderboardWrapper tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

#leaderboardWrapper thead,
#leaderboardWrapper tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}
</style>

<div id="snakeContainer">
    <div id="colorBar"></div>
    <canvas id="snakeCanvas" width="450" height="450"></canvas>
    <img class="flow-helper" src="https://www.furvilla.com/img/villagers/0/667-4.png">
    <div class="flow-text" id="flowText">Cloud: Ready when you are!</div>
</div>

<div id="snakeButtons">
    <span id="scoreDisplay">Score: 0</span>
    <button id="restartBtn">Restart</button>
    <button id="changeSnakeBtn">Change Snake</button>
    <button id="howToPlayBtn">How to Play</button>
</div>

<div id="leaderboardWrapper">
    <h3>Leaderboard</h3>
    <table>
        <thead><tr><th>#</th><th>Username</th><th>Score</th></tr></thead>
        <tbody id="leaderboardTable"></tbody>
    </table>
</div>
`;

    target.appendChild(wrapper);

    // ---------------------- Cloud & Score ----------------------
    const flowText = document.getElementById("flowText");
    const flowImg = document.querySelector(".flow-helper");
    const scoreDisplay = document.getElementById("scoreDisplay");

    function cloudSay(msg) {
        flowText.innerText = msg;
        flowImg.classList.remove("flow-bounce");
        void flowImg.offsetWidth;
        flowImg.classList.add("flow-bounce");
    }

    // Snakes
    const colors = {
        blue: {head: "https://www.furvilla.com/img/items/7/7291-jumbo-blue-gumdrop-pal.png", body: "https://www.furvilla.com/img/items/7/7284-jumbo-blue-gumdrop.png"},
        green: {head: "https://www.furvilla.com/img/items/7/7290-jumbo-green-gumdrop-pal.png", body: "https://www.furvilla.com/img/items/7/7240-jumbo-green-gumdrop.png"},
        purple: {head: "https://www.furvilla.com/img/items/7/7292-jumbo-purple-gumdrop-pal.png", body: "https://www.furvilla.com/img/items/7/7285-jumbo-purple-gumdrop.png"},
        red: {head: "https://www.furvilla.com/img/items/7/7294-jumbo-red-gumdrop-pal.png", body: "https://www.furvilla.com/img/items/7/7286-jumbo-red-gumdrop.png"}
    };

    const colorBar = document.getElementById("colorBar");
    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");

    let snake = [];
    let direction = {x:1, y:0};
    let food = {};
    let boostFood = null;
    let grow = 0;
    let score = 0;
    let snakeHeadImg, snakeBodyImg;
    let gameInterval;
    let selectedColor = null;
    let gameOver = false;
    const zoomGridSize = 30;
    const maxCols = Math.floor(canvas.width / zoomGridSize);
    const maxRows = Math.floor(canvas.height / zoomGridSize);

    // Buttons
    Object.keys(colors).forEach(color => {
        const btn = document.createElement("div");
        btn.className = "colorButton";
        const preview = document.createElement("div"); preview.className = "colorPreview";
        const headImg = document.createElement("img"); headImg.src = colors[color].head;
        const bodyImg = document.createElement("img"); bodyImg.src = colors[color].body;
        preview.appendChild(headImg); preview.appendChild(bodyImg);
        const label = document.createElement("div"); label.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        btn.appendChild(preview); btn.appendChild(label);
        btn.onclick = () => {
            selectedColor = color;
            colorBar.style.display = "none";
            canvas.style.display = "block";
            startCountdown(startGame);
        };
        colorBar.appendChild(btn);
    });

    // Countdown 
    const countdownOverlay = document.createElement("div");
    countdownOverlay.style.position="absolute";
    countdownOverlay.style.top=0;
    countdownOverlay.style.left=0;
    countdownOverlay.style.width="100%";
    countdownOverlay.style.height="100%";
    countdownOverlay.style.display="flex";
    countdownOverlay.style.justifyContent="center";
    countdownOverlay.style.alignItems="center";
    countdownOverlay.style.fontSize="60px";
    countdownOverlay.style.fontWeight="bold";
    countdownOverlay.style.color="#fff";
    countdownOverlay.style.background="rgba(0,0,0,0.5)";
    countdownOverlay.style.zIndex="10";
    countdownOverlay.style.display="none";
    countdownOverlay.id="countdownOverlay";
    document.getElementById("snakeContainer").appendChild(countdownOverlay);

    function startCountdown(callback){
        let n=3;
        countdownOverlay.style.display="flex";
        countdownOverlay.textContent=n;
        const timer = setInterval(()=>{
            n--;
            if(n>0) countdownOverlay.textContent=n;
            else if(n===0) countdownOverlay.textContent="Go!";
            else {
                clearInterval(timer);
                countdownOverlay.style.display="none";
                callback(selectedColor);
            }
        },1000);
    }

    // ---------------------- Start Game
    function startGame(selectedColor){
        gameOver=false;
        if(gameInterval) clearInterval(gameInterval);
        score=0;
        scoreDisplay.textContent = `Score: ${score}`;

        let loadedCount=0;
        snakeHeadImg = new Image(); snakeHeadImg.src = colors[selectedColor].head;
        snakeBodyImg = new Image(); snakeBodyImg.src = colors[selectedColor].body;
        const appleImg = new Image(); appleImg.src="https://www.furvilla.com/img/items/4/4123-shiny-apple.png";
        const boostAppleImg = new Image(); boostAppleImg.src="https://www.furvilla.com/img/items/4/4116-royal-fire-apple.png";

        const images=[snakeHeadImg,snakeBodyImg,appleImg,boostAppleImg];
        images.forEach(img=>img.onload=()=>{loadedCount++; if(loadedCount===images.length)initGame();});

        function initGame(){
            snake=[{x:5,y:5},{x:4,y:5},{x:3,y:5}];
            direction={x:1,y:0};
            grow=0;
            gameOver=false;

            function getRandomPosition(){return {x:Math.floor(Math.random()*maxCols),y:Math.floor(Math.random()*maxRows)};}
            function placeFood(){food=getRandomPosition(); boostFood=Math.random()<0.2?getRandomPosition():null;}
            placeFood();

            function draw(){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                const overlap=6;
                for(let i=snake.length-1;i>0;i--){
                    ctx.drawImage(snakeBodyImg,snake[i].x*zoomGridSize-overlap,snake[i].y*zoomGridSize-overlap,zoomGridSize+overlap*2,zoomGridSize+overlap*2);
                }
                ctx.drawImage(snakeHeadImg,snake[0].x*zoomGridSize-overlap,snake[0].y*zoomGridSize-overlap,zoomGridSize+overlap*2,zoomGridSize+overlap*2);
                ctx.drawImage(appleImg,food.x*zoomGridSize,food.y*zoomGridSize,zoomGridSize,zoomGridSize);
                if(boostFood)ctx.drawImage(boostAppleImg,boostFood.x*zoomGridSize,boostFood.y*zoomGridSize,zoomGridSize,zoomGridSize);
                scoreDisplay.textContent=`Score: ${score}`;
            }

            function moveSnake(){
                if(gameOver) return;
                const newHead={x:snake[0].x+direction.x, y:snake[0].y+direction.y};
                if(newHead.x<0||newHead.y<0||newHead.x>=maxCols||newHead.y>=maxRows||
                   snake.some(seg=>seg.x===newHead.x&&seg.y===newHead.y)){
                    gameOver=true;
                    cloudSay(`Cloud: Game Over! Score: ${score}. Click Restart to play again!`);
                    submitScore(score);
                    return;
                }
                snake.unshift(newHead);
                if(newHead.x===food.x&&newHead.y===food.y){grow+=1;score+=1;placeFood();}
                if(boostFood&&newHead.x===boostFood.x&&newHead.y===boostFood.y){grow+=2;score+=3;boostFood=null;}
                if(grow>0) grow--; else snake.pop();
            }

            document.onkeydown=function(e){
                if(gameOver) return;
                if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
                if(e.key==="ArrowUp"&&direction.y!==1) direction={x:0,y:-1};
                if(e.key==="ArrowDown"&&direction.y!==-1) direction={x:0,y:1};
                if(e.key==="ArrowLeft"&&direction.x!==1) direction={x:-1,y:0};
                if(e.key==="ArrowRight"&&direction.x!==-1) direction={x:1,y:0};
            }

            gameInterval=setInterval(()=>{moveSnake(); draw();},150);
            cloudSay("Cloud: Go! Eat those apples!");
        }
    }

    document.getElementById("restartBtn").onclick = () => { if(selectedColor) startCountdown(startGame); };
    document.getElementById("changeSnakeBtn").onclick = () => { colorBar.style.display="grid"; canvas.style.display="none"; cloudSay("Cloud: Pick a new snake!"); };
    document.getElementById("howToPlayBtn").onclick = () => { cloudSay("Use arrow keys to move. Eat apples to grow. Gold apples give extra growth. Avoid walls/self."); };

// ---------------------- Leaderboard
const leaderboardBody = document.getElementById("leaderboardTable");
const sheetCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEFpqgJxGLvqeJexEhnIoL_w89iZrJfSQNQ6XwWdKU7wl2FWsDcVaP9KyFYtpHwVRrgzDkRMaxV0dF/pub?gid=860556023&single=true&output=csv";

async function updateLeaderboard() {
    try {
        const res = await fetch(sheetCSV);
        const text = await res.text();

        const lines = text.trim().split("\n");
        if (lines.length <= 1) {
            leaderboardBody.innerHTML = `<tr><td colspan="3">No scores found.</td></tr>`;
            return;
        }

        const data = {};

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.includes(",") ? line.split(",") : line.split("\t");
            const username = parts[1]?.trim();
            const score = parseInt(parts[2], 10);

            if (!username || isNaN(score)) continue;

            if (!data[username] || score > data[username]) data[username] = score;
        }

        const sorted = Object.keys(data)
            .map(u => ({ username: u, score: data[u] }))
            .sort((a, b) => b.score - a.score);

        leaderboardBody.innerHTML = "";
        if (sorted.length === 0) {
            leaderboardBody.innerHTML = `<tr><td colspan="3">No scores found.</td></tr>`;
        } else {
            sorted.forEach((row, i) => {
                const tr = document.createElement("tr");
                tr.style.color = "inherit";
                tr.innerHTML = `<td>${i + 1}</td><td>${row.username}</td><td>${row.score}</td>`;
                leaderboardBody.appendChild(tr);
            });
        }

    } catch (e) {
        console.error("Leaderboard fetch failed", e);
        leaderboardBody.innerHTML = `<tr><td colspan="3">Error loading leaderboard.</td></tr>`;
    }
}

// Initial load + refresh every 30s
updateLeaderboard();
setInterval(updateLeaderboard, 10000);

// ---------------------- Submit
function submitScore(score) {
    const username = getUsername();
    if (!username) return;

    const formData = new FormData();
    formData.append("entry.1454441053", username);
    formData.append("entry.133418209", score);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSdNcxqBJ8w0TF9X6tdUc-F167ugH6TrEeUSU_NgLZULUwRUVw/formResponse", {
        method: "POST",
        mode: "no-cors",
        body: formData
    }).catch(e => console.error("Score submission failed", e))
      .finally(() => {
          // Refresh leaderboard immediately after submission
          setTimeout(updateLeaderboard, 1000);
      });
}


function getUsername() {
    const userPanel = document.querySelector(".widget .user-info h4 a");
    return userPanel ? userPanel.textContent.trim() : "Unknown";
}


})();
