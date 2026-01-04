// ==UserScript==
// @name        OpenMediaVault close modal on Esc
// @namespace   Violentmonkey Scripts
// @match       *://omv.*/*
// @license     MIT
// @version     1.0
// @author      RDD
// @description 8/7/2025, 9:20:32 AM
// @downloadURL https://update.greasyfork.org/scripts/553356/OpenMediaVault%20close%20modal%20on%20Esc.user.js
// @updateURL https://update.greasyfork.org/scripts/553356/OpenMediaVault%20close%20modal%20on%20Esc.meta.js
// ==/UserScript==

window.addEventListener('load', (event) => window.addEventListener('keydown', OnKeyPressed), true);

const EscapePressed = () => {
  const closeSpan = Array.from(document.querySelectorAll('span.mat-button-wrapper')).find(span => span.textContent.trim() === 'Close');
  if (closeSpan) {
    const button = closeSpan.closest('button');
    if (button) {
      button.click();
    }
  }
};

// Event listener function for the Escape key.
const OnKeyPressed = (event) => {
  event.key === 'Escape' && EscapePressed();
};