// ==UserScript==
// @name         Auto-edit-enabler
// @version      1.5
// @namespace    http://ZHYANhomepage/
// @description  Ciat auto edit enabler
// @author       Yan
// @include      http*://*pvs.j*.net/jss-ciat/app/pr-detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7793/Auto-edit-enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/7793/Auto-edit-enabler.meta.js
// ==/UserScript==

$(document).ready(function() {

    function rC(nam) {
        var tC = document.cookie.split('; ');
        for (var i = tC.length - 1; i >= 0; i--) {
            var x = tC[i].split('='); 
            if (nam == x[0]) return unescape(x[1]);
        } 
        return '~';
    } 

    function wC(nam,val) {
        document.cookie = nam + '=' + escape(val);
    } 

    function lC(nam,pg) {
        var val = rC(nam); 
        if (val.indexOf('~'+pg+'~') != -1) return false;
        val += pg + '~'; 
        wC(nam,val); 
        return true;
    } 

    function FT(cN) {
        return lC('pWrD4jBo',cN);
    } 
    function thisPage() {
        var page = location.href.substring(location.href.lastIndexOf('\/')+1); 
        pos = page.indexOf('.');
        if (pos > -1) {
            page = page.substr(0,pos);
        } 
        return page;
    }

    /*
    function abc () {
        var isEditButtonClicked = $('#isEditButtonClicked').val();
        if (isEditButtonClicked == "true") {	
            bar = $('.section-hdg');
            $("#section_adv_services_fields").click();
            $("#ciatCustRecEditLbl").click();
            bar[2].click();
            bar[4].click();
        }
    }
*/   
    function abc () {
        if (FT(thisPage())) {
            //$("#prDetailEditBtn").click();
            $('#isEditButtonClicked').val('true');
            $('#prDetailEditBtn').remove();
            bar = $('.section-hdg');
            $("#section_adv_services_fields").click();
            $("#ciatCustRecEditLbl").click();
            bar[2].click();
            bar[4].click();
        }
    }
    window.setTimeout(abc,3000);
})