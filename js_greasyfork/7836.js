// ==UserScript==
// @name           Pokec.sk zvyraznie sprav podla obsahu
// @description    Zvyraznie sprav na skle podla obsahu spravy
// @namespace      http://
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @date           2013-10-1
// @author         pompom
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/7836/Pokecsk%20zvyraznie%20sprav%20podla%20obsahu.user.js
// @updateURL https://update.greasyfork.org/scripts/7836/Pokecsk%20zvyraznie%20sprav%20podla%20obsahu.meta.js
// ==/UserScript==


/* ************************************************************************** */
/* ************************************************************************** */
/* ************************************************************************** */


var words = new Array("slovo1","slovo2","slovo3");


/* ************************************************************************** */
/* ************************************************************************** */
/* ************************************************************************** */


var sklo = document.getElementById("sklo");
sklo.addEventListener('DOMNodeInserted', function(event) {
	var array;
	var link;
	var text;

	array = event.relatedNode.getElementsByClassName("prispevok");
	for(var i=0; i<array.length; i++)
	{
		link = array[i];
		text = link.innerHTML;
		for(var j=0; j<words.length; j++)
		{
			word = words[j];
			if(text.indexOf(word)>-1)
                link.parentNode.parentNode.setAttribute('style','background-color:#B00000 !important;');
		}
	}

}, true);
