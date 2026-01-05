// ==UserScript==
// @name         Moochable book filter for Bookmooch mobile 
// @namespace    bookmooch
// @version      0.1
// @description  Adds a button to toggle the display of unavailable books on the wishlist and search results pages.
// @include      /^http://(fr|jp|pt)\.bookmooch\.com/mobile/m/(wishlist|search_do).*$/
// @include      /^http://bookmooch\.(com|de|es|it|se)/mobile/m/(wishlist|search_do).*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6355/Moochable%20book%20filter%20for%20Bookmooch%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/6355/Moochable%20book%20filter%20for%20Bookmooch%20mobile.meta.js
// ==/UserScript==

window.show_moochable = false;

var heart = document.createElement("span");
heart.appendChild(document.createTextNode("\u2665 "));
heart.setAttribute("id", "heartToggle");
heart.setAttribute("title", "Toggle moochable filter");

var header = document.getElementById('pageTitle');
header.insertBefore(heart, header.firstChild);

heart.addEventListener("click", toggleFilter, true);

function toggleFilter() {
    var lis = document.getElementsByTagName('li');
    window.show_moochable = !window.show_moochable;
    var display = window.show_moochable ? 'none' : 'block';
    for (i = 0; i < lis.length; i++) {
        if (lis[i].firstChild.firstChild.textContent != '\u2665')
            lis[i].style.display = display;
    }
    document.getElementById("heartToggle").style.color = window.show_moochable ? "#FF0000" : "inherit";    
}