// ==UserScript==
// @name        CtgoFx
// @author      Itsuki
// @version     0.5
// @match       *://chatango.com/*
// @match       *://*.chatango.com/
// @description Remove ads and white spaces.
// @license     WTFPL
// @namespace   https://greasyfork.org/en/users/6316-itsuki
// @homepageURL https://greasyfork.org/en/scripts/6004-ctgofx
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6004/CtgoFx.user.js
// @updateURL https://update.greasyfork.org/scripts/6004/CtgoFx.meta.js
// ==/UserScript==
("use strict");

const selectors = [
  "col",
  "colgroup",
  "embed",
  "#ad",
  "#ad_placeholder_td",
  "#ad_wrapper",
  "#buyers_ad",
  "#bottom_table",
  "body [name*='google_ads_frame1']",
  "body [name*='google_ads_frame2']",
  "#left_container [href*='ad']",
  ".topad",
];

(function removeElement() {
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((elemento) => elemento.remove());
  });
})();
