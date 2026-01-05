// ==UserScript==
// @name        One Long Thread
// @namespace   xenAllInOneThread
// @description Show up to 5 thread pages at a time on one page.
// @include     http://www.readytogo.net/smb/threads/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/751/One%20Long%20Thread.user.js
// @updateURL https://update.greasyfork.org/scripts/751/One%20Long%20Thread.meta.js
// ==/UserScript==

function pages(pSel) {
	var numOfPages = document.getElementsByClassName('pageNavHeader');
	var getPageRange = /Page (\d*) of (\d*)/i;
	var pageRange = getPageRange.exec(numOfPages[0].innerHTML);
	var pages = pageRange[1] + "/" + pageRange[2];
	if (pSel == 'current') {
		return pageRange[1];
	}
	if (pSel == 'last') {
		return pageRange[2];
	}
	if (pSel == 'next') {
		var next = parseInt(pageRange[1]) + parseInt('1'); return next
	}
}

var nextPageNum = pages('next');
console.log('next num '+nextPageNum);
var lastPageNum = pages('last');
console.log('last num '+lastPageNum);

var normPageLimit = nextPageNum + 3;
console.log('normal max num '+normPageLimit);
if (normPageLimit > lastPageNum) {
	var maxPageNum = lastPageNum;
} else {
	maxPageNum = normPageLimit;
}
console.log('actual max num '+maxPageNum);

function pageURLCleaned() {

	currURLLoc = document.URL.lastIndexOf('/');
	var urlWithOutPage = document.URL.substr(0, currURLLoc);

return urlWithOutPage
}

function getOtherPageContent(num) {
	var getURL = pageURLCleaned()+"/page-"+num+" #messageList";

	console.log('get next page');
	console.log(getURL);


	$( "<div>" ).load( getURL, function() {
		console.log("done "+getURL);
		$("#messageList").append("<div style=\"padding: 1%; font-size: 15px\" align=\"center\"><b>Posts loaded below are from page "+num+"</b></div>");
		$("#messageList").append($(this).find("#messageList").html());

			if (num < maxPageNum) {
				getOtherPageContent(parseInt(num)+1);
			}

	} );


}

function startLoading() {

	if (nextPageNum > lastPageNum) { return; }

	getOtherPageContent(nextPageNum);

	var nextLotOfPages = parseInt(maxPageNum) + 1;

	if (nextLotOfPages <=  lastPageNum) {
	var pageNavDivs = document.getElementsByClassName('PageNav');
	var secondNavBar = pageNavDivs[1];
	console.log(secondNavBar);
	var newNavHTML = "<br /><div style=\"padding: 1%; font-size: 15px\" align=\"center\"><a style=\"float: none !important;\" class=\"text\" href=\""+pageURLCleaned()+"/page-"+nextLotOfPages+"\"><b>Next page for extra posts is "+nextLotOfPages+"  &gt;</a></b></div>";
	$(secondNavBar).append(newNavHTML);
	}
}
// SEB
startLoading();