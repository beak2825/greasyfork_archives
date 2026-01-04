// ==UserScript==
// @name         Torn War Score Calculator
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Calculates projected war scores and member requirements based on target score decay.
// @author       Gemini
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560575/Torn%20War%20Score%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/560575/Torn%20War%20Score%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Styles ---
    const styles = `
        #war-calc-trigger {
            background: #222;
            color: #7cfc00;
            padding: 0 10px;
            border: 1px solid #7cfc00;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 10px;
            font-weight: bold;
            display: inline-block;
            height: 24px;
            line-height: 22px;
            vertical-align: middle;
        }
        #war-calc-trigger:hover {
            background: #333;
        }
        #war-calc-container {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            border: 2px solid #444;
            flex-direction: column;
            gap: 12px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
            width: 360px;
        }
        .calc-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
        .calc-input {
            background: #222;
            border: 1px solid #555;
            color: #fff;
            padding: 6px;
            border-radius: 3px;
            width: 130px;
        }
        .calc-result-grid {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #555;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .result-full-row {
            background: #444;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .result-split-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .result-box {
            background: #444;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .result-label { font-size: 10px; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
        .result-val { font-size: 15px; font-weight: bold; color: #7cfc00; }
        .close-calc {
            align-self: flex-end;
            cursor: pointer;
            color: #888;
            font-size: 18px;
            margin-top: -10px;
        }
        .close-calc:hover { color: #fff; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- State ---
    let state = {
        targetScore: 0,
        startTimeUTC: null,
        plannedEndDateUTC: "",
        membersA: 100,
        membersB: 100,
        loserPercent: 40
    };

    function parseTargetScore(text) {
        const parts = text.split('/');
        if (parts.length < 2) return 0;
        return parseInt(parts[1].replace(/,/g, '').trim()) || 0;
    }

    function parseCountdown(element) {
        const spans = element.querySelectorAll('span');
        let timeStr = Array.from(spans).map(s => s.innerText).join('');
        const parts = timeStr.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 4) { // D:H:M:S
            seconds = (parts[0] * 86400) + (parts[1] * 3600) + (parts[2] * 60) + parts[3];
        } else if (parts.length === 3) { // H:M:S
            seconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
        }

        // Target exact hour start (UTC) - set to current hour relative to countdown
        let date = new Date(Date.now() + (seconds * 1000));
        date.setUTCMinutes(0, 0, 0);
        return date;
    }

    function calculate() {
        if (!state.startTimeUTC || !state.plannedEndDateUTC || !state.targetScore) return;

        // Ensure the input value is treated as an exact hour UTC
        // datetime-local returns YYYY-MM-DDTHH:mm
        const end = new Date(state.plannedEndDateUTC + ":00Z");

        const diffMs = end.getTime() - state.startTimeUTC.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        let currentTarget = state.targetScore;
        const decayRate = state.targetScore * 0.01; // 1% per hour

        if (diffHours > 24) {
            const decayHours = Math.floor(diffHours - 24);
            currentTarget = Math.max(0, state.targetScore - (decayHours * decayRate));
        }

        const loserScore = state.targetScore * (state.loserPercent / 100);
        const winnerScore = currentTarget + loserScore;

        const scorePerMemA = winnerScore / state.membersA;
        const scorePerMemB = loserScore / state.membersB;

        updateUI(currentTarget, winnerScore, loserScore, scorePerMemA, scorePerMemB);
    }

    function updateUI(curTarget, win, lose, spmA, spmB) {
        document.getElementById('res-target').innerText = Math.round(curTarget).toLocaleString();
        document.getElementById('res-winner').innerText = Math.round(win).toLocaleString();
        document.getElementById('res-loser').innerText = Math.round(lose).toLocaleString();
        document.getElementById('res-spmA').innerText = spmA.toFixed(2);
        document.getElementById('res-spmB').innerText = spmB.toFixed(2);
    }

    function initInterface() {
        const targetEl = document.querySelector('.target___NBVXq');
        const timerEl = document.querySelector('.infoBlock___bb_KF.timer___fSGg8');
        const anchor = document.querySelector('#top-page-links-list');

        if (!anchor || document.getElementById('war-calc-trigger')) return;

        state.targetScore = parseTargetScore(targetEl ? targetEl.innerText : "0 / 0");
        state.startTimeUTC = timerEl ? parseCountdown(timerEl) : new Date();

        // Create Trigger Button
        const btn = document.createElement('button');
        btn.id = 'war-calc-trigger';
        btn.innerText = '📊 Calculator';
        anchor.appendChild(btn);

        // Create Modal
        const container = document.createElement('div');
        container.id = 'war-calc-container';
        container.innerHTML = `
            <div class="close-calc" id="close-calc">×</div>
            <div style="font-weight:bold; border-bottom: 1px solid #555; padding-bottom: 5px; margin-top: -10px;">War Score Predictor</div>
            <div style="font-size: 11px; color: #ccc; margin-top: 5px;">Start (UTC): ${state.startTimeUTC.toUTCString()}</div>
            <div style="font-size: 11px; color: #ccc;">Base Target: ${state.targetScore.toLocaleString()}</div>

            <div class="calc-row">
                <label>Planned End (UTC):</label>
                <input type="datetime-local" id="calc-end" class="calc-input" step="3600">
            </div>
            <div class="calc-row">
                <label>Loser %:</label>
                <input type="number" id="calc-loser-p" class="calc-input" value="40">
            </div>
            <div class="calc-row">
                <label>Mems (W):</label>
                <input type="number" id="calc-mem-a" class="calc-input" value="100">
            </div>
            <div class="calc-row">
                <label>Mems (L):</label>
                <input type="number" id="calc-mem-b" class="calc-input" value="100">
            </div>

            <div class="calc-result-grid">
                <div class="result-full-row">
                    <div class="result-label">Final Score Target</div>
                    <div id="res-target" class="result-val">-</div>
                </div>
                <div class="result-split-row">
                    <div class="result-box"><div class="result-label">Winner Score</div><div id="res-winner" class="result-val">-</div></div>
                    <div class="result-box"><div class="result-label">Loser Score</div><div id="res-loser" class="result-val">-</div></div>
                </div>
                <div class="result-split-row">
                    <div class="result-box"><div class="result-label">Winner Score/Mem</div><div id="res-spmA" class="result-val">-</div></div>
                    <div class="result-box"><div class="result-label">Loser Score/Mem</div><div id="res-spmB" class="result-val">-</div></div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Toggle Logic
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            container.style.display = (container.style.display === 'flex' ? 'none' : 'flex');
        });
        document.getElementById('close-calc').addEventListener('click', () => {
            container.style.display = 'none';
        });

        // Events
        const inputs = ['calc-end', 'calc-loser-p', 'calc-mem-a', 'calc-mem-b'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (id === 'calc-end') state.plannedEndDateUTC = e.target.value;
                if (id === 'calc-loser-p') state.loserPercent = parseFloat(e.target.value);
                if (id === 'calc-mem-a') state.membersA = parseInt(e.target.value) || 1;
                if (id === 'calc-mem-b') state.membersB = parseInt(e.target.value) || 1;
                calculate();
            });
        });
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector('.rankBox___OzP3D')) {
            initInterface();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();