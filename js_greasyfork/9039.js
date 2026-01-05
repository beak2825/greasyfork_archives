// ==UserScript==
// @name        AMT Titles
// @author      xorith
// @namespace   https://greasyfork.org/users/10206
// @description Splice and Modify of CH MTurk Page Titles and mTurk Title Bar Timer
// @version     1.0.3
// @match       http://www.mturk.com/*
// @match       https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/9039/AMT%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/9039/AMT%20Titles.meta.js
// ==/UserScript==

// Prefix - Change as needed. 
// Will move these into some sort of settings storage later.
// prefixOnHITs - keep false for no prefix on HITs.

var prefix = "AMT - ";
var prefixOnHITs = false;
var prefixOnPages = true;

var new_title = "";
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

// for URL used by https://greasyfork.org/scripts/2002-hit-scraper-with-export
if ( document.location.href.indexOf('hit_scraper') > -1 )  
{
    new_title = "HIT Scraper";
}
//  Special for dashboard
else if ( document.location.href.indexOf('dashboard') > -1 )
{
    new_title = "Dashboard";
}
// Special for "Your HITs"
else if ( document.location.href.indexOf('myhits') > -1 )
{
    new_title = "My HITs";
}

// search results pages with some kind of results
else if ( $('td.title_orange_text_bold').text().trim() != "" )  
{
    // if redirected to 'all HITs' search results from preview/panda link with no more HITs available;
    // if not already included in the URL from accepting a previous HIT in the group, can make a note
    // of the requester name by adding a prevRequester value to the URL yourself; use + signs for spaces
    if ( (document.location.href.indexOf('prevRequester=') > -1) && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') < 0) )  
    {
        new_title = "Was " + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " - " + $('td.title_orange_text').text().trim();
    }
    // on a requester search results page with results, with prevRequester value available, no keyword
    // (add a hash/pound sign to indicate it's been prevRequester-ed already)
    else if ( (document.location.href.indexOf('prevRequester=') > -1) && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) && (document.getElementById('searchbox').value == "") )  
    {
	    new_title = $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " # - " + $('td.title_orange_text').text().trim();
	}
    // requester results with keyword and prevRequester available
    // (add a hash/pound sign to indicate it's been prevRequester-ed already)
    else if ( (document.location.href.indexOf('prevRequester=') > -1) && (document.getElementById('searchbox').value != "") && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) )  
    {
	    new_title = $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " containing '" + document.getElementById('searchbox').value + "' # - " + $('td.title_orange_text').text().trim();
	}
    // requester results with keyword, prevRequester not available
    else if ( (document.location.href.indexOf('prevRequester=') < 0) && (document.getElementById('searchbox').value != "") && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) )  
    {
	    new_title = $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " containing '" + document.getElementById('searchbox').value + "' - " + $('td.title_orange_text').text().trim();
	}
	// requester results without keyword and without prevRequester available, or 'all HITs'-type/keyword-only search results
    else
    {
	    new_title = $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " - " + $('td.title_orange_text').text().trim();
	    // if on pages of 'All HITs Available To You' past the first, which lose that distinguishment from the general 'All HITs'
	    if ( (document.location.href.indexOf('viewhits') > -1) && ($('a.nonboldsubnavclass').first().text().trim() == "HITs Available To You") )
	    {
	       new_title = "All HITs Available To You - ";
	    }
	}
}

// individual HIT/qual pages
else if ( $('td.capsulelink_bold').text().trim() !== "" )  
{
    if ( $('td.capsule_field_text').first().text().trim() !== "" )
    {
        // qual page
        if ( document.location.href.indexOf('qualification') > -1 )  
        {
            new_title = "Qual by " + $('td.capsule_field_text').first().text().trim() + " - " + $('td.capsulelink_bold').text().trim();
        }
        // HIT page
        else  
        {
			// Respect HIT pages
			if(prefixOnHITs === false)
				prefixOnPages = false;
            // captcha-ed HIT
            if ( $('a[class="whatis"][href*="whatAreCaptchas"]').text().trim() !== "" )
            {
                new_title = "!!!CAPTCHA!!!  [" + $('td.capsulelink_bold').text().trim() + "] [" + $('td.capsule_field_text').first().text().trim() + "]";
            }
            // accepted HIT (Note: Timer will be in front)
            else if ( $('a[href*="mturk/return"]').length > 0 )
            {
                new_title = "[" + $('td.capsulelink_bold').text().trim() + "] [" + $('td.capsule_field_text').first().text().trim() + "]";
            }
            // regular preview page
            else
            {
                new_title = "Viewing [" + $('td.capsulelink_bold').text().trim() + "] [" + $('td.capsule_field_text').first().text().trim() + "]";
            }
        }
    }
    else
    {
	    new_title = $('td.capsulelink_bold').text().trim();
	}
}

