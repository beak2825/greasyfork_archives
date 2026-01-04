// ==UserScript==
// @name         Bloxd.io Crosshair Pulse + Hold
// @version      1.0
// @description  R/F pulses crosshair; hold click = stays big
// @author       NotNightmare
// @match        *://bloxd.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1549766
// @downloadURL https://update.greasyfork.org/scripts/560483/Bloxdio%20Crosshair%20Pulse%20%2B%20Hold.user.js
// @updateURL https://update.greasyfork.org/scripts/560483/Bloxdio%20Crosshair%20Pulse%20%2B%20Hold.meta.js
// ==/UserScript==

// Create crosshair overlay
const crosshair = document.createElement('img');
crosshair.src = 'https://copilot.microsoft.com/th/id/BCO.5b8b2a6c-d169-4f64-be9c-5c50e863945b.png'; // Clean white version
crosshair.style.position = 'fixed';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
crosshair.style.opacity = '1';
crosshair.style.zIndex = '9999';
crosshair.style.pointerEvents = 'none';
crosshair.style.transition = 'transform 0.1s ease';
document.body.appendChild(crosshair);

// Pulse animation on R/F
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (key === 'r' || key === 'f') {
    let count = 0;
    const pulse = setInterval(() => {
      crosshair.style.transform = 'translate(-50%, -50%) scale(1.5)';
      setTimeout(() => {
        crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 100);
      count++;
      if (count >= 4) clearInterval(pulse); // ~1.2s burst
    }, 150);
  }
});

// Hold click = stay big
let mouseHeld = false;
window.addEventListener('mousedown', e => {
  if (e.button === 0 || e.button === 2) {
    mouseHeld = true;
    crosshair.style.transform = 'translate(-50%, -50%) scale(1.5)';
  }
});
window.addEventListener('mouseup', e => {
  if (e.button === 0 || e.button === 2) {
    mouseHeld = false;
    crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
  }
});
