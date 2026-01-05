// ==UserScript==
// @name        Delete from Listings [MOD]
// @namespace   PXgamer
// @include     *kickass.to/community/user/*/*
// @include     *kat.cr/community/user/*/*
// @include     *localhost:999/kat/communitySearch
// @version     1.3
// @description Adds buttons to allow post deletions
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9846/Delete%20from%20Listings%20%5BMOD%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/9846/Delete%20from%20Listings%20%5BMOD%5D.meta.js
// ==/UserScript==

$('.commentHeadLine.borderrad3px.lightivorybg.line160perc').each(function() {
  $(this).append('<a href="javascript:deletePost('+$('div:first .plain', $(this)).attr('href').split('=')[1]+');" class="icon16 redButton icross floatright" title="Delete" style="margin-right:1%"><span></span></a>');                                                                 
});