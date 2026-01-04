// ==UserScript==
// @name         Torn Blackjack Assist with Bot (Module)
// @namespace    torn.blackjack.assist.bot
// @version      4.0
// @description  Displays real-time basic strategy advice for Blackjack on Torn with optional auto-play bot
// @match        https://www.torn.com/page.php?sid=blackjack*
// @match        https://www.torn.com/pda.php*step=blackjack*
// @match        https://www.torn.com/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550590/Torn%20Blackjack%20Assist%20with%20Bot%20%28Module%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550590/Torn%20Blackjack%20Assist%20with%20Bot%20%28Module%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const globalWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    const MODULE_NAME = "BlackjackAssist";

    let active = false;
    let observer = null;
    let botEnabled = false;
    let autoPlayDelay = 2000; // 2 second delay between actions
    let betAmount = 10;
    let maxLossStreak = 5;
    let currentLossStreak = 0;
    let stopOnTokens = 5; // Stop when tokens reach this number
    let botStats = { wins: 0, losses: 0, totalHands: 0, startingTokens: 0, currentTokens: 0 };
    let lastConfirmationTime = 0; // Prevent rapid clicking on confirmations
    let ignoreConfirmationsUntil = 0; // Ignore confirmations for a period after clicking
    let lastActionTime = 0; // Prevent rapid actions
    let waitingForAction = false; // Flag to prevent multiple simultaneous actions

    // ================= Logging =================
    function log(msg, type = "info") {
        if (globalWindow.TornFramework?.log) {
            globalWindow.TornFramework.log(msg, type, MODULE_NAME);
        } else {
            console.log(`[${MODULE_NAME}] ${type.toUpperCase()}: ${msg}`);
        }
    }

    // ================= Strategy Tables =================
    const A = { HIT: 'Hit', STAND: 'Stand', DOUBLE: 'Double', SPLIT: 'Split' };

    const strategy = {
        hard: {
            8: {1:A.HIT,2:A.HIT,3:A.HIT,4:A.HIT,5:A.HIT,6:A.HIT,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            9: {1:A.HIT,2:A.DOUBLE,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            10: {1:A.DOUBLE,2:A.DOUBLE,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.DOUBLE,8:A.DOUBLE,9:A.DOUBLE,10:A.HIT,11:A.HIT},
            11: {1:A.DOUBLE,2:A.DOUBLE,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.DOUBLE,8:A.DOUBLE,9:A.DOUBLE,10:A.DOUBLE,11:A.DOUBLE},
            12: {1:A.HIT,2:A.HIT,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            13: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            14: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            15: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            16: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            17: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            18: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            19: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            20: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            21: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND}
        },
        soft: {
            13: {1:A.HIT,2:A.HIT,3:A.HIT,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            14: {1:A.HIT,2:A.HIT,3:A.HIT,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            15: {1:A.HIT,2:A.HIT,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            16: {1:A.HIT,2:A.HIT,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            17: {1:A.HIT,2:A.DOUBLE,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            18: {1:A.STAND,2:A.DOUBLE,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.STAND,7:A.STAND,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            19: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.DOUBLE,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            20: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            21: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND}
        },
        pair: {
            2: {1:A.HIT,2:A.HIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.SPLIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            3: {1:A.HIT,2:A.HIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.SPLIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            4: {1:A.HIT,2:A.HIT,3:A.HIT,4:A.HIT,5:A.SPLIT,6:A.SPLIT,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            5: {1:A.HIT,2:A.HIT,3:A.DOUBLE,4:A.DOUBLE,5:A.DOUBLE,6:A.DOUBLE,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            6: {1:A.HIT,2:A.SPLIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.HIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            7: {1:A.HIT,2:A.SPLIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.SPLIT,8:A.HIT,9:A.HIT,10:A.HIT,11:A.HIT},
            8: {1:A.SPLIT,2:A.SPLIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.SPLIT,8:A.SPLIT,9:A.SPLIT,10:A.SPLIT,11:A.SPLIT},
            9: {1:A.SPLIT,2:A.SPLIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.STAND,7:A.SPLIT,8:A.SPLIT,9:A.SPLIT,10:A.STAND,11:A.STAND},
            10: {1:A.STAND,2:A.STAND,3:A.STAND,4:A.STAND,5:A.STAND,6:A.STAND,7:A.STAND,8:A.STAND,9:A.STAND,10:A.STAND,11:A.STAND},
            11: {1:A.SPLIT,2:A.SPLIT,3:A.SPLIT,4:A.SPLIT,5:A.SPLIT,6:A.SPLIT,7:A.SPLIT,8:A.SPLIT,9:A.SPLIT,10:A.SPLIT,11:A.SPLIT}
        }
    };

    // ================= Manual Test Function =================
    function manualTest() {
        log("=== MANUAL TEST START ===", 'info');

        // Test button detection
        const hitArea = document.querySelector('area[data-step="hit"]');
        const standArea = document.querySelector('area[data-step="stand"]');
        log(`HIT area found: ${!!hitArea}, disabled: ${hitArea?.classList.contains('disabled')}`, 'info');
        log(`STAND area found: ${!!standArea}, disabled: ${standArea?.classList.contains('disabled')}`, 'info');

        // Test game state
        const gameInProgress = isGameInProgress();
        const canTakeAction = canTakeAction();
        log(`Game in progress: ${gameInProgress}`, 'info');
        log(`Can take action: ${canTakeAction}`, 'info');

        // Test hand detection
        const playerHand = getHandInfo('.player-cards');
        const dealerCardEl = document.querySelector('.dealer-cards div[class*="card-"]:not(.card-back)');
        const dealerCardValue = getCardValue(dealerCardEl);
        log(`Player hand: ${playerHand.total} (${playerHand.cards.join(',')}), Dealer: ${dealerCardValue}`, 'info');

        // Try to execute action manually
        if (playerHand.total > 0 && dealerCardValue > 0) {
            const decision = getDecision(dealerCardValue, playerHand);
            log(`Manual decision: ${decision}`, 'info');

            // Force execute the action
            log("Attempting to execute action manually...", 'info');
            executeAction(decision);
        }

        log("=== MANUAL TEST END ===", 'info');
    }

    // Expose manual test to global scope for console access
    globalWindow.manualBlackjackTest = manualTest;
    function getCardValue(cardEl) {
        if (!cardEl) return 0;
        const match = cardEl.className.match(/card-\w+-(\w+)/);
        if (!match || !match[1]) return 0;
        const rank = match[1];
        if (['J','Q','K'].includes(rank)) return 10;
        if (rank==='A') return 11;
        return parseInt(rank,10);
    }

    function getHandInfo(containerSelector) {
        const cardsEls=document.querySelectorAll(`${containerSelector} div[class*="card-"]:not(.card-back)`);
        log(`Card detection for ${containerSelector}: found ${cardsEls.length} cards`, 'debug');
        cardsEls.forEach((card, i) => log(`Card ${i}: ${card.className}`, 'debug'));

        const cards=Array.from(cardsEls).map(getCardValue);
        let sum=cards.reduce((a,b)=>a+b,0);
        let aces=cards.filter(v=>v===11).length;
        while(sum>21 && aces-->0) sum-=10;
        const isPair=cards.length===2 && cards[0]===cards[1];
        return {cards,total:sum,isSoft:aces>0 && sum<=21,isPair};
    }

    function getDecision(dealerCardValue,playerHand){
        const dealerIndex=dealerCardValue===11?1:dealerCardValue;
        if(playerHand.isPair){
            const pairValue=playerHand.cards[0]===11?11:playerHand.cards[0];
            return strategy.pair[pairValue]?.[dealerIndex]||A.HIT;
        }
        if(playerHand.isSoft){
            return strategy.soft[playerHand.total]?.[dealerIndex]||A.STAND;
        }
        return strategy.hard[playerHand.total]?.[dealerIndex]||A.STAND;
    }

    function getCurrentTokens() {
        const tokenEl = document.querySelector('.bj-tokens');
        return tokenEl ? parseInt(tokenEl.textContent) : 0;
    }

    /*function isGameInProgress() {
        const dealerCards = document.querySelectorAll('.dealer-cards div[class*="card-"]');
        const playerCards = document.querySelectorAll('.player-cards div[class*="card-"]');
        return dealerCards.length > 0 || playerCards.length > 0;
    }*/

    function canOnlyStand() {
        // Check if only STAND is available (HIT is disabled)
        const hitArea = document.querySelector('area[data-step="hit"]');
        const standArea = document.querySelector('area[data-step="stand"]');
        const hitBtn = document.querySelector('a[data-step="hit"]');
        const standBtn = document.querySelector('a[data-step="stand"]');

        const hitDisabled = (hitArea && hitArea.classList.contains('disabled')) || (hitBtn && hitBtn.classList.contains('disabled'));
        const standEnabled = (standArea && !standArea.classList.contains('disabled')) || (standBtn && !standBtn.classList.contains('disabled'));

        return hitDisabled && standEnabled;
    }

    function canTakeAction() {
        // Check both desktop (area) and mobile (a) buttons
        const hitBtn = document.querySelector('area[data-step="hit"]:not(.disabled), a[data-step="hit"]:not(.disabled)');
        const standBtn = document.querySelector('area[data-step="stand"]:not(.disabled), a[data-step="stand"]:not(.disabled)');
        return hitBtn || standBtn;
    }

    function isGameInProgress() {
        const dealerCards = document.querySelectorAll('.dealer-cards div[class*="card-"]');
        const playerCards = document.querySelectorAll('.player-cards div[class*="card-"]');
        const tableCardsVisible = document.querySelector('.table-cards.bj-show');
        return tableCardsVisible && (dealerCards.length > 0 || playerCards.length > 0);
    }

    function isGameWaitingForNewBet() {
        const newBetWrap = document.querySelector('.new-bet-wrap.bj-show');
        const playBtn = document.querySelector('a[data-step="startGame"]:not(.disabled)');
        return newBetWrap && playBtn;
    }

    function isGameShowingResult() {
        const winLoseWrap = document.querySelector('.win-lose-wrap.bj-show');
        const continueBtn = document.querySelector('.continue');
        return winLoseWrap && continueBtn;
    }

    function isConfirmationDialogOpen() {
        // Check if the game status wrap is actually visible and has confirmation classes
        const gameStatusWrap = document.querySelector('.game-status-wrap');
        if (!gameStatusWrap) return false;

        // Check if the wrapper has l-confirm or r-confirm classes (indicates active confirmation)
        const hasConfirmClass = gameStatusWrap.classList.contains('l-confirm') || gameStatusWrap.classList.contains('r-confirm');
        if (!hasConfirmClass) return false;

        // Check if the wrapper is actually visible
        const style = window.getComputedStyle(gameStatusWrap);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
        if (!isVisible) return false;

        // Check if there's an active confirmation text with .act class
        const activeConfirmText = gameStatusWrap.querySelector('.txt.act');
        if (!activeConfirmText) return false;

        // Ensure YES button exists and is clickable
        const yesBtn = document.querySelector('.confirm-action.yes');
        if (!yesBtn) return false;

        log(`Confirmation dialog is truly active: ${activeConfirmText.className}`, 'debug');
        return true;
    }

    function clickConfirmYes() {
        const now = Date.now();
        if (now - lastConfirmationTime < 2000) {
            // Don't click again if we just clicked within last 2 seconds
            return false;
        }

        const yesBtn = document.querySelector('.confirm-action.yes');
        if (yesBtn) {
            yesBtn.click();
            lastConfirmationTime = now;
            log("Clicked YES to confirm action", 'info');
            return true;
        }
        return false;
    }

    function clickContinue() {
        const continueBtn = document.querySelector('.continue');
        if (continueBtn) {
            continueBtn.click();
            log("Clicked CONTINUE button", 'info');
            return true;
        }
        return false;
    }

    function getGameResult() {
        const resultEl = document.querySelector('.bj-wonState');
        return resultEl ? resultEl.textContent.trim() : '';
    }

    // ================= Bot Actions =================
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element && !element.classList.contains('disabled')) {
            element.click();
            return true;
        }
        return false;
    }

    function clickAction(action) {
        // Try desktop image map buttons first
        let selector = '';
        switch(action) {
            case 'hit':
                selector = 'area[data-step="hit"]:not(.disabled)';
                break;
            case 'stand':
                selector = 'area[data-step="stand"]:not(.disabled)';
                break;
            case 'doubleDown':
                selector = 'area[data-step="doubleDown"]:not(.disabled)';
                break;
            case 'split':
                selector = 'area[data-step="split"]:not(.disabled)';
                break;
        }

        if (clickElement(selector)) return true;

        // Fallback to mobile buttons
        switch(action) {
            case 'hit':
                return clickElement('a[data-step="hit"]:not(.disabled)');
            case 'stand':
                return clickElement('a[data-step="stand"]:not(.disabled)');
            case 'doubleDown':
                return clickElement('a[data-step="doubleDown"]:not(.disabled)');
            case 'split':
                return clickElement('a[data-step="split"]:not(.disabled)');
        }
        return false;
    }

    function setBetAmount(amount) {
        const betInput = document.querySelector('.bet.input-money[type="text"]');
        if (betInput) {
            betInput.value = amount.toString();
            betInput.dispatchEvent(new Event('input', { bubbles: true }));
            betInput.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }

    function startNewGame() {
        if (isGameWaitingForNewBet()) {
            setBetAmount(betAmount);
            setTimeout(() => {
                if (clickElement('a[data-step="startGame"]:not(.disabled)')) {
                    log(`Started new game with bet: $${betAmount}`, 'info');
                    return true;
                }
            }, 500);
        }
        return false;
    }

    function executeAction(action) {
        let clicked = false;
        let actionKey = '';

        switch(action) {
            case A.HIT:
                actionKey = 'hit';
                break;
            case A.STAND:
                actionKey = 'stand';
                break;
            case A.DOUBLE:
                // Check if double is available, otherwise hit
                if (document.querySelector('area[data-step="doubleDown"]:not(.disabled), a[data-step="doubleDown"]:not(.disabled)')) {
                    actionKey = 'doubleDown';
                } else {
                    actionKey = 'hit';
                    action = A.HIT; // Update action for logging
                }
                break;
            case A.SPLIT:
                // Check if split is available, otherwise hit
                if (document.querySelector('area[data-step="split"]:not(.disabled), a[data-step="split"]:not(.disabled)')) {
                    actionKey = 'split';
                } else {
                    actionKey = 'hit';
                    action = A.HIT; // Update action for logging
                }
                break;
        }

        if (actionKey) {
            clicked = clickAction(actionKey);
        }

        if (clicked) {
            log(`Bot executed: ${action}`, 'success');
        } else {
            log(`Bot failed to execute: ${action} (button not available)`, 'warning');
        }
        return clicked;
    }

    function updateBotStats() {
        const currentTokens = getCurrentTokens();
        if (botStats.startingTokens === 0) {
            botStats.startingTokens = currentTokens;
        }
        botStats.currentTokens = currentTokens;

        // Check for game results on the result screen
        if (isGameShowingResult()) {
            const resultEl = document.querySelector('.bj-wonState');
            const msgEl = document.querySelector('.wl-msg span');

            if (resultEl && msgEl) {
                const result = resultEl.textContent.trim();
                const msg = msgEl.textContent.trim();

                log(`Game result: ${msg} - ${result}`, 'info');

                botStats.totalHands++;
                if (msg.includes('WIN') || msg.includes('BLACKJACK') || result.includes('won')) {
                    botStats.wins++;
                    currentLossStreak = 0;
                } else if (msg.includes('BUST') || msg.includes('LOSE') || result.includes('lost') || result.includes('higher than 21')) {
                    botStats.losses++;
                    currentLossStreak++;
                }
            }
        }
    }

    function shouldStopBot() {
        const currentTokens = getCurrentTokens();

        if (currentTokens <= stopOnTokens) {
            log(`Bot stopped: Tokens reached minimum (${currentTokens})`, 'warning');
            return true;
        }

        if (currentLossStreak >= maxLossStreak) {
            log(`Bot stopped: Max loss streak reached (${currentLossStreak})`, 'warning');
            return true;
        }

        return false;
    }

    // ================= Bot Logic =================
    function botTick() {
        if (!botEnabled || !active) return;

        updateBotStats();

        if (shouldStopBot()) {
            botEnabled = false;
            updateBotDisplay();
            return;
        }

        const now = Date.now();

        // Don't take any action if we're still waiting from the last action
        if (waitingForAction && (now - lastActionTime < autoPlayDelay)) {
            return;
        }
        waitingForAction = false;

        // Debug: Log current game state (but less frequently to reduce spam)
        const gameStates = {
            confirmationDialog: now > ignoreConfirmationsUntil && isConfirmationDialogOpen(),
            resultScreen: isGameShowingResult(),
            newBetScreen: isGameWaitingForNewBet(),
            gameInProgress: isGameInProgress(),
            canTakeAction: canTakeAction()
        };

        // Check if there's a confirmation dialog open (with safety checks)
        if (gameStates.confirmationDialog) {
            log("Bot detected active confirmation dialog, clicking YES...", 'info');
            waitingForAction = true;
            lastActionTime = now;
            setTimeout(() => {
                if (clickConfirmYes()) {
                    ignoreConfirmationsUntil = Date.now() + 5000; // Ignore confirmations for 5 seconds
                }
            }, 1000);
            return;
        }

        // Check if game is showing results and needs continue click
        if (gameStates.resultScreen) {
            log("Bot detected result screen, clicking continue...", 'info');
            waitingForAction = true;
            lastActionTime = now;
            setTimeout(() => {
                clickContinue();
            }, autoPlayDelay);
            return;
        }

        // Check if we need to start a new game
        if (gameStates.newBetScreen) {
            log("Bot detected new bet screen, starting game...", 'info');
            waitingForAction = true;
            lastActionTime = now;
            setTimeout(() => {
                startNewGame();
            }, autoPlayDelay);
            return;
        }

        // Check if we can take an action in current game
        if (gameStates.gameInProgress) {
            const dealerCardEl = document.querySelector('.dealer-cards div[class*="card-"]');
            const dealerCardValue = getCardValue(dealerCardEl);
            const playerHand = getHandInfo('.player-cards');

            if (dealerCardValue && playerHand.cards.length >= 2) {
                // Check if only STAND is available (common when player has 21 or game is ending)
                if (canOnlyStand()) {
                    log(`Only STAND available. Player total: ${playerHand.total}. Standing to end game.`, 'info');
                    waitingForAction = true;
                    lastActionTime = now;
                    setTimeout(() => {
                        executeAction(A.STAND);
                    }, autoPlayDelay);
                } else if (gameStates.canTakeAction) {
                    // Both HIT and STAND available - use strategy
                    if (playerHand.total === 21) {
                        // Player has 21 - should stand to win
                        log(`Player has 21! Standing to win.`, 'info');
                        waitingForAction = true;
                        lastActionTime = now;
                        setTimeout(() => {
                            executeAction(A.STAND);
                        }, autoPlayDelay);
                    } else if (playerHand.total < 21) {
                        // Normal play - use strategy
                        const decision = getDecision(dealerCardValue, playerHand);
                        log(`Strategy decision: ${decision} (Player: ${playerHand.total} vs Dealer: ${dealerCardValue})`, 'info');

                        waitingForAction = true;
                        lastActionTime = now;
                        setTimeout(() => {
                            executeAction(decision);
                        }, autoPlayDelay);
                    } else {
                        // Player busted (over 21) - usually auto-ends but stand if available
                        log(`Player busted (${playerHand.total}), waiting for game to end`, 'debug');
                    }
                } else {
                    // No buttons available - game is likely ending
                    log(`Game ending - no actions available. Player: ${playerHand.total}`, 'debug');
                }
            }
        }
    }

    // ================= UI =================
    function createInlineDisplay() {
        if (document.getElementById('bj-helper-inline')) return;
        const gameWrap = document.querySelector('.blackjack-wrap');
        if (!gameWrap) return;

        const container = document.createElement('div');
        container.id = 'bj-helper-inline';
        container.style.cssText = `
            margin-bottom:8px;
            padding:12px;
            background:rgba(55,178,77,0.05);
            border:1px solid #37b24d;
            border-radius:8px;
            font-family:monospace;
            font-size:14px;
            color:#495057;
        `;

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span id='bj-helper-advice-text' style="font-weight:bold;">---</span>
                <span id='bj-helper-hand-total'>Waiting for hand</span>
            </div>
            <div id="bj-bot-status" style="display:none;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:8px;margin-top:8px;">
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                    <div>Hands: <span id="bot-hands">0</span></div>
                    <div>Wins: <span id="bot-wins">0</span></div>
                    <div>Losses: <span id="bot-losses">0</span></div>
                </div>
                <div style="margin-top:4px;">
                    Tokens: <span id="bot-tokens">0</span> | Streak: <span id="bot-streak">0</span>
                </div>
            </div>
        `;

        gameWrap.parentNode.insertBefore(container, gameWrap);
    }

    function updateInlineDisplay(decision = '---', total = 0) {
        const container = document.getElementById('bj-helper-inline');
        if (!container) return;

        const adviceText = document.getElementById('bj-helper-advice-text');
        const handTotal = document.getElementById('bj-helper-hand-total');

        adviceText.textContent = botEnabled ? `🤖 ${decision}` : decision;
        handTotal.textContent = total > 0 ? `Hand: ${total}` : 'Waiting for hand';

        const colors = { Hit: '#ff6b6b', Stand: '#51cf66', Double: '#fcc419', Split: '#748ffc', '---': '#adb5bd' };
        adviceText.style.color = colors[decision] || '#212529';
    }

    function updateBotDisplay() {
        const statusDiv = document.getElementById('bj-bot-status');
        if (!statusDiv) return;

        statusDiv.style.display = botEnabled ? 'block' : 'none';

        if (botEnabled) {
            document.getElementById('bot-hands').textContent = botStats.totalHands;
            document.getElementById('bot-wins').textContent = botStats.wins;
            document.getElementById('bot-losses').textContent = botStats.losses;
            document.getElementById('bot-tokens').textContent = botStats.currentTokens;
            document.getElementById('bot-streak').textContent = currentLossStreak;
        }
    }

    // ================= Main Observer =================
    function mainObserverCallback() {
        const dealerCardEl = document.querySelector('.dealer-cards div[class*="card-"]');
        const dealerCardValue = getCardValue(dealerCardEl);
        const playerHand = getHandInfo('.player-cards');
        const canTakeAction = document.querySelector('a[data-step="hit"]:not(.disabled), a[data-step="stand"]:not(.disabled)');

        if (!dealerCardValue || playerHand.cards.length < 2 || !canTakeAction || playerHand.total >= 21) {
            updateInlineDisplay('---');
        } else {
            const decision = getDecision(dealerCardValue, playerHand);
            updateInlineDisplay(decision, playerHand.total);
        }

        updateBotDisplay();

        // Run bot logic
        if (botEnabled) {
            botTick();
        }
    }

    // ================= Lifecycle =================
    function start() {
        if (active) return;
        log("Starting module", "success");
        const gameContainer = document.querySelector('.blackjack, .blackjack-wrap');
        if (!gameContainer) {
            log("Blackjack game not found", "warning");
            return;
        }
        createInlineDisplay();
        observer = new MutationObserver(mainObserverCallback);
        observer.observe(gameContainer, { childList: true, subtree: true });
        mainObserverCallback();
        active = true;
    }

    function stop() {
        if (!active) return;
        log("Stopping module", "warning");
        botEnabled = false;
        if (observer) observer.disconnect();
        const overlay = document.getElementById('bj-helper-inline');
        if (overlay) overlay.remove();
        active = false;
    }

    function toggleBot() {
        botEnabled = !botEnabled;
        if (botEnabled) {
            // Reset stats when starting bot
            botStats = { wins: 0, losses: 0, totalHands: 0, startingTokens: getCurrentTokens(), currentTokens: getCurrentTokens() };
            currentLossStreak = 0;
            log("Bot enabled", "success");
        } else {
            log("Bot disabled", "warning");
        }
        updateBotDisplay();
    }

    function isActive() { return active; }

    // ================= Menu =================
    const menuSection = `
        <h4 style='margin:0 0 8px 0;color:#f59f00;'>${MODULE_NAME}</h4>
        <label style='display:flex;align-items:center;cursor:pointer;margin-bottom:8px;'>
            <input type='checkbox' id='toggle-${MODULE_NAME}'>
            <span style='margin-left:6px;'>Enable ${MODULE_NAME}</span>
        </label>

        <div id="bot-controls" style="border-top:1px solid #444;padding-top:8px;margin-top:8px;">
            <label style='display:flex;align-items:center;cursor:pointer;margin-bottom:8px;'>
                <input type='checkbox' id='toggle-bot-${MODULE_NAME}'>
                <span style='margin-left:6px;color:#ff6b6b;font-weight:bold;'>🤖 Enable Auto-Play Bot</span>
            </label>

            <div style="margin-left:20px;font-size:11px;color:#ccc;">
                <div style="margin-bottom:4px;">
                    <label>Bet Amount: $</label>
                    <input type="number" id="bot-bet-amount" value="${betAmount}" style="width:80px;background:#333;color:white;border:1px solid #555;padding:2px;">
                </div>
                <div style="margin-bottom:4px;">
                    <label>Play Delay: </label>
                    <input type="number" id="bot-delay" value="${autoPlayDelay}" style="width:60px;background:#333;color:white;border:1px solid #555;padding:2px;">ms
                </div>
                <div style="margin-bottom:4px;">
                    <label>Max Loss Streak: </label>
                    <input type="number" id="bot-max-losses" value="${maxLossStreak}" style="width:40px;background:#333;color:white;border:1px solid #555;padding:2px;">
                </div>
                <div style="margin-bottom:4px;">
                    <label>Stop at Tokens: </label>
                    <input type="number" id="bot-stop-tokens" value="${stopOnTokens}" style="width:40px;background:#333;color:white;border:1px solid #555;padding:2px;">
                </div>
            </div>
        </div>
    `;

    function setupMenuEvents() {
        const moduleToggle = document.getElementById(`toggle-${MODULE_NAME}`);
        const botToggle = document.getElementById(`toggle-bot-${MODULE_NAME}`);
        const betAmountInput = document.getElementById('bot-bet-amount');
        const delayInput = document.getElementById('bot-delay');
        const maxLossesInput = document.getElementById('bot-max-losses');
        const stopTokensInput = document.getElementById('bot-stop-tokens');

        if (moduleToggle) {
            moduleToggle.checked = active;
            moduleToggle.onchange = () => moduleToggle.checked ? start() : stop();
        }

        if (botToggle) {
            botToggle.checked = botEnabled;
            botToggle.onchange = () => toggleBot();
        }

        if (betAmountInput) {
            betAmountInput.onchange = () => {
                betAmount = parseInt(betAmountInput.value) || 1000;
                log(`Bot bet amount set to: $${betAmount}`, 'info');
            };
        }

        if (delayInput) {
            delayInput.onchange = () => {
                autoPlayDelay = parseInt(delayInput.value) || 2000;
                log(`Bot delay set to: ${autoPlayDelay}ms`, 'info');
            };
        }

        if (maxLossesInput) {
            maxLossesInput.onchange = () => {
                maxLossStreak = parseInt(maxLossesInput.value) || 5;
                log(`Max loss streak set to: ${maxLossStreak}`, 'info');
            };
        }

        if (stopTokensInput) {
            stopTokensInput.onchange = () => {
                stopOnTokens = parseInt(stopTokensInput.value) || 5;
                log(`Stop tokens set to: ${stopOnTokens}`, 'info');
            };
        }
    }

    // ================= Registration =================
    function registerModule() {
        try {
            globalWindow.TornFramework.registerModule({
                name: MODULE_NAME,
                version: "4.0",
                description: "Blackjack strategy helper with auto-play bot",
                menuSection,
                initialize: () => { start(); setupMenuEvents(); },
                cleanup: stop,
                isActive
            });
            log("Module registered with TornFramework", "success");
        } catch (err) {
            console.error(`[${MODULE_NAME}] Failed to register:`, err);
            log("Running standalone fallback", "warning");
            start();
        }
    }

    if (globalWindow.TornFramework?.initialized) {
        registerModule();
    } else {
        const wait = setInterval(() => {
            if (globalWindow.TornFramework?.initialized) {
                clearInterval(wait);
                registerModule();
            }
        }, 500);
    }
})();