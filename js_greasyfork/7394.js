// ==UserScript==
// @name         Modecraft Routing Easy Line Remover
// @namespace    http://mcimino.reaktix.com/
// @version      0.1
// @description  enter something useful
// @author       Saibotshamtul
// @match        http://webimgsrv.burlingtoncoatfactory.com/static/locator/routing_request_mailer.php
// @grant        none
// @copyright    2012+, Saibotshamtul
// @downloadURL https://update.greasyfork.org/scripts/7394/Modecraft%20Routing%20Easy%20Line%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/7394/Modecraft%20Routing%20Easy%20Line%20Remover.meta.js
// ==/UserScript==
// routing_request_mailer.php

//a=prompt("Remove starting from which number?");d=document.querySelectorAll('.rfsubheader_c1');for (var z in d){if(Number(d[z].innerText)>=Number(a)){d[z].parentNode.parentNode.remove()}}

div = document.createElement("div");
function RemoveLines(){
    a=prompt("Remove starting from which number?");
    if (a==undefined){
        return;}
    d=document.querySelectorAll('.rfsubheader_c1');
    for (var z in d){
        if(Number(d[z].innerText)>=Number(a)){
            d[z].parentNode.parentNode.remove();
        }
    }
    return;
}
window.wrappedJSObject.RemoveLines = RemoveLines;
div.style.cssText="position:fixed;top:10px;left:20px;border:0px solid royalblue;padding:5px;z-index:2000;font-family:Tahoma;font-size:10pt;";
div.innerHTML='<a onclick="RemoveLines()">&bull;</a>';
document.body.appendChild(div);