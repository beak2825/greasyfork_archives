// ==UserScript==
// @name FirstLatvianFusker Gridview
// @version 0.11
// @author ElDoRado1239
// @description Displays First Latvian Fusker galleries in a gridview and removes ads
// @include *fusker.xxx*lid*
// @namespace https://greasyfork.org/users/6103
// @downloadURL https://update.greasyfork.org/scripts/6011/FirstLatvianFusker%20Gridview.user.js
// @updateURL https://update.greasyfork.org/scripts/6011/FirstLatvianFusker%20Gridview.meta.js
// ==/UserScript==

var a = document.getElementsByTagName('img');
var s = "";
for(var i in a){
	if(a[i].parentNode == undefined) continue;
	if(a[i].parentNode.tagName == 'SPAN') s += '<img src="'+a[i].src+'" width="10%" />'; 
}
document.body.innerHTML = s;