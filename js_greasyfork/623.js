// ==UserScript==
// @name        CBHelper
// @namespace   http://www.crazybeat.co.uk
// @description  Adds various fixes and tweaks to CB admin module
// @include     https://www.crazybeat.co.uk/index.php/admin*/catalog_product/edit/id/*
// @include     https://www.crazybeat.co.uk/index.php/admin*/catalog_product/new/*
// @include     https://www.crazybeat.co.uk/index.php/quickgrid/*
// @version     5.3
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://greasyfork.org/scripts/622-super-gm-setvalue-and-gm-getvalue-js/code/Super_GM_setValue_and_GM_getValuejs.js?version=1786
// @downloadURL https://update.greasyfork.org/scripts/623/CBHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/623/CBHelper.meta.js
// ==/UserScript==

var code = GM_SuperValue.get("code");
var sleeveCon = GM_SuperValue.get("sleeveCon");
var recordCon = GM_SuperValue.get("recordCon");
var inStock = GM_SuperValue.get("inStock");
var hasSound = GM_SuperValue.get("hasSound");
var genreCat = GM_SuperValue.get("genreCat");
var formatCat = GM_SuperValue.get("formatCat");
var countryValue = GM_SuperValue.get("countryValue");

var codeChk = GM_SuperValue.get("codeChk");
var sleeveConChk = GM_SuperValue.get("sleeveConChk");
var recordConChk = GM_SuperValue.get("recordConChk");
var priceChk = GM_SuperValue.get("priceChk");
var inStockChk = GM_SuperValue.get("inStockChk");
var hasSoundChk = GM_SuperValue.get("hasSoundChk");
var genreChk = GM_SuperValue.get("genreChk");
var formatChk = GM_SuperValue.get("formatChk");
var countryChk = GM_SuperValue.get("countryChk");

var url = window.location;

function filter()
{
    productGridJsObject.resetFilter();
    inOutStock();
}

function todayDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10) { dd='0'+dd } 
    if(mm<10) { mm='0'+mm }

    document.getElementById('news_from_date').value = dd + '/' + mm + '/' + yyyy;
}

function todayDateMinusYear()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear()-1;
    if(dd<10) { dd='0'+dd } 
    if(mm<10) { mm='0'+mm }

    document.getElementById('news_from_date').value = dd + '/' + mm + '/' + yyyy;
}

function todayDate2()
{
    //alert("function ran");
    if(document.getElementById('crazy_beat_in_stock').value == "0") {
        todayDateMinusYear();
        //alert("out of stock");
    }
    else {
        todayDate();
        //alert("in stock");
    }
}

function inOutStock()
{
    var url = window.location;

    if(url.href.indexOf("/index.php/quickgrid/") > -1)
    {
        rows = document.getElementById('productGrid_table').getElementsByTagName('TR');

        for (var a = 0; a < rows.length; a++)
        {
            col = rows[a].getElementsByTagName('TD');

            for (var d = 0; d < col.length;d++)
            {
                if (col[d].className == " a-right ")
                {
                    var c = d + 1;

                    var contents = col[c].innerHTML;  

                    if (contents.indexOf("Yes") > -1)                
                        col[c].style.background = '#d1f5ce';                   
                    else
                        col[c].style.background = '#f5d0d1';               
                }
            }
        } 
    }
}

