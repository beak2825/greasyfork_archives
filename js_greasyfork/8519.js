// ==UserScript==
// @author        jawz
// @name       jawz CloseTabAsk
// @version    1.6
// @description  Don't close that tab! For Tinychat.
// @match      http://tinychat.com/turktime*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8519/jawz%20CloseTabAsk.user.js
// @updateURL https://update.greasyfork.org/scripts/8519/jawz%20CloseTabAsk.meta.js
// ==/UserScript==

//setInterval(function(){ checkTime(); }, 500);

window.onbeforeunload = function(e) {
    return 'You sure you want to leave us? :(';
}

function checkTime() {
    var d = new Date();
    var hour = d.getUTCHours(), minute = d.getUTCMinutes(), second = d.getUTCSeconds();
    if (hour == 1 || hour == 5 || hour == 9 || hour == 13 || hour == 17 || hour == 21) {
        if (minute == 25) {
            warningTbl.rows[1].cells[0].innerHTML = 60 - second;
            $(warningDiv).show();
        } 
        if (minute == 26 && second < 2) {
        window.onbeforeunload = function(e) {};
        location.reload(true);
        }
    }
}

var warningDiv = document.createElement('div');
warningDiv.style.position = 'fixed';
warningDiv.style.width = '40%';
warningDiv.style.height = '100px';
warningDiv.style.left = '30%';
warningDiv.style.top = '10%';
warningDiv.style.border = '1px solid black';
warningDiv.style.backgroundColor = 'red';
warningDiv.style.color = 'white';
warningDiv.align = 'center';

var warningDivButton = document.createElement('button');
warningDivButton.textContent = 'Close';
warningDivButton.style.width = '100px';
warningDivButton.style.fontSize = '14px';
warningDivButton.addEventListener("click", function() {$(warningDiv).hide();}, false);
document.body.appendChild(warningDiv);

warningTbl  = document.createElement('table');
warningDiv.appendChild(warningTbl);
warningTbl.style.position = "absolute";
warningTbl.width = '100%';
warningTbl.style.marginTop = '16px';
warningTbl.cellSpacing = '1px';
warningTbl.style.border = '0px';
for (i = 0; i < 3; i++) {
    var tr = warningTbl.insertRow();
    var td = tr.insertCell();
    td.appendChild(document.createTextNode(''));
    td.style.fontSize = '20px';
    td.style.fontWeight = "bold";
    td.style.color = "white";
    td.style.textAlign = "center";
}
warningTbl.rows[0].cells[0].innerHTML = "Tinychat Reset in: ";
warningTbl.rows[1].cells[0].innerHTML = "01:00";
$(warningDiv).hide();