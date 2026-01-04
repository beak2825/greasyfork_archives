// ==UserScript==
// @name         GabiBot — Stockfish Online No Key
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Chess bot using Stockfish Online API for hints and auto-move (suitable for daily/slow games). Do not use for cheating in rated games.
// @author       thehackerclient
// @license      MIT
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @match        https://www.chess.com/daily-chess/*
// @grant        none
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553435/GabiBot%20%E2%80%94%20Stockfish%20Online%20No%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/553435/GabiBot%20%E2%80%94%20Stockfish%20Online%20No%20Key.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    // Delay startup so page finishes loading relevant chess objects
    await new Promise(r => setTimeout(r, 2000));

    alert("GabiBot — Stockfish Online Loaded!");

    // -------------------------
    // State
    // -------------------------
    window.gabi = window.gabi || {};
    window.gabi.hackEnabled = 0;
    window.gabi.botPower = 12;      // depth
    window.gabi.updateSpeed = 8;    // 1-10
    window.gabi.autoMove = 0;       // checkbox
    window.gabi.autoMoveSpeed = 4;  // 1-10
    window.gabi.bestMove = "";
    window.gabi.currentEvaluation = 0;

    // -------------------------
    // Utility functions
    // -------------------------
    function $qs(sel, root = document) { return root.querySelector(sel); }
    function getItemByName(name) { return $qs(`.gb_item[data-name="${name}"]`); }
    function setStateText(name, txt) {
        const el = getItemByName(name);
        if (!el) return;
        const state = el.querySelector(".gb_state");
        if (state) state.textContent = String(txt);
    }

    // -------------------------
    // UI
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
    <label class="gb_label">Bot Power (depth)</label>
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
        menuWrap.querySelectorAll(".gb_checkbox").forEach(cb => {
            cb.addEventListener("change", e => {
                const parent = e.target.closest(".gb_item");
                if (!parent) return;
                const name = parent.getAttribute("data-name");
                const val = e.target.checked ? 1 : 0;
                if (name === "enableHack") window.gabi.hackEnabled = val;
                if (name === "autoMove") window.gabi.autoMove = val;
                setStateText(name, val ? "On" : "Off");

                // Start bot if enabling
                if (name === "enableHack" && val && !updateBotRunning) updateBot();
            });
        });

        menuWrap.querySelectorAll(".gb_range").forEach(r => {
            r.addEventListener("input", e => {
                const parent = e.target.closest(".gb_item");
                if (!parent) return;
                const name = parent.getAttribute("data-name");
                const val = Number(e.target.value);
                setStateText(name, val);
                if (name === "botPower") window.gabi.botPower = val;
                if (name === "autoMoveSpeed") window.gabi.autoMoveSpeed = val;
                if (name === "updateSpeed") window.gabi.updateSpeed = val;
            });
        });

        // Initialize states
        setStateText("enableHack", "Off");
        setStateText("autoMove", "Off");
        setStateText("botPower", window.gabi.botPower);
        setStateText("autoMoveSpeed", window.gabi.autoMoveSpeed);
        setStateText("updateSpeed", window.gabi.updateSpeed);
        setStateText("currentEvaluation", "-");
        setStateText("bestMove", "-");

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
            if (e.key.toLowerCase() === "b" && e.ctrlKey) {
                menuHidden = !menuHidden;
                menuWrap.style.display = menuHidden ? "none" : "grid";
            }
        });
    }

    createUI();

    // -------------------------
    // Canvas / drawing arrows
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
            boardEl.style.position = boardEl.style.position || "relative";
            boardEl.appendChild(drawingBoard);
            drawingCtx = drawingBoard.getContext("2d");
        }
        drawingBoard.width = boardEl.clientWidth;
        drawingBoard.height = boardEl.clientHeight;
        return drawingBoard;
    }
    function clearCanvas() { if(drawingCtx) drawingCtx.clearRect(0,0,drawingBoard.width,drawingBoard.height); }

    // -------------------------
    // Board & game helpers
    // -------------------------
    function findBoardObject() {
        return document.querySelector(".board") || document.querySelector(".cg-board") || document.querySelector("[data-test=board]");
    }
    function getGameObjectFromBoard(boardEl) {
        try {
            if(!boardEl) return null;
            if(boardEl.game) return boardEl.game;
            if(window.game) return window.game;
            const possible = boardEl.querySelectorAll("*");
            for(let n of possible) if(n && typeof n.getFEN === "function") return n;
        } catch(e){}
        return null;
    }

    // -------------------------
    // Stockfish API call
    // -------------------------
    async function getStockfishMove(FEN, depth = 12) {
        try {
            const safeDepth = Math.min(depth, 15);
            const url = `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(FEN)}&depth=${safeDepth}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("Stockfish API error: " + resp.status);
            const data = await resp.json();
            if (!data.success) throw new Error("Stockfish API returned failure");

            const bestMove = data.bestmove ? data.bestmove.split(" ")[1] : "N/A";

            let evalScore = "N/A";
            if (data.evaluation !== undefined && data.evaluation !== null) evalScore = (data.evaluation).toFixed(2);
            else if (data.mate !== undefined && data.mate !== null) evalScore = `#${data.mate}`;

            return { bestMove, evalScore, continuation: data.continuation || "" };
        } catch (err) {
            console.error("Stockfish API fetch error:", err);
            return { bestMove: "N/A", evalScore: "N/A", continuation: "" };
        }
    }

    // -------------------------
    // Execute move + draw
    // -------------------------
    async function executeAction(bestMove) {
        try {
            clearCanvas();
            if(!bestMove || bestMove==="N/A") return;

            let bm = bestMove.startsWith("bestmove") ? bestMove.split(" ")[1] : bestMove;
            if(bm.length<4) return;

            const boardEl = findBoardObject();
            ensureCanvasAttached(boardEl);

            const tileSize = drawingBoard ? drawingBoard.clientWidth/8 : 0;
            const letters = ["a","b","c","d","e","f","g","h"];
            const x1 = letters.indexOf(bm[0]);
            const y1 = 8 - parseInt(bm[1],10);
            const x2 = letters.indexOf(bm[2]);
            const y2 = 8 - parseInt(bm[3],10);
            if([x1,y1,x2,y2].some(isNaN)) return;

            drawingCtx.save();
            drawingCtx.lineWidth = Math.max(4, tileSize/6);
            drawingCtx.strokeStyle = "rgba(0,255,0,0.45)";
            drawingCtx.beginPath();
            drawingCtx.moveTo(x1*tileSize+tileSize/2, y1*tileSize+tileSize/2);
            drawingCtx.lineTo(x2*tileSize+tileSize/2, y2*tileSize+tileSize/2);
            drawingCtx.stroke();
            drawingCtx.restore();

            if(window.gabi.autoMove) {
                const delay = Math.max(150, 2000 - (window.gabi.autoMoveSpeed*160));
                setTimeout(() => {
                    try {
                        const game = getGameObjectFromBoard(boardEl);
                        const from = bm.slice(0,2);
                        const to = bm.slice(2,4);
                        if(game && typeof game.move==="function") {
                            if(typeof game.getLegalMoves==="function") {
                                const legal = game.getLegalMoves();
                                const match = (legal||[]).find(m => m.from===from && m.to===to);
                                if(match) { game.move({...match, animate:false, userGenerated:true}); return; }
                            }
                            try { game.move({from,to,animate:false,userGenerated:true}); } catch(e){}
                        }
                    } catch(e) { console.error("Auto-move error", e); }
                }, delay);
            }

        } catch(err) { console.error("executeAction error", err); }
    }

    // -------------------------
    // Bot loop
    // -------------------------
    let updateBotRunning = false;
    async function updateBot() {
        const speed = window.gabi.updateSpeed || 8;
        const intervalMs = Math.max(400, 1100 - (speed*100));

        const timer = setTimeout(async function() {
            setStateText("currentEvaluation", window.gabi.currentEvaluation);
            setStateText("bestMove", window.gabi.bestMove);

            if(!window.gabi.hackEnabled) { clearTimeout(timer); updateBotRunning=false; clearCanvas(); return; }
            updateBotRunning = true;

            try {
                const boardEl = findBoardObject();
                const gameObj = getGameObjectFromBoard(boardEl);
                let FEN = null;
                if(gameObj && typeof gameObj.getFEN==="function") FEN = gameObj.getFEN();
                if(!FEN && gameObj && gameObj.fen) FEN = gameObj.fen;
                if(!FEN && boardEl) FEN = boardEl.getAttribute("data-fen") || boardEl.dataset?.fen;
                if(!FEN && window.fen) FEN = window.fen;

                if(FEN) {
                    const {bestMove, evalScore} = await getStockfishMove(FEN, window.gabi.botPower);
                    window.gabi.bestMove = `bestmove ${bestMove}`;
                    window.gabi.currentEvaluation = evalScore;

                    setStateText("bestMove", window.gabi.bestMove);
                    setStateText("currentEvaluation", window.gabi.currentEvaluation);
                    await executeAction(window.gabi.bestMove);
                }

            } catch(e){ console.error("Bot loop error:", e); }

            if(updateBotRunning) requestAnimationFrame(()=>{ if(updateBotRunning) updateBot(); });
        }, intervalMs);
    }

    // Expose API
    window.gabiAPI = {
        start: ()=>{ if(!updateBotRunning) updateBot(); },
        stop: ()=>{ window.gabi.hackEnabled=0; updateBotRunning=false; clearCanvas(); },
        state: ()=>JSON.parse(JSON.stringify(window.gabi))
    };

})();
