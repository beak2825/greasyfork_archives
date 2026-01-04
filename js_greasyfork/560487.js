// ==UserScript==
// @name         Bloxd.io Crosshair Medium Pulse + Hold
// @version      1.4
// @description  R/F or holding mouse makes crosshair slightly bigger (no interruptions)
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560487/Bloxdio%20Crosshair%20Medium%20Pulse%20%2B%20Hold.user.js
// @updateURL https://update.greasyfork.org/scripts/560487/Bloxdio%20Crosshair%20Medium%20Pulse%20%2B%20Hold.meta.js
// ==/UserScript==

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dc2bedfa-075c-413e-af56-ab077c28c4a5.png"; // your exact white crosshair
crosshair.style.position = "fixed";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.transform = "translate(-50%, -50%) scale(1)"; // normal size
crosshair.style.zIndex = "9999";
crosshair.style.pointerEvents = "none";
crosshair.style.transition = "transform 0.1s ease";
document.body.appendChild(crosshair);

// Track mouse hold
let mouseHeld = false;

// Make crosshair bigger
function makeBig() {
    crosshair.style.transform = "translate(-50%, -50%) scale(1.20)"; // medium size
}

// Make crosshair normal
function makeNormal() {
    if (!mouseHeld) {
        crosshair.style.transform = "translate(-50%, -50%) scale(1)";
    }
}

// R/F = pulse bigger
window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "r" || key === "f") {
        makeBig();
        setTimeout(() => makeNormal(), 120);
    }
});

// Hold mouse = stay bigger
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
