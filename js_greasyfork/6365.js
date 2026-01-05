// ==UserScript==
// @name        Improve Mantis
// @namespace   com.aforms2web.ds.ujs
// @description To customize and improve our a2w-mantis
// @include     http*://tasks.aforms2web.com/view_all_bug_page.php*
// @author      dietmar.stoiber@aforms2web.com
// @version     1.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6365/Improve%20Mantis.user.js
// @updateURL https://update.greasyfork.org/scripts/6365/Improve%20Mantis.meta.js
// ==/UserScript==


// Config Begin

var countSelection = true;

var xForCurIterationCommit = true;
var xForCurIterationCommitStyle = "padding-left: 1em; font-size: 1.5em; font-weight: smaller; color:#333333;";

var grayNotCurrentlyCommited = true;
var grayNotCurrentlyCommitedAll = "font-style: italic;";
var grayNotCurrentlyCommitedLinks = "";

var formatDeadline = true;
var formatDeadlineStylePast  = "font-weight: bold; color: #dd0000; text-decoration: underline;";
var formatDeadlineStyleToday  = "font-weight: bold; color: #cc5500; text-decoration: underline;";
var formatDeadlineStyleTomorrow  = "font-weight: bold; bold; color: #cc5500;";
var formatDeadlineStyleThisWeek  = "color: #cc5500;";
var formatDeadlineStyleIteration  = "color: #008800;";
var formatDeadlineStyleFuture  = "";

var activateFixedTime = true;
var activateFixedTimeShowByDefault = true;
var activateFixedTimeStyle = "border: 1px solid #646474; border-top-width: 0; border-radius: 0 0 5px 5px; background-color: #c8c8e8; position: fixed; top: 0; padding: 0 3px";

var selectionOfAllCommited = true;
var selectionOfAllCommitedExceptWaiting = true;

// Hint: xForCurIterationCommit, grayNotCurrentlyCommited and selectionOfAllCommited only works if target-iteration and commited-istaration cols are displayed

// Config End










var iterationColNr = null;
var deadlineColNr = null;
var commitmentColNr = null;
var stateColNr = null;

var hourColNrs = null;
var hourColSum = null;
var hourColTot = null;

var fixedTimeIsDisplayed = false;
init();

function init(){
	var header = document.getElementsByClassName("row-category")[0];
	for(var h = 0; h < header.cells.length; h++){
		var curHeaderCell = header.cells[h];
		var colLinks = curHeaderCell.getElementsByTagName("a");
		if(colLinks.length > 0){
			var linkLabel = colLinks[0].innerHTML;
			if("Zieltermin" == linkLabel){ deadlineColNr = h; }
			if("Zieliteration" == linkLabel){ iterationColNr = h; }
			if("Status" == linkLabel){ stateColNr = h; }
			if("Commitment in" == linkLabel){
				commitmentColNr = h;
				colLinks[0].setAttribute("style", "white-space: nowrap;");
			}
			var pos = linkLabel.search(/.+\sh$/);
			if(pos > -1){
				if(hourColNrs == null){
					hourColNrs = new Array();
					hourColSum = new Array();
					hourColTot = new Array();
				}
				var nextIndex = hourColNrs.length;
				hourColNrs[nextIndex] = h;
				hourColSum[nextIndex] = 0;
				var matchTime = curHeaderCell.innerHTML.match(/\((.*)\)$/);
				if(countSelection && matchTime){
					curHeaderCell.innerHTML = 
						curHeaderCell.innerHTML.substring(0, curHeaderCell.innerHTML.length - RegExp.$1.length - 2) + 
							"<span id=\"timeOf" + h + "\" style=\"white-space: nowrap; font-weight: normal;\"><span id=\"selectOf" + h + "\">0</span> / " + RegExp.$1 + "</span>";
					hourColTot[nextIndex] = RegExp.$1;
				}
				colLinks[0].setAttribute("style", "white-space: nowrap;");
			}
		}
	}
	
	if(selectionOfAllCommited && iterationColNr != null && commitmentColNr != null){
		var selectAllCommits = document.createElement("span");
		selectAllCommits.addEventListener ('click', selectAllCommited, true);
		selectAllCommits.setAttribute("title", "alle commiteten Tickets selektieren"); 	
		selectAllCommits.setAttribute("style", "font-weight: normal; cursor: pointer;"); 	
		selectAllCommits.innerHTML = "[x]";
	
		header.cells[0].removeChild(header.cells[0].firstChild);
		header.cells[0].appendChild(selectAllCommits);
	}

	var table = document.getElementById("buglist");
	for(var r = 0; r < table.rows.length; r++){
		var row = table.rows[r];
		if(row.getAttribute("bgcolor") != null && row.getAttribute("valign") == "top" && row.getAttribute("border") == "1"){
			format(row);
			if(countSelection){
				var chkbxs = row.getElementsByTagName("input");
				for(var i = 0; i < chkbxs.length; i++){
					var chkbx = chkbxs[i];
					if(chkbx.getAttribute("name") == "bug_arr[]" && chkbx.getAttribute("type") == "checkbox"){
						chkbx.addEventListener ('change', changedChkbx, true);
					}
				}
			}
		}
	}

	if(countSelection){
		var allBugs = document.getElementsByName("all_bugs");
		if(allBugs != null && allBugs.length >= 1){
			allBugs[0].addEventListener ('change', recalculateChkbxs, true);
		}
	}

	if(activateFixedTime){
		var showFixed = document.createElement("span");
		showFixed.addEventListener ('click', showFixedTime, true);
		showFixed.id = "showFixedTime";
		showFixed.innerHTML = "Fix positionierte Zeitanzeige aktivieren";
		document.body.appendChild(showFixed);
		var hideFixed = document.createElement("span");
		hideFixed.setAttribute("style", "display: none;");
		hideFixed.addEventListener ('click', hideFixedTime, true);
		hideFixed.id = "hideFixedTime";
		hideFixed.innerHTML = "Fix positionierte Zeitanzeige deaktivieren";
		document.body.insertBefore(hideFixed, document.body.firstChild);
	
		var style = document.createElement("style");
		style.appendChild(document.createTextNode(""));// WebKit hack 
		document.head.appendChild(style);
		var sheet = style.sheet;
		sheet.insertRule(".fixedTime { " + activateFixedTimeStyle + " }", 0);
		sheet.insertRule("#showFixedTime, #hideFixedTime { text-decoration: underline; cursor: pointer; }", 0);

		if(activateFixedTimeShowByDefault){
			showFixedTime();
		}
	}
}

