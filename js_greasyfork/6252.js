// noticeMF.user.js
//
// Written by: Michael Devore
// Released to the public domain
//
// This is a Greasemonkey script.
// See http://www.greasespot.net/ for more information on Greasemonkey.
//
// ==UserScript==
// @name			noticeMF
// @namespace		http://www.devoresoftware.com/gm/noticeMF
// @description		highlight MetaFilter posts and comments containing user-specified text
// @match			https://*.metafilter.com/*
// @match			http://*.metafilter.com/*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setValue 
// @grant GM_getValue 
// @run-at document-end
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/6252/noticeMF.user.js
// @updateURL https://update.greasyfork.org/scripts/6252/noticeMF.meta.js
// ==/UserScript==
//

"use strict";

var theBorderWidth = "5px";

GM_addStyle('#div_configureHighlightBox{\
	position: fixed;\
	left: 50%;\
	margin-left: -11em;\
	bottom: 5px;\
	color: black;\
	background-color: white;\
	border: 2px green solid;\
	padding: 2px;\
	opacity: 0.95;\
}');
GM_addStyle('.textarea_configureHighlightBox{\
	width: 25em;\
	height: 8.34em;\
	margin-left: 5px;\
	margin-right: 5px;\
	border: 2px black solid;\
	color: black;\
	background-color: white;\
	white-space: pre;\
	word-wrap: normal;\
	overflow-x: scroll;\
}');
GM_addStyle('.header_configureHighlightBox, .text_configureHighlightBox{\
	text-align: center;\
}');
GM_addStyle('.button_configureHighlightBox{\
	display:block;\
	margin: 0 auto;\
}');

var aquaText = "aqua";
var blackText = "black";
var limeText = "lime";
var orangeText = "orange";
var pinkText = "pink";
var redText = "red";
var yellowText = "yellow";
var noneText = "none";
var blockText = "block";
var highlightList = new Array();
var highlightColor = redText;
 
function onLoaded()
{
	loadConfiguration();
	buildConfigureBox();
	performHighlight();
}

function loadConfiguration()
{
	var workString = GM_getValue("highlightList", "");
	if (workString.length > 0)
	{
		var workArray = workString.split(',');
		highlightList = [];
		for (var loop = 0; loop < workArray.length; loop++)
		{
			highlightList.push(decodeURIComponent(workArray[loop]));
		}
	}

	highlightColor = GM_getValue("highlightColor", redText);
}

function saveConfiguration()
{
	var div = $("#div_configureHighlightBox");
	div.style.display = noneText;

	var textArea = $("#highlightTextArea");
	var text;
	if (!textArea || !textArea.value)
	{
		text = "";
	}
	else
	{
		text = textArea.value.trim();
	}
	var highlightListArray = text.split("\n");

	highlightList = [];
	var tempArray = [];
	for (var loop = 0; loop < highlightListArray.length; loop++)
	{
		highlightList.push(highlightListArray[loop]);
		tempArray.push(encodeURIComponent(highlightListArray[loop]));
	}
	var tempString = tempArray.join(",");
	GM_setValue("highlightList", tempString);

	GM_setValue("highlightColor", highlightColor);
	location.reload();
}

function performHighlight()
{
	if (highlightList.length < 1)
	{
		// no filters
		return;
	}

	var xpath = "//DIV/SPAN[starts-with(text(),'posted by') and contains(@class, 'smallcopy')]";
	var postNodes = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	var total = postNodes.snapshotLength;
	for (var i = 0; i < total; i++)
	{
		// not much validation here, cuts performance overhead by avoiding extra tests against the nodes
		// tighten it down later if it conflicts with other add-ons or Metafilter bling
		var userSpan = postNodes.snapshotItem(i);
		var copyDiv = userSpan.parentNode;

		// check for match in text
		var highlightPost = false;
		var text = copyDiv.textContent;
		for (var j = 0; j < highlightList.length; j++)
		{
			var textPattern = new RegExp("\\b"+highlightList[j]+"\\b","i");
			if (text.match(textPattern))
			{
				highlightPost = true;
				break;
			}
		}
		if (highlightPost)
		{
			copyDiv.style.border = theBorderWidth+" "+highlightColor+" solid";
		}
	}
}

function buildConfigureBox()
{
	var mainDiv = document.createElement('div');
	mainDiv.id = "div_configureHighlightBox";
	var highlightTextArea = document.createElement('textarea');
	highlightTextArea.id = "highlightTextArea";
	highlightTextArea.className = "textarea_configureHighlightBox";
	var highlightListString = highlightList.join("\n");
	highlightTextArea.value = highlightListString;

	var h2 = document.createElement('h2');
	h2.className = "header_configureHighlightBox";
	h2.appendChild(document.createTextNode('Configure noticeMF'));
	mainDiv.appendChild(h2);

	var minorDiv = document.createElement('div');
	minorDiv.appendChild(document.createElement('br'));
	minorDiv.appendChild(document.createTextNode('Box outline a post or comment containing text'));
	minorDiv.appendChild(document.createElement('br'));
	minorDiv.appendChild(document.createTextNode('(one entry per line)'));
	minorDiv.appendChild(document.createElement('br'));
	minorDiv.appendChild(highlightTextArea);

	minorDiv.appendChild(document.createElement('br'));
	minorDiv.appendChild(document.createElement('br'));
	minorDiv.appendChild(document.createTextNode('Outline box color'));
	minorDiv.appendChild(document.createElement('br'));
	minorDiv.className = "text_configureHighlightBox";

	var select = document.createElement("select");
	for (var i = 0; i < 7; i++)
	{
		var option = document.createElement("option");
		var which;
		switch(i)
		{
			case 0:
				which = aquaText;
				break;
			case 1:
				which = blackText;
				break;
			case 2:
				which = limeText;
				break;
			case 3:
				which = orangeText;
				break;
			case 4:
				which = pinkText;
				break;
			case 5:
				which = redText;
				break;
			case 6:
			default:
				which = yellowText;
				break;
		}
		if (highlightColor == which)
		{
			option.selected = true;
		}
		else
		{
			option.selected = false;
		}
		option.id = "option_"+which;
		option.value = which;
		option.appendChild(document.createTextNode(which));
		select.appendChild(option);
	}
	minorDiv.appendChild(select);
	minorDiv.appendChild(document.createElement('br'));
	select.addEventListener('change', newColor, true);
	mainDiv.appendChild(minorDiv);

	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(document.createElement('br'));
	var saveNode = document.createElement("button");
	saveNode.appendChild(document.createTextNode("Save"));
	saveNode.className = "button_configureHighlightBox";
	saveNode.addEventListener("click", saveConfiguration, true);
	mainDiv.appendChild(saveNode);

	mainDiv.style.display = noneText;
	document.getElementsByTagName('body')[0].appendChild(mainDiv);
}

function newColor()
{
	highlightColor = this.options[this.selectedIndex].value;
}

function showConfigure()
{
	loadConfiguration();
	var div = $("#div_configureHighlightBox");
	div.style.display = blockText;
}

function $(aSelector, aNode)
{
	return (aNode || document).querySelector(aSelector);
}

document.addEventListener('DOMContentLoaded',onLoaded,true);
GM_registerMenuCommand("Configure noticeMF", showConfigure, "n");
