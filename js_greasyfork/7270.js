// ==UserScript==
// @name        DaimentionPercentCalculation
// @namespace   Daimention
// @author      Dolev
// @icon        http://oi59.tinypic.com/2urnyuq.jpg
// @include     http://192.117.187.161/SPSSMR/ReviewQuotas/main.aspx?hash=ApplicationUtils
// @include     http://213.8.196.44/SPSSMR/ReviewQuotas/main.aspx?hash=ApplicationUtils
// @version     2.8
// @grant       Dolev
// @description Add a button that calculate the percents you neet to send to by the total target
// @downloadURL https://update.greasyfork.org/scripts/7270/DaimentionPercentCalculation.user.js
// @updateURL https://update.greasyfork.org/scripts/7270/DaimentionPercentCalculation.meta.js
// ==/UserScript==

window.onload=function(){
	AddInputs();
};

function AddInputs(){
	var TopFrame = window.frames[2].document.getElementById("AutoNumber1");
	
	var NeedToCompleteSpan = document.createElement("span");
	NeedToCompleteSpan.id = "NeedToCompleteSpan";
	NeedToCompleteSpan.innerHTML = "Need To Complete: ";
	NeedToCompleteSpan.style.fontSize = "10pt";
	NeedToCompleteSpan.style.marginLeft = "5px";
	NeedToCompleteSpan.style.marginTop = "5px";
	NeedToCompleteSpan.style.display = "none";
	
	var TitleSpan = document.createElement("span");
	TitleSpan.innerHTML = "Target Total Value:";
	TitleSpan.style.fontSize = "10pt";
	TitleSpan.style.marginLeft = "5px";
	TitleSpan.style.marginTop = "5px";
	
	var TargetValue = document.createElement("input");
	TargetValue.type = "text";
	TargetValue.id = "TargetValueText";
	TargetValue.style.width = "95px";
	TargetValue.style.fontSize = "10pt";
	TargetValue.style.marginLeft = "5px";
	TargetValue.style.marginTop = "5px";
	
	var CalculateButton = document.createElement("input");
	CalculateButton.value = "Calculate Now";
	CalculateButton.type = "button";
	CalculateButton.id = "CalculateButton";
	CalculateButton.setAttribute("class","QuotaSelectionButton");
	CalculateButton.style.width = "105px";
	CalculateButton.style.height = "25px";
	CalculateButton.style.marginLeft = "5px";
	CalculateButton.style.marginTop = "5px";
	
	var WrongCalculationText = document.createElement("input");
	WrongCalculationText.type = "text";
	WrongCalculationText.id = "WrongCalculationText";
	WrongCalculationText.style.width = "95px";
	WrongCalculationText.style.fontSize = "10pt";
	WrongCalculationText.style.marginLeft = "5px";
	WrongCalculationText.style.marginTop = "5px";
	WrongCalculationText.style.display = "none";
	
	var WrongCalculationButton = document.createElement("input");
	WrongCalculationButton.value = "Calculate again";
	WrongCalculationButton.type = "button";
	WrongCalculationButton.id = "WrongCalculationButton";
	WrongCalculationButton.setAttribute("class","QuotaSelectionButton");
	WrongCalculationButton.style.width = "105px";
	WrongCalculationButton.style.height = "25px";
	WrongCalculationButton.style.marginLeft = "5px";
	WrongCalculationButton.style.marginTop = "5px";
	WrongCalculationButton.style.display = "none";
	
	CalculateButton.onclick=function(){
		FindMax();
		window.frames[2].document.getElementById("NeedToCompleteSpan").style.display = "inline";
		window.frames[2].document.getElementById("NeedToCompleteSpan").innerHTML = "Need To Complete: " + globalNeedToComplete;
		window.frames[2].document.getElementById("WrongCalculationText").style.display = "inline";
		window.frames[2].document.getElementById("WrongCalculationButton").style.display = "inline";
		AddCalculationValues();
	};
	
	WrongCalculationButton.onclick=function(){
		globalNeedToComplete = parseFloat(window.frames[2].document.getElementById("WrongCalculationText").value);
		window.frames[2].document.getElementById("NeedToCompleteSpan").innerHTML = "Need To Complete: " + globalNeedToComplete;
		AddCalculationValues();
	};
	
	
	var BrokenLineElement = document.createElement("br");
	
	TargetValue.onkeypress=function(e){
		if (e.which == 13 || e.keyCode == 13){
			AddCalculationValues();
		}
	};
	
	//TopFrame.appendChild(TitleSpan);
	//TopFrame.appendChild(TargetValue);
	TopFrame.appendChild(CalculateButton);
	TopFrame.appendChild(NeedToCompleteSpan);
	TopFrame.appendChild(BrokenLineElement);
	TopFrame.appendChild(WrongCalculationText);
	TopFrame.appendChild(WrongCalculationButton);
	//TopFrame.appendChild(NeedToCompleteSpan);
}

