// abef.user.js
//
// Copyright 2007-2015, Michael Devore
// This file is licensed under the terms of the Artistic License 2.0.
// See http://opensource.org/licenses/artistic-license-2.0 for the license itself.
//
// This is a Greasemonkey script.
// See http://www.greasespot.net/ for more information on Greasemonkey.
//
// ==UserScript==
// @name          A Better eBay Filter
// @namespace     http://www.devoresoftware.com/gm/abef
// @description	Allow filtering eBay searches based on additional criteria, global site support
// @version       9.0
// @include       http://*listings*.ebay.*/*
// @include       https://*listings*.ebay.*/*
// @include       http://*search*.ebay.*/*
// @include       https://*search*.ebay.*/*
// @include       http://*shop*.ebay.*/*
// @include       https://*shop*.ebay.*/*
// @include       http://www.ebay.*/sch/*
// @include       https://www.ebay.*/sch/*
// @include       http://www.ebay.*/dsc/*
// @include       https://www.ebay.*/dsc/*
// @grant GM.setValue 
// @grant GM.getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/5979/A%20Better%20eBay%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/5979/A%20Better%20eBay%20Filter.meta.js
// ==/UserScript==
//
// Version 1.0, released April 2007
// Version 2.0, released late-April 2007
// Version 3.0, release early January 2010, rework for revised eBay
// Version 3.1, release mid-January 2010, fix for eBay Motors
// Version 3.2, release early September 2010, fix for Ebay update
// Version 4.0, release November 2010, add support for Top-rated seller filtering
// Version 4.1, release November 2011, add @include to support changed eBay search links
// Version 5.0, release March 2012, rework due to eBay changing internals
// Version 6.0, release February 2013, rework due to eBay redesign
// Version 7.0, release October 2014, update for eBay changes, newer Greasemonkey version compatibility
// Version 8.0, release late July 2015, update for compatibility with searches within results
// Version 8.1, release mid-August 2015, update to support searches with include description checked
// Version 9.0, release March 2018, new Greasemonkey api compatibility

var defaultScoreThreshold = 50;
var defaultPercentThreshold = 98.5;
var defaultScoreMax = "";
var FILTER_SCORE_FLAG = 1;
var FILTER_PERCENT_FLAG = FILTER_SCORE_FLAG << 1;
var FILTER_SCOREMAX_FLAG = FILTER_PERCENT_FLAG << 1;
var filteredCount = 0;
var buttonText = "button";
var divText = "DIV";
var spanText = "SPAN";
var inputText = "INPUT";
var imgText = "IMG";
var brText = "BR";
var ulText = "UL";
var liText = "LI";
var noneText = "none";
var blockText = "block";
var xText = "x";
var changedText = "\u00a0 (Values changed.)";
var changeNode = null;
var configNode = null;
var filteredNode = null;
var scoreThreshold = defaultScoreThreshold;
var percentThreshold = defaultPercentThreshold;
var scoreMax = defaultScoreMax;
var noTrsChecked = false;

var abefActiveControl = null;

async function getAbefConfiguration()
{
	var abefParam = await GM.getValue("scoreThreshold", xText);
	if (abefParam != xText)
	{
		scoreThreshold = abefParam - 0;
	}
	else
	{
		GM.setValue("scoreThreshold", scoreThreshold + "");
	}
  
	abefParam = await GM.getValue("percentThreshold", xText);
	if (abefParam != xText)
	{
		percentThreshold = abefParam - 0;
	}
	else
	{
		GM.setValue("percentThreshold", percentThreshold + "");
	}
  
	abefParam = await GM.getValue("scoreMax", xText);
	if (abefParam != xText)
	{
		if (isNaN(parseInt(abefParam)))
		{
			scoreMax = "";
		}
		else
		{
			scoreMax = abefParam - 0;
		}
	}
	else
	{
		GM.setValue("scoreMax", scoreMax + "");
	}

	abefParam = await GM.getValue("noTrsChecked", xText);
	if (abefParam != xText)
	{
		noTrsChecked = abefParam;
	}
	else
	{
		GM.setValue("noTrsChecked", noTrsChecked);
	}
}

function updateAbefConfiguration()
{
	GM.setValue("scoreThreshold", scoreThreshold + "");
	GM.setValue("percentThreshold", percentThreshold + "");
	GM.setValue("scoreMax", scoreMax + "");
	GM.setValue("noTrsChecked",noTrsChecked);
}

function showFilteredCount()
{
	filteredNode.nodeValue =
		"\u00a0 " + filteredCount + " entr"+ (filteredCount != 1 ? "ies" : "y") + " filtered from view";
	configNode.parentNode.appendChild(filteredNode);
}

