// ==UserScript==
// @name        Media Only
// @namespace   cloaknsmoke
// @description Adds the option to remove posts without embeded images or video. Also works with images and video in spoilers and embeded offsite stuff if you have extensions or scripts that do that. Original version by citizenray.
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     http://archives.endoftheinter.net/showmessages.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @include     https://archives.endoftheinter.net/showmessages.php*
// @grant       none
// @version     8
// @downloadURL https://update.greasyfork.org/scripts/6805/Media%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/6805/Media%20Only.meta.js
// ==/UserScript==

//the old version of this I adapted it from was fairly naive and didn't do some stuff I wanted like not deleting posts with external images or images inside spoilers
var hideMedialessPosts = function() { 
    var messages = document.getElementsByClassName("message-container"); 
    for (var i = 0; i < messages.length; i++) 
    { 
        var post = messages[i]; 
        var message = post.getElementsByClassName("message")[0];
        var mediaFound = false; 
        for (var j = 0; j < message.childNodes.length; j++) 
        { 
            var child = message.childNodes[j]; 
            //just look at how I used to do this. how awful
            /*
            //look for images inside of spoilers
            if (child.className == "spoiler_closed" || child.className == "spoiler_opened")
            {
                child = child.childNodes[1];
                for(var k = 0;k < child.childNodes.length;k++)
                    if(child.childNodes[k].nodeName.toUpperCase() == "DIV" && child.childNodes[k].className.indexOf("imgs") >= 0)
                    {
                        imageFound = true;
                        break;
                    }
                continue;
            }
            //look for normally embeded images
            if (child.nodeName.toUpperCase() == "DIV" && child.className.indexOf("imgs") >= 0) 
            { 
                imageFound = true; 
                break; 
            }
            //special case to handle auto-linked images; will only work with autolinkers that use the word auto somewhere idgaf
            if(typeof child['innerHTML'] != "undefined" && child.innerHTML.indexOf("auto") != -1 && child.className != "quoted-message")
            {
                imageFound = true;
                break;
            }
            */
            if(containsMedia(child))
            {
                mediaFound = true;
                break;
            }
        } 
        if (!mediaFound)
            for (var j = 0; j < post.childNodes.length; j++) 
            { 
                var el = post.childNodes[j]; 
                if (el.nodeName.toUpperCase() != "#TEXT") 
                    if (el.className.indexOf("message-top") < 0) 
                    {
                        el.setAttribute("hidden", "hidden")
                        //if you use my message hider, it will also toggle the text
						nefews = el.previousSibling.children
						for(var k = 0;k < nefews.length; k++)
						{
							if(nefews[k].tagName.toUpperCase() == 'A' && nefews[k].innerHTML == 'Hide Message')
							{
								nefews[k].innerHTML = "Unhide Message"
								k = nefews.length
							}
						}
                    }
            } 
    } 
}; 

//recursively check all children of this node to see if they have what we want. This lets me check infinitely deep spoiler tags basically.
function containsMedia(elem)
{
    //text has no tag name; skip quotes and tiko userpics if the user has that script installed
    if(elem.tagName == undefined || (elem.className != undefined && (elem.className == "quoted-message" || elem.className == "photo-album-image")))
        return false;
    if(elem.tagName.toUpperCase() == "IMG" || elem.tagName.toUpperCase() == "VIDEO" || elem.tagName.toUpperCase() == "IFRAME" || (elem.tagName != undefined && elem.tagName.toUpperCase() == "SPAN" && elem.className == "img-placeholder"))
        return true;
    for(var j = 0; j < elem.childNodes.length; j++)
        if(containsMedia(elem.childNodes[j]))
            return true;
    return false;
}
//add to the infobar because some topics we might want to actually read
var infobar = document.getElementsByClassName("infobar")[0];
var spacer = document.createElement("span"); 
spacer.innerHTML = "&nbsp;|&nbsp;"; 
var a = document.createElement("a"); 
a.innerHTML = "Media only"; 
a.href = "javascript:void(0);"; 
a.onclick = hideMedialessPosts; 
spacer.appendChild(a); 
infobar.appendChild(spacer);