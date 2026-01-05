// ==UserScript==
// @name            JR machine learning helper for mturk.com
// @version         0.7.1
// @description     Script for machine learning to make it easier to select yes or no.
// @author          John Ramirez (JohnnyRS) (johnnyrs@allbyjohn.com)
// @include     	http*://*mturkcontent.com/dynamic*
// @include     	http*://s3.amazonaws.com/mturk_bulk*
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @namespace       https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/6639/JR%20machine%20learning%20helper%20for%20mturkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/6639/JR%20machine%20learning%20helper%20for%20mturkcom.meta.js
// ==/UserScript==

// Adds a yes and a no button for easier selection. After clicking on the buttons it will
// select the correct radio selection and submit the hit. You can also press y or 1 for yes.
// Press n or 2 for no. But keyboard shortcuts will not submit the hit but it will focus
// on the submit button so you can press enter to submit it.
// version 0.7.1 - Now works with signup forms.

var gSubmitAfter = false, gWarned = false;
var gLogging = false, gDebugging = true;
if (typeof console.log !== 'function') { gDebugging=false; gLogging=false; }
else { gLogging = (gLogging) ? gLogging : gDebugging; }

function loadSettings() {
    gSubmitAfter = JSON.parse(GM_getValue("JR_ML_submitafter",gSubmitAfter));
    gWarned = JSON.parse(GM_getValue("JR_ML_theWarning",gWarned));
}
function saveSettings() {
    GM_setValue("JR_ML_submitafter",JSON.stringify(gSubmitAfter));
    GM_setValue("JR_ML_theWarning",JSON.stringify(gWarned));
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function searchInClass(theClass,theIndex,theText) {
    var classNode = document.getElementsByClassName(theClass)[theIndex];
    if (classNode) {
       var retVal = classNode.innerHTML.indexOf(theText);
       return (retVal!=-1) ? classNode.innerHTML.substr(retVal) : null;
    }
    return null;
}
function setArrayPointersClass(theClass,thisArray) {
    var classNodes = document.getElementsByClassName(theClass);
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
function createMyElement(elementName,theClass,theId,theStyle) {
    var theElement = document.createElement(elementName);
    if (theId) theElement.id = theId;
    if (theClass) theElement.className = theClass;
    if (theStyle) theElement.setAttribute("style",theStyle);
    return theElement;
}
function createButton(theId,theValue,theName,theStyle) {
    var theButton = document.createElement("INPUT"); theButton.id = theId;
    theButton.value = theValue;
    theButton.type = "button";
    if (theName) theButton.name = theName;
    if (theStyle) theButton.setAttribute("style",theStyle);
    return theButton;
}
function createCheckbox(theId,theValue,theName,theStyle) {
    var theCheckbox = document.createElement("input");
    theCheckbox.id = theId;
    theCheckbox.value = theValue;
    theCheckbox.type = "checkbox";
    if (theName) theCheckbox.name = theName;
    if (theStyle) theCheckbox.setAttribute("style",theStyle);
    return theCheckbox;
}
function answerYes(yesRadio,submitButton,submitMe) {
    yesRadio.checked=true;
    if (submitMe) submitButton.click();     // Only when one of my buttons are pressed.
    else submitButton.focus();              // Only gives focus to the submit button and will not auto submit it for pressing keys.
}
function answerNo(noRadio,submitButton,submitMe) {
    noRadio.checked=true;
    if (submitMe) submitButton.click();     // Only when one of my buttons are pressed.
    else submitButton.focus();              // Only gives focus to the submit button and will not auto submit it for pressing keys.
}

if (searchInClass("panel-body",0,"In this screenshot is a Login&nbsp;form, that includes input fields and buttons.") ||
        searchInClass("panel-body",0,"In this screenshot is a sign up (register, enroll, etc) form, that includes input fields and buttons.") ) {
    var inputPointers = setArrayPointersClass("inputfields",["fields correctly labeled with labels in close proximity?"]);
    if (inputPointers.length>0) {
        var myContainer = createMyElement("span","mySpan","buttonsHelper","margin-left:0px;");
        var yesBtn = createButton("yesButton","Yes fields are correct (y) (1)","","margin-left: 25px;");
        var noBtn = createButton("noButton","No fields are NOT correct or missing (n) (2)","","margin-left: 25px;");
        var myCheckbox = createCheckbox("mySubmitAfter","Submit After","mySubmitAfter","margin:0 5px 0 20px;");
        var scrollRight = createButton("rightButton","->","","margin-left: 25px;");
        var scrollLeft = createButton("leftButton","<-","","margin-left: 25px;");
        var submitAfterText = createMyElement("span","mySpan","submitAfterText");
        submitAfterText.appendChild( document.createTextNode('Submit after') );
        yesBtn.onclick = function() { answerYes(radios[0],submitButton,gSubmitAfter); };
        noBtn.onclick = function() { answerNo(radios[1],submitButton,gSubmitAfter); };
        myContainer.appendChild(scrollLeft);
        myContainer.appendChild(yesBtn);
        myContainer.appendChild(noBtn);
        myContainer.appendChild(myCheckbox);
        myContainer.appendChild(submitAfterText);
        myContainer.appendChild(scrollRight);
        inputPointers[0].node.appendChild(myContainer);

        scrollRight.onclick = function() {
            var scrollLeftSave = f_scrollLeft();
            window.scrollBy(200,0);
            var scrollLeft = f_scrollLeft();
            var diffScrollBy = (scrollLeft - 200 < scrollLeftSave) ? scrollLeft - scrollLeftSave : 200;
			var marginLeft = (myContainer.style.marginLeft) ? myContainer.style.marginLeft : "0";
            var addedMargin = parseInt(myContainer.style.marginLeft.replace("px","")) + diffScrollBy;
            myContainer.style.marginLeft = addedMargin + "px";
        };
        scrollLeft.onclick = function() { 
            window.scrollBy(-200,0);
            var addedMargin = parseInt(myContainer.style.marginLeft.replace("px","")) - 200;
            if (addedMargin<0) addedMargin=0;
            myContainer.style.marginLeft = addedMargin + "px";
        };
        loadSettings();
        myCheckbox.checked = gSubmitAfter;
        myCheckbox.onchange = function() {
            if (myCheckbox.checked) {
                var gConfirmed = true;
                if (!gWarned) gConfirmed = confirm("Warning: This option will submit the hit after pressing a button or using a keyboard shortcut. Be careful.\nYou can turn this option off at any time to verify your answer is correct. This is your only warning.");
                if (gConfirmed) { gSubmitAfter = true; gWarned = true; }
                else myCheckbox.checked = false;
            } else gSubmitAfter = false;
            saveSettings();
        };
        
        var submitButton = document.getElementById("submitButton");
        var radios = inputPointers[0].node.getElementsByTagName("input");
        document.onkeydown = function (e) {
            if (e.keyCode == 89 || e.keyCode == 49 || e.keyCode == 97) {              // y=(89) or 1=(49)(97) pressed
                answerYes(radios[0],submitButton,gSubmitAfter);
            } else if (e.keyCode == 78 || e.keyCode == 50 || e.keyCode == 98) {       // n=(78) or 2=(50)(98) pressed
                answerNo(radios[1],submitButton,gSubmitAfter);
            }
        };
        window.addEventListener("load", function() { window.scrollTo(0,document.body.scrollHeight +20); }, false);
    }    
}
