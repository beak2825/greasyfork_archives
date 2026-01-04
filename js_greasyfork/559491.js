// ==UserScript==
// @name         Facebook Photos Link Collector
// @namespace    https://www.facebook.com/
// @version      0.1.0
// @description  Auto-scroll Facebook photos, collect photo links, stop at photos section end or idle, auto-download .txt on auto-stop, edge hover UI
// @author       Gemini 3 Pro (previously ChatGPT 5.2 Thinking)
// @icon         https://static.xx.fbcdn.net/rsrc.php/y1/r/ay1hV6OlegS.ico
// @match        https://www.facebook.com/*/photos*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559491/Facebook%20Photos%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/559491/Facebook%20Photos%20Link%20Collector.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var collected = new Set();
    var intervalId = null;
    var countdownInterval = null;
    var lastHeight = 0;
    var idleCounter = 0;

    var DEFAULT_IDLE_SECONDS = 14;

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

    // CHANGE: Prevent hiding if pinned OR if script is actively running
    function shouldBlockHide() {
        return nowMs() <= pinnedUntil || intervalId !== null || countdownInterval !== null;
    }

    function normalizeUrl(u) {
        if (!u) return "";
        return u.split("#")[0].replace(/\/+$/, "");
    }

    function updateOutput() {
        var list = Array.from(collected).sort();
        output.value = list.join("\n");
        counter.textContent = list.length + " links";
        if (!intervalId && status.textContent === "Scrolling...") status.textContent = "Idle";
        if (intervalId && status.textContent !== "Scrolling...") status.textContent = "Scrolling...";
    }

    function isLoaderVisible() {
        if (document.querySelector('[aria-busy="true"]')) return true;
        if (document.querySelector('div[role="progressbar"]')) return true;
        return false;
    }

    function isInOrNearViewport(el) {
        if (!el) return false;
        var r = el.getBoundingClientRect();
        if (!r) return false;
        if (r.height <= 0 || r.width <= 0) return false;
        return r.top <= (window.innerHeight * 0.9);
    }

    function findPhotosSectionEndMarker() {
        var selectors = [
            "h2 a[href*='/followers']",
            "h2 a[href*='/music']",
            "h2 a[href*='/sports']",
            "h2 a[href*='/movies']",
            "h2 a[href*='/likes']",
            "h2 a[href*='/map']",
            "h2 a[href*='/check_ins']",
            "h2 a[href*='/check-ins']"
        ];

        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);
            if (el && isInOrNearViewport(el)) return el;
        }
        return null;
    }

    function hasLeftPhotosContext() {
        var p = location.pathname || "";
        if (p.indexOf("/photos") === -1) return true;
        return false;
    }

    function collectLinks() {
        var anchors = document.querySelectorAll("a[href*='/photos/'], a[href*='photo.php?fbid=']");
        var initial = collected.size;

        for (var i = 0; i < anchors.length; i++) {
            var href = anchors[i].href;
            if (!href) continue;

            href = normalizeUrl(href);

            if (href.indexOf("/photos/") !== -1) {
                var clean = href.split("?")[0];
                if (/\/photos\/.+\/\d+\/?$/.test(clean)) collected.add(clean.replace(/\/$/, ""));
            } else if (href.indexOf("photo.php?fbid=") !== -1) {
                collected.add(href);
            }
        }

        if (collected.size !== initial) {
            updateOutput();
            return true;
        }
        return false;
    }

    function buildFilename() {
        var username = "facebook";
        var path = window.location.pathname;
        var m = path.match(/^\/([^\/]+)/);
        if (m && m[1]) {
            var bad = ["photo.php", "profile.php", "groups", "watch", "pages"];
            if (bad.indexOf(m[1]) === -1) username = m[1];
        }

        var section = "photos";
        if (path.indexOf("/photos_by") !== -1) section = "photos_by";
        else if (path.indexOf("/photos_of") !== -1) section = "photos_of";
        else if (path.indexOf("/photos_albums") !== -1) section = "photos_albums";
        else if (path.indexOf("/photos") !== -1) section = "photos";

        var d = new Date();
        var yyyy = d.getFullYear();
        var mm = String(d.getMonth() + 1).padStart(2, "0");
        var dd = String(d.getDate()).padStart(2, "0");
        // Format: username_facebook-section_YYYY-MM-DD.txt
        return username + "_facebook-" + section + "_" + yyyy + "-" + mm + "-" + dd + ".txt";
    }

    function downloadTxtNow(reasonLabel) {
        var urls = Array.from(collected).sort();
        if (!urls.length) return;

        var blob = new Blob([urls.join("\n")], { type: "text/plain" });
        var url = URL.createObjectURL(blob);

        var a = document.createElement("a");
        a.href = url;
        a.download = buildFilename();
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        status.textContent = reasonLabel || "Downloaded";
        setTimeout(function () { status.textContent = intervalId ? "Scrolling..." : "Idle"; }, 900);
    }

    function stopScroll(reason, autoDownload) {
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

        if (autoDownload) {
            downloadTxtNow("Auto-downloaded");
        }
    }

    function autoScrollTick() {
        if (hasLeftPhotosContext()) {
            stopScroll("Auto-stopped (left photos)", true);
            return;
        }

        var endMarker = findPhotosSectionEndMarker();
        if (endMarker) {
            stopScroll("Auto-stopped (photos end)", true);
            return;
        }

        var currentHeight = document.body.scrollHeight;
        window.scrollBy(0, window.innerHeight);

        var newLinksFound = collectLinks();
        var idleSeconds = parseInt(idleInput.value, 10);
        if (!isFinite(idleSeconds) || idleSeconds < 2) idleSeconds = DEFAULT_IDLE_SECONDS;

        var idleThresholdTicks = Math.max(1, Math.floor(idleSeconds / 2));

        if (newLinksFound || currentHeight > lastHeight || isLoaderVisible()) {
            idleCounter = 0;
            lastHeight = currentHeight;
        } else {
            idleCounter++;
        }

        endMarker = findPhotosSectionEndMarker();
        if (endMarker) {
            stopScroll("Auto-stopped (photos end)", true);
            return;
        }

        if (idleCounter >= idleThresholdTicks) {
            stopScroll("Auto-stopped (idle)", true);
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

    function clearAll() {
        collected.clear();
        updateOutput();
        status.textContent = "Cleared";
        setTimeout(function () { status.textContent = intervalId ? "Scrolling..." : "Idle"; }, 900);
    }

    GM_addStyle(
        "#fb_hover_tab{" +
        "position:fixed;left:0;top:50%;width:" + TAB_W + "px;height:" + TAB_H + "px;margin-top:-" + Math.floor(TAB_H / 2) + "px;" +
        "z-index:100000;cursor:pointer;opacity:0.7;background-color:#bdc5c8;" +
        "border:1px solid #abb0b3;border-left:none;border-radius:0 5px 5px 0;" +
        "display:flex;align-items:center;justify-content:center;" +
        "}" +
        "#fb_hover_tab:hover{opacity:1;}" +
        "#fb_hover_tab svg{display:block;}" +
        "#fb_panel{" +
        "position:fixed;left:0;top:50%;width:" + PANEL_W + "px;z-index:99999;" +
        "transform:translateX(-100%);transition:transform 140ms linear,opacity 140ms linear;opacity:0.92;" +
        "background:rgba(0,0,0,0.75);color:#fff;padding:10px 10px 10px " + TAB_TEXT_PAD + "px;" +
        "border-radius:0 8px 8px 0;font-size:12px;box-shadow:0 2px 10px rgba(0,0,0,0.35);" +
        "}" +
        "#fb_panel.fb_show{transform:translateX(0);opacity:1;}" +
        "#fb_title{font-weight:700;margin:0 0 4px 0;}" +
        "#fb_row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0;}" +
        "#fb_status{opacity:0.9;font-size:11px;}" +
        "#fb_actions_row1{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;margin-bottom:6px;}" +
        "#fb_actions_row2{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;align-items:center;}" +
        "#fb_panel button{" +
        "padding:4px 10px;font-size:12px;cursor:pointer;background:rgba(255,255,255,0.08);color:#fff;" +
        "border:1px solid rgba(255,255,255,0.25);border-radius:999px;line-height:1.2;user-select:none;" +
        "}" +
        "#fb_panel button:hover{background:rgba(255,255,255,0.18);}" +
        "#fb_panel button:active{background:rgba(255,255,255,0.28);}" +
        // CHANGE: Added solid colors and !important
        "#fb_start{border:1px solid #4CAF50 !important; box-shadow: 0 0 3px #4CAF50;}" +
        "#fb_stop{border:1px solid #F44336 !important; box-shadow: 0 0 3px #F44336;}" +
        "#fb_clear{border:1px solid #FFEB3B !important; box-shadow: 0 0 3px #FFEB3B; color: #fff;}" +
        "#fb_idle_wrap{display:flex;align-items:center;gap:6px;}" +
        "#fb_idle_wrap span{font-size:11px;opacity:0.9;}" +
        "#fb_idle{width:56px;font-size:12px;padding:2px 6px;border-radius:8px;border:1px solid rgba(255,255,255,0.25);background:rgba(0,0,0,0.35);color:#fff;}" +
        "#fb_output{width:100%;height:180px;margin-top:6px;font-size:11px;resize:vertical;}"
    );

    var tab = document.createElement("div");
    tab.id = "fb_hover_tab";
    tab.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">' +
        '<path id="fb_arrow_path" d="M4 2 L8 6 L4 10 Z" fill="#2b2f33"></path>' +
        "</svg>";
    document.body.appendChild(tab);

    var arrowPath = document.getElementById("fb_arrow_path");

    var panel = document.createElement("div");
    panel.id = "fb_panel";
    panel.innerHTML =
        '<div id="fb_header">' +
            '<div id="fb_title">Facebook Photos Link Collector</div>' +
            '<div id="fb_row">' +
                '<div id="fb_counter">0 links</div>' +
                '<div id="fb_status">Idle</div>' +
            '</div>' +
        "</div>" +
        '<div id="fb_actions_row1">' +
            '<button id="fb_start" type="button">Start scroll</button>' +
            '<button id="fb_stop" type="button">Stop</button>' +
            '<button id="fb_copy" type="button">Copy</button>' +
            '<button id="fb_clear" type="button">Clear</button>' +
        "</div>" +
        '<div id="fb_actions_row2">' +
            '<button id="fb_txt" type="button">Download .txt</button>' +
            '<div id="fb_idle_wrap"><span>Idle (s)</span><input id="fb_idle" type="number" min="2" value="' + DEFAULT_IDLE_SECONDS + '"></div>' +
        "</div>" +
        '<textarea id="fb_output" readonly></textarea>';
    document.body.appendChild(panel);

    var headerWrap = document.getElementById("fb_header");
    var counter = document.getElementById("fb_counter");
    var status = document.getElementById("fb_status");
    var output = document.getElementById("fb_output");
    var idleInput = document.getElementById("fb_idle");

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
        panel.classList.add("fb_show");
        setArrow(true);
    }

    function scheduleHide() {
        if (shouldBlockHide()) return;

        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (shouldBlockHide()) return;
            isShown = false;
            panel.classList.remove("fb_show");
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

    document.getElementById("fb_start").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        startScroll();
    });

    document.getElementById("fb_stop").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        stopScroll("Stopped", false);
    });

    document.getElementById("fb_copy").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        copyAll();
    });

    document.getElementById("fb_txt").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        downloadTxtNow("Downloaded");
    });

    document.getElementById("fb_clear").addEventListener("click", function (e) {
        e.preventDefault();
        pinBriefly(3000);
        clearAll();
    });

    setArrow(false);
    collectLinks();
    updateOutput();
})();