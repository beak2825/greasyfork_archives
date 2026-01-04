// ==UserScript==
// @name         Torn legal poker odds
// @namespace    https://www.torn.com/
// @version      2.0
// @description  poker or sum
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560723/Torn%20legal%20poker%20odds.user.js
// @updateURL https://update.greasyfork.org/scripts/560723/Torn%20legal%20poker%20odds.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CARD UTILITIES ----------
    const ranks = "23456789TJQKA";
    const suitMap = { hearts: 'h', spades: 's', diamonds: 'd', clubs: 'c' };

    function cardValue(card) {
        return ranks.indexOf(card[0]); // 0..12
    }

    function cardSuit(card) {
        return card[1]; // 'h','d','c','s'
    }

    function parseCardFromClassList(classList) {
        // Matches hearts-A___, diamonds-10___, etc.
        for (const cls of classList) {
            const m = cls.match(/(hearts|spades|diamonds|clubs)-(10|[2-9TJQKA])/);
            if (m) {
                const suitWord = m[1];
                const rawRank = m[2];
                const rank = (rawRank === "10") ? "T" : rawRank;
                const suit = suitMap[suitWord];
                if (!suit) return null;
                return rank + suit; // e.g. "Ah", "Td"
            }
        }
        return null;
    }

    function generateDeck(excluded) {
        const deck = [];
        for (const r of ranks) {
            for (const s of Object.values(suitMap)) {
                const c = r + s;
                if (!excluded.includes(c)) deck.push(c);
            }
        }
        return deck;
    }

    // ---------- 7-CARD HAND EVALUATION ----------
    // Returns a *name*, not a rank number.
    function evaluateBestHand(cards7) {
        if (cards7.length < 5) return "Incomplete";

        function rv(card) { return cardValue(card); }
        function rs(card) { return cardSuit(card); }

        const n = cards7.length;
        let bestRank = [-1]; // [category, ...kickers]
        let bestName = "High Card";

        const names = [
            "High Card",
            "One Pair",
            "Two Pair",
            "Three of a Kind",
            "Straight",
            "Flush",
            "Full House",
            "Four of a Kind",
            "Straight Flush"
        ];

        function eval5(c5) {
            const vals = c5.map(rv).sort((a, b) => b - a); // high -> low
            const suits = c5.map(rs);

            // Count ranks
            const countByVal = {};
            vals.forEach(v => countByVal[v] = (countByVal[v] || 0) + 1);

            const entries = Object.entries(countByVal).map(([v, c]) => ({ v: parseInt(v, 10), c }));
            entries.sort((a, b) => {
                if (b.c !== a.c) return b.c - a.c;  // higher count first
                return b.v - a.v;                   // then higher rank
            });

            const counts = entries.map(e => e.c);
            const orderedVals = entries.map(e => e.v);

            // Flush?
            let flushSuit = null;
            {
                const sc = {};
                for (const s of suits) {
                    sc[s] = (sc[s] || 0) + 1;
                    if (sc[s] >= 5) {
                        flushSuit = s;
                    }
                }
            }

            // Straight?
            function straightTop(vs) {
                const uniq = [...new Set(vs)].sort((a, b) => a - b); // ascending
                // Wheel: A2345
                if (
                    uniq.includes(12) &&
                    uniq.includes(0) &&
                    uniq.includes(1) &&
                    uniq.includes(2) &&
                    uniq.includes(3)
                ) {
                    return 3; // treat 5-high straight as top rank 3
                }
                let top = -1;
                for (let i = 0; i <= uniq.length - 5; i++) {
                    if (uniq[i + 4] - uniq[i] === 4) {
                        top = uniq[i + 4];
                    }
                }
                return top;
            }

            const straightHigh = straightTop(vals);

            // Straight flush?
            let sfHigh = -1;
            if (flushSuit !== null) {
                const fv = c5
                    .filter(c => rs(c) === flushSuit)
                    .map(rv)
                    .sort((a, b) => b - a);
                const top = straightTop(fv);
                if (top >= 0) sfHigh = top;
            }

            // Category:
            // 8: Straight Flush
            // 7: Four of a Kind
            // 6: Full House
            // 5: Flush
            // 4: Straight
            // 3: Three of a Kind
            // 2: Two Pair
            // 1: One Pair
            // 0: High Card

            let cat = 0;
            let kickers = [];

            if (sfHigh >= 0) {
                cat = 8;
                kickers = [sfHigh];
            } else if (counts[0] === 4) {
                // Quads
                cat = 7;
                const four = orderedVals[0];
                const kicker = vals.find(v => v !== four);
                kickers = [four, kicker];
            } else if (counts[0] === 3 && counts[1] >= 2) {
                // Full house
                cat = 6;
                const three = orderedVals[0];
                const pair = orderedVals[1];
                kickers = [three, pair];
            } else if (flushSuit !== null) {
                cat = 5;
                const fv = c5
                    .filter(c => rs(c) === flushSuit)
                    .map(rv)
                    .sort((a, b) => b - a)
                    .slice(0, 5);
                kickers = fv;
            } else if (straightHigh >= 0) {
                cat = 4;
                kickers = [straightHigh];
            } else if (counts[0] === 3) {
                // Trips
                cat = 3;
                const three = orderedVals[0];
                const rest = vals.filter(v => v !== three).slice(0, 2);
                kickers = [three, ...rest];
            } else if (counts[0] === 2 && counts[1] === 2) {
                // Two pair
                cat = 2;
                const highPair = Math.max(orderedVals[0], orderedVals[1]);
                const lowPair = Math.min(orderedVals[0], orderedVals[1]);
                const kicker = vals.find(v => v !== highPair && v !== lowPair);
                kickers = [highPair, lowPair, kicker];
            } else if (counts[0] === 2) {
                // One pair
                cat = 1;
                const pair = orderedVals[0];
                const rest = vals.filter(v => v !== pair).slice(0, 3);
                kickers = [pair, ...rest];
            } else {
                cat = 0;
                kickers = vals.slice(0, 5);
            }

            return { rank: [cat, ...kickers], name: names[cat] };
        }

        // Check all C(7,5) = 21 combos
        for (let a = 0; a < 7; a++) {
            for (let b = a + 1; b < 7; b++) {
                const c5 = [];
                for (let i = 0; i < 7; i++) {
                    if (i === a || i === b) continue;
                    c5.push(cards7[i]);
                }
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

    function handStrengthScore(handName) {
        switch (handName) {
            case "High Card":        return 10;
            case "One Pair":         return 30;
            case "Two Pair":         return 45;
            case "Three of a Kind":  return 60;
            case "Straight":         return 72;
            case "Flush":            return 78;
            case "Full House":       return 88;
            case "Four of a Kind":   return 95;
            case "Straight Flush":   return 99;
            default:                 return 0;
        }
    }

    function handStrengthLabel(score) {
        if (score >= 90) return "Monster";
        if (score >= 70) return "Strong";
        if (score >= 40) return "Medium";
        if (score > 0)   return "Weak";
        return "None";
    }

    // ---------- MONTE CARLO SIMULATION ----------
    function simulateWinOdds(hole, board, villains, iterations = 2500) {
        if (hole.length !== 2) return null;
        if (villains < 1) villains = 1;

        const excluded = [...hole, ...board];
        const baseDeck = generateDeck(excluded);
        const order = [
            "High Card",
            "One Pair",
            "Two Pair",
            "Three of a Kind",
            "Straight",
            "Flush",
            "Full House",
            "Four of a Kind",
            "Straight Flush"
        ];

        let wins = 0, ties = 0, losses = 0;

        for (let i = 0; i < iterations; i++) {
            const d = [...baseDeck];

            const villainsHoles = [];
            for (let v = 0; v < villains; v++) {
                const c1 = d.splice(Math.random() * d.length | 0, 1)[0];
                const c2 = d.splice(Math.random() * d.length | 0, 1)[0];
                villainsHoles.push([c1, c2]);
            }

            const needed = 5 - board.length;
            const simBoard = [...board];
            for (let j = 0; j < needed; j++) {
                simBoard.push(d.splice(Math.random() * d.length | 0, 1)[0]);
            }

            const myName = evaluateBestHand([...hole, ...simBoard]);
            const myRank = order.indexOf(myName);

            let bestVillainRank = -1;
            for (const vHole of villainsHoles) {
                const vName = evaluateBestHand([...vHole, ...simBoard]);
                const vRank = order.indexOf(vName);
                if (vRank > bestVillainRank) bestVillainRank = vRank;
            }

            if (myRank > bestVillainRank) wins++;
            else if (myRank < bestVillainRank) losses++;
            else ties++;
        }

        const total = wins + ties + losses || 1;
        return {
            win: (wins / total * 100).toFixed(2),
            tie: (ties / total * 100).toFixed(2),
            lose: (losses / total * 100).toFixed(2)
        };
    }

    // ---------- HERO & BOARD DETECTION ----------
    // Hero: any .hand___* that contains exactly 2 face-up fourColors (inside .front___*)
    function detectHeroCards() {
        const hands = document.querySelectorAll('[class*="hand___"]');
        for (const hand of hands) {
            const fronts = hand.querySelectorAll('[class*="front___"] [class*="fourColors___"]');
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
        const community = document.querySelector('[class*="communityCards___"]');
        if (!community) return [];
        const nodes = community.querySelectorAll('[class*="fourColors___"]');
        const cards = [];
        nodes.forEach(node => {
            const code = parseCardFromClassList(node.classList);
            if (code) cards.push(code);
        });
        return cards.slice(0, 5);
    }

    function getHandId() {
        // Use pot text as a crude per-hand identifier
        const pot = document.querySelector('.roundPot___n07s8, .totalPotWrap___PsJLF');
        return pot ? pot.textContent.trim() : null;
    }

    // ---------- UI ----------
    let opponentCount = 1;
    function createUI() {
        if (document.getElementById("tpo-panel")) return;

        const box = document.createElement("div");
        box.id = "tpo-panel";
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "20px";
        box.style.background = "rgba(0,0,0,0.9)";
        box.style.color = "white";
        box.style.padding = "10px";
        box.style.borderRadius = "8px";
        box.style.zIndex = "999999";
        box.style.width = "280px";
        box.style.fontSize = "12px";
        box.style.fontFamily = "Arial, sans-serif";
        box.style.boxShadow = "0 0 8px rgba(0,0,0,0.7)";

        box.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">Torn Poker Odds</div>
            <div id="tpo-hero" style="margin-bottom:4px;"></div>
            <div id="tpo-board" style="margin-bottom:4px;"></div>
            <div id="tpo-strength" style="margin-bottom:4px;"></div>
            <div style="margin-bottom:4px;">
                <b>Opponents:</b>
                <select id="tpo-opps" style="margin-left:4px;">
                    ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}">${n}</option>`).join("")}
                </select>
            </div>
            <div id="tpo-hand" style="margin-bottom:4px;"></div>
            <div id="tpo-odds" style="margin-top:4px;"></div>
        `;
        document.body.appendChild(box);

        const sel = document.getElementById("tpo-opps");
        sel.addEventListener("change", e => {
            const v = parseInt(e.target.value, 10);
            opponentCount = isNaN(v) ? 1 : Math.min(Math.max(v, 1), 8);
        });
    }

    function updateUI(hero, board, handName, strengthScore, odds, message) {
        const heroDiv = document.getElementById("tpo-hero");
        const boardDiv = document.getElementById("tpo-board");
        const strengthDiv = document.getElementById("tpo-strength");
        const handDiv = document.getElementById("tpo-hand");
        const oddsDiv = document.getElementById("tpo-odds");
        if (!heroDiv || !boardDiv || !strengthDiv || !handDiv || !oddsDiv) return;

        if (message) {
            heroDiv.textContent = message;
            boardDiv.textContent = "";
            strengthDiv.textContent = "";
            handDiv.textContent = "";
            oddsDiv.textContent = "";
            return;
        }

        heroDiv.innerHTML = `<b>Hero:</b> ${hero.length ? hero.join(" ") : "(waiting)"}`;
        boardDiv.innerHTML = `<b>Board:</b> ${board.length ? board.join(" ") : "(none yet)"}`;

        if (handName === "Incomplete" || !hero.length) {
            strengthDiv.innerHTML = `<b>Strength:</b> (waiting for more cards)`;
        } else {
            const label = handStrengthLabel(strengthScore);
            strengthDiv.innerHTML = `<b>Strength:</b> ${strengthScore} / 100 (${label})`;
        }

        handDiv.innerHTML = `<b>Hand:</b> ${handName}`;

        if (!odds) {
            oddsDiv.innerHTML = `<span style="opacity:0.8;">Waiting for more cards...</span>`;
        } else {
            oddsDiv.innerHTML = `
                <b>Win:</b> ${odds.win}% &nbsp;
                <b>Tie:</b> ${odds.tie}% &nbsp;
                <b>Lose:</b> ${odds.lose}% &nbsp;
                <span style="opacity:0.7;">vs ${opponentCount}</span>
            `;
        }
    }

    // ---------- MAIN LOOP ----------
    let cachedHero = null;
    let lastHandId = null;

    function tick() {
        // Only run if a poker table exists
        if (!document.querySelector('.table___N1grV')) return;
        createUI();

        const currentHandId = getHandId();
        if (currentHandId !== lastHandId) {
            cachedHero = null;
            lastHandId = currentHandId;
        }

        if (!cachedHero) {
            const h = detectHeroCards();
            if (h.length === 2) cachedHero = h;
        }

        const hero = cachedHero || [];
        const board = detectBoardCards();

        if (hero.length !== 2) {
            updateUI([], board, "Incomplete", 0, null, "Waiting for your cards...");
            return;
        }

        const allCards = [...hero, ...board];
        const handName = evaluateBestHand(allCards);
        const strengthScore = handStrengthScore(handName);
        const odds = simulateWinOdds(hero, board, opponentCount);

        updateUI(hero, board, handName, strengthScore, odds, null);
    }

    setInterval(tick, 1000);
})();
