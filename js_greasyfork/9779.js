// ==UserScript==
// @name         DNA Chat Box Remover
// @namespace    http://userscripts.org/users/11246
// @version      1.8
// @description  Removes Chat Boxes [Chatango | Cbox]
// @encoding     utf-8
// @icon         http://i.imgur.com/BQ9yA1B.png
// @include      http*://*
// @author       Last Roze (Originally Posted by zanetsu)
// @license      None
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/9779/DNA%20Chat%20Box%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/9779/DNA%20Chat%20Box%20Remover.meta.js
// ==/UserScript==

var chatangoScripts = 0;
var cboxScripts = 0;

function removeChatScript(e) {
	//Chatango
	if (-1 != e.target.innerHTML.search(/st\.chatango\.com\/js\/gz\/emb\.js/i))
	{
		chatangoScripts++;
		e.preventDefault();
		e.stopPropagation();
	}
	
	//Cbox
	if (-1 != e.target.innerHTML.search(/cbox\.ws\//i))
	{
		cboxScripts++;
		e.preventDefault();
		e.stopPropagation();
	}
	
	if (e.target.hasAttribute("src"))
	{
	    //Chatango
		if (-1 != e.target.src.search(/st\.chatango\.com\/js\/gz\/emb\.js/i))
		{
			chatangoScripts++;
			e.preventDefault();
			e.stopPropagation();
		}
		
		//Cbox
		if (-1 != e.target.src.search(/cbox\.ws\//i))
		{
			cboxScripts++;
			e.preventDefault();
			e.stopPropagation();
		}
	}
	
	//Optimization, Max Occurrances May Change Over Time
	if (2 <= chatangoScripts || 3 <= cboxScripts)
	{
		window.removeEventListener(e.type, arguments.callee, true);
	}
}

function removeChatObject(e) {
	var embeds = document.getElementsByTagName("embed");
	
	for (var i = 0; i < embeds.length; i++) {
		if (embeds[i].hasAttribute("src"))
		{
			//Chatango
			if (-1 != embeds[i].src.search(/chatango\.com\/group/i))
			{
				embeds[i].parentNode.parentNode.removeChild(embeds[i].parentNode);
			}
		}
	}

	var objects = document.getElementsByTagName("object");
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].hasAttribute("data"))
		{
			//Chatango
			if (-1 != objects[i].data.search(/chatango\.com\/flash/i))
			{
				objects[i].parentNode.removeChild(objects[i]);
			}
		}
	}
	
	//Cbox
	var iframes = document.getElementsByTagName("iframe");
	for (var i = 0; i < iframes.length; i++) {
		if (iframes[i].hasAttribute("src"))
		{
			if (-1 != iframes[i].src.search(/cbox\.ws\//i))
			{
				iframes[i].parentNode.removeChild(iframes[i]);
			}
		}
	}
	
	if (e) {
		window.removeEventListener(e.type, arguments.callee, true);
		//In Case Chat Object is Yet to be Loaded
		setTimeout(function() {
			removeChatObject();
		}, 1000);
	}
}

//Remove Chat Script
if ('onbeforescriptexecute' in document) {
	//Firefox
	document.addEventListener('beforescriptexecute', removeChatScript, true);
}
else {
	//Chrome | Opera
	document.addEventListener('beforeload', removeChatScript, true);
}

//Remove Chat Object, If No Chat Script is Used
document.addEventListener('load', removeChatObject, true);
document.addEventListener('error', removeChatObject, true);
document.addEventListener('abort', removeChatObject, true);