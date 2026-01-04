// ==UserScript==
// @name         Arson FlamesPrefetch Visualizer EA
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Visualizes all flamesPrefetch areas in real-time with live fetch interception
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554124/Arson%20FlamesPrefetch%20Visualizer%20EA.user.js
// @updateURL https://update.greasyfork.org/scripts/554124/Arson%20FlamesPrefetch%20Visualizer%20EA.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const CONFIG = {
        useSampleData: false,
        reverseOrder: true, // set to false if you work bottom up instead of top down. ( not an innuendo for anything :) )
        graphMaxValue: 11,
        highlightMomentumBelow: 2,
        highlightCurrentBelow: 11,
        refreshInterval: 1000,
        graphMode: "damage", // "intensity" or "damage"
        hideFullyDamaged: false,
        hideFFInProgress: true,
        showPredictionLine: true,
        predictionDuration: 60,
        baseDecayRate: 0.2, // intensity decay/s without firefighters
        firefighterDecayRate: 1.0, // intensity decay/s with firefighters
    };

    const responderDebug = new Map();

    const sampleData = {
        targets: [
            {
                title: "Fishing Hut",
                story: "Smoke on the Water",
                flamesPrefetch: [
                    {
                        time: 1759348834,
                        areas: [
                            { i: 39.2, peak: 4, current: 4, momentum: 6 },
                            { i: 15.6, peak: 2, current: 2, momentum: 4 },
                            { i: 15.6, peak: 2, current: 2, momentum: 4 },
                        ],
                        damage: 2,
                        stopped: false,
                        averageIntensity: "yellow",
                        firefightersInProgress: false,
                    },
                    {
                        time: 1759348839,
                        areas: [
                            { i: 59.2, peak: 5, current: 5, momentum: 6 },
                            { i: 35.6, peak: 4, current: 4, momentum: 4 },
                            { i: 35.6, peak: 4, current: 4, momentum: 4 },
                        ],
                        damage: 10,
                        stopped: false,
                        averageIntensity: "yellow",
                        firefightersInProgress: false,
                    },
                    {
                        time: 1759348844,
                        areas: [
                            { i: 69.2, peak: 6, current: 6, momentum: 0 },
                            { i: 45.6, peak: 5, current: 5, momentum: 0 },
                            { i: 45.6, peak: 5, current: 5, momentum: 0 },
                        ],
                        damage: 18,
                        stopped: false,
                        averageIntensity: "yellow",
                        firefightersInProgress: false,
                    },
                    {
                        time: 1759348849,
                        areas: [
                            { i: 68.2, peak: 6, current: 6, momentum: 0 },
                            { i: 44.6, peak: 5, current: 5, momentum: 0 },
                            { i: 44.6, peak: 5, current: 5, momentum: 0 },
                        ],
                        damage: 26,
                        stopped: false,
                        averageIntensity: "yellow",
                        firefightersInProgress: false,
                    },
                ],
            },
        ],
    };

    const stableIdMap = new Map();
    function generateStableId(target) {
        if (!stableIdMap.has(target.title)) {
            stableIdMap.set(target.title, `${target.title}_${Date.now()}_${Math.random().toString(36).slice(2)}`);
        }
        return stableIdMap.get(target.title);
    }

    let liveData = null;
    // ---------------- FETCH INTERCEPTION ----------------
    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const { fetch: originalFetch } = win;
    win.fetch = async (...args) => {
        if (CONFIG.useSampleData) return originalFetch(...args);
        const response = await originalFetch(...args);
        const url = typeof args[0] === "string" ? args[0] : args[0].url;
        if (url.includes("sid=crimesData")) {
            response
                .clone()
                .text()
                .then((body) => {
                try {
                    const data = JSON.parse(body);
                    if (
                        (url.includes("step=crimesList") || url.includes("step=attempt")) &&
                        data.DB?.crimesByType?.targets
                    ) {
                        if (data.DB?.crimesByType?.targets) {
                            liveData = { targets: data.DB.crimesByType.targets };
                            render(liveData);
                        }
                    }
                } catch (e) {}
            });
        }
        return response;
    };

    // ---------------- STYLE ----------------
    const css = `
    #fpv-container {
        position: fixed;
        bottom: 50px;
        right: 12px;
        background: rgba(12,12,12,0.88);
        color: #fff;
        padding: 10px;
        border-radius: 8px;
        z-index: 999999;
        font-family: Inter, Arial, sans-serif;
        width: min(95vw, 440px);
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 6px 18px rgba(0,0,0,0.6);
        backdrop-filter: blur(6px);
        font-size: clamp(10px, 1vw, 13px);
        resize: both;
        overflow: auto;
        cursor: default;
    }
    #fpv-container.dragging {
        opacity: 0.85;
        cursor: move;
        user-select: none;
    }
    #fpv-container::after {
        content: "";
        position: absolute;
        right: 4px;
        bottom: 4px;
        width: 12px;
        height: 12px;
        border-right: 2px solid rgba(255,255,255,0.15);
        border-bottom: 2px solid rgba(255,255,255,0.15);
        pointer-events: none;
    }
    #fpv-container table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
        font-size: inherit;
    }
    #fpv-container th, #fpv-container td {
        border: 1px solid rgba(255,255,255,0.06);
        padding: 3px 4px;
        text-align: center;
        word-break: break-word;
    }
    #fpv-container canvas {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 1;
        display: block;
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.15));
        margin-bottom: 8px;
    }
    .highlight-mom { background: rgba(248, 113, 113, 0.25); border-radius: 2px; }
    .highlight-cur { background: rgba(250, 204, 21, 0.25); border-radius: 2px; }
    .close-btn {
        cursor: pointer;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255,255,255,0.05);
        float: right;
    }
    #fpv-container::-webkit-scrollbar { width: 6px; }
    #fpv-container::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
    }
    #fpv-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.25);
    }
  `;

    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);

    // ---------------- DOM SETUP ----------------
    let container = document.getElementById("fpv-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "fpv-container";
        document.body.appendChild(container);
    }

    function escapeHtml(str) {
        return ("" + str).replace(/[&<>"'`]/g, (s) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#x60;",
        }[s]));
    }

    function buildTable(targets) {
        const colors = ["#4ade80","#facc15","#fb923c","#f87171","#60a5fa","#a78bfa"];
        let html = "";
        let targetsToRender = [...targets];
        if (CONFIG.reverseOrder) targetsToRender.reverse();
        targetsToRender.forEach((t) => {
            const minimized = hiddenLocations.has(t.title);
            html += `
				<div
				  style="
					font-weight: 700;
					margin-top: 6px;
					color: #cc5500;
					display: flex;
					align-items: center;
					gap: 6px;">
				  <button class="min-btn" data-loc="${escapeHtml(t.title)}"
					style="
					  background: none;
					  border: none;
					  color: #fff;
					  font-size: 16px; /* larger for visibility */
					  line-height: 1;
					  cursor: pointer;
					  opacity: 0.8;
					  transform: translateY(1px);
					">
					${minimized ? "▸" : "▾"}
				  </button>
				  <span>Location: ${escapeHtml(t.title || "")}</span>
				</div>
            `;
            if (minimized) return;
            if (!t.flamesPrefetch?.length) return;
            t.flamesPrefetch.forEach((fp) => {
                const timeStr = new Date(fp.time * 1000).toLocaleTimeString();
                html += `<div style="font-size:11px;margin-bottom:2px;"><strong>Time:</strong> ${timeStr}</div>`;
                html += `<table><thead><tr><th>Area</th><th>Intensity</th><th>Current</th><th>Peak</th><th>Momentum</th></tr></thead><tbody>`;
                fp.areas.forEach((a, ai) => {
                    const momClass = a.momentum < CONFIG.highlightMomentumBelow ? "highlight-mom" : "";
                    const curClass = a.current < CONFIG.highlightCurrentBelow ? "highlight-cur" : "";
                    const color = colors[ai % colors.length];
                    html += `<tr>
                                <td style="color:${color}">${ai + 1}</td>
                                <td style="color:${color}">${a.i ?? "-"}</td>
                                <td class="${curClass}" style="color:${color}">${a.current ?? "-"}</td>
                                <td style="color:${color}">${a.peak ?? "-"}</td>
                                <td class="${momClass}" style="color:${color}">${a.momentum ?? "-"}</td>
                            </tr>`;
                });
                html += `</tbody></table>`;
                html += `<div style="font-size:11px;margin-bottom:6px;opacity:0.8;">Damage: ${fp.damage ?? "-"}, Average Intensity: ${fp.averageIntensity ?? "-"}`;
                if (fp.firefightersInProgress) {
                    html += `, <span style="color:#60a5fa;font-weight:600;">Firefighters In Progress</span>`;
                } else {
                    html += `, FF Inc: ${
                    fp.firefightersIncoming ? "Yes" : "No"
                }, FF Level: ${fp.enrouteLevel ?? "-"}`;
                }
                html += `</div>`;
            });
        });
        return html;
    }

    let animationId = null;
    let timeInterval = null;
    function startTimeTicker() {
        if (timeInterval) return;
        timeInterval = setInterval(() => {
            const timeLabel = document.querySelector('#fpv-time');
            if (timeLabel) {
                timeLabel.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);
    }

    function stopTimeTicker() {
        if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
        }
    }

    let tMinGlobal = null;
    const STALE_TIMEOUT = 600; // seconds before purging old targets
    let hiddenLocations = new Set();
    const firstSeenTracker = {};


    function drawCanvas(targets) {
        const canvas = container.querySelector("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.clientWidth, h = canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        const newWidth = Math.round(w * dpr);
        const newHeight = Math.round(h * dpr);
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const mode = CONFIG.graphMode || "intensity";
        const maxY = mode === "damage" ? 100 : CONFIG.graphMaxValue;
        if (!window.__FPV_TARGETS) window.__FPV_TARGETS = new Map();
        const targetMap = window.__FPV_TARGETS;
        const colors = ["#4ade80","#facc15","#fb923c","#f87171","#60a5fa","#a78bfa"];
        const leftPadding = 35, rightPadding = 10, topPadding = 10, bottomPadding = 10;
        const plotHeight = h - topPadding - bottomPadding;
        const getYpos = v => topPadding + plotHeight - (v / maxY) * plotHeight;

        if (!canvas._staticCanvas) {
            canvas._staticCanvas = document.createElement("canvas");
        }
        const staticCanvas = canvas._staticCanvas;
        if (staticCanvas.width !== newWidth || staticCanvas.height !== newHeight) {
            staticCanvas.width = newWidth;
            staticCanvas.height = newHeight;
        }
        const staticCtx = staticCanvas.getContext("2d");
        staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // First, process all targets to maintain history
        targets.forEach((t, tIndex) => {
            const key = generateStableId(t);
            let hist = targetMap.get(key);
            if (!hist) {
                hist = {
                    start: null,
                    points: [],
                    ffArrival: null,
                    firstSeen: Date.now(),
                    lastSeen: Date.now()
                };
                targetMap.set(key, hist);
            }

            // Process flamesPrefetch data
            const currentSlice = (t.flamesPrefetch || []).map(fp => ({
                time: fp.time,
                damage: fp.damage ?? 0,
                areas: fp.areas,
                hasFF: !!fp.firefightersInProgress,
                ffIncoming: !!fp.firefightersIncoming,
                ffLevel: fp.enrouteLevel,
            }));

            // Merge with existing history
            const times = new Set(currentSlice.map(p => p.time));
            const merged = hist.points.filter(p => !times.has(p.time)).concat(currentSlice);
            merged.sort((a, b) => a.time - b.time);
            hist.points = merged;

            // Set start time if not already set
            if (hist.start === null && merged.length) {
                hist.start = merged[0].time;
            }
        });

        // Filter visible targets (not minimized and active)
        const visibleTargets = targets.filter(t => {
            if (hiddenLocations.has(t.title)) return false;
            const fp = t.flamesPrefetch?.[0];
            return fp && !fp.stopped && !(CONFIG.hideFullyDamaged && fp.damage >= 100) && !(CONFIG.hideFFInProgress && fp.firefightersInProgress);
        });

        if (!visibleTargets.length) {
            // If no visible targets, clear the canvas but don't return
            staticCtx.clearRect(0, 0, w, h);
            ctx.clearRect(0, 0, w, h);
            return;
        }

        const visibleKeys = new Set();
        const visibleStartTimes = [];
        const visibleEndTimes = [];

        // Collect time information for visible targets
        visibleTargets.forEach((t, tIndex) => {
            const key = generateStableId(t);
            visibleKeys.add(key);
            const hist = targetMap.get(key);
            if (hist && hist.start) {
                visibleStartTimes.push(hist.start);
                if (hist.points.length) {
                    visibleEndTimes.push(hist.points[hist.points.length - 1].time);
                }
            }
        });

        // Calculate the graph's time window
        const now = Math.floor(Date.now() / 1000);

        // Find the earliest start time among visible targets
        const visibleStart = visibleStartTimes.length ? Math.min(...visibleStartTimes) : now;

        // Find the latest end time among visible targets
        const visibleEnd = visibleEndTimes.length ? Math.max(...visibleEndTimes) : now;

        // Calculate the graph duration
        const minGraphDuration = 60; // Minimum 60 seconds visible
        const graphDuration = Math.max(
            minGraphDuration,
            visibleEnd - visibleStart + CONFIG.predictionDuration,
            now - visibleStart
        );

        const tMin = visibleStart;
        const tMax = tMin + graphDuration;
        const globalDuration = graphDuration;
        const plotWidth = w - leftPadding - rightPadding;

        // Draw static elements (grid, labels)
        staticCtx.clearRect(0, 0, w, h);
        const ySteps = mode === "damage" ? 10 : 11;
        staticCtx.strokeStyle = "rgba(255,255,255,0.08)";
        staticCtx.fillStyle = "rgba(255,255,255,0.5)";
        staticCtx.font = "10px Inter";
        staticCtx.textAlign = "right";
        staticCtx.textBaseline = "middle";

        for (let i = 0; i <= ySteps; i++) {
            const val = (i / ySteps) * maxY;
            const y = getYpos(val);
            staticCtx.beginPath();
            staticCtx.moveTo(leftPadding, y);
            staticCtx.lineTo(w - rightPadding, y);
            staticCtx.stroke();
            staticCtx.fillText(Math.round(val), leftPadding - 4, y);
        }

        // Draw time grid
        const gridStep = Math.max(5, Math.round(globalDuration / 8));
        staticCtx.textAlign = "center";
        staticCtx.textBaseline = "top";

        for (let t = tMin + gridStep; t <= tMax; t += gridStep) {
            const x = leftPadding + ((t - tMin) / globalDuration) * plotWidth;
            staticCtx.beginPath();
            staticCtx.moveTo(x, topPadding);
            staticCtx.lineTo(x, h - bottomPadding);
            staticCtx.stroke();
            staticCtx.fillText(`${Math.round(t - tMin)}s`, x, topPadding - 2);
        }

        // Draw each visible target's data
        visibleTargets.forEach((t, tIndex) => {
            const key = generateStableId(t);
            const hist = targetMap.get(key);
            if (!hist || !hist.points.length) return;

            const nAreas = t.flamesPrefetch?.[0]?.areas?.length || 0;
            for (let ai = 0; ai < nAreas; ai++) {
                const pts = hist.points
                .filter(p => p.areas?.[ai])
                .map(p => ({
                    t: p.time,
                    val: mode === "damage" ? p.damage : (p.areas[ai].i ?? p.areas[ai].current ?? 0)
                }));

                if (pts.length) {
                    staticCtx.strokeStyle = colors[ai % colors.length];
                    staticCtx.lineWidth = 2;
                    staticCtx.beginPath();
                    pts.forEach((p, i) => {
                        const x = leftPadding + ((p.t - tMin) / globalDuration) * plotWidth;
                        const y = getYpos(p.val);
                        i === 0 ? staticCtx.moveTo(x, y) : staticCtx.lineTo(x, y);
                    });
                    staticCtx.stroke();
                }
            }

            // Draw prediction line
            if (CONFIG.showPredictionLine && CONFIG.predictionDuration > 0 && mode === "damage") {
                const points = hist.points;
                const last = points[points.length - 1];
                if (!last.areas) return;

                const prev = points.slice(0, -1).reverse().find(p => p.damage !== undefined && p.time < last.time);
                if (!prev) return;

                const deltaT = Math.max(1, last.time - prev.time);
                let dps = Math.max(0, (last.damage - prev.damage) / deltaT);
                const hasFF = !!last.hasFF;

                const getIntensity = a => (typeof a.i === "number" ? a.i : (typeof a.current === "number" ? a.current : 0));
                const nAreas = last.areas.length;
                const adjacencyStatic = [[1,2],[3,4],[3,4],[],[]];
                const adjacency = Array.from({length: nAreas}, (_, i) => adjacencyStatic[i] || []);
                const peakIntensities = Array(nAreas).fill(0);

                points.forEach(p => {
                    if (Array.isArray(p.areas)) {
                        p.areas.forEach((a, i) => {
                            const int = getIntensity(a);
                            if (int > peakIntensities[i]) peakIntensities[i] = int;
                        });
                    }
                });

                let maxDamage = Math.max(last.damage, peakIntensities.reduce((s, v) => s + v, 0) / nAreas);
                let curInt = last.areas.map(getIntensity);
                const baseSum = curInt.reduce((s, v) => s + v, 0);
                if (baseSum <= 0) return;

                let futureDamage = last.damage;
                const predicted = [];

                for (let i = 1; i <= CONFIG.predictionDuration; i++) {
                    const sim = last.time + i;
                    if (hist.ffArrival && sim >= hist.ffArrival.time) {
                        curInt = curInt.map(int => Math.max(0, int - CONFIG.firefighterDecayRate));
                    } else if (!hasFF) {
                        curInt = curInt.map((int, idx) => {
                            const area = last.areas[idx];
                            if (area.momentum > 0) return int;
                            const willOverflow = (adjacency[idx] || []).some(adj => last.areas[adj] && last.areas[adj].momentum >= 5);
                            if (willOverflow) return int;
                            return Math.max(0, int - CONFIG.baseDecayRate);
                        });
                    }

                    const futureSum = curInt.reduce((s, v) => s + v, 0);
                    let scaled = dps * (futureSum / baseSum);
                    scaled = Math.max(0, scaled);
                    const next = Math.min(maxDamage, futureDamage + scaled);

                    if (next > futureDamage || !predicted.length) {
                        predicted.push({ t: sim, val: next });
                        futureDamage = next;
                    }

                    if (futureSum <= 0 && !hasFF) break;
                }

                const lastPred = predicted[predicted.length - 1];
                if (lastPred && lastPred.t < last.time + CONFIG.predictionDuration) {
                    predicted.push({ t: last.time + CONFIG.predictionDuration, val: lastPred.val });
                }

                if (!predicted.length) return;

                staticCtx.beginPath();
                const lastX = leftPadding + ((last.time - tMin) / globalDuration) * plotWidth;
                const lastY = getYpos(last.damage);
                staticCtx.moveTo(lastX, lastY);

                predicted.forEach(p => {
                    const x = leftPadding + ((p.t - tMin) / globalDuration) * plotWidth;
                    const y = getYpos(p.val);
                    staticCtx.lineTo(x, y);
                });

                let col = "rgba(255,255,255,0.6)";
                if (hasFF) col = "rgba(100,180,255,0.8)";
                else if (last.areas.some(a => a.momentum > 0)) col = "rgba(255,200,100,0.8)";

                staticCtx.strokeStyle = col;
                staticCtx.setLineDash([5, 4]);
                staticCtx.lineWidth = 2;
                staticCtx.stroke();
                staticCtx.setLineDash([]);

                // Draw prediction label with bounds checking
                const fin = predicted[predicted.length - 1];
                let fx = leftPadding + ((fin.t - tMin) / globalDuration) * plotWidth;
                const fy = getYpos(fin.val);

                // Ensure the label stays within the visible area
                const maxX = w - rightPadding - 20;
                if (fx > maxX) {
                    fx = maxX;
                    staticCtx.textAlign = "right";
                } else {
                    staticCtx.textAlign = "center";
                }

                staticCtx.fillStyle = "rgba(255,255,255,0.9)";
                staticCtx.font = "10px Inter";
                staticCtx.fillText(`${Math.round(fin.val)}%`, fx, fy - 6);
            }

            // Draw firefighter arrival line
            if (hist.ffArrival) {
                const ax = leftPadding + ((hist.ffArrival.time - tMin) / globalDuration) * plotWidth;
                if (ax >= leftPadding && ax <= w - rightPadding) {
                    staticCtx.strokeStyle = "rgba(100,180,255,0.9)";
                    staticCtx.lineWidth = 2;
                    staticCtx.setLineDash([8, 6]);
                    staticCtx.beginPath();
                    staticCtx.moveTo(ax, topPadding);
                    staticCtx.lineTo(ax, h - bottomPadding);
                    staticCtx.stroke();
                    staticCtx.setLineDash([]);

                    // Draw FF label with bounds checking
                    let ffX = ax;
                    const maxFFX = w - rightPadding - 10;
                    if (ffX > maxFFX) {
                        ffX = maxFFX;
                        staticCtx.textAlign = "right";
                    } else {
                        staticCtx.textAlign = "center";
                    }
                    staticCtx.fillStyle = "rgba(100,180,255,1)";
                    staticCtx.font = "10px Inter";
                    staticCtx.fillText("FF", ffX, bottomPadding + 6);
                }
            }
        });

        // Clean up stale targets
        const nowSec = Math.floor(Date.now() / 1000);
        for (const [key, hist] of targetMap.entries()) {
            if (!visibleKeys.has(key)) {
                if (!hist.lastSeen) hist.lastSeen = nowSec;
                if (nowSec - hist.lastSeen > STALE_TIMEOUT) {
                    targetMap.delete(key);
                    if (firstSeenTracker[key]) {
                        delete firstSeenTracker[key];
                    }
                }
            } else {
                hist.lastSeen = nowSec;
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(staticCanvas, 0, 0, w, h);
            const now = Math.floor(Date.now() / 1000);
            const rel = (now - tMin) / globalDuration;
            const x = leftPadding + rel * plotWidth;
            if (rel >= 0 && rel <= 1) {
                ctx.strokeStyle = "rgba(255,255,255,0.9)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
                ctx.fillStyle = "rgba(255,255,255,0.8)";
                ctx.font = "10px Inter";
                ctx.textAlign = "left";
                ctx.fillText("Now", x + 4, 12);
            }
            animationId = requestAnimationFrame(animate);
        }

        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
    }

    function render(data) {
        if (!data || !data.targets) {
            container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 4px;">
                <div>Flames Prefetch Visualizer</div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <span id="fpv-time" style="font-size: 11px; opacity: 0.7">
                        ${new Date().toLocaleTimeString()}
                    </span>
                    <span class="close-btn" style="cursor: pointer; font-size: 12px; padding: 2px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.05);">
                        ✕
                    </span>
                </div>
            </div>
            <div style="font-size: 12px; opacity: 0.6">No active data available</div>
        `;
            container.querySelector(".close-btn").onclick = () => {
                container.style.display = "none";
                cancelAnimationFrame(animationId);
                animationId = null;
                stopTimeTicker();
            };
            return;
        }

        const activeTargets = (data.targets || []).filter((t) => {
            if (!t.flamesPrefetch?.length) return false;
            const fp = t.flamesPrefetch[0];
            if (fp.stopped) return false;
            if (CONFIG.hideFullyDamaged && fp.damage >= 100) return false;
            if (CONFIG.hideFFInProgress && fp.firefightersInProgress) return false;
            return true;
        });

        if (activeTargets.length === 0) {
            container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 4px;">
                <div>Flames Prefetch Visualizer</div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <span id="fpv-time" style="font-size: 11px; opacity: 0.7">
                        ${new Date().toLocaleTimeString()}
                    </span>
                    <span class="close-btn" style="cursor: pointer; font-size: 12px; padding: 2px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.05);">
                        ✕
                    </span>
                </div>
            </div>
            <div style="font-size: 12px; opacity: 0.6">No active data available</div>
        `;
            container.querySelector(".close-btn").onclick = () => {
                container.style.display = "none";
                cancelAnimationFrame(animationId);
                animationId = null;
                stopTimeTicker();
            };
            return;
        }

        container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 4px;">
            <div>Flames Prefetch Visualizer</div>
            <div style="display: flex; align-items: center; gap: 8px">
                <span id="fpv-time" style="font-size: 11px; opacity: 0.7">
                    ${new Date().toLocaleTimeString()}
                </span>
                <span class="close-btn" style="cursor: pointer; font-size: 12px; padding: 2px 6px; border-radius: 4px; background: rgba(255, 255, 255, 0.05);">
                    ✕
                </span>
            </div>
        </div>
        <canvas></canvas>
        ${buildTable(activeTargets)}
    `;

        container.querySelector(".close-btn").onclick = () => {
            container.style.display = "none";
            cancelAnimationFrame(animationId);
            animationId = null;
            stopTimeTicker();
        };

        container.querySelectorAll(".min-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const loc = btn.getAttribute("data-loc");
                if (hiddenLocations.has(loc)) {
                    hiddenLocations.delete(loc);
                } else {
                    hiddenLocations.add(loc);
                }
                render(liveData || sampleData);
            });
        });

        drawCanvas(activeTargets);
    }


    (function enableDragAndResize() {
        const el = document.getElementById("fpv-container");
        if (!el) return;
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        el.addEventListener("mousedown", (e) => {
            if (!e.altKey) return;
            isDragging = true;
            el.classList.add("dragging");
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            e.preventDefault();
        });
        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.left = `${startLeft + dx}px`;
            el.style.top = `${startTop + dy}px`;
            el.style.right = "auto";
            e.preventDefault();
        });
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                el.classList.remove("dragging");
            }
        });
    })();

    let visualizerInterval = null;
    let currentUrl = location.href;
    function startVisualizer() {
        if (visualizerInterval) clearInterval(visualizerInterval);
        const isArson = location.href.includes("#/arson");
        container.style.display = isArson ? "block" : "none";
        if (isArson) {
            updateLoop();
            visualizerInterval = setInterval(updateLoop, CONFIG.refreshInterval);
            startTimeTicker();
        }
    }

    function stopVisualizer() {
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerInterval = null;
        }
        cancelAnimationFrame(animationId);
        animationId = null;
        stopTimeTicker();
    }
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            stopVisualizer();
            startVisualizer();
        }
    }, 1000);

    let lastDataSignature = "";
    function getDataSignature(data) {
        if (!data || !data.targets) return "";
        return data.targets.map(t => t.flamesPrefetch?.[0]?.time || '0').sort((a,b) => a - b).join(',');
    }

    function updateLoop() {
        const data = CONFIG.useSampleData ? sampleData : liveData;
        if (!data) return; // don’t render nulls
        const newSignature = getDataSignature(data);
        if (newSignature !== lastDataSignature) {
            render(data);
            lastDataSignature = newSignature;
        }
    }

    startVisualizer();

    if (CONFIG.useSampleData) {
        liveData = sampleData;
        render(liveData);
    }
})();