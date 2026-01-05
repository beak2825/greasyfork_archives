// ==UserScript==
// @name           Virtonomica: Unit sale
// @namespace      Virtonomics
// @description    Sets a price of 70%, 100%, 300% of the value of assets. Origin By noglues5, http://userscripts-mirror.org/scripts/show/115706
// @version        1.3
// @include        http*://*virtonomic*.*/*/window/unit/market/sale/*
// @downloadURL https://update.greasyfork.org/scripts/9714/Virtonomica%3A%20Unit%20sale.user.js
// @updateURL https://update.greasyfork.org/scripts/9714/Virtonomica%3A%20Unit%20sale.meta.js
// ==/UserScript==

var run = function() {

	function setPrice( sal) { 	
		return Math.ceil((Math.floor(sal *100) +1)/100);
	}

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

 	var prize = 0;
	$("td:contains('$')").each(function() { 
		str = this.textContent;
		str = str.replace('$','').replace(/\s+/g,'');
    	prize += parseFloat(str,10);
	});
	prize = prize/2;

  var container = $('div.headerSeparator');

  var input_70 = $('<button id=b_70>70%</button>').click(function() {
	val = 0.70* prize;
	val = setPrice(val);
        var zzz = document.getElementsByName('price');
        zzz[0].value = val;
  });

  var input_100 = $('<button id=b_100>100%</button>').click(function() {
	val = prize;
        var zzz = document.getElementsByName('price');
        zzz[0].value = val;
  });

  var input_300 = $('<button id=b_300>300%</button>').click(function() {
	val = 3*prize - 0.01;
        var zzz = document.getElementsByName('price');
        zzz[0].value = val;
  });

  container.append( $('<table><tr>').append('<td>').append(input_70).append('<td>').append(input_100).append('<td>').append(input_300) );
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);