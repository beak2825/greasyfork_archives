// ==UserScript==
// @name HWM_Resources_Cost
// @description   Отображает на странице персонажа общую стоимость ресурсов (дерево, руда, ртуть и т.п.) по цене 170/350 и общую рыночную стоимость элементов, скрывает части артов/отрядов
// @namespace  Zeleax
// @author  Zeleax
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/pl_info.php/
// @grant   none
// @license MIT
// @version 2.11.1
// @downloadURL https://update.greasyfork.org/scripts/8836/HWM_Resources_Cost.user.js
// @updateURL https://update.greasyfork.org/scripts/8836/HWM_Resources_Cost.meta.js
// ==/UserScript==

// Цены
var resPrices = {"wood": 170, "ore": 170, "mercury": 350, "sulfur": 350, "crystals": 350, "gems": 350} // ресурсы

// Ниже ничего не менять!
var elPricesTemplate = {"абразив":0, "змеиный яд":0, "клык тигра":0, "ледяной кристалл":0, "лунный камень":0, "огненный кристалл":0, "осколок метеорита":0, "цветок ведьм":0, "цветок ветров":0, "цветок папоротника":0, "ядовитый гриб":0};
const el_keys= ['abrasive','snake_poison','tiger_tusk','ice_crystal','moon_stone','fire_crystal','meteorit','witch_flower','wind_flower','fern_flower','badgrib']
const el_names_ru=["абразив", "змеиный яд", "клык тигра", "ледяной кристалл", "лунный камень", "огненный кристалл", "осколок метеорита", "цветок ведьм", "цветок ветров", "цветок папоротника", "ядовитый гриб"]

// GM functions
if (typeof GM_getValue != 'function') {this.GM_getValue=function (key,def) {return localStorage[key] || def;};this.GM_setValue=function (key,value) {return localStorage[key]=value;};	this.GM_deleteValue=function (key) {return delete localStorage[key];};}

// Восстанавливаем цены в массив
var marketPricesSaveDate = GM_getValue('hwmResorcesCost_saveDate',null);
var elPrices=JSON.parse(GM_getValue('hwmResorcesCost_elPrices',null));

if (elPrices==null || Object.keys(elPrices).length!=Object.keys(elPricesTemplate).length || elPrices[Object.keys(elPrices)[0]]==0)
{
   console.log('Loading prices...');
   elPrices=elPricesTemplate;
   getElementsPricesFromMarket();
}

// Ресурсы
var resRow =  getE("(//img[contains(@src,'wood.png')])[last()]").parentNode.parentNode;
var resArr = resRow.getElementsByTagName('img');
var resSum = 0;
var res, imgname, rPrice, elCell;

for(var i=0, el; el=resArr[i]; i++)
   if((imgname = el.getAttribute('src')) && (res = /([a-z]{1,}).png/.exec(imgname)) && (res[1]) && (rPrice = resPrices[res[1]]) )
     resSum += parseInt(el.parentNode.nextSibling.firstChild.innerHTML.replace(',',''), 10) * rPrice;

createCell(resRow.insertCell(-1), " = "+resSum, 'resRow');

// Элементы
var tdResourcesTitle = getE("//td[b[text()='Ресурсы']]");

// кнопка управления отображением частей
var span = document.createElement("SPAN");
span.innerHTML='&nbsp;&nbsp;';
tdResourcesTitle.appendChild(span);

if(tdResourcesTitle) elCell = tdResourcesTitle.parentNode.nextSibling.firstChild;
else {
    return;
}

var elements_html_starts_pos= 0 // " - в начале
var elements_html_ends_pos=elCell.innerHTML.indexOf('<br>\n<br>') // разделитель между блоками
if (elements_html_ends_pos==-1){
    elements_html_ends_pos=elCell.innerHTML.length;
}
var txt=elCell.innerHTML.substring(elements_html_starts_pos, elements_html_ends_pos)

var myRe = /&nbsp;&nbsp;(\D+):&nbsp;(\d+)/g;
resArr = [];
while (res = myRe.exec(txt)) resArr[res[1].toLowerCase()]=res[2];

RefreshTable();

function RefreshTable()
{
    // Создаем таблицу с ценами
    var elSum = 0
    var elPosCnt=0, ePrice;

    var html = [];
    html.push('<table><tbody><tr><td></td><td>Кол-во</td><td  align="right">Цена</td></tr>');

    var html2 = []; // элементы
    var obj;

    for (var key in resArr)
    {
        if(ePrice= elPrices[key]) {obj=html2;}

        obj.push('<tr><td><b>'+key+'<b></td><td  align="right">'+resArr[key]+'</td><td align="right">');
        if(ePrice= elPrices[key]) // цена
        {
            obj.push('<i>'+ePrice+'</i>');
            elSum += parseInt(resArr[key])*ePrice;
            elPosCnt++;
        }
        obj.push('</td></tr>');
    }

    html.push(...html2);
    html.push('<tr><td><input type="button" name="btnRefreshPrices" value="Обновить стоимость" /></td><td></td><td align="right" title="Общая стоимость элементов"><b>'+elSum+'</b></td></tr></tbody></table>');

    if(elPosCnt>0)
    {
        elCell.innerHTML = elCell.innerHTML.slice(0, elements_html_starts_pos) + html.join("") + elCell.innerHTML.slice(elements_html_ends_pos);
        el=document.getElementsByName('btnRefreshPrices')[0];
        el.onclick =function() {el.disabled=true; getElementsPricesFromMarket(); location.reload();}
        el.title='Цены обновлены '+marketPricesSaveDate;
    }
}

// Загрузить цены на элементы c рынка
function getElementsPricesFromMarket()
{
   var docObj, td_el, row, price;

    for (var key in elPrices) elPrices[key]=0; // очистка цен

    for (var j=0; j<el_keys.length; j++){
        docObj = func_getDocumentFromUrl('/auction.php?cat=elements&sort=0&art_type='+el_keys[j]);
        if(!docObj) {
            alert('Ошибка загрузки данных с рынка');
            break;
        }

        td_el=getE(" //td[a[contains(@href, 'auction_lot_protocol')]]",null,docObj);
        if(td_el){
            row=getE('ancestor::tr[@class="wb"]', td_el); // строка
            price=getE('.//img[contains(@src,"gold")]', row).parentNode.nextSibling.innerText; // цена (2,569)
            price=parseInt(price.replace(',',''), 10); // 2569

            elPrices[el_names_ru[j]]=price;
        }
        else {
            alert('Цены не обновляются при переходе по карте, участии в бою, таверне и т.д.');
            return;
        }
    }

    GM_setValue("hwmResorcesCost_elPrices", JSON.stringify(elPrices));
    marketPricesSaveDate=(new Date()).toLocaleString();
    GM_setValue("hwmResorcesCost_saveDate", marketPricesSaveDate);

   return;
}

// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
    txt = document.createTextNode(text); // create text node
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
}

function newButton(text, title, func){var btn = document.createElement('input'); btn.type = "button"; btn.className = "btn"; btn.value = text; btn.title=title; btn.onclick = func; return btn; }

// получает документ по заданному URL
function func_getDocumentFromUrl(urlToLoad){console.log('Load data from url: '+urlToLoad);var req=new XMLHttpRequest(); req.open("GET", urlToLoad, false); req.overrideMimeType('text/xml; charset=windows-1251'); req.send(null); var parser = new DOMParser(); return parser.parseFromString(req.responseText, "text/html"); }

// доступ по xpath
function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
function getL(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
