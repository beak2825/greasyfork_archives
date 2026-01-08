// ==UserScript==
// @name Stake.ac Auto Reload Claimer (10 minutes) V1
// @description 10 minutes Reload Claimer for stake.com
// @writer Sanja93z
// @license Sanja93z
// @version 28.05.2025 V1
// @match https://stake.ac/*
// @match https://stake.ac/?tab=rewards&modal=claimReload
// @match https://stake.ac/?tab=rewards&modal=claimReload
// @run-at document-idle
// @namespace https://greasyfork.org/de/users/1475718-sanja93z
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/561847/Stakeac%20Auto%20Reload%20Claimer%20%2810%20minutes%29%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/561847/Stakeac%20Auto%20Reload%20Claimer%20%2810%20minutes%29%20V1.meta.js
// ==/UserScript==

setInterval(function() 
{
window.location.replace("https://stake.ac/?tab=rewards&modal=claimReload")
}, 25000)

setInterval(function() 
{
document.querySelectorAll
("button[type='submit']")[0].click()
}, 1500)


