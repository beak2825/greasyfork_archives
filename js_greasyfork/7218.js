// ==UserScript==
// @name          Sankakucomplex old link replacer
// @description   Replaces the old sankakustatic links (Images) with the current sankakucomplex adresses
// @include       http://www.sankakucomplex.com/*
// @version       1.0
// @grant         none
// @namespace https://greasyfork.org/users/7983
// @downloadURL https://update.greasyfork.org/scripts/7218/Sankakucomplex%20old%20link%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/7218/Sankakucomplex%20old%20link%20replacer.meta.js
// ==/UserScript==



//document.body.innerHTML.replace(/sankakustatic.com/gi, 'sankakucomplex.com');

document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( /sankakustatic.com/gi, 'sankakucomplex.com' );
//		a.text = a.text.replace( /sankakustatic.com/gi, 'sankakucomplex.com' );
    });
}