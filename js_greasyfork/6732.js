// ==UserScript==
// @name           dafilms.com link extractor
// @namespace      surrealmoviez.info
// @description    Prints the video direct download link
// @include        http://dafilms.com/film/*
// @include        http://dafilms.com/download/*
// @include        http://dafilms.com/film/*
// @grant          none
// @version        0.2.2
// @downloadURL https://update.greasyfork.org/scripts/6732/dafilmscom%20link%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/6732/dafilmscom%20link%20extractor.meta.js
// ==/UserScript==


if ($(".pagination").length > 0) {
    var timer = 0;
    var links = [];
    var currPage = $("body").html();

    function fetchButton() {
        var interval = 2000;
        timer = setInterval(function() {
            BidClick();
        }, interval);
    }

    function fetchDoc() {

        $("#article .article", $(currPage)).each(function(i, v) {
            var link = "http://dafilms.com" + $("h3 > .upper", $(this)).attr("href");
            links.push(link);
        });

        if ($(".disabled.next", $(currPage)).length > 0) {
            clearInterval(timer);
            timer = "";
        } else {
            var next = $(".current.page").next("a").attr("href");

            $.ajax({type: "GET",
                url: "http://dafilms.com/film/" + next,
                async: false,
                success: function(response) {
                    currPage = $("body", $(response)).html();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                }
            });
        }
    }


} else {
    var html = $("body").html();
    var linkStart = html.indexOf("http://stream.dafilms.com/video.mp4?");
    var link;
    if (linkStart === -1) {
        link = "Not found. Be sure to click 'Play' first.";
    } else {
        var linkEnd = html.indexOf("'", linkStart);
        link = html.substring(linkStart, linkEnd);
    }

    $(".movie-top-info").append("<p>DOWNLOAD LINK:</p>" + link);
}