// ==UserScript==
// @name        Post Hider
// @namespace   cloaknsmoke
// @description Hide or unhide posts.
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     http://archives.endoftheinter.net/showmessages.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @include     https://archives.endoftheinter.net/showmessages.php*
// @version     6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6806/Post%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/6806/Post%20Hider.meta.js
// ==/UserScript==

function createButton(element)
{
	var text = document.createElement("span"); 
	text.innerHTML = "&nbsp;| "; 
	element.appendChild(text); 
	var link = document.createElement("a");
	link.href = "javascript:void(0)";
	link.innerHTML = "Hide Message";
	element.appendChild(link);
	link.addEventListener("click", function(){unhide(this);}, false);
}

//add the button to every post
var messages = document.getElementsByClassName("message-container"); 
for (var i = 0; i < messages.length; i++) 
{ 
  var post = messages[i]; 
  for (var j = 0; j < post.childNodes.length; j++) 
  { 
    var el = post.childNodes[j]; 
    if (el.nodeName.toUpperCase() != "#TEXT") 
      if (el.className.indexOf("message-top") >= 0) 
      { 
        createButton(el);
      }
  }
}
//Add the button to new posts as well
var mut = new MutationObserver(function(a)
{
	a.forEach(function(val, i)
	{
		if(val.addedNodes.length == 1 && !(val.addedNodes[0].tagName === undefined) && val.addedNodes[0].tagName == "DIV")
		{
			var messages = val.addedNodes[0].getElementsByClassName("message-container"); 
			for (var i = 0; i < messages.length; i++) 
			{ 
			  var post = messages[i]; 
			  for (var j = 0; j < post.childNodes.length; j++) 
			  { 
				var el = post.childNodes[j]; 
				if (el.nodeName.toUpperCase() != "#TEXT") 
				  if (el.className.indexOf("message-top") >= 0) 
				  { 
					createButton(el);
				  }
			  }
			}
		}
	});
})
var config = { childList: true, subtree: true };
var divs = document.getElementsByTagName("div")
for(var i = 0; i < divs.length; i++)
{
    if(divs[i].id == "u0_1")
        mut.observe(divs[i],config);
}

//contrary to its name, it also hides posts
function unhide(elem)
{
    var sib = elem.parentNode.nextSibling;
    if(sib.getAttribute("hidden") == "hidden")
    {
        sib.removeAttribute("hidden")
        elem.innerHTML = "Hide Message";
    }
    else
    {
        sib.setAttribute("hidden", "hidden")
        elem.innerHTML = "Unhide Message";
    }
}