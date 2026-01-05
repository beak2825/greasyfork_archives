// ==UserScript==
// @name        Fix Yify
// @namespace   yts.to
// @description Add content ratings to Yify listings and replace torrent urls with magnet links.
//
// @include     http://yify-movie.com/search*
// @include     http://yify-movie.com/recent*
// @include     http://yify-movie.com/genres/*
// @include     http://yify-movie.com/years/*
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @version     0.2.3
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7958/Fix%20Yify.user.js
// @updateURL https://update.greasyfork.org/scripts/7958/Fix%20Yify.meta.js
// ==/UserScript==

// Bigger fonts
GM_addStyle('\
  .imdb-high { \
    background: green; \
    color: white; \
    padding: 1px 4px 1px 4px; \
  } \
  .imdb-med { \
    background: orange; \
    color: white; \
    padding: 1px 4px 1px 4px; \
  } \
  .imdb-low { \
    background: red; \
    color: white; \
    padding: 1px 4px 1px 4px; \
  } \
  figcaption { \
    font-weight: bold; \
  } \
  figcaption { \
    background: white; \
    border-radius: 15px; \
    height: 90px !important; \
  } \
  figcaption:hover { \
    color: white; \
    background: gray; \
  } \
  ');

function imdbRating(imdb) {
  var score = parseInt(imdb, 10);
  var rating = null;
  if (score > 6.9) {
    rating = 'imdb-high';
  } else if (score > 4.5) {
    rating = 'imdb-med';
  } else {
    rating = 'imdb-low';
  }

  return '<span class="' + rating + '">' + imdb + '</span>';
}

function addTorrentLink(dom, div) {
  $("dd:nth-child(17)", $(dom)).each(function(i) {
    mpr = $(this).text();
  });
  $("dd:nth-child(20)", $(dom)).each(function(i) {
    imdb = $(this).text();
  });
  $("#dm", $(dom)).each(function(i) {
    magnet = $(this).attr('href');
  });

  var title = div.find('h3').text();

  var newText = '<figcaption><a href="'+magnet+'" title="click to download">';
  newText += "<h3>" + title + '</h3>';
  newText += '<div>MPR: '+mpr+'</div>';
  newText += '<div>IMDB: '+imdbRating(imdb)+'</div>';
  newText += "</figcaption></a>";

  div.find('figcaption').replaceWith(newText);
}

function addPopupCast(dom, div) {
  var cast = 'ACTORS: ';
  $("span:nth-child(5) span", $(dom)).each(function(i) {
    cast += $(this).text() + ', ';
  });
  cast = cast.replace(/, $/, '');
  // console.log("CAST: "+cast);
  div.find("a").prop("title", cast);
}

function imposeMyWill(url, div) {
  var data = null;
  // console.log("DIV: "+ div);
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(response) {
      // We've received a response
      data = $.parseHTML(response.responseText);
      // console.log("DATA: "+ data);
      addTorrentLink(data, div);
      addPopupCast(data, div);
      return;
    },
    onerror: function(response) {
      data = JSON.parse(response.responseText);
      console.log('ERROR: '+data);
      // $('#yts-options').html('<p>ERROR! Failed to connect to the YTS website.</p>');
    }
  });
}

function removeAds() {
  var ads = $('a.hidden-xs');
  if (ads.length) {
    console.log('Removing ad box.');
    ads.remove();
  }
}

$(document).ready(function() {
  var divs = $("article.img-item");
  var link = null;
  var url = null;

  // removeAds();

  $(divs).each(function(i) {
    link = $(this).find('h3 a');
    url = link.attr('href');
    // console.log("URL: "+url);
    imposeMyWill(url, $(this));
  });
});
