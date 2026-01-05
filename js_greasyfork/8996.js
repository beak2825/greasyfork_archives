// ==UserScript==
// @name        vivo.sx Redirector
// @namespace   cndymn
// @include     http://vivo.sx/*
// @include     http://www.vivo.sx/*
// @include     http://static.vivo.sx/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @version     1
// @description This script skips the countdown and redirects directly to stream.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8996/vivosx%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/8996/vivosx%20Redirector.meta.js
// ==/UserScript==


$('button#access').removeAttr ('disabled').html ('Continue to video');
document.getElementById("access").click();