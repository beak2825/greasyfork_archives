// ==UserScript==
// @name         Hacker news open links in new tab
// @version      0.1
// @namespace hackernewsnewtab
// @description  enter something useful
// @author       You
// @include      https://news.ycombinator.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/7209/Hacker%20news%20open%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/7209/Hacker%20news%20open%20links%20in%20new%20tab.meta.js
// ==/UserScript==
var re = /^https?:\/\/news\.ycombinator\.com\/news\?p=\d$/i;
var cells = document.getElementsByTagName("td");
for (var i = 0; i < cells.length; i++) {
    td = cells[i];
    if ('title' === td.className) {
        links = td.getElementsByTagName('a');
        if (links.length > 0) {
            link = links[0];
            if (!link.href.match(re)) {
                link.setAttribute("target", "_blank");
            }
        }
    }
}