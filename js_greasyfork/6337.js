// ==UserScript==
// @name         Endless deviantart gallery pages
// @namespace    https://www.topcl.net/
// @version      0.2
// @description  rt
// @author       vj
// @match        http://*.deviantart.com/gallery/*
// @match        http://*.deviantart.com/favourites/*
// @match        http://*.deviantart.com/prints/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6337/Endless%20deviantart%20gallery%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/6337/Endless%20deviantart%20gallery%20pages.meta.js
// ==/UserScript==

var pg=1;

function loadPage(url)
{
	//debugger;
	pg++;
	console.log("loadPage " + pg + " - " + url);
	
	//load html
	var xhr=new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.send(null);

	xhr.onload = function (e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			//parse html
			var ndoc=document.implementation.createHTMLDocument("");
			ndoc.body.innerHTML=xhr.response;

			//check result
			var rs=ndoc.getElementById("gmi-ResourceStream");
			if(!rs){console.log("Stop: gmi-ResourceStream not found");}
			
			//add to page
			document.getElementById("gmi-ResourceStream").innerHTML+=rs.innerHTML;

			//check next page
			var next=$(ndoc).find(".next>a").attr("href");
			if(!next)
			{
				console.log("Stop: not found .next>a href");
				return;
			}

			//go next page
			loadPage(next);
		}
	};
}


loadPage(document.getElementById("gmi-GPageButton").href);