function showFixedTime(){
	document.getElementById("showFixedTime").setAttribute("style", "display: none;");
	document.getElementById("hideFixedTime").setAttribute("style", "display: inline;");
	for(i = 0; i < hourColNrs.length; i++){
		var newFixed = document.createElement("span");
		newFixed.setAttribute ("class", "fixedTime");
		newFixed.id = "fixedTime" + hourColNrs[i];
		newFixed.innerHTML = "x";
		document.body.appendChild(newFixed);
	}
	fixedTimeIsDisplayed = true;
	updateFixedTime();
}

function updateFixedTime(){
	if(fixedTimeIsDisplayed){
		var source; var target;
		for(i = 0; i < hourColNrs.length; i++){
			source = document.getElementById("timeOf" + hourColNrs[i]);
			target = document.getElementById("fixedTime" + hourColNrs[i]);
			target.innerHTML = source.innerHTML.replace(/<(?:.|\n)*?>/gm, '');
			
			var rect = source.getBoundingClientRect();
			target.setAttribute("style", "left: " + rect.left + "px; width: " + (rect.right-rect.left) + "px;");
			
		}
	}
}

function hideFixedTime(){
	document.getElementById("showFixedTime").setAttribute("style", "display: inline;");
	document.getElementById("hideFixedTime").setAttribute("style", "display: none;");
	var rmv;	
	for(i = 0; i < hourColNrs.length; i++){
		rmv = document.getElementById("fixedTime" + hourColNrs[i]);
		rmv.parentNode.removeChild(rmv);
	}
	fixedTimeIsDisplayed = false;
}

