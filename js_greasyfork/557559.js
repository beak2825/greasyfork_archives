// ==UserScript==
// @name         FV - Tinsel's Gift Catcher Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.7
// @description  Tinsel has been hard at work since the click hit midnight for December 1st! Visit Tinsel and see if they have a gift waiting for you! You have 20 seconds to pick and only your first pick of the day will count.
// @author       necroan
// @match        https://www.furvilla.com/forums/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557559/FV%20-%20Tinsel%27s%20Gift%20Catcher%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/557559/FV%20-%20Tinsel%27s%20Gift%20Catcher%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSewyvvVBhsK-J7uAMHeo6QqFw44rUScnjvI-QZgxXqSsSMAtw/formResponse';
    const GOOGLE_SHEET_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSJmnV0Rlj7WqD_fiS2Q2hbMeLfMsdFcp3OgD3qwrWvrzcuz-jVOklVG4aIY8jyoOiZYIjIzthX_ho/pub?gid=2104076749&single=true&output=csv';

    // --- Helper Functions ---
    function getUser() {
        const panel = document.querySelector('.widget-header + .widget-content .user-info h4 a');
        if(!panel) return null;
        const username = panel.textContent.trim();
        const userID = panel.href.match(/profile\/(\d+)/)[1];
        return {username, userID};
    }

    // --- Sparkle Burst Effect ---
    function sparkleBurst(x, y) {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position:absolute;
                width:6px; height:6px;
                background: radial-gradient(circle, #fff, #ffd6f2);
                border-radius:50%;
                pointer-events:none;
                left:${x}px;
                top:${y}px;
                opacity:1;
                z-index:1000;
                transform: translate(-50%, -50%);
            `;
            container.appendChild(sparkle);

            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            let life = 0;

            const anim = setInterval(() => {
                life += 1;
                sparkle.style.left = (x + dx * life) + "px";
                sparkle.style.top = (y + dy * life) + "px";
                sparkle.style.opacity = (1 - life / 20).toString();
                if (life > 20) { clearInterval(anim); sparkle.remove(); }
            }, 16);
        }
    }

    // --- Gift catch sound ---
    const catchSound = new Audio("https://file.garden/ZSFPeOjepzq6H2X5/FurvillaSong/ShuffleComboComplete.mp3");
    catchSound.volume = 0.45;

    // --- Submit claim to Google Form ---
    function submitToGoogleForm(user, gift) {
        const data = new URLSearchParams();
        data.append('entry.932074168', user.username);
        data.append('entry.1100069812', user.userID);
        data.append('entry.1964686237', gift.src);

        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            body: data,
            mode: 'no-cors'
        }).then(() => console.log('Claim sent to Google Form!'))
          .catch(err => console.error('Error sending to Google Form:', err));
    }

    // --- Fetch CSV and return as array of claims ---
    async function fetchClaims() {
        try {
            const res = await fetch(GOOGLE_SHEET_CSV);
            const text = await res.text();
            const rows = text.split('\n').slice(1); // skip header
            const claims = [];
            rows.forEach(row => {
                const cols = row.split(',');
                if(cols.length < 4) return;
                claims.push({
                    time: cols[0],
                    username: cols[1],
                    userID: cols[2],
                    giftSrc: cols[3]
                });
            });
            return claims;
        } catch(err) {
            console.error('Error fetching CSV:', err);
            return [];
        }
    }

async function updateBoardFromCSV() {
    const board = document.querySelector('#recentGifts tbody');
    if(!board) return;
    board.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

    const claims = await fetchClaims();

    // Sort most recent first
    claims.sort((a,b) => new Date(b.time) - new Date(a.time));

    board.innerHTML = '';
    claims.forEach(c => {
        const tr = document.createElement('tr');
        const tdTime = document.createElement('td'); tdTime.textContent = c.time;
        const tdUser = document.createElement('td'); tdUser.textContent = c.username;

        // Display the actual gift image
        const tdGift = document.createElement('td');
        tdGift.innerHTML = `<img src="${c.giftSrc}" style="height:40px;">`;

        tr.appendChild(tdTime);
        tr.appendChild(tdUser);
        tr.appendChild(tdGift);
        board.appendChild(tr);
    });
}



    // --- Setup Game Container ---
    const target = document.querySelector('u');
    if(!target || target.textContent.trim()!=='gameGoesHere') return;

    const container = document.createElement('div');
    container.id='tinselGiftGame';
    container.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 800px;
        height: 500px;
        margin: 20px auto;
        background: url("https://cdn.wallpapersafari.com/47/36/CfS3Yo.jpg") center center / cover no-repeat;
        overflow: hidden;
        border-radius: 20px;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
    `;
    target.replaceWith(container);

    const tinselIconURL = "https://www.furvilla.com/img/villagers/0/220-4-th.png";

    // --- Christmas Cute Intro Overlay ---
    const gameOverlay = document.createElement('div');
    gameOverlay.style.cssText = `
        position: absolute;
        top:50%; left:50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 500px;
        background: rgba(255,255,255,0.95);
        border-radius: 25px;
        padding: 25px;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        gap:15px;
        text-align:center;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
        animation: overlayFade 0.8s ease;
        background-image: url('https://www.pngkey.com/png/detail/122-1226149_reddle-texture-semi-transparent-white-background.png');
        background-size: cover;
    `;
    gameOverlay.innerHTML = `
        <img src="${tinselIconURL}" style="height:150px; filter: drop-shadow(0 0 5px #fff);">
        <p style="font-size:20px; margin-bottom:10px; color:#222; font-weight:500;">
           Hi there! I’ve been busy wrapping gifts all day, and I think one of them might be for you! Hurry here, catch it!
        </p>
        <button id="startGameBtn" style="
            padding:12px 25px;
            border-radius:20px;
            background: linear-gradient(45deg, #ff4f78, #ffcc66);
            color:white; border:none; cursor:pointer; font-size:18px;
            box-shadow: 0 0 10px rgba(255,255,255,0.6);
            transition: transform .1s;
        ">Gimmie!</button>
    `;
    container.appendChild(gameOverlay);

    const styleOverlay = document.createElement('style');
    styleOverlay.textContent = `
        @keyframes overlayFade {
            from {opacity:0; transform: translate(-50%, -45%);}
            to {opacity:1; transform: translate(-50%, -50%);}
        }
        @keyframes bounce {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-15px);}
        }
        @keyframes popFade {
            from {transform:scale(0.85); opacity:0;}
            to {transform:scale(1); opacity:1;}
        }
    `;
    document.head.appendChild(styleOverlay);

    const countdownEl = document.createElement('div');
    countdownEl.style.cssText = `
        position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%);
        font-size:70px; font-weight:bold; color:white;
        text-shadow:black 2px 2px 12px; display:none;
    `;
    container.appendChild(countdownEl);

    const timeDisplay = document.createElement('div');
    timeDisplay.style.cssText = `
        position:absolute;
        top:10px; left:10px;
        padding:6px 12px;
        background: rgba(0,0,0,0.55);
        color:white;
        font-size:20px;
        border-radius:10px;
        z-index:20;
        display:none;
    `;
    timeDisplay.textContent = "20s";
    container.appendChild(timeDisplay);

    const popup = document.createElement('div');
    popup.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.7); display:flex;
        justify-content:center; align-items:center; flex-direction:column;
        color:white; font-size:24px; text-align:center; display:none;
        gap:10px; z-index:999;
    `;
    const popupBox = document.createElement('div');
    popupBox.style.cssText = `
        background: rgba(255,255,255,0.95);
        padding: 25px 30px;
        border-radius:25px;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        max-width:90%;
        display:flex;
        flex-direction:row;
        align-items:center;
        gap:20px;
    `;
    const popupImg = document.createElement('img');
    popupImg.style.cssText = 'width:110px;height:110px; animation:bounce 1s infinite;';
    const popupContent = document.createElement('div');
    popupContent.style.cssText = `display:flex; flex-direction:column; align-items:center; gap:12px;`;
    const popupText = document.createElement('div');
    const popupTinselText = document.createElement('span');
    const popupTinselMsg = document.createElement('div');
    popupTinselMsg.style.cssText = `
        font-size:20px;
        background: rgba(255,240,250,0.8);
        padding:12px 18px;
        border-radius:15px;
        color:#222;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display:flex;
        align-items:center;
        gap:10px;
    `;
    const popupTinselIcon = document.createElement('img');
    popupTinselIcon.src = tinselIconURL; popupTinselIcon.style.height='50px';
    popupTinselMsg.appendChild(popupTinselText);
    popupTinselMsg.appendChild(popupTinselIcon);
    popupContent.appendChild(popupImg);
    popupContent.appendChild(popupText);
    popupContent.appendChild(popupTinselMsg);
    popupBox.appendChild(popupContent);
    popup.appendChild(popupBox);
    container.appendChild(popup);

    const timeoutPopup = document.createElement('div');
    timeoutPopup.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.75);
        display:flex; flex-direction:column;
        justify-content:center; align-items:center;
        color:white; text-align:center;
        font-size:28px; padding:20px;
        z-index:999; display:none;
    `;
    const timeoutBox = document.createElement('div');
    timeoutBox.style.cssText = `
        background:rgba(255,255,255,0.95);
        color:#222;
        padding:25px 30px;
        border-radius:20px;
        max-width:400px;
        box-shadow:0 0 15px rgba(255,255,255,0.5);
        font-size:22px;
        display:flex; flex-direction:column; gap:15px;
        animation: popFade 0.5s ease;
    `;
    timeoutBox.innerHTML = `
        <div style="font-size:26px;">Time's Up!</div>
        <div style="font-size:18px;">Almost! You didn’t catch one, but you can try again or come back in 24 hours!</div>
    `;
    timeoutPopup.appendChild(timeoutBox);
    container.appendChild(timeoutPopup);

    // Weighted Gifts
    const gifts = [
        {name:'Common Gift', src:'https://www.furvilla.com/img/items/1/1491-green-olde-foxbury-gift.png', weight:70},
        {name:'Uncommon Gift', src:'https://www.furvilla.com/img/items/1/1492-gray-tigereye-peak-gift.png', weight:25},
        {name:'Rare Gift', src:'https://www.furvilla.com/img/items/1/1495-red-dragonsmaw-manor-gift.png', weight:4},
        {name:'Enchanted Gift', src:'https://www.furvilla.com/img/items/1/1488-blue-oceandome-gift.png', weight:1}
    ];
    function pickWeightedGift() {
        const total = gifts.reduce((sum,g)=>sum+g.weight,0);
        let roll = Math.random() * total;
        for (const g of gifts) {
            if (roll < g.weight) return g;
            roll -= g.weight;
        }
    }

    const user = getUser();
    if(!user) return;

    document.getElementById('startGameBtn').addEventListener('click', async ()=>{
        gameOverlay.style.display='none';

        // Check cooldown
        const claims = await fetchClaims();
        const today = new Date().toDateString();
        const alreadyClaimed = claims.some(c => c.userID===user.userID && new Date(c.time).toDateString()===today);

        if(alreadyClaimed){
            popupText.textContent = "Oops! You already claimed a gift today. Come back tomorrow!";
            popupTinselText.textContent = "";
            popupImg.src = tinselIconURL;
            popup.style.display='flex';
            return;
        }

        let count=3;
        countdownEl.textContent=count;
        countdownEl.style.display='block';
        const timer = setInterval(()=>{
            count--;
            if(count>0) countdownEl.textContent=count;
            else {
                countdownEl.textContent='Go!';
                clearInterval(timer);
                setTimeout(() => countdownEl.style.display='none', 500);
                startFallingGame();
            }
        },1000);
    });

    function startFallingGame(){
        const gameDuration = 20000;
        const gameStart = Date.now();
        let gameActive = true;
        timeDisplay.style.display = 'block';

        const interval = setInterval(()=>{
            if(!gameActive || Date.now()-gameStart>gameDuration){
                clearInterval(interval);
                endGameNoPick();
                return;
            }
            let timeLeft = Math.max(0, 20 - Math.floor((Date.now()-gameStart)/1000));
            timeDisplay.textContent = timeLeft + "s";

            spawnGift();
        },800);

        function spawnGift(){
            const gift = pickWeightedGift();
            const giftEl = document.createElement('img');
            giftEl.src = gift.src;
            giftEl.style.cssText = `
                position:absolute; width:55px; height:55px;
                top:-60px; left:${Math.random()*90}%;
                cursor:pointer; transition:transform 0.1s;
                filter: drop-shadow(0 0 5px rgba(255,255,255,0.7));
            `;
            container.appendChild(giftEl);
            const fallSpeed = 1.5 + Math.random()*1.5;
            const fallInterval = setInterval(()=>{
                giftEl.style.top = (parseFloat(giftEl.style.top)+fallSpeed)+'px';
                if(parseFloat(giftEl.style.top)>container.clientHeight){
                    clearInterval(fallInterval); giftEl.remove();
                }
            },16);

            giftEl.addEventListener('click', async ()=>{
                if(!gameActive) return;
                gameActive=false;

                catchSound.currentTime=0; catchSound.play();
                const rect = giftEl.getBoundingClientRect();
                sparkleBurst(rect.left + rect.width/2, rect.top + rect.height/2);
                document.querySelectorAll('#tinselGiftGame img').forEach(img=>{if(img!==popupImg&&img!==popupTinselIcon) img.remove();});
                clearInterval(fallInterval);

                popupImg.src = gift.src;
                popupText.textContent = `You caught a ${gift.name}!`;
                popupTinselText.textContent = "Wonderful, you got it! Stop by again tomorrow for another gift!";
                popupText.style.color = "#333";
                popupTinselText.style.color = "#333";
                popup.style.display = 'flex';

                // Submit to Google Form
                submitToGoogleForm(user, gift);

                // Update live board
                updateBoardFromCSV();
            });
        }

        function endGameNoPick(){
            if(!gameActive) return;
            gameActive=false;
            timeDisplay.style.display='none';
            timeoutPopup.style.display='flex';
        }
    }

    // --- Recent Gift Claims Board ---
    const boardWrapper = document.createElement('div');
    boardWrapper.className='widget';
    boardWrapper.style.cssText='max-width:800px;margin:20px auto;';
    boardWrapper.innerHTML=`
        <div class="widget-header">
            <h3>Recent Gift Claims (24 hrs)</h3>
        </div>
        <div class="widget-content no-padding">
            <table class="table" id="recentGifts">
                <thead><tr><th>Time</th><th>User</th><th>Gift</th></tr></thead>
                <tbody></tbody>
            </table>
        </div>
    `;
    container.insertAdjacentElement('afterend', boardWrapper);
    updateBoardFromCSV();

})();
