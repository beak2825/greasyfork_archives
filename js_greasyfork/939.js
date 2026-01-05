// ==UserScript==
// @name 	IP.Board - Hide Gender in Miniprofiles
// @namespace	Makaze
// @include	*
// @grant	none
// @version	1.0.2
// @description Like it says on the tin.
// @downloadURL https://update.greasyfork.org/scripts/939/IPBoard%20-%20Hide%20Gender%20in%20Miniprofiles.user.js
// @updateURL https://update.greasyfork.org/scripts/939/IPBoard%20-%20Hide%20Gender%20in%20Miniprofiles.meta.js
// ==/UserScript==

var i = 0,
j = 0;

function clearProfile() {
	for (i = 0; i < document.getElementsByClassName('custom_fields').length; i++) {
		var thisf = document.getElementsByClassName('custom_fields')[i];
		for (j = 0; j < thisf.getElementsByTagName('li').length; j++) {
			if (thisf.getElementsByTagName('li')[j].innerHTML.match(/gender/gi)) {
				thisf.getElementsByTagName('li')[j].style.display = 'none';
			}
		}
	}
}

if (document.body.id === 'ipboard_body') {
	clearProfile();
}