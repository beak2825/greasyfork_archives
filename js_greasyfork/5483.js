// ==UserScript==
// @name         Page Background Grey
// @version      0.1
// @description  (mTurk) Changes the page background from white to grey
// @author       Magnilucent
// @match        https://www.mturk.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/5181
// @downloadURL https://update.greasyfork.org/scripts/5483/Page%20Background%20Grey.user.js
// @updateURL https://update.greasyfork.org/scripts/5483/Page%20Background%20Grey.meta.js
// ==/UserScript==

GM_addStyle("body { background-color: grey !important; }");