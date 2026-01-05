// ==UserScript==
// @name        Ubuntu-it Quote Fixer
// @namespace   forum.ubuntu-it.org
// @include     http://forum.ubuntu-it.org/*
// @version     1.1
// @description Bugfix for ubuntu-it forum quotes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8003/Ubuntu-it%20Quote%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/8003/Ubuntu-it%20Quote%20Fixer.meta.js
// ==/UserScript==

var $msg = $('#message');
$msg.val( $msg.val().replace(/\[quote="([^ ]+) ([^\]]+\])\[img[^\[]+\[\/img\]\[\/url\]"\]/g,'[quote="$2$1[/url]"]') );