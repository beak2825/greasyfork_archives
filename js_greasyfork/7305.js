// ==UserScript==
// @name        UK ISP Court Orders BB
// @namespace   minitrue.gov.as1.oce/mpaa
// @description Show Big Brother on the UK internet censorship page
// @include     http://www.ukispcourtorders.co.uk/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7305/UK%20ISP%20Court%20Orders%20BB.user.js
// @updateURL https://update.greasyfork.org/scripts/7305/UK%20ISP%20Court%20Orders%20BB.meta.js
// ==/UserScript==

with({el: document.createElement("div")}){
	with(el.style){
		position = "fixed";
		top = "0"; left = "0"; right = "0"; bottom = "0";
		backgroundImage = "url('https://i.imgur.com/pAXGDRO.jpg')";
		backgroundPosition = "50% 50%";
		backgroundSize = "cover";
		opacity = 0.3;
	}
	document.body.appendChild(el);
}