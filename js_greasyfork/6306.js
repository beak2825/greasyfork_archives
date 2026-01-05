// ==UserScript==
// @name        ImgFit
// @namespace   http://yarportal.ru/
// @description 95% width for all third-party images
// @include     http://yarportal.ru/topic*
// @include     http://www.yarportal.ru/topic*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6306/ImgFit.user.js
// @updateURL https://update.greasyfork.org/scripts/6306/ImgFit.meta.js
// ==/UserScript==
var curPageW = $(window).width() * 0.75;
$('img').load(function(){
  if($(this).width() > curPageW) {
    $(this).attr('width', '95%');
  }
});
