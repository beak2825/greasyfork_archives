// ==UserScript==
// @name        Tylko Mirko
// @namespace   http://www.wykop.pl/*
// @description Wykop wolny od głównej! #tylkomirko
// @include     http://www.wykop.pl/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6318/Tylko%20Mirko.user.js
// @updateURL https://update.greasyfork.org/scripts/6318/Tylko%20Mirko.meta.js
// ==/UserScript==

// Autoredirect
if( location.href == "http://www.wykop.pl/" || location.href == "http://wykop.pl/" )
  location.href = "http://www.wykop.pl/mikroblog/";

// Fix main navigation
$(".mainnav .icon.wykop-logo").removeClass('wykop-logo').addClass('microblog-logo')
$(".mainnav .icon.microblog-logo").parent().attr("href", "http://wykop.pl/mikroblog/");

$(".mainnav li")[2].remove();
$(".mainnav li")[2].remove();

// Remove #głownacwel from user profile
$(".link.iC").remove();
$(".m-make-block.m-reset-padding")[1].remove();

