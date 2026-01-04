// ==UserScript==
// @name         Torn Christmas Town Chest Solver - PDA test
// @namespace    torn.christmas.chest.solver
// @version      5.2 - PDA Test
// @description  Optimized for TornPDA. Advanced Mastermind solver with entropy logic.
// @author       Airwalker2662 [3320076]
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559775/Torn%20Christmas%20Town%20Chest%20Solver%20-%20PDA%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/559775/Torn%20Christmas%20Town%20Chest%20Solver%20-%20PDA%20test.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // TornPDA often handles page loads differently, so we check for the body
    const init = () => {
        if (document.getElementById("chestSolverBox")) return;
        if (!document.querySelector('.christmas-town-main-container') && !document.body) {
            setTimeout(init, 500);
            return;
        }
        createUI();
    };

    const digits = "123456789";
    let possibleCodes = [];
    let attemptsUsed = 0;
    let currentFeedback = "";
    let historyState = [];
    const MAX_ATTEMPTS = 4;

    function generateCodes() {
        const codes = [];
        for (let a of digits) {
            for (let b of digits) {
                for (let c of digits) {
                    if (a !== b && b !== c && a !== c) codes.push(a + b + c);
                }
            }
        }
        return codes;
    }

    function score(guess, code) {
        let res = "";
        for (let i = 0; i < 3; i++) {
            if (guess[i] === code[i]) res += "g";
            else if (code.includes(guess[i])) res += "y";
            else res += "r";
        }
        return res;
    }

    function getBestGuess() {
        if (possibleCodes.length === 0) return "---";
        if (possibleCodes.length === 1) return possibleCodes[0];
        let bestCode = possibleCodes[0], maxEntropy = -1;
        const allPossible = generateCodes();
        const candidates = possibleCodes.length < 20 ? allPossible : possibleCodes;
        for (let guess of candidates) {
            let groups = {};
            for (let code of possibleCodes) {
                let res = score(guess, code);
                groups[res] = (groups[res] || 0) + 1;
            }
            let entropy = 0;
            for (let res in groups) {
                let p = groups[res] / possibleCodes.length;
                entropy -= p * Math.log2(p);
            }
            if (possibleCodes.includes(guess)) entropy += 0.01;
            if (entropy > maxEntropy) { maxEntropy = entropy; bestCode = guess; }
        }
        return bestCode;
    }

    function calculateStrategicProb(count, turns, bestMove) {
        if (count <= turns) return 100;
        if (turns <= 0 || count === 0) return 0;
        let groups = {};
        for (let code of possibleCodes) {
            let res = score(bestMove, code);
            groups[res] = (groups[res] || 0) + 1;
        }
        let avgRemaining = 0;
        for (let res in groups) avgRemaining += (groups[res] * groups[res]);
        avgRemaining /= count;
        let strength = (turns / avgRemaining) * 100;
        return Math.min(100, Math.max(Math.floor(strength), Math.floor((turns/count)*100)));
    }

    function createUI() {
        const box = document.createElement("div");
        box.id = "chestSolverBox";
        
        // Mobile-friendly default sizing
        const savedTop = localStorage.getItem('cs_top') || "50px";
        const savedLeft = localStorage.getItem('cs_left') || "10px";
        const isMinimized = localStorage.getItem('cs_minimized') === 'true';

        box.style = `position: fixed; top: ${savedTop}; left: ${savedLeft}; width: ${isMinimized ? '150px' : '260px'}; background: #222; color: #fff; border: 1px solid #444; border-radius: 8px; z-index: 999999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family: sans-serif; overflow: hidden; font-size: 14px;`;

        box.innerHTML = `
            <div id="cs_header" style="background: #333; padding: 10px; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                <strong style="color: #ff4545; font-size: 12px;">🎄 PDA Chest Solver</strong>
                <div id="cs_min_btn" style="cursor: pointer; padding: 0 10px; font-weight: bold; color: #aaa;">${isMinimized ? '+' : '−'}</div>
            </div>
            <div id="cs_content" style="display: ${isMinimized ? 'none' : 'block'}; padding: 10px;">
                <div id="cs_error_msg" style="display:none; color: #ff4444; font-size: 11px; text-align: center; margin-bottom: 8px;"></div>
                
                <div id="cs_best_move_container" style="background: #111; padding: 8px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #444; text-align: center;">
                    <div style="font-size: 9px; color: #aaa;">IDEAL MOVE</div>
                    <div id="cs_best_move" style="font-size: 22px; color: #4CAF50; font-weight: bold; letter-spacing: 4px;">---</div>
                </div>

                <div style="display: flex; gap: 5px; margin-bottom: 10px; font-size: 11px;">
                    <div style="flex: 1; background: #2a2a2a; padding: 5px; border-radius: 4px; text-align: center;">TURNS: <span id="cs_attempts_left">4</span></div>
                    <div style="flex: 2; background: #2a2a2a; padding: 5px; border-radius: 4px; text-align: center;">PROB: <span id="cs_win_chance">100%</span></div>
                </div>
                
                <input id="cs_guess" type="number" pattern="[1-9]*" inputmode="numeric" maxlength="3" placeholder="3-DIGIT COMBO" style="width: 100%; background: #111; color: #fff; border: 1px solid #555; padding: 10px; border-radius: 4px; text-align: center; font-size: 16px; margin-bottom: 10px;">

                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <button id="btn_g" style="flex:1; background:#4CAF50; border:none; color:#fff; height:40px; border-radius:4px; font-weight:bold;">G</button>
                    <button id="btn_y" style="flex:1; background:#FFC107; border:none; color:#fff; height:40px; border-radius:4px; font-weight:bold;">Y</button>
                    <button id="btn_r" style="flex:1; background:#F44336; border:none; color:#fff; height:40px; border-radius:4px; font-weight:bold;">R</button>
                </div>

                <div id="cs_feedback_display" style="height: 30px; background: #111; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-family: monospace; letter-spacing: 5px; margin-bottom: 10px; border: 1px dashed #444;"></div>

                <button id="cs_add" style="width:100%; background:#2a7cff; color:#fff; border:none; padding: 12px; border-radius:4px; font-weight:bold; margin-bottom: 10px;">SUBMIT DATA</button>
                
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <button id="cs_undo" style="flex:1; background:#555; border:none; color:#fff; padding: 8px; border-radius:4px;">Undo</button>
                    <button id="cs_reset" style="flex:1; background:#444; border:none; color:#ccc; padding: 8px; border-radius:4px;">Reset</button>
                </div>

                <div style="font-size: 10px; color: #88eeff; max-height: 60px; overflow-y: auto;" id="cs_results"></div>
            </div>
        `;
        document.body.appendChild(box);

        // Mobile Drag Support
        let active = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
        const dragStart = (e) => {
            initialX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - xOffset;
            initialY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - yOffset;
            if (e.target === document.getElementById("cs_header")) active = true;
        };
        const dragEnd = () => {
            active = false;
            localStorage.setItem('cs_top', box.style.top);
            localStorage.setItem('cs_left', box.style.left);
        };
        const drag = (e) => {
            if (active) {
                e.preventDefault();
                currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - initialX;
                currentY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - initialY;
                xOffset = currentX; yOffset = currentY;
                box.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        };
        document.getElementById("cs_header").addEventListener("touchstart", dragStart);
        document.addEventListener("touchend", dragEnd);
        document.addEventListener("touchmove", drag);

        // Core Listeners
        document.getElementById("btn_g").onclick = () => addColor('g');
        document.getElementById("btn_y").onclick = () => addColor('y');
        document.getElementById("btn_r").onclick = () => addColor('r');
        document.getElementById("cs_add").onclick = addGuess;
        document.getElementById("cs_undo").onclick = undoLast;
        document.getElementById("cs_reset").onclick = resetSolver;
        document.getElementById("cs_min_btn").onclick = () => {
            const content = document.getElementById("cs_content");
            const becomingMinimized = content.style.display !== "none";
            content.style.display = becomingMinimized ? "none" : "block";
            box.style.width = becomingMinimized ? "150px" : "260px";
            document.getElementById("cs_min_btn").innerText = becomingMinimized ? "+" : "−";
            localStorage.setItem('cs_minimized', becomingMinimized);
        };

        resetSolver();
    }

    function addColor(char) { 
        const val = document.getElementById("cs_guess").value;
        if (val.length === 3 && currentFeedback.length < 3) { 
            currentFeedback += char; 
            updateFeedbackDisplay();
        } 
    }

    function updateFeedbackDisplay() {
        const display = document.getElementById("cs_feedback_display");
        const val = document.getElementById("cs_guess").value;
        let html = "";
        for (let i = 0; i < 3; i++) {
            let num = val[i] || "_";
            let color = currentFeedback[i] === 'g' ? "#4CAF50" : (currentFeedback[i] === 'y' ? "#FFC107" : (currentFeedback[i] === 'r' ? "#F44336" : "#555"));
            html += `<span style="color:${color}">${num}</span>`;
        }
        display.innerHTML = html;
    }

    function addGuess() {
        const gInput = document.getElementById("cs_guess");
        const g = gInput.value;
        if (g.length === 3 && currentFeedback.length === 3) {
            historyState.push({ codes: [...possibleCodes], attempts: attemptsUsed });
            attemptsUsed++;
            possibleCodes = possibleCodes.filter(c => score(g, c) === currentFeedback);
            gInput.value = "";
            currentFeedback = "";
            updateUI();
            updateFeedbackDisplay();
        }
    }

    function undoLast() {
        if (historyState.length > 0) {
            const last = historyState.pop();
            possibleCodes = last.codes;
            attemptsUsed = last.attempts;
            updateUI();
        }
    }

    function updateUI() {
        const left = Math.max(0, MAX_ATTEMPTS - attemptsUsed);
        document.getElementById("cs_attempts_left").textContent = left;
        const best = getBestGuess();
        document.getElementById("cs_best_move").textContent = best;
        const prob = calculateStrategicProb(possibleCodes.length, left, best);
        document.getElementById("cs_win_chance").textContent = prob + "%";
        
        const resEl = document.getElementById("cs_results");
        resEl.innerHTML = possibleCodes.slice(0, 10).join(", ");
    }

    function resetSolver() {
        possibleCodes = generateCodes();
        attemptsUsed = 0;
        currentFeedback = "";
        historyState = [];
        updateUI();
        updateFeedbackDisplay();
    }

    init();
})();