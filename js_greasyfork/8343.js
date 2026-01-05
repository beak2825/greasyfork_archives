// ==UserScript==
// @name           Die Stämme - Schnellleiste
// @namespace      http://www.die-staemme.de/
// @description    Fügt dem Spiel "Die Stämme" Buttons für Gebäude hinzu
// @include        http://de*.die-staemme.*/*
// @version        1.0
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/8343/Die%20St%C3%A4mme%20-%20Schnellleiste.user.js
// @updateURL https://update.greasyfork.org/scripts/8343/Die%20St%C3%A4mme%20-%20Schnellleiste.meta.js
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
LinkDiv.align = 'center';
LinkDiv.innerHTML += '<table class="header-border" align="center" cellspacing="0" width="100%"><tbody><tr><td><table id="quickbar_inner" class="box menu nowrap" align="center" width="100%"><tbody><tr><td id="quickbar_contents" class="firstcell box-item icon-box nowrap" style="white-space:nowrap;"><ul class="menu quickbar"><li><span><a class="nowrap tooltip-delayed" href="/game.php?' + getUrlParam('village') + '&amp;screen=main"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/main.png" alt="Headquarters">Headquarters</a></span></li><li class="quickbar_item"><span><a class="quickbar_link" href="/game.php?' + getUrlParam('village') + '&amp;screen=train"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/barracks.png" alt="Rekrutiere">Recruit</a></span></li><li class="quickbar_item"><span><a class="quickbar_link" href="/game.php?' + getUrlParam('village') + '&amp;screen=snob"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/snob.png" alt="Academy">Academy</a></span></li><li class="quickbar_item"><span><a class="quickbar_link" href="/game.php?' + getUrlParam('village') + '&amp;screen=smith"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/smith.png" alt="Smithy">Smithy</a></span></li><li class="quickbar_item"><span><a class="quickbar_link" href="/game.php?' + getUrlParam('village') + '&amp;screen=place"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/place.png" alt="Rally Point">Rally Point</a></span></li><li class="quickbar_item"><span><a class="quickbar_link" href="/game.php?' + getUrlParam('village') + '&amp;screen=market"><img src="http://dsch.innogamescdn.com/8.32/24599/graphic//buildings/market.png" alt="Market">Market</a></span></li></ul></td><td class="right"> </td></tr></tbody></table></td></tr></tbody></table>';
document.getElementById('header_info').appendChild(LinkDiv);
