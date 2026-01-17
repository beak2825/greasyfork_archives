// ==UserScript==
// @name          Microsoft To-Do Weekly Planner
// @namespace     http://tampermonkey.net/
// @version       2026-01-16.20
// @description   To-Do widget that generates report of "Planned" tasks sorted by date, then by list, then by title
// @author        Donnie Hires
// @match         *://to-do.office.com/*
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/562929/Microsoft%20To-Do%20Weekly%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/562929/Microsoft%20To-Do%20Weekly%20Planner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS for readability and specialized print formatting
    const style = document.createElement('style');
    style.innerHTML = `
        #roadmap-day-input::placeholder {
            color: #bbbbbb !important;
            opacity: 1 !important;
        }
        #roadmap-day-input::-webkit-input-placeholder { color: #bbbbbb !important; }
        #roadmap-day-input::-moz-placeholder { color: #bbbbbb !important; opacity: 1 !important; }

        @media print {
            body > *:not(#course-roadmap-overlay) {
                display: none !important;
            }
            #course-roadmap-overlay {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: auto !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
            }
            #close-report-btn, #print-report-btn {
                display: none !important;
            }
            h2 {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `;
    document.head.appendChild(style);

    function createButton() {
        const isPlannedTab = window.location.href.toLowerCase().includes('planned');
        let container = document.getElementById('roadmap-container');

        if (!isPlannedTab) {
            if (container) container.style.display = 'none';
            return;
        }

        if (container) {
            container.style.display = 'flex';
            return;
        }

        container = document.createElement('div');
        container.id = 'roadmap-container';
        container.style = `
            position: fixed; bottom: 20px; left: 20px; z-index: 9999999;
            display: flex; flex-direction: column; gap: 10px; background: #ffffff;
            padding: 16px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            border: 2px solid #0078d4; width: 200px; font-family: 'Segoe UI', sans-serif;
            cursor: move; user-select: none; align-items: center;
        `;

        const title = document.createElement('div');
        title.style = "font-size: 14px; font-weight: 800; color: #0078d4; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;";
        title.innerText = "Planning Widget";

        const dayInput = document.createElement('input');
        dayInput.type = 'text';
        dayInput.placeholder = '# of days';
        dayInput.id = 'roadmap-day-input';
        dayInput.style = `
            width: 100%; height: 40px; border: 2px solid #0078d4; border-radius: 6px;
            text-align: center; font-size: 14px; font-weight: bold; outline: none;
            cursor: text; box-sizing: border-box; background: white; color: black;
        `;
        dayInput.onmousedown = (e) => e.stopPropagation();

        const planBtn = document.createElement('button');
        planBtn.style = `
            width: 100%; height: 45px; background: #0078d4; color: white; border: none;
            border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 14px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        `;
        planBtn.innerHTML = 'Plan My Week 📅';

        planBtn.onclick = () => {
            const inputVal = document.getElementById('roadmap-day-input').value;
            const parsedDays = parseInt(inputVal);
            const now = new Date();
            now.setHours(0,0,0,0);

            if (isNaN(parsedDays)) {
                // FALLBACK: Until Saturday
                const dayOfWeek = now.getDay();
                let diff = 6 - dayOfWeek;
                if (diff < 0) diff = 6;

                // Calculate the Sunday before that Saturday
                const satDate = new Date(now);
                satDate.setDate(now.getDate() + diff);
                const sunDate = new Date(satDate);
                sunDate.setDate(satDate.getDate() - 6);

                const titleStr = `Week of ${sunDate.toLocaleDateString()} Report`;
                generateReport(diff, titleStr);
            } else {
                // CUSTOM: Range from today to last day
                const endDate = new Date(now);
                endDate.setDate(now.getDate() + parsedDays);
                const titleStr = `Custom Report: ${now.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                generateReport(parsedDays, titleStr);
            }
        };

        container.appendChild(title);
        container.appendChild(dayInput);
        container.appendChild(planBtn);
        document.body.appendChild(container);

        let active = false, initialX, initialY;
        container.onmousedown = (e) => {
            if (e.target === container || e.target === title) {
                active = true;
                initialX = e.clientX - container.offsetLeft;
                initialY = e.clientY - container.offsetTop;
            }
        };
        document.onmousemove = (e) => {
            if (active) {
                e.preventDefault();
                container.style.bottom = 'auto';
                container.style.left = (e.clientX - initialX) + "px";
                container.style.top = (e.clientY - initialY) + "px";
            }
        };
        document.onmouseup = () => { active = false; };
    }

    function parseDate(dateStr) {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const lower = dateStr.toLowerCase();
        if (lower.includes('today')) return new Date(now);
        if (lower.includes('tomorrow')) {
            const d = new Date(now); d.setDate(now.getDate() + 1); return d;
        }
        const clean = dateStr.replace(/^later,\s+/i, '');
        const parsed = Date.parse(clean + ", " + now.getFullYear());
        if (isNaN(parsed)) return null;
        const d = new Date(parsed); d.setHours(0, 0, 0, 0); return d;
    }

    function generateReport(limitDays, titleText) {
        const tasks = document.querySelectorAll('.taskItem');
        let reportData = {};
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + limitDays);
        endDate.setHours(23, 59, 59, 999);

        tasks.forEach(task => {
            const title = task.querySelector('.taskItem-title')?.innerText || "Unknown Task";
            const listEl = task.querySelector('.taskItemInfo-title');
            let category = listEl ? listEl.innerText.replace(/^in\s+/i, '').replace(/^\(GT\)\s+/i, '').trim() : "General";
            const dateEl = task.querySelector('.taskItemInfo-date');
            let dateStr = dateEl ? dateEl.innerText.trim() : "";

            if (dateStr) {
                const dateObj = parseDate(dateStr);
                if (dateObj && dateObj >= now && dateObj <= endDate) {
                    const fullDateKey = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                    if (!reportData[fullDateKey]) reportData[fullDateKey] = [];
                    reportData[fullDateKey].push({ title, category });
                }
            }
        });
        renderOverlay(reportData, titleText);
    }

    function renderOverlay(data, titleText) {
        const existing = document.getElementById('course-roadmap-overlay');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'course-roadmap-overlay';
        overlay.style = "position:fixed; top:30px; left:30px; right:30px; bottom:30px; background:white; z-index:99999999; padding:40px; border-radius:15px; border: 3px solid #0078d4; overflow-y:auto; color: black; font-family: 'Segoe UI', sans-serif; box-shadow: 0 15px 50px rgba(0,0,0,0.5);";

        const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
        let content = `
            <div style="float:right; display:flex; gap:12px;">
                <button id="print-report-btn" style="height:40px; width:120px; background:#0078d4; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;">Print 🖨️</button>
                <button id="close-report-btn" style="height:40px; width:120px; background:#f3f2f1; border:1px solid #ccc; border-radius:6px; cursor:pointer; font-weight:bold; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px;">Close ❌</button>
            </div>
            <h1 style="color:#0078d4; margin-top:0; font-size: 28px; border-bottom: 2px solid #eee; padding-bottom: 10px;">${titleText}</h1>`;

        sortedDates.forEach(dateKey => {
            content += `<div style="margin-top:30px;">
                        <h2 style="background:#0078d4; color:white; padding:12px; border-radius:6px; font-size:1.3em;">${dateKey}</h2>
                        <table style="width:100%; border-collapse: collapse; font-size: 16px;">`;

            const dayTasks = data[dateKey].sort((a, b) => {
                const catCompare = a.category.localeCompare(b.category);
                return catCompare !== 0 ? catCompare : a.title.localeCompare(b.title);
            });

            dayTasks.forEach(t => {
                content += `<tr style="border-bottom: 1px solid #eee;">
                            <td style="padding:12px; width:30px;"><input type="checkbox" style="width: 18px; height: 18px;"></td>
                            <td style="padding:12px; font-weight:bold; color:#0078d4; width:150px;">[${t.category}]</td>
                            <td style="padding:12px;">${t.title}</td>
                            </tr>`;
            });
            content += `</table></div>`;
        });

        overlay.innerHTML = content;
        document.body.appendChild(overlay);
        document.getElementById('close-report-btn').onclick = () => overlay.remove();
        document.getElementById('print-report-btn').onclick = () => window.print();
    }

    setInterval(createButton, 2000);
})();