// ==UserScript==
// @name           Newgrounds Dump Links Fixer
// @description    Change the link of an NG dump file from a forced download to one that can be opened within the browser. It's based upon Newgrounds Direct Audio Link (by foxsan48) with additional tweaks by B1KMusic (http://bradenbest.com/). NOTE! Due to changes in NG URL structure this script no longer works: there is no way to directly view a dump file without downloading.
// @version        1.1
// @namespace      http://cyberd.org/
// @include        http://*.newgrounds.com/*
// @include        http://newgrounds.com/*
// @downloadURL https://update.greasyfork.org/scripts/602/Newgrounds%20Dump%20Links%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/602/Newgrounds%20Dump%20Links%20Fixer.meta.js
// ==/UserScript==
//
//
// Cyberdevil
//  (http://userscripts.org/users/cyberdevil)
//  (http://greasyfork.org/users/481-cyberdevil)
//

// Add jQuery to doc
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://code.jquery.com/jquery-latest.min.js';
GM_JQ.type = 'text/javascript';
document.body.appendChild(GM_JQ);

// Run Jquery Code
function letsJQuery() {
    // If link is a forced download, switch to a draw
        //$('a:first').each(function(i){
    $('a').each(function(i){
        var pattern = new RegExp(/http:\/\/www\.newgrounds\.com\/dump\/download\/\d+/g);
        //alert(pattern.test($('a')[i].href)+' link '+$('a')[i].href);
        if((pattern.test($('a')[i].href))==true){$('a')[i].href = $('a')[i].href.replace('download','draw');}
        });
};

(function(){
  letsJQuery();
})();