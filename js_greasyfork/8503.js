// ==UserScript==
// @name        IMDB Rating
// @namespace   com.adityapurwa.jenova.gmonkey.imdbrating
// @description Display imdb rating when hovering on an imdb link
// @include     *
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8503/IMDB%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/8503/IMDB%20Rating.meta.js
// ==/UserScript==

// MIT LICENSE
// Written by Aditya Purwa (adityapurwa@myriatechnologies.com)

requesting = false;
currentlyHovered = null;
$('[href*=\'imdb\']').on('mouseover', function (event) {
  var href = $(this).attr('href');
  var regex = /http:\/\/www.imdb.com\/title\/(.+)/;
  var m = regex.exec(href);
  currentlyHovered = $(this) [0];
  setTimeout(function () {
    if (!requesting) {
      requesting = true;
      GM_xmlhttpRequest({
        method: 'GET',
        url: m[0].toString(),
        onload: function (r) {
          var dom = $.parseHTML(r.responseText);
          var rating = $(dom).find('[class=\'titlePageSprite star-box-giga-star\']');
          var title = $('<div/>').css({
            'font-weight': 'bold',
            'color': 'white'
          }).html('IMDB Rating');
          var subtitle = $('<div/>').css({
            'font-weight': 'bold',
            'color': 'white',
            'font-size': '10px'
          }).html('click to dismiss');
          var ratingBox = $('<div/>', {
            id: 'imdb-popup'
          }).append(title).append(subtitle).append('<div>' + rating.html() + '</div>').css({
            'position': 'absolute',
            'left': currentlyHovered.offsetLeft + 'px',
            'top': currentlyHovered.offsetTop + 'px',
            'font-size': '18px',
            'padding': '14px',
            'color': 'black',
            'z-index': 100,
            'box-shadow': '0 0 12px rgba(160,120,50,.35)'
          }).appendTo($('body')).click(function () {
            $('#imdb-popup').remove();
          });
          var ratingValue = parseFloat(rating.html());
          if (ratingValue > 8) {
            $(ratingBox).css('background', 'gold');
          } 
          else if (ratingValue > 5) {
            $(ratingBox).css('background', '#5A3');
          } else {
            $(ratingBox).css('background', '#F34');
          }
          requesting = false;
        }
      });
    }
  }, 1000);
});
