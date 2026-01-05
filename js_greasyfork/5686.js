// ==UserScript==
// @name        Fix images for token pages
// @namespace   pendevin
// @description makes images work in token pages
// @include     http://endoftheinter.net/tokenlist.php?*
// @include     https://endoftheinter.net/tokenlist.php?*
// @include     http://endoftheinter.net/mytokens.php?*
// @include     https://endoftheinter.net/mytokens.php?*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/5686/Fix%20images%20for%20token%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/5686/Fix%20images%20for%20token%20pages.meta.js
// ==/UserScript==

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//get the images
var imgs=$('.imgs>a');
imgs.each(function(i,img){
  img=$(img);
  //the image source is conveniently included in the parent link
  var src=img.attr('imgsrc');
  //replace the broken imageloader with normal images
  img.html('<img src="'+src+'">');
});