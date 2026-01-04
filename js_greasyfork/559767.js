// ==UserScript==
// @name        no auto update
// @namespace   Violentmonkey Scripts
// @match       https://soyjak.st/*/thread/*
// @license      CC BY-NC-SA 4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @grant       none
// @version     1.0
// @author      -
// @description 05/10/2025, 11:14:26
// @downloadURL https://update.greasyfork.org/scripts/559767/no%20auto%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/559767/no%20auto%20update.meta.js
// ==/UserScript==

myInterval = setInterval(function () {
  var el = document.getElementById("auto_update_status")
  if (!el) {
    return
  }
  el.checked = false
  clearInterval(myInterval)
}, 1000)
