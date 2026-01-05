// ==UserScript==
// @name       jawz Nate
// @version    1.0
// @description  Something useful
// @match      https://www.mturk.com/mturk/findhits?match=true?NATE
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8647/jawz%20Nate.user.js
// @updateURL https://update.greasyfork.org/scripts/8647/jawz%20Nate.meta.js
// ==/UserScript==

var halfScreen = (screen.width/3)-10; 
var windowHeight = (screen.height/2)-70; 
var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

window.open("https://www.google.com",'remote0','height=' + windowHeight + ',width=' + halfScreen + ', left=0' + ',top=0' + specs,false);
window.open("https://www.google.com",'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (halfScreen+8) + ',top=0' + specs,false);
window.open("https://www.google.com",'remote2','height=' + windowHeight + ',width=' + halfScreen + ', left=' + ((halfScreen*2)+16) + ',top=0' + specs,false);

window.open("https://www.google.com",'remote3','height=' + windowHeight + ',width=' + halfScreen + ', left=0' + ',top=' + (windowHeight+69) + specs,false);
window.open("https://www.google.com",'remote4','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (halfScreen+8) + ',top=' + (windowHeight+69) + specs,false);
window.open("https://www.google.com",'remote5','height=' + windowHeight + ',width=' + halfScreen + ', left=' + ((halfScreen*2)+16) + ',top=' + (windowHeight+69) + specs,false);

window.close()