// ==UserScript==
// @name          CH Plaintext HIT Export
// @description   Export HIT information in multi-line plain text format.
// @version       1.7.1c
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/searchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/viewsearchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/sortsearchbar*HITGroup*
// @include       https://www.mturk.com/mturk/preview*
// @exclude       https://www.mturk.com/mturk/findhits?*hit_scraper*
// @grant         GM_setClipboard
// @author        Cristo + clickhappier
// @namespace     mturkgrind
// @downloadURL https://update.greasyfork.org/scripts/7107/CH%20Plaintext%20HIT%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/7107/CH%20Plaintext%20HIT%20Export.meta.js
// ==/UserScript==


// based on 'IRC Export (reformatted output mod)': https://greasyfork.org/en/scripts/6254-irc-export-reformatted-output-mod


var accountStatus = "loggedOut";
if ( !document.getElementById("lnkWorkerSignin") )  // if sign-in link not present
{ 
    accountStatus = "loggedIn"; 
}


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


var caps = document.getElementsByClassName('capsulelink');
for (var c = 0; c < caps.length/2; c++){
    var button = document.createElement('button');
    button.setAttribute("place",c);
    button.textContent = 'TXT';
    button.style.height = '14px';
    button.style.width = '30px';
    button.style.fontSize = '8px';
    button.style.border = '1px solid';
    button.style.padding = '0px';
    button.style.backgroundColor = 'transparent';
    button.title = 'Click to save HIT information to your clipboard in multi-line plaintext format.';
    button.addEventListener("click", display, false);
    document.getElementById('capsule'+c+'-0').parentNode.appendChild(button);
}

function getTO(f){
    var toComp = [];
    var toUrl = 'https://mturk-api.istrack.in/multi-attrs.php?ids='+f;
    var toUrl2 = 'https://turkopticon.ucsd.edu/api/multi-attrs.php?ids='+f;
    var requestTO = new XMLHttpRequest();
    try{   // first try main TO server
        requestTO.onreadystatechange = function () {
            if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
                if (requestTO.responseText.split(':').length > 2) {
                    var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                    for (var t = 0; t < 4; t++) {
                        var arrTo = toInfo[t].split(':');
                        toComp.push(arrTo[1].substring(1,4));
                    }
                } 
                else { toComp = ['-','-','-','-']; }
            }
        };
        requestTO.open('GET', toUrl2, false);
        requestTO.send(null);
        return toComp;
    }
    catch(err){   // if main TO server unavailable, try Miku's TO mirror server (istrack.in)
        try{
            requestTO.onreadystatechange = function () {
                if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
                    if (requestTO.responseText.split(':').length > 2) {
                        var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                        for (var t = 0; t < 4; t++) {
                            var arrTo = toInfo[t].split(':');
                            toComp.push(arrTo[1].substring(1,4));
                        }
                    } 
                    else { toComp = ['-','-','-','-']; }
                }
            };
            requestTO.open('GET', toUrl, false);
            requestTO.send(null);
            return toComp;
        }
        catch(err){   // if both unavailable, return 'na's
            toComp = ['na','na','na','na'];
            return toComp;
        }
    }
}

// output display box
var txtexportdiv = document.createElement('div');
var txtexporttextarea = document.createElement('textarea');
txtexportdiv.style.position = 'fixed';
txtexportdiv.style.width = '500px';
txtexportdiv.style.height = '255px';
txtexportdiv.style.left = '50%';
txtexportdiv.style.right = '50%';
txtexportdiv.style.margin = '-250px 0px 0px -250px';
txtexportdiv.style.top = '300px';
txtexportdiv.style.padding = '5px';
txtexportdiv.style.border = '2px';
txtexportdiv.style.backgroundColor = 'black';
txtexportdiv.style.color = 'white';
txtexportdiv.style.zIndex = '100';
txtexportdiv.setAttribute('id','txtexport_div');
txtexportdiv.style.display = 'none';
txtexporttextarea.style.padding = '2px';
txtexporttextarea.style.width = '500px';
txtexporttextarea.style.height = '230px';
txtexporttextarea.title = 'Plaintext Export Output';
txtexporttextarea.setAttribute('id','txtexport_text');
txtexportdiv.textContent = 'Plaintext Export: Press Ctrl+C to (re-)copy to clipboard. Click textarea to close.';
txtexportdiv.style.fontSize = '12px';
txtexportdiv.appendChild(txtexporttextarea);
document.body.insertBefore(txtexportdiv, document.body.firstChild);
txtexporttextarea.addEventListener("click", function(){ txtexportdiv.style.display = 'none'; }, false);


