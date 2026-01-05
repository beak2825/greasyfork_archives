// ==UserScript==
// @name 		HWM Store Many Arts
// @version 	1.4
// @description 	HWM Mod - Скрипт для перемещения артефактов на клановый склад и обратно пачкой
// @namespace 	- SAURON -  &  mod Mefistophel_Gr
// @include 	http://*.heroeswm.ru/sklad_info.php*
// @include 	http://178.248.235.15/sklad_info.php*
// @grant		GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8782/HWM%20Store%20Many%20Arts.user.js
// @updateURL https://update.greasyfork.org/scripts/8782/HWM%20Store%20Many%20Arts.meta.js
// ==/UserScript==

// (c) 2015, - SAURON -  (http://www.heroeswm.ru/pl_info.php?id=3658084)
// 2015, Mefistophel_Gr (http://www.heroeswm.ru/pl_info.php?id=2287844)

(function() {

var params = [];
var count = 0;
var store_id = -1;
var store_sign = -1;
var isAdd = 0;
var headadd = 0;
var mytimeout = 1000;	// задержка перед помещением/снятием след. арта
var access = "\u043D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0441\u043A\u043B\u0430\u0434\u0443";

//if(getURIParam()['cat'] != undefined)
{
    if(document.body.innerHTML.indexOf('sklad_rc_on=0') >-1 && document.body.innerHTML.indexOf(access) == -1) {
        var inputs = document.body.getElementsByTagName('input');
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].name == 'inv_id' && inputs[i].parentNode.name == 'f') {
                if(!headadd) {
                    var td = document.createElement('td');
                    td.width = '5';
                    td.align = 'center';
                    td.innerHTML = '<input type=checkbox id=macrochecker title="Отметить всё">';
                    inputs[i++].parentNode.parentNode.parentNode.parentNode.firstChild.insertBefore(td,inputs[i].parentNode.parentNode.parentNode.parentNode.firstChild.firstChild);
                    headadd = 1;
                }
                var t = document.createElement('td');
                t.style='background: #eeeeee';
                t.innerHTML = '<input type=checkbox id="c'+inputs[i].value+'" class="myarts" title="Отметить артефакт для переноса в инвентарь">';
                inputs[i++].parentNode.parentNode.parentNode.insertBefore(t, inputs[i].parentNode.parentNode.parentNode.firstChild);
            } else if(inputs[i].value == 'Поместить') {
                inputs[i].parentNode.innerHTML += "<div style='text-align: left;height: 130px;width: 430px;border: 1px solid #C1C1C1;overflow-y: scroll;' id='artplace'></div><br><input type='button' id='setterArt' title='Поместить отмеченные в списке выше артефакты на склад' value='Поместить на склад'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type='button' id='getterArt' title='Забрать отмеченные ниже артефакты со склада' value='Забрать со склада'><div id='statusplace' style='text-color:red;'></div>";
                var marts = inputs[i].parentNode.parentNode.parentNode.getElementsByTagName('option');
                var div = document.getElementById('artplace');
                for(var j = 1; j < marts.length; j++) {
                    div.innerHTML += "<input type='checkbox' class='artsfromset' id='set"+marts[j].value+"'>"+marts[j].innerHTML+"<br>";
                }
            marts[0].parentNode.style = 'display: none;';
            inputs[i].style = 'display: none;';
            }
            else if(inputs[i].name == 'id' && inputs[i].value != undefined && store_id == -1) store_id = inputs[i].value;
            else if(inputs[i].name == 'sign' && inputs[i].value != undefined && store_sign == -1) store_sign = inputs[i].value;
        }
        document.getElementById('getterArt').onclick = function(){getCheckedArts();};
        document.getElementById('setterArt').onclick = function(){setCheckedArts();};
        document.getElementById('macrochecker').onchange = function(){changeCheck();};
    }
};

//========== Забираем арты ==================
function getCheckedArts() {
    params = [];
    var c = document.getElementsByClassName('myarts');
    for(var i = 0; i < c.length; i++) {
        if(c[i].checked) {
            try {
            var inps = c[i].parentNode.parentNode.getElementsByTagName('form')[1].getElementsByTagName('input');
            var str = '';
                for(var j = 0; j < inps.length - 1; j++) {
                    if(j != 0) str += '&';
                    str += inps[j].name + '=' + inps[j].value;
                }
            params.push(str);
            }
            catch(e){alert(e)}
        }
    }
    count = params.length;
    isAdd = 0;
    startGetter();
}

//========== Помещаем арты ==================
function setCheckedArts() {
    params = [];
    var c = document.getElementsByClassName('artsfromset');
    for(var i = 0; i < c.length; i++) {
        if(c[i].checked) {
            try {
                var str = 'id=' + store_id + '&sign=' + store_sign + '&p_art_id=' + c[i].id.split('et')[1];
                params.push(str);
            }
            catch(e){alert(e)}
        }
    }
    count = params.length;
    isAdd = 1;
    startGetter();
}

//======= Функция перемещения артов ===========
function startGetter() {
    if(params.length > 0) {
        var txt = '';
        if(isAdd == 1) txt = 'Помещено'; else txt = 'Забрано';
        var uri = "http://"+location.hostname+"/sklad_info.php?" + params.pop();
        GM_xmlhttpRequest({
            method: "GET",
            url: uri,
            onload: function(response) {
                if (txt == 'Помещено') {
                    document.getElementById('statusplace').innerHTML = "<center><font style='color:#006400;'><b>"+txt+" артов: </font><font style='color:#0070FF;'>"+(count-params.length)+"/"+count+"</b></font></center>";
                } else 
                    document.getElementById('statusplace').innerHTML = "<center><font style='color:#FF0000;'><b>"+txt+" артов: </font><font style='color:#0070FF;'>"+(count-params.length)+"/"+count+"</b></font></center>";
                if(params.length > 0) {
                    setTimeout(startGetter, mytimeout);
                } else {
                    if(!isAdd) {location.href = location.href;}
                    else location.href = "http://"+location.hostname+"/sklad_info.php?id=" + getURIParam()['id'] + "&cat=5";
                }
            }
        });
    }
}

function getURIParam() {
    var search = window.location.search.substr(1),
    keys = {};
    search.split('&').forEach(function(item) {
        item = item.split('=');
        keys[item[0]] = item[1];
    });
    return keys;
}

//========== Выбрать все ==================
function changeCheck() {
    var c = document.getElementById('macrochecker');
    var myinp = document.getElementsByClassName('myarts');
    for(var i = 0; i < myinp.length; i++) {
        myinp[i].checked = c.checked;
    }
}

})();