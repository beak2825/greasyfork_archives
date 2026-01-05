// ==UserScript==
// @name            JR crowd task find company
// @version         0.5.6
// @description     Easy script to link the company name and the industry using google or bing.
// @author          JohnnyRS
// @include     	http*://*mturk.com/mturk/*
// @include         http*://*.allbyjohn.com/blank.html?JRnewpage=now*
// @include         http*://*.google.com/search*
// @include         http*://*.bing.com/search*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @run-at          document-end
// @grant           none
// @namespace       https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/7037/JR%20crowd%20task%20find%20company.user.js
// @updateURL https://update.greasyfork.org/scripts/7037/JR%20crowd%20task%20find%20company.meta.js
// ==/UserScript==

// This script changes the company name to a link to a search engine. It will use google
// bing or will randomly pick from either if both options are true. You can change the options below.
// Default will be both on. It will open a pop up window for the search to the left of your screen.
// If you keep your mturk window on the right it will make it easier. For this hit the window does not close
// so it will load in the same window to your left. You can resize that window or even move it where you
// want. There is a button to fill in NA if you can't find anything. You can make the first search use
// the Company Name or the Company Name plus the Industry.
//**************** Constant Options **********************
var GOOGLESEARCHING = true;
var BINGSEARCHING = true;
var FIRSTSEARCH = "Company Name";           // "Company Name" or "Industry" is accepted.
var POPUPWINDOW = true;					    // Opens window in a popup window instead of a tab.	Remember to allow pop ups or it won't show up.
var CLOSEPOPUPAFTER = false;                 // Allows the popup window to be closed after finishing hit.
var ONPREVIEW = false;                      // Allows search buttons to work in preview mode. Mostly for testing purposes.
var CHROMEINTAB = false;
var AUTOSUBMIT = false;
//********************************************************
var MYVERIFY = "feetsmell";                             // used for all my scripts to verify messages originating from my script.
var SCRIPTNAME = "JR crowd task find companies";        // used to make sure this script answers to messages originating from this script only.

var gLocation = document.URL.toString(), gPopUpWindow = null, gDefaultPage = "http://www.allbyjohn.com/blank.html?JRnewpage=now";
var gHitAccepted = false, gInterval = null, gTag = -1, gTimeout = null, gUrl = gDefaultPage, gPingAccepted = false, gVersion = 0;
var gLogging = true, gDebugging = true;
if (typeof console.log !== 'function') { gDebugging=false; gLogging=false; }
else { gLogging = (gLogging) ? gLogging : gDebugging; }