function display(e){
    var theButton = e.target;
    theButton.style.backgroundColor = "#CC0000";
    
    var capHand = document.getElementById('capsule' + theButton.getAttribute("place") + '-0');
    var tBodies = capHand.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    var thisReq = tBodies.getElementsByClassName('requesterIdentity')[0];
    var thisReqName = thisReq.textContent;
    var thisReqId = "unavailable";  // handle logged-out export requests now that requester ID links are unavailable as of 2015-07-20
    if ( accountStatus == "loggedIn" )
    {
        thisReqId = getUrlVariable(thisReq.parentNode.href, "requesterId");
    }
    
    var thisTitle = capHand.textContent.trim();
    thisTitle = thisTitle.replace(/<(\w+)[^>]*>.*<\/\1>/gi, "").trim();  // addition to strip html tags and their contents, appearing inside the title link (re 10-20-2014 appearance of "<span class="tags"></span>")

    var thisHitGroup = "unavailable";  // handle logged-out export requests for HITs with no preview/notqualified links
    // if hit has a preview or notqualified link
    var thisHitLink = capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.nextSibling;
    if ( thisHitLink.href !== '' )  
    {
        // if this is a preview link
        if ( thisHitLink.href.indexOf('preview') > -1 )
        {
            thisHitGroup = getUrlVariable(thisHitLink.href, "groupId");
        }
        // if this is a notqualified link
        else if ( thisHitLink.href.indexOf('notqualified') > -1 )
        {
            thisHitGroup = getUrlVariable(thisHitLink.href, "hitId");
            // Amazon messed up the notqualified links, now looking like https://www.mturk.com/mturk/notqualified?hitGroupId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX&hitId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX ; and then they flipped the order of these values on 6/2/15
        }
        // if this is a requestqualification link we shouldn't be on, but are anyway because of stuff Amazon screwed with on 6/2/15
        else if ( thisHitLink.href.indexOf('requestqualification') > -1 )
        {
            // go to the next link, the "(why?)" notqualified link instead
            thisHitGroup = getUrlVariable(thisHitLink.nextElementSibling.href, "hitId");
            // Amazon messed up the notqualified links, now looking like https://www.mturk.com/mturk/notqualified?hitGroupId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX&hitId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX ; and then they flipped the order of these values on 6/2/15
        }
    }
    
    var thisReward = tBodies.getElementsByClassName('reward')[0].textContent.trim();

    var thisTimeLimit = tBodies.getElementsByClassName('capsule_field_text')[2].textContent.trim();
    
    var thisHitsAvail = "??";  // handle Amazon removing HITs Available data from logged-out view 2015-07-20
    if ( accountStatus == "loggedIn" ) 
    { 
        thisHitsAvail = tBodies.getElementsByClassName('capsule_field_text')[4].textContent.trim(); 
    }
    
    var thisQualTable = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[2];
    if ( document.location.href.indexOf('?last_hits_previewed') > -1 )  // for compatibility with mmmturkeybacon Last Hits Previewed
    { 
        thisQualTable = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[1]; 
    }
    var thisQualRows = thisQualTable.getElementsByTagName('td');
    var qualStart = 3;  // standard starting row
    if ( accountStatus == "loggedOut" )  // handle logged-out export requests - difference in qual table coding
    { 
        qualStart = 1; 
    }  
    if ( document.location.href.indexOf('?last_hits_previewed') > -1 )  // for compatibility with mmmturkeybacon Last Hits Previewed
    { 
        qualStart = 2; 
    }
    var masterQual = '';
    for ( var m = qualStart; m < thisQualRows.length; m++ ) 
    {
        if ( thisQualRows[m].textContent.indexOf('Masters') > -1 ) 
        {
            masterQual = 'MASTERS ';
        }
    }
    
    var thisPreviewUrl = "(url n/a)";
    var thisPandaUrl = "(url n/a)";
    if ( thisHitGroup != "unavailable" )  // handle logged-out export requests for HITs with no preview/notqualified links
    {
        thisPreviewUrl = 'https://www.mturk.com/mturk/preview?groupId=' + thisHitGroup;
        thisPandaUrl = 'https://www.mturk.com/mturk/previewandaccept?groupId=' + thisHitGroup;
    }
    
    var thisReqUrl = "(url n/a)";
    if ( thisReqId != "unavailable" )
    {
        thisReqUrl = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + thisReqId;
    }
    else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids
    {
        thisReqUrl = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + thisReqName.replace(/ /g, "+") + " (search)";
    }

    var thisTOUrl = "(url n/a)";
    var thisTOStats = "??";
    if ( thisReqId != "unavailable" )
    {
        thisTOUrl = 'http://turkopticon.ucsd.edu/' + thisReqId;
        thisTOStats = getTO(thisReqId);
    }
    else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids
    {
        thisTOUrl = 'https://turkopticon.ucsd.edu/main/php_search?query=' + thisReqName.replace(/ /g, "+") + " (search)";
    }


    // additions for plaintext export:
    
    function DST() {    // check if daylight savings time should be adjusted for, from http://www.mresoftware.com/simpleDST.htm
        var today = new Date();
        var yr = today.getFullYear();
        var dst_start = new Date("March 14, "+yr+" 02:00:00"); // 2nd Sunday in March can't occur after the 14th 
        var dst_end = new Date("November 07, "+yr+" 02:00:00"); // 1st Sunday in November can't occur after the 7th
        var day = dst_start.getDay(); // day of week of 14th
        dst_start.setDate(14-day); // Calculate 2nd Sunday in March of this year
        day = dst_end.getDay(); // day of the week of 7th
        dst_end.setDate(7-day); // Calculate first Sunday in November of this year
        if (today >= dst_start && today < dst_end) { //does today fall inside of DST period?
            return true; //if so then return true
        }
        return false; //if not then return false
    }

    var currentDate = new Date();
    var utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);   // http://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/
    var offset = '';
    if ( DST() == true ) { offset = "-7"; } else { offset = "-8"; }   // adjust Pacific Time's UTC offset for daylight savings time - http://stackoverflow.com/questions/8207655/how-to-get-time-of-specific-timezone-using-javascript/8207708#8207708
    var amazonDate = new Date(utc + (3600000*offset));
    var month = amazonDate.getMonth() + 1;
    var day = amazonDate.getDate();
    var year = amazonDate.getFullYear();
    var hours = amazonDate.getHours();
    if (hours < 10) { hours = '0' + hours; }   // http://stackoverflow.com/questions/6838197/get-local-date-string-and-time-string/6838658#6838658
    var minutes = amazonDate.getMinutes();
    if (minutes < 10) { minutes = '0' + minutes; }
    var dateStr = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " PT";
    
    var thisDesc = '"' + tBodies.getElementsByClassName('capsule_field_text')[5].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '"';
    if (thisDesc == '""') { thisDesc = "none"; }

    var thisKeywords = "";
    if ( document.location.href.indexOf('?last_hits_previewed') > -1 ) 
    { 
        thisKeywords = "unavailable (exported from Last HITs Previewed)"; 
    }
    else 
    { 
        thisKeywords = '"' + tBodies.getElementsByClassName('capsule_field_text')[6].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '"'; 
    }
    if (thisKeywords == '""' || thisKeywords == '') 
    { 
        thisKeywords = "none"; 
    }

    var qualStr = "";
    for ( var q = qualStart; q < thisQualRows.length; q++ ) {
        if ( ( (thisQualRows[q].textContent.indexOf('is') > -1) || (thisQualRows[q].textContent.indexOf('has') > -1) ) && (thisQualRows[q].textContent.indexOf('You meet this') < 0) && (thisQualRows[q].textContent.indexOf('Contact the Requester') < 0) ) {
            if (qualStr != "") { qualStr += '   '; }
            qualStr += thisQualRows[q].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '  \r\n';
        }
    }
    if (qualStr == "") { qualStr = "none  \r\n"; }

    var exportOutput = "";
    var loggedOutApology = " (Info missing since logged out.)";
    if ( accountStatus == "loggedIn" )
    {
        exportOutput = dateStr + '  \r\n'
                     + masterQual + 'HIT: ' + thisTitle + '   - ' + thisPreviewUrl + '  \r\n'
                     + 'Requester: ' + thisReqName + '   - ' + thisReqUrl + '  \r\n'
                     + 'TO Ratings: ' + 'Pay='+thisTOStats[1] + ' Fair='+thisTOStats[2] + ' Comm='+thisTOStats[0] + ' Speed='+thisTOStats[3] + '   - ' + thisTOUrl + '  \r\n'
                     + 'Time Allotted: ' + thisTimeLimit + '  \r\n'
                     + 'Reward: ' + thisReward + '  \r\n'
                     + 'HITs Available: ' + thisHitsAvail + '  \r\n'
                     + 'Description: ' + thisDesc + '  \r\n'
                     + 'Keywords: ' + thisKeywords + '  \r\n'
                     + 'Qualifications: ' + qualStr + '  \r\n' ;
    }
    else if ( accountStatus == "loggedOut" )
    {
        exportOutput = dateStr + loggedOutApology + '  \r\n'
                     + masterQual + 'HIT: ' + thisTitle + '   - ' + thisPreviewUrl + '  \r\n'
                     + 'Requester: ' + thisReqName + '   - ' + thisReqUrl + '  \r\n'
                     + 'TO Ratings: ??' + '   - ' + thisTOUrl + '  \r\n'
                     + 'Time Allotted: ' + thisTimeLimit + '  \r\n'
                     + 'Reward: ' + thisReward + '  \r\n'
                     + 'HITs Available: ' + thisHitsAvail + '  \r\n'
                     + 'Description: ' + thisDesc + '  \r\n'
                     + 'Keywords: ' + thisKeywords + '  \r\n'
                     + 'Qualifications: ' + qualStr + '  \r\n' ;
    }

    if (GM_setClipboard) { GM_setClipboard(exportOutput); }
    window.setTimeout(function(){ theButton.style.backgroundColor = 'transparent'; }, 500);
    txtexporttextarea.textContent = exportOutput;
    txtexportdiv.style.display = 'block';
    txtexporttextarea.select();
}
