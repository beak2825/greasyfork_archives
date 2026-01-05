// ==UserScript==
// @name           Binder (safe version)
// @version        0.1c
// @description    Jeff Binder hotkeys  
// @author         Cristo
// @namespace      Cristo
// @include        http://162.243.50.229/*
// @downloadURL https://update.greasyfork.org/scripts/6811/Binder%20%28safe%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6811/Binder%20%28safe%20version%29.meta.js
// ==/UserScript==

// modified by clickhappier to make include specific for Binder's URL (IP) instead of *, and comments about which key does what


var rad = document.getElementsByTagName("input");
var next = document.getElementsByTagName("button")[0];

document.addEventListener( "keydown", function(i){
    if (i.keyCode == 96){ //0#Pad = Next button
        next.click();
    }
    if (i.keyCode == 69){ //E = not applicable
        rad[0].click();
    }
    if (i.keyCode == 65){ //A = 0, not at all
        rad[1].click();
    }
    if (i.keyCode == 83){ //S = 1
        rad[2].click();
    }
    if (i.keyCode == 68){ //D = 2
        rad[3].click();
    }
    if (i.keyCode == 70){ //F = 3, somewhat
        rad[4].click();
    }
    if (i.keyCode == 88){ //X = 4
        rad[5].click();
    }
    if (i.keyCode == 67){ //C = 5
        rad[6].click();
    }
    if (i.keyCode == 86){ //V = 6, very much
        rad[7].click();
    }
}, false);