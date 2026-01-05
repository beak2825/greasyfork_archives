// ==UserScript==
// @name        imgresizevoz
// @author      dt
// @include     /^http:\/\/vozforums\.com\/(showthread|showpost|newreply|newthread|editpost|private\.php\?do).*$/
// @version     1.0
// @run-at       document-start
// @description banh háng img
// @namespace https://greasyfork.org/users/9850
// @downloadURL https://update.greasyfork.org/scripts/8962/imgresizevoz.user.js
// @updateURL https://update.greasyfork.org/scripts/8962/imgresizevoz.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
 	
document.addEventListener('DOMSubtreeModified', OnSubtreeModified, false);

function OnSubtreeModified(event) {
    function loadExternalScript(handler) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = handler;
        head.appendChild(script);
    }
    var handler = function(maxwidth) {
        unsafeWindow.NcodeImageResizer.MAXWIDTH = maxwidth;
    };
    loadExternalScript(handler(1155));
  document.removeEventListener('DOMSubtreeModified', OnSubtreeModified, false);
}