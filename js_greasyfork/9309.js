// ==UserScript==
// @name        KAT - Average posts/day (For Mods)
// @namespace   AveragePostsMod
// @version     1.04
// @description Shows average post per day for a user on KAT
// @match       http://kat.cr/community/show/*
// @match       https://kat.cr/community/show/*
// @downloadURL https://update.greasyfork.org/scripts/9309/KAT%20-%20Average%20postsday%20%28For%20Mods%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9309/KAT%20-%20Average%20postsday%20%28For%20Mods%29.meta.js
// ==/UserScript==

var sudo = $(".select-opt option:selected").val();
if (sudo >= 5)
{
    $(".badgeInfo").each(function()
    {
        var joinDate = $(this).children().last().text();     
        var posts = $(this).find("span:eq(3)").text();
        posts = posts.substring(7);
        
        var start = new Date(joinDate),
        end   = new Date(),
        diff  = new Date(end - start),
        days  = diff/1000/60/60/24,
        ppd = posts/days;
        ppd = Math.round( ppd * 100 ) / 100;
        $('<span class="font11px lightgrey">posts/day: ' + ppd + '</span>').insertAfter($(this).find("span:eq(3)"));
    });
}