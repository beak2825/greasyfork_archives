// ==UserScript==
// @name          Mom Export
// @description   Export just the requester and HIT link.
// @version       3.9.1c
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/searchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/viewsearchbar*selectedSearchType=hitgroups*
// @include       https://www.mturk.com/mturk/sortsearchbar*HITGroup*
// @include       https://www.mturk.com/mturk/preview*
// @grant         GM_setClipboard
// @author        Cristo + clickhappier
// @namespace     mturkgrind
// @downloadURL https://update.greasyfork.org/scripts/7045/Mom%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/7045/Mom%20Export.meta.js
// ==/UserScript==

// for sharing HITs with Jaded's mom, simplified version of 'IRC Export (reformatted output mod)'


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
    button = document.createElement('button');
    button.setAttribute("place",c);
    button.textContent = 'MOM';
    button.style.height = '14px';
    button.style.width = '30px';
    button.style.fontSize = '8px';
    button.style.border = '1px solid';
    button.style.padding = '0px';
    button.style.backgroundColor = 'transparent';
    button.title = 'Click to save HIT information to your clipboard. Please wait while shortened URLs are retrieved.';
    button.addEventListener("click", display, false);
    document.getElementById('capsule'+c+'-0').parentNode.appendChild(button);
}

function sleep(ms){  // from http://www.digimantra.com/tutorials/sleep-or-wait-function-in-javascript/
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}
function ns4tShorten(url){  // mturk-only URL shortener on Tjololo's server ns4t.net
    console.log("ns4tShorten function");
    var shortUrl;
    var urlT = "https://ns4t.net/yourls-api.php" + "?action=shorturl&url=" + encodeURIComponent(url) + "&format=simple&title=MTurk&signature=39f6cf4959";
    var requestNs4t = new XMLHttpRequest();
    try{
        requestNs4t.onreadystatechange = function () {
            if (requestNs4t.readyState == 4) {
                if (requestNs4t.status == 200) {
                    shortUrl = requestNs4t.responseText;
                    console.log("ns4t.net response: " + requestNs4t.status + " " + requestNs4t.statusText + " " + requestNs4t.responseText);
                } 
                else {
                    console.log('ns4t.net unsuccessful: ' + requestNs4t.status + " " + requestNs4t.statusText);
                }
            }
        };
        requestNs4t.open('GET', urlT, false);
        requestNs4t.send(null);
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }
}
function tnyimShorten(url){  // Tny.im URL Shortener - http://tny.im/aboutapi.php - this is only possible this way because their server has the "Access-Control-Allow-Origin = *" headers enabled (the above TO mirror server does too)
    console.log("tnyimShorten function");
    var shortUrl;
    var urlT = "https://tny.im/yourls-api.php" + "?action=shorturl&url=" + encodeURIComponent(url) + "&format=simple&title=MTurk";
    var requestTnyim = new XMLHttpRequest();
    try{
        requestTnyim.onreadystatechange = function () {
            if (requestTnyim.readyState == 4) {
                if (requestTnyim.status == 200) {
                    shortUrl = requestTnyim.responseText;
                    console.log("tny.im response: " + requestTnyim.status + " " + requestTnyim.statusText + " " + requestTnyim.responseText);
                } 
                else {
                    console.log('tny.im unsuccessful: ' + requestTnyim.status + " " + requestTnyim.statusText);
                }
            }
        };
        requestTnyim.open('GET', urlT, false);
        requestTnyim.send(null);
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }    
}
function googlShorten(url){  // Goo.gl URL Shortener
    console.log("googlShorten function");
    var shortUrl;
    var urlG = "https://www.googleapis.com/urlshortener/v1/url";
    var requestGoogl = new XMLHttpRequest();
    try{
        requestGoogl.open("POST", urlG, false);
        requestGoogl.setRequestHeader("Content-Type", "application/json");
        requestGoogl.onreadystatechange = function() {
            if (requestGoogl.readyState == 4) {
                if (requestGoogl.status == 200) {
                    shortUrl = JSON.parse(requestGoogl.response).id;
                    console.log("goo.gl response: " + requestGoogl.status + " " + requestGoogl.statusText + " " + JSON.parse(requestGoogl.response).id );
                } 
                else {
                    console.log('goo.gl unsuccessful: ' + requestGoogl.status + " " + requestGoogl.statusText);
                }
            }
        };
        var data = new Object();
        data.longUrl = url;
        requestGoogl.send(JSON.stringify(data)); 
        return shortUrl;
    }
    catch(err){
        return shortUrl;
    }
}
function shortenUrl(url){
    sleep(500);  // milliseconds delay - wait some milliseconds (currently half a second) between shortens to reduce chance of hitting usage limits
    var shortUrl;
    shortUrl = ns4tShorten(url);
    if ( shortUrl === undefined ) {   // if you reached the ns4t.net URL shortener's temporary usage limits or the server is otherwise unavailable
        shortUrl = tnyimShorten(url);
        if ( shortUrl === undefined ) {   // if you reached the tny.im URL shortener's temporary limits or the server is otherwise unavailable
            shortUrl = googlShorten(url);
            if ( shortUrl === undefined ) {  // if you reached the Google URL shortener's temporary limits too or the server is otherwise unavailable
                shortUrl = "(x)";
            }
        }
    }
    return shortUrl;
}

