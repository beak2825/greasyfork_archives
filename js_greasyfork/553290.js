// ==UserScript==
// @name         Compile c# online override
// @version      1.1
// @description  Automatically removes adds on page
// @match        https://rextester.com
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1529244
// @downloadURL https://update.greasyfork.org/scripts/553290/Compile%20c%20online%20override.user.js
// @updateURL https://update.greasyfork.org/scripts/553290/Compile%20c%20online%20override.meta.js
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

addGlobalStyle('bodys { background-color: #ffffff!important; }');
addGlobalStyle('div[id^="google_ads_iframe_"] { display:none!important; width: 0px!important; padding-top: 0px!important;}');