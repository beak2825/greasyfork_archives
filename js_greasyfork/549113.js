// ==UserScript==
// @name         Instagram Link Collector
// @namespace    https://www.instagram.com/
// @version      1.1.5
// @description  Collect Instagram post URLs during auto-scroll. Edge hover UI, idle-stop, clipboard copy, .txt export.
// @author       Gemini 3 Pro (previously ChatGPT 5.2 Thinking)
// @icon         https://web.archive.org/web/20171228000551im_/https://www.instagram.com/static/images/ico/favicon.ico/dfa85bb1fd63.ico
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549113/Instagram%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/549113/Instagram%20Link%20Collector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var collected = new Set();
    var intervalId = null;
    var countdownInterval = null;
    var lastHeight = 0;
    var idleCounter = 0;

    var DEFAULT_IDLE_SECONDS = 33;

    var TAB_W = 18;
    var TAB_H = 44;
    var TAB_TEXT_PAD = TAB_W + 9;
    var PANEL_W = 340;

    var hideTimer = null;
    var isShown = false;
    var pinnedUntil = 0;

    function nowMs() { return Date.now(); }

    function pinBriefly(ms) {
        pinnedUntil = nowMs() + (ms || 2000);
        showPanel(true);
    }

    function shouldBlockHide() {
        return nowMs() <= pinnedUntil || intervalId !== null || countdownInterval !== null;
    }

    function normalizeUrl(u) {
        if (!u) return "";
        return u.split("?")[0].split("#")[0].replace(/\/+$/, "");
    }

    function updateOutput() {
        var list = Array.from(collected).sort();
        output.value = list.join("\n");
        counter.textContent = list.length + " links";
        if (!intervalId && status.textContent === "Scrolling...") status.textContent = "Idle";
        if (intervalId && status.textContent !== "Scrolling...") status.textContent = "Scrolling...";
    }

    function isLoaderVisible() {
        return !!document.querySelector('svg[aria-label="Loading..."]');
    }

    function collectLinks() {
        var links = document.querySelectorAll('a[href*="/p/"]');
        var initial = collected.size;

        for (var i = 0; i < links.length; i++) {
            var href = links[i].href;
            if (!href) continue;
            collected.add(normalizeUrl(href));
        }

        if (collected.size !== initial) {
            updateOutput();
            return true;
        }
        return false;
    }

    function stopScroll(reason) {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        status.textContent = reason || "Stopped";
        updateOutput();
    }

    function autoSave() {
        var urls = Array.from(collected);
        if (!urls.length) return;

        var username = "instagram";
        var pathMatch = window.location.pathname.match(/^\/([a-zA-Z0-9_.]+)/);
        if (pathMatch && pathMatch[1]) {
            var bad = ["p", "explore", "direct", "reels", "stories", "accounts"];
            if (bad.indexOf(pathMatch[1]) === -1) username = pathMatch[1];
        }

        var d = new Date();
        var yyyy = d.getFullYear();
        var mm = String(d.getMonth() + 1).padStart(2, "0");
        var dd = String(d.getDate()).padStart(2, "0");
        var dateStr = yyyy + "-" + mm + "-" + dd;

        var filename = username + "_instagram-urls_" + dateStr + ".txt";

        var blob = new Blob([urls.join("\n")], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function autoScrollTick() {
        var currentHeight = document.body.scrollHeight;
        window.scrollBy(0, window.innerHeight);

        var newLinksFound = collectLinks();
        var idleThresholdTicks = Math.max(1, Math.floor(parseInt(idleInput.value, 10) / 2));

        if (newLinksFound || currentHeight > lastHeight || isLoaderVisible()) {
            idleCounter = 0;
            lastHeight = currentHeight;
        } else {
            idleCounter++;
        }

        if (idleCounter >= idleThresholdTicks) {
            stopScroll("Auto-stopped (idle)");
            autoSave();
        }
    }

    function startScroll() {
        if (intervalId || countdownInterval) return;

        var countdown = 3;
        status.textContent = "Starting in " + countdown + "...";
        pinBriefly(3000);

        countdownInterval = setInterval(function () {
            countdown--;
            if (countdown > 0) {
                status.textContent = "Starting in " + countdown + "...";
            } else {
                clearInterval(countdownInterval);
                countdownInterval = null;

                lastHeight = document.body.scrollHeight;
                idleCounter = 0;
                intervalId = setInterval(autoScrollTick, 2000);
                status.textContent = "Scrolling...";
                collectLinks();
                updateOutput();
            }
        }, 1000);
    }

    function copyAll() {
        GM_setClipboard(output.value || "");
        status.textContent = "Copied";
        setTimeout(function () { status.textContent = intervalId ? "Scrolling..." : "Idle"; }, 900);
    }

    function downloadTxt() {
        autoSave();
        status.textContent = "Downloaded";
        setTimeout(function () { status.textContent = intervalId ? "Scrolling..." : "Idle"; }, 900);
    }

    function clearAll() {
        collected.clear();
        updateOutput();
        status.textContent = "Cleared";
        setTimeout(function () { status.textContent = intervalId ? "Scrolling..." : "Idle"; }, 900);
    }

    GM_addStyle(
        '#ig_hover_tab{' +
        'position:fixed;left:0;top:50%;width:' + TAB_W + 'px;height:' + TAB_H + 'px;margin-top:-' + Math.floor(TAB_H / 2) + 'px;' +
        'z-index:100000;cursor:pointer;opacity:0.7;background-color:#bdc5c8;' +
        'border:1px solid #abb0b3;border-left:none;border-radius:0 5px 5px 0;' +
        'display:flex;align-items:center;justify-content:center;' +
        '}' +
        '#ig_hover_tab:hover{opacity:1;}' +
        '#ig_hover_tab svg{display:block;}' +
        '#ig_panel{' +
        'position:fixed;left:0;top:50%;width:' + PANEL_W + 'px;z-index:99999;' +
        'transform:translateX(-100%);transition:transform 140ms linear,opacity 140ms linear;opacity:0.92;' +
        'background:rgba(0,0,0,0.75);color:#fff;padding:10px 10px 10px ' + TAB_TEXT_PAD + 'px;' +
        'border-radius:0 8px 8px 0;font-size:12px;box-shadow:0 2px 10px rgba(0,0,0,0.35);' +
        '}' +
        '#ig_panel.ig_show{transform:translateX(0);opacity:1;}' +
        '#ig_title{font-weight:700;margin:0 0 4px 0;}' +
        '#ig_row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0;}' +
        '#ig_status{opacity:0.9;font-size:11px;}' +
        '#ig_actions_row1{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;margin-bottom:6px;}' +
        '#ig_actions_row2{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;align-items:center;}' +
        '#ig_panel button{' +
        'padding:4px 10px;font-size:12px;cursor:pointer;background:rgba(255,255,255,0.08);color:#fff;' +
        'border:1px solid rgba(255,255,255,0.25);border-radius:999px;line-height:1.2;user-select:none;' +
        '}' +
        '#ig_panel button:hover{background:rgba(255,255,255,0.18);}' +
        '#ig_panel button:active{background:rgba(255,255,255,0.28);}' +
        // CHANGE: Added !important and solid colors to force visibility
        '#ig_start{border:1px solid #4CAF50 !important; box-shadow: 0 0 3px #4CAF50;}' +
        '#ig_stop{border:1px solid #F44336 !important; box-shadow: 0 0 3px #F44336;}' +
        '#ig_clear{border:1px solid #FFEB3B !important; box-shadow: 0 0 3px #FFEB3B; color: #fff;}' +
        '#ig_idle_wrap{display:flex;align-items:center;gap:6px;}' +
        '#ig_idle_wrap span{font-size:11px;opacity:0.9;}' +
        '#ig_idle{width:56px;font-size:12px;padding:2px 6px;border-radius:8px;border:1px solid rgba(255,255,255,0.25);background:rgba(0,0,0,0.35);color:#fff;}' +
        '#ig_output{width:100%;height:180px;margin-top:6px;font-size:11px;resize:vertical;}'
    );

    var tab = document.createElement("div");
    tab.id = "ig_hover_tab";
    tab.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">' +
        '<path id="ig_arrow_path" d="M4 2 L8 6 L4 10 Z" fill="#2b2f33"></path>' +
        '</svg>';
    document.body.appendChild(tab);

    var arrowPath = document.getElementById("ig_arrow_path");

    var panel = document.createElement("div");
    panel.id = "ig_panel";
    panel.innerHTML =
        '<div id="ig_header">' +
            '<div id="ig_title">Instagram Link Collector</div>' +
            '<div id="ig_row">' +
                '<div id="ig_counter">0 links</div>' +
                '<div id="ig_status">Idle</div>' +
            '</div>' +
        '</div>' +
        '<div id="ig_actions_row1">' +
            '<button id="ig_start" type="button">Start scroll</button>' +
            '<button id="ig_stop" type="button">Stop</button>' +
            '<button id="ig_copy" type="button">Copy</button>' +
            '<button id="ig_clear" type="button">Clear</button>' +
        '</div>' +
        '<div id="ig_actions_row2">' +
            '<button id="ig_txt" type="button">Download .txt</button>' +
            '<div id="ig_idle_wrap"><span>Idle (s)</span><input id="ig_idle" type="number" min="2" value="' + DEFAULT_IDLE_SECONDS + '"></div>' +
        '</div>' +
        '<textarea id="ig_output" readonly></textarea>';
    document.body.appendChild(panel);

    var headerWrap = document.getElementById("ig_header");
    var counter = document.getElementById("ig_counter");
    var status = document.getElementById("ig_status");
    var output = document.getElementById("ig_output");
    var idleInput = document.getElementById("ig_idle");

    function setArrow(open) {
        arrowPath.setAttribute("d", open ? "M8 2 L4 6 L8 10 Z" : "M4 2 L8 6 L4 10 Z");
    }

    function setPanelTopToTab() {
        var tabRect = tab.getBoundingClientRect();
        var headerH = headerWrap.getBoundingClientRect().height;
        var top = Math.round(tabRect.top - headerH - 6);
        panel.style.top = top + "px";
    }

    function showPanel(force) {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        setPanelTopToTab();
        if (isShown && !force) return;
        isShown = true;
        panel.classList.add("ig_show");
        setArrow(true);
    }

    function scheduleHide() {
        if (shouldBlockHide()) return;

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (shouldBlockHide()) return;
            isShown = false;
            panel.classList.remove("ig_show");
            setArrow(false);
        }, 140);
    }

    tab.addEventListener("mouseenter", function () { showPanel(false); });
    tab.addEventListener("mouseleave", scheduleHide);
    panel.addEventListener("mouseenter", function () { showPanel(true); });
    panel.addEventListener("mouseleave", scheduleHide);

    window.addEventListener("resize", function () {
        if (isShown) setPanelTopToTab();
    }, { passive: true });

    document.getElementById("ig_start").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        startScroll();
    });

    document.getElementById("ig_stop").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        stopScroll("Stopped");
    });

    document.getElementById("ig_copy").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        copyAll();
    });

    document.getElementById("ig_txt").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        downloadTxt();
    });

    document.getElementById("ig_clear").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        clearAll();
    });

    setArrow(false);
    collectLinks();
    updateOutput();
})();