// output display box
var momexportdiv = document.createElement('div');
var momexporttextarea = document.createElement('textarea');
momexportdiv.style.position = 'fixed';
momexportdiv.style.width = '500px';
momexportdiv.style.height = '135px';
momexportdiv.style.left = '50%';
momexportdiv.style.right = '50%';
momexportdiv.style.margin = '-250px 0px 0px -250px';
momexportdiv.style.top = '300px';
momexportdiv.style.padding = '5px';
momexportdiv.style.border = '2px';
momexportdiv.style.backgroundColor = 'black';
momexportdiv.style.color = 'white';
momexportdiv.style.zIndex = '100';
momexportdiv.setAttribute('id','momexport_div');
momexportdiv.style.display = 'none';
momexporttextarea.style.padding = '2px';
momexporttextarea.style.width = '500px';
momexporttextarea.style.height = '110px';
momexporttextarea.title = 'Mom Export Output';
momexporttextarea.setAttribute('id','momexport_text');
momexportdiv.textContent = 'Mom Export: Press Ctrl+C to (re-)copy to clipboard. Click textarea to close.';
momexportdiv.style.fontSize = '12px';
momexportdiv.appendChild(momexporttextarea);
document.body.insertBefore(momexportdiv, document.body.firstChild);
momexporttextarea.addEventListener("click", function(){ momexportdiv.style.display = 'none'; }, false);

function display(e){
    var theButton = e.target;
    theButton.style.backgroundColor = "#CC0000";
    
    var capHand = document.getElementById('capsule'+theButton.getAttribute("place")+'-0');
    var tBodies = capHand.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    var thisReq = tBodies.getElementsByClassName('requesterIdentity')[0];
    var thisReqName = thisReq.textContent;
    var thisReqId = "unavailable";  // handle logged-out export requests now that requester ID links are unavailable as of 2015-07-20
    if ( accountStatus == "loggedIn" )
    {
        var thisReqId = getUrlVariable(thisReq.parentNode.href, "requesterId");
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
            masterQual = 'MASTERS • ';
        }
    }
    
    var thisPreviewUrl = "(url n/a)";
    var thisPandaUrl = "(url n/a)";
    if ( thisHitGroup != "unavailable" )  // handle logged-out export requests for HITs with no preview/notqualified links
    {
        thisPreviewUrl = shortenUrl('https://www.mturk.com/mturk/preview?groupId=' + thisHitGroup);
        thisPandaUrl = shortenUrl('https://www.mturk.com/mturk/previewandaccept?groupId=' + thisHitGroup);
    }
    
    var thisReqUrl = "(url n/a)";
    if ( thisReqId != "unavailable" )
    {
        thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + thisReqId);
    }
    else if ( thisReqId == "unavailable" )  // handle 2015-07-20 loss of logged-out requester ids
    {
        thisReqUrl = shortenUrl('https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=' + thisReqName.replace(" ", "+") ) + " (search)";
    }
    
    // when the URL shortener service is unavailable but the preview link is available, add the full-length preview link at the end
    var shortUrlUnav = '';
    if ( (thisPreviewUrl == "(x)") && (thisHitGroup != "unavailable") ) 
    { 
        shortUrlUnav = " \r\n^ https://www.mturk.com/mturk/preview?groupId=" + thisHitGroup; 
    }

    var exportOutput = "";
    var loggedOutApology = " (Info missing since logged out.)";
    if ( accountStatus == "loggedIn" )
    {
        exportOutput = masterQual + 'Requester: ' + thisReqName + ' ' + thisReqUrl + ' • ' + 'HIT: ' + thisTitle + ' ' + thisPreviewUrl + ' • ' + 'PandA: ' + thisPandaUrl + shortUrlUnav ;
    }
    else if ( accountStatus == "loggedOut" )
    {
        exportOutput = masterQual + 'Requester: ' + thisReqName + ' ' + thisReqUrl + ' • ' + 'HIT: ' + thisTitle + ' ' + thisPreviewUrl + ' • ' + 'PandA: ' + thisPandaUrl + loggedOutApology + shortUrlUnav ;
    }
    
    if (GM_setClipboard) { GM_setClipboard(exportOutput); }
    window.setTimeout(function(){ theButton.style.backgroundColor = 'transparent'; }, 500);
    momexporttextarea.textContent = exportOutput;
    momexportdiv.style.display = 'block';
    momexporttextarea.select();
}
