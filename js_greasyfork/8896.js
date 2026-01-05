// ==UserScript==
// @name        [wod]耗材单价
// @namespace   lgg
// @description 够买耗材比较生成单价，省钱利器。
// @include     http://*.world-of-dungeons.org/wod/spiel/trade/trade.php*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8896/%5Bwod%5D%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/8896/%5Bwod%5D%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7.meta.js
// ==/UserScript==
// console.log('start1');
//* constants
var goldStr = '<img alt="" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币" border="0">';
var PRICE_ATTRI_NAME = 'lggAvPrice';
var PRICE_UNAVAILABLE = 'lggBadPrice';
var CLASS_ROW = 'row';

//* global vars
var tblBody = findTBodyElement();
var tblRowList = new Array();
var sortBtnElement;

//* main
for (var i = 0; i < tblBody.rows.length; i++)
{
	row_i = tblBody.rows[i];
	var pricePU = genAveragePriceForConsumableGoods(row_i);
	row_i.setAttribute(PRICE_ATTRI_NAME,pricePU);
	tblRowList.push(row_i);
}

addSortBtn();
// sortRowByAveragePrice(tblRowList);


//* 找到商品列表table的<tbody>标签
function findTBodyElement () {
	var tableList = document.getElementsByClassName('content_table');
	var saleTable = tableList[0];
	var tableBodyList = saleTable.children;
	var tblBody;
	for (var i = tableBodyList.length - 1; i >= 0; i--) {
		if (tableBodyList[i].tagName == 'TBODY') {
			tblBody = tableBodyList[i];
		}
	};
	return tblBody;
}

//* 给定某行物品<tr>，找到对应的耗材单价以及总价，插入平均价格，返回插入的平均价格
function genAveragePriceForConsumableGoods (trElement) {
	col_item = row_i.cells[1];
	col_price = row_i.cells[3];
	var itemCountStr = col_item.innerHTML.match(/\(\d+\/\d+\)/);
	itemCountStr = itemCountStr + '';
	if (itemCountStr != 'null') {
		var itemCounts = itemCountStr.match(/\d+/);
		var itemPrice = col_price.textContent.match(/\d+/);
		if(!itemPrice){
			return PRICE_UNAVAILABLE;
		}
		var itemPricePerUse = parseFloat(itemPrice + '') / parseFloat(itemCounts + '');
		itemPricePerUse = itemPricePerUse.toFixed(4);
		// console.log('数量:' + itemCounts + ', 单价:' + itemPricePerUse + '/u');
		col_price.innerHTML = itemPricePerUse + goldStr + '/u &nbsp&nbsp&nbsp' + col_price.innerHTML;
		return itemPricePerUse;
	} else {
		return PRICE_UNAVAILABLE;
	}
	
}

//* 排序，两个row是<tr>，并且已经插入了PRICE_ATTRI_NAME属性
function rowCompare (row1,row2) {

	var p1 = row1.getAttribute(PRICE_ATTRI_NAME);
	var p2 = row2.getAttribute(PRICE_ATTRI_NAME);
	if(p1==PRICE_UNAVAILABLE && p2==PRICE_UNAVAILABLE){
		return 0;
	} else if(p1==PRICE_UNAVAILABLE){
		return -1;
	} else if(p2==PRICE_UNAVAILABLE){
		return 1;
	}

	p1 = parseFloat(p1);
	p2 = parseFloat(p2);

	return p1 - p2;
}

function sortRowByAveragePrice () {
	//* 排序，重新输出
	tblRowList.sort(rowCompare);
	while (tblBody.hasChildNodes()) {
		tblBody.removeChild(tblBody.lastChild);
	}
	for (var i = 0; i<tblRowList.length;i++){
		var suffixStr = i & 1;
		tblRowList[i].setAttribute('class',CLASS_ROW+suffixStr);
		tblBody.appendChild(tblRowList[i]);
	};
}

function addSortBtn () {
	var tableList = document.getElementsByClassName('content_table');
	var saleTable = tableList[0];
	var tableBodyList = saleTable.children;

	var tblHead;
	for (var i = tableBodyList.length - 1; i >= 0; i--) {
		if (tableBodyList[i].tagName == 'THEAD') {
			tblHead = tableBodyList[i];
		}
	};

	var header;
	for(var i = 0;i<tblHead.children.length;i++){
		var tmp = tblHead.children[i];
		if(tmp.className=='header'){//* 这里大小写敏感
			header = tmp;
		}
	}

	var thEl = header.children[3];
	var sortBtn = document.createElement('input');
	sortBtn.setAttribute('class','button clickable');
	sortBtn.setAttribute('type','button');
	sortBtn.setAttribute('value','单价排序');
	sortBtn.addEventListener('click', function(){
		sortRowByAveragePrice();
		sortBtn.setAttribute('class','button_disabled');
		sortBtn.setAttribute('disabled','disabled');
	});
	thEl.appendChild(sortBtn);
}
// ㄟ( ▔, ▔ )ㄏ 版本有待完善
