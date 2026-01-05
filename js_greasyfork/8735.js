// ==UserScript==
// @name        MAL counter for Profile and Blog
// @namespace   MAL
// @include     http://myanimelist.net/editprofile.php
// @include     http://myanimelist.net/myblog.php*
// @include     https://myanimelist.net/editprofile.php
// @include     https://myanimelist.net/myblog.php*
// @description Adds counter while editing profile or blog that shows how many characters are left to the limit
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/8735/MAL%20counter%20for%20Profile%20and%20Blog.user.js
// @updateURL https://update.greasyfork.org/scripts/8735/MAL%20counter%20for%20Profile%20and%20Blog.meta.js
// ==/UserScript==

function xpath(query, object) {
    if(!object) var object = document;
    return document.evaluate(query, object, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

var warningText = "Characters left: ";
var charactersLimit = 65535;
var noteText = "Please be aware that letters such as ä, ý, ø, û, ş etc. take 8 characters each. This counter does <u>not</u> take that into account, so the actual amount you have left may be lower";

var allElements = xpath("//textarea[@name='entry_text'][@class='textarea'] | " + "//textarea[@class='textarea'][@name='profile_aboutme']");
if(allElements.snapshotLength > 0) {
    textarea = allElements.snapshotItem(0);

    var div1 = document.createElement("div");
    div1.style="margin: 0px; margin-top:10px; margin-bottom:5px";
    div1.align ="Left";
    div1.id = "characterLimit";
    div1.textContent = warningText + (charactersLimit - textarea.value.length) + ". ";
    div1.style.display = "block";

    textarea.parentNode.insertBefore(div1, textarea.nextSibling);
    if (div1.nextSibling.tagName == "BR") {
        div1.nextSibling.style.display = "none";
    }

    textarea.addEventListener('keyup', function(e) {
        div1.textContent = warningText + (charactersLimit - textarea.value.length) + ". ";
    }, true);

    var span2 = document.createElement("span");
    span2.id = "characterNote";
    span2.textContent = "Note";
    span2.style.color = "rgb(29, 67, 155)";
    //span2.onmouseover = function(){span2.style.textDecoration = 'underline'};
    //span2.onmouseout = function(){span2.style.textDecoration = ''};
    div1.appendChild(span2);

    var span3 = document.createElement("span");
    span3.id = "characterNoteTooltip";
    span3.innerHTML = noteText;
    span3.style.color = "black";
    span2.appendChild(span3);
    GM_addStyle("#characterNoteTooltip {display: none; background: #C8C8C8; padding: 5px; position: absolute; width: 420px; height: auto;}");
    GM_addStyle("#characterNote:hover #characterNoteTooltip {display: block;}");
}