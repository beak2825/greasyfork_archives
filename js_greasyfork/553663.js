// ==UserScript==
// @name         Torn Chain Watch Mobile
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Displays chain timer below Chain Box in faction menu.
// @author       Codex234
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553663/Torn%20Chain%20Watch%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/553663/Torn%20Chain%20Watch%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentAudio = null;
    let isTestActive = false;
    let testEndTime = 0;
    let lastStopTime = 0;

    const sounds = [
        { name: 'None', src: '' },
        { name: 'Train Bell', src: 'https://www.soundjay.com/transportation/sounds/train-crossing-bell-01.mp3' },
        { name: 'Smoke Alarm', src: 'https://www.soundjay.com/mechanical/sounds/smoke-detector-1.mp3' },
        { name: 'Car Alarm', src: 'https://www.soundjay.com/transportation/sounds/car-alarm-1.mp3' },
        { name: 'Air Raid', src: 'https://cdn.pixabay.com/audio/2021/08/04/audio_21be84d662.mp3' },
        { name: 'Dial Up', src: 'https://sfxcontent.s3.amazonaws.com/soundfx/EmergencyAlertSystemBeep.mp3' },
        { name: 'Electric', src: 'https://cdn.freesound.org/previews/361/361491_4930962-lq.mp3' },
        { name: 'Car Horn', src: 'https://cdn.freesound.org/previews/436/436587_1535323-lq.mp3' },
        { name: 'Klaxon', src: 'https://cdn.freesound.org/previews/32/32088_114160-lq.mp3' },
        { name: 'EAS Alarm', src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_30d62f0685.mp3' }
    ];

    function loadSettings() {
        const defaultSettings = {
            threshold: 0,
            soundUrl: 'https://www.soundjay.com/transportation/sounds/train-crossing-bell-01.mp3',
            profileXid: '3471923',
            enableSound: true
        };
        const stored = JSON.parse(localStorage.getItem('chainWatchSettings') || '{}');
        return { ...defaultSettings, ...stored };
    }

    function saveSettings(newSettings) {
        const settings = { ...loadSettings(), ...newSettings };
        localStorage.setItem('chainWatchSettings', JSON.stringify(settings));
        return settings;
    }

    function parseTime(str) {
        if (str === 'N/A' || !str) return Infinity;
        const parts = str.trim().split(':');
        const nums = parts.map(Number);
        let total = 0;
        if (parts.length === 3) {
            const [h, m, s] = nums;
            total = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
        } else if (parts.length === 2) {
            const [m, s] = nums;
            total = (m || 0) * 60 + (s || 0);
        } else {
            return Infinity;
        }
        return total > 0 ? total : 0;
    }

    function playSound(isTest = false) {
        const settings = loadSettings();
        if (!settings.enableSound || !settings.soundUrl) return;

        if (!isTest) {
            const now = Date.now();
            if (now - lastStopTime < 10000) return;
        }

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        try {
            currentAudio = new Audio(settings.soundUrl);
            currentAudio.preload = 'auto';
            currentAudio.volume = 1.0;
            currentAudio.loop = isTest;

            currentAudio.addEventListener('ended', () => {
                currentAudio = null;
            });

            currentAudio.addEventListener('canplaythrough', () => {
                currentAudio.play().catch((e) => {
                    console.log('Audio play failed:', e);
                });
            });

            currentAudio.addEventListener('error', (e) => {
                console.log('Audio load error:', e);
            });

            currentAudio.load();

            if (isTest) {
                isTestActive = true;
                testEndTime = Date.now() + 5000;
                setTimeout(() => {
                    if (currentAudio) {
                        currentAudio.loop = false;
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                        currentAudio = null;
                    }
                    isTestActive = false;
                }, 5000);
            }
        } catch (e) {
            console.log('Audio creation error:', e);
        }
    }

    function stopSound() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        isTestActive = false;
        lastStopTime = Date.now();
    }

    function checkAlerts(timerValue) {
        const seconds = parseTime(timerValue);
        const settings = loadSettings();
        const thresholdSeconds = settings.threshold || 0;

        if (seconds > thresholdSeconds) {
            localStorage.removeItem('chainAlerted');
        }

        if (thresholdSeconds > 0 && seconds <= thresholdSeconds && seconds > 0 && !localStorage.getItem('chainAlerted')) {
            const now = Date.now();
            if (now - lastStopTime >= 10000) {
                localStorage.setItem('chainAlerted', 'true');
                playSound(false);
            }
        }
    }

    function verifySoundState(timerValue) {
        const seconds = parseTime(timerValue);
        const settings = loadSettings();
        const thresholdSeconds = settings.threshold || 0;
        const now = Date.now();
        const inTestPeriod = isTestActive && now < testEndTime;
        const shouldPlay = settings.enableSound && settings.soundUrl && (
            (thresholdSeconds > 0 && seconds <= thresholdSeconds && seconds > 0 && localStorage.getItem('chainAlerted')) ||
            (thresholdSeconds > 0 && seconds <= 0)
        );

        if (shouldPlay && !currentAudio) {
            if (now - lastStopTime >= 10000) {
                playSound(false);
            }
        } else if (!shouldPlay && currentAudio && !inTestPeriod) {
            stopSound();
        }
    }

    // Update profile links across displays
    function updateProfileLinks() {
        const settings = loadSettings();
        const href = `https://www.torn.com/loader.php?sid=attack&user2ID=${settings.profileXid}`;
        document.querySelectorAll('.profile-link').forEach(link => {
            link.href = href;
        });
    }
    let created = false;
    function createTimerDisplay(id, timerValue) {
        let timerDisplay = document.getElementById(id);
        const labelId = 'timer-label';
        const textId = 'timer-text';
        const currentSettings = loadSettings();
        if (!timerDisplay) {
            timerDisplay = document.createElement('div');
            timerDisplay.id = id;
            timerDisplay.style.cssText = `
                background: linear-gradient(90deg, #2c3e50, #3498db);
                color: white;
                padding: 15px;
                margin: 10px 0;
                border-radius: 8px;
                text-align: center;
                font-family: Arial, sans-serif;
                font-weight: bold;
                width: 100%;
                box-sizing: border-box;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                align-items: center;
                pointer-events: auto;
            `;

            // Set width to match chain-box
            const chainBox = document.querySelector('.chain-box');
            if (chainBox) {
                timerDisplay.style.width = chainBox.offsetWidth + 'px';
                timerDisplay.style.maxWidth = 'none';
            }

            // Label
            const labelSpan = document.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = 'Timer:';
            labelSpan.style.cssText = `
                font-size: 1.2rem;
                margin-bottom: 5px;
            `;
            timerDisplay.appendChild(labelSpan);

            // Timer text
            const textSpan = document.createElement('span');
            textSpan.id = textId;
            textSpan.textContent = `${timerValue}`;
            textSpan.style.cssText = `
                font-size: 2.5rem;
                width: 50%;
                margin-bottom: 10px;
            `;
            timerDisplay.appendChild(textSpan);

            // Profile button
            const button = document.createElement('a');
            button.className = 'profile-link';
            button.textContent = 'Attack';
            button.style.cssText = `
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                text-decoration: none;
                font-size: 1.1rem;
                width: 100%;
                max-width: 200px;
                text-align: center;
                box-sizing: border-box;
                pointer-events: auto;
            `;
            button.onmouseover = () => button.style.backgroundColor = '#0056b3';
            button.onmouseout = () => button.style.backgroundColor = '#007bff';
            timerDisplay.appendChild(button);

            // Settings panel
            const settingsPanel = document.createElement('div');
            settingsPanel.style.cssText = `
                width: 100%;
                padding: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
                margin-top: 10px;
                font-size: 0.9rem;
                display: flex;
                flex-direction: column;
                gap: 8px;
            `;

            // Threshold (minutes:seconds)
            const thresholdDiv = document.createElement('div');
            const min = Math.floor(currentSettings.threshold / 60);
            const sec = currentSettings.threshold % 60;
            thresholdDiv.innerHTML = `
                <label>Alarm: <input type="number" id="min-input" min="0" max="5" value="${min}" style="width: 40px; margin: 0 2px;"> : <input type="number" id="sec-input" min="0" max="59" value="${sec}" style="width: 40px; margin: 0 2px;"> (0:00 = off)</label>
            `;
            const minInput = thresholdDiv.querySelector('#min-input');
            const secInput = thresholdDiv.querySelector('#sec-input');
            const updateThreshold = () => {
                let m = parseInt(minInput.value) || 0;
                if (m > 5) {
                    m = 5;
                    minInput.value = m;
                }
                let s = parseInt(secInput.value) || 0;
                if (s > 59) {
                    s = 59;
                    secInput.value = s;
                }
                saveSettings({ threshold: m * 60 + s });
                verifySoundState(timerValue);
            };
            minInput.onchange = updateThreshold;
            secInput.onchange = updateThreshold;
            settingsPanel.appendChild(thresholdDiv);

            // Sound select
            const soundDiv = document.createElement('div');
            soundDiv.innerHTML = `<label>Sound: <select id="sound-select" style="width: 100%; box-sizing: border-box; margin-top: 2px;"></select></label>`;
            const select = soundDiv.querySelector('#sound-select');
            sounds.forEach(sound => {
                const opt = document.createElement('option');
                opt.value = sound.src;
                opt.textContent = sound.name;
                select.appendChild(opt);
            });
            select.value = currentSettings.soundUrl;
            select.onchange = (e) => {
                saveSettings({ soundUrl: e.target.value });
                verifySoundState(timerValue);
            };
            settingsPanel.appendChild(soundDiv);

            // Enable sound checkbox
            const enableSoundDiv = document.createElement('div');
            enableSoundDiv.innerHTML = `
                <label><input type="checkbox" id="enable-sound" ${currentSettings.enableSound ? 'checked' : ''} style="margin-right: 5px;"> Enable sound</label>
            `;
            enableSoundDiv.querySelector('#enable-sound').onchange = (e) => {
                saveSettings({ enableSound: e.target.checked });
                verifySoundState(timerValue);
            };
            settingsPanel.appendChild(enableSoundDiv);

            // Button row for test and stop
            const buttonRow = document.createElement('div');
            buttonRow.style.cssText = `
                display: flex;
                gap: 10px;
                justify-content: center;
            `;

            // Test sound button
            const testButton = document.createElement('button');
            testButton.textContent = 'Test Sound';
            testButton.style.cssText = `
                background: #28a745;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8rem;
            `;
            testButton.onclick = () => playSound(true);
            buttonRow.appendChild(testButton);

            // Stop sound button
            const stopButton = document.createElement('button');
            stopButton.textContent = 'Stop Sound';
            stopButton.style.cssText = `
                background: #dc3545;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8rem;
            `;
            stopButton.onmouseover = () => stopButton.style.backgroundColor = '#c82333';
            stopButton.onmouseout = () => stopButton.style.backgroundColor = '#dc3545';
            stopButton.onclick = stopSound;
            buttonRow.appendChild(stopButton);

            settingsPanel.appendChild(buttonRow);

            // Profile XID
            const xidDiv = document.createElement('div');
            xidDiv.innerHTML = `
                <label>Profile ID: <input type="text" id="xid-input" value="${currentSettings.profileXid}" style="width: 100px; margin: 0 5px;"></label>
            `;
            xidDiv.querySelector('#xid-input').onchange = (e) => {
                saveSettings({ profileXid: e.target.value });
                updateProfileLinks();
            };
            settingsPanel.appendChild(xidDiv);

            timerDisplay.appendChild(settingsPanel);
        } else {
            const textSpan = document.getElementById(textId);
            if (textSpan) {
                textSpan.textContent = `${timerValue}`;
            }
            const updatedSettings = loadSettings();
            const minInput = document.getElementById('min-input');
            const secInput = document.getElementById('sec-input');
            const soundSelect = document.getElementById('sound-select');
            const soundCb = document.getElementById('enable-sound');
            const xidInput = document.getElementById('xid-input');

            if (minInput && !minInput.matches(':focus')) {
                minInput.value = Math.floor(updatedSettings.threshold / 60);
            }
            if (secInput && !secInput.matches(':focus')) {
                secInput.value = updatedSettings.threshold % 60;
            }
            if (soundSelect && !soundSelect.matches(':focus')) {
                soundSelect.value = updatedSettings.soundUrl;
            }
            if (soundCb && !soundCb.matches(':focus')) {
                soundCb.checked = updatedSettings.enableSound;
            }
            if (xidInput && !xidInput.matches(':focus')) {
                xidInput.value = updatedSettings.profileXid;
            }
            // Update width if chain-box changes
            const chainBox = document.querySelector('.chain-box');
            if (chainBox) {
                timerDisplay.style.width = chainBox.offsetWidth + 'px';
            }
        }
        updateProfileLinks();
        return timerDisplay;
    }

    // Function to update timer display
    function updateTimerDisplay() {
        const timerElement = document.querySelector('.chain-box-timeleft');
        const timerValue = timerElement ? timerElement.textContent.trim() : 'N/A';

        checkAlerts(timerValue);
        verifySoundState(timerValue); // Double-check sound state after update

        // Update or create below faction message (settings)
        const factionMsg = document.querySelector('.f-msg.m-top10');
        if (factionMsg) {
            if (!created) {
                const timerDisplay = createTimerDisplay('timer_display', timerValue);
                if (factionMsg.nextSibling) {
                    factionMsg.parentNode.insertBefore(timerDisplay, factionMsg.nextSibling);
                } else {
                    factionMsg.parentNode.appendChild(timerDisplay);
                }
                created = true;
            } else {
                createTimerDisplay('timer_display', timerValue);
            }
        }
    }

    // Initial setup
    function waitForElement(selector, callback, maxAttempts = 30, interval = 500) {
        let attempts = 0;
        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, interval);
            }
        };
        check();
    }

    waitForElement('.chain-box-timeleft', (timerElement) => {
        updateTimerDisplay();

        // Observe changes to timer element
        const observer = new MutationObserver(updateTimerDisplay);
        observer.observe(timerElement, { childList: true, characterData: true, subtree: true });

        // Fallback periodic update
        setInterval(updateTimerDisplay, 1000);
    });
})();