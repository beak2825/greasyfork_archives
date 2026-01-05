// ==UserScript==
// @name        Stop JScipt Alerts
// @namespace   PXgamer
// @include     http*://kickass.to/*
// @include     *kat.cr/*
// @version     1.2
// @grant       none
// @description KAT JScript disabler
// @downloadURL https://update.greasyfork.org/scripts/8342/Stop%20JScipt%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/8342/Stop%20JScipt%20Alerts.meta.js
// ==/UserScript==
 
unsafeWindow.alert=function() {};