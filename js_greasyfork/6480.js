// ==UserScript==
// @name         CCC.hn date
// @namespace    http://ccc.hn/user/3700-xorg/
// @version      0.2
// @description  Shows when the post and comments have been added to the forum
// @author       xorg
// @match        http://ccc.hn/topic/*
// @downloadURL https://update.greasyfork.org/scripts/6480/CCChn%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/6480/CCChn%20date.meta.js
// ==/UserScript==

source = document.body.innerHTML;
tmp = source.match(/<!--[\s\S]*?-->/g);
dates = [];
for (var i = 0; i < tmp.length; i++) 
	if (tmp[i].indexOf('cached') + 1)
	{
		date = tmp[i].slice(16, -9);
		date = date.substr(0, 12) + (parseInt(date.substr(12, 2)) + 3) + date.substr(14);
		dates.push(date);
	}
k = 0;
allLink = document.getElementsByTagName('a');
for (var i = 0; i < allLink.length; i++)
    if ((allLink[i].innerHTML.indexOf('#') + 1) && (allLink[i].href.indexOf('#entry') + 1))
    {
        allLink[i].innerHTML += dates[k];
        k++;
    }