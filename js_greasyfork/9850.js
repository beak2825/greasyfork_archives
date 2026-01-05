// ==UserScript==
// @name       jawz str11223344
// @version    1.2
// @author	   jawz
// @description    stuff
// @match	   https://cloudengine1.com/*
// @match	   http://www.amazon.com/*
// @match	   http://www.amazon.ca/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9850/jawz%20str11223344.user.js
// @updateURL https://update.greasyfork.org/scripts/9850/jawz%20str11223344.meta.js
// ==/UserScript==

var CLICKSOUND = 'https://www.freesound.org/data/previews/215/215772_4027196-lq.mp3';

$(document).ready(function() {
    if (document.URL.indexOf("cloudengine1.com") >= 0) {
        //window.alert = function() {};
        $('input[name="itemname"]').focus();
        
        ///Move This///
        //var tag = $('input[name="itemname"]').val();
        //tag = tag.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        //$('input[name="itemname"]').val(tag);
    }
        
    if (document.URL.indexOf("cloudengine1.com") >= 0 && $('h1:contains("How much would this item cost to replace?")').length) { 
        
        GM_setValue("str11223344", true);
        var allText = $('body').text();
        var multip = allText.split('Replacement price: $ × ')[1];
        multip = multip.split(' = $')[0];
        var TABLE = document.getElementsByTagName("table")[0];
        var COUNTRY, SEARCHTWO, SEARCHALL, NAMEROW, BRANDROW, MODELROW, NAME, original, mathType;
        var BRAND = "";
        var MODEL = "";
        var halfScreen = screen.width/2; 
        var windowHeight = screen.height; 
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        
        for (i = 2; i < TABLE.rows.length; i++)
            TABLE.rows[i].insertCell();
        
        TABLE.rows[0].cells[0].colSpan = "3";
        TABLE.rows[1].cells[1].colSpan = "2";
        
        TABLE.width = "700px";
        TABLE.rows[1].cells[0].width = "75px";
        TABLE.rows[1].cells[1].width = "200px";
        
        if (TABLE.rows[1].cells[1].innerHTML.indexOf('United States') >= 0)
            COUNTRY = ".com";
        if (TABLE.rows[1].cells[1].innerHTML.indexOf('Canada') >= 0)
            COUNTRY = ".ca";
        
        tr = TABLE.insertRow();
        tr.style.backgroundColor = "#004992";
        td = tr.insertCell();
        td.colSpan = "3";
        td.innerHTML = "Brand & Name(Uses All Available Data): ";
        
        tr2 = TABLE.insertRow();
        tr2.style.backgroundColor = "#004992";
        td2 = tr2.insertCell();
        td2.colSpan = "3";
        td2.innerHTML = "Brand, Name & Model(Uses All Available Data): ";
        
        for (i = 0; i < TABLE.rows.length - 2; i++) {
            if (TABLE.rows[i].cells[0].innerHTML.indexOf('Name') >= 0) 
                NAMEROW = i;
            if (TABLE.rows[i].cells[0].innerHTML.indexOf('Brand') >= 0) 
                BRANDROW = i;
            if (TABLE.rows[i].cells[0].innerHTML.indexOf('Model') >= 0) 
                MODELROW = i;
        }
        
        NAME = TABLE.rows[NAMEROW].cells[1].innerHTML.replace(/[\{\}\(\)\[\]']+/g, '');
        
        if (BRANDROW > 0)
            BRAND = TABLE.rows[BRANDROW].cells[1].innerHTML.replace(/[\{\}\(\)\[\]']+/g, '');
            
        if (MODELROW > 0)
            MODEL = TABLE.rows[MODELROW].cells[1].innerHTML.replace(/[\{\}\(\)\[\]']+/g, '');
        
        SEARCHALL = NAME + " " + BRAND + " " + MODEL;
        SEARCHTWO = NAME + " " + BRAND;
        SEARCHALL = SEARCHALL.replace(/[\{\}\(\)\[\]']+/g, '');
        SEARCHTWO = SEARCHTWO.replace(/[\{\}\(\)\[\]']+/g, '');

        amazonSearch(SEARCHTWO)
        
        var btnAmazon = document.createElement("BUTTON");
        btnAmazon.innerHTML = "Amazon";
        btnAmazon.type = "button";
        btnAmazon.onclick = function() { amazonSearch(SEARCHALL); }
        
        var btnTwoAmazon = document.createElement("BUTTON");
        btnTwoAmazon.innerHTML = "Amazon";
        btnTwoAmazon.type = "button";
        btnTwoAmazon.style.position = "relative";
        btnTwoAmazon.style.left = "26px";
        btnTwoAmazon.onclick = function() { amazonSearch(SEARCHTWO); }
        
        var btnNameAmazon = document.createElement("BUTTON");
        btnNameAmazon.innerHTML = "Amazon";
        btnNameAmazon.type = "button";
        btnNameAmazon.onclick = function() { amazonSearch(NAME); }
        
        var btnBrandAmazon = document.createElement("BUTTON");
        btnBrandAmazon.innerHTML = "Amazon";
        btnBrandAmazon.type = "button";
        btnBrandAmazon.onclick = function() { amazonSearch(BRAND); }
        
        var btnBrandLiquor = document.createElement("BUTTON");
        btnBrandLiquor.innerHTML = "Liquor";
        btnBrandLiquor.type = "button";
        btnBrandLiquor.onclick = function() { homeDepotSearch(BRAND); }
        
        var btnModelAmazon = document.createElement("BUTTON");
        btnModelAmazon.innerHTML = "Amazon";
        btnModelAmazon.type = "button";
        btnModelAmazon.onclick = function() { amazonSearch(MODEL); }

        var btnGoogle = document.createElement("BUTTON");
        btnGoogle.innerHTML = "Google";
        btnGoogle.type = "button";
        btnGoogle.onclick = function() { googleSearch(SEARCHALL); }
        
        var btnTwoGoogle = document.createElement("BUTTON");
        btnTwoGoogle.innerHTML = "Google";
        btnTwoGoogle.type = "button";
        btnTwoGoogle.style.position = "relative";
        btnTwoGoogle.style.left = (btnTwoAmazon.style.width + 26) + "px";
        btnTwoGoogle.onclick = function() { googleSearch(SEARCHTWO); }
        
        var btnNameGoogle = document.createElement("BUTTON");
        btnNameGoogle.innerHTML = "Google";
        btnNameGoogle.type = "button";
        btnNameGoogle.onclick = function() { googleSearch(NAME); }
        
        var btnBrandGoogle = document.createElement("BUTTON");
        btnBrandGoogle.innerHTML = "Google";
        btnBrandGoogle.type = "button";
        btnBrandGoogle.onclick = function() { googleSearch(BRAND); }
        
        var btnModelGoogle = document.createElement("BUTTON");
        btnModelGoogle.innerHTML = "Google";
        btnModelGoogle.type = "button";
        btnModelGoogle.onclick = function() { googleSearch(MODEL); }

        var btnNameGap = document.createElement("BUTTON");
        btnNameGap.innerHTML = "Gap";
        btnNameGap.type = "button";
        btnNameGap.onclick = function() { gapSearch(NAME); }
        
        var btnNameIKEA = document.createElement("BUTTON");
        btnNameIKEA.innerHTML = "IKEA";
        btnNameIKEA.type = "button";
        btnNameIKEA.onclick = function() { ikeaSearch(NAME); }
        
        var btnModelIKEA = document.createElement("BUTTON");
        btnModelIKEA.innerHTML = "IKEA";
        btnModelIKEA.type = "button";
        btnModelIKEA.onclick = function() { ikeaSearch(MODEL); }
        
        var btnNameHomeDepot = document.createElement("BUTTON");
        btnNameHomeDepot.innerHTML = "Home Depot";
        btnNameHomeDepot.type = "button";
        btnNameHomeDepot.onclick = function() { homeDepotSearch(NAME); }
        
        var btnModelHomeDepot = document.createElement("BUTTON");
        btnModelHomeDepot.innerHTML = "Home Depot";
        btnModelHomeDepot.type = "button";
        btnModelHomeDepot.onclick = function() { homeDepotSearch(MODEL); }
        
        TABLE.rows[NAMEROW].cells[2].appendChild(btnNameAmazon);
        TABLE.rows[NAMEROW].cells[2].appendChild(btnNameGoogle);
        TABLE.rows[NAMEROW].cells[2].appendChild(btnNameGap);
        TABLE.rows[NAMEROW].cells[2].appendChild(btnNameIKEA);
        TABLE.rows[NAMEROW].cells[2].appendChild(btnNameHomeDepot);
        
            
        
        if (BRANDROW > 0) {
            TABLE.rows[BRANDROW].cells[2].appendChild(btnBrandAmazon);
            TABLE.rows[BRANDROW].cells[2].appendChild(btnBrandGoogle);
            TABLE.rows[BRANDROW].cells[2].appendChild(btnBrandLiquor);
        }
        
        if (MODELROW > 0) {            
            TABLE.rows[MODELROW].cells[2].appendChild(btnModelAmazon);
            TABLE.rows[MODELROW].cells[2].appendChild(btnModelGoogle);
            TABLE.rows[MODELROW].cells[2].appendChild(btnModelIKEA);
            TABLE.rows[MODELROW].cells[2].appendChild(btnModelHomeDepot);
        }
        
        td.appendChild(btnTwoAmazon);
        td.appendChild(btnTwoGoogle);
        td2.appendChild(btnAmazon);
        td2.appendChild(btnGoogle);
        
        $( "input[name='price']" ).keydown(function(e) {
            if (e.keyCode == 111) {
                original = $( "input[name='price']" ).val();
                $( "input[name='price']" ).val("");
                mathType = "divide";
            }
            if (e.keyCode == 106) {
                original = $( "input[name='price']" ).val();
                $( "input[name='price']" ).val("");
                mathType = "multiply";
            }
            if (e.keyCode == 107) {
                var divideBy = $( "input[name='price']" ).val();
                if (mathType === "divide")
                    var result = original / divideBy;
                if (mathType === "multiply")
                    var result = original * divideBy;
                $( "input[name='price']" ).val(result.toFixed(2));
            }
        });
        
        var timer = setInterval(function(){ listenFor(); }, 250);        
        window.onbeforeunload = function (e) {
            popupW.close();
            GM_deleteValue("str11223344");
        }
        
        elems = document.getElementsByTagName('input');
        elems[12].addEventListener("click", function(){
            popupW.close();
        });
        
        function listenFor() {
            if (GM_getValue("Msg")) {
                var data = GM_getValue("Msg");
                $( "input[name='price']" ).val(data[0]);
                var num = data[0] * multip;
                document.getElementById('pricehelper').textContent = num.toFixed(2);
                $( "input[name='link']" ).val(data[1]);                
                GM_deleteValue("Msg");
                $( "input[name='price']" ).click();
            }
        }

        function amazonSearch(query) {
            query = query.replace(/[" "]/g, "+").replace(/&/g, "and");
            var amazon_URL = "http://www.amazon" + COUNTRY + "/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + query;
            popupW = window.open(amazon_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
        }
        
        function gapSearch(query) {
            if (COUNTRY == ".com")
                var gap_URL = "http://www.gap.com/browse/search.do?searchText=" + query;
            else if (COUNTRY == ".ca")
                var gap_URL = "http://www.gapcanada.ca/browse/search.do?searchText=" + query;            
            gap_URL = gap_URL.replace(/[" "]/g, "+").replace("&", "and");
            popupW = window.open(gap_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
        }

        function ikeaSearch(query) {
            if (COUNTRY == ".com")
                var ikea_URL = "http://www.ikea.com/us/en/search/?query=" + query;
            else if (COUNTRY == ".ca")
                var ikea_URL = "http://www.ikea.com/ca/en/search/?query=" + query;
            ikea_URL = ikea_URL.replace(/[" "]/g, "+").replace("&", "and");
            popupW = window.open(ikea_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
        }
        
        function homeDepotSearch(query) {
            if (COUNTRY == ".com")
                var home_URL = "http://www.qualityliquorstore.com/search.php?search_query=" + query;
            else if (COUNTRY == ".ca")
                var home_URL = "http://www.lcbo.com/lcbo/search?searchTerm=" + query;          
            home_URL = home_URL.replace(/[" "]/g, "+").replace("&", "and");
            popupW = window.open(home_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
        }
        
        function googleSearch(query) {
            var google_URL = "http://www.google.com/search?q=" + query;
            google_URL = google_URL.replace(/[" "]/g, "+").replace("&", "and");
            if (COUNTRY !== ".com")
                google_URL = google_URL + " " + COUNTRY; 
            popupW = window.open(google_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
        }
        
    }
    
    if (document.URL.indexOf("www.amazon") >= 0) {
        if (GM_getValue("str11223344")) {
            document.body.style.backgroundColor = "#E4E4E4";
            var mDingSound = new Audio(CLICKSOUND);
        	mDingSound.play();
            
            var price;
            $('body').on('click', 'a', function(e) {
                if (this.textContent.indexOf('$') >= 0) {
                    console.log(this.textContent);
                    e.preventDefault();
                    if (this.nextSibling) {
                        if (this.nextSibling.nextSibling.textContent.indexOf('$') >= 0 && this.nextSibling.nextSibling.textContent.indexOf('(') < 0) {
                            if (this.nextSibling.nextSibling.textContent.indexOf('+') >= 0)
                                price = this.textContent; 
                            else
                                price = this.nextSibling.nextSibling.textContent;
                        } else if (this.nextSibling.nextSibling.nextSibling) {
                            if (this.nextSibling.nextSibling.nextSibling.nextSibling.textContent.indexOf('$') >= 0)
                                price = this.nextSibling.nextSibling.nextSibling.nextSibling.textContent;
                        } else if (this.textContent.indexOf('-') >= 0) 
                            price = this.textContent.split('-')[1].trim();
                        else 
                            price = this.textContent;
                        if (this.previousSibling) {
                            if (this.previousSibling.previousSibling.textContent.indexOf('$') >= 0)
                                price = this.previousSibling.previousSibling.textContent;
                        }
                    } else {
                        if (this.textContent.indexOf('new') >= 0) 
                            price = this.textContent.split('new')[0];
                        else if (this.textContent.indexOf('used') >= 0) 
                            price = this.textContent.split('used')[0];
                        else if (this.textContent.indexOf('-') >= 0)
                            price = this.textContent.split('-')[1].trim();
                        else 
                            price = this.textContent;
                    }
                    
                    price = price.replace("CDN", "").replace("$", "").replace("to buy", "").replace('Subscribe & Save', '').replace(',', '').replace('used', '').replace('new', '').replace('&', '').trim();
                    
                    if (price.indexOf('(CDN$') >= 0)
                        price = price.split('(CDN$')[0];
                    
                    if (price.indexOf('(') >= 0)
                        price = price.split('(')[0];
                    
                    GM_setValue("Msg", [price, this.href]);
                    setTimeout(function(){ GM_deleteValue("Msg"); }, 1000);
                }
            });
        }
    }
});
