// ==UserScript==
// @name         Bullseye Timer
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Get the fastets time on Bullseye with your party
// @author       fibs
// @match        https://www.geoguessr.com/party
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/561037/Bullseye%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/561037/Bullseye%20Timer.meta.js
// ==/UserScript==

class RoundResult {
    constructor(startTime) {
        this.startTime = startTime;
        this.endTime = null;
    }

    setEndTime(endTime) {
        this.endTime = endTime;
    }

    getDuration() {
        if (this.startTime === null || this.endTime === null) {
            return null;
        }

        return this.endTime - this.startTime;
    }
}

(function() {
    'use strict';

    let waitingForRound = true;
    let roundResults = [];
    let currentRound = 0;
    let inGameTimerDisplay = null;
    let timerInterval = null;
    let finalBreakdownRendered = false;

    // Create timer display
    function createTimerDisplay() {
        const display = document.createElement('div');
        display.id = 'bullseye-timer';
        display.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        `;
        display.textContent = '00:00.0';
        document.body.appendChild(display);
        return display;
    }

    function renderFinalBreakdown() {

        console.count("Bullseye Timer: renderFinalBreakdown trigger check");

        const gameFinishedPointsHeader = document.querySelector('h2.game-finished_points__SMS4e');

        if (!gameFinishedPointsHeader) {
            return;
        }

        let summedDuration = 0;
        roundResults.forEach((roundResult) => {
            summedDuration += roundResult.getDuration();
        });

        gameFinishedPointsHeader.textContent += ' - ' + formatTime(summedDuration);

        const resultsTableHeader = document.querySelector('table.table_table__2zHet>thead>tr.table_tr__9PoZt');

        if (!resultsTableHeader) {
            return;
        }

        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Time';
        resultsTableHeader.appendChild(timeHeader);

        const resultsTableRows = document.querySelectorAll('table.table_table__2zHet>tbody>tr.table_tr__9PoZt');

        if (!resultsTableRows || resultsTableRows.length == 0) {
            return;
        }

        for (let i = 0; i < resultsTableRows.length; i++) {
            const roundResult = roundResults[i];
            const roundDuration = roundResult.getDuration();
            if (roundDuration) {
                const timeDisplay = document.createElement('td');
                timeDisplay.textContent = formatTime(roundDuration);
                resultsTableRows[i].appendChild(timeDisplay);
            }
        }

        finalBreakdownRendered = true;
    }

    // Format time as MM:SS.D
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const deciseconds = Math.floor((ms % 1000) / 100);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${deciseconds}`;
    }

    // Update timer display
    function updateTimer() {
        const currentRoundResult = roundResults[currentRound];
        if (currentRoundResult && inGameTimerDisplay) {
            const elapsed = Date.now() - currentRoundResult.startTime;
            inGameTimerDisplay.textContent = formatTime(elapsed);
        }
    }

    // Start the next round
    function startRound() {
        const currentRoundStartTime = Date.now();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 100);
        const roundResult = new RoundResult(currentRoundStartTime);
        roundResults.push(roundResult);
        if (inGameTimerDisplay) {
            inGameTimerDisplay.style.background = 'rgba(0, 0, 0, 0.8)';
        }
        console.log('Bullseye Timer: Round started');
    }

    // Stop the current round
    function stopRound() {
        console.log('Bullseye Timer: Stopping round...');
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        const currentRoundResult = roundResults[currentRound];
        if (currentRoundResult && inGameTimerDisplay) {
            const currentRoundEndTime = Date.now();
            currentRoundResult.endTime = currentRoundEndTime;
            currentRound++;
            const finalTime = currentRoundEndTime - currentRoundResult.startTime;
            console.log(`Bullseye Timer: Round completed in ${formatTime(finalTime)}`);

            // Make timer green
            inGameTimerDisplay.style.background = 'rgba(0, 150, 0, 0.8)';
        }
    }

    // The init function
    function init() {
        if (!inGameTimerDisplay) {
            inGameTimerDisplay = createTimerDisplay();
        }

        const observer = new MutationObserver((mutations) => {
            console.debug('Bullseye Timer: Mutation detected');

            // Look for game state changes
            // This is a simplified approach - you may need to adjust selectors

            const currentRoundResult = roundResults[currentRound];

            // Check if a new round started (guess button appears)
            const guessButton = document.querySelector('[data-qa="perform-guess"]');
            if (guessButton && waitingForRound) {
                startRound();
                waitingForRound = false;
            }

            // Check if round ended (next round button appears)
            const nextRoundButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent.includes('Start next round')
            );
            // Check if the game finished (finish game button appears)
            const finishGameButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent.includes('Finish game')
            );
            if ((nextRoundButton || finishGameButton) && waitingForRound === false) {
                stopRound();
                waitingForRound = true;
            }

            // Check if the game breakdown is shown (continue button appears)
            const continueButton = Array.from(document.querySelectorAll('a.next-link_anchor__CQUJ3')).find(
                btn => btn.textContent.includes('Continue')
            );
            if (continueButton && finalBreakdownRendered === false && currentRound > 0) {
                renderFinalBreakdown();

                console.log('Bullseye Timer: Adding listener to continue button:', continueButton);

                continueButton.addEventListener('click', () => {
                    console.log('Bullseye Timer: Button pressed');
                    waitingForRound = true;
                    roundResults = [];
                    currentRound = 0;
                    timerInterval = null;
                    inGameTimerDisplay.textContent = '00:00.0';
                    inGameTimerDisplay.style.background = 'rgba(0, 0, 0, 0.8)';
                    finalBreakdownRendered = false;
                    console.log('Bullseye Timer: Button press fully handled.');
                }, false);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Bullseye Timer: Initialized');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
