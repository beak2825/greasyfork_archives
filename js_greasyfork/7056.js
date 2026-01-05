// ==UserScript==
// @name         Filer.net Download-Link getter
// @namespace    http://your.homepage/
// @version      0.1
// @description  Adds a button which permits to view all the download links of a folder on filer.net (for use with a DL-Manager)
// @author       derTobi
// @match        http://filer.net/folder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7056/Filernet%20Download-Link%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/7056/Filernet%20Download-Link%20getter.meta.js
// ==/UserScript==
var oHead = document.getElementsByTagName('HEAD').item(0);
var oScript= document.createElement("script");
oScript.type = "text/javascript";
oScript.src="https://code.jquery.com/ui/1.11.2/jquery-ui.min.js";
oHead.appendChild( oScript);

//document.write("<script src='https://code.jquery.com/ui/1.11.2/jquery-ui.min.js'><\/script>");
$(document).ready(function(){
    var btn = $("<li><a>Download folder</a></li>");
    btn.click(function(){
       	a = $('.table-stripped a:has(img)');
        crtItem = "<div id='dialog' style='background-color: white; border: 1px solid black; margin: 10px; overflow-y: scroll; position: absolute; top: 0; left: 0; right: auto; bottom: auto'>";
        for (i = 0; i < a.length; i++){
            crtItem += a[i].href + "<br>\r\n";
        }
        debugger;
        crtItem += "</div>";
       	$("body").append(crtItem);
    });
    $("ul.nav-list").append(btn);
});