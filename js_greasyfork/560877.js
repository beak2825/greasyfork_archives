// ==UserScript==
// @name         Recording & St. Kobe Monitor (Text Only) 📅
// @namespace    personal.recording.monitor
// @version      5.2
// @description  Ultra-thin single-line monitor without the CD icon.
// @author       Gemini
// @match        https://*.popmundo.com/World/Popmundo.aspx/City
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560877/Recording%20%20St%20Kobe%20Monitor%20%28Text%20Only%29%20%F0%9F%93%85.user.js
// @updateURL https://update.greasyfork.org/scripts/560877/Recording%20%20St%20Kobe%20Monitor%20%28Text%20Only%29%20%F0%9F%93%85.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // --- CONFIGURATION ---
    const TARGET_DATE_STR = "13/01/2026";
    const HOLIDAY_NAME = "St Kobe's Day";

    let monitorBox, statusIndicator, statusText, lastCheckTime, holidayInfo;

    function parseDate(str) {
        const [d, m, y] = str.split('/').map(Number);
        return new Date(y, m - 1, d);
    }

    function getDaysLeft() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = parseDate(TARGET_DATE_STR);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // --- UI SETUP ---
    function createMonitor() {
        if (document.getElementById('recording-monitor')) return;
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

            #recording-monitor {
                position: fixed; bottom: 20px; right: 20px;
                height: 28px; min-width: 150px;
                background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px;
                padding: 0 12px; font-family: 'Inter', sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 99999;
                display: flex; align-items: center; justify-content: flex-start;
                box-sizing: border-box; gap: 10px;
            }

            .indicator { width: 6px; height: 6px; border-radius: 50%; background: #bdbdbd; flex-shrink: 0; }
            .status-label { font-size: 11px; font-weight: 700; color: #333; white-space: nowrap; line-height: 1; letter-spacing: 0.3px; }
            .holiday-upcoming { font-size: 11px; color: #ff3636e8; font-weight: 700; display: none; line-height: 1; border-left: 1px solid #eee; padding-left: 10px; }
            .last-check { font-size: 9px; color: #bbb; margin-left: auto; line-height: 1; font-variant-numeric: tabular-nums; padding-left: 10px; }

            @keyframes pulseIndicator { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }

            .state-target { background: #ff1744 !important; animation: pulseIndicator 0.8s infinite; }
            .state-holiday { background: #2979ff !important; animation: pulseIndicator 1.2s infinite; }
            .state-waiting { background: #00c853 !important; }
        `;
        document.head.appendChild(style);

        monitorBox = document.createElement('div');
        monitorBox.id = 'recording-monitor';
        monitorBox.innerHTML = `
            <div id="status-indicator" class="indicator"></div>
            <div id="status-text" class="status-label">--</div>
            <div id="holiday-info" class="holiday-upcoming">🧾 ST. KOBE!</div>
            <div id="last-check" class="last-check">--:--:--</div>
        `;
        document.body.appendChild(monitorBox);

        statusIndicator = document.getElementById('status-indicator');
        statusText = document.getElementById('status-text');
        lastCheckTime = document.getElementById('last-check');
        holidayInfo = document.getElementById('holiday-info');
    }

    function checkCalendar() {
        const allRows = document.querySelectorAll('tr[id*="ucCityCalendar_repCalendar"]');
        const selectedRow = document.querySelector('tr.selected');
        let stKobeFoundInList = false;

        allRows.forEach(row => {
            if (row.innerText.includes(HOLIDAY_NAME)) stKobeFoundInList = true;
        });

        if (holidayInfo) holidayInfo.style.display = stKobeFoundInList ? 'block' : 'none';

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        if (lastCheckTime) lastCheckTime.textContent = timeStr;

        // If no row is explicitly selected, try to find today's row
        if (!selectedRow) {
            const todayFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            for (const row of allRows) {
                const dateCell = row.cells[1];
                // Extract only the DD/MM/YYYY part, ignoring the sortkey
                const visibleDateInRow = dateCell ? dateCell.innerText.trim().replace(/^\d+/, '') : "";
                if (visibleDateInRow.includes(todayFormatted)) {
                    selectedRow = row; // Treat today's row as if it were selected
                    break;
                }
            }
        }

        if (selectedRow) {
            const dateCell = selectedRow.cells[1];
            // Extract only the DD/MM/YYYY part, ignoring the sortkey
            const visibleDate = dateCell ? dateCell.innerText.trim().replace(/^\d+/, '') : "";

            if (visibleDate === TARGET_DATE_STR) {
                statusText.textContent = "RECORD NOW";
                statusText.style.color = "#ff1744";
                statusIndicator.className = 'indicator state-target';
            }
            else if (selectedRow.innerText.includes(HOLIDAY_NAME)) {
                statusText.textContent = "ST. KOBE DAY";
                statusText.style.color = "#2979ff";
                statusIndicator.className = 'indicator state-holiday';
            }
            else {
                const daysLeft = getDaysLeft();
                const weekdayCell = selectedRow.cells[2];
                const weekdayText = weekdayCell ? weekdayCell.innerText : "";
                if (weekdayText.includes("Monday")) {
                    statusText.textContent = `${daysLeft}D REMAINING`;
                } else {
                    statusText.textContent = `${daysLeft}D REMAINING`;
                }
                statusText.style.color = "#00c853";
                statusIndicator.className = 'indicator state-waiting';
            }
        } else {
            statusText.textContent = "READY";
            statusText.style.color = "#333";
            statusIndicator.className = 'indicator';
        }
    }

    function init() {
        createMonitor();
        checkCalendar();
        const observer = new MutationObserver(() => checkCalendar());
        const table = document.getElementById('tablecalendar') || document.querySelector('table.commonTable');
        if (table) observer.observe(table, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    init();
})();