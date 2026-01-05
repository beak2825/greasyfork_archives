// ==UserScript==
// @name       DestinyLFG.com refresher
// @version    0.1
// @description  Refreshes the DestinyLFG.com list automatically
// @match      http://www.destinylfg.com
// @copyright  2014+, You
// @namespace https://greasyfork.org/users/2353
// @downloadURL https://update.greasyfork.org/scripts/6790/DestinyLFGcom%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/6790/DestinyLFGcom%20refresher.meta.js
// ==/UserScript==

var d = document;
function main () {
    var t=10000, f = function () {
        if(!$(".modal-dialog").is(":visible") && $(".AutoRefresh").is(":checked")){
            $(".refreshTime").text(tf())
        	$("#refresh").click();
        }
        setTimeout(f, t);
    }, tf = function (){
        var d = new Date(), h = d.getHours(), m = String(d.getMinutes()), s = String(d.getSeconds()),
        	st = (h > 12 ? h - 12 : h) + ":" + (m.length == 1 ? "0" + m : m) + ":" + (s.length == 1 ? "0" + s : s) + " " + (h > 12 ? "pm" : "am");
        return st;
    }
    
    $(".panel-body>.row:first-child").clone().empty()
    	.append("<span style='padding-left:15px'><input type='checkbox' class='AutoRefresh' checked='true'/> Auto Refresh (Last refresh: <span class='refreshTime'>"+tf()+"</span>)</span>")
    	.insertAfter(".panel-body>.row:nth-child(2)");
    
    setTimeout(f, t);
}

var s = d.createElement("script");
s.appendChild(d.createTextNode('('+main+')()'));
(d.head || d.body || d.documentElement).appendChild(s);