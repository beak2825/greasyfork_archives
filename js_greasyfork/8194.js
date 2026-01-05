// ==UserScript==
// @name         Remove all on page
// @namespace    http://theanykey.se
// @version      1.1
// @description  Add Remove or Reactivate buttons on Gamemaker Marketplace Purchase
// @author       Andreas Mustola
// @include      marketplace.yoyogames.com/profile*tab=purchases_pane
// @include      https://marketplace.yoyogames.com/profile*tab=purchases_pane
// @include      https://marketplace.yoyogames.com/profile
// @downloadURL https://update.greasyfork.org/scripts/8194/Remove%20all%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/8194/Remove%20all%20on%20page.meta.js
// ==/UserScript==

var input=document.createElement("input");
input.type="button";
input.value="Remove all on page!";
input.onclick = ClickRemove;
input.setAttribute("style", "font-size:18px;position:absolute;top:220px;right:40px;");
document.body.appendChild(input); 

var input=document.createElement("input");
input.type="button";
input.value="Reactivate all on page!";
input.onclick = ClickReactivate;
input.setAttribute("style", "font-size:18px;position:absolute;top:320px;right:40px;");
document.body.appendChild(input); 

// Check if process is in action

if (readCookie("DoAction")=="Remove")
{
    // Goto right page
    if (readCookie("CurrentPage")!==document.URL)
    {
		window.location.replace(readCookie("CurrentPage"));        
    }
    else
    {
    	RemoveAllOnPage();
    }
}
if (readCookie("DoAction")=="Reactivate")
{
    // Goto right page
    if (readCookie("CurrentPage")!==document.URL)
    {
		window.location.replace(readCookie("CurrentPage"));        
    }
    else
    {
    	ReactivateAllOnPage();
    }    
}

function ClickRemove()
{
    createCookie("DoAction","Remove",1);
    createCookie("CurrentPage",document.URL,1);
	RemoveAllOnPage();
}

function ClickReactivate()
{
    createCookie("DoAction","Reactivate",1);
    createCookie("CurrentPage",document.URL,1);
	ReactivateAllOnPage();
}

function ReactivateAllOnPage()
{
    // Check for all "Remove"
    var AllLinks = document.getElementsByTagName('a');
    
    var AutoClicked=false;
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n.text=="Reactivate")
        {
         	// Click
            n.click();
            AutoClicked=true;
            //break;
        }
    }
    
    if (AutoClicked==false)
    {
     	alert("All Reactivated!");
        eraseCookie("DoAction");
    }
}

function RemoveAllOnPage()
{
    // Check for all "Remove"
    var AllLinks = document.getElementsByTagName('a');
    
    var AutoClicked=false;    
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n.text=="Remove")
        {
         	// Click
            n.click();
            AutoClicked=true;
            //break;
        }
    }
    
    if (AutoClicked==false)
    {
     	alert("All Removed!");
        eraseCookie("DoAction");
    }    
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}