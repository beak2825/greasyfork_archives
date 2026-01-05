// ==UserScript==
// @name        Fimfiction Clickable Links
// @description Changes broken URL text into clickable links.
// @include     http*://www.fimfiction.net/*
// @version     1.0.3
// @grant       none
// @namespace   https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/9094/Fimfiction%20Clickable%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/9094/Fimfiction%20Clickable%20Links.meta.js
// ==/UserScript==

var regex = /((?:h\w*ps?\:\/\/)?\w+\.\w+(?:(?:(?:\.\w+)|(\.\w+\/[^\s<"]*))|(?:\/[^\s<"]*))+)(?=$|(:?(:?<\/span\>)|(?:(?:\[\/\w{1,6}\])| )))/i;
var reHTTP = /h\w*ps?\:\/\//i;

// Fix links for user comments.
$("div.comment_data p").each(function() {
    var text = $(this).html();

    $(this).html(text.replace(regex, function(match) {
        var url = match;
        // get "s" if applicable or store empty string
        var secure = (url.match(/s(?=\:\/\/\w+\.\w+)/i) + "").replace(/null/, "");

        // start link tag and add "http(s)://" prefix
        return "<a href='http" + secure + "://" +
            // strip off any "http(s)://" prefix (for complete URL text) and add the rest
            match.replace(reHTTP, "") + 
            // close link tag around original broken URL
            "' target='_blank'>" + match + "</a>";

        //return "<a href='http" + match.replace(reHTTP, match.match(/s(?=\:\/\/)/) + "://").replace(/null/,"") + "' target='_blank'>" + match + "</a>";
    }));
});

// Do the same thing for author's notes.
$("div.authors-note p").each(function() {
    var text = $(this).html();

    $(this).html(text.replace(regex, function(match) {
        var url = match;
        // get "s" if applicable or store empty string
        var secure = (url.match(/s(?=\:\/\/\w+\.\w+)/i) + "").replace(/null/, "");

        // start link tag and add "http(s)://" prefix
        return "<a href='http" + secure + "://" +
            // strip off any "http(s)://" prefix (for complete URL text) and add the rest
            match.replace(reHTTP, "") + 
            // close link tag around original broken URL
            "' target='_blank'>" + match + "</a>";

        //return "<a href='http" + match.replace(reHTTP, match.match(/s(?=\:\/\/)/) + "://").replace(/null/,"") + "' target='_blank'>" + match + "</a>";
    }));
});