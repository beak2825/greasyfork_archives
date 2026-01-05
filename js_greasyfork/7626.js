// ==UserScript==
// @name           Die Stämme - Gebäude Buttons
// @namespace      http://sdm-scholz.de
// @description    Fügt dem Spiel "Die Stämme" Buttons für Gebäude hinzu
// @include        http://de*.die-staemme.*/*
// @edit      	   Đð¢ M@rco PC-Ŧræk <http://www.sdm-scholz.de>
// @help           http://sdm-scholz.de
// @version        v0.1
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7626/Die%20St%C3%A4mme%20-%20Geb%C3%A4ude%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/7626/Die%20St%C3%A4mme%20-%20Geb%C3%A4ude%20Buttons.meta.js
// ==/UserScript==

//Parameter aus der URL holen
function getUrlParam(param) 
{
  var url_params = location.search.substr(1);
  var params = url_params.split('&');
  for (var i = 0; i < params.length; i++)
  {
    if (params[i].indexOf(param) >= 0)
    {
      return params[i];
    }
  }
  return '';
}
// Die Links erstellen
var village = unsafeWindow.village;
var LinkDiv = document.createElement('div');
LinkDiv.id = 'header_info';
LinkDiv.innerHTML += '<table class="header-border"><tbody><tr><td><table class="box menu nowrap" align="center" width="100%"><tbody><tr><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=main">Hauptgebäude </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=place"> Versammlungsplatz </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=stable"> Stall </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=barracks"> Kaserne </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=market"> Markt </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=garage"> Werkstatt </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=smith"> Schmiede</a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&screen=statue"> Statue </a>|</td><td class="box-item"><a href="/game.php?' + getUrlParam('village') + '&mode=inventory&screen=statue"> Waffenkammer </a></td></tr></table></td></tr><tr class="newStyleOnly"><td class="shadow"><div class="leftshadow></div><div class="rightshadow"></div></td></tr></tbody></table>';
document.getElementById('header_info').appendChild(LinkDiv);

