// ==UserScript==
// @name         Arson FlamesPrefetch Visualizer (Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Mobile-optimized visualizer for torn arson crime
// @author       Allenone[2033011], adapted for mobile by MoAlaa[2774213]
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553013/Arson%20FlamesPrefetch%20Visualizer%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553013/Arson%20FlamesPrefetch%20Visualizer%20%28Mobile%29.meta.js
// ==/UserScript==


(function () {
    "use strict";

    const CONFIG = {
        useSampleData: false,
        reverseOrder: true,
        highlightMomentumBelow: 2,
        highlightCurrentBelow: 11,
        refreshInterval: 2000,
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

    // Fetch Interception
    const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    const { fetch: originalFetch } = win;

    win.fetch = async (...args) => {
        if (CONFIG.useSampleData) return originalFetch(...args);
        const response = args.length === 1 ? await originalFetch(args[0]) : await originalFetch(args[0], args[1]);
        const url = typeof args[0] === "string" ? args[0] : args[0].url;
        if (url.includes("sid=crimesData")) {
            response.clone().text().then((body) => {
                try {
                    const data = JSON.parse(body);
                    if ((url.includes("step=crimesList") || url.includes("step=attempt")) && data.DB?.crimesByType?.targets) {
                        liveData = { targets: data.DB.crimesByType.targets };
                        render(liveData);
                    }
                } catch (e) {}
            });
        }
        return response;
    };

    // Mobile-Optimized CSS
    const css = `
        #fpv-container {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 90vw;
            max-height: 50vh;
            background: rgba(12,12,12,0.9);
            color: #fff;
            padding: 8px;
            border-radius: 8px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
        }
        #fpv-toggle {
            position: fixed;
            bottom: 75px;
            right: 10px;
            background: #CC5500;
            color: #fff;
            padding: 10px 10px;
            border-radius: 50%;
            font-size: 14px;
            cursor: pointer;
            z-index: 1000000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        #fpv-container table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
            table-layout: fixed;
            font-size: 10px;
        }
        #fpv-container th, #fpv-container td {
            border: 1px solid rgba(255,255,255,0.1);
            padding: 2px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        #fpv-container th:nth-child(1), #fpv-container td:nth-child(1) { width: 15%; }
        #fpv-container th:nth-child(2), #fpv-container td:nth-child(2) { width: 25%; }
        #fpv-container th:nth-child(3), #fpv-container td:nth-child(3) { width: 20%; }
        #fpv-container th:nth-child(4), #fpv-container td:nth-child(4) { width: 20%; }
        #fpv-container th:nth-child(5), #fpv-container td:nth-child(5) { width: 20%; }
        .highlight-mom { background: rgba(248, 113, 113, 0.3); }
        .highlight-cur { background: rgba(250, 204, 21, 0.3); }
        .fpv-btn {
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(255,255,255,0.1);
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: 11px;
            margin-left: 4px;
        }
        .progress-bar {
            height: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 4px 0;
        }
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        #fpv-container::-webkit-scrollbar { width: 4px; }
        #fpv-container::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
        }
    `;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);

    // DOM Setup
    let container = document.getElementById("fpv-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "fpv-container";
        container.style.display = "none";
        document.body.appendChild(container);
    }
    let toggleBtn = document.getElementById("fpv-toggle");
    if (!toggleBtn) {
        toggleBtn = document.createElement("div");
        toggleBtn.id = "fpv-toggle";
        toggleBtn.textContent = "🔥";
        toggleBtn.style.display = "none";
        toggleBtn.onclick = () => {
            container.style.display = container.style.display === "none" ? "block" : "none";
        };
        document.body.appendChild(toggleBtn);
    }

    function escapeHtml(str) {
        return ("" + str).replace(/[&<>"'`]/g, (s) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#x60;",
        }[s]));
    }

    function buildTable(targets) {
        const colors = ["#4ade80", "#facc15", "#fb923c", "#f87171", "#60a5fa", "#a78bfa"];
        let html = "";
        let targetsToRender = [...targets];
        if (CONFIG.reverseOrder) targetsToRender.reverse();
        targetsToRender.forEach((t) => {
            html += `<div style="font-weight:600;margin:4px 0;color:#CC5500;">${escapeHtml(t.title || "")}</div>`;
            if (!t.flamesPrefetch?.length) return;

            // Find the earliest timestamp as the event start
            const earliestTime = Math.min(...t.flamesPrefetch.map((fp) => fp.time));

            // Define target intervals (6s, 12s, 20s) with tolerance windows
            const intervals = [
                { targetDiff: 6, tolerance: [4, 8] }, // 6s ± 2s
                { targetDiff: 12, tolerance: [10, 14] }, // 12s ± 2s
                { targetDiff: 20, tolerance: [18, 22] }, // 20s ± 2s
            ];

            // Select up to 3 flamesPrefetch entries
            const selectedPrefetches = [];
            const usedTimes = new Set();

            intervals.forEach((interval) => {
                const targetTime = earliestTime + interval.targetDiff;
                const candidates = t.flamesPrefetch
                    .filter((fp) => {
                        const timeDiff = fp.time - earliestTime;
                        return (
                            timeDiff >= interval.tolerance[0] &&
                            timeDiff <= interval.tolerance[1] &&
                            !usedTimes.has(fp.time)
                        );
                    })
                    .sort((a, b) => Math.abs(a.time - targetTime) - Math.abs(b.time - targetTime));

                if (candidates.length > 0) {
                    const closest = candidates[0];
                    selectedPrefetches.push(closest);
                    usedTimes.add(closest.time);
                }
            });

            // If fewer than 3 entries, fill with closest unused entries
            if (selectedPrefetches.length < 3 && t.flamesPrefetch.length > selectedPrefetches.length) {
                const remaining = t.flamesPrefetch
                    .filter((fp) => !usedTimes.has(fp.time))
                    .sort((a, b) => a.time - b.time);
                while (selectedPrefetches.length < 3 && remaining.length > 0) {
                    const next = remaining.shift();
                    selectedPrefetches.push(next);
                    usedTimes.add(next.time);
                }
            }

            // Sort selected entries by time (ascending) for display
            selectedPrefetches.sort((a, b) => a.time - b.time);

            // Generate tables for selected entries
            selectedPrefetches.forEach((fp) => {
                const timeStr = new Date(fp.time * 1000).toLocaleTimeString();
                html += `<div style="font-size:10px;margin-bottom:2px;">Time: ${timeStr} (~${(fp.time - earliestTime)}s)</div>`;
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
                const damagePercent = Math.min(100, fp.damage || 0);
                html += `
                    <div style="font-size:10px;margin:4px 0;opacity:0.8;">
                        Damage: ${damagePercent}%
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${damagePercent}%;background:#f87171;"></div>
                        </div>
                        Avg Intensity: ${fp.averageIntensity ?? "-"}
                        ${fp.firefightersInProgress ? '<span style="color:#60a5fa;">Firefighters Active</span>' : `FF Inc: ${fp.firefightersIncoming ? "Yes" : "No"}`}
                    </div>`;
            });
        });
        return html;
    }

    function render(data) {
        if (!data || !data.targets) {
            container.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <div style="font-weight:600;">Arson Visualizer</div>
                    <div style="display:flex;gap:6px;">
                        <button class="fpv-btn refresh-btn">Refresh</button>
                        <span id="fpv-time" style="font-size:10px;opacity:0.7">${new Date().toLocaleTimeString()}</span>
                        <button class="fpv-btn close-btn">✕</button>
                    </div>
                </div>
                <div style="font-size:11px;opacity:0.6;">No active data</div>
            `;
            container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
            container.querySelector(".refresh-btn").onclick = manualRefresh;
            return;
        }

        setInterval(() => {
            const timeLabel = document.querySelector('#fpv-time');
            if (timeLabel) timeLabel.textContent = new Date().toLocaleTimeString();
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
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <div style="font-weight:600;">Arson Visualizer</div>
                    <div style="display:flex;gap:6px;">
                        <button class="fpv-btn refresh-btn">Refresh</button>
                        <span id="fpv-time" style="font-size:10px;opacity:0.7">${new Date().toLocaleTimeString()}</span>
                        <button class="fpv-btn close-btn">✕</button>
                    </div>
                </div>
                <div style="font-size:11px;opacity:0.6;">No active data</div>
            `;
            container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
            container.querySelector(".refresh-btn").onclick = manualRefresh;
            return;
        }

        container.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-weight:600;">Arson Visualizer</div>
                <div style="display:flex;gap:6px;">
                    <button class="fpv-btn refresh-btn">Refresh</button>
                    <span id="fpv-time" style="font-size:10px;opacity:0.7">${new Date().toLocaleTimeString()}</span>
                    <button class="fpv-btn close-btn">✕</button>
                </div>
            </div>
            ${buildTable(activeTargets)}
        `;
        container.querySelector(".close-btn").onclick = () => (container.style.display = "none");
        container.querySelector(".refresh-btn").onclick = manualRefresh;
    }

    // SPA-Safe Initialization
    let visualizerInterval = null;
    let currentUrl = location.href;

    function startVisualizer() {
        if (visualizerInterval) clearInterval(visualizerInterval);
        const isArson = location.href === "https://www.torn.com/page.php?sid=crimes#/arson";
        container.style.display = "none";
        toggleBtn.style.display = isArson ? "block" : "none";
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
        container.style.display = "none";
        toggleBtn.style.display = "none";
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
        if (!data) return;
        const newJSON = JSON.stringify(data);
        if (newJSON !== lastDataJSON) {
            render(data);
            lastDataJSON = newJSON;
        }
    }

    startVisualizer();
})();