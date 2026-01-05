// ==UserScript==
// @name        Automatic Clothing Sales Calculator
// @description Detect and calculate the final price for extra sale clothing items
// @namespace   https://github.com/hkmix/
// @include     http*://www.jcrew.com/*
// @include     http://bananarepublic.gap.com/browse/*
// @version     0.12a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7570/Automatic%20Clothing%20Sales%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/7570/Automatic%20Clothing%20Sales%20Calculator.meta.js
// ==/UserScript==

// SET-UP
// modify as needed; note discounts are automatically detected
var tax = 13;

// MAIN SCRIPT,
// do not modify unless you know what you're doing
var discount;

function bananarepublic() {
  var global_text = document.querySelectorAll("a.headlineBannerLink");
  if (global_text.length > 0) {
    var match = global_text.item(0).innerHTML.match(/Extra(\d+)/);
    if (match.length > 0) discount = match[1];
  }
  else return;
  var spans = document.querySelectorAll("span.priceDisplaySale, span.salePrice");
  if (spans.length == 0) return;
  for(var i = 0; i < spans.length; ++i) {
    var cur_item = spans.item(i);
    var cur_text = cur_item.innerHTML.split("$");
    var new_price = cur_text[1] * (1 - discount / 100) * (100 + tax) / 100;
    if (i == 0) cur_item.innerHTML = '<div id="count_placeholder"></div>' + cur_item.innerHTML;
    cur_item.innerHTML = '<s>' + cur_item.innerHTML + '</s><br><b>$' + new_price.toFixed(2) + '</b> (' + discount + '% off, ' + tax + '% tax)';
  }
}

function jcrew() {
  var global_text = document.querySelectorAll("span.global-header-text");
  if (global_text.length > 0) {
    var match = global_text.item(0).innerHTML.match(/extra (\d+)%/);
    if (match.length > 0) discount = match[1];
  }
  else return;
  var spans = document.querySelectorAll("span.product-sale-price, span.selected-color-price");
  if (spans.length == 0) return;
  for(var i = 0; i < spans.length; ++i) {
    var cur_item = spans.item(i);
    var cur_text = cur_item.innerHTML.split(" ");
    var new_price = cur_text[1] * (1 - discount / 100) * (100 + tax) / 100;
    if (i == 0) cur_item.innerHTML = '<div id="count_placeholder"></div>' + cur_item.innerHTML;
    cur_item.innerHTML = '<s>' + cur_item.innerHTML + '</s><br>final <b>' + cur_text[0] + ' ' + new_price.toFixed(2) + '</b> (' + discount + '% off, ' + tax + '% tax)';
  }
}

function main() {
  if (/jcrew/.test(self.location.href)) jcrew();
  else if (/bananarepublic/.test(self.location.href)) bananarepublic();
}

window.setInterval(function () {
  if (document.querySelectorAll("#count_placeholder").length == 0) main();
}, 2000);