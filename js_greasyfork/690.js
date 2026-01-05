// ==UserScript==
// @name       screw ctrl+q
// @namespace  awwwwjay
// @version    0.1
// @description fuck the q key
// @match      	*://*/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @require		http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/690/screw%20ctrl%2Bq.user.js
// @updateURL https://update.greasyfork.org/scripts/690/screw%20ctrl%2Bq.meta.js
// ==/UserScript==

$( document ).ready(function() {    
    Mousetrap.bind(['command+q', 'ctrl+q'], function(e) {
        return false;
    });
    
});