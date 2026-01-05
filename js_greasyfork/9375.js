// ==UserScript==
// @name Drudge Enhancement Suite
// @include http://drudgereport.com/
// @include http://www.drudgereport.com/
// @version 32
// @grant none
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js 
// @description:en Drudge Enhancement Suite. Main focus is on readability. I recommend using this in conjunction with an adblock extension like uBlock.
// 
// @namespace https://greasyfork.org/users/10724
// @description Drudge Enhancement Suite. Main focus is on readability. I recommend using this in conjunction with an adblock extension like uBlock.
// @downloadURL https://update.greasyfork.org/scripts/9375/Drudge%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/9375/Drudge%20Enhancement%20Suite.meta.js
// ==/UserScript==

var firstNum=-1;
var secondNum=-1;

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

document.addEventListener('keydown', function(event) {
	var num = event.keyCode-48;
	if(num >= 0 && num<=9) {
		if(firstNum==-1) {
			firstNum=num;
		} else if(secondNum==-1) {
			secondNum=num;
			fullNum=firstNum.toString()+secondNum.toString();
			document.getElementById(fullNum).click();
			firstNum=-1;
			secondNum=-1;;
		}
	}
});

var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAACKiYgAjIyMAP///wBubm4AT09OAOPj4wDHx8cAmZmZAHp6eQCUlJQA2dnZAAMDAwDExMQABQUFAMTDwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICCwsLAAUFAgILCwICDQsCAgsLCwsLBgICCwsCAg0LAgILCwIMCwsFAgsLAgINAwICCwsCAgQLBQILCwIOCwMCAgsLAgIECwUCCwsCCQsOAgILCwICBAsFAgsLCwsBAgICCwsCAgQLBQILCwsLCwcCAgsLAgIECwUCCwsCAgsLCgILCwICBAsFAgsLAgILCwoCCwsCDAsLBQILCwICCwsKAgsLCwsLBgICCwsLCwsHAgILCwsABQUCAgsLCwsIAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
document.getElementsByTagName('head')[0].appendChild(link);

document.title = "Drudge Report";

document.styleSheets[0].insertRule("body { padding-bottom:50px; background:#fbfbfb }", 1);
document.styleSheets[0].insertRule("hr { border: 0 none; height: 1px; color: #707065; background-color: #707065;}", 1);
document.styleSheets[0].insertRule("a:visited { color: #707065 }", 1);
document.styleSheets[0].insertRule("a { display: block; padding-top:2px; padding-bottom:2px; color: #080000 }", 1);
document.styleSheets[0].insertRule("i { font-style: normal }", 1); 
document.body.style.color="white";
//$('a').css('font-weight', 'normal');
document.styleSheets[0].insertRule("a { font-weight: normal; text-decoration: none }", 1); 
document.styleSheets[0].insertRule("#drudgeTopHeadlines a { text-align: center; font-weight: bold }", 2);
document.styleSheets[0].insertRule("#drudgeTopHeadlines { text-align: center; padding-bottom:25px }", 2);
document.styleSheets[0].insertRule("#drudgeTopHeadlines img {width:50% !important; max-width:600px; max-height:600px; position: relative; padding-top:10px}", 2);
document.styleSheets[0].insertRule("img { display: block; margin-left: auto; margin-right: auto; height:auto !important; max-width: 250px; width:100% !important; padding-top:5px; padding-bottom:10px; padding-left:5px; padding-right:5px; position: relative}", 2);
document.styleSheets[0].insertRule("td { max-width:33%; }", 2);
								
document.styleSheets[0].insertRule("#app_mainheadline a { padding-bottom:30px; }", 2);

var allBRs = document.getElementsByTagName('br');
for(var k=0; k<allBRs.length; k++) {
	allBRs[k].className="REMOVE";
}

var allScripts = document.getElementsByTagName('script');
for(var k=0; k<allScripts.length; k++) {
	if(allScripts[k].src == "") {
		allScripts[k].parentNode.removeChild( allScripts[k] );
	} else {
	  allScripts[k].className="REMOVE";
	}
}

var noScripts = document.getElementsByTagName('noscript');
for(var k=0; k<noScripts.length; k++) {
	noScripts[k].className="REMOVE";
}

var allTTs = document.getElementsByTagName('tt');
for(var k=0; k<allTTs.length; k++) {
	allTTs[k].style.fontFamily="Helvetica";
	allTTs[k].style.fontSize="small";
}

var allTDs = document.getElementsByTagName('td');
for(var k=0; k<allTDs.length; k++) {
	if(allTDs[k].width=="3") {
		allTDs[k].className="REMOVE";
	}
	allTDs[k].width="33%";
}

var allInputs = document.getElementsByTagName('input');
for(var k=0; k<allInputs.length; k++) {
	allInputs[k].className="REMOVE";
}

var allForms = document.getElementsByTagName('form');
for(var j=0; j<allForms.length; j++) {
	allForms[j].className="REMOVE";
}


var allButtons = document.getElementsByTagName('button');
for(var l=0; l<allButtons.length; l++) {
	allButtons[l].className="REMOVE";
}

var z=1;

