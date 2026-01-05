// ==UserScript==
// @name         Check_MK - WATO Uncheck Service
// @namespace    http://openuserjs.org/users/ardiman
// @description  Remember which checkbox should be always on or off by doubleclick on checkbox under WATO/Services of host.
// @description:de-DE Merkt sich, welches Kontrollkästchen immer ein- oder ausgeschaltet sein soll durch Doppelklick auf das Kontrollkästchen unter WATO/Services of host.
// @grant        GM_getValue
// @grant        GM_setValue
// @homepage     https://github.com/ardiman/userscripts/tree/master/checkmkwatouncheckservice
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      */check_mk/wato.py?mode=inventory&host*
// @include      */check_mk/wato.py?filled_in=edithost*
// @include      */check_mk/wato.py?folder=&host=*&mode=inventory
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.5
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/6482/Check_MK%20-%20WATO%20Uncheck%20Service.user.js
// @updateURL https://update.greasyfork.org/scripts/6482/Check_MK%20-%20WATO%20Uncheck%20Service.meta.js
// ==/UserScript==

var cmkwatouncheckservice = {
	setting: {
		bgru: "blue",        // background of table cell with automatically unchecked checkbox
		bgrc: "purple",      // background of table cell with automatically checked checkbox
		speeks: false,       // show alert if "automatically unchecked/checked" is changed
	},

	init: function() {
		// Select checkboxes
		var nodes = document.evaluate(
			"//span[@class='checkbox']/input[@type='checkbox']",
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null);
		var uncheckedservices = GM_getValue('cmkwatouncheckedservices','');
		var checkedservices = GM_getValue('cmkwatocheckedservices','');
		var myUArr = uncheckedservices.split(";");
		var myCArr = checkedservices.split(";");
		var i = 0;
		// Change style of checkboxes (grandparent) and set their dblclick-event
		for(var j = 0; j<nodes.snapshotLength; j++) {
			var thisNode = nodes.snapshotItem(j);
			var thisNodeName = thisNode.name;
			var hitU = myUArr.indexOf(thisNodeName);
			var hitC = myCArr.indexOf(thisNodeName);
			if (hitU !== -1) {
				i++;
				thisNode.checked = false;
				thisNode.parentNode.parentNode.setAttribute('style','background: ' + cmkwatouncheckservice.setting.bgru + ';');
			}
			if (hitC !== -1) {
				i++;
				thisNode.checked = true;
				thisNode.parentNode.parentNode.setAttribute('style','background: ' + cmkwatouncheckservice.setting.bgrc + ';');
			}
			thisNode.ondblclick=function(event) {
				event.preventDefault();
				event.stopPropagation();
				if (this.checked) {
					cmkwatouncheckservice.changecheck(this,'cmkwatocheckedservices',true,cmkwatouncheckservice.setting.bgrc,'cmkwatouncheckedservices');
				} else {
					cmkwatouncheckservice.changecheck(this,'cmkwatouncheckedservices',false,cmkwatouncheckservice.setting.bgru,'cmkwatocheckedservices');
				}
			};
		}
		return i;
	},

	changecheck: function(ele,whichValue,forMsg,bg,otherValue) {
		var myServices = GM_getValue(whichValue,'');
		var otherServices = GM_getValue(otherValue,'');
		var myArr = myServices.split(";");
		var myOtherArr = otherServices.split(";");
		var hit = myArr.indexOf(ele.name);
		var hitOther = myOtherArr.indexOf(ele.name);
		if (hit === -1) {
			myServices = myServices + ";" + ele.name;
			if (cmkwatouncheckservice.setting.speeks) {
				alert("Next page load will set checked=" + forMsg + " for this input.");
			}
			ele.parentNode.parentNode.setAttribute('style','background: ' + bg + ';');
		}
		else {
			myArr.splice(hit, 1);
			myServices = myArr.join(';');
			if (cmkwatouncheckservice.setting.speeks) {
				alert("Next page load won't change checked status for this input anymore.");
			}
			ele.parentNode.parentNode.setAttribute('style','background: inherit;');
		}
		GM_setValue(whichValue,myServices);
		if (hitOther !==-1) {
			myOtherArr.splice(hit, 1);
			otherServices = myOtherArr.join(';');
			GM_setValue(otherValue,otherServices);
		}
	}
};

var setchkbx = cmkwatouncheckservice.init();
if (cmkwatouncheckservice.setting.speeks && setchkbx !==0) {
	alert("One or more (" + setchkbx + ") checkboxes were set automatically. Please save this configuration.");
}

