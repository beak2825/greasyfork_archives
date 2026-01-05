// ==UserScript==
// @name        CH Status Detail Numbering
// @author      clickhappier
// @namespace   clickhappier
// @description Displays numbering next to the up-to-25 HITs on each page of MTurk's daily status detail reports. Also shows HIT assignment ID in mouseover text, and copies it on click.
// @version     1.2c
// @include     https://www.mturk.com/mturk/statusdetail*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/9768/CH%20Status%20Detail%20Numbering.user.js
// @updateURL https://update.greasyfork.org/scripts/9768/CH%20Status%20Detail%20Numbering.meta.js
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
// modified to take arbitrary URL input instead of current location:
function getUrlVariable(url, variable)
{
    var query = url.split('?');
    var vars = query[1].split("&");
    for ( var i=0; i<vars.length; i++ ) 
    {
        var pair = vars[i].split("=");
        if ( pair[0] == variable )
            { return pair[1]; }
    }
    return(false);
}


// determine current page number
var pageNum = "";
if ( document.location.href.indexOf('pageNumber') > -1 )
{
    pageNum = getQueryVariable("pageNumber");

    if ( pageNum=='' || isNaN(pageNum) )  // just in case
    { pageNum = 1; }
}
else  // if pageNumber not present in URL, must be first page
{
    pageNum = 1;
}


// add cell to header row for new column
$('th.statusdetailRequesterColumnHeader').before('<th class="statusdetailNumberColumnHeader" title="Click a number to copy the HIT ID to your clipboard.">#</th>');


// add numbering cells to lefthand side of each data row
// script concept and basic part of this function were from Kerek: http://www.mturkgrind.com/posts/562667/
$('td.statusdetailRequesterColumnValue').each(function(hitNum){  // uses hitNum+1 inside this function because it starts counting at 0

    // get HIT ID
    //var contactLinkSplit = $(this).find('a[title="Contact this Requester"]').attr('href').split('&');
    //var hitID = contactLinkSplit[0].replace('/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT+', '');
    // had to change HIT ID retrieval method after Amazon randomly messed with the contact link URL format on the daily status pages in June 2015
    var contactLink = $(this).find('a[title="Contact this Requester"]').attr('href');
    var hitID = getUrlVariable(contactLink, 'subject').replace('Regarding+Amazon+Mechanical+Turk+HIT+', '');

    // calculate multi-page multiplied HIT number
    var multiHitNum = ((pageNum-1)*25) + (hitNum+1);

    // display results
    $(this).before('<td class="statusdetailNumberColumnValue" title="' + hitID + '">' + pageNum + '.' + (hitNum+1) + ' (' + multiHitNum + ')' + '</td>');
});


// copy HIT ID to clipboard when number column value is clicked on
$(".statusdetailNumberColumnValue").click(function(){ 
    if (GM_setClipboard) 
    { 
        GM_setClipboard( $(this).attr('title') ); 
    }
});
