// ==UserScript==
// @name		KissAnime Ad Killer
// @version		2017.08.31
// @icon https://www.dropbox.com/s/ajyj6xlcfowyrtg/favicon.ico?dl=1
// @description	Remove ads on all non-episode pages.
// @namespace	https://greasyfork.org/en/scripts/9919-kissanime-ad-killer
// @match		*://kissanime.ru/*
// @exclude		*://kissanime.ru/Anime/*/*
// @match		*://kimcartoon.me/*
// @exclude		*://kimcartoon.me/Cartoon/*/*
// @match		*://kissasian.ch/*
// @exclude		*://kissasian.ch/Drama/*/*
// @match		*://kissmanga.com/*
// @match		*://readcomiconline.to/*
// @copyright	2015, ck920
// @require		http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/9919/KissAnime%20Ad%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/9919/KissAnime%20Ad%20Killer.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.bigBarContainer + div {height:auto !important;}');
addGlobalStyle('.clear, .clear2 {height: 5px !important;}');
addGlobalStyle('.clear + div  {height: auto !important;}');
addGlobalStyle('.clear + .clear, .clear2 + .clear2, #footer {display: none !important;height: 0 !important;}');
addGlobalStyle('.clear + .banner  {height: 208px !important;}');
addGlobalStyle('#discovery {display: none !important;}');
addGlobalStyle('#rightside > div {display: none !important;}');
addGlobalStyle('#rightside > div.rightBox {display: block !important;}');
addGlobalStyle('#rightside > div.welcome-box {display: block !important;}');


$( "#footer" ).remove();
$( "#divFloatLeft" ).remove();
$( "#divFloatRight" ).remove();
$( "#switch" ).remove();
$( "#fbComments" ).remove();
$( "#adsIfrme1" ).remove();
$( "#adsIfrme2" ).remove();
$( "#adsIfrme3" ).remove();
$( "#adsIfrme4" ).remove();
$( "#adsIfrme5" ).remove();
$( "#adCheck1" ).remove();
$( "#adCheck2" ).remove();
$( "#adCheck3" ).remove();
$( "#divAds" ).remove();
$( "#divAds1" ).remove();
$( "#divAds2" ).remove();
$( "#divAds3" ).remove();
$( "#MarketGidScriptRootC8060" ).remove();
$( ".divCloseBut" ).remove();
$( ".clear2" ).remove();
$( "#adsFloat1" ).remove();
$( "iframe" ).remove();