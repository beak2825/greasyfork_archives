// ==UserScript==
// @name           [1180] fast links
// @namespace      berkut009
// @description    fast links - помощник для паучков
// @version        1.6
// @homepage       http://userscripts.org/scripts/show/173761
// @include        https://*heroeswm.ru/clan_info.php*
// @include        https://178.248.235.15/clan_info.php*
// @include        https://209.200.152.144/clan_info.php*
// @include        https://*.lordswm.com/clan_info.php*
// @include        https://*герои.рф/clan_info.php*
// @downloadURL https://update.greasyfork.org/scripts/7948/%5B1180%5D%20fast%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/7948/%5B1180%5D%20fast%20links.meta.js
// ==/UserScript==


// (c) 2013 + mod, berkut009  ( http://www.heroeswm.ru/pl_info.php?id=1872315 )




var clan_web_offline = document.querySelectorAll("img[src$='clans/offline.gif']");

var web_table = clan_web_offline[0];


 {

while ( web_table.tagName.toLowerCase()!='tr' ) { web_table = web_table.parentNode; }


var web_table_parent = document.querySelector("a[href^='pl_info.php?id=372083']");
while ( web_table_parent.tagName.toLowerCase()!='tr' ) { web_table_parent = web_table_parent.parentNode; }



var web_table = document.createElement('tr');

var web_hide_parent = web_table_parent.previousSibling.firstChild;




web_table_parent.parentNode.insertBefore(web_table, web_table_parent);




if ( location.search.match('1180') ) {
var st_author = '<p align="left"><b>Быстрые ссылки:</b></p>';




var web_table_html = '<td colspan="2" class="wbwhite"><table width="100%" height="100%"><tr><td width="40%" valign="top" style="border-right:1px #5D413A solid;">';


web_table_html += '<table width="100%" cellpadding="5"><tr><td align="left">';

web_table_html += '<font color="blue"><b>Ссылки по клану:</b></font>';

web_table_html += '</td></tr><tr><td align="left" style="white-space:nowrap">';



web_table_html += '<li><a style="text-decoration: none;" href="forum_messages.php?tid=926425&page=last">Форум клана</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://goo.gl/8y35Zk">Памятка бойцам по боям 1</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://goo.gl/tbq9Fn">Памятка бойцам по боям 2</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://goo.gl/tbq9Fn">Памятка бойцам по боям 3</a></li>';

web_table_html += '<br><font color="blue"><b>Статистика:</b></font><br><br>';    
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/stocks/sharer.php">Статистика акций</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/market/elements">Статистика элементов</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="http://abouthwm.ru/market.php">Статистика раритетов</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/leader/leader.php">Статистика существ ГЛ</a></li>';



web_table_html += '</td></tr><tr><td>';



web_table_html += '</td></tr></table></td>';
web_table_html += '<td valign="top" height="100%" width="30%" style="border-right:1px #5D413A solid;">';

web_table_html += '<table width="100%" cellpadding="5"><tr><td align="left">';



web_table_html += '<font color="blue"><b>Сервис-помощь:</b></font>';    
web_table_html += '<tr><td valign="top" align="left" >';


web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="http://daily.heroeswm.ru/">Геройская лента</a></li>';

web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/gt/rating">Гильдия тактиков</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/leader/lg_daily.php">Опасные бандиты</a></li>';

web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/event.php">События игроков</a></li>';
web_table_html += '<li><a style="text-decoration: none;" target="_blank" href="https://daily.heroeswm.ru/dynamic">Динамика развития</a></li>';


web_table_html += '</td></tr></table></td>';

web_table_html += '<td valign="top" height="100%" width="30%">';

web_table_html += '<table width="100%" height="100%" cellpadding="5"><tr><td align="left">';


web_table_html += '» <b>Кузнецы клана:</b>';
web_table_html += '<tr><td valign="top" align="left" >';

web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=372083">Roamus</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=641808">ВиктСиль</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=1440334">Акмарал23</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=663413">SVX</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=449707">1oann</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=1034768">Lencom</a></li>';
web_table_html += '<li><b><font color="blue">90%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=1409402">kato62</a></li>';
web_table_html += '<li><b><font color="blue">50%</font></b> <a style="text-decoration: none;" href="pl_info.php?id=1872315">Vlady Lesh</a> за <b><font color="red">45%</font></b></li>';


web_table_html += '</td></tr></table></td>';
web_table.innerHTML = web_table_html;


}
}