// ==UserScript==
// @name				CRX Downloader
// @namespace			CRX_Downloader
// @id					CRX_Downloader
// @description			Allows downloading .crx'es from Google's Chrome Web Store
// @version				0.2
// @grant				none
// @author				KOLANICH
// @copyright			KOLANICH, 2016 (based on http://chrome-extension-downloader.com/how-does-it-work.php and https://github.com/doraemonsk8ers/CRX_Downloader)
// @license				Unlicensed
// @homepageURL			https://github.com/KOLANICH/CRX_Downloader
// @contributionURL		https://github.com/KOLANICH/CRX_Downloader/fork
// @contributionAmount	feel free to fork and contribute
// @include				https://chrome.google.com/webstore/detail/*/*
// @noframes			1
// @run-at				document-idle
// @optimize			1
// @downloadURL https://update.greasyfork.org/scripts/8473/CRX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/8473/CRX%20Downloader.meta.js
// ==/UserScript==

/*This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>*/

"use strict";
const chromiumCachedVersion="48.0";
const downloadUriBase="https://clients2.google.com/service/update2/crx";

function detectChromium(){
	let m=navigator.userAgent.match(/Chrome\/(\d+\.\d+)/);
	return {
		version:m?m[1]:chromiumCachedVersion,
		chromium:!!m
	};
}
const chromiumInfo=detectChromium();


function assembleParams(params){
	return Object.keys(params).map(p=>p+(params[p]?"="+encodeURIComponent(params[p]):"")).join("&");
}
function getAddonLink(id){
	let a=document.createElement("A");
	a.href=downloadUriBase;
	a.search=assembleParams({
		"response":"redirect",
		"prodversion":chromiumInfo.version,
		"x":assembleParams({
			"id":id,
			"installsource":"ondemand",
			"uc":null
		})
	});
	return a;
}

function parseAddonUri(path){
	let a=path.split("/");
	return {ID:a[a.length-1],hrID:a[a.length-2]};
}
function getButton(){
	return document.body.querySelector("div[role=button]");
}
function getFilename(){
	return getAddonName();
}
function getAddonName(){
	return document.getElementsByTagName("H1")[0].textContent;
}
function injectDownloadLink(){
	let parsed=parseAddonUri(window.location.pathname);
	let a=getAddonLink(parsed.ID);
	a.download=parsed.hrID+".crx";
	a.textContent="Download .CRX";
	let btn=getButton();
	a.className=btn.className;
	
	if(!chromiumInfo.chromium){
		btn.parentNode.replaceChild(a,btn);
	}else{
		btn.parentNode.insertBefore(a,btn);
		btn.style.margin=(btn.nextSibling.getBoundingClientRect().left-btn.getBoundingClientRect().right)+"px";
	}
}
setTimeout(injectDownloadLink,3000);
