// ==UserScript==
// @name         Prod Detect
// @namespace    http://jordanbalagot.com/
// @version      0.11
// @description  Displays a simple warning bar at the top of your site if you're on production.
// @author       Jordan B
// @match        http://www.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/6672/Prod%20Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/6672/Prod%20Detect.meta.js
// ==/UserScript==

//Replace http://www.google.com/* with your production URL.
if(window.location.href.indexOf("http://www.google.com/") > -1)
{
    window.onload = function(){
        var proddiv = document.createElement("div");
        proddiv.id = "proddiv";
        proddiv.innerHTML = "PROD";
        document.body.appendChild(proddiv);
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = "body { margin-top: 20px; } ";
        css.innerHTML += "#proddiv { position:absolute;text-align:left;top:0;width:100%;height:16px;opacity:1;z-index:100;background:red;color:white;padding:4px;}";
        document.body.appendChild(css);
    };
}