// ==UserScript==
// @name           subtitleLinks
// @version        1.0
// @namespace      akursat.com/script
// @author         akursat
// @description    Basic script for imdb.com.This script is provide to subtitle link of movie.
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include        http://www.imdb.com/title/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/6345/subtitleLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/6345/subtitleLinks.meta.js
// ==/UserScript==

/* @require annotation need version 0.8. You must sure running with Greasemonkey version 0.8.
 */


//Avoiding some conflit.
this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {
       
    //Get title of Movie
    function getTitle() {
            var title = $('h1.header').children('.itemprop').text();
            return title;
        }
    //Create container.
    function createDiv() {
            $('#img_primary').append(
                $('<div/>')
                .attr("id", "container")
                .addClass("container")
                .css("border", "none")
                .css("width", "190px")
                .css("margin-left", "10px")
                .css("margin-top", "10px")
            );
        }
    //Create fav icons.
    function createFavIcon(id, src, href) {
        $('#container').append(
            $('<a/>')
            .attr("id", id)
            .attr("href", href)
            .attr("target", "_blank")
            .html(
                $('<img/>')
                .attr("src", src)
                .css("border","5px;none;")
            )
        );
        $('#' + id).css('padding-left', "10px");
    }

    //Create search links.
    var movie_name = getTitle();
    var turkcealtyazi = "http://www.turkcealtyazi.org/find.php?cat=sub&find=" + movie_name;
    var turkcealtyaziImg = "http://www.turkcealtyazi.org/images/favicon.ico";

    var divxplanet = "http://divxplanet.com/index.php?page=arama&arama=" + movie_name;
    var divxplanetImg = "http://divxplanet.com/favicon.ico";

    var opensubtitle = "http://www.opensubtitles.org/en/search2/sublanguageid-all/moviename-" + movie_name;
    var opensubtitleImg = "http://static.opensubtitles.org/favicon.ico";

    createDiv();
    createFavIcon("turkcealtyaziImg", turkcealtyaziImg, turkcealtyazi);
    createFavIcon("divxplanetImg", divxplanetImg, divxplanet);
    createFavIcon("opensubtitleImg", opensubtitleImg, opensubtitle);

});
