// ==UserScript==
// @name         Tweakers.net - Font size +30%
// @namespace    https://tweakers.net/
// @version      1.0.1
// @description  Raises base font size by 30% across Tweakers.net
// @match        https://tweakers.net/*
// @match        https://www.tweakers.net/*
// @run-at       document-start
// @license      mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564047/Tweakersnet%20-%20Font%20size%20%2B30%25.user.js
// @updateURL https://update.greasyfork.org/scripts/564047/Tweakersnet%20-%20Font%20size%20%2B30%25.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STYLE_ID = "tm-tweakers-fontsize-140";
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* Scale the site typographic base */
    html { font-size: 140% !important; }
  `;

  // Prefer <head>, but fall back if it isn't available yet.
  (document.head || document.documentElement).appendChild(style);
})();
