// ==UserScript==
// @name           G.E/EX Keyboard Navigation
// @description    Adds many keyboard shortcuts, such as: thumbnail navigation, quick site search.
// @author         Hen Tie
// @homepage       http://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        http://g.e-hentai.org/g/*
// @include        https//g.e-hentai.org/g/*
// @include        http://exhentai.org/g/*
// @include        https://exhentai.org/g/*
// @include        http://exhentai.org/s/*
// @include        https://exhentai.org/s/*
// @include        http://g.e-hentai.org/s/*
// @include        https://g.e-hentai.org/s/*
// @grant          GM_getValue
// @grant          GM_setValue
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @icon           https://i.imgur.com/RPv1X1r.png
// @version        5.3
// @downloadURL https://update.greasyfork.org/scripts/8279/GEEX%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/8279/GEEX%20Keyboard%20Navigation.meta.js
// ==/UserScript==
document.onkeyup = checkNumber;
function checkNumber(e) {
  e = e || window.event;
  // no shortcuts while commenting
  if ($(e.target).is('input, textarea')) {
    return;
  }
  // left arrow, back page
   else if (e.keyCode == '37') {
    $('table.ptt td:first-child a').click();
  }
  // right arrow, next page
   else if (e.keyCode == '39') {
    $('table.ptt td:last-child a').click();
  }
  // d key, next page
   else if (e.keyCode == '68') {
    $('table.ptt td:last-child a').click();
  }
  // a key, back page
   else if (e.keyCode == '65') {
    $('table.ptt td:first-child a').click();
  }
  // w key, first page
   else if (e.keyCode == '87') {
    $('table.ptt td:nth-child(2) a').click();
  }
  // s key, last page
   else if (e.keyCode == '83') {
    $('table.ptt td:nth-last-child(2) a').click();
  }
  // q key, return to gallery
   else if (e.keyCode == '81') {
    $('.sb a') [0].click();
  }
  // v key, vote tag up
   else if (e.keyCode == '86') {
    $('#tagmenu_act a[onclick="tag_vote_up(); return false"]') [0].click();
  }
  // x key, vote tag down
   else if (e.keyCode == '88') {
    $('#tagmenu_act a[onclick="tag_vote_down(); return false"]') [0].click();
  }
  // f key, search all galleries
   else if (e.keyCode == '70') {
    var tagSearch = prompt('Search ' + document.location.hostname);
    if (tagSearch !== null) {
      window.location.href = '/?f_search=' + tagSearch;
    }
  }
  // stop browser shortcut interference
   else if (e.keyCode == '37' && e.metaKey || e.keyCode == '39' && e.metaKey || e.keyCode == '68' && e.metaKey || e.keyCode == '65' && e.metaKey || e.keyCode == '87' && e.metaKey || e.keyCode == '83' && e.metaKey || e.keyCode == '81' && e.metaKey || e.keyCode == '86' && e.metaKey || e.keyCode == '88' && e.metaKey || e.keyCode == '70' && e.metaKey) {
    return;
  }
}
