// ==UserScript==
// @name        AC's Hitbox.io Cleanup Script
// @namespace   Violentmonkey Scripts
// @match       *://*.hitbox.io/*
// @exclude-match *://*.hitbox.io/robots.txt
// @exclude-match *://*.hitbox.io/beta
// @grant       none
// @version     0.2.1
// @author      Aggressive Combo
// @license     ISC
// @description Hitbox.io Script for removing "unnecessary" things
// @downloadURL https://update.greasyfork.org/scripts/552204/AC%27s%20Hitboxio%20Cleanup%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/552204/AC%27s%20Hitboxio%20Cleanup%20Script.meta.js
// ==/UserScript==

(function() {
  "use strict";

  window.addEventListener("load", () => {
    const leftAd = document.getElementById("adboxverticalleft");
    const rightAd = document.getElementById("adboxverticalright");

    leftAd?.remove();
    rightAd?.remove();

    const mainIframeContainer = document.getElementById("appContainer");

    if (!mainIframeContainer) return;

    const chazEmail = document.getElementById("email");
    const songCredit = document.getElementById("songcredit");

    chazEmail?.remove();
    songCredit?.remove();

    mainIframeContainer.style.border = "none";


    console.log("%cScript finished!", "background-color: rgb(20, 0, 40); color: rgb(128, 0, 255); font-weight: bold;");
  });
})();