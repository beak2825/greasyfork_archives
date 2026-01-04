// ==UserScript==
// @name        WaniKani better primary reading highlight
// @description Makes primary kanji readings more visible
// @namespace   yakujin
// @include     https://www.wanikani.com/*
// @version     1.0
// @author      yakujin
// @license     public domain
// @run-at      document-idle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559033/WaniKani%20better%20primary%20reading%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/559033/WaniKani%20better%20primary%20reading%20highlight.meta.js
// ==/UserScript==
"use strict";
(() => {
    const style = unsafeWindow.document.createElement('style');
    style.innerHTML = `
    .subject-readings__reading--primary > h3 {
        color: #060;
    }
    .subject-readings__reading--primary > h3::after {
        position: absolute;
	    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="16" height="16"><path fill="%23060" d="M7.7 404.606s115.2 129.7 138.2 182.68h99c41.5-126.7 202.7-429.1 340.92-535.1 28.6-36.8-43.3-52-101.35-27.62-87.5 36.7-252.5 317.2-283.3 384.64-43.7 11.5-89.8-73.7-89.84-73.7z"/></svg>');
	    margin-left: 5px;
    }
    .subject-readings__reading--primary {
        color: #181;
    }`;
    unsafeWindow.document.head.append(style);
})();