// contact pages
else if ( $('div.contactus form p').first().text().trim() !== "" )  
{
    // contact requester pages
	if ( document.location.href.indexOf('requesterId=') > -1 )  
	{
	    new_title = $('div.contactus form p').first().text().trim() + " (" + getQueryVariable("requesterId") + ")";
	    // add requester ID to in-page heading text too
	    if ( getQueryVariable("requesterName") )
	    {
	       $('div.contactus form p').first().text("Contact Requester: " + decodeURIComponent( getQueryVariable("requesterName").replace(/\+/g, " ") ) + " (" + getQueryVariable("requesterId") + ")" );
	    }
	    // replace confusing 'Contact Requester "" ' line with a statement of the ID when there's no name provided in the URL to use
	    else
	    {
	       $('div.contactus form p').first().text("Contact Requester ID: " + getQueryVariable("requesterId") );
	    }
	}
	// contact mturk page
	else  
	{
	    new_title = $('div.contactus form p').first().text().trim();
	}
}

// status/earnings pages
else if ( $('td.white_text_14_bold').text().trim() !== "" )  
{
	new_title = $('td.white_text_14_bold').contents().filter(function(){return this.nodeType == 3;})[0].nodeValue.trim();  // exclude text inside another layer of nested tags such as 'a' or 'span'
}

// no search results pages, other error pages
else if ( $('td.error_title').text().trim() != "" )  
{
    // requester id search with added keyword filter, with no results
    if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('requesterId=') > -1) )
    {
        new_title = original_title + "HITs by '" + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + "' containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim() + " - "  + getQueryVariable("requesterId").replace(/\+/g, " ");
    }
    // keyword search for HITs with no results
    else if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('selectedSearchType=quals') < 0) )  
    {
        new_title = original_title + "HITs containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim();
    }
    // keyword search for quals with no results
    else if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('selectedSearchType=quals') > -1) )  
    {
        new_title = original_title + "Quals containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim();
    }
    // requester id search with no results
    else if ( document.location.href.indexOf('requesterId=') > -1 )  
    {
        if ( document.location.href.indexOf('prevRequester=') > -1 )  // doesn't appear in these URLs on its own, but can make a note of the requester name by adding this value to the URL yourself; use + signs for spaces
        {
            new_title = "HITs by '" + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + "' - " + $('td.error_title').text().trim() + " - "  + getQueryVariable("requesterId").replace(/\+/g, " ");
        }
        else
        {
            new_title = "HITs by ID " + getQueryVariable("requesterId").replace(/\+/g, " ") + " - " + $('td.error_title').text().trim();
        }
    }
    // other error pages
    else  
    {
	    new_title = $('td.error_title').text().trim();
	}
}
// help/policies pages
else if ( $('div.title_orange_text_bold').text().trim() != "" )  
{
	new_title = $('div.title_orange_text_bold').text().trim();
}
// report-a-HIT confirmation pages
else if ( $('span#alertboxHeader').text().trim() != "" )  
{
	new_title = $('span#alertboxHeader').text().trim();
}
// for URL used by https://greasyfork.org/scripts/4188-mturk-qualsorter
else if ( document.location.href.indexOf('/qualtable') > -1 )  
{
	new_title = "QualSorter Table";
}



// Build the title
if(prefixOnPages)
	new_title = prefix + new_title;
document.title = new_title;


// Timer Code - After we build the new title
var original_title = document.title;
var st = unsafeWindow.serverTimestamp;
var et = unsafeWindow.endTime;
var timer_id;
var offset;

if (st && et) {
	timer_id = setInterval(function() {
		if (!offset) { offset = (new Date()).getTime() - st; }
		var left = Math.floor((et.getTime() - (new Date()).getTime() + offset) / 1000);
		var days = Math.floor(left / (86400));
		var hours = Math.floor(left / 3600) % 24;
		var mins = Math.floor(left / 60) % 60;
		var secs = left % 60;
        document.title = "[" + (days === 0 ? "" : days + ":") + (hours === 0 ? "" : hours + ":") + ("0" +mins).slice(-2) + ":" + ("0" +secs).slice(-2) + "] " + original_title;
		// new_title = "[" + days + ":" + hours + ":" + ("0" +mins).slice(-2) + ":" + ("0" +secs).slice(-2) + "] " + original_title;
	}, 1000);
}

