// ==UserScript==
// @name             Neopets: Clockwork Codebreaker Solver
// @namespace        kmtxcxjx
// @version          1.0
// @description      Embeds a Clockwork Codebreaker solver to the top of Jellyneo's page for that game
// @match            https://www.jellyneo.net/?go=clockwork_codebreaker
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/554627/Neopets%3A%20Clockwork%20Codebreaker%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/554627/Neopets%3A%20Clockwork%20Codebreaker%20Solver.meta.js
// ==/UserScript==

(function () {
    const TIME_LIMIT = 200; // 200 milliseconds per guess maximum
    let digits, length, candidates, currentGuess, colors;

    const COLOR_SETS = {
        1: ["Blank", "Red", "Orange", "Pink", "White"],
        2: ["Blank", "Red", "Orange", "Yellow", "Pink", "Purple", "White"],
        3: ["Blank", "Red", "Orange", "Yellow", "Green", "Blue", "Pink", "Purple", "White"]
    };

    // --- Create in-page console ---
    const parent = document.querySelector('h1');
    const consoleContainer = document.createElement('div');
    consoleContainer.style.border = '1px solid #ccc';
    consoleContainer.style.padding = '10px';
    consoleContainer.style.marginTop = '10px';
    consoleContainer.style.background = '#393939';
    consoleContainer.style.fontFamily = 'monospace';
    consoleContainer.style.fontSize = '25px';
    consoleContainer.style.whiteSpace = 'pre-line';
    parent.insertAdjacentElement('afterend', consoleContainer);

    const output = document.createElement('div');
    output.style.marginBottom = '5px';
    consoleContainer.appendChild(output);

    const input = document.createElement('input');
    input.type = 'text';
    input.style.width = '100%';
    input.placeholder = 'Enter your response here, then press Enter';
    consoleContainer.appendChild(input);
    input.focus();

    function showMessage(msg) {
        // Clear previous messages each time
        output.innerHTML = `<h2>Solver</h2>${msg}`;
        output.scrollTop = output.scrollHeight;
    }

    function getUserInput(callback) {
        input.value = '';
        input.focus();
        input.onkeydown = function(e) {
            if (e.key === 'Enter') {
                const val = input.value.trim();
                callback(val);
            }
        };
    }

    // --- Solver logic ---
    function showGuess(code) {
        // Bold the guess
        return '<b>' + code.split("").map(d => colors[Number(d)]).join("  ") + '</b>';
    }

    function score(a, b) {
        let greens = 0;
        let aCount = {}, bCount = {};
        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i]) greens++;
            else {
                aCount[a[i]] = (aCount[a[i]] || 0) + 1;
                bCount[b[i]] = (bCount[b[i]] || 0) + 1;
            }
        }
        let yellows = 0;
        for (let d in aCount) yellows += Math.min(aCount[d] || 0, bCount[d] || 0);
        return [greens, yellows];
    }

    function bestGuessTimed() {
        if (!candidates.length) return null;
        let start = performance.now();
        let best = candidates[0];
        let bestScore = Infinity;

        for (let g of candidates) {
            if (performance.now() - start > TIME_LIMIT) break;
            let buckets = {};
            for (let x of candidates) {
                let key = score(g, x).join(',');
                buckets[key] = (buckets[key] || 0) + 1;
            }
            let exp = 0;
            for (let k in buckets) exp += buckets[k] * buckets[k];
            if (exp < bestScore) {
                bestScore = exp;
                best = g;
            }
        }
        return best;
    }

    function promptStep() {
        if (!candidates.length) {
            showMessage("No solutions remain — feedback inconsistency?");
            return startGame();
        }

        if (!currentGuess) currentGuess = candidates[0];

        showMessage(`Try guess:\n${showGuess(currentGuess)}\nEnter: "greens yellows" or "done" to reset.\n(e.g., "1 0" for 1 green, 0 yellow)`);

        getUserInput(resp => {
            if (resp.toLowerCase() === 'done') return startGame();

            let parts = resp.split(" ").map(Number);
            if (parts.length !== 2 || parts.some(isNaN)) {
                showMessage("Invalid input. Use format: greens yellows");
                return promptStep();
            }
            let [g, y] = parts;
            if (g === length) {
                showMessage("Solved!");
                return startGame();
            }

            candidates = candidates.filter(c => {
                let [gg, yy] = score(currentGuess, c);
                return gg === g && yy === y;
            });

            if (!candidates.length) {
                showMessage("No code fits that feedback. Make sure you enter codes correctly. Press enter to restart.");
                getUserInput(_ => startGame());
                return;
            }

            if (candidates.length === 1) {
                showMessage(`Next guess:\n${showGuess(candidates[0])}\nSolved!\nPress Enter to start a new game.`);
                getUserInput(_ => startGame());
                return;
            }


            currentGuess = bestGuessTimed();
            setTimeout(promptStep, 10);
        });
    }

    function startGame() {
        showMessage("\n--- New Game ---\nWhich round are you playing? (1, 2, or 3)");

        getUserInput(roundInput => {
            let round = Number(roundInput);
            if (!COLOR_SETS[round]) {
                showMessage("Invalid round. Enter 1, 2, or 3.");
                return startGame();
            }

            colors = COLOR_SETS[round];
            if (round === 1) { digits = 5; length = 4; }
            else if (round === 2) { digits = 7; length = 5; }
            else { digits = 9; length = 6; }

            const arr = [...Array(digits).keys()].map(String);
            candidates = [];

            function build(prefix) {
                if (prefix.length === length) return candidates.push(prefix);
                for (let d of arr) build(prefix + d);
            }
            build("");

            currentGuess = null;
            setTimeout(promptStep, 10);
        });
    }

    startGame();
})();
