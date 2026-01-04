// ==UserScript==
// @name         RR Mugbot v31 - WebSocket
// @namespace    http://tampermonkey.net/
// @version      31.1
// @license MIT
// @description  Real-time Russian Roulette Mugbot • WebSocket-driven • HTML status detection • draggable • mute/filter/pause/minimise
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560736/RR%20Mugbot%20v31%20-%20WebSocket.user.js
// @updateURL https://update.greasyfork.org/scripts/560736/RR%20Mugbot%20v31%20-%20WebSocket.meta.js
// ==/UserScript==

/************** NATIVE WEBSOCKET HOOK (runs before page opens WS) **************/
(() => {
    const NativeWS = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new NativeWS(...args);
        const url = args[0];

        ws.addEventListener("message", (ev) => {
            window.postMessage({
                type: "__RR_WS__",
                url,
                data: ev.data
            });
        });

        return ws;
    };
    window.WebSocket.prototype = NativeWS.prototype;
})();

/************** MAIN SCRIPT (runs after DOMContentLoaded) **************/
window.addEventListener("DOMContentLoaded", () => {
    (async function(){
        'use strict';

        /************** SETTINGS & STATE **************/
        let apiKey = localStorage.getItem('MuggerAPI');
        while(!apiKey){
            apiKey = prompt('Enter Torn API key (Full Access):');
            if(apiKey) localStorage.setItem('MuggerAPI', apiKey);
        }

        let threshold = parseInt(localStorage.getItem('RRMuggerThreshold') || '15000000',10);
        let isMuted = localStorage.getItem('RRMuggerMuted') === 'true';
        let paused = false;
        let hidden = JSON.parse(localStorage.getItem('RRMuggerHidden') || '[]');
        const tracked = {}; // gameId -> game object
        const queue = []; // for status fetch queue
        let queueActive = false;

        // ---- shared AudioContext----
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // --- FIRST-LOAD FLAG & DOM SCAN FUNCTION ---
        let initialLoadDone = false;
        async function runInitialDomScan() {
            console.log("[RR DEBUG] Starting initial RR DOM scan…");
            const maxAttempts = 20;
            let attempt = 0;
            while (attempt < maxAttempts) {
                attempt++;
                console.log(`[RR DEBUG] DOM scan attempt ${attempt}/${maxAttempts}`);
                const rows = document.querySelectorAll('.row___CHcax');
                if (rows.length > 0) {
                    console.log(`[RR DEBUG] Found ${rows.length} RR rows, processing…`);
                    readDomGames(rows); // call your existing addGameRowWS logic per row
                    initialLoadDone = true;
                    console.log("[RR DEBUG] Initial RR DOM scan complete.");
                    return;
                }
                await new Promise(res => setTimeout(res, 250));
            }
            console.warn("[RR DEBUG] No RR rows found after timeout.");
            initialLoadDone = true;
        }


        /************** UI SETUP **************/
        const cont = document.createElement('div');
        Object.assign(cont.style, {
            position:'fixed',
            top:localStorage.getItem('RRMuggerTop') || '60px',
            left:localStorage.getItem('RRMuggerLeft') || 'auto',
            right:localStorage.getItem('RRMuggerRight') || '10px',
            width:'280px',
            resize:'both',
            overflow:'auto',
            font:'12px Segoe UI, sans-serif',
            background:'#2e2e2e',// dark gray background
            color:'#eee',// light text
            borderRadius:'6px',
            boxShadow:'0 4px 12px rgba(0,0,0,0.5)',
            padding:'6px',
            zIndex:10000
        });
        document.body.appendChild(cont);

        const header = document.createElement('div');
        header.textContent = 'RR Mugbot';
        Object.assign(header.style, {
            cursor:'move',
            background:'#1f1f1f',// darker header
            padding:'4px',
            fontWeight:'bold',
            color:'#eee'
        });
        cont.prepend(header);

        const footer = document.createElement('div');
        footer.textContent = '☰ Drag here';
        Object.assign(footer.style, {
            cursor:'move',
            background:'#1f1f1f',
            padding:'4px',
            marginTop:'4px',
            fontSize:'11px',
            color:'#eee'
        });
        cont.appendChild(footer);

        function makeDraggable(el){
            let ox=0, oy=0, dragging=false;
            el.onmousedown = e => {
                dragging = true;
                ox = e.clientX - cont.offsetLeft;
                oy = e.clientY - cont.offsetTop;
                document.body.style.userSelect = 'none';
            };
            document.onmousemove = e => {
                if(dragging){
                    cont.style.left = `${e.clientX - ox}px`;
                    cont.style.top = `${e.clientY - oy}px`;
                    cont.style.right = 'auto';
                }
            };
            document.onmouseup = () => {
                if(dragging){
                    localStorage.setItem('RRMuggerLeft', cont.style.left);
                    localStorage.setItem('RRMuggerTop', cont.style.top);
                    localStorage.setItem('RRMuggerRight', cont.style.right);
                    dragging = false;
                    document.body.style.userSelect = '';
                }
            };
        }
        makeDraggable(header);
        makeDraggable(footer);


        const muteBtn = document.createElement('button');
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.onclick = () => {
            isMuted = !isMuted;
            localStorage.setItem('RRMuggerMuted', isMuted);
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
        };
        header.appendChild(muteBtn);

        let beepVolume = parseFloat(localStorage.getItem('RRMuggerVolume')) || 0.5; // default 0.5

        // Volume slider
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 100;
        volumeSlider.value = beepVolume * 100;
        volumeSlider.title = "Beep Volume";
        volumeSlider.style.marginLeft = '6px';
        volumeSlider.style.verticalAlign = 'middle';
        volumeSlider.style.width = '80px';
        volumeSlider.oninput = () => {
            beepVolume = volumeSlider.value / 100;
            localStorage.setItem('RRMuggerVolume', beepVolume);
        };
        header.appendChild(volumeSlider);

        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = '⏸️';
        pauseBtn.onclick = () => {
            paused = !paused;
            pauseBtn.textContent = paused ? '▶️' : '⏸️';
        };
        header.appendChild(pauseBtn);

        const filterSelect = document.createElement('select');
        [5,10,15,20,50,100].forEach(m => {
            const opt = document.createElement('option');
            opt.value = m * 1e6;
            opt.textContent = `${m}m`;
            filterSelect.appendChild(opt);
        });
        filterSelect.value = threshold;
        filterSelect.onchange = () => {
            threshold = +filterSelect.value;
            localStorage.setItem('RRMuggerThreshold', threshold);
        };
        header.appendChild(filterSelect);

        cont.appendChild(document.createElement('hr'));
        const list = document.createElement('div');
        cont.appendChild(list);

        function fmt(n){
            if(n>=1e9) return (n/1e9).toFixed(1).replace(/\.0$/,'')+'b';
            if(n>=1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'')+'m';
            if(n>=1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'')+'k';
            return n + '';
        }

        // --- Modify your beep() function ---
        function beep(){
            if(isMuted) return;

            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            g.gain.value = beepVolume; // <-- use slider volume
            o.frequency.value = 660;
            o.connect(g);
            g.connect(audioCtx.destination);
            o.start();
            o.stop(audioCtx.currentTime + 0.2);
        }

        /************** STATUS FETCH QUEUE (API-BASED) **************/

        const statusCache = new Map(); // uid -> { text, ts }

        async function getStatus(uid) {
            const cached = statusCache.get(uid);
            if (cached && Date.now() - cached.ts < 30_000) {
                return cached.text;
            }

            try {
                const res = await fetch(
                    `https://api.torn.com/v2/user/${uid}/profile?striptags=true&key=${apiKey}`
        );
                const json = await res.json();

                const state = json?.profile?.status?.state || 'Unknown';
                const last = json?.profile?.last_action?.relative || 'Unknown';

                const text = `${state} • ${last}`;
                statusCache.set(uid, { text, ts: Date.now() });
                return text;

            } catch (e) {
                console.error('[RR] API status error:', e);
                return 'Status error';
            }
        }

        async function processQueue() {
            if (queueActive || !queue.length) return;

            queueActive = true;
            const g = queue.shift();

            const statusText = await getStatus(g.uid);
            g.statusEl.textContent = `${g.state} – ${statusText}`;
            g.statusEl.style.color = '#9ad'; // readable on dark + yellow

            g.lastChecked = Date.now();
            g.queued = false;
            queueActive = false;
        }

        function markInPlay(g){
            if (g.state === 'IN PLAY') return;

            g.state = 'IN PLAY';

            // Background + readable text
            g.entry.style.background = 'yellow';
            g.entry.style.color = '#000';

            // fix any nested elements that may have inline colors
            g.entry.querySelectorAll('*').forEach(el => {
                el.style.color = '#000';
            });

            // Keep the status line blueish-grey
            g.statusEl.style.color = '#9ad';

            beep();
            g.countdown = 60;
        }

        /************** ROW CREATION (unchanged) **************/
        function addGameRowWS(game){
            const id = game.ID;
            if(tracked[id] || hidden.includes(id)) return;
            const name = game.creator?.name || 'Unknown';
            const betNum = game.betAmount || 0;
            console.log("[RR DEBUG] addGameRows Threshold:", threshold);
            if(betNum < threshold) return;
            const uid = game.creator?.ID || '';
            const bsp = 'N/A';
            const bspColor = '#ccc';
            const atkUrl = `https://www.torn.com/loader.php?sid=attack&user2ID=${uid}`;

            console.log("Game Added:",`Name: ${name}, Bet Amount: ${betNum}` );

            const ent = document.createElement('div');
            ent.style.cssText = `
                margin-bottom:4px;
                padding:4px;
                border:1px solid #444;
                border-radius:4px;
                font-size:11px;
                background:#3a3a3a;   /* entry background */
                color:#eee;            /* entry text */
                position:relative;
            `;
            ent.innerHTML = `
            <div><b>${name}</b> <span style="background:${bspColor};padding:2px;border-radius:3px;font-size:10px;">${bsp}</span> – ${fmt(betNum)}</div>
            <div id="status-${id}" style="font-weight:bold;color:gray;">LOBBY – Loading...</div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span id="timer-${id}">⏳ 15m 00s</span>
              <button id="atkBtn-${id}" style="background:orange;color:#fff;border:none;padding:2px 5px;font-size:11px;cursor:pointer;">⚔️ ATTACK</button>
            </div>
            <div id="close-${id}" style="position:absolute;top:2px;right:4px;color:red;cursor:pointer;font-weight:bold;font-size:14px;">✖</div>`;
            list.appendChild(ent);

            ent.querySelector(`#atkBtn-${id}`).onclick = () => { if(atkUrl) window.open(atkUrl,'_blank'); };
            ent.querySelector(`#close-${id}`).onclick = () => {
                ent.remove();
                hidden.push(id);
                localStorage.setItem('RRMuggerHidden', JSON.stringify(hidden));
                delete tracked[id];
            };

            tracked[id] = {
                uid, bet: betNum, created: Date.now(), state: 'LOBBY',
                entry: ent,
                statusEl: ent.querySelector(`#status-${id}`),
                timerEl: ent.querySelector(`#timer-${id}`),
                lastChecked: 0,
                countdown: 900,
                queued: false
            };

            setTimeout(() => updateBSPForGame(uid, ent), 1000);
        }

        function updateBSPForGame(uid, ent) {
            const row = Array.from(document.querySelectorAll('.row___CHcax')).find(r => {
                const link = r.querySelector('a[href*="XID="]');
                const rowUid = (link?.href.match(/XID=(\d+)/) || [])[1];
                return rowUid === String(uid);
            });
            if(!row) return;

            const bspEl = row.querySelector('.iconStats');
            const bsp = bspEl?.textContent.trim() || 'N/A';
            const bspColor = bspEl?.style.background || '#ccc';

            const span = ent.querySelector('span[style*="padding:2px"]');
            if(span){
                span.textContent = bsp;
                span.style.background = bspColor;
                span.style.color = '#000';
            }
        }

        function readDomGames(rows) {
            rows.forEach(row => {
                const creatorLink = row.querySelector('a[href*="XID="]');
                if(!creatorLink) return;

                const uid = +(creatorLink.href.match(/XID=(\d+)/)?.[1] || 0);
                if(!uid) return;

                const name = creatorLink.textContent.trim();
                const betEl = row.querySelector('.betBlock___wz9ED');
                const betNum = parseInt(betEl?.textContent.replace(/\D/g,''), 10) || 0;

                const idAttr = row.getAttribute('data-game-id') || row.id || '';
                const gameId = +(idAttr.replace(/\D/g,''));
                if(!gameId) return;

                console.log("[RR DEBUG] DOM Game Found:", gameId, name, betNum);

                addGameRowWS({
                    ID: gameId,
                    betAmount: betNum,
                    creator: { ID: uid, name }
                });
            });
        }

        function waitForRRLobbyAndLoad() {
            console.log("[RR DEBUG] Waiting for RR lobby to appear…");

            const observer = new MutationObserver(() => {
                const rows = document.querySelectorAll('.row___CHcax');
                if (rows.length > 0) {
                    console.log("[RR DEBUG] RR lobby detected, performing initial DOM scan…");
                    observer.disconnect();
                    runInitialDomScan();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        waitForRRLobbyAndLoad();



        /************** WEBSOCKET LISTENER **************/
        window.addEventListener("message", ev => {
            const d = ev.data;
            if(d?.type !== "__RR_WS__") return;
            if(paused) return;

            try {
                const obj = JSON.parse(d.data);
                const msg = obj.push?.pub?.data?.message;
                if(!msg || msg.namespace !== "russianRoulette") return;

                if(msg.action === "gameCreated") {
                    addGameRowWS(msg.data.data);
                }

                if(msg.action === "gameRemovedFromList") {
                    const gameId = msg.data.expiredGame;
                    if(tracked[gameId]) markInPlay(tracked[gameId]);
                }

            } catch(e){ console.error("RR WS parse error:", e); }
        });


        /************** TIMER & STATUS UPDATER **************/
        setInterval(() => {
            const now = Date.now();
            for(const id in tracked){
                const g = tracked[id];
                g.countdown--;
                if(g.countdown <= 0){
                    g.entry.remove();
                    delete tracked[id];
                    continue;
                }
                const m = Math.floor(g.countdown / 60), s = g.countdown % 60;
                g.timerEl.textContent = `${g.state==='IN PLAY'?'IN PLAY':'⏳'} ${m}m ${s}s`;

                // <-- replace your old queue push with this
                if (!g.queued && (!g.lastChecked || now - g.lastChecked >= (g.state==='IN PLAY'?5000:10000))) {
                    queue.push(g);
                    g.queued = true;// mark as queued
                }
            }
            processQueue();
        }, 1000);

    })();
});
