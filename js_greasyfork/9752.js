// ==UserScript==
// @name        Add Followers Bubble
// @namespace   PXgamer
// @include     *kickass.to/user/*/followers/
// @include     *kat.cr/user/*/followers/
// @version     1.2
// @description Adds Follower Bubble
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9752/Add%20Followers%20Bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/9752/Add%20Followers%20Bubble.meta.js
// ==/UserScript==

$('.selectedTab span').append(' <i class="menuValue">'+$('h2').html().split(' ')[0]+'</i>');