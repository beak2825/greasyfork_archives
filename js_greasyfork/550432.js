// ==UserScript==
// @name			去廣告
// @namespace		http://tampermonkey.net/
// @version			1.0
// @description		廣告程式
// @author			p51717047125
// @match			http://*/*
// @match			https://*/*
// @run-at			document-end
// @grant			none
// @license		MIT License
// @downloadURL https://update.greasyfork.org/scripts/550432/%E5%8E%BB%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/550432/%E5%8E%BB%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
	'use strict';

	document.querySelectorAll('link[href*="googletagmanager.com"]').forEach(function(el) {
		el.remove();
	});
	document.querySelectorAll('link[href*="googletagservices.com"]').forEach(function(el) {
		el.remove();
	});
})();