var allURLs = document.getElementsByTagName('a');
for(var i=0; i<allURLs.length; i++) {
	thisURL = allURLs[i].getAttribute('href');	
	
	if( /^http:\/\/hosted\.ap\.org\/dynamic\/fronts\/HOME\?SITE=AP&SECTION=HOME$/.test(thisURL) ) {
		do {
			allURLs[i].className="REMOVE";
			//allURLs[i].innerHTML = "";	
			i++;
		} while( /zerohedge.com/.test(allURLs[i-1].getAttribute('href')) == false);
		i--;
	} else if ( /^http:\/\/wabcradio\.com\/$/.test(thisURL) ) {
		do {	
			allURLs[i].className="REMOVE";
			//allURLs[i].innerHTML = "";
			i++;
		} while( /^http:\/\/www\.suntimes\.com\/entertainment\/zwecker\/index\.html$/.test(allURLs[i-1].getAttribute('href')) == false);
		i--;
	} else if ( /^http:\/\/www\.france24\.com\/en\/timeline\/global\/$/.test(thisURL) ) {
		do {		
			allURLs[i].className="REMOVE";
			//allURLs[i].innerHTML = "";			
			i++;
		} while( /privacypolicy\.html/.test(allURLs[i-1].getAttribute('href')) == false);
		i--;
	}	
	else if ( /^http:\/\/www.drudgereport.com\/$/.test(thisURL) || /intermarkets/.test(thisURL) ) {
		allURLs[i].className="REMOVE";
	} else if ( /itunes.apple.com/.test(thisURL) ) {
		allURLs[i].className="REMOVE";
	}else {		
		thisHostname = allURLs[i].hostname;
		thisHostname=thisHostname.replace(".com", "");
		thisHostname=thisHostname.replace(".org", "");
		thisHostname=thisHostname.replace(".co.uk", "");
		thisHostname=thisHostname.replace(".au", ""); 
		thisHostnameSplit=thisHostname.split(".");
		thisHostname=thisHostnameSplit[thisHostnameSplit.length-1];
		thisHostname=thisHostname.toUpperCase();
		
		replaced1Inner=allURLs[i].textContent.replace(/\.\.\./g,"");
		
		if( /([A-Z]){4}/.test(replaced1Inner) || /^([^a-z])*$/.test(replaced1Inner)) {
			replaced1Inner=replaced1Inner.toLowerCase();
			replaced1Inner=replaced1Inner.replace(/(^|\s|\ |^\'|\s'|\*)(\w)/g, function(x) {
   			 return x.toUpperCase();
  			});
		}
		
		
		var multiple = false;
		
		if(/\n/.test(replaced1Inner)) {
			multiple=true;
		}
		
		if(i > 0 && allURLs[i].getAttribute('href') != allURLs[i-1].getAttribute('href')) {
			replaced2Inner=replaced1Inner.replace(/\n\n/, "<b><em><font size=1> &#124&#124 "+thisHostname+"</font></b></em><br><font size=1>&nbsp;&nbsp;&hellip;&nbsp;</font>")
		}
		else {
			replaced2Inner=replaced1Inner;
		}
		
		replaced2Inner=replaced2Inner.replace(/\n\n/g, "<br>... ")
		
		
		if(replaced2Inner == replaced1Inner ) {
			if(i > 0 && allURLs[i].getAttribute('href') != allURLs[i-1].getAttribute('href')) {
				replaced2Inner=replaced2Inner.replace(/\n/, "<b><em><font size=1> &#124&#124 "+thisHostname+"</font></b></em><br><font size=1>&nbsp;&nbsp;&hellip;&nbsp;</font>")
			}
			else {
				replaced2Inner=replaced1Inner;
			}
			
			replaced2Inner=replaced2Inner.replace(/\n/g, "<br><font size=1>&nbsp;&nbsp;&hellip;&nbsp;</font>")
		}
		
		if(thisHostname!="REUTERS" && thisHostname!="DRUDGEREPORT" && thisHostname!="NYTIMES" && thisHostname!="WSJ" && thisHostname!="GOOGLE" && thisHostname!="WASHINGTONTIMES" && thisHostname!="SCRIBD") {
       allURLs[i].href=thisURL; //"http://www.readability.com/m?url="+thisURL;
		}
		
		if(z<10) {
			allURLs[i].id = "0"+z;
		} else {
			allURLs[i].id = z;
		}
		
		if(i > 0 && allURLs[i].getAttribute('href') == allURLs[i-1].getAttribute('href')) {
			allURLs[i].innerHTML = "<font size=1>&nbsp;&nbsp;&hellip;&nbsp;</font>" + replaced2Inner + "<font size=1><br></font>" ;
		}
		else if(multiple) {
				allURLs[i].innerHTML = "<font size=1>" + allURLs[i].id +". </font>"+replaced2Inner  + "<font size=1><br></font>" ;
		} 
		else {
				allURLs[i].innerHTML = "<font size=1>" + allURLs[i].id +". </font>"+replaced2Inner + "<b><em><font size=1> &#124&#124 "+thisHostname+"</b></em></font>" + "<font size=1><br></font>" ;
		}
		
		z++;
	}
}

for(var i=0; i<10; i++) {
	document.getElementsByClassName("REMOVE").remove();
}

var allTTs = document.getElementsByTagName('tt');
for(var k=0; k<allTTs.length; k++) {
	var last=allTTs[k].innerHTML.lastIndexOf('<a ');
	var lastFinish=allTTs[k].innerHTML.indexOf("</a>", last);
	allTTs[k].innerHTML=allTTs[k].innerHTML.substring(0,lastFinish+4)+"</b>";
}

clearInterval(timer);
autoRefresh=null;
void 0;