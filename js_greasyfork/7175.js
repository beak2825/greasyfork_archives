// ==UserScript==
// @name           Force Hymmnos font
// @author	    Adel K.
// @supportURL https://twitter.com/LordHaruto
// @description  Was yea ra chs hymmnos yor, en chsee fwal fwal yor.
// @match          *://*/*
// @version         1.0
// @namespace  ar.tonelico.hymmnos
// @downloadURL https://update.greasyfork.org/scripts/7175/Force%20Hymmnos%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/7175/Force%20Hymmnos%20font.meta.js
// ==/UserScript==

fontFamily = "Hymmnos";
blocks = [ 'sans', 'inputtext', 'span', 'p', 'a', 'div'];

document.body.style.fontFamily = fontFamily;

for (index = 0; index < a.length; index++) {
	elements = document.getElementsByTagName(blocks[index]);
	for(i = 0 ; i < elements.length ; i++) {
		elements[i].style.fontFamily = fontFamily;
	}
}