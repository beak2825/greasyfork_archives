// ==UserScript==
// @name         Cobb Click the photos that show face clicker
// @version      0.1
// @description  Clicks or unclicks all images on the page
// @author       You
// @match        https://www.mturkcontent.com/dynamic/hit*
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/6459/Cobb%20Click%20the%20photos%20that%20show%20face%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/6459/Cobb%20Click%20the%20photos%20that%20show%20face%20clicker.meta.js
// ==/UserScript==


var content = document.getElementsByClassName("selected-rect")[0];
content.tabIndex = "0";
content.focus();

document.onkeydown = showkeycode;

function showkeycode(evt){
        var keycode = evt.keyCode;
        console.log(keycode);
        switch (keycode) {
            case 192: //n
				$("img").each(function() { $(this).click(); });
                break;
            default: break;
        }
}    