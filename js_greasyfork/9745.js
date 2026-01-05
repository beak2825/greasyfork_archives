// ==UserScript==
// @name           StockReports
// @namespace      http://userscripts.org/users/183236
// @description    Tool to make reporting easier
//
// @version		1.2
// @include		https://tls.passthepopcorn.me/reportsv2.php?*
// @grant       none
//
// @downloadURL https://update.greasyfork.org/scripts/9745/StockReports.user.js
// @updateURL https://update.greasyfork.org/scripts/9745/StockReports.meta.js
// ==/UserScript==
/*---------------------Version History--------------------
0.10	-	Initial script
0.15    -	Added buttons
0.20    -	Three buttons
0.21	-	Added low quality
0.22	-	Added hard subs
1.00	-	Added second row of buttons specific to screen issues
	    -	Updated to work with new report form
1.01	- 	Added GP eval button
1.1	    -	Improved box style; added more report types
1.2	    -	Script now accepts multiple trumpable tags at once
        -   Increased timers to 750ms
        -   Changed wording of some buttons to match site's drop-down list
--------------------------------------------------------*/

// Create a new div to put the links in and append it to the content div
thin_div = document.createElement('div');
thin_div.setAttribute('class', 'thin');
thin_div.setAttribute('style', 'margin-top:20px;');
links_div1 = document.createElement('div');//makes a div
links_div1.setAttribute('class', 'panel generic-form generic-form--narrow');//makes it look the same as rest of page
thin_div.appendChild(links_div1);//adds div to the page
document.getElementById('content').appendChild(thin_div);//adds div to the page

//makes buttons in new divs
links_div1.innerHTML += '<h4>Trumpable:</h4>';
links_div1.innerHTML += '<button type="button" id="cropID" style="padding: 2px 3px;">Poor cropping</button>   ';
links_div1.innerHTML += '<button type="button" id="subsID" style="padding: 2px 3px;">No Eng subs</button>   ';
links_div1.innerHTML += '<button type="button" id="lowqualID" style="padding: 2px 3px;">Low quality</button>   ';
links_div1.innerHTML += '<button type="button" id="hardsubsID" style="padding: 2px 3px;">Hard subs</button>   <br />';

links_div1.innerHTML += '<button type="button" id="badarID" style="padding: 2px 3px;">Bad AR</button>   ';
links_div1.innerHTML += '<button type="button" id="codconID" style="padding: 2px 3px;">Codec/Cont</button>   ';
links_div1.innerHTML += '<button type="button" id="deinterID" style="padding: 2px 3px;">Deinter</button>   ';
links_div1.innerHTML += '<button type="button" id="dubsID" style="padding: 2px 3px;">Dubs</button>   ';
links_div1.innerHTML += '<button type="button" id="framerID" style="padding: 2px 3px;">Framerate</button>   <br />';

links_div1.innerHTML += '<button type="button" id="badsyncID" style="padding: 2px 3px;">Bad Synched Subs</button>   ';
links_div1.innerHTML += '<button type="button" id="incboxID" style="padding: 2px 3px;">Inc Boxset</button>   ';
links_div1.innerHTML += '<button type="button" id="nonconfID" style="padding: 2px 3px;">Non-Conform</button>   ';
links_div1.innerHTML += '<button type="button" id="nonoarID" style="padding: 2px 3px;">Non-OAR</button>   <br />';

links_div1.innerHTML += '<button type="button" id="dupaudID" style="padding: 2px 3px;">Dupe Audio</button>   ';
links_div1.innerHTML += '<button type="button" id="sourceID" style="padding: 2px 3px;">Source</button>   ';
links_div1.innerHTML += '<button type="button" id="strippedID" style="padding: 2px 3px;">Stripped</button>   ';
links_div1.innerHTML += '<button type="button" id="transID" style="padding: 2px 3px;">Trans/Re-Enc</button>   ';

links_div1.innerHTML += '<br /><br /><h4>Problem with Description:</h4>';
links_div1.innerHTML += '<button type="button" id="sar_screensID" style="padding: 2px 3px;">SAR screens</button>   ';
links_div1.innerHTML += '<button type="button" id="comp_screensID" style="padding: 2px 3px;">Compressed screens</button>   ';
links_div1.innerHTML += '<button type="button" id="res_screensID" style="padding: 2px 3px;">Incorrect res</button>   <br />';

links_div1.innerHTML += '<button type="button" id="nomediaID" style="padding: 2px 3px;">No Mediainfo</button>   ';
links_div1.innerHTML += '<button type="button" id="nobdinfoID" style="padding: 2px 3px;">No BDInfo</button>   ';
links_div1.innerHTML += '<button type="button" id="noifoID" style="padding: 2px 3px;">No IFO</button>   ';
links_div1.innerHTML += '<button type="button" id="noscreensID" style="padding: 2px 3px;">No Screens</button>   <br />';

links_div1.innerHTML += '<br /><h4>Problem with File:</h4>';
links_div1.innerHTML += '<button type="button" id="extrasID" style="padding: 2px 3px;">Extra Files</button>';
links_div1.innerHTML += '<button type="button" id="badfolderID" style="padding: 2px 3px;">Bad Folder</button>   ';




