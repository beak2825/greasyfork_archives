// ==UserScript==
// @name        Chess.com New
// @namespace   http://example.com
// @description Remove the advertisement plus recolor a little bit
// @include     http://www.chess.com
// @include     http://www.chess.com/* 
// @include     http://live.chess.com/*
// @version     1.2.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8575/Chesscom%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/8575/Chesscom%20New.meta.js
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


addGlobalStyle('div#body.clearfix {background: #7A4B4B !important;}');
addGlobalStyle('ul#nav.clearfix {background: #959520  !important;}');
addGlobalStyle('div.framed.bottom-10 {background:  rgba(181, 216, 66, 0.81)}');


//addGlobalStyle('input,textarea,select {color: green !important;}');



addGlobalStyle('input.timerin { color: rgba(49, 18, 51, 0.97) !important;background-color: rgba(146, 54, 54, 0)!important;}');

addGlobalStyle('.timerin {font-size:large !important;}');

addGlobalStyle('div#main_bc {background-image: url("http://s3.postimg.org/4xq6qmnrn/Background1752_1168.gif")  !important;}');
addGlobalStyle('div.bs.bs {background: none repeat scroll 0% 0% rgba(84, 105, 17, 0.64) !important;}');

addGlobalStyle('.adzone, .webzone {display: none !important;}');

addGlobalStyle('div#div-gpt-ad-1406590358007-2 {display: none !important;}');


addGlobalStyle('div.bs.bs { background: none repeat scroll 0% 0% rgba(102, 111, 74, 0) !important;}');


//addGlobalStyle('div#advert_content {display: none !important;}');


$("div#advert_content").remove();









//$('body').css("background", "url(http://s3.postimg.org/4xq6qmnrn/Background1752_1168.gif) ");

//function GM_addStyle( css )


//GM_addStyle(".boardContainer { color: white; background-color: black; } img { border: 0; }");