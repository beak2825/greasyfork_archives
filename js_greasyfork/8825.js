// ==UserScript==
// @name           Virtonomica: Trading_hall_sell_price_advice
// @description    Показывает цены для качества вашего товара на основе средних цен и качества по городу
// @version        1.2
// @include       http://*virtonomic*.*/*/main/unit/view/*/trading_hall
// @namespace virtonomica
// @downloadURL https://update.greasyfork.org/scripts/8825/Virtonomica%3A%20Trading_hall_sell_price_advice.user.js
// @updateURL https://update.greasyfork.org/scripts/8825/Virtonomica%3A%20Trading_hall_sell_price_advice.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

    function roundWithTwoDec(num){
        return Math.round(num * 100) / 100
    }
		//alert( "before");
    ////*[@id="mainContent"]/form/table[1]/tbody/tr[4]/td[12]
	var form = document.getElementsByTagName('form')
	//	alert( form.length);
	var table = form[1].getElementsByTagName('table')
	//	alert( table.length);
    var tbody = table[0].getElementsByTagName('tbody')
	//	alert( tbody.length);
    var trList = tbody[0].getElementsByTagName('tr');
	//	alert( trList.length);
    for (i = 0; i < trList.length; i += 1) {
        if (trList[i].className == 'odd' || trList[i].className == 'even') {
            var tdList = trList[i].getElementsByTagName('td');
            var avg_price = tdList[11].innerHTML.replace('$', '').replace(' ', '')
            var avg_quality = tdList[12].innerHTML.replace(' ', '')
            var quality = tdList[6].innerHTML.replace(' ', '')
            var new_price = roundWithTwoDec (quality * avg_price / avg_quality) ;
            tdList[9].innerHTML = '<font color="red" size="6">' + new_price + '</font></br>' + tdList[9].innerHTML
           // break;
        }
    }
	//	alert( "after");
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);