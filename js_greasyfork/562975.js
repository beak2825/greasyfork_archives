// ==UserScript==
// @name         YouTube Speed Display Enhanced
// @name:zh-CN   YouTube 网速显示增强版
// @name:zh-TW   YouTube 網速顯示增強版
// @namespace    https://greasyfork.org/scripts/562975-youtube-speed-mbps
// @version      2.0.0
// @description  Display real-time connection speed (MB/s) in the YouTube player UI, with a hidden hyperspace jump effect easter egg triggered at ultra-high speeds.
// @description:zh-CN  在 YouTube 播放器界面显示实时连接速度 (MB/s)，超高速时触发超空间跳跃特效隐藏彩蛋。
// @description:zh-TW  在 YouTube 播放器介面顯示即時連線速度 (MB/s)，超高速時觸發超空間跳躍特效隱藏彩蛋。
// @author       nodeseek
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @supportURL   https://greasyfork.org/scripts/562975/feedback
// @homepageURL  https://greasyfork.org/scripts/562975
// @copyright    2025,kankankankankankan(https://github.com/kankankankankankan/youtube-speed)
// @downloadURL https://update.greasyfork.org/scripts/562975/YouTube%20Speed%20Display%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/562975/YouTube%20Speed%20Display%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WIDGET_ID = "yt-speed-mbs-widget";
    const UPDATE_MS = 1000;
    const ROUTE_POLL_MS = 400;
    const DEBUG = new URL(location.href).searchParams.get("yt_speed_debug") === "1";

    const DEBOUNCE_MS = 2000;

    const THRESHOLDS = {
        CYBER: 40, 
        EXCELLENT: 10, 
        GOOD: 5, 
        FAIR: 2.5,
    };

    GM_addStyle(`
        #${WIDGET_ID} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 109%;
            font-weight: 600;
            line-height: 1;
            color: #e0e0e0;
            user-select: none;
            cursor: default;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
            box-sizing: border-box;
            height: 100%;
            padding: 0 10px;
            margin-left: 4px;
            min-width: 90px;
            text-align: center;
            background: transparent;
            transition: color 0.5s ease;
        }

        #${WIDGET_ID}.tier-cyber {
            color: #ffffff;
            background: radial-gradient(ellipse 70% 90% at center,
                rgba(0, 200, 255, 0.15) 0%,
                rgba(100, 150, 255, 0.06) 25%,
                transparent 45%
            );
            animation: 
                cyber-text-glow 0.5s ease-in-out infinite alternate,
                hyperspace-pulse 2s ease-in-out infinite,
                engine-shake 0.1s linear infinite;
        }

        @keyframes cyber-text-glow {
            0% {
                text-shadow: 
                    0 0 4px #00ffff,
                    0 0 8px #00ffff,
                    0 0 15px #00aaff;
                filter: hue-rotate(0deg);
            }
            100% {
                text-shadow: 
                    0 0 6px #00ffff,
                    0 0 12px #8888ff,
                    0 0 18px #aa66ff;
                filter: hue-rotate(25deg);
            }
        }

        @keyframes hyperspace-pulse {
            0%, 100% {
                background: radial-gradient(ellipse 70% 90% at center,
                    rgba(0, 200, 255, 0.12) 0%,
                    rgba(100, 150, 255, 0.05) 25%,
                    transparent 45%
                );
            }
            50% {
                background: radial-gradient(ellipse 80% 100% at center,
                    rgba(0, 220, 255, 0.2) 0%,
                    rgba(120, 130, 255, 0.08) 25%,
                    transparent 45%
                );
            }
        }

        @keyframes engine-shake {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-0.5px); }
            75% { transform: translateY(0.5px); }
        }


        #${WIDGET_ID}.tier-excellent {
            color: #98d9c2;
        }


        #${WIDGET_ID}.tier-good {
            color: #e0e0e0;
        }

 
        #${WIDGET_ID}.tier-fair {
            color: #d4b896;
        }

        #${WIDGET_ID}.tier-warning {
            color: #e0a8a8;
        }


        #${WIDGET_ID}.tier-excellent,
        #${WIDGET_ID}.tier-good,
        #${WIDGET_ID}.tier-fair,
        #${WIDGET_ID}.tier-warning {
            animation: none;
            text-shadow: none;
            background: transparent;
            filter: none;
            transform: none;
        }

        #${WIDGET_ID}.yt-speed-overlay {
            position: absolute;
            right: 12px;
            bottom: 60px;
            z-index: 999999;
            padding: 4px 12px;
            height: auto;
            margin-left: 0;
        }
    `);

    let lastText = "0.00 MB/s";
    let lastGoodAt = 0;
    let active = false;
    let lastRouteKey = "";

    let currentTier = "GOOD";
    let pendingTier = null;
    let pendingTierSince = 0;

    function log(...args) {
        if (DEBUG) console.log("[YT Speed MB/s]", ...args);
    }

    function $(sel, root = document) {
        try { return root.querySelector(sel); } catch { return null; }
    }

    function isTargetRoute() {
        const path = location.pathname || "";
        return (path === "/watch" || path.startsWith("/shorts"));
    }

    function playerRoot() {
        return document.getElementById("movie_player")
            || $("ytd-player #movie_player")
            || $("#movie_player");
    }

    function getTierFromSpeed(mbps) {
        if (mbps > THRESHOLDS.CYBER) return "CYBER";
        if (mbps > THRESHOLDS.EXCELLENT) return "EXCELLENT";
        if (mbps > THRESHOLDS.GOOD) return "GOOD";
        if (mbps > THRESHOLDS.FAIR) return "FAIR";
        return "WARNING";
    }

    function applyTier(widget, tier) {
        if (!widget) return;

        widget.classList.remove("tier-cyber", "tier-excellent", "tier-good", "tier-fair", "tier-warning");
        widget.classList.add(`tier-${tier.toLowerCase()}`);

        log(`Tier changed to: ${tier}`);
    }

    function updateTierWithDebounce(widget, mbps) {
        const targetTier = getTierFromSpeed(mbps);
        const now = Date.now();

        if (targetTier === currentTier) {
            pendingTier = null;
            pendingTierSince = 0;
            return;
        }

        if (targetTier !== pendingTier) {
            pendingTier = targetTier;
            pendingTierSince = now;
            log(`Pending tier change to ${targetTier}`);
            return;
        }

        if (now - pendingTierSince >= DEBOUNCE_MS) {
            currentTier = targetTier;
            pendingTier = null;
            pendingTierSince = 0;
            applyTier(widget, currentTier);
        }
    }

    function parseNumber(x) {
        if (x == null) return null;
        const s = String(x);
        const m = s.match(/(\d[\d,]*)(?:\.(\d+))?/);
        if (!m) return null;
        const cleaned = (m[1] + (m[2] ? "." + m[2] : "")).replace(/,/g, "");
        const num = Number.parseFloat(cleaned);
        return Number.isFinite(num) ? num : null;
    }

    function parseKbpsFromText(text) {
        if (!text) return null;
        const lines = String(text).split(/\r?\n/);
        const keyRe = /(Connection Speed|连接速度)/i;

        for (const line of lines) {
            if (!keyRe.test(line)) continue;
            const m1 = line.match(/(\d[\d,\.]*)\s*Kbps/i);
            if (m1) return parseNumber(m1[1]);
            const m2 = line.match(/(\d[\d,\.]*)/);
            if (m2) return parseNumber(m2[1]);
        }

        const m = String(text).match(/(?:Connection Speed|连接速度)\s*[:：]?\s*(\d[\d,\.]*)\s*Kbps/i);
        if (m) return parseNumber(m[1]);
        return null;
    }

    function readKbpsFromStatsObject(stats) {
        if (!stats || typeof stats !== "object") return null;

        const direct = [
            stats.bandwidth_kbps,
            stats.bandwidthKbps,
            stats.connection_speed_kbps,
            stats.connectionSpeedKbps,
            stats.connection_speed,
            stats.connectionSpeed,
            stats.bandwidth
        ];

        for (const c of direct) {
            const n = parseNumber(c);
            if (n != null) return n;
        }

        for (const [k, v] of Object.entries(stats)) {
            const key = String(k).toLowerCase();
            if (key.includes("bandwidth") && (key.includes("kbps") || key.includes("kb"))) {
                const n = parseNumber(v);
                if (n != null) return n;
            }
            if ((key.includes("connection") || key.includes("conn")) && key.includes("speed")) {
                const n = parseNumber(v);
                if (n != null) return n;
            }
            if (typeof v === "string" && (v.includes("Connection Speed") || v.includes("连接速度"))) {
                const n = parseKbpsFromText(v);
                if (n != null) return n;
            }
        }

        return null;
    }

    function readKbpsFromDomPanelIfPresent() {
        const panel =
            document.querySelector(".html5-video-info-panel")
            || document.querySelector(".html5-video-info-panel-content")
            || document.querySelector("[class*='video-info-panel']");

        if (!panel) return null;
        return parseKbpsFromText(panel.textContent || "");
    }

    function readBandwidthKbps() {
        const player = playerRoot();
        if (!player) return { kbps: null, reason: "no movie_player" };

        if (typeof player.getStatsForNerds === "function") {
            try {
                const stats0 = player.getStatsForNerds(0);
                if (typeof stats0 === "string") {
                    const n = parseKbpsFromText(stats0);
                    if (n != null) return { kbps: n, meta: "stats:string(0)" };
                } else {
                    const n = readKbpsFromStatsObject(stats0);
                    if (n != null) return { kbps: n, meta: "stats:object(0)" };
                }
            } catch {}

            try {
                const stats = player.getStatsForNerds();
                if (typeof stats === "string") {
                    const n = parseKbpsFromText(stats);
                    if (n != null) return { kbps: n, meta: "stats:string" };
                } else {
                    const n = readKbpsFromStatsObject(stats);
                    if (n != null) return { kbps: n, meta: "stats:object" };
                }
            } catch {}
        }

        if (typeof player.getDebugText === "function") {
            try {
                const t = player.getDebugText();
                const n = parseKbpsFromText(t);
                if (n != null) return { kbps: n, meta: "getDebugText" };
            } catch {}
        }

        const n3 = readKbpsFromDomPanelIfPresent();
        if (n3 != null) return { kbps: n3, meta: "dom:panel" };

        return { kbps: null, reason: "no bandwidth field found" };
    }

    function getRightControls() {
        return $(".ytp-right-controls");
    }

    function findMountPoint() {
        const right = getRightControls();
        if (right) return { el: right, mode: "controls" };

        const controls = $(".ytp-chrome-controls") || $(".ytp-chrome-bottom");
        if (controls) return { el: controls, mode: "controls-fallback" };

        const pr = playerRoot();
        if (pr) return { el: pr, mode: "overlay" };

        return null;
    }

    function createWidget(mode) {
        const el = document.createElement("div");
        el.id = WIDGET_ID;
        el.textContent = lastText;
        el.setAttribute("aria-label", "Connection speed (MB/s)");
        el.setAttribute("title", "Connection Speed");

        el.classList.add("tier-good");

        if (mode !== "controls" && mode !== "controls-fallback") {
            el.classList.add("yt-speed-overlay");
        }

        return el;
    }

    function moveToLeftmostInRightControls(widget) {
        const right = getRightControls();
        if (!right) return false;

        const first = right.firstElementChild;

        if (widget.parentElement === right) {
            if (first !== widget) {
                right.insertBefore(widget, first);
                return true;
            }
            return false;
        }

        right.insertBefore(widget, first);
        return true;
    }

    function ensureWidgetMounted() {
        if (!active) return null;

        let w = document.getElementById(WIDGET_ID);
        const mp = findMountPoint();
        if (!mp) return null;

        if (!w) {
            w = createWidget(mp.mode);
            mp.el.insertBefore(w, mp.el.firstElementChild || mp.el.firstChild);
            log("widget mounted in mode:", mp.mode);
        }

        const moved = moveToLeftmostInRightControls(w);
        if (moved) log("widget positioned as leftmost in right-controls");

        return w;
    }

    function removeWidget() {
        const w = document.getElementById(WIDGET_ID);
        if (w) w.remove();
    }

    function setText(text) {
        lastText = text;
        const w = document.getElementById(WIDGET_ID) || ensureWidgetMounted();
        if (w && w.textContent !== text) w.textContent = text;
    }

    function updateSpeed() {
        if (!active) return;

        const res = readBandwidthKbps();
        const kbps = typeof res.kbps === "number" ? res.kbps : null;

        if (kbps == null || !Number.isFinite(kbps) || kbps <= 0) {
            if (Date.now() - lastGoodAt < 10000) setText(lastText);
            else setText("N/A");
            if (DEBUG && res.reason) log("no kbps:", res.reason);
            return;
        }

        const mbps = kbps / 8 / 1024;
        const text = `${mbps.toFixed(2)} MB/s`;
        lastGoodAt = Date.now();
        setText(text);

        const w = document.getElementById(WIDGET_ID);
        if (w) {
            updateTierWithDebounce(w, mbps);
        }

        if (DEBUG && res.meta) log("kbps:", kbps, "mbps:", mbps.toFixed(2), "meta:", res.meta);
    }

    function onRouteChange() {
        active = isTargetRoute();
        lastGoodAt = 0;

        currentTier = "GOOD";
        pendingTier = null;
        pendingTierSince = 0;

        if (!active) {
            removeWidget();
            log("route not target, widget removed");
            return;
        }

        ensureWidgetMounted();
        log("route target, init");
    }

    setInterval(() => {
        const routeKey = (location.pathname || "") + "|" + (location.search || "");
        if (routeKey !== lastRouteKey) {
            lastRouteKey = routeKey;
            onRouteChange();
        }
    }, ROUTE_POLL_MS);

    setInterval(() => {
        if (!active) return;
        ensureWidgetMounted();
        updateSpeed();
    }, UPDATE_MS);

    lastRouteKey = (location.pathname || "") + "|" + (location.search || "");
    onRouteChange();

    log("YouTube Speed MB/s Enhanced v2.7.0 loaded");
})();