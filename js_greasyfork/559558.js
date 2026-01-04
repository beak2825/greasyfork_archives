// ==UserScript==
// @name         Torn Chest Solver for Christmas Town - Universal PC / PDA
// @namespace    torn.christmas.chest.solver
// @version      9.3
// @description  Further improved algorithm to avoid 50/50 situations when possible
// @author       Airwalker2662 - https://www.torn.com/profiles.php?XID=3320076
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559558/Torn%20Chest%20Solver%20for%20Christmas%20Town%20-%20Universal%20PC%20%20PDA.user.js
// @updateURL https://update.greasyfork.org/scripts/559558/Torn%20Chest%20Solver%20for%20Christmas%20Town%20-%20Universal%20PC%20%20PDA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_ID = 'cs_universal_v93';
    if (window[SCRIPT_ID]) return;
    window[SCRIPT_ID] = true;

    const digits = "123456789";
    let possibleCodes = [];
    let attemptsUsed = 0;
    let currentFeedback = "";
    let historyState = [];
    let guessHistory = [];
    let isAutoMode = localStorage.getItem('cs_auto_mode') !== 'false';
    let isCurrentGameFinished = false;
    const MAX_ATTEMPTS = 4;

    let stats = JSON.parse(localStorage.getItem('cs_stats')) || { solved: 0, failed: 0 };

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
        // Always suggest "123" as the first move
        if (attemptsUsed === 0) return "123";
        if (possibleCodes.length === 0) return "---";
        if (possibleCodes.length === 1) return possibleCodes[0];

        const left = MAX_ATTEMPTS - attemptsUsed;

        // If last attempt and multiple possibilities, just pick the first one
        if (left === 1) return possibleCodes[0];

        // IMPROVED: Special handling for 3 codes with 2 attempts remaining
        if (possibleCodes.length === 3 && left === 2) {
            return findOptimalProbeFor3Codes();
        }

        // IMPROVED: Special handling for small sets with 2+ attempts
        if (possibleCodes.length <= 6 && left >= 2) {
            return findOptimalProbeForSmallSet(left);
        }

        let bestCode = possibleCodes[0];
        let minMaxRemaining = Infinity;

        // Use minimax strategy: minimize the maximum group size
        const allPossible = generateCodes();
        const candidates = possibleCodes.length < 50 ? allPossible : possibleCodes;

        for (let guess of candidates) {
            let groups = {};
            for (let code of possibleCodes) {
                let res = score(guess, code);
                groups[res] = (groups[res] || 0) + 1;
            }

            // Find the maximum group size for this guess
            let maxGroup = Math.max(...Object.values(groups));

            // Tie-breaker: prefer guesses that are in possibleCodes
            let tieBreaker = possibleCodes.includes(guess) ? -0.01 : 0;
            let adjustedMax = maxGroup + tieBreaker;

            // We want to minimize the worst-case scenario
            if (adjustedMax < minMaxRemaining) {
                minMaxRemaining = adjustedMax;
                bestCode = guess;
            }
        }

        return bestCode;
    }

    // NEW: Find optimal probe code for exactly 3 remaining possibilities with 2 attempts
    function findOptimalProbeFor3Codes() {
        const allCodes = generateCodes();
        let bestGuess = possibleCodes[0];
        let bestScore = -1;

        // Try every possible code (including ones not in possibleCodes)
        for (let guess of allCodes) {
            let groups = {};
            for (let code of possibleCodes) {
                let res = score(guess, code);
                groups[res] = (groups[res] || 0) + 1;
            }

            const groupSizes = Object.values(groups);
            const maxGroupSize = Math.max(...groupSizes);
            const numGroups = groupSizes.length;

            // BEST CASE: All 3 codes give different feedback (3 groups of size 1)
            // This guarantees we can solve it
            if (numGroups === 3 && maxGroupSize === 1) {
                return guess; // Perfect probe found!
            }

            // Score based on how well it separates
            // Priority: max groups, min largest group
            let scoreValue = (numGroups * 1000) - maxGroupSize;

            // Bonus if this guess is actually one of the possible solutions
            if (possibleCodes.includes(guess)) {
                scoreValue += 100;
            }

            if (scoreValue > bestScore) {
                bestScore = scoreValue;
                bestGuess = guess;
            }
        }

        return bestGuess;
    }

    // NEW: Find optimal probe for small sets (2-6 codes)
    function findOptimalProbeForSmallSet(attemptsRemaining) {
        const allCodes = generateCodes();
        let bestGuess = possibleCodes[0];
        let minWorstCase = possibleCodes.length;

        for (let guess of allCodes) {
            let groups = {};
            for (let code of possibleCodes) {
                let res = score(guess, code);
                groups[res] = (groups[res] || 0) + 1;
            }

            const maxGroupSize = Math.max(...Object.values(groups));

            // Check if this guess guarantees a solution
            if (maxGroupSize === 1) {
                return guess; // Perfect separation!
            }

            // If not perfect, evaluate worst-case
            // Can we solve maxGroupSize with attemptsRemaining-1 attempts?
            let worstCaseRisk = maxGroupSize;

            // If the guess is in possibleCodes, we might get lucky
            if (possibleCodes.includes(guess)) {
                worstCaseRisk = Math.max(1, maxGroupSize - 1);
            }

            if (worstCaseRisk < minWorstCase) {
                minWorstCase = worstCaseRisk;
                bestGuess = guess;
            } else if (worstCaseRisk === minWorstCase && possibleCodes.includes(guess)) {
                // Tie-breaker: prefer codes in possibleCodes
                bestGuess = guess;
            }
        }

        return bestGuess;
    }

    function calculateStrategicProb(count, turns, bestMove) {
        if (count === 1) return 100;
        if (turns <= 0) return 0;
        if (turns === 1) return Math.floor((1 / count) * 100);

        // Simulate the feedback groups for this move
        let groups = {};
        for (let code of possibleCodes) {
            let res = score(bestMove, code);
            groups[res] = (groups[res] || 0) + 1;
        }

        const groupSizes = Object.values(groups);
        const maxGroup = Math.max(...groupSizes);
        const numGroups = groupSizes.length;

        // IMPROVED: Better probability calculation

        // If this move perfectly separates (all groups size 1), guaranteed win
        if (maxGroup === 1) return 100;

        // If we guess one of the possible codes
        if (possibleCodes.includes(bestMove)) {
            // Probability of guessing correctly immediately
            const directWinProb = 1 / count;

            // If wrong, what's the worst case with remaining attempts?
            const remainingAfterWrong = count - 1;
            const turnsAfterThis = turns - 1;

            if (turnsAfterThis === 0) {
                return Math.floor(directWinProb * 100);
            }

            // Recursively calculate probability for remaining scenarios
            const worstCaseAfter = maxGroup - 1; // Worst case if we're wrong
            let probAfterWrong;

            if (turnsAfterThis === 1) {
                probAfterWrong = 1 / worstCaseAfter;
            } else if (worstCaseAfter === 1) {
                probAfterWrong = 1.0;
            } else if (worstCaseAfter === 2) {
                probAfterWrong = 0.5;
            } else {
                probAfterWrong = Math.min(0.8, 1 / worstCaseAfter);
            }

            const totalProb = directWinProb + (1 - directWinProb) * probAfterWrong;
            return Math.floor(totalProb * 100);
        }

        // For probe codes not in possibleCodes
        const remainingTurns = turns - 1;

        if (remainingTurns === 1) {
            return Math.floor((1 / maxGroup) * 100);
        }

        if (maxGroup === 1) return 100;
        if (maxGroup === 2) return 95;
        if (maxGroup === 3) return 75;
        if (maxGroup <= 5) return 50;
        return Math.max(10, Math.floor((1 / maxGroup) * 100));
    }

    function saveStats() { localStorage.setItem('cs_stats', JSON.stringify(stats)); updateStatsUI(); }

    function updateStatsUI() {
        const totalGames = stats.solved + stats.failed;
        const rate = totalGames === 0 ? 0 : Math.round((stats.solved / totalGames) * 100);
        const color = totalGames > 0 ? (rate >= 90 ? "#4CAF50" : (rate >= 80 ? "#FFC107" : "#F44336")) : "#888";

        const s = document.getElementById("cs_stat_solved"),
              r = document.getElementById("cs_stat_rate"),
              t = document.getElementById("cs_stat_total"),
              p = document.getElementById("cs_live_possible");

        if(s) { s.textContent = stats.solved; s.style.color = color; }
        if(r) { r.textContent = rate + "%"; r.style.color = color; }
        if(t) { t.textContent = totalGames; t.style.color = color; }
        if(p) { p.textContent = possibleCodes.length; p.style.color = possibleCodes.length <= 10 ? "#4CAF50" : "#fff"; }
    }

    function isTornPDA() {
        return window.location.hostname.includes('tornpda') ||
               navigator.userAgent.toLowerCase().includes('tornpda') ||
               document.body.classList.contains('pda-body');
    }

    function createUI() {
        if (document.getElementById("chestSolverBox")) return;
        const box = document.createElement("div");
        box.id = "chestSolverBox";

        const isPDA = isTornPDA();
        const defaultTop = isPDA ? '10px' : '120px';
        const defaultLeft = isPDA ? '10px' : 'calc(100% - 300px)';

        box.style = `position: fixed; top: ${localStorage.getItem('cs_top') || defaultTop}; left: ${localStorage.getItem('cs_left') || defaultLeft}; width: 280px; background: #222; color: #fff; border: 1px solid #444; border-radius: 8px; z-index: 999999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden; touch-action: none;`;

        box.innerHTML = `
            <style>
                .cs_color_btn { flex: 1; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; color: white; font-weight: bold; height: 35px; }
                .cs_toggle { position: relative; display: inline-block; width: 34px; height: 20px; }
                .cs_toggle input { opacity: 0; width: 0; height: 0; }
                .cs_slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 20px; }
                .cs_slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .cs_slider { background-color: #2a7cff; }
                input:checked + .cs_slider:before { transform: translateX(14px); }
                @keyframes cs_pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
                .cs_solved_anim { animation: cs_pulse 2s infinite ease-in-out; border: 2px solid #FFD700 !important; background: #2c2500 !important; }
            </style>
            <div id="cs_header" style="background: #333; padding: 10px; border-bottom: 1px solid #444; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <a href="https://www.torn.com/profiles.php?XID=3320076" target="_blank" style="color: #888; font-size: 10px; font-weight: bold; text-decoration: none; cursor: pointer;">Airwalker2662</a>
                    <strong style="color: #ff4545; font-size: 13px;">🎄 Chest Solver Elite <span style="font-size: 10px; color: #aaa; font-weight: normal;">v9.3</span></strong>
                </div>
                <div id="cs_min_btn" style="cursor: pointer; padding: 0 5px; font-weight: bold; color: #aaa; font-size: 18px; line-height: 10px;">−</div>
            </div>
            <div id="cs_content">
                <div style="padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #1a1a1a; padding: 5px 10px; border-radius: 4px;">
                        <span style="font-size: 9px; color: #aaa; font-weight: bold;">AUTO-FILL MODE</span>
                        <label class="cs_toggle"><input type="checkbox" id="cs_mode_toggle" ${isAutoMode ? 'checked' : ''}><span class="cs_slider"></span></label>
                    </div>

                    <div id="cs_best_move_container" style="background: #111; padding: 10px; border-radius: 4px; margin-bottom: 12px; border: 1px solid #444; text-align: center; cursor: pointer;">
                        <div id="cs_move_label" style="font-size: 9px; color: #aaa; font-weight: bold; letter-spacing: 1.5px; margin-bottom: 4px;">IDEAL MOVE 🔄</div>
                        <div id="cs_best_move" style="font-size: 26px; color: #4CAF50; font-weight: bold; letter-spacing: 2px;">---</div>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <div style="flex: 1.2; background: #2a2a2a; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #333;"><div style="font-size: 9px; color: #aaa;">STEP</div><strong id="cs_attempts_display" style="font-size: 15px; color: #2a7cff;">1 of 4</strong></div>
                        <div style="flex: 1.8; background: #2a2a2a; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #333;"><div style="font-size: 9px; color: #aaa;">WIN PROBABILITY</div><strong id="cs_win_chance" style="font-size: 15px; color: #4CAF50;">100%</strong></div>
                    </div>

                    <div style="background: #2a2a2a; padding: 6px; border-radius: 4px; text-align: center; border: 1px solid #333; margin-bottom: 10px;">
                        <div style="font-size: 9px; color: #aaa; font-weight: bold;">POSSIBLE SOLUTIONS REMAINING</div>
                        <strong id="cs_live_possible" style="font-size: 18px; color: #fff;">504</strong>
                    </div>

                    <div style="font-size: 9px; color: #aaa; font-weight: bold; margin-bottom: 2px; text-align: center;">CURRENT ATTEMPT RESULTS</div>
                    <div id="cs_feedback_display" style="height: 30px; background: #111; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-family: monospace; letter-spacing: 8px; font-weight: bold; border: 1px dashed #444; margin-bottom: 10px; outline: none;"></div>
                    <div style="font-size: 8px; color: #888; text-align: center; margin-bottom: 8px; font-style: italic;">Manual mode: Type digits 1-9, use Backspace</div>

                    <div style="display: flex; gap: 5px; height: 35px; margin-bottom: 8px;">
                        <button id="btn_g" class="cs_color_btn" style="background: #4CAF50;">G</button>
                        <button id="btn_y" class="cs_color_btn" style="background: #FFC107;">Y</button>
                        <button id="btn_r" class="cs_color_btn" style="background: #F44336;">R</button>
                    </div>

                    <button id="cs_add" style="width: 100%; background: #2a7cff; color: #fff; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 8px;">SUBMIT DATA</button>

                    <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                        <button id="cs_undo" style="flex: 1; background: #555; color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Undo</button>
                        <button id="cs_reset" style="flex: 1; background: #f44336; color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">RESET GAME</button>
                    </div>

                    <div style="background: #111; padding: 8px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #444;">
                        <div style="font-size: 8px; color: #aaa; font-weight: bold; margin-bottom: 5px; text-align: center;">ATTEMPT HISTORY</div>
                        <div id="cs_history_table" style="font-family: monospace; font-size: 12px; margin-bottom: 8px; text-align: center; line-height: 1.4;"></div>
                    </div>

                    <div style="background: #1a1a1a; padding: 8px; border-radius: 4px; border: 1px solid #333;">
                         <div style="display: flex; gap: 5px;">
                             <div style="flex: 1.2; text-align: center; border-right: 1px solid #333;"><div style="font-size: 8px; color: #aaa; font-weight: bold;">ATTEMPTS</div><strong id="cs_stat_total" style="font-size: 14px;">0</strong></div>
                             <div style="flex: 1; text-align: center; border-right: 1px solid #333;"><div style="font-size: 8px; color: #aaa; font-weight: bold;">SOLVED</div><strong id="cs_stat_solved" style="font-size: 14px;">0</strong></div>
                             <div style="flex: 1.1; text-align: center;"><div style="font-size: 8px; color: #aaa; font-weight: bold;">WIN RATE</div><strong id="cs_stat_rate" style="font-size: 14px;">0%</strong></div>
                         </div>
                    </div>

                    <div style="text-align: center; margin-top: 10px;">
                        <span id="cs_reset_stats" style="font-size: 10px; color: #2a7cff; cursor: pointer; text-decoration: underline; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Reset Stats</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(box);

        document.getElementById("cs_mode_toggle").addEventListener('change', function() {
            isAutoMode = this.checked;
            localStorage.setItem('cs_auto_mode', isAutoMode);
            manualOverrideCode = null;
            manualEntryCode = ""; // Clear manual entry when switching modes
            updateFeedbackDisplay();
        });

        const header = document.getElementById("cs_header");

        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        function dragStart(e) {
            if (e.target.tagName === 'A' || e.target.id === 'cs_min_btn') return;
            isDragging = true;
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - box.offsetLeft;
                initialY = e.touches[0].clientY - box.offsetTop;
            } else {
                initialX = e.clientX - box.offsetLeft;
                initialY = e.clientY - box.offsetTop;
            }
            header.style.cursor = 'grabbing';
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                header.style.cursor = 'move';
                localStorage.setItem('cs_top', box.style.top);
                localStorage.setItem('cs_left', box.style.left);
            }
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            box.style.left = currentX + "px";
            box.style.top = currentY + "px";
        }

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        header.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        document.getElementById("btn_g").onclick = () => addColor('g');
        document.getElementById("btn_y").onclick = () => addColor('y');
        document.getElementById("btn_r").onclick = () => addColor('r');
        document.getElementById("cs_add").onclick = addGuess;
        document.getElementById("cs_undo").onclick = undoLast;
        document.getElementById("cs_reset").onclick = resetSolver;
        document.getElementById("cs_reset_stats").onclick = () => { if(confirm("Reset Stats?")) { stats = {solved:0, failed:0}; saveStats(); } };

        document.getElementById("cs_min_btn").onclick = () => {
            const c = document.getElementById("cs_content");
            const isHidden = c.style.display === "none";
            c.style.display = isHidden ? "block" : "none";
            document.getElementById("cs_min_btn").textContent = isHidden ? "−" : "+";
        };

        // Add keyboard event listener for manual code entry
        document.addEventListener('keydown', function(e) {
            if (handleManualCodeEntry(e.key)) {
                e.preventDefault();
            }
        });

        // Add click listener to feedback display for focus in manual mode
        document.getElementById("cs_feedback_display").addEventListener('click', function() {
            if (!isAutoMode && !isCurrentGameFinished) {
                this.focus();
            }
        });

        updateStatsUI();
        resetSolver();
    }

    function addColor(char) {
        if (isCurrentGameFinished || currentFeedback.length >= 3) return;
        currentFeedback += char;
        updateFeedbackDisplay();
    }

    let manualOverrideCode = null;
    let manualEntryCode = "";

    function updateFeedbackDisplay() {
        const display = document.getElementById("cs_feedback_display");
        let val;
        if (manualOverrideCode) {
            val = manualOverrideCode;
        } else if (isAutoMode) {
            const moveTxt = document.getElementById("cs_best_move").innerText;
            val = moveTxt.match(/\d{3}/) ? moveTxt.match(/\d{3}/)[0] : "___";
        } else {
            // Manual mode - use the manually entered code
            val = manualEntryCode.padEnd(3, "_");
        }

        let html = "";
        for (let i = 0; i < 3; i++) {
            let color = currentFeedback[i] === 'g' ? "#4CAF50" : (currentFeedback[i] === 'y' ? "#FFC107" : (currentFeedback[i] === 'r' ? "#F44336" : "#555"));
            html += `<span style="color:${color}">${val[i] || "_"}</span>`;
        }
        display.innerHTML = html;

        // Make display editable in manual mode
        if (!isAutoMode && !isCurrentGameFinished) {
            display.style.cursor = "text";
            display.setAttribute("tabindex", "0");
        } else {
            display.style.cursor = "default";
            display.removeAttribute("tabindex");
        }
    }

    function handleManualCodeEntry(key) {
        if (isAutoMode || isCurrentGameFinished) return false;

        if (key >= '1' && key <= '9' && manualEntryCode.length < 3) {
            manualEntryCode += key;
            updateFeedbackDisplay();
            return true;
        } else if (key === 'Backspace' && manualEntryCode.length > 0) {
            manualEntryCode = manualEntryCode.slice(0, -1);
            updateFeedbackDisplay();
            return true;
        }
        return false;
    }

    function addGuess() {
        if (isCurrentGameFinished || currentFeedback.length < 3) return;

        let g;
        if (manualOverrideCode) {
            g = manualOverrideCode;
        } else if (isAutoMode) {
            const moveTxt = document.getElementById("cs_best_move").innerText;
            g = moveTxt.match(/\d{3}/) ? moveTxt.match(/\d{3}/)[0] : "";
        } else {
            // Manual mode - use the manually entered code
            g = manualEntryCode;
        }

        const f = currentFeedback;
        if (g.length === 3) {
            historyState.push({ codes: [...possibleCodes], att: attemptsUsed, fin: isCurrentGameFinished, hist: [...guessHistory] });
            guessHistory.push({g, f});
            attemptsUsed++;
            possibleCodes = possibleCodes.filter(c => score(g, c) === f);
            currentFeedback = "";
            manualOverrideCode = null;
            manualEntryCode = ""; // Clear manual entry

            if (f === "ggg") {
                isCurrentGameFinished = true;
                stats.solved++;
                saveStats();
            } else if (attemptsUsed >= MAX_ATTEMPTS) {
                isCurrentGameFinished = true;
                stats.failed++;
                saveStats();
            }

            updateUI();
        }
    }

    function undoLast() {
        if (historyState.length > 0) {
            const last = historyState.pop();
            possibleCodes = last.codes; attemptsUsed = last.att; isCurrentGameFinished = last.fin; guessHistory = last.hist;
            updateUI();
        }
    }

    function updateUI() {
        const count = possibleCodes.length;
        const bestMove = getBestGuess();
        document.getElementById("cs_attempts_display").textContent = `${Math.min(4, attemptsUsed + 1)} of 4`;

        const moveContainer = document.getElementById("cs_best_move_container");
        const moveLabel = document.getElementById("cs_move_label");
        const moveText = document.getElementById("cs_best_move");

        if (isCurrentGameFinished) {
            const solvedEntry = guessHistory.find(h => h.f === "ggg");
            if (solvedEntry) {
                moveContainer.className = "cs_solved_anim";
                moveLabel.textContent = "STATUS";
                moveText.textContent = `✔️ SOLVED: ${solvedEntry.g}`;
                moveText.style.color = "#FFD700";
                moveContainer.onclick = null;
                moveContainer.style.cursor = "default";
            } else {
                moveLabel.textContent = "STATUS";
                moveText.textContent = "FAILED";
                moveText.style.color = "#F44336";
                moveContainer.className = "";
                moveContainer.onclick = null;
                moveContainer.style.cursor = "default";
            }
        } else {
            moveContainer.className = "";

            if (attemptsUsed === 3 && count > 1 && count <= 10) {
                moveLabel.textContent = "POSSIBLE SOLUTIONS";
                let codesHtml = possibleCodes.map((code, idx) =>
                    `<span class="clickable-code" data-code="${code}" style="cursor: pointer; padding: 0 5px;">${code}</span>`
                ).join('<span style="color: #888;"> OR </span>');

                moveText.innerHTML = codesHtml;
                moveText.style.color = "#FFC107";
                moveText.style.fontSize = count > 5 ? "18px" : "22px";

                setTimeout(() => {
                    document.querySelectorAll('.clickable-code').forEach(span => {
                        span.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const code = this.getAttribute('data-code');
                            if (code) {
                                manualOverrideCode = code;
                                this.style.background = "#1a3a1a";
                                setTimeout(() => {
                                    this.style.background = "transparent";
                                }, 200);
                                updateFeedbackDisplay();
                            }
                        });
                    });
                }, 0);
            } else {
                moveLabel.textContent = "IDEAL MOVE 🔄";
                moveText.textContent = bestMove;
                moveText.style.color = "#4CAF50";
                moveText.style.fontSize = "26px";
            }

            moveContainer.style.cursor = "pointer";
            moveContainer.onclick = (e) => {
                if (!e.target.classList.contains('clickable-code')) {
                    const code = moveText.textContent.match(/\d{3}/);
                    if (code && code[0]) {
                        manualOverrideCode = code[0];
                        moveContainer.style.background = "#1a3a1a";
                        setTimeout(() => {
                            moveContainer.style.background = "#111";
                        }, 200);
                        updateFeedbackDisplay();
                    }
                }
            };
        }

        const prob = calculateStrategicProb(count, MAX_ATTEMPTS - attemptsUsed, bestMove);
        const winEl = document.getElementById("cs_win_chance");
        winEl.textContent = prob + "%";
        winEl.style.color = prob >= 80 ? "#4CAF50" : (prob >= 50 ? "#FFC107" : "#F44336");

        const hTable = document.getElementById("cs_history_table");
        let tableHTML = "";
        for (let i = 0; i < 4; i++) {
            const h = guessHistory[i];
            if (h) {
                let colStr = "";
                for(let j=0; j<3; j++) {
                    let c = h.f[j] === 'g' ? "#4CAF50" : (h.f[j] === 'y' ? "#FFC107" : "#F44336");
                    colStr += `<span style="color:${c}; font-weight:bold; font-size:14px; margin:0 4px;">${h.g[j]}</span>`;
                }
                tableHTML += `<div>${colStr}</div>`;
            } else { tableHTML += `<div style="color:#333; letter-spacing:8px;">- - -</div>`; }
        }
        hTable.innerHTML = tableHTML;

        updateStatsUI();
        updateFeedbackDisplay();
    }

    function resetSolver() {
        possibleCodes = generateCodes(); attemptsUsed = 0; historyState = []; guessHistory = []; currentFeedback = ""; isCurrentGameFinished = false; manualOverrideCode = null; manualEntryCode = "";
        updateUI();
    }

    if (document.readyState === 'complete') createUI();
    else window.addEventListener('load', createUI);
    setInterval(createUI, 2000);

})();