function format(row){
	if(deadlineColNr != null && row.cells.length >= deadlineColNr + 1){
		var deadline = row.cells[deadlineColNr].innerHTML;
		if(formatDeadline && deadline != null && deadline != ""){
			var iterationEnd = row.cells[iterationColNr].innerHTML;
			var iterationEndParts = iterationEnd.split("-")[1].split(")")[0].split(".");
			var iterationEndDate =  new Date("20" + iterationEndParts[2], Number(iterationEndParts[1])-1, iterationEndParts[0])
			var deadlineParts = deadline.split("-");
			var deadlineDate = new Date(deadlineParts[0], Number(deadlineParts[1])-1, deadlineParts[2]);
			var today = new Date();
			today.setHours(0,0,0,0);
			var tomorrow = new Date();
			tomorrow.setHours(0,0,0,0);
			tomorrow.setDate(tomorrow.getDate() + 1);
			var weekend =  new Date();
			weekend.setHours(0,0,0,0);
			weekend.setDate(weekend.getDate() - weekend.getDay() + 7);
			if(deadlineDate < today){
				row.cells[deadlineColNr].setAttribute("style", formatDeadlineStylePast);
			}else if(deadlineDate > iterationEndDate){
				row.cells[deadlineColNr].setAttribute("style", formatDeadlineStyleFuture);
			}else{
				if(+deadlineDate === +today){
					row.cells[deadlineColNr].setAttribute("style", formatDeadlineStyleToday);
				}else if(+deadlineDate === +tomorrow){
					row.cells[deadlineColNr].setAttribute("style", formatDeadlineStyleTomorrow);
				}else if(deadlineDate < weekend){
					row.cells[deadlineColNr].setAttribute("style", formatDeadlineStyleThisWeek);
				}else {
					row.cells[deadlineColNr].setAttribute("style", formatDeadlineStyleIteration);
				}
			}
		}
	}
	if(iterationColNr != null && row.cells.length >= iterationColNr + 1 && commitmentColNr != null && row.cells.length >= commitmentColNr + 1){
		var iterationat = row.cells[iterationColNr].innerHTML;
		var commitment = row.cells[commitmentColNr].innerHTML;
		if(grayNotCurrentlyCommited && iterationat != null && iterationat != "" && commitment != null && commitment != "" && iterationat != commitment){
			row.setAttribute("style", grayNotCurrentlyCommitedAll);
			for(c = 0; c < row.cells.length; c++){
				var links = row.cells[c].getElementsByTagName("a");
				for(var a = 0; a < links.length; a++){				
					links[a].setAttribute("style", grayNotCurrentlyCommitedLinks);
				}
			}
		}else if(xForCurIterationCommit && iterationat != null && iterationat != "" && commitment != null && commitment != "" && iterationat == commitment){
			row.cells[commitmentColNr].innerHTML = "<div style=\"" + xForCurIterationCommitStyle + "\">x</div>";
		}
	}
	
}

function changedChkbx(event) { 
	event = event || window.event
	var target = event.target;
	var parRow = target;
	while(parRow.nodeName != "TR" && parRow.parentNode != null){
		parRow = parRow.parentNode
	}
	calculateChangedChkbx(parRow, target);
}

function calculateChangedChkbx(row, checkbox) { 
	var curVal;
	var sumVal;
	var curObj;
	var display;
	for(i = 0; i < hourColNrs.length; i++){
		curVal = row.cells[hourColNrs[i]].innerHTML;
		sumVal = hourColSum[i];
		if(checkbox.checked){
			sumVal = Number(sumVal) + Number(curVal);
		}else{
			sumVal = sumVal - Number(curVal);
		}
		display = 0;
		if(sumVal > 0){
			hourColSum[i] = sumVal.toFixed(2);
			display = sumVal.toFixed(2);
			if(display != 0){
				display = display.replace(/0+$/, "").replace(/\.$/, "");
			}
		}else{
			hourColSum[i] = 0;
		}
		curObj = document.getElementById("selectOf" + hourColNrs[i]).innerHTML = display;
	}
	updateFixedTime();
}

function recalculateChkbxs() { 
	var checked = false;
	var display;
	var allBugs = document.getElementsByName("all_bugs");
	if(allBugs != null && allBugs.length >= 1){
		checked = allBugs[0].checked;
	}
	for(i = 0; i < hourColNrs.length; i++){
		if(checked){
			hourColSum[i] = hourColTot[i];
			display = hourColSum[i].replace(/0+$/, "").replace(/\.$/, "");
		}else{
			hourColSum[i] = 0;
			display = 0;
		}
		document.getElementById("selectOf" + hourColNrs[i]).innerHTML = display;
	}
	updateFixedTime();
}

function selectAllCommited(){
	var allBugs = document.getElementsByName("all_bugs");
	if(allBugs != null && allBugs.length >= 1){
		allBugs[0].checked = false;
	}			
	for(i = 0; i < hourColNrs.length; i++){
		hourColSum[i] = 0;
		display = 0;
		document.getElementById("selectOf" + hourColNrs[i]).innerHTML = display;
	}
	var table = document.getElementById("buglist");
	var iteration;
	var commitment;
	var checkbox;
	var curState
	for(var r = 0; r < table.rows.length; r++){
		var row = table.rows[r];
		if(row.getAttribute("bgcolor") != null && row.getAttribute("valign") == "top" && row.getAttribute("border") == "1"){
			if(iterationColNr != null && commitmentColNr != null && row.cells.length >= commitmentColNr + 1){
				iteration = row.cells[iterationColNr].innerHTML;
				commitment = row.cells[commitmentColNr].innerHTML;
				checkbox = row.getElementsByTagName("input");
				if(checkbox.length > 0){
					checkbox[0].checked = false;
					if(iteration != null && iteration != "" && commitment != null && commitment != "" && (iteration == commitment || commitment.indexOf(">x<") > 0)){
						if(!selectionOfAllCommitedExceptWaiting || "Warten" != row.cells[stateColNr].getElementsByTagName("span")[0].innerHTML){
							checkbox[0].checked = true;
							calculateChangedChkbx(row, checkbox[0]); 
						}
					}
				}
			}
		}
	}



	

}