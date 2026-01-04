// ==UserScript==
// @name        AO3: highlight tags V2: branch
// @description Configure my tags to be highlighted with different colors
// @namespace   https://greasyfork.org/en/users/1539483-4ch17734n
// @author      Fangirlishness, me
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @grant       none
// @version     2.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556313/AO3%3A%20highlight%20tags%20V2%3A%20branch.user.js
// @updateURL https://update.greasyfork.org/scripts/556313/AO3%3A%20highlight%20tags%20V2%3A%20branch.meta.js
// ==/UserScript==
/* eslint-env jquery */

// personal branch from Fangirlishness' AO3: highlight tags V2

(function($) {

/**** CONFIG ********************/

    // add the tag pattern you want to highlight (can appear anywhere in the tag) and the color for each
    // if you only want to highlight tags of a certain kind, start with with the kind of tag, then an exclamation mark, then your text.
    // Possible starting values are "relationships!", "characters!", "freeforms!"

    var tagsToHighlight = {"*&*&*": "#fda7d1", // pink
                           "Fanart": "#adf7d1", // light green
                           "Alternate Universe": "red", // named colors work too
                           "^Omega Simon": "#038200", // only tags that start with Omega Simon
                        //   "Comfort$": "#038200", // only tags that end with Comfort
                        //   "relationships!Arthur": "red", // relationship tags that contain 'Arthur'
                           }; 

/********************************/
    $('.blurb ul.tags, .meta .tags ul').each(function() {
        var $list = $(this);
        $list.find('a.tag').each(function() {        
            var $tag = $(this);
            var text = $tag.text();
            for (var key in tagsToHighlight) {
                var color = tagsToHighlight[key];
                // parse out tagtype from key and save it as a classname (prepend .)
                if(key.startsWith('relationships!') || key.startsWith('characters!') || key.startsWith('freeforms!') ) {
                    var tagtype = "."+key.substring(0, key.indexOf('!')); 
                    key = key.substring(key.indexOf('!')+1);
                }
                // match on key without type
                var pattern = new RegExp(key, "g") 
                if(text.match(pattern) != null) {
                    highlightTag($tag, color, tagtype);
                }
            }
        });
    });

    function highlightTag($tag, color, tagtype) {
        // if tagtype is given, color only tags with that class
        if(tagtype) {
            $tag.parent(tagtype).children().first().css('background-color', color);
        }
        else {
            $tag.css('background-color', color);
        }
    }
        
})(jQuery);