// ==UserScript==
// @name         Bloxd.io Crosshair (Exact Size + Small Pulse)
// @version      1.5
// @description  Same size as Bloxd cursor; R/F + mouse hold = small pulse bigger
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560488/Bloxdio%20Crosshair%20%28Exact%20Size%20%2B%20Small%20Pulse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560488/Bloxdio%20Crosshair%20%28Exact%20Size%20%2B%20Small%20Pulse%29.meta.js
// ==/UserScript==

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dc2bedfa-075c-413e-af56-ab077c28c4a5.png";

// FORCE exact Bloxd cursor size (tiny)
crosshair.style.width = "24px";
crosshair.style.height = "24px";

crosshair.style.position = "fixed";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.transform = "translate(-50%, -50%) scale(1)";
crosshair.style.zIndex = "9999";
crosshair.style.pointerEvents = "none";
crosshair.style.transition = "transform 0.08s ease";
document.body.appendChild(crosshair);

// Track mouse hold
let mouseHeld = false;

// Make crosshair slightly bigger
function makeBig() {
    crosshair.style.transform = "translate(-50%, -50%) scale(1.15)"; // small, clean bump
}

// Return to normal size
function makeNormal() {
    if (!mouseHeld) {
        crosshair.style.transform = "translate(-50%, -50%) scale(1)";
    }
}

// R/F = small pulse
window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "r" || key === "f") {
        makeBig();
        setTimeout(() => makeNormal(), 100);
    }
});

// Hold mouse = stay slightly bigger
window.addEventListener("mousedown", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = true;
        makeBig();
    }
});

window.addEventListener("mouseup", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = false;
        makeNormal();
    }
});
