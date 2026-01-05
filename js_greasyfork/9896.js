// ==UserScript==
// @name        HexLet Lessons List
// @description Adds Lessons List.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @version     0.1.6
// @grant       none
// @noframes
// @include     https://*.hexlet.io/lessons/*
// @downloadURL https://update.greasyfork.org/scripts/9896/HexLet%20Lessons%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/9896/HexLet%20Lessons%20List.meta.js
// ==/UserScript==

'use strict';

main();

function main() {
	var courseLink = document.querySelector('.navbar-nav a');
	if(!courseLink || !courseLink.href || !getCoursesID(courseLink))
		return;
	var lessonsList = getCachedList();
	if(lessonsList) {
		addBox(lessonsList);
	}
	else {
		getDoc(courseLink.href);
	}
}

function getCoursesID(courseLink) {
	var SS_ID = '_hl_cached_lessons_';
	var coursesID = '';
	try {
		coursesID = courseLink.href.match(/\w+$/)[0];
	}
	catch(ex) {
		return;
	};
	getCoursesID = function() {
		return SS_ID + coursesID;
	};
	return getCoursesID.apply(this, arguments);
}

function getDoc(url) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var docText = xhr.responseText;
		var parser = new DOMParser();
		var responseDoc = parser.parseFromString(docText, 'text/html');
		var lessonsList = getList(responseDoc);
		if(lessonsList)
			addBox(lessonsList);
	};
	xhr.open('GET', url, true);
	xhr.send(null);
}

function addBox(lessonsList) {
	if(!lessonsList)
		return;

	var menuLeft = document.querySelector('.navbar-nav');
	if(!menuLeft)
		return;

	var css = document.createElement('style');
	css.type = 'text/css';
	css.textContent= [
		'.navbar-collapse > .row > div:nth-child(1),',
		'.navbar-collapse > .row > div:nth-child(3) {',
		'	width: 25%;',
		'}',
		'.navbar-collapse > .row > div:nth-child(2) {',
		'	width: 50%;',
		'}'
	].join('\n');
	document.head.appendChild(css);

	lessonsList.classList.add('dropdown-menu', 'dropdown-menu-left');
	lessonsList.setAttribute('role', 'menu');
	lessonsList.style.cssText = [
		'max-height:'+getAttr('h',100)+'px;',
		'overflow-y:auto;',
		'max-width:'+getAttr('w',200)+'px;',
		'overflow-x:hidden;'
	].join('');

	var lessonsBox = getResultListFragment(lessonsList) || getResultListNode(lessonsList);

	menuLeft.appendChild(lessonsBox);
}

function getResultList(cachedList) {
	var resultList = document.createElement('ul');
	var currentURL = location.href.replace(location.origin, '');

	cachedList.forEach(function(item) {
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.textContent = item.title;
		a.href = item.href;
		a.title = item.title;
		if(currentURL === item.href)
			a.style.fontWeight = 'bold';
		li.appendChild(a);
		resultList.appendChild(li);
	});

	return resultList;
}

function getList(doc) {
	var hlTimeLine = doc.querySelector('.hexlet-timeline');
	if(!hlTimeLine)
		return;
	var _slice = Array.slice || Function.prototype.call.bind(Array.prototype.slice);
	var hlTimeLineLI = hlTimeLine.querySelectorAll('li');
	var hlTimeLineLIList = _slice(hlTimeLineLI);

	var cachedList = [];
	hlTimeLineLIList.forEach(function(item) {
		var title = item.querySelector('.hexlet-timeline-title');
		var link = item.querySelector('.btn');
		if(!link || !link.getAttribute('href') ||
				!title || !title.textContent)
			return;
		cachedList.push({
			title: title.textContent.trim(),
			href: link.getAttribute('href')
		});
	});

	setCachedList(cachedList);
	var resultList = getResultList(cachedList);
	return resultList;
}

function dataStorage(type) {
	if(typeof localStorage === 'undefined' ||
			typeof sessionStorage === 'undefined')
		return;
	var storage = sessionStorage;
	switch(type) {
		case 'local':
			storage = localStorage;
			break;
		case 'session':
			storage = sessionStorage;
			break;
	}
	dataStorage = function(name, value) {
		if(!name)
			return;
		if(typeof value === 'undefined') {
			return storage.getItem(name);
		}
		else if(value['remove'] === true) {
			storage.removeItem(name);
		}
 		else {
			storage.setItem(name, value);
		}
	};
	return dataStorage.apply(this, arguments);
}

function setCachedList(cachedList) {
	var cachedData = JSON.stringify(cachedList);
	dataStorage(getCoursesID(), cachedData);
	setTimeCachedList();
}

