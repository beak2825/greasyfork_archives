// ==UserScript==
// @name           Virtonomica: расчет производства
// @namespace      yatul
// @description    Цена за единицу качества + влияние на качество конечного продукта 
// @include        http://virtonomic*.*/*/main/unit/view/*/manufacture
// @version        0.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/8990/Virtonomica%3A%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/8990/Virtonomica%3A%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==


var run = function() {

    var requiredCountIndex = 3;
	var priceIndex = 8;
	var qualityIndex = 7;
    
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    
    var totalPrice = 0;
    var totalRequired = 0;
    var medianQulityTotal = 0;
 
    $("form[name='materialRequiredStorageData'] td").closest("tr").each(function() {
      
        var cels = $('td', this);
        var price = parseFloat($(cels[priceIndex]).text().replace(/[ \$]/g, ''));
        var qual = parseFloat($(cels[qualityIndex]).text().replace(/ /g, ''));
        var requiredCount = parseFloat($(cels[requiredCountIndex]).text().replace(/ /g, ''));

        if (isNaN(price) || isNaN(qual)) { return; }

        var qp = (price / qual).toFixed(2);
        
        totalRequired += requiredCount;
        medianQulityTotal += qual * requiredCount;
        
        var productPrice = requiredCount*price;
        totalPrice += productPrice;
        $(cels[requiredCountIndex]).html(requiredCount + '<br/><span style="color: #aaa" >(' + (productPrice).toFixed(2) + '$)</span> ');
         
    });
    
   
    
    $("form[name='materialRequiredStorageData'] td").closest("tr").each(function() {
      
        var cels = $('td', this);
        var price = parseFloat($(cels[priceIndex]).text().replace(/[ $]/g, ''));
        var qual = parseFloat($(cels[qualityIndex]).text().replace(/ /g, ''));
        var requiredCount = parseFloat($(cels[requiredCountIndex]).text().replace(/ /g, ''));

        if (isNaN(price) || isNaN(qual)) { return; }

        var qp = (price / qual).toFixed(2);
        
        var productPrice = requiredCount*price;
        
        $(cels[priceIndex]).html(price + '<br /><span style="color: #aaa">' + Math.round(productPrice/totalPrice*100) + '%</span> ');
        $(cels[qualityIndex]).html(qual + '<br /><span style="color: #aaa">' + Math.round(qual*requiredCount/medianQulityTotal*100) + '%</span> ');
         
    });
    
    
 

}

// Хак, что бы получить полноценный доступ к DOM
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
