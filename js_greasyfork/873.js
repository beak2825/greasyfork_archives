// ==UserScript==
// @name        GameFAQs Private Board Boot Button
// @namespace   http://userscripts.org/scripts/show/177183
// @description Adds a boot button to the private board member list
// @include     http://www.gamefaqs.com/boards/*
// @include     https://www.gamefaqs.com/boards/*
// @version     1.11
// @downloadURL https://update.greasyfork.org/scripts/873/GameFAQs%20Private%20Board%20Boot%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/873/GameFAQs%20Private%20Board%20Boot%20Button.meta.js
// ==/UserScript==

var list = document.getElementsByClassName("board")[0];
if (list) {
    var tbodys = list.getElementsByTagName("tbody");
    for (var i = 1; i < tbodys.length; i++) {
        tbodys[i].getElementsByTagName("tr")[0].innerHTML = '<th>Member</th><th>Last Visit</th><th>Boot</th>';
        var tre = tbodys[i].getElementsByTagName("tr");
        for (var j = 1; j < tre.length; j++) {
            first_td = tre[j].getElementsByTagName("td")[0].innerHTML;
            second_td = tre[j].getElementsByTagName("td")[1].innerHTML;
            user = tre[j].getElementsByTagName("td")[0].getElementsByTagName("a")[0].innerHTML;
            tre[j].innerHTML = '<td>' + first_td + '</td><td>' + second_td + '</td>';
            if (first_td.indexOf("<b>") == -1) {
                tre[j].innerHTML += '<td><b><input type="button" onclick="document.forms[2].target_text.value=\'' + user + '\';document.forms[2].action.value=\'removemember\';document.forms[2].submit();" value="Boot" /></b></td>';
            } else if (first_td.indexOf("(owner)") == -1 && document.forms[4]) {
                tre[j].innerHTML += '<td><b><input type="button" onclick="document.forms[4].target_text.value=\'' + user + '\';document.forms[4].action.value=\'demotemember\';document.forms[4].submit();" value="Demote" /></b></td>';
            }
        }
    }
}