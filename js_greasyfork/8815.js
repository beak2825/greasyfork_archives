// ==UserScript==
// @name           Show Password on Fileld's Focus
// @name:cs        Zobraz heslo vybraného pole
// @namespace      http://eldar.cz/myf/
// @description    Switches password input to text while focused, regardless its origin.
// @description:cs Změní typ vybraného pole z hesla na text bez ohledu na jeho původ.
// @include        *
// @grant          none
// @license        free
// @version        1.0.0
// @downloadURL https://update.greasyfork.org/scripts/8815/Show%20Password%20on%20Fileld%27s%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/8815/Show%20Password%20on%20Fileld%27s%20Focus.meta.js
// ==/UserScript==
;(function(){ 

if(!document.body || !document.body.addEventListener)
	return;

var pwField = null;

function f_focus(e) {
	var t = e.target;
	if ('input' != t.tagName.toLowerCase())
		return true;
	if ('password' != t.type.toLowerCase())
		return true;
	t.type = 'text';
	pwField = t;
}

function f_blur(e) {
	if (!pwField)
		return true;
	if (pwField !== e.target)
		return true;
	pwField.type = 'password';
	pwField = null;
}
document.body.addEventListener('focus',f_focus,true);
document.body.addEventListener('blur',f_blur,true);

})();