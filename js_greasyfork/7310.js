// ==UserScript==
// @name           Veinticuatrofps Enhancer
// @namespace      surrealmoviez.info
// @description    Display changes for Veinticuatrofps
// @include        http://www.veinticuatrofps.com/tracker/*
// @include        http://veinticuatrofps.com/tracker/*
// @grant          none
// @version        0.0.2
// @downloadURL https://update.greasyfork.org/scripts/7310/Veinticuatrofps%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/7310/Veinticuatrofps%20Enhancer.meta.js
// ==/UserScript==

// Link the site banner to the index page
$('img:eq(0)').wrap('<a href="index.php"></a>');

// Insert the new search bars
var searchBars = '<td align="left" class="bottom">'
        + '<form action="browse.php" method="get" style="display: inline;">'
        + '<input type="text" name="search" placeholder="Torrents" style="border: 1px solid grey; border-radius: 2px; background: #DFEFEF; width: 120px; margin-right: 4px;">'
        + '<input type="hidden" name="cat" value="0">'
        + '</form>'
        + '<form action="forums.php" method="get" style="display: inline;">'
        + '<input type="text" name="keywords" placeholder="Foros" style="border: 1px solid grey; border-radius: 2px; background: #DFEFEF; width: 120px;">'
        + '<input type="hidden" name="action" value="search">'
        + '</form>'
        + '</td>';

$(searchBars).insertAfter('body > table:eq(1) td:eq(1)');

// Check if a torrent details page is open
if (document.documentURI.indexOf("/details.php?id=") !== -1 || document.documentURI.indexOf("/offdetails.php?id=") !== -1) {
    // Browse magnified snapshots with arrow keys
    var thumbnails = $('img.thumbnail');
    $(document).keydown(function (e) {
        var bodyEls = $('body').children();
        if ($(bodyEls.get(bodyEls.length - 1)).is('img')) {
            var macroImage = $(bodyEls.get(bodyEls.length - 1));
            var currentSrc = macroImage.attr('src');
            var currentIndex = thumbnails.index($('.thumbnail[src=' + currentSrc + ']'));
            if (e.keyCode === 37 /* left */ && currentIndex > 0) {
                macroImage.attr('src', thumbnails.eq(currentIndex - 1).attr('src'));
                return false;
            } else if (e.keyCode === 39 /* right */ && currentIndex < (thumbnails.length - 1)) {
                macroImage.attr('src', thumbnails.eq(currentIndex + 1).attr('src'));
                return false;
            }
        }

    });
}
    