// ==UserScript==
// @name       Livipur.de Percantage Viewer
// @version    1.2
// @description  If there are articles, which are reduced, this script views the percentage of the reduction.
// @match      http://www.livipur.de/*
// @match      http://*.livipur.de/*
// @match      http://livipur.de/*
// @copyright  2014+
// @namespace https://greasyfork.org/users/7112
// @downloadURL https://update.greasyfork.org/scripts/6625/Livipurde%20Percantage%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/6625/Livipurde%20Percantage%20Viewer.meta.js
// ==/UserScript==

window.onerror = function(){
   return true;
}

var boxes = document.getElementsByClassName("ProduktDunkel");
for(var i = 0; i < boxes.length; i++) {
 	
    var preise = boxes[i].getElementsByClassName("Bezeichnung");
    var preise = preise[1].getElementsByTagName("a")[0];
    
    var alt = preise.getElementsByTagName("span")[0];
    if(alt != null) {
    var alt = alt.innerHTML;
    
    alt = alt.replace(/,/g, '.');
    alt = alt.replace(/nur /g, '');
    alt = alt.replace(/ €/g, '');
    alt = alt.replace(/ /g, '');
    
    var neu = preise.getElementsByTagName("span")[1].innerHTML;
    neu = neu.replace(/,/g, '.');
    neu = neu.replace(/nur /g, '');
    neu = neu.replace(/ €/g, '');
    neu = neu.replace(/ /g, '');
    var percent = 100  - (neu * 100 / alt);
    percent = Math.round(percent);
    
    preise.getElementsByTagName("span")[1].innerHTML = preise.getElementsByTagName("span")[1].innerHTML + " ("+percent+"%)";
    }
    
}

var boxes = document.getElementsByClassName("ProduktHell");
for(var i = 0; i < boxes.length; i++) {
 	
    var preise = boxes[i].getElementsByClassName("Bezeichnung");
    var preise = preise[1].getElementsByTagName("a")[0];
    var alt = preise.getElementsByTagName("span")[0];
     if(alt != null) {
         alt = alt.innerHTML;
    alt = alt.replace(/,/g, '.');
    alt = alt.replace(/nur /g, '');
    alt = alt.replace(/ €/g, '');
    alt = alt.replace(/ /g, '');
    
    var neu = preise.getElementsByTagName("span")[1].innerHTML;
    neu = neu.replace(/,/g, '.');
    neu = neu.replace(/nur /g, '');
    neu = neu.replace(/ €/g, '');
    neu = neu.replace(/ /g, '');
    var percent = 100  - (neu * 100 / alt);
    percent = Math.round(percent);
    preise.getElementsByTagName("span")[1].innerHTML = preise.getElementsByTagName("span")[1].innerHTML + " ("+percent+"%)";
   }
    
}