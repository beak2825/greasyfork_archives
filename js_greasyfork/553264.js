// ==UserScript==
// @name         Torn Poker - Four Color Board Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay panel with custom four-color board cards
// @author       You
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553264/Torn%20Poker%20-%20Four%20Color%20Board%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/553264/Torn%20Poker%20-%20Four%20Color%20Board%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================

    const COLORS = {
        clubs: '#00aa00',
        diamonds: '#0066cc',
        hearts: '#cc0000',
        spades: '#000000'
    };

    // ==========================================
    // CARD PARSING
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
        const suitName = match[1];
        const rank = match[2].toUpperCase();

        return { text: `${rank}${suit}`, suit: suitName, rank };
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
    // HIDE ORIGINAL CARDS
    // ==========================================

    function hideOriginalCards() {
        const style = document.createElement('style');
        style.id = 'hideOriginalBoardCards';
        style.textContent = `
            /* Hide the entire community cards area */
            .communityCards___cGHD3 {
                display: none !important;
                visibility: hidden !important;
            }

            /* Also hide card elements directly */
            .communityCards___cGHD3 .card___vA3PE {
                display: none !important;
            }

            .communityCards___cGHD3 .front___osz1p {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        // Also try direct DOM manipulation as backup
        setTimeout(() => {
            const boardArea = document.querySelector('.communityCards___cGHD3');
            if (boardArea) {
                boardArea.style.display = 'none';
                console.log('[Four Color Overlay] ✅ Original cards hidden via DOM');
            } else {
                console.log('[Four Color Overlay] ⚠️ Could not find board cards to hide');
            }
        }, 2000);

        console.log('[Four Color Overlay] Hide CSS injected');
    }

    // ==========================================
    // OVERLAY PANEL
    // ==========================================

    class BoardOverlay {
        constructor() {
            this.panel = null;
            this.lastCards = [];
            this.flopTimer = null;
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'fourColorBoardOverlay';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: transparent;
                padding: 10px;
                border-radius: 8px;
                display: flex;
                gap: 6px;
                z-index: 9999;
                cursor: move;
                user-select: none;
            `;

            document.body.appendChild(panel);
            this.setupDrag(panel);
            return panel;
        }

        renderCard(cardData) {
            const card = document.createElement('div');
            card.className = 'overlay-card';
            const color = COLORS[cardData.suit];
            card.style.cssText = `
                width: 49px;
                height: 69px;
                background: ${color};
                border: 1px solid ${color};
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
            `;
            card.innerHTML = `
                <div style="font-size: 36px; margin-bottom: -4px;">${cardData.rank}</div>
                <div>${cardData.text.slice(-1)}</div>
            `;
            return card;
        }

        renderCardBack() {
            const card = document.createElement('div');
            card.className = 'overlay-card-back';
            card.style.cssText = `
                width: 53px;
                height: 73px;
                background-color: transparent;
                background-image: url('https://www.torn.com/casino/holdem/images/cards/45x65_back.svg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                border: none;
                border-radius: 0px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;
            return card;
        }

        updateCards(cards) {
            if (!this.panel) return;

            // Clear existing cards
            this.panel.innerHTML = '';

            // Always show 5 slots
            this.panel.style.display = 'flex';

            // Render 5 card slots with layered back/front
            for (let i = 0; i < 5; i++) {
                const slot = this.renderCardSlot(cards[i]);
                this.panel.appendChild(slot);
            }

            this.lastCards = cards;
        }

        renderCardSlot(cardData) {
            // Container for each card slot
            const slot = document.createElement('div');
            slot.style.cssText = `
                position: relative;
                width: 53px;
                height: 73px;
            `;

            // Always add the card back (bottom layer)
            const back = this.renderCardBack();
            back.style.position = 'absolute';
            back.style.top = '0';
            back.style.left = '0';
            slot.appendChild(back);

            // Add card front on top if card exists
            if (cardData) {
                const front = this.renderCard(cardData);
                front.style.position = 'absolute';
                front.style.top = '0';
                front.style.left = '0';
                slot.appendChild(front);
            }

            return slot;
        }

        setupDrag(element) {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            element.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = element.getBoundingClientRect();
                initialX = rect.left + rect.width / 2;
                initialY = rect.top + rect.height / 2;

                element.style.cursor = 'grabbing';
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newX = initialX + deltaX;
                const newY = initialY + deltaY;

                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.transform = 'translate(-50%, -50%)';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    element.style.cursor = 'move';
                }
            });
        }

        watchForCards() {
            const pokerWrapper = document.querySelector('.holdemWrapper___D71Gy');
            if (!pokerWrapper) {
                setTimeout(() => this.watchForCards(), 1000);
                return;
            }

            console.log('[Four Color Overlay] Watching for board cards');

            const checkAndUpdate = () => {
                const cards = getBoardCards();
                const cardsChanged = cards.length !== this.lastCards.length;

                if (!cardsChanged) return; // Exit early if no change

                console.log('[Four Color Overlay] Cards changed:', this.lastCards.length, '→', cards.length);

                // Check if this is the start of the flop (0 → 1+ cards)
                if (this.lastCards.length === 0 && cards.length > 0) {
                    console.log('[Four Color Overlay] Flop starting - waiting 2.5s for all cards...');

                    // Clear any existing timer
                    if (this.flopTimer) clearTimeout(this.flopTimer);

                    // Wait 2.5 seconds for all flop cards to appear
                    this.flopTimer = setTimeout(() => {
                        const finalCards = getBoardCards();
                        console.log('[Four Color Overlay] Showing batched flop:', finalCards.length, 'cards');
                        this.updateCards(finalCards);
                    }, 500);

                    return; // Don't update yet
                }

                // For turn and river, update immediately
                this.updateCards(cards);
            };

            const observer = new MutationObserver(() => {
                checkAndUpdate();
            });

            observer.observe(pokerWrapper, {
                childList: true,
                subtree: true
            });

            // Initial check
            checkAndUpdate();
        }

        start() {
            console.log('[Four Color Overlay] Starting...');
            this.panel = this.createPanel();
            this.watchForCards();
            console.log('[Four Color Overlay] Ready - Drag to position over board');
        }
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================

    function init() {
        console.log('[Four Color Overlay] Initializing...');

        // Hide original cards immediately
        hideOriginalCards();

        const checkForTable = setInterval(() => {
            const pokerTable = document.querySelector('.holdemWrapper___D71Gy');
            if (pokerTable) {
                clearInterval(checkForTable);
                console.log('[Four Color Overlay] Poker table found');

                const overlay = new BoardOverlay();
                overlay.start();
            }
        }, 1000);

        setTimeout(() => clearInterval(checkForTable), 20000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();