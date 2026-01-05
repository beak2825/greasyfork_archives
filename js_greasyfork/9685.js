// ==UserScript==
// @name         RYM: Label page filters
// @namespace    https://rateyourmusic.com/~pandrew
// @version      0.1
// @description  apply various filters to label pages
// @author       Ayn Pand
// @match        https://rateyourmusic.com/label/*
// @match        http://rateyourmusic.com/label/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/9685/RYM%3A%20Label%20page%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/9685/RYM%3A%20Label%20page%20filters.meta.js
// ==/UserScript==

var filterButton = $('#filter_va');

$(filterButton).parent().before('<span style="float: none;">Min Average Rating:&nbsp;</span>');
$(filterButton).parent().before('<input type="text" id="minAvg" size="4" maxlength="4" style="float: none; height: 10px; font-size: 10px;">');
$(filterButton).parent().before('<span style="float: none;">&nbsp;|&nbsp;</span>')
document.getElementById('minAvg').addEventListener('change', filterReleases, false);

$(filterButton).parent().before('<span style="float: none;">Min No. Ratings:&nbsp;</span>');
$(filterButton).parent().before('<input type="text" id="minRatings" size="5" maxlength="5" style="float: none; height: 10px; font-size: 10px;">');
$(filterButton).parent().before('<span style="float: none;">&nbsp;|&nbsp;</span>');
document.getElementById('minRatings').addEventListener('change', filterReleases, false);


function filterReleases(){
    $.each($('a[href*="/release/"]'), function(){
        var minAvgFlt = parseFloat($("#minAvg").val());
        var minRatingsNum = parseInt($("#minRatings").val());

        //if (isNaN(minAvgFlt)) {minAvgFlt = 0.5;}
        if (isNaN(minRatingsNum)) {minRatingsNum = 0;}
        row = $(this).parent().parent();

        var ratings = parseInt($(row).find('td:eq(5)').text());
        var rating = parseFloat($(row).find('td:eq(7)').text());

        //if (isNaN(minAvgFlt)) {minAvgFlt = 0.5;}
        if (isNaN(ratings)) {ratings = 0;}

        if ((ratings == "" || ratings < minRatingsNum) || (rating == undefined || rating < minAvgFlt)){
            $(row).hide()
            } else {
                $(row).show()
            }
    })
}