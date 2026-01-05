// ==UserScript==
// @name        Alternative search engines 2
// @description Adds search on other sites for google, bing, yandex, duckduckgo
// @namespace   2k1dmg@userscript
// @license     MIT
// @version     0.3.2
// @grant       none
// @noframes
// @match       *://yandex.com/*
// @match       *://yandex.ru/*
// @match       *://ya.ru/*
// @match       *://www.google.com/*
// @match       *://www.google.ru/*
// @match       *://www.bing.com/*
// @match       *://duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/8928/Alternative%20search%20engines%202.user.js
// @updateURL https://update.greasyfork.org/scripts/8928/Alternative%20search%20engines%202.meta.js
// ==/UserScript==

// 2024-08-11

(function() {
'use strict';

var SEARCH_ON = '• ';
var SEARCH_END = ' •';
var LINK_BOX_ID = 'oeid-box';
var ENGINES_SEPARATOR = ' - ';
var POSITION = 'left';

var ENGINES = [
	['Yandex', 'https://yandex.ru/yandsearch?text='],
	['Ya', 'https://ya.ru/yandsearch?text='],
	['Google', 'https://www.google.com/search?q='],
	['Bing', 'https://www.bing.com/search?q='],
	['DuckDuckGo', 'https://duckduckgo.com/?q=']
];

var PLACEHOLDER_SELECTORS = [
	'.content__left', // yandex
	'.content__left', // ya
	'#center_col',/*'#result-stats',*/ // google
	'.sb_count', // bing
	'#react-duckbar'/*.results--main*/ // duckduckgo
].join(',');

var INPUT_FIELD_SELECTORS = [
	'.HeaderForm-Input', // yandex
	'.HeaderForm-Input', // ya
	'textarea.gLFyf', // google
	'#sb_form_q', // bing
	'#search_form_input' // duckduckgo
].join(',');

function addCSSStyle() {
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	cssStyle.textContent = [
		'#' + LINK_BOX_ID + ' {',
		'	display: inline-block;',
		'	padding-right: 10px;',
		'	padding-bottom: 10px;',
		'	color: rgb(115, 115, 115);' ,
		'	font-family: Verdana,sans-serif;',
		'	font-size: 9pt;',
		'	text-align: ' + POSITION + ';',
		'	z-index: 10000;',
		'}',
		'#' + LINK_BOX_ID + ' > a {',
		'	text-decoration: none;',
		'}'
	].join('\n');
	document.head.appendChild(cssStyle);
}

function createLinkBox() {
	var domain = document.domain.split('.').splice(-2, 2)[0];
	var fragment = document.createDocumentFragment();
	var divNode = document.createElement('div');
	divNode.id = LINK_BOX_ID;
	fragment.appendChild(divNode);

	divNode.appendChild(document.createTextNode(SEARCH_ON));

	ENGINES.forEach(function(engine) {
		if(engine[0].toLowerCase() == domain) {
			return;
		}
		var node = document.createElement('a');
		node.target = '_blank';
		node.href = engine[1];
		node.textContent = engine[0];
		divNode.appendChild(node);
		divNode.appendChild(document.createTextNode(ENGINES_SEPARATOR));
	});
 
	divNode.lastChild.textContent = SEARCH_END;
	return fragment;
}

function linkBoxMouseOver(event) {
	var aHref = event.target;
	if(aHref.nodeName.toLowerCase() != 'a') {
		return;
	}

	var engineSource;
	ENGINES.forEach(function(engine) {
		if(engine[0] == aHref.textContent) {
			engineSource = engine[1];
			return;
		}
	});

	var engineURL;
	var engineParam = '';
	if(Array.isArray(engineSource)) {
		engineParam = engineSource[1];
		engineURL = engineSource[0];
	}
	else if(typeof engineSource == 'string') {
		engineURL = engineSource;
	}
	else {
		return;
	}
	var searchText = document.querySelector(INPUT_FIELD_SELECTORS);
	if(engineURL && searchText && searchText.value.length > 0) {
		aHref.href = engineURL + encodeURIComponent(searchText.value) + engineParam;
	}
}

function linkBoxMouseOut(event) {
	var aHref = event.target;
	if(aHref.nodeName.toLowerCase() != 'a') {
		return;
	}
	ENGINES.forEach(function(engine) {
		if(engine[0] == aHref.textContent) {
			aHref.href = engine[1];
			return;
		}
	});
}

if(document.getElementById(LINK_BOX_ID)) {
	return;
}
var results = document.querySelector(PLACEHOLDER_SELECTORS);
if(!results) {
	return;
}

addCSSStyle();
var fragment = createLinkBox();
var domain = document.domain.split('.').splice(-2, 2)[0];
if(domain == 'duckduckgo') {
	results.firstChild.appendChild(fragment);
} else {
	results.insertBefore(fragment, results.firstChild);
}

var linkBox = document.querySelector('#'+LINK_BOX_ID);
if(domain == 'duckduckgo') {
	linkBox.setAttribute('style', 'padding-top: 10px;');
}

linkBox.addEventListener('mouseover', linkBoxMouseOver);
linkBox.addEventListener('mouseout', linkBoxMouseOut);

})();