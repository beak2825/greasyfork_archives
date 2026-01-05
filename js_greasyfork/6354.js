// ==UserScript==
// @name          WME Place Update Fix
// @version       0.0.2 (Beta)
// @namespace     http://greasyfork.org
// @description	  Prevents Place Update Screen from extending below visible area. Adds scrollbar to allow access to extra content.
// @author        SeekingSerenity
// @website       https://greasyfork.org/en/scripts/6354-wme-places-fix
// @include       https://www.waze.com/editor/*
// @include       https://www.waze.com/*/editor/*
// @include       https://editor-beta.waze.com/*
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/6354/WME%20Place%20Update%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/6354/WME%20Place%20Update%20Fix.meta.js
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

addGlobalStyle('.place-update-edit .body {max-height:70vh !important; overflow-y:scroll !important;}');
addGlobalStyle('.panel.place-update-edit .image-preview, .panel.place-update-edit .missing-image {margin-top:5px !important;}');
addGlobalStyle('.panel .header {line-height:32px !important;}');
addGlobalStyle('.panel.place-update-edit .request-details, .panel.place-update-edit .changes, .panel.place-update-edit .navigation {padding:5px 15px 15px !important;}');
addGlobalStyle('.panel.place-update-edit .actions {padding: 5px 15px 5px !important;}');
