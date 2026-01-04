// ==UserScript==
// @name         Torn Poker - Equity Calculator v5.0
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @description  Clean pot odds calculator - polling + targeted observation
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552302/Torn%20Poker%20-%20Equity%20Calculator%20v50.user.js
// @updateURL https://update.greasyfork.org/scripts/552302/Torn%20Poker%20-%20Equity%20Calculator%20v50.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // GLOBAL STATE
    // ==========================================

    let isEducationalMode = false;

    window.pokerState = {
        heroCards: [],
        boardCards: [],
        boardCount: 0,
        potSize: 0
    };

    // ==========================================
    // CARD READING
    // ==========================================

    function extractCardValue(className) {
        const suitMap = {
            'clubs': '♣',
            'spades': '♠',
            'hearts': '♥',
            'diamonds': '♦'
        };

        const match = className.match(/(clubs|spades|hearts|diamonds)-([0-9TJQKA]+)/);
        if (!match) return null;

        const suit = suitMap[match[1]];
        const rank = match[2].toUpperCase();

        return `${rank}${suit}`;
    }

    function getPlayerCards() {
        const cardElements = document.querySelectorAll(
            '.playerMeGateway___AEI5_ .hand___aOp4l .card___t7csZ .front___osz1p > div'
        );

        return Array.from(cardElements)
            .map(el => extractCardValue(el.className))
            .filter(Boolean);
    }

    function getBoardCards() {
        const cardElements = document.querySelectorAll(
            '.communityCards___cGHD3 .front___osz1p > div'
        );

        return Array.from(cardElements)
            .map(el => extractCardValue(el.className))
            .filter(Boolean);
    }

    // ==========================================
    // POT TRACKING
    // ==========================================

    function getCurrentPot() {
        const potElement = document.querySelector('.totalPotWrap___PsJLF');
        if (!potElement) return 0;

        const match = potElement.textContent.match(/POT:\s*\$?([\d,]+)/i);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }

    // ==========================================
    // POLLING LOOP
    // ==========================================

    function pollGameState() {
        const heroCards = getPlayerCards();
        const boardCards = getBoardCards();
        const potSize = getCurrentPot();

        window.pokerState = {
            heroCards,
            boardCards,
            boardCount: boardCards.length,
            potSize
        };

        console.log('[Equity Calc] Poll - Hero:', heroCards.length, '| Board:', boardCards.length, '| Pot:', potSize);
    }

    // ==========================================
    // CALL AMOUNT DETECTION
    // ==========================================

    function parseCallAmount(buttonText) {
        if (/Check/i.test(buttonText)) return 0;

        const match = buttonText.match(/Call\s+\$?([\d,]+(?:\.\d+)?[kKmM]?)/i);
        if (!match) return null;

        let amount = match[1];
        if (/k$/i.test(amount)) return parseFloat(amount) * 1000;
        if (/m$/i.test(amount)) return parseFloat(amount) * 1000000;
        return parseInt(amount.replace(/,/g, ''));
    }

    function startButtonObserver(calculator) {
    let lastCallAmount = null;
    let lastBoardCount = null;
    let debounceTimer = null;

    const checkButtons = () => {
        // Clear existing timer to debounce rapid changes
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Wait 150ms after last mutation before checking
        debounceTimer = setTimeout(() => {
            const buttons = document.querySelector('.buttonsWrap___kNUd_');
            if (!buttons) return;

            const callAmount = parseCallAmount(buttons.textContent);

            if (callAmount === null || callAmount === 0) {
                lastCallAmount = null;
                lastBoardCount = null;
                return;
            }

            const { heroCards, boardCards, boardCount, potSize } = window.pokerState;

            // Check if this is a duplicate calculation
            if (callAmount === lastCallAmount && boardCount === lastBoardCount) {
                return; // Skip - already calculated this exact situation
            }

            // Need: 2 hero cards, 3-4 board cards, pot size
            if (heroCards.length < 2 || boardCount < 3 || boardCount > 4 || potSize === 0) {
                console.log('[Equity Calc] Call detected but insufficient data');
                return;
            }

            const street = boardCount === 3 ? 'flop' : 'turn';

            console.log('[Equity Calc] ✓ NEW calculation triggered');
            lastCallAmount = callAmount;
            lastBoardCount = boardCount;
            calculator.calculate(callAmount, potSize, heroCards, boardCards, street);
        }, 150); // Debounce delay
    };

    checkButtons();

    // Watch only the buttons container, not the entire wrapper
    const buttonsWrap = document.querySelector('.buttonsWrap___kNUd_');
    if (!buttonsWrap) {
        console.log('[Equity Calc] Button container not found, retrying...');
        // If buttons not found yet, watch the wrapper temporarily
        const wrapper = document.querySelector('.holdemWrapper___D71Gy');
        if (!wrapper) return;

        const observer = new MutationObserver(checkButtons);
        observer.observe(wrapper, {
            childList: true,
            subtree: true,
            characterData: true
        });
        return observer;
    }

    const observer = new MutationObserver(checkButtons);
    observer.observe(buttonsWrap, {
        childList: true,
        subtree: false, // Only watch direct children (more efficient)
        characterData: true
    });

    console.log('[Equity Calc] Button observer started (optimized)');
    return observer;
}

    // ==========================================
    // OUTS DETECTION
    // ==========================================

    const RANKS = '23456789TJQKA';

    function parseCard(cardStr) {
        const match = cardStr.match(/^([0-9TJQKA]+)(.)$/);
        if (!match) return null;
        return { rank: match[1], suit: match[2] };
    }

    function getRankIndex(rank) {
        return RANKS.indexOf(rank);
    }

    function detectMadeHand(allCards) {
        // Count ranks for full house/quads detection
        const rankCounts = {};
        allCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                rankCounts[parsed.rank] = (rankCounts[parsed.rank] || 0) + 1;
            }
        });

        const counts = Object.values(rankCounts).sort((a, b) => b - a);

        // Check for quads
        if (counts[0] === 4) {
            return { hasMade: true, type: 'Quads' };
        }

        // Check for full house (three of a kind + pair)
        if (counts[0] === 3 && counts[1] >= 2) {
            return { hasMade: true, type: 'Full House' };
        }

        // Check for flush
        const suits = {};
        allCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                suits[parsed.suit] = (suits[parsed.suit] || 0) + 1;
            }
        });

        if (Object.values(suits).some(count => count >= 5)) {
            return { hasMade: true, type: 'Flush' };
        }

        // Check for straight
        const ranks = allCards.map(c => getRankIndex(parseCard(c).rank)).sort((a, b) => a - b);
        const unique = [...new Set(ranks)];

        for (let i = 0; i <= unique.length - 5; i++) {
            if (unique[i + 4] - unique[i] === 4) {
                return { hasMade: true, type: 'Straight' };
            }
        }

        // Check for wheel (A-2-3-4-5)
        const wheelRanks = [getRankIndex('A'), getRankIndex('2'), getRankIndex('3'), getRankIndex('4'), getRankIndex('5')];
        if (wheelRanks.every(r => unique.includes(r))) {
            return { hasMade: true, type: 'Straight' };
        }

        return { hasMade: false };
    }

    function detectFlushDraw(heroCards, boardCards) {
        const allCards = [...heroCards, ...boardCards];
        const suits = {};

        allCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                suits[parsed.suit] = suits[parsed.suit] || [];
                suits[parsed.suit].push(card);
            }
        });

        for (const [suit, cards] of Object.entries(suits)) {
            if (cards.length === 4) {
                return { hasFlushDraw: true, suit: suit, outs: 9 };
            }
        }

        return { hasFlushDraw: false };
    }

    function detectStraightDraws(heroCards, boardCards) {
        const allCards = [...heroCards, ...boardCards];
        const ranks = allCards.map(c => getRankIndex(parseCard(c).rank));
        const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);

        // Check for OESD (4 consecutive ranks)
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const seq = uniqueRanks.slice(i, i + 4);
            if (seq[3] - seq[0] === 3) {
                return { type: 'OESD', outs: 8 };
            }
        }

        // Check for gutshot (4 ranks with one gap)
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const seq = uniqueRanks.slice(i, i + 4);
            // Check if we have 4 ranks spanning 5 positions (one missing)
            if (seq[3] - seq[0] === 4) {
                return { type: 'Gutshot', outs: 4 };
            }
        }

        return { type: null, outs: 0 };
    }

    function detectOvercards(heroCards, boardCards) {
        if (boardCards.length === 0) return { hasOvercards: false, outs: 0 };

        const heroRanks = heroCards.map(c => getRankIndex(parseCard(c).rank));
        const boardRanks = boardCards.map(c => getRankIndex(parseCard(c).rank));
        const maxBoard = Math.max(...boardRanks);

        const overcards = heroRanks.filter(r => r > maxBoard);

        if (overcards.length === 2) {
            return { hasOvercards: true, outs: 6 };
        }

        return { hasOvercards: false, outs: 0 };
    }

    function detectPocketPair(heroCards, boardCards) {
        if (heroCards.length !== 2) return { isPair: false, outs: 0 };

        const card1 = parseCard(heroCards[0]);
        const card2 = parseCard(heroCards[1]);

        if (card1.rank === card2.rank) {
            const boardRanks = boardCards.map(c => parseCard(c).rank);
            if (boardRanks.includes(card1.rank)) {
                return { isPair: true, setMade: true, outs: 0 };
            }
            return { isPair: true, setMade: false, outs: 2 };
        }

        return { isPair: false, outs: 0 };
    }
    function detectTwoParToFullHouse(heroCards, boardCards) {
        if (heroCards.length !== 2 || boardCards.length < 3) {
            return { hasTwoPair: false, outs: 0 };
        }

        const allCards = [...heroCards, ...boardCards];
        const rankCounts = {};

        // Count each rank
        allCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                rankCounts[parsed.rank] = (rankCounts[parsed.rank] || 0) + 1;
            }
        });

        // Find ranks that appear exactly twice
        const pairRanks = Object.entries(rankCounts)
            .filter(([rank, count]) => count === 2)
            .map(([rank]) => rank);

        // Need exactly 2 ranks appearing twice for two pair
        if (pairRanks.length !== 2) {
            return { hasTwoPair: false, outs: 0 };
        }

        // Calculate outs: remaining cards of both pair ranks
        // Each rank appears 2 times, so 2 remaining cards each = 4 total
        const outs = pairRanks.reduce((total, rank) => {
            const remaining = 4 - rankCounts[rank];
            return total + remaining;
        }, 0);

        return {
            hasTwoPair: true,
            outs: outs,
            ranks: pairRanks,
            details: `Two pair (${pairRanks[0]}'s and ${pairRanks[1]}'s)`,
            breakdown: [
                `${4 - rankCounts[pairRanks[0]]} ${pairRanks[0]}'s remaining`,
                `${4 - rankCounts[pairRanks[1]]} ${pairRanks[1]}'s remaining`,
                `${outs} total outs to full house`
            ]
        };
    }

    function detectTripsToFullHouse(heroCards, boardCards) {
        if (heroCards.length !== 2 || boardCards.length < 3) {
            return { hasTrips: false, outs: 0 };
        }

        const allCards = [...heroCards, ...boardCards];
        const rankCounts = {};

        // Count each rank
        allCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                rankCounts[parsed.rank] = (rankCounts[parsed.rank] || 0) + 1;
            }
        });

        // Find rank that appears exactly 3 times
        const tripRanks = Object.entries(rankCounts)
            .filter(([rank, count]) => count === 3)
            .map(([rank]) => rank);

        if (tripRanks.length !== 1) {
            return { hasTrips: false, outs: 0 };
        }

        const tripRank = tripRanks[0];

        // Check if we already have full house (another rank appears 2+ times)
        const hasPair = Object.entries(rankCounts)
            .some(([rank, count]) => rank !== tripRank && count >= 2);

        if (hasPair) {
            return { hasTrips: false, outs: 0 }; // Already full house
        }

        // Calculate outs to full house:
        // 1. Remaining card of trip rank (makes quads, which beats full house anyway)
        // 2. Any board card that pairs (makes full house)

        const tripOuts = 4 - rankCounts[tripRank]; // Remaining trip cards (usually 1)

        let boardPairingOuts = 0;
        boardCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed && parsed.rank !== tripRank) {
                // Count remaining cards of this board rank
                const remaining = 4 - (rankCounts[parsed.rank] || 0);
                boardPairingOuts += remaining;
            }
        });

        // Remove duplicates (if board has same rank multiple times)
        const uniqueBoardRanks = [...new Set(boardCards.map(c => parseCard(c).rank))];
        boardPairingOuts = uniqueBoardRanks.reduce((total, rank) => {
            if (rank !== tripRank) {
                const remaining = 4 - (rankCounts[rank] || 0);
                return total + remaining;
            }
            return total;
        }, 0);

        const totalOuts = tripOuts + boardPairingOuts;

        const breakdown = [];
        if (tripOuts > 0) {
            breakdown.push(`${tripOuts} ${tripRank}${tripOuts > 1 ? "'s" : ''} remaining (quads)`);
        }
        if (boardPairingOuts > 0) {
            breakdown.push(`${boardPairingOuts} cards pair the board (full house)`);
        }
        breakdown.push(`${totalOuts} total outs`);

        return {
            hasTrips: true,
            outs: totalOuts,
            tripRank: tripRank,
            details: `Three ${tripRank}'s (trips)`,
            breakdown: breakdown
        };
    }
    function detectPairedBoard(boardCards) {
        const rankCounts = {};
        boardCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                rankCounts[parsed.rank] = (rankCounts[parsed.rank] || 0) + 1;
            }
        });

        const maxCount = Math.max(...Object.values(rankCounts));
        return {
            isPaired: maxCount >= 2,
            trips: maxCount === 3
        };
    }

    function detectThreeToFlush(boardCards) {
        const suitCounts = {};
        boardCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                suitCounts[parsed.suit] = (suitCounts[parsed.suit] || 0) + 1;
            }
        });

        const flushSuit = Object.entries(suitCounts).find(([suit, count]) => count >= 3);
        return {
            hasThreeToFlush: !!flushSuit,
            flushSuit: flushSuit ? flushSuit[0] : null,
            count: flushSuit ? flushSuit[1] : 0
        };
    }

    function detectStraightOverStraight(heroCards, boardCards) {
        // Detect if making a straight leaves room for higher straight
        const allCards = [...heroCards, ...boardCards];
        const ranks = allCards.map(c => getRankIndex(parseCard(c).rank));
        const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);

        // Find if we have 4 connected cards (OESD scenario)
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const seq = uniqueRanks.slice(i, i + 4);
            if (seq[3] - seq[0] === 3) {
                // We have 4 connected cards
                const lowestInSeq = seq[0];
                const highestInSeq = seq[3];

                // Check if higher straight possible
                const canMakeHigher = highestInSeq < 12; // Not already at K (index 12)
                const canMakeLower = lowestInSeq > 0;

                return {
                    hasStraightDanger: canMakeHigher || canMakeLower,
                    higherPossible: canMakeHigher,
                    lowerPossible: canMakeLower
                };
            }
        }

        return { hasStraightDanger: false };
    }

    function detectCoordinatedBoard(boardCards) {
        if (boardCards.length < 3) return { isCoordinated: false, level: 'dry' };

        const ranks = boardCards.map(c => getRankIndex(parseCard(c).rank)).sort((a, b) => a - b);

        // Check for connected cards (within 4 ranks of each other)
        let connections = 0;
        for (let i = 0; i < ranks.length - 1; i++) {
            if (ranks[i + 1] - ranks[i] <= 4) {
                connections++;
            }
        }

        // Check for flush possibility
        const threeFlush = detectThreeToFlush(boardCards);

        // Coordination levels
        if (connections >= 2 && threeFlush.hasThreeToFlush) {
            return { isCoordinated: true, level: 'highly', reason: 'Multiple straights + flush possible' };
        }
        if (connections >= 2) {
            return { isCoordinated: true, level: 'highly', reason: 'Multiple straight draws possible' };
        }
        if (connections >= 1 && threeFlush.hasThreeToFlush) {
            return { isCoordinated: true, level: 'moderate', reason: 'Straight + flush draws possible' };
        }
        if (connections >= 1) {
            return { isCoordinated: true, level: 'moderate', reason: 'Straight draws possible' };
        }

        return { isCoordinated: false, level: 'dry' };
    }

    function generateWarnings(heroCards, boardCards, drawType) {
        const warnings = [];

        // Warning 1: Paired board with drawing hands
        if (drawType === 'flush' || drawType === 'oesd' || drawType === 'gutshot') {
            const pairedBoard = detectPairedBoard(boardCards);
            if (pairedBoard.isPaired) {
                if (pairedBoard.trips) {
                    warnings.push('⚠️ Board has trips - full house or quads possible');
                } else {
                    warnings.push('⚠️ Paired board - opponent may have full house');
                }
            }
        }

        // Warning 2: Three to a flush when you have straight draw
        if (drawType === 'oesd' || drawType === 'gutshot') {
            const threeFlush = detectThreeToFlush(boardCards);
            if (threeFlush.hasThreeToFlush) {
                warnings.push(`⚠️ Three ${threeFlush.flushSuit} on board - flush draw possible`);
            }
        }

        // Warning 3: Straight over straight danger
        if (drawType === 'oesd') {
            const straightDanger = detectStraightOverStraight(heroCards, boardCards);
            if (straightDanger.hasStraightDanger && straightDanger.higherPossible) {
                warnings.push('⚠️ Higher straight possible if you complete');
            }
        }

        // Warning 4: Highly coordinated board (general danger)
        const coordination = detectCoordinatedBoard(boardCards);
        if (coordination.level === 'highly') {
            warnings.push(`⚠️ Highly coordinated board - ${coordination.reason}`);
        }

        return warnings;
    }

    function detectOuts(heroCards, boardCards) {
        if (heroCards.length === 0 || boardCards.length < 3) {
            return null;
        }

        const allCards = [...heroCards, ...boardCards];

        // Check for made hands first (flush, straight, full house, quads)
        const madeHand = detectMadeHand(allCards);
        if (madeHand.hasMade) {
            console.log('[Equity Calc] Made hand:', madeHand.type);
            return {
                type: 'made',
                handType: madeHand.type,
                outs: 0,
                details: `${madeHand.type}`,
                breakdown: [`Strong made hand`]
            };
        }

        // Check for trips drawing to full house
        const tripsImprovement = detectTripsToFullHouse(heroCards, boardCards);
        if (tripsImprovement.hasTrips) {
            console.log('[Equity Calc] Trips to full house:', tripsImprovement.outs, 'outs');
            return {
                type: 'trips_to_fh',
                outs: tripsImprovement.outs,
                details: tripsImprovement.details,
                breakdown: tripsImprovement.breakdown
            };
        }

        // Check for two pair drawing to full house
        const twoPairImprovement = detectTwoParToFullHouse(heroCards, boardCards);
        if (twoPairImprovement.hasTwoPair) {
            console.log('[Equity Calc] Two pair to full house:', twoPairImprovement.outs, 'outs');
            return {
                type: 'two_pair_to_fh',
                outs: twoPairImprovement.outs,
                details: twoPairImprovement.details,
                breakdown: twoPairImprovement.breakdown
            };
        }

        // Check for combo draws
        const flushDraw = detectFlushDraw(heroCards, boardCards);
        const straightDraw = detectStraightDraws(heroCards, boardCards);

        if (flushDraw.hasFlushDraw && overcards.hasOvercards) {
    console.log('[Equity Calc] Combo: Flush + Overcards (15 outs)');
    const warnings = generateWarnings(heroCards, boardCards, 'flush');
    return {
        type: 'combo',
        outs: 15,
        details: `Flush draw + Two overcards`,
        breakdown: ['9 flush outs', '6 overcard outs', '15 total outs'],
        warnings: warnings
    };
}

        const overcards = detectOvercards(heroCards, boardCards);

        if (flushDraw.hasFlushDraw && overcards.hasOvercards) {
            console.log('[Equity Calc] Combo: Flush + Overcards (15 outs)');
            return {
                type: 'combo',
                outs: 15,
                details: `Flush draw + Two overcards`,
                breakdown: ['9 flush outs', '6 overcard outs', '15 total outs']
            };
        }

        // Check individual draws
        if (flushDraw.hasFlushDraw) {
    console.log('[Equity Calc] Flush draw (9 outs)');
    const warnings = generateWarnings(heroCards, boardCards, 'flush');
    return {
        type: 'flush',
        outs: 9,
        details: `Flush draw`,
        breakdown: ['9 remaining cards complete flush'],
        warnings: warnings
    };
}

        if (straightDraw.type === 'OESD') {
    console.log('[Equity Calc] OESD (8 outs)');
    const warnings = generateWarnings(heroCards, boardCards, 'oesd');
    return {
        type: 'oesd',
        outs: 8,
        details: `Open-ended straight draw`,
        breakdown: ['4 cards on each end = 8 outs'],
        warnings: warnings
    };
}

        if (overcards.hasOvercards) {
            console.log('[Equity Calc] Two overcards (6 outs)');
            return {
                type: 'overcards',
                outs: 6,
                details: `Two overcards`,
                breakdown: ['3 outs per overcard = 6 total']
            };
        }

        if (straightDraw.type === 'Gutshot') {
    console.log('[Equity Calc] Gutshot (4 outs)');
    const warnings = generateWarnings(heroCards, boardCards, 'gutshot');
    return {
        type: 'gutshot',
        outs: 4,
        details: `Gutshot straight draw`,
        breakdown: ['One inner card completes = 4 outs'],
        warnings: warnings
    };
}

        const pocketPair = detectPocketPair(heroCards, boardCards);
        if (pocketPair.isPair && !pocketPair.setMade) {
            console.log('[Equity Calc] Pocket pair (2 outs)');
            return {
                type: 'set_draw',
                outs: 2,
                details: `Pocket pair to set`,
                breakdown: ['Only 2 cards make your set'],
                warning: 'WEAK DRAW - Need excellent pot odds (8:1 or better)'
            };
        }

        console.log('[Equity Calc] No draws');
        return {
            type: 'none',
            outs: 0,
            details: 'No draws detected',
            breakdown: []
        };
    }

    // ==========================================
    // EQUITY & POT ODDS
    // ==========================================

    function calculateEquity(outs, street) {
        if (outs === 0) return 0;
        return street === 'flop' ? outs * 4 : outs * 2;
    }

    function calculatePotOdds(callAmount, potSize) {
        if (callAmount === 0) return 0;
        const totalPot = potSize + callAmount;
        return (callAmount / totalPot * 100);
    }

    function getDecisionColor(equity, potOdds) {
        const edge = equity - potOdds;

        if (edge >= 5) {
            return {
                bg: 'rgba(34, 197, 94, 0.2)',
                border: '#22c55e',
                text: '#22c55e',
                icon: '✅',
                label: 'PROFITABLE CALL'
            };
        }

        if (edge >= -2 && edge <= 2) {
            return {
                bg: 'rgba(234, 179, 8, 0.2)',
                border: '#eab308',
                text: '#eab308',
                icon: '⚠️',
                label: 'MARGINAL'
            };
        }

        if (edge <= -5) {
            return {
                bg: 'rgba(239, 68, 68, 0.2)',
                border: '#ef4444',
                text: '#ef4444',
                icon: '❌',
                label: 'UNPROFITABLE FOLD'
            };
        }

        return edge > 0 ? {
            bg: 'rgba(34, 197, 94, 0.2)',
            border: '#22c55e',
            text: '#22c55e',
            icon: '✅',
            label: 'CALL'
        } : {
            bg: 'rgba(239, 68, 68, 0.2)',
            border: '#ef4444',
            text: '#ef4444',
            icon: '❌',
            label: 'FOLD'
        };
    }

    // ==========================================
    // UI GENERATION
    // ==========================================

    function generateCompactUI(data) {
        const { callAmount, potSize, potOdds, outsInfo, equity, street, decision, heroCards, boardCards } = data;

        if (!outsInfo || outsInfo.type === 'none') {
            return `
                <div class="eq-compact">
                    <div class="eq-header">
                        <span>POT ODDS CALCULATOR</span>
                        <button class="eq-toggle" id="eqToggle">📚 LEARN</button>
                    </div>
                    <div class="eq-cards-display">
                        <span class="eq-label">You:</span> ${heroCards.join(' ')}
                        <span class="eq-label">Board:</span> ${boardCards.join(' ')}
                    </div>
                    <div class="eq-pot-info">
                        Pot: $${potSize.toLocaleString()} | Call: $${callAmount.toLocaleString()}
                    </div>
                    <div class="eq-no-draw">
                        No draws detected - decision based on hand strength
                    </div>
                </div>
            `;
        }

        if (outsInfo.type === 'made') {
            return `
                <div class="eq-compact">
                    <div class="eq-header">
                        <span>POT ODDS CALCULATOR</span>
                        <button class="eq-toggle" id="eqToggle">📚 LEARN</button>
                    </div>
                    <div class="eq-cards-display">
                        <span class="eq-label">You:</span> ${heroCards.join(' ')}
                        <span class="eq-label">Board:</span> ${boardCards.join(' ')}
                    </div>
                    <div class="eq-pot-info">
                        Pot: $${potSize.toLocaleString()} | Call: $${callAmount.toLocaleString()}
                    </div>
                    <div class="eq-made-hand">
                        Made Hand: ${outsInfo.handType}
                        <div class="eq-made-note">Focus on value extraction</div>
                    </div>
                </div>
            `;
        }

        const edge = equity - potOdds;

        return `
            <div class="eq-compact">
                <div class="eq-header">
                    <span>POT ODDS CALCULATOR</span>
                    <button class="eq-toggle" id="eqToggle">📚 LEARN</button>
                </div>
                <div class="eq-cards-display">
                    <span class="eq-label">You:</span> ${heroCards.join(' ')}
                    <span class="eq-label">Board:</span> ${boardCards.join(' ')}
                </div>
                <div class="eq-pot-info">
                    Pot: $${potSize.toLocaleString()} | Call: $${callAmount.toLocaleString()} | Need: ${potOdds.toFixed(1)}%
                </div>
                <div class="eq-draw-info">
    ${outsInfo.details}
</div>
${outsInfo.warnings && outsInfo.warnings.length > 0 ? `
    <div class="eq-warnings">
        ${outsInfo.warnings.map(w => `<div class="eq-warning-item">${w}</div>`).join('')}
    </div>
` : ''}
                <div class="eq-equity-display">
                    Your Equity: ${outsInfo.outs} × ${street === 'flop' ? '4' : '2'} = ${equity.toFixed(0)}%
                </div>
                <div class="eq-decision" style="background: ${decision.bg}; border-color: ${decision.border};">
                    <span style="color: ${decision.text};">${decision.icon} ${decision.label}</span>
                    <span class="eq-edge" style="color: ${decision.text};">${edge > 0 ? '+' : ''}${edge.toFixed(1)}%</span>
                </div>
            </div>
        `;
    }

    function generateEducationalUI(data) {
        const { callAmount, potSize, potOdds, outsInfo, equity, street, decision, heroCards, boardCards } = data;

        if (!outsInfo || outsInfo.type === 'none') {
            return `
                <div class="eq-educational">
                    <div class="eq-header">
                        <span>POT ODDS CALCULATOR</span>
                        <button class="eq-toggle" id="eqToggle">📊 COMPACT</button>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">YOUR HAND</div>
                        <div class="eq-section-content">
                            Hole cards: <strong>${heroCards.join(' ')}</strong><br>
                            Board: <strong>${boardCards.join(' ')}</strong>
                        </div>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">POT SITUATION</div>
                        <div class="eq-section-content">
                            Pot: $${potSize.toLocaleString()}<br>
                            You must call: $${callAmount.toLocaleString()}<br>
                            Total pot if you call: $${(potSize + callAmount).toLocaleString()}
                        </div>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">POT ODDS</div>
                        <div class="eq-section-content">
                            Your risk ÷ Total pot<br>
                            $${callAmount.toLocaleString()} ÷ $${(potSize + callAmount).toLocaleString()} = ${potOdds.toFixed(1)}%<br>
                            <strong>You need ${potOdds.toFixed(1)}% equity to break even</strong>
                        </div>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">YOUR DRAW</div>
                        <div class="eq-section-content">
                            No draws detected<br>
                            Decision based on current hand strength
                        </div>
                    </div>
                </div>
            `;
        }

        if (outsInfo.type === 'made') {
            return `
                <div class="eq-educational">
                    <div class="eq-header">
                        <span>POT ODDS CALCULATOR</span>
                        <button class="eq-toggle" id="eqToggle">📊 COMPACT</button>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">YOUR HAND</div>
                        <div class="eq-section-content">
                            Hole cards: <strong>${heroCards.join(' ')}</strong><br>
                            Board: <strong>${boardCards.join(' ')}</strong>
                        </div>
                    </div>
                    <div class="eq-section">
                        <div class="eq-section-title">CURRENT HAND</div>
                        <div class="eq-section-content">
                            <strong>${outsInfo.handType}</strong><br><br>
                            You have a made hand - no draws needed<br><br>
                            Focus on:<br>
                            • Extracting maximum value<br>
                            • Protecting against draws<br>
                            • Reading opponent strength
                        </div>
                    </div>
                </div>
            `;
        }

        const edge = equity - potOdds;
        const multiplier = street === 'flop' ? 4 : 2;

        return `
            <div class="eq-educational">
                <div class="eq-header">
                    <span>POT ODDS CALCULATOR</span>
                    <button class="eq-toggle" id="eqToggle">📊 COMPACT</button>
                </div>

                <div class="eq-section">
                    <div class="eq-section-title">YOUR HAND</div>
                    <div class="eq-section-content">
                        Hole cards: <strong>${heroCards.join(' ')}</strong><br>
                        Board: <strong>${boardCards.join(' ')}</strong>
                    </div>
                </div>

                <div class="eq-section">
                    <div class="eq-section-title">POT SITUATION</div>
                    <div class="eq-section-content">
                        Pot before bet: $${potSize.toLocaleString()}<br>
                        You must call: $${callAmount.toLocaleString()}<br>
                        Total pot if you call: $${(potSize + callAmount).toLocaleString()}
                    </div>
                </div>

                <div class="eq-section">
                    <div class="eq-section-title">POT ODDS CALCULATION</div>
                    <div class="eq-section-content">
                        Your risk ÷ Total pot<br>
                        $${callAmount.toLocaleString()} ÷ $${(potSize + callAmount).toLocaleString()} = ${potOdds.toFixed(1)}%<br>
                        <strong>You need ${potOdds.toFixed(1)}% equity to break even</strong>
                    </div>
                </div>

                <div class="eq-section">
    <div class="eq-section-title">YOUR DRAW</div>
    <div class="eq-section-content">
        Type: <strong>${outsInfo.details}</strong><br>
        Outs: <strong>${outsInfo.outs} cards</strong><br><br>
        ${outsInfo.breakdown.map(b => `• ${b}`).join('<br>')}
        ${outsInfo.warning ? `<br><br><span style="color: #fbbf24;">⚠️ ${outsInfo.warning}</span>` : ''}
        ${outsInfo.warnings && outsInfo.warnings.length > 0 ? `
            <br><br><strong style="color: #fbbf24;">BOARD WARNINGS:</strong><br>
            ${outsInfo.warnings.map(w => `<span style="color: #fbbf24;">${w}</span>`).join('<br>')}
        ` : ''}
    </div>
</div>

                <div class="eq-section">
                    <div class="eq-section-title">RULE OF ${multiplier === 4 ? 'FOUR' : 'TWO'}</div>
                    <div class="eq-section-content">
                        Street: <strong>${street.charAt(0).toUpperCase() + street.slice(1)}</strong><br>
                        Multiplier: <strong>× ${multiplier}</strong> (to river)<br><br>
                        Calculation:<br>
                        ${outsInfo.outs} outs × ${multiplier} = <strong>${equity.toFixed(0)}%</strong>
                    </div>
                </div>

                <div class="eq-section">
                    <div class="eq-section-title">DECISION</div>
                    <div class="eq-section-content" style="background: ${decision.bg}; border: 2px solid ${decision.border}; padding: 12px; border-radius: 6px;">
                        <div style="font-size: 16px; font-weight: bold; color: ${decision.text}; margin-bottom: 8px;">
                            ${decision.icon} ${decision.label}
                        </div>
                        <div style="color: #e4e4e4; margin-top: 8px;">
                            • Required equity: ${potOdds.toFixed(1)}%<br>
                            • Your equity: ${equity.toFixed(0)}%<br>
                            • Edge: <strong style="color: ${decision.text};">${edge > 0 ? '+' : ''}${edge.toFixed(1)}%</strong>
                        </div>
                        <div style="color: #94a3b8; margin-top: 12px; font-size: 12px;">
                           ${edge > 0 ? (
                              edge >= 10 ?
                                 `Strong profitable call — you gain $${Math.round(edge * (potSize + callAmount) / 100).toLocaleString()} in expected value` :
                                 `Marginally profitable — expected value: +$${Math.round(edge * (potSize + callAmount) / 100).toLocaleString()}`
                           ) : (
                              edge <= -10 ?
                                 `Clear fold — you lose $${Math.round(Math.abs(edge * (potSize + callAmount) / 100)).toLocaleString()} in expected value` :
                                 `Marginally unprofitable — expected value: -$${Math.round(Math.abs(edge * (potSize + callAmount) / 100)).toLocaleString()}`
                           )}
                        </div>
                        </div>
                    </div>
                </div>

                <div class="eq-section">
                    <div class="eq-section-title">KEY RULE</div>
                    <div class="eq-section-content">
                        <strong>Equity > Pot Odds = CALL ✅</strong><br>
                        <strong>Equity < Pot Odds = FOLD ❌</strong>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // MAIN CALCULATOR
    // ==========================================

    class EquityCalculator {
        constructor() {
            this.ui = null;
            this.minimizedBtn = null;
            this.isMinimized = true;
            this.lastData = null;
            this.buttonObserver = null;
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'equityCalculator';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 380px;
                background: rgba(20,20,20,0.95);
                border: 2px solid #0f3460;
                border-radius: 8px;
                font-family: 'Segoe UI', monospace;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                color: #e4e4e4;
                display: none;
            `;
            container.innerHTML = '<div id="equityContent"></div>';
            document.body.appendChild(container);

            const minBtn = document.createElement('div');
            minBtn.id = 'equityMinimized';
            minBtn.innerHTML = '🎯';
            minBtn.title = 'Equity Calculator';
            minBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #0f3460, #16213e);
                border: 2px solid #0f3460;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                transition: all 0.2s;
            `;
            minBtn.addEventListener('mouseenter', () => {
                minBtn.style.transform = 'scale(1.1)';
            });
            minBtn.addEventListener('mouseleave', () => {
                minBtn.style.transform = 'scale(1)';
            });
            minBtn.addEventListener('click', () => {
                if (this.lastData) {
                    this.expand();
                }
            });
            document.body.appendChild(minBtn);

            this.setupDrag(container);
            this.minimizedBtn = minBtn;
            return container;
        }

        setupDrag(container) {
            let isDragging = false;
            let startX = 0, startY = 0;
            let initialLeft = 0, initialTop = 0;

            container.addEventListener('mousedown', (e) => {
                if (e.target.id === 'eqToggle' || e.target.id === 'eqMinimize' || e.target.id === 'eqCopy') return;
                if (e.target.closest('.eq-header')) {
                    isDragging = true;

                    const rect = container.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;

                    startX = e.clientX;
                    startY = e.clientY;

                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newLeft = Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - 380));
                const newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - 200));

                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        copyToClipboard() {
            const content = document.getElementById('equityContent');
            if (!content) return;

            let text = '';

            if (isEducationalMode) {
                text += 'POT ODDS CALCULATOR - DETAILED ANALYSIS\n';
                text += '='.repeat(50) + '\n\n';
            } else {
                text += 'POT ODDS CALCULATOR\n';
                text += '='.repeat(30) + '\n\n';
            }

            const sections = content.querySelectorAll('.eq-section, .eq-cards-display, .eq-pot-info, .eq-draw-info, .eq-equity-display, .eq-decision, .eq-made-hand, .eq-no-draw');

            sections.forEach(section => {
                const title = section.querySelector('.eq-section-title');
                if (title) {
                    text += title.textContent.trim() + '\n';
                    text += '-'.repeat(title.textContent.trim().length) + '\n';
                }

                const sectionContent = section.querySelector('.eq-section-content') || section;
                const contentText = sectionContent.textContent.trim().replace(/\s+/g, ' ');

                text += contentText + '\n\n';
            });

            text += '\n' + '='.repeat(50);
            text += '\nGenerated by Torn Poker Equity Calculator';

            navigator.clipboard.writeText(text).then(() => {
                console.log('[Equity Calc] Copied to clipboard');
                const copyBtn = document.getElementById('eqCopy');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✓';
                    copyBtn.style.background = 'rgba(34, 197, 94, 0.5)';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.background = '';
                    }, 1500);
                }
            }).catch(err => {
                console.error('[Equity Calc] Copy failed:', err);
            });
        }

        updateDisplay(data) {
            const content = document.getElementById('equityContent');
            if (!content) return;

            let html;
            if (isEducationalMode) {
                html = generateEducationalUI(data);
            } else {
                html = generateCompactUI(data);
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const header = doc.querySelector('.eq-header');
            if (header) {
                const copyBtn = document.createElement('button');
                copyBtn.id = 'eqCopy';
                copyBtn.innerHTML = '📋';
                copyBtn.className = 'eq-copy-btn';
                copyBtn.title = 'Copy to clipboard';
                header.appendChild(copyBtn);

                const minimizeBtn = document.createElement('button');
                minimizeBtn.id = 'eqMinimize';
                minimizeBtn.innerHTML = '−';
                minimizeBtn.className = 'eq-minimize-btn';
                minimizeBtn.title = 'Minimize';
                header.appendChild(minimizeBtn);
            }

            content.innerHTML = doc.body.innerHTML;

            const toggleBtn = document.getElementById('eqToggle');
            if (toggleBtn) {
                toggleBtn.onclick = () => {
                    isEducationalMode = !isEducationalMode;
                    console.log('[Equity Calc] Toggled:', isEducationalMode ? 'Educational' : 'Compact');
                    this.updateDisplay(data);
                };
            }

            const minimizeBtn = document.getElementById('eqMinimize');
            if (minimizeBtn) {
                minimizeBtn.onclick = () => {
                    this.minimize();
                };
            }

            const copyBtn = document.getElementById('eqCopy');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    this.copyToClipboard();
                };
            }
        }

        expand() {
            console.log('[Equity Calc] Expanding');
            this.isMinimized = false;
            this.ui.style.display = 'block';
            this.minimizedBtn.style.display = 'none';

            if (this.lastData) {
                this.updateDisplay(this.lastData);
            }
        }

        minimize() {
            console.log('[Equity Calc] Minimizing');
            this.isMinimized = true;
            this.ui.style.display = 'none';
            this.minimizedBtn.style.display = 'flex';
        }

        show(data) {
            console.log('[Equity Calc] Showing - Outs:', data.outsInfo.outs, '| Equity:', data.equity.toFixed(1) + '%', '| Pot Odds:', data.potOdds.toFixed(1) + '%', '| Edge:', (data.equity - data.potOdds).toFixed(1) + '%');

            this.lastData = data;

            if (this.isMinimized) {
                this.expand();
            } else {
                this.updateDisplay(data);
            }

            this.minimizedBtn.style.animation = 'none';
            setTimeout(() => {
                this.minimizedBtn.style.animation = 'pulse 1s ease-in-out 3';
            }, 10);
        }

        calculate(callAmount, potSize, heroCards, boardCards, street) {
            const potOdds = calculatePotOdds(callAmount, potSize);
            const outsInfo = detectOuts(heroCards, boardCards);
            const equity = outsInfo && outsInfo.outs > 0 ? calculateEquity(outsInfo.outs, street) : 0;
            const decision = getDecisionColor(equity, potOdds);

            console.log('[Equity Calc] Decision:', decision.label, '| Edge:', (equity - potOdds).toFixed(1) + '%');

            const data = {
                callAmount,
                potSize,
                potOdds,
                outsInfo,
                equity,
                street,
                decision,
                heroCards,
                boardCards
            };

            this.show(data);
        }

        start() {
            console.log('[Equity Calc] v5.0 - Clean polling architecture');
            this.ui = this.createUI();

            // Start polling game state
            setInterval(pollGameState, 2000);
            pollGameState(); // Initial poll

            // Start button observer
            this.buttonObserver = startButtonObserver(this);

            console.log('[Equity Calc] Ready');
        }

        stop() {
            if (this.buttonObserver) this.buttonObserver.disconnect();
            if (this.ui) this.ui.remove();
            if (this.minimizedBtn) this.minimizedBtn.remove();
        }
    }

    // ==========================================
    // STYLES
    // ==========================================

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .eq-compact, .eq-educational {
                padding: 12px;
            }

            .eq-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #0f3460;
                font-weight: bold;
                font-size: 13px;
                color: #e94560;
                cursor: move;
            }

            .eq-toggle {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid #0f3460;
                color: #e4e4e4;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .eq-toggle:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .eq-cards-display {
                background: rgba(139, 92, 246, 0.1);
                border-left: 3px solid #8b5cf6;
                padding: 8px;
                border-radius: 4px;
                font-size: 13px;
                margin-bottom: 8px;
                color: #c4b5fd;
                font-weight: 600;
            }

            .eq-label {
                color: #94a3b8;
                font-weight: normal;
                margin-right: 4px;
            }

            .eq-pot-info {
                background: rgba(0, 0, 0, 0.3);
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                margin-bottom: 10px;
                color: #94a3b8;
            }

            .eq-draw-info {
                background: rgba(251, 191, 36, 0.1);
                border-left: 3px solid #fbbf24;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                margin-bottom: 8px;
                color: #fbbf24;
                font-weight: 600;
            }

            .eq-equity-display {
                background: rgba(59, 130, 246, 0.1);
                border-left: 3px solid #3b82f6;
                padding: 8px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #60a5fa;
            }

            .eq-decision {
                padding: 10px;
                border-radius: 6px;
                border: 2px solid;
                font-weight: bold;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .eq-edge {
                font-size: 13px;
            }

            .eq-no-draw {
                text-align: center;
                padding: 20px;
                color: #94a3b8;
                font-size: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .eq-made-hand {
                background: rgba(34, 197, 94, 0.1);
                border: 2px solid #22c55e;
                padding: 12px;
                border-radius: 6px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                color: #22c55e;
            }

            .eq-made-note {
                margin-top: 6px;
                font-size: 11px;
                font-weight: normal;
                color: #94a3b8;
            }

            .eq-section {
                margin-bottom: 12px;
            }

            .eq-section-title {
                font-size: 11px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .eq-section-content {
                background: rgba(0, 0, 0, 0.2);
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                line-height: 1.6;
                color: #cbd5e1;
            }

            #equityCalculator {
                max-height: 90vh;
                overflow-y: auto;
            }

            #equityCalculator::-webkit-scrollbar {
                width: 6px;
            }

            #equityCalculator::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
            }

            #equityCalculator::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 3px;
            }

            .eq-minimize-btn {
                background: rgba(239, 68, 68, 0.3);
                border: 1px solid #ef4444;
                color: #fca5a5;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                margin-left: 8px;
                transition: all 0.2s;
            }

            .eq-minimize-btn:hover {
                background: rgba(239, 68, 68, 0.5);
            }

            .eq-copy-btn {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-left: 8px;
                transition: all 0.2s;
            }

            .eq-copy-btn:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                }
                50% {
                    transform: scale(1.15);
                    box-shadow: 0 6px 20px rgba(15, 52, 96, 0.8);
                }
            }

            .eq-warnings {
                background: rgba(251, 191, 36, 0.15);
                border-left: 3px solid #fbbf24;
                padding: 8px;
                border-radius: 4px;
                margin-top: 8px;
                font-size: 11px;
            }

            .eq-warning-item {
                color: #fbbf24;
                margin: 4px 0;
                display: flex;
                align-items: flex-start;
                line-height: 1.4;
            }

            .eq-warning-item::before {
                content: '';
                display: inline-block;
                width: 4px;
                height: 4px;
                background: #fbbf24;
                border-radius: 50%;
                margin-right: 6px;
                margin-top: 5px;
                flex-shrink: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    async function init() {
        console.log('[Equity Calc] Torn Poker Equity Calculator v5.0');
        console.log('[Equity Calc] Architecture: Polling (2s) + Button observer');

        const checkForTable = setInterval(() => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('[Equity Calc] Poker table found');

                injectStyles();
                window.equityCalc = new EquityCalculator();
                window.equityCalc.start();
            }
        }, 2000);

        setTimeout(() => {
            clearInterval(checkForTable);
            console.log('[Equity Calc] Timeout - table not found');
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();