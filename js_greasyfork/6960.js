// ==UserScript==
// @name			Browsershots.org Checkbox AutoMarker
// @version			2019.12.16
// @description			Checkbox arrangement
// @description:ru		Расстановка галочек
// @include			http*://browsershots.org*
// @author			Rainbow-Spike
// @namespace			https://greasyfork.org/users/7568
// @homepage			https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=browsershots.org
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/6960/Browsershotsorg%20Checkbox%20AutoMarker.user.js
// @updateURL https://update.greasyfork.org/scripts/6960/Browsershotsorg%20Checkbox%20AutoMarker.meta.js
// ==/UserScript==

document.querySelectorAll ( '.browser_list input' ).forEach ( function ( e ) {
	e.checked ? "" : e.click();
});