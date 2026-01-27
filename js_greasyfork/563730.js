// ==UserScript==
// @name         Freeformatter.com xpath tester add removal
// @version      1.0.3
// @description  Automatically removes adds on page
// @author       aurycl
// @include      https://www.freeformatter.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1529244
// @downloadURL https://update.greasyfork.org/scripts/563730/Freeformattercom%20xpath%20tester%20add%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/563730/Freeformattercom%20xpath%20tester%20add%20removal.meta.js
// ==/UserScript==

GM_addStyle(`
  .vertical-menu, .footer, .output-btn-wrapper, .before-output, .GoogleActiveViewInnerContainer,
  .mys-wrapper, .adsbygoogle, .adsbygoogle-noablate, .before-output-wrapper, .output-title,
  .GoogleActiveViewElement { display:none!important; }

  #page-topbar, #formatNewWindowBtn, #mys-wrapper, #adsbygoogle, #banner__border, #ad_position_box,
  #google_esf, #mys-meta { display:none!important; }

  [class*="banner" i], [id*="banner" i],
  [class*="ezoic" i],  [id*="ezoic" i],
  [class*="aswift" i], [id*="aswift" i] { display:none!important; }

  /* atsargiai su šitais - jie per platūs, bet jei tau ok, palik */
  [class*="ad" i], [id*="ad" i],
  [class*="google" i], [id*="google" i] { display:none!important; }

  body[data-layout-size=boxed] #layout-wrapper { max-width: unset; }
  .main-content { margin-left: 0px; }

  .col-lg-12 { display: flex; }
  .mb-2 { min-width: 70%; }
  .mb-3 { min-width: 29%; margin-left: 20px; }
  .page-content { padding: 5px; }

  .row:has(> div > div > h1),
  .row:has(> div > div > div > h3),
  .row:has(> div > div > div > label),
  .row:has(> div > p) { display:none!important; }

  .col-md-4:has(> .form-switch) { display:none!important; }
  .col-md-7:has(> div > input) { width: 100%; }
  textarea.form-control { min-height: 500px; }
  div.output-wrapper { height: 90vh; }
`);

(function () {
  function apply() {
    const el = document.querySelector('#includeItemType');
    if (!el) return;

    el.checked = false;
    el.value = "false";
  }

  apply();
  setInterval(apply, 1000); // brutalu, bet veikia
})();

