// ==UserScript==
// @name        MarscPanelManagerCopy
// @namespace   Marsc
// @author      Dolev
// @icon        http://marsc.ipanel.co.il/MARSC.NET.Hebrew/App_Themes/MARSC/images/favicon.ico
// @include     http://marsc.ipanel.co.il/MARSC.NET.Hebrew/PanelManagement/PanelManager.aspx?fkey=*
// @version     2.9
// @grant       Dolev
// @description Add a button that allow you to copy the information from the pages easily
// @downloadURL https://update.greasyfork.org/scripts/7289/MarscPanelManagerCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/7289/MarscPanelManagerCopy.meta.js
// ==/UserScript==

window.onload=function(){
	var headerBar = document.getElementById("headerbar");
	
	var DivElement = document.createElement("div");
	DivElement.setAttribute("class","loginstatus");
	DivElement.style.cssFloat = "right";
	DivElement.style.marginRight = "5px";
	DivElement.style.marginTop = "2px";
	
	var BtnCopyThisPage = document.createElement("input");
	BtnCopyThisPage.value = "Copy page";
	BtnCopyThisPage.type = "button";
	BtnCopyThisPage.setAttribute("class","button");
	BtnCopyThisPage.style.width = "95px";
	
	BtnCopyThisPage.onclick=function(){
		CopyThisPageInfo();
	};
	
	var BtnOpneCopyWindow = document.createElement("input");
	BtnOpneCopyWindow.value = "Open copy panel";
	BtnOpneCopyWindow.type = "button";
	BtnOpneCopyWindow.setAttribute("class","button");
	BtnOpneCopyWindow.style.width = "95px";
	
	
	BtnOpneCopyWindow.onclick=function(){
		document.getElementById("CopyInfoPopup").style.display = "block";
		document.getElementById("CopyToTextArea").select();
	};
	
	var BtnCopyToMemory = document.createElement("input");
	BtnCopyToMemory.value = "Copy to memory";
	BtnCopyToMemory.type = "button";
	BtnCopyToMemory.setAttribute("class","button");
	BtnCopyToMemory.style.width = "95px";
	BtnCopyToMemory.style.marginRight = "5px";
	
	BtnCopyToMemory.onclick=function(){
		var TextAreaElement = document.getElementById("CopyToTextArea");
		TextToCopy(TextAreaElement);
		document.getElementById("CopyToTextArea").select();
	};
	
	document.getElementById("container").appendChild(BuildingPopupElement());
	
	//DivElement.appendChild(BtnCopyToMemory);
	//DivElement.appendChild(BtnCopyThisPage);
	DivElement.appendChild(BtnOpneCopyWindow);
	headerBar.appendChild(DivElement);
};

function CopyThisPageInfo(){
	var TextAreaElement = document.getElementById("CopyToTextArea");
	TextToCopy(TextAreaElement);
	
	document.getElementById("CopyInfoPopup").style.display = "block";
	document.getElementById("CopyToTextArea").select();
}

function TextToCopy(TextAreaElement){
	var InfoTable = document.getElementById("ctl00_cphMainContent_rgPreview_ctl00").childNodes[4];
	var TempString = "";
	
	for (i = 0; i < InfoTable.childNodes.length; i++) {
		if (InfoTable.childNodes[i].tagName !== undefined){
			if(InfoTable.childNodes[i].tagName.toUpperCase().indexOf("TR") > -1){
				for(j = 0; j < InfoTable.childNodes[i].childNodes.length; j++){
					if(InfoTable.childNodes[i].childNodes[j].tagName !== undefined){
						if(InfoTable.childNodes[i].childNodes[j].innerHTML.toString().toUpperCase().indexOf("INPUT") == -1){
							if(InfoTable.childNodes[i].childNodes[j].innerHTML.toString().toUpperCase().indexOf("FALSE") == -1){
								TextAreaElement.value += InfoTable.childNodes[i].childNodes[j].innerHTML;
								TextAreaElement.value += "\t";
							}
						}
					}
				}
				TextAreaElement.value = TextAreaElement.value.substring(0, TextAreaElement.value.length - 1)
				TextAreaElement.value += "\n";
			}
		}
	}
}

