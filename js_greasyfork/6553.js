// ==UserScript==
// @name       Ebay collection only filter
// @namespace  CollectionOnlyFilter
// @version    0.1
// @description  Hides all collection only listings.
// @match      http://www.ebay.co.uk/*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/6553/Ebay%20collection%20only%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/6553/Ebay%20collection%20only%20filter.meta.js
// ==/UserScript==

$(document).ready(function() {
  $('body').append('<input type="button" value="Filter Collection Only" id="FCO">');
  $("#FCO").css("position", "fixed").css("top", 2).css("left", 2);
  $('#FCO').click(function(){ 
    $("span.ship:contains('Collection only: Free')").parent().parent().parent().hide();
  });
});