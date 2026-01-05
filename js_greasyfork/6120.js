// ==UserScript==
// @name        eBay Collection Sorter
// @namespace   http://www.facebook.com/Tophness
// @description Sorts Collections on eBay
// @include     http://*ebay.tld/cln/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6120/eBay%20Collection%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/6120/eBay%20Collection%20Sorter.meta.js
// ==/UserScript==

var prevY = 0;
windowscroll = setInterval(doscroll, 800);
function doscroll() {
	if (window.scrollMaxY !== prevY) {
		prevY = window.scrollMaxY;
		window.scrollTo(0, window.scrollMaxY);
	} else {
		clearInterval(windowscroll);
		window.scrollTo(0, 0);
		doSort();
	}
}

function doSort() {
	var prices = new Array();
	var items = document.getElementsByClassName('collection-gallery')[0].childNodes;
	for (var i = 0; i < items.length; ++i) {
		if (items[i].tagName == 'DIV') {
			var nitems = items[i].getElementsByTagName('div');
			for (var j = 0; j < nitems.length; ++j) {
				if (nitems[j].className == 'itemPrice') {
					if (nitems[j].textContent.indexOf('$') != -1) {
						var price = nitems[j].textContent.substring(nitems[j].textContent.indexOf('$') + 1);
						prices.push({
							price : price,
							el : items[i]
						});
					}
				}
			}
		}
	}

	prices.sort(function (a, b) {
		return a.price - b.price;
	});

	for (var ni = 0; ni < items.length; ++ni) {
		if (items[ni].tagName == 'DIV') {
			document.getElementsByClassName('collection-gallery')[0].removeChild(items[ni]);
		}
	}

	for (var nj = 0; nj < prices.length; nj++) {
		document.getElementsByClassName('collection-gallery')[0].appendChild(prices[nj].el);
	}
}
