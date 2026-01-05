// ==UserScript==
// @name        IP's Tab [MOD]
// @namespace   PXgamer
// @description Adds an IP tab to user profiles
// @include     *kickass.to/user/*
// @include     *kat.cr/user/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9748/IP%27s%20Tab%20%5BMOD%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9748/IP%27s%20Tab%20%5BMOD%5D.meta.js
// ==/UserScript==

var user = window.location.pathname.split('/')[2];

$('ul.tabNavigation').append('<li><a href="/user/' + user + '/ips/" class="darkButton"><span>IPs</span></a></li>');