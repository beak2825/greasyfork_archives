// ==UserScript==
// @name High-Low Oracle (WIP) v3.3.9
// @namespace http://tampermonkey.net/
// @version 3.3.9
// @description v3.3.8 + Profile name "Weeb_Phydoe" in Help Page
// @author Gemini
// @match *://www.torn.com/page.php?sid=highlow*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/561104/High-Low%20Oracle%20%28WIP%29%20v339.user.js
// @updateURL https://update.greasyfork.org/scripts/561104/High-Low%20Oracle%20%28WIP%29%20v339.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getFreshDeck = () => ({ 2:4, 3:4, 4:4, 5:4, 6:4, 7:4, 8:4, 9:4, 10:4, 11:4, 12:4, 13:4, 14:4 });
    const SUIT_SYMBOLS = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    const SUIT_COLORS = { 'S': '#fff', 'C': '#fff', 'H': '#ff4444', 'D': '#ff4444' };
    const VALUES = [2,3,4,5,6,7,8,9,10,11,12,13,14];
    const SUITS = ['S', 'H', 'D', 'C'];

    let state = JSON.parse(localStorage.getItem('hi_lo_stable_state')) || {
        deck: getFreshDeck(),
        history: [], 
        suitHistory: [], 
        eventLog: [], 
        phase: "DEALER", pos: { x: 20, y: 70 }, 
        gridOpen: false, suitGridOpen: false, helpOpen: false,
        selectedVal: 14, selectedSuit: 'S',
        displayDealer: '--', displayDealerSuit: '',
        displayPlayer: '--', displayPlayerSuit: '',
        isShuffled: false
    };

    const save = () => localStorage.setItem('hi_lo_stable_state', JSON.stringify(state));

    const injectStyles = () => {
        const old = document.querySelectorAll('style[id^="oracle-"]');
        old.forEach(s => s.remove());
        const s = document.createElement('style');
        s.id = 'oracle-v339-css';
        s.innerHTML = `
            #oracle-root {
                position: fixed !important; z-index: 999999999 !important;
                background: rgba(10,10,10,0.98) !important; color: #fff !important;
                width: 310px !important; border: 2px solid #00ffcc; border-radius: 12px; 
                padding: 12px !important; font-family: sans-serif !important; 
                left: ${state.pos.x}px; top: ${state.pos.y}px;
                box-shadow: 0 0 20px rgba(0,0,0,0.8); touch-action: none;
            }
            .header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid #333; padding: 5px; cursor: grab; }
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
            #help-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.96); z-index: 1000000000; display: flex; flex-direction: column; padding: 30px; box-sizing: border-box; overflow-y: auto; line-height: 1.5; }
            .help-header { color: #00ffcc; font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #00ffcc; padding-bottom: 5px; }
            .help-section { margin-bottom: 20px; }
            .help-section h3 { color: #f2b01f; margin: 0 0 10px 0; font-size: 18px; }
            .help-section p { margin: 5px 0; font-size: 14px; color: #ddd; }
            .help-close { background: #00ffcc; color: #000; text-align: center; padding: 15px; border-radius: 10px; cursor: pointer; font-weight: bold; margin-top: 20px; flex-shrink: 0; }
            a { color: #00ffcc; text-decoration: none; font-weight: bold; }
        `;
        document.head.appendChild(s);
    };

    const initUI = () => {
        if (document.getElementById('oracle-root')) return;
        injectStyles();
        const container = document.createElement('div');
        container.id = 'oracle-root';
        document.body.appendChild(container);

        let active = false, xOff = state.pos.x, yOff = state.pos.y, startX, startY;
        const drag = (e) => {
            if (active) {
                let nx = e.clientX - startX; let ny = e.clientY - startY;
                const r = container.getBoundingClientRect();
                xOff = Math.max(0, Math.min(nx, window.innerWidth - r.width));
                yOff = Math.max(0, Math.min(ny, window.innerHeight - r.height));
                container.style.left = xOff + "px"; container.style.top = yOff + "px";
            }
        };
        document.addEventListener("pointerdown", (e) => { if (e.target.closest('.header-bar')) { startX = e.clientX - xOff; startY = e.clientY - yOff; active = true; } });
        document.addEventListener("pointerup", () => { active = false; state.pos = { x: xOff, y: yOff }; save(); });
        document.addEventListener("pointermove", drag);

        const render = () => {
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
                const lastSuits = state.suitHistory.slice(-2).join('');
                let bias = (lastSuits === 'SH') ? 1.08 : 1.0;
                move = (hi * bias) >= lo ? 'HIGHER' : 'LOWER';
                color = (hi * bias) >= lo ? '#00ffcc' : '#ff4444';
                let conf = (Math.max(hi, lo) / total) * 100;
                if (conf >= 85) icon = '🔥'; else if (conf >= 70) icon = '😎'; else icon = '🤔';
            }

            if (state.helpOpen) {
                let overlay = document.getElementById('help-overlay');
                if (!overlay) { overlay = document.createElement('div'); overlay.id = 'help-overlay'; document.body.appendChild(overlay); }
                overlay.innerHTML = `
                    <div class="help-header">ORACLE | Operational Guide</div>
                    <div class="help-section">
                        <p>This tool is a pattern tracker designed to navigate the Torn High-Low shuffler through card counting and DNA-based suit analysis. To ensure the logic remains accurate, follow the protocol exactly.</p>
                    </div>
                    <div class="help-section">
                        <h3>🎮 The Workflow</h3>
                        <p>1. Log <strong>DEALER</strong> card first (Value + Suit), click ADD.</p>
                        <p>2. Follow the <strong>HIGHER/LOWER</strong> command.</p>
                        <p>3. Log <strong>YOUR</strong> card (Player), click ADD.</p>
                        <p>4. Wait for 🔵 <strong>CONTINUE</strong> before next turn.</p>
                        <p>5. Paste DNA into a message to <a href="https://www.torn.com/profiles.php?XID=3262527" target="_blank">Weeb_Phydoe</a> after tokens are spent.</p>
                    </div>
                    <div class="help-section">
                        <h3>⚖️ Operational Constraints</h3>
                        <p>• <strong>Betting:</strong> Always exactly $10.</p>
                        <p>• <strong>No "Prayer":</strong> Do not use under any circumstances.</p>
                        <p>• <strong>Objective:</strong> Reach a streak of 25.</p>
                    </div>
                    <div class="help-section">
                        <h3>🧬 DNA & Shuffle Logic</h3>
                        <p>• <strong>Manual Shuffles:</strong> Click SHUFFLE only when game resets, you reload, or start a new session. This logs an [S] marker.</p>
                        <p>• <strong>Pairing:</strong> Every card Value and Suit is paired in the history log.</p>
                    </div>
                    <div class="help-close" id="close-help">RETURN TO ORACLE</div>
                `;
                overlay.querySelector('#close-help').onclick = () => { state.helpOpen = false; overlay.remove(); render(); };
            }

            let content = `
                <div class="header-bar">
                    <div id="help-trigger">?</div>
                    <div style="font-size:10px; color:#00ffcc;">ORACLE (WIP) v3.3.9</div>
                    <div id="dna-btn">DNA</div>
                </div>`;

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
                <div class="bottom-row">
                    <button id="reset-btn">SHUFFLE</button>
                    <button id="undo-btn">UNDO</button>
                </div>`;
            }

            container.innerHTML = content;
            const tap = (id, fn) => { const el = container.querySelector(id); if(el) el.onclick = fn; };
            tap('#help-trigger', () => { state.helpOpen = true; render(); });
            tap('#dna-btn', () => { 
                const data = btoa(JSON.stringify({ events: state.eventLog, deck: state.deck, history: state.history }));
                navigator.clipboard.writeText(data).then(() => alert("DNA Copied. (v3.3.9)"));
            });
            tap('#open-val', () => { state.gridOpen = true; render(); });
            tap('#open-suit', () => { state.suitGridOpen = true; render(); });
            container.querySelectorAll('.val-sel').forEach(el => el.onclick = () => { state.selectedVal = parseInt(el.dataset.val); state.gridOpen = false; state.suitGridOpen = true; render(); });
            container.querySelectorAll('.suit-sel').forEach(el => el.onclick = () => { state.selectedSuit = el.dataset.suit; state.suitGridOpen = false; render(); });
            tap('#add-btn', () => {
                const val = state.selectedVal; const suit = state.selectedSuit;
                if (state.deck[val] > 0) {
                    state.isShuffled = false;
                    if (state.phase === "DEALER") { state.displayDealer = d(val); state.displayDealerSuit = suit; state.phase = "PLAYER"; }
                    else { state.displayPlayer = d(val); state.displayPlayerSuit = suit; state.phase = "DEALER"; }
                    state.deck[val]--; 
                    state.history.push(val); 
                    state.suitHistory.push(suit);
                    state.eventLog.push(['C', val, suit]); 
                    save(); render();
                }
            });
            tap('#reset-btn', () => { 
                state.deck = getFreshDeck(); state.history = []; state.suitHistory = []; state.eventLog.push(['S']);
                state.displayDealer = '--'; state.displayPlayer = '--'; state.isShuffled = true; state.phase = "DEALER"; 
                save(); render(); 
            });
            tap('#undo-btn', () => { 
                if(state.history.length > 0) { 
                    state.deck[state.history.pop()]++; state.suitHistory.pop(); state.eventLog.pop();
                    state.phase = (state.phase === "DEALER") ? "PLAYER" : "DEALER"; 
                    save(); render(); 
                } 
            });
        };
        render();
    };

    if (document.readyState === 'complete') initUI(); else window.addEventListener('load', initUI);
})();
