/*
    tftvfl
    Minor tf.tv layout configurator
    
    Copyright 2013 Alexander "Wareya" Nadeau <wareya@gmail.com>
    
    This software is provided 'as-is', without any express or implied
    warranty. In no event will the authors be held liable for any damages
    arising from the use of this software.
    
    Permission is granted to anyone to use this software and/or its source
    code for any purpose, including commercial applications, and to alter
    it and/or distribute it freely, subject to the following conditions:
    
        1. The origin of the software must not be misrepresented.
            
            1a. Modified versions of the software or its source code must
            not be misrepesented as the original version.
            
            1b. Acknowledgment of use or modification of the software
            or its source code is appreciated but not required.
        
        2. This notice may not be removed from, or altered in, any source
        distribution of the software.
            
            2a. This notice is not required to be included in any compiled
            distribution of the software, as long as said distribution
			does not constitute a source distribution.
*/

// ==UserScript==
// @name        tftvfl
// @version		0.03
// @namespace   wareya
// @description Minor tf.tv layout configurator
// @include     http://teamfortress.tv/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7471/tftvfl.user.js
// @updateURL https://update.greasyfork.org/scripts/7471/tftvfl.meta.js
// ==/UserScript==


/* change these values between true or false to enable/disable individual features of the plugin */

// whether the sidebar is toggle-able off of the main page
var togglebar_enabled = true;
// whether the global "Threads" link is enabled
//var globalallthreads_enabled = true;//built-in to tftv now

// whether to move a given left bar entry to the right bar
var move_news = false;
var move_schedule = false;
var move_activity = true;


/* bulk of the script (don't modify this unless you know what you're doing */

// helper function (why javascript why don't NodeLists act like arrays)
function map(nodes, func)
{
    for (var i = 0; i < nodes.length; ++i)
        func(nodes[i]);
}
function setopenspan(firstrun)
{
    localStorage.setItem("tftvbar/closed", "false");
	
    var barstuff = document.getElementById("col-left");
    var colstuff = document.getElementById("col-center");
    
	colstuff.style.marginLeft = "0";
	colstuff.style.width = "100%";
	barstuff.style.display = "";
	
    if(document.getElementById("closer") != null)
        document.getElementById("closer").parentNode.removeChild(document.getElementById("closer"));
    
	// make temp element to get things from it
	var content = document.getElementById("content");
	content.innerHTML = "\
	\<span id='closer' onclick='setclosedspan(0);' style='font-family:arial; float:right; position: absolute; top: 5px; left: 20px; z-index: 2;'>\
	    [<]\
	</span>"
	+ content.innerHTML;
	
	document.getElementById("article-list").style.width = "219px";
	if(!firstrun)
		document.styleSheets[0].deleteRule(0);
	document.styleSheets[0].insertRule('.article-item { width: 166px !important; }', 0);
    
}
function setclosedspan(firstrun)
{
    localStorage.setItem("tftvbar/closed", "true");
	
    var barstuff = document.getElementById("col-left");
    var colstuff = document.getElementById("col-center");
	
	
	colstuff.style.marginLeft = "-185px";
	colstuff.style.width = "947px";
	barstuff.style.display = "none";
    
    if(document.getElementById("closer") != null)
        document.getElementById("closer").parentNode.removeChild(document.getElementById("closer"));
    
	// make temp element to get things from it
	var content = document.getElementById("content");
	content.innerHTML = "\
	\<span id='closer' onclick='setopenspan(0);' style='font-family:arial; float:right; position: absolute; top: 5px; left: 20px; z-index: 2;'>\
	    [>]\
	</span>"
	+ content.innerHTML;
	
	document.getElementById("article-list").style.width = "341px";
	if(!firstrun)
		document.styleSheets[0].deleteRule(0);
	document.styleSheets[0].insertRule('.article-item { width: 288px !important; }', 0);
    
}

if(togglebar_enabled)
{
    var script = document.body.appendChild(document.createElement("script"));
    
    script.type = "text/javascript";
    script.id = "userscript funcs / wareya";
    script.innerHTML = map.toString() + setopenspan.toString() + "\n" + setclosedspan.toString() + "\n" + "\n";
	
    if (localStorage.getItem("tftvbar/closed") != "true")
        setopenspan(1);
    else
        setclosedspan(1);
}


/*
if(globalallthreads_enabled)
{
	//						"nav"       center       <nav>      Forums
    document.getElementById("nav").children[0].children[0].children[1].outerHTML += '\
	<div class="nav-item-wrapper distinct noselect">\
		<a href="/active" class="bbox nav-item ">\
			All Threads\
		</a>\
	</div>';
}*/

// In reverse order so that appending is trivial
if(move_activity)
{
    document.getElementById("col-left").children[2].style.marginTop = "4px";
    document.getElementById("col-right").children[1].outerHTML +=
    document.getElementById("col-left").children[2].outerHTML;
    document.getElementById("col-left").children[2].outerHTML = "";
}
if(move_schedule)
{
    document.getElementById("col-left").children[1].style.marginTop = "4px";
    document.getElementById("col-right").children[1].outerHTML +=
    document.getElementById("col-left").children[1].outerHTML;
    document.getElementById("col-left").children[1].outerHTML = "";
}
if(move_news)
{
    document.getElementById("col-left").children[0].style.marginTop = "4px";
    document.getElementById("col-right").children[1].outerHTML +=
    document.getElementById("col-left").children[0].outerHTML;
    document.getElementById("col-left").children[0].outerHTML = "";
}