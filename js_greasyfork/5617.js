// ==UserScript==
// @name       Fimfiction Full Names 
// @namespace  arcum42
// @author     arcum42
// @version    0.6.3
// @description  This script changes the tags and ratings to display the full text, adds the name to the back of the cards, and another minor tweak or two.
// @match      http*://www.fimfiction.net/*
// @copyright  2014+, You
// @downloadURL https://update.greasyfork.org/scripts/5617/Fimfiction%20Full%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/5617/Fimfiction%20Full%20Names.meta.js
// ==/UserScript==

// Change all the categories to have the full category name, not an abbreviation. Use "AU" instead of "Alternate Universe". [story cards]
// Also go to a new line after the category tags. 
// I decided to combine the two routines after I had to put in a horrible workaround for 'last' hating me.
$("span.short_description").each(function() {
    var kittens = $(this).find("a.story_category"),  kitty_size = kittens.length - 1;
    kittens.each(function(i) 
    { 
        var txt = $(this).attr("title"), has_title = (txt != "");

        if (txt == "Alternate Universe") { txt = "AU"; }
        
        if (has_title)
        {
            $(this).text(txt)
                   .css({"text-transform": "capitalize"});
        }
        
        if (i == kitty_size)
        {
            $(this).after("<br/>"); 
        }
    });
});

// Do the same thing for the ratings. [story cards]
$('[class^="content-rating"], [class^="content_rating"]').each(function(){
    var txt = $(this).attr("class").replace("content-rating-","").replace("content_rating_","");
    
    $(this).text(txt)
           .css({"line-height": "20px", "text-transform": "capitalize"});
}
);

// Add the story title to the flip side of the story cards. [story cards]
$(".story-card-container").each(function() {
    $(this).find("div.story-card-reverse-content").before($(this).find("a.story_link").clone());
});

// Let's downscale a 64 x 64 avatar to 48 x 48, rather then upscaling the 32 x 32 one, as it looks better. (Consider just making it 64x64?) [Dashboard]
$("img.avatar").each(function() {
    var source = $(this).attr("src");
    $(this).attr("src",source.replace("_32","_64"));
    //$(this).css({"width":"64","height":"64"});
});