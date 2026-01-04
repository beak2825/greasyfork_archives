// ==UserScript==
// @name         racing-car
// @namespace    seintz.torn.racing-car
// @version      1.1.1
// @author       seintz [2460991]
// @description  auto select cars based on track
// @license      GPL-3.0-or-later
// @source       https://update.greasyfork.org/scripts/552781/racing-car.user.js
// @match        https://www.torn.com/page.php?sid=racing*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552781/racing-car.user.js
// @updateURL https://update.greasyfork.org/scripts/552781/racing-car.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const cars = {
    R8_DS3: { name: "R8", "Top Speed": "242", type: "dirt", ratio: "short", turbo: 3 },
    GT_TL3: { name: "GT", "Top Speed": "252", type: "tarmac", ratio: "long", turbo: 3 },
    NSX_DS2: { name: "NSX", "Top Speed": "239", type: "dirt", ratio: "short", turbo: 2 },
    NSX_TS2: { name: "NSX", "Top Speed": "239", type: "tarmac", ratio: "short", turbo: 2 },
    NSX_TS3: { name: "NSX", "Top Speed": "242", type: "tarmac", ratio: "short", turbo: 3 },
    LFA_TL3: { name: "LFA", "Top Speed": "260", type: "tarmac", ratio: "long", turbo: 3 },
    SLR_TL3: { name: "SLR", "Top Speed": "260", type: "tarmac", ratio: "long", turbo: 3 },
    COL_DS3: { name: "Colina", "Top Speed": "225", type: "dirt", ratio: "short", turbo: 3 }
  };
  const carTrackMaps = {
    "Stone Park": cars.R8_DS3,
    Docks: cars.GT_TL3,
    "Two Islands": cars.NSX_DS2,
    Hammerhead: cars.NSX_DS2,
    Parkland: cars.NSX_DS2,
    Underdog: cars.NSX_TS2,
    Commerce: cars.NSX_TS2,
    Sewage: cars.NSX_TS2,
    Industrial: cars.NSX_TS3,
    Vector: cars.NSX_TS3,
    Meltdown: cars.NSX_TS3,
    Uptown: cars.LFA_TL3,
    Withdrawal: cars.LFA_TL3,
    Speedway: cars.LFA_TL3,
    Convict: cars.SLR_TL3,
    Mudpit: cars.COL_DS3
  };
  function waitForElement(callback, waitElement, looper = false) {
    const element = document == null ? void 0 : document.querySelector(waitElement);
    if (element) {
      callback(element);
      if (!looper) return;
    }
    let elemFound = false;
    const obs2 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        var _a;
        if (elemFound) return;
        const mutAddedNodes = Array.from(mutation.addedNodes);
        for (const mutNode of mutAddedNodes) {
          if (!(mutNode == null ? void 0 : mutNode.querySelector)) continue;
          const elem = mutNode == null ? void 0 : mutNode.querySelector(waitElement);
          const parElem = (_a = mutNode == null ? void 0 : mutNode.parentElement) == null ? void 0 : _a.querySelector(waitElement);
          const element2 = elem ? elem : parElem ? parElem : false;
          if (!element2) continue;
          callback(element2);
          if (!looper) {
            elemFound = true;
            obs2.disconnect();
            break;
          }
        }
      });
    });
    obs2.observe(document.documentElement, { childList: true, subtree: true });
  }
  function scrubText(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
  }
  function filterCars(node) {
    var _a;
    const racetrackElem = node.querySelector("div.enlist div.enlisted-btn-wrap");
    if (!racetrackElem) return;
    const racetrack = ((_a = racetrackElem.innerText) == null ? void 0 : _a.split(" - ")[0].trim()) ?? "";
    const desiredCar = carTrackMaps[racetrack];
    if (!desiredCar) return;
    const carListElem = document.querySelector("ul.enlist-list");
    if (!carListElem) return;
    const carList = carListElem.children;
    const desiredScrubbed = scrubText(desiredCar.name);
    const desiredSpeed = +desiredCar["Top Speed"];
    Array.from(carList).forEach((carElem) => {
      var _a2, _b;
      const car = carElem;
      const carNameElem = car.querySelector("div.info-content span.model span.bold");
      const carName = ((_a2 = carNameElem == null ? void 0 : carNameElem.textContent) == null ? void 0 : _a2.trim()) ?? "";
      const carScrubbed = scrubText(carName);
      car.style.display = "none";
      if (!carScrubbed.includes(desiredScrubbed)) return;
      const carStatsElem = car.querySelector("ul.enlisted-stat");
      if (!carStatsElem) return;
      const speedElem = Array.from(carStatsElem.children).find((li) => /Top Speed/i.test(li.textContent ?? ""));
      const carSpeedMatch = speedElem ? +((_b = speedElem.textContent.match(/\d+/)) == null ? void 0 : _b[0]) : NaN;
      const show = !isNaN(carSpeedMatch) && carSpeedMatch === desiredSpeed;
      if (show) car.style.display = "";
    });
  }
  const obs = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        const raceNode = node instanceof HTMLElement && node.matches("div.enlist-wrap.enlisted-wrap");
        if (raceNode) filterCars(node);
      }
    }
  });
  const startObs = (node) => obs.observe(node, { childList: true });
  waitForElement(startObs, "#racingAdditionalContainer");

})();