// ==UserScript==
// @name        Add OCLC# to Amazon
// @description Uses OCLC's xISBN lookup service to add the OCLC number (and a link to WorldCat). Also moves publisher and ISBN details to just below the title.
// @namespace   http://mbkle.in/userscripts
// @include     http://www.amazon.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9957/Add%20OCLC%20to%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/9957/Add%20OCLC%20to%20Amazon.meta.js
// ==/UserScript==
// written by Michael B. Klein and Ellen K. Wilson
jQuery(document).ready(function () {
  var isbn_li = jQuery('#productDetailsTable .content li b:contains(ISBN)').first().parent();
  var byline = jQuery('#byline');
  var publisher_li = jQuery('#productDetailsTable .content li b:contains(Publisher)').first().parent();
  var publisher = publisher_li.text();
    var isbn13_li = jQuery('#productDetailsTable .content li b:contains(ISBN-13)').parent();
    var isbn13 = isbn13_li.text();
  if (isbn_li.length > 0) {
    var isbn = isbn_li.text().match(/[0-9]+$/) [0];
    jQuery.ajax({
      type: 'GET',
      url: 'http://xisbn.worldcat.org/webservices/xid/isbn/' + isbn + '?method=getMetadata&format=json&fl=oclcnum',
      dataType: 'jsonp'
    }).done(function (data) {
      var oclc = data.list[0].oclcnum[data.list[0].oclcnum.length - 1];
        byline.after('<span style="color: black; font-size: 16px;"><ul><li>OCLC #: <a href="http://worldcat.org/oclc/' + oclc + '" target="_blank">' + oclc + '</a></li><li>' + publisher + '</li><li>ISBN: ' + isbn + '</li><li>' + isbn13 + '</li></ul></span>');
    });
  }
});