// ==UserScript==
// @name   Test in removing text script
// @author Dormammu
// @version    4.0
// @description helps with hits
// @match       http://www.mturkgrind.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6930/Test%20in%20removing%20text%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6930/Test%20in%20removing%20text%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
var link = $('a').attr('href');
// this is the href to replace
var equalPosition = link.indexOf('forums/4-Awesome-HITS');

var sptext= link.substring(equalPosition + 1); 
// text to replace
var s=link.replace(sptext,"lololol");

 $('a').attr('href', s);

  });