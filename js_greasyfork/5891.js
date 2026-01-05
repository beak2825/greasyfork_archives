// ==UserScript==
// @name        Timesheet
// @namespace   http://geosolve.co.nz
// @description Add options to workflowmax.com timesheet
// @include     https://app.my.workflowmax.com/my/timesheet.aspx?*tab=weekly*
// @include		https://app.my.workflowmax.com/financial/resourcetimesheet.aspx?*mode=weekly*
// @version     1.6.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5891/Timesheet.user.js
// @updateURL https://update.greasyfork.org/scripts/5891/Timesheet.meta.js
// ==/UserScript==

//window.addEventListener ("load", Greasemonkey_main, false);
Greasemonkey_main();

function Greasemonkey_main () {
  var bDebug = false;
    try {var baseURL = window.location.href.split("?")[0];} catch(err) {console.log(err.message);}
    console.log(window.location.href);
    console.log(baseURL);
  var isSort;
    var isSortque
    if (isSort = getQueryVariable("sort")) {
     	isSortque = 'sort=' + isSort + '&';
    } else {
    isSortque = "";
  }
  var isID;
    var isIDque;
    if (isID = getQueryVariable("id")) {
     	isIDque = 'id=' + isID + '&';
    } else {
    isIDque = "";
  }
  var isTab;
  var isTabque;
    if (isTab = getQueryVariable("tab")) {
     	isTabque = 'tab=' + isTab + '&';
    } else {
    isTabque = "";
  }
    var isFilter;
  var isFilterque;
    if (isFilter = getQueryVariable("filter")) {
     	isFilterque = 'filter=' + isFilter + '&';
    } else {
    isFilterque = "";
  }
    var isMode;
    var isModeque;
    if (isMode = getQueryVariable("mode")) {
     	isModeque = 'mode=' + isMode + '&';
    } else {
    isModeque = "";
  }
  var isDrop;
  var isDropque; 
  if (isDrop = getQueryVariable("drop")) {
     isDropque = 'drop=' + isDrop + '&';  
  } else {
    isDropque = "";  
  }
  var head = document.getElementsByClassName("heading");
  var jobCol = head[0].getElementsByClassName("time-job");
  var isDate = "";
  var isDateque;
  isDate = getQueryVariable("date");
  if (isDate != "") {
   	isDateque = 'date=' + isDate + '&';
  } else {
    isDateque = "";
  }
  head[0].getElementsByClassName("time-job")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=job">Job/Task</a>');
  head[0].getElementsByClassName("time-job")[0].title = "Sort by Job Number."
  head[0].getElementsByClassName("time-client")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=client">Client</a>');
  head[0].getElementsByClassName("time-client")[0].title = "Sort by Client name."
  head[0].getElementsByClassName("total-heading")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=total">Total</a>');  
  head[0].getElementsByClassName("total-heading")[0].title = "Sort by total hours.";
  var panel = document.getElementsByClassName("ButtonPanel")[0];
    
 var buttonText = 'Order Job List by: <a href="' + baseURL + '?' + isIDque + isDateque + isTabque + isModeque + isFilter + '">Job</a>, <a href="' + baseURL + '?' + isIDque + isDateque + isTabque + isModeque + isFilter + 'drop=name">Job Name</a>, <a href="' + baseURL + '?' + isIDque + isDateque + isTabque + isModeque + isFilter + 'drop=client">Client</a><br>';
  panel.innerHTML = buttonText + panel.innerHTML + '<br><a href="http://dunprojtrack.geosolve.local/timesheet.php" target="_blank">To Timesheet Guide</a>';
    
    //sort job dropdown
	var i;
    var tempHold;
    if (isDrop) {
        var jobDropbox = document.getElementById('ctl00_PageContent_ctlxlayoutJob');
     	var jobDrop = document.getElementById('ctl00_PageContent_ctlxlayoutJob').children;
        var innerJob;
		var arrDrop = new Array(1);
        for (i = 0; i < jobDrop.length; i++) {
            innerDrop = jobDrop[i].innerHTML.split(" - ");
            if (isDrop == "client") {
                if (innerDrop[2]) {
                    tempHold = innerDrop[2]; 
                    innerDrop[2] = innerDrop[0];
                    innerDrop[0] = tempHold;
                    jobDrop[i].innerHTML = innerDrop.join(" - ");
					arrDrop.push(i);
					arrDrop[i] = jobDrop[i];
                } 
            } else if (isDrop == "name") {
            	if (innerDrop[2]) {
                    tempHold = innerDrop[1]; 
                    innerDrop[1] = innerDrop[0];
                    innerDrop[0] = tempHold;
                    jobDrop[i].innerHTML = innerDrop.join(" - ");
					arrDrop.push(i);
					arrDrop[i] = jobDrop[i];
                } 
            }
        }
        arrDrop.sort(dropsort);
        for (i = arrDrop.length-1; i > -1 ; i--) {
            if (arrDrop[i+1]) {
        		if (bDebug == true) {
                    console.log(i);
                	console.log(arrDrop[i].innerHTML);
                	console.log(arrDrop[i+1].innerHTML);
                }
                try {jobDropbox.insertBefore(arrDrop[i],arrDrop[i+1]);} catch(err) {console.log(err.message);}
            }
        }
    }
    
  //figure out which sort we're using and set it all up to work
  var sortType = "time-job";
  var upDown = "Down";
  if (isSort == "job") {
    sortType = "time-job"
    head[0].getElementsByClassName("time-job")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=jobu">Job/Task</a>');
    upDown = "Down";
  } else if (isSort == "jobu") {
    sortType = "time-job"
    head[0].getElementsByClassName("time-job")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=job">Job/Task</a>');
    upDown = "Up";
  } else if (isSort == "client") {
    sortType = "time-client"
    head[0].getElementsByClassName("time-client")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=clientu">Client</a>');
    upDown = "Down";
  } else if (isSort == "clientu") {
    sortType = "time-client"
    head[0].getElementsByClassName("time-client")[0].innerHTML = ('<br><a href="' + baseURL + '?' + isIDque + isDateque + isDropque + isTabque + isModeque + isFilter + 'sort=client">Client</a>');
    upDown = "Up";
  } else if (isSort == "total") {
    sortType = "total-task"
    upDown = "Down";
  };
      
  var timeTable = document.getElementById("ctl00_PageContent_weeklyTimesheetSummaryTable");
  if (bDebug == true) {
   var banner = document.getElementsByClassName("MaxBanner");
      
  }
  
  var rows = timeTable.getElementsByClassName("summary-row");
  var notes = timeTable.children;
    if (bDebug == true) {console.log(notes.length);};
  
  
  var list = new Array(1);
  list[0] = new Array(4);
  for (i = 0; i <= rows.length-1; i++) {
    if (bDebug == true) {console.log(i);}
    list.push(i);
    list[i] = new Array(4);
    list[i][0] = i;
    list[i][1] = rows[i];    
    if (bDebug == true) {console.log(typeof(list[i][1]));};
    list[i][2] = rows[i].getElementsByClassName(sortType)[0].innerHTML;
	list[i][3] = notes[i * 2 + 1];
    if (bDebug == true) {console.log(list[i][2]);};
    if (bDebug == true) {console.log(sortType);};
  }
    if (bDebug == true) {console.log(i);};
  try {list.splice(i,1);} catch(err) {console.log(err.message);};
   //debug output
  if (bDebug == true) {
    for (i = 0; i <= rows.length -1; i++) {
     banner[0].innerHTML += i;
     banner[0].innerHTML += list[i][2];
     
    }
    banner[0].innerHTML += list.length;
    banner[0].innerHTML += rows.length;
  }
  
  try {if (isSort=="total") {
    if (bDebug == true) {console.log('isSort="total"');};
    list.sort(time);
  } else if(isSort.charAt(isSort.length-1) == "u") {
    if (bDebug == true) {console.log('isSort.charAt(isSort.length-1) == "u"');};
    list.sort(compareu);
  } else {
    if (bDebug == true) {console.log('else');};
    list.sort(compare);
  } } catch (err){console.log(err.message);};
  
  
  for (i = 0; i <= rows.length-1; i++) {
    if (bDebug == true) {console.log(i);}
    if (bDebug == true) {console.log(list[i][2]);};
    if (i == 0) {
     
    } else {
      if (bDebug == true) {console.log(typeof(list[i][0]));};
      if (bDebug == true) {console.log(typeof(list[i][1]));};
      try {timeTable.insertBefore(list[i][1],list[i-1][1]);} catch(err) {console.log(err.message);}
	try {timeTable.insertBefore(list[i][3],list[i][1].nextSibling);} catch(err) {console.log(err.message);}
    }
  }
}

function compare(a,b) {
  //compare A > Z
  var result = a[2].localeCompare(b[2]);
  if (result == -1) {result = 1} else if (result == 1) {result = -1};
  return result;
  //return "-1";
};

function compareu(a,b) {
  //compare A > Z
  var result = a[2].localeCompare(b[2]);
  return result;
  //return "-1";
};

function time(a,b) {
  var a2 = parseFloat(a[2].replace(":","."));
  var b2 = parseFloat(b[2].replace(":","."));
  return a2 > b2 ? 1 : a2 < b2 ? -1 : 0;
};

function dropsort(a,b) {
	return a.innerHTML.localeCompare(b.innerHTML);
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return("");
};