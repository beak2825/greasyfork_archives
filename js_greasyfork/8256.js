// ==UserScript==
// @name         Direct Accept Mission
// @namespace    http://www.hacker-project.com/
// @version      0.3
// @description  Lets you directly accept HP secret board missions
// @author       Kevin Mitnick
// @match        http://www.hacker-project.com/index.php?action=gate&a2=secret_board*
// @match        http://hacker-project.com/index.php?action=gate&a2=secret_board*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8256/Direct%20Accept%20Mission.user.js
// @updateURL https://update.greasyfork.org/scripts/8256/Direct%20Accept%20Mission.meta.js
// ==/UserScript==

function main() {
    var table = document.getElementsByTagName("table")[10];
    var trs = table.getElementsByTagName("tr");
    var missionsNumber = table.getElementsByTagName("tr").length-5;
    for (var i = 4; i < trs.length-1; i++) {
    	var tds = trs[i].getElementsByTagName("td");
        var td1 = tds[0];
        var p = document.createElement("p");
        p.innerHTML="|";
        p.style.display = "inline";
        td1.appendChild(p);
        var a = document.createElement("a");
        a.innerHTML="Accept";
        a.setAttribute("href", td1.getElementsByTagName("a")[0].getAttribute("href").substring(0, td1.getElementsByTagName("a")[0].getAttribute("href").indexOf("&a3=")+4)+"accept"+td1.getElementsByTagName("a")[0].getAttribute("href").substring(td1.getElementsByTagName("a")[0].getAttribute("href").indexOf("&a3=")+10));
        a.style.display = "inline";
        td1.appendChild(a);
    }
}
main();