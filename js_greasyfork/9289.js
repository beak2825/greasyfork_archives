// ==UserScript==
// @name        HWM_Tavern_GameConditionsBySectors
// @namespace   Zeleax
// @description В таверне показывает условия игры в разных секторах при наведении мышкой на имя сектора
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(tavern.php)/
// @version     1.3
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/9289/HWM_Tavern_GameConditionsBySectors.user.js
// @updateURL https://update.greasyfork.org/scripts/9289/HWM_Tavern_GameConditionsBySectors.meta.js
// ==/UserScript==

var xp = '/html/body/center/table[2]/tbody/tr/td/center/table/tbody/tr/td/table'
if((tbl =  getElementByXpath(xp+'[3]'))==null && (tbl =  getElementByXpath(xp+'[2]'))==null  && (tbl =  getElementByXpath(xp+'[1]'))==null) return;

// "сектор", башня, стена, шахты, монастыри, казармы, победа_башня, победа_ресы
var a = {"Bear Mountain":[20,10,1,1,1,200,500], "Crystal Garden":[30,15,4,4,4,100,300], "Dragons' Caves":[20,10,5,5,5,150,400], "Eagle Nest":[20,5,2,2,2,50,150], "East River":[20,10,3,3,3,75,200], "Empire Capital":[20,5,2,2,2,50,150], "Fairy Trees":[30,15,4,4,4,100,300], "Fishing Village":[50,50,5,3,5,100,300], "Great Wall":[20,50,1,1,5,100,300], "Green Wood":[30,15,4,4,4,100,300], "Harbour City":[20,5,2,2,2,50,150], "Kingdom Castle":[20,10,3,1,2,125,350], "Lizard Lowland":[20,10,1,1,1,200,500], "Magma Mines":[20,10,3,1,2,125,350], "Mithril Coast":[20,10,3,3,3,75,200], "Peaceful Camp":[20,10,3,1,2,125,350], "Portal Ruins":[20,10,3,3,3,75,200], "Rogues' Wood":[20,50,1,1,5,100,300], "Shining Spring":[20,50,1,1,5,100,300], "Sublime Arbor":[20,10,5,5,5,150,400], "Sunny City":[50,50,5,3,5,100,300], "The Wilderness":[20,10,3,3,3,75,200], "Tiger Lake":[20,10,5,5,5,150,400], "Titans' Valley":[20,10,5,5,5,150,400], "Ungovernable Steppe":[20,10,1,1,1,200,500], "Wolf Dale":[50,50,5,3,5,100,300] };

var rows = tbl.rows;
for(var i=0;i<rows.length;i++) 
   if( (el = rows[i].cells[0])!=null && (txt=el.innerHTML).length < 30 && a[txt]!=null)
      el.innerHTML='<span title="Победа: Башня '+a[txt][5]+' или Ресурсы '+a[txt][6]+'&#13;Начало: Башня '+a[txt][0]+', Стена '+a[txt][1]+', Шахта '+a[txt][2]+', Монастырь '+a[txt][3]+', Казармы '+a[txt][4]+'">'+txt+'</span>';

function getElementByXpath (path) {return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
