// ==UserScript==
// @name         Internet Roadtrip Fractional Odometer
// @namespace    https://github.com/MinecraftFan69420
// @match        https://neal.fun/internet-roadtrip/*
// @version      0.31
// @description  Adds hundredths of mi/km to the odometer display of Internet Roadtrip
// @run-at       document-idle
// @grant        GM.addStyle
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @esversion    11
// @downloadURL https://update.greasyfork.org/scripts/564145/Internet%20Roadtrip%20Fractional%20Odometer.user.js
// @updateURL https://update.greasyfork.org/scripts/564145/Internet%20Roadtrip%20Fractional%20Odometer.meta.js
// ==/UserScript==

/* globals IRF */

(async function() {
    "use strict";

    if (!IRF?.isInternetRoadtrip) return;

    // ---------------- CSS ----------------
    GM.addStyle(`
      img.coffee[src="/internet-roadtrip/coffee.png"] {
        position: relative !important;
        left: -12px !important;
      }

      /* Expand container safely */
      .odometer-container {
          position: relative;
          /* Add room on the right for Mi + fractional */
          padding-right: 26px;
          /* Add room on bottom for fractional */
          padding-bottom: 10px;
          /* Allow container to grow as needed */
          height: auto !important;
          /* Keep original left alignment of digits */
          display: flex;
          align-items: flex-end;
      }
        
      
      /* Keep miles-text in layout, but visually move it up-right */
      .odometer-container .miles-text {
          margin-left: 6px;              /* spacing away from digits */
          transform: translateY(-8px);   /* lift up */
          font-family: Roboto, sans-serif;
          font-weight: 500;
          font-size: 12px;
          opacity: 0.9;
          pointer-events: none;
      }

      /* Fraction bottom-right */
      
      .fractional-overlay {
          position: absolute;
          bottom: 0px;
          right: 6px;
          font-family: Roboto, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #fff;
          opacity: 0.9;
          pointer-events: none;
      }
    `);

    const odometer = await IRF.vdom.odometer;

    let fracEl = null;

    function updateFraction() {
        const miles = odometer?.props?.miles;
        const kilometerMode = odometer?.data?.isKilometers
        const factor = (typeof odometer?.data?.conversionFactor === "number")
        ? odometer.data.conversionFactor : 1.609344;

        const displayedDist = kilometerMode ? miles * factor : miles;

        if (typeof miles !== "number") return;

        const whole = Math.floor(displayedDist);
        const fractional = (displayedDist - whole).toFixed(2).substring(1);  // ".45"

        const container = document.querySelector(".odometer-container");
        if (!container) return;

        // Create the overlay once
        if (!fracEl) {
            fracEl = document.createElement("div");
            fracEl.className = "fractional-overlay";
            container.appendChild(fracEl);
        }

        fracEl.textContent = fractional;   // update overlay
    }

    // Hook odometer update
    const original = odometer.methods.updateDisplay;

    odometer.state.updateDisplay = new Proxy(original, {
        apply(target, thisArg, args) {
            const result = Reflect.apply(target, thisArg, args);
            updateFraction();
            return result;
        }
    });

    // Initial run
    setTimeout(updateFraction, 300);

})();
