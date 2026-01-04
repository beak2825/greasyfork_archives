// ==UserScript==
// @name         Chess.com Bot — v2.1
// @namespace    thehackerclient
// @version      3.6
// @description  Improved userscript: top 3 moves & threats, persistent settings, debounce/throttle, safer engine lifecycle, promotion handling, better board detection, min/max delay
// @match        https://www.chess.com/*
// @auther       thehackerclient
// @grant        GM_getResourceText
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @resource     stockfish.js https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550809/Chesscom%20Bot%20%E2%80%94%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/550809/Chesscom%20Bot%20%E2%80%94%20v21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. Configuration and State Management
    // -------------------------------------------------------------------------

    const STORAGE_KEY = 'chess_bot_settings_v4';
    const DEFAULTS = {
        autoRun: true,
        autoMovePiece: false,
        delayMin: 0.5,
        delayMax: 2.0,
        lastDepth: 18,
        showPV: true,
        showEvalBar: true,
        showAdvancedThreats: true,
        highlightMs: 2000,
        colors: {
            move1: 'rgba(235, 97, 80, 0.7)',
            move2: 'rgba(255, 165, 0, 0.6)',
            move3: 'rgba(255, 255, 0, 0.5)',
            threat: 'rgba(0, 128, 255, 0.35)',
            undefended: 'rgba(255, 0, 255, 0.6)',
            blunder: 'rgba(255, 0, 0, 0.7)',
            mistake: 'rgba(255, 128, 0, 0.7)',
            inaccuracy: 'rgba(255, 255, 0, 0.7)',
            checkmate: 'rgba(255, 69, 0, 0.8)'
        }
    };

    // Error classification thresholds (Centipawn drops)
    const ERROR_THRESHOLDS = {
        BLUNDER: 200,    // Score drops by > 200 cp
        MISTAKE: 100,    // Score drops by > 100 cp
        INACCURACY: 50   // Score drops by > 50 cp
    };

    let settings = {};
    let board = null;
    let stockfishObjectURL = null;

    /**
     * Handles settings loading and initialization.
     */
    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            let loadedSettings = saved ? JSON.parse(saved) : {};
            settings = Object.assign({}, DEFAULTS, loadedSettings);
            settings.autoMovePiece = false;
            settings.delayMin = parseFloat(settings.delayMin) || DEFAULTS.delayMin;
            settings.delayMax = parseFloat(settings.delayMax) || DEFAULTS.delayMax;
            settings.lastDepth = parseInt(settings.lastDepth) || DEFAULTS.lastDepth;
            if (settings.delayMin > settings.delayMax) {
                settings.delayMax = settings.delayMin;
            }
            console.log('Bot Settings Loaded:', settings);
        } catch (e) {
            console.error('Error loading settings, using defaults.', e);
            settings = DEFAULTS;
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings to localStorage.', e);
        }
    }

    loadSettings();

    // -------------------------------------------------------------------------
    // 2. Utility Functions (DOM, Board Mapping)
    // -------------------------------------------------------------------------

    function throttle(fn, wait) {
        let last = 0;
        return function (...a) {
            const now = Date.now();
            if (now - last > wait) {
                last = now;
                fn.apply(this, a);
            }
        };
    }

    function findBoard() {
        return document.querySelector('chess-board') ||
               document.querySelector('wc-chess-board') ||
               document.querySelector('[data-cy="board"]') ||
               null;
    }

    function mapSquareForBoard(sq) {
        if (!board || !sq || sq.length < 2) return sq;
        const isFlipped = board.classList && board.classList.contains('flipped');
        if (!isFlipped) return sq;
        const file = sq[0];
        const rank = sq[1];
        const flippedFile = String.fromCharCode('h'.charCodeAt(0) - (file.charCodeAt(0) - 'a'.charCodeAt(0)));
        const flippedRank = (9 - parseInt(rank)).toString();
        return flippedFile + flippedRank;
    }

    function getBoardSquareEl(sq) {
        try {
            return board.querySelector(`[data-square="${sq}"]`);
        } catch (e) {
            return null;
        }
    }

    // -------------------------------------------------------------------------
    // 3. Game Analysis Class
    // -------------------------------------------------------------------------

    class GameAnalyzer {
        constructor() {
            // Stores analysis history: {fen, move, cpBefore, cpAfter, scoreDrop, errorType, turn}
            this.gameHistory = [];
            this.lastAnalyzedFen = null;
            this.currentTurn = 'w';
        }

        /**
         * Classifies the severity of an error based on centipawn drop.
         * @param {number} drop The absolute drop in centipawns.
         * @param {number} cpBefore The evaluation before the move.
         * @returns {string} The error type ('Blunder', 'Mistake', 'Inaccuracy', 'Good', 'Excellent').
         */
        classifyError(drop, cpBefore) {
            if (drop >= ERROR_THRESHOLDS.BLUNDER) {
                return 'Blunder';
            } else if (drop >= ERROR_THRESHOLDS.MISTAKE) {
                return 'Mistake';
            } else if (drop >= ERROR_THRESHOLDS.INACCURACY) {
                return 'Inaccuracy';
            } else {
                return 'Good';
            }
        }

        /**
         * Clears history and resets for a new game.
         */
        reset() {
            this.gameHistory = [];
            this.lastAnalyzedFen = null;
            this.currentTurn = 'w';
            document.getElementById('analysisReport').innerHTML = this.getReportHTML();
        }

        /**
         * Processes an actual move made by a player and compares its outcome to the best move.
         * This function is called AFTER a move has been played and the new FEN is ready for analysis.
         * @param {string} prevFen The FEN before the move was played.
         * @param {string} actualMove The UCI move played (e.g., 'e2e4').
         * @param {number} cpBefore The *best* evaluation of the previous position (prevFen).
         * @param {number} cpAfter The *best* evaluation of the new position (currentFen).
         */
        recordMoveAnalysis(prevFen, actualMove, cpBefore, cpAfter) {
            if (prevFen === this.lastAnalyzedFen) return;
            this.lastAnalyzedFen = prevFen;

            // Get the score from the perspective of the player who just moved
            // White moves: cpBefore is White's score, cpAfter is White's score
            // Black moves: cpBefore is Black's score (-cp), cpAfter is Black's score (-cp)

            // Score from the perspective of the player whose turn it WAS (White if turn 'w')
            const playerPerspectiveBefore = this.currentTurn === 'w' ? cpBefore : -cpBefore;
            // Score from the perspective of the player whose turn it IS NOT (White if turn 'w')
            const playerPerspectiveAfter = this.currentTurn === 'w' ? cpAfter : -cpAfter;

            // Drop is the difference between the *optimal* score and the score *after* the move.
            const scoreDrop = playerPerspectiveBefore - playerPerspectiveAfter;

            // Check for missed wins (a large score drop into a neutral or losing position)
            const errorType = this.classifyError(scoreDrop, playerPerspectiveBefore);

            // Record the move
            this.gameHistory.push({
                fen: prevFen,
                move: actualMove,
                cpBefore: cpBefore,
                cpAfter: cpAfter,
                scoreDrop: scoreDrop,
                errorType: errorType,
                turn: this.currentTurn
            });

            // Toggle turn for next move
            this.currentTurn = this.currentTurn === 'w' ? 'b' : 'w';
        }

        /**
         * Generates the analysis report HTML.
         */
        getReportHTML() {
            const stats = {
                w: { Blunder: 0, Mistake: 0, Inaccuracy: 0, Total: 0 },
                b: { Blunder: 0, Mistake: 0, Inaccuracy: 0, Total: 0 }
            };

            const worstMoves = [];

            this.gameHistory.forEach((move, index) => {
                const player = move.turn;
                if (move.errorType !== 'Good') {
                    stats[player][move.errorType]++;
                    stats[player].Total++;
                    worstMoves.push({
                        moveNumber: Math.floor(index / 2) + 1,
                        ...move
                    });
                }
            });

            worstMoves.sort((a, b) => b.scoreDrop - a.scoreDrop);

            const errorsDisplay = (player) => `
                <div style="font-size:14px; margin-top:5px; padding-left:10px; border-left:3px solid ${player === 'w' ? '#f7f7f7' : '#333'};">
                    <span style="font-weight:700; color:${player === 'w' ? '#2c3e50' : '#2c3e50'};">${player === 'w' ? 'White' : 'Black'} (${stats[player].Total} Errors)</span>
                    <br>
                    <span style="color:${settings.colors.blunder};">Blunders: ${stats[player].Blunder}</span>,
                    <span style="color:${settings.colors.mistake};">Mistakes: ${stats[player].Mistake}</span>,
                    <span style="color:${settings.colors.inaccuracy};">Inaccuracies: ${stats[player].Inaccuracy}</span>
                </div>
            `;

            const worstMovesList = worstMoves.slice(0, 3).map(move => {
                const drop = (move.scoreDrop / 100).toFixed(2);
                const color = settings.colors[move.errorType.toLowerCase()];
                return `<li style="margin-top:5px; color:${color};">
                    ${move.moveNumber}. ${move.turn === 'w' ? 'W' : 'B'}: ${move.move}
                    (<span style="font-weight:700;">${move.errorType}</span>, dropped ${drop})
                </li>`;
            }).join('');

            return `
                <div style="margin-top:15px; padding-top:10px; border-top:1px solid #eee;">
                    <div style="font-weight:700; margin-bottom:10px; color:#2c3e50; font-size:16px;">Game Analysis Summary</div>

                    ${errorsDisplay('w')}
                    ${errorsDisplay('b')}

                    <div style="margin-top:15px;">
                        <div style="font-weight:700; color:#c0392b;">Top 3 Worst Moves/Missed Opportunities:</div>
                        <ul style="list-style:disc; margin-left:15px; padding-left:0; font-size:14px;">
                            ${worstMovesList || '<li>No major errors recorded yet.</li>'}
                        </ul>
                    </div>
                </div>
            `;
        }
    }


    // -------------------------------------------------------------------------
    // 4. Stockfish Engine Management Class
    // -------------------------------------------------------------------------

    class StockfishManager {
        constructor(callback) {
            this.worker = null;
            this.onEngineData = callback;
            this.isThinking = false;
            this.lastFen = '';
            this.candidateMoves = [];
            this.currentEval = 0;
            this.checkmateIn = null;
            this.initWorker();
        }

        parseScore(match) {
            if (!match) return 0;
            const type = match[1];
            const val = parseInt(match[2]);
            if (type === 'cp') {
                return val;
            }
            this.checkmateIn = Math.abs(val);
            return val > 0 ? 100000 - val : -100000 - val;
        }

        handleEngineMessage(msg) {
            if (typeof msg !== 'string') return;

            if (msg.startsWith('info') && msg.includes('pv')) {
                const pvTokens = msg.split(' pv ')[1].trim().split(/\s+/);
                if (pvTokens && pvTokens.length) {
                    const move = pvTokens[0];
                    const scoreMatch = msg.match(/score (cp|mate) (-?\d+)/);
                    this.checkmateIn = null;
                    const score = this.parseScore(scoreMatch);
                    const depthMatch = msg.match(/depth (\d+)/);
                    const depth = depthMatch ? parseInt(depthMatch[1]) : settings.lastDepth;

                    const exists = this.candidateMoves.find(c => c.move === move);
                    if (!exists) {
                        this.candidateMoves.push({ move, score, depth, pv: pvTokens });
                    } else if (depth > exists.depth) {
                        exists.score = score;
                        exists.depth = depth;
                        exists.pv = pvTokens;
                    }

                    this.candidateMoves.sort((a, b) => b.score - a.score);
                    this.candidateMoves = this.candidateMoves.slice(0, 3);
                    this.currentEval = this.candidateMoves[0]?.score || 0;
                    this.onEngineData({ type: 'info', moves: this.candidateMoves, eval: this.currentEval, mate: this.checkmateIn, fen: this.lastFen });
                }
            }

            if (msg.startsWith('bestmove')) {
                this.isThinking = false;
                const bestMoveUCI = msg.split(' ')[1];
                this.onEngineData({ type: 'bestmove', move: bestMoveUCI, moves: this.candidateMoves, eval: this.currentEval, mate: this.checkmateIn, fen: this.lastFen });

                if (settings.autoMovePiece && bestMoveUCI && bestMoveUCI !== '(none)') {
                    this.performMove(bestMoveUCI);
                }
            }
        }

        initWorker() {
            try {
                if (stockfishObjectURL === null) {
                    const text = GM_getResourceText('stockfish.js');
                    stockfishObjectURL = URL.createObjectURL(new Blob([text], { type: 'application/javascript' }));
                }

                if (this.worker) this.worker.terminate();
                this.worker = new Worker(stockfishObjectURL);
                this.worker.onmessage = e => this.handleEngineMessage(e.data);
                this.worker.postMessage('ucinewgame');
                this.worker.postMessage('setoption name Threads value 4');
                this.worker.postMessage('isready');
                console.log('Stockfish worker created and initialized.');
            } catch (err) {
                console.error('Failed to create Stockfish worker', err);
            }
        }

        safeRestart() {
            this.isThinking = false;
            this.lastFen = '';
            this.candidateMoves = [];
            this.currentEval = 0;
            this.checkmateIn = null;
            try {
                if (this.worker) this.worker.terminate();
            } catch (e) { /* ignore */ }
            this.initWorker();
        }

        runAnalysis(fen, depth) {
            if (!this.worker) {
                this.initWorker();
                return;
            }

            if (this.isThinking && fen === this.lastFen) return;
            this.lastFen = fen;

            this.worker.postMessage('stop');
            this.candidateMoves = [];
            this.currentEval = 0;
            this.checkmateIn = null;

            this.worker.postMessage('position fen ' + fen);
            this.isThinking = true;
            this.worker.postMessage('go depth ' + depth);
            console.log(`Starting analysis for FEN: ${fen} at depth ${depth}`);
        }

        performMove(moveUCI) {
            if (!board || !board.game) return;
            try {
                const from = moveUCI.slice(0, 2);
                const to = moveUCI.slice(2, 4);
                const promotion = moveUCI.length > 4 ? moveUCI[4] : null;

                const legal = board.game.getLegalMoves();
                let foundMove = null;

                for (const m of legal) {
                    if (m.from === from && m.to === to) {
                        foundMove = m;
                        if (m.promotion && promotion) {
                            foundMove.promotion = promotion;
                        }
                        break;
                    }
                }

                if (foundMove) {
                    const moveObj = Object.assign({}, foundMove, { animate: true, userGenerated: true });
                    board.game.move(moveObj);
                    console.log('Bot performed move:', moveUCI);
                } else {
                    console.warn(`Could not find legal move object for UCI: ${moveUCI}`);
                }
            } catch (e) {
                console.error('performMove failed', e);
            }
        }
    }

    // -------------------------------------------------------------------------
    // 5. Board Visualizer & UI Class
    // -------------------------------------------------------------------------

    class BoardVisualizer {
        constructor(engine) {
            this.engine = engine;
            this.pvNoteTimeout = null;
            this.highlightTimeouts = [];
            this.evalBar = null;
            this.initStyles();
        }

        initStyles() {
            const style = document.createElement('style');
            style.id = 'bot_analysis_styles_v4';
            style.innerHTML = `
                /* Base Styles for UI elements */
                #botGUI_v4 {
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px;
                    margin: 8px;
                    max-width: 300px;
                    font-family: 'Inter', Arial, sans-serif;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }

                /* Highlight Overlays */
                .botMoveHighlight, .botThreatHighlight, .botUndefendedHighlight {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 60;
                    border-radius: 4px;
                    opacity: 1;
                    transition: opacity ${settings.highlightMs / 4000}s ease-out;
                }

                .botUndefendedHighlight {
                    border: 3px dashed ${settings.colors.undefended};
                    background: transparent !important;
                    box-sizing: border-box;
                }

                /* Evaluation Bar Container */
                #evalBarContainer {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 24px;
                    height: 100%;
                    z-index: 999;
                    overflow: hidden;
                    border-radius: 6px;
                    margin-left: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                /* Evaluation Bar Inner Elements */
                #evalBarWhite, #evalBarBlack {
                    position: absolute;
                    width: 100%;
                    transition: height 0.5s ease;
                }
                #evalBarWhite {
                    background-color: #f7f7f7; /* White advantage */
                    bottom: 0;
                }
                #evalBarBlack {
                    background-color: #333333; /* Black advantage */
                    top: 0;
                }

                #evalBarText {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 10px;
                    font-weight: bold;
                    color: #fff;
                    z-index: 100;
                    text-shadow: 0 0 3px rgba(0,0,0,0.8);
                }

                /* PV Notes (Top 3 Moves) inside the board container */
                .pvNote {
                    padding: 6px 8px;
                    border-radius: 6px;
                    color: #fff;
                    z-index: 120;
                    font-size: 12px;
                    pointer-events: none;
                    white-space: nowrap;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    position: absolute; /* Critical for positioning inside board parent */
                    right: 10px;
                }
            `;
            document.head.appendChild(style);
        }

        attachHighlight(el, cls, color) {
            if (!el) return null;
            let overlay = el.querySelector('.' + cls);
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = cls;
                overlay.style.backgroundColor = color;
                el.appendChild(overlay);
            }
            return overlay;
        }

        detachHighlights(selector = '.botMoveHighlight, .botThreatHighlight, .botUndefendedHighlight, .pvNote') {
            try {
                document.querySelectorAll(selector).forEach(n => {
                    if (n.parentElement) n.parentElement.removeChild(n);
                });
                this.highlightTimeouts.forEach(t => clearTimeout(t));
                this.highlightTimeouts = [];
            } catch (e) { /* ignore errors during cleanup */ }
        }

        showAnalysis(candidateMoves, currentEval, checkmateIn) {
            if (!board || !board.game) return;

            this.detachHighlights();
            this.updateEvalBar(currentEval, checkmateIn);

            candidateMoves.forEach((cm, i) => {
                const isCheckmate = checkmateIn !== null && i === 0;

                const from = mapSquareForBoard(cm.move.slice(0, 2));
                const to = mapSquareForBoard(cm.move.slice(2, 4));
                const color = isCheckmate ? settings.colors.checkmate :
                    (i === 0 ? settings.colors.move1 : (i === 1 ? settings.colors.move2 : settings.colors.move3));

                [from, to].forEach(sq => {
                    const el = getBoardSquareEl(sq);
                    if (el) {
                        const ov = this.attachHighlight(el, 'botMoveHighlight', color);
                        const t = setTimeout(() => {
                            if (ov && ov.parentElement) ov.parentElement.removeChild(ov);
                        }, settings.highlightMs);
                        this.highlightTimeouts.push(t);
                    }
                });

                if (settings.showPV) {
                    this.addPVNote(cm, i, isCheckmate, checkmateIn);
                }
            });

            if (settings.showAdvancedThreats) {
                this.showThreatsAndUndefended();
            }
        }

        /**
         * Adds a Principal Variation note in the TOP RIGHT CORNER of the board.
         */
        addPVNote(cm, index, isMate, mateIn) {
            try {
                const id = `pvNote-${index}`;
                let note = document.getElementById(id);
                const container = board.parentElement;

                if (!note) {
                    note = document.createElement('div');
                    note.id = id;
                    note.className = 'pvNote';

                    // Position: TOP RIGHT CORNER OF THE BOARD
                    Object.assign(note.style, {
                        top: `${10 + index * 28}px`,
                        background: isMate ? settings.colors.checkmate : 'rgba(0,0,0,0.75)',
                    });

                    container.appendChild(note);
                }

                let scoreText;
                if (isMate) {
                    scoreText = `M${mateIn}`;
                } else {
                    scoreText = (cm.score / 100).toFixed(2);
                }

                note.innerText = `#${index + 1}: ${scoreText} | ${cm.move} PV: ${cm.pv.slice(0, 5).join(' ')}`;
                note.style.background = isMate ? settings.colors.checkmate : 'rgba(0,0,0,0.75)';

                if (this.pvNoteTimeout) clearTimeout(this.pvNoteTimeout);
                this.pvNoteTimeout = setTimeout(() => {
                    this.detachHighlights('.pvNote');
                }, settings.highlightMs + 500);
            } catch (e) {
                console.error('Failed to add PV note', e);
            }
        }

        showThreatsAndUndefended() {
            if (!board || !board.game || !settings.showAdvancedThreats) return;

            try {
                const game = board.game;
                const turn = game.getTurn();
                const opponent = turn === 'w' ? 'b' : 'w';

                const allLegalMoves = game.getLegalMoves();
                const opponentMoves = allLegalMoves.filter(m => game.get(m.from)?.color === opponent);

                opponentMoves.forEach(m => {
                    const sq = mapSquareForBoard(m.to);
                    const el = getBoardSquareEl(sq);
                    if (el) {
                        const ov = this.attachHighlight(el, 'botThreatHighlight', settings.colors.threat);
                        const t = setTimeout(() => {
                            if (ov && ov.parentElement) ov.parentElement.removeChild(ov);
                        }, settings.highlightMs);
                        this.highlightTimeouts.push(t);

                        const targetPiece = game.get(m.to);
                        if (targetPiece && targetPiece.color === turn) {
                            const undefendedEl = getBoardSquareEl(sq);
                            if (undefendedEl) {
                                const undefendedOv = this.attachHighlight(undefendedEl, 'botUndefendedHighlight', settings.colors.undefended);
                                const t2 = setTimeout(() => {
                                    if (undefendedOv && undefendedOv.parentElement) undefendedOv.parentElement.removeChild(undefendedOv);
                                }, settings.highlightMs * 2);
                                this.highlightTimeouts.push(t2);
                            }
                        }
                    }
                });

            } catch (e) {
                console.warn('Failed to show advanced threats', e);
            }
        }

        setupEvalBar() {
            if (this.evalBar) return;

            const boardContainer = document.querySelector('.main-board-container') ||
                                   document.querySelector('.live-game-board') ||
                                   document.querySelector('.board-viewer-component') ||
                                   board.parentElement;

            if (!boardContainer) {
                console.warn('Could not find suitable container for Eval Bar.');
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.id = 'evalBarContainer';
            wrapper.style.position = 'absolute';
            wrapper.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            wrapper.style.marginLeft = '12px';
            wrapper.style.height = '100%';
            wrapper.style.bottom = '0';
            wrapper.style.right = '-36px';

            let relativeParent = boardContainer;
            if (getComputedStyle(relativeParent).position === 'static') {
                relativeParent.style.position = 'relative';
            }

            relativeParent.appendChild(wrapper);

            wrapper.innerHTML = `
                <div id="evalBar" style="height:100%; width:100%; position:relative; overflow:hidden; border-radius:6px;">
                    <div id="evalBarBlack" style="height: 50%; width: 100%;"></div>
                    <div id="evalBarWhite" style="height: 50%; width: 100%; top: 50%; position: absolute;"></div>
                    <div id="evalBarText">0.0</div>
                </div>
            `;
            this.evalBar = {
                container: wrapper,
                whiteBar: wrapper.querySelector('#evalBarWhite'),
                blackBar: wrapper.querySelector('#evalBarBlack'),
                text: wrapper.querySelector('#evalBarText')
            };
            this.updateEvalBar(0, null);
        }

        /**
         * Updates the visual state of the evaluation bar using a percentage map.
         * White advantage is mapped from 50% to 100%. Black advantage is 50% down to 0%.
         */
        updateEvalBar(cpScore, mateIn) {
            if (!this.evalBar || !settings.showEvalBar) {
                if (this.evalBar) this.evalBar.container.style.display = 'none';
                return;
            }

            this.evalBar.container.style.display = 'block';

            let percentage;
            let displayScore;

            if (mateIn !== null) {
                displayScore = `M${mateIn}`;
                percentage = cpScore > 0 ? 100 : 0;
            } else {
                displayScore = (cpScore / 100).toFixed(1);

                // Use a sigmoid function (simpler, effective) to map score to percentage
                // P_white = 100 / (1 + e^(-k * cpScore))
                const K = 0.004;
                percentage = 100 / (1 + Math.exp(-K * cpScore));
            }

            percentage = Math.max(0, Math.min(100, percentage));

            let whiteHeight = percentage;
            let blackHeight = 100 - percentage;

            // Adjust colors based on board flip
            const isFlipped = board.classList.contains('flipped');
            if (isFlipped) {
                this.evalBar.whiteBar.style.backgroundColor = '#333333'; // Black on bottom (White's bar shows Black advantage)
                this.evalBar.blackBar.style.backgroundColor = '#f7f7f7'; // White on top (Black's bar shows White advantage)
            } else {
                this.evalBar.whiteBar.style.backgroundColor = '#f7f7f7'; // White on bottom
                this.evalBar.blackBar.style.backgroundColor = '#333333'; // Black on top
            }

            // Apply calculated heights (logic remains the same)
            this.evalBar.whiteBar.style.height = `${whiteHeight}%`;
            this.evalBar.blackBar.style.height = `${blackHeight}%`;
            this.evalBar.whiteBar.style.top = `${blackHeight}%`;

            // Text color logic
            if (percentage > 70) {
                this.evalBar.text.style.color = isFlipped ? '#f7f7f7' : '#333'; // Text visible over white bar area
            } else if (percentage < 30) {
                this.evalBar.text.style.color = isFlipped ? '#333' : '#f7f7f7'; // Text visible over black bar area
            } else {
                this.evalBar.text.style.color = '#fff';
            }

            this.evalBar.text.innerText = displayScore;
        }
    }


    // -------------------------------------------------------------------------
    // 6. GUI & Settings Management Class
    // -------------------------------------------------------------------------

    class GUIManager {
        constructor(engine, visualizer, analyzer) {
            this.engine = engine;
            this.visualizer = visualizer;
            this.analyzer = analyzer;
            this.container = null;
        }

        initGUI() {
            board = findBoard();
            if (!board) return false;
            if (document.getElementById('botGUI_v4')) return true;

            const parent = document.querySelector('.main-board-container') || board.parentElement.parentElement || document.body;

            this.container = document.createElement('div');
            this.container.id = 'botGUI_v4';
            this.container.style.maxWidth = '300px';

            this.container.innerHTML = `
                <div style="font-weight:700;margin-bottom:10px;font-size:16px;color:#2c3e50;">♟️ Deep Chess Analysis v4.0</div>

                <!-- Depth Control -->
                <div id="depthControl" style="margin-bottom:12px;">
                    <div id="depthText" style="margin-bottom:4px; font-weight:600;">Search Depth: <strong style="color:#2980b9;">${settings.lastDepth}</strong></div>
                    <input type="range" id="depthSlider" min="5" max="30" value="${settings.lastDepth}" step="1">
                </div>

                <!-- Main Toggles -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #eee;">
                    <div><input type="checkbox" id="autoRunCB" style="margin-right:5px;"> <label for="autoRunCB" style="font-size:14px;">Continuous Analysis</label></div>
                    <div><input type="checkbox" id="autoMoveCB" style="margin-right:5px;"> <label for="autoMoveCB" style="font-size:14px; color:#c0392b;">Auto Move (Bot Play)</label></div>
                    <div><input type="checkbox" id="showEvalBarCB" style="margin-right:5px;"> <label for="showEvalBarCB" style="font-size:14px;">Show Eval Bar (%)</label></div>
                    <div><input type="checkbox" id="showAdvThreatsCB" style="margin-right:5px;"> <label for="showAdvThreatsCB" style="font-size:14px;">Tactical Highlights</label></div>
                </div>

                <!-- Delay Control (Hidden if not relevant, kept for settings persistence) -->
                <div id="delaySection" style="margin-bottom:12px; display:none;">
                    <div style="font-weight:600; margin-bottom:4px;">Auto-Move Delay (seconds):</div>
                    <div style="display:flex; gap:10px;">
                        Min: <input id="delayMinInput" type="number" min="0" step="0.1" value="${settings.delayMin}" style="width:70px; padding:4px; border:1px solid #ccc; border-radius:4px;">
                        Max: <input id="delayMaxInput" type="number" min="0" step="0.1" value="${settings.delayMax}" style="width:70px; padding:4px; border:1px solid #ccc; border-radius:4px;">
                    </div>
                </div>

                <!-- Analysis Report Section -->
                <div id="analysisReport">${this.analyzer.getReportHTML()}</div>

                <!-- Actions -->
                <div style="margin-top:10px;display:flex;gap:8px;">
                    <button id="reloadBtn" style="flex:1;padding:8px;border-radius:8px; background:#f39c12; color:#fff; font-weight:600; border:none;">Reload Engine</button>
                    <button id="resetAnalysisBtn" style="flex:1;padding:8px;border-radius:8px; background:#e74c3c; color:#fff; font-weight:600; border:none;">Reset Game Analysis</button>
                </div>
            `;

            parent.appendChild(this.container);
            this.attachEventListeners();
            this.updateUIFromSettings();
            this.visualizer.setupEvalBar();

            return true;
        }

        updateReport() {
             document.getElementById('analysisReport').innerHTML = this.analyzer.getReportHTML();
        }

        updateUIFromSettings() {
            const getEl = id => document.getElementById(id);

            getEl('autoRunCB').checked = !!settings.autoRun;
            getEl('autoMoveCB').checked = !!settings.autoMovePiece;
            getEl('showEvalBarCB').checked = !!settings.showEvalBar;
            getEl('showAdvThreatsCB').checked = !!settings.showAdvancedThreats;
            getEl('depthSlider').value = settings.lastDepth;
            getEl('depthText').querySelector('strong').innerText = settings.lastDepth;
            getEl('delayMinInput').value = settings.delayMin;
            getEl('delayMaxInput').value = settings.delayMax;
        }

        attachEventListeners() {
            const getEl = id => document.getElementById(id);

            getEl('depthSlider').oninput = (e) => {
                settings.lastDepth = parseInt(e.target.value);
                getEl('depthText').querySelector('strong').innerText = settings.lastDepth;
                saveSettings();
            };

            getEl('autoRunCB').onchange = (e) => { settings.autoRun = e.target.checked; saveSettings(); };
            getEl('autoMoveCB').onchange = (e) => {
                settings.autoMovePiece = e.target.checked;
                getEl('delaySection').style.display = e.target.checked ? 'block' : 'none';
                saveSettings();
            };
            getEl('showEvalBarCB').onchange = (e) => {
                settings.showEvalBar = e.target.checked;
                saveSettings();
                this.visualizer.updateEvalBar(this.engine.currentEval, this.engine.checkmateIn);
            };
            getEl('showAdvThreatsCB').onchange = (e) => { settings.showAdvancedThreats = e.target.checked; saveSettings(); };

            getEl('delayMinInput').onchange = (e) => {
                let val = parseFloat(e.target.value) || 0;
                settings.delayMin = Math.max(0, val);
                if (settings.delayMin > settings.delayMax) {
                    settings.delayMax = settings.delayMin;
                    getEl('delayMaxInput').value = settings.delayMax.toFixed(1);
                }
                e.target.value = settings.delayMin.toFixed(1);
                saveSettings();
            };
            getEl('delayMaxInput').onchange = (e) => {
                let val = parseFloat(e.target.value) || 0;
                settings.delayMax = Math.max(0, val);
                if (settings.delayMax < settings.delayMin) {
                    settings.delayMin = settings.delayMax;
                    getEl('delayMinInput').value = settings.delayMin.toFixed(1);
                }
                e.target.value = settings.delayMax.toFixed(1);
                saveSettings();
            };

            getEl('reloadBtn').onclick = () => {
                this.engine.safeRestart();
                this.analyzer.reset(); // Also reset analysis on engine restart
            };
            getEl('resetAnalysisBtn').onclick = () => {
                this.analyzer.reset();
                this.updateReport();
                console.log('Game analysis history reset.');
            };
        }
    }

    // -------------------------------------------------------------------------
    // 7. Main Controller Logic
    // -------------------------------------------------------------------------

    let botEngine = null;
    let botVisualizer = null;
    let botGUI = null;
    let gameAnalyzer = null;

    let canAutoMove = true;
    let lastKnownBestEval = 0;
    let lastKnownFen = '';

    /**
     * Callback executed when the Stockfish engine returns data.
     */
    function engineDataCallback(data) {
        if (data.type === 'info') {
            // Update the live visualization with the current best info
            botVisualizer.showAnalysis(data.moves, data.eval, data.mate);

            // Store the best evaluation for the *current* FEN
            lastKnownBestEval = data.eval;
            lastKnownFen = data.fen;

        } else if (data.type === 'bestmove') {
            // Final visualization after 'bestmove'
            botVisualizer.showAnalysis(data.moves, data.eval, data.mate);
            canAutoMove = true;
        }
    }

    /**
     * The main analysis loop, throttled to run every 200ms.
     */
    const continuousAnalysisLoop = throttle(() => {
        board = findBoard();

        if (!board || !board.game) return;

        try {
            const currentFen = board.game.getFEN();

            // 1. Detect Move Played
            if (currentFen !== botEngine.lastFen && botEngine.lastFen !== '') {
                // A move just happened!
                const actualMove = board.game.getHistory().pop();

                // Use the last known BEST evaluation of the PREVIOUS FEN
                const cpBefore = lastKnownBestEval;
                const prevFen = botEngine.lastFen;

                // Immediately run analysis on the *new* FEN to get cpAfter
                botEngine.runAnalysis(currentFen, settings.lastDepth);

                // We must wait for the new best eval (cpAfter) to arrive to complete the classification.
                // The classification logic is now inside the move listener instead of this loop.

                // IMPORTANT: Since we can't reliably predict when the 'bestmove' will arrive
                // for the *new* FEN, we'll wait for the next 'info' or 'bestmove' update
                // to trigger the move recording. For now, just trigger the new analysis.
            }


            // 2. Continuous Analysis & Game Analyzer Logic
            if (settings.autoRun || botEngine.isThinking) {
                 if (!botEngine.isThinking || currentFen !== botEngine.lastFen) {
                    // Check if the actual move was just recorded and new eval is ready
                    if (currentFen === lastKnownFen && lastKnownFen !== '' && lastKnownBestEval !== 0) {
                        // This means the engine just returned the optimal evaluation (cpAfter) for the position resulting from the player's last move.

                        const history = board.game.getHistory();
                        const lastMove = history.length > 0 ? history[history.length - 1] : null;

                        if (lastMove && lastMove.from && lastMove.to) {
                            const uciMove = lastMove.from + lastMove.to + (lastMove.promotion ? lastMove.promotion : '');

                            // Get the FEN *before* the last move (this is slightly hacky but necessary)
                            board.game.undo();
                            const prevFenForRecording = board.game.getFEN();
                            board.game.redo();

                            gameAnalyzer.recordMoveAnalysis(prevFenForRecording, uciMove, lastKnownBestEval, botEngine.currentEval);
                            botGUI.updateReport();
                        }

                    }

                    // Start or continue analysis
                    botEngine.runAnalysis(currentFen, settings.lastDepth);
                }
            }

            // 3. Trigger Auto-Move (Bot Play)
            const currentTurn = board.game.getTurn();
            const playingAs = board.game.getPlayingAs ? board.game.getPlayingAs() : currentTurn;

            if (settings.autoMovePiece && currentTurn === playingAs && !botEngine.isThinking && canAutoMove) {
                const bestMoveUCI = botEngine.candidateMoves[0]?.move;

                if (bestMoveUCI) {
                    canAutoMove = false;

                    const delaySeconds = Math.random() * (settings.delayMax - settings.delayMin) + settings.delayMin;
                    const delayMs = Math.max(200, delaySeconds * 1000);

                    setTimeout(() => {
                        if (botEngine.candidateMoves[0]?.move === bestMoveUCI) {
                            botEngine.performMove(bestMoveUCI);
                        }
                        canAutoMove = true;

                    }, delayMs);
                }
            }

        } catch (e) {
            console.error('Error in continuous analysis loop:', e);
        }
    }, 150);


    /**
     * Initialization and setup.
     */
    async function init() {
        // Wait for the board element to exist and have the game object
        await new Promise(resolve => {
            const check = setInterval(() => {
                board = findBoard();
                if (board && board.game) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });

        // Initialize components
        botEngine = new StockfishManager(engineDataCallback);
        botVisualizer = new BoardVisualizer(botEngine);
        gameAnalyzer = new GameAnalyzer();
        botGUI = new GUIManager(botEngine, botVisualizer, gameAnalyzer);

        botGUI.initGUI();

        const mo = new MutationObserver((mutations) => {
            const newBoard = findBoard();
            if (newBoard && newBoard !== board) {
                console.log('Board change detected, re-initializing UI and visuals.');
                board = newBoard;
                botGUI.initGUI();
                botVisualizer.detachHighlights();
                gameAnalyzer.reset(); // Reset game analysis history on new game/navigation
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        setInterval(continuousAnalysisLoop, 150);

        console.log('Deep Chess Analysis Bot v4.0.0 Initialized and Monitoring.');
    }

    init();

})();
