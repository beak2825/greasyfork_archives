// ==UserScript==
// @name          AdultFilmDataBase - Show thumbnails of Actors in "Appears with:" AND List of "Appears with"
// @description	  AFDB AdultFilmDataBase - Show directly thumbnails of Actress AND Show List of Actors which "Appears and a copy button
// @author        janvier57
// @namespace     https://greasyfork.org/users/7434
// @icon          https://external-content.duckduckgo.com/ip3/www.adultfilmdatabase.com.ico
// @match         https://www.adultfilmdatabase.com/actor/*
// @version       2.1.0
// @license       unlicense
// @grant         none
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/548132/AdultFilmDataBase%20-%20Show%20thumbnails%20of%20Actors%20in%20%22Appears%20with%3A%22%20AND%20List%20of%20%22Appears%20with%22.user.js
// @updateURL https://update.greasyfork.org/scripts/548132/AdultFilmDataBase%20-%20Show%20thumbnails%20of%20Actors%20in%20%22Appears%20with%3A%22%20AND%20List%20of%20%22Appears%20with%22.meta.js
// ==/UserScript==

(function($) {
  'use strict';
  $(document).ready(function() {
    $('.ui-tabs-anchor[href*="performedwith.cfm"]').on('click', function() {
      setTimeout(function() {
        $(".ui-widget-content a.w3-small[href^='/actor/']").each(function() {
          var attr = $(this).attr('actorthumb');
          if (typeof attr !== typeof undefined && attr !== false) {
            var img = $('<img class="actorthumb" src="https://www.adultfilmdatabase.com' + attr + '">');
            img.on('error', function() {
              $(this).remove();
            });
            $(this).before(img);
          }
        });

        // Get list of actors and create copy button
        var actors = [];
        $(".ui-widget-content a.w3-small[href^='/actor/']").each(function() {
          actors.push($(this).text().trim());
        });
        var list = actors.join(', ');
        var copyButton = $('<button class="copy-button">Copy List</button>');
        copyButton.on('click', function() {
          navigator.clipboard.writeText('Appears with:\n' + list);
        });
        var displayList = list.replace(/,([^,]*)$/, ', $1');
        $('#aboutprod-tabs  ul[role="tablist"] li.ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab.ui-tabs-active.ui-state-active .ui-tabs-anchor[href*="performedwith.cfm"]').before('Appears with:\n' + displayList + '<br>');
        $('#aboutprod-tabs  ul[role="tablist"] li.ui-tabs-tab.ui-corner-top.ui-state-default.ui-tab.ui-tabs-active.ui-state-active .ui-tabs-anchor[href*="performedwith.cfm"]').before(copyButton);
      }, 500); // wait for 500ms to allow content to load
    });
  });
})(jQuery);

// Add style
var style = document.createElement('style');
style.innerHTML = `
  .actorthumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: contain;
    margin: 0 0px 0 -20px;
  }
  .copy-button {
    margin-bottom: 10px;
  }
`;
document.head.appendChild(style);
