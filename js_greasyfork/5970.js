// ==UserScript==
// @name        Simple Youtube HTML5 enabler
// @author      Gerhard Sliwa
// @description This scipt (simple) enables html5 on youtube by adding &html5=1 to the url. It takes no options.
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @grant       none
// @version     141023
// 
// @namespace https://greasyfork.org/users/6280
// @downloadURL https://update.greasyfork.org/scripts/5970/Simple%20Youtube%20HTML5%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/5970/Simple%20Youtube%20HTML5%20enabler.meta.js
// ==/UserScript==
var url = location.href;
var n = url.indexOf('html5');
var m = url.indexOf('user');
var o = url.indexOf('channel');
if (n == -1 && m == -1 && o == -1)
  location.href = url + '&html5=1'