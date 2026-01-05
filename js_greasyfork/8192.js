// ==UserScript==
// @name       Kind of Simple refresh 
// @version    0.1
// @description  klj
// @author     Cristo
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/8192/Kind%20of%20Simple%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/8192/Kind%20of%20Simple%20refresh.meta.js
// ==/UserScript==

var refreshTime = 1; //In seconds
var t = refreshTime * 1000;

document.addEventListener( "keydown", kas, false);
function kas(i) {
    if (i.keyCode == 192) { //~ 
        
        if (GM_getValue("stop") == "false"){
            GM_setValue("lifeislike", "false");
            clearTimeout(load);
            GM_setValue("stop", "true");
        } else {
            
            GM_setValue("lifeislike", "true");
            GM_setValue("therightpage", window.location.toString());
            var load = setTimeout(function () { GM_setValue("outthewindow", "true"); location.reload(true); }, t);
            GM_setValue("stop", "false");
        }
    }
}
if ((GM_getValue("lifeislike") == "true") && (window.location.toString() == GM_getValue("therightpage"))) {
    GM_setValue("lifeislike", "false");
    var t = refreshTime * 1000;
    var load = setTimeout(function () { GM_setValue("lifeislike", "true"); location.reload(true); }, t);
}