// ==UserScript==
// @name         PiPifier
// @namespace    https://github.com/user/pipifier
// @version      1.0.0
// @description  Enable Picture-in-Picture mode for YouTube videos
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://raw.githubusercontent.com/arnoappenzeller/PiPifier/refs/heads/main/PiPifier%20iOS/Graphic%20Ressources/Icon/Rounded/AppIcon/Icon-167.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560887/PiPifier.user.js
// @updateURL https://update.greasyfork.org/scripts/560887/PiPifier.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

// Based on PiPifier - https://github.com/arnoappenzeller/PiPifier
// MIT License
//
// Copyright (c) 2024 PiPifier Contributors

(function () {
  "use strict";

  const PIP_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 701 616" xmlns="http://www.w3.org/2000/svg">
        <path d="M137.640097,434 L299.403657,434 L299.403657,399.076967 L138.077492,399.076967 C127.147546,399.076967 118.767801,396.184846 112.938258,390.400605 C107.109013,384.616364 104.194391,376.084527 104.194391,364.805094 L104.194391,149.194551 C104.194391,137.915414 107.109013,129.383577 112.938258,123.59904 C118.767801,117.814799 127.147546,114.922678 138.077492,114.922678 L455.921165,114.922678 C466.704567,114.922678 475.048048,117.814799 480.95161,123.59904 C486.852187,129.383577 489.802476,137.915414 489.802476,149.194551 L489.802476,274.786564 L525,274.786564 L525,147.242581 C525,124.97306 519.279992,108.198583 507.839976,96.9191497 C496.39996,85.6397166 479.312163,80 456.576586,80 L137.640097,80 C114.760065,80 97.6000404,85.6035854 86.1600243,96.8107562 C74.7200081,108.017631 69,124.828239 69,147.242581 L69,366.757508 C69,389.171554 74.7200081,405.982162 86.1600243,417.189333 C97.6000404,428.396444 114.760065,434 137.640097,434 Z M350.260627,536 L563.957529,536 C586.565634,536 603.558072,530.361193 614.934843,519.083579 C626.311614,507.805994 632,491.03419 632,468.768165 L632,328.232181 C632,305.821454 626.311614,289.013409 614.934843,277.808045 C603.558072,266.602682 586.565634,261 563.957529,261 L350.260627,261 C327.507085,261 310.441928,266.602682 299.065157,277.808045 C287.688386,289.013409 282,305.821454 282,328.232181 L282,468.768165 C282,491.17878 287.688386,507.98671 299.065157,519.191955 C310.441928,530.397318 327.507085,536 350.260627,536 Z M241.533042,172.317861 C241.093458,168.947919 239.042267,166.090925 235.379469,163.746878 C231.716672,161.402532 227.760868,162.428127 223.512059,166.823664 L199.117862,190.997769 L163.295538,154.955804 C160.658335,152.318601 157.435121,151 153.625896,151 C149.81637,151 146.593006,152.318601 143.955804,154.955804 C141.318601,157.593006 140,160.81637 140,164.625896 C140,168.435121 141.318601,171.658335 143.955804,174.295538 L179.997769,210.117862 L155.823214,234.512059 C151.427977,238.760868 150.402382,242.716672 152.746428,246.379469 C155.090775,250.042267 157.947769,252.093458 161.317411,252.533042 L240.654024,264.840186 C244.46325,265.426198 247.833042,264.400602 250.7634,261.7634 C253.400602,258.833042 254.426198,255.46325 253.840186,251.654024 L241.533042,172.317861 Z" fill="#FFFFFF" fill-rule="nonzero"/>
    </svg>`;

  async function togglePiP() {
    const video = document.querySelector("video");
    if (!video) return;

    try {
      // Check if already in PiP mode
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
        return;
      }

      // Safari: check webkit presentation mode
      if (video.webkitPresentationMode === "picture-in-picture") {
        video.webkitSetPresentationMode("inline");
        return;
      }

      // Standard API (Chrome/Firefox/Edge)
      if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
      }
      // Safari fallback
      else if (video.webkitSetPresentationMode) {
        video.webkitSetPresentationMode("picture-in-picture");
      }
    } catch (error) {
      console.error("PiPifier: Failed to toggle PiP mode", error);
    }
  }

  function shouldAddButton() {
    return (
      document.querySelector(".ytp-right-controls") !== null &&
      document.querySelector(".PiPifierButton") === null
    );
  }

  function addYouTubeButton() {
    if (!shouldAddButton()) return;

    const controls = document.querySelector(".ytp-right-controls");
    if (!controls) return;

    const button = document.createElement("button");
    button.className = "ytp-button PiPifierButton";
    button.title = "Picture-in-Picture (PiPifier)";
    button.innerHTML = PIP_ICON_SVG;
    button.style.cssText =
      "width: 48px; height: 100%; padding: 0; opacity: 0.9; display: flex; align-items: center; justify-content: center;";
    button.addEventListener("click", togglePiP);

    controls.appendChild(button);
  }

  function init() {
    addYouTubeButton();

    // Observe DOM changes for YouTube SPA navigation
    const observer = new MutationObserver(() => {
      if (shouldAddButton()) {
        addYouTubeButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
