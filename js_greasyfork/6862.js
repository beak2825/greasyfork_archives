// ==UserScript==
// @name        CH Amazon ASIN Adder
// @author      clickhappier
// @namespace   clickhappier
// @description Display ASIN after product links in Amazon.com search results, and after the title on a product page; plus, the dash is a short product link. Note that Amazon often uses AJAX to change search page content without reloading the new URL, in which case you won't see this script's ASINs on the new results; simply hit Refresh/F5 when this happens, and then the ASINs should appear.
// @version     1.0.1c
// @include     http://www.amazon.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/6862/CH%20Amazon%20ASIN%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/6862/CH%20Amazon%20ASIN%20Adder.meta.js
// ==/UserScript==


// adapted from https://greasyfork.org/en/scripts/3908-shorten-amazon-product-links-google-chrome-compatible/
// and https://greasyfork.org/en/scripts/6205-mturk-auto-accept-changer-for-mturkgrind-com/


// create :childof selector - from http://andreasnylin.com/blog/2011/09/jquery-not-child-of/
$.expr[':'].childof = function(obj, index, meta, stack){
    return $(obj).parent().is(meta[3]);
};

function getASIN(href) {
  var asinMatch;
  asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
  if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
  if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
  if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
  if (!asinMatch) { return null; }
  return asinMatch[1];
}

// add ASIN after most absolute product links that aren't an image, price, or Other Colors link
$('a[href*="www.amazon.com/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '">&ndash;</a> <span style="font-size:70%;color:rgb(130, 130, 130)">' + asin + '</span>');
	}
});

// add ASIN after most relative product links that aren't an image, price, Other Colors, Try Prime, or Buy Kindle link
$('a[href^="/gp/product/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').not('a.nav-prime-try').not('a.nav-link-prime').not(':contains("Buy a Kindle")').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if ( (asin != null) && (asin != 'B00DBYBNEE') )  {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '">&ndash;</a> <span style="font-size:70%;color:rgb(130, 130, 130)">' + asin + '</span>');
	}
});

// add ASIN after top-of-page product title on individual product pages
$('span#productTitle').each(function(){
	var asin = getASIN( document.location.href );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '" style="text-decoration:none;">&ndash;</a> <span style="font-size:70%;color:rgb(170, 170, 170)">' + asin + '</span>');
	}
});
$('span#btAsinTitle').each(function(){
	var asin = getASIN( document.location.href );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '" style="text-decoration:none;">&ndash;</a> <span style="font-size:70%;color:rgb(170, 170, 170)">' + asin + '</span>');
	}
});

// add ASIN after relative product links in carousels (first page only) on individual product pages
$('li.a-carousel-card > div.a-section > a.a-link-normal').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '">&ndash;</a> <span style="font-size:70%;color:rgb(130, 130, 130)">' + asin + '</span>');
	}
});

// add ASIN after relative product links in 'after viewing this item' at bottom of individual product pages
$('div.asinDetails > a').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '">&ndash;</a> <span style="font-size:70%;color:rgb(130, 130, 130)">' + asin + '</span>');
	}
});

// add ASIN after relative product links in 'more to explore' on bestsellers pages
$('div.zg_more_item > a').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com/dp/' + asin + '">&ndash;</a> <span style="font-size:70%;color:rgb(130, 130, 130)">' + asin + '</span>');
	}
});
