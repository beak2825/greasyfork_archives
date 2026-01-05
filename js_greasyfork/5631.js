// ==UserScript==
// @name       TR2
// @version    0.2
// @match      https://tr-oa.crowdcomputingsystems.com/mturk-web*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/710
// @description Clicks google link on TR2
// @downloadURL https://update.greasyfork.org/scripts/5631/TR2.user.js
// @updateURL https://update.greasyfork.org/scripts/5631/TR2.meta.js
// ==/UserScript==

var links = document.getElementsByTagName('a'); 
for (var i = 0; i < links.length; i++) { 
    if (links[i].href.indexOf("google.com") > -1) 
        links[i].click(); 
}

var buttons = document.getElementsByTagName('input');
for (var i = 0; i < buttons.length; i++){
    if (buttons[i].type=="radio" && buttons[i].value=="5")
        buttons[i].click();
}