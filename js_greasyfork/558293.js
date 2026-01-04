// ==UserScript==
// @name        PieceOfGerman Progress
// @namespace   Violentmonkey Scripts
// @match       https://www.pieceofgerman.com/*
// @grant       none
// @version     14.1
// @author      Gemini
// @description Backup buttons moved to left sidebar. Heatmap centered.
// @downloadURL https://update.greasyfork.org/scripts/558293/PieceOfGerman%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/558293/PieceOfGerman%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cleanPath = window.location.pathname;
    const STORAGE_KEY_DAYS = 'pog_finished_days_' + cleanPath;
    const STORAGE_KEY_LAST_URL = 'pog_last_visited_url';
    const STORAGE_KEY_CALENDAR = 'pog_study_calendar';

    let hasNavigated = false;

    // --- 1. CSS STYLES ---
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Toast Feedback */
            @keyframes pogSlideIn { 0% { transform: translate(-50%, -50px); opacity: 0; } 60% { transform: translate(-50%, 10px); opacity: 1; } 100% { transform: translate(-50%, 0); opacity: 1; } }
            @keyframes pogSlideOut { 0% { transform: translate(-50%, 0); opacity: 1; } 100% { transform: translate(-50%, -50px); opacity: 0; } }
            .pog-toast { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); background: rgba(30, 30, 30, 0.85); backdrop-filter: blur(8px); color: white; padding: 12px 25px; border-radius: 50px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25); font-family: sans-serif; font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; z-index: 10001; animation: pogSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            .pog-toast.success { border-bottom: 2px solid #4CAF50; }
            .pog-toast.undo { border-bottom: 2px solid #9E9E9E; }
            .pog-toast.party { border-bottom: 2px solid #9C27B0; }

            /* DASHBOARD CONTAINER */
            #pog-dashboard {
                position: relative; /* Necessary for absolute positioning of children */
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                padding-bottom: 15px;
                width: 100%;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            /* STREAK & HEATMAP (CENTERED) */
            .pog-streak-counter {
                font-size: 18px; font-weight: bold; color: #555; margin-bottom: 8px;
                display: flex; align-items: center; gap: 8px;
            }
            .pog-streak-number { color: #FF9800; font-size: 22px; }

            .pog-heatmap-grid { display: flex; gap: 3px; margin-bottom: 12px; }
            .pog-day-sq { width: 12px; height: 12px; border-radius: 2px; background-color: #ebedf0; transition: transform 0.1s; }
            .pog-day-sq:hover { transform: scale(1.3); border: 1px solid #333; }

            .pog-lv-0 { background-color: #ebedf0; }
            .pog-lv-1 { background-color: #9be9a8; }
            .pog-lv-2 { background-color: #40c463; }
            .pog-lv-3 { background-color: #30a14e; }
            .pog-lv-4 { background-color: #216e39; }

            /* BACKUP BUTTONS (FAR LEFT & VERTICAL) */
            .pog-backup-controls {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%); /* Center vertically */
                display: flex;
                flex-direction: column; /* Stack vertically */
                gap: 8px;
                padding-left: 10px;
            }
            .pog-btn-mini {
                padding: 6px 10px;
                font-size: 11px;
                border: 1px solid #ccc;
                background: white;
                color: #555;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .pog-btn-mini:hover { background: #f0f0f0; border-color: #999; transform: translateX(2px); }
        `;
        document.head.appendChild(style);
    }
    injectStyles();

    // --- 2. BACKUP & RESTORE LOGIC ---
    function exportData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('pog_')) {
                data[key] = localStorage.getItem(key);
            }
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `pieceofgerman_backup_${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Backup Saved!", "success");
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    let count = 0;
                    for (const key in data) {
                        if (key.startsWith('pog_')) {
                            localStorage.setItem(key, data[key]);
                            count++;
                        }
                    }
                    showToast(`Restored ${count} items! Reloading...`, "success");
                    setTimeout(() => window.location.reload(), 1500);
                } catch (err) {
                    alert("Error reading file: " + err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // --- 3. DASHBOARD UI ---
    function getTodayStr() { return new Date().toISOString().split('T')[0]; }
    function getCalendarData() { const d = localStorage.getItem(STORAGE_KEY_CALENDAR); return d ? JSON.parse(d) : {}; }

    function updateCalendar(amount) {
        const data = getCalendarData();
        const today = getTodayStr();
        if (!data[today]) data[today] = 0;
        data[today] += amount;
        if (data[today] < 0) data[today] = 0;
        localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(data));
        renderDashboard();
    }

    function calculateStreak() {
        const data = getCalendarData();
        let streak = 0;
        let d = new Date();
        let dateStr = d.toISOString().split('T')[0];
        if (data[dateStr] > 0) streak++;
        while (true) {
            d.setDate(d.getDate() - 1);
            dateStr = d.toISOString().split('T')[0];
            if (data[dateStr] && data[dateStr] > 0) streak++;
            else break;
        }
        return streak;
    }

    function renderDashboard() {
        const headerContainer = document.querySelector('.theme-header > .zpcontainer');
        if (!headerContainer) return;

        let dash = document.getElementById('pog-dashboard');
        if (!dash) {
            dash = document.createElement('div');
            dash.id = 'pog-dashboard';
            headerContainer.appendChild(dash);
        } else {
            dash.innerHTML = '';
        }

        const streak = calculateStreak();
        const data = getCalendarData();

        // 1. Streak
        const streakDiv = document.createElement('div');
        streakDiv.className = 'pog-streak-counter';
        streakDiv.innerHTML = `<span>Current Streak:</span> <span class="pog-streak-number">🔥 ${streak}</span>`;
        dash.appendChild(streakDiv);

        // 2. Heatmap
        const grid = document.createElement('div');
        grid.className = 'pog-heatmap-grid';
        const daysToShow = 30;
        for (let i = daysToShow - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = data[dateStr] || 0;

            const sq = document.createElement('div');
            sq.className = 'pog-day-sq';
            sq.title = `${dateStr}: ${count} tasks`;

            if (count === 0) sq.classList.add('pog-lv-0');
            else if (count <= 2) sq.classList.add('pog-lv-1');
            else if (count <= 4) sq.classList.add('pog-lv-2');
            else if (count <= 6) sq.classList.add('pog-lv-3');
            else sq.classList.add('pog-lv-4');

            grid.appendChild(sq);
        }
        dash.appendChild(grid);

        // 3. Backup Controls (Moved to Left Sidebar)
        const controls = document.createElement('div');
        controls.className = 'pog-backup-controls';

        const btnExport = document.createElement('button');
        btnExport.className = 'pog-btn-mini';
        btnExport.innerText = '⬇ Backup';
        btnExport.onclick = exportData;

        const btnImport = document.createElement('button');
        btnImport.className = 'pog-btn-mini';
        btnImport.innerText = '⬆ Restore';
        btnImport.onclick = importData;

        controls.appendChild(btnExport);
        controls.appendChild(btnImport);
        dash.appendChild(controls);
    }

    // --- 4. STANDARD LOGIC ---
    function showToast(text, type='success') {
        const old = document.querySelector('.pog-toast');
        if (old) old.remove();
        const toast = document.createElement('div');
        toast.className = `pog-toast ${type}`;
        let icon = type === 'undo' ? '↩️' : (type === 'party' ? '🎉' : '✅');
        toast.innerHTML = `<span>${icon}</span> <span>${text}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'pogSlideOut 0.4s ease forwards';
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    function getFinishedDays() {
        const data = localStorage.getItem(STORAGE_KEY_DAYS);
        return data ? JSON.parse(data) : [];
    }

    function toggleDayFinished(dayName, isChecked) {
        let finished = getFinishedDays();
        if (isChecked) {
            if (!finished.includes(dayName)) {
                finished.push(dayName);
                updateCalendar(1);
            }
        } else {
            if (finished.includes(dayName)) {
                finished = finished.filter(d => d !== dayName);
                updateCalendar(-1);
            }
        }
        localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(finished));
    }

    function addResumeButton(hasDaysOnPage) {
        if (window.location.href.includes('?continue')) return;
        if (document.getElementById('pog-resume-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'pog-resume-btn';
        btn.innerText = '▶ Resume';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '25px', right: '25px', zIndex: '10000',
            padding: '14px 24px', backgroundColor: '#2196F3', color: 'white',
            border: 'none', borderRadius: '50px', boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
            cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', transition: 'transform 0.2s ease'
        });
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.addEventListener('click', () => {
            if (hasDaysOnPage) {
                const url = new URL(window.location.href);
                url.searchParams.set('continue', '1');
                window.location.href = url.toString();
            } else {
                const lastUrl = localStorage.getItem(STORAGE_KEY_LAST_URL);
                if (lastUrl) {
                    const target = new URL(lastUrl, window.location.origin);
                    target.searchParams.set('continue', '1');
                    window.location.href = target.toString();
                } else {
                    alert("No progress found yet! Please enter a course manually once.");
                }
            }
        });
        document.body.appendChild(btn);
    }

    function tryClickDay(targetDayString) {
        const allElements = document.querySelectorAll('div, span, li, button, a');
        for (let el of allElements) {
            if (el.innerText && el.innerText.trim() === targetDayString) {
                if (el.classList.contains('pog-tracker-container')) continue;
                const style = window.getComputedStyle(el);
                if (el.tagName === 'BUTTON' || el.tagName === 'A' || style.cursor === 'pointer') {
                    el.click(); return true;
                }
            }
        }
        return false;
    }

    function goToNextWeek() {
        const regex = /(\d+)$/;
        const match = window.location.pathname.match(regex);
        if (match) {
            const nextNum = parseInt(match[0], 10) + 1;
            const newPath = window.location.pathname.replace(regex, nextNum);
            showToast(`Week Complete! Jumping to Week ${nextNum}...`, 'party');
            setTimeout(() => {
                const newUrl = new URL(window.location.href);
                newUrl.pathname = newPath;
                newUrl.searchParams.set('continue', '1');
                window.location.href = newUrl.toString();
            }, 2000);
            return true;
        }
        return false;
    }

    // --- 5. MAIN LOOP ---
    function updateUI() {
        const finishedDays = getFinishedDays();
        renderDashboard();

        const allElements = document.querySelectorAll('*');
        let leafNodes = [];
        for (let el of allElements) {
             if (el.children.length === 0 && el.innerText && /^Day \d+$/.test(el.innerText.trim())) {
                 leafNodes.push(el);
             }
        }
        const hasDaysOnPage = leafNodes.length > 0;

        if (hasDaysOnPage) {
            if (localStorage.getItem(STORAGE_KEY_LAST_URL) !== window.location.pathname) {
                 localStorage.setItem(STORAGE_KEY_LAST_URL, window.location.pathname);
            }
        }

        addResumeButton(hasDaysOnPage);

        for (let leaf of leafNodes) {
            const dayName = leaf.innerText.trim();
            let container = leaf.closest('button') || leaf.closest('a') || leaf.closest('li') || leaf;
            if (container.getAttribute('data-pog-has-checkbox') === 'true') continue;

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = "pog-tracker-checkbox";
            cb.style.margin = '5px auto 0 auto'; cb.style.width = '16px'; cb.style.height = '16px';
            cb.style.accentColor = '#4CAF50'; cb.style.cursor = 'pointer';
            if (finishedDays.includes(dayName)) cb.checked = true;

            cb.onclick = (e) => {
                e.stopPropagation();
                toggleDayFinished(dayName, e.target.checked);
                if (e.target.checked) showToast(`${dayName} Completed`, 'success');
                else showToast(`${dayName} Unchecked`, 'undo');
            };

            if (window.getComputedStyle(container).display !== 'flex') {
                 container.style.display = 'flex'; container.style.flexDirection = 'column'; container.style.alignItems = 'center';
            } else { container.style.flexDirection = 'column'; }

            container.classList.add('pog-tracker-container');
            container.appendChild(cb);
            container.setAttribute('data-pog-has-checkbox', 'true');
            container.setAttribute('data-pog-dayname', dayName);
        }

        if (!hasNavigated && window.location.href.includes('?continue')) {
            const processedContainers = document.querySelectorAll('[data-pog-dayname]');
            if (processedContainers.length > 0) {
                 let targetDay = null;
                 let allDone = true;
                 for (let btn of processedContainers) {
                     const name = btn.getAttribute('data-pog-dayname');
                     if (!finishedDays.includes(name)) {
                         targetDay = name;
                         allDone = false;
                         break;
                     }
                 }
                 if (targetDay) {
                     if (tryClickDay(targetDay)) {
                         showToast(`Resuming: ${targetDay}`, 'success');
                         hasNavigated = true;
                     }
                 } else if (allDone) {
                     if (goToNextWeek()) hasNavigated = true;
                 }
            }
        }
    }

    setInterval(updateUI, 1000);

})();