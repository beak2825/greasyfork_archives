// ==UserScript==
// @name Reload Claimer (10 minutes) V1
// @description Reload Claimer for stake.com
// @version 1.11
// @match stake.com/*
// @match stake.com/de?tab=rewards&modal=claimReload
// @match https://stake.com/de?tab=rewards&modal=claimReload
// @run-at document-idle
// @namespace https://greasyfork.org/users/1523046
// @downloadURL https://update.greasyfork.org/scripts/551812/Reload%20Claimer%20%2810%20minutes%29%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/551812/Reload%20Claimer%20%2810%20minutes%29%20V1.meta.js
// ==/UserScript==

setInterval(function()
{
window.location.replace("https://stake.com/de?tab=rewards&modal=claimReload")
}, 25000)

setInterval(function()
{
document.querySelectorAll
("button[type='submit']")[0].click()
}, 1500)
