// ==UserScript==
// @name         Freeformatter.com xpath tester add removal
// @version      1.0.2
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

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle('.vertical-menu, .footer, .output-btn-wrapper, .before-output, .GoogleActiveViewInnerContainer, .mys-wrapper, .adsbygoogle, .adsbygoogle, .adsbygoogle-noablate, .before-output-wrapper, .output-title, .GoogleActiveViewElement  {  display:none!important;}');
addGlobalStyle('#page-topbar, #formatNewWindowBtn, #mys-wrapper, #adsbygoogle, #banner__border, #ad_position_box, #google_esf, #mys-meta {  display:none!important;}');
addGlobalStyle('span[class*="banner"] {  display:none!important;}');
addGlobalStyle('span[class*="ezoic"] {  display:none!important;}');
addGlobalStyle('[class*="ad" i], [id*="ad" i] { display: none !important; }');
addGlobalStyle('[class*="google" i], [id*="google" i] { display: none !important; }');
addGlobalStyle('[class*="aswift" i], [id*="aswift" i] { display: none !important; }');

addGlobalStyle('body[data-layout-size=boxed] #layout-wrapper { max-width: unset;}');
addGlobalStyle('.main-content { margin-left: 0px;}');

addGlobalStyle('.col-lg-12 { display: flex;}');
addGlobalStyle('.mb-2 { min-width: 70%;}');
addGlobalStyle('.mb-3 { min-width: 29%; margin-left: 20px;}');

addGlobalStyle('.page-content { padding: 5px;}');



addGlobalStyle('.row:has(> .col-md-6) { ;}');

addGlobalStyle('.row:has(> div > div > h1), .row:has(> div > div > div > h3), .row:has(> div > div > div > label), .row:has(> div > p) { display:none!important}');

addGlobalStyle('.col-md-4:has(> .form-switch) {display:none!important;}');

addGlobalStyle('.col-md-7:has(> div > input) {width: 100%;}');

addGlobalStyle('textarea.form-control {min-height: 500px;}');

addGlobalStyle('div.output-wrapper {height: 90vh;}');

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

