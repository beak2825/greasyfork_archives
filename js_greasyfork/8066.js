// ==UserScript==
// @name           Link to Main Site Reviews
// @author         AstroCB
// @description  Adds a link to main site reviews from the Meta page
// @version        1.0
// @namespace  https://github.com/AstroCB
// @include        *://meta.stackoverflow.com/review
// @include        *://meta.*.stackexchange.com/review
// @include        *://meta.serverfault.com/review
// @include        *://meta.superuser.com/review
// @include        *://meta.askubuntu.com/review
// @downloadURL https://update.greasyfork.org/scripts/8066/Link%20to%20Main%20Site%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/8066/Link%20to%20Main%20Site%20Reviews.meta.js
// ==/UserScript==
var siteTitle = /Review - (?:Meta\s(.*)|(.*)\sMeta)/.exec(document.getElementsByTagName("title")[0].innerText);
if (siteTitle[1]) {
	siteTitle = siteTitle[1];
} else {
	siteTitle = siteTitle[2];
}
var siteURL = /meta.(.*)/.exec(window.location.href)[1];
var dashboardItem = '<div class="dashboard-item"><div class="dashboard-count"></div><div class="dashboard-summary"><div class="dashboard-title"><a href="//' + siteURL + '">Main Site Reviews</a></div><div class="dashboard-description">Visit the review queues on ' + siteTitle + '.</div></div><br class="cbt"></div>';

document.getElementsByClassName("review-dashboard-mainbar")[0].innerHTML += dashboardItem;