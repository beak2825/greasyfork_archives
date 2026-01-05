// ==UserScript==
// @name        Sort alphabetically
// @namespace   pxgamer
// @description Sorts torrents alphabetically as an option
// @include     *kat.cr/new/*
// @include     *kat.cr/movies/*
// @include     *kat.cr/games/*
// @include     *kat.cr/tv/*
// @include     *kat.cr/books/*
// @include     *kat.cr/applications/*
// @include     *kat.cr/music/*
// @include     *kat.cr/anime/*
// @include     *kat.cr/other/*
// @include     *kat.cr/xxx/*
// @include     *kat.cr/usearch/*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9772/Sort%20alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/9772/Sort%20alphabetically.meta.js
// ==/UserScript==

var rows = [];
 
$('.data').before('<div class="buttonsline"><select disabled id="field-select" style="letter-spacing: 0px; width: 160px !important;"><option value="title">Sort by Torrent Name</option></select><select id="field-sort" style="letter-spacing: 0px; width: 150px !important;"><option value="asc">Ascending</option><option value="desc">Descending</option></select> <button class="siteButton bigButton" id="sortTable"><span>Sort</span></button></div>');
 
$(document).delegate('#sortTable', 'click', function() {
  var sortName = $('#field-select').val();
  var sortType = ($('#field-sort').val()=="asc");
  sortTable(sortName, sortType);
});
 
$('.data tr[id^="torrent_"]').each(function() {
  var title = $('.cellMainLink', $(this)).text();
  var html = $(this).html();
  rows.push({"title":title, "html":html});
});
 
function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    if (typeof x == "string") {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
 
function sortTable(sortName, sortType) {
  sortByKey(rows, sortName);
  if (!sortType) { // Not sortType / is false
    rows.reverse();
  }
  $('.data tr[id^="torrent_"]').remove();
  for (var i=0;i<rows.length;i++) {
    $('.data').append('<tr id="torrent_'+i+'">'+rows[i].html+'</tr>');
  }

    }
