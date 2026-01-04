// ==UserScript==
// @name         torn.com Remove all styling on torn.com
// @namespace    xentac
// @version      20251025.2
// @description  torn.com So we can
// @author       xentac [3354782]
// @match        https://www.torn.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553622/torncom%20Remove%20all%20styling%20on%20torncom.user.js
// @updateURL https://update.greasyfork.org/scripts/553622/torncom%20Remove%20all%20styling%20on%20torncom.meta.js
// ==/UserScript==

"use strict";

function removeStyling() {
  document
    .querySelectorAll('style, link[rel="stylesheet"]')
    .forEach((e) => e.remove());
  document
    .querySelectorAll("[style]")
    .forEach((e) => e.removeAttribute("style"));
}

function react(mutation) {
  mutation.addedNodes.forEach(removeStyling);
}

function reactAll(mutations) {
  mutations.forEach(react);
}

(function () {
  const target = document;
  removeStyling();
  const observer = new MutationObserver(reactAll);
  observer.observe(target, { childList: true, subtree: true });
  //observer.disconnect();
})();
