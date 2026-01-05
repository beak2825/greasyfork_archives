// ==UserScript==
// @name           Eiphorius:calc_equip
// @namespace      virtonomica
// @description    Расчет необходимого оборудования 
// @version        1.1
// @grant          none
// @include        http://*virtonomic*.*/*/window/unit/equipment/*
// @downloadURL https://update.greasyfork.org/scripts/8395/Eiphorius%3Acalc_equip.user.js
// @updateURL https://update.greasyfork.org/scripts/8395/Eiphorius%3Acalc_equip.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
	
	if ($('img[src*="/img/unit_types/animalfarm.gif"]').length) return;
	if ($('img[src*="/img/unit_types/office.gif"]').length) return;
	var currQ = $("#top_right_quality").text();
	var needQ = $("#top_right_quality").next().next().text();
	var currQty = $("#quantity_corner").text().replace(' ','');
	$("#quantity_corner").html($("#quantity_corner").html()+' <input id = "needQty" type="text" size="5" value="1000">');
	var needQty = $("#needQty").val();
	var Q1 = '0.0';
	var Q2 = '0.0';
	var Qty1 = '0';
	var Qty2 = '0';
	var qStr = 'Q1: <strong>'+Q1+'</strong>, Q2: <strong>'+Q2+'</strong>';
	var qtyStr = 'Qty1: <strong>'+Qty1+'</strong>, Qty2: <strong>'+Qty2+'</strong>';
	var qHtml = ' <span id="qSpan">'+qStr+'</span> | <span id="qtySpan">'+qtyStr+'</span>';
	var qual = '';


	$('.recommended_quality').append(qHtml);

	$('td.choose').prev().click(function(e){
		qual = $(this).text();
		//var price = $(this).prev().text();
		if (!e.ctrlKey && !e.altKey) return;
		if (e.ctrlKey) {Q1 = qual};
		if (e.altKey) {Q2 = qual};

		qStr = 'Q1: <strong>'+Q1+'</strong>, Q2: <strong>'+Q2+'</strong>';
		//qHtml = '<span id="qSpan">'+qStr+'</span>';
		$('#qSpan').html(qStr);
		Calculate();
		qtyStr = 'Qty1: <strong>'+Qty1+'</strong>, Qty2: <strong>'+Qty2+'</strong>';
		//qtyHtml ='<span id="qtySpan">'+qtyStr+'</span>';
		$('#qtySpan').html(qtyStr);
	});

	$('#qSpan').click(function(e){
		Q1 = 0.0;
		Q2 = 0.0;
		qStr = 'Q1: <bold>'+Q1+'</bold>, Q2: '+Q2;
		$('#qSpan').html(qStr);
		Calculate();
		qtyStr = 'Qty1: '+Qty1+', Qty2: '+Qty2;
		$('#qtySpan').html(qtyStr);
	});
	$('#needQty').change(function(){
		needQty = parseFloat($("#needQty").val());
	});

	
	function Calculate(){
		var fQty1 = 0.0;
		var fQty2 = 0.0;
		console.dir(parseFloat(currQty));
		console.dir(needQty);
		fQty1 = (needQty * (parseFloat(needQ) - parseFloat(Q2)) - parseFloat(currQty) * (parseFloat(currQ) - parseFloat(Q2)))/(parseFloat(Q1) - parseFloat(Q2));
		fQty2 = needQty - parseFloat(currQty) - fQty1;
		fQty1 = fQty1.toFixed(2);
		fQty2 = fQty2.toFixed(2);
		Qty1 = fQty1.toString();
		Qty2 = fQty2.toString();
	} 
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 
