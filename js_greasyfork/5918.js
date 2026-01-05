// ==UserScript==
// @name         (mTurk) Show captcha and accept button ASAP
// @namespace    http://ericfraze.com
// @version      0.2
// @description  (mTurk) Shows the captcha and accept buttons on hits ASAP instead of waiting for the page to fully load.
// @author       Eric Fraze
// @match        https://www.mturk.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/5918/%28mTurk%29%20Show%20captcha%20and%20accept%20button%20ASAP.user.js
// @updateURL https://update.greasyfork.org/scripts/5918/%28mTurk%29%20Show%20captcha%20and%20accept%20button%20ASAP.meta.js
// ==/UserScript==

// Proprietary GreaseMonkey function to add a style element to the page.
GM_addStyle("#javascriptDependentFunctionality { display: block !important; }");