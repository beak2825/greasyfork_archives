// ==UserScript==
// @name       MTurk HIT Tabulator
// @namespace  http://www.mturk.com/
// @version    1.2
// @description  Opens HITs in a single dedicated tab
// @include      https://www.mturk.com/mturk/*
// @exclude      https://www.mturk.com/mturk/preview*
// @exclude      https://www.mturk.com/mturk/accept*
// @grant        none
// @runat        document-end
// @copyright 2012, Jesse Rudolph
// @downloadURL https://update.greasyfork.org/scripts/6144/MTurk%20HIT%20Tabulator.user.js
// @updateURL https://update.greasyfork.org/scripts/6144/MTurk%20HIT%20Tabulator.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("a");
    
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    
    if (link.href.search("/mturk/preview?") >= 0) {
        link.target = "mturkhits";
    }
}