if(url.href.indexOf("/index.php/quickgrid/") > -1)
{
    inOutStock();
    document.getElementById('productGrid_quickgrid_filter_name').focus();
    document.getElementById('productGrid_quickgrid_filter_name').setSelectionRange(0, document.getElementById('productGrid_quickgrid_filter_name').value.length);
    
    /*var as = document.getElementById('productGrid_table');
    var trs = as.getElementsByTagName("tr"); 

    for(var i = 0; i < trs.length; i++)
    {        
        var tds = as.getElementsByTagName("td"); 

        for(var i = 0; i < tds.length; i++)
        { 
            if (i == 7) {
                tds[i].style.fontWeight='bold';
                tds[i].style.textAlign='center';
            }           
        }
    }*/
    
    /*var d2 = document.getElementsByClassName("scalable");
    alert(d2[1].value);
    for (var asd = 0; asd < d2.length; asd++) {  
        var bb = d2[asd].value;  

        if(bb.indexOf("Reset") > -1) {
           d2[asd].onclick = function() {
                filter();
           }
        }           
    } */  
}
else
{
 
    var price = document.getElementById("price").value;
    var price2 = parseFloat(price).toFixed(2);
    
    function hasClass(element, cls) {
       return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
    
    function applyPrice(p)
    {
        price2 = p;
        document.getElementById("price").style.backgroundColor = "green";
    }

    function saveSettings()
    {
        var tempCode = document.getElementById("inCatNum").value;
        var tempSleeve = document.getElementById("sleeveConS").value;
        var tempRecord = document.getElementById("recordConS").value;
        var tempStock = document.getElementById("inStockS").value;
        var tempSound = document.getElementById("hasSoundS").value;
        var tempGenre = document.getElementById("genreCatS").value;
		var tempFormat = document.getElementById("formatS").value;
        var tempCountry = document.getElementById("countryS").value;
        
        var chkCode = document.getElementById("internalCat").checked;
        var chkSleeve = document.getElementById("sleeveCon").checked;
        var chkRecord = document.getElementById("recordCon").checked;
        var chkPrice = document.getElementById("adjPrice").checked;
        var chkStock = document.getElementById("inStock").checked;
        var chkSound = document.getElementById("hasSound").checked;
        var chkGenre = document.getElementById("genreCat").checked;
        var chkFormat = document.getElementById("formatCat").checked;
		var chkCountry = document.getElementById("countryChk").checked;
        
        GM_SuperValue.set("code", tempCode);
        GM_SuperValue.set("sleeveCon", tempSleeve);
        GM_SuperValue.set("recordCon", tempRecord);
        GM_SuperValue.set("inStock", tempStock);
        GM_SuperValue.set("hasSound", tempSound);
        GM_SuperValue.set("genreCat", tempGenre);
		GM_SuperValue.set("formatCat", tempFormat);
        GM_SuperValue.set("countryValue", tempCountry);
        
        GM_SuperValue.set("codeChk", chkCode);
        GM_SuperValue.set("sleeveConChk", chkSleeve);
        GM_SuperValue.set("recordConChk", chkRecord);
        GM_SuperValue.set("priceChk", chkPrice);
        GM_SuperValue.set("inStockChk", chkStock);
        GM_SuperValue.set("hasSoundChk", chkSound);
        GM_SuperValue.set("genreChk", chkGenre);
		GM_SuperValue.set("formatChk", chkFormat);
        GM_SuperValue.set("countryChk", chkCountry);
        
        //alert(code);
        alert("Saved!");
        //alert(chkFormat);
        //alert(tempFormat);
        //alert(GM_SuperValue.get("formatChk"));
        //alert(GM_SuperValue.get("formatCat"));
        
    }

    function runStartOnce()
    {
        document.getElementById("inCatNum").value = code;
        document.getElementById("sleeveConS").value = sleeveCon;
        document.getElementById("recordConS").value = recordCon;
        document.getElementById("inStockS").value = inStock;
        document.getElementById("hasSoundS").value = hasSound;
        document.getElementById("genreCatS").value = genreCat;
		document.getElementById("formatS").value = formatCat;
        document.getElementById("countryS").value = countryValue;
        
        document.getElementById("internalCat").checked = codeChk;
        document.getElementById("sleeveCon").checked = sleeveConChk;
        document.getElementById("recordCon").checked = recordConChk;
        document.getElementById("adjPrice").checked = priceChk;
        document.getElementById("inStock").checked = inStockChk;
        document.getElementById("hasSound").checked = hasSoundChk;
        document.getElementById("genreCat").checked = genreChk;
        document.getElementById("formatCat").checked = formatChk;
        document.getElementById("countryChk").checked = countryChk;
    }
  
    function KeyCheck(e)
    {
        
        if(e.keyCode == 13)
        {
            //alert("1");
            var el = document.getElementById('CBoxC');
            if(hasClass(el, 'hide')) {
                //alert("2");
                var buttons = document.getElementsByClassName('scalable save');
                buttons[0].click();
            }
            
        }

        if(e.keyCode == 36)
        {
            
            if(document.getElementById("internalCat").checked)
            {
                if(document.getElementById('internal_catalogue_number').value != code)
                {
                   document.getElementById('internal_catalogue_number').value = code;
                   document.getElementById('internal_catalogue_number').style.backgroundColor = "green";
                }
            }
            if(document.getElementById("sleeveCon").checked)
            {
                if(document.getElementById('sleeve_condition').value != sleeveCon)
                {
                   document.getElementById('sleeve_condition').value = sleeveCon;
                   document.getElementById("sleeve_condition").style.backgroundColor = "green";             
                }
            }
            if(document.getElementById("recordCon").checked) 
            { 
                if(document.getElementById('condition').value != recordCon)
                {
                   document.getElementById('condition').value = recordCon;
                   document.getElementById("condition").style.backgroundColor = "green";
                }
            }
            if(document.getElementById("genreCat").checked) 
            { 
                if(document.getElementById('genre').value != genreCat)
                {
                   document.getElementById('genre').value = genreCat;
                   document.getElementById("genre").style.backgroundColor = "green";
                }
            }
            if(document.getElementById("formatCat").checked) 
            { 
                if(document.getElementById('format').value != formatCat)
                {
                   document.getElementById('format').value = formatCat;
                   document.getElementById("format").style.backgroundColor = "green";
                }
            }
            if(document.getElementById("countryChk").checked) 
            { 
                if(document.getElementById('country').value != countryValue)
                {
                   document.getElementById('country').value = countryValue;
                   document.getElementById("country").style.backgroundColor = "green";
                }
            }
            if(document.getElementById("adjPrice").checked)
            {
               switch (price2)
                {
                   case "30.00":
                        applyPrice(25.00);
                        break;
                        
                   case "20.00":
                        applyPrice(15.00);
                        break;

                   case "15.00":
                        applyPrice(12.00);
                        break;

                   case "12.00":
                        applyPrice(10.00);
                        break;     
       
                   case "10.00":
                        applyPrice(8.00);
                        break;
                        
                   case "9.00":
                        applyPrice(6.00);
                        break;
                        
                   case "8.00":
                        applyPrice(6.00);
                        break;

                   case "7.00":
                        applyPrice(5.00);
                        break;

                   case "6.00":
                        applyPrice(4.00);
                        break;

                   case "5.00":
                        applyPrice(3.00);
                        break;

                   case "4.00":
                        applyPrice(3.00);
                        break;

                   case "3.00":
                        applyPrice(2.50);
                        break;

                   default:        
                        document.getElementById("price").style.backgroundColor = "red";           
                        break;                  
                }

                document.getElementById("price").value = price2;
            }
            if(document.getElementById("inStock").checked)
            {
                if(document.getElementById('crazy_beat_in_stock').value != inStock)
                {
                   if(document.getElementById('crazy_beat_in_stock').value == "0")
                      todayDate();
                    
                   document.getElementById('crazy_beat_in_stock').value = inStock;
                   document.getElementById("crazy_beat_in_stock").style.backgroundColor = "green";                                  
                }
            } 
            if(document.getElementById("hasSound").checked)
            {
                if(document.getElementById('sound_link').value != hasSound)
                {
                   document.getElementById('sound_link').value = hasSound;
                   document.getElementById("sound_link").style.backgroundColor = "green";
                }
            } 
            /*if(document.getElementById("fillCategory").checked)
            {
                document.getElementById("product_info_tabs_categories").click();
                waitForCond();            
            }*/
        }
    }

    /*function waitForCond()
    {  
        alert("as");
        
        var container = document.getElementById("ext-gen7");
        
        if (container != null)
        {   
            alert("asd");
            
            if(document.getElementById("fillCatAll").checked) {
                document.getElementById("ext-gen24").checked = true;
            } 
            
            if(document.getElementById("fillCatMail").checked) {
                document.getElementById("ext-gen48").checked = true;
            }

            if(document.getElementById("fillCatNew").checked) {
                document.getElementById("ext-gen56").checked = true;
                alert("new");
            }

            if(document.getElementById("fillCatRare").checked) {
                document.getElementById("ext-gen64").checked = true;
            }

            if(document.getElementById("fillCatEbay").checked) {
                document.getElementById("ext-gen72").checked = true;    
            }
        }
        else
        {    
           setTimeout(waitForCond,10);  
           alert("1");
        }
    }*/

    var style = document.createElement('style');
      style.setAttribute('type', "text/css");
      style.appendChild(document.createTextNode("#CBoxC {\
        text-align: center;\
        vertical-align: middle;\
    }"));

    var style2 = document.createElement('style');
      style2.setAttribute('type', "text/css");
      style2.appendChild(document.createTextNode(".hide {\
       position: absolute !important;\
       top: -9999px !important;\
       left: -9999px !important;\
    }"));    
    
    function addActive()
    {
        document.getElementById('CBoxC').className = document.getElementById('CBoxC').className.replace("hide","");
        var element = document.getElementsByClassName('tab-item-link');
        for(var i=0;i<element.length;i++) 
        {
           var myClassName=" active";

           element[i].className=element[i].className.replace(myClassName,"");
        }

        var d2;

        d2 = document.getElementsByClassName("entry-edit");

        for (var asd = 0; asd < d2.length; asd++) {     
            if(d2[asd].id != "cbheader")
               d2[asd].className = d2[asd].className + ' hide';
        }


        var id='cbhelpertab';
        var myClassName=" active";
        var d;
        d=document.getElementById(id);
        d.className = d.className.replace(myClassName,"");
        d.className = d.className + myClassName;
    }

    function unActive()
    {
        document.getElementById('CBoxC').className = 'hide';
        var id='cbhelpertab';
        var myClassName=" active";
        var d;
        d=document.getElementById(id);
        d.className=d.className.replace(myClassName,"");

        var d2;

        d2 = document.getElementsByClassName("entry-edit");
        for (var asd = 0; asd < d2.length; asd++) {     
            d2[asd].className = d2[asd].className.replace(" hide","");
        }    
    }  
    
    /*function FillCatCheck()
    {
        if(document.getElementById("fillCategory").checked)
        {
             document.getElementById('fillCatAll').disabled = false;
             document.getElementById('fillCatMail').disabled = false;
             document.getElementById('fillCatRare').disabled = false;
             document.getElementById('fillCatNew').disabled = false;
             document.getElementById('fillCatEbay').disabled = false;            
        }
        else
        {
             document.getElementById('fillCatAll').disabled = true;
             document.getElementById('fillCatMail').disabled = true;
             document.getElementById('fillCatRare').disabled = true;
             document.getElementById('fillCatNew').disabled = true;
             document.getElementById('fillCatEbay').disabled = true; 
        }
    }*/

    try {
        if (head = document.getElementsByTagName('head')[0]) {
          head.appendChild(style);
        } 
    } catch(e) {}

    try {
        if (head = document.getElementsByTagName('head')[0]) {
          head.appendChild(style2);
        } 
    } catch(e) {}

    var strVar="<div id=\"cbheader\" class=\"entry-edit\">"; 
    strVar += "    <div class=\"entry-edit-head\"><h4 class=\"icon-head head-edit-form fieldset-legend\">Crazy Beat Helper</h4><\/div>";
    strVar += "    <div class=\"fieldset fieldset-wide\">";
    strVar += "            <p>";
    strVar += "                When one or more options are selected, press the <strong>HOME</strong> key to fill the fields.";
    strVar += "            <\/p>";
    strVar += "            <br /><p><strong>Product Options</strong></p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"internalCat\" name=\"internalCat\" value=\"internalCat\"> Fill Internal Cat <input type=\"text\" id=\"inCatNum\" maxlength=\"10\" size=\"10\">";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"recordCon\" name=\"recordCon\" value=\"recordCon\"> Fill Record Condition <select id=\"recordConS\" name=\"recordConS\">";
    strVar += "                    <option value=\"428\">S<\/option>";
    strVar += "                    <option value=\"360\">M<\/option>";
    strVar += "                    <option value=\"430\">NM<\/option>";
    strVar += "                    <option value=\"362\">EX+<\/option>";
    strVar += "                    <option value=\"432\">EX<\/option>";
    strVar += "                    <option value=\"434\">VG+<\/option>";
    strVar += "                    <option value=\"433\">VG<\/option>";
    strVar += "                    <\/select>";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"sleeveCon\" name=\"sleeveCon\" value=\"sleeveCon\"> Fill Sleeve Condition <select id=\"sleeveConS\" name=\"sleeveConS\">";
    strVar += "                    <option value=\"420\">Generic<\/option>";
    strVar += "                    <option value=\"431\">S<\/option>";
    strVar += "                    <option value=\"423\">M<\/option>";
    strVar += "                    <option value=\"418\">NM<\/option>";
    strVar += "                    <option value=\"419\">EX+<\/option>";
    strVar += "                    <option value=\"421\">EX<\/option>";
    strVar += "                    <option value=\"436\">VG+<\/option>";
    strVar += "                    <option value=\"435\">VG<\/option>";
    strVar += "                    <\/select>               ";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"genreCat\" name=\"genreCat\" value=\"genreCat\"> Fill Genre <select id=\"genreCatS\" name=\"genreCatS\">";
    strVar += "                    <option value=\"394\">60s Soul, Northern Soul and R&amp;B</option>";
    strVar += "                    <option value=\"402\">CD Singles</option>";
    strVar += "                    <option value=\"392\">Classic Soul &amp; Funk</option>";
    strVar += "                    <option value=\"390\">Disco &amp; Boogie</option>";
    strVar += "                    <option value=\"396\">Funk &amp; Rare Groove</option>";
    strVar += "                    <option value=\"388\">House &amp; Garage</option>";
    strVar += "                    <option value=\"398\">Jazz &amp; Fusion</option>";
    strVar += "                    <option value=\"397\">Modern &amp; Crossover Soul</option>";
    strVar += "                    <option value=\"399\">Modern Soul Re-Issues &amp; New Releases</option>";
    strVar += "                    <option value=\"425\">Pop &amp; Rock</option>";
    strVar += "                    <option value=\"426\">Pop, Beat &amp; 60's</option>";
    strVar += "                    <option value=\"427\">Psych &amp; Rock</option>";
    strVar += "                    <option value=\"393\">Rap &amp; Hip Hop</option>";
    strVar += "                    <option value=\"389\">Reggae &amp; Ska</option>";
    strVar += "                    <option value=\"395\">RnB &amp; Swing</option>";
    strVar += "                    <option value=\"391\">Soul &amp; Funk</option>";
    strVar += "                    <option value=\"400\">Soul &amp; Jazz Compilation</option>";
    strVar += "                    <\/select>               ";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "             <input type=\"checkbox\" id=\"formatCat\" name=\"formatCat\" value=\"formatCat\"> Fill Format <select id=\"formatS\" name=\"formatS\">";
    strVar += "					<option value=\"370\">7\"</option>";
    strVar += "					<option value=\"367\">10\"</option>";
    strVar += "					<option value=\"365\">12\"</option>";
    strVar += "					<option value=\"368\">12\" Dbl</option>";
    strVar += "					<option value=\"372\">12\" Tpl</option>";
    strVar += "					<option value=\"369\">LP</option>";
    strVar += "					<option value=\"366\">LP Dbl</option>";
    strVar += "					<option value=\"373\">LP Tpl</option>";
    strVar += "					<option value=\"371\">CD</option>";
    strVar += "					<option value=\"375\">CD Dbl</option>";
    strVar += "					<option value=\"374\">CDS</option>";
	strVar += "             </select>";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "             <input type=\"checkbox\" id=\"countryChk\" name=\"countryChk\" value=\"countryChk\"> Fill Country <select id=\"countryS\" name=\"countryS\">";
    strVar += "					<option value=\"379\">Europe</option>";
    strVar += "					<option value=\"380\">Jamaica</option>";
    strVar += "					<option value=\"384\">Japan</option>";
    strVar += "					<option value=\"376\">UK</option>";
    strVar += "					<option value=\"378\">USA</option>";
	strVar += "             </select>";
    strVar += "            <\/p>";    
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"adjPrice\" name=\"adjPrice\" value=\"adjPrice\"> Adjust Price (Decrease)";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"inStock\" name=\"inStock\" value=\"inStock\"> Fill In-Stock <select id=\"inStockS\" name=\"inStockS\">";
    strVar += "                    <option value=\"1\">Yes<\/option>";
    strVar += "                    <option value=\"0\">No<\/option>";
    strVar += "                    <\/select>";
    strVar += "            <\/p>";
    strVar += "            <p>";
    strVar += "                <input type=\"checkbox\" id=\"hasSound\" name=\"hasSound\" value=\"hasSound\"> Fill Sound-Clip <select id=\"hasSoundS\" name=\"hasSoundS\">";
    strVar += "                    <option value=\"1\">Yes<\/option>";
    strVar += "                    <option value=\"0\">No<\/option>";
    strVar += "                    <\/select>";
    strVar += "            <\/p>";
/*    strVar += "            <br /><p><strong>Categories</strong></p>";
    strVar += "            <p><input type=\"checkbox\" id=\"fillCategory\" name=\"fillCategory\" value=\"fillCategory\"> Fill Product Categories (work in progress)</p>";    
    strVar += "            <p><ul>";
    strVar += "               <li><input type=\"checkbox\" id=\"fillCatAll\" name=\"fillCatAll\" value=\"fillCatAll\"> All Products</li>";
    strVar += "               <li><input type=\"checkbox\" id=\"fillCatMail\" name=\"fillCatMail\" value=\"fillCatMail\"> Appear on Mailout</li>";
    strVar += "               <li><input type=\"checkbox\" id=\"fillCatNew\" name=\"fillCatNew\" value=\"fillCatNew\"> New Releases</li>";
    strVar += "               <li><input type=\"checkbox\" id=\"fillCatRare\" name=\"fillCatRare\" value=\"fillCatRare\"> Rare & Deleted</li>"; 
    strVar += "               <li><input type=\"checkbox\" id=\"fillCatEbay\" name=\"fillCatEbay\" value=\"fillCatEbay\"> eBay</li>";
    strVar += "            </ul></p>";
    strVar += "            <br />";*/
    strVar += "            <p>";
    strVar += "                <button id=\"saveCat\" type=\"button\">Save Settings<\/button>";
    strVar += "            <\/p>";
    strVar += "            <span style=\"text-align:left;font-style: italic;color:#777;float:left;\">";
    strVar += "                Version 5.2";
    strVar += "            <\/span>";
    strVar += "            <span style=\"text-align:right;font-style: italic;color:#777;float:right;\">";
    strVar += "                Alex Howes &#169; 2014";
    strVar += "            <\/span><br style=\"clear:both;\">";
    strVar += "    <\/div><\/div>";

    var strVar2="";
    strVar2 += "        <a class=\"tab-item-link\" id=\"cbhelpertab\" title=\"CB Helper\">";
    strVar2 += "    <span>CB Helper<\/span>";
    strVar2 += "        <\/a>";
    strVar2 += "        ";


    var html = document.createElement ('div');
    html.id = 'CBoxC';
    html.className = 'hide';
    html.innerHTML = strVar;

    var elmNew = document.createElement ('li');
    elmNew.id = 'CBox';
    elmNew.innerHTML = strVar2;


    var elmFoo = document.getElementById('product_info_tabs_inventory');

    elmFoo.parentNode.insertBefore(elmNew, elmFoo.nextSibling);

    var elmFoo2 = document.getElementById('messages');

    elmFoo2.parentNode.insertBefore(html, elmFoo2.lastChild);

    elmNew.addEventListener("click", addActive, true); 

    
    //document.getElementById("fillCategory").addEventListener('click', FillCatCheck, true); 
    
    document.getElementById("product_info_tabs_group_18").addEventListener('click', unActive, true); 
    document.getElementById("product_info_tabs_categories").addEventListener('click', unActive, true); 
    document.getElementById("product_info_tabs_group_10").addEventListener('click', unActive, true); 
    document.getElementById("product_info_tabs_inventory").addEventListener('click', unActive, true); 
    document.getElementById("crazy_beat_in_stock").addEventListener('change', todayDate2, true); 
    document.getElementById("saveCat").addEventListener("click", saveSettings, false);
    window.addEventListener('keydown', KeyCheck, true);
    runStartOnce(); 
    //FillCatCheck();

    document.getElementById("visibility").value = 4;
    document.getElementById("status").value = 1;
    
    var as = document.getElementById('group_fields18');
    var trs = as.getElementsByTagName("tr"); 
    
    for(var i = 0; i < trs.length; i++)
    {
        if(i == (trs.length - 1) || i == (trs.length - 2) || i == (trs.length - 3) || i == (trs.length - 4) ) {
            trs[i].style.display='none';
        }
    }
      
    var as2 = document.getElementById('table_cataloginventory');
    var trs2 = as2.getElementsByTagName("tr"); 

    for(var i2 = 0; i2 < trs2.length; i2++)
    {
        //if(i2 != 1) {
        if (trs2[i2].outerHTML.indexOf("inventory_manage_stock") >= 0  || trs2[i2].outerHTML.indexOf("inventory_qty") >= 0) {}
        else {
            trs2[i2].style.display='none';
            trs2[i2].style.position='absolute';
            trs2[i2].style.top='-9999px';
            trs2[i2].style.left='-9999px';
        }
    }
    var nots = document.getElementsByClassName('notification-global');
    
    for(var x=0;x<nots.length;x++)
    {
        nots[x].style="display:none;";
    }    
    
    if(document.getElementById("media_gallery_content-image-1"))
    {
        document.getElementById('product_info_tabs_group_10').style.color = '#00FF00';
    }
    
    if(document.getElementById('news_from_date').value == "")
    {
        todayDate();
    } 
}