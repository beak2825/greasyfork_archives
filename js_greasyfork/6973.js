// ==UserScript==
// @name        Some random emote script
// @description Trying to add emotes(mainly gifs) to twitch tv pages
// @include     http://www.twitch.tv/*
// @include     http://twitch.tv/*
// @version     0.2
// @namespace   Emotestuff
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6973/Some%20random%20emote%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6973/Some%20random%20emote%20script.meta.js
// ==/UserScript==
window.onload = function ()
{
var style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.styleSheet.cssText='.piece_of_sheet-14{content:"POS";background-image:url("http://cdn.frankerfacez.com/channel/piece_of_sheet/PiPiPi.png");height:29px;width:29px;margin:-5.5px 0px;}';
var body = document.getElementsByTagName('body')[0];
if (body) {
    body.appendChild(script);
    body.appendChild(style);
}
}