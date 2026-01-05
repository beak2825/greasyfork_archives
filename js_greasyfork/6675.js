// ==UserScript==
// @name            JR Derek Browers Bing and google map search
// @version         0.6.2
// @description     A script to make it easier to search for the business name in Bing and google
// @author          (JohnnyRS) (johnnyrs@allbyjohn.com)
// @include     	http*://*mturkcontent.com/dynamic*
// @include     	http*://s3.amazonaws.com/mturk_bulk*
// @include         http*://*.mturk.com/mturk/*
// @include         http*://*.bing.com/search*
// @require         http://code.jquery.com/jquery-1.11.2.min.js
// @require         http://code.jquery.com/ui/1.11.3/jquery-ui.min.js
// @run-at          document-end
// @grant       	none
// @namespace       https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/6675/JR%20Derek%20Browers%20Bing%20and%20google%20map%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/6675/JR%20Derek%20Browers%20Bing%20and%20google%20map%20search.meta.js
// ==/UserScript==

// version 0.3 - Tested script with the google map search. Bing google map search might work. Added a + at the beginning of
// bing search for the local listing to maybe get a better result.
//
// Description: This script changes the company name into a link with the postcode added to make it easy to do a bing search.
// It will also add another link which put quotes around the company name which is more exact but may not find results.
// If one link doesn't give any results. Try the other. If you drag the links to another browser window it will open
// it very fast. Then you can just drag the link from the bing search to the url field in the hit.

// ------------------- CONSTANT VARIABLES - options --------------
var POPUPWINDOW = true;					    // Opens window in a popup window instead of a tab.	
var CLOSEPOPUPAFTER = false;                 // Allows the popup window to be closed after finishing hit.
var GOTONEXTTASK = true;                    // This will make it so the script goes to the next task after you finish a task.
var ONPREVIEW = true;                       // Allows search buttons to work in preview mode. Mostly for testing purposes.
var gLogging = false, gDebugging = false;     // Gives lot of info in the console log for debugging purposes mostly.
// ---------------------------------------------------------------
var MYVERIFY = "feetsmell";                               // used for all my scripts to verify messages originating from my script.
var SCRIPTNAME = "JR derek browers map search";        // used to make sure this script answers to messages originating from this script only.
var SCRIPTTAG = "JRDBM";                                // Used for a unique tag for each script I make. Used in messaging and variables passing.    

var gLocation = gLocation = $(location).attr('href'), gTag = -1, gPopUpWindow = null, gUrl = "https://www.mturk.com/mturk/policies?JRnewpage=now";
var gHitAccepted = false, gInterval = null, gTimeout = null, gIframeSrc = null;
var gDefaultPage = "http://www.allbyjohn.com/blank.html?JRnewpage=now&ST=" + SCRIPTTAG;
var gPingAccepted = false, gUrl = gDefaultPage, gTimeout = null, gPopUpWindow = null;
if (typeof console.log !== 'function') { gDebugging=false; gLogging=false; }
else { gLogging = (gLogging) ? gLogging : gDebugging; }
function isBing() { return gLocation.search(/^http.?:\/\/[^.]*\.bing\./i) != -1 ? true : false; }
function isOnHit() { return (gLocation.search(/^http.?:\/\/[^.]*\.amazonaws\./i) != -1) ||
                            (gLocation.search(/^http.?:\/\/[^.]*\.mturkcontent\./i) != -1) ? true : false; }

