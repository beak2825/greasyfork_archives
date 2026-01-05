// ==UserScript==
// @name       Add KCLS links to Goodreads
// @namespace  http://use.i.E.your.homepage/
// @version    1.02
// @description  Puts links in Goodreads lists that go directly to a search at the King County Library System
// @match      http*://www.goodreads.com/review/list/*
// @copyright  2014, Shayne Holmes
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @author Shayne Holmes
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/7052/Add%20KCLS%20links%20to%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/7052/Add%20KCLS%20links%20to%20Goodreads.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$("th.title").after(function(){ return $(this).clone().removeClass('title').addClass('kcls').html('<div style="margin: auto 10px;">kcls</div>');});

waitForKeyElements ("td.field.title", addkclslinks);

function addkclslinks(jNode) { jNode.after(
    function(){ return $(this).clone().removeClass('title').addClass('kcls')
    .html("<div style='margin: auto 10px;'><a title='search on KCLS' href=http://kcls.bibliocommons.com/search?t=smart&search_category=keyword&q="
    + encodeURIComponent(this.innerText) 
    + "&commit=Search>kcls</a></div></td>");}
); }

