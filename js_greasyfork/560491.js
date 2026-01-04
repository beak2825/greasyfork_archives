// ==UserScript==
// @name         Bloxd.io Crosshair Infinite Pulse Toggle + Hold Big
// @version      2.0
// @description  R/F toggles infinite pulse; holding mouse = stays big; release resumes pulse if enabled
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560491/Bloxdio%20Crosshair%20Infinite%20Pulse%20Toggle%20%2B%20Hold%20Big.user.js
// @updateURL https://update.greasyfork.org/scripts/560491/Bloxdio%20Crosshair%20Infinite%20Pulse%20Toggle%20%2B%20Hold%20Big.meta.js
// ==/UserScript==

// SETTINGS
const NORMAL_SCALE = 1.0;   // normal size
const BIG_SCALE = 1.30;     // strong pulse size (your choice C)
const PULSE_SPEED = 100;    // fast pulse speed (ms)

let pulseEnabled = false;
let mouseHeld = false;
let pulseInterval = null;

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dc2bedfa-075c-413e-af56-ab077c28c4a5.png";

// Exact Bloxd cursor size
crosshair.style.width = "24px";
crosshair.style.height = "24px";

crosshair.style.position = "fixed";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
crosshair.style.zIndex = "9999";
crosshair.style.pointerEvents = "none";
crosshair.style.transition = "transform 0.08s ease";
document.body.appendChild(crosshair);

// Start infinite pulse loop
function startPulse() {
    if (pulseInterval) return;

    pulseInterval = setInterval(() => {
        if (!mouseHeld) {
            crosshair.style.transform = `translate(-50%, -50%) scale(${BIG_SCALE})`;
            setTimeout(() => {
                if (!mouseHeld) {
                    crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
                }
            }, PULSE_SPEED / 2);
        }
    }, PULSE_SPEED);
}

// Stop pulse loop
function stopPulse() {
    clearInterval(pulseInterval);
    pulseInterval = null;
    if (!mouseHeld) {
        crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
    }
}

// Toggle pulse with R/F
window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "r" || key === "f") {
        pulseEnabled = !pulseEnabled;

        if (pulseEnabled) {
            startPulse();
        } else {
            stopPulse();
        }
    }
});

// Hold mouse = stay big (override pulse)
window.addEventListener("mousedown", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = true;
        crosshair.style.transform = `translate(-50%, -50%) scale(${BIG_SCALE})`;
    }
});

// Release mouse = resume pulse or normal
window.addEventListener("mouseup", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = false;

        if (pulseEnabled) {
            // resume pulsing
            crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
        } else {
            // stay normal
            crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
        }
    }
});