function BuildingPopupElement(){
	var backgroundElemnt = document.createElement("div");
	backgroundElemnt.style.position = "fixed";
	backgroundElemnt.style.left = "0px";
	backgroundElemnt.style.top = "0px";
	backgroundElemnt.style.zIndex = "8999";
	backgroundElemnt.style.backgroundColor = "#AAA";
	backgroundElemnt.style.opacity = "0.5";
	backgroundElemnt.style.width = "1600px";
	backgroundElemnt.style.height = "808px";

	var DivElement = document.createElement("div");
	DivElement.id = "CopyInfoPopup";
	DivElement.style.display = "none";
	DivElement.style.position = "absolute";
	DivElement.style.width = "500px";
	DivElement.style.height = "500px";
	DivElement.style.left = "20%";
	DivElement.style.top = "20%";
	DivElement.style.backgroundColor = "#DBDBDB";
	DivElement.style.border = "5px solid rgb(193,194,170)";
	DivElement.style.borderRadius = "5px";
	DivElement.style.zIndex = "9000";
	
	var UpperWindow = document.createElement("div");
	UpperWindow.style.width = "100%";
	UpperWindow.style.height = "27px";
	UpperWindow.style.backgroundImage = "url('http://marsc.ipanel.co.il/MARSC.NET.Hebrew/App_Themes/MARSC/Window/WindowCornerSprites.gif')";
	UpperWindow.style.backgroundPosition = "0px -5px";
	UpperWindow.style.zIndex = "9001";
	
	var ExitButton = document.createElement("span");
	ExitButton.style.width = "30px";
	ExitButton.style.height = "21px";
	ExitButton.style.top = "2px";
	ExitButton.style.right = "2px";
	ExitButton.style.backgroundImage = "url('http://marsc.ipanel.co.il/MARSC.NET.Hebrew/App_Themes/MARSC/Window/CommandSprites.gif')";
	ExitButton.style.backgroundPosition = "-174px 0px";
	ExitButton.style.position = "absolute";
	ExitButton.style.zIndex = "9002";
	
	ExitButton.onclick=function(){
		document.getElementById("CopyInfoPopup").style.display = "none";
	};
	
	ExitButton.onmouseover=function(){
		ExitButton.style.backgroundPosition = "-174px -21px";
	};
	
	ExitButton.onmouseleave=function(){
		ExitButton.style.backgroundPosition = "-174px 0px";
	};
	
	var TextareaElement = document.createElement("textarea");
	TextareaElement.id = "CopyToTextArea";
	TextareaElement.style.width = "475px";
	TextareaElement.style.height = "420px";
	TextareaElement.style.position = "absolute";
	TextareaElement.style.top = "35px";
	TextareaElement.style.left = "10px";
	TextareaElement.readOnly = true;
	TextareaElement.style.resize = "none";
	TextareaElement.style.backgroundColor = "white";
	
	var SelectAllButton = document.createElement("input");
	SelectAllButton.value = "Select All";
	SelectAllButton.type = "button";
	SelectAllButton.setAttribute("class","button");
	SelectAllButton.style.width = "70px";
	SelectAllButton.style.top = "470px";
	SelectAllButton.style.left = "240px";
	SelectAllButton.style.position = "absolute";
	
	SelectAllButton.onclick=function(){
		document.getElementById("CopyToTextArea").select();
	};
	
	var CloseButton = document.createElement("input");
	CloseButton.value = "Close";
	CloseButton.type = "button";
	CloseButton.setAttribute("class","button");
	CloseButton.style.width = "50px";
	CloseButton.style.top = "470px";
	CloseButton.style.right = "10px";
	CloseButton.style.position = "absolute";
	
	CloseButton.onclick=function(){
		document.getElementById("CopyInfoPopup").style.display = "none";
	};
	
	var ClearButton = document.createElement("input");
	ClearButton.value = "Clear";
	ClearButton.type = "button";
	ClearButton.setAttribute("class","button");
	ClearButton.style.width = "50px";
	ClearButton.style.top = "470px";
	ClearButton.style.right = "65px";
	ClearButton.style.position = "absolute";
	
	ClearButton.onclick=function(){
		document.getElementById("CopyToTextArea").value = "";
	};
	
	var CopyThisPageButton = document.createElement("input");
	CopyThisPageButton.value = "Copy this";
	CopyThisPageButton.type = "button";
	CopyThisPageButton.setAttribute("class","button");
	CopyThisPageButton.style.width = "60px";
	CopyThisPageButton.style.top = "470px";
	CopyThisPageButton.style.left = "10px";
	CopyThisPageButton.style.position = "absolute";
	
	CopyThisPageButton.onclick=function(){
		var TextAreaElement = document.getElementById("CopyToTextArea");
		TextToCopy(TextAreaElement);
		document.getElementById("CopyToTextArea").select();
	};
	
	var GotoNextPageButton = document.createElement("input");
	GotoNextPageButton.value = "Copy next";
	GotoNextPageButton.type = "button";
	GotoNextPageButton.setAttribute("class","button");
	GotoNextPageButton.style.width = "65px";
	GotoNextPageButton.style.top = "470px";
	GotoNextPageButton.style.left = "75px";
	GotoNextPageButton.style.position = "absolute";
	
	GotoNextPageButton.onclick=function(){
		document.getElementsByClassName("PagerNextImg")[0].click();
		setTimeout(function(){ 		
		var TextAreaElement = document.getElementById("CopyToTextArea");
		TextToCopy(TextAreaElement);
		document.getElementById("CopyToTextArea").select();
		}, 500);
	};
	
	var CopyXPages = document.createElement("input");
	CopyXPages.value = "Copy X pages";
	CopyXPages.type = "button";
	CopyXPages.setAttribute("class","button");
	CopyXPages.style.width = "90px";
	CopyXPages.style.top = "470px";
	CopyXPages.style.left = "145px";
	CopyXPages.style.position = "absolute";
	
	CopyXPages.onclick=function(){
		var number = prompt("Enter the number of pages you want to copy", "number of pages");
		TimeoutLoop(parseInt(number));
	};
	
	
	UpperWindow.appendChild(ExitButton);
	DivElement.appendChild(UpperWindow);
	DivElement.appendChild(TextareaElement);
	
	DivElement.appendChild(CopyThisPageButton);
	DivElement.appendChild(GotoNextPageButton);
	DivElement.appendChild(CopyXPages);
	DivElement.appendChild(SelectAllButton);
	DivElement.appendChild(CloseButton);
	DivElement.appendChild(ClearButton);
	//DivElement.appendChild(backgroundElemnt);
	
	return DivElement;
}

function TimeoutLoop(index){
	if(index != 0){
		setTimeout(function(){	 		
			var TextAreaElement = document.getElementById("CopyToTextArea");
			TextToCopy(TextAreaElement);
			document.getElementById("CopyToTextArea").select();
			document.getElementsByClassName("PagerNextImg")[0].click();
			return TimeoutLoop(--index);
		}, 500);
	}
	return;
}