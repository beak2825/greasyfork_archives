// ==UserScript==
// @name        CH Turkopticon Page Titles Plus
// @author      clickhappier
// @namespace   clickhappier
// @description Change Turkopticon page titles to be more specific and consistent, and display them as heading text within the page too. Also adds review permalinks and other navigation improvements, and shortens long edit notes.
// @version     1.6c
// @require     http://code.jquery.com/jquery-latest.min.js
// @include     http://turkopticon.ucsd.edu/*
// @include     https://turkopticon.ucsd.edu/*
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/6524/CH%20Turkopticon%20Page%20Titles%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/6524/CH%20Turkopticon%20Page%20Titles%20Plus.meta.js
// ==/UserScript==


var original_title = document.title;

// de-dotting and un-untitling
if ( original_title == "turkopticon." || original_title == "" )
{
    original_title = "turkopticon";
}


// get URL variable - from http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for ( var i=0; i<vars.length; i++ ) 
    {
        var pair = vars[i].split("=");
        if ( pair[0] == variable )
            { return pair[1]; }
    }
    return(false);
}


// append heading-esque text from page content:
// all reviews, most recent first
if ( ( document.location.href.indexOf('/reports') > -1 ) && ( document.location.href.indexOf('reports?id') < 0 ) && ( document.location.href.indexOf('hidden=true') < 0 ) )  
{
	document.title = "turkopticon : all reviews";
	if ( document.location.href.indexOf('page=') > -1 )  // multi-page results
	{
	   document.title = document.title + ", page " + getQueryVariable('page');
	}
}
// all requester averages
else if ( document.location.href.indexOf('/requesters') > -1 )  
{
	document.title = "turkopticon : all requesters averages";
	if ( document.location.href.indexOf('page=') > -1 )  // multi-page results
	{
	   document.title = document.title + ", page " + getQueryVariable('page');
	}
}
// all flagged reviews, most recent first
else if ( ( document.location.href.indexOf('/flagged') > -1 ) && ( document.location.href.indexOf('/flagged_by') < 0 ) )  
{
	document.title = "turkopticon : all flagged reviews";
	if ( document.location.href.indexOf('page=') > -1 )  // multi-page results
	{
	   document.title = document.title + ", page " + getQueryVariable('page');
	}
}
// search results
else if ( document.location.href.indexOf('_search') > -1 )  
{
	document.title = original_title + " : " + $('p:contains("Search results")').first().text().trim().replace(":", "");
}
// individual review permalink
else if ( ( $('div.strong').first().text().trim() != "" ) && ( document.location.href.indexOf('get_report/') > -1 ) )  
{
	document.title = original_title + " : review about " + $('div.strong').first().text().trim() + " by " + $('div.posted_by a').first().text().trim();
	if ( $('td.hidden_notice').first().text().trim() != "" )
	{
	   document.title = document.title + " (hidden)";
	}
}
// a requester reviews page, not an all-by-this-user page
else if ( ( $('div.strong').first().text().trim() != "" ) && ( document.location.href.indexOf('by/') < 0 ) && ( document.location.href.indexOf('/my_') < 0 ) )  
{
	document.title = original_title.replace("eport", "eview") + " about " + $('div.strong').first().text().trim();
	if ( document.location.href.indexOf('page=') > -1 )  // multi-page results
	{
	   document.title = document.title + ", page " + getQueryVariable('page');
	}
	if ( document.location.href.indexOf('hidden=true') > -1 )  // hidden reviews
	{
	   document.title = document.title + " (hidden)";
	}
}
// post a review
else if ( original_title == "turkopticon : add report" )  
{
    document.title = original_title.replace("eport", "eview") + " about " + document.getElementById('requester_amzn_name').value + " (" + document.getElementById('requester_amzn_id').value + ")";
}
// post or edit a comment
else if ( document.location.href.indexOf('_comment/') > -1 )  
{
	document.title = original_title + " - " + $('h1').first().text().trim().replace("eport", "eview") + " about " + $('div.report p').first().text().replace("AMT Requester Name & ID", "").trim();
	if ( document.location.href.indexOf('/add_comment/') > -1 )  // post a comment
	{
	   document.title = document.title.replace("turkopticon", "turkopticon : add comment");
	}
}
// all of a user's reviews (/by/uid), comments (/comments_by/uid), flags (/flagged_by/), or comments & flags (/all_by/uid)
else if ( document.location.href.indexOf('by/') > -1 )  
{
	document.title = original_title.replace("eport", "eview");
	if ( document.location.href.indexOf('page=') > -1 )  // multi-page results
	{
	   document.title = document.title + ", page " + getQueryVariable('page');
	}
}
// edit a review
else if ( document.location.href.indexOf('/edit/') > -1 )  
{
	document.title = original_title.replace("eport", "eview");
}
// login
else if ( document.location.href.indexOf('/login') > -1 )  
{
	document.title = original_title + " : login";
}
// homepage
else if ( ( document.location.href == "http://turkopticon.ucsd.edu/" ) || ( document.location.href == "https://turkopticon.ucsd.edu/" ) )
{
	document.title = original_title + " : home";
}
// rules, old blog
else if ( $('h1').first().text().trim() != "" )  
{
	document.title = original_title + " : " + $('h1').first().text().trim();
}
// settings
else if ( $('h2').first().text().trim() != "" )  
{
	document.title = original_title + " : " + $('h2').first().text().trim();
}


// make 'Reviews' in nav header always be a link to 'all reviews' page
$('#nav div').first().html('<a href="/requesters">Requester List</a> &nbsp; <a href="/reports">Reviews</a>');


