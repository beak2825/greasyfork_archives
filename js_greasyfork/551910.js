// ==UserScript==
// @name         Session Review Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Analyze poker sessions with focus on 3-bet situations
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551910/Session%20Review%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/551910/Session%20Review%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // GLOBAL STATE
    // ============================================
    let db = null;
    let analysisResults = null;
    let panelOpen = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let heroName = null;
    let expandedSections = {
        heroMade: false,
        heroFaced: false,
        observed: false
    };

    // ============================================
    // HERO IDENTIFICATION
    // ============================================

    function extractHeroName() {
        const profileLink = document.querySelector('.menu-value___gLaLR');
        if (profileLink) {
            heroName = profileLink.textContent.trim();
            console.log(`📊 Session Review: Hero identified as "${heroName}"`);
            return heroName;
        }
        console.warn('Session Review: Could not find hero name on page');
        return null;
    }

    // ============================================
    // DATABASE CONNECTION
    // ============================================

    function connectToDatabase() {
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("pokerHandHistoryDB", 2);

            openRequest.onsuccess = function(event) {
                db = event.target.result;
                console.log('📊 Session Review: Connected to database');
                resolve(db);
            };

            openRequest.onerror = function(event) {
                console.error('Session Review: Database connection failed:', event.target.error);
                reject(event.target.error);
            };

            openRequest.onupgradeneeded = function(event) {
                console.warn('Session Review: Database not found. Run Hand Collector first.');
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
    // PARSING FUNCTIONS
    // ============================================

    function parseAction(text) {
        const action = {
            player: null,
            action: null,
            amount: null,
            raw: text
        };

        let match = text.match(/^(.+?)\s+posted small blind \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'small_blind';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+posted big blind \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'big_blind';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+folded/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'fold';
            return action;
        }

        match = text.match(/^(.+?)\s+checked/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'check';
            return action;
        }

        match = text.match(/^(.+?)\s+called \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'call';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+bet \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'bet';
            action.amount = parseInt(match[2].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+raised \$([0-9,]+) to \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'raise';
            action.amount = parseInt(match[3].replace(/,/g, ''));
            return action;
        }

        match = text.match(/^(.+?)\s+raised \$([0-9,]+)/);
        if (match) {
            action.player = match[1].trim();
            action.action = 'raise';
            action.amount = parseInt(match[2].replace(/,/g, ''));
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
    // 3-BET DETECTION
    // ============================================

    function extractBigBlind(messages) {
        for (const msg of messages) {
            const match = msg.text.match(/posted big blind \$([0-9,]+)/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        }
        return null;
    }

    function extractWinner(messages) {
        for (const msg of messages) {
            const match = msg.text.match(/^(.+?)\s+won \$([0-9,]+) with \[(.+?)\] \((.+?)\)/);
            if (match) {
                return {
                    player: match[1].trim(),
                    amount: parseInt(match[2].replace(/,/g, '')),
                    cards: match[3],
                    hand: match[4]
                };
            }
        }
        return null;
    }

    function getPlayerStack(tableData, playerName) {
        if (!tableData || !tableData.players) return null;

        // If this is the hero, look for "HERO" in tableData (Hand Collector stores hero as "HERO")
        const searchName = (playerName === heroName) ? 'HERO' : playerName;

        const player = tableData.players.find(p => p.name === searchName);
        if (!player) return null;

        const stackStr = player.stack.replace(/,/g, '');
        return parseInt(stackStr);
    }

    function detect3BetSituation(hand) {
        const streets = parseHandIntoStreets(hand);
        const preflopActions = streets.preflop;

        // Count raises
        const raises = preflopActions.filter(a => a.action === 'raise');

        // We need exactly 2 raises for a 3-bet situation (more = multi-3bet, skip)
        if (raises.length < 2) {
            return null; // No 3-bet
        }

        if (raises.length > 2) {
            // Check if it's a 4-bet situation (we'll handle this)
            // For now, we'll include 4-bet as outcome of 3-bet
        }

        const opener = raises[0];
        const threeBettor = raises[1];

        // Extract big blind
        const bigBlind = extractBigBlind(hand.messages);
        if (!bigBlind) {
            console.warn(`Hand ${hand.handNumber}: Could not find big blind`);
            return null;
        }

        // Get stacks
        const openerStack = getPlayerStack(hand.tableData, opener.player);
        const threeBettorStack = getPlayerStack(hand.tableData, threeBettor.player);

        let effectiveStackBB = null;
        if (openerStack && threeBettorStack) {
            const effectiveStack = Math.min(openerStack, threeBettorStack);
            effectiveStackBB = Math.round(effectiveStack / bigBlind);
        }

        // Calculate 3-bet size
        const threeBetSizeX = (threeBettor.amount / opener.amount).toFixed(1);

        // Determine outcome
        let outcome = 'unknown';
        const threeBettorIndex = preflopActions.findIndex(a =>
            a.player === threeBettor.player && a.action === 'raise'
        );

        // Look for opener's response after 3-bet
        const openerResponse = preflopActions.slice(threeBettorIndex + 1).find(a =>
            a.player === opener.player
        );

        if (openerResponse) {
            if (openerResponse.action === 'fold') outcome = 'fold';
            else if (openerResponse.action === 'call') outcome = 'call';
            else if (openerResponse.action === 'raise') outcome = '4-bet';
        } else {
            outcome = 'fold'; // No response = fold
        }

        // Extract winner
        const winner = extractWinner(hand.messages);

        return {
            handNumber: hand.handNumber,
            handId: hand.handId,
            startTime: hand.startTime,
            effectiveStackBB: effectiveStackBB,
            bigBlind: bigBlind,
            opener: opener.player,
            openAmount: opener.amount,
            threeBettor: threeBettor.player,
            threeBetAmount: threeBettor.amount,
            threeBetSizeX: parseFloat(threeBetSizeX),
            outcome: outcome,
            winner: winner,
            heroCards: hand.heroCards || null,
            tableData: hand.tableData,
            fullHand: hand
        };
    }

    function categorizeHand(handData) {
        // Check if we have hero name
        if (!heroName) {
            return 'observed';
        }

        // Check if hero was the 3-bettor
        if (handData.threeBettor === heroName) {
            return 'heroMade';
        }

        // Check if hero was the opener (facing 3-bet)
        if (handData.opener === heroName) {
            return 'heroFaced';
        }

        // Hero was at table but not involved in 3-bet
        return 'observed';
    }

    // ============================================
    // MAIN ANALYSIS
    // ============================================

    async function run3BetAnalysis() {
        const statusDiv = document.getElementById('reviewStatus');
        const resultsDiv = document.getElementById('reviewResults');

        statusDiv.innerHTML = '<div class="status-line status-info">Loading hands from database...</div>';
        resultsDiv.innerHTML = '';

        // Check if hero name was detected
        if (!heroName) {
            statusDiv.innerHTML += '<div class="status-line status-error">⚠️ Warning: Could not detect hero name. All hands will be marked as "Observed".</div>';
        }

        try {
            const allHands = await loadAllHands();

            if (allHands.length === 0) {
                statusDiv.innerHTML = '<div class="status-line status-error">No hands found in database.</div>';
                return;
            }

            // Apply date filter
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            let filteredHands = allHands;

            if (startDate) {
                const startTimestamp = new Date(startDate).getTime();
                filteredHands = filteredHands.filter(h => h.startTime >= startTimestamp);
            }

            if (endDate) {
                const endTimestamp = new Date(endDate).getTime() + (24 * 60 * 60 * 1000); // End of day
                filteredHands = filteredHands.filter(h => h.startTime < endTimestamp);
            }

            statusDiv.innerHTML += `<div class="status-line status-success">Analyzing ${filteredHands.length} hands...</div>`;

            const categorized = {
                heroMade: [],
                heroFaced: [],
                observed: []
            };

            let detected = 0;

            filteredHands.forEach(hand => {
                const situation = detect3BetSituation(hand);
                if (situation) {
                    detected++;
                    const category = categorizeHand(situation);
                    categorized[category].push(situation);
                }
            });

            // Sort all categories by most recent first
            Object.keys(categorized).forEach(key => {
                categorized[key].sort((a, b) => b.startTime - a.startTime);
            });

            // Calculate summary statistics
            const summary = {
                heroMade: calculateSummary(categorized.heroMade),
                heroFaced: calculateSummary(categorized.heroFaced),
                observed: calculateSummary(categorized.observed)
            };

            analysisResults = {
                totalHands: filteredHands.length,
                total3Bets: detected,
                categories: categorized,
                summary: summary
            };

            statusDiv.innerHTML += `<div class="status-line status-success">✅ Found ${detected} 3-bet situations</div>`;

            displayResults();

        } catch (error) {
            console.error('Analysis failed:', error);
            statusDiv.innerHTML += `<div class="status-line status-error">❌ Error: ${error.message}</div>`;
        }
    }

    function calculateSummary(hands) {
        if (hands.length === 0) {
            return {
                count: 0,
                avgStackBB: 0,
                avgSizeX: 0,
                outcomes: { fold: 0, call: 0, fourBet: 0 }
            };
        }

        const validStacks = hands.filter(h => h.effectiveStackBB !== null);
        const avgStackBB = validStacks.length > 0
            ? Math.round(validStacks.reduce((sum, h) => sum + h.effectiveStackBB, 0) / validStacks.length)
            : 0;

        const avgSizeX = (hands.reduce((sum, h) => sum + h.threeBetSizeX, 0) / hands.length).toFixed(1);

        const outcomes = {
            fold: hands.filter(h => h.outcome === 'fold').length,
            call: hands.filter(h => h.outcome === 'call').length,
            fourBet: hands.filter(h => h.outcome === '4-bet').length
        };

        return {
            count: hands.length,
            avgStackBB: avgStackBB,
            avgSizeX: parseFloat(avgSizeX),
            outcomes: outcomes
        };
    }

    // ============================================
    // UI DISPLAY
    // ============================================

    function displayResults() {
        if (!analysisResults) return;

        const resultsDiv = document.getElementById('reviewResults');

        let html = `
            <div class="results-summary">
                <div class="summary-title">📊 3-BET ANALYSIS SUMMARY</div>
                <div class="summary-line">Analyzed ${analysisResults.totalHands} hands</div>
                <div class="summary-line">Found ${analysisResults.total3Bets} 3-bet situations</div>
                <div style="margin-top: 12px; text-align: center;">
                    <button class="review-btn review-btn-export" id="exportCSVBtn">
                        📥 Export to CSV
                    </button>
                </div>
            </div>
        `;

        // Hero Made 3-Bet Section
        html += createCategorySection(
            'heroMade',
            '🎯 Hero Made 3-Bet',
            analysisResults.categories.heroMade,
            analysisResults.summary.heroMade
        );

        // Hero Faced 3-Bet Section
        html += createCategorySection(
            'heroFaced',
            '🛡️ Hero Faced 3-Bet',
            analysisResults.categories.heroFaced,
            analysisResults.summary.heroFaced
        );

        // Observed Section
        html += createCategorySection(
            'observed',
            '👁️ Observed 3-Bets',
            analysisResults.categories.observed,
            analysisResults.summary.observed
        );

        resultsDiv.innerHTML = html;

        // Attach click handlers
        attachSectionHandlers();

        // Attach export button handler
        document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);
    }

    function createCategorySection(categoryKey, title, hands, summary) {
        const isExpanded = expandedSections[categoryKey];
        const expandIcon = isExpanded ? '▼' : '▶';

        let html = `
            <div class="category-section">
                <div class="category-header" data-category="${categoryKey}">
                    <span class="expand-icon">${expandIcon}</span>
                    <span class="category-title">${title}: ${summary.count} hands</span>
                </div>
                <div class="category-summary">
        `;

        if (summary.count > 0) {
            html += `<div class="summary-stat">• Avg stack: ${summary.avgStackBB} BB</div>`;
            html += `<div class="summary-stat">• Avg 3-bet size: ${summary.avgSizeX}x</div>`;

            if (categoryKey === 'heroFaced' && summary.count > 0) {
                html += `<div class="summary-stat">• Folded: ${summary.outcomes.fold}, Called: ${summary.outcomes.call}, 4-bet: ${summary.outcomes.fourBet}</div>`;
            } else if (summary.outcomes.fold + summary.outcomes.call + summary.outcomes.fourBet > 0) {
                html += `<div class="summary-stat">• Outcomes - Fold: ${summary.outcomes.fold}, Call: ${summary.outcomes.call}, 4-bet: ${summary.outcomes.fourBet}</div>`;
            }
        }

        html += `</div>`;

        if (isExpanded && hands.length > 0) {
            html += `<div class="hands-list">`;
            hands.forEach(hand => {
                html += createHandCard(hand);
            });
            html += `</div>`;
        }

        html += `</div>`;

        return html;
    }

    function createHandCard(hand) {
        const dateStr = new Date(hand.startTime).toLocaleString();
        const stackInfo = hand.effectiveStackBB ? `${hand.effectiveStackBB} BB` : 'Unknown stack';

        let outcomeColor = '#94a3b8';
        if (hand.outcome === 'fold') outcomeColor = '#fca5a5';
        else if (hand.outcome === 'call') outcomeColor = '#93c5fd';
        else if (hand.outcome === '4-bet') outcomeColor = '#c084fc';

        let winnerInfo = '';
        if (hand.winner) {
            winnerInfo = `
                <div class="hand-detail">
                    🏆 Winner: ${hand.winner.player} with ${hand.winner.hand}
                </div>
            `;
        }

        const openAmountFormatted = formatCurrency(hand.openAmount);
        const threeBetAmountFormatted = formatCurrency(hand.threeBetAmount);

        return `
            <div class="hand-card">
                <div class="hand-card-header">
                    <span class="hand-number">Hand #${hand.handNumber}</span>
                    <span class="hand-stack">${stackInfo}</span>
                </div>
                <div class="hand-detail">
                    📈 ${hand.opener} opened to ${openAmountFormatted}
                </div>
                <div class="hand-detail">
                    🎲 ${hand.threeBettor} 3-bet to ${threeBetAmountFormatted} (${hand.threeBetSizeX}x)
                </div>
                <div class="hand-detail" style="color: ${outcomeColor};">
                    ➜ ${hand.opener} ${hand.outcome}
                </div>
                ${winnerInfo}
                <div class="hand-actions">
                    <button class="view-hand-btn" data-hand-id="${hand.handId}">View Full Hand</button>
                </div>
            </div>
        `;
    }

    function formatCurrency(amount) {
        if (amount >= 1000000000) {
            return '$' + (amount / 1000000000).toFixed(1) + 'B';
        } else if (amount >= 1000000) {
            return '$' + (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return '$' + (amount / 1000).toFixed(1) + 'K';
        }
        return '$' + amount.toLocaleString();
    }

    function attachSectionHandlers() {
        // Category expand/collapse
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function() {
                const category = this.dataset.category;
                expandedSections[category] = !expandedSections[category];
                displayResults();
            });
        });

        // View hand buttons
        document.querySelectorAll('.view-hand-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const handId = this.dataset.handId;
                showHandModal(handId);
            });
        });
    }

    function showHandModal(handId) {
        // Find the hand in results by handId (unique identifier)
        let hand = null;
        ['heroMade', 'heroFaced', 'observed'].forEach(category => {
            const found = analysisResults.categories[category].find(h => h.handId === handId);
            if (found) hand = found;
        });

        if (!hand) return;

        // Build starting stacks section
        let stacksHTML = '<div class="modal-section"><div class="modal-section-title">STARTING STACKS:</div>';

        if (hand.tableData && hand.tableData.players && hand.bigBlind) {
            hand.tableData.players.forEach(player => {
                const stackNum = parseInt(player.stack.replace(/,/g, ''));
                const stackBB = Math.round(stackNum / hand.bigBlind);
                const isHero = player.name === heroName || player.name === 'HERO';
                const displayName = isHero ? `${player.name} (Hero)` : player.name;

                stacksHTML += `
                    <div class="modal-detail-line">
                        ${displayName} (Seat ${player.seat}): ${player.stack} (${stackBB} BB)
                    </div>
                `;
            });
        } else {
            stacksHTML += '<div class="modal-detail-line">Stack data not available</div>';
        }
        stacksHTML += '</div>';

        // Build hole cards section
        let cardsHTML = '<div class="modal-section"><div class="modal-section-title">HOLE CARDS:</div>';

        // Hero's cards
        if (hand.heroCards && hand.heroCards.length > 0) {
            const heroCardsStr = hand.heroCards.map(c => `${c.rank}${c.suit}`).join(' ');
            cardsHTML += `
                <div class="modal-detail-line">
                    Hero (${heroName}): ${heroCardsStr}
                </div>
            `;
        }

        // Parse revealed cards from messages
        const revealedCards = [];
        hand.fullHand.messages.forEach(msg => {
            const match = msg.text.match(/^(.+?)\s+reveals \[(.+?)\]/);
            if (match) {
                const playerName = match[1].trim();
                const cards = match[2].trim();
                if (playerName !== heroName) {
                    revealedCards.push({ player: playerName, cards: cards });
                }
            }
        });

        revealedCards.forEach(reveal => {
            cardsHTML += `
                <div class="modal-detail-line">
                    ${reveal.player} (revealed): ${reveal.cards}
                </div>
            `;
        });

        if (!hand.heroCards && revealedCards.length === 0) {
            cardsHTML += '<div class="modal-detail-line">No hole cards available</div>';
        }

        cardsHTML += '</div>';

        // Build messages section
        let messagesHTML = '<div class="modal-section"><div class="modal-section-title">HAND MESSAGES:</div>';
        messagesHTML += hand.fullHand.messages.map(msg => `
            <div class="modal-message">
                <span class="msg-seq">${msg.sequence}.</span>
                <span class="msg-text">${msg.text}</span>
            </div>
        `).join('');
        messagesHTML += '</div>';

        const modal = document.createElement('div');
        modal.className = 'hand-modal';
        modal.innerHTML = `
            <div class="hand-modal-content">
                <div class="hand-modal-header">
                    <span class="hand-modal-title">Hand #${hand.handNumber} - Full Details</span>
                    <button class="hand-modal-close">×</button>
                </div>
                <div class="hand-modal-body">
                    ${stacksHTML}
                    ${cardsHTML}
                    ${messagesHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.hand-modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // ============================================
    // CSV EXPORT
    // ============================================

    function exportToCSV() {
        if (!analysisResults) {
            alert('No analysis results to export');
            return;
        }

        // CSV Header
        const headers = [
            'Hand Number',
            'Date/Time',
            'Category',
            'Effective Stack BB',
            'Big Blind',
            'Opener',
            'Open Amount',
            '3-Bettor',
            '3-Bet Amount',
            '3-Bet Size (x)',
            'Outcome',
            'Winner',
            'Winning Hand',
            'Hero Cards'
        ];

        let csvContent = headers.join(',') + '\n';

        // Combine all hands from all categories
        const allHands = [];

        // Add Hero Made 3-Bet hands
        analysisResults.categories.heroMade.forEach(hand => {
            allHands.push({ ...hand, category: 'Hero Made 3-Bet' });
        });

        // Add Hero Faced 3-Bet hands
        analysisResults.categories.heroFaced.forEach(hand => {
            allHands.push({ ...hand, category: 'Hero Faced 3-Bet' });
        });

        // Add Observed hands
        analysisResults.categories.observed.forEach(hand => {
            allHands.push({ ...hand, category: 'Observed' });
        });

        // Sort by most recent first
        allHands.sort((a, b) => b.startTime - a.startTime);

        // Build CSV rows
        allHands.forEach(hand => {
            const dateStr = new Date(hand.startTime).toLocaleString();
            const stackBB = hand.effectiveStackBB !== null ? hand.effectiveStackBB : 'Unknown';
            const bigBlind = hand.bigBlind || 'Unknown';
            const openAmount = hand.openAmount || '';
            const threeBetAmount = hand.threeBetAmount || '';
            const threeBetSize = hand.threeBetSizeX || '';
            const outcome = hand.outcome || '';
            const winner = hand.winner ? hand.winner.player : '';
            const winningHand = hand.winner ? `"${hand.winner.hand}"` : '';

            // Format hero cards
            let heroCards = '';
            if (hand.heroCards && hand.heroCards.length > 0) {
                heroCards = hand.heroCards.map(c => `${c.rank}${c.suit}`).join(' ');
            }

            const row = [
                hand.handNumber,
                `"${dateStr}"`,
                hand.category,
                stackBB,
                bigBlind,
                `"${hand.opener}"`,
                openAmount,
                `"${hand.threeBettor}"`,
                threeBetAmount,
                threeBetSize,
                outcome,
                `"${winner}"`,
                winningHand,
                `"${heroCards}"`
            ];

            csvContent += row.join(',') + '\n';
        });

        // Create download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `3bet-analysis-${timestamp}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`Exported ${allHands.length} hands to CSV`);
    }

    // ============================================
    // UI CREATION & STYLING
    // ============================================

    function createUI() {
        const controlBtn = document.createElement('button');
        controlBtn.id = 'sessionReviewBtn';
        controlBtn.className = 'session-review-btn';
        controlBtn.innerHTML = '📈 Session Review';
        controlBtn.onclick = togglePanel;

        const panel = document.createElement('div');
        panel.id = 'sessionReviewPanel';
        panel.className = 'session-review-panel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="review-header" id="reviewDragHandle">
                <span class="review-title">📈 Session Review Tool v1.0 (Drag to Move)</span>
                <button class="review-close-btn" id="reviewCloseBtn">×</button>
            </div>
            <div class="review-content">
                <div class="review-section">
                    <div class="review-label">Date Range Filter (Optional)</div>
                    <div class="date-filter-row">
                        <div class="date-input-group">
                            <label>Start Date:</label>
                            <input type="date" id="startDate" class="date-input">
                        </div>
                        <div class="date-input-group">
                            <label>End Date:</label>
                            <input type="date" id="endDate" class="date-input">
                        </div>
                    </div>
                    <div class="review-info">Leave dates empty to analyze all hands in database</div>
                </div>

                <div class="review-section">
                    <button class="review-btn review-btn-primary" id="run3BetBtn">
                        🎯 Run 3-Bet Analysis
                    </button>
                </div>

                <div id="reviewStatus" class="review-status"></div>

                <div id="reviewResults" class="review-results"></div>
            </div>
        `;

        document.body.appendChild(controlBtn);
        document.body.appendChild(panel);

        document.getElementById('reviewCloseBtn').onclick = togglePanel;
        document.getElementById('run3BetBtn').onclick = run3BetAnalysis;

        makeDraggable(panel, document.getElementById('reviewDragHandle'));
        injectStyles();

        updateDatabaseInfo();
    }

    async function updateDatabaseInfo() {
        try {
            const count = await getHandCount();
            console.log(`Session Review: ${count} hands available in database`);
        } catch (error) {
            console.warn('Session Review: Database not accessible yet');
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
            .session-review-btn {
                position: fixed;
                bottom: 140px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                color: #e94560;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                z-index: 999998;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
                transition: all 0.2s;
            }

            .session-review-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            }

            .session-review-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 900px;
                max-width: 95vw;
                height: 700px;
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

            .review-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .review-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .review-close-btn {
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

            .review-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .review-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .review-section {
                background: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 15px;
                border: 1px solid #0f3460;
            }

            .review-label {
                font-size: 14px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 10px;
            }

            .date-filter-row {
                display: flex;
                gap: 20px;
                margin-bottom: 10px;
            }

            .date-input-group {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .date-input-group label {
                font-size: 12px;
                color: #94a3b8;
            }

            .date-input {
                padding: 8px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #0f3460;
                border-radius: 4px;
                color: #e4e4e4;
                font-size: 13px;
            }

            .review-info {
                font-size: 11px;
                color: #94a3b8;
                font-style: italic;
            }

            .review-btn {
                width: 100%;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: all 0.2s;
            }

            .review-btn-primary {
                background: rgba(52, 211, 153, 0.3);
                border: 1px solid #34d399;
                color: #6ee7b7;
            }

            .review-btn-primary:hover {
                background: rgba(52, 211, 153, 0.5);
            }

            .review-btn-export {
                background: rgba(168, 85, 247, 0.3);
                border: 1px solid #a855f7;
                color: #e9d5ff;
                padding: 10px 20px;
                font-size: 13px;
            }

            .review-btn-export:hover {
                background: rgba(168, 85, 247, 0.5);
            }

            .review-status {
                background: rgba(0, 0, 0, 0.3);
                padding: 12px;
                border-radius: 6px;
                font-size: 12px;
                margin-bottom: 15px;
                min-height: 40px;
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

            .review-results {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                padding: 15px;
            }

            .results-summary {
                background: rgba(52, 211, 153, 0.1);
                border-left: 3px solid #34d399;
                padding: 12px;
                margin-bottom: 20px;
                border-radius: 4px;
            }

            .summary-title {
                font-size: 16px;
                font-weight: bold;
                color: #34d399;
                margin-bottom: 8px;
            }

            .summary-line {
                font-size: 13px;
                color: #cbd5e1;
                margin: 4px 0;
            }

            .category-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                margin-bottom: 15px;
                overflow: hidden;
            }

            .category-header {
                background: rgba(233, 69, 96, 0.2);
                padding: 12px 15px;
                cursor: pointer;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .category-header:hover {
                background: rgba(233, 69, 96, 0.3);
            }

            .expand-icon {
                color: #e94560;
                font-weight: bold;
                font-size: 12px;
            }

            .category-title {
                font-size: 14px;
                font-weight: bold;
                color: #e94560;
            }

            .category-summary {
                padding: 10px 15px;
                background: rgba(0, 0, 0, 0.2);
            }

            .summary-stat {
                font-size: 12px;
                color: #94a3b8;
                margin: 3px 0;
            }

            .hands-list {
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .hand-card {
                background: rgba(0, 0, 0, 0.3);
                border-left: 3px solid #60a5fa;
                border-radius: 4px;
                padding: 12px;
            }

            .hand-card-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .hand-number {
                font-weight: bold;
                color: #e94560;
                font-size: 13px;
            }

            .hand-stack {
                font-size: 12px;
                color: #34d399;
                font-weight: bold;
            }

            .hand-detail {
                font-size: 12px;
                color: #cbd5e1;
                margin: 4px 0;
                line-height: 1.4;
            }

            .hand-actions {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .view-hand-btn {
                background: rgba(59, 130, 246, 0.3);
                border: 1px solid #3b82f6;
                color: #93c5fd;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                transition: all 0.2s;
            }

            .view-hand-btn:hover {
                background: rgba(59, 130, 246, 0.5);
            }

            .hand-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000001;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .hand-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                width: 700px;
                max-width: 90vw;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
            }

            .hand-modal-header {
                background: #0f3460;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 8px 8px 0 0;
            }

            .hand-modal-title {
                font-weight: bold;
                font-size: 14px;
                color: #e94560;
            }

            .hand-modal-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #e4e4e4;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
            }

            .hand-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .hand-modal-body {
                padding: 20px;
                overflow-y: auto;
            }

            .modal-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .modal-section:last-child {
                border-bottom: none;
            }

            .modal-section-title {
                font-size: 13px;
                font-weight: bold;
                color: #e94560;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .modal-detail-line {
                font-size: 12px;
                color: #cbd5e1;
                margin: 4px 0;
                padding-left: 10px;
            }

            .modal-message {
                margin: 3px 0;
                padding: 4px 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
                font-size: 12px;
                line-height: 1.4;
            }

            .msg-seq {
                color: #e94560;
                font-weight: bold;
                margin-right: 6px;
            }

            .msg-text {
                color: #cbd5e1;
            }

            .review-content::-webkit-scrollbar,
            .hand-modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .review-content::-webkit-scrollbar-track,
            .hand-modal-body::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
            }

            .review-content::-webkit-scrollbar-thumb,
            .hand-modal-body::-webkit-scrollbar-thumb {
                background: rgba(233, 69, 96, 0.5);
                border-radius: 4px;
            }

            .review-content::-webkit-scrollbar-thumb:hover,
            .hand-modal-body::-webkit-scrollbar-thumb:hover {
                background: rgba(233, 69, 96, 0.7);
            }
        `;
        document.head.appendChild(style);
    }

    function togglePanel() {
        const panel = document.getElementById('sessionReviewPanel');
        panelOpen = !panelOpen;
        panel.style.display = panelOpen ? 'flex' : 'none';

        if (panelOpen) {
            updateDatabaseInfo();
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('📈 Session Review Tool v1.0');
        console.log('Analyzing poker sessions with focus on 3-bet situations');
        console.log('Waiting for poker table...');

        const checkForTable = setInterval(async () => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('Poker table found - initializing Session Review Tool');

                // Extract hero name from page
                extractHeroName();

                try {
                    await connectToDatabase();
                    console.log('Session Review: Database connected successfully');
                } catch (error) {
                    console.warn('Session Review: Database connection failed:', error);
                }

                createUI();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForTable), 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();