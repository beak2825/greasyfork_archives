// ==UserScript==
// @name       Steam Store - Open App in Steam Client
// @namespace  url://none
// @version    0.1
// @description	Adds Link in Steam Store Page to open page in the Steam Client, look for the green button to the right of the game title.
// @match      http://store.steampowered.com/app/*
// @copyright  Oddity
// @downloadURL https://update.greasyfork.org/scripts/8031/Steam%20Store%20-%20Open%20App%20in%20Steam%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/8031/Steam%20Store%20-%20Open%20App%20in%20Steam%20Client.meta.js
// ==/UserScript==

var locEl = document.querySelector("div.apphub_OtherSiteInfo"),
    appid = document.location.pathname.match(/\d+/),
	storeurl = "steam://store/"+appid,
    linkel = document.createElement("a");

linkel.setAttribute('href',storeurl);
linkel.className ="btnv6_green_white_innerfade btn_medium";
linkel.setAttribute('style',"font-size: 15px");
//linkel.text = "";
linkel.innerHTML ='<span><img src="http://store.akamai.steamstatic.com/public/images/v5/globalheader_logo.png" width="44" height="11">&#11016;</span>';
locEl.appendChild(linkel);