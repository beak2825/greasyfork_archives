// ==UserScript==
// @name         "Right Click Block" and "Select Block" Blocker
// @version      0.1
// @description  Block the right click and mouse select blockers.
// @author       ekin@gmx.us
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @namespace 	 https://greasyfork.org/users/6473
// @downloadURL https://update.greasyfork.org/scripts/6838/%22Right%20Click%20Block%22%20and%20%22Select%20Block%22%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/6838/%22Right%20Click%20Block%22%20and%20%22Select%20Block%22%20Blocker.meta.js
// ==/UserScript==

window.onload = function() {
    
    document.oncontextmenu=true;
    
    if(jQuery) {
        jQuery(document).unbind('contextmenu');
    }
    
    var css = "html, body {\
        -webkit-touch-callout: all !important;\
        -webkit-user-select: all !important;\
        -khtml-user-select: all !important;\
        -moz-user-select: all !important;\
        -ms-user-select: all !important;\
        user-select: all !important;\
	}";
    
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    
    head.appendChild(style);
   
};