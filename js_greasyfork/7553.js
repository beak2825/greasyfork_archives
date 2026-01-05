// ==UserScript==
// @name          Facebook HIT Export (regular links)
// @description   Export HIT information for posting on Facebook (long link version)
// @version       0.82r
// @include       https://www.mturk.com/mturk/searchbar*
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/viewsearchbar*
// @include       https://www.mturk.com/mturk/sortsearchbar*
// @include       https://www.mturk.com/mturk/sorthits*
// @grant         GM_setClipboard
// @author        Cristo + clickhappier + Alden McLaren
// @namespace     https://greasyfork.org/en/users/8467
// @downloadURL https://update.greasyfork.org/scripts/7553/Facebook%20HIT%20Export%20%28regular%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7553/Facebook%20HIT%20Export%20%28regular%20links%29.meta.js
// ==/UserScript==

// Based on clickhappier's IRC Export (reformatted output mod) which was a modification of Cristo's IRC Export X script.
// Simple formatting changes made for better readability when posting HIT info to MTurk Members group on Facebook.



var caps = document.getElementsByClassName('capsulelink');
for (var c = 0; c < caps.length/2; c++){
    button = document.createElement('button');
    button.setAttribute("place",c);
    button.textContent = 'FB';
    button.style.height = '14px';
    button.style.width = '30px';
    button.style.fontSize = '8px';
    button.style.border = '1px solid';
    button.style.padding = '0px';
    button.style.backgroundColor = 'transparent';
    button.title = 'Click to save Hit information to your clipboard';
    button.addEventListener("click", display, false);
    document.getElementById('capsule'+c+'-0').parentNode.appendChild(button);
}
function getTO(f){
    var toComp = [];
    var toUrl = 'https://turkopticon.ucsd.edu/api/multi-attrs.php?ids='+f;
    requestTO = new XMLHttpRequest();
    requestTO.onreadystatechange = function () {
        if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
            if(requestTO.responseText.split(':').length > 2){
                var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                for (var t = 0; t < 3; t++){
                    var arrTo = toInfo[t].split(':');
                    toComp.push(arrTo[1].substring(1,4));
                }
            } else {
                toComp = ['-','-','-'];
            }
        }
    }
    requestTO.open('GET', toUrl, false);
    requestTO.send(null);
    return toComp;
}

function display(e){
    var theButton = e.target;
    theButton.style.backgroundColor = '#FD2B2B';
    setTimeout(function(){theButton.style.backgroundColor = 'transparent';},600);
    
    var capHand = document.getElementById('capsule'+theButton.getAttribute("place")+'-0');
    var tBodies = capHand.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    
    var capReq = tBodies.getElementsByClassName('requesterIdentity')[0].textContent;
    var capReqId = tBodies.getElementsByClassName('requesterIdentity')[0].parentNode.href.split('requesterId=')[1];
    
    var capTitle = capHand.textContent.trim();
    capTitle = capTitle.replace(/<(\w+)[^>]*>.*<\/\1>/gi, "").trim();  // addition to strip html tags and their contents, appearing inside the title link (re 10-20-2014 appearance of "<span class="tags"></span>")

    var capGId = capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.nextSibling.href.split('=')[1];
    capGId = capGId.replace("&hitId", "");  // Amazon messed up the notqualified links, now looking like https://www.mturk.com/mturk/notqualified?hitGroupId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX&hitId=3ID43DSF4IQ1X8LO308D15ZSD5J5GX ; this and the above split happening on = instead of a specific value address that
    
    var capRew = tBodies.getElementsByClassName('reward')[0].textContent;

    var capTime = tBodies.getElementsByClassName('capsule_field_text')[2].textContent;

    var capAvailable = tBodies.getElementsByClassName('capsule_field_text')[4].textContent;

    var qualList = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[2];
    var qualColl = qualList.getElementsByTagName('td');
    var masterStat = '';
    for ( var m = 3; m < qualColl.length; m++ ) {
        if ( qualColl[m].textContent.indexOf('Masters') > -1 ) {
            masterStat = 'MASTERS • ';
        }
    }
    
    var capUrl = 'https://www.mturk.com/mturk/preview?groupId='+capGId;
    var capReqUrl = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId='+capReqId;
    var toLink = 'http://turkopticon.ucsd.edu/'+capReqId;
    var capToStats = getTO(capReqId);
    
    var exString = masterStat + '\n' + ' • ' + 'Requester: ' + capReq + ' ' + capReqUrl + '\n' + ' • ' + 'HIT: ' + capTitle + ' ' + capUrl + '\n' + ' • ' + 'Pay: ' + capRew + ' • ' + 'Time Limit: ' + capTime + '\n' + ' • ' + 'TO: ' + 'Pay='+capToStats[1] + ' Fair='+capToStats[2] + ' Comm='+capToStats[0] + ' ' + toLink ;
    GM_setClipboard(exString);
}