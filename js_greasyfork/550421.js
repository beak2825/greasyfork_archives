// ==UserScript==
// @name        Move magnet button to top on audiobookbay.lu
// @namespace   Violentmonkey Scripts
// @match       https://audiobookbay.*/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 9/22/2025, 10:43:38 PM
// @downloadURL https://update.greasyfork.org/scripts/550421/Move%20magnet%20button%20to%20top%20on%20audiobookbaylu.user.js
// @updateURL https://update.greasyfork.org/scripts/550421/Move%20magnet%20button%20to%20top%20on%20audiobookbaylu.meta.js
// ==/UserScript==

const MAX_ATTEMPTS = 30;
const WAIT_MS_BETWEEN_ATTEMPTS = 50;

console.log("script running");
const magnetLink = document.querySelector("#magnetLink");
if (magnetLink) {
  console.log("magnet link found");
  magnetLink.click();

  // Watch for magnet icon to appear
  let attempts = 0;

  function tryMoveMagnetIcon() {
    if (attempts >= MAX_ATTEMPTS) return;
    attempts = attempts + 1;

    const icon = document.querySelector("#magnetIcon");
    if (!icon) {
      console.log("did not find magnet icon, trying again");
      tryMoveMagnetIcon();
      return;
    }

    console.log("found magnet icon, moving to title");
    document.querySelector(".postTitle > h1").moveBefore(magnetIcon, null);
    magnetIcon.style.margin = "12px";
  }
  tryMoveMagnetIcon();
}
