// ==UserScript==
// @name        Focus true
// @description Trick JavaScript into thinking the document is focused
// @namespace   hugsmile.eu
// @include     http://*
// @include     https://*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7871/Focus%20true.user.js
// @updateURL https://update.greasyfork.org/scripts/7871/Focus%20true.meta.js
// ==/UserScript==
document.hasFocus = function () {return true;};