function queryToAssoc(queryArray) {
    var splits = null;
    var returnAssoc = {};
    for (var i = 0, len=queryArray.length; i < len; i++) {
        splits = queryArray[i].split("=");
        returnAssoc[splits[0]] = splits[1];
    }
    return returnAssoc;
}
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
var gHostName = getHostName(gLocation);
var queryString = (window.location.search).substring(1); // Get the querystring from current location removing the ? at front.
var queryAssoc = queryToAssoc(queryString.split("&")); // split querystring into an associative array with variables.
function isGoogle() { return gLocation.search(/^http.?:\/\/[^.]*\.google\./i) != -1 ? true : false; }
function isBing() { return gLocation.search(/^http.?:\/\/[^.]*\.bing\./i) != -1 ? true : false; }
function isStartPage() { return gLocation.indexOf(gDefaultPage) != -1 ? true : false; }
function isJRIO() { return (queryAssoc["jrio"] == "feetwalk") ? true : false; }

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
function searchInClass(theNode,theClass,theIndex,theText) {
    var classNode = document.getElementsByClassName(theClass)[theIndex];
    if (typeof classNode !== 'undefined') {
       var retVal = classNode.innerHTML.indexOf(theText);
       return (retVal!=-1) ? classNode.innerHTML.substr(retVal) : null;
    }
    return null;
}
function searchInTagName(theTagName,searchText) {
    var theTags = document.getElementsByTagName(theTagName);
    for (var i=0,len=theTags.length; i<len; i++) {
        if (theTags[i].getAttribute("name") == searchText) return true;
    }
    return false;
}
function setArrayPointersClass(theNode,theClass,thisArray) {
    var classNodes = theNode.getElementsByClassName(theClass);
    var arr=[], temp={};
    for (var i = 0, aI = 0, len=classNodes.length, arrLen=thisArray.length; i < len && aI < arrLen; i++) {
        if ( classNodes[i].innerHTML.indexOf(thisArray[aI]) !== -1 ) { 
            aI++;
            temp = {position:i,node:classNodes[i],next:classNodes[i+1]};
            arr.push(temp);
        }
    }
    return arr;
}
function searchInnerText(node,theText) { return node.innerHTML.indexOf(theText); }
function searchInNode(theNode,theText) {
    if (theNode) {
        return ( (retVal=searchInnerText(theNode,theText)) != -1) ? theNode.innerHTML.substr(retVal) : null;
    } else return null;
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
function createLink(theUrl,theText,theId,theTarget,theFunction) {
    var theLink = document.createElement("a");
      theLink.id = theId;
    theLink.innerHTML = theText;
    theLink.href = theUrl;
    theLink.setAttribute("target",theTarget);
      if (typeof theFunction === 'function') theLink.onclick = theFunction;
    return theLink;
}
function getGoogleResultsPointer() {
    var results = document.getElementsByClassName("g");
    var pointers=[];
    if (results.length>0) {
        for (var i = 0, len=results.length; i < len; i++) {
            if ( !results[i].classList.contains("card-section") && results[i].id != "imagebox_bigimages" && 
                results[i].getElementsByClassName("r").length>0 && 
                results[i].getElementsByClassName("_SWb").length>0 && 
                (results[i].getElementsByClassName("_YM").length===0 || results[i].getElementsByClassName("_Rm").length>0) &&
                results[i].getElementsByClassName("kno-fb").length===0) {
                pointers.push(results[i]);
            }
        }
    }
    return pointers;
}
function getBingResultsPointer() {
    var results = document.getElementsByClassName("b_algo");
    var i=0, pointers=[];
    if (results.length>0) {
        for (var i = 0, len=results.length; i < len; i++) {
            pointers.push(results[i]);
        }
    }
    return pointers
}
function doSearchButtons(searchEngine) {
    var urlPointers = (searchEngine == "google") ? getGoogleResultsPointer() : getBingResultsPointer();
    var btn = [];
    for (var i = 0, len=urlPointers.length; i < len; i++) {
        btn[i] = createButton("chooseButton","choose-" + i,"choose-" + i,"Select","margin-right:4px;");
        url = urlPointers[i].getElementsByTagName("a")[0];
        btn[i].setAttribute("thisUrl",url);
        btn[i].onclick = function() {
            var theData = dataFill( "pass url", this.getAttribute("thisUrl") );
            parent.window.opener.postMessage(theData,"*");
        }
        url.parentNode.insertBefore(btn[i],url);
    }
}
// ********************* Start remote window listeners and functions *********************
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
        var halfScreen = screen.width-400; // Make window 400 pixels less than the width of screen.
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
    if (e.data.action == "Open Page") { // A message is sent to open a page in the remote window.
        if (gDebugging && gLogging) console.log("..Main got Open Page: " + gTag + " hitAccepted: " + gHitAccepted + " url: " + e.data.data1);
        if (e.data.data2 || gHitAccepted || ONPREVIEW) gUrl = e.data.data1; // save the url so it can be used when it gets a ping from the remote window.
        else gUrl = gDefaultPage + "&action=notaccepted"; // Use the defaultpage if hit isn't accepted so it won't be confusing.
        gTag = e.data.tag; // Set the tag for this window to only accept messages from remote window with this tag
        // Don't go to url when it wasn't clicked and hit isn't accepted. e.data.data2 is true when a user clicks on links. So window
        // won't open on a hit that isn't accepted yet but a user can still click links to try if the hit might be easy to find.
        var theAction = (gHitAccepted) ? "accepted" : (e.data.data2) ? "clicked" : "notaccepted";
        if (theAction != "notaccepted") openPopWindow(gUrl,"remotewindow"); // Open the url if it's accepted or clicked without going to default page first.
        else openPopWindow(gDefaultPage + "&action=" + theAction,"remotewindow"); // Open remote window but if it's already opened it will leave it opened.
    } else if (e.data.action == "What page") { // received a what page message from remote window.
        if (gDebugging && gLogging) console.log("..Main got What Page: " + gTag + " gUrl: " + gUrl);
        if (e.data.tag == gTag) { // Make sure this message is from a window that created me.
            var theData = dataFill("Go To Page", gUrl); // Send the real Url to the remote window.
            gPopUpWindow.postMessage(theData,"*"); // post the message to window opened.
        }
    } else if (e.data.action == "ping") { // received a ping from remote window.
        // ping is from same tag as this window and ping hasn't been accepted yet.
        if (gDebugging && gLogging) console.log("..Main got Ping: " + gTag + " e.data.tag: " + e.data.tag + " gUrl: " + gUrl);
        gPopUpWindow = e.source; // Grab the ping source for future use so I can change location of remote window.
        gPingAccepted = true; // Ping is now accepted.
        if (gTimeout) clearTimeout(gTimeout); // remove the timeout so it won't create a new remote window.
        if (gUrl != gDefaultPage) { // make sure the URL is not the default page.
            var theData = dataFill("Pong", gUrl); // Send a pong message back to start page change process.
            gPopUpWindow.postMessage(theData,"*"); // post the message to window opened.
        }
    } else if (e.data.action == "initialize google") {
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            var theData = dataFill("create google buttons"); // Send a create buttons message back to search page.
            gPopUpWindow.postMessage(theData,"*"); // post the message to window opened.
        }
    } else if (e.data.action == "initialize bing") {
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            var theData = dataFill("create bing buttons"); // Send a create buttons message back to search page.
            gPopUpWindow.postMessage(theData,"*"); // post the message to window opened.
        }
    } else if (e.data.action == "pass url") {
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            var theInput = document.getElementById("Answer_1_FreeText"); // Sends back the URL of the web site selected.
            theInput.value = e.data.data1;
        }
    }
}
function popUpListener(e) { // Remote window receiving messages
    if (e.data.action == "Go To Page") { // Got a message to go to a page.
        if (gDebugging && gLogging) console.log("..Remote got Go To Page: " + gTag + " : " + e.data.tag + " : " + e.data.data1);
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            document.body.innerHTML = "<br><H1 style='text-align:center; font-size:25px; color:darkblue;'>Wait Please. Loading Page by your command.</H1>"; // Wait message for user.
            self.location = e.data.data1; // Change the current location of remote window.
            clearInterval(gInterval); // Clear the interval so it won't run any more.
        }
    } else if (e.data.action == "Pong") { // Got a pong message so ask what page should I go to.
        if (gDebugging && gLogging) console.log("..Main got Pong: " + gTag);
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            clearInterval(gInterval); // Clear the interval so it won't run any more.
            var theData = dataFill( "What page" ); // ask what page should I go to.
            if (top.window.opener) top.window.opener.postMessage(theData,"*"); // sends message to the window that opened me.
        }
    } else if (e.data.action == "create google buttons") { // Got a message to go to a page.
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            doSearchButtons("google"); // So buttons can be created for Google. 
            window.focus();
        }
    } else if (e.data.action == "create bing buttons") { // Got a message to go to a page.
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            doSearchButtons("bing"); // So buttons can be created for Bing. 
            window.focus();
        }
    } else if (e.data.action == "close me") {
        if (e.data.tag == gTag) { // Check if tags match so no other windows can control me.
            self.close(); // Closes window because closing from main window doesn't always work.
        }
    }
}
function onClickRemote(thisNode) { // This is used for any link on the page so all can use the remote window.
    var theUrl = (thisNode.getAttribute("href")) ? thisNode.getAttribute("href") : thisNode.getAttribute("name");
    var theData = dataFill( "Open Page", theUrl, true ); // Open the page in the href link.
    mainListener(theData);
    return false; // Tell browser not to go to the link because I will take care of it.
}
// ******************************* End of remote windows listeners and functions ***************************

