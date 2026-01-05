// ==UserScript==
// @name          TinyChat Export
// @description   Export HIT information in multi-line plain text format.
// @version       1.3c
// @include       https://www.mturk.com/mturk/searchbar*
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/viewsearchbar*
// @include       https://www.mturk.com/mturk/sortsearchbar*
// @include       https://www.mturk.com/mturk/sorthits*
// @grant         GM_setClipboard
// @author        Cristo + clickhappier + jawz
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/7397/TinyChat%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/7397/TinyChat%20Export.meta.js
// ==/UserScript==


// based on 'IRC Export (reformatted output mod)': https://greasyfork.org/en/scripts/6254-irc-export-reformatted-output-mod


var caps = document.getElementsByClassName('capsulelink');
for (var c = 0; c < caps.length/2; c++){
    button = document.createElement('button');
    button.setAttribute("place",c);
    button.textContent = 'TXT';
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
    var toUrl = 'https://mturk-api.istrack.in/multi-attrs.php?ids='+f;
    requestTO = new XMLHttpRequest();
    requestTO.onreadystatechange = function () {
        if ((requestTO.readyState ===4) && (requestTO.status ===200)) {
            if(requestTO.responseText.split(':').length > 2){
                var toInfo = requestTO.responseText.split('{')[3].split('}')[0].split(',');
                for (var t = 0; t < 4; t++){
                    var arrTo = toInfo[t].split(':');
                    toComp.push(arrTo[1].substring(1,4));
                }
            } else {
                toComp = ['-','-','-','-'];
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
    
    if (capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.href)
    	var capGId = capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.href.split('groupId=')[1];
    else
        var capGId = capHand.parentNode.parentNode.getElementsByClassName('capsulelink')[1].firstChild.nextSibling.href.split('groupId=')[1];
    
    console.log(capGId)
    
    var capRew = tBodies.getElementsByClassName('reward')[0].textContent;

    var capTime = tBodies.getElementsByClassName('capsule_field_text')[2].textContent;

    var capAvailable = tBodies.getElementsByClassName('capsule_field_text')[4].textContent;

    var qualList = document.getElementById('capsule'+theButton.getAttribute("place")+'target').getElementsByTagName('tbody')[2];
    var qualColl = qualList.getElementsByTagName('td');
    var masterStat = '';
    for ( var m = 3; m < qualColl.length; m++ ) {
        if ( qualColl[m].textContent.indexOf('Masters') > -1 ) {
            masterStat = 'MASTERS ';
        }
    }
    
    var capUrl = 'https://www.mturk.com/mturk/preview?groupId='+capGId;
    var capReqUrl = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId='+capReqId;
    var toLink = 'http://turkopticon.ucsd.edu/'+capReqId;
    var capToStats = getTO(capReqId);


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
    if ( DST() == true ) { var offset = "-7"; } else { var offset = "-8"; }   // adjust Pacific Time's UTC offset for daylight savings time - http://stackoverflow.com/questions/8207655/how-to-get-time-of-specific-timezone-using-javascript/8207708#8207708
    var amazonDate = new Date(utc + (3600000*offset));
    var month = amazonDate.getMonth() + 1;
    var day = amazonDate.getDate();
    var year = amazonDate.getFullYear();
    var hours = amazonDate.getHours();
    if (hours < 10) { hours = '0' + hours; }   // http://stackoverflow.com/questions/6838197/get-local-date-string-and-time-string/6838658#6838658
    var minutes = amazonDate.getMinutes();
    if (minutes < 10) { minutes = '0' + minutes; }
    var dateStr = month + "/" + day + "/" + year + " " + hours + ":" + minutes + " PT";
    
    var capDesc = '"' + tBodies.getElementsByClassName('capsule_field_text')[5].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '"';
    if (capDesc == '""') { capDesc = "none"; }
    
    var capKeywords = '"' + tBodies.getElementsByClassName('capsule_field_text')[6].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '"';
    if (capKeywords == '""') { capKeywords = "none"; }

    var qualStr = "";
    for ( var q = 3; q < qualColl.length; q++ ) {
        if ( ( (qualColl[q].textContent.indexOf('is') > -1) || (qualColl[q].textContent.indexOf('has') > -1) ) && (qualColl[q].textContent.indexOf('You meet this') < 0) ) {
            if (qualStr != "") { qualStr += '   '; }
            qualStr += qualColl[q].textContent.trim().replace(/(\t)+/g,' ').replace(/(\n)+/g,' ').replace(/(\r)+/g,' ').replace(/(  )+/g,' ').replace(/(\s)+/g,' ') + '  \r\n';
        }
    }
    if (qualStr == "") { qualStr = "none  \r\n"; }


    var exString = masterStat + ' ' + capRew + ' - ' + ' ' + capTitle + ' - ' + ' ' + capUrl + ' - ' + capTime + ' - ' + ' ' + ' Requester: ' + capReq + ' - ' + ' TO: ' +capToStats[1] + ' - ' + ' ' + ' HITs Available: ' + capAvailable  
    GM_setClipboard(exString);
}
