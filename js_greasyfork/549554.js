// ==UserScript==
// @name         RDS3 Assistant - Faculty Initial + Time
// @namespace    https://northsouth.app/
// @version      2.2
// @description  Show time/faculty, enhance search, remove courses by prefix, Update data to rds2.northsouth.app
// @author       Nihal, Rayed & Walid - NSU CTRL ALT DELETE (NSU - CSE231)
// @match        https://rds3.northsouth.edu/*
// @match        https://rds3.northsouth.edu/students/*
// @match        https://rds3.northsouth.edu/students/advising*
// @match        https://rds3.northsouth.edu/index.php/students/advising
// @icon         https://rds3.northsouth.edu/assets/img/favicon.png
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549554/RDS3%20Assistant%20-%20Faculty%20Initial%20%2B%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/549554/RDS3%20Assistant%20-%20Faculty%20Initial%20%2B%20Time.meta.js
// ==/UserScript==

// Function to show advising is over
function showAdvisingOver() {
	console.log('Advising for Fall 2025 is over. Thanks for your contribution!');
}

// Execute automatically as Tampermonkey userscript
(function() {
	showAdvisingOver();
})();
