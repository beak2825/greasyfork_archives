// ==UserScript==
// @name         Torn Poker - Board Analyzer v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Educational board texture analyzer - always visible
// @author       DuckOfDestiny
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553185/Torn%20Poker%20-%20Board%20Analyzer%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/553185/Torn%20Poker%20-%20Board%20Analyzer%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // CARD PARSING (Reused from equity calc)
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

    function getBoardCards() {
        const cardElements = document.querySelectorAll(
            '.communityCards___cGHD3 .front___osz1p > div'
        );

        return Array.from(cardElements)
            .map(el => extractCardValue(el.className))
            .filter(Boolean);
    }

    // ==========================================
    // BOARD ANALYSIS
    // ==========================================

    function analyzeBoardTexture(boardCards) {
        if (boardCards.length < 3) {
            return {
                texture: 'none',
                flushPossible: false,
                straightPossible: false,
                paired: false,
                coordination: 'none',
                riskLevel: 'none'
            };
        }

        // Flush analysis
        const suitCounts = {};
        boardCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                suitCounts[parsed.suit] = (suitCounts[parsed.suit] || 0) + 1;
            }
        });

        const maxSuitCount = Math.max(...Object.values(suitCounts));
        const flushSuit = Object.entries(suitCounts).find(([s, c]) => c === maxSuitCount)?.[0];

        let flushStatus = 'none';
        if (maxSuitCount >= 5) flushStatus = 'made';
        else if (maxSuitCount === 4) flushStatus = 'four-flush';
        else if (maxSuitCount === 3) flushStatus = 'draw';
        else if (maxSuitCount === 2) flushStatus = 'two-tone';

        // Pairing analysis
        const rankCounts = {};
        boardCards.forEach(card => {
            const parsed = parseCard(card);
            if (parsed) {
                rankCounts[parsed.rank] = (rankCounts[parsed.rank] || 0) + 1;
            }
        });

        const maxRankCount = Math.max(...Object.values(rankCounts));
        let pairStatus = 'none';
        if (maxRankCount === 4) pairStatus = 'quads';
        else if (maxRankCount === 3) pairStatus = 'trips';
        else if (maxRankCount === 2) {
            const pairs = Object.values(rankCounts).filter(c => c === 2).length;
            pairStatus = pairs >= 2 ? 'two-pair' : 'paired';
        }

        // Straight analysis
        const ranks = boardCards.map(c => getRankIndex(parseCard(c).rank)).sort((a, b) => a - b);
        const uniqueRanks = [...new Set(ranks)];

        let straightStatus = 'none';
        let connections = 0;

        // Check for made straight
        for (let i = 0; i <= uniqueRanks.length - 5; i++) {
            if (uniqueRanks[i + 4] - uniqueRanks[i] === 4) {
                straightStatus = 'made';
                break;
            }
        }

        // Check for wheel
        const wheelRanks = [getRankIndex('A'), getRankIndex('2'), getRankIndex('3'), getRankIndex('4'), getRankIndex('5')];
        if (wheelRanks.every(r => uniqueRanks.includes(r))) {
            straightStatus = 'made';
        }

        if (straightStatus === 'none') {
            // Count connections for straight draws
            for (let i = 0; i < uniqueRanks.length - 1; i++) {
                const gap = uniqueRanks[i + 1] - uniqueRanks[i];
                if (gap <= 2) connections++;
            }

            if (connections >= 2) straightStatus = 'highly-connected';
            else if (connections >= 1) straightStatus = 'connected';
            else straightStatus = 'disconnected';
        }

        // Overall coordination
        let coordination = 'dry';
        if (straightStatus === 'highly-connected' && flushStatus === 'draw') {
            coordination = 'wet';
        } else if (straightStatus === 'highly-connected' || flushStatus === 'draw') {
            coordination = 'connected';
        }

        // Risk level
        let riskLevel = 'low';
        if (coordination === 'wet' || straightStatus === 'made' || flushStatus === 'made' || flushStatus === 'four-flush') {
            riskLevel = 'high';
        } else if (coordination === 'connected' || pairStatus === 'paired' || pairStatus === 'two-pair') {
            riskLevel = 'medium';
        }

        return {
            texture: coordination,
            flushStatus,
            flushSuit,
            straightStatus,
            pairStatus,
            coordination,
            riskLevel,
            connections
        };
    }

    function generateBoardSummary(boardCards, analysis) {
        const possibleHands = [];
        const availableDraws = [];

        // Possible made hands
        if (analysis.straightStatus === 'made') {
            possibleHands.push('Straight');
        }
        if (analysis.flushStatus === 'made') {
            possibleHands.push('Flush');
        }
        if (analysis.pairStatus === 'quads') {
            possibleHands.push('Quads');
        }
        if (analysis.pairStatus === 'trips') {
            possibleHands.push('Full House or Trips');
        }
        if (analysis.pairStatus === 'two-pair') {
            possibleHands.push('Full House or Two Pair');
        }
        if (analysis.pairStatus === 'paired') {
            possibleHands.push('Set or Pair');
        }

        // Available draws
        if (analysis.flushStatus === 'draw') {
            availableDraws.push(`Flush draw (${analysis.flushSuit})`);
        }
        if (analysis.flushStatus === 'four-flush') {
            availableDraws.push(`Four-flush (${analysis.flushSuit})`);
        }
        if (analysis.straightStatus === 'highly-connected') {
            availableDraws.push('Multiple straight draws');
        }
        if (analysis.straightStatus === 'connected') {
            availableDraws.push('Straight draws');
        }

        return {
            possibleHands: possibleHands.length > 0 ? possibleHands : ['Top pair, overpairs'],
            availableDraws: availableDraws.length > 0 ? availableDraws : ['No obvious draws'],
            texture: analysis.coordination,
            riskLevel: analysis.riskLevel
        };
    }

    // ==========================================
    // UI
    // ==========================================

    class BoardAnalyzer {
        constructor() {
            this.ui = null;
            this.minimizedBtn = null;
            this.isMinimized = false;
            this.currentStreet = 'preflop';
            this.stateObserver = null;
            this.lastBoardCards = [];
        }

        createUI() {
            // Load saved position or use defaults
            const savedPos = this.loadPosition();
            const defaultPos = { top: 20, right: 400, left: null };
            const pos = savedPos || defaultPos;

            const container = document.createElement('div');
            container.id = 'boardAnalyzer';

            // Build position string
            let positionStyle = `position: fixed;`;
            if (pos.left !== null) {
                positionStyle += `left: ${pos.left}px;`;
            } else {
                positionStyle += `right: ${pos.right}px;`;
            }
            positionStyle += `top: ${pos.top}px;`;

            container.style.cssText = `
                ${positionStyle}
                width: 320px;
                background: rgba(20,20,20,0.95);
                border: 2px solid #8b5cf6;
                border-radius: 8px;
                font-family: 'Segoe UI', monospace;
                z-index: 9998;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                color: #e4e4e4;
                cursor: move;
            `;
            container.innerHTML = '<div id="boardAnalyzerContent"></div>';
            document.body.appendChild(container);

            const minBtn = document.createElement('div');
            minBtn.id = 'boardAnalyzerMinimized';
            minBtn.innerHTML = '🎴';
            minBtn.title = 'Board Analyzer';
            minBtn.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                border: 2px solid #8b5cf6;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
                z-index: 9997;
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
                this.expand();
            });
            document.body.appendChild(minBtn);

            this.setupDrag(container);
            this.minimizedBtn = minBtn;
            return container;
        }

        updateDisplay(boardCards, street) {
            const content = document.getElementById('boardAnalyzerContent');
            if (!content) return;

            // Store current board for reference
            this.lastBoardCards = boardCards;

            if (boardCards.length < 3) {
                content.innerHTML = `
                    <div class="ba-panel">
                        <div class="ba-header">
                            <span>BOARD ANALYZER</span>
                            <button class="ba-minimize" id="baMinimize">−</button>
                        </div>
                        <div class="ba-waiting">
                            Waiting for flop...
                        </div>
                    </div>
                `;
                this.attachMinimizeHandler();
                return;
            }

            const analysis = analyzeBoardTexture(boardCards);
            const summary = generateBoardSummary(boardCards, analysis);

            const riskColor = {
                'low': '#22c55e',
                'medium': '#eab308',
                'high': '#ef4444'
            }[summary.riskLevel];

            const riskBg = {
                'low': 'rgba(34, 197, 94, 0.1)',
                'medium': 'rgba(234, 179, 8, 0.1)',
                'high': 'rgba(239, 68, 68, 0.1)'
            }[summary.riskLevel];

            content.innerHTML = `
                <div class="ba-panel">
                    <div class="ba-header">
                        <span>BOARD ANALYZER</span>
                        <button class="ba-minimize" id="baMinimize">−</button>
                    </div>

                    <div class="ba-board">
                        <div class="ba-label">Board (${street}):</div>
                        <div class="ba-cards">${boardCards.join(' ')}</div>
                    </div>

                    <div class="ba-section">
                        <div class="ba-section-title">TEXTURE</div>
                        <div class="ba-texture">${summary.texture.toUpperCase()}</div>
                    </div>

                    <div class="ba-section">
                        <div class="ba-section-title">POSSIBLE HANDS</div>
                        <div class="ba-list">
                            ${summary.possibleHands.map(h => `<div>• ${h}</div>`).join('')}
                        </div>
                    </div>

                    <div class="ba-section">
                        <div class="ba-section-title">AVAILABLE DRAWS</div>
                        <div class="ba-list">
                            ${summary.availableDraws.map(d => `<div>• ${d}</div>`).join('')}
                        </div>
                    </div>

                    <div class="ba-risk" style="background: ${riskBg}; border-color: ${riskColor};">
                        <span style="color: ${riskColor};">Risk Level: ${summary.riskLevel.toUpperCase()}</span>
                    </div>
                </div>
            `;

            this.attachMinimizeHandler();
        }

        attachMinimizeHandler() {
            const minBtn = document.getElementById('baMinimize');
            if (minBtn) {
                minBtn.onclick = () => this.minimize();
            }
        }

        setupDrag(container) {
            let isDragging = false;
            let startX = 0, startY = 0;
            let initialLeft = 0, initialTop = 0;

            container.addEventListener('mousedown', (e) => {
                // Don't drag if clicking minimize button
                if (e.target.id === 'baMinimize') return;

                // Only drag from header area
                if (e.target.closest('.ba-header')) {
                    isDragging = true;

                    const rect = container.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;

                    startX = e.clientX;
                    startY = e.clientY;

                    container.style.cursor = 'grabbing';
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newLeft = Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - 320));
                const newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - 200));

                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                container.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    container.style.cursor = 'move';

                    // Save position
                    this.savePosition();
                }
            });
        }

        savePosition() {
            if (!this.ui) return;

            const rect = this.ui.getBoundingClientRect();
            const position = {
                top: rect.top,
                left: rect.left,
                right: null
            };

            try {
                localStorage.setItem('boardAnalyzerPosition', JSON.stringify(position));
                console.log('[Board Analyzer] Position saved:', position);
            } catch (e) {
                console.warn('[Board Analyzer] Could not save position:', e);
            }
        }

        loadPosition() {
            try {
                const saved = localStorage.getItem('boardAnalyzerPosition');
                if (saved) {
                    const position = JSON.parse(saved);
                    console.log('[Board Analyzer] Position loaded:', position);
                    return position;
                }
            } catch (e) {
                console.warn('[Board Analyzer] Could not load position:', e);
            }
            return null;
        }

        minimize() {
            console.log('[Board Analyzer] Minimizing');
            this.isMinimized = true;
            if (this.ui) this.ui.style.display = 'none';
            if (this.minimizedBtn) this.minimizedBtn.style.display = 'flex';
        }

        expand() {
            console.log('[Board Analyzer] Expanding');
            this.isMinimized = false;
            if (this.ui) this.ui.style.display = 'block';
            if (this.minimizedBtn) this.minimizedBtn.style.display = 'none';

            // Refresh display with last known board
            if (this.lastBoardCards.length > 0) {
                this.updateDisplay(this.lastBoardCards, this.currentStreet);
            }
        }

        analyzeCurrentBoard(street) {
            console.log('[Board Analyzer] Analyzing street:', street);
            this.currentStreet = street;
            const boardCards = getBoardCards();
            console.log('[Board Analyzer] Cards found:', boardCards.length, boardCards);

            // Always update, even if minimized (keeps state fresh)
            this.updateDisplay(boardCards, street);

            // If minimized, don't show yet
            if (!this.isMinimized && this.ui) {
                this.ui.style.display = 'block';
            }
        }

        reset() {
            console.log('[Board Analyzer] Resetting for new hand');
            this.currentStreet = 'preflop';
            this.lastBoardCards = [];
            this.updateDisplay([], 'preflop');
        }

        startStateObserver() {
            // Watch the entire poker wrapper for state messages
            const pokerWrapper = document.querySelector('.holdemWrapper___D71Gy');
            if (!pokerWrapper) {
                console.log('[Board Analyzer] Poker wrapper not found, retrying...');
                setTimeout(() => this.startStateObserver(), 2000);
                return;
            }

            console.log('[Board Analyzer] Starting observer on poker wrapper');

            const handleStateMessage = (text) => {
                console.log('[Board Analyzer] State message detected:', text.substring(0, 50));

                if (text.includes('The flop:')) {
                    setTimeout(() => this.analyzeCurrentBoard('flop'), 1200);
                }
                else if (text.includes('The turn:')) {
                    setTimeout(() => this.analyzeCurrentBoard('turn'), 500);
                }
                else if (text.includes('The river:')) {
                    setTimeout(() => this.analyzeCurrentBoard('river'), 500);
                }
                else if (text.includes('Game') && text.includes('started')) {
                    this.reset();
                }
            };

            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // Check if this node is a state message
                            if (node.classList?.contains('state___dS3_T')) {
                                handleStateMessage(node.textContent);
                            }

                            // Check if any children are state messages
                            if (node.querySelectorAll) {
                                const stateMessages = node.querySelectorAll('.state___dS3_T');
                                stateMessages.forEach(msg => {
                                    handleStateMessage(msg.textContent);
                                });
                            }
                        }
                    });
                });
            });

            observer.observe(pokerWrapper, {
                childList: true,
                subtree: true
            });

            this.stateObserver = observer;
            console.log('[Board Analyzer] Observer started successfully');
        }

        start() {
            console.log('[Board Analyzer] v1.0 - Event-driven analysis');
            this.ui = this.createUI();
            this.updateDisplay([], 'preflop');
            this.startStateObserver();
            console.log('[Board Analyzer] Ready');
        }

        stop() {
            if (this.stateObserver) {
                this.stateObserver.disconnect();
                console.log('[Board Analyzer] Observer disconnected');
            }
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
            .ba-panel {
                padding: 12px;
            }

            .ba-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #8b5cf6;
                font-weight: bold;
                font-size: 12px;
                color: #a78bfa;
                cursor: move;
                user-select: none;
            }

            .ba-minimize {
                background: rgba(239, 68, 68, 0.3);
                border: 1px solid #ef4444;
                color: #fca5a5;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.2s;
            }

            .ba-minimize:hover {
                background: rgba(239, 68, 68, 0.5);
            }

            .ba-board {
                background: rgba(139, 92, 246, 0.1);
                border-left: 3px solid #8b5cf6;
                padding: 8px;
                border-radius: 4px;
                margin-bottom: 12px;
            }

            .ba-label {
                font-size: 10px;
                color: #94a3b8;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .ba-cards {
                font-size: 14px;
                font-weight: 600;
                color: #c4b5fd;
            }

            .ba-waiting {
                text-align: center;
                padding: 20px;
                color: #94a3b8;
                font-size: 12px;
            }

            .ba-section {
                margin-bottom: 10px;
            }

            .ba-section-title {
                font-size: 10px;
                font-weight: bold;
                color: #a78bfa;
                margin-bottom: 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .ba-texture {
                background: rgba(0, 0, 0, 0.3);
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                color: #e4e4e4;
                text-align: center;
            }

            .ba-list {
                background: rgba(0, 0, 0, 0.2);
                padding: 8px;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.6;
                color: #cbd5e1;
            }

            .ba-list div {
                margin: 2px 0;
            }

            .ba-risk {
                padding: 8px;
                border-radius: 6px;
                border: 2px solid;
                font-weight: bold;
                font-size: 12px;
                text-align: center;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    async function init() {
        console.log('[Board Analyzer] Torn Poker Board Analyzer v1.0');

        const checkForTable = setInterval(() => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('[Board Analyzer] Poker table found');

                injectStyles();
                window.boardAnalyzer = new BoardAnalyzer();
                window.boardAnalyzer.start();
            }
        }, 2000);

        setTimeout(() => {
            clearInterval(checkForTable);
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();