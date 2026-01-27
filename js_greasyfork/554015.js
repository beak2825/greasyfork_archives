// ==UserScript==
// @name         Torn City Chain Watch Alert (persistent flash + controls)
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Flash screen and play sound when chain timer drops below threshold, with UI controls.
// @author       DarthRevan
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554015/Torn%20City%20Chain%20Watch%20Alert%20%28persistent%20flash%20%2B%20controls%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554015/Torn%20City%20Chain%20Watch%20Alert%20%28persistent%20flash%20%2B%20controls%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

      ///Killed the selector due to it now being illegal, will be making it API based when I get the chance. 



    ///const TIMER_SELECTORS = [
       /// "#react-root > div > div.appHeaderWrapper___uyPti.disableLinksRightMargin___gY7V5 > div.topSection___U7sVi > div.labelsContainer___Oz6Su > div > span.labelTitle___ZtfnD > div > span:nth-child(2) > span",
   ///     "#sidebar > div:nth-child(1) > div > div.user-information___VBSOk > div > div.toggle-content___BJ9Q9 > div > div:nth-child(4) > a.chain-bar___vjdPL.bar-desktop___F8PEF > div.bar-stats___E_LqA > p.bar-timeleft___B9RGV"
///    ];

    let enabled = true;
    let flashThreshold = 60;
    let soundThreshold = 60;
    let flashing = false;
    let overlay = null;
    let style = null;

    const AUDIO_DURATION = 45000;
    const AUDIO_URL = 'https://audio.jukehost.co.uk/byq2uIIeKkzqHwFMOST5V3XR8Kx3wWJB';
    let audio = null;
    let audioStartTime = null;

const controlPanel = document.createElement('div');
controlPanel.style.position = 'fixed';
controlPanel.style.top = '10px';
controlPanel.style.right = '10px';
controlPanel.style.width = '220px';
controlPanel.style.height = 'auto';
controlPanel.style.backgroundColor = '#222';
controlPanel.style.color = '#fff';
controlPanel.style.padding = '10px';
controlPanel.style.borderRadius = '8px';
controlPanel.style.zIndex = 10000;
controlPanel.style.fontSize = '14px';
controlPanel.style.fontFamily = 'Arial, sans-serif';
controlPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
controlPanel.style.cursor = 'move';
controlPanel.style.userSelect = 'none'; // prevent accidental text selection

controlPanel.innerHTML = `
    <h1 style="margin: 0 0 8px 0;">Chain Watch Notifier</h1>
    <label><input type="checkbox" id="toggleAlert" checked> Turn on Chain Watch mode</label><br>
    Flash Threshold (sec): <input type="number" id="flashInput" value="${flashThreshold}" style="width:50px"><br>
    Sound Threshold (sec): <input type="number" id="soundInput" value="${soundThreshold}" style="width:50px">
`;
document.body.appendChild(controlPanel);

// --- Make the panel draggable ---
let isDragging = false;
let offsetX, offsetY;

// Start dragging when mouse down (but not on inputs)
controlPanel.addEventListener('mousedown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
  isDragging = true;

  const rect = controlPanel.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  // Allow moving freely by switching to absolute positioning
  controlPanel.style.position = 'fixed';
  controlPanel.style.right = 'auto'; // disable right anchoring
});

// Move panel as mouse moves
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  controlPanel.style.left = e.clientX - offsetX + 'px';
  controlPanel.style.top = e.clientY - offsetY + 'px';
});

// Stop dragging on mouse up
document.addEventListener('mouseup', () => {
  isDragging = false;
});

    document.body.appendChild(controlPanel);

    document.getElementById('toggleAlert').addEventListener('change', (e) => {
        enabled = e.target.checked;
        if (!enabled) {
            stopFlashing();
            stopSoundLoop();
        }
    });

    document.getElementById('flashInput').addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) flashThreshold = val;
    });

    document.getElementById('soundInput').addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0) soundThreshold = val;
    });

    function getTimeInSeconds(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return parts[0] * 60 + parts[1];
        }
        return null;
    }

    function startFlashing() {
        if (flashing) return;
        flashing = true;
        overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
        overlay.style.zIndex = 9999;
        overlay.style.pointerEvents = 'none';
        overlay.style.animation = 'flash 0.5s alternate infinite';
        document.body.appendChild(overlay);

        style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                from { opacity: 0.3; }
                to { opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    function stopFlashing() {
        if (!flashing) return;
        flashing = false;
        if (overlay) overlay.remove();
        if (style) style.remove();
        overlay = null;
        style = null;
    }

    function initAudio() {
        if (!audio) {
            audio = new Audio(AUDIO_URL);
            audio.preload = 'auto';
            audio.volume = 0.5;
            audio.loop = true;
            audio.load();
        }
    }

    async function startSoundLoop() {
        if (audioStartTime !== null) return;
        initAudio();
        try {
            await audio.play();
            audioStartTime = Date.now();
            setTimeout(() => {
                if (audioStartTime !== null) stopSoundLoop();
            }, AUDIO_DURATION);
        } catch (e) {
            if (e.name === 'NotAllowedError') {
                const startAudio = async () => {
                    try {
                        await audio.play();
                        document.removeEventListener('click', startAudio);
                    } catch (err) {
                        console.error('Still failed to play audio:', err);
                    }
                };
                document.addEventListener('click', startAudio);
            }
        }
    }

    function stopSoundLoop() {
        if (audioStartTime === null) return;
        audio.pause();
        audio.currentTime = 0;
        audioStartTime = null;
    }

    function checkTimer() {
        if (!enabled) return;

        let timerEl = null;
        for (const selector of TIMER_SELECTORS) {
            timerEl = document.querySelector(selector);
            if (timerEl) break;
        }
        if (!timerEl) return;

        const timeText = timerEl.textContent.trim();
        if (!timeText.includes(':')) return;

        const seconds = getTimeInSeconds(timeText);
        if (seconds === null) return;

        if (seconds < flashThreshold) {
            startFlashing();
        } else {
            stopFlashing();
        }

        if (seconds < soundThreshold) {
            startSoundLoop();
        } else {
            stopSoundLoop();
        }
    }

    const observer = new MutationObserver(checkTimer);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkTimer, 1000);
})();
