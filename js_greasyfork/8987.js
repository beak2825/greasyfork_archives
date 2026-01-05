// ==UserScript==
// @name        Ellipsis fix [C&C]
// @description It prevents ellipsis for long texts in C&C Tiberium Alliances
// @namespace   https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.0.0
// @grant none
// @author mehdi
// @downloadURL https://update.greasyfork.org/scripts/8987/Ellipsis%20fix%20%5BCC%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/8987/Ellipsis%20fix%20%5BCC%5D.meta.js
// ==/UserScript==

(function(){
    var ellipsisFix = function() {
        for (i = 0; i < document.getElementsByTagName("div").length; i++) { 
            document.getElementsByTagName("div")[i].style["text-overflow"] = "";
        }
    }
    
    document.getElementsByTagName("html")[0].addEventListener("click", ellipsisFix);
})();