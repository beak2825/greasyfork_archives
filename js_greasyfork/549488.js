// ==UserScript==
// @name         Klavia Statistics Box + Sandbagging Tool
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Live WPM/accuracy box for Klavia + sandbagging tool
// @match        *://ntcomps.com/race*
// @match        *://klavia.io/race*
// @match        *://playklavia.com/race*
// @license      MIT
// @author       JayJacksonGH + ChatGPT
// @downloadURL https://update.greasyfork.org/scripts/549488/Klavia%20Statistics%20Box%20%2B%20Sandbagging%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/549488/Klavia%20Statistics%20Box%20%2B%20Sandbagging%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================
    // CONFIG
    // ============================
    const config = {
        targetWPM: 79.4,      // Desired sandbag WPM
        indicateWithin: 5,  // Highlight WPM if within range
        refreshInterval: 50, // Box update frequency (ms)
        corner: 'bottom-right' // Options: 'bottom-right', 'bottom-left'
    };

    // ============================
    // VARIABLES
    // ============================
    let box;
    let totalLetters = 0;
    let mistakes = 0;
    let correctCharacters = 0;
    let initialized = false;
    let waitingForReset = false;
    let raceStarted = false;
    let firstLetterAppeared = false;
    let lastLetterAppeared = false;
    let lastLetter = null;
    let reloaded = true;
    let raceResultsEmpty = true;
    let exactAcc = 0;
    let startTime = null;
    let endTime = null;
    let exactWpm = 0;
    let bestLiveWpm = 0;
    let endingthing = false;
    let elapsedMinutes = 0;

    // ============================
    // CREATE NITRO-STYLE BOX
    // ============================
    function createBox() {
        if (!document.body.contains(box)) {
            box = document.createElement('div');
            box.id = 'sandbagBox';
            Object.assign(box.style, {
                position: 'fixed',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '14px',
                borderRadius: '8px',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                zIndex: '9999',
                whiteSpace: 'pre-line',
                userSelect: 'none',
                cursor: 'move'
            });
            if (config.corner === 'bottom-right') {
                box.style.bottom = '20px';
                box.style.right = '20px';
            } else if (config.corner === 'bottom-left') {
                box.style.bottom = '20px';
                box.style.left = '20px';
            }
            document.body.appendChild(box);

            // Drag functionality like Nitro Type
            let isDragging = false, offsetX = 0, offsetY = 0;
            box.addEventListener('mousedown', e => {
                isDragging = true;
                offsetX = e.clientX - box.getBoundingClientRect().left;
                offsetY = e.clientY - box.getBoundingClientRect().top;
            });
            window.addEventListener('mousemove', e => {
                if (isDragging) {
                    box.style.left = `${e.clientX - offsetX}px`;
                    box.style.top = `${e.clientY - offsetY}px`;
                    box.style.right = 'auto';
                    box.style.bottom = 'auto';
                }
            });
            window.addEventListener('mouseup', () => isDragging = false);
        }
    }

    // ============================
    // INITIALIZE RACE
    // ============================
    function initialize() {
        const letters = document.querySelectorAll("#typing-text .typing-letter");
        if (letters.length > 0) {
            totalLetters = letters.length;
            lastLetter = letters[totalLetters - 1];
            startTime = null;
            endTime = null;
            raceStarted = false;
            exactWpm = 0;
            endingthing = true;
            firstLetterAppeared = letters[0].classList.contains("highlight-letter");
            lastLetterAppeared = lastLetter.classList.contains("highlight-letter");
            initialized = true;
            createBox();
        } else {
            if (document.body.contains(box)) box.remove();
            box = null;
        }
    }

    // ============================
    // ACCURACY / WPM CALCULATION
    // ============================
    function calculateScriptAccuracy() {
        const letters = document.querySelectorAll("#typing-text .typing-letter");
        if (!letters.length) return 100;

        let correct = 0;
        let total = 0;
        letters.forEach(letter => {
            const typed = !letter.classList.contains("highlight-letter");
            if (!typed) return;
            total++;
            if (!letter.classList.contains("incorrect-letter")) correct++;
        });
        return total === 0 ? 100 : (correct / total) * 100;
    }

    function updateAccuracy() {
        const scriptAcc = calculateScriptAccuracy();
        if (raceStarted || scriptAcc < 100) {
            if (scriptAcc < 100 && !waitingForReset) {
                mistakes++;
                waitingForReset = true;
            } else if (scriptAcc === 100) {
                waitingForReset = false;
                correctCharacters++;
            }
        }
    }

    // ============================
    // RACE START / END
    // ============================
    function checkRaceStart() {
        const quickChat = document.querySelector('#quick-chat');
        if (!quickChat) return;

        if (quickChat.style.display === 'flex') raceStarted = false;
        else if (quickChat.style.display === 'none' && !raceStarted) {
            raceStarted = true;
            endingthing = true;
            startTime = Date.now();
        }
    }

    function checkRaceEnd() {
        if (!lastLetter) return;

        if (!lastLetterAppeared && lastLetter.classList.contains("highlight-letter")) lastLetterAppeared = true;
        if (lastLetterAppeared && raceStarted && !lastLetter.classList.contains("highlight-letter")) {
            lastLetterAppeared = false;
            endingthing = false;
            endTime = Date.now();
            elapsedMinutes = (endTime - startTime) / 60000;
            exactWpm = elapsedMinutes > 0 ? (correctCharacters / 5) / elapsedMinutes : 0;
        }
    }

    function checkFirstLetterDisappearance() {
        const firstLetter = document.querySelector('#typing-text .typing-letter[data-index="0"]');
        if (!firstLetter) {
            resetCounters();
            if (document.body.contains(box)) box.remove();
            box = null;
            exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / correctCharacters) * 100 : 100;
        }
    }

    function resetCounters() {
        totalLetters = 0;
        mistakes = 0;
        endingthing = false;
        correctCharacters = 0;
        waitingForReset = false;
        firstLetterAppeared = false;
        lastLetterAppeared = false;
        lastLetter = null;
        initialized = false;
    }

    function checkPostRace() {
        const raceResults = document.querySelector('#race-results');
        if (!raceResults) return;

        const isEmptyNow = raceResults.innerHTML.trim() === "";
        if (!isEmptyNow && raceResultsEmpty) reloaded = false;
        else if (isEmptyNow && !raceResultsEmpty) {
            reloaded = true;
            resetCounters();
            if (box) box.remove();
            box = null;
            exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / correctCharacters) * 100 : 100;
        }
        raceResultsEmpty = isEmptyNow;
    }

    // ============================
    // BOX UPDATE
    // ============================
    function boxUpdate() {
        if (!initialized) initialize();

        if (endingthing && raceStarted) {
            endTime = Date.now();
            elapsedMinutes = (endTime - startTime) / 60000;
            exactWpm = elapsedMinutes > 0 ? (correctCharacters / 5) / elapsedMinutes : 0;
        } else if (!raceStarted) {
            elapsedMinutes = 0;
        }
        if (exactWpm > bestLiveWpm) bestLiveWpm = exactWpm;

        if (box) {
            createBox();
            const targetTimeSec = (totalLetters / 5) / config.targetWPM * 60;
            box.innerHTML = `
Target WPM: <span style="color:#ffe275">${config.targetWPM}</span>
Live WPM: <span style="color:${Math.abs(exactWpm-config.targetWPM)<=config.indicateWithin?'#76ff76':'#fff'}">${exactWpm.toFixed(2)}</span>
Best WPM: ${bestLiveWpm.toFixed(2)}
Accuracy: ${exactAcc.toFixed(2)}%
Mistakes: ${mistakes}
Chars: ${totalLetters}
Target Time: ${targetTimeSec.toFixed(2)}s
Timer: ${(elapsedMinutes*60).toFixed(2)}s
            `;
        }
    }

    // ============================
    // EVENT LISTENERS
    // ============================
    document.addEventListener("keydown", e => {
        if (e.key === "Shift") return;
        if (!raceStarted || !reloaded) return;
        updateAccuracy();
        exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / correctCharacters) * 100 : 100;
    });

    // ============================
    // INTERVALS
    // ============================
    setInterval(checkFirstLetterDisappearance, 100);
    setInterval(checkRaceStart, 20);
    setInterval(checkRaceEnd, 20);
    setInterval(boxUpdate, config.refreshInterval);
    setInterval(checkPostRace, 100);

    // ============================
    // OBSERVER
    // ============================
    const observer = new MutationObserver(() => {
        initialize();
        createBox();
    });
    observer.observe(document.querySelector('#typing-text-container'), { childList: true, subtree: true });

})();

