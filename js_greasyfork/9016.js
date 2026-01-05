// ==UserScript==
// @name        Still's Enjin Tools
// @namespace   net.StillNoNumber.enjintools
// @description Some basic Enjin enhancements.
// @include     http://*.mineplex.com/forums/*
// @include     http://*.0x10cforum.com/forum/*
// @include     http://*.enjin.com/forum/*
// @include     http://*.enjin.com/forums/*
// @version     0.1.2
// @require     https://code.jquery.com/jquery-2.1.3.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/9016/Still%27s%20Enjin%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/9016/Still%27s%20Enjin%20Tools.meta.js
// ==/UserScript==

GM_log("Starting Still's Enjin Script...");
this.$ = this.jQuery = jQuery.noConflict(true);

var postingField;
var toolbars;
var hiddenUploadInput;
var selUploadFile;
var isQuickReply = true;
var blockMain;
var defaultReplyButton;
var newReplyButton;

window.addEventListener("load", main);


function main() {
    
    toolbars = document.getElementsByClassName("markItUpHeader")[0].getElementsByTagName("ul");
    postingField = document.getElementById("content");
    blockMain = document.getElementsByClassName("block main")[0];
    if (!postingField) {
        postingField = document.getElementById("post-content");
        blockMain = document.getElementsByClassName("block-container")[1];
        isQuickReply = false;
    }
    console.log(blockMain);
    
    defaultReplyButton = blockMain.getElementsByClassName("element_button")[1].getElementsByTagName("input")[0];
    if (defaultReplyButton.getAttribute('type') == 'button') { // no attach file button found
        defaultReplyButton = blockMain.getElementsByClassName("element_button")[0].getElementsByTagName("input")[0];
    }
    
    
    initElements();
    
    
    undoFixCode();
}



function initElements() {
    createPostingTool('Imgur', '0px -120px', onImgurButtonClick, toolbars[0]);
    createPostingTool('In-Line Code', '0px -210px', onLineInCodeButtonClick, toolbars[0]);
    createPostingTool('In-Line Warning', '0px -1080px', onLineInWarningButtonClick, toolbars[0]);
    
    if (isQuickReply) {
        createPostingTool('Line', '0px -870px', onRuleButtonClick, toolbars[1]);
    }
    createPostingTool('Comment', '0px -1110px', onCommentButtonClick, toolbars[1]);
    createPostingTool('Box', '0px -990px', onBoxButtonClick, toolbars[1]);
    
    
    defaultReplyButton.setAttribute('style', 'visibility: hidden; width: 0; height: 0; padding: 0; margin: 0;');
    
    newReplyButton = document.createElement('input');
    newReplyButton.setAttribute('type', 'submit');
    newReplyButton.setAttribute('value', 'Quick Reply');
    newReplyButton.addEventListener('click', onQuickReply);
    defaultReplyButton.parentElement.appendChild(newReplyButton);
    
    hiddenUploadInput = document.createElement('input');
    hiddenUploadInput.setAttribute('type', 'file');
    hiddenUploadInput.setAttribute('accept', 'image/*');
    hiddenUploadInput.setAttribute('style', 'display: block; visibility: hidden; width: 0; height: 0;');
    hiddenUploadInput.addEventListener('change', imgurUpload);
    document.body.appendChild(hiddenUploadInput);
}







function onLineInCodeButtonClick() {
    insertAtCursor(postingField, "[code.inline]Code[/code.inline]");
}

function onLineInWarningButtonClick() {
    insertAtCursor(postingField, "[warning.inline]IMPORTANT[/warning.inline]");
}

function onBoxButtonClick() {
    insertAtCursor(postingField, "[box]Content[/box]");
}

function onCommentButtonClick() {
    insertAtCursor(postingField, commentText);
}

function onRuleButtonClick() {
    insertAtCursor(postingField, "[rule]");
}

function onImgurButtonClick() {
    hiddenUploadInput.click();
}

function onQuickReply() {
    fixCode();
}



function fixCode() {
    for (var i = 0; i < bbReplaces.length; i++) {
        postingField.value = postingField.value.replace(bbReplaces[i][0], bbReplaces[i][1]);
    }
}
function undoFixCode() {
    for (var i = 0; i < bbReplaces.length; i++) {
        postingField.value = postingField.value.replace(bbReplaces[i][1], bbReplaces[i][0]);
    }
}


function imgurUpload(event) {
    
    /*if (!selUploadFile) {
        return;
    }*/
    selUploadFile = hiddenUploadInput.files[0];
    
    //console.log("Starting upload of a picture to Imgur!");

    var fd = new FormData(); //                                                                                                                                               // From: https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    fd.append("image", selUploadFile); // Append the file
    fd.append("type", "file");
    var xhr = new XMLHttpRequest(); // Create the XHR (Cross-Domain XHR FTW!!!) Thank you sooooo much imgur.com
    xhr.open("POST", "https://api.imgur.com/3/image.json"); // Boooom!
    xhr.onload = function () {
        //console.log(JSON.parse(xhr.responseText));
        //console.log(JSON.parse(xhr.responseText).data.link);
        insertAtCursor(postingField, "[img]" + JSON.parse(xhr.responseText).data.link + "[/img]");
    }
    // Ok, I don't handle the errors. An exercice for the reader.
    xhr.setRequestHeader('Authorization', 'Client-ID efe03f2f955df68');
   
    /* And now, we send the formdata */
    xhr.send(fd);
    
    
    //console.log("Finished sending packet to Imgur, waiting for response");
}


function createPostingTool(name, backgroundPosition, clickHandler, toolbar) {
    var newButton = document.createElement('li');
    newButton.setAttribute('class', 'markItUpButton ');
    newButton.setAttribute('style', 'background-position: ' + backgroundPosition + '; cursor:pointer;');
    newButton.setAttribute('oncontextmenu', "return false;"); 
    newButton.addEventListener('click', clickHandler);
    
    var newLink = document.createElement('a');
    newLink.setAttribute('title', name);
    newButton.appendChild(newLink);
    
    toolbar.appendChild(newButton);
}













function insertAtCursor(myField, myValue) {                                                                                                                                    // by Rab Nawaz, http://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    } else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}


function returnFalse() {
    return false;
}


























/*  ---  CONSTANTS  ---  */

// Defaults
var commentText = "[' Your comment here ']";


// Replacing - No spaces
var bbReplaces = [["[code.inline]", "[highlight=#E0E0E0][color=#E0E0E0][size=5].[/size][/color][font=Monaco][color=#000000]"], ["[/code.inline]", "[/color][/font][color=#E0E0E0][size=5].[/size][/color][/highlight]"], ["[box]", "[table][tr][td]"], ["[/box]", "[/td][/tr][/table]"], ["[warning.inline]", "[highlight=#dd2423][size=5][color=#DD2423].[/color][/size][color=#FFFFFF][font=Arial]"], ["[/warning.inline]", "[/font][/color][size=5][color=#DD2423].[/color][/size][/highlight]"]];

/*  ---  CONSTANTS  ---  */
