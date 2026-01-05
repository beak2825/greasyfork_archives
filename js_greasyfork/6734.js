// ==UserScript==
// @name           ILoveClassics Enhancer
// @namespace      surrealmoviez.info
// @description    Better display for ILoveClassics
// @include        http://www.iloveclassics.com/*
// @require        http://code.jquery.com/jquery-1.11.1.min.js
// @grant          GM_addStyle
// @version        0.4.0
// @downloadURL https://update.greasyfork.org/scripts/6734/ILoveClassics%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/6734/ILoveClassics%20Enhancer.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var uri = document.documentURI;

GM_addStyle(".suggestion-element:hover { background-color : #98a099; }");

// Global search bar
var userbarTitle = $('.NB_ftcm:contains(User Bar)').closest('.fheader');
var searchDiv = '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="text-align: center;"><tr><td>'
        + '<form id="globalSearchBar" action="http://www.iloveclassics.com/browse.php" method="get" style="margin-top: 2px; margin-bottom: 4px; width: 100%;">'
        + '<input id="globalSearchInput" type="text" name="search" style="width: 85%; border: 1px solid rgb(51, 51, 51); background-color: rgb(25, 25, 25); color: white; border-radius: 3px; margin-right: 3px; padding-left: 4px; padding-right: 4px;" placeholder="Search torrents" maxlength="250" autocomplete="off">'
        + '<div id="suggestionsContainer" style="position: absolute; padding: 8px; background-color: #191919; display: none; margin-left: 6px; text-align: left; z-index: 100; box-shadow: 5px 5px 7px black;"></div>'
        + '<input type="hidden" value="0" name="cat">'
        + '<input type="hidden" value="1" name="incldead">'
        + '<select name="searchin" style="width: 14%; text-align: center; right: 0px; background-color: rgb(25, 25, 25); color: white; border: 1px solid rgb(51, 51, 51); border-radius: 3px;">'
        + '<option value="1" style="color: gray;">Title</option>'
        + '<option value="2">Description</option>'
        + '<option value="0">Both</option>'
        + '</select>'
        + '</form>'
        + '</td></tr></table>';
        
$(document).ready(function () {
    
    $(searchDiv).insertAfter(userbarTitle);

    // Hide the 'User Bar' title row
    userbarTitle.hide();

    // Add the suggestions feature to the global search bar
    $('#globalSearchInput').keyup(function(event) {
        var $suggestions = $("#suggestionsContainer");
        if (event.which === 27){
            $suggestions.fadeOut('slow');
            return;
        }
        if ($(this).val() !== "") {
            // Show the suggestions if there's text in the input
            $suggestions.fadeIn('slow');
            if ($(this).val().length < 4) {
                // Don't make requests for queries shorter than 4 characters
                $suggestions.text('...');
            } else {
                // Show the loading image while the request runs
                $suggestions.html('<img src="http://i.imgur.com/EUMuKRs.gif" title="Loading..." alt="Loading...">');
                $.get('/suggest.php?q=' + $(this).val(), function(data) {
                    if (data.trim().length === 0) {
                        $suggestions.text('Nothing found :(');
                        return;
                    }
                    var arraySuggestions = data.split('\n');
                    for (var i = 0; i < arraySuggestions.length; i++) {
                        // Clicking the suggestions automatically submits the form
                        arraySuggestions[i] = '<span class="suggestion-element" style="display: inline-block; margin-bottom: 2px; cursor: pointer;" onclick="$(\'#globalSearchInput\').val($(this).text()); $(\'#globalSearchBar\').submit()">' + arraySuggestions[i] + '</span>';
                    }
                    $suggestions.html(arraySuggestions.join('<br>'));
                });
            }
        } else {
            // Hide suggestions if the input is empty
            $suggestions.fadeOut('slow');
        }
    });

    // Hide the suggestions when clicked outside the form or the suggestions list
    $(document).mouseup(function(e) {
        var $searchBar = $('#globalSearchBar');
        if (!$searchBar.is(e.target) && $searchBar.has(e.target).length === 0) {
            $("#suggestionsContainer").hide();
        } else if ($('#globalSearchInput').val() !== "") {
            $("#suggestionsContainer").show();
        }
    });

    // Open search result in new tab if in the shoutbox page
    if (uri.indexOf('/sb.php') !== -1) {
        $('#globalSearchBar').attr('target', '_blank');
    }

    // Site logo links to the homepage
    $('.clear > div > img').wrap('<a href="index.php"></a>');

    // Reorder the search display to get to the actual data faster
    if (uri.indexOf('/browse.php') !== -1) {
        // Put the colour keys at the bottom of the list
        var colourKeys = $('.NB_fmmain > center');
        colourKeys.siblings('br').remove();
        $(colourKeys).insertAfter('#hover-over');

        // Flip the search methods
        $('#kutorrentsearch > center').prependTo('#kutorrentsearch');
        $('#kutorrentsearch > form').appendTo('#kutorrentsearch');
        $('#kutorrentsearch > br').remove();
    }

    // Hide the search area if the user is browsing trough torrent pages
    if (uri.indexOf('/browse.php?') !== -1 && uri.indexOf('page=') !== -1 && uri.indexOf('page=0') === -1) {
        $('body').scrollTop($('#picutorrentsearch').closest('.ftable').offset().top);
        $('#kutorrentsearch').hide();
    }

    // Show hint of previously downloaded torrent in details page
    if (uri.indexOf('/details.php?id=') !== -1) {
        GM_addStyle("td > a.index:visited { color: #00ff00; }");
    }

    // Show hint of previously downloaded torrent in browse page
    if (uri.indexOf('/browse.php') !== -1) {
        GM_addStyle("a.floppy:visited { color: #00ff00; }"
                + "a.floppy:link { color: #3B3B3B; }");
        $('#hover-over img[alt=Download]').parent().addClass('floppy').parent().attr('align', 'center');
        $('<span style="font-size: 13pt;">⏬</span>').insertBefore($('#hover-over img[alt=Download]'));
    }
    
    // Shortcut to select all reseed requests in PMs
    if (uri.indexOf('/messages.php') !== -1) {
        $('<input id="check-reseed-requests" type="button" value="Check reseed requests">').insertBefore($('.colhead > input[name=delete]'));
        $('#check-reseed-requests').click(function() {
            $('form .NB_fmmain input[type=checkbox]').each(function(){
                if ($(this).parent().prev().prev().text() === 'System' &&
                    $(this).parent().prev().prev().prev().text() === 'Reseed request') {
                    $(this).attr('checked', true); 
                }

            });
        });
    }

});
