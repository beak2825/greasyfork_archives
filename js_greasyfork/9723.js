// ==UserScript==
// @name USDPrices
// @include     http://catalog.onliner.by/*
// @version 0.2
// @grant  none
// @description USD price for catalog.onliner.by
// @namespace https://greasyfork.org/users/11143
// @downloadURL https://update.greasyfork.org/scripts/9723/USDPrices.user.js
// @updateURL https://update.greasyfork.org/scripts/9723/USDPrices.meta.js
// ==/UserScript==

function convertPricesToUSD() {
	var $ = unsafeWindow.jQuery;
	var selector = [".b-offers-desc__info-price > .b-offers-desc__info-sub", ".b-offers-desc__info-price > .b-offers-desc__info-sub > a", ".price > .js-currency-primary"];
	$.ajax({
		dataType: "json",
		url: "http://catalog.onliner.by/sdapi/kurs/api/bestrate?currency=USD&type=nbrb"
	}).then(function (usd) {
		var USDExchangeRate = +usd.amount.replace(/\s+/g, "");
		$.each($(".pprice, .product-aside__price > .product-aside__price--primary"), function () {
			var node = $(this).hasClass("pprice_byr") ? this : this.firstChild;
			var prices = node.textContent.replace(/[\sруб.]/g, "").split("–");
			if (!$(this).hasClass("pprice_byr")) {
				$(node).after("<br /><span style=\"color:#999;font-size:10px;font-weight:normal;\">" + node.textContent + "</span>");
			} else {
				$(node).after(node.textContent + "<br />");
			}
			node.textContent = prices.map(function (value) { return "$" + Math.ceil((value/USDExchangeRate)*2)/2; }).join(" - ");
		});

		$.each($(selector.join(", ")), function () {
			var node = this.firstChild;
			if (!node.textContent.replace(/\s/g, "")) {
				return;
			}
			var prices = node.textContent.replace(/\s/g, "").split("–");
			$(this).find("small").attr("style", "color:#999;font-size:10px;font-weight:normal;");
			$(node).after("<br /><span style=\"color:#999;font-size:10px;font-weight:normal;\">" + node.textContent + "</span>");
			node.textContent = prices.map(function (value) { return "$" + Math.ceil((value/USDExchangeRate)*2)/2; }).join(" - ");
		});
	});
}
window.addEventListener("load", convertPricesToUSD);