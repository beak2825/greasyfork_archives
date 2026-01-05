// ==UserScript==
// @name        Redirect kickass.filesoup.com to kickass.so
// @namespace   uso2usom
// @description On any web page it will check if the clicked links goes to kickass.filesoup.com. If so, the link will be rewritten to point to kickass.so
// @include     http://*.*
// @include     https://*.*
// @exclude     http://kickass.filesoup.com/*
// @exclude     https://kickass.filesoup.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7785/Redirect%20kickassfilesoupcom%20to%20kickassso.user.js
// @updateURL https://update.greasyfork.org/scripts/7785/Redirect%20kickassfilesoupcom%20to%20kickassso.meta.js
// ==/UserScript==


document.body.addEventListener('click', function(e){
    var targ = e.target || e.srcElement;
    if ( targ && targ.href && targ.href.match('https?:\/\/kickass.filesoup.com') ) {
        targ.href = targ.href.replace('://kickass.filesoup.com', '://kickass.so');
    }
});