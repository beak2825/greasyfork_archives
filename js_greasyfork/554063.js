// ==UserScript==
// @name        Stop Anti-Adblock TVTropes
// @namespace   StopAnti-AdblockTVTropes
// @match       https://tvtropes.org/*
// @grant       none
// @version     1.0
// @icon        https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @license     MIT
// @author      Vevinenx
// @description Attempts to stop anti-adblock from removing article content and adding anti-adblock message by overwriting certain attributes.
// @downloadURL https://update.greasyfork.org/scripts/554063/Stop%20Anti-Adblock%20TVTropes.user.js
// @updateURL https://update.greasyfork.org/scripts/554063/Stop%20Anti-Adblock%20TVTropes.meta.js
// ==/UserScript==

const mainEntryInterval = setInterval(() => {
  const mainEntry = document.getElementById("main-entry");
  if (mainEntry) {
    Object.defineProperties(mainEntry, {
      parentNode: {
        set: () => 0,
        get: () => undefined,
      }
    });
    console.log("[Stop Anti-Adblock TVTropes]: (#main-entry).parentNode altered");
    clearInterval(mainEntryInterval);
  }
}, 1);

const mainContentInterval = setInterval(() => {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    Object.defineProperties(mainContent, {
      appendChild: {
        set: () => 0,
        get: () => () => 0,
      }
    });
    console.log("[Stop Anti-Adblock TVTropes]: (#main-content).appendChild altered");
    clearInterval(mainContentInterval);
  }
}, 1);