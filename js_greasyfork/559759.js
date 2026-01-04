// ==UserScript==
// @name         Torn Group Attack Helper
// @namespace    http://tampermonkey.net/felsync-group-attack-helper
// @version      1.0
// @description  Overlays order (left) and live distraction (right) from logs. Fixes missing numbers in Solo view.
// @author       Felsync [3921027]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/559759/Torn%20Group%20Attack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559759/Torn%20Group%20Attack%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS: Force visibility and correct positioning
    GM_addStyle(`
        /* TARGETING: Use !important to override Torn's default flexbox quirks */
        span[class*="playername___"] {
            display: inline-block !important; /* Required for padding to work */
            position: relative !important;
            margin-left: 20px !important; /* Push name to the right to make room for badge */
            margin-right: 20px !important; /* Push space on right for distraction badge */
            overflow: visible !important;  /* Allow badges to hang outside */
            white-space: nowrap !important;
        }

        /* LEFT BADGE: Order # */
        span[class*="playername___"][data-attack-order]::before {
            content: attr(data-attack-order);
            position: absolute;
            left: -22px; /* Hang it to the left of the text */
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;

            /* Visuals */
            background: #222;
            color: #eee;
            font-size: 11px;
            font-weight: 800;
            border-radius: 4px;
            border: 1px solid #777;
            z-index: 9999; /* Float above everything */
            pointer-events: none;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        /* RIGHT BADGE: Distraction Score */
        span[class*="playername___"][data-distraction-score]::after {
            content: attr(data-distraction-score);
            position: absolute;
            right: -22px; /* Hang it to the right of the text */
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;

            /* Visuals */
            background: #d35400; /* Orange */
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            border-radius: 4px;
            border: 1px solid #e67e22;
            z-index: 9999;
            pointer-events: none;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        /* COPY BUTTON */
        .attack-copy-btn {
            background: #444;
            color: #fff;
            border: 1px solid #666;
            border-radius: 4px;
            padding: 3px 8px;
            margin-left: 10px;
            font-size: 11px;
            cursor: pointer;
            font-weight: bold;
            display: inline-block;
            vertical-align: middle;
        }
        .attack-copy-btn:hover { background: #666; }
        .attack-copy-btn:active { background: #28a745; border-color: #28a745; }
    `);

    // --- LOGIC: Distraction Calculation ---
    function getAttackerNames() {
        const list = document.querySelector('ul[class*="participants___"]');
        if (!list) return [];
        const rows = list.querySelectorAll('li[class*="row___"]');
        return Array.from(rows).map(row => {
            const nameEl = row.querySelector('span[class*="playername___"]');
            return nameEl ? nameEl.innerText.trim() : null;
        }).filter(n => n);
    }

    function calculateDistractionScores() {
        const attackerNames = getAttackerNames();
        if (attackerNames.length === 0) return {};

        // Start all scores at 0
        let scores = {};
        attackerNames.forEach(name => scores[name] = 0);

        // Scan Log
        const logWrap = document.querySelector('div[class*="logWrap___"]');
        if (!logWrap) return scores;

        // Read log from BOTTOM (Oldest) to TOP (Newest)
        const logRows = Array.from(logWrap.querySelectorAll('li[class*="row___"]')).reverse();

        logRows.forEach(row => {
            const messageEl = row.querySelector('span[class*="message___"]');
            if (!messageEl) return;

            const text = messageEl.innerText.trim();
            // Find which attacker caused this line
            const actor = attackerNames.find(name => text.startsWith(name));

            if (actor) {
                // Rule 1: Attacker resets to 0
                scores[actor] = 0;
                // Rule 2: Everyone else gets +1
                attackerNames.forEach(other => {
                    if (other !== actor) scores[other] += 1;
                });
            }
        });

        return scores;
    }

    // --- UI UPDATER ---
    function updateUI() {
        // 1. Locate the list
        const list = document.querySelector('ul[class*="participants___"]');
        if (!list) return;

        // 2. Calculate live scores
        const liveScores = calculateDistractionScores();

        // 3. Update Rows
        const rows = list.querySelectorAll('li[class*="row___"]');
        rows.forEach((row, index) => {
            // FIX: Force the PARENT container to allow overflow
            // This is critical for Solo view where the box is tight
            const playerWrap = row.querySelector('div[class*="playerWrap___"]');
            if (playerWrap && getComputedStyle(playerWrap).overflow !== 'visible') {
                playerWrap.style.overflow = 'visible';
            }

            const nameEl = row.querySelector('span[class*="playername___"]');
            if (nameEl) {
                const name = nameEl.innerText.trim();

                // A. Left Badge (Order)
                const newOrder = (index + 1).toString();
                if (nameEl.dataset.attackOrder !== newOrder) {
                    nameEl.dataset.attackOrder = newOrder;
                }

                // B. Right Badge (Distraction)
                // Default to 0 if name not found in logs (e.g. start of fight)
                const score = liveScores.hasOwnProperty(name) ? liveScores[name].toString() : "0";
                if (nameEl.dataset.distractionScore !== score) {
                    nameEl.dataset.distractionScore = score;
                }
            }
        });

        // 4. Inject Copy Button
        const header = document.getElementById('stats-header');
        if (header && !header.querySelector('.attack-copy-btn')) {
            const titleText = header.querySelector('div[class*="titleText___"]');
            if (titleText) {
                const btn = document.createElement('button');
                btn.className = 'attack-copy-btn';
                btn.textContent = 'Copy Strategy';
                btn.type = 'button';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    copyListToClipboard();
                });
                titleText.appendChild(btn);
            }
        }
    }

    // --- COPY LOGIC ---
    function copyListToClipboard() {
        const list = document.querySelector('ul[class*="participants___"]');
        if (!list) return;

        const rows = list.querySelectorAll('li[class*="row___"]');
        const attackers = rows.length;
        const maxDistraction = Math.max(0, attackers - 1);

        let clipboardText = `Round 1 Attack Order:\n`;

        rows.forEach((row, index) => {
            const nameEl = row.querySelector('span[class*="playername___"]');
            if (nameEl) {
                const currentDistraction = index;
                clipboardText += ` ${index + 1} ${nameEl.innerText.trim()} (Distraction: ${currentDistraction})\n`;
            }
        });

        clipboardText += `\nRound 2:\n`;
        clipboardText += `Attackers: ${attackers} Max Distraction: ${maxDistraction}\n`;
        clipboardText += `Attack at Distraction ${maxDistraction}`;

        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(clipboardText);
        } else {
            navigator.clipboard.writeText(clipboardText);
        }
    }

    // Run frequently (every 500ms for snappier log updates)
    setInterval(updateUI, 500);
    updateUI();

})();