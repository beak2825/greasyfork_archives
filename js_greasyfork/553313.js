// ==UserScript==
// @name         GeoGuessr: Middle Click = Double "N"
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.1
// @description  When you middle-click (scroll wheel click), it simulates pressing "N" twice in GeoGuessr.
// @author       Rotski
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553313/GeoGuessr%3A%20Middle%20Click%20%3D%20Double%20%22N%22.user.js
// @updateURL https://update.greasyfork.org/scripts/553313/GeoGuessr%3A%20Middle%20Click%20%3D%20Double%20%22N%22.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('mousedown', (e) => {
    // middle mouse button = 1
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();

      // Create and dispatch two synthetic "N" keydown events
      const pressN = () => {
        const down = new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', bubbles: true });
        document.dispatchEvent(down);
      };

      pressN();
      setTimeout(pressN, 80); // 80ms delay between presses
    }
  }, true);
})();
