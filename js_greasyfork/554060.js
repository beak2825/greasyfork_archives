// ==UserScript==
// @name         Poker Stats Calculator v3.1
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Enhanced stats calculator with 8 stats: VPIP, PFR, 3Bet, AF, CBet, Fold3Bet, WTSD, W$SD
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554060/Poker%20Stats%20Calculator%20v31.user.js
// @updateURL https://update.greasyfork.org/scripts/554060/Poker%20Stats%20Calculator%20v31.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let calculatorPanelOpen = false;
    let calculatedStats = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ============================================
    // DATABASE CONNECTION
    // ============================================

    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("pokerHandHistoryDB", 13);

            openRequest.onupgradeneeded = function(event) {
                db = event.target.result;

                if (!db.objectStoreNames.contains("hands")) {
                    const handStore = db.createObjectStore("hands", {
                        keyPath: "autoId",
                        autoIncrement: true
                    });
                    handStore.createIndex("handNumber", "handNumber", { unique: false });
                    handStore.createIndex("handId", "handId", { unique: false });
                    handStore.createIndex("startTime", "startTime", { unique: false });
                }

                if (!db.objectStoreNames.contains("playerStats")) {
                    const statsStore = db.createObjectStore("playerStats", {
                        keyPath: "playerName"
                    });
                    statsStore.createIndex("lastUpdated", "lastUpdated", { unique: false });
                }
            };

            openRequest.onsuccess = function(event) {
                db = event.target.result;
                console.log('Connected to poker database');
                resolve(db);
            };

            openRequest.onerror = function(event) {
                console.error('Failed to connect to database:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    function loadAllHands() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.openCursor();

            const hands = [];

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    hands.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(hands);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }
    function loadStatsFromDatabase() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["playerStats"], "readonly");
            const store = transaction.objectStore("playerStats");
            const request = store.openCursor();

            const stats = {};

            request.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const record = cursor.value;
                    stats[record.playerName] = record;
                    cursor.continue();
                } else {
                    resolve(stats);
                }
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    function saveStatsToDatabase(statsData) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["playerStats"], "readwrite");
            const store = transaction.objectStore("playerStats");

            let savedCount = 0;

            Object.entries(statsData).forEach(([playerName, stats]) => {
                const record = {
                    playerName: playerName,
                    hands: stats.hands,
                    vpip: stats.vpip,
                    pfr: stats.pfr,
                    af: stats.af,
                    threeBet: stats.threeBet,
                    cbet: stats.cbet,
                    foldTo3Bet: stats.foldTo3Bet,
                    wtsd: stats.wtsd,
                    wsd: stats.wsd,
                    // RAW COUNTS (NEW!)
                    vpipHands: stats.vpipHands || 0,
                    pfrHands: stats.pfrHands || 0,
                    bets: stats.bets || 0,
                    raises: stats.raises || 0,
                    calls: stats.calls || 0,
                    threeBetOpportunities: stats.threeBetOpportunities || 0,
                    threeBetCount: stats.threeBetCount || 0,
                    foldTo3BetOpportunities: stats.foldTo3BetOpportunities || 0,
                    foldTo3BetCount: stats.foldTo3BetCount || 0,
                    cbetOpportunities: stats.cbetOpportunities || 0,
                    cbetCount: stats.cbetCount || 0,
                    wtsdSawFlop: stats.wtsdSawFlop || 0,
                    wtsdWentToShowdown: stats.wtsdWentToShowdown || 0,
                    wsdShowdowns: stats.wsdShowdowns || 0,
                    wsdWins: stats.wsdWins || 0,
                    lastUpdated: Date.now()
                };

                const putRequest = store.put(record);
                putRequest.onsuccess = () => savedCount++;
            });

            transaction.oncomplete = function() {
                console.log(`Saved stats for ${savedCount} players to database`);
                resolve(savedCount);
            };

            transaction.onerror = function() {
                reject(transaction.error);
            };
        });
    }

    function getHandCount() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["hands"], "readonly");
            const store = transaction.objectStore("hands");
            const request = store.count();

            request.onsuccess = function() {
                resolve(request.result);
            };

            request.onerror = function() {
                reject(request.error);
            };
        });
    }

    // ============================================
    // POSITION CALCULATION (From Session Review Framework)
    // ============================================

    function calculatePositions(hand) {
        // Step 1: Find SB and BB from messages
        let sbPlayer = null;
        let bbPlayer = null;

        hand.messages.forEach(msg => {
            if (msg.text.match(/posted small blind/)) {
                const match = msg.text.match(/^(.+?)\s+posted small blind/);
                if (match) sbPlayer = match[1].trim();
            }
            if (msg.text.match(/posted big blind/)) {
                const match = msg.text.match(/^(.+?)\s+posted big blind/);
                if (match) bbPlayer = match[1].trim();
            }
        });

        if (!sbPlayer || !bbPlayer) {
            return null;
        }

        // Step 2: Get active players from tableData
        if (!hand.tableData || !hand.tableData.players) {
            return null;
        }

        const activePlayers = hand.tableData.players.filter(p => true);

        if (activePlayers.length < 2) {
            return null;
        }

        // Step 3: Find SB and BB seat numbers
        const sbSeat = activePlayers.find(p => p.name === sbPlayer)?.seat;
        const bbSeat = activePlayers.find(p => p.name === bbPlayer)?.seat;

        if (sbSeat === undefined || bbSeat === undefined) {
            return null;
        }

        // Step 4: Calculate button seat
        const seatNumbers = activePlayers.map(p => p.seat).sort((a, b) => a - b);
        const sbIndex = seatNumbers.indexOf(sbSeat);
        const buttonIndex = (sbIndex - 1 + seatNumbers.length) % seatNumbers.length;
        const buttonSeat = seatNumbers[buttonIndex];

        // Step 5: Reorder seats clockwise starting from SB
        const orderedSeats = [];
        for (let i = 0; i < seatNumbers.length; i++) {
            const index = (sbIndex + i) % seatNumbers.length;
            orderedSeats.push(seatNumbers[index]);
        }

        // Step 6: Assign position names
        const positions = assignPositionNames(orderedSeats, activePlayers);

        return {
            positions: positions,
            buttonSeat: buttonSeat
        };
    }

    function assignPositionNames(orderedSeats, allPlayers) {
        const playerCount = orderedSeats.length;

        const positionMaps = {
            2: ['SB', 'BB'],
            3: ['SB', 'BB', 'BTN'],
            4: ['SB', 'BB', 'UTG', 'BTN'],
            5: ['SB', 'BB', 'UTG', 'CO', 'BTN'],
            6: ['SB', 'BB', 'UTG', 'MP', 'CO', 'BTN'],
            7: ['SB', 'BB', 'UTG', 'UTG+1', 'MP', 'CO', 'BTN'],
            8: ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP', 'CO', 'BTN'],
            9: ['SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP1', 'MP2', 'CO', 'BTN']
        };

        const positionNames = positionMaps[playerCount] || positionMaps[9];

        return orderedSeats.map((seat, index) => {
            const player = allPlayers.find(p => p.seat === seat);

            return {
                seat: seat,
                playerName: player.name,
                position: positionNames[index] || 'P' + index,
                clockwiseOrder: index
            };
        });
    }

    function enrichHandsWithPositions(hands) {
        let enrichedCount = 0;

        hands.forEach(hand => {
            if (hand.positions) {
                return; // Already has positions
            }

            const positionData = calculatePositions(hand);

            if (positionData) {
                hand.positions = positionData.positions;
                hand.buttonSeat = positionData.buttonSeat;
                enrichedCount++;
            }
        });

        if (enrichedCount > 0) {
            console.log(`Enriched ${enrichedCount} hands with position data`);
        }

        return hands;
    }

    // ============================================
    // PARSING LOGIC
    // ============================================

    function parseAction(text) {
    const action = {
        player: null,
        action: null,
        amount: null,
        raw: text
    };

    // Helper to parse amount (handles both $ and BB formats)
    function parseAmount(amountStr) {
        if (!amountStr) return null;
        // Remove commas and "BB" suffix, just get the number
        return parseFloat(amountStr.replace(/,/g, '').replace(/\s*BB$/i, ''));
    }

    let match;

    // Small blind: "PlayerName posted small blind $X" or "PlayerName posted small blind X BB"
    match = text.match(/^(.+?)\s+posted small blind\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'small_blind';
        action.amount = parseAmount(match[2]);
        return action;
    }

    // Big blind: "PlayerName posted big blind $X" or "PlayerName posted big blind X BB"
    match = text.match(/^(.+?)\s+posted big blind\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'big_blind';
        action.amount = parseAmount(match[2]);
        return action;
    }

    // Posted (ante/straddle): "PlayerName posted $X" or "PlayerName posted X BB"
    match = text.match(/^(.+?)\s+posted\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'posted';
        action.amount = parseAmount(match[2]);
        return action;
    }

    // Fold (no amount needed)
    match = text.match(/^(.+?)\s+folded/);
    if (match) {
        action.player = match[1].trim();
        action.action = 'fold';
        return action;
    }

    // Check (no amount needed)
    match = text.match(/^(.+?)\s+checked/);
    if (match) {
        action.player = match[1].trim();
        action.action = 'check';
        return action;
    }

    // Call: "PlayerName called $X" or "PlayerName called X BB"
    match = text.match(/^(.+?)\s+called\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'call';
        action.amount = parseAmount(match[2]);
        return action;
    }

    // Bet: "PlayerName bet $X" or "PlayerName bet X BB"
    match = text.match(/^(.+?)\s+bet\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'bet';
        action.amount = parseAmount(match[2]);
        return action;
    }

    // Raise: "PlayerName raised $X to $Y" or "PlayerName raised X BB to Y BB"
    match = text.match(/^(.+?)\s+raised\s+(?:\$)?([\d,.]+)(?:\s+BB)?\s+to\s+(?:\$)?([\d,.]+)(?:\s+BB)?/i);
    if (match) {
        action.player = match[1].trim();
        action.action = 'raise';
        action.amount = parseAmount(match[3]); // The "to" amount
        return action;
    }

    return action;
}

    function parseHandIntoStreets(hand) {
        const streets = {
            preflop: [],
            flop: [],
            turn: [],
            river: []
        };

        let currentStreet = null;

        hand.messages.forEach(msg => {
            const text = msg.text;

            if (text.includes('The preflop')) {
                currentStreet = 'preflop';
                return;
            }
            if (text.includes('The flop')) {
                currentStreet = 'flop';
                return;
            }
            if (text.includes('The turn')) {
                currentStreet = 'turn';
                return;
            }
            if (text.includes('The river')) {
                currentStreet = 'river';
                return;
            }

            if (currentStreet) {
                const action = parseAction(text);
                if (action.player) {
                    streets[currentStreet].push(action);
                }
            }
        });

        return streets;
    }

    // ============================================
    // STAT CALCULATION - EXISTING (VPIP, PFR, AF)
    // ============================================

    function calculateVPIP(playerName, hands) {
        let handsPlayed = 0;
        let vpipHands = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            const playerActions = preflopActions.filter(a => a.player === playerName);
            if (playerActions.length === 0) return;

            handsPlayed++;

            const voluntaryActions = playerActions.filter(a =>
                a.action === 'call' || a.action === 'bet' || a.action === 'raise'
            );

            if (voluntaryActions.length > 0) {
                vpipHands++;
            }
        });

        return {
            handsPlayed,
            vpipHands,
            vpip: handsPlayed > 0 ? Math.round((vpipHands / handsPlayed) * 100) : 0
        };
    }

    function calculatePFR(playerName, hands) {
        let handsPlayed = 0;
        let pfrHands = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            const playerActions = preflopActions.filter(a => a.player === playerName);
            if (playerActions.length === 0) return;

            handsPlayed++;

            const raised = playerActions.some(a => a.action === 'raise');
            if (raised) {
                pfrHands++;
            }
        });

        return {
            handsPlayed,
            pfrHands,
            pfr: handsPlayed > 0 ? Math.round((pfrHands / handsPlayed) * 100) : 0
        };
    }

    function calculateAF(playerName, hands) {
        let totalBets = 0;
        let totalRaises = 0;
        let totalCalls = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);

            ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                const playerActions = streets[street].filter(a => a.player === playerName);

                playerActions.forEach(action => {
                    if (action.action === 'bet') totalBets++;
                    if (action.action === 'raise') totalRaises++;
                    if (action.action === 'call') totalCalls++;
                });
            });
        });

        const aggressive = totalBets + totalRaises;
        const passive = totalCalls;

        let af;
        if (passive === 0) {
            af = aggressive > 0 ? '∞' : '0.00';
        } else {
            af = (aggressive / passive).toFixed(2);
        }

        return {
            bets: totalBets,
            raises: totalRaises,
            calls: totalCalls,
            af: af
        };
    }

    // ============================================
    // STAT CALCULATION - NEW STATS
    // ============================================

    function calculate3Bet(playerName, hands) {
        let opportunities = 0;
        let threeBets = 0;

            hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            // Find all raises in order
            const raises = [];
            preflopActions.forEach(action => {
                if (action.action === 'raise') {
                    raises.push(action.player);
                }
            });

            // Player must have raised AND not be the first raiser
            const playerRaised = raises.includes(playerName);
            const isFirstRaiser = raises.length > 0 && raises[0] === playerName;

            if (playerRaised && !isFirstRaiser) {
                threeBets++;
            }

            // Opportunity = faced a raise (but didn't post the original raise)
            const playerActions = preflopActions.filter(a => a.player === playerName);
            if (playerActions.length > 0 && raises.length > 0 && !isFirstRaiser) {
                // Find player's first VOLUNTARY action (skip blind posts)
                const firstVoluntaryActionIndex = preflopActions.findIndex(a =>
                    a.player === playerName &&
                    a.action !== 'small_blind' &&
                    a.action !== 'big_blind'
                );

                if (firstVoluntaryActionIndex > 0) {
                    const raiseBeforePlayer = preflopActions.slice(0, firstVoluntaryActionIndex).some(a => a.action === 'raise');

                    if (raiseBeforePlayer) {
                        opportunities++;
                    }
                }
            }
        });

        return {
            opportunities,
            threeBets,
            threeBet: opportunities > 0 ? Math.round((threeBets / opportunities) * 100) : 0
        };
    }

    function calculateFoldTo3Bet(playerName, hands) {
        let opportunities = 0;
        let folds = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);
            const preflopActions = streets.preflop;

            // Find raises in order
            const raises = [];
            preflopActions.forEach((action, idx) => {
                if (action.action === 'raise') {
                    raises.push({ player: action.player, index: idx });
                }
            });

            // Check if player was first raiser and then faced a 3bet
            if (raises.length >= 2 && raises[0].player === playerName) {
                opportunities++;

                // Check if player folded after the 3bet
                const after3bet = preflopActions.slice(raises[1].index + 1);
                const playerFolded = after3bet.some(a => a.player === playerName && a.action === 'fold');

                if (playerFolded) {
                    folds++;
                }
            }
        });

        return {
            opportunities,
            folds,
            foldTo3Bet: opportunities > 0 ? Math.round((folds / opportunities) * 100) : null
        };
    }

    function calculateCBet(playerName, hands) {
        let opportunities = 0;
        let cbets = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);

            // Must have raised preflop
            const preflopRaise = streets.preflop.some(a =>
                a.player === playerName && a.action === 'raise'
            );

            if (!preflopRaise) return;

            // Must have flop actions
            if (streets.flop.length === 0) return;

            opportunities++;

            // Check if player bet on flop
            const flopBet = streets.flop.some(a =>
                a.player === playerName && (a.action === 'bet' || a.action === 'raise')
            );

            if (flopBet) {
                cbets++;
            }
        });

        return {
            opportunities,
            cbets,
            cbet: opportunities > 0 ? Math.round((cbets / opportunities) * 100) : null
        };
    }
