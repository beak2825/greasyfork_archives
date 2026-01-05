// ==UserScript==
// @name         P3 Excavation Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Continuous Excavation Bot: clicks Start Excavating!, 10 squares, logs items, stops at daily limit
// @match        https://pocketpumapets.com/excavation.php
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558674/P3%20Excavation%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/558674/P3%20Excavation%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LS_KEY = 'puma_excavation_bot_running';
    let running = localStorage.getItem(LS_KEY) === '1';
    let receivedLog = [];
    const MAX_SQUARES = 10;

    // --- WORKING STATUS LOG ---
    function addStatus(msg) {
        const box = document.getElementById('excavation-status-log');
        if (!box) return;
        const time = new Date().toLocaleTimeString();
        box.innerHTML += `[${time}] ${msg}<br>`;
        box.scrollTop = box.scrollHeight;
    }
    // --------------------------

    function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
    function randomInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

    function updateLog(){
        const logDiv = document.getElementById('excavation-log');
        if(logDiv) logDiv.innerHTML = receivedLog.map(e=>`<div>${e}</div>`).join('');
    }

    function getStartButton(){ return document.querySelector('input[type="submit"][value="Start Excavating!"]'); }
    function getDailyLimitButton(){ return document.querySelector('input[type="submit"][value="You cannot play again today!"][disabled]'); }

    async function clickSquare(col,row){
        addStatus(`Clicking square ${col},${row}`);
        return fetch(`https://pocketpumapets.com/actions/excavation_click.php?col=${col}&row=${row}`)
            .then(resp=>resp.text())
            .then(html=>{
                const parser = new DOMParser();
                const doc = parser.parseFromString(html,'text/html');
                const content = doc.querySelector('#content')?.innerText || '';
                const matches = content.match(/• .+/g);

                if(matches){
                    matches.forEach(m=>receivedLog.push(m.trim()));
                    updateLog();
                    addStatus(`Item found: ${matches.join(", ")}`);
                }
            });
    }

    async function runBot(){
        addStatus("Bot started");

        while(running){
            if(getDailyLimitButton()){
                running = false;
                localStorage.removeItem(LS_KEY);

                document.querySelector('#excavation-bot-bar button:first-child').disabled = false;
                document.querySelector('#excavation-bot-bar button:nth-child(2)').disabled = true;

                const status = document.getElementById('excavation-bot-status');
                if(status) status.textContent = 'Status: Daily limit reached';

                addStatus("Daily limit reached — stopping bot");
                alert("Excavation completed for today! Bot stopped.");
                break;
            }

            const startBtn = getStartButton();

            if(startBtn && !startBtn.disabled){
                addStatus("Clicking Start Excavating!");
                startBtn.click();
                await sleep(2000);
            }

            const clickedSquares = new Set();
            addStatus("Beginning excavation sequence");

            for(let i=0;i<MAX_SQUARES && running;i++){
                let col,row,key;
                do{
                    col=randomInt(0,7);
                    row=randomInt(0,7);
                    key=`${col},${row}`;
                }while(clickedSquares.has(key));

                clickedSquares.add(key);

                addStatus(`Square ${i+1}/10`);
                await clickSquare(col,row);
                await sleep(randomInt(1000,2000));
            }

            if(running){
                addStatus("Reloading page for new excavation...");
                location.reload();
                break;
            }
        }
    }

    // ---------- Sticky Bar ----------
    function createStickyBar(){
        if(document.getElementById('excavation-bot-bar')) return;

        const bar = document.createElement('div');
        bar.id='excavation-bot-bar';
        Object.assign(bar.style,{
            position:'fixed', top:'0', left:'0', width:'100%',
            backgroundColor:'#2d3e1f', padding:'10px', display:'flex',
            justifyContent:'space-between', alignItems:'flex-start', zIndex:'99999',
            borderBottom:'2px solid black'
        });

        const status = document.createElement('span');
        status.id='excavation-bot-status';
        status.textContent=running?'Status: Running...':'Status: Stopped';
        Object.assign(status.style,{color:'white',fontWeight:'600', marginRight:'10px'});

        const controls = document.createElement('div');

        const startBtn = document.createElement('button');
        startBtn.textContent='▶️ Start Bot';
        startBtn.disabled = running;
        Object.assign(startBtn.style,{
            marginRight:'5px', padding:'6px 12px', borderRadius:'6px', fontWeight:'bold',
            cursor:'pointer', backgroundColor:'#3a5a40', color:'white', border:'2px solid #1b2b1f'
        });

        const stopBtn = document.createElement('button');
        stopBtn.textContent='⏹ Stop Bot';
        stopBtn.disabled = !running;
        Object.assign(stopBtn.style,{
            padding:'6px 12px', borderRadius:'6px', fontWeight:'bold',
            cursor:'pointer', backgroundColor:'#7b3535', color:'white', border:'2px solid #3a1a1a'
        });

        // --- ONLY WORKING STATUS LOG ---
        const statusLog = document.createElement('div');
        statusLog.id = 'excavation-status-log';
        Object.assign(statusLog.style, {
            marginTop:'5px',
            maxHeight:'300px',
            overflowY:'auto',
            background:'#eef',
            padding:'5px',
            border:'1px solid #99c',
            width:'300px',
            fontSize:'12px'
        });
        // -------------------------------

        controls.appendChild(startBtn);
        controls.appendChild(stopBtn);

        bar.appendChild(status);
        bar.appendChild(controls);
        bar.appendChild(statusLog);

        document.body.prepend(bar);
        document.body.style.marginTop='300px';

        startBtn.addEventListener('click',()=>{
            running=true;
            localStorage.setItem(LS_KEY,'1');
            startBtn.disabled=true;
            stopBtn.disabled=false;
            status.textContent='Status: Running...';
            receivedLog=[];
            updateLog();
            addStatus("Bot manually started");
            runBot();
        });

        stopBtn.addEventListener('click',()=>{
            running=false;
            localStorage.removeItem(LS_KEY);
            startBtn.disabled=false;
            stopBtn.disabled=true;
            status.textContent='Status: Stopped';
            addStatus("Bot manually stopped");
        });
    }

    const interval = setInterval(()=>{
        if(document.body){
            createStickyBar();
            if(running){
                addStatus("Bot resumed after reload");
                runBot();
            }
            clearInterval(interval);
        }
    },500);

})();
