// ==UserScript==
// @name        KAT - Goodreads book info creator
// @namespace   Dr.YeTii
// @description Creates book info, duh :P
// @include     http*://www.goodreads.com/book/show/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9290/KAT%20-%20Goodreads%20book%20info%20creator.user.js
// @updateURL https://update.greasyfork.org/scripts/9290/KAT%20-%20Goodreads%20book%20info%20creator.meta.js
// ==/UserScript==

var url = "http://www.goodreads.com"+window.location.pathname;
var desc = $('#description span').last().html();
var img = $('#coverImage').attr('src');
var title = $('#bookTitle').text();
var auth = "";
for (var i=0;i<$('[itemprop="author"] .authorName:not(.greyText)').length;i++) {
  auth = auth+" & "+$('[itemprop="author"] .authorName:not(.greyText)').eq(i).text();
}
var token = " & ";
var parts = auth.split(token);
auth = parts.slice(0,-1).join(', ') + " & " + parts.slice(-1)
auth = auth.substring(2);
var isbns = [];
if ($('#bookDataBox .infoBoxRowTitle:contains("ISBN13")').length>0) {
 isbns.push('ISBN13: '+$('#bookDataBox .infoBoxRowTitle:contains("ISBN13")').next().text());
}else if ($('#bookDataBox .infoBoxRowTitle:contains("ISBN")').length>0) {
 isbns.push('ISBN: '+$('#bookDataBox .infoBoxRowTitle:contains("ISBN")').next().text());
}else if ($('#bookDataBox .infoBoxRowTitle:contains("ASIN")').length>0) {
 isbns.push('ASIN: '+$('#bookDataBox .infoBoxRowTitle:contains("ASIN")').next().text());
}
var isbn = isbns.join('|');

if (url != "" && desc != "" && img != "") {
  var template = '<br>[size=200][b]$title[/b][/size]<br>by $auth<br>[size=85]$isbn[/size]<br> <br>[url="$url"][img]$img[/img][/url]<br> <br> <br>[b]Description:[/b] <br>$desc';
  template = template.split('$url').join(url).split('$desc').join(desc).split('$img').join(img).split('$title').join(title).split('$auth').join(auth).split('$isbn').join(isbn);
  $('#details').append('<input style="width: 448px;" '+('value="'+auth+' - '+title).split('\n').join(' ').replace(/\s{2,}/g, ' ').split('<br>').join('\n')+' [MM book] - YeTii"><textarea style="width: 448px; height: 150px;">'+template.split('\n').join(' ').replace(/\s{2,}/g, ' ').split('<br>').join('\n')+'</textarea>');
}