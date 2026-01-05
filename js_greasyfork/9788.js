// ==UserScript==
// @name           Virtonomica: фильтр в окне снабжения
// @namespace      virtonomica
// @version 	   2.0
// @description    Добавляет фильтр в окно снабжения
// @include        http*://*virtonomic*.*/*/window/unit/supply/multiple/vendor:*/product:*/brandname:*
// @downloadURL https://update.greasyfork.org/scripts/9788/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/9788/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	var filterByCountry = '<option value="0">&nbsp;</option>';
	var filterByRegion = '<option value="0">&nbsp;</option>';
	var filterByTown = '<option value="0">&nbsp;</option>';
	var filterByUnitType = '<option value="0">&nbsp;</option>';
	var filterByUnitName = '<option value="0">&nbsp;</option>';
	
	/////////////////
	var countries = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2) > img').each(function(){
		var img = $(this);
		var country = img.attr('title');
		countries[country] = 1;
    });
	for (key in countries) {
		filterByCountry = filterByCountry + '<option>'+key+'</option>';
	}
	/////////////////
	var regions = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2)').each(function(){
		var cell = $(this);
        var first = cell.html().indexOf('&nbsp;') + 6;
        var second = cell.html().indexOf('<br>');
        var region = cell.html().substr(first, second - first);
		regions[region] = 1;
    });
	for (key in regions) {
		if(key != ''){
			filterByRegion = filterByRegion + '<option>'+key+'</option>';
		}
	}
	/////////////////
	var towns = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2) > b').each(function(){
		var cell = $(this);
        var town = cell.text();
		towns[town] = 1;
    });
	for (key in towns) {
		if(key != ''){
			filterByTown = filterByTown + '<option>'+key+'</option>';
		}
	}
	/////////////////
	var unitNames = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(3) > a > img').each(function(){
		var img = $(this);
        var unitName = img.attr('title');
		unitNames[unitName] = 1;
    });
	for (key in unitNames) {
		if(key != ''){
			filterByUnitName = filterByUnitName + '<option>'+key+'</option>';
		}
	}
	/////////////////
	var types = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(3) > a:nth-child(2)').each(function(){
		var row = $(this);
		var type = row.text();
        var matches = row.text().match(/\(([^)]+)\)$/);
		if(matches != null && matches.length > 1){
			type = matches[1];
		} 
		types[type] = 1;
    });
	for (key in types) {
		filterByUnitType = filterByUnitType + '<option>'+key+'</option>';
	}
	/////////////////
	var svToggleForVisible = '<input id="toggleForVisible" type="checkbox">';
	var svInputQtyForActiveVisible = '<input id="qtyForActiveVisible" type="text" style="width: 80px;" value="0">';
	/////////////////
    $('table[class="list"]').first().before('<select id="filterByCountry">'+filterByCountry+'</select>');  
    $('table[class="list"]').first().before('<select id="filterByRegion">'+filterByRegion+'</select>');  
    $('table[class="list"]').first().before('<select id="filterByTown">'+filterByTown+'</select>');  
    $('table[class="list"]').first().before('<select id="filterByUnitType">'+filterByUnitType+'</select>'); 
    $('table[class="list"]').first().before('<select id="filterByUnitName">'+filterByUnitName+'</select>'); 
    $('table[class="list"]').first().before('<input id="filterByUnitNameRegExp"></input>'); 
	$('table[class="list"]:first > tbody > tr:nth-child(1) > th:nth-child(1)').html(svToggleForVisible + svInputQtyForActiveVisible);
	///////////////// 
	$('#toggleForVisible').change( function(){
		var qty = parseFloat($('#qtyForActiveVisible').val(),10) || 1;
		var newVal = $(this).is(':checked');
		//	console.log(newVal);
		$('input[type="checkbox"][id^="unit_"]:visible').each(function() {
			var o = $(this);
			if(newVal != $(this).is(':checked')){
				//$(this).click();
				o.attr('checked', newVal);
				var input = $('#'+ o.attr('id') +'_qty');
				input.attr('disabled', !o.is(':checked'));
				input.val(o.is(':checked') ? qty : 0);
			}
		});
		showresult($(this).form);
	});
	$('#qtyForActiveVisible').keyup( function(){
		var qty = parseFloat($(this).val(),10) || 1;
		//#unit_5616819_qty
		//console.log(qty);
		$('input[id$="_qty"]').each(function() {
			var input = $(this);
			//console.log(input.prev().val());
			//console.log(input.is(':visible'));
			if(!input.is(":disabled") && input.parent().parent().is(":visible")){
				input.val(qty);
			}
		});
		showresult($(this).form);
	});
	///////////////// 
	function filterRowBy(){
		$('table[class="list"]:first > tbody > tr[class]').each(function() {
			var tableRow = $(this);
			var hide = false;

			if(!hide){
				var search = $('#filterByCountry').val();
				var img = $('td:nth-child(2) > img', tableRow);
				var country = img.attr('title');
				if (search == '0' || country == search ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByRegion').val();
				var cell = $('td:nth-child(2)', tableRow);
				var first = cell.html().indexOf('&nbsp;') + 6;
				var second = cell.html().indexOf('<br>');
				var region = cell.html().substr(first, second - first);
				if (search == '0' || search == region ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByTown').val();
				var cell = $('td:nth-child(2) > b', tableRow);
				var town = cell.text();
				if (search == '0' || search == town) {
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByUnitType').val();
				var row = $('td:nth-child(3) > a:nth-child(2)', tableRow);
				var matches = row.text().match(/\(([^)]+)\)$/);
				if (search == '0' || row.text() == search || (matches != null && matches[1] == search) ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByUnitName').val();
				var title = $('td:nth-child(3) > a > img', tableRow).attr('title');
				if (search == '0' || title == search ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByUnitNameRegExp').val();
				var title = $('td:nth-child(3) > a > img', tableRow).attr('title');
				if (search == '' || new RegExp(search, 'gi').test(title)){
					hide = false;
				} else {
					hide = true;
				}
			}

			if (hide){
				tableRow.hide();
			} else {
				tableRow.show();
			}
		});
	}
	
	$('#filterByCountry').change( function(){
		filterRowBy();
	});
	$('#filterByRegion').change( function(){
		filterRowBy();
	});
	$('#filterByTown').change( function(){
		filterRowBy();
	});
	$('#filterByUnitType').change( function(){
		filterRowBy();
	});
	$('#filterByUnitName').change( function(){
		filterRowBy();
	});
	$('#filterByUnitNameRegExp').change( function(){
		filterRowBy();
	});
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}