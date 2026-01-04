// ==UserScript==
// @name         Klavia Exact Accuracy and WPM
// @namespace    http://tampermonkey.net/
// @version      1.62
// @description  Tracking correct and incorrect characters and showing some stats with it.
// @match        *://ntcomps.com/race*
// @match        *://klavia.io/race*
// @match        *://playklavia.com/race*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549436/Klavia%20Exact%20Accuracy%20and%20WPM.user.js
// @updateURL https://update.greasyfork.org/scripts/549436/Klavia%20Exact%20Accuracy%20and%20WPM.meta.js
// ==/UserScript==

(function() {
    'use strict';
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
    let endingthing = false;
    let elapsedMinutes = 0;

    function createBox() {
        if (!document.body.contains(box)) {
            box = document.createElement("div");
            box.style.position = "fixed";
            box.style.bottom = "10px";
            box.style.right = "10px";
            box.style.background = "rgba(0,0,0,0.8)";
            box.style.color = "white";
            box.style.padding = "8px 12px";
            box.style.borderRadius = "8px";
            box.style.fontSize = "14px";
            box.style.fontFamily = "sans-serif";
            box.style.whiteSpace = "pre-line";
            box.style.zIndex = "9999";
            document.body.appendChild(box);
        }
    }

    function initialize() {
        const letters = document.querySelectorAll("#typing-text .typing-letter");
        if (letters.length > 0) {
            const letters = document.querySelectorAll("#typing-text .typing-letter");
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
            if (document.body.contains(box)) {
            box.remove();
            }
    box = null;
        }
    }

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

        if (total === 0) return 100;
        return (correct / total) * 100;
    }

   function checkRaceStart() {
    const quickChat = document.querySelector('#quick-chat');
    if (!quickChat) return;

    if (quickChat.style.display === 'flex') {
        // Quick chat visible → race not started
        raceStarted = false;
    } else if (quickChat.style.display === 'none') {
        // Quick chat hidden → race started
        if (!raceStarted) {
            raceStarted = true;
            endingthing = true;
            startTime = Date.now(); // Start timer
        }
    }
}


    function checkRaceEnd() {
        if (!lastLetter) return;

        // Wait until last letter highlight appears
        if (!lastLetterAppeared && lastLetter.classList.contains("highlight-letter")) {
            lastLetterAppeared = true;
        }

        // Race ends when last letter highlight disappears
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
            // First letter disappeared, count as race end
            resetCounters();
            if (document.body.contains(box)) {
            box.remove();
            }
    box = null;
            exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / (correctCharacters)) * 100 : 100;
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

    if (!raceResults) return; // Safety check

    const isEmptyNow = raceResults.innerHTML.trim() === "";

    if (!isEmptyNow && raceResultsEmpty) {
        // Race results appeared → new results loaded
        reloaded = false;
    } else if (isEmptyNow && !raceResultsEmpty) {
        // Race results disappeared → race likely reloaded
        reloaded = true;
        resetCounters();
            box.remove();
    box = null;
        exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / (correctCharacters)) * 100 : 100;
    }

    // Update previous state
    raceResultsEmpty = isEmptyNow;
}
    document.addEventListener("keydown", (event) => {
    if (event.key === "Shift") return;
        if (reloaded == false) return;
    if (!raceStarted) return;

        updateAccuracy();
        exactAcc = correctCharacters > 0 ? ((correctCharacters - mistakes) / (correctCharacters)) * 100 : 100;
    });

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
    function boxUpdate() {
        if (!initialized) {
            initialize();
        }
            if (endingthing == true) {
                endTime = Date.now();
            elapsedMinutes = (endTime - startTime) / 60000;
        exactWpm = elapsedMinutes > 0 ? (correctCharacters / 5) / elapsedMinutes : 0;
            }
        if (box != null) {
        createBox();
        box.textContent =
            `Accuracy: ${exactAcc.toFixed(3)}%\n` +
            `WPM: ${exactWpm.toFixed(2)}\n` +
            `Mistakes: ${mistakes}\n` +
            `Characters in Text: ${totalLetters}\n`;
        }
    }
    setInterval(checkFirstLetterDisappearance, 100);
    setInterval(checkRaceStart, 20);
    setInterval(checkRaceEnd, 20);
    setInterval(boxUpdate, 60);
    setInterval(checkPostRace, 100);

    // Observe race area for new races
    const observer = new MutationObserver(() => {
        initialize();
        createBox();
    });

    observer.observe(document.querySelector('#typing-text-container'), { childList: true, subtree: true });

})();
