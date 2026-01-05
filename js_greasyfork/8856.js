// ==UserScript==
// @name         look com ua pages
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @include      *look.com.ua/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8856/look%20com%20ua%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/8856/look%20com%20ua%20pages.meta.js
// ==/UserScript==
$( ".newnavigation" ).clone().appendTo( "#news_set_sort" );