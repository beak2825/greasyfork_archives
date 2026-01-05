// ==UserScript==
// @name High-Low Oracle (WIP) v3.5.0
// @namespace http://tampermonkey.net/
// @version 3.5.0
// @description v3.4.9 + Full Description Help Page
// @author Gemini
// @match *://www.torn.com/page.php?sid=highlow*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/561104/High-Low%20Oracle%20%28WIP%29%20v350.user.js
// @updateURL https://update.greasyfork.org/scripts/561104/High-Low%20Oracle%20%28WIP%29%20v350.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getFreshDeck = () => ({ 2:4, 3:4, 4:4, 5:4, 6:4, 7:4, 8:4, 9:4, 10:4, 11:4, 12:4, 13:4, 14:4 });
    const SUIT_SYMBOLS = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    const SUIT_COLORS = { 'S': '#fff', 'C': '#fff', 'H': '#ff4444', 'D': '#ff4444' };
    const VALUES = [2,3,4,5,6,7,8,9,10,11,12,13,14];
    const SUITS = ['S', 'H', 'D', 'C'];

    let state = JSON.parse(localStorage.getItem('hi_lo_stable_state')) || {
        deck: getFreshDeck(), history: [], suitHistory: [], 
        phase: "DEALER", pos: { x: 20, y: 100 }, 
        gridOpen: false, suitGridOpen: false, helpOpen: false,
        selectedVal: 14, selectedSuit: 'S',
        displayDealer: '--', displayDealerSuit: '',
        displayPlayer: '--', displayPlayerSuit: '',
        isShuffled: false
    };

    const save = () => localStorage.setItem('hi_lo_stable_state', JSON.stringify(state));

    const injectStyles = () => {
        const old = document.getElementById('oracle-v350-css');
        if (old) return;
        const s = document.createElement('style');
        s.id = 'oracle-v350-css';
        s.innerHTML = `
            #oracle-root {
                position: fixed !important; z-index: 2147483640 !important;
                background: rgba(10,10,10,0.98) !important; color: #fff !important;
                width: 310px !important; border: 2px solid #00ffcc; border-radius: 12px; 
                padding: 12px !important; font-family: sans-serif !important; 
                left: ${state.pos.x}px; top: ${state.pos.y}px;
                box-shadow: 0 0 20px rgba(0,0,0,0.8); touch-action: none;
            }
            .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid #333; padding: 10px 5px; cursor: move; }
            #help-trigger { background: #007bff; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; }
            #dna-btn { color: #f2b01f; border: 1px solid #f2b01f; padding: 2px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; }
            .track-val { font-size: 20px; font-weight: bold; text-align: center; min-height: 24px; }
            .main-display { text-align: center; padding: 10px 0; }
            .btn-grid { display: flex; gap: 8px; margin-top: 8px; height: 50px; }
            .bottom-row { display: flex; gap: 8px; margin-top: 10px; height: 40px; }
            .c-btn { background: #1a1a1a; color: #fff; border: 1px solid #444; flex: 1; border-radius: 8px; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
            .a-btn { background: #00ffcc !important; color: #000 !important; flex: 1.5; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; border: none; }
            #reset-btn { flex: 2; background: #311; color: #f44; border: 1px solid #522; border-radius: 8px; font-weight: bold; cursor: pointer; }
            #undo-btn { flex: 1; background: #222; color: #888; border: 1px solid #444; border-radius: 8px; font-weight: bold; cursor: pointer; }
            .grid-item { background: #222; padding: 12px; text-align: center; border-radius: 6px; font-weight: bold; border: 1px solid #444; cursor: pointer; }
            .grid-item.active { background: #00ffcc; color: #000; }
            #help-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.98); z-index: 2147483647; display: flex; flex-direction: column; padding: 30px; box-sizing: border-box; overflow-y: auto; color: #fff; line-height: 1.6; }
            .help-close { background: #00ffcc; color: #000; text-align: center; padding: 15px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-top: 20px; }
            .help-section { margin-bottom: 20px; }
            .help-h { color: #f2b01f; font-weight: bold; margin-bottom: 5px; display: block; border-bottom: 1px solid #333; }
        `;
        document.head.appendChild(s);
    };

    const centerUI = (container) => {
        const rect = container.getBoundingClientRect();
        state.pos.x = (window.innerWidth / 2) - (rect.width / 2);
        state.pos.y = (window.innerHeight / 2) - (rect.height / 2);
        container.style.left = state.pos.x + 'px';
        container.style.top = state.pos.y + 'px';
        save();
    };

    const render = () => {
        let container = document.getElementById('oracle-root');
        if (container) container.remove();
        
        if (state.helpOpen) {
            let overlay = document.getElementById('help-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'help-overlay';
                overlay.innerHTML = `
                    <h2 style="color:#00ffcc; margin-bottom:20px;">🎮 The Workflow</h2>
                    <div class="help-section">
                        <p>1. Log <b>DEALER</b> card first (Value + Suit), click <b>ADD</b>.</p>
                        <p>2. Follow the <b>HIGHER/LOWER</b> command.</p>
                        <p>3. Log <b>YOUR</b> card (Player), click <b>ADD</b>.</p>
                        <p>4. Wait for <b>🔵 CONTINUE</b> before starting the next turn.</p>
                    </div>

                    <h2 style="color:#00ffcc; margin-bottom:20px;">🧬 DNA & Shuffle Logic</h2>
                    <div class="help-section">
                        <span class="help-h">Manual Shuffles</span>
                        <p>Click <b>SHUFFLE</b> only when the game resets, you reload, or start a new session. This logs an [S] marker in the DNA.</p>
                        <span class="help-h">Pairing</span>
                        <p>The logic now tracks every card Value and Suit as a pair for daily analysis.</p>
                    </div>

                    <h2 style="color:#00ffcc; margin-bottom:20px;">🆘 Recovery</h2>
                    <div class="help-section">
                        <span class="help-h">Stuck UI</span>
                        <p>If the Oracle is off-screen, <b>Long-Press the SHUFFLE button for 2 seconds</b> to snap it back to center.</p>
                    </div>
                    
                    <div class="help-close">RETURN TO ORACLE</div>
                `;
                document.body.appendChild(overlay);
                injectStyles();
                overlay.querySelector('.help-close').onclick = () => { state.helpOpen = false; overlay.remove(); render(); };
            }
            return;
        }

        container = document.createElement('div');
        container.id = 'oracle-root';
        document.body.appendChild(container);
        injectStyles();

        const d = (v) => v===14?'A':v===11?'J':v===12?'Q':v===13?'K':v;
        const lastVal = state.history[state.history.length - 1];
        let hi = 0, lo = 0, total = 0;
        if (lastVal) {
            for (let v in state.deck) {
                let vi = parseInt(v);
                if (vi > lastVal) hi += state.deck[v]; else if (vi < lastVal) lo += state.deck[v];
            }
            total = hi + lo + (state.deck[lastVal] || 0);
        }
        
        let move = 'WAIT', color = '#aaa', icon = '⏳';
        if (state.isShuffled || (state.phase === "DEALER" && state.history.length > 0)) {
            move = 'CONTINUE'; color = '#007bff'; icon = '🔵';
        } else if (total > 0) {
            move = hi >= lo ? 'HIGHER' : 'LOWER';
            color = hi >= lo ? '#00ffcc' : '#ff4444';
            icon = '🤔';
        }

        let content = `<div class="header-bar" id="drag-handle"><div id="help-trigger">?</div><div style="font-size:10px; color:#00ffcc;">ORACLE (WIP) v3.5.0</div><div id="dna-btn">DNA</div></div>`;

        if (state.gridOpen) {
            content += `<div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top:10px;">
                ${VALUES.map(v => `<div class="grid-item val-sel ${state.selectedVal === v ? 'active' : ''}" data-val="${v}">${d(v)}</div>`).join('')}
            </div>`;
        } else if (state.suitGridOpen) {
            content += `<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 5px; margin-top:10px;">
                ${SUITS.map(s => `<div class="grid-item suit-sel" data-suit="${s}" style="color:${SUIT_COLORS[s]}">${SUIT_SYMBOLS[s]}</div>`).join('')}
            </div>`;
        } else {
            content += `
            <div style="display: flex; justify-content: space-around; margin-top: 10px;">
                <div>DLER:<div class="track-val" style="color:${SUIT_COLORS[state.displayDealerSuit]}">${state.displayDealer}${SUIT_SYMBOLS[state.displayDealerSuit]||''}</div></div>
                <div>YOU:<div class="track-val" style="color:${SUIT_COLORS[state.displayPlayerSuit]}">${state.displayPlayer}${SUIT_SYMBOLS[state.displayPlayerSuit]||''}</div></div>
            </div>
            <div class="main-display">
                <div style="font-size:28px; font-weight:bold; color:${color}">${move}</div>
                <div style="font-size:30px;">${icon}</div>
            </div>
            <div class="btn-grid">
                <div class="c-btn" id="open-val">${d(state.selectedVal)}</div>
                <div class="c-btn" id="open-suit" style="color:${SUIT_COLORS[state.selectedSuit]}">${SUIT_SYMBOLS[state.selectedSuit]}</div>
                <button class="a-btn" id="add-btn">ADD</button>
            </div>
            <div class="bottom-row"><button id="reset-btn">SHUFFLE</button><button id="undo-btn">UNDO</button></div>`;
        }

        container.innerHTML = content;

        const handle = container.querySelector('#drag-handle');
        handle.onpointerdown = (e) => {
            const startX = e.clientX - state.pos.x;
            const startY = e.clientY - state.pos.y;
            const moveDrag = (me) => {
                const rect = container.getBoundingClientRect();
                state.pos.x = Math.max(0, Math.min(me.clientX - startX, window.innerWidth - rect.width));
                state.pos.y = Math.max(0, Math.min(me.clientY - startY, window.innerHeight - rect.height));
                container.style.left = state.pos.x + 'px';
                container.style.top = state.pos.y + 'px';
            };
            const stopDrag = () => { document.removeEventListener('pointermove', moveDrag); document.removeEventListener('pointerup', stopDrag); save(); };
            document.addEventListener('pointermove', moveDrag); document.addEventListener('pointerup', stopDrag);
        };

        const tap = (id, fn) => { const el = container.querySelector(id); if(el) el.onclick = () => { fn(); render(); }; };
        tap('#help-trigger', () => { state.helpOpen = true; });
        tap('#dna-btn', () => { 
            const data = btoa(JSON.stringify({ deck: state.deck, history: state.history, suitHistory: state.suitHistory }));
            navigator.clipboard.writeText(data).then(() => alert("DNA Copied (v3.5.0)"));
        });

        const resetBtn = container.querySelector('#reset-btn');
        let pressTimer;
        resetBtn.onpointerdown = () => { pressTimer = window.setTimeout(() => { centerUI(container); alert("Position Reset!"); }, 2000); };
        resetBtn.onpointerup = () => { clearTimeout(pressTimer); };
        resetBtn.onclick = () => { 
            state.deck = getFreshDeck(); state.history = []; state.suitHistory = [];
            state.displayDealer = '--'; state.displayPlayer = '--'; state.displayDealerSuit = ''; state.displayPlayerSuit = '';
            state.isShuffled = true; state.phase = "DEALER"; state.gridOpen = false; state.suitGridOpen = false;
            save(); render();
        };

        tap('#open-val', () => { state.gridOpen = true; });
        tap('#open-suit', () => { state.suitGridOpen = true; });
        
        container.querySelectorAll('.val-sel').forEach(el => el.onclick = () => { state.selectedVal = parseInt(el.dataset.val); state.gridOpen = false; state.suitGridOpen = true; render(); });
        container.querySelectorAll('.suit-sel').forEach(el => el.onclick = () => { state.selectedSuit = el.dataset.suit; state.suitGridOpen = false; render(); });
        
        tap('#add-btn', () => {
            if (state.deck[state.selectedVal] > 0) {
                state.isShuffled = false;
                if (state.phase === "DEALER") { 
                    state.displayDealer = d(state.selectedVal); state.displayDealerSuit = state.selectedSuit; 
                    state.displayPlayer = '--'; state.displayPlayerSuit = ''; 
                    state.phase = "PLAYER"; 
                } else { 
                    state.displayPlayer = d(state.selectedVal); state.displayPlayerSuit = state.selectedSuit; 
                    state.phase = "DEALER"; 
                }
                state.deck[state.selectedVal]--; state.history.push(state.selectedVal); state.suitHistory.push(state.selectedSuit);
                save();
            }
        });

        tap('#undo-btn', () => { 
            if(state.history.length > 0) { 
                state.deck[state.history.pop()]++; state.suitHistory.pop();
                state.phase = (state.phase === "DEALER") ? "PLAYER" : "DEALER"; 
                save(); 
            } 
        });
    };

    if (document.readyState === 'complete') render(); else window.addEventListener('load', render);
})();
