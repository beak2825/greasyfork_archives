// ==UserScript==
// @name        inoreader scroll bug fix
// @namespace   http://twitter.com/GDorn
// @description Fixes scrolling issues due to adblock on inoreader.com
// @include     http://www.inoreader.com/*
// @include     https://www.inoreader.com/*
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/7705/inoreader%20scroll%20bug%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/7705/inoreader%20scroll%20bug%20fix.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('#reader_pane').keyup(
    function(event){
      if (event.which == 78 || event.which == 80){
        setTimeout(function(){$(".article_current").get(0).scrollIntoView();}, 250);      
      } 
    }
  )
 }
);
