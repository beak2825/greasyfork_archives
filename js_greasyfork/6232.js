// ==UserScript==
// @name            JR Crowdsource keyword/ranking mturk.com scripts
// @version         1.1.3
// @description     A userscript for crowdsource keyword and ranking hits. It should be working for the keywords for any Google location. Also it will work for the ranking hits. It will even work for the choose the best URL hits.
// @author          (JohnnyRS on mturkgrind.com)
// @license         Creative Commons Attribution License
// @include         *
// @exclude         *mturk.com/*HITMONITOR*
// @exclude         *plug.dj/*
// @exclude         *swagbucks.com/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require         https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @run-at          document-end
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_getResourceText
// @namespace       https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/6232/JR%20Crowdsource%20keywordranking%20mturkcom%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/6232/JR%20Crowdsource%20keywordranking%20mturkcom%20scripts.meta.js
// ==/UserScript==

// ------------------- CONSTANT VARIABLES - options --------------
var INSTRUCTIONBOXWIDTH = 460;              // The width size of the instructionbox if you need it to be bigger or smaller.
var INSTRUCTIONFONTSIZE = 12;               // The font size of the text in the instructionbox if you need it to be larger or smaller.
var INSTRUCTIONSOFF = false;                // Instruction box will turn itself off at the beginning for faster answers with keyboard shortcuts.
var INSTRUCTIONSSMALL = false;              // Show only information needed in instruction box so it doesn't cover up a large portion of screen.
var POPUPWINDOW = false;					// Opens window in a remote window instead of a tab.
var CLOSEPOPUPAFTER = true;                 // Allows the remote window to be closed after finishing hit.
var GOTONEXTTASK = false;                   // This will make it so the script goes to the next task after you finish a task.
// ----- Debugging options No reason to change ---------
var ONPREVIEW = false;                      // Allows search buttons to work in preview mode. Mostly for testing purposes.
var gLogging = false, gDebugging = false;   // Gives lot of info in the console log for debugging purposes mostly.
// ---------------------------------------------------------------
var MYVERIFY = "kissfeet";                  // used for all my scripts to verify messages originating from my script.
var SCRIPTTAG = "JRCRKN";                   // Used for a unique tag for each script I make. Used in messaging and variables passing.    

var gLocation = $(location).attr('href');
var gTaskNumber = 0, gSubTaskNumber = 0; // Task number of task working on.
var gSearchDomain = "google.com", gSearchSite = "", gSearchVersion = 0; // Version of crowdsource and search engine hit being worked on.
var gUrlToSearch = "", gImageSrc = "", gKeyword = "", gZipCode = ""; // searching for this stuff.
var gQuestion = "", gClicked = false, gGoUrl = "", gHitAccepted = false; // URL to be opened and question to be asked.
var gPopUpWindow = null, gReturnData = null, gIframeSrc = null, gAutoNext = true; // References to window, iframe and returned data.
var gSearching = false, gOtherPage = false, gSearchResults = "", gSearchTime = ""; // what page am I on?
var gDefaultPage = "http://www.allbyjohn.com/blank.html?JRnewpage=" + SCRIPTTAG // default page when remote window stays open.
var gTag = -1; // Unique number for this specific hit so messages will be sent to correct remote window.
var VERSION = [];
VERSION[1] = ["Open.*Google.*and search the provided keyword","Return the page number and ranking of Url","Search: Keywords on Google (2)(2.1)(2.2)(2.4)(2.8)","CrowdSource"];
VERSION[2] = ["Open.*Google.*and search the provided keyword","Return requested information into the provided text box","Search: Keywords on Google (1.8)(4.5)","CrowdSource"];
VERSION[3] = ["Open.*Google.*and search the provided keyword","Copy and paste the Url of the most relevant result","Search: Keywords on Google (.co.uk)(.com)","CrowdSource"];
VERSION[4] = ["","","Keywords on Google.com (2.2a)","CrowdSource"];
VERSION[5] = ["Open Bing.com and search the provided keyword","Return requested information into the provided text box","Search: Keywords on Bing.com","CrowdSource"];
VERSION[6] = ["Click \"Search Tools\" then \"Search near...\"","Return the page number and ranking of Url","Loc & Keyword - Google Acct Required (3)","CrowdSource"];
VERSION[7] = ["Click \"Search Tools\" then \"Search near...\"","Return requested information into the provided text box","Search: Loc & Keyword - Google Acct Required (11)","CrowdSource"];
VERSION[8] = ["keyword search in Yahoo","","","CrowdSource"];
VERSION[9] = ["Review the image in the task and find that same image on the Google Images page.","Click on 'View Image' when you see this screen appear:","Search: Keywords on Google.com (24)","CrowdSource"];
VERSION[10] = ["Find the image and hover over it","Make sure the website that pops up when hovering matches the website provided in the task","Search: Image URL on Google.co.uk (7.1)","CrowdSource"];
VERSION[11] = ["Open Google.com and search Keyword 1","Ignoring the ads, return the first Url listed on the page","Search: Keywords on Google.com (10)","CrowdSource"];
VERSION[12] = ["Rewrite a short sentence about the provided content tags","Open the provided link:\\[Search Engine\\] and search for the keyword","Search: Keywords (21)","CrowdSource"];
VERSION[13] = ["Click on the Search Engine \(.*\) link and search the keyword","Return requested information into the provided text box","Search: Keywords (19)","CrowdSource"];
VERSION[14] = ["Open \\[Search Engine 1\\] and search \\[Keyword 1\\]","Locate \\[Url 1\\] in the search results.*\\(do not continue past page 5\\)","Search: Keywords (18)","CrowdSource"];
VERSION[15] = ["Open Google\\.ca \\(Canada\\)","Click .Google\\.ca offered in","Keywords on Google.ca (2.2a)","CrowdSource"];
$("head").append (
    '<link '
  + 'href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/redmond/jquery-ui.css" '
  + 'rel="stylesheet" type="text/css">'
);
GM_addStyle ( " \
    button.ui-state-hover { \
        background-color: darkgray !important; \
        border-color: white !important; \
    } \
    .ui-button-text-only .ui-button-text { \
        padding: 3px !important;\
    } \
    .JRhighlight1 { \
        background-color: RoyalBlue; \
        color: white !important; \
		display: inline !important; \
		line-height:normal !important; \
    } \
    .JRhighlight2 { \
        background-color: SeaGreen; \
        color: white !important; \
		display: inline !important; \
		line-height:normal !important; \
    } \
" );

