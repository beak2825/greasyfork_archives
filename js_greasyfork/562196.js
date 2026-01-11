// ==UserScript==
// @name         IITB Moodle Dark Mode
// @namespace    https://moodle.iitb.ac.in/
// @match        https://moodle.iitb.ac.in/*
// @exclude      https://moodle.iitb.ac.in/login*
// @run-at       document-start
// @grant        none
// @version      1.0
// @author       Aayush Borkar
// @description  Ensure that Moodle is set to dark mode after a login
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562196/IITB%20Moodle%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562196/IITB%20Moodle%20Dark%20Mode.meta.js
// ==/UserScript==


(function () {
    try {
        const key = "nighteyewState";

        if (!localStorage.hasOwnProperty(key)) {
            localStorage.setItem(key, "1");
        }
    } catch (e) {
        // Fail silently if localStorage is inaccessible
        console.error("NightEye userscript error:", e);
    }
})();
