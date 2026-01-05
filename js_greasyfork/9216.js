// ==UserScript==
// @name         Advanced button stats
// @namespace    http://www.reddit.com/r/thebutton/ABS-pastymage
// @version      0.5.17
// @description  Show Advanced button stats
// @author       pastymage (forked from /u/bwochinski 0.5)
// @match        *://www.reddit.com/r/thebutton/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9216/Advanced%20button%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/9216/Advanced%20button%20stats.meta.js
// ==/UserScript==

//CONFIG
	var advInterval = 500; //update interval in milliseconds
	var advKeepAmt = 60; //history to keep (in seconds)

//if you want it to automatically click, change -1 in the
// line below to the time (remaining) that you want
	var timeyouwant = -1

//Important variables
	var parHist = [];
	var histLen = (1000 / advInterval) * advKeepAmt;
	var lowestTime = 60.00;
	var clicked = false;
	

if ( !document.getElementsByClassName ) {
	document.getElementsByClassName = function(cl, tag) {
	   var els, matches = [],
	      i = 0, len,
	      regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
	 
	   // If no tag name is specified,
	   // we have to grab EVERY element from the DOM	 
	   els = document.getElementsByTagName(tag || "*");
	   if ( !els[0] ) return false;

	   for ( len = els.length; i < len; i++ ) {
	      if ( els[i].className.match(regex) ) {
	         matches.push( els[i]);
	      }
	   }
	   return matches; // an array of elements that have the desired classname
	};
}
 
// Very simple implementation. We're only checking for an id, class, or tag name.
// Does not accept CSS selectors in pre-querySelector browsers.
function qq(el, tag) {
   var firstChar = el.charAt(0);

   switch ( firstChar ) {
      case "#":
         return document.getElementById( el.slice(1) );
      case ".":
		 var res = document.getElementsByClassName( el.slice(1));
		 return res;
      default:
         return document.getElementsByTagName(tag);
   }
};

function qqf(el, tag) {
	var res = qq(el,tag);
	return res[0];
}
	
function setupABSDisplay() {
	var div;
	var tmp;
	
	const LEFTSTYLE = "style='Font: 18px Verdana normal black; width: 100%; float: left;'"
//	const LEFTSTYLE = "style='Font: 18px Verdana normal black; width: 400px; float: left;''"
	const RIGHTSTYLE = "style='Font: 18px Verdana normal black; width: 90px; float: left;'"
		
	div=document.createElement('div');
	div.id='advButtonStats'
	div.style='position: absolute; bottom: 0; margin-top: 100px; margin: 0 auto; width: 480px;'
	qqf(".thebutton-form").appendChild(div);
	tmp=document.createElement('div');
	tmp.innerHTML = "<div id='advSPACER' " + LEFTSTYLE + "><br></div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	tmp.innerHTML = "<div id='advBOPS' " + RIGHTSTYLE + ">BOPS:</div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	tmp.innerHTML = "<div id='advLowest' " + RIGHTSTYLE + ">Lowest Seen:</div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	tmp.innerHTML = "<div id='advPPM' " + RIGHTSTYLE + ">Clicks/min:</div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	tmp.innerHTML = "<div id='advFlair' " + RIGHTSTYLE + ">Current Flair:</div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	tmp.innerHTML = "<div id='advSPC' " + RIGHTSTYLE + ">Avg Secs/Click:</div>";
	qq("#advButtonStats").appendChild(tmp.firstChild);
	if (timeyouwant != -1) {
		tmp.innerHTML = "<div id='advCamp' " + RIGHTSTYLE + "><b>Auto Click:</b> " + timeyouwant.toString() + "</div>";
		qq("#advButtonStats").appendChild(tmp.firstChild);
	}
}

function advStatUpdate() {
    if (parHist.length > histLen) {
        parHist.pop();
    }
    var advText = qqf(".thebutton-participants").textContent.replace(",","");
    parHist.unshift(parseInt(advText));

    //console.log(parHist);
    var curBOPS = (parHist[0] - parHist[parHist.length - 1]) / (parHist.length / (1000 / advInterval));
    var curPPM = (parHist[0] - parHist[parHist.length - 1]) * (60 / advKeepAmt) * (advKeepAmt / (parHist.length / (1000 / advInterval)));
    var curTime = parseFloat(qq("#thebutton-s-10s").textContent + qq("#thebutton-s-1s").textContent + "." + qq("#thebutton-s-100ms").textContent + qq("#thebutton-s-10ms").textContent);
	if (!clicked) {
		if (curTime < lowestTime) {
			lowestTime = curTime;
			document.title=curTime.toString();
		} else {
			document.title="the button";
		}
	}
	if (!clicked && (curTime < timeyouwant + 1) && (curtime >= timeyouwant)) {
		document.title = "Done!"
		qq("#thebutton").click();
		clicked=true;
	}
    qq("#advBOPS").innerHTML = "<b>BOPS:</b> " + curBOPS.toFixed(5);
    qq("#advPPM").innerHTML = "<b>Clicks/min:</b> " + Math.round(curPPM);
    qq("#advFlair").innerHTML = "<b>Current Flair:</b> <span class='flair flair-press-" + String(curTime + 9).substring(0,1) + "'>" + String(curTime).substring(0,2) + "s</span>";
    qq("#advLowest").innerHTML = "<b>Lowest Seen:</b> " + lowestTime + "s</span>";
    qq("#advSPC").innerHTML = "<b>Avg Secs/Click:</b> " + (1 / curBOPS.toFixed(5)).toFixed(2);
}

function main() {
	setupABSDisplay();
	advStatUpdate();
	setInterval(advStatUpdate, advInterval);
}


main();