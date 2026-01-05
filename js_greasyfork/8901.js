// ==UserScript==
// @name           Virtonomica: автосортировка  подразделений по колонке "специализация", если в списке только лабы
// @namespace      virtonomica
// @version 	   1.9
// @description    автосортировка  подразделений по колонке "специализация" без учёта других колонок, если в списке только лабы. Сортировка помогает при одновременном изучении нескольких уровней одной технологии 
// @include        http*://*virtonomic*.*/*/main/company/view/*/unit_list
// @include        http*://*virtonomic*.*/*/main/company/view/*
// @downloadURL https://update.greasyfork.org/scripts/8901/Virtonomica%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BF%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B5%20%22%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%22%2C%20%D0%B5%D1%81%D0%BB%D0%B8%20%D0%B2%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B5%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%BB%D0%B0%D0%B1%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/8901/Virtonomica%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BF%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B5%20%22%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%22%2C%20%D0%B5%D1%81%D0%BB%D0%B8%20%D0%B2%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B5%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%BB%D0%B0%D0%B1%D1%8B.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    function trim(str) {
        return str.replace(/^\s+|\s+$/g,"");
    }
    function getLvl(str) {
        var first = str.indexOf('</') + 4;
        var perc = trim(str.substr(0, first));

        var second = str.substr(first+1).indexOf('</') + 4;
        //var lvl = parseFloat(trim(str.substr(first+1, second)).replace("<b>","").replace("</b>",""), 10);
        var matches = str.substr(first+1, second).match(/([0-9]+\.[0-9]+)/);
        var lvl;
        if(matches == null || matches.length == 0){
            lvl = 0;
        }else{
            lvl =  parseFloat(matches[1], 10);
        }
        // console.log("'"+ lvl+"'" );
        return lvl;
    }
    function getName(str) {
        var first = str.indexOf('</') + 4;
        var perc = trim(str.substr(0, first));

        var second = str.substr(first+1).indexOf('</') + 4;
        var lvl = trim(str.substr(first+1, second));

        var name = trim(str.substr(first+1 +second + 1).replace("</div>",""));
        // console.log( "'"+name +"'");
        return name;
    }
    function getPerc(str) {
        var first = str.indexOf('</') + 4;        
        var matches = str.substr(0, first).match(/((:?[0-9]+)|(:?[0-9]+\.[0-9]+))%/);
        var perc =  parseFloat(matches[1], 10);
        // console.log( "'"+ perc +"'");

        return perc;
    }

    function compareSpec(left, right){
        /*if(getName(left) == "") return -1;
        if(getName(right) == "") return -1;
        if(getLvl(left) == NaN) return -1;
        if(getLvl(right) == NaN) return -1;*/
        //console.log("'"+ getName(left)+"' == '" + getName(right)+"'" + (getName(left) == getName(right)));
        //console.log("'"+ getLvl(left)+"' > '" + getLvl(right)+"'" + (getLvl(left) > getLvl(right)));
        var nameCmp = getName(left).localeCompare(getName(right));
        if(nameCmp == 1) return 1;
        else if(nameCmp == -1) return -1;

        var lvlCmp = getLvl(left) - getLvl(right);
        if(lvlCmp > 0) return 1;
        else if(lvlCmp < 0) return -1;

        var percCmp = getPerc(left) - getPerc(right);
        if(percCmp > 0) return 1;
        else if(percCmp < 0) return -1;

        return 0;
    }
    function sort_table(tbody, col, asc){
        var rows = tbody.rows;
        var rlen = rows.length;
        var arr = [];
        var i, j, cells;
        // fill the array with values from the table
        for(i = 0; i < rlen; i++){
            cells = rows[i].cells;
            arr.push([rows[i], cells[col].innerHTML]);
        }
        // sort the array by the specified column number (col) and order (asc)
        arr.sort(function(a, b){
            return asc*compareSpec(a[1], b[1]);
        });
        for(i = 0; i < rlen; i++){
            tbody.appendChild(arr[i][0]);
        }
    }
    $('a[class="i-lab u-s"]').each(function(){
        // Список с ячейками, содержащими названия подразделений
        var td_specs = $('td.spec');
        //alert(td_specs[0].innerHTML);
        // alert(td_spec.parentNode.parentNode.innerHTML);
        sort_table(td_specs[0].parentNode.parentNode, 5, 1);
    });
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}