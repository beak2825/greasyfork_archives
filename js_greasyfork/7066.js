// ==UserScript==
// @name           Cinemageddon Enhancer
// @namespace      surrealmoviez.info
// @description    Display changes for Cinemageddon
// @include        http://cinemageddon.net/*
// @include        https://cinemageddon.net/*
// @grant          none
// @version        0.0.2
// @downloadURL https://update.greasyfork.org/scripts/7066/Cinemageddon%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/7066/Cinemageddon%20Enhancer.meta.js
// ==/UserScript==

// Hide the logout link (duplicated) to save space
var statusbarLogout = $('.statusbar a:contains(logout)');
statusbarLogout.prev('span').hide();
statusbarLogout.hide();

// Insert the new search bars
var searchBars = '<form action="/browse.php" method="get" style="display: inline; margin-right: 3px;">'
        + '<input type="text" style="width: 100px;" value="" name="search" placeholder="Torrents">'
        + '<input type="hidden" name="cat" value="0">'
        + '</form>'
        + '<form action="/forums.php" method="get" style="display: inline;">'
        + '<input type="text" style="width: 100px;" value="" name="keywords" placeholder="Forums">'
        + '<input type="hidden" name="action" value="search">'
        + '</form>';

$('.statusbar').append(searchBars);

// Manage left menu items
$('td > a:contains(News/Poll)').hide().next('br').hide(); // News/Poll link is the same as the Index image link 1cm above