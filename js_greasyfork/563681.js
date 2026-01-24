// ==UserScript==
// @name         GeoGuessr Playtime Tracker
// @namespace    Noahtrix
// @version      5.0
// @description  Tracks active GeoGuessr playtime and shows it on the profile page.
// @author       Noahtrix
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563681/GeoGuessr%20Playtime%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563681/GeoGuessr%20Playtime%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "gg_total_playtime_ms";
    const DAILY_KEY = "gg_daily_playtime_ms";
    const WEEKLY_KEY = "gg_weekly_playtime_ms";
    const LAST_RESET_KEY = "gg_last_daily_reset";
    const LAST_WEEK_RESET_KEY = "gg_last_week_reset";
    const INSTALL_DATE_KEY = "gg_install_date";
    const POS_KEY = "gg_playtime_pos";
    const DEFAULT_POS = { bottom: "20px", left: "20px" };
    const EDGE_SIZE = 12;

    const getFormattedDate = () => {
        return new Date().toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!localStorage.getItem(INSTALL_DATE_KEY)) {
        localStorage.setItem(INSTALL_DATE_KEY, getFormattedDate());
    }

    const getVal = (key) => Number(localStorage.getItem(key)) || 0;
    const getPos = () => JSON.parse(localStorage.getItem(POS_KEY)) || DEFAULT_POS;

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    function checkResets() {
        const now = new Date();
        const today = now.toLocaleDateString(undefined);
        const currentWeek = getWeekNumber(now) + "-" + now.getFullYear();

        if (localStorage.getItem(LAST_RESET_KEY) !== today) {
            localStorage.setItem(DAILY_KEY, "0");
            localStorage.setItem(LAST_RESET_KEY, today);
        }

        if (localStorage.getItem(LAST_WEEK_RESET_KEY) !== currentWeek) {
            localStorage.setItem(WEEKLY_KEY, "0");
            localStorage.setItem(LAST_WEEK_RESET_KEY, currentWeek);
        }
    }

    let isExpanded = false;
    let isMouseOnEdge = false;
    let isDragging = false;
    let tooltipRaf;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes ggFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        #gg-playtime-final { font-family: var(--font-family-neo-sans), "Neo Sans", sans-serif !important; user-select: none !important; transition: border-color 0.4s ease, outline-color 0.4s ease, box-shadow 0.4s ease !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; outline: 2px solid transparent !important; outline-offset: -2px !important; box-sizing: border-box !important; touch-action: none; }
        .gg-playtime-active { animation: ggFadeIn 0.3s ease-out forwards !important; }
        #gg-playtime-final.edge-hover, #gg-playtime-final.dragging { border-color: #ff4b4b !important; outline-color: #ff4b4b !important; cursor: move !important; box-shadow: 0 0 20px rgba(255, 75, 75, 0.4) !important; }
        .gg-detail-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); transform-origin: bottom; transform: scaleY(0.9); opacity: 0; }
        .gg-detail-wrapper.expanded { grid-template-rows: 1fr; opacity: 1; transform: scaleY(1); }
        .gg-detail-container { overflow: hidden; display: flex; flex-direction: column; position: relative; }
        .gg-inner-content { padding-bottom: 12px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        #gg-expand-btn { background: none !important; border: none !important; color: #ffc800 !important; cursor: pointer !important; padding: 4px !important; font-size: 14px !important; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important; }

        .gg-info-icon {
            background: transparent !important;
            color: #0095ff !important;
            border: 1.6px solid #0095ff !important;
            border-radius: 50% !important;
            width: 15px !important;
            height: 15px !important;
            font-size: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: "Consolas", "Monaco", "Courier New", monospace !important;
            font-weight: 900 !important;
            box-sizing: content-box !important;
            padding: 1px !important;
            overflow: visible !important;
        }

        #gg-portal-tooltip { position: fixed; background: white; color: black; padding: 6px 12px; border-radius: 8px; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transition: opacity 0.15s ease; pointer-events: none; z-index: 10000015; font-weight: 800; transform: translate(-50%, -100%); margin-top: -8px; }
        #gg-portal-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-width: 6px; border-style: solid; border-color: white transparent transparent transparent; }
        #gg-drag-hint { position: absolute; bottom: calc(100% + 15px); left: 50%; transform: translateX(-50%); background: rgba(34, 139, 34, 0.95); color: white; padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; white-space: nowrap; pointer-events: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: none; opacity: 0; transition: opacity 0.3s ease; z-index: 10000010; }

        .gg-stats-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items: center; }
        .gg-stat-label { font-size: 10px; color: #888; white-space: nowrap; }
        .gg-stat-value { font-size: 13px; white-space: nowrap; }
    `;
    document.head.appendChild(styleSheet);

    let tooltip = document.getElementById("gg-portal-tooltip") || document.createElement("div");
    if (!tooltip.id) { tooltip.id = "gg-portal-tooltip"; document.body.appendChild(tooltip); }

    const moveLabel = document.createElement("div");
    moveLabel.id = "gg-cursor-move-label";
    moveLabel.style.cssText = "position: fixed; z-index: 10000009; background: #ff4b4b; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; pointer-events: none; opacity: 0; transform: translate(15px, 15px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: opacity 0.25s ease-in-out;";
    moveLabel.innerText = "Move";
    document.body.appendChild(moveLabel);

    const formatTime = (ms) => {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
    };

    function resetMoveUI(el) {
        if (isDragging) return;
        isMouseOnEdge = false;
        el.classList.remove("edge-hover");
        moveLabel.style.opacity = "0";
    }

    function updateTooltipPosition(target) {
        if (tooltip.style.opacity === "1") {
            const rect = target.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2) + "px";
            tooltip.style.top = rect.top + "px";
            tooltipRaf = requestAnimationFrame(() => { updateTooltipPosition(target); });
        }
    }

    function makeDraggable(el) {
        let startX, startY, startBottom, startLeft;
        const hint = document.createElement("div");
        hint.id = "gg-drag-hint";
        hint.innerText = "Double Click = Position Reset";
        el.appendChild(hint);

        const infoIcon = el.querySelector(".gg-info-wrapper");
        infoIcon.onmouseenter = () => {
            tooltip.innerText = `Since ${localStorage.getItem(INSTALL_DATE_KEY)}`;
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
            updateTooltipPosition(infoIcon);
        };
        infoIcon.onmouseleave = () => {
            tooltip.style.opacity = "0";
            tooltip.style.visibility = "hidden";
            cancelAnimationFrame(tooltipRaf);
        };

        el.addEventListener('mousemove', (e) => {
            if (isDragging) return;
            const rect = el.getBoundingClientRect();
            const isInside = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
            if (!isInside || !isExpanded) { resetMoveUI(el); return; }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const onEdge = (x <= EDGE_SIZE || x >= rect.width - EDGE_SIZE || y <= EDGE_SIZE || y >= rect.height - EDGE_SIZE);
            if (onEdge) {
                isMouseOnEdge = true;
                el.classList.add("edge-hover");
                moveLabel.style.opacity = "1";
                moveLabel.style.left = e.clientX + "px";
                moveLabel.style.top = e.clientY + "px";
            } else { resetMoveUI(el); }
        });

        el.addEventListener('mouseleave', () => { if (!isDragging) resetMoveUI(el); });

        el.addEventListener('dblclick', (e) => {
            if (!isExpanded) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (x <= EDGE_SIZE || x >= rect.width - EDGE_SIZE || y <= EDGE_SIZE || y >= rect.height - EDGE_SIZE) {
                el.style.setProperty("transition", "bottom 0.5s cubic-bezier(0.19, 1, 0.22, 1), left 0.5s cubic-bezier(0.19, 1, 0.22, 1), border-color 0.4s ease", "important");
                el.style.bottom = DEFAULT_POS.bottom; el.style.left = DEFAULT_POS.left;
                localStorage.setItem(POS_KEY, JSON.stringify(DEFAULT_POS));
                resetMoveUI(el);
                hint.style.opacity = "0";
                setTimeout(() => {
                    el.style.setProperty("transition", "border-color 0.4s ease, outline-color 0.4s ease, box-shadow 0.4s ease", "important");
                    hint.style.display = "none";
                }, 550);
            }
        });

        el.addEventListener('mousedown', (e) => {
            if (!isExpanded || !isMouseOnEdge) return;
            if (e.target.closest('button') || e.target.closest('.gg-info-wrapper')) return;
            isDragging = true;
            let hasMoved = false;
            startX = e.clientX; startY = e.clientY;
            const rect = el.getBoundingClientRect();
            startBottom = window.innerHeight - rect.bottom; startLeft = rect.left;

            const onMouseMove = (me) => {
                if (!hasMoved) {
                    hasMoved = true;
                    el.style.setProperty("transition", "none", "important");
                    el.classList.add("dragging");
                    hint.style.display = "block";
                    requestAnimationFrame(() => { hint.style.opacity = "1"; });
                }
                const navHeight = 60;
                const friendListWidth = 70;
                const elWidth = el.offsetWidth;
                const elHeight = el.offsetHeight;
                let newLeft = startLeft + (me.clientX - startX);
                let newBottom = startBottom - (me.clientY - startY);
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - elWidth - friendListWidth));
                newBottom = Math.max(0, Math.min(newBottom, window.innerHeight - elHeight - navHeight));
                el.style.left = newLeft + "px";
                el.style.bottom = newBottom + "px";
                moveLabel.style.left = me.clientX + "px";
                moveLabel.style.top = me.clientY + "px";
            };

            const onMouseUp = () => {
                isDragging = false;
                el.classList.remove("dragging");
                hint.style.opacity = "0";
                setTimeout(() => { if (!isDragging) hint.style.display = "none"; }, 300);
                el.style.setProperty("transition", "border-color 0.4s ease, outline-color 0.4s ease, box-shadow 0.4s ease", "important");
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                localStorage.setItem(POS_KEY, JSON.stringify({ bottom: el.style.bottom, left: el.style.left }));
                const finalRect = el.getBoundingClientRect();
                const stillInside = (e.clientX >= finalRect.left && e.clientX <= finalRect.right && e.clientY >= finalRect.top && e.clientY <= finalRect.bottom);
                if (!stillInside) resetMoveUI(el);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function checkUI() {
        const isProfile = window.location.pathname.includes("/profile") && !document.querySelector('div[class*="home-layout"]');
        let el = document.getElementById("gg-playtime-final");
        if (!isProfile) { if (el) { el.remove(); tooltip.style.opacity = "0"; } return; }
        if (!el) {
            isExpanded = false;
            const savedPos = getPos();
            el = document.createElement("div");
            el.id = "gg-playtime-final";
            el.className = "gg-playtime-active";
            document.body.appendChild(el);
            el.style.cssText = `position: fixed !important; bottom: ${savedPos.bottom} !important; left: ${savedPos.left} !important; background: rgba(15, 15, 15, 0.95) !important; backdrop-filter: blur(12px) !important; color: white !important; padding: 12px 16px !important; border-radius: 12px !important; font-weight: 700 !important; z-index: 9999999 !important; display: flex !important; flex-direction: column-reverse !important; box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important; min-width: 175px !important;`;
            el.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; pointer-events: none;">
                    <div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">
                        <span style="color:#ffc800; text-shadow:0 0 8px rgba(255,200,0,0.6);">⏱</span>
                        <span id="gg-total-display" style="font-size: 13px;"></span>
                    </div>
                    <button id="gg-expand-btn" style="pointer-events: auto !important;">▼</button>
                </div>
                <div id="gg-grid-wrapper" class="gg-detail-wrapper">
                    <div class="gg-detail-container">
                        <div class="gg-inner-content">
                            <div class="gg-info-wrapper" style="position: absolute; right: 2px; top: 0px; pointer-events: auto !important;">
                                <div class="gg-info-icon">i</div>
                            </div>
                            <div class="gg-stats-grid">
                                <div class="gg-stat-label">TODAY:</div>
                                <div id="gg-daily-val" class="gg-stat-value"></div>
                                <div class="gg-stat-label">WEEK:</div>
                                <div id="gg-weekly-val" class="gg-stat-value"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            makeDraggable(el);
            el.querySelector("#gg-expand-btn").onclick = (e) => {
                isExpanded = !isExpanded;
                document.getElementById("gg-grid-wrapper").classList.toggle("expanded", isExpanded);
                e.target.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
                if (!isExpanded) resetMoveUI(el);
            };
        }
        const totalDisp = document.getElementById("gg-total-display");
        const dailyVal = document.getElementById("gg-daily-val");
        const weeklyVal = document.getElementById("gg-weekly-val");
        if (totalDisp) totalDisp.innerText = "Playtime: " + formatTime(getVal(STORAGE_KEY));
        if (dailyVal) dailyVal.innerText = formatTime(getVal(DAILY_KEY));
        if (weeklyVal) weeklyVal.innerText = formatTime(getVal(WEEKLY_KEY));
    }

    setInterval(() => {
        if (document.hasFocus() && !document.hidden) {
            checkResets();
            localStorage.setItem(STORAGE_KEY, String(getVal(STORAGE_KEY) + 1000));
            localStorage.setItem(DAILY_KEY, String(getVal(DAILY_KEY) + 1000));
            localStorage.setItem(WEEKLY_KEY, String(getVal(WEEKLY_KEY) + 1000));
        }
    }, 1000);

    setInterval(checkUI, 100);
})();