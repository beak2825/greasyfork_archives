// ==UserScript==
// @name          InfoInSidebar
// @description   Adds a floating sidebar with torrent info from top info box
// @version       1.2.1
// @author        Monkeys
// @namespace     empornium.me
// @match         *.empornium.is/torrents.php?id=*
// @match         *.empornium.me/torrents.php?id=*
// @match         *.empornium.sx/torrents.php?id=*
// @homepage      https://greasyfork.org/en/scripts/7211-infoinsidebar
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/7211/InfoInSidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/7211/InfoInSidebar.meta.js
// ==/UserScript==

(function(){

var cells = document.getElementsByClassName("top_info")[0].querySelectorAll('td');
var className = "sideInfo"; //the original empornium class to make it match the page elements
var styleInfo = "position: fixed; bottom: 3em; left: 3em;"; //additional style to put it in the correct position
var outputInfo; //html as a string to be put in the div for the sidebar
var outputDiv = document.createElement('div');
outputDiv.setAttribute('style', styleInfo);
outputDiv.className='top_info';

outputInfo = "<table>";

for (var ii = 0; ii < cells.length; ii++)
{//go through each of the cell in the top info table and build the side bar table from them
  var thisCell = cells[ii].innerHTML;
  thisCell = thisCell.replace('<span class="time"', '</td></tr><tr><td><span class="time"')

  outputInfo += "<tr><td>"+thisCell+"</td></tr>";
}

outputInfo += "</table>";
outputDiv.innerHTML = outputInfo;
document.body.appendChild(outputDiv); //doesn't really matter where we put the new element since it has absolute positioning

})();
