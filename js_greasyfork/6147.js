// ==UserScript==
// @name          Approval Time
// @description   Displays the auto-approval time
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/continue*
// @include       https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/submit
// @include       https://www.mturk.com/mturk/return*
// @version       1.1
// @author        Aphit and turkedup
// @namespace     Aphit
// @downloadURL https://update.greasyfork.org/scripts/6147/Approval%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/6147/Approval%20Time.meta.js
// ==/UserScript==

var Hit = /accept/gi;
var Page_Status = document.forms[1].action;
if(Page_Status.search(Hit) != 1) {
	insertID2(findID2());
	}
	
function findID2() {
	var inputfields = document.getElementsByTagName("INPUT");
	results = "";
	for(var i = 0;i < inputfields.length;i++) {
		if(inputfields[i].name == "hitAutoAppDelayInSeconds") {
			results = inputfields[i].value;
			break;
		}
	}
	return results;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function insertID2(AutoAppTime) {

	var title = document.createElement("TD");
	title.setAttribute('class','capsule_field_title');
	title.appendChild(document.createTextNode("\u00a0Auto-Approval:"))

	var days = (AutoAppTime/86400).toFixed(2);
	var mins = ((AutoAppTime/86400)*1440);

	var time = document.createElement("TD");

	time.appendChild(document.createTextNode("\u00a0\u00a0\u00a0\u00a0" + days +" Days (" + mins + " Mins)"))

	var firstElement = document.getElementById("requester.tooltip");

	insertAfter(firstElement.parentNode.parentNode, time);
	insertAfter(firstElement.parentNode.parentNode, title);

}