var bingSearch = "http://www.bing.com/search?count=40&q=";
var googleSearch = "https://www.google.com/search?num=40&q=";
var theSearch = googleSearch;
var hitWrapper = document.getElementById("hit-wrapper");
var verifyPointers = setArrayPointersClass(document,"capsule_field_title",["Requester:"]);
var requesterName = (verifyPointers.length > 0) ? 
        verifyPointers[0].node.parentNode.getElementsByClassName("capsule_field_text")[verifyPointers[0].position].innerHTML : "";
if (requesterName.indexOf("Crowd Task") != -1) {
    if (searchInClass(hitWrapper,"overview-wrapper",0,"Find this company's website and enter the URL below. Country and state"))
            gVersion = 1;
    else if (searchInClass(hitWrapper,"overview-list-item",0,"Indicate if the company website associated is correct. If it is a regional or parent website of the company,"))
            gVersion = 2;
    else if (searchInClass(hitWrapper,"overview-wrapper",0,"Determine if the found physical address is the same as the one provided"))
            gVersion = 3;
    else if (searchInClass(hitWrapper,"overview-wrapper",0,"Is this a correct industry classification for the company"))
            gVersion = 4;
    else if (searchInClass(hitWrapper,"overview-wrapper",0,"Based on the given URL, is this the correct company information?"))
            gVersion = 5;
    else if (searchInClass(hitWrapper,"overview-wrapper",0,"Is this the correct company website?"))
            gVersion = 6;
    console.log(gVersion);
    if (gVersion == 1 || gVersion == 2) {
        window.addEventListener("message", function(e){ if ( verifyMessage(e) ) mainListener(e); }, false);
        //if (searchInTagName("input","/submit")) {
            gTag = new Date().getTime();
            var listWrappers = document.getElementsByClassName("question-wrapper");
            var itemPointers = null, urlNode1 = [], urlNode2 = [], theWebsiteUrl = [];
            for (var i=0,len=listWrappers.length; i<len; i++) {
                if (gVersion == 1) itemPointers = setArrayPointersClass(listWrappers[i],"-list-item",["Company Name: ","Industry: ","Country: "]);
                else if (gVersion == 2) itemPointers = setArrayPointersClass(listWrappers[i],"-list-item",["Company Name: ","Website: ","Industry: ","Country: "]);
                if (itemPointers.length>0) {
                    var pickANumber = Math.floor((Math.random() * 10) + 1);
                    var industryIndex = 1, countryIndex = 2;
                    if (GOOGLESEARCHING && BINGSEARCHING) theSearch = (pickANumber>3) ? googleSearch : bingSearch;
                    else if (BINGSEARCHING) theSearch = bingSearch;
                    var companyName = itemPointers[0].node.innerHTML.trim().replace("Company Name: ","");
                    if (gVersion == 2) {
                        industryIndex = 2; countryIndex = 3;
                        var websiteNode = itemPointers[1].node.getElementsByTagName("a")[0];
                        websiteNode.target = "remotewindow";
                        websiteNode.onclick = function() { return onClickRemote(this); }
                        theWebsiteUrl[i] = websiteNode.getAttribute("href");
                    }
                    if (itemPointers.length==1) { var industryName=""; countryIndex=1; industryIndex=-1; }
                    else {
                        var industryName = itemPointers[industryIndex].node.innerHTML;
                        industryName = industryName.split('"')[0].trim().replace("Industry: ","").replace(/\s/g,"");
                        var country = itemPointers[countryIndex].node.innerHTML.trim().replace("Country: ","");
                    }
                    urlNode1[i] = createLink(theSearch + companyName.replace(/\s/g,"+").replace(/&/g,"%26") + 
                        "+-site:facebook.com+-site:yelp.com+-site:linkedin.com+-site:twitter.com&jrio=feetwalk&ttt=" + gTag,companyName,"","remotewindow");
                    urlNode1[i].onclick = function() { return onClickRemote(this); }
                    itemPointers[0].node.innerHTML = "Company Name: ";
                    itemPointers[0].node.appendChild(urlNode1[i]);
                    urlNode2[i] = createLink(theSearch + companyName.replace(/\s/g,"+") + "+" + industryName + "+-facebook+-yelp&jrio=feetwalk&ttt=" + gTag,companyName + " + " + industryName,"","remotewindow");
                    urlNode2[i].onclick = function() { return onClickRemote(this); }
                    if (industryIndex>=0) {
                        itemPointers[industryIndex].node.innerHTML="Industry: ";
                        itemPointers[industryIndex].node.appendChild(urlNode2[i]);
                    }
                    if (gVersion == 1) {
                        noneButton = createButton("Mybutton","noneButton" + i,"B" + i,"None Found","background-color:#EEE; margin-bottom:4px;");
                        noneButton.onclick = function() {
                            var theNumber = parseInt(this.getAttribute("name").replace("B",""));
                            var theInput = document.getElementById("Answer_" + (theNumber+1) + "_FreeText");
                            theInput.value="NA";
                        };
                        var theInput = document.getElementById("Answer_1_FreeText");
                        theInput.value="NA";
                        var theHitAnswer = listWrappers[i].getElementsByClassName("HITAnswer-wrapper");
                        if (theHitAnswer.length > 0) {
                            theHitAnswer[0].insertBefore(noneButton,theHitAnswer[0].childNodes[0]);
                        }
                    }
                }
            }
            var defaultUrl = (gVersion == 1) ? urlNode1[0].getAttribute("href") : theWebsiteUrl[0];
            var theData = {"data":dataFill("Open Page", defaultUrl, false)};
            mainListener(theData);
        //}
    } else if (gVersion == 3 || gVersion == 4 || gVersion == 5 || gVersion == 6) {
        var theWebsite = $("div .question-content-wrapper li:contains('Website:')");
        var theUrl = "http://" + theWebsite.text().replace("Website:","").replace("http://","").replace("https://","").trim();
        urlNode1 = createLink(theUrl,theUrl,"","remotewindow");
        urlNode1.onclick = function() { return onClickRemote(this); }
        theWebsite.text("Website: ");
        theWebsite.append(urlNode1);
        var theData = {"data":dataFill("Open Page", theUrl, false)};
        mainListener(theData);
        if (gVersion == 5 || gVersion == 6) {
            var gButtonNumber = 1;
            $(".answer.text").each( function() {
                $(this).html($(this).html() + " (press " + gButtonNumber + ")");
                gButtonNumber++;
            });
        }
        document.onkeydown = function (e) {
            if (e.keyCode == 49 || e.keyCode == 97) {                     // 1=(49)(97) pressed
                document.getElementsByClassName("selection")[0].checked = true;
                if (AUTOSUBMIT && gVersion != 5) document.getElementsByName("/submit")[0].click();
            } else if (e.keyCode == 50 || e.keyCode == 98) {              // 2=(50)(98) pressed
                document.getElementsByClassName("selection")[1].checked = true;
                if (AUTOSUBMIT && gVersion != 5) document.getElementsByName("/submit")[0].click();
            } else if (e.keyCode == 51 || e.keyCode == 99) {              // 3=(51)(99) pressed
                document.getElementsByClassName("selection")[2].checked = true;
                if (AUTOSUBMIT && gVersion != 5) document.getElementsByName("/submit")[0].click();
            } else if (e.keyCode == 52 || e.keyCode == 100) {              // 4=(52)(100) pressed
                document.getElementsByClassName("selection")[3].checked = true;
                if (AUTOSUBMIT && gVersion != 5) document.getElementsByName("/submit")[0].click();
            } else if (e.keyCode == 13) {              // enter pressed
                document.getElementsByName("/submit")[0].click();
            }
        };
    }
    window.onunload = function(){
        if (CLOSEPOPUPAFTER) {
            if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.close();
        } else {
            if (gPopUpWindow && !gPopUpWindow.closed) gPopUpWindow.location = gDefaultPage + "&tag=0"; // Check if remote window is opened still and set it to default page.
        }
    };
} else if (gLocation.search(/^http.?:\/\/[^.]*\.google\./i) != -1 ||
           gLocation.search(/^http.?:\/\/[^.]*\.bing\./i) != -1 ) {
    var myInfo = -1;
    if ( (myInfo = gLocation.indexOf("jrio=feetwalk")) != -1) {
        gTag = gLocation.substr(myInfo).split("&")[1].substr(4);
        document.addEventListener("DOMContentLoaded", function(){ // chrome needs to use document.addEventListener with DOMContentLoaded
            window.addEventListener("message", function(e){ if ( verifyMessage(e) ) popUpListener(e); }, false);
            var theData = (gLocation.indexOf("google") != -1) ? dataFill( "initialize google" ) : dataFill( "initialize bing" );
            parent.window.opener.postMessage(theData,"*");
        }, false);
    }
} else if (isStartPage()) {
    // This is used for the remote window. JRnewpage is for recognition of this page. 
    // tag is the tag from the window that opened this remote window.
    if (queryAssoc["ST"] && queryAssoc["ST"] == SCRIPTTAG) {
        document.addEventListener("DOMContentLoaded", function(){ // chrome needs to use document.addEventListener with DOMContentLoaded
            window.addEventListener("message", function(e){ if ( verifyMessage(e) ) popUpListener(e); }, false); // set up remote window listener
            theAction = queryAssoc["action"];
            document.body.innerHTML = "<br><H1 style='text-align:center; font-size:25px; color:darkblue;'>Waiting for a command to go to a special place!</H1>";
            if (theAction != "accepted") document.body.innerHTML += "<br><H2 style='text-align:center; color: blue;'><b>Hit hasn't been accepted. Remember to accept the hit if you want!</b></H2>";
            gInterval = setInterval ( function() {
                var theData = dataFill( "ping" );
                if (window.opener) window.opener.postMessage(theData,"*");
            }, 400 );
        }, false);
    }
// ************* Used for remote windows operation. runs on remote window and main mturk page for hit. **************
} else if (window.opener) {
    document.addEventListener("DOMContentLoaded", function(){
        window.addEventListener("message", function(e){ if ( verifyMessage(e) ) popUpListener(e); }, false);
        var theData = dataFill( "initialize the question" );
        parent.window.opener.postMessage(theData,"*");
    }, false);
}
