// ==UserScript==
// @name       Fimfiction - Google Search
// @namespace  arcum42
// @version    0.2
// @description  Add a separate google search button
// @match      http*://*.fimfiction.net/*
// @copyright  2014+, arcum42
// @downloadURL https://update.greasyfork.org/scripts/6787/Fimfiction%20-%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/6787/Fimfiction%20-%20Google%20Search.meta.js
// ==/UserScript==

function do_a_google_search()
{
    foo = $("input.nav-bar-search").val();
    window.location = "https://www.google.com/search?site=&source=hp&q="+foo+"+site%3Afimfiction.net";
}

$("#form_search_sidebar").after('<button class="search_google"><i class="fa fa-google"> </i></button>');
google = $("button.search_google");
google.css({"background-color":"#3c3d43", "background-clip" : "padding-box", "color" : "#c8cce0", "vertical-align": "middle", "padding": "9px", "line-height": "14px","border": "1px solid rgba(0,0,0,0.2)", "border-left": "none", "outline": "none"});
google.click(do_a_google_search);