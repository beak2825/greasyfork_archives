// ==UserScript==
// @name         Miata.net Forum Ad Hider
// @namespace    http://mbignell.com/
// @version      0.1
// @description  Hides ads on forum.miata.net
// @author       Mike Bignell
// @match        http://forum.miata.net/vb/*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8868/Miatanet%20Forum%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/8868/Miatanet%20Forum%20Ad%20Hider.meta.js
// ==/UserScript==

var allDivs = document.getElementsByTagName("div");
var adDivs = [];

for(var i = 0; i < allDivs.length; i++)
{
    var div = allDivs[i];
    //console.log(div);
    
    var firstElementChild = div.firstElementChild;
    var lastElementChild = div.lastElementChild;
    
    if ((firstElementChild && firstElementChild.tagName == "BR") &&
        (lastElementChild && lastElementChild.tagName == "A" && lastElementChild.innerText == "Turn off these ads?"))
    {
        //console.log("Found an ad div");
        adDivs.push(div);
    }
}

for(var j = 0; j < adDivs.length; j++)
{
    var adDiv = adDivs[j];
    //console.log(adDiv);
    adDiv.setAttribute("hidden","true");
}

console.log("Hid "+adDivs.length+" ads.");
