// ==UserScript==
// @name           ETools Script
// @namespace      etools.user.js
// @source         http://vld.altervista.org/etools/
// @description    Interact from the game's page of OGame (Gameforge) with ETools
// @version        1.0
// @author         vld
// @contributor    The Empire
// @icon           http://vld.altervista.org/etools/etools32.ico
// @icon64         http://vld.altervista.org/etools/etools64.ico
// @grant          none
// @noframes
// @run-at         document-end
// @include        http://s*-*.ogame.gameforge.com/game/index.php?page=*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=buddies*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=notices*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=showmessage*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=search*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=trader*
// @exclude        http://s*-*.ogame.gameforge.com/game/index.php?page=empire*
// @downloadURL https://update.greasyfork.org/scripts/8545/ETools%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/8545/ETools%20Script.meta.js
// ==/UserScript==

var tab = document.getElementById ("bar");
if ((tab === null) || (tab.length < 8)) return;
var li8 = tab.getElementsByTagName ("li") [8];
var li = document.createElement ("li");
var a = document.createElement ("a");
a.setAttribute ("href", "http://vld.altervista.org/etools/");
a.setAttribute ("target", "_blank");
a.appendChild (document.createTextNode ("ETools"));
li.appendChild (a);
li8.parentNode.insertBefore (li, li8);