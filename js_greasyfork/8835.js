// ==UserScript==
// @name HWM_Monster_Links
// @author  Zeleax
// @namespace   Zeleax
// @description Добавляет ссылку на описание существ и монстров в заданиях ГН
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(plstats_hunters.php|mercenary_guild.php)/
// @include https://daily.heroeswm.ru/help/gn/monsters.php*
// @version 1.15
// @license MIT
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/8835/HWM_Monster_Links.user.js
// @updateURL https://update.greasyfork.org/scripts/8835/HWM_Monster_Links.meta.js
// ==/UserScript==
// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

var monsterarr, monstersDaily, res, rows, txt, i, href, mlink;

if(/plstats_hunters.php/.test(location.href)){
   monsterarr = new Object();
   var ratetable = getClosestParentByTagName(getE("(//td[contains(text(),'Монстры')])"), 'table');

   rows=ratetable.getElementsByClassName("pi");
   for(i=0; i<rows.length; i++)
   {
      el = rows[i];
      if ((href = el.getAttribute("href")) && (res = /army_info.php\?name=(\S+)/.exec(href)) && res[1]){
         monsterarr[el.innerHTML] = res[1];
      }
   }
   if (Object.keys(monsterarr).length > 1) GM_setValue("monsters", JSON.stringify(monsterarr));
}
else if(/mercenary_guild.php/.test(location.href))
{
    var el = getE('//td[contains(text(),"Репутация:")]');
    txt = el.innerHTML;

    var monstername, link;

    if(((res = /'(.{2,25}) {\d+}'/.exec(txt)) || (res = /'<b>(.{2,25})-набеги \{\d+\}/.exec(txt))) && (monstername = res[1]) && (link = getCreatures()[monstername])){
        el.innerHTML = txt.replace(monstername,'<a target="_blank" href="army_info.php\?name='+link+'">'+monstername+'</a>');
    }
    else if ((res = /<b>(.{2,25})-монстр {(\d+)}/.exec(txt)) && (monstername = res[1]))
    {
        var monsterId;
        monstersDaily=getMonstersDaily();

        if(monstersDaily) monsterId= monstersDaily[monstername];
        if(!monsterId) monsterId=0;

        el.innerHTML = txt.replace(monstername+'-монстр','<a target="_blank" href="http://daily.heroeswm.ru/help/gn/monsters.php?id='+monsterId+'&lvl='+res[2]+'">'+monstername+'-монстр'+'</a>');
    }
}
else if(/daily/.test(location.href))
{
    var resLvl, x, row;
    var resId=/id=(\d+)/.exec(location.href);
    if((resId) && (resId[1]==0) ){ // значит нужно обновить и сохранить список монстров
        monstersDaily = new Object();
        el = document.getElementById('id');
        var list = getL("./option[not (@value='0')]", el);
        for (i=0 ; i<list.snapshotLength; i++) monstersDaily[list.snapshotItem(i).text]=list.snapshotItem(i).value;

        if (Object.keys(monstersDaily).length > 1) {
            console.log('Сохранить для getMonstersDaily():', JSON.stringify(monstersDaily));
        }
    }
    else if((resLvl=/lvl=(\d+)/.exec(location.href)) && (x = document.getElementsByClassName("Table")))
    {
        let regex = new RegExp( '\\{'+resLvl[1]+'\\}','i');
        for(i=0, row; row=x[0].rows[i]; i++)
            if(regex.test(row.cells[0].innerHTML)) {row.style.backgroundColor = "yellow"; break; }
    }
}

function getCreatures(){
   if ((monsterarr==null || monsterarr==undefined) && !(monsterarr=JSON.parse( GM_getValue("monsters", null))))
      window.open(document.location.origin+'/plstats_hunters.php');
   return monsterarr;
}

function getMonstersDaily(){
return JSON.parse( '{"Адепты":"494","Адские жеребцы":"76","Адские жнецы":"284","Адские псы":"74","Ангелы":"132","Арбалетчики":"42","Архангелы":"249","Архидемоны":"293","Архидьяволы":"292","Архиличи":"146","Архимаги":"104","Ассасины":"56","Астральные драконы":"514","Баньши":"515","Бегемоты":"131","Берсерки":"163","Бестии":"49","Бесы":"78","Бехолдеры":"207","Боевые грифоны":"36","Боевые единороги":"147","Боевые кентавры":"309","Боевые маги":"578","Вампиры":"15","Вармонгеры":"330","Ведьмы-призраки":"522","Великие левиафаны":"214","Верховные друиды":"120","Вестники смерти":"235","Виверны":"336","Визири джиннов":"579","Владычицы тени":"239","Водные элементали":"156","Вожаки":"436","Воздушные элементали":"153","Воины-наёмники":"21","Воители":"158","Воры-колдуны":"125","Воры-разведчики":"123","Воры-убийцы":"124","Высшие ангелы":"496","Высшие вампиры":"118","Высшие личи":"341","Гарпии":"200","Гарпии-ведьмы":"201","Гарпунеры":"378","Гигантские ящеры":"45","Гидры":"50","Глубоководные черти":"212","Гниющие зомби":"270","Гоблины":"14","Гоблины-лучники":"314","Гоблины-маги":"545","Гоблины-трапперы":"386","Гоги":"285","Големы смерти":"520","Головорезы":"254","Горные стражи":"339","Гремлины":"9","Гремлины-вредители":"253","Грифоны":"3","Громовержцы":"167","Демонессы":"122","Детёныши ящера":"46","Джинны":"39","Джинны-султаны":"105","Дикие энты":"589","Дочери земли":"333","Дочери неба":"332","Древние бегемоты":"301","Древние энты":"238","Дриады":"31","Друиды":"26","Духи":"512","Дьяволы":"82","Дьяволята":"281","Единороги":"38","Железные големы":"12","Жрецы рун":"164","Защитники веры":"260","Защитники гор":"157","Зелёные драконы":"103","Земные элементали":"154","Злобные глаза":"208","Зомби":"5","Изумрудные драконы":"100","Имперские грифоны":"117","Инквизиторы":"145","Искусительницы":"485","Ифриты":"280","Ифриты султаны":"282","Каменные горгульи":"8","Камнегрызы":"203","Камнееды":"202","Кентавры":"310","Князья вампиров":"513","Колоссы":"106","Кони преисподней":"290","Костоломы":"114","Костяные драконы":"133","Кочевые кентавры":"311","Кошмары":"150","Красные драконы":"747","Крестьяне":"4","Кристальные драконы":"590","Кровавые ящеры":"47","Кровоглазые циклопы":"399","Кшатрии ракшасы":"580","Лазутчики":"52","Латники":"71","Левиафаны":"213","Лесные снайперы":"261","Личи":"29","Ловчие":"696","Лучники":"2","Маги":"16","Магма драконы":"169","Магнитные големы":"259","Магоги":"287","Мастера копья":"160","Мастера лука":"72","Мегеры":"315","Медведи":"172","Метатели копья":"159","Минотавры":"55","Минотавры-надсмотрщики":"317","Минотавры-стражи":"70","Могильные големы":"521","Монахи":"37","Морские черти":"211","Мумии":"268","Мумии фараонов":"269","Мятежники":"35","Наездники на волках":"18","Наездники на гиенах":"859","Наездники на кабанах":"318","Наездники на медведях":"161","Наездники на ящерах":"51","Налётчики на волках":"43","Нимфы":"255","Обсидиановые горгульи":"44","Огненные гончие":"288","Огненные демоны":"79","Огненные драконы":"168","Огненные птицы":"536","Огненные элементали":"155","Огры":"24","Огры-ветераны":"535","Огры-маги":"119","Огры-шаманы":"855","Ополченцы":"34","Орки":"23","Орки-вожди":"73","Орки-тираны":"534","Орки-шаманы":"546","Паладины":"234","Палачи":"335","Пауки":"198","Пехотинцы":"10","Пещерные владыки":"236","Пещерные гидры":"149","Пещерные демоны":"83","Пещерные отродья":"291","Привидения":"11","Призраки":"68","Призрачные драконы":"300","Принцессы ракшас":"93","Проворные наездники":"316","Проклятые бегемоты":"861","Птицы грома":"148","Птицы тьмы":"544","Раджи ракшас":"108","Рогатые демоны":"77","Рогатые жнецы":"283","Роки":"30","Рыцари":"90","Рыцари смерти":"273","Рыцари тьмы":"272","Светлые единороги":"588","Свирепые бегемоты":"538","Свободные циклопы":"433","Сирены":"209","Сирены-искусительницы":"210","Скелеты":"1","Скелеты-арбалетчики":"340","Скелеты-воины":"267","Скелеты-лучники":"28","Стальные големы":"69","Старейшины рун":"165","Старшие гремлины":"32","Старшие демоны":"289","Старшие друиды":"587","Степные бойцы":"320","Степные воины":"319","Степные волки":"27","Степные гоблины":"329","Степные циклопы":"397","Стихийные горгульи":"256","Стрелки":"257","Стрелки-наёмники":"20","Суккубы":"81","Сумеречные ведьмы":"94","Сумеречные драконы":"102","Танцующие с ветром":"258","Танцующие с клинками":"25","Танцующие со смертью":"41","Таны":"166","Тёмные виверны":"337","Тёмные всадники":"121","Тёмные гидры":"746","Титаны":"107","Титаны шторма":"581","Тролли":"204","Убийцы":"334","Умертвия":"91","Феи":"17","Фениксы":"464","Фурии":"53","Хобгоблины":"33","Хозяева медведей":"162","Хозяйки ночи":"745","Церберы":"75","Циклопы":"89","Циклопы-генералы":"537","Циклопы-короли":"237","Циклопы-шаманы":"860","Чародеи-наёмники":"126","Чемпионы":"495","Черные тролли":"205","Черти":"80","Чёрные драконы":"101","Чумные зомби":"40","Шаманки":"331","Штурмовые грифоны":"493","Эльфийские лучники":"19","Энты":"92","Ядовитые пауки":"199"}')}

// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

// поиск ближайшего родителя по имени тега
function getClosestParentByTagName(el, tag){var p, e, fnd=false, tf=tag.toLowerCase();e=el;do{p=e.parentElement;if((p) && (p.tagName.toLowerCase()==tf)){fnd=true;break;} e=p;} while (e);
return fnd?p:null;}
