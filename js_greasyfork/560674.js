// ==UserScript==
// @name         Bloxd.io Custom Cursor!!
// @version      3.5
// @description  yay it works
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1547770
// @downloadURL https://update.greasyfork.org/scripts/560674/Bloxdio%20Custom%20Cursor%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/560674/Bloxdio%20Custom%20Cursor%21%21.meta.js
// ==/UserScript==

// SETTINGS
const NORMAL_SCALE = 1.0;
const BIG_SCALE = 1.30;
const PULSE_SPEED = 120; // faster, snappier, nonstop

let pulseEnabled = false;
let mouseHeld = false;
let pulseInterval = null;

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dbd68f88-11d5-46f3-bdc3-19273f157eaa.png"; // your thick black crosshair

// Bigger size
crosshair.style.width = "36px";
crosshair.style.height = "36px";

// Positioning
crosshair.style.position = "fixed";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.transform = `translate(-50%, -50%) scale(${NORMAL_SCALE})`;
crosshair.style.zIndex = "9999";
crosshair.style.pointerEvents = "none";

// Faster animation
crosshair.style.transition = "transform 0.06s ease";

// Convert black → white + outline + glow
crosshair.style.filter = `
    brightness(0) invert(1)       /* black → white */
    drop-shadow(0 0 1px black)    /* thin outline */
    drop-shadow(0 0 4px white)    /* soft glow */
`;

document.body.appendChild(crosshair);

// Nonstop pulse loop
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

// Stop pulse
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

// Mouse hold = stay big
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
