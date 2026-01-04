// ==UserScript==
// @name         Bloxd.io Crosshair Pulse + Hold (Medium Size)
// @version      1.3
// @description  R/F pulses crosshair; hold click = stays slightly bigger
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560486/Bloxdio%20Crosshair%20Pulse%20%2B%20Hold%20%28Medium%20Size%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560486/Bloxdio%20Crosshair%20Pulse%20%2B%20Hold%20%28Medium%20Size%29.meta.js
// ==/UserScript==

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = "https://copilot.microsoft.com/th/id/BCO.dc2bedfa-075c-413e-af56-ab077c28c4a5.png"; // your exact white crosshair
crosshair.style.position = "fixed";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.transform = "translate(-50%, -50%) scale(1)";
crosshair.style.zIndex = "9999";
crosshair.style.pointerEvents = "none";
crosshair.style.transition = "transform 0.1s ease";
document.body.appendChild(crosshair);

// Pulse effect on R/F
window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    if (key === "r" || key === "f") {
        let count = 0;
        const pulse = setInterval(() => {
            crosshair.style.transform = "translate(-50%, -50%) scale(1.25)";
            setTimeout(() => {
                if (!mouseHeld) crosshair.style.transform = "translate(-50%, -50%) scale(1)";
            }, 100);
            count++;
            if (count >= 4) clearInterval(pulse);
        }, 150);
    }
});

// Hold mouse = stay slightly bigger
let mouseHeld = false;
window.addEventListener("mousedown", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = true;
        crosshair.style.transform = "translate(-50%, -50%) scale(1.25)";
    }
});
window.addEventListener("mouseup", e => {
    if (e.button === 0 || e.button === 2) {
        mouseHeld = false;
        crosshair.style.transform = "translate(-50%, -50%) scale(1)";
    }
});
