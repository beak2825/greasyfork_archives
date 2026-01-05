// ==UserScript==
// @name           Virtonomica: Израсходовано расходников в МЦ, ресторанах и автомастерских
// @namespace      virtonomica
// @description    Помощник по закупкам в МЦ, русский реалм
// @include	   http*://*virtonomic*.*/*/main/unit/view/*/supply
// @version        1.3
// @downloadURL https://update.greasyfork.org/scripts/8304/Virtonomica%3A%20%D0%98%D0%B7%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%BE%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%9C%D0%A6%2C%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D0%B0%D1%85%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/8304/Virtonomica%3A%20%D0%98%D0%B7%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%BE%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%9C%D0%A6%2C%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D0%B0%D1%85%20%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D1%85.meta.js
// ==/UserScript==

var run = function() 
{
	
	var tcolor = "green";
	var pos=100;

    	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    	$ = win.$;
	
	
	var a1=$('div.officePlace').text().trim().slice(0,11)
	var a2="Медицинский"  /*Русский реалм т.к. сравнение на русском языке*/
	var a3="Ресторан ко"  /*Русский реалм т.к. сравнение на русском языке*/
	var a4="Авторемонтн"

	if((a1 != a2) && (a1 != a3) && (a1!=a4))return; // Выход если не МЦ и не ресторан

	var Murl=window.location.href.slice(0,-7);
 	$.get(Murl,function(data){

	pos = $('td.title:contains("Количество посетителей")',data).next().text().replace(' ', ''); //русский поиск
	pos = parseFloat(pos);
	afterLoad();
 
	})
	
	function afterLoad(){
	
	
 	$('table.list>tbody>tr>td>table>tbody tr:contains("клиента")').each(function(){   //русский поиск
	var ras = $( 'td:eq(1)', this ).prop('textContent');
	var text='<tr> <td nowrap="" style="color: '+tcolor+'">' +  'Израсходовано'+'</td>'+'<td align="right" nowrap="">'+ras*pos+' </td></tr> '

	$(text).insertBefore($(this));
 	})
	}
	

}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
