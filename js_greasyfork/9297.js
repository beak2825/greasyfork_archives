// ==UserScript==
// @name        Virtonomica: транспонированный грид розничного менеджера закупок для магазинов
// @description Вместо одного товара в строке делает один товар в столбце, т.е. все товары одной строкой для каждого магазина
// @author  cobra3125
// @version 3.0
// @grant   none
// @include http*://*virtonomic*.*/*/main/company/view/*/unit_list/shop
// @namespace https://greasyfork.org/users/10017
// @downloadURL https://update.greasyfork.org/scripts/9297/Virtonomica%3A%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B3%D1%80%D0%B8%D0%B4%20%D1%80%D0%BE%D0%B7%D0%BD%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BE%D0%BA%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/9297/Virtonomica%3A%20%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B3%D1%80%D0%B8%D0%B4%20%D1%80%D0%BE%D0%B7%D0%BD%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%D0%B0%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BE%D0%BA%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	function getVal(spName){
		return JSON.parse(window.localStorage.getItem(spName));
	}
	function setVal(spName, pValue){
		window.localStorage.setItem(spName,JSON.stringify(pValue));
	}
	//резделитель разрядов
	function commaSeparateNumber(spNum){
		while (/(\d+)(\d{3})/.test(spNum.toString())){
			spNum = spNum.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
		}
		return spNum;
	}
	function getRealm(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\/company\/view\//);
		return matches[1];
	}
	function updateMarketVolumeOnLinks(productID, arr){
		if(arr == null) return;
		
    	$('a[class="global_report_link"]').each(function () {
			var link = $(this);
			var parts = link.attr('href').split('/');
			var svProductID = parts[parts.length - 4];
			var svTownID = parts[parts.length - 1];
			if(svProductID == productID){
				link.text(commaSeparateNumber(arr[svTownID]));
			}
    	});
	}
	function loadMrketVolumeForProduct(productID, callback){
		var realm = getRealm();
		//var storageName = realm+'_tradeAtCity_'+productID;
		//if(getVal(storageName) != null) return;
		
		var url = 'https://cobr123.github.io/by_trade_at_cities/'+realm+'/tradeAtCity_'+productID+'.json';
		//console.log("loadMrketVolumeForProduct '"+ url+"'" );
		$.getJSON(url, function (data) {
			var arr = new Array();
			$.each(data, function (key, val) {
				if(val.pi == productID){
					arr[val.ti] = val.v;
				}
			});

			//setVal(storageName, arr);
			if(callback != null) { callback(productID, arr); }
		});
	}
	function toFloat(spNum){
		if(spNum == null || spNum == '' || spNum == '---') return 0;
		return parseFloat(spNum.replace('$','').replace(/\s+/g,''), 10);
	}

    function getidUnit(spStr) {
        //console.log("'"+ spStr+"'" );
        var first = spStr.indexOf('_');
        var idvUnit = spStr.substr(1, first-1);

        return idvUnit;
    }

    var oavUnits = new Array();

    function addShop(idpUnit, opLink, spHtml, spTitle, spClass) {
        //console.log("'"+ spHtml+"'" );
        oavUnits[idpUnit] = {
            oUnit:  {
				 oLink: opLink
                ,sHtml: spHtml
                ,sTitle: spTitle
                ,sClass: spClass
            },
            aGds: new Array()
        };
    }

    function addGds(idpUnit, opSupplyGdsLink, opGlobalReportLink, spProductHistoryLink, spQtySold, opQtyOrderInput, spQtyOrderOld, spQtyExist, spPrcBuy, spPrcSell) {
        oavUnits[idpUnit].aGds.push({
            oSupplyGdsLink:  opSupplyGdsLink,
            oGlobalReportLink:  opGlobalReportLink,
            sProductHistoryLink:   spProductHistoryLink,
            sQtySold:  spQtySold,
            oQtyOrderInput:  opQtyOrderInput,
            sQtyOrderOld:  spQtyOrderOld,
            sQtyExist:  spQtyExist,
            sPrcBuy:  spPrcBuy,
            sPrcSell:  spPrcSell
        });
    }

    function getSubRow(opLeft, opRight) {
        var subRow = $('<tr>');
        var subCellLeft = $('<td nowrap="">').append(opLeft);
        var subCellRight = $('<td align="right" nowrap="">').append(opRight);
        subRow.append(subCellLeft);
        subRow.append(subCellRight);
        return subRow;
    }
	var bvFullView = $('input#fullview').is(':checked');

    $('tbody#mainTable > tr').each(function () {
        var id = $(this).attr('id');
        if(id != undefined) {
            var idvUnit = getidUnit(id);
            var ovUnit = $(this).children('td').eq(0);
            if(ovUnit.text() != ''){
                var ovLink = ovUnit.children('a').eq(0);
				//console.log(ovLink.attr('href') );
                /*var svName = ovLink.text();
                var svLink = ovLink.attr('href');*/
                var svTitle = ovUnit.attr('title');
                var svClass = ovUnit.attr('class');
                addShop(idvUnit, ovLink, ovUnit.html(), svTitle, svClass);
            }
            var ovSupplyGdsLink = $(this).children('td').eq(1).children('a').eq(0);
            var ovGlobalReportLink = $(this).children('td').eq(1).children('a').eq(1);
            var svProductHistoryLink = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(0).children('a').eq(0).attr('href');
            var svQtySold = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(0).children('td').eq(1).text();
            var ovQtyOrderInput = $(this).children('td').eq(4).children('table').eq(0).children('tbody').eq(0).children('tr').eq(1).children('td').eq(0).children('input').eq(0);
			var nvQtyExistRow = (bvFullView) ? 4 : 3;
            var svQtyOrderOld = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(nvQtyExistRow - 1).children('td').eq(1).text();
            var svQtyExist = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(nvQtyExistRow).children('td').eq(1).text();
            var svPrcBuy = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(6).children('td').eq(1).text();
            var svPrcSell = $(this).children('td').eq(3).children('table').eq(0).children('tbody').eq(0).children('tr').eq(1).children('td').eq(1).text();
            //console.log("'"+ svPrcSell+"'" );
            addGds(idvUnit, ovSupplyGdsLink, ovGlobalReportLink, svProductHistoryLink, svQtySold, ovQtyOrderInput, svQtyOrderOld, svQtyExist, svPrcBuy, svPrcSell);
        }
    });
    $('table[class="list"]').hide();

    var newTable = $('<table class="list" id="newMainTable">');
    var tbody =  $('<tbody id="newMainTableTbody">');
    newTable.append(tbody);
    $("table.list").before(newTable);
    var paging = $('table[class="paging"]');
    $("table.list").eq(1).before(paging);
    
    var tbody =  $('tbody#newMainTableTbody');

    oavUnits.forEach(function(entry) {
        var svOddEven = 'even';
        var cell = $('<td align="center" title="'+ entry.oUnit.sTitle +'">');// class="'+ entry.oUnit.sClass +'"
        cell.append(entry.oUnit.sHtml);
        var row = $('<tr class="'+svOddEven+'" onmouseover="this.className = \'selected\'" onmouseout="this.className = \''+svOddEven+'\'">');
        row.append(cell);

        entry.aGds.forEach(function(gds) {
            cell = $('<td align="center">');
            var subTable = $('<table cellpadding="0" cellspacing="0" width="100%">');
            var subTBody = $('<tbody>');

            var ovSupplyLink = $('<a>').attr('href', gds.sProductHistoryLink)
            .attr('target', '_blank')
            .attr('onclick', 'return doWindow(this, 800, 600);')
            .attr('title', 'Объем продаж')
            .text(gds.sQtySold);
			var parts = gds.oGlobalReportLink.attr('href').split('/');
			var townID = parts[parts.length - 1];
			var productID = parts[parts.length - 4];
            var ovGlobalReportLink = $('<a>').attr('href', gds.oGlobalReportLink.attr('href'))
            .attr('id', 'grl_'+townID+'_'+productID)
            .attr('class', 'global_report_link')
            .attr('target', '_blank')
            .attr('onclick', 'return doWindow(this, 1000, 900);')
            .attr('title', 'Объем рынка')
            .text('?.? шт.');
            subTBody.append($('<tr>').append($('<td align="right" nowrap="">').append(gds.oSupplyGdsLink)));
            subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="Объем продаж">').append(ovSupplyLink)));
            subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="Объем закупок">').append(gds.oQtyOrderInput))); 
            subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="На складе">').append(gds.sQtyExist)));
            subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="Доля рынка">').append(ovGlobalReportLink)));
            if(bvFullView) { subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="Закупочная цена">').append(gds.sPrcBuy))); }
            subTBody.append($('<tr>').append($('<td align="right" nowrap="" title="Цена продажи">').append(gds.sPrcSell)));

            subTable.append(subTBody);
            cell.append(subTable);
            row.append(cell);
        });
        tbody.append(row);
        if(svOddEven == 'even'){
            svOddEven = 'odd';
        }else{
            svOddEven = 'even';
        }
    });
	var div_style= "style='float:left;border-radius:4px 4px 4px 4px; padding:8px; box-shadow:0 1px 3px 0 #999999; cursor:pointer; background:#DDD; text-align: center;margin-left:12px'";
	var divAdjust = '<div id="adjust_delivery" '+ div_style +'>Откорректировать поставки</div>';
	var divLoadGmData = '<div id="load_global_market_data" '+ div_style +'>Загрузить данные об объеме рынков</div>';
	var divIncrease = '<div id="shop_list_for_price_increase"></div>';
	$("table.list").before("<div id=s_toolbar style='border: 1px double #0184D0;border-radius:4px 4px 4px 4px;height:34px;width:100%'></div>");
	$("#s_toolbar").append(divLoadGmData).append(divAdjust)
	$("table.list").before(divIncrease);

	$("#load_global_market_data").click(function(){
		var loadedProducts = [];
    	$('a[class="global_report_link"]').each(function () {
			var link = $(this);
			if(link.text().indexOf('?') >= 0){
				var parts = link.attr('href').split('/');
				var productID = parts[parts.length - 4];
				if(loadedProducts[productID] == null){
					loadMrketVolumeForProduct(productID, updateMarketVolumeOnLinks);
					loadedProducts[productID] = 1;
				}
			}
    	});
	});
	
	$("#adjust_delivery").click(function(){
		var nvNewVal;
		$("#shop_list_for_price_increase").html('');
		
		var tableIncrease = $('<table border=0>');
    	oavUnits.forEach(function(entry) {
			var rowIncrease = $('<tr>');
			var bvShowRow = 0;
        	entry.aGds.forEach(function(gds) {
				var parts = gds.oGlobalReportLink.attr('href').split('/');
				var townID = parts[parts.length - 1];
				var productID = parts[parts.length - 4];
				var nvQtySold = toFloat(gds.sQtySold);
				var nvQtyExist = toFloat(gds.sQtyExist);
				var nvOldVal = toFloat(gds.sQtyOrderOld);
				var marketVolume = toFloat($('#grl_'+townID+'_'+productID).text());
				//console.log(marketVolume);
				//если продается больше, чем осталось на складе
				if (nvQtySold > 0 && nvQtySold * 1.2 >= nvQtyExist){
					//продано +20% 
				  	nvNewVal = Math.round(nvQtySold * 1.2);
					//console.log('продано +20%');
				}
				//если склад не пустой, нет продаж и закуплено = на_складе
				else if (nvQtySold == 0 && nvQtyExist > 0 && nvOldVal == nvQtyExist){
				  	nvNewVal = nvOldVal;
					//console.log('если пустой склад и нет продаж');
				} 
				//если склад не пустой, есть продажи и закуплено = на_складе
				else if (nvQtySold > 0 && nvQtyExist > 0 && nvOldVal == nvQtyExist){
				  	nvNewVal = nvOldVal;
					//console.log('если пустой склад и нет продаж');
				} 
				//если запаса хватит на 3 дня продаж
				else if(nvQtySold > 0 && nvQtyExist > 0 && nvQtyExist / 3 >= nvQtySold * 1.2){
				  	nvNewVal = 0;
					//console.log('если запаса хватит на 3 дня продаж');
				}
				//если пустой склад и нет продаж
				else if (nvQtySold == 0 && nvQtyExist == 0){
					//3% рынка
				  	nvNewVal = Math.max(Math.round(marketVolume * 0.03 ), 10);
					//console.log('если пустой склад и нет продаж');
				} 
				//если склад не пустой и нет продаж
				else if (nvQtySold == 0 && nvQtyExist > 0){
				  	nvNewVal = 0;
					//console.log('если пустой склад и нет продаж');
				} 
				//в остальных случаях
				else {
				  	nvNewVal = Math.abs(Math.round((nvQtySold * 2 * 1.2 - nvQtyExist) / 2));
					//console.log('в остальных случаях');
				}
				$('#' + gds.oQtyOrderInput.attr('id')).val(nvNewVal);
				
				var svTradHallHref = entry.oUnit.oLink.attr('href').replace('/supply','/trading_hall');
				var ovProductImg = $('img', gds.oSupplyGdsLink);
				var svProductTitle = ovProductImg.attr('title');
				var svProductImgSrc = ovProductImg.attr('src');
				var div = $('<div>').attr('style','z-index: 11; position: relative; top: 0px;');
				var divBG = $('<div>').attr('style',"width: 32px; height: 32px; background: url('"+svProductImgSrc+"'); opacity: 0.6; top: 0px; z-index: 1;position: relative;");
				var td = $('<td>').attr('style','text-align:center; vertical-align:bottom;');
				//console.log(svTradHallHref);
				//если занято больше 12% рынка, надо увеличить цену продажи
				//console.log(toFloat(gds.sQtySold) +' >= '+Math.round(toFloat($('#grl_'+townID+'_'+productID).text()) * 0.12) );
				if (nvQtySold == 0){
					var ovLink = $('<a>').attr('href', svTradHallHref)
					.attr('target', '_blank')
					.attr('title', 'если товар не продается, надо уменьшить цену продажи, если она еще не равна себестоимости')
					.attr('style','font-weight: bold;')
					.text('0');
					
					//divBG.append(ovLink);
					div.append(ovLink.clone());
					td.append(div);
					td.append(divBG);
					rowIncrease.append(td);
					bvShowRow = 1;
				//если товар не продается, надо уменьшить цену продажи, если она еще не равна себестоимости
				} else if (nvQtySold >= Math.round(marketVolume * 0.12) ){
					bvShowRow = 1;
					var perc = (nvQtySold / marketVolume * 100).toFixed(2);
					var ovLink = $('<a>').attr('href', svTradHallHref)
					.attr('target', '_blank')
					.attr('title', 'если занято больше 12% рынка, надо увеличить цену продажи')
					.attr('style','font-weight: bold;')
					.text(Math.round(perc)+'%');
					
					//divBG.append(ovLink);
					div.append(ovLink.clone());
					td.append(div);
					td.append(divBG);
					rowIncrease.append(td);
				}
    		});
			if(bvShowRow == 1){
				tableIncrease.append(rowIncrease);
			}
    	});
		$("#shop_list_for_price_increase").append(tableIncrease);
	});
};

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 