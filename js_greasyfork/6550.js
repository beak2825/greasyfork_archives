// ==UserScript==
// @name        Email scrape
// @description WIP 
// @version       0.1
// @include      *
// @author        Cristo
// @run-at document-end
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/6550/Email%20scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/6550/Email%20scrape.meta.js
// ==/UserScript==

//Ctrl x to hide and show email div
if(window.location.toString().indexOf('mturk') === -1){
var regPat = /[a-zA-Z0-9\._\-]{3,}(@| @ | at |\[at\]| \[at\] |\{at\}| \{at\} |\(at\)| \(at\) |<at>| <at> |-at-| -at- |_at_| _at_ )[a-zA-Z]{3,}(\.| \. |dot| dot |\[dot\]| \[dot\] |\{dot\}| \{dot\} |\(dot\)| \(dot\) |<dot>| <dot> |-dot-| -dot- |_dot_| _dot_ )[a-zA-Z]{2,}/g;
var pageText = document.documentElement.innerHTML.toLowerCase(); 
var results = pageText.match(regPat);

if (results.length !== 0){
    var bod = document.getElementsByTagName("body")[0];
    var prediv = document.createElement("div");
    bod.appendChild(prediv);
    prediv.style.position = "fixed";
    prediv.style.zIndex="999";
    prediv.style.bottom = "0%";
    prediv.style.left = "0%";
    prediv.style.width = "100%";
    prediv.style.maxWidth = "auto";
    prediv.style.display = "block"
    prediv.setAttribute("id", "thediv");
    prediv.style.backgroundColor = "white";
    var listu = document.createElement('ul');
    prediv.appendChild(listu);
}

for (var f = 0; f < results.length; f++){
    var listi = document.createElement('li');
    listu.appendChild(listi);
    var newSpan = document.createElement("span");
    newSpan.style.color = "#000000";
    newSpan.style.textDecoration = "underline";
    newSpan.style.cursor = "pointer";
    
    newSpan.style.fontSize="15px";
    newSpan.innerHTML = results[f];
    
    newSpan.addEventListener('click', cas, false);
    listi.appendChild(newSpan);
    console.log(f);
}
function cas(j){
    GM_setClipboard(j.target.innerHTML);
}
document.addEventListener('keydown',function(i) {
    if (i.keyCode == 88) {//x
        if (i.ctrlKey === true){
            var theDiv = document.getElementById('thediv');
            console.log(theDiv.style.display);
            
            if (theDiv.style.display == "none") {
                console.log('yeup1');
                theDiv.style.display = "block";
            } else if (theDiv.style.display == "block") {
                console.log('yeup2');
                theDiv.style.display = "none";
            }
                }
    }}, false);
}
