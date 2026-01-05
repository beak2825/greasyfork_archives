// ==UserScript==
// @name         vBulletin - Full ignore
// @namespace    http://openuserjs.org/users/ardiman
// @description  Stops display of truncated posts from users on your ignore list.
// @description:de-DE  Entfernt gekürzte Beiträge von Benutzern auf der Ignorierliste komplett.
// @grant        GM_addStyle
// @homepage     https://github.com/ardiman/userscripts/tree/master/vbulletinfullignore
// @icon         https://raw.githubusercontent.com/ardiman/userscripts/master/scriptlogo.gif
// @include      */showthread.php*
// @license      CC BY-NC-SA 3.0; https://creativecommons.org/licenses/by-nc-sa/3.0/
// @supportURL   https://github.com/ardiman/userscripts/issues
// @version      1.0.7
// @date         2017-11-19
// @downloadURL https://update.greasyfork.org/scripts/6397/vBulletin%20-%20Full%20ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/6397/vBulletin%20-%20Full%20ignore.meta.js
// ==/UserScript==
 
(function (){
var filterkey = "?userlist=ignore&amp;do=removelist&amp;u=";
 
var allElements, thisElement;
allElements = document.getElementsByTagName('tr');
for (var i = 0; i < allElements.length; i++) {
  thisElement = allElements[i];
  if(thisElement.innerHTML.indexOf(filterkey)!=-1)
    {
    thisElement.parentNode.style.display = 'none';
    }
  }
 
// for new vBulletin 4.x try this:
GM_addStyle('li.postbitignored {display: none !important;}');
}());