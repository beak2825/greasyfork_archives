// ==UserScript==
// @name        HWM_Repair_Costs
// @namespace   Zeleax
// @description На странице артефакта добавляет таблицу со стоимостью ремонта (10%, 20%, ...) и возможность передачи суммы своим кузнецам
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com)\/(art_info.php\?id=.*|inventory.php.*)/
// @version     2.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9911/HWM_Repair_Costs.user.js
// @updateURL https://update.greasyfork.org/scripts/9911/HWM_Repair_Costs.meta.js
// ==/UserScript==
var kuznec = {'Zeleax':[90,102,0], '100':[90,100,1], '101':[90,101,0], '80':[80,80,0], '82':[80,82,0], '70':[70,70,0]}// кузнецы

if(/art_info.php/.test(location.href))
{
   var artName = '', els, el, res, remont;

   var repCostTbl = getI( "//b[contains(text(),'Стоимость ремонта:')]" ).snapshotItem(0).nextSibling;

   if((res=/<td>([0-9,]+)<\/td>/.exec(repCostTbl.innerHTML)) && (remont = parseInt(res[1].replace(',',''))))
   {
      // получим прочку из ссылки и посчитаем цену боя
      res = /&curpr=(\d+)&maxpr=(\d+)/.exec(location.href);
      var сurpr, maxpr, p;
      if(res!=null && res[2]!=null)
      {
         сurpr=parseInt(res[1]); maxpr=parseInt(res[2]); 
      }

      if(сurpr!=null){
         p = document.createElement("p")
         p.innerHTML='<b>Текущая прочность:</b> '+сurpr+'/'+maxpr;
      }
      
      var t = document.createElement("table");
      t.setAttribute('border','1');
      
      insertRowWithCells(t, ['<p title="При клике открывается страница кузнеца в новой вкладке">&nbsp;Кузнец</p>', '<p title="% эффективности ремонта кузнеца / % стоимости услуги от стандартной стоимости ремонта">Условия</p>', '<p title="Стоимость услуг ремонта кузнеца (при клике на сумме открывается окно передачи золота)">Ремонт</p>','<p title="Прочность артефакта после ремонта кузнецом">Прочность</p>',
      '<p title="Цена 1 боя при ремонте у кузнеца (с учётом +1% при передаче оплаты и +1з при передаче арта)">Цена боя</p>']);

      var d = document.createElement("div");
      d.innerHTML = '';
      for(var property in kuznec)
      {
         var sumRem = Math.ceil(kuznec[property][1]*remont/100)+kuznec[property][2];
         var newcurpr=Math.floor(maxpr*kuznec[property][0]/100); //новая прочка
         var battlePrice=(sumRem*1.01+1)/newcurpr; // 1% возьмут при передаче денег и 1з арта
         insertRowWithCells(t, [
            '&nbsp;<a target="_blank" href="/pl_info.php?nick='+property+'">'+property+'</a>&nbsp;' // кузнец
            ,'<p align="right">'+kuznec[property][0]+'/'+kuznec[property][1]+'</p>' // Условия
            ,'<p align="right"><a title="Передать '+sumRem+' золота '+property+'" href="/transfer.php?gold='+sumRem+'&desc=ремонт&nick='+property+'">'+sumRem+'</a></p>' // Стоимость услуг
            ,'<p align="right">'+newcurpr+'/'+(maxpr-1)+'</p>' // Прочность арта
            ,'<p align="right">'+battlePrice.toFixed(1)+'</p>' // Цена боя
         ])
      }
      repCostTbl.parentNode.insertBefore(t, repCostTbl.nextSibling);

      if(p) repCostTbl.parentNode.insertBefore(p, repCostTbl.nextSibling);
   }
}
else if(/inventory.php/.test(location.href))
{
   for(var i=0; i<arts.length; i++) arts[i]['crc_link']+= '&curpr='+arts[i]['durability1']+'&maxpr='+arts[i]['durability2'];
}

function insertRowWithCells(table, cellsHtmlArray){
   var row = table.insertRow(-1);
    var cellHtml, c;
   for(var i=0; cellHtml=cellsHtmlArray[i]; i++) {c = row.insertCell(i); c.innerHTML=cellHtml; }
   return;
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
