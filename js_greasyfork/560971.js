// ==UserScript==
// @name         Torn Poker Strength 5.23 (draggable fixed)
// @namespace    https://www.torn.com/
// @version      5.23
// @description  tested and IT WORKS LETS GOOOOOOO
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560971/Torn%20Poker%20Strength%20523%20%28draggable%20fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560971/Torn%20Poker%20Strength%20523%20%28draggable%20fixed%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CARD UTILITIES ----------
    const ranks = "23456789TJQKA";
    const suitMap = { hearts: 'h', spades: 's', diamonds: 'd', clubs: 'c' };

    function cardValue(card) { return ranks.indexOf(card[0]); }
    function cardSuit(card) { return card[1]; }

    function parseCardFromClassList(classList) {
        for (const cls of classList) {
            const m = cls.match(/(hearts|spades|diamonds|clubs)-(10|[2-9TJQKA])/);
            if (m) {
                const suitWord = m[1];
                const rawRank = m[2];
                const rank = rawRank === "10" ? "T" : rawRank;
                const suit = suitMap[suitWord];
                return rank + suit;
            }
        }
        return null;
    }

    // ---------- IMPROVED CARD DETECTION ----------
    const CARD_SELECTOR = '[class*="fourColors"], [class*="cardFront"], [class*="front"]';

    function detectPlayerCards() {
        const hands = document.querySelectorAll('[class*="hand"]');
        for (const hand of hands) {
            const fronts = hand.querySelectorAll(CARD_SELECTOR);
            const cards = [];
            fronts.forEach(node => {
                const code = parseCardFromClassList(node.classList);
                if (code) cards.push(code);
            });
            if (cards.length === 2) return cards;
        }
        return [];
    }

    function detectBoardCards() {
        const community = document.querySelector('[class*="community"]');
        if (!community) return [];
        const nodes = community.querySelectorAll(CARD_SELECTOR);
        const cards = [];
        nodes.forEach(node => {
            const code = parseCardFromClassList(node.classList);
            if (code) cards.push(code);
        });
        return cards.slice(0, 5);
    }

    // ---------- 7-CARD HAND EVALUATION ----------
    function evaluateBestHand(cards7) {
        if (cards7.length < 5) return "Incomplete";

        function rv(c) { return cardValue(c); }
        function rs(c) { return cardSuit(c); }

        const names = [
            "High Card", "One Pair", "Two Pair", "Three of a Kind",
            "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush"
        ];

        let bestRank = [-1];
        let bestName = "High Card";

        function eval5(c5) {
            const vals = c5.map(rv).sort((a, b) => b - a);
            const suits = c5.map(rs);

            const countByVal = {};
            vals.forEach(v => countByVal[v] = (countByVal[v] || 0) + 1);

            const entries = Object.entries(countByVal).map(([v, c]) => ({ v: +v, c }));
            entries.sort((a, b) => b.c - a.c || b.v - a.v);

            const counts = entries.map(e => e.c);
            const orderedVals = entries.map(e => e.v);

            let flushSuit = null;
            {
                const sc = {};
                for (const s of suits) {
                    sc[s] = (sc[s] || 0) + 1;
                    if (sc[s] >= 5) flushSuit = s;
                }
            }

            function straightTop(vs) {
                const uniq = [...new Set(vs)].sort((a, b) => a - b);
                if (uniq.includes(12) && uniq.includes(0) && uniq.includes(1) && uniq.includes(2) && uniq.includes(3))
                    return 3;
                let top = -1;
                for (let i = 0; i <= uniq.length - 5; i++) {
                    if (uniq[i + 4] - uniq[i] === 4) top = uniq[i + 4];
                }
                return top;
            }

            const straightHigh = straightTop(vals);

            let sfHigh = -1;
            if (flushSuit !== null) {
                const fv = c5.filter(c => rs(c) === flushSuit).map(rv).sort((a, b) => b - a);
                const top = straightTop(fv);
                if (top >= 0) sfHigh = top;
            }

            let cat = 0;
            let kickers = [];

            if (sfHigh >= 0) {
                cat = 8; kickers = [sfHigh];
            } else if (counts[0] === 4) {
                cat = 7; kickers = [orderedVals[0], vals.find(v => v !== orderedVals[0])];
            } else if (counts[0] === 3 && counts[1] >= 2) {
                cat = 6; kickers = [orderedVals[0], orderedVals[1]];
            } else if (flushSuit !== null) {
                cat = 5; kickers = c5.filter(c => rs(c) === flushSuit).map(rv).sort((a, b) => b - a).slice(0, 5);
            } else if (straightHigh >= 0) {
                cat = 4; kickers = [straightHigh];
            } else if (counts[0] === 3) {
                cat = 3; kickers = [orderedVals[0], ...vals.filter(v => v !== orderedVals[0]).slice(0, 2)];
            } else if (counts[0] === 2 && counts[1] === 2) {
                const [p1, p2] = orderedVals;
                const highPair = Math.max(p1, p2);
                const lowPair = Math.min(p1, p2);
                const kicker = vals.find(v => v !== highPair && v !== lowPair);
                cat = 2; kickers = [highPair, lowPair, kicker];
            } else if (counts[0] === 2) {
                cat = 1; kickers = [orderedVals[0], ...vals.filter(v => v !== orderedVals[0]).slice(0, 3)];
            } else {
                cat = 0; kickers = vals.slice(0, 5);
            }

            return { rank: [cat, ...kickers], name: names[cat] };
        }

        for (let a = 0; a < 7; a++) {
            for (let b = a + 1; b < 7; b++) {
                const c5 = cards7.filter((_, i) => i !== a && i !== b);
                const { rank, name } = eval5(c5);

                let better = false;
                for (let i = 0; i < rank.length; i++) {
                    if (rank[i] > (bestRank[i] || -1)) { better = true; break; }
                    if (rank[i] < (bestRank[i] || -1)) { better = false; break; }
                }
                if (better) {
                    bestRank = rank;
                    bestName = name;
                }
            }
        }

        return bestName;
    }

    // ---------- STRENGTH SCORE ----------
    function handStrengthScore(handName) {
        switch (handName) {
            case "High Card": return 10;
            case "One Pair": return 30;
            case "Two Pair": return 45;
            case "Three of a Kind": return 60;
            case "Straight": return 72;
            case "Flush": return 78;
            case "Full House": return 88;
            case "Four of a Kind": return 95;
            case "Straight Flush": return 99;
            default: return 0;
        }
    }

    // GREEN = GOOD, RED = BAD
    function strengthColor(score) {
        if (score >= 90) return "#00ff00";      // Monster - bright green
        if (score >= 70) return "#7CFC00";      // Strong - light green
        if (score >= 40) return "#FFFF00";      // Medium - yellow
        if (score > 0)   return "#FFA500";      // Weak - orange
        return "#FF0000";                       // High card / none - red
    }

    // ---------- DRAGGABLE UI (FIXED) ----------
    function makeDraggable(el) {
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;
        let dragging = false;

        el.addEventListener("mousedown", e => {
            if (e.button !== 0) return; // left click only
            dragging = true;

            const rect = el.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            // switch from bottom/right anchoring to top/left on first drag
            el.style.left = `${startLeft}px`;
            el.style.top = `${startTop}px`;
            el.style.right = "auto";
            el.style.bottom = "auto";

            e.preventDefault();
        });

        document.addEventListener("mousemove", e => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${startLeft + dx}px`;
            el.style.top = `${startTop + dy}px`;
        });

        document.addEventListener("mouseup", () => {
            dragging = false;
        });
    }

    function createUI() {
        if (document.getElementById("tpo-panel")) return;

        const box = document.createElement("div");
        box.id = "tpo-panel";
        box.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 999999;
            width: 280px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 8px rgba(0,0,0,0.7);
            cursor: move;
        `;

        box.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">Torn Poker Strength</div>
            <div id="tpo-player" style="margin-bottom:4px;"></div>
            <div id="tpo-board" style="margin-bottom:4px;"></div>
            <div id="tpo-strength" style="margin-bottom:4px;"></div>
            <div id="tpo-hand" style="margin-bottom:4px;"></div>
        `;
        document.body.appendChild(box);

        makeDraggable(box);
    }

    function updateUI(player, board, handName, strengthScore, message) {
        const pDiv = document.getElementById("tpo-player");
        const bDiv = document.getElementById("tpo-board");
        const sDiv = document.getElementById("tpo-strength");
        const hDiv = document.getElementById("tpo-hand");
        if (!pDiv) return;

        if (message) {
            pDiv.textContent = message;
            bDiv.textContent = "";
            sDiv.textContent = "";
            hDiv.textContent = "";
            return;
        }

        pDiv.innerHTML = `<b>Player:</b> ${player.length ? player.join(" ") : "(waiting)"}`;
        bDiv.innerHTML = `<b>Board:</b> ${board.length ? board.join(" ") : "(none yet)"}`;

        if (handName === "Incomplete" || !player.length) {
            sDiv.innerHTML = `<b>Strength:</b> (waiting for more cards)`;
            sDiv.style.color = "#FF0000";
        } else {
            const color = strengthColor(strengthScore);
            sDiv.innerHTML = `<b>Strength:</b> ${strengthScore} / 100`;
            sDiv.style.color = color;
        }

        hDiv.innerHTML = `<b>Hand:</b> ${handName}`;
    }

    // ---------- MAIN LOOP ----------
    let cachedPlayer = null;
    let lastHandId = null;

    function getHandId() {
        const pot = document.querySelector('.roundPot___n07s8, .totalPotWrap___PsJLF');
        return pot ? pot.textContent.trim() : null;
    }

    function tick() {
        if (!document.querySelector('[class*="table"]')) return;

        createUI();

        const currentHandId = getHandId();
        if (currentHandId !== lastHandId) {
            cachedPlayer = null;
            lastHandId = currentHandId;
        }

        if (!cachedPlayer) {
            const p = detectPlayerCards();
            if (p.length === 2) cachedPlayer = p;
        }

        const player = cachedPlayer || [];
        const board = detectBoardCards();

        if (player.length !== 2) {
            updateUI([], board, "Incomplete", 0, "Waiting for your cards...");
            return;
        }

        const allCards = [...player, ...board];
        const handName = evaluateBestHand(allCards);
        const strengthScore = handStrengthScore(handName);

        updateUI(player, board, handName, strengthScore, null);
    }

    setInterval(tick, 300);
})();