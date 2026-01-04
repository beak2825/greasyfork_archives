// ==UserScript==
// @name         ShutTheF*CKUP
// @namespace    http://tampermonkey.net/
// @version      2025-10-03
// @description  Stop EnglishAccentCoach from asking for microphone permission
// @author       DVDCJW
// @match        https://www.englishaccentcoach.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551500/ShutTheF%2ACKUP.user.js
// @updateURL https://update.greasyfork.org/scripts/551500/ShutTheF%2ACKUP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() { /* disabled */ };
})();