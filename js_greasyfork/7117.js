// ==UserScript==
// @name       Ed Kohler UPC Helper
// @namespace  
// @version    0.2
// @description  Highlight UPC code from Toys R Us Product pages
// @match      
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @include     http://www.toysrus.com/product/index.jsp*
// @namespace   https://greasyfork.org/en/users/7820-itstriz
// @downloadURL https://update.greasyfork.org/scripts/7117/Ed%20Kohler%20UPC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7117/Ed%20Kohler%20UPC%20Helper.meta.js
// ==/UserScript==

$( document ).ready(function() {
    upc_code = $('p.upc').children('.value').html();
    
    main_title = $('div#lTitle').children('h1').first();
    $("<h2 style='background-color: yellow'>UPC: " + upc_code + "</h2>").insertAfter(main_title);
});