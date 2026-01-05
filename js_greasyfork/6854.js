// ==UserScript==
// @name         MVideo cleaner
// @namespace    http://www.mvideo.ru/
// @version      0.1
// @description  cleans mvideo from not priced goods
// @author       DikUln
// @include        http://*mvideo.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6854/MVideo%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/6854/MVideo%20cleaner.meta.js
// ==/UserScript==

(function(){
       
    $(".product-tile-checkout-section:not(:has(.product-price))").parent().parent().parent().hide();
    
})();