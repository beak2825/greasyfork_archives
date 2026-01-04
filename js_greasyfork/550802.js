// ==UserScript==
// @name Chess.com Bot — With Evaluation Bar (Updated Stockfish) newer stockfish
// @namespace thehackerclient
// @version 4.8 // Version incremented
// @description Improved userscript: top 3 moves & threats, persistent settings, debounce/throttle, safer engine lifecycle, promotion handling, better board detection, min/max delay, and real-time evaluation bar. Now using updated Stockfish from a new resource. Added Enable Hack functionality.
// @match https://www.chess.com/*
// @auther thehackerclient
// @grant GM_getResourceText
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @resource stockfish.js https://raw.githubusercontent.com/niklasf/stockfish.js/master/stockfish.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/550802/Chesscom%20Bot%20%E2%80%94%20With%20Evaluation%20Bar%20%28Updated%20Stockfish%29%20newer%20stockfish.user.js
// @updateURL https://update.greasyfork.org/scripts/550802/Chesscom%20Bot%20%E2%80%94%20With%20Evaluation%20Bar%20%28Updated%20Stockfish%29%20newer%20stockfish.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --------- Config & state ---------
    const STORAGE_KEY = 'chess_bot_settings_v2';
    const DEFAULTS = {
        autoRun: true,
        autoMovePiece: false,
        delayMin: 0.5,
        delayMax: 2,
        lastDepth: 18,
        showPV: true,
        colors: { move1: 'rgba(235,97,80,0.7)', move2:'rgba(255,165,0,0.6)', move3:'rgba(255,255,0,0.5)', threat:'rgba(0,128,255,0.35)' },
        highlightMs: 1400,
        hackEnabled: false // New setting for Enable Hack
    };
    let settings = Object.assign({}, DEFAULTS, loadSettings());

    // 🔹 Force autoMovePiece always false at startup
    settings.autoMovePiece = false;

    // Master state flag for hack functionality
    window.hackEnabled = settings.hackEnabled ? 1 : 0;

    let board = null;       // DOM element for chess-board / wc-chess-board
    let engine = { worker: null };    // stockfish worker wrapper
    let stockfishObjectURL = null;
    // Added rawCp and rawMate to the candidate move structure for display purposes
    let candidateMoves = [];       // [{move:'e2e4', score:120, depth:... , pv:[], rawCp: 120, rawMate: null }]
    let isThinking = false;
    let canGo = true;
    let lastFen = '';
    let updateBotRunning = false; // New flag to control the main bot loop
    let botCanvas = null; // Canvas for arrows/highlights
    let botCanvasCtx = null; // Canvas context

    // === NEW STATE FOR DYNAMIC CALCULATION STATUS ===
    let currentCalcStatus = {
        depth: 0,
        seldepth: 0,
        nodes: 0,
        nps: 0,
        time: 0,
        isSearching: false
    };
    // ===============================================

    // debounce/throttle helpers
    function debounce(fn, wait){ let t; return function(...a){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,a), wait); }; }
    function throttle(fn, wait){ let last=0; return function(...a){ const now=Date.now(); if(now-last>wait){ last=now; fn.apply(this,a);} }; }

    // safer query for board element — supports both modern and older chess.com tags
    function findBoard(){ return $('chess-board')[0] || $('wc-chess-board')[0] || document.querySelector('[data-cy="board"]') || null; }

    // --------- Persistence (UNCHANGED) ---------
    function loadSettings(){ try{ const raw = localStorage.getItem(STORAGE_KEY); return raw? JSON.parse(raw): {}; }catch(e){ return {}; } }
    function saveSettings(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }catch(e){} }

    // --------- Stockfish lifecycle (UNCHANGED) ---------
    function createStockfishWorker(){
        try{
            // ⭐️ Updated to use the new resource URL via GM_getResourceText
            if(stockfishObjectURL === null){
                const text = GM_getResourceText('stockfish.js');
                stockfishObjectURL = URL.createObjectURL(new Blob([text], {type:'application/javascript'}));
            }
            if(engine.worker) engine.worker.terminate();
            engine.worker = new Worker(stockfishObjectURL);
            engine.worker.onmessage = e => handleEngineMessage(e.data);
            engine.worker.postMessage('ucinewgame');
            console.log('Stockfish worker created with new resource');
        }catch(err){ console.error('Failed to create Stockfish worker', err); }
    }

    function safeRestartEngine(){
        isThinking = false;
        try{ if(engine.worker) engine.worker.terminate(); }catch(e){}
        createStockfishWorker();
    }

    // --------- Visual Overlay Functions (NEW) ---------
    function ensureCanvas() {
        if (!board || !window.hackEnabled) return;

        // Remove existing canvas if any
        if (botCanvas) {
            botCanvas.remove();
            botCanvas = null;
            botCanvasCtx = null;
        }

        // Create new canvas
        botCanvas = document.createElement('canvas');
        botCanvas.id = 'botCanvas';
        botCanvas.style.position = 'absolute';
        botCanvas.style.top = '0';
        botCanvas.style.left = '0';
        botCanvas.style.pointerEvents = 'none';
        botCanvas.style.zIndex = '50';

        // Set canvas size to match board
        const boardRect = board.getBoundingClientRect();
        botCanvas.width = boardRect.width;
        botCanvas.height = boardRect.height;

        // Add canvas to board
        board.appendChild(botCanvas);
        botCanvasCtx = botCanvas.getContext('2d');
    }

    function clearVisuals() {
        if (botCanvasCtx) {
            botCanvasCtx.clearRect(0, 0, botCanvas.width, botCanvas.height);
        }
    }

    function drawArrow(fromSq, toSq, color) {
        if (!botCanvasCtx || !board) return;

        const squareSize = board.getBoundingClientRect().width / 8;
        const isFlipped = board.classList && board.classList.contains('flipped');

        // Convert square notation to coordinates
        const file = fromSq[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const rank = parseInt(fromSq[1]) - 1;

        const toFile = toSq[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const toRank = parseInt(toSq[1]) - 1;

        // Calculate pixel coordinates
        let fromX, fromY, toX, toY;

        if (isFlipped) {
            fromX = (7 - file) * squareSize + squareSize / 2;
            fromY = (7 - rank) * squareSize + squareSize / 2;
            toX = (7 - toFile) * squareSize + squareSize / 2;
            toY = (7 - toRank) * squareSize + squareSize / 2;
        } else {
            fromX = file * squareSize + squareSize / 2;
            fromY = (7 - rank) * squareSize + squareSize / 2;
            toX = toFile * squareSize + squareSize / 2;
            toY = (7 - toRank) * squareSize + squareSize / 2;
        }

        // Draw arrow
        botCanvasCtx.strokeStyle = color;
        botCanvasCtx.lineWidth = 3;
        botCanvasCtx.beginPath();
        botCanvasCtx.moveTo(fromX, fromY);
        botCanvasCtx.lineTo(toX, toY);
        botCanvasCtx.stroke();

        // Draw arrowhead
        const headLength = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        botCanvasCtx.beginPath();
        botCanvasCtx.moveTo(toX, toY);
        botCanvasCtx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        botCanvasCtx.moveTo(toX, toY);
        botCanvasCtx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        botCanvasCtx.stroke();
    }

    function updateVisuals() {
        if (!window.hackEnabled || !botCanvasCtx) return;

        clearVisuals();

        if (!candidateMoves.length) return;

        // Draw arrows for top moves
        const colors = [
            settings.colors.move1,
            settings.colors.move2,
            settings.colors.move3
        ];

        candidateMoves.forEach((move, index) => {
            if (index < 3) {
                const from = move.move.slice(0, 2);
                const to = move.move.slice(2, 4);
                drawArrow(from, to, colors[index]);
            }
        });
    }

    // --------- Evaluation Bar Logic (UNCHANGED) ---------

    /**
     * Updates the visual evaluation bar based on the best move's score.
     * @param {number} scoreCp - The centipawn score (positive for White, negative for Black).
     * @param {number | null} mateScore - The number of moves to mate (positive for White, negative for Black), or null if not mate.
     */
    function updateEvaluationBar(scoreCp, mateScore) {
        if (!window.hackEnabled) return; // Only update if hack is enabled

        const barWhiteEl = document.getElementById('evalBarWhiteAdvantage');
        const scoreTextEl = document.getElementById('evalPercent');

        if (!barWhiteEl || !scoreTextEl) return;

        let displayScore;
        let barHeightPercent;

        if (mateScore !== null) {
            // Mate score: mateScore is the number of moves to mate. Positive for White, Negative for Black.
            displayScore = mateScore > 0 ? `M+${mateScore}` : `M${mateScore}`;
            // Map mate score to near 100% or near 0%
            barHeightPercent = mateScore > 0 ? 98 : 2;
        } else {
            // Centipawn score: scoreCp is the advantage for White.

            // For bar visualization, clamp CP value to a visible range (e.g., +/- 800 cp)
            const clampedCp = Math.max(-800, Math.min(800, scoreCp));
            // Simple linear scaling: 16 cp = 1% change (0% at -800, 50% at 0, 100% at +800)
            barHeightPercent = 50 + (clampedCp / 16);
            barHeightPercent = Math.max(0, Math.min(100, barHeightPercent));

            displayScore = (scoreCp / 100).toFixed(2);
            if (scoreCp >= 0) displayScore = `+${displayScore}`;
        }

        // Update the bar height (White's territory grows from the bottom up, pushing Black's down)
        barWhiteEl.style.height = `${barHeightPercent}%`;

        // Update the displayed score
        scoreTextEl.innerText = displayScore;

        // Adjust text color for contrast (White text on black background, Black text on white background)
        const whiteAdvantage = barHeightPercent;
        const blackAdvantage = 100 - barHeightPercent;

        // If the advantage is overwhelming for one side, move the text label to the other side for contrast
        if (whiteAdvantage > 80) { // Mostly white: text to black side
            scoreTextEl.style.color = '#fff';
            scoreTextEl.style.top = '10%';
        } else if (blackAdvantage > 80) { // Mostly black: text to white side
            scoreTextEl.style.color = '#000';
            scoreTextEl.style.top = '90%';
        } else { // Neutral: centered text
            scoreTextEl.style.color = '#1a1a1a';
            scoreTextEl.style.top = '50%';
        }
    }

    // --------- Engine message parsing (UPDATED to track status) ---------
    // This function is for calculating a score value primarily for sorting candidate moves.
    function parseScore(match){
        if(!match) return 0;
        const type = match[1];
        const val = parseInt(match[2]);
        if(type === 'cp') return val;
        // Mate score is converted to a large positive/negative value for sorting
        return val > 0 ? 100000 - val : -100000 - val;
    }

    function getInfoToken(msg, key, isInt=false) {
        const match = msg.match(new RegExp(`${key} (\\S+)`));
        if (match) return isInt ? parseInt(match[1]) : match[1];
        return null;
    }

    function handleEngineMessage(msg){
        if(typeof msg !== 'string') return;

        if(msg.startsWith('info')){
            // === UPDATE CALCULATION STATUS IN REAL-TIME ===
            currentCalcStatus.isSearching = true;
            const depth = getInfoToken(msg, 'depth', true);
            const seldepth = getInfoToken(msg, 'seldepth', true);
            const nodes = getInfoToken(msg, 'nodes', true);
            const nps = getInfoToken(msg, 'nps', true);
            const time = getInfoToken(msg, 'time', true);

            if (depth !== null) currentCalcStatus.depth = depth;
            if (seldepth !== null) currentCalcStatus.seldepth = seldepth;
            if (nodes !== null) currentCalcStatus.nodes = nodes;
            if (nps !== null) currentCalcStatus.nps = nps;
            if (time !== null) currentCalcStatus.time = time;

            throttledUpdateStatus();
            // ===============================================

            if(msg.includes('pv')){
                const pvTokens = msg.split(' pv ')[1].trim().split(/\s+/);
                if(pvTokens && pvTokens.length){
                    const move = pvTokens[0];
                    const scoreMatch = msg.match(/score (cp|mate) (-?\d+)/);
                    const score = parseScore(scoreMatch); // Score for sorting

                    let rawCp = null;
                    let rawMate = null;

                    if (scoreMatch) {
                        const type = scoreMatch[1];
                        const val = parseInt(scoreMatch[2]);
                        if (type === 'cp') rawCp = val;
                        if (type === 'mate') rawMate = val;
                    }

                    const depthMatch = msg.match(/depth (\d+)/);
                    const depth = depthMatch? parseInt(depthMatch[1]) : settings.lastDepth;
                    const exists = candidateMoves.find(c=>c.move===move);

                    // Store both the sortable score and the raw scores for display
                    if(!exists) candidateMoves.push({move, score, depth, pv: pvTokens, rawCp, rawMate});
                    else if(depth>exists.depth) {
                        exists.score=score;
                        exists.depth=depth;
                        exists.pv=pvTokens;
                        exists.rawCp=rawCp;
                        exists.rawMate=rawMate;
                    }
                }
            }
        }

        if(msg.startsWith('bestmove')){
            currentCalcStatus.isSearching = false; // Stop searching status
            throttledUpdateStatus(); // Final status update

            candidateMoves.sort((a,b) => b.score - a.score);
            candidateMoves = candidateMoves.slice(0,3);

            // Update visuals with new moves
            updateVisuals();
            showTopMoves();

            // --- Update Evaluation Bar with the best move's score ---
            if(candidateMoves.length > 0) {
                const bestMove = candidateMoves[0];
                // Use the raw mate score if available, otherwise use the raw CP score.
                const finalCp = bestMove.rawCp !== null ? bestMove.rawCp : bestMove.score;
                const finalMate = bestMove.rawMate;

                updateEvaluationBar(finalCp, finalMate);
            }

            const move = msg.split(' ')[1];
            if(settings.autoMovePiece && move) performMove(move);
            isThinking = false;
        }
    }

    // === NEW FUNCTION: Update the calculation status GUI elements ===
    function updateCalculationStatus() {
        const statusEl = document.getElementById('calcStatus');
        const searchStatusEl = document.getElementById('searchStatusText');

        if (!statusEl || !searchStatusEl) return;

        if (currentCalcStatus.isSearching) {
            searchStatusEl.innerText = 'Calculating...';
            searchStatusEl.style.color = '#d9534f'; // Red/Orange for calculating

            const nodesK = (currentCalcStatus.nodes / 1000).toFixed(0);
            const npsK = (currentCalcStatus.nps / 1000).toFixed(0);
            const timeS = (currentCalcStatus.time / 1000).toFixed(1);

            statusEl.innerHTML = `
                <div style="display:flex; justify-content:space-between;"><span>Depth:</span> <strong>${currentCalcStatus.depth} / ${currentCalcStatus.seldepth}</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Nodes:</span> <strong>${nodesK}k</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>NPS:</span> <strong>${npsK}k</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Time:</span> <strong>${timeS}s</strong></div>
            `;
        } else {
            searchStatusEl.innerText = window.hackEnabled ? 'Idle / Ready' : 'Disabled';
            searchStatusEl.style.color = window.hackEnabled ? '#5cb85c' : '#777'; // Green for ready, gray for disabled
            statusEl.innerHTML = `
                <div style="display:flex; justify-content:space-between;"><span>Depth:</span> <strong>-</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Nodes:</span> <strong>-</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>NPS:</span> <strong>-</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Time:</span> <strong>-</strong></div>
            `;
        }
    }

    // Throttle the status update to avoid excessive DOM manipulation
    const throttledUpdateStatus = throttle(updateCalculationStatus, 150);
    // ===============================================================

    // --------- Utilities (omitted for brevity, unchanged) ---------
    function mapSquareForBoard(sq){
        if(!board || !sq || sq.length<2) return sq;
        const isFlipped = board.classList && board.classList.contains('flipped');
        if(!isFlipped) return sq;
        const file = sq[0];
        const rank = sq[1];
        const flippedFile = String.fromCharCode('h'.charCodeAt(0) - (file.charCodeAt(0)-'a'.charCodeAt(0)));
        const flippedRank = (9 - parseInt(rank)).toString();
        return flippedFile + flippedRank;
    }

    function getBoardSquareEl(sq){ try{ return board.querySelector(`[data-square="${sq}"]`); }catch(e){ return null; } }

    function attachHighlight(el, cls, color){
        if(!el) return null;
        let overlay = el.querySelector('.' + cls);
        if(!overlay){ overlay = document.createElement('div'); overlay.className = cls; overlay.style.position='absolute'; overlay.style.top=0; overlay.style.left=0; overlay.style.width='100%'; overlay.style.height='100%'; overlay.style.pointerEvents='none'; overlay.style.zIndex=60; el.appendChild(overlay); }
        overlay.style.backgroundColor = color;
        return overlay;
    }

    function detachHighlights(selector){ try{ document.querySelectorAll(selector).forEach(n=>n.parentElement && n.parentElement.removeChild(n)); }catch(e){} }

    // --------- Highlighting & UI (omitted for brevity, largely unchanged) ---------
    function showTopMoves(){
        if(!board || !board.game || !window.hackEnabled) return;
        detachHighlights('.botMoveHighlight');
        detachHighlights('.botThreatHighlight');

        candidateMoves.forEach((cm, i) => {
            const from = mapSquareForBoard(cm.move.slice(0,2));
            const to = mapSquareForBoard(cm.move.slice(2,4));
            const color = i===0? settings.colors.move1 : (i===1? settings.colors.move2 : settings.colors.move3);

            [from, to].forEach(sq => {
                const el = getBoardSquareEl(sq);
                if(el) {
                    const ov = attachHighlight(el, 'botMoveHighlight', color);
                    setTimeout(()=>{ if(ov && ov.parentElement) ov.parentElement.removeChild(ov); }, settings.highlightMs);
                }
            });

            if(settings.showPV && cm.pv && cm.pv.length){
                addPVNote(cm, i);
            }
        });
        showThreats();
    }

    function addPVNote(cm, index){
        try{
            const id = `pvNote-${index}`;
            let note = document.getElementById(id);
            if(!note){ note = document.createElement('div'); note.id=id; note.style.position='absolute'; note.style.right='6px'; note.style.top=(6 + index*28)+'px'; note.style.padding='6px 8px'; note.style.borderRadius='6px'; note.style.background='rgba(0,0,0,0.6)'; note.style.color='#fff'; note.style.zIndex=120; note.style.fontSize='12px'; board.parentElement.appendChild(note); }
            let scoreDisplay = cm.rawMate !== null ? (cm.rawMate > 0 ? `M+${cm.rawMate}` : `M${cm.rawMate}`) : (cm.rawCp !== null ? (cm.rawCp/100).toFixed(2) : (cm.score/100).toFixed(2));
            note.innerText = `#${index+1} ${cm.move} (${scoreDisplay}) PV: ${cm.pv.slice(0,6).join(' ')}`;
            setTimeout(()=>{ if(note && note.parentElement) note.parentElement.removeChild(note); }, settings.highlightMs + 5000);
        }catch(e){}
    }

    function showThreats(){
        if(!board || !board.game || !window.hackEnabled) return;
        try{
            const legalMoves = board.game.getLegalMoves();
            const opponent = board.game.getTurn() === 'w' ? 'b' : 'w';
            legalMoves.forEach(m=>{ if(m.color===opponent){ const sq = mapSquareForBoard(m.to); const el = getBoardSquareEl(sq); if(el){ const ov = attachHighlight(el, 'botThreatHighlight', settings.colors.threat); setTimeout(()=>{ if(ov && ov.parentElement) ov.parentElement.removeChild(ov); }, settings.highlightMs); } } });
        }catch(e){ console.warn('Failed to show threats', e); }
    }

    // --- FIX APPLIED HERE (UNCHANGED) ---
    function performMove(moveUCI){
        if(!board || !board.game || !window.hackEnabled) return;
        try{
            const from = moveUCI.slice(0,2);
            const to = moveUCI.slice(2,4);
            // Stockfish UCI for promotion includes the piece type, e.g., 'e7e8q'
            const promotionChar = moveUCI.length > 4 ? moveUCI[4] : null;

            // Map the promotion character to the full piece type (e.g., 'q' -> 'q')
            let promotionPiece = null;
            if (promotionChar) {
                // Ensure it's one of the valid promotion pieces
                if (['q', 'r', 'b', 'n'].includes(promotionChar.toLowerCase())) {
                    promotionPiece = promotionChar.toLowerCase();
                }
            }

            const legal = board.game.getLegalMoves();
            let moveFound = false;

            for(const m of legal){
                // Check for matching move, ignoring promotion initially
                if(m.from === from && m.to === to){
                    // Check if it's a promotion move
                    if(m.promotion){
                        // The engine move UCI included a promotion, and the legal move is a promotion
                        if(promotionPiece){
                            m.promotion = promotionPiece; // Set the promotion piece
                            console.log(`[Bot] Performing move: ${moveUCI} with promotion to ${promotionPiece}`);
                        } else {
                            // Default to Queen if the engine's UCI format was incomplete but it's a promotion square
                            m.promotion = 'q';
                            console.warn(`[Bot] Performing move: ${moveUCI}. Legal move required promotion but none was provided. Defaulting to 'q'.`);
                        }
                    }

                    // Perform the move.
                    board.game.move(Object.assign({}, m, {animate:false, userGenerated:true}));
                    moveFound = true;
                    break;
                }
            }

            if (!moveFound) {
                console.error(`[Bot] performMove failed: No legal move found for UCI ${moveUCI}.`);
            }
        }catch(e){
            console.error('[Bot] performMove error:', e);
        }
    }

    // --------- Engine runner & controls (UPDATED to check hackEnabled) ---------
    function runChessEngine(depth){
        if(!board || !engine.worker || !board.game || !window.hackEnabled) return;
        try{
            const fen = board.game.getFEN();
            if(isThinking && fen === lastFen && depth===settings.lastDepth) return;
            lastFen = fen;
            candidateMoves = [];

            // Reset calculation status when a new search starts
            currentCalcStatus = { depth: 0, seldepth: 0, nodes: 0, nps: 0, time: 0, isSearching: true };
            throttledUpdateStatus();

            engine.worker.postMessage('position fen ' + fen);
            isThinking = true;
            engine.worker.postMessage('go depth ' + depth);
        }catch(e){ console.error('runChessEngine error', e); }
    }

    const debouncedRun = debounce((d)=> runChessEngine(d), 300);

    // Main bot loop function (NEW)
    function updateBot() {
        if (!window.hackEnabled || !board || !board.game) return;

        try {
            const fen = board.game.getFEN();
            const isMyTurn = board.game.getTurn() === board.game.getPlayingAs();

            // If it's my turn and I'm not already thinking, start analysis
            if (isMyTurn && !isThinking && settings.autoRun) {
                canGo = false;
                const delaySeconds = Math.random() * (settings.delayMax - settings.delayMin) + settings.delayMin;
                setTimeout(() => {
                    debouncedRun(settings.lastDepth);
                    canGo = true;
                }, Math.max(200, delaySeconds * 1000));
            }
        } catch (e) {
            console.error('Error in updateBot:', e);
        }
    }

    // Start the main bot loop (NEW)
    function startBotLoop() {
        if (updateBotRunning) return;
        updateBotRunning = true;

        function loop() {
            if (!updateBotRunning) return;
            updateBot();
            setTimeout(loop, 500); // Check every 500ms
        }

        loop();
    }

    // Stop the main bot loop (NEW)
    function stopBotLoop() {
        updateBotRunning = false;
        isThinking = false;
        clearVisuals();
    }

    // Reload engine function (NEW)
    function reloadEngine() {
        safeRestartEngine();
        if (window.hackEnabled) {
            clearVisuals();
            updateCalculationStatus();
        }
    }

    const autoLoop = throttle(()=>{
        if(!window.hackEnabled) return; // Only run if hack is enabled
        if(!board || !board.game) return;
        if(settings.autoRun && canGo && !isThinking && board.game.getTurn() === board.game.getPlayingAs()){
            canGo = false;
            const delaySeconds = Math.random() * (settings.delayMax - settings.delayMin) + settings.delayMin;
            setTimeout(()=>{ debouncedRun(settings.lastDepth); canGo = true; }, Math.max(200, delaySeconds*1000));
        }
    }, 200);

    // --------- GUI (updated for Eval Bar, Calculation Status, and Enable Hack) ---------
    function initGUI(){
        board = findBoard();
        if(!board) return false;
        if(document.getElementById('botGUI_v2_wrapper')) return true; // Check for the new wrapper

        // 1. Create the main wrapper for the GUI and Eval Bar
        const wrapper = document.createElement('div');
        wrapper.id = 'botGUI_v2_wrapper';

        // **START: Applied GUI fixes here**
        wrapper.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 12px; /* space between panel and bar */
            margin: 8px;
        `;
        // **END: Applied GUI fixes here**

        // 2. Create the existing control panel container
        const container = document.createElement('div');
        container.id = 'botGUI_v2';

        // **START: Applied GUI fixes here**
        container.style.cssText = `
            background: rgba(255,255,255,0.95);
            padding: 10px;
            width: 260px; /* fixed width instead of max-width */
            font-family: Inter,Arial,sans-serif;
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
            flex-shrink: 0; /* don't let flexbox shrink it */
        `;
        // **END: Applied GUI fixes here**

        container.innerHTML = `
            <div style="font-weight:600;margin-bottom:6px;">Chess Bot — Improved</div>

            <div style="margin-bottom:10px;padding:6px;border:1px solid #ccc;border-radius:4px;">
                <div style="margin-bottom:4px;"><input type="checkbox" id="hackEnabledCB" ${window.hackEnabled ? 'checked' : ''}> <label for="hackEnabledCB" style="font-weight:600;color:#d9534f;">Enable Hack</label></div>
                <div style="font-size:11px;color:#666;">Master control for all bot features</div>
            </div>

            <div id="statusSection" style="margin-bottom:10px;padding:6px;border:1px solid #ccc;border-radius:4px;font-size:13px;">
                <div style="font-weight:600;margin-bottom:4px;">Calculation Status: <span id="searchStatusText" style="font-weight:700; color:#777;">Disabled</span></div>
                <div id="calcStatus">
                    <div style="display:flex; justify-content:space-between;"><span>Depth:</span> <strong>-</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>Nodes:</span> <strong>-</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>NPS:</span> <strong>-</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>Time:</span> <strong>-</strong></div>
                </div>
            </div>

            <div id="depthText">Depth: <strong>${settings.lastDepth}</strong></div>
            <input type="range" id="depthSlider" min="1" max="30" value="${settings.lastDepth}" step="1" style="width:100%">
            <div style="margin-top:6px;"><input type="checkbox" id="autoRunCB"> <label for="autoRunCB">Auto Run</label></div>
            <div><input type="checkbox" id="autoMoveCB"> <label for="autoMoveCB">Auto Move</label></div>
            <div style="margin-top:6px;">Delay (s):
                <input id="delayMinInput" type="number" min="0" step="0.1" value="${settings.delayMin}" style="width:60px"> -
                <input id="delayMaxInput" type="number" min="0" step="0.1" value="${settings.delayMax}" style="width:60px">
            </div>
            <div style="margin-top:8px;display:flex;gap:6px;">
                <button id="reloadBtn" style="flex:1;padding:6px;border-radius:6px">Reload Engine</button>
                <button id="analyseBtn" style="flex:1;padding:6px;border-radius:6px">Analyse Now</button>
            </div>
            <div style="margin-top:8px;font-size:12px;color:#666">Top 3 moves are highlighted briefly; PVs show on the board edge.</div>
        `;

        // 3. Evaluation Bar HTML (UPDATED WRAPPER STYLE)
        const evalBarHtml = `
            <div id="evalBarWrapper" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 40px; /* fixed size for bar */
                margin-top: 8px;
                flex-shrink: 0;
            ">
                <div style="font-size:12px; color:#666; font-weight:600; text-align:center;">Eval</div>
                <div id="evalBar" style="
                    height: 300px;
                    width: 24px;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    position: relative;
                    margin-top: 4px;
                    background-color: #000; /* Black color base (below) */
                ">
                    <div id="evalBarWhiteAdvantage" style="
                        background-color: #fff;
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: 50%; /* Default 50% for equality */
                        transition: height 0.3s ease-out;
                    "></div>
                    <div id="evalPercent" style="
                        position: absolute;
                        top: 50%; /* Initial center position */
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-weight: 700;
                        color: #1a1a1a;
                        font-size: 11px;
                        text-shadow: 0 0 1px #fff;
                        width: 100%;
                        text-align: center;
                        z-index: 10;
                        transition: all 0.3s ease-out; /* Transition position too */
                    ">+0.00</div>
                </div>
                <div style="font-size:10px; color:#666; margin-top:2px;">W% / B%</div>
            </div>
        `;

        // 4. Append to DOM
        try{
            wrapper.appendChild(container);
            // Append eval bar HTML next to the container
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = evalBarHtml;
            wrapper.appendChild(tempDiv.firstChild);

            // Try to append to the board's main parent element
            board.parentElement.parentElement.appendChild(wrapper);
        }catch(e){
            // Fallback: append both to body
            document.body.appendChild(wrapper);
        }

        // 5. Setup controls (UPDATED for Enable Hack)
        document.getElementById('autoRunCB').checked = !!settings.autoRun;
        document.getElementById('autoMoveCB').checked = !!settings.autoMovePiece;

        // Enable Hack checkbox handler (NEW)
        document.getElementById('hackEnabledCB').onchange = e => {
            const enabled = e.target.checked;
            window.hackEnabled = enabled ? 1 : 0;
            settings.hackEnabled = enabled;
            saveSettings();

            if (enabled) {
                // Start the bot
                ensureCanvas();
                startBotLoop();
                updateCalculationStatus();
                console.log('[Bot] Hack enabled');
            } else {
                // Stop the bot and clean up
                stopBotLoop();
                clearVisuals();
                updateCalculationStatus();
                console.log('[Bot] Hack disabled');
            }
        };

        document.getElementById('depthSlider').oninput = e => {
            settings.lastDepth = parseInt(e.target.value);
            document.getElementById('depthText').innerHTML = `Depth: <strong>${settings.lastDepth}</strong>`;
            saveSettings();
        };

        document.getElementById('autoRunCB').onchange = e => {
            settings.autoRun = e.target.checked;
            saveSettings();
        };

        document.getElementById('autoMoveCB').onchange = e => {
            settings.autoMovePiece = e.target.checked;
            saveSettings();
        };

        document.getElementById('delayMinInput').onchange = e => {
            settings.delayMin = parseFloat(e.target.value) || 0;
            if(settings.delayMin > settings.delayMax) settings.delayMax = settings.delayMin;
            document.getElementById('delayMaxInput').value = settings.delayMax;
            saveSettings();
        };

        document.getElementById('delayMaxInput').onchange = e => {
            settings.delayMax = parseFloat(e.target.value) || 0;
            if(settings.delayMax < settings.delayMin) settings.delayMin = settings.delayMax;
            document.getElementById('delayMinInput').value = settings.delayMin;
            saveSettings();
        };

        document.getElementById('reloadBtn').onclick = () => { reloadEngine(); };
        document.getElementById('analyseBtn').onclick = () => {
            if (window.hackEnabled) {
                debouncedRun(settings.lastDepth);
            } else {
                console.log('[Bot] Enable hack first');
            }
        };

        // Initialize canvas if hack is already enabled
        if (window.hackEnabled) {
            ensureCanvas();
            startBotLoop();
        }

        return true;
    }

    // --------- Initialization & observers (UPDATED for Enable Hack) ---------
    async function waitUntil(conditionFn, interval=100){ return new Promise(resolve=>{ const t = setInterval(()=>{ try{ if(conditionFn()){ clearInterval(t); resolve(); } }catch(e){} }, interval); }); }

    (async function init(){
        await waitUntil(()=> findBoard());
        board = findBoard();
        await waitUntil(()=> (board = findBoard()) && board.game);

        createStockfishWorker();
        initGUI();

        // Observer for board changes (rematch/new game)
        const boardObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && window.hackEnabled) {
                    // Check if a new board element was added
                    const newBoard = findBoard();
                    if (newBoard && newBoard !== board) {
                        board = newBoard;
                        ensureCanvas();
                        console.log('[Bot] New board detected, canvas reattached');
                    }
                }
            });
        });

        boardObserver.observe(document.body, {childList: true, subtree: true});

        const mo = new MutationObserver(()=>{
            const newBoard = findBoard();
            if (newBoard && newBoard !== board) {
                board = newBoard;
                if (window.hackEnabled) {
                    ensureCanvas();
                }
            }
        });
        mo.observe(document.body, {childList:true, subtree:true});

        // Keep the old interval for compatibility
        setInterval(autoLoop, 150);

        let lastMoveCount = null;
        setInterval(()=>{
            try{
                if(board && board.game && window.hackEnabled){
                    const moves = board.game.getMoveHistory ? board.game.getMoveHistory().length : (board.game.history? board.game.history.length:0);
                    if(lastMoveCount === null) lastMoveCount = moves;
                    if(moves !== lastMoveCount){
                        lastMoveCount = moves;
                        // Reset the bar to neutral when a new move is made and analysis hasn't started yet
                        updateEvaluationBar(0, null);
                        if(settings.autoRun) debouncedRun(settings.lastDepth);
                    }
                }
            }catch(e){}
        }, 600);

        console.log('Improved Chess Bot ready');
    })();
})();