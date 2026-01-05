// ==UserScript==
// @name		Picture Replacer
// @namespace	o0DMKO0s1wze9QECcew9
// @author		LemonIllusion
// @version		1.0
// @match       http*://*/*
// @description	Replaces every image on every webpage with an image from a list (which you have to define)
// @downloadURL https://update.greasyfork.org/scripts/9379/Picture%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/9379/Picture%20Replacer.meta.js
// ==/UserScript==

function randInt(min, max) {
    return Math.floor((Math.random() * (max-min)) + min);
}

function replaceImages() {
    var loopList = document.getElementsByTagName("img");
    for (i = 0; i < loopList.length; i++) {
        loopList[i].style.cssText = "height:"+loopList[i].offsetHeight+"px; width:"+loopList[i].offsetWidth+"px;";
        loopList[i].src = imageList[randInt(0, imageList.length)];
    }
}

var imageList = [
    // Put your images here
    "http://example.com/picture.png",
    "http://example2.com/picture2.jpg"
];

replaceImages();