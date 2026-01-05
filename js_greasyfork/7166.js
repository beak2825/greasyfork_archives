// ==UserScript==
// @name        MarscCalculation
// @namespace   Marsc
// @author      Dolev
// @icon        http://marsc.ipanel.co.il/MARSC.NET.Hebrew/App_Themes/MARSC/images/favicon.ico
// @include     http://marsc.ipanel.co.il/MARSC.NET.Hebrew/SampleManager/SampleDetails.aspx?id=*
// @version     3.2
// @grant       Dolev
// @description Calculate the percents in MARSC by the amount of emails you want to send
// @downloadURL https://update.greasyfork.org/scripts/7166/MarscCalculation.user.js
// @updateURL https://update.greasyfork.org/scripts/7166/MarscCalculation.meta.js
// ==/UserScript==

window.onload=function(){
	AddCalculationElement();
};

document.getElementById("RAD_SPLITTER_ctl00_RadSplitter1").onclick=function(){
	AddCalculationElement();
};

function AddCalculationElement(){
	if(document.getElementById("CalculationValue")==null){
		var TdElement = document.createElement("td");
		var CalculationValue = document.createElement("span");
		CalculationValue.id= "CalculationValue";
		CalculationValue.style.color = "red";
		TdElement.appendChild(CalculationValue);
		var CalculatedTargetParent = document.getElementById("ctl00_cphMainContent_ParametersuserControl_txtCalculatedTarget").parentNode;
		CalculatedTargetParent.colSpan = "1";
		CalculatedTargetParent.parentNode.appendChild(TdElement);
		
		var TotalEmail = document.createElement("input");
		TotalEmail.type="text";
		TotalEmail.id="TotalEmail";
		TotalEmail.style.width = "95px";
		TotalEmail.style.height = "10px";
		TotalEmail.style.fontSize = "10px"
		CalculatedTargetParent.appendChild(TotalEmail);
		
		document.getElementById("ctl00_cphMainContent_ParametersuserControl_lblCalculatedTarget").innerHTML = "Emails to send:"
	}
	
	var	ResponseRate = document.getElementById("ctl00_cphMainContent_ParametersuserControl_udResponseRate_rntUpDown");
	var TargetInterviews = document.getElementById("ctl00_cphMainContent_ParametersuserControl_udTargetInterviews");
	var IncidenceRate = document.getElementById("ctl00_cphMainContent_ParametersuserControl_udIncidenceRate_rntUpDown");
	
	document.getElementById("ctl00_cphMainContent_ParametersuserControl_txtCalculatedTarget").style.display="none";
	
	ResponseRate.onchange=function(){ValueAsChange();};
	TargetInterviews.onchange=function(){ValueAsChange();};
	IncidenceRate.onchange=function(){ValueAsChange();};
	document.getElementById("TotalEmail").onchange=function(){BackCalculation(TargetInterviews,ResponseRate,IncidenceRate,this);};
	document.getElementById("TotalEmail").onkeypress=function(e){
		if (e.which == 13 || e.keyCode == 13){
			BackCalculation(TargetInterviews,ResponseRate,IncidenceRate,this);
		}
	};
	ValueAsChange();
	BackCalculation(TargetInterviews,ResponseRate,IncidenceRate,document.getElementById("TotalEmail"));
}

function ValueAsChange() {
	var	ResponseRate = parseFloat(document.getElementById("ctl00_cphMainContent_ParametersuserControl_udResponseRate_rntUpDown").value);
	var TargetInterviews = document.getElementById("ctl00_cphMainContent_ParametersuserControl_udTargetInterviews").value;
	TargetInterviews = replaceAll(TargetInterviews,",","");
	TargetInterviews = parseFloat(TargetInterviews);
	var IncidenceRate = parseFloat(document.getElementById("ctl00_cphMainContent_ParametersuserControl_udIncidenceRate_rntUpDown").value);
	var CalculationValue = document.getElementById("CalculationValue");
	
	document.getElementById("TotalEmail").value = (100/IncidenceRate)*(100/ResponseRate)*TargetInterviews
	CalculationValue.innerHTML = "Total: " + Math.round((100/IncidenceRate)*(100/ResponseRate)*TargetInterviews);
}

function BackCalculation(TargetInterviews,ResponseRate,IncidenceRate,TotalEmails){
	var TargetInterviewsValue = TargetInterviews.value;
	TargetInterviewsValue = replaceAll(TargetInterviewsValue,",","");
	TargetInterviewsValue = parseFloat(TargetInterviewsValue);
	
	var TotalEmailsValue = parseFloat(TotalEmails.value);
	ResponseRate.value = Math.floor((10000*TargetInterviewsValue)/(100*TotalEmailsValue));
	if (ResponseRate.value < 1) {ResponseRate.value = 1;}
	IncidenceRate.value = Math.round((10000*TargetInterviewsValue)/(ResponseRate.value*TotalEmailsValue));
}

function replaceAll(theString,replaceThis,withThis) {
    while (theString.indexOf(replaceThis)>-1) {
      theString = theString.replace(replaceThis,withThis);
    }
    return theString;
}