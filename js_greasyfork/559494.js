// ==UserScript==
// @name         Old Reddit Subreddit's Pages & Links Collector
// @namespace    https://old.reddit.com/
// @version      0.1.4
// @description  Collects nav links and i.redd.it links on old Reddit. Auto-downloads .txt when end is reached or idle is detected. Edge hover UI.
// @author       Gemini 3 Pro (previously ChatGPT 5.2 Thinking)
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @match        https://old.reddit.com/r/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559494/Old%20Reddit%20Subreddit%27s%20Pages%20%20Links%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/559494/Old%20Reddit%20Subreddit%27s%20Pages%20%20Links%20Collector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var LINKS_KEY = "ornc_links";
    var AUTO_KEY = "ornc_auto";
    var IDLE_KEY = "ornc_idle_s";
    var LAST_SUB_KEY = "ornc_last_subreddit"; // Uusi avain subredditin seurantaan

    var DEFAULT_IDLE_SECONDS = 10;

    var TAB_W = 18;
    var TAB_H = 44;
    var TAB_TEXT_PAD = TAB_W + 9;
    var PANEL_W = 340;

    var collectedPanel = null;
    var countLabel = null;
    var statusLabel = null;
    var autoBtn = null;
    var idleInput = null;

    var hideTimer = null;
    var isShown = false;
    var pinnedUntil = 0;

    function nowMs() { return Date.now(); }

    function pinBriefly(ms) {
        pinnedUntil = nowMs() + (ms || 1500);
        showPanel(true);
    }

    function shouldBlockHide() {
        return nowMs() <= pinnedUntil || GM_getValue(AUTO_KEY, false);
    }

    function getLinks() {
        var raw = GM_getValue(LINKS_KEY, "[]");
        try {
            var arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (e) {
            return [];
        }
    }

    function saveLinks(arr) {
        GM_setValue(LINKS_KEY, JSON.stringify(arr));
    }

    function add(kind, href) {
        if (!href) return;

        var arr = getLinks();
        var already = arr.some(function (item) {
            return item && typeof item === "object" && item.u === href;
        });
        if (!already) {
            arr.push({ k: kind, u: href });
            saveLinks(arr);
        }
    }

    function clearLinks() {
        saveLinks([]);
        updateCountLabel();
        setStatus("Cleared");
        setTimeout(function () { setStatus(GM_getValue(AUTO_KEY, false) ? "Auto: ON" : "Idle"); }, 900);
        sessionStorage.removeItem("ornc_no_new_pages");
        sessionStorage.removeItem("ornc_prev_total");
        sessionStorage.removeItem("ornc_prev_url");
        sessionStorage.removeItem("ornc_stuck");
    }

    // MUUTOS: Tarkistaa onko subreddit vaihtunut
    function checkSubredditChange() {
        var currentSub = getSubredditName();
        var lastSub = GM_getValue(LAST_SUB_KEY, "");

        if (currentSub !== lastSub) {
            // Jos eri subreddit, tyhjennetään lista automaattisesti
            console.log("Subreddit changed from " + lastSub + " to " + currentSub + ". Clearing list.");
            clearLinks();
            GM_setValue(LAST_SUB_KEY, currentSub);
            // Nollataan myös auto-tila varmuuden vuoksi, ettei se lähde väärässä paikassa päälle
            GM_setValue(AUTO_KEY, false);
            updateAutoBtnText(false);
        }
    }

    function collectNavLinks() {
        var p = document.querySelector(".nav-buttons .prev-button a");
        var n = document.querySelector(".nav-buttons .next-button a");

        if (p) add("prev", p.href);
        if (n) add("next", n.href);

        if (!p && n && /[?&]count=25(?:&|$)/.test(n.href)) {
            add("page", location.href.split("#")[0]);
        }
    }

    function collectImageLinks() {
        var anchors = document.querySelectorAll('a[href^="https://i.redd.it/"]');
        for (var i = 0; i < anchors.length; i++) {
            add("img", anchors[i].href);
        }
    }

    function collectAll() {
        collectNavLinks();
        collectImageLinks();
        updateCountLabel();
    }

    function setStatus(t) {
        if (statusLabel) statusLabel.textContent = t;
    }

    function updateCountLabel() {
        if (!countLabel) return;

        var arr = getLinks();
        var total = arr.length;
        var pageCount = 0;
        var prevCount = 0;
        var nextCount = 0;
        var imgCount = 0;

        for (var i = 0; i < arr.length; i++) {
            var it = arr[i];
            if (!it) continue;
            if (it.k === "page") pageCount++;
            else if (it.k === "prev") prevCount++;
            else if (it.k === "next") nextCount++;
            else if (it.k === "img") imgCount++;
        }

        countLabel.textContent =
            "Links: " + total +
            " (page: " + pageCount +
            ", prev: " + prevCount +
            ", next: " + nextCount +
            ", img: " + imgCount + ")";
    }

    function getSubredditName() {
        var m = location.pathname.match(/^\/r\/([^\/]+)/);
        return (m && m[1]) ? m[1] : "unknown";
    }

    function getFormattedDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return year + "-" + month + "-" + day;
    }

    function downloadTXT(reasonLabel) {
        pinBriefly(2500);

        var arr = getLinks();
        var lines = [];
        for (var i = 0; i < arr.length; i++) lines.push(arr[i].u);

        var blob = new Blob([lines.join("\n")], { type: "text/plain" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = "r_" + getSubredditName() + "_" + getFormattedDate() + ".txt";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        setStatus(reasonLabel || "Downloaded");
        setTimeout(function () { setStatus(GM_getValue(AUTO_KEY, false) ? "Auto: ON" : "Idle"); }, 900);
    }

    function getIdleSeconds() {
        var v = parseInt(idleInput ? idleInput.value : GM_getValue(IDLE_KEY, DEFAULT_IDLE_SECONDS), 10);
        if (!isFinite(v) || v < 2) v = DEFAULT_IDLE_SECONDS;
        return v;
    }

    function updateAutoBtnText(isOn) {
        if (autoBtn) {
            autoBtn.textContent = isOn ? "Stop" : "Start";
            if (isOn) {
                autoBtn.style.border = "1px solid #F44336";
                autoBtn.style.boxShadow = "0 0 3px #F44336";
            } else {
                autoBtn.style.border = "1px solid #4CAF50";
                autoBtn.style.boxShadow = "0 0 3px #4CAF50";
            }
        }
    }

    function stopAuto(reason, autoDownload) {
        GM_setValue(AUTO_KEY, false);
        updateAutoBtnText(false);
        setStatus(reason);
        if (autoDownload) downloadTXT("Auto-downloaded");
    }

    function autoTick() {
        if (!GM_getValue(AUTO_KEY, false)) return;

        collectAll();

        var total = getLinks().length;

        var prevTotal = parseInt(sessionStorage.getItem("ornc_prev_total") || "0", 10);
        var noNewPages = parseInt(sessionStorage.getItem("ornc_no_new_pages") || "0", 10);
        if (!isFinite(prevTotal)) prevTotal = 0;
        if (!isFinite(noNewPages)) noNewPages = 0;

        if (total <= prevTotal) noNewPages++;
        else noNewPages = 0;

        sessionStorage.setItem("ornc_prev_total", String(total));
        sessionStorage.setItem("ornc_no_new_pages", String(noNewPages));

        var prevUrl = sessionStorage.getItem("ornc_prev_url") || "";
        var stuck = parseInt(sessionStorage.getItem("ornc_stuck") || "0", 10);
        if (!isFinite(stuck)) stuck = 0;

        if (prevUrl === location.href) stuck++;
        else stuck = 0;

        sessionStorage.setItem("ornc_prev_url", location.href);
        sessionStorage.setItem("ornc_stuck", String(stuck));

        var idleSeconds = getIdleSeconds();
        var idlePagesLimit = Math.max(2, Math.round(idleSeconds / 2));

        var nextA = document.querySelector(".nav-buttons .next-button a");
        if (!nextA) {
            stopAuto("Auto-stopped (end)", true);
            return;
        }

        if (stuck >= 2 || noNewPages >= idlePagesLimit) {
            stopAuto("Auto-stopped (idle)", true);
            return;
        }

        setStatus("Auto: ON");

        var delay = Math.max(900, Math.min(6000, idleSeconds * 300));
        setTimeout(function () {
            if (!GM_getValue(AUTO_KEY, false)) return;
            location.href = nextA.href;
        }, delay);
    }

    function addStyles() {
        GM_addStyle(
            '#ornc_hover_tab{' +
            'position:fixed;left:0;top:50%;width:' + TAB_W + 'px;height:' + TAB_H + 'px;margin-top:-' + Math.floor(TAB_H / 2) + 'px;' +
            'z-index:100000;cursor:pointer;opacity:0.7;background-color:#bdc5c8;' +
            'border:1px solid #abb0b3;border-left:none;border-radius:0 5px 5px 0;' +
            'display:flex;align-items:center;justify-content:center;' +
            '}' +
            '#ornc_hover_tab:hover{opacity:1;}' +
            '#ornc_hover_tab svg{display:block;}' +
            '#ornc_panel{' +
            'position:fixed;left:0;top:50%;width:' + PANEL_W + 'px;z-index:99999;' +
            'transform:translateX(-100%);transition:transform 140ms linear,opacity 140ms linear;opacity:0.92;' +
            'background:rgba(0,0,0,0.75);color:#fff;padding:10px 10px 10px ' + TAB_TEXT_PAD + 'px;' +
            'border-radius:0 8px 8px 0;font-size:12px;box-shadow:0 2px 10px rgba(0,0,0,0.35);' +
            '}' +
            '#ornc_panel.ornc_show{transform:translateX(0);opacity:1;}' +
            '#ornc_title{font-weight:700;margin:0 0 4px 0;}' +
            '#ornc_row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0;}' +
            '#ornc_status{opacity:0.9;font-size:11px;}' +
            '#ornc_actions_row1{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;margin-bottom:6px;}' +
            '#ornc_actions_row2{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;align-items:center;}' +
            '#ornc_panel button{' +
            'padding:4px 10px;font-size:12px;cursor:pointer;background:rgba(255,255,255,0.08);color:#fff;' +
            'border:1px solid rgba(255,255,255,0.25);border-radius:999px;line-height:1.2;user-select:none;' +
            '}' +
            '#ornc_panel button:hover{background:rgba(255,255,255,0.18);}' +
            '#ornc_panel button:active{background:rgba(255,255,255,0.28);}' +
            '#ornc_clear{border:1px solid #FFEB3B !important; box-shadow: 0 0 3px #FFEB3B; color: #fff;}' +
            '#ornc_idle_wrap{display:flex;align-items:center;gap:6px;}' +
            '#ornc_idle_wrap span{font-size:11px;opacity:0.9;}' +
            '#ornc_idle{width:56px;font-size:12px;padding:2px 6px;border-radius:8px;border:1px solid rgba(255,255,255,0.25);background:rgba(0,0,0,0.35);color:#fff;}'
        );
    }

    var tab = null;
    var arrowPath = null;
    var headerWrap = null;

    function setArrow(open) {
        arrowPath.setAttribute("d", open ? "M8 2 L4 6 L8 10 Z" : "M4 2 L8 6 L4 10 Z");
    }

    function setPanelTopToTab() {
        var tabRect = tab.getBoundingClientRect();
        var headerH = headerWrap.getBoundingClientRect().height;
        var top = Math.round(tabRect.top - headerH - 6);
        collectedPanel.style.top = top + "px";
    }

    function showPanel(force) {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        setPanelTopToTab();
        if (isShown && !force) return;
        isShown = true;
        collectedPanel.classList.add("ornc_show");
        setArrow(true);
    }

    function scheduleHide() {
        if (shouldBlockHide()) return;

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (shouldBlockHide()) return;
            isShown = false;
            collectedPanel.classList.remove("ornc_show");
            setArrow(false);
        }, 140);
    }

    function createPanel() {
        if (document.getElementById("ornc_panel")) return;

        addStyles();

        tab = document.createElement("div");
        tab.id = "ornc_hover_tab";
        tab.innerHTML =
            '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">' +
            '<path id="ornc_arrow_path" d="M4 2 L8 6 L4 10 Z" fill="#2b2f33"></path>' +
            '</svg>';
        document.body.appendChild(tab);
        arrowPath = document.getElementById("ornc_arrow_path");

        var idleDefault = GM_getValue(IDLE_KEY, DEFAULT_IDLE_SECONDS);

        collectedPanel = document.createElement("div");
        collectedPanel.id = "ornc_panel";
        collectedPanel.innerHTML =
            '<div id="ornc_header">' +
                '<div id="ornc_title">Old Reddit Nav Collector</div>' +
                '<div id="ornc_row">' +
                    '<div id="ornc_count">Links: 0</div>' +
                    '<div id="ornc_status">Idle</div>' +
                '</div>' +
            '</div>' +
            '<div id="ornc_actions_row1">' +
                '<button id="ornc_auto" type="button">Start</button>' +
                '<button id="ornc_dl" type="button">Download .txt</button>' +
                '<button id="ornc_clear" type="button">Clear</button>' +
            '</div>' +
            '<div id="ornc_actions_row2">' +
                '<div id="ornc_idle_wrap"><span>Idle (s)</span><input id="ornc_idle" type="number" min="2" value="' + idleDefault + '"></div>' +
            '</div>';
        document.body.appendChild(collectedPanel);

        headerWrap = document.getElementById("ornc_header");
        countLabel = document.getElementById("ornc_count");
        statusLabel = document.getElementById("ornc_status");
        autoBtn = document.getElementById("ornc_auto");
        idleInput = document.getElementById("ornc_idle");

        var autoState = GM_getValue(AUTO_KEY, false);
        updateAutoBtnText(autoState);
        setStatus(autoState ? "Auto: ON" : "Idle");

        idleInput.addEventListener("change", function () {
            var v = parseInt(idleInput.value, 10);
            if (!isFinite(v) || v < 2) v = DEFAULT_IDLE_SECONDS;
            idleInput.value = String(v);
            GM_setValue(IDLE_KEY, v);
            pinBriefly(1200);
        });

        document.getElementById("ornc_auto").addEventListener("click", function (e) {
            e.preventDefault();
            pinBriefly(2500);

            var newVal = !GM_getValue(AUTO_KEY, false);

            // Check if user manually clicked start/stop. If start, we assume they want to continue on this sub,
            // but if they switched subs, we'll clear first if needed (though checkSubredditChange handles most cases).
            // Actually, manual clear is safer if they want fresh start.

            GM_setValue(AUTO_KEY, newVal);
            updateAutoBtnText(newVal);
            setStatus(newVal ? "Auto: ON" : "Idle");

            if (newVal) {
                sessionStorage.setItem("ornc_prev_total", String(getLinks().length));
                sessionStorage.setItem("ornc_no_new_pages", "0");
                sessionStorage.setItem("ornc_prev_url", location.href);
                sessionStorage.setItem("ornc_stuck", "0");
                setTimeout(autoTick, 400);
            }
        });

        document.getElementById("ornc_dl").addEventListener("click", function (e) {
            e.preventDefault();
            downloadTXT("Downloaded");
        });

        document.getElementById("ornc_clear").addEventListener("click", function (e) {
            e.preventDefault();
            pinBriefly(2500);
            clearLinks();
        });

        tab.addEventListener("mouseenter", function () { showPanel(false); });
        tab.addEventListener("mouseleave", scheduleHide);
        collectedPanel.addEventListener("mouseenter", function () { showPanel(true); });
        collectedPanel.addEventListener("mouseleave", scheduleHide);

        window.addEventListener("resize", function () {
            if (isShown) setPanelTopToTab();
        }, { passive: true });

        setArrow(false);
        updateCountLabel();
    }

    // INIT:
    checkSubredditChange(); // Check if we switched subs
    collectAll();
    createPanel();

    if (GM_getValue(AUTO_KEY, false)) {
        setTimeout(autoTick, 500);
    }
})();