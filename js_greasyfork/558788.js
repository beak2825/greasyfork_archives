// ==UserScript==
// @name         Torn Push Tick Alerts (TCT Clock Based)
// @namespace    torn.push.tick.alerts
// @version      1.2.2
// @description  Multi-stage popup + sound alerts for Elimination push timing using Torn Clock (TCT) only
// @author       Whiskey_Jack
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558788/Torn%20Push%20Tick%20Alerts%20%28TCT%20Clock%20Based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558788/Torn%20Push%20Tick%20Alerts%20%28TCT%20Clock%20Based%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALERTS_KEY = 'pushAlertsEnabled';
    const SOUND_KEY  = 'pushAlertsSoundEnabled';
    const DELAY_KEY  = 'pushKillDelayMs';

    /* -------------------- Audio -------------------- */
    const audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    let audioUnlocked = false;

    function unlockAudio() {
        if (audioUnlocked) return;
        audio.play().then(() => {
            audio.pause();
            audioUnlocked = true;
        }).catch(() => {});
    }

    document.addEventListener('click', unlockAudio, { once: true });

    function soundEnabled() {
        return localStorage.getItem(SOUND_KEY) !== 'off';
    }

    function playBeep() {
        if (!audioUnlocked) return;
        if (!soundEnabled()) return;
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    /* -------------------- Helpers -------------------- */
    function alertsEnabled() {
        return localStorage.getItem(ALERTS_KEY) !== 'off';
    }

    function getKillDelay() {
        const v = parseInt(localStorage.getItem(DELAY_KEY), 10);
        return Number.isFinite(v) ? v : 300;
    }

    /* -------------------- UI -------------------- */
    function createUI() {
        if (document.getElementById('push-alert-toggle')) return;

        const wrap = document.createElement('div');
        wrap.id = 'push-alert-toggle';
        wrap.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            z-index: 9999;
            background: #111;
            color: #fff;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 180px;
        `;

        // Kill delay input
        const delayRow = document.createElement('label');
        delayRow.style.display = 'flex';
        delayRow.style.justifyContent = 'space-between';
        delayRow.style.alignItems = 'center';
        delayRow.textContent = 'Kill delay (ms)';

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.min = '0';
        delayInput.step = '50';
        delayInput.value = getKillDelay();
        delayInput.style.cssText = 'width:70px;margin-left:8px;';

        delayInput.addEventListener('change', () => {
            localStorage.setItem(DELAY_KEY, delayInput.value);
        });

        delayRow.appendChild(delayInput);

        // Enable push alerts
        const enableAlertsRow = document.createElement('label');
        enableAlertsRow.style.display = 'flex';
        enableAlertsRow.style.alignItems = 'center';
        enableAlertsRow.style.gap = '6px';

        const alertsCheckbox = document.createElement('input');
        alertsCheckbox.type = 'checkbox';
        alertsCheckbox.checked = alertsEnabled();

        alertsCheckbox.addEventListener('change', () => {
            localStorage.setItem(ALERTS_KEY, alertsCheckbox.checked ? 'on' : 'off');
            unlockAudio();
        });

        enableAlertsRow.appendChild(alertsCheckbox);
        enableAlertsRow.appendChild(document.createTextNode('Enable push alerts'));

        // Enable sound
        const enableSoundRow = document.createElement('label');
        enableSoundRow.style.display = 'flex';
        enableSoundRow.style.alignItems = 'center';
        enableSoundRow.style.gap = '6px';

        const soundCheckbox = document.createElement('input');
        soundCheckbox.type = 'checkbox';
        soundCheckbox.checked = soundEnabled();

        soundCheckbox.addEventListener('change', () => {
            localStorage.setItem(SOUND_KEY, soundCheckbox.checked ? 'on' : 'off');
            unlockAudio();
        });

        enableSoundRow.appendChild(soundCheckbox);
        enableSoundRow.appendChild(document.createTextNode('Enable sound'));

        wrap.append(delayRow, enableAlertsRow, enableSoundRow);
        document.body.appendChild(wrap);
    }

    /* -------------------- Popup -------------------- */
    let popupTimer = null;

    function showPopup(text, bg = '#b00000', duration = 4000) {
        let popup = document.getElementById('push-alert-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'push-alert-popup';
            popup.style.cssText = `
                position: fixed;
                top: 120px;
                right: 10px;
                z-index: 9999;
                background: ${bg};
                color: #fff;
                padding: 10px 14px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 16px;
            `;
            document.body.appendChild(popup);
        }

        popup.style.background = bg;
        popup.textContent = text;

        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => popup.remove(), duration);
    }

    /* -------------------- Time Logic -------------------- */
    let lastKey = '';
    let killScheduledMinute = null;

    function handleTime(tctText) {
        if (!alertsEnabled()) return;

        const m = tctText.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (!m) return;

        const mm = m[2];
        const ss = m[3];
        const key = `${mm}:${ss}`;
        if (key === lastKey) return;
        lastKey = key;

        const isPushMinute = ['14','29','44','59'].includes(mm);

        if (!isPushMinute) {
            killScheduledMinute = null;
        }

        // 2-minute warning
        if (['13','28','43','58'].includes(mm) && ss === '00') {
            showPopup('2-minute warning — get ready', '#555');
            return;
        }

        // HOLD
        if (isPushMinute && ss === '29') {
            showPopup('HOLD!', '#444', 3000);
            return;
        }

        // Push imminent
        if (isPushMinute && ss === '00') {
            showPopup('Push imminent! Find a target!');
            playBeep();
            return;
        }

        // Countdown
        if (isPushMinute && ss >= '48' && ss <= '57') {
            showPopup(`${58 - Number(ss)}`, '#8a0000', 1000);
            return;
        }

        // KILL
        if (isPushMinute && ss === '58') {
            if (killScheduledMinute === mm) return;
            killScheduledMinute = mm;

            setTimeout(() => {
                showPopup('KILL!', '#ff0000', 5000);
                playBeep();
            }, getKillDelay());
        }
    }

    /* -------------------- Clock Observer -------------------- */
    function observeClock() {
        const clock = document.querySelector('.server-date-time');
        if (!clock) return setTimeout(observeClock, 500);

        const observer = new MutationObserver(() => {
            handleTime(clock.textContent);
        });

        observer.observe(clock, {
            childList: true,
            characterData: true,
            subtree: true
        });

        handleTime(clock.textContent);
    }

    /* -------------------- Boot -------------------- */
    window.addEventListener('load', () => {
        createUI();
        observeClock();
    });

})();
