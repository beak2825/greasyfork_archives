// ==UserScript==
// @name        Uploads List Adder
// @namespace   PXgamer
// @description Adds uploads list button to the sidebar of each torrent
// @include     http://localhost:999/kat/upload
// @include     *kickass.to/*
// @include     *kat.cr/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9848/Uploads%20List%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/9848/Uploads%20List%20Adder.meta.js
// ==/UserScript==

var me = $('.usernameProfile.menuItem').html();
console.log(me);
var user = $('div.font11px:nth-child(9) > span:nth-child(1) > span:nth-child(2) > a:nth-child(1)').html();

if (user == me) {}
else {
  $('#torrentControl > li:nth-child(9)').before('<li><a href="/user/'+user+'/uploads/"><i class="ka ka16 ka-torrent"></i> uploads</a></li>');
}