// ==UserScript==
// @name           Dreaming Languages - Outside Time Enhancement Suite
// @description    Adds quality-of-life features to the outside time modal of Dreaming Spanish/French
// @match          *://*.dreaming.com/*
// @version        1.0.3
// @grant          none
// @license        MIT
// @namespace      https://greasyfork.org/users/1550136
// @downloadURL https://update.greasyfork.org/scripts/559551/Dreaming%20Languages%20-%20Outside%20Time%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/559551/Dreaming%20Languages%20-%20Outside%20Time%20Enhancement%20Suite.meta.js
// ==/UserScript==

// features
// - automatically selects previous day for certain (customizable) time after midnight
// - one-click minute buttons add the respective amount of time and save
// - minute input field is focused automatically
// - pressing [enter] saves

(function () {
    'use strict';

    const ENABLE_LOGGING = false;

    // previous day is selected if current hour < cutoff hour (e.g. 03:15 AM, cutoff 4 -> prev day)
    const TIME_CUTOFF_HOUR = 4;

    // displayed quick minute buttons
    const QUICK_MINUTES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 60];

    // keep at zero if there are no issues
    const DATE_PICKER_DELAY_MS = 0;

    const log = (message) => {
        if (ENABLE_LOGGING) console.log(message);
    };

    const getTargetDate = () => {
        const now = new Date();
        if (now.getHours() < TIME_CUTOFF_HOUR) {
            now.setDate(now.getDate() - 1);
            return now;
        }
        return null;
    };

    const getDayWithSuffix = (day) => {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    const openDatePicker = (dateInput) => {
        log('Clicking date input to open date picker.');
        dateInput.click();
    };

    const tryFocusMinute = () => {
        const minuteInput = document.querySelector("input[name='timeMinutes']");
        if (!minuteInput) return log('Minute input not found.');

        log('Focusing minute input...');
        minuteInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        minuteInput.click();
        minuteInput.focus();
    };

    const shiftFocusToDescription = (modal) => {
        const description = modal.querySelector("textarea[name='description']");
        if (description) {
            log('Shifting focus to description field.');
            description.focus();
        }
    };

    const selectCorrectDate = (targetDate) => {
        setTimeout(() => {
            const datepicker = document.querySelector('.ds-form-datepicker');
            if (!datepicker) {
                log('Date picker not found.');
                return tryFocusMinute();
            }

            const formattedDate = targetDate.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }).replace(/\b(\d{1,2})\b/, (m) => getDayWithSuffix(parseInt(m)));

            const ariaLabel = `Choose ${formattedDate}`;
            log(`Looking for date with aria-label: ${ariaLabel}`);

            let dateButton = document.querySelector(`[aria-label='${ariaLabel}']`);
            if (dateButton) {
                log('Clicking correct date in date picker.');
                dateButton.click();
                return setTimeout(tryFocusMinute, 0);
            }

            log('Correct date not found in date picker. Trying previous month.');
            const prevMonthBtn = document.querySelector("[aria-label='Previous Month']");
            if (!prevMonthBtn) return tryFocusMinute();

            prevMonthBtn.click();
            setTimeout(() => {
                dateButton = document.querySelector(`[aria-label='${ariaLabel}']`);
                if (dateButton) {
                    log('Clicking correct date in previous month.');
                    dateButton.click();
                } else {
                    log('Still could not find correct date.');
                }
                setTimeout(tryFocusMinute, 0);
            }, DATE_PICKER_DELAY_MS);
        }, DATE_PICKER_DELAY_MS);
    };

    const handleEnterKey = (modal) => {
        modal.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') return;
            shiftFocusToDescription(modal);

            const saveBtn = [...modal.querySelectorAll('button')]
                .find(btn => btn.textContent.trim() === 'Save');

            if (saveBtn) {
                log('Enter key pressed, clicking Save button.');
                event.preventDefault();
                setTimeout(() => saveBtn.click(), 10);
            }
        });
    };

    const addQuickMinuteButtons = (modal) => {
        const minuteInput = modal.querySelector("input[name='timeMinutes']");
        const descriptionField = modal.querySelector("textarea[name='description']");
        const saveBtn = [...modal.querySelectorAll('button')].find(btn => btn.textContent.trim() === 'Save');

        if (!minuteInput || !descriptionField || !saveBtn) return log('Required elements for quick buttons not found.');

        const titleLabel = [...modal.querySelectorAll('label')]
            .find(label => label.textContent.trim().toLowerCase().includes('description'));
        if (!titleLabel) return log('Description title not found.');

        const buttonContainer = Object.assign(document.createElement('div'), {
            style: 'display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; width: 100%;'
        });

        QUICK_MINUTES.forEach((value) => {
            const btn = Object.assign(document.createElement('button'), {
                type: 'button',
                textContent: `+${value}`,
                className: 'btn ds-button ds-button--sm ds-button--primary-invert',
                style: 'flex: 1;'
            });

            btn.addEventListener('click', () => {
                log(`Quick minute button clicked: +${value} minutes.`);

                const currentVal = parseInt(minuteInput.value) || 0;
                const newVal = currentVal + value;

                minuteInput.focus();
                minuteInput.value = '';
                minuteInput.dispatchEvent(new Event('input', { bubbles: true }));

                for (let char of String(newVal)) {
                    minuteInput.value += char;
                    minuteInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                setTimeout(() => {
                    shiftFocusToDescription(modal);
                    setTimeout(() => {
                        saveBtn.click();
                        log('Save button clicked after quick button.');
                    }, 10);
                }, 10);
            });

            buttonContainer.appendChild(btn);
        });

        titleLabel.parentElement.insertBefore(buttonContainer, titleLabel);
    };

    const handleModalAppearance = (modal) => {
        log('Modal detected, checking if date adjustment is needed.');

        const targetDate = getTargetDate();
        const dateInput = modal.querySelector('.ds-form-datepicker .ds-form-input');
        if (!dateInput) {
            log('Date input not found in modal.');
            return tryFocusMinute();
        }

        openDatePicker(dateInput);
        if (targetDate) {
            selectCorrectDate(targetDate);
        } else {
            log(`Current time is past ${TIME_CUTOFF_HOUR} AM, no date change needed.`);
            setTimeout(tryFocusMinute, DATE_PICKER_DELAY_MS);
        }

        handleEnterKey(modal);
        addQuickMinuteButtons(modal);
    };

    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.classList.contains('ds-add-or-edit-time-outside-modal')) {
                    handleModalAppearance(node);
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
})();