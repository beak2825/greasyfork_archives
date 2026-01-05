// ==UserScript==
// @name         Check_MK - WATO Shortcut to services
// @namespace    http://openuserjs.org/users/ardiman
// @description  Generates icon which opens the host's services configuration.
// @description:de-DE Erstellt ein Icon, mit dem man schnell zur Service-Konfiguration des Hosts gelangt.
// @grant        none
// @homepage     https://github.com/ardiman/userscripts/tree/master/checkmkwatoshortcuttoservices
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      *check_mk/view.py?*
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.5
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/6391/Check_MK%20-%20WATO%20Shortcut%20to%20services.user.js
// @updateURL https://update.greasyfork.org/scripts/6391/Check_MK%20-%20WATO%20Shortcut%20to%20services.meta.js
// ==/UserScript==

(function() {
	var nodes = document.evaluate(
		"//td[@class='icons']/a[contains(@href,'&mode=edithost')]|//td[@class='tr icons']/a[contains(@href,'&mode=edithost')]",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	for(var i=0; i<nodes.snapshotLength; i++) {
		var thisNode = nodes.snapshotItem(i);
		var oAnchor = document.createElement("a");
		var oImg = oAnchor.appendChild(document.createElement("img"));
		oImg.setAttribute('class','icon');
		oImg.title = 'Open services of this host in WATO - the Check_MK Web Administration Tool';
		oImg.setAttribute('src', 'images/icon_services.png');
		oAnchor.href = thisNode.href.replace('&mode=edithost','&mode=inventory');
		thisNode.parentNode.insertBefore(oAnchor, thisNode);
	}

	var oWatoDiv = document.getElementById("wato");
	if (oWatoDiv !== null) {
		var oServDiv = oWatoDiv.cloneNode(true);
		oServDiv.id='cb_watoserv';
		oServDiv.setAttribute('style','display:none');
		oServDiv.firstChild.href = oWatoDiv.firstChild.href.replace('mode=edithost','mode=inventory');
		oServDiv.firstChild.firstChild.src = 'images/icon_services.png';
		oServDiv.firstChild.firstChild.nextSibling.nodeValue='Services';
		oWatoDiv.parentNode.insertBefore(oServDiv, oWatoDiv.nextSibling);
	}

})();

