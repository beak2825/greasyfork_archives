// ==UserScript==
// @name        Better Smilies
// @namespace   net.StillNoNumber.smilies
// @description Allows you to post more and cooler smilies than ever before, and also to replace the new smilies Enjin implemented.
// @include     http://*.mineplex.com/forums/*
// @version     0.1.0
// @require     https://code.jquery.com/jquery-2.1.3.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/9015/Better%20Smilies.user.js
// @updateURL https://update.greasyfork.org/scripts/9015/Better%20Smilies.meta.js
// ==/UserScript==

GM_log("Starting Still's Enjin Script...");
this.$ = this.jQuery = jQuery.noConflict(true);

var postingField;
var toolbars;
var hiddenUploadInput;
var selUploadFile;

window.addEventListener("load", main);


function main() {
    toolbars = document.getElementsByClassName("markItUpHeader")[0].getElementsByTagName("ul");
    postingField = document.getElementById("content");
    if (!postingField) {
       postingField = document.getElementById("post-content");
    }
    
    initElements();
}



function initElements() {
    //createPostingTool('Emoticons', '0px -90px', onReplaceButtonClick, toolbars[0]);
    createPostingTool('Imgur', '0px -120px', onImgurButtonClick, toolbars[0]);
    
    createPostingTool('Comment', '0px -1110px', onCommentButtonClick, toolbars[1]);
    
    
    
    hiddenUploadInput = document.createElement('input');
    hiddenUploadInput.setAttribute('type', 'file');
    hiddenUploadInput.setAttribute('accept', 'image/*');
    hiddenUploadInput.setAttribute('style', 'display: block; visibility: hidden; width: 0; height: 0;');
    hiddenUploadInput.addEventListener('change', imgurUpload);
    document.body.appendChild(hiddenUploadInput);
}






function onReplaceButtonClick() {
    postingField.value = postingField.value + "@";
}



function onCommentButtonClick() {
    insertAtCursor(postingField, commentText);
}

function onImgurButtonClick() {
    hiddenUploadInput.click();
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

/*  ---  CONSTANTS  ---  */