// add permalink for each individual review - adapted from Kerek's 'MTurk Auto-Accept changer for mturkgrind.com'
$('a[href*="/main/add_comment/"]').each(function()
{
    var reviewPermalink = $(this).attr('href').replace("/main/add_comment/", "/get_report/");
    var link_html = "&nbsp; |&nbsp; <a href='" + reviewPermalink + "'>permalink</a>";
    $(this).after(link_html);    // was .append; .after is better
});


// improve title and add a review-posting link to error page for a requester with no reviews yet
if ( $('h1').first().text().indexOf('RecordNotFound') > -1 )
{
    var reqID = $('pre').first().text().replace("Couldn't find Requester with ID=", "");
    document.title = "turkopticon : no reviews found for " + reqID ;
    var reviewLink = '<h2><a href="https://turkopticon.ucsd.edu/report?requester[amzn_id]=' + reqID + '&requester[amzn_name]=">Post the first review for this requester (must enter requester name manually).</a></h2>';
    $('pre').first().after(reviewLink);
}


// display page title as heading text within the page too
if ( $('div#nav').text().length > 0 )
{
    $('div#nav').after('<h1 align="center" style="line-height:normal;" id="ch-pagetitle">' + document.title + '</h1>');

    // add user content links
    if ( document.location.href.indexOf('/by/') > -1 )
    {
        $('#ch-pagetitle').after('<p align="center" id="ch-usercontentlinks"><a href="' + document.location.href.replace('/by/', '/comments_by/').replace(/\?.+/, '') + '">comments by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/by/', '/flagged_by/').replace(/\?.+/, '') + '">flags by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/by/', '/all_by/').replace(/\?.+/, '') + '">comments & flags by this user</a></p><br>');
    }
    if ( document.location.href.indexOf('/comments_by/') > -1 )
    {
        $('#ch-pagetitle').after('<p align="center" id="ch-usercontentlinks"><a href="' + document.location.href.replace('/comments_by/', '/by/') + '">reviews by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/comments_by/', '/flagged_by/') + '">flags by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/comments_by/', '/all_by/') + '">comments & flags by this user</a></p><br>');
    }
    if ( document.location.href.indexOf('/flagged_by/') > -1 )
    {
        $('#ch-pagetitle').after('<p align="center" id="ch-usercontentlinks"><a href="' + document.location.href.replace('/flagged_by/', '/by/') + '">reviews by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/flagged_by/', '/comments_by/') + '">comments by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/flagged_by/', '/all_by/') + '">comments & flags by this user</a></p><br>');
    }
    if ( document.location.href.indexOf('/all_by/') > -1 )
    {
        $('#ch-pagetitle').after('<p align="center" id="ch-usercontentlinks"><a href="' + document.location.href.replace('/all_by/', '/by/') + '">reviews by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/all_by/', '/comments_by/') + '">comments by this user</a> &nbsp;|&nbsp; <a href="' + document.location.href.replace('/all_by/', '/flagged_by/') + '">flags by this user</a></p><br>');
    }
}


// shorten edit notes and fix alignment
$('p.notes').css({'text-indent':'0px', 'width':'305px', 'max-height':'1.2em', 'overflow-x':'visible', 'overflow-y':'hidden'});  // max height of 1 line
// designate edit notes with 2 or more lines (there's a <br> at end of each line) as long
$('p.notes').has('br:nth-of-type(2)').addClass('longNotes');
// add ellipsis after shortened notes
$('p.longNotes').after('<p class="ellipsis" style="text-align:center; font-weight:bold; line-height:0.25em; margin-top:-0.5em; margin-bottom:0.5em;" title="Hover your mouse over the shortened edit notes above, to temporarily show the full edit notes. Click on these dots to permanently (until refresh) show the full edit notes.">&middot;&middot;&middot;</p>');
// hover to temp-reveal full edit notes and hide ellipsis
$('p.longNotes').hover( function(){ $(this).css({'max-height':'100%', 'overflow-y':'visible'}); $(this).next('p.ellipsis').hide(); },  // on mouseover of shortened edit notes, temp-reveal full edit notes and hide ellipsis
                        function(){ $(this).css({'max-height':'1.2em', 'overflow-y':'hidden'}); $(this).next('p.ellipsis').show(); });  // on mouseout of full edit notes, hide full notes (re-shorten) and show ellipsis
// click ellipsis to perma-reveal full edit notes and hide ellipsis
$('p.ellipsis').click( function(){ $(this).hide();  // when ellipsis is clicked, hide ellipsis
                                   $(this).prev('p.longNotes').css({'max-height':'100%', 'overflow-y':'visible'});  // and perma-reveal full edit notes
                                   $(this).prev('p.longNotes').unbind('mouseover mouseleave');  // and deactivate hover functions
                                 });


// change page navigation links to version that doesn't trigger 'mmmturkeybacon Add Contact Link to Turkopticon', if 'CH Turkopticon Page Titles Plus' runs before it in the execution order
$('div.pagination a[href*="reports"]').each( function(){
    var newReportsLink = $(this).attr('href').replace("/reports?id=", "/").replace("&page", "?page");
    $(this).attr('href', newReportsLink);
});

// replicate page navigation links from bottom to top of page
if ( $('div.pagination').eq(0).text().length > 0 )
{
    var pageNavContent = $('div.pagination')[0].innerHTML;  // get the div.pagination nested inside the first div.pagination
    $('div.box').has('table#reports').prepend( pageNavContent );
}