function getCachedList() {
	var cachedData = dataStorage(getCoursesID());
	if(!cachedData)
		return;
	if(getTimeCachedList())
		return;
	var cachedList = JSON.parse(cachedData);
	var resultList = getResultList(cachedList);
	return resultList;
}

function setTimeCachedList() {
	dataStorage(getCoursesID()+'_time', Date.now());
}

function getTimeCachedList() {
	var lifeTime = 1000 * 60 * 60 * 24 * 1;
	var coursesID = getCoursesID();
	var cachedDataTime = dataStorage(coursesID+'_time');
	if(!cachedDataTime)
		return;
	if(parseInt(cachedDataTime) + lifeTime - Date.now() < 0) {
		dataStorage(coursesID+'_time', {remove:true});
		dataStorage(coursesID, {remove:true});
		return true;
	}
}

function setAttributes(el, attrs) {
	for(var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

function _localize(sid) {
	var ellipsis = '\u2026';
	var strings = {
		ru: {
			lessons: 'Уроки'+ellipsis
		},
		en: {
			lessons: 'Lessons'+ellipsis
		}
	};
	var locale = location.hostname.match(/^[a-z]*/)[0];
	_localize = function(sid) {
		return strings[locale] && strings[locale][sid] || strings.en[sid] || sid;
	};
	return _localize.apply(this, arguments);
}

function getResultListFragment(lessonsList) {
	var fragment;
	try {
		fragment = createFragment([
			{n:'li',a:'class:="dropdown"',c:[
				{n:'a',a:'href:="#",class:="dropdown-toggle",role:="button",data-toggle:="dropdown",aria-expanded:="false"',c:[
					{n:'strong',t:_localize('lessons')},
					{n:'span',a:'class:="caret"'}
				]},
				{dn:lessonsList}
			]}
		]);
	}
	catch(ex) {
		return null;
	};
	return fragment;
}

function getResultListNode(lessonsList) {
	var li = document.createElement('li');
	li.classList.add('dropdown');

	var a = document.createElement('a');
	a.href = '#';
	a.classList.add('dropdown-toggle');
	setAttributes(a, {
		'role':'button',
		'data-toggle':'dropdown',
		'aria-expanded':'false'
	});
	var strong = document.createElement('strong');
	strong.textContent = _localize('lessons');
	a.appendChild(strong);
	var span = document.createElement('span');
	span.classList.add('caret');

	a.appendChild(span);
	li.appendChild(a);
	li.appendChild(lessonsList);

	return li;
}

function getAttr(attrName, initValue) {
	if(!attrName && typeof attrName !== 'string')
		return;
	var attr = '';
	switch(attrName) {
		case 'h':
			attr = 'clientHeight';
			break;
		case 'w':
			attr = 'clientWidth';
			break;
	}
	var defValue = initValue || 100;
	var attrValue;
	try {
		attrValue = parseInt(document.documentElement[attr] * 0.6);
		if(attrValue < defValue)
			attrValue = defValue;
	}
	catch(ex) {
		attrValue = defValue * 2;
	};
	return attrValue;
}

function createFragment(data) {
	function setCommon(node, sAttr, reason) {
		var aAttr = sAttr.split(',');
		aAttr.forEach(function(attr) {
			var attrSource = /:=/.test(attr) ? attr.split(':=') : [attr, reason === 'a' ? '' : null];
			var attrName = attrSource[0].trim();
			var attrValue = attrSource[1].trim().replace(/^(['"])([^\1]*)\1$/, '$2');
			if(reason === 'a') {
				node.setAttribute(attrName, attrValue);
			}
			else {
				node[attrName] = attrValue;
			}
		});
		return node;
	}
	function setAttr(node, sAttr) {
		return setCommon(node, sAttr, 'a');
	}
	function setProp(node, sAttr) {
		return setCommon(node, sAttr, 'p');
	}
	function createFragmentInner(data, fragment) {
		if(data.n) {
			var node = document.createElement(data.n);
			if(data.a)
				node = setAttr(node, data.a);
			if(data.p)
				node = setProp(node, data.p);
			if(data.s)
				node.style.cssText = data.s;
			fragment.appendChild(node);
		}
		if(data.c) {
			data.c.forEach(function(cn) {
				createFragmentInner(cn, node || fragment);
			});
		}
		if(data.t && node) {
			node.appendChild(document.createTextNode(data.t));
		}
		if(data.tc) {
			fragment.appendChild(document.createTextNode(data.tc));
		}
		if(data.dn) {
			fragment.appendChild(data.dn);
		}
		return fragment;
	}
	var fragment = document.createDocumentFragment();
	return createFragmentInner({c:data}, fragment);
}