//makes them clickable
addButtonListener();

function addButtonListener() {
	//first div
    document.getElementById("cropID").addEventListener("click", function(){cropping()}, true);
	document.getElementById("subsID").addEventListener("click", function(){engsubs()}, true);
	document.getElementById("lowqualID").addEventListener("click", function(){lowqual()}, true);
	document.getElementById("hardsubsID").addEventListener("click", function(){hardsubs()}, true);
    
    document.getElementById("badarID").addEventListener("click", function(){badar()}, true);
    document.getElementById("codconID").addEventListener("click", function(){codcon()}, true);
    document.getElementById("deinterID").addEventListener("click", function(){deinter()}, true);
    document.getElementById("dubsID").addEventListener("click", function(){dubs()}, true);
    document.getElementById("framerID").addEventListener("click", function(){framer()}, true);
    
    document.getElementById("badsyncID").addEventListener("click", function(){badsync()}, true);
    document.getElementById("incboxID").addEventListener("click", function(){incbox()}, true);
    document.getElementById("nonconfID").addEventListener("click", function(){nonconf()}, true);
    document.getElementById("nonoarID").addEventListener("click", function(){nonoar()}, true);
    
    document.getElementById("dupaudID").addEventListener("click", function(){dupaud()}, true);
    document.getElementById("sourceID").addEventListener("click", function(){source()}, true);
    document.getElementById("strippedID").addEventListener("click", function(){stripped()}, true);
    document.getElementById("transID").addEventListener("click", function(){trans()}, true);
    
    document.getElementById("nomediaID").addEventListener("click", function(){nomedia()}, true);
    document.getElementById("nobdinfoID").addEventListener("click", function(){nobdinfo()}, true);
    document.getElementById("noifoID").addEventListener("click", function(){noifo()}, true);
    document.getElementById("noscreensID").addEventListener("click", function(){noscreens()}, true);
    
    document.getElementById("extrasID").addEventListener("click", function(){extraneous()}, true);
    document.getElementById("badfolderID").addEventListener("click", function(){badfolder()}, true);
    
	//second div
	document.getElementById("sar_screensID").addEventListener("click", function(){sar_screens()}, true);
	document.getElementById("comp_screensID").addEventListener("click", function(){comp_screens()}, true);
	document.getElementById("res_screensID").addEventListener("click", function(){res_screens()}, true);
}

//links_div.innerHTML += '<a id="croplink" href="">Poor cropping.</a>   ';

function engsubs(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", No English Subtitles"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "No English Subtitles"},750);
}

function cropping(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Poor Cropping"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Poor Cropping"},750);
}

function lowqual(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Low Quality"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Low Quality"},750);
}

function hardsubs(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Hardcoded Subtitles"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Hardcoded Subtitles"},750);
}

function sar_screens(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The screens show the storage aspect ratio."},750);  
}

function comp_screens(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The screens are heavily compressed."},750);
}

function res_screens(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The resolution of the screens is wrong."},750);
}


function badar(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Bad Aspect Ratio"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Bad Aspect Ratio"},750);
}

function codcon(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Codec/Container"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Codec/Container"},750);
}

function deinter(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Deinterlacing Issues"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Deinterlacing Issues"},750);
}

function dubs(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Dubs"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Dubs"},750);
}

function framer(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Improper Framerate"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Improper Framerate"},750);
}

function badsync(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Improperly Synched Subtitles"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Improperly Synched Subtitles"},750);
}

function incbox(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Incomplete Boxset"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Incomplete Boxset"},750);
}

function nonconf(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Non-Conform Resolution"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Non-Conform Resolution"},750);
}

function nonoar(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Non-OAR"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Non-OAR"},750);
}

function dupaud(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Duplicate/Excessive Audio Track(s)"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Duplicate/Excessive Audio Track(s)"},750);
}

function source(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Source"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Source"},750);
}

function stripped(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
if (document.getElementById("extra").value.length > 0) {
    setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Stripped DVD/BD"},750);
    }
else setTimeout(function(){document.getElementById("extra").value = "Stripped DVD/BD"},750);
}

function trans(){
document.getElementById("type").value = "trumpable";
ChangeReportType();
    if (document.getElementById("extra").value.length > 0) {
        setTimeout(function(){document.getElementById("extra").value = document.getElementById("extra").value + ", Transcode/Re-encode"},750);
    }
    else {setTimeout(function(){document.getElementById("extra").value = "Transcode/Re-encode"},750);}
}

function nobdinfo(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The BDInfo log is missing."},750);
}

function nomedia(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The MediaInfo log is missing."},750);
}

function noifo(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "The IFO log is missing."},750);
}

function noscreens(){
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "No screenshots included in description."},750);
}

function extraneous(){
document.getElementById("type").value = "fileproblem";
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "Extraneous files included in torrent"},750);
}

function badfolder(){
document.getElementById("type").value = "fileproblem";
ChangeReportType();
setTimeout(function(){document.getElementById("extra").value = "Improperly named folder"},750);
}