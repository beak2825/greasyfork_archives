// ==UserScript==
// @name          BEST Cheat for Chess.com (Stockfish 17.1, 16.1 & 10.0.2, No Anti-Ban)
// @namespace     http://tampermonkey.net/
// @version       7.9.2
// @description   Triple model automated cheat engine (SF 17.1, SF 16.1, SF 10.0.2) with fully customizable UI and configuration settings.
// @author        Ech0
// @copyright     2025, Ech0
// @license       MIT
// @match         https://www.chess.com/play/*
// @match         https://www.chess.com/game/*
// @match         https://www.chess.com/puzzles/*
// @match         https://www.chess.com/daily
// @grant         GM_getResourceText
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @resource      stockfish.js https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/557044/BEST%20Cheat%20for%20Chesscom%20%28Stockfish%20171%2C%20161%20%201002%2C%20No%20Anti-Ban%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557044/BEST%20Cheat%20for%20Chesscom%20%28Stockfish%20171%2C%20161%20%201002%2C%20No%20Anti-Ban%29.meta.js
// ==/UserScript==
(function () {
    "use strict";
    const CONFIG = { BOARD_SEL: "chess-board, wc-chess-board", LOOP_MS: 50, API: { MAX_DEPTH: 18, MAX_TIME: 2000 } };
    const PIECE_IMGS = {
        p: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
        r: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
        n: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
        b: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
        q: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
        k: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
        P: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
        R: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
        N: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
        B: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
        Q: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
        K: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
    };
    const state = {
        board: null,
        isThinking: !1,
        ui: {},
        lastRawFEN: "N/A",
        lastSentFEN: "",
        lastSanitizedBoardFEN: "",
        lastMoveResult: "Waiting for analysis...",
        lastLiveResult: "Depth | Evaluation: Best move will appear here.",
        lastPayload: "N/A",
        lastResponse: "N/A",
        moveTargetTime: 0,
        calculatedDelay: 0,
        localEngine: null,
        localConfigSent: !1,
        currentCloudRequest: null,
        currentBestMove: null,
        currentPV: [],
        analysisStartTime: 0,
        h: 180,
        s: 100,
        l: 50,
        newGameObserver: null,
        queueTimeout: null,
        localEval: null,
        localMate: null,
        localPV: null,
        localDepth: null,
        history: [],
        hasSavedCurrentGameResult: !1,
        playingAs: null,
    };
    const DEFAULT_SETTINGS = {
        engineMode: "cloud",
        depth: 12,
        maxThinkingTime: 2000,
        contempt: 100,
        searchMoves: "",
        autoRun: !0,
        autoMove: !1,
        autoQueue: !1,
        showPVArrows: !1,
        pvDepth: 5,
        pvShowNumbers: !1,
        pvCustomGradient: !1,
        pvStartColor: "#FFFF00",
        pvEndColor: "#FF0000",
        minDelay: 0,
        maxDelay: 0,
        highlightColor: "#00eeff",
        visualType: "boxes",
        arrowOpacity: 0.8,
        arrowWidth: 15,
        innerOpacity: 0.6,
        outerOpacity: 0.2,
        gradientBias: 0,
        debugLogs: !1,
        enableHistory: !0,
    };
    const settings = { ...DEFAULT_SETTINGS };
    const hexToRgb = (hex) => {
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 0, g: 0, b: 0 };
    };
    const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h,
            s,
            l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    };
    const hslToRgb = (h, s, l) => {
        let r, g, b;
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) r = g = b = l;
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    };
    function interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `rgb(${r}, ${g}, ${b})`;
    }
    function getRawBoardFEN() {
        if (!state.board?.game) return null;
        try {
            if (typeof state.board.game.getFEN === "function") return state.board.game.getFEN();
            if (typeof state.board.game.fen === "string") return state.board.game.fen;
            if (state.board.game.getPosition) return state.board.game.getPosition();
        } catch (e) {}
        return null;
    }
    function sanitizeFEN(rawFEN) {
        if (!rawFEN) return "";
        let parts = rawFEN.replace(/\s+/g, " ").trim().split(" ");
        if (parts.length < 6) {
            const def = ["w", "-", "-", "0", "1"];
            for (let i = parts.length; i < 6; i++) parts.push(def[i - 1]);
        }
        if (parts[3] && parts[3] !== "-") parts[3] = parts[3].toLowerCase();
        return parts.join(" ");
    }
    function loadLocalEngine() {
        if (state.localEngine) return;
        try {
            const scriptContent = GM_getResourceText("stockfish.js");
            if (!scriptContent) throw new Error("Stockfish resource not found.");
            const blob = new Blob([scriptContent], { type: "application/javascript" });
            state.localEngine = new Worker(URL.createObjectURL(blob));
            state.localEngine.onmessage = handleLocalMessage;
            state.localEngine.onerror = (e) => handleError("Local Engine Error", e);
            [
                "ucinewgame",
                "isready",
                "setoption name MultiPV value 1",
                `setoption name Contempt value ${settings.contempt}`,
            ].forEach((c) => state.localEngine.postMessage(c));
            console.log("Stockfish 10 Local Loaded.");
        } catch (e) {
            handleError("Engine Load Fail", e);
        }
    }
    function analyze(depth = settings.depth, fenOverride = null, isRetry = !1) {
        if (state.isThinking && !fenOverride && !isRetry) return;
        let finalFEN = fenOverride || sanitizeFEN(getRawBoardFEN());
        if (!finalFEN) return;
        state.lastRawFEN = finalFEN;
        state.lastSentFEN = finalFEN;
        if (!fenOverride) state.lastSanitizedBoardFEN = finalFEN;
        state.isThinking = !0;
        state.analysisStartTime = performance.now();
        const minMs = settings.minDelay * 1000;
        const maxMs = settings.maxDelay * 1000;
        const delay = Math.random() * (maxMs - minMs) + minMs;
        state.moveTargetTime = performance.now() + delay;
        state.calculatedDelay = (delay / 1000).toFixed(2);
        updateUI();
        if (settings.engineMode === "cloud") {
            analyzeCloud(finalFEN, depth, isRetry);
        } else if (settings.engineMode === "sfonline") {
            analyzeSF16(finalFEN, depth);
        } else {
            analyzeLocal(finalFEN, depth);
        }
    }
    function analyzeCloud(finalFEN, depth, isRetry) {
        const actualDepth = Math.min(depth, 18);
        const payload = {
            fen: finalFEN,
            depth: actualDepth,
            maxThinkingTime: Math.min(settings.maxThinkingTime, CONFIG.API.MAX_TIME),
            taskId: Math.random().toString(36).substring(7),
        };
        if (settings.searchMoves.trim()) payload.searchmoves = settings.searchMoves.trim();
        state.lastPayload = `POST https://chess-api.com/v1\n${JSON.stringify(payload, null, 2)}`;
        if (state.ui.liveOutput) state.ui.liveOutput.innerHTML = isRetry ? "♻️ Retrying Safe FEN..." : "☁️ SF17 Analysis...";
        updateUI();
        state.currentCloudRequest = GM_xmlhttpRequest({
            method: "POST",
            url: "https://chess-api.com/v1",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            timeout: 15000,
            onload: (res) => handleCloudResponse(res, finalFEN, actualDepth, isRetry),
            onerror: (err) => handleError("Network Error", err),
            ontimeout: () => handleError("Timeout (15s)"),
        });
    }
    function analyzeSF16(finalFEN, depth) {
        const actualDepth = Math.min(depth, 15);
        const encodedFEN = encodeURIComponent(finalFEN);
        const url = `https://stockfish.online/api/s/v2.php?fen=${encodedFEN}&depth=${actualDepth}&mode=bestmove`;
        state.lastPayload = `GET ${url}`;
        if (state.ui.liveOutput) state.ui.liveOutput.innerHTML = "☁️ SF16.1 Analysis...";
        updateUI();
        state.currentCloudRequest = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            timeout: 20000,
            onload: (res) => handleSF16Response(res),
            onerror: (err) => handleError("Network Error (SF16)", err),
            ontimeout: () => handleError("Timeout (SF16 20s)"),
        });
    }
    function handleSF16Response(response) {
        state.isThinking = !1;
        state.lastResponse = response.responseText;
        try {
            if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
            let data;
            try {
                data = JSON.parse(response.responseText);
            } catch (e) {
                throw new Error("Invalid JSON from SF16");
            }
            if (!data.success || !data.bestmove) throw new Error(data.data || "Unknown SF16 Error");
            const bestMove = data.bestmove.split(" ")[1] || data.bestmove;
            const duration = ((performance.now() - state.analysisStartTime) / 1000).toFixed(2);
            let evalScore = data.evaluation;
            let mate = data.mate;
            processBestMove(
                bestMove,
                evalScore,
                mate,
                data.continuation ? data.continuation.split(" ") : null,
                null,
                duration
            );
        } catch (e) {
            handleError("SF16 API Error", e);
        }
        updateUI();
    }
    function handleCloudResponse(response, sentFEN, depth, isRetry) {
        state.isThinking = !1;
        state.lastResponse = response.responseText;
        if (response.responseText.includes("HIGH_USAGE") || response.status === 429) {
            state.lastMoveResult = "⚠️ API COOLDOWN";
            state.lastLiveResult = "<span style='color:red; font-weight:bold;'>HIGH USAGE: Cooldown ~30-60m.</span>";
            updateUI();
            return;
        }
        try {
            if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
            let rawData;
            try {
                rawData = JSON.parse(response.responseText);
            } catch (e) {
                throw new Error("Invalid JSON");
            }
            const result = Array.isArray(rawData) ? rawData[0] : rawData;
            if (!result || result.error || result.status === "error") {
                const errText = result?.error || result?.message || "Unknown Error";
                if (errText.includes("HIGH_USAGE")) {
                    state.lastMoveResult = "⚠️ API COOLDOWN";
                    state.lastLiveResult =
                        "<span style='color:red; font-weight:bold;'>HIGH USAGE: Cooldown ~30-60m.</span>";
                    updateUI();
                    return;
                }
                if ((errText.includes("FEN") || errText.includes("VALIDATION")) && !isRetry) {
                    const parts = sentFEN.split(" ");
                    if (parts.length >= 4 && parts[3] !== "-") {
                        parts[3] = "-";
                        analyze(depth, parts.join(" "), !0);
                        return;
                    }
                }
                throw new Error(errText);
            }
            if (result.move || result.bestmove) {
                const duration = ((performance.now() - state.analysisStartTime) / 1000).toFixed(2);
                processBestMove(
                    result.move || result.bestmove,
                    result.eval,
                    result.mate,
                    result.continuationArr,
                    result.winChance,
                    duration
                );
            } else {
                state.lastMoveResult = "⚠️ No move returned.";
            }
        } catch (e) {
            handleError("API Error", e);
        }
        updateUI();
    }
    function analyzeLocal(fen, depth) {
        if (!state.localEngine) loadLocalEngine();
        if (!state.localEngine) return;
        if (!state.localConfigSent) {
            state.localEngine.postMessage(`setoption name Contempt value ${settings.contempt}`);
            state.localConfigSent = !0;
        }
        state.localEval = null;
        state.localMate = null;
        state.localPV = null;
        state.localDepth = null;
        const actualDepth = Math.min(depth, 23);
        const cmds = [`position fen ${fen}`, `go depth ${actualDepth}`];
        state.lastPayload = `Worker CMDs:\n${cmds.join("\n")}`;
        state.ui.liveOutput.innerHTML = "⚡ Local Analysis...";
        updateUI();
        cmds.forEach((cmd) => state.localEngine.postMessage(cmd));
    }
    function handleLocalMessage(e) {
        const msg = e.data;
        if (typeof msg !== "string") return;
        state.lastResponse =
            (state.lastResponse.length > 500 ? "..." + state.lastResponse.slice(-500) : state.lastResponse) +
            "\n" +
            msg;
        if (msg.startsWith("info") && msg.includes("depth") && msg.includes("score")) {
            const depthMatch = msg.match(/depth (\d+)/);
            const scoreMatch = msg.match(/score (cp|mate) (-?\d+)/);
            const pvMatch = msg.match(/ pv (.*)/);
            if (depthMatch && scoreMatch) {
                const depth = depthMatch[1];
                let val = parseInt(scoreMatch[2]);
                const type = scoreMatch[1];
                const fenParts = state.lastSentFEN ? state.lastSentFEN.split(" ") : [];
                const sideToMove = fenParts.length > 1 ? fenParts[1] : "w";
                if (sideToMove === "b") val = -val;
                const pv = pvMatch ? pvMatch[1] : "";
                if (type === "mate") {
                    state.localMate = val;
                    state.localEval = null;
                } else {
                    state.localMate = null;
                    state.localEval = (val / 100).toFixed(2);
                }
                state.localPV = pv;
                state.localDepth = depth;
                if (pv) state.currentPV = pv.split(" ");
                let scoreTxt;
                if (type === "mate") {
                    scoreTxt = "M" + Math.abs(val);
                    if (val < 0) scoreTxt = "-" + scoreTxt;
                } else {
                    scoreTxt = (val > 0 ? "+" : "") + (val / 100).toFixed(2);
                }
                const duration = ((performance.now() - state.analysisStartTime) / 1000).toFixed(2);
                if (pv) {
                    const best = pv.split(" ")[0];
                    highlightMove(best);
                    state.lastMoveResult = `⏳ D${depth}: <span style="font-weight:bold; color:var(--bot-primary);">${best}</span>`;
                }
                state.lastLiveResult = `
                    <div style="display:flex; justify-content:space-between; align-items:center; font-weight:bold;">
                        <span style="color:var(--bot-primary); font-size:1.1em;">${scoreTxt} <span style="font-size:0.7em; color:#aaa; font-weight:normal;">(${duration}s)</span></span>
                        <span style="font-size:0.8em; color:#aaa;">(Local Depth ${depth})</span>
                    </div>
                    <div style="margin-top:5px; font-size:0.85em; color:#bbb; width:100%; max-width:100%; box-sizing:border-box; word-wrap:break-word; overflow-wrap:anywhere; white-space:normal;">
                        <span style="color:#888;">PV:</span> ${pv.split(" ").slice(0, 5).join(" ")}...
                    </div>
                 `;
                updateUI();
            }
        }
        if (msg.startsWith("bestmove")) {
            state.isThinking = !1;
            const parts = msg.split(" ");
            const bestMove = parts[1];
            if (bestMove && bestMove !== "(none)") {
                const duration = ((performance.now() - state.analysisStartTime) / 1000).toFixed(2);
                processBestMove(
                    bestMove,
                    state.localEval,
                    state.localMate,
                    state.localPV ? state.localPV.split(" ") : null,
                    null,
                    duration,
                    state.localDepth
                );
            } else state.lastMoveResult = "⚠️ No move found";
            updateUI();
        }
    }
    function processBestMove(bestMove, evalScore, mate, continuationArr, winChance, duration, depth = null) {
        state.currentBestMove = bestMove;
        state.currentPV = continuationArr || (bestMove ? [bestMove] : []);
        highlightMove(bestMove);
        let scoreTxt = "";
        let pvStr = "N/A";
        if (evalScore !== undefined || mate !== undefined) {
            if (mate) {
                scoreTxt = `M${Math.abs(mate)}`;
                if (mate < 0) scoreTxt = "-" + scoreTxt;
            } else {
                const sc = parseFloat(evalScore);
                scoreTxt = (sc > 0 ? "+" : "") + sc;
            }
            if (continuationArr) pvStr = continuationArr.join(" ");
        }
        const durHtml = duration
            ? `<span style="font-size:0.7em; color:#aaa; font-weight:normal;">(${duration}s)</span>`
            : "";
        state.lastMoveResult = `✅ Best: <span style="font-weight:bold; color:var(--bot-primary);">${bestMove}</span>`;
        let wcHtml = "";
        if (winChance) wcHtml = `<span style="color:#aaa; font-size:0.8em;">(${Math.round(winChance)}%)</span>`;
        else if (depth) wcHtml = `<span style="font-size:0.8em; color:#aaa;">(Local Depth ${depth})</span>`;
        state.lastLiveResult = `
            <div style="display:flex; justify-content:space-between; align-items:center; font-weight:bold;">
                <span style="color:var(--bot-primary); font-size:1.1em;">${scoreTxt} ${durHtml}</span>
                <span>${wcHtml}</span>
            </div>
            <div style="margin-top:5px; font-size:0.85em; color:#bbb; width:100%; max-width:100%; box-sizing:border-box; word-wrap:break-word; overflow-wrap:anywhere; white-space:normal;">
                <span style="color:#888;">PV:</span> ${pvStr}
            </div>
        `;
        if (settings.autoMove) triggerAutoMove();
    }
    function triggerAutoMove() {
        if (!state.currentBestMove || !state.board?.game) return;
        const turn = state.board.game.getTurn();
        const playingAs = state.board.game.getPlayingAs();
        if (turn !== playingAs) return;
        const wait = Math.max(0, state.moveTargetTime - performance.now());
        setTimeout(() => playMove(state.currentBestMove), wait);
    }
    function handleError(type, err) {
        state.isThinking = !1;
        console.error(type, err);
        state.lastResponse = `${type}: ${err.message || err}`;
        state.lastMoveResult = `❌ ${type}`;
        updateUI();
    }
    function playMove(move) {
        if (!state.board?.game) return;
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const currentRaw = getRawBoardFEN();
        if (currentRaw && sanitizeFEN(currentRaw).split(" ")[0] !== state.lastSentFEN.split(" ")[0]) return;
        for (const m of state.board.game.getLegalMoves()) {
            if (m.from === from && m.to === to) {
                const promotion = move.length > 4 ? move.substring(4, 5) : "q";
                state.board.game.move({ ...m, promotion, animate: !0, userGenerated: !0 });
                return;
            }
        }
    }
    function highlightMove(move) {
        document.querySelectorAll(".bot-highlight").forEach((el) => el.remove());
        if (!move) return;
        if (settings.visualType === "arrow") {
            drawArrow(move);
        } else {
            const { highlightColor, innerOpacity, outerOpacity, gradientBias } = settings;
            const { r, g, b } = hexToRgb(highlightColor);
            const col = (a) => `rgba(${r}, ${g}, ${b}, ${a})`;
            const from = move.substring(0, 2);
            const to = move.substring(2, 4);
            [from, to].forEach((alg) => {
                const sqId = `${alg.charCodeAt(0) - 96}${alg.charAt(1)}`;
                const div = document.createElement("div");
                div.className = `square-${sqId} bot-highlight`;
                const biasPct = gradientBias + "%";
                div.style.cssText = `position: absolute; pointer-events: none; z-index: 200; width: 12.5%; height: 12.5%; box-sizing: border-box; background: radial-gradient(closest-side, ${col(innerOpacity)} ${biasPct}, ${col(outerOpacity)} 100%);`;
                state.board.appendChild(div);
            });
        }
        if (settings.showPVArrows && state.currentPV && state.currentPV.length > 0) {
            // MODIFIED LOGIC:
            // If engineMode is "cloud" (SF17.1), start from index 0.
            // Otherwise, start from index 1 (skip first move).
            const isCloud = settings.engineMode === "cloud";
            const start = isCloud ? 0 : 1;
            const end = isCloud ? settings.pvDepth : 1 + settings.pvDepth;
            const pvMoves = state.currentPV.slice(start, end);

            if (pvMoves.length > 0) {
                const total = pvMoves.length;
                pvMoves.forEach((pvMove, i) => {
                    let color;
                    if (settings.pvCustomGradient) {
                        const factor = total > 1 ? i / (total - 1) : 0;
                        color = interpolateColor(settings.pvStartColor, settings.pvEndColor, factor);
                    } else {
                        let g = 255;
                        if (total > 1) {
                            g = Math.round(255 * (1 - i / (total - 1)));
                        }
                        color = `rgb(255, ${g}, 0)`;
                    }
                    const text = settings.pvShowNumbers ? (i + 1).toString() : null;
                    drawArrow(pvMove, color, settings.arrowOpacity, text);
                });
            }
        }
    }
    function drawArrow(move, colorOverride = null, opacityOverride = null, text = null) {
        const color = colorOverride || settings.highlightColor;
        const opacity = opacityOverride !== null ? opacityOverride : settings.arrowOpacity;
        const width = settings.arrowWidth;
        let isFlipped = !1;
        if (state.board.classList.contains("flipped")) isFlipped = !0;
        else if (state.board.game && state.board.game.getPlayingAs && state.board.game.getPlayingAs() === "b") isFlipped = !0;
        const from = move.substring(0, 2);
        const to = move.substring(2, 4);
        const getCoords = (sq) => {
            const file = sq.charCodeAt(0) - 97;
            const rank = parseInt(sq[1]) - 1;
            let x, y;
            if (isFlipped) {
                x = (7 - file) * 12.5 + 6.25;
                y = rank * 12.5 + 6.25;
            } else {
                x = file * 12.5 + 6.25;
                y = (7 - rank) * 12.5 + 6.25;
            }
            return { x, y };
        };
        const start = getCoords(from);
        const end = getCoords(to);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const scale = width / 15;
        const headLen = 4 * scale;
        const headWidth = 3 * scale;
        const lineWidth = 1.2 * scale;
        if (len === 0) return;
        const ux = dx / len;
        const uy = dy / len;
        const endLineX = end.x - ux * headLen;
        const endLineY = end.y - uy * headLen;
        const px = -uy;
        const py = ux;
        const corner1X = endLineX + px * (headWidth / 2);
        const corner1Y = endLineY + py * (headWidth / 2);
        const corner2X = endLineX - px * (headWidth / 2);
        const corner2Y = endLineY - py * (headWidth / 2);
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("class", "bot-highlight");
        svg.style.cssText =
            "position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:200;";
        svg.setAttribute("viewBox", "0 0 100 100");
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", start.x);
        line.setAttribute("y1", start.y);
        line.setAttribute("x2", endLineX);
        line.setAttribute("y2", endLineY);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", lineWidth);
        line.setAttribute("stroke-opacity", opacity);
        const polygon = document.createElementNS(ns, "polygon");
        polygon.setAttribute("points", `${end.x},${end.y} ${corner1X},${corner1Y} ${corner2X},${corner2Y}`);
        polygon.setAttribute("fill", color);
        polygon.setAttribute("fill-opacity", opacity);
        svg.appendChild(line);
        svg.appendChild(polygon);
        if (text) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            const txt = document.createElementNS(ns, "text");
            txt.setAttribute("x", midX);
            txt.setAttribute("y", midY);
            txt.setAttribute("dominant-baseline", "middle");
            txt.setAttribute("text-anchor", "middle");
            txt.setAttribute("fill", "#000000");
            txt.setAttribute("font-size", 4 * scale + "px");
            txt.setAttribute("font-weight", "bold");
            txt.textContent = text;
            svg.appendChild(txt);
        }
        state.board.appendChild(svg);
    }
    function toggleAutoQueue() {
        if (state.newGameObserver) {
            state.newGameObserver.disconnect();
            state.newGameObserver = null;
        }
        if (state.queueTimeout) {
            clearTimeout(state.queueTimeout);
            state.queueTimeout = null;
        }
        if (settings.autoQueue) {
            state.newGameObserver = new MutationObserver((mutations) => {
                const btns = Array.from(document.querySelectorAll("button"));
                const newGameBtn = btns.find((b) => {
                    const txt = b.innerText.toLowerCase();
                    return txt.includes("new") && !txt.includes("rematch") && b.offsetParent !== null;
                });
                if (newGameBtn) {
                    if (!state.queueTimeout) {
                        state.queueTimeout = setTimeout(() => {
                            newGameBtn.click();
                            state.queueTimeout = null;
                        }, 100);
                    }
                }
            });
            state.newGameObserver.observe(document.body, { childList: !0, subtree: !0 });
        }
    }
    function saveSetting(key, val) {
        GM_setValue(`bot_${key}`, val);
    }
    function resetSettings() {
        const currentModel = settings.engineMode;
        Object.assign(settings, DEFAULT_SETTINGS);
        settings.engineMode = currentModel;
        Object.keys(DEFAULT_SETTINGS).forEach((k) => {
            if (k !== "engineMode") saveSetting(k, DEFAULT_SETTINGS[k]);
        });
        saveSetting("engineMode", currentModel);
        const hsl = rgbToHsl(...Object.values(hexToRgb(settings.highlightColor)));
        state.h = hsl.h;
        state.s = hsl.s;
        state.l = hsl.l;
        toggleAutoQueue();
        createUI();
    }
    function syncColor() {
        const rgb = hslToRgb(state.h, state.s, state.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        settings.highlightColor = hex;
        saveSetting("highlightColor", hex);
        if (state.ui.inpR) {
            state.ui.inpR.value = rgb.r;
            state.ui.inpG.value = rgb.g;
            state.ui.inpB.value = rgb.b;
            state.ui.inpHex.value = hex;
            state.ui.colorPreview.style.background = hex;
            state.ui.sliderH.value = state.h;
            state.ui.sliderS.value = state.s;
            state.ui.sliderL.value = state.l;
        }
        highlightMove(state.currentBestMove);
    }
    function createUI() {
        if (document.getElementById("enginePanel")) document.getElementById("enginePanel").remove();
        if (document.getElementById("modalOv")) document.getElementById("modalOv").remove();
        if (document.getElementById("histModalOv")) document.getElementById("histModalOv").remove();
        if (document.getElementById("fenTooltip")) document.getElementById("fenTooltip").remove();
        Object.keys(DEFAULT_SETTINGS).forEach((k) => {
            const saved = GM_getValue(`bot_${k}`);
            if (saved !== undefined) settings[k] = saved;
        });
        state.history = GM_getValue("bot_history", []);
        const initHsl = rgbToHsl(...Object.values(hexToRgb(settings.highlightColor)));
        state.h = initHsl.h;
        state.s = initHsl.s;
        state.l = initHsl.l;
        const savedW = GM_getValue("panelW", "33vw");
        const savedH = GM_getValue("panelH", "100vh");
        const savedX = GM_getValue("pX", "auto");
        const savedY = GM_getValue("pY", "0");
        const isMini = GM_getValue("isMini", !1);
        const style = `
            :root { --bot-bg:#222; --bot-b:#444; --bot-p:#81b64c; --bot-t:#eee; --bot-inp:#333; }
            #enginePanel * { box-sizing: border-box; }
            #enginePanel {
                position:fixed; width:${savedW}; height:${savedH};
                min-width:300px; min-height:300px;
                background:var(--bot-bg); border:1px solid var(--bot-b);
                color:var(--bot-t); z-index:9999; font-family:sans-serif;
                box-shadow:-4px 0 15px rgba(0,0,0,0.5); font-size:14px;
                display:flex; flex-direction:column; resize:both; overflow:hidden;
            }
            #enginePanel.minified #panelContent { display:none; }
            #enginePanel.minified { height:38px !important; resize:none; min-height:0 !important; overflow:hidden !important; border-bottom:0; }
            #panelHeader {
                background:var(--bot-p); color:#000; padding:10px; font-weight:bold;
                display:flex; justify-content:space-between; align-items:center;
                cursor:move; flex:none; user-select:none; height:38px;
            }
            #panelContent { padding:15px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; flex:1; min-height: 0; }
            .sect { border-top:1px solid #333; padding-top:10px; display:flex; flex-direction:column; gap:8px; }
            .sect-title { font-size:0.85em; color:#aaa; font-weight:bold; text-transform:uppercase; margin-bottom:4px; }
            .row { display:flex; justify-content:space-between; align-items:center; gap: 10px; }
            input, select { background:var(--bot-inp); color:var(--bot-t); border:1px solid var(--bot-b); padding:4px; border-radius:4px; }
            input[type="number"] { width: 60px; }
            select { width: 120px; }
            input[type="text"] { flex:1; }
            button { background:var(--bot-p); border:none; padding:10px; color:#000; font-weight:bold; cursor:pointer; border-radius:4px; }
            button:disabled { opacity:0.6; cursor:not-allowed; }
            #custBtn { background:#00bcd4; margin-top:5px; }
            #histBtn { background:#8e44ad; margin-top:5px; color: white; }
            .log-box {
                background:#111; padding:8px; font-family:monospace; font-size:0.75em; border-radius:4px;
                overflow-y:auto; word-break:break-all; white-space:pre-wrap; border:1px solid #333; height:100px; resize:vertical;
                user-select: text !important; -webkit-user-select: text !important; cursor: text;
            }
            #statusBox { background:#003344; padding:8px; border:1px solid #00bcd4; border-radius:4px; font-size:0.9em; min-height:40px; width: 100%; flex-shrink: 0; display: flex; flex-direction: column; gap: 5px; }
            #modalOv, #histModalOv { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:none; justify-content:center; align-items:center; }
            #modal, #histModal { background:var(--bot-bg); padding:20px; border-radius:8px; width:350px; border:1px solid var(--bot-b); }
            #histModal { width: 600px; height: 600px; max-height: 90vh; display: flex; flex-direction: column; }
            #modal * { color:var(--bot-t); }
            #modal label, #histModal label { color: #ffffff !important; opacity: 1 !important; font-weight: 600; }
            #modal input[type="color"] { height: 24px; padding: 0; width: 40px; cursor:pointer; border: none; }
            #modal select { height: 24px; padding: 0 4px; font-size: 0.9em; }
            .show-cloud { display: none; } .show-local { display: none; }
            body.mode-cloud .show-cloud { display: flex; }
            body.mode-local .show-local { display: flex; }
            .rgb-inputs { display: flex; gap: 5px; flex: 1; justify-content: flex-end; }
            .rgb-inputs input { width: 45px; text-align: center; }
            #sliderH { background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); height: 10px; border-radius: 5px; appearance: none; }
            #sliderH::-webkit-slider-thumb { -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%; background: #fff; cursor: pointer; border: 1px solid #000; }
            #histTableContainer { flex: 1; overflow-y: auto; border: 1px solid #444; border-radius: 4px; margin-top: 10px; }
            #histTable { width:100%; border-collapse: collapse; font-size:0.85em; }
            #histTable th, #histTable td { border-bottom: 1px solid #444; padding: 6px; text-align: left; color: #eee; }
            #histTable th { background: #333; color: var(--bot-p); position: sticky; top: 0; z-index: 1; }
            #histTable tr:hover { background: #2a2a2a; }
            .hist-win { color: #81b64c; font-weight: bold; }
            .hist-loss { color: #ff5555; font-weight: bold; }
            .hist-draw { color: #aaaaaa; font-weight: bold; }
            .hist-fen { max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; color: #888; text-decoration: underline dotted; }
            .btn-del { background: #ff5555; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.7em; cursor: pointer; border: none; }
            .hist-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
            .hist-controls label { color: #fff !important; font-size: 0.95em; opacity: 1; }
            #histEmpty { padding: 20px; text-align: center; color: #888; }
            #fenTooltip {
                position: fixed; border: 3px solid #333; background: #222;
                z-index: 10001; display: none; pointer-events: none;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }
            .fen-board { display: grid; grid-template-columns: repeat(8, 1fr); width: 240px; height: 240px; border: 2px solid #555; }
            .fen-sq { width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; background-size: 100%; background-repeat: no-repeat; }
            .fen-sq.light { background-color: #eeeed2; }
            .fen-sq.dark { background-color: #769656; }
        `;
        const html = `
            <style>${style}</style>
            <div id="enginePanel" class="${isMini ? "minified" : ""}">
                <div id="panelHeader">
                    <div style="display:flex; align-items:center; gap:5px;">
                        <span>Engine Controls</span>
                        <span id="minBtn" style="cursor:pointer; padding:0 5px;">▼</span>
                    </div>
                    <button id="btnReset" style="padding:2px 8px; font-size:0.8em; background:#0002; color:#000; cursor:pointer;">Reset Defaults</button>
                </div>
                <div id="panelContent">
                    <div id="statusBox">${state.lastLiveResult}</div>
                    <div id="moveResult" style="background:#333; padding:5px; border-radius:4px; text-align:center;">${state.lastMoveResult}</div>
                    <div class="sect">
                        <div class="sect-title">Engine Config</div>
                        <div class="row">
                            <label>Model</label>
                            <select id="selMode" style="width:240px;">
                                <option value="cloud">SF 17.1.0(cloud 0.25-0.48s)</option>
                                <option value="sfonline">SF 16.1.0(cloud 0.15-11.0s)</option>
                                <option value="local">SF 10.0.2(local 0.00-75.0s)</option>
                            </select>
                        </div>
                        <div class="row"><label>Depth (Max <span id="lblMaxDepth">18</span>)</label><input type="number" id="inpDepth" min="1" max="18" value="${settings.depth}"></div>
                        <div class="row show-cloud"><label>Max Time (ms)</label><input type="number" id="inpTime" value="${settings.maxThinkingTime}"></div>
                        <div class="row show-local"><label>Contempt (-100→100)</label><input type="number" id="inpContempt" min="-100" max="100" value="${settings.contempt}"></div>
                        <div class="row show-cloud"><label>Search</label><input type="text" id="inpSearch" value="${settings.searchMoves}"></div>
                    </div>
                    <div class="sect">
                        <div class="sect-title" style="display:flex; justify-content:space-between; align-items:center;">
                            PV Display
                            <input type="checkbox" id="chkPV" ${settings.showPVArrows ? "checked" : ""}>
                        </div>
                        <div id="pvSettings" style="display:none;">
                            <div class="row"><label>Depth (1-45)</label><input type="range" id="inpPVDepth" min="1" max="45" step="1" value="${settings.pvDepth}"></div>
                            <div class="row" style="padding-top:3px;"><label>Show Numbers</label><input type="checkbox" id="chkPVNums" ${settings.pvShowNumbers ? "checked" : ""}></div>
                            <div class="row" style="padding-top:5px;"><label>Custom Gradient</label><input type="checkbox" id="chkPVGrad" ${settings.pvCustomGradient ? "checked" : ""}></div>
                            <div id="pvGradSettings" style="display:none; padding-left:10px; border-left:2px solid #333; margin-top:5px;">
                                <div class="row"><label>Start Color</label><input type="color" id="inpPVStart" value="${settings.pvStartColor}"></div>
                                <div class="row"><label>End Color</label><input type="color" id="inpPVEnd" value="${settings.pvEndColor}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="sect">
                        <div class="sect-title">Automation</div>
                        <div class="row">
                            <label><input type="checkbox" id="chkRun" ${settings.autoRun ? "checked" : ""}> Auto-Analyze</label>
                            <label><input type="checkbox" id="chkMove" ${settings.autoMove ? "checked" : ""}> Auto-Move</label>
                            <label><input type="checkbox" id="chkQueue" ${settings.autoQueue ? "checked" : ""}> Auto-Queue</label>
                        </div>
                        <div class="row"><label>Randomized Delay (s)</label><div style="display:flex; gap:5px;"><input type="number" id="inpMin" style="width:50px" value="${settings.minDelay}"><span>-</span><input type="number" id="inpMax" style="width:50px" value="${settings.maxDelay}"></div></div>
                        <div style="font-size:0.7em; color:#888; text-align:right;" id="delayDisplay">Next: N/A</div>
                    </div>
                    <button id="btnAnalyze">Analyze</button>
                    <button id="custBtn">Visuals</button>
                    <button id="histBtn">Game History</button>
                    <div class="sect">
                         <div class="row"><label style="cursor:pointer"><input type="checkbox" id="chkDebug" ${settings.debugLogs ? "checked" : ""}> Show Debug Logs</label></div>
                         <div id="debugArea" style="display:${settings.debugLogs ? "block" : "none"}">
                             <div class="log-box" id="sentCommandOutput"></div>
                             <div class="log-box" id="receivedMessageOutput"></div>
                         </div>
                    </div>
                </div>
            </div>
            <div id="modalOv">
                <div id="modal">
                    <div class="row" style="border-bottom:1px solid #444; padding-bottom:10px; margin-bottom:10px;">
                        <h3 style="margin:0; color:var(--bot-p);">Visual Settings</h3>
                        <button id="modalClose" style="padding:2px 8px; font-weight:bold; cursor:pointer;">×</button>
                    </div>
                    <div class="sect" style="border:none; padding:0;">
                         <div class="row"><label>Type</label><select id="visType" style="width:100px; height:24px;"><option value="boxes">Boxes</option><option value="arrow">Arrow</option></select></div>
                         <div id="visBoxSettings">
                             <div class="row"><label>Inner Opacity</label><input type="range" id="visInnerOp" min="0" max="1" step="0.1" value="${settings.innerOpacity}"></div>
                             <div class="row"><label>Outer Opacity</label><input type="range" id="visOuterOp" min="0" max="1" step="0.1" value="${settings.outerOpacity}"></div>
                             <div class="row" style="padding-bottom:10px;"><label>Gradient Bias</label><input type="range" id="visBias" min="0" max="100" step="5" value="${settings.gradientBias}"></div>
                         </div>
                         <div id="visArrowSettings" style="display:none;">
                             <div class="row"><label>Arrow Opacity</label><input type="range" id="visArrowOp" min="0" max="1" step="0.1" value="${settings.arrowOpacity}"></div>
                             <div class="row" style="padding-bottom:10px;"><label>Arrow Width</label><input type="range" id="visArrowWidth" min="5" max="50" step="1" value="${settings.arrowWidth}"></div>
                         </div>
                    </div>
                    <div class="sect">
                        <div class="sect-title" style="margin-bottom:10px;">Color Editor</div>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div class="row" style="width:100%;">
                                <div id="colorPreview" style="width:30px; height:30px; border-radius:50%; border:2px solid #555; background:${settings.highlightColor};"></div>
                                <div class="rgb-inputs">
                                   <input type="number" id="inpR" min="0" max="255" placeholder="R">
                                   <input type="number" id="inpG" min="0" max="255" placeholder="G">
                                   <input type="number" id="inpB" min="0" max="255" placeholder="B">
                                </div>
                            </div>
                            <div class="row"><label>Hue</label><input type="range" id="sliderH" min="0" max="360" value="${state.h}"></div>
                            <div class="row"><label>Saturation</label><input type="range" id="sliderS" min="0" max="100" value="${state.s}"></div>
                            <div class="row"><label>Brightness</label><input type="range" id="sliderL" min="0" max="100" value="${state.l}"></div>
                            <div class="row" style="width:100%; margin-top:5px;"><label>Hex</label><input type="text" id="inpHex" style="text-transform:uppercase; text-align:center;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="histModalOv">
                <div id="histModal">
                    <div class="row" style="border-bottom:1px solid #444; padding-bottom:10px;">
                        <div style="display:flex; flex-direction:column;">
                            <h3 style="margin:0; color:#8e44ad;">Game History</h3>
                            <span style="font-size:0.75em; color:#888;">Max Capacity: 200 Games</span>
                        </div>
                        <button id="histModalClose" style="padding:2px 8px; font-weight:bold; cursor:pointer;">×</button>
                    </div>
                    <div id="histTableContainer">
                        <table id="histTable">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Color</th>
                                    <th>Result</th>
                                    <th>Clock</th>
                                    <th>FEN</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="histBody"></tbody>
                        </table>
                    </div>
                    <div class="hist-controls">
                        <label><input type="checkbox" id="chkHistory" ${settings.enableHistory ? "checked" : ""}> Recording Enabled</label>
                        <button id="btnClearHist" style="background:#ff5555; padding:5px 10px; color:white; font-size:0.8em;">Delete All</button>
                    </div>
                </div>
            </div>
            <div id="fenTooltip"></div>
        `;
        document.body.insertAdjacentHTML("beforeend", html);
        const panel = document.getElementById("enginePanel");
        const computed = window.getComputedStyle(panel);
        panel.style.width = computed.width;
        if (!isMini) {
            panel.style.height = computed.height;
        }
        if (savedX === "auto") {
            panel.style.right = "0px";
            panel.style.left = "auto";
        } else {
            panel.style.left = savedX + "px";
        }
        panel.style.top = savedY + "px";
        state.ui = {
            panel: panel,
            header: document.getElementById("panelHeader"),
            minBtn: document.getElementById("minBtn"),
            moveResult: document.getElementById("moveResult"),
            liveOutput: document.getElementById("statusBox"),
            logSent: document.getElementById("sentCommandOutput"),
            logRec: document.getElementById("receivedMessageOutput"),
            delayDisplay: document.getElementById("delayDisplay"),
            btnAnalyze: document.getElementById("btnAnalyze"),
            selMode: document.getElementById("selMode"),
            inpDepth: document.getElementById("inpDepth"),
            inpTime: document.getElementById("inpTime"),
            inpContempt: document.getElementById("inpContempt"),
            inpSearch: document.getElementById("inpSearch"),
            chkRun: document.getElementById("chkRun"),
            chkMove: document.getElementById("chkMove"),
            chkQueue: document.getElementById("chkQueue"),
            chkPV: document.getElementById("chkPV"),
            inpPVDepth: document.getElementById("inpPVDepth"),
            chkPVNums: document.getElementById("chkPVNums"),
            chkPVGrad: document.getElementById("chkPVGrad"),
            inpPVStart: document.getElementById("inpPVStart"),
            inpPVEnd: document.getElementById("inpPVEnd"),
            pvSettings: document.getElementById("pvSettings"),
            pvGradSettings: document.getElementById("pvGradSettings"),
            inpMin: document.getElementById("inpMin"),
            inpMax: document.getElementById("inpMax"),
            chkDebug: document.getElementById("chkDebug"),
            debugArea: document.getElementById("debugArea"),
            btnReset: document.getElementById("btnReset"),
            lblMaxDepth: document.getElementById("lblMaxDepth"),
            custBtn: document.getElementById("custBtn"),
            histBtn: document.getElementById("histBtn"),
            modal: document.getElementById("modalOv"),
            modalClose: document.getElementById("modalClose"),
            histModal: document.getElementById("histModalOv"),
            histModalClose: document.getElementById("histModalClose"),
            histBody: document.getElementById("histBody"),
            btnClearHist: document.getElementById("btnClearHist"),
            chkHistory: document.getElementById("chkHistory"),
            visType: document.getElementById("visType"),
            visBoxSettings: document.getElementById("visBoxSettings"),
            visArrowSettings: document.getElementById("visArrowSettings"),
            visInnerOp: document.getElementById("visInnerOp"),
            visOuterOp: document.getElementById("visOuterOp"),
            visBias: document.getElementById("visBias"),
            visArrowOp: document.getElementById("visArrowOp"),
            visArrowWidth: document.getElementById("visArrowWidth"),
            sliderH: document.getElementById("sliderH"),
            sliderS: document.getElementById("sliderS"),
            sliderL: document.getElementById("sliderL"),
            colorPreview: document.getElementById("colorPreview"),
            inpR: document.getElementById("inpR"),
            inpG: document.getElementById("inpG"),
            inpB: document.getElementById("inpB"),
            inpHex: document.getElementById("inpHex"),
            fenTooltip: document.getElementById("fenTooltip"),
        };
        state.ui.selMode.value = settings.engineMode;
        const bind = (el, key, type = "val") => {
            if (!el) return;
            el.addEventListener(type === "chk" ? "change" : "input", (e) => {
                const val =
                    type === "chk" ? e.target.checked : type === "num" ? parseFloat(e.target.value) : e.target.value;
                settings[key] = val;
                saveSetting(key, val);
                if (key === "autoMove" && val === !0) triggerAutoMove();
                if (key === "autoQueue") toggleAutoQueue();
                if (
                    [
                        "innerOpacity",
                        "outerOpacity",
                        "gradientBias",
                        "arrowOpacity",
                        "arrowWidth",
                        "showPVArrows",
                        "pvDepth",
                        "pvShowNumbers",
                        "pvCustomGradient",
                        "pvStartColor",
                        "pvEndColor",
                    ].includes(key)
                ) highlightMove(state.currentBestMove);
                updateUI();
            });
        };
        state.ui.btnAnalyze.onclick = () => analyze();
        state.ui.btnReset.onclick = resetSettings;
        state.ui.custBtn.onclick = () => (state.ui.modal.style.display = "flex");
        state.ui.modalClose.onclick = () => (state.ui.modal.style.display = "none");
        state.ui.histBtn.onclick = () => {
            renderHistory();
            state.ui.histModal.style.display = "flex";
        };
        state.ui.histModalClose.onclick = () => (state.ui.histModal.style.display = "none");
        state.ui.btnClearHist.onclick = () => {
            if (confirm("Delete all history?")) {
                state.history = [];
                GM_setValue("bot_history", []);
                renderHistory();
            }
        };
        state.ui.chkHistory.onchange = (e) => {
            settings.enableHistory = e.target.checked;
            saveSetting("enableHistory", e.target.checked);
        };
        state.ui.minBtn.onclick = () => {
            const isMini = state.ui.panel.classList.toggle("minified");
            GM_setValue("isMini", isMini);
        };
        [state.ui.sliderH, state.ui.sliderS, state.ui.sliderL].forEach((el) => {
            el.oninput = () => {
                state.h = parseFloat(state.ui.sliderH.value);
                state.s = parseFloat(state.ui.sliderS.value);
                state.l = parseFloat(state.ui.sliderL.value);
                syncColor();
            };
        });
        [state.ui.inpR, state.ui.inpG, state.ui.inpB].forEach((el) => {
            el.oninput = () => {
                const r = parseInt(state.ui.inpR.value) || 0,
                    g = parseInt(state.ui.inpG.value) || 0,
                    b = parseInt(state.ui.inpB.value) || 0;
                const hsl = rgbToHsl(r, g, b);
                state.h = hsl.h;
                state.s = hsl.s;
                state.l = hsl.l;
                syncColor();
            };
        });
        state.ui.inpHex.onchange = (e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
                const rgb = hexToRgb(hex);
                const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                state.h = hsl.h;
                state.s = hsl.s;
                state.l = hsl.l;
                syncColor();
            }
        };
        syncColor();
        state.ui.header.onmousedown = (e) => {
            if (e.target.id === "minBtn" || e.target.id === "btnReset") return;
            e.preventDefault();
            const startX = e.clientX - state.ui.panel.offsetLeft;
            const startY = e.clientY - state.ui.panel.offsetTop;
            const onMove = (mv) => {
                let x = mv.clientX - startX;
                let y = mv.clientY - startY;
                x = Math.max(0, Math.min(x, window.innerWidth - state.ui.panel.offsetWidth));
                y = Math.max(0, Math.min(y, window.innerHeight - state.ui.panel.offsetHeight));
                state.ui.panel.style.left = x + "px";
                state.ui.panel.style.top = y + "px";
                state.ui.panel.style.right = "auto";
                GM_setValue("pX", x);
                GM_setValue("pY", y);
            };
            document.addEventListener("mousemove", onMove);
            document.onmouseup = () => document.removeEventListener("mousemove", onMove);
        };
        new ResizeObserver(() => {
            if (!state.ui.panel.classList.contains("minified")) {
                GM_setValue("panelW", state.ui.panel.style.width);
                GM_setValue("panelH", state.ui.panel.style.height);
            }
        }).observe(state.ui.panel);
        state.ui.selMode.onchange = (e) => {
            settings.engineMode = e.target.value;
            saveSetting("engineMode", e.target.value);
            state.isThinking = !1;
            if (settings.engineMode === "local") loadLocalEngine();
            updateUI();
        };
        state.ui.chkDebug.onchange = (e) => {
            settings.debugLogs = e.target.checked;
            saveSetting("debugLogs", e.target.checked);
            updateUI();
        };
        state.ui.visType.onchange = (e) => {
            settings.visualType = e.target.value;
            saveSetting("visualType", e.target.value);
            toggleVisualInputs();
            highlightMove(state.currentBestMove);
        };
        function toggleVisualInputs() {
            if (settings.visualType === "arrow") {
                state.ui.visBoxSettings.style.display = "none";
                state.ui.visArrowSettings.style.display = "block";
            } else {
                state.ui.visBoxSettings.style.display = "block";
                state.ui.visArrowSettings.style.display = "none";
            }
        }
        state.ui.visType.value = settings.visualType;
        toggleVisualInputs();
        bind(state.ui.inpDepth, "depth", "num");
        bind(state.ui.inpTime, "maxThinkingTime", "num");
        bind(state.ui.inpContempt, "contempt", "num");
        bind(state.ui.inpSearch, "searchMoves");
        bind(state.ui.chkRun, "autoRun", "chk");
        bind(state.ui.chkMove, "autoMove", "chk");
        bind(state.ui.chkQueue, "autoQueue", "chk");
        bind(state.ui.chkPV, "showPVArrows", "chk");
        bind(state.ui.inpPVDepth, "pvDepth", "num");
        bind(state.ui.chkPVNums, "pvShowNumbers", "chk");
        bind(state.ui.chkPVGrad, "pvCustomGradient", "chk");
        bind(state.ui.inpPVStart, "pvStartColor");
        bind(state.ui.inpPVEnd, "pvEndColor");
        bind(state.ui.inpMin, "minDelay", "num");
        bind(state.ui.inpMax, "maxDelay", "num");
        bind(state.ui.visInnerOp, "innerOpacity", "num");
        bind(state.ui.visOuterOp, "outerOpacity", "num");
        bind(state.ui.visBias, "gradientBias", "num");
        bind(state.ui.visArrowOp, "arrowOpacity", "num");
        bind(state.ui.visArrowWidth, "arrowWidth", "num");
        toggleAutoQueue();
        updateUI();
    }
    function drawFenBoard(fen) {
        let rows = fen.split(" ")[0].split("/");
        let board = [];
        for (let r of rows) {
            let rowArr = [];
            for (let char of r) {
                if (!isNaN(char)) {
                    let empties = parseInt(char);
                    for (let k = 0; k < empties; k++) rowArr.push("");
                } else {
                    rowArr.push(char);
                }
            }
            board.push(rowArr);
        }
        let html = '<div class="fen-board">';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                const isDark = (r + c) % 2 === 1;
                const bg = piece ? `style="background-image: url('${PIECE_IMGS[piece]}');"` : "";
                html += `<div class="fen-sq ${isDark ? "dark" : "light"}" ${bg}></div>`;
            }
        }
        html += "</div>";
        return html;
    }
    function renderHistory() {
        if (!state.ui.histBody) return;
        state.ui.histBody.innerHTML = "";
        if (state.history.length === 0) {
            state.ui.histBody.innerHTML = '<tr><td colspan="5" id="histEmpty">No history yet.</td></tr>';
            return;
        }
        const sorted = [...state.history].reverse();
        sorted.forEach((item, index) => {
            const tr = document.createElement("tr");
            let resClass = "hist-draw";
            if (item.result === "Win") resClass = "hist-win";
            else if (item.result === "Loss") resClass = "hist-loss";
            tr.innerHTML = `
                <td>${item.date}</td>
                <td style="font-weight:bold; color:${item.color === "White" ? "#ffffff" : "#888888"};">${item.color || "N/A"}</td>
                <td class="${resClass}">${item.result}</td>
                <td>${item.myTime} / ${item.oppTime}</td>
                <td class="hist-fen" data-fen="${item.fen}">${item.fen}</td>
                <td><button class="btn-del" data-idx="${state.history.length - 1 - index}">Delete</button></td>
            `;
            state.ui.histBody.appendChild(tr);
        });
        document.querySelectorAll(".btn-del").forEach((btn) => {
            btn.onclick = (e) => {
                const idx = parseInt(e.target.dataset.idx);
                state.history.splice(idx, 1);
                GM_setValue("bot_history", state.history);
                renderHistory();
            };
        });
        document.querySelectorAll(".hist-fen").forEach((el) => {
            el.onmouseenter = (e) => {
                const fen = e.target.getAttribute("data-fen");
                if (fen && state.ui.fenTooltip) {
                    state.ui.fenTooltip.innerHTML = drawFenBoard(fen);
                    state.ui.fenTooltip.style.display = "block";
                    const rect = e.target.getBoundingClientRect();
                    let left = rect.left + 20;
                    let top = rect.bottom + 5;
                    if (left + 250 > window.innerWidth) left = window.innerWidth - 260;
                    if (top + 250 > window.innerHeight) top = rect.top - 260;
                    state.ui.fenTooltip.style.left = left + "px";
                    state.ui.fenTooltip.style.top = top + "px";
                }
            };
            el.onmouseleave = () => {
                if (state.ui.fenTooltip) state.ui.fenTooltip.style.display = "none";
            };
        });
    }
    function checkForGameOver() {
        if (!settings.enableHistory) return;
        const resultEl = document.querySelector(
            ".game-result-component, .game-over-modal-content, .daily-game-footer-game-over"
        );
        if (resultEl) {
            if (state.hasSavedCurrentGameResult) return;
            let fen = sanitizeFEN(getRawBoardFEN());
            let playingAsCode = state.playingAs;
            if (!playingAsCode && state.board?.game?.getPlayingAs) {
                try {
                    playingAsCode = state.board.game.getPlayingAs();
                } catch (e) {}
            }
            if (playingAsCode !== 1 && playingAsCode !== 2) playingAsCode = 0;
            const playerColor = playingAsCode === 2 ? "Black" : "White";
            if (playingAsCode === 2) {
                let parts = fen.split(" ");
                if (parts.length > 0) {
                    parts[0] = parts[0]
                        .split("/")
                        .reverse()
                        .map((row) => {
                            return row.split("").reverse().join("");
                        })
                        .join("/");
                    fen = parts.join(" ");
                }
            }
            let myTime = "N/A";
            let oppTime = "N/A";
            const clockBot = document.querySelector(".clock-bottom .clock-time-monospace, .clock-bottom");
            const clockTop = document.querySelector(".clock-top .clock-time-monospace, .clock-top");
            if (clockBot) myTime = clockBot.innerText;
            if (clockTop) oppTime = clockTop.innerText;
            let resultTxt = "Ended";
            let simpleRes = "Draw";
            const mainMsg = resultEl.querySelector(".game-result-main-message, .game-over-header-title");
            if (mainMsg) resultTxt = mainMsg.innerText.trim();
            else resultTxt = resultEl.innerText.split("\n")[0].trim();
            const subMsgEl = resultEl.querySelector(".game-result-sub-message, .game-over-header-subtitle");
            let subMsg = subMsgEl ? subMsgEl.innerText.trim() : "";
            const fullText = (resultTxt + " " + subMsg).toLowerCase();
            if (resultEl.classList.contains("game-result-win")) {
                simpleRes = "Win";
            } else if (resultEl.classList.contains("game-result-loss")) {
                simpleRes = "Loss";
            } else if (resultEl.classList.contains("game-result-draw")) {
                simpleRes = "Draw";
            } else if (fullText.includes("you won")) {
                simpleRes = "Win";
            } else if (fullText.includes("you lost")) {
                simpleRes = "Loss";
            } else if (playingAsCode === 1 && fullText.includes("white won")) {
                simpleRes = "Win";
            } else if (playingAsCode === 1 && fullText.includes("black won")) {
                simpleRes = "Loss";
            } else if (playingAsCode === 2 && fullText.includes("black won")) {
                simpleRes = "Win";
            } else if (playingAsCode === 2 && fullText.includes("white won")) {
                simpleRes = "Loss";
            }
            const gameObj = {
                date: new Date().toLocaleString(),
                color: playerColor,
                result: simpleRes,
                fen: fen,
                myTime: myTime,
                oppTime: oppTime,
                id: Date.now(),
            };
            state.history.push(gameObj);
            if (state.history.length > 200) state.history.shift();
            GM_setValue("bot_history", state.history);
            state.hasSavedCurrentGameResult = !0;
            if (state.ui.histModal && state.ui.histModal.style.display !== "none") renderHistory();
        } else {
            state.hasSavedCurrentGameResult = !1;
        }
    }
    function enforceBounds() {
        if (state.ui.panel) {
            const rect = state.ui.panel.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            if (rect.right > winW) state.ui.panel.style.width = winW - rect.left + "px";
            if (rect.bottom > winH) state.ui.panel.style.height = winH - rect.top + "px";
            if (rect.left < 0) state.ui.panel.style.left = "0px";
            if (rect.top < 0) state.ui.panel.style.top = "0px";
        }
        requestAnimationFrame(enforceBounds);
    }
    requestAnimationFrame(enforceBounds);
    function updateUI() {
        if (!state.ui.panel) return;
        document.body.classList.remove("mode-cloud", "mode-local", "mode-sfonline");
        document.body.classList.add(`mode-${settings.engineMode}`);
        if (state.ui.debugArea) state.ui.debugArea.style.display = settings.debugLogs ? "block" : "none";
        let maxD = 18;
        if (settings.engineMode === "local") maxD = 23;
        else if (settings.engineMode === "sfonline") maxD = 15;
        if (state.ui.lblMaxDepth) state.ui.lblMaxDepth.innerText = maxD;
        if (state.ui.inpDepth) state.ui.inpDepth.max = maxD;
        if (state.ui.inpPVDepth) {
            state.ui.inpPVDepth.max = 45;
        }
        if (state.ui.pvSettings) {
            state.ui.pvSettings.style.display = settings.showPVArrows ? "block" : "none";
        }
        if (state.ui.pvGradSettings) {
            state.ui.pvGradSettings.style.display = settings.pvCustomGradient ? "block" : "none";
        }
        if (state.ui.btnAnalyze) state.ui.btnAnalyze.disabled = state.isThinking;
        if (state.ui.moveResult) state.ui.moveResult.innerHTML = state.lastMoveResult;
        if (state.ui.liveOutput) state.ui.liveOutput.innerHTML = state.lastLiveResult;
        if (state.ui.delayDisplay) state.ui.delayDisplay.innerText = `Randomized Delay: ${state.calculatedDelay}s`;
        if (state.ui.logSent) state.ui.logSent.innerText = state.lastPayload;
        if (state.ui.logRec) state.ui.logRec.innerText = state.lastResponse;
        if (document.activeElement !== state.ui.inpDepth) state.ui.inpDepth.value = settings.depth;
    }
    function mainLoop() {
        state.board = document.querySelector(CONFIG.BOARD_SEL);
        if (!state.ui.panel) createUI();
        if (state.board?.game?.getPlayingAs) {
            try {
                const pa = state.board.game.getPlayingAs();
                if (pa === 1 || pa === 2) state.playingAs = pa;
            } catch (e) {}
        }
        if (state.board?.game && settings.autoRun) {
            const raw = getRawBoardFEN();
            if (raw) {
                const clean = sanitizeFEN(raw);
                const isTurn = state.board.game.getTurn() === state.board.game.getPlayingAs();
                if (isTurn && clean !== state.lastSanitizedBoardFEN) {
                    analyze(settings.depth);
                }
            }
        }
        checkForGameOver();
        updateUI();
    }
    setInterval(mainLoop, CONFIG.LOOP_MS);
})();