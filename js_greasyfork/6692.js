// ==UserScript==
// @name         Dailymotion Preview Unblur
// @namespace    http://twitter.com/7milestyle
// @version      1.0
// @description  Removes the blur Dailymotion places over video thumbnails which have been flagged as adult content.
// @author       7MileStyle
// @match        http://*.dailymotion.com/*
// @match        http://dailymotion.com/*
// @grant        none
// @license	 http://creativecommons.org/licenses/by-nc-sa/3.0/
// @downloadURL https://update.greasyfork.org/scripts/6692/Dailymotion%20Preview%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/6692/Dailymotion%20Preview%20Unblur.meta.js
// ==/UserScript==

window.addEventListener ("load", unBlur, false);

function unBlur () {

    var x = document.getElementsByClassName("preview-message");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    
    var elems = document.querySelectorAll(".preview.blurred");
    
    [].forEach.call(elems, function(el) {
        el.classList.remove("blurred");
    });
}