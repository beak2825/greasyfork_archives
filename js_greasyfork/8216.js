// ==UserScript==
// @name           Politics and War Market Extractor
// @description    Extracts Resource, Date Offered, Units Available, and PPU from market page and prints it at the bottom of the page in a format that will paste easily to spreadsheets.
// @include        https://politicsandwar.com/index.php?id=26*
// @version        0.1
// @grant          none
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/8216/Politics%20and%20War%20Market%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/8216/Politics%20and%20War%20Market%20Extractor.meta.js
// ==/UserScript==

var tableRows = document.getElementsByTagName("tr");
var info = document.getElementById("footer");
var data;
var offers = [];
var r,d,i;
var counter = 0;
var contentHead = "<br /><h2>Spreadsheet compatible data for this page</h2><br />Resource\tDate Offered\tUnits Available\tPPU<br />";
info.innerHTML = info.innerHTML + contentHead;

function getOffers() {
    for (r = 0; r < tableRows.length; ++r) {
        var content = "";
        data = tableRows[r].getElementsByTagName("td");
        for (d = 0; d < data.length; ++d) {
            if(d != 0 && d != 1 && d != 2 && d != 7){
                if(d == 5){
                    var ppu = data[d].textContent.replace(/,/g, '').split(" ");
                	offers.push(ppu[1]);
                }else{
                    offers.push(data[d].textContent.replace(/,/g, ''));
                }
            }
        }
        
        
        for (i = 0; i < offers.length; ++i) {
            if(i != 3){
                if(i != 5){
                    content += offers[i]+'\t';
                }else{
                    content += offers[i];
                }
            }
        }
       	
        if(content != ""){
            var resource = offers[3].split(" ");
        	info.innerHTML = info.innerHTML + resource[resource.length-1] + "\t" + content+"<br />";
            offers = [];
        }
	}

}
 
getOffers();