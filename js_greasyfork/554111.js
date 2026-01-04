// ==UserScript==
// @name         auto claim reload stake.com (perfect for 10min) (updated 10.2025 by dxzakuty)
// @description  auto claimer for reloads on stake, perfect for boring 10 minutes clicker simulator
// @version      v0.01b 2025.10.29
// @match        https://stake.com/*
// @match        https://stake.com/?tab=rewards&modal=claimReload&currency=*
// @match        https://stake.com/?tab=reload&modal=vip&currency=*
// @run-at       document-idle
// @namespace    https://greasyfork.org/pl/users/1532005
// @downloadURL https://update.greasyfork.org/scripts/554111/auto%20claim%20reload%20stakecom%20%28perfect%20for%2010min%29%20%28updated%20102025%20by%20dxzakuty%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554111/auto%20claim%20reload%20stakecom%20%28perfect%20for%2010min%29%20%28updated%20102025%20by%20dxzakuty%29.meta.js
// ==/UserScript==   

setInterval(function() {
  window.location.replace("https://stake.com/?tab=rewards&modal=claimReload&currency=xrp")
}, 25000)

setInterval(function() {
document.querySelectorAll("button[type='submit']")[0].click()
}, 1500)