function newFilterValues(event)
{
	if (event != null)
	{
		event.preventDefault();
		event.stopPropagation();
	}
	if (configNode.nextSibling == changeNode)
	{
		configNode.parentNode.removeChild(changeNode);
	}

	var fNode = document.getElementById("fbScore");
	scoreThreshold = fNode.value - 0;	// force numeric
	fNode = document.getElementById("fbPercent");
	percentThreshold = fNode.value - 0;
	fNode = document.getElementById("fbMax");
	if (isNaN(parseInt(fNode.value)))
	{
		scoreMax = "";
	}
	else
	{
		scoreMax = fNode.value - 0;
	}
	fNode = document.getElementById("fbTrs");
	noTrsChecked = fNode.checked;
	updateAbefConfiguration();
	walkTheListings();
}

function changedFilter(event)
{
	if (event != null)
	{
		event.preventDefault();
		event.stopPropagation();
	}
	if (configNode.nextSibling == changeNode)
	{
		return;
	}
	if (configNode.nextSibling == filteredNode)
	{
		configNode.parentNode.removeChild(filteredNode);
	}
	configNode.parentNode.appendChild(changeNode);
}

function getFeedbackScore(textNode)
{
	if (!textNode.nodeValue)
	{
		return xText;
	}
	var s = textNode.nodeValue;
	var result;
	if ((result = s.match(/([\.,0-9]+)/)) != null)
	{
		// remove comma and period
		result[1] = result[1].replace(/[\.,]/g, "");
		return result[1] - 0;	// force numeric
	}
	return xText;
}

function getFeedbackPercent(textNode)
{
	if (!textNode.nodeValue)
	{
		return xText;
	}
	var s = textNode.nodeValue;
	var result;
	// globalize by accepting comma as a period
	if ((result = s.match(/([\.,0-9]+)%/)) != null)
	{
		// change comma, if any, to period
		result[1] = result[1].replace(/,/, ".");
		return result[1] - 0;	// force numeric
	}
	return xText;
}

function shouldFilterOut(spanNode)
{
	var cNode = spanNode.firstChild;
	var validScore = false;
	var validPercent = false;
	var feedbackScore = 0;
	var feedbackPercent = 0;

	var parsed;
	while (!validScore || !validPercent)
	{
		parsed = false;
		if (cNode && spanNode.nodeName.toUpperCase() === spanText && cNode.nodeName === "#text")
		{
			if (!validPercent)
			{
				if ((feedbackPercent = getFeedbackPercent(cNode)) != xText)
				{
					validPercent = true;
					parsed = true;
				}
			}
			if (!validScore && !parsed)
			{
				if ((feedbackScore = getFeedbackScore(cNode)) != xText)
				{
					validScore = true;
				}
			}
		}
		spanNode = spanNode.nextSibling;
		if (!spanNode)
		{
			break;
		}
		cNode = spanNode.firstChild;
	}

	var retValue = 0;
	if (validScore && feedbackScore < scoreThreshold)
	{
		retValue |= FILTER_SCORE_FLAG;
	}
	if (validPercent && feedbackPercent < percentThreshold)
	{
		retValue |= FILTER_PERCENT_FLAG;
	}
	if (validScore && !isNaN(parseInt(scoreMax)) && feedbackScore > scoreMax)
	{
		retValue |= FILTER_SCOREMAX_FLAG;
	}
	if (retValue)
	{
		filteredCount++;
	}

	return retValue;
}

function walkTheListings()
{
	filteredCount = 0;

	var xpath = "//div[@id='ResultSetItems']//li[contains(@id, 'item') and contains(@class, 'lvresult')]";

	var liNodes = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);

	var entryCounter = 0;
	for (var loopVar = 0; loopVar < liNodes.snapshotLength; loopVar++)
	{
		var liNode = liNodes.snapshotItem(loopVar);
		var detailNode = liNode.firstChild;
		while (detailNode && (!detailNode.className || detailNode.nodeName.toUpperCase() !== ulText || detailNode.className.indexOf('lvdetails') < 0))
		{
			detailNode = detailNode.nextSibling;
		}
		if (!detailNode)
		{
			continue;
		}

		var subLiNode = detailNode.firstChild;
		var spanNode = null;
		var found = false;
		while (subLiNode)
		{
			spanNode = subLiNode.firstChild;
			while (spanNode)
			{
				if (spanNode.nodeName.toUpperCase() === spanText && spanNode.className === 'selrat')
				{
					found = true;
					break;
				}
				spanNode = spanNode.nextSibling;
			}
			if (!found)
			{
				subLiNode = subLiNode.nextSibling;
			}
			else
			{
				break;
			}
		}
		if (!spanNode)
		{
			continue;
		}

		var topSellerFilter = false;
		if (noTrsChecked)
		{
			var checkLiNode = subLiNode.nextSibling;
			while (checkLiNode)
			{
				if (checkLiNode.nodeName.toUpperCase() === liText)
				{
					var checkNode = checkLiNode.firstChild;
					while (checkNode && checkNode.nodeName.toUpperCase() !== spanText)
					{
						checkNode = checkNode.nextSibling;
					}
					if (checkNode)
					{
						// got SPAN
						checkNode = checkNode.firstChild;
					}
					while (checkNode && (checkNode.nodeName.toUpperCase() !== imgText || checkNode.className.indexOf("iconETRS") < 0))
					{
						checkNode = checkNode.nextSibling;
					}
					if (checkNode)
					{
						// found top seller IMG
						topSellerFilter = true;
						filteredCount++;
						break;
					}
				}
				checkLiNode = checkLiNode.nextSibling;
			}
		}

		if (topSellerFilter || shouldFilterOut(spanNode))
		{
			if (liNode.style.display != noneText)
			{
				liNode.style.display = noneText;
			}
		}
		else
		{
			liNode.style.display = blockText;
		}
	}
	showFilteredCount();
}