function AddCalculationValues(){
	var frameValuesText = window.frames[3].document.getElementsByClassName("ValuesText");
	var tbodyElement;
	var TargetText, CompleteText;
	var TrElement;
	var NeedToCompleteTD , NeedToCompletePercentTD;
	var NeedToComplete , NeedToCompletePercent;
	
	if (frameValuesText.length > 0 && frameValuesText[0].firstChild.firstChild.childNodes.length < 4){
		for (i = 0; i < frameValuesText.length; i++) { 
			TrElement = document.createElement("tr");
			NeedToCompleteTD = document.createElement("td");
			NeedToCompletePercentTD = document.createElement("td");
			NeedToCompleteTD.style.fontSize = "8pt";
			NeedToCompletePercentTD.style.fontSize = "8pt";
			NeedToCompleteTD.style.color = "red";
			NeedToCompletePercentTD.style.color = "red";
			NeedToCompleteTD.style.textAlign = "right";
			NeedToCompletePercentTD.style.textAlign = "right";
		
			tbodyElement = frameValuesText[i].firstChild.firstChild;

			TargetText = parseFloat(tbodyElement.childNodes[0].firstChild.innerHTML);
			CompleteText = parseFloat(tbodyElement.childNodes[1].firstChild.innerHTML);
			NeedToComplete = TargetText - CompleteText;
			NeedToCompletePercent = parseInt(NeedToComplete * 100 / globalNeedToComplete);
			
			NeedToCompleteTD.innerHTML = NeedToComplete;
			NeedToCompletePercentTD.innerHTML = NeedToCompletePercent + "%";
			
			TrElement.appendChild(NeedToCompleteTD);
			TrElement.appendChild(NeedToCompletePercentTD);
			tbodyElement.appendChild(TrElement);
		}
	}else if(frameValuesText.length > 0 && frameValuesText[0].firstChild.firstChild.childNodes.length == 4){
		for (j = 0; j < frameValuesText.length; j++) {
			tbodyElement = frameValuesText[j].firstChild.firstChild;
			tbodyElement.childNodes[3].remove();
		}
		AddCalculationValues();
	}
}

var globalTargetText;
var globalCompleteText;
var globalNeedToComplete;

function FindMax(){
	var frameValuesText = window.frames[3].document.getElementsByClassName("ValuesText");
	var tbodyElement;
	var max = -1;
	
	for (i = 0; i < frameValuesText.length; i++) { 
		tbodyElement = frameValuesText[i].firstChild.firstChild;
		globalTargetText = parseFloat(tbodyElement.childNodes[0].firstChild.innerHTML);
		if(globalTargetText > max){
			max = globalTargetText
			globalCompleteText = parseFloat(tbodyElement.childNodes[1].firstChild.innerHTML);
			globalNeedToComplete = globalTargetText - globalCompleteText;
		}
	}
}