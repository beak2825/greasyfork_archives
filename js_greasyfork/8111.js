// ==UserScript==
// @name            SteamGifts Helper
// @namespace       iFantz7E.SteamGiftsHelper
// @version         1.71
// @description     In SteamGifts, improve some features
// @match           *://www.steamgifts.com/*
// @icon            https://cdn.steamgifts.com/img/favicon.ico
// @run-at          document-start
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_setClipboard
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_deleteValue
// @connect         store.steampowered.com
// @connect         www.steamgifts.com
// @connect         www.sgtools.info
// @connect         steamdb.info
// @license         GPL-3.0-only
// @copyright       2015, 7-elephant
// @supportURL      https://steamcommunity.com/id/7-elephant/
// @contributionURL https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/8111/SteamGifts%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8111/SteamGifts%20Helper.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html
// Compatibility: Firefox 14+ from Mutation Observer

// Since 16 Feb 2015
// https://greasyfork.org/scripts/8111-steamgifts-helper

(function()
{
	"use strict";
	// jshint multistr:true
	
function initStyle()
{
	var imgB64SdbPartial = "data:image/svg+xml;base64,\
PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJN\
NjMuOSAwQzMwLjUgMCAzLjEgMTEuOSAwLjEgMjcuMWwzNS42IDYuN2MyLjktMC45IDYuMi0xLjMgOS42LTEuM2wxNi43LTEw\
Yy0wLjItMi41IDEuMy01LjEgNC43LTcuMiA0LjgtMy4xIDEyLjMtNC44IDE5LjktNC44IDUuMi0wLjEgMTAuNSAwLjcgMTUg\
Mi4yIDExLjIgMy44IDEzLjcgMTEuMSA1LjcgMTYuMy01LjEgMy4zLTEzLjMgNS0yMS40IDQuOGwtMjIgNy45Yy0wLjIgMS42\
LTEuMyAzLjEtMy40IDQuNS01LjkgMy44LTE3LjQgNC43LTI1LjYgMS45LTMuNi0xLjItNi0zLTctNC44TDIuNSAzOC40QzQu\
OCA0MiA4LjUgNDUuMyAxMy4zIDQ4LjIgNSA1MyAwIDU5IDAgNjUuNSAwIDcxLjkgNC44IDc3LjggMTIuOSA4Mi42IDQuOCA4\
Ny4zIDAgOTMuMiAwIDk5LjYgMCAxMTUuMyAyOC42IDEyOCA2NCAxMjggOTkuMyAxMjggMTI4IDExNS4zIDEyOCA5OS42IDEy\
OCA5My4yIDEyMy4yIDg3LjMgMTE1LjEgODIuNiAxMjMuMiA3Ny44IDEyOCA3MS45IDEyOCA2NS41IDEyOCA1OSAxMjMgNTIu\
OSAxMTQuNiA0OC4xIDEyMi45IDQzIDEyNy45IDM2LjcgMTI3LjkgMjkuOSAxMjcuOSAxMy40IDk5LjIgMCA2My45IDBabTIy\
LjggMTQuMmMtNS4yIDAuMS0xMC4yIDEuMi0xMy40IDMuMy01LjUgMy42LTMuOCA4LjUgMy44IDExLjEgNy42IDIuNiAxOC4x\
IDEuOCAyMy42LTEuOCA1LjUtMy42IDMuOC04LjUtMy44LTExLTMuMS0xLTYuNy0xLjUtMTAuMi0xLjV6bTAuMyAxLjdjNy40\
IDAgMTMuMyAyLjggMTMuMyA2LjIgMCAzLjQtNS45IDYuMi0xMy4zIDYuMi03LjQgMC0xMy4zLTIuOC0xMy4zLTYuMiAwLTMu\
NCA1LjktNi4yIDEzLjMtNi4yem0tNDEuNyAxOC41IDAgMGMtMS42IDAuMS0zLjEgMC4yLTQuNiAwLjRsOS4xIDEuN2ExMC44\
IDUgMCAxIDEtOC4xIDkuM2wtOC45LTEuN2MxIDAuOSAyLjQgMS43IDQuMyAyLjQgNi40IDIuMiAxNS40IDEuNSAyMC0xLjUg\
NC42LTMgMy4yLTcuMi0zLjItOS4zLTIuNi0wLjktNS43LTEuMy04LjYtMS4zem02My43IDE2LjYgMCA5LjNjMCAxMS0yMC4y\
IDE5LjktNDUgMTkuOS0yNC45IDAtNDUtOC45LTQ1LTE5LjlsMC05LjJjMTEuNSA1LjMgMjcuNCA4LjYgNDQuOSA4LjYgMTcu\
NiAwIDMzLjYtMy4zIDQ1LjItOC43em0wIDM0LjYgMCA4LjhjMCAxMS0yMC4yIDE5LjktNDUgMTkuOS0yNC45IDAtNDUtOC45\
LTQ1LTE5LjlsMC04LjhjMTEuNiA1LjEgMjcuNCA4LjIgNDUgOC4yIDE3LjYgMCAzMy41LTMuMSA0NS04LjJ6IiBmaWxsPSI";

	GM_addStyle
	(" \
		/* SGH Modify CSS */ \
		header { position: fixed !important; top: 0px; left: 0px; right: 0px; z-index: 6001; } \
		.global__image-outer-wrap--game-large img { width: 292px !important; height: 136px !important; } \
		.global__image-outer-wrap--game-xlarge img { width: 500px; max-height: 215px; } \
		.giveaway__row-outer-wrap { padding-left: 6px !important; padding-right: 6px !important; } \
		.markdown .spoiler:not(:hover) a { color: #8693A7 !important; } \
		.markdown .spoiler:not(:hover) { color: #8693A7 !important; } \
		.page__outer-wrap { text-shadow: none !important; } \
		.sidebar__navigation.bundles_section { width: 336px; max-width: 336px; } \
		.sidebar__mpu { height: auto !important; } \
		.comments a[href*='steamgifts.com/giveaway/'], .comments a[href^='/giveaway/'] \
		  , .page__description a[href*='steamgifts.com/giveaway/'], .page__description a[href^='/giveaway/'] { \
		  padding: 2px; background-color: #B2DBF2; } \
		.comments a[href*='sgtools.info/giveaways/'], .page__description a[href*='sgtools.info/giveaways/'] { \
		  padding: 2px; background-color: #FFC1C1; } \
		.comments a[href*='itstoohard.com/puzzle/'], .page__description a[href*='itstoohard.com/puzzle/'] \
		  , .comments a[href*='jigidi.com/'], .page__description a[href*='jigidi.com/'] { \
		  padding: 2px; background-color: #FBBD77; } \
		.homepage_heading { border-radius: 4px; \
			background-image: linear-gradient(#515763 0%, #2f3540 100%); \
			background-image: -moz-linear-gradient(#515763 0%, #2f3540 100%); \
			background-image: -webkit-linear-gradient(#515763 0%, #2f3540 100%); } \
		*::-moz-selection { color: #E8EAEF; background-color: #5A7ED7; text-shadow: none; } \
		*::selection { color: #E8EAEF; background-color: #5A7ED7; text-shadow: none; } \
		.pagination + .widget-container { margin-top: 40px; } \
		div[class^='sidebar__entry-'], div.sidebar__error { \
			-webkit-touch-callout: none !important; \
			-webkit-user-select: none !important; \
			-khtml-user-select: none !important; \
			-moz-user-select: none !important; \
			-ms-user-select: none !important; \
			user-select: none !important; } \
	");
	
	GM_addStyle
	(" \
		/* SGH Main CSS */ \
		.sgh_body { padding-top: 39px; } \
		.sgh_hidden { display: none; } \
		.sgh_page { border-top: 0px !important; padding-top: 8px !important; \
		  padding-bottom: 5px; } \
		.sgh_page.sgh_page_border { \
		  box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3) !important; \
		  border-bottom: 1px solid #D2D6E0; } \
		.sgh_page:not(.sgh_page_border) { \
		  box-shadow: none !important; } \
		.sgh_SGv2Dark .sgh_page.sgh_page_border { \
		  box-shadow: 0px 1px 0px #393936 !important; \
		  border-bottom: 1px solid #070707; } \
		.sgh_rowShown.sgh_rowShown_inactive { display: none !important; } \
		.sgh_rowHidden:not(.sgh_rowHidden_inactive):not(.sgh_rowOwned) { display: none !important; } \
		.sgh_rowLast:not(.sgh_rowLast_inactive) { border-bottom: 0px !important; } \
		/* .sgh_rowOwned:first-child, .sgh_rowNotInterested:first-child, .sgh_rowWished:first-child { */ \
		/*   border-top: 1px solid #D2D6E0; } */ \
		.sgh_SGv2Dark .sgh_rowOwned:first-child, .sgh_SGv2Dark .sgh_rowNotInterested:first-child \
		, .sgh_SGv2Dark .sgh_rowWished:first-child { \
		  border-top: 1px solid #050504; } \
		.sgh_rowOwned, .sgh_rowNotInterested, .sgh_rowWished { \
		  border-left: 1px solid #D2D6E0 !important; \
		  border-right: 1px solid #D2D6E0 !important; \
		  padding-left: 5px !important; padding-right: 5px !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_SGv2Dark .sgh_rowOwned, .sgh_SGv2Dark .sgh_rowNotInterested, .sgh_SGv2Dark .sgh_rowWished { \
		  border-left: 0px !important; \
		  border-right: 0px !important; \
		  box-shadow: none !important; } \
		.sgh_rowNotInterested { background-color: #F0E4E5; } \
		.sgh_SGv2Dark .sgh_rowNotInterested { background-color: #70504F; } \
		.sgh_rowWished { background-color: #D8E5F0; } \
		.sgh_SGv2Dark .sgh_rowWished { background-color: #172A3B; } \
		.sgh_rowOwned { background-color: #DFF0D8; } \
		.sgh_SGv2Dark .sgh_rowOwned { background-color: #607D42; } \
		/* .sgh_rowOwned:has(> .is-faded) { background-color: rgb(235, 241, 236) !important; } /* /* CSS4 */ \
		.sgh_rowEnterNotInterested:not([style*='background-color:']) { \
		  background-color: #F0E8EA !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_SGv2Dark .sgh_rowEnterNotInterested:not([style*='background-color:']) { \
		  background-color: #571C1A !important; } \
		.sgh_rowEnterWished:not([style*='background-color:']) { \
		  background-color: #D8E5F0 !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_SGv2Dark .sgh_rowEnterWished:not([style*='background-color:']) { \
		  background-color: #172A3B !important; } \
		.sgh_rowEnterOwned:not([style*='background-color:']) { \
		  background-color: #DFF0D8 !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_SGv2Dark .sgh_rowEnterOwned:not([style*='background-color:']) { \
		  background-color: #607D42 !important; } \
		.sgh_appNotInterested, .featured__outer-wrap .global__image-outer-wrap.sgh_appNotInterested { \
		  background-color: #F0D9D8 !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_appWished, .featured__outer-wrap .global__image-outer-wrap.sgh_appWished { \
		  background-color: #D8E5F0 !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_appOwned, .featured__outer-wrap .global__image-outer-wrap.sgh_appOwned { \
		  background-color: #9AC96B !important; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_linkNotInterested { background-color: #F9DBE3 !important; padding: 2px; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_linkWished { background-color: #C2E0F0 !important; padding: 2px; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_linkOwned { background-color: #D3E4C7 !important; padding: 2px; \
		  transition: background 300ms ease-in 0s; } \
		.sgh_linkOwned.table_image_thumbnail { border: solid 3px #9AC96B; } \
		.sgh_linkNotInterested.table_image_thumbnail { border: solid 3px #F9DBE3; } \
		.sgh_linkWished.table_image_thumbnail { border: solid 3px #C2E0F0; } \
		.sgh_noti { text-align: center; } \
		.sgh_column_small { width: 90px; } \
		.sgh_noTransition { transition: all 0s ease 0s !important; } \
		.sgh_ga_shortcut_input { height: 100%; -moz-box-flex: 1; flex: 1 1 0%; \
		  line-height: 18px !important; padding: 0px !important; border: 0px none !important; } \
		.sgh_ga_shortcut_link { display: none; } \
		.sgh_gaOwned .fa, .sgh_gaOwned:visited .fa { \
		  vertical-align: text-bottom; color: #739650 !important; } \
		.sgh_gaUnknown .fa, .sgh_gaUnknown:visited .fa { \
		  vertical-align: text-bottom; color: #968B50 !important; } \
		.sgh_gaFiltered .fa, .sgh_gaFiltered:visited .fa { \
		  vertical-align: text-bottom; color: #888 !important; } \
		.sgh_gaLvlRequired .fa, .sgh_gaLvlRequired:visited .fa { \
		  vertical-align: text-bottom; color: #B0255A !important; } \
		.sgh_gaEnded .fa, .sgh_gaEnded:visited .fa { \
		  vertical-align: text-bottom; color: #6b7a8c !important; } \
		.sgh_gaEntered .fa, .sgh_gaEntered:visited .fa { \
		  vertical-align: text-bottom; color: #4B72D4 !important; } \
		.sgh_gaMissingBase .fa, .sgh_gaMissingBase:visited .fa { \
		  vertical-align: text-bottom; color: #4B72D4 !important; padding-left: 2px; } \
		.sgh_gaNotFound .fa, .sgh_gaNotFound:visited .fa { \
		  vertical-align: text-bottom; color: #6b7a8c !important; } \
		.markdown h1 .sgh_fa { font-size: 28px; } \
		.markdown h2 .sgh_fa { font-size: 18px; } \
		.markdown h3 .sgh_fa { font-size: 14px; } \
		.sgh_pointer { cursor: pointer; } \
	");
	
	GM_addStyle
	(" \
		/* SGH Icon CSS */ \
		.sgh_icon_sdb { padding-left: 3px; margin-left: 2px; margin-top: 5px; } \
		.sgh_icon_sdb_div { \
		  width: 14px; height: 14px; opacity: 0.35; display: inline-block; \
		  background-image: url(" + imgB64SdbPartial + "jNDY1NjcwIi8+PC9zdmc+); } \
		.table__column__heading .sgh_icon_sdb_div { vertical-align: text-bottom; margin-bottom: 1px; } \
		.sgh_SGv2Dark .sgh_icon_sdb_div { \
		  opacity: 0.55; \
		  background-image: url(" + imgB64SdbPartial + "jQTBBMEEwIi8+PC9zdmc+); } \
		.sgh_icon_sdb_div.sidebar__navigation__item__count { \
		  opacity: 0.9; \
		  background-image: url(" + imgB64SdbPartial + "jNkI3QThDIi8+PC9zdmc+); } \
		.sgh_SGv2Dark .sgh_icon_sdb_div.sidebar__navigation__item__count { \
		  opacity: 0.9; \
		  background-image: url(" + imgB64SdbPartial + "jN0M5MDlDIi8+PC9zdmc+); } \
		.sgh_icon_sdb_sec { margin-top: 0px; vertical-align: text-top; display: inline-block; } \
	");
	
	GM_addStyle
	(" \
		/* SGH SteamDB box */ \
		.sgh_sdbBox { border: 1px solid #D2D6E0; max-width: 334px; max-height: 360px; \
		  margin-bottom: 35px; overflow: auto; } \
		.sgh_sdbBox > .table { width: 410px; border: 0; border-collapse: separate; \
		  border-color: #ddd; \
		  font-size: 13px; background-color: #fff; border-spacing: 0; color: #333; } \
		.sgh_sdbBox > .table tr:hover { \
		  background-color: #f5f5f5; } \
		.sgh_sdbBox > .table th { vertical-align: bottom; text-transform: uppercase; \
		  color: #7f7f7f; border-bottom: 1px solid #ddd; background-color: #f5f5f5; \
		  font-weight: 700; font-size: 11px; } \
		.sgh_sdbBox > .table tr:first-child th { \
		  border-top: 0; } \
		.sgh_sdbBox > .table td, .sgh_sdbBox > .table th { \
		  padding: 8px; line-height: 20px; text-align: left; \
		  border-top: 1px solid #ddd; border-left: 1px solid #ddd; } \
		.sgh_sdbBox > .table td:nth-child(1), .sgh_sdbBox > .table th:nth-child(1) { \
		  width: 46px !important; border-left: 0; } \
		.sgh_sdbBox > .table td:nth-child(2), .sgh_sdbBox > .table th:nth-child(2) { \
		  width: 40px !important; } \
		.sgh_sdbBox > .table td:nth-child(4), .sgh_sdbBox > .table th:nth-child(4) { \
		  width: 60px !important; } \
		.sgh_sdbBox > .table td:nth-child(5), .sgh_sdbBox > .table th:nth-child(5) { \
		  display: none; } \
		.sgh_sdbBox a { color: #0072c6; } \
		.sgh_sdbBox .fa { font-size: 16px; } \
		.sgh_sdbBox .owned { background-color: #DDF7D3 !important; } \
	");
}

function attachOnLoad(callback)
{
	window.addEventListener("load", function(e) 
	{
		callback();
	});
}

function attachOnReady(callback) 
{
	document.addEventListener("DOMContentLoaded", function(e) 
	{
		callback();
	});
}

function insertBeforeElement(newNode, referenceNode) 
{
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfterElement(newNode, referenceNode) 
{
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function reload()
{
	var curHref = window.location.href;
	var posHashtag = curHref.indexOf("#");
	if (posHashtag > -1)
	{
		window.location = curHref.substr(0, posHashtag);
	}
	else
	{
		window.location = curHref;
	}
}

function getQueryByName(name, url) 
{
	if (!url) url = location.search;
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(url);
    return (results === null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var isVisible = (function()
{
	var stateKey;
	var eventKey;
	var keys = 
	{
		hidden: "visibilitychange",
		webkitHidden: "webkitvisibilitychange",
		mozHidden: "mozvisibilitychange",
		msHidden: "msvisibilitychange"
	};
	for (stateKey in keys) 
	{
		if (stateKey in document) 
		{
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c) 
	{
		if (c) 
		{
			document.addEventListener(eventKey, c);
		}
		return !document[stateKey];
	}
})();

function addKey(eleListener, eleClick, keyCodes, keyName, keyTitleMode, keyModifierName, checkModifierCallback)
{
	/* 
		eleClick:
			element, query
		keyCodes:
			code, name, array
		keyTitleMode:
			0: do nothing
			1: append value
			2: add title if not exist
			4: override title
			8: append textContent
			16: append textContent of firstElementChild
		keyModifierName:
			Ctrl, Ctrl+Shift, Alt
	*/
	
	keyCodes = keyCodes || [0];
	keyName = keyName || "";
	keyTitleMode = keyTitleMode || 0;
	keyModifierName = keyModifierName || "";
	
	if (typeof checkModifierCallback !== "function")
	{
		checkModifierCallback = function(ev) 
		{
			return ev.ctrlKey && ev.shiftKey && ev.altKey;
		};
	}
	
	if (typeof eleClick === "string")
	{
		keyTitleMode = 0;
	}
	
	if (!Array.isArray(keyCodes))
	{
		keyCodes = [keyCodes];
	}
	
	if (eleListener && eleClick)
	{
		// apply title
		var keyTitle = keyModifierName ? keyModifierName + "+" + keyName : "";
		if (keyTitle !== "" && keyTitleMode !== 0)
		{
			if ((keyTitleMode & 1) === 1)
			{
				// 1: append value
				if (typeof eleClick.value !== "undefined")
				{
					eleClick.value += " (" + keyTitle + ")";
				}
			}
			if ((keyTitleMode & 2) === 2)
			{
				// 2: add title if not exist
				if (!eleClick.title)
				{
					eleClick.title = keyTitle;
				}
			}
			if ((keyTitleMode & 4) === 4)
			{
				// 4: override title
				eleClick.title = keyTitle;
			}
			if ((keyTitleMode & 8) === 8)
			{
				// 8: append textContent
				eleClick.textContent += " (" + keyTitle + ")";
			}
			if ((keyTitleMode & 16) === 16)
			{
				// 16: append textContent of firstElementChild
				if (eleClick.firstElementChild)
				{
					eleClick.firstElementChild.textContent += " (" + keyTitle + ")";
				}
			}
		}
		
		eleListener.addEventListener("keydown", function (ev)
		{
			if (checkModifierCallback(ev))
			{
				var isSameKey = false;
				
				for (var i = 0; i < keyCodes.length; i++)
				{
					var keyCode = keyCodes[i];
					if (typeof keyCode === "number")
					{
						isSameKey = (ev.keyCode === keyCode);
					}
					else
					{
						// Firefox 32+
						isSameKey = (typeof ev.code !== "undefined" && ev.code === keyCode)
					}
					
					if (isSameKey)
					{
						break;
					}
				}
				
				if (isSameKey)
				{
					ev.preventDefault();
					
					var eleClickCur = null;
					
					if (typeof eleClick === "string")
					{
						eleClickCur = document.querySelector(eleClick);
					}
					else
					{
						eleClickCur = eleClick;
					}					
					
					if (eleClickCur)
					{
						eleClickCur.focus();
						eleClickCur.click();
					}
					
					return false;
				}
			}
		}, true);
	}
}

function addKeyCtrl(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Ctrl", function(ev)
	{
		return ev.ctrlKey && !ev.shiftKey && !ev.altKey;
	});
}

var timeoutList = [];
var intervalList = [];

function setTimeoutCustom(func, tm, params)
{
	var id = setTimeout(func, tm, params);
	timeoutList.push(id);
	return id;
}

function clearTimeoutAll()
{
	for (var i = 0; i < timeoutList.length; i++)
	{
		clearTimeout(timeoutList[i]);
	}
}

function setIntervalCustom(func, tm, params)
{
	var id = setInterval(func, tm, params);
	intervalList.push(id);
	return id;
}

function clearIntervalAll()
{
	for (var i = 0; i < intervalList.length; i++)
	{
		clearInterval(intervalList[i]);
	}
}

function randNum(min, max)
{
	return Math.round(Math.random() * (max - min) + min);
}

function normalizeArray(arr)
{
	arr = arr.filter(function(elem, index, self) 
	{
		return index === self.indexOf(elem);
	});
	return arr;
}

function normalizeArray2D(arr)
{
	arr = arr.filter(function(elem, index, self) 
	{		
		for (var i = 0; i < self.length; i++)
		{
			if (self[i][0] === elem[0])
			{
				return index === i;
			}
		}
		
		return false;
	});
	return arr;
}

function getGaId(url)
{
	var rgxSite = /^https?:\/\/((www\.)?steamgifts\.com\/(giveaway|happy-holidays)|www\.sgtools\.info\/giveaways)\//i;
	if (rgxSite.test(url))
	{
		return url.replace(rgxSite, "").split("/")[0];
	}
	
	return "";
}

function getUnixTimestamp()
{
	return parseInt(Date.now() / 1000);
}

function resetProfileCacheTimestamp()
{
	GM_setValue(name_profile_time, 0);
	console.log("Cache: refresh");
}

function isProfileCacheExpired()
{
	var isExpired = false;
	var timestampExpired = 5 * 60;
	
	var profileTimestamp = GM_getValue(name_profile_time, 0);
	
	var profileTimestampDiff = getUnixTimestamp() - profileTimestamp;
	if (profileTimestampDiff > timestampExpired)
	{
		isExpired = true;
	}
	
	if (!isExpired)
	{
		var profileJson = GM_getValue(name_profile_json, 0);
		if (!profileJson)
		{
			isExpired = true;
		}
	}
	
	if (!isExpired)
	{
		console.log("Cache: " + profileTimestampDiff + "s");
	}
	
	return isExpired;
}

function setProfileCache(json)
{
	GM_setValue(name_profile_json, json);
	GM_setValue(name_profile_time, getUnixTimestamp());
}

function markOwned(query, getElementCallback, getProductIdCallback
	, classOwned, classNotInterested, classWished, getCountCallback)
{
	if (!document.querySelector(query))
	{
		//console.log("markOwned: empty");
		return;
	}
	
	if (!getElementCallback)
	{
		getElementCallback = function(ele, type)
		{
			// type -> 1: Owned, 2: Ignored, 3: Wishlist
			return ele;
		};
	}
	
	if (!getProductIdCallback)
	{
		getProductIdCallback = function(ele)
		{
			return ele.getAttribute("href");
		};
	}
	
	if (!getCountCallback)
	{
		getCountCallback = function(appCount, subCount, appOwned, subOwned)
		{
		};
	}
	
	if (!classOwned) classOwned = "";
	if (!classNotInterested) classNotInterested = "";
	if (!classWished) classWished = "";
	
	var apps = [];
	var subs = [];
	
	var rgxId = /[0-9]{3,}/g;
	var rgxApp = /((:\/\/(store\.steampowered\.com|steamcommunity\.com|steamdb\.info)(\/agecheck)?\/app|\/steam\/apps)\/[0-9]+|^[0-9]{3,}$)/i;
	var rgxSub = /(:\/\/(store\.steampowered\.com|steamdb\.info)\/sub|\/steam\/subs)\/[0-9]+/i;
	
	var markFromJson = function(dataRes)
	{
		if (!dataRes)
		{
			//console.log("markFromJson: empty");
			return;
		}
		
		var countOwned = [0, 0];
		var countAll = [0, 0];
		
		if (typeof dataRes["rgOwnedApps"] !== "undefined"
			&& typeof dataRes["rgOwnedPackages"] !== "undefined"
			&& typeof dataRes["rgIgnoredApps"] !== "undefined")
		{
			var eleApps = document.querySelectorAll(query);
			for (var i = 0; i < eleApps.length; i++)
			{
				var attrHref = getProductIdCallback(eleApps[i]);
				var ids = attrHref.match(rgxId);
				if (ids)
				{
					var valId = parseInt(ids[0]);
						
					if (rgxApp.test(attrHref))
					{
						if (dataRes["rgOwnedApps"].indexOf(valId) > -1)
						{
							var ele = getElementCallback(eleApps[i], 1);
							if (ele && classOwned !== "")
							{
								ele.classList.add(classOwned);
							}
							countOwned[0]++;
						}
						else
						{
							//console.log("App: not owned - https://store.steampowered.com/app/" + id + "/");
							if (dataRes["rgWishlist"].indexOf(valId) > -1)
							{
								var ele = getElementCallback(eleApps[i], 3);
								if (ele && classWished !== "")
								{
									ele.classList.add(classWished);
								}
							}
							else if (dataRes["rgIgnoredApps"][valId] === 0)
							{
								var ele = getElementCallback(eleApps[i], 2);
								if (ele && classNotInterested !== "")
								{
									ele.classList.add(classNotInterested);
								}
							}
						}
						countAll[0]++;
					}
					else if (rgxSub.test(attrHref))
					{								
						if (dataRes["rgOwnedPackages"].indexOf(valId) > -1)
						{
							var ele = getElementCallback(eleApps[i], 1);
							if (ele && classOwned !== "")
							{
								ele.classList.add(classOwned);
							}
							countOwned[1]++;
						}
						else
						{
							//console.log("Sub: not owned - https://store.steampowered.com/sub/" + id + "/");
						}
						countAll[1]++;
					}
				}
			}
		}
		
		if (countAll[0] > 1)
		{
			console.log("App: owned " + countOwned[0] + "/" + countAll[0]);
		}
		if (countAll[1] > 1)
		{
			console.log("Sub: owned " + countOwned[1] + "/" + countAll[1]);
		}
		
		getCountCallback(countAll[0], countAll[1], countOwned[0], countOwned[1]);
	}

	// Force mark from cache
	{
		setTimeoutCustom(function()
		{
			// Delay after script ran
			var profileJson = GM_getValue(name_profile_json, 0);
			markFromJson(profileJson);
		}, 300);
	}
		
	if (isProfileCacheExpired())
	{
		GM_xmlhttpRequest(
		{
			method: "GET",
			url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
			onload: function(response) 
			{
				console.log("markOwned: userdata " + response.responseText.length + " bytes");
				
				var dataRes = JSON.parse(response.responseText);
				
				setProfileCache(dataRes);				
				markFromJson(dataRes);
				
			} // End onload
		});
	}
}

function applyIcon(gaUrl, elesGa, className, icon, titleStatus, titleGame)
{
	var gaIdCur = getGaId(gaUrl);
	
	for (var i = 0; i < elesGa.length; i++)
	{
		if (elesGa[i].dataset.sghGaId === gaIdCur)
		{
			if (className && !elesGa[i].classList.contains(className))
			{
				elesGa[i].classList.add(className);

				if (icon || titleStatus)
				{
					var ele = document.createElement("i");
					
					if (icon)
					{
						ele.setAttribute("class", "sgh_fa fa fa-fw " + icon);
					}
					
					if (titleGame)
					{
						if (elesGa[i].hasAttribute("title"))
						{
							if (titleStatus)
							{
								ele.setAttribute("title", titleGame + " - " + titleStatus);
							}
							else
							{
								ele.setAttribute("title", titleGame);
							}
						}
					}
					else if (titleStatus)
					{
						if (elesGa[i].hasAttribute("title"))
						{
							ele.setAttribute("title", titleStatus);
						}
						else
						{
							elesGa[i].setAttribute("title", titleStatus);
						}
					}
					
					elesGa[i].appendChild(ele);
				}
			}
			
			if (titleGame && !elesGa[i].hasAttribute("title"))
			{
				if (titleStatus)
				{
					elesGa[i].setAttribute("title", titleGame + " - " + titleStatus);
				}
				else
				{
					elesGa[i].setAttribute("title", titleGame);
				}
			}
		}
	}
}

function main() 
{	
	var url = document.documentURI;
	var title = document.title;
	
	if (document.querySelector("header"))
	{
		GM_addStyle(" \
			/* SGH Modify CSS */ \
			header { position: fixed; top: 0px; left: 0px; right: 0px; z-index: 6001; } \
			body { padding-top: 39px; } \
		");
	}
	
	var urlSteam = "https://store.steampowered.com/";
	var urlSdb = "https://steamdb.info/";
	
	var detectorContentTemplate = ' \n\
		<a class="sidebar__navigation__item__link" %HREF%> \n\
			<div class="sidebar__navigation__item__name">%NAME%</div> \n\
			<div class="sidebar__navigation__item__underline"></div> \n\
			<div class="sidebar__navigation__item__count">%COUNT%</div> \n\
		</a> ';
		
	// Clean http
	{
		setTimeout(function()
		{
			var urlHttp = "http://www.steamgifts.com/";
			var urlHttps = "https://www.steamgifts.com/";
			
			var elesA = document.querySelectorAll("a[href^='http://www.steamgifts.com/']");
			for (var i = 0; i < elesA.length; i++)
			{
				var url = elesA[i].getAttribute("href");
				if (url.indexOf(urlHttp) === 0)
				{
					url = url.replace(urlHttp, urlHttps);
					elesA[i].setAttribute("href", url);
				}
			}
		}, 10);
	}
	
	// Add SteamDB links
	{
		var eleGas = document.querySelectorAll(".giveaway__icon[href*='://store.steampowered.com/'] \
			, .table__column__secondary-link[href*='://store.steampowered.com/']");
		for (var i = 0; i < eleGas.length; i++)
		{
			var isSteam = false;
			
			var urlNew = eleGas[i].getAttribute("href").replace(urlSteam, urlSdb);
			if (urlNew.indexOf("/sub/") > -1)
			{
				urlNew = urlNew + "apps/#apps";
				isSteam = true;
			}
			else if (urlNew.indexOf("/app/") > -1)
			{
				urlNew = urlNew + "subs/";
				isSteam = true;
			}
			
			if (isSteam)
			{
				var eleA = document.createElement("a");
				eleA.classList.add("sgh_icon_sdb");
				eleA.setAttribute("href", urlNew);
				eleA.setAttribute("target", "_blank");
				eleA.innerHTML = '<div class="sgh_icon_sdb_div"></div>';
					
				if (!eleGas[i].classList.contains("giveaway__icon"))
				{
					eleA.classList.add("sgh_icon_sdb_sec");
				}
				
				insertAfterElement(eleA, eleGas[i]);
			}
		}
	}
	
	// Reset cache before marking
	if (url.indexOf("/account/settings/profile") > -1 || url.indexOf("/giveaways/won") > -1)
	{
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			resetProfileCacheTimestamp();
		}
	}
	
	// Reset cache when pressing F5
	if (GM_getValue(name_config_general_mark_owned_game) === 1)
	{
		document.addEventListener("keydown", function (e)
		{
			if (e.keyCode === 116 || e.code === "F5")
			{
				resetProfileCacheTimestamp();
				window.location.reload();
				e.preventDefault();
				return false;
			}
		}, true);
	}
	
	// Correct GA links
	{
		var rgxMarker = /[^a-z0-9]/ig;
		
		var elesGa = document.querySelectorAll("a[href*='steamgifts.com/giveaway/'], a[href^='/giveaway/']");
		for (var i = 0; i < elesGa.length; i++)
		{
			var isEdited = false;
			
			var strsHref = elesGa[i].href.split("/");
			if (strsHref.length >= 5)
			{
				if (rgxMarker.test(strsHref[4]) && strsHref[4].length > 5)
				{
					strsHref[4] = strsHref[4].replace(rgxMarker, "");
					isEdited = true;
				}
				
				if (strsHref.length == 5)
				{
					strsHref.push("");
					isEdited = true;
				}
			}
			
			if (isEdited)
			{
				elesGa[i].href = strsHref.join("/");
			}
		}
	}
	
	// Hilight owned games and dlcs
	if (GM_getValue(name_config_general_mark_owned_game) === 1)
	{	
		markOwned(":not(.table__column__heading) > .giveaway__icon[href*='store.steampowered.com/']", function(ele)
		{
			return ele.parentElement.parentElement.parentElement.parentElement;
		}, null, "sgh_rowOwned", "sgh_rowNotInterested", "sgh_rowWished");
	}
		
	// Mark owned GA
	if (GM_getValue(name_config_general_mark_owned_giveaway) === 1)
	{
		var elesGa = document.querySelectorAll(" \
			.comments a[href*='steamgifts.com/giveaway/'], .comments a[href^='/giveaway/'] \
			, .page__description a[href*='steamgifts.com/giveaway/'], .page__description a[href^='/giveaway/'] \
			, .comments a[href*='sgtools.info/giveaways/'], .page__description a[href*='sgtools.info/giveaways/'] \
			, .giveaway_box_list a[href^='/happy-holidays/'] ");

		if (elesGa.length > 0)
		{
			var markGaFromJson = function(dataResSteam)
			{
				if (!dataResSteam)
				{
					//console.log("markGaFromJson: empty");
					return;
				}
				
				if (typeof dataResSteam["rgOwnedApps"] === "undefined"
					|| dataResSteam["rgOwnedApps"].length === 0)
				{
					console.log("not logged in");
				}	
				else if (typeof dataResSteam["rgOwnedApps"] !== "undefined"
					&& typeof dataResSteam["rgOwnedPackages"] !== "undefined"
					&& typeof dataResSteam["rgIgnoredApps"] !== "undefined")
				{
					var rgxId = /[0-9]+/;
					var rgxApp = /:\/\/store\.steampowered\.com\/app\/[0-9]+/i;
					var rgxSub = /:\/\/store\.steampowered\.com\/sub\/[0-9]+/i;
					var rgxEnded = /Ended [0-9]+ [a-z]+ ago/i;
					
					var elesGa = document.querySelectorAll(" \
						.comments a[href*='steamgifts.com/giveaway/'] \
						, .comments a[href^='/giveaway/'] \
						, .page__description a[href*='steamgifts.com/giveaway/'] \
						, .page__description a[href^='/giveaway/'] \
						, .comments a[href*='sgtools.info/giveaways/'] \
						, .page__description a[href*='sgtools.info/giveaways/'] \
						, .giveaway_box_list a[href^='/happy-holidays/'] ");
					
					var gaCur = 0;
					var tmId = setInterval(function()
					{
						if (gaCur >= elesGa.length)
						{
							clearInterval(tmId);
						}
						else
						{
							var dataHref = elesGa[gaCur].href;
							if (dataHref)
							{
								var gaId = getGaId(dataHref);
								elesGa[gaCur].dataset.sghGaId = gaId;
								
								GM_xmlhttpRequest(
								{
									method: "GET",
									url: dataHref,
									onload: function(response) 
									{
										var isOwned = false;
										var isFound = true;
										var isHidden = false;
										var isLvlRequired = false;
										var isRegionRestricted = false;
										var isEntered = false;
										var textStatus = "Exists in Account";
										var textGame = "";
										
										var parser = new DOMParser();
										var dataRes = parser.parseFromString(response.responseText, "text/html");
										
										if (response.finalUrl.indexOf("/happy-holidays/") > -1)
										{
											var eleStatus = dataRes.querySelector(".giveaway_box_notification");
											if (eleStatus)
											{
												if (eleStatus.textContent.indexOf("since the game already exists in your account") > -1)
												{
													isOwned = true;
												}
											}
											
											if (isOwned)
											{
												var gaIdCur = getGaId(response.finalUrl);
												var className = "sgh_appOwned";
												
												for (var i = 0; i < elesGa.length; i++)
												{
													if (elesGa[i].dataset.sghGaId === gaIdCur)
													{
														if (className && !elesGa[i].classList.contains(className))
														{
															elesGa[i].classList.add(className);
															elesGa[i].title = "Owned";
														}
													}
												}
											}
										}
										else if (response.finalUrl === "https://www.steamgifts.com/")
										{
											textStatus = "Not found"
												
											console.log("GA: not found - " + dataHref);
											applyIcon(dataHref, elesGa
												, "sgh_gaNotFound", "fa-search-minus", textStatus, textGame);
										}
										else
										{
											var eleGame = dataRes.querySelector(".featured__heading__medium");
											if (eleGame)
											{
												textGame = eleGame.textContent.trim();
												
												var elePoint = dataRes.querySelector(".featured__heading__small");
												if (elePoint)
												{
													if (elePoint.nextElementSibling 
														&& elePoint.nextElementSibling.classList.contains("featured__heading__small"))
													{
														// Copies and Points
														elePoint = elePoint.nextElementSibling;
													}
													textGame += " " + elePoint.textContent.trim();
												}
											}
											
											var eleExist = dataRes.querySelector(".sidebar__error");
											if (eleExist)
											{
												textStatus = eleExist.textContent.trim();
												if (textStatus === "Exists in Account")
												{
													isOwned = true;
												}
												else if (textStatus.indexOf("Level") > -1)
												{
													isLvlRequired = true;
												}
												else if (textStatus.indexOf("Region") > -1)
												{
													isRegionRestricted = true;
												}
											}
											
											if (!isOwned)
											{
												var eleA = dataRes.querySelector(".global__image-outer-wrap[href*='store.steampowered.com/']");
												if (eleA)
												{
													var attrHref = eleA.href;
													var id = rgxId.exec(attrHref);
													if (id)
													{
														var valId = parseInt(id);
															
														if (rgxApp.test(attrHref))
														{
															if (dataResSteam["rgOwnedApps"].indexOf(valId) > -1)
															{
																isOwned = true;
															}
															else
															{
																//console.log("App: not owned - https://store.steampowered.com/app/" + id + "/");
															}
														}
														else if (rgxSub.test(attrHref))
														{								
															if (dataResSteam["rgOwnedPackages"].indexOf(valId) > -1)
															{
																isOwned = true;
															}
															else
															{
																//console.log("Sub: not owned - https://store.steampowered.com/sub/" + id + "/");
															}
														}
													}
												}
												else
												{
													var eleName = dataRes.querySelector(".featured__heading__medium");
													if (!eleName)
													{
														isFound = false;
													}
												}
												
												if (dataRes.querySelector(".featured__container") 
													&& !dataRes.querySelector(".featured__giveaway__hide"))
												{
													isHidden = true;
												}
											}
											
											if (isOwned)
											{
												textStatus = "Exists in Account";
												applyIcon(response.finalUrl, elesGa
													, "sgh_gaOwned", "fa-briefcase", textStatus, textGame);
											}
											else if (isHidden)
											{
												if (dataRes.querySelector(".sidebar__entry-delete:not(.is-hidden)"))
												{
													// Entered
													applyIcon(response.finalUrl
														, elesGa, "sgh_gaEntered", "fa-check-circle", textStatus + " - Entered", textGame);
												}
												else
												{
													console.log("GA: filtered - " + response.finalUrl);
													applyIcon(response.finalUrl, elesGa
														, "sgh_gaFiltered", "fa-eye-slash", "Your filtered game", textGame);
												}
											}
											else if (isLvlRequired)
											{
												console.log("GA: lvl required - " + response.finalUrl);
												applyIcon(response.finalUrl, elesGa
													, "sgh_gaLvlRequired", "fa-level-up", textStatus, textGame);
											}
											else if (isRegionRestricted)
											{
												console.log("GA: region restricted - " + response.finalUrl);
												applyIcon(response.finalUrl, elesGa
													, "sgh_gaRegionRestricted", "fa-exclamation-circle", textStatus, textGame);
											}
											else if (isFound)
											{											
												textStatus = "";
												
												var eleRemain = dataRes.querySelector(".featured__column");
												if (eleRemain)
												{
													textStatus = eleRemain.textContent.trim();
												}
												
												if (rgxEnded.test(textStatus))
												{
													// Ended
													applyIcon(response.finalUrl
														, elesGa, "sgh_gaEnded", "fa-calendar-times-o", textStatus, textGame);
												}
												else
												{							
													console.log("GA: not owned - " + response.finalUrl);
													
													if (dataRes.querySelector(".sidebar__entry-delete:not(.is-hidden)"))
													{
														// Entered
														applyIcon(response.finalUrl
															, elesGa, "sgh_gaEntered", "fa-check-circle", textStatus + " - Entered", textGame);
													}
													else
													{
														var eleErr = dataRes.querySelector(".sidebar__error.is-disabled");
														if (eleErr && eleErr.textContent.trim() === "Missing Base Game")
														{
															// DLC
															applyIcon(response.finalUrl
																, elesGa, "sgh_gaMissingBase", "fa-cubes", textStatus + " - Missing Base Game", textGame);
														}
														else
														{
															// Not owned
															applyIcon(response.finalUrl
																, elesGa, "sgh_gaNotOwned", "", textStatus, textGame);
														}
													}
												}
											}
											else
											{
												console.log("GA: unknown - " + response.finalUrl);
												
												textStatus = "Unknown information";
												
												var iconStatus = "fa-question-circle";
												
												var eleMsg = dataRes.querySelector(".table__row-outer-wrap:nth-child(2) .table__column--width-fill");
												if (eleMsg)
												{
													var textRaw = eleMsg.textContent.trim();
													if (textRaw.indexOf("creator's whitelist") > -1)
													{
														textStatus = "Whitelist only";
														iconStatus = "fa-heart";
													}
													else if (textRaw.indexOf("required Steam groups") > -1)
													{
														textStatus = "Steam groups only";
													}
													else if (textRaw.indexOf("following region") > -1)
													{
														textStatus = textRaw.replace(
															"This giveaway is restricted to the following region", "Region restricted");
													}
													else if (textRaw.indexOf("blacklisted the giveaway creator") > -1)
													{
														textStatus = "You have blacklisted GA creator";
													}
													else if (textRaw.indexOf("blacklisted by the giveaway creator") > -1)
													{
														textStatus = "You have been blacklisted by GA creator";
														iconStatus = "fa-ban";
													}
													else if (textRaw.indexOf("Deleted ") === 0)
													{
														textStatus = textRaw;
														iconStatus = "fa-trash";
													}
													else
													{
														textStatus = textRaw;
													}
												}
												else
												{
													var eleDes = dataRes.querySelector("body > div > .description");
													if (eleDes)
													{
														var textRaw = eleDes.textContent.trim();
														if (textRaw.indexOf("Page not found.") > -1)
														{
															textStatus = "Page not found";
														}
														else
														{
															textStatus = textRaw;
														}
													}
												}
												
												applyIcon(response.finalUrl, elesGa
													, "sgh_gaUnknown", iconStatus, textStatus, textGame);
											}
										}
										
									} // End onload
								});
							}
						}
						gaCur++
					}, 200);
				}
			}
			
			// Force mark from cache
			{
				setTimeoutCustom(function()
				{
					// Delay after script ran
					var profileJson = GM_getValue(name_profile_json, 0);
					markGaFromJson(profileJson);
				}, 300);
			}
			
			if (isProfileCacheExpired())
			{
				GM_xmlhttpRequest(
				{
					method: "GET",
					url: "https://store.steampowered.com/dynamicstore/userdata/?t=" + getUnixTimestamp(),
					onload: function(response) 
					{
						console.log("markOwnedGa: userdata " + response.responseText.length + " bytes");
						
						var dataRes = JSON.parse(response.responseText);
						
						setProfileCache(dataRes);				
						markGaFromJson(dataRes);
						
					} // End onload
				});
			}
		}
	}
		
	var eleMaintain = document.querySelector("body > div > .description");
	if (eleMaintain)
	{
		var text = eleMaintain.textContent;
		if (/(maintenance|database)/i.test(text))
		{
			console.log("autorefresh: maintenance in 3m");
			setTimeoutCustom(function()
			{
				reload();
			}, 180000);
		}
	}
	
	// Paging on top
	if (!/\/(giveaway|discussion|trade)\//i.test(url))
	{
		var eleHead = document.querySelector(".page__heading");
		var elePage = document.querySelector(".pagination:not(.sgh_page)");
		if (eleHead && elePage)
		{
			var elePageNew = elePage.cloneNode(true);
			elePageNew.classList.add("sgh_page");
			insertAfterElement(elePageNew, eleHead);
		}
	}
	
	if (url.indexOf("/giveaway/") > -1)
	{
		setTimeoutCustom(function()
		{
			var eleContainer = document.querySelector(".page__heading, body > div > .description");
			if (!eleContainer)
			{
				if (window === window.parent)
				{
					console.log("autorefresh: no content");
					reload();
				}
			}
		}, 10000);
		
		var eleSearch = document.querySelector(".sidebar__search-container");
		if (eleSearch)
		{
			var eleDttHead = document.createElement("h3");
			eleDttHead.classList.add("sidebar__heading");
			eleDttHead.classList.add("sgh_detector_header");
			eleDttHead.textContent = " Detector ";
			eleDttHead.style.display = "none";
			insertAfterElement(eleDttHead, eleSearch);
			
			var eleDttNav = document.createElement("ul");
			eleDttNav.classList.add("sidebar__navigation");
			eleDttNav.classList.add("sgh_detector_nav");
			eleDttNav.style.display = "none";
			insertAfterElement(eleDttNav, eleDttHead);
			
			var eleRttHead = document.createElement("h3");
			eleRttHead.classList.add("sidebar__heading");
			eleRttHead.classList.add("sgh_information_header");
			eleRttHead.textContent = " Information ";
			eleRttHead.style.display = "none";
			insertAfterElement(eleRttHead, eleDttNav);
			
			var eleRttNav = document.createElement("ul");
			eleRttNav.classList.add("sidebar__navigation");
			eleRttNav.classList.add("sgh_information_nav");
			eleRttNav.style.display = "none";
			insertAfterElement(eleRttNav, eleRttHead);
		}
		
		var warnOwned = function()
		{
			/*setTimeoutCustom(function()
			{
				var divDel = document.querySelector(".sidebar__entry-delete");
				if (divDel)
				{
					if (!divDel.classList.contains("is-hidden") 
						|| !document.querySelector(".featured__giveaway__hide"))
					{
						if (GM_getValue(name_config_ga_autoenter) === 1)
						{
							// Auto remove entry when owned
							divDel.click();
						}
					}
				}
			}, 3000);*/
			
			var eleNav = document.querySelector(".sgh_detector_nav");
			if (eleNav)
			{
				var ele = document.createElement("li");
				ele.classList.add("sidebar__navigation__item");
				
				var content = ' \n\
					<a class="sidebar__navigation__item__link" > \n\
						<div class="sidebar__navigation__item__name">Warning</div> \n\
						<div class="sidebar__navigation__item__underline"></div> \n\
						<div class="sidebar__navigation__item__count">Exists in Account</div> \n\
					</a> ';
					
				ele.innerHTML = content;
				eleNav.style.display = "";
				eleNav.previousElementSibling.style.display = "";
				eleNav.appendChild(ele);
			}
		};

		// Hilight owned
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			if (!isVisible())
			{
				var eleApp = document.querySelector(".global__image-outer-wrap[href*='store.steampowered.com/']");
				if (eleApp)
				{
					eleApp.classList.add("sgh_noTransition");
				}
			}
			
			markOwned(".global__image-outer-wrap[href*='store.steampowered.com/']", function(eleTarget, markType)
			{
				if (markType === 1)
				{
					warnOwned();
				}
				
				return eleTarget;
			}, null, "sgh_appOwned", "sgh_appNotInterested", "sgh_appWished");
			
			
			markOwned(".page__description a[href*='store.steampowered.com/'], \
				.page__description a[href*='steamdb.info/'], \
				.comments a[href*='store.steampowered.com/'], \
				.comments a[href*='steamdb.info/']"
				, null, null, "sgh_linkOwned", "sgh_linkNotInterested", "sgh_linkWished");
		}
		
		// Enter GA
		if (url.indexOf("/entries") < 0 && url.indexOf("#") < 0)
		{
			var isIdle = function()
			{
				var eleText = document.querySelector("textarea[name='description']");
				return (!eleText || eleText.value === "") 
					&& !document.querySelector(".sgh_config.sgh_config_active");
			};
			
			if (document.querySelector(".featured__giveaway__hide"))
			{
				// Not in filtered
				
				var divIns = document.querySelector(".sidebar__entry-insert");
				if (divIns)
				{
					divIns.addEventListener("click", function()
					{
						// After click "Enter Giveaway"
						setTimeoutCustom(function()
						{
							var divLoad = document.querySelector(".sidebar__entry-loading:not(.is-hidden)");
							if (divLoad)
							{
								// Long loading
								
								console.log("autorefresh: long loading");
								setTimeoutCustom(function()
								{
									if(isIdle())
									{
										reload();
									}
								}, 1000);
							}
							else
							{
								var divErr = document.querySelector(".sidebar__error.is-disabled");
								if (divErr)
								{
									if (divErr.textContent.trim() === "Not Enough Points")
									{
										// "Not Enough Points"
										
										console.log("autorefresh: not enough points");
										setTimeoutCustom(function()
										{
											if(isIdle())
											{
												reload();
											}
										}, 1000);
									}
									else
									{
										console.log("autorefresh: error entered");
										setTimeoutCustom(function()
										{
											if(isIdle())
											{
												reload();
											}
										}, 1000);
									}
								}
							}
						}, 5000);
					});
					
					/*if (!divIns.classList.contains("is-hidden"))
					{
						setTimeoutCustom(function()
						{
							if (!document.querySelector(".sgh_appOwned"))
							{
								var divIns = document.querySelector(".sidebar__entry-insert");
								if (divIns)
								{
									if (!divIns.classList.contains("is-hidden"))
									{
										if (GM_getValue(name_config_ga_autoenter) === 1)
										{
											divIns.click();
										}
									}
								}
							}
						}, 2000);
					}*/
				}
				else
				{
					var divErr = document.querySelector(".sidebar__error.is-disabled");
					if (divErr)
					{
						if (divErr.textContent.trim() ===  "Not Enough Points")
						{
							// "Not Enough Points" when page is loaded
							
							setTimeoutCustom(function()
							{
								if (!document.querySelector(".sgh_appOwned"))
								{
									// wait for checking owned
									
									console.log("autorefresh: not enough points in 55s");
									setTimeoutCustom(function()
									{
										if(isIdle())
										{
											reload();
										}
									}, 55000);
								}
							}, 5000);
							
							divErr.classList.add("sgh_pointer");
							divErr.setAttribute("title", "Refresh");
							divErr.addEventListener("click", reload);
						}
					}
				}
			}
		}
		
		// Show points in title
		if (GM_getValue(name_config_ga_title) === 1)
		{
			// Show points if not owned
			// Add checked after entered
			// Add empty box if can enter
		
			var isOwned = false;
			
			var divErr = document.querySelector(".sidebar__error.is-disabled");
			if (divErr)
			{
				if (divErr.textContent.trim() === "Exists in Account")
				{
					isOwned = true;
				}
			}
			else
			{
				var divEntry = document.querySelector(".sidebar__entry-insert, .sidebar__entry-delete");
				if (!divEntry)
				{
					// Ended
					isOwned = true;
				}
			}
			
			if (!isOwned)
			{
				var point = "";
				
				var elePoint = document.querySelector(".featured__heading__small");
				if (elePoint)
				{
					if (elePoint.nextElementSibling
						&& elePoint.nextElementSibling.classList.contains("featured__heading__small"))
					{
						// Copies and Points
						elePoint = elePoint.nextElementSibling;
					}
					
					var execPoint = /[0-9]+P/.exec(elePoint.textContent);
					if (execPoint)
					{
						point = execPoint[0] + " ";
						document.title =  point + title;
					}
				}
				
				var addCheckedTitle = function()
				{
					var iconCheck = "☑️";	// ✔ ☑ ☑️
					var iconBox = "☐";		// ⎕ ☐
						
					var eleDel = document.querySelector(".sidebar__entry-delete");
					if (eleDel)
					{
						if (!eleDel.classList.contains("is-hidden"))
						{
							// Entered
							document.title = iconCheck + point + title;
						}
						else
						{
							var eleIns = document.querySelector(".sidebar__entry-insert:not(.is-hidden)");
							if (eleIns)
							{
								// Can enter
								document.title = iconBox + point + title;
							}
							else
							{
								var eleLoad = document.querySelector(".sidebar__entry-loading:not(.is-hidden)");
								if (eleLoad)
								{
									// Loading
									document.title = iconBox + point + title;
								}
								else
								{
									// Can't enter
									document.title = point + title;
								}
							}
						}
					}
					else
					{
						var eleErr = document.querySelector(".sidebar__error.is-disabled");
						if (eleErr)
						{
							// Not Enough Points 
							document.title = point + title;
						}
					}
				};
				
				addCheckedTitle();
				
				var eleDel = document.querySelector(".sidebar__entry-delete");
				if (eleDel)
				{
					var muTarget_form = eleDel.parentElement;
					if (muTarget_form.tagName === "FORM")
					{
						var muOb_form = new MutationObserver(function(mutations)
						{
							mutations.forEach(function(mutation)
							{
								//console.log(mutation.type + " " + mutation.target.getAttribute("class"));
								//if (mutation.type === "attributes" && mutation.target.tagName === "DIV")
								{
									addCheckedTitle();
								}
							});
						});
						
						var muCf_form = 
						{
							childList: true, 
							subtree: true, 
							attributes: true, 
							attributeFilter: ["class"] 
						};
						
						muOb_form.observe(muTarget_form, muCf_form);
					}
				}
			}
		}
		
		// Add SteamDB link
		{
			var eleCover = document.querySelector(".global__image-outer-wrap[href*='://store.steampowered.com/']");
			if (eleCover)
			{
				var urlNew = eleCover.getAttribute("href").replace(urlSteam, urlSdb);
				if (urlNew.indexOf("/sub/") > -1)
				{
					urlNew = urlNew + "apps/#apps";
				}
				else
				{
					urlNew = urlNew + "subs/";
				}
		
				var eleNav = null;
				var eleNavParent = null;
				
				var eleHeaders = document.querySelectorAll(".sidebar__heading");
				for (var i = 0; i < eleHeaders.length; i++)
				{
					eleNavParent = eleHeaders[i].parentElement;
					if (eleHeaders[i].textContent.trim() === "Stores")
					{
						eleNav = eleHeaders[i].nextElementSibling;
						break;
					}
				}
				
				if (eleNavParent && !eleNav)
				{
					var eleH3 = document.createElement("h3");
					eleH3.classList.add("sidebar__heading");
					eleH3.textContent = "Stores";
					
					eleNavParent.appendChild(eleH3);
					
					eleNav = document.createElement("ul");
					eleNav.classList.add("sidebar__navigation");
					
					eleNavParent.appendChild(eleNav);
				}
				
				if (eleNav && eleNav.classList.contains("sidebar__navigation"))
				{
					var eleNew = document.createElement("li");
					eleNew.classList.add("sidebar__navigation__item");
					eleNew.innerHTML = ' \n\
						<a class="sidebar__navigation__item__link" href="' + urlNew + '" rel="nofollow" target="_blank"> \n\
							<div class="sidebar__navigation__item__name">SteamDB</div> \n\
							<div class="sidebar__navigation__item__underline"></div> \n\
							<div class="sidebar__navigation__item__count sgh_icon_sdb_div"></div> \n\
						</a> ';
					eleNav.appendChild(eleNew);
				}
				
				// Add compatible with SG Add IsThereAnyDeal Data
				if (eleNav)
				{
					setTimeoutCustom(function(eleNav)
					{
						if (eleNav)
						{
							var eleIad = document.querySelector(".isthereanydeal_link");
							if (eleIad)
							{
								insertAfterElement(eleIad.parentElement, eleNav.lastElementChild);
							}
						}
					}, 100, eleNav);
				}
		
				// Add SteamDB box
				if (GM_getValue(name_config_ga_sdb) === 1)
				{
					var eleSide = document.querySelector(".sidebar");
					if (eleSide)
					{
						if (urlNew.indexOf("/sub/") > -1)
						{
							var eleDiv = document.createElement("div");
							eleDiv.classList.add("sgh_sdbBox");
							eleDiv.classList.add("sgh_hidden");
							eleSide.appendChild(eleDiv);
							
							GM_xmlhttpRequest(
							{
								method: "GET",
								url: urlNew,
								onload: function(response) 
								{
									var dataRes = (new DOMParser()).parseFromString(response.responseText, "text/html");
									
									var eleTable = dataRes.querySelector("#apps > .table");
									if (eleTable)
									{
										var eleTh = eleTable.querySelector("th:nth-child(2)");
										if (eleTh)
										{
											eleTh.textContent = "Type";
										}
										
										var elesA = eleTable.querySelectorAll("a");
										for (var i = 0; i < elesA.length; i++)
										{
											var href = elesA[i].getAttribute("href");
											if (href.indexOf("/app/") === 0)
											{
												elesA[i].setAttribute("href", urlSdb + href.substr(1));
											}
											else
											{
												var index = href.indexOf("?utm_source=");
												if (index > -1)
												{
													elesA[i].setAttribute("href", href.substr(0, index));
												}
											}
											
											elesA[i].setAttribute("target", "_blank");
										}
										
										var elesSpan = eleTable.querySelectorAll("span.octicon-globe");
										for (var i = 0; i < elesSpan.length; i++)
										{
											elesSpan[i].classList.add("fa");
											elesSpan[i].classList.add("fa-globe");
										}
										
										eleDiv.appendChild(eleTable);
										eleDiv.classList.remove("sgh_hidden");
									}
									
									if (GM_getValue(name_config_general_mark_owned_game) === 1)
									{
										markOwned(".sgh_sdbBox .table .app", null, function(ele)
										{
											return ele.getAttribute("data-appid");
										}, "owned", null, null, function(appCount, subCount, appOwned, subOwned)
										{
											if (appCount > 0)
											{
												var eleNav = document.querySelector(".sgh_information_nav");
												if (eleNav)
												{
													var ele = document.querySelector(".sgh_information_nav_owned");
													if (!ele)
													{
														ele = document.createElement("li");
														ele.classList.add("sidebar__navigation__item");
														ele.classList.add("sgh_information_nav_owned");
													}
													
													var content = detectorContentTemplate;
													content = content.replace("%NAME%", "App Owned");
													content = content.replace("%COUNT%", appOwned + " / " + appCount);
													content = content.replace("%HREF%", "");
													
													ele.innerHTML = content;
													eleNav.style.display = "";
													eleNav.previousElementSibling.style.display = "";
													eleNav.appendChild(ele);
												}
												
												if (appCount === appOwned)
												{
													var eleApp = document.querySelector(
														".global__image-outer-wrap[href*='store.steampowered.com/']");
													if (eleApp && !eleApp.classList.contains("sgh_appOwned"))
													{
														eleApp.classList.add("sgh_appOwned");
														warnOwned();
													}
												}
											}
										});
									}
									
								} // End onload
							});
						}
					}
				}
			}
		}
		
		// Open image
		{
			if (false)
			{
				setTimeoutCustom(function()
				{
					var eleImgs = document.querySelectorAll(".comment__toggle-attached");
					for (var i = 0; i < eleImgs.length; i++)
					{
						eleImgs[i].click();
					}
				}, 1000);
			}
		}
		
		// Train detector
		{
			var trainUrls = [];
			
			var eleDes = document.querySelector(".page__description");
			if (eleDes)
			{
				var parentGaId = getGaId(url);
				
				var eleAs = eleDes.parentElement.querySelectorAll("a[href*='/giveaway/']");
				for (var i = 0; i < eleAs.length; i++)
				{
					var href = eleAs[i].href;
					var gaId = getGaId(href);
					if (gaId !== parentGaId)
					{
						var arr = [gaId, href, eleAs[i].textContent.trim().toLowerCase(), eleAs[i]];
						trainUrls.push(arr);
					}
				}
				
				var des = "";
				
				if (trainUrls.length === 0)
				{
					var des = eleDes.textContent.trim().replace(/[^a-z0-9]/ig,"");
				}
				
				{
					var elesEm = eleDes.querySelectorAll("em");
					if (elesEm.length === 5)
					{
						var des = "";
						for (var i = 0; i < elesEm.length; i++)
						{
							des += elesEm[i].textContent.trim();
						}
					}
				}
				
				if (des.length === 5 && !/(enjoy|flash)/i.test(des))
				{
					var arr = [des, "https://www.steamgifts.com/giveaway/" + des + "/", "hidden", null];
					trainUrls.push(arr);
				
					var eleNew = document.createElement("a");
					eleNew.setAttribute("href", arr[0]);
					eleNew.setAttribute("title", "Auto Generated");
					eleNew.textContent = " Hidden: " + des;
					
					var eleMark = eleDes.querySelector(".markdown > p");
					if (eleMark)
					{
						eleMark.appendChild(document.createElement("br"));
						eleMark.appendChild(document.createElement("br"));
						eleMark.appendChild(eleNew);
					}
				}
			}
			
			trainUrls = normalizeArray2D(trainUrls);
			
			if (trainUrls.length > 0)
			{
				var rgxBack = /(back|prev|last|past|before|<|◄|⬱|←|⏮|⏪|«|⇦|⬅|↩|⇠|↤|⤶|🔽|◀️|👈)/i;
				var rgxNext = /(next|>|↪|⇢|↦|⤷|🔼|\+|▶️|👉)/i;
				var rgxNotNum = /[^0-9]/g;
				
				var trainUrl = "";
				var eleNext = null;
				var elePrev = null;
				
				if (trainUrls.length === 1)
				{
					if (!rgxBack.test(trainUrls[0][2]) || rgxNext.test(trainUrls[0][2]))
					{
						trainUrl = trainUrls[0][1];
						eleNext = trainUrls[0][3];
					}
				}
				else if (trainUrls.length === 2)
				{
					if (rgxBack.test(trainUrls[1][2]))
					{
						trainUrl = trainUrls[0][1];
						eleNext = trainUrls[0][3];
						elePrev = trainUrls[1][3];
					}
					else if (rgxBack.test(trainUrls[0][2]))
					{
						trainUrl = trainUrls[1][1];
						eleNext = trainUrls[1][3];
						elePrev = trainUrls[0][3];
					}
					else
					{
						if (trainUrls[0][3] && trainUrls[0][3].previousSibling)
						{
							var text = trainUrls[0][3].previousSibling;
							if (text.nodeType === 3)
							{
								if (rgxBack.test(text.textContent))
								{
									trainUrl = trainUrls[1][1];
									eleNext = trainUrls[1][3];
									elePrev = trainUrls[0][3];
								}
							}
						}
					}
					
					if (!trainUrl)
					{
						if (rgxNext.test(trainUrls[1][2]) && !rgxNext.test(trainUrls[0][2]))
						{
							trainUrl = trainUrls[1][1];
							eleNext = trainUrls[1][3];
							elePrev = trainUrls[0][3];
						}
						else if (rgxNext.test(trainUrls[0][2]) && !rgxNext.test(trainUrls[1][2]))
						{
							trainUrl = trainUrls[0][1];
							eleNext = trainUrls[0][3];
							elePrev = trainUrls[1][3];
						}
					}
					
					if (!trainUrl)
					{
						var num1 = trainUrls[0][2].replace(rgxNotNum, "");
						var num2 = trainUrls[1][2].replace(rgxNotNum, "");
						if (num1 && num2)
						{
							if (num1 - num2 === 2)
							{
								trainUrl = trainUrls[0][1];
								eleNext = trainUrls[0][3];
								elePrev = trainUrls[1][3];
							}
							else if (num1 - num2 === -2)
							{
								trainUrl = trainUrls[1][1];
								eleNext = trainUrls[1][3];
								elePrev = trainUrls[0][3];
							}
						}
					}
				}
				
				var eleNav = document.querySelector(".sgh_detector_nav");
				if (eleNav)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = ' \n\
						<a class="sidebar__navigation__item__link" %HREF%> \n\
							<div class="sidebar__navigation__item__name">Train</div> \n\
							<div class="sidebar__navigation__item__underline"></div> \n\
							<div class="sidebar__navigation__item__count">%COUNT%</div> \n\
						</a> ';
					
					if (trainUrl !== "")
					{
						content = content.replace("%HREF%", 'href="' + trainUrl + '"');
					}
					else
					{
						content = content.replace("%HREF%", "");
					}
					
					if (trainUrls.length === 1 && trainUrl === "")
					{
						content = content.replace("%COUNT%", trainUrls.length + " End");
					}
					else
					{
						content = content.replace("%COUNT%", trainUrls.length);
					}
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
				
				if (trainUrl !== "")
				{
					console.log("Train: " + trainUrl);
					
					var isSelf = false;
					
					var eleUser = document.querySelector(".nav__avatar-outer-wrap");
					if (eleUser)
					{
						var eleCreator = document.querySelector(".featured__columns .global__image-outer-wrap--avatar-small");
						if (eleCreator)
						{
							if (eleUser.getAttribute("href") === eleCreator.getAttribute("href"))
							{
								isSelf = true;
							}
						}
					}
					
					if (!isSelf)
					{
						setTimeoutCustom(function(trainUrl)
						{
							var isRide = false;
					
							var eleOwned = document.querySelector(".sgh_appOwned");
							if (eleOwned)
							{
								if (document.querySelector(".sidebar__error, .sidebar__entry-delete.is-hidden"))
								{
									// Skip owned
									isRide = true;
								}
								else 
								{
									var eleTime = document.querySelector("div.featured__column:nth-child(1)");
									if (eleTime && eleTime.textContent.indexOf("Begins in") > -1)
									{
										// Skip future
										isRide = true;
									}
								}
							}
							else
							{
								var divErr = document.querySelector(".sidebar__error.is-disabled");
								if (divErr)
								{
									if (divErr.textContent.trim() ===  "Exists in Account")
									{
										// Skip exists
										isRide = true;
									}
								}
							}
								
							if (!isRide 
								&& document.querySelector(".featured__container") 
								&& !document.querySelector(".featured__giveaway__hide")
								&& !document.querySelector(".sidebar__error[href^='/?login']"))
							{
								// Skip filtered
								isRide = true;
							}
							
							if (isRide)
							{
								if (GM_getValue(name_config_ga_train_rider) === 1
									&& !document.querySelector(".sgh_config.sgh_config_active"))
								{
									window.location = trainUrl;
								}
							}
						}, 3000, trainUrl);
					}
					
					if (eleNext)
					{
						eleNext.classList.add("sgh_train_next");
					}
					
					if (elePrev)
					{
						elePrev.classList.add("sgh_train_prev");
					}
					
					addKeyCtrl(document, eleNext, ["BracketRight", 221, 171]);	// ]
					addKeyCtrl(document, elePrev, ["BracketLeft", 219]);		// [
				}
			}
			
		}
		
		// Warning detector
		{
			var eleDes = document.querySelector(".page__description");
			if (eleDes)
			{
				var des = eleDes.textContent.trim();
				if (/(warn| not | only |n't |dont |doesnt )/i.test(des))
				{
					var eleNav = document.querySelector(".sgh_detector_nav");
					if (eleNav)
					{
						var ele = document.createElement("li");
						ele.classList.add("sidebar__navigation__item");
						
						var content = ' \n\
							<a class="sidebar__navigation__item__link"> \n\
								<div class="sidebar__navigation__item__name">Warning</div> \n\
								<div class="sidebar__navigation__item__underline"></div> \n\
								<div class="sidebar__navigation__item__count">Read Description</div> \n\
							</a> ';
						
						ele.innerHTML = content;
						eleNav.style.display = "";
						eleNav.previousElementSibling.style.display = "";
						eleNav.appendChild(ele);
					}
				}
			}
		}
		
		// Filtered detector
		{
			var eleDes = document.querySelector(".featured__giveaway__hide");
			if (!eleDes && !document.querySelector(".sidebar__error[href^='/?login']"))
			{
				var eleNav = document.querySelector(".sgh_detector_nav");
				if (eleNav)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = ' \n\
						<a class="sidebar__navigation__item__link"> \n\
							<div class="sidebar__navigation__item__name">Warning</div> \n\
							<div class="sidebar__navigation__item__underline"></div> \n\
							<div class="sidebar__navigation__item__count">Filtered Game</div> \n\
						</a> ';
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
			}
		}
		
		// Information detector
		{
			var eleNav = document.querySelector(".sgh_information_nav");
			if (eleNav)
			{
				var eleWhl = document.querySelector(".featured__column--whitelist");
				if (eleWhl)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = detectorContentTemplate;
					content = content.replace("%NAME%", "Restriction");
					content = content.replace("%COUNT%", eleWhl.textContent.trim());
					content = content.replace("%HREF%", "");
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
				
				var eleIvt = document.querySelector(".featured__column--invite-only");
				if (eleIvt)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = detectorContentTemplate;
					content = content.replace("%NAME%", "Restriction");
					content = content.replace("%COUNT%", eleIvt.textContent.trim());
					content = content.replace("%HREF%", "");
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
				
				var eleRgn = document.querySelector(".featured__column--region-restricted");
				if (eleRgn)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = detectorContentTemplate;
					content = content.replace("%NAME%", "Region");
					content = content.replace("%COUNT%", "Restricted");
					content = content.replace("%HREF%", eleRgn.href ? ('href="' + eleRgn.href + '"') : "");
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
				
				var eleGrp = document.querySelector(".featured__column--group");
				if (eleGrp)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = detectorContentTemplate;
					content = content.replace("%NAME%", "Group");
					content = content.replace("%COUNT%", eleGrp.textContent.replace("Gifts for ", "").trim());
					content = content.replace("%HREF%", 'href="' + eleGrp.getAttribute("href") + '"');
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
				
				var eleLvl = document.querySelector(".featured__column--contributor-level");
				if (eleLvl)
				{
					var ele = document.createElement("li");
					ele.classList.add("sidebar__navigation__item");
					
					var content = detectorContentTemplate;
					content = content.replace("%NAME%", "Level");
					content = content.replace("%COUNT%", eleLvl.textContent.replace("Level ", "").trim());
					content = content.replace("%HREF%", "");
					
					ele.innerHTML = content;
					eleNav.style.display = "";
					eleNav.previousElementSibling.style.display = "";
					eleNav.appendChild(ele);
				}
			}
		}
		
		// Show average
		{
			var rgxCopy = /[0-9,]+ Copies/;
			
			var eleHead = document.querySelector(".featured__heading__small");
			if (eleHead)
			{
				var arrCopy = rgxCopy.exec(eleHead.textContent);
				if (arrCopy)
				{						
					var copyStr = arrCopy[0].replace(" Copies", "");
					var copy = parseInt(copyStr.replace(/,/g, "")) || 1;
					
					var eleEntry = document.querySelector(".live__entry-count");
					if (eleEntry)
					{
						var entryStr = eleEntry.textContent;
						var entry = parseInt(entryStr.replace(/,/g, "")) || 0;
						
						var avg = (Math.round(entry / copy) || 1).toLocaleString("en-US");
						
						var ele = document.createElement("li");
						ele.classList.add("sidebar__navigation__item");
						
						var content = detectorContentTemplate;
						content = content.replace("%NAME%", "Average Entries");
						content = content.replace("%COUNT%", avg);
						content = content.replace("%HREF%", "");
						
						ele.innerHTML = content;
						
						insertAfterElement(ele, eleEntry.parentElement.parentElement);
					}
				}
			}
		}
		
		// Bigger buttons
		{
			if (GM_getValue(name_config_ga_bigger) === 1)
			{
				GM_addStyle
				(" \
					.sidebar__entry-insert, .sidebar__entry-delete, \
					  .sidebar__entry-loading, .sidebar__error { \
					    line-height: 64px; } \
				");
			}
		}
	}
	
	if (url === "https://www.steamgifts.com/" || url === "https://www.steamgifts.com" 
		|| url.indexOf("steamgifts.com/?") > -1 || url.indexOf("steamgifts.com?") > -1 
		|| url.indexOf("/giveaways/search") > -1)
	{
		var isInactive = getQueryByName("q") !== "" 
			|| getQueryByName("sub") !== "" 
			|| getQueryByName("app") !== ""
			|| GM_getValue(name_config_home_hide_entered) === 0;
		
		var eleLast = null;
		var eles = document.querySelectorAll(".giveaway__row-inner-wrap");
		for (var i = 0; i < eles.length; i++)
		{
			if (eles[i].classList.contains("is-faded"))
			{
				eles[i].parentElement.classList.add("sgh_rowHidden");
				if (isInactive)
				{
					eles[i].parentElement.classList.add("sgh_rowHidden_inactive");
				}
			}
			else
			{
				eles[i].parentElement.classList.add("sgh_rowShown");
				eleLast = eles[i];
			}
		}
		
		if (eleLast)
		{
			eleLast.parentElement.classList.add("sgh_rowLast");
		}
	
		// Toggle entered rows
		var eleSetting = document.querySelector(".page__heading a[href='/account/settings/giveaways']");
		if (eleSetting)
		{
			var expandTitle = "Toggle Entered Rows: ";
			
			var eleExpand = document.createElement("a");
			eleExpand.setAttribute("href", "");
			eleExpand.setAttribute("onclick", "return false;");
			eleExpand.setAttribute("data-mode", isInactive ? "hide" : "show");
			eleExpand.innerHTML = '<i class="fa fa-expand"></i>';
			eleExpand.title = expandTitle + (isInactive ? "Show" : "Hide");
			
			insertBeforeElement(eleExpand, eleSetting);
			
			eleExpand.addEventListener("click", function(ev)
			{
				var ele = ev.target;
				if (ele.tagName === "I")
				{
					ele = ele.parentElement;
				}
				
				console.log(ele.dataset.mode);
				
				if (ele.dataset.mode === "hide")
				{
					ele.title = expandTitle + "Hide";
					
					var elesRowShown = document.querySelectorAll(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowShown.sgh_rowShown_inactive");
					for (var i = 0; i < elesRowShown.length; i++)
					{
						elesRowShown[i].classList.remove("sgh_rowShown_inactive");
					}
					
					var elesRowHidden = document.querySelectorAll(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowHidden.sgh_rowHidden_inactive");
					for (var i = 0; i < elesRowHidden.length; i++)
					{
						elesRowHidden[i].classList.remove("sgh_rowHidden_inactive");
					}
					
					var eleRowLast = document.querySelector(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowLast.sgh_rowLast_inactive");
					if (eleRowLast)
					{
						eleRowLast.classList.remove("sgh_rowLast_inactive");
					}
					
					ele.dataset.mode = "show";
				}
				else if (ele.dataset.mode === "show")
				{
					ele.title = expandTitle + "Show";
					
					var elesRowHidden = document.querySelectorAll(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowHidden");
					for (var i = 0; i < elesRowHidden.length; i++)
					{
						elesRowHidden[i].classList.add("sgh_rowHidden_inactive");
					}
					
					var eleRowLast = document.querySelector(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowLast");
					if (eleRowLast)
					{
						eleRowLast.classList.add("sgh_rowLast_inactive");
					}
					
					ele.dataset.mode = "invert";
				}
				else // invert
				{
					ele.title = expandTitle + "Invert";
					
					var elesRowShown = document.querySelectorAll(
						":not(.pinned-giveaways__inner-wrap) > .sgh_rowShown");
					for (var i = 0; i < elesRowShown.length; i++)
					{
						elesRowShown[i].classList.add("sgh_rowShown_inactive");
					}
					
					ele.dataset.mode = "hide";
				}
				
				/*var eleWidget = document.querySelector(".page__heading");
				if (eleWidget)
				{
					eleWidget.scrollIntoView();
					window.scrollBy(0, -50);
				}*/
			});
		}
		
		var elePageCopy = document.querySelector(".sgh_page");
		if (elePageCopy)
		{
			elePageCopy.classList.add("sgh_page_border");
		}
		
		var eleSearchNew = document.querySelector(".sidebar__navigation__item__link[href='/giveaways/search?type=new']");
		if (eleSearchNew)
		{
			var eleNav = eleSearchNew.parentElement.parentElement;
			
			var eleNew;
			var eleHead;
			var eleUl;
			
			eleHead = document.createElement("h3");
			eleHead.classList.add("sidebar__heading");
			eleHead.textContent = "Filters";
			insertAfterElement(eleHead, eleNav);
			
			eleUl = document.createElement("ul");
			eleUl.classList.add("sidebar__navigation");
			insertAfterElement(eleUl, eleHead);

			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_region_1");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?region_restricted=true"> \n\
					<div class="sidebar__navigation__item__name">Region</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Restricted</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_level_1");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?level_min=1"> \n\
					<div class="sidebar__navigation__item__name">Level</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Min 1</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_copy_2");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?copy_min=2"> \n\
					<div class="sidebar__navigation__item__name">Copy</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Min 2</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_point_0");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?point_max=0"> \n\
					<div class="sidebar__navigation__item__name">Point</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Max 0</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_entry_100");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?entry_max=100"> \n\
					<div class="sidebar__navigation__item__name">Entry</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Max 100</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_entry_500");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?entry_max=500"> \n\
					<div class="sidebar__navigation__item__name">Entry</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Max 500</div> \n\
				</a>';
			eleUl.appendChild(eleNew);

			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_entry_1000");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?entry_max=1000"> \n\
					<div class="sidebar__navigation__item__name">Entry</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Max 1000</div> \n\
				</a>';
			eleUl.appendChild(eleNew);

			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.classList.add("sgh_entry_min_1000");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/giveaways/search?entry_min=1000&amp;copy_max=1"> \n\
					<div class="sidebar__navigation__item__name">Entry</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
					<div class="sidebar__navigation__item__count">Over 1000</div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleHead = document.createElement("h3");
			eleHead.classList.add("sidebar__heading");
			eleHead.textContent = "Discussions";
			insertAfterElement(eleHead, eleUl);
			
			eleUl = document.createElement("ul");
			eleUl.classList.add("sidebar__navigation");
			insertAfterElement(eleUl, eleHead);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/discussions/search?q=train&h=end" target="_blank"> \n\
					<div class="sidebar__navigation__item__name">Trains</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			eleNew = document.createElement("li");
			eleNew.classList.add("sidebar__navigation__item");
			eleNew.innerHTML = 
				'<a class="sidebar__navigation__item__link" href="/discussions/deals" target="_blank"> \n\
					<div class="sidebar__navigation__item__name">Deals</div> \n\
					<div class="sidebar__navigation__item__underline"></div> \n\
				</a>';
			eleUl.appendChild(eleNew);
			
			var qCopyMin = getQueryByName("copy_min");
			var qEntryMax = getQueryByName("entry_max");
			var qEntryMin = getQueryByName("entry_min");
			var qRegion = getQueryByName("region_restricted");
			var qLevelMin = getQueryByName("level_min");
			var qPointMax = getQueryByName("point_max");
			
			
			if (qCopyMin === "2" || qEntryMax === "100" || qEntryMax === "500" || qEntryMax === "1000" 
				|| qEntryMin === "1000"|| qRegion === "true" || qLevelMin === "1" || qPointMax === "0")
			{
				var eleSelected = document.querySelector(".sidebar__navigation__item.is-selected .fa-caret-right");
				if (eleSelected)
				{
					eleSelected.parentElement.parentElement.classList.remove("is-selected");
					eleSelected.parentElement.removeChild(eleSelected);
					
					var sEntry = "";
					
					if (qCopyMin === "2")
					{
						sEntry = ".sgh_copy_2";
					}
					else if (qRegion === "true")
					{
						sEntry = ".sgh_region_1";
					}
					else if (qLevelMin === "1")
					{
						sEntry = ".sgh_level_1";
					}
					else if (qPointMax === "0")
					{
						sEntry = ".sgh_point_0";
					}
					else if (qEntryMin === "1000")
					{
						sEntry = ".sgh_entry_min_" + qEntryMin;
					}
					else
					{
						sEntry = ".sgh_entry_" + qEntryMax;
					}
					
					var eleEntry = document.querySelector(sEntry);
					if (eleEntry)
					{
						eleEntry.classList.add("is-selected");
						
						var eleI = document.createElement("i");
						eleI.classList.add("fa");
						eleI.classList.add("fa-caret-right");
						insertBeforeElement(eleI, eleEntry.firstElementChild.firstElementChild);
					}
				}
			}
		}
		
		// Move poll when voted
		{
			var elePoll = document.querySelector("div.homepage_heading");
			if (elePoll && elePoll.textContent.trim() === "Community Poll" 
				&& elePoll.parentElement.querySelector(".poll--enable-results"))
			{
				var eleParent = elePoll.parentElement.parentElement;
				insertAfterElement(eleParent, eleParent.nextElementSibling);
			}
		}
	}
	
	if (url.indexOf("/giveaways/search") > -1)
	{
		if (getQueryByName("page") !== "")
		{
			var eleWidget = document.querySelector(".page__heading");
			if (eleWidget)
			{
				if (document.querySelectorAll(".giveaway__row-outer-wrap:not(.sgh_rowHidden)").length > 2)
				{
					setTimeoutCustom(function()
					{
						eleWidget.scrollIntoView();
						window.scrollBy(0, -50);
					}, 300);
				}
			}
		}
	}
	
	if (url.indexOf("/user/") > -1)
	{
		var eleLevel = document.querySelector("div.featured__table__column:nth-child(2) \
			> div:nth-child(4) > div:nth-child(2) > span:nth-child(1)");
		if (eleLevel)
		{
			var tooltip = eleLevel.getAttribute("data-ui-tooltip");
			var json = JSON.parse(tooltip);
			if (json && json.rows[0].columns[0].name === "Contributor Level")
			{
				document.title = title + " - " + json.rows[0].columns[1].name;
			}
		}
	}
	
	if (url.indexOf("/account/settings/giveaways/filters") > -1)
	{
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			markOwned(".table__column__secondary-link[href*='store.steampowered.com/']", function(eleTarget)
			{
				return eleTarget.parentElement.parentElement
					.parentElement.parentElement;
			}, null, "sgh_rowEnterOwned", "sgh_rowEnterNotInterested", "sgh_rowEnterWished");
		}
	}
	
	if (url.indexOf("/giveaways/created") > -1 
		|| url.indexOf("/giveaways/entered") > -1 
		|| url.indexOf("/giveaways/wishlist") > -1 
		|| url.indexOf("/giveaways/won") > -1 
		|| url.indexOf("/account/steam/games") > -1 
		|| url.indexOf("/account/steam/wishlist") > -1 
		|| url.indexOf("/bundle-games") > -1 )
	{
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			markOwned(".global__image-inner-wrap", function(eleTarget)
			{
				return eleTarget.parentElement.parentElement.parentElement.parentElement;
			}, function(eleTarget)
			{
				return eleTarget.style.backgroundImage;
			}, "sgh_rowEnterOwned", "sgh_rowEnterNotInterested", "sgh_rowEnterWished");
			
			markOwned(".table_image_thumbnail", function(eleTarget)
			{
				return eleTarget.parentElement.parentElement.parentElement;
			}, function(eleTarget)
			{
				return eleTarget.style.backgroundImage;
			}, "sgh_rowEnterOwned", "sgh_rowEnterNotInterested", "sgh_rowEnterWished");
		}
		
		if (url.indexOf("/giveaways/entered") > -1)
		{
			// Show average
			{
				var rgxCopy = /[0-9,]+ Copies/;
				
				var elesHead = document.querySelectorAll(".table__column__heading");
				for (var i = 0; i < elesHead.length; i++)
				{
					var arrCopy = rgxCopy.exec(elesHead[i].textContent);
					if (arrCopy)
					{						
						var copyStr = arrCopy[0].replace(" Copies", "");
						var copy = parseInt(copyStr.replace(/,/g, "")) || 1;
						
						var eleEntry = elesHead[i].parentElement.parentElement.parentElement
							.lastElementChild.previousElementSibling.previousElementSibling;
						var entryStr = eleEntry.textContent;
						var entry = parseInt(entryStr.replace(/,/g, "")) || 0;
						
						eleEntry.innerHTML = entryStr
							+ " <br/> Avg: " + (Math.round(entry / copy) || 1).toLocaleString("en-US");
						
					}
				}
			}
		}
		else if (url.indexOf("/giveaways/won") > -1)
		{
			var elesIcon = document.querySelectorAll(".icon_to_clipboard");
			for (var i = 0; i < elesIcon.length; i++)
			{
				elesIcon[i].addEventListener("click", function(ev)
				{
					GM_setClipboard(ev.target.getAttribute("data-clipboard-text"));
				});
			}
			
			var eleHead = document.querySelector(".widget-container .page__heading__breadcrumbs");
			if (eleHead)
			{			
				var eleA = document.createElement("a");
				eleA.setAttribute("href", "https://store.steampowered.com/account/registerkey");
				eleA.innerHTML = '<i class="fa fa-key"></i>';
				eleA.title = "Activate product key on Steam";
				eleA.setAttribute("target", "_blank");
				
				insertAfterElement(eleA, eleHead);
			}
		}
	}
	
	// Deprecated
	if (url.indexOf("/sales/") > -1)
	{
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			markOwned(".global__image-inner-wrap", 
				function(eleTarget)
				{
					return eleTarget.parentElement.parentElement
						.parentElement.parentElement;
				},
				function(eleTarget)
				{
					return eleTarget.style.backgroundImage;
				}, "sgh_rowEnterOwned", "sgh_rowEnterNotInterested", "sgh_rowEnterWished");
		}
	}
	
	if (url.indexOf("/discussion/") > -1 || url.indexOf("/trade/") > -1)
	{
		if (GM_getValue(name_config_general_mark_owned_game) === 1)
		{
			markOwned("a[href*='store.steampowered.com/'], a[href*='steamdb.info/']", function(eleTarget, markType)
			{
				var isRow = false;
				
				var eleLabel = eleTarget.parentElement.parentElement;
				
				if (eleLabel.tagName !== "TR")
				{
					eleLabel = eleLabel.parentElement;
				}
				if (eleLabel.tagName !== "TR")
				{
					eleLabel = eleLabel.parentElement;
				}
				if (eleLabel.tagName === "TR")
				{
					isRow = true;
					if (markType === 1)
					{
						eleLabel.classList.add("sgh_rowEnterOwned");
					}
					else if (markType === 2)
					{
						eleLabel.classList.add("sgh_rowEnterNotInterested");
					}
					else if (markType === 3)
					{
						eleLabel.classList.add("sgh_rowEnterWished");
					}
				}
				
				if (!isRow)
				{
					if (markType === 1)
					{
						eleTarget.classList.add("sgh_linkOwned");
					}
					else if (markType === 2)
					{
						eleTarget.classList.add("sgh_linkNotInterested");
					}
					else if (markType === 3)
					{
						eleTarget.classList.add("sgh_linkWished");
					}
				}
			}, null, "", "", "");
		}
		
		var eleContent = document.querySelector(".comment__display-state");
		if (eleContent)
		{
			// Show hidden GA
			{
				var hidden = "";
				var elesHidden = eleContent.querySelectorAll("strong");
				if (elesHidden.length === 5)
				{
					for (var i = 0; i < elesHidden.length; i++)
					{
						hidden += elesHidden[i].textContent.trim();
					}
				}
				
				if (hidden.length === 5)
				{
					var eleNew = document.createElement("a");
					eleNew.setAttribute("href", "https://www.steamgifts.com/giveaway/" + hidden + "/");
					eleNew.setAttribute("title", "Auto Generated");
					eleNew.textContent = " Hidden: " + hidden;
					
					var elePLast = eleContent.querySelector(".comment__description > p:last-child");
					if (elePLast)
					{
						var elePNew = document.createElement("p");
						elePNew.appendChild(eleNew);
						
						insertAfterElement(elePNew, elePLast)
					}
				}
			}
		
			// Detect GA
			{
				var elesA = eleContent.querySelectorAll("a");
				for (var i = 0; i < elesA.length; i++)
				{
					if (elesA[i].getAttribute("href").length === 5)
					{
						elesA[i].setAttribute("href", "https://www.steamgifts.com/giveaway/" 
							+ elesA[i].getAttribute("href") + "/");
					}
				}

				var elesGa = eleContent.querySelectorAll("a[href*='steamgifts.com/giveaway/'], a[href^='/giveaway/']");
				var elesTl = eleContent.querySelectorAll("a[href*='sgtools.info/giveaways/']");
				var elesPz = eleContent.querySelectorAll("a[href*='itstoohard.com/puzzle/'], a[href*='jigidi.com/']");
				
				function countUrl(eles)
				{
					var urls = [];
					
					for (var i = 0; i < eles.length; i++)
					{
						urls.push(eles[i].getAttribute("href"));
					}
					
					urls = normalizeArray(urls);
					
					return urls.length;
				}
				
				var countGa = countUrl(elesGa);
				var countTl = countUrl(elesTl);
				var countPz = countUrl(elesPz);
				
				if (countPz + countTl + countGa > 0)
				{
					var eleSide = document.querySelector(".sidebar__search-container");
					if (eleSide)
					{
						var eleH = document.createElement("h3");
						eleH.classList.add("sidebar__heading");
						eleH.classList.add("sgh_detector_header");
						eleH.textContent = " Detector ";
						insertAfterElement(eleH, eleSide);
						
						var eleNav = document.createElement("ul");
						eleNav.classList.add("sidebar__navigation");
						eleNav.classList.add("sgh_detector_nav");
						insertAfterElement(eleNav, eleH);
						
						if (countGa > 0)
						{
							var ele = document.createElement("li");
							ele.classList.add("sidebar__navigation__item");
							
							var content = detectorContentTemplate;
							content = content.replace("%NAME%", "Giveaway");
							content = content.replace("%COUNT%", countGa);
							
							if (countGa === 1)
							{
								content = content.replace("%HREF%", 'href="' + elesGa[0].getAttribute("href") + '"');
							}
							else
							{
								content = content.replace("%HREF%", "");
							}
							
							ele.innerHTML = content;
							eleNav.appendChild(ele);
						}
						
						if (countTl > 0)
						{
							var ele = document.createElement("li");
							ele.classList.add("sidebar__navigation__item");
							
							var content = detectorContentTemplate;
							content = content.replace("%NAME%", "SGTools");
							content = content.replace("%COUNT%", countTl);
							
							if (countTl === 1)
							{
								content = content.replace("%HREF%", 'href="' + elesTl[0].getAttribute("href") + '"');
							}
							else
							{
								content = content.replace("%HREF%", "");
							}
							
							ele.innerHTML = content;
							eleNav.appendChild(ele);
						}
						
						if (countPz > 0)
						{
							var ele = document.createElement("li");
							ele.classList.add("sidebar__navigation__item");
							
							var content = detectorContentTemplate;
							content = content.replace("%NAME%", "Puzzle");
							content = content.replace("%COUNT%", countPz);
							
							if (countPz === 1)
							{
								content = content.replace("%HREF%", 'href="' + elesPz[0].getAttribute("href") + '"');
							}
							else
							{
								content = content.replace("%HREF%", "");
							}
							
							ele.innerHTML = content;
							eleNav.appendChild(ele);
						}
					}
				}
			}
		}
		
		// Add GA shortcut
		if (url.indexOf("/discussion/") > -1)
		{
			var eleSide = document.querySelector(".sidebar");
			if (eleSide)
			{
				var eleForm = document.createElement("form");
				eleForm.classList.add("sgh_ga_shortcut_form");
				eleForm.setAttribute("onsubmit", "return false;");
				
				var eleDiv = document.createElement("div");
				eleDiv.classList.add("sidebar__search-container");
				eleForm.appendChild(eleDiv);
				
				var eleInput = document.createElement("input");
				eleInput.classList.add("sgh_ga_shortcut_input");
				eleInput.setAttribute("type", "text");
				eleInput.setAttribute("placeholder", "Insert GA ID here...");
				eleInput.setAttribute("value", "");
				eleDiv.appendChild(eleInput);
				
				eleInput.addEventListener("keyup", function(e)
				{
					e.target.value = e.target.value.replace(/[^a-z0-9]/ig, "");
					
					if (e.keyCode === 13)
					{
						var eleLink = document.querySelector(".sgh_ga_shortcut_link");
						if (eleLink)
						{
							var val = e.target.value;
							if (val.length === 5)
							{
								eleA.setAttribute("href", "https://www.steamgifts.com/giveaway/" + val + "/");
								eleA.click();
							}
						}
					}
				});
				
				var eleA = document.createElement("a");
				eleA.classList.add("sgh_ga_shortcut_link");
				eleA.setAttribute("target", "_blank");
				eleA.setAttribute("href", "");
				eleDiv.appendChild(eleA);
				
				var eleI = document.createElement("i");
				eleI.classList.add("fa");
				eleI.classList.add("fa-gift");
				eleDiv.appendChild(eleI);
				
				eleSide.appendChild(eleForm);
			}
		}
		
		// Change GA code to url
		{
			var rgxGa = /(https:\/\/www\.steamgifts\.com\/giveaway\/|https?:\/\/www\.sgtools\.info\/giveaways\/)[^ )}]+/ig;
			
			var elesCode = document.querySelectorAll(".comment__description > pre > code, .comment__description > p > code");
			for (var i = 0; i < elesCode.length; i++)
			{
				var resGa = elesCode[i].textContent.match(rgxGa);
				if (resGa)
				{
					var gaIdArr = [];
					
					var elesAGa = elesCode[i].parentElement.parentElement.querySelectorAll(" \
						a[href*='steamgifts.com/giveaway/'] \
						, a[href^='/giveaway/'] \
						, a[href*='sgtools.info/giveaways/'] ");
					for (var j = 0; j < elesAGa.length; j++)
					{
						gaIdArr.push(getGaId(elesAGa[j].href));
					}
					
					gaIdArr = normalizeArray(gaIdArr);
				
					var elePre = null;
					var countShow = 0;
					
					for (var j = 0; j < resGa.length; j++)
					{
						var urlGa = resGa[j];
						var gaId = getGaId(urlGa);
						
						if (gaId.length > 0)
						{
							if (!elePre)
							{
								elePre = document.createElement("pre");
								insertAfterElement(elePre, elesCode[i].parentElement);
							}
							
							var eleA = document.createElement("a");
							eleA.setAttribute("href", urlGa);
							eleA.textContent = urlGa;
							elePre.appendChild(eleA);
							elePre.appendChild(document.createElement("br"));
							
							if (gaIdArr.indexOf(gaId) > -1)
							{
								eleA.classList.add("sgh_hidden");
								eleA.nextElementSibling.classList.add("sgh_hidden");
							}
							else
							{
								countShow++;
							}
						}
					}
					
					if (countShow < 1)
					{
						elePre.classList.add("sgh_hidden");
					}
				}
			}
		}
		
	}
	
	if (url.indexOf("/discussions/search") > -1)
	{
		if (getQueryByName("h") === "end")
		{
			var rgxEnd = /[^a-z](ended|expired|finished|over)[^a-z]/i;
			var elesHead = document.querySelectorAll(".table__column__heading");
			for (var i = 0; i < elesHead.length; i++)
			{
				if (rgxEnd.test(" " + elesHead[i].textContent + " "))
				{
					elesHead[i].parentElement.parentElement.parentElement.parentElement.classList.add("sgh_rowHidden");
				}
			}
		}
	}
	
	// Hide owned GA
	if (GM_getValue(name_config_general_mark_owned_giveaway) === 1)
	{
		if (url.indexOf("/giveaway/") > -1 || url.indexOf("/discussion/") > -1)
		{
			var eleHead = document.querySelector(".widget-container .page__heading__breadcrumbs");
			
			var eleHide = document.createElement("a");
			eleHide.setAttribute("href", "");
			eleHide.setAttribute("onclick", "return false;");
			eleHide.setAttribute("data-mode", "hide");
			eleHide.innerHTML = '<i class="fa fa-expand"></i>';
			eleHide.title = "Toggle Hide Owned GA";
			
			insertAfterElement(eleHide, eleHead);
			
			eleHide.addEventListener("click", function(ev)
			{
				var ele = ev.target;
				if (ele.tagName === "I")
				{
					ele = ele.parentElement;
				}
				
				var eleStyle = document.querySelector("#sgh_style_hide_owned_ga");
				if (!eleStyle)
				{
					eleStyle = document.createElement("style");
					eleStyle.id = "sgh_style_hide_owned_ga";
					eleStyle.setAttribute("type", "text/css");
					document.head.appendChild(eleStyle);
				}
				
				if (ele.dataset.mode === "hide")
				{
					eleStyle.textContent = " .sgh_gaOwned { visibility: hidden; } ";
					ele.dataset.mode = "show";
				}
				else
				{
					eleStyle.textContent = "";
					ele.dataset.mode = "hide";
				}
			});
		}
	}
	
	var eleLogout = document.querySelector(".nav__row.js__logout");
	if (eleLogout)
	{
		var eleRight = document.querySelector(".nav__right-container > .nav__button-container");
		if (eleRight)
		{
			var eleEnt = document.createElement("div");
			eleEnt.setAttribute("class", "nav__button-container nav__button-container--notification")
			eleEnt.innerHTML = '<a title="Giveaways Entered" class="nav__button" \n\
				href="/giveaways/entered"><i class="fa fa-tag"></i></a>';
			
			insertBeforeElement(eleEnt, eleRight);
		}
	}
	
	var divBtn = document.querySelectorAll(".nav__button-container--inactive");
	for (var i = 0; i < divBtn.length; i++)
	{
		divBtn[i].classList.remove("nav__button-container--inactive");
	}
			
	// Move Ads
	{
		var eleAdsSide = document.querySelector(".sidebar__mpu");
		if (eleAdsSide)
		{
			eleAdsSide.parentElement.appendChild(eleAdsSide);
		}
		
		var elePat = document.querySelector("a[href*='://www.patreon.com/steamgifts']");
		if (elePat)
		{
			elePat.parentElement.parentElement.appendChild(elePat.parentElement);
		}
		
		var eleHb = document.querySelector(".humble_block");
		if (eleHb)
		{
			eleHb.parentElement.parentElement.appendChild(eleHb.parentElement);
		}
		
		var eleAdsBar = document.querySelector("div:not(.sidebar__mpu) > div[id^='div-gpt-ad-']");
		if (eleAdsBar)
		{
			eleAdsBar.parentElement.parentElement.appendChild(eleAdsBar.parentElement);
		}
	}
	
	setTimeout(function()
	{
		if (window === window.parent)
		{
			document.body.classList.add("sgh_body");
			if (document.querySelector(".SGv2-Dark-button:not(.light)"))
			{
				document.body.classList.add("sgh_SGv2Dark");
			}
		}
	}, 100);
	
	window.addEventListener("beforeunload", function(e) 
	{
		clearTimeoutAll();
		clearIntervalAll();
	});
}

var name_config_sgh_welcome = "sgh_config_sgh_welcome";
var name_config_sgh_active = "sgh_config_sgh_active";
var name_config_general_mark_owned_game = "sgh_config_general_mark_owned_game";
var name_config_general_mark_owned_giveaway = "sgh_config_general_mark_owned_giveaway";
var name_config_home_hide_entered = "sgh_config_home_hide_entered";
//var name_config_ga_autoenter = "sgh_config_ga_autoenter";
var name_config_ga_title = "sgh_config_ga_title";
var name_config_ga_train_rider = "sgh_config_ga_train_rider";
var name_config_ga_bigger = "sgh_config_ga_bigger";
var name_config_ga_sdb = "sgh_config_ga_sdb";

var name_profile_json = "sgh_profile_json";
var name_profile_time = "sgh_profile_time";

function initAllConfig()
{
	// Short-circuit evaluation
	GM_getValue(name_config_sgh_welcome, -1) === -1 && GM_setValue(name_config_sgh_welcome, 0);
	
	GM_getValue(name_config_sgh_active, -1) === -1 && GM_setValue(name_config_sgh_active, 1);
	GM_getValue(name_config_general_mark_owned_game, -1) === -1 && GM_setValue(name_config_general_mark_owned_game, 1);
	GM_getValue(name_config_general_mark_owned_giveaway, -1) === -1 && GM_setValue(name_config_general_mark_owned_giveaway, 1);
	GM_getValue(name_config_home_hide_entered, -1) === -1 && GM_setValue(name_config_home_hide_entered, 1);
	//GM_getValue(name_config_ga_autoenter, -1) === -1 && GM_setValue(name_config_ga_autoenter, 0);
	GM_getValue(name_config_ga_title, -1) === -1 && GM_setValue(name_config_ga_title, 1);
	GM_getValue(name_config_ga_train_rider, -1) === -1 && GM_setValue(name_config_ga_train_rider, 1);
	GM_getValue(name_config_ga_bigger, -1) === -1 && GM_setValue(name_config_ga_bigger, 0);
	GM_getValue(name_config_ga_sdb, -1) === -1 && GM_setValue(name_config_ga_sdb, 1);
}

function updateConfigAll()
{
	updateConfigBool(name_config_sgh_active);
	updateConfigBool(name_config_general_mark_owned_game);
	updateConfigBool(name_config_general_mark_owned_giveaway);
	updateConfigBool(name_config_home_hide_entered);
	//updateConfigBool(name_config_ga_autoenter);
	updateConfigBool(name_config_ga_title);
	updateConfigBool(name_config_ga_train_rider);
	updateConfigBool(name_config_ga_bigger);
	updateConfigBool(name_config_ga_sdb);
}

function clearAllConfig()
{
	var keep = [];
	var config = GM_listValues();
	debug("clearAllConfig: " + config.length);
	for (var i = 0; i < config.length; i++)
	{
		if (keep.indexOf(config[i]) < 0)
		{
			GM_deleteValue(config[i]);
		}
	}
}

function getConfigQuery(name)
{
	return ".sgh_config input[name='" + name + "']";
}

function createConfigBool(number, heading, name, enabled, description)
{
	enabled = (typeof enabled === "undefined") ? GM_getValue(name) : enabled;
	enabled = (enabled === 1 || enabled === true);
	
	description = (typeof description === "string") ? description : "";
	
	var content = ' \n\
		<div class="form__row"> \n\
			<div class="form__heading"> \n\
				<div class="form__heading__number">' + number + '.</div> \n\
				<div class="form__heading__text">' + heading + '</div> \n\
			</div> \n\
			<div class="form__row__indent"> \n\
				<div>' + description + '</div> \n\
				<div> \n\
					<input name="' + name + '" value="'+ (enabled ? 1 : 0) +'" type="hidden"> \n\
					<div data-checkbox-value="1" class="form__checkbox \n\
						' + (enabled ? "is-selected" : "is-disabled") + '"> \n\
						<i class="form__checkbox__default fa fa-circle-o"></i> \n\
						<i class="form__checkbox__hover fa fa-circle"></i> \n\
						<i class="form__checkbox__selected fa fa-check-circle"></i> Yes \n\
					</div> \n\
					<div data-checkbox-value="0" class="form__checkbox \n\
						' + (!enabled ? "is-selected" : "is-disabled") + '"> \n\
						<i class="form__checkbox__default fa fa-circle-o"></i> \n\
						<i class="form__checkbox__hover fa fa-circle"></i> \n\
						<i class="form__checkbox__selected fa fa-check-circle"></i> No \n\
					</div> \n\
				</div> \n\
			</div> \n\
		</div> \n\
		';
	return content;
}

function updateConfigBool(name, enabled)
{
	enabled = (typeof enabled === "undefined") ? GM_getValue(name) : enabled;
	enabled = (enabled === 1 || enabled === true);
	
	var eleInput = document.querySelector(getConfigQuery(name));
	if (eleInput)
	{
		eleInput.value = (enabled ? 1 : 0);
		eleInput.nextElementSibling.classList.add(enabled ? "is-selected" : "is-disabled");
		eleInput.nextElementSibling.classList.remove(!enabled ? "is-selected" : "is-disabled");
		eleInput.nextElementSibling.nextElementSibling
			.classList.add(!enabled ? "is-selected" : "is-disabled");
		eleInput.nextElementSibling.nextElementSibling
			.classList.remove(enabled ? "is-selected" : "is-disabled");
	}
}

function mainConfig()
{	
	GM_addStyle
	(" \
		/* SGH Config CSS */ \
		.sgh_config { opacity: 0; visibility: hidden; position: fixed; z-index: 9997; \
		  transition: visibility 0.3s, opacity 0.3s; } \
		.sgh_config.sgh_config_active { opacity: 1; visibility: visible; } \
		.sgh_config_bg { display: block; background-color: #3C424D; position: fixed; \
		  top: 0px; bottom: 0px; left: 0px; right: 0px; opacity: 0.85; z-index: 9998; } \
		.sgh_config_detail { display: block; opacity: 1; z-index: 9999; \
		  position: fixed; top: 20px; bottom: 20px; width: 600px; left: 50%; margin-left: -300px; \
		  padding: 20px 20px; background-color: #f0f2f5; border-radius: 4px; \
		  text-align: center; text-shadow: 1px 1px rgba(255,255,255,0.94); } \
		.sgh_SGv2Dark .sgh_config_detail { background-color: #181816; text-shadow: none; } \
		.sgh_config .popup__description { font-weight: 300; font-size: 12px; \
		  max-width: 400px; margin: 0 auto; overflow: auto; \
		  position: absolute; left: 0px; right: 0px; top: 86px; bottom: 50px; } \
		.sgh_config .popup__actions { margin: 0 auto; \
		  position: absolute; left: 0px; right: 0px; bottom: 0px; height: 40px; } \
		.sgh_config .label { cursor: pointer; } \
		.sgh_config input[type='checkbox'] { width: auto; } \
		.sgh_config .form__row__indent { text-align: left; } \
		.sgh_config .form__checkbox { border-bottom: 1px dotted #d2d6e0; \
		  display: inline-block; min-width: 70px; margin-right: 10px; } \
		.sgh_config .popup__actions > :not(first-child) { margin-left: 15px; } \
		.sgh_config .popup__actions > * { margin-right: 0px; } \
		.sgh_SGv2Dark .sgh_config .form__rows { margin-top: 0px; padding-top: 8px !important; } \
		.sgh_SGv2Dark .sgh_config .form__rows > div { min-width: auto !important; } \
	");
	
	var eleOptionHeader = null;
	var eleLogout = document.querySelector(".nav__row.js__logout");
	if (eleLogout)
	{
		eleOptionHeader = document.createElement("a");
		eleOptionHeader.classList.add("nav__row");
		eleOptionHeader.setAttribute("href", "");
		eleOptionHeader.innerHTML = ' \n\
			<i class="icon-grey fa fa-fw fa-cogs"></i> \n\
			<div class="nav__row__summary"> \n\
				<p class="nav__row__summary__name">SteamGifts Helper</p> \n\
				<p class="nav__row__summary__description">Customize your options.</p> \n\
			</div> ';
		insertAfterElement(eleOptionHeader, eleLogout);
	}
	else
	{
		var divRight = document.querySelector(".nav__right-container > .nav__button-container");
		if (divRight)
		{
			eleOptionHeader = document.createElement("div");
			eleOptionHeader.setAttribute("class", "nav__button-container nav__button-container--notification")
			eleOptionHeader.innerHTML = '<a title="SteamGifts Helper - Customize your options." class="nav__button" \n\
				href=""><i class="fa fa-cogs"></i></a>';
			
			insertBeforeElement(eleOptionHeader, divRight);
		}
	}
	
	if (eleOptionHeader)
	{
		eleOptionHeader.addEventListener("click", function(e)
		{
			e.preventDefault();
			
			var eleOption = document.querySelector(".sgh_config");
			if (eleOption)
			{
				updateConfigAll();
				
				eleOption.classList.add("sgh_config_active");
			}
		});
		
		var eleOption = document.createElement("div");
		eleOption.classList.add("sgh_config");
		document.body.appendChild(eleOption);
		
		var eleOptionBg = document.createElement("div");
		eleOptionBg.classList.add("sgh_config_bg");
		eleOption.appendChild(eleOptionBg);
		
		eleOptionBg.addEventListener("click", function(e)
		{
			var eleOption = document.querySelector(".sgh_config");
			if (eleOption)
			{
				eleOption.classList.remove("sgh_config_active");
			}
		});
		
		var eleOptionOption = document.createElement("div");
		eleOptionOption.classList.add("sgh_config_detail");
		eleOption.appendChild(eleOptionOption);
		
		var numOption = 0;
		
		eleOptionOption.innerHTML = ' \n\
			<p class="popup__heading"> \n\
				<span class="popup__heading__bold">Welcome to SteamGifts Helper</span> \n\
				<br> \n\
				Here you can customize your options. \n\
			</p> \n\
			<div class="popup__description"> \n\
				<div class="form__rows"> \n\
					<div class="page__heading"><div class="page__heading__breadcrumbs">General</div></div> <div> \n'
					+ createConfigBool(++numOption, "Enable SteamGifts Helper?"
						, name_config_sgh_active, false) 
					+ createConfigBool(++numOption, "Mark owned Steam games?"
						, name_config_general_mark_owned_game, false) 
					+ createConfigBool(++numOption, "Mark owned giveways?"
						, name_config_general_mark_owned_giveaway, false) 
					+ ' </div> \n\
					<div class="page__heading"><div class="page__heading__breadcrumbs">Home Pages</div></div> <div> \n'
					+ ((numOption = 0) || " ")
					+ createConfigBool(++numOption, "Hide entered giveaways?"
						, name_config_home_hide_entered, false) 
					+ ' </div> \n\
					<div class="page__heading"><div class="page__heading__breadcrumbs">Giveaway Pages</div></div> <div> \n'
					+ ((numOption = 0) || " ")
					/*+ createConfigBool(++numOption, "Enable auto enter giveaways?"
						, name_config_ga_autoenter, false)*/
					+ createConfigBool(++numOption, "Show points in giveaway titles?"
						, name_config_ga_title, false)
					+ createConfigBool(++numOption, "Enable train rider?"
						, name_config_ga_train_rider, false, "Use Ctrl+] and Ctrl+[ to go next and previous wagons.") 
					+ createConfigBool(++numOption, "Enable bigger entry buttons?"
						, name_config_ga_bigger, false) 
					+ createConfigBool(++numOption, "Show SteamDB box for Steam subs?"
						, name_config_ga_sdb, false) 
					+ ' </div> \n\
				</div> \n\
			</div> \n\
			<div class="popup__actions"> \n\
				Please refresh pages after changed your options.  \n\
				<span class="b-refresh">Refresh</span> \n\
				<span class="b-close">Close</span> \n\
			</div> \n\
			';
		
		var eleOptionRefresh = document.querySelector(".sgh_config .b-refresh");
		if (eleOptionRefresh)
		{
			eleOptionRefresh.addEventListener("click", function(e)
			{
				reload();
			});
		}
		
		var eleOptionClose = document.querySelector(".sgh_config .b-close");
		if (eleOptionClose)
		{
			eleOptionClose.addEventListener("click", function(e)
			{
				var eleOption = document.querySelector(".sgh_config");
				if (eleOption)
				{
					eleOption.classList.remove("sgh_config_active");
				}
			});
		}
		
		// Welcome
		{
			if (GM_getValue(name_config_sgh_welcome) !== 1)
			{
				GM_setValue(name_config_sgh_welcome, 1);
				
				updateConfigAll();
				
				eleOption.classList.add("sgh_config_active");
			}
			
		}
	
		// Config observer
		{
			var muTarget_config = document.querySelector(".sgh_config");
			if (muTarget_config)
			{
				var muOb_config = new MutationObserver(function(mutations)
				{
					mutations.forEach(function(mutation)
					{
						if (mutation.type === "attributes" && mutation.target.tagName === "INPUT")
						{
							var eleInput = mutation.target;
							var nameInput = eleInput.getAttribute("name");
							var enabled = (eleInput.value === "1") ? 1 : 0;
							if (GM_getValue(nameInput) !== enabled)
							{
								GM_setValue(nameInput, enabled);
							}
						}
					});
				});
				
				var muCf_config = { childList: true, subtree: true, attributes: true, attributeFilter: ["value"] };
				muOb_config.observe(muTarget_config, muCf_config);
			}
		}
	}
}

//clearAllConfig();

if (GM_getValue(name_config_ga_sdb, -1) === -1)
{
	initAllConfig();
	
	// Force show config when new config added
	//GM_setValue(name_config_sgh_welcome, 0);
}

if (GM_getValue(name_config_sgh_active) === 1)
{
	if (window !== window.parent)
		return;
	
	attachOnReady(initStyle);
	attachOnReady(main);
}

attachOnReady(mainConfig);

})();

// End