function buildControls()
{
	var xpath;
	var divNodes;

	xpath = "//div[@id='RelatedSearchesDF']";

	divNodes = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);

	var isRelatedSearch = true;
	if (divNodes.snapshotLength <= 0)
	{
//		return false;
		isRelatedSearch = false;
		xpath = "//div[@id='TopPanelDF']";
		divNodes = document.evaluate(
			xpath,
			document,
			null,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
			null
		);
		if (divNodes.snapshotLength <= 0)
		{
			return false;
		}
	}

	changeNode = document.createTextNode(changedText);
	filteredNode = document.createTextNode("\u00a0 0 entries filtered from view");

	var divSibling;

	divSibling = divNodes.snapshotItem(0);

	var newDivNode = document.createElement(divText);

	if (!isRelatedSearch)
	{
		newDivNode.appendChild(document.createElement(brText));
	}

	var span1Node = document.createElement(spanText);
	span1Node.style.fontWeight = "bold";
	var input1Node = document.createElement(inputText);
	input1Node.type = "text";
	input1Node.size = 4;
	input1Node.style.textAlign = "right";
	input1Node.setAttribute("id", "fbScore");
	input1Node.defaultValue = scoreThreshold;
	input1Node.addEventListener('change', changedFilter, false);
	span1Node.appendChild(input1Node);
	span1Node.appendChild(document.createTextNode(" Minimum feedback score\u00a0\u00a0\u00a0\u00a0"));

	newDivNode.appendChild(span1Node);
	var span2Node = document.createElement(spanText);
	span2Node.style.fontWeight = "bold";
	var input2Node = document.createElement(inputText);
	input2Node.type = "text";
	input2Node.size = 4;
	input2Node.style.textAlign = "right";
	input2Node.setAttribute("id", "fbPercent");
	input2Node.defaultValue = percentThreshold;
	input2Node.addEventListener('change', changedFilter, false);
	span2Node.appendChild(input2Node);
	span2Node.appendChild(document.createTextNode("% Minimum positive feedback\u00a0\u00a0\u00a0\u00a0"));
	newDivNode.appendChild(span2Node);

	var spanMaxNode = document.createElement(spanText);
	spanMaxNode.style.fontWeight = "bold";
	var inputMaxNode = document.createElement(inputText);
	inputMaxNode.type = "text";
	inputMaxNode.size = 4;
	inputMaxNode.style.textAlign = "right";
	inputMaxNode.setAttribute("id", "fbMax");
	inputMaxNode.defaultValue = scoreMax;
	inputMaxNode.addEventListener('change', changedFilter, false);
	spanMaxNode.appendChild(inputMaxNode);
	spanMaxNode.appendChild(document.createTextNode(" Maximum feedback score (blank to disable)\u00a0\u00a0\u00a0\u00a0"));
	newDivNode.appendChild(spanMaxNode);

	var spanTrsNode = document.createElement(spanText);
	spanTrsNode.style.fontWeight = "bold";
	var inputTrsNode = document.createElement(inputText);
	inputTrsNode.type = "checkbox";
	inputTrsNode.size = 4;
	inputTrsNode.style.textAlign = "right";
	inputTrsNode.setAttribute("id", "fbTrs");
	inputTrsNode.checked = noTrsChecked;
	inputTrsNode.defaultChecked = noTrsChecked;
	inputTrsNode.addEventListener('change', changedFilter, false);
	spanTrsNode.appendChild(inputTrsNode);
	spanTrsNode.appendChild(document.createTextNode(" No Top-rated Sellers"));
	newDivNode.appendChild(spanTrsNode);

	// second line
	newDivNode.appendChild(document.createElement(brText));
	configNode = document.createElement(buttonText);
	configNode.appendChild(document.createTextNode("Update Filter"));
	configNode.addEventListener('click', newFilterValues, false);
	newDivNode.appendChild(configNode);

	divSibling.parentNode.insertBefore(document.createElement(brText), divSibling.nextSibling);
	divSibling.parentNode.insertBefore(document.createElement(brText), divSibling.nextSibling);

	divSibling.parentNode.insertBefore(newDivNode, divSibling.nextSibling);

	return true;
}

async function init()
{
	await getAbefConfiguration();
  if (!buildControls())
	{
		return;
	}
	walkTheListings();
}

function main()
{
	if (!GM.setValue)
	{
		return;
	}
	init();
}


main();

