// ==UserScript==
// @name         Disable EdibleTools' colorful additions to the Guild Members table
// @namespace    http://tampermonkey.net/
// @version      2025-11-11
// @description  For Lurpa
// @author       sentienmilk
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555520/Disable%20EdibleTools%27%20colorful%20additions%20to%20the%20Guild%20Members%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/555520/Disable%20EdibleTools%27%20colorful%20additions%20to%20the%20Guild%20Members%20table.meta.js
// ==/UserScript==

(function() {
	document.body.insertAdjacentHTML("beforeend", `<style>.GuildPanel_membersTable__1NwIX td div[style^="color"] { display: none; }</style>`)
})();
