// ==UserScript==
// @name         YouTube Speed Display
// @name:zh-CN   YouTube 网速显示
// @name:zh-TW   YouTube 網速顯示
// @namespace    https://greasyfork.org/scripts/562975-youtube-speed-mbps
// @version      1.2.1
// @description  Display real-time connection speed (MB/s) in the YouTube player UI without opening Stats for nerds. Shows download speed directly in the player controls for easy monitoring.
// @description:zh-CN  在 YouTube 播放器界面直接显示实时连接速度 (MB/s)，无需打开"详细统计信息"。速度数值显示在播放器控制栏中，方便随时监控网络状态。
// @description:zh-TW  在 YouTube 播放器介面直接顯示即時連線速度 (MB/s)，無需開啟「詳細統計資訊」。速度數值顯示在播放器控制列中，方便隨時監控網路狀態。
// @author       nodeseek
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @supportURL   https://greasyfork.org/scripts/562975/feedback
// @homepageURL  https://greasyfork.org/scripts/562975
// @copyright    2025,kankankankankankan(https://github.com/kankankankankankan/youtube-speed)
// @supportURL   https://github.com/kankankankankankan/youtube-speed
// @homepageURL  https://github.com/kankankankankankan/youtube-speed


// @downloadURL https://update.greasyfork.org/scripts/562975/YouTube%20Speed%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/562975/YouTube%20Speed%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== Configuration ====================
    const WIDGET_ID = "yt-speed-mbs-widget";
    const UPDATE_MS = 1000;
    const ROUTE_POLL_MS = 400;
    const DEBUG = new URL(location.href).searchParams.get("yt_speed_debug") === "1";

    // ==================== State Variables ====================
    let lastText = "0.00 MB/s";
    let lastGoodAt = 0;
    let active = false;
    let lastRouteKey = "";

    // ==================== Utility Functions ====================
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

    // ==================== Speed Reading Functions ====================
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

    // ==================== Widget Functions ====================
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
        const el = document.createElement("span");
        el.id = WIDGET_ID;
        el.textContent = lastText;
        el.setAttribute("aria-label", "Connection speed (MB/s)");
        el.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            line-height: 1;
            color: #fff;
            user-select: none;
            pointer-events: none;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
            box-sizing: border-box;
            text-shadow: none;
        `;

        if (mode === "controls" || mode === "controls-fallback") {
            el.style.height = "100%";
            el.style.marginRight = "8px";
            el.style.padding = "0 4px";
        } else {
            el.style.position = "absolute";
            el.style.right = "12px";
            el.style.bottom = "54px";
            el.style.zIndex = "999999";
            el.style.padding = "0";
            el.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";
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

    // ==================== Speed Update Functions ====================
    function updateSpeed() {
        if (!active) return;

        const res = readBandwidthKbps();
        const kbps = typeof res.kbps === "number" ? res.kbps : null;

        if (kbps == null || !Number.isFinite(kbps) || kbps <= 0) {
            if (Date.now() - lastGoodAt < 10000) setText(lastText);
            else setText("N/A MB/s");
            if (DEBUG && res.reason) log("no kbps:", res.reason);
            return;
        }

        const mbps = kbps / 8 / 1024;
        const text = `${mbps.toFixed(2)} MB/s`;
        lastGoodAt = Date.now();
        setText(text);

        if (DEBUG && res.meta) log("kbps:", kbps, "meta:", res.meta);
    }

    // ==================== Route Handling ====================
    function onRouteChange() {
        active = isTargetRoute();
        lastGoodAt = 0;

        if (!active) {
            removeWidget();
            log("route not target, widget removed");
            return;
        }

        ensureWidgetMounted();
        log("route target, init");
    }

    // ==================== Main Initialization ====================
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

    log("YouTube Speed MB/s userscript loaded");
})();
