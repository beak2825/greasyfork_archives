// ==UserScript==
// @name       Facebook Logout Button
// @namespace  https://greasyfork.org/de/scripts/6745/
// @version    1.1.0
// @description  logout button on facebook in the navbar
// @include        http*://facebook.com/*
// @include        http*://*.facebook.com/*
// @include        http*://*.facebook.tld/*
// @include        http*://facebook.tld/*
// @grant          none
// @copyright      Srendo
// @downloadURL https://update.greasyfork.org/scripts/6745/Facebook%20Logout%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/6745/Facebook%20Logout%20Button.meta.js
// ==/UserScript==
//var y = document.getElementByClassName("_2exj clearfix");
var y = document.getElementsByTagName("ul");
y[0].innerHTML +='<li id="my_logout_button" class="_2pdh _3zm- _55bj _55bh"><a href="#" class="_1ayn" rel="toggle">Logout</a></li>'

var x = document.getElementById("my_logout_button");
var t = x.getElementsByTagName("a")[0];
t.setAttribute('href','#');
t.setAttribute('onclick','javascript:document.getElementById(\'logout_form\').submit();');