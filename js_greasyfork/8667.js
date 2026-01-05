// ==UserScript==
// @name           Politics and War Alliance Bank Records Extractor
// @description    Enables copy and pasting of bank records into a spreadsheet. Data is tab seperated.
// @include        https://politicsandwar.com/alliance/id=*&display=bank*
// @version        0.2
// @require		   http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant          none
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/8667/Politics%20and%20War%20Alliance%20Bank%20Records%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/8667/Politics%20and%20War%20Alliance%20Bank%20Records%20Extractor.meta.js
// ==/UserScript==

var search = window.location.pathname;
var info = document.getElementById("footer");
var data;
var records = [];
var content = "";
var counter = 0;
var head = "Number\tDate\tSender\tReceiver\tMoney\tFood\tCoal\tOil\tUranium\tLead\tIron\tBauxite\tGasoline\tMunitions\tSteel\tAluminum\n"

if(search.indexOf('taxes') >= 0){
    var tableNum = 1;
    var tableRows = 500;
}else{
    var tableNum = 3;
    var tableRows = 50;
}

jQuery("#footer").append('<br /><h2>Spreadsheet compatible data for this page</h2><br /><textarea id="dataArea" rows="' + String(tableRows) + '" class="form-control"></textarea>');


jQuery('table:eq(' + String(tableNum) + ')').find('td').each(function() {
    data = jQuery(this).text();
    records.push(data);
});


for (i = 0; i < records.length; ++i) {
    counter++;
    if(counter != 17){
        content += records[i]+'\t';
    }else{
        content += '\n';
        counter = 0;
    }
}

jQuery("#dataArea").val(head + content);