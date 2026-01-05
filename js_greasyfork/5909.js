// ==UserScript==
// @name         RelevanceQuest 
// @description Flag images Non Adult and hide instructions 
// @version       0.5
// @include       https://www.mturkcontent.com/dynamic/*
// @author        Cristo
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5909/RelevanceQuest.user.js
// @updateURL https://update.greasyfork.org/scripts/5909/RelevanceQuest.meta.js
// ==/UserScript==

var label = document.getElementsByTagName('label')[0];
var newDiv = document.createElement("div");

var but = document.createElement("span");
but.style.color = "#1170A0";
but.style.textDecoration = "underline";
but.style.cursor = "pointer";
but.innerHTML = "Instructions";

label.parentNode.insertBefore(but, label.nextSibling);
label.parentNode.insertBefore(newDiv, label.nextSibling);


var divs = document.getElementsByTagName('div');
var ps = document.getElementsByTagName('p');
var table = document.getElementsByTagName('table')[0];
newDiv.appendChild(divs[2]);
newDiv.appendChild(ps[0]);
newDiv.appendChild(ps[1]);
newDiv.appendChild(ps[2]);
newDiv.appendChild(divs[3]);
newDiv.appendChild(ps[3]);
newDiv.appendChild(table);
newDiv.appendChild(divs[4]);
newDiv.appendChild(divs[5]);
newDiv.style.display = "none";

but.addEventListener("mousedown",function() {
    if (newDiv.style.display == "none") {
    	newDiv.style.display = "block";
    } else if (newDiv.style.display == "block") {
    	newDiv.style.display = "none";
    }}, false);

var ins = document.getElementsByTagName('input');
for (var f = 0; f < ins.length; f++){
    if (ins[f].value === 'NOT_ADULT'){
        ins[f].click();
    }
}
