// ==UserScript==
// @name         Hide XXX and XXX-imgset at orlydb
// @namespace    org.jixun
// @version      0.1
// @description  enter something useful
// @author       Jixun
// @include      http://www.orlydb.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/9644/Hide%20XXX%20and%20XXX-imgset%20at%20orlydb.user.js
// @updateURL https://update.greasyfork.org/scripts/9644/Hide%20XXX%20and%20XXX-imgset%20at%20orlydb.meta.js
// ==/UserScript==

var disallowed = ['XXX', 'XXX-IMGSET'];
[].forEach.call(document.querySelectorAll('#releases>div'), function (row) {
    var cat = row.querySelector('.section>a');
    if (cat && disallowed.indexOf(cat.textContent.trim()) != -1) {
        row.parentNode.removeChild(row);
    }
});