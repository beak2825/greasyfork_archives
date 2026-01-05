// ==UserScript==
// @name        KAT - Feedback New Tab
// @namespace   FeedbackNewTab
// @version     1.02
// @description  Makes feedback load in current tab
// @match      http://kickass.to/*
// @match      https://kickass.to/*
// @downloadURL https://update.greasyfork.org/scripts/6525/KAT%20-%20Feedback%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/6525/KAT%20-%20Feedback%20New%20Tab.meta.js
// ==/UserScript==

$('a[href="/feedback/"]').click(function( event )
{
  window.open("/feedback/", "_self");
});