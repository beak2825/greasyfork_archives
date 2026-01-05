// ==UserScript==
// @name        Fimfiction - Last User Sighting
// @namespace   arcum42
// @include     http*://*fimfiction.net/user*
// @include     http*://*fimfiction.net/story*
// @include     http*://*fimfiction.net/blog*
// @version     2.1
// @description Makes how long ago someone was online more easily visible.
// @downloadURL https://update.greasyfork.org/scripts/5593/Fimfiction%20-%20Last%20User%20Sighting.user.js
// @updateURL https://update.greasyfork.org/scripts/5593/Fimfiction%20-%20Last%20User%20Sighting.meta.js
// ==/UserScript==

// Combine the page selector with the number of pages and followers. Doesn't look great, but neither does the default.
/*var top_list = $("div.page_list:first");
var top_count = $("div.search_results_count:first");

$("div.page_list:first").append($("div.search_results_count:first").detach()).css({"float":"center"});
$("div.page_list:last").append($("div.search_results_count:last").detach());*/

$("div.card-content h2").each(function(){
    var user_span = $(this).find("span"), user_time, user_time_html;
    
    user_time = $(user_span).attr("title");
    
    if (!user_time)
    {
        user_time = "Omnipresent";    
    }
                              
    user_time_html = "<span class=\"user_time\">" + user_time +"</span>";
    $(this).before(user_time_html);
    $("span.user_time").css({"position": "absolute", "top": "56px", "right": "10px", "font-size": "80%"});
});
