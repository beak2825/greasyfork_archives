// ==UserScript==
// @name         Online xpath tester add removal
// @version      1.2
// @description  Automatically removes adds on page
// @author       aurycl
// @include      https://codebeautify.org/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1529244
// @downloadURL https://update.greasyfork.org/scripts/553287/Online%20xpath%20tester%20add%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/553287/Online%20xpath%20tester%20add%20removal.meta.js
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

addGlobalStyle('.navbar, .headerEditorContainer, .adsense, .infoSection, .footerpart, .xpathMainContainer .xpathMainContainer .xpathLeftContainer, .mainInputSectionDiv, .permalinkButtonDiv, .container-fluid, .adsbygoogle { display:none!important; }');
addGlobalStyle('span[class*="banner"], div[class*="footer"] {  display:none!important;}');
addGlobalStyle('span[class*="ezoic"] {  display:none!important;}');
addGlobalStyle('div[id*="codebeautify"] {  display:none!important;}');
addGlobalStyle('.form-wrapper textarea {  margin-bottom:20px!important;}');