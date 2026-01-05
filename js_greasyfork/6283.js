// ==UserScript==
// @name        JR zing receipt helper for mturk.com
// @version     0.9
// @namespace   https://greasyfork.org/users/6406
// @description A script for zings with buttons to make it easier to submit and allows keyboard shortcuts.
// @author      John Ramirez (JohnnyRS)
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @include     http*://*ibotta.com/duplicate_receipt_moderation/*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/6283/JR%20zing%20receipt%20helper%20for%20mturkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/6283/JR%20zing%20receipt%20helper%20for%20mturkcom.meta.js
// ==/UserScript==

// 0.6 - Added a warning when submit after option is checked. It will only warn once.
// This script will hide the instructions but you can click on the instruction text to show the full
// instructions again. You will see 2 buttons at the top of the receipts for easy access. If the receipts
// are different then click on the first button. If they are the same then click on the second button.
// Once you push a button it will fill in the bottom radio buttons and submit the hit if you checked the
// checkbox called submit after. By default it will not submit after so you have to press the submit button
// or press enter after the submit button gets focused. You can also use keyboard shortcuts to make it easier.
// Keyboard shortcuts follow the submit after setting so be careful. Pressing n or 1 will select
// the no option. Pressing y or 2 will select the yes option. Then you can press enter to submit the hit or
// click the submit button if the submit after option is off.
//
// 0.5 - Added a setting checkbox to submit after button pressed. It is turned off by default and saved.
// 0.4 - Added buttons at top. Allows keypad numbers to work. Hides the instructions at top.

var gSubmitAfter = false, gWarned = false;
var gLogging = false, gDebugging = true;
if (typeof console.log == 'function') gLogging = gDebugging; // Fix for browsers without console.log
else gDebugging=false;

function loadSettings() {
    gSubmitAfter = JSON.parse(GM_getValue("JR_submitafter",gSubmitAfter));
    gWarned = JSON.parse(GM_getValue("JR_theWarning",gWarned));
}
function saveSettings() {
    GM_setValue("JR_submitafter",JSON.stringify(gSubmitAfter));
    GM_setValue("JR_theWarning",JSON.stringify(gWarned));
}
function createButton(theId,theValue,theName,theStyle) {
    var theButton = document.createElement("input");
    theButton.id = theId;
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
function createMyElement(elementName,theClass,theId,theStyle) {
    var theElement = document.createElement(elementName);
    if (theId) theElement.id = theId;
    if (theClass) theElement.className = theClass;
    if (theStyle) theElement.setAttribute("style",theStyle);
    return theElement;
}
function searchInnerText(node,theText) {
    return node.innerHTML.indexOf(theText);
}
function searchInClass(theClass,theIndex,theText) {
    var classNode = document.getElementsByClassName(theClass)[theIndex];
    if (typeof classNode !== 'undefined') {
       var retVal = searchInnerText(classNode,theText);
       return (retVal!=-1) ? classNode.innerHTML.substr(retVal) : retVal;
    }
}
function toggleInstructions(theDiv) {
    arguments.callee.hiddenToggle = arguments.callee.hiddenToggle || false;
    arguments.callee.hiddenToggle = !arguments.callee.hiddenToggle;
    theDiv.style.overflow="hidden";
    if (arguments.callee.hiddenToggle) {
       theDiv.style.height="25px";
    } else {
       theDiv.style.height="auto";
    }
}
function moveInDiv(theNode,nodeNumbers) {
    var removedNode = null;
    var myDiv = createMyElement("div","theInstructions");
    var myH1 = createMyElement("h1","toggleMe");
    myH1.appendChild(document.createTextNode("Click here to show/hide instructions!"));
    myH1.setAttribute("style","color:blue;");
    myDiv.appendChild(myH1);
    for (var i=0; i<nodeNumbers+1; i++) {
       removedNode = theNode.removeChild(theNode.children[0]);
       myDiv.appendChild(removedNode);
    }
    return myDiv;
}
function answerRadio(theRadio,submitButton,submitMe) {
    window.scrollTo(0,document.body.scrollHeight +20);
    theRadio.checked=true;
    if (submitMe) submitButton.click();     // Only when one of my buttons are pressed.
    else submitButton.focus();              // Only gives focus to the submit button and will not auto submit it for pressing keys.
}

$(function() {
    if (searchInClass("warning",0,"ATTENTION: We are actively monitoring quality. Workers who repeatedly ignore the instructions")) {
        if (gDebugging && gLogging) console.log(".found a zing I can work with");

        var container = document.getElementsByClassName("container")[1];
        var instructions = moveInDiv(container,5);
        container.insertBefore(instructions,container.firstChild);

        var noDuplicates = document.getElementById("duplicatefalse");
        var yesDuplicates = document.getElementById("duplicatetrue");
        var submitButton = document.getElementsByClassName("submitctrl")[0].getElementsByClassName("btn")[0];

        var receipts = document.getElementsByClassName("row")[1];
        var liNodes = document.getElementsByTagName("li");
        var noBtn = createButton("noButton","No - DIFFERENT receipts (n) (1)","","margin-left: 25px; padding: 2px 40px;");
        var yesBtn = createButton("yesButton","Yes - Same receipts (y) (2)","","margin-left: 25px; padding: 2px 40px;");
        noBtn.onclick = function() { answerRadio(noDuplicates,submitButton,gSubmitAfter); };
        yesBtn.onclick = function() { answerRadio(yesDuplicates,submitButton,gSubmitAfter); };

        var myDiv = createMyElement("div","row","","padding:10px 0 20px 0; text-align:center;");
        var myCheckbox = createCheckbox("mySubmitAfter","Submit After","mySubmitAfter","margin:0 5px 0 20px;");
        myDiv.appendChild(noBtn);
        myDiv.appendChild(yesBtn);
        myDiv.appendChild(myCheckbox);
        myDiv.appendChild(document.createTextNode('Submit after'));
        receipts.parentNode.insertBefore(myDiv, receipts);

        var theDivInstructions = document.getElementsByClassName("theInstructions")[0];
        toggleInstructions(theDivInstructions);
        theDivInstructions.onclick = function() { toggleInstructions(theDivInstructions); };

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
        $("#noButton").focus();
        $(document).keydown(function (e) {
            if (e.which == 78 || e.which == 49 || e.which == 97) {                     // n=(78) or 1=(49)(97) pressed
                answerRadio(noDuplicates,submitButton,gSubmitAfter);
            } else if (e.which == 89 || e.which == 50 || e.which == 98) {              // y=(89) or 2=(50)(98) pressed
                answerRadio(yesDuplicates,submitButton,gSubmitAfter);
            }
        });
    }
});