function getHostName(url) {
    var match = url.match(/(.+:\/\/)?([^\/]+)(\/.*)*/i);
    if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) return match[2].replace("www.","");
    else return "";
}
function getDomainName(url) {
    var hostName = getHostName(url);
    var splitHostName = hostName.split('.');
    if ( splitHostName.length > 2 ) return splitHostName[splitHostName.length-2] + "." + splitHostName[splitHostName.length-1];
    else return hostName;
}
function queryToAssoc(queryString) {
    var splits = null, returnAssoc = {};
    var theStart = queryString.indexOf("?");
    queryString = queryString.substring(theStart+1);
    var queryArray = queryString.split("&");
    for (var i = 0, len=queryArray.length; i < len; i++) {
        splits = queryArray[i].split("=");
        returnAssoc[splits[0]] = splits[1];
    }
    return returnAssoc;
}
var gHostName = getHostName(gLocation);
var queryString = (window.location.search).substring(1); // Get the querystring from current location removing the ? at front.
var gQueryAssoc = queryToAssoc(queryString); // split querystring into an associative array with variables.
function isGoogle() { return (gLocation.search(/^http.?:\/\/[^.]*\.google\./i) != -1) ? true : false; }
function isImageGoogle() { return (gQueryAssoc["tbm"] == "isch") ? true : false; }
function isNewsGoogle() { return (gQueryAssoc["tbm"] == "nws") ? true : false; }
function isYahoo() { return gLocation.search(/^http.?:\/\/[^.]*\.yahoo\./i) != -1 ? true : false; }
function isBing() { return gLocation.search(/^http.?:\/\/[^.]*\.bing\./i) != -1 ? true : false; }
function isMturk() { return gLocation.search(/^http.?:\/\/[^.]*\.mturk\./i) != -1 ? true : false; }
function isCrowdsource() { return gLocation.search(/^http.?:\/\/work\.crowdsource\.com\/tasks\//i) != -1 ? true : false; }
function isHitPage() { return gLocation.search(/^http.?:\/\/work\.crowdsource\.com\/i\//i) != -1 ? true : false; }
function isStartPage() { return gLocation.indexOf(gDefaultPage) != -1 ? true : false; }
function isJRIO() { return (gQueryAssoc["jrio"] == "feetwalk") ? true : false; }

function isBrTextRep() { return (gSearchVersion==10) ? true : false ; }
function isSearchInTask() { return (gSearchVersion==12 || gSearchVersion==13 || gSearchVersion==14) ? true : false; }
function isTagsSearching() { return (gSearchVersion==12) ? true : false; }
function isRewriteSentence() { return (gSearchVersion==12) ? true : false; }
function isImageSearch() { return (gSearchVersion==10 || gSearchVersion==9) ? true : false; }
function isImageInst() { return (gSearchVersion==10) ? true : false; }
function isInstructionParagraph() { return (gSearchVersion==10) ? true : false; }
function isSearchQuestion() { return (gSearchVersion==2 || gSearchVersion==3 || gSearchVersion==5 || gSearchVersion==7 || gSearchVersion==11) ? true : false; }
function isUrlQuestion() { return (gSearchVersion==6 || gSearchVersion==11) ? true : false; }
function isZipcodeSearch() { return (gSearchVersion==6 || gSearchVersion==7) ? true : false; }
function hasSelectNone() { return (gSearchVersion==3) ? false : true; }
function isDoubleKeyword() { return (gSearchVersion==11 || gSearchVersion==14) ? true : false; }
function pagesToWait() { return (gLocation.search(/^[^.]*about.me\//i)) != -1 ? true : false; }
function isPreviewMode() { return ($("#submitButton").is(":disabled")) ? true: false; }

String.prototype.rtrim = function() { return this.replace(/\s+$/,""); }
function dataFill(action, thisData) {
    var theData = {"verify": MYVERIFY, "scriptTag": SCRIPTTAG, "tag": gTag, "action": action,
            "innerData": JSON.stringify(thisData)};
    return theData;
}
function verifyMessage(e,thisLocation) {
    if (e.data.verify === MYVERIFY && e.data.scriptTag === SCRIPTTAG) return true;
    else return false;
}
/*
highlight v3 - Modified by Marshal (beatgates@gmail.com) to add regexp highlight, 2011-6-24
    Modified by John Ramirez to find sentences and allow abbreviations and links inside.
 Highlights arbitrary terms.
 <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
 MIT license. Johann Burkard <http://johannburkard.de> <mailto:jb@eaio.com>
 */
jQuery.fn.highlightSentences = function(pattern) {
    var regex = typeof(pattern) === "string" ? new RegExp(pattern, "i") : pattern; // assume very LOOSELY pattern is regexp if not string
    function innerHighlight(node, pattern) {
		if ( typeof innerHighlight.theClassName == 'undefined') innerHighlight.theClassName = "JRhighlight1";
		if ( typeof innerHighlight.theIndex == 'undefined') innerHighlight.theIndex = 0;
		if ( typeof innerHighlight.lastSentence == 'undefined') innerHighlight.lastSentence = false;
        var skip = 0;
        var goodSentence = true;
        if (node.nodeType === 3) { // 3 - Text node
            var pos = node.nodeValue.search(regex);
            if (pos >= 0 && node.nodeValue.length > 0) { // .* matching "" causes infinite loop
                var match = node.nodeValue.match(regex); // get the match(es), but we would only handle the 1st one, hence /g is not recommended
				if (node.nodeValue.substr(0,1) == ".") { pos=0; match[0]="."; }
				if (node.nodeValue.substr(0,1) == " ") { pos=pos-1; match[0]=" "+ match[0]; }
                var spanNode = document.createElement('span');
                $( spanNode ).addClass( innerHighlight.theClassName + " JH-" + innerHighlight.theIndex);
				$( spanNode ).data("theIndex",innerHighlight.theIndex);
                var middleBit = node.splitText(pos); // split to 2 nodes, node contains the pre-pos text, middleBit has the post-pos
                var matchLength = match[0].length;
                var middleString = middleBit.nodeValue.substr(0,matchLength).rtrim();
                if (middleString.search(/(^|\s|\.|\“)(dr|md|mr|ms|mrs|inc|phd|jr|\w{0,1})\.$/i) != -1) { // ( F.)( phd.|ph.d.|md.|mr.|ms.|mrs.|dr.|b.b.a.|inc.|jr.)
                    matchLength = (middleBit.length>matchLength) ? matchLength + 1 : matchLength;
                    goodSentence = false; // The punctuation was for an abbreviation and not a sentence
                }
                var endBit = middleBit.splitText(matchLength); // similarly split middleBit to 2 nodes
                if (middleBit.nodeValue.rtrim().search(/\w*[^.]$/i) != -1) goodSentence = false; // sentence not ending in punctuation. Maybe a link?
                var middleClone = middleBit.cloneNode(true);
                spanNode.appendChild(middleClone);
                // parentNode ie. node, now has 3 nodes by 2 splitText()s, replace the middle with the highlighted spanNode:
                middleBit.parentNode.replaceChild(spanNode, middleBit);
                skip = 1; // skip this middleBit, but still need to check endBit
				$(".JH-" + innerHighlight.theIndex).click( function() {
					$("#enterAnswer").val($(".JH-" + $(this).data("theIndex")).text().trim());
				});
                if (goodSentence) { 
					innerHighlight.theClassName = (innerHighlight.theClassName=="JRhighlight1") ? "JRhighlight2" : "JRhighlight1";
					innerHighlight.theIndex += 1;
                    innerHighlight.lastSentence = true;
				} else innerHighlight.lastSentence = false;
            }
        } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) { // 1 - Element node
            for (var i = 0; i < node.childNodes.length; i++) { // highlight all children
                if (!$(node.childNodes[i]).hasClass("JRhighlight1") && !$(node.childNodes[i]).hasClass("JRhighlight2") && node.childNodes[i].nodeValue!="") {
                    var theTagname = node.childNodes[i].tagName;
                    theTagname = (theTagname) ? theTagname.toLowerCase() : "";
                    if (!innerHighlight.lastSentence && (theTagname == "h2" || theTagname == "h1" || theTagname == "p" || theTagname == "li" || theTagname == "div") ) {
                        innerHighlight.theClassName = (innerHighlight.theClassName=="JRhighlight1") ? "JRhighlight2" : "JRhighlight1";
                        innerHighlight.theIndex += 1;
                    }
                    i += innerHighlight(node.childNodes[i], pattern); // skip highlighted ones
                }
            }
        }
        return skip;
    }
    return this.each(function() {
        innerHighlight(this, pattern);
    });
};
$.expr[':'].icontains = $.expr.createPseudo(function( text ) {
    text = text.toLowerCase();
    return function (el) {
        return ~$.text(el).toLowerCase().indexOf( text );
    }
});
function createDiv(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<div>').html(inner); }
function createSpan(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<span>').html(inner); }
function createTheButton(toDo,theHtml,theBackgroundColor,theColor,theFontSize,doSpan,className,idName,theTitle) {
	var backgroundColor = (theBackgroundColor) ? theBackgroundColor : "initial";
	var textColor = (theColor) ? theColor : "initial";
	var fontSize = (theFontSize) ? theFontSize : "9px";
    var theContainer = (doSpan) ? createSpan().css({"display":"inline"}) : createDiv();
	var theButton = $('<button>').data("status","off")
		.data("backColor",backgroundColor)
		.data("textColor",textColor)
		.data("htmlText",theHtml)
        .html(theHtml)
        .attr("type","button")
        .attr("title",theTitle)
        .appendTo(theContainer)
		.css({"font-size":fontSize,"border-radius":"4px","text-shadow":"none","float":"none","font-weight":"normal","height":"auto",
            "font-family":"Helvetica,Arial,Sans-Serif","color":textColor,"background-color":backgroundColor,"border":"1px groove black",
            "cursor":"default","padding":"1px 3px","text-transform":"none","line-height":"normal","background-image":"none","letter-spacing":"normal"});
	if (className) theButton.addClass(className);
	if (idName) theButton.attr("id",idName);
	theButton.click(toDo);
	return theContainer;
}
function urlMatch(url1, url2) {
    if(typeof(url1)==='undefined' || typeof(url2)==='undefined') return 0;
    url1 = unescape(url1).toLowerCase();
    url2 = url2.toLowerCase();
    var hostName1 = getHostName(url1);
    var hostName2 = getHostName(url2);
    url1 = url1.replace(/(^http.?:\/\/)|(\/$)|(www\.)/g,'');
    url2 = url2.replace(/(^http.?:\/\/)|(\/$)|(www\.)/g,'');
    if ( url1 == url2 ) return 1;
    else if ( hostName1 == hostName2 ) return 2;
    else if ( getDomainName(hostName1) == getDomainName(hostName2) ) return 3;
    else return 0;
}
function removeHTMLTags(htmlString) {
    if(htmlString) return createDiv(htmlString).text();
}
function makeDataNow() {
    return {"goUrl":gGoUrl,"clicked":gClicked,"version":gSearchVersion,"imageSrc":gImageSrc,"urlToSearch":gUrlToSearch,"searchDomain":gSearchDomain,
			"searchSite":gSearchSite,"question":gQuestion,"zipCode":gZipCode,"keyword":gKeyword,"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
}
function backButtonClicked() {
	if (isGoogle()) self.close();
	else parent.history.back();
}
function answerButtonClicked(fromWhere) {
    var theAnswer = "";
    if (fromWhere=="select") theAnswer = window.getSelection().toString();
    else if (fromWhere=="url") theAnswer = $(location).attr('href').replace("&jrio=" + gTaskNumber,"");
    else if (fromWhere=="input") theAnswer = $("#enterAnswer").val();
    if (theAnswer==="" && fromWhere!="url") {
        theAnswer = (fromWhere=="select") ? $("#enterAnswer").val() : (fromWhere=="input") ? window.getSelection().toString() : "";
    }
    var returnData = {"pageIndex":"None","rankIndex":"None","theAnswer":theAnswer,"result":"answer","status":true,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
}
function noneButtonClicked() {
    var theResult = (gOtherPage) ? "answer" : "none";
    var theAnswer = (isImageSearch()) ? "http://none.com" : "None";
    var returnData = {"pageIndex":"None","rankIndex":"None","theAnswer":theAnswer,"result":theResult,"status":false,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
}
function raButtonClicked() {
    var returnData = {"pageIndex":"None","rankIndex":"None","theAnswer":"RA","result":"answer","status":false,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
}
function inpButtonClicked() {
    var returnData = {"pageIndex":"None","rankIndex":"None","theAnswer":"INP","result":"answer","status":false,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
}
function wdButtonClicked() {
    var returnData = {"pageIndex":"None","rankIndex":"None","theAnswer":"WD","result":"answer","status":false,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
}
function buttonBoxCss(className) {
	$("."+className).css({"width":"auto","height":"auto"});
}
function setupKeyDown() {
    $("body").keydown( function(e) {
        var returnFalse = true;
        if (e.which == 120) {
            var instructionBox = $("#instructionBox");
            instructionBox.stop();
            var showing = instructionBox.data("shown");
            if (showing) {
                instructionBox.hide();
                instructionBox.data("shown", false);
            } else { 
                instructionBox.show("fast");
                instructionBox.fadeTo("fast",1, function() {
                    instructionBox.data("shown", true);
                });
            }
        }
        if (e.target.id != "enterAnswer") {
            if (e.which == 78) { // 78 = n : can't find
                noneButtonClicked();
            } else if (!isGoogle() && e.which == 83) { // 83 = s : answer with selection
                answerButtonClicked("select");
            } else if (!isGoogle() && e.which == 87) { // 87 = w : answer with url of page
                answerButtonClicked("url");
            } else if (e.which == 65) { // 87 = a : answer with input text
                answerButtonClicked("input");
            } else if (e.which == 80) { // 80 = p : close or go back page
                backButtonClicked();
            } else returnFalse = false;
        } else if (e.which == 13) answerButtonClicked("input");
        else returnFalse = false;
        if (returnFalse) {
            e.preventDefault ();
            e.stopPropagation ();
            return false;
        }
    });
}
function createInstructionBox(name,instructions,description) {
    var haveAnswer = false;
    var instructionBox = createDiv();
    var onImages = isImageSearch();
    instructionBox.appendTo("body")
        .draggable()
        .data("shown",true)
		.attr("id","instructionBox")
		.attr("dir","ltr")
        .css({"position":"fixed",
            "top":"100px","right":"5px","background-color":"grey","border-radius":"4px","border":"2px black ridge","z-index":"99999",
            "font-family":"Helvetica,Arial,Sans-Serif","cursor":"move","text-align":"left","line-height":"normal",
            "width":INSTRUCTIONBOXWIDTH + "px","font-size":INSTRUCTIONFONTSIZE + "px","color":"#F7F8E0","padding":"2px 6px 10px 10px"});
	if (gLocation.indexOf("google.ae") != -1) instructionBox.css({"left":"5px"});
    instructionBox.hover( function() {
        if ($(this).data("shown")) {
            $(this).stop();
            $(this).fadeTo("fast",1);
        }
    }, function() {
        if ($(this).data("shown") && !$("#enterAnswer").is(":focus")) {
            $(this).stop();
            $(this).fadeTo(4000,0.08);
        }
    });
    if (!INSTRUCTIONSSMALL) var mainInstructions = $("<h4>")
        .css({"margin":"0px","color":"white","letter-spacing":"normal","text-transform":"none","font-family":"Helvetica,Arial,Sans-Serif",
			  "font-size":INSTRUCTIONFONTSIZE + "px","line-height":"normal"})
        .html("[ move me around ] [ F9 = hide/show ] " + instructions);
    var newInstructions = $("<p>").html(description)
        .css({"margin":"10px 10px 0px","padding":"0px"});
    var controlArea = createDiv("Return: ")
        .css({"margin":"5px 6px"});
	if (gOtherPage && !onImages) var selButton = createTheButton(function() {
            answerButtonClicked("select");
        },"(S)election","khaki","black","12px",true,"JRInstButton","rSelButton","Send the Selection as the answer.").appendTo(controlArea);
    if (gOtherPage || isImageInst()) var urlButton = createTheButton(function() {
            answerButtonClicked("url");
        },"(W)ebsite Url","khaki","black","12px",true,"JRInstButton","rUrlButton","Send The current URL as the answer.").appendTo(controlArea);
    if (gSearching) { 
        var noneButton = createTheButton(function() {
            noneButtonClicked();
        },"(N)one","khaki","black","12px",true,"JRInstButton","rNoneButton","Send None as answer.").appendTo(controlArea);
    }
	var backButtonText = (gOtherPage) ? "Go Back (P)age": "Close (P)age";
    var closeButton = createTheButton(function() {
            backButtonClicked(name);
        },backButtonText,"khaki","black","12px",true,"JRInstButton","rBackButton","Go back to the previous page.").appendTo(controlArea);
	if (gOtherPage && !onImages) {
        controlArea.append("<br>");
        var noneButton = createTheButton(function() {
                noneButtonClicked();
            },"(N)one","khaki","black","12px",true,"JRInstButton","rNoneButton","Send None as answer.").appendTo(controlArea);
        var raButton = createTheButton(function() {
                raButtonClicked();
            },"RA","khaki","black","12px",true,"JRInstButton","rRaButton","Restricted Access, Login Required.").appendTo(controlArea);
        var inpButton = createTheButton(function() {
                inpButtonClicked();
            },"INP","khaki","black","12px",true,"JRInstButton","rInpButton","Information is not on the page.").appendTo(controlArea);
        var wdButton = createTheButton(function() {
                wdButtonClicked();
            },"WD","khaki","black","12px",true,"JRInstButton","rWdButton","Website is down.").appendTo(controlArea);
    }
	buttonBoxCss("JRInstButton");
    if (!INSTRUCTIONSSMALL) mainInstructions.appendTo(instructionBox);
    newInstructions.appendTo(instructionBox);
    controlArea.appendTo(instructionBox);
	var theQuestion = (isSearchQuestion() || gOtherPage) ? "Question: " + gQuestion : "Find Url: " + gUrlToSearch;
    var questionArea = createDiv(theQuestion)
        .css({"background-color":"black","font-size":(INSTRUCTIONFONTSIZE+4) + "px",
			  "padding":"3px 5px","margin":"10px 2px","color":"cyan"});
    if (onImages && gSearching) {
        var AddedInstructions = (isImageInst()) ? "Follow the instructions carefully:<br>" + gQuestion : "Press View image button after.";
        questionArea.html("click on this image anywhere on page:<br>Image domain ending in: " + gUrlToSearch + 
        "<br><img src='" + gImageSrc + "' width=120px><br>" + AddedInstructions);
    }
    else if (gOtherPage && onImages) questionArea.html("return the URL for this image.");
    questionArea.appendTo(instructionBox);
    var answerArea = createDiv();
    var answerText = createDiv("(E)dit Answer: drag and drop links or selections here too.").attr("id","rAnswerText").hide();
    answerArea.css({"margin":"5px 6px"}).append(answerText);
    var textInputArea = createDiv().attr("id","enterAnswerArea");
    var textInput = $("<input type='text'>").attr("class","myTextInput")
        .appendTo(textInputArea)
        .attr("id","enterAnswer")
        .css({"width":"100%","background":"white","padding":"1px","height":"auto"})
        .blur( function() {
            $("#instructionBox").stop();
            $("#instructionBox").fadeTo(4000,0.08);
        });
    var submitButton = createTheButton(function() {
            answerButtonClicked("input");
        },"Send (A)nswer","khaki","black","14px",true,"JRInstButton","rSendButton");
    var sendAnswer = createTheButton(function() {
            answerButtonClicked("input");
        },"Answer is Correct","khaki","black","14px",true,"JRInstButton","rCorrectButton");
    var wrongAnswer = createTheButton(function() {
            $("#rAnswerText").html("(E)dit Answer:").show();
            $("#enterAnswerArea").show();
            $("#rSendButton").closest("span").show();
            $("#rCorrectButton").closest("span").hide();
            $("#rWrongButton").closest("span").hide();
        },"Answer is Wrong","khaki","black","14px",true,"JRInstButton","rWrongButton");
    if (gQuestion.search(/time google took to complete the search/i) != -1) {
        questionArea.append("<br><br><font color='yellow'>I found an answer: " + gSearchTime);
        textInput.val(gSearchTime);
        haveAnswer = true;
    } else if (gQuestion.search("return the number of results") != -1) {
        questionArea.append("<br><br><font color='yellow'>I found an answer: " + gSearchResults + "</font>");
        textInput.val(gSearchResults);
        haveAnswer = true;
    }
    textInputArea.appendTo(answerArea).hide();
	submitButton.appendTo(answerArea).hide();
	if (gOtherPage && !onImages) {
        answerText.show();
		textInputArea.show();
		submitButton.show();
	} else if (gSearching && haveAnswer) { 
		sendAnswer.appendTo(answerArea);
		wrongAnswer.appendTo(answerArea);
    }
	answerArea.appendTo(instructionBox);
    setupKeyDown();
}
function searchButtonClick(thisNode) {
    var pageIndex = thisNode.data("pageIndex"), rankIndex = thisNode.data("rankIndex"), theAnswer = thisNode.data("theAnswer");
    var theResult = (isSearchQuestion()) ? "answer" : "pageRank";
    var returnData = {"pageIndex":pageIndex,"rankIndex":rankIndex,"theAnswer":theAnswer,"result":theResult,"status":true,
		"taskNumber":gTaskNumber,"subTaskNumber":gSubTaskNumber};
	var theData = dataFill( "found", returnData );
	window.opener.postMessage(theData,"*");
    if (!isSearchQuestion()) $(thisNode).closest(".r").find("a")[0].click();
}
function doSearchButtons(thisResult,searchName,index) {
    var pageIndex = Math.floor((index)/10)+1;
    var rankIndex = (index%10)+1;
    var buttonBackColor = "whitesmoke", buttonForeground = "black", theAnswer = "";
	var theInstruction = (isSearchQuestion()) ? gQuestion.toLowerCase() : "";
    var onImages = (searchName=="GoogleImages") ? true : false;
    theUrl = $(thisResult).find("a:first").attr("href");
	if (isYahoo()) theUrl = unescape(theUrl.split("RU=")[1].split("RK=")[0]);
    theTitle = $(thisResult).find("a:first").text();
    var descriptionFilter = (isYahoo()) ? ".compText:first" : (isBing()) ? "p:first" : ".st:first";
	var descriptionClosest = (isYahoo()) ? "li" : (isBing()) ? ".b_algo" : ".rc";
    theDescription = $(thisResult).closest(descriptionClosest).find(descriptionFilter).text();
	var addText = "";
	if (theInstruction.search("return the title") != -1) {
        addText = " The Title";
        theAnswer = theTitle;
	} else if (theInstruction.search("return the description") != -1) {
        addText = " The Description";
        theAnswer = theDescription;
	} else if ( (theInstruction.search("return the url") != -1) || 
				(theInstruction.search("return the official website") != -1)) {
        addText = " The Url";
        theAnswer = theUrl;
    }
    if (onImages) {
        var urlQuery = queryToAssoc(theUrl);
        theUrl = urlQuery["imgurl"];
    }
    matching = urlMatch( unescape(theUrl), gUrlToSearch );
    if (onImages && matching === 0) matching = urlMatch( unescape(theUrl), gImageSrc );
    if (matching > 0) {
        var topDiv = createDiv("").css({"height":"30px","font-size":"14px"});
		buttonForeground = "white";
        if ( matching == 1 ) {
            buttonBackColor="red";
            if (onImages) $(topDiv).text("Exact Image")
                .css({"background-color":"red","color":"white"});
        } else if ( matching == 2 ) {
            buttonBackColor="purple";
            if (onImages) $(topDiv).text("Same Hostname")
                .css({"background-color":"purple","color":"white"});
        } else if ( matching == 3 ) {
            buttonBackColor="MediumOrchid";
            if (onImages) $(topDiv).text("Same Domain")
                .css({"background-color":"MediumOrchid","color":"white"});
        }
        if (onImages) $(thisResult).find("img").before(topDiv);
    }
    if (!onImages) {
		var addRank = ((pageIndex>1) ? pageIndex + "-" : "") + rankIndex + ": ";
		var textButton = (isUrlQuestion()) ? "Return" + addText : (addText) ? addRank + "Return" + addText : "Select";
		var makeSpan = (addText==="") ? true : false;
        var theButton = createTheButton(function() {
                searchButtonClick($(this));
            },textButton,buttonBackColor,buttonForeground,"14px",makeSpan);
        var theMargin = (gLocation.indexOf("google.ae") != -1) ? "0px 0px 0px 5px" : "0px 5px 0px 0px";
        theButton.find("button")
            .attr("title","Page: " + pageIndex + " | Rank: " + rankIndex)
            .css({"margin":theMargin})
            .data("pageIndex",pageIndex).data("rankIndex",rankIndex).data("theAnswer",theAnswer)
            .button();
        if (searchName=="Yahoo") theButton.prependTo($(thisResult).find("h3"));
        else theButton.prependTo(thisResult);
    }
}
function setupInstructionBox() {
    var myInstructions = "[ p to go back ]<br>";
    if (!isSearchQuestion() && !isImageSearch()) 
		myInstructions = "[ n = nothing found ] [ p = go back ]";
		myDescription = (isImageSearch()) ? "" : "Red buttons are perfect matches<br>Purple buttons have same hostnames.<br>";
    createInstructionBox("search",myInstructions,myDescription,gQuestion);
}
function doYahooButtons() {
	$("#web li .dd:not(.LocalPc-listings)")
		.each( function(index) { doSearchButtons(this,"Yahoo",index); });
}
function doBingButtons() {
	$(".b_algo h2").each( function(index) { doSearchButtons(this,"Bing",index); });
}
function doGoogleButtons() {
    var findClass1 = (isNewsGoogle()) ? ".rc,._cnc" : ".rc";
	$("#rso").children("div.srg,li.g:not(.mnr-c,.card-section,.imagebox_bigimages)").find(findClass1).find(".r:not(.card-section,_YM,kno-fb)")
		.each( function(index) { doSearchButtons(this,"Google",index); });
}
function doGoogleImageButtons() {
	$("#rg .rg_di").each( function(index) { doSearchButtons(this,"GoogleImages",index); });
}
function taskButtonClick(thisNode) {
    if (gHitAccepted || ONPREVIEW) {
        gClicked = true;
        thisNode.css({"background-color":"LightYellow"}); gUrlToSearch = thisNode.data("urlToSearch");
        gImageSrc = thisNode.data("imageSrc"); gGoUrl = thisNode.data("goUrl");
        gKeyword = thisNode.data("theKeyword"); gZipCode = thisNode.data("zipCode");
        gQuestion = thisNode.data("question"); gTaskNumber = thisNode.data("taskNumber");
        gSubTaskNumber = thisNode.data("subTaskNumber");
        var theData = dataFill( "open page", makeDataNow() );
        window.parent.postMessage(theData,"*");
    }
}
function doZipCode() {
    if (!gQueryAssoc["changed_loc"]) {
        setTimeout( function() {
            if ($(".hdtb-mn-cont .hdtb-mn-hd").text().indexOf(gZipCode) != -1) doGoogleButtons();
            else {
                $("#_Zpd input:first").val(gZipCode);
                setTimeout( function() { $("#_Zpd input.ksb").click(); }, 700);
            }
        }, 700);
    } else doGoogleButtons();
}
function taskSearchButtons() {
    var textRepBr = isBrTextRep(), needImage = isImageSearch(), needZip = isZipcodeSearch(), searchQuestion = isSearchQuestion(), needNews = false;
    var doubleKeyword = isDoubleKeyword(), buttonNumbers = 1;
    var instParagraph = isInstructionParagraph();
    $(".task.cf").each( function( index ) {
        var taskNumber = index+1, theKeyword = [], theKeywordNode = [], urlToSearch = [], question = [];
        var textRepNodes = $(this).children(".text-rep");
        if (isSearchInTask()) gSearchDomain = getHostName($(this).find(".fld-heading a").attr("href"));
        theKeywordNode[0] = $(this).find(".text-rep:icontains('keyword:'):first, .text-rep:icontains('keyword 1:'):first");
        theKeyword[0] = theKeywordNode[0].html();
        theKeywordNode[1] = $(this).find(".text-rep:icontains('keyword 2:'):first");
        theKeyword[1] = removeHTMLTags(theKeywordNode[1].html());
        urlToSearch[0] = $(this).find(".text-rep:icontains('url'):first").html();
        urlToSearch[1] = $(this).find(".text-rep:icontains('url 2'):first").html();
        question[0] = (needImage) ? $(this).find(".fld-paragraph:first").text().trim() : 
				$(this).find(".text-rep:icontains('instructions:'):first,.text-rep:icontains('tags:'):first").text().trim();
        question[1] = (isSearchInTask()) ? $(this).find(".text-rep:icontains('instructions:'):eq(1)").text().trim() : question[0];
        var zipCode = (needZip) ? $(this).find(".text-rep:icontains('zipcode'):first").text() : "";
        theKeyword[0] = (textRepBr) ? removeHTMLTags(theKeyword[0].split("<br>")[1]).trim() : (theKeyword[0]) ? removeHTMLTags(theKeyword[0]).trim() : "";
        urlToSearch[0] = (textRepBr) ? removeHTMLTags(urlToSearch[0].split("<br>")[0]).trim() : (urlToSearch[0]) ? removeHTMLTags(urlToSearch[0]) : "";
        urlToSearch[1] = (urlToSearch[1]) ? removeHTMLTags(urlToSearch[1]) : ""
        theKeyword[0] = theKeyword[0].replace(/keyword.{0,2}:/i,"").replace(/\&amp;/,"&");
        theKeyword[1] = (theKeyword[1]) ? theKeyword[1].trim().replace(/keyword.{0,2}:/i,"").replace(/\&amp;/,"&") : "";
        urlToSearch[0] = urlToSearch[0].replace(/url.*?:/i,"").trim();
        urlToSearch[1] = urlToSearch[1].replace(/url.*?:/i,"").trim();
        zipCode = zipCode.replace(/zipcode:/,"").replace(/Location \(Zipcode or City, State\):/,"").trim();
        question[0] = question[0].replace(/instructions:/i,"").trim();
        question[1] = question[1].replace(/instructions:/i,"").trim();
        if (question[0]==="") question[0] = "Return the Url of the most relevant result into the HIT"
        if (question[0].indexOf("Tags:") != -1) question[0] = $(this).find(".fld-textarea:first").text() + question[0].replace("Tags:","");
        if (question[1]==="") question[1] = "Return the Url of the most relevant result into the HIT"
        var imageSrc = (needImage) ? $(this).find("img").attr("src") : "";
        var GoUrl = "", pos = "";
        if (gSearchDomain.search(/news.google.com/i) != -1) needNews = true;
        var tbmSearch = (needImage) ? "&tbm=isch" : ((needNews) ? "&tbm=nws" : "");
        var showResults = (isSearchQuestion()) ? 13 : 50;
        gSearchDomain = gSearchDomain.replace(/(www.|news.)/,"");
        var ion = (/google\./i.test(gSearchDomain)) ? "&ion=0" : "";
        var num = (gSearchDomain=="bing.com") ? "count" : (gSearchDomain=="yahoo.com") ? "n" : "num";
        var searchLetter = (gSearchDomain=="yahoo.com") ? "p" : "q";
        var languageSearch = (gSearchDomain=="google.ae") ? "&hl=ar" : (gSearchDomain=="google.ca") ? "&hl=fr" : "";
        var beginningUrl = (gSearchDomain=="yahoo.com") ? "https://search." : "http://www.";
        if (doubleKeyword) buttonNumbers = 2;
		var subTaskNumber = 0;
        for (var i = 0; i < buttonNumbers; i++) {
			if (doubleKeyword) subTaskNumber = (i==0) ? 1 : 0;
            GoUrl = beginningUrl + gSearchDomain + "/search?" + searchLetter + "=" + encodeURIComponent(theKeyword[i]) + ion + "&" + num + "=" +
					showResults + tbmSearch + languageSearch + "&jrio=" + taskNumber;
            var buttonText = (gHitAccepted || ONPREVIEW) ? "Search" : "You haven't accepted this hit";
            var theButton = createTheButton(function() {
                    taskButtonClick($(this));
                },buttonText,"whitesmoke","black","18px",!textRepBr)
                .appendTo(theKeywordNode[i]);
            $(theButton).find("button")
				.attr("id","jButton-" + taskNumber + "-" + subTaskNumber).attr("class","jButton")
				.css({"padding":"1px 15px","margin":"8px 15px"})
                .data("taskNumber",taskNumber).data("subTaskNumber",subTaskNumber).data("question",question[i])
                .data("pos",pos).data("goUrl",GoUrl).data("urlToSearch",urlToSearch[i])
                .data("zipCode",zipCode).data("theKeyword",theKeyword[i]).data("imageSrc",imageSrc)
                .button();
        }
    });
}
function getSearchDomain(title) {
    if (title.length>0) {
        if (title!="Search: Ranking of a Url" && title.indexOf("Search: Loc & Keyword - Google Acct Required") == -1) {
            title = title.replace("Search: Keywords on ","");
            title = title.replace("Search: Ranking of a Url on ","");
            title = title.replace("Search: Location and Keywords on ","");
            title = title.replace("Search: Image URL on ","");
            var splitTitle = title.split(' ');
            gSearchDomain = splitTitle[0].toLowerCase();
            if (gSearchDomain.match(/^search:$/i)) gSearchDomain="google.com"
        }
    }
}
function whichVersion(instructions,title) {
    var searchVersion = 0;
    instructions = instructions.toLowerCase();
    $.each(VERSION, function( index, value ) {
        if (index>0 && searchVersion==0) {
            if (value[0] == "" && value[1] == "") {
                if (title.toLowerCase().indexOf(value[2].toLowerCase()) != -1) searchVersion = index;
            } else {
                var search1 = new RegExp(value[0],"i");
                var search2 = new RegExp(value[1],"i");
                if (instructions.match(search1) && instructions.match(search2)) searchVersion = index;
            }
        }
    });
    return searchVersion;
}
// ********************* Start remote window listeners and functions *********************
function foundData(theData) {
    var taskData = JSON.parse(theData);
}
function openPageData(taskData) {
    gGoUrl = taskData.goUrl; gClicked = taskData.clicked; gSearchDomain = taskData.searchDomain;
    gSearchSite = taskData.searchSite; gSearchVersion = taskData.version; gUrlToSearch = taskData.urlToSearch;
    gImageSrc = taskData.imageSrc; gQuestion = taskData.question; gZipCode = taskData.zipCode;
    gKeyword = taskData.keyword; gTaskNumber = taskData.taskNumber; gSubTaskNumber = taskData.subTaskNumber;
}
function initializeRemote(taskData) {
    var action = (taskData.searchSite == "none") ? "answer question" : "search this";
    theData = dataFill( action, makeDataNow() );
    gPopUpWindow.postMessage(theData,"*");
}
function openPopWindow(theUrl,theTarget) { // Opens window with half the width of the screen and less than 200 pixels from the height on left side of screen.
    var popupFound = false; // chrome doesn't work with try and catch as well as firefox when permissions are wrong.
    try { // try to change the location of the popup window. If I can't then make a new popup.
        if (!gPopUpWindow.closed) { // check to see if popup window is closed.
            gPopUpWindow.location = theUrl; // Changes the url in the popup window. May work as long as window remembers popup reference.
            popupFound = true; // Popup window is opened and location should have been changed.
        }
    }
    catch(err) { // If can't change url in popup window because of permission failure then open another popup window.
           popupFound = false; // Make sure to open window because of a permission error. Not really needed but needed something in the catch area.
    }
    if (!popupFound) { // This was needed for chrome because it didn't catch the permission error on location changing.
        if (CLOSEPOPUPAFTER && gPopUpWindow) gPopUpWindow.close(); // Close the remote window if it's up because I can't use it.
        var halfScreen = screen.width - 400; // Make window 400 pixels less than the width of screen.
        var windowHeight = screen.height - 200; // The height is just 200 pixels less than the regular height to make it stand out.
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes"; // Normal specifications for a window.
        if (POPUPWINDOW) gPopUpWindow = window.open(theUrl,theTarget,'height=' + windowHeight + ',width=' + halfScreen + ', left=0,top=0' + specs,false); // open remote window on left side.
        else gPopUpWindow = window.open(theUrl,theTarget); // open remote window in a tab.
    }
}
function mainListener(e) { 
    // For sending messages from the iframe to the remote window. Can also be used if their is no iframe.
    var taskData = JSON.parse(e.data.innerData);
    gSearchSite = taskData.searchSite;
    if (e.data.action == "open page") { // Open a page in the remote window.
        gIframeSrc = e.source;
        openPageData(taskData); // Sets up the global variables for the data passed.
        if (gDebugging && gLogging) console.log("..Main got Open Page: " + gTag + " hitAccepted: " + true + " url: " + gGoUrl);
        gTag = e.data.tag; // Sets the tag from the hit in the iframe.
        var theAction = (gHitAccepted) ? "accepted" : (gClicked) ? "clicked" : "notaccepted"; // Find out if link was clicked or not.
        if (theAction != "notaccepted") openPopWindow(gGoUrl,"remotewindow"); // Open the url 
        else openPopWindow(gDefaultPage + "&action=" + theAction,"remotewindow"); // Show default page
    } else if (e.data.action == "initialize") { // Got a message to initialize for a remote page.
        if (gDebugging && gLogging) console.log("..Main got initialize: " + e.data.tag + " gSearchSite: " + gSearchSite);
        if (e.data.tag == -1) { // Check if tags match so no other windows can control me.
            gPopUpWindow = e.source; // Grab the source so I can send message back.
            initializeRemote(taskData); // initialize stuff for the page in the remote window.
        }
    } else if (e.data.action == "found") { // Got a found message.
        if (gDebugging && gLogging) console.log("..Main got found: " + gTag + " tag: " + e.data.tag);
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            var taskDone = false;
            var theData = dataFill("found", taskData); // Pass variables to iframe
            if (gIframeSrc) gIframeSrc.postMessage(theData,"*"); // post the message to the hit page in the iframe.
            if (taskData.result != "pageRank") taskDone = true;
            if (taskDone) {
                if (CLOSEPOPUPAFTER) { gPopUpWindow.close(); gPopUpWindow = null; } // Close window if option says so.
                else if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.location = gDefaultPage + "&action=notaccepted"; // Go to default page.
            }
        }
    }
}
function hitPageListener(e) {
	var theTaskNumber = 0, theSubTaskNumber = 0, addSub = "";
    var taskData = JSON.parse(e.data.innerData);
    gSearchSite = taskData.searchSite;
    if (e.data.action == "found") { // Got a found message.
        if (gDebugging && gLogging) console.log("..Hit got found: " + gTag + " tag: " + e.data.tag);
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            var taskDone = false;
			var taskNode = $("#jButton-" + taskData.taskNumber + "-" + taskData.subTaskNumber).closest(".task.cf");
            if (isSearchInTask() && isDoubleKeyword()) addSub = (taskData.subTaskNumber==0) ? "2" : "1";
            if (isRewriteSentence()) addSub = (taskData.subTaskNumber==0) ? "1" : "0";
            if (taskData.result == "pageRank" || taskData.result == "none") {
				var pageNum = $(taskNode).find("#PageNumber" + addSub + "-" + taskData.taskNumber);
				var rankNum = $(taskNode).find("#Ranking" + addSub + "-" + taskData.taskNumber);
				var checkBox = $(taskNode).find("#BeyondPage5-" + taskData.taskNumber);
            }
			if (taskData.result == "answer" || taskData.result == "none") {
				var inputUrl = $(taskNode).find("#URL-" + taskData.taskNumber);
				var inputDoubleUrl = $(taskNode).find("#URL1-" + taskData.taskNumber);
				var inputSentence= $(taskNode).find("#Sentence-" + taskData.taskNumber);
				var inputResponse= $(taskNode).find("#WorkerResponse" + addSub + "-" + taskData.taskNumber);
				var inputResponse2= $(taskNode).find("#WorkerResponse" + "2" + "-" + taskData.taskNumber);
				if (isDoubleKeyword()) theSubTaskNumber = (taskData.subTaskNumber===0) ? 1 : 0;
				theTaskNumber = (taskData.subTaskNumber===0) ? taskData.taskNumber + 1 : taskData.taskNumber;
			}
			if (!hasSelectNone() && (!taskData.status)) {
			} else {
				if ($(pageNum).length) $(pageNum).val(taskData.pageIndex);
				if ($(rankNum).length) $(rankNum).val(taskData.rankIndex);
				if (taskData.subTaskNumber==0 && $(inputUrl).length) $(inputUrl).val(taskData.theAnswer);
				if (taskData.subTaskNumber==1 && $(inputDoubleUrl).length) $(inputDoubleUrl).val(taskData.theAnswer);
				if ($(inputSentence).length) $(inputSentence).val(taskData.theAnswer);
				if ($(inputResponse).length) $(inputResponse).val(taskData.theAnswer);
				if (isRewriteSentence() && taskData.result == "none" && $(inputResponse2).length) $(inputResponse2).val(taskData.theAnswer);
				if ($(checkBox).length) $(checkBox).prop('checked', false);
			}
			if (taskData.result != "pageRank" && GOTONEXTTASK && gAutoNext) {
				var nextButton = $("#jButton-" + theTaskNumber + "-" + theSubTaskNumber );
                if ($(nextButton).length) {
					setTimeout( function() {
						$(nextButton)[0].click();
					}, Math.floor(Math.random() * (1500-500+1) + 500) );
					$(nextButton).focus();
					window.scrollByLines(9);
				} else {
                    $("#submitButton").focus();
                    gAutoNext = false;
                }
			}
        }
    }
}
function searchListener(e) { // Remote window receiving messages
    var taskData = JSON.parse(e.data.innerData);
    openPageData(taskData); // Sets up the global variables for the data passed.
    if (e.origin.search(/(mturk.com|crowdsource.com)/) != -1) {
        if (e.data.action == "search this") {
            gTag = e.data.tag;
            if (gDebugging && gLogging) console.log("..Remote got search stuff: " + gTag + " : " + gSearchSite);
            if (gZipCode) doZipCode();
            else if (gSearchSite=="google images") doGoogleImageButtons();
            else if (gSearchSite=="google") {
                var resultNumbers = $("#resultStats").text().match(/[\d,\.]+/g);
                gSearchResults = (resultNumbers[0]) ? resultNumbers[0] + " results" : "";
                gSearchTime = (resultNumbers[1]) ? resultNumbers[1] + " seconds" : "";
                doGoogleButtons();
            }
            else if (gSearchSite=="bing") doBingButtons();
            else if (gSearchSite=="yahoo") doYahooButtons();
            setupInstructionBox();
        }
    }
}
function popUpListener(e) {
    var taskData = JSON.parse(e.data.innerData);
    openPageData(taskData); // Sets up the global variables for the data passed.
    if (e.origin.search(/(mturk.com|crowdsource.com)/) != -1) {
        if (e.data.action == "answer question") {
            gTag = e.data.tag;
            if (gDebugging && gLogging) console.log("..Remote got answer question: " + gTag + " : " + e.data.tag);
            var myInstructions = "[ w = return URL ]<br />";
            myInstructions += "[ e = Fill in answer ] [ s = return selection ] [ p = go back ]\n";
            var timeoutValue = (isImageSearch() || !pagesToWait()) ? 300 : 2000;
            setTimeout( function() {
                if (!isImageSearch() && (gQuestion.indexOf(" sentence") != -1 || gQuestion.indexOf("provided tags:") != -1)) {
                    var thisTags = gQuestion.split(":")[1];
                    if (isTagsSearching()) {
                        var searchThis = thisTags.replace(/\s/g,"").replace(/,/g,"|");
                        var regSearch = new RegExp("(" + searchThis + ")","i");
                        $("body").highlightSentences(regSearch);
                    } else $(".portfolio,#content,.content,#body_container,.inner,#container,.profileData,.blog-posts,.page-container,#main-col,.col_main,#ja-mainbody,.rt-container,#tmglBody,.bio,#bio,#main,#headline,#mainContent,.content-area,#bodyContent,#tackk,#profile,#cir-content-area,#layout-about,.article-body,.pageMain,.profile-content,.articleText,.column2,.about")
                        .highlightSentences(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/);
                }
                createInstructionBox("other",myInstructions,"","");
            }, timeoutValue);
		}
    }
}
function allowSelectable() {
    $.extend($.fn.enableTextSelect = function() {
        return this.each(function() { $(this).unbind("mousedown"); });
    });
    $("h1.text-rep").attr("unselectable","").css({"-moz-user-select":"","-webkit-user-select":""});
    $("h2.text-rep").attr("unselectable","").css({"-moz-user-select":"","-webkit-user-select":""});
}

$(document).ready(function() {
    if (isHitPage()) {
        window.addEventListener("message", function(e){ if ( verifyMessage(e) ) hitPageListener(e); }, false);
        gTag = new Date().getTime(); // A unique global tag used to pass messages only for this session.
        allowSelectable();
        gHitAccepted = !isPreviewMode();
        var instructions = $("#instructions .instruction-content").html();
        var title = $(".projectTitle");
        gSearchVersion = whichVersion(instructions,title.text());
        if (isRewriteSentence()) gAutoNext = false;
        if (gSearchVersion > 0) {
            if (gDebugging && gLogging) console.log("..Found crowdsource version " + gSearchVersion + ": " + VERSION[gSearchVersion][2]);
            getSearchDomain(title.text());
            taskSearchButtons();
        }
    } else if (isGoogle() || isYahoo() || isBing()) {
        gSearching = true;
		window.addEventListener("message", function(e){ if ( verifyMessage(e) ) searchListener(e); }, false);
        gSearchSite = (isImageGoogle()) ? "google images" : (isGoogle()) ? "google" : (isBing()) ? "bing" : (isYahoo()) ? "yahoo" : "";
		var theData = dataFill( "initialize", {"searchSite":gSearchSite} );
		if (window.opener) window.opener.postMessage(theData,"*");
    } else if (isStartPage()) {
        if (gQueryAssoc["JRnewpage"] && gQueryAssoc["JRnewpage"] == SCRIPTTAG) {
            document.body.innerHTML = "<br><H1 style='text-align:center; font-size:25px; color:darkblue;'>Waiting for a command to go to a special place!</H1>";
            if (gQueryAssoc["action"] != "accepted") document.body.innerHTML += "<br><H2 style='text-align:center; color: blue;'><b>Hit hasn't been accepted. Remember to accept the hit if you want!</b></H2>";
        }
    } else if (isMturk() || isCrowdsource()) {
        var requesterName = (isCrowdsource()) ? "crowdSource" : $("table .capsule_field_title:contains('Requester'):first").next().text().trim();
        if (requesterName.search(/crowdsource/i) != -1) { // Check to see if it's Crowdsource requester.
            window.addEventListener("message", function(e){ if ( verifyMessage(e) ) mainListener(e); }, false);
            window.onbeforeunload = function() {
                if (CLOSEPOPUPAFTER) if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.close();
                else if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.location = gDefaultPage + "&action=notaccepted";
            };
        }
	} else if (window.opener) {
        gOtherPage = true;
		window.addEventListener("message", function(e){ if ( verifyMessage(e) ) popUpListener(e); }, false);
		var theData = dataFill( "initialize", {"searchSite":"none"}  );
		window.opener.postMessage(theData,"*");
	}
    $( ".JRInstButton" ).tooltip();
});