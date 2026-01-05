// ==UserScript==
// @name        CH Zing Receipt Scrollbars
// @author      clickhappier
// @namespace   clickhappier
// @description Add separate scrollbars to be able to see all of long receipts and questions side-by-side.
// @include     https://backend.ibotta.com/receipt_moderation/*
// @version     1.2c
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/6334/CH%20Zing%20Receipt%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/6334/CH%20Zing%20Receipt%20Scrollbars.meta.js
// ==/UserScript==


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle('html, body, div#main, div.container, div.content, div.row, div.span6, div.span12, div.container-fluid, div.row-fluid { height: 100%; }');  // needed for relative heights of the below elements to work
addGlobalStyle('div.span6.receipt_images { height: 95% ! important;  float: right ! important;  overflow: scroll; }');
addGlobalStyle('form.edit_receipt_moderation { height: 95% ! important;  float: left ! important;  overflow: scroll; }');
addGlobalStyle('select { padding: 1px ! important; }');  // make text in drop-down list boxes fully readable


// auto-scroll to top of receipts form area - from http://www.abeautifulsite.net/smoothly-scroll-to-an-element-without-a-jquery-plugin-2/
$('html, body').animate( { scrollTop: $(".row-fluid").offset().top }, 250 );  // milliseconds delay

