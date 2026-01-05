// ==UserScript==
// @name        KAT - Average posts/day
// @namespace   AveragePosts
// @version     1.05
// @description Shows average post per day for a user on KAT
// @match       http://kat.cr/community/show/*
// @match       https://kat.cr/community/show/*
// @include   /https?:\/\/kat.cr\/user\/[^\/]+\//
// @downloadURL https://update.greasyfork.org/scripts/9308/KAT%20-%20Average%20postsday.user.js
// @updateURL https://update.greasyfork.org/scripts/9308/KAT%20-%20Average%20postsday.meta.js
// ==/UserScript==

if (window.location.href.search("\/user\/") != -1)
{
    var joinDate = $(".formtable tbody tr:first td:last").text();
    joinDate = joinDate.substring(joinDate.indexOf('(') + 1, joinDate.length - 1);
    var posts = $(".formtable tbody tr td strong a[href^='/community/']").closest("tr").children("td:last").text();
    var start = new Date(joinDate),
    end   = new Date(),
    diff  = new Date(end - start),
    days  = diff/1000/60/60/24,
    ppd = posts/days;
    ppd = Math.round( ppd * 100 ) / 100;
    $(".formtable tbody tr td strong a[href^='/community/']").closest("tr").children("td:last").append(" - " + ppd + " posts per day");
}
else
{
    $("div[id^='post'] .badgeInfo").each(function()
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
