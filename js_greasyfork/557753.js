// ==UserScript==
// @name         Google Link Color Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change all Google links to #ec9f19
// @match        *://www.google.com/*
// @match        *://google.com/*
// @match        *://*.google.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557753/Google%20Link%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/557753/Google%20Link%20Color%20Changer.meta.js
// ==/UserScript==

GM_addStyle(`
    /* 모든 링크 색상 변경 */
    a {
        color: #ec9f19 !important;
    }

    /* 방문한 링크 색상도 동일하게 */
    a:visited {
        color: #ec9f19 !important;
    }
`);
