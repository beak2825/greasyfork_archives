// ==UserScript==
// @name         Torn Dopewars – Travel Edition
// @namespace    https://greasyfork.org/users/000000   // (replace with your GF user number)
// @version      1.5
// @description  A classic DOS-style Dopewars mini-game overlay that auto-runs while flying in Torn. Features Torn NPC events, draggable game window, and destination-based trading.
// @author       loneblackbear
// @license      MIT
// @match        *://www.torn.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556952/Torn%20Dopewars%20%E2%80%93%20Travel%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/556952/Torn%20Dopewars%20%E2%80%93%20Travel%20Edition.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 loneblackbear

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
    'use strict';

    const LOCATIONS = [
        "Mexico","Cayman Islands","Canada","Hawaii","United Kingdom",
        "Argentina","Switzerland","Japan","China","UAE","South Africa"
    ];

    const COMMODITIES = [
        { id: 1, name: "Weed",    baseMin: 100,  baseMax: 400   },
        { id: 2, name: "LSD",     baseMin: 500,  baseMax: 1200  },
        { id: 3, name: "Cocaine", baseMin: 5000, baseMax: 15000 },
        { id: 4, name: "Heroin",  baseMin: 3000, baseMax: 8000  },
        { id: 5, name: "Ecstasy", baseMin: 700,  baseMax: 2000  },
        { id: 6, name: "Speed",   baseMin: 200,  baseMax: 900   },
        { id: 7, name: "Shrooms", baseMin: 150,  baseMax: 700   }
    ];

    const RANDOM_EVENTS = [
        { label: "Leslie crate", apply: s => { const i = rnd(s.items); const e = ri(5,20); i.owned += e; s.message = `Leslie hooks you up with +${e} ${i.name}!`; } },
        { label: "Duke",         apply: s => { const v = Math.min(s.cash, ri(1000,5000)); s.cash -= v; s.message = `Duke's boys shake you down for $${v}.`; } },
        { label: "Xmas",         apply: s => { const v = ri(2000,10000); s.cash += v; s.message = `Christmas Town blessing! You gain $${v}.`; } },
        { label: "Dump",         apply: s => { const v = ri(500,4000); s.cash += v; s.message = `You flip dump junk for $${v}.`; } },
        { label: "Casino",       apply: s => { const v = Math.min(s.cash, ri(500,6000)); s.cash -= v; s.message = `Casino tilt! You blow $${v}.`; } },
        { label: "BF",           apply: s => { const i = rnd(s.items); i.price = ri(1,3); s.message = `Black Friday deal! ${i.name} costs only $${i.price}!`; } }
    ];

    const DAYS_TOTAL  = 30;
    const START_CASH  = 2000;
    const START_DEBT  = 5500;
    const MAX_LOAN    = 10000;
    const MAX_SPACE   = 100;

    let gameState = null;
    let gameActive = false;
    let inFlight   = false;

    let ui = { container: null, pre: null, help: null, toggleBtn: null };
    let dragState = { active: false, offsetX: 0, offsetY: 0 };

    let mode = "idle";   // "idle" | "intro" | "game"

    // intro typing state
    let introFullText = "";
    let introIndex    = 0;
    let introTimer    = null;
    let introCursorOn = true;
    let cursorTimer   = null;

    let audioCtx = null;

    function ri(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function rnd(arr)    { return arr[Math.floor(Math.random() * arr.length)]; }
    function pr(str,w)   { str = String(str); return str.length >= w ? str.slice(0,w) : str + " ".repeat(w-str.length); }
    function pl(str,w)   { str = String(str); return str.length >= w ? str.slice(-w) : " ".repeat(w-str.length) + str; }
    function tr(str,w)   { str = String(str || ""); return str.length <= w ? str : str.slice(0, w - 3) + "..."; }

    function addStyles() {
        GM_addStyle(`
        #tdt-game-window{
            position:fixed;
            bottom:8px;
            left:8px;
            width:520px;
            height:260px;
            background:#000000;
            color:#00ff00;
            font-family:"Lucida Console","Consolas",monospace;
            font-size:12px;
            border:2px solid #00ff00;
            padding:2px 4px;
            box-sizing:border-box;
            z-index:999999;
            display:none;
        }
        #tdt-game-main{
            white-space:pre;
            line-height:1.05;
            height:215px;
            overflow:hidden;
            background:#000000;
            color:#00ff00;
            padding:2px;
            box-sizing:border-box;
        }
        #tdt-game-help{
            margin-top:2px;
            font-size:11px;
            color:#00ff00;
        }
        #tdt-game-toggle{
            position:fixed;
            bottom:60px;
            right:8px;
            z-index:999999;
            font-size:11px;
            background:#000000;
            color:#00ff00;
            border:1px solid #00ff00;
            padding:3px 7px;
            cursor:pointer;
        }
        `);
    }

    function initUI() {
        if (ui.container) return;

        const body = document.body || document.documentElement;

        const toggle = document.createElement("button");
        toggle.id = "tdt-game-toggle";
        toggle.textContent = "dope";
        toggle.addEventListener("click", () => {
            if (mode === "idle") startIntro();
            toggleWindow();
        });
        body.appendChild(toggle);

        const container = document.createElement("div");
        container.id = "tdt-game-window";
        container.tabIndex = 0;

        const main = document.createElement("div");
        main.id = "tdt-game-main";

        const help = document.createElement("div");
        help.id = "tdt-game-help";
        help.textContent = "Controls in game: ↑/↓ = select  |  B = Buy  S = Sell  N = Next day  L = Loan  R = Repay  K = Bank  Q = Quit";

        container.appendChild(main);
        container.appendChild(help);
        body.appendChild(container);

        container.addEventListener("keydown", handleKeys);
        container.addEventListener("click", () => container.focus());
        container.addEventListener("mousedown", dragStart);

        ui = { container, pre: main, help, toggleBtn: toggle };
    }

    function toggleWindow() {
        const c = ui.container;
        if (!c) return;
        c.style.display = (c.style.display === "none" || !c.style.display) ? "block" : "none";
        if (c.style.display === "block") c.focus();
    }

    function dragStart(e) {
        if (e.button !== 0 || !ui.container) return;
        const rect = ui.container.getBoundingClientRect();
        dragState.active  = true;
        dragState.offsetX = e.clientX - rect.left;
        dragState.offsetY = e.clientY - rect.top;
        ui.container.style.top = rect.top + "px";
        ui.container.style.left = rect.left + "px";
        ui.container.style.bottom = "auto";
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
    }

    function dragMove(e) {
        if (!dragState.active || !ui.container) return;
        ui.container.style.left = (e.clientX - dragState.offsetX) + "px";
        ui.container.style.top  = (e.clientY - dragState.offsetY) + "px";
    }

    function dragEnd() {
        dragState.active = false;
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
    }

    // ---------- INTRO / WARGAMES MODE ----------

    function startIntro() {
        mode = "intro";
        gameActive = false;
        gameState = null;

        const width = 60;
        const lines = [];
        lines.push(tr("T.O.R.N.-NET ACCESS TERMINAL  300 BAUD", width));
        lines.push("");
        lines.push("LOGON: GUEST");
        lines.push("");
        lines.push("GAMES AVAILABLE:");
        lines.push("  1. CHESS");
        lines.push("  2. CHECKERS");
        lines.push("  3. GLOBAL STRATEGIC SIMULATION");
        lines.push("  4. TORN DOPEWARS");
        lines.push("");
        lines.push("TYPE 4 AND PRESS ENTER TO CONNECT");
        lines.push("Q TO ABORT CONNECTION");
        lines.push("");

        introFullText = lines.join("\n");
        introIndex = 0;
        introCursorOn = true;

        if (introTimer) clearInterval(introTimer);
        if (cursorTimer) clearInterval(cursorTimer);

        introTimer = setInterval(() => {
            if (mode !== "intro") { clearInterval(introTimer); introTimer = null; return; }
            introIndex++;
            if (introIndex >= introFullText.length) {
                introIndex = introFullText.length;
                clearInterval(introTimer);
                introTimer = null;
            }
            renderIntro();
        }, 20); // typing speed

        cursorTimer = setInterval(() => {
            if (mode !== "intro") { clearInterval(cursorTimer); cursorTimer = null; return; }
            introCursorOn = !introCursorOn;
            renderIntro();
        }, 400);

        renderIntro();
    }

    function playDialup() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const ctx = audioCtx;
            const now = ctx.currentTime;

            function tone(freq, start, dur, vol) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.value = freq;
                osc.type = "sawtooth";
                gain.gain.setValueAtTime(vol, now + start);
                gain.gain.linearRampToValueAtTime(0.0, now + start + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + start);
                osc.stop(now + start + dur + 0.05);
            }

            tone(1200, 0.0, 0.6, 0.2);
            tone(2100, 0.6, 0.5, 0.2);
            tone(900,  1.1, 0.4, 0.18);
            tone(1800, 1.5, 0.5, 0.18);

            const noiseDur = 1.6;
            const bufferSize = ctx.sampleRate * noiseDur;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            const noise = ctx.createBufferSource();
            const nGain = ctx.createGain();
            nGain.gain.setValueAtTime(0.0, now + 0.8);
            nGain.gain.linearRampToValueAtTime(0.35, now + 1.0);
            nGain.gain.linearRampToValueAtTime(0.0, now + 0.8 + noiseDur);
            noise.buffer = buffer;
            noise.connect(nGain);
            nGain.connect(ctx.destination);
            noise.start(now + 0.8);
            noise.stop(now + 0.8 + noiseDur);
        } catch(e) {
            // ignore audio failures
        }
    }

    function speakWopr(text) {
        try {
            if (!("speechSynthesis" in window)) return;
            const u = new SpeechSynthesisUtterance(text);
            u.rate  = 0.85;
            u.pitch = 0.6;
            u.volume = 0.9;
            window.speechSynthesis.speak(u);
        } catch(e) {
            // ignore
        }
    }

    // ---------- GAME CORE ----------

    function startGame() {
        const items = COMMODITIES.map(c => ({
            id: c.id,
            name: c.name,
            baseMin: c.baseMin,
            baseMax: c.baseMax,
            price: ri(c.baseMin, c.baseMax),
            owned: 0
        }));

        gameState = {
            day: 1,
            locationIndex: 0,
            cash: START_CASH,
            bank: 0,
            debt: START_DEBT,
            guns: 0,
            health: 100,
            maxSpace: MAX_SPACE,
            cursor: 0,
            items,
            message: "Welcome to Torn Dopewars. What do you wish to buy or sell?"
        };

        rollPrices();
        maybeEvent();
        gameActive = true;
        mode = "game";
        renderGame();
        speakWopr("Welcome to Torn Dopewars. Shall we play a game?");
    }

    function endGame(reason) {
        if (!gameState) return;
        const net = gameState.cash + gameState.bank + inventoryValue() - gameState.debt;
        gameState.message = `Game over (${reason}). Final net worth: $${net}. Press Q to close.`;
        renderGame();
        gameActive = false;
        mode = "game";
    }

    function totalInventory() {
        return gameState.items.reduce((sum, it) => sum + it.owned, 0);
    }

    function inventoryValue() {
        return gameState.items.reduce((sum, it) => sum + it.owned * it.price, 0);
    }

    function rollPrices() {
        gameState.items.forEach(it => {
            it.price = ri(it.baseMin, it.baseMax);
        });
    }

    function maybeEvent() {
        if (Math.random() < 0.35) rnd(RANDOM_EVENTS).apply(gameState);
        else gameState.message = `You're in ${LOCATIONS[gameState.locationIndex]}.`;
    }

    function nextLocation() {
        gameState.locationIndex = (gameState.locationIndex + 1) % LOCATIONS.length;
        gameState.day++;
        if (gameState.day > DAYS_TOTAL) {
            endGame("time up");
            return;
        }
        rollPrices();
        maybeEvent();
    }

    function doBuy() {
        const it = gameState.items[gameState.cursor];
        if (gameState.cash < it.price) {
            gameState.message = "You don't have enough cash.";
            return;
        }
        if (totalInventory() >= gameState.maxSpace) {
            gameState.message = "Your trenchcoat is full.";
            return;
        }
        it.owned++;
        gameState.cash -= it.price;
        gameState.message = `You bought 1 ${it.name}.`;
    }

    function doSell() {
        const it = gameState.items[gameState.cursor];
        if (it.owned <= 0) {
            gameState.message = "You don't own any of that.";
            return;
        }
        it.owned--;
        gameState.cash += it.price;
        gameState.message = `You sold 1 ${it.name}.`;
    }

    function doLoan() {
        const room = MAX_LOAN - gameState.debt;
        if (room <= 0) {
            gameState.message = "Loan shark: you're at your limit.";
            return;
        }
        const amt = Math.min(2000, room);
        gameState.debt += amt;
        gameState.cash += amt;
        gameState.message = `You borrow $${amt} from Duke's boys.`;
    }

    function doBank() {
        if (gameState.cash <= 0) {
            gameState.message = "No spare cash to bank.";
            return;
        }
        const amt = Math.min(gameState.cash, 2000);
        gameState.cash -= amt;
        gameState.bank += amt;
        gameState.message = `You deposit $${amt} in the bank.`;
    }

    function doRepay() {
        if (gameState.cash <= 0 || gameState.debt <= 0) {
            gameState.message = "Nothing to repay.";
            return;
        }
        const amt = Math.min(gameState.cash, gameState.debt, 2000);
        gameState.cash -= amt;
        gameState.debt -= amt;
        gameState.message = `You repay $${amt} of your debt.`;
    }

    // ---------- INPUT HANDLING ----------

    function handleKeys(e) {
        if (mode === "intro") {
            const key = e.key.toLowerCase();
            if (key === "enter" || key === "return") {
                e.preventDefault();
                introIndex = introFullText.length;
                renderIntro();
                playDialup();
                setTimeout(() => startGame(), 2600);
            } else if (key === "q") {
                e.preventDefault();
                ui.container.style.display = "none";
                mode = "idle";
            }
            return;
        }

        if (!gameActive && e.key.toLowerCase() !== "q") return;

        const k = e.key;
        if (k === "ArrowUp" || k === "ArrowDown") {
            e.preventDefault();
            if (k === "ArrowUp")   gameState.cursor = (gameState.cursor - 1 + gameState.items.length) % gameState.items.length;
            if (k === "ArrowDown") gameState.cursor = (gameState.cursor + 1) % gameState.items.length;
            renderGame();
            return;
        }

        const key = k.toLowerCase();
        if (key === "b") { e.preventDefault(); doBuy();   renderGame(); }
        else if (key === "s") { e.preventDefault(); doSell();  renderGame(); }
        else if (key === "n") { e.preventDefault(); nextLocation(); renderGame(); }
        else if (key === "l") { e.preventDefault(); doLoan();  renderGame(); }
        else if (key === "k") { e.preventDefault(); doBank();  renderGame(); }
        else if (key === "r") { e.preventDefault(); doRepay(); renderGame(); }
        else if (key === "q") {
            e.preventDefault();
            if (gameActive) endGame("quit");
            if (ui.container) ui.container.style.display = "none";
            mode = "idle";
        }
    }

    // ---------- RENDERING ----------

    function render() {
        if (!ui.pre) return;
        if (mode === "intro") { renderIntro(); return; }
        if (!gameState) return;
        renderGame();
    }

    function renderIntro() {
        if (!ui.pre) return;
        const width = 60;
        let visible = introFullText.slice(0, Math.max(0, introIndex));
        if (introIndex < introFullText.length && introCursorOn) {
            visible += "_";
        } else if (introIndex >= introFullText.length && introCursorOn) {
            visible += "_";
        }
        // ensure lines don't explode width
        const lines = visible.split("\n").map(l => tr(l, width));
        ui.pre.textContent = lines.join("\n");
    }

    function renderGame() {
        if (!ui.pre || !gameState) return;

        const width = 60;

        const baseDate = new Date(1988, 0, 12);
        baseDate.setDate(baseDate.getDate() + (gameState.day - 1));
        const dateStr =
            String(baseDate.getMonth() + 1).padStart(2,"0") + "-" +
            String(baseDate.getDate()).padStart(2,"0") + "-" +
            baseDate.getFullYear();

        const topLine = pr(dateStr, 12) +
                        " ".repeat(width - 12 - 11) +
                        "Space " + pl(String(gameState.maxSpace), 4);

        const border   = "+----------------+----------------+----------------+";
        const headings =
            "| " + pr("Stats",14) +
            "| " + pr(LOCATIONS[gameState.locationIndex],14) +
            "| " + pr("Trenchcoat",14) + "|";

        const statsLines = [
            "| " + pr(`Cash  $${gameState.cash}`,14) +
            "| " + pr("",14) +
            "| " + pr(`Total: ${totalInventory()}`,14) + "|",

            "| " + pr(`Guns  ${gameState.guns}`,14) +
            "| " + pr("",14) +
            "| " + pr("",14) + "|",

            "| " + pr(`Health ${gameState.health}`,14) +
            "| " + pr("",14) +
            "| " + pr("",14) + "|",

            "| " + pr(`Bank  $${gameState.bank}`,14) +
            "| " + pr("",14) +
            "| " + pr("",14) + "|",

            "| " + pr(`Debt  $${gameState.debt}`,14) +
            "| " + pr("",14) +
            "| " + pr("",14) + "|"
        ];

        const itemLetters = ["A","B","C","D","E","F","G","H","I"];
        const priceLines = [];
        priceLines.push("Hey dude, the prices of goods here are:");
        priceLines.push("");

        for (let i = 0; i < gameState.items.length; i += 3) {
            let row = "";
            for (let col = 0; col < 3; col++) {
                const idx = i + col;
                if (idx >= gameState.items.length) break;
                const it = gameState.items[idx];
                const letter = itemLetters[idx] || "?";
                const cursorMark = (idx === gameState.cursor) ? ">" : " ";
                const chunk = `${cursorMark}${letter}) ${pr(it.name,8)} $${pl(it.price,6)}  `;
                row += chunk;
            }
            priceLines.push(row.trimEnd());
        }

        priceLines.push("");
        priceLines.push(tr("What do you wish to buy or sell? Use ↑/↓ then B or S.", width));
        priceLines.push(tr(gameState.message || "", width));

        const lines = [];
        lines.push(topLine);
        lines.push(border);
        lines.push(headings);
        lines.push(border);
        statsLines.forEach(l => lines.push(l));
        lines.push(border);
        lines.push("");
        priceLines.forEach(l => lines.push(l));

        ui.pre.textContent = lines.join("\n");
    }

    // ---------- FLIGHT DETECTION ----------

    function inFlightText() {
        const t = (document.body.innerText || "").toLowerCase();
        return t.includes("time left until landing") ||
               t.includes("time left till landing") ||
               t.includes("you are currently flying");
    }

    function pollFlight() {
        const now = inFlightText();
        if (now && !inFlight) {
            inFlight = true;
            if (mode === "idle") startIntro();
            ui.container.style.display = "block";
            ui.container.focus();
        } else if (!now && inFlight) {
            inFlight = false;
            if (gameActive) endGame("landing");
            ui.container.style.display = "none";
            mode = "idle";
        }
    }

    addStyles();

    function boot() {
        if (!document.body) {
            setTimeout(boot, 200);
            return;
        }
        initUI();
        setInterval(pollFlight, 5000);
    }

    boot();

})();
