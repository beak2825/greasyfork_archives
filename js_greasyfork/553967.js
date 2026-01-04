// ==UserScript==
// @name         Scratch Streak
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Adds a streak counter to Scratch!
// @author       alboxer2000
// @match        *://scratch.mit.edu/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553967/Scratch%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/553967/Scratch%20Streak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAIN_STREAK_KEY = 'scratch_main_streak';
    const MAIN_LAST_VISIT_KEY = 'scratch_main_last_visit';
    const MAIN_HISTORY_KEY = 'scratch_main_history'; 
    const FORUM_STREAK_KEY = 'scratch_forum_streak';
    const FORUM_LAST_VISIT_KEY = 'scratch_forum_last_visit';
    const FORUM_HISTORY_KEY = 'scratch_forum_history'; 
    const SECRET_PHRASE = 'modifystreakdata';

    let mainCalendarDate = new Date();
    let forumCalendarDate = new Date();
    let keyBuffer = '';

    function getTodayString() {
        return new Date().toISOString().split('T')[0]; 
    }

    function getYesterdayString() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    function updateStreak(streakKey, lastVisitKey, historyKey) {
        const today = getTodayString();
        const yesterday = getYesterdayString();

        let streak = parseInt(localStorage.getItem(streakKey) || '0', 10);
        let lastVisit = localStorage.getItem(lastVisitKey);
        let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

        if (lastVisit === today) {
            return { streak, history };
        }

        if (lastVisit === yesterday) {
            streak += 1; 
        } else {
            streak = 1; 
        }

        if (!history.includes(today)) {
            history.push(today);
        }

        localStorage.setItem(streakKey, streak.toString());
        localStorage.setItem(lastVisitKey, today);
        localStorage.setItem(historyKey, JSON.stringify(history));

        return { streak, history };
    }

    function getStreakDays(historyDates, year, month) {
        const monthHistory = historyDates
            .filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
            .map(d => parseInt(d.split('-')[2], 10))
            .sort((a, b) => a - b); 

        const today = getTodayString();
        const todayMonthString = `${year}-${String(month + 1).padStart(2, '0')}`;
        // const isCurrentMonth = today.startsWith(todayMonthString); // Not used

        let dayStatus = {};
        
        
        for (const day of monthHistory) {
            
            const isFollowed = monthHistory.includes(day + 1); 
            
            const isPreceded = monthHistory.includes(day - 1);
            
            if (isFollowed && isPreceded) {
                dayStatus[day] = 'streak-mid';
            } else if (isFollowed) {
                dayStatus[day] = 'streak-start';
            } else if (isPreceded) {
                dayStatus[day] = 'streak-end';
            } else {
                dayStatus[day] = 'streak-solo';
            }
        }

        return dayStatus;
    }

    function generateCalendarHTML(historyDates, dateToShow, calendarType) {
        const year = dateToShow.getFullYear();
        const month = dateToShow.getMonth();
        const monthName = dateToShow.toLocaleString('default', { month: 'long' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const dayStatus = getStreakDays(historyDates, year, month);

        const today = getTodayString();
        const todayDay = (today.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) ? new Date().getDate() : -1;
        
        const calendarTitle = calendarType === 'main' ? 'Scratch Visits' : 'Forum Visits';

        let calendarHTML = `
            <div class="calendar-header">
                <button class="nav-button prev-month" data-type="${calendarType}">&lt;</button>
                <span>${calendarTitle} - ${monthName} ${year}</span>
                <button class="nav-button next-month" data-type="${calendarType}">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        `;

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHTML += '<div></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const status = dayStatus[day] || '';
            const isToday = day === todayDay;
            let dayClass = status;

            if (isToday) {
                dayClass += ' today';
            }

            calendarHTML += `<div class="${dayClass}">${day}</div>`;
        }

        calendarHTML += '</div>';
        return calendarHTML;
    }

    function handleMonthChange(calendarType, direction) {
        let dateState;
        let history;
        let calendarElement;

        if (calendarType === 'main') {
            mainCalendarDate.setMonth(mainCalendarDate.getMonth() + direction);
            dateState = mainCalendarDate;
            history = JSON.parse(localStorage.getItem(MAIN_HISTORY_KEY) || '[]');
            calendarElement = mainCalendar;
        } else {
            forumCalendarDate.setMonth(forumCalendarDate.getMonth() + direction);
            dateState = forumCalendarDate;
            history = JSON.parse(localStorage.getItem(FORUM_HISTORY_KEY) || '[]');
            calendarElement = forumCalendar;
        }

        renderCalendar(calendarElement, history, dateState, calendarType);
    }
    
    function renderCalendar(calendarElement, history, dateState, calendarType) {
        calendarElement.innerHTML = generateCalendarHTML(history, dateState, calendarType);
        calendarElement.style.display = 'block';

        calendarElement.querySelector('.prev-month').addEventListener('click', () => {
            handleMonthChange(calendarType, -1);
        });
        calendarElement.querySelector('.next-month').addEventListener('click', () => {
            handleMonthChange(calendarType, 1);
        });
    }

    function updateStreakDisplay(mainStreak, forumStreak) {
        const mainButton = document.getElementById('main-streak-button');
        const forumButton = document.getElementById('forum-streak-button');

        if (mainButton) {
            mainButton.innerHTML = `Scratch Streak: <span style="color: #FFEA00; margin-left: 5px;">${mainStreak}</span> `;
        }
        if (forumButton) {
            forumButton.innerHTML = `Forum Streak: <span style="color: #FFEA00; margin-left: 5px;">${forumStreak}</span> `;
        }
    }

    function handleManualUpdate(mainInput, forumInput, mainHistoryInput, forumHistoryInput, modal) {
        const newMainStreak = parseInt(mainInput.value, 10);
        const newForumStreak = parseInt(forumInput.value, 10);
        const errorMessageElement = modal.querySelector('#error-message');

        errorMessageElement.textContent = ''; 

        let newMainHistory;
        let newForumHistory;
        let valid = true;

        try {
            newMainHistory = JSON.parse(mainHistoryInput.value);
            if (!Array.isArray(newMainHistory) || newMainHistory.some(d => typeof d !== 'string' || !d.match(/^\d{4}-\d{2}-\d{2}$/))) {
                throw new Error('Invalid main history format. Must be an array of YYYY-MM-DD strings.');
            }
        } catch (e) {
            errorMessageElement.textContent = 'Error in Scratch Date History: Must be a valid JSON array of YYYY-MM-DD date strings.';
            valid = false;
        }

        if (valid) {
            try {
                newForumHistory = JSON.parse(forumHistoryInput.value);
                if (!Array.isArray(newForumHistory) || newForumHistory.some(d => typeof d !== 'string' || !d.match(/^\d{4}-\d{2}-\d{2}$/))) {
                    throw new Error('Invalid forum history format. Must be an array of YYYY-MM-DD strings.');
                }
            } catch (e) {
                errorMessageElement.textContent = 'Error in Forum Date History: Must be a valid JSON array of YYYY-MM-DD date strings.';
                valid = false;
            }
        }

        if (valid && !isNaN(newMainStreak) && newMainStreak >= 0 && !isNaN(newForumStreak) && newForumStreak >= 0) {
            localStorage.setItem(MAIN_STREAK_KEY, newMainStreak.toString());
            localStorage.setItem(FORUM_STREAK_KEY, newForumStreak.toString());
            localStorage.setItem(MAIN_HISTORY_KEY, JSON.stringify(newMainHistory));
            localStorage.setItem(FORUM_HISTORY_KEY, JSON.stringify(newForumHistory));

            const today = getTodayString();
            localStorage.setItem(MAIN_LAST_VISIT_KEY, today);
            localStorage.setItem(FORUM_LAST_VISIT_KEY, today);
            
            updateStreakDisplay(newMainStreak, newForumStreak);
            modal.remove();
        } else if (valid) {
             errorMessageElement.textContent = 'Error: Please enter valid, non-negative numbers for both streak counts.';
        }
    }

    function showModifyStreakModal() {
        const modalId = 'streak-modifier-modal';
        if (document.getElementById(modalId)) return; 

        const currentMainStreak = parseInt(localStorage.getItem(MAIN_STREAK_KEY) || '0', 10);
        const currentForumStreak = parseInt(localStorage.getItem(FORUM_STREAK_KEY) || '0', 10);
        const currentMainHistory = localStorage.getItem(MAIN_HISTORY_KEY) || '[]';
        const currentForumHistory = localStorage.getItem(FORUM_HISTORY_KEY) || '[]';


        const modal = document.createElement('div');
        modal.id = modalId;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.8);
            width: 450px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: 'Inter', sans-serif;
            color: #333;
        `;
        
        content.innerHTML = `
            <h3 style="margin-top: 0; color: #6A0DAD; border-bottom: 2px solid #6A0DAD; padding-bottom: 10px; margin-bottom: 20px;">Manual Streak Editor</h3>
            
            <p style="font-size: 13px; margin-bottom: 20px; color: #555;">
                Use this tool to manually set the **streak count** and the **date history**.
                The date history must be a valid JSON array of "YYYY-MM-DD" strings.
            </p>

            <div style="margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                <h4 style="margin-top: 0; color: #6A0DAD;">Scratch Main Streak</h4>
                <div style="margin-bottom: 15px;">
                    <label for="main-streak-input" style="display: block; font-weight: 600; margin-bottom: 5px;">Streak Count (Days):</label>
                    <input id="main-streak-input" type="number" value="${currentMainStreak}" min="0" style="width: 95%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
                </div>
                <div>
                    <label for="main-history-input" style="display: block; font-weight: 600; margin-bottom: 5px;">Date History (JSON Array):</label>
                    <textarea id="main-history-input" rows="4" style="width: 95%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-family: monospace; font-size: 12px; resize: vertical;">${currentMainHistory}</textarea>
                </div>
            </div>

            <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                <h4 style="margin-top: 0; color: #6A0DAD;">Forum Streak</h4>
                <div style="margin-bottom: 15px;">
                    <label for="forum-streak-input" style="display: block; font-weight: 600; margin-bottom: 5px;">Streak Count (Days):</label>
                    <input id="forum-streak-input" type="number" value="${currentForumStreak}" min="0" style="width: 95%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
                </div>
                <div>
                    <label for="forum-history-input" style="display: block; font-weight: 600; margin-bottom: 5px;">Date History (JSON Array):</label>
                    <textarea id="forum-history-input" rows="4" style="width: 95%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-family: monospace; font-size: 12px; resize: vertical;">${currentForumHistory}</textarea>
                </div>
            </div>

            <p id="error-message" style="color: red; font-size: 13px; font-weight: 600; margin-top: -10px; margin-bottom: 15px; text-align: center;"></p>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancel-streak-update" style="padding: 10px 15px; background: #f4f4f4; border: 1px solid #ccc; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
                <button id="confirm-streak-update" style="padding: 10px 15px; background: #6A0DAD; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Update Streaks</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const mainInput = document.getElementById('main-streak-input');
        const forumInput = document.getElementById('forum-streak-input');
        const mainHistoryInput = document.getElementById('main-history-input');
        const forumHistoryInput = document.getElementById('forum-history-input');
        
        document.getElementById('cancel-streak-update').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('confirm-streak-update').addEventListener('click', () => {
            handleManualUpdate(mainInput, forumInput, mainHistoryInput, forumHistoryInput, modal);
        });
    }

    function handleKeyPress(event) {
        const key = event.key.toLowerCase();
        
        // Check if the keypress is happening inside an input field or textarea
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        if (key.length === 1 && key.match(/[a-z0-9]/i)) {
            keyBuffer += key;
        } else {
            keyBuffer = ''; 
        }

        if (keyBuffer.length > SECRET_PHRASE.length) {
            keyBuffer = keyBuffer.substring(keyBuffer.length - SECRET_PHRASE.length);
        }

        if (keyBuffer === SECRET_PHRASE) {
            showModifyStreakModal();
            keyBuffer = ''; 
        }
    }


    const currentPath = window.location.pathname;

    const scratchResult = updateStreak(MAIN_STREAK_KEY, MAIN_LAST_VISIT_KEY, MAIN_HISTORY_KEY);
    let scratchStreak = scratchResult.streak;
    let scratchHistory = scratchResult.history;

    let forumStreak = parseInt(localStorage.getItem(FORUM_STREAK_KEY) || '0', 10);
    const isOnForum = currentPath.startsWith('/discuss');
    let forumHistory = JSON.parse(localStorage.getItem(FORUM_HISTORY_KEY) || '[]');

    if (isOnForum) {
        const forumResult = updateStreak(FORUM_STREAK_KEY, FORUM_LAST_VISIT_KEY, FORUM_HISTORY_KEY);
        forumStreak = forumResult.streak;
        forumHistory = forumResult.history;
    }

    const containerWrapper = document.createElement('div');
    containerWrapper.id = 'scratch-streak-wrapper';
    containerWrapper.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 10000;
        font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    `;
    document.body.appendChild(containerWrapper);

    const streakContainer = document.createElement('div');
    streakContainer.id = 'scratch-streak-display';
    streakContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 10px 20px;
        background: #6A0DAD;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        font-size: 14px;
        font-weight: 600;
    `;
    containerWrapper.appendChild(streakContainer);

    const createStreakButton = (id, title, streak, emoji) => {
        const button = document.createElement('button');
        button.id = id;
        button.title = title;
        button.innerHTML = `${title}: <span style="color: #FFEA00; margin-left: 5px;">${streak}</span> ${emoji}`;
        button.style.cssText = `
            background: none;
            border: none;
            color: white;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: opacity 0.2s;
        `;
        button.onmouseover = () => button.style.opacity = '0.8';
        button.onmouseout = () => button.style.opacity = '1';
        return button;
    };

    const mainButton = createStreakButton(
        'main-streak-button',
        'Scratch Streak',
        scratchStreak,
        ''
    );

    const forumButton = createStreakButton(
        'forum-streak-button',
        'Forum Streak',
        forumStreak,
        ''
    );

    streakContainer.appendChild(mainButton);
    streakContainer.appendChild(forumButton);

    const calendarStyles = `
        position: absolute;
        top: 50px;
        right: 0;
        width: 300px;
        background: white;
        color: #333;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        padding: 15px;
        margin-top: 10px;
        display: none;
        text-align: center;
        z-index: 9999;
    `;

    const mainCalendar = document.createElement('div');
    mainCalendar.id = 'main-calendar';
    mainCalendar.style.cssText = calendarStyles;
    mainCalendar.style.left = 'unset'; 
    containerWrapper.appendChild(mainCalendar);

    const forumCalendar = document.createElement('div');
    forumCalendar.id = 'forum-calendar';
    forumCalendar.style.cssText = calendarStyles;
    forumCalendar.style.left = 'unset'; 
    containerWrapper.appendChild(forumCalendar);

    const style = document.createElement('style');
    style.textContent = `
        #scratch-streak-wrapper .calendar-header {
            font-weight: 700;
            font-size: 16px;
            margin-bottom: 10px;
            color: #6A0DAD;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #scratch-streak-wrapper .calendar-header span {
            flex-grow: 1;
            text-align: center;
        }
        #scratch-streak-wrapper .nav-button {
            background: none;
            border: none;
            color: #6A0DAD;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        #scratch-streak-wrapper .nav-button:hover {
            background-color: #f0f0f0;
        }
        #scratch-streak-wrapper .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0; /* Ensures bars connect fully */
            font-size: 12px;
        }
        #scratch-streak-wrapper .calendar-grid > div {
            padding: 5px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25px;
            position: relative;
            z-index: 1; 
            font-weight: 600;
            color: #333;
            box-sizing: border-box; 
        }
        /* Style for the day names (Su, Mo, etc.) */
        #scratch-streak-wrapper .calendar-grid > div:nth-child(-n+7) {
            font-weight: 600;
            color: #666;
            background: none; 
            border-radius: 0;
            padding: 5px; 
        }
        
        /* Streak general styling */
        #scratch-streak-wrapper .calendar-grid .streak-start,
        #scratch-streak-wrapper .calendar-grid .streak-mid,
        #scratch-streak-wrapper .calendar-grid .streak-end {
            background: #6A0DAD; 
            color: white; 
            z-index: 2;
            box-shadow: none !important; /* Ensure no general shadow interferes */
            outline: none !important; /* Ensure no general outline interferes */
        }
        
        /* Solo streak: transparent background, purple text and border */
        #scratch-streak-wrapper .calendar-grid .streak-solo {
            background: none; 
            border: 2px solid #6A0DAD; 
            border-radius: 50%;
            color: #6A0DAD; 
            z-index: 2;
            width: 25px; 
            height: 25px;
            margin: 0 auto; 
        }

        
        /* Streak start: rounded left edge, square right edge */
        #scratch-streak-wrapper .calendar-grid .streak-start {
            border-radius: 500px 0 0 500px; 
            margin: 0; 
        }

        
        /* Streak mid: fully square */
        #scratch-streak-wrapper .calendar-grid .streak-mid {
            border-radius: 0; 
            margin: 0; 
        }

        
        /* Streak end: square left edge, rounded right edge */
        #scratch-streak-wrapper .calendar-grid .streak-end {
            border-radius: 0 500px 500px 0; 
            margin: 0; 
        }

        
        /* TODAY HIGHLIGHTS */
        
        /* General styling for today (not strictly part of streak) */
        #scratch-streak-wrapper .calendar-grid .today {
            font-weight: 700; 
        }

        /* NEW FIX: Highlight today's date if it's streaked using an inset box-shadow for a clean border */
        #scratch-streak-wrapper .calendar-grid .today.streak-start,
        #scratch-streak-wrapper .calendar-grid .today.streak-mid,
        #scratch-streak-wrapper .calendar-grid .today.streak-end {
            /* This creates a 3px white 'border' effect inside the purple shape, eliminating outline artifacts */
            box-shadow: inset 0 0 0 3px white;
            z-index: 3; 
            color: white;
        }
        
        /* Today highlight for solo streak: use thicker border */
        #scratch-streak-wrapper .calendar-grid .today.streak-solo {
            border: 3px solid #6A0DAD; 
            z-index: 3; 
            color: #6A0DAD; 
        }

        
        /* Remove the generic square border for non-streaked today */
        #scratch-streak-wrapper .calendar-grid .today:not([class*="streak"]) {
            border: none;
            color: #6A0DAD; /* Highlight the number in purple */
        }
    `;
    document.head.appendChild(style);

    mainButton.addEventListener('click', () => {
        if (mainCalendar.style.display === 'none' || mainCalendar.style.display === '') {
            forumCalendar.style.display = 'none';
            // Re-read history just in case it was modified via the modal
            const currentHistory = JSON.parse(localStorage.getItem(MAIN_HISTORY_KEY) || '[]');
            renderCalendar(mainCalendar, currentHistory, mainCalendarDate, 'main');
        } else {
            mainCalendar.style.display = 'none';
        }
    });

    forumButton.addEventListener('click', () => {
        if (forumCalendar.style.display === 'none' || forumCalendar.style.display === '') {
            mainCalendar.style.display = 'none';
            // Re-read history just in case it was modified via the modal
            const currentHistory = JSON.parse(localStorage.getItem(FORUM_HISTORY_KEY) || '[]');
            renderCalendar(forumCalendar, currentHistory, forumCalendarDate, 'forum');
        } else {
            forumCalendar.style.display = 'none';
        }
    });

    document.addEventListener('keypress', handleKeyPress);

})();
