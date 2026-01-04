// ==UserScript==
// @name         Arson FlamesPrefetch Visualizer + Mobile
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  Visualizes all flamesPrefetch areas in real-time with live fetch interception
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553063/Arson%20FlamesPrefetch%20Visualizer%20%2B%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/553063/Arson%20FlamesPrefetch%20Visualizer%20%2B%20Mobile.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const IS_MOBILE = /Android|iPhone|iPad|Mobile|TornPDA/i.test(navigator.userAgent);

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
    };

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
                ],
            },
        ],
    };

    let liveData = null;

    function getRfcvToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'rfc_v') return value;
        }
        return null;
    }

    async function manualRefresh() {
        const token = getRfcvToken();
        if (!token) return alert("RFCV token not found in cookies.");
        const formData = new FormData();
        formData.append("typeID", "13");
        try {
            const res = await fetch(`https://www.torn.com/page.php?sid=crimesData&step=crimesList&rfcv=${token}`, {
                method: "POST",
                body: formData,
            });
            const body = await res.text();
            const data = JSON.parse(body);
            if (data.DB?.crimesByType?.targets) {
                liveData = { targets: data.DB.crimesByType.targets };
                render(liveData);
            }
        } catch (err) {
            console.error("Manual refresh failed:", err);
        }
    }

    // ---------------- FETCH INTERCEPTION ----------------
    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const { fetch: originalFetch } = win;

    win.fetch = async (...args) => {
        if (CONFIG.useSampleData) return originalFetch(...args);

        const response =
              args.length === 1
        ? await originalFetch(args[0])
        : await originalFetch(args[0], args[1]);

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

    const mobileCss = `
@media (max-width: 900px) {
  #fpv-container {
    bottom: 10px !important;
    right: 10px !important;
    width: 95vw !important;
    font-size: 11px !important;
    max-height: 75vh !important;
    padding: 6px !important;
    backdrop-filter: blur(4px);
    overflow-y: auto;
  }
  #fpv-container table th,
  #fpv-container table td {
    padding: 2px 3px !important;
    font-size: 10px !important;
  }
  #fpv-container canvas {
    aspect-ratio: 3 / 2 !important;
  }
  #fpv-container .close-btn,
  #fpv-container .refresh-btn {
    padding: 2px 6px !important;
    font-size: 10px !important;
  }
}
`;

    const styleMobile = document.createElement("style");
    styleMobile.textContent = mobileCss;
    document.head.appendChild(styleMobile);

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
            html += `<div style="font-weight:700;margin-top:4px;color:#CC5500;">Location: ${escapeHtml(t.title || "")}</div>`;
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

    function drawCanvas(targets) {
        const canvas = container.querySelector("canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const w = canvas.clientWidth, h = canvas.clientHeight;
        canvas.width = w * 2; canvas.height = h * 2; ctx.setTransform(2, 0, 0, 2, 0, 0);
        const mode = CONFIG.graphMode || "intensity";
        const displaySegments = IS_MOBILE ? [0, 2, 4] : null;
        const maxY = mode === "damage" ? 100 : CONFIG.graphMaxValue;
        const allPoints = targets.flatMap((t) => t.flamesPrefetch || []);
        if (!allPoints.length) return;

        const tMin = Math.min(...allPoints.map((p) => p.time));
        const tMax = Math.max(...allPoints.map((p) => p.time));
        const duration = Math.max(1, tMax - tMin);
        const colors = ["#4ade80","#facc15","#fb923c","#f87171","#60a5fa","#a78bfa"];
        const leftPadding = 35, rightPadding = 10, topPadding = 10, bottomPadding = 10;
        const plotWidth = w - leftPadding - rightPadding;
        const plotHeight = h - topPadding - bottomPadding;
        const getYpos = (v) => topPadding + plotHeight - (v / maxY) * plotHeight;

        const staticCanvas = document.createElement("canvas");
        staticCanvas.width = canvas.width;
        staticCanvas.height = canvas.height;
        const staticCtx = staticCanvas.getContext("2d");
        staticCtx.setTransform(2, 0, 0, 2, 0, 0);

        function drawStaticChart() {
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

            const gridStep = Math.max(5, Math.round(duration / 6));
            staticCtx.textAlign = "center";
            staticCtx.textBaseline = "top";
            for (let t = tMin + gridStep; t <= tMax; t += gridStep) {
                const x = leftPadding + ((t - tMin) / duration) * plotWidth;
                staticCtx.beginPath();
                staticCtx.moveTo(x, topPadding);
                staticCtx.lineTo(x, h - bottomPadding);
                staticCtx.stroke();
                staticCtx.fillText(`+${Math.round(t - tMin)}s`, x, topPadding - 2);
            }

            targets.forEach((t) => {
                if (!t.flamesPrefetch?.length) return;
                const nAreas = t.flamesPrefetch[0].areas.length;
                for (let b = 0; b < nAreas; b++) {
                    if (IS_MOBILE && !displaySegments.includes(b)) continue;
                    const points = t.flamesPrefetch.map((fp) => ({
                        t: fp.time,
                        val: mode === "damage" ? fp.damage ?? 0 : fp.areas[b].current,
                    }));
                    staticCtx.strokeStyle = colors[b % colors.length];
                    staticCtx.lineWidth = 2;
                    staticCtx.beginPath();
                    points.forEach((p, i) => {
                        const x = leftPadding + ((p.t - tMin) / duration) * plotWidth;
                        const yVal = getYpos(p.val);
                        if (i === 0) staticCtx.moveTo(x, yVal);
                        else staticCtx.lineTo(x, yVal);
                    });
                    staticCtx.stroke();
                }
            });
        }

        drawStaticChart();

        function animate() {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(staticCanvas, 0, 0, w, h);
            const now = Math.floor(Date.now() / 1000);
            const relative = (now - tMin) / duration;
            const x = leftPadding + relative * plotWidth;
            if (relative >= 0 && relative <= 1) {
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
					<button class="refresh-btn" style="font-size: 12px; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: #fff; cursor: pointer; transition: all 0.2s ease;">
					  Refresh
					</button>
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
            container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
            container.querySelector(".refresh-btn").onclick = manualRefresh;
            return;
        }

        setInterval(() => {
            const timeLabel = document.querySelector('#fpv-time');
            if (timeLabel) {
                timeLabel.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);

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
					<button class="refresh-btn" style="font-size: 12px; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: #fff; cursor: pointer; transition: all 0.2s ease;">
					  Refresh
					</button>
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
            container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
            container.querySelector(".refresh-btn").onclick = manualRefresh;
            return;
        }

        container.innerHTML = `
			<div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 4px;">
			  <div>Flames Prefetch Visualizer</div>
			  <div style="display: flex; align-items: center; gap: 8px">
				<button class="refresh-btn" style="font-size: 12px; padding: 3px 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: #fff; cursor: pointer; transition: all 0.2s ease;">
				  Refresh
				</button>
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

        container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
        container.querySelector(".refresh-btn").onclick = manualRefresh;

        drawCanvas(activeTargets);
    }

    (function enableDrag() {
        const el = document.getElementById("fpv-container");
        if (!el) return;

        el.style.position = el.style.position || "fixed";
        el.style.touchAction = "none"; // needed for some browsers
        el.style.userSelect = "none";

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        function startDrag(clientX, clientY) {
            const rect = el.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            isDragging = true;
        }

        function doDrag(clientX, clientY) {
            if (!isDragging) return;
            el.style.left = clientX - offsetX + "px";
            el.style.top = clientY - offsetY + "px";
            el.style.right = "auto"; // prevent conflicts
        }

        function endDrag() {
            isDragging = false;
        }

        // Desktop
        el.addEventListener("mousedown", (e) => {
            if (!e.altKey || e.button !== 0) return;
            startDrag(e.clientX, e.clientY);
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => doDrag(e.clientX, e.clientY));
        document.addEventListener("mouseup", endDrag);

        // Mobile
        el.addEventListener("touchstart", (e) => {
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
        });

        document.addEventListener("touchmove", (e) => {
            if (!isDragging) return; // only prevent default if dragging
            const t = e.touches[0];
            doDrag(t.clientX, t.clientY);
            e.preventDefault(); // only blocks scrolling during actual drag
        });

        document.addEventListener("touchend", endDrag);
    })();



    // --- SPA-SAFE INITIALIZATION ---
    let visualizerInterval = null;
    let currentUrl = location.href;

    function startVisualizer() {
        if (visualizerInterval) clearInterval(visualizerInterval);
        const isArson = location.href.includes("#/arson");
        container.style.display = isArson ? "block" : "none";
        if (isArson) {
            updateLoop();
            visualizerInterval = setInterval(updateLoop, CONFIG.refreshInterval);
        }
    }

    function stopVisualizer() {
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerInterval = null;
        }
    }

    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            stopVisualizer();
            startVisualizer();
        }
    }, 1000);

    let lastDataJSON = "";
    function updateLoop() {
        const data = CONFIG.useSampleData ? sampleData : liveData;
        if (!data) return; // don’t render nulls

        const newJSON = JSON.stringify(data);
        if (newJSON !== lastDataJSON) {
            render(data);
            lastDataJSON = newJSON;
        }
    }

    startVisualizer();
})();
