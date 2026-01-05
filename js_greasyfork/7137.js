// ==UserScript==
// @name        JR mturk binder helper
// @version     0.4.2
// @description This script helps with the binder hits using keyboard shortcuts to make it less mouse clicky.
// @author      John Ramirez (JohnnyRS)
// @include     http*://162.243.50.229*
// @grant       none
// @namespace   https://greasyfork.org/users/6406
// @downloadURL https://update.greasyfork.org/scripts/7137/JR%20mturk%20binder%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/7137/JR%20mturk%20binder%20helper.meta.js
// ==/UserScript==

var qq19 = document.getElementById("qq19");
if (qq19 && qq19.innerHTML.indexOf("To what degree do you think of this thing") !=-1) {
    var rg7 = document.getElementById("rg7");
    var rg6 = document.getElementById("rg6");
    var rg5 = document.getElementById("rg5");
    var rg4 = document.getElementById("rg4");
    var rg3 = document.getElementById("rg3");
    var rg2 = document.getElementById("rg2");
    var rg1 = document.getElementById("rg1");
    var rg0 = document.getElementById("rg0");
    var naButton = document.getElementsByClassName("nabutton")[1];
    var labels = document.getElementsByTagName("label");
    for (var i=0,len=labels.length; i<len; i++) {
        if (labels[i].getAttribute("for") == "rg0") {
            var zeroButton = labels[i];
            break;
        }
    }

    naButton.appendChild(document.createElement("br"));
    naButton.appendChild(document.createTextNode("q or ."));
    zeroButton.innerHTML = "0 or `"
    
    document.body.onkeydown = function(e) {
        var pressedKey = "", done = false;
        if (e.which) pressedKey = e.which;
        else pressedKey = e.keyCode;
        
        if (pressedKey == '96' || pressedKey == '48' || pressedKey == '192') { done=true; rg0.checked = true; }
        else if (pressedKey == '97' || pressedKey == '49') { done=true; rg1.checked = true; }
        else if (pressedKey == '98' || pressedKey == '50') { done=true; rg2.checked = true; }
        else if (pressedKey == '99' || pressedKey == '51') { done=true; rg3.checked = true; }
        else if (pressedKey == '100' || pressedKey == '52') { done=true; rg4.checked = true; }
        else if (pressedKey == '101' || pressedKey == '53') { done=true; rg5.checked = true; }
        else if (pressedKey == '102' || pressedKey == '54') { done=true; rg6.checked = true; }
        else if (pressedKey == '110' || pressedKey == '55' || pressedKey == '190' || pressedKey == '103' ||
                 pressedKey == '81') { done=true; rg7.checked = true; }
        document.getElementsByClassName("next")[0].focus();
    };
}