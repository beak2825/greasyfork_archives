// ==UserScript==
// @name        Add OCLC# to Amazon
// @description Uses OCLC's xISBN lookup service to add the OCLC number (and a link to WorldCat) to Amazon.com book details
// @namespace   http://mbkle.in/userscripts
// @include     http://www.amazon.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9900/Add%20OCLC%20to%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/9900/Add%20OCLC%20to%20Amazon.meta.js
// ==/UserScript==
jQuery(document).ready(function () {
  var isbn_li = jQuery('#productDetailsTable .content li b:contains(ISBN)').first().parent()
  if (isbn_li.length > 0) {
    var isbn = isbn_li.text().match(/[0-9]+$/) [0];
    jQuery.ajax({
      type: 'GET',
      url: 'http://xisbn.worldcat.org/webservices/xid/isbn/' + isbn + '?method=getMetadata&format=json&fl=oclcnum',
      dataType: 'jsonp'
    }).done(function (data) {
      var oclc = data.list[0].oclcnum[data.list[0].oclcnum.length - 1]
      isbn_li.before('<li><b>OCLC #:</b> <a href="http://worldcat.org/oclc/' + oclc + '" target="_blank">' + oclc + '</a></li>');
    });
  }
});
