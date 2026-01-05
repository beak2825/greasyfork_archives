// ==UserScript==
// @name         D2L @ GSW login page background fix
// @description  D2L @ GSW toolbox.
// @namespace    https://stapps.gswcm.net/~simon.baev
// @version      0.1
// @author       Simon Baev
// @match        https://gsw2.view.usg.edu/d2l/login
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/9716/D2L%20%40%20GSW%20login%20page%20background%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/9716/D2L%20%40%20GSW%20login%20page%20background%20fix.meta.js
// ==/UserScript==
var bg_div = $('div.d2l-background-global div');
if(bg_div.length == 1) {
    bg_div.css({
        'background-repeat' : 'no-repeat', 
        'background-size' : 'cover',
        'background-image' : 'url(https://stapps.gswcm.net/~simon.baev/bg.png)'
    });
}