// Helper function to detect if a hand actually had a showdown
    function hadShowdown(hand) {
        // Showdown happens when cards are revealed
        // Check for:
        // 1. Winner message with cards: "won $X with [cards]"
        // 2. Reveal message: "PlayerName reveals [cards]"

        const hasWinnerWithCards = hand.messages.some(msg =>
            msg.text.includes('won') &&
            msg.text.includes('with [')
        );

        const hasRevealMessage = hand.messages.some(msg =>
            msg.text.includes('reveals [')
        );

        return hasWinnerWithCards || hasRevealMessage;
    }
    function calculateWTSD(playerName, hands) {
        let sawFlop = 0;
        let wentToShowdown = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);

            // Check if player saw flop
            const playerInFlop = streets.flop.some(a => a.player === playerName);
            if (!playerInFlop) return;

            sawFlop++;

            // Check if this hand actually had a showdown (cards revealed)
            if (!hadShowdown(hand)) return;

            // Check if player was still active at showdown (didn't fold anywhere)
            const playerFoldedFlop = streets.flop.some(a =>
                a.player === playerName && a.action === 'fold'
            );
            const playerFoldedTurn = streets.turn.some(a =>
                a.player === playerName && a.action === 'fold'
            );
            const playerFoldedRiver = streets.river.some(a =>
                a.player === playerName && a.action === 'fold'
            );

            // If player didn't fold on any street, they went to showdown
            if (!playerFoldedFlop && !playerFoldedTurn && !playerFoldedRiver) {
                wentToShowdown++;
            }
        });

        return {
            sawFlop,
            wentToShowdown,
            wtsd: sawFlop > 0 ? Math.round((wentToShowdown / sawFlop) * 100) : null
        };
    }

    function calculateWSD(playerName, hands) {
        let showdowns = 0;
        let wins = 0;

        hands.forEach(hand => {
            const streets = parseHandIntoStreets(hand);

            // Check if this hand actually had a showdown (cards revealed)
            if (!hadShowdown(hand)) return;

            // Check if player saw the flop (was involved in the hand)
            const playerInFlop = streets.flop.some(a => a.player === playerName);
            if (!playerInFlop) return;

            // Check if player folded on any street
            const playerFoldedFlop = streets.flop.some(a =>
                a.player === playerName && a.action === 'fold'
            );
            const playerFoldedTurn = streets.turn.some(a =>
                a.player === playerName && a.action === 'fold'
            );
            const playerFoldedRiver = streets.river.some(a =>
                a.player === playerName && a.action === 'fold'
            );

            // If player folded anywhere, they didn't go to showdown
            if (playerFoldedFlop || playerFoldedTurn || playerFoldedRiver) return;

            // Player went to showdown
            showdowns++;

            // Check if player won
            const winnerMessage = hand.messages.find(msg =>
    msg.text.includes('won') && (msg.text.includes('$') || msg.text.includes('BB'))
);

            if (winnerMessage && winnerMessage.text.includes(playerName)) {
                wins++;
            }
        });

        return {
            showdowns,
            wins,
            wsd: showdowns > 0 ? Math.round((wins / showdowns) * 100) : null
        };
    }

    // ============================================
    // MAIN CALCULATION FLOW
    // ============================================

    async function calculateStats(isAutoTriggered = false) {
        const statusDiv = document.getElementById('calcStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Loading hands from database...</div>';

        try {
            let allHands = await loadAllHands();

            // Apply 6+ player filter if enabled
            const filterEnabled = document.getElementById('filterPlayerCountCheckbox').checked;
            if (filterEnabled) {
                const originalCount = allHands.length;
                allHands = allHands.filter(hand => {
                    if (!hand.tableData || !hand.tableData.playerCount) return false;
                    return hand.tableData.playerCount >= 6;
                });
                statusDiv.innerHTML += `<div class="status-line status-info">Filtered: ${originalCount} → ${allHands.length} hands (6+ players only)</div>`;
            }

            if (allHands.length === 0) {
                statusDiv.innerHTML = '<div class="status-line status-error">No hands found in database. Play some poker first!</div>';
                return;
            }

            statusDiv.innerHTML += `<div class="status-line status-success">Loaded ${allHands.length} hands</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">Calculating positions...</div>';

            // Enrich hands with positions
            allHands = enrichHandsWithPositions(allHands);

            statusDiv.innerHTML += '<div class="status-line status-info">Analyzing player actions...</div>';

            console.log(`Calculating stats from ${allHands.length} hands...`);

            const playerNames = new Set();
            allHands.forEach(hand => {
                const streets = parseHandIntoStreets(hand);
                ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                    streets[street].forEach(action => {
                        if (action.player) {
                            playerNames.add(action.player);
                        }
                    });
                });
            });

            console.log(`Found ${playerNames.size} unique players`);
            statusDiv.innerHTML += `<div class="status-line status-success">Found ${playerNames.size} unique players</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">Calculating 8 statistics per player...</div>';

            // Load existing stats from database for merging
            statusDiv.innerHTML += '<div class="status-line status-info">Loading existing player stats for merging...</div>';
            const existingStats = await loadStatsFromDatabase();

            const statsData = {};
            playerNames.forEach(playerName => {
                // Calculate stats from NEW hands
                const vpipData = calculateVPIP(playerName, allHands);
                const pfrData = calculatePFR(playerName, allHands);
                const afData = calculateAF(playerName, allHands);
                const threeBetData = calculate3Bet(playerName, allHands);
                const foldTo3BetData = calculateFoldTo3Bet(playerName, allHands);
                const cbetData = calculateCBet(playerName, allHands);
                const wtsdData = calculateWTSD(playerName, allHands);
                const wsdData = calculateWSD(playerName, allHands);

                // Check if player has existing stats
                const existing = existingStats[playerName];

                if (existing) {
                    // MERGE: Add old counts + new counts
                    const mergedHands = existing.hands + vpipData.handsPlayed;
                    const mergedVpipHands = (existing.vpipHands || 0) + vpipData.vpipHands;
                    const mergedPfrHands = (existing.pfrHands || 0) + pfrData.pfrHands;
                    const mergedBets = (existing.bets || 0) + afData.bets;
                    const mergedRaises = (existing.raises || 0) + afData.raises;
                    const mergedCalls = (existing.calls || 0) + afData.calls;
                    const merged3BetOpps = (existing.threeBetOpportunities || 0) + threeBetData.opportunities;
                    const merged3BetCount = (existing.threeBetCount || 0) + threeBetData.threeBets;
                    const mergedFold3BetOpps = (existing.foldTo3BetOpportunities || 0) + (foldTo3BetData.opportunities || 0);
                    const mergedFold3BetCount = (existing.foldTo3BetCount || 0) + (foldTo3BetData.folds || 0);
                    const mergedCbetOpps = (existing.cbetOpportunities || 0) + (cbetData.opportunities || 0);
                    const mergedCbetCount = (existing.cbetCount || 0) + (cbetData.cbets || 0);
                    const mergedWtsdSawFlop = (existing.wtsdSawFlop || 0) + (wtsdData.sawFlop || 0);
                    const mergedWtsdWentToShowdown = (existing.wtsdWentToShowdown || 0) + (wtsdData.wentToShowdown || 0);
                    const mergedWsdShowdowns = (existing.wsdShowdowns || 0) + (wsdData.showdowns || 0);
                    const mergedWsdWins = (existing.wsdWins || 0) + (wsdData.wins || 0);

                    // Recalculate percentages from merged counts
                    const mergedVpip = mergedHands > 0 ? Math.round((mergedVpipHands / mergedHands) * 100) : 0;
                    const mergedPfr = mergedHands > 0 ? Math.round((mergedPfrHands / mergedHands) * 100) : 0;

                    let mergedAf;
                    if (mergedCalls === 0) {
                        mergedAf = (mergedBets + mergedRaises) > 0 ? '∞' : '0.00';
                    } else {
                        mergedAf = ((mergedBets + mergedRaises) / mergedCalls).toFixed(2);
                    }

                    const merged3Bet = merged3BetOpps > 0 ? Math.round((merged3BetCount / merged3BetOpps) * 100) : 0;
                    const mergedFold3Bet = mergedFold3BetOpps > 0 ? Math.round((mergedFold3BetCount / mergedFold3BetOpps) * 100) : null;
                    const mergedCbet = mergedCbetOpps > 0 ? Math.round((mergedCbetCount / mergedCbetOpps) * 100) : null;
                    const mergedWtsd = mergedWtsdSawFlop > 0 ? Math.round((mergedWtsdWentToShowdown / mergedWtsdSawFlop) * 100) : null;
                    const mergedWsd = mergedWsdShowdowns > 0 ? Math.round((mergedWsdWins / mergedWsdShowdowns) * 100) : null;

                    statsData[playerName] = {
                        hands: mergedHands,
                        vpip: mergedVpip,
                        pfr: mergedPfr,
                        af: mergedAf,
                        threeBet: merged3Bet,
                        foldTo3Bet: mergedFold3Bet,
                        cbet: mergedCbet,
                        wtsd: mergedWtsd,
                        wsd: mergedWsd,
                        // Raw counts
                        vpipHands: mergedVpipHands,
                        pfrHands: mergedPfrHands,
                        bets: mergedBets,
                        raises: mergedRaises,
                        calls: mergedCalls,
                        threeBetOpportunities: merged3BetOpps,
                        threeBetCount: merged3BetCount,
                        foldTo3BetOpportunities: mergedFold3BetOpps,
                        foldTo3BetCount: mergedFold3BetCount,
                        cbetOpportunities: mergedCbetOpps,
                        cbetCount: mergedCbetCount,
                        wtsdSawFlop: mergedWtsdSawFlop,
                        wtsdWentToShowdown: mergedWtsdWentToShowdown,
                        wsdShowdowns: mergedWsdShowdowns,
                        wsdWins: mergedWsdWins
                    };

                    console.log(`Merged ${playerName}: ${existing.hands} old + ${vpipData.handsPlayed} new = ${mergedHands} total hands`);
                } else {
                    // NEW PLAYER: No existing stats, use current calculation
                    statsData[playerName] = {
                        hands: vpipData.handsPlayed,
                        vpip: vpipData.vpip,
                        pfr: pfrData.pfr,
                        af: afData.af,
                        threeBet: threeBetData.threeBet,
                        foldTo3Bet: foldTo3BetData.foldTo3Bet,
                        cbet: cbetData.cbet,
                        wtsd: wtsdData.wtsd,
                        wsd: wsdData.wsd,
                        // Raw counts
                        vpipHands: vpipData.vpipHands,
                        pfrHands: pfrData.pfrHands,
                        bets: afData.bets,
                        raises: afData.raises,
                        calls: afData.calls,
                        threeBetOpportunities: threeBetData.opportunities,
                        threeBetCount: threeBetData.threeBets,
                        foldTo3BetOpportunities: foldTo3BetData.opportunities || 0,
                        foldTo3BetCount: foldTo3BetData.folds || 0,
                        cbetOpportunities: cbetData.opportunities || 0,
                        cbetCount: cbetData.cbets || 0,
                        wtsdSawFlop: wtsdData.sawFlop || 0,
                        wtsdWentToShowdown: wtsdData.wentToShowdown || 0,
                        wsdShowdowns: wsdData.showdowns || 0,
                        wsdWins: wsdData.wins || 0
                    };
                }
            });

            calculatedStats = statsData;

            // Save to database
            statusDiv.innerHTML += '<div class="status-line status-info">Saving stats to database...</div>';
            const saved = await saveStatsToDatabase(statsData);

            statusDiv.innerHTML += `<div class="status-line status-success">Stats saved to database (${saved} players)</div>`;

            displayResults(statsData);

            console.log('Stats calculation complete and saved');

            // Fire event to update HUD
            window.postMessage({
                type: "COMMAND",
                target: "PokerStatsDisplay",
                action: "REFRESH_STATS",
                source: "PokerStatsCalculator"
            }, "*");

            // Check if auto-delete is enabled
            const autoDeleteEnabled = document.getElementById('autoDeleteHandsCheckbox').checked;
            if (autoDeleteEnabled) {
                statusDiv.innerHTML += '<div class="status-line status-info">Auto-delete enabled - processing...</div>';
                try {
                    // Export hands first (skip if auto-triggered)
                    if (!isAutoTriggered) {
                        statusDiv.innerHTML += '<div class="status-line status-info">Exporting hands backup...</div>';
                        await exportHandsBackup(allHands);
                        statusDiv.innerHTML += '<div class="status-line status-success">✅ Hands backup exported</div>';
                    } else {
                        statusDiv.innerHTML += '<div class="status-line status-info">Skipping export (auto-triggered)</div>';
                    }

                    // Now safe to delete
                    statusDiv.innerHTML += '<div class="status-line status-info">Deleting hands from database...</div>';
                    const deletedCount = allHands.length;
                    await deleteAllHandsFromDB();
                    statusDiv.innerHTML += `<div class="status-line status-success">✅ Deleted ${deletedCount} hands from database</div>`;

                    // Update database info
                    updateDatabaseInfo();

                    console.log(`Auto-deleted ${deletedCount} hands after successful calculation`);
                } catch (error) {
                    console.error('Auto-delete failed:', error);
                    statusDiv.innerHTML += `<div class="status-line status-error">⚠️ Export/Delete failed: ${error.message}</div>`;
                    statusDiv.innerHTML += `<div class="status-line status-info">Hands were NOT deleted (stats are saved)</div>`;
                }
            }
        } catch (error) {
            console.error('Calculation failed:', error);
            statusDiv.innerHTML += `<div class="status-line status-error">Error: ${error.message}</div>`;
        }
    }
    async function deleteAllHands() {
        const statusDiv = document.getElementById('deleteStatus');

        // Confirmation dialog
        const handCount = await getHandCount();

        if (handCount === 0) {
            statusDiv.innerHTML = '<div class="status-line status-info">No hands to delete - database is already empty!</div>';
            return;
        }

        const confirmed = confirm(
            `⚠️ DELETE ALL HANDS?\n\n` +
            `This will permanently delete ${handCount} hands from the database.\n\n` +
            `✅ Player stats will be KEPT and will continue to accumulate.\n` +
            `❌ Hand histories will be DELETED and cannot be recovered.\n\n` +
            `Are you sure you want to continue?`
        );

        if (!confirmed) {
            statusDiv.innerHTML = '<div class="status-line status-info">Delete cancelled</div>';
            return;
        }

        statusDiv.innerHTML = '<div class="status-line status-info">Deleting hands from database...</div>';

        try {
            await deleteAllHandsFromDB();

            // Get player count for confirmation
            const playerStats = await loadStatsFromDatabase();
            const playerCount = Object.keys(playerStats).length;

            statusDiv.innerHTML = `
                <div class="status-line status-success">✅ Deleted ${handCount} hands successfully!</div>
                <div class="status-line status-info">Player stats preserved: ${playerCount} players</div>
                <div class="status-line status-info">Database cleaned - ready for new hands</div>
            `;

            // Update the database info in the calculate section
            updateDatabaseInfo();

            console.log(`Deleted ${handCount} hands, kept stats for ${playerCount} players`);
        } catch (error) {
            console.error('Delete failed:', error);
            statusDiv.innerHTML += `<div class="status-line status-error">Error: ${error.message}</div>`;
        }
    }

    function deleteAllHandsFromDB() {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["hands"], "readwrite");
            const store = transaction.objectStore("hands");
            const clearRequest = store.clear();

            clearRequest.onsuccess = function() {
                resolve();
            };

            clearRequest.onerror = function() {
                reject(clearRequest.error);
            };
        });
    }
    function exportHandsBackup(hands) {
        return new Promise((resolve, reject) => {
            try {
                if (!hands || hands.length === 0) {
                    reject(new Error('No hands to export'));
                    return;
                }

                // Create export data with metadata
                const exportData = {
                    version: "0.7.0",
                    exportDate: new Date().toISOString(),
                    handCount: hands.length,
                    hands: hands
                };

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;

                const dateStr = new Date().toISOString().split('T')[0];
                a.download = `poker-hands-backup-${dateStr}.json`;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                console.log(`Exported ${hands.length} hands to ${a.download}`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    async function exportStatsBackup() {
        const statusDiv = document.getElementById('backupStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Loading player stats from database...</div>';

        try {
            const stats = await loadStatsFromDatabase();
            const playerCount = Object.keys(stats).length;

            if (playerCount === 0) {
                statusDiv.innerHTML = '<div class="status-line status-error">No player stats found in database!</div>';
                return;
            }

            // Create backup file with metadata
            const backup = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                playerCount: playerCount,
                stats: stats
            };

            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poker-stats-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            statusDiv.innerHTML = `
                <div class="status-line status-success">✅ Stats backup exported successfully!</div>
                <div class="status-line status-info">Players exported: ${playerCount}</div>
                <div class="status-line status-info">File: ${a.download}</div>
            `;

            console.log(`Exported stats backup for ${playerCount} players`);
        } catch (error) {
            console.error('Export failed:', error);
            statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
        }
    }
    async function handleStatsBackupImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusDiv = document.getElementById('backupStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Reading backup file...</div>';

        try {
            const text = await file.text();
            const backup = JSON.parse(text);

            // Validate backup format
            if (!backup.stats || typeof backup.stats !== 'object') {
                throw new Error('Invalid backup file format (missing stats)');
            }

            const playerCount = Object.keys(backup.stats).length;

            if (playerCount === 0) {
                throw new Error('Backup file contains no player stats');
            }

            // Confirm overwrite
            const confirmed = confirm(
                `📥 IMPORT STATS BACKUP?\n\n` +
                `This will import ${playerCount} players from the backup file.\n\n` +
                `Backup date: ${new Date(backup.exportDate).toLocaleString()}\n\n` +
                `⚠️ Warning: This will OVERWRITE existing stats for players in the backup.\n` +
                `Players NOT in the backup will remain unchanged.\n\n` +
                `Continue with import?`
            );

            if (!confirmed) {
                statusDiv.innerHTML = '<div class="status-line status-info">Import cancelled</div>';
                event.target.value = '';
                return;
            }

            statusDiv.innerHTML += '<div class="status-line status-info">Importing player stats to database...</div>';

            // Import stats to database
            await importStatsToDatabase(backup.stats);

            statusDiv.innerHTML = `
                <div class="status-line status-success">✅ Stats backup imported successfully!</div>
                <div class="status-line status-info">Players imported: ${playerCount}</div>
                <div class="status-line status-info">Backup from: ${new Date(backup.exportDate).toLocaleString()}</div>
            `;

            console.log(`Imported stats backup for ${playerCount} players`);
        } catch (error) {
            console.error('Import failed:', error);
            statusDiv.innerHTML = `<div class="status-line status-error">Error: ${error.message}</div>`;
        } finally {
            event.target.value = '';
        }
    }

    function importStatsToDatabase(stats) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('Database not connected'));
                return;
            }

            const transaction = db.transaction(["playerStats"], "readwrite");
            const store = transaction.objectStore("playerStats");

            let importedCount = 0;

            Object.entries(stats).forEach(([playerName, playerStats]) => {
                // Ensure the record has all required fields
                const record = {
                    playerName: playerName,
                    hands: playerStats.hands || 0,
                    vpip: playerStats.vpip || 0,
                    pfr: playerStats.pfr || 0,
                    af: playerStats.af || '0.00',
                    threeBet: playerStats.threeBet || 0,
                    cbet: playerStats.cbet || null,
                    foldTo3Bet: playerStats.foldTo3Bet || null,
                    wtsd: playerStats.wtsd || null,
                    wsd: playerStats.wsd || null,
                    // Raw counts
                    vpipHands: playerStats.vpipHands || 0,
                    pfrHands: playerStats.pfrHands || 0,
                    bets: playerStats.bets || 0,
                    raises: playerStats.raises || 0,
                    calls: playerStats.calls || 0,
                    threeBetOpportunities: playerStats.threeBetOpportunities || 0,
                    threeBetCount: playerStats.threeBetCount || 0,
                    foldTo3BetOpportunities: playerStats.foldTo3BetOpportunities || 0,
                    foldTo3BetCount: playerStats.foldTo3BetCount || 0,
                    cbetOpportunities: playerStats.cbetOpportunities || 0,
                    cbetCount: playerStats.cbetCount || 0,
                    wtsdSawFlop: playerStats.wtsdSawFlop || 0,
                    wtsdWentToShowdown: playerStats.wtsdWentToShowdown || 0,
                    wsdShowdowns: playerStats.wsdShowdowns || 0,
                    wsdWins: playerStats.wsdWins || 0,
                    lastUpdated: Date.now()
                };

                const putRequest = store.put(record);
                putRequest.onsuccess = () => importedCount++;
            });

            transaction.oncomplete = function() {
                console.log(`Imported ${importedCount} player stats to database`);
                resolve(importedCount);
            };

            transaction.onerror = function() {
                reject(transaction.error);
            };
        });
    }

    function displayResults(statsData) {
        const resultsDiv = document.getElementById('statsResults');
        const players = Object.entries(statsData).sort((a, b) => b[1].hands - a[1].hands);

        let html = `<div style="margin-bottom: 10px; font-weight: bold; color: #34d399;">
            Calculated 8 stats for ${players.length} players
        </div>`;

        players.forEach(([playerName, stats]) => {
            const sampleIndicator = getSampleSizeIndicator(stats.hands);

            html += `
                <div class="player-stat-item">
                    <div class="player-stat-name">
                        ${playerName} ${sampleIndicator}
                    </div>

                    <div class="stat-section-header">Core Stats</div>
                    <div class="player-stat-line">Hands: ${stats.hands}</div>
                    <div class="player-stat-line">VPIP: ${stats.vpip}%</div>
                    <div class="player-stat-line">PFR: ${stats.pfr}%</div>
                    <div class="player-stat-line">3Bet: ${formatStat(stats.threeBet, '%')}</div>
                    <div class="player-stat-line">AF: ${stats.af}</div>

                    <div class="stat-section-header">Postflop Stats</div>
                    <div class="player-stat-line">CBet: ${formatStat(stats.cbet, '%')}</div>
                    <div class="player-stat-line">Fold to 3Bet: ${formatStat(stats.foldTo3Bet, '%')}</div>
                    <div class="player-stat-line">WTSD: ${formatStat(stats.wtsd, '%')}</div>
                    <div class="player-stat-line">W$SD: ${formatStat(stats.wsd, '%')}</div>
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
        document.getElementById('resultsSection').style.display = 'block';
    }

    function formatStat(value, suffix) {
        if (value === null || value === undefined) {
            return '--';
        }
        return value + suffix;
    }

    function getSampleSizeIndicator(hands) {
        if (hands < 50) {
            return '<span style="color: #fca5a5;" title="Limited sample - stats may be unreliable">📊</span>';
        } else if (hands < 100) {
            return '<span style="color: #fbbf24;" title="Moderate sample - stats becoming reliable">📊</span>';
        } else {
            return '<span style="color: #6ee7b7;" title="Good sample - stats are reliable">📈</span>';
        }
    }

    // ============================================
    // IMPORT/EXPORT (BACKUP ONLY)
    // ============================================

    async function handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const statusDiv = document.getElementById('importStatus');
        statusDiv.innerHTML = '<div class="status-line status-info">Reading file...</div>';

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.hands || !Array.isArray(data.hands)) {
                throw new Error('Invalid format (missing hands array)');
            }

            statusDiv.innerHTML += `<div class="status-line status-success">File contains ${data.hands.length} hands</div>`;
            statusDiv.innerHTML += '<div class="status-line status-info">This will calculate stats without saving hands to database</div>';

            let allHands = data.hands;

            // Apply 6+ player filter if enabled
            const filterEnabled = document.getElementById('filterPlayerCountCheckbox').checked;
            if (filterEnabled) {
                const originalCount = allHands.length;
                allHands = allHands.filter(hand => {
                    if (!hand.tableData || !hand.tableData.playerCount) return false;
                    return hand.tableData.playerCount >= 6;
                });
                statusDiv.innerHTML += `<div class="status-line status-info">Filtered: ${originalCount} → ${allHands.length} hands (6+ players only)</div>`;
            }

            // Enrich with positions
            allHands = enrichHandsWithPositions(allHands);

            const playerNames = new Set();
            allHands.forEach(hand => {
                const streets = parseHandIntoStreets(hand);
                ['preflop', 'flop', 'turn', 'river'].forEach(street => {
                    streets[street].forEach(action => {
                        if (action.player) {
                            playerNames.add(action.player);
                        }
                    });
                });
            });

            const statsData = {};
            playerNames.forEach(playerName => {
                const vpipData = calculateVPIP(playerName, allHands);
                const pfrData = calculatePFR(playerName, allHands);
                const afData = calculateAF(playerName, allHands);
                const threeBetData = calculate3Bet(playerName, allHands);
                const foldTo3BetData = calculateFoldTo3Bet(playerName, allHands);
                const cbetData = calculateCBet(playerName, allHands);
                const wtsdData = calculateWTSD(playerName, allHands);
                const wsdData = calculateWSD(playerName, allHands);

                statsData[playerName] = {
                    hands: vpipData.handsPlayed,
                    vpip: vpipData.vpip,
                    pfr: pfrData.pfr,
                    af: afData.af,
                    threeBet: threeBetData.threeBet,
                    foldTo3Bet: foldTo3BetData.foldTo3Bet,
                    cbet: cbetData.cbet,
                    wtsd: wtsdData.wtsd,
                    wsd: wsdData.wsd
                };
            });

            calculatedStats = statsData;
            displayResults(statsData);

            statusDiv.innerHTML += `<div class="status-line status-success">Calculated stats for ${playerNames.size} players (temporary - not saved)</div>`;

        } catch (error) {
            statusDiv.innerHTML += `<div class="status-line status-error">Error: ${error.message}</div>`;
        } finally {
            event.target.value = '';
        }
    }

    function downloadStats() {
        if (!calculatedStats) {
            alert('No stats calculated yet');
            return;
        }

        const exportData = {
            lastUpdated: new Date().toISOString(),
            players: calculatedStats
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker_stats_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('Stats downloaded');
    }

    // ============================================
    // UI CREATION
    // ============================================

    function createUI() {
        const controlBtn = document.createElement('button');
        controlBtn.id = 'statsCalculatorBtn';
        controlBtn.className = 'stats-calc-btn';
        controlBtn.innerHTML = '📊 Stats Calculator';
        controlBtn.onclick = toggleCalculatorPanel;

        const panel = document.createElement('div');
        panel.id = 'statsCalculatorPanel';
        panel.className = 'stats-calc-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="calc-header" id="calcDragHandle">
                <span class="calc-title">📊 Poker Stats Calculator v3.0 (Drag to Move)</span>
                <button class="calc-help-btn" id="calcHelpBtn">?</button>
                <button class="calc-close-btn" id="calcCloseBtn">×</button>
            </div>
            <div class="calc-content">
                <div class="calc-section">
                    <div class="calc-label">Calculate 8 Stats from Database</div>
                    <div class="calc-info">
                        Calculates VPIP, PFR, 3Bet%, AF, CBet%, Fold to 3Bet%, WTSD%, and W$SD%
                        from all hands in your IndexedDB. Stats will be saved and available to the HUD.
                    </div>
                    <div id="dbInfo" class="calc-info"></div>

                    <div style="margin: 10px 0; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #e4e4e4; font-size: 13px;">
                            <input type="checkbox" id="filterPlayerCountCheckbox" style="cursor: pointer; width: 16px; height: 16px;">
                            <span>Only calculate from 6+ player hands</span>
                        </label>
                    </div>

                    <div style="margin: 10px 0; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: #e4e4e4; font-size: 13px;">
                            <input type="checkbox" id="autoDeleteHandsCheckbox" checked style="cursor: pointer; width: 16px; height: 16px;">
                            <span>Export hands backup & delete after calculating (recommended)</span>
                        </label>
                    </div>

                    <div style="margin: 15px 0; text-align: center;">
                        <button class="calc-btn calc-btn-success" id="calculateStatsBtn">
                            🎯 Calculate & Save Stats
                        </button>
                    </div>
                    <div id="calcStatus" class="calc-status"></div>
                </div>
                <div class="calc-section">
                    <div class="calc-label">Backup & Restore Player Stats</div>
                    <div class="calc-info">
                        Export your player stats as a backup file (includes all raw counts for proper merging).
                        Import to restore stats if IndexedDB is lost or corrupted.
                    </div>
                    <div style="margin: 15px 0; text-align: center; display: flex; gap: 10px; justify-content: center;">
                        <button class="calc-btn calc-btn-download" id="exportStatsBackupBtn">
                            💾 Export Stats Backup
                        </button>
                        <button class="calc-btn calc-btn-primary" id="importStatsBackupBtn">
                            📥 Import Stats Backup
                        </button>
                        <input type="file" id="statsBackupFileInput" accept=".json" style="display: none;">
                    </div>
                    <div id="backupStatus" class="calc-status"></div>
                </div>

                <div class="calc-section">
                    <div class="calc-label">Import External Hands (Optional)</div>
                    <div class="calc-info">
                        Calculate stats from an external JSON file without saving to database.
                        Useful for analyzing shared hand histories.
                    </div>
                    <div style="margin: 15px 0; text-align: center;">
                        <button class="calc-btn calc-btn-primary" id="importHandsBtn">
                            📁 Import & Calculate
                        </button>
                        <input type="file" id="handsFileInput" accept=".json" style="display: none;">
                    </div>
                    <div id="importStatus" class="calc-status"></div>
                </div>

                <div id="resultsSection" style="display: none;">
                    <div class="calc-section">
                        <div class="calc-label">Calculation Results</div>
                        <div id="statsResults" class="stats-results"></div>
                        <div style="margin: 15px 0; text-align: center;">
                            <button class="calc-btn calc-btn-download" id="downloadStatsBtn">
                                💾 Export Stats JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(controlBtn);
        document.body.appendChild(panel);

        // Create help modal
        const helpModal = document.createElement('div');
        helpModal.id = 'calcHelpModal';
        helpModal.className = 'calc-modal';
        helpModal.style.display = 'none';
        helpModal.innerHTML = `
            <div class="calc-modal-content">
                <div class="calc-modal-header">
                    <span class="calc-modal-title">How to Use Stats Calculator</span>
                    <button class="calc-close-btn" id="calcHelpClose">×</button>
                </div>
                <div class="calc-modal-body">
                    <h3>✨ Fully Automatic Operation</h3>
                    <p>Stats calculate automatically after every hand - no manual clicking needed!</p>
                    <p>This panel is for manual operations and configuration only.</p>

                    <h3>📊 Calculate & Save Stats Button</h3>
                    <p><strong>Manual calculation:</strong> Force recalculation of all stats from hands in database</p>
                    <p><strong>When to use:</strong> Testing, troubleshooting, or verifying calculations</p>
                    <p><strong>Normal play:</strong> Not needed - calculations happen automatically!</p>

                    <h3>☑️ Only Calculate from 6+ Player Hands</h3>
                    <p>Filter to analyze only full ring poker (6+ players at table):</p>
                    <p>• Checked: Ignores heads-up and short-handed hands</p>
                    <p>• Unchecked: Includes all hands regardless of table size</p>
                    <p><strong>Recommended:</strong> Keep checked for clean full ring stats</p>

                    <h3>☑️ Export & Delete After Calculating</h3>
                    <p><strong>Checked (Recommended):</strong></p>
                    <p>• Exports hands to JSON backup file</p>
                    <p>• Deletes hands from temp database</p>
                    <p>• Keeps stats and merges with previous sessions</p>
                    <p>• Prevents duplicate calculations</p>
                    <p><strong>Unchecked:</strong> Hands remain in temp database (can cause duplicate counting!)</p>

                    <h3>💾 Backup & Restore Player Stats</h3>
                    <p><strong>Export Stats Backup:</strong> Save all player stats to JSON file</p>
                    <p>• Includes all raw counts for proper merging</p>
                    <p>• Use for emergency recovery or moving to new browser</p>
                    <p><strong>Import Stats Backup:</strong> Restore player stats from backup</p>
                    <p>• Overwrites existing stats for players in backup</p>
                    <p>• Other players remain unchanged</p>

                    <h3>📥 Import External Hands (Optional)</h3>
                    <p><strong>For testing/analysis only:</strong></p>
                    <p>• Imports hands from JSON file</p>
                    <p>• Calculates stats temporarily</p>
                    <p>• Shows results immediately</p>
                    <p>• Does NOT save hands to archive</p>
                    <p>• Perfect for unit testing calculations</p>
                    <p><strong>For permanent import:</strong> Use Hand Collector's import instead!</p>

                    <h3>🎯 Two-Database Architecture</h3>
                    <p><strong>Temp Database (Used Here):</strong></p>
                    <p>• Holds 0-1 hands at a time</p>
                    <p>• Auto-cleans after each calculation</p>
                    <p>• Fast and efficient</p>
                    <p><strong>Archive Database:</strong></p>
                    <p>• Stores all hands permanently</p>
                    <p>• Viewable in Hand Collector</p>
                    <p>• Never touched by this script</p>

                    <h3>🔄 Automatic Stats Merging</h3>
                    <p>Stats accumulate over time automatically:</p>
                    <p>• Old player stats + New hand data = Updated totals</p>
                    <p>• Raw counts stored for accurate percentages</p>
                    <p>• Works across sessions forever</p>
                    <p>• No duplicate counting (if auto-delete enabled)</p>

                    <h3>💡 Pro Tips</h3>
                    <p>• Leave auto-delete checkbox ON to prevent duplicates</p>
                    <p>• 6+ player filter ensures clean full ring stats</p>
                    <p>• Export stats backups monthly for safety</p>
                    <p>• Use import external hands for testing only</p>
                    <p>• Both $ and BB bet formats fully supported</p>
                    <p>• Stats Display script shows live HUD overlay</p>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);

        document.getElementById('calcCloseBtn').onclick = toggleCalculatorPanel;
        document.getElementById('calcHelpBtn').onclick = () => {
            document.getElementById('calcHelpModal').style.display = 'flex';
        };
        document.getElementById('calcHelpClose').onclick = () => {
            document.getElementById('calcHelpModal').style.display = 'none';
        };
        document.getElementById('calculateStatsBtn').onclick = calculateStats;
        document.getElementById('importHandsBtn').onclick = () => {
            document.getElementById('handsFileInput').click();
        };
        document.getElementById('exportStatsBackupBtn').onclick = exportStatsBackup;
        document.getElementById('importStatsBackupBtn').onclick = () => {
            document.getElementById('statsBackupFileInput').click();
        };
        document.getElementById('statsBackupFileInput').onchange = handleStatsBackupImport;
        document.getElementById('handsFileInput').onchange = handleFileImport;
        document.getElementById('downloadStatsBtn').onclick = downloadStats;

        makeDraggable(panel, document.getElementById('calcDragHandle'));
        injectStyles();

        updateDatabaseInfo();
    }

    async function updateDatabaseInfo() {
        const dbInfo = document.getElementById('dbInfo');
        try {
            const count = await getHandCount();
            dbInfo.innerHTML = `<strong>Database contains ${count} hands ready for analysis</strong>`;
        } catch (error) {
            dbInfo.innerHTML = `<span style="color: #fca5a5;">Database not accessible. Make sure Hand Collector is running.</span>`;
        }
    }

    function makeDraggable(panel, handle) {
        handle.style.cursor = 'move';
        handle.style.userSelect = 'none';

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.zIndex = '1000000';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
            panel.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panel.style.zIndex = '999999';
            }
        });
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stats-calc-btn {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                color: #e94560;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                z-index: 1400;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                transition: all 0.2s;
            }

            .stats-calc-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            }

            .stats-calc-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                max-width: 95vw;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: #e4e4e4;
            }

            .calc-header {
                position: relative;
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .calc-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .calc-close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e4e4e4;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
                transition: all 0.2s;
            }

            .calc-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .calc-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .calc-section {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 15px;
                border: 1px solid #0f3460;
            }

            .calc-label {
                font-size: 14px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 8px;
            }

            .calc-info {
                font-size: 12px;
                color: #94a3b8;
                line-height: 1.5;
                margin-bottom: 10px;
            }

            .calc-btn {
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                transition: all 0.2s;
                margin: 5px;
            }

            .calc-btn-primary {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
            }

            .calc-btn-primary:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .calc-btn-success {
                background: rgba(52, 211, 153, 0.3);
                border: 1px solid #34d399;
                color: #6ee7b7;
            }

            .calc-btn-success:hover {
                background: rgba(52, 211, 153, 0.5);
            }

            .calc-btn-download {
                background: rgba(168, 85, 247, 0.3);
                border: 1px solid #a855f7;
                color: #c4b5fd;
            }

            .calc-btn-download:hover {
                background: rgba(168, 85, 247, 0.5);
            }
            .calc-btn-danger {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .calc-btn-danger:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
            }

            .calc-status {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                min-height: 60px;
            }

            .status-line {
                padding: 4px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .status-line:last-child {
                border-bottom: none;
            }

            .status-success {
                color: #6ee7b7;
            }

            .status-error {
                color: #fca5a5;
            }

            .status-info {
                color: #93c5fd;
            }

            .calc-content::-webkit-scrollbar {
                width: 8px;
            }

            .calc-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .calc-content::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .stats-results {
                max-height: 400px;
                overflow-y: auto;
            }

            .stats-results::-webkit-scrollbar {
                width: 8px;
            }

            .stats-results::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .stats-results::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .player-stat-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #0f3460;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 10px;
                transition: all 0.2s;
            }

            .player-stat-item:hover {
                border-color: #e94560;
                background: rgba(0, 0, 0, 0.4);
            }

            .player-stat-name {
                font-weight: bold;
                color: #e94560;
                font-size: 14px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .stat-section-header {
                font-size: 11px;
                font-weight: bold;
                color: #93c5fd;
                margin-top: 8px;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .player-stat-line {
                font-size: 12px;
                color: #e4e4e4;
                padding: 2px 0;
                padding-left: 10px;
            }
        /* Help Button */
            .calc-help-btn {
                position: absolute;
                right: 50px;
                top: 50%;
                transform: translateY(-50%);
                background: #0f3460;
                border: 1px solid #e94560;
                color: #e94560;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .calc-help-btn:hover {
                background: #e94560;
                color: #1a1a2e;
                transform: translateY(-50%) scale(1.1);
            }

            /* Help Modal */
            .calc-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                z-index: 1000000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            .calc-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                width: 700px;
                max-width: 90vw;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
            }
            .calc-modal-header {
                background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
                padding: 15px 20px;
                border-bottom: 2px solid #e94560;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }
            .calc-modal-title {
                color: #e94560;
                font-weight: bold;
                font-size: 16px;
            }
            .calc-modal-body {
                padding: 20px;
                overflow-y: auto;
                color: #e4e4e4;
                line-height: 1.6;
            }
            .calc-modal-body h3 {
                color: #93c5fd;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 15px;
                border-bottom: 1px solid #0f3460;
                padding-bottom: 5px;
            }
            .calc-modal-body h3:first-child {
                margin-top: 0;
            }
            .calc-modal-body p {
                margin: 8px 0;
                font-size: 13px;
                color: #d1d5db;
            }
            .calc-modal-body strong {
                color: #e94560;
            }
            .calc-modal-body em {
                color: #93c5fd;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // UI CONTROL
    // ============================================

    function toggleCalculatorPanel() {
        const panel = document.getElementById('statsCalculatorPanel');
        calculatorPanelOpen = !calculatorPanelOpen;
        panel.style.display = calculatorPanelOpen ? 'flex' : 'none';
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('Poker Stats Calculator v3.0');
        console.log('Waiting for poker table...');

        const checkForTable = setInterval(async () => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('Poker table found - initializing calculator');

                try {
                    await connectToDatabase();
                    console.log('Database connected');
                } catch (error) {
                    console.warn('Database connection failed:', error);
                }

                createUI();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForTable), 30000);
    }
    // Listen for auto-calculate trigger from Hand Collector
    window.addEventListener('message', (event) => {
        if (event.data.type === 'COMMAND' &&
            event.data.target === 'PokerStatsCalculator' &&
            event.data.action === 'AUTO_CALCULATE') {

            console.log('🎯 Auto-calculate triggered by Hand Collector');

            // Wait a moment for database to settle
            setTimeout(() => {
                calculateStats(true); // Pass true to indicate auto-triggered
            }, 500);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();