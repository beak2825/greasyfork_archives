// ==UserScript==
// @name         vBulletin - Show full links
// @namespace    http://openuserjs.org/users/ardiman
// @description  Reveals truncated (...) links in vBulletin-forums.
// @description:de-DE  Zeigt gekürzte Links in vBulletin-Foren komplett an.
// @grant        none
// @homepage     https://github.com/ardiman/userscripts/tree/master/vbulletinshowfulllinks
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      */showthread.php*
// @include      */viewtopic.php?*
// @license      CC-BY-NC-SA-3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode
// @license      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.9.3
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/6398/vBulletin%20-%20Show%20full%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/6398/vBulletin%20-%20Show%20full%20links.meta.js
// ==/UserScript==


(function () {
matchtext = new RegExp("/\.{3,3}[0-z]");
var rrdirect = 1;  //if = 1, then try to remove prefixes like "http://anonym.to/?" etc.

function changelinktext(link)
{
  var d = link.firstChild.nodeValue;
  var u = link.href;
  match = matchtext.exec(d);
  if (match) {
    var linkparts = d.split("...");
    var a = u.indexOf(fcttrim(linkparts[0]));
    var z = 0;
    if (linkparts[1]){
      z = u.indexOf(fcttrim(linkparts[1]));
    }
    if (a != -1 && z != -1) {
      if (rrdirect == 1) {
        link.firstChild.nodeValue = u.slice(a);
        } else {
        link.firstChild.nodeValue = u;
      }
    }
  }
}


function fcttrim(a_str) {
  return a_str.replace(/ +/g, ' ').replace(/^\s+/g, '').replace(/\s+$/g, '');
}


urlarray = document.evaluate(
  '//a[@href]',
  document,
  null,
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
  null);

for(var i = 0; i < urlarray.snapshotLength; i++) {
  link = urlarray.snapshotItem(i);
  if (link.firstChild) {
    changelinktext(link);
  }
}
})();