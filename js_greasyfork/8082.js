// ==UserScript==
// @name         CareCloud tweak
// @name:sk         CareCloud tweak
// @name:cs         CareCloud tweak
// @namespace    http://sturcel.sk/martin/
// @version      0.01
// @description  CareCloud speedup bla bla bla.... 
// @description:sk  CareCloud speedup bla bla bla.... 
// @description:cs  CareCloud speedup bla bla bla.... 
// @author       Martin Sturcel
// @match 		 https://tmr.cortex.cz/crm/accounts/recyklace-karty*
// @match 		 https://tmr.cortex.cz/crm/accounts/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8082/CareCloud%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/8082/CareCloud%20tweak.meta.js
// ==/UserScript==

(function(){
	var boolReturn = false, elements, element, size, delta, position;
	if(!window.location.hash) {
		if(!document || !document.forms || ( document.forms.length < 1 ) || ( document.forms[0].elements < 1 ) ) {
			return boolReturn ;
		}
		size =  [window.innerHeight, window.innerWidth];
		delta = [window.pageYOffset, window.pageXOffset];
		
		elements = document.forms[0].elements;
		for(var i = 0; i < elements.length && !boolReturn; i++){
			element = elements[i] ;
			switch (element.type) {
				case "text" : 
				case "password" : 
				case "textarea" :
					position = [0, 0];
					var tmpElement = element;
					do {
						position[0] += tmpElement.offsetTop;
						position[1] += tmpElement.offsetLeft;
						tmpElement = tmpElement.offsetParent;
					} while (tmpElement);
					   
					if (position[0] > delta[0] && position[0] < delta[0] + size[0] && 
						position[1] > delta[1] && position[1] < delta[1] + size[1]) {
						element.focus();
						boolReturn = true;
						break;
					}
				default : 
					// keep looping
					break;
			} 
		}
	}
	return boolReturn ;
})();