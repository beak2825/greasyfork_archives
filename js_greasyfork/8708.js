// ==UserScript==
// @name         AutoRefresh
// @namespace    http://your.homepage/
// @version      2.7.0
// @description  Automatically refreshes the game list from the lobby
// @author       You
// @match        https://epicmafia.com/lobby
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8708/AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/8708/AutoRefresh.meta.js
// ==/UserScript==

$(".ll-refresh").hide();
var refresh = setInterval( function() {
    if ($(".pagenav .grey").first().text() == "Page 1") {
        $(".icon-refresh").click();
    }
}, 1000 );

$("[ng-click*='goto_lobby'], .icon-list-ul").click(function() {
    clearInterval(refresh);
    refresh = setInterval( function() {
    if ($(".pagenav .grey").first().text() == "Page 1") {
        $(".icon-refresh").click();
    }
    }, 1000 );
});

$(".icon-pencil").first().click(function () {
    clearInterval(refresh);
});

$(".icon-plus").first().click(function () {
    clearInterval(refresh);
});