// ==UserScript==
// @name        CH Requester Results Refinements
// @author      clickhappier
// @namespace   clickhappier
// @description Use the MTurk 'All HITs' search filter options on individual requester results pages too. Displays which filter settings you used, and adds contact and TO links, even on 'no results' requester pages. 
// @version     1.0.1c
// @match       https://www.mturk.com/mturk/searchbar?*
// @match       https://www.mturk.com/mturk/viewsearchbar?*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/8617/CH%20Requester%20Results%20Refinements.user.js
// @updateURL https://update.greasyfork.org/scripts/8617/CH%20Requester%20Results%20Refinements.meta.js
// ==/UserScript==


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

// set URL variable - from http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter/15023688#15023688
function setQueryVariable(uri, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
    if (uri.match(re)) 
    {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } 
    else 
    {
        var hash =  '';
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";    
        if( uri.indexOf('#') !== -1 )
        {
            hash = uri.replace(/.*#/, '#');
            uri = uri.replace(/#.*/, '');
        }
        return uri + separator + key + "=" + value + hash;
    }
}


// variables for getting data
var isReqPage = "no";
var requesterIdQueryVar = "";
var requesterNameFromPage = "";
var requesterNameQueryVar = "";
var requesterNameFormInput = "";
var keywordQueryVar = "";
var keywordFormInput = "";
var minpayQueryVar = "";
var minpayFormInput = "";
var qualifiedQueryVar = "";
var qualifiedFormInput = "";
var mastersQueryVar = "";
var mastersFormInput = "";
var sorttypeQueryVar = "";
var sorttypeFormInput = "";
var reqsortFormInput = "";
// variables for output strings
var displayFilterString = "";
var requesterLinks = "";
var reqFilterInterface = "";
var filteredReqUrl = "";


// verify which type of page this is
if ( (getQueryVariable('requesterId')) && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) )  // requester results page
{
    isReqPage = "yes-results";
    requesterIdQueryVar = getQueryVariable('requesterId');
}
else if ( (getQueryVariable('requesterId')) && ($('td.error_title').text().trim().indexOf('Your search did not match any HITs.') > -1) )  // no search results page
{
    isReqPage = "yes-noresults";
    requesterIdQueryVar = getQueryVariable('requesterId');
}


// retrieve info for display
if ( (isReqPage == "yes-results") || (isReqPage == "yes-noresults") )
{
    if ( getQueryVariable('prevRequester') )
        { requesterNameQueryVar = decodeURIComponent(getQueryVariable('prevRequester')).replace(/\+/g," "); }
    if ( getQueryVariable('searchWords') )
        { keywordQueryVar = decodeURIComponent(getQueryVariable('searchWords')).replace(/\+/g," "); }
    if ( getQueryVariable('minReward') )
        { minpayQueryVar = getQueryVariable('minReward'); }
    if ( getQueryVariable('qualifiedFor') )
        { qualifiedQueryVar = getQueryVariable('qualifiedFor'); }
    if ( getQueryVariable('requiresMasterQual') )
        { mastersQueryVar = getQueryVariable('requiresMasterQual'); }
    if ( getQueryVariable('sortType') )
        { sorttypeQueryVar = decodeURIComponent(getQueryVariable('sortType')); }
    if ( isReqPage == "yes-results" )
        { requesterNameFromPage = $('td.title_orange_text_bold').text().trim().replace("HITs Created by '","").replace("'",""); }

    // build output string
    displayFilterString = "HITs by ";
    if ( requesterNameFromPage != "" )
        { displayFilterString += requesterNameFromPage + " (" + requesterIdQueryVar + ")"; }
    else if ( requesterNameQueryVar != "" )
        { displayFilterString += requesterNameQueryVar + " (" + requesterIdQueryVar + ")"; }
    else
        { displayFilterString += "requester ID " + requesterIdQueryVar; }
    if ( keywordQueryVar != "" )
        { displayFilterString += ", containing '" + keywordQueryVar + "'"; }
    if ( (minpayQueryVar != "") && (minpayQueryVar != "0.00") )
        { displayFilterString += ", that pay at least $" + minpayQueryVar; }
    if ( (qualifiedQueryVar != "") && (qualifiedQueryVar != "off") )
        { displayFilterString += ", for which you are qualified"; }
    if ( (mastersQueryVar != "") && (mastersQueryVar != "off") )
        { displayFilterString += ", which require Masters"; }
    if ( (sorttypeQueryVar != "") )
    { 
        displayFilterString += ", sorted by "; 
        switch(sorttypeQueryVar)
        {
            case "LastUpdatedTime:0":               displayFilterString += "HIT Creation Date (oldest first)";  break;
            case "LastUpdatedTime:1":               displayFilterString += "HIT Creation Date (newest first)";  break;
            case "NumHITs:0":                       displayFilterString += "HITs Available (fewest first)";     break;
            case "NumHITs:1":                       displayFilterString += "HITs Available (most first)";       break;
            case "Reward:0":                        displayFilterString += "Reward Amount (least first)";       break;
            case "Reward:1":                        displayFilterString += "Reward Amount (most first)";        break;
            case "LatestExpiration:0":              displayFilterString += "Expiration Date (soonest first)";   break;
            case "LatestExpiration:1":              displayFilterString += "Expiration Date (latest first)";    break;
            case "Title:0":                         displayFilterString += "Title (A-Z)";                       break;
            case "Title:1":                         displayFilterString += "Title (Z-A)";                       break;
            case "AssignmentDurationInSeconds:0":   displayFilterString += "Time Allotted (least first)";       break;
            case "AssignmentDurationInSeconds:1":   displayFilterString += "Time Allotted (most first)";        break;
            default:                                displayFilterString += "unknown value " +sorttypeQueryVar;  break;
        }
    }
}


// build contact and TO links
if ( requesterIdQueryVar != "" )
{
    if ( requesterNameQueryVar != "" )
    {
        requesterLinks = ' - <a href="https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT&requesterId=' 
                        + requesterIdQueryVar + '&requesterName=' + encodeURIComponent(requesterNameQueryVar).replace(/%20/g,"+") + '">Contact</a>'
                        + ' - <a href="http://turkopticon.ucsd.edu/' + requesterIdQueryVar + '">TO Reviews</a>';
    }
    else if ( requesterNameFromPage != "" )
    {
        requesterLinks = ' - <a href="https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT&requesterId=' 
                        + requesterIdQueryVar + '&requesterName=' + encodeURIComponent(requesterNameFromPage).replace(/%20/g,"+") + '">Contact</a>'
                        + ' - <a href="http://turkopticon.ucsd.edu/' + requesterIdQueryVar + '">TO Reviews</a>';
    }
    else
    {
        requesterLinks = ' - <a href="https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT&requesterId=' 
                        + requesterIdQueryVar + '">Contact</a>'
                        + ' - <a href="http://turkopticon.ucsd.edu/' + requesterIdQueryVar + '">TO Reviews</a>';
    }
}


// add current filter info and links to page
if (isReqPage == "yes-results")
{
    $('td.title_orange_text').first().parent().after('<tr><td><p style="font-size:13px; color:#CC6600; padding-top:1ex; padding-bottom:1ex;">' + displayFilterString + requesterLinks + '</p></td></tr>');
}
else if (isReqPage == "yes-noresults")
{
    $('td.blue_text_14').prepend('<p style="font-size:14px;">' + displayFilterString + requesterLinks + '</p><br>');
}


// build filter interface
if ( (isReqPage == "yes-results") || (isReqPage == "yes-noresults") )
{
    // begin div/paragraph
    reqFilterInterface = '<div id="requesterFilterInterface" style="display:inline-block; background-color:#8CBCD3; margin-top:-12px; margin-right:-33px; border-left:28px solid #8CBCD3; border-right:28px solid #8CBCD3;"><p>';

    // build prevRequester-applier textbox
    reqFilterInterface += '<input id="reqName" name="reqName" type="text" style="width:320px; line-height:15px; height:15px;" value="';
    if ( requesterNameQueryVar != "" )
        { reqFilterInterface += requesterNameQueryVar; }
    else if ( requesterNameFromPage != "" )
        { reqFilterInterface += requesterNameFromPage; }
    reqFilterInterface += '" title="Requester name to be added to URL as prevRequester value, for reference."></input>';

    // build submit button
    reqFilterInterface += '&nbsp;<button id="reqFilterButton" style="font-size:10px; font-family:Verdana,Arial,sans-serif; padding: 1px 6px 1px 6px; border:3px;" title="Apply the above filter options to this individual requester\'s results. If no filter settings specified, still add the prevRequester name to the URL for reference.">Apply Filters To Requester</button>&nbsp;';

    // build re-sort checkbox
    reqFilterInterface += '<input id="reqSort" name="reqSort" type="checkbox" value="yes" title="When applying filters, also re-sort results with selected \'Sort by\' option below."></input>';
    reqFilterInterface += '<label for="reqSort" title="When applying filters, also re-sort results with selected \'Sort by\' option below." style="color:white; font-weight:bold;">re-sort</label>';

    // build replacement sort selector for no-results pages
    if ( isReqPage == "yes-noresults" )
    {
        reqFilterInterface += '<br><br><span style="float:right;"><label for="sortType" style="color:white; font-weight:bold;">Sort by: </label>'
                            + '<select name="sortType" size="1" align="right">'
                            + '<option value="LastUpdatedTime:0">HIT Creation Date (oldest first)</option>'
                            + '<option value="LastUpdatedTime:1">HIT Creation Date (newest first)</option>'
                            + '<option value="NumHITs:0">HITs Available (fewest first)</option>'
                            + '<option value="NumHITs:1">HITs Available (most first)</option>'
                            + '<option value="Reward:0">Reward Amount (least first)</option>'
                            + '<option value="Reward:1">Reward Amount (most first)</option>'
                            + '<option value="LatestExpiration:0">Expiration Date (soonest first)</option>'
                            + '<option value="LatestExpiration:1">Expiration Date (latest first)</option>'
                            + '<option value="Title:0">Title (A-Z)</option>'
                            + '<option value="Title:1">Title (Z-A)</option>'
                            + '<option value="AssignmentDurationInSeconds:0">Time Allotted (least first)</option>'
                            + '<option value="AssignmentDurationInSeconds:1">Time Allotted (most first)</option></select></span><br><br>';
    }

    // close div/paragraph
    reqFilterInterface += '</p></div>';

    // add interface to page
    $('div#searchbar').after(reqFilterInterface);
    
    // change sort selector based on existing query string
    if ( sorttypeQueryVar != "" )
        { $('select[name=sortType]').val(sorttypeQueryVar); }
    else  // normal default of 'HIT Creation Date (newest first)'
        { $('select[name=sortType]').val('LastUpdatedTime:1'); }
}


// add filter action
if ( $('#requesterFilterInterface').length > 0 )
{
    $('button#reqFilterButton').click(function() 
    {
        // get form inputs for filter settings
        requesterNameFormInput = $('input#reqName').val();
        keywordFormInput = $('input#searchbox').val();
        minpayFormInput = $('input[name=minReward]').val();
        qualifiedFormInput = $('input#qualified_for').is(':checked');
        mastersFormInput = $('input#master_qual').is(':checked');
        sorttypeFormInput = $('select[name=sortType]').val();
        reqsortFormInput = $('input#reqSort').is(':checked');
        
        // build filtered URL
        filteredReqUrl = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups";
        filteredReqUrl += "&requesterId=" + requesterIdQueryVar;
        if ( requesterNameFormInput != "" )
            { filteredReqUrl += "&prevRequester=" + encodeURIComponent(requesterNameFormInput).replace(/%20/g,"+"); }
        if ( keywordFormInput != "" )
            { filteredReqUrl += "&searchWords=" + encodeURIComponent(keywordFormInput).replace(/%20/g,"+"); }
        if ( (minpayFormInput != "") && (minpayFormInput != "0.00") )
            { filteredReqUrl += "&minReward=" + minpayFormInput; }
        if ( qualifiedFormInput != "" )
            { filteredReqUrl += "&qualifiedFor=on"; }
        if ( mastersFormInput != "" )
            { filteredReqUrl += "&requiresMasterQual=on"; }
        if ( reqsortFormInput != "" )
            { filteredReqUrl += "&sortType=" + sorttypeFormInput; }

        // redirect to filtered URL
        window.location.href = filteredReqUrl;
    });
}


// override sort button action to not unnecessarily go to icky searchSpec URL format that this script can't work on,
// but only if you're not on a page of results beyond the first (using viewsearchbar? instead of searchbar?), 
// at which point you must use the icky format or it won't have any effect
if ( ($('form#sortresults_form').length > 0) && (window.location.href.indexOf('viewsearchbar') < 0) )
{
    $('form#sortresults_form').on('submit', function(e){
        // override existing form action
        e.preventDefault();
        e.returnValue = false;
        // get sortType selection
        sorttypeFormInput = $('select[name=sortType]').val();
        var nonHashUrl = (window.location.href).split('#');
        // redirect to sorted or re-sorted URL
        if ( getQueryVariable('sortType') )
            { window.location.href = setQueryVariable(window.location.href, 'sortType', sorttypeFormInput); }
        else
            { window.location.href = nonHashUrl[0] + '&sortType=' + sorttypeFormInput; }
    });
}


// append the otherwise-useless searchbar?-style variables with usable data to the page-number-navigation links 
// on results pages, so they will be retained for display purposes on pages beyond the first
if ( isReqPage == "yes-results" )
{
    $('a[href^="/mturk/viewsearchbar"]').each(function()
    {
        var oldLinkUrl = $(this).attr('href');
        var newLinkUrl = "";
        // build supplemented nav links
        newLinkUrl = setQueryVariable(oldLinkUrl, 'requesterId', requesterIdQueryVar);
        if ( requesterNameQueryVar != "" )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'prevRequester', encodeURIComponent(requesterNameQueryVar).replace(/%20/g,"+") ); }
        if ( keywordQueryVar != "" )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'searchWords', encodeURIComponent(keywordQueryVar).replace(/%20/g,"+") ); }
        if ( (minpayQueryVar != "") && (minpayFormInput != "0.00") )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'minReward', minpayQueryVar); }
        if ( qualifiedQueryVar == "on" )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'qualifiedFor', "on"); }
        if ( mastersQueryVar == "on" )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'requiresMasterQual', "on"); }
        if ( sorttypeQueryVar != "" )
            { newLinkUrl = setQueryVariable(newLinkUrl, 'sortType', sorttypeQueryVar); }
        // apply completed url
        $(this).attr('href', newLinkUrl);
    });
}