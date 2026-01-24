// ==UserScript==
// @name         Telegram Web Message Scheduler
// @namespace    https://github.com/raffiihza/telegram-web-message-scheduler/
// @version      1.0
// @description  Schedule Telegram messages using native scheduling feature
// @author       Raffi Ihza ZUhairnawan
// @match        https://web.telegram.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563847/Telegram%20Web%20Message%20Scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/563847/Telegram%20Web%20Message%20Scheduler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const BUTTON_ID = 'tm-schedule-btn';
    const MODAL_ID = 'tm-schedule-modal';

    // CSS Styles for the floating button and modal
    const styles = `
        #${BUTTON_ID} {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        #${BUTTON_ID}:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        #${BUTTON_ID} svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        #${MODAL_ID} {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        }

        #${MODAL_ID}.active {
            display: flex;
        }

        #${MODAL_ID} .modal-content {
            background: #1e1e2e;
            border-radius: 16px;
            padding: 24px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        #${MODAL_ID} h2 {
            margin: 0 0 8px 0;
            color: #cdd6f4;
            font-size: 1.5rem;
            font-weight: 600;
        }

        #${MODAL_ID} .subtitle {
            color: #6c7086;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }

        #${MODAL_ID} .form-group {
            margin-bottom: 16px;
        }

        #${MODAL_ID} label {
            display: block;
            color: #a6adc8;
            margin-bottom: 6px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        #${MODAL_ID} input,
        #${MODAL_ID} textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #45475a;
            border-radius: 8px;
            background: #313244;
            color: #cdd6f4;
            font-size: 0.95rem;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
        }

        #${MODAL_ID} input:focus,
        #${MODAL_ID} textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        #${MODAL_ID} textarea {
            min-height: 100px;
            resize: vertical;
            font-family: inherit;
        }

        #${MODAL_ID} .json-input {
            font-family: 'Consolas', 'Monaco', monospace;
            min-height: 150px;
        }

        #${MODAL_ID} .btn-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        #${MODAL_ID} button {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #${MODAL_ID} .btn-cancel {
            background: #45475a;
            color: #cdd6f4;
        }

        #${MODAL_ID} .btn-cancel:hover {
            background: #585b70;
        }

        #${MODAL_ID} .btn-submit {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        #${MODAL_ID} .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        #${MODAL_ID} .btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        #${MODAL_ID} .example-container {
            position: relative;
            margin-top: 12px;
        }

        #${MODAL_ID} .example {
            padding: 12px;
            padding-right: 50px;
            background: #181825;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.75rem;
            color: #89b4fa;
            white-space: pre-wrap;
            word-break: break-all;
            max-height: 200px;
            overflow-y: auto;
        }

        #${MODAL_ID} .btn-copy {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 10px;
            background: #45475a;
            border: none;
            border-radius: 6px;
            color: #cdd6f4;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease;
            flex: none;
        }

        #${MODAL_ID} .btn-copy:hover {
            background: #585b70;
        }

        #${MODAL_ID} .btn-copy.copied {
            background: #a6e3a1;
            color: #1e1e2e;
        }

        #${MODAL_ID} .status {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.9rem;
            display: none;
        }

        #${MODAL_ID} .status.success {
            display: block;
            background: rgba(166, 227, 161, 0.1);
            color: #a6e3a1;
            border: 1px solid rgba(166, 227, 161, 0.3);
        }

        #${MODAL_ID} .status.error {
            display: block;
            background: rgba(243, 139, 168, 0.1);
            color: #f38ba8;
            border: 1px solid rgba(243, 139, 168, 0.3);
        }

        #${MODAL_ID} .status.info {
            display: block;
            background: rgba(137, 180, 250, 0.1);
            color: #89b4fa;
            border: 1px solid rgba(137, 180, 250, 0.3);
        }

        #${MODAL_ID} .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        #${MODAL_ID} .tab {
            flex: 1;
            padding: 10px;
            background: #313244;
            border: 1px solid #45475a;
            border-radius: 8px;
            color: #a6adc8;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s ease;
        }

        #${MODAL_ID} .tab.active {
            background: #45475a;
            color: #cdd6f4;
            border-color: #667eea;
        }

        #${MODAL_ID} .tab-content {
            display: none;
        }

        #${MODAL_ID} .tab-content.active {
            display: block;
        }
    `;

    // Utility functions
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element not found: ${selector}`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    function waitForElementWithText(selector, text, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    if (el.textContent.includes(text)) {
                        resolve(el);
                        return;
                    }
                }
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element with text "${text}" not found`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    function simulateClick(element) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    function simulateRightClick(element) {
        const event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2
        });
        element.dispatchEvent(event);
    }

    function setInputValue(input, value) {
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function typeIntoContentEditable(element, text) {
        element.focus();
        element.innerHTML = '';

        // Use execCommand for better compatibility with Telegram's input handling
        document.execCommand('insertText', false, text);

        // Also dispatch input event
        element.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text
        }));
    }

    // Parse the target date and return month/year info
    function parseTargetDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return { year, month, day };
    }

    // Get current calendar month/year from the dialog
    function getCurrentCalendarMonth() {
        // Try multiple selectors for the month/year title
        const header = document.querySelector('.date-picker-month-title') ||
            document.querySelector('.popup-schedule-date .date-picker-month') ||
            document.querySelector('.date-picker-controls');

        if (header) {
            const text = header.textContent.trim();
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

            for (let i = 0; i < months.length; i++) {
                if (text.includes(months[i])) {
                    const yearMatch = text.match(/\d{4}/);
                    const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
                    console.log(`[Scheduler] Current calendar: ${months[i]} ${year}`);
                    return { month: i + 1, year };
                }
            }
        }

        console.log('[Scheduler] Could not find calendar header. Available elements:',
            document.querySelector('.date-picker-month-title')?.textContent,
            document.querySelector('.popup-schedule-date')?.innerHTML?.substring(0, 200)
        );
        return null;
    }

    // Navigate to the target month/year in the calendar
    async function navigateToMonth(targetYear, targetMonth, updateStatus) {
        let attempts = 0;
        const maxAttempts = 60; // Allow navigating up to ~5 years
        let lastFoundMonth = null;

        console.log(`[Scheduler] Navigating to target: ${targetMonth}/${targetYear}`);

        // Wait a bit for the calendar to be ready
        await sleep(500);

        while (attempts < maxAttempts) {
            const current = getCurrentCalendarMonth();

            if (!current) {
                console.log(`[Scheduler] Attempt ${attempts}: Could not get current month`);
                await sleep(300);
                attempts++;

                // If we've tried many times and still can't get the month, check if we're on the right date
                if (attempts > 10) {
                    throw new Error('Could not read calendar month. Make sure the schedule dialog is open.');
                }
                continue;
            }

            lastFoundMonth = current;
            console.log(`[Scheduler] Current: ${current.month}/${current.year}, Target: ${targetMonth}/${targetYear}`);

            if (current.year === targetYear && current.month === targetMonth) {
                console.log('[Scheduler] Reached target month!');
                return true;
            }

            const targetTotal = targetYear * 12 + targetMonth;
            const currentTotal = current.year * 12 + current.month;

            if (targetTotal > currentTotal) {
                // Need to go forward
                const nextBtn = document.querySelector('.date-picker-next');
                if (nextBtn) {
                    console.log('[Scheduler] Clicking next button');
                    simulateClick(nextBtn);
                    updateStatus(`Navigating: ${current.month}/${current.year} → ${targetMonth}/${targetYear}`, 'info');
                    await sleep(250);
                } else {
                    console.log('[Scheduler] Next button not found!');
                    throw new Error('Could not find next month button');
                }
            } else {
                // Need to go backward
                const prevBtn = document.querySelector('.date-picker-prev');
                if (prevBtn) {
                    console.log('[Scheduler] Clicking prev button');
                    simulateClick(prevBtn);
                    updateStatus(`Navigating: ${current.month}/${current.year} → ${targetMonth}/${targetYear}`, 'info');
                    await sleep(250);
                } else {
                    console.log('[Scheduler] Prev button not found!');
                    throw new Error('Could not find previous month button');
                }
            }

            attempts++;
        }

        const msg = lastFoundMonth
            ? `Could not navigate from ${lastFoundMonth.month}/${lastFoundMonth.year} to ${targetMonth}/${targetYear} after ${maxAttempts} attempts`
            : 'Could not navigate to target month - calendar not readable';
        throw new Error(msg);
    }

    // Select a specific day in the calendar
    async function selectDay(targetDay) {
        const dayButtons = document.querySelectorAll('.date-picker-month-date');

        console.log(`[Scheduler] Looking for day ${targetDay} among ${dayButtons.length} buttons`);

        // First pass: find all buttons with the target day number
        const matchingButtons = [];
        for (let i = 0; i < dayButtons.length; i++) {
            const btn = dayButtons[i];
            const dayNum = parseInt(btn.textContent.trim());
            if (dayNum === targetDay) {
                matchingButtons.push({
                    index: i,
                    button: btn,
                    disabled: btn.disabled,
                    hasNotThisMonth: btn.classList.contains('not-this-month')
                });
            }
        }

        console.log(`[Scheduler] Found ${matchingButtons.length} buttons with day ${targetDay}:`,
            matchingButtons.map(m => ({ index: m.index, disabled: m.disabled })));

        // Find the first enabled button (not disabled and not from another month)
        for (const match of matchingButtons) {
            if (!match.disabled && !match.hasNotThisMonth) {
                console.log(`[Scheduler] Clicking day ${targetDay} at index ${match.index}`);
                simulateClick(match.button);
                await sleep(300);
                return true;
            }
        }

        // If all buttons are disabled, try the last one (might be in the current month's future section)
        if (matchingButtons.length > 0) {
            const lastMatch = matchingButtons[matchingButtons.length - 1];
            console.log(`[Scheduler] All buttons disabled, trying last one at index ${lastMatch.index}`);
            simulateClick(lastMatch.button);
            await sleep(300);
            return true;
        }

        throw new Error(`Could not find day ${targetDay} in calendar`);
    }

    // Set the time in the time picker
    async function setTime(hour, minute) {
        // Find time input fields - try multiple selectors
        let timeInputs = document.querySelectorAll('.popup-schedule-date .input-field-input');

        if (timeInputs.length < 2) {
            timeInputs = document.querySelectorAll('.date-picker-time .input-field-input');
        }

        if (timeInputs.length < 2) {
            timeInputs = document.querySelectorAll('.popup-body .input-field-input');
        }

        console.log(`[Scheduler] Found ${timeInputs.length} time inputs`);

        if (timeInputs.length >= 2) {
            // Format with leading zeros
            const hourStr = hour.toString().padStart(2, '0');
            const minStr = minute.toString().padStart(2, '0');

            // Set hour
            setInputValue(timeInputs[0], hourStr);
            await sleep(150);

            // Set minute
            setInputValue(timeInputs[1], minStr);
            await sleep(150);

            console.log(`[Scheduler] Time set to ${hourStr}:${minStr}`);
            return true;
        }

        throw new Error('Could not find time input fields');
    }

    // Main scheduling function
    async function scheduleMessage(config, updateStatus) {
        try {
            const { date, time, message } = config;

            // Validate input
            if (!date || !time || !message) {
                throw new Error('Missing required fields: date, time, or message');
            }

            // Parse date and time
            const { year, month, day } = parseTargetDate(date);
            const [hour, minute] = time.split(':').map(Number);

            updateStatus(`Starting scheduling for ${date} at ${time}...`, 'info');
            await sleep(500);

            // Step 1: Find and fill the message input
            updateStatus('Finding message input...', 'info');
            const messageInput = await waitForElement('.input-message-input');
            typeIntoContentEditable(messageInput, message);
            await sleep(500);

            // Step 2: Find the send button and right-click it
            updateStatus('Opening schedule menu...', 'info');
            const sendBtn = await waitForElement('button.send');
            if (!sendBtn) {
                // Try alternative selector
                const altSendBtn = await waitForElement('button.btn-send');
                simulateRightClick(altSendBtn || sendBtn);
            } else {
                simulateRightClick(sendBtn);
            }
            await sleep(300);

            // Step 3: Click "Schedule Message" option
            updateStatus('Selecting "Schedule Message" option...', 'info');
            const scheduleOption = await waitForElementWithText('.btn-menu-item', 'Schedule');
            simulateClick(scheduleOption);
            await sleep(500);

            // Step 4: Navigate to the correct month/year
            updateStatus(`Navigating to ${month}/${year}...`, 'info');
            await navigateToMonth(year, month, updateStatus);
            await sleep(300);

            // Step 5: Select the day
            updateStatus(`Selecting day ${day}...`, 'info');
            await selectDay(day);
            await sleep(300);

            // Step 6: Set the time
            updateStatus(`Setting time to ${time}...`, 'info');
            await setTime(hour, minute);
            await sleep(300);

            // Step 7: Click the confirm button
            updateStatus('Confirming schedule...', 'info');
            // Try multiple selectors for the confirm button
            let confirmBtn = document.querySelector('.popup-schedule-date .btn-primary');
            if (!confirmBtn) {
                confirmBtn = document.querySelector('.popup-body .btn-primary');
            }
            if (!confirmBtn) {
                confirmBtn = await waitForElement('.btn-primary.btn-color-primary');
            }

            if (confirmBtn) {
                console.log('[Scheduler] Clicking confirm button');
                simulateClick(confirmBtn);
                await sleep(500);
            } else {
                throw new Error('Could not find confirm button');
            }

            updateStatus(`✅ Message scheduled for ${date} at ${time}!`, 'success');
            return true;

        } catch (error) {
            updateStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Scheduling error:', error);
            return false;
        }
    }

    // Create and inject the UI
    function createUI() {
        // Add styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Create floating button
        const floatingBtn = document.createElement('button');
        floatingBtn.id = BUTTON_ID;
        floatingBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.65l-5.15-3.09V7h1.5v6.03l4.4 2.62-.75 1z"/>
            </svg>
        `;
        floatingBtn.title = 'Schedule Telegram Message';
        document.body.appendChild(floatingBtn);

        // Create modal
        const modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.innerHTML = `
            <div class="modal-content">
                <h2>📅 Schedule Message</h2>
                <p class="subtitle">Schedule a message using Telegram's native scheduling</p>

                <div class="tabs">
                    <div class="tab active" data-tab="form">Form</div>
                    <div class="tab" data-tab="json">JSON</div>
                </div>

                <div class="tab-content active" data-tab="form">
                    <div class="form-group">
                        <label for="tm-message">Message</label>
                        <textarea id="tm-message" placeholder="Enter your message here..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="tm-date">Date (YYYY-MM-DD)</label>
                        <input type="date" id="tm-date" />
                    </div>
                    <div class="form-group">
                        <label for="tm-time">Time (HH:MM)</label>
                        <input type="time" id="tm-time" />
                    </div>
                </div>

                <div class="tab-content" data-tab="json">
                    <div class="form-group">
                        <label for="tm-json">JSON Configuration (single object or array for multiple messages)</label>
                        <textarea id="tm-json" class="json-input" placeholder='[{"date": "2026-01-25", "time": "14:30", "message": "Hello!"}]'></textarea>
                    </div>
                    <div class="example-container">
                        <button class="btn-copy" id="tm-copy-example">📋 Copy</button>
                        <div class="example" id="tm-example-text">Example (multiple messages):
[
  {
    "date": "2026-01-25",
    "time": "09:00",
    "message": "Good morning! ☀️"
  },
  {
    "date": "2026-01-25",
    "time": "12:00",
    "message": "Lunch time reminder! 🍕"
  },
  {
    "date": "2026-01-25",
    "time": "18:00",
    "message": "End of day! 🌙"
  }
]</div>
                    </div>
                </div>

                <div class="status" id="tm-status"></div>

                <div class="btn-group">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-submit">Schedule</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Set default date to today
        const dateInput = document.getElementById('tm-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;

        // IMPORTANT: Stop event propagation on all inputs to prevent Telegram from capturing keystrokes
        modal.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('keydown', (e) => {
                e.stopPropagation();
            });
            input.addEventListener('keyup', (e) => {
                e.stopPropagation();
            });
            input.addEventListener('keypress', (e) => {
                e.stopPropagation();
            });
            input.addEventListener('input', (e) => {
                e.stopPropagation();
            });
        });

        // Event listeners
        floatingBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Copy example button
        const copyBtn = document.getElementById('tm-copy-example');
        copyBtn.addEventListener('click', () => {
            const exampleJson = `[
  {
    "date": "2026-01-25",
    "time": "09:00",
    "message": "Good morning! ☀️"
  },
  {
    "date": "2026-01-25",
    "time": "12:00",
    "message": "Lunch time reminder! 🍕"
  },
  {
    "date": "2026-01-25",
    "time": "18:00",
    "message": "End of day! 🌙"
  }
]`;
            navigator.clipboard.writeText(exampleJson).then(() => {
                copyBtn.textContent = '✅ Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });

        // Tab switching
        modal.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Update tab buttons
                modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update tab content
                modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                modal.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
            });
        });

        // Submit button
        modal.querySelector('.btn-submit').addEventListener('click', async () => {
            const statusEl = document.getElementById('tm-status');
            const submitBtn = modal.querySelector('.btn-submit');

            const updateStatus = (msg, type) => {
                statusEl.textContent = msg;
                statusEl.className = `status ${type}`;
            };

            // Disable submit button
            submitBtn.disabled = true;

            try {
                let configs = [];

                // Check which tab is active
                const activeTab = modal.querySelector('.tab.active').dataset.tab;

                if (activeTab === 'json') {
                    const jsonInput = document.getElementById('tm-json').value;
                    const parsed = JSON.parse(jsonInput);

                    // Support both single object and array of objects
                    if (Array.isArray(parsed)) {
                        configs = parsed;
                    } else {
                        configs = [parsed];
                    }
                } else {
                    // Form mode
                    const message = document.getElementById('tm-message').value;
                    const date = document.getElementById('tm-date').value;
                    const time = document.getElementById('tm-time').value;

                    if (!message || !date || !time) {
                        updateStatus('Please fill in all fields', 'error');
                        submitBtn.disabled = false;
                        return;
                    }

                    configs = [{ date, time, message }];
                }

                // Validate all configs
                for (let i = 0; i < configs.length; i++) {
                    const c = configs[i];
                    if (!c.date || !c.time || !c.message) {
                        updateStatus(`Message ${i + 1} is missing date, time, or message`, 'error');
                        submitBtn.disabled = false;
                        return;
                    }
                }

                // Close modal before scheduling
                modal.classList.remove('active');

                // Execute scheduling for all messages
                const total = configs.length;
                let successful = 0;
                let failed = 0;

                for (let i = 0; i < configs.length; i++) {
                    const config = configs[i];
                    updateStatus(`📤 Scheduling message ${i + 1} of ${total}...`, 'info');
                    modal.classList.add('active');

                    const success = await scheduleMessage(config, (msg, type) => {
                        modal.classList.add('active');
                        updateStatus(`[${i + 1}/${total}] ${msg}`, type);
                    });

                    if (success) {
                        successful++;
                    } else {
                        failed++;
                    }

                    // Wait a bit between messages to let Telegram process
                    if (i < configs.length - 1) {
                        updateStatus(`✅ Message ${i + 1} scheduled. Waiting before next...`, 'info');
                        await sleep(1500);
                    }
                }

                // Final status
                modal.classList.add('active');
                if (failed === 0) {
                    updateStatus(`🎉 All ${successful} message(s) scheduled successfully!`, 'success');
                } else {
                    updateStatus(`⚠️ ${successful} scheduled, ${failed} failed`, failed > 0 ? 'error' : 'success');
                }

            } catch (error) {
                updateStatus(`Invalid JSON: ${error.message}`, 'error');
            }

            // Re-enable submit button
            submitBtn.disabled = false;
        });
    }

    // Initialize when DOM is ready
    function init() {
        if (document.getElementById(BUTTON_ID)) {
            return; // Already initialized
        }
        createUI();
        console.log('Telegram Message Scheduler loaded!');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure Telegram is fully loaded
        setTimeout(init, 1000);
    }

    // Re-check periodically in case of SPA navigation
    setInterval(() => {
        if (!document.getElementById(BUTTON_ID)) {
            init();
        }
    }, 3000);

})();