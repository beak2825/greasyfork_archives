// ==UserScript==
// @name        AO3: highlight tags
// @description Configure tags to be highlighted with different colors - please install V2 of this script instead
// @namespace   http://greasyfork.org/users/6872-fangirlishness
// @author      Fangirlishness 
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/8957/AO3%3A%20highlight%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/8957/AO3%3A%20highlight%20tags.meta.js
// ==/UserScript==

// loosely derived from tuff-ghost's ao3 hide some tags (with permission)

(function($) {

/**** CONFIG ********************/

    // add the tag pattern you want to highlight (can appear anywhere in the tag) and the color for each
    var tagsToHighlight = {"Alternate Universe":"#fda7d1", // pink
                           "Fanart":"#adf7d1", // light green
                           "Mpreg.*":"red", // regexp patterns can be used
                           "somethingelse": "blue"}; // named colors work too

/********************************/
    $('.blurb ul.tags, .meta .tags ul').each(function() {
        var $list = $(this);
        $list.find('a.tag').each(function() {        
            var $tag = $(this);
            var text = $tag.text();
            
            for (var key in tagsToHighlight) {
                var pattern = new RegExp(key, "g") 
                if(text.match(pattern) != null) {
                    highlightTag($tag, tagsToHighlight[key]);
                }
            }
        });
    });

    function highlightTag($tag, color) {
        $tag.css('background-color', color);
    }
        
})(jQuery);