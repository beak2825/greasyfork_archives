// ==UserScript==
// @name         Chess.com Stockfish Auto Move
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Auto-play best Stockfish moves with UI controls
// @author       Omkar04
// @match        https://www.chess.com/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource     STOCKFISH https://cdn.jsdelivr.net/gh/niklasf/stockfish.js/stockfish.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/548147/Chesscom%20Stockfish%20Auto%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/548147/Chesscom%20Stockfish%20Auto%20Move.meta.js
// ==/UserScript==

(function () {
    "use strict";


    // =====================
    // Config
    // =====================
    const DEFAULT_DELAY = 100;
    const MIN_DELAY = 10;
    const MAX_DELAY = 10000;
    const DEFAULT_DEPTH = 12;

    // =====================
    // State
    // =====================
    let enabled = false;
    let autoMove = false;
    let autoMoveDelay = DEFAULT_DELAY;
    let depth = DEFAULT_DEPTH;
    let markMove = true;
    let menuShown = true;
    let thinking = false;
    let lastFEN;

    // =====================
    // Utils
    // =====================
    const qs = (sel) => document.querySelector(sel);

    function setText(id, text) {
        const el = qs(id);
        if (el) el.textContent = text;
    }

    function getBoard() {
        return qs(".board")?.game || null;
    }

    // =====================
    // Stockfish setup
    // =====================
    const sfCode = GM_getResourceText("STOCKFISH");
    const sf = new Worker(URL.createObjectURL(new Blob([sfCode], { type: "application/javascript" })));
    console.log("✅ Stockfish loaded");

    sf.onmessage = (e) => {
        const line = e.data;
        if (!line.startsWith("bestmove")) return;

        thinking = false;
        const [ , bestMove ] = line.split(" ");
        if (!bestMove || bestMove.length < 4) return;

        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promo = bestMove[4] || "q";

        console.log("🔥 Best move:", from, "→", to, "promo:", promo);
        setText("#sf-bestmove", getSan(bestMove));

        if (autoMove) {
            movePiece(from, to, promo);
        } else if (markMove) {
            drawArrow({ f: from, t: to });
        }
    };

    // =====================
    // UI Panel
    // =====================
    const panel = document.createElement("div");
    panel.id = "sf-panel";
    panel.innerHTML = `
      <h3>♟️ Stockfish</h3>
      Best Move: <i id="sf-bestmove"></i><br>
      <button id="sf-toggle" class="off">▶ Enable Cheat</button><br>
      <button id="sf-clearmarkings">Clear Arrow Marking</button><br>
      Depth:
      <select id="sf-depth">
          ${[4, 6, 8, 10, 12, 15, 18, 20, 22, 24].map(d =>
              `<option value="${d}" ${d === DEFAULT_DEPTH ? "selected" : ""}>${d}</option>`
          ).join("")}
      </select><br>
      <label for="sf-amdelay">Auto Move Delay (ms):</label><br>
      <div style="display:flex; align-items:center; gap:6px;">
        <input type="number" id="sf-amdelay" value="${DEFAULT_DELAY}">
        <button id="sf-dconf">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
      <label><input type="checkbox" id="sf-automove"> Auto Move</label><br>
      <label><input type="checkbox" id="sf-markmove" checked> Mark Move</label>
      <p>Press F1 to show/hide menu</p>
    `;
    document.documentElement.appendChild(panel);

    // =====================
    // UI Styles
    // =====================
    GM_addStyle(`
      #sf-panel {
          position: fixed;
          top: 100px;
          right: 20px;
          width: 200px;
          background: rgba(0,0,0,0.85);
          color: white;
          padding: 10px;
          border-radius: 8px;
          z-index: 999999;
          font-size: 14px;
          font-family: Arial, sans-serif;
      }
      #sf-panel button, #sf-panel select, #sf-panel input[type="checkbox"] {
          margin: 4px 0;
          padding: 4px;
      }
      #sf-toggle.off { background-color: #43d15d; }
      #sf-toggle.on  { background-color: #d14343; }
      #sf-toggle     { border-radius: 12px; border: 2px solid #fff; }
      button:hover   { filter: brightness(0.9); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
      #sf-amdelay    { width: 150px; height: 30px; border: 2px solid #fff; border-radius: 10px; padding-left: 6px; }
      #sf-dconf {
          height: 30px;
          width: 34px;
          border-radius: 50%;
          background-color: #43d15d;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
      }
      #sf-dconf:hover {
          transform: scale(1.1);
          background-color: #36b94f;
      }
      #sf-dconf svg {
          width: 16px;
          height: 16px;
          stroke: white;
          stroke-width: 3;
          fill: none;
      }
      p { font-size: 10px; color: grey; }
    `);

    // =====================
    // UI Events
    // =====================
    qs("#sf-toggle").onclick = () => {
        enabled = !enabled;
        qs("#sf-toggle").className = enabled ? "on" : "off";
        qs("#sf-toggle").textContent = enabled ? "⏸ Disable Cheat" : "▶ Enable Cheat";
    };

    qs("#sf-clearmarkings").onclick = () => drawArrow({ remove: true });

    qs("#sf-depth").onchange = (e) => depth = parseInt(e.target.value);

    qs("#sf-dconf").onclick = () => {
        let val = parseInt(qs("#sf-amdelay").value);
        if (isNaN(val)) val = DEFAULT_DELAY;
        if (val < MIN_DELAY) val = MIN_DELAY;
        if (val > MAX_DELAY) val = MAX_DELAY;
        autoMoveDelay = val;
        qs("#sf-amdelay").value = val;
    };

    qs("#sf-automove").onchange = (e) => autoMove = e.target.checked;
    qs("#sf-markmove").onchange = (e) => markMove = e.target.checked;

    document.addEventListener("keydown", (e) => {
        if (e.key === "F1") {
            e.preventDefault();
            menuShown = !menuShown;
            qs("#sf-panel").style.display = menuShown ? "block" : "none";
        }
    });

    // =====================
    // Helpers
    // =====================
    function getSan(uciMove) {
        const game = getBoard();
        if (!game) return "";
        const chess = new Chess(game.getFEN());
        const move = { from: uciMove.slice(0, 2), to: uciMove.slice(2, 4) };
        if (uciMove.length === 5) move.promotion = uciMove[4];
        return chess.move(move)?.san || uciMove;
    }

    function drawArrow({ f, t, color = "blue", o = 1, remove = false } = {}) {
        const game = getBoard();
        if (!game) return;
        if (remove) return game.markings.removeAll();

        game.markings.addOne({
            data: { keyPressed: "none", from: f, to: t, opacity: o },
            type: "arrow"
        });
        setTimeout(() => {
            const arrow = qs(`#arrow-${f}${t}`);
            if (arrow) arrow.style.fill = color;
        }, 10);
    }

    function movePiece(from, to, promotion = "q") {
        const game = getBoard();
        if (!game) return false;
        const legal = game.getLegalMoves();
        const move = legal.find(m => m.from === from && m.to === to);
        if (!move) return false;

        setTimeout(() => {
            game.move({ ...move, promotion, animate: true, userGenerated: true });
        }, autoMoveDelay);

        console.log("✅ Played:", from, "→", to);
        return true;
    }

    // =================================
    // Attempt to remove all the ads
    // =================================
    function removeAds() {
        document.querySelectorAll("[id^='google_ads_iframe'], [id*='__container__'], .ad-slot, .ad-container, .ad-banner, .ad-block")
            .forEach(el => el.remove());
    }

    function startAdObserver() {
        removeAds();

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (
                        node.id?.startsWith("google_ads_iframe") ||
                        node.id?.includes("__container__") ||
                        node.classList?.contains("ad-slot") ||
                        node.classList?.contains("ad-container") ||
                        node.classList?.contains("ad-banner") ||
                        node.classList?.contains("ad-block")
                    ) {
                        node.remove();
                    }

                    removeAds();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.body) {
        startAdObserver();
    } else {
        window.addEventListener("DOMContentLoaded", startAdObserver);
    }

    // =====================
    // Main loop
    // =====================
    setInterval(() => {
        if (!enabled) return;

        const game = getBoard();
        if (!game || game.isGameOver()) return;

        const fen = game.getFEN();
        if (fen !== lastFEN) {
            lastFEN = fen;
            drawArrow({ remove: true });
        }

        if (game.getTurn() === game.getPlayingAs()) {
            if (thinking) return;
            console.log("⏳ Thinking... depth", depth, "FEN:", fen);
            setText("#sf-bestmove", "⏳ Thinking...");
            sf.postMessage("position fen " + fen);
            sf.postMessage("go depth " + depth);
            thinking = true;
        } else {
            drawArrow({ remove: true });
        }
    }, 1000);
})();
