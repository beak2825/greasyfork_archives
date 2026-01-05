// ==UserScript==
// @name           Reddit - Hide sidebar 
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description	   Autohides Reddit sidebar and adds a button to toggle view
//
// @include        http://*.reddit.com/*
// @include        https://*.reddit.com/*
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant none 
//
// @version		   0.0.4
// @downloadURL https://update.greasyfork.org/scripts/7307/Reddit%20-%20Hide%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/7307/Reddit%20-%20Hide%20sidebar.meta.js
// ==/UserScript==

$.noConflict();
jQuery( document ).ready(function( $ ) {
  $(".tabmenu").append($('<li>', {html: '<a href="#">sidebar</a>'}).click(function(){$(".side").toggle()}));
  $(".side").toggle();
});