function dataFill(action, data1, data2, data3, data4, data5, data6) {
    if(typeof(data1)==='undefined') data1 = "";
    if(typeof(data2)==='undefined') data2 = "";
    if(typeof(data3)==='undefined') data3 = "";
    if(typeof(data4)==='undefined') data4 = "";
    if(typeof(data5)==='undefined') data5 = "";
    if(typeof(data6)==='undefined') data6 = "";
    var tempe = {"verify": MYVERIFY, "scriptName": SCRIPTNAME, "tag": gTag, "action": action,
            "data1": data1, "data2": data2, "data3": data3, "data4": data4, "data5": data5,
            "data6": data6};
    return tempe;
}
function verifyMessage(e,thisLocation) {
    if (e.data.verify === MYVERIFY && e.data.scriptName === SCRIPTNAME) return true;
    else return false;
}
function createMyElement(elementName,theClass,theId,theName,theText,theStyle) {
    var theElement = document.createElement(elementName);
    if (theClass) theElement.className = theClass;
    if (theId) theElement.id = theId;
    if (theName) theElement.name = theName;
    if (theStyle) theElement.setAttribute("style",theStyle);
    if (theText) theElement.innerHTML = theText;
    return theElement;
}
function createButton(theClass,theId,theName,theValue,theStyle) {
    var theButton = createMyElement("input",theClass,theId,theName,"",theStyle);
    theButton.type = "button";
    if (theValue) theButton.value = theValue;
    return theButton;
}
function createLink(theClass,theId,theName,theUrl,theTitle,theText,theTarget,theStyle) {
    var theLink = createMyElement("a",theClass,theId,theName,theText,theStyle);
    theLink.href = theUrl;
    theLink.title = theTitle;
    if (theTarget) theLink.setAttribute("target",theTarget);
    return theLink;
}
function searchInClass(theClass,theIndex,theText) {
    var classNode = document.getElementsByClassName(theClass)[theIndex];
    if (typeof classNode !== 'undefined') {
       var retVal = classNode.innerHTML.indexOf(theText);
       return (retVal!=-1) ? classNode.innerHTML.substr(retVal) : null;
    }
    return null;
}
function searchInNode(theNode,theText) {
    if (typeof theNode !== 'undefined') {
        return ( (retVal=theNode.innerHTML.indexOf(theText)) != -1) ? theNode.innerHTML.substr(retVal) : null;
    }
    return null;
}
function searchInAllElements(theNode,theElement,theText) {
    var tagNodes = theNode.getElementsByTagName(theElement);
    var i=0, found=false, returnvar=null;
    while (tagNodes[i] && !found) {
        found = ((returnvar = searchInNode(tagNodes[i],theText)) === null) ? false : true;
        if (!found) i++;
    }
    return (found) ? tagNodes[i] : null;
}
function setArrayPointersTag(theNode,tag,thisArray) {
    var tagNodes = theNode.getElementsByTagName(tag);
    var arr=[], temp={};
    for (var i = 0, aI = 0, len=tagNodes.length, arrLen=thisArray.length; i < len && aI < arrLen; i++) {
        if ( tagNodes[i].innerHTML.indexOf(thisArray[aI]) !== -1 ) { 
              aI++;
        temp = {position:i,node:tagNodes[i],next:tagNodes[i+1]};
            arr.push(temp);
        }
    }
    return arr;
}
String.prototype.verifyUrl = function() {
    var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    if (!myRegExp.test(this)) return false;
    else return true;
}
String.prototype.makeUrlHTML = function(theText,theTarget) {
    if (this.verifyUrl) {
        var aTarget="", linkedText="";
        if (typeof theTarget !== 'undefined') aTarget=" target='" + theTarget + "'";
        if (theText) linkedText = theText;
        else linkedText = this;
        return "<a href='" + this + "'" + aTarget + ">" + linkedText + "</a>";
    }
    return null;
}
function createDiv(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<div>').html(inner); }
function createSpan(theHtml) { var inner = (theHtml) ? theHtml : ""; return $('<span>').html(inner); }
function createTheButton(toDo,theHtml,theBackgroundColor,theColor,theFontSize,doSpan,className,idName) {
	var backgroundColor = (theBackgroundColor) ? theBackgroundColor : "initial";
	var textColor = (theColor) ? theColor : "initial";
	var fontSize = (theFontSize) ? theFontSize : "9px";
    var theContainer = (doSpan) ? createSpan() : createDiv();
	var theButton = $('<button>').data("status","off")
		.data("backColor",backgroundColor)
		.data("textColor",textColor)
		.data("htmlText",theHtml)
        .html(theHtml)
        .attr("type","button")
        .appendTo(theContainer)
		.css({"font-size":fontSize,
			  "border-radius":"4px",
			  "text-shadow":"none",
			  "float":"none",
			  "color":textColor,
              "background-color":backgroundColor,
			  "cursor":"default",
			  "padding":"2px 4px",
			  "text-transform":"none",
			  "line-height":"normal",
			  "background-image":"none",
              "border":"1px groove black"});
	if (className) theButton.addClass(className);
	if (idName) theButton.attr("id",idName);
	theButton.click(toDo);
	return theContainer;
}
function searchButtonClick(thisButton) {
    var theData = dataFill("found it", $(thisButton).data("detailLink")); // Send a pong message back to start page change process.
    window.opener.postMessage(theData,"*"); // post the message to window opened.
}
function doSearchButtons(thisResult,searchName,index) {
    var pageIndex = Math.floor((index)/10)+1;
    var rankIndex = (index%10)+1;
    var buttonBackColor = "whitesmoke";
    var buttonForeground = "black";
    theUrl = $(thisResult).find("a:first").attr("href");
	var addText = "";
    var addRank = ((pageIndex>1) ? pageIndex + "-" : "") + rankIndex + ": ";
    var textButton = (addText) ? addRank + "Return" + addText : "Select";
    var makeSpan = (addText==="") ? true : false;
    var detailLink = $(thisResult).closest("li").find(".b_vList .b_vPanel a:eq(1)").attr("href");
    if (detailLink) { 
        var theButton = createTheButton(function() {
                searchButtonClick($(this));
            },textButton,buttonBackColor,buttonForeground,"14px",makeSpan);
        theButton.find("button")
            .attr("title","Page: " + pageIndex + " | Rank: " + rankIndex)
            .css({"padding":"2px 4px"})
            .data("detailLink","http://www.bing.com" + detailLink)
            .button();
        theButton.prependTo(thisResult);
        $(thisResult).find("button").css({"margin":"0px 5px 0px 0px"});
    }
}
function doBingButtons() {
	$(".b_algo h2,.b_ans h2").each( function(index) { doSearchButtons(this,"Bing",index); });
}
function doGoogleButtons() {
	$(".g:not(.card-section,.imagebox_bigimages) .rc .r:not(.card-section,_YM,kno-fb)")
		.each( function(index) { doSearchButtons(this,"Google",index); });
}
function isMturk() { return gLocation.search(/^http.?:\/\/[^.]*\.mturk\./i) != -1 ? true : false; }
function isHitPage() { return gLocation.search(/^http.?:\/\/[^.]*\.crowdsource\./i) != -1 ? true : false; }
function isStartPage() { return gLocation.indexOf(gDefaultPage) != -1 ? true : false; }
// ********************* Start remote window listeners and functions *********************
function openPopWindow(theUrl,theTarget) { // Opens window with half the width of the screen and less than 200 pixels from the height on left side of screen.
    try { // try to change the location of the popup window. If I can't then make a new popup.
        gPopUpWindow.location = theUrl; // Changes the url in the popup window. May work as long as window remembers popup reference.
    }
    catch(err) { // If can't change url in popup window because of permission failure then open another popup window.
        if (CLOSEPOPUPAFTER && gPopUpWindow) gPopUpWindow.close(); // Close the remote window if it's up because I can't use it.
        var halfScreen = screen.width/2; // Make window 400 pixels less than the width of screen.
        var windowHeight = screen.height - 200; // The height is just 200 pixels less than the regular height to make it stand out.
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes"; // Normal specifications for a window.
        if (POPUPWINDOW) gPopUpWindow = window.open(theUrl,theTarget,'height=' + windowHeight + ',width=' + halfScreen + ', left=0,top=0' + specs,false); // open remote window on left side.
        else gPopUpWindow = window.open(theUrl,theTarget); // open remote window in a tab.
    }
}
function mainListener(e) { 
    // Used to send messages from the iframe to the remote window. Can also be used if their is no iframe.
    // If no iframe then just call this function instead of sending a message to the top window.
    gHitAccepted = searchInAllElements(document,"td","Finished with this HIT?"); // Checks for this text to find out if his has been accepted.
    if (e.data.action == "open page") { // A message is sent to open a page in the remote window.
        gIframeSrc = e.source;
        if (gDebugging && gLogging) console.log("..Main got Open Page: " + gTag + " hitAccepted: " + gHitAccepted + " url: " + e.data.data1);
        if (e.data.data2 || gHitAccepted || ONPREVIEW) gUrl = e.data.data1; // save the url so it can be used when it gets a ping from the remote window.
        else gUrl = gDefaultPage + "&action=notaccepted"; // Use the defaultpage if hit isn't accepted so it won't be confusing.
        gTag = e.data.tag; // Sets the tag from the hit in the iframe.
        //openPageData(e.data.data3); // Sets up the global variables for the data passed so I can pass it on to the remote window.
        // Don't go to url when it wasn't clicked and hit isn't accepted. e.data.data2 is true when a user clicks on links. So window
        // won't open on a hit that isn't accepted yet but a user can still click links to try if the hit might be easy to do.
        var theAction = (gHitAccepted) ? "accepted" : (e.data.data2) ? "clicked" : "notaccepted"; // Find out if link was clicked or not.
        if (theAction != "notaccepted") openPopWindow(gUrl,"remotewindow"); // Open the url if it's accepted or clicked without going to default page first.
        else openPopWindow(gDefaultPage + "&action=" + theAction,"remotewindow"); // Open remote window but if it's already opened it will leave it opened.
    } else if (e.data.action == "ping") { // received a ping from remote window.
        if (isMturk()) { // check if this page is the mturk page which it should be anyway.
            if (!gPingAccepted) { // If ping hasn't been seen then get the source pointer to remote window.
                if (gDebugging && gLogging) console.log("..Main got Ping: " + gTag + " e.data.tag: " + e.data.tag + " gUrl: " + gUrl);
                gPopUpWindow = e.source; // Grab the ping source for future use so I can change location of remote window.
                gPingAccepted = true; // Ping is now accepted.
                if (gTimeout) clearTimeout(gTimeout); // remove the timeout so it won't create a new remote window.
            }
            if (gUrl != gDefaultPage) { // make sure the url is not the default page.
                var theData = dataFill("pong", gUrl); // Send a pong message back to start page change process.
                gPopUpWindow.postMessage(theData,"*"); // post the message to window opened.
            }
        }
    } else if (e.data.action == "found it") {
        var theData = dataFill("found it", e.data.data1); // Pass variables to iframe
        if (gIframeSrc) gIframeSrc.postMessage(theData,"*"); // post the message to the hit page in the iframe.
    }
}
function popUpListener(e) { // Remote window receiving messages
}
function hitPageListener(e) {
    if (e.data.action == "found it") { // A message is sent to open a page in the remote window.
        $("#web_url").val( e.data.data1 );
    }
}
// ******************************* End of remote windows listeners and functions ***************************
function toggleInstructions(theDiv,theContainer) {
    theContainer.style.padding="0";
    arguments.callee.hiddenToggle = arguments.callee.hiddenToggle || false;
    arguments.callee.hiddenToggle = !arguments.callee.hiddenToggle;
    theDiv.style.overflow="hidden";
    if (arguments.callee.hiddenToggle) {
       theDiv.style.height="21px";
       theDiv.style.margin="0";
       theDiv.getElementsByClassName("panel-heading")[0].style.padding="0";
       theDiv.getElementsByClassName("panel-heading")[0].style.margin="0";
    } else {
       theDiv.style.height="auto";
    }
}
function hideInstructions(className,containerName,toggleClass) {
    var theContainer = document.getElementsByClassName(containerName)[0];
    var theInstructions = theContainer.getElementsByClassName(className)[0];
    theInstructions.getElementsByClassName("panel-heading")[0].innerHTML += " (Click here to show instructions)";
    toggleInstructions(theInstructions,theContainer);
    var panelHeading = theInstructions.getElementsByClassName(toggleClass)[0];
    panelHeading.onclick = function() { toggleInstructions(theInstructions,theContainer); };
}

var googleMapSearch = "https://maps.google.com/maps?q=";
var bingMapSearch = "http://www.bing.com/maps/?q=";
var bingLocalSearch = "http://www.bing.com/entities/search/?filters=segment%3a\"local\"&q=";
var bingSearch = "http://www.bing.com/search?count=40&q=";
$(document).ready(function() {
    if (isOnHit()) {
        window.addEventListener("message", function(e){ if ( verifyMessage(e) ) hitPageListener(e); }, false);
        if (searchInClass("panel-body",0,"Open your browser and <strong>go to Google Maps</strong>:&nbsp;https://www.google.com/maps")) {
            if (gLogging) console.log(".JR testing found Google Map");
            var thePointers = setArrayPointersTag(document,"td",["Restaurant/Retailer name:","Keyword:","Post Code:"]);
            if (thePointers.length>0) {
                var storeName = thePointers[0].next.innerHTML.trim();
                var theKeyword = thePointers[1].next.innerHTML.trim();
                var postCode = thePointers[2].next.innerHTML.trim();
                var theUrl = googleMapSearch + theKeyword.replace(" ","+") + ",+" + postCode;
                thePointers[1].next.innerHTML = thePointers[1].next.innerHTML.replace(theKeyword,theUrl.makeUrlHTML(theKeyword,"theGoogle"));
            }    
        } else if (searchInClass("panel-body",0,"Find the ranking of this business in a Bing") || searchInClass("panel-body",0,"Find the ranking of this business in a BING LOCAL search")) {
            if (gLogging) console.log(".JR found Bing search business");
            theTables = document.getElementsByTagName("table");
            var theUrl = [];
            if (theTables.length > 0) {
                for (var i=0, len=theTables.length; i<len; i++) {
                    var thePointers = setArrayPointersTag(theTables[i],"td",["Search This:","Business Name:"]);
                    if (thePointers.length>1) {
                        var searchThis = thePointers[0].next.innerHTML.trim();
                        var BusinessName = thePointers[1].next.innerHTML.trim();
                        var theBingSearch = bingMapSearch;
                        if (searchInClass("panel-body",0,"Find the ranking of this business in a BING LOCAL search")) theBingSearch = bingLocalSearch;
                        theUrl[i] = theBingSearch + encodeURIComponent(searchThis.replace(/\&amp;/g,"&")).replace(/\%20/g,"+").replace(/'/g, "%27");
                        var searchButton = createButton("myButton","searchButton" + (i+1),theUrl[i],searchThis,"font-size:10px; margin-left:10px;");
                        var buttonNA = createButton("myButton","noneButton-" + (i+1),"","N/A","font-size:10px; margin-left:10px;");
                        searchButton.onclick = function() {
                            var theData = dataFill("open page", this.getAttribute("name"), true);
                            window.top.postMessage(theData,"*");
                        }
                        buttonNA.onclick = function() {
                            var theTables = document.getElementsByTagName("table");
                            var theNumber = this.id.replace("noneButton-","");
                            document.getElementsByName("Search Rank")[theNumber-1].value = "N/A";
                        }
                        if (searchThis != "N/A") thePointers[0].next.appendChild(searchButton);
                        thePointers[0].next.appendChild(buttonNA);
                    }
                }
                var theData = dataFill("open page", theUrl[0], false);
                window.top.postMessage(theData,"*");
            }
        } else if (searchInClass("panel-body",0,"Find the ranking of this business in a Google Maps search")) {
            if (gLogging) console.log(".JR testing found Google Map");
            theTables = document.getElementsByTagName("table");
            var theUrl = [];
            if (theTables.length > 0) {
                for (var i=0, len=theTables.length; i<len; i++) {
                    var thePointers = setArrayPointersTag(theTables[i],"td",["Search This:","Business Name:"]);
                    if (thePointers.length>1) {
                        var searchThis = thePointers[0].next.innerHTML.trim();
                        var BusinessName = thePointers[1].next.innerHTML.trim();
                        theUrl[i] = googleMapSearch + searchThis.replace(/\s/g,"+").replace(/'/g, "%27") + "&output=classic&dg=opt";
                        var searchButton = createButton("myButton","searchButton" + (i+1),theUrl[i],searchThis,"font-size:10px; margin-left:10px;");
                        var buttonNA = createButton("myButton","noneButton-" + (i+1),"","N/A","font-size:10px; margin-left:10px;");
                        searchButton.onclick = function() {
                            var theData = dataFill("open page", this.getAttribute("name"), true);
                            window.top.postMessage(theData,"*");
                        }
                        buttonNA.onclick = function() {
                            var theTables = document.getElementsByTagName("table");
                            var theNumber = this.id.replace("noneButton-","");
                            document.getElementsByName("Search Rank")[theNumber-1].value = "N/A";
                        }
                        if (searchThis != "N/A") thePointers[0].next.appendChild(searchButton);
                        thePointers[0].next.appendChild(buttonNA);
                    }
                }
                var theData = dataFill("open page", theUrl[0], false);
                window.top.postMessage(theData,"*");
            }
        } else if (searchInClass("panel-body",0,"Find the Bing Local listing URL&nbsp;for this&nbsp;business.")) {
            if (gLogging) console.log(".JR found Bing search business");
            var thePointers = setArrayPointersTag(document,"td",["Business ID:","Business Name:","Business Postcode:"]);
            if (thePointers.length==3) {
                hideInstructions("panel-primary","container","panel-heading")
                var businessName = thePointers[1].next.innerHTML.trim();
                var postCode = thePointers[2].next.innerHTML.trim();
                var theUrl = bingSearch + encodeURIComponent(businessName.replace(/\&amp;/g,"&")).replace(/\%20/g,"+").replace(/'/g, "%27") + ",+" + postCode;
                var exactUrl = bingSearch + "%2B\"" + encodeURIComponent(businessName.replace(/\&amp;/g,"&")).replace(/\%20/g,"+").replace(/'/g, "%27") + "\",+" + postCode;
                var searchButton = createButton("myButton","searchButton1",theUrl,"Search Business","font-size:10px; margin-left:10px;");
                searchButton.onclick = function() {
                    var theData = dataFill("open page", this.getAttribute("name"), true);
                    window.top.postMessage(theData,"*");
                }
                var exactButton = createButton("myButton","searchButton2",exactUrl,"Exact Search","font-size:10px; margin-left:10px;");
                exactButton.onclick = function() {
                    var theData = dataFill("open page", this.getAttribute("name"), true);
                    window.top.postMessage(theData,"*");
                }
                var noneButton = createButton("myButton","noneButton",exactUrl,"None Found","font-size:10px; margin-left:10px;");
                noneButton.setAttribute("searchUrl",theUrl);
                noneButton.onclick = function() {
                    $("#web_url").val( $(this).attr("searchUrl") );
                }
                thePointers[1].next.innerHTML += "<br>";
                thePointers[1].next.appendChild(searchButton);
                thePointers[1].next.appendChild(exactButton);
                thePointers[1].next.appendChild(noneButton);
                window.scrollTo(0,document.body.scrollHeight +20);
                document.body.onunload = function() {
                    if (gPopUpWindow) gPopUpWindow.location = "https://www.mturk.com/mturk/policies?JRnewpage=now";
                }
                var theData = dataFill("open page", searchButton.getAttribute("name"), false);
                window.top.postMessage(theData,"*");
            }
        }
    } else if (isBing()) {
        doBingButtons();
    } else {
        window.addEventListener("message", function(e){ if ( verifyMessage(e) ) mainListener(e); }, false);
        window.onbeforeunload = function() {
            if (CLOSEPOPUPAFTER) {
                if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.close();
            } else {
                if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.location = gDefaultPage + "&action=notaccepted"; // Check if remote window is opened still and set it to default page.
            }
        };
    }
});
