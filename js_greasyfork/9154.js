// ==UserScript==
// @name        Virtonomica: showUnitCountInCreateNewDlg
// @description Показывает количество уже существующих и строящихся юнитов того же типа при строительстве
// @author  cobra3125
// @version 2.4
// @grant   none
// @include http*://*virtonomic*.*/*/main/unit/view/*
// @exclude http*://*virtonomic*.*/*/main/unit/view/*/*
// @include http*://*virtonomic*.*/*/main/company/view/*
// @include http*://*virtonomic*.*/*/main/company/view/*/unit_list
// @include http*://*virtonomic*.*/*/main/unit/create/*/step2
// @include http*://*virtonomic*.*/*/main/unit/create/*/step3
// @include http*://*virtonomic*.*/*/main/unit/create/*/step4
// @include http*://*virtonomic*.*/*/main/company/view/*/unit_list/building
// @namespace virtonomica
// @downloadURL https://update.greasyfork.org/scripts/9154/Virtonomica%3A%20showUnitCountInCreateNewDlg.user.js
// @updateURL https://update.greasyfork.org/scripts/9154/Virtonomica%3A%20showUnitCountInCreateNewDlg.meta.js
// ==/UserScript==


var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    // a function that loads jQuery and calls a callback function when jQuery has finished loading
    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js");
        script.addEventListener('load', function () {
            var script = document.createElement("script");
            script.textContent = "(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    function StrToMultDimArr(str){
        //alert(str);
        //var str = "4224597;Тракторный завод|4224597;Тракторный завод|4224597;Тракторный завод";
        var tempArray = str.split('|');
        var finalArray = new Array();
        var len = tempArray.length;
        for (var i = 0; i < len; ++i) {
            var tmp = tempArray[i].split(';');
            finalArray.push({
                id: tmp[0],
                name: tmp[1],
                tech: tmp[2]
            });
        }
        return finalArray;
    }


    function trim(str) {
        if(str == null) { return ""; }
        return str.replace(/^\s+|\s+$/g,"");
    }
    function getUnitTypeName() {
        var infoTable = $('table[class="wizardStepInfo"]');
        return infoTable.children('tbody').eq(0).children('tr').eq(1).children('td').eq(0).children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(3).children('div').eq(0).children('span').eq(0).text();
    }
    function getCountryName() {
        var infoTable = $('table[class="wizardStepInfo"]');
        return infoTable.children('tbody').eq(0).children('tr').eq(2).children('td').eq(0).children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(3).children('div').eq(0).children('span').eq(0).text();
    }
    function getRegionName() {
        var infoTable = $('table[class="wizardStepInfo"]');
        return infoTable.children('tbody').eq(0).children('tr').eq(3).children('td').eq(0).children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(3).children('div').eq(0).children('span').eq(0).text();
    }
    function nvl(val1, val2) {
        if (val1 == null) {
            return val2;
        } else {
            return val1;
        }
    }
    /*var data = new Array();
        data['Завод авиашасси|Армения|exist'] = 4;
        data['Завод авиашасси|Армения|pend'] = 20;
        data['Завод авиашасси|Сумгаит|exist'] = 1;
        data['Завод авиашасси|Сумгаит|pend'] = 5;
        data['Завод авиашасси|Гянджа|exist'] = 3;
        data['Завод авиашасси|Гянджа|pend'] = 15;*/

    var unitListStorageName = "UnitListCountInCreateNewDlg";
    var data = JSON.parse(window.localStorage.getItem(unitListStorageName));

    if (!$.isArray(data)){
        data = new Array();
        //alert('reset');
    }
    function delAllPend(){
        var result = new Array();
        var len = data.length;
        for (var i = 0; i < len; ++i) {
            if (data[i].exist == 1) result.push(data[i]);
        }
        data = result;
    }
    function delAllExist(){
        var result = new Array();
        var len = data.length;
        for (var i = 0; i < len; ++i) {
            if (data[i].exist == 0) result.push(data[i]);
        }
        data = result;
    }
    function delExistByType(unitType){
        var result = new Array();
        var len = data.length;
        for (var i = 0; i < len; ++i) {
            if (data[i].unitType != unitType || data[i].exist == 0) result.push(data[i]);
        }
        data = result;
    }
    function addDataVal(id, unitType, place, exist) {
        /*console.log("'"+ unitType+"'" );
            console.log("'"+ place+"'" );
            console.log("'"+ exist+"'" );
            console.log("'"+ '--'+"'" );*/
        /*var key = unitType +'|'+ place +'|'+ exist;
            if (data[key] == null) {
                data[key] = 1;
            } else {
                data[key] = data[key] + 1;
            }*/
        for(var i = data.length - 1; i >= 0; i--) {
            if(data[i].id == id && data[i].place == place) {
                data.splice(i, 1);
            }
        }
        data.push({
            id: id,
            unitType: unitType,
            place: place,
            exist: exist
        });
    }
    function addExistCnt(id, unitType, place) {
        addDataVal(id, unitType, place, 1);
    }
    function addPendCnt(id, unitType, place) {
        addDataVal(id, unitType, place, 0);
    }
    function getDataVal(unitType, place, exist, defVal) {
        /*console.log("'"+ unitType+"'" );
            console.log("'"+ place+"'" );
            console.log("'"+ exist+"'" );
            console.log("'"+ '--'+"'" );*/
        var key = unitType +'|'+ place +'|'+ exist;
        if (data[key] == null) {
            return defVal;
        } 
        return data[key];
    }
    var countedData = null;
    function getDataVal(unitType, place, exist, defVal) {
        if (countedData == null){
            countedData = new Array();
            data.forEach(function(entry) {
                //console.log(entry.id);
                var tmpKey = entry.unitType +'|'+ entry.place +'|'+ entry.exist;
                if (countedData[tmpKey] == null) {
                    countedData[tmpKey] = 1;
                } else {
                    countedData[tmpKey] = countedData[tmpKey] + 1;
                }
            });
        }
        /*console.log("'"+ unitType+"'" );
            console.log("'"+ place+"'" );
            console.log("'"+ exist+"'" );
            console.log("'"+ '--'+"'" );*/
        var key = unitType +'|'+ place +'|'+ exist;
        if (countedData[key] == null) {
            return defVal;
        } 
        return countedData[key];
    }
    function getExistCnt(unitType, place, defVal) {
        return getDataVal(unitType, place, 1, defVal);
    }
    function getPendCnt(unitType, place, defVal) {
        return getDataVal(unitType, place, 0, defVal);
    }
    //
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/unit\/create\/\w+\/step2/.test(window.location)) {
        var svUnitTypeName = getUnitTypeName();
        var trIdx = 0;
        $('table[class="list"]').children('tbody').eq(0).children('tr').each(function() {
            if(trIdx == 0){
                jQuery(this).append("<th>Таких же есть</th>");
                jQuery(this).append("<th>Таких же строится</th>");
            } else {
                var svCountryName = trim(jQuery(this).children('td').eq(1).text());
                //console.log("'"+ countryName+"'" );
                jQuery(this).append('<td align="center">'+getExistCnt(svUnitTypeName, svCountryName, 0)+'</td>');
                jQuery(this).append('<td align="center">'+getPendCnt(svUnitTypeName, svCountryName, 0)+'</td>');
            }
            trIdx = trIdx + 1;
        });
    }
    //
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/unit\/create\/\w+\/step3/.test(window.location)) {
        var svUnitTypeName = getUnitTypeName();
        //alert(getUnitTypeName());
        //alert(getCountryName());
        //alert(getRegionName());
        var trIdx = 0;
        $('table[class="list"]').children('tbody').eq(0).children('tr').each(function() {
            if(trIdx == 0){
                jQuery(this).append("<th>Таких же есть</th>");
                jQuery(this).append("<th>Таких же строится</th>");
            } else {
                var svRegiomName = trim(jQuery(this).children('td').eq(1).text());
                //console.log("'"+ svRegiomName+"'" );
                jQuery(this).append('<td align="center">'+getExistCnt(svUnitTypeName, svRegiomName, 0)+'</td>');
                jQuery(this).append('<td align="center">'+getPendCnt(svUnitTypeName, svRegiomName, 0)+'</td>');
            }
            trIdx = trIdx + 1;
        });
    }
    //
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/unit\/create\/\w+\/step4/.test(window.location)) {
        var svUnitTypeName = getUnitTypeName();
        //alert(getUnitTypeName());
        //alert(getCountryName());
        //alert(getRegionName());
        var trIdx = 0;
        $('table[class="list"]').children('tbody').eq(0).children('tr').each(function() {
            if(trIdx == 0){
                jQuery(this).append("<th>Таких же есть</th>");
                jQuery(this).append("<th>Таких же строится</th>");
            } else {
                var svCityName = trim(jQuery(this).children('td').eq(1).text());
                //console.log("'"+ svCityName+"'" );
                jQuery(this).append('<td align="center">'+getExistCnt(svUnitTypeName, svCityName, 0)+'</td>');
                jQuery(this).append('<td align="center">'+getPendCnt(svUnitTypeName, svCityName, 0)+'</td>');
            }
            trIdx = trIdx + 1;
        });
    }
    //для сбора списка подразделений
    if (/\w*virtonomic\w+\.\w+\/\w+\/main\/company\/view\/\d+/.test(window.location)) {
        var typeFilterSelected = 1;
        var pagingDivChild = $('table[class="paging"]').children('tbody').eq(0).children('tr').eq(0).children('td').eq(0).children('div').eq(2).children();
        $('select[class="unittype"]').children('option').each(function () {
            //console.log("'jQuery(this).selected = "+ jQuery(this).attr('selected')+"'" );
            //console.log("'jQuery(this).value = "+ jQuery(this).attr('value')+"'" );
            if (jQuery(this).attr('selected') == 'selected' && jQuery(this).attr('value') == 0){
                typeFilterSelected = 0;
            }
        });
        //console.log("'typeFilterSelected = "+ typeFilterSelected+"'" );
        if (typeFilterSelected == 0 && pagingDivChild.length == 2){
            var typeGroup = $('a[class$="u-s"]');
            if (typeGroup.attr('class') == "u-t u-s"){
                delAllExist();
                console.log("'delAllExist'" );
            }
        }

        $('td.info').parent().parent().children('tr').each(function () {
            var unitType = jQuery(this).children('td').eq(2).attr('title');
            var city = trim(jQuery(this).children('td').eq(1).text());
            var place = jQuery(this).children('td').eq(1).attr('title');
            var places = place.split(';');
            var country = trim(places[0]);
            var region = trim(places[1]);
            var id = jQuery(this).children('td').eq(0).text();
            //console.log("'"+ id+"'" );

            addExistCnt(id, unitType, country);
            if(region != ""){
                addExistCnt(id, unitType, region);
            }
            addExistCnt(id, unitType, city);
        });

        window.localStorage.setItem(unitListStorageName,JSON.stringify(data));
    }
    //для сбора списка стоящихся подразделений
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/company\/view\/\d+\/unit_list\/building/.test(window.location)) {
        var pagingDivChild = $('table[class="paging"]').children('tbody').eq(0).children('tr').eq(0).children('td').eq(0).children('div').eq(2).children();
        if (pagingDivChild.length == 2){
            delAllPend();
        }

        $('table[class="list"]').children('tbody').eq(0).children('tr').each(function () {
            var unitType = jQuery(this).children('td').eq(1).children('a').eq(1).text();
            if(unitType != ""){
                var city = trim(jQuery(this).children('td').eq(0).children('b').eq(0).text());
                var country = jQuery(this).children('td').eq(0).children('img').eq(0).attr('title');
                var region = jQuery(this).children('td').eq(0).html();
                //console.log("'"+ region+"'" );
                var first = region.indexOf('&nbsp;') + 6;
                var second = region.indexOf('<br>');
                region = trim(region.substr(first, second - first));
                //console.log("'"+ region+"'" );

                var id = jQuery(this).children('td').eq(1).children('a').eq(0).attr('href');
                id = /(\d+)$/.exec(id)[1];

                addPendCnt(id, unitType, country);
                if(region != ""){
                    addPendCnt(id, unitType, region);
                }
                addPendCnt(id, unitType, city);
            }
        });

        window.localStorage.setItem(unitListStorageName,JSON.stringify(data));
    }
    //для сбора списка стоящихся подразделений
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/unit\/view\/\d+/.test(window.location)) {
        var unitType = $('div#mainContent').children('h1').eq(0).text();
        if(unitType != ""){
            var place = $('div#mainContent').children('h3').eq(1).text();
            //console.log("'"+ unitType+"'" );
            var colon = place.indexOf(':') + 1;
            place = trim(place.substr(colon));

            var openParen = place.indexOf('(');
            var city = trim(place.substr(0, openParen));

            var closeParen = place.indexOf(')');
            var comma = place.indexOf(',');

            var country = trim(place.substr(openParen+1, comma - openParen - 1));
            var region = trim(place.substr(comma+1, closeParen - comma - 1));
            //console.log("'"+ country+"'" );
            //console.log("'"+ region+"'" );
            var id = /(\d+)$/.exec(location.href)[1];
            //console.log("'"+ id+"'" );
            if(unitType != ""){
                addPendCnt(id, unitType, country);
                if(region != ""){
                    addPendCnt(id, unitType, region);
                }
                addPendCnt(id, unitType, city);
            }
        } else {
            unitType = $('li[class="sel"]').children('a').eq(0).text();
            var officePlace = $('div[class="officePlace"]');
            var place = officePlace.html();
            var br = place.indexOf('<br>') + 4;
            var city = trim(place.substr(br));
            var openParen = city.indexOf('(');
            var colon = city.indexOf(':') + 1;
            city = trim(city.substr(colon, openParen - colon));

            var country = officePlace.children('a').eq(1).text();
            var region = officePlace.children('a').eq(2).text();
            if(!/geo\/citylist\/\d+/.test(officePlace.children('a').eq(2).attr('href'))){
                region = "";
            }
            var id = /(\d+)$/.exec(location.href)[1];
            //console.log("'"+ id+"'" );
            if(unitType != ""){
                addExistCnt(id, unitType, country);
                if(region != ""){
                    addExistCnt(id, unitType, region);
                }
                addExistCnt(id, unitType, city);
            }
        }


        window.localStorage.setItem(unitListStorageName,JSON.stringify(data));
    }
};

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 