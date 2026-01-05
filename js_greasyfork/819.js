// ==UserScript==
// @name        IMDB - produce directory name
// @namespace   KG
// @include     /^https?://www\.imdb\.com/title/tt\d{7}/($|\?)/
// @run-at	document-start
// @grant	none
// @version     0.9
// @description produces a directory name ready to copy/paste
// @downloadURL https://update.greasyfork.org/scripts/819/IMDB%20-%20produce%20directory%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/819/IMDB%20-%20produce%20directory%20name.meta.js
// ==/UserScript==

if (!window.frameElement) {
	run();
}

function run() {
        var url = window.location + "";
	url = url.split("?")[0] + "fullcredits";
        
        var x = new XMLHttpRequest();
        x.open("GET",url);
        x.onload = function() { 
        	process(this.responseXML);
        }
        x.responseType = "document";
        x.send();
}

function process(response) {
        var directors = "";
        var titleYear = document.title.replace(" - IMDb", "");
        titleYear = titleYear.replace("(TV Series ", "(");
        titleYear = titleYear.replace("(TV mini-series ", "(");
        titleYear = titleYear.replace("(TV ", "(");
	titleYear = titleYear.replace(" (V)", "");
	titleYear = titleYear.replace(" (TV)", "");
	titleYear = titleYear.replace("/I)", ")");
	titleYear = titleYear.replace("/II)", ")");
	titleYear = titleYear.replace("/III)", ")");
        
        var headings = response.querySelectorAll('h4.dataHeaderWithBorder');
	for (i=0; i < headings.length; i++) {
		if (headings[i].textContent.indexOf('Directed by') != -1) {
			var dirLinks = headings[i].nextElementSibling.getElementsByTagName('a');
			break;
		}
	}
	
	if (dirLinks) {
		var sep = (dirLinks.length == 2) ? " & " : ", "; // choose seperator
        	for (i=0; i < dirLinks.length; i++) { 
        		directors += dirLinks[i].textContent.trim();
        		directors += (i < dirLinks.length-1) ? sep : "";
        	}
	}
	
	var resultBox = document.createElement('div');
	resultBox.innerHTML = "<textarea readonly id='resultBox' style='font-size:90%; background: #000; color: #fff; position: fixed; left: 0; bottom: 0; z-index: 999; resize: none;' rows='1' cols='50' onclick='javascript: this.select();'>"
		+ titleYear + ", " + directors + "</textarea>";
	document.body.appendChild(resultBox);
	document.getElementById("resultBox").select();
}
