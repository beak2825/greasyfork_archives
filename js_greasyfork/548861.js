// ==UserScript==
// @name         Deepco Quick Upgrade Button Toggle
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes DC Quick Upgrade Button
// @author       Zoltan
// @match        https://deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548861/Deepco%20Quick%20Upgrade%20Button%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/548861/Deepco%20Quick%20Upgrade%20Button%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

	document.querySelector("#auto-upgrade-header").remove();


})();