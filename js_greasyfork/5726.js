// ==UserScript==
// @name        Evan J
// @description Search for company news URL
// @version       0.1
// @include       https://s3.amazonaws.com/mturk_bulk/hits/*
// @author        Cristo
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/5726/Evan%20J.user.js
// @updateURL https://update.greasyfork.org/scripts/5726/Evan%20J.meta.js
// ==/UserScript==

var topBox = document.getElementsByClassName('highlight-box')[0];
var url = document.getElementsByTagName('b')[2];
document.getElementsByTagName('option')[1].selected = true;;
var sub = document.getElementById('submitButton');

topBox.style.display = "none";
var but = document.createElement("span");
but.style.color = "#1170A0";
but.style.textDecoration = "underline";
but.style.cursor = "pointer";
but.innerHTML = "Instructions"
topBox.parentNode.insertBefore(but,topBox);
but.addEventListener("mousedown",function() {
    if (topBox.style.display == "none") {
        topBox.style.display = "block";
    } else if (topBox.style.display == "block") {
        topBox.style.display = "none";
    }}, false);


document.addEventListener('keydown',function(i) {
    if (i.keyCode == 13) {//9
        sub.click();
    }}, false);
window.open(url.innerHTML);