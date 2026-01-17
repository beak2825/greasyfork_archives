// ==UserScript==
// @name         Impex Cube - Better Date Selector
// @namespace    http://github.com/quantavil
// @version      1.2
// @description  Enhanced date input with manual typing support - Format: DD/MM/YYYY
// @author       You
// @match        *://*.impexcube.in/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562995/Impex%20Cube%20-%20Better%20Date%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/562995/Impex%20Cube%20-%20Better%20Date%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Date Utility Object for DRY principle
    const DateUtils = {
        MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        MONTHS_FULL: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        DAYS: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

        // Get month index from name (uses MONTHS for short form)
        getMonthIndex(monthStr) {
            const m = monthStr.toLowerCase();
            // Try short form first (compare against lowercased MONTHS)
            let idx = this.MONTHS.findIndex(mon => mon.toLowerCase() === m.substring(0, 3));
            if (idx === -1) {
                idx = this.MONTHS_FULL.indexOf(m);
            }
            return idx;
        },

        // Normalize year (handle 2-digit years)
        normalizeYear(yearStr) {
            let year = parseInt(yearStr, 10);
            if (year < 100) {
                year += year < 50 ? 2000 : 1900;
            }
            return year;
        },

        // Create valid date or return null
        createValidDate(day, month, year) {
            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            if (month < 0 || month > 11) return null;
            if (day < 1 || day > 31) return null;
            if (year < 1900 || year > 2100) return null;

            const date = new Date(year, month, day);
            if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
                return null;
            }
            return date;
        },

        // Parse DD/MM/YYYY to Date object
        parse(str) {
            if (!str) return null;
            if (str instanceof Date) return isNaN(str.getTime()) ? null : str;

            const parts = str.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const validDate = this.createValidDate(day, month, year);
                if (validDate) return validDate;
            }

            // If simple parsing fails, try smart parsing logic if intended
            // kept simple here for basic DD/MM/YYYY reuse
            return null;
        },

        // Smart date parser - understands multiple formats
        smartParse(input) {
            if (!input || typeof input !== 'string') return null;

            let str = input.trim().toLowerCase();

            // Already in DD/MM/YYYY format
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
                return this.parse(str);
            }

            // Try various formats
            let day, month, year, match;

            // Format: 30-mar-2034, 30/mar/2034, 30.mar.2034, 30 mar 2034
            match = str.match(/^(\d{1,2})[\s\-\/\.]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\s\-\/\.]*(\d{2,4})$/i);
            if (match) {
                day = parseInt(match[1], 10);
                month = this.getMonthIndex(match[2]);
                year = this.normalizeYear(match[3]);
                if (month !== -1) return this.createValidDate(day, month, year);
            }

            // Format: mar 30 2034, march 30 2034
            match = str.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)[\s\-\/\.]*(\d{1,2})[\s\-\/\.,]*(\d{2,4})$/i);
            if (match) {
                month = this.getMonthIndex(match[1]);
                day = parseInt(match[2], 10);
                year = this.normalizeYear(match[3]);
                if (month !== -1) return this.createValidDate(day, month, year);
            }

            // Format: 30-03-2034, 30/03/2034, 30.03.2034 (DD-MM-YYYY)
            match = str.match(/^(\d{1,2})[\-\/\.](\d{1,2})[\-\/\.](\d{2,4})$/);
            if (match) {
                day = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                year = this.normalizeYear(match[3]);
                return this.createValidDate(day, month, year);
            }

            // Format: 2034-03-30 (ISO format YYYY-MM-DD)
            match = str.match(/^(\d{4})[\-\/\.](\d{1,2})[\-\/\.](\d{1,2})$/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                day = parseInt(match[3], 10);
                return this.createValidDate(day, month, year);
            }

            // Format: 30032034 (DDMMYYYY)
            match = str.match(/^(\d{2})(\d{2})(\d{4})$/);
            if (match) {
                day = parseInt(match[1], 10);
                month = parseInt(match[2], 10) - 1;
                year = parseInt(match[3], 10);
                return this.createValidDate(day, month, year);
            }

            return null;
        },

        // Format Date to DD/MM/YYYY
        format(date) {
            if (!date) return '';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },

        // Validate date string format
        isValidFormat(str) {
            return /^\d{2}\/\d{2}\/\d{4}$/.test(str) && this.parse(str) !== null;
        }
    };

    // Add custom styles
    GM_addStyle(`
        /* Hide Default Impex Calendar */
        .ajax__calendar,
        .ajax__calendar_container,
        div[id$="CalendarExtender5_container"],
        div[id$="CalendarExtender5_popupDiv"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .impex-date-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
        }
        .impex-date-input {
            font-family: 'Consolas', monospace !important;
            font-size: 12px !important;
            padding: 4px 8px !important;
            border: 1px solid #7f9db9 !important;
            border-radius: 3px !important;
            width: 100px !important;
            text-align: center !important;
        }
        .impex-date-input:focus {
            background-color: #D9E74F !important;
            outline: none !important;
            border-color: #2461bf !important;
        }
        .impex-date-input.valid {
            border-color: #28a745 !important;
        }
        .impex-date-input.invalid {
            border-color: #dc3545 !important;
            background-color: #ffe6e6 !important;
        }
        .impex-date-btn {
            background: #2461bf;
            color: white;
            border: none;
            padding: 4px 8px;
            margin-left: 4px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 11px;
            height: 24px; /* Match input height roughly */
        }
        .impex-date-btn:hover {
            background: #1a4a9e;
        }
        .impex-calendar-popup {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 99999; /* Ensure high z-index */
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 10px;
            display: none;
        }
        .impex-calendar-popup.show {
            display: block;
        }
        .impex-cal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }
        .impex-cal-nav {
            background: #f0f0f0;
            border: none;
            padding: 4px 10px;
            cursor: pointer;
            border-radius: 3px;
        }
        .impex-cal-nav:hover {
            background: #2461bf;
            color: white;
        }
        .impex-cal-title {
            font-weight: bold;
            font-size: 13px;
        }
        .impex-cal-grid {
            display: grid;
            grid-template-columns: repeat(7, 28px);
            gap: 2px;
        }
        .impex-cal-day-header {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            color: #666;
            padding: 4px;
        }
        .impex-cal-day {
            text-align: center;
            padding: 6px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
        }
        .impex-cal-day:hover {
            background: #e3f2fd;
        }
        .impex-cal-day.today {
            background: #fff3cd;
            font-weight: bold;
        }
        .impex-cal-day.selected {
            background: #2461bf;
            color: white;
        }
        .impex-cal-day.other-month {
            color: #ccc;
        }
        .impex-quick-btns {
            display: flex;
            gap: 4px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #eee;
        }
        .impex-quick-btn {
            flex: 1;
            padding: 4px;
            font-size: 10px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
        }
        .impex-quick-btn:hover {
            background: #e9ecef;
        }
    `);

    // Global variables for shared popup
    let activeInput = null;
    let globalPopup = null;

    // Create single global calendar popup
    function initGlobalPopup() {
        if (globalPopup) return;

        globalPopup = document.createElement('div');
        globalPopup.className = 'impex-calendar-popup';
        document.body.appendChild(globalPopup);

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (globalPopup.style.display === 'block' &&
                !globalPopup.contains(e.target) &&
                !e.target.classList.contains('impex-date-btn')) {
                hidePopup();
            }
        });

        // Handle window resize/scroll
        window.addEventListener('resize', hidePopup);
        window.addEventListener('scroll', hidePopup, true);
    }

    function hidePopup() {
        if (globalPopup) {
            globalPopup.style.display = 'none';
            activeInput = null;
        }
    }

    function showPopup(input) {
        if (!globalPopup) initGlobalPopup();
        if (activeInput === input && globalPopup.style.display === 'block') {
            hidePopup();
            return;
        }

        activeInput = input;
        const rect = input.getBoundingClientRect();

        // Position popup below input
        globalPopup.style.display = 'block';
        globalPopup.style.top = (window.scrollY + rect.bottom + 2) + 'px';
        globalPopup.style.left = (window.scrollX + rect.left) + 'px';

        renderCalendar(DateUtils.smartParse(input.value) || new Date());
    }

    function renderCalendar(viewDate) {
        if (!globalPopup || !activeInput) return;

        // Ensure viewDate is valid
        if (!viewDate || isNaN(viewDate.getTime())) {
            viewDate = new Date();
        }

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const selectedDate = DateUtils.smartParse(activeInput.value);

        globalPopup.innerHTML = `
            <div class="impex-cal-header">
                <button class="impex-cal-nav" data-action="prev-year">«</button>
                <button class="impex-cal-nav" data-action="prev-month">‹</button>
                <span class="impex-cal-title">${DateUtils.MONTHS[month]} ${year}</span>
                <button class="impex-cal-nav" data-action="next-month">›</button>
                <button class="impex-cal-nav" data-action="next-year">»</button>
            </div>
            <div class="impex-cal-grid">
                ${DateUtils.DAYS.map(d => `<div class="impex-cal-day-header">${d}</div>`).join('')}
            </div>
            <div class="impex-quick-btns">
                <button class="impex-quick-btn" data-quick="today">Today</button>
                <button class="impex-quick-btn" data-quick="-1">Yesterday</button>
                <button class="impex-quick-btn" data-quick="-7">-7 Days</button>
                <button class="impex-quick-btn" data-quick="+7">+7 Days</button>
            </div>
        `;

        const grid = globalPopup.querySelector('.impex-cal-grid');

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const prevMonthDays = new Date(year, month, 0).getDate();
            const day = prevMonthDays - firstDay + i + 1;
            const cell = document.createElement('div');
            cell.className = 'impex-cal-day other-month';
            cell.textContent = day;
            cell.dataset.date = DateUtils.format(new Date(year, month - 1, day));
            grid.appendChild(cell);
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'impex-cal-day';
            cell.textContent = day;
            const cellDate = new Date(year, month, day);
            cell.dataset.date = DateUtils.format(cellDate);

            if (cellDate.toDateString() === today.toDateString()) {
                cell.classList.add('today');
            }
            if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                cell.classList.add('selected');
            }
            grid.appendChild(cell);
        }

        // Add days of next month
        const totalCells = firstDay + daysInMonth;
        const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remaining; i++) {
            const cell = document.createElement('div');
            cell.className = 'impex-cal-day other-month';
            cell.textContent = i;
            cell.dataset.date = DateUtils.format(new Date(year, month + 1, i));
            grid.appendChild(cell);
        }

        // Navigation events
        globalPopup.querySelectorAll('.impex-cal-nav').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.dataset.action;
                if (action === 'prev-month') viewDate.setMonth(viewDate.getMonth() - 1);
                if (action === 'next-month') viewDate.setMonth(viewDate.getMonth() + 1);
                if (action === 'prev-year') viewDate.setFullYear(viewDate.getFullYear() - 1);
                if (action === 'next-year') viewDate.setFullYear(viewDate.getFullYear() + 1);
                renderCalendar(viewDate);
            };
        });

        // Helper: Update input value and trigger events (DRY)
        function updateInputValue(dateStr) {
            if (!activeInput) return;
            activeInput.value = dateStr;
            activeInput.classList.remove('invalid');
            activeInput.classList.add('valid');
            activeInput.dispatchEvent(new Event('change', { bubbles: true }));
            activeInput.dispatchEvent(new Event('blur', { bubbles: true }));
            hidePopup();
        }

        // Day click events
        globalPopup.querySelectorAll('.impex-cal-day').forEach(cell => {
            cell.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateInputValue(cell.dataset.date);
            };
        });

        // Quick buttons
        globalPopup.querySelectorAll('.impex-quick-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const quick = btn.dataset.quick;
                const date = new Date();
                if (quick !== 'today') {
                    date.setDate(date.getDate() + parseInt(quick));
                }
                updateInputValue(DateUtils.format(date));
            };
        });
    }

    // Enhance date input
    function enhanceDateInput(input) {
        if (input.dataset.impexEnhanced) return;

        // -----------------------------------------------------------
        // GUARD: Only enhance visible text inputs, not buttons/hidden
        // -----------------------------------------------------------
        const inputType = (input.type || 'text').toLowerCase();
        if (['hidden', 'button', 'submit', 'reset', 'image', 'checkbox', 'radio'].includes(inputType)) {
            input.dataset.impexEnhanced = 'true'; // Mark to avoid re-checking
            return;
        }

        input.dataset.impexEnhanced = 'true';

        // -----------------------------------------------------------
        // CRITICAL FIX: Unlock Manual Typing
        // Remove restrictive event handlers that block typing
        // -----------------------------------------------------------
        input.removeAttribute('onkeypress'); // Removes TabAllow(event)
        input.removeAttribute('onkeydown');
        input.removeAttribute('onkeyup');
        input.removeAttribute('onblur');     // Removes IsValidDate checks
        input.removeAttribute('onfocus');
        input.removeAttribute('readonly');   // Ensure editable

        // Remove ASP.NET Ajax Calendar behavior if attached inline often via behaviorID?
        // Hard to detach server-side behaviors easily, but removing READONLY and events helps.

        input.setAttribute('autocomplete', 'off'); // Prevent browser autocomplete
        input.classList.add('impex-date-input');

        // Styling
        input.style.width = '100px';
        input.style.textAlign = 'center';
        input.placeholder = 'DD/MM/YYYY';
        // No maxLength restriction - allow typing "18 dec 2024" which gets converted on blur

        // Popup is initialized lazily on first button click via showPopup()

        // Create wrapper
        const wrapper = document.createElement('span');
        wrapper.className = 'impex-date-wrapper';

        // Move input into wrapper
        if (input.parentNode) {
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }

        // Create calendar button
        const calBtn = document.createElement('button');
        calBtn.type = 'button';
        calBtn.className = 'impex-date-btn';
        calBtn.innerHTML = '📅';
        calBtn.title = 'Open Calendar';
        wrapper.appendChild(calBtn);

        // Toggle calendar on button click
        calBtn.onclick = (e) => {
            e.preventDefault(); // Prevent form submit
            e.stopPropagation();
            showPopup(input);
        };

        // Auto-format while typing (only for pure numeric input)
        input.addEventListener('input', (e) => {
            let value = input.value;
            const numericOnly = value.replace(/[^\d]/g, '');

            // Only auto-format if input is purely numeric (no letters like "dec")
            if (/^[\d\/]+$/.test(value) && e.inputType !== 'deleteContentBackward') {
                // Auto-insert slashes for DD/MM/YYYY format
                if (numericOnly.length >= 3 && value.indexOf('/') === -1) {
                    value = numericOnly.slice(0, 2) + '/' + numericOnly.slice(2);
                } else if (numericOnly.length >= 5 && value.split('/').length < 3) {
                    let v = numericOnly;
                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
                    if (v.length > 10) v = v.slice(0, 10);
                    value = v;
                }
                if (value !== input.value) {
                    input.value = value;
                }
            }

            // Visual Feedback
            if (DateUtils.isValidFormat(input.value)) {
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else {
                if (input.value.length === 10) {
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('valid', 'invalid');
                }
            }
        });

        // Smart parse on blur
        input.addEventListener('blur', (e) => {
            const value = input.value.trim();
            if (!value) {
                input.classList.remove('valid', 'invalid');
                return;
            };

            const parsedDate = DateUtils.smartParse(value);
            if (parsedDate) {
                input.value = DateUtils.format(parsedDate);
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
            }
        });

        // Keyboard shortcuts
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hidePopup();
            }
            if (e.key === 'Enter') {
                hidePopup();
                input.blur(); // Trigger blur logic
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const currentDate = DateUtils.parse(input.value) || new Date();
                currentDate.setDate(currentDate.getDate() + (e.key === 'ArrowUp' ? 1 : -1));
                input.value = DateUtils.format(currentDate);
                input.classList.add('valid');
                e.preventDefault();
            }
        });

        // Disable original calendar button siblings if any
        // Often these are images like 'calendar.png' or buttons next to the input
        let sibling = wrapper.nextElementSibling;
        if (sibling && (sibling.id || '').includes('CalendarExtender')) {
            sibling.style.display = 'none';
        }
    }

    // Find and enhance date inputs
    function enhanceAllDateInputs() {
        // Target common date input patterns in Impex Cube
        const selectors = [
            'input[id*="Date"]',
            'input[id*="date"]',
            'input[id*="Dt"]',
            'input[name*="Date"]',
            'input[name*="date"]',
            'input.hasDatepicker', // Generic jquery ui marker
            'input.textbox100', // Common class in Impex for dates
            'input[type="text"][placeholder*="DD/MM" i]'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(input => {
            // Check if it looks like a date field by specific attributes or context
            // Avoid impacting non-date fields that might match 'textbox100'
            const isDateContext =
                input.id.toLowerCase().includes('date') ||
                input.name.toLowerCase().includes('date') ||
                (input.onkeypress && input.onkeypress.toString().includes('TabAllow')) ||
                (input.onblur && input.onblur.toString().includes('IsValidDate'));

            if (isDateContext) {
                enhanceDateInput(input);
            }
        });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhanceAllDateInputs);
    } else {
        enhanceAllDateInputs();
    }

    // Re-run on dynamic content (for AJAX-loaded forms in ASP.NET UpdatePanels)
    // Debounced to avoid excessive calls during rapid DOM changes
    let enhanceTimeout = null;
    const observer = new MutationObserver((mutations) => {
        const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
        if (hasNewNodes && !enhanceTimeout) {
            enhanceTimeout = setTimeout(() => {
                enhanceAllDateInputs();
                enhanceTimeout = null;
            }, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('✅ Impex Cube Better Date Selector 1.1 loaded');
})();

