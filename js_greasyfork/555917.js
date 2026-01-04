// ==UserScript==
// @name         GabiBot — Only Best Move (Lichess cloud-eval, Turn-Aware)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  GabiBot using Lichess cloud-eval for the single best move (turn-aware). For study use only; avoid using in rated cheating contexts.
// @author       theHackerclient (patched)
// @license      MIT
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @match        https://www.chess.com/daily-chess/*
// @match        https://www.chess.com/analysis
// @match        https://www.chess.com/practice/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555917/GabiBot%20%E2%80%94%20Only%20Best%20Move%20%28Lichess%20cloud-eval%2C%20Turn-Aware%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555917/GabiBot%20%E2%80%94%20Only%20Best%20Move%20%28Lichess%20cloud-eval%2C%20Turn-Aware%29.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    // Startup delay so page JS initializes
    await new Promise(r => setTimeout(r, 1600));
    alert("GabiBot — Lichess cloud-eval (best move) Loaded!");

    // -------------------------
    // Global state
    // -------------------------
    window.gabi = window.gabi || {};
    window.gabi.hackEnabled = window.gabi.hackEnabled || 0;
    window.gabi.botPower = window.gabi.botPower || 12;      // kept for compatibility (not used by Lichess)
    window.gabi.updateSpeed = window.gabi.updateSpeed || 8; // 1-10 higher = more frequent updates
    window.gabi.autoMove = window.gabi.autoMove || 0;       // 0/1
    window.gabi.autoMoveSpeed = window.gabi.autoMoveSpeed || 4; // 1-10 higher = faster auto-move
    window.gabi.bestMove = window.gabi.bestMove || "";
    window.gabi.currentEvaluation = window.gabi.currentEvaluation || "-";

    // Multi-PV used with Lichess cloud-eval (we request 1 and use the top PV)
    const lichessMultiPv = 1;

    // Configure whether the bot plays White or Black.
    const botIsWhite = true; // set to false if you want bot to play Black

    // -------------------------
    // Utility helpers
    // -------------------------
    function $qs(sel, root = document) { return (root || document).querySelector(sel); }
    function getItemByName(name) { return $qs(`.gb_item[data-name="${name}"]`); }
    function setStateText(name, txt) {
        const el = getItemByName(name);
        if (!el) return;
        const state = el.querySelector(".gb_state");
        if (state) state.textContent = String(txt);
    }

    // -------------------------
    // UI creation
    // -------------------------
    function createUI() {
        const existing = document.getElementById("gabibot_menuWrap");
        if (existing) existing.remove();

        const menuWrap = document.createElement("div");
        menuWrap.id = "gabibot_menuWrap";
        menuWrap.innerHTML = `
<div id="gb_top">
  <div id="gb_title">
    <span id="gb_modTitle">- GabiBot -</span>
    <span id="gb_toggleHint">Ctrl+B to toggle</span>
  </div>
</div>
<div id="gb_items">
  <div class="gb_item gb_row" data-name="enableHack">
    <label class="gb_label">Enable Bot</label>
    <input class="gb_checkbox" type="checkbox" />
    <span class="gb_state">Off</span>
  </div>

  <div class="gb_item gb_row" data-name="autoMove">
    <label class="gb_label">Auto Move</label>
    <input class="gb_checkbox" type="checkbox" />
    <span class="gb_state">Off</span>
  </div>

  <div class="gb_item" data-name="botPower">
    <label class="gb_label">Bot Power (placeholder)</label>
    <input class="gb_range" type="range" min="1" max="15" value="12" />
    <span class="gb_state">12</span>
  </div>

  <div class="gb_item" data-name="autoMoveSpeed">
    <label class="gb_label">Auto Move Speed</label>
    <input class="gb_range" type="range" min="1" max="10" value="4" />
    <span class="gb_state">4</span>
  </div>

  <div class="gb_item" data-name="updateSpeed">
    <label class="gb_label">Update Speed</label>
    <input class="gb_range" type="range" min="1" max="10" value="8" />
    <span class="gb_state">8</span>
  </div>

  <div class="gb_item gb_readonly" data-name="currentEvaluation">
    <label class="gb_label">Current Evaluation</label>
    <span class="gb_state">-</span>
  </div>

  <div class="gb_item gb_readonly" data-name="bestMove">
    <label class="gb_label">Best Move</label>
    <span class="gb_state">-</span>
  </div>
</div>
        `;

        const style = document.createElement("style");
        style.id = "gabibot_style";
        style.textContent = `
#gabibot_menuWrap{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
  position: fixed;
  top: 80px;
  left: 80px;
  width: 360px;
  max-width: 70vw;
  z-index: 2147483647;
  background: linear-gradient(180deg, #111 0%, #0f0f10 100%);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 6px;
  padding: 8px;
}
#gb_top{ padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.03); }
#gb_title{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
#gb_modTitle{ font-weight:700; font-size:16px; color:#fff; cursor:move; }
#gb_toggleHint{ font-size:12px; color:#b8b8b8; }

#gb_items{ padding:8px; display:flex; flex-direction:column; gap:10px; max-height:48vh; overflow:auto; }

.gb_item{ display:flex; align-items:center; gap:8px; }
.gb_row{ justify-content:space-between; }
.gb_label{ flex:1; font-size:13px; color:#eaeaea; }
.gb_state{ min-width:60px; text-align:right; font-size:13px; color:#cfcfcf; }

.gb_checkbox{ width:18px; height:18px; accent-color:#6ee7b7; }
.gb_range{ -webkit-appearance:none; width:50%; height:6px; border-radius:6px; background:#2b2b2b; outline:none; }
.gb_range::-webkit-slider-thumb{ -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#a3a3a3; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.6); }

.gb_readonly .gb_state{ color:#9aa0a6; }

@media (max-width:520px){
  #gabibot_menuWrap{ left: 10px; top: 60px; width: 92vw; }
}
        `;
        document.body.appendChild(menuWrap);
        document.head.appendChild(style);

        // --- Wire inputs ---
        menuWrap.querySelectorAll(".gb_item").forEach(item => {
            const name = item.getAttribute("data-name");
            const checkbox = item.querySelector(".gb_checkbox");
            const range = item.querySelector(".gb_range");

            if (checkbox) {
                if (name === "enableHack") checkbox.checked = !!window.gabi.hackEnabled;
                if (name === "autoMove") checkbox.checked = !!window.gabi.autoMove;

                setStateText(name, checkbox.checked ? "On" : "Off");

                checkbox.addEventListener("change", e => {
                    const val = e.target.checked ? 1 : 0;
                    if (name === "enableHack") {
                        window.gabi.hackEnabled = val;
                        if (val && !updateBotRunning) updateBot();
                        if (!val) { updateBotRunning = false; clearCanvas(); }
                    }
                    if (name === "autoMove") window.gabi.autoMove = val;
                    setStateText(name, val ? "On" : "Off");
                });
            }

            if (range) {
                if (name === "botPower") range.value = window.gabi.botPower;
                if (name === "autoMoveSpeed") range.value = window.gabi.autoMoveSpeed;
                if (name === "updateSpeed") range.value = window.gabi.updateSpeed;

                setStateText(name, range.value);

                range.addEventListener("input", e => {
                    const val = Number(e.target.value);
                    if (name === "botPower") window.gabi.botPower = val;
                    if (name === "autoMoveSpeed") window.gabi.autoMoveSpeed = val;
                    if (name === "updateSpeed") window.gabi.updateSpeed = val;
                    setStateText(name, val);
                });
            }
        });

        // Initialize readouts
        setStateText("currentEvaluation", window.gabi.currentEvaluation || "-");
        setStateText("bestMove", window.gabi.bestMove || "-");

        // Draggable title
        const dragHandle = $qs("#gb_modTitle");
        let offsetX=0, offsetY=0, isDown=false;
        dragHandle.addEventListener("mousedown", e => {
            isDown = true;
            offsetX = e.clientX - menuWrap.offsetLeft;
            offsetY = e.clientY - menuWrap.offsetTop;
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
            e.preventDefault();
        });
        function onMove(e) {
            if (!isDown) return;
            menuWrap.style.left = Math.max(6, e.clientX - offsetX) + "px";
            menuWrap.style.top = Math.max(6, e.clientY - offsetY) + "px";
        }
        function onUp() { isDown = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }

        // Toggle visibility Ctrl+B
        let menuHidden = false;
        document.addEventListener("keyup", e => {
            if (e.key && e.key.toLowerCase() === "b" && e.ctrlKey) {
                menuHidden = !menuHidden;
                menuWrap.style.display = menuHidden ? "none" : "grid";
            }
        });
    }

    createUI();

    // -------------------------
    // Canvas / drawing
    // -------------------------
    let drawingBoard = null;
    let drawingCtx = null;
    function ensureCanvasAttached(boardEl) {
        if (!boardEl) return null;
        if (!drawingBoard) {
            drawingBoard = document.createElement("canvas");
            drawingBoard.id = "gabibot_canvas";
            drawingBoard.style.position = "absolute";
            drawingBoard.style.top = "0";
            drawingBoard.style.left = "0";
            drawingBoard.style.pointerEvents = "none";
            drawingBoard.style.width = "100%";
            drawingBoard.style.height = "100%";
            const cs = getComputedStyle(boardEl);
            if (!cs || cs.position === "static" || !cs.position) boardEl.style.position = "relative";
            boardEl.appendChild(drawingBoard);
            drawingCtx = drawingBoard.getContext("2d");
        }
        const rect = boardEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        drawingBoard.width = Math.round(rect.width * dpr);
        drawingBoard.height = Math.round(rect.height * dpr);
        drawingBoard.style.width = rect.width + "px";
        drawingBoard.style.height = rect.height + "px";
        if (drawingCtx) drawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return drawingBoard;
    }
    function clearCanvas() { if (drawingCtx && drawingBoard) drawingCtx.clearRect(0, 0, drawingBoard.width, drawingBoard.height); }

    // -------------------------
    // Board & FEN helpers
    // -------------------------
    function findBoardObject() {
        return document.querySelector(".board") || document.querySelector(".cg-board") || document.querySelector("[data-test=board]") || document.querySelector(".board-wrap") || document.querySelector(".board-area") || null;
    }

    function getGameObjectFromBoard(boardEl) {
        try {
            if(!boardEl) return null;
            if(boardEl.game) return boardEl.game;
            if(window.game) return window.game;
            const possible = boardEl.querySelectorAll("*");
            for(let n of possible) {
                try {
                    if(n && typeof n.getFEN === "function") return n;
                } catch(e){}
            }
        } catch(e){}
        return null;
    }

    function extractFENFromText(text) {
        if(!text || typeof text !== "string") return null;
        const fenRegex = /([prnbqkPRNBQK1-8]+(?:\/[prnbqkPRNBQK1-8]+){7}\s+[wb]\s+\S+\s+\d+\s+\d+)/g;
        const matches = Array.from(text.matchAll(fenRegex));
        if (matches.length) return matches[0][1];
        return null;
    }

    function findFEN() {
        try {
            const boardEl = findBoardObject();
            if (boardEl) {
                const attr = boardEl.getAttribute("data-fen") || (boardEl.dataset && boardEl.dataset.fen);
                if (attr) return attr;
            }
        } catch(e){}

        try {
            const boardEl = findBoardObject();
            const gameObj = getGameObjectFromBoard(boardEl);
            if (gameObj) {
                if (typeof gameObj.getFEN === "function") {
                    try {
                        const fen = gameObj.getFEN();
                        if (fen) return fen;
                    } catch(e){}
                }
                if (gameObj.fen) return gameObj.fen;
            }
        } catch(e){}

        try {
            if (window.fen) return window.fen;
            if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.game && window.__INITIAL_STATE__.game.fen) return window.__INITIAL_STATE__.game.fen;
        } catch(e){}

        try {
            const datasetEl = document.querySelector('[data-fen], [data-position], [data-chessfen]');
            if (datasetEl) {
                const val = datasetEl.getAttribute('data-fen') || datasetEl.getAttribute('data-position') || datasetEl.getAttribute('data-chessfen');
                if (val) return val;
            }
        } catch(e){}

        try {
            const scripts = Array.from(document.scripts || []).map(s => s.textContent).join("\n");
            const found = extractFENFromText(scripts);
            if (found) return found;
        } catch(e){}

        try {
            const pageText = document.documentElement.innerText || document.body.innerText || "";
            const found = extractFENFromText(pageText);
            if (found) return found;
        } catch(e){}

        return null;
    }

    // -------------------------
    // Lichess cloud-eval integration (pick only first move of top PV)
    // -------------------------
    async function getLichessEval(FEN, multiPv = lichessMultiPv) {
        try {
            const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(FEN)}&multiPv=${multiPv}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("Lichess cloud-eval error: " + resp.status);
            const data = await resp.json();

            if (!data.pvs || data.pvs.length === 0) {
                return { bestMove: "", evalScore: "N/A", raw: data };
            }

            const top = data.pvs[0];
            // moves is a space separated string like "e2e4 e7e5 ..."
            const movesStr = top.moves || "";
            const firstMoveToken = movesStr.split(/\s+/).filter(Boolean)[0] || "";

            // evaluation parsing
            let evalScore = "N/A";
            if (top.cp !== undefined && top.cp !== null) {
                evalScore = (top.cp / 100).toFixed(2);
            } else if (top.mate !== undefined && top.mate !== null) {
                evalScore = `#${top.mate}`;
            } else if (top.eval && top.eval.cp !== undefined) {
                evalScore = (top.eval.cp / 100).toFixed(2);
            }

            return { bestMove: firstMoveToken, evalScore, raw: data };
        } catch (err) {
            console.error("Lichess cloud-eval fetch error:", err);
            return { bestMove: "", evalScore: "N/A", raw: null };
        }
    }

    // -------------------------
    // Execute only the best move and draw arrow
    // -------------------------
    async function executeBestMove(bestMove) {
        try {
            if (!bestMove || bestMove.length < 4) return;
            const bm = String(bestMove).replace(/^bestmove\s+/i, "").split(/\s+/)[0];
            if (!bm || bm.length < 4) return;

            const boardEl = findBoardObject();
            if (!boardEl) return;
            ensureCanvasAttached(boardEl);

            if (!drawingBoard || !drawingCtx) return;

            const dpr = window.devicePixelRatio || 1;
            const tileSize = (drawingBoard.width / dpr) / 8;
            const letters = ["a","b","c","d","e","f","g","h"];
            const fromFile = bm[0].toLowerCase(), fromRank = bm[1], toFile = bm[2].toLowerCase(), toRank = bm[3];
            const x1 = letters.indexOf(fromFile);
            const y1 = 8 - parseInt(fromRank,10);
            const x2 = letters.indexOf(toFile);
            const y2 = 8 - parseInt(toRank,10);
            if ([x1,y1,x2,y2].some(v=>isNaN(v))) return;

            // draw arrow
            drawingCtx.save();
            drawingCtx.lineWidth = Math.max(4, tileSize/6);
            drawingCtx.strokeStyle = "rgba(0,255,0,0.45)";
            drawingCtx.beginPath();
            drawingCtx.moveTo(x1*tileSize + tileSize/2, y1*tileSize + tileSize/2);
            drawingCtx.lineTo(x2*tileSize + tileSize/2, y2*tileSize + tileSize/2);
            drawingCtx.stroke();
            drawingCtx.restore();

            // auto-move if enabled
            if (window.gabi.autoMove) {
                const delay = Math.max(300, 2000 - (window.gabi.autoMoveSpeed * 160)); // slightly larger min delay for safety
                setTimeout(() => {
                    try {
                        const game = getGameObjectFromBoard(boardEl) || window.game || null;
                        const from = bm.slice(0,2);
                        const to = bm.slice(2,4);
                        if (game && typeof game.move === "function") {
                            try { game.move({from,to,animate:false,userGenerated:true}); return; } catch(e){}
                            try { game.move(from, to); return; } catch(e){}
                        }
                        // fallback click simulation
                        try {
                            const squareFrom = boardEl.querySelector(`[data-square="${from}"], [data-coords="${from}"]`);
                            const squareTo = boardEl.querySelector(`[data-square="${to}"], [data-coords="${to}"]`);
                            if (squareFrom && squareTo) {
                                squareFrom.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
                                squareTo.dispatchEvent(new MouseEvent('mouseup', {bubbles:true}));
                            }
                        } catch(e){}
                    } catch(e) { console.error("Auto-move error", e); }
                }, delay);
            }

        } catch (err) {
            console.error("executeBestMove error:", err);
        }
    }

    // -------------------------
    // Bot loop (turn-aware, Lichess cloud-eval)
    // -------------------------
    let updateBotRunning = false;
    async function updateBot() {
        if (updateBotRunning) return;
        updateBotRunning = true;

        const iterate = async () => {
            try {
                // update UI readouts
                setStateText("currentEvaluation", window.gabi.currentEvaluation);
                setStateText("bestMove", window.gabi.bestMove);

                // respect enabled flag
                if (!window.gabi.hackEnabled) {
                    updateBotRunning = false;
                    clearCanvas();
                    return;
                }

                // derive timing from updateSpeed (conservative minimum to avoid API rate limit)
                const speed = Number(window.gabi.updateSpeed) || 8;
                const intervalMs = Math.max(800, 1400 - (speed * 120)); // min 800ms between cloud-eval calls

                const FEN = findFEN();
                if (!FEN) {
                    setStateText("currentEvaluation", "no-fen");
                    setStateText("bestMove", "-");
                    clearCanvas();
                    if (updateBotRunning) setTimeout(iterate, intervalMs);
                    return;
                }

                const sideToMove = (FEN.split(" ")[1] || "w").toLowerCase(); // 'w' or 'b'
                const botTurn = (botIsWhite && sideToMove === "w") || (!botIsWhite && sideToMove === "b");

                if (botTurn) {
                    // call Lichess cloud-eval
                    const { bestMove, evalScore } = await getLichessEval(FEN, lichessMultiPv);

                    if (bestMove) {
                        window.gabi.bestMove = bestMove;
                        window.gabi.currentEvaluation = evalScore;
                        setStateText("bestMove", window.gabi.bestMove);
                        setStateText("currentEvaluation", window.gabi.currentEvaluation);
                        await executeBestMove(window.gabi.bestMove);
                    } else {
                        setStateText("bestMove", "-");
                    }
                } else {
                    // opponent turn
                    clearCanvas();
                }

                if (updateBotRunning) setTimeout(iterate, intervalMs);
            } catch (err) {
                console.error("Bot loop error:", err);
                if (updateBotRunning) setTimeout(iterate, 1200);
            }
        };

        iterate();
    }

    // Expose small API for console control
    window.gabiAPI = {
        start: ()=>{ if(!updateBotRunning) updateBot(); },
        stop: ()=>{ window.gabi.hackEnabled = 0; updateBotRunning = false; clearCanvas(); },
        state: ()=>JSON.parse(JSON.stringify(window.gabi)),
        findFEN
    };

    // Auto-start if previously enabled
    if (window.gabi.hackEnabled && !updateBotRunning) updateBot();

    // IMPORTANT: Lichess cloud-eval is a public service with rate limits and cached evaluations.
    // Use conservative updateSpeed values to avoid hitting rate limits. If you see 429 or blank responses,
    // increase the updateSpeed (lower frequency) or disable autoMove.

})();
