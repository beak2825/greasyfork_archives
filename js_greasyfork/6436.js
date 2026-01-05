// ==UserScript==
// @name          Google Play Music Album Sorter
// @description   Greasemonkey/Tampermonkey UserScript for extending Google Play Music with album sorting functionality
// @namespace     http://github.com/VipSaran/Google-Play-Music-Album-Sorter
// @version       1.0.1
// @author        VipSaran
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource      sort_asc https://github.com/VipSaran/Google-Play-Music-Album-Sorter/raw/master/sort_asc.png
// @resource      sort_desc https://github.com/VipSaran/Google-Play-Music-Album-Sorter/raw/master/sort_desc.png
// @grant         GM_getResourceURL
// @include       http://play.google.com/music/listen*
// @include       https://play.google.com/music/listen*
// @include       http://music.google.com/music/listen*
// @include       https://music.google.com/music/listen*
// @match         http://play.google.com/music/listen*
// @match         https://play.google.com/music/listen*
// @match         http://music.google.com/music/listen*
// @match         https://music.google.com/music/listen*
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/6436/Google%20Play%20Music%20Album%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/6436/Google%20Play%20Music%20Album%20Sorter.meta.js
// ==/UserScript==

var DEBUG = false;

function GooglePlayMusicAlbumSorter() {
  if (DEBUG) console.log('GooglePlayMusicAlbumSorter()');
}

GooglePlayMusicAlbumSorter.prototype.loadOrder = function() {
  if (DEBUG) console.log('GooglePlayMusicAlbumSorter.loadOrder()');
  return window.localStorage.getItem('order');
};

GooglePlayMusicAlbumSorter.prototype.saveOrder = function(order) {
  if (DEBUG) console.log('GooglePlayMusicAlbumSorter.saveOrder()');

  window.localStorage.setItem('order', order);
};

var sectionHeaderText = '';
var sortingInProgress = false;
var domModifiedTimeout;
var domModifiedCallback = function() {
  if (DEBUG) console.log('domModifiedCallback()');

  if (domModifiedTimeout) {
    clearTimeout(domModifiedTimeout);
  }

  var albums = $("div").find("[data-type='album']");
  var albumsParent = albums.first().parent();
  if (albumsParent && albumsParent.hasClass('artist-view')) {
    if (DEBUG) console.log('albumsParent=', albumsParent);
    var firstSibling = albums.first().siblings().first();
    if (firstSibling && firstSibling.hasClass('section-header')) {
      sortingInProgress = true;

      var sortOrder = sorter.loadOrder() || 'asc';
      if (DEBUG) console.log('sortOrder=', sortOrder);

      if (sectionHeaderText == '') {
        sectionHeaderText = firstSibling.html();
      }

      if (DEBUG) console.log('albums=', albums);
      albums.sort(function(a, b) {
        var aYear = $(a).find("a.sub-title").html();
        var bYear = $(b).find("a.sub-title").html();
        return sortOrder === 'asc' ? aYear - bYear : bYear - aYear;
      });

      albumsParent.children("[data-type='album']").fadeOut("fast").promise().done(function() {
        albumsParent.empty();
        albumsParent.append('<div class="section-header">' + sectionHeaderText + '<span id="gpmas_sorter" class="' + sortOrder + '" title="Sort"></span></div>');
        $.each(albums, function(i, album) {
          // if (DEBUG) console.log('each', i, album);
          albumsParent.append(album);
        });
        albumsParent.children("[data-type='album']").fadeIn("fast");

        $('#gpmas_sorter').click(function(event) {
          var currClass = $(this).attr('class');
          if (DEBUG) console.log('gpmas_sorter click', currClass);

          $(this).toggleClass('asc desc');

          currClass = $(this).attr('class');
          if (DEBUG) console.log('gpmas_sorter click', currClass);

          sorter.saveOrder(currClass);

          domModifiedCallback();
        });

        sortingInProgress = false;
      });
    }
  }
};

GooglePlayMusicAlbumSorter.prototype.init = function() {
  if (DEBUG) console.log('GooglePlayMusicAlbumSorter.init()');

  $('head').append(
    '<style>\n' +
    '#gpmas_sorter {float: right; width: 40px; height: 40px; cursor: pointer; background-repeat: no-repeat; background-position: center center;}\n' +
    '#gpmas_sorter.asc {background-image: url("' + GM_getResourceURL("sort_asc") + '");}\n' +
    '#gpmas_sorter.desc {background-image: url("' + GM_getResourceURL("sort_desc") + '");}\n' +
    '</style>'
  );

  $('#music-content').bind("DOMNodeInserted", function() {
    if (DEBUG) console.log('DOMNodeInserted');

    if (domModifiedTimeout) {
      clearTimeout(domModifiedTimeout);
    }
    if (sortingInProgress) {
      return;
    }
    domModifiedTimeout = setTimeout(function() {
      domModifiedCallback();
    }, 500);

  });
};

var sorter = new GooglePlayMusicAlbumSorter();

$(document).ready(function() {
  sorter.init();
});