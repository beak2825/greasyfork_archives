// ==UserScript==
// @name         Bloxd.io Thick Crosshair Pulse Toggle
// @version      2.1
// @description  R/F toggles infinite pulse; mouse hold = stays big; 32px thick crosshair
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560561/Bloxdio%20Thick%20Crosshair%20Pulse%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/560561/Bloxdio%20Thick%20Crosshair%20Pulse%20Toggle.meta.js
// ==/UserScript==

// SETTINGS
const NORMAL_SCALE = 1.0;
const BIG_SCALE = 1.30;
const PULSE_SPEED = 100;

let pulseEnabled = false;
let mouseHeld = false;
let pulseInterval = null;

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dbd68f88-11d5-46f3-bdc3-19273f157eaa.png"; // thicker 32px version

crosshair.style.width = "32px";
crosshair.style.height = "32px";
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
        pulseEnabled ? startPulse() : stopPulse();
    }
});

// Hold mouse = stay big
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
        pulseEnabled
            ? crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`
            : crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
    }
});
