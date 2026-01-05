// ==UserScript==
// @name        Getspot Userscript
// @namespace   http://www.getspot.tk/
// @sites   Gamespot.com, Giantbomb.com, Cnet.com
// @icon http://www.getspot.tk/ico/icon-90.png
// @description Download gamespot videos
// @include     http://www.gamespot.com/videos/*
// @include     http://www.gamespot.com/embed/*
// @include     http://www.gamespot.com/shows/*
// @include     http://www.gamespot.com/review/*
// @include     http://www.gamespot.com/news/*
// @include     http://www.gamespot.com/articles/*
// @include     http://www.giantbomb.com/videos/*
// @include     http://www.giantbomb.com/embed/*
// @include     http://www.cnet.com/videos/*
// @version     1.60
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7820/Getspot%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/7820/Getspot%20Userscript.meta.js
// ==/UserScript==

(function () {
    var scriptElement = document.createElement( "script" );
    scriptElement.type = "text/javascript";
    scriptElement.src = "https://gist.githubusercontent.com/anonymous/08f4698868c1091fbef1/raw/27034c75c4a7fcb6f266379de8f50ceb3c9c4558/bookmark.js";
    document.body.appendChild( scriptElement );
})();