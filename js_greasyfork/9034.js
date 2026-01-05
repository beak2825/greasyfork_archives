// ==UserScript==
// @name        Better Literorica
// @namespace   betterliterotica.dekart25.com
// @version     0.4
// @description This scripts aims to give you more information about the story you are reading.
// @include     http*://www.literotica.com/s*/*
// @copyright   2015+, dekart25
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9034/Better%20Literorica.user.js
// @updateURL https://update.greasyfork.org/scripts/9034/Better%20Literorica.meta.js
// ==/UserScript==

$(document).ready(function() {
    var title = $(".b-story-header h1").text();
    var userUrl = $(".b-story-header a").attr("href");
    var url = location.href;

    if(url.indexOf("url=") != -1) {
        location.href = url.replace("tories/showstory.php?url=","/");
    }

    if(url.indexOf("http:") != -1) {
        location.href = url.replace("http:","https:");
    }

    //Remover a margin do W
    $("#w").width("100%");
    $("#root").css("margin-right", "500px");

    var minusheight = -1 * ( $(".b-story-body-x").height() + $(".b-story-header").height() + $(".b-breadcrumbs").height() + $(".b-story-stats-block").height() + 60 );
    $("#content .b-sidebar").css("margin-top",minusheight).css("margin-right","-650px").width("600px");

    var pages = $(".b-pager-caption-t").text();

    var box = $(".b-box")[0];
    $(box).find(".b-box-header h3").text("Serie");

    $.get(userUrl, function(data) {
        var rating = $(data).find("a[href=" + url + "]").parent().parent();
        if(rating.size() !== 0)
        {
            $(box).find(".b-box-body").html(rating.html());
        }
        else {
            $(box).find(".b-box-body").html("(x.xx)");
        }
        $(box).find(".b-box-body").append(pages);
        
        var hasNew = $(data).find("img[alt=\"New\"]");
        if(hasNew.length > 0) {
            $(box).find(".b-box-body").append('<img src="https://www.literotica.com/stories/images/memberpage/ico_n.gif" alt="New" width="10" height="11" border="0">'); 
        }
    });

    var lastpage = $("[name=page] option").last().text();
    if(lastpage !== "")
    {
        $.get(url + "?page=" + lastpage, function(data) {
            var serie = $(data).find("#b-series")[0];
            $("#content .b-sidebar").append(serie);

            var tags = $(data).find(".b-s-story-tag-list").parent().parent();
            $("#content .b-sidebar").append(tags);
        });
    }
});