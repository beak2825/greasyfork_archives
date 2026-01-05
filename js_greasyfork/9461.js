// Written by Michael Stepner, 23 April 2015.
//
/* The MIT License (MIT):
Copyright (c) 2015 Michael Stepner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
// ==UserScript==
// @name        Fastmail - Folder Badge Controls
// @description Turn badges on or off for specific folders, or show total # of messages.
// @author      Michael Stepner
// @namespace   https://michaelstepner.com
// @license 	MIT License
// @homepageURL	https://github.com/michaelstepner/fastmail-FolderBadgeControls
// @supportURL	https://github.com/michaelstepner/fastmail-FolderBadgeControls/issues
// @version     1.0.1
// @id 			fastmail-FolderBadgeControls
// @include     https://www.fastmail.com/mail/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9461/Fastmail%20-%20Folder%20Badge%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/9461/Fastmail%20-%20Folder%20Badge%20Controls.meta.js
// ==/UserScript==


///// Retrieve configuration
var foldersShowAllOnBadge  = GM_getValue ("foldersShowAllOnBadge",  "");
var foldersAlwaysShowBadge = GM_getValue ("foldersAlwaysShowBadge", "");
var foldersNeverShowBadge  = GM_getValue ("foldersNeverShowBadge", "");
var firstConfig  = GM_getValue ("firstConfig", "");


///// Create a configuration form in a popup box

// Insert HTML for the popup box
$("body[contenteditable!='true']").append ( '                                                          \
    <div id="gmPopupContainer">                                               \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <h1>Instructions:</h1> \
        <p>In each entry, list the folders whose badge you want to modify.</p> \
        <p>Separate each folder name by a semicolon.</p> \
        <br><p>You need to specify folders using the name in their URL:</p> \
        <p>&nbsp;&nbsp;&nbsp;https://www.fastmail.com/mail/<b>Folder_Name</b>/?u=0xx00000</p> \
        <br><p id="gmMenuCommandInstructions">&nbsp;</p> \
        <br><h1>Configuration:</h1> \
        <p>Show <strong>total</strong> number of messages (read and unread) on badge:</p> \
        <input type="text" id="gmConfigShowTotal">                           \
        <p><strong>Always</strong> show badge:</p> \
        <input type="text" id="gmConfigShowAlways" value="">                           \
        <p><strong>Never</strong> show badge:</p> \
        <input type="text" id="gmConfigShowNever" value="">                           \
        <br><button id="gmClosePopupAndCancel" type="button">Cancel</button> \
        <button id="gmClosePopupAndSave" type="button"><strong>Submit</strong></button>         \
    </form>                                                                   \
    </div>                                                                    \
' );

// Detect whether running in Greasemonkey or Tampermonkey
var scriptEngine;
if (typeof GM_info === "undefined") {
    scriptEngine = "plain";
    // plain Chrome, or Opera, or scriptish, or Safari, or rarer
}
else {
    scriptEngine = GM_info.scriptHandler  ||  "Greasemonkey";
}

// Write correct instructions for Greasemonkey or Tampermonkey
if (scriptEngine=="Greasemonkey") {
    document.getElementById("gmMenuCommandInstructions").innerHTML = "You can always return to this configuration box via Tools > <br>&nbsp;&nbsp;&nbsp;> Greasemonkey > User script commands... <br>&nbsp;&nbsp;&nbsp;> Folder badge configuration";
}
else if (scriptEngine=="Tampermonkey") {
    document.getElementById("gmMenuCommandInstructions").innerHTML = "You can always return to this configuration box by clicking<br>&nbsp;&nbsp;&nbsp;the Tampermonkey menu button while in Fastmail, then<br>&nbsp;&nbsp;&nbsp;clicking 'Folder badge configuration'.";
}
else {
    document.getElementById("gmMenuCommandInstructions").innerHTML = "You seem to be running this userscript without Greasemonkey<br>&nbsp;&nbsp;&nbsp;or Tampermonkey. Even if it is working, you will be unable to<br>&nbsp;&nbsp;&nbsp;return to this configuration box later. You should use<br>&nbsp;&nbsp;&nbsp;Greasemonkey in Firefox or Tampermonkey otherwise.";
}

// Hide the popup box unless config has never been done before
if (firstConfig=="done") {
    $("#gmPopupContainer").hide ();
}

// Set the input boxes to contain current config values
function setPopupConfigValues () {
    document.getElementById('gmConfigShowTotal').value=foldersShowAllOnBadge ; 
    document.getElementById('gmConfigShowAlways').value=foldersAlwaysShowBadge ; 
    document.getElementById('gmConfigShowNever').value=foldersNeverShowBadge ; 
}
setPopupConfigValues ();

// Save the new config values on 'Submit'
$("#gmClosePopupAndSave").click ( function () {
    foldersShowAllOnBadge  = document.getElementById('gmConfigShowTotal').value ;
    foldersAlwaysShowBadge = document.getElementById('gmConfigShowAlways').value ; 
    foldersNeverShowBadge  = document.getElementById('gmConfigShowNever').value ; 
    updateConfig();
    updateSelectors();
    $("#gmPopupContainer").hide ();
    refreshCustomBadges(folderSelectors);
} );
function updateConfig () {
    GM_setValue ("foldersShowAllOnBadge", foldersShowAllOnBadge);
    GM_setValue ("foldersAlwaysShowBadge", foldersAlwaysShowBadge);
    GM_setValue ("foldersNeverShowBadge", foldersNeverShowBadge);
    GM_setValue ("firstConfig", "done");
}

// Restore popup text entry values on 'Cancel'
$("#gmClosePopupAndCancel").click ( function () {
    setPopupConfigValues ();
    $("#gmPopupContainer").hide ();
} );

// Style the config popup box with CSS
GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               fixed;                          \
        top:                    20%;                            \
        left:                   20%;                            \
        padding:                1em 2em;                            \
        background:             #C0C0C0;                     \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        padding-top: 5px; \
        padding-right: 5px; \
        padding-bottom: 5px; \
        padding-left: 5px; \
        border:                 2px outset buttonface;          \
        margin-left: 75px; \
    }                                                           \
    #gmPopupContainer p{                                   \
        line-height: 20px;          \
    }                                                           \
    #gmPopupContainer input{                                   \
        width: 350px;           \
        margin-bottom: 10px; \
    }                                                           \
    #gmPopupContainer h1{                                   \
        font-weight: bold;          \
        line-height: 30px;          \
        padding-top: 0px; \
    }                                                           \
    #gmPopupContainer strong{                                   \
        font-weight: bold;          \
    }                                                           \
" );

///// Add Greasemonkey context menu command to edit configuration
GM_registerMenuCommand ("Folder badge configuration", changeConfig);
function changeConfig () {
    $("#gmPopupContainer").show ();
}


///////////////////////////////

///// Define selectors
function defineSelectorsFromFolders() {
    if (foldersShowAllOnBadge!="") {
        var selectorsShowAllOnBadge = "[href^='/mail/" + foldersShowAllOnBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";
    } else {
        var selectorsShowAllOnBadge = null
    }

    if (foldersAlwaysShowBadge!="") {
        var selectorsAlwaysShowBadge = "[href^='/mail/" + foldersAlwaysShowBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";
    } else {
        var selectorsAlwaysShowBadge = null
    }

    if (foldersNeverShowBadge!="") {
        var selectorsNeverShowBadge = "[href^='/mail/" + foldersNeverShowBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";
    } else {
        var selectorsNeverShowBadge = null
    }
    
    return {
        showTotal: selectorsShowAllOnBadge,
        showAlways: selectorsAlwaysShowBadge,
        showNever: selectorsNeverShowBadge
    };  
}
function updateSelectors() {
    folderSelectors = defineSelectorsFromFolders();
}

var folderSelectors = null;
updateSelectors();


///// Functions that control badges
function showAllOnBadge (jNode) {
    // Display badge with total number of messages (read and unread).
    var nMessagesStr = jNode.prop('title');
    var nMessages = nMessagesStr.replace("This folder is empty.","0").replace(/conversation[s]*/, "");
    jNode.children(".v-FolderSource-badge").text(nMessages);
    if (nMessages!=0) {
        jNode.children(".v-FolderSource-badge").removeClass("u-hidden");
    } else {
        jNode.children(".v-FolderSource-badge").addClass("u-hidden");
    }
}
function alwaysShowBadge (jNode) {
    // Always display badge, even if it is 0.
    jNode.children(".v-FolderSource-badge").removeClass("u-hidden");
}
function neverShowBadge (jNode) {
    // Never display badge.
    jNode.children(".v-FolderSource-badge").addClass("u-hidden");
}
function refreshCustomBadges (selectors) {
    $(selectors.showTotal).each(function() {
        showAllOnBadge ($(this));
    });
    $(selectors.showAlways).each(function() {
        alwaysShowBadge ($(this));
    });
    $(selectors.showNever).each(function() {
        neverShowBadge ($(this));
    });
}


///// Mutation Observer
var targetNodes         = $("*"); // Note: there is certainly a narrower observer that could be set. If you figure it out, let me know!
var myObserver          = new MutationObserver (mutationHandler);
var obsConfig           = { childList: false, characterData: false, attributes: true, subtree: true, attributeFilter:['class'] };

//--- Add a target node to the observer. Can only add one node at a time.
targetNodes.each ( function () {
    myObserver.observe (this, obsConfig);
} );

function mutationHandler (mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
        if(mutation.target.classList.contains("v-FolderSource")) {
            //console.log (mutation.target);
            refreshCustomBadges(folderSelectors);
        }
    } );
}

