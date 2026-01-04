// ==UserScript==
// @name         Google Images - Restore Full Color Search
// @version      1.0.3
// @description  This brings back the option to filter for full color images, excluding black and white ones.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @include      *://*.google.*/search?*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555315/Google%20Images%20-%20Restore%20Full%20Color%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555315/Google%20Images%20-%20Restore%20Full%20Color%20Search.meta.js
// ==/UserScript==


waitForKeyElements ("div.vH6rvf.FJCJfd:has(a[href*='ic:trans'])", AddFullColorOption);

function AddFullColorOption ( jNode ) {

if (jNode.find("a:contains('Full Color')").length > 0) {return;}

var anyColorDiv = jNode.find("div.XhWQv:has(a:contains('Any color'))").first();
var transparentDiv = jNode.find("div.XhWQv:has(a[href*='ic:trans'])").first();

if (!anyColorDiv.length || !transparentDiv.length) {return;}

var fullColorDiv = transparentDiv.clone();
var fullColorLink = fullColorDiv.find('a');
fullColorLink.text('Full Color');
fullColorLink.attr('href', function (i, oldHref) {return oldHref.replace('ic:trans', 'ic:color');});

fullColorDiv.insertAfter(anyColorDiv);

if (window.location.href.includes('tbs=ic:color')) {
jNode.closest("[jsname='H9P06b']").prev().find("[jsname='ibnC6b']").text('Full Color');
fullColorDiv.addClass('Wf7Nsf');
anyColorDiv.removeClass('Wf7Nsf');}

var anyColorLink = anyColorDiv.find('a').first();
anyColorLink.on('click', function (e) {
if (window.location.href.includes('tbs=ic:color')) {
e.preventDefault();
var url = new URL(window.location.href);
url.searchParams.delete('tbs');
url.searchParams.set('tbas', '0');
window.location.href = url.toString();}});}