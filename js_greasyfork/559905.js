// ==UserScript==
// @name         Torn Chest Solver (Optimized Sidecar)
// @namespace    Gemini.Torn
// @version      6.8
// @description  Restored width with a tightened history column to remove dead space.
// @author       Gemini
// @match        *.torn.com/christmas_town.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559905/Torn%20Chest%20Solver%20%28Optimized%20Sidecar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559905/Torn%20Chest%20Solver%20%28Optimized%20Sidecar%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let storage = JSON.parse(localStorage.getItem('tornSolverData')) || {
        history: [], currentInput: [], x: 20, y: 80, minimized: false
    };
    
    function saveData() { localStorage.setItem('tornSolverData', JSON.stringify(storage)); }
    let showHelp = false;

    const style = document.createElement('style');
    style.innerHTML = `
        .num-btn { padding: 10px 0; background: #333; color: #fff; border: none; border-radius: 4px; font-weight: bold; font-size: 14px; cursor: pointer; touch-action: manipulation; }
        .num-btn:active { background: #555; }
        .history-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; background: #1a1a1a; padding: 4px; border-radius: 4px; width: fit-content; }
        .hist-box { width: 18px; height: 18px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 1px solid #444; }
    `;
    document.head.appendChild(style);

    function createUI() {
        if (document.getElementById("torn-solver-window")) return;
        const container = document.createElement('div');
        container.id = "torn-solver-window";
        // Original comfortable width restored
        container.style = `position: fixed; top: ${storage.y}px; left: ${storage.x}px; z-index: 999999; background: #222; color: #fff; border-radius: 10px; border: 2px solid #444; font-family: sans-serif; width: 380px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); user-select: none; touch-action: none;`;
        
        const header = document.createElement('div');
        header.style = "background: #444; padding: 8px; cursor: move; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; touch-action: none;";
        header.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <button id="help-toggle" style="background: #0af; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-weight: bold; cursor: pointer; font-size: 12px;">?</button>
                <span style="font-weight: bold; font-size: 10px; color: #ff4444;">COMBO SOLVER PRO</span>
            </div>
            <button id="min-btn" style="background: #666; color: white; border: none; border-radius: 3px; width: 25px; height: 20px; cursor: pointer;">_</button>
        `;
        container.appendChild(header);

        const contentArea = document.createElement('div');
        contentArea.style = "padding: 10px;";
        container.appendChild(contentArea);
        document.body.appendChild(container);

        const render = () => {
            if (storage.minimized) {
                contentArea.style.display = "none";
                container.style.width = "160px";
                return;
            }
            
            container.style.width = "380px";
            contentArea.style.display = "block";

            if (showHelp) {
                contentArea.innerHTML = `
                    <div class="help-text">
                        <b style="color:#0f0; font-size:11px;">🌟 STEPS</b>
                        <p style="font-size:10px; color:#ccc;">Match game colors by tapping the input boxes, then hit OK.</p>
                        <div style="text-align:center; padding:10px; border-top:1px solid #444;">
                            <a href="https://www.torn.com/profiles.php?XID=3262527" target="_blank" style="color:#ff4444; text-decoration:none; font-weight:bold; font-size:11px;">Contact: Weeb_Phydoe [3262527]</a>
                        </div>
                        <button id="close-help" style="width:100%; background:#0af; color:white; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;">BACK</button>
                    </div>
                `;
                document.getElementById('close-help').onclick = () => { showHelp = false; render(); };
            } else {
                const {suggestion, prob} = solveLogic();
                contentArea.innerHTML = `
                    <div style="display: flex; gap: 12px;">
                        <div style="flex: 1.5;">
                            <div style="text-align:center; background:#111; padding:4px; border-radius:5px; margin-bottom:8px; border: 1px solid #333;">
                                <span style="font-size:9px; color:#888;">SUGGESTION</span><br>
                                <b style="color:#0f0; font-size:18px; letter-spacing:2px;">${suggestion}</b>
                                <div style="font-size:9px; color:#0af;">Win: ${prob}%</div>
                            </div>
                            <div style="display:flex; justify-content:center; gap:5px; margin-bottom:8px;">
                                ${[0,1,2].map(i => {
                                    const item = storage.currentInput[i] || {num: '-', color: '#444'};
                                    return `<div class="input-slot" data-index="${i}" style="width:42px; height:42px; background:${item.color}; display:flex; align-items:center; justify-content:center; border-radius:8px; font-weight:bold; font-size:22px; border:1px solid #555;">${item.num}</div>`;
                                }).join('')}
                            </div>
                            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:4px;">
                                ${[1,2,3,4,5,6,7,8,9,'C','OK'].map(k => {
                                    let s = ""; if (k === 'OK') s = "background:#080; grid-column: span 2;"; if (k === 'C') s = "background:#800;";
                                    return `<button class="num-btn" data-val="${k}" style="${s}">${k}</button>`;
                                }).join('')}
                            </div>
                        </div>
                        <div style="width: 100px; display: flex; flex-direction: column; border-left: 1px solid #444; padding-left: 10px;">
                            <div style="font-size:9px; color:#888; margin-bottom:4px; text-transform:uppercase;">History</div>
                            <div id="history-column" style="flex-grow: 1; max-height: 120px; overflow-y: auto; margin-bottom: 8px;">
                                ${storage.history.map((h, idx) => `
                                    <div class="history-row">
                                        <span style="font-size:9px; color:#555; width:12px;">${idx+1}</span>
                                        <div class="hist-box" style="background:${h[0].color}">${h[0].num}</div>
                                        <div class="hist-box" style="background:${h[1].color}">${h[1].num}</div>
                                        <div class="hist-box" style="background:${h[2].color}">${h[2].num}</div>
                                    </div>
                                `).reverse().join('')}
                            </div>
                            <button id="reset-game-btn" style="width:100%; background:#444; color:#fff; border:none; padding:5px; border-radius:4px; font-size:9px;">NEW GAME</button>
                        </div>
                    </div>
                `;

                contentArea.querySelectorAll('.input-slot').forEach(slot => {
                    slot.onclick = () => {
                        const i = slot.getAttribute('data-index');
                        if (!storage.currentInput[i]) return;
                        const colors = ['#666', '#ff4444', '#ffcc00', '#00aa00'];
                        storage.currentInput[i].color = colors[(colors.indexOf(storage.currentInput[i].color) + 1) % colors.length];
                        saveData(); render();
                    };
                });
                contentArea.querySelectorAll('.num-btn').forEach(btn => btn.onclick = () => {
                    const v = btn.getAttribute('data-val');
                    if (v === 'C') storage.currentInput = [];
                    else if (v === 'OK' && storage.currentInput.length === 3) {
                        storage.history.push([...storage.currentInput]); storage.currentInput = [];
                    } else if (storage.currentInput.length < 3 && !isNaN(v)) {
                        storage.currentInput.push({num: v, color: '#666'});
                    }
                    saveData(); render();
                });
                document.getElementById('reset-game-btn').onclick = () => { storage.history = []; storage.currentInput = []; saveData(); render(); };
            }
        };

        let isDragging = false, startX, startY;
        const onStart = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            const touch = e.touches ? e.touches[0] : e;
            isDragging = true;
            startX = touch.clientX - container.offsetLeft;
            startY = touch.clientY - container.offsetTop;
        };
        const onMove = (e) => { if (isDragging) { const touch = e.touches ? e.touches[0] : e; storage.x = touch.clientX - startX; storage.y = touch.clientY - startY; container.style.left = storage.x + "px"; container.style.top = storage.y + "px"; } };
        const onEnd = () => { isDragging = false; saveData(); };

        header.addEventListener('mousedown', onStart);
        header.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        document.getElementById('help-toggle').onclick = (e) => { e.stopPropagation(); showHelp = !showHelp; render(); };
        document.getElementById('min-btn').onclick = (e) => { e.stopPropagation(); storage.minimized = !storage.minimized; saveData(); render(); };
        render();
    }

    function solveLogic() {
        let possibilities = [];
        for (let i = 111; i <= 999; i++) {
            let p = i.toString().split('');
            if (!p.includes('0') && new Set(p).size === 3) possibilities.push(p);
        }
        storage.history.forEach(attempt => {
            possibilities = possibilities.filter(p => {
                for (let i = 0; i < 3; i++) {
                    const color = attempt[i].color; const num = attempt[i].num;
                    if (color === '#00aa00' && p[i] !== num) return false;
                    if (color === '#ff4444' && p.includes(num)) return false;
                    if (color === '#ffcc00' && (!p.includes(num) || p[i] === num)) return false;
                }
                return true;
            });
        });
        const count = possibilities.length;
        const confidence = count === 0 ? 0 : Math.floor(100 / count);
        if (storage.history.length < 3 && count > 1) {
            let tested = new Set();
            storage.history.forEach(att => att.forEach(item => tested.add(item.num)));
            let untried = "123456789".split("").filter(d => !tested.has(d));
            if (untried.length >= 3) return { suggestion: untried.slice(0,3).join(" "), prob: confidence };
        }
        return { suggestion: possibilities[0] ? possibilities[0].join(" ") : "???", prob: confidence };
    }

    createUI();
})();
