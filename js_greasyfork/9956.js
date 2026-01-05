// ==UserScript==
// @name        Add OCLC# to Alibris for Libraries
// @description Uses OCLC's xISBN lookup service to add the OCLC number (and a link to WorldCat) to library.alibris.com book details
// @namespace   http://mbkle.in/userscripts
// @include     http://library.alibris.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9956/Add%20OCLC%20to%20Alibris%20for%20Libraries.user.js
// @updateURL https://update.greasyfork.org/scripts/9956/Add%20OCLC%20to%20Alibris%20for%20Libraries.meta.js
// ==/UserScript==
 
jQuery(document).ready(function () {
  var title = jQuery('.author-title p');
    var publisher_li = jQuery('#inv-detail table tr td .about-product p strong:contains(Publisher)').first().parent();
    var publisher = publisher_li.text();
    var date_li = jQuery('#inv-detail table tr td .about-product p strong:contains(Date)').first().parent();
    var date = date_li.text().match(/[0-9]+$/)[0];
    var alibris_li = jQuery('#inv-detail table tr td .about-product p strong:contains(Alibris ID)').first().parent(); 
    var alibris = alibris_li.text();
  var isbn_li = jQuery('#inv-detail table tr td .about-product p strong:contains(ISBN)').first().parent();
  if (isbn_li.length > 0) {
    var isbn = $.trim(isbn_li.text().match(/[0-9]+$/) [0]);
    jQuery.ajax({
      type: 'GET',
      url: 'http://xisbn.worldcat.org/webservices/xid/isbn/' + isbn + '?method=getMetadata&format=json&fl=oclcnum',
      dataType: 'jsonp',
      success: function (data) {
        var oclc = data.list[0].oclcnum[data.list[0].oclcnum.length - 1];
        title.after('<span style="color: black; font-size: 20px;"><ul><li>OCLC #: <a href="http://worldcat.org/oclc/' + oclc + '" target="_blank">' + oclc + '</a></li><li>' + publisher + '</li><li>Date: ' + date + '</li><li>ISBN: ' + isbn + '</li><li>' + alibris + '</li></ul></span>');
      }